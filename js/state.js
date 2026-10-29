// The game state: everything the game knows about one game, as one plain object (ARCHITECTURE.md §3).
// Plain data, no behaviour. Only the engine (js/engine.js) makes a new one; everything else only reads it.
// Interface-only things (text reveal, focus, "restarting…") stay out.

import { worldFor, DEFAULT } from "../worlds/index.js";
import { applyChangeSet } from "./engine.js";
import { newSeed } from "./random.js";

// The shape of the state. Bump it when the state changes shape, so older saved games aren't loaded into code
// that doesn't understand them. (9: waitFor can now hold an `if`, so a saved game from before may have waitFor: null. 10: `properties` and `warnings`.
// 11: `fired`, the `once` rules that have had their one time. 12: every key starts in blank(). 13: `pictures` (pictures that
// aren't a room's) and `ending` (the one the story ended with).)
export const FORMAT = 15;   // 14: tension 0–5 and health 5–0. 15: health only; tension and moods are gone (saves from before start afresh)

// Health: a new game, and beginning again, start at full health, 5 (INTERFACE.md §6c). A hit is 2 at most outside an
// ending (the checker warns), so the end never comes without being "severely hurt" first.
// A fresh game in a language: the world that plays (the one named by `id`; worlds/index.js's DEFAULT when none is), if it's
// written in this language (only English worlds so far), built from its change set, opening and all (ARCHITECTURE.md
// §3, "The opening"). Health can be carried over (changing language keeps it). sequel: a change set = that world
// instead (tests); false = no world. A language with no world gets a placeholder room, so there is somewhere to be.
// protect: false leaves the opening open to change (only for tests that use it as a scratch room).
export function newState({ lang, health = 5, seed = newSeed(), sequel = true, protect = true, id = DEFAULT }) {
  const state = blank({ lang, health, seed });
  const world = sequel === true ? worldFor(lang, id) : sequel || null;
  if (world) {
    const r = applyChangeSet(state, world, { protect, fields: "warn" });
    if (r.warnings?.length) console.warn(`The world${sequel === true ? ` "${id}"` : ""} has ${r.warnings.length} warning(s):\n  ` + r.warnings.join("\n  "));
    if (!r.refused.length) return { ...r.next, worldId: sequel === true ? id : null };
    console.warn("The world was refused:", r.refused);
  }
  return nowhere(state);
}

// A state with no rooms yet: the world's change set builds them, its opening first.
function blank({ lang, health, seed }) {
  return {
    worldId: null,                 // which world of worlds/index.js this game plays (beginning again keeps it)
    opening: null,                 // the world's opening, as it declared it (js/opening.js): room, restart, hints, intro, way, lines
    entrance: null,                // where the opening's way on leads: the world's first room (the world sets it)
    format: FORMAT,                // the state's shape (see FORMAT)
    properties: {},                // the properties the world declared: "thing.name" → { type, min?, max?, start? } (js/fields.js)
    warnings: [],                  // what the world's file got wrong, found when it loaded (js/fields.js); it still plays
    lang,                          // the language this game is written in (ARCHITECTURE.md §8)
    turn: 0,                       // commands answered so far (kept, not shown)
    clock: 0,                      // play time (ms) at the last command; the controller's clock is the live one
    time: {                        // the world's clock = clock + shift (js/time.js): what the title bar shows
      shift: 0,                    //   how far the story has moved it (the opening's hour, jumps forward and back)
      weekday: null,               //   what day of the week day 1 is ("sun")
      seen: 0                      //   the world time scheduled rules have been run up to
    },
    rng: seed,                     // the seeded random generator's position (random.js)
    player: {
      at: null,                    // the room you're in
      carrying: [],                // item ids, in inventory slot order
      health                       // 5 (well) to 0 (the end): INTERFACE.md §6c
    },
    world: {                       // rooms (description, exits) and objects (where they are, their properties)
      rooms: {},
      objects: {}
    },
    pictures: {},                  // pictures that aren't a room's (the endings'): id → { alt, picture } (`add picture`, ARCHITECTURE.md §5)
    rules: [],                     // the game's rules in force, tried before the standard verbs
    timers: {},                    // when each active timed rule is next due (game ms, or turn number)
    vocab: {},                     // verbs this world added ("row"): verb → { words, object }
    changes: {},                   // named changes: name → effects, run by { change: name } from any rule
    puzzles: {},                   // the puzzles as data (js/check.js, hints): the opening's, then the world's
    seen: {                        // what you've come across (for hints, and for the topics offered)
      held: [],                    //   what you've had in your hands
      visited: [],                 //   where you've been
      things: [],                  //   what you've seen in a room you were in
      ideas: []                    //   ideas that have come up (the `know` effect)
    },
    hinted: {},                    // how many hints each puzzle has given
    fired: {},                     // the rules with `once: true` that have fired: id → true (they never fire again)
    recent: {},                    // the last phrasing picked for each varied line, so it isn't repeated
    lastObj: null,                 // the last thing your commands mentioned: what "it" / "lo" means
    mentioned: [],                 // the things mentioned lately, newest first: "la" finds the latest feminine one
    talkingTo: null,               // who "ask about…" goes to next
    asked: {},                     // the topics you've asked each person about, this visit: id → [topic, …]
    lastCommand: null,             // game ms of your last command (ambience keeps quiet after it); null before the first
    lastLine: null,                // game ms of the last automatic line (timed rule or ambience); null before the first
    ambienceSaid: {},              // the ambience lines said this visit, by room: room → [line number, …]
    pending: {
      question: null,              // a question waiting for your answer: your next input is read as the answer
                                   //   { ask: "name", blankOk: true }, or a yes/no question (engine: `confirm`)
      proposals: []                // AI change sets waiting to be applied (from step 6)
    },
    ended: false,                  // the story has ended (the `end` effect)
    ending: null                   // the picture the story ended with: an id of `pictures`, or null (no picture named)
  };
}

// No world to play (this language has none yet, or it was refused): one room, with its text from the language pack.
function nowhere(state) {
  const blankPicture = { version: 1, draw: [{ id: "blank", rect: [0, 0, 320, 136], fill: 0 }] };
  return { ...state, player: { ...state.player, at: "nowhere" }, seen: { ...state.seen, held: [], visited: ["nowhere"] },
    world: { objects: {}, rooms: { nowhere: { name: "@noWorld.place", area: "nowhere", at: [0, 0, 0], exits: {},
      describe: ["@noWorld.text"], alt: "@noWorld.alt", picture: blankPicture } } } };
}

// Is this item being carried?
export const carries = (state, id) => state.player.carrying.includes(id);
