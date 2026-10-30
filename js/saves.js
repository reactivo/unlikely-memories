// Saved games, kept in this browser (IndexedDB: plenty of room, unlike localStorage's ~5 MB). Per world, two saves: "auto", the
// automatic save after every turn, so leaving and coming back continues the game; and "game", the one you keep yourself
// (SAVE / LOAD), which nothing removes: a new game of that world (js/main.js restart()) only replaces the automatic one. A record is { state, transcript, savedAt };
// its key is "<world id>/<kind>". Every call takes the world's id. Storage can be blocked (private windows, previews): every
// call can fail, and the game carries on without it.

const DB = "parser", STORE = "saves";
export const AUTO = "auto";
export const GAME = "game";
const key = (id, kind) => id + "/" + kind;

// The database, as the three things this module needs of one: get, put, del. Tests swap it for a plain object (useBackend).
const idb = {
  get: (k) => run("readonly", s => s.get(k)),
  put: (k, value) => run("readwrite", s => s.put(value, k)),
  del: (k) => run("readwrite", s => s.delete(k))
};
let backend = idb;
export function useBackend(b = idb) { backend = b; }

// Open the database (created on first use).
function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Run one request against the saves and wait for it.
async function run(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode), req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => { db.close(); resolve(req.result); };
    tx.onerror = tx.onabort = () => { db.close(); reject(tx.error); };
  });
}

// Save a world's game under a kind (replacing any save with that kind).
export const put = (id, kind, record) => backend.put(key(id, kind), { ...record, savedAt: Date.now() });

// When the page is being left, the database may not finish writing before it's gone, so the same save is also
// written to localStorage, which finishes at once. Loading takes whichever of the two is newer.
const BACKUP = "parser-save-";
export function putNow(id, kind, record) {
  try { localStorage.setItem(BACKUP + key(id, kind), JSON.stringify({ ...record, savedAt: Date.now() })); } catch (e) { /* full or blocked */ }
}
const backup = (name) => { try { return JSON.parse(localStorage.getItem(BACKUP + name)) || undefined; } catch (e) { return undefined; } };

// The newer of two copies of a save (either may be missing).
const newer = (a, b) => (b && (!a || b.savedAt > a.savedAt) ? b : a);

// A world's saved game, or undefined: the newer of the database's and the backup.
export async function get(id, kind) {
  let saved;
  try { saved = await backend.get(key(id, kind)); } catch (e) { saved = undefined; }
  return newer(saved, backup(key(id, kind)));
}

// Before there were several worlds there was one automatic save and one kept save, named "auto" and "game": each becomes its
// world's (the one in its state, state.worldId), unless that world already has one, and the old names go. Safe to run every
// start: with nothing old left it does nothing.
export async function migrate() {
  for (const kind of [AUTO, GAME]) {
    let old;
    try { old = await backend.get(kind); } catch (e) { old = undefined; }
    old = newer(old, backup(kind));
    const id = old?.state?.worldId;
    if (typeof id === "string" && id && !(await backend.get(key(id, kind)).catch(() => undefined))) await backend.put(key(id, kind), old);
    try { await backend.del(kind); } catch (e) { /* nothing to remove */ }
    try { localStorage.removeItem(BACKUP + kind); } catch (e) { /* blocked */ }
  }
}
