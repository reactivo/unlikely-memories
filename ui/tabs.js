// Tabs (phones only): DIRECTIONS and INVENTORY open their panels (popovers, index.html) just above themselves.
// The browser opens and closes them (the tab again, Esc, a tap anywhere else); this adds the rest:
//   - places an opening panel over its tab, lined up with it (one character of space around: tabs.css);
//   - marks the open tab (aria-expanded, which also turns it yellow);
//   - closes the panel when you pick something in it (an open exit, an item);
//   - closes it if the window grows wide enough for the strip, where the panels are ordinary sections.

const wide = matchMedia("(min-width: 760px)");

// Set up the tabs on their element. Returns update().
export function mount(root) {
  for (const tab of root.querySelectorAll(".tab")) {
    const panel = document.getElementById(tab.getAttribute("popovertarget"));

    panel.addEventListener("beforetoggle", (e) => {
      if (wide.matches) { e.preventDefault?.(); return; }            // never a popover beside the strip
      if (e.newState === "open") place(panel, tab);
    });
    panel.addEventListener("toggle", (e) => {
      tab.setAttribute("aria-expanded", e.newState === "open");
      if (e.newState === "closed") panel.removeAttribute("style");   // back to the strip's layout if the window grows
    });
    // Something picked (a button that does something): close.
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b && b.getAttribute("aria-disabled") !== "true" && panel.matches(":popover-open")) panel.hidePopover();
    });
    wide.addEventListener("change", () => { if (panel.matches(":popover-open")) panel.hidePopover(); });
    window.addEventListener("resize", () => { if (panel.matches(":popover-open")) place(panel, tab); });
  }

  return {
    // On a language change: the tabs' names.
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      root.querySelector("#tab-exits").textContent = next.pack.labels.directions;
      root.querySelector("#tab-inventory").textContent = next.pack.labels.inv;
    }
  };
}

// Put the panel just above its tab: the panel's content as wide as the tab, its padding around it.
function place(panel, tab) {
  const r = tab.getBoundingClientRect(), pad = parseFloat(getComputedStyle(panel).paddingLeft) || 0;
  panel.style.left = (r.left - pad) + "px";
  panel.style.width = (r.width + 2 * pad) + "px";
  panel.style.bottom = (document.documentElement.clientHeight - r.top) + "px";
}
