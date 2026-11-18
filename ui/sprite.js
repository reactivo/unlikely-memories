// Sprites: turns a thing's pixel art into crisp inline SVG. A world's things carry their own sprites (`sprite`: rows of
// palette numbers in hex, 0–f, "." = clear), which is how the AI writes them (ART-DIRECTION.md §3).

import art from "../content/art.js?v=0.64.1";
import { HEX_INDEX } from "./draw.js?v=0.64.1";

// A thing's sprite as SVG, for the inventory and beside its description in the story: one 1×1 square per coloured pixel
// ("." and unknown characters are left empty). Null if it has none.
export function itemSVG(id, state) {
  return spriteSVG(state?.world.objects[id]?.sprite);
}

// The picture beside what examining a thing says: a character's portrait (its face), else the thing's own sprite. Null if it has neither.
export function examineSVG(id, state) {
  const o = state?.world.objects[id];
  return Array.isArray(o?.portrait) && o.portrait.length ? spriteSVG(o.portrait) : spriteSVG(o?.sprite);
}

// Sprite rows (a thing's `sprite`) as SVG: the same drawing, for a thing that may no longer exist (the echo of a thing you
// lost keeps its rows, ui/log.js). Null if there are none (or nothing in them is drawn).
// The drawing is centred in its grid: its drawn pixels moved, by whole pixels (so they stay crisp), until the empty space on
// either side of its coloured part is the same, or one pixel more on the right or below when the difference is odd. Black (the
// outline, a thin spout) is not counted: it hardly shows on the dark square, so the box is what you see (Diego chose this from
// examples, 15 November 2026: counted, Phare's oil can sat left of the middle). A drawing all in black is centred as a whole. A sprite whose drawing leans to one
// side of its grid (a horn with two empty columns on the left and none on the right) showed off-centre in the examine square, the
// inventory and the echoes until 15 November 2026. The rows themselves don't change: the floor sprites drawn in a room's
// picture (ui/draw.js) keep their place there.
export function spriteSVG(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  const W = rows[0].length, H = rows.length, drawn = [];
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    const fill = art.palette.colors[HEX_INDEX[c]];
    if (fill) drawn.push([x, y, fill]);
  }));
  if (!drawn.length) return null;
  const seen = drawn.filter(d => d[2] !== art.palette.colors[0]), by = seen.length ? seen : drawn;   // the coloured part (not black)
  const xs = by.map(d => d[0]), ys = by.map(d => d[1]);
  // How far to move: where the coloured part starts once centred, less where it starts; never so far that a black pixel leaves the grid.
  const shift = (v, all, size) => Math.min(Math.max(Math.floor((size - (Math.max(...v) - Math.min(...v) + 1)) / 2) - Math.min(...v),
                                                     -Math.min(...all)), size - 1 - Math.max(...all));
  const dx = shift(xs, drawn.map(d => d[0]), W), dy = shift(ys, drawn.map(d => d[1]), H);
  const px = drawn.map(([x, y, fill]) => `<rect x="${x + dx}" y="${y + dy}" width="1" height="1" fill="${fill}"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" aria-hidden="true">${px}</svg>`;
}
