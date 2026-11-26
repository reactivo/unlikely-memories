// The world's colour, what a cover's and a box art's `bg` is (js/paint.js paints it; a poster's canvas starts in it; BRIEF.md §7, "Cover and box art"): the
// engine's side. A world STATES it (the bible's `bg`, one of the colours white reads on, or black: `STATABLE`) or, when it states none (or one that is not
// allowed), the game MEASURES it from the rooms' pictures. `posterBackground(stated, draws)` is the one place that decides which: every caller that paints or
// reads a poster's colour asks it (worlds/index.js for the world's page and the cards, tools/cards.mjs through it, tools/checked.mjs and tools/world.mjs for
// the checker, tools/pictures/lib.mjs for the sheets, tools/pictures/hist.mjs, which prints both).
// A room's picture is painted as the game paints it (js/paint.js); every pixel counts once; black 0 (outlines and silhouettes everywhere) is left out
// of the ranking. The background of a world's cover is the most-used colour among those on which white 15 has a contrast of at least 4.5:1
// (in the EGA palette: 1, 4, 5, 6, 8, 9); black 0 if none.

import art from "../content/art.js?v=0.74.1";
import { paintPicture } from "./paint.js?v=0.74.1";
import { parseShapes } from "./picture.js?v=0.74.1";

// The relative luminance of a palette colour (WCAG), and white's contrast on it: (1 + .05) / (L + .05).
const channel = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
export function luminance(i) {
  const hex = art.palette.colors[i];
  const [r, g, b] = [1, 3, 5].map(k => channel(parseInt(hex.slice(k, k + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
export const WHITE = 15, MIN_CONTRAST = 4.5;
// Does white read on this colour?
export const whiteReads = (i) => contrast(WHITE, i) >= MIN_CONTRAST;

// The colours a world may state for its posters: the ones white reads on, and black 0 (the measure's own answer where none does).
export const STATABLE = [0, ...Array.from({ length: 16 }, (_, i) => i).filter(i => i !== 0 && whiteReads(i))];
export const isStatable = (n) => Number.isInteger(n) && STATABLE.includes(n);

// How much of the pictures each colour covers: { counts[16], total, ranked: [[colour, share], ...] (most first, every colour used) }.
// `draws`: the rooms' drawings, each a drawing list or the short notation.
export function histogramOf(draws) {
  const counts = new Array(16).fill(0);
  let total = 0;
  for (const d of draws) {
    if (!d) continue;
    const draw = typeof d === "string" ? parseShapes(d).shapes : d;
    const { px } = paintPicture(draw, art.picture.width, art.picture.height);
    for (const v of px) if (v < 16) { counts[v]++; total++; }
  }
  const ranked = counts.map((c, i) => [i, total ? c / total : 0]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  return { counts, total, ranked };
}
// How much of a world's room pictures each colour covers (the game's state).
export const histogram = (state) => histogramOf(Object.values(state.world.rooms).map(room => room.picture?.draw));

// The measured background of rooms' drawings: the most-used colour other than black on which white reads; 0 if none.
export function backgroundOf(draws) {
  const { ranked } = histogramOf(draws);
  return ranked.find(([c]) => c !== 0 && whiteReads(c))?.[0] ?? 0;
}
// The rooms' drawings of a world (the game's state), and the world's measured background.
export const roomDraws = (state) => Object.values(state.world.rooms).map(room => room.picture?.draw);
export const coverBackground = (state) => backgroundOf(roomDraws(state));

// THE world's colour, a cover's and a box art's `bg`: what the world states (the bible's `bg`) when that is one of STATABLE, else the measured one of the
// rooms' drawings. `stated` is undefined or null where the world states none; a stated colour that is not allowed is left out here (the checker warns:
// js/checks/cover.js, backgroundCatches).
export const posterBackground = (stated, draws) => isStatable(stated) ? stated : backgroundOf(draws);
