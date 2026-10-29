// Engine: the only code that changes the game. Takes a state and an action (or a tick) and returns a new state
// plus the effects it applied (ARCHITECTURE.md §4–5). Pure: no page, no timers, no clock of its own —
// the game time `at` comes in with the input. The state passed in is never changed.

import { random, between } from "./random.js";
import standardVerbs from "./verbs.js";
import { DIRECTIONS, STEP, roomAt, isPassage } from "./space.js";
import { isExitObject, exitTo, exitConditions, wayFor, connectedExit } from "./exits.js";
import { parseShape, parseShapes } from "./picture.js";
import { worldTime, parts, moveTo, schedule as scheduleOf, occursBetween, nextAfter, WEEKDAYS } from "./time.js";
import * as opening from "./opening.js";
import { translate as translateUse, placeOf, chainOf, shut } from "./use.js";
import { checkSet, propertyWords, RANGES } from "./fields.js";

// Game ms of quiet after each command of the player: room ambience stays silent until it has passed. The world's own
// rules (events, warnings, consequences) and scheduled rules ignore it.
export const QUIET_AFTER_COMMAND = 20000;
// Game ms between an automatic line (timed rule or ambience) and the next ambience line. Like the quiet, it holds
// ambience only: the world's own rules are never delayed (one per tick still orders them).
export const QUIET_AFTER_LINE = 10000;
// When ambience may speak again: after the later of the quiet after a command and the gap after a line.
const quietUntil = (g) => Math.max(g.lastCommand == null ? 0 : g.lastCommand + QUIET_AFTER_COMMAND,
                                   g.lastLine == null ? 0 : g.lastLine + QUIET_AFTER_LINE);
const BEGIN_AGAIN = [{ say: "@againYes", style: "sys" }, { restart: true }];

// Defaults for the core object flags: a missing flag counts as this (ARCHITECTURE.md §3).
const DEFAULTS = { portable: false, scenery: false, container: false, open: false, locked: false };

// One step of the game. input: an action ({ verb, obj, dir, … }) or { tick: true }, both with `at` (game ms).
// Returns { next, applied, refused }: the new state, the effects applied (for the narrator) and any refused.
export function step(state, input) {
  const g = structuredClone(state);
  const out = { applied: [], refused: [] };
  const { at = g.clock, tick, ...action } = input;
  g.clock = at;
  const startedIn = g.player.at;
  out.trusted = true;
  let asked = null;                                             // the question this input may be answering
  if (!tick) {
    g.turn++;
    g.lastCommand = at;                                         // the quiet after a command counts from here
    asked = g.pending.question;
    g.pending.question = null;     // an answer uses up the question; any other command drops it (PARSER.md layer 0)
    if (action.verb === "go" && action.dir === "out" && g.player.in) {   // OUT from inside a thing: get out of it, as "get up" does
      action.verb = "exit"; delete action.dir;
    } else if (action.verb === "go") {
      // IN / OUT in a room with no such exit of its own go by the exit marked `in: true` / `out: true`, as if that
      // direction had been typed (so a rule on "go e" fires, and the compass shows only E).
      if (action.dir === "in" || action.dir === "out") action.dir = wayFor(g.world.rooms[g.player.at]?.exits, action.dir) ?? action.dir;
      if (g.player.in) {                                         // moving while in or on something: out first
        apply(g, { say: "@outFirst", arg: "$in.name" }, action, out, "outFirst");
        g.player.in = null;
      }
    }
    if (action.obj) g.lastObj = action.obj;                      // what "it" means next time
    // Talking to someone: they're who "ask about…" goes to next; a question asked is remembered for this visit (it's
    // no longer offered after they answer, until you come back to the room).
    if (["talk", "ask", "say"].includes(action.verb) && g.world.objects[action.obj]?.topics) g.talkingTo = action.obj;
    if (action.verb === "ask" && action.topic && action.topic !== "?" && action.obj)
      g.asked[action.obj] = [...new Set([...(g.asked[action.obj] || []), action.topic])];
    for (const id of [action.obj2, action.obj]) if (id) {        // and the things mentioned lately, newest first,
      g.mentioned = [id, ...(g.mentioned || []).filter(x => x !== id)].slice(0, 6);   // for "lo" / "la" / "them"
    }
    runAction(g, action, out, asked);
  }
  if (g.player.at !== startedIn) g.asked = {};                 // a new room: conversations start afresh
  const n0 = out.applied.length;
  runScheduled(g, out);                                         // what's scheduled up to the world's time now
  runTimed(g, at, out, out.applied.slice(n0).some(e => "say" in e));   // timed rules that are now due (a scheduled line holds ambience back)
  // An echo (INTERFACE.md §6c) is the last word on what just happened to you: after the story lines of your command, and
  // after those of what the world did on its own, however the rule ordered its effects.
  // What the world did on its own (scheduled and timed rules) is marked `aside`: shown set apart, like a stage direction
  // (ui/log.css), even when it falls due during your command, and its echoes with it.
  out.applied = [...echoesLast(out.applied.slice(0, n0)), ...echoesLast(out.applied.slice(n0)).map(e => ({ ...e, aside: true }))];
  seeHere(g);                                                   // what's in the room has now been seen
  if (g.player.health <= 0 && !g.ended) {                        // out of health: the story ends, whatever the world
    if (!out.applied.some(e => e.say === "@hurt.dead"))          // (its line was said when the health went)
      apply(g, { say: "@hurt.dead", vary: true }, {}, out, "died");
    apply(g, { end: true, ...(g.pictures.died ? { picture: "died" } : {}) }, {}, out, "died");   // with the world's `died` picture, if it has one
  }
  return { next: g, ...out };
}

// The same effects with the echoes moved after everything else, each group in its own order.
const echoesLast = (list) => [...list.filter(e => !("echo" in e)), ...list.filter(e => "echo" in e)];

// Ask the player something for the controller (undo, load…): a `confirm` effect applied now, outside any turn.
// Returns { next, applied, refused }, like step().
export function ask(state, effect) {
  const g = structuredClone(state);
  const out = { applied: [], refused: [], trusted: true };
  apply(g, effect, {}, out, "ask");
  return { next: g, ...out };
}

// Apply a change set (ARCHITECTURE.md §6): { because?, effects: [...], facts?: [...], opening?: {...} }. All or
// nothing: if any effect is refused, the state comes back unchanged with the reasons. Used for a world, with its
// opening, and, later, for the director's proposals. A world's `opening` is declared beside its effects and built
// once they are all applied (js/opening.js); `protect: false` leaves it open to change (only for tests).
// `properties` declares the set's own properties (ARCHITECTURE.md §3, "Fields and properties"). `fields` says what to do
// about a field the engine doesn't know or a property that isn't declared (js/fields.js): "warn" (a world: it still
// loads, the findings come back as `warnings` and are kept in state.warnings) or "refuse" (the AI's: the set is
// refused with the reasons). Without it the set isn't checked (the engine's and the tests' own sets).
export function applyChangeSet(state, set, { protect = true, fields = null } = {}) {
  const found = fields ? checkSet(state, set) : [];
  if (fields === "refuse" && found.length)
    return { next: state, applied: [], refused: found.map(f => ({ effect: f.effect ?? null, reason: `${f.piece}: ${f.text}` })) };
  const g = structuredClone(state);
  if (set.properties && typeof set.properties === "object") g.properties = { ...g.properties, ...structuredClone(set.properties) };
  const out = { applied: [], refused: [], trusted: false };     // a world's changes never touch the opening
  (set.effects || []).forEach((effect, i) => apply(g, effect, {}, out, "changeset#" + i));
  if (set.opening && !out.refused.length) buildOpening(g, set.opening, out, protect);
  if (out.refused.length) return { next: state, applied: [], refused: out.refused };
  const warnings = fields === "warn" ? found.map(f => `${f.piece}: ${f.text}`) : [];
  if (warnings.length) g.warnings = [...(g.warnings || []), ...warnings];
  return { next: g, ...out, warnings };
}

// A change set the AI proposes in play: refused whole if it has a field the engine doesn't know or uses a property
// that isn't declared (a set may declare a new one itself, in its `properties`).
export const applyProposal = (state, set) => applyChangeSet(state, set, { fields: "refuse" });

// Build a world's opening from its declaration: the player starts in its room carrying the intro, the hints thing
// and the way on get their mechanics (rules and puzzles, js/opening.js) and the room and everything in it become
// `fixed`: no later effect from a world may change, move, draw, connect, remove or add to them.
function buildOpening(g, d, out, protect) {
  const refuse = (reason) => out.refused.push({ effect: { opening: d?.room ?? null }, reason });
  if (g.opening) return refuse("the world already has an opening");
  const why = opening.problems(g, d);
  if (why.length) return why.forEach(refuse);
  const steps = opening.puzzles(g, d);
  if (Object.keys(steps).some(id => idKind(g, id))) return refuse("an opening puzzle's id is taken");
  g.opening = structuredClone(d);
  g.player.at = d.room;
  g.player.in = null;
  g.seen.visited = [d.room];
  for (const [id, o] of Object.entries(g.world.objects))          // what you carry from the start (the intro)
    if (o.at === "player" && !g.player.carrying.includes(id)) { g.player.carrying.push(id); g.seen.held.push(id); }
  g.rules.unshift(...opening.rules(g, d).map(r => ({ ...r, fixed: protect })));
  g.puzzles = { ...steps, ...g.puzzles };                         // the opening's own steps come first
  const ambience = g.rules.find(r => r.id === "ambience_" + d.room);   // the room's small life is the opening's own
  if (ambience) ambience.fixed = protect;
  if (!protect) return out.applied.push({ opening: d.room });
  const inRoom = (id) => placeOf(g, id) === d.room;
  g.world.rooms[d.room].fixed = true;
  for (const id of Object.keys(g.world.objects))
    if (opening.THINGS.some(k => d[k] === id) || inRoom(id)) g.world.objects[id].fixed = true;
  out.applied.push({ opening: d.room });
}

// When the next timed or scheduled rule is due, in game ms (null if none is waiting). The controller sets one
// timer for it.
export function nextDue(state) {
  if (state.ended) return null;                                              // after the end the world is silent
  let due = null;
  const shift = state.time?.shift || 0;
  const quietEnd = quietUntil(state);
  for (const r of state.rules) {
    if (spent(state, r)) continue;                                           // a `once` rule that has fired never wakes the timer
    let t = r.when === "every" && r.every.seconds ? state.timers[r.id]
          : r.when === "every" && state.timers[r.id] <= state.turn ? 0       // a per-turn rule held back: it runs on a tick
          : r.when === "at" ? (x => (x === null ? undefined : x - shift))(nextAfter(scheduleOf(r.at), state.time?.seen ?? 0))
          : undefined;
    if (t !== undefined && r.ambient) t = Math.max(t, quietEnd);   // ambience waits out the quiet
    if (t !== undefined && (due === null || t < due)) due = Math.max(0, t);
  }
  return due;
}

// ---- Rules ------------------------------------------------------------------------------------------------

// Your action: the first game rule that matches and holds, else the first standard verb that does. The answer to
// a yes/no question (`confirm`) does what the question said yes or no does, before anything else. After the end the
// game is locked: "begin again" (the parser reads it only then) begins again, and anything else is told, in grey, that
// the story is over (LOAD and UNDO are the controller's, and their questions are answered above).
// In the opening (a `fixed` room) only its own rules apply: nothing a world adds reaches it.
function runAction(g, action, out, asked) {
  if (action.verb === "answer" && asked?.yes) {
    out.answer = { rule: "confirm", generic: false };
    const effects = action.value === "yes" ? asked.yes : (asked.no || [{ say: "@confirmNo" }]);
    const trusted = out.trusted;
    out.trusted = asked.trusted;                                 // as trusted as whoever asked
    effects.forEach((e, i) => apply(g, e, action, out, "confirm#" + i));
    out.trusted = trusted;
    return;
  }
  if (g.ended) {
    if (action.verb !== "begin_again") return apply(g, { say: "@gameOver", style: "sys" }, action, out, "over");
    out.answer = { rule: "begin_again", generic: false };
    return BEGIN_AGAIN.forEach((e, i) => apply(g, e, action, out, "again#" + i));
  }
  const rule = [...activeRules(g), ...standardVerbs].find(r => isAction(r) && fits(g, r, action));
  if (rule) { out.answer = { rule: rule.id, generic: !!rule.generic }; run(g, rule, action, out); }
}

// Would these actions, done now, be accepted, and would something answer them: a game rule or the thing itself,
// not a verb's generic reply (verbs.js)? For offering commands ("Did you mean…?", suggestion lines). The state is
// untouched. { works, meaningful }
export function answers(state, actions) {
  let s = state, meaningful = !state.ended;
  for (const a of actions) {
    const r = step(s, a);
    if (r.refused.length) return { works: false, meaningful: false };
    if (!r.answer || r.answer.generic) meaningful = false;
    s = r.next;
  }
  return { works: true, meaningful };
}

// The game's rules that can act now: all of them, or only the opening's own while you're in it.
const activeRules = (g) => (g.world.rooms[g.player.at]?.fixed ? g.rules.filter(r => r.fixed) : g.rules);
const STANDARD = new Set(standardVerbs);
// Is this room or object part of the opening (never changed by a world)?
const isFixed = (g, id) => !!(g.world.rooms[id]?.fixed || g.world.objects[id]?.fixed);

// Run a rule's effects; "then": "default" also runs the standard verb afterwards. The opening's rules and the
// standard verbs may change the opening's things; a world's rules may not (out.trusted).
function run(g, rule, action, out) {
  if (rule.once) g.fired[rule.id] = true;                // its one time: it counts from the moment it runs
  const was = out.trusted;
  out.trusted = !!(rule.fixed || STANDARD.has(rule));
  rule.do.forEach((effect, i) => apply(g, effect, action, out, rule.id + "#" + i));
  if (rule.then === "default") {
    const std = standardVerbs.find(r => fits(g, r, action));
    if (std) run(g, std, action, out);
  }
  out.trusted = was;
}

const isAction = (r) => (r.when || "action") === "action";
// A rule with `once: true` fires at most once per game: the engine records it in `state.fired` when it runs, and from
// then on it no longer matches, comes due or counts (action, scheduled and timed rules alike).
const spent = (g, r) => !!(r.once && g.fired?.[r.id]);
const fits = (g, r, action) => !spent(g, r) && matches(r.match, action) && holds(g, r.if, action);

// Does the action match? Every key in `match` must equal the action's, or be one of a list ({} matches any action).
// null in a list means "none": { obj: [null, "boat"] } matches "row" and "row boat".
function matches(match = {}, action) {
  return Object.entries(match).every(([k, v]) => Array.isArray(v) ? v.includes(action[k] ?? null) : action[k] === v);
}

// Do all the conditions hold? Each is { path: value } (equal) or { path: { operator: value } }. The operator
// `holds` is for conditions kept as data (a room's `waitFor.if`): { "$here.waitFor.if": { holds: true } } is true when
// the conditions at that path all hold, or when there are none. `any` is "or": { any: [ { "dog.asleep": true }, { "dog.tied": true } ] }.
export function holds(g, conditions = [], action = {}) {
  return conditions.every(c => Object.entries(c).every(([path, want]) => {
    // { any: [ cond, cond, … ] }: at least one holds (an item that is a list means all of that list).
    if (path === "any") return Array.isArray(want) && want.some(x => holds(g, Array.isArray(x) ? x : [x], action));
    const have = read(g, path, action);
    if (want === null || typeof want !== "object") return have === fill(g, want, action);
    return Object.entries(want).every(([op, v]) => op === "holds"
      ? holds(g, Array.isArray(have) ? have : [], action) === v
      : compare(have, op, fill(g, v, action)));
  }));
}

// Compare with an operator: = != < <= > >=, "in" (one of a list), "has" (a list has it: `$obj2.chain` has `$obj`), or
// "between" [from, to) (wrapping round: the hours between 22 and 6 are the night).
function compare(a, op, b) {
  switch (op) {
    case "=": return a === b;
    case "!=": return a !== b;
    case "<": return a < b;
    case "<=": return a <= b;
    case ">": return a > b;
    case ">=": return a >= b;
    case "in": return b.includes(a);
    case "has": return Array.isArray(a) && a.includes(b);   // a list (a thing's `chain`) has it
    case "between": return b[0] <= b[1] ? a >= b[0] && a < b[1] : a >= b[0] || a < b[1];   // [22, 6]: past midnight
    default: throw new Error("Unknown operator: " + op);
  }
}

// How an exit stands now. `go`: where going that way leads (a room id, true when a rule answers, false when there is no
// way, null when there is no such exit); `seen`: there is a way to see (open or shut: you can see the door); `closed`:
// the line for a way that is shut now (a conditional exit's own), else null. A plain exit is as it is written; one with
// `if` is open while the conditions hold, the same ones a rule has (ARCHITECTURE.md §3, "Rooms").
export function exitNow(g, roomId, dir, action = {}) {
  const raw = g.world.rooms[roomId]?.exits?.[dir];
  if (!isExitObject(raw)) return { go: raw ?? null, seen: !!raw, closed: null };
  const list = exitConditions(raw), to = exitTo(raw);
  const open = list !== null && holds(g, list, action);
  return { go: open ? to : false, seen: !!to, closed: open ? null : (raw.closed ?? null) };
}

// Read a value by path (in conditions; in values with a "$" in front): "player.at", "game.ended", "player.health", "door.open", "dining.visited", "$obj.at" (the action's object), "$exit".
// "<id>.place" is where it really is: its room, or "player", even inside something else (a mint in the tin).
// "<id>.chain" is a list: the thing, what it is in, what that is in… ("$obj2.chain" { has: "$obj" }: the action's
// object is, or holds, its second object). "$obj2" is the action's second object ("put X in Y": Y).
// A missing object property counts as its default; anything missing is null.
function read(g, path, action) {
  if (path === "$exit") return exitNow(g, g.player.at, action.dir, action).go;     // "$exit.closed": the line of a shut way
  if (path === "$exit.closed") return exitNow(g, g.player.at, action.dir, action).closed;
  if (/^\$\w+$/.test(path) && path !== "$obj" && path !== "$here" && path in prefixed(action)) return action[path.slice(1)] ?? null;   // "$topic"
  path = path.replace(/\.\$(\w+)/g, (_, k) => "." + (action[k] ?? ""));      // "$obj.topics.$topic.says": the action's topic
  if (/^\$here\./.test(path)) path = g.player.at + path.slice(5);           // "$here.visited": your room's
  else if (/^\$in\./.test(path)) path = (g.player.in ?? "") + path.slice(3); // "$in.name": what you're in or on
  else if (/^\$obj2\b/.test(path)) path = (action.obj2 ?? "") + path.slice(5); // "$obj2.open": the action's second object's
  else if (/^\$obj\b/.test(path)) path = (action.obj ?? "") + path.slice(4); // "$obj.examine": the action's object's
  else if (path.startsWith("$")) path = path.slice(1);                      // "$letter.examine": a named thing's
  const [id, ...rest] = path.split(".");
  const prop = rest.join(".");
  if (id === "player") return g.player[prop] ?? startOf(g, id, prop);
  if (id === "game") return g[prop] ?? startOf(g, id, prop);
  if (id === "time") return parts(worldTime(g), g.time?.weekday)[prop] ?? null;   // "time.hour", "time.day", "time.weekday"
  const o = g.world.objects[id] || g.world.rooms[id];   // an object, or a room ("dining.visited")
  if (!o) return null;
  if (prop === "place") return placeOf(g, id);
  if (prop === "chain" && g.world.objects[id]) return chainOf(g, id);   // "<id>.chain": itself, then what it is in, and what that is in…
  if (rest.length > 1) return rest.reduce((x, k) => (x == null ? x : x[k]), o) ?? null;   // deeper: "beach.describe.0"
  return o[prop] ?? DEFAULTS[prop] ?? startOf(g, id, prop);
}

// A declared property's start (js/fields.js): what it is until something sets it. Null if it has none.
const startOf = (g, id, prop) => g.properties?.[id + "." + prop]?.start ?? null;

const prefixed = (action) => Object.fromEntries(Object.entries(action).map(([k, v]) => ["$" + k, v]));

// Fill in variables in a value: "$obj" (the action's object), "$here" (your room), "$text" (what you typed as
// an answer), "$exit", "$obj.<property>", "$<id>.<property>" (any object's, room's, the player's or the game's).
// Anything else is returned as it is.
function fill(g, v, action) {
  if (Array.isArray(v)) return v.map(x => fill(g, x, action));
  if (typeof v !== "string" || !v.startsWith("$")) return v;
  if (v === "$obj") return action.obj ?? null;
  if (v === "$here") return g.player.at;
  if (v === "$text") return action.text ?? "";
  if (v === "$topic") return action.topic ?? null;
  if (v === "$exits") return Object.keys(g.world.rooms[g.player.at].exits || {}).filter(d => exitNow(g, g.player.at, d).seen);   // shut ones too: you can see the door
  return read(g, v, action);
}

// ---- What you've come across ----------------------------------------------------------------------------------

// Everything in your room that you can see (not inside a closed container) counts as seen: a character's topic about
// it can now be offered (js/view.js, offeredTopics). Not a thing marked `unnoticed` (the umbrella behind the counter,
// which no text mentions): that one counts once something brings it up (`opens`), or you've held it.
function seeHere(g) {
  for (const [id, o] of Object.entries(g.world.objects)) {
    if (o.unnoticed || g.seen.things.includes(id)) continue;
    if (placeOf(g, id) === g.player.at && !shut(g, id)) g.seen.things.push(id);
  }
}

// ---- Hints ------------------------------------------------------------------------------------------------

// Is a puzzle solved? What it gives has been in your hands, the room it reaches has been visited, an ending has
// happened. A thing that's needed: it has been in your hands.
function solved(g, p) {
  if (p.ending) return !!g.ended;
  const to = p.reaches === "entrance" ? g.entrance : p.reaches;
  if (!(p.gives || []).length && !to) return false;
  return (p.gives || []).every(id => g.seen.held.includes(id)) && (!to || g.seen.visited.includes(to));
}
const met = (g, need) => (g.puzzles[need] ? solved(g, g.puzzles[need]) : g.seen.held.includes(need));

// The next hint: the first puzzle not yet solved whose needs are met (a step on the way before an ending), one
// level more each time it's asked for: its own hint lines (the world's `hints`), then the commands that solve it.
function nextHint(g) {
  const open = Object.entries(g.puzzles || {}).filter(([, p]) => !solved(g, p) && (p.needs || []).every(n => met(g, n)));
  const pick = open.find(([, p]) => !p.ending) || open[0];
  if (!pick) return { none: true };
  const [id, p] = pick, hints = p.hints || [];
  const level = Math.min((g.hinted[id] || 0) + 1, hints.length + 1);
  g.hinted[id] = level;
  if (level > hints.length) return { puzzle: id, commands: p.solve };
  return { puzzle: id, text: hints[level - 1] };
}

// ---- Scheduled rules -------------------------------------------------------------------------------------

// Rules that happen at a time of the world's clock ({ when: "at", at: "17:15" } every day, or "day 2 08:00" once),
// if their conditions hold then. Everything due since the clock was last looked at runs, in order, once each, even
// if a jump passed it (you sleep through 17:15: the train still leaves). Going back in time lets what's after it
// happen again.
function runScheduled(g, out) {
  const fired = new Set();
  for (let guard = 0; guard < 50; guard++) {
    const now = worldTime(g), from = g.time.seen;
    if (g.ended || now <= from) { g.time.seen = now; return; }       // after the end nothing runs, but nothing piles up either
    let first = null, due = [];
    for (const r of activeRules(g)) {
      if (r.when !== "at" || fired.has(r.id) || spent(g, r)) continue;
      const t = occursBetween(scheduleOf(r.at), from, now);
      if (t === null) continue;
      if (first === null || t < first) { first = t; due = [r]; } else if (t === first) due.push(r);
    }
    if (first === null) { g.time.seen = now; return; }
    g.time.seen = first;
    for (const r of due) { if (g.ended) break; fired.add(r.id); if (holds(g, r.if)) run(g, r, {}, out); }
  }
}

// ---- Timed rules ------------------------------------------------------------------------------------------

// Timed rules run while their conditions hold, each at a random gap (seconds of game time, or turns).
// Their next due time is kept in state.timers; leaving their conditions stops them, returning restarts them.
// Calm: of the rules due now that say something, ONE speaks per tick, and ambience also keeps QUIET_AFTER_COMMAND
// from your last command and QUIET_AFTER_LINE from the last automatic line. The world's own rules go first (the one due longest, per-turn ones last, then list order, so a
// warning written before its consequence stays ahead of it), then the room's ambience. A rule held back keeps its
// due time and runs on a later tick; ambience just takes its next gap. Rules that say nothing are never held.
function runTimed(g, at, out, scheduledSpoke = false) {
  if (g.ended) return;                                                      // after the end the world is silent
  const quietEnd = quietUntil(g);
  const quiet = at < quietEnd;
  const due = [];
  for (const r of activeRules(g)) {
    if (r.when !== "every") continue;
    if (spent(g, r)) { delete g.timers[r.id]; continue; }                    // it has had its one time
    if (!holds(g, r.if) || (r.ambient && ambienceOver(g, r))) { delete g.timers[r.id]; continue; }   // not active: stop
    const t = g.timers[r.id];
    if (t === undefined) { g.timers[r.id] = schedule(g, r, at); continue; }   // just became active
    if ((r.every.turns ? g.turn : at) >= t) due.push(r);
  }
  const rank = (r) => (r.ambient ? 1 : 0), when = (r) => (r.every.turns ? Infinity : g.timers[r.id]);
  due.sort((a, b) => rank(a) - rank(b) || (when(a) < when(b) ? -1 : when(a) > when(b) ? 1 : 0));
  let spoke = scheduledSpoke, worldSpoke = false;
  for (const r of due) {
    if (g.ended) break;                                       // a rule just ended the story: no other runs
    const talks = speaks(g, r.do);
    if (talks && r.ambient && (quiet || spoke)) { g.timers[r.id] = schedule(g, r, Math.max(at, quietEnd)); continue; }
    if (talks && !r.ambient && worldSpoke) continue;          // held back: still due (quiet never holds the world's own rules)
    if (r.chance === undefined || roll(g) < r.chance) {
      const n0 = out.applied.length;
      run(g, r.ambient ? ambienceLine(g, r) : r, {}, out);
      if (out.applied.slice(n0).some(e => "say" in e)) { spoke = true; worldSpoke ||= !r.ambient; g.lastLine = at; }
    }
    g.timers[r.id] = schedule(g, r, at);
    if (r.ambient && ambienceOver(g, r)) delete g.timers[r.id];    // every line said: quiet until you come back
  }
}

// Does a list of effects say something (directly, or through a named change)? Those are what calm holds back.
function speaks(g, effects, depth = 0) {
  return effects.some(e => "say" in e || "hurt" in e || "heal" in e || "echo" in e || "describe" in e
    || ("change" in e && depth < 5 && speaks(g, g.changes[e.change] || [], depth + 1)));
}

// A room's ambience says each line once per visit (the said ones are kept in g.ambienceSaid[room]; arriving clears
// them). Never the line before, even across visits.
const ambienceOver = (g, r) => (g.ambienceSaid?.[r.ambient]?.length || 0) >= r.do[0].say.length;
function ambienceLine(g, r) {
  const lines = r.do[0].say, said = g.ambienceSaid[r.ambient] ??= [], key = r.id + "#0";
  let left = lines.map((_, i) => i).filter(i => !said.includes(i));
  if (left.length > 1) left = left.filter(i => i !== g.recent[key]);
  const [v, next] = between(g.rng, 0, left.length - 1); g.rng = next;
  const i = left[v];
  said.push(i); g.recent[key] = i;
  return { ...r, do: [{ say: lines[i] }] };
}

// The next due time for a timed rule: a random gap within its range, from now.
function schedule(g, r, at) {
  const [min, max] = r.every.seconds || r.every.turns;
  const gap = rollBetween(g, min, max);
  return r.every.turns ? g.turn + gap : at + gap * 1000;
}

// Random numbers from the state's own generator (so replays repeat exactly).
function roll(g) { const [v, next] = random(g.rng); g.rng = next; return v; }
function rollBetween(g, min, max) { const [v, next] = between(g.rng, min, max); g.rng = next; return v; }

// ---- Effects ----------------------------------------------------------------------------------------------

// Apply one effect. Each checks itself; a refused one is recorded and changes nothing.
// key identifies the effect in its rule (used to avoid repeating the same phrasing twice in a row).
function apply(g, e, action, out, key) {
  const refuse = (reason) => out.refused.push({ effect: e, reason });
  const done = (x) => out.applied.push(x);
  const touched = out.trusted ? null : fixedTarget(g, e, action);
  if (touched) return refuse(`${touched} is part of the opening: a world can't change it`);

  // `add` and `remove` first: what they add carries its own fields, which can share names with effects (a room's
  // `describe`, an object's `move`), so those mustn't be read as effects.
  // (A picture edit's own `add` / `remove` are shapes, not things: `draw` goes first.)
  if (typeof e.add === "string" && !("draw" in e)) return addThing(g, e, refuse, done);
  if (typeof e.remove === "string" && !("draw" in e)) return removeThing(g, e, refuse, done);

  if ("say" in e) {                                  // a line for the narrator: "@key" (pack) or text
    let text = e.say, pick, prev;
    // A property can hold several phrasings too ("$obj.talk": the waiter's lines): pick one, as for a list here.
    if (typeof text === "string" && text.startsWith("$")) {
      const v = fill(g, text, action);
      if (Array.isArray(v)) text = pickVariant(g, v, key + ":" + text.replace("$obj", action.obj ?? "")).toString();
      else if (typeof v === "string") text = v;
    }
    if (Array.isArray(text)) text = pickVariant(g, text, key);
    if (e.vary) {                                    // "@key" names a list of phrasings in the pack: the narrator picks
      text = fill(g, text, action);                  // one with this roll, not the one picked last time
      prev = g.recent[text]; pick = roll(g); g.recent[text] = pick;
    }
    const said = fill(g, text, action);
    if (said === null || said === undefined || said === "") return refuse("nothing to say: " + e.say);
    // who: what the language pack needs to make a standard line agree with the thing the action is about (Spanish
    // "Cogida." / "Cogidos."): that thing's gender and number, from its `words` ({ g: "m" | "f", pl }).
    const w = typeof said === "string" && said.startsWith("@") && action.obj ? g.world.objects[action.obj]?.words : null;
    // things: a standard line about several things ("You put the letter in the bottle."): the narrator names each in
    // this language and hands the pack their names and their gender and number, in order ({ say: "@putIn", things: ["$obj", "$obj2"] }).
    const things = Array.isArray(e.things) ? e.things.map(t => fill(g, t, action)).filter(t => g.world.objects[t]) : null;
    const vals = propertyWords(g, said);              // the properties it names, as they are now ([player.name] in it)
    done(clean({ say: said, img: fill(g, e.img, action), style: e.style, arg: fill(g, e.arg, action),
                 pick, prev, who: !things && w && (w.g || w.pl) ? clean({ g: w.g, pl: w.pl }) : undefined, things,
                 vals: Object.keys(vals).length ? vals : undefined,
                 at: worldTime(g) }));     // at: the world's time when it was said ([time] in it)
  } else if ("describe" in e) {                      // the narrator describes a room, or what you carry
    const what = fill(g, e.describe, action);
    if (!["inventory", "time", "status"].includes(what) && !g.world.rooms[what]) return refuse("no such room: " + what);
    done(what === "time" ? { describe: what, at: worldTime(g) } : { describe: what });
  } else if ("move" in e) {                          // move a thing: to a room, "player", into another object, or
                                                     // out of play (to: null)
    const id = fill(g, e.move, action), to = fill(g, e.to, action), o = g.world.objects[id];
    if (!o) return refuse("no such object: " + id);
    if (to !== null && to !== "player" && !g.world.rooms[to] && !g.world.objects[to]) return refuse("no such place: " + to);
    if (o.at === "player") g.player.carrying = g.player.carrying.filter(x => x !== id);
    if (to === "player") { g.player.carrying.push(id); if (!g.seen.held.includes(id)) g.seen.held.push(id); }
    o.at = to;
    done({ move: id, to });
  } else if ("set" in e) {                           // set a property: { set: "door.open", to: true } or add: -15
    // Of the player, the game, an object or a room; deeper paths reach inside it: "beach.describe.0" is the first
    // paragraph of the beach's text (an existing one, or the next one).
    const [id, ...path] = e.set.split(".");
    let target = id === "player" ? g.player : id === "game" ? g : g.world.objects[id] || g.world.rooms[id];
    if (!target) return refuse("no such object: " + id);
    if (!path.length) return refuse("set what? " + e.set);
    for (const key of path.slice(0, -1)) {
      target = target[key];
      if (target === null || typeof target !== "object") return refuse("no such property: " + e.set);
    }
    const prop = path.at(-1);
    if (Array.isArray(target) && !(/^\d+$/.test(prop) && +prop <= target.length)) return refuse("no such place in the list: " + e.set);
    const decl = path.length === 1 ? g.properties?.[e.set] : undefined;   // a declared property: its start and its range
    let value = "add" in e ? (target[prop] ?? DEFAULTS[prop] ?? decl?.start ?? 0) + e.add : fill(g, e.to, action);
    if (typeof value === "number") {
      const own = RANGES[e.set];                     // the engine's own numbers keep to their own range (health)
      if (own) value = Math.min(own[1], Math.max(own[0], value));
      if (decl?.type === "number") {                 // a declared range always holds
        if (Number.isFinite(decl.min)) value = Math.max(decl.min, value);
        if (Number.isFinite(decl.max)) value = Math.min(decl.max, value);
      }
    }
    const was = target[prop];
    target[prop] = value;
    done({ set: e.set, to: value });
    if (e.set === "player.health" && typeof was === "number" && value < was) hurtLine(g, null, done);
    else if (e.set === "player.health" && typeof was === "number" && value > was) echo(done, g, "healed", value);
  } else if ("hurt" in e) {                          // hurt the player: { hurt: 1, says: "Something caught you." } (2 for something serious)
    const n = fill(g, e.hurt, action);
    if (typeof n !== "number" || !(n > 0)) return refuse("hurt by how much? " + e.hurt);
    const [lo] = RANGES["player.health"], was = g.player.health;
    g.player.health = Math.max(lo, was - n);
    // An ordinary hit (1 or 2) never ends you from above 1: you are severely hurt first (INTERFACE.md §6c). A bigger one
    // is an ending's (drowning) and does.
    if (n <= 2 && was > 1 && g.player.health < 1) g.player.health = 1;
    done({ set: "player.health", to: g.player.health });
    hurtLine(g, fill(g, e.says, action), done);
  } else if ("heal" in e) {                          // heal the player: { heal: 1, says: "The tea is hot and sweet." }
    const n = fill(g, e.heal, action);
    if (typeof n !== "number" || !(n > 0)) return refuse("heal by how much? " + e.heal);
    const was = g.player.health, [, hi] = RANGES["player.health"];
    g.player.health = Math.min(hi, was + n);         // never above full
    if (g.player.health !== was) done({ set: "player.health", to: g.player.health });
    if (e.says !== undefined) apply(g, { say: e.says }, action, out, key + ":says");   // the world's own line, always
    // then the echo, always: where you land if you are better; at full health nothing changes and it says so (the state phrase)
    if (g.player.health !== was) echo(done, g, "healed", g.player.health);
    else done({ echo: "@health." + g.player.health, kind: "healed", level: g.player.health, at: worldTime(g) });
  } else if ("echo" in e) {                          // an echo of something that happened to you: { echo: "…", kind: "noted" }
    const said = fill(g, e.echo, action);
    if (typeof said !== "string" || !said.trim()) return refuse("echo says what? " + e.echo);
    if (typeof e.kind !== "string" || !/^[a-z]+$/.test(e.kind)) return refuse("echo of what kind? " + e.kind);
    done({ echo: said, kind: e.kind, at: worldTime(g) });
  } else if ("travel" in e) {                        // move the player to a room
    const room = fill(g, e.travel, action);
    if (!g.world.rooms[room]) return refuse("no such room: " + room);
    if (g.player.at !== room) delete g.ambienceSaid?.[room];   // a new visit: its ambience lines can be said again
    g.player.at = room;
    g.player.in = null;                              // whatever you were in or on stays behind
    if (!g.seen.visited.includes(room)) g.seen.visited.push(room);
    done({ travel: room });
  } else if ("connect" in e || "disconnect" in e) {  // open or close an exit: { connect: room, dir, to, passage?, in?, out?, if?, closed? }
    const id = e.connect || e.disconnect, room = g.world.rooms[id];
    if (!room) return refuse("no such room: " + id);
    if (!DIRECTIONS.includes(e.dir)) return refuse("no such direction: " + e.dir);
    if (e.connect) {
      if (!g.world.rooms[e.to]) return refuse("no such room: " + e.to);
      // Inside an area an exit leads to the next cell that way; anything else must say it's a passage.
      const to = g.world.rooms[e.to];
      if (!e.passage && STEP[e.dir] && room.at && to.at && to.area === room.area && isPassage(g, id, e.dir, e.to))
        return refuse(`${e.to} isn't ${e.dir} of ${id}: mark it as a passage`);
    }
    room.exits[e.dir] = e.connect ? connectedExit(e) : false;   // a plain room id, or { to, in, out, if, closed } when it carries any
    done({ ...e });
  } else if ("unlock" in e) {                        // try to open a locked thing: with its key, it opens (its `opens`
    const id = fill(g, e.unlock, action), o = g.world.objects[id];   // line, then its named change); without, its `says`
    if (!o) return refuse("no such object: " + id);
    const lock = o.lock || {};
    if (lock.key && g.player.carrying.includes(lock.key)) {
      o.locked = false; o.open = true;
      done({ unlock: id });
      apply(g, { say: lock.opens || "@unlocked" }, action, out, key + ":opens");
      if (lock.then) apply(g, { change: lock.then }, action, out, key + ":then");
    } else apply(g, { say: lock.says || "@locked" }, action, out, key + ":says");
  } else if ("change" in e) {                        // run a named change: effects written once, used by any rule
    const effects = g.changes[e.change];
    if (!effects) return e.optional ? undefined : refuse("no such change: " + e.change);   // optional: if the world has one
    if ((out.depth = (out.depth || 0) + 1) > 5) { out.depth--; return refuse("changes nested too deep: " + e.change); }
    const was = out.trusted;
    out.trusted = false;                             // named changes are a world's: they never touch the opening
    effects.forEach((x, i) => apply(g, x, action, out, key + ">" + e.change + "#" + i));
    out.trusted = was;
    out.depth--;
    done({ change: e.change });
  } else if ("draw" in e) {                          // edit a room's picture: a new version (ART-DIRECTION.md §5)
    const room = g.world.rooms[fill(g, e.draw, action)];
    if (!room || !room.picture) return refuse("no such picture: " + e.draw);
    const next = editPicture(room.picture, e);
    if (typeof next === "string") return refuse(next);
    room.picture = next;
    done({ draw: e.draw, version: next.version });
  } else if ("time" in e) {                         // move the world's clock: "+8h", "-1d", "next 06:00", "day 1 17:00"
    const now = worldTime(g), r = moveTo(fill(g, e.time, action), now);
    if (r.error) return refuse(r.error);
    if (e.weekday != null && !WEEKDAYS.includes(e.weekday)) return refuse("a weekday is one of " + WEEKDAYS.join(", "));
    g.time.shift = r.to - g.clock;
    if (e.weekday) g.time.weekday = e.weekday;      // what day of the week day 1 is
    // A set time ("day 1 17:00": a world's start, "day 8 09:00") starts the clock afresh: what's scheduled before
    // it doesn't run. Going back lets what's after it happen again. Going forward runs what it passes.
    if (/^\s*day/i.test(String(fill(g, e.time, action))) || r.to < now) g.time.seen = r.to;
    done(clean({ time: r.to, from: now, weekday: e.weekday }));
  } else if ("confirm" in e) {                       // a yes/no question, the same everywhere: it's said, followed by
    // <YES> / <NO> (the narrator adds them); the next input is read as the answer, which does `yes` or `no` (a
    // short "All right." when there's no `no`). Anything else typed instead drops the question.
    // { confirm: "@askRestart", yes: [effects], no?: [effects], style?, arg? }
    if (!Array.isArray(e.yes) || (e.no && !Array.isArray(e.no))) return refuse("a confirm needs yes: [effects] (and no: [effects], if any)");
    const said = fill(g, e.confirm, action);
    if (said === null || said === undefined || said === "") return refuse("nothing to ask: " + e.confirm);
    g.pending.question = { ask: "confirm", yesNo: true, yes: e.yes, ...(e.no ? { no: e.no } : {}), trusted: !!out.trusted };
    const vals = propertyWords(g, said);
    done(clean({ say: said, confirm: true, style: e.style, arg: fill(g, e.arg, action), vals: Object.keys(vals).length ? vals : undefined, at: worldTime(g) }));
  } else if ("ask" in e) {                           // ask the player for words (a name): the next input is the answer
    g.pending.question = { ask: e.ask, ...(e.blankOk ? { blankOk: true } : {}) };
    done({ ask: e.ask });
  } else if ("end" in e) {                           // the story has ended: asks nothing; a note, once, and the way to begin again
    // { end: true, picture: "drowned" }: the ending's own picture, one of `pictures` (add picture); the scene shows it.
    if (e.picture !== undefined && !g.pictures[e.picture]) return refuse(`the ending names a picture that doesn't exist: ${e.picture}`);
    const first = !g.ended;
    g.ended = true;
    if (first) g.ending = e.picture ?? null;        // the first ending is the one (a second `end` changes nothing)
    done(clean({ end: true, picture: e.picture }));
    if (first) {                                     // after the ending's own text: play time and rooms seen (grey), then the line
      apply(g, { say: "@endNote", style: "sys", arg: { ms: g.clock, rooms: (g.seen?.visited || []).length } }, action, out, "endNote");
      apply(g, { say: "@gameOver", style: "sys" }, action, out, "over");
    }
  } else if ("know" in e) {                          // an idea has come up ("monday"): topics about it can be offered
    const v = fill(g, e.know, action);
    for (const idea of [].concat(v ?? [])) if (typeof idea === "string" && !g.seen.ideas.includes(idea)) g.seen.ideas.push(idea);
    if (v != null) done({ know: v });
  } else if ("hint" in e) {                          // a hint, from the puzzles: { hint: "@conchSays" } frames it
    done({ hint: fill(g, e.hint, action), ...nextHint(g) });
  } else if ("restart" in e) {                       // begin again: the controller starts a new game
    done({ restart: true });
  } else if ("session" in e) {                       // something for the controller to do outside the story, once
    // a question about it was answered yes (undo, load, save over the saved game, a new game): never from a world
    if (!out.trusted) return refuse("only the game itself can do " + e.session);
    done({ session: e.session });
  } else if ("useAs" in e) {                         // USE becomes the action you meant, run as if typed (js/use.js):
    // "field": what USE alone means for a thing (its `use`, a verb); "pair": "use X with Y" (a world's own `use` rules came
    // first). It means nothing known: the stock reply, which is never "try a more specific verb".
    const o = g.world.objects[action.obj];
    const next = e.useAs === "field" ? (o && typeof o.use === "string" ? { verb: o.use, obj: action.obj } : null) : translateUse(g, action);
    if (next && next.verb !== "use") runAction(g, next, out, null);
    else {
      apply(g, { say: "@replies.use", vary: true }, action, out, key + ":none");
      out.answer = { rule: "std_use_none", generic: true };
    }
  } else if ("useHow" in e) {                        // USE alone, with nothing it means by itself: the controller lists what
    const id = fill(g, e.useHow, action);            // you could do with the thing (js/view.js, useLine), or the stock reply
    if (g.world.objects[id]) done({ useHow: id, pick: roll(g) });
  } else if ("listenFor" in e) {                     // HINT: points to the opening's listening thing, never a hint itself
    const id = g.opening?.hints, o = id && g.world.objects[id];
    const where = !o ? "@hintNone" : o.at === "player" ? "@hintCarried" : o.at === g.player.at ? "@hintHere" : "@hintAway";
    done(clean({ say: where, name: o ? id : undefined, style: "sys", at: worldTime(g) }));   // name: the narrator names it; grey: the system speaking
  } else refuse("unknown effect");
}

// Losing health always says so: the cause's own words, if any, as story text, then the echo of how hurt you are now
// (red: INTERFACE.md §6c); at 0, the end of your strength instead (and step() ends the story).
function hurtLine(g, says, done) {
  const h = g.player.health, cause = typeof says === "string" ? says : null;
  if (h <= 0) return done(clean({ say: "@hurt.dead", arg: cause, at: worldTime(g), pick: roll(g) }));   // the end: one of several, at random
  if (cause) done({ say: cause, at: worldTime(g) });
  echo(done, g, "hurt", h);
}

// The echo of a change to your health (INTERFACE.md §6c): one short line from the language pack for where you
// landed, in the colour of its kind, with the level it describes (the narrator draws the bars from it). kind: "hurt" |
// "healed"; level: the new step. A hurt says the state phrase; the narrator swaps in the pack's own hurt phrase for
// that step, if it has one (echo.hurt).
function echo(done, g, kind, level) {
  done({ echo: kind === "hurt" ? "@health." + level : `@echo.${kind}.${level}`, kind, level, at: worldTime(g) });
}

// What part of the opening an effect would change, if any (for effects from a world: they may not).
function fixedTarget(g, e, action) {
  const ids = [];
  if (typeof e.add === "string" && !("draw" in e)) {
    if (e.add === "rule" && e.before) ids.push(g.rules.find(r => r.id === e.before)?.fixed ? "rule " + e.before : null);
    if (e.add === "object") ids.push(e.at);
  } else if (typeof e.remove === "string" && !("draw" in e)) {
    if (e.remove === "rule") ids.push(g.rules.find(r => r.id === e.id)?.fixed ? "rule " + e.id : null);
    else ids.push(e.id);
  } else if ("move" in e) ids.push(fill(g, e.move, action), fill(g, e.to, action));
  else if ("set" in e) ids.push(e.set.split(".")[0]);
  else if ("travel" in e) ids.push(fill(g, e.travel, action));
  else if ("connect" in e || "disconnect" in e) ids.push(e.connect || e.disconnect);
  else if ("draw" in e) ids.push(fill(g, e.draw, action));
  else if ("unlock" in e) ids.push(fill(g, e.unlock, action));
  return ids.find(id => typeof id === "string" && (id.startsWith("rule ") || isFixed(g, id))) || null;
}

// What an id already names, if anything: "room", "object" or "puzzle". Ids are unique across all three (a rule reads
// `last_lamp.visited` or `$here.waitFor` by id, so one id for two things would make it read the wrong one).
export const idKind = (g, id) => (g.world.rooms[id] ? "room" : g.world.objects[id] ? "object" : g.puzzles?.[id] ? "puzzle" : null);
// The reason an id can't be used for a new room, object or puzzle, or null when it is free.
const idTaken = (g, kind, id) => {
  const has = idKind(g, id);
  return has ? `can't add ${kind} "${id}": that id is already ${has === "object" ? "an" : "a"} ${has}, and ids are unique across rooms, objects and puzzles` : null;
};

// Add a room (in a free cell of an area), an object, a rule, a named change, a puzzle or a word.
function addThing(g, e, refuse, done) {
  if (e.add === "room") {
    const { add, id, ...props } = e;
    const clash = idTaken(g, "room", id);
    if (clash) return refuse(clash);
    if (!props.area || !Array.isArray(props.at) || props.at.length !== 3 || !props.at.every(Number.isInteger))
      return refuse("a room needs an area and a cell [x, y, z]: " + id);
    const taken = roomAt(g, props.area, props.at);
    if (taken) return refuse(`cell ${props.at} of ${props.area} is taken by ${taken}`);
    if (props.picture && typeof props.picture.draw === "string") {   // the short notation (js/picture.js)
      const read = readPicture(props.picture);
      if (typeof read === "string") return refuse(`picture of ${id}: ${read}`);
      props.picture = read;
    }
    g.world.rooms[id] = { exits: {}, ...props };
    if (props.ambience) {                            // a room's small life: lines now and then while you're there
      const a = props.ambience;
      if (!Array.isArray(a.lines) || !a.lines.length) return refuse(`ambience of ${id} needs lines`);
      g.rules.push({ id: "ambience_" + id, ambient: id, when: "every", every: { seconds: a.every || [35, 80] }, chance: a.chance ?? 0.7,
                     if: [{ "player.at": id }, ...(a.if || [])], do: [{ say: a.lines }] });
    }
  } else if (e.add === "object") {
    const clash = idTaken(g, "object", e.id);
    if (clash) return refuse(clash);
    const { add, id, ...props } = e;
    g.world.objects[id] = props;
  } else if (e.add === "rule") {                   // at the end, or before another rule: { …, before: "knock" }
    if (g.rules.some(r => r.id === e.rule.id)) return refuse("rule already exists: " + e.rule.id);
    if (e.rule.when === "at" && scheduleOf(e.rule.at).error) return refuse(`${e.rule.id}: ${scheduleOf(e.rule.at).error}`);
    const at = e.before ? g.rules.findIndex(r => r.id === e.before) : g.rules.length;
    if (at < 0) return refuse("no such rule: " + e.before);
    g.rules.splice(at, 0, structuredClone(e.rule));
  } else if (e.add === "change") {                 // a named change: { add: "change", id: "driftwood", effects: [...] }
    if (!e.id || !Array.isArray(e.effects)) return refuse("a change needs an id and effects");
    if (g.changes[e.id]) return refuse("change already exists: " + e.id);
    g.changes[e.id] = structuredClone(e.effects);
  } else if (e.add === "picture") {                // a picture that isn't a room's (an ending's): { id, picture: { version, draw, … }, alt }
    const { id, picture, alt } = e;
    if (typeof id !== "string" || !id) return refuse("a picture needs an id");
    if (g.pictures[id]) return refuse("picture already exists: " + id);
    if (!picture || typeof picture !== "object" || !(typeof picture.draw === "string" || Array.isArray(picture.draw)))
      return refuse(`picture ${id} needs a picture: { version, draw }`);
    const read = typeof picture.draw === "string" ? readPicture(picture) : structuredClone({ version: 1, ...picture });
    if (typeof read === "string") return refuse(`picture ${id}: ${read}`);
    g.pictures[id] = { ...(alt !== undefined ? { alt } : {}), picture: read };
  } else if (e.add === "puzzle") {                 // a puzzle described as data (GUIDE.md §3; checked by js/check.js)
    const { add, id, ...props } = e;
    if (!id || !Array.isArray(props.solve) || !props.solve.length) return refuse("a puzzle needs an id and the commands that solve it");
    const clash = idTaken(g, "puzzle", id);
    if (clash) return refuse(clash);
    g.puzzles[id] = structuredClone(props);
  } else if (e.add === "word") {                   // a verb only this world needs: { verb: "row", words: [...] }
    if (!e.verb || !Array.isArray(e.words) || !e.words.length) return refuse("a word needs a verb and words");
    g.vocab[e.verb] = { words: e.words, object: e.object || "optional", ...(e.absent ? { absent: true } : {}), ...(e.speech ? { speech: true } : {}) };
  } else return refuse("can't add: " + e.add);
  done({ ...e });
}

// Remove an object or a rule.
function removeThing(g, e, refuse, done) {
  if (e.remove === "object") {
    if (!g.world.objects[e.id]) return refuse("no such object: " + e.id);
    delete g.world.objects[e.id];
    g.player.carrying = g.player.carrying.filter(x => x !== e.id);
  } else if (e.remove === "rule") {
    if (!g.rules.some(r => r.id === e.id)) return refuse("no such rule: " + e.id);
    g.rules = g.rules.filter(r => r.id !== e.id);
    delete g.timers[e.id];
    delete g.fired?.[e.id];                                      // a rule added later under the same id starts afresh
  } else return refuse("can't remove: " + e.remove);
  done({ ...e });
}

// A picture written in the short notation (a room's, or an ending's): its drawing list parsed (js/picture.js), version 1
// unless it says. Returns the picture as it is stored, or the reasons it can't be, as one string.
function readPicture(picture) {
  const { shapes, problems } = parseShapes(picture.draw);
  return problems.length ? problems.join("; ") : { version: 1, ...picture, draw: shapes };
}

// A picture with edits applied: shapes removed, replaced or restyled (new colours, same place) by id, shapes added (at the end, or `after` a shape's
// id), cycles and overlays replaced when given. Returns the new picture (version + 1) or the reason it can't.
function editPicture(picture, e) {
  // Shapes to add or replace can be written in the short notation: a line each, or all in one string.
  const shapes = (x) => typeof x === "string" ? parseShapes(x) : { shapes: (x || []).map(s => (typeof s === "string" ? parseShape(s) : s)), problems: [] };
  try {
    for (const k of ["add", "replace"]) {
      const r = shapes(e[k]);
      if (r.problems.length) return r.problems.join("; ");
      e = { ...e, [k]: r.shapes };
    }
  } catch (err) { return err.message; }
  let draw = picture.draw.map(x => x);
  const has = (id) => draw.some(x => x.id === id);
  for (const id of e.remove || []) { if (!has(id)) return "no such shape: " + id; draw = draw.filter(x => x.id !== id); }
  for (const shape of e.replace || []) {
    if (!has(shape.id)) return "no such shape: " + shape.id;
    draw = draw.map(x => (x.id === shape.id ? shape : x));
  }
  for (const style of e.restyle || []) {             // only how it looks: fill, edge, colour; never where it is
    if (!has(style.id)) return "no such shape: " + style.id;
    const bad = Object.keys(style).find(k => !["id", "fill", "edge", "color"].includes(k));
    if (bad) return "restyle changes only fill, edge and color, not " + bad;
    let look = style;
    if (typeof style.fill === "string") {            // a fill in the short notation: "fade:0,1/0,0/0,60"
      try { look = { ...style, fill: parseShape("rect - 0,0,1,1 " + style.fill).fill }; } catch (err) { return `${style.id}: ${err.message}`; }
    }
    draw = draw.map(x => (x.id === style.id ? { ...x, ...look } : x));
  }
  for (const { after, ...shape } of e.add || []) {
    if (shape.id && has(shape.id)) return "shape already exists: " + shape.id;
    if (after && !has(after)) return "no such shape: " + after;
    const at = after ? draw.findIndex(x => x.id === after) + 1 : draw.length;
    draw.splice(at, 0, shape);
  }
  if (draw.length > 200) return "too many shapes";
  return { ...picture, version: picture.version + 1, draw,
           ...(e.cycles ? { cycles: e.cycles } : {}), ...(e.overlays ? { overlays: e.overlays } : {}) };
}

// One of several phrasings, never the same one twice in a row.
function pickVariant(g, list, key) {
  if (list.length === 1) return list[0];
  const last = g.recent[key];
  let i;
  if (last === undefined) i = rollBetween(g, 0, list.length - 1);
  else { i = rollBetween(g, 0, list.length - 2); if (i >= last) i++; }   // any but the last one
  g.recent[key] = i;
  return list[i];
}

// Drop empty fields from an applied effect (null, undefined).
const clean = (x) => Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined && v !== null));
