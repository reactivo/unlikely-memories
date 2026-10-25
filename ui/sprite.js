// Sprites: turns pixel art into crisp inline SVG. Two spellings: the hand-made sprites in content/sprites.js
// (rows of letters, with their own colour table), and sprites that come with a world's objects (`sprite`: rows
// of palette numbers in hex, 0–f, "." = clear), which is how the AI writes them.

import { COLORS, SPRITES } from "../content/sprites.js";
import art from "../content/art.js";

const HEX = "0123456789abcdef";
const fromLetters = (c) => COLORS[c];
const fromHex = (c) => art.palette.colors[HEX.indexOf(c.toLowerCase())];

// One 1×1 square per coloured pixel; "." and unknown characters are left empty.
export function spriteSVG(rows, colorOf = fromLetters) {
  let px = "";
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    const fill = c === "." ? null : colorOf(c);
    if (fill) px += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`;
  }));
  return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${px}</svg>`;
}

// An item's sprite as SVG: the object's own (from the world) or a hand-made one. Null if it has none.
export function itemSVG(id, state) {
  const own = state?.world.objects[id]?.sprite;
  if (own) return spriteSVG(own, fromHex);
  return SPRITES[id] ? spriteSVG(SPRITES[id]) : null;
}

// An object's picture for the story, if it has one (for now its inventory sprite). Null if none.
export function objectImage(id, state) { return itemSVG(id, state); }
