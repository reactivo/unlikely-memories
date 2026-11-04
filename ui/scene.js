// Scene picture: draws the room's picture in a 320×136 canvas from its drawing list (ui/draw.js), with small
// objects as overlays, palette cycling (water, lamps, lights) and a transition when the picture changes. When the story
// has ended it shows the ending's own picture instead, reached by a transition from the room's (ui/transitions.js).
// Transitions: ui/transitions.js. Palette cycles: ui/effects.js and content/art.js. Purely visual: never changes the game.
// The canvas is the picture's own 320×136 pixels; CSS stretches it to the column's whole width with hard edges
// (ui/scene.css), at every window size, so the browser does all the scaling. On an upright phone the picture's box is
// taller than the scene (a crop of its middle, that folds to the whole scene when you read back: ui/fold.js): the canvas
// is then wider than the box and CSS centres it, so nothing here changes.

import art from "../content/art.js";
import { paintPicture, compose, overlaysShown, overlayAlt, RGB } from "./draw.js";
import { CYCLES, FILTERS, MOVING, reactionOf, sleepPicture, afterimageOf, darkField } from "./effects.js";
import { parseFilter, inOrder, COUNTS } from "../js/filters.js";
import { transition, ROOM, ENDING } from "./transitions.js";
import { text } from "../js/narrator.js";                  // "@key" → the pack's text, dotted keys too, as the story says it

const W = art.picture.width, H = art.picture.height;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
// The game's own reduce motion: the system's setting, unless <html data-motion> says "reduce" or "full" (the debug panel's
// setting, ui/debug.js; nothing else sets it).
const calm = () => {
  const forced = document.documentElement.dataset.motion;
  return forced ? forced === "reduce" : art.effects.respectReducedMotion && reducedMotion.matches;
};

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
  let filters = [];              // the picture filters on (state.filters: js/filters.js), in the order they are drawn
  const since = new Map();       // when each filter on came on (its moving forms run from then)
  let moment = null;             // the moment now playing, once (a shake, a wave): { name, o: its tunables, at: when it began }
  let run = null;                // a sleep playing (sleep(), below): the lids, the dark, and where it has got to
  let field = null;              // the dark's own numbers, worked out the first time (ui/effects.js, darkField)

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
    let out = frame.slice();
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
    // The picture filters, in their order (content/art.js), on the picture's own pixels; a tint swaps the colours.
    let pic = { px: out, w: W, h: H, rgb: RGB };
    for (const f of inOrder(moment ? [...filters, moment.name] : filters)) {
      const { name, param } = parseFilter(f), own = f === moment?.name;
      if (FILTERS[name]) pic = FILTERS[name](pic, own ? moment.o : art.effects.filters[name], now - (own ? moment.at : since.get(f) ?? now), calm(), param);
    }
    if (moment && (calm() || now - moment.at >= moment.o.ms)) moment = null;   // the moment is over (this frame shows it still)
    if (run) {                                                   // asleep: the lids and the dark, over everything (ui/effects.js)
      if (!run.after && !run.visionPx && run.fade == null) run.after = afterimageOf(pic, run.o);   // (the room as the eyes close)
      pic = sleepPicture(pic, run, now, run.o);
    }
    out = pic.px;
    for (let k = 0; k < out.length; k++) {
      const [r, g, b] = pic.rgb[out[k]];
      image.data[k * 4] = r; image.data[k * 4 + 1] = g; image.data[k * 4 + 2] = b; image.data[k * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }

  // Keep animating while a transition runs or cycles are moving (not while the tab is hidden: the browser
  // pauses animation frames by itself).
  function tick(now) {
    if (run) advance(now);                                       // (it may end the sleep, and draw the picture woken to)
    const steps = stepsAt(now);
    const moving = moment !== null || run !== null || (filters.some(f => MOVING.has(parseFilter(f).name)) && !calm());
    if (change || steps.join() !== lastSteps || moving) render(now, steps);   // nothing moved: leave the canvas as it is
    loop = (change || moving || (cycles.length && !calm())) ? requestAnimationFrame(tick) : 0;
  }
  const animate = () => { if (!loop) loop = requestAnimationFrame(tick); };
  const motionChanged = () => { if (frame) { render(performance.now()); animate(); } };
  reducedMotion.addEventListener("change", motionChanged);
  new MutationObserver(motionChanged).observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });   // (see calm)

  // ---- Sleep (INTERFACE.md §6c, "Sleep"; drawn by ui/effects.js, sleepPicture; its tunables: content/art.js, effects.sleep) ----
  // Three phases: the lids close (their steps, eased; with reduce motion a plain fade to black), the dark (at least its own length,
  // and until the dream or the vision has been told: the controller's `dark()` tells it and says how long that takes), and the lids
  // open (`open()` first: the controller puts the picture woken to under them). Then `done()`. A sleep you don't wake from ends
  // in the dark, which stays as the picture until the ending's comes in. `skip()` goes straight to the end.
  function advance(now) {
    const o = run.o, eased = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
    const along = (steps, from) => {                             // where the lids are along their steps, and whether they are done
      let t = now - run.t0, at = from;
      for (const [to, ms] of steps) { if (t < ms) return { lid: at + (to - at) * eased(t / ms), over: false }; t -= ms; at = to; }
      return { lid: at, over: true };
    };
    if (run.phase === "close") {
      const r = run.fade != null ? { lid: 1, fade: Math.min(1, (now - run.t0) / o.calm.fade) } : along(run.plan.close, 0);
      run.lid = r.lid; if (r.fade != null) run.fade = r.fade;
      if (r.over || run.fade === 1) darkens(now);
    }
    if (run?.phase === "dark") {
      const t = now - run.darkAt, left = run.darkEnd - now, ramp = (x, ms) => Math.max(0, Math.min(1, x / ms));
      run.glow = Math.min(ramp(t, o.glowIn), ramp(left, o.glowOut));
      run.vision = run.fade != null ? 1 : Math.min(ramp(t - o.glowIn, o.vision.fadeIn), ramp(left - o.glowOut, o.vision.fadeOut));
      if (now >= run.darkEnd) {
        if (!run.wake) return finish(false);
        run.phase = "open"; run.t0 = now; run.glow = 0; run.vision = 0;
        run.open?.();
      }
    }
    if (run?.phase === "open") {
      const r = run.fade != null ? { lid: 1, fade: Math.max(0, 1 - (now - run.t0) / o.calm.fade) } : along(run.plan.open, 1);
      run.lid = r.lid; if (r.fade != null) run.fade = r.fade;
      if (run.fade != null ? run.fade === 0 : r.over) finish(true);
    }
  }
  // The lids are shut: the dark begins, and the controller tells what is said in it (`dark()`: how long until it has been told).
  function darkens(now) {
    const o = run.o, told = run.dark?.() ?? 0, fades = run.visionPx ? o.vision.fadeIn + o.vision.fadeOut : 0;
    Object.assign(run, { phase: "dark", lid: 1, darkAt: now,
      darkEnd: now + Math.max(run.plan.dark, told + o.afterText, o.glowIn + o.glowOut + fades) });
  }
  // The end of a sleep: woken, the lids gone; or not (a death), the dark kept as the picture, for the ending's to come in over.
  function finish(woke) {
    const { done } = run;
    if (!woke) { frame = new Uint8Array(W * H).fill(run.o.colors.dark); cycles = []; }
    run = null;
    render(performance.now());
    done?.();
  }

  return {
    // A sleep, played on the picture: { kind: "nap" | "few" | "morning" (js/sleep.js), vision: { id, picture } (a world's picture,
    // shown in the dark) or null, wake: false when you don't wake, dark(), open(), done() }: see advance(). Returns { skip(), cancel() }.
    // Never on a restore (the controller only plays a moment just played).
    sleep({ kind, vision = null, wake = true, dark, open, done }) {
      const o = art.effects.sleep;
      field ??= darkField(W, H, o);
      run = { o, plan: o[kind] || o.nap, wake, dark, open, done, phase: "close", t0: performance.now(), lid: 0, fade: calm() ? 0 : null,
              glow: 0, darkAt: null, darkEnd: null, vision: 0, visionPx: vision ? base("vision:" + vision.id, vision.picture).px : null,
              after: null, field };
      const mine = run;
      animate();
      return {
        skip() {                                                 // a tap, a click or a key: straight to waking (or to the end)
          if (run !== mine) return;
          if (run.phase === "close") run.dark?.();
          if (run.wake && run.phase !== "open") run.open?.();
          finish(run.wake);
        },
        cancel() { if (run === mine) { run = null; render(performance.now()); } }   // the game is left: no more of it, nothing told
      };
    },
    // Redraw when the room, its picture version or the overlays shown change; once the story has ended, when it
    // changes to the ending's own picture (a state with no such picture keeps the room's). A restore (new game,
    // undo, a loaded game) switches at once; the ending and a room each use their own named transition
    // of ui/transitions.js. With reduced motion every change is a cut.
    update(prev, next, reason) {
      const s = next.state, roomId = s.player.at, room = s.world.rooms[roomId];
      const end = s.ended && s.ending && s.pictures?.[s.ending] ? s.pictures[s.ending] : null;   // the ending's picture, once it's over
      const picture = end ? end.picture : room.picture, where = end ? "ending:" + s.ending : roomId;
      const shown = overlaysShown(picture, s, roomId);
      // The description for screen readers: the room's or the ending's, plus a line for each overlay drawn (the room's `overlayAlt`).
      canvas.setAttribute("aria-label", [end ? end.alt : room.alt, ...shown.map(o => overlayAlt(room, o))].filter(Boolean).map(t => text(t, next.pack)).join(" "));
      // The picture filters on (none on an ending's picture: it is a shot of its own), and a new moment to play (below).
      const on = end ? [] : inOrder((s.filters || []).filter(f => FILTERS[parseFilter(f).name]));
      const key = where + "#" + picture.version + "|" + shown.map(o => o.object).join(",") + "|" + on.join(",");
      const played = playing(prev, next, reason, !!end);
      if (played) moment = played;
      if (key === drawnKey) return moment ? animate() : undefined;
      for (const f of [...since.keys()]) if (!on.includes(f)) since.delete(f);
      for (const f of on) if (!since.has(f)) since.set(f, performance.now());
      filters = on;
      const { px, areas } = base(where, picture);
      const old = frame;
      frame = compose(px, picture, s, roomId, W, H);
      const t = transition(end ? ENDING : ROOM);
      if (old && reason !== "restore" && !calm() && t.ms > 0) {
        from = change ? from : old;
        // (A death's jolt plays on the room's picture first; the ending's picture comes in after it.)
        change = { ...t, start: performance.now() + (end && played ? played.o.ms : 0) };
      } else { change = null; from = null; }
      if (drawnKey === null || !drawnKey.startsWith(where + "#" + picture.version + "|")) cycles = prepare(picture, areas);
      drawnKey = key;
      render(performance.now());
      animate();
    }
  };
}

// The moment a redraw starts, or null: the reaction to a hurt or a heal (ui/effects.js, reactionOf), with its own tunables
// (content/art.js, effects.reactions), even as the story ends (a death's jolt); else a world's own shake or wave
// (state.shakes, state.waves: js/filters.js), but not on an ending's picture. One at a time: a reaction wins, then the
// first in COUNTS's order. None on a restore (undo, load: a moment already seen) nor with reduced motion.
function playing(prev, next, reason, ending) {
  if (reason === "restore" || calm()) return null;
  const r = reactionOf(prev, next, reason);
  if (r) {
    const { filter, ...own } = art.effects.reactions[r];
    return { name: filter, o: { ...art.effects.filters[filter], ...own }, at: performance.now() };
  }
  if (ending) return null;
  const name = Object.keys(COUNTS).find(m => (next.state[COUNTS[m]] ?? 0) > (prev?.state?.[COUNTS[m]] ?? 0));
  return name ? { name, o: art.effects.filters[name], at: performance.now() } : null;
}

// The pixels of a rectangle area [x, y, width, height].
function rectPixels([x0, y0, w, h]) {
  const out = [];
  for (let y = Math.max(0, y0); y < Math.min(H, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) out.push(y * W + x);
  return out;
}

