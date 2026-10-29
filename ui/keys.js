// Keyboard shortcuts: one table of keys and what they do, for the whole page. Each shortcut:
//   { key, when, press, release, cancel }
//   key      the key's name, as the browser gives it ("ArrowUp", "Escape", "PageDown")
//   when()   whether it applies right now
//   press()  shown while the key is down (optional)
//   release() done when the key is let go: the action happens on release, like a button
//   cancel() the press is dropped without acting (the window lost focus while the key was down)
// Held keys don't repeat, and a key with Cmd, Ctrl or Alt is never a shortcut (the browser's own stay free).
// Nothing applies while a panel or the options are open (Esc closes those itself), or while focus is on a button.
// The command line has the focus nearly always, so letter keys are typing and the arrows move its cursor: never
// shortcuts. What else the command line may do with keys one day (earlier commands, completing a word) is in
// INTERFACE.md §6b. Now: Esc, a new game (js/main.js).

// Set up on the document. Returns add() (for the controller to register shortcuts) and update().
export function mount(doc) {
  const shortcuts = [];
  let down = null;                                  // the shortcut whose key is down now

  const idle = (e) => !e.metaKey && !e.ctrlKey && !e.altKey && !doc.querySelector(":popover-open");
  doc.addEventListener("keydown", (e) => {
    if (down && e.key === down.key) { e.preventDefault(); return; }          // held: no repeats
    if (!idle(e) || e.target.closest?.("button, select, [popover]")) return;
    const s = shortcuts.find(x => x.key === e.key && (!x.when || x.when()));
    if (!s) return;
    e.preventDefault();                              // (an arrow would otherwise move the cursor or scroll)
    down = s; s.press?.();
  });
  doc.addEventListener("keyup", (e) => {
    if (!down || e.key !== down.key) return;
    const s = down; down = null;
    e.preventDefault();
    s.release?.();
  });
  const drop = () => { if (down) { const s = down; down = null; s.cancel?.(); } };
  window.addEventListener("blur", drop);
  doc.addEventListener("visibilitychange", () => { if (doc.hidden) drop(); });

  return {
    add(shortcut) { shortcuts.push(shortcut); },
    update() {}                                      // nothing drawn from the state
  };
}
