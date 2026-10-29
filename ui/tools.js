// Tools: the ♫ music button and the ≡ options button (which opens the options panel by itself: index.html).

// Set up the tools on their element. Returns update().
export function mount(root, on) {
  const music = root.querySelector("#music"), options = root.querySelector("#options");
  music.addEventListener("click", () => { on.music(); on.focus(); });
  return {
    // The labels on a language change; the music button when it's switched.
    update(prev, next) {
      const t = next.pack, langChanged = !prev || prev.state.lang !== next.state.lang;
      if (langChanged) { options.title = t.options; options.setAttribute("aria-label", t.options); }
      if (langChanged || prev.music !== next.music) {
        music.setAttribute("aria-pressed", next.music ? "true" : "false");
        music.setAttribute("aria-label", t.music);
        music.title = t.music + ": " + (next.music ? t.on : t.off);
      }
    }
  };
}
