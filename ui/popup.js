// A popover that hangs from a tool button (≡ options: ui/options.js). The HTML popover API does the
// rest (non-modal: Esc, a click outside or the button again close it). This only places it, right edges lined up with the button:
// on the side the button names: data-hang="above" opens it above the button (both ≡ do: the phones' in the bottom row, the strip's
// under the inventory); otherwise under it.

// Hang `panel` from `buttons` (one or several; the one shown, the one that opened it, places it); `opened()` and `closed()` are called as it opens (after it is placed) and as it closes.
export function hang(panel, buttons, { opened, closed }) {
  buttons = [].concat(buttons);
  const gap = () => parseFloat(getComputedStyle(panel).getPropertyValue("--space-s")) || 8;   // the space between button and panel (tokens.css)
  let from = null;                                          // the button that opened it
  for (const b of buttons) b.addEventListener("click", () => { from = b; });
  const shown = () => (from && from.offsetParent !== null ? from : buttons.find((b) => b.offsetParent !== null)) || buttons[0];
  // Place the panel under (or above) the button, right edges aligned.
  function place() {
    const button = shown(), r = button.getBoundingClientRect(), H = document.documentElement.clientHeight;
    panel.style.right = Math.max(8, document.documentElement.clientWidth - r.right) + "px";
    const side = button.dataset.hang === "above" ? "above" : "below";
    if (side === "below") {
      panel.style.top = (r.bottom + gap()) + "px";
      panel.style.bottom = "auto";
    } else {
      panel.style.bottom = (H - r.top + gap()) + "px";
      panel.style.top = "auto";
    }
  }
  // On a low window the panel can reach past the screen: slide it back until its edge is in view (it then covers the button).
  function keepOnScreen() {
    const r = panel.getBoundingClientRect(), H = document.documentElement.clientHeight;
    if (panel.style.top !== "auto") {
      const over = r.bottom + gap() - H;
      if (over > 0) panel.style.top = Math.max(gap(), r.top - over) + "px";
    } else if (r.top < gap()) {
      panel.style.bottom = Math.max(gap(), H - r.bottom - (gap() - r.top)) + "px";
    }
  }
  panel.addEventListener("beforetoggle", (e) => { if (e.newState === "open") place(); });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") { keepOnScreen(); opened(); }
    else closed();
  });
  window.addEventListener("resize", () => { if (panel.matches(":popover-open")) place(); });
}
