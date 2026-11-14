// Tools: the settings button, two of them, one shown at a time: #options in the strip, a word like a tab (SETTINGS), and
// #options-tab in the phones' bottom row, the ≡ icon (until 14 November 2026 ♫ was a mute switch beside it; the sound on/off switch
// is now in the settings, ui/soundpanel.js). Each opens the settings by itself (popovertarget: index.html; ui/options.js, which holds
// the sound block). This piece only names them, in the language: the word on the strip's, a name for screen readers on the icon.

// Set up the tools on their element. Returns update().
export function mount(root) {
  const word = document.getElementById("options"), icon = document.getElementById("options-tab");   // (the second is in the tabs, outside root)
  return {
    // The label on a language change.
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      word.textContent = next.pack.options;
      icon.title = next.pack.options;
      icon.setAttribute("aria-label", next.pack.options);
    }
  };
}
