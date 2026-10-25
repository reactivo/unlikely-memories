// Space: where rooms are relative to each other (ARCHITECTURE.md §3, "Space"). Every room is in an **area** (the
// Ministry, the beach…) at a **cell** of that area's grid: [x, y, z], z being the floor. Inside an area, north is
// the next cell north; exits that break that, or lead to another area, are **passages** (doors to elsewhere,
// loops, a staircase to another world). Pure: reads the state, never changes it.

import { exitTo } from "./exits.js";

// The cell one step away in each direction: x grows to the east, y to the south, z upwards.
export const STEP = { n: [0, -1, 0], s: [0, 1, 0], e: [1, 0, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1] };

// Every way a room can have an exit: those six, and `in` / `out` (into or out of a place: a cab, a hut, a boat). The
// last two have no cell next door, so an exit that way is always a passage.
export const DIRECTIONS = [...Object.keys(STEP), "in", "out"];

// The cell next to a room in a direction (null if the room has no place, or the direction has no cell: in, out).
export function nextCell(room, dir) {
  if (!room?.at || !STEP[dir]) return null;
  return room.at.map((v, i) => v + STEP[dir][i]);
}

// The room at a cell of an area, if any.
export function roomAt(state, area, cell) {
  for (const [id, r] of Object.entries(state.world.rooms)) {
    if (r.area === area && r.at && r.at.every((v, i) => v === cell[i])) return id;
  }
  return null;
}

// Is this exit a passage (not simply the next cell)? Between areas, always; inside one, when it doesn't lead to
// the cell next door in that direction.
export function isPassage(state, fromId, dir, toId) {
  const from = state.world.rooms[fromId], to = state.world.rooms[toId];
  if (!from || !to || from.area !== to.area) return true;
  const cell = nextCell(from, dir);
  return !cell || !to.at || !cell.every((v, i) => v === to.at[i]);
}

// What's around a room, by direction: where its exit leads (if anywhere), whether that's a passage, and which room
// (built or only planned) sits in the next cell. Used to tell the AI where new rooms can go.
//   { n: { exit: "lifts" | true | false | null, passage: false, next: "lifts" | null, planned: false }, … }
export function around(state, roomId) {
  const room = state.world.rooms[roomId], out = {};
  for (const dir of DIRECTIONS) {
    const exit = exitTo(room.exits?.[dir]) || (room.exits?.[dir] ?? null);   // a conditional exit: where it leads
    const cell = nextCell(room, dir);
    const next = cell ? roomAt(state, room.area, cell) : null;
    out[dir] = {
      exit,
      passage: typeof exit === "string" ? isPassage(state, roomId, dir, exit) : false,
      next,
      planned: !!(next && state.world.rooms[next].placeholder)
    };
  }
  return out;
}
