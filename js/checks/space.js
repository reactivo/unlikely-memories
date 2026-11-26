// Space and exits: the plan adds up, every exit is well formed and leads where it says, a way in or out is a thing in the room, doors that
// are a pair. The walks the playthrough needs (`route`, `lockOn`, `opensByWaiting`, `atHour`, `ruleMoves`) are the walkthrough's (js/walkthrough.js; this file reads
// `opensByWaiting`). Pure: reads the state and the pack, never changes either.

import { parse } from "../parser.js?v=0.74.1";
import { step, exitNow } from "../engine.js?v=0.74.1";
import { isExitObject, exitTo, exitConditions, wayOf, waysOf, wayAt, thingsFor, inOutExits } from "../exits.js?v=0.74.1";
import { roomBeside } from "../plan.js?v=0.74.1";
import { COMPASS } from "../space.js?v=0.74.1";
import { opensByWaiting } from "../walkthrough.js?v=0.74.1";
import { conditionProblems, suggest } from "../fields.js?v=0.74.1";
import { inRoom, effectsOf } from "./shared.js?v=0.74.1";

// The plan adds up (js/plan.js builds the exits from it, so this repeats what the engine already holds a world to, for a state built by
// other means): a world has a plan, every room has a square, and each way north, south, east, west, up or down leads to the room on the
// next square that way. One problem for each exit that doesn't. A state with no worldId (a test's own rooms) has no plan to ask for.
export function planChecks(state, out) {
  const rooms = state.world.rooms, plan = state.world.plan;
  if (!plan) { if (state.worldId) out.add("plan.none", "plan: the world has no plan: BRIEF.md §2 (every room is on one square of a grid for its floor; exits are made from it)"); return; }
  for (const [id, room] of Object.entries(rooms)) {
    if (!plan[id]) { out.add("plan.room-without-square", `${id}: is on no square of the plan`); continue; }
    for (const dir of COMPASS) {
      const to = exitTo(room.exits?.[dir]);
      if (typeof to === "string" && roomBeside(plan, id, dir) !== to)
        out.add("plan.exit-mismatch", `${id}: exit ${dir} leads to ${to}, but the room on the next square that way is ${roomBeside(plan, id, dir) ?? "none"}: move ${to} on the plan, or take the exit out`);
    }
  }
}

// An exit with a condition is well formed. Returns the exits that are not ("room.dir"): the playthrough leaves them out.
export function exitShapeProblems(state, out) {
  // An exit with a condition: `{ to, if?, closed? }`: it leads to a room (or `true`: a rule answers), its `if` is
  // written like a rule's, and its `closed` is a line (or a list of lines to vary).
  // (First, since playing through them below would stumble on a bad one: those are left out of it.)
  const badExits = new Set();
  for (const [id, room] of Object.entries(state.world.rooms)) for (const [dir, raw] of Object.entries(room.exits || {})) {
    if (!isExitObject(raw)) continue;
    const at = `${id}: exit ${dir}`, before = out.problems.length;
    if (raw.to !== true && !(typeof raw.to === "string" && state.world.rooms[raw.to])) out.add("exit.target-unknown", `${at} leads to ${JSON.stringify(raw.to)}, which isn't a room (or true)`);
    if (raw.if !== undefined && typeof raw.if !== "boolean") for (const why of conditionProblems(exitConditions(raw))) out.add("exit.condition", `${at}: if: ${why}`);
    else if (raw.if !== undefined && raw.if !== true && raw.if !== false) out.add("exit.condition", `${at}: if must be a condition, a list of them, true or false`);
    const lines = [].concat(raw.closed ?? []);
    if (raw.closed !== undefined && !(lines.length && lines.every(x => typeof x === "string" && x.trim()))) out.add("exit.closed-text", `${at}: closed is the line said when the way is shut: text, or a list of texts`);
    if (out.problems.length > before) badExits.add(id + "." + dir);
  }
  return badExits;
}

// Every exit leads where it says; rooms by name; things that lead somewhere.
export function exitsLeadProblems(state, pack, badExits, out) {
  // Every exit leads where it says: from each room, "go" each way that names a room arrives there (a rule that
  // swallows directions, like "go" with no object, would trap the player).
  for (const [id, room] of Object.entries(state.world.rooms)) {
    for (const [dir, raw] of Object.entries(room.exits || {})) {
      const to = exitTo(raw);
      if (typeof to !== "string" || badExits.has(id + "." + dir)) continue;
      let there = inRoom(state, id);
      if (!exitNow(there, id, dir).go) {                               // shut now (its `if`, or a locked thing that leads there): try it open (waiting for its hour)
        there = opensByWaiting(there, id, dir);
        if (!there) continue;                                           // held by something else: the playthrough, and neverOpen, say
      }
      const r = step(there, { verb: "go", dir, at: 0 });
      if (r.next.player.at !== to) out.add("exit.not-reached", `going ${dir} from ${id} doesn't reach ${to} (${(r.applied.find(e => e.say) || {}).say || "nothing happens"})`.slice(0, 160));
    }
  }
  // Rooms by name: "go <the room's name>" from next door gets there (the name is what the player reads on screen;
  // through a door's own rule counts).
  // And a thing that leads somewhere (`leads: "u"`: stairs, a ladder; `door: "e"`: a door, a gate, a hatch): climbing it goes that way, to a room.
  const go = pack.words.verbs.go[0], climb = pack.words.verbs.climb[0];
  const travels = (s, command) => { const r = parse(command, s, pack); return r.actions?.length === 1 && r.actions[0].verb === "go" ? r.actions[0].dir : null; };
  const reaches = (s, command, to) => {
    const r = parse(command, s, pack);
    let g = s;
    for (const a of r.actions || []) g = step(g, { ...a, at: 0 }).next;
    return g.player.at === to;
  };
  for (const [id, room] of Object.entries(state.world.rooms)) {
    const there = inRoom(state, id);
    for (const [dir, raw] of Object.entries(room.exits || {})) {
      const to = exitTo(raw);
      const name = typeof to === "string" && state.world.rooms[to]?.name;
      if (name && !isExitObject(raw) && exitNow(there, id, dir).go && !reaches(there, go + " " + name.toLowerCase(), to)) out.add("exit.name-not-reached", `${id}: "${go} ${name.toLowerCase()}" doesn't go ${dir} to ${to}`);
    }
    // (stairs both up and down, `leads: ["u", "d"]`: each way needs its exit, and climbing them with no way typed goes up)
    const leading = [...(room.scenery || []).map(x => ({ word: x.words?.[0], thing: x })),
      ...Object.entries(state.world.objects).filter(([, o]) => o.at === id && wayOf(o)).map(([, o]) => ({ word: o.words?.nouns?.[0], thing: o }))];
    for (const { word, thing } of leading.filter(x => wayOf(x.thing) && x.word)) {
      // (IN and OUT are names for a real direction: the exit marked `in: true` / `out: true`, js/exits.js wayAt)
      const real = (dir) => (dir === "in" || dir === "out" ? wayAt(state.world.rooms, id, dir) ?? dir : dir);
      const missing = waysOf(thing).filter(dir => !(real(dir) in (room.exits || {})));
      for (const dir of missing) out.add("exit.thing-way-missing", `${id}: "${word}" leads ${dir}, but there's no way ${dir} from here`);
      if (!missing.length && travels(there, climb + " " + word) !== wayOf(thing)) out.add("exit.thing-climb", `${id}: "${climb} ${word}" doesn't go ${wayOf(thing)}`);
    }
  }
}

// Every way in or out of somewhere is a thing in the room (BRIEF.md §8, "Exits"): an `in` or `out` exit, or an exit marked `in: true` /
// `out: true`, needs an object in that room that is that way (its `door` or `leads` that direction, or "in" / "out" there: thingsFor in
// js/exits.js), marked in the text where it comes into view, so it is seen, clicked and gone through. Scenery is not one: it offers
// nothing. A problem. A way a `connect` makes in play (a train come in) the same: an object that is that way, in that room or moved
// there by some effect.
export function inOutProblems(state, out) {
  const { rooms, objects } = state.world, how = (dir, way) => (dir === way ? `an \`${way}\` exit` : `exit ${dir}, marked \`${way}: true\``);
  const fix = (dir) => `give the door, gate, hatch, building or tent the text names \`door: "${dir}"\` or \`leads: "${dir}"\` (BRIEF.md §8, "Exits")`;
  for (const [id, room] of Object.entries(rooms)) for (const [dir, way] of inOutExits(room?.exits))
    if (!thingsFor(state.world, id, dir).length) out.add("exit.inout-no-thing", `${id}: ${how(dir, way)} is a way ${way}, but no thing in the room is that way: ${fix(dir)}`);
  const movedTo = (room) => new Set(effectsOf(state).filter(({ effect: e }) => typeof e.move === "string" && e.to === room).map(({ effect: e }) => e.move));
  for (const { effect: e, where } of effectsOf(state)) {
    if (typeof e.connect !== "string" || typeof e.dir !== "string") continue;
    for (const [dir, way] of inOutExits({ [e.dir]: e.dir === "in" || e.dir === "out" ? e.to : e })) {
      const can = movedTo(e.connect), ways = (o) => waysOf(o).some(w => w === dir || w === way);
      if (!Object.entries(objects).some(([oid, o]) => (o.at === e.connect || can.has(oid)) && ways(o)))
        out.add("exit.inout-no-thing", `${where}: connect ${e.connect} ${how(dir, way)} is a way ${way}, but no thing there is that way: ${fix(dir)}`);
    }
  }
}

// A door locked from either side (`pair`).
export function pairProblems(state, out) {
  // A door locked from either side (`pair`): each door names the other, written on both, and each is a door. Their locks and states then go together.
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.pair === undefined) continue;
    const other = state.world.objects[o.pair];
    if (o.pair === id) out.add("door.pair", `${id}: pair names the door itself: it links two doors`);
    else if (!other) out.add("door.pair", `${id}: pair "${o.pair}" isn't a thing${suggest(o.pair, Object.keys(state.world.objects))}`);
    else if (!other.door) out.add("door.pair", `${id}: pair "${o.pair}" isn't a door (it has no \`door\`): a pair is two doors`);
    else if (other.pair !== id) out.add("door.pair", `${id}: pair "${o.pair}", but ${o.pair} ${other.pair ? `pairs with ${other.pair}` : "has no pair"}, not ${id}: write \`pair\` on both doors`);
  }
}
