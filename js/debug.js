// The debug panel's game side (ARCHITECTURE.md §7, "The debug panel"): what each of the panel's buttons does to the game, as
// lists of the engine's own effects, and the one way they are applied (moment). Pure: reads a state and the pack, never touches
// the page (ui/debug.js draws the panel) and never changes a state itself: the engine does. Nothing in the game imports this
// file but the panel's block at the end of js/main.js; delete both and the panel is gone.

import { step, applyChangeSet } from "./engine.js?v=0.48.4";
import { parse } from "./parser.js?v=0.48.4";
import { text, listName } from "./narrator.js?v=0.48.4";
import { ORDER, PARAMS, MOMENTS } from "./filters.js?v=0.48.4";
import { levelName } from "./map.js?v=0.48.4";
import { musicOf, sceneOf } from "./music.js?v=0.48.4";

// What you type at the prompt to open the panel. Read before the parser: never a turn, never echoed, never kept.
export const COMMAND = "/debug";
export const isDebugCommand = (raw) => typeof raw === "string" && raw.trim().toLowerCase() === COMMAND;

// ---- The one way the panel changes the game ----------------------------------------------------------------------------

const RULE = "debug_panel";   // the rule a moment runs (and removes), and the verb that calls it

// One moment of the game made of these effects, as if a rule of the opening's own had run them: the engine applies them and
// does everything a moment does after them (the echoes of what you gained and lost, conditions and timed rules, the end when
// health reaches 0, the hurt and heal reactions), so the state is as valid as after any command and saves as usual.
// It is a turn like any other (the turn count goes up, and a question waiting is dropped). How: the rule is added through a
// change set, the engine's step runs it (its last effect removes it), so nothing of it is left in the state.
// Returns step's { next, applied, refused }; a story that is over is left as it is (refused).
export function moment(state, effects, at = state.clock) {
  if (state.ended) return { next: state, applied: [], refused: [{ effect: null, reason: "the story is over" }] };
  const rule = { id: RULE, fixed: true, match: { verb: RULE }, do: [...effects, { remove: "rule", id: RULE }] };
  const added = applyChangeSet(state, { effects: [{ add: "rule", rule }] });
  if (added.refused.length) return { next: state, applied: [], refused: added.refused };
  return step(added.next, { verb: RULE, at });
}

// ---- Picture ---------------------------------------------------------------------------------------------------------------

// The filters that stay on, as the panel lists them: each name, and each tint palette on its own ("tint:cold").
export const lasting = () => ORDER.filter(n => !MOMENTS.includes(n)).flatMap(n => (PARAMS[n] ? PARAMS[n].map(p => n + ":" + p) : [n]));
// The moments: a shake, a wave.
export const moments = () => [...MOMENTS];
// A filter on or off; a moment played once.
export const filter = (spec, on = true) => [on ? { filter: spec } : { unfilter: spec }];
// The hurt or heal reaction alone (the picture's jolt or ripple and the page's flash): a health echo with no change to health,
// which the engine counts as a hurt or a heal (felt, js/engine.js). The panel doesn't tell it in the story.
export const reaction = (kind) => [{ echo: "(debug)", kind: kind === "hurt" ? "hurt" : "healed" }];

// ---- Music -----------------------------------------------------------------------------------------------------------------

// What the world's music is here, as the reader has it (js/music.js): the picks, the room's tone, colour and lines, the theme
// here (as written, a variant, or its own tune), and the reader's notes; null for a world with no music. (What is playing now,
// and the theme's turn, are the player's: ui/sound.js, debug.)
export function music(state) {
  const read = musicOf(state);
  if (!read) return null;
  const { music: m, notes } = read, sc = sceneOf(m, state.player.at);
  return { mode: m.mode, key: m.key, tempo: m.tempo, colour: sc.colour, tone: sc.tone, lines: sc.lines.length, own: sc.own,
           theme: sc.theme ? sc.theme.label : "none", notes: notes.map(n => n.text) };
}

// ---- Events ----------------------------------------------------------------------------------------------------------------

export const hurt = (n) => [{ hurt: n }];
export const heal = (n) => [{ heal: n }];
// Health set to a step from 0 to 5 (0: death, with the world's `died` ending).
export const health = (n) => [{ set: "player.health", to: n }];

// The panel's own conditions, for trying the filters and the health ticks in any world. Declared by the panel the first time one
// is started (an `add condition`, js/conditions.js), so they behave like a world's: their lines, their filters, their ticks.
// Ticks in seconds, so they run while you watch. Poison and cold kill you if nothing stops them, as Diego wants for testing
// (3 Nov 2026): they never end by themselves, and their ticks are slow enough to see coming (poison -1 every 12 s: from full
// health, death after 60 s; cold -1 every 15 s: 75 s), with the first tick 12 or 15 s after the start. The panel's own
// toggle stops them at any moment. (The first poison, 8 s a tick, killed you in 40 s, and the panel then looked alive but
// did nothing; it now says the story has ended.) A game that declared one with an older panel keeps that declaration (the
// engine never declares a condition twice): start a new game for these.
const TESTS = {
  debug_poison: {
    filters: ["tint:poison", "sway"],
    health: { every: { seconds: [12, 12] }, hurt: 1 },
    en: { starts: "Poison is working in you.", ends: "The poison has worn off.", status: "There is poison in you", says: "The poison burns inside you." },
    es: { starts: "El veneno te recorre el cuerpo.", ends: "El veneno ya no hace efecto.", status: "Tienes veneno en el cuerpo", says: "El veneno te quema por dentro." }
  },
  debug_cold: {
    filters: ["tint:cold", "vignette"],
    health: { every: { seconds: [15, 15] }, hurt: 1 },
    en: { starts: "The cold gets into you.", ends: "You are warm again.", status: "You are cold", says: "You shiver with cold." },
    es: { starts: "El frío se te mete en el cuerpo.", ends: "Vuelves a entrar en calor.", status: "Tienes frío", says: "Tiemblas de frío." }
  },
  debug_warm: {
    filters: ["tint:sepia"],
    health: { every: { seconds: [10, 10] }, heal: 1 },
    en: { starts: "A pleasant warmth spreads through you.", ends: "The warmth fades.", status: "You feel warm", says: "The warmth does you good." },
    es: { starts: "Un calor agradable te recorre el cuerpo.", ends: "El calor se va.", status: "Sientes un calor agradable", says: "El calor te sienta bien." }
  }
};
export const TEST_CONDITIONS = Object.keys(TESTS);
// The short name the panel shows for a condition: its id, the panel's own without their prefix.
const conditionLabel = (id) => (TESTS[id] ? id.slice("debug_".length) + " (test)" : id);

// A test condition's declaration in a language (English when it has no lines in that one).
export function declaration(id, lang) {
  const t = TESTS[id], words = t[lang] || t.en, { says, ...lines } = words;
  return { add: "condition", id, ...lines, filters: [...t.filters], ...(t.lasts ? { lasts: structuredClone(t.lasts) } : {}), health: { ...t.health, says } };
}
// What a test condition does, in a few words for the panel, from its declaration: "-1 health every 12 s" (", ends by itself after
// N s" for one with a `lasts`).
export function pace(id) {
  const t = TESTS[id];
  if (!t) return "";
  const h = t.health, [every] = h.every.seconds, amount = "hurt" in h ? "-" + h.hurt : "+" + h.heal;
  return amount + " health every " + every + " s" + (t.lasts ? ", ends by itself after " + t.lasts.seconds[0] + " s" : "");
}
// Every condition the panel offers: the world's own, then the panel's; each with whether you are in it now.
export function conditions(state) {
  const own = Object.keys(state.conditions || {}).filter(id => !TESTS[id]);
  return [...own, ...TEST_CONDITIONS].map(id => ({ id, label: conditionLabel(id), on: !!state.player.conditions?.[id], test: !!TESTS[id] }));
}
// Start a condition: a test one is declared first, the first time.
export function start(state, id) {
  const declare = TESTS[id] && !state.conditions?.[id] ? [declaration(id, state.lang)] : [];
  return [...declare, { start: id }];
}
// Stop a condition (nothing for a test one never declared).
export const stop = (state, id) => (state.conditions?.[id] ? [{ stop: id }] : []);

// ---- Travel ----------------------------------------------------------------------------------------------------------------

// Go to a room, whatever the way: the engine's travel (the room described, marked visited).
export const travel = (room) => [{ travel: room }];

// Every room of the world, grouped by area and level (lowest level first, then by area), each with its name in the pack's words,
// whether you are there and whether you have been. The opening is a group of its own, first.
export function rooms(state, pack) {
  const groups = new Map(), opening = state.opening?.room ?? null;
  for (const [id, r] of Object.entries(state.world.rooms)) {
    const z = r.at?.[2] ?? 0, area = r.area ?? "", key = (id === opening ? "0" : "1") + "|" + z + "|" + area;
    if (!groups.has(key)) groups.set(key, { area, z, opening: id === opening, label: (id === opening ? "opening · " : "") + area + " · " + levelName(z, pack), rooms: [] });
    groups.get(key).rooms.push({ id, name: r.name ? text(r.name, pack) : id, here: id === state.player.at, visited: (state.seen?.visited || []).includes(id) });
  }
  const order = (g) => [g.opening ? 0 : 1, g.z, g.area];
  return [...groups.values()].sort((a, b) => {
    const [x, y] = [order(a), order(b)];
    return x[0] - y[0] || x[1] - y[1] || (x[2] < y[2] ? -1 : x[2] > y[2] ? 1 : 0);
  });
}

// The rooms not visited yet (the opening left out: the map never shows it again).
export const unvisited = (state) => Object.keys(state.world.rooms).filter(id => id !== state.opening?.room && !(state.seen?.visited || []).includes(id));
// Mark every room visited, so the map shows them all: a trip through each one not visited yet and back to where you are (the
// engine's travel is the one effect that marks a room visited). Nothing when there is none.
export function visitAll(state) {
  const left = unvisited(state);
  return left.length ? [...left.map(travel).flat(), ...travel(state.player.at)] : [];
}

// ---- Inventory -------------------------------------------------------------------------------------------------------------

// Every portable thing, with its name and whether you carry it.
export function things(state, pack) {
  return Object.entries(state.world.objects).filter(([, o]) => o.portable)
    .map(([id]) => ({ id, name: listName(id, state, pack) || id, held: state.player.carrying.includes(id) }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}
// Get a thing into your hands, or drop it where you are if you carry it.
export const take = (state, id) => [{ move: id, to: state.player.carrying.includes(id) ? state.player.at : "player" }];

// ---- Time ------------------------------------------------------------------------------------------------------------------

// The clock set to a day (from 1) and an hour (0 to 23), on the hour: the engine's time effect with a set time.
export const time = (day, hour, minute = 0) => [{ time: `day ${day} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` }];

// ---- Inspect ---------------------------------------------------------------------------------------------------------------

// Which rules answered some typed words, read on the state before they ran (the words parsed and each action stepped in turn,
// on copies: nothing is changed). For the "show rule ids" line under an answer. `seen` and `which` are what the controller gave
// the parser for these words. A list of short names: a rule's id, "none" (nothing answered: no reply at all), "session: undo"
// (a command of the session, outside the story) or "parser: @unsure" (the words were not understood).
export function answeredBy(state, raw, pack, seen = "", which = null, at = state.clock) {
  const parsed = parse(raw, state, pack, seen, which);
  if (parsed.meta) return ["session: " + parsed.meta];
  if (parsed.error) return ["parser: " + (parsed.error.say ?? "?")];
  const out = [];
  let s = state;
  for (const action of parsed.actions || []) {
    const r = step(s, { ...action, at });
    out.push(r.answer?.rule ?? "none");
    s = r.next;
    if (s.ended || s.pending.question || r.applied.some(e => e.restart)) break;   // (the controller stops there too)
  }
  return out;
}
