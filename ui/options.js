// Options panel (≡): Restart game and Quit (back to the list of games). No language here: it is chosen on the list of games.
// "Restart game" closes the panel and asks in the story, like every other yes/no question (js/main.js; after the end, no
// question); "Quit" closes it and goes at once. Closing returns the focus to the command line.

import { hang } from "./popup.js?v=0.49.3";

// Set up the panel on its popover element. Returns update().
export function mount(panel, on) {
  const button = document.getElementById("options");             // the ≡ button that opens it
  const $ = (id) => panel.querySelector("#" + id);
  const restart = $("restart-game"), quit = $("quit-game");

  // Opening: focus the first button. Closing: focus the command line.
  hang(panel, button, { opened: () => restart.focus(), closed: () => on.focus() });
  restart.addEventListener("click", () => { panel.hidePopover(); on.restart(); });
  quit.addEventListener("click", () => { panel.hidePopover(); on.quit(); });

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
