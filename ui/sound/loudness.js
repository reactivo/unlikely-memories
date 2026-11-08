// Even loudness (docs/sound/PLAN.md, build 1b; MUSIC.md §6c): one meter for everything that makes music or sound. Each part (a
// world's instrument at an octave, a room tone, a colour, a sound's instrument) is rendered on an OfflineAudioContext by the same
// code that plays it live, its perceived loudness measured, and the gain that brings it to its target returned. Each part is
// measured once per device: remembered in memory and saved in the browser's storage, keyed by the part's numbers and the meter's
// version. Until a part is measured it plays at its written level; a render that fails or isn't supported leaves it there. It knows
// nothing of the game or of music: it is given a key and a function that plays the part, `play(ctx, dest)`.
//
// The arithmetic is pure (it runs in Node: tests/loudness.test.js):
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
//   keyOf(what, numbers)               → the cache key: the meter's version, what it is, a hash of its numbers
//   toDb(ms)                           mean square → dB
// The meter (browser):
//   createMeter(opts) → { known(key), failed(key), gainOf(key, target), measure(key, play, seconds, slices), want(parts, first), on(fn), info() }
//   opts.seed: { key: [full, phone] }, results measured by the developer's tool and shipped with the game (content/loudness.seed.js),
//   used until this device has measured the part itself (its own result wins); a key that doesn't match (the numbers changed) has none.
//   a part: { key, play(ctx, dest), seconds, slices, heavy? }: play makes the whole render, slice k starting at k × seconds / slices;
//   `heavy`: too heavy to render on a phone (an iPhone froze, 8 November 2026): the seed's result, never measured here unless the seed lacks it

export const VERSION = 1;                         // change it when the meter or the code that plays a part changes: all is measured again
export const STORE = "parser-loudness";           // the browser's storage, one entry: { v, parts: { key: [full, phone] } }

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

// ---- The meter (browser) ----------------------------------------------------------------------------------------------------------
// opts: { storage (localStorage, or null), Offline (the OfflineAudioContext constructor; found if not given), rate (Hz), gap (ms
// between renders, so a phone never stutters), limits (± dB), now () → ms, seed ({ key: [full, phone] }) }.
export function createMeter(opts = {}) {
  const rate = opts.rate ?? 44100, gap = opts.gap ?? 40, limits = opts.limits ?? 24, now = opts.now ?? (() => performance.now());
  const Offline = opts.Offline !== undefined ? opts.Offline
    : typeof window !== "undefined" ? (window.OfflineAudioContext || window.webkitOfflineAudioContext || null) : null;
  const storage = opts.storage !== undefined ? opts.storage : (() => { try { return window.localStorage; } catch (e) { return null; } })();
  const parts = new Map();                         // key → { full, phone, loudness, from: "storage" | "fresh" } (or { failed: true })
  const seeds = new Map();                         // key → { full, phone, loudness, from: "seed" }: until this device measures it
  for (const [k, v] of Object.entries(opts.seed || {}))
    if (Array.isArray(v) && v.length === 2 && v.every(Number.isFinite)) seeds.set(k, { full: v[0], phone: v[1], loudness: combine(v[0], v[1]), from: "seed" });
  const own = (key) => { const p = parts.get(key); return p && !p.failed ? p : null; };
  const best = (key) => own(key) ?? seeds.get(key) ?? null;    // this device's result, else the seed's
  const queue = [], queued = new Set(), listeners = [];
  let busy = false, saveTimer = null, ms = 0, renders = 0, audio = 0;   // (audio: seconds of sound rendered)

  try {                                            // what this device measured before (this version only)
    const saved = storage && JSON.parse(storage.getItem(STORE) || "null");
    if (saved && saved.v === VERSION && saved.parts) for (const [k, v] of Object.entries(saved.parts))
      if (Array.isArray(v) && v.length === 2 && v.every(Number.isFinite)) parts.set(k, { full: v[0], phone: v[1], loudness: combine(v[0], v[1]), from: "storage" });
  } catch (e) {}
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        if (!storage) return;
        const out = {};
        for (const [k, p] of parts) if (!p.failed) out[k] = [Math.round(p.full * 100) / 100, Math.round(p.phone * 100) / 100];
        storage.setItem(STORE, JSON.stringify({ v: VERSION, parts: out }));
      } catch (e) {}
    }, 500);
  }

  // Render `seconds` of the part and measure it, in `slices`. → its record (or { failed }).
  async function measure(key, play, seconds = 3, slices = 1) {
    if (parts.has(key) && !parts.get(key).failed) return parts.get(key);
    const t0 = now();
    let rec;
    try {
      if (!Offline) throw new Error("no OfflineAudioContext");
      const ctx = new Offline(1, Math.ceil(rate * seconds), rate);       // the three-argument form: Safari's prefixed one takes only this
      play(ctx, ctx.destination);
      const buf = await new Promise((resolve, reject) => {
        ctx.oncomplete = (e) => resolve(e.renderedBuffer);                // (old Safari: an event, no promise)
        const p = ctx.startRendering();
        if (p && p.then) p.then(resolve, reject);
      });
      const { full, phone } = await slicesOf(buf.getChannelData(0), buf.sampleRate, slices);
      rec = { full, phone, loudness: combine(full, phone), from: "fresh" };
    } catch (e) {
      rec = { failed: true, why: String(e && e.message || e) };
    }
    ms += now() - t0; renders++; audio += seconds;
    parts.set(key, rec);
    if (!rec.failed) save();
    for (const fn of listeners) { try { fn(key, rec); } catch (e) {} }
    return rec;
  }

  // Each slice weighed in its own task (a long render's arithmetic never holds the page for long).
  async function slicesOf(x, sr, n) {
    const len = Math.floor(x.length / n);
    let full = 0, phone = 0;
    for (let k = 0; k < n; k++) {
      if (k) await new Promise(r => setTimeout(r, 0));
      const w = weigh(x.subarray(k * len, (k + 1) * len), sr); full += w.full / n; phone += w.phone / n;
    }
    return { full: toDb(full), phone: toDb(phone) };
  }

  // In the background, one at a time, `gap` ms apart: parts not yet known ({ key, play, seconds, slices }); `first`: ahead of the rest.
  function want(list, first = false) {
    const fresh = list.filter(p => !parts.has(p.key) && !queued.has(p.key) && !(p.heavy && seeds.has(p.key)));
    for (const p of fresh) queued.add(p.key);
    if (first) queue.unshift(...fresh); else queue.push(...fresh);
    pump();
  }
  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    const p = queue.shift();
    measure(p.key, p.play, p.seconds, p.slices).finally(() => {
      queued.delete(p.key);
      setTimeout(() => { busy = false; pump(); }, gap);
    });
  }

  return {
    known: best,
    measured: own,
    failed: (key) => !!parts.get(key)?.failed,
    // The gain for a part, or null while it isn't measured (or failed): then its written level.
    gainOf(key, target) { const p = best(key); return p ? gainFor(p.loudness, target, limits) : null; },
    measure, want,
    on(fn) { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); },
    get busy() { return busy || queue.length > 0; },
    // How many parts are known (from storage, measured fresh, failed), how many wait, and the time spent rendering (ms).
    info() {
      let stored = 0, fresh = 0, failed = 0, seeded = 0;
      for (const p of parts.values()) p.failed ? failed++ : p.from === "storage" ? stored++ : fresh++;
      for (const k of seeds.keys()) if (!own(k)) seeded++;
      return { stored, fresh, failed, seeded, pending: queue.length + (busy ? 1 : 0), renders, ms: Math.round(ms), audio: Math.round(audio), supported: !!Offline };
    }
  };
}
