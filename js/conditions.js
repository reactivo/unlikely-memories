// Conditions: something the player is in for a while (drunk, poisoned, cold, warm, keen-eared…; ARCHITECTURE.md §3,
// "Conditions"). A world declares each one once (`{ "add": "condition", "id", … }`, kept in state.conditions); a rule
// starts it (`{ "start": id }`) and stops it (`{ "stop": id }`), or it ends by itself (`lasts`, `until`). While it lasts
// it can do what its modifiers say, each a small piece of its own that a condition only refers to:
//   health:   a hurt or a heal every few turns (or seconds), through the engine's own hurt / heal (echoes, death, UNDO);
//   filters:  picture filters turned on while it lasts (the `filter` / `unfilter` effects: js/filters.js, ui/effects.js);
//   speech:   what you say comes out slurred (js/speech.js), and people answer what they have no answer for with its line;
//   movement: leaving a room, now and then you take another open way you know (js/movement.js).
// More kinds are added the same way: a field here (MODIFIERS, and js/fields.js), a module of its own, and the engine asking
// `modifiers(state, kind)` where it acts.
// The active ones are in state.player.conditions: { id: { turn?, at?, tickTurn?, tickAt? } } (made with the first, removed with the last,
// so a game saved before conditions loads unchanged). Pure: reads the state, never changes it (js/engine.js does).

import { filterProblem } from "./filters.js";

// The modifier kinds a condition may have, and the fields of each (js/fields.js lists them for the checks).
export const MODIFIERS = { health: ["every", "hurt", "heal", "says"], speech: ["slur", "answer"], movement: ["chance", "says"] };
// Everything a condition's declaration may hold.
export const CONDITION_FIELDS = ["lasts", "until", "starts", "ends", "status", "filters", ...Object.keys(MODIFIERS)];

// The ids of the conditions you are in now, in the order they started.
export const activeIds = (state) => Object.keys(state.player?.conditions || {});
// Are you in this condition now?
export const isActive = (state, id) => !!state.player?.conditions?.[id];
// What the active conditions say of one modifier kind: their declarations' fields of that kind, in the order they started.
export const modifiers = (state, kind) => activeIds(state).map(id => state.conditions?.[id]?.[kind]).filter(m => m != null);
// The filters the active conditions keep on (a condition ends: its filters go, unless another active one keeps them).
export const keptFilters = (state, except = null) => new Set(activeIds(state).filter(id => id !== except).flatMap(id => state.conditions?.[id]?.filters || []));

// What a condition does to you, from its declaration alone (a world writes nothing for it): "harmful" when its health
// ticks hurt, "good" when they heal, "neutral" with no health at all (drunk). A declaration with both a hurt and a heal is
// refused (declarationProblems), but if one came through, harmful wins: the warning colour is the safer one.
export function conditionClass(d) {
  const h = d?.health;
  if (h && typeof h === "object" && "hurt" in h) return "harmful";
  if (h && typeof h === "object" && "heal" in h) return "good";
  return "neutral";
}
// The colour of a condition's lines (INTERFACE.md §6c), as the tone its echo carries: "hurt" (red), "healed" (green) or
// "neutral" (amber). Its start, and its STATUS line, in the colour of what it does: harmful red, good green, neutral amber;
// its end the other way: a harmful or neutral one ends green (you're out of it), a good one ends amber (something good
// lost).
export function conditionTone(d, ending = false) {
  const c = conditionClass(d);
  if (ending) return c === "good" ? "neutral" : "healed";
  return c === "harmful" ? "hurt" : c === "good" ? "healed" : "neutral";
}

// A gap [min, max] in whole numbers, min no more than max, min at least 1.
const gap = (x) => Array.isArray(x) && x.length === 2 && x.every(Number.isInteger) && x[0] >= 1 && x[0] <= x[1];
// A time span: { turns: [min, max] } or { seconds: [min, max] }, exactly one.
const span = (x) => x && typeof x === "object" && !Array.isArray(x) && Object.keys(x).length === 1 && (gap(x.turns) || gap(x.seconds));
const line = (x) => (typeof x === "string" && x.trim() !== "") || (Array.isArray(x) && x.length > 0 && x.every(y => typeof y === "string" && y.trim()));

// What is wrong with a condition's declaration, as sentences (the engine refuses it; the checker repeats them as problems).
export function declarationProblems(d) {
  const why = [];
  if (!d || typeof d !== "object") return ["a condition is { id, starts, ends, status, … }"];
  for (const k of ["starts", "ends", "status"]) if (typeof d[k] !== "string" || !d[k].trim()) why.push(`${k} is a line: ${k === "starts" ? "the echo when it starts" : k === "ends" ? "the echo when it ends" : "what STATUS says of it"}`);
  if (d.lasts !== undefined && !span(d.lasts)) why.push("lasts is { turns: [min, max] } or { seconds: [min, max] }, whole numbers from 1");
  if (d.until !== undefined && !Array.isArray(d.until)) why.push("until is a list of conditions, like a rule's if");
  if (d.filters !== undefined && !Array.isArray(d.filters)) why.push("filters is a list of picture filters, like [\"sway\", \"tint:cold\"]");
  else for (const f of d.filters || []) { const no = filterProblem(f, { lasting: true }); if (no) why.push("filters: " + no); }
  const h = d.health;
  if (h !== undefined) {
    const amounts = ["hurt", "heal"].filter(k => k in (h || {}));
    if (!h || typeof h !== "object" || !span(h.every)) why.push("health needs every: { turns: [min, max] } or { seconds: [min, max] }");
    if (amounts.length !== 1) why.push("health hurts or heals: one of hurt: n or heal: n");
    else if (!(Number.isInteger(h[amounts[0]]) && h[amounts[0]] >= 1 && h[amounts[0]] <= 5)) why.push(`health ${amounts[0]} is a whole number from 1 to 5`);
    if (h && !line(h.says)) why.push("health needs says: its line, or a list of lines");
  }
  const s = d.speech;
  if (s !== undefined && (!s || typeof s !== "object" || (s.slur !== undefined && s.slur !== true) || (s.answer !== undefined && !line(s.answer)) || (s.slur === undefined && s.answer === undefined)))
    why.push("speech is { slur: true } and / or { answer: a line or a list of lines }");
  const m = d.movement;
  if (m !== undefined && (!m || typeof m !== "object" || !(typeof m.chance === "number" && m.chance > 0 && m.chance <= 1) || !line(m.says)))
    why.push("movement is { chance: more than 0, up to 1, says: a line or a list of lines }");
  return why;
}
