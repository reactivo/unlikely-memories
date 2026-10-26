// Controller: connects the pieces and runs each command, one at a time.
// Holds the one game state (js/state.js) but no game logic: parse → engine → narrator → screen.
// Also the session: undo, oops, saving and loading (js/saves.js), and which view the page shows: the list of games (no hash) or one
// world (#<id>, js/route.js). Never touches the page (that's ui/).

import en from "../content/en.js";
import es from "../content/es.js";
import { newState, FORMAT } from "./state.js";
import { step, nextDue, ask } from "./engine.js";
import { parse, normalise, retype } from "./parser.js";
import { tell, describe, text, listName, placeOf } from "./narrator.js";
import { parts } from "./time.js";
import * as saves from "./saves.js";
import { suggestion, topicsLine, story } from "./view.js";
import { walk, tripWords } from "./map.js";
import { inScope } from "./parser.js";
import { createClock } from "./clock.js";
import { routeOf } from "./route.js";
import { listFor, thumbnailFor } from "../worlds/index.js";
import { load, store } from "./prefs.js";
import { objectImage } from "../ui/sprite.js";
import * as titlebar from "../ui/titlebar.js";
import * as scene from "../ui/scene.js";
import * as log from "../ui/log.js";
import * as prompt from "../ui/prompt.js";
import * as compass from "../ui/compass.js";
import * as inventory from "../ui/inventory.js";
import * as settings from "../ui/settings.js";
import * as map from "../ui/map.js";
import * as page from "../ui/page.js";
import * as tools from "../ui/tools.js";
import * as tabs from "../ui/tabs.js";
import * as keys from "../ui/keys.js";
import * as home from "../ui/home.js";

// The standard texts of a game: its language's pack (the world's own texts are in the world: worlds/<id>/).
const LANG_PACKS = { en, es };
const packOf = (s) => LANG_PACKS[s.lang];

const RESTART_DELAY = 1800;   // ms between choosing to begin again and the new game starting
const QUIET_RETRY = 500;      // ms to wait before trying again when the world can't act yet (you're typing…)
const UNDO_STEPS = 50;        // how many of your moves UNDO can take back
const TRANSCRIPT = 40;        // story paragraphs kept with a save, shown again when it's loaded

// Language: the one remembered on this device, else the browser's language if we have it, else English.
const LANGS = ["en", "es"];
const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
let lang = LANGS.includes(load("parser-lang")) ? load("parser-lang") : LANGS.includes(browserLang) ? browserLang : "en";
let musicOn = load("parser-music") === "on";             // remembered music switch, off by default
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
let askNewFor = null;                                    // a world to open and ask "Start a new game?" in, read once by route()
let turnStart = null;                                    // this turn's first paragraph: { el, entry } (see enteredRoom)

// What the pieces can ask the controller to do (clicks, Enter, settings…).
const on = {
  submit: (raw) => runCommand(raw),                      // Enter on the command line
  canSend: () => !restarting,                            // no input while a new game is starting
  command: (text) => runCommand(text, text.toLowerCase()),   // e.g. a compass click sends "North" (kept in the history as "north")
  useCommand: (text) => runCommand(sentenceCase(text)),  // a <COMMAND> in the story was clicked: run it at once
  showObject: (id, label) => examineObject(id, label),   // an object in the story was clicked: examine it
  showItem: (id) => examineObject(id, listName(id, state, packOf(state)), true),   // an inventory item was clicked: the same
  music: () => { musicOn = !musicOn; store("parser-music", musicOn ? "on" : "off"); redraw(); },
  language: (l) => setLang(l),                           // a language was chosen in settings
  homeLanguage: (l) => setHomeLang(l),                   // EN · ES on the list of games
  quit: () => quit(),                                    // "Quit" in settings (or the QUIT command): back to the list of games
  play: (id, askNew = false) => {                       // LOAD GAME / NEW GAME on a card: the address changes, route() follows
    if (askNew) askNewFor = id;                          // (NEW GAME on a world with a saved game: open it and ask, once)
    location.hash = id;
  },
  newGame: () => confirm("@askNewGame", "newGame"),      // "New game" in settings: asks in the story first
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
const ui = {
  page: page.mount(document, on),
  titlebar: titlebar.mount($(".titlebar")),
  scene: scene.mount($(".picture")),
  log: log.mount($(".log"), on),
  prompt: prompt.mount($(".prompt"), on),
  compass: compass.mount($(".compass"), on),
  inventory: inventory.mount($(".inventory"), on),
  tools: tools.mount($(".tools"), on),
  tabs: tabs.mount($(".tabs")),
  keys: keys.mount(document),
  settings: settings.mount($(".settings"), on),
  map: map.mount($("#map-panel"), on)
};
const landing = home.mount($(".home"), on);              // the list of games: not drawn from the game's state, so apart from ui

// Keyboard shortcuts (ui/keys.js). The arrow keys stay the command line's own (the cursor, and earlier commands: ui/prompt.js).
// Esc: a new game (it asks first, in the story).
ui.keys.add({ key: "Escape", when: () => view === "game" && !restarting, release: () => on.newGame() });   // (not on the list of games)

// Redraw the screen: each piece gets the state (plus the texts and settings) and updates what changed since
// last time. reason: "turn" (a command), "tick" (the world on its own), "restore" (new game, language change:
// no animation).
function redraw(reason) {
  const next = { state, pack: packOf(state), music: musicOn };
  for (const piece of Object.values(ui)) piece.update(shown, next, reason);
  shown = next;
}

// Run one command: echo it, parse it, then either run a session command (undo, save…), name a problem with
// the words, or let the engine apply each action and tell what happened.
// Every way of running a command comes through here (Enter, compass, story links, objects, choices), so this is
// where it is remembered for ↑ / ↓: `kept` is what is stored (default: the command as run).
function runCommand(raw, kept = raw) {
  if (restarting) return;                                // a new game is about to start
  ui.prompt.remember(kept);                              // (the history ignores empty lines)
  const q = state.pending.question;
  if (!raw.trim() && !(q && q.blankOk)) return;          // ignore empty input (unless the question accepts it)
  const from = state.player.at;
  turnStart = null;
  ui.prompt.clearHint();                                 // a command: the hint steps aside (it comes back after two idle minutes)
  echo("> " + raw);
  play(raw);
  enteredRoom(from);
  ui.log.toEnd();
}

// A room clicked on the map: walk there, one real move after another (js/map.js: every rule applies). Only the arrival is
// shown (or where the walk stopped and what was said), after the typed trip as the echo. One turn: one UNDO takes it all back.
function travel(room) {
  if (restarting || state.ended) return;
  const pack = packOf(state), from = state.player.at, before = state;
  const clear = state.pending.question ? { ...state, pending: { ...state.pending, question: null } } : state;   // a question waiting is dropped, as by a session command
  const trip = walk(clear, room, pack, clock.now());
  if (!trip) return;                                     // here already, or not on the map
  turnStart = null; pendingWhich = null;
  ui.prompt.clearHint();
  echo("> " + tripWords(trip.path, pack));
  history.push(before); if (history.length > UNDO_STEPS) history.shift();
  state = trip.next;
  show(trip.paragraphs);
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

// Parse and play some typed words (also used by OOPS, which replays earlier words).
function play(raw) {
  const which = pendingWhich;
  pendingWhich = null;                                   // it waits for the next input only
  const pack = packOf(state), parsed = parse(raw, state, pack, seenText(pack), which);
  if (parsed.meta) {                                     // a session command drops any question waiting
    if (state.pending.question) state = { ...state, pending: { ...state.pending, question: null } };
    return session(parsed.meta, parsed.arg);
  }
  lastInput = raw; lastUnknown = null;
  if (parsed.error) return problem(parsed.error, raw);
  // Answering one of the session's own questions (undo, load…) isn't a move to take back.
  const q = state.pending.question, answering = parsed.actions[0]?.verb === "answer" && q?.yes?.some(e => e.session);
  if (!answering) { history.push(state); if (history.length > UNDO_STEPS) history.shift(); }
  let restart = false, then = null;
  for (const action of parsed.actions) {
    const { next, applied, refused } = step(state, { ...action, at: clock.now() });
    if (refused.length) console.warn("Effects refused by the engine:", refused);   // a rule asked for something impossible
    state = next;
    show(story(applied, state, pack));                   // (USE alone also says what you could do with the thing)
    then = applied.find(e => e.session)?.session ?? then; // a question answered yes: something for the session
    if (applied.some(e => e.restart)) { restart = true; break; }   // beginning again was chosen
    if (state.pending.question) break;                   // a question was asked: the rest waits for the answer
  }
  redraw("turn");
  if (then) return confirmed(then);
  // After someone answers (talking, asking, saying something to them): what you could ask them about next.
  const talked = parsed.actions.findLast(a => ["talk", "ask", "say"].includes(a.verb) && a.obj);
  if (talked && !restart && !state.ended && !state.pending.question && state.talkingTo === talked.obj && inScope(state, talked.obj)) {
    const line = topicsLine(state, pack, talked.obj);
    if (line) suggest(line);
  }
  if (restart) {
    restarting = true; clearTimeout(timer);
    restartTimer = setTimeout(() => { restarting = false; newGame(); }, RESTART_DELAY);
  } else { schedule(); autosave(); }
}

// Nothing to do with the words (not a turn): a reply in the world's voice, varied ("You're not sure how to do
// that."), plus "Did you mean…?" for a clear typo.
function problem(error, raw) {
  const pack = packOf(state);
  let arg = error.arg;
  if (error.say === "@which" || error.say === "@whoMean") {   // "Which do you mean: the green door or the grey door?"
    const names = arg.map(id => listName(id, state, pack));
    arg = names.slice(0, -1).join(", ") + pack.or + names.at(-1);
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
    const fixed = normalise(lastInput, pack.words.grammar).replace(lastUnknown, arg);
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
  } else if (kind === "newGame") newGame(true);
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
  const at = parts((r.played ?? r.state.clock) + (r.state.time?.shift || 0)), pad = (n) => String(n).padStart(2, "0");
  return { place: placeOf(r.state, packOf(r.state)), day: at.day, time: pad(at.hour) + ":" + pad(at.minute),
           saved: new Date(r.savedAt ?? Date.now()), now: new Date() };
}

// What a save holds: the state, the latest story text, and how long it had been played.
const record = () => ({ state, transcript, played: clock.now() });   // played: play time when saved

// Save automatically, a moment after the game changes (so closing the tab loses nothing).
// Moves in quick succession share one save (a moment after the last); `now` saves at once (a new game, a language
// change), and leaving the page writes a save that's still waiting, so a reload or a closed tab loses nothing.
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
function flushSave() { if (autosaving) saveNow(); }

// Continue a saved game: its state, its clock, its story so far (shown at once), no undo history.
function restore(r) {
  state = r.state; lang = state.lang;
  history = [];
  clock.reset(r.played ?? state.clock); showTime();   // play time as it was when saved
  ui.log.clear(); transcript = [];
  ui.prompt.hint(ui.log.markup(packOf(state).hint), 0, false);   // not shown; it comes back if you're idle
  for (const p of r.transcript || []) {
    const el = ui.log.say(p.text, p.style || "", p.img ? objectImage(p.img, state) : undefined, true);
    keep(p);
    if (p.visit) ui.log.newVisit(el, true);               // a room entered here: earlier text is past
  }
  ui.log.toEnd();
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
// typing, while text is still appearing, or while a question is waiting for your answer.
function tick() {
  if (view !== "game") return;                           // (the list of games is showing)
  if (ui.prompt.typing() || ui.log.busy() || state.pending.question) { timer = setTimeout(tick, QUIET_RETRY); return; }
  const follow = ui.log.atEnd();                         // only follow the new text if you were already there
  const from = state.player.at;
  turnStart = null;
  const { next, applied } = step(state, { tick: true, at: clock.now() });
  state = next;
  // What the world says on its own is set apart, like a stage direction ("aside": ui/log.css).
  show(tell(applied, state, packOf(state)).map(p => ({ ...p, style: ((p.style || "") + " aside").trim() })));
  redraw("tick");
  enteredRoom(from);
  if (follow) ui.log.toEnd();
  schedule(); autosave();
}

// Add story paragraphs to the log ({ text, style, img }; img = an object's picture shown beside the text).
function show(paragraphs) {
  for (const p of paragraphs) note(ui.log.say(p.text, p.style || "", p.img ? objectImage(p.img, state) : undefined), p);
}
// One line of text (a reply, a note) and an echoed command, kept in the transcript too.
function say(t, style = "") { show([{ text: t, style }]); }
function echo(t) { note(ui.log.say(t, "cmd"), { text: t, style: "cmd" }); }
// A paragraph just added: kept for saves, and remembered if it's the first of this turn.
function note(el, entry) { keep(entry); turnStart ||= { el, entry }; }
// The title bar shows the world's time: play time plus however far the story has moved it (js/time.js).
function showTime() { ui.titlebar.showClock(clock.now() + (state?.time?.shift || 0)); }

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

// Start the story: a fresh state in the chosen language (health carried over if given), the opening room described.
// id: which world (the one in the address; beginning again, or a new language, keeps it).
function startStory(health, id) {
  state = newState({ lang, health, id });
  state = step(state, { tick: true, at: clock.now() }).next;   // wake the world: timed rules start counting
  history = []; transcript = [];
  ui.log.clear();
  show(describe(state, state.player.at, packOf(state)));
  ui.prompt.hint(ui.log.markup(packOf(state).hint), ui.log.busyFor());   // beside the prompt, once the room is told
  redraw("restore");
  schedule(); autosave(true);
}

// Start a whole new game: clock back to zero, story from the top.
// Either way the same world, from its opening. fresh: a whole new game (settings): the world's kept game goes with it;
// else (beginning again) it stays.
function newGame(fresh = false) {
  if (fresh && state.worldId) saves.discard(state.worldId).catch(() => {});
  clock.reset(); showTime();
  startStory(undefined, state.worldId ?? undefined);
  ui.prompt.focus();
}

// Switch language: remember it and start the story again in it (one language per game; health is kept).
function setLang(l) {
  if (state.worldId) saves.discard(state.worldId).catch(() => {});   // a game in another language: a different game (this world's)
  lang = l;
  store("parser-lang", l);
  startStory(state.player.health, state.worldId ?? undefined);
}

// Which view: the address says (js/route.js). No hash: the list of games; #<id>: that world, continuing its saved game if it has one.
// An id that is no world in this language gives the list, with the address replaced. Runs at start and when the address changes
// (the back button).
function route() {
  const r = routeOf(location.hash, lang, askNewFor);
  askNewFor = null;                                      // read once: a reload or the back button never asks again
  if (r.replace) window.history.replaceState(null, "", location.pathname + location.search);   // (window.history: plain `history` is the undo list)
  if (r.view === "home") showHome();
  else if (view !== "game" || openId !== r.id) openWorld(r.id, r.askNew);
}

// Leave the game view: the game is saved, its clock and timer stop, and a new game that was about to start doesn't.
function leaveGame() {
  if (view !== "game") return;
  clearTimeout(restartTimer); restarting = false;
  clearTimeout(timer);
  saveNow();
  clock.pause();
}

// Show the list of games: one card per world written in this language, LOAD GAME beside NEW GAME on those with a saved game.
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

// The language chosen on the list of games: remembered like the settings' choice, and the list drawn again in it. No game is being
// played here, so no saved game is touched.
function setHomeLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  lang = l;
  store("parser-lang", l);
  showHome();
}

// Show a world: its saved game continued if it has one, else a new game from its opening. askNew: ask "Start a new game?" in the
// story once it is open, as New game in the settings does (only where there is a saved game to lose).
async function openWorld(id, askNew = false) {
  const mine = ++opening;
  leaveGame();
  const r = await autoSaved(id);
  if (mine !== opening) return;
  view = "game"; openId = id; shown = null;           // (shown = null: every piece draws itself afresh)
  ui.page.show("game", lang);
  clock.resume();
  if (r) { restore(r); if (askNew) on.newGame(); }
  else { clock.reset(); showTime(); startStory(undefined, id); }
  ui.prompt.focus();
}

// QUIT, EXIT, or the settings' Quit: the address goes back to none (a new entry, so back returns to the game) and the list shows.
function quit() {
  if (view !== "game") return;
  window.history.pushState(null, "", location.pathname + location.search);
  route();
}

// Start up: tick the clock display 4 times a second; bring older saved games to their worlds; show the view the address asks for.
setInterval(() => { if (view === "game") showTime(); }, 250);
window.addEventListener("hashchange", route);
saves.migrate().catch(() => {}).finally(route);
