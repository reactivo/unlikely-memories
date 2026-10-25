// Which view a page address shows: the list of games (no hash), or one world (#<its id>). Pure: no page, so tests can run it.
// The controller (js/main.js) reads location.hash through this and never decides it itself.

import { WORLDS } from "../worlds/index.js";

// The view for an address's hash, in a language: { view: "home" } or { view: "game", id }. An id that is no world written in
// this language gives the list, with replace: true (the controller replaces the address, so back doesn't return to it).
// askFor: the id of a world the page was asked to open and ask for a new game in (NEW GAME on a card with a saved game). It is a
// request the controller makes once, not part of the address, so a reload never repeats it: the game result then says askNew: true.
export function routeOf(hash, lang, askFor = null) {
  let id = String(hash || "").replace(/^#/, "");
  try { id = decodeURIComponent(id); } catch (e) { /* a broken escape: it is no id */ }
  if (!id) return { view: "home" };
  if (Object.hasOwn(WORLDS, id) && WORLDS[id].text[lang]) return askFor === id ? { view: "game", id, askNew: true } : { view: "game", id };
  return { view: "home", replace: true };
}

// The hash that opens a world.
export const hashOf = (id) => "#" + id;
