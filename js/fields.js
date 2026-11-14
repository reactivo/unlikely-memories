// Fields: the one list of the fields the engine knows, and the check that a change set (a world, or what the AI
// proposes in play) uses only those, plus the properties it declares (ARCHITECTURE.md §3, "Fields and properties").
// Pure: reads the state and the set, never changes either. The engine (js/engine.js) decides what to do with the
// findings: a world's are warnings (it still loads), an AI change set's are reasons to refuse it.
//
//   checkSet(state, set) → [{ piece, text, effect?, refuse? }]   "rules/dog-attacks", `uses "dog.angr", not declared (…)`
// A finding marked `refuse` (an effect, an operator or a kind of echo only the engine writes: ENGINE_ONLY, ENGINE_ONLY_OPERATORS,
// ENGINE_ECHOES) refuses the
// set even where the others only warn. A finding marked `warn` (an unknown field inside music: MUSIC.md §2.4) only warns, even
// where the others refuse: nothing about music is ever refused.

import { ANSWERED } from "./verbs.js?v=0.50.2";
import { PARTS, LINES } from "./opening.js?v=0.50.2";
import { isExitObject, exitConditions, markedDirs, connectedExit, CONNECT_FIELDS } from "./exits.js?v=0.50.2";
import { DIRECTIONS } from "./space.js?v=0.50.2";
import { isObject, isLine } from "./shapes.js?v=0.50.2";
import { MODIFIERS, CONDITION_FIELDS } from "./conditions.js?v=0.50.2";
import { PLACE_FIELDS, ROUNDS_FIELDS, shapeProblems } from "./movers.js?v=0.50.2";

// ---- The list ------------------------------------------------------------------------------------------------------
// What each piece of a world may have. A thing may also answer a verb (a field named like the action: `take`, `talk`),
// and anything else a world keeps on a thing must be declared in `properties` ("dog.anger").
const ROOM = ["name", "area", "at", "describe", "exits", "alt", "overlayAlt", "scenery", "mentions", "picture", "music", "ambience", "waitFor", "placeholder", "dream", ...ANSWERED];
const OBJECT = ["at", "portable", "droppable", "container", "open", "locked", "name", "note", "actions", "heldActions", "examine",
  "here", "lies", "words", "sprite", "floorSprite", "portrait", "img", "use", "leads", "door", "shut", "pair", "lock", "enterable", "parts", "mentions", "topics",
  "unnoticed", "opens", "waitFor", "shape", "consumable", "heals", "starts", "stops", "from", "brought", "again", "already", "times", "daily", "if",
  "requires", "spends", "lacking", "dream", "places", "rounds", "arrives", "leaves", "material", ...ANSWERED];
const PUZZLE = ["where", "needs", "solve", "gives", "reaches", "ending", "clues", "hints", "time"];
// The world's music (`add music`) and a room's own (its `music` field): MUSIC.md §4, read by js/music.js. The world's may also carry
// `levels`, its parts' measured loudness, written by the step that makes the world, never by the AI (MUSIC.md §6c; not in BRIEF).
const MUSIC = ["mode", "tempo", "colour", "instruments", "tone", "lines", "melody"];
const LEVELS = "levels";

export const FIELDS = {
  changeSet: ["because", "facts", "effects", "opening", "properties"],
  opening: [...PARTS, "lines"],
  openingLines: [...LINES],
  property: ["type", "min", "max", "start"],
  room: ROOM,
  object: OBJECT,
  scenery: ["words", "name", "says", "leads", "id"],
  part: ["words", "name", "says"],
  words: ["nouns", "adj", "g", "pl", "proper"],   // proper: true, a proper name ("Monday"): said as written, with no article
  lock: ["key", "says", "opens", "then"],
  topic: ["words", "says", "about", "label", "open", "opens"],
  ambience: ["lines", "every", "chance", "if"],
  waitFor: ["time", "says", "if"],
  dream: ["says", "picture", "opens", "once"],      // a vision, sleeping here (a room) or in it (an enterable thing): its line, its picture, the ideas it brings up
  // A thing that moves (js/movers.js): one of its `places` ({ at, if?, within? }: `within` for a follower), and its `rounds` (with
  // `every` in seconds: { seconds: [min, max] }); it may have both.
  place: PLACE_FIELDS,
  rounds: ROUNDS_FIELDS,
  roundsEvery: ["seconds"],
  exit: ["to", "if", "closed", "in", "out", "requires", "spends", "lacking", "passage"],   // an exit that is not just a room: { to, if?, closed?, in?, out?, requires?, spends?, lacking?, passage? }
  picture: ["version", "draw", "cycles", "overlays", "loops", "shot"],   // `shot`: the drawing description (English, data only: BRIEF.md §7)
  // Music (MUSIC.md §4): the world's, a room's, an instrument, a line, the theme and its chords. An unknown field inside music
  // only warns (MUSIC.md §2.4), in a world and in what the AI proposes alike.
  music: MUSIC,
  roomMusic: ["tone", "colour", "lines", "melody"],
  instrument: ["kind", "ratio", "bright", "attack", "release"],
  musicLine: ["play", "octave", "notes"],
  melody: ["play", "octave", "notes", "words", "shape", "chords"],
  rule: ["id", "match", "if", "do", "when", "every", "at", "chance", "then", "once", "again"],
  every: ["seconds", "turns"],
  match: ["verb", "obj", "obj2", "dir", "prep", "topic", "text", "scenery", "absent", "question", "value", "blank"],
  puzzle: PUZZLE,
  // A condition the player can be in (js/conditions.js), and its parts: how long it lasts, and each modifier kind.
  condition: CONDITION_FIELDS,
  lasts: ["turns", "seconds"],
  ...MODIFIERS,
  // Each effect, by its main key, with the other fields it may carry. The order is the one effectKind (below) tries the keys in, and
  // the one the engine's table of handlers is read in (js/engine.js, EFFECTS: an effect with two main keys is read as the first here).
  // `add` and `remove` carry the new thing's own fields.
  effect: {
    say: ["say", "img", "style", "arg", "vary", "things", "marked"],
    describe: ["describe"],
    move: ["move", "to"],
    set: ["set", "to", "add"],
    hurt: ["hurt", "says"],
    heal: ["heal", "says"],
    echo: ["echo", "kind"],                                    // a short line about what just happened to you
    start: ["start"], stop: ["stop"],                          // a condition starts, a condition stops (js/conditions.js)
    filter: ["filter"], unfilter: ["unfilter"],                // a picture filter on, off; shake: a jolt, once (js/filters.js)
    travel: ["travel"],
    connect: ["connect", "dir", "to", "passage", ...CONNECT_FIELDS],   // and the exit's own: in, out (marks), if, closed
    disconnect: ["disconnect", "dir"],
    inside: ["inside"], unlock: ["unlock"],
    change: ["change", "optional"],
    draw: ["draw", "add", "remove", "replace", "restyle", "cycles", "overlays", "loops"],
    time: ["time", "weekday"],
    sleep: ["sleep"],                                          // the engine's own sleep, to a time a world's rule says (a `time` form)
    confirm: ["confirm", "yes", "no", "style", "arg"],
    ask: ["ask"],
    end: ["end", "picture"], know: ["know"], hint: ["hint"], restart: ["restart"], session: ["session"],
    bring: ["bring"], consume: ["consume"], useAs: ["useAs"], useHow: ["useHow"], listenFor: ["listenFor"],
    "add room": ["add", "id", ...ROOM],
    "add object": ["add", "id", ...OBJECT],
    "add rule": ["add", "rule", "before"],
    "add change": ["add", "id", "effects"],
    "add puzzle": ["add", "id", ...PUZZLE],
    "add picture": ["add", "id", "picture", "alt"],
    "add music": ["add", ...MUSIC, LEVELS],
    "add word": ["add", "verb", "words", "object", "absent", "speech", "reply"],
    "add condition": ["add", "id", ...CONDITION_FIELDS],
    "remove object": ["remove", "id"],
    "remove rule": ["remove", "id"]
  },
  // The engine's own values that rules read and set by path: "player.health", "time.hour".
  player: ["at", "in", "carrying", "health", "answers", "conditions"],   // answers: what was typed to each `ask`, by its key (player.answers.name); conditions: the ids of those you're in
  game: ["ended", "ending", "entrance", "turn", "clock"],
  time: ["hour", "minute", "second", "day", "weekday"],
  any: ["place", "chain", "person", "holder"]   // read on any thing: where it really is, what it is in, whether it is a person, who has it
};

// The engine's own effects: the standard verbs' (`unlock`, `inside`, `useAs`, `useHow`, `listenFor`), the opening's (`hint`) and the
// session's (`restart`, `session`). They are on the list above because the engine's own rules use them, which never pass
// this check; a world or an AI change set that writes one is refused.
export const ENGINE_ONLY = ["unlock", "inside", "hint", "listenFor", "useAs", "useHow", "restart", "session", "consume", "bring"];
// The engine's own condition operator: `holds` (conditions kept as data hold: the standard WAIT reads a `waitFor.if` with
// it). Only the engine's own rules use it; a world or an AI change set that writes it is refused, like an effect above.
export const ENGINE_ONLY_OPERATORS = ["holds"];
// The engine's own kinds of echo: what you hold, gained and lost (js/engine.js, holdingEchoes; INTERFACE.md §6c). The engine
// writes them whatever moved the thing; a world or an AI change set that writes `{ echo: …, kind: "gained" }` is refused, like
// an effect above (and the engine refuses the effect itself in play).
export const ENGINE_ECHOES = ["gained", "lost"];

// ---- Things you can hold have a sprite ---------------------------------------------------------------------------------
// The ids a value names in a rule's effects: a thing's id, or `$obj` / `$obj2` for what the rule's `match` names; nothing for another `$`.
const idsOf = (match) => (v) => v === "$obj" ? [match?.obj].flat() : v === "$obj2" ? [match?.obj2].flat() : typeof v === "string" && !v.startsWith("$") ? [v] : [];

// Every thing that can end up in the player's hands has a `sprite` (BRIEF.md §5): the inventory shows it, and so does the slot
// before the echo of a thing gained or lost (INTERFACE.md §6c). A thing can end up there when it is `portable: true`, starts
// `at: "player"`, is moved there (`{ move, to: "player" }`, in a world's effects, a rule, a named change, a `confirm`'s
// answers…; `$obj` / `$obj2` as the rule's `match` names them), is made portable or put there with a `set` (`thing.portable`,
// `thing.at`), or lies inside such a thing (carried with it: declared there, or moved or put there). A value that can't be known (`$obj` of a rule that matches any
// thing, a `$` elsewhere) is passed over.
//   things: { id: the thing as declared (an object, or an `add object` effect) }; groups: [{ where, match?, effects }]
//   → [{ id, where, why }]: each thing, once, with the first reason found, in the order of `things` (then of the groups).
export function heldThings(things, groups) {
  const all = { ...things }, found = new Map();
  groups = [...groups];
  // Each effect of a group, at any depth, except inside a rule it adds: that rule is a group of its own (its own match).
  const walk = (node, visit) => {
    if (Array.isArray(node)) return node.forEach(x => walk(x, visit));
    if (!isObject(node)) return;
    if (node.add === "rule" && isObject(node.rule)) {
      if (!groups.some(g => g.rule === node.rule)) groups.push({ where: `rules/${node.rule.id}`, match: node.rule.match, effects: node.rule.do, rule: node.rule });
      return;
    }
    visit(node);
    Object.values(node).forEach(x => walk(x, visit));
  };
  for (let i = 0; i < groups.length; i++) walk(groups[i].effects, (e) => { if (e.add === "object" && typeof e.id === "string" && !(e.id in all)) all[e.id] = e; });
  const mark = (id, where, why) => { if (typeof id === "string" && Object.hasOwn(all, id) && !found.has(id)) found.set(id, { id, where, why }); };
  for (const [id, o] of Object.entries(all)) {
    if (!isObject(o)) continue;
    if (o.portable === true) mark(id, `objects/${id}`, "it is portable");
    else if (o.at === "player") mark(id, `objects/${id}`, "it starts in the player's hands");
  }
  for (const { where, match, effects } of groups) {
    const ids = idsOf(match);
    walk(effects, (e) => {
      if ("move" in e && e.to === "player") for (const id of ids(e.move)) mark(id, where, "it is moved to the player");
      if (typeof e.set === "string") {
        const [, id, prop] = /^(\$?[\w-]+)\.(portable|at)$/.exec(e.set) ?? [];
        if (prop === "portable" && e.to === true) for (const x of ids(id)) mark(x, where, "it is made portable");
        if (prop === "at" && e.to === "player") for (const x of ids(id)) mark(x, where, "it is put in the player's hands");
      }
      if (e.add === "object" && e.at === "player" && typeof e.id === "string") mark(e.id, where, "it is added in the player's hands");
    });
  }
  // What lies inside a thing you can hold is carried with it: declared there, or moved or put there (`{ move, to }`,
  // `set thing.at`) by a group, its destination a thing already found; again until nothing new is found (a bag in a bag).
  for (let more = true; more;) {
    const before = found.size;
    for (const [id, o] of Object.entries(all))
      if (!found.has(id) && isObject(o) && found.has(o.at)) mark(id, `objects/${id}`, `it is inside ${o.at}, which can be carried`);
    for (const { where, match, effects } of groups) {
      const ids = idsOf(match);
      const into = (v) => ids(v).find(x => found.has(x));
      walk(effects, (e) => {
        const bag = "move" in e ? into(e.to) : undefined;
        if (bag) for (const id of ids(e.move)) mark(id, where, `it is moved into ${bag}, which can be carried`);
        const [, id, prop] = typeof e.set === "string" ? /^(\$?[\w-]+)\.(at)$/.exec(e.set) ?? [] : [];
        const put = prop === "at" ? into(e.to) : undefined;
        if (put) for (const x of ids(id)) mark(x, where, `it is put in ${put}, which can be carried`);
      });
    }
    more = found.size > before;
  }
  return Object.keys(all).filter(id => found.has(id)).map(id => found.get(id));
}
// Has it a sprite to show (rows to draw)?
export const hasSprite = (o) => Array.isArray(o?.sprite) && o.sprite.length > 0;
// Has it a portrait (a character's face, shown when it is examined)? Rows of the same form as a sprite's, kept apart: a sprite is for what is carried.
export const hasPortrait = (o) => Array.isArray(o?.portrait) && o.portrait.length > 0;
// What is wrong with a portrait: not 16 rows of 16 characters, hex 0-f and "." only. Empty when it is well formed.
export const portraitFault = (rows) => !Array.isArray(rows) || rows.length !== 16 || rows.some(r => typeof r !== "string" || !/^[0-9a-f.]{16}$/.test(r))
  ? "a portrait is 16 rows of 16 characters, hex 0-f and \".\" for clear" : "";
// The sentence for a thing you can hold that has no sprite (a problem for the checker, a finding for the field check).
export const noSprite = (h) => `${h.id} can end up in the player's hands (${h.why}) but has no sprite: every thing you can carry has one (the inventory and the echoes of what you gain and lose show it)`;

// The engine's own fields of one kind of thing, the ones no world declares: an object's (with where it really is and what
// it is in), a room's (and where it is), or the player's, the game's or the clock's. Any kind at all when it isn't known.
export const ownFields = (kind) => kind === "object" ? [...FIELDS.object, ...FIELDS.any] : kind === "room" ? [...FIELDS.room, "place"]
  : kind ? FIELDS[kind] ?? [] : [...FIELDS.object, ...FIELDS.room, ...FIELDS.any];

// The engine's own numbers keep to their own ranges, whatever sets them (the same clamp a declared property's range gets):
// health, 5 (well) to 0 (the end; INTERFACE.md §6c).
export const RANGES = { "player.health": [0, 5] };

const PROPERTY_TYPES = ["number", "boolean", "string"];

// What the first part of a path names: the player, the game (the state itself), or a thing or a room by its id; undefined if none.
export const ownerOf = (state, id) => id === "player" ? state.player : id === "game" ? state : state.world.objects[id] ?? state.world.rooms[id];

// The main key of an effect, as a name from FIELDS.effect, or null. FIELDS.effect lists them in the order the engine
// reads them (js/engine.js, EFFECTS), so an effect with two main keys is named as the engine reads it.
const KINDS = Object.keys(FIELDS.effect).filter(k => !k.includes(" "));
// Is this effect an `add` or a `remove` of a thing? (A picture edit's own `add` / `remove` are shapes, not things: `draw` goes first.)
export const adding = (e) => typeof e.add === "string" && !("draw" in e);
export const removing = (e) => typeof e.remove === "string" && !("draw" in e);
export function effectKind(e) {
  if (adding(e)) return "add " + e.add;
  if (removing(e)) return "remove " + e.remove;
  return KINDS.find(k => k in e) ?? null;
}

// ---- Conditions -----------------------------------------------------------------------------------------------------
// What is wrong with a list of conditions, if anything (the checker says it for a rule's `if` and a `waitFor.if`; at
// play time a wrong operator would throw). Returns the problems found, as sentences.
const OPERATORS = ["=", "!=", "<", "<=", ">", ">=", "in", "has", "between", "holds"];
export function conditionProblems(conditions) {
  if (conditions === undefined) return [];
  if (!Array.isArray(conditions)) return ["the conditions must be a list: [ { path: value }, … ]"];
  const why = [];
  conditions.forEach((c, i) => {
    if (!c || typeof c !== "object" || Array.isArray(c)) return why.push(`condition ${i + 1} must be { path: value }`);
    for (const [path, want] of Object.entries(c)) {
      if (path === "any") {
        if (!Array.isArray(want) || !want.length) why.push('"any" needs a list of conditions: { any: [ cond, cond, … ] }');
        else want.forEach((x, j) => conditionProblems(Array.isArray(x) ? x : [x]).forEach(w => why.push(`any, item ${j + 1}: ${w}`)));
        continue;
      }
      if (Array.isArray(want)) why.push(`"${path}": a list isn't a value; use { in: [ … ] } for one of several`);
      else if (typeof want === "string" && /^\s*(!=|>=|<=|<|>)/.test(want)) {
        const m = /^\s*(!=|>=|<=|<|>)\s*(.*)$/s.exec(want);
        why.push(`"${path}": the value ${JSON.stringify(want)} starts with an operator, so it would be compared as plain text; write { ${JSON.stringify(path)}: { ${JSON.stringify(m[1])}: ${JSON.stringify(m[2])} } } (BRIEF.md §8, "Conditions in \`if\`")`);
      }
      else if (want !== null && typeof want === "object") for (const [op, v] of Object.entries(want)) {
        const number = (x) => Number.isFinite(x) || (typeof x === "string" && x.startsWith("$"));
        if (!OPERATORS.includes(op)) why.push(`"${path}": unknown operator "${op}" (use ${OPERATORS.join(" ")})`);
        else if (op === "in" && !Array.isArray(v)) why.push(`"${path}": "in" needs a list`);
        else if (op === "between" && !(Array.isArray(v) && v.length === 2 && v.every(number))) why.push(`"${path}": "between" needs [from, to]`);
        else if (op === "holds" && typeof v !== "boolean") why.push(`"${path}": "holds" is true or false`);
      }
    }
  });
  return why;
}

// ---- Closeness -----------------------------------------------------------------------------------------------------
// The edit distance between two words (a letter added, dropped or changed, or two swapped, each count one).
export function distance(a, b) {
  let before = [], row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) next[j] = Math.min(next[j], before[j - 2] + 1);
    }
    before = row; row = next;
  }
  return row[b.length];
}
// " (did you mean x?)" when a word in the list is close to this one, else nothing.
export function suggest(word, list) {
  let best = null, least = Math.max(1, Math.floor(String(word).split(".").pop().length / 4)) + 1;   // how close depends on the name, not its owner
  for (const x of list) { const d = distance(String(word).toLowerCase(), String(x).toLowerCase()); if (d < least) { least = d; best = x; } }
  return best === null ? "" : ` (did you mean ${best}?)`;
}

// ---- The check -----------------------------------------------------------------------------------------------------
const range = (d) => (Number.isFinite(d?.min) && Number.isFinite(d?.max) ? `${d.min}–${d.max}` : Number.isFinite(d?.min) ? `${d.min} or more` : `${d.max} or less`);
const outside = (d, n) => typeof n === "number" && d?.type === "number" && ((Number.isFinite(d.min) && n < d.min) || (Number.isFinite(d.max) && n > d.max));

// Every problem in a change set: unknown fields, properties used without being declared, declarations that don't hold
// together, literal values outside a declared range. `state` is where the set will land: its things and the
// properties already declared. A set may declare properties of its own; those count for everything in it.
// What a thing's fields must be, as tables the check reads in order: [field, is it right?, the finding, refused?]. A finding marked
// refused refuses the set even where the others only warn.
const JSON_ = (v) => JSON.stringify(v);
const plain = (v) => typeof v === "string" && v.trim();
const MARKS = [   // a mark is there or not
  ["droppable", (v) => v === false, (v) => `droppable is false (it can't be dropped or put away), not ${JSON_(v)}; leave it out for a thing that can`],
  ["open", (v) => [true, false, "always"].includes(v), (v) => `open is true, false or "always" (open for good: a boat, a bin, a slot), not ${JSON_(v)}`, true],
];
const EATEN = [
  ["shape", (v) => plain(v) || (Array.isArray(v) && v.length > 0 && v.every(plain)), (v) => `shape is the id of the shape (or a list of ids) its home room's picture draws it with, not ${JSON_(v)}`],
  ["consumable", (v) => v === true, (v) => `consumable is true (it is eaten or drunk, and used up), not ${JSON_(v)}; leave it out for a thing that isn't`],
  ["heals", (v) => Number.isInteger(v) && v >= 1 && v <= 5, (v) => `heals is how much eating or drinking it heals, a whole number from 1 to 5, not ${JSON_(v)}`],
  ["starts", plain, (v) => `starts is the id of the condition eating or drinking it starts, not ${JSON_(v)}`],
  ["stops", plain, (v) => `stops is the id of the condition eating or drinking it ends, not ${JSON_(v)}`],
];
const SOURCE = [   // a thing that comes from someone or something
  ["from", plain, (v) => `from is the id of the person or thing it comes from, not ${JSON_(v)}`],
  ["times", (v) => Number.isInteger(v) && v >= 1, (v) => `times is how many times it comes from its source, a whole number from 1, not ${JSON_(v)}`],
  ["daily", (v) => v === true, (v) => `daily is true (its times count afresh each day), not ${JSON_(v)}; leave it out for a thing that doesn't`],
  ["brought", isLine, (v) => `brought is the line said as it comes (a list: one each time, in order), not ${JSON_(v)}`],
  ["again", isLine, (v) => `again is the line said when it can't come any more, not ${JSON_(v)}`],
  ["already", isLine, (v) => `already is the line said when it is asked for while the last one is still there (in front of you, or yours), not ${JSON_(v)}`],
];

export function checkSet(state, set) {
  const found = [];
  const declared = { ...(state.properties || {}), ...(isObject(set.properties) ? set.properties : {}) };
  const effects = Array.isArray(set.effects) ? set.effects : [];
  const adds = (what) => effects.filter(e => isObject(e) && e.add === what && typeof e.id === "string").map(e => e.id);
  const objects = new Set([...Object.keys(state.world.objects), ...adds("object")]);
  const rooms = new Set([...Object.keys(state.world.rooms), ...adds("room")]);
  const kindOf = (id) => id === "player" || id === "game" || id === "time" ? id : objects.has(id) ? "object" : rooms.has(id) ? "room" : null;
  const note = (piece, text, effect, refuse, warn) => {
    if (!found.some(f => f.piece === piece && f.text === text)) found.push({ piece, text, ...(effect ? { effect } : {}), ...(refuse ? { refuse } : {}), ...(warn ? { warn } : {}) });
  };

  // Ids are unique across rooms, objects and puzzles: one the game has already, or an earlier effect of this set adds, is a finding.
  // Each taken id keeps its kind and its name, so a clash names the other thing too (which room it is), not only the id.
  const taken = new Map([...Object.entries(state.world.rooms).map(([id, r]) => [id, { kind: "room", name: r.name }]),
                         ...Object.entries(state.world.objects).map(([id, o]) => [id, { kind: "object", name: o.name }]),
                         ...Object.keys(state.puzzles || {}).map(id => [id, { kind: "puzzle" }])]);
  const claim = (piece, kind, e) => {
    if (typeof e.id !== "string") return;
    const was = taken.get(e.id);
    if (was) note(piece, `id "${e.id}" is already ${was.kind === "object" ? "an" : "a"} ${was.kind}${typeof was.name === "string" ? ` ("${was.name}")` : ""}: ids are unique across rooms, objects and puzzles; rename one of them`, e);
    else taken.set(e.id, { kind, name: e.name });
  };

  // The fields of one piece: any not in the list (nor a property declared for this very thing) is unknown.
  const fields = (piece, x, list, label, id, effect) => {
    if (!isObject(x)) return;
    for (const k of Object.keys(x)) {
      if (list.includes(k) || (id && declared[id + "." + k])) continue;
      const near = suggest(k, [...list, ...Object.keys(declared).filter(d => id && d.startsWith(id + ".")).map(d => d.slice(id.length + 1))]);
      note(piece, `${label ? label + " has unknown" : "unknown"} field "${k}"${near}`, effect ?? x);
    }
  };

  // Music, the world's (`add music`) or a room's: unknown fields at every level only warn (MUSIC.md §2.4). What its values
  // say is the reader's (js/music.js), which never refuses either: the checker lists its notes.
  const music = (piece, m, list, effect) => {
    if (!isObject(m)) return;
    const only = (x, names, label) => {
      if (!isObject(x)) return;
      for (const k of Object.keys(x)) if (!names.includes(k)) note(piece, `${label} has unknown field "${k}"${suggest(k, names)}`, effect, false, true);
    };
    only(m, list, "music");
    for (const [name, i] of Object.entries(isObject(m.instruments) ? m.instruments : {})) only(i, FIELDS.instrument, `music: instrument ${name}`);
    (Array.isArray(m.lines) ? m.lines : []).forEach((l, i) => only(l, FIELDS.musicLine, `music: line ${i + 1}`));
    only(m.melody, FIELDS.melody, "music: melody");
    if (isObject(m.melody)) only(m.melody.chords, FIELDS.musicLine, "music: melody chords");
  };

  // A property used by a path ("dog.anger", "$obj.talk", "player.health"): the engine's own, or declared.
  const reference = (piece, raw, effect, plain) => {
    if (typeof raw !== "string" || !(plain || raw.startsWith("$"))) return;
    const m = /^(\$?)([A-Za-z_][\w-]*)\.([A-Za-z_][\w-]*)(?:\.[\w$-]+)*$/.exec(raw);
    if (!m) return;
    const [, dollar, id, prop] = m;
    const here = dollar && (id === "obj" || id === "obj2" || id === "in") ? "object" : dollar && id === "here" ? "room" : undefined;
    if (here !== undefined) {                                   // the action's thing, or your room: any id; declared by name
      if (ownFields(here).includes(prop) || Object.keys(declared).some(d => d.endsWith("." + prop))) return;
      return note(piece, `uses "${raw}", whose property "${prop}" isn't declared${suggest(prop, Object.keys(declared).map(d => d.slice(d.indexOf(".") + 1)))}`, effect);
    }
    const kind = kindOf(id);
    if (ownFields(kind).includes(prop) || declared[id + "." + prop]) return;
    // A declared name first; the engine's own fields only for a longer word (a short one is too near a verb: "shut", "shout").
    const near = suggest(id + "." + prop, Object.keys(declared)) || (prop.length >= 5 ? suggest(id + "." + prop, ownFields(kind).map(f => id + "." + f)) : "");
    note(piece, `uses "${id}.${prop}", not declared${near}`, effect);
  };

  // Conditions: [{ path: value }, { path: { operator: value } }]. Paths, and "$" values, are references.
  const conditions = (piece, list, effect) => {
    if (!Array.isArray(list)) return;
    for (const c of list) if (isObject(c)) for (const [path, want] of Object.entries(c)) {
      if (path === "any") {                                     // "or": each item is a condition, or a list of them
        if (Array.isArray(want)) for (const x of want) conditions(piece, Array.isArray(x) ? x : [x], effect);
        continue;
      }
      reference(piece, path, effect, true);
      for (const op of isObject(want) ? Object.keys(want) : []) if (ENGINE_ONLY_OPERATORS.includes(op))
        note(piece, `"${op}" is one of the engine's own operators: only the game itself writes it`, effect, true);
      for (const v of isObject(want) ? Object.values(want).flat() : [want]) reference(piece, v, effect);
    }
  };

  // One effect: its fields, the references in it, a literal outside a declared range, and the things it carries.
  // What `add` brings is named for itself (rooms/cellar, rules/dog-attacks), not for its place in the list.
  const effect = (piece, e) => {
    if (!isObject(e)) return;
    const kind = effectKind(e);
    if (!kind) return note(piece, `an effect with no known kind (${Object.keys(e).join(", ") || "empty"})`, e);
    if (!(kind in FIELDS.effect)) return note(piece, `can't ${kind}`, e);
    if (ENGINE_ONLY.includes(kind)) return note(piece, `"${kind}" is one of the engine's own effects: only the game itself writes it`, e, true);
    if (kind === "echo" && ENGINE_ECHOES.includes(e.kind))
      return note(piece, `an echo of kind "${e.kind}" is the engine's own: the game itself says what you gain and lose`, e, true);
    const named = { "add room": "rooms/", "add object": "objects/", "add rule": "rules/", "add change": "changes/", "add puzzle": "puzzles/", "add word": "words/", "add picture": "pictures/", "add condition": "conditions/" }[kind];
    if (named) piece = named + (kind === "add rule" ? e.rule?.id : kind === "add word" ? e.verb : e.id);
    if (kind === "add music") { const { add, ...own } = e; return music("music", own, [...FIELDS.music, LEVELS], e); }   // the world's music: only warned
    if (["add room", "add object", "add puzzle"].includes(kind)) claim(piece, kind.slice(4), e);
    if (kind === "remove object" && typeof e.id === "string") taken.delete(e.id);
    if (kind === "add room" || kind === "add object") {
      // `scenery` on a thing did nothing, so it is no field (decision 16): refused, a world's too, with what to do instead
      const { scenery: gone, ...own } = kind === "add object" ? e : {};
      if (kind === "add object" && "scenery" in e)
        note(piece, `scenery is not a field of a thing: it does nothing (a thing that isn't portable stays where it is); leave it out`, e, true);
      fields(piece, kind === "add object" ? own : e, FIELDS.effect[kind], "", e.id, e);
      return thing(piece, e, kind === "add room" ? "room" : "object");
    }
    fields(piece, e, FIELDS.effect[kind], named ? "" : kind + " effect", null, e);
    if (kind === "add rule") return rule(piece, e.rule);
    if (kind === "add change") return list(piece, e.effects);
    if (kind === "add picture") return fields(piece, e.picture, FIELDS.picture, "picture", null, e);
    if (kind === "add word" && e.reply !== undefined && !isLine(e.reply)) note(piece, `reply is the line the verb says when no rule answers it (a line, or a list of lines), not ${JSON.stringify(e.reply)}`, e);
    if (kind === "add puzzle" || kind === "add word") return;
    if (kind === "add condition") {                             // its parts, and what its `until` reads
      fields(piece, e.lasts, FIELDS.lasts, "lasts", null, e);
      for (const k of Object.keys(MODIFIERS)) fields(piece, e[k], FIELDS[k], k, null, e);
      fields(piece, e.health?.every, FIELDS.every, "health: every", null, e);
      wellFormed(piece, e.until, e, "until");
      return conditions(piece, e.until, e);
    }
    if (kind === "connect") {                                   // the exit it writes: marks, and a condition as an exit's own
      marks(piece, `connect ${e.dir}`, e.dir, e, e);
      paying(piece, `connect ${e.dir}: `, e, e);
      if (typeof e.if !== "boolean") wellFormed(piece, exitConditions(e) ?? [], e, `connect ${e.dir}: if`);
      conditions(piece, exitConditions(e) ?? [], e);
    }
    if (kind === "set") {
      reference(piece, e.set, e, true);
      const d = declared[e.set];
      if (outside(d, e.to)) note(piece, `sets ${e.set} to ${e.to}, outside ${range(d)}`, e);
      const [owner, word] = String(e.set).split(".");   // a thing's field named like an action is the line it answers with
      if (ANSWERED.includes(word) && !["player", "game"].includes(owner) && e.to !== undefined && typeof e.to !== "string" && !Array.isArray(e.to))
        note(piece, `sets ${e.set} to ${JSON.stringify(e.to)}, but "${word}" is the line ${owner} answers ${word} with: name the property something else`, e);
    }
    if (kind === "confirm") { list(piece, e.yes); list(piece, e.no); }
    for (const [k, v] of Object.entries(e)) if (k !== "set") for (const x of [].concat(v)) reference(piece, x, e);
  };
  const list = (piece, effects) => {
    if (!Array.isArray(effects)) return;
    const track = tracker();
    effects.forEach(e => { effect(piece, e); track(piece, e); });
  };

  // An exit's marks (`in` / `out`), on a room's exit or on a `connect`: true, and on a compass direction, not on the `in` / `out` exit itself.
  const marks = (piece, label, dir, x, effect) => {
    for (const way of ["in", "out"]) {
      if (x[way] === undefined) continue;
      if (x[way] !== true) note(piece, `${label}: ${way} is true (the way ${way}), not ${JSON.stringify(x[way])}`, effect);
      else if (dir === "in" || dir === "out") note(piece, `${label}: already the way ${dir}; ${way}: true is for a compass direction that is also the way ${way}`, effect);
    }
  };

  // Exits made in play: a room's exits as a list of effects leaves them (the room as it is now, or as an earlier `add room`
  // makes it, then each `connect` and `disconnect` in order). Two exits marked the same way are a finding, as in a room's own
  // exits (thing, below). A list is followed on its own: a `connect` in another rule or change is not known to come before or after.
  const tracker = () => {
    const now = {};
    return (piece, e) => {
      if (!isObject(e) || !("connect" in e || "disconnect" in e) || typeof e.dir !== "string") return;
      const id = e.connect || e.disconnect;
      if (typeof id !== "string") return;
      const start = state.world.rooms[id]?.exits ?? effects.find(x => isObject(x) && x.add === "room" && x.id === id)?.exits;
      const exits = now[id] ??= { ...(isObject(start) ? start : {}) };
      exits[e.dir] = e.connect ? connectedExit(e) : false;
      if (e.connect) for (const way of ["in", "out"]) {
        const marked = e[way] === true ? markedDirs(exits, way) : [];
        if (marked.length > 1) note(piece, `connect ${id} ${e.dir}: exits ${marked.join(" and ")} would all be marked ${way}: true; only one exit of a room is the way ${way}`, e);
      }
    };
  };

  // What a thing that comes from somewhere, or a way, wants you to hold (decision 41): `requires` a thing's id, `spends` true, `lacking` a line.
  const paying = (piece, label, x, effect) => {
    if (x.requires !== undefined && !(typeof x.requires === "string" && x.requires.trim()))
      note(piece, `${label}requires is the id of the thing you must hold, not ${JSON.stringify(x.requires)}`, effect);
    if (x.spends !== undefined && x.spends !== true) note(piece, `${label}spends is true (it takes the thing from you) or left out, not ${JSON.stringify(x.spends)}`, effect);
    if (x.lacking !== undefined && !isLine(x.lacking)) note(piece, `${label}lacking is the line said when you don't hold it, not ${JSON.stringify(x.lacking)}`, effect);
    for (const k of ["spends", "lacking"]) if (x[k] !== undefined && x.requires === undefined) note(piece, `${label}${k} goes with requires`, effect);
  };

  // Conditions written wrongly (an operator the engine doesn't know, a list that isn't one): each is a finding, so the set
  // is refused (or the world warned of) and play never meets it. `label` says where they are.
  const wellFormed = (piece, list, effect, label) => { for (const why of conditionProblems(list)) note(piece, `${label}: ${why}`, effect); };

  const rule = (piece, r) => {
    if (!isObject(r)) return;
    fields(piece, r, FIELDS.rule, "", null, r);
    fields(piece, r.match, FIELDS.match, "match", null, r);
    fields(piece, r.every, FIELDS.every, "every", null, r);
    wellFormed(piece, r.if, r, "if");
    conditions(piece, r.if, r);
    if (!Array.isArray(r.do)) note(piece, "do must be a list of effects: [ { say: … }, … ]", r);
    if (r.when !== undefined && !["action", "every", "at"].includes(r.when)) note(piece, `when is action, every or at, not ${JSON.stringify(r.when)}`, r);
    if (r.again !== undefined && !isLine(r.again)) note(piece, `again is the line said once the rule's one time is used (a line, or a list of lines), not ${JSON.stringify(r.again)}`, r);
    else if (r.again !== undefined && (r.once !== true || (r.when ?? "action") !== "action")) note(piece, "again is for a rule of your commands that is once: true (the line it says from the second time)", r);
    if (r.when === "every") {
      const gap = isObject(r.every) ? r.every.seconds ?? r.every.turns : undefined;
      const one = isObject(r.every) && Object.keys(r.every).filter(k => k === "seconds" || k === "turns").length === 1;
      if (!one || !Array.isArray(gap) || gap.length !== 2 || !gap.every(Number.isInteger) || gap[0] > gap[1])
        note(piece, "a timed rule needs every: { seconds: [min, max] } or { turns: [min, max] }, whole numbers, min no more than max", r);
    }
    list(piece, r.do);
  };

  // A field with the wrong shape: each entry of a table (below) read in its order, the finding saying what the field is.
  const shapes = (piece, t, table) => {
    for (const [k, ok, say, refuse] of table) if (t[k] !== undefined && !ok(t[k])) note(piece, say(t[k]), t, refuse);
  };
  // A field that needs another (heals needs consumable): each of `keys` that is there while `has` is false.
  const needing = (piece, t, keys, has, say) => {
    for (const k of keys) if (t[k] !== undefined && !has) note(piece, say(k), t);
  };

  // A room or an object: its fields, and the pieces inside it.
  const thing = (piece, t, kind) => {
    const { id } = t;
    if (kind === "room") {
      for (const s of Array.isArray(t.scenery) ? t.scenery : []) fields(piece, s, FIELDS.scenery, "scenery", null, t);
      fields(piece, t.ambience, FIELDS.ambience, "ambience", null, t);
      wellFormed(piece, t.ambience?.if, t, "ambience: if");
      conditions(piece, t.ambience?.if, t);
      for (const [dir, x] of Object.entries(isObject(t.exits) ? t.exits : {})) {   // an exit with a condition: its fields and references
        if (!isExitObject(x)) continue;
        fields(piece, x, FIELDS.exit, `exit ${dir}`, null, t);
        paying(piece, `exit ${dir}: `, x, t);
        marks(piece, `exit ${dir}`, dir, x, t);                  // marked as the way in / out of a place: true, on a direction
        if (typeof x.if !== "boolean") wellFormed(piece, exitConditions(x) ?? [], t, `exit ${dir}: if`);
        conditions(piece, exitConditions(x) ?? [], t);
      }
      for (const way of ["in", "out"]) {                          // one exit per room is the way in, one the way out
        const marked = markedDirs(isObject(t.exits) ? t.exits : {}, way);
        if (marked.length > 1) note(piece, `exits ${marked.join(" and ")} are all marked ${way}: true; only one exit of a room is the way ${way}`, t);
      }
      if (isObject(t.picture)) fields(piece, t.picture, FIELDS.picture, "picture", null, t);
      music(piece, t.music, FIELDS.roomMusic, t);                // a room's own music: only warned
    } else {
      fields(piece, t.words, FIELDS.words, "words", null, t);
      // `proper` and `open` take only their values: anything else is refused, a world's set too (the one check for them)
      if (isObject(t.words) && t.words.proper !== undefined && t.words.proper !== true)   // the mark is there or not: only true
        note(piece, `words: proper is true (a proper name, said as written with no article), not ${JSON.stringify(t.words.proper)}`, t, true);
      shapes(piece, t, MARKS);
      fields(piece, t.lock, FIELDS.lock, "lock", null, t);
      if (t.door !== undefined && (typeof t.door !== "string" || !DIRECTIONS.includes(t.door)))   // a door is on a way: a direction
        note(piece, `door is the direction the door is on (${DIRECTIONS.join(" ")}), not ${JSON.stringify(t.door)}`, t);
      if (t.door !== undefined && t.leads !== undefined)         // a thing is a door or a way you climb or walk into, not both
        note(piece, `a thing has door (a door, gate or hatch on that way) or leads (stairs, a shop front, a cave), not both`, t);
      if (t.shut !== undefined && (typeof t.shut !== "string" || !t.shut.trim()))   // a line, said when you go that way while the door is locked
        note(piece, `shut is the line said when you go that way while the door is locked, not ${JSON.stringify(t.shut)}`, t);
      else if (t.shut !== undefined && t.door === undefined && t.leads === undefined)
        note(piece, `shut is for a door (or a thing that leads): the line said when you go that way while it is locked`, t);
      if (t.pair !== undefined && (typeof t.pair !== "string" || !t.pair.trim()))
        note(piece, `pair is the id of the door on the other side, not ${JSON.stringify(t.pair)}`, t);
      else if (t.pair !== undefined && t.door === undefined)
        note(piece, `pair links two doors: this thing needs a door (the direction it is on)`, t);
      shapes(piece, t, EATEN);
      needing(piece, t, ["heals", "starts", "stops"], t.consumable === true, (k) => `${k} is what a consumable thing does when it is eaten or drunk: it needs consumable: true`);
      shapes(piece, t, SOURCE);
      needing(piece, t, ["brought", "again", "already", "times", "daily", "if"], t.from !== undefined, (k) => `${k} is for a thing that comes from someone or something: it needs from`);
      if (t.if !== undefined) { wellFormed(piece, t.if, t, "if"); conditions(piece, t.if, t); }
      paying(piece, "", t, t);
      if (t.requires !== undefined && t.from === undefined) note(piece, `requires is for a thing that comes from someone or something (it needs from), or for a way`, t);
      for (const p of Array.isArray(t.parts) ? t.parts : []) fields(piece, p, FIELDS.part, "part", null, t);
      // A thing that moves (js/movers.js): its facts' shape, each place's fields and conditions, its round's fields.
      for (const why of shapeProblems(t)) note(piece, why, t);
      (Array.isArray(t.places) ? t.places : []).forEach((p, i) => {
        fields(piece, p, FIELDS.place, `places ${i + 1}`, null, t);
        if (isObject(p) && Array.isArray(p.if)) { wellFormed(piece, p.if, t, `places ${i + 1}: if`); conditions(piece, p.if, t); }
      });
      fields(piece, t.rounds, FIELDS.rounds, "rounds", null, t);
      fields(piece, t.rounds?.every, FIELDS.roundsEvery, "rounds: every", null, t);
      for (const [key, topic] of Object.entries(isObject(t.topics) ? t.topics : {})) if (isObject(topic)) fields(piece, topic, FIELDS.topic, `topic "${key}"`, null, t);
    }
    fields(piece, t.waitFor, FIELDS.waitFor, "waitFor", null, t);
    // A vision (`dream`, ARCHITECTURE.md §5 "Sleep"): its line, and what else it may carry (its picture is the checker's: js/check.js)
    if (t.dream !== undefined) {
      if (!isObject(t.dream) || !isLine(t.dream.says)) note(piece, `dream is a vision, { says: its line, picture?, opens?, once? }, not ${JSON.stringify(t.dream)}`, t);
      else {
        fields(piece, t.dream, FIELDS.dream, "dream", null, t);
        if (t.dream.picture !== undefined && !(typeof t.dream.picture === "string" && t.dream.picture.trim())) note(piece, `dream: picture is the id of a picture the world adds (add picture), not ${JSON.stringify(t.dream.picture)}`, t);
        if (t.dream.once !== undefined && t.dream.once !== true) note(piece, `dream: once is true (it comes only the first time), not ${JSON.stringify(t.dream.once)}; leave it out for one that always comes`, t);
      }
      if (kind === "object" && t.enterable == null) note(piece, "dream is a vision for sleeping in or on a thing: it needs enterable (\"in\" or \"on\")", t);
    }
    wellFormed(piece, t.waitFor?.if, t, "waitFor: if");
    conditions(piece, t.waitFor?.if, t);
    for (const [k, v] of Object.entries(t)) {                     // a declared property carried inline: its value in range
      const d = declared[id + "." + k];
      if (d && outside(d, v)) note(piece, `${k} is ${v}, outside ${range(d)} (${id}.${k})`, t);
    }
  };

  // The declarations: a name like "dog.anger" for a thing that exists, a type, and a start and limits that hold together.
  const declare = (key, d) => {
    const piece = "properties", e = { [key]: d };
    const m = /^([^.\s]+)\.([^.\s]+)$/.exec(key);
    if (!m) return note(piece, `"${key}" isn't named like thing.property (dog.anger)`, e);
    const [, id, prop] = m, kind = kindOf(id);
    if (!kind) note(piece, `${key}: there is no thing or room called "${id}"${suggest(id, [...objects, ...rooms, "player", "game"])}`, e);
    else if (ownFields(kind).includes(prop)) return note(piece, `${key}: "${prop}" is one of the engine's own fields`, e);
    if (state.properties?.[key]) return note(piece, `${key} is already declared`, e);
    if (!isObject(d)) return note(piece, `${key} must be { type, min?, max?, start? }`, e);
    fields(piece, d, FIELDS.property, key, null, e);
    if (!PROPERTY_TYPES.includes(d.type)) return note(piece, `${key}: type must be ${PROPERTY_TYPES.join(", ")}`, e);
    for (const k of ["min", "max"]) if (k in d && (d.type !== "number" || !Number.isFinite(d[k]))) note(piece, `${key}: ${k} is for numbers only, and must be a number`, e);
    if (Number.isFinite(d.min) && Number.isFinite(d.max) && d.min > d.max) note(piece, `${key}: min ${d.min} is above max ${d.max}`, e);
    if ("start" in d && typeof d.start !== d.type) note(piece, `${key}: start ${JSON.stringify(d.start)} isn't a ${d.type}`, e);
    else if (outside(d, d.start)) note(piece, `${key} start ${d.start} is outside ${range(d)}`, e);
  };

  // Every thing this set lets into the player's hands has a sprite: the things it adds, and those it moves there (heldThings).
  const added = Object.fromEntries(effects.filter(e => isObject(e) && e.add === "object" && typeof e.id === "string").map(e => [e.id, e]));
  const within = { ...state.world.objects, ...added };
  for (const h of heldThings(within, [{ where: "effects", effects }])) {   // (each rule it adds is read on its own, with its match)
    if (!(h.id in added) && h.where.startsWith("objects/")) continue;   // already the game's: not this set's doing
    const o = state.world.objects[h.id] ?? within[h.id];
    if (!hasSprite(added[h.id] ?? o)) note(h.where, noSprite(h), added[h.id] ?? null);
  }

  fields("change set", set, FIELDS.changeSet, "", null, set);
  if (set.properties !== undefined && !isObject(set.properties)) note("properties", "must be { \"thing.property\": { type, … } }", set);
  else for (const [key, d] of Object.entries(set.properties || {})) declare(key, d);
  if (isObject(set.opening)) {
    fields("opening", set.opening, FIELDS.opening, "", null, set.opening);
    fields("opening", set.opening.lines, FIELDS.openingLines, "lines", null, set.opening);
  }
  const track = tracker();
  effects.forEach((e, i) => {
    const piece = `effects/${i + 1}${isObject(e) && effectKind(e) ? " (" + effectKind(e) + ")" : ""}`;
    effect(piece, e);
    track(piece, e);
  });
  return found;
}
