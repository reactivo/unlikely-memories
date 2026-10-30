// Picture filters, the engine's side (ARCHITECTURE.md §7, "Picture"): which ones there are, how a rule names one,
// and what the engine refuses. The drawing is ui/effects.js (FILTERS); the tunables are content/art.js (effects.filters),
// whose order is the order they are drawn in when several are on. Pure.
//
// A filter is named by a string, the same in an effect ({ "filter": "sway" }, { "unfilter": "sway" }), in a condition's
// `filters` and in the state (state.filters, in the order they came on):
//   "sway", "ghost", "vignette", "mosaic", "static"   on until something turns it off;
//   "tint:<palette>"                                  the same, with the palette after a colon ("tint:cold"); one tint at
//                                                     a time (a new one takes the old one's place); { "unfilter": "tint" }
//                                                     turns off whichever is on, "tint:cold" only that one;
//   "shake"                                           a moment, not a state: a jolt of the picture, once, then gone. It is
//                                                     never kept on (state.shakes counts the jolts, so the scene sees a new
//                                                     one), so it can't be turned off, nor be one of a condition's filters.

import art from "../content/art.js";

const TUNED = art.effects.filters;
// Every filter, in the order they are drawn (content/art.js).
export const ORDER = Object.keys(TUNED);
// The filters that take a parameter, and the values it may have.
export const PARAMS = { tint: Object.keys(TUNED.tint?.palettes || {}) };
// The filters that are a moment rather than a state.
export const MOMENTS = ["shake"];

// A filter's name and parameter: "tint:cold" → { name: "tint", param: "cold" }; "sway" → { name: "sway", param: null }.
export function parseFilter(spec) {
  const s = String(spec), i = s.indexOf(":");
  return i < 0 ? { name: s, param: null } : { name: s.slice(0, i), param: s.slice(i + 1) };
}

// What is wrong with a filter as written, or null. `off`: to turn off (a tint may then go without its palette);
// `lasting`: one of a condition's filters (no moment).
export function filterProblem(spec, { off = false, lasting = false } = {}) {
  if (typeof spec !== "string" || !spec) return `a picture filter is a name: ${names()}`;
  const { name, param } = parseFilter(spec);
  if (!ORDER.includes(name)) return `no such picture filter: ${spec} (there are ${names()})`;
  if (MOMENTS.includes(name) && (off || lasting)) return `${name} is a moment, not something that stays on: a rule starts it with { "filter": "${name}" }, and it is over by itself`;
  if (PARAMS[name]) {
    if (param === null) return off ? null : `${name} needs its palette after a colon: ${PARAMS[name].map(p => name + ":" + p).join(", ")}`;
    if (!PARAMS[name].includes(param)) return `no such ${name}: ${param} (there are ${PARAMS[name].join(", ")})`;
  } else if (param !== null) return `${name} takes nothing after a colon: "${name}"`;
  return null;
}
const names = () => ORDER.map(n => PARAMS[n] ? n + ":<" + PARAMS[n].join("|") + ">" : n).join(", ");

// The filters on after turning one on or off (a list of names, as in the state). Unchanged when it is already so.
export function switched(list, spec, on) {
  const { name, param } = parseFilter(spec);
  if (on) return list.includes(spec) ? list : [...list.filter(f => parseFilter(f).name !== name), spec];
  return list.filter(f => !(f === spec || (param === null && parseFilter(f).name === name)));
}

// The filters on, in the order they are drawn.
export const inOrder = (list) => [...list].sort((a, b) => ORDER.indexOf(parseFilter(a).name) - ORDER.indexOf(parseFilter(b).name));
