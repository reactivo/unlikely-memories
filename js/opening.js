// Opening: the mechanics of a world's opening, built from what the world declares (ARCHITECTURE.md §3, "The
// opening"; what the world writes: BRIEF.md §3). The world names its room, its three things and its way on, and
// writes the lines; this module makes the rules and the puzzles from that, the same for every world.
// Pure: reads the state, never changes it. The engine (js/engine.js) applies what these return and keeps the
// opening fixed; the checker (js/check.js) verifies the contract.
//
//   opening: { room, restart, hints, intro, way, lines: { notYet, notYetRestart, notYetHints, through, askRestart,
//              hintFrame, farewell, restartYes?, restartNo? } }
// (The hour the opening plays at is an ordinary `time` effect in the world's change set, before the world's own
// `arrival` change sets its start.)

import { DIRECTIONS } from "./space.js";

export const PARTS = ["room", "restart", "hints", "intro", "way"];
export const THINGS = ["restart", "hints", "intro", "way"];
export const LINES = ["notYet", "notYetRestart", "notYetHints", "through", "askRestart", "hintFrame", "farewell"];

// The verbs that use each thing (js/actions.js). Examining and taking are the standard ones.
const USE = ["use", "open", "turn", "push", "pull", "eat", "drink", "wear", "switch_on"];   // the restart thing
const LISTEN = ["listen", "use", "talk", "ask"];                                           // the hints thing
const READ = ["read", "examine", "open"];                                                  // the intro
const GO_THROUGH = ["enter", "open", "push", "pull", "knock", "use", "climb", "board"];    // the way on (board: a world may add it)

// The direction of the way on: the thing's own `leads`, else the room's one exit that is `true` (a way a rule
// answers). Null if it isn't clear.
export function direction(g, d) {
  const way = g.world.objects[d.way], room = g.world.rooms[d.room];
  if (!way || !room) return null;
  if (way.leads) return DIRECTIONS.includes(way.leads) && room.exits?.[way.leads] === true ? way.leads : null;
  const open = Object.entries(room.exits || {}).filter(([, to]) => to === true).map(([dir]) => dir);
  return open.length === 1 ? open[0] : null;
}

// What is wrong with an opening declaration, if anything (the engine refuses a world with these problems; the
// checker repeats them for a state built by other means). Placement and words: BRIEF.md §3.
export function problems(g, d) {
  if (!d || typeof d !== "object") return ["the opening isn't declared"];
  const why = [], obj = (id) => g.world.objects[id];
  for (const k of PARTS) if (typeof d[k] !== "string" || !d[k]) why.push(`opening.${k} must be the id of its ${k === "room" ? "room" : "thing"}`);
  if (why.length) return why;
  if (!g.world.rooms[d.room]) why.push(`opening.room "${d.room}" isn't a room`);
  for (const k of THINGS) if (!obj(d[k])) why.push(`opening.${k} "${d[k]}" isn't an object`);
  if (new Set(PARTS.map(k => d[k])).size < PARTS.length) why.push("the opening's room, restart, hints, intro and way must all be different");
  if (why.length) return why;
  for (const k of ["restart", "hints"]) {
    if (obj(d[k]).at !== d.room) why.push(`the ${k} thing "${d[k]}" must be in the opening room`);
    if (!obj(d[k]).portable) why.push(`the ${k} thing "${d[k]}" must be portable`);
  }
  if (obj(d.intro).at !== "player") why.push(`the intro "${d.intro}" must be carried from the start (at: "player")`);
  if (typeof obj(d.intro).examine !== "string" || !obj(d.intro).examine.trim()) why.push(`the intro "${d.intro}" needs an examine text: what it says`);
  if (obj(d.way).at !== d.room) why.push(`the way on "${d.way}" must be in the opening room`);
  if (obj(d.way).portable) why.push(`the way on "${d.way}" can't be portable`);
  for (const k of THINGS) if (!obj(d[k]).words?.nouns?.length) why.push(`"${d[k]}" needs words.nouns, so it can be named`);
  for (const l of LINES) if (typeof d.lines?.[l] !== "string" || !d.lines[l].trim()) why.push(`opening.lines.${l} is missing`);
  if (!direction(g, d)) why.push(`the opening room needs one exit set to true: the way on (or the way's \`leads\`, with that exit true)`);
  if (!g.entrance || !g.world.rooms[g.entrance]) why.push(`game.entrance must be set to the room the way on leads to`);
  else if (g.entrance === d.room) why.push("game.entrance can't be the opening room");
  return why;
}

// The noun a player types for a thing.
const noun = (g, id) => g.world.objects[id].words.nouns[0];

// The opening's rules (tried before every other, so no world rule can answer for them). `fixed` and the rest are
// the engine's to add.
export function rules(g, d) {
  const { restart: R, hints: H, intro: I, way: W, room, lines: L } = d, dir = direction(g, d);
  const held = (id) => ({ [id + ".at"]: "player" }), loose = (id) => ({ [id + ".at"]: { "!=": "player" } });
  const here = { "player.at": room };
  // The way on is used by words or by going that way: the same rules for both, held back until you carry both things.
  const through = [{ say: L.through }, { change: "arrival", optional: true }, { disconnect: room, dir },
                   { travel: "$game.entrance" }, { describe: "$here" }];
  const way = (name, match) => [
    { id: `opening_${name}_neither`, match, if: [here, loose(R), loose(H)], do: [{ say: L.notYet }] },
    { id: `opening_${name}_no_restart`, match, if: [here, loose(R)], do: [{ say: L.notYetRestart }] },
    { id: `opening_${name}_no_hints`, match, if: [here, loose(H)], do: [{ say: L.notYetHints }] },
    { id: `opening_${name}`, match, if: [here], do: through }
  ];
  return [
    // The restart thing: using it asks (once you have it). The world may answer yes and no in its own words; else the
    // language's. (After the end the game is locked: only "begin again" works, engine.js.)
    { id: "opening_restart_loose", match: { verb: USE, obj: R }, if: [loose(R)], do: [{ say: "@takeFirst" }] },
    { id: "opening_restart", match: { verb: USE, obj: R },
      do: [{ confirm: L.askRestart,
             yes: [{ say: L.restartYes ?? "@againYes", ...(L.restartYes ? {} : { style: "sys" }) }, { restart: true }],
             ...(L.restartNo ? { no: [{ say: L.restartNo }] } : {}) }] },
    // The hints thing: listening gives the next hint, in the world's frame.
    { id: "opening_hints", match: { verb: LISTEN, obj: H }, do: [{ hint: L.hintFrame }] },
    // The intro: it says its text, then its farewell, and is gone.
    { id: "opening_intro", match: { verb: READ, obj: I }, if: [held(I)],
      do: [{ say: `$${I}.examine`, img: `$${I}.img` }, { say: L.farewell }, { move: I, to: null }] },
    // None of the three can be dropped, or put away in something else.
    { id: "opening_drop", match: { verb: "drop", obj: [R, H, I] }, if: [{ "$obj.at": "player" }], do: [{ say: "@cantDrop" }] },
    { id: "opening_put", match: { verb: "put", obj: [R, H, I] }, if: [{ "$obj.at": "player" }], do: [{ say: "@cantDrop" }] },
    ...way("way", { verb: GO_THROUGH, obj: W }),
    ...way("go", { verb: "go", dir })
  ];
}

// The opening's own steps as puzzles, ahead of the world's: the hints thing gives their commands first.
export function puzzles(g, d) {
  const { restart: R, hints: H, intro: I, way: W, room } = d;
  return {
    opening_take_restart: { where: room, needs: [], solve: ["{take} " + noun(g, R)], gives: [R], clues: [R, W], hints: [] },
    opening_take_hints: { where: room, needs: [], solve: ["{take} " + noun(g, H)], gives: [H], clues: [H, W], hints: [] },
    opening_way: { where: room, needs: ["opening_take_restart", "opening_take_hints"], solve: ["{enter} " + noun(g, W)],
                   reaches: "entrance", clues: [W, I], hints: [] }
  };
}
