// The synth (MUSIC.md §3, §5): one FM note in its kind, in the voice of an AdLib / OPL2 card (a carrier and a modulator, the
// card's four waveforms as periodic waves, each kind's envelope, vibrato, tremolo and breath), the noise kinds of a rhythm line,
// slides and scoops, chords and arpeggios, and the music box. Plain functions of an AudioContext and its nodes: no globals, no
// knowledge of the game. Every number is the spec's (content/music.js), passed in as `kit.S`.
//
//   makeKit(ctx, S) → kit: { ctx, S, noise: { white, pink, brown }, waves }    made once per context (the slow part); the player
//                                                                               adds `pitch`, a node in cents every note follows
//   playEvent(kit, dest, music, inst, e, octave, t, beats, share, box)          one event of a line or a theme, at time t → its
//                                                                               notes' end times
//   note(kit, dest, inst, f, t, dur, share, opts)                                one note: opts { toF, scoop, box } → when it ends
// And the small helpers the tones and colours are built from: src, filt, gain, lfo, chain.
//
// The randomness here (noise, where a loop starts, a breath's rate) is the player's own, never the game's.

import { NOISES, freqOf } from "../../js/music.js?v=0.49.2";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// The noise buffers and the OPL2 waveforms (sine, half-sine, absolute sine, quarter-sine), made once for a context.
export function makeKit(ctx, S) {
  const len = Math.floor(ctx.sampleRate * S.noiseSeconds), mk = () => ctx.createBuffer(1, len, ctx.sampleRate);
  const white = mk(), pink = mk(), brown = mk();
  const w = white.getChannelData(0), p = pink.getChannelData(0), br = brown.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
  for (let i = 0; i < len; i++) {                         // white; pink (Paul Kellet's filter); brown (integrated white)
    const x = Math.random() * 2 - 1; w[i] = x;
    b0 = 0.99886 * b0 + x * 0.0555179; b1 = 0.99332 * b1 + x * 0.0750759; b2 = 0.969 * b2 + x * 0.153852;
    b3 = 0.8665 * b3 + x * 0.3104856; b4 = 0.55 * b4 + x * 0.5329522; b5 = -0.7616 * b5 - x * 0.016898;
    p[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * 0.5362) * 0.11; b6 = x * 0.115926;
    last = (last + 0.02 * x) / 1.02; br[i] = last * 3.5;
  }
  const waves = {};
  for (const [name, [re, im]] of Object.entries(harmonicsOf(S.waves))) waves[name] = ctx.createPeriodicWave(re, im);
  return { ctx, S, noise: { white, pink, brown }, waves };
}
// The waveforms' harmonics, worked out once for the page (the measuring makes a kit for every part it renders: ui/sound/measure.js).
const harmonics = new Map();
function harmonicsOf({ samples: N, harmonics: H }) {
  const id = N + ":" + H;
  if (harmonics.has(id)) return harmonics.get(id);
  const shape = { half: (x) => Math.max(0, Math.sin(x)), abs: (x) => Math.abs(Math.sin(x)),
    quarter: (x) => ((x % Math.PI) < Math.PI / 2 ? Math.abs(Math.sin(x)) : 0) }, out = {};
  for (const [name, fn] of Object.entries(shape)) {
    const re = new Float32Array(H), im = new Float32Array(H);
    for (let k = 1; k < H; k++) {
      let a = 0, b = 0;
      for (let n = 0; n < N; n++) { const x = 2 * Math.PI * n / N, v = fn(x); a += v * Math.cos(k * x); b += v * Math.sin(k * x); }
      re[k] = a * 2 / N; im[k] = b * 2 / N;
    }
    out[name] = [re, im];
  }
  harmonics.set(id, out);
  return out;
}

// ---- Small helpers -------------------------------------------------------------------------------------------------------------
// A looping noise source, started now at a random point.
export function src(kit, buf) { const s = kit.ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(kit.ctx.currentTime, Math.random() * 3); return s; }
export function filt(ctx, type, f, q = 0.7) { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
export function gain(ctx, v) { const g = ctx.createGain(); g.gain.value = v; return g; }
// A slow oscillator moving a parameter by ± depth: [rate, depth].
export function lfo(ctx, [rate, depth], target) { const o = ctx.createOscillator(), g = gain(ctx, depth); o.frequency.value = rate; o.connect(g); g.connect(target); o.start(); return o; }
export function chain(...n) { for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[n.length - 1]; }

// ---- Events --------------------------------------------------------------------------------------------------------------------
// One event of a line or a theme at time t, `beats` long: a rest plays nothing; a slide, a scoop, or both (~5~3); an arpeggio
// (the beats split between its notes); a chord (its notes together, each softer: 1/√n). `box`: through the music box.
// → its notes' end times (the player counts them: its budget of notes sounding at once).
export function playEvent(kit, dest, music, inst, e, octave, t, beats, share, box = false) {
  if (e.rest) return [];
  const dur = beats * music.beat, n = e.steps.length, f = (st) => freqOf(music, st, octave);
  if (e.to !== undefined || e.scoop) return [note(kit, dest, inst, f(e.steps[0]), t, dur, share, { toF: e.to !== undefined ? f(e.to) : undefined, scoop: !!e.scoop, box })];
  if (e.arp) return e.steps.map((st, k) => note(kit, dest, inst, f(st), t + k * dur / n, dur / n, share, { box }));
  return e.steps.map(st => note(kit, dest, inst, f(st), t, dur, share / Math.sqrt(n), { box }));
}

// ---- One note (MUSIC.md §3) in its kind, with the engine's frame (§5) ---------------------------------------------------------
// Held notes softer than struck, breathing, fading after the cap (low ones sooner); notes above `high` softer the higher; low
// struck and plucked notes get an octave above, so a phone or laptop speaker can play them; held low notes don't. Its oscillators
// (not its LFOs) follow `kit.pitch` when there is one: the player's shared detune (unwell, the wobble), in cents.
export function note(kit, dest, inst, f, t, dur, share = 1, opts = {}) {
  const { ctx, S } = kit, N = S.note;
  if (NOISES.includes(inst.kind)) return noiseNote(kit, dest, inst, f, t, dur, share);
  if (opts.box) { const B = S.box; inst = { ...inst, kind: B.kind, ratio: B.ratio, bright: B.bright, release: B.release }; f = Math.min(f * B.up, B.top); }
  const { kind, ratio, bright, release } = inst, K = S.kinds[kind] || S.kinds.struck;
  const low = f < N.octaveUnder, decay = !!K.decay;
  const level = N.level * share * (f < N.low ? N.lowBoost : 1) * (f > N.high ? Math.pow(N.high / f, N.highCurve) : 1) * (decay ? 1 : N.held);
  const attack = decay ? N.attack : Math.max(K.minAttack || N.heldAttack, inst.attack);
  const rel = K.short ? Math.min(release, N.shortRelease) : release;
  const car = ctx.createOscillator(), mod = ctx.createOscillator();
  const depth = ctx.createGain(), amp = ctx.createGain(), out = ctx.createGain();
  if (K.wave !== "sine") car.setPeriodicWave(kit.waves[K.wave]);
  car.frequency.value = f; mod.frequency.value = f * ratio;
  const bend = (from, to, at, until) => {                          // the carrier and the modulator glide together
    car.frequency.setValueAtTime(from, at); car.frequency.exponentialRampToValueAtTime(to, until);
    mod.frequency.setValueAtTime(from * ratio, at); mod.frequency.exponentialRampToValueAtTime(to * ratio, until);
  };
  const slide = opts.toF && !opts.box;                             // (a music box's note is an octave up: it doesn't slide)
  if (opts.scoop) bend(f * N.scoop.from, f, t, t + N.scoop.time);  // a scoop up into the note…
  if (slide) {                                                      // …and a slide to the next step (after the scoop, if both)
    const from = opts.scoop ? t + N.scoop.time : t;
    bend(f, opts.toF, from, Math.max(from + N.slide.least, t + dur * N.slide.along));
  }
  const idx = bright * f * (K.wave === "sine" ? N.index.sine : N.index.other);
  mod.connect(depth); depth.connect(car.frequency);
  car.connect(amp); amp.connect(out); out.connect(dest);
  const oscs = [car, mod], extra = [], tuned = [car, mod];
  amp.gain.setValueAtTime(0, t); amp.gain.linearRampToValueAtTime(level, t + attack);
  let end;
  if (decay) {
    const D = N.struck;
    depth.gain.setValueAtTime(idx * D.depth, t); depth.gain.setTargetAtTime(idx * D.settle, t, rel / (K.short ? D.fallShort : D.fall));
    amp.gain.setTargetAtTime(0, t + attack, rel / D.amp);
    end = t + attack + rel * D.tail;
    if (low) {                                                     // an octave above, so a small speaker can play it
      const o2 = ctx.createOscillator(), g2 = gain(ctx, N.octaveGain); o2.frequency.value = f * 2;
      o2.connect(g2); g2.connect(amp); oscs.push(o2); tuned.push(o2);
    }
    if (K.partial) {                                               // a chime's out-of-tune partial, dying sooner
      const o3 = ctx.createOscillator(), g3 = ctx.createGain(); o3.frequency.value = f * K.partial;
      g3.gain.setValueAtTime(N.partial.level, t); g3.gain.setTargetAtTime(0, t, rel / N.partial.fall);
      o3.connect(g3); g3.connect(amp); oscs.push(o3); tuned.push(o3);
    }
  } else {
    const B = N.breath;
    depth.gain.setValueAtTime(idx * B.depthFrom, t); depth.gain.linearRampToValueAtTime(idx, t + attack);
    const cap = low ? N.lowCap : N.cap;
    const hold = Math.min(Math.max(t + attack, t + dur), t + Math.max(attack, cap));
    if (hold > t + attack) amp.gain.setTargetAtTime(level * B.sustain, t + attack, (hold - t - attack) / B.swell + B.swellMin);
    amp.gain.setTargetAtTime(0, hold, rel / B.amp);
    depth.gain.setTargetAtTime(idx * B.depthTo, hold, rel / B.amp);
    end = hold + rel * B.tail;
    const sw = ctx.createOscillator(), swg = gain(ctx, B.depth); sw.frequency.value = B.rate[0] + Math.random() * B.rate[1];
    sw.connect(swg); swg.connect(out.gain); oscs.push(sw);         // a held note breathes
    if (K.vibrato) {
      const v = ctx.createOscillator(), vg = ctx.createGain(); v.frequency.value = N.vibrato.rate[0] + Math.random() * N.vibrato.rate[1];
      vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * K.vibrato, t + attack + N.vibrato.in);
      v.connect(vg); vg.connect(car.frequency); oscs.push(v);
    }
    if (K.tremolo) {
      const tr = ctx.createOscillator(), tg = gain(ctx, K.tremolo); tr.frequency.value = N.tremolo;
      tr.connect(tg); tg.connect(out.gain); oscs.push(tr);
    }
    if (K.breath) {                                                // breath noise around the pitch
      const R = N.breathNoise, n = ctx.createBufferSource(); n.buffer = kit.noise.white; n.loop = true;
      const bp = filt(ctx, "bandpass", Math.min(f * R.band, R.top), R.q);
      const ng = ctx.createGain(); ng.gain.setValueAtTime(0, t); ng.gain.linearRampToValueAtTime(level * K.breath * R.level, t + attack);
      ng.gain.setTargetAtTime(0, hold, rel / B.amp);
      n.connect(bp); bp.connect(ng); ng.connect(out); n.start(t, Math.random() * R.offset); n.stop(end); extra.push(ng);
    }
  }
  const pitch = kit.pitch;
  if (pitch) for (const o of tuned) pitch.connect(o.detune);
  for (const o of oscs) { o.start(t); o.stop(end); }
  car.onended = () => {
    amp.disconnect(); depth.disconnect(); out.disconnect(); extra.forEach(x => x.disconnect());
    if (pitch) for (const o of tuned) pitch.disconnect(o.detune);
  };
  return end;
}

// The rhythm kinds (MUSIC.md §2.19): noise or a falling blip, quiet; the step only tilts them higher or lower.
function noiseNote(kit, dest, inst, f, t, dur, share) {
  const { ctx, S } = kit, Z = S.noises, noise = kit.noise;
  const L = Z.level * share * (Z.base + inst.bright * Z.by), out = ctx.createGain(); out.connect(dest);
  const burst = (buf, type, freq, q, at, level, tc, len = Z.burst.len) => {
    const s = ctx.createBufferSource(); s.buffer = buf; const bf = filt(ctx, type, freq, q);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(level, at + 0.001); g.gain.setTargetAtTime(0, at + 0.002, tc);
    s.connect(bf); bf.connect(g); g.connect(out); s.start(at, Math.random() * Z.burst.offset); s.stop(at + len);
  };
  const blip = (from, to, at, level, tc) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(from, at); o.frequency.exponentialRampToValueAtTime(to, at + Z.blipGlide);
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(level, at + 0.002); g.gain.setTargetAtTime(0, at + 0.003, tc);
    o.connect(g); g.connect(out); o.start(at); o.stop(at + Z.blipLen);
  };
  const at = ([k, lo, hi]) => clamp(f * k, lo, hi);                // a pitch from the step, kept within the kind's band
  const k = inst.kind;
  if (k === "tick") { const T = Z.tick; burst(noise.white, "bandpass", at(T.band), T.q, t, L, T.tc, T.len); }
  else if (k === "knock") { const T = Z.knock, p = at(T.blip); blip(p, p * T.fall, t, L * T.level, T.tc); burst(noise.brown, "lowpass", T.thud.lowpass, T.thud.q, t, L, T.thud.tc); }
  else if (k === "clack") { const T = Z.clack; burst(noise.white, "bandpass", at(T.band), T.q, t, L, T.tc, T.len); burst(noise.white, "bandpass", at(T.second.band), T.q, t + T.second.after, L * T.second.level, T.tc, T.len); }
  else if (k === "brush") {
    const T = Z.brush, s = ctx.createBufferSource(); s.buffer = noise.pink; const bf = filt(ctx, "bandpass", at(T.band), T.q);
    const g = ctx.createGain(), len = Math.min(dur, T.longest);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(L * T.level, t + T.rise); g.gain.setTargetAtTime(0, t + len, T.tc);
    s.connect(bf); bf.connect(g); g.connect(out); s.start(t, Math.random() * Z.burst.offset); s.stop(t + len + 0.5);
  } else if (k === "drip") { const T = Z.drip, p = at(T.blip); blip(p, p * T.fall, t, L * T.level, T.tc); }
  setTimeout(() => out.disconnect(), Math.max(1000, (t - ctx.currentTime + Z.release) * 1000));
  return t + Z.release;
}
