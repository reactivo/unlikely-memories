// Moments: the sound's pure readers of the state (MUSIC.md §5–§7; ARCHITECTURE.md §7, "Music"). They say what the music and the sounds
// should do about the world and have nothing to do with the AudioContext: `nightAt` (the world's clock), `unwellAt` (health),
// `effectsOf` (the picture's filters the music follows), `soundsOf` (a moment's list read into plain terms: the sounds), and the
// lists of the sounds and materials a debug panel or a bench can try. The piece that plays them is ui/sound.js. Pure.

import S from "../content/music.js";
import { parts } from "../js/time.js";
import { parseFilter } from "../js/filters.js";

// Night by the world's clock (ms since day 1, 00:00): from `from` o'clock to `to` (through midnight when from > to).
export function nightAt(ms) {
  const h = parts(ms).hour, { from, to } = S.reactions.night;
  return from > to ? h >= from || h < to : h >= from && h < to;
}

// How unwell the player is, from their health (S.reactions.unwell): 0 well, 1 unwell (at `at` and below), 2 worse (at `worse.at`).
export function unwellAt(health) {
  const U = S.reactions.unwell;
  return health <= U.worse.at ? 2 : health <= U.at ? 1 : 0;
}
// What the music does for the picture's filters on (S.reactions.filters): { wobble: true / false, echo: … }, each of the table's
// effects, on when a filter that maps to it is on ("tint:cold" is read as "tint").
export function effectsOf(filters = []) {
  const on = new Set(filters.map(f => S.reactions.filters[parseFilter(f).name]).filter(Boolean));
  return Object.fromEntries(Object.values(S.reactions.filters).map(e => [e, on.has(e)]));
}

// What a moment's list sounds like, in plain terms (docs/sound/PLAN.md, build 1: one entry a sound, in the list's order):
//   get / lose       a thing you now have, or no longer have (its `gained` / `lost` echo), with its material
//   eat / drink      a consumable thing gone out of play this moment (the engine's EAT and DRINK move it to nowhere; held, its
//                    `lost` echo is this, not a put down): drink when it has a `drink` line and no `eat` line, else eat
//   hurt / heal      a health echo: a hurt with its weight, the hit (how much health it took, from the health before the moment,
//                    `was`, echo by echo); a heal, at full health too (the green flash)
//   down / up / sideways   a condition's echo, by its colour (its `tone`: hurt, healed, neutral; js/conditions.js)
//   open / close / unlock  a door (a thing with `door`): set open or shut, or unlocked, with its material
//   lid              a container opened (set open, or unlocked), with its material
//   rattle           a locked door refusing: one of its own lines said (`shut`, its lock's `says`), or the stock "locked" with it
//                    in the room
//   solved           a puzzle solved (the engine's mark, never an ending's)
// `now` is the game after the moment, `was` before it (both read only); a thing's material is its own word, as written.
export function soundsOf(applied, now, was = now) {
  const things = now.world.objects, old = was.world.objects;
  const thing = (id) => things[id] ?? old[id] ?? {};
  const material = (id) => thing(id).material;
  const gone = new Set(applied.filter(e => "move" in e && e.to === null && thing(e.move).consumable === true).map(e => e.move));
  const lockedDoors = Object.entries(things).filter(([, o]) => o.door != null && o.locked === true && o.at === now.player.at);
  const refused = (e) => lockedDoors.find(([id, o]) => e.say === o.shut || e.say === o.lock?.says || (e.say === "@locked" && (!e.things || e.things.includes(id))));
  const out = [];
  let health = was.player.health;
  const level = (e) => (typeof e.level === "number" ? e.level : health);   // (a health echo's level: where it lands)
  for (const e of applied) {
    const openedId = typeof e.set === "string" ? e.set.split(".")[0] : null;   // (`set: "<thing>.open"`)
    const refusing = "say" in e ? refused(e) : undefined;                      // (the locked door that said it)
    if ("echo" in e) {
      if (e.kind === "gained") out.push({ kind: "get", material: material(e.thing) });
      else if (e.kind === "lost" && !gone.has(e.thing)) out.push({ kind: "lose", material: material(e.thing) });
      else if (e.kind === "hurt") { const to = level(e); out.push({ kind: "hurt", weight: Math.max(1, health - to) }); health = to; }
      else if (e.kind === "healed") { out.push({ kind: "heal" }); health = level(e); }
      else if (e.kind === "condition") out.push({ kind: e.tone === "hurt" ? "down" : e.tone === "healed" ? "up" : "sideways" });
    } else if ("move" in e && gone.has(e.move)) {
      const o = thing(e.move);
      out.push({ kind: o.drink != null && o.eat == null ? "drink" : "eat" });
    } else if ("unlock" in e) {
      const o = thing(e.unlock);
      if (o.door != null) out.push({ kind: "unlock", material: o.material });
      else if (o.container) out.push({ kind: "lid", material: o.material });
    } else if (typeof e.set === "string" && /^[^.]+\.open$/.test(e.set) && things[openedId]) {
      const o = things[openedId];
      if (o.door != null && typeof e.to === "boolean") out.push({ kind: e.to ? "open" : "close", material: o.material });
      else if (o.container && e.to === true) out.push({ kind: "lid", material: o.material });
    } else if (refusing) out.push({ kind: "rattle", material: thing(refusing[0]).material });
    else if ("solved" in e) out.push({ kind: "solved" });
  }
  return out;
}

// The sounds a debug panel or a bench can try, each kind of the spec's table, and the materials.
export const SOUND_KINDS = Object.keys(S.sounds.moments);
export const MATERIALS = Object.keys(S.sounds.materials).filter(m => m !== "generic");
