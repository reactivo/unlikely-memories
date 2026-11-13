// Page-wide details that belong to no single piece: the page language, which view is shown (the list of games or the
// game: css/layout.css reads data-view), whether the tab is visible (the game clock pauses while it's hidden), and when
// the page is left (a waiting save is written), how much of the window the parts that stick take up (see followBars),
// on phones, whether you are typing (see followTyping), the background's flash when you are hurt or healed (see flash), and what is
// locked while you sleep (see sleeper).

import { reactionOf } from "./effects.js?v=0.48.2";
import { touch, topMode } from "./media.js?v=0.48.2";

// The page scrolls and two parts of it stick: the top (title bar and picture) and the bottom (prompt and tabs). How
// tall they are depends on the window and the text, so the page measures them and reports them, as the one exception to
// "JS sets state, CSS decides the look": these are measured, not chosen. The CSS uses them to keep the story clear of them
// (a room's height: ui/log.css; where Tab scrolls to: css/base.css; the spacer under the fixed top on upright phones:
// css/layout.css) and ui/log.js to bring text into view.
//   --top-h      how much the top covers: its height while it sticks (windows at least 560px tall), else 0 (it scrolls away).
//                On an upright phone the top is fixed (css/layout.css) and its picture is always the crop: then it is the
//                top's height, which is where the story starts, and where a new room's first line goes. (While you type that
//                top lets go and scrolls with the story, absolute instead of fixed, over the same spacer: still measured the
//                same way, so nothing moves.)
//   --bottom-h   the bottom's height
//   (Not the window's height: the page uses 100dvh. 0.28.1 measured innerHeight instead, to fix a new game's first screen on the
//   iPhone; it didn't (the cause was Safari ignoring a scroll back to the top: ui/follow.js, resync), and on an iPhone innerHeight
//   shrinks when the keyboard opens (714 to 406), so the page's height would change under the finger. Undone in 0.28.3.)
function followBars(root) {   // returns update(): measure now
  const html = root.documentElement, top = root.querySelector(".top"), bottom = root.querySelector(".bottom");
  const shown = {};   // what was last written (write only a change)
  function put(name, px) {
    const value = px + "px";
    if (shown[name] !== value) html.style.setProperty(name, shown[name] = value);
  }
  function update() {
    const position = topMode(top);   // (the CSS decides: no second copy of the breakpoints here)
    const height = position === "fixed" || position === "absolute" || position === "sticky"   // (absolute: the fixed top while you type)
      ? top.getBoundingClientRect().height : 0;
    put("--top-h", height);
    put("--bottom-h", bottom.getBoundingClientRect().height);
  }
  const watch = new ResizeObserver(update);   // (also when the game is shown: the page is not drawn while the list of games shows)
  watch.observe(top);
  watch.observe(bottom);
  window.addEventListener("resize", update);  // (the top can start or stop sticking without its size changing)
  root.fonts?.ready.then(update);
  // Safari settles its bars after the page has loaded, sometimes without telling: measure again once it has.
  window.addEventListener("load", () => { update(); setTimeout(update, 300); setTimeout(update, 1000); });
  update();
  return update;
}

// While you type on a phone, tell the layout: data-typing on <html> while the command line has focus on a touch screen (its
// keyboard is up then). The layout then pins nothing: the page is in its normal flow and the browser itself brings the command
// line up above its keyboard, as on any web form (css/layout.css). Nothing is measured: browsers on phones slide the keyboard
// over the page and report it differently or not at all (not inside the claude.ai frame), and following their numbers fought
// their own scrolling (Diego's iPhone, 28 Oct 2026).
function followTyping(root) {
  const html = root.documentElement, cmd = root.querySelector("#cmd");
  const update = () => html.toggleAttribute("data-typing", touch.matches && root.activeElement === cmd);
  cmd.addEventListener("focus", update);
  cmd.addEventListener("blur", update);
  update();
}

// The page's reaction to a hurt or a heal (INTERFACE.md §6c, "Reactions"): data-reaction="hurt" or "heal" on <html> for as long
// as its flash runs, and css/base.css does the rest (the whole page background takes a little of the hurt or healed colour and
// fades back; its colours and timings are css/tokens.css's; softer with reduce motion). A new one starts it afresh. The
// picture's own part is ui/scene.js's. Returns play(kind).
function flash(root) {
  const html = root.documentElement;
  html.addEventListener("animationend", (e) => {
    if (e.target === html && e.animationName.startsWith("reaction-")) html.removeAttribute("data-reaction");
  });
  return (kind) => {
    html.removeAttribute("data-reaction");
    void getComputedStyle(html).animationName;   // (the style as it is without it, so the same flash again starts from the top)
    html.dataset.reaction = kind;
  };
}

// While you sleep (INTERFACE.md §6c, "Sleep"; js/main.js, sleepThrough): data-asleep on <html>, and the compass, the inventory and the
// command line locked (inert) and greyed (their own CSS reads data-asleep, as it reads the end's `over`). Nothing can be typed or
// clicked: a tap, a click or any key only skips to waking (`skip`), once; the key's release and the click that follow are swallowed
// too, so they don't act after you wake (Esc, a release, restarts). Scrolling the story still works. Returns lock(on, skip).
function sleeper(root) {
  const html = root.documentElement, locked = [".compass", ".inventory", ".prompt"].map(s => root.querySelector(s));
  let on = false, skip = null, held = 0, done = null;
  const swallow = (e) => { e.preventDefault(); e.stopPropagation(); };
  const press = (e) => {
    if (e.type === "keydown" && e.repeat) return swallow(e);
    held++;
    swallow(e);
    if (on && skip) { const s = skip; skip = null; s(); }
  };
  const release = (e) => { swallow(e); held = Math.max(0, held - 1); if (!on && !held) { clearTimeout(done); done = setTimeout(finish, 50); } };   // (the click after it, too)
  const types = { keydown: press, pointerdown: press, keyup: release, pointerup: release, click: swallow, input: swallow, keypress: swallow };
  const listen = (add) => { for (const [t, f] of Object.entries(types)) (add ? window.addEventListener : window.removeEventListener).call(window, t, f, true); };
  function finish() { clearTimeout(done); listen(false); held = 0; }
  return (asleep, skipped) => {
    on = asleep;
    html.toggleAttribute("data-asleep", asleep);
    for (const el of locked) if (el) el.inert = asleep;
    if (asleep) { clearTimeout(done); skip = skipped; held = 0; listen(true); }
    else { skip = null; clearTimeout(done); if (!held) finish(); else done = setTimeout(finish, 800); }   // (a release still to come: wait for it, a moment)
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
  followTyping(root);
  const react = flash(root);
  const lock = sleeper(root);
  return {
    // While you sleep, and as you wake (see sleeper): asleep(true, skip), asleep(false).
    asleep: (on, skip) => lock(on, skip),
    // Show one view, "home" or "game", in a language: an open panel (map, options) closes with the game.
    show(view, lang) {
      root.querySelectorAll(":popover-open").forEach(p => p.hidePopover());
      if (root.documentElement.dataset.view !== view) window.scrollTo(0, 0);   // the two views are two pages: each starts at its top
      root.documentElement.dataset.view = view;
      root.documentElement.lang = lang;
      measure();   // the page was not drawn a moment ago: measure it now, not when the observer next reports (a restored game scrolls at once)
    },
    // On a language change: <html lang> (for screen readers and hyphenation). A hurt or a heal just played: its flash.
    update(prev, next, reason) {
      const kind = reactionOf(prev, next, reason);
      if (kind) react(kind);
      if (prev && prev.state.lang === next.state.lang) return;
      root.documentElement.lang = next.state.lang;
    }
  };
}
