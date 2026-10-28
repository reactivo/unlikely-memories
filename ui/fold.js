// Folding picture (upright phones only: css/layout.css decides where, this file asks the CSS and does nothing elsewhere).
//
// On an upright phone the picture is a tall crop of the middle of the scene (the OPEN picture, --picture-crop in tokens.css), so
// that the story keeps most of the screen. Reading back, it FOLDS to the whole scene (the full 320×136 picture). Two states, never
// in between because of the finger: the picture is open or folded, and --p goes between 0 and 1 with a short animation (css/layout.css).
// The title bar above it (place, time) never changes.
//
//   Folds    after FOLD_AFTER pixels of the reader's scrolling, up or down, in one direction (a change of direction starts the count
//            again; Diego, 27 Oct 2026: down too, not only up), and stays folded until tapped; only if there is more
//            story than fits between the open picture and the prompt: with nothing more to read there is no reason to fold.
//   Opens    on a new room (log.js calls room()), and when you tap it. Never because you scrolled down (slow scrolling down is
//            what reading looks like, and an opening picture would cover the lines being read), nor at the end of the story,
//            nor for new text, nor at the top (Diego, 27 Oct 2026: only a room and a tap open it).
//   Tap      a tap on the picture (a finger that hardly moves and lifts soon) toggles it, open or folded, anywhere on it and
//            whatever the story's length (it's a deliberate choice; folded in a short room, a gap shows under it).
//   Drag     the open picture can be dragged sideways to see what the crop hides (--pan, -1 … 1: ui/scene.css works out the
//            offset). The drag is kept while the picture folds partway, and forgotten only when it opens from FULLY folded
//            (where the offset is nothing anyway, so nothing jumps). A new room's crop starts centred.
//   Pinch    two fingers zoom the open picture, up to MAX_ZOOM, around the point between them; zoomed, one finger moves it in
//            every direction, always covering the box. Folding or a new room puts it back to 1. (--zoom, --zoom-x, --zoom-y:
//            ui/scene.css.) One finger that hardly moves is a tap, one that moves is a drag, two are a pinch: they never mix.
//
// Unlike the other pieces, nothing here is drawn from the game's state: log.js, which knows when the story is at the present,
// is given this and calls it. Mounted on the top (index.html), given the log.

// The scrolling that folds the picture. Diego, 26 Oct 2026: 120 felt "more intentional" than 30 or 90, then 200; then 120 and 90 once it folded both ways (27 Oct).
const FOLD_AFTER = 90;    // px of scrolling in one direction, in a row, that fold the picture
const OWN_SCROLL = 1200;  // ms after which a scroll the game started is taken to be over, even if it never arrived (the user took over)
const TAP_MOVE = 8;       // px a finger may move and still be a tap
const TAP_TIME = 350;     // ms a finger may stay down and still be a tap
const MAX_ZOOM = 3;       // how far a pinch zooms the open picture

export function mount(top, log) {
  const picture = top.querySelector(".picture"), canvas = picture.querySelector("canvas");
  const bottom = top.closest(".layout").querySelector(".bottom");
  const html = document.documentElement;
  let folded = false;   // the state: folded (the whole scene) or open (the crop)
  let pan = 0;          // where the open crop looks: -1 the left edge … 0 the middle … 1 the right edge
  let intent = 0;       // how far you have scrolled in one direction, in a row (positive up, negative down)
  let lastY = scrollY;  // where the page was at the last scroll event
  let own = null;       // while the game scrolls the page itself (a room's glide, following new text): where to, so it is not counted
  let ownTimer = 0;

  // Does the CSS fold the picture now? (Only an upright phone: the top is fixed there, or absolute while the on-screen keyboard
  // is open and it scrolls away with the story: still the same picture, kept as it is. Not while the list of games shows: the
  // page is not drawn then, and there is no picture to fold.)
  const active = () => ["fixed", "absolute"].includes(getComputedStyle(top).position) && top.getClientRects().length > 0;

  // How tall the top is when open (ui/page.js measures it).
  const openH = () => parseFloat(getComputedStyle(html).getPropertyValue("--top-h")) || 0;

  function setPan(value) {
    pan = Math.max(-1, Math.min(1, value));
    picture.style.setProperty("--pan", pan.toFixed(4));
  }
  // The pinch zoom: how much bigger, and where the canvas has moved (px, from its own top left corner).
  let zoom = { z: 1, x: 0, y: 0 };
  function setZoom(z, x, y) {
    zoom = { z, x, y };
    if (z === 1 && x === 0 && y === 0) {
      ["--zoom", "--zoom-x", "--zoom-y"].forEach(v => picture.style.removeProperty(v));
      return;
    }
    picture.style.setProperty("--zoom", z.toFixed(4));
    picture.style.setProperty("--zoom-x", x.toFixed(1) + "px");
    picture.style.setProperty("--zoom-y", y.toFixed(1) + "px");
  }
  const unzoom = () => setZoom(1, 0, 0);
  const show = () => {
    if (folded) unzoom();
    top.style.setProperty("--p", folded ? 1 : 0);
    top.toggleAttribute("data-folded", folded);   // CSS: how a finger on the picture behaves in each state
  };
  // Not an upright phone (any more): back to an open picture, the crop centred, ready for when it is one again.
  function reset() {
    folded = false; intent = 0; pan = 0;
    top.style.removeProperty("--p");
    top.removeAttribute("data-folded");
    picture.style.removeProperty("--pan");
    unzoom();
  }

  // Is the picture folded all the way? (--p is animated, so ask for its value now.)
  const wholly = () => folded && (parseFloat(getComputedStyle(top).getPropertyValue("--p")) || 0) > 0.99;

  // Open the picture (a tap). Folded all the way, the drag is forgotten (nothing moves: the offset is nothing there); folded
  // only partway, the drag stays.
  function open() {
    if (!active()) return reset();
    intent = 0;
    if (wholly()) setPan(0);
    folded = false;
    show();
  }

  // A new room (log.js): open, and the crop starts in the middle.
  function room() {
    if (!active()) return reset();
    intent = 0;
    setPan(0);
    folded = false;
    show();
  }

  // The game is scrolling the page itself, to y: that scrolling is not the reader's, so it does not count towards folding.
  // (Call it after window.scrollTo: an instant scroll has arrived by then and there is nothing to wait for.)
  function scrolling(y) {
    const to = Math.min(Math.max(y, 0), html.scrollHeight - innerHeight);
    clearTimeout(ownTimer);
    lastY = scrollY;
    own = Math.abs(scrollY - to) < 2 ? null : to;
    if (own !== null) ownTimer = setTimeout(() => { own = null; lastY = scrollY; }, OWN_SCROLL);
  }

  // Is there more story than fits between the open picture and the prompt?
  function storyOverflows() {
    const first = log.firstElementChild?.firstElementChild, last = log.lastElementChild?.lastElementChild;
    if (!first || !last) return false;
    const story = last.getBoundingClientRect().bottom - first.getBoundingClientRect().top;
    return story > bottom.getBoundingClientRect().top - (top.getBoundingClientRect().top + openH());
  }

  function onScroll() {
    const max = html.scrollHeight - innerHeight;
    const y = Math.min(Math.max(scrollY, 0), max);   // (not the bounce at either end, on phones)
    const d = lastY - y;                             // positive when scrolling up
    lastY = y;
    if (!active()) return;
    if (html.hasAttribute("data-keyboard")) return;  // typing (ui/page.js): the browser's and the game's scrolling, not the reader's
    if (own !== null) {                              // the game's own scrolling: not counted
      if (Math.abs(y - own) < 2) { own = null; clearTimeout(ownTimer); }
      return;
    }
    if (d && Math.sign(d) !== Math.sign(intent)) intent = 0;   // a change of direction starts the count again
    intent += d;
    if (!folded && Math.abs(intent) > FOLD_AFTER && storyOverflows()) { folded = true; intent = 0; show(); }
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { if (!active()) reset(); });

  // Fingers on the picture. One that hardly moves and lifts soon is a TAP (toggles open / folded). One that moves is a DRAG:
  // unzoomed, it moves the crop sideways (--pan); zoomed, it moves the zoomed picture in every direction. Two are a PINCH.
  // How far the crop can go is the part it hides, so it shrinks to nothing as the picture folds (then there is nothing to drag).
  const range = () => {
    const r = picture.getBoundingClientRect();
    return Math.max(0, (r.height * canvas.width / canvas.height - r.width) / 2);
  };
  // Keep the zoomed canvas covering the box: its position at zoom 1 is the crop's (the canvas's own left), so the move is
  // limited to what the zoom adds on each side.
  function clampZoom(z, x, y) {
    const box = picture.getBoundingClientRect(), c = canvas.getBoundingClientRect();
    const left = c.left - box.left - zoom.x, w = c.width / zoom.z, h = c.height / zoom.z;   // the canvas at zoom 1
    x = Math.min(-left, Math.max(box.width - left - z * w, x));
    y = Math.min(0, Math.max(box.height - z * h, y));
    return [x, y];
  }

  const fingers = new Map();   // pointerId → { x, y }
  let gesture = null;          // { kind: "tap" | "drag" | "pinch", … }
  picture.addEventListener("pointerdown", (e) => {
    if (e.button || !active()) return;
    picture.setPointerCapture(e.pointerId);
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (fingers.size === 1) {
      gesture = { kind: "tap", x: e.clientX, y: e.clientY, at: performance.now(), pan, zoom: { ...zoom } };
    } else if (fingers.size === 2 && !folded) {
      const [a, b] = [...fingers.values()];
      const box = picture.getBoundingClientRect();
      gesture = { kind: "pinch", d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2 - box.left,
                  my: (a.y + b.y) / 2 - box.top, zoom: { ...zoom } };
    }
  });
  picture.addEventListener("pointermove", (e) => {
    if (!fingers.has(e.pointerId) || !gesture) return;
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (gesture.kind === "pinch") {
      if (fingers.size < 2) return;
      const [a, b] = [...fingers.values()];
      const box = picture.getBoundingClientRect();
      const g = gesture, z = Math.min(MAX_ZOOM, Math.max(1, g.zoom.z * Math.hypot(a.x - b.x, a.y - b.y) / g.d));
      const mx = (a.x + b.x) / 2 - box.left, my = (a.y + b.y) / 2 - box.top;
      // The point that was between the fingers stays between them (the canvas's own top left is the transform's origin).
      const c = canvas.getBoundingClientRect(), left = c.left - box.left - zoom.x;
      const qx = (g.mx - left - g.zoom.x) / g.zoom.z, qy = (g.my - g.zoom.y) / g.zoom.z;
      const [x, y] = clampZoom(z, mx - left - z * qx, my - z * qy);
      if (z <= 1.01) unzoom(); else setZoom(z, x, y);
      return;
    }
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    if (gesture.kind === "tap" && Math.hypot(dx, dy) > TAP_MOVE) gesture.kind = folded ? "none" : "drag";
    if (gesture.kind !== "drag") return;
    if (gesture.zoom.z > 1) {
      const [x, y] = clampZoom(gesture.zoom.z, gesture.zoom.x + dx, gesture.zoom.y + dy);
      setZoom(gesture.zoom.z, x, y);
    } else {
      const r = range();
      if (r >= 1) setPan(gesture.pan + dx / r);
    }
  });
  function lift(e, cancelled) {
    if (!fingers.delete(e.pointerId)) return;
    const g = gesture;
    if (g && g.kind === "tap" && !cancelled && fingers.size === 0 && performance.now() - g.at < TAP_TIME) toggle();
    if (fingers.size === 0) gesture = null;
    else if (g && g.kind === "pinch") gesture = { kind: "none" };   // one finger left after a pinch: nothing until both lift
  }
  picture.addEventListener("pointerup", (e) => lift(e, false));
  picture.addEventListener("pointercancel", (e) => lift(e, true));   // the browser took the finger over (scrolling): no tap
  // Safari's own pinch gestures: not on the picture (the page would zoom instead of it).
  picture.addEventListener("gesturestart", (e) => e.preventDefault());

  // A tap: open ↔ folded, whatever the story's length (a deliberate choice).
  function toggle() {
    if (folded) return open();
    folded = true;
    intent = 0;
    show();
  }

  return { open, room, scrolling };
}
