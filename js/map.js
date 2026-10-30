// Map: what the map popup shows (INTERFACE.md §12), the way there, and the walk that follows a click on a room.
// Pure: reads the state and the pack, never changes either, never touches the page (ui/map.js draws it).
//
// What is shown: the rooms you have visited on your own level (same z), spread from the room you are in through
// visited rooms (by an exit from them, or by one of theirs that leads back to them); other areas on that level that a passage reaches are placed beside the room it leaves from, so the
// passage reads as one step. Coordinates are the cells of the area you are in: x grows east, y south.

import { exitTo } from "./exits.js";
import { STEP } from "./space.js";
import { text, describe } from "./narrator.js";
import { step } from "./engine.js";
import { parse } from "./parser.js";
import { story } from "./view.js";

const COMPASS = ["n", "s", "e", "w"];    // the only directions a map can draw: the others have no cell next door
const BACK = { n: "s", s: "n", e: "w", w: "e" };

// The layout of the map for the state: where each shown room sits, and which exits join neighbouring ones.
//   { z, opening, placed: Map(id → { x, y }), edges: [{ from, dir, to }] }
// An edge is one exit that leads to the room drawn in the cell next door in that direction (one way: routeTo walks them).
function layout(state) {
  const rooms = state.world.rooms, here = state.player.at, room = rooms[here];
  const z = room?.at?.[2] ?? 0, openingRoom = state.opening?.room ?? null;
  const placed = new Map();                                  // id → { x, y }
  if (!room?.at || here === openingRoom) {                   // the opening is a map of its own: the room alone
    placed.set(here, { x: room?.at?.[0] ?? 0, y: room?.at?.[1] ?? 0 });
    return { z, opening: here === openingRoom, placed, edges: [] };
  }
  const visited = new Set(state.seen?.visited ?? []);
  const shown = (id) => id === here || (visited.has(id) && id !== openingRoom);   // the opening never shows again
  const taken = new Map();                                   // "x,y" → id: the cells in use
  const key = (x, y) => x + "," + y;

  // The rooms of one area reached from a seed through visited rooms on this level (by any exit of that area).
  // An exit a rule answers (`true`) leads nowhere the map can read, so a room is also reached backwards: by a visited room
  // whose own exit leads here (the way back from Tuesday's town hall reaches it from the High Street).
  const leadsTo = (id, to) => Object.values(rooms[id].exits || {}).some(x => exitTo(x) === to);
  const flood = (seed) => {
    const area = rooms[seed].area, found = [seed];
    const here = (r, id) => r?.at && r.area === area && r.at[2] === z && shown(id) && !found.includes(id);
    for (let i = 0; i < found.length; i++) {
      for (const x of Object.values(rooms[found[i]].exits || {})) {
        const to = exitTo(x);
        if (typeof to === "string" && here(rooms[to], to)) found.push(to);
      }
      for (const id of Object.keys(rooms)) if (here(rooms[id], id) && leadsTo(id, found[i])) found.push(id);
    }
    return found;
  };
  const fits = (ids, dx, dy) => ids.every(id => !taken.has(key(rooms[id].at[0] + dx, rooms[id].at[1] + dy)));
  const put = (ids, dx, dy) => ids.forEach(id => {
    const x = rooms[id].at[0] + dx, y = rooms[id].at[1] + dy;
    placed.set(id, { x, y }); taken.set(key(x, y), id);
  });

  const first = flood(here), queue = [...first], areas = new Set([room.area]);
  put(first, 0, 0);
  // Other areas on this level, reached by a passage in a compass direction from a room already placed: put beside it
  // (its cells moved so the room it leads to is next door). Left off if that would land on a room already drawn; each
  // area is tried once, from the first passage found.
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i], p = placed.get(id);
    for (const dir of COMPASS) {
      const to = exitTo(rooms[id].exits?.[dir]), t = typeof to === "string" ? rooms[to] : null;
      if (!t?.at || t.at[2] !== z || areas.has(t.area) || !shown(to)) continue;
      areas.add(t.area);
      const ids = flood(to), dx = p.x + STEP[dir][0] - t.at[0], dy = p.y + STEP[dir][1] - t.at[1];
      if (!fits(ids, dx, dy)) continue;                      // it would overlap: that area stays off this map
      put(ids, dx, dy); queue.push(...ids);
    }
  }

  const edges = [];
  for (const [id, p] of placed) {
    for (const dir of COMPASS) {
      const to = exitTo(rooms[id].exits?.[dir]), q = typeof to === "string" ? placed.get(to) : null;
      if (q && q.x === p.x + STEP[dir][0] && q.y === p.y + STEP[dir][1]) edges.push({ from: id, dir, to });
      // A rule answers this exit: if the room next door has an exit back here, they are joined (the walk finds out what the rule says).
      else if (to === true) {
        const next = taken.get(key(p.x + STEP[dir][0], p.y + STEP[dir][1]));
        if (next && exitTo(rooms[next].exits?.[BACK[dir]]) === id) edges.push({ from: id, dir, to: next });
      }
    }
  }
  return { z, opening: false, placed, edges };
}

// A room's name on the map: its own (in the pack's words if it is a key), else the pack's, else its id.
const roomName = (room, id, pack) => (room?.name ? text(room.name, pack) : pack?.place ?? id);

// The map of the room you are in:
//   { level, opening, rooms: [{ id, name, x, y, current }], lines: [[a, b]], stubs: [{ room, dir }] }
// level: the z of your room (the pack names it: levelName). opening: you are in the opening, a map of one room, no
// lines, no stubs. lines: a full line between two shown rooms joined by an exit and in neighbouring cells (each pair
// once, sorted by id). stubs: a short line out of a room for each exit the compass would show (open or shut, or one a
// rule answers) that leads to a room not shown, north, south, east and west only. pack is optional: without it the
// names are the world's own text.
export function mapOf(state, pack) {
  const L = layout(state), rooms = state.world.rooms, here = state.player.at;
  const list = [...L.placed].map(([id, p]) => ({ id, name: roomName(rooms[id], id, pack), x: p.x, y: p.y, current: id === here }))
    .sort((a, b) => a.y - b.y || a.x - b.x || (a.id < b.id ? -1 : 1));
  const lines = [], seen = new Set();
  for (const { from, to } of L.edges) {
    const pair = from < to ? [from, to] : [to, from];
    if (!seen.has(pair.join("|"))) { seen.add(pair.join("|")); lines.push(pair); }
  }
  lines.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1));   // the same order every time
  const stubs = [];
  if (!L.opening) {
    for (const { id } of list) {
      for (const dir of COMPASS) {
        const to = exitTo(rooms[id].exits?.[dir]);
        if ((to === true && !L.edges.some(e => e.from === id && e.dir === dir)) || (typeof to === "string" && !L.placed.has(to))) stubs.push({ room: id, dir });
      }
    }
  }
  return { level: L.z, opening: L.opening, rooms: list, lines, stubs };
}

// The shortest list of directions to a room on the map, over shown rooms and their lines: [] if it is the room you are
// in, null if it isn't on the map. The directions are the real exits, shut ones too: the walk finds out.
export function routeTo(state, roomId) {
  const L = layout(state), here = state.player.at;
  if (!L.placed.has(roomId)) return null;
  const how = new Map([[here, []]]), queue = [here];          // id → the directions that got there first
  for (let i = 0; i < queue.length; i++) {
    for (const e of L.edges) {
      if (e.from !== queue[i] || how.has(e.to)) continue;
      how.set(e.to, [...how.get(e.from), e.dir]);
      queue.push(e.to);
    }
  }
  return how.get(roomId) ?? null;
}

// The name of a level, from its z, in the pack's words: "Ground level", "Level 1", "Level −1".
export const levelName = (z, pack) => (z === 0 ? pack.map.ground : pack.map.level(z));

// The commands a trip stands for, as you would type them: "North then east then east" (the echo in the story).
export function tripWords(path, pack) {
  const then = " " + pack.words.then[0] + " ";
  const words = path.map(d => pack.dirs[d]).join(then).toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Do two lists of story paragraphs say the same?
const same = (a, b) => a.length === b.length && a.every((p, i) => p.text === b[i].text && (p.style ?? "") === (b[i].style ?? ""));

// Walk to a room on the map, one real move after another (the parser and the engine, so every rule applies). Only what
// is worth reading is returned: the arrival, or, if the walk stopped early, where it stopped and what was said there.
// It stops when a step is refused or anything is said beyond the room's own description (an event, a warning, damage, a
// guard's line), or the story ends or asks something. Rooms passed through silently are not told.
//   null (nothing to walk: the room you are in, or not on the map)
//   or { next, paragraphs, path, reached, stopped } with the state after, the story to show, the whole route, whether
//   you arrived, and how many steps were taken.
// `at` is the game time, as for step(). One state comes out, so one UNDO takes the whole trip back.
export function walk(state, roomId, pack, at) {
  const path = routeTo(state, roomId);
  if (!path?.length) return null;
  let s = state, passed = false;                              // passed: we are in a room whose text wasn't shown
  for (let i = 0; i < path.length; i++) {
    const before = s, parsed = parse(pack.dirs[path[i]], s, pack);
    if (!parsed.actions) return { next: s, paragraphs: passed ? describe(s, s.player.at, pack) : [], path, reached: false, stopped: i };
    const r = step(s, { ...parsed.actions[0], at });
    if (r.refused.length) console.warn("Effects refused by the engine:", r.refused);   // as in play
    s = r.next;
    const said = story(r.applied, s, pack), moved = s.player.at !== before.player.at;
    const plain = moved && same(said, describe(s, s.player.at, pack));   // only the room's own description
    const last = i === path.length - 1;
    if (plain && !last && !s.ended && !s.pending.question) { passed = true; continue; }
    // Stuck in a room whose text wasn't shown: tell where we are before what stopped us.
    const paragraphs = !moved && passed ? [...describe(before, before.player.at, pack), ...said] : said;
    return { next: s, paragraphs, path, reached: plain && last, stopped: i + 1 };
  }
}
