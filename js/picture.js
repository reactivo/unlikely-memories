// The short way of writing pictures (ART-DIRECTION.md §5): one line per shape, which is what the AI writes,
// about 40% smaller than the same shapes in JSON. The engine turns it into the drawing list it stores and draws.
//
//   rect    sky   0,0,320,58          fade:0,1/0,0/0,58
//   ellipse moon  252,20,9,9          15
//   poly    door  150,100 162,98 162,118 150,120   fade:10,2/146,0/166,0   e0
//   line    -     0,136 146,76        c0
//   dots    stars 12,8 40,20 77,6     c7
//
// Each line: the shape, its id ("-" for none; an id with a stray "-" after it is read as the id alone), its numbers, then any of:
//   a fill: a palette number 0–15; none (only the edge is drawn); mix:a,b@level; fade:a,b/fx,fy/tx,ty;
//           stripes:a,b (in mix and fade, an empty colour leaves what's underneath: mix:,14@0.3)
//   cN  the colour of a line or dots        eN  a 1-pixel edge in colour N        after:id  (in edits only)
// "bg" for a colour number (a fill, cbg, ebg, the colours of mix, fade and stripes): the world's colour, which a cover's and a box art's shapes may
// write (js/hist.js measures it; js/paint.js paints it, and starts the poster's canvas in it); a room's or an ending's picture never does.
// "outline <name> eN" (not a shape: no numbers, no fill): one 1-pixel line in colour N round a whole element, every shape whose id is
// <name> or starts with <name>_, where it meets what lies outside it; none inside. It goes after the element's shapes.
// rect: x,y,width,height · ellipse: cx,cy,rx,ry · poly, line, dots: x,y points. Blank lines and # notes are ignored.
//
// Perspective: a line "vp x,y" sets the picture's vanishing point (not a shape, not counted towards the shape limit). After it, a point
// of a poly, line or dots may be written x,y@t: (x,y) slid towards the vanishing point, both coordinates, rounded; t = 1 is
// the point itself, t = 0 the vanishing point:   vp 160,60   poly wall 40,120@1 40,120@0.5 ...   rect and ellipse take plain numbers.
// Pure: no page; it reads a state (roomDraw, awayFrom), never changes it.

import art from "../content/art.js?v=0.72.1";
import { placeOf, shut } from "./place.js?v=0.72.1";

const SHAPES = ["rect", "poly", "ellipse", "line", "dots"];
const num = (s) => { const n = Number(s); if (s === "" || !Number.isFinite(n)) throw new Error(`"${s}" isn't a number`); return n; };
const nums = (s) => s.split(",").map(num);
const BG = "bg";
const colour = (s, bg = false) => {
  if (s === BG) { if (bg) return BG; throw new Error(`colour bg is the world's colour, for a cover's or a box art's shapes only: a room's or an ending's picture takes palette numbers 0–15`); }
  if (s === "") return null; const n = num(s); if (!Number.isInteger(n) || n < 0 || n > 15) throw new Error(`colour ${s} isn't 0–15`); return n; };
const isPoint = (t) => /^-?[\d.]+,-?[\d.]+(,-?[\d.]+)*$/.test(t);

// One line → one shape (as in the drawing list), or throws with the reason.
// `bg`: the shape may write the colour bg (a cover's or a box art's; a picture of a room or an ending's never).
export function parseShape(line, { bg = false } = {}) {
  const col = (s) => colour(s, bg);
  const t = line.trim().split(/\s+/);
  const kind = t[0];
  // One outline round a whole element (a person, a cart): every shape whose id is the name or starts with it and "_", as they show
  // where this line comes in the order; nothing inside it. "outline ines e0".
  if (kind === "outline") {
    const m = /^outline\s+([A-Za-z][\w]*)\s+e(\d+|bg)$/.exec(line.trim());
    if (!m) throw new Error('an outline is "outline <name> eN": the element\'s name (its shapes\' ids start with it) and a colour');
    return { outline: m[1], edge: col(m[2]) };
  }
  if (!SHAPES.includes(kind)) throw new Error(`"${kind}" isn't a shape (${SHAPES.join(", ")}, or outline)`);
  if (t.length < 3) throw new Error(`a ${kind} needs an id (or -) and its numbers`);
  if (t[2] === "-" && t[1] !== "-") t.splice(2, 1);          // an id and a stray "-" both: as if the "-" weren't there
  const shape = {};
  if (t[1] !== "-") shape.id = t[1];
  let i = 2;
  const points = [];
  while (i < t.length && isPoint(t[i])) points.push(nums(t[i++]));
  if (!points.length) throw new Error(`a ${kind} needs its numbers`);
  if (kind === "rect" || kind === "ellipse") {
    if (points.length !== 1 || points[0].length !== 4) throw new Error(`a ${kind} is four numbers: ${kind === "rect" ? "x,y,width,height" : "cx,cy,rx,ry"}`);
    shape[kind] = points[0];
  } else {
    if (points.some(p => p.length !== 2)) throw new Error(`a ${kind}'s points are x,y pairs`);
    if (kind === "poly" && points.length < 3) throw new Error("a poly needs at least 3 points");
    if (kind === "line" && points.length < 2) throw new Error("a line needs at least 2 points");
    shape[kind] = points;
  }
  for (; i < t.length; i++) {
    const w = t[i];
    if (/^c(\d+|bg)$/.test(w)) shape.color = col(w.slice(1));
    else if (/^e(\d+|bg)$/.test(w)) shape.edge = col(w.slice(1));
    else if (w.startsWith("after:")) shape.after = w.slice(6);
    else if (w === "none") shape.fill = null;
    else if (/^(\d+|bg)$/.test(w)) shape.fill = col(w);
    else if (w.startsWith("mix:")) {
      const m = /^mix:(\d*|bg),(\d*|bg)@([\d.]+)$/.exec(w);
      if (!m) throw new Error(`"${w}" should be mix:a,b@level`);
      shape.fill = { mix: [col(m[1]), col(m[2])], level: num(m[3]) };
    } else if (w.startsWith("fade:")) {
      const m = /^fade:(\d*|bg),(\d*|bg)\/(-?[\d.]+,-?[\d.]+)\/(-?[\d.]+,-?[\d.]+)$/.exec(w);
      if (!m) throw new Error(`"${w}" should be fade:a,b/fx,fy/tx,ty`);
      shape.fill = { fade: [col(m[1]), col(m[2])], from: nums(m[3]), to: nums(m[4]) };
    } else if (w.startsWith("stripes:")) {
      const m = /^stripes:(\d+|bg),(\d+|bg)$/.exec(w);
      if (!m) throw new Error(`"${w}" should be stripes:a,b`);
      shape.fill = { stripes: [col(m[1]), col(m[2])] };
    } else throw new Error(`"${w}" isn't understood`);
  }
  if ((kind === "line" || kind === "dots") && shape.color === undefined) throw new Error(`a ${kind} needs a colour (cN)`);
  if (kind !== "line" && kind !== "dots" && !("fill" in shape)) throw new Error(`a ${kind} needs a fill`);
  return shape;
}

// Several lines → a drawing list, or the problems with their line numbers. `bg`: as parseShape (a cover's or a box art's lines).
export function parseShapes(text, { bg = false } = {}) {
  const shapes = [], problems = [];
  let vp = null;
  text.split("\n").forEach((line, n) => {
    const clean = line.replace(/#.*$/, "").trim();
    if (!clean) return;
    try {
      if (/^vp(\s|$)/.test(clean)) {
        const v = /^vp\s+(-?[\d.]+),(-?[\d.]+)$/.exec(clean);
        if (!v) throw new Error("vp needs x,y (vp 160,60)");
        vp = [num(v[1]), num(v[2])];
        return;
      }
      const t = clean.split(/\s+/);
      const flat = t.map((tok, i) => {
        if (i < 2 || !isDepth(tok)) return tok;
        if (t[0] === "rect" || t[0] === "ellipse") throw new Error(`a ${t[0]} takes plain numbers, not "${tok}"`);
        const m = /^(-?[\d.]+),(-?[\d.]+)@(.*)$/.exec(tok);
        if (!m) throw new Error(`"${tok}" should be x,y@t`);
        if (!vp) throw new Error(`"${tok}": @t before any vp line`);
        const k = /^\d*\.?\d+$/.test(m[3]) ? Number(m[3]) : NaN;
        if (!(k >= 0 && k <= 1)) throw new Error(`"${tok}": @t needs a number from 0 to 1`);
        return [vp[0] + (num(m[1]) - vp[0]) * k, vp[1] + (num(m[2]) - vp[1]) * k].map(Math.round).join(",");
      });
      shapes.push(parseShape(flat.join(" "), { bg }));
    } catch (e) { problems.push(`line ${n + 1}: ${e.message}`); }
  });
  return { shapes, problems };
}
// A point written with @ (a fill's own "@" starts with mix:).
const isDepth = (tok) => /^-?[\d.]/.test(tok) && tok.includes("@");

// A shape → its line (for converting JSON drawing lists, and for showing a picture to the AI).
export function formatShape(s) {
  if (s.outline) return `outline ${s.outline} e${s.edge}`;
  const kind = SHAPES.find(k => s[k]);
  const pts = kind === "rect" || kind === "ellipse" ? s[kind].join(",") : s[kind].map(p => p.join(",")).join(" ");
  const c = (n) => (n === null || n === undefined ? "" : n);
  const f = s.fill;
  const fill = f === undefined ? "" : f === null ? "none" : typeof f === "number" || typeof f === "string" ? String(f)
    : f.mix ? `mix:${c(f.mix[0])},${c(f.mix[1])}@${f.level}`
    : f.fade ? `fade:${c(f.fade[0])},${c(f.fade[1])}/${f.from.join(",")}/${f.to.join(",")}`
    : `stripes:${f.stripes.join(",")}`;
  return [kind, s.id || "-", pts, fill, s.color !== undefined ? "c" + s.color : "", s.edge !== undefined ? "e" + s.edge : "",
          s.after ? "after:" + s.after : ""].filter(Boolean).join(" ");
}

// ---- Figures: a moving thing's picture, as shapes (BRIEF.md §7, "Overlays"; js/movers.js) ---------------------------------------------
// A thing's `figure` is shapes in the notation above (under the figure rules of BRIEF.md §7), drawn in a box FIGURE.width wide and
// FIGURE.height tall: (0,0) its top-left, its feet (or base) on the bottom line, centred on x = FIGURE.feet. An overlay of the thing gives
// `at: [x, y]` (where its feet stand in the room) and `tall` (its height there); placeFigure turns the shapes into the room's own pixels.
export const FIGURE = { width: 40, height: 120, feet: 20 };

// The shapes of a figure written in the notation, or the reasons it doesn't parse (an array of strings, never thrown).
export function readFigure(figure) {
  if (typeof figure !== "string" || !figure.trim()) return { shapes: [], problems: ["is shapes in the short notation (a string, one line per shape)"] };
  const { shapes, problems } = parseShapes(figure);
  return { shapes, problems: problems.length ? problems : shapes.length ? [] : ["has no shapes"] };
}

// Every coordinate of a shape that lies outside the figure's box (as "x,y" texts); an ellipse counts its whole extent, a rect its far corner.
export function outsideBox(shape) {
  const pts = shape.rect ? [[shape.rect[0], shape.rect[1]], [shape.rect[0] + shape.rect[2], shape.rect[1] + shape.rect[3]]]
    : shape.ellipse ? [[shape.ellipse[0] - shape.ellipse[2], shape.ellipse[1] - shape.ellipse[3]], [shape.ellipse[0] + shape.ellipse[2], shape.ellipse[1] + shape.ellipse[3]]]
    : shape.poly || shape.line || shape.dots || [];
  return pts.filter(([x, y]) => x < 0 || y < 0 || x > FIGURE.width || y > FIGURE.height).map(p => p.join(","));
}

// A figure's shapes (as parsed) placed in a room: scaled to `tall` pixels high, its feet on `at` = [x, y]. Points go to the nearest whole
// pixel; a rect's width and height and an ellipse's radii are at least 1 px (a rect keeps its neighbours' shared edges: both of its sides
// are rounded, not its size). An outline line is passed on as it is (it works on the ids). Returns a new drawing list for paintPicture.
export function placeFigure(shapes, at, tall) {
  const k = tall / FIGURE.height;
  const X = (x) => Math.round(at[0] + (x - FIGURE.feet) * k), Y = (y) => Math.round(at[1] - (FIGURE.height - y) * k);
  const P = ([x, y]) => [X(x), Y(y)], size = (v) => Math.max(1, Math.round(v * k));
  return shapes.map(s => {
    if (s.outline) return s;
    const o = { ...s };
    if (s.rect) { const [x, y, w, h] = s.rect, x0 = X(x), y0 = Y(y); o.rect = [x0, y0, Math.max(1, X(x + w) - x0), Math.max(1, Y(y + h) - y0)]; }
    else if (s.ellipse) o.ellipse = [X(s.ellipse[0]), Y(s.ellipse[1]), size(s.ellipse[2]), size(s.ellipse[3])];
    else for (const key of ["poly", "line", "dots"]) if (s[key]) o[key] = s[key].map(P);
    if (s.fill?.fade) o.fill = { ...s.fill, from: P(s.fill.from), to: P(s.fill.to) };
    return o;
  });
}

// A palette cycle's colours with its `rest` (a whole number: the last colour repeated that many more times, so [15, 7, 8] with rest 167 is a
// round of 170): the list the engine and the checker count. The cycle itself is left as written (a scroll has no colours: unchanged).
export const colorsOf = (c) => Array.isArray(c?.colors) && c.colors.length && Number.isInteger(c.rest) && c.rest > 0
  ? [...c.colors, ...Array(c.rest).fill(c.colors[c.colors.length - 1])] : c?.colors;

// An entry of a cycle's `areas`: a shape id, a list of shape ids (a group that moves together) or [x, y, width, height].
export const isGroup = (a) => Array.isArray(a) && a.length > 0 && a.every(x => typeof x === "string");

// The pixels of one entry of a cycle's `areas`: a shape id, a list of shape ids (a group), or [x, y, width, height]; `areas` is what
// each shape id ended up showing (ui/draw.js, paintPicture).
export function areaPixels(a, areas, w, h) {
  if (typeof a === "string") return areas[a] || [];
  if (isGroup(a)) return a.flatMap(id => areas[id] || []);
  const [x0, y0, rw, rh] = a, out = [];
  for (let y = Math.max(0, y0); y < Math.min(h, y0 + rh); y++) for (let x = Math.max(0, x0); x < Math.min(w, x0 + rw); x++) out.push(y * w + x);
  return out;
}

// A picture written in the short notation (a room's, or an ending's): its drawing list parsed (js/picture.js), version 1
// unless it says. Returns the picture as it is stored, or the reasons it can't be, as one string.
export function readPicture(picture) {
  const { shapes, problems } = parseShapes(picture.draw);
  return problems.length ? problems.join("; ") : { version: 1, ...picture, draw: shapes };
}

// A picture with edits applied: shapes removed (by id, or a prefix pattern "jag_*"), replaced or restyled (new colours, same place) by id, shapes added (at the end, or `after` a shape's
// id), cycles, overlays and loops replaced when given. Returns the new picture (version + 1) or the reason it can't.
export function editPicture(picture, e) {
  // Shapes to add or replace can be written in the short notation: a line each, or all in one string.
  const shapes = (x) => typeof x === "string" ? parseShapes(x) : { shapes: (x || []).map(s => (typeof s === "string" ? parseShape(s) : s)), problems: [] };
  try {
    for (const k of ["add", "replace"]) {
      const r = shapes(e[k]);
      if (r.problems.length) return r.problems.join("; ");
      e = { ...e, [k]: r.shapes };
    }
  } catch (err) { return err.message; }
  let draw = picture.draw.map(x => x);
  const has = (id) => draw.some(x => x.id === id);
  // `remove` takes shape ids, or a prefix pattern ("jag_*": every shape whose id starts with "jag_"; it must match at least one)
  for (const id of e.remove || []) {
    const prefix = typeof id === "string" && id.length > 1 && id.endsWith("*") ? id.slice(0, -1) : null;
    if (prefix !== null ? !draw.some(x => typeof x.id === "string" && x.id.startsWith(prefix)) : !has(id)) return "no such shape: " + id;
    draw = draw.filter(x => prefix !== null ? !(typeof x.id === "string" && x.id.startsWith(prefix)) : x.id !== id);
  }
  for (const shape of e.replace || []) {
    if (!has(shape.id)) return "no such shape: " + shape.id;
    draw = draw.map(x => (x.id === shape.id ? shape : x));
  }
  for (const style of e.restyle || []) {             // only how it looks: fill, edge, colour; never where it is
    if (!has(style.id)) return "no such shape: " + style.id;
    const bad = Object.keys(style).find(k => !["id", "fill", "edge", "color"].includes(k));
    if (bad) return "restyle changes only fill, edge and color, not " + bad;
    let look = style;
    if (typeof style.fill === "string") {            // a fill in the short notation: "fade:0,1/0,0/0,60"
      try { look = { ...style, fill: parseShape("rect - 0,0,1,1 " + style.fill).fill }; } catch (err) { return `${style.id}: ${err.message}`; }
    }
    draw = draw.map(x => (x.id === style.id ? { ...x, ...look } : x));
  }
  for (const { after, ...shape } of e.add || []) {
    if (shape.id && has(shape.id)) return "shape already exists: " + shape.id;
    if (after && !has(after)) return "no such shape: " + after;
    const at = after ? draw.findIndex(x => x.id === after) + 1 : draw.length;
    draw.splice(at, 0, shape);
  }
  if (draw.length > art.draw.maxShapes) return "too many shapes";
  return { ...picture, version: picture.version + 1, draw,
           ...(e.cycles ? { cycles: e.cycles } : {}), ...(e.overlays ? { overlays: e.overlays } : {}), ...(e.loops ? { loops: e.loops } : {}) };
}

// The horizontal extent of a shape as drawn, [left, right]: a rect's or an ellipse's own, a poly's, line's or dots' points; null when it has none.
export function shapeSpan(shape) {
  const xs = shape?.rect ? [shape.rect[0], shape.rect[0] + shape.rect[2]]
    : shape?.ellipse ? [shape.ellipse[0] - shape.ellipse[2], shape.ellipse[0] + shape.ellipse[2]]
    : (shape?.poly || shape?.line || shape?.dots || []).map(p => p[0]);
  return xs.length ? [Math.min(...xs), Math.max(...xs)] : null;
}

// ---- Open drawings: a thing that opens is drawn twice (BRIEF.md §7; ART-DIRECTION.md §5) -----------------------------------------------------
// A thing that opens (a door, a gate, a hatch, a chest, a lid) is drawn in its room's picture twice, shut and open: its shut drawing is the shapes whose
// id is the thing's id or starts with "<id>_" (a group), its open drawing the shapes whose id is "<id>_open" or starts with "<id>_open_". The picture
// shows only the one that fits the thing now; nothing a world writes moves one for the other. A shape belongs to the longest thing id it starts with
// ("chest_key" is the key's, not the chest's), and a thing with no open drawing has its shut one always.

// Is the thing open now (true), shut (false), or has it no open state at all (null)? A container is open when its `open` is true (`"always"`, a lid
// it has none: null); a way (`door` or `leads`) or any other thing with a lock: locked is shut, unlocked or `open` is open.
export function openness(o) {
  if (!o || typeof o !== "object") return null;
  if (o.container === true) return o.open === "always" ? null : o.open === true;
  if (o.locked === true) return false;
  if (o.open === true || o.locked === false) return true;
  return o.open === false ? false : null;
}

// Can this thing open at the start, so a picture that draws it needs both drawings? It has a `lock`/`locked`, or it is a closed (or openable) thing.
export const opensAtAll = (o) => !!o && typeof o === "object" && (o.locked !== undefined || (o.open === false && o.open !== "always"));

// The things a room's shapes may be read as, whose id a shape's id starts with (formOf): those that can be in that room at any time in the world as written: a thing whose `at`
// is the room, or a container or holder there (the chain of `at` ends in the room), at the start or as the state has it now, and a thing a rule or a named change `move`s there (or
// adds there with `add: "object"`: a literal room, container or holder), and a thing that opens (opensAtAll) that nothing places in any room, which a picture that draws it is
// read as drawing. A shape named like any other thing of the world (a dressing shape named for a thing of another room) is the picture's own, never that thing's.
// `state`: { world: { rooms, objects }, rules?, changes? } (the game's state; the checker's). Returns a Set of thing ids.
const movesCache = new WeakMap();
function movesOf(state) {
  const key = state.rules && typeof state.rules === "object" ? state.rules : state;
  const hit = movesCache.get(key);
  if (hit && hit.changes === state.changes) return hit.moves;
  const moves = [];
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== "object") return;
    if (typeof n.move === "string" && typeof n.to === "string") moves.push([n.move, n.to]);
    else if (n.add === "object" && typeof n.id === "string" && typeof n.at === "string") moves.push([n.id, n.at]);
    for (const v of Object.values(n)) walk(v);
  };
  walk(state.rules); walk(state.changes);
  movesCache.set(key, { changes: state.changes, moves });
  return moves;
}
// "At the start" is the world as written (its `add object` effects), since the state keeps only where things are now: a thing taken from its room, or
// removed from the world, is still a thing of the room it started in. worlds/load.js tells this module where a game's world is (readStartsWith); a
// state with no world of worlds/ (a test's own set, a hand-in being checked: its state is its start) reads the state alone.
let worldOf = () => null;
export const readStartsWith = (fn) => { worldOf = fn; };
const startsCache = new WeakMap();
function startsOf(state) {
  const w = worldOf(state);
  if (!w || typeof w !== "object" || !Array.isArray(w.effects)) return null;
  let m = startsCache.get(w);
  if (!m) { m = {}; for (const e of w.effects) if (e?.add === "object" && typeof e.id === "string") m[e.id] = { at: e.at }; startsCache.set(w, m); }
  return m;
}
export function thingsOf(state, roomId) { return readThings(state, roomId).things; }
function readThings(state, roomId) {
  const rooms = state.world?.rooms || {}, objects = state.world?.objects || {}, things = new Set(), starts = startsOf(state);
  const roomOf = (x, all = objects, seen = new Set()) => {
    if (typeof x !== "string") return null;
    if (Object.hasOwn(rooms, x)) return x;
    if (!Object.hasOwn(all, x) || seen.has(x)) return null;
    seen.add(x);
    return roomOf(all[x]?.at, all, seen);
  };
  const placed = new Set();
  for (const [id, o] of Object.entries(objects)) { const r = roomOf(o?.at); if (r !== null) placed.add(id); if (r === roomId) things.add(id); }
  if (starts) for (const [id, o] of Object.entries(starts)) { const r = roomOf(o.at, starts); if (r !== null) placed.add(id); if (r === roomId) things.add(id); }   // (removed since: still its room's)
  for (const [id, to] of movesOf(state)) if (Object.hasOwn(objects, id)) { const r = roomOf(to); if (r !== null) placed.add(id); if (r === roomId) things.add(id); }
  for (const [id, o] of Object.entries(objects)) if (!placed.has(id) && opensAtAll(o)) things.add(id);
  return { things, placed };
}

// The things of a room (thingsOf) whose shapes are not painted now, because the thing is not in that room (BRIEF.md §7, "Shape ids and things"):
// a thing is in the room when its place is the room (placeOf: itself, or in or on something there, a person's hands included) and it is not shut
// away in a closed container, as the room's text sees it; carried, in another room, out of play (`at: null`) or in a shut box, it is away. A thing
// that opens and that nothing places in any room (a door drawn in the room it leads from) is never away. `only`: thingsOf(state, roomId), if known.
export function awayFrom(state, roomId, only) {
  const { things, placed } = readThings(state, roomId), away = new Set();
  for (const id of only ?? things) if (placed.has(id) && (placeOf(state, id) !== roomId || shut(state, id))) away.add(id);
  return away;
}

// The drawing list a room's picture paints now (the one way every painter reads it: the screen, the sheets, the cards, the tests): its things that open
// shown open or shut (shownDraw), and the shapes of a thing that is not in the room (awayFrom) left out until it is back. `state` is the game's (or
// { world: { rooms, objects }, rules?, changes? }); `force`: as shownDraw's.
export function roomDraw(state, roomId, draw = state.world?.rooms?.[roomId]?.picture?.draw, force) {
  const only = thingsOf(state, roomId);
  return shownDraw(draw, state.world?.objects, force, only, awayFrom(state, roomId, only));
}

// Is a shape `id` a shape of the element `name`: its id is the name, or starts with name + "_" (an outline's element, a loop's `under`, a
// thing's drawings: "chest", "chest_lid")? One rule, for the painter, the checks and the screen.
export const isShapeOf = (id, name) => typeof id === "string" && (id === name || id.startsWith(name + "_"));

// A shape id split into the thing it belongs to and which of its drawings it is: { id, open } for the longest thing (`things`: id → thing,
// or a Set of ids) that is the id or its start before an underscore; null when it belongs to none. (id "chest_open_lid" with a chest: { id: "chest", open: true }.)
// `has(id)`: is it a thing to read shapes as: the things of the picture's room (thingsOf), not every thing of the world.
export function formOf(shapeId, has) {
  if (typeof shapeId !== "string") return null;
  const parts = shapeId.split("_");
  for (let n = parts.length; n >= 1; n--) {
    const id = parts.slice(0, n).join("_");
    if (!has(id)) continue;
    const rest = parts.slice(n);
    return { id, open: rest[0] === "open" };
  }
  return null;
}

// The drawing list to paint for the things as they are now: the same list when nothing in it has an open drawing, else without the open drawings of
// shut things and without the shut drawings of open ones. `objects`: the world's things by id (the state's `world.objects`, or the same read from a
// world's own list). A thing with an open drawing is shown open by `openness`; one that cannot be said to open shows shut. `only`: the things of the
// picture's room (thingsOf; a Set of ids): a shape is read as a thing's drawing only for one of them (none: every thing of the world, as it was).
// `away`: the things of the room that are not in it now (awayFrom; a Set of ids): their shapes, open or shut, are left out (roomDraw passes it).
export function shownDraw(draw, objects, force, only, away) {
  const gone = away instanceof Set && away.size > 0;
  if (!Array.isArray(draw) || (!gone && !draw.some(s => typeof s?.id === "string" && s.id.includes("_open")))) return draw;
  const has = (id) => (only ? only.has(id) : Object.hasOwn(objects || {}, id));   // (`only` may hold a thing removed from the world: still the room's, and away)
  const forms = draw.map(s => formOf(s?.id, has));
  const withOpen = new Set(forms.filter(f => f?.open).map(f => f.id));
  if (!withOpen.size && !(gone && forms.some(f => f && away.has(f.id)))) return draw;
  return draw.filter((s, i) => {
    const f = forms[i];
    if (f && gone && away.has(f.id)) return false;
    if (!f || !withOpen.has(f.id)) return true;
    return f.open === (force ?? openness(objects?.[f.id]) === true);   // (`force`: true or false, every thing as open or as shut: what the checker paints)
  });
}

// What is wrong with a picture's open drawings, as the things of its world are (the checker, js/checks/drawings.js): a thing that can open (it has `locked`,
// or is a closed container) and is drawn must have its open drawing "<id>_open" too, and an open drawing needs a thing that can open and a shut one.
// `only`: the things of the picture's room (thingsOf): a shape named for a thing of another room is not read as its drawing; a name "<thing>_open…" of no thing at all is a slip.
export function openDrawingProblems(draw, objects, only) {
  const exists = (id) => Object.hasOwn(objects || {}, id), has = (id) => exists(id) && (!only || only.has(id)), why = [];
  const ids = (draw || []).map(s => s?.id).filter(id => typeof id === "string");
  const forms = new Map();                                   // thing id → { shut, open } as drawn
  for (const id of ids) { const f = formOf(id, has); if (f) forms.set(f.id, { ...forms.get(f.id), [f.open ? "open" : "shut"]: true }); }
  for (const [id, f] of forms) {
    const o = objects[id];
    if (!f.open && opensAtAll(o)) why.push(`"${id}" can open (${o.locked !== undefined ? "it has `locked`" : "it is shut"}) and is drawn, but the picture has no open drawing "${id}_open" (a shape, or shapes "${id}_open_…": BRIEF.md §7)`);
    else if (f.open && !f.shut) why.push(`"${id}_open" is drawn but the shut drawing "${id}" (or "${id}_…") is not: a thing that opens is drawn both ways`);
    else if (f.open && openness(o) === null) why.push(`"${id}_open" is an open drawing, but "${id}" has nothing that opens (no \`locked\`, no lid): ${id} is never shown open`);
  }
  for (const id of ids) {
    const m = /^(.+?)_open(_|$)/.exec(id);
    if (m && !formOf(id, exists)) why.push(`"${id}" is an open drawing ("<thing>_open"), but there is no thing "${m[1]}" in the world that opens`);
  }
  return why;
}

// What a picture's things show now, as a key for its painted copy: the ids of the things drawn open, and "-<id>" for each drawn thing that is away
// (`away`: awayFrom; its shapes are left out), sorted; "" when none are.
export function openKey(draw, objects, only, away) {
  if (!Array.isArray(draw)) return "";
  const has = (id) => (only ? only.has(id) : Object.hasOwn(objects || {}, id));
  const ids = new Set();
  for (const s of draw) {
    const f = formOf(s?.id, has);
    if (f && away?.has(f.id)) ids.add("-" + f.id);
    else if (f?.open && openness(objects?.[f.id]) === true) ids.add(f.id);
  }
  return [...ids].sort().join(",");
}
