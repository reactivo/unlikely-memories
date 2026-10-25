// Game clock: how long this game has been played, in milliseconds (ARCHITECTURE.md §2).
// It runs only while the tab is visible: the controller pauses it when the tab is hidden and resumes it when
// it comes back, so the game world waits too. Only the controller reads it; the engine gets the time passed in.

// Make a clock starting at startMs (a saved game continues from its own time).
export function createClock(startMs = 0) {
  let base = startMs;          // play time banked before the current run
  let since = Date.now();      // when the current run started
  let running = true;
  const now = () => running ? base + (Date.now() - since) : base;
  return {
    now,                                                          // play time so far, in ms
    reset(ms = 0) { base = ms; since = Date.now(); },             // back to the start (or to a saved time)
    pause() { if (running) { base = now(); running = false; } },  // stop counting (tab hidden)
    resume() { if (!running) { since = Date.now(); running = true; } },   // carry on from where it stopped
    get running() { return running; }
  };
}
