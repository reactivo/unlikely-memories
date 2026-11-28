// What the controller's modules share (js/main.js, turn.js, session.js, screens.js; ARCHITECTURE.md §2, "The controller"): the game
// being played, its clock, the moves UNDO takes back, the story kept with saves, the language, the view the page shows, the settings
// and the interface's pieces. Each piece changes only here, by the function beside it, whose comment names who asks for it; every
// other module only reads it (an imported `let` is live and read-only: `state` is always the game as it is now). Not an event bus:
// nothing listens and nothing is told; a module that needs a piece reads it. Never touches the page.

import en from "../content/en.js?v=0.78.0";
import es from "../content/es.js?v=0.78.0";
import { createClock } from "./clock.js?v=0.78.0";
import { load } from "./prefs.js?v=0.78.0";

// The standard texts of a game: its language's pack (the world's own texts are in the world: worlds/<id>/).
export const LANG_PACKS = { en, es };
export const packOf = (s) => LANG_PACKS[s.lang];
export const LANGS = Object.keys(LANG_PACKS);

const UNDO_STEPS = 50;        // how many of your moves UNDO can take back
const TRANSCRIPT = 40;        // story paragraphs kept with a save, shown again when it's loaded

// Language: the one remembered on this device, else the browser's language if we have it, else English.
const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
export let lang = LANGS.includes(load("parser-lang")) ? load("parser-lang") : LANGS.includes(browserLang) ? browserLang : "en";
// screens.js (chosen on the list of games), session.js (a restored game's own), main.js's `dev`.
export function setLang(l) { lang = l; }

export let state = null;                                 // the current game: everything it knows (none while the list of games shows)
// turn.js (a command, a tick, a walk on the map), session.js (its questions, UNDO, a loaded or a new game), main.js's `dev`.
export function setState(s) { state = s; }

export let view = "home";                                // which view the page shows: "home" (the list of games), "game", or "splash" (a world's own page)
// screens.js only.
export function setView(v) { view = v; }

// Play time of this game (pauses while the tab is hidden): reset by session.js (a new game, a restored one), paused and resumed by
// screens.js (with the game view and the tab).
export const clock = createClock();

export let history = [];                                 // earlier states, for UNDO (newest last)
// Keep a state for UNDO: the newest last, at most UNDO_STEPS. turn.js (a command, a walk on the map), main.js's `dev`.
export function keepForUndo(s) { history.push(s); if (history.length > UNDO_STEPS) history.shift(); }
// The newest kept state, taken back: session.js (UNDO answered yes).
export function takeBack() { return history.pop(); }

export let transcript = [];                              // the latest story paragraphs, kept with saves
// Keep the latest paragraphs for saves: turn.js (every paragraph shown), session.js (a restored game's story).
export function keep(p) { transcript.push(p); if (transcript.length > TRANSCRIPT) transcript.shift(); }
// session.js: CLEAR empties it; QUIT takes its own echo back out (not a turn: its echo is not kept).
export function clearTranscript() { transcript = []; }
export function dropEcho() { if (transcript.at(-1)?.style === "cmd") transcript.pop(); }
// A game is replaced: the moves UNDO takes back and the story kept with saves go (session.js, forgetGame).
export function forget() { history = []; transcript = []; }

// The settings, as remembered on this device: main.js reads them at start and is the only one to change them (the options' switches
// and sliders, and the system taking the sound away).
export let mix = null;                                   // the sound: the three sliders and the mute
export let graphics = null;                              // the screen settings: CRT effect and Reflections
export function setMix(m) { mix = m; }
export function setGraphics(g) { graphics = g; }

// The interface's pieces, mounted once by main.js: `ui`, drawn from the state (turn.js, redraw); `landing`, the list of games, and
// `poster`, a world's own page (screens.js).
export let ui = null, landing = null, poster = null;
export function mounted(pieces) { ({ ui, landing, poster } = pieces); }
