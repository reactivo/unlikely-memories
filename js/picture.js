// The short way of writing pictures (ART-DIRECTION.md §5): one line per shape, which is what the AI writes,
// about 40% smaller than the same shapes in JSON. The engine turns it into the drawing list it stores and draws.
//
//   rect    sky   0,0,320,58          fade:0,1/0,0/0,58
//   ellipse moon  252,20,9,9          15
//   poly    door  150,100 162,98 162,118 150,120   fade:10,2/146,0/166,0   e0
//   line    -     0,136 146,76        c0
//   dots    stars 12,8 40,20 77,6     c7
//
// Each line: the shape, its id ("-" for none), its numbers, then any of:
//   a fill: a palette number 0–15; none (only the edge is drawn); mix:a,b@level; fade:a,b/fx,fy/tx,ty;
//           stripes:a,b (in mix and fade, an empty colour leaves what's underneath: mix:,14@0.3)
//   cN  the colour of a line or dots        eN  a 1-pixel edge in colour N        after:id  (in edits only)
// rect: x,y,width,height · ellipse: cx,cy,rx,ry · poly, line, dots: x,y points. Blank lines and # notes are ignored.
// Pure: no page, no state.

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
  text.split("\n").forEach((line, n) => {
    const clean = line.replace(/#.*$/, "").trim();
    if (!clean) return;
    try { shapes.push(parseShape(clean)); } catch (e) { problems.push(`line ${n + 1}: ${e.message}`); }
  });
  return { shapes, problems };
}

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
