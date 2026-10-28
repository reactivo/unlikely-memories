// Narrator: turns the effects the engine applied into story paragraphs (ARCHITECTURE.md §7).
// It voices `say` lines and describes rooms and what you carry, using the language pack's texts. Effects
// without words of their own (a move, a set) say nothing: the rule that caused them says what happened.
// Pure: never touches the page or the state.

import { worldTime, parts } from "./time.js";
import { PROPERTY_WORD, propertyText } from "./fields.js";

// Story paragraphs for these applied effects: [{ text, style?, img? }]. state = the state after them.
export function tell(applied, state, pack) {
  const out = [];
  for (const e of applied) {
    if (e.say) {
      // name: a thing, named in this language; things: several, with their gender and number, in order
      const arg = e.things ? e.things.map(id => listName(id, state, pack)) : e.name ? listName(e.name, state, pack) : e.arg;
      const who = e.things ? e.things.map(id => whoOf(state.world.objects[id])) : e.who;
      let said = timed(text(e.say, pack, arg, e.pick, e.prev, who), state, pack, e.at, e.vals);
      if (e.confirm) said += " " + text("@yesNo", pack);                  // a question: "… <YES> / <NO>", always
      // A blank line in a text starts a new paragraph (HELP's groups, LOAD's details), spaced like any other.
      String(said).split(/\n\s*\n/).forEach((part, i) =>
        out.push(clean({ text: part, style: e.style, img: i === 0 ? e.img : undefined })));
    }
    // An echo of what just happened to you (INTERFACE.md §6c): its own short line, styled by its kind.
    if (e.echo) out.push({ text: timed(text(e.echo, pack), state, pack, e.at), style: "echo text-echo echo-" + e.kind });
    if (e.hint) out.push({ text: timed(pack.framed(text(e.hint, pack), hintText(e, pack)), state, pack) });   // the world's frame, then the hint
    if (e.describe === "inventory") out.push({ text: inventory(state, pack) });
    else if (e.describe === "time") out.push({ text: timeNow(state, pack, e.at) });
    else if (e.describe === "status") out.push({ text: statusNow(state, pack) });
    else if (e.describe) out.push(...describe(state, e.describe, pack));
  }
  return out;
}

// A thing's gender and number as the pack wants them (Spanish agreement): { g, pl } from its `words`, or nothing.
function whoOf(o) {
  const w = o?.words;
  return w && (w.g || w.pl) ? clean({ g: w.g, pl: w.pl }) : undefined;
}

// What a hint says (the opening's hint frame goes round it, pack.framed): the world's line, or the commands that solve
// it ("`Wait for the train`, then `board train`"), or that there's nothing left to find.
function hintText(e, pack) {
  if (e.none) return text("@hintNone", pack);
  if (e.commands) return text("@hintDo", pack, e.commands.map(c => solveCommand(c, pack)).map(c => "`" + c.charAt(0).toUpperCase() + c.slice(1) + "`"));
  return text(e.text, pack);
}

// A command that solves a puzzle, in this game's language. It may start with a verb in braces, "{take} tin": the pack's
// first word for that verb stands in its place ("coge tin"). "{enter+} door" puts the word the verb takes before its
// object after it too, if the pack has one (`grammar.verbPreps`: Spanish "entrar en puerta"; English none: "enter door").
// Any other command is returned as it is.
export function solveCommand(command, pack) {
  return String(command).replace(/^\{(\w+)(\+?)\}/, (whole, verb, plus) => {
    const word = pack.words.verbs[verb]?.[0], prep = plus && pack.words.grammar?.verbPreps?.[verb];
    return word === undefined ? whole : prep ? word + " " + prep : word;
  });
}

// A room's description: its paragraphs, then a line for each object lying there that has one (`here`).
export function describe(state, roomId, pack) {
  const room = state.world.rooms[roomId];
  const lines = room.describe.map(k => ({ text: timed(text(k, pack), state, pack) }));
  for (const o of Object.values(state.world.objects)) if (o.at === roomId && o.here) lines.push({ text: timed(text(o.here, pack), state, pack) });
  const inside = state.player.in && state.world.objects[state.player.in];        // you're in or on something here
  if (inside && roomId === state.player.at)
    lines.push({ text: text(inside.enterable === "on" ? "@youAreOn" : "@youAreIn", pack, listName(state.player.in, state, pack)) });
  return lines;
}

// What you carry, from the state: "You are carrying: tin of mints." (names from the objects).
export function inventory(state, pack) {
  const names = state.player.carrying.map(id => listName(id, state, pack));
  if (!names.length) return text("@invEmpty", pack);
  const list = names.length > 1 ? names.slice(0, -1).join(", ") + (pack.and ?? pack.or) + names.at(-1) : names[0];
  return text("@invList", pack, list);
}

// TIME: the world's weekday (if it has one), time and day of your adventure, worded by the pack.
export function timeNow(state, pack, at = worldTime(state)) {
  const p = parts(at, state.time?.weekday), pad = (n) => String(n).padStart(2, "0");
  return text("@timeNow", pack, { weekday: p.weekday ? pack.weekdays[p.weekday] : null, time: pad(p.hour) + ":" + pad(p.minute), day: p.day });
}

// STATUS: your mood (the world's phrase for its tension, or the pack's) and your health, in four bands.
export function statusNow(state, pack) {
  const h = state.player.health;
  const health = h >= 5 ? "good" : h >= 4 ? "scratched" : h >= 3 ? "hurt" : "badly";   // (health 5 to 0)
  const mood = String(moodOf(state, pack) ?? "");
  return text("@statusNow", pack, { mood: mood.charAt(0).toLowerCase() + mood.slice(1), health });
}

// An object's name: the pack's, else the world's own (literal text, or an "@key").
// A name inside a sentence ("You are carrying: tin of mints."): lower case first letter only if the language does
// that (grammar.lowerNames; not German, whose nouns keep their capital), so "Photo of Madrid" keeps "Madrid".
export function listName(id, state, pack) {
  const n = nameOf(id, state, pack);
  return pack.words?.grammar?.lowerNames ? n.charAt(0).toLowerCase() + n.slice(1) : n;
}

// The world's time in a text: [time] ("a quarter past five", worded by the pack), [day] (3), [weekday] ("Sunday");
// and [way], the way you came in from the opening ("the revolving door": the pack's `the`, then the thing's name).
// And any declared property, [thing.property] ([player.name], [bell.rung]): its number or string, nothing for a boolean
// or one that holds nothing yet; a name that isn't declared stays as written (js/fields.js, "Words from the state").
// Square brackets, because {…} marks objects.
// `at`: the world time it was said at (a line said before a jump in the same turn keeps its own time); `vals`: the
// properties it names as they were when it was said (the engine keeps them with the line, as it keeps the time).
export function timed(t, state, pack, at = worldTime(state), vals = undefined) {
  if (typeof t !== "string" || !t.includes("[")) return t;
  const p = parts(at, state.time?.weekday);
  return t.replace(/\[time\]/g, () => pack.timeWords(p))
          .replace(/\[day\]/g, String(p.day))
          .replace(/\[weekday\]/g, () => (p.weekday ? pack.weekdays[p.weekday] : ""))
          .replace(/\[way\]/g, () => wayName(state, pack))
          .replace(PROPERTY_WORD, (m, id, prop) => vals && (id + "." + prop) in vals ? vals[id + "." + prop] : propertyText(state, id, prop) ?? m);
}

// The way you came in from the opening, named in a sentence ("the revolving door"); nothing if there isn't one.
function wayName(state, pack) {
  const id = state.opening?.way, o = id && state.world.objects[id];
  return o ? pack.the(listName(id, state, pack), o) : "";
}

export function nameOf(id, state, pack) {
  const p = pack.items?.[id] || pack.objects?.[id], o = state.world.objects[id];
  return p?.name ?? (o?.name ? text(o.name, pack) : id);
}

// The mood: the world's phrase for the current band of tension, else the pack's fixed one. Not shown on screen
// (24 October 2026): the story carries it, and STATUS says it (statusNow).
export function moodOf(state, pack) {
  const band = (state.moods || []).find(m => state.tension < m.below) || (state.moods || []).at(-1);
  return band ? text(band.text, pack) : pack.mood;
}

// A room's name for the title bar: its own, else the pack's.
export function placeOf(state, pack) {
  const room = state.world.rooms[state.player.at];
  return room?.name ? text(room.name, pack) : pack.place;
}

// A text: "@key" (or "@key.0" for an item in a list) is looked up in the pack, anything else is used as it is.
// A pack entry can be a function of one value (e.g. your name) and, for a line that agrees with the thing it's about
// (Spanish), of that thing's gender and number: `who` ({ g, pl }, from the engine). A list of phrasings is picked from
// with `pick` (a random number from the engine), never the same one as `prev` picked.
export function text(t, pack, arg, pick, prev, who) {
  if (typeof t !== "string" || !t.startsWith("@")) return t;
  let v = t.slice(1).split(".").reduce((x, k) => (x == null ? x : x[k]), pack);
  if (Array.isArray(v)) {
    const n = v.length;
    let i = Math.floor((pick ?? 0) * n);
    if (prev !== undefined && n > 1 && Math.floor(prev * n) === i) i = (i + 1) % n;
    v = v[i];
  }
  if (typeof v === "function") return v.call(pack, arg, who);   // `this` is the pack (for its direction names…)
  return v ?? t;                                    // a missing key shows itself, so it's easy to spot
}

const clean = (x) => Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined && v !== null));
