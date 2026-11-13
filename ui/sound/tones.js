// Room tones (MUSIC.md §3): what a place sounds like under the music, filtered noise and a few small random events (drops of
// rain, a cave's drips, a fire's crackle, a crowd's murmur). A plain function of the kit (ui/sound/synth.js) and a destination:
// no globals, no knowledge of the game. Every number is the spec's (content/music.js, `tones`). The events' randomness is the
// player's own, never the game's.
//
//   makeTone(kit, name, dest, level) → { tick(from, to), stop(t), close() }   at `level` (its gain from its level: ui/sound/loudness.js); tick
//                                                                    schedules the small events between two audio times; close lets go of its output once stopped

import { src, filt, gain, lfo, chain } from "./synth.js?v=0.48.0";

export function makeTone(kit, name, dest, level = 1) {
  const { ctx, S, noise } = kit, T = S.tones[name] || {};
  const out = gain(ctx, level); out.connect(dest);
  const stops = [], ticks = [], keep = (...n) => stops.push(...n);
  // Events at random times between two audio times, `every` [least, spread] apart, the first `start` × random in.
  const events = (from, to, start, [least, spread], fn) => { for (let t = from + Math.random() * start; t < to; t += least + Math.random() * spread) fn(t); };
  if (name === "fog") {
    const s = src(kit, noise.brown), g = gain(ctx, T.level); chain(s, filt(ctx, "lowpass", T.lowpass), g, out); keep(s, lfo(ctx, T.sway, g.gain));
  } else if (name === "rain") {
    const H = T.hiss, R = T.roof, D = T.drops;
    const s = src(kit, noise.white), g = gain(ctx, H.level); chain(s, filt(ctx, "highpass", H.highpass), filt(ctx, "lowpass", H.lowpass), g, out); keep(s);
    const d = src(kit, noise.white), dg = gain(ctx, 0); chain(d, filt(ctx, "bandpass", D.band, D.q), dg, out); keep(d);
    const roof = src(kit, noise.brown), rg = gain(ctx, R.level); chain(roof, filt(ctx, "lowpass", R.lowpass), rg, out); keep(roof);
    ticks.push((from, to) => events(from, to, D.start, D.every, (t) => {
      dg.gain.setValueAtTime(D.level[0] + Math.random() * D.level[1], t); dg.gain.setTargetAtTime(0, t + D.hold, D.tc); }));
  } else if (name === "wind") {
    const s = src(kit, noise.pink), bp = filt(ctx, "bandpass", T.band, T.q), g = gain(ctx, T.level); chain(s, bp, g, out);
    keep(s, lfo(ctx, T.sweep, bp.frequency), lfo(ctx, T.sway, g.gain));
  } else if (name === "water") {
    const s = src(kit, noise.brown), g = gain(ctx, T.level); chain(s, filt(ctx, "lowpass", T.lowpass), g, out); keep(s, lfo(ctx, T.sway, g.gain));
    const L = T.lap, s2 = src(kit, noise.pink), g2 = gain(ctx, L.level); chain(s2, filt(ctx, "bandpass", L.band, L.q), g2, out); keep(s2, lfo(ctx, L.sway, g2.gain));
  } else if (name === "cave") {
    const s = src(kit, noise.brown), g = gain(ctx, T.level); chain(s, filt(ctx, "lowpass", T.lowpass), g, out); keep(s);
    const D = T.drips;
    ticks.push((from, to) => events(from, to, D.start, D.every, (t) => {
      const o = ctx.createOscillator(), og = gain(ctx, 0), f = D.pitch[0] + Math.random() * D.pitch[1];
      o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * D.fall, t + D.glide);
      og.gain.setValueAtTime(D.level, t); og.gain.setTargetAtTime(0, t + D.hold, D.tc);
      o.connect(og); og.connect(out); o.start(t); o.stop(t + D.len); }));
  } else if (name === "hall") {
    const s = src(kit, noise.pink), g = gain(ctx, T.level); chain(s, filt(ctx, "lowpass", T.lowpass), g, out); keep(s);
  } else if (name === "hum") {                                     // the mains: 50 Hz and its second harmonic
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = T.hz; o.start();
    const lp = filt(ctx, "lowpass", T.lowpass, T.q), g = gain(ctx, T.level); chain(o, lp, g, out); keep(o, lfo(ctx, T.sweep, lp.frequency));
    const h = ctx.createOscillator(); h.frequency.value = T.second.hz; h.start(); const hg = gain(ctx, T.second.level); chain(h, hg, out); keep(h);
  } else if (name === "crowd") {
    const C = T.chatter;
    const s = src(kit, noise.pink), g = gain(ctx, T.level); chain(s, filt(ctx, "bandpass", T.band, T.q), g, out); keep(s);
    const s2 = src(kit, noise.pink), g2 = gain(ctx, C.level); chain(s2, filt(ctx, "bandpass", C.band, C.q), g2, out); keep(s2);
    ticks.push((from, to) => { for (let t = from; t < to; t += T.every) {
      g.gain.setTargetAtTime(T.murmur[0] + Math.random() * T.murmur[1], t, T.murmurTc); g2.gain.setTargetAtTime(Math.random() * T.chatterTo, t, T.chatterTc); } });
  } else if (name === "fire") {
    const s = src(kit, noise.brown), g = gain(ctx, T.level); chain(s, filt(ctx, "lowpass", T.lowpass), g, out); keep(s, lfo(ctx, T.sway, g.gain));
    const K = T.crackle, c = src(kit, noise.white), cg = gain(ctx, 0); chain(c, filt(ctx, "highpass", K.highpass), cg, out); keep(c);
    ticks.push((from, to) => events(from, to, K.start, K.every, (t) => {
      cg.gain.setValueAtTime(K.level[0] + Math.random() * K.level[1], t); cg.gain.setTargetAtTime(0, t + K.hold, K.tc[0] + Math.random() * K.tc[1]); }));
  }                                                                // silence: nothing
  return { tick: (a, b) => ticks.forEach(fn => fn(a, b)), stop(t) { for (const n of stops) { try { n.stop(t); } catch (e) {} } },
           close() { out.disconnect(); } };   // (once it has stopped: its output, so the nodes behind it can be let go)
}
