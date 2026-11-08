// The sounds (docs/sound/PLAN.md, build 1): a short sound for a moment the screen already shows (a thing picked up or put down,
// eaten or drunk, a hurt, a heal, a condition starting or ending, a door, a lid, a puzzle solved), each made of the music's own kinds
// (ui/sound/synth.js, `note`) in the world's key and mode. Plain functions of the kit and a destination: no globals, no knowledge
// of the game. They are told what to play in plain terms, `{ kind, material, weight }` (ui/sound.js, soundsOf, reads the moment), and
// a key, `{ root, steps }` (the world's music's, js/music.js; or the spec's `sounds.key`). Every number is the spec's
// (content/music.js, `sounds`: one table, `moments`, from a kind to its notes; and for a door opening or closing and eating, three
// `versions` of each, `pick` the one the game plays). Any randomness is the synth's, never the game's.
//
//   notesOf(O, kind, version)  → a kind's notes: its version's (the one given, else the spec's `pick`), else the table's
//   everySound(O)              → every { kind, version } the spec can play (each moment, each version of each): what is measured
//   planOf(list, key, S) → [{ kind, inst, octave, f, toF, t, dur, share }]   what plays, as numbers: t from the first sound's start;
//                                                                              a sound may name its `version` (the bench, to compare)
//   playSounds(kit, dest, list, key, t0, trim)                                 the plan made sound, from audio time t0; trim(p): each
//                                                                              note's gain from the meter (ui/sound/loudness.js), 1 if none
//   playNote(kit, dest, p, t)                                                  one planned note, at audio time t (the meter plays it alone)

import { freqOf } from "../../js/music.js";
import { note, filt } from "./synth.js";

// A material's instrument: the spec's, or the generic one for none or a word it doesn't have.
export const materialOf = (name, S) => S.sounds.materials[name] ?? S.sounds.materials.generic;

// A kind's notes: a door opening or closing and eating have versions (MUSIC.md §6b), the one given or the spec's pick.
export const notesOf = (O, kind, version) => O.versions?.[kind]?.[version ?? O.pick?.[kind]] ?? O.moments[kind];
export function everySound(O) {
  const out = Object.keys(O.moments).map(kind => ({ kind }));
  for (const [kind, vs] of Object.entries(O.versions ?? {})) for (const version of Object.keys(vs)) out.push({ kind, version });
  return out;
}

// The notes of each sound in a moment, in its order, `spacing` apart, at most `most`. A kind the table doesn't have plays nothing.
// A note with no `step` has no pitch from the key: its kind makes its own (the versions' fixed contours, the noise of B and C).
export function planOf(list, key, S) {
  const O = S.sounds, out = [], pitch = (step, octave) => freqOf(key, step, octave);
  list.slice(0, O.most).forEach((s, k) => {
    const notes = notesOf(O, s.kind, s.version);
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

// The plan made sound, on `dest`, from audio time t0, each note at its share × its trim (the meter's gain for its instrument).
export function playSounds(kit, dest, list, key, t0, trim = () => 1) {
  for (const p of planOf(list, key, kit.S)) playNote(kit, dest, { ...p, share: p.share * trim(p) }, t0 + p.t);
}
// One planned note at audio time t. Steady: the music's shared pitch (unwell, the wobble: kit.pitch) is the music's, not theirs.
export function playNote(kit, dest, p, t) {
  const own = EFFECTS[p.inst.kind];
  if (own) own(kit, dest, p.inst, p.f, t, p.dur, p.share, p.toF);
  else note({ ...kit, pitch: null }, dest, p.inst, p.f, t, p.dur, p.share, { toF: p.toF });
}

// ---- The sounds' own kinds (not the music's): a wooden knock, a body blow, and the versions' two (below) -------------------------
// Each: (kit, dest, inst, f, t, dur, share, toF). Their numbers are the spec's (`sounds.kinds`, and the voice's own), their
// randomness the player's.
// Small speakers (a phone's, a laptop's) play little under 300 Hz, so each has its weight in the middle, where they do.
const EFFECTS = { tock, thump, adlib, foley };

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

// ---- The door and eating versions (MUSIC.md §6b): three ways of each, side by side, until Diego picks one by ear ----------------
// Neither has a note of the world's key: the AdLib way draws its own pitches, the other two are noise. A material colours a door's
// sound with two numbers (a voice's shape for it, `as`): `bright` (× its frequencies, or its FM index) and `ring` (× how long it rings).
const pick = (v) => (Array.isArray(v) ? v[0] + Math.random() * (v[1] - v[0]) : v);
const count = (v) => Math.round(pick(v));

// A: the AdLib way (Commander Keen 4–6, Wolfenstein 3-D; moddingwiki.shikadi.net/wiki/Adlib_sound_effect): one FM instrument on one
// channel, and a stream of pitch values written `rate` (140) times a second: each a byte, the OPL2's f-number in the sound's octave
// (`block`: Hz = byte × clock / 2^(20 − block)); a zero cuts the note (key off), the next value starts it again (key on, its envelope
// from the top); a value held is one note. The stream here is drawn from segments, each a contour in Hz turned into bytes tick by
// tick: { from, to, ticks, jitter (± share, each tick), gaps (each tick's chance of a zero, but the first), set (the instrument's numbers changed
// for it) } or { off: ticks }; [least, most] anywhere is picked each play. The instrument: carrier and modulator multiples of the
// pitch (`car`, `mod`), the depth (`index` × the modulator's pitch), an envelope (attack, decay to `sustain`, release: time
// constants; a metal door's decay and release × `ring`), and the modulator's self-feedback, the grit (below).
//
// The feedback: on the OPL2 the modulator's own output, the mean of its last two samples × β, is added to its phase; past β ≈ 2 it
// never settles and the sine becomes a noise-like buzz. Web Audio has no one-sample loop, so it is emulated in two parts: one cycle
// of the feedback worked out in code at the instrument's β (`feedback`; the cycle after a few turns, a snapshot of the chaos when it
// doesn't settle) and played as the modulator's periodic wave; and white noise in the modulator's pitch (`grit` × its pitch), the
// cycle-to-cycle wandering a periodic wave can't have.
const fbHarmonics = new Map();
function feedbackHarmonics(beta, { samples: N, harmonics: H, cycles }) {
  const id = [beta, N, H, cycles].join(":");
  if (fbHarmonics.has(id)) return fbHarmonics.get(id);
  const y = new Float32Array(N);
  let y1 = 0, y2 = 0;
  for (let c = 0; c < cycles; c++) for (let n = 0; n < N; n++) { const v = Math.sin(2 * Math.PI * n / N + beta * (y1 + y2) / 2); y2 = y1; y1 = v; y[n] = v; }
  const re = new Float32Array(H), im = new Float32Array(H);
  for (let k = 1; k < H; k++) {
    let a = 0, b = 0;
    for (let n = 0; n < N; n++) { const x = 2 * Math.PI * k * n / N; a += y[n] * Math.cos(x); b += y[n] * Math.sin(x); }
    re[k] = a * 2 / N; im[k] = b * 2 / N;
  }
  fbHarmonics.set(id, [re, im]);
  return [re, im];
}
// The stream, tick by tick: [{ byte, inst }] (byte 0: off), from the segments, picked afresh each play.
export function streamOf(inst, step) {
  const out = [];
  for (const seg of inst.stream) {
    if (seg.off !== undefined) { for (let i = count(seg.off); i > 0; i--) out.push({ byte: 0 }); continue; }
    const n = Math.max(1, count(seg.ticks)), from = pick(seg.from), to = pick(seg.to ?? seg.from), own = { ...inst, ...seg.set };
    for (let i = 0; i < n; i++) {
      const hz = from * Math.pow(to / from, n > 1 ? i / (n - 1) : 0) * (1 + (Math.random() * 2 - 1) * (seg.jitter ?? 0));
      out.push({ byte: i && Math.random() < (seg.gaps ?? 0) ? 0 : Math.max(1, Math.min(255, Math.round(hz / step))), inst: own, seg });
    }
  }
  return out;
}
function adlib(kit, dest, inst, f, t, dur, share) {
  const { ctx, S } = kit, K = S.sounds.kinds.adlib, out = outOf(ctx, dest, share, t);
  const step = K.clock / Math.pow(2, 20 - inst.block), tick = 1 / K.rate, ticks = streamOf(inst, step);
  const bright = inst.bright ?? 1, ring = inst.ring ?? 1;
  // Each segment its own voice (an instrument change between them, as a game would rewrite the registers); within it, the notes
  // keyed on and off by the stream.
  let i = 0;
  while (i < ticks.length) {
    if (!ticks[i].byte) { i++; continue; }
    const seg = ticks[i].seg, I = ticks[i].inst, from = i;   // (a segment's own zeros, its gaps, stay in its voice)
    let to = i; while (to < ticks.length && ticks[to].seg === seg) to++;
    voice(I, from, to);
    i = to;
  }
  function voice(I, from, to) {
    const t0 = t + from * tick, release = I.release * ring, end = t + to * tick + release * 8 + 0.02;
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), depth = ctx.createGain(), env = ctx.createGain();
    if (I.wave && I.wave !== "sine") car.setPeriodicWave(kit.waves[I.wave]);
    const [re, im] = feedbackHarmonics(I.feedback ?? 0, K.waves); mod.setPeriodicWave(ctx.createPeriodicWave(re, im));
    const grit = ctx.createBufferSource(), gg = ctx.createGain(); grit.buffer = kit.noise.white; grit.loop = true;
    grit.connect(gg); gg.connect(mod.frequency); mod.connect(depth); depth.connect(car.frequency); car.connect(env); env.connect(out);
    env.gain.setValueAtTime(0, t0);
    const decay = I.decay * ring, attack = I.attack;
    let last = -1, on = false;
    const keyOff = (at) => { env.gain.setTargetAtTime(0, at, release); on = false; };
    for (let k = from; k < to; k++) {
      const at = t + k * tick, b = ticks[k].byte;
      if (!b) { if (on) keyOff(at); last = 0; continue; }
      if (b !== last) {                                          // a game wrote the chip only when the value changed
        const hz = b * step;
        car.frequency.setValueAtTime(hz * I.car, at); mod.frequency.setValueAtTime(hz * I.mod, at);
        depth.gain.setValueAtTime(I.index * bright * hz * I.mod, at); gg.gain.setValueAtTime((I.grit ?? 0) * hz * I.mod, at);
      }
      if (!on) {                                                 // key on: the envelope from the top
        on = true;
        let len = 0; while (k + len < to && ticks[k + len].byte) len++;
        env.gain.setTargetAtTime(1, at, attack);
        if (len * tick > attack * 4) env.gain.setTargetAtTime(I.sustain, at + attack * 4, decay);
      }
      last = b;
    }
    if (on) keyOff(t + to * tick);
    for (const o of [car, mod]) { o.start(t0); o.stop(end); }
    grit.start(t0, Math.random() * 3); grit.stop(end);
  }
}

// B and C: `foley`, a door or a mouthful as layers, each at `at` seconds after the sound starts or `after` seconds after the layer
// before it (so the latch keeps its distance from the thunk: the "ka-chunk" that makes it a door): `click`, `whoosh`, `thunk`,
// `grains`, `fm`. Every time, place, frequency and level is picked within its range each play.
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
  // thinning), mostly quiet and a few loud (a level × random ^ `skew`); the first of a bite × `first`. `grid`: grains on a grid of
  // that many a second (C's stylised crunch, the AdLib's 140); `onset`: an FM crack as each bite starts (C).
  grains(kit, out, L, t) {
    const { ctx } = kit, bands = L.bands.map(([hz, q]) => {
      const s = ctx.createBufferSource(), bp = filt(ctx, "bandpass", Math.min(top, hz * pick([0.92, 1.08])), q), g = ctx.createGain();
      s.buffer = kit.noise.white; s.loop = true; g.gain.value = 0; s.connect(bp); bp.connect(g); g.connect(out); return { s, g };
    });
    const grains = [], n = count(L.bites);
    let start = t;
    for (let b = 0; b < n; b++) {
      const len = pick(L.bite), [d0, d1] = L.density;
      if (L.onset) LAYERS.fm(kit, out, L.onset, start, { bright: 1, ring: 1 });
      for (let x = 0, k = 0; x < len; k++) {
        let at = start + x;
        if (L.grid) at = t + Math.round((at - t) * L.grid) / L.grid;
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
  },
  // A touch of FM (C): a carrier gliding from `f` to `to` over `glide`, its modulator `ratio` above, `index` deep, dying over `tc`:
  // a clean click up high, or a body under the thunk down low. A metal door's brighter (× the index) and longer.
  fm(kit, out, L, t, { bright, ring: rings }) {
    const { ctx } = kit, f0 = pick(L.f), f1 = pick(L.to ?? L.f), tc = pick(L.tc) * rings, glide = L.glide ?? 0.03, end = t + tc * 8 + 0.05;
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), depth = ctx.createGain(), g = ctx.createGain();
    car.frequency.setValueAtTime(f0, t); car.frequency.exponentialRampToValueAtTime(f1, t + glide);
    mod.frequency.setValueAtTime(f0 * L.ratio, t); mod.frequency.exponentialRampToValueAtTime(f1 * L.ratio, t + glide);
    depth.gain.setValueAtTime(L.index * bright * f0 * L.ratio, t); depth.gain.setTargetAtTime(L.index * bright * f1 * L.ratio * 0.3, t, tc);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pick(L.level), t + 0.001); g.gain.setTargetAtTime(0, t + 0.002, tc);
    mod.connect(depth); depth.connect(car.frequency); car.connect(g); g.connect(out);
    for (const o of [car, mod]) { o.start(t); o.stop(end); }
  }
};
