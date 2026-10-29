// Fields: the one list of the fields the engine knows, and the check that a change set (a world, or what the AI
// proposes in play) uses only those, plus the properties it declares (ARCHITECTURE.md §3, "Fields and properties").
// Pure: reads the state and the set, never changes either. The engine (js/engine.js) decides what to do with the
// findings: a world's are warnings (it still loads), an AI change set's are reasons to refuse it.
//
//   checkSet(state, set) → [{ piece, text, effect? }]      "rules/dog-attacks", `uses "dog.angr", not declared (…)`

import { ACTIONS } from "./actions.js";
import { ANSWERED } from "./verbs.js";
import { PARTS, LINES } from "./opening.js";
import { isExitObject, exitConditions, markedDirs, connectedExit, CONNECT_FIELDS } from "./exits.js";

// ---- The list ------------------------------------------------------------------------------------------------------
// What each piece of a world may have. A thing may also answer a verb (a field named like the action: `take`, `talk`),
// and anything else a world keeps on a thing must be declared in `properties` ("dog.anger").
const ROOM = ["name", "area", "at", "describe", "exits", "alt", "overlayAlt", "scenery", "mentions", "picture", "ambience", "waitFor", "placeholder", ...ANSWERED];
const OBJECT = ["at", "portable", "container", "open", "locked", "scenery", "name", "note", "actions", "heldActions", "examine",
  "here", "words", "sprite", "floorSprite", "img", "alt", "use", "leads", "lock", "enterable", "parts", "mentions", "topics",
  "unnoticed", "opens", "waitFor", ...ANSWERED];
const PUZZLE = ["where", "needs", "solve", "gives", "reaches", "ending", "clues", "hints", "time"];

export const FIELDS = {
  changeSet: ["because", "facts", "effects", "opening", "properties"],
  opening: [...PARTS, "lines"],
  openingLines: [...LINES],
  property: ["type", "min", "max", "start"],
  room: ROOM,
  object: OBJECT,
  scenery: ["words", "name", "says", "leads", "id"],
  part: ["words", "name", "says"],
  words: ["nouns", "adj", "g", "pl"],
  lock: ["key", "says", "opens", "then"],
  topic: ["words", "says", "about", "label", "open", "opens"],
  ambience: ["lines", "every", "chance", "if"],
  waitFor: ["time", "says", "if"],
  exit: ["to", "if", "closed", "in", "out"],   // an exit that is not just a room: { to, if?, closed?, in?, out? }
  picture: ["version", "draw", "cycles", "overlays"],
  rule: ["id", "match", "if", "do", "when", "every", "at", "chance", "then", "once"],
  every: ["seconds", "turns"],
  match: ["verb", "obj", "obj2", "dir", "prep", "topic", "text", "scenery", "absent", "question", "value", "blank"],
  puzzle: PUZZLE,
  // Each effect, by its main key, with the other fields it may carry. `add` and `remove` carry the new thing's own fields.
  effect: {
    say: ["say", "img", "style", "arg", "vary", "things"],
    describe: ["describe"],
    move: ["move", "to"],
    set: ["set", "to", "add"],
    hurt: ["hurt", "says"],
    heal: ["heal", "says"],
    echo: ["echo", "kind"],                                    // a short line about what just happened to you
    travel: ["travel"],
    connect: ["connect", "dir", "to", "passage", ...CONNECT_FIELDS],   // and the exit's own: in, out (marks), if, closed
    disconnect: ["disconnect", "dir"],
    unlock: ["unlock"],
    change: ["change", "optional"],
    draw: ["draw", "add", "remove", "replace", "restyle", "cycles", "overlays"],
    time: ["time", "weekday"],
    confirm: ["confirm", "yes", "no", "style", "arg"],
    ask: ["ask", "blankOk"],
    end: ["end", "picture"], know: ["know"], hint: ["hint"], restart: ["restart"], session: ["session"],
    useAs: ["useAs"], useHow: ["useHow"], listenFor: ["listenFor"],
    "add room": ["add", "id", ...ROOM],
    "add object": ["add", "id", ...OBJECT],
    "add rule": ["add", "rule", "before"],
    "add change": ["add", "id", "effects"],
    "add puzzle": ["add", "id", ...PUZZLE],
    "add picture": ["add", "id", "picture", "alt"],
    "add word": ["add", "verb", "words", "object", "absent", "speech"],
    "remove object": ["remove", "id"],
    "remove rule": ["remove", "id"]
  },
  // The engine's own values that rules read and set by path: "player.health", "time.hour".
  player: ["at", "in", "carrying", "health"],
  game: ["ended", "ending", "entrance", "turn", "clock"],
  time: ["hour", "minute", "second", "day", "weekday"],
  any: ["place", "chain"]                  // read on any thing: where it really is, and what it is in
};

// The engine's own numbers keep to their own ranges, whatever sets them (the same clamp a declared property's range gets).
// The engine's own numbers (INTERFACE.md §6c): health, 5 (well) to 0 (the end).
export const RANGES = { "player.health": [0, 5] };

export const PROPERTY_TYPES = ["number", "boolean", "string"];

// ---- Words from the state in a text --------------------------------------------------------------------------------
// A text can hold the world's own words, [time] [day] [weekday] [way] (js/narrator.js), and any declared property
// written [thing.property]: [player.name], [bell.rung], [sky.state]. Numbers and strings are shown as they are; a
// boolean, or a property nothing has set yet (and with no `start`), is shown as nothing. A name that isn't declared is
// left as written, so it is easy to spot (and the checker warns of it).
export const TEXT_WORDS = ["time", "day", "weekday", "way"];
export const PROPERTY_WORD = /\[([A-Za-z_][\w-]*)\.([A-Za-z_][\w-]*)\]/g;

// What a declared property holds now, as a text: its number or string, "" for anything else; undefined if it isn't declared.
// The same places a rule reads it from: the player, the game, a thing, a room.
export function propertyText(state, id, prop) {
  const d = state.properties?.[id + "." + prop];
  if (!d) return undefined;
  const o = id === "player" ? state.player : id === "game" ? state : state.world.objects[id] ?? state.world.rooms[id];
  const v = o?.[prop] ?? d.start ?? null;
  return typeof v === "number" || typeof v === "string" ? String(v) : "";
}

// The properties a text names, as they are now: { "player.name": "Diego" } (declared ones only). The engine keeps this
// with a line it says, as it keeps the time ([time] in it), so the line shows what was true when it was said.
export function propertyWords(state, text) {
  const out = {};
  if (typeof text !== "string" || !text.includes("[")) return out;
  for (const [, id, prop] of text.matchAll(PROPERTY_WORD)) {
    const v = propertyText(state, id, prop);
    if (v !== undefined) out[id + "." + prop] = v;
  }
  return out;
}

// The main key of an effect (the order the engine reads them in), as a name from FIELDS.effect, or null.
const KINDS = ["say", "describe", "move", "set", "hurt", "heal", "echo", "travel", "connect", "disconnect", "unlock", "change", "draw", "time",
  "confirm", "ask", "end", "know", "hint", "restart", "session", "useAs", "useHow", "listenFor"];
export function effectKind(e) {
  if (typeof e.add === "string" && !("draw" in e)) return "add " + e.add;
  if (typeof e.remove === "string" && !("draw" in e)) return "remove " + e.remove;
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
const isObject = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
const range = (d) => (Number.isFinite(d?.min) && Number.isFinite(d?.max) ? `${d.min}–${d.max}` : Number.isFinite(d?.min) ? `${d.min} or more` : `${d.max} or less`);
const outside = (d, n) => typeof n === "number" && d?.type === "number" && ((Number.isFinite(d.min) && n < d.min) || (Number.isFinite(d.max) && n > d.max));

// Every problem in a change set: unknown fields, properties used without being declared, declarations that don't hold
// together, literal values outside a declared range. `state` is where the set will land: its things and the
// properties already declared. A set may declare properties of its own; those count for everything in it.
export function checkSet(state, set) {
  const found = [];
  const declared = { ...(state.properties || {}), ...(isObject(set.properties) ? set.properties : {}) };
  const effects = Array.isArray(set.effects) ? set.effects : [];
  const adds = (what) => effects.filter(e => isObject(e) && e.add === what && typeof e.id === "string").map(e => e.id);
  const objects = new Set([...Object.keys(state.world.objects), ...adds("object")]);
  const rooms = new Set([...Object.keys(state.world.rooms), ...adds("room")]);
  const kindOf = (id) => id === "player" || id === "game" || id === "time" ? id : objects.has(id) ? "object" : rooms.has(id) ? "room" : null;
  const own = (kind) => kind === "object" ? [...FIELDS.object, ...FIELDS.any] : kind === "room" ? [...FIELDS.room, "place"]
    : kind ? FIELDS[kind] : [...FIELDS.object, ...FIELDS.room, ...FIELDS.any];
  const note = (piece, text, effect) => { if (!found.some(f => f.piece === piece && f.text === text)) found.push({ piece, text, ...(effect ? { effect } : {}) }); };

  // Ids are unique across rooms, objects and puzzles: one the game has already, or an earlier effect of this set adds, is a finding.
  const taken = new Map([...Object.keys(state.world.rooms).map(id => [id, "room"]), ...Object.keys(state.world.objects).map(id => [id, "object"]),
                         ...Object.keys(state.puzzles || {}).map(id => [id, "puzzle"])]);
  const claim = (piece, kind, e) => {
    if (typeof e.id !== "string") return;
    const was = taken.get(e.id);
    if (was) note(piece, `id "${e.id}" is already ${was === "object" ? "an" : "a"} ${was}: ids are unique across rooms, objects and puzzles`, e);
    else taken.set(e.id, kind);
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

  // A property used by a path ("dog.anger", "$obj.talk", "player.health"): the engine's own, or declared.
  const reference = (piece, raw, effect, plain) => {
    if (typeof raw !== "string" || !(plain || raw.startsWith("$"))) return;
    const m = /^(\$?)([A-Za-z_][\w-]*)\.([A-Za-z_][\w-]*)(?:\.[\w$-]+)*$/.exec(raw);
    if (!m) return;
    const [, dollar, id, prop] = m;
    const here = dollar && (id === "obj" || id === "obj2" || id === "in") ? "object" : dollar && id === "here" ? "room" : undefined;
    if (here !== undefined) {                                   // the action's thing, or your room: any id; declared by name
      if (own(here).includes(prop) || Object.keys(declared).some(d => d.endsWith("." + prop))) return;
      return note(piece, `uses "${raw}", whose property "${prop}" isn't declared${suggest(prop, Object.keys(declared).map(d => d.slice(d.indexOf(".") + 1)))}`, effect);
    }
    const kind = kindOf(id);
    if (own(kind).includes(prop) || declared[id + "." + prop]) return;
    // A declared name first; the engine's own fields only for a longer word (a short one is too near a verb: "shut", "shout").
    const near = suggest(id + "." + prop, Object.keys(declared)) || (prop.length >= 5 ? suggest(id + "." + prop, own(kind).map(f => id + "." + f)) : "");
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
    const named = { "add room": "rooms/", "add object": "objects/", "add rule": "rules/", "add change": "changes/", "add puzzle": "puzzles/", "add word": "words/", "add picture": "pictures/" }[kind];
    if (named) piece = named + (kind === "add rule" ? e.rule?.id : kind === "add word" ? e.verb : e.id);
    if (["add room", "add object", "add puzzle"].includes(kind)) claim(piece, kind.slice(4), e);
    if (kind === "remove object" && typeof e.id === "string") taken.delete(e.id);
    if (kind === "add room" || kind === "add object") {
      fields(piece, e, FIELDS.effect[kind], "", e.id, e);
      return thing(piece, e, kind === "add room" ? "room" : "object");
    }
    fields(piece, e, FIELDS.effect[kind], named ? "" : kind + " effect", null, e);
    if (kind === "add rule") return rule(piece, e.rule);
    if (kind === "add change") return list(piece, e.effects);
    if (kind === "add picture") return fields(piece, e.picture, FIELDS.picture, "picture", null, e);
    if (kind === "add puzzle" || kind === "add word") return;
    if (kind === "connect") {                                   // the exit it writes: marks, and a condition as an exit's own
      marks(piece, `connect ${e.dir}`, e.dir, e, e);
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
    if (r.when === "every") {
      const gap = isObject(r.every) ? r.every.seconds ?? r.every.turns : undefined;
      const one = isObject(r.every) && Object.keys(r.every).filter(k => k === "seconds" || k === "turns").length === 1;
      if (!one || !Array.isArray(gap) || gap.length !== 2 || !gap.every(Number.isInteger) || gap[0] > gap[1])
        note(piece, "a timed rule needs every: { seconds: [min, max] } or { turns: [min, max] }, whole numbers, min no more than max", r);
    }
    list(piece, r.do);
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
        marks(piece, `exit ${dir}`, dir, x, t);                  // marked as the way in / out of a place: true, on a direction
        if (typeof x.if !== "boolean") wellFormed(piece, exitConditions(x) ?? [], t, `exit ${dir}: if`);
        conditions(piece, exitConditions(x) ?? [], t);
      }
      for (const way of ["in", "out"]) {                          // one exit per room is the way in, one the way out
        const marked = markedDirs(isObject(t.exits) ? t.exits : {}, way);
        if (marked.length > 1) note(piece, `exits ${marked.join(" and ")} are all marked ${way}: true; only one exit of a room is the way ${way}`, t);
      }
      if (isObject(t.picture)) fields(piece, t.picture, FIELDS.picture, "picture", null, t);
    } else {
      fields(piece, t.words, FIELDS.words, "words", null, t);
      fields(piece, t.lock, FIELDS.lock, "lock", null, t);
      for (const p of Array.isArray(t.parts) ? t.parts : []) fields(piece, p, FIELDS.part, "part", null, t);
      for (const [key, topic] of Object.entries(isObject(t.topics) ? t.topics : {})) if (isObject(topic)) fields(piece, topic, FIELDS.topic, `topic "${key}"`, null, t);
    }
    fields(piece, t.waitFor, FIELDS.waitFor, "waitFor", null, t);
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
    else if (own(kind).includes(prop)) return note(piece, `${key}: "${prop}" is one of the engine's own fields`, e);
    if (state.properties?.[key]) return note(piece, `${key} is already declared`, e);
    if (!isObject(d)) return note(piece, `${key} must be { type, min?, max?, start? }`, e);
    fields(piece, d, FIELDS.property, key, null, e);
    if (!PROPERTY_TYPES.includes(d.type)) return note(piece, `${key}: type must be ${PROPERTY_TYPES.join(", ")}`, e);
    for (const k of ["min", "max"]) if (k in d && (d.type !== "number" || !Number.isFinite(d[k]))) note(piece, `${key}: ${k} is for numbers only, and must be a number`, e);
    if (Number.isFinite(d.min) && Number.isFinite(d.max) && d.min > d.max) note(piece, `${key}: min ${d.min} is above max ${d.max}`, e);
    if ("start" in d && typeof d.start !== d.type) note(piece, `${key}: start ${JSON.stringify(d.start)} isn't a ${d.type}`, e);
    else if (outside(d, d.start)) note(piece, `${key} start ${d.start} is outside ${range(d)}`, e);
  };

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
