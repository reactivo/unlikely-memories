// Things that move (ARCHITECTURE.md §5, "Things that move"; BRIEF.md §8): a person or a thing that is in different places at
// different moments, a clerk only at night, a cat that wanders, a dog that follows you. A world never moves it with rules: it gives
// the thing one of two facts (or both), and the engine moves it, says when it comes and goes, and draws it (its overlay is in the picture of
// each room it can be in, drawn while it is there: ui/draw.js).
//   places: [{ at: "<room>" | "player", if?: [conditions], within?: [rooms] }, …]
//                                                                  it is at the first place whose `if` holds now (no `if`: always);
//                                                                  when none holds it is away (at: null). "player": wherever you are;
//                                                                  with `within`, only in those rooms (below, "Following you")
//   rounds: { rooms: [...], every: [min, max] | { seconds: [min, max] }, random?: true }
//                                                                  along the rooms, one step every few turns (or seconds of play): in
//                                                                  order, back to the first after the last, or to any but its own
// It may have both: while one of its places holds, that place decides where it is (its round waits); when none holds, it goes its
// round, from the room it is in, its first step a whole gap later; from a room not on its round, its first step at once, to one.
// Following you ("player"): it is wherever you are, and comes with you as you go. With `within`, it comes with you only when you
// go from the room it is in to one of those rooms: you go anywhere else, and it stays behind, in the room it was in, and waits; you
// come back there, and it follows you again from there. One with `within` whose place starts to hold while it is in another room
// waits there for you (one that is away joins you, in a room of `within`).
// This file is the pure part: where each fact says the thing is now, the next step of a round and its gaps (from the thing's own
// generator, seeded from the game's: js/random.js), the way it comes from or goes to, its line, and what is wrong with a declaration.
// The engine (js/engine.js, runMovers) calls it at one place in each moment, after everything else the world does: it moves the thing
// when due unless it is held (a question waiting, a command about it this moment, a conversation with it, its room described this
// moment), tells it when you are there to see it, and keeps each one's own record in state.movers ({ id: { rng?, due?, i?, talk? } },
// made with the first, so a world with nothing that moves has no key).
// A new way of moving is one more fact here: a name in KINDS (and its fields in js/fields.js), and a function that says where it is next.

import { between } from "./random.js";
import { exitTo } from "./exits.js";

export const KINDS = ["places", "rounds"];
// The fields of a place and of a round (js/fields.js lists them for the checks).
export const PLACE_FIELDS = ["at", "if", "within"];
export const ROUNDS_FIELDS = ["rooms", "every", "random"];
// Where a follower is: wherever you are.
export const FOLLOWS = "player";

// Is it a thing that moves (it has one of the facts, or both)?
export const isMover = (o) => !!o && KINDS.some(k => o[k] != null);
// The things that move in a state, in the world's order.
export const moverIds = (state) => Object.keys(state.world?.objects || {}).filter(id => isMover(state.world.objects[id]));
// Every room a mover can be in, as it declares them: its places' rooms (a follower's `within`; "player" stays as written for one
// without: wherever you are) and its round's rooms.
const placesOf = (o) => (Array.isArray(o?.places) ? o.places : []);
export const roomsOf = (o) => [...new Set([
  ...placesOf(o).flatMap(p => (p?.at === FOLLOWS && Array.isArray(p.within) ? p.within : [p?.at])),
  ...(Array.isArray(o?.rounds?.rooms) ? o.rounds.rooms : [])])];
// Does a `places` mover follow you (one of its places is "player")? Anywhere (one of them has no `within`)?
export const follows = (o) => placesOf(o).some(p => p?.at === FOLLOWS);
export const followsAnywhere = (o) => placesOf(o).some(p => p?.at === FOLLOWS && !Array.isArray(p.within));
// Does where a `places` mover is depend on the clock (an `if` that reads time.*)? Then the engine wakes when it would change (nextDue).
export const onTheClock = (o) => Array.isArray(o?.places) && JSON.stringify(o.places.map(p => p?.if ?? [])).includes('"time.');

// ---- places ------------------------------------------------------------------------------------------------------------------
// The first of a mover's places whose `if` holds now (`holds(state, conditions)`: the engine's evaluator), or null: none holds.
export function placeHolding(state, o, holds) {
  for (const p of placesOf(o)) if (p && holds(state, Array.isArray(p.if) ? p.if : [])) return p;
  return null;
}
// The room a place puts it in now: its room; for "player", your room, or, with `within`, your room only when it is with you (in the
// room you were in as the moment began, `from`, or in yours, or away) and yours is one of `within`, else the room it is in (it waits
// there). null: away. A place in the opening is never one (it is the opening's own).
export function roomOfPlace(state, o, p, from = state.player.at) {
  const here = state.player.at;
  const room = p.at !== FOLLOWS ? p.at
    : !Array.isArray(p.within) ? here
    : p.within.includes(here) && (o.at == null || o.at === from || o.at === here) ? here
    : o.at ?? null;
  return room != null && state.world.rooms[room] && !state.world.rooms[room].fixed ? room : null;
}
// Where a `places` mover is now: the room of the first place that holds; null when none holds (away).
export function placeNow(state, o, holds, from) {
  const p = placeHolding(state, o, holds);
  return p ? roomOfPlace(state, o, p, from) : null;
}

// ---- rounds ------------------------------------------------------------------------------------------------------------------
// `every`: a pair of numbers is turns; { seconds: [min, max] } is play time.
export const inSeconds = (r) => !Array.isArray(r?.every);
const range = (r) => (Array.isArray(r.every) ? r.every : r.every?.seconds);
// The gap to the next step: a whole number in its range (turns, or seconds). Returns [gap, the generator's next position].
export function gapOf(r, rng) { const [min, max] = range(r); return between(rng, min, max); }
// The next step of a round from where it is (`i`, its place in `rooms`; `from`, the room): [room, its place, the generator's next
// position]. In order: the next in the list, the first after the last. Random: any of its rooms but the one it is in.
export function nextStep(r, i, from, rng) {
  if (r.random === true) {
    const others = [...new Set(r.rooms)].filter(x => x !== from);
    if (!others.length) return [from, i, rng];
    const [k, next] = between(rng, 0, others.length - 1);
    return [others[k], r.rooms.indexOf(others[k]), next];
  }
  const j = (i + 1) % r.rooms.length;
  return [r.rooms[j], j, rng];
}
// A mover's own generator, seeded once from the game's (the state's position when it first moves) and its id, kept in its record:
// the same game always moves it the same way (replays, UNDO, saves), and its rolls never change anything else's.
export function seedFor(rng, id) {
  let h = 2166136261;
  for (const c of String(id)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (rng ^ h) >>> 0;
}

// ---- What is said ------------------------------------------------------------------------------------------------------------
// The way out of room `from` that leads to room `to`, as its exits say (open or shut: a way you can see), or null when none joins them.
export function wayTo(rooms, from, to) {
  for (const [dir, raw] of Object.entries(rooms?.[from]?.exits || {})) if (to != null && exitTo(raw) === to) return dir;
  return null;
}
// What is said when it comes where you are (`arrives`, `dir` the way it came from) or goes from where you are (`leaves`, `dir` the
// way it goes): its own line (a list is varied), else the pack's stock line with the way ("The cat comes in from the north.",
// "The cat goes off east."), or the plain one when no exit joins the two rooms ("The cat comes in.", "The cat is gone.").
// Following you, always the pack's: `follows` as it comes with you ("The cat comes with you."), `stays` as you go where it
// doesn't follow ("The cat stays behind.").
export function lineOf(o, id, kind, dir) {
  if (kind === "follows" || kind === "stays") return { say: `@moving.${kind}`, things: [id] };
  return o[kind] != null ? { say: o[kind] } : { say: `@moving.${kind}.${dir ?? "none"}`, things: [id] };
}

// ---- What is wrong with a declaration ------------------------------------------------------------------------------------------
const gap = (x) => Array.isArray(x) && x.length === 2 && x.every(Number.isInteger) && x[0] >= 1 && x[0] <= x[1];
const isObject = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
const line = (x) => (typeof x === "string" && x.trim() !== "") || (Array.isArray(x) && x.length > 0 && x.every(y => typeof y === "string" && y.trim()));
// What is wrong with a mover's facts, as sentences: their shape, and, given the world's rooms (`rooms`), the rooms they name. The
// engine refuses an object whose facts are the wrong shape (they would not move); the checker repeats these as problems, with the
// rooms. Nothing for a thing that doesn't move.
export function declarationProblems(o, rooms = null) {
  const why = [];
  if (!isMover(o)) return why;
  const room = (r, what) => { if (rooms && !rooms[r]) why.push(`${what} "${r}" isn't a room`); };
  if (o.places != null) {
    if (!Array.isArray(o.places) || !o.places.length) why.push('places is a list of places, [{ "at": "<room>" | "player", "if": [conditions] }, …]');
    else o.places.forEach((p, i) => {
      if (!isObject(p) || typeof p.at !== "string" || !p.at) return why.push(`places ${i + 1}: a place is { "at": "<room>" | "player", "if"?: [conditions] }`);
      if (p.at !== FOLLOWS) room(p.at, `places ${i + 1}: at`);
      if (p.if !== undefined && !Array.isArray(p.if)) why.push(`places ${i + 1}: if is a list of conditions, like a rule's`);
      if (p.within === undefined) return;
      if (p.at !== FOLLOWS) why.push(`places ${i + 1}: within is only for a place "at": "player" (the rooms it follows you into)`);
      else if (!Array.isArray(p.within) || !p.within.length || p.within.some(x => typeof x !== "string" || !x)) why.push(`places ${i + 1}: within is a list of room ids, the rooms it follows you into`);
      else for (const x of new Set(p.within)) room(x, `places ${i + 1}: within`);
    });
  }
  if (o.rounds != null) {
    const r = o.rounds;
    if (!isObject(r)) why.push('rounds is { "rooms": [...], "every": [min, max] }');
    else {
      if (!Array.isArray(r.rooms) || r.rooms.some(x => typeof x !== "string" || !x)) why.push("rounds: rooms is a list of room ids");
      else if (new Set(r.rooms).size < 2) why.push("rounds: rooms names at least two different rooms");
      else for (const x of new Set(r.rooms)) room(x, "rounds: room");
      if (!(gap(r.every) || (isObject(r.every) && Object.keys(r.every).length === 1 && gap(r.every.seconds))))
        why.push('rounds: every is [min, max] in turns, or { "seconds": [min, max] }, whole numbers from 1, min no more than max');
      if (r.random !== undefined && r.random !== true) why.push("rounds: random is true (to any of its rooms) or left out (in order)");
    }
  }
  for (const k of ["arrives", "leaves"]) if (o[k] !== undefined && !line(o[k])) why.push(`${k} is a line, or a list of lines: what is said when it ${k === "arrives" ? "comes where you are" : "goes from where you are"}`);
  return why;
}
// The shape alone (no rooms): what the engine refuses as an object is added.
export const shapeProblems = (o) => declarationProblems(o, null);
