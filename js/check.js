// Checker: can a world be finished, and is it fair? Reads the puzzles a world describes as data (state.puzzles,
// BRIEF.md §4) and plays them, for each ending, through the real parser and engine, the way a player would type
// them: walking between rooms, picking up what's needed, solving each puzzle with its own commands. Pure: never
// touches the page; used by the tests now, and later to check a world the AI builds before it's played.
//
// Also: the world's opening keeps the contract of BRIEF.md §3 (checkOpening in js/checklint.js): its room in an area of its own, a closed place,
// one thing to take (the hints thing) and one carried (the intro), no word of the three things used by anything else. Its mechanics
// are the engine's, pinned in tests/openings.test.js, not played here.
//
// Also: the ending's picture (BRIEF.md §7): every `end` effect (and every vision's `dream.picture`) names a picture the world has, a world that can hurt the player
// has a `died` picture (the one the story ends with when health runs out), and each picture in `state.pictures` is well formed
// and described (`alt`, in the world file: the ending's `add picture`). Every room's picture is held to the same drawing checks.
//
// Also: pictures are language-free (ART-DIRECTION.md §5). No picture, room's or ending's, carries an `alt` of its own, nor any of
// its overlays: the world file says what they look like, in its language (the room's `alt`; its `overlayAlt` for each overlay;
// an ending's `add picture` `alt`), and the checker finds a picture that carries one, an ending with none and an overlay with none.
//
// Also, in what a world writes (BRIEF.md §6): every command in backticks in a text parses in the world's language and names something the
// world has (commandProblems); a room's text that names one of its scenery nouns with an obvious verb nothing answers is warned of
// (sceneryVerbWarnings); and a world written in a language whose pack lists regional words (`words.regional`: Spanish from Spain) is warned
// of a word of the other region, with the preferred one (regionalWarnings).
//
// Also: questions for words (BRIEF.md §8): an `ask` that no rule catches, and player.answers.<key> read where nothing asks "<key>",
// are warned of (answerWarnings).
//
// Also: the cells add up (BRIEF.md §2): inside one area, a way north, south, east or west leads to the cell next door that way (x grows east,
// y south: north is y − 1), or is marked `passage: true`; else it is a problem, as a taken cell is a refusal (cellProblems in js/checklint.js). The map
// draws a line, and a tap on a room walks, only between neighbouring cells, so a world with north drawn south loses both.
//
// Also: an exit with a condition (`{ to, if, closed }`) is well formed, and can open: the playthrough waits for the hour
// of a timed one, and a way no property or hour could ever open is warned of (neverOpen in js/checklint.js).
//
// Also: every exit leads where it says (and rooms can be gone to by name, and stairs climbed), what things offer when
// clicked does something (and repeats nothing the engine offers itself), a source's topic for a thing that comes from it doesn't say
// that thing's `again` line, and everything a text mentions answers: what it marks,
// the room's scenery words, and its `mentions`, which list only the rest (warned of when they repeat one of those; BRIEF.md §9).
//
// A puzzle: { where?, needs: [thing or puzzle ids], solve: [commands], gives?: [things], reaches?: room,
//             ending?: true, clues: [object, rule or puzzle ids], time?: "next 22:00" }
// `time`: when it can be solved; the checker moves the world's clock there first (a player would play on, or wait).
// Two puzzles that give the same thing are two ways to it: each ending takes the first written, and a way no ending took is played
// too, in the first ending that needs what it gives (endings["<ending>/<puzzle>"]).
//
// Also: the world's music (MUSIC.md §4) is never a problem: what the forgiving reader (js/music.js) skipped or brought into range is
// listed as warnings, "music: …", and a world with no `add music` is warned of once (NO_MUSIC: every world has music, BRIEF.md §7b);
// nothing else about music is looked at.
//
// Also, given the bible (the third argument): its blurb is 110–160 characters and its thumbnail names one of the world's room pictures
// (never an ending's or `died`) with a whole-number x from 0 to 95 (bibleProblems in js/checklint.js; BRIEF.md §1). Without a bible these aren't looked at.
//
//   check(state, pack, bible?, { before? }) → { ok, problems: [...], warnings: [...], endings: { id (or "id/way"): [commands played; "@time <when>" is a puzzle's `time`: replay with replayCommand] } }
//   before(state, command, puzzle): called before each command a puzzle's `solve` types, with the state it is typed in (for the
//   tests that try other commands there: tests/use.test.js, "use A with B" both ways). Never changes the run.
//
// The lints of a world as written (everything above but the playthrough: js/checklint.js, `lintWorld`) run first; the playthrough here only
// when they found no problem. The checker's cache key (tools/checked.mjs) hashes every file of js/, so both files are in it.

import { parse } from "./parser.js";
import { step, applyChangeSet, holds, exitNow } from "./engine.js";
import { placeOf, inScope } from "./place.js";
import { solveCommand } from "./narrator.js";
import { isExitObject, exitTo } from "./exits.js";
import { moveTo, worldTime } from "./time.js";
import * as opening from "./opening.js";
import { musicOf } from "./music.js";
import { moverIds, placeNow, placeHolding, inSeconds } from "./movers.js";
import { lintWorld, checkOpening, atHour, opensByWaiting, effectsOf, NO_MUSIC, route } from "./checklint.js";

export function check(state, pack, bible, { before = null } = {}) {
  const problems = [], warnings = [...(state.warnings || [])], endings = {};   // (the world's own, found when it loaded: js/fields.js)
  for (const n of musicOf(state)?.notes ?? []) warnings.push(`music: ${n.text}`);   // what the music's reader did: never a problem
  if (state.music == null) warnings.push(NO_MUSIC);                                   // every world has music: warned, never a problem
  // The opening's way on `reaches: "entrance"`: wherever the world says it leads.
  // (With no world yet, there's nowhere for it to lead: the opening's puzzles are left out.)
  const puzzles = Object.fromEntries(Object.entries(state.puzzles || {})
    .filter(([, p]) => p.reaches !== "entrance" || state.entrance)
    .map(([id, p]) => [id, p.reaches === "entrance" ? { ...p, reaches: state.entrance } : p]));
  if (state.entrance && !state.world.rooms[state.entrance])
    problems.push(`the opening's way on leads to "${state.entrance}", which isn't a room`);
  if (!Object.keys(puzzles).length) return { ok: false, problems: ["the world describes no puzzles"], warnings, endings };
  if (!state.opening) problems.push("the world has no opening");
  else for (const why of checkOpening(state, pack)) problems.push("the opening: " + why);

  lintWorld(state, pack, bible, puzzles, problems, warnings);
  if (problems.length) return { ok: false, problems, warnings, endings };

  // Each ending, from a fresh start (and the pictures they end with).
  const played = new Set(), runs = [];
  const play = (name, id, prefer) => {
    const run = new Run(state, pack, puzzles, warnings, before, prefer);
    run.solve(id);
    if (run.problem) problems.push(`ending "${name}": ${run.problem}`);
    else if (!run.state.ended) problems.push(`ending "${name}": played to the end, but the story didn't end`);
    else if (!run.state.ending) problems.push(`ending "${name}": the story ended without a picture (end: true, picture: "…")`);
    else played.add(run.state.ending);
    endings[name] = run.played;
    runs.push({ id, solved: run.solved });
  };
  for (const [id, p] of Object.entries(puzzles)) if (p.ending) play(id, id);
  // Another way to the same thing (two puzzles give it: the shell or the cat gets you the parcel): the endings above take the way
  // written first; a puzzle no ending took is played too, in the first ending that took another way to what it gives, as
  // "<ending>/<puzzle>". A puzzle that gives nothing an ending needs is not played.
  for (const [alt, q] of Object.entries(puzzles)) {
    if (q.ending || runs.some(r => r.solved.has(alt))) continue;
    const thing = (q.gives || []).find(g => runs.some(r => [...r.solved].some(x => (puzzles[x]?.gives || []).includes(g))));
    if (thing) { const via = runs.find(r => [...r.solved].some(x => (puzzles[x]?.gives || []).includes(thing))); play(`${via.id}/${alt}`, via.id, { [thing]: alt }); }
  }
  // Every ending is played: an `end` in a rule or a named change whose picture no `ending: true` puzzle reached (a bad ending
  // reached by a rule alone, walking into the sand) was never checked. A death that ends with `died` is not one: that is how
  // running out of health ends, whatever the hurt.
  for (const { effect: e, where } of effectsOf(state))
    if (e.end === true && typeof e.picture === "string" && e.picture !== "died" && !played.has(e.picture))
      warnings.push(`${where}: ends the story with "${e.picture}", but no puzzle with ending: true reaches it, so that ending is never played: give it a puzzle (ending: true, its solve and hints)`);
  return { ok: !problems.length, problems, warnings, endings };
}

const TIME_MARK = "@time ";
export function replayCommand(state, command, pack, at = 0) {
  if (command.startsWith(TIME_MARK)) {
    const r = applyChangeSet(state, { effects: [{ time: command.slice(TIME_MARK.length) }] });
    return { state: r.refused.length ? state : r.next, refused: r.refused.map(x => x.reason), error: null };
  }
  const parsed = parse(command, state, pack);
  if (!parsed.actions) return { state, refused: [], error: parsed.error || parsed.meta || "not understood" };
  const refused = [];
  let t = at;
  for (const action of parsed.actions) {
    const r = step(state, { ...action, at: (t += 1000) });
    if (r.refused.length) { refused.push(...r.refused.map(x => x.reason)); break; }
    state = r.next;
    if (state.pending.question) break;
  }
  return { state, refused, error: null };
}

// One playthrough towards a goal.
class Run {
  // prefer: { thing: puzzle }, the way to get a thing that more than one puzzle gives (else the first written).
  constructor(state, pack, puzzles, warnings = [], before = null, prefer = {}) {
    this.state = state; this.pack = pack; this.puzzles = puzzles; this.warnings = warnings; this.before = before; this.prefer = prefer;
    this.solved = new Set(); this.played = []; this.problem = null; this.clock = 0;
  }

  // Type a command, as a player would. Fails on words the parser can't read or effects the engine refuses.
  type(command) {
    if (this.problem) return;
    command = solveCommand(command, this.pack);
    this.played.push(command);
    const parsed = parse(command, this.state, this.pack);
    if (!parsed.actions) return this.fail(`"${command}" isn't understood (${parsed.error ? parsed.error.say : parsed.meta})`);
    for (const action of parsed.actions) {
      const r = step(this.state, { ...action, at: (this.clock += 1000) });
      if (r.refused.length) return this.fail(`"${command}": the engine refused ${r.refused[0].reason}`);
      this.state = r.next;
      if (this.state.pending.question) break;
    }
  }
  fail(why) { if (!this.problem) this.problem = why; }

  // Solve a puzzle: first what it needs, then go where it is, then its commands; then check it did what it says.
  solve(id) {
    if (this.problem || this.solved.has(id)) return;
    const p = this.puzzles[id];
    this.solved.add(id);
    for (const n of p.needs || []) {
      if (this.puzzles[n]) this.solve(n);
      else this.get(n, id);
    }
    if (p.where) this.go(p.where);
    if (p.time) {
      const r = applyChangeSet(this.state, { effects: [{ time: p.time }] });
      if (r.refused.length) return this.fail(`"${id}": ${r.refused[0].reason}`);
      this.state = r.next;
      this.played.push(TIME_MARK + p.time);   // (a replay of the commands moves the clock here too: see replayCommand)
    }
    // (a thing that moves, found in another room for one command: the next is typed back where the puzzle is, as a player would go back)
    p.solve.forEach((c, i) => {
      const room = this.state.player.at;
      this.meet(c, id);
      const went = this.state.player.at !== room;
      if (this.before && !this.problem) this.before(this.state, solveCommand(c, this.pack), id);
      this.type(c);
      if (went && i < p.solve.length - 1 && !this.state.ended) this.go(room);
    });
    if (this.problem) return;
    const s = this.state;
    for (const g of p.gives || []) if (!s.world.objects[g] || !inScope(s, g)) return this.fail(`solving "${id}" should give "${g}", but it isn't to hand`);
    if (p.reaches && s.player.at !== p.reaches) return this.fail(`solving "${id}" should reach ${p.reaches}, but you're in ${s.player.at}`);
  }

  // A thing that moves, needed by a command of a puzzle (the command's thing or its second, or the source either comes from: "buy
  // ticket" needs the clerk), is found as a player would find it: waited for where its round comes by (turns, or the play time to its
  // next step), while none of its places holds; for a `places` one, the clock moved to the soonest hour it is here (as a puzzle's `time`
  // is); else gone to, where it is now. A command that needs none, or one already here, changes nothing.
  meet(command, puzzle) {
    if (this.problem) return;
    const s = this.state, away = moverIds(s).filter(id => s.world.objects[id].at !== s.player.at);
    if (!away.length) return;
    const all = structuredClone(s);
    for (const id of away) all.world.objects[id].at = s.player.at;            // (everything that moves, here: what the command names)
    const needed = new Set();
    for (const a of parse(solveCommand(command, this.pack), all, this.pack).actions || [])
      for (const x of [a.obj, a.obj2]) for (const y of [x, all.world.objects[x]?.from]) if (away.includes(y)) needed.add(y);
    for (const id of needed) this.find(id, puzzle, command);
  }
  find(id, puzzle, command) {
    const wait = this.pack.words.verbs.wait[0], thing = () => this.state.world.objects[id];
    for (let tries = 0; tries < 200 && !this.problem && thing().at !== this.state.player.at; tries++) {
      const o = thing(), here = this.state.player.at, rec = this.state.movers?.[id];
      if (o.rounds?.rooms?.includes(here) && !(o.places && placeHolding(this.state, o, holds))) {   // it comes round: wait for it
        if (inSeconds(o.rounds) && rec?.due > this.clock + 1000) this.clock = rec.due - 1000;   // (the play time to its next step)
        this.type(wait);
        continue;
      }
      if (o.places) {                                                          // the soonest hour one of its places is here
        const now = worldTime(this.state), hours = [...Array(24).keys()].map(h => [moveTo(`next ${h}:00`, now).to, h]).sort((a, b) => a[0] - b[0]);
        const later = hours.map(([, h]) => atHour(this.state, h)).find(x => x && placeNow(x, x.world.objects[id], holds) === here);
        if (later) { this.state = later; continue; }
      }
      if (o.at && this.state.world.rooms[o.at] && o.at !== here) { this.go(o.at); continue; }   // where it is now
      break;
    }
    if (!this.problem && thing().at !== this.state.player.at)
      this.fail(`"${command}" (${puzzle}) needs ${id}, which moves, but it can't be found where the command is typed, nor waited for`);
  }

  // Get a thing: if a puzzle gives it, solve that; then pick it up wherever it lies.
  get(thing, forPuzzle) {
    if (this.problem || this.state.player.carrying.includes(thing)) return;
    const giver = this.prefer[thing] ?? Object.entries(this.puzzles).find(([, p]) => (p.gives || []).includes(thing))?.[0];
    if (giver) this.solve(giver);
    if (this.problem || this.state.player.carrying.includes(thing)) return;
    const o = this.state.world.objects[thing];
    const place = placeOf(this.state, thing);
    if (!o || !this.state.world.rooms[place]) return this.fail(`"${forPuzzle}" needs "${thing}", but it can't be found`);
    this.go(place);
    const noun = o.words?.nouns?.[0] ?? thing;
    const take = this.pack.words.verbs.take[0];
    this.type(take + " " + noun);
    if (!this.problem && !this.state.player.carrying.includes(thing)) this.fail(`"${take} ${noun}" didn't pick up "${thing}"`);
  }

  // Walk to a room by its open exits (waiting for the hour of a timed one). If there's no way, solve a puzzle that opens one (it `reaches` somewhere and
  // can be reached itself: the green door, the boat), and try again.
  go(room) {
    if (this.problem || this.state.player.at === room) return;
    let path = route(this.state, this.state.player.at, room);
    while (!path) {
      const opener = Object.entries(this.puzzles).find(([id, p]) => p.reaches && !this.solved.has(id) &&
        (!p.where || p.where === this.state.player.at || route(this.state, this.state.player.at, p.where)));
      if (!opener) return this.fail(`can't get from ${this.state.player.at} to ${room}`);
      this.solve(opener[0]);
      if (this.problem) return;
      path = route(this.state, this.state.player.at, room);
    }
    // One step at a time: a condition may turn you the wrong way (js/movement.js), and then the walk goes on from wherever you
    // are (a wrong turn only ever leads to a room you have been to, so there is always a way back).
    for (let steps = 0; path?.length && !this.problem; steps++) {
      if (steps > 60) return this.fail(`can't get from ${this.state.player.at} to ${room}: the walk keeps going astray`);
      const dir = path[0], here = this.state.player.at, raw = this.state.world.rooms[here].exits[dir];
      const shut = !exitNow(this.state, here, dir).go;                   // (its `if`, or a locked thing that leads that way)
      if (shut) {                                                        // shut: wait for its hour (the clock moves, as a puzzle's `time` does)
        const later = opensByWaiting(this.state, here, dir);
        if (!later) return this.fail(`${dir} from ${here} is shut, and waiting doesn't open it`);
        this.state = later;
      }
      this.type(this.pack.words.dirs[dir][0]);
      if ((isExitObject(raw) || shut) && !this.problem && this.state.player.at === here) return this.fail(`${dir} from ${here}: the way stays shut`);
      if (this.problem || this.state.ended) return;
      const at = this.state.player.at;
      if (at === exitTo(raw) || at === here) { path = path.slice(1); continue; }   // as planned (or held here: on with the walk as written)
      path = route(this.state, at, room);                                          // astray: the way from here
      if (!path) return this.fail(`can't get from ${at} to ${room}`);
    }
  }
}
