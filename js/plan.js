// The plan: where every room of a world is, and the exits made from it (ARCHITECTURE.md §3, "The plan"; BRIEF.md §2).
//
// A world's change set has a `plan`: one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// room is on exactly one square and a square holds at most one room. An exit says only that there is a way in a direction (and its door,
// its condition, what it requires); where it leads is never written: it is the room on the next square that way, or, for u and d, the room
// on the same square of the floor above or below. `compilePlan` turns the set into what the engine builds: each room's exits get their
// destinations, the way back is opened too (unless the exit is `oneWay: true`), and the squares are kept in the state (`world.plan`).
// A plan that doesn't fit (an unknown id, a room on two squares or none, a way to an empty square) refuses the world with a message that
// says what to move. Pure: reads the set, changes nothing.

import { isObject } from "./shapes.js?v=0.69.1";

export const COMPASS = ["n", "s", "e", "w", "u", "d"];       // the directions an exit of a planned world is written in
export const BACK = { n: "s", s: "n", e: "w", w: "e", u: "d", d: "u" };
const STEP = { n: [0, -1, 0], s: [0, 1, 0], e: [1, 0, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1] };
const WORDS = { n: "north", s: "south", e: "east", w: "west", u: "up", d: "down" };
export const PLAN_FORM = `{ "0": ["street  shop", ".       ."] }`;      // the shape of a plan, in every message that tells it
export const NO_PLAN = `plan: a world has a plan: an object with a grid for each floor, e.g. ${PLAN_FORM} (a row of room ids for each row of squares, "." for an empty square), and its exits are written without the rooms they lead to`;
export const WAY = "way";                                    // what a plain exit says: there is a way here
export const GAP = ".";                                      // what an empty square says

const key = (x, y, z) => x + "," + y + "," + z;
// A square as a person counts it, from the north-west corner of the floor, from 1: "floor 1, row 2, column 3".
const where = ([x, y, z]) => `floor ${z}, row ${y + 1}, column ${x + 1}`;
const quote = (s) => JSON.stringify(s);

// The nearest room id to a mistyped one (a letter off), or null.
function nearest(id, ids) {
  const dist = (a, b) => {
    const row = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) { let diag = row[0]; row[0] = i; for (let j = 1; j <= b.length; j++) { const up = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1)); diag = up; } }
    return row[b.length];
  };
  const best = ids.map(x => [dist(id, x), x]).sort((a, b) => a[0] - b[0])[0];
  return best && best[0] <= 2 ? best[1] : null;
}

// Read a plan: { squares: { id: [x, y, z] }, grid: Map("x,y,z" → id), problems: [text] }. `ids` are the world's room ids.
export function readPlan(plan, ids) {
  const squares = {}, grid = new Map(), problems = [], seen = new Map();   // seen: id → the squares it was written on
  if (!isObject(plan) || !Object.keys(plan).length) {
    problems.push(NO_PLAN);
    return { squares, grid, problems };
  }
  for (const [name, rows] of Object.entries(plan)) {
    if (!/^-?\d+$/.test(name)) { problems.push(`plan: ${quote(name)} is not a floor: floors are whole numbers, "0" the ground floor, "1" the floor above, "-1" the one below`); continue; }
    const z = Number(name);
    if (!Array.isArray(rows) || !rows.every(r => typeof r === "string")) {
      problems.push(`plan: floor ${z} is a list of rows, each a string of room ids separated by spaces ("." for an empty square)`);
      continue;
    }
    rows.forEach((row, y) => row.trim().split(/\s+/).filter(Boolean).forEach((cell, x) => {
      if (cell === GAP) return;
      const at = [x, y, z];
      if (!ids.includes(cell) && /[,;|\/+&]/.test(cell)) {
        problems.push(`plan: ${where(at)} is ${quote(cell)}, two rooms on one square: a square holds one room. Put one of them on a square of its own (a gap "." beside it, or another floor)`);
        return;
      }
      if (!ids.includes(cell)) {
        const near = nearest(cell, ids);
        problems.push(`plan: ${where(at)} is ${quote(cell)}, but no room has that id${near ? ` (did you mean ${quote(near)}?)` : ""}: write a room's id, or "." for an empty square`);
        return;
      }
      (seen.get(cell) ?? seen.set(cell, []).get(cell)).push(at);
      squares[cell] ??= at;
      grid.set(key(x, y, z), cell);
    }));
  }
  for (const [id, list] of seen)
    if (list.length > 1) problems.push(`plan: room ${quote(id)} is on ${list.length} squares (${list.map(where).join(", and ")}): a room has one square; take it off all but one`);
  for (const id of ids) if (!seen.has(id)) problems.push(`plan: room ${quote(id)} is on no square: put it on the plan (every room is on exactly one square)`);
  return { squares, grid, problems };
}

// The room next to a room in a direction, or null: [id, square] of the neighbour, whatever is there.
export function neighbour(squares, grid, id, dir) {
  const s = squares[id];
  if (!s || !STEP[dir]) return null;
  const t = s.map((v, i) => v + STEP[dir][i]);
  return { square: t, id: grid.get(key(...t)) ?? null };
}

// The same from a state's plan, which is { id: [x, y, z] }: the room on the next square in a direction, or null.
export function roomBeside(plan, id, dir) {
  const s = plan?.[id];
  if (!s || !STEP[dir]) return null;
  const t = s.map((v, i) => v + STEP[dir][i]);
  return Object.keys(plan).find(r => plan[r].every((v, i) => v === t[i])) ?? null;
}

const NEXT = { n: "north of", s: "south of", e: "east of", w: "west of", u: "above", d: "below" };
const EMPTY = (id, dir, square) => `room ${quote(id)}: exit ${dir} (${WORDS[dir]}) has no room to lead to: the square ${NEXT[dir]} it (${where(square)}) is empty. Put a room there on the plan, or take the exit out`;

// One exit as written → what it becomes: a room id, true, false, or an exit object with `to`. Problems are told, never thrown.
//   "way" / { if, closed, in, … } → an opening: its `to` is the room beside; true / { to: true, … } → a rule answers; false → none.
function resolveExit(id, dir, x, squares, grid, problems) {
  const near = neighbour(squares, grid, id, dir);
  const open = (rest) => {
    if (!near?.id) { problems.push(EMPTY(id, dir, near.square)); return null; }
    return Object.keys(rest).length ? { to: near.id, ...rest } : near.id;
  };
  if (x === false || x === true) return x;
  if (x === WAY) return open({});
  if (typeof x === "string") {
    problems.push(`room ${quote(id)}: exit ${dir} is ${quote(x)}: an exit says only that there is a way, ${quote(WAY)}, never the room it leads to (that is the room on the next square, ${near?.id ? quote(near.id) : "empty now"}). Write ${dir}: ${quote(WAY)}`);
    return null;
  }
  if (isObject(x)) {
    const { to, oneWay, ...rest } = x;
    if (to === true) return { to, ...rest };                  // a way a rule answers, with a condition
    if (to !== undefined) {
      problems.push(`room ${quote(id)}: exit ${dir} says where it leads (to: ${JSON.stringify(to)}): take "to" out; an exit only says there is a way, and it leads to the room on the next square (${near?.id ? quote(near.id) : "empty now"})`);
      return null;
    }
    return open(rest);
  }
  problems.push(`room ${quote(id)}: exit ${dir} is ${JSON.stringify(x)}: write ${quote(WAY)}, true (a rule answers), false (no way) or an object with its door, if, closed…`);
  return null;
}

// Every `connect` / `disconnect` effect inside a value, at any depth (rules, named changes, effects): each is { connect: <room>, dir, … }.
export function connectsIn(value, found = []) {
  if (Array.isArray(value)) value.forEach(v => connectsIn(v, found));
  else if (isObject(value)) {
    if (typeof value.connect === "string" && typeof value.dir === "string") found.push(value);
    for (const v of Object.values(value)) connectsIn(v, found);
  }
  return found;
}

// A planned set → { effects, plan, problems }: the set's effects with each room's exits resolved, and the squares `{ id: [x, y, z] }`.
// With problems the rest is not to be used.
export function compilePlan(set) {
  const effects = Array.isArray(set.effects) ? set.effects : [];
  const rooms = effects.filter(e => isObject(e) && e.add === "room" && typeof e.id === "string");
  const ids = rooms.map(e => e.id);
  const { squares, grid, problems } = readPlan(set.plan, ids);
  if (problems.length) return { effects, plan: null, problems };
  const exits = new Map(rooms.map(e => [e.id, {}]));         // what each room's exits become
  const oneWay = new Set();                                    // "room dir": an exit that is not opened from the other side
  for (const e of rooms) {
    const written = isObject(e.exits) ? e.exits : {};
    for (const [dir, x] of Object.entries(written)) {
      if (!COMPASS.includes(dir)) {
        problems.push(dir === "in" || dir === "out"
          ? `room ${quote(e.id)}: exit ${quote(dir)} is not an exit: IN and OUT are names for a real direction. Write the way as n, s, e, w, u or d and mark it: ${quote("e")}: { in: true } (the way in) or { out: true } (the way out)`
          : `room ${quote(e.id)}: ${quote(dir)} is not a direction: exits are n, s, e, w, u and d`);
        continue;
      }
      const done = resolveExit(e.id, dir, x, squares, grid, problems);
      if (done === null) continue;
      exits.get(e.id)[dir] = done;
      if (isObject(x) && x.oneWay === true) oneWay.add(e.id + " " + dir);
    }
  }
  if (problems.length) return { effects, plan: null, problems };
  // The way back: a way opens from both sides, unless it is one-way, or the room on the other side has said something of its own about it.
  for (const e of rooms) for (const [dir, x] of Object.entries(exits.get(e.id))) {
    const to = typeof x === "string" ? x : isObject(x) && typeof x.to === "string" ? x.to : null;
    if (!to || oneWay.has(e.id + " " + dir)) continue;
    const back = exits.get(to), had = isObject(rooms.find(r => r.id === to).exits) && BACK[dir] in rooms.find(r => r.id === to).exits;
    if (!had) back[BACK[dir]] = e.id;
  }
  // `connect` effects (a way that comes later) need no `to` either; the room beside is where it leads.
  for (const c of connectsIn([set.effects, set.rules, set.changes])) {
    if (!(c.connect in squares)) { problems.push(`connect: ${quote(c.connect)} is not a room of the plan`); continue; }
    if (!COMPASS.includes(c.dir)) { problems.push(`connect ${quote(c.connect)}: ${quote(c.dir)} is not a direction: n, s, e, w, u or d (an IN or OUT way is marked on one of them: { in: true })`); continue; }
    if (c.to !== undefined) problems.push(`connect ${quote(c.connect)} ${c.dir}: take "to" out; the way leads to the room on the next square`);
    else if (c.connect && !neighbour(squares, grid, c.connect, c.dir)?.id && c.disconnect === undefined)
      problems.push(EMPTY(c.connect, c.dir, neighbour(squares, grid, c.connect, c.dir).square).replace(/^room/, "connect: room"));
  }
  if (problems.length) return { effects, plan: null, problems };
  const built = effects.map(e => (isObject(e) && e.add === "room" && typeof e.id === "string") ? { ...e, exits: exits.get(e.id) } : e);
  return { effects: built, plan: squares, problems: [] };
}
