// Controller: connects the pieces and runs each command, one at a time. This is its entry point: it mounts the interface (ui/), hands
// it to js/current.js, wires the pieces' requests (`on`: clicks, Enter, options…) to the controller's modules, and starts. The controller
// holds the one game state (js/state.js) but no game logic: parse → engine → narrator → screen. By job (ARCHITECTURE.md §2):
//   js/turn.js     a command from top to bottom, the world's own tick and its timer, a walk on the map, a sleep, the story's paragraphs
//   js/session.js  undo, oops, saving and loading (js/saves.js), the questions they ask, restoring a game, restart and begin
//   js/screens.js    which view the page shows (js/route.js): the list of games, a world's own page, the game; opening and leaving a world
//   js/current.js  what they share: the game, its clock, UNDO's states, the kept story, the language, the view, the settings
// Never draws the page (that's ui/): of the page it owns only the address, the title and which view shows (js/screens.js).

import { state, packOf, LANGS, lang, setLang, view, clock, transcript, keepForUndo, setState, mix, graphics, setMix, setGraphics, mounted } from "./current.js?v=0.77.1";
import { runCommand, travel, sentenceCase, examineObject, redraw, showTime, say, played, newTurn, seenText, pendingWhich, asleep } from "./turn.js?v=0.77.1";
import { restart, begin, autoSaved, flushSave, restarting } from "./session.js?v=0.77.1";
import { route, go, list, ROOT, quit, playWorld, setHomeLang, visible } from "./screens.js?v=0.77.1";
import { listName } from "./narrator.js?v=0.77.1";
import * as saves from "./saves.js?v=0.77.1";
import { story } from "./view.js?v=0.77.1";
import { listFor, loadWorld } from "../worlds/load.js?v=0.77.1";
import { load, store } from "./prefs.js?v=0.77.1";
import * as titlebar from "../ui/titlebar.js?v=0.77.1";
import * as scene from "../ui/scene.js?v=0.77.1";
import * as crop from "../ui/crop.js?v=0.77.1";
import * as log from "../ui/log.js?v=0.77.1";
import * as prompt from "../ui/prompt.js?v=0.77.1";
import * as compass from "../ui/compass.js?v=0.77.1";
import * as inventory from "../ui/inventory.js?v=0.77.1";
import * as options from "../ui/options.js?v=0.77.1";
import * as soundpanel from "../ui/soundpanel.js?v=0.77.1";
import * as graphicspanel from "../ui/graphicspanel.js?v=0.77.1";
import * as map from "../ui/map.js?v=0.77.1";
import * as page from "../ui/page.js?v=0.77.1";
import * as tools from "../ui/tools.js?v=0.77.1";
import * as tabs from "../ui/tabs.js?v=0.77.1";
import * as keys from "../ui/keys.js?v=0.77.1";
import * as home from "../ui/home.js?v=0.77.1";
import * as splash from "../ui/splash.js?v=0.77.1";
import * as icons from "../ui/icons.js?v=0.77.1";
import * as crt from "../ui/crt.js?v=0.77.1";
import * as sound from "../ui/sound.js?v=0.77.1";

setMix(soundpanel.readMix(load(soundpanel.KEY), load("parser-music")));   // the sound: the three sliders and the mute, as remembered (a first visit: the spec's)
setGraphics(graphicspanel.readGraphics(load(graphicspanel.KEY)));   // the screen settings: CRT effect and Reflections, as remembered (a first visit: both on)
crt.allow(graphics.crt);                                 // (the CRT look's own switch: ui/crt.js)

// What the pieces can ask the controller to do (clicks, Enter, options…).
const on = {
  submit: (raw) => runCommand(raw),                      // Enter on the command line
  canSend: () => !restarting && !asleep,                 // no input while a new game is starting, nor while you sleep
  command: (text) => runCommand(text, text.toLowerCase()),   // e.g. a compass click sends "North" (kept in the history as "north")
  useCommand: (text) => runCommand(sentenceCase(text)),  // a <COMMAND> in the story was clicked: run it at once
  showObject: (id, label) => examineObject(id, label),   // an object in the story was clicked: examine it
  showItem: (id) => examineObject(id, listName(id, state, packOf(state)), true),   // an inventory item was clicked: the same
  soundMoved: (part, v) => changeMix(soundpanel.moved(mix, part, v)),   // a slider of the sound block (options) moved
  graphicsToggled: (which) => changeGraphics(graphicspanel.toggled(graphics, which)),   // a switch of the graphics block (options): CRT effect or Reflections
  soundToggled: () => changeMix(soundpanel.toggled(mix)),   // the SOUND switch (options) was toggled: mute all / unmute all
  musicStopped: () => {                                  // the system took the sound away (a call, the player's own music): the switch shows muted;
    if (mix.muted) return;                               // the sliders keep their places, and Unmute starts it again (the remembered mute
    setMix({ ...mix, muted: true });                     // stays as it was: this is the system's, not the player's)
    if (view === "game") redraw("tap");                        // (a muting, as the switch does it: it starts nothing, the mix is muted)
  },
  homeLanguage: (l) => setHomeLang(l),                   // EN · ES on the list of games
  saved: async (id) => !!(await autoSaved(id)),          // has this world a saved game? (a game's popup on the list asks)
  quit: () => quit(),                                    // "Quit" in options (or the QUIT command): back to the page's start: the list, or a world's own page
  play: (id, fresh = false) => playWorld(id, fresh),     // CONTINUE / NEW GAME on a card: the address changes, route() follows
  preload: (id) => { loadWorld(id, lang).catch(() => {}); },   // a game's popup opened: its files load now (a failure shows when it is opened)
  open: (id) => go(new URL(id + "/", ROOT)),             // PLAY in a game's popup: its own page, /<id>/ (ui/splash.js), without a reload
  list: () => list(),                                    // back to the list of games, without a reload
  restart: () => restart({ ask: true }),                 // "Restart game" in options (and Esc): asks in the story first, unless the story is over
  travel: (room) => travel(room),                        // a room was clicked on the map: walk there
  focus: () => { if (view === "game") ui.prompt.focus(); },   // give the command line the focus back
  visible: (shown) => visible(shown),                    // the tab was hidden or shown: pause or resume the world
  leaving: () => flushSave()                             // the page is being closed or reloaded
};

// Set up each piece once, on its element in index.html.
const $ = (sel) => document.querySelector(sel);
icons.fill(document);                                    // the buttons' icons, inline (ui/icons.js: no file to load, so none shows late)
const pictureCrop = crop.mount($(".top"));              // the picture's crop on upright phones (the sideways drag): not drawn from the state; the log tells it when a room starts
const ui = {
  page: page.mount(document, on),
  titlebar: titlebar.mount($(".titlebar")),
  scene: scene.mount($(".picture")),
  log: log.mount($(".log"), on, pictureCrop),
  prompt: prompt.mount($(".prompt"), on),
  compass: compass.mount($(".compass"), on),
  inventory: inventory.mount($(".inventory"), on),
  tools: tools.mount($(".tools")),
  tabs: tabs.mount($(".tabs")),
  keys: keys.mount(document),
  options: options.mount($(".options"), on),
  map: map.mount($("#map-panel"), on),
  soundpanel: soundpanel.mount($(".options .sound"), on),
  graphicspanel: graphicspanel.mount($(".options .graphics"), on),
  sound: sound.mount(on)                               // the music: no element, drawn from the state like the rest (ui/sound.js)
};
const landing = home.mount($(".home"), on);              // the list of games: not drawn from the game's state, so apart from ui
const poster = splash.mount($("#splash"), on);       // a world's own page (/<id>/): on the list's page too, for the move without a reload
mounted({ ui, landing, poster });                        // (the modules read them from js/current.js; `ui` is this same object, so a piece added later is drawn too)

// Keyboard shortcuts (ui/keys.js). The arrow keys stay the command line's own (the cursor, and earlier commands: ui/prompt.js).
// Esc: restart the game (it asks first, in the story).
ui.keys.add({ key: "Escape", when: () => view === "game" && !restarting, release: () => on.restart() });   // (not on the list of games)

// A change in the graphics (a switch): remembered on this device and drawn at once (the CRT look and the reflection follow).
function changeGraphics(next) { setGraphics(next); store(graphicspanel.KEY, JSON.stringify(graphics)); crt.allow(graphics.crt); redraw("tap"); }
// A change in the sound (the switch or a slider): remembered on this device and drawn at once (the audio starts inside the tap).
function changeMix(next) { setMix(next); store(soundpanel.KEY, JSON.stringify(mix)); redraw("tap"); }

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
    titleFont: (id) => poster?.setFont(id),            // the cover title's font on a world's own page (ui/splash.js; js/title.js)
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
      setState(r.next); newTurn();
      if (tell && note) say(note, "sys");
      played(story(tell ? r.applied : r.applied.filter(e => e.aside), state, pack), r.applied, before, from);
    },
    languages: () => LANGS.filter(l => state?.worldId && listFor(l).some(w => w.id === state.worldId)),
    // A new game of this world in another language (the language is remembered, as on the list of games); its SAVE is kept.
    language(l) {
      if (view !== "game" || restarting || !dev.languages().includes(l) || l === state.lang) return;
      const id = state.worldId, was = lang;
      loadWorld(id, l).then(() => {                     // (the world's files in that language, if not here yet)
        if (view !== "game" || restarting || state?.worldId !== id) return;
        setLang(l); store("parser-lang", l);
        begin(id);
      }).catch(e => { setLang(was); console.warn(`The world "${id}" didn't load in ${l}:`, e); });
    }
  };
  // Open the panel (loading it the first time).
  const openPanel = () => {
    loading ??= Promise.all([import("../ui/debug.js?v=0.77.1"), import("./debug.js?v=0.77.1")]).then(([m, d]) => {
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
window.addEventListener("popstate", route);                // (back and forward: a hash changed, or the list and a world's page, which change no hash; popstate comes for both)
saves.migrate().catch(() => {}).finally(route);
