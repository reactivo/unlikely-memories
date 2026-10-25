// Seeded random numbers, for anything random that changes the game (ARCHITECTURE.md §4).
// The generator's whole position is one number, kept in the state (state.rng), so undo, saves, replays and
// tests always give the same results. Purely visual randomness (a flickering lamp) uses Math.random() in ui/.

// A starting position for a new game. The only call here that isn't repeatable, and it's meant to be:
// every new game gets a different seed.
export function newSeed() {
  const c = globalThis.crypto;
  return c && c.getRandomValues ? c.getRandomValues(new Uint32Array(1))[0] : (Math.random() * 2 ** 32) >>> 0;
}

// The next random number (0 up to, not including, 1) from a position. Returns [number, next position].
// Same position in, same number out. (The "mulberry32" generator: tiny, fast, good enough for a game.)
export function random(seed) {
  const next = (seed + 0x6D2B79F5) >>> 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

// A whole number from min to max (both included). Returns [number, next position].
export function between(seed, min, max) {
  const [r, next] = random(seed);
  return [min + Math.floor(r * (max - min + 1)), next];
}

// One item from a list. Returns [item, next position].
export function pick(seed, list) {
  const [i, next] = between(seed, 0, list.length - 1);
  return [list[i], next];
}
