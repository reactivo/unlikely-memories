// The picture's crop on upright phones (css/layout.css decides where, this file asks the CSS and does nothing elsewhere).
//
// On an upright phone the picture is always a tall crop of the middle of the scene (--picture-crop in tokens.css: columns 47 to 272
// of 320), so that the story keeps most of the screen. It never folds to the whole scene (it did until 10 Nov 2026: ui/fold.js,
// docs/pictures/PLAN.md §1). This file is what lets a finger look around the crop:
//
//   Drag     the picture can be dragged sideways to see what the crop hides (--pan, -1 ... 1: ui/scene.css works out the
//            offset). A new room's crop starts centred.
//   Pinch    two fingers zoom the picture, up to MAX_ZOOM, around the point between them; zoomed, one finger moves it in
//            every direction, always covering the box. A new room puts it back to 1. (--zoom, --zoom-x, --zoom-y:
//            ui/scene.css.) One finger that hardly moves does nothing, one that moves is a drag, two are a pinch: they never mix.
//
// Nothing here is drawn from the game's state: log.js, which knows when a room is entered, is given this and calls room().
// Mounted on the top (index.html).

import { topMode } from "./media.js";

const MOVE = 8;       // px a finger may move and still be still (not yet a drag)
const MAX_ZOOM = 3;   // how far a pinch zooms the picture

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
  // Not an upright phone (any more): the crop centred and unzoomed, ready for when it is one again.
  function reset() {
    pan = 0;
    picture.style.removeProperty("--pan");
    unzoom();
  }

  // A new room (log.js): the crop starts in the middle, unzoomed.
  function room() {
    if (!active()) return reset();
    setPan(0);
    unzoom();
  }
  addEventListener("resize", () => { if (!active()) reset(); });

  // Fingers on the picture. One that hardly moves does nothing. One that moves is a DRAG: unzoomed, it moves the crop sideways
  // (--pan); zoomed, it moves the zoomed picture in every direction. Two are a PINCH. How far the crop can go is the part it hides.
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
  let gesture = null;          // { kind: "still" | "drag" | "pinch" | "none", … }
  picture.addEventListener("pointerdown", (e) => {
    if (e.button || !active()) return;
    picture.setPointerCapture(e.pointerId);
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (fingers.size === 1) {
      gesture = { kind: "still", x: e.clientX, y: e.clientY, pan, zoom: { ...zoom } };
    } else if (fingers.size === 2) {
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
    if (gesture.kind === "still" && Math.hypot(dx, dy) > MOVE) gesture.kind = "drag";
    if (gesture.kind !== "drag") return;
    if (gesture.zoom.z > 1) {
      const [x, y] = clampZoom(gesture.zoom.z, gesture.zoom.x + dx, gesture.zoom.y + dy);
      setZoom(gesture.zoom.z, x, y);
    } else {
      const r = range();
      if (r >= 1) setPan(gesture.pan + dx / r);
    }
  });
  function lift(e) {
    if (!fingers.delete(e.pointerId)) return;
    const g = gesture;
    if (fingers.size === 0) gesture = null;
    else if (g && g.kind === "pinch") gesture = { kind: "none" };   // one finger left after a pinch: nothing until both lift
  }
  picture.addEventListener("pointerup", (e) => lift(e));
  picture.addEventListener("pointercancel", (e) => lift(e));   // the browser took the finger over
  // Safari's own pinch gestures: not on the picture (the page would zoom instead of it).
  picture.addEventListener("gesturestart", (e) => e.preventDefault());

  return { room };
}
