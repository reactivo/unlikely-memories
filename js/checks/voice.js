// Text and voice: the lengths of the texts, the narrator never hedges, no words of the other region, the words from the state written in a
// text and the questions for words (BRIEF.md §6, §8, §11). Pure: reads the state and the pack, never changes either.

import { normalise } from "../parser.js?v=0.73.0";
import { isAction } from "../actions.js?v=0.73.0";
import { TEXT_WORDS, PROPERTY_WORD } from "../words.js?v=0.73.0";
import { suggest, ownerOf } from "../fields.js?v=0.73.0";
import { unmarked, packText, effectsOf, worldTexts, collectTexts, shownTexts } from "./shared.js?v=0.73.0";

// Room texts within BRIEF.md §6, "How long".
export function roomLengthWarnings(state, out) {
  // Room texts within BRIEF.md §6, "How long": a room's text aims at about 45 words (warned past 80), 2 paragraphs (3 at most), the start room's too.
  for (const [id, room] of Object.entries(state.world.rooms)) {
    if (!Array.isArray(room.describe) || room.describe.some(p => typeof p !== "string" || p.startsWith("@"))) continue;
    const words = unmarked(room.describe.join(" ")).split(/\s+/).filter(Boolean).length;
    if (words > 80) out.add("length.room-words", `${id}: ${words} words; a room's text aims at about 45 words; ${words} is far past it`);
    if (room.describe.length > 3) out.add("length.room-paragraphs", `${id}: ${room.describe.length} paragraphs; 2, or 3 at most`);
  }
}

// Sleep (BRIEF.md §8, "Time"): a room refuses it (`sleep: "<line>"`) only as the exception. Past half the rooms it is warned of: the
// refusals are steering the clock or the player, which a world never does.
export function sleepWarnings(state, out) {
  const rooms = Object.values(state.world.rooms), refusing = rooms.filter(r => typeof r?.sleep === "string" && r.sleep).length;
  if (refusing * 2 > rooms.length) out.add("sleep.refused-most", `${refusing} of the ${rooms.length} rooms refuse sleep: more than half; a room refuses it only where lying down really can't happen, never to steer the clock or the player (BRIEF.md §8, "Time")`);
}

// The narrator states and never hedges (BRIEF.md §6, "The voice": the rule is by meaning; these are the wordings the checker can tell by sight):
// English text with one of these is a problem, naming the text and the words. What stands inside quotes ("…", «…», “…”) is a character's
// speech, and a character may be unsure aloud (BRIEF.md §6), so it is not read. Left out on purpose, because each hits an honest use in the
// worlds: "has the look of", "as though it" (similes), "maybe" and "might be".
const HEDGES = ["seems to", "apparently", "perhaps", "looks as though", "looks as if", "looked as though", "looked as if", "appears to", "it would seem"];
const unquoted = (text) => String(text).replace(/"[^"]*"|«[^»]*»|“[^”]*”/g, " ");
export function hedgeProblems(state, pack, bible, out) {
  if (state.lang !== "en") return;
  const seen = new Set(), re = new RegExp(`(?<![\\p{L}])(${HEDGES.join("|")})(?![\\p{L}])`, "iu");
  for (const { where, field, text, pack: fromPack } of [...worldTexts(state, pack), ...shownTexts(state, bible)]) {
    const m = !fromPack && re.exec(unquoted(unmarked(text)));
    const line = m && `${where} (${field}): hedges with "${m[1].toLowerCase()}" in "${text.length > 70 ? text.slice(0, 70) + "…" : text}": the narrator states and never hedges (BRIEF.md §6)`;
    if (line && !seen.has(line)) { seen.add(line); out.add("voice.hedge", line); }
  }
}

// ---- Words of the other region ----------------------------------------------------------------------------------------------
// A pack may list the words of one region of its language to avoid, with the one to prefer (`words.regional: { avoid: [word…],
// prefer: { word: the other } }`: Spanish from Spain avoids Latin American words, "carro" for "coche"). Every text a world is
// written in (what it says, the names and labels shown, the descriptions for screen readers, the card's title and blurb) is read
// word by word, folded like the pack's own words; a hit is a warning naming the word, where, and the word to say instead. Only the
// game's own text: what the player types is understood either way, and a world's word lists keep both forms.
export function regionalWarnings(state, pack, bible, out) {
  const r = pack.words.regional, g = pack.words.grammar || {}, norm = (x) => normalise(String(x), g);
  const avoid = new Map((r.avoid || []).map(w => [norm(w), w])), prefer = Object.fromEntries(Object.entries(r.prefer || {}).map(([k, v]) => [norm(k), v]));
  const shown = shownTexts(state, bible);            // names, labels and descriptions: what is shown but isn't one of the texts above
  const seen = new Set();
  for (const { where, field, text, pack: fromPack } of [...worldTexts(state, pack), ...shown]) {
    if (fromPack) continue;
    const plain = unmarked(text).replace(/\[[^\]]*\]/g, " ");
    for (const token of norm(plain).split(" ")) {
      if (!avoid.has(token)) continue;
      const line = `${where} (${field}): uses "${avoid.get(token)}", a word of another region of this language${prefer[token] ? `; the pack prefers "${prefer[token]}"` : ""}`;
      if (!seen.has(line)) { seen.add(line); out.add("voice.regional", line); }
    }
  }
}

// ---- Words from the state in the text ------------------------------------------------------------------------------
// A [..] in a text is one of the game's words ([time], [day], [weekday], [way]) or a declared property, [thing.property]
// (js/fields.js, "Words from the state in a text"). A name that is neither is a slip: the text would show it as written. A
// yes/no property shows as nothing. And a property that holds nothing yet (no `start`, nothing in the world sets it) shows
// as nothing too ("Ah, ."): warned of wherever the line could be shown before something sets it. In a rule that is
// where the rule can run before: not after a `set` of it earlier in the same rule, nor when the rule's own `if` asks
// about it. Only warns.
export function wordWarnings(state, pack, out) {
  const seen = new Set(), declared = state.properties || {}, paths = Object.keys(declared);
  const warn = (id, where, field, why) => { const line = `${where} (${field}): ${why}`; if (!seen.has(line)) { seen.add(line); out.add(id, line); } };

  // Every text: the words it names must be known.
  for (const { where, field, text } of worldTexts(state, pack)) {
    for (const [, token] of String(text).matchAll(/\[([^\[\]]+)\]/g)) {
      if (TEXT_WORDS.includes(token) || ANSWER_PATH.test(token)) continue;   // (an answer no `ask` sets: answerWarnings)
      if (/^[A-Za-z_][\w-]*\.[A-Za-z_][\w-]*$/.test(token)) {
        if (!declared[token]) warn("words.unknown", where, field, `[${token}] names a property that isn't declared${suggest(token, paths)}`);
        else if (declared[token].type === "boolean") warn("words.unknown", where, field, `[${token}] is a yes/no property: a text shows numbers and words, so it would show nothing`);
        continue;
      }
      const same = paths.find(x => x.split(".")[1] === token);
      warn("words.unknown", where, field, `[${token}] isn't one of the game's words (${TEXT_WORDS.join(", ")}) or a property written thing.property${same ? ` (did you mean [${same}]?)` : suggest(token, TEXT_WORDS)}`);
    }
  }

  // A declared number or string that holds nothing now: no start, and nothing at load put a value in it.
  const empty = (path) => {
    const d = declared[path];
    if (!d || d.type === "boolean") return false;
    const [id, prop] = path.split(".");
    const o = ownerOf(state, id);
    return typeof (o?.[prop] ?? d.start) !== "number" && typeof (o?.[prop] ?? d.start) !== "string";
  };
  const named = (text) => [...String(text).matchAll(PROPERTY_WORD)].map(m => m[1] + "." + m[2]).filter(empty);
  const unset = (where, field, path) => warn("words.unset", where, field, `[${path}] can be shown before anything sets it, and it has no start: it would show nothing (give it a start)`);

  // Rooms, things and puzzles: a text is there to be shown at any time.
  const pieces = [...Object.entries(state.world.rooms), ...Object.entries(state.world.objects), ...Object.entries(state.puzzles || {})];
  for (const [id, piece] of pieces)
    for (const { field, text } of collectTexts(piece, id, pack)) for (const path of named(text)) unset(id, field, path);

  // Rules: their effects in order, and the named changes they run.
  const walk = (effects, where, set, guard, depth = 0) => {
    for (const e of Array.isArray(effects) ? effects : []) {
      if (!e || typeof e !== "object") continue;
      for (const { field, text } of collectTexts(e, where, pack))
        for (const path of named(text)) if (!set.has(path) && !guard.includes(path)) unset(where, field, path);
      if (typeof e.set === "string") set.add(e.set);
      if (typeof e.change === "string" && depth < 5) walk(state.changes?.[e.change], "change " + e.change, set, guard, depth + 1);
    }
  };
  for (const r of state.rules) {
    const asked = JSON.stringify(r.if ?? []);
    walk(r.do, r.id, new Set(), paths.filter(x => asked.includes(JSON.stringify(x) + ":")));
  }
}

// ---- Questions for words ---------------------------------------------------------------------------------------------
// An `ask` (BRIEF.md §8, "Questions for words") is answered once, and a rule catches the answer: { verb: "answer", question:
// "<key>" } (a rule matching "answer" with no `question` catches every one). An ask no rule catches only ever gets the stock
// reply; and a rule, a text or a condition that reads player.answers.<key> when nothing asks "<key>" reads nothing. Only warns.
const ANSWER_PATH = /^player\.answers\.[A-Za-z_][\w-]*$/;
export function answerWarnings(state, pack, out) {
  const asked = new Map();
  for (const { effect: e, where } of effectsOf(state))
    if (typeof e.ask === "string" && !asked.has(e.ask)) asked.set(e.ask, where);
  const list = (x) => [].concat(x ?? []);
  const catches = (r, key) => isAction(r) && list(r.match?.verb).includes("answer") && (r.match.question === undefined || list(r.match.question).includes(key));
  const stock = packText("@answerUnheard", pack);
  for (const [key, where] of asked)
    if (!state.rules.some(r => catches(r, key)))
      out.add("ask.unanswered", `${where}: asks "${key}", but no rule catches the answer ({ "verb": "answer", "question": "${key}" }): it only gets "${stock}"`);
  const readers = [...state.rules.map(r => [r.id, r]), ...Object.entries(state.changes || {}).map(([id, x]) => ["change " + id, x]),
                   ...Object.entries(state.world.rooms), ...Object.entries(state.world.objects), ...Object.entries(state.puzzles || {})];
  for (const [where, piece] of readers)
    for (const key of new Set([...JSON.stringify(piece ?? null).matchAll(/player\.answers\.([A-Za-z_][\w-]*)/g)].map(m => m[1])))
      if (!asked.has(key)) out.add("ask.never-asked", `${where}: reads player.answers.${key}, but nothing asks "${key}" ({ "ask": "${key}" }): it is always empty`);
}
