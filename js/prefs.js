// What this device remembers (the language, the music switch).
// Browser storage can be blocked (private windows, previews), so failures are ignored and the game still works.

// Remember a value.
export function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
// Read a value back (null if missing or blocked).
export function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
