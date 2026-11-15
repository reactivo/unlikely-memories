// Opening: the start room of a world, built from what the world declares (ARCHITECTURE.md §3, "The opening"; what the world writes:
// BRIEF.md §3). A world starts in its start room, an ordinary room of its first area, on the map, that you can come back to; it is
// left only through the `way` thing's exit (any direction, n/s/e/w, up, down, in or out, to a room of its own area on any level),
// closed at the start and opened by an action the world writes with the engine's own
// mechanisms (a locked door and its key, a rule that `connect`s the way, USE on a rope, a thing given to someone). The world names
// the room and its three things (the hints thing, the intro, the way out) and writes two lines; this module gives the hints thing
// and the intro their mechanics, the same for every world. The way out is the world's own: no rule here touches it.
// (Beginning again is not in the opening: it is the session's, in js/main.js.)
// Pure: reads the state, never changes it. The engine (js/engine.js) applies what these return and keeps the hints thing and the
// intro fixed; the checker (js/checklint.js, checkOpening) holds the start room to its guarantees.
//
//   opening: { room, hints, intro, way, lines: { hintFrame, farewell } }

import { DIRECTIONS } from "./space.js?v=0.55.0";
import { waysOf, wayAt, exitTo } from "./exits.js?v=0.55.0";

export const PARTS = ["room", "hints", "intro", "way"];
export const THINGS = ["hints", "intro", "way"];
export const LINES = ["hintFrame", "farewell"];
// The lines and the key of the old opening (held back until the hints thing was carried, then through to `game.entrance`): a world
// still declaring them is refused with the reason, so it is rewritten for the start room (BRIEF.md §3). Every world is converted (stage 4
// of docs/start-room/PLAN.md); this stays as a guard, for a world written from an old brief or an old copy (Diego, 15 November 2026: H).
const OLD_LINES = ["notYet", "through"];

// The verbs that use each thing (js/actions.js). Examining and taking are the standard ones.
export const LISTEN = ["listen", "use", "talk", "ask"];                                           // the hints thing
export const READ = ["read", "examine", "open"];                                                  // the intro

// The start room's exit the way out is: the way thing's own `door` / `leads`, one direction (IN or OUT is the exit that answers it
// there, js/exits.js wayAt). Null if it isn't one.
export function direction(g, d) {
  const way = g.world.objects[d?.way], ways = waysOf(way);
  if (!way || ways.length !== 1 || !DIRECTIONS.includes(ways[0])) return null;
  return ways[0] === "in" || ways[0] === "out" ? wayAt(g.world.rooms, d.room, ways[0]) ?? ways[0] : ways[0];
}

// The room the way out leads to: its exit's own `to`, or, for an exit that is `false` until a rule `connect`s it, the room that rule
// (or a change) connects it to. Null if neither names one (the checker's play then finds where it goes).
export function beyond(g, d, dir) {
  const to = exitTo(g.world.rooms[d.room]?.exits?.[dir]);
  if (typeof to === "string") return to;
  let found = null;
  const walk = (node) => {
    if (found || !node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.connect === d.room && node.dir === dir && typeof node.to === "string") { found = node.to; return; }
    Object.values(node).forEach(walk);
  };
  walk((g.rules || []).map(r => r.do));
  walk(Object.values(g.changes || {}));
  return found;
}

// What is wrong with an opening declaration, if anything (the engine refuses a world with these problems; the checker repeats them
// for a state built by other means, then holds the start room to the rest of its guarantees: js/checklint.js). BRIEF.md §3.
export function problems(g, d) {
  if (!d || typeof d !== "object") return ["the opening isn't declared"];
  const why = [], obj = (id) => g.world.objects[id];
  const old = OLD_LINES.filter(l => d.lines && l in d.lines);
  if (old.length || g.entrance != null)
    why.push(`the old opening (${[...old.map(l => "lines." + l), ...(g.entrance != null ? ["game.entrance"] : [])].join(", ")}) is gone: a world starts in a start room, ` +
      "an ordinary room of its first area left by its way out, closed at the start and opened by an action the world writes (BRIEF.md §3)");
  for (const k of PARTS) if (typeof d[k] !== "string" || !d[k]) why.push(`opening.${k} must be the id of its ${k === "room" ? "room" : "thing"}`);
  if (why.length) return why;
  const room = g.world.rooms[d.room];
  if (!room) why.push(`opening.room "${d.room}" isn't a room`);
  for (const k of THINGS) if (!obj(d[k])) why.push(`opening.${k} "${d[k]}" isn't an object`);
  if (new Set(PARTS.map(k => d[k])).size < PARTS.length) why.push("the opening's room, hints, intro and way must all be different");
  if (why.length) return why;
  if (typeof room.area !== "string" || !Array.isArray(room.at)) why.push(`the start room "${d.room}" needs an \`area\` and an \`at\`: it is an ordinary room of the first area, on the map`);
  if (obj(d.hints).at !== d.room) why.push(`the hints thing "${d.hints}" must be in the start room`);
  if (!obj(d.hints).portable) why.push(`the hints thing "${d.hints}" must be portable`);
  if (obj(d.intro).at !== "player") why.push(`the intro "${d.intro}" must be carried from the start (at: "player")`);
  if (typeof obj(d.intro).examine !== "string" || !obj(d.intro).examine.trim()) why.push(`the intro "${d.intro}" needs an examine text: what it says`);
  if (obj(d.way).at !== d.room) why.push(`the way out "${d.way}" must be in the start room`);
  if (obj(d.way).portable) why.push(`the way out "${d.way}" can't be portable`);
  for (const k of THINGS) if (!obj(d[k]).words?.nouns?.length) why.push(`"${d[k]}" needs words.nouns, so it can be named`);
  for (const l of LINES) if (typeof d.lines?.[l] !== "string" || !d.lines[l].trim()) why.push(`opening.lines.${l} is missing`);
  const dir = direction(g, d);
  if (!dir) why.push(`the way out "${d.way}" needs a \`door\` or \`leads\` naming one direction: the start room's exit it is`);
  else if (!(dir in (room.exits || {}))) why.push(`the start room has no exit ${dir} for its way out "${d.way}" (write it closed: locked by the way's lock, \`{ to, if, closed }\`, or \`false\` until a rule \`connect\`s it)`);
  else {
    // The way out may go any way (north, up, down, in, out…) and to any level; the room it leads to is in the start room's own area.
    const to = beyond(g, d, dir), there = g.world.rooms[to];
    if (there && there.area !== room.area)
      why.push(`the way out "${d.way}" (${dir}) leads to "${to}", in the area "${there.area}": the room it leads to must be in the start room's own area "${room.area}" (any direction, any level)`);
  }
  return why;
}

// The opening's rules (tried before every other, so no world rule can answer for them). `fixed` and the rest are the engine's to add.
export function rules(g, d) {
  const { hints: H, intro: I, lines: L } = d;
  const held = (id) => ({ [id + ".at"]: "player" });
  return [
    // The hints thing: listening gives the next hint, in the world's frame.
    { id: "opening_hints", match: { verb: LISTEN, obj: H }, do: [{ hint: L.hintFrame }] },
    // The intro: it says its text, then its farewell, and is gone.
    { id: "opening_intro", match: { verb: READ, obj: I }, if: [held(I)],
      do: [{ say: `$${I}.examine`, img: `$${I}.img` }, { say: L.farewell }, { move: I, to: null }] },
    // Neither the hints thing nor the intro can be dropped, or put away in something else (the hints are always to hand). A refusal,
    // so `generic`: the suggestion lines never offer it ("Put box in boat"), as they never offer a verb's stock reply (js/engine.js `answers`).
    { id: "opening_drop", match: { verb: "drop", obj: [H, I] }, if: [{ "$obj.at": "player" }], do: [{ say: "@cantDrop" }], generic: true },
    { id: "opening_put", match: { verb: "put", obj: [H, I] }, if: [{ "$obj.at": "player" }], do: [{ say: "@cantDrop" }], generic: true }
  ];
}
