// Sprites: turns a thing's pixel art into crisp inline SVG. A world's things carry their own sprites (`sprite`: rows of
// palette numbers in hex, 0–f, "." = clear), which is how the AI writes them (ART-DIRECTION.md §3).

import art from "../content/art.js";
import { HEX_INDEX } from "./draw.js";

// A thing's sprite as SVG, for the inventory and beside its description in the story: one 1×1 square per coloured pixel
// ("." and unknown characters are left empty). Null if it has none.
export function itemSVG(id, state) {
  return spriteSVG(state?.world.objects[id]?.sprite);
}

// Sprite rows (a thing's `sprite`) as SVG: the same drawing, for a thing that may no longer exist (the echo of a thing you
// lost keeps its rows, ui/log.js). Null if there are none.
export function spriteSVG(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  let px = "";
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    const fill = art.palette.colors[HEX_INDEX[c]];
    if (fill) px += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`;
  }));
  return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${px}</svg>`;
}
