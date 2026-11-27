// Map: what the map popup shows (INTERFACE.md §12), the way there, and the walk that follows a click on a room.
// Pure: reads the state and the pack, never changes either, never touches the page (ui/map.js draws it).
//
// What is shown is the world's plan as it is: the rooms you have visited on the floor you are on, each on its square (state.world.plan:
// js/plan.js), and a line for each way between two of them on neighbouring squares. Nothing is placed, moved or left off: a room is
// where the plan says. x grows east, y south.

import { exitTo } from "./exits.js?v=0.74.2";
import { roomBeside } from "./plan.js?v=0.74.2";
import { BACK, MAP_COMPASS } from "./space.js?v=0.74.2";
import { text, describe } from "./narrator.js?v=0.74.2";
import { step } from "./engine.js?v=0.74.2";
import { parse } from "./parser.js?v=0.74.2";
import { story } from "./view.js?v=0.74.2";

// The layout of the map for the state: where each shown room sits, and which ways join neighbouring ones.
//   { z, placed: Map(id → { x, y }), edges: [{ from, dir, to }] }
// An edge is one way that leads to the room on the next square, a room shown too. (A room with no square, in a state with no plan
// from a test's own rooms: the room alone.)
function layout(state) {
  const plan = state.world.plan, rooms = state.world.rooms, here = state.player.at;
  const z = plan?.[here]?.[2] ?? 0;
  const placed = new Map();                                  // id → { x, y }
  if (!plan?.[here]) {
    placed.set(here, { x: 0, y: 0 });
    return { z, placed, edges: [] };
  }
  const visited = new Set(state.seen?.visited ?? []);
  for (const [id, [x, y, f]] of Object.entries(plan)) if (f === z && (id === here || visited.has(id)) && rooms[id]) placed.set(id, { x, y });
  const edges = [];
  for (const id of placed.keys()) {
    for (const dir of MAP_COMPASS) {
      const to = exitTo(rooms[id].exits?.[dir]), next = roomBeside(plan, id, dir);
      if (typeof to === "string" && placed.has(to) && next === to) edges.push({ from: id, dir, to });
      // A rule answers this way: if the room next door has a way back here they are joined (the walk finds out what the rule says).
      else if (to === true && next && placed.has(next) && exitTo(rooms[next].exits?.[BACK[dir]]) === id) edges.push({ from: id, dir, to: next });
    }
  }
  return { z, placed, edges };
}

// A room's name on the map: its own (in the pack's words if it is a key), else the pack's, else its id.
const roomName = (room, id, pack) => (room?.name ? text(room.name, pack) : pack?.place ?? id);

// Has a room a way in this direction, as the compass shows it (open or shut, or one a rule answers)?
const hasWay = (room, dir) => !!exitTo(room?.exits?.[dir]);

// The map of the room you are in:
//   { level, rooms: [{ id, name, x, y, current, up, down }], lines: [[a, b]], stubs: [{ room, dir }] }
// level: the z of your room (the pack names it: levelName). up, down: the room has a way up or down (as the compass shows it: open or shut, or one a rule answers;
// the map marks it in the room's corner). lines: a full line between two shown rooms joined by an exit and in neighbouring cells (each pair
// once, sorted by id). stubs: a short line out of a room for each exit the compass would show (open or shut, or one a
// rule answers) that leads to a room not shown, north, south, east and west only. pack is optional: without it the
// names are the world's own text.
export function mapOf(state, pack) {
  const L = layout(state), rooms = state.world.rooms, here = state.player.at;
  const list = [...L.placed].map(([id, p]) => ({ id, name: roomName(rooms[id], id, pack), x: p.x, y: p.y, current: id === here,
                                                 up: hasWay(rooms[id], "u"), down: hasWay(rooms[id], "d") }))
    .sort((a, b) => a.y - b.y || a.x - b.x || (a.id < b.id ? -1 : 1));
  const lines = [], seen = new Set();
  for (const { from, to, dir } of L.edges) {
    const pair = from < to ? [from, to] : [to, from];
    if (!seen.has(pair.join("|"))) { seen.add(pair.join("|")); lines.push(pair); }
  }
  lines.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1));   // the same order every time
  const stubs = [];
  for (const { id } of list) {
    for (const dir of MAP_COMPASS) {
      const to = exitTo(rooms[id].exits?.[dir]);
      if ((to === true && !L.edges.some(e => e.from === id && e.dir === dir)) || (typeof to === "string" && !L.placed.has(to))) stubs.push({ room: id, dir });
    }
  }
  return { level: L.z, rooms: list, lines, stubs };
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

// A room as the map's list for screen readers says it, in the pack's words: "The hub (up, down) (you are here)".
export function roomWords(room, pack) {
  const ways = [room.up && pack.dirs.u, room.down && pack.dirs.d].filter(Boolean).map(w => w.toLowerCase());
  return room.name + (ways.length ? " (" + ways.join(", ") + ")" : "") + (room.current ? " (" + pack.map.here + ")" : "");
}

// The name of a level, from its z, in the pack's words: "Ground level", "Level 1", "Level −1".
export const levelName = (z, pack) => (z === 0 ? pack.map.ground : pack.map.level(z));

// The commands a trip stands for, as you would type them: "North then east then east" (the echo in the story).
export function tripWords(path, pack) {
  const then = " " + pack.words.then[0] + " ";
  const words = path.map(d => pack.dirs[d]).join(then).toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// A step's effects as a walk reads them: a thing that follows you (js/movers.js, `places` "player") coming in after you is no reason to
// stop, so its line, and what it keeps out of the description or marks in it, are left out (it is in the room's description then).
function passing(applied) {
  const followers = applied.filter(e => e.follows).map(e => e.follows);
  if (!followers.length) return applied;
  const keep = (ids) => ids.filter(id => !followers.includes(id));
  return applied.filter(e => !e.follows).map(e => (e.without ? { ...e, without: keep(e.without) } : e.inView ? { ...e, inView: keep(e.inView) } : e));
}

// Do two lists of story paragraphs say the same?
const same = (a, b) => a.length === b.length && a.every((p, i) => p.text === b[i].text && (p.style ?? "") === (b[i].style ?? ""));

// Walk to a room on the map, one real move after another (the parser and the engine, so every rule applies). Only what
// is worth reading is returned: the arrival, or, if the walk stopped early, where it stopped and what was said there.
// It stops when a step is refused or anything is said beyond the room's own description (an event, a warning, damage, a
// guard's line), or the story ends or asks something. Rooms passed through silently are not told.
//   null (nothing to walk: the room you are in, or not on the map)
//   or { next, paragraphs, path, reached, stopped, applied } with the state after, the story to show, the whole route, whether
//   you arrived, how many steps were taken, and every step's effects in order (the moment's list, for its sounds: ui/sound.js).
// `at` is the game time, as for step(). One state comes out, so one UNDO takes the whole trip back.
export function walk(state, roomId, pack, at) {
  const path = routeTo(state, roomId);
  if (!path?.length) return null;
  let s = state, passed = false;                              // passed: we are in a room whose text wasn't shown
  const applied = [];
  for (let i = 0; i < path.length; i++) {
    const before = s, parsed = parse(pack.dirs[path[i]], s, pack);
    if (!parsed.actions) return { next: s, paragraphs: passed ? describe(s, s.player.at, pack) : [], path, reached: false, stopped: i, applied };
    const r = step(s, { ...parsed.actions[0], at });
    if (r.refused.length) console.warn("Effects refused by the engine:", r.refused);   // as in play
    s = r.next;
    applied.push(...r.applied);
    const said = story(r.applied, s, pack), moved = s.player.at !== before.player.at;
    const plain = moved && same(story(passing(r.applied), s, pack), describe(s, s.player.at, pack));   // only the room's own description
    const last = i === path.length - 1;
    if (plain && !last && !s.ended && !s.pending.question) { passed = true; continue; }
    // Stuck in a room whose text wasn't shown: tell where we are before what stopped us.
    const paragraphs = !moved && passed ? [...describe(before, before.player.at, pack), ...said] : said;
    return { next: s, paragraphs, path, reached: plain && last, stopped: i + 1, applied };
  }
}
