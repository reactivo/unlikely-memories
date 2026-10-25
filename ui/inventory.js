// Inventory: fills the slots in order with what you carry. Clicking an item examines it, then suggests actions.
// After a turn, a new item drops into its slot and one that leaves sinks away (the look: inventory.css; the
// timing: tokens.css). A restore (new game, language change) shows the inventory at once. Once the story has ended the
// items are dim and don't respond (the game is locked).

import { itemSVG } from "./sprite.js";
import { text } from "../js/narrator.js";

// Set up the inventory on its section. Returns update().
export function mount(root, on) {
  const slots = root.querySelectorAll(".slot");
  let drawn = null;        // the latest { carrying, pack } asked for (an update can arrive while items are leaving)

  // Fill the slots with these items; `arrived` ones get the arriving animation.
  function fill(carrying, pack, arrived, state) {
    slots.forEach((slot, i) => {
      slot.innerHTML = "";
      const id = carrying[i], obj = state.world.objects[id];
      const name = pack.items[id]?.name ?? (obj?.name ? text(obj.name, pack) : null);   // the pack's, or the world's
      if (!id || !name) return;                             // empty slot
      const b = document.createElement("button");           // the item: a button with its sprite
      b.type = "button"; b.className = "item";
      b.title = name; b.setAttribute("aria-label", name);
      b.innerHTML = itemSVG(id, state) || "";
      b.disabled = !!state.ended;                           // the story is over: nothing responds
      b.addEventListener("click", () => on.showItem(id));
      if (arrived.includes(id)) {
        b.classList.add("arrive");
        b.addEventListener("animationend", () => b.classList.remove("arrive"), { once: true });
      }
      slot.appendChild(b);
    });
  }

  return {
    // Redraw when what you carry or the language changes.
    update(prev, next, reason) {
      const langChanged = !prev || prev.state.lang !== next.state.lang;
      root.classList.toggle("over", !!next.state.ended);    // the story is over: dim (inventory.css)
      root.querySelectorAll(".item").forEach(b => { b.disabled = !!next.state.ended; });
      const carrying = next.state.player.carrying.slice(), before = prev ? prev.state.player.carrying : [];
      if (!langChanged && before.join() === carrying.join()) return;
      const moving = prev && reason !== "restore";
      const arrived = moving ? carrying.filter(id => !before.includes(id)) : [];
      const leaving = moving ? [...root.querySelectorAll(".item")].filter((b, i) => !carrying.includes(before[i])) : [];
      drawn = { carrying, pack: next.pack };
      if (!leaving.length) return fill(carrying, next.pack, arrived, next.state);
      // Let leaving items sink away first (no animation with reduced motion: then straight on).
      leaving.forEach(b => b.classList.add("depart"));
      const mine = drawn;
      Promise.all(leaving.flatMap(b => b.getAnimations().map(a => a.finished))).catch(() => {}).then(() => {
        if (drawn === mine) fill(carrying, next.pack, arrived, next.state);   // unless a newer update came meanwhile
      });
    }
  };
}
