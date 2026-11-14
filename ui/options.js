// Options panel (≡): two blocks, SOUND (the sliders, mounted by ui/soundpanel.js) and GAME: Restart game and Quit (back to the
// list of games). No title of its own, no language here: it is chosen on the list of games.
// "Restart game" closes the panel and asks in the story, like every other yes/no question (js/main.js; after the end, no
// question); "Quit" closes it and goes at once. Opening focuses the panel's first control (the Music slider); closing returns
// the focus to the command line.

import { hang } from "./popup.js?v=0.50.3";

// Set up the panel on its popover element. Returns update().
export function mount(panel, on) {
  const button = document.getElementById("options");             // the ≡ button that opens it
  const $ = (id) => panel.querySelector("#" + id);
  const restart = $("restart-game"), quit = $("quit-game");

  // Opening: focus the first control. Closing: focus the command line.
  hang(panel, button, { opened: () => panel.querySelector("input, button").focus(), closed: () => on.focus() });
  restart.addEventListener("click", () => { panel.hidePopover(); on.restart(); });
  quit.addEventListener("click", () => { panel.hidePopover(); on.quit(); });

  return {
    // On a language change: translate the panel's name and its GAME block.
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      const t = next.pack.panel;
      panel.setAttribute("aria-label", next.pack.options);
      $("game-title").textContent = t.game;
      restart.textContent = t.restart;
      quit.textContent = t.quit;
    }
  };
}
