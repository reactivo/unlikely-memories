// How the page gets its worlds (ARCHITECTURE.md §10, "How a world is loaded"). The page never imports worlds/index.js (that loads every
// world: its texts, pictures, music, sprites and levels, about 150 files); it reads this:
//   - the CARDS (worlds/cards.js, generated from the world files by tools/cards.mjs): what the list of games, a game's popup and the
//     routing need about each world, small and loaded with the page: listFor, thumbnailFor, boxartFor, hasWorld, hasCover, withCover;
//   - a world's FULL files (its text in a language, with its pictures, the tall cover, music, sprites and levels), loaded by dynamic
//     import only when the world is opened (loadWorld: its own page, /<id>/, or its game; the list's popup preloads it so PLAY is
//     instant) and kept: worldFor and coverFor read what is loaded, and a world is never fetched twice.
// Node (the tests, the golden check, the tools) has every world from the start: this module loads worlds/index.js there and keeps all
// of it, so nothing that runs in Node changes.

import { CARDS, DEFAULT, TEXTS, COVERS } from "./cards.js?v=0.75.0";
import { parseShapes, readStartsWith } from "../js/picture.js?v=0.75.0";

export { CARDS, DEFAULT };

const texts = new Map();      // "<id>/<lang>" → the world's change set, once loaded
const covers = new Map();     // <id> → the world's cover (its pictures.js `cover`), once loaded
const asked = new Map();      // "<id>/<lang>" → the promise of its loading (kept, so a world is fetched once)
const card = (id) => (Object.hasOwn(CARDS, id) ? CARDS[id] : null);

// Is there a world with this id written in this language? Has it a page of its own (a cover)? Pure: from the cards.
export const hasWorld = (id, lang) => !!card(id)?.langs.includes(lang);
export const hasCover = (id) => !!card(id)?.cover;
// The worlds that have a page of their own, by id.
export const withCover = () => Object.keys(CARDS).filter(hasCover);

// The worlds the landing page lists for a language: those written in it, newest first, the Testbed (a tool, not a story) always last.
export const listFor = (lang) => Object.entries(CARDS).filter(([, c]) => c.langs.includes(lang))
  .sort(([ia, a], [ib, b]) => (ia === "testbed") - (ib === "testbed") || b.made.localeCompare(a.made))
  .map(([id, c]) => ({ id, title: c.title[lang], blurb: c.blurb[lang], thumbnail: c.thumbnail, cover: c.cover }));

// What a card's thumbnail is drawn from: its drawing list, the room's description for screen readers, where the crop starts, and the world's colour (`bg`, for the plain box of a world with no box art); or null.
export function thumbnailFor(id, lang) {
  const t = card(id)?.thumb;
  return t && (t.draws?.[lang] ?? t.draw) && t.alt[lang] !== undefined ? { draw: t.draws?.[lang] ?? t.draw, alt: t.alt[lang], x: card(id).thumbnail.x, bg: card(id).bg ?? 0 } : null;
}

// A world's box art (its title in the language, its colour and band, its drawing list, `bg`: the world's colour the canvas starts in and "bg" is), or null.
export function boxartFor(id, lang) {
  const c = card(id);
  if (!c?.boxart || !c.langs.includes(lang)) return null;
  const b = c.boxart;
  return { title: c.title[lang], bg: c.bg, titleColor: b.titleColor, titleAt: b.titleAt, draw: typeof b.draw === "string" ? parseShapes(b.draw, { bg: true }).shapes : b.draw };
}

// What a world's page shows, in a language (as worlds/index.js's coverFor, from what is loaded): or null if the world has no cover, isn't
// written in the language, or isn't loaded yet (loadWorld first).
export function coverFor(id, lang) {
  const c = covers.get(id);
  if (!c || !hasWorld(id, lang)) return null;
  return { title: card(id).title[lang], bg: card(id).bg, titleColor: c.title ?? 15, titleAt: c.titleAt ?? "top", draw: typeof c.draw === "string" ? parseShapes(c.draw, { bg: true }).shapes : c.draw, cycles: c.cycles || [], loops: c.loops || [] };
}

// The world (its change set) written in this language, once loaded; none otherwise (a game there starts in a placeholder room).
export const worldFor = (lang, id = DEFAULT) => texts.get(id + "/" + lang) ?? null;
export const isLoaded = (id, lang) => texts.has(id + "/" + lang);
// A game's world as written, for js/picture.js: where its things start (a thing taken from its room is still that room's: its shapes come back with it).
readStartsWith((state) => (state?.worldId ? worldFor(state.lang, state.worldId) : null));

// Load a world's full files in a language (its page, its game): a promise that settles when it is loaded; asking again gives the same one
// (a world is fetched once), and one that failed can be asked for again. Rejects for a world the cards don't know in that language.
export function loadWorld(id, lang) {
  const key = id + "/" + lang;
  if (!hasWorld(id, lang)) return Promise.reject(new Error(`No world ${id} in ${lang}`));
  if (!asked.has(key)) {
    const run = Promise.all([TEXTS[key](), COVERS[id]?.()])
      .then(([w, p]) => { texts.set(key, w.default); if (p?.cover) covers.set(id, p.cover); });
    asked.set(key, run);
    run.catch(() => asked.delete(key));
  }
  return asked.get(key);
}

// Node and the tools: every world there is, already (worlds/index.js loads them all, in its own order). Never reached by a browser.
if (typeof process !== "undefined" && process.versions?.node) {
  const { WORLDS } = await import("./index.js?v=0.75.0");
  for (const [id, w] of Object.entries(WORLDS)) {
    for (const [lang, text] of Object.entries(w.text)) { texts.set(id + "/" + lang, text); asked.set(id + "/" + lang, Promise.resolve()); }
    if (w.cover) covers.set(id, w.cover);
  }
}
