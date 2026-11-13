// Narrator: turns the effects the engine applied into story paragraphs (ARCHITECTURE.md §7).
// It voices `say` lines and describes rooms and what you carry, using the language pack's texts. Effects
// without words of their own (a move, a set) say nothing: the rule that caused them says what happened.
// Pure: never touches the page or the state.

import { worldTime, parts, hhmm } from "./time.js?v=0.48.1";
import { PROPERTY_WORD, ANSWER_WORD, propertyText, answerText, grammarOf } from "./words.js?v=0.48.1";
import { activeIds, conditionTone } from "./conditions.js?v=0.48.1";
import { placeOf, noticed } from "./place.js?v=0.48.1";
import { isMover } from "./movers.js?v=0.48.1";
import { clean } from "./shapes.js?v=0.48.1";

// Story paragraphs for these applied effects: [{ text, style?, img? }]. state = the state after them.
export function tell(applied, state, pack) {
  const out = [];
  let part = 0, aside;                                       // where the lines of this part of the moment start: your command's, or the world's own
  for (const e of applied) {
    if (!!e.aside !== aside) { part = out.length; aside = !!e.aside; }
    const from = out.length;
    if (e.say) {
      // name: a thing, named in this language; things: several, with their gender and number, in order
      // marked: each is a clickable mark of the thing ("Inside: a {crank}."), the name as the pack would write it
      // (an arg that is a pack key is the pack's text: the cause of a death the engine itself words, "@sleep.never")
      const arg = e.things ? e.things.map(id => (e.marked ? `{${listName(id, state, pack)}|${id}}` : listName(id, state, pack))) : e.name ? listName(e.name, state, pack)
                : typeof e.arg === "string" && e.arg.startsWith("@") ? text(e.arg, pack) : e.arg;
      const who = e.things ? e.things.map(id => whoOf(state.world.objects[id])) : e.who;
      // The death lines (the cause's words and one of the pack's lines, one paragraph) have their own style: red (log.css).
      let said = timed(text(e.say, pack, arg, e.pick, e.prev, who), state, pack, e.at, e.vals);
      if (e.confirm) said += " " + text("@yesNo", pack);                  // a question: "… <YES> / <NO>", always
      // a question with its own answers (SLEEP's): each one clickable, the same way: "… <A SHORT NAP> / <UNTIL MORNING>"
      if (Array.isArray(e.choices)) said += " " + e.choices.map(c => "`" + text(c, pack) + "`").join(" / ");
      // A blank line in a text starts a new paragraph (HELP's groups, LOAD's details), spaced like any other.
      String(said).split(/\n\s*\n/).forEach((part, i) =>
        out.push(clean({ text: part, style: e.say === "@hurt.dead" ? "death" : e.style, img: i === 0 ? e.img : undefined })));
    }
    // An echo of what just happened to you (INTERFACE.md §6c): its own short line, styled by its kind, and by its tone if
    // it has one (a condition's start or end: "tone-hurt", "tone-healed" or "tone-neutral", its colour; js/conditions.js).
    // A health echo (e.level) also carries the level its line describes, for the bars before it. An echo of a thing you gained
    // or lost (e.thing) names it, with its article, and carries `slot`: the small inventory slot drawn before it, with the
    // thing's sprite (its rows, kept with the line so a loaded game draws it again, even of a thing that is gone). A thing
    // with no sprite gets no slot at all, just the words (the checker refuses a world with one you can carry: js/check.js).
    if (e.echo) {
      const arg = e.thing !== undefined ? heldName(e, state, pack) : undefined;
      out.push(clean({ text: timed(text(echoPhrase(e, pack), pack, arg, undefined, undefined, e.who), state, pack, e.at),
                       style: echoStyle(e.kind, e.tone), level: e.level,
                       slot: e.thing !== undefined && Array.isArray(e.sprite) && e.sprite.length ? { sprite: e.sprite } : undefined }));
    }
    if (e.hint) out.push({ text: timed(pack.framed(text(e.hint, pack), hintText(e, pack)), state, pack) });   // the world's frame, then the hint
    if (e.describe === "inventory") out.push({ text: inventory(state, pack) });
    else if (e.describe === "time") out.push({ text: timeNow(state, pack, e.at) });
    else if (e.describe === "status") out.push(statusLine(state, pack), ...conditionsLine(state, pack));
    else if (e.describe) out.push(...describe(state, e.describe, pack, e.without));   // (without: what came in after it, js/movers.js)
    if (e.inView) out.push(...cameIntoView(out, part, e.inView, state, pack));   // what came into view: marked, or said where it lies
    if (e.aside) for (let i = from; i < out.length; i++) out[i] = { ...out[i], style: styled(out[i].style) };   // the world's own: set apart
  }
  return out;
}

// ---- What comes into view (decisions 14, 35, 36) ----------------------------------------------------------------
// The things that came where you are in this part of the moment (the engine's `inView`: a rule's move, a lock's `opens`, a named change,
// an added object…), so the player can click what just appeared without looking round first. Each is marked in the lines of the
// moment (lines[from…]) at the first mention of its name or one of its nouns that isn't marked yet, nor inside quotes (what someone
// says is a word in a sentence, not the thing) or a command; nothing is done for one a line marks already ("Inside: a {crank}.").
// One no line names: a thing that can be taken gets the stock line, marked, at the end of the moment ("There is a {coin} here.",
// one line for all of them), or its own `lies` line if it has one and has been taken (decision 38); a person or a fixture gets its `here`
// line, if it has one, marked the same way; else nothing.
// Changes lines[] in place; returns the lines to add.
function cameIntoView(lines, from, ids, state, pack) {
  const told = (i) => !/\b(sys|echo|status|death)\b/.test(lines[i].style || "");
  const loose = [], added = [];
  for (const id of ids) {
    const o = state.world.objects[id];
    if (!o) continue;
    if (lines.slice(from).some(l => marks(l.text, id))) continue;
    let done = false;
    for (let i = from; i < lines.length && !done; i++) {
      if (!told(i)) continue;
      const t = markFirst(lines[i].text, id, state, pack);
      if (t !== null) { lines[i] = { ...lines[i], text: t }; done = true; }
    }
    if (done) continue;
    if (liesNow(state, id)) added.push({ text: markedLine(o.lies, id, state, pack) });
    else if (o.portable === true) loose.push(id);
    else if (hereNow(state, id) && placeOf(state, id) === o.at) added.push({ text: markedLine(o.here, id, state, pack) });
  }
  return loose.length ? [{ text: lyingLine(loose, state, pack) }, ...added] : added;
}

// A thing's own line (its `here`, its `lies`), said now and marked at the first mention of the thing if the world did not mark it.
function markedLine(raw, id, state, pack) {
  const t = timed(text(raw, pack), state, pack);
  return marks(t, id) ? t : markFirst(t, id, state, pack) ?? t;
}

// Does a text mark this thing ({label|id}, or {id})?
const marks = (t, id) => typeof t === "string" && (t.includes("|" + id + "}") || t.includes("{" + id + "}"));

// A text with its first mention of a thing marked, `{label|id}`, or null if it names it nowhere a mark may go. The mention is its
// name as a sentence says it ("old coin", "Mrs Hale") or one of its nouns, whichever comes first (the longer at the same place), and
// it takes in the thing's own adjectives next to it ("the brass key", *la moneda antigua*), so a click names it plainly. Accents and
// case don't count (the word lists are often written without accents: "pertiga" finds *pértiga*). Never inside another mark, a
// `command`, or quotes ("…", «…», “…”).
function markFirst(t, id, state, pack) {
  if (typeof t !== "string") return null;
  const o = state.world.objects[id], words = o.words || {};
  const shut = [...t.matchAll(/\{[^}]*\}|`[^`]*`|"[^"]*"|«[^»]*»|“[^”]*”/g)].map(m => [m.index, m.index + m[0].length]);
  const open = (i, j) => !shut.some(([a, b]) => i < b && j > a);
  const plain = fold(t);
  const names = [...new Set([listName(id, state, pack), ...(words.nouns || [])].map(n => fold(String(n).trim())).filter(Boolean))];
  let best = null;
  for (const n of names) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "gu");
    for (const m of plain.matchAll(re)) {
      if (!open(m.index, m.index + n.length)) continue;
      if (!best || m.index < best[0] || (m.index === best[0] && n.length > best[1] - best[0])) best = [m.index, m.index + n.length];
      break;
    }
  }
  if (!best) return null;
  // Take in the thing's adjectives on either side (plain words of three letters or more: not "de", "of"), one space apart.
  const adj = new Set((words.adj || []).map(a => fold(String(a))).filter(a => a.length >= 3 && !/\s/.test(a)));
  let [i, j] = best;
  for (let m; (m = /(\p{L}+) $/u.exec(plain.slice(0, i))) && adj.has(m[1]) && open(i - m[0].length, i);) i -= m[0].length;
  for (let m; (m = /^ (\p{L}+)/u.exec(plain.slice(j))) && adj.has(m[1]) && open(j, j + m[0].length);) j += m[0].length;
  return t.slice(0, i) + "{" + t.slice(i, j) + "|" + id + "}" + t.slice(j);
}

// A text folded for finding words in it, one character for one, so places in it are places in the text: lower case, accents off.
const fold = (t) => String(t).split("").map(c => { const f = c.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase(); return f.length === 1 ? f : c.toLowerCase(); }).join("");

// An echo's style: "echo text-echo echo-<kind>", and "tone-<tone>" when it has one (its colour: ui/log.css).
const echoStyle = (kind, tone) => "echo text-echo echo-" + kind + (tone ? " tone-" + tone : "");

// A paragraph's style with "aside" added: what the world said on its own (js/engine.js marks those effects).
const styled = (style) => [style, "aside"].filter(Boolean).join(" ");

// A thing's gender, number and proper-name mark as the pack wants them (Spanish agreement; no article before a proper
// name): { g, pl, proper } from its `words` (js/words.js, grammarOf), or nothing.
const whoOf = (o) => grammarOf(o?.words);

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
// The two the engine words itself, `{take}` and `{enter+}` (the opening's own steps), are the pack's phrases for them
// (`basic.take`, `basic.enterIn`), so they read as every command the engine words. Any other command is returned as it is.
const BASIC = { take: "take", "enter+": "enterIn" };
export function solveCommand(command, pack) {
  return String(command).replace(/^\{(\w+)(\+?)\}(?:\s+(.+))?/, (whole, verb, plus, rest) => {
    const phrase = rest && pack.basic?.[BASIC[verb + plus]];
    if (phrase) { const said = phrase(rest); return said.charAt(0).toLowerCase() + said.slice(1); }
    const word = pack.words.verbs[verb]?.[0], prep = plus && pack.words.grammar?.verbPreps?.[verb];
    return word === undefined ? whole : (prep ? word + " " + prep : word) + (rest ? " " + rest : "");
  });
}

// A room's description: its paragraphs (a skeleton room, BRIEF.md §1, has its `placeholder` line instead), then a line for each object lying there whose `here` is in force (hereNow) or that has its own
// `lies` line and has been taken (liesNow), then one line for what can be taken and lies there with neither ("There is a {coin} and a
// {key} here.": lyingLine), then where you are in it. A thing that moves (js/movers.js) has its `here` line marked, if the world didn't
// mark it, since it is somewhere else each time; one that came in after the description, in the same moment, is left out (`without`:
// its own line says it comes in).
export function describe(state, roomId, pack, without = []) {
  const room = state.world.rooms[roomId];
  const lines = [].concat(room.describe ?? room.placeholder ?? []).map(k => ({ text: timed(text(k, pack), state, pack) }));
  for (const [id, o] of Object.entries(state.world.objects)) if (o.at === roomId && (hereNow(state, id) || liesNow(state, id)) && !without.includes(id))
    lines.push({ text: isMover(o) && hereNow(state, id) ? markedLine(o.here, id, state, pack) : timed(text(hereNow(state, id) ? o.here : o.lies, pack), state, pack) });
  const loose = lyingIn(state, roomId);
  if (loose.length) lines.push({ text: lyingLine(loose, state, pack) });
  const inside = state.player.in && state.world.objects[state.player.in];        // you're in or on something here
  if (inside && roomId === state.player.at)
    lines.push({ text: text(inside.enterable === "on" ? "@youAreOn" : "@youAreIn", pack, listName(state.player.in, state, pack), undefined, undefined, whoOf(inside)) });
  return lines;
}

// Is a thing's `here` line said where it lies? A thing that can be taken: until it is first taken (decision 33, Inform's initial
// appearance: the line is for where it starts, "lies on the desk"; once it has been in your hands, wherever it is put down again, the
// stock line says it lies there). A rule of the world that moves it before then (the oars that slide out of the hut) keeps it. A thing
// that can't be taken, a person or a fixture: always (one that moves is moved by the game, js/movers.js, and the world writes its line).
function hereNow(state, id) {
  const o = state.world.objects[id];
  return !!o?.here && (o.portable !== true || !state.seen?.held?.includes(id));
}

// Is a thing's `lies` line said where it lies (decision 38)? A thing that can be taken, once it has been taken: the same moment its
// `here` stops, so exactly one of the two is in force for a thing that has both. It takes the place of the stock line.
function liesNow(state, id) {
  const o = state.world.objects[id];
  return !!o?.lies && o.portable === true && !!state.seen?.held?.includes(id);
}

// What the stock line of a room names (decision 15): the things that can be taken lying there (in the room itself, not inside
// something: what a container holds is said when it is opened), in the world's order, with no `here` or `lies` in force, but not the thing
// you are in or on, nor one marked `unnoticed` that nothing has brought up yet (it is there to be found).
function lyingIn(state, roomId) {
  return Object.entries(state.world.objects).filter(([id, o]) => o.at === roomId && o.portable === true && !hereNow(state, id) && !liesNow(state, id) && id !== state.player.in
    && noticed(state, id)).map(([id]) => id);
}

// The stock line for things lying in a room, each marked so it can be clicked: "There is a {coin} here.", "Aquí hay una {moneda} y
// unos {remos}." (the pack's `lying`, with each thing's gender, number and proper-name mark, as the `inside` line has them).
function lyingLine(ids, state, pack) {
  return text("@lying", pack, ids.map(id => `{${listName(id, state, pack)}|${id}}`), undefined, undefined, ids.map(id => whoOf(state.world.objects[id])));
}

// A list in a sentence: "A, B or C" (`last` is the pack's " or " or " and ").
export const joined = (list, last) => (list.length > 1 ? list.slice(0, -1).join(", ") + last + list.at(-1) : list[0]);

// What you carry, from the state: "You are carrying: tin of mints." (names from the objects).
export function inventory(state, pack) {
  const names = state.player.carrying.map(id => listName(id, state, pack));
  if (!names.length) return text("@invEmpty", pack);
  return text("@invList", pack, joined(names, pack.and ?? pack.or));
}

// TIME: the world's weekday (if it has one), time and day of your adventure, worded by the pack.
function timeNow(state, pack, at = worldTime(state)) {
  const p = parts(at, state.time?.weekday);
  return text("@timeNow", pack, { weekday: p.weekday ? pack.weekdays[p.weekday] : null, time: hhmm(p), day: p.day });
}

// The phrase of a health echo: a hurt says the pack's own phrase for that step (echo.hurt), if it has one, else the state
// phrase the engine named (one rule, here); anything else says what the engine named.
function echoPhrase(e, pack) {
  return e.kind === "hurt" && e.level && pack.echo?.hurt?.[e.level] ? "@echo.hurt." + e.level : e.echo;
}

// The name of a thing you gained or lost, inside its echo: as the engine kept it at that moment (the thing may be gone by
// now), in this language, with the case a name has in a sentence (inSentence, with the mark the engine kept in `who`); the
// pack adds its article (`the`), or none for a proper name.
function heldName(e, state, pack) {
  return inSentence(e.name ? text(e.name, pack) : nameOf(e.thing, state, pack), e.who, pack);
}

// STATUS: your health, one sentence per step (5 to 1; the pack has the words).
export function statusNow(state, pack) {
  return text("@statusNow", pack, { health: statusHealth(state) });
}
const statusHealth = (state) => Math.min(5, Math.max(1, Math.round(state.player.health)));

// STATUS as a paragraph: the sentence, the health it describes (for the bars) and its colour: 5 and 4 the healed
// colour, 3 to 1 the hurt colour (log.css).
export function statusLine(state, pack) {
  const level = statusHealth(state);
  return { text: statusNow(state, pack), style: "status " + (level >= 4 ? "status-healed" : "status-hurt"), level };
}

// STATUS, under the health line: the conditions you are in, one line each, in the order they started: its world's own
// `status` phrase, framed by the pack (statusCondition: a full stop), styled like the condition's start echo (its tone: harmful
// red, good green, neutral amber; js/conditions.js), close under the line before it. No bars. Nothing when you are in none.
function conditionsLine(state, pack) {
  return activeIds(state).map(id => state.conditions?.[id]).filter(d => typeof d?.status === "string")
    .map(d => ({ text: timed(text("@statusCondition", pack, text(d.status, pack)), state, pack), style: echoStyle("condition", conditionTone(d)) }));
}

// A thing's name inside a sentence ("You are carrying: tin of mints."): lower case first letter only if the language does
// that (grammar.lowerNames; not German, whose nouns keep their capital), so "Photo of Madrid" keeps "Madrid"; and never for
// a proper name (`words.proper`: "You are carrying: Monday."). The one rule for a name in a sentence: every line that names
// a thing comes through here (listName, and the echoes' heldName), and the pack adds its article with its own `the`,
// which leaves a proper name bare. (A name shown on its own, an inventory slot or a hover, keeps the world's capital.)
export function inSentence(name, who, pack) {
  const n = String(name ?? "");
  return pack.words?.grammar?.lowerNames && !who?.proper ? n.charAt(0).toLowerCase() + n.slice(1) : n;
}
export function listName(id, state, pack) {
  return inSentence(nameOf(id, state, pack), whoOf(state.world.objects[id]), pack);
}

// The world's time in a text: [time] ("a quarter past five", worded by the pack), [day] (3), [weekday] ("Sunday");
// and [way], the way you came in from the opening ("the revolving door": the pack's `the`, then the thing's name).
// And any declared property, [thing.property] ([player.name], [bell.rung]): its number or string, nothing for a boolean
// or one that holds nothing yet; a name that isn't declared stays as written (js/fields.js, "Words from the state").
// And what the player typed to a question, [player.answers.<key>] ("Voss"), as typed; nothing before it is answered.
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
          .replace(PROPERTY_WORD, (m, id, prop) => vals && (id + "." + prop) in vals ? vals[id + "." + prop] : propertyText(state, id, prop) ?? m)
          .replace(ANSWER_WORD, (m, key) => vals && ("player.answers." + key) in vals ? vals["player.answers." + key] : answerText(state, key));
}

// The way you came in from the opening, named in a sentence ("the revolving door"; a proper name bare); nothing if there isn't one.
function wayName(state, pack) {
  const id = state.opening?.way, o = id && state.world.objects[id];
  return o ? pack.the(listName(id, state, pack), o) : "";
}

// A thing's name, as the world writes it (literal text, or an "@key"); its id if it has none.
export function nameOf(id, state, pack) {
  const o = state.world.objects[id];
  return o?.name ? text(o.name, pack) : id;
}

// A room's name for the title bar: its own, else the pack's.
export function placeName(state, pack) {
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

