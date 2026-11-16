// Options panel (≡): two blocks, SOUND (the sliders, mounted by ui/soundpanel.js) and GAME: Restart game and Quit (back to the
// list of games). No title of its own, no language here: it is chosen on the list of games.
// "Restart game" closes the panel and asks in the story, like every other yes/no question (js/main.js; after the end, no
// question); "Quit" closes it and goes at once. Opening focuses the panel itself (tabindex -1: no ring; Tab then goes to the
// sound switch, Esc closes it; until 15 November 2026 the Music slider, which showed the keyboard ring on a phone); closing
// returns the focus to the command line.

import { hang } from "./popup.js?v=0.60.1";

// Set up the panel on its popover element. Returns update().
export function mount(panel, on) {
  const buttons = [document.getElementById("options"), document.getElementById("options-tab")];   // the ≡ buttons that open it (the strip's, the phones')
  const $ = (id) => panel.querySelector("#" + id);
  const restart = $("restart-game"), quit = $("quit-game");

  // Opening: focus the panel. Closing: focus the command line.
  // While open, both settings buttons say so (aria-expanded: yellow, as an open tab; ui/tools.css).
  const mark = (open) => { for (const b of buttons) b.setAttribute("aria-expanded", String(open)); };
  panel.addEventListener("beforetoggle", (e) => mark(e.newState === "open"));   // at once, as the phones' tabs (ui/tabs.js): no flicker
  hang(panel, buttons, { opened: () => { mark(true); panel.focus({ preventScroll: true }); }, closed: () => { mark(false); on.focus(); } });
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
