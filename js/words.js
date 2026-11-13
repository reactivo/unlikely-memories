// Words: the engine's own words in a text, and how a word is read. What a language pack needs to name a thing and agree with it
// (`grammarOf`); the words from the state in a text, [time] and the declared properties written [thing.property]
// (`propertyText`, `propertyWords`, `PROPERTY_WORD`), and what the player typed to a question, [player.answers.<key>] (`answerText`,
// `ANSWER_WORD`, `ASK_KEY`, `foldAnswer`: how an answer is compared). Pure: reads the state, never changes it.

import { ownerOf } from "./fields.js?v=0.48.0";

// What a language pack needs to name a thing in a sentence and agree with it, from its `words`: gender `g`, number `pl`, and
// `proper` (a proper name: the pack's `the` adds no article, and the name keeps its capital: js/narrator.js, inSentence).
// { g, pl, proper } with only the ones it has, or nothing. The one rule for every line that names a thing or agrees with it.
export function grammarOf(words) {
  if (!words || !(words.g || words.pl || words.proper)) return undefined;
  return Object.fromEntries([["g", words.g], ["pl", words.pl], ["proper", words.proper]].filter(([, v]) => v));
}

// ---- Words from the state in a text --------------------------------------------------------------------------------
// A text can hold the world's own words, [time] [day] [weekday] [way] (js/narrator.js), and any declared property
// written [thing.property]: [player.name], [bell.rung], [sky.state]. Numbers and strings are shown as they are; a
// boolean, or a property nothing has set yet (and with no `start`), is shown as nothing. A name that isn't declared is
// left as written, so it is easy to spot (and the checker warns of it).
export const TEXT_WORDS = ["time", "day", "weekday", "way"];
export const PROPERTY_WORD = /\[([A-Za-z_][\w-]*)\.([A-Za-z_][\w-]*)\]/g;
// And what the player typed to a question (`ask`), [player.answers.<key>]: as typed (trimmed), nothing before it is answered.
export const ANSWER_WORD = /\[player\.answers\.([A-Za-z_][\w-]*)\]/g;
export const answerText = (state, key) => { const v = state.player?.answers?.[key]; return typeof v === "string" ? v : ""; };

// ---- Questions for words -------------------------------------------------------------------------------------------
// The key of an `ask` ("name", "password", "verdict"): a plain word, never "confirm" (the yes/no question's own).
export const ASK_KEY = /^[A-Za-z_][\w-]*$/;
// An answer as conditions compare it: no case, no accents (ñ is n), no punctuation, single spaces, trimmed. Both sides of the
// comparison are folded, so a world writes its words plainly: { "player.answers.verdict": { "in": ["halloran", "mrs halloran"] } }.
export const foldAnswer = (t) => String(t).normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

// What a declared property holds now, as a text: its number or string, "" for anything else; undefined if it isn't declared.
// The same places a rule reads it from: the player, the game, a thing, a room.
export function propertyText(state, id, prop) {
  const d = state.properties?.[id + "." + prop];
  if (!d) return undefined;
  const v = ownerOf(state, id)?.[prop] ?? d.start ?? null;
  return typeof v === "number" || typeof v === "string" ? String(v) : "";
}

// The properties a text names, as they are now: { "player.name": "Diego" } (declared ones only; and the answers it names,
// { "player.answers.verdict": "Voss" }). The engine keeps this
// with a line it says, as it keeps the time ([time] in it), so the line shows what was true when it was said.
export function propertyWords(state, text) {
  const out = {};
  if (typeof text !== "string" || !text.includes("[")) return out;
  for (const [, id, prop] of text.matchAll(PROPERTY_WORD)) {
    const v = propertyText(state, id, prop);
    if (v !== undefined) out[id + "." + prop] = v;
  }
  for (const [, key] of text.matchAll(ANSWER_WORD)) out["player.answers." + key] = answerText(state, key);
  return out;
}
