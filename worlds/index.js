// The worlds: every world made so far, each in its own folder (worlds/<id>/: world.<lang>.js, the world itself as
// one change set; pictures.js, its room pictures; sprites.js, its carried things), kept so any of them can be
// played again. Each world declares and writes its own opening, which leads to its `entrance`.
//
// The landing page lists them (listFor), newest first by `made`; the address picks one (js/route.js). Each world's bible
// gives its title, its blurb and its thumbnail (GUIDE.md §1), carried here so the list needs no world loaded.
// A new world: add its folder, import it here and add it to WORLDS.

import tuesday, { bible as tuesdayBible } from "./tuesday/world.en.js";
import sea, { bible as seaBible } from "./sea/world.en.js";
import hartleys, { bible as hartleysBible } from "./hartleys/world.en.js";
import lantern, { bible as lanternBible } from "./lantern/world.en.js";
import { parseShapes } from "../js/picture.js";

export const WORLDS = {
  sea:     { title: seaBible.title, blurb: seaBible.blurb, thumbnail: seaBible.thumbnail,     made: "2026-10-22", text: { en: sea } },      // "The Sea Is a Rumour"
  tuesday: { title: tuesdayBible.title, blurb: tuesdayBible.blurb, thumbnail: tuesdayBible.thumbnail, made: "2026-10-23", text: { en: tuesday } },   // "The Train to Tuesday"
  hartleys: { title: hartleysBible.title, blurb: hartleysBible.blurb, thumbnail: hartleysBible.thumbnail, made: "2026-10-24", text: { en: hartleys } },   // "Hartley's, After Hours"
  lantern: { title: lanternBible.title, blurb: lanternBible.blurb, thumbnail: lanternBible.thumbnail, made: "2026-10-25", text: { en: lantern } }      // "The Last Word on Lantern Row"
};

// The world newState plays when none is named (the tests, mostly: the game itself always names one).
export const DEFAULT = "lantern";

// The world (its change set) written in this language, or none (a game there starts in a placeholder room).
export const worldFor = (lang, id = DEFAULT) => (Object.hasOwn(WORLDS, id) ? WORLDS[id].text[lang] ?? null : null);

// The worlds the landing page lists for a language: those written in it, newest first.
export const listFor = (lang) => Object.entries(WORLDS).filter(([, w]) => w.text[lang])
  .sort(([, a], [, b]) => b.made.localeCompare(a.made))
  .map(([id, w]) => ({ id, title: w.title, blurb: w.blurb, thumbnail: w.thumbnail }));

// What a card's thumbnail is drawn from: the named room's drawing list (parsed if it is still the short notation), the room's
// description for screen readers, and where the crop starts. null if the world or the room isn't there.
export function thumbnailFor(id, lang) {
  const w = Object.hasOwn(WORLDS, id) ? WORLDS[id] : null, world = w?.text[lang];
  const room = world?.effects.find(e => e.add === "room" && e.id === w.thumbnail.picture);
  if (!room?.picture) return null;
  const draw = typeof room.picture.draw === "string" ? parseShapes(room.picture.draw).shapes : room.picture.draw;
  return { draw, alt: room.alt, x: w.thumbnail.x };
}
