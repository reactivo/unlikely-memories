// Sleep: the engine's own SLEEP, the same in every world (ARCHITECTURE.md §5, "Sleep"). This file is the arithmetic of it, pure:
// how long a sleep lasts, which kind it is, what it gives back, what the question offers. The engine's sleep at run time (js/sleeping.js, `sleep`)
// does the rest: the refusals, the question, the clock, health, the conditions you are in, dreams and visions. The parser
// (js/parser.js) reads the words for a length from the language pack (`words.sleep`) into what is here: { name }, { until },
// { minutes }. A world writes nothing for any of it: a room may refuse (`sleep: "<line>"`), a room or a thing you sleep in may
// give a vision (`dream`), and a rule of its own may send you to sleep its own way (`{ "sleep": "next 07:30" }`).

import { MINUTE, HOUR, nextAt } from "./time.js?v=0.50.3";

const NAP = HOUR;                 // "A short nap": an hour
const FEW = 4 * HOUR;             // "A few hours": four
const MORNING = 7 * HOUR;         // "Until morning": the next 07:00
export const LONGEST = 12 * HOUR;        // no sleep is longer: a longer one is cut to this (the waking line says the real time)
export const HEAL_GAP = 20;              // turns since the last sleep that healed you before another can
export const DREAM_CHANCE = 0.25;        // a few hours or a night: the chance of a dream (the game's own numbers: state.rng)
export const SOBERS = 4 * HOUR;          // a neutral condition (drunk) is slept off by a sleep this long or longer

// The kind of a sleep, by how long it is: under 2 hours a nap, 2 to 6 a few hours, 6 or more until morning. The kind says what it
// gives back (healOf), whether it can dream, and which of the screen's three sleeps plays (content/art.js, effects.sleep).
export const kindOf = (ms) => (ms < 2 * HOUR ? "nap" : ms < 6 * HOUR ? "few" : "morning");
// The health a sleep of that kind gives back: a nap nothing, a few hours one step, a night two (never above full).
export const healOf = (kind) => ({ nap: 0, few: 1, morning: 2 })[kind] ?? 0;

// How long until the next time it is h:mm of the clock (world ms), never now: a time already past today, or now, is tomorrow's.
function untilClock(now, minutes) {
  return nextAt(now, (((minutes % 1440) + 1440) % 1440) * MINUTE) - now;
}

// The answers the question offers (by name): a nap, a few hours, until morning; "until morning" takes the place of "a few hours"
// when the next 07:00 is less than four hours away (then it is the shorter of the two).
export const choicesAt = (now) => (untilClock(now, MORNING / MINUTE) < FEW ? ["nap", "morning"] : ["nap", "few", "morning"]);

// How long a sleep the player chose lasts (ms), from the world time now: { name: "nap" | "few" | "morning" }, { until: minutes
// of the day (18:00 is 1080) }, or { minutes: n }. At most LONGEST. 0 for anything else.
export function lengthOf(chosen, now) {
  if (!chosen || typeof chosen !== "object") return 0;
  let ms = 0;
  if (chosen.name === "nap") ms = NAP;
  else if (chosen.name === "few") ms = FEW;
  else if (chosen.name === "morning") ms = untilClock(now, MORNING / MINUTE);
  else if (Number.isInteger(chosen.until)) ms = untilClock(now, chosen.until);
  else if (Number.isInteger(chosen.minutes) && chosen.minutes > 0) ms = chosen.minutes * MINUTE;
  return Math.min(ms, LONGEST);
}
