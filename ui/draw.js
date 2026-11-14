// Drawing lists → pixels on the screen (ART-DIRECTION.md §5): painting a picture's shapes into a grid of palette numbers is js/paint.js (re-exported
// here); this file puts a grid on the canvas, and holds the overlays, the thumbnails, the scroll's plan and the loops' sprites. Pure: no page, so tests
// can run it too. ui/scene.js turns the grid into colours on the canvas.

import art from "../content/art.js?v=0.48.4";
import { parseShapes } from "../js/picture.js?v=0.48.4";
import { paint, paintPicture, threshold, lit } from "../js/paint.js?v=0.48.4";
export { paint, paintPicture, threshold, lit };       // (painting is js/paint.js, pure; the screen's own drawing is here)

// A colour "#rrggbb" as [r, g, b].
// Where a game's picture is kept (ui/scene.js): the world's id, then the room (or "ending:<name>"). A room id is only unique inside its
// world, so the world's id is part of the key; the picture's version follows it ("sea/dunes#1").
export const pictureKey = (worldId, where, version) => `${worldId ?? ""}/${where}#${version}`;
export const rgbOf = (hex) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

// Each palette number's colour as [r, g, b], for putting a grid of palette numbers on a canvas (the scene, the thumbnails).
export const RGB = art.palette.colors.map(rgbOf);

// Put a grid of palette numbers (`px`, one per pixel, row by row) on canvas image data in the colours of `rgb` (each palette number's
// [r, g, b]): the one writer the scene's frames and the landing page's thumbnails use. One 32-bit write per pixel through a view of the
// data, from a palette worked out once per `rgb` (the scene asks every animated frame: 43,520 pixels). A machine that stores its
// bytes the other way round (none the game has met) writes the four bytes one by one, as before.
const LITTLE = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
const palettes = new WeakMap(), views = new WeakMap();
export function putPixels(image, px, rgb) {
  const data = image.data, n = px.length;
  if (!LITTLE) {
    for (let k = 0; k < n; k++) { const c = rgb[px[k]]; data[k * 4] = c[0]; data[k * 4 + 1] = c[1]; data[k * 4 + 2] = c[2]; data[k * 4 + 3] = 255; }
    return;
  }
  let pal = palettes.get(rgb);
  if (!pal) palettes.set(rgb, pal = Uint32Array.from(rgb, ([r, g, b]) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0));
  let view = views.get(data);
  if (!view) views.set(data, view = new Uint32Array(data.buffer, data.byteOffset, data.length >> 2));
  for (let k = 0; k < n; k++) view[k] = pal[px[k]];
}

// A world's thumbnail on the landing page: the room's picture painted at its real size (320×136), no sprites, no cycling, then
// the largest crop, THUMB.width pixels wide from column x, rows 0 to THUMB.height (always this crop: the landing page draws it at its own size and
// CSS stretches it to the card's slot). `draw` is a drawing list or the short notation (a string).
export const THUMB = { width: 225, height: 135 };   // 5:3; x runs 0 to 95 (320 − 225)
export function thumbnailPixels(draw, x) {
  const full = paint(typeof draw === "string" ? parseShapes(draw).shapes : draw);
  const left = Math.max(0, Math.min(art.picture.width - THUMB.width, Math.round(x))), out = new Uint8Array(THUMB.width * THUMB.height);
  for (let y = 0; y < THUMB.height; y++) out.set(full.subarray(y * art.picture.width + left, y * art.picture.width + left + THUMB.width), y * THUMB.width);
  return out;
}

// Which of a picture's overlays are drawn in this state: those whose object is in the room.
export const overlaysShown = (picture, state, roomId) =>
  (picture.overlays || []).filter(o => state.world.objects[o.object]?.at === roomId);

// What an overlay says to a screen reader: its room's `overlayAlt` for that object (a world's pictures carry no text; the
// world file, in its own language, says it). A game saved before that kept the line on the overlay itself.
export const overlayAlt = (room, overlay) => room?.overlayAlt?.[overlay.object] ?? overlay.alt;

// A sprite's characters as palette numbers: hex digits 0–f ("." and anything else stay clear).
export const HEX_INDEX = Object.fromEntries([..."0123456789abcdef"].flatMap((c, i) => [[c, i], [c.toUpperCase(), i]]));

// The pixels an overlay of this picture covers in this state (1 where one of its sprites has a pixel drawn, else 0): what a scroll
// cycle leaves alone (ui/effects.js, cycleInto). Taken once when the picture is composed, not every frame.
export function covered(picture, state, roomId, width = art.picture.width, height = art.picture.height) {
  const mask = new Uint8Array(width * height);
  overlayPixels(picture, state, roomId, width, height, (k) => { mask[k] = 1; });
  return mask;
}

// Each pixel of each overlay shown: fn(index in the picture, palette number).
function overlayPixels(picture, state, roomId, width, height, fn) {
  for (const o of overlaysShown(picture, state, roomId)) {
    const own = state.world.objects[o.object], rows = own.floorSprite || own.sprite;
    if (rows) rows.forEach((row, j) => [...row].forEach((ch, i) => {
      const c = HEX_INDEX[ch], x = o.at[0] + i, y = o.at[1] + j;
      if (c !== undefined && x >= 0 && y >= 0 && x < width && y < height) fn(y * width + x, c);
    }));
  }
}

// The whole picture for a room in this state: its painted shapes (cached by the caller) with the overlays on top, each
// its object's own `floorSprite`, else its `sprite` (rows in hex, as the world writes them), at the overlay's `at`.
export function compose(base, picture, state, roomId, width = art.picture.width, height = art.picture.height) {
  const px = base.slice();
  overlayPixels(picture, state, roomId, width, height, (k, c) => { px[k] = c; });
  return px;
}

// ---- Scroll: a cycle that slides an area's own pixels (ui/effects.js, CYCLES.scroll; ART-DIRECTION.md §6.1) ---------------------------------
// An aligned scroll: every line along the flow wraps over the area's whole extent (down and up: every column over the area's full height,
// top to bottom of its bounding box; left and right: every row over its full width), so rows across the flow stay straight in any shape.
// Where a line has no area pixel at some point along the flow, it takes that point's pattern from the nearest line that has one. Made once
// for a picture: { pixels, at (each pixel's place along the flow, from the box's start), line (its line's number), table (for each line, the
// pixel whose colour each place along the flow shows: -1 where no line has a pixel there), length, sign }. `w` is the picture's width.
export function scrollPlan(area, dir, w) {
  const vertical = dir === "down" || dir === "up", sign = dir === "down" || dir === "right" ? 1 : -1;
  const alongOf = (k) => vertical ? Math.floor(k / w) : k % w, acrossOf = (k) => vertical ? k % w : Math.floor(k / w);
  const pixelAt = (a, c) => vertical ? a * w + c : c * w + a;
  const pixels = Int32Array.from(new Set(area));
  if (!pixels.length) return { pixels, at: pixels, line: pixels, table: pixels, length: 0, sign };
  let top = Infinity, last = -Infinity;
  for (const k of pixels) { const a = alongOf(k); if (a < top) top = a; if (a > last) last = a; }
  const length = last - top + 1, own = new Set(pixels), across = new Map(), byAlong = new Map();   // across: line's across-coordinate → its number
  for (const k of pixels) {
    const c = acrossOf(k), a = alongOf(k);
    if (!across.has(c)) across.set(c, across.size);
    if (!byAlong.has(a)) byAlong.set(a, []);
    byAlong.get(a).push(c);
  }
  const table = new Int32Array(across.size * length).fill(-1);
  for (const [c, n] of across) for (let j = 0; j < length; j++) {
    const a = top + j;
    if (own.has(pixelAt(a, c))) { table[n * length + j] = pixelAt(a, c); continue; }
    const cs = byAlong.get(a);
    if (!cs) continue;
    let best = cs[0];
    for (const o of cs) if (Math.abs(o - c) < Math.abs(best - c) || (Math.abs(o - c) === Math.abs(best - c) && o < best)) best = o;
    table[n * length + j] = pixelAt(a, best);
  }
  return { pixels, at: pixels.map(k => alongOf(k) - top), line: pixels.map(k => across.get(acrossOf(k))), table, length, sign };
}

// The area `step` pixels on: each pixel takes the one `step` places back along the flow in its own line (wrapping round the area's whole
// extent), from `src`, the picture as painted, before any overlay (so what an overlay hides is not dragged along). Pixels in `covered`
// (an overlay's, ui/draw.js `covered`) are left as they are, still covered. Writes into `out`; allocates nothing.
export function scrollInto(out, src, covered, plan, step) {
  const { pixels, at, line, table, length, sign } = plan, s = length ? step % length : 0;
  if (!s) return;
  for (let i = 0; i < pixels.length; i++) {
    const k = pixels[i];
    if (covered && covered[k]) continue;
    let j = at[i] - sign * s; if (j < 0) j += length; else if (j >= length) j -= length;
    const from = table[line[i] * length + j];
    if (from >= 0) out[k] = src[from];
  }
}

// ---- Loops: small animated sprites in a picture (a picture's `loops`; ART-DIRECTION.md §6.3) ---------------------------------------------
// A loop's frames as palette numbers, once for a picture: { at, w, h, frames: [Uint8Array, …] }, 255 where a frame is clear ("." and
// anything that isn't a hex digit), so a frame is drawn over the picture with holes where it is clear.
export const CLEAR = 255;
export function compileLoop(loop) {
  const h = loop.frames[0].length, w = loop.frames[0][0]?.length ?? 0;
  return { at: loop.at ?? loop.path?.[0], w, h, frames: loop.frames.map(rows => Uint8Array.from(rows.join(""), ch => HEX_INDEX[ch] ?? CLEAR)) };
}

// One frame of a compiled loop drawn into the picture's pixels, clipped to it, at its own `at` or, for a travelling loop, at `where`.
export function drawLoop(out, lp, frame, width = art.picture.width, height = art.picture.height, where = lp.at) {
  const px = lp.frames[frame];
  for (let j = 0; j < lp.h; j++) {
    const y = where[1] + j;
    if (y < 0 || y >= height) continue;
    for (let i = 0; i < lp.w; i++) {
      const c = px[j * lp.w + i], x = where[0] + i;
      if (c !== CLEAR && x >= 0 && x < width) out[y * width + x] = c;
    }
  }
}
