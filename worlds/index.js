// The worlds: every world made so far, each in its own folder (worlds/<id>/: world.<lang>.js, the world itself as
// one change set; pictures.js, its room pictures; sprites.js, its carried things), kept so any of them can be
// played again. Each world declares and writes its own opening, which leads to its `entrance`.
//
// The landing page lists them (listFor), newest first by `made`; the address picks one (js/route.js). Each world's bible
// gives its title, its blurb and its thumbnail (BRIEF.md §1), carried here so the list needs no world loaded.
// About each world, data only (nothing shows it): `model` and `effort`, of the build that made it (written by the new-world
// skill, never by the AI that builds it), `minutes` the build took (null when it wasn't logged), and `version`, a whole number
// from 1, one more each delivery that changes its files. The versions of the four worlds made before 30 October 2026 are a floor:
// the deliveries recorded in git since then, plus their making and their Spanish versions; earlier changes weren't recorded.
// A new world: add its folder, import it here and add it to WORLDS.

import tuesday, { bible as tuesdayBible } from "./tuesday/world.en.js";
import sea, { bible as seaBible } from "./sea/world.en.js";
import hartleys, { bible as hartleysBible } from "./hartleys/world.en.js";
import lantern, { bible as lanternBible } from "./lantern/world.en.js";
import tuesdayEs, { bible as tuesdayBibleEs } from "./tuesday/world.es.js";
import seaEs, { bible as seaBibleEs } from "./sea/world.es.js";
import hartleysEs, { bible as hartleysBibleEs } from "./hartleys/world.es.js";
import lanternEs, { bible as lanternBibleEs } from "./lantern/world.es.js";
import meridian, { bible as meridianBible } from "./meridian/world.en.js";
import thirdglass, { bible as thirdglassBible } from "./thirdglass/world.en.js";
import deadhour, { bible as deadhourBible } from "./deadhour/world.en.js";
import boathouse, { bible as boathouseBible } from "./boathouse/world.en.js";
import buttons, { bible as buttonsBible } from "./buttons/world.en.js";
import testbed, { bible as testbedBible } from "./testbed/world.en.js";
import testbedEs, { bible as testbedBibleEs } from "./testbed/world.es.js";
import { parseShapes } from "../js/picture.js";

export const WORLDS = {
  sea:     { title: seaBible.title, blurb: seaBible.blurb, thumbnail: seaBible.thumbnail,     made: "2026-10-22", model: "Claude Opus 5.5", effort: "medium", version: 11, minutes: null, bible: { es: seaBibleEs }, text: { en: sea, es: seaEs } },      // "The Sea Is a Rumour"
  tuesday: { title: tuesdayBible.title, blurb: tuesdayBible.blurb, thumbnail: tuesdayBible.thumbnail, made: "2026-10-23", model: "Claude Opus 5.5", effort: "medium", version: 13, minutes: null, bible: { es: tuesdayBibleEs }, text: { en: tuesday, es: tuesdayEs } },   // "The Train to Tuesday"
  hartleys: { title: hartleysBible.title, blurb: hartleysBible.blurb, thumbnail: hartleysBible.thumbnail, made: "2026-10-24", model: "Claude Opus 5.5", effort: "medium", version: 10, minutes: null, bible: { es: hartleysBibleEs }, text: { en: hartleys, es: hartleysEs } },   // "Hartley's, After Hours"
  lantern: { title: lanternBible.title, blurb: lanternBible.blurb, thumbnail: lanternBible.thumbnail, made: "2026-10-25", model: "Claude Opus 5.5", effort: "high", version: 11, minutes: 53, bible: { es: lanternBibleEs }, text: { en: lantern, es: lanternEs } },      // "The Last Word on Lantern Row"
  meridian: { title: meridianBible.title, blurb: meridianBible.blurb, thumbnail: meridianBible.thumbnail, made: "2026-10-30", model: "Claude Haiku 5.5", effort: "default", version: 8, minutes: 28, text: { en: meridian } },     // "Please Remain Present"
  thirdglass: { title: thirdglassBible.title, blurb: thirdglassBible.blurb, thumbnail: thirdglassBible.thumbnail, made: "2026-11-03", model: "Claude Sonnet 5.5", effort: "high", version: 6, minutes: 34, text: { en: thirdglass } },     // "The Third Glass"
  deadhour: { title: deadhourBible.title, blurb: deadhourBible.blurb, thumbnail: deadhourBible.thumbnail, made: "2026-11-06", model: "Claude Sonnet 5.5", effort: "medium", version: 4, minutes: 19, text: { en: deadhour } },     // "The Dead Hour at Pylon Nine"
  boathouse: { title: boathouseBible.title, blurb: boathouseBible.blurb, thumbnail: boathouseBible.thumbnail, made: "2026-11-10", model: "Claude Sonnet 5.5", effort: "medium", version: 6, minutes: 31, text: { en: boathouse } },     // "The Lake Lights It Again"
  buttons: { title: buttonsBible.title, blurb: buttonsBible.blurb, thumbnail: buttonsBible.thumbnail, made: "2026-11-11", model: "Claude Sonnet 5.5", effort: "medium", version: 4, minutes: 32, text: { en: buttons } },     // "The Button Hall"
  testbed: { title: testbedBible.title, blurb: testbedBible.blurb, thumbnail: testbedBible.thumbnail, made: "2026-11-09", model: "Claude Sonnet 5.5", effort: "default", version: 5, minutes: null, bible: { es: testbedBibleEs }, text: { en: testbed, es: testbedEs } }   // "Testbed": every mechanism, always last in the list
};

// The world newState plays when none is named (the tests, mostly: the game itself always names one).
export const DEFAULT = "lantern";

// The world (its change set) written in this language, or none (a game there starts in a placeholder room).
export const worldFor = (lang, id = DEFAULT) => (Object.hasOwn(WORLDS, id) ? WORLDS[id].text[lang] ?? null : null);

// The worlds the landing page lists for a language: those written in it, newest first, the Testbed (a tool, not a story) always last.
export const listFor = (lang) => Object.entries(WORLDS).filter(([, w]) => w.text[lang])
  .sort(([ia, a], [ib, b]) => (ia === "testbed") - (ib === "testbed") || b.made.localeCompare(a.made))
  .map(([id, w]) => { const b = w.bible?.[lang] ?? w; return { id, title: b.title, blurb: b.blurb, thumbnail: w.thumbnail }; });

// What a card's thumbnail is drawn from: the named room's drawing list (parsed if it is still the short notation), the room's
// description for screen readers, and where the crop starts. null if the world or the room isn't there.
export function thumbnailFor(id, lang) {
  const w = Object.hasOwn(WORLDS, id) ? WORLDS[id] : null, world = w?.text[lang];
  const room = world?.effects.find(e => e.add === "room" && e.id === w.thumbnail.picture);
  if (!room?.picture) return null;
  const draw = typeof room.picture.draw === "string" ? parseShapes(room.picture.draw).shapes : room.picture.draw;
  return { draw, alt: room.alt, x: w.thumbnail.x };
}
