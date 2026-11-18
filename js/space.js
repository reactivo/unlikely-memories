// Space: the directions (ARCHITECTURE.md §3, "The plan"). Where each room is, is the world's plan (js/plan.js): one grid for each floor,
// and an exit leads to the room on the next square that way. Pure.

// The square one step away in each direction: x grows to the east, y to the south, z upwards (the floor above).
export const STEP = { n: [0, -1, 0], s: [0, 1, 0], e: [1, 0, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1] };

// Every direction a player can type: those six, and `in` / `out`, which are names for one of the six in a room that has such a way
// (an exit marked `in: true` / `out: true`: js/exits.js), never a direction of their own on the plan.
export const DIRECTIONS = [...Object.keys(STEP), "in", "out"];
