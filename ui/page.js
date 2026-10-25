// Page-wide details that belong to no single piece: the page language, which view is shown (the list of games or the
// game: css/layout.css reads data-view), whether the tab is visible (the game clock pauses while it's hidden), and when
// the page is left (a waiting save is written).

// Set up on the document. Returns update() and show().
export function mount(root, on) {
  root.addEventListener("visibilitychange", () => on.visible(!root.hidden));
  window.addEventListener("pagehide", () => on.leaving());     // reload, closed tab: save what's waiting
  return {
    // Show one view, "home" or "game", in a language: an open panel (map, settings) closes with the game.
    show(view, lang) {
      root.querySelectorAll(":popover-open").forEach(p => p.hidePopover());
      root.documentElement.dataset.view = view;
      root.documentElement.lang = lang;
    },
    // On a language change: <html lang> (for screen readers and hyphenation).
    update(prev, next) {
      if (prev && prev.state.lang === next.state.lang) return;
      root.documentElement.lang = next.state.lang;
    }
  };
}
