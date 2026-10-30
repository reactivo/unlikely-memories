// Movement: leaving a room while something has hold of your feet (a condition's `movement`: js/conditions.js), now and
// then you take another way than the one you meant. A small piece of its own, so anything that turns you round uses it
// the same way. It only ever picks among the ways the engine says are safe (js/engine.js, strayWays): open now, leading
// to a room you have already been to, and answered by no rule of the world, so a wrong turn never goes through a shut or
// locked way, never into a place you couldn't have seen, and never sets anything off. The map stays truthful: a wrong turn
// is an ordinary move along a real exit. Pure.

import { random } from "./random.js";
import { modifiers } from "./conditions.js";

// The movement now: the first active condition's ({ chance, says }), or null.
export const movementNow = (state) => modifiers(state, "movement")[0] ?? null;

// Which way you go instead, or null (you go the way you meant): with the movement's chance, one of the safe other ways.
// Returns [the way, or null; the generator's next position]. Nothing is rolled when there is no other way.
export function stray(movement, ways, rng) {
  if (!movement || !ways.length) return [null, rng];
  const [r, next] = random(rng);
  if (r >= movement.chance) return [null, next];
  const [k, after] = random(next);
  return [ways[Math.floor(k * ways.length)], after];
}
