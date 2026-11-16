// A world's own page, /<id>/ (docs/splash/PLAN.md; INTERFACE.md §13a): its cover (a 480 × 400 picture, painted by the game's painter and
// animated by its cycles and loops, as the room's picture is: ui/scene.js) with the world's title drawn into its pixels, and the buttons: CONTINUE
// (only with a saved game), NEW GAME, and the way back to the list of games. Drawn from what the controller hands it (js/main.js,
// showSplash), never from the game's state; it decides nothing about which game is saved or what starting one does (the buttons are
// on.play(id), on.play(id, true), as on a card of the list: ui/home.js). The music is the controller's too (ui/sound.js).
// The canvas is the cover's own 480 × 400 pixels; CSS stretches it with hard edges (ui/splash.css). On an upright phone the box shows only the
// crop (columns 80-399: css/layout.css's own test for the room's picture crop, `--splash-cols` 320; asked of the CSS here) at a width of whole device
// pixels per cover pixel (js/cover.js, fitWidth: the poster's width is set here from what the CSS leaves, `--splash-width`, asked of a probe); on a
// wide window the whole 480 × 400 shows at the width the CSS gives (fitted to the window's height, any scale: the CRT look hides the unevenness).
// The cover draws itself when the page opens, as Sierra's pictures did: its drawing list painted shape by shape (js/paint.js, painter: one more
// shape onto the grid as it is) in art.cover.drawIn.ms in all (js/cover.js, shownAt), then the title, then the cycles and loops begin. A tap,
// click or key skips to the finished poster (it only finishes: a button pressed then does its own action as always); reduced motion shows the
// finished poster at once. It plays at every opening of the page (QUIT back to it too).
// A cover is a full poster; a pixel no shape paints is still clear (transparent: js/paint.js, CLEAR). The title is the engine's: laid out by
// js/title.js (capitals, in the cover's `title` colour, in its band, `titleAt`, in the font the cover or the debug panel names:
// content/titlefonts/) and stamped on every frame after the painting and the cycles, so nothing animated covers it. The CRT look (ui/crt.js) is
// drawn from the finished pixels each frame drawn, as the room's picture has it; a cover with clear pixels (transparent) gets none, as the
// look is an opaque rectangle.

import art from "../content/art.js?v=0.61.0";
import { layoutTitle, titlePixels, stampTitle, fontNamed } from "../js/title.js?v=0.61.0";
import { putPixels, compileLoop, underMask, RGB, CLEAR_PIXEL } from "./draw.js?v=0.61.0";
import { painter } from "../js/paint.js?v=0.61.0";
import { shownAt, fitWidth, cropColumns } from "../js/cover.js?v=0.61.0";
import { screen } from "./crt.js?v=0.61.0";
import { prepareCycle, motionInto, stepsOf } from "./effects.js?v=0.61.0";
import { reducedMotion, calm } from "./media.js?v=0.61.0";

// The cover's size (art.cover): 480 wide, 400 tall.
export const COVER = { width: art.cover.width, height: art.cover.height };

// The buttons, in order, for a world: CONTINUE only with a saved game; NEW GAME drops the saved game (fresh) when there is one (as on a
// card: ui/home.js). t: the language pack's home texts.
export function buttonsFor(saved, t) {
  return saved ? [{ label: t.resume, fresh: false }, { label: t.newGame, fresh: true }] : [{ label: t.newGame, fresh: false }];
}

// Set up the page on its element (#splash). Returns { show(data), stop() }.
export function mount(root, on) {
  const W = COVER.width, H = COVER.height;
  const canvas = root.querySelector(".cover canvas"), heading = root.querySelector(".name"), keys = root.querySelector(".buttons");
  const back = root.querySelector(".back");
  canvas.width = W; canvas.height = H;
  back.addEventListener("click", () => on.list());             // ALL GAMES: the list of games
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(W, H);
  const look = screen(canvas, { w: W, h: H });          // the CRT look: a WebGL canvas after this one, drawn from `image` (ui/crt.js)
  const poster = root.querySelector(".poster");
  const probe = document.createElement("div");          // as wide as the CSS leaves the poster (--splash-width): fitWidth rounds it down
  probe.className = "fit"; probe.setAttribute("aria-hidden", "true");
  root.append(probe);
  let frame = null, cycles = [], loops = [], loop = 0, lastSteps = "";
  let opaque = true, data = null, font = art.cover.titleFont, ink = null, color = 15;       // the page shown, the title's font (setFont), its pixels and colour
  const layer = { src: null, covered: null };           // (no overlays on a cover: nothing a scroll must leave alone)

  // Is it the phone's crop now? The CSS's answer (--splash-cols, layout.css: 320 on an upright phone, the whole width elsewhere).
  const cropped = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--splash-cols")) < W;
  // The poster's width: on a phone, the crop at whole device pixels to a cover pixel (js/cover.js), at most what the CSS leaves; elsewhere the CSS's own.
  // Again on every resize (a zoom is one).
  function fit() {
    const avail = probe.getBoundingClientRect().width;
    if (!cropped()) poster.style.removeProperty("width");
    else if (avail > 0) poster.style.width = fitWidth(avail, window.devicePixelRatio || 1, cropColumns()) + "px";
  }
  window.addEventListener("resize", fit);                // (a zoom changes the ratio; the probe's own size is watched too: it has none while the page is hidden)
  if (typeof ResizeObserver === "function") new ResizeObserver(fit).observe(probe);

  // The draw-in: `whole` is the finished poster (painted once, at the start), `build` the painter that shows it growing, `began` when it started, `shown` the shapes painted so far; null once finished.
  let from = 0, whole = null, build = null, began = 0, shown = 0, draw = null;
  const stopSkip = () => { for (const e of ["pointerdown", "keydown"]) document.removeEventListener(e, finish, true); };
  // Finish the drawing at once (a tap or key; reduced motion; the last shape): the poster as painted, its cycles and loops from now.
  function finish() {
    if (!build) return;
    stopSkip();
    const now = performance.now(), areas = whole.areas();
    from = now;
    frame = whole.px; layer.src = frame; build = null;
    cycles = (draw.cycles || []).map(c => prepareCycle(c, frame, areas, W, H, now));
    loops = (draw.loops || []).map(l => ({ l, sprite: compileLoop(l), mem: { tick: 0, frame: 0 }, t0: now, hide: underMask(l, areas, W, H) }));
    render(now); animate();
  }

  const stepsAt = (now) => stepsOf(cycles, loops, now, calm());
  function render(now, steps = stepsAt(now)) {
    const out = frame.slice();
    if (!build) {
      motionInto(out, cycles, loops, steps, layer, calm(), W, H);   // the cycles and loops, as the room's picture has them
      lastSteps = steps.join();
      if (ink) stampTitle(out, ink, color);                         // the title last: nothing animated covers it
    }
    putPixels(image, out, RGB);
    ctx.putImageData(image, 0, 0);
    if (opaque) look.draw(image);                         // the CRT look, over the finished pixels: once per frame drawn
  }
  function tick(now) {
    now = Math.max(now, from);                            // (a frame's stamp can be from before the tap that finished the drawing: the loops' clocks start then)
    if (build) {
      const n = shownAt(draw.draw.length, now - began);
      if (n >= draw.draw.length) finish();
      else if (n > shown) { build.to(n); shown = n; render(now); }
      loop = build ? requestAnimationFrame(tick) : 0;
      if (!build) animate();
      return;
    }
    const steps = stepsAt(now);
    if (steps.join() !== lastSteps) render(now, steps);   // nothing moved: leave the canvas as it is
    loop = (cycles.length || loops.length) && !calm() ? requestAnimationFrame(tick) : 0;
  }
  const animate = () => { if (!loop) loop = requestAnimationFrame(tick); };
  const motionChanged = () => { if (frame) { if (build && calm()) finish(); else { render(performance.now()); animate(); } } };
  reducedMotion.addEventListener("change", motionChanged);
  new MutationObserver(motionChanged).observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });   // (see calm)

  // The title's pixels, from the world's title in the page's language, the font and the cover's band and colour.
  function layoutInk() {
    const { cover, name, lang } = data;
    color = cover.titleColor ?? 15;
    ink = titlePixels(layoutTitle(name, fontNamed(font), cover.titleAt ?? "top", lang), W, H);
  }

  const key = (label, name, click) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "play key"; b.textContent = label;
    b.setAttribute("aria-label", `${label}: ${name}`); b.addEventListener("click", click);
    return b;
  }

  return {
    // The title's font by name (content/titlefonts/; null or an unknown name: art.js's): drawn again at once when the page is up. The debug panel's.
    setFont(id) {
      font = fontNamed(id ?? art.cover.titleFont).id;
      if (frame) { layoutInk(); render(performance.now()); }
    },
    // Draw the page: data = { id, title, lang, cover: { titleColor, titleAt, draw (a drawing list), cycles, loops }, pack, saved }.
    show({ id, title: name, cover, pack, saved, lang }) {
      const t = pack.home, now = performance.now();
      data = { name, cover, lang };
      heading.textContent = name;
      canvas.setAttribute("aria-label", name);
      document.title = `${name} · Unlikely Memories`;
      keys.replaceChildren(...buttonsFor(saved, t).map(b => key(b.label, name, () => on.play(id, b.fresh))));
      back.textContent = t.allGames;
      back.setAttribute("aria-label", t.allGames);
      stopSkip(); cancelAnimationFrame(loop); loop = 0;
      draw = cover; cycles = []; loops = []; lastSteps = "";
      whole = painter(cover.draw, W, H, CLEAR_PIXEL); whole.to(Infinity);
      opaque = whole.px.every(c => c !== CLEAR_PIXEL);
      build = painter(cover.draw, W, H, CLEAR_PIXEL); frame = build.px; layer.src = frame;
      layoutInk();
      fit();
      began = now; shown = Math.min(1, cover.draw.length); build.to(shown);   // the first shape, the background, at once
      if (calm() || cover.draw.length <= 1) return finish();
      render(now);
      for (const e of ["pointerdown", "keydown"]) document.addEventListener(e, finish, true);   // (never stops the event: a button pressed still acts)
      animate();
    },
    // The page is left (the game starts, or the list shows): the animation stops.
    stop() { stopSkip(); cancelAnimationFrame(loop); loop = 0; build = null; whole = null; frame = null; ink = null; }
  };
}
