// The checker's shared helpers: what several of the checks (js/checks/*.js) read the same way, and the texts of a world they read. Pure.

// The game as it is, with you in another room (nothing else moved): where the checker reads a text or tries a command.
export const inRoom = (state, room) => ({ ...state, player: { ...state.player, at: room } });
// The one warning for a world with no music (BRIEF.md §7b): the engine plays nothing for it.
export const NO_MUSIC = "music: the world has no `add music`, so it plays nothing; every world has its music (BRIEF.md §7b)";
// A text with its objects' markup taken out ({tin of mints|tin} → tin of mints).
export const unmarked = (t) => String(t).replace(/\{([^|}]*)(?:\|[^}]*)?\}/g, "$1");
// A rule's effects with each named change it runs written out after it (one level: what the rule itself does).
export const withChanges = (state, effects) => (effects || []).flatMap(x => x && typeof x.change === "string" ? [x, ...(state.changes?.[x.change] || [])] : [x]);
// A "@key" as the pack's own text (any other value as it is).
export const packText = (x, pack) => (typeof x === "string" && x.startsWith("@") ? x.slice(1).split(".").reduce((v, k) => v?.[k], pack) : x);
// A text shortened to name it in a message.
export const shortText = (t) => { const x = String(t).replace(/\s+/g, " ").trim(); return x.length > 48 ? x.slice(0, 47) + "…" : x; };

// A world written under BRIEF.md §7's "Animation" (some picture's shot has a "moves:" part): the warnings added since are only for such worlds,
// the earlier ones would each be warned of many things.
export const plannedWorld = (state) => [...Object.values(state.world.rooms).map(r => r?.picture), ...Object.values(state.pictures || {}).map(p => p?.picture)]
  .some(p => /moves:/i.test(typeof p?.shot === "string" ? p.shot : ""));

// Every effect in the rules and named changes, in any depth: { effect, where } (where: the rule or change it is in).
export function effectsOf(state) {
  const found = [];
  const walk = (node, where) => {
    if (Array.isArray(node)) return node.forEach(x => walk(x, where));
    if (!node || typeof node !== "object") return;
    found.push({ effect: node, where });
    Object.values(node).forEach(x => walk(x, where));
  };
  for (const r of state.rules || []) walk(r.do, r.id ?? "a rule");
  for (const [name, effects] of Object.entries(state.changes || {})) walk(effects, "change " + name);
  return found;
}

// Every player-facing text of a world: [{ where, field, text }]. Not pictures or their descriptions (`alt`).
const TEXT_KEYS = new Set(["describe", "says", "say", "closed", "note", "examine", "here", "lies", "talk", "take", "listen", "enter", "text", "default", "hint", "hints", "lines", "again", "already", "brought", "eat", "drink",
  "starts", "ends", "status", "answer", "arrives", "leaves"]);   // (starts…answer: a condition's lines; arrives, leaves: a thing that moves)
const NOT_TEXT = new Set(["picture", "alt", "overlayAlt", "draw", "sprite", "floorSprite", "figure", "portrait", "words", "if", "match", "id", "name", "label"]);
export function worldTexts(state, pack) {
  const out = [];
  for (const [id, r] of Object.entries(state.world.rooms)) collectTexts(r, id, pack, out);
  for (const [id, o] of Object.entries(state.world.objects)) collectTexts({ ...o, starts: undefined, stops: undefined }, id, pack, out);   // (a consumable's: conditions' ids, not lines)
  for (const r of state.rules) collectTexts(r, r.id, pack, out);
  for (const [name, effects] of Object.entries(state.changes || {})) collectTexts(effects, "change " + name, pack, out);
  for (const [id, p] of Object.entries(state.puzzles || {})) collectTexts(p, id, pack, out);
  for (const [id, c] of Object.entries(state.conditions || {})) collectTexts(c, "condition " + id, pack, out);
  if (typeof state.opening?.intro === "string") out.push({ where: "opening", field: "intro", text: state.opening.intro });   // (shown at the start)
  return out;
}

// The player-facing texts inside one piece (a room, a thing, a rule, one effect…), added to `out`.
export function collectTexts(root, where, pack, out = []) {
  const resolve = (v) => packText(v, pack);
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach(x => walk(x, path));
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (NOT_TEXT.has(k)) continue;
      if (TEXT_KEYS.has(k)) {
        for (const raw of [].concat(v)) {                  // (a "@key" is the language pack's own line, not the world's: marked `pack`)
          const lines = [].concat(resolve(raw)).flatMap(x => [].concat(resolve(x)));
          for (const t of lines) if (typeof t === "string") out.push({ where, field: [...path, k].join("."), text: t, ...(typeof raw === "string" && raw.startsWith("@") ? { pack: true } : {}) });
        }
        if (v && typeof v === "object" && !Array.isArray(v)) walk(v, [...path, k]);
        else if (Array.isArray(v)) v.forEach(x => x && typeof x === "object" && walk(x, [...path, k]));
        continue;
      }
      // A text set by an effect: { set: "square.describe", to: [...] }
      if (k === "set" && typeof v === "string" && TEXT_KEYS.has(v.split(".").pop()) && "to" in node) {
        for (const t of [].concat(resolve(node.to))) if (typeof t === "string") out.push({ where, field: "set " + v, text: resolve(t) });
        continue;
      }
      if (v && typeof v === "object") walk(v, /^\d+$/.test(k) ? path : [...path, k]);
    }
  };
  walk(root, []);
  return out;
}

// What the player is shown that isn't one of the texts of `worldTexts`: names, labels and descriptions (`alt`, `overlayAlt`), the endings'
// alts and the bible's title and blurb: [{ where, field, text }].
export function shownTexts(state, bible) {
  const shown = [];
  const SKIP = new Set(["picture", "draw", "words", "sprite", "floorSprite", "figure", "portrait", "if", "match", "id", "solve"]);
  const walk = (node, where, field, text) => {
    if (typeof node === "string") { if (text) shown.push({ where, field, text: node }); return; }
    if (Array.isArray(node)) return node.forEach(x => walk(x, where, field, text));
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) if (!SKIP.has(k)) walk(v, where, text ? field : k, text || ["name", "label", "alt", "overlayAlt"].includes(k));
  };
  for (const [id, x] of Object.entries(state.world.rooms)) walk(x, id, "", false);
  for (const [id, x] of Object.entries(state.world.objects)) walk(x, id, "", false);
  for (const [id, x] of Object.entries(state.pictures || {})) walk({ alt: x?.alt }, "pictures/" + id, "", false);
  for (const k of ["title", "blurb"]) if (typeof bible?.[k] === "string") shown.push({ where: "bible", field: k, text: bible[k] });
  return shown;
}
