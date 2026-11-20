// Space: the directions (ARCHITECTURE.md §3, "Space: the plan"). Where each room is, is the world's plan (js/plan.js): one grid for each floor,
// and an exit leads to the room on the next square that way. Pure.

// The square one step away in each direction: x grows to the east, y to the south, z upwards (the floor above).
export const STEP = { n: [0, -1, 0], s: [0, 1, 0], e: [1, 0, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1] };

// The six directions of the plan, in the order the compass and the exits are written (x, y, z).
export const COMPASS = Object.keys(STEP);

// The four a map draws a line in: up and down are marked in the room's corner.
export const MAP_COMPASS = ["n", "s", "e", "w"];

// The way back: the direction that undoes each one.
export const BACK = { n: "s", s: "n", e: "w", w: "e", u: "d", d: "u" };

// Every direction a player can type: those six, and `in` / `out`, which are names for one of the six in a room that has such a way
// (an exit marked `in: true` / `out: true`: js/exits.js), never a direction of their own on the plan.
export const DIRECTIONS = [...COMPASS, "in", "out"];

// A picture faces one of the four compass ways, north when it says nothing (`facing` on a room's picture: BRIEF.md §7, "Pictures face north").
export const FACINGS = ["n", "e", "s", "w"];

// Where a direction lies in a picture that faces `facing`: "ahead", "right", "left" or "behind" (north is ahead in a picture facing north, east
// on its right, west on its left, south behind you); null for up and down, and for anything that is not a direction of the compass.
// A facing that is none of the four is north. Pure.
export function sideOf(facing, dir) {
  const at = FACINGS.indexOf(dir);
  if (at < 0) return null;
  const from = FACINGS.includes(facing) ? FACINGS.indexOf(facing) : 0;
  return ["ahead", "right", "behind", "left"][(at - from + 4) % 4];
}
