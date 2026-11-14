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
// rect: x,y,width,height · ellipse: cx,cy,rx,ry · poly, line, dots: x,y points. Blank lines and # notes are ignored.
//
// Perspective: a line "vp x,y" sets the picture's vanishing point (not a shape, not counted towards the shape limit). After it, a point
// of a poly, line or dots may be written x,y@t: (x,y) slid towards the vanishing point, both coordinates, rounded; t = 1 is
// the point itself, t = 0 the vanishing point:   vp 160,60   poly wall 40,120@1 40,120@0.5 ...   rect and ellipse take plain numbers.
// Pure: no page, no state.

import art from "../content/art.js?v=0.49.2";

const SHAPES = ["rect", "poly", "ellipse", "line", "dots"];
const num = (s) => { const n = Number(s); if (s === "" || !Number.isFinite(n)) throw new Error(`"${s}" isn't a number`); return n; };
const nums = (s) => s.split(",").map(num);
const colour = (s) => { if (s === "") return null; const n = num(s); if (!Number.isInteger(n) || n < 0 || n > 15) throw new Error(`colour ${s} isn't 0–15`); return n; };
const isPoint = (t) => /^-?[\d.]+,-?[\d.]+(,-?[\d.]+)*$/.test(t);

// One line → one shape (as in the drawing list), or throws with the reason.
export function parseShape(line) {
  const t = line.trim().split(/\s+/);
  const kind = t[0];
  if (!SHAPES.includes(kind)) throw new Error(`"${kind}" isn't a shape (${SHAPES.join(", ")})`);
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
    if (/^c\d+$/.test(w)) shape.color = colour(w.slice(1));
    else if (/^e\d+$/.test(w)) shape.edge = colour(w.slice(1));
    else if (w.startsWith("after:")) shape.after = w.slice(6);
    else if (w === "none") shape.fill = null;
    else if (/^\d+$/.test(w)) shape.fill = colour(w);
    else if (w.startsWith("mix:")) {
      const m = /^mix:(\d*),(\d*)@([\d.]+)$/.exec(w);
      if (!m) throw new Error(`"${w}" should be mix:a,b@level`);
      shape.fill = { mix: [colour(m[1]), colour(m[2])], level: num(m[3]) };
    } else if (w.startsWith("fade:")) {
      const m = /^fade:(\d*),(\d*)\/(-?[\d.]+,-?[\d.]+)\/(-?[\d.]+,-?[\d.]+)$/.exec(w);
      if (!m) throw new Error(`"${w}" should be fade:a,b/fx,fy/tx,ty`);
      shape.fill = { fade: [colour(m[1]), colour(m[2])], from: nums(m[3]), to: nums(m[4]) };
    } else if (w.startsWith("stripes:")) {
      const m = /^stripes:(\d+),(\d+)$/.exec(w);
      if (!m) throw new Error(`"${w}" should be stripes:a,b`);
      shape.fill = { stripes: [colour(m[1]), colour(m[2])] };
    } else throw new Error(`"${w}" isn't understood`);
  }
  if ((kind === "line" || kind === "dots") && shape.color === undefined) throw new Error(`a ${kind} needs a colour (cN)`);
  if (kind !== "line" && kind !== "dots" && !("fill" in shape)) throw new Error(`a ${kind} needs a fill`);
  return shape;
}

// Several lines → a drawing list, or the problems with their line numbers.
export function parseShapes(text) {
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
      shapes.push(parseShape(flat.join(" ")));
    } catch (e) { problems.push(`line ${n + 1}: ${e.message}`); }
  });
  return { shapes, problems };
}
// A point written with @ (a fill's own "@" starts with mix:).
const isDepth = (tok) => /^-?[\d.]/.test(tok) && tok.includes("@");

// A shape → its line (for converting JSON drawing lists, and for showing a picture to the AI).
export function formatShape(s) {
  const kind = SHAPES.find(k => s[k]);
  const pts = kind === "rect" || kind === "ellipse" ? s[kind].join(",") : s[kind].map(p => p.join(",")).join(" ");
  const c = (n) => (n === null || n === undefined ? "" : n);
  const f = s.fill;
  const fill = f === undefined ? "" : f === null ? "none" : typeof f === "number" ? String(f)
    : f.mix ? `mix:${c(f.mix[0])},${c(f.mix[1])}@${f.level}`
    : f.fade ? `fade:${c(f.fade[0])},${c(f.fade[1])}/${f.from.join(",")}/${f.to.join(",")}`
    : `stripes:${f.stripes.join(",")}`;
  return [kind, s.id || "-", pts, fill, s.color !== undefined ? "c" + s.color : "", s.edge !== undefined ? "e" + s.edge : "",
          s.after ? "after:" + s.after : ""].filter(Boolean).join(" ");
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
