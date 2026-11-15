// Compass (directions): N, E, S, W, up and down, always all six: a way is bright and clickable (it sends the direction as a command);
// no way is faint, skipped by Tab, and says so to a screen reader. A way with a condition (a locked door, a shop with hours) is shown
// the same whether it is open or shut at the moment: you can see the door, and clicking it gives the line for a shut one. There is no
// in or out (since 14 November 2026): every way in or out of somewhere is a thing in the room (BRIEF.md §8, "Exits"), clicked in the
// story. The compass knows nothing of worlds: it reads the room's exits.
// SEE MAP (under the six) opens the map: the button itself does it (popovertarget, index.html; ui/map.js); this names it. Once the
// story has ended the whole compass, SEE MAP included, is dim and ignores clicks and Tab (the game is locked).

import { exitTo } from "../js/exits.js?v=0.53.2";

const DIRS = ["n", "s", "e", "w", "u", "d"];

// Set up the compass on its element. Returns update().
export function mount(root, on) {
  const buttons = root.querySelectorAll("button[data-dir]");
  let current = null;   // what was drawn last (needed when a button is clicked)

  // Go that way, if there's a way: it sends the button's name as a command ("North", "Bajar": the pack's dirTips, which the parser
  // reads as that direction); with no way, nothing.
  const go = (d) => { if (current && !current.state.ended && exitsOf(current.state)[d]) on.command(current.pack.dirTips[d]); };
  buttons.forEach(b => b.addEventListener("click", () => { go(b.dataset.dir); on.focus(); }));

  return {
    // Redraw when the exits, the language or the end change. After a turn, an exit that opened or closed blinks.
    update(prev, next, reason) {
      current = next;
      const exits = exitsOf(next.state), was = prev ? exitsOf(prev.state) : null, over = !!next.state.ended;
      root.classList.toggle("over", over);             // the story is over: dim (compass.css)
      if (prev && prev.state.lang === next.state.lang && !prev.state.ended === !over && sameExits(was, exits)) return;
      const t = next.pack;
      const m = root.querySelector(".map");              // SEE MAP: the map, while the story goes on
      m.querySelector(".label").textContent = t.labels.seeMap;
      m.setAttribute("aria-disabled", over ? "true" : "false");
      m.tabIndex = over ? -1 : 0;
      buttons.forEach(b => {
        const d = b.dataset.dir, open = !!exits[d];
        b.classList.toggle("open", open);
        b.setAttribute("aria-disabled", open && !over ? "false" : "true");
        b.setAttribute("aria-label", t.dirTips[d] + (open ? "" : " (" + t.noExit + ")"));
        b.tabIndex = open && !over ? 0 : -1;        // closed exits (and all, once it is over) are skipped by Tab
        if (open && !over) b.title = t.dirTips[d]; else b.removeAttribute("title");   // the tooltip: only on a way you can take
        // It just changed: blink (compass.css).
        if (prev && reason !== "restore" && !!was[d] !== open) {
          b.classList.remove("changed"); void b.offsetWidth;
          b.classList.add("changed");
          b.addEventListener("animationend", () => b.classList.remove("changed"), { once: true });
        }
      });
    }
  };
}

// The exits of the room you're in that the compass shows: where each leads (a conditional exit as the room it leads to, shut or not).
const exitsOf = (state) => Object.fromEntries(Object.entries(state.world.rooms[state.player.at].exits || {}).filter(([d]) => DIRS.includes(d)).map(([d, x]) => [d, exitTo(x)]));
// Are the same exits open in a and b?
const sameExits = (a, b) => DIRS.every(d => !!a[d] === !!b[d]);
