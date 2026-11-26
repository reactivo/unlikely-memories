// Pictures' drawings and motion: what is wrong with one picture's shapes, fills and colours, its cycles, its loops, its motion's pace and how many
// shapes its style asks for (BRIEF.md §7). A picture is { version, draw: [shapes], cycles?, overlays?, loops? }, a room's or an ending's.
// Pure: reads the picture, never changes it.

import art from "../../content/art.js?v=0.74.0";
import { isGroup, isShapeOf, areaPixels, shownDraw, openDrawingProblems } from "../picture.js?v=0.74.0";
import { paintPicture } from "../paint.js?v=0.74.0";
import { Report, collect } from "./registry.js?v=0.74.0";

// What is wrong with one picture ({ version, draw: [shapes], cycles?, overlays?, loops? }), a room's or an ending's: only the shapes
// and fills of the art spec, colours 0–15, at most `maxShapes`, unique ids, at most 3 cycles that point at real shapes (and sweep, rest and the scroll's area right), and at most 1 loop.
// `objects`, `only`, `away`: a room's picture's things, the room's own (thingsOf) and those not in it as the world starts (awayFrom: their shapes are not painted then).
export function drawingProblems(out, picture, objects, only, away) {
  if (!picture || !Array.isArray(picture.draw) || !picture.draw.length) return out.add("draw.no-list", "has no drawing list");
  const why = new Report();
  if (picture.shot !== undefined && !(typeof picture.shot === "string" && picture.shot.trim())) why.add("draw.shot", "its shot is the drawing description, one string");
  else if (/\{[^}]*\|[^}]*\}/.test(picture.shot ?? "")) why.add("draw.shot", "its shot marks a thing as {label|...}: a shot marks only {word}, the word that answers (the {label|id} form is for room texts)");
  const colour = (c) => Number.isInteger(c) && c >= 0 && c <= 15, ids = picture.draw.map(d => d?.id).filter(Boolean);
  if (picture.draw.length > art.draw.maxShapes) why.add("draw.too-many-shapes", `has ${picture.draw.length} shapes, at most ${art.draw.maxShapes}`);
  if (new Set(ids).size !== ids.length) why.add("draw.duplicate-id", "has a shape id used twice");
  picture.draw.forEach((s, i) => {
    if (s && typeof s.outline === "string") {        // an element's outline (js/picture.js): a name its shapes start with, and a colour
      if (!colour(s.edge)) why.add("draw.outline", `shape ${i + 1} (outline ${s.outline}) has a colour outside 0–15`);
      else if (!ids.some(id => isShapeOf(id, s.outline))) why.add("draw.outline", `shape ${i + 1} (outline ${s.outline}) outlines no shape: no id is ${s.outline} or starts with ${s.outline}_`);
      return;
    }
    const kinds = art.draw.shapes.filter(k => s && k in s);
    if (kinds.length !== 1) return why.add("draw.shape-kind", `shape ${i + 1} is not one of ${art.draw.shapes.join(", ")}`);
    const f = s.fill, k = kinds[0];
    const fills = [f, ...(f && f.mix ? f.mix : []), ...(f && f.fade ? f.fade : []), ...(f && f.stripes ? f.stripes : [])];
    const colours = k === "line" || k === "dots" ? [s.color] : [s.edge, ...fills];
    if (k === "line" || k === "dots" ? !colour(s.color) : colours.some(c => c !== undefined && c !== null && typeof c !== "object" && !colour(c)))
      why.add("draw.colour", `shape ${i + 1} (${s.id ?? k}) has ${colours.includes("bg") ? `the colour bg, the world's colour, which only a cover's or a box art's shapes may write (a picture of a room or an ending takes palette numbers 0–15)` : "a colour outside 0–15"}`);
  });
  if ((picture.cycles || []).length > 3) why.add("cycle.too-many", "has more than 3 cycles");
  for (const c of picture.cycles || []) {
    const cn = `cycle "${c.name ?? "?"}"`;
    if (!art.effects.cycleStyles.includes(c.style)) why.add("cycle.style", `${cn}: style is one of ${art.effects.cycleStyles.join(", ")}`);
    if (c.style === "scroll") {
      // A scroll slides the area's own pixels: a direction and a step time, and no colours.
      if (!art.effects.scrollDirs.includes(c.dir)) why.add("cycle.scroll", `${cn}: a scroll's dir is one of ${art.effects.scrollDirs.join(", ")}`);
      if (!(typeof c.ms === "number" && c.ms > 0)) why.add("cycle.scroll", `${cn}: a scroll's ms is a number above 0`);
      if ("colors" in c) why.add("cycle.scroll", `${cn}: a scroll has no colors (it moves the area's own pixels)`);
      if ("rest" in c) why.add("cycle.scroll", `${cn}: a scroll has no colors, so no rest`);
      if ("scatter" in c) why.add("cycle.scroll", `${cn}: scatter is for rotate, pingpong, blink and flicker, not scroll`);
    } else {
      if (!Array.isArray(c.colors) || !c.colors.every(colour)) why.add("cycle.colors", `${cn}: colors are palette numbers 0–15`);
      if ("scatter" in c && c.scatter !== true) why.add("cycle.colors", `${cn}: scatter is true or left out`);
      if ("rest" in c && !(Number.isInteger(c.rest) && c.rest >= 0)) why.add("cycle.colors", `${cn}: rest is a whole number, 0 or more (the last colour repeated that many more times)`);
    }
    if ("sweep" in c) {
      if (c.style !== "rotate") why.add("cycle.sweep", `${cn}: sweep is for rotate only`);
      else if (c.sweep !== true && !Array.isArray(c.sweep)) why.add("cycle.sweep", `${cn}: sweep is true or a list of whole numbers, one for each area`);
      else if (Array.isArray(c.sweep)) {
        if (c.sweep.length !== (c.areas || []).length) why.add("cycle.sweep", `${cn}: sweep lists ${c.sweep.length} steps for ${(c.areas || []).length} areas: one step for each area`);
        if (!c.sweep.every(n => Number.isInteger(n) && n >= 0)) why.add("cycle.sweep", `${cn}: sweep's steps are whole numbers, 0 or more`);
      }
    }
    for (const a of c.areas || []) {
      if (typeof a === "string") { if (!ids.includes(a)) why.add("cycle.area", `${cn}: area ${JSON.stringify(a)} is neither a shape id of the picture nor [x, y, width, height]`); }
      else if (isGroup(a)) { for (const id of a) if (!ids.includes(id)) why.add("cycle.area", `${cn}: the group ${JSON.stringify(a)} names ${JSON.stringify(id)}, which is not a shape id of the picture`); }
      else if (!(Array.isArray(a) && a.length === 4)) why.add("cycle.area", `${cn}: area ${JSON.stringify(a)} is neither a shape id of the picture, a list of shape ids nor [x, y, width, height]`);
    }
  }
  if (objects) for (const t of openDrawingProblems(picture.draw, objects, only)) why.add("draw.open-drawing", t);   // (a room's: its things that open are drawn shut and open)
  if (!why.found.length) { scrollOverlaps(why, picture, objects, only, away); emptyAreas(why, picture, objects, only, away); }
  loopChecks(why, picture.loops);
  for (const c of why.found) out.add(c.id, c.text);
}

// A cycle's area (a shape's id, or an id in a group) that paints nothing: every pixel of the shape is covered by shapes drawn after it, so the
// cycle has nothing of it to move (a glint under a later wall). A warning, naming the cycle and the area: draw the shape later, or point the cycle at one that shows.
function emptyAreas(why, picture, objects, only, away) {
  const cycles = picture.cycles || [];
  if (!cycles.length) return;
  let seen;   // (a thing that opens is drawn shut and open, a thing away is not drawn: an area counts when it paints something in any of them)
  const ways = away?.size ? [undefined, away] : [undefined];
  try { seen = ways.flatMap(gone => [false, true].map(open => paintPicture(objects ? shownDraw(picture.draw, objects, open, only, gone) : picture.draw).areas)); } catch { return; }
  for (const c of cycles) for (const a of (c.areas || []).flat())
    if (typeof a === "string" && !seen.some(areas => areas[a]?.length)) why.add("cycle.area-empty", `cycle "${c.name ?? "?"}": its area "${a}" paints nothing (later shapes cover all of it), so the cycle has nothing of it to move: draw that shape later so it shows, or point the cycle at a shape that shows`);
}

// A scroll's area is never also another cycle's (ART-DIRECTION.md §6.1): the pixels the scroll's areas show, and those another cycle's do.
function scrollOverlaps(why, picture, objects, only, away) {
  const cycles = picture.cycles || [];
  if (!cycles.some(c => c?.style === "scroll") || cycles.length < 2) return;
  let areas;   // (the room as it starts: its things shut, those away not drawn)
  try { ({ areas } = paintPicture(objects ? shownDraw(picture.draw, objects, false, only, away) : picture.draw)); } catch { return; }
  const { width: W, height: H } = art.picture, taken = cycles.map(c => new Set((c.areas || []).flatMap(a => areaPixels(a, areas, W, H))));
  cycles.forEach((c, i) => { if (c.style === "scroll") cycles.forEach((o, j) => {
    if (i !== j && [...taken[i]].some(k => taken[j].has(k))) why.add("cycle.scroll-overlap", `cycle "${c.name ?? "?"}": a scroll's area is never also another cycle's, but cycle "${o.name ?? "?"}" shares some of it`);
  }); });
}

// What a picture's motion could be gentler about (art.effects.pace; BRIEF.md §7, "Animation"): never a problem. Steps quicker than the recipes'
// (pingpong, rotate and blink without a sweep; a flicker's waits; a scroll's step; a sweep's), a picture with no cycle whose `shot` doesn't say
// "moves: nothing", and a shot with no "moves:" part. (How much of a picture moves is not measured: BRIEF.md says what a cycle's area is.)
export function motionChecks(why, picture) {
  const cycles = (picture.cycles || []).filter(c => c && typeof c === "object"), pace = art.effects.pace;
  for (const c of cycles) {
    const cn = `cycle "${c.name ?? "?"}"`, ms = c.ms;
    if (c.style === "scroll") { if (typeof ms === "number" && ms < pace.scroll) why.add("motion.pace", `${cn}: a scroll step of ${ms} ms is quicker than the recipes' (${pace.scroll} ms at least)`); }
    else if (c.style === "flicker") { if (Array.isArray(ms) && ms[0] < pace.flicker) why.add("motion.pace", `${cn}: flicker waits as short as ${ms[0]} ms are quicker than the recipes' (${pace.flicker} ms at least)`); }
    else if (c.sweep) { if (typeof ms === "number" && ms < pace.sweep) why.add("motion.pace", `${cn}: a sweep step of ${ms} ms is quicker than the recipes' (${pace.sweep} ms at least)`); }
    else if (["pingpong", "rotate", "blink"].includes(c.style) && typeof ms === "number" && ms < pace.step) why.add("motion.pace", `${cn}: a step of ${ms} ms is quicker than the recipes' (${pace.step} ms at least)`);
  }
  const shot = typeof picture.shot === "string" ? picture.shot : "";
  if (!cycles.length && !/moves:\s*nothing/i.test(shot)) why.add("motion.shot-plan", "has no cycle, and its shot doesn't say \"moves: nothing\": give it one that moves, or end its shot with \"moves: nothing\" if the place is still");
  else if (cycles.length && !/moves:/i.test(shot)) why.add("motion.shot-plan", "moves, but its shot has no \"moves:\" part: end the shot with what moves (\"moves: the fall (running water)\")");
}
export const motionWarnings = (picture) => collect(out => motionChecks(out, picture));

// A picture with fewer shapes than its style's lowest (art.draw.ranges: a room's dithered 60, flat 80; an ending's dithered 40, flat 55; the haze modifier,
// named in the shot next to the palette ("goldenhour, haze"), its own: dithered 30, flat 65, and for an ending the lower of the two): never a problem.
// The style is the bible's (none: dithered); with no bible there is none to read. `ending`: the picture is an ending's, not a room's.
export function shapeChecks(out, picture, style, ending = false) {
  const ranges = art.draw.ranges, n = Array.isArray(picture.draw) ? picture.draw.length : 0;
  if (!ranges[style] || !n) return;
  const haze = /(?:^|;)\s*[a-z]+\s*,\s*haze\s*(?=[;,.]|$)/i.test(typeof picture.shot === "string" ? picture.shot : "");
  let [lo, hi] = haze ? ranges.haze[style] : ranges[style];
  if (ending) lo = Math.min(lo, ranges.endings[style][0]);
  if (n < lo) out.add("picture.few-shapes", `has ${n} shapes, fewer than the ${haze ? "haze " : ""}${ending ? "ending " : ""}${style} style's ${lo} (${lo}-${hi}): add detail by the style's own rules (materials, marks, dressing the shot names), never padding`);
}
export const shapeWarnings = (picture, style, ending = false) => collect(out => shapeChecks(out, picture, style, ending));

// What is wrong with a picture's `loops` (small animated sprites: ART-DIRECTION.md §6.3): at most art.effects.loops.max, each with a name,
// an `at` inside the picture (a travelling loop, with `path`, `travel` and `pause`, has no `at`), 2 to 6 frames of equal size (rows of hex digits, "." clear, every row as long as the first, at most 32 × 32),
// a positive `ms` and a style the engine knows.
const LOOPS = { list: "loop.list", tooMany: "loop.too-many", malformed: "loop.malformed" };
export function loopChecks(why, loops, size = art.picture, max = art.effects.loops.max, LOOP = LOOPS) {
  if (loops === undefined) return;
  if (!Array.isArray(loops)) return why.add(LOOP.list, "its loops are a list");
  const lim = art.effects.loops, { width: W, height: H } = size;
  if (loops.length > max) why.add(LOOP.tooMany, `has more than ${max} loop${max === 1 ? "" : "s"}`);
  for (const l of loops) if (l && "under" in l && !(typeof l.under === "string" && l.under.trim())) why.add(LOOP.malformed, `loop "${l.name ?? "?"}": under names the shape (an id) it passes behind`);
  for (const l of loops) {
    const name = `loop "${l?.name ?? "?"}"`;
    if (!l || typeof l !== "object") { why.add(LOOP.malformed, `${name}: is not a loop`); continue; }
    if (!(typeof l.name === "string" && l.name.trim())) why.add(LOOP.malformed, `${name}: needs a name`);
    if (!art.effects.loopStyles.includes(l.style)) why.add(LOOP.malformed, `${name}: style is one of ${art.effects.loopStyles.join(", ")}`);
    if (!(typeof l.ms === "number" && l.ms > 0)) why.add(LOOP.malformed, `${name}: ms is a number above 0`);
    const frames = l.frames;
    if (!Array.isArray(frames) || frames.length < lim.frames[0] || frames.length > lim.frames[1]) { why.add(LOOP.malformed, `${name}: has ${lim.frames[0]} to ${lim.frames[1]} frames`); continue; }
    const rows = (f) => Array.isArray(f) && f.length > 0 && f.every(r => typeof r === "string" && r.length > 0);
    if (!frames.every(rows)) { why.add(LOOP.malformed, `${name}: a frame is a list of rows of hex digits (0–f, "." clear)`); continue; }
    const w = frames[0][0].length, h = frames[0].length;
    if (frames.some(f => f.length !== h || f.some(r => r.length !== w))) why.add(LOOP.malformed, `${name}: every row of every frame is as long as the first, and every frame as tall`);
    else if (w > lim.size || h > lim.size) why.add(LOOP.malformed, `${name}: is ${w} × ${h}, at most ${lim.size} × ${lim.size}`);
    if (frames.some(f => f.some(r => /[^0-9a-fA-F.]/.test(r)))) why.add(LOOP.malformed, `${name}: a frame's rows hold only hex digits (0–f) and "."`);
    const travels = "path" in l || "travel" in l || "pause" in l, at = l.at;
    if (travels) {
      // A travelling loop crosses the picture (from outside it to outside it): its corner goes along `path` in `travel` ms, then nothing is shown for `pause` ms.
      const point = (p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
      if (!(Array.isArray(l.path) && l.path.length === 2 && l.path.every(point))) why.add(LOOP.malformed, `${name}: path is two points, [[x1, y1], [x2, y2]]: its corner at the start and at the end`);
      if (!(typeof l.travel === "number" && l.travel > 0)) why.add(LOOP.malformed, `${name}: travel is the ms it takes to cross, a number above 0`);
      if (!(typeof l.pause === "number" && l.pause >= 0)) why.add(LOOP.malformed, `${name}: pause is the ms with nothing shown before it comes again, 0 or more`);
    } else if (!(Array.isArray(at) && at.length === 2 && at.every(Number.isInteger) && at[0] >= 0 && at[1] >= 0 && at[0] + w <= W && at[1] + h <= H)) why.add(LOOP.malformed, `${name}: at is [x, y] inside the ${W} × ${H} picture, the whole loop with it`);
  }
}
