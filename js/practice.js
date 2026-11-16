// The practice thing: the one thing HELP's `{object|practice_thing}` marker examines (INTERFACE.md, HELP). It belongs to the language pack
// (`practice` in content/en.js and es.js: its name, nouns, examine text, action and reply), never to a world: a world never declares it
// and the checker ignores it. It is an ordinary thing of the state, made once when a game starts (or a saved one loads), with no room: in
// no list of what lies somewhere, what you carry or the map, and always within reach (js/place.js inScope, js/engine.js `place`).
// Its words are the pack's (js/parser.js withWorld); a world's own thing with the same nouns wins over it.
// Pure: only adds the thing to a state it is given.

import en from "../content/en.js?v=0.61.3";
import es from "../content/es.js?v=0.61.3";

const PACKS = { en, es };

export const PRACTICE = "practice_thing";
export const VERB = "practice";                       // the verb its one action is: "Test action", answered by the rule below

// The state with the practice thing in it (the same state when it already is).
export function withPractice(state) {
  const pack = PACKS[state.lang]?.practice;
  if (!pack || state.world.objects[PRACTICE]) return state;
  return {
    ...state,
    world: { ...state.world, objects: { ...state.world.objects, [PRACTICE]: {
      name: "@practice.name", words: structuredClone(pack.words), examine: "@practice.examine", actions: ["@practice.action"], fixed: true
    } } },
    vocab: { ...state.vocab, [VERB]: { words: [], object: "optional" } },
    rules: [...state.rules, { id: "practice_test", match: { verb: VERB }, do: [{ say: "@practice.test" }] }]
  };
}

// The state without it: what the checker reads (a world never declares it, so the checker never sees it).
export function withoutPractice(state) {
  if (!state.world.objects[PRACTICE]) return state;
  const { [PRACTICE]: _, ...objects } = state.world.objects, { [VERB]: __, ...vocab } = state.vocab || {};
  return { ...state, world: { ...state.world, objects }, vocab, rules: state.rules.filter(r => r.id !== "practice_test") };
}
