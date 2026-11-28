// Clock times in the texts (BRIEF.md §4): a time named in the prose with nothing in the world at that hour is a likely slip. Pure.

import { worldTime, parts } from "../time.js?v=0.77.0";
import { unmarked, worldTexts } from "./shared.js?v=0.77.0";

// ---- Clock times in the text --------------------------------------------------------------------------------------
// The checker can't read meaning, but a time named in the prose ("after six", "the 17:15", "a las ocho") with nothing
// in the world at that hour is a likely slip. Deterministic, English and Spanish, and only WARNS. A mention needs a
// time marker (a clock face, o'clock, am/pm, half/quarter past, at/after/before/until/till/from/by + a number, noon,
// midnight; a las…, mediodía…), so "six floors" is not one. A 12-hour value N reads as N or N+12. Texts with
// [time] are left alone: their time comes from the clock.

const EN_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const ES_NUMBERS = { una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12 };
const EN_N = Object.keys(EN_NUMBERS).join("|"), ES_N = Object.keys(ES_NUMBERS).join("|");
const number = (w, words) => { const n = /^\d+$/.test(w) ? +w : words[w]; return n >= 1 && n <= 12 ? n : null; };
// What may follow a number after a marker ("at six", "after eight."), so that "at six floors" isn't a time.
const END = String.raw`(?=\s*$|\s*[,.;:!?)"\u2014\u2013\u201d-]`;
const EN_AFTER = END + String.raw`|\s+(?:to|till|until|and|or|in|at|on|tonight|sharp|exactly|every|each|the|then|when|but|he|she|they|it|we|you|a\.?m|p\.?m)\b)`;
const ES_AFTER = END + String.raw`|\s+(?:y|a|hasta|o|e|en|de|del|por|la|el|se|ya|al|pm|am)\b)`;

// The clock times a text names: [{ text, times: [{ hour, minute }] }], each with its readings (12 or 24 hour).
export function clockMentions(raw) {
  const text = unmarked(raw).replace(/\s+/g, " ").toLowerCase();
  const found = [], taken = [];
  const free = (a, b) => !taken.some(([x, y]) => a < y && x < b);
  const add = (m, hour, minute, exact) => {
    const a = m.index, b = a + m[0].length;
    if (!free(a, b)) return;
    taken.push([a, b]);
    const hours = exact || hour === 0 || hour > 12 ? [hour % 24] : [hour % 12, hour % 12 + 12];
    found.push({ text: m[0].trim(), times: hours.map(h => ({ hour: h, minute })) });
  };
  const all = (re, f) => { for (const m of text.matchAll(re)) f(m); };
  all(/(?<![\d:])(\d{1,2}):(\d{2})(?![\d:])/g, m => { if (+m[1] < 24 && +m[2] < 60) add(m, +m[1], +m[2], m[1].length === 2 && m[1][0] === "0"); });
  all(new RegExp(String.raw`\b(\d{1,2}|${EN_N})(?::(\d{2}))?\s*([ap])\.?m\b\.?`, "g"), m => {
    const n = number(m[1], EN_NUMBERS); if (n === null) return;
    add(m, m[3] === "p" ? n % 12 + 12 : n % 12, +(m[2] || 0), true);
  });
  all(new RegExp(String.raw`\b(\d{1,2}|${EN_N})\s+o['\u2019]?clock\b`, "g"), m => { const n = number(m[1], EN_NUMBERS); if (n !== null) add(m, n, 0); });
  all(new RegExp(String.raw`\b(half|quarter)\s+(past|to)\s+(\d{1,2}|${EN_N})\b`, "g"), m => {
    const n = number(m[3], EN_NUMBERS); if (n === null || (m[1] === "half" && m[2] === "to")) return;
    if (m[2] === "past") add(m, n, m[1] === "half" ? 30 : 15); else add(m, (n + 11) % 12 || 12, 45);
  });
  // "ten to five", "twenty past eleven", "twenty to midnight" (the minutes by name)
  const MINUTES = { five: 5, ten: 10, twenty: 20, "twenty-five": 25 };
  all(new RegExp(String.raw`\b(?:at\s+)?(five|ten|twenty|twenty-five)\s+(past|to)\s+(\d{1,2}|${EN_N}|midnight|noon)\b`, "g"), m => {
    const n = m[3] === "midnight" ? 12 : m[3] === "noon" ? 12 : number(m[3], EN_NUMBERS); if (n === null) return;
    if (m[2] === "past") add(m, m[3] === "midnight" ? 0 : n, MINUTES[m[1]], m[3] === "midnight" || m[3] === "noon");
    else add(m, m[3] === "midnight" ? 23 : m[3] === "noon" ? 11 : (n + 11) % 12 || 12, 60 - MINUTES[m[1]], m[3] === "midnight" || m[3] === "noon");
  });
  all(new RegExp(String.raw`\b(?:at|after|before|until|till|from|by)\s+(\d{1,2}|${EN_N})\b(?!:\d)${EN_AFTER}`, "g"), m => {
    const n = number(m[1], EN_NUMBERS); if (n === null) return;
    if (/(?:^|\s)(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*$/.test(text.slice(0, m.index))) return;   // "one by one"
    if (m[1] === "one" && !/^\s*(?:$|[,.;:!?)"\u2014\u2013\u201d-]|sharp)/.test(text.slice(m.index + m[0].length - 0))) return;   // "at one end"
    add(m, n, 0);
  });
  all(/\b(noon|midday|midnight)\b(?!\s+(?:blue|black|oil|sun))/g, m => add(m, m[1] === "midnight" ? 0 : 12, 0, true));
  // Spanish
  all(new RegExp(String.raw`\b(?:a|hasta|desde|despu[e\u00e9]s de|antes de|sobre|tras)\s+la\s+(una)\b(?:\s+y\s+(media|cuarto)\b)?`, "g"), m => add(m, 1, m[2] === "media" ? 30 : m[2] ? 15 : 0));
  all(new RegExp(String.raw`\b(?:a|hasta|desde|despu[e\u00e9]s de|antes de|sobre|tras)\s+las\s+(\d{1,2}|${ES_N})\b(?!:\d)(?:\s+(?:y\s+(media|cuarto)|menos\s+(cuarto))\b|(${ES_AFTER}))`, "g"), m => {
    const n = number(m[1], ES_NUMBERS); if (n === null) return;
    if (m[3]) add(m, (n + 11) % 12 || 12, 45); else add(m, n, m[2] === "media" ? 30 : m[2] ? 15 : 0);
  });
  all(new RegExp(String.raw`\b(?:las|la)\s+(\d{1,2}|${ES_N})\s+(?:y\s+(media|cuarto)|menos\s+(cuarto))\b`, "g"), m => {
    const n = number(m[1], ES_NUMBERS); if (n === null) return;
    if (m[3]) add(m, (n + 11) % 12 || 12, 45); else add(m, n, m[2] === "media" ? 30 : 15);
  });
  all(/\b(mediod[i\u00ed]a|medianoche)\b/g, m => add(m, m[1] === "medianoche" ? 0 : 12, 0, true));
  return found;
}

// The hours the world does something at: conditions on time.hour (every operator's value, both ends of a range), the
// times of scheduled rules, waitFor, time effects and puzzles ("next 23:30", "day 1 17:10", "17:15"), and the hour
// the world starts at. Returns a Set of 0–23.
function worldHours(state) {
  const hours = new Set();
  const hour = (n) => { if (Number.isFinite(n)) hours.add(((n % 24) + 24) % 24); };
  const clocks = (s) => { for (const m of String(s).matchAll(/(\d{1,2}):\d{2}/g)) hour(+m[1]); };
  const numbers = (v) => { if (Array.isArray(v)) v.forEach(numbers); else if (v && typeof v === "object") Object.values(v).forEach(numbers); else hour(v); };
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    if (node.when === "at" && typeof node.at === "string") clocks(node.at);
    for (const [k, v] of Object.entries(node)) {
      if (/^\$?time\.hour$/.test(k)) numbers(v);
      else if (k === "time" && typeof v === "string") clocks(v);
      else walk(v);
    }
  };
  walk([state.world, state.rules, state.changes, state.puzzles]);
  hour(parts(worldTime(state)).hour);
  return hours;
}

// A clock time a text names with nothing in the world at that hour (see clockMentions): a warning each.
export function clockTimeWarnings(state, pack, out) {
  const hours = worldHours(state), seen = new Set();
  const show = ({ hour, minute }) => `${hour}:${String(minute).padStart(2, "0")}`;
  for (const { where, field, text } of worldTexts(state, pack)) {
    if (/\[time\]/.test(text)) continue;
    for (const m of clockMentions(text)) {
      if (m.times.some(t => hours.has(t.hour))) continue;
      const line = `${where} (${field}): "${m.text}" names ${m.times.map(show).join("/")}, but nothing in the world happens at that hour`;
      if (!seen.has(line)) { seen.add(line); out.add("clock.unmatched-time", line); }
    }
  }
}
