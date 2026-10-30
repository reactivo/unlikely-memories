// Picture effects, in one place so they're easy to change or add to (ART-DIRECTION.md §6). Purely visual: they
// never touch the game state, so the cycles' randomness is plain Math.random() (ARCHITECTURE.md §4); the filters' is a
// hash of the pixel and the moment, so the same moment always draws the same.
// (How one picture changes into another, a room's or an ending's, is not here: it is all in ui/transitions.js.)

import { lit } from "./draw.js";

// Palette cycling styles: which step of its colour list a cycle shows at a moment. Each gets the cycle's
// own fields (from the picture data), its own little memory (`mem`), the time since it started and now.
// Returns a step number; the pixel's colour moves that many places along the list.
export const CYCLES = {
  // Every pixel steps along the colours, in a loop: water, conveyor belts, flowing light.
  rotate: (c, mem, elapsed) => Math.floor(elapsed / c.ms) % c.colors.length,
  // Forward then back: breathing glows, pulsing neon.
  pingpong: (c, mem, elapsed) => {
    const n = c.colors.length, k = Math.floor(elapsed / c.ms) % (2 * (n - 1));
    return k < n ? k : 2 * (n - 1) - k;
  },
  // Switches between two colours on a fixed beat: a camera's light, an alarm.
  blink: (c, mem, elapsed) => Math.floor(elapsed / c.ms) % 2,
  // Mostly steady; now and then (a random wait within c.ms = [min, max]) it jumps to another colour for a
  // moment, sometimes twice: faulty lamps, candlelight.
  flicker: (c, mem, elapsed, now) => {
    if (mem.until === undefined) { mem.until = now + between(c.ms[0], c.ms[1]); mem.step = 0; }
    if (now >= mem.until) {
      if (mem.step === 0) { mem.step = 1 + Math.floor(Math.random() * (c.colors.length - 1)); mem.until = now + between(40, 140); }
      else { mem.step = 0; mem.until = now + (Math.random() < 0.3 ? between(40, 120) : between(c.ms[0], c.ms[1])); }
    }
    return mem.step;
  }
};

// Picture filters (ARCHITECTURE.md §7, "Picture"): drawn on the whole scene while the state has them on (the
// `filter` effect, or a condition's `filters`; js/filters.js says which there are and how they are named). Each works on
// the picture's own low-res pixels, before the browser scales them: it takes the picture { px: palette numbers, one per
// pixel, row by row; w, h; rgb: the colour of each palette number }, its tunables from content/art.js (effects.filters),
// the ms since it came on, whether motion is reduced (`calm`) and its parameter ("tint:cold": "cold"), and returns the
// picture to show (a new one: it never changes what it is given). Several on: drawn one after another in content/art.js's
// order. Cheap (one pass over the pixels), language-free, never the game's state; their randomness is a hash of the
// pixel and the moment, so the same moment draws the same. With reduced motion each holds still in a way that still shows,
// except shake, which is then off.
export const FILTERS = {
  // Bigger blocks, less detail: each block of o.block pixels shows the colour at its middle.
  mosaic: (pic, o) => {
    const { px, w, h } = pic, b = o.block, out = new Array(px.length);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = Math.min(w - 1, x - (x % b) + (b >> 1)), sy = Math.min(h - 1, y - (y % b) + (b >> 1));
      out[y * w + x] = px[sy * w + sx];
    }
    return { ...pic, px: out };
  },
  // The scene sways: each row slides sideways along a slow wave that drifts down the picture (drunk, dizzy, seasick).
  sway: (pic, o, t, calm) => {
    const { px, w, h } = pic, out = new Array(px.length), phase = calm ? o.still : (t % o.ms) / o.ms;
    for (let y = 0; y < h; y++) {
      const dx = Math.round(o.amplitude * Math.sin(2 * Math.PI * (y / o.rows + phase)));
      for (let x = 0; x < w; x++) out[y * w + x] = px[y * w + Math.min(w - 1, Math.max(0, x - dx))];
    }
    return { ...pic, px: out };
  },
  // A jolt, once: the whole picture shakes back and forth, less and less, for o.ms after it came on (black shows at the
  // edge it leaves). Then, and with reduced motion, nothing.
  shake: (pic, o, t, calm) => {
    if (calm || t >= o.ms) return pic;
    const p = t / o.ms, fade = 1 - p, turn = 2 * Math.PI * o.shakes * p;
    const dx = Math.round(o.amplitude * fade * Math.sin(turn)), dy = Math.round(o.amplitude * 0.5 * fade * Math.sin(turn * 1.7));
    return { ...pic, px: shifted(pic, dx, dy, 0) };
  },
  // Seeing double: a second copy o.dx, o.dy off, drawn on every other pixel (a checkerboard), so it reads as see-through.
  ghost: (pic, o) => {
    const { px, w } = pic, copy = shifted(pic, o.dx, o.dy, null), out = px.slice();
    for (let k = 0; k < px.length; k++) if ((((k % w) + Math.floor(k / w)) & 1) && copy[k] !== null) out[k] = copy[k];
    return { ...pic, px: out };
  },
  // A bad signal: a share of the pixels, a new sprinkle every o.ms, flicker to one of o.colors. Reduced motion: one
  // sprinkle (o.still), held.
  static: (pic, o, t, calm) => {
    const { px } = pic, out = px.slice(), moment = calm ? -1 - o.still : Math.floor(t / o.ms), limit = o.share * 4294967296;
    for (let k = 0; k < px.length; k++) {
      const r = hash(k, moment);
      if (r < limit) out[k] = o.colors[r % o.colors.length];
    }
    return { ...pic, px: out };
  },
  // Darkness from the edges: past o.from (0 the middle, 1 the middle of an edge) more and more pixels go black, by the
  // picture's own dither, until all are at o.to.
  vignette: (pic, o) => {
    const { px, w, h } = pic, out = px.slice(), cx = (w - 1) / 2, cy = (h - 1) / 2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const d = Math.hypot((x - cx) / cx, (y - cy) / cy), level = (d - o.from) / (o.to - o.from);
      if (level > 0 && lit(x, y, level)) out[y * w + x] = 0;
    }
    return { ...pic, px: out };
  },
  // The 16 colours swapped for another set: the pixels stay, the palette changes (o.palettes[param], each a list of 16).
  tint: (pic, o, t, calm, param) => ({ ...pic, rgb: o.palettes[param].map(hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))) })
};

// The filters that move (the scene redraws them every frame while they are on, unless motion is reduced); the others are
// drawn once, when they come on.
export const MOVING = new Set(["sway", "shake", "static"]);

// The picture's pixels moved dx right and dy down; where nothing comes in, `blank`.
function shifted({ px, w, h }, dx, dy, blank) {
  const out = new Array(px.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = x - dx, sy = y - dy;
    out[y * w + x] = sx >= 0 && sx < w && sy >= 0 && sy < h ? px[sy * w + sx] : blank;
  }
  return out;
}
// A pixel's and a moment's own number, 0 to 2³² − 1 (the same for the same two).
function hash(a, b) {
  let x = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return x >>> 0;
}

const between = (min, max) => min + Math.random() * (max - min);
