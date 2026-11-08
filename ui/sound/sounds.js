// The sounds (docs/sound/PLAN.md, build 1): a short sound for a moment the screen already shows (a thing picked up or put down,
// eaten or drunk, a hurt, a heal, a condition starting or ending, a door, a lid, a puzzle solved), each made of the music's own kinds
// (ui/sound/synth.js, `note`) in the world's key and mode. Plain functions of the kit and a destination: no globals, no knowledge
// of the game. They are told what to play in plain terms, `{ kind, material, weight }` (ui/sound.js, soundsOf, reads the moment), and
// a key, `{ root, steps }` (the world's music's, js/music.js; or the spec's `sounds.key`). Every number is the spec's
// (content/music.js, `sounds`: one table, `moments`, from a kind to its notes). Any randomness is the synth's, never the game's.
//
//   planOf(list, key, S) → [{ kind, inst, f, toF, t, dur, share }]   what plays, as numbers: t from the first sound's start (no audio)
//   playSounds(kit, dest, list, key, t0)                              the plan made sound, from audio time t0

import { freqOf } from "../../js/music.js";
import { note, filt } from "./synth.js";

// A material's instrument: the spec's, or the generic one for none or a word it doesn't have.
export const materialOf = (name, S) => S.sounds.materials[name] ?? S.sounds.materials.generic;

// The notes of each sound in a moment, in its order, `spacing` apart, at most `most`. A kind the table doesn't have plays nothing.
export function planOf(list, key, S) {
  const O = S.sounds, out = [], pitch = (step, octave) => freqOf(key, step, octave);
  list.slice(0, O.most).forEach((s, k) => {
    const notes = O.moments[s.kind];
    if (!notes) return;
    const m = materialOf(s.material, S);
    const W = O.weight, weight = s.kind === "hurt" ? W.base + W.per * (Math.min(W.most, Math.max(1, s.weight ?? 1)) - 1) : 1;
    for (const n of notes) {
      const own = n.play === "material", voice = own ? m : O.voices[n.play];
      if (!voice) continue;
      const inst = !own && voice.as?.[s.material] ? { ...voice, ...voice.as[s.material] } : voice;   // a voice's shape for this material
      const octave = own ? m.octave + (n.shift ?? 0) : n.octave ?? 4;
      out.push({ kind: s.kind, inst, f: pitch(n.step, octave), toF: n.to !== undefined ? pitch(n.to, octave) : undefined,
                 t: k * O.spacing + (n.at ?? 0), dur: n.length ?? inst.length ?? O.length,
                 share: (inst.level ?? 1) * (n.level ?? 1) * weight });
    }
  });
  return out;
}

// The plan made sound, on `dest`, from audio time t0.
// Steady: the music's shared pitch (unwell, the wobble: kit.pitch) is the music's, not theirs.
export function playSounds(kit, dest, list, key, t0) {
  const steady = { ...kit, pitch: null };
  for (const p of planOf(list, key, kit.S)) {
    const own = EFFECTS[p.inst.kind];
    if (own) own(kit, dest, p.inst, p.f, t0 + p.t, p.dur, p.share, p.toF);
    else note(steady, dest, p.inst, p.f, t0 + p.t, p.dur, p.share, { toF: p.toF });
  }
}

// ---- The sounds' own kinds (not the music's): a wooden knock, a body blow, a hinge's creak --------------------------------------
// Each: (kit, dest, inst, f, t, dur, share, toF). Their numbers are the spec's (`sounds.kinds`), their randomness the player's.
// Small speakers (a phone's, a laptop's) play little under 300 Hz, so each has its weight in the middle, where they do.
const EFFECTS = { tock, thump, creak };

// A decaying sine from `from` to `f` (over `glide`), `tc` its fall.
function ring(ctx, out, f, t, level, tc, from = f, glide = 0.02, type = "sine") {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type;
  o.frequency.setValueAtTime(from, t); if (from !== f) o.frequency.exponentialRampToValueAtTime(f, t + glide);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.002); g.gain.setTargetAtTime(0, t + 0.003, tc);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + tc * 8 + 0.05);
}
// A short burst of noise through a filter.
function hiss(kit, out, type, freq, q, t, level, tc, buf = kit.noise.white) {
  const { ctx } = kit, s = ctx.createBufferSource(), b = filt(ctx, type, freq, q), g = ctx.createGain(); s.buffer = buf;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.001); g.gain.setTargetAtTime(0, t + 0.002, tc);
  s.connect(b); b.connect(g); g.connect(out); s.start(t, Math.random() * 3); s.stop(t + tc * 8 + 0.05);
}
// Each sound's own gain into the bus, let go once it has died away.
const outOf = (ctx, dest, level, t) => { const g = ctx.createGain(); g.gain.value = level; g.connect(dest);
  setTimeout(() => g.disconnect(), Math.max(1000, (t - ctx.currentTime + 3) * 1000)); return g; };
const levelOf = (S, inst, share) => S.sounds.kinds[inst.kind].level * share;   // the kind's level × the note's share

// A hollow wooden knock: the board's two modes (f and f × `modes[1]`), quick to die, and the click of the hit.
function tock(kit, dest, inst, f, t, dur, share) {
  const { ctx, S } = kit, K = S.sounds.kinds.tock, out = outOf(ctx, dest, levelOf(S, inst, share), t);
  K.modes.forEach(([ratio, level, tc]) => ring(ctx, out, f * ratio, t, level, tc, f * ratio * K.drop, K.glide));
  hiss(kit, out, "bandpass", K.click.band, K.click.q, t, K.click.level, K.click.tc);
}

// A blow to the body: a low thump falling in pitch, with a dull punch in the middle (where small speakers hear it).
function thump(kit, dest, inst, f, t, dur, share) {
  const { ctx, S } = kit, K = S.sounds.kinds.thump, out = outOf(ctx, dest, levelOf(S, inst, share), t);
  ring(ctx, out, f, t, K.body.level, K.body.tc, f * K.body.from, K.body.glide);
  ring(ctx, out, f * K.mid.ratio, t, K.mid.level, K.mid.tc, f * K.mid.ratio * K.body.from, K.body.glide, "triangle");
  hiss(kit, out, "bandpass", K.punch.band, K.punch.q, t, K.punch.level, K.punch.tc, kit.noise.pink);
}

// A hinge's creak: friction sticking and slipping, a rough buzz whose pitch wanders (from f towards toF, never steady) and whose
// strength flutters, rough with slow noise in its pitch, heard through the door's resonances (`bands`: [Hz, q, level]; a metal gate's are higher and narrower).
function creak(kit, dest, inst, f, t, dur, share, toF = f) {
  const { ctx, S } = kit, K = S.sounds.kinds.creak, out = outOf(ctx, dest, levelOf(S, inst, share), t);
  const n = K.points, path = new Float32Array(n), amp = new Float32Array(n);
  let wander = 0;
  for (let i = 0; i < n; i++) {
    wander = wander * K.wander[0] + (Math.random() * 2 - 1) * K.wander[1];
    path[i] = (f * Math.pow(toF / f, i / (n - 1))) * (inst.rate ?? K.rate) * (1 + wander);
    amp[i] = 1 - K.flutter * Math.random();
  }
  const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueCurveAtTime(path, t, dur);
  const grain = ctx.createBufferSource(), gl = filt(ctx, "lowpass", K.grain[0]), gd = ctx.createGain();   // the grain: slow noise, never a steady wobble
  grain.buffer = kit.noise.white; grain.loop = true; gd.gain.value = f * (inst.rate ?? K.rate) * K.grain[1];
  grain.connect(gl); gl.connect(gd); gd.connect(o.frequency);
  const env = ctx.createGain(), fl = ctx.createGain();
  env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(1, t + K.attack);
  env.gain.setValueAtTime(1, t + Math.max(K.attack, dur - K.release)); env.gain.linearRampToValueAtTime(0, t + dur);
  fl.gain.setValueCurveAtTime(amp, t, dur);
  o.connect(env); env.connect(fl);
  for (const [hz, q, level] of inst.bands ?? K.bands) { const b = filt(ctx, "bandpass", hz, q), g = ctx.createGain(); g.gain.value = level; fl.connect(b); b.connect(g); g.connect(out); }
  o.start(t); grain.start(t, Math.random() * 3); o.stop(t + dur + 0.05); grain.stop(t + dur + 0.05);
}
