// Tools: the ♫ sound button and the ≡ options button. Each opens its panel by itself (popovertarget: index.html; ui/soundpanel.js,
// ui/options.js); ♫ shows faint while nothing can be heard.

// Set up the tools on their element. Returns update().
export function mount(root) {
  const music = root.querySelector("#music"), options = root.querySelector("#options");
  return {
    // The labels on a language change; the sound button when it goes on or off.
    update(prev, next) {
      const t = next.pack, langChanged = !prev || prev.state.lang !== next.state.lang;
      if (langChanged) { options.title = t.options; options.setAttribute("aria-label", t.options); }
      if (langChanged || prev.music !== next.music) {
        const label = next.music ? t.music : t.music + ": " + t.off;
        music.toggleAttribute("data-off", !next.music);
        music.setAttribute("aria-label", label);
        music.title = label;
      }
    }
  };
}
