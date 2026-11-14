// The sounds (docs/sound/PLAN.md, build 1): a short sound for a moment the screen already shows (a thing picked up or put down,
// eaten or drunk, a hurt, a heal, a condition starting or ending, a door, a lid, a puzzle solved), each made of the music's own kinds
// (ui/sound/synth.js, `note`) in the world's key and mode. Plain functions of the kit and a destination: no globals, no knowledge
// of the game. They are told what to play in plain terms, `{ kind, material, weight }` (ui/sound.js, soundsOf, reads the moment), and
// a key, `{ root, steps }` (the world's music's, js/music.js; or the spec's `sounds.key`). Every number is the spec's
// (content/music.js, `sounds`: one table, `moments`, from a kind to its notes). Any randomness is the synth's, never the game's.
//
//   planOf(list, key, S) → [{ kind, inst, octave, f, toF, t, dur, share }]   what plays, as numbers: t from the first sound's start
//   playSounds(kit, dest, list, key, t0, gain)                                 the plan made sound, from audio time t0; gain(p): each
//                                                                              note's from its level (ui/sound/loudness.js), 1 if none
//   playNote(kit, dest, p, t)                                                  one planned note, at audio time t (measured alone too)

import { freqOf } from "../../js/music.js?v=0.50.3";
import { note, filt } from "./synth.js?v=0.50.3";

// A material's instrument: the spec's, or the generic one for none or a word it doesn't have.
export const materialOf = (name, S) => S.sounds.materials[name] ?? S.sounds.materials.generic;

// The notes of each sound in a moment, in its order, `spacing` apart, at most `most`. A kind the table doesn't have plays nothing.
// A note with no `step` has no pitch from the key: its kind makes its own (a door's or a mouthful's noise).
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
      out.push({ kind: s.kind, inst, octave, f: n.step === undefined ? undefined : pitch(n.step, octave), toF: n.to !== undefined ? pitch(n.to, octave) : undefined,
                 t: k * O.spacing + (n.at ?? 0), dur: n.length ?? inst.length ?? O.length,
                 share: (n.level ?? 1) * weight });
    }
  });
  return out;
}

// The plan made sound, on `dest`, from audio time t0, each note at its share × its gain (its instrument's level).
export function playSounds(kit, dest, list, key, t0, gain = () => 1) {
  for (const p of planOf(list, key, kit.S)) playNote(kit, dest, { ...p, share: p.share * gain(p) }, t0 + p.t);
}
// One planned note at audio time t. Steady: the music's shared pitch (unwell, the wobble: kit.pitch) is the music's, not theirs.
export function playNote(kit, dest, p, t) {
  const own = EFFECTS[p.inst.kind];
  if (own) own(kit, dest, p.inst, p.f, t, p.dur, p.share, p.toF);
  else note({ ...kit, pitch: null }, dest, p.inst, p.f, t, p.dur, p.share, { toF: p.toF });
}

// ---- The sounds' own kinds (not the music's): a wooden knock, a body blow, and a door or a mouthful (foley, below) --------------
// Each: (kit, dest, inst, f, t, dur, share, toF). Their numbers are the spec's (`sounds.kinds`, and the voice's own), their
// randomness the player's.
// Small speakers (a phone's, a laptop's) play little under 300 Hz, so each has its weight in the middle, where they do.
const EFFECTS = { tock, thump, foley };
export const EFFECT_KINDS = Object.keys(EFFECTS);

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

// A hollow wooden knock: the board's two modes (f and f × `modes[1]`), quick to die, and the click of the hit.
function tock(kit, dest, inst, f, t, dur, share) {
  const { ctx, S } = kit, K = S.sounds.kinds.tock, out = outOf(ctx, dest, share, t);
  K.modes.forEach(([ratio, level, tc]) => ring(ctx, out, f * ratio, t, level, tc, f * ratio * K.drop, K.glide));
  hiss(kit, out, "bandpass", K.click.band, K.click.q, t, K.click.level, K.click.tc);
}

// A blow to the body: a low thump falling in pitch, with a dull punch in the middle (where small speakers hear it).
function thump(kit, dest, inst, f, t, dur, share) {
  const { ctx, S } = kit, K = S.sounds.kinds.thump, out = outOf(ctx, dest, share, t);
  ring(ctx, out, f, t, K.body.level, K.body.tc, f * K.body.from, K.body.glide);
  ring(ctx, out, f * K.mid.ratio, t, K.mid.level, K.mid.tc, f * K.mid.ratio * K.body.from, K.body.glide, "triangle");
  hiss(kit, out, "bandpass", K.punch.band, K.punch.q, t, K.punch.level, K.punch.tc, kit.noise.pink);
}

// ---- A door, a mouthful (MUSIC.md §6b): `foley`, noise and timing, no note of the world's key -----------------------------------
// A material colours a door's sound with two numbers (a voice's shape for it, `as`): `bright` (× its frequencies) and `ring` (× how
// long it rings).
const pick = (v) => (Array.isArray(v) ? v[0] + Math.random() * (v[1] - v[0]) : v);
const count = (v) => Math.round(pick(v));

// A door or a mouthful as layers, each at `at` seconds after the sound starts or `after` seconds after the layer before it (so the
// latch keeps its distance from the thunk: the "ka-chunk" that makes it a door): `click`, `whoosh`, `thunk`, `grains`. Every time,
// place, frequency and level is picked within its range each play.
function foley(kit, dest, inst, f, t, dur, share) {
  const { ctx } = kit, out = outOf(ctx, dest, share, t), c = { bright: inst.bright ?? 1, ring: inst.ring ?? 1 };
  let prev = t;
  for (const L of inst.layers) {
    const at = L.after !== undefined ? prev + pick(L.after) : t + pick(L.at ?? 0);
    LAYERS[L.type](kit, out, L, at, c);
    prev = at;
  }
}
const top = 6000;                                    // no layer's band above this (the sounds' low-pass is lower still)
const LAYERS = {
  // A click: a burst of white noise a few ms long through its bands ([Hz, q, level]), `count` of them `gap` apart, each × `decay`
  // of the one before (a handle's two ticks, a latch's bounce). A metal latch's bands higher.
  click(kit, out, L, t, { bright }) {
    let at = t, lv = pick(L.level);
    for (let k = 0; k < (L.count ?? 1); k++) {
      for (const [hz, q, level] of L.bands) hiss(kit, out, "bandpass", Math.min(top, hz * pick(L.spread ?? [0.92, 1.08]) * bright), q, at, lv * level, L.tc);
      at += pick(L.gap ?? 0.01); lv *= L.decay ?? 0.5;
    }
  },
  // A whoosh of air: pink noise through a wide band sweeping `band` [from, peak, to] Hz, swelling to its peak at `rise` of its length.
  whoosh(kit, out, L, t) {
    const { ctx } = kit, len = pick(L.length), j = pick([0.9, 1.1]), n = 32, curve = new Float32Array(n), path = new Float32Array(n);
    const [a, b, c] = L.band, r = L.rise;
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1);
      curve[i] = pick(L.level) * (x < r ? Math.sin(Math.PI / 2 * x / r) ** 2 : Math.cos(Math.PI / 2 * (x - r) / (1 - r)) ** 2);
      path[i] = j * (x < r ? a * Math.pow(b / a, x / r) : b * Math.pow(c / b, (x - r) / (1 - r)));
    }
    curve[0] = 0; curve[n - 1] = 0;
    const s = ctx.createBufferSource(), bp = filt(ctx, "bandpass", path[0], L.q), g = ctx.createGain(); s.buffer = kit.noise.pink;
    g.gain.setValueAtTime(0, t); g.gain.setValueCurveAtTime(curve, t, len); bp.frequency.setValueCurveAtTime(path, t, len);
    s.connect(bp); bp.connect(g); g.connect(out); s.start(t, Math.random() * 3); s.stop(t + len + 0.05);
  },
  // A thunk of wood on the frame: `modes` decaying sines at unrelated frequencies (one at random in each of `modes` equal slots of
  // `range`, log-evenly: never bunched, so one play is about as loud as the next), each
  // dying within hundredths of a second (`tc`), starting `drop` sharp, within `spread` seconds of each other (a door meets its frame
  // along its edge, not at a point; and so no one peak): no pitch to hear, only a dull blow; with a low burst of noise
  // (`noise`) and the crack of the hit (`crack`). A metal gate's modes higher and ringing longer.
  thunk(kit, out, L, t, { bright, ring: rings }) {
    const { ctx } = kit, [lo, hi] = L.range, n = L.modes;
    for (let i = 0; i < n; i++) {
      const hz = Math.min(top, Math.exp(Math.log(lo) + (i + Math.random()) / n * Math.log(hi / lo)) * bright);   // one in each slot
      ring(ctx, out, hz, t + Math.random() * (L.spread ?? 0), pick(L.level) / Math.sqrt(n), pick(L.tc) * rings, hz * (L.drop ?? 1), 0.012);
    }
    if (L.noise) hiss(kit, out, "lowpass", L.noise.lowpass * bright, 0.7, t, L.noise.level, L.noise.tc, kit.noise.pink);
    if (L.crack) hiss(kit, out, "bandpass", Math.min(top, L.crack.band * bright), L.crack.q, t, L.crack.level, L.crack.tc);
  },
  // A crunch: `bites` bites, `bite` seconds each, `gap` apart; in each, tiny fractures of noise (a grain: a few ms through one of
  // `bands`, [Hz, q], at random), irregular (each the next after a random wait, a quarter to 1.75 of the mean: never a long hole
  // or a pile-up, so one play is about as loud as the next), `density` grains a second from the first to the last (dense, then
  // thinning), mostly quiet and a few loud (a level × random ^ `skew`); the first of a bite × `first`.
  grains(kit, out, L, t) {
    const { ctx } = kit, bands = L.bands.map(([hz, q]) => {
      const s = ctx.createBufferSource(), bp = filt(ctx, "bandpass", Math.min(top, hz * pick([0.92, 1.08])), q), g = ctx.createGain();
      s.buffer = kit.noise.white; s.loop = true; g.gain.value = 0; s.connect(bp); bp.connect(g); g.connect(out); return { s, g };
    });
    const grains = [], n = count(L.bites);
    let start = t;
    for (let b = 0; b < n; b++) {
      const len = pick(L.bite), [d0, d1] = L.density;
      for (let x = 0, k = 0; x < len; k++) {
        const at = start + x;
        const lv = pick(L.level) * Math.random() ** (L.skew ?? 2) * (k === 0 ? L.first ?? 1 : 1) * (1 - 0.4 * x / len);
        grains.push({ at, lv, band: Math.floor(Math.random() * bands.length), tc: pick(L.tc) });
        x += (0.25 + 1.5 * Math.random()) / (d0 * Math.pow(d1 / d0, x / len));
      }
      start += len + (b < n - 1 ? pick(L.gap) : 0);
    }
    grains.sort((a, b) => a.at - b.at);
    for (const g of grains) {
      const p = bands[g.band].g.gain;
      p.setTargetAtTime(g.lv, g.at, 0.0003); p.setTargetAtTime(0, g.at + 0.0009, g.tc);
    }
    for (const { s } of bands) { s.start(t, Math.random() * 3); s.stop(start + 0.1); }
  }
};
