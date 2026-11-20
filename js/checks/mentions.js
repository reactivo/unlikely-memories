// What a text mentions and marks: everything a text names answers, what a click examines, what a thing offers does something, what can be taken
// is named where it comes into view and never in a room's text, and topics are offered. Pure: reads the state and the pack, never changes either.

import { parse, normalise } from "../parser.js?v=0.71.0";
import { answers as answered } from "../engine.js?v=0.71.0";
import { placeOf, inScope, holderOf } from "../place.js?v=0.71.0";
import { inRoom, packText, effectsOf, plannedWorld, worldTexts, collectTexts } from "./shared.js?v=0.71.0";
import { markOf } from "../narrator.js?v=0.71.0";

// What a thing offers when clicked does something, and repeats nothing the engine offers.
export function offeredWarnings(state, pack, out) {
  // What a thing offers when clicked (`actions`; `heldActions` when carried) does something where it's offered: it's
  // read, and answered by a rule or the thing (not a stock reply). Only someone else being elsewhere may stop it
  // (offered lines leave those out: js/view.js).
  // And none repeats what the engine offers by itself (decision 52): ORDER or BUY of a thing that comes `from` somewhere, EAT or DRINK
  // of a `consumable` one (looked at wherever the thing is, even nowhere yet: those verbs may name what isn't here).
  const OFFERED = { order: "from", buy: "from", eat: "consumable", drink: "consumable" };
  for (const [id, o] of Object.entries(state.world.objects)) {
    const room = placeOf(state, id);
    for (const [list, held] of [[o.actions, false], [o.heldActions, true]]) for (const command of list || []) {
      const s = structuredClone(state);
      if (state.world.rooms[room]) s.player.at = room;
      else if (!held) s.world.objects[id].at = s.player.at;   // (nowhere yet: put where you are, to read what it offers)
      if (held) s.world.objects[id].at = "player";
      const r = parse(command, s, pack), a = r.actions?.length === 1 ? r.actions[0] : null, mark = a && OFFERED[a.verb];
      if (mark && a.obj && s.world.objects[a.obj]?.[mark] != null) {
        out.add("offer.repeats-engine", `${id}: offers "${command}", which the game offers by itself (${a.verb} ${a.obj}: ${mark === "from" ? "it comes from its source" : "it is consumable"}): leave it out`);
        continue;
      }
      if (!state.world.rooms[room]) continue;
      if (r.error?.scenery || r.error?.say === "@notHere") continue;
      if (!r.actions) out.add("offer.not-understood", `${id}: offers "${command}", which isn't understood (${r.error?.say})`);
      else if (!answered(s, r.actions).meaningful) out.add("offer.stock-reply", `${id}: offers "${command}", which gets only a stock reply ${held ? "when carried" : "there"}`);
    }
  }
}

// A source's topic for a thing that comes from it says something of its own.
export function sourceTopicWarnings(state, pack, out) {
  // A source's topic for a thing that comes from it (its key is the thing, or it is `about` it) says something of its own (decision 56):
  // ASK ABOUT says the topic, and ASK FOR once it can't come says the thing's `again` line, so the same words twice would be said twice.
  // The words compared are what is said in quotes ("…", «…», “…”), or the whole line with none; a list, any of its lines.
  const spoken = (line) => { const t = String(line), q = [...t.matchAll(/"([^"]*)"|«([^»]*)»|“([^”]*)”/g)].map(m => m[1] ?? m[2] ?? m[3]);
    return normalise(q.length ? q.join(" ") : t, pack.words.grammar); };
  for (const [id, o] of Object.entries(state.world.objects)) {
    const topics = state.world.objects[o.from]?.topics;
    if (o.again == null || !topics) continue;
    const again = new Set([].concat(o.again).map(spoken));
    for (const [key, topic] of Object.entries(topics))
      if (topic && typeof topic === "object" && (key === id || topic.about === id) && [].concat(topic.says ?? []).some(l => again.has(spoken(l))))
        out.add("source.topic-repeats-again", `${o.from}: its topic "${key}" says what ${id}'s again line says: give the topic words of its own`);
  }
}

// Everything a text names answers, and what a click examines; a thing that can be taken is not named in a room's text.
export function mentionProblems(state, pack, out) {
  // Everything a text names answers: "examine" each one where the text is read (an object's lines: with the object in hand) must
  // find a thing, scenery or a part, never "You see no … here". What a text marks ({label|id}) is checked here (a room's, and an
  // object's `here` and `lies`, by the clicks below); scenery words and parts answer by being scenery.
  const look = pack.words.verbs.examine[0];
  // What a line marks, read in room `room` (state `s`): [label, id, several?]. A bare mark, {word}, is the thing the game reads it as there
  // (js/narrator.js, markOf: its id, or the one thing of the room, else the one carried, with the word among its nouns); none or several: the word.
  const marked = (line, s = state, room = s.player.at) => [...String(packText(line, pack) ?? "").matchAll(/\{([^|}]+)(?:\|([^}]+))?\}/g)]
    .map(m => { if (m[2]) return [m[1], m[2]]; const r = markOf(s, m[1], room, pack); return [m[1], r.id ?? m[1], r.several]; });
  const answers = (s, m) => { const r = parse(look + " " + m, s, pack); return !!(r.actions || r.error?.scenery); };
  for (const [id, room] of Object.entries(state.world.rooms)) {
    const s = inRoom(state, id);
    // The picture's `shot` (BRIEF.md §7) marks the things it dresses the room with, {nets}: the word itself is what answers.
    // each marked word must answer where the room is read. Unmarked words are never looked at. English worlds only; warned of, never a problem.
    if (state.lang === "en" && typeof room.picture?.shot === "string")
      for (const w of new Set([...room.picture.shot.matchAll(/\{([^|}]+)\}/g)].map(m => m[1].trim().toLowerCase())))
        if (!answers(s, w)) out.add("shot.mark-unanswered", `${id}: its picture's shot marks "${w}", which nothing in the room answers to: give the room a scenery word or a part for it, or leave the mark out`);
  }
  for (const [id, o] of Object.entries(state.world.objects)) {
    const s = structuredClone(state);                // read where the object is (its room), with it in hand
    const room = placeOf(state, id);
    if (state.world.rooms[room]) s.player.at = room;
    s.world.objects[id].at = "player";
    if (o.container) s.world.objects[id].open = true;   // (what its own text marks inside it answers once it is opened)
    const own = collectTexts({ ...o, starts: undefined, stops: undefined }, id, pack).filter(x => !x.pack && !/^(here|lies)$/.test(x.field));
    const labels = [...new Set(own.flatMap(x => marked(x.text, s)).map(([l]) => l))];
    for (const l of labels) if (!answers(s, l)) out.add("mark.unanswered", `${id} marks "${l}", but nothing answers to it`);
  }
  // Clicking an object in the story examines it with the words shown ({label|id}: "Examine label"), so each label,
  // read where it's shown (a room's text, or an object's `here` line in its room), must name that very object.
  const clicks = (where, lines, lying) => {
    const s = inRoom(state, where), objects = s.world.objects;   // (a thing's `lies` line is said where it lies: its bare marks read so)
    const read = lying ? { ...s, world: { ...s.world, objects: { ...objects, [lying]: { ...objects[lying], at: where } } } } : s;
    for (const [label, oid, several] of lines.flatMap(l => marked(l, read, where))) {
      if (several) { out.add("mark.not-object", `${where}: "{${label}}" could be ${several.join(" or ")}: each answers to "${label}" here, so write which, {${label}|${several[0]}}`); continue; }
      if (!s.world.objects[oid]) {   // (a bare mark, {word}, comes here as its own id: say it as it was written)
        out.add("mark.not-object", label === oid ? `${where}: "{${label}}" marks "${label}", which is no thing's id, and no thing there answers to it: write {${label}|<the thing's id>}`
          : `${where}: "{${label}|${oid}}" marks "${oid}", which isn't an object`);
        continue;
      }
      if (!inScope(s, oid)) continue;                // shut away for now (the oars in the hut): shown only once it's open
      const r = parse(look + " " + label, s, pack);
      if (r.actions?.[0]?.obj !== oid) out.add("mark.click-mismatch", `${where}: clicking "${label}" doesn't examine "${oid}" ("${look} ${label}" isn't read as it)`);
    }
  };
  for (const [id, room] of Object.entries(state.world.rooms)) clicks(id, [].concat(room.describe || []));
  for (const [id, o] of Object.entries(state.world.objects))
    if (o.lies && o.portable !== true) out.add("lies.not-portable", `${id}: has a \`lies\` line, but it can't be taken, so the line is never said`);
  for (const [id, o] of Object.entries(state.world.objects)) {
    const at = placeOf(state, id), room = state.world.rooms[at] ? at : state.player.at;   // (a `lies` line is said wherever it is put down)
    if (o.here && state.world.rooms[at]) clicks(at, [o.here]);
    if (o.lies) clicks(room, [o.lies], id);
  }

  // A thing that can be taken is never named in a room's text (its `describe`, as written or as a rule rewrites it): the game says
  // where it lies, with its `here` line where it starts and a line of its own once it has been taken ("There is a biscuit here."), so
  // a room that names it would still show it after it has gone (meridian's canteen kept "A biscuit sits on a saucer" after it was eaten).
  const roomTexts = [
    ...Object.entries(state.world.rooms).map(([id, room]) => ({ id, where: id, texts: [].concat(room.describe || []) })),
    ...effectsOf(state).filter(({ effect: e }) => typeof e?.set === "string" && /^[^.]+\.describe(\.\d+)?$/.test(e.set) && state.world.rooms[e.set.split(".")[0]])
      .map(({ effect: e, where }) => ({ id: e.set.split(".")[0], where, texts: [].concat(e.to ?? []) }))];
  for (const { id, where, texts } of roomTexts)
    for (const [label, oid] of texts.flatMap(t => marked(t, inRoom(state, id), id)))
      if (state.world.objects[oid]?.portable) {
        const holder = holderOf(state, oid);
        out.add("room-text.names-portable", `${where === id ? id : `${where} (${id})`}: names {${label}${label === oid ? "" : "|" + oid}} in the room's description, but it can be taken: ${holder
          ? `${holder} holds it, so name and mark it in ${holder}'s own lines (here, examine) instead`
          : "give it a \`here\` line instead (the game says where a thing lies once it has been moved)"}`);
      }
  // A thing that can be taken and that a character holds (the goatskin on the camel's saddle) is shown by the character's own lines:
  // its own `here` and an overlay show only a thing lying in the room. So their `here` or `examine` marks it, or nothing shows it,
  // and it can't be clicked.
  for (const [oid, o] of Object.entries(state.world.objects)) {
    const holder = o.portable && holderOf(state, oid), h = holder && state.world.objects[holder];
    const room = h && placeOf(state, holder);
    if (h && ![].concat(h.here ?? [], h.examine ?? []).flatMap(t => marked(t, state.world.rooms[room] ? inRoom(state, room) : state, room)).some(([, m]) => m === oid))
      out.add("portable.held-unmarked", `${oid}: ${holder} holds it, but neither ${holder}'s here nor examine marks it ({…|${oid}}): nothing shows it, so it can't be clicked`);
  }
}

// Topics offered after talking: each idea something brings up.
export function topicWarnings(state, out) {
  // Topics offered after talking (js/view.js): each idea something brings up (an `opens` or a `know` somewhere), or the topic
  // could never be offered. (Each label, clicked, asks that very topic: the parser counts the label among the topic's words.)
  const brought = new Set(JSON.stringify([state.world.objects, state.rules, state.changes]).match(/"(?:opens|know)":(\[[^\]]*\]|"[^"]*")/g)?.flatMap(m => JSON.parse(m.slice(m.indexOf(":") + 1))) || []);
  for (const [id, o] of Object.entries(state.world.objects)) {
    for (const [key, t] of Object.entries(o.topics || {})) {
      if (key === "default" || !t || typeof t !== "object") continue;
      const about = t.about ?? key;
      if (!t.open && !state.world.objects[about] && !state.world.rooms[about] && !brought.has(about))
        out.add("topic.never-offered", `${id}: topic "${key}" is about "${about}", which nothing brings up (opens, know): it's never offered`);
    }
  }
}

// Every thing that can be taken is marked ({name} or {label|id}) in some text the player meets (BRIEF.md §8, "Objects"): its own `here`, the here or
// examine of whoever holds it, the line of whoever gives it or the `say` of the rule that brings it in (never its room's text: BRIEF.md §6, "Rooms"). A thing in a container is listed, marked, by the container's
// own "Inside:" line when it is opened; one carried from the start is known already, and so is what is left of a price (`remains`). A warning naming a portable thing no text marks.
export function markedThingWarnings(state, pack, out) {
  if (!plannedWorld(state)) return;   // (gated: the earlier worlds would get 5 + 3 + 1 + 1)
  const fold = (x) => normalise(String(x), pack.words.grammar), ids = new Set(), words = new Set();
  for (const { text, pack: fromPack } of worldTexts(state, pack)) {
    if (fromPack) continue;
    for (const m of String(text).matchAll(/\{([^|}]+)(?:\|([^}]+))?\}/g)) { if (m[2]) ids.add(m[2].trim()); else words.add(fold(m[1])); }
  }
  const left = new Set(Object.values(state.world.objects).map(x => x.remains).filter(x => typeof x === "string"));   // (what is left of a price, `remains`, comes into your hands: known already)
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.portable !== true || o.at === "player" || left.has(id) || state.world.objects[o.at]?.container) continue;
    if (ids.has(id) || [...(o.words?.nouns || []), o.name].filter(Boolean).some(w => words.has(fold(w)))) continue;
    out.add("portable.unmarked", `${id}: can be taken, but no text the player meets marks it ({${o.words?.nouns?.[0] ?? id}}): mark it in its \`here\` line, the line of whoever holds or gives it, or the \`say\` of the rule that brings it in (BRIEF.md §8, "Objects"), so it can be clicked and is plainly a thing`);
  }
}
