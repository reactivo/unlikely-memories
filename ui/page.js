// Page-wide details that belong to no single piece: the page language, which view is shown (the list of games or the
// game: css/layout.css reads data-view), whether the tab is visible (the game clock pauses while it's hidden), and when
// the page is left (a waiting save is written), how much of the window the parts that stick take up (see followBars),
// and, on phones, whether the on-screen keyboard is open and how much of the window it covers (see followKeyboard).

// The keyboard is taken to be open when the visible area is at least this many pixels shorter than the window. (The
// browser's own bars growing and shrinking change it by less; a phone's keyboard, even sideways, by more.)
const KEYBOARD_MIN = 100;

// Phones and tablets (no hover, a coarse pointer: asked of the device, not of the window's width). Only they have an
// on-screen keyboard to make room for; on a computer none of this runs.
const touch = window.matchMedia("(hover: none) and (pointer: coarse)");

// The page scrolls and two parts of it stick: the top (title bar and picture) and the bottom (prompt and tabs). How
// tall they are depends on the window and the text, so the page measures them and reports them, as the one exception to
// "JS sets state, CSS decides the look": these are measured, not chosen. The CSS uses them to keep the story clear of them
// (a room's height: ui/log.css; where Tab scrolls to: css/base.css; the spacer under the fixed top on upright phones:
// css/layout.css) and ui/log.js and ui/fold.js to bring text into view.
//   --top-h      how much the top covers: its height while it sticks (windows at least 560px tall), else 0 (it scrolls away).
//                On an upright phone the top is fixed and its picture folds (css/layout.css, ui/fold.js): then it is the
//                height the top has when the picture is OPEN, whether or not it is open now, because that is where the
//                story starts, and where a new room's first line goes. (With the keyboard open that top lets go and scrolls with
//                the story, absolute instead of fixed, over the same spacer: still measured the same way, so nothing moves.)
//   --bottom-h   the bottom's height
function followBars(root) {   // returns update(): measure now
  const html = root.documentElement, top = root.querySelector(".top"), bottom = root.querySelector(".bottom");
  const picture = top.querySelector(".picture");
  const shown = {};   // what was last written (the top changes size every frame while the picture folds: write only a change)
  function put(name, px) {
    const value = px + "px";
    if (shown[name] !== value) html.style.setProperty(name, shown[name] = value);
  }
  // The top's height with the picture open: the top as it is, with the picture's box as tall as the crop makes it.
  // (To a hundredth of a pixel: the sum of the folding top's parts differs in the last digits from one frame to the next.)
  function openHeight() {
    const t = top.getBoundingClientRect(), p = picture.getBoundingClientRect();
    const crop = parseFloat(getComputedStyle(picture).getPropertyValue("--picture-crop")) || 320 / 136;   // (tokens.css)
    return Math.round((t.height - p.height + p.width / crop) * 100) / 100;
  }
  function update() {
    const position = getComputedStyle(top).position;   // (the CSS decides: no second copy of the breakpoints here)
    put("--top-h", position === "fixed" || position === "absolute" ? openHeight() : position === "sticky" ? top.getBoundingClientRect().height : 0);
    put("--bottom-h", bottom.getBoundingClientRect().height);
  }
  const watch = new ResizeObserver(update);   // (also when the game is shown: the page is not drawn while the list of games shows)
  watch.observe(top);
  watch.observe(bottom);
  window.addEventListener("resize", update);  // (the top can start or stop sticking without its size changing)
  root.fonts?.ready.then(update);
  update();
  return update;
}

// While the on-screen keyboard is open, tell the layout, so the keyboard pushes the page up: the prompt sits just above it,
// and the top lets go and scrolls away with the story (css/layout.css). Phones (iPhone Safari, Chrome and Firefox on
// Android) slide the keyboard over the page without resizing it: the window stays the same height and only the *visual
// viewport* (window.visualViewport) shrinks, and some pan it up besides. Sticky parts are placed against the window, not
// against that visual viewport, and no CSS knows the keyboard's height on an iPhone, so this is the one place that reads it.
// Like the bars above, the number is measured, not chosen; the layout decides what to do with it.
//   data-keyboard on <html>   the keyboard is open
//   --keyboard-h              how much of the window's bottom the keyboard (or the panned-away part) covers: the window's
//                             height minus the visible area's height and its offset (the bottom sticks this far up)
// Without the keyboard (or on a computer) nothing is set and the page is as ever.
function followKeyboard(root) {
  const vv = window.visualViewport;
  if (!vv) return;
  const html = root.documentElement;
  let open = false;
  const readout = keyboardReadout(root);
  function update() {
    const covered = window.innerHeight - vv.height - vv.offsetTop;
    const shown = touch.matches && vv.scale <= 1.01 && window.innerHeight - vv.height >= KEYBOARD_MIN;   // (not while pinch-zoomed)
    if (shown) {
      html.style.setProperty("--keyboard-h", Math.max(0, covered) + "px");
      if (!open) html.dataset.keyboard = "";
    } else if (open) {
      html.style.removeProperty("--keyboard-h");
      delete html.dataset.keyboard;
    }
    open = shown;
    readout(vv, shown);
  }
  vv.addEventListener("resize", update);
  vv.addEventListener("scroll", update);   // the browser panning the visible area up or back down
  window.addEventListener("scroll", () => readout(vv, open), { passive: true });
  update();
}

// TEMPORARY (keyboard testing on real phones, 28 Oct 2026; remove once the keyboard is settled): a small box in the top left
// corner with the numbers the keyboard handling goes by. Phones only.
function keyboardReadout(root) {
  if (!touch.matches) return () => {};
  const box = root.createElement("pre");
  box.style.cssText = "position:fixed;left:0;top:0;z-index:99;margin:0;padding:2px 4px;font:10px/1.3 monospace;" +
    "color:#fff;background:rgba(170,0,0,.85);pointer-events:none;white-space:pre";
  root.body.append(box);
  return (vv, shown) => {
    box.textContent = `win ${window.innerWidth}×${window.innerHeight}  vv ${Math.round(vv.width)}×${Math.round(vv.height)}\n` +
      `vv.top ${Math.round(vv.offsetTop)}  scroll ${Math.round(window.scrollY)}  zoom ${vv.scale.toFixed(2)}\n` +
      `keyboard ${shown ? "OPEN" : "no"}  covered ${Math.round(window.innerHeight - vv.height - vv.offsetTop)}`;
  };
}

// Set up on the document. Returns update() and show().
export function mount(root, on) {
  // The game puts the page where it should be itself (ui/log.js: a room's first line under the picture, the newest text). The
  // browser must not put it back where it was before a reload: Safari did, after the game had placed it, so the opening's first
  // lines started under the picture on an iPhone (Diego, 27 Oct 2026).
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  root.addEventListener("visibilitychange", () => on.visible(!root.hidden));
  window.addEventListener("pagehide", () => on.leaving());     // reload, closed tab: save what's waiting
  const measure = followBars(root);
  followKeyboard(root);
  return {
    // Show one view, "home" or "game", in a language: an open panel (map, settings) closes with the game.
    show(view, lang) {
      root.querySelectorAll(":popover-open").forEach(p => p.hidePopover());
      if (root.documentElement.dataset.view !== view) window.scrollTo(0, 0);   // the two views are two pages: each starts at its top
      root.documentElement.dataset.view = view;
      root.documentElement.lang = lang;
      measure();   // the page was not drawn a moment ago: measure it now, not when the observer next reports (a restored game scrolls at once)
    },
    // On a language change: <html lang> (for screen readers and hyphenation).
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      root.documentElement.lang = next.state.lang;
    }
  };
}
