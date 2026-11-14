// Map popup: the rooms you have visited on your level (js/map.js works out what to show), drawn as boxes with lines between
// neighbours and short stubs for ways not taken. It opens from the M on the compass or the MAP command, always centred on
// your room at full size; a drag (mouse or finger) or the arrow keys move it; two fingers pinch it bigger or smaller around
// their middle (a trackpad pinch, Ctrl or ⌘ with the mouse wheel, and + and − do the same); a click on a room (not a drag,
// never a pinch) closes it and walks there.
// Closes with the ×, Esc or a click outside (the browser does the last two: it is a popover). Never changes the game itself:
// it only asks the controller to travel. The game keeps running while it is open, so the map redraws as it changes.

import { mapOf, levelName } from "../js/map.js?v=0.50.3";
import { wide } from "./media.js?v=0.50.3";

const DRAG = 5;   // px a press may move and still count as a click on a room
const KEY = 48;   // px an arrow key moves the map
const ZOOM = { min: 0.5, max: 2, key: 1.25, wheel: 0.01 };   // the zoom's limits; + and − multiply it by `key`; a wheel step by e^(−wheel × its pixels)

// Set up the popup on its popover element. Returns update() and open().
export function mount(panel, on) {
  const $ = (sel) => panel.querySelector(sel);
  const area = $(".area"), world = $(".world"), places = $(".places"), level = $(".level");
  let current = null;                       // what the screen showed last (state and pack)
  let pan = { x: 0, y: 0 };                 // how far the map has been moved from "your room in the middle"
  let zoom = 1;                             // how big the drawing is (1: as tokens.css sizes it), around the drawing's origin
  let drag = null;                          // a press in progress: where it began, whether it has become a drag
  let pinch = null;                         // two fingers down: their distance, the zoom and the pan when they began, and their middle
  let gesture = null;                       // Safari's own trackpad pinch (gesture events): the zoom it began at
  const pointers = new Map();               // the pointers down on the map area: id → where each is now
  let origin = { x: 0, y: 0 };              // where the drawing's origin sits in the area, before the pan (centre())
  let here = null;                          // the room the map was last centred on (a new room centres it again)
  let drawn = null;                         // what the drawing in the popup was made from (draw's key): the same again draws nothing
  let ext = { l: 0, r: 0, t: 0, b: 0 };     // the drawing's edges, from your room's middle (rooms and stubs), as it was last made
  let base = { x: 0, y: 0 };                // where the drawing's origin (your room) sits from the middle of the area: 0 on a phone

  const isOpen = () => panel.matches(":popover-open");
  // A size from tokens.css in integer pixels (even ones, so the middle of a room falls on a pixel too): measured on a hidden
  // stand-in, because the sizes are built from the text size and the popup may not be showing yet when it is drawn.
  // This rounding is the one that is needed: the lines are 1 pixel thick and must meet the rooms' edges exactly, and the
  // text size is not a round number of pixels. The rooms get these same sizes (see draw), so nothing else is rounded.
  const probe = document.createElement("i");
  probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0";
  document.body.append(probe);
  const size = (name) => { probe.style.width = `var(${name})`; return Math.round(probe.getBoundingClientRect().width / 2) * 2; };

  // Move the map (integer pixels, so lines and borders stay sharp).
  function setPan(x, y) {
    pan = { x: Math.round(x), y: Math.round(y) };
    world.style.setProperty("--pan-x", pan.x + "px");
    world.style.setProperty("--pan-y", pan.y + "px");
  }
  // Make the drawing bigger or smaller (within the limits), keeping the point of the drawing at (x, y) in the window where
  // it is: the middle of a pinch, the pointer, or the middle of the area. At 1 the lines are sharp again.
  function zoomAt(z, x, y) {
    z = Math.min(ZOOM.max, Math.max(ZOOM.min, z));
    const box = area.getBoundingClientRect(), ax = x - box.left - origin.x, ay = y - box.top - origin.y;
    setPan(ax - (ax - pan.x) * z / zoom, ay - (ay - pan.y) * z / zoom);
    zoom = z;
    world.style.setProperty("--zoom", zoom);
  }
  const middleOfArea = () => { const box = area.getBoundingClientRect(); return [box.left + box.width / 2, box.top + box.height / 2]; };
  // Put the middle of the map area at the origin of the drawing (integer pixels again).
  function centre() {
    origin = { x: Math.round(area.clientWidth / 2) + base.x, y: Math.round(area.clientHeight / 2) + base.y };
    world.style.left = origin.x + "px";
    world.style.top = origin.y + "px";
  }
  // A new element for the drawing: its class, and where it is (px from the origin, which is the centre of your room).
  const piece = (tag, cls, box) => {
    const el = document.createElement(tag);
    el.className = cls;
    for (const [k, v] of Object.entries(box)) el.style[k] = v + "px";
    return el;
  };

  // Draw the map for the state: rooms, lines, stubs, the level's name, and the list for screen readers. The pieces are made again only
  // when what they are made from has changed (the rooms, lines, stubs, level and language, and the sizes measured now: a game
  // that redraws every turn, and a window resized, mostly change none of it); the centring is always done again.
  function draw() {
    const { state, pack } = current, m = mapOf(state, pack), me = m.rooms.find(r => r.current);
    if (!me) return;
    if (here !== me.id) { here = me.id; setPan(0, 0); zoom = 1; world.style.setProperty("--zoom", 1); }   // somewhere new: centred again, full size
    const W = size("--map-room-w"), H = size("--map-room-h"), G = size("--map-gap"), S = size("--map-stub");
    const key = JSON.stringify([m.rooms, m.lines, m.stubs, levelName(m.level, pack), pack.map.here, W, H, G, S]);
    if (key === drawn) {                                          // nothing to make again: only where the middle is
      base = wide.matches ? { x: -Math.round((ext.l + ext.r) / 2), y: -Math.round((ext.t + ext.b) / 2) } : { x: 0, y: 0 };
      centre();
      return;
    }
    const cx = (r) => (r.x - me.x) * (W + G), cy = (r) => (r.y - me.y) * (H + G);   // the centre of a room
    const by = new Map(m.rooms.map(r => [r.id, r]));
    const nodes = [];
    ext = { l: 0, r: 0, t: 0, b: 0 };
    const grow = (l, t, r, b) => { ext.l = Math.min(ext.l, l); ext.t = Math.min(ext.t, t); ext.r = Math.max(ext.r, r); ext.b = Math.max(ext.b, b); };
    for (const r of m.rooms) grow(cx(r) - W / 2, cy(r) - H / 2, cx(r) + W / 2, cy(r) + H / 2);
    for (const [a, b] of m.lines) {                               // a line across the gap between two neighbours
      const ra = by.get(a), rb = by.get(b);
      nodes.push(ra.y === rb.y
        ? piece("i", "line h", { left: Math.min(cx(ra), cx(rb)) + W / 2, top: cy(ra), width: G })
        : piece("i", "line v", { left: cx(ra), top: Math.min(cy(ra), cy(rb)) + H / 2, height: G }));
    }
    for (const { room, dir } of m.stubs) {                        // a short line out of a room, towards a way not shown
      const r = by.get(room), x = cx(r), y = cy(r);
      grow(x - (dir === "w" ? W / 2 + S : 0), y - (dir === "n" ? H / 2 + S : 0), x + (dir === "e" ? W / 2 + S : 0), y + (dir === "s" ? H / 2 + S : 0));
      nodes.push(dir === "e" ? piece("i", "stub h", { left: x + W / 2, top: y, width: S })
               : dir === "w" ? piece("i", "stub h", { left: x - W / 2 - S, top: y, width: S })
               : dir === "n" ? piece("i", "stub v", { left: x, top: y - H / 2 - S, height: S })
               : piece("i", "stub v", { left: x, top: y + H / 2, height: S }));
    }
    for (const r of m.rooms) {
      const box = piece("div", "room text-room" + (r.current ? " current" : ""), { left: cx(r) - W / 2, top: cy(r) - H / 2, width: W, height: H });
      box.dataset.room = r.id;
      box.setAttribute("aria-hidden", "true");                    // the list below says it for screen readers
      const name = document.createElement("span");
      name.textContent = r.name;                                  // (one line, cut with … in map.css if too long)
      box.append(name);
      nodes.push(box);
    }
    // A desktop window centres the whole map in the area; a phone or small window centres your room.
    base = wide.matches ? { x: -Math.round((ext.l + ext.r) / 2), y: -Math.round((ext.t + ext.b) / 2) } : { x: 0, y: 0 };
    world.replaceChildren(...nodes);
    level.textContent = levelName(m.level, pack);
    places.replaceChildren(...m.rooms.map(r => {
      const li = document.createElement("li");
      li.textContent = r.name + (r.current ? " (" + pack.map.here + ")" : "");
      return li;
    }));
    drawn = key;
    centre();
  }

  // A room was clicked (not dragged): your own room just closes the map; another closes it and the controller walks there.
  function choose(id) {
    const own = id === current.state.player.at;
    panel.hidePopover();
    if (!own) on.travel(id);
  }

  // Dragging: press, move more than a few pixels and the map follows; let go without moving and it was a click.
  // Pinching: a second finger down turns the press into a pinch (never a click): the drawing grows or shrinks with the
  // distance between the fingers, and the point between them stays between them, so moving both fingers moves the map too.
  // When one finger lifts, the other drags on from where it is. map.css's `touch-action: none` keeps the browser from
  // zooming or scrolling the page instead.
  const two = () => { const [a, b] = [...pointers.values()]; return { d: Math.hypot(b.x - a.x, b.y - a.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
  const dragFrom = (id, p, moved) => ({ id, x: p.x, y: p.y, px: pan.x, py: pan.y, moved, room: null });
  area.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    area.setPointerCapture(e.pointerId);                          // (keeps the drag going outside the area)
    // (a finger that isn't the first one down, the first being outside the map, makes no tap either)
    if (pointers.size === 1) drag = { ...dragFrom(e.pointerId, pointers.get(e.pointerId), !e.isPrimary), room: e.target.closest(".room")?.dataset.room };
    else if (pointers.size === 2) { pinch = { ...two(), zoom, pan: { ...pan } }; drag = null; area.classList.remove("dragging"); }
  });
  area.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch) {
      if (pointers.size !== 2) return;                            // (a third finger: the first two pinch on)
      const now = two();
      // Back to how it was when the fingers came down, then zoom around their first middle and follow it to where it is now.
      setPan(pinch.pan.x, pinch.pan.y); zoom = pinch.zoom;
      zoomAt(pinch.zoom * now.d / pinch.d, pinch.x, pinch.y);
      setPan(pan.x + now.x - pinch.x, pan.y + now.y - pinch.y);
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) <= DRAG) return;
    drag.moved = true;
    area.classList.add("dragging");
    setPan(drag.px + dx, drag.py + dy);
  });
  const release = (e) => {
    if (!pointers.delete(e.pointerId)) return;
    if (pinch) {                                                  // a pinch ends: the finger left drags on, and nothing is clicked
      if (pointers.size < 2) pinch = null;
      else if (pointers.size === 2) pinch = { ...two(), zoom, pan: { ...pan } };   // (a third finger lifted: the two left pinch on from here)
      if (pointers.size === 1) { const [[id, p]] = pointers; drag = dragFrom(id, p, true); }
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    area.classList.remove("dragging");
    if (e.type === "pointerup" && !d.moved && d.room) choose(d.room);
  };
  area.addEventListener("pointerup", release);
  area.addEventListener("pointercancel", release);
  // A second finger that comes down outside the map while one presses it: that press is no tap either.
  document.addEventListener("pointerdown", (e) => { if (drag && !pointers.has(e.pointerId)) drag.moved = true; }, true);
  // A trackpad pinch (Chrome, Firefox and Edge send it as the wheel with Ctrl held), and Ctrl or ⌘ with the mouse wheel: zoom
  // around the pointer, instead of the browser zooming the page. The plain wheel is left alone. A wheel step is counted in
  // pixels (a line as 16, a page as 400) and capped, so one notch of a mouse wheel is a step of about a fifth.
  area.addEventListener("wheel", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const px = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    zoomAt(zoom * Math.exp(-ZOOM.wheel * Math.max(-20, Math.min(20, px))), e.clientX, e.clientY);
  }, { passive: false });
  // Safari's trackpad pinch comes as its own gesture events instead. On a phone the fingers are pointers already (above): there
  // the gesture is only kept from zooming the page.
  area.addEventListener("gesturestart", (e) => { e.preventDefault(); gesture = pointers.size ? null : zoom; });
  area.addEventListener("gesturechange", (e) => { e.preventDefault(); if (gesture !== null) zoomAt(gesture * e.scale, e.clientX, e.clientY); });
  area.addEventListener("gestureend", (e) => { e.preventDefault(); gesture = null; });
  // The arrow keys move the view the way they do on any map: right shows more to the east. + and − zoom around the middle.
  const ARROWS = { ArrowLeft: [KEY, 0], ArrowRight: [-KEY, 0], ArrowUp: [0, KEY], ArrowDown: [0, -KEY] };
  const ZOOMS = { "+": ZOOM.key, "=": ZOOM.key, "-": 1 / ZOOM.key, "−": 1 / ZOOM.key, "_": 1 / ZOOM.key };
  panel.addEventListener("keydown", (e) => {
    const move = ARROWS[e.key], times = ZOOMS[e.key];
    if ((!move && !times) || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    if (move) setPan(pan.x + move[0], pan.y + move[1]);
    else zoomAt(zoom * times, ...middleOfArea());
  });
  $(".close").addEventListener("click", () => panel.hidePopover());

  // Opening: drawn centred on your room, with the focus on the popup so the arrow keys work. Closing: the focus goes back to
  // the command line. data-state says which (map.css has a spot for an animation).
  panel.addEventListener("beforetoggle", (e) => {
    panel.dataset.state = e.newState;
    if (e.newState !== "open") return;
    if (!current || current.state.ended) { e.preventDefault(); return; }   // (nothing to show yet, or the story is over)
    here = null;                                                  // centred and full size, whatever the last visit left
    draw();
  });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") { centre(); panel.focus({ preventScroll: true }); }
    else { drag = null; pinch = null; gesture = null; pointers.clear(); area.classList.remove("dragging"); on.focus(); }
  });
  window.addEventListener("resize", () => { if (isOpen()) draw(); });

  return {
    // Redraw the texts when the language changes; while the map is open, redraw it as the game moves on.
    update(prev, next) {
      current = next;
      panel.classList.toggle("over", !!next.state.ended);         // the story is over: rooms stop answering clicks (map.css)
      if (!prev || prev.state.lang !== next.state.lang) {
        const t = next.pack.map;
        $("#map-title").textContent = t.title;
        $("#map-rooms").textContent = t.rooms;
        $(".close").setAttribute("aria-label", t.close);
        $(".hint").textContent = t.hint;
      }
      if (isOpen()) draw();
    },
    // The MAP command: show the map (nothing if it is already shown).
    open() { if (!isOpen()) panel.showPopover(); }
  };
}
