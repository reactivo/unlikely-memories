// Page-wide details that belong to no single piece: the page language, which view is shown (the list of games or the
// game: css/layout.css reads data-view), whether the tab is visible (the game clock pauses while it's hidden), and when
// the page is left (a waiting save is written), and, on phones, where the visible part of the screen is while the
// on-screen keyboard is open (see followKeyboard).

// The keyboard is taken to be open when the visible area is at least this many pixels shorter than the window. (The
// browser's own bars growing and shrinking change it by less; a phone's keyboard, even sideways, by more.)
const KEYBOARD_MIN = 100;

// Phones and tablets (no hover, a coarse pointer: asked of the device, not of the window's width). Only they have an
// on-screen keyboard to make room for; on a computer none of this runs.
const touch = window.matchMedia("(hover: none) and (pointer: coarse)");

// While the on-screen keyboard is open, tell the layout where the visible part of the screen is, so the whole page fits
// above the keyboard (css/layout.css), with the command line at the bottom edge of what you can see. Most phones
// (iPhone Safari, Chrome on Android) slide the keyboard over the page without resizing it: the window stays the same
// height and only the *visual viewport* (window.visualViewport) shrinks, and some pan it up besides. Nothing else
// reports that, so this is the one place that reads it. JS only reports the numbers (the one exception to "JS sets
// state, CSS decides the look": they are measured, not chosen); the layout decides what to do with them.
//   data-keyboard on <html>   the keyboard is open
//   --visible-height          the visible area's height; --visible-top  how far down from the top of the window it starts
// Without the keyboard (or on a computer) nothing is set and the page is the whole window high, as ever.
function followKeyboard(root) {
  const vv = window.visualViewport;
  if (!vv) return;
  const html = root.documentElement;
  let open = false;
  function update() {
    const shown = touch.matches && vv.scale <= 1.01 && window.innerHeight - vv.height >= KEYBOARD_MIN;   // (not while pinch-zoomed)
    if (shown) {
      html.style.setProperty("--visible-height", vv.height + "px");
      html.style.setProperty("--visible-top", vv.offsetTop + "px");
      if (!open) html.dataset.keyboard = "";
    } else if (open) {
      html.style.removeProperty("--visible-height");
      html.style.removeProperty("--visible-top");
      delete html.dataset.keyboard;
    }
    open = shown;
  }
  vv.addEventListener("resize", update);
  vv.addEventListener("scroll", update);   // the browser panning the visible area up or back down
  update();
}

// Set up on the document. Returns update() and show().
export function mount(root, on) {
  root.addEventListener("visibilitychange", () => on.visible(!root.hidden));
  window.addEventListener("pagehide", () => on.leaving());     // reload, closed tab: save what's waiting
  followKeyboard(root);
  return {
    // Show one view, "home" or "game", in a language: an open panel (map, settings) closes with the game.
    show(view, lang) {
      root.querySelectorAll(":popover-open").forEach(p => p.hidePopover());
      root.documentElement.dataset.view = view;
      root.documentElement.lang = lang;
    },
    // On a language change: <html lang> (for screen readers and hyphenation).
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      root.documentElement.lang = next.state.lang;
    }
  };
}
