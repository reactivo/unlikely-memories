// Screen helpers that read the state: the suggestion line for a clicked object or item, and the topics line. Pure.

import { text, tell, listName, nameOf, joined } from "./narrator.js";
import { grammarOf } from "./fields.js";
import { parse, inScope } from "./parser.js";
import { answers, exitNow } from "./engine.js";
import { EXAMINED, ANSWERED } from "./verbs.js";
import { ACTIONS } from "./actions.js";
import { carried, within, receives, person, holderOf, placeOf } from "./use.js";
import { spellings, called } from "./names.js";
import { wayOf } from "./exits.js";

// A command that names the room's scenery is answered by it only when it looks at it (its `says`, or "nothing special"):
// any other verb gets the stock "There's not much you can do with the door" (the parser's @sceneryOther), so it isn't
// offered ("Unlock door with key" inside the hut, whose door is only scenery there).
const scenic = (r) => r.error.say !== "@sceneryOther";

// Is this command worth offering now: would it be read, accepted, and answered by a rule or the thing itself (not a
// verb's stock reply)? A command that names someone who isn't here, or does nothing, isn't shown.
function worthOffering(command, state, t) {
  const r = parse(command, state, t);
  if (r.error?.scenery) return scenic(r);
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
    if (r.error?.scenery) return scenic(r);
    if (!r.actions) return false;
    const a = answers(state, r.actions);
    if (!a.meaningful) return false;
    const repeats = r.actions.length === 1 && r.actions[0].obj === id && EXAMINED.has(a.rules[0]);
    if (!repeats) return true;
    plain ??= answers(state, [{ verb: "examine", obj: id }]).rules[0] === "std_examine";
    return !plain;
  };
}

// What a command does, as the rule that answers it and the things it is about: two commands with the same are the same command
// worded two ways ("Sit on bench", "Get on bench"; "Read summons", "Examine summons"), and only one is offered. Null for a command
// the game doesn't read as actions (a piece of scenery's line): those are told apart by their words.
function sameAs(state, t, command) {
  const r = parse(command, state, t);
  if (!r.actions) return null;
  const a = answers(state, r.actions);
  // (opening a locked thing and unlocking it with its key are one command; so `obj2` of the unlock rule is not told apart)
  return r.actions.map((x, i) => [a.rules[i], x.obj, a.rules[i] === "std_unlock" ? null : x.obj2, x.dir, x.topic, x.text, x.scenery].join("|")).join(";");
}

// The commands of a list without the repeats: the first of each kind stays (sameAs).
function distinct(state, t, commands) {
  const seen = new Set();
  return commands.filter(c => { const k = sameAs(state, t, c) ?? "~" + c; return !seen.has(k) && seen.add(k); });
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
    // (named in a sentence, with its article: "with the fitter", "con el doctor Mabbott"; the heading above is the name on its own)
    return text("@talkedOut", t, { name: listName(id, state, t), forNow: hidden }, undefined, undefined, grammarOf(state.world.objects[id].words));
  }
  return name + ": " + joined(offered.map(x => "`" + text("@askAbout", t, x.label) + "`"), t.or) + ".";
}

// Is it in your hands (in the inventory's slots, not inside something you carry)?
const carries = (state, id) => state.player.carrying.includes(id);

// What a thing shows about itself, from its own fields: its inventory side (when carried: `heldActions`) and its room side. The
// `actions` are the world's own, the commands special to it; what every thing of its kind offers is basicActions.
function sources(state, t, id) {
  const own = state.world.objects[id];
  const item = own && own.name && { name: text(own.name, t), actions: own.heldActions || own.actions || [] };
  const obj = own && own.name && { name: text(own.name, t), note: own.note && text(own.note, t), actions: own.actions || [] };
  return { item, obj };
}

// Is this command an Examine, by the verb it is typed with ("Examine key", "Examinar llave")? The one test for what a click line leaves out
// (the click examined already) and for "only Examine left" in USE.
const examiningCommand = (t) => (x) => (t.words?.verbs?.examine || []).some(v => (x.toLowerCase() + " ").startsWith(v + " "));

// ---- What the engine offers for a thing: its basic actions -----------------------------------------------------------------

// The verbs of a thing's own answer lines that are not offered (decision 9 of docs/engine-audit/PLAN.md): the ones that mostly refuse
// (take, drop, put, give, throw, attack), `lock` (which is the lock itself, not a line), and `talk`, which the person row offers.
const NOT_OFFERED = new Set(["take", "drop", "put", "give", "throw", "attack", "lock", "unlock", "talk"]);
// The answer lines that say where you go, offered as the pack's phrase for it (basic.<phrase>) rather than the verb's first word
// (a `climb` line is the verb's own word: "Trepar farol"; "Subir X" is for a way up).
const POSITION = { enter: "enterIn", sit: "enterOn" };

// A command for a thing, worded by the pack: `phrase` (the pack's, a function of the noun) with the thing named as its name writes it
// (js/names.js), the first spelling the parser reads as the thing and the kind of action `reads` expects. Null when none does.
function wording(state, t, id, phrase, reads) {
  const x = called(state.world.objects[id], nameOf(id, state, t), (n) => {
    const r = parse(phrase(n), state, t), a = r.actions?.length === 1 && r.actions[0];
    return !!a && reads(a);
  }, t.titled, { lowerNumbers: t.lowerNumbers });
  return x === null ? null : phrase(x);
}

// The phrase for any verb: the pack's own (basic.listen, "Listen to X"), else the verb's first word with what it takes before its
// object ("Push X", "Tirar de X"); a verb the world added has its own words.
function phraseFor(state, t, verb) {
  if (t.basic?.[verb]) return t.basic[verb];
  const word = t.words?.verbs?.[verb]?.[0] ?? state.vocab?.[verb]?.words?.[0], prep = t.words?.grammar?.verbPreps?.[verb];
  if (!word) return null;
  const said = word.charAt(0).toUpperCase() + word.slice(1) + (prep ? " " + prep : "");
  return (x) => said + " " + x;
}

// The two-thing commands, each worded as a player types them ("Unlock hut door with key"): the first thing named as its name writes it,
// the second by its first noun (js/names.js), and the whole name or an adjective and the noun when the short one would mean two things (two keys). The first wording the parser reads as
// exactly this action, and that is answered by a rule or the thing (never a stock or refused reply). A put the game answers only with its
// plain "put it in" (std_put_in) is offered only into a container you carry (decision 7: it works anywhere, but the world has no reason to
// invite it). Null when there is none.
function pairCommand(state, t, verb, a, b) {
  const objects = state.world.objects;
  const lowerNumbers = t.lowerNumbers;
  const A = spellings(objects[a], nameOf(a, state, t), t.titled, { lowerNumbers }).slice(0, 6);
  const B = spellings(objects[b], nameOf(b, state, t), t.titled, { lowerNumbers, second: true }).slice(0, 6);
  if (!A.length || !B.length || !t.useWith?.[verb]) return null;
  const worth = (command) => {
    const r = parse(command, state, t), x = r.actions?.length === 1 && r.actions[0];
    if (!x || !(x.verb === verb || (verb === "unlock" && x.verb === "open")) || x.obj !== a || x.obj2 !== b) return false;
    const got = answers(state, r.actions);
    return got.meaningful && !(verb === "put" && got.rules[0] === "std_put_in" && !carried(state, b));
  };
  for (let n = 0; n < A.length + B.length - 1; n++)
    for (let i = 0; i <= n; i++) if (i < A.length && n - i < B.length) { const c = t.useWith[verb](A[i], B[n - i]); if (worth(c)) return c; }
  return null;
}

// Unlocking, from either thing's line: "Unlock chest with key" on the locked thing when its key is on you, and on the key for each
// locked thing here that it opens.
function unlockActions(state, t, id) {
  const objects = state.world.objects, own = objects[id], out = [];
  if (own.locked && own.lock?.key && objects[own.lock.key] && carried(state, own.lock.key)) out.push(pairCommand(state, t, "unlock", id, own.lock.key));
  if (carried(state, id)) for (const d of Object.keys(objects)) if (d !== id && objects[d].locked && objects[d].lock?.key === id && inScope(state, d)) out.push(pairCommand(state, t, "unlock", d, id));
  return out.filter(Boolean);
}

// What a thing offers by what it is (ARCHITECTURE.md §3, "What the engine offers"; docs/engine-audit/PLAN.md, stage 3), from its properties
// and where you are, worded by the pack (`basic`) and the thing's name. Never Examine (a click examines already) and never Drop. Every
// command passes `offering`: read, and answered by a rule or the thing, never a stock or refused reply. [] for a thing out of reach.
//   portable, in reach, no one holds it, not what you are on ......... Take
//   a person (`topics` or `talk`) ..................................... Talk to
//   `enterable`, in the room, not locked or shut, you not in it ....... Enter / Sit on        (in it: Get out of / Get off)
//   a closed container, not locked .................................... Open               (carried, open: Close)
//   locked, its key on you; a key for a lock here ..................... Unlock X with key
//   locked, a way (`door` or `leads`), its key not on you ............. Open (the lock says what it wants)
//   `door` (not locked, the way open) ................................. Go through            (OPEN, ENTER and the direction go too)
//   `leads` (not locked, the way open) ................................ Enter / Climb / Climb down  (OPEN goes that way too)
//   a line for a verb (listen, push, smell, read…) .................... that verb, but not take, drop, put, give, throw, attack
//   `use: "pull"` ..................................................... that verb
//   a source (a thing's `from` names it) .............................. Order X / Buy X (what costs something), while it can come
//   the opening: the hints thing .. Listen to; the intro .. Read; the way on .. Enter, once you carry the hints thing
// `held`: the inventory's side (the thing is in your hands), which has no Take and no sitting on it.
export function basicActions(state, t, id, held = carries(state, id)) {
  const o = state.world.objects[id], b = t.basic;
  if (!o || !b || !inScope(state, id)) return [];
  const is = (...verbs) => (a) => a.obj === id && verbs.includes(a.verb);
  const room = state.player.at, here = placeOf(state, id) === room, op = state.opening;
  const way = wayOf(o), ways = (a) => a.verb === "go" && a.dir === way;
  const out = [], add = (phrase, reads) => { const c = phrase && wording(state, t, id, phrase, reads); if (c) out.push(c); };

  if (o.portable && o.at !== "player" && !held && !holderOf(state, id) && state.player.in !== id && o.take == null) add(b.take, is("take"));
  if (person(o)) add(b.talk, is("talk"));
  if (state.player.in === id) add(o.enterable === "on" ? b.exitOn : b.exitIn, is("exit"));
  else if (o.enterable && here && !held && !way && !o.locked) add(o.enterable === "on" ? b.enterOn : b.enterIn, is("enter", "sit", "climb", "lie"));
  if (o.container && !o.open && !o.locked) add(b.open, is("open"));
  if (o.container && o.open === true && carried(state, id)) add(b.close, is("close"));
  const unlocks = unlockActions(state, t, id);
  out.push(...unlocks);
  if (way && o.locked && here && !unlocks.length) add(b.open, is("open"));
  if (way && !o.locked && here) {
    const now = exitNow(state, room, way);
    // (a door is gone through, whichever way it faces; stairs and the like are climbed or entered by the way they go)
    if (now.go === true || typeof now.go === "string") add(o.door ? b.goThrough : way === "u" ? b.climbUp : way === "d" ? b.climbDown : b.enterIn, ways);
  }
  for (const verb of ANSWERED) {
    const line = o[verb], spec = ACTIONS[verb];
    if (NOT_OFFERED.has(verb) || !(typeof line === "string" || (Array.isArray(line) && line.length))) continue;
    if (spec.object === "none" || spec.absent || spec.speech) continue;
    if (verb in POSITION) { if (!o.enterable && !way) add(b[POSITION[verb]], is(verb)); continue; }
    add(phraseFor(state, t, verb), is(verb));
  }
  if (typeof o.use === "string" && o.use) add(phraseFor(state, t, o.use), is(o.use));
  // what comes from it (`from`): Order X, or Buy X for what it costs (`requires`), worded with that thing's name
  for (const [x, thing] of Object.entries(state.world.objects)) if (thing.from === id) {
    const verb = thing.requires ? "buy" : "order", c = b[verb] && wording(state, t, x, b[verb], (a) => a.verb === verb && a.obj === x);
    if (c) out.push(c);
  }
  if (op && id === op.hints) add(b.listen, is("listen", "use", "talk", "ask"));
  if (op && id === op.intro && carried(state, id)) add(b.read, is("read", "examine", "open"));
  if (op && id === op.way && carried(state, op.hints) && !way) add(b.enterIn, is("enter", "open", "push", "pull", "knock", "use", "climb", "board"));
  return out.filter(offering(state, t, id));
}

// The engine's commands for a thing and the world's own, as one list without repeats: the engine's first, and where the world words the
// same command (the same rule answering it about the same things) its string is the one shown, in the engine's place.
function merged(state, t, engine, world) {
  const key = (c) => sameAs(state, t, c) ?? "~" + c;
  const list = distinct(state, t, engine), keys = list.map(key);
  for (const c of distinct(state, t, world)) {
    const at = keys.indexOf(key(c));
    if (at < 0) { list.push(c); keys.push(key(c)); } else list[at] = c;
  }
  return list;
}

// A list of commands with Examine last: the engine's own "Examine X" (the pack's basic.examine, worded as the thing's name writes it),
// whatever the world wrote for the same command moved out of the way. Examine is every thing's, so the world never writes it
// (decision 25 of docs/engine-audit/PLAN.md). Like every command it must pass `offering`; a thing that can't be named in a command
// (no noun that reads) simply has none.
function withExamine(state, t, id, list) {
  const c = t.basic?.examine && inScope(state, id) && wording(state, t, id, t.basic.examine, (a) => a.obj === id && a.verb === "examine");
  if (!c || !offering(state, t, id)(c)) return list;
  // (a world's own Examine of this thing, worded as it likes, makes way for the engine's; a command that merely shares its answer, the
  // intro's READ, which the same rule answers, stays)
  const examines = (x) => { const a = parse(x, state, t).actions; return a?.length === 1 && a[0].verb === "examine" && a[0].obj === id; };
  return [...list.filter(x => !examines(x)), c];
}

// The line shown when an object or item is clicked: "Name: note. <ACTION>, <ACTION> or <ACTION>."
// What it offers: its basic actions (basicActions), then the world's own `actions` (`heldActions` when carried), those worth offering now
// and not a stock repeat of its EXAMINE (offering); where both word the same command, the world's string. Null for an unknown object.
// examined: it has just been examined (a clicked object in the story), so no note and no "Examine…" action, which
// would only repeat what was just said; null if nothing else is left to suggest.
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
  const own = (examined ? src.actions.filter(x => !examiningCommand(t)(x)) : src.actions).filter(offering(state, t, id));
  const listed = merged(state, t, basicActions(state, t, id, fromInventory || carries(state, id)), own);
  const actions = examined ? listed : withExamine(state, t, id, listed);       // (a click just examined it: no Examine to offer)
  if (examined && !actions.length) return null;
  if (examined) note = null;
  const a = actions.map(x => "`" + x + "`");                                    // each action as a <COMMAND>
  if (!a.length) return src.name + (note ? ": " + note.replace(/\.$/, "") : "") + ".";   // nothing to suggest
  return src.name + ": " + (note ? note + " " : "") + joined(a, t.or) + ".";   // "A, B or C"
}

// ---- USE on its own ----------------------------------------------------------------------------------------------------

// What you could do with a thing when you type USE and its words alone (nothing means it by itself): "Use the key how?
// `Unlock door with key`, `Take key` or `Drop key`." The two-thing actions that would work here and now first: put what you carry in
// an open container that is here, give what you carry to someone here who would take it, unlock what is locked and here with the key you
// carry; then the thing's basic actions (basicActions), then the world's own `actions` (the same source as the line shown when it is
// clicked). Only commands that would be read and answered by a rule or the thing (never a stock or refused reply), at most five.
// Null when nothing is left to offer, or only Examine (the stock reply then: nothing to use it for).
export function useLine(state, t, id) {
  const objects = state.world.objects, own = objects[id];
  if (!own || !t.useWith) return null;
  const here = Object.keys(objects).filter(x => x !== id && inScope(state, x));
  const pairs = [];
  if (carried(state, id))
    for (const c of here) {
      if (objects[c].container && objects[c].open && objects[id].at !== c && !within(state, c, id)) pairs.push(pairCommand(state, t, "put", id, c));
      if (receives(state, c)) pairs.push(pairCommand(state, t, "give", id, c));
    }
  pairs.push(...unlockActions(state, t, id));
  const { item, obj } = sources(state, t, id), src = (carries(state, id) && item) || obj;
  const worlds = (src?.actions || []).filter(offering(state, t, id));
  const commands = withExamine(state, t, id, merged(state, t, [...pairs.filter(Boolean), ...basicActions(state, t, id)], worlds));
  if (commands.every(examiningCommand(t))) return null;         // (only Examine, or nothing: the stock reply)
  const list = [...new Set(commands)].slice(0, 5).map(x => "`" + x + "`");
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
