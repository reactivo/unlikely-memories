// Exits: the forms an exit may take, and what each says about where it leads (ARCHITECTURE.md §3, "Rooms"). Pure, no
// state: whether a conditional exit is open right now is the engine's to say (exitNow in js/engine.js), because it
// reads the same conditions a rule does.
//
//   "shop"                                     a room: the way is open
//   true                                       there is a way, but a rule answers
//   false                                      no way
//   { to, if?, closed?, in?, out? }            a way with a condition: open while `if` holds; else `closed` is said.
//                                              `in: true` / `out: true` mark it as the way into / out of a place
//                                              (a hut at the east end of the street): "in" / "out" take it
//
// A `connect` effect writes an exit too, and may carry the same fields beside `connect`, `dir` and `to` (connectedExit).

export const isExitObject = (x) => x !== null && typeof x === "object" && !Array.isArray(x);

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

// What a `connect` effect writes into the room's exits: the plain room id, or, when the effect carries any of the
// exit's other fields (`in`, `out`, `if`, `closed`), the exit object. `disconnect` writes false, whatever the form.
export const CONNECT_FIELDS = ["if", "closed", "in", "out"];
export function connectedExit(e) {
  const extra = Object.fromEntries(CONNECT_FIELDS.filter(k => e[k] !== undefined).map(k => [k, e[k]]));
  return Object.keys(extra).length ? { to: e.to, ...extra } : e.to;
}
