// Compass (directions): a way is bright and clickable (it sends the direction as a command); no way is faint. A way
// with a condition (a locked door, a shop with hours) is shown the same whether it is open or shut at the moment: you
// can see the door, and clicking it gives the line for a shut one. The four points are always there. The four corners
// (in and out on the left, up and down on the right) only appear when the room has that exit; otherwise the corner stays
// an empty dark tile (hidden from Tab and screen readers).
// The map tile (M) opens the map: the button itself does it (popovertarget, index.html; ui/map.js). Once the story has ended the whole
// compass, M included, is dim and ignores clicks and Tab (the game is locked).

import { exitTo } from "../js/exits.js";

const DIRS = ["n", "s", "e", "w", "u", "d", "in", "out"];
const CORNERS = ["in", "out", "u", "d"];

// Set up the compass on its element. Returns update().
export function mount(root, on) {
  const buttons = root.querySelectorAll("button[data-dir]");
  let current = null;   // what was drawn last (needed when a button is clicked)

  // Go that way, if there's a way: it sends the button's name as a command ("North", "Salir": the pack's dirTips, which the parser
  // reads as that direction); with no way, nothing.
  const go = (d) => { if (current && !current.state.ended && exitsOf(current.state)[d]) on.command(current.pack.dirTips[d]); };
  buttons.forEach(b => b.addEventListener("click", () => { go(b.dataset.dir); on.focus(); }));

  return {
    // Redraw when the exits, the language or the end change. After a turn, an exit that opened or closed blinks.
    update(prev, next, reason) {
      current = next;
      const exits = exitsOf(next.state), over = !!next.state.ended;
      root.classList.toggle("over", over);             // the story is over: dim (compass.css)
      if (prev && prev.state.lang === next.state.lang && !prev.state.ended === !over && sameExits(exitsOf(prev.state), exits)) return;
      const t = next.pack;
      const m = root.querySelector(".map");              // M: the map, while the story goes on
      m.setAttribute("aria-label", t.labels.map);
      if (over) m.removeAttribute("title"); else m.title = t.labels.map;   // the tooltip, like ♫ ≡ (ui/tools.js)
      m.setAttribute("aria-disabled", over ? "true" : "false");
      m.tabIndex = over ? -1 : 0;
      buttons.forEach(b => {
        const d = b.dataset.dir, open = !!exits[d];
        b.classList.toggle("open", open);
        if (CORNERS.includes(d)) {                  // a corner is invisible and unreachable while its exit is closed
          b.setAttribute("aria-hidden", open ? "false" : "true");
          if (open) b.setAttribute("aria-label", t.dirTips[d]); else b.removeAttribute("aria-label");
        } else {
          b.setAttribute("aria-disabled", open && !over ? "false" : "true");
          b.setAttribute("aria-label", t.dirTips[d] + (open ? "" : " (" + t.noExit + ")"));
        }
        b.tabIndex = open && !over ? 0 : -1;        // closed exits (and all, once it is over) are skipped by Tab
        if (open && !over) b.title = t.dirTips[d]; else b.removeAttribute("title");   // the tooltip: only on a way you can take
        const opened = open && !(prev && exitsOf(prev.state)[d]);
        // It just changed: blink (compass.css). A corner that closes just disappears.
        if (prev && reason !== "restore" && (CORNERS.includes(d) ? opened : !!exitsOf(prev.state)[d] !== open)) {
          b.classList.remove("changed"); void b.offsetWidth;
          b.classList.add("changed");
          b.addEventListener("animationend", () => b.classList.remove("changed"), { once: true });
        }
      });
    }
  };
}

// The exits of the room you're in: where each leads (a conditional exit as the room it leads to, shut or not).
const exitsOf = (state) => Object.fromEntries(Object.entries(state.world.rooms[state.player.at].exits || {}).map(([d, x]) => [d, exitTo(x)]));
// Are the same exits open in a and b?
const sameExits = (a, b) => DIRS.every(d => !!a[d] === !!b[d]);
