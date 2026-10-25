// Map popup: the rooms you have visited on your level (js/map.js works out what to show), drawn as boxes with lines between
// neighbours and short stubs for ways not taken. It opens from the M on the compass or the MAP command, always centred on
// your room; a drag (mouse or finger) or the arrow keys move it; a click on a room (not a drag) closes it and walks there.
// Closes with the ×, Esc or a click outside (the browser does the last two: it is a popover). Never changes the game itself:
// it only asks the controller to travel. The game keeps running while it is open, so the map redraws as it changes.

import { mapOf, levelName } from "../js/map.js";

const DRAG = 5;   // px a press may move and still count as a click on a room
const KEY = 48;   // px an arrow key moves the map

// Set up the popup on its popover element. Returns update() and open().
export function mount(panel, on) {
  const $ = (sel) => panel.querySelector(sel);
  const area = $(".area"), world = $(".world"), places = $(".places"), level = $(".level");
  let current = null;                       // what the screen showed last (state and pack)
  let pan = { x: 0, y: 0 };                 // how far the map has been moved from "your room in the middle"
  let drag = null;                          // a press in progress: where it began, whether it has become a drag
  let here = null;                          // the room the map was last centred on (a new room centres it again)
  let base = { x: 0, y: 0 };                // where the drawing's origin (your room) sits from the middle of the area: 0 on a phone
  const wide = matchMedia("(min-width: 760px)");   // a desktop window: the middle of the whole map is the middle of the area

  const isOpen = () => panel.matches(":popover-open");
  // A size from tokens.css in whole pixels (even ones, so the middle of a room is a whole pixel too): measured on a hidden
  // stand-in, because the sizes are built from the text size and the popup may not be showing yet when it is drawn.
  const probe = document.createElement("i");
  probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0";
  document.body.append(probe);
  const size = (name) => { probe.style.width = `var(${name})`; return Math.round(probe.getBoundingClientRect().width / 2) * 2; };

  // Move the map (whole pixels, so lines and borders stay sharp).
  function setPan(x, y) {
    pan = { x: Math.round(x), y: Math.round(y) };
    world.style.setProperty("--pan-x", pan.x + "px");
    world.style.setProperty("--pan-y", pan.y + "px");
  }
  // Put the middle of the map area at the origin of the drawing (whole pixels again).
  function centre() {
    world.style.left = Math.round(area.clientWidth / 2) + base.x + "px";
    world.style.top = Math.round(area.clientHeight / 2) + base.y + "px";
  }
  // A new element for the drawing: its class, and where it is (px from the origin, which is the centre of your room).
  const piece = (tag, cls, box) => {
    const el = document.createElement(tag);
    el.className = cls;
    for (const [k, v] of Object.entries(box)) el.style[k] = v + "px";
    return el;
  };

  // Draw the map for the state: rooms, lines, stubs, the level's name, and the list for screen readers.
  function draw() {
    const { state, pack } = current, m = mapOf(state, pack), me = m.rooms.find(r => r.current);
    if (!me) return;
    if (here !== me.id) { here = me.id; setPan(0, 0); }          // you are somewhere new: centred again
    const W = size("--map-room-w"), H = size("--map-room-h"), G = size("--map-gap"), S = size("--map-stub");
    const cx = (r) => (r.x - me.x) * (W + G), cy = (r) => (r.y - me.y) * (H + G);   // the centre of a room
    const by = new Map(m.rooms.map(r => [r.id, r]));
    const nodes = [];
    const ext = { l: 0, r: 0, t: 0, b: 0 };                       // the drawing's edges, from your room's middle (rooms and stubs)
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
      const box = piece("div", "room" + (r.current ? " current" : ""), { left: cx(r) - W / 2, top: cy(r) - H / 2 });
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
    centre();
  }

  // A room was clicked (not dragged): your own room just closes the map; another closes it and the controller walks there.
  function choose(id) {
    const own = id === current.state.player.at;
    panel.hidePopover();
    if (!own) on.travel(id);
  }

  // Dragging: press, move more than a few pixels and the map follows; let go without moving and it was a click.
  area.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false, room: e.target.closest(".room")?.dataset.room };
    area.setPointerCapture(e.pointerId);                          // (keeps the drag going outside the area)
  });
  area.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) <= DRAG) return;
    drag.moved = true;
    area.classList.add("dragging");
    setPan(drag.px + dx, drag.py + dy);
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    area.classList.remove("dragging");
    if (e.type === "pointerup" && !d.moved && d.room) choose(d.room);
  };
  area.addEventListener("pointerup", release);
  area.addEventListener("pointercancel", release);
  // The arrow keys move the view the way they do on any map: right shows more to the east.
  const ARROWS = { ArrowLeft: [KEY, 0], ArrowRight: [-KEY, 0], ArrowUp: [0, KEY], ArrowDown: [0, -KEY] };
  panel.addEventListener("keydown", (e) => {
    const move = ARROWS[e.key];
    if (!move || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    setPan(pan.x + move[0], pan.y + move[1]);
  });
  $(".close").addEventListener("click", () => panel.hidePopover());

  // Opening: drawn centred on your room, with the focus on the popup so the arrow keys work. Closing: the focus goes back to
  // the command line. data-state says which (map.css has a spot for an animation).
  panel.addEventListener("beforetoggle", (e) => {
    panel.dataset.state = e.newState;
    if (e.newState !== "open") return;
    if (!current || current.state.ended) { e.preventDefault(); return; }   // (nothing to show yet, or the story is over)
    here = null;                                                  // centred, whatever the last visit left
    draw();
  });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") { centre(); panel.focus({ preventScroll: true }); }
    else { drag = null; area.classList.remove("dragging"); on.focus(); }
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
