// Speech: how what you say comes out, and how people answer, while something has hold of your tongue (a condition's
// `speech`: js/conditions.js). A small piece of its own, so anything that changes speech uses it the same way.
//   slur:   words said (SAY, SHOUT, SING and a world's own `speech: true` verbs) come out slurred: letters doubled and
//           swapped, words run together. The game says how they came out (the pack's `slurred`), and rules read the
//           slurred words as `$text`: a rule waiting for a plain name doesn't hear one. Never an answer to a question
//           (`ask`): those are the game's own input and always come through as typed.
//   answer: what people say to a question they have no answer for (instead of their `default`), a line or a list.
// Language-free and deterministic: the changes are picked with the state's own random numbers (js/random.js), so a
// replay slurs the same way. Pure.

import { random } from "./random.js";
import { ACTIONS } from "./actions.js";
import { modifiers } from "./conditions.js";

// Is this action words said (with words to say)?
export const spoken = (state, action) => typeof action.text === "string" && action.text.trim() !== "" && action.verb !== "answer"
  && !!(ACTIONS[action.verb]?.speech || state.vocab?.[action.verb]?.speech);
// Does something slur your words now?
export const slurring = (state) => modifiers(state, "speech").some(s => s.slur === true);
// The line people answer with now when they have no answer (the first active condition's), or null.
export const answerLine = (state) => modifiers(state, "speech").find(s => s.answer != null)?.answer ?? null;

// Words, slurred: in each word of three letters or more, a letter now and then doubled (a vowel drawn out) or two next to
// each other swapped; now and then two words run together. At least one change, so it always shows. Returns
// [the slurred words, the generator's next position].
export function slur(text, rng) {
  let seed = rng;
  const roll = () => { const [v, next] = random(seed); seed = next; return v; };
  const words = String(text).split(/\s+/).filter(Boolean);
  let changed = false;
  const out = words.map(w => {
    if (w.length < 3) return w;
    let x = w;
    if (roll() < 0.6) {                                          // a letter drawn out: a vowel if there is one
      const vowels = [...x].map((c, i) => (/[aeiouáéíóú]/i.test(c) ? i : -1)).filter(i => i >= 0);
      const i = vowels.length ? vowels[Math.floor(roll() * vowels.length)] : 1 + Math.floor(roll() * (x.length - 1));
      x = x.slice(0, i + 1) + x[i] + x.slice(i + 1); changed = true;
    }
    if (x.length > 3 && roll() < 0.35) {                         // two letters inside it swapped
      const i = 1 + Math.floor(roll() * (x.length - 3));
      x = x.slice(0, i) + x[i + 1] + x[i] + x.slice(i + 2); changed = true;
    }
    return x;
  });
  let said = out[0] ?? "";
  for (const w of out.slice(1)) { if (roll() < 0.3) { said += w; changed = true; } else said += " " + w; }
  if (!changed && said) said = said.slice(0, -1) + said.at(-1) + said.at(-1);   // a short word: its last letter drawn out
  return [said, seed];
}
