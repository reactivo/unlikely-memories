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

// Is it shut away, inside a container that is closed? (Something in a thing that isn't a container, mints in a tin, is not;
// nor in one that is `open: "always"`, a boat or a bin with no lid.)
export const shut = (g, id) => chainOf(g, id).slice(1).some(x => g.world.objects[x].container && !g.world.objects[x].open);

// Has it been noticed? Anything not marked `unnoticed`; one that is (the umbrella behind the counter), once something has brought
// it up (an idea of its id: an `opens`, a `know`), you have held it, or seen it. Until then it is in no line that says what is there.
export const noticed = (g, id) => !g.world.objects[id]?.unnoticed || ["held", "ideas", "things"].some(k => g.seen?.[k]?.includes(id));

// Do you carry it (in your hands or in something you carry)?
export const carried = (g, id) => placeOf(g, id) === "player";

// Is `inner` the thing `outer` itself, or inside it (or in something inside it)?
export const within = (g, inner, outer) => chainOf(g, inner).includes(outer);

// Is this an action rule (your commands), not a timed or scheduled one? `when: "action"` is the default.
export const isAction = (r) => (r.when || "action") === "action";

// Is this thing a person: one you can talk to, a character? It has `topics` or `talk`. The one test for it: the parser's
// "her", "him" and what you say to someone, the standard TALK, GIVE and TAKE, and who would take what you give all use it
// (rules read it as `<id>.person`).
export const person = (o) => !!o && (o.topics != null || o.talk != null);

// The person who has this thing, if one does: the nearest thing it is in, or in what it is in, that is a person (a stamp in
// Mrs Pell's hand). Null when nobody has it. (Rules read it as `<id>.holder`.)
export function holderOf(g, id) {
  return chainOf(g, id).slice(1).find(x => person(g.world.objects[x])) ?? null;
}

// Someone who'd take what you give: a person, or anything a world rule for `give` names.
export function receives(g, id) {
  const o = g.world.objects[id];
  if (!o) return false;
  return person(o) || g.rules.some(r =>
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
