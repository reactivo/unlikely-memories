// Settings remembered on this device (language, music).
// Browser storage can be blocked (private windows, previews), so failures are ignored and the game still works.

// Save a setting.
export function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
// Read a setting (null if missing or blocked).
export function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
