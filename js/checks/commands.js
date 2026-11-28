// What a text offers the player to type: a way in or out the room does not answer, a command in backticks the game does not read, a verb offered on
// a scenery noun that nothing answers (BRIEF.md §4, §6, §8). Pure: reads the state and the pack, never changes either.

import { parse, normalise } from "../parser.js?v=0.76.0";
import { answers as answered } from "../engine.js?v=0.76.0";
import { placeOf } from "../place.js?v=0.76.0";
import { isAction } from "../actions.js?v=0.76.0";
import { inRoom, unmarked, shortText, worldTexts } from "./shared.js?v=0.76.0";

// ---- A room that says you can go in or out, with nothing that answers ------------------------------------------------
// A room's text (its `describe`, a scenery's `says`, the `examine` and `here` of a thing in it) that invites the player to go
// in ("step inside", "enter") or out ("get out"), in the words of the pack's `invites` (words.invites: { in, out, not, lead, second },
// whole words; a match right after one of `not` is a refusal, "don't go in"), while the room has nothing that answers: "in" (or
// "out") typed in it is only "there's no way", and for in, no "enter" alone finds a door and no boat or the like is there to get into. Like the
// other text warnings it is a nudge: mark the exit that goes there `in: true` (`out: true`), or give the room an `in` / `out` exit.
// It reads only a line that TELLS the player to go: the phrase opens a sentence ("Go out by the gate."), or follows a word of `lead` ("you can go
// out", "a way to go out"), or is a second-person form of its own (`second`: Spanish *entras*); never description, where the same words have a
// subject of their own ("the bulbs tick on and go out", "la luz entra").
export function wayWarnings(pack, state, out) {
  const invites = pack.words.invites;
  if (!invites) return;
  const lead = new Set(invites.lead ?? invites.can ?? []), second = new Set(invites.second ?? []);
  const find = (text, phrases) => {
    const lowered = unmarked(text).toLowerCase(), tokens = [...lowered.matchAll(/[\p{L}\p{N}'\u2019]+/gu)].map(m => ({ w: m[0], from: m.index, to: m.index + m[0].length }));
    const norm = (w) => w.replace(/\u2019/g, "'");
    for (const phrase of phrases) {
      const p = phrase.split(" ");
      for (let i = 0; i + p.length <= tokens.length; i++) {
        if (!p.every((w, j) => tokens[i + j].w === w)) continue;
        if (tokens.slice(Math.max(0, i - 2), i).some(t => invites.not.includes(norm(t.w)))) continue;
        const opens = i === 0 || /[.!?:;"«»¡¿(\n\u2014\u2013]/.test(lowered.slice(tokens[i - 1].to, tokens[i].from));
        if (opens || second.has(phrase) || lead.has(norm(tokens[i - 1].w))) return phrase;
      }
    }
    return null;
  };
  const texts = (id, room) => [
    ...(Array.isArray(room.describe) ? room.describe : []).filter(t => typeof t === "string" && !t.startsWith("@")).map(t => ({ field: "describe", text: t })),
    ...(room.scenery || []).filter(x => typeof x.says === "string").map(x => ({ field: `scenery "${x.words?.[0]}"`, text: x.says })),
    ...Object.entries(state.world.objects).filter(([, o]) => o.at === id)
      .flatMap(([oid, o]) => ["examine", "here", "lies"].filter(k => typeof o[k] === "string").map(k => ({ field: `${oid} ${k}`, text: o[k] })))
  ];
  // Does typing it in that room get an answer: a move, a line, a thing to enter? (not the stock "no way")
  const answers = (id, commands) => {
    const s = { ...state, player: { ...state.player, at: id, in: null } };
    return commands.some(c => { const r = parse(c, s, pack); return r.actions && answered(s, r.actions).meaningful; });
  };
  for (const [id, room] of Object.entries(state.world.rooms)) {
    const found = texts(id, room);
    for (const [way, verb] of [["in", pack.words.verbs.enter[0]], ["out", null]]) {
      const hit = found.map(f => ({ ...f, phrase: find(f.text, invites[way]) })).find(f => f.phrase);
      const enterable = way === "in" && Object.values(state.world.objects).some(o => o.at === id && o.enterable);   // a boat to get into
      if (!hit || enterable || answers(id, [pack.words.dirs[way][0], ...(verb ? [verb] : [])])) continue;
      out.add("text.invites-way", `${id} (${hit.field}): says "${hit.phrase}", but nothing in the room answers "${pack.words.dirs[way][0]}": mark the exit that goes ${way} \`${way}: true\` (or give the room an \`${way}\` exit)`);
    }
  }
}

// ---- Commands written in the text -------------------------------------------------------------------------------------------
// A command in backticks in a text the world writes (a description, a line said, a hint, an ending, a reply) becomes a clickable
// command (BRIEF.md §6, "Markup and typography"), so it must be one the game reads, in the world's language: understood by the parser, and
// naming only what the world has. It is tried where the text is read (the room, or the thing's room); a thing that is only
// shut away or elsewhere for now (the oars in the hut) doesn't count against it, so a command that is understood nowhere is
// retried with everything in reach. A text from the language pack ("@help") is the pack's own and is left alone. Each problem
// names the text, the command and why.
export function commandProblems(state, pack, out) {
  const seen = new Set(), rooms = Object.keys(state.world.rooms);
  // Everything in reach: each thing in the room, out of any container (a thing that is still shut away, or elsewhere, is not
  // what a command is wrong about).
  const reachAll = (room) => {
    const s = structuredClone(inRoom(state, room));
    for (const o of Object.values(s.world.objects)) o.at = room;
    return s;
  };
  const read = (command, s) => {
    const r = parse(command, s, pack);
    if (r.actions || r.meta) return { ok: true };
    const e = r.error || {};
    if (e.scenery || e.say === "@which" || e.say === "@whoMean") return { ok: true };     // read: a scenery answers; the thing is only ambiguous
    return { ok: false, error: e };
  };
  const NOT_HERE = ["@notHere", "@onlyMentioned", "@noIt", "@noPerson"];
  const why = (e, command) => {
    const arg = Array.isArray(e.arg) ? e.arg.join(" ") : e.arg;
    if (e.say === "@unsure") return e.word ? `isn't understood: "${e.word}" is not a word the game knows in this language` : "isn't read as a command";
    if (e.say === "@noVerb") return "starts with no verb the game knows";
    if (e.say === "@whatTo") return `needs something to act on after "${arg ?? command}"`;
    if (NOT_HERE.includes(e.say)) return `names ${arg ? `"${arg}"` : "a thing"}, which nothing in the world answers to (no object, scenery, part or room by that name)`;
    return `isn't understood (${e.say})`;
  };
  for (const { where, field, text, pack: fromPack } of worldTexts(state, pack)) {
    if (fromPack) continue;
    for (const [, command] of String(text).matchAll(/`([^`]+)`/g)) {
      const room = state.world.rooms[where] ? [where] : state.world.objects[where] && state.world.rooms[placeOf(state, where)] ? [placeOf(state, where)] : rooms;
      let result = room.map(r => read(command, inRoom(state, r))).find(x => x.ok);
      if (!result) {
        const first = room.map(r => read(command, inRoom(state, r)))[0];
        result = NOT_HERE.includes(first.error.say) ? room.map(r => read(command, reachAll(r))).find(x => x.ok) || first : first;
      }
      if (result.ok) continue;
      const line = `${where} (${field}): the text "${shortText(text)}" offers the command \`${command}\`, which ${why(result.error, command)}`;
      if (!seen.has(line)) { seen.add(line); out.add("command.unreadable", line); }
    }
  }
}

// ---- A scenery noun with a verb that nothing answers -------------------------------------------------------------------------
// A room's text (its description, and what each thing lying there says of itself) that offers a verb the game knows on one of the
// room's scenery nouns ("you can row out to the boat": row; boat), when typing that gets nothing but the stock reply: scenery answers
// only to being looked at, so unless the noun is also something the room can answer for (a thing, a part, a way it leads, or a
// rule for the verb that names the scenery), the text invites what the game can't do. Offered means an obvious verb after a word
// of the pack's `words.invites.can` ("you", "can", "could"…: "you can swim"; Spanish "puedes", "podrías"…), not a word that is
// only spelt like a verb ("shut shops", "lift doors"), within a few words of the noun. The verbs are the pack's and the ones the
// world adds; looking-type verbs (look, examine, read, search) are left out, since scenery has an answer for them. A warning, never
// a problem: it names the room, the noun and the verb. Only the words the text itself uses; nothing is guessed beyond them.
const PASSIVE = new Set(["look", "examine", "read", "search", "inventory", "time", "status", "help", "hint", "wait", "think"]);
export function sceneryVerbWarnings(state, pack, out) {
  const g = pack.words.grammar || {}, norm = (x) => normalise(String(x), g), seen = new Set();
  const can = new Set((pack.words.invites?.can || []).map(norm));
  if (!can.size) return;
  const verbs = [];                           // { id, phrase, parts }, longest first
  for (const [id, list] of [...Object.entries(pack.words.verbs), ...Object.entries(state.vocab || {}).map(([id, v]) => [id, v.words])]) {
    if (PASSIVE.has(id)) continue;
    for (const w of (list || []).map(norm).filter(w => w.length > 1)) verbs.push({ id, phrase: w, parts: w.split(" ") });
  }
  verbs.sort((a, b) => b.parts.length - a.parts.length);
  const linkers = new Set([...(pack.words.articles || []), ...(pack.words.preps || [])].map(norm).concat(["out", "up", "off", "over", "down", "away", "fuera", "arriba", "abajo", "lejos"]));
  const markup = (t) => unmarked(t).replace(/\[[^\]]*\]/g, " ");
  for (const [roomId, room] of Object.entries(state.world.rooms)) {
    // The room's scenery: what its text mentions without being a thing, and the fixed things (not portable) that lie in it.
    const scenery = [...(room.scenery || []).filter(x => Array.isArray(x.words)),
      ...Object.entries(state.world.objects).filter(([oid, o]) => !o.portable && placeOf(state, oid) === roomId && o.words?.nouns?.length).map(([oid, o]) => ({ id: oid, words: o.words.nouns }))];
    if (!scenery.length) continue;
    const texts = [...(Array.isArray(room.describe) ? room.describe : []).filter(t => typeof t === "string" && !t.startsWith("@")).map(t => ({ field: "describe", text: t })),
      ...Object.entries(state.world.objects).filter(([oid, o]) => placeOf(state, oid) === roomId && typeof o.here === "string" && !o.here.startsWith("@")).map(([oid, o]) => ({ field: `${oid} here`, text: o.here })),
      ...Object.entries(state.world.objects).filter(([oid, o]) => placeOf(state, oid) === roomId && typeof o.lies === "string" && !o.lies.startsWith("@")).map(([oid, o]) => ({ field: `${oid} lies`, text: o.lies }))];
    const there = inRoom(state, roomId);
    for (const { field, text } of texts) for (const sentence of markup(text).split(/[.!?;:—–«»]+/)) {
      const tokens = norm(sentence).replace(/[.,;]/g, " , ").split(/\s+/).filter(Boolean);
      for (let i = 1; i < tokens.length; i++) {
        if (!can.has(tokens[i - 1])) continue;
        const v = verbs.find(p => p.parts.every((w, k) => tokens[i + k] === w));
        if (!v) continue;
        let content = 0;
        for (let j = i + v.parts.length; j < tokens.length && j < i + v.parts.length + 5; j++) {
          const noun = scenery.find(x => x.words.some(w => norm(w) === tokens[j]));
          if (noun) {
            const key = `${roomId} ${v.id} ${tokens[j]}`;
            if (!seen.has(key) && !answeredByWorld(state, there, v, tokens[j], noun, pack)) {
              seen.add(key);
              out.add("text.scenery-verb", `${roomId} (${field}): "${shortText(sentence)}" offers "${v.phrase}" with the scenery "${tokens[j]}", and nothing answers it: "${v.phrase} ${tokens[j]}" gets only the stock reply (give it a thing or a rule, or reword)`);
            }
            break;
          }
          if (tokens[j] === ",") break;
          if (!linkers.has(tokens[j]) && ++content > 1) break;
        }
      }
    }
  }
}
// Does the world answer "verb noun" in this room: a thing or part that really answers it (not the stock reply), the way a scenery
// leads, or a rule for that verb that names the scenery (`match.scenery`: using something on it)?
function answeredByWorld(state, there, v, word, scenery, pack) {
  const r = parse(`${v.phrase} ${word}`, there, pack);
  if (r.actions) return answered(there, r.actions).meaningful;
  if (!r.error?.scenery) return true;                                       // not understood as scenery: another warning's business
  const ids = [scenery.id, scenery.words[0]].filter(Boolean);
  return state.rules.some(rule => {
    const m = rule.match || {};
    return isAction(rule) && [].concat(m.verb ?? []).includes(v.id) && [].concat(m.scenery ?? []).some(x => ids.includes(x));
  });
}
