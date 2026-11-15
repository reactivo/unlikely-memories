// A popover that hangs from a tool button (≡ options: ui/options.js). The HTML popover API does the
// rest (non-modal: Esc, a click outside or the button again close it). This only places it, right edges lined up with the button:
// on the side the button names: data-hang="above" opens it above the button (both ≡ do: the phones' in the bottom row, the strip's
// under the inventory); otherwise under it. While it is open it is placed again every frame (follow, below), so it stays at its
// button whatever moves it (the page gliding to a new room, Safari's toolbar): until 15 November 2026 it was placed once, as it
// opened, and on iPhone Safari it stayed behind when the bottom row moved.

// Hang `panel` from `buttons` (one or several; the one shown, the one that opened it, places it); `opened()` and `closed()` are called as it opens (after it is placed) and as it closes.
export function hang(panel, buttons, { opened, closed }) {
  buttons = [].concat(buttons);
  const gap = () => parseFloat(getComputedStyle(panel).getPropertyValue("--space-s")) || 8;   // the space between button and panel (tokens.css)
  let from = null;                                          // the button that opened it
  for (const b of buttons) b.addEventListener("click", () => { from = b; });
  const shown = () => (from && from.offsetParent !== null ? from : buttons.find((b) => b.offsetParent !== null)) || buttons[0];
  // Place the panel under (or above) the button, right edges aligned. Above: its bottom edge a gap over the button's top, by
  // putting its top there and lifting it by its own height (translateY(-100%)), so no window height is needed: iPhone Safari's
  // documentElement.clientHeight stays the same while its toolbar shrinks and grows, and a panel placed from the window's
  // bottom with it slid down over ≡ as you scrolled (until 15 November 2026).
  function place() {
    const button = shown(), r = button.getBoundingClientRect();
    panel.style.right = Math.max(8, document.documentElement.clientWidth - r.right) + "px";
    panel.style.bottom = "auto";
    if (button.dataset.hang === "above") {
      panel.style.top = (r.top - gap()) + "px";
      panel.style.transform = "translateY(-100%)";
    } else {
      panel.style.top = (r.bottom + gap()) + "px";
      panel.style.transform = "none";
    }
  }
  // On a low window the panel can reach past the screen: slide it back until its edge is in view (it then covers the button).
  function keepOnScreen() {
    const r = panel.getBoundingClientRect(), H = window.innerHeight, top = parseFloat(panel.style.top) || 0;
    if (r.top < gap()) panel.style.top = (top + gap() - r.top) + "px";
    else if (r.bottom + gap() > H) panel.style.top = Math.max(top - (r.bottom + gap() - H), top - (r.top - gap())) + "px";
  }
  panel.addEventListener("beforetoggle", (e) => { if (e.newState === "open") place(); });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") { keepOnScreen(); opened(); follow(panel, () => { place(); keepOnScreen(); }); }
    else closed();
  });
}

// While `panel` is open: `place()` again every frame, so it stays where its button is (stops by itself when the panel closes). The
// phones' DIRECTIONS and INVENTORY panels use it too (ui/tabs.js): one way of keeping a panel at its button.
export function follow(panel, place) {
  const frame = () => { if (!panel.matches(":popover-open")) return; place(); requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}
