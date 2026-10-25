// Transitions: how one picture changes into another, every one of them, in this one file (ART-DIRECTION.md §6.2): from a
// room to the next, to a new version of a room, and from the room to an ending's picture. The scene (ui/scene.js) asks for one by
// name and knows nothing about how any is drawn; to change, tune or add one, edit the table and the constants.
// Purely visual and interface-only: the state never knows about them.
//
// An entry: { ms, shows(x, y, p, height) }. `ms` is how long it takes; `shows` says, for the pixel at x, y and progress p
// (0 → 1), whether it already shows the new picture. Add an entry, then name it in a constant below (or ask for it by name).

import { lit } from "./draw.js";

// The transition used for a change of room (or of a room's picture version, or an object taken), for an ending, and when none is asked for.
export const ROOM = "dissolve";
export const ENDING = "slow_dissolve";
export const DEFAULT = ROOM;

export const TRANSITIONS = {
  cut: { ms: 0, shows: () => true },                                   // at once
  // Ordered dither, from the old picture to the new: pixels switch in the Bayer order the art itself is dithered with.
  dissolve: { ms: 500, shows: (x, y, p) => lit(x, y, p) },
  slow_dissolve: { ms: 2000, shows: (x, y, p) => lit(x, y, p) },       // the same, slowly: the ending's
  scan: { ms: 500, shows: (x, y, p, height) => y < p * height }       // a line sweeping down, like an old screen redrawing
};

// The transition with this name (the default one when no name is given, or the name isn't known).
export const transition = (name = DEFAULT) => TRANSITIONS[name] ?? TRANSITIONS[DEFAULT];
