// Picture effects, in one place so they're easy to change or add to (ART-DIRECTION.md §6). Purely visual: they
// never touch the game state, so the cycles' randomness is plain Math.random() (ARCHITECTURE.md §4); the filters' is a
// hash of the pixel and the moment, so the same moment always draws the same.
// (How one picture changes into another, a room's or an ending's, is not here: it is all in ui/transitions.js.)

import art from "../content/art.js?v=0.50.0";
import { lit, rgbOf, scrollPlan, scrollInto, drawLoop } from "./draw.js?v=0.50.0";
import { colorsOf, areaPixels } from "../js/picture.js?v=0.50.0";

// A tint's palette as [r, g, b] colours, parsed once for each palette (the scene asks every frame).
const tints = new WeakMap();
const tinted = (palette) => { if (!tints.has(palette)) tints.set(palette, palette.map(rgbOf)); return tints.get(palette); };

// The step a cycle's style is at on its k-th tick, for a colour list of n: rotate 0, 1 … n−1, 0; pingpong 0 … n−1 … 1, 0; blink 0, 1.
// The one place the three are written (a scattered cycle gives each pixel its own k: scatterStep below).
const TICKED = {
  rotate: (n, k) => k % n,
  pingpong: (n, k) => { const p = 2 * (n - 1); k %= p; return k < n ? k : p - k; },
  blink: (n, k) => k % 2
};
// How many ticks a style goes through before it repeats (what a scattered pixel's phase is taken modulo).
const periodOf = (style, n) => style === "pingpong" ? Math.max(1, 2 * (n - 1)) : style === "blink" ? 2 : n;

// Palette cycling styles: which step of its colour list a cycle shows at a moment. Each gets the cycle's
// own fields (from the picture data), its own little memory (`mem`), the time since it started and now.
// Returns a step number; the pixel's colour moves that many places along the list.
export const CYCLES = {
  // Every pixel steps along the colours, in a loop: water, conveyor belts, flowing light.
  rotate: (c, mem, elapsed) => TICKED.rotate(c.colors.length, Math.floor(elapsed / c.ms)),
  // Forward then back: breathing glows, pulsing neon.
  pingpong: (c, mem, elapsed) => TICKED.pingpong(c.colors.length, Math.floor(elapsed / c.ms)),
  // Switches between two colours on a fixed beat: a camera's light, an alarm.
  blink: (c, mem, elapsed) => TICKED.blink(c.colors.length, Math.floor(elapsed / c.ms)),
  // Mostly steady; now and then (a random wait within c.ms = [min, max]) it jumps to another colour for a
  // moment, sometimes twice: faulty lamps, candlelight.
  flicker: (c, mem, elapsed, now) => {
    if (mem.until === undefined) { mem.until = now + between(c.ms[0], c.ms[1]); mem.step = 0; }
    if (now >= mem.until) {
      if (mem.step === 0) { mem.step = 1 + Math.floor(Math.random() * (c.colors.length - 1)); mem.until = now + between(40, 140); }
      else { mem.step = 0; mem.until = now + (Math.random() < 0.3 ? between(40, 120) : between(c.ms[0], c.ms[1])); }
    }
    return mem.step;
  },
  // Not a palette cycle: the area's own pixels slide one pixel along c.dir every c.ms, every line wrapping over the area's whole extent
  // so rows across the flow stay straight (the waterfall's pattern falling; ui/draw.js, scrollPlan and scrollInto). Its "step" is how
  // many slides so far (taken modulo the area's extent). Waterfalls, streams, conveyors, rain on a window.
  scroll: (c, mem, elapsed) => Math.floor(elapsed / c.ms)
};

// Scatter (a cycle's `scatter: true`, on rotate, pingpong, blink and flicker): each pixel has its own phase, so a field shimmers
// instead of changing all at once. Pure, and the same for the same picture: a pixel's phase is a hash of its index, never random.
// `scatterTick` is the moment as a whole number (the tick the cycle is at; for flicker the time window), and `scatterStep` the step
// pixel k (its index in the picture) shows at that tick. The scene redraws when the tick changes.
export function scatterTick(c, elapsed) {
  if (c.style === "flicker") return Math.floor(elapsed / art.effects.scatter.window);
  return Math.floor(elapsed / c.ms) % periodOf(c.style, c.colors.length);
}
// How many pixels of a scattered flicker jump in one window (0 to 1): the window over the mean of the cycle's own `ms` [min, max], so each
// pixel flickers on average once in that mean.
export const scatterShare = (c) => Math.min(1, art.effects.scatter.window / (Array.isArray(c.ms) ? (c.ms[0] + c.ms[1]) / 2 : c.ms));
export function scatterStep(c, k, tick) {
  const n = c.colors.length;
  if (c.style === "flicker") {
    // In a window a pixel jumps (to a colour of its own, not its first) when its hash falls under the share; else it rests.
    if (n < 2 || hash(k, tick) >= scatterShare(c) * 4294967296) return 0;
    return 1 + hash(tick, k ^ 0x5bd1e995) % (n - 1);
  }
  const p = periodOf(c.style, n);
  return TICKED[c.style](n, tick + hash(k, 0) % p);
}
const isScatter = (c) => c.scatter && c.style !== "scroll" && !c.sweep;

// A cycle made ready for a picture, once: { c (with its colours as `rest` extends them), pixels (the ones it moves), start (where each
// starts in c.colors), own (where it is painted in them), plan (a scroll's), mem, t0 }. `px` is the picture as painted, `areas` what each
// shape id shows. A sweep (rotate only; `sweep: true`, or a list of whole numbers, one for each entry of `areas`) takes every pixel painted
// in one of the colours, each starting at (its own colour's place in the list − its area's step) mod the number of colours; a group of
// ids is one area. Otherwise only the pixels painted in one of the colours, each starting at its own.
export function prepareCycle(c0, px, areas, w, h, t0 = 0) {
  const colors = colorsOf(c0), c = colors === c0.colors ? c0 : { ...c0, colors };
  const pixels = [], start = [], own = [], scroll = c.style === "scroll", sweep = c.style === "rotate" && c.sweep;
  (c.areas || []).forEach((a, ai) => {
    const list = areaPixels(a, areas, w, h), n = scroll ? 0 : colors.length, off = sweep ? (Array.isArray(c.sweep) ? c.sweep[ai] : ai) : 0;
    for (const k of list) {
      if (scroll) { pixels.push(k); continue; }
      const i = colors.indexOf(px[k]);
      if (i >= 0) { pixels.push(k); own.push(i); start.push((((i - off) % n) + n) % n); }
    }
  });
  return { c, pixels, start, own, plan: scroll ? scrollPlan(pixels, c.dir, w) : null, mem: {}, t0 };
}

// What a cycle does to the frame at this step (the scene's `steps`; a scatter cycle's is its scatterTick). `cy` is a prepared cycle (prepareCycle);
// `layer` { src, covered } the painted picture a scroll takes its pattern from and the pixels an overlay covers (it leaves those alone).
// A sweep shows every one of its pixels at its own place at every step, step 0 included. No allocation: one pass over the cycle's pixels.
export function cycleInto(out, cy, step, layer) {
  const c = cy.c;
  if (c.style === "scroll") { if (step) scrollInto(out, layer.src, layer.covered, cy.plan, step); return; }
  const cols = c.colors, n = cols.length, { pixels, start } = cy;
  if (c.sweep && c.style === "rotate") {
    for (let i = 0; i < pixels.length; i++) { const k = pixels[i]; if (out[k] === cols[cy.own[i]]) out[k] = cols[(start[i] + step) % n]; }
  } else if (c.scatter) {
    for (let i = 0; i < pixels.length; i++) { const k = pixels[i]; if (out[k] === cols[start[i]]) out[k] = cols[(start[i] + scatterStep(c, k, step)) % n]; }
  } else if (step) {
    for (let i = 0; i < pixels.length; i++) { const k = pixels[i]; if (out[k] === cols[start[i]]) out[k] = cols[(start[i] + step) % n]; }
  }
}

// Where every cycle and then every loop of a picture is at a moment, as one list of whole numbers (the scene redraws when it differs from
// the last: its `lastSteps`). `cycles` are prepared (prepareCycle), `loops` too ({ l, mem, t0 }), `still` is reduced motion: then no cycle
// is applied at all (steps 0), and a loop is at its first frame, a travelling one not drawn (-1). A scatter's number is its tick (the pixels
// each work out their own), a scroll's how far it has slid, a loop's the frame to show (loopStepOf).
export function stepsOf(cycles, loops, now, still) {
  const out = cycles.map(cy => {
    const c = cy.c;
    if (still || !CYCLES[c.style]) return 0;
    return isScatter(c) ? scatterTick(c, now - cy.t0) : CYCLES[c.style](c, cy.mem, now - cy.t0, now);
  });
  for (const lp of loops) out.push(loopStepOf(lp, now, still));
  return out;
}

// A loop's number at a moment: the frame to show; a travelling loop's (`path`, `travel`, `pause`) also says where it is, in whole pixels
// (frame + 8 × its place), and is -1 while it pauses, or always with reduced motion. Its frames keep playing as it goes.
export const PLACE = 4096, SHIFT = 1024;
export function loopStepOf(lp, now, still) {
  const l = lp.l;
  if (still) return l.path ? -1 : 0;
  const t = now - lp.t0, frame = loopFrame(l.style, l.frames.length, Math.floor(t / l.ms), lp.mem);
  if (!l.path) return frame;
  const along = t % (l.travel + l.pause);
  if (along >= l.travel) return -1;
  const u = along / l.travel, [[x1, y1], [x2, y2]] = l.path;
  return frame + 8 * ((Math.round(x1 + (x2 - x1) * u) + SHIFT) * PLACE + Math.round(y1 + (y2 - y1) * u) + SHIFT);
}
// The corner a travelling loop's number puts it at.
export const loopPlace = (step) => { const p = Math.floor(step / 8); return [Math.floor(p / PLACE) - SHIFT, p % PLACE - SHIFT]; };

// One frame of the picture's motion, drawn into `out` (the picture as it is): the scrolls (they move the painted pixels), then the loops over
// them, then the palette cycles. With reduced motion (`still`) no cycle is applied, a loop shows its first frame where it is, and a travelling
// loop is not drawn: the picture as it was drawn. `steps` is stepsOf's.
export function motionInto(out, cycles, loops, steps, layer, still, w, h) {
  if (!still) cycles.forEach((cy, j) => { if (cy.c.style === "scroll") cycleInto(out, cy, steps[j], layer); });
  loops.forEach((lp, j) => {
    const s = steps[cycles.length + j];
    if (s >= 0) drawLoop(out, lp.sprite, s % 8, w, h, lp.l.path ? loopPlace(s) : lp.sprite.at);
  });
  if (!still) cycles.forEach((cy, j) => { if (cy.c.style !== "scroll") cycleInto(out, cy, steps[j], layer); });
}

// Loops (a picture's `loops`: ART-DIRECTION.md §6.3): which of its n frames a loop shows on its t-th step. loop: 0, 1 … n−1, 0;
// pingpong: 0, 1 … n−1 … 1, 0; random: a different frame each step (never the one before), from `rand`, the loop's own memory in
// `mem` ({ tick, frame }). Steps are counted from when the picture came up; tick 0 is frame 0.
export function loopFrame(style, n, tick, mem, rand = Math.random) {
  if (style === "random") {
    if (mem.tick !== tick) { mem.tick = tick; mem.frame = n > 1 ? ((mem.frame ?? 0) + 1 + Math.floor(rand() * (n - 1))) % n : 0; }
    return mem.frame ?? 0;
  }
  return TICKED[style === "pingpong" ? "pingpong" : "rotate"](n, tick);
}

// Picture filters (ARCHITECTURE.md §7, "Picture"): drawn on the whole scene while the state has them on (the
// `filter` effect, or a condition's `filters`; js/filters.js says which there are and how they are named). Each works on
// the picture's own low-res pixels, before the browser scales them: it takes the picture { px: palette numbers, one per
// pixel, row by row; w, h; rgb: the colour of each palette number }, its tunables from content/art.js (effects.filters),
// the ms since it came on, whether motion is reduced (`calm`) and its parameter ("tint:cold": "cold"), and returns the
// picture to show (a new one: it never changes what it is given). Several on: drawn one after another in content/art.js's
// order. Cheap (one pass over the pixels), language-free, never the game's state; their randomness is a hash of the
// pixel and the moment, so the same moment draws the same. With reduced motion each holds still in a way that still shows,
// except the moments (shake, wave), which are then off.
export const FILTERS = {
  // Bigger blocks, less detail: each block of o.block pixels shows the colour at its middle.
  mosaic: (pic, o) => {
    const { px, w, h } = pic, b = o.block, out = px.slice();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = Math.min(w - 1, x - (x % b) + (b >> 1)), sy = Math.min(h - 1, y - (y % b) + (b >> 1));
      out[y * w + x] = px[sy * w + sx];
    }
    return { ...pic, px: out };
  },
  // The scene sways: each row slides sideways along a slow wave that drifts down the picture (drunk, dizzy, seasick).
  sway: (pic, o, t, calm) => {
    const { px, w, h } = pic, out = px.slice(), phase = calm ? o.still : (t % o.ms) / o.ms;
    for (let y = 0; y < h; y++) {
      const dx = Math.round(o.amplitude * Math.sin(2 * Math.PI * (y / o.rows + phase)));
      for (let x = 0; x < w; x++) out[y * w + x] = px[y * w + Math.min(w - 1, Math.max(0, x - dx))];
    }
    return { ...pic, px: out };
  },
  // A jolt, once: the whole picture shakes back and forth, less and less, for o.ms after it came on (black shows at the
  // edge it leaves). o.ease above 1 runs it on eased time, so most of it comes at once and it slows as it dies away. Then,
  // and with reduced motion, nothing.
  shake: (pic, o, t, calm) => {
    if (calm || t >= o.ms) return pic;
    const p = 1 - (1 - t / o.ms) ** (o.ease ?? 1), fade = 1 - p, turn = 2 * Math.PI * o.shakes * p;
    const dx = Math.round(o.amplitude * fade * Math.sin(turn)), dy = Math.round(o.amplitude * 0.5 * fade * Math.sin(turn * 1.7));
    return { ...pic, px: shifted(pic, dx, dy, 0) };
  },
  // A ripple, once: as sway, each row slides sideways along a wave, but a short gentle one that runs down the picture
  // (o.travel waves in its o.ms), swells over the first o.rise of it and fades to nothing at the end (as (1 − time)
  // to the power o.fade). Then, and with
  // reduced motion, nothing.
  wave: (pic, o, t, calm) => {
    if (calm || t >= o.ms) return pic;
    const { px, w, h } = pic, out = px.slice(), p = t / o.ms;
    const swell = Math.sin(Math.PI / 2 * Math.min(1, p / o.rise)) * (1 - p) ** o.fade;
    for (let y = 0; y < h; y++) {
      const dx = Math.round(o.amplitude * swell * Math.sin(2 * Math.PI * (y / o.rows - p * o.travel)));
      for (let x = 0; x < w; x++) out[y * w + x] = px[y * w + Math.min(w - 1, Math.max(0, x - dx))];
    }
    return { ...pic, px: out };
  },
  // Seeing double: a second copy o.dx, o.dy off, drawn on every other pixel (a checkerboard), so it reads as see-through.
  ghost: (pic, o) => {
    const { px, w, h } = pic, out = px.slice();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = x - o.dx, sy = y - o.dy;
      if (((x + y) & 1) && sx >= 0 && sx < w && sy >= 0 && sy < h) out[y * w + x] = px[sy * w + sx];   // (nothing comes in from outside: the pixel stays)
    }
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
  tint: (pic, o, t, calm, param) => ({ ...pic, rgb: tinted(o.palettes[param]) })
};

// The filters that move (the scene redraws them every frame while they are on, unless motion is reduced); the others are
// drawn once, when they come on.
export const MOVING = new Set(["sway", "shake", "wave", "static"]);

// The reaction a redraw brings (INTERFACE.md §6c, "Reactions"): "hurt" when state.reactions.hurt went up since the screen
// last showed the game, else "heal" when state.reactions.heal did, else null; never on a restore (new game, undo, a loaded
// game: a moment already seen, or none), only for a moment just played (a turn or a tick). The engine counts them (one a
// moment, a hurt winning: js/engine.js, felt); the picture (ui/scene.js) and the page's background (ui/page.js) each play it.
export function reactionOf(prev, next, reason) {
  if (reason === "restore" || !prev) return null;
  const was = prev.state?.reactions, now = next.state?.reactions;
  if ((now?.hurt ?? 0) > (was?.hurt ?? 0)) return "hurt";
  if ((now?.heal ?? 0) > (was?.heal ?? 0)) return "heal";
  return null;
}

// The picture's pixels moved dx right and dy down; where nothing comes in, `blank`. (The same kind of array as it was given.)
function shifted({ px, w, h }, dx, dy, blank) {
  const out = px.slice();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = x - dx, sy = y - dy;
    out[y * w + x] = sx >= 0 && sx < w && sy >= 0 && sy < h ? px[sy * w + sx] : blank;
  }
  return out;
}
// A pixel's and a moment's own number, 0 to 2³² − 1 (the same for the same two).
export function hash(a, b) {
  let x = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return x >>> 0;
}

const between = (min, max) => min + Math.random() * (max - min);
