// Drawing lists → pixels (ART-DIRECTION.md §5). Paints a picture's shapes, in order, into a grid of palette
// numbers (0–15), the way Sierra's games drew their rooms from commands. Pure: no page, so tests can run it too.
// ui/scene.js turns the grid into colours on the canvas.

import art from "../content/art.js";
import { SPRITES, COLORS } from "../content/sprites.js";
import { parseShapes } from "../js/picture.js";

const DITHER = art.dither.matrix;                 // Bayer 4×4: the order in which pixels switch to the second colour

// Is this pixel past the dither threshold for a level (0–1)? The same test scene.py used.
export const lit = (x, y, level) => (DITHER[y & 3][x & 3] + 0.5) / 16 < level;

// Paint a drawing list into a new grid (width × height palette numbers, starting all black).
export function paint(draw, width = art.picture.width, height = art.picture.height) {
  return paintPicture(draw, width, height).px;
}

// A world's thumbnail on the landing page: the room's picture painted at its real size (320×136), no sprites, no cycling, then
// the largest crop, THUMB.width pixels wide from column x, rows 0 to THUMB.height (the landing page crops tighter on smaller screens:
// ui/fit.js thumbFit and thumbCrop, around this crop's centre). `draw` is a drawing list or the short notation (a string).
export const THUMB = { width: 225, height: 135 };   // 5:3; x runs 0 to 95 (320 − 225)
export function thumbnailPixels(draw, x) {
  const full = paint(typeof draw === "string" ? parseShapes(draw).shapes : draw);
  const left = Math.max(0, Math.min(art.picture.width - THUMB.width, Math.round(x))), out = new Uint8Array(THUMB.width * THUMB.height);
  for (let y = 0; y < THUMB.height; y++) out.set(full.subarray(y * art.picture.width + left, y * art.picture.width + left + THUMB.width), y * THUMB.width);
  return out;
}

// The same, also saying which pixels each named shape (`id`) ended up showing, after everything painted over it:
// { px, areas: { id: [pixel index, …] } }. Palette cycles use the areas.
export function paintPicture(draw, width = art.picture.width, height = art.picture.height) {
  const px = new Uint8Array(width * height), owner = new Int16Array(width * height).fill(-1);
  draw.forEach((shape, i) => paintShape(px, width, height, shape, (k) => { owner[k] = i; }));
  const areas = {};
  owner.forEach((i, k) => { const id = i >= 0 && draw[i].id; if (id) (areas[id] ||= []).push(k); });
  return { px, areas };
}

// One shape: rect, poly, ellipse (filled, optional 1-pixel edge), line or dots (one colour).
// mark(k) is told each pixel the shape paints.
function paintShape(px, w, h, s, mark = () => {}) {
  const set = (x, y, c) => {
    if (c === null || c === undefined || x < 0 || y < 0 || x >= w || y >= h) return;
    px[y * w + x] = c; mark(y * w + x);
  };
  if (s.line) return linePoints(s.line).forEach(([x, y]) => set(x, y, s.color));
  if (s.dots) return s.dots.forEach(([x, y]) => set(x, y, s.color));
  const inside = shapeTest(s);
  const [x0, y0, x1, y1] = bounds(s, w, h);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!inside(x, y)) continue;
    const edge = s.edge !== undefined && !(inside(x - 1, y) && inside(x + 1, y) && inside(x, y - 1) && inside(x, y + 1));
    set(x, y, edge ? s.edge : fillColor(s.fill, x, y));
  }
}

// Which pixels a filled shape covers (pixel corners: x, y are whole numbers).
function shapeTest(s) {
  if (s.rect) { const [x, y, w, h] = s.rect; return (px, py) => px >= x && py >= y && px < x + w && py < y + h; }
  if (s.ellipse) {
    const [cx, cy, rx, ry] = s.ellipse;
    return (px, py) => ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 < 1;
  }
  if (s.poly) { const pts = s.poly; return (px, py) => inPolygon(pts, px, py); }
  throw new Error("Unknown shape: " + JSON.stringify(s).slice(0, 60));
}

// The rectangle of pixels worth testing for a shape, clipped to the picture.
function bounds(s, w, h) {
  let xs, ys;
  if (s.rect) { const [x, y, rw, rh] = s.rect; xs = [x, x + rw]; ys = [y, y + rh]; }
  else if (s.ellipse) { const [cx, cy, rx, ry] = s.ellipse; xs = [cx - rx, cx + rx]; ys = [cy - ry, cy + ry]; }
  else { xs = s.poly.map(p => p[0]); ys = s.poly.map(p => p[1]); }
  const clamp = (v, max) => Math.max(0, Math.min(max, v));
  return [clamp(Math.floor(Math.min(...xs)), w - 1), clamp(Math.floor(Math.min(...ys)), h - 1),
          clamp(Math.ceil(Math.max(...xs)), w - 1), clamp(Math.ceil(Math.max(...ys)), h - 1)];
}

// Point in polygon (even-odd rule). Points on the boundary count as inside.
function inPolygon(pts, x, y) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (onSegment(xi, yi, xj, yj, x, y)) return true;
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const onSegment = (x1, y1, x2, y2, x, y) =>
  Math.abs((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) < 1e-9 &&
  x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2);

// A fill's colour at a pixel: a palette number; { mix: [a, b], level }; { fade: [a, b], from, to } (a at `from`,
// b at `to`, dithered in between); { stripes: [a, b] } (alternate rows). null in a pair = leave the pixel as it is.
function fillColor(f, x, y) {
  if (typeof f === "number" || f === null) return f;
  if (f.mix) return lit(x, y, f.level) ? f.mix[1] : f.mix[0];
  if (f.fade) {
    const [fx, fy] = f.from, [tx, ty] = f.to, dx = tx - fx, dy = ty - fy;
    const level = Math.max(0, Math.min(1, ((x - fx) * dx + (y - fy) * dy) / (dx * dx + dy * dy)));
    return lit(x, y, level) ? f.fade[1] : f.fade[0];
  }
  if (f.stripes) return f.stripes[y & 1];
  throw new Error("Unknown fill: " + JSON.stringify(f));
}

// The pixels of a line through points (each segment drawn with evenly spaced steps).
export function linePoints(points) {
  const out = [];
  for (let k = 0; k + 1 < points.length; k++) {
    const [x0, y0] = points[k], [x1, y1] = points[k + 1];
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) + 1;
    for (let i = 0; i <= n; i++) out.push([Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n)]);
  }
  return out;
}

// Draw a sprite (rows of letters, content/sprites.js) onto a grid at [x, y]; "." and unknown letters are clear.
export function stamp(px, width, height, rows, at, colors) {
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    const c = colors[ch], x = at[0] + i, y = at[1] + j;
    if (c !== undefined && x >= 0 && y >= 0 && x < width && y < height) px[y * width + x] = c;
  }));
}

// A sprite letter's colour as an EGA palette number (sprites are written with the palette's hex colours).
const INDEX = Object.fromEntries(Object.entries(COLORS).map(([ch, hex]) =>
  [ch, art.palette.colors.findIndex(c => c.toLowerCase() === hex.toLowerCase())]));

// Which of a picture's overlays are drawn in this state: those whose object is in the room.
export const overlaysShown = (picture, state, roomId) =>
  (picture.overlays || []).filter(o => state.world.objects[o.object]?.at === roomId);

// A world sprite's characters as palette numbers: hex digits 0–f ("." and anything else stay clear).
const HEX_INDEX = Object.fromEntries([..."0123456789abcdef"].flatMap((c, i) => [[c, i], [c.toUpperCase(), i]]));

// The whole picture for a room in this state: its painted shapes (cached by the caller) with the overlays on top.
// An overlay's sprite is a hand-made one by name (content/sprites.js), or else its object's own `floorSprite`
// (rows in hex, as the world writes them).
export function compose(base, picture, state, roomId, width = art.picture.width, height = art.picture.height) {
  const px = base.slice();
  for (const o of overlaysShown(picture, state, roomId)) {
    if (SPRITES[o.sprite]) stamp(px, width, height, SPRITES[o.sprite], o.at, INDEX);
    else {
      const own = state.world.objects[o.object];
      const rows = own.floorSprite || own.sprite;
      if (rows) stamp(px, width, height, rows, o.at, HEX_INDEX);
    }
  }
  return px;
}
