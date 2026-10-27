// Landing page: the list of games. One card per world (thumbnail, title, blurb, and buttons: NEW GAME, with LOAD GAME beside it when
// the world has a saved game), under the logo. Drawn from the list the controller hands it, not from the game's state.
// Never decides which games exist or what a saved game is (js/main.js, worlds/index.js, js/saves.js); LOAD GAME is the intent
// on.play(id), NEW GAME on.play(id, true) when there is a saved game to ask about (else on.play(id)).

import art from "../content/art.js";
import { VERSION } from "../js/version.js";
import { THUMB, thumbnailPixels } from "./draw.js";

const RGB = art.palette.colors.map(hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)));

// The buttons on a card, left to right: LOAD GAME (continues the saved game) when the world has one, then NEW GAME, which asks
// first (ask: true) when there is a saved game to lose. pack: the language pack's home texts.
export function buttonsFor(saved, t) {
  return saved ? [{ label: t.load, ask: false }, { label: t.newGame, ask: true }] : [{ label: t.newGame, ask: false }];
}

// Set up the page on its element (.home). Returns update(data).
export function mount(root, on) {
  const switcher = root.querySelector(".lang"), column = root.querySelector(".column"), version = root.querySelector(".version"), subtitle = root.querySelector(".subtitle");
  // A thumbnail: the bible's fixed crop (THUMB: 225 × 135, from column x), drawn once on a canvas of its own size. CSS stretches the
  // canvas to fill its slot, hard-edged (ui/home.css), so nothing here depends on the screen.
  function paintThumb(thumb) {
    const canvas = document.createElement("canvas"), px = thumbnailPixels(thumb.draw, thumb.x);
    canvas.width = THUMB.width; canvas.height = THUMB.height;
    const ctx = canvas.getContext("2d"), image = ctx.createImageData(THUMB.width, THUMB.height);
    px.forEach((p, k) => { image.data.set([...RGB[p], 255], k * 4); });
    ctx.putImageData(image, 0, 0);
    return canvas;
  }
  // One element with a class and text.
  function el(tag, cls, text) { const e = document.createElement(tag); e.className = cls; if (text !== undefined) e.textContent = text; return e; }

  // A card's button: its label in capitals (.text-button, typography.css), named for the world, and what a click does.
  function button(label, title, click) {
    const b = el("button", "play", label);
    b.type = "button"; b.setAttribute("aria-label", `${label}: ${title}`); b.addEventListener("click", click);
    return b;
  }

  switcher.querySelectorAll("button").forEach(b => b.addEventListener("click", () => on.homeLanguage(b.dataset.lang)));

  return {
    // Draw the list: data = { lang, pack, worlds: [{ id, title, blurb, thumb: { draw, alt, x }, saved }] }, newest first.
    update({ lang, pack, worlds }) {
      const t = pack.home;
      switcher.querySelectorAll("button").forEach(b => {                 // the switch: the current language is pressed
        b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); b.setAttribute("aria-label", t.language(b.dataset.lang));
      });
      version.textContent = "v" + VERSION;
      version.setAttribute("aria-label", `${t.version} ${VERSION}`);
      subtitle.textContent = t.subtitle;
      if (!worlds.length) { column.replaceChildren(el("p", "none text-story", t.none)); return; }
      const list = el("ul", "list");
      list.setAttribute("role", "list");                           // (a list with no bullets loses its role in Safari)
      for (const w of worlds) {
        const card = el("li", "card"), tile = el("div", "tile"), body = el("div", "body");
        const buttons = el("div", "buttons text-button");
        for (const b of buttonsFor(w.saved, t)) buttons.append(button(b.label, w.title, () => on.play(w.id, b.ask)));
        if (w.thumb) {
          const canvas = paintThumb(w.thumb);
          canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", w.thumb.alt || w.title); tile.append(canvas);
        }
        body.append(el("h2", "title text-heading", w.title), el("p", "blurb text-story", w.blurb), buttons);
        card.append(tile, body);
        list.append(card);
      }
      column.replaceChildren(list);
    }
  };
}
