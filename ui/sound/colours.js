// The colours (MUSIC.md §2.19, §2.21): how the world's music reaches the player (a gramophone, a radio, a music box, far away,
// through a wall, under water, or clean), a chain the music goes through and the room tone never does, each matched in level to
// clean. A plain function of the kit (ui/sound/synth.js): no globals, no knowledge of the game. Every number is the spec's
// (content/music.js, `colours`). The crackle's randomness is the player's own.
//
//   makeColour(kit, name) → { input, output, tick(from, to), stop(t) }
// (The music box's other half, every note an octave up as a small tine, is the synth's: playEvent's `box`.)

import { src, filt, gain, lfo, chain } from "./synth.js";

// A gentle saturation: a tanh curve of this drive.
function shaper(ctx, drive, n) {
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(x * drive) / Math.tanh(drive); }
  const w = ctx.createWaveShaper(); w.curve = c; return w;
}

export function makeColour(kit, name) {
  const { ctx, S, noise } = kit, C = S.colours, P = C[name], LEVEL = C.level;
  const input = gain(ctx, 1), output = gain(ctx, 1), stops = [], ticks = [];
  const keep = (...n) => stops.push(...n);
  if (name === "gramophone") {                                     // a narrow band, a gentle saturation, a slow warble, crackle
    const d = ctx.createDelay(0.1); d.delayTime.value = P.delay;
    chain(input, filt(ctx, "highpass", P.highpass), filt(ctx, "lowpass", P.lowpass), shaper(ctx, P.drive, C.shaper), d, gain(ctx, LEVEL.gramophone), output);
    keep(lfo(ctx, P.warble, d.delayTime));
    const K = P.crackle, c = src(kit, noise.white), cg = gain(ctx, 0); chain(c, filt(ctx, "highpass", K.highpass), cg, output); keep(c);
    const h = src(kit, noise.white), hg = gain(ctx, P.hiss.level); chain(h, filt(ctx, "highpass", P.hiss.highpass), hg, output); keep(h);
    ticks.push((from, to) => { for (let t = from + Math.random() * K.start; t < to; t += K.every[0] + Math.random() * K.every[1]) {
      cg.gain.setValueAtTime(K.level[0] + Math.random() * K.level[1], t); cg.gain.setTargetAtTime(0, t + K.hold, K.tc); } });
  } else if (name === "radio") {                                   // thin, a little off the station, a faint hiss
    const d = ctx.createDelay(0.1); d.delayTime.value = P.delay;
    const pk = filt(ctx, "peaking", P.peak.frequency, P.peak.q); pk.gain.value = P.peak.gain;
    chain(input, filt(ctx, "highpass", P.highpass), pk, filt(ctx, "lowpass", P.lowpass), shaper(ctx, P.drive, C.shaper), d, gain(ctx, LEVEL.radio), output);
    keep(lfo(ctx, P.warble, d.delayTime));
    const H = P.hiss, h = src(kit, noise.white), hg = gain(ctx, H.level); chain(h, filt(ctx, "bandpass", H.band, H.q), hg, output); keep(h, lfo(ctx, H.sway, hg.gain));
  } else if (name === "music_box") {
    chain(input, filt(ctx, "highpass", P.highpass), gain(ctx, LEVEL.music_box), output);
  } else if (name === "far_away") {                                // dull, with a long soft echo
    chain(input, filt(ctx, "lowpass", P.lowpass), gain(ctx, P.dry * LEVEL.far_away), output);
    const E = P.echo, d = ctx.createDelay(1); d.delayTime.value = E.delay; const fb = gain(ctx, E.feedback), lp = filt(ctx, "lowpass", E.lowpass);
    input.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(gain(ctx, E.level * LEVEL.far_away)).connect(output);
  } else if (name === "through_wall") {                            // muffled
    const ls = filt(ctx, "lowshelf", P.shelf.frequency); ls.gain.value = P.shelf.gain;
    chain(input, filt(ctx, "lowpass", P.lowpass), ls, gain(ctx, LEVEL.through_wall), output);
  } else if (name === "underwater") {                              // dark, wavering
    const d = ctx.createDelay(0.1); d.delayTime.value = P.delay; const lp = filt(ctx, "lowpass", P.lowpass);
    chain(input, d, lp, gain(ctx, LEVEL.underwater), output); keep(lfo(ctx, P.warble, d.delayTime), lfo(ctx, P.sweep, lp.frequency));
  } else chain(input, output);                                     // clean
  return { input, output, tick: (a, b) => ticks.forEach(fn => fn(a, b)), stop(t) { for (const n of stops) { try { n.stop(t); } catch (e) {} } } };
}
