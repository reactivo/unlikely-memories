// Exits: the forms an exit may take, and what each says about where it leads (ARCHITECTURE.md §3, "Rooms"). Pure, no
// state: whether a conditional exit is open right now is the engine's to say (exitNow in js/engine.js), because it
// reads the same conditions a rule does.
//
//   "shop"                                     a room: the way is open
//   true                                       there is a way, but a rule answers
//   false                                      no way
//   { to, if?, closed?, in?, out? }            a way with a condition: open while `if` holds; else `closed` is said.
//   { to, requires, spends?, lacking? }        a way you pass only holding that thing (decision 41); `spends: true` takes it from
//                                              you as you go; else `lacking` is said (or the stock line)
//                                              `in: true` / `out: true` mark it as the way into / out of a place
//                                              (a hut at the east end of the street): "in" / "out" take it. A way marked
//                                              `in: true` also makes the way back, on the other side, the `out` (wayAt)
//                                              `passage: true` marks a way that skips the grid inside one area (a looping
//                                              corridor: js/space.js); the checker refuses one that does it unmarked
//
// A `connect` effect writes an exit too, and may carry the same fields beside `connect`, `dir` and `to` (connectedExit).

import { isObject } from "./shapes.js?v=0.53.6";
export const isExitObject = isObject;

// The ways a thing is: the directions going through it takes, from its `door` (a door, gate or hatch on that way) or its `leads` (stairs,
// a shop front, a cave: a way you climb or walk into; one direction, or a list for stairs that go both up and down, ["u", "d"]). A thing
// has one or the other, never both. Empty for a thing that is no way.
export const waysOf = (o) => (o?.door != null ? [o.door] : o?.leads == null ? [] : [].concat(o.leads));

// The way a thing is taken when no direction is typed ("climb the stairs"): up, if it leads up, else its first way. Null for a thing
// that is no way. A direction typed with it wins ("climb down the stairs": js/parser.js).
export const wayOf = (o) => { const w = waysOf(o); return w.includes("u") ? "u" : w[0] ?? null; };

// Where an exit leads, whatever its form: a room id, true, or false (none). A conditional exit's `to`, open or not.
export const exitTo = (x) => (isExitObject(x) ? (x.to ?? false) : (x ?? false));

// An exit's `if` as a list of conditions that must all hold, or null when it can never hold (`if: false`). No `if`,
// or `true`, is always: an empty list. One condition may be written without the list ({ "time.hour": { … } }).
export function exitConditions(x) {
  if (!isExitObject(x) || x.if === undefined || x.if === true) return [];
  if (x.if === false) return null;
  return Array.isArray(x.if) ? x.if : [x.if];
}

// The directions of a room whose exit is marked as the way `way` ("in" or "out"): `in: true` / `out: true` on an exit
// that is itself a compass direction (a real `in` / `out` exit is not a mark; it is the way already).
export const markedDirs = (exits, way) =>
  Object.keys(exits || {}).filter(d => d !== "in" && d !== "out" && isExitObject(exits[d]) && exits[d][way] === true);

// Which exit answers IN or OUT in a room: its own `in` / `out` exit if it has one (a real exit wins), else the one exit
// marked `in: true` / `out: true` (a way in a compass direction that is also the way into or out of a place). Returns
// that exit's direction ("in", "e"), or null when nothing answers. Other directions are not asked.
export function wayFor(exits, dir) {
  if (exits?.[dir]) return dir;
  return markedDirs(exits, dir)[0] ?? null;
}

// The same for a room in the world's rooms, with the way back: a room with no way of its own for "out" (no `out` exit, no exit
// marked `out: true`) takes the exit that leads back to a room whose exit is marked `in: true` and leads here. So the hut at the
// east end of the street, where the street's exit east is `in: true`, needs no mark of its own for the way back west. "in" is only
// ever what the room says itself. Returns the direction, or null when nothing answers.
export function wayAt(rooms, roomId, dir) {
  const exits = rooms?.[roomId]?.exits, own = wayFor(exits, dir);
  if (own || dir !== "out") return own;
  const entered = Object.entries(rooms || {}).filter(([id, r]) => id !== roomId && markedDirs(r.exits, "in").some(d => exitTo(r.exits[d]) === roomId)).map(([id]) => id);
  return Object.keys(exits || {}).find(d => d !== "in" && d !== "out" && entered.includes(exitTo(exits[d]))) ?? null;
}

// Every way in or out of somewhere is a thing in the room (a door, a hatch, a hole, a gate, a tent: BRIEF.md §8, "Exits"). The way
// a thing is in a room, as the direction going through it takes there: its own `door` / `leads`, with "in" / "out" turned into the
// room's way in / out (wayAt: the exit marked `in: true`, or the real `in` exit). [] for a thing that is no way.
const dirsThrough = (rooms, roomId, o) => waysOf(o).map(w => (w === "in" || w === "out" ? wayAt(rooms, roomId, w) ?? w : w));

// The things of the world in a room that are its way `dir` (a direction it has an exit in): `{ id, dir }` for each object there whose
// `door` or `leads` goes that way. The checker asks it of every in / out exit and every exit marked `in` / `out` (one is a problem
// without its thing); IN and OUT typed alone ask it which things to go through (js/parser.js). Pure: `world` is { rooms, objects }.
export const thingsFor = (world, roomId, dir) =>
  Object.entries(world?.objects || {}).filter(([, o]) => o?.at === roomId && dirsThrough(world.rooms, roomId, o).includes(dir)).map(([id]) => ({ id, dir }));

// The ways into (`way` "in") or out of ("out") a room that are things: the things that are the room's way in / out (its `in` exit,
// or the one marked `in: true`; for "out" also the way back, wayAt), and the things whose own way is "in" / "out". `{ id, dir }`.
export function waysAsThings(world, roomId, way) {
  const dir = wayAt(world?.rooms, roomId, way);
  return Object.entries(world?.objects || {}).filter(([, o]) => o?.at === roomId)
    .flatMap(([id, o]) => { const ds = dirsThrough(world.rooms, roomId, o); return ds.includes(dir) ? [{ id, dir }] : ds.includes(way) ? [{ id, dir: way }] : []; });
}

// The exits of a room that are a way in or out of somewhere: its `in` and `out` exits (not `false`), and the ones marked `in: true` /
// `out: true`. Each needs its thing in the room (thingsFor; js/checklint.js, inOutProblems). [direction, "in" | "out"] pairs.
export const inOutExits = (exits) => Object.entries(exits || {}).flatMap(([d, x]) =>
  (d === "in" || d === "out") ? (exitTo(x) !== false ? [[d, d]] : []) : isExitObject(x) ? ["in", "out"].filter(w => x[w] === true).map(w => [d, w]) : []);

// What a `connect` effect writes into the room's exits: the plain room id, or, when the effect carries any of the
// exit's other fields (`in`, `out`, `if`, `closed`), the exit object. `disconnect` writes false, whatever the form.
export const CONNECT_FIELDS = ["if", "closed", "in", "out", "requires", "spends", "lacking"];
export function connectedExit(e) {
  const extra = Object.fromEntries(CONNECT_FIELDS.filter(k => e[k] !== undefined).map(k => [k, e[k]]));
  return Object.keys(extra).length ? { to: e.to, ...extra } : e.to;
}
