// Settings panel (≡): the language, a new game, and quit (back to the list of games).
// Choosing a language starts a new game in it and closes the panel; focus returns to the command line.
// "New game" closes the panel and asks in the story, like every other yes/no question (js/main.js); "Quit" closes it and goes at once.

// Set up the panel on its popover element. Returns update().
export function mount(panel, on) {
  const button = document.getElementById("settings");            // the ≡ button that opens it
  const radios = panel.querySelectorAll('input[name="lang"]');
  const $ = (id) => panel.querySelector("#" + id);
  const newGame = $("new-game"), quit = $("quit-game");
  let lang = null;            // language of the game in progress
  let pointerChoice = false;  // true when the last choice was made with the mouse/touch

  // Place the panel under the ≡ button, right edges lined up.
  function place() {
    const r = button.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size")) || 16;
    panel.style.top = (r.bottom + gap * 0.5) + "px";
    panel.style.right = Math.max(8, document.documentElement.clientWidth - r.right) + "px";
  }
  // If a different language is selected, switch to it (this restarts the game).
  function applyChosen() {
    const chosen = panel.querySelector('input[name="lang"]:checked');
    if (chosen && chosen.value !== lang) on.language(chosen.value);
  }

  // Opening: position it, focus the current choice. Closing: apply the choice, focus the command line.
  panel.addEventListener("beforetoggle", (e) => { if (e.newState === "open") place(); });
  panel.addEventListener("toggle", (e) => {
    if (e.newState === "open") (panel.querySelector("input:checked") || panel.querySelector("input")).focus();
    else { applyChosen(); on.focus(); }
  });
  // New game: close the panel; the question is asked in the story.
  newGame.addEventListener("click", () => { panel.hidePopover(); on.newGame(); });
  quit.addEventListener("click", () => { panel.hidePopover(); on.quit(); });
  window.addEventListener("resize", () => { if (panel.matches(":popover-open")) place(); });
  // Arrow keys only select (so you can look without restarting); a click, Enter or closing applies.
  panel.addEventListener("pointerdown", () => { pointerChoice = true; });
  panel.addEventListener("keydown", (e) => {
    pointerChoice = false;
    if (e.key === "Enter" && e.target.tagName !== "BUTTON") { e.preventDefault(); panel.hidePopover(); }   // preventDefault: or Enter re-opens it via ≡
  });
  radios.forEach(r => r.addEventListener("change", () => { if (pointerChoice) panel.hidePopover(); }));

  return {
    // On a language change: tick the right choice and translate the panel.
    update(prev, next) {
      lang = next.state.lang;
      if (prev && prev.state.lang === next.state.lang) return;
      radios.forEach(r => { r.checked = r.value === next.state.lang; });
      const t = next.pack.panel;
      panel.querySelector("#settings-title").textContent = t.title;
      panel.querySelector("#l-language").textContent = t.language;
      panel.querySelector("#l-language-note").textContent = t.languageNote;
      $("l-game").textContent = t.game;
      newGame.textContent = t.newGame;
      quit.textContent = t.quit;
    }
  };
}
