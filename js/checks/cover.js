// The bible's card, the cover and the box art: the blurb and thumbnail of the card, the picture style, and a world's cover (480 x 560) and
// box art (480 x 400) as `pictures.js` gives them (docs/splash/PLAN.md; BRIEF.md §1, §7 "Cover and box art"). The cover's and the box art's
// findings are warnings, never problems. Pure.

import art from "../../content/art.js?v=0.78.0";
import { colorsOf, areaPixels, parseShapes, isShapeOf } from "../picture.js?v=0.78.0";
import { paintPicture } from "../paint.js?v=0.78.0";
import { contrast, MIN_CONTRAST, STATABLE, isStatable, posterBackground, roomDraws } from "../hist.js?v=0.78.0";
import { namesBackground } from "../cover.js?v=0.78.0";
import { collect, collectCatches } from "./registry.js?v=0.78.0";
import { motionChecks, loopChecks } from "./drawings.js?v=0.78.0";

const COVER_LOOPS = { list: "cover.loop-list", tooMany: "cover.loop-too-many", malformed: "cover.loop-malformed" };

// What is wrong with the bible's card for the landing page: no blurb, or one far off what a card shows (a warning, below BLURB_MIN or above BLURB_MAX characters:
// BRIEF.md says it in words, about 20 to 30 words, and a model cannot count characters), and a thumbnail { picture, x }
// naming a room's picture (not an ending's, nor `died`, which would give the ending away) with a whole-number x from 0 to 95 (the crop
// is 225 of the picture's 320 columns).
const BLURB_MIN = 60, BLURB_MAX = 240;
export function bibleChecks(out, bible, state) {
  const blurb = bible?.blurb, thumb = bible?.thumbnail, columns = art.picture.width - 225;
  if (typeof blurb !== "string" || !blurb.trim()) out.add("bible.no-blurb", "bible: no blurb, the short description on the world's card");
  else if (blurb.length < BLURB_MIN || blurb.length > BLURB_MAX) out.add("bible.blurb-length", `bible: the blurb is ${blurb.length} characters, ${blurb.length < BLURB_MIN ? "too short" : "too long"} for a card: one or two sentences, about 20 to 30 words`);
  if (!thumb || typeof thumb !== "object") out.add("bible.no-thumbnail", "bible: no thumbnail ({ picture: a room's picture id, x: 0–95 })");
  else {
    const id = thumb.picture;
    if (typeof id !== "string" || !id) out.add("bible.thumbnail", "bible: the thumbnail names no picture");
    else if (id === "died" || state.pictures?.[id]) out.add("bible.thumbnail", `bible: the thumbnail is the ending's picture "${id}"; it must be a room's (an ending would be a spoiler)`);
    else if (!state.world.rooms[id]?.picture) out.add("bible.thumbnail", `bible: the thumbnail's picture "${id}" isn't one of the world's room pictures`);
    if (!Number.isInteger(thumb.x) || thumb.x < 0 || thumb.x > columns) out.add("bible.thumbnail", `bible: the thumbnail's x (${JSON.stringify(thumb.x)}) should be a whole number from 0 to ${columns}`);
  }
  // The picture style (BRIEF.md §7): `dithered` or `flat`; none means dithered. A flat world's pictures have no `fade` fill.
  if (bible && "style" in bible) {
    if (!art.styles.includes(bible.style)) out.add("bible.style", `bible: style is one of ${art.styles.join(", ")}, not ${JSON.stringify(bible.style)}`);
    else if (bible.style === "flat") {
      const pics = [...Object.entries(state.world.rooms).map(([id, r]) => [`rooms/${id}`, r.picture]), ...Object.entries(state.pictures || {}).map(([id, p]) => [`pictures/${id}`, p?.picture])];
      for (const [where, pic] of pics) if ((pic?.draw || []).some(s => s?.fill?.fade)) out.add("bible.flat-fade", `${where}: flat style: no fade`);
    }
  }
}
export const bibleProblems = (bible, state) => collect(out => bibleChecks(out, bible, state));

// The colour a world states for its cover and box art (the bible's `bg`; none is fine: the game measures it): one of the colours white reads on, or black.
// A colour that is not one is a warning, never a refusal: the game goes on with the measured colour (js/hist.js, posterBackground).
export function backgroundChecks(out, stated) {
  if (stated === undefined || stated === null || isStatable(stated)) return;
  out.add("bible.bg-colour", `bg is ${JSON.stringify(stated)}: it is the colour the cover and the box art stand on, one of ${STATABLE.filter(c => c).join(", ")}, or 0 (the others are too light for white to read on); the game takes the colour from the rooms' pictures instead`);
}
export const backgroundCatches = (stated) => collectCatches(out => backgroundChecks(out, stated), "bible: ");

// A world's cover (`export const cover = { shot, title, titleAt, draw, cycles, loops }`: docs/splash/PLAN.md; BRIEF.md §7, "Cover and box art"), checked: never a
// problem. 480 x 560 (art.cover): its motion by that size; the canvas starts in the world's colour, `bg` (the engine paints it: js/hist.js, js/paint.js), so the bands
// and the empty space need no shape, and a poster that paints too few columns, or whose bands differ, or whose background is not the measured one, cannot happen
// (the checks that asked for those are gone). What can still happen: art in a band (BOTH bands, art.cover.bands: rows 0-119 and 470-559, are one flat colour,
// with no cycle or loop touching them); the title (`title`: a palette number, 15 when it is left out; `titleAt` "top" or "bottom": the engine draws it there,
// js/title.js) the colour of the band under it, or one that doesn't read on it (contrast >= 4.5:1); the motion calm (at most 3 cycles and 2 loops, at least 2 and 1;
// a cycle paints one of its colours only, and never names the background among them; at most one scatter). `background` is the world's measured colour
// (js/hist.js): the canvas the checks paint on; left out where there is no world (a made-up cover in a test), black.
export function coverChecks(out, cover, { background = null } = {}) {
  if (!cover || typeof cover !== "object") return;
  const draw = typeof cover.draw === "string" ? parseShapes(cover.draw, { bg: true }).shapes : cover.draw;
  const pic = { ...cover, draw };
  motionChecks(out, pic);
  loopChecks(out, cover.loops, art.cover, art.effects.loops.coverMax, COVER_LOOPS);   // (a cover may have up to coverMax loops)
  // A poster that is clearly alive and calm (Diego, 16-17 November 2026): 2-3 cycles, 1-2 loops.
  const nc = (cover.cycles || []).length, nl = (cover.loops || []).length, lim = art.cover.motion;
  if (nc < lim.cycles[0] || nl < lim.loops[0]) out.add("cover.motion-counts", `has ${nc} cycle${nc === 1 ? "" : "s"} and ${nl} loop${nl === 1 ? "" : "s"}: a cover has at least ${lim.cycles[0]} cycles and ${lim.loops[0]} loop`);
  if (nc > lim.cycles[1]) out.add("cover.motion-counts", `has ${nc} cycles: a cover has at most ${lim.cycles[1]} (a poster moves a few living things)`);
  if (nl > lim.loops[1]) out.add("cover.motion-counts", `has ${nl} loops: a cover has at most ${lim.loops[1]}`);
  if ((cover.cycles || []).filter(c => c?.scatter).length > 1) out.add("cover.motion-counts", "has more than one scatter cycle: at most one, on a handful of points");
  const { width: W, height: H, bands } = art.cover, band = bands[cover.titleAt], canvas = background ?? 0;
  if (!band) out.add("cover.title-at", `titleAt is ${JSON.stringify(cover.titleAt)}: it names the title's band, "top" (rows ${bands.top[0]}-${bands.top[1] - 1}) or "bottom" (rows ${bands.bottom[0]}-${bands.bottom[1] - 1})`);
  const titled = cover.title !== undefined, title = titled ? cover.title : 15;
  if (titled && (!Number.isInteger(cover.title) || cover.title < 0 || cover.title > 15)) out.add("cover.title-colour", `title is ${JSON.stringify(cover.title)}: it is the title's colour, a palette number 0-15 (or leave it out: white)`);
  if (!band || !Array.isArray(draw) || !draw.length) return;
  let px, areas;
  try { ({ px, areas } = paintPicture(draw, W, H, canvas)); } catch { return; }
  const flat = bandWarnings(out, "cover.band", px, W, bands.top, `its top band (rows ${bands.top[0]}-${bands.top[1] - 1})`),
    flatBottom = bandWarnings(out, "cover.band", px, W, bands.bottom, `its bottom band (rows ${bands.bottom[0]}-${bands.bottom[1] - 1})`);
  const bg = flat ?? flatBottom ?? background, name = `its title band (${cover.titleAt}, rows ${band[0]}-${band[1] - 1})`;
  if (bg != null && Number.isInteger(title) && title >= 0 && title <= 15) {
    if (bg === title) out.add("cover.title-hidden", `${name} is colour ${title}, the title's own: the title wouldn't show`);
    else if (contrast(title, bg) < MIN_CONTRAST) out.add("cover.title-hidden", `the title's colour ${title} has a contrast of ${contrast(title, bg).toFixed(1)}:1 on the background (colour ${bg}): at least ${MIN_CONTRAST}:1`);
  }
  const inBand = (k) => (k >= bands.top[0] * W && k < bands.top[1] * W) || (k >= bands.bottom[0] * W && k < bands.bottom[1] * W);
  for (const c of cover.cycles || []) if (c && (c.areas || []).some(a => areaPixels(a, areas, W, H).some(inBand))) out.add("cover.cycle-band", `cycle "${c.name ?? "?"}" touches a band: no cycle may`);
  for (const c of cover.cycles || []) {
    if (!c || typeof c !== "object") continue;
    const cols = colorsOf(c);
    if (namesBackground(c, bg)) out.add("cover.cycle-colours", `cycle "${c.name ?? "?"}" has the background (${cols.includes("bg") ? "bg" : "colour " + bg}) among its colours: a cycle never moves into or out of the background, and the game does not run it`);
    if (c.style === "scroll" || c.sweep || !Array.isArray(cols)) continue;   // (a scroll slides a pattern, a sweep runs its colours over its area by design)
    const own = new Set();
    for (const a of c.areas || []) for (const k of areaPixels(a, areas, W, H)) if (cols.includes(px[k])) own.add(px[k]);
    if (own.size > 1) out.add("cover.cycle-colours", `cycle "${c.name ?? "?"}": its area is painted in ${own.size} of its colours (${[...own].join(", ")}), a dither or a mix, so it flips at once and the picture sparkles: paint its area in one of its colours, flat`);
  }
  for (const l of cover.loops || []) if (l?.under && !Object.keys(areas).some(id => isShapeOf(id, l.under))) out.add("cover.loop-under", `loop "${l.name ?? "?"}": under "${l.under}" matches no shape that shows (an id, or the start of ids "<id>_…")`);
  for (const l of cover.loops || []) {
    const pts = l?.path ?? (l?.at ? [l.at] : []), h = l?.frames?.[0]?.length ?? 0;
    for (const bd of [bands.top, bands.bottom]) if (pts.length && Math.max(...pts.map(p => p[1])) + h > bd[0] && Math.min(...pts.map(p => p[1])) < bd[1]) { out.add("cover.cycle-band", `loop "${l.name ?? "?"}" reaches into a band (rows ${bd[0]}-${bd[1] - 1}): no loop may`); break; }
  }
  return;
}
export const coverWarnings = (cover, opts) => collect(out => coverChecks(out, cover, opts));
export const coverCatches = (cover, opts) => collectCatches(out => coverChecks(out, cover, opts), "cover: ");

// One band of a poster's pixels (rows [from, to)): the canvas's own colour with no art in it, so one flat colour. Adds to `out` what is wrong; returns the colour when it is one, else null.
function bandWarnings(out, id, px, W, band, name) {
  const seen = new Map();
  for (let k = band[0] * W; k < band[1] * W; k++) seen.set(px[k], (seen.get(px[k]) ?? 0) + 1);
  if (seen.size > 1) {
    const list = [...seen].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([c, n]) => `colour ${c} ${n}`).join(", ");
    out.add(id, `${name} has art in it (${seen.size} colours in it: ${list}): the art ends before it, and no shape, edge, dither, line or light crosses into it`);
    return null;
  }
  return [...seen.keys()][0];
}

// A world's box art (`export const boxart = { shot, title, titleAt, draw }`: the earlier 480 x 400 cover, shown in the list of games as its phone
// crop, still: art.boxart; BRIEF.md §7, "Cover and box art"), checked as the covers are: its canvas starts in the world's colour (`background`, black when
// there is no world), its title band (art.boxart.bands) one flat colour that isn't the title's own (a band with art in it is not flat), the title's colour
// (15 when it is left out) a palette number, and no cycle or loop is checked (it never moves).
export function boxartChecks(out, boxart, { background = null } = {}) {
  if (!boxart || typeof boxart !== "object") return;
  const draw = typeof boxart.draw === "string" ? parseShapes(boxart.draw, { bg: true }).shapes : boxart.draw;
  const { width: W, height: H, bands } = art.boxart, band = bands[boxart.titleAt];
  if (!band) out.add("boxart.title-at", `titleAt is ${JSON.stringify(boxart.titleAt)}: it names the title's band, "top" (rows ${bands.top[0]}-${bands.top[1] - 1}) or "bottom" (rows ${bands.bottom[0]}-${bands.bottom[1] - 1})`);
  const titled = boxart.title !== undefined, title = titled ? boxart.title : 15;
  if (titled && (!Number.isInteger(boxart.title) || boxart.title < 0 || boxart.title > 15)) out.add("boxart.title-colour", `title is ${JSON.stringify(boxart.title)}: it is the title's colour, a palette number 0-15 (or leave it out: white)`);
  if (!band || !Array.isArray(draw) || !draw.length) return;
  let px;
  try { ({ px } = paintPicture(draw, W, H, background ?? 0)); } catch { return; }
  const bg = bandWarnings(out, "boxart.band", px, W, band, `its title band (${boxart.titleAt}, rows ${band[0]}-${band[1] - 1})`);
  if (bg != null && bg === title) out.add("boxart.title-hidden", `its title band is colour ${title}, the title's own: the title wouldn't show`);
  return;
}
export const boxartWarnings = (boxart, opts) => collect(out => boxartChecks(out, boxart, opts));
export const boxartCatches = (boxart, opts) => collectCatches(out => boxartChecks(out, boxart, opts), "boxart: ");

// What a world's posters say, as catches, in the order every caller adds them to the checker's own: the posters' colour, the cover, the box art
// (`{ bg, cover, boxart }`: a hand-in's, or a world's entry). `state`: the game as it starts; the posters' background is the stated colour or measured from its rooms.
export function posterCatches({ bg, cover, boxart }, state) {
  const opts = { background: posterBackground(bg, roomDraws(state)) };
  return [...backgroundCatches(bg), ...(cover ? coverCatches(cover, opts) : []), ...(boxart ? boxartCatches(boxart, opts) : [])];
}
