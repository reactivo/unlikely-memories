// Picture effects, in one place so they're easy to change or add to (ART-DIRECTION.md §6). Purely visual: they
// never touch the game state, so their randomness is plain Math.random() (ARCHITECTURE.md §4).
// (How one picture changes into another, a room's or an ending's, is not here: it is all in ui/transitions.js.)

// Palette cycling styles: which step of its colour list a cycle shows at a moment. Each gets the cycle's
// own fields (from the picture data), its own little memory (`mem`), the time since it started and now.
// Returns a step number; the pixel's colour moves that many places along the list.
export const CYCLES = {
  // Every pixel steps along the colours, in a loop: water, conveyor belts, flowing light.
  rotate: (c, mem, elapsed) => Math.floor(elapsed / c.ms) % c.colors.length,
  // Forward then back: breathing glows, pulsing neon.
  pingpong: (c, mem, elapsed) => {
    const n = c.colors.length, k = Math.floor(elapsed / c.ms) % (2 * (n - 1));
    return k < n ? k : 2 * (n - 1) - k;
  },
  // Switches between two colours on a fixed beat: a camera's light, an alarm.
  blink: (c, mem, elapsed) => Math.floor(elapsed / c.ms) % 2,
  // Mostly steady; now and then (a random wait within c.ms = [min, max]) it jumps to another colour for a
  // moment, sometimes twice: faulty lamps, candlelight.
  flicker: (c, mem, elapsed, now) => {
    if (mem.until === undefined) { mem.until = now + between(c.ms[0], c.ms[1]); mem.step = 0; }
    if (now >= mem.until) {
      if (mem.step === 0) { mem.step = 1 + Math.floor(Math.random() * (c.colors.length - 1)); mem.until = now + between(40, 140); }
      else { mem.step = 0; mem.until = now + (Math.random() < 0.3 ? between(40, 120) : between(c.ms[0], c.ms[1])); }
    }
    return mem.step;
  }
};

const between = (min, max) => min + Math.random() * (max - min);
