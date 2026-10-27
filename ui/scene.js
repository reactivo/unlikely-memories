// Scene picture: draws the room's picture in a 320×136 canvas from its drawing list (ui/draw.js), with small
// objects as overlays, palette cycling (water, lamps, lights) and a transition when the picture changes. When the story
// has ended it shows the ending's own picture instead, reached by a transition from the room's (ui/transitions.js).
// Transitions: ui/transitions.js. Palette cycles: ui/effects.js and content/art.js. Purely visual: never changes the game.
// The canvas is the picture's own 320×136 pixels; CSS stretches it to the column's whole width with hard edges
// (ui/scene.css), at every window size, so the browser does all the scaling. On an upright phone the picture's box is
// taller than the scene (a crop of its middle, that folds to the whole scene when you read back: ui/fold.js): the canvas
// is then wider than the box and CSS centres it, so nothing here changes.

import art from "../content/art.js";
import { paintPicture, compose, overlaysShown, overlayAlt } from "./draw.js";
import { CYCLES } from "./effects.js";
import { transition, ROOM, ENDING } from "./transitions.js";

const W = art.picture.width, H = art.picture.height;
const RGB = art.palette.colors.map(hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)));
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Set up the picture on its element (.picture). Returns update().
export function mount(root) {
  const canvas = root.querySelector("canvas");
  canvas.width = W; canvas.height = H;                           // the picture's own pixels (the markup says so too)
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(W, H);                      // the canvas is the picture at its own 320×136
  const painted = new Map();     // painted pictures, by room + version (painting is the slow part)
  let frame = null;              // the picture now (palette numbers), without cycling
  let from = null;               // the picture being changed from, during a transition
  let change = null;             // the running transition: { shows, start, ms }
  let cycles = [];               // the picture's palette cycles, ready to run
  let drawnKey = null;           // what's drawn: room, version and overlays
  let loop = 0;                  // the animation frame request, while something moves
  let lastSteps = "";            // the cycles' steps last drawn (redraw only when one moves)

  const calm = () => art.effects.respectReducedMotion && reducedMotion.matches;

  // Paint (or reuse) a room's picture.
  function base(roomId, picture) {
    const key = roomId + "#" + picture.version;
    if (!painted.has(key)) painted.set(key, paintPicture(picture.draw, W, H));
    return painted.get(key);
  }

  // Prepare the picture's cycles: for each, the pixels it moves and where each starts in its colour list.
  function prepare(picture, areas) {
    const now = performance.now();
    return (picture.cycles || []).map(c => {
      const pixels = [], start = [];
      for (const a of c.areas) {
        const list = typeof a === "string" ? (areas[a] || []) : rectPixels(a);
        for (const k of list) { const i = c.colors.indexOf(frame[k]); if (i >= 0) { pixels.push(k); start.push(i); } }
      }
      return { c, pixels, start, mem: {}, t0: now };
    });
  }

  // Where each cycle is in its colour list now (all at the start with reduced motion).
  const stepsAt = (now) => cycles.map(cy => calm() || !CYCLES[cy.c.style] ? 0 : CYCLES[cy.c.style](cy.c, cy.mem, now - cy.t0, now));

  // Draw one frame: the picture (mid-transition if one is running), with the cycles' colours at these steps.
  function render(now, steps = stepsAt(now)) {
    const out = frame.slice();
    if (change) {
      const p = Math.min(1, (now - change.start) / change.ms);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!change.shows(x, y, p, H)) out[y * W + x] = from[y * W + x];
      if (p >= 1) { change = null; from = null; }
    }
    cycles.forEach((cy, j) => {
      const step = steps[j], n = cy.c.colors.length;
      if (step) cy.pixels.forEach((k, i) => { if (out[k] === cy.c.colors[cy.start[i]]) out[k] = cy.c.colors[(cy.start[i] + step) % n]; });
    });
    lastSteps = steps.join();
    for (let k = 0; k < out.length; k++) {
      const [r, g, b] = RGB[out[k]];
      image.data[k * 4] = r; image.data[k * 4 + 1] = g; image.data[k * 4 + 2] = b; image.data[k * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }

  // Keep animating while a transition runs or cycles are moving (not while the tab is hidden: the browser
  // pauses animation frames by itself).
  function tick(now) {
    const steps = stepsAt(now);
    if (change || steps.join() !== lastSteps) render(now, steps);   // nothing moved: leave the canvas as it is
    loop = (change || (cycles.length && !calm())) ? requestAnimationFrame(tick) : 0;
  }
  const animate = () => { if (!loop) loop = requestAnimationFrame(tick); };
  reducedMotion.addEventListener("change", () => { if (frame) { render(performance.now()); animate(); } });

  return {
    // Redraw when the room, its picture version or the overlays shown change; once the story has ended, when it
    // changes to the ending's own picture (a state with no such picture keeps the room's). A restore (new game,
    // language change, undo, a loaded game) switches at once; the ending and a room each use their own named transition
    // of ui/transitions.js. With reduced motion every change is a cut.
    update(prev, next, reason) {
      const s = next.state, roomId = s.player.at, room = s.world.rooms[roomId];
      const end = s.ended && s.ending && s.pictures?.[s.ending] ? s.pictures[s.ending] : null;   // the ending's picture, once it's over
      const picture = end ? end.picture : room.picture, where = end ? "ending:" + s.ending : roomId;
      const shown = overlaysShown(picture, s, roomId);
      // The description for screen readers: the room's or the ending's, plus a line for each overlay drawn (the room's `overlayAlt`).
      canvas.setAttribute("aria-label", [end ? end.alt : room.alt, ...shown.map(o => overlayAlt(room, o))].filter(Boolean).map(t => text(t, next.pack)).join(" "));
      const key = where + "#" + picture.version + "|" + shown.map(o => o.object).join(",");
      if (key === drawnKey) return;
      const { px, areas } = base(where, picture);
      const old = frame;
      frame = compose(px, picture, s, roomId, W, H);
      const t = transition(end ? ENDING : ROOM);
      if (old && reason !== "restore" && !calm() && t.ms > 0) {
        from = change ? from : old;
        change = { ...t, start: performance.now() };
      } else { change = null; from = null; }
      if (drawnKey === null || !drawnKey.startsWith(where + "#" + picture.version + "|")) cycles = prepare(picture, areas);
      drawnKey = key;
      render(performance.now());
      animate();
    }
  };
}

// The pixels of a rectangle area [x, y, width, height].
function rectPixels([x0, y0, w, h]) {
  const out = [];
  for (let y = Math.max(0, y0); y < Math.min(H, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) out.push(y * W + x);
  return out;
}

// "@key" → the pack's text (the picture's descriptions live in the room texts).
const text = (t, pack) => (typeof t === "string" && t.startsWith("@") ? pack[t.slice(1)] ?? "" : t);
