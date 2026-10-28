// Command line: shows what you type, sends it on Enter, keeps itself focused (on a computer; see focus()). (It's always on screen: layout.css.)
// The real <input> is invisible on top; the visible line (pixel font + block cursor) mirrors it.
// At the start of a story, a hint sits at the right end of the line ("Type <HELP> for ideas."), fading in once the
// room's description has appeared; it steps aside while you type, and goes with your command. After two minutes with
// no command and nothing typed (IDLE_HINT), it fades in again.

import { makeHistory } from "./history.js";

const IDLE_HINT = 120000;   // ms with no command and nothing typed before the hint comes back

// Earlier commands (↑ / ↓): the commands run, typed or clicked (js/main.js runCommand calls remember()), kept for this visit to the page (ui/history.js). This module
// is created once, so they carry across a new game and a language change; they are never saved.

// Set up the command line on its <form>. Returns update(), focus(), remember(), typing(), hint() and clearHint().
export function mount(root, on) {
  const cmd = root.querySelector("#cmd"), typed = root.querySelector("#typed"), hint = root.querySelector("#prompt-hint");
  let hinting = false;                                             // a hint is showing, until your next command
  let idle = 0;                                                    // the timer that brings the hint back
  const showHint = () => { hint.hidden = !hinting || cmd.value !== ""; };
  // Fade the hint in (again), after `delay` ms.
  function fadeIn(delay) {
    hint.style.animationDelay = delay + "ms";
    hint.classList.remove("in"); void hint.offsetWidth; hint.classList.add("in");
    hinting = true; showHint();
  }
  // Start counting again: two minutes from now with nothing typed or sent, the hint comes back (if there is one).
  function rest() {
    clearTimeout(idle);
    idle = setTimeout(() => { if (!hinting && cmd.value === "" && hint.childNodes.length) fadeIn(0); }, IDLE_HINT);
  }

  // Touch screens (a phone or tablet: no hover, a coarse pointer; asked of the device, not of the window's width):
  // focusing the input opens the on-screen keyboard, which covers half the screen. So on touch the game never focuses
  // the line by itself (not on a tap in the story or the picture, not after a button, a panel or a new game): the
  // keyboard opens only when the player taps the command line, and the input itself takes that tap.
  const touch = window.matchMedia("(hover: none) and (pointer: coarse)");

  // Focus the command line (without scrolling). Does nothing on touch screens; every caller, in this file and in
  // js/main.js and the panels, goes through here, so this is the one place that decides.
  function focus() {
    if (touch.matches) return;
    if (document.activeElement !== cmd) cmd.focus({ preventScroll: true });
  }

  // Keep the command line focused (computers only; on touch, focus() does nothing): when the window/tab comes back,
  // on clicks (unless selecting text or clicking a button/link/panel), and on typing keys pressed while something
  // else has focus.
  window.addEventListener("focus", focus);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) focus(); });
  document.addEventListener("click", (e) => {
    if (e.target.closest("button, select, a, [popover]")) return;
    if (String(window.getSelection && window.getSelection()).length) return;
    focus();
  });
  // On touch, a tap on the visible line (the ">", the text, the empty space, the hint's words) opens the keyboard.
  // The invisible input lies over the line and takes most taps itself; this covers what lies above it (the hint).
  // A tap on the hint's <HELP> button runs the command and leaves the keyboard shut.
  root.addEventListener("click", (e) => {
    if (!touch.matches || e.target.closest("button, a")) return;
    cmd.focus();   // (letting the browser scroll it into view, above the keyboard)
  });
  // While you type on a touch screen, a tap on a button in the story or on the line (<HELP>) keeps the keyboard open: the tap
  // would take focus from the line, the keyboard closing changed the page under the finger, and the click was lost (Diego's
  // iPhone, 28 Oct 2026).
  document.addEventListener("mousedown", (e) => {
    if (touch.matches && document.activeElement === cmd && e.target.closest(".log button, .prompt button")) e.preventDefault();
  });
  document.addEventListener("keydown", (e) => {
    if (e.target === cmd || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest("[popover]")) return;
    if (e.target.closest && e.target.closest("button, select") && (e.key === "Enter" || e.key === " " || e.key === "Tab")) return;
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") focus();
  });
  // Mirror the typed text into the visible line.
  cmd.addEventListener("input", () => { earlier.edited(); typed.textContent = cmd.value; showHint(); rest(); });
  // ↑ / ↓ step through earlier commands. These are handled here and not in ui/keys.js on purpose: that table acts
  // once on key release and ignores held keys, but stepping back quickly by holding ↑ is normal, so each press and
  // each repeat acts at once. Still the command line's own keys: never with Cmd/Ctrl/Alt/Shift, nor while a panel or
  // the settings are open. (Phones have no arrow keys; nothing is drawn for them.)
  const earlier = makeHistory();
  cmd.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || document.querySelector(":popover-open")) return;
    e.preventDefault();                                            // (the arrow would move the cursor to an end)
    const line = e.key === "ArrowUp" ? earlier.back(cmd.value) : earlier.forward();
    if (line === null) return;
    cmd.value = line; typed.textContent = line;
    cmd.setSelectionRange(line.length, line.length);               // the cursor at the end of the recalled line
    showHint(); rest();
  });
  // Enter (or "send" on a phone) sends the command. While the game isn't taking input, the text stays.
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!on.canSend()) return;
    const raw = cmd.value; cmd.value = ""; typed.textContent = "";
    showHint();
    on.submit(raw);
  });

  return {
    // On a language change: the input's label for screen readers.
    update(prev, next) {
      if (!prev || prev.state.lang !== next.state.lang) cmd.setAttribute("aria-label", next.pack.a11y.command);
    },
    focus,
    // A command is being run, typed or clicked (js/main.js runCommand): remember it for ↑ / ↓.
    remember(line) { earlier.add(line); },
    // Is something typed on the line? (The world waits while you type.)
    typing() { return cmd.value !== ""; },
    // The hint at the right end of the line (story text with its markers, ready built), fading in after `delay` ms;
    // show = false: only kept, for when you've been idle (a loaded game).
    hint(content, delay = 0, show = true) {
      hint.replaceChildren(content);
      if (show) fadeIn(delay); else { hinting = false; showHint(); }
      rest();
    },
    // The hint steps aside (a command, a loaded game), and the idle count starts again.
    clearHint() { hinting = false; showHint(); rest(); }
  };
}
