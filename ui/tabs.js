// Tabs (phones only): DIRECTIONS and INVENTORY open their panels (popovers, index.html) just above themselves.
// The browser opens and closes them (the tab again, Esc, a tap anywhere else); this adds the rest:
//   - keeps an open panel standing on its tab: measured every frame while it is open, so it never lags behind the tab, whatever
//     moves it (the page gliding to a new room, Safari's toolbar, the keyboard). CSS anchor positioning did this until 15
//     November 2026, but iPhone Safari only worked the place out again now and then while the page moved under the bar that
//     holds the tab, so the panel sat too high and then jumped down onto it;
//   - marks the open tab (aria-expanded, which also turns it yellow);
//   - closes the panel when you pick something in it (an item, SEE MAP), but not on a compass direction: an open panel
//     closes instead when you arrive in a room you had not visited (by any means: a tap, a typed command, the map), so the
//     new room's text is seen; a room visited before, or a way that doesn't move you (a locked door), leaves it open;
//   - closes it if the window grows wide enough for the strip, where the panels are ordinary sections.

import { wide } from "./media.js?v=0.58.3";
import { follow } from "./popup.js?v=0.58.3";

// Set up the tabs on their element. Returns update().
export function mount(root) {
  const panels = [];
  for (const tab of root.querySelectorAll(".tab")) {
    const panel = document.getElementById(tab.getAttribute("popovertarget"));
    panels.push(panel);

    panel.addEventListener("beforetoggle", (e) => {
      if (wide.matches) { e.preventDefault?.(); return; }            // never a popover beside the strip
      if (e.newState === "open") place(panel, tab);
    });
    panel.addEventListener("toggle", (e) => {
      tab.setAttribute("aria-expanded", e.newState === "open");
      if (e.newState === "open") follow(panel, () => place(panel, tab));
      else panel.removeAttribute("style");                           // back to the strip's layout if the window grows
    });
    // Something picked (a button that does something): close. Not a compass direction: arriving somewhere new closes it (update).
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b && !b.dataset.dir && b.getAttribute("aria-disabled") !== "true" && panel.matches(":popover-open")) panel.hidePopover();
    });
    wide.addEventListener("change", () => { if (panel.matches(":popover-open")) panel.hidePopover(); });
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

// Put the panel just above its tab, measured now: the panel's content as wide as the tab, its padding around it. Its top on the tab's
// top, lifted by its own height (translateY(-100%)), so no window height is needed (iPhone Safari's documentElement.clientHeight
// stays the same while its toolbar shrinks and grows: placed from the window's bottom, the panel slid as you scrolled). Writes only
// what changed (most frames, nothing).
function place(panel, tab) {
  const r = tab.getBoundingClientRect(), pad = parseFloat(getComputedStyle(panel).paddingLeft) || 0;
  const set = (k, v) => { if (panel.style[k] !== v) panel.style[k] = v; };
  set("left", (r.left - pad) + "px");
  set("width", (r.width + 2 * pad) + "px");
  set("bottom", "auto");
  set("top", r.top + "px");
  set("transform", "translateY(-100%)");
}
