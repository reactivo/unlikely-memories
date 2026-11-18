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
// shape onto the grid as it is) in art.cover.drawIn.ms in all (js/cover.js, shownAt), under the title (there from the start), then the cycles and loops begin. A tap,
// click or key skips to the finished poster (it only finishes: a button pressed then does its own action as always); reduced motion shows the
// finished poster at once. It plays at every opening of the page (QUIT back to it too).
// A cover is a full poster; a pixel no shape paints is still clear (transparent: js/paint.js, CLEAR). The title is the engine's: laid out by
// js/title.js (capitals, in the cover's `title` colour, in its band, `titleAt`, in the font the cover or the debug panel names:
// content/titlefonts/) and stamped on every frame after the painting and the cycles, so nothing animated covers it. The CRT look (ui/crt.js) is
// drawn from the finished pixels each frame drawn, as the room's picture has it; a cover with clear pixels (transparent) gets none, as the
// look is an opaque rectangle.

import art from "../content/art.js?v=0.64.1";
import { layoutTitle, titlePixels, stampTitle, fontNamed } from "../js/title.js?v=0.64.1";
import { putPixels, compileLoop, underMask, RGB, CLEAR_PIXEL } from "./draw.js?v=0.64.1";
import { painter } from "../js/paint.js?v=0.64.1";
import { shownAt, fitWidth, cropColumns } from "../js/cover.js?v=0.64.1";
import { screen, settings as lookSettings } from "./crt.js?v=0.64.1";
import { prepareCycle, motionInto, stepsOf } from "./effects.js?v=0.64.1";
import { reducedMotion, calm } from "./media.js?v=0.64.1";

// The cover's size (art.cover): 480 wide, 400 tall.
export const COVER = { width: art.cover.width, height: art.cover.height };

// The buttons, in order, for a world: CONTINUE only with a saved game; NEW GAME drops the saved game (fresh) when there is one (as on a
// card: ui/home.js). t: the language pack's home texts.
export function buttonsFor(saved, t) {
  // START NEW GAME alone; with a saved game CONTINUE (the one that blinks) and NEW GAME beside it, which drops the saved game (fresh).
  return saved ? [{ label: t.resume, fresh: false, main: true }, { label: t.newGame, fresh: true }] : [{ label: t.start ?? t.newGame, fresh: false, main: true }];
}

// Set up the page on its element (#splash). Returns { show(data), stop() }.
export function mount(root, on) {
  const W = COVER.width, H = COVER.height;
  const canvas = root.querySelector(".cover canvas"), heading = root.querySelector(".name"), keys = root.querySelector(".buttons");
  const back = root.querySelector(".back"), kicker = root.querySelector(".kicker");
  // The whole poster is one picture, under the CRT look as a whole: the canvas is the poster's box (the column, or the phone's screen), ROWS
  // cover pixels tall (the box shows as many as it is high), the page's colour (the cover's background) everywhere but where the cover is:
  // its title's band (rows 0 to BAND) and under it the art (rows BAND on), as many of its rows as the box's height leaves above the key and
  // the link (all of them on a phone, in the middle 320 columns; on a wide window all 480 columns and the art's top rows, cut at the bottom
  // edge), `off` rows from the top (a phone: under the clock; a wide window: the whole centred). The key and the link are HTML over it.
  const BAND = art.cover.bands.top[1], ART = art.cover.bands.bottom[0] - BAND, ROWS = 1000, MIN = 140;
  let off = 0, artRows = ART, bg = 0, cut = 0, inkCrop = null;     // cut: the band's empty rows above the title, left out (the title as high as the box lets it)
  canvas.width = W; canvas.height = ROWS;
  back.addEventListener("click", () => on.list());             // ALL GAMES: the list of games
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(W, ROWS);
  const shownPx = new Uint8Array(W * ROWS);
  const look = screen(canvas, { w: W, h: ROWS, steady: true });   // (no CRT flicker on a cover: the room's picture keeps it)          // the CRT look: a WebGL canvas after this one, drawn from `image` (ui/crt.js)
  const poster = root.querySelector(".poster");
  const keysBox = root.querySelector(".keys");
  let frame = null, cycles = [], loops = [], loop = 0, lastSteps = "";
  let opaque = true, data = null, font = art.cover.titleFont, ink = null, color = 15;       // the page shown, the title's font (setFont), its pixels and colour
  const layer = { src: null, covered: null };           // (no overlays on a cover: nothing a scroll must leave alone)

  // Enter or Space presses the key (when nothing else has the focus).
  document.addEventListener("keydown", (e) => {
    if (document.documentElement.dataset.view !== "splash" || build) return;
    if ((e.key === "Enter" || e.key === " ") && !(document.activeElement instanceof HTMLButtonElement)) {
      e.preventDefault(); keys.querySelector("button.main")?.click();
    }
  });
  // The page's colour: the cover's own background, its first row (the top band is one flat colour). On <html>, for base.css and splash.css.
  function paintPage(px) {
    const c = px[240] === CLEAR_PIXEL ? 0 : px[240], [r, g, b] = RGB[c] ?? [0, 0, 0];
    bg = c;
    const hex = "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
    document.documentElement.style.setProperty("--splash-bg", hex);
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.append(meta); }
    meta.content = hex;
  }

  // With the CRT look on, the cover's flat colour comes out a little brighter (its glow) or darker (its scanlines) than the palette's: the page
  // takes the colour the look really gives the top band (an average of a patch of it, read from the look's canvas right after it is drawn).
  // It is read after the page is on screen (a read from the GPU makes the browser wait for it: never before the first frame), and kept for
  // the colour, the canvas's size and the look's settings, so a page opened again takes it at once.
  let match = true, matching = 0;
  const matched = new Map();
  const lookKey = () => { const gl = canvas.nextElementSibling; return gl instanceof HTMLCanvasElement ? `${bg}|${gl.width}x${gl.height}|${JSON.stringify(lookSettings())}` : null; };
  const setPageColour = (hex) => { document.documentElement.style.setProperty("--splash-bg", hex); document.querySelector('meta[name="theme-color"]')?.setAttribute("content", hex); };
  function scheduleMatch() {
    const key = lookKey();
    if (key && matched.has(key)) return setPageColour(matched.get(key));
    cancelAnimationFrame(matching);
    matching = requestAnimationFrame(() => setTimeout(() => {      // (the frame after this one, once it is painted)
      if (!frame || !image) return;
      if (opaque) look.draw(image);                               // (drawn again just before the read: the canvas keeps no drawing between frames)
      const hex = matchLook(), k = lookKey();
      if (hex && k) matched.set(k, hex);
    }, 0));
  }
  function matchLook() {
    const gl = canvas.nextElementSibling;
    if (!(gl instanceof HTMLCanvasElement) || !gl.width || getComputedStyle(gl).display === "none") return;
    const t = document.createElement("canvas"); t.width = 8; t.height = 8;
    const c = t.getContext("2d", { willReadFrequently: true });
    c.drawImage(gl, gl.width * 4 / W, gl.height * 1 / ROWS, gl.width * 40 / W, gl.height * 4 / ROWS, 0, 0, 8, 8);   // (a corner of the band: away from the title and its glow)
    const d = c.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    const n = d.length / 4, hex = "#" + [r, g, b].map(v => Math.round(v / n).toString(16).padStart(2, "0")).join("");
    if (hex === "#000000") return null;                   // (nothing drawn yet)
    setPageColour(hex);
    return hex;
  }
  window.addEventListener("resize", () => { match = true; });

  // Is it the phone's crop now? The CSS's answer (--splash-cols, layout.css: 320 on an upright phone, the whole width elsewhere).
  const cropped = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--splash-cols")) < W;
  // Two keys side by side when they fit, else one above the other, then as wide as each other (the wider one's width: ui/splash.css).
  function stackKeys() {
    keys.classList.remove("stacked");
    if (keys.children.length > 1 && keys.scrollWidth > poster.clientWidth - 2 * 16) keys.classList.add("stacked");
  }

  // Where the cover goes in the box, and how much of its art shows: again on every resize (a zoom is one).
  function fit() {
    if (data && cropped() !== inkCrop) layoutInk();          // (the phone's crop came or went: the small line's size follows)
    const box = poster.getBoundingClientRect(), cs = getComputedStyle(poster), crop = cropped(), cols = crop ? 320 : W;
    if (!box.width || !box.height) return;
    const s = box.width / cols, padTop = Number.parseFloat(cs.paddingTop) || 0, padBottom = Number.parseFloat(cs.paddingBottom) || 0;
    // The gap above the key: as much as from the key to the link's words (the keys' gap and the link's padding: ui/splash.css).
    const backPad = Number.parseFloat(getComputedStyle(back).paddingTop) || 0;
    const gap = (Number.parseFloat(getComputedStyle(keysBox).rowGap) || 0) + backPad, keysHigh = keysBox.offsetHeight + gap;
    const band = BAND - cut;
    const art = Math.max(MIN, Math.min(ART, Math.floor((box.height - padTop - padBottom - keysHigh) / s) - band));
    const block = (band + art) * s + keysHigh;
    const top = crop ? padTop : Math.max(padTop, (box.height - block) / 2);
    const o = Math.round(top / s);
    poster.style.setProperty("--canvas-h", `${ROWS * s}px`);   // (both canvases, the plain one and the CRT look's: ui/splash.css)
    keysBox.style.top = `${(o + band + art) * s + gap}px`;
    stackKeys();
    if (o !== off || art !== artRows) { off = o; artRows = art; match = true; if (frame) render(performance.now()); }
  }
  window.addEventListener("resize", fit);                // (a zoom changes the ratio; the probe's own size is watched too: it has none while the page is hidden)
  if (typeof ResizeObserver === "function") new ResizeObserver(fit).observe(poster);

  // The draw-in: `build` the painter that shows the poster growing (and, painted to its end, the finished poster: one painting in all, so the page
  // shows at once: 18 November 2026), `began` when it started, `shown` the shapes painted so far; null once finished.
  let setKeys = null;                                    // the keys for the page shown (show(): its world and language)
  let from = 0, build = null, began = 0, shown = 0, draw = null;
  const stopSkip = () => { for (const e of ["pointerdown", "keydown"]) document.removeEventListener(e, finish, true); };
  // Finish the drawing at once (a tap or key; reduced motion; the last shape): the poster as painted, its cycles and loops from now.
  function finish() {
    if (!build) return;
    stopSkip();
    build.to(Infinity);
    const now = performance.now(), areas = build.areas();
    from = now;
    frame = build.px; layer.src = frame; build = null;
    opaque = frame.every(c => c !== CLEAR_PIXEL);
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
    }
    if (ink) stampTitle(out, ink, color);                           // the title from the first frame (the picture draws itself in under it), and last: nothing animated covers it
    shownPx.fill(bg);                                                // the page's colour, the band, then the art's rows that show
    shownPx.set(out.subarray(cut * W, (BAND + artRows) * W), off * W);
    putPixels(image, shownPx, RGB);
    ctx.putImageData(image, 0, 0);
    if (opaque) { look.draw(image); if (match) { match = false; scheduleMatch(); } }   // (from the first frame: the band is the background from the start)   // the CRT look, over the finished pixels: once per frame drawn
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
    const { cover, name, lang, kick } = data;
    color = cover.titleColor ?? 15;
    inkCrop = cropped();
    const lay = layoutTitle(name, fontNamed(font), cover.titleAt ?? "top", lang, kick, 1);   // (the small line: one font pixel to a cover pixel, phone and desktop alike)
    const [r, g, b] = RGB[color] ?? [255, 255, 255];
    poster.style.setProperty("--splash-ink", `rgb(${r} ${g} ${b})`);    // the keys and the link in the title's colour
    ink = titlePixels(lay, W, H);
    cut = Math.max(0, lay.top - 2);
  }

  const key = (label, name, click, main) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = main ? "start main" : "start"; b.textContent = label;
    b.setAttribute("aria-label", `${label}: ${name}`); b.addEventListener("click", click);
    return b;
  }

  return {
    // The title's font by name (content/titlefonts/; null or an unknown name: art.js's): drawn again at once when the page is up. The debug panel's.
    setFont(id) {
      font = fontNamed(id ?? art.cover.titleFont).id;
      if (frame) { layoutInk(); fit(); render(performance.now()); }
    },
    // Draw the page: data = { id, title, lang, cover: { titleColor, titleAt, draw (a drawing list), cycles, loops }, pack, saved }.
    show({ id, title: name, cover, pack, saved, lang }) {
      const t = pack.home, now = performance.now();
      data = { name, cover, lang, kick: t.kicker ?? "" };
      heading.textContent = name;
      canvas.setAttribute("aria-label", name);
      document.title = `${name} · Unlikely Memories`;
      setKeys = (has) => keys.replaceChildren(...buttonsFor(has, t).map(b => key(b.label, name, () => on.play(id, b.fresh), b.main)));
      // Not known yet (null: the saved game is still being read), the keys' place is kept by an unseen START, so nothing moves when they come.
      setKeys(!!saved);
      if (saved == null) for (const b of keys.children) { b.style.visibility = "hidden"; b.disabled = true; }
      back.textContent = t.backToList ?? t.allGames;
      kicker.textContent = t.kicker ?? "";                  // (for a screen reader: the line itself is drawn into the cover)
      stopSkip(); cancelAnimationFrame(loop); loop = 0;
      draw = cover; cycles = []; loops = []; lastSteps = "";
      build = painter(cover.draw, W, H, CLEAR_PIXEL); frame = build.px; layer.src = frame;
      began = now; shown = Math.min(1, cover.draw.length); build.to(shown);   // the first shape, the background, at once
      while (frame[240] === CLEAR_PIXEL && shown < cover.draw.length) build.to(++shown);   // (and on until the band's colour is there)
      opaque = frame.every(c => c !== CLEAR_PIXEL);           // (a cover's first shape fills it: the rules; if not, finish() says so once it is all painted)
      paintPage(frame); match = true;
      layoutInk();
      fit();
      if (calm() || cover.draw.length <= 1) return finish();
      render(now);
      for (const e of ["pointerdown", "keydown"]) document.addEventListener(e, finish, true);   // (never stops the event: a button pressed still acts)
      animate();
    },
    // The saved game, once read (show() was given saved: null): its keys, CONTINUE and NEW GAME or START.
    saved(has) { if (!setKeys) return; setKeys(!!has); fit(); },
    // The page is left (the game starts, or the list shows): the animation stops.
    stop() { stopSkip(); cancelAnimationFrame(loop); loop = 0; build = null; frame = null; ink = null; setKeys = null; cancelAnimationFrame(matching); }
  };
}
