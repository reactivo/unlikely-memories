// Landing page: the list of games. One card per world (thumbnail, title, blurb, and buttons: NEW GAME, with LOAD GAME beside it when
// the world has a saved game), under the title and ornament. Drawn from the list the controller hands it, not from the game's state.
// Never decides which games exist or what a saved game is (js/main.js, worlds/index.js, js/saves.js); LOAD GAME is the intent
// on.play(id), NEW GAME on.play(id, true) when there is a saved game to ask about (else on.play(id)).

import art from "../content/art.js";
import { VERSION } from "../js/version.js";
import { paint } from "./draw.js";
import { scaleFor, thumbFit, thumbCrop, PHONE } from "./fit.js";

const RGB = art.palette.colors.map(hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)));

// The buttons on a card, left to right: LOAD GAME (continues the saved game) when the world has one, then NEW GAME, which asks
// first (ask: true) when there is a saved game to lose. pack: the language pack's home texts.
export function buttonsFor(saved, t) {
  return saved ? [{ label: t.load, ask: false }, { label: t.newGame, ask: true }] : [{ label: t.newGame, ask: false }];
}

// Set up the page on its element (.home). Returns update(data) and fit().
export function mount(root, on) {
  const switcher = root.querySelector(".lang"), column = root.querySelector(".column"), version = root.querySelector(".version"), subtitle = root.querySelector(".subtitle");
  const page = document.documentElement;
  let cards = [];                          // the cards on screen: { card, tile, canvas, small, x, room }
  const dpr = () => window.devicePixelRatio || 1;

  // Size the column like the game's (the largest whole number of screen pixels per picture pixel that fits 75 characters or the
  // window, as ui/scene.js does for the picture), then each thumbnail in its slot. Runs when the list changes, on
  // resize, when the zoom changes and when the font has loaded. Does nothing while the game is the view on screen.
  function fit() {
    if (!root.getClientRects().length) return;
    const ratio = dpr();
    page.style.removeProperty("--column-w");                       // measure the column's natural width
    if (!column.clientWidth) return;
    if (!matchMedia(PHONE).matches) {                              // phones: the list fills the width inside the page's padding
      const k = scaleFor(column.clientWidth, art.picture.width, ratio);
      page.style.setProperty("--column-w", art.picture.width * k / ratio + "px");
    }
    for (const c of cards) { c.card.style.removeProperty("--thumb-w"); c.card.style.removeProperty("--thumb-h"); }   // the layout's own slot…
    for (const c of cards) c.room = c.tile.getBoundingClientRect().width;                                           // …measured…
    for (const c of cards) place(c, ratio);                                                                          // …and filled
  }
  // The thumbnail fills its slot exactly (the slot is the layout's: ui/home.css), at a whole number of screen pixels per picture
  // pixel: the picture is cropped to fit (ui/fit.js thumbFit, thumbCrop), the tile and the card's left column are narrowed to the
  // canvas (--thumb-w, --thumb-h: computed sizes), and the canvas is lined up on the screen's pixel grid.
  function place(c, ratio) {
    const f = thumbFit(c.room, ratio);
    if (!f) return;
    const { left, top } = thumbCrop(c.x, f.cw, f.ch), w = f.cw * f.s, h = f.ch * f.s;
    c.card.style.setProperty("--thumb-w", f.cssW + "px"); c.card.style.setProperty("--thumb-h", f.cssH + "px");
    if (c.canvas.width !== w || c.canvas.height !== h) { c.canvas.width = w; c.canvas.height = h; }
    c.canvas.style.width = f.cssW + "px"; c.canvas.style.height = f.cssH + "px";
    c.canvas.style.left = c.canvas.style.top = "0px";
    const r = c.tile.getBoundingClientRect(), snap = (v) => Math.round(v * ratio) / ratio - v;   // distance to the nearest screen pixel
    c.canvas.style.left = snap(r.left) + "px"; c.canvas.style.top = snap(r.top) + "px";
    const ctx = c.canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;                             // hard edges: the browser never rescales
    ctx.drawImage(c.small, left, top, f.cw, f.ch, 0, 0, w, h);
  }
  // The whole picture's pixels (320 × 136), once, on a canvas of their own size.
  function paintPicture(thumb) {
    const small = document.createElement("canvas"), px = paint(thumb.draw);
    small.width = art.picture.width; small.height = art.picture.height;
    const ctx = small.getContext("2d"), image = ctx.createImageData(small.width, small.height);
    px.forEach((p, k) => { image.data.set([...RGB[p], 255], k * 4); });
    ctx.putImageData(image, 0, 0);
    return small;
  }
  // One element with a class and text.
  function el(tag, cls, text) { const e = document.createElement(tag); e.className = cls; if (text !== undefined) e.textContent = text; return e; }

  // A card's button: its label in capitals (home.css), named for the world, and what a click does.
  function button(label, title, click) {
    const b = el("button", "play", label);
    b.type = "button"; b.setAttribute("aria-label", `${label}: ${title}`); b.addEventListener("click", click);
    return b;
  }

  switcher.querySelectorAll("button").forEach(b => b.addEventListener("click", () => on.homeLanguage(b.dataset.lang)));
  window.addEventListener("resize", fit);
  const watchZoom = () => matchMedia(`(resolution: ${dpr()}dppx)`).addEventListener("change", () => { fit(); watchZoom(); }, { once: true });
  watchZoom();
  document.fonts.ready.then(fit);

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
      cards = [];
      if (!worlds.length) { column.replaceChildren(el("p", "none", t.none)); return; }
      const list = el("ul", "list");
      list.setAttribute("role", "list");                           // (a list with no bullets loses its role in Safari)
      for (const w of worlds) {
        const card = el("li", "card"), tile = el("div", "tile"), canvas = document.createElement("canvas"), body = el("div", "body");
        const buttons = el("div", "buttons");
        for (const b of buttonsFor(w.saved, t)) buttons.append(button(b.label, w.title, () => on.play(w.id, b.ask)));
        if (w.thumb) { canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", w.thumb.alt || w.title); tile.append(canvas); }
        body.append(el("h2", "title", w.title), el("p", "blurb", w.blurb), buttons);
        card.append(tile, body);
        list.append(card);
        if (w.thumb) cards.push({ card, tile, canvas, small: paintPicture(w.thumb), x: w.thumb.x, room: 0 });
      }
      column.replaceChildren(list);
      fit();
    },
    fit
  };
}
