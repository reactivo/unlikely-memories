// A cover's title, laid out and drawn into the cover's own pixels (docs/splash/PLAN.md, "The title"; INTERFACE.md §13a). Pure: no page, so Node tests
// run it too; ui/splash.js and the picture sheet (tools/pictures) draw with it. The letters come from a glyph table (content/titlefonts/<name>.js,
// made by tools/titlefont.mjs from a pixel font), each font pixel a scale × scale block of the cover's pixels.
//
// The layout: the title in capitals; one line when it fits within art.cover.titleWidth (300) at a scale of art.cover.titleScale.min (4) or more, else two
// lines split between words, the split that makes the longer line shortest; each line centred on the cover; the scale the largest whole number up to
// titleScale.max (5) at which every line fits the width and the whole block fits its band (art.cover.bands: the cover's `titleAt`, "top" or
// "bottom"); the lines one font pixel (the font's own line gap) apart at that scale; the block centred in its band. A capital with a mark (Á) rises
// above the capitals' height: its line gets that much room above it, so a mark never touches the line above.

import art from "../content/art.js?v=0.74.0";
import { TITLE_FONTS } from "../content/titlefonts/index.js?v=0.74.0";

const C = art.cover;

// The names of the fonts there are, and a table by name (an unknown or missing name: art.js's default).
export const titleFonts = () => Object.keys(TITLE_FONTS);
export const fontNamed = (id) => TITLE_FONTS[id] ?? TITLE_FONTS[C.titleFont];

// A character's glyph: its own, else the font's "?", else none (a space has one, empty).
const glyphFor = (font, ch) => font.glyphs[ch] ?? font.glyphs["?"] ?? null;

// A line's pen positions and ink extent in font pixels: { at: [[glyph, penX]…], from, to (ink columns, to exclusive), high, low (rows above and below the baseline) }.
function measure(font, text) {
  let pen = 0, from = Infinity, to = -Infinity, high = 0, low = 0;
  const at = [];
  for (const ch of text) {
    const g = glyphFor(font, ch);
    if (!g) continue;
    if (g.rows.length) {
      at.push([g, pen]);
      from = Math.min(from, pen + g.x); to = Math.max(to, pen + g.x + g.rows[0].length);
      high = Math.max(high, g.top); low = Math.max(low, g.rows.length - g.top);
    }
    pen += g.adv;
  }
  return { at, from: from === Infinity ? 0 : from, to: to === -Infinity ? 0 : to, high, low };
}
const widthOf = (m) => m.to - m.from;
// A line's ink width in font pixels (what the split and the scale go by).
export const inkWidth = (font, text) => widthOf(measure(font, text));

// The title as lines: { lines: [text], scale, top, height, rows: [{ text, x, y, m }] , font } (x, y in cover pixels: the line's left ink column and its baseline-less box top),
// for a title, a font table, and the band ("top" or "bottom").
// `kicker`: a small line above the title (the series' "An Unlikely Memories interactive fiction"), in the same font at `kickerScale` (art.cover.kickerScale, 1; the phone's page asks for 2: ui/splash.js),
// two title pixels above the title's capitals; the two are one block, centred in the band.
export function layoutTitle(title, font, at = "top", lang, kicker = "", kickerScale = C.kickerScale ?? 1, format = C) {   // format: the poster's size and bands (art.cover, or art.boxart)
  const text = String(title ?? "").toLocaleUpperCase(lang).replace(/\s+/g, " ").trim();
  const [b0, b1] = format.bands[at] ?? format.bands.top, w = (t) => widthOf(measure(font, t));
  const words = text.split(" ");
  let lines = [text];
  if (w(text) * C.titleScale.min > C.titleWidth && words.length > 1) {
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(" "), b = words.slice(i).join(" "), m = Math.max(w(a), w(b));
      if (!best || m < best.m) best = { m, lines: [a, b] };
    }
    lines = best.lines;
  }
  const ms = lines.map(t => measure(font, t)), gap = Math.max(1, font.gap);
  // Each line's box in font pixels: the capitals' height, the room a mark needs above them; a descender counts under the last line only.
  const above = ms.map(m => Math.max(0, m.high - font.cap)), below = ms.at(-1).low;
  const rowsHigh = ms.reduce((s, _, i) => s + above[i] + font.cap, 0) + gap * (ms.length - 1) + below;
  const ktext = String(kicker ?? "").toLocaleUpperCase(lang).replace(/\s+/g, " ").trim(), ks = kickerScale;
  const km = ktext ? measure(font, ktext) : null, kickHigh = km ? (Math.max(km.high, font.cap) * ks) : 0;
  const kgap = (s) => km ? 2 * s : 0;                              // two title pixels between the line and the title
  const fit = Math.min(...ms.map(m => Math.floor(C.titleWidth / Math.max(1, widthOf(m)))), Math.floor((b1 - b0 - kickHigh) / (rowsHigh + 2)));
  const scale = Math.max(1, Math.min(C.titleScale.max, fit));
  const top = b0 + Math.floor(((b1 - b0) - rowsHigh * scale - kickHigh - kgap(scale)) / 2);
  let y = top + kickHigh + kgap(scale);
  const kick = km ? { text: ktext, m: km, s: ks, x: Math.floor((format.width - widthOf(km) * ks) / 2), y: top + (Math.max(km.high, font.cap) - font.cap) * ks } : null;
  const rows = ms.map((m, i) => {
    const row = { text: lines[i], m, x: Math.floor((format.width - widthOf(m) * scale) / 2), y: y + above[i] * scale };   // y: the capitals' top row
    y += (above[i] + font.cap + gap) * scale;
    return row;
  });
  return { lines, scale, top, height: rowsHigh * scale + kickHigh + kgap(scale), band: [b0, b1], rows: kick ? [kick, ...rows] : rows, font };
}

// The pixels the title covers, as indices into a grid `width` wide (row by row).
export function titlePixels(layout, width = C.width, height = C.height) {
  const out = [], cap = layout.font.cap;
  for (const row of layout.rows) for (const [g, pen] of row.m.at) {
    const s = row.s ?? layout.scale;
    g.rows.forEach((r, j) => {
      for (let i = 0; i < r.length; i++) {
        if (r[i] !== "#") continue;
        const x0 = row.x + (pen + g.x + i - row.m.from) * s, y0 = row.y + (cap - g.top + j) * s;
        for (let b = 0; b < s; b++) for (let a = 0; a < s; a++) { const x = x0 + a, y = y0 + b; if (x >= 0 && x < width && y >= 0 && y < height) out.push(y * width + x); }
      }
    });
  }
  return Uint32Array.from(out);
}

// Draw it: every title pixel set to the palette number `color` (0-15) in `px`; no shadow, no outline.
export function stampTitle(px, pixels, color) {
  for (let i = 0; i < pixels.length; i++) px[pixels[i]] = color;
}
