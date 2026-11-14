// USE: not an action of its own. "use X with Y" becomes the action the player meant, and that action is run as if it had
// been typed (js/engine.js, the `useAs` effect; ARCHITECTURE.md §3 "Using things", PARSER.md §4b). This module is the one place
// that knows which pairs mean which action. Pure: reads the state, never changes it. (Where things are: js/place.js.)

import { carried, within, person } from "./place.js?v=0.50.3";
import { isAction } from "./actions.js?v=0.50.3";

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
// - one is someone who'd take it, and the other is carried: give it to them;
// - else the first of put, give and unlock that a rule of the world is written for this pair.
// (Lighting is not here: the engine has no lighting to translate to.)
export function translate(g, action) {
  const o = g.world.objects, A = action.obj, B = action.obj2;
  if (!o[A] || !o[B] || A === B) return null;
  for (const [x, y] of [[A, B], [B, A]]) {
    if (o[y].lock?.key === x) return { verb: "unlock", obj: y, prep: "with", obj2: x };
    if (o[y].container && carried(g, x) && !within(g, y, x)) return { verb: "put", obj: x, prep: "in", obj2: y };
    if (receives(g, y) && carried(g, x)) return { verb: "give", obj: x, prep: "to", obj2: y };
  }
  // Nothing known for the pair: the first of put, give and unlock (in that order, either way round) that a rule of the world is
  // written for ("use clapper on bell" for the world's "put clapper in bell"). Never two.
  for (const make of [(x, y) => ({ verb: "put", obj: x, prep: "in", obj2: y }), (x, y) => ({ verb: "give", obj: x, prep: "to", obj2: y }),
                      (x, y) => ({ verb: "unlock", obj: y, prep: "with", obj2: x })])
    for (const [x, y] of [[A, B], [B, A]]) {
      const next = make(x, y);
      if (g.rules.some(r => isAction(r) && ruled(r.match, next))) return next;
    }
  return null;
}

// Does a rule's `match` name this very pair (it names both things: a rule for any second thing is not this pair's) and fit the action?
const ruled = (match = {}, a) => match.obj != null && match.obj2 != null && Object.entries(match).every(([k, v]) => Array.isArray(v) ? v.includes(a[k] ?? null) : a[k] === v);
