// Media: the page's media queries and layout probes, asked in one place (INTERFACE.md §14). A query is asked of the device or the window,
// and where the CSS decides a layout (css/layout.css) the script asks the CSS, never a copy of its breakpoints. `matchMedia` is
// missing in Node (a test that imports a ui/ module), so there a query simply doesn't match.

import art from "../content/art.js?v=0.49.3";

const ask = (query) => (typeof matchMedia === "function" ? matchMedia(query) : { matches: false, addEventListener() {}, removeEventListener() {} });

// Phones and tablets: no hover, a coarse pointer (asked of the device, not of the window's width). Only they have an on-screen
// keyboard.
export const touch = ask("(hover: none) and (pointer: coarse)");
// A desktop window: the strip layout (css/layout.css), where the middle of the whole map is the middle of the area.
export const wide = ask("(min-width: 760px) and (min-height: 560px)");
// The system's reduce-motion setting, and nothing else. The story's page (ui/follow.js: glideTo) follows the system only: it is the
// browser's own scroll, which no setting of the game's replaces.
export const reducedMotion = ask("(prefers-reduced-motion: reduce)");

// The game's own reduce motion, for what the game animates (the picture: ui/scene.js): the system's setting, if art.js says to
// respect it, unless <html data-motion> says "reduce" or "full" (the debug panel's setting, ui/debug.js; nothing else sets it).
// It differs from `reducedMotion` on purpose: the debug panel's override reaches the game's own animation, not the browser's scroll.
export const calm = () => {
  const forced = document.documentElement.dataset.motion;
  return forced ? forced === "reduce" : art.effects.respectReducedMotion && reducedMotion.matches;
};

// How the top (the title bar and the picture) is placed now, the CSS's own answer: "fixed" (an upright phone), "absolute" (the fixed
// top while you type, scrolling away with the story), "sticky" (a window at least 560px tall) or the rest (it scrolls away).
export const topMode = (top) => getComputedStyle(top).position;
