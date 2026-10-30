// Screen helpers that read the state: the suggestion line for a clicked object or item, and the topics line. Pure.

import { text, tell, listName, nameOf, joined } from "./narrator.js";
import { parse, inScope } from "./parser.js";
import { answers } from "./engine.js";
import { EXAMINED } from "./verbs.js";
import { carried, within, receives } from "./use.js";

// Is this command worth offering now: would it be read, accepted, and answered by a rule or the thing itself (not a
// verb's stock reply)? A command that names someone who isn't here, or does nothing, isn't shown.
function worthOffering(command, state, t) {
  const r = parse(command, state, t);
  if (r.error?.scenery) return true;
  return !!r.actions && answers(state, r.actions).meaningful;
}

// Which commands to offer for a thing: those worth offering (worthOffering), but never one the game would answer with
// its stock reply that only shows the thing's examine (verbs.js EXAMINED: std_read, for a thing with nothing else to
// answer reading it), when its EXAMINE is the stock one too: READ of a thing whose writing its EXAMINE already shows.
// A command a rule of the game answers (a world's, the opening's: the intro's READ, which says its text, then its farewell,
// and is gone) is always offered, even if it says what EXAMINE says; so is EXAMINE itself, and a command about another
// thing (the chair's "Read card"). Pure: the thing's EXAMINE is tried once per line, only when a command needs it.
function offering(state, t, id) {
  let plain;
  return (command) => {
    const r = parse(command, state, t);
    if (r.error?.scenery) return true;
    if (!r.actions) return false;
    const a = answers(state, r.actions);
    if (!a.meaningful) return false;
    const repeats = r.actions.length === 1 && r.actions[0].obj === id && EXAMINED.has(a.rules[0]);
    if (!repeats) return true;
    plain ??= answers(state, [{ verb: "examine", obj: id }]).rules[0] === "std_examine";
    return !plain;
  };
}

// Everything you've come across: held, seen, visited, or an idea brought up (a topic about it can be offered).
function known(state) {
  const s = state.seen || {};
  return new Set([...(s.held || []), ...(s.things || []), ...(s.visited || []), ...(s.ideas || [])]);
}

// The topics someone offers to talk about: their own (those they have an answer for), about things you've come
// across (held, seen, a place you've been) or ideas that have come up, not yet asked. Topic fields: `about` (the
// object, room or idea it's about; else its key), `open` (offered from the start), `label` (how the command names
// it; else its first word). [{ key, label }]
export function offeredTopics(state, id) {
  const topics = state.world.objects[id]?.topics;
  if (!topics) return [];
  const seen = known(state), asked = new Set(state.asked?.[id] || []);
  return Object.entries(topics)
    .filter(([k, t]) => k !== "default" && t && typeof t === "object" && !asked.has(k) && (t.open || seen.has(t.about ?? k)))
    .map(([k, t]) => ({ key: k, label: t.label ?? t.words?.[0] ?? k }));
}

// The line shown after someone answers you: what you could ask them about, as commands ("Mr Ambrose: `Ask about
// umbrella` or `Ask about crate`."), at most five. When there's nothing to offer: "You have nothing else to talk
// about with Mr Ambrose.", with "(for now)" while they still have topics you haven't uncovered. Null for someone with
// no topics at all. (What you've asked is forgotten when you enter a room, js/engine.js: everything you know about is
// offered again on your next visit.)
export function topicsLine(state, t, id) {
  const topics = state.world.objects[id]?.topics;
  if (!topics) return null;
  const offered = offeredTopics(state, id).filter(x => worthOffering(text("@askAbout", t, x.label), state, t)).slice(0, 5);
  const name = nameOf(id, state, t);
  if (!offered.length) {
    const seen = known(state);
    const hidden = Object.entries(topics).some(([k, x]) => k !== "default" && x && typeof x === "object" && !x.open && !seen.has(x.about ?? k));
    return text("@talkedOut", t, { name, forNow: hidden });
  }
  return name + ": " + joined(offered.map(x => "`" + text("@askAbout", t, x.label) + "`"), t.or) + ".";
}

// Is it in your hands (in the inventory's slots, not inside something you carry)?
const carries = (state, id) => state.player.carrying.includes(id);

// What a thing shows about itself, from its own fields: its inventory side (when carried: `heldActions`) and its room side.
function sources(state, t, id) {
  const own = state.world.objects[id];
  const item = own && own.name && { name: text(own.name, t), actions: own.heldActions || own.actions || [] };
  const obj = own && own.name && { name: text(own.name, t), note: own.note && text(own.note, t), actions: own.actions || [] };
  return { item, obj };
}

// The line shown when an object or item is clicked: "Name: note. <ACTION>, <ACTION> or <ACTION>."
// A carried object shows its inventory actions, those worth offering now and not a stock repeat of its EXAMINE (offering). Null
// for an unknown object.
// examined: it has just been examined (a clicked object in the story), so no note and no "Examine…" action, which
// would only repeat what was just said; null if nothing else is left to suggest.
// A thing carries its own name, note and actions (`heldActions` when carried).
export function suggestion(state, t, id, fromInventory, examined = false) {
  const { item, obj } = sources(state, t, id);
  let src, note;
  if (fromInventory) src = item;
  else {
    if (!obj) return null;
    src = (carries(state, id) && item) || obj;
    note = obj.note;
  }
  if (!src) return null;
  const examining = (x) => (t.words?.verbs?.examine || []).some(v => (x.toLowerCase() + " ").startsWith(v + " "));
  const actions = (examined ? src.actions.filter(x => !examining(x)) : src.actions).filter(offering(state, t, id));
  if (examined && !actions.length) return null;
  if (examined) note = null;
  const a = actions.map(x => "`" + x + "`");                                    // each action as a <COMMAND>
  if (!a.length) return src.name + (note ? ": " + note.replace(/\.$/, "") : "") + ".";   // nothing to suggest
  return src.name + ": " + (note ? note + " " : "") + joined(a, t.or) + ".";   // "A, B or C"
}

// ---- USE on its own ----------------------------------------------------------------------------------------------------

// What you could do with a thing when you type USE and its words alone (nothing means it by itself): "Use the key how?
// `Unlock door with key`, `Examine key` or `Drop key`." The thing's own suggested actions (the same source as the line shown
// when it is clicked), plus the two-thing actions that would work here and now, those first: unlock what is locked
// and here with the key you carry, put what you carry in an open container that is here, give what you carry to someone
// here who would take it. Only commands that would be read and answered by a rule or the thing (worthOffering: never a
// stock or refused reply), and, of its own actions, none the game would answer only with its examine, as a stock reply (offering), at most five. Null when nothing is left to offer.
export function useLine(state, t, id) {
  const objects = state.world.objects, own = objects[id];
  if (!own || !t.useWith) return null;
  // Each command as the player would type it: read as exactly those two things, and answered (not stock, not refused).
  const worth = ({ command, verb, a, b }) => {
    const r = parse(command, state, t), x = r.actions?.length === 1 && r.actions[0];
    return !!x && (x.verb === verb || (verb === "unlock" && x.verb === "open")) && x.obj === a && x.obj2 === b && answers(state, r.actions).meaningful;
  };
  // How a command names a thing: its first noun, or, for a proper name (words.proper), its name as written, capital kept
  // ("Give Monday to archivist", as its own actions say "Examine Monday"), each of the two as far as the parser reads the
  // command as the same action (worth); otherwise the noun.
  const noun = (x) => objects[x]?.words?.nouns?.[0];
  const named = (x) => (objects[x]?.words?.proper && typeof objects[x].name === "string" ? objects[x].name : noun(x));
  const here = Object.keys(objects).filter(x => x !== id && inScope(state, x));
  const pairs = [];                                   // { command, verb, a, b }: the action, with its two things
  const offer = (verb, a, b) => {
    if (!noun(a) || !noun(b)) return;
    const forms = [[named(a), named(b)], [named(a), noun(b)], [noun(a), named(b)], [noun(a), noun(b)]].map(([x, y]) => t.useWith[verb](x, y));
    pairs.push({ command: forms.find(c => worth({ command: c, verb, a, b })) ?? forms[3], verb, a, b });
  };
  if (carried(state, id))
    for (const c of here) {
      if (objects[c].container && objects[c].open && objects[id].at !== c && !within(state, c, id)) offer("put", id, c);
      if (receives(state, c)) offer("give", id, c);
    }
  if (own.locked && own.lock?.key && carried(state, own.lock.key)) offer("unlock", id, own.lock.key);   // it is the locked thing
  if (carried(state, id)) for (const d of here) if (objects[d].locked && objects[d].lock?.key === id) offer("unlock", d, id);   // it is the key
  const { item, obj } = sources(state, t, id), src = (carries(state, id) && item) || obj;
  const commands = [...pairs.filter(worth).map(p => p.command), ...(src?.actions || []).filter(offering(state, t, id))];
  const list = [...new Set(commands)].slice(0, 5).map(x => "`" + x + "`");
  if (!list.length) return null;
  return text("@useHow", t, { name: listName(id, state, t), list: joined(list, t.or) }, undefined, undefined, own.words);
}

// What a turn said, as story paragraphs: the narrator's, and for USE alone (the engine's `useHow`) what you could do with the
// thing, or the stock reply when nothing is worth offering.
export function story(applied, state, t) {
  const out = [];
  let run = [];
  for (const e of applied) {
    if (!e.useHow) { run.push(e); continue; }
    out.push(...tell(run, state, t));
    run = [];
    out.push({ text: useLine(state, t, e.useHow) ?? text("@replies.use", t, undefined, e.pick, undefined, state.world.objects[e.useHow]?.words) });
  }
  out.push(...tell(run, state, t));
  return out;
}
