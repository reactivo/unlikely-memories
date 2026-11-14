// A popover that hangs from a tool button (≡ options: ui/options.js). The HTML popover API does the
// rest (non-modal: Esc, a click outside or the button again close it). This only places it: under the button, right edges lined up.

// Hang `panel` from `button`; `opened()` and `closed()` are called as it opens (after it is placed) and as it closes.
export function hang(panel, button, { opened, closed }) {
  const gap = () => parseFloat(getComputedStyle(panel).getPropertyValue("--space-s")) || 8;   // the space under the button (tokens.css)
  // Place the panel under the button, right edges aligned.
  function place() {
    const r = button.getBoundingClientRect();
    panel.style.top = (r.bottom + gap()) + "px";
    panel.style.right = Math.max(8, document.documentElement.clientWidth - r.right) + "px";
  }
  // On a low window the panel can reach below the screen: lift it until its bottom edge is in view (it then covers the button).
  function keepOnScreen() {
    const r = panel.getBoundingClientRect();
    const over = r.bottom + gap() - document.documentElement.clientHeight;
    if (over > 0) panel.style.top = Math.max(gap(), r.top - over) + "px";
  }
  panel.addEventListener("beforetoggle", (e) => { if (e.newState === "open") place(); });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") { keepOnScreen(); opened(); }
    else closed();
  });
  window.addEventListener("resize", () => { if (panel.matches(":popover-open")) place(); });
}
