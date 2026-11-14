// The picture's crop on upright phones (css/layout.css decides where, this file asks the CSS and does nothing elsewhere).
//
// On an upright phone the picture is always a tall crop of the middle of the scene (--picture-crop in tokens.css: columns 47 to 272
// of 320), so that the story keeps most of the screen. It never folds to the whole scene (it did until 10 Nov 2026: ui/fold.js,
// docs/pictures/PLAN.md §1). This file is what lets a finger look around the crop:
//
//   Drag     the picture can be dragged sideways to see what the crop hides (--pan, -1 ... 1: ui/scene.css works out the
//            offset). A new room's crop starts centred.
//
// One finger is the picture's (css/layout.css gives it `touch-action: pinch-zoom`): its up and down do nothing, so a
// slanted drag still drags; the page is scrolled from the story. Two fingers are the page's: they zoom it, and the second
// finger ends the drag (a pointercancel). The picture has no zoom of its own (it had, up to 3x, until 13 Nov 2026: two zooms
// were confusing). Letting a swipe up or down scroll the page (pan-y) was tried on 13 Nov 2026: Safari took any slanted
// drag for a scroll, and the crop was hard to move.
//
// Nothing here is drawn from the game's state: log.js, which knows when a room is entered, is given this and calls room().
// Mounted on the top (index.html).

import { topMode } from "./media.js?v=0.48.4";

const MOVE = 8;       // px a finger may move and still be still (not yet a drag)

export function mount(top) {
  const picture = top.querySelector(".picture"), canvas = picture.querySelector("canvas");
  let pan = 0;          // where the crop looks: -1 the scene's right edge ... 0 the middle ... 1 its left edge (ui/scene.css)

  // Is the picture the crop now? (Only an upright phone: the top is fixed there, or absolute while you type and it scrolls away
  // with the story: still the same picture, kept as it is. Not while the list of games shows: the page is not drawn then.)
  const active = () => ["fixed", "absolute"].includes(topMode(top)) && top.getClientRects().length > 0;

  function setPan(value) {
    pan = Math.max(-1, Math.min(1, value));
    picture.style.setProperty("--pan", pan.toFixed(4));
  }
  // Not an upright phone (any more): the crop centred, ready for when it is one again.
  function reset() {
    pan = 0;
    picture.style.removeProperty("--pan");
  }

  // A new room (log.js): the crop starts in the middle.
  function room() {
    if (!active()) return reset();
    setPan(0);
  }
  addEventListener("resize", () => { if (!active()) reset(); });

  // A finger on the picture. One that hardly moves does nothing; one that moves sideways is a DRAG and moves the crop (--pan).
  // How far the crop can go is the part it hides.
  const range = () => {
    const r = picture.getBoundingClientRect();
    return Math.max(0, (r.height * canvas.width / canvas.height - r.width) / 2);
  };

  let drag = null;   // { id, x, y, pan, moving }: the one finger dragging, or null
  picture.addEventListener("pointerdown", (e) => {
    if (e.button || !active()) return;
    if (drag) { drag = null; return; }   // a second finger: the page's pinch, not a drag
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, pan, moving: false };
  });
  picture.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moving && Math.hypot(dx, e.clientY - drag.y) <= MOVE) return;
    if (!drag.moving) { drag.moving = true; try { picture.setPointerCapture(e.pointerId); } catch {} }
    const r = range();
    if (r >= 1) setPan(drag.pan + dx / r);
  });
  const lift = (e) => { if (drag && e.pointerId === drag.id) drag = null; };
  picture.addEventListener("pointerup", lift);
  picture.addEventListener("pointercancel", lift);   // the browser took the finger: a scroll or a pinch of the page

  return { room };
}
