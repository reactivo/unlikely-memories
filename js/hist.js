// What colours a world's own pictures use, measured (docs/splash/cover-rules-tall.md; BRIEF.md §7, "Cover and box art"): the engine's side, shared by the
// checker (js/checklint.js: a cover's background must be the measured one) and the tool that prints it (tools/pictures/hist.mjs).
// A room's picture is painted as the game paints it (js/paint.js); every pixel counts once; black 0 (outlines and silhouettes everywhere) is left out
// of the ranking. The background of a world's cover is the most-used colour among those on which white 15 has a contrast of at least 4.5:1
// (in the EGA palette: 1, 4, 5, 6, 8, 9); black 0 if none.

import art from "../content/art.js?v=0.68.0";
import { paintPicture } from "./paint.js?v=0.68.0";
import { parseShapes } from "./picture.js?v=0.68.0";

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

// How much of a world's room pictures each colour covers: { counts[16], total, ranked: [[colour, share], ...] (most first, every colour used) }.
export function histogram(state) {
  const counts = new Array(16).fill(0);
  let total = 0;
  for (const room of Object.values(state.world.rooms)) {
    const d = room.picture?.draw;
    if (!d) continue;
    const draw = typeof d === "string" ? parseShapes(d).shapes : d;
    const { px } = paintPicture(draw, art.picture.width, art.picture.height);
    for (const v of px) if (v < 16) { counts[v]++; total++; }
  }
  const ranked = counts.map((c, i) => [i, total ? c / total : 0]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  return { counts, total, ranked };
}

// The world's measured cover background: the most-used colour other than black on which white reads; 0 if none.
export function coverBackground(state) {
  const { ranked } = histogram(state);
  return ranked.find(([c]) => c !== 0 && whiteReads(c))?.[0] ?? 0;
}
