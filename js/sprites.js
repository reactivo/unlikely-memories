// Sprites: the rows the game draws for a thing (ARCHITECTURE.md §3, "Fields and properties"; BRIEF.md §7, "Sprites"): which things can
// end up in the player's hands (heldThings), whether a thing has a sprite or a portrait, the plain sprite of its material for one that
// has none (fallbackRows), and the rows to draw for a thing in a state (spriteRows). Pure. Used by the engine (js/engine.js), the
// checks (js/checks/things.js), the field check (js/fields.js) and the screen's drawing (ui/sprite.js, ui/draw.js), which import
// this and not the field list.

import { isObject } from "./shapes.js?v=0.74.1";
import art from "../content/art.js?v=0.74.1";

// The ids a value names in a rule's effects: a thing's id, or `$obj` / `$obj2` for what the rule's `match` names; nothing for another `$`.
const idsOf = (match) => (v) => v === "$obj" ? [match?.obj].flat() : v === "$obj2" ? [match?.obj2].flat() : typeof v === "string" && !v.startsWith("$") ? [v] : [];

// Every thing that can end up in the player's hands has a `sprite` (BRIEF.md §7, "Sprites"): the inventory shows it, and so does the slot
// before the echo of a thing gained or lost (INTERFACE.md §6c). A thing can end up there when it is `portable: true`, starts
// `at: "player"`, is moved there (`{ move, to: "player" }`, in a world's effects, a rule, a named change, a `confirm`'s
// answers…; `$obj` / `$obj2` as the rule's `match` names them), is made portable or put there with a `set` (`thing.portable`,
// `thing.at`), or lies inside such a thing (carried with it: declared there, or moved or put there). A value that can't be known (`$obj` of a rule that matches any
// thing, a `$` elsewhere) is passed over.
//   things: { id: the thing as declared (an object, or an `add object` effect) }; groups: [{ where, match?, effects }]
//   → [{ id, where, why }]: each thing, once, with the first reason found, in the order of `things` (then of the groups).
export function heldThings(things, groups) {
  const all = { ...things }, found = new Map();
  groups = [...groups];
  // Each effect of a group, at any depth, except inside a rule it adds: that rule is a group of its own (its own match).
  const walk = (node, visit) => {
    if (Array.isArray(node)) return node.forEach(x => walk(x, visit));
    if (!isObject(node)) return;
    if (node.add === "rule" && isObject(node.rule)) {
      if (!groups.some(g => g.rule === node.rule)) groups.push({ where: `rules/${node.rule.id}`, match: node.rule.match, effects: node.rule.do, rule: node.rule });
      return;
    }
    visit(node);
    Object.values(node).forEach(x => walk(x, visit));
  };
  for (let i = 0; i < groups.length; i++) walk(groups[i].effects, (e) => { if (e.add === "object" && typeof e.id === "string" && !(e.id in all)) all[e.id] = e; });
  const mark = (id, where, why) => { if (typeof id === "string" && Object.hasOwn(all, id) && !found.has(id)) found.set(id, { id, where, why }); };
  for (const [id, o] of Object.entries(all)) {
    if (!isObject(o)) continue;
    if (o.portable === true) mark(id, `objects/${id}`, "it is portable");
    else if (o.at === "player") mark(id, `objects/${id}`, "it starts in the player's hands");
  }
  for (const { where, match, effects } of groups) {
    const ids = idsOf(match);
    walk(effects, (e) => {
      if ("move" in e && e.to === "player") for (const id of ids(e.move)) mark(id, where, "it is moved to the player");
      if (typeof e.set === "string") {
        const [, id, prop] = /^(\$?[\w-]+)\.(portable|at)$/.exec(e.set) ?? [];
        if (prop === "portable" && e.to === true) for (const x of ids(id)) mark(x, where, "it is made portable");
        if (prop === "at" && e.to === "player") for (const x of ids(id)) mark(x, where, "it is put in the player's hands");
      }
      if (e.add === "object" && e.at === "player" && typeof e.id === "string") mark(e.id, where, "it is added in the player's hands");
    });
  }
  // What lies inside a thing you can hold is carried with it: declared there, or moved or put there (`{ move, to }`,
  // `set thing.at`) by a group, its destination a thing already found; again until nothing new is found (a bag in a bag).
  for (let more = true; more;) {
    const before = found.size;
    for (const [id, o] of Object.entries(all))
      if (!found.has(id) && isObject(o) && found.has(o.at)) mark(id, `objects/${id}`, `it is inside ${o.at}, which can be carried`);
    for (const { where, match, effects } of groups) {
      const ids = idsOf(match);
      const into = (v) => ids(v).find(x => found.has(x));
      walk(effects, (e) => {
        const bag = "move" in e ? into(e.to) : undefined;
        if (bag) for (const id of ids(e.move)) mark(id, where, `it is moved into ${bag}, which can be carried`);
        const [, id, prop] = typeof e.set === "string" ? /^(\$?[\w-]+)\.(at)$/.exec(e.set) ?? [] : [];
        const put = prop === "at" ? into(e.to) : undefined;
        if (put) for (const x of ids(id)) mark(x, where, `it is put in ${put}, which can be carried`);
      });
    }
    more = found.size > before;
  }
  return Object.keys(all).filter(id => found.has(id)).map(id => found.get(id));
}
// Has it a sprite to show (rows to draw)?
export const hasSprite = (o) => Array.isArray(o?.sprite) && o.sprite.length > 0;
// Has it a portrait (a character's face, shown when it is examined)? Rows of the same form as a sprite's, kept apart: a sprite is for what is carried.
export const hasPortrait = (o) => Array.isArray(o?.portrait) && o.portrait.length > 0;
// What is wrong with a portrait: not 16 rows of 16 characters, hex 0-f and "." only. Empty when it is well formed.
export const portraitFault = (rows) => !Array.isArray(rows) || rows.length !== 16 || rows.some(r => typeof r !== "string" || !/^[0-9a-f.]{16}$/.test(r))
  ? "a portrait is 16 rows of 16 characters, hex 0-f and \".\" for clear" : "";
// The sentence for a thing you can hold that has no sprite (a warning of the checker, a finding for the field check).
export const noSprite = (h) => `${h.id} can end up in the player's hands (${h.why}) but has no sprite: every thing you can carry has one (the inventory and the echoes of what you gain and lose show it); the game draws a plain one from its material instead`;

// The plain sprite the game draws for a thing that can be held and has none (content/art.js, sprite.fallback): by its `material` (a word the
// game has one for; any other word, or none, gets the plain ball). Rows of palette numbers in hex, as a sprite's.
export const fallbackRows = (o) => art.sprite.fallback[Object.hasOwn(art.sprite.fallback, o?.material) ? o.material : "none"];
// The rows the game draws for a thing in this state: its own `sprite`; or, if it has none and can end up in the player's hands (heldThings: portable,
// carried, handed over by a rule or a change, or inside such a thing), the fallback of its material; or null (a thing that cannot be held has none).
// The inventory, the picture beside examining it, the slot before the echo of gaining or losing it and its overlay in a room all read this.
const holdable = new WeakMap();                 // a state's rules → the ids of its things that can end up held (found once for a state, and only when asked)
export function spriteRows(state, id) {
  const o = state?.world?.objects?.[id];
  if (!o) return null;
  if (hasSprite(o)) return o.sprite;
  if (o.portable === true || o.at === "player") return fallbackRows(o);                // (what is true of it now: portable, or in the hands)
  const key = state.rules ?? state;
  if (!holdable.has(key)) holdable.set(key, new Set(heldThings(state.world.objects, [
    ...(state.rules || []).map(r => ({ where: r.id ?? "a rule", match: r.match, effects: r.do })),
    ...Object.entries(state.changes || {}).map(([name, effects]) => ({ where: "change " + name, effects }))]).map(h => h.id)));
  return holdable.get(key).has(id) ? fallbackRows(o) : null;
}
