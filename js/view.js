// Screen helpers that read the state: the suggestion line for a clicked object or item, and the topics line. Pure.

import { carries } from "./state.js";
import { text, tell, listName } from "./narrator.js";
import { parse, inScope } from "./parser.js";
import { answers } from "./engine.js";
import { carried, within, receives } from "./use.js";

// Is this command worth offering now: would it be read, accepted, and answered by a rule or the thing itself (not a
// verb's stock reply)? A command that names someone who isn't here, or does nothing, isn't shown.
export function worthOffering(command, state, t) {
  const r = parse(command, state, t);
  if (r.error?.scenery) return true;
  return !!r.actions && answers(state, r.actions).meaningful;
}

// The topics someone offers to talk about: their own (those they have an answer for), about things you've come
// across (held, seen, a place you've been) or ideas that have come up, not yet asked. Topic fields: `about` (the
// object, room or idea it's about; else its key), `open` (offered from the start), `label` (how the command names
// it; else its first word). [{ key, label }]
export function offeredTopics(state, id) {
  const topics = state.world.objects[id]?.topics;
  if (!topics) return [];
  const s = state.seen || {}, known = new Set([...(s.held || []), ...(s.things || []), ...(s.visited || []), ...(s.ideas || [])]);
  const asked = new Set(state.asked?.[id] || []);
  return Object.entries(topics)
    .filter(([k, t]) => k !== "default" && t && typeof t === "object" && !asked.has(k) && (t.open || known.has(t.about ?? k)))
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
  const own = state.world.objects[id];
  const name = t.objects[id]?.name ?? (own?.name ? text(own.name, t) : id);
  if (!offered.length) {
    const s = state.seen || {}, known = new Set([...(s.held || []), ...(s.things || []), ...(s.visited || []), ...(s.ideas || [])]);
    const hidden = Object.entries(topics).some(([k, x]) => k !== "default" && x && typeof x === "object" && !x.open && !known.has(x.about ?? k));
    return text("@talkedOut", t, { name, forNow: hidden });
  }
  const a = offered.map(x => "`" + text("@askAbout", t, x.label) + "`");
  const list = a.length > 1 ? a.slice(0, -1).join(", ") + t.or + a.at(-1) : a[0];
  return name + ": " + list + ".";
}

// What a thing shows about itself: its inventory side (when carried: `heldActions`) and its room side, from the pack
// (`items`, `objects`) or the world's own fields.
function sources(state, t, id) {
  const own = state.world.objects[id];
  const worldItem = own && own.name && { name: text(own.name, t), actions: own.heldActions || own.actions || [] };
  const worldObj = own && own.name && { name: text(own.name, t), note: own.note && text(own.note, t), actions: own.actions || [] };
  return { item: t.items[id] || worldItem, obj: t.objects[id] || worldObj };
}

// The line shown when an object or item is clicked: "Name: note. <ACTION>, <ACTION> or <ACTION>."
// A carried object shows its inventory actions, those worth offering now (worthOffering). Null for an unknown object.
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
  const actions = (examined ? src.actions.filter(x => !examining(x)) : src.actions).filter(x => worthOffering(x, state, t));
  if (examined && !actions.length) return null;
  if (examined) note = null;
  const a = actions.map(x => "`" + x + "`");                                    // each action as a <COMMAND>
  if (!a.length) return src.name + (note ? ": " + note.replace(/\.$/, "") : "") + ".";   // nothing to suggest
  const list = a.length > 1 ? a.slice(0, -1).join(", ") + t.or + a[a.length - 1] : a[0];   // "A, B or C"
  return src.name + ": " + (note ? note + " " : "") + list + ".";
}

// ---- USE on its own ----------------------------------------------------------------------------------------------------

// What you could do with a thing when you type USE and its words alone (nothing means it by itself): "Use the key how?
// `Unlock door with key`, `Examine key` or `Drop key`." The thing's own suggested actions (the same source as the line shown
// when it is clicked), plus the two-thing actions that would work here and now, those first: unlock what is locked
// and here with the key you carry, put what you carry in an open container that is here, give what you carry to someone
// here who would take it. Only commands that would be read and answered by a rule or the thing (worthOffering: never a
// stock or refused reply), at most five. Null when nothing is left to offer.
export function useLine(state, t, id) {
  const objects = state.world.objects, own = objects[id];
  if (!own || !t.useWith) return null;
  const noun = (x) => t.names?.[x]?.nouns?.[0] ?? objects[x]?.words?.nouns?.[0];
  const here = Object.keys(objects).filter(x => x !== id && inScope(state, x));
  const pairs = [];                                   // { command, verb, a, b }: the action, with its two things
  const offer = (verb, a, b) => { if (noun(a) && noun(b)) pairs.push({ command: t.useWith[verb](noun(a), noun(b)), verb, a, b }); };
  if (carried(state, id))
    for (const c of here) {
      if (objects[c].container && objects[c].open && objects[id].at !== c && !within(state, c, id)) offer("put", id, c);
      if (receives(state, c)) offer("give", id, c);
    }
  if (own.locked && own.lock?.key && carried(state, own.lock.key)) offer("unlock", id, own.lock.key);   // it is the locked thing
  if (carried(state, id)) for (const d of here) if (objects[d].locked && objects[d].lock?.key === id) offer("unlock", d, id);   // it is the key
  // Each command as the player would type it: read as exactly those two things, and answered (not stock, not refused).
  const worth = ({ command, verb, a, b }) => {
    const r = parse(command, state, t), x = r.actions?.length === 1 && r.actions[0];
    return !!x && (x.verb === verb || (verb === "unlock" && x.verb === "open")) && x.obj === a && x.obj2 === b && answers(state, r.actions).meaningful;
  };
  const { item, obj } = sources(state, t, id), src = (carries(state, id) && item) || obj;
  const commands = [...pairs.filter(worth).map(p => p.command), ...(src?.actions || []).filter(x => worthOffering(x, state, t))];
  const list = [...new Set(commands)].slice(0, 5).map(x => "`" + x + "`");
  if (!list.length) return null;
  const said = list.length > 1 ? list.slice(0, -1).join(", ") + t.or + list.at(-1) : list[0];
  return text("@useHow", t, { name: listName(id, state, t), list: said }, undefined, undefined, own.words);
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
