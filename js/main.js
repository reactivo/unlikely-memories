// Controller: connects the pieces and runs each command, one at a time.
// Holds the one game state (js/state.js) but no game logic: parse → engine → narrator → screen.
// Also the session: undo, oops, saving and loading (js/saves.js), and which view the page shows: the list of games (no hash) or one
// world (#<id>, js/route.js). Never touches the page (that's ui/).

import en from "../content/en.js?v=0.50.0";
import es from "../content/es.js?v=0.50.0";
import { newState, FORMAT } from "./state.js?v=0.50.0";
import { step, nextDue, ask, takesBlank, withoutYesNo } from "./engine.js?v=0.50.0";
import { parse, retype } from "./parser.js?v=0.50.0";
import { inScope } from "./place.js?v=0.50.0";
import { tell, describe, text, listName, placeName, joined } from "./narrator.js?v=0.50.0";
import { parts, hhmm } from "./time.js?v=0.50.0";
import * as saves from "./saves.js?v=0.50.0";
import { suggestion, topicsLine, story } from "./view.js?v=0.50.0";
import { walk, tripWords } from "./map.js?v=0.50.0";
import { createClock } from "./clock.js?v=0.50.0";
import { routeOf, hashOf } from "./route.js?v=0.50.0";
import { listFor, thumbnailFor } from "../worlds/index.js?v=0.50.0";
import { load, store } from "./prefs.js?v=0.50.0";
import { examineSVG } from "../ui/sprite.js?v=0.50.0";
import * as titlebar from "../ui/titlebar.js?v=0.50.0";
import * as scene from "../ui/scene.js?v=0.50.0";
import * as crop from "../ui/crop.js?v=0.50.0";
import * as log from "../ui/log.js?v=0.50.0";
import * as prompt from "../ui/prompt.js?v=0.50.0";
import * as compass from "../ui/compass.js?v=0.50.0";
import * as inventory from "../ui/inventory.js?v=0.50.0";
import * as options from "../ui/options.js?v=0.50.0";
import * as soundpanel from "../ui/soundpanel.js?v=0.50.0";
import * as map from "../ui/map.js?v=0.50.0";
import * as page from "../ui/page.js?v=0.50.0";
import * as tools from "../ui/tools.js?v=0.50.0";
import * as tabs from "../ui/tabs.js?v=0.50.0";
import * as keys from "../ui/keys.js?v=0.50.0";
import * as home from "../ui/home.js?v=0.50.0";
import * as crt from "../ui/crt.js?v=0.50.0";
import * as sound from "../ui/sound.js?v=0.50.0";

// The standard texts of a game: its language's pack (the world's own texts are in the world: worlds/<id>/).
const LANG_PACKS = { en, es };
const packOf = (s) => LANG_PACKS[s.lang];

const RESTART_DELAY = 1800;   // ms between choosing to begin again and the new game starting
const QUIET_RETRY = 500;      // ms to wait before trying again when the world can't act yet (you're typing…)
const UNDO_STEPS = 50;        // how many of your moves UNDO can take back
const TRANSCRIPT = 40;        // story paragraphs kept with a save, shown again when it's loaded

// Language: the one remembered on this device, else the browser's language if we have it, else English.
const LANGS = Object.keys(LANG_PACKS);
const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
let lang = LANGS.includes(load("parser-lang")) ? load("parser-lang") : LANGS.includes(browserLang) ? browserLang : "en";
let mix = soundpanel.readMix(load(soundpanel.KEY), load("parser-music"));   // the sound: the three sliders and the mute, as remembered (a first visit: the spec's)
let state = null;                                        // the current game: everything it knows (none while the list of games shows)
let view = "home";                                       // which view the page shows: "home" (the list of games) or "game"
let openId = null;                                       // the world in the game view
let opening = 0;                                         // counts views asked for, so a slow one can see it was overtaken
let restartTimer = null;                                 // the pause between choosing to begin again and the new game starting
let restarting = false;                                  // beginning again was chosen: a new game starts shortly
let shown = null;                                        // what the screen showed last time
const clock = createClock();                             // play time of this game (pauses while the tab is hidden)
let timer = null;                                        // the single timer: wakes the world when a timed rule is due
let history = [];                                        // earlier states, for UNDO (newest last)
let transcript = [];                                     // the latest story paragraphs, kept with saves
let lastInput = null;                                    // the last command typed (for OOPS)
let lastUnknown = null;                                  // the unknown word in it, if any (for OOPS)
let pendingWhich = null;                                 // "Which do you mean…?" is waiting: what the next input may answer (parse)
let autosaving = null;                                   // the pending automatic save
let freshFor = null;                                     // a world to open with a new game, read once by route()
let turnStart = null;                                    // this turn's first paragraph: { el, entry } (see enteredRoom)
let asleep = null;                                       // a sleep playing on the screen (sleepThrough): { shift, run }; nothing else moves meanwhile

// What the pieces can ask the controller to do (clicks, Enter, options…).
const on = {
  submit: (raw) => runCommand(raw),                      // Enter on the command line
  canSend: () => !restarting && !asleep,                 // no input while a new game is starting, nor while you sleep
  command: (text) => runCommand(text, text.toLowerCase()),   // e.g. a compass click sends "North" (kept in the history as "north")
  useCommand: (text) => runCommand(sentenceCase(text)),  // a <COMMAND> in the story was clicked: run it at once
  showObject: (id, label) => examineObject(id, label),   // an object in the story was clicked: examine it
  showItem: (id) => examineObject(id, listName(id, state, packOf(state)), true),   // an inventory item was clicked: the same
  soundMoved: (part, v) => setMix(soundpanel.moved(mix, part, v)),   // a slider of the sound block (options) moved
  soundToggled: () => setMix(soundpanel.toggled(mix)),   // ♫ was tapped: mute all / unmute all
  musicStopped: () => {                                  // the system took the sound away (a call, the player's own music): ♫ shows muted;
    if (mix.muted) return;                               // the sliders keep their places, and Unmute starts it again (the remembered mute
    mix = { ...mix, muted: true };                       // stays as it was: this is the system's, not the player's)
    if (view === "game") redraw();
  },
  homeLanguage: (l) => setHomeLang(l),                   // EN · ES on the list of games
  quit: () => quit(),                                    // "Quit" in options (or the QUIT command): back to the list of games
  play: (id, fresh = false) => {                        // CONTINUE / NEW GAME on a card: the address changes, route() follows
    if (fresh) freshFor = id;                            // (NEW GAME on a world with a saved game: open it with a new game, once; its kept game stays)
    location.hash = hashOf(id);
  },
  restart: () => restart({ ask: true }),                 // "Restart game" in options (and Esc): asks in the story first, unless the story is over
  travel: (room) => travel(room),                        // a room was clicked on the map: walk there
  focus: () => { if (view === "game") ui.prompt.focus(); },   // give the command line the focus back
  visible: (shown) => {                                  // the tab was hidden or shown: pause or resume the world
    if (view !== "game") return;                         // (no world is running on the list)
    if (shown) { clock.resume(); schedule(); } else { clock.pause(); clearTimeout(timer); flushSave(); }
  },
  leaving: () => flushSave()                             // the page is being closed or reloaded
};

// Set up each piece once, on its element in index.html.
const $ = (sel) => document.querySelector(sel);
const pictureCrop = crop.mount($(".top"));              // the picture's crop on upright phones (the sideways drag): not drawn from the state; the log tells it when a room starts
const ui = {
  page: page.mount(document, on),
  titlebar: titlebar.mount($(".titlebar")),
  scene: scene.mount($(".picture")),
  log: log.mount($(".log"), on, pictureCrop),
  prompt: prompt.mount($(".prompt"), on),
  compass: compass.mount($(".compass"), on),
  inventory: inventory.mount($(".inventory"), on),
  tools: tools.mount($(".tools"), on),
  tabs: tabs.mount($(".tabs")),
  keys: keys.mount(document),
  options: options.mount($(".options"), on),
  map: map.mount($("#map-panel"), on),
  soundpanel: soundpanel.mount($(".options .sound"), on),
  sound: sound.mount(on)                               // the music: no element, drawn from the state like the rest (ui/sound.js)
};
const landing = home.mount($(".home"), on);              // the list of games: not drawn from the game's state, so apart from ui

// Keyboard shortcuts (ui/keys.js). The arrow keys stay the command line's own (the cursor, and earlier commands: ui/prompt.js).
// Esc: restart the game (it asks first, in the story).
ui.keys.add({ key: "Escape", when: () => view === "game" && !restarting, release: () => on.restart() });   // (not on the list of games)

// A change in the sound (♫ or a slider): remembered on this device and drawn at once (the audio starts inside the tap).
function setMix(next) { mix = next; store(soundpanel.KEY, JSON.stringify(mix)); redraw("tap"); }

// Redraw the screen: each piece gets the state (plus the language pack and the sound: `mix`, the sliders and the mute, and `music`,
// whether anything can be heard) and updates what changed since last time. reason: "turn" (a command), "tick" (the world on its
// own), "restore" (new game, undo, load: no animation), "tap" (♫ or a sound slider).
function redraw(reason) {
  const next = { state, pack: packOf(state), music: soundpanel.audible(mix), mix };
  for (const piece of Object.values(ui)) piece.update(shown, next, reason);
  shown = next;
}

// Run one command: echo it, parse it, then either run a session command (undo, save…), name a problem with
// the words, or let the engine apply each action and tell what happened.
// Every way of running a command comes through here (Enter, compass, story links, objects, choices), so this is
// where it is remembered for ↑ / ↓: `kept` is what is stored (default: the command as run).
function runCommand(raw, kept = raw) {
  if (restarting || asleep) return;                      // a new game is about to start; you are asleep
  ui.prompt.remember(kept);                              // (the history ignores empty lines)
  const blank = !raw.trim();
  if (blank && !takesBlank(state)) return;               // a blank Enter does nothing (unless a question for words waits: it is the answer)
  const from = state.player.at;
  turnStart = null;
  ui.prompt.clearHint();                                 // a command: the hint steps aside (it comes back after two idle minutes)
  if (!blank) echo("> " + raw);                          // (a blank answer has no echo: never a lone ">" in the story)
  play(raw);
  enteredRoom(from);
  ui.log.toEnd();
}

// A room clicked on the map: walk there, one real move after another (js/map.js: every rule applies). Only the arrival is
// shown (or where the walk stopped and what was said), after the typed trip as the echo. One turn: one UNDO takes it all back.
function travel(room) {
  if (restarting || asleep || state.ended) return;
  const pack = packOf(state), from = state.player.at, before = state;
  const trip = walk(withoutQuestion(state), room, pack, clock.now());   // a question waiting is dropped: a walk is moves, not an answer
  if (!trip) return;                                     // here already, or not on the map
  turnStart = null; pendingWhich = null;
  ui.prompt.clearHint();
  echo("> " + tripWords(trip.path, pack));
  keepForUndo(before);
  state = trip.next;
  show(trip.paragraphs);
  heard(trip.applied, before);
  redraw("turn");
  enteredRoom(from);
  schedule(); autosave();
  ui.log.toEnd();
}

// After a turn: if it took you to another room, the story starts a new visit from this turn's first line (your
// command), and everything before it becomes past (ui/log.js). Marked in the saved story too, for loading.
function enteredRoom(from) {
  if (restarting || state.player.at === from || !turnStart) return;
  ui.log.newVisit(turnStart.el);
  turnStart.entry.visit = true;
}

// A clicked command as if typed: "EXAMINE DOOR" → "Examine door" (so its echo reads like what you'd type).
function sentenceCase(text) {
  const t = text.trim().toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// A clicked object (in the story, or an item in the inventory): examine it, as if typed ("Examine tin"), then
// suggest what else you could do with it (if it's still within reach, and nothing else is waiting for an answer).
function examineObject(id, label, fromInventory = false) {
  const pack = packOf(state), verb = pack.words.verbs.examine[0];
  runCommand(verb.charAt(0).toUpperCase() + verb.slice(1) + " " + label);
  if (restarting || state.ended || state.pending.question || !inScope(state, id)) return;
  suggest(suggestion(state, pack, id, fromInventory, true));
}

// The state with no question waiting (the same state when none is).
const withoutQuestion = (s) => (s.pending.question ? { ...s, pending: { ...s.pending, question: null } } : s);
// Keep a state for UNDO: the newest last, at most UNDO_STEPS.
function keepForUndo(s) { history.push(s); if (history.length > UNDO_STEPS) history.shift(); }

// Parse and play some typed words (also used by OOPS, which replays earlier words).
function play(raw) {
  const which = pendingWhich;
  pendingWhich = null;                                   // it waits for the next input only
  const pack = packOf(state), parsed = parse(raw, state, pack, seenText(pack), which);
  if (parsed.meta) {                                     // a session command drops a yes/no question; a question for words stays open
    state = withoutYesNo(state);
    return session(parsed.meta, parsed.arg);
  }
  lastInput = raw; lastUnknown = null;
  if (parsed.error) return problem(parsed.error, raw);
  // Answering one of the session's own questions (undo, load…) isn't a move to take back.
  const q = state.pending.question, answering = parsed.actions[0]?.verb === "answer" && parsed.actions[0].question === q?.ask && q?.yes?.some(e => e.session);
  if (!answering) keepForUndo(state);
  let again = false, then = null;
  for (const action of parsed.actions) {
    const was = state, { next, applied, refused } = step(state, { ...action, at: clock.now() });
    state = next;
    if (moment(applied, refused, was)) return;           // a sleep: told in time with the eyes closing (the rest waits)
    then = applied.find(e => e.session)?.session ?? then; // a question answered yes: something for the session
    if (applied.some(e => e.restart)) { again = true; break; }   // beginning again was chosen
    if (state.pending.question) break;                   // a question was asked: the rest waits for the answer
  }
  redraw("turn");
  if (then) return confirmed(then);
  // After someone answers (talking, asking, saying something to them): what you could ask them about next.
  const talked = parsed.actions.findLast(a => ["talk", "ask", "say"].includes(a.verb) && a.obj);
  if (talked && !again && !state.ended && !state.pending.question && state.talkingTo === talked.obj && inScope(state, talked.obj)) {
    const line = topicsLine(state, pack, talked.obj);
    if (line) suggest(line);
  }
  if (again) restart({ said: true });                  // (BEGIN AGAIN: the engine has said againYes)
  else { schedule(); autosave(); }
}

// What one step of the engine said, told the same way for a typed command and for the world's own tick: a rule's impossible
// request is warned of, a sleep goes through sleepThrough (the eyes close, the lock; its end redraws and schedules, so true: the
// caller stops there), else the story's paragraphs (USE alone also says what you could do with the thing) and their sounds.
// `state` is already the state after the step; `was` the one before.
function moment(applied, refused, was) {
  if (refused.length) console.warn("Effects refused by the engine:", refused);   // a rule asked for something impossible
  const slept = applied.find(e => "sleep" in e);
  if (slept) { sleepThrough(applied, slept, was); return true; }
  show(story(applied, state, packOf(state)));
  heard(applied, was);
  return false;
}

// A sleep (js/engine.js, `sleep`; INTERFACE.md §6c, "Sleep"), told in time with the picture (ui/scene.js, sleep): what comes before
// the eyes close ("You close your eyes."), then the eyes close; in the dark, what is said there (a dream, a vision's line), and the
// dark lasts until it has been told; the picture woken to goes under the lids, they open, and then the waking (its line, the
// echoes, the room) and everything the screen shows of the moment (redraw: the clock, the reactions, the inventory). A sleep you
// don't wake from ends in the dark, then the death and the ending. Meanwhile the compass, the inventory and the command line are
// locked and greyed (ui/page.js, asleep); a tap, a click or a key skips to waking. The title bar's clock keeps the time you fell
// asleep at. Never on a restore: a loaded game, UNDO and a new game only show the story as it was told. The moment's sounds come
// once you wake (`was`: the game before it).
function sleepThrough(applied, mark, was) {
  const pack = packOf(state), i = applied.indexOf(mark), j = applied.findIndex(e => e.woke);
  const before = applied.slice(0, i), dark = j < 0 ? [] : applied.slice(i + 1, j), after = applied.slice(j < 0 ? i + 1 : j + 1);
  const picture = mark.vision && state.pictures?.[mark.vision];
  show(story(before, state, pack));
  ui.log.toEnd();
  let told = false;
  const tellDark = () => { if (told) return 0; told = true; show(story(dark, state, pack)); ui.log.toEnd(); return ui.log.busyFor(); };
  const run = ui.scene.sleep({
    kind: mark.sleep, wake: mark.wake !== false, vision: picture ? { id: mark.vision, world: state.worldId, picture: picture.picture } : null,
    dark: tellDark,
    open: () => ui.scene.update(shown, { state, pack, music: soundpanel.audible(mix), mix }, "restore"),   // the picture woken to, under the lids
    done: () => {
      tellDark();
      asleep = null;
      ui.page.asleep(false);
      ui.sound.asleep(false);
      show(story(after, state, pack));
      heard(applied, was);
      redraw("turn");
      showTime();
      schedule(); autosave();
      ui.log.toEnd();
      if (!state.ended) ui.prompt.focus();
    }
  });
  asleep = { shift: shown?.state?.time?.shift ?? 0, run };
  ui.page.asleep(true, () => run.skip());
  ui.sound.asleep(true);                                 // the music fades out under the lids, and back as you wake
}

// Nothing to do with the words (not a turn): a reply in the world's voice, varied ("You're not sure how to do
// that."), plus "Did you mean…?" for a clear typo.
function problem(error, raw) {
  const pack = packOf(state);
  let arg = error.arg;
  if (error.say === "@which" || error.say === "@whoMean") {   // "Which do you mean: the green door or the grey door?"
    arg = joined(arg.map(id => listName(id, state, pack)), pack.or);   // (always two or more)
  }
  if (error.which) pendingWhich = error.which;           // the next input may be the answer
  if (error.word) lastUnknown = error.word;
  say(text(vary(error.say, pack), pack, arg), error.style || "");
  if (error.didYouMean) say(text("@didYouMean", pack, retype(raw, error.word, error.didYouMean, pack.words.grammar)), "sys");
}

// One of a pack entry's phrasings ("@unsure" → "@unsure.2"): the next one in turn, so never the same twice in a
// row (and the same each time the game is played, which keeps the screen check repeatable).
const lastVariant = {};
function vary(key, pack) {
  const list = pack[key.slice(1)];
  if (!Array.isArray(list)) return key;
  const i = ((lastVariant[key] ?? -1) + 1) % list.length;
  lastVariant[key] = i;
  return key + "." + i;
}

// Session commands: outside the game, never a turn. The ones that lose something ask first, in the story, with the
// same yes/no question as everything else (`confirm`, js/engine.js); a yes comes back to confirmed().
// One saved game per world ("game"): SAVE keeps it (asking before replacing it), LOAD goes back to it (asking first).
async function session(kind, arg) {
  const pack = packOf(state);
  if (state.ended && !["undo", "load", "quit"].includes(kind)) return say(text("@gameOver", pack), "sys");   // the end locks the game (the parser says so too)
  if (kind === "quit") {                                 // QUIT, EXIT: back to the list of games. Not a turn: its echo is not kept
    if (transcript.at(-1)?.style === "cmd") transcript.pop();
    return quit();
  }
  if (kind === "undo") {
    if (!history.length) return say(text("@cantUndo", pack), "sys");
    confirm("@askUndo", "undo");
  } else if (kind === "clear") {                         // empty the story on screen (and in the saved transcript)
    ui.log.clear(); transcript = [];
    autosave();
  } else if (kind === "map") {                           // MAP: the same popup as the M on the compass
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
  state = r.next;
  show(tell(r.applied, state, packOf(state)));
  ui.log.toEnd();
  ui.prompt.focus();
}

// A session question answered yes: do it.
async function confirmed(kind) {
  const pack = packOf(state);
  if (kind === "undo") {
    if (!history.length) return say(text("@cantUndo", pack), "sys");   // (a question kept from before a reload)
    state = history.pop();
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
async function autoSaved(id) {
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
function autosave(now = false) {
  clearTimeout(autosaving);
  autosaving = null;
  if (!state?.worldId) return;
  const id = state.worldId;
  if (now) { saves.put(id, saves.AUTO, record()).catch(() => {}); return; }
  autosaving = setTimeout(() => { autosaving = null; saves.put(id, saves.AUTO, record()).catch(() => {}); }, 300);
}
// Write the automatic save now, also where the page can't wait for the database (see saves.putNow).
function saveNow() { if (!state?.worldId) return; autosave(true); saves.putNow(state.worldId, saves.AUTO, record()); }
// Write the automatic save that is waiting, if one is (the tab hidden, the page left).
function flushSave() { if (autosaving) saveNow(); }

// A game is replaced (a new game, a continued or loaded one): what the controller kept of the game before goes, apart from its
// state (set by the caller): the moves UNDO takes back, the story kept with saves, and the memory of the last turn (OOPS, "Which do
// you mean…?", where this turn began). The pieces on the screen forget theirs when they are told to "restore" (redraw).
function forgetGame() {
  history = []; transcript = [];
  lastInput = null; lastUnknown = null; pendingWhich = null; turnStart = null;
}

// Continue a saved game: its state, its clock, its story so far (shown at once), no undo history.
function restore(r) {
  forgetGame();
  state = r.state; lang = state.lang;
  clock.reset(r.played ?? state.clock); showTime();   // play time as it was when saved
  ui.log.clear(); ui.prompt.clear();
  ui.prompt.hint(ui.log.markup(packOf(state).hint), 0, false);   // not shown; it comes back if you're idle
  for (const p of r.transcript || []) {
    const el = ui.log.say(p.text, p.style || "", p.img ? examineSVG(p.img, state) : undefined, true, p.level, p.slot);
    keep(p);
    if (p.visit) ui.log.newVisit(el, true);               // a room entered here: earlier text is past
  }
  ui.log.toEnd(true);                                     // (the page jumps there: no scroll animation for a restored game)
  redraw("restore");
  schedule();
}

// Set the single timer for whatever the engine says is due next (in game time). Nothing due: no timer.
function schedule() {
  clearTimeout(timer);
  if (view !== "game" || !clock.running || restarting) return;
  const due = nextDue(state);
  if (due !== null) timer = setTimeout(tick, Math.max(0, due - clock.now()));
}

// The world takes a turn on its own (a timed rule is due): no echo, no turn counted. It waits while you're
// typing, while text is still appearing, while a question is waiting for your answer, or while you sleep.
function tick() {
  if (view !== "game") return;                           // (the list of games is showing)
  if (ui.prompt.typing() || ui.log.busy() || state.pending.question || asleep) { timer = setTimeout(tick, QUIET_RETRY); return; }
  const follow = ui.log.atEnd();                         // only follow the new text if you were already there
  const from = state.player.at;
  turnStart = null;
  const was = state, { next, applied, refused } = step(state, { tick: true, at: clock.now() });
  state = next;
  if (moment(applied, refused, was)) return;             // (all of it the world's own: set apart, "aside", by the engine's mark; a sleep goes through)
  redraw("tick");
  enteredRoom(from);
  if (follow) ui.log.toEnd();
  schedule(); autosave();
}

// Add story paragraphs to the log ({ text, style, img, level, slot }; img = an object's picture shown beside the text; level =
// the health bars; slot = the small inventory slot before the echo of a thing gained or lost, with its sprite; a thing with no
// sprite has none). The paragraph is kept whole in the transcript, so a loaded game draws them again (and a line saved with an
// empty slot draws none: ui/log.js slotArt).
function show(paragraphs) {
  for (const p of paragraphs) note(ui.log.say(p.text, p.style || "", p.img ? examineSVG(p.img, state) : undefined, false, p.level, p.slot), p);
}
// A moment's sounds (ui/sound.js, moment): its list, handed over as the log's paragraphs are, with the game before it (`was`) and
// after (the state now). Only for a moment played: a restore, UNDO, a load and a new game hand over none.
function heard(applied, was) { ui.sound.moment(applied, state, was); }
// One line of text (a reply, a note) and an echoed command, kept in the transcript too.
function say(t, style = "") { show([{ text: t, style }]); }
function echo(t) { note(ui.log.say(t, "cmd"), { text: t, style: "cmd" }); }
// A paragraph just added: kept for saves, and remembered if it's the first of this turn.
function note(el, entry) { keep(entry); turnStart ||= { el, entry }; }
// The title bar shows the world's time: play time plus however far the story has moved it (js/time.js); while you sleep, the time you
// fell asleep at (it jumps as you wake). The music hears it too (night: ui/sound.js).
function showTime() {
  const ms = clock.now() + (asleep ? asleep.shift : state?.time?.shift || 0);
  ui.titlebar.showClock(ms);
  ui.sound.clock(ms);
}

// What the player has just read: the room's text and the last few lines. Something named there that the game
// can't answer about gets a neutral reply instead of "You see no … here" (js/parser.js, the safety net).
function seenText(pack) {
  const room = describe(state, state.player.at, pack).map(l => l.text);
  const lately = transcript.slice(-8).filter(p => p.style !== "cmd").map(p => p.text);
  return [...room, ...lately].filter(t => typeof t === "string").join(" ");
}
// Keep the latest paragraphs for saves.
function keep(p) { transcript.push(p); if (transcript.length > TRANSCRIPT) transcript.shift(); }

// Show a suggestion line (after clicking an object or item). Not a turn.
function suggest(text) {
  if (!text) return;
  ui.log.suggest(text);
  ui.log.toEnd();
  ui.prompt.focus();
}

// Restart: a whole new game of the same world, from its opening (clock back to zero, story from the top). The ONE way a new game
// starts, whatever asked for it. It never touches the world's kept game (SAVE / LOAD: saves.GAME): LOAD can always go back to it.
// The automatic save is simply replaced by the new game's first one.
//   ask:  the question comes first, in the story (the options' Restart game, Esc), unless the story is over: the end needs no question.
//   said: againYes was already said (the engine's BEGIN AGAIN effect); else it is said here when the story is over (the menu after the end).
//   id:   a world to begin (NEW GAME on a card: choosing was the answer, so no question and no pause), else this game's world.
// After the end the new game starts after a pause (RESTART_DELAY), with input closed meanwhile.
function restart({ ask = false, said = false, id } = {}) {
  if (id !== undefined) return begin(id);
  if (view !== "game" || restarting) return;
  if (state.ended || said) {
    if (!said) say(text("@againYes", packOf(state)), "sys");
    restarting = true; clearTimeout(timer);
    restartTimer = setTimeout(() => { restarting = false; begin(state.worldId ?? undefined); }, RESTART_DELAY);
  } else if (ask) confirm("@askRestart", "restart");
  else begin(state.worldId ?? undefined);
}
// A new game: the clock from zero, a fresh state in the chosen language, the opening room described, saved at once.
// id: which world (the one in the address; beginning again keeps it).
function begin(id) {
  clock.reset();
  forgetGame();
  state = newState({ lang, id });
  state = step(state, { tick: true, at: clock.now() }).next;   // wake the world: timed rules start counting
  showTime();                                            // (its own time: the music starts at night if the world does)
  ui.log.clear(); ui.prompt.clear();
  show(describe(state, state.player.at, packOf(state)));
  ui.log.seen();                                         // (the opening is shown from the top: what's followed next is only what comes after it)
  ui.prompt.hint(ui.log.markup(packOf(state).hint), ui.log.busyFor());   // beside the prompt, once the room is told
  redraw("restore");
  schedule(); autosave(true);
  ui.prompt.focus();
}

// Which view: the address says (js/route.js). No hash: the list of games; #<id>: that world, continuing its saved game if it has one.
// An id that is no world in this language gives the list, with the address replaced. Runs at start and when the address changes
// (the back button).
function route() {
  const r = routeOf(location.hash, lang, freshFor);
  freshFor = null;                                       // read once: a reload or the back button never starts afresh again
  if (r.replace) window.history.replaceState(null, "", location.pathname + location.search);   // (window.history: plain `history` is the undo list)
  if (r.view === "home") showHome();
  else if (view !== "game" || openId !== r.id) openWorld(r.id, r.fresh);
}

// Leave the game view: the game is saved, its clock and timer stop, and a new game that was about to start doesn't; a sleep playing
// stops where it is (the game is saved woken: the story of it is kept only as far as it was told).
function leaveGame() {
  if (view !== "game") return;
  if (asleep) { asleep.run.cancel(); asleep = null; ui.page.asleep(false); }
  clearTimeout(restartTimer); restarting = false;
  clearTimeout(timer);
  saveNow();
  clock.pause();
  ui.sound.leave();                                      // the music stops with the game (and plays again when one is drawn)
}

// Show the list of games: one card per world written in this language, CONTINUE beside NEW GAME on those with a saved game.
async function showHome() {
  const mine = ++opening;
  leaveGame();
  view = "home"; openId = null;
  const worlds = listFor(lang);
  const saved = await Promise.all(worlds.map(w => autoSaved(w.id)));
  if (mine !== opening) return;                          // another view was asked for meanwhile
  landing.update({ lang, pack: LANG_PACKS[lang], worlds: worlds.map((w, i) => ({ ...w, thumb: thumbnailFor(w.id, lang), saved: !!saved[i] })) });
  ui.page.show("home", lang);
}

// The language chosen on the list of games (the only place it is chosen): remembered, and the list drawn again in it. No game is being
// played here, so no saved game is touched.
function setHomeLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  lang = l;
  store("parser-lang", l);
  showHome();
}

// Show a world: its saved game continued if it has one, else a new game from its opening. fresh: a new game from its opening
// whatever is saved (NEW GAME on its card: restart(), which keeps the world's kept game).
async function openWorld(id, fresh = false) {
  const mine = ++opening;
  leaveGame();
  const r = fresh ? null : await autoSaved(id);
  if (mine !== opening) return;
  view = "game"; openId = id; shown = null;           // (shown = null: every piece draws itself afresh)
  ui.page.show("game", lang);
  clock.resume();
  if (r) restore(r);
  else restart({ id });
}

// QUIT, EXIT, or the options' Quit: the address goes back to none (a new entry, so back returns to the game) and the list shows.
function quit() {
  if (view !== "game") return;
  window.history.pushState(null, "", location.pathname + location.search);
  route();
}

// ---- The debug panel ------------------------------------------------------------------------------------------------------
// A floating bar for trying things in any world, opened by typing /debug (ARCHITECTURE.md §7, "The debug panel"). Its own files:
// js/debug.js (what its buttons do, as the engine's effects), ui/debug.js and ui/debug.css (the panel, loaded only when first
// opened). The game doesn't depend on it: everything it does goes through `dev` below, and only this block knows it exists.
//   To switch it off: DEBUG_PANEL = false (/debug is then an ordinary command, which the game doesn't understand).
//   To remove it: delete this block and those three files (and tests/debug.test.js, tests/debug.py).
const DEBUG_PANEL = true;
if (DEBUG_PANEL) {
  const KEY = "parser-debug";                          // remembered on this device while the panel is open (ui/debug.js)
  let panel = null, debug = null, loading = null;      // the panel and js/debug.js, once loaded
  // What the panel may do (documented at the top of ui/debug.js).
  const dev = {
    state: () => (view === "game" ? state : null),
    pack: () => (state ? packOf(state) : null),
    now: () => clock.now(),
    sound: () => ui.sound.debug,                       // the music playing (ui/sound.js, debug): its Music section
    page: () => ui.log.page(),                         // the page's measurements (ui/log.js)
    // The CRT look's settings (ui/crt.js): { settings(), defaults(), ranges, set(values | null) }; set draws everything again at once.
    crt: () => ({ settings: crt.settings, defaults: crt.defaults, ranges: crt.RANGES, set: crt.configure }),
    // One moment of effects through the engine (js/debug.js, moment), shown and kept like a move: UNDO takes it back, it is saved.
    // tell: false shows only what the world said on its own meanwhile; note: a dim line before it; undo: false keeps no UNDO step.
    run(effects, { tell = true, note, undo = true } = {}) {
      if (view !== "game" || restarting || asleep || !state || state.ended) return;
      const before = state, from = state.player.at, pack = packOf(state);
      const r = debug.moment(state, effects, clock.now());
      if (r.refused.length) console.warn("Effects refused by the engine:", r.refused);
      if (r.next === before) return;
      if (undo) keepForUndo(before);
      state = r.next; turnStart = null; pendingWhich = null;
      if (tell && note) say(note, "sys");
      show(story(tell ? r.applied : r.applied.filter(e => e.aside), state, pack));
      heard(r.applied, before);
      redraw("turn");
      enteredRoom(from);
      schedule(); autosave();
      ui.log.toEnd();
    },
    languages: () => LANGS.filter(l => state?.worldId && listFor(l).some(w => w.id === state.worldId)),
    // A new game of this world in another language (the language is remembered, as on the list of games); its SAVE is kept.
    language(l) {
      if (view !== "game" || restarting || !dev.languages().includes(l) || l === state.lang) return;
      lang = l; store("parser-lang", l);
      begin(state.worldId);
    }
  };
  // Open the panel (loading it the first time).
  const openPanel = () => {
    loading ??= Promise.all([import("../ui/debug.js?v=0.50.0"), import("./debug.js?v=0.50.0")]).then(([m, d]) => {
      debug = d;
      panel = m.mount(dev);
      ui.debug = { update: () => panel.update() };     // redrawn with the other pieces from now on
      return panel;
    });
    loading.then(p => p.open()).catch(e => console.warn("The debug panel didn't load:", e));
  };
  // /debug, typed: opens the panel, before the parser (never a turn, never echoed, not kept for ↑, the story or UNDO).
  const send = on.submit;
  // Show rule ids (the panel's setting): under each answer, a dim line naming the rule that answered it (js/debug.js, answeredBy,
  // on the state before the command), added to the story on screen only: never kept in the saved story.
  const ruled = (fn) => (...args) => {
    if (!panel?.showsRules() || view !== "game") return fn(...args);
    const before = state, which = pendingWhich, seen = seenText(packOf(state)), last = transcript.findLast(p => p.style === "cmd");
    fn(...args);
    const cmd = transcript.findLast(p => p.style === "cmd");
    if (!cmd || cmd === last || !cmd.text.startsWith("> ")) return;
    const ids = debug.answeredBy(before, cmd.text.slice(2), packOf(before), seen, which, clock.now());
    ui.log.say("rule: " + ids.join(" · "), "sys debug-rule", undefined, true);
  };
  for (const name of ["command", "useCommand", "showObject", "showItem"]) on[name] = ruled(on[name]);
  const typed = ruled(send);
  on.submit = (raw) => (raw.trim().toLowerCase() === "/debug" ? openPanel() : typed(raw));   // (js/debug.js, COMMAND)
  // A room clicked on the map with "show whole map" on: walked to as usual; where the walk can't get there (a lock, a rule), travel.
  const walkTo = on.travel;
  on.travel = (room) => {
    walkTo(room);
    if (panel?.wholeMap() && view === "game" && !restarting && !state.ended && !state.pending.question && state.player.at !== room)
      dev.run(debug.travel(room), { note: "Debug: travel to " + room + "." });
  };
  if (load(KEY) !== null) openPanel();                 // it was open when the page was left: open it again as it was
}

// Start up: tick the clock display 4 times a second; bring older saved games to their worlds; show the view the address asks for.
setInterval(() => { if (view === "game") showTime(); }, 250);
window.addEventListener("hashchange", route);
saves.migrate().catch(() => {}).finally(route);
