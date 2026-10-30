// USE: not an action of its own. "use X with Y" becomes the action the player meant, and that action is run as if it had
// been typed (js/engine.js, the `useAs` effect; ARCHITECTURE.md §3 "Using things", PARSER.md §4b). This module is the one place
// that knows which pairs mean which action. Pure: reads the state, never changes it.

// The one walk through what holds what (a mint in a tin in a bag in a room). Things inside things go no deeper than this.
const DEPTH = 5;

// The thing, then what it is in, and what that is in… (only things; the room or "player" at the end is not in the list).
export function chainOf(g, id) {
  const list = [id];
  for (let at = g.world.objects[id]?.at, n = 0; g.world.objects[at] && n++ < DEPTH; at = g.world.objects[at].at) list.push(at);
  return list;
}

// Where a thing really is: its room, or "player", even inside something else (null if out of play).
export function placeOf(g, id) {
  const last = chainOf(g, id).at(-1);
  return g.world.objects[last]?.at ?? null;
}

// Is it shut away, inside a container that is closed? (Something in a thing that isn't a container, mints in a tin, is not.)
export const shut = (g, id) => chainOf(g, id).slice(1).some(x => g.world.objects[x].container && !g.world.objects[x].open);

// Do you carry it (in your hands or in something you carry)?
export const carried = (g, id) => placeOf(g, id) === "player";

// Is `inner` the thing `outer` itself, or inside it (or in something inside it)?
export const within = (g, inner, outer) => chainOf(g, inner).includes(outer);

// Is this an action rule (your commands), not a timed or scheduled one? `when: "action"` is the default.
export const isAction = (r) => (r.when || "action") === "action";

// Someone who'd take what you give: a character (it has `topics` or `talk`), or anything a world rule for `give` names.
export function receives(g, id) {
  const o = g.world.objects[id];
  if (!o) return false;
  return !!o.topics || o.talk != null || g.rules.some(r =>
    isAction(r) && [].concat(r.match?.verb ?? []).includes("give") && [].concat(r.match?.obj2 ?? []).includes(id));
}

// What "use A with B" means, in either order, as the action to run (null when it means nothing known):
// - one is the key of the other's lock: unlock it with the key;
// - one is a container and the other is carried (and isn't it, or what holds it): put it in;
// - one is someone who'd take it, and the other is carried: give it to them.
// (Lighting is not here: the engine has no lighting to translate to.)
export function translate(g, action) {
  const o = g.world.objects, A = action.obj, B = action.obj2;
  if (!o[A] || !o[B] || A === B) return null;
  for (const [x, y] of [[A, B], [B, A]]) {
    if (o[y].lock?.key === x) return { verb: "unlock", obj: y, prep: "with", obj2: x };
    if (o[y].container && carried(g, x) && !within(g, y, x)) return { verb: "put", obj: x, prep: "in", obj2: y };
    if (receives(g, y) && carried(g, x)) return { verb: "give", obj: x, prep: "to", obj2: y };
  }
  return null;
}
