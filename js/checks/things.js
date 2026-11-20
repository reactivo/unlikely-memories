// Things: ids, sprites and portraits, a `use`, what is eaten and drunk, what comes from somewhere, and things that move.
// Pure: reads the state, never changes it.

import { person } from "../place.js?v=0.71.0";
import { isLine } from "../shapes.js?v=0.71.0";
import { conditionProblems } from "../fields.js?v=0.71.0";
import { heldThings, hasSprite, hasPortrait, noSprite, portraitFault } from "../sprites.js?v=0.71.0";
import { moverIds, roomsOf, followsAnywhere, FOLLOWS, declarationProblems as moverProblems } from "../movers.js?v=0.71.0";
import { plannedWorld } from "./shared.js?v=0.71.0";

// Ids are unique across rooms, objects and puzzles.
export function idProblems(state, out) {
  // Ids are unique across rooms, objects and puzzles (the engine refuses to add a second; this repeats it for a state built
  // by other means): a rule reads `$here.waitFor` or `last_lamp.visited` by id, and would read the wrong one.
  const kinds = { room: state.world.rooms, object: state.world.objects, puzzle: state.puzzles || {} };
  for (const id of new Set(Object.values(kinds).flatMap(x => Object.keys(x)))) {
    const names = Object.entries(kinds).filter(([, x]) => id in x).map(([k]) => k);
    if (names.length > 1) out.add("ids.shared", `${id}: the id is used by ${names.map(k => (k === "object" ? "an " : "a ") + k).join(" and ")}; ids are unique across rooms, objects and puzzles`);
  }
}

// Everything that can be held has a sprite (a warning: without one the game draws its material's plain sprite, js/fields.js spriteRows).
export function spriteProblems(state, out) {
  // Every thing that can end up in the player's hands has a sprite (BRIEF.md §7, "Sprites"; INTERFACE.md §6c): portable, carried from the
  // start, moved or put there by a rule or a named change, added there, or inside one of those (js/fields.js, heldThings).
  for (const h of heldThings(state.world.objects, [
    ...state.rules.map(r => ({ where: r.id ?? "a rule", match: r.match, effects: r.do })),
    ...Object.entries(state.changes || {}).map(([name, effects]) => ({ where: "change " + name, effects }))]))
    if (!hasSprite(state.world.objects[h.id] ?? spriteOf(state, h.id))) {
      const text = h.where === `objects/${h.id}` ? noSprite(h) : `${h.where}: ${noSprite(h)}`;
      if (!(state.warnings || []).some(w => w.includes(text))) out.add("sprite.held-missing", text);   // (a world's load already told it, as a warning: told once)
    }
}

// A character's face: a malformed `portrait` is a problem (16 rows of 16, hex and "."); a character with none is a warning, only for a world
// written under BRIEF.md §7's "Animation" (gated as the other newer warnings are; the older worlds would each be warned of every character).
export function portraitChecks(state, out) {
  const planned = plannedWorld(state);
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.portrait !== undefined) { const why = portraitFault(o.portrait); if (why) out.add("portrait.malformed", `${id}: ${why}`); }
    else if (planned && person(o)) out.add("portrait.missing", `${id}: a character with no \`portrait\` (BRIEF.md §7, "Portraits"): give them a face, shown when they are examined`);
  }
}

// A thing's `use` is an action the game knows.
export function useProblems(state, pack, out) {
  // A thing's `use` says what USE alone means for it: an action the game knows (or a verb this world adds), never USE itself.
  const verbs = new Set([...Object.keys(pack.words.verbs), ...Object.keys(state.vocab || {})]);
  for (const [id, o] of Object.entries(state.world.objects))
    if (o.use !== undefined && (typeof o.use !== "string" || o.use === "use" || !verbs.has(o.use)))
      out.add("use.not-action", `${id}: use must be the verb USE alone stands for (an action or a word this world adds, not "use"), not ${JSON.stringify(o.use)}`);
}

// Food and drink is a consumable thing.
export function consumableProblems(state, out) {
  // Food and drink is a consumable thing (BRIEF.md §5): the engine says its line, heals by its `heals`, starts or stops its
  // condition and uses it up (js/verbs.js, std_eat_it). What a world can still get wrong: a condition it names that doesn't exist (a
  // problem), a consumable that does nothing at all, and one with no `eat` or `drink` line (it can be eaten or drunk, but EAT / DRINK
  // is never offered: the offer comes from the line, js/view.js).
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.consumable !== true) continue;
    for (const k of ["starts", "stops"]) if (o[k] != null && !state.conditions?.[o[k]]) out.add("consumable.unknown-condition", `${id}: ${k} "${o[k]}", but the world has no such condition`);
    if (!(o.heals > 0) && o.starts == null && o.stops == null)
      out.add("consumable.does-nothing", `${id}: consumable, but eating or drinking it does nothing; whatever is eaten or drunk does some good: heals: 1 (more only for something restorative)`);
    if (o.eat == null && o.drink == null)
      out.add("consumable.no-line", `${id}: consumable, but with no eat or drink line, so Eat / Drink is never offered (the offer comes from the line): write its "eat" or "drink" line`);
  }
}

// A thing that comes from someone or something: its source exists, and it starts nowhere.
export function sourceProblems(state, out) {
  // A thing that comes from someone or something (decision 40): its source exists, and it starts nowhere (it comes when asked for).
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.from == null) continue;
    if (!state.world.objects[o.from]) out.add("source.unknown", `${id}: from "${o.from}", but there is no such thing or person`);
    else if (o.at != null) out.add("source.starts-somewhere", `${id}: comes from ${o.from}, but starts at ${o.at}: a thing that comes when asked for starts nowhere (at: null)`);
  }
}

// A thing a rule or a change adds in play (not in the world yet), as it adds it: { add: "object", id, sprite?, … }.
function spriteOf(state, id) {
  let found = null;
  (function find(node) {
    if (found || !node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(find);
    if (node.add === "object" && node.id === id) { found = node; return; }
    Object.values(node).forEach(find);
  })([state.rules, state.changes]);
  return found;
}

// ---- Things that move ---------------------------------------------------------------------------------------------------
// A person or a thing that moves (`places`, `rounds` or both, js/movers.js): the right shape, naming rooms the world has, its
// conditions well formed; a `here` line (said when you find it) and a sprite (drawn in the pictures; none for one with a figure and a portrait), and not one you can
// take; and in the picture of every room it can be in (its places' rooms, a follower's `within`, its round's rooms), an overlay for it
// (its `overlayAlt` is checked with every overlay's, pictureProblems). A follower with no `within` can be in any room you can: a room
// whose picture has no overlay for it is a warning, since it is there, and named, but not drawn.
export function moverChecks(state, out) {
  const rooms = state.world.rooms;
  const overlay = (r, id) => (rooms[r]?.picture?.overlays || []).some(x => x?.object === id);
  const add = (r, id) => `add { "object": "${id}", "at": [x, y] } to its overlays, and overlayAlt.${id} to the room`;
  for (const id of moverIds(state)) {
    const o = state.world.objects[id];
    for (const why of moverProblems(o, rooms)) out.add("mover.declaration", `${id}: ${why}`);
    (Array.isArray(o.places) ? o.places : []).forEach((p, i) => { for (const why of conditionProblems(p?.if)) out.add("cond.malformed", `${id}: places ${i + 1}: if: ${why}`); });
    if (!isLine(o.here)) out.add("mover.no-here", `${id}: moves, but has no here line: the line said when you find it ("The cat sits on the piano, as if it had always been there.")`);
    // (one with a figure, drawn in the rooms, and a portrait, shown when examined, shows its sprite nowhere: it needs none)
    if (!hasSprite(o) && !(typeof o.figure === "string" && hasPortrait(o))) out.add("mover.no-sprite", `${id}: moves, but has no sprite: it is drawn in the picture of each room it can be in (a moving character with a figure and a portrait needs none)`);
    if (o.portable === true) out.add("mover.portable", `${id}: moves, so it can't be one you take (portable: true): the game moves it, and would take it out of your hands`);
    for (const r of roomsOf(o)) {
      if (r === FOLLOWS || !rooms[r]) continue;
      if (rooms[r].picture && !overlay(r, id)) out.add("mover.no-overlay", `${id}: can be in ${r}, but its picture has no overlay for ${id}: ${add(r, id)}`);
    }
    if (followsAnywhere(o)) for (const r of Object.keys(rooms))
      if (rooms[r].picture && !overlay(r, id))
        out.add("mover.follower-no-overlay", `${id}: follows you, but ${r}'s picture has no overlay for it: there it is with you, and named, but not drawn (${add(r, id)})`);
  }
}
