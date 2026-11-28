// Scene picture: draws the room's picture in a 320×136 canvas from its drawing list (ui/draw.js), with small
// objects as overlays, palette cycling (water, lamps, lights) and a transition when the picture changes. When the story
// has ended it shows the ending's own picture instead, reached by a transition from the room's (ui/transitions.js).
// Transitions: ui/transitions.js. Palette cycles: ui/effects.js and content/art.js. Purely visual: never changes the game.
// The canvas is the picture's own 320×136 pixels; CSS stretches it to the column's whole width with hard edges
// (ui/scene.css), at every window size, so the browser does all the scaling. On an upright phone the picture's box is
// taller than the scene (a crop of its middle: ui/crop.js): the canvas
// is then wider than the box and CSS centres it, so nothing here changes. The CRT look (ui/crt.js) is drawn from the finished pixels, after
// each putImageData: this canvas stays the picture, the screen reader's label and the crop's measure; a second canvas shows it.

import art from "../content/art.js?v=0.77.1";
import { paintPicture, pictureKey, compose, covered, overlaysShown, overlayAlt, putPixels, compileLoop, underMask, RGB } from "./draw.js?v=0.77.1";
import { FILTERS, MOVING, reactionOf, prepareCycles, motionInto, stepsOf } from "./effects.js?v=0.77.1";
import { mount as mountSleep } from "./sleep.js?v=0.77.1";
import { parseFilter, inOrder, COUNTS } from "../js/filters.js?v=0.77.1";
import { roomDraw, openKey, thingsOf, awayFrom } from "../js/picture.js?v=0.77.1";   // what a room's picture paints now: its things that open shown as they are, a thing's shapes only while it is in the room (js/picture.js)
import { transition, ROOM, ENDING } from "./transitions.js?v=0.77.1";
import { text } from "../js/narrator.js?v=0.77.1";                  // "@key" → the pack's text, dotted keys too, as the story says it
import { reducedMotion, calm } from "./media.js?v=0.77.1";
import { screen } from "./crt.js?v=0.77.1";                      // the CRT look, drawn over the finished picture (ui/crt.js)
import { reflection } from "./reflection.js?v=0.77.1";            // the light beside the picture, on wide windows (ui/reflection.js)

const W = art.picture.width, H = art.picture.height;

// Set up the picture on its element (.picture). Returns update().
export function mount(root) {
  const canvas = root.querySelector("canvas");
  canvas.width = W; canvas.height = H;                           // the picture's own pixels (the markup says so too)
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(W, H);                      // the canvas is the picture at its own 320×136
  const shine = reflection(root);                          // the reflection beside the picture: drawn from `image` as well, wide windows only (ui/reflection.js)
  const look = screen(canvas, { w: W, h: H });             // the CRT look: a WebGL canvas after this one, drawn from `image` (ui/crt.js)
  const painted = new Map();     // painted pictures, by world + room + version (painting is the slow part); only valid within one game: see forget()
  let frame = null;              // the picture now (palette numbers), without cycling
  let from = null;               // the picture being changed from, during a transition
  let change = null;             // the running transition: { shows, start, ms }
  let cycles = [];               // the picture's cycles (palette cycles and scrolls), ready to run
  let loops = [];                // the picture's loops (small animated sprites), ready to run
  const layer = { src: null, covered: null };   // what a scroll needs: the picture as painted (no overlays) and the pixels overlays cover
  let drawnKey = null;           // what's drawn: room, version and overlays
  let loop = 0;                  // the animation frame request, while something moves
  let lastSteps = "";            // the cycles' steps last drawn (redraw only when one moves)
  let filters = [];              // the picture filters on (state.filters: js/filters.js), in the order they are drawn
  const since = new Map();       // when each filter on came on (its moving forms run from then)
  let moment = null;             // the moment now playing, once (a shake, a wave): { name, o: its tunables, at: when it began }

  // Paint (or reuse) a room's picture as its things are now (roomDraw: a thing that opens drawn open or shut, a thing's shapes only while it is in the
  // room; `s`, the game, and `roomId`; none for an ending's picture). `key` is its own: the picture's, with the things drawn open and those away.
  function paintedAs(key, picture, s, roomId) {
    if (!painted.has(key)) painted.set(key, paintPicture(s ? roomDraw(s, roomId, picture.draw) : picture.draw, W, H));
    return painted.get(key);
  }
  // (A vision's picture, for the sleep: ui/sleep.js; it has no things that open.)
  function base(worldId, where, picture) { return paintedAs(pictureKey(worldId, where, picture.version), picture, null); }

  // Forget everything drawn of a game, to draw afresh. A picture is kept by its world's id, room id and version, so a room of
  // one world never shows another's (two worlds may share a room id: both "corridor", version 1); and within one game
  // a version can still be another edit's after UNDO or a load. So whenever the
  // game is replaced (a restore: a new game, UNDO, a loaded game, and the first draw of a view) nothing drawn before is kept.
  function forget() {
    painted.clear();
    drawnKey = null; frame = null; from = null; change = null; cycles = []; loops = []; lastSteps = ""; moment = null;
    since.clear(); filters = [];
  }

  // Prepare the picture's cycles (ui/effects.js, prepareCycles: the pixels each moves, where each starts, a scroll's plan); and its loops:
  // their frames as palette numbers.
  function prepare(picture, areas) {
    const now = performance.now();
    cycles = prepareCycles(picture.cycles, frame, areas, W, H, now);
    loops = (picture.loops || []).map(l => ({ l, sprite: compileLoop(l), mem: { tick: 0, frame: 0 }, t0: now, hide: underMask(l, areas, W, H) }));
  }

  const stepsAt = (now) => stepsOf(cycles, loops, now, calm());

  // Draw one frame: the picture (mid-transition if one is running), with the cycles' colours at these steps.
  function render(now, steps = stepsAt(now)) {
    let out = frame.slice();
    if (change) {
      const p = Math.min(1, (now - change.start) / change.ms);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!change.shows(x, y, p, H)) out[y * W + x] = from[y * W + x];
      if (p >= 1) { change = null; from = null; }
    }
    // Scrolls first (they move the painted pixels), then the loops over them, then the palette cycles, then the filters. With reduced
    // motion none of it moves: no cycle is applied, a loop shows its first frame (a travelling one is not drawn).
    motionInto(out, cycles, loops, steps, layer, calm(), W, H);
    lastSteps = steps.join();
    // The picture filters, in their order (content/art.js), on the picture's own pixels; a tint swaps the colours.
    let pic = { px: out, w: W, h: H, rgb: RGB };
    for (const f of inOrder(moment ? [...filters, moment.name] : filters)) {
      const { name, param } = parseFilter(f), own = f === moment?.name;
      if (FILTERS[name]) pic = FILTERS[name](pic, own ? moment.o : art.effects.filters[name], now - (own ? moment.at : since.get(f) ?? now), calm(), param);
    }
    if (moment && (calm() || now - moment.at >= moment.o.ms)) moment = null;   // the moment is over (this frame shows it still)
    pic = sleeper.frame(pic, now);                               // asleep: the lids and the dark, over everything (ui/sleep.js)
    out = pic.px;
    putPixels(image, out, pic.rgb);
    ctx.putImageData(image, 0, 0);
    shine.draw(image);                                           // the reflection beside it, from the same pixels
    look.draw(image);                                            // the CRT look, over the finished picture: once per frame drawn, never a loop of its own
  }

  // Keep animating while a transition runs or cycles are moving (not while the tab is hidden: the browser
  // pauses animation frames by itself).
  // A frame that fails (a bad loop or cycle) is reported and the picture goes on: `loop` is cleared first, so the next change of
  // picture always starts the animation again (an error here once left `loop` set, and every later room kept the old picture).
  function tick(now) {
    loop = 0;
    let moving = false;
    try {
      if (sleeper.playing()) sleeper.advance(now);                 // (it may end the sleep, and draw the picture woken to)
      const steps = stepsAt(now);
      moving = moment !== null || sleeper.playing() || (filters.some(f => MOVING.has(parseFilter(f).name)) && !calm());
      if (change || steps.join() !== lastSteps || moving) render(now, steps);   // nothing moved: leave the canvas as it is
    } catch (err) {
      console.error("picture frame:", err);
      change = null; from = null; cycles = []; loops = []; lastSteps = "";    // drop the motion that failed; the picture itself stays
      try { render(now); } catch (e) { /* nothing more to draw */ }
      return;
    }
    if (change || moving || ((cycles.length || loops.length) && !calm())) loop = requestAnimationFrame(tick);
  }
  const animate = () => { if (!loop) loop = requestAnimationFrame(tick); };
  const motionChanged = () => { if (frame) { render(performance.now()); animate(); } };
  reducedMotion.addEventListener("change", motionChanged);
  new MutationObserver(motionChanged).observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });   // (see calm)

  // The sleep (ui/sleep.js): its phases and its drawing; this file keeps the picture and the loop.
  const sleeper = mountSleep({ W, H, base, animate, render, hold: (colour) => { frame = new Uint8Array(W * H).fill(colour); cycles = []; loops = []; } });

  return {
    // A sleep, played on the picture (ui/sleep.js: its phases): see start() there. Returns { skip(), cancel() }.
    sleep: (options) => sleeper.start(options),
    // Redraw when the room, its picture version or the overlays shown change; once the story has ended, when it
    // changes to the ending's own picture (a state with no such picture keeps the room's). A restore (new game,
    // undo, a loaded game) switches at once; the ending and a room each use their own named transition
    // of ui/transitions.js. With reduced motion every change is a cut.
    update(prev, next, reason) {
      shine.enable(next.graphics?.reflections !== false);                   // the player's switch (Settings, GRAPHICS)
      const s = next.state, roomId = s.player.at, room = s.world.rooms[roomId];
      const end = s.ended && s.ending && s.pictures?.[s.ending] ? s.pictures[s.ending] : null;   // the ending's picture, once it's over
      const picture = end ? end.picture : room.picture, where = end ? "ending:" + s.ending : roomId;
      const shown = overlaysShown(picture, s, roomId);
      // The description for screen readers: the room's or the ending's, plus a line for each overlay drawn (the room's `overlayAlt`).
      canvas.setAttribute("aria-label", [end ? end.alt : room.alt, ...shown.map(o => overlayAlt(room, o))].filter(Boolean).map(t => text(t, next.pack)).join(" "));
      // The picture filters on (none on an ending's picture: it is a shot of its own), and a new moment to play (below).
      const on = end ? [] : inOrder((s.filters || []).filter(f => FILTERS[parseFilter(f).name]));
      // The picture as painted: its version, which of its things that open are drawn open and which drawn things are away (a change of any is a new picture: it dissolves in).
      const only = end ? null : thingsOf(s, roomId);              // (the room's own things: a shape named like a thing of another room is the picture's own)
      const form = end ? "" : openKey(picture.draw, s.world.objects, only, awayFrom(s, roomId, only)), paintKey = pictureKey(s.worldId, where, picture.version) + (form ? "+" + form : "");
      const key = paintKey + "|" + shown.map(o => o.object).join(",") + "|" + on.join(",");
      if (!prev || reason === "restore") forget();
      const played = playing(prev, next, reason, !!end);
      if (played) moment = played;
      if (key === drawnKey) return moment ? animate() : undefined;
      for (const f of [...since.keys()]) if (!on.includes(f)) since.delete(f);
      for (const f of on) if (!since.has(f)) since.set(f, performance.now());
      filters = on;
      const { px, areas } = paintedAs(paintKey, picture, end ? null : s, roomId);
      const old = frame;
      frame = compose(px, picture, s, roomId, W, H);
      layer.src = px;                                            // (a scroll's pattern comes from the painted picture; overlays stay over it)
      layer.covered = (picture.cycles || []).some(c => c.style === "scroll") ? covered(picture, s, roomId, W, H) : null;
      const t = transition(end ? ENDING : ROOM);
      if (old && reason !== "restore" && !calm() && t.ms > 0) {
        from = change ? from : old;
        // (A death's jolt plays on the room's picture first; the ending's picture comes in after it.)
        change = { ...t, start: performance.now() + (end && played ? played.o.ms : 0) };
      } else { change = null; from = null; }
      if (drawnKey === null || !drawnKey.startsWith(paintKey + "|")) prepare(picture, areas);
      drawnKey = key;
      render(performance.now());
      animate();
    }
  };
}

// The moment a redraw starts, or null: the reaction to a hurt or a heal (ui/effects.js, reactionOf), with its own tunables
// (content/art.js, effects.reactions), even as the story ends (a death's jolt); else the light rattle of a locked thing's refusal
// (state.reactions.locked, the same table: a locked thing or any way you cannot go); else a world's own shake or wave
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
  if ((next.state.reactions?.locked ?? 0) > (prev?.state?.reactions?.locked ?? 0)) {   // a locked thing or a way you could not go: the light rattle (no flash on the page)
    const { filter, ...own } = art.effects.reactions.locked;
    return { name: filter, o: { ...art.effects.filters[filter], ...own }, at: performance.now() };
  }
  const name = Object.keys(COUNTS).find(m => (next.state[COUNTS[m]] ?? 0) > (prev?.state?.[COUNTS[m]] ?? 0));
  return name ? { name, o: art.effects.filters[name], at: performance.now() } : null;
}
