// The game state: everything the game knows about one game, as one plain object (ARCHITECTURE.md §3).
// Plain data, no behaviour. Only the engine (js/engine.js) makes a new one; everything else only reads it.
// Interface-only things (text reveal, focus, "restarting…") stay out.

import { worldFor, DEFAULT } from "../worlds/load.js?v=0.78.0";   // (what is loaded: the page loads a world when it is opened; Node has every world)
import { applyChangeSet } from "./engine.js?v=0.78.0";
import { newSeed } from "./random.js?v=0.78.0";
import { withPractice } from "./practice.js?v=0.78.0";
import { readPlan, NO_PLAN } from "./plan.js?v=0.78.0";

// The shape of the state. Bump it when the state changes shape, so older saved games aren't loaded into code
// that doesn't understand them. (9: waitFor can now hold an `if`, so a saved game from before may have waitFor: null. 10: `properties` and `warnings`.
// 11: `fired`, the `once` rules that have had their one time. 12: every key starts in blank(). 13: `pictures` (pictures that
// aren't a room's) and `ending` (the one the story ended with).)
export const FORMAT = 20;   // 14: tension 0–5 and health 5–0. 15: health only; tension and moods are gone (saves from before start afresh). 16: no restart object in the opening (older saves hold it, so they start afresh). 17: the engine audit (the worlds' rules became facts on their things; older saves hold the old rules, so they start afresh). 18: the start room (no `entrance`, no opening puzzles or way rules; older saves start afresh). 19: the shown intro (the opening's `intro` is a text; older saves hold the carried intro thing and its rules, so they start afresh). 20: puzzles by id (a puzzle's `solve` is steps by id, no longer command strings; older saves hold the strings, which the hints can no longer word, so they start afresh)

// Health: a new game, and beginning again, start at full health, 5 (INTERFACE.md §6c). A hit takes what it takes (1 to 5,
// the checker holds worlds to the scale: BRIEF.md §5), with no warning turn; at 0 the story ends.
// A fresh game in a language: the world that plays (the one named by `id`; worlds/index.js's DEFAULT when none is), if it's
// written in this language, built from its change set, opening and all (ARCHITECTURE.md §3, "The opening"). health: where
// it starts (tests; a game always starts at 5). sequel: a change set = that world instead (tests); false = no world. A
// language with no world gets a placeholder room, so there is somewhere to be.
// protect: false leaves the opening's things and rules open to change (only for tests that use them as scratch).
export function newState(options) {
  const { state, refused, warnings } = buildWorld(options);
  const named = options.sequel === undefined || options.sequel === true ? (options.id === undefined ? DEFAULT : options.id) : null;
  if (warnings.length) console.warn(warningReport(warnings, named));
  if (refused.length) console.warn(refusalReport(refused, named), refused);
  return state;
}

// The same, as data (what newState does, without the console): { state, refused, warnings }. `state` is the new game (the placeholder
// room when the world was refused, or when there is none); `refused` the refused effects, each { effect, reason }, none when the world
// was accepted; `warnings` what the world's file got wrong and still plays (js/fields.js). Nothing is said on the console.
export function buildWorld({ lang, health = 5, seed = newSeed(), sequel = true, protect = true, id = DEFAULT }) {
  const state = blank({ lang, health, seed });
  // A copy of the world's change set: the game's rooms and things never share a list or an object with the world's module, so changing
  // one (a test, a rule) can never change the world itself for the next game (worlds are plain JSON: tests/worlds.test.js).
  const world = sequel === true ? structuredClone(worldFor(lang, id)) : sequel ? structuredClone(sequel) : null;
  if (!world) return { state: nowhere(state), refused: [], warnings: [] };
  // A world of worlds/ has a plan (js/plan.js); a test's own set (sequel: a set) may leave it out, with its exits written room to room.
  const r = sequel === true && world.plan === undefined ? { refused: [{ effect: null, reason: NO_PLAN }] } : applyChangeSet(state, world, { protect, fields: "warn" });
  const warnings = r.warnings ?? [];
  if (r.refused.length) return { state: nowhere(state), refused: r.refused, warnings };
  return { state: withPractice({ ...r.next, worldId: sequel === true ? id : null }), refused: [], warnings };
}

// What a world's warnings say, as one line a person reads: "The world "x" has 2 warning(s):" and one line each.
export function warningReport(warnings, id = null) {
  return `The world${id ? ` "${id}"` : ""} has ${warnings.length} warning(s):\n  ` + warnings.join("\n  ");
}

// A state with no rooms yet: the world's change set builds them, its opening first.
function blank({ lang, health, seed }) {
  return {
    worldId: null,                 // which world of worlds/index.js this game plays (beginning again keeps it)
    opening: null,                 // the world's opening, as it declared it (js/opening.js): its start room, hints, way out, intro (a text), lines
    format: FORMAT,                // the state's shape (see FORMAT)
    properties: {},                // the properties the world declared: "thing.name" → { type, min?, max?, start? } (js/fields.js)
    warnings: [],                  // what the world's file got wrong, found when it loaded (js/fields.js); it still plays
    lang,                          // the language this game is written in (ARCHITECTURE.md §8)
    turn: 0,                       // commands answered so far (kept, not shown)
    clock: 0,                      // play time (ms) at the last command; the controller's clock is the live one
    time: {                        // the world's clock = clock + shift (js/time.js): what the title bar shows
      shift: 0,                    //   how far the story has moved it (the start hour, jumps forward and back)
      weekday: null,               //   what day of the week day 1 is ("sun")
      seen: 0                      //   the world time scheduled rules have been run up to
    },
    rng: seed,                     // the seeded random generator's position (random.js)
    player: {
      at: null,                    // the room you're in
      carrying: [],                // item ids, in inventory slot order
      health                       // 5 (well) to 0 (the end): INTERFACE.md §6c
                                   // (answers: what was typed to each `ask`, by key, { verdict: "Voss" }: made by the
                                   //  engine with the first answer, so games saved before it load unchanged)
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
    puzzles: {},                   // the puzzles as data (js/check.js, hints): the world's, the way out of the start room first
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
                                   //   a question for words, { ask: "name" }, or a yes/no question (engine:
                                   //   `confirm`), with `then`: the question for words it was asked over, open again after
      proposals: []                // AI change sets waiting to be applied (from step 6)
    },
    ended: false,                  // the story has ended (the `end` effect)
    ending: null                   // the picture the story ended with: an id of `pictures`, or null (no picture named)
  };
}

// Why a world was refused, as lines a person reads first: "The world "x" was refused (2 reasons):" and one line per reason,
// "rooms/salter: …", before the refused effects themselves (which follow in the console, for the detail). An effect is
// named by what it adds and its id (rooms/salter, rules/dog-attacks), or by its kind when the reason doesn't say.
export function refusalReport(refused, id = null) {
  const where = (e) => !e || typeof e !== "object" ? null
    : e.add ? `${e.add}s/${e.add === "rule" ? e.rule?.id : e.add === "word" ? e.verb : e.id}`
    : "opening" in e ? `opening (${e.opening})` : Object.keys(e)[0] ?? null;
  const lines = refused.map(({ effect, reason }) => {
    const w = where(effect);
    return w && !String(reason).startsWith(w) ? `${w}: ${reason}` : String(reason);
  });
  return `The world${id ? ` "${id}"` : ""} was refused (${refused.length} reason${refused.length === 1 ? "" : "s"}):\n  ${lines.join("\n  ")}\nThe refused effects:`;
}

// No world to play (this language has none yet, or it was refused): one room, with its text from the language pack.
function nowhere(state) {
  const blankPicture = { version: 1, draw: [{ id: "blank", rect: [0, 0, 320, 136], fill: 0 }] };
  return { ...state, player: { ...state.player, at: "nowhere" }, seen: { ...state.seen, held: [], visited: ["nowhere"] },
    world: { objects: {}, rooms: { nowhere: { name: "@noWorld.place", exits: {},
      describe: ["@noWorld.text"], alt: "@noWorld.alt", picture: blankPicture } } } };
}

// The state a new game of a world starts from, only to be looked at: a world's own page (ui/splash.js) hands it to the music, which plays the
// start room's theme from it. Never played, never saved (a game itself is made by js/session.js, begin).
export const startOf = (lang, id) => newState({ lang, id });

// A saved game from before the plan has no squares in its world: they are the world's, never changed in play, so they come from its plan
// as the game is continued (the saved rooms keep their own exits and texts). The same state when it has them, or its world has no plan.
export function withPlan(state) {
  if (state.world.plan || !state.worldId) return state;
  try {
    const set = worldFor(state.lang, state.worldId), read = set?.plan ? readPlan(set.plan, Object.keys(state.world.rooms)) : null;
    return read && !read.problems.length ? { ...state, world: { ...state.world, plan: read.squares } } : state;
  } catch (e) { return state; }
}
