// The controller's screens (ARCHITECTURE.md §2, "The controller"): which view the page shows, from the address (js/route.js): the list of
// games (no hash) or one world (#<id>); on a world's own page (/<id>/, <html data-world>: tools/pages.mjs) the world's splash (no hash) or
// its game (#<id>). Opening a world, leaving it, quitting, and the language chosen on the list. Holds no game logic and builds no text.
// What it shares lives in js/current.js; a game is continued or begun by js/session.js.

import { lang, setLang, LANGS, LANG_PACKS, view, setView, clock, ui, landing, poster } from "./current.js?v=0.74.3";
import { schedule, unschedule, cancelSleep, forgetShown, viewOf } from "./turn.js?v=0.74.3";
import { restore, restart, autoSaved, saveNow, flushSave, cancelRestart } from "./session.js?v=0.74.3";
import { startOf } from "./state.js?v=0.74.3";
import { routeOf, hashOf } from "./route.js?v=0.74.3";
import { listFor, thumbnailFor, coverFor, boxartFor, hasCover, loadWorld } from "../worlds/load.js?v=0.74.3";
import { store } from "./prefs.js?v=0.74.3";

// The list's address (the folder of the list's page) and the world whose page is shown (/<id>/), or none. The page loads once: going
// from the list to a world's page and back changes the address (history.pushState) and the view, not the page (17 November 2026: each
// move was a whole new page, every file fetched again). A world's page loaded by its own address (a link, a reload) is marked
// <html data-world> (tools/pages.mjs), so the list's address is its parent.
export const ROOT = new URL(document.documentElement.dataset.world ? "../" : "./", location.href);
function pageWorld() {
  const rest = decodeURIComponent(location.pathname).slice(decodeURIComponent(ROOT.pathname).length);
  const m = /^([A-Za-z0-9_-]+)\/?(index\.html)?$/.exec(rest);
  return m && hasCover(m[1]) ? m[1] : null;
}
let splashId = pageWorld();
let openId = null;                                       // the world in the game view
let opening = 0;                                         // counts views asked for, so a slow one can see it was overtaken
let freshFor = null;                                     // a world to open with a new game, read once by route()

// CONTINUE / NEW GAME on a card: the address changes, route() follows
export function playWorld(id, fresh = false) {
  if (fresh) freshFor = id;                              // (NEW GAME on a world with a saved game: open it with a new game, once; its kept game stays)
  location.hash = hashOf(id);
}

// Back to the list of games, without a reload.
export function list() { go(ROOT); }

// Which view: the address says (js/route.js). No hash: the list of games; #<id>: that world, continuing its saved game if it has one.
// An id that is no world in this language gives the list, with the address replaced. Runs at start and when the address changes
// (the back button).
export function route() {
  splashId = pageWorld();
  if (splashId) document.documentElement.dataset.world = splashId; else delete document.documentElement.dataset.world;
  const r = routeOf(location.hash, lang, freshFor, splashId);
  freshFor = null;                                       // read once: a reload or the back button never starts afresh again
  if (r.replace) window.history.replaceState(null, "", location.pathname + location.search);   // (window.history: `history` is the undo list's name, js/current.js)
  if (r.view === "away") list();                         // (a world's page in a language the world isn't written in: the list)
  else if (r.view === "home") showHome();
  else if (r.view === "splash") showSplash(r.id);
  else if (view !== "game" || openId !== r.id) openWorld(r.id, r.fresh);
}

// Go to an address of this site without loading a page (the list, a world's page): a new history entry, then the view it shows.
export function go(url) {
  window.history.pushState(null, "", url.href);
  route();
}

// Leave the game view: the game is saved, its clock and timer stop, and a new game that was about to start doesn't; a sleep playing
// stops where it is (the game is saved woken: the story of it is kept only as far as it was told).
function leaveGame() {
  if (view !== "game") return;
  cancelSleep();
  cancelRestart();
  unschedule();
  saveNow();
  clock.pause();
  ui.sound.leave();                                      // the music stops with the game (and plays again when one is drawn)
}

// The tab was hidden or shown: pause or resume the world.
export function visible(shown) {
  if (view !== "game") return;                           // (no world is running on the list)
  if (shown) { clock.resume(); schedule(); } else { clock.pause(); unschedule(); flushSave(); }
}

// Show the list of games: one box art per world written in this language (from the cards: no world is loaded for it). failed: a game's files
// didn't load, so a short line says so above the list.
function showHome(failed = false) {
  ++opening;
  leaveGame();
  if (view === "splash") ui.sound.leave();               // (a world's page plays its theme: back on the list, it stops: 18 November 2026)
  poster?.stop();
  setView("home"); openId = null;
  document.title = "Unlikely Memories";
  const worlds = listFor(lang);
  // (no saved game is read here: the list shows box art only; a game's popup asks for its own, on.saved: 17 November 2026, the list at once)
  landing.update({ lang, pack: LANG_PACKS[lang], failed, worlds: worlds.map(w => ({ ...w, thumb: thumbnailFor(w.id, lang), boxart: boxartFor(w.id, lang) })) });
  ui.page.show("home", lang);
}

// The language chosen on the list of games (the only place it is chosen): remembered, and the list drawn again in it. No game is being
// played here, so no saved game is touched.
export function setHomeLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  setLang(l);
  store("parser-lang", l);
  showHome();
}

// Show a world's own page (/<id>/): its cover, title and keys (CONTINUE only with a saved game), and its theme once the page is touched
// (ui/sound.js plays the new game's start room as a game does: the audio starts in the first tap or key, with the sound on). A game that
// was open is left (saved, its clock stopped, its music faded: leaveGame); the theme carries on into a game that starts from here.
async function showSplash(id) {
  const mine = ++opening;
  leaveGame();
  setView("splash"); openId = null;
  const reading = autoSaved(id);                         // (read meanwhile: the page doesn't wait for it, its keys do)
  try { await loadWorld(id, lang); } catch (e) { return mine === opening ? loadFailed(id, e) : undefined; }   // (the world's files, once: its page shows when they are here)
  const cover = coverFor(id, lang);
  if (mine !== opening) return;
  if (!cover) return list();                             // (no cover: no page)
  const pack = LANG_PACKS[lang];
  // Everything the first frame doesn't need waits for it: the page shows as soon as the files are here (18 November 2026: a phone waited
  // seconds on a blank list while the saved game was read and the music's start was built).
  poster.show({ id, title: cover.title, cover, pack, saved: null, lang });
  ui.page.show("splash", lang);
  let told = false;                                       // (a store that never answers: START after a moment, which still continues a saved game)
  const late = setTimeout(() => { if (mine === opening && !told) poster.saved(false); }, 1500);
  reading.then(saved => { told = true; clearTimeout(late); if (mine === opening) poster.saved(!!saved); });
  requestAnimationFrame(() => setTimeout(() => {         // (the frame after the page's first: its theme, from the world's start)
    if (mine === opening) ui.sound.update(null, viewOf(startOf(lang, id)), "restore");
  }, 0));
}

// Show a world: its saved game continued if it has one, else a new game from its start room. fresh: a new game from its start room
// whatever is saved (NEW GAME on its card: restart(), which keeps the world's kept game).
async function openWorld(id, fresh = false) {
  const mine = ++opening;
  leaveGame();
  try { await loadWorld(id, lang); } catch (e) { return mine === opening ? loadFailed(id, e) : undefined; }   // (a new game builds the world from its files)
  const r = fresh ? null : await autoSaved(id);
  if (mine !== opening) return;
  poster?.stop();
  setView("game"); openId = id; forgetShown();           // (forgetShown: every piece draws itself afresh)
  ui.page.show("game", lang);
  clock.resume();
  if (r) restore(r);
  else restart({ id });
}

// A world's files didn't load (offline, a missing file): the list shows, with a short line saying so, and the address is the list's
// (replaced, so back doesn't return to the world that can't open).
function loadFailed(id, e) {
  console.warn(`The world "${id}" didn't load:`, e);
  window.history.replaceState(null, "", ROOT.pathname + ROOT.search);
  splashId = null; delete document.documentElement.dataset.world;
  showHome(true);
}

// QUIT, EXIT, or the options' Quit: the address goes back to none (a new entry, so back returns to the game) and the page's own view shows: the list
// of games on the list's page, a world's cover and buttons on its own page (js/route.js: no hash is "home" there, "splash" here).
export function quit() {
  if (view !== "game") return;
  window.history.pushState(null, "", location.pathname + location.search);
  route();
}
