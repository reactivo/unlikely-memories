// Which view a page address shows: the list of games (no hash), or one world (#<its id>). Pure: no page, so tests can run it.
// The controller (js/main.js) reads location.hash through this and never decides it itself.

import { hasWorld } from "../worlds/load.js?v=0.69.0";

// The view for an address's hash, in a language: { view: "home" } or { view: "game", id }; on a world's own page (/<id>/, `splash`: that world's
// id, from <html data-world>) the page's own views instead: { view: "splash", id } (no hash: the cover, its buttons), or the game (#<id>);
// any other hash there gives the splash, with replace: true; and { view: "away" } when the world isn't written in this language (the page
// goes to the list: it has no card, so no cover, there). On the list's page (no `splash`) an id that is no world written in this
// language gives the list, with replace: true (the controller replaces the address, so back doesn't return to it).
// freshFor: the id of a world the page was asked to open with a new game, its saved game dropped (NEW GAME on a card with a saved
// game). It is a request the controller makes once, not part of the address, so a reload never repeats it: the game result then
// says fresh: true.
export function routeOf(hash, lang, freshFor = null, splash = null) {
  let id = String(hash || "").replace(/^#/, "");
  try { id = decodeURIComponent(id); } catch (e) { /* a broken escape: it is no id */ }
  if (splash) {
    if (!hasWorld(splash, lang)) return { view: "away" };
    if (!id) return { view: "splash", id: splash };
    if (id === splash) return freshFor === id ? { view: "game", id, fresh: true } : { view: "game", id };
    return { view: "splash", id: splash, replace: true };
  }
  if (!id) return { view: "home" };
  if (hasWorld(id, lang)) return freshFor === id ? { view: "game", id, fresh: true } : { view: "game", id };
  return { view: "home", replace: true };
}

// The hash that opens a world.
export const hashOf = (id) => "#" + id;
