// Landing page: the list of games. One card per world (thumbnail, title, blurb, and buttons: NEW GAME, with CONTINUE beside it when
// the world has a saved game), under the logo. Drawn from the list the controller hands it, not from the game's state.
// Never decides which games exist or what a saved game is (js/main.js, worlds/index.js, js/saves.js); CONTINUE is the intent
// on.play(id), NEW GAME on.play(id, true) when there is a saved game it replaces (else on.play(id)). A world with a cover has a page of its own
// (/<id>/, ui/splash.js: CONTINUE and NEW GAME are there), so its card has one button, LOAD GAME, on.open(id).

import { VERSION } from "../js/version.js?v=0.70.0";
import { THUMB, thumbnailPixels, putPixels, RGB, paintPicture } from "./draw.js?v=0.70.0";
import art from "../content/art.js?v=0.70.0";
import { layoutTitle, titlePixels, stampTitle, fontNamed } from "../js/title.js?v=0.70.0";
import { thumbnails } from "./crt.js?v=0.70.0";

// The buttons on a card, left to right: CONTINUE (continues the saved game) when the world has one, then NEW GAME, which starts
// from scratch and drops the saved game (fresh: true; Diego, 27 Oct 2026: no question, choosing NEW GAME is the answer).
// A world with a cover (cover: true): one button, LOAD GAME, which goes to the world's page (open: true), saved game or not.
// t: the language pack's home texts.
export function buttonsFor(saved, t, cover = false) {
  if (cover) return [{ label: t.loadGame, open: true }];
  return saved ? [{ label: t.resume, fresh: false }, { label: t.newGame, fresh: true }] : [{ label: t.newGame, fresh: false }];
}

// Set up the page on its element (.home). Returns update(data).
export function mount(root, on) {
  const switcher = root.querySelector(".lang"), column = root.querySelector(".column"), version = root.querySelector(".version"), subtitle = root.querySelector(".subtitle");
  // A thumbnail: the bible's fixed crop (THUMB: 225 × 135, from column x), drawn once on a canvas of its own size. CSS stretches the
  // canvas to fill its slot, hard-edged (ui/home.css), so nothing here depends on the screen.
  // The pictures are painted once for each world and language (painting is the slow part: the list is drawn again on every visit to the
  // landing page, and a world's pictures don't change while the page is open); the canvases are new each time.
  const painted = new Map();
  let drawing = 0;                                                 // the list's drawing now (a newer one stops an older one's painting)
  const looks = thumbnails();                                      // the CRT look on each thumbnail, through one shared context
  function paintThumb(thumb, id, lang) {
    const key = lang + "/" + id + "@" + thumb.x;
    if (!painted.has(key)) painted.set(key, thumbnailPixels(thumb.draw, thumb.x));
    const canvas = document.createElement("canvas");
    canvas.width = THUMB.width; canvas.height = THUMB.height;
    const image = new ImageData(THUMB.width, THUMB.height);
    putPixels(image, painted.get(key), RGB);
    looks.add(canvas, image);                                     // drawn on the canvas, with the CRT look when it can (ui/crt.js)
    return canvas;
  }
  // A box art (art.boxart: 480 x 400, the title in its top band), still, as its phone crop (columns 80-399): 320 x 400, with the CRT look.
  const BOX = art.boxart, BW = BOX.crop[1] - BOX.crop[0] + 1, BH = BOX.height;
  function paintBox(box, id, lang) {
    const key = "box/" + lang + "/" + id;
    if (!painted.has(key)) {
      const full = paintPicture(box.draw, BOX.width, BOX.height).px;
      const ink = titlePixels(layoutTitle(box.title, fontNamed(art.cover.titleFont), box.titleAt, lang, "", 1, BOX), BOX.width, BOX.height);
      stampTitle(full, ink, box.titleColor);
      const out = new Uint8Array(BW * BH);
      for (let y = 0; y < BH; y++) out.set(full.subarray(y * BOX.width + BOX.crop[0], y * BOX.width + BOX.crop[0] + BW), y * BW);
      painted.set(key, out);
    }
    const canvas = document.createElement("canvas");
    canvas.width = BW; canvas.height = BH;
    const image = new ImageData(BW, BH);
    putPixels(image, painted.get(key), RGB);
    looks.add(canvas, image);
    return canvas;
  }

  // The game's popup (a modal dialog over a darker page): its screenshot, title, blurb and PLAY. A click outside it, or Esc, closes it.
  const dialog = document.createElement("dialog");
  dialog.className = "game-pop";
  root.append(dialog);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });   // (the backdrop is the dialog itself)
  async function openPop(w, t, lang) {
    on.preload?.(w.id);                                            // the game's files start loading now, so PLAY is instant (js/main.js)
    const saved = on.saved ? await on.saved(w.id) : !!w.saved;
    const shot = el("div", "tile");
    if (w.thumb) { const c = paintThumb(w.thumb, w.id, lang); c.setAttribute("role", "img"); c.setAttribute("aria-label", w.thumb.alt || w.title); shot.append(c); }
    const buttons = el("div", "buttons text-button");
    for (const b of buttonsFor(saved, t, w.cover)) buttons.append(button(b.label, w.title, () => { dialog.close(); b.open ? on.open(w.id) : on.play(w.id, b.fresh); }));
    const close = el("button", "close", "×"); close.type = "button"; close.setAttribute("aria-label", t.close ?? "Close"); close.addEventListener("click", () => dialog.close());
    dialog.replaceChildren(el("div", "pop card", ""));
    dialog.firstChild.append(close, shot, el("h2", "title text-heading", w.title), el("p", "blurb text-story", w.blurb), buttons);
    dialog.showModal();
    dialog.firstChild.tabIndex = -1;                               // the card takes the focus as it opens, not its ×: no ring on anything (Tab goes on to ×, PLAY)
    dialog.firstChild.focus({ focusVisible: false });
  }

  // One element with a class and text.
  function el(tag, cls, text) { const e = document.createElement(tag); e.className = cls; if (text !== undefined) e.textContent = text; return e; }

  // A card's button: its label in capitals (.text-button, typography.css), named for the world, and what a click does.
  function button(label, title, click) {
    const b = el("button", "play key", label);
    b.type = "button"; b.setAttribute("aria-label", `${label}: ${title}`); b.addEventListener("click", click);
    return b;
  }

  switcher.querySelectorAll("button").forEach(b => b.addEventListener("click", () => on.homeLanguage(b.dataset.lang)));

  return {
    // Draw the list: data = { lang, pack, worlds: [{ id, title, blurb, thumb: { draw, alt, x }, saved, cover }], failed }, newest first.
    // failed: a game's files didn't load: a short line says so above the list.
    update({ lang, pack, worlds, failed = false }) {
      const t = pack.home;
      switcher.querySelectorAll("button").forEach(b => {                 // the switch: the current language is pressed
        b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); b.setAttribute("aria-label", t.language(b.dataset.lang));
      });
      version.textContent = "v" + VERSION;
      version.setAttribute("aria-label", `${t.version} ${VERSION}`);
      subtitle.textContent = t.subtitle;
      looks.clear();                                                // (the canvases of the last drawing are gone)
      if (!worlds.length) { column.replaceChildren(el("p", "none text-story", t.none)); return; }
      const list = el("ul", "list boxes"), queue = [], run = ++drawing;
      list.setAttribute("role", "list");                           // (a list with no bullets loses its role in Safari)
      for (const w of worlds) {
        // The box art alone in the card's square (its border and padding); a click opens the game's popup.
        const card = el("li", "card box"), open = el("button", "box-open");
        open.type = "button"; open.setAttribute("aria-label", w.title); open.setAttribute("aria-haspopup", "dialog");
        // Painted one box a frame, the first at once: the grid shows straight away and fills in (17 November 2026: all of them first, a wait).
        queue.push(() => { const c = w.boxart ? paintBox(w.boxart, w.id, lang) : w.thumb ? paintThumb(w.thumb, w.id, lang) : null; if (c) { c.setAttribute("aria-hidden", "true"); open.append(c); } });
        open.addEventListener("click", () => openPop(w, t, lang));
        card.append(open);
        list.append(card);
      }
      column.replaceChildren(...(failed ? [Object.assign(el("p", "none text-story", t.loadFailed), { role: "status" })] : []), list);
      const next = () => { if (run !== drawing || !queue.length) return; queue.shift()(); if (queue.length) requestAnimationFrame(next); };
      next();
    }
  };
}
