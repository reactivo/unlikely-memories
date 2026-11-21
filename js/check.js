// Checker: can a world be finished, and is it fair? Reads the puzzles a world describes as data (state.puzzles,
// BRIEF.md §4) and plays them, for each ending, through the real engine, the way a player would: walking between rooms,
// picking up what's needed, solving each puzzle with its own steps (actions by id, played as the engine's actions: the
// walkthrough, js/walkthrough.js, which the hints follow too). Pure: never touches the page; used by the tests, and by the
// game's failsafe on a world the AI hands in (tools/world.mjs).
//
// Also: the world's start room keeps the guarantees of BRIEF.md §3 (checkOpening in js/checks/start.js): one way out, the way thing's exit,
// closed at the start; the world's first puzzle opens it from the start room alone, with its hints; nothing it needs can be lost there;
// the hints thing in place, with words of its own; once out, a way back in; the intro (the text shown at the start) there, in the world's
// language and near its length. The hints thing's mechanics are the engine's, pinned in tests/openings.test.js, not played here.
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
// Also: the plan adds up (BRIEF.md §2): every room is on one square, and a way leads to the room on the next square that way (planChecks in
// js/checks/space.js; the engine builds the exits from the plan, js/plan.js, and refuses a world whose plan does not fit).
//
// Also: an exit with a condition (`{ to, if, closed }`) is well formed, and can open: the playthrough waits for the hour
// of a timed one, and a way no property or hour could ever open is warned of (neverOpen in js/checks/conditions.js).
//
// Also: every exit leads where it says (and rooms can be gone to by name, and stairs climbed), what things offer when
// clicked does something (and repeats nothing the engine offers itself), a source's topic for a thing that comes from it doesn't say
// that thing's `again` line, and everything a text marks answers (a marked label examines the thing it marks, and a thing's own marks answer).
//
// A puzzle: { where?, needs: [thing or puzzle ids], solve: [steps: a direction, or an action by id], gives?: [things], reaches?: room,
//             sets?: "<thing>.<property>", ending?: true, clues: [object, rule or puzzle ids], time?: "next 22:00" }
// `time`: when it can be solved; the checker moves the world's clock there first (a player would play on, or wait), once it has walked to `where`. A wait for a
// timed way or a thing that moves is a "@time" command in the playthrough too, and every ending is played again, as the tests play it (replayProblem).
// Two puzzles that give the same thing are two ways to it: each ending takes the first written, and a way no ending took is played
// too, in the first ending that needs what it gives (endings["<ending>/<puzzle>"]).
//
// Also: the world's music (MUSIC.md §4) is never a problem: what the forgiving reader (js/music.js) skipped or brought into range is
// listed as warnings, "music: …", and a world with no `add music` is warned of once (NO_MUSIC: every world has music, BRIEF.md §7b);
// nothing else about music is looked at.
//
// Also, given the bible (the third argument): it has a blurb (a warning under 60 or over 240 characters: BRIEF says about 20 to 30 words) and its thumbnail names one of the world's room pictures
// (never an ending's or `died`) with a whole-number x from 0 to 95 (bibleProblems in js/checks/cover.js; BRIEF.md §1). Without a bible these aren't looked at.
//
//   check(state, pack, bible?, { before? }) → { ok, problems: [...], warnings: [...], catches: [{ id, level, brief, text }: each problem, then each warning: which check made it, js/checks/registry.js], endings: { id (or "id/way"): [commands played, each worded as a player types it (js/view.js, commandFor; the walk by the pack's first word for each direction); "@time <when>" is a puzzle's `time`: replay with replayCommand] } }
//   before(state, action, puzzle): called before each step of a puzzle's `solve`, with the state it is played in and the engine's action for it
//   (for the tests that try other commands there: tests/use.test.js, "use A with B" both ways). Never changes the run.
//
// The lints of a world as written (everything above but the playthrough: js/checks/lint.js, `lintWorld`; js/checklint.js is their index) run first; the playthrough here only
// when they found no problem. The checker's cache key (tools/checked.mjs) hashes every file of js/, so both files are in it.

import { parse } from "./parser.js?v=0.72.0";
import { step, applyChangeSet } from "./engine.js?v=0.72.0";
import { commandFor } from "./view.js?v=0.72.0";
import { musicOf } from "./music.js?v=0.72.0";
import { withoutPractice } from "./practice.js?v=0.72.0";
import { Run } from "./walkthrough.js?v=0.72.0";
import { lintWorld, openingCatches, Report, effectsOf, NO_MUSIC } from "./checklint.js?v=0.72.0";

export function check(state, pack, bible, { before = null } = {}) {
  state = withoutPractice(state);                       // (HELP's practice thing is the pack's: a world never declares it: js/practice.js)
  const out = new Report(), endings = {};
  const result = (ok) => ({ ok, problems: out.problems, warnings: out.warnings, catches: out.catches(), endings });
  for (const w of state.warnings || []) out.add("fields.warning", w);                 // (the world's own, found when it loaded: js/fields.js)
  for (const n of musicOf(state)?.notes ?? []) out.add("music.note", `music: ${n.text}`);   // what the music's reader did: never a problem
  if (state.music == null) out.add("music.none", NO_MUSIC);                              // every world has music: warned, never a problem
  const puzzles = state.puzzles || {};
  if (!Object.keys(puzzles).length) { out.add("play.no-puzzles", "the world describes no puzzles"); return result(false); }
  if (!state.opening) out.add("start.no-opening", "the world has no opening");
  else for (const c of startRoomCatches(state, pack)) out.add(c.id, "the start room: " + c.text);

  lintWorld(state, pack, bible, puzzles, out);
  if (out.problems.length) return result(false);

  // Each ending, from a fresh start (and the pictures they end with).
  const played = new Set(), runs = [];
  const play = (name, id, prefer) => {
    const run = new Run(state, puzzles, { before, prefer });
    run.solve(id);
    wordRun(run, pack);
    if (run.problem) out.add(run.problemId, `ending "${name}": ${run.problem}`);
    else if (!run.state.ended) out.add("play.not-ended", `ending "${name}": played to the end, but the story didn't end`);
    else if (!run.state.ending) out.add("play.ending-no-picture", `ending "${name}": the story ended without a picture (end: true, picture: "…")`);
    else {
      const why = run.skipped ? null : replayProblem(state, pack, run);   // (a wait by play time, for a mover on a round of seconds, is no command: that ending is not replayed)
      if (why) out.add("play.replay-differs", `ending "${name}": ${why}`);
      played.add(run.state.ending);
    }
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
      out.add("play.ending-unplayed", `${where}: ends the story with "${e.picture}", but no puzzle with ending: true reaches it, so that ending is never played: give it a puzzle (ending: true, its solve and hints)`);
  return result(!out.problems.length);
}

// The start room's guarantees alone (js/checks/start.js), its first puzzle played with this file's own run: what check()
// lists first, as "the start room: …" (the tests call it on its own, without the whole playthrough). The catches, with their ids, and the texts.
const startRoomCatches = (state, pack) => openingCatches(withoutPractice(state), pack, (s, puzzles) => new Run(s, puzzles));
export const startRoomProblems = (state, pack) => startRoomCatches(state, pack).map(c => c.text);

const TIME_MARK = "@time ";

// What a run played, as the commands a player types (its `played`, `owner` and `where`, one entry each): a step of the walk by the pack's first word
// for the direction, a wait for a thing that moves by the verb's first word, the clock moved as a time command, and every other step worded by the
// engine (js/view.js, commandFor), as the hints word it.
function wordRun(run, pack) {
  run.played = []; run.owner = []; run.where = [];
  for (const x of run.steps) {
    const said = x.time ? TIME_MARK + x.time : x.kind === "walk" ? pack.words.dirs[x.action.dir][0]
      : x.kind === "wait" ? pack.words.verbs.wait[0] : commandFor(x.state, pack, x.step) ?? JSON.stringify(x.step);
    run.played.push(x.time || x.kind === "walk" || x.kind === "wait" ? said : said.charAt(0).toLowerCase() + said.slice(1));
    run.owner.push(x.puzzle); run.where.push(x.at);
  }
}

// The playthrough above, typed again as the tests type it (replayCommand, from the start, as at += 2000 a command): the playthrough's own clock
// is not the replay's (and waiting for a timed way, in `go`, leaves no command), so a puzzle that waits for an hour, or a way that shuts at one,
// can be finished here and stranded there. Returns what stopped the replay (naming the puzzle the command belongs to), or null.
function replayProblem(state, pack, run) {
  let s = state, at = 0;
  for (const [i, c] of run.played.entries()) {
    const r = replayCommand(s, c, pack, at += 2000), puzzle = run.owner[i];
    const stuck = r.error ? `is not understood (${typeof r.error === "string" ? r.error : r.error.say ?? JSON.stringify(r.error)})` : r.refused.length ? `is refused (${r.refused[0]})` : null;
    if (stuck) return `puzzle "${puzzle}": played again from the start, as the tests play it, "${c}" ${stuck}. Where the checker's own run got through, a player would be stopped: a puzzle that waits for an hour (\`time\`) walks to its place first and only then waits (BRIEF.md §4)`;
    s = r.state;
    if (run.where[i] && s.player.at !== run.where[i])
      return `puzzle "${puzzle}": played again from the start, as the tests play it, "${c}" leaves you in ${s.player.at}, not ${run.where[i]} where the checker's own run was: a way that is shut at that hour (the replay's clock is not the playthrough's), or a wait the playthrough made that no command says. A puzzle that waits for an hour (\`time\`) walks to its place first and only then waits (BRIEF.md §4)`;
  }
  return s.ended && s.ending === run.state.ending ? null : `played again from the start, as the tests play it, the story ${s.ended ? `ends on "${s.ending}", not "${run.state.ending}"` : "does not end"} (the last puzzle played was "${run.owner[run.owner.length - 1]}")`;
}
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
