// Tools: the ♫ music button and the ≡ settings button (which opens the settings panel by itself: index.html).

// Set up the tools on their element. Returns update().
export function mount(root, on) {
  const music = root.querySelector("#music"), settings = root.querySelector("#settings");
  music.addEventListener("click", () => { on.music(); on.focus(); });
  return {
    // The labels on a language change; the music button when it's switched.
    update(prev, next) {
      const t = next.pack, langChanged = !prev || prev.state.lang !== next.state.lang;
      if (langChanged) { settings.title = t.settings; settings.setAttribute("aria-label", t.settings); }
      if (langChanged || prev.music !== next.music) {
        music.setAttribute("aria-pressed", next.music ? "true" : "false");
        music.setAttribute("aria-label", t.music);
        music.title = t.music + ": " + (next.music ? t.on : t.off);
      }
    }
  };
}
