// Tools: the ♫ sound button and the ≡ options button. ♫ opens nothing: a tap mutes or unmutes everything (what the old Mute all
// button did; the controller's soundToggled, js/main.js), and the tap that unmutes starts the audio (ui/sound.js). It shows faint
// while nothing can be heard, and says so (its name is what a tap does). ≡ opens the options by itself (popovertarget:
// index.html; ui/options.js, which holds the sound sliders: ui/soundpanel.js).

// Set up the tools on their element. Returns update().
export function mount(root, on) {
  const music = root.querySelector("#music"), options = root.querySelector("#options");
  music.addEventListener("click", () => on.soundToggled());
  return {
    // The labels on a language change; the sound button when it goes on or off: its name says what a tap does.
    update(prev, next) {
      const t = next.pack, langChanged = !prev || prev.state.lang !== next.state.lang;
      if (langChanged) { options.title = t.options; options.setAttribute("aria-label", t.options); }
      if (langChanged || prev.music !== next.music) {
        const label = next.music ? t.sound.mute : t.sound.unmute;
        music.toggleAttribute("data-off", !next.music);
        music.setAttribute("aria-label", label);
        music.title = label;
      }
    }
  };
}
