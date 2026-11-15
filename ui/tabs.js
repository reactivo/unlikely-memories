// Tabs (phones only): DIRECTIONS and INVENTORY open their panels (popovers, index.html) just above themselves.
// The browser opens and closes them (the tab again, Esc, a tap anywhere else); this adds the rest:
//   - in browsers without CSS anchor positioning, places an opening panel over its tab (tabs.css anchors it everywhere else);
//   - marks the open tab (aria-expanded, which also turns it yellow);
//   - closes the panel when you pick something in it (an item, SEE MAP), but not on a compass direction: an open panel
//     closes instead when you arrive in a room you had not visited (by any means: a tap, a typed command, the map), so the
//     new room's text is seen; a room visited before, or a way that doesn't move you (a locked door), leaves it open;
//   - closes it if the window grows wide enough for the strip, where the panels are ordinary sections.

import { wide } from "./media.js?v=0.53.1";

const anchored = CSS.supports("anchor-name: --a");   // tabs.css hangs the panels from their tabs itself

// Set up the tabs on their element. Returns update().
export function mount(root) {
  const panels = [];
  for (const tab of root.querySelectorAll(".tab")) {
    const panel = document.getElementById(tab.getAttribute("popovertarget"));
    panels.push(panel);

    panel.addEventListener("beforetoggle", (e) => {
      if (wide.matches) { e.preventDefault?.(); return; }            // never a popover beside the strip
      if (e.newState === "open" && !anchored) place(panel, tab);
    });
    panel.addEventListener("toggle", (e) => {
      tab.setAttribute("aria-expanded", e.newState === "open");
      if (e.newState === "closed") panel.removeAttribute("style");   // back to the strip's layout if the window grows
    });
    // Something picked (a button that does something): close. Not a compass direction: arriving somewhere new closes it (update).
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b && !b.dataset.dir && b.getAttribute("aria-disabled") !== "true" && panel.matches(":popover-open")) panel.hidePopover();
    });
    wide.addEventListener("change", () => { if (panel.matches(":popover-open")) panel.hidePopover(); });
    if (!anchored) {
      const follow = () => { if (panel.matches(":popover-open")) place(panel, tab); };
      window.addEventListener("resize", follow);
      window.addEventListener("scroll", follow, { passive: true });
      window.visualViewport?.addEventListener("resize", follow);
    }
  }

  return {
    // A room you had not visited: an open panel closes, so its text is seen (not on a new game, an undo or a load: "restore").
    // On a language change: the tabs' names.
    update(prev, next, reason) {
      if (prev && reason !== "restore" && arrived(prev.state, next.state))
        for (const panel of panels) if (panel.matches(":popover-open")) panel.hidePopover();
      if (prev && prev.state.lang === next.state.lang) return;
      root.querySelector("#tab-exits").textContent = next.pack.labels.directions;
      root.querySelector("#tab-inventory").textContent = next.pack.labels.inv;
    }
  };
}

// Have you just come into a room you had not visited before?
const arrived = (was, now) => was.player.at !== now.player.at && !(was.seen?.visited ?? []).includes(now.player.at);

// Without anchors: put the panel just above its tab, measured now (again on every scroll and resize): the panel's content as wide as the tab, its padding around it.
function place(panel, tab) {
  const r = tab.getBoundingClientRect(), pad = parseFloat(getComputedStyle(panel).paddingLeft) || 0;
  panel.style.left = (r.left - pad) + "px";
  panel.style.width = (r.width + 2 * pad) + "px";
  panel.style.bottom = (document.documentElement.clientHeight - r.top) + "px";
}
