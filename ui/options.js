// Options panel (≡): Restart game and Quit (back to the list of games). No language here: it is chosen on the list of games.
// "Restart game" closes the panel and asks in the story, like every other yes/no question (js/main.js; after the end, no
// question); "Quit" closes it and goes at once. Closing returns the focus to the command line.

// Set up the panel on its popover element. Returns update().
export function mount(panel, on) {
  const button = document.getElementById("options");             // the ≡ button that opens it
  const $ = (id) => panel.querySelector("#" + id);
  const restart = $("restart-game"), quit = $("quit-game");

  // Place the panel under the ≡ button, right edges lined up.
  function place() {
    const r = button.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue("--space-s")) || 8;   // the space under the button (tokens.css)
    panel.style.top = (r.bottom + gap) + "px";
    panel.style.right = Math.max(8, document.documentElement.clientWidth - r.right) + "px";
  }
  // On a low window the panel can reach below the screen: lift it until its bottom edge is in view (it then covers the button).
  function keepOnScreen() {
    const r = panel.getBoundingClientRect(), gap = parseFloat(getComputedStyle(panel).getPropertyValue("--space-s")) || 8;
    const over = r.bottom + gap - document.documentElement.clientHeight;
    if (over > 0) panel.style.top = Math.max(gap, r.top - over) + "px";
  }

  // Opening: position it, focus the first button. Closing: focus the command line.
  panel.addEventListener("beforetoggle", (e) => { if (e.newState === "open") place(); });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") { keepOnScreen(); restart.focus(); }
    else on.focus();
  });
  restart.addEventListener("click", () => { panel.hidePopover(); on.restart(); });
  quit.addEventListener("click", () => { panel.hidePopover(); on.quit(); });
  window.addEventListener("resize", () => { if (panel.matches(":popover-open")) place(); });

  return {
    // On a language change: translate the panel.
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      const t = next.pack.panel;
      $("options-title").textContent = t.title;
      restart.textContent = t.restart;
      quit.textContent = t.quit;
    }
  };
}
