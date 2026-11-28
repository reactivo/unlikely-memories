// The controller's session (ARCHITECTURE.md §2, "The controller"): the commands outside the game, never a turn (undo, oops, save, load,
// clear, map, quit), the yes/no questions they ask, the two saves of a world (js/saves.js: the automatic one and the kept one),
// restoring a saved game, and restarting: the one way a new game begins. Holds no game logic and builds no text. What it shares lives
// in js/current.js; the story's paragraphs are js/turn.js's.

import { state, setState, packOf, LANG_PACKS, lang, setLang, view, clock, ui, history, takeBack, transcript, keep, clearTranscript, dropEcho, forget } from "./current.js?v=0.77.0";
import { show, say, echo, play, redraw, schedule, unschedule, showTime, forgetTurn, lastInput, lastUnknown } from "./turn.js?v=0.77.0";
import { quit } from "./screens.js?v=0.77.0";
import { newState, FORMAT, withPlan } from "./state.js?v=0.77.0";
import { withPractice } from "./practice.js?v=0.77.0";
import { step, ask } from "./engine.js?v=0.77.0";
import { retype } from "./parser.js?v=0.77.0";
import { tell, describe, introOf, text, placeName } from "./narrator.js?v=0.77.0";
import { parts, hhmm } from "./time.js?v=0.77.0";
import * as saves from "./saves.js?v=0.77.0";

const RESTART_DELAY = 1800;   // ms between choosing to begin again and the new game starting

let restartTimer = null;                                 // the pause between choosing to begin again and the new game starting
export let restarting = false;                           // beginning again was chosen: a new game starts shortly
let autosaving = null;                                   // the pending automatic save

// Session commands: outside the game, never a turn. The ones that lose something ask first, in the story, with the
// same yes/no question as everything else (`confirm`, js/engine.js); a yes comes back to confirmed().
// One saved game per world ("game"): SAVE keeps it (asking before replacing it), LOAD goes back to it (asking first).
export async function session(kind, arg) {
  const pack = packOf(state);
  if (state.ended && !["undo", "load", "quit"].includes(kind)) return say(text("@gameOver", pack), "sys");   // the end locks the game (the parser says so too)
  if (kind === "quit") {                                 // QUIT, EXIT: back to the page's start (the list of games, or a world's own page). Not a turn: its echo is not kept
    dropEcho();
    return quit();
  }
  if (kind === "undo") {
    if (!history.length) return say(text("@cantUndo", pack), "sys");
    confirm("@askUndo", "undo");
  } else if (kind === "clear") {                         // empty the story on screen (and in the saved transcript)
    ui.log.clear(); clearTranscript();
    autosave();
  } else if (kind === "map") {                           // MAP: the same popup as SEE MAP under the compass
    ui.map.open();
  } else if (kind === "earlier") {                       // AGAIN, G, REPEAT: no command, just a pointer to ↑
    say(text("@useUp", pack), "sys");
  } else if (kind === "oops") {
    if (!lastUnknown || !arg) return say(text("@nothingToFix", pack), "sys");
    const fixed = retype(lastInput, lastUnknown, arg, pack.words.grammar);   // the word, whole, in the player's spelling (not a piece of another word)
    echo("> " + fixed);
    play(fixed);
  } else if (kind === "save") {
    if (await savedGame()) confirm("@askSave", "save");   // there's one already: replace it?
    else await saveGame();
  } else if (kind === "load") {
    const r = await savedGame();
    if (r) confirm("@askLoad", "load", savedDetails(r));      // where and when, then "Go back to it?"
    else say(text("@noSave", pack), "sys");
  }
  ui.log.toEnd();
}

// Ask a yes/no question for the session, in the story; yes comes back to confirmed(kind), no says "All right."
// arg: for the question's text (the saved game's details).
function confirm(key, kind, arg) {
  if (state.pending.question?.yes?.some(e => e.session === kind)) return;   // already asked, still waiting
  const r = ask(state, { confirm: key, arg, style: "sys", yes: [{ session: kind }], no: [{ say: "@confirmNo", style: "sys" }] });
  setState(r.next);
  show(tell(r.applied, state, packOf(state)));
  ui.log.toEnd();
  ui.prompt.focus();
}

// A session question answered yes: do it.
export async function confirmed(kind) {
  const pack = packOf(state);
  if (kind === "undo") {
    if (!history.length) return say(text("@cantUndo", pack), "sys");   // (a question kept from before a reload)
    setState(takeBack());
    say(text("@undone", pack), "sys");
    redraw("restore"); schedule(); autosave();
  } else if (kind === "save") await saveGame();
  else if (kind === "load") {
    try {
      const r = await savedGame();
      if (!r) return say(text("@noSave", pack), "sys");
      restore(r);
      say(text("@loaded", packOf(state)), "sys");
    } catch (e) { say(text("@saveFailed", pack), "sys"); }
  } else if (kind === "restart") restart();
  ui.log.toEnd();
}

// This world's kept game, if there is one (and it can still be played).
async function savedGame() {
  try { const r = await saves.get(state.worldId, saves.GAME); return r?.state?.format === FORMAT ? r : null; } catch (e) { return null; }
}
// A world's automatic save, if it can be continued: readable in this format and written in this language.
export async function autoSaved(id) {
  try { const r = await saves.get(id, saves.AUTO); return r?.state?.format === FORMAT && r.state.lang === lang && r.state.worldId === id && LANG_PACKS[r.state.lang] ? r : null; }
  catch (e) { return null; }
}
// Keep this game as the saved game. "Game saved." is said first, so it's part of what's saved (a loaded game shows it).
async function saveGame() {
  say(text("@saved", packOf(state)), "sys");
  try { await saves.put(state.worldId, saves.GAME, record()); }
  catch (e) { say(text("@saveFailed", packOf(state)), "sys"); }
}
// What LOAD tells about the saved game: where you were, the world's day and time then, and when you saved it.
function savedDetails(r) {
  const at = parts((r.played ?? r.state.clock) + (r.state.time?.shift || 0));
  return { place: placeName(r.state, packOf(r.state)), day: at.day, time: hhmm(at),
           saved: new Date(r.savedAt ?? Date.now()), now: new Date() };
}

// What a save holds: the state, the latest story text, and how long it had been played.
const record = () => ({ state, transcript, played: clock.now() });   // played: play time when saved

// Save automatically, a moment after the game changes (so closing the tab loses nothing).
// Moves in quick succession share one save (a moment after the last); `now` saves at once (a new game, leaving the
// game), and leaving the page writes a save that's still waiting, so a reload or a closed tab loses nothing.
// A game with no world (a language that has none) is not saved.
export function autosave(now = false) {
  clearTimeout(autosaving);
  autosaving = null;
  if (!state?.worldId) return;
  const id = state.worldId;
  if (now) { saves.put(id, saves.AUTO, record()).catch(() => {}); return; }
  autosaving = setTimeout(() => { autosaving = null; saves.put(id, saves.AUTO, record()).catch(() => {}); }, 300);
}
// Write the automatic save now, also where the page can't wait for the database (see saves.putNow).
export function saveNow() { if (!state?.worldId) return; autosave(true); saves.putNow(state.worldId, saves.AUTO, record()); }
// Write the automatic save that is waiting, if one is (the tab hidden, the page left).
export function flushSave() { if (autosaving) saveNow(); }

// A game is replaced (a new game, a continued or loaded one): what the controller kept of the game before goes, apart from its
// state (set by the caller): the moves UNDO takes back, the story kept with saves (js/current.js), and the memory of the last turn
// (OOPS, "Which do you mean…?", where this turn began: js/turn.js). The pieces on the screen forget theirs when they are told to
// "restore" (redraw).
function forgetGame() {
  forget();
  forgetTurn();
}

// Continue a saved game: its state, its clock, its story so far (shown at once), no undo history.
export function restore(r) {
  forgetGame();
  setState(withPlan(withPractice(r.state))); setLang(state.lang);   // (a game saved before the practice thing has none: js/practice.js; before the plan, no squares: js/state.js)
  clock.reset(r.played ?? state.clock); showTime();   // play time as it was when saved
  ui.log.clear(); ui.prompt.clear();
  ui.prompt.hint(ui.log.markup(packOf(state).hint), 0, false);   // not shown; it comes back if you're idle
  for (const p of r.transcript || []) {
    const el = ui.log.line(p, state, true);
    keep(p);
    if (p.visit) ui.log.newVisit(el, true);               // a room entered here: earlier text is past
  }
  ui.log.toEnd(true);                                     // (the page jumps there: no scroll animation for a restored game)
  redraw("restore");
  schedule();
}

// Restart: a whole new game of the same world, from its start room (clock back to zero, story from the top). The ONE way a new game
// starts, whatever asked for it. It never touches the world's kept game (SAVE / LOAD: saves.GAME): LOAD can always go back to it.
// The automatic save is simply replaced by the new game's first one.
//   ask:  the question comes first, in the story (the options' Restart game, Esc), unless the story is over: the end needs no question.
//   said: againYes was already said (the engine's BEGIN AGAIN effect); else it is said here when the story is over (the menu after the end).
//   id:   a world to begin (NEW GAME on a card: choosing was the answer, so no question and no pause), else this game's world.
// After the end the new game starts after a pause (RESTART_DELAY), with input closed meanwhile.
export function restart({ ask = false, said = false, id } = {}) {
  if (id !== undefined) return begin(id);
  if (view !== "game" || restarting) return;
  if (state.ended || said) {
    if (!said) say(text("@againYes", packOf(state)), "sys");
    restarting = true; unschedule();
    restartTimer = setTimeout(() => { restarting = false; begin(state.worldId ?? undefined); }, RESTART_DELAY);
  } else if (ask) confirm("@askRestart", "restart");
  else begin(state.worldId ?? undefined);
}
// The game view is left (js/screens.js, leaveGame): a new game that was about to start doesn't.
export function cancelRestart() { clearTimeout(restartTimer); restarting = false; }

// A new game: the clock from zero, a fresh state in the chosen language, the world's intro and the start room described, saved at once.
// id: which world (the one in the address; beginning again keeps it).
export function begin(id) {
  clock.reset();
  forgetGame();
  setState(newState({ lang, id }));
  setState(step(state, { tick: true, at: clock.now() }).next);   // wake the world: timed rules start counting
  showTime();                                            // (its own time: the music starts at night if the world does)
  ui.log.clear(); ui.prompt.clear();
  show([...introOf(state, packOf(state)), ...describe(state, state.player.at, packOf(state))]);   // the world's intro first, once, then the start room
  ui.log.seen();                                         // (the start room is shown from the top: what's followed next is only what comes after it)
  ui.log.hint();                                         // its objects outlined as they come into view, until one is touched
  ui.prompt.hint(ui.log.markup(packOf(state).hint), ui.log.busyFor());   // beside the prompt, once the room is told
  redraw("restore");
  schedule(); autosave(true);
  ui.prompt.focus();
}
