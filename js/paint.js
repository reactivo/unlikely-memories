// Painting a drawing list into pixels (ART-DIRECTION.md §5): the shapes of a picture, in order, into a grid of palette numbers (0–15), the way
// Sierra's games drew their rooms from commands. Pure: no page, so the screen (ui/draw.js, which re-exports it), the tests and the checker (the
// motion's limits need what each shape ends up showing) all use it.

import art from "../content/art.js?v=0.48.2";

const DITHER = art.dither.matrix;                 // Bayer 4×4: the order in which pixels switch to the second colour

// The dither threshold of a pixel (0–1): a pixel is lit while the level is past it.
export const threshold = (x, y) => (DITHER[y & 3][x & 3] + 0.5) / 16;

// Is this pixel past the dither threshold for a level (0–1)? The same test scene.py used.
export const lit = (x, y, level) => threshold(x, y) < level;

// Paint a drawing list into a new grid (width × height palette numbers, starting all black).
export function paint(draw, width = art.picture.width, height = art.picture.height) {
  return paintPicture(draw, width, height).px;
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
  // A row of the shape as a mask (1: the pixel is covered), over columns x0 − 1 … x1 + 1 (a pixel's edge test looks one pixel each
  // way, beyond the picture too). The rows above and below the one being painted are kept, so the edge test is three lookups, not
  // four more tests of the shape.
  const [x0, y0, x1, y1] = bounds(s, w, h), xa = x0 - 1, width = x1 - x0 + 3, row = rowOf(s);
  let above = new Uint8Array(width), here = new Uint8Array(width), below = new Uint8Array(width);
  const wantEdge = s.edge !== undefined;
  if (wantEdge) { row(y0 - 1, xa, width, above); row(y0, xa, width, here); }
  for (let y = y0; y <= y1; y++) {
    if (wantEdge) row(y + 1, xa, width, below); else row(y, xa, width, here);
    for (let x = x0; x <= x1; x++) {
      const m = x - xa;
      if (!here[m]) continue;
      const edge = wantEdge && !(here[m - 1] && here[m + 1] && above[m] && below[m]);
      set(x, y, edge ? s.edge : fillColor(s.fill, x, y));
    }
    if (wantEdge) [above, here, below] = [here, below, above];     // (the next row down: its mask is made at the top of the loop)
  }
}

// Which pixels a filled shape covers (pixel corners: x, y are whole numbers), as a function that fills a mask for one row:
// row(y, xa, n, mask) sets mask[i] to 1 where the pixel (xa + i, y) is covered and 0 where it is not.
function rowOf(s) {
  if (s.poly) return polygonRow(s.poly);
  const inside = shapeTest(s);
  return (y, xa, n, mask) => { for (let i = 0; i < n; i++) mask[i] = inside(xa + i, y) ? 1 : 0; };
}

function shapeTest(s) {
  if (s.rect) { const [x, y, w, h] = s.rect; return (px, py) => px >= x && py >= y && px < x + w && py < y + h; }
  if (s.ellipse) {
    const [cx, cy, rx, ry] = s.ellipse;
    return (px, py) => ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 < 1;
  }
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

// A polygon, row by row (even-odd rule; points on the boundary count as inside). A row is worked out from where the polygon's edges
// cross it, not by asking every pixel about every edge: the pixels on an edge (the same test as always, tried only near where the edge
// crosses the row), and the runs between a crossing and the next one, which are inside by the even-odd rule: a pixel is inside when an
// odd number of crossings lie to its right.
function polygonRow(pts) {
  const n = pts.length;
  return (y, xa, count, mask) => {
    const xb = xa + count - 1, crossings = [];
    mask.fill(0, 0, count);
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (y >= Math.min(yi, yj) && y <= Math.max(yi, yj)) {            // the boundary: this edge's own pixels on this row
        const lo = Math.max(xa, Math.ceil(Math.min(xi, xj))), hi = Math.min(xb, Math.floor(Math.max(xi, xj)));
        if (yi === yj) { if (lo <= hi && onSegment(xi, yi, xj, yj, lo, y)) mask.fill(1, lo - xa, hi - xa + 1); }
        else {
          const at = (xj - xi) * (y - yi) / (yj - yi) + xi, near = 1e-9 / Math.abs(yj - yi) <= 0.25;   // (a nearly flat edge: every pixel along it is tried)
          for (let x = near ? Math.max(lo, Math.floor(at) - 1) : lo, last = near ? Math.min(hi, Math.ceil(at) + 1) : hi; x <= last; x++)
            if (onSegment(xi, yi, xj, yj, x, y)) mask[x - xa] = 1;
        }
      }
      if ((yi > y) !== (yj > y)) crossings.push((xj - xi) * (y - yi) / (yj - yi) + xi);
    }
    crossings.sort((p, q) => p - q);
    let inside = (crossings.length & 1) === 1, from = -Infinity;       // (left of every crossing: all of them lie to its right)
    for (const c of [...crossings, Infinity]) {
      if (inside) {
        const first = Math.max(xa, from === -Infinity ? xa : Math.ceil(from)), last = Math.min(xb, c === Infinity ? xb : Math.ceil(c) - 1);
        if (first <= last) mask.fill(1, first - xa, last - xa + 1);
      }
      inside = !inside; from = c;
    }
  };
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
    let level = Math.max(0, Math.min(1, ((x - fx) * dx + (y - fy) * dy) / (dx * dx + dy * dy)));
    // A fade into nothing (one empty colour) is a glow or a spill: its coloured end is at most half dense, thinning to nothing.
    if (f.fade[1] === null && f.fade[0] !== null) level = 0.5 + level / 2;
    else if (f.fade[0] === null && f.fade[1] !== null) level = level / 2;
    return lit(x, y, level) ? f.fade[1] : f.fade[0];
  }
  if (f.stripes) return f.stripes[y & 1];
  throw new Error("Unknown fill: " + JSON.stringify(f));
}

// The pixels of a line through points (each segment drawn with evenly spaced steps).
function linePoints(points) {
  const out = [];
  for (let k = 0; k + 1 < points.length; k++) {
    const [x0, y0] = points[k], [x1, y1] = points[k + 1];
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) + 1;
    for (let i = 0; i <= n; i++) out.push([Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n)]);
  }
  return out;
}
