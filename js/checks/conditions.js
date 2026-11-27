// Conditions: the ones in `if` and `waitFor` are well formed, a list is asked with `has`, an exit or a wait whose condition can never hold, and
// the conditions the player is in (declared, started, stopped, ended, cured in time) with the picture filters a rule turns on. Pure.

import { holds } from "../engine.js?v=0.74.2";
import { exitConditions } from "../exits.js?v=0.74.2";
import { moveTo } from "../time.js?v=0.74.2";
import { FIELDS, suggest, conditionProblems, ownFields } from "../fields.js?v=0.74.2";
import { filterProblem } from "../filters.js?v=0.74.2";
import { atHour, route } from "../walkthrough.js?v=0.74.2";
import { limited } from "./puzzles.js?v=0.74.2";
import { effectsOf } from "./shared.js?v=0.74.2";

// Conditions are well formed: every rule's `if` and every `waitFor`.
export function conditionShapeProblems(state, out) {
  // Conditions are well formed: every rule's `if` and every `waitFor` (`{ time, says, if? }`, on a room or a thing)
  // use the operators the engine knows, so a typo is found here and not when the player gets there.
  for (const r of state.rules) for (const why of conditionProblems(r.if)) out.add("cond.malformed", `${r.id}: ${why}`);
  for (const r of state.rules) if (r.once !== undefined && r.once !== true) out.add("rule.once-shape", `${r.id}: once is true (the rule fires at most once) or left out, not ${JSON.stringify(r.once)}`);
  for (const [id, thing] of [...Object.entries(state.world.rooms), ...Object.entries(state.world.objects)]) {
    const w = thing.waitFor;
    if (w === undefined || w === null) continue;
    if (typeof w !== "object" || Array.isArray(w)) { out.add("wait.malformed", `${id}: waitFor must be { time, says, if? }`); continue; }
    for (const k of Object.keys(w)) if (!FIELDS.waitFor.includes(k)) out.add("wait.malformed", `${id}: waitFor has no "${k}" (it is { time, says, if? })`);
    if (typeof w.time !== "string" || moveTo(w.time, 0).error) out.add("wait.malformed", `${id}: waitFor.time must be a time like "next 17:15" or "+5m"`);
    if (typeof w.says !== "string" || !w.says.trim()) out.add("wait.malformed", `${id}: waitFor.says is missing: the line said while you wait`);
    for (const why of conditionProblems(w.if)) out.add("cond.malformed", `${id}: waitFor.if: ${why}`);
  }
}

// `=` or `!=` (or a plain value) against a path that holds a list (`player.carrying`, a thing's `chain`) compares a list with a
// single value: never equal, so `!=` is always true. A list is asked with `has`; "the player does not have it" is `<id>.at != "player"`.
export function listComparisons(state, out) {
  const seen = new Set();
  const valueAt = (path) => {
    const [head, ...rest] = path.split(".");
    let v = head === "player" ? state.player : state.world.objects[head] ?? state.world.rooms[head];
    for (const k of rest) v = v?.[k];
    return v;
  };
  const test = (where, list) => {
    for (const c of [].concat(list)) {
      if (!c || typeof c !== "object") continue;
      for (const [path, want] of Object.entries(c)) {
        if (path === "any") { for (const x of [].concat(want)) test(where, x); continue; }
        if (path.includes("$") || !/^[A-Za-z_][\w-]*(\.[\w-]+)+$/.test(path)) continue;
        const ops = want !== null && typeof want === "object" && !Array.isArray(want) ? Object.keys(want) : ["="];
        if (!ops.some(op => op === "=" || op === "!=") || !Array.isArray(valueAt(path))) continue;
        const key = where + path + ops;
        if (seen.has(key)) continue;
        seen.add(key);
        out.add("cond.list-compare", `${where}: ${path} is a list, and = or != compares it with a single value (never equal, so != is always true): ask a list with has ({ "${path}": { "has": "x" } }); for "the player does not have it" say { "<id>.at": { "!=": "player" } }`);
      }
    }
  };
  const walk = (where, node) => {
    if (Array.isArray(node)) return node.forEach(n => walk(where, n));
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (k === "if" && v && typeof v === "object") test(where, v);
      walk(where, v);
    }
  };
  for (const r of state.rules) walk(r.id, r);
  for (const [id, x] of [...Object.entries(state.world.rooms), ...Object.entries(state.world.objects)]) walk(id, x);
}

// Conditions that can never hold, for the exits and the waits below. Returns never(list, here?): why a list of conditions (all
// of them must hold) can't hold, or null when it might. Cautious: only a certain "never" is said; whatever it can't tell (a
// value taken from elsewhere, a number added to) counts as possible. A condition can never hold when it:
//   - names a thing, a room or a property that doesn't exist (a typo, a thing never added), or a place that isn't one;
//   - asks for the player in another room than the one it is written for (`here`: a room's own wait);
//   - asks for a number outside the range its property was declared with (`>= 12` of a 0–10 property);
//   - needs an hour of the day that isn't any (a window like [9, 9]), or a declared property that nothing ever sets
//     to a value that passes.
export function neverHolds(state) {
  const inJson = [state.rules, state.changes], rooms = state.world.rooms, objects = state.world.objects;
  // Every value a declared property can take: what it starts as, and every literal `set` of it. Null if one is unknowable.
  const valuesOf = (id, prop) => {
    const o = objects[id] ?? rooms[id];
    const values = [o?.[prop] ?? state.properties?.[id + "." + prop]?.start ?? null];
    let unknown = false;
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      if (typeof node.set === "string" && (node.set === id + "." + prop || new RegExp(`^\\$(?:obj2?|here|in)\\.${prop}$`).test(node.set))) {
        if ("to" in node && !(typeof node.to === "string" && node.to.startsWith("$"))) values.push(node.to); else unknown = true;
      }
      Object.values(node).forEach(walk);
    };
    inJson.forEach(walk);
    return unknown ? null : values;
  };
  const text = (path, want) => `${path} ${JSON.stringify(want)}`;
  // Things and rooms a rule adds in play aren't there yet: what names them can't be judged. (Nor can a wait a rule sets later.)
  const later = new Set();
  (function find(node) {
    if (Array.isArray(node)) return node.forEach(find);
    if (!node || typeof node !== "object") return;
    if (["room", "object"].includes(node.add) && typeof node.id === "string") later.add(node.id);
    Object.values(node).forEach(find);
  })(inJson);
  // The kind of thing an id names: the engine's own ("player", "game", "time"), an object, a room, or nothing.
  const kindOf = (id) => ["player", "game", "time"].includes(id) ? id : objects[id] ? "object" : rooms[id] ? "room" : later.has(id) ? "later" : null;
  // A comparison a declared number can't satisfy, whatever sets it (a set is held to the range): [operator, number] pairs.
  const outOfRange = (d, want) => {
    const [lo, hi] = [Number.isFinite(d.min) ? d.min : -Infinity, Number.isFinite(d.max) ? d.max : Infinity];
    const tests = want !== null && typeof want === "object" ? Object.entries(want) : [["=", want]];
    return tests.some(([op, n]) => typeof n === "number" && (op === "=" ? n < lo || n > hi : op === ">" ? hi <= n : op === ">=" ? hi < n
      : op === "<" ? lo >= n : op === "<=" ? lo > n : false));
  };
  // Why this one condition ({ path: want }) can never hold, or null when it might. here: the room a room's wait is in.
  const leaf = (path, want, here) => {
    if (JSON.stringify(want)?.includes("$") || path.includes("$")) return null;
    if (path === "time.hour") {
      const holdsAt = (h) => { const s = atHour(state, h); return !s || holds(s, [{ [path]: want }]); };
      return [...Array(24).keys()].some(holdsAt) ? null : `no hour of the day fits ${text(path, want)}`;
    }
    const m = /^([A-Za-z_][\w-]*)\.([A-Za-z_][\w-]*)$/.exec(path);
    if (!m) return null;
    const [, id, prop] = m, kind = kindOf(id);
    if (kind === "later") return null;
    if (!kind) return `${path} names "${id}", which is neither a thing nor a room${suggest(id, [...Object.keys(objects), ...Object.keys(rooms), "player"])}`;
    if (path === "player.at" && typeof want === "string") {
      if (!rooms[want]) return `${text(path, want)} names a room that doesn't exist${suggest(want, Object.keys(rooms))}`;
      if (here && want !== here) return `${text(path, want)} asks for the player in ${want}, but this is ${here}`;
    }
    if (prop === "at" && kind === "object" && typeof want === "string" && want !== "player" && !rooms[want] && !objects[want])
      return `${text(path, want)} names a place that doesn't exist${suggest(want, [...Object.keys(rooms), ...Object.keys(objects)])}`;
    const d = state.properties?.[path];
    if (!d && !ownFields(kind).includes(prop)) return `${path} isn't declared, so it holds nothing${suggest(path, Object.keys(state.properties || {}))}`;
    if (!d) return null;
    if (d.type === "number" && outOfRange(d, want)) return `${text(path, want)} is outside the range ${path} was declared with`;
    const values = valuesOf(id, prop);
    if (!values) return null;
    const passes = values.some(v => {
      const s = structuredClone(state), o = s.world.objects[id] ?? s.world.rooms[id];
      if (o) o[prop] = v;
      return holds(s, [{ [path]: want }]);
    });
    return passes ? null : `nothing ever sets ${path} to a value that passes ${text(path, want)}`;
  };
  // Why a list of conditions (all of them) can never hold: one of them can't; for `any`, every item can't.
  const never = (list, here = null) => {
    for (const c of list) for (const [path, want] of Object.entries(c)) {
      if (path === "any") {
        const whys = Array.isArray(want) ? want.map(x => never(Array.isArray(x) ? x : [x], here)) : [];
        if (whys.length && whys.every(Boolean)) return whys[0];
        continue;
      }
      const why = leaf(path, want, here);
      if (why) return why;
    }
    return null;
  };
  never.laterSet = (id) => JSON.stringify(inJson).includes(`"set":"${id}.waitFor`);   // a rule that sets a wait afterwards
  return never;
}

// Exits whose condition can never hold: it needs a declared property that no rule ever sets to a value that passes, or an hour
// of the day that isn't any, or something that isn't there (see neverHolds). `if: false` is the way written as no way through
// (a one-way door): it is meant, so it is left alone.
export function neverOpen(never, state, badExits, out) {
  for (const [id, room] of Object.entries(state.world.rooms)) for (const [dir, raw] of Object.entries(room.exits || {})) {
    const list = exitConditions(raw);
    if (badExits.has(id + "." + dir) || !list?.length || list.some(c => !c || typeof c !== "object" || Array.isArray(c))) continue;
    const why = never(list);
    if (why) out.add("exit.never-opens", `${id}: the exit ${dir} can never open: ${why}`);
  }
}

// A wait (a room's or a thing's `waitFor`) that can never fire: the `if` that says when waiting is worth it can never hold
// (neverHolds), so "wait for…" would always get "nothing here worth waiting for". A room's own wait only counts while you are in
// that room. A wait with no `if`, or one that might hold, is left alone.
export function neverWaits(never, state, out) {
  for (const [id, thing] of [...Object.entries(state.world.rooms), ...Object.entries(state.world.objects)]) {
    const list = thing.waitFor?.if;
    if (!Array.isArray(list) || !list.length || list.some(c => !c || typeof c !== "object" || Array.isArray(c)) || conditionProblems(list).length || never.laterSet(id)) continue;   // (a badly written one is a problem already)
    const why = never(list, state.world.rooms[id] ? id : null);
    if (why) out.add("wait.never-fires", `${id}: the wait can never fire (waitFor.if): ${why}`);
  }
}

// ---- Conditions ---------------------------------------------------------------------------------------------------
// The conditions a world declares (`add condition`: js/conditions.js; BRIEF.md §8, "Conditions the player is in"):
//   - every `start`, `stop` and `player.conditions` names a declared one (refused in play otherwise: a problem);
//   - every one can end: it `lasts`, has an `until`, or some rule or change stops it (a problem otherwise);
//   - one that hurts as it ticks and could take all your health before it ends by itself must leave time to reach its
//     cure (a rule that stops it): best effort, in turns only. From full health it kills in (5 / hurt, rounded up) ticks, at
//     the shortest gap; the cure is reached from the room of the rule that starts it (its `player.at`) by the shortest walk
//     to the room of a rule that stops it, plus one command. Fewer turns than that, or no cure at all, is a problem; a cure whose room the checker
//     can't tell, or a condition timed in seconds, is not judged (the limit: it doesn't play the way there, nor count health
//     already lost);
//   - one declared and never started (no `start` of it anywhere) is warned of.
// And every picture filter a rule turns on or off is one there is, written as js/filters.js says (refused in play otherwise).
export function conditionChecks(state, out) {
  const declared = state.conditions || {}, started = new Map(), stopped = new Map();
  for (const { effect: e, where } of effectsOf(state)) for (const [k, seen] of [["start", started], ["stop", stopped]]) {
    if (!(k in e) || typeof e[k] !== "string" || e[k].startsWith("$")) continue;
    if (!declared[e[k]]) out.add("cond.undeclared", `${where}: ${k}s "${e[k]}", which isn't a condition the world declares${suggest(e[k], Object.keys(declared))}`);
    else (seen.get(e[k]) ?? seen.set(e[k], []).get(e[k])).push(where);
  }
  // and a consumable thing's own: eating or drinking it starts or stops one (its `starts` / `stops`; a missing one is a problem above)
  for (const [id, o] of Object.entries(state.world.objects)) if (o.consumable === true) for (const [k, seen] of [["starts", started], ["stops", stopped]])
    if (typeof o[k] === "string" && declared[o[k]]) (seen.get(o[k]) ?? seen.set(o[k], []).get(o[k])).push(id);
  for (const { effect: e, where } of effectsOf(state)) for (const k of ["filter", "unfilter"]) {
    if (!(k in e) || (typeof e[k] === "string" && e[k].startsWith("$"))) continue;
    const why = filterProblem(e[k], { off: k === "unfilter" });
    if (why) out.add("filter.invalid", `${where}: ${k}: ${why}`);
  }
  const readers = [...state.rules.map(r => [r.id, r]), ...Object.entries(state.changes || {}).map(([id, x]) => ["change " + id, x]),
                   ...Object.entries(state.world.rooms), ...Object.entries(declared).map(([id, c]) => ["condition " + id, c])];
  for (const [where, piece] of readers)
    for (const m of JSON.stringify(piece ?? null).matchAll(/"player\.conditions":\{"(?:has|=|!=)":"([^"]*)"\}/g))
      if (!declared[m[1]]) out.add("cond.asks-undeclared", `${where}: asks about the condition "${m[1]}", which the world doesn't declare${suggest(m[1], Object.keys(declared))}`);
  // The room a rule (or a change, through the rules that run it) acts in, when its `if` names one.
  const roomOf = (where) => {
    const o = state.world.objects[where];                      // a consumable thing: where it lies, or where its source is
    if (o) return [o.at, state.world.objects[o.from]?.at].find(x => state.world.rooms[x]) ?? null;
    const r = state.rules.find(x => x.id === where), name = String(where).replace(/^change /, "");
    const at = r ? (r.if || []).find(c => typeof c?.["player.at"] === "string")?.["player.at"] : undefined;
    if (at && state.world.rooms[at]) return at;
    if (!r && state.changes?.[name]) for (const x of state.rules) if (JSON.stringify(x.do).includes(`"change":"${name}"`)) { const a = roomOf(x.id); if (a) return a; }
    return null;
  };
  for (const [id, c] of Object.entries(declared)) {
    const cures = stopped.get(id) || [];
    if (!c.lasts && !Array.isArray(c.until) && !cures.length) out.add("cond.never-ends", `condition ${id}: nothing ends it: give it lasts (turns or seconds), an until, or a rule that stops it ({ "stop": "${id}" })`);
    if (!started.has(id)) out.add("cond.never-started", `condition ${id}: declared, but nothing starts it ({ "start": "${id}" })`);
    const h = c.health;
    // A condition that heals as it ticks heals as often as it can be started: like a heal, it is limited (BRIEF.md §5).
    if (h && "heal" in h) for (const where of started.get(id) || []) {
      const r = state.rules.find(x => x.id === where);
      if (r && !limited(r, state)) out.add("cond.heal-repeatable", `condition ${id}: it heals as it ticks, and ${where} can start it again and again, so the player can heal for ever; make the rule once, or have it use something up`);
    }
    if (!h || !("hurt" in h) || !h.every?.turns || !Number.isInteger(h.hurt) || h.hurt < 1) continue;
    const ticks = Math.ceil(5 / h.hurt), kills = ticks * h.every.turns[0];   // the fewest turns in which it can take all of you
    if (c.lasts?.turns && Math.floor(c.lasts.turns[1] / h.every.turns[0]) < ticks) continue;   // it ends by itself first
    if (!cures.length && !Array.isArray(c.until)) { out.add("cond.hurt-no-cure", `condition ${id}: it hurts as it ticks and can take all your health in ${kills} turns, and nothing stops it in time`); continue; }
    const to = cures.map(roomOf).filter(Boolean);
    for (const where of started.get(id) || []) {
      const from = roomOf(where);
      if (!from || !to.length) continue;
      const walk = Math.min(...to.map(t => (t === from ? [] : route(state, from, t))?.length ?? Infinity));
      if (walk + 1 >= kills) out.add("cond.hurt-no-cure", `condition ${id}: started by ${where} in ${from}, it can take all your health in ${kills} turns, but its cure is ${walk === Infinity ? "out of reach" : walk + 1 + " turns away"}`);
    }
  }
}
