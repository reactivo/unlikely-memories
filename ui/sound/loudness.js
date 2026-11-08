// Even loudness (MUSIC.md §6c): the meter's arithmetic, the parts' keys, and the levels every part plays at. Each part (a world's
// instrument at an octave, a room tone, a colour, a sound's instrument) has a level: its perceived loudness, measured once when it is
// made (ui/sound/measure.js: the developer's tool for the shared parts and the shipped worlds, the world-making step for a world the
// game's AI writes), as [full range, phone] in dB. The player turns a level into a gain with plain arithmetic and never measures
// anything. All of it is pure (it runs in Node: tests/loudness.test.js).
//
//   coeffs(type, f, q, gainDb, rate)   a biquad's coefficients (the Audio EQ Cookbook's): "highpass", "highshelf"
//   run(x, c)                          samples through a biquad
//   loudest(x, rate, window)           the loudest mean square over `window` seconds
//   weigh(x, rate)                     → { full, phone } as mean squares: the loudest 400 ms through the K-weighting-like curve (a
//                                      +4 dB shelf above ~1.7 kHz, a high-pass at 38 Hz), and that again through a phone speaker's
//                                      high-pass (300 Hz, 24 dB/octave)
//   weighSlices(x, rate, n)            → { full, phone } in dB: the buffer cut into n equal slices (a part played n times, or its n
//                                      notes, one a slice), each weighed, their mean squares averaged (so noise's chance moves it little)
//   combine(full, phone)               → the one loudness the gain is set from: their mean in dB, but never more than `most` dB
//                                      under the full range (MUSIC.md §6c, why)
//   gainFor(loudness, target, limits)  → the linear gain that brings it to the target, kept within ± limits dB
//   keyOf(what, numbers)               → a part's key: the meter's version, what it is, a hash of its numbers
//   toDb(ms)                           mean square → dB
//   createLevels(S, ...tables)         → { gain(part), level(key), has(key) }: the levels at play time, from tables of
//                                      { key: [full, phone] } (the shared ones, content/levels.js; a world's, its music's `levels`)

export const VERSION = 1;                         // change it when the meter or the code that plays a part changes: all is measured again

// ---- The arithmetic -------------------------------------------------------------------------------------------------------------
export const toDb = (ms) => 10 * Math.log10(ms + 1e-12);

export function coeffs(type, f, q, gainDb, rate) {
  const w = 2 * Math.PI * f / rate, cos = Math.cos(w), alpha = Math.sin(w) / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (type === "highpass") {
    b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2; a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  } else if (type === "highshelf") {
    const A = Math.pow(10, gainDb / 40), s = 2 * Math.sqrt(A) * alpha;
    b0 = A * ((A + 1) + (A - 1) * cos + s); b1 = -2 * A * ((A - 1) + (A + 1) * cos); b2 = A * ((A + 1) + (A - 1) * cos - s);
    a0 = (A + 1) - (A - 1) * cos + s; a1 = 2 * ((A - 1) - (A + 1) * cos); a2 = (A + 1) - (A - 1) * cos - s;
  } else throw new Error("coeffs: " + type);
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
}

export function run(x, [b0, b1, b2, a1, a2]) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i], o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o;
  }
  return y;
}

export function loudest(x, rate, window = 0.4) {
  const w = Math.max(1, Math.min(x.length, Math.round(rate * window)));
  let acc = 0, best = 0;
  for (let i = 0; i < x.length; i++) {
    acc += x[i] * x[i];
    if (i >= w) acc -= x[i - w] * x[i - w];
    if (i >= w - 1 && acc > best) best = acc;
  }
  return Math.max(0, best) / w;
}

// The curves: K-weighting's two stages (ITU-R BS.1770: a shelf of +4 dB from about 1.7 kHz, how the head hears; a high-pass at
// 38 Hz), and a phone speaker on top of that (two high-passes at 300 Hz: a phone plays almost nothing below).
export const CURVE = { shelf: [1682, 0.707, 4], low: [38, 0.5], phone: [300, 0.707], window: 0.4 };
export function weigh(x, rate, C = CURVE) {
  const k = run(run(x, coeffs("highshelf", C.shelf[0], C.shelf[1], C.shelf[2], rate)), coeffs("highpass", C.low[0], C.low[1], 0, rate));
  const hp = coeffs("highpass", C.phone[0], C.phone[1], 0, rate), p = run(run(k, hp), hp);
  return { full: loudest(k, rate, C.window), phone: loudest(p, rate, C.window) };
}
export function weighSlices(x, rate, n = 1, C = CURVE) {
  const len = Math.floor(x.length / n);
  let full = 0, phone = 0;
  for (let k = 0; k < n; k++) { const w = weigh(x.subarray(k * len, (k + 1) * len), rate, C); full += w.full / n; phone += w.phone / n; }
  return { full: toDb(full), phone: toDb(phone) };
}

// One number from the two: their mean in dB, so the gain set from it is wrong by the same amount on a phone and on full-range speakers
// (headphones, a laptop with some bass), the least it can be on both: half their difference. But never more than `most` dB under the
// full range: a part whose sound is mostly below what a phone can play (a low drone, a room's rumble) isn't chased on the phone, where
// no gain would make it heard, at the cost of booming in headphones. (MUSIC.md §6c, measured on the seven worlds.)
export const MOST = 4;
export const combine = (full, phone, most = MOST) => full - Math.min((full - phone) / 2, most);

export function gainFor(loudness, target, limits = 24) {
  if (!Number.isFinite(loudness) || loudness < -100) return 1;      // silence: nothing to bring up
  const db = Math.max(-limits, Math.min(limits, target - loudness));
  return Math.pow(10, db / 20);
}

// FNV-1a, 32 bits, as hex: a short stand-in for a part's numbers.
export function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}
// Numbers in a stable order (an object's keys sorted), so the same part always has the same key.
export function stable(v) {
  if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
  if (v && typeof v === "object") return "{" + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
  return typeof v === "number" ? String(Math.round(v * 1e4) / 1e4) : JSON.stringify(v);
}
export const keyOf = (what, numbers) => `v${VERSION}:${what}:${hash(stable(numbers))}`;

// A level as written in a table: [full, phone], two numbers in dB.
export const isLevel = (v) => Array.isArray(v) && v.length === 2 && v.every(Number.isFinite);

// ---- The levels at play time --------------------------------------------------------------------------------------------------
// The tables are read in order, the first that has a key wins. A part's gain: its group's target (S.loudness.targets; a colour's,
// its reference notes' loudness, clean) less its loudness, within ± limits; null for a part with no level (it plays as written).
export function createLevels(S, ...tables) {
  const level = (key) => { for (const t of tables) if (t && isLevel(t[key])) return t[key]; return null; };
  const loudness = (key) => { const l = level(key); return l ? combine(l[0], l[1]) : null; };
  const targetOf = (part) => (part.group === "colours" ? loudness(part.ref) : S.loudness.targets[part.group] ?? null);
  return {
    level, loudness, has: (key) => !!level(key), targetOf,
    gain(part) {
      const l = loudness(part.key), t = targetOf(part);
      return l == null || t == null ? null : gainFor(l, t, S.loudness.limits);
    }
  };
}
