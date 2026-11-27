// The walkthrough: how a puzzle is played, step by step, as a player plays it (BRIEF.md §4): what it needs first (a puzzle that gives it, or the
// thing taken where it lies, its closed container opened and a locked one unlocked with its key), the walk to `where` (the keys of the locks on
// the way taken first, each lock turned as it comes, waiting for the hour of a timed way), its `time`, then its own steps (a thing a step names, left
// in another room, fetched first: Run.fetch). Pure: steps the engine
// on the states it is given (each step a new state), never the page and never the parser. js/check.js plays every ending with it; the hints
// (js/engine.js, nextHint) list what it does for the next puzzle, so the checker and the hints can never differ.
//
// A puzzle's `solve` is a list of steps, the same in every language: a direction ("n", "s", "e", "w", "u", "d", "in", "out"), or an action by id
// in the engine's own shape, with only the fields a world writes (STEP_FIELDS): { verb, obj?, obj2?, topic?, text?, value? }.
//   actionOf(state, step) → { action } | { why, lost? }   the action the engine is given for the step where it is played (what a player's command
//                                                   gives there: an answer answers the question open, a thing out of reach is named only by a verb
//                                                   that may name one from afar), or why it can't be played there (`lost`: the thing out of reach)
//   new Run(state, puzzles, { before?, clock? })    one playthrough; run.solve(id) plays a puzzle and what it needs. run.steps: what it did, in order,
//                                                   each { kind, step, action, state (the game as it was before it), puzzle }; run.problem / problemId
//                                                   when it got stuck (js/checks/registry.js's `play.*`)
//   hintRun(state, id) → Run                         the walkthrough of the puzzle `id` alone from here (every other puzzle counted done), ending
//                                                   with what it gives in your hands
//   hintSteps(state, id) → [{ kind, step, state }]  what the hints' last level lists for the puzzle `id` from here: its own steps and the ones a
//                                                   player must also do on the way (a lock turned, a container opened, a thing taken: SHOWN), then
//                                                   the takes of what it gives; never the walk
// Also the walks it needs, which the checks read too (js/checks/space.js): route, lockOn, opensByWaiting, atHour, ruleMoves.

import { step, applyChangeSet, holds, exitNow, had } from "./engine.js?v=0.74.3";
import { placeOf, inScope, chainOf, shut } from "./place.js?v=0.74.3";
import { isExitObject, exitTo, waysOf } from "./exits.js?v=0.74.3";
import { moveTo, worldTime, parts } from "./time.js?v=0.74.3";
import { moverIds, placeNow, placeHolding, inSeconds } from "./movers.js?v=0.74.3";
import { DIRECTIONS } from "./space.js?v=0.74.3";
import { ACTIONS } from "./actions.js?v=0.74.3";
import { FIELDS } from "./fields.js?v=0.74.3";

// ---- A step of a solve ---------------------------------------------------------------------------------------------------------------
// The fields an action of a solve may have (the engine's own: js/parser.js gives them, js/engine.js step reads them; the list is js/fields.js's
// FIELDS.step). What the parser adds from the words or the moment (absent, askFor, question, blank) is worked out here, as the parser
// would: no world writes it. Not `prep`: no rule compares it (js/engine.js, matches).
export const STEP_FIELDS = FIELDS.step;
// The verb of an answer: to a yes/no question (`value`: "yes" or "no"), or to a question for words (`text`).
export const ANSWER = "answer";
export const isDirection = (s) => typeof s === "string" && DIRECTIONS.includes(s);

// A verb that may name a thing that isn't here ("buy ticket", "wait for the train", "accuse Voss"): the engine's own, or one a world added.
const fromAfar = (state, verb) => !!(ACTIONS[verb]?.absent || state.vocab?.[verb]?.absent);

export function actionOf(state, s) {
  if (isDirection(s)) return { action: { verb: "go", dir: s } };
  if (!s || typeof s !== "object" || typeof s.verb !== "string") return { why: `${JSON.stringify(s)} is neither a direction nor an action` };
  const a = {};
  for (const k of STEP_FIELDS) if (s[k] !== undefined) a[k] = s[k];
  const objects = state.world.objects;
  if (a.verb === ANSWER) {                                            // the question open now, as the parser reads an answer (layer 0)
    let q = state.pending.question;
    if (q?.yesNo && a.value === undefined) q = q.then ?? null;        // (words typed over a yes/no asked over a question for words answer that one)
    if (!q || (a.value !== undefined && !q.yesNo) || (a.value === undefined && (q.yesNo || q.choices)))
      return { why: "it answers a question, but none of that kind is open there" };
    return { action: { ...a, question: q.ask, ...(a.text !== undefined ? { blank: !String(a.text).trim() } : {}) } };
  }
  const away = [a.obj, a.obj2].filter(id => id !== undefined && !(objects[id] && inScope(state, id)));
  for (const id of away) if (!objects[id]) return { why: `"${id}" is no thing of the world` };
  // Out of reach: only a verb that may name a thing from afar names it (and whoever you ask is here: what you ask for may not be).
  const may = (id) => fromAfar(state, a.verb) && !(a.verb === "ask" && id === a.obj);
  const lost = away.find(id => !may(id));
  if (lost) return { why: `"${lost}" is not in reach there`, lost };
  if (away.length) a.absent = away;
  if (a.verb === "ask" && a.obj2 !== undefined && a.topic === undefined) Object.assign(a, { topic: "?", askFor: true });   // asking for a thing
  if (a.verb === "wait" && a.obj !== undefined && a.text === undefined) a.text = "";   // waiting for a thing is said with words ("wait for the train")
  return { action: a };
}

// The step an action of the engine is, as a world writes it: what a player's command did, by id (the hints' wording is read back to it, and
// a command typed there is the step when stepOf gives it back). A walk that names no thing is its direction; opening a thing with a second (Spanish
// "abrir la puerta con la llave") is unlocking it; asking for a thing names it as `obj2` (and ordering it from its source, Spanish *pedir*, is the same step); what a wait waits for is its thing, or the room's `waitFor`;
// the words of the command (prep, what was typed after "wait") are left out.
export function stepOf(a) {
  if (!a || typeof a !== "object") return a;
  if (a.verb === "go" && typeof a.dir === "string" && !a.obj) return a.dir;
  const s = {};
  for (const k of STEP_FIELDS) if (a[k] !== undefined) s[k] = a[k];
  if (s.verb === "open" && s.obj2 !== undefined) s.verb = "unlock";
  // Ordering a thing from its source is asking the source for it (js/engine.js, wanted: the same path, the same answer). Spanish has no word for "for"
  // after ask: asking for a thing is *pedir* (PARSER.md, decision 51), which the parser reads as ORDER, so the step `ask dot for tea` and the command
  // *Pedir té a Dot* are one step.
  if (s.verb === "order" && s.obj2 !== undefined) return { verb: "ask", obj: s.obj2, obj2: s.obj };
  if (s.topic === "?") delete s.topic;
  if (s.verb === "wait") delete s.text;
  if (s.verb === ANSWER && s.value !== undefined) delete s.text;
  return s;
}
// Are these two the same step (fields in any order; words said or answered without regard to case, as the engine reads them)?
export const sameStep = (x, y) => JSON.stringify(sorted(stepOf(x))) === JSON.stringify(sorted(stepOf(y)));
const sorted = (s) => (s && typeof s === "object" ? Object.fromEntries(Object.entries(s).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, k === "text" ? String(v).trim().toLowerCase() : v])) : s);

// ---- The walks -----------------------------------------------------------------------------------------------------------------------
// The world's clock moved to the next time it is h:00 (null if the engine refuses).
export function atHour(state, h) {
  const r = applyChangeSet(state, { effects: [{ time: `next ${h}:00` }] });
  return r.refused.length ? null : r.next;
}

// The game as it would be after waiting, soonest first, until this exit is open: the first hour at which its
// conditions hold (everything else as it is now). Null when no hour opens it: it needs something else first.
export function opensByWaiting(state, room, dir) {
  const now = worldTime(state);
  const hours = [...Array(24).keys()].map(h => [moveTo(`next ${h}:00`, now).to, h]).sort((a, b) => a[0] - b[0]);
  for (const [, h] of hours) {
    const s = atHour(state, h);
    if (s && exitNow(s, room, dir).go) return s;
  }
  return null;
}

// A move by a rule (BRIEF.md §2: travel that is not a step, a stair that is not under the room above it): a rule on `go <dir>` that asks only where you
// are and `travel`s. The way is `true` on the room's compass (a rule answers it); the walk may use it. Map "room dir" → the room it travels to.
export function ruleMoves(state) {
  const moves = new Map();
  for (const r of state.rules || []) {
    const m = r.match || {}, at = Array.isArray(r.if) && r.if.length === 1 ? r.if[0]?.["player.at"] : null;
    const to = (r.do || []).find(e => e && typeof e.travel === "string")?.travel;
    if (m.verb === "go" && typeof m.dir === "string" && !m.obj && typeof at === "string" && to) moves.set(at + " " + m.dir, to);
  }
  return moves;
}

// The shortest walk between two rooms by exits that lead to rooms (a shut one counts when waiting for its hour opens
// it; with `locks`, a way shut by a locked thing counts too, the player unlocking it on the way: see lockOn): a list of directions, or null.
// A way a rule answers counts when a rule moves you along it (ruleMoves).
export function route(state, from, to, { locks = false } = {}) {
  const seen = new Set([from]), queue = [[from, []]], moves = ruleMoves(state);
  while (queue.length) {
    const [room, path] = queue.shift();
    if (room === to) return path;
    for (const [dir, raw] of Object.entries(state.world.rooms[room].exits || {})) {
      const moved = exitTo(raw) === true ? moves.get(room + " " + dir) : null;
      const next = moved ?? exitTo(raw);
      if (typeof next !== "string" || seen.has(next) || !state.world.rooms[next]) continue;
      if (!moved && !exitNow(state, room, dir).go && !opensByWaiting(state, room, dir) && !(locks && lockOn(state, room, dir))) continue;   // shut, and waiting won't open it
      seen.add(next); queue.push([next, [...path, dir]]);
    }
  }
  return null;
}

// The locked thing that shuts a way (its `door` or `leads` that way, `locked: true`) and has a key to open it (`lock.key`), as { id, key }; else null.
// This is the engine's own property (js/engine.js, lockedWay and unlock): the walk follows it, so a world needs no puzzle to say "take the key".
export function lockOn(state, room, dir) {
  for (const [id, o] of Object.entries(state.world.objects))
    if (o.at === room && o.locked === true && waysOf(o).includes(dir) && typeof o.lock?.key === "string" && state.world.objects[o.lock.key]) return { id, key: o.lock.key };
  return null;
}

// ---- One playthrough -----------------------------------------------------------------------------------------------------------------
// The kinds of step a run takes: the walk (a direction on the way), a wait (for a thing that moves), the clock moved (a puzzle's `time`, or the hour
// of a timed way), a thing taken, a container opened, a lock turned (each one the walk adds), and the puzzle's own steps (`solve`).
// What the hints list of them: everything a player does but walk and wait.
export const SHOWN = new Set(["take", "open", "unlock", "solve"]);
const TICK = 1000;

export class Run {
  // prefer: { thing: puzzle }, the way to get a thing that more than one puzzle gives (else the first written). before(state, action, puzzle): called
  // before each step of a puzzle's solve, with the state it is played in (tests try other commands there). clock: the play time the run starts at.
  constructor(state, puzzles, { before = null, prefer = {}, clock = state.clock ?? 0 } = {}) {
    this.state = state; this.puzzles = puzzles; this.before = before; this.prefer = prefer;
    this.solved = new Set(); this.steps = []; this.skipped = false; this.current = null; this.problem = null; this.problemId = null; this.clock = clock; this.unlocking = new Set();
  }

  // Play one step, as a player would: refused when it can't be played there (`play.not-in-reach`) or the engine refuses it.
  act(s, kind) {
    if (this.problem) return;
    const { action, why } = actionOf(this.state, s);
    if (!action) return this.fail("play.not-in-reach", `${JSON.stringify(s)} can't be played in ${this.state.player.at}: ${why}`);
    const record = { kind, step: s, action, state: this.state, puzzle: this.current };
    const r = step(this.state, { ...action, at: (this.clock += TICK) });
    if (r.refused.length) return this.fail("play.engine-refused", `${JSON.stringify(s)}: the engine refused ${r.refused[0].reason}`);
    this.state = r.next;
    this.steps.push({ ...record, at: this.state.player.at });   // (`at`: where it left you: a replay must be there too)
  }
  // The clock moved (a puzzle's `time`, or the hour a timed way or a thing that moves waits for): a step of its own, so a replay moves it too.
  time(when, kind = "time") {
    const r = applyChangeSet(this.state, { effects: [{ time: when }] });
    if (r.refused.length) return this.fail("play.time-refused", `"${this.current}": ${r.refused[0].reason}`);
    this.steps.push({ kind, step: null, time: when, state: this.state, puzzle: this.current, at: r.next.player.at });
    this.state = r.next;
  }
  fail(id, why) { if (!this.problem) { this.problem = why; this.problemId = id; } }

  // Solve a puzzle: first what it needs, then go where it is, then its steps; then check it did what it says.
  solve(id) {
    if (this.problem || this.solved.has(id)) return;
    const p = this.puzzles[id];
    this.solved.add(id);
    const outer = this.current;                           // (the puzzle each step belongs to, for a problem that names it)
    this.current = id;
    for (const n of p.needs || []) {
      if (this.puzzles[n]) this.solve(n);
      else this.get(n, id);
      this.current = id;
    }
    if (p.where) this.go(p.where);
    if (p.time) this.time(p.time);
    // A thing a puzzle gives that can't be carried counts as given once seen (had, js/engine.js): one already seen before the solve is played makes
    // the puzzle done at once, and the hints would pass over it. (A thing that can be carried, had already, is a second way to it: fine.)
    const early = !this.problem && (p.gives || []).find(x => this.state.world.objects[x] && this.state.world.objects[x].portable !== true && had(this.state, x));
    if (early) return this.fail("play.given-before", `"${id}" gives "${early}", which can't be carried and is already in view before the puzzle is solved: it would count as done at once and the hints would pass over it. Let the solve bring "${early}" into the world (a rule that moves it there), or say what the solve changes with \`sets\``);
    // The step player: before each step, a thing it names that was left in another room is fetched (fetch), and a thing that moves is found
    // (meet). (A thing that moves, found in another room for one step: the next is played back where the puzzle is, as a player would go back.)
    (p.solve || []).forEach((s, i) => {
      const room = this.state.player.at;
      this.fetch(s, id);
      this.meet(s, id);
      const went = this.state.player.at !== room;
      if (this.before && !this.problem) { const a = actionOf(this.state, s).action; if (a) this.before(this.state, a, id); }
      this.act(s, "solve");
      if (went && i < p.solve.length - 1 && !this.state.ended) this.go(room);
    });
    this.current = outer;
    if (this.problem) return;
    const g = this.state;
    // What it gives: a thing that can be carried is to hand (the hints take it: hintRun); one that can't has been seen to hand (had, js/engine.js).
    const given = (x) => g.world.objects[x] && (g.world.objects[x].portable === true ? inScope(g, x) : had(g, x));
    for (const x of p.gives || []) if (!given(x)) return this.fail("play.gives-missing", `solving "${id}" should give "${x}", but it isn't to hand`);
    if (p.reaches && g.player.at !== p.reaches) return this.fail("play.reaches-missed", `solving "${id}" should reach ${p.reaches}, but you're in ${g.player.at}`);
    if (p.sets && !holds(g, [{ [p.sets]: true }])) return this.fail("play.sets-missed", `solving "${id}" should make ${p.sets} true, but it isn't`);
  }

  // A thing that moves, named by a step of a puzzle (its thing or its second, or the source either comes from: buying the ticket needs the clerk),
  // is found as a player would find it: waited for where its round comes by (turns, or the play time to its next step), while none of its places
  // holds; for a `places` one, the clock moved to the soonest hour it is here (as a puzzle's `time` is); else gone to, where it is now. A step that
  // names none, or one already here, changes nothing.
  meet(s, puzzle) {
    if (this.problem || !s || typeof s !== "object") return;
    const g = this.state, away = new Set(moverIds(g).filter(id => g.world.objects[id].at !== g.player.at));
    if (!away.size) return;
    const needed = new Set();
    for (const x of [s.obj, s.obj2]) for (const y of [x, g.world.objects[x]?.from]) if (away.has(y)) needed.add(y);
    for (const id of needed) this.find(id, puzzle, s);
  }
  find(id, puzzle, s) {
    const thing = () => this.state.world.objects[id];
    for (let tries = 0; tries < 200 && !this.problem && thing().at !== this.state.player.at; tries++) {
      const o = thing(), here = this.state.player.at, rec = this.state.movers?.[id];
      if (o.rounds?.rooms?.includes(here) && !(o.places && placeHolding(this.state, o, holds))) {   // it comes round: wait for it
        if (inSeconds(o.rounds) && rec?.due > this.clock + TICK) { this.clock = rec.due - TICK; this.skipped = true; }   // (the play time to its next step: no step says it, so a replay can't)
        this.act({ verb: "wait" }, "wait");
        continue;
      }
      if (o.places) {                                                          // the soonest hour one of its places is here
        const now = worldTime(this.state), hours = [...Array(24).keys()].map(h => [moveTo(`next ${h}:00`, now).to, h]).sort((a, b) => a[0] - b[0]);
        const h = hours.map(([, h]) => h).find(h => { const x = atHour(this.state, h); return x && placeNow(x, x.world.objects[id], holds) === here; });
        if (h !== undefined) { this.time(`next ${h}:00`, "wait"); continue; }
      }
      if (o.at && this.state.world.rooms[o.at] && o.at !== here) { this.go(o.at); continue; }   // where it is now
      break;
    }
    if (!this.problem && thing().at !== this.state.player.at)
      this.fail("play.mover-lost", `${JSON.stringify(s)} (${puzzle}) needs ${id}, which moves, but it can't be found where the step is played, nor waited for`);
  }

  // A thing a step names (its thing or its second) that can be carried and is out of reach where the step is played (the step's own test:
  // actionOf's `lost`) is fetched first, the way a needed thing is taken (pick: go where it lies, open what holds it, take it), and the walk comes
  // back. Only where the step would fail otherwise; no puzzle that gives it is solved for it (the walk there takes the keys on its way, as any walk
  // does). A thing that can't be got so (not in the world yet, behind a way or a lid nothing done has opened) is left, and the step fails as it
  // would have: the run is put back as it was before the try.
  fetch(s, puzzle) {
    const room = this.state.player.at;
    for (let tries = 0; tries < 2 && !this.problem; tries++) {
      const { lost } = actionOf(this.state, s);
      if (!lost || this.state.world.objects[lost].portable !== true) return;
      const before = { state: this.state, steps: this.steps.length, clock: this.clock, skipped: this.skipped, solved: new Set(this.solved) };
      this.pick(lost, puzzle);
      this.go(room);
      if (this.problem || !this.state.player.carrying.includes(lost) || this.state.player.at !== room) {
        Object.assign(this, { state: before.state, clock: before.clock, skipped: before.skipped, solved: before.solved, problem: null, problemId: null });
        this.steps.length = before.steps;
        return;
      }
    }
  }

  // Get a thing: if a puzzle gives it, solve that; then pick it up wherever it lies. One that can't be carried, had (js/engine.js), needs no take.
  get(thing, forPuzzle) {
    if (this.problem || this.state.player.carrying.includes(thing)) return;
    const giver = this.prefer[thing] ?? Object.entries(this.puzzles).find(([, p]) => (p.gives || []).includes(thing))?.[0];
    if (giver) this.solve(giver);
    if (this.problem || this.state.player.carrying.includes(thing)) return;
    if (this.state.world.objects[thing] && this.state.world.objects[thing].portable !== true && had(this.state, thing)) return;
    this.pick(thing, forPuzzle);
  }
  // Pick a thing up wherever it lies: go there, open what holds it, take it.
  pick(thing, forPuzzle) {
    const o = this.state.world.objects[thing];
    const place = placeOf(this.state, thing);
    if (!o || !this.state.world.rooms[place]) return this.fail("play.thing-unreachable", `"${forPuzzle}" needs "${thing}", but it can't be found`);
    this.go(place);
    this.openAround(thing);
    if (this.problem) return;
    this.act({ verb: "take", obj: thing }, "take");
    if (!this.problem && !this.state.player.carrying.includes(thing)) this.fail("play.take-failed", `taking "${thing}" didn't pick it up`);
  }

  // A thing lying in a closed container (a crate with a lid, a locked chest) is taken as a player takes it: the container is opened first, the
  // outermost first, and a locked one unlocked with its key (the engine's own properties: the world writes no step for it). One that can't be
  // opened (nothing opens it) is left shut, and the take that follows fails on its own.
  openAround(thing) {
    for (const id of chainOf(this.state, thing).slice(1).reverse()) {
      const c = this.state.world.objects[id];
      if (this.problem || !c.container || c.open || !shut(this.state, thing)) continue;
      if (c.locked === true && typeof c.lock?.key === "string") this.unlock(id, c.lock.key);
      else this.act({ verb: "open", obj: id }, "open");
    }
  }

  // Unlock a locked thing (a door, a way, a container) with its key, as a player does: the key taken first (wherever it lies, or from the puzzle
  // that gives it), then back to the thing, and unlock it with the key. `here` is where the thing is.
  unlock(id, key) {
    const o = this.state.world.objects[id], here = o.at && this.state.world.rooms[o.at] ? o.at : placeOf(this.state, id);
    if (!this.state.player.carrying.includes(key)) {
      if (this.unlocking.has(key)) return this.fail("play.lock-stuck", `"${id}" is locked, and its key "${key}" can't be taken without first getting through it`);
      this.unlocking.add(key);
      this.get(key, id);
      this.unlocking.delete(key);
      if (this.problem) return;
      this.go(here);
    }
    this.act({ verb: "unlock", obj: id, obj2: key }, "unlock");
    if (!this.problem && this.state.world.objects[id].locked === true) this.fail("play.lock-stuck", `"${id}" stays locked with its key "${key}"`);
  }

  // The keys of the locks on the way to a room, taken before setting off (a player who knows the way goes for the key first; a thing is not
  // fetched from beyond the door it opens): the walk from here, by every way a lock or a time could open and every puzzle that `reaches` a room.
  keysAhead(room) {
    const s = this.state, seen = new Set([s.player.at]), queue = [[s.player.at, []]];
    const edges = Object.values(this.puzzles).filter(p => p.reaches).map(p => [p.where, p.reaches]);
    while (queue.length) {
      const [at, keys] = queue.shift();
      if (at === room) return keys;
      const next = [];
      for (const [dir, raw] of Object.entries(s.world.rooms[at].exits || {})) {
        const to = exitTo(raw), lock = lockOn(s, at, dir);
        if (typeof to !== "string" || !s.world.rooms[to]) continue;
        if (exitNow(s, at, dir).go || opensByWaiting(s, at, dir)) next.push([to, keys]);
        else if (lock) next.push([to, [...keys, lock.key]]);
      }
      for (const [from, to] of edges) if ((!from || from === at) && s.world.rooms[to]) next.push([to, keys]);
      for (const [to, k] of next) if (!seen.has(to)) { seen.add(to); queue.push([to, k]); }
    }
    return [];
  }

  // Walk to a room by its open exits (waiting for the hour of a timed one). If there's no way, solve a puzzle that opens one (it `reaches` somewhere and
  // can be reached itself: the green door, the boat), and try again.
  go(room) {
    if (this.problem || this.state.player.at === room) return;
    for (const key of this.keysAhead(room)) if (!this.problem && !this.unlocking.has(key)) {   // (the keys of its locks first)
      this.unlocking.add(key); this.get(key, "the way to " + room); this.unlocking.delete(key);
    }
    if (this.problem || this.state.player.at === room) return;
    let path = route(this.state, this.state.player.at, room);
    while (!path) {
      const opener = Object.entries(this.puzzles).find(([id, p]) => p.reaches && !this.solved.has(id) &&
        (!p.where || p.where === this.state.player.at || route(this.state, this.state.player.at, p.where)));
      if (!opener) {                                                 // no puzzle opens a way: a lock does, with its key
        path = route(this.state, this.state.player.at, room, { locks: true });
        if (!path) return this.fail("play.no-route", `can't get from ${this.state.player.at} to ${room}`);
        break;
      }
      this.solve(opener[0]);
      if (this.problem) return;
      path = route(this.state, this.state.player.at, room);
    }
    // One step at a time: a condition may turn you the wrong way (js/movement.js), and then the walk goes on from wherever you
    // are (a wrong turn only ever leads to a room you have been to, so there is always a way back).
    for (let steps = 0; path?.length && !this.problem; steps++) {
      if (steps > 60) return this.fail("play.no-route", `can't get from ${this.state.player.at} to ${room}: the walk keeps going astray`);
      const dir = path[0], here = this.state.player.at, raw = this.state.world.rooms[here].exits[dir];
      const lock = lockOn(this.state, here, dir);
      if (lock && !exitNow(this.state, here, dir).go) { this.unlock(lock.id, lock.key); if (this.problem) return; if (this.state.player.at !== here) { path = route(this.state, this.state.player.at, room, { locks: true }); if (!path) return this.fail("play.no-route", `can't get from ${this.state.player.at} to ${room}`); continue; } }
      const closed = !exitNow(this.state, here, dir).go;                 // (its `if`, or a locked thing that leads that way)
      if (closed) {                                                      // shut: wait for its hour (the clock moves, as a puzzle's `time` does)
        const later = opensByWaiting(this.state, here, dir);
        if (!later) return this.fail("play.no-route", `${dir} from ${here} is shut, and waiting doesn't open it`);
        this.time(`next ${parts(worldTime(later)).hour}:00`, "wait");
      }
      this.act(dir, "walk");
      if ((isExitObject(raw) || closed) && !this.problem && this.state.player.at === here) return this.fail("play.no-route", `${dir} from ${here}: the way stays shut`);
      if (this.problem || this.state.ended) return;
      const at = this.state.player.at;
      if (at === exitTo(raw) || at === here) { path = path.slice(1); continue; }   // as planned (or held here: on with the walk as written)
      path = route(this.state, at, room);                                          // astray: the way from here
      if (!path) return this.fail("play.no-route", `can't get from ${at} to ${room}`);
    }
  }
}

// The walkthrough of the puzzle `id` alone, from the game as it is (the puzzles it needs are done, or the hints would not be at it; no other puzzle
// is solved on the way): a thing it needs that no puzzle gives is taken where it lies, and a thing a step names, left in another room, is fetched
// before the step (Run.fetch). It ends with what the puzzle gives in your hands (the puzzle is done once it has been had: js/engine.js, had): each
// thing taken where the solve left it, the way the walk takes any thing (get); a thing the solve takes itself, or a rule puts in your hands, is held
// already, and one that can't be carried is never asked for (seen to hand, it is had). When the solve has been
// carried out already (what is left to take has been seen, the room it reaches visited, what it sets true), only the takes, if they can be done
// from here: a step done is not asked again. The hints ask it whether a needed thing can be got from here (js/engine.js, nextHint), and list what
// it does (hintSteps). The checker's walk is the Run alone: it takes a given thing when a later puzzle needs it.
export function hintRun(state, id) {
  const p = state.puzzles[id], takes = (x) => (p.solve || []).some(s => s?.verb === "take" && s.obj === x);
  const left = (p.gives || []).filter(x => state.world.objects[x]?.portable === true && !had(state, x) && !takes(x));
  const play = (done) => {
    const run = new Run(state, state.puzzles);
    for (const other of Object.keys(state.puzzles)) if (other !== id || done) run.solved.add(other);
    run.solve(id);
    for (const x of left) run.get(x, id);
    return run;
  };
  const done = left.length && left.every(x => state.seen.things.includes(x)) && (!p.reaches || state.seen.visited.includes(p.reaches)) && (!p.sets || holds(state, [{ [p.sets]: true }]));
  const taken = done ? play(true) : null;
  return taken && !taken.problem ? taken : play(false);
}

// What the hints' last level lists for the puzzle `id`: what its walkthrough alone (hintRun) does, each step a player must do with the game as it
// will be then: its own steps, and the locks turned, the containers opened and the things taken on the way, what it gives taken last (or, its
// solve done, only those takes). Never the walk, a wait or the clock.
// When the walkthrough gets stuck, the puzzle's own steps from here.
export function hintSteps(state, id) {
  const p = state.puzzles[id], run = hintRun(state, id);
  if (run.problem) return (p.solve || []).map(s => ({ kind: "solve", step: s, state }));
  return run.steps.filter(x => SHOWN.has(x.kind)).map(({ kind, step: s, state: before }) => ({ kind, step: s, state: before }));
}
