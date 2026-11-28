// Puzzles and fairness: what a puzzle names exists, a main step has two clues, some puzzle ends the story, each thing has its gender, harm and
// healing are fair (BRIEF.md §4, §5). Pure: reads the state and the pack, never changes either.

import { withChanges } from "./shared.js?v=0.77.1";

// The main steps (BRIEF.md §4): the puzzles an ending needs, directly or through what their needs need (a thing in `needs` by the puzzle that
// gives it, the first written: the one the endings take), and the way out of the start room (the first puzzle). An ending is no step, nor a second
// way to a thing, nor a puzzle no ending needs.
export function mainSteps(puzzles) {
  const main = new Set(), all = Object.entries(puzzles);
  const giver = (thing) => all.find(([, p]) => (p.gives || []).includes(thing))?.[0];
  const need = (n) => {
    const id = puzzles[n] ? n : giver(n);
    if (!id || main.has(id)) return;
    if (!puzzles[id].ending) main.add(id);
    for (const m of puzzles[id].needs || []) need(m);
  };
  for (const [, p] of all) if (p.ending) for (const n of p.needs || []) need(n);
  if (all.length && !all[0][1].ending) main.add(all[0][0]);
  return main;
}

// The puzzles: everything they name exists; their clues; a puzzle ends the story; each thing has the gender the language needs.
export function puzzleProblems(state, pack, puzzles, out) {
  // The description itself: everything it names exists.
  const known = (id) => !!(state.world.objects[id] || puzzles[id] || state.rules.some(r => r.id === id));
  const main = mainSteps(puzzles);
  for (const [id, p] of Object.entries(puzzles)) {
    for (const n of p.needs || []) if (!state.world.objects[n] && !puzzles[n]) out.add("puzzle.unknown-thing", `${id}: needs "${n}", which doesn't exist`);
    for (const g of p.gives || []) if (!state.world.objects[g]) out.add("puzzle.unknown-thing", `${id}: gives "${g}", which doesn't exist`);
    if (p.where && !state.world.rooms[p.where]) out.add("puzzle.unknown-room", `${id}: no such room "${p.where}"`);
    if (p.reaches && !state.world.rooms[p.reaches]) out.add("puzzle.unknown-room", `${id}: no such room "${p.reaches}"`);
    for (const c of p.clues || []) if (!known(c)) out.add("puzzle.unknown-thing", `${id}: clue "${c}" isn't an object, rule or puzzle`);
    if (!p.ending && !(p.gives || []).length && !p.reaches && !p.sets) out.add("puzzle.no-result", `${id}: solving it should give something, reach somewhere, set something or end the story`);
    if (p.sets !== undefined && !(typeof p.sets === "string" && state.world.objects[p.sets.split(".")[0]] && state.properties?.[p.sets]))
      out.add("puzzle.unknown-property", `${id}: sets ${JSON.stringify(p.sets)}, which isn't a property declared on a thing ("<thing>.<property>", in \`properties\`)`);
    // A clue that is a `once` rule is a line that passes once (and the game can't show it twice): it is news, not a clue
    // that lasts, so it doesn't count towards the two. The step needs lasting ones: a description, an examine, a character's line.
    if (!main.has(id)) continue;                          // (two clues are for the main steps)
    const passing = (p.clues || []).filter(c => !state.world.objects[c] && !puzzles[c] && state.rules.some(r => r.id === c && r.once));
    const lasting = (p.clues || []).length - passing.length;
    if (lasting < 2) out.add("puzzle.clues-few", passing.length
      ? `${id}: ${lasting} lasting clue(s); main steps should have two (${passing.join(", ")} ${passing.length > 1 ? "are once rules" : "is a once rule"}: ${passing.length > 1 ? "their lines pass" : "its line passes"} once, so ${passing.length > 1 ? "they don't" : "it doesn't"} count; put a clue in a description, an examine or a character's line${passing.some(c => Object.values(puzzles).some(q => q !== p && (q.clues || []).includes(c))) ? "; and a once rule can't be the clue of two steps" : ""})`
      : `${id}: ${(p.clues || []).length} clue(s); main steps should have two`);
  }
  if (!Object.values(puzzles).some(p => p.ending)) out.add("puzzle.no-ending", "no puzzle ends the story");
  // A language whose standard replies agree with the thing they are about (Spanish "Ya la tienes…", "Está cerrada.") needs each thing's gender.
  if (pack.words.grammar?.gender)
    for (const [id, o] of Object.entries(state.world.objects))
      if (!["m", "f"].includes(o.words?.g)) out.add("puzzle.no-gender", `${id}: no gender (words.g, "m" or "f"): the standard replies agree with it in this language`);
}

// Harm is fair: hurt and heal.
export function harmWarnings(state, out) {
  // Harm is fair (BRIEF.md §5): health (5 to 0) is lost with `hurt` and the rule's own line (`says`), then the game's
  // echo, never by setting it; and a hit is a whole number from 1 to 5 (1 ordinary, 2–3 serious, 4 very rare, 5 an instant
  // death, which comes with an `end` in the same rule). A hit is never held back: there is no warning turn.
  const changes = Object.entries(state.changes || {}).map(([name, effects]) => ({ id: "change " + name, do: effects, named: true }));
  for (const r of [...state.rules, ...changes]) {
    if (!r || !Array.isArray(r.do)) continue;
    const id = r.id ?? "a change";
    for (const e of r.do) {
      if (e?.set === "player.health" && ((typeof e.add === "number" && e.add < 0) || typeof e.to === "number"))
        out.add("harm.direct-loss", `${id}: changes health directly; use { hurt: n, says: "…" } so the loss is said, with its echo`);
      else if (e?.set === "player.health" && typeof e.add === "number" && e.add > 0)
        out.add("heal.direct-raise", `${id}: raises health directly; use { heal: n, says: "…" } so it is capped at full and said, with its echo`);
      if (e && "heal" in e) healProblems(r, e, id, state, out);
      if (!e || !("hurt" in e)) continue;
      if (!e.says) out.add("harm.hurt-no-says", `${id}: hurts with no line of its own (says): only the echo ("You feel unwell") is shown`);
      if (typeof e.hurt === "number") {
        if (!Number.isInteger(e.hurt) || e.hurt < 1 || e.hurt > 5)
          out.add("harm.hit-size", `${id}: hurts by ${e.hurt}; a hit is a whole number from 1 to 5 (1 ordinary, 2–3 serious, 4 very rare, 5 an instant death)`);
        else if (e.hurt === 5 && !r.do.some(x => x?.end))
          out.add("harm.five-no-end", `${id}: a hit of 5 is an instant death, so the same rule needs an end (end: true, with the ending's picture)`);
        else if (e.hurt === 4)
          out.add("harm.four-rare", `${id}: a hit of 4 should be very rare (1 ordinary, 2–3 serious); is it earned and visible in the fiction?`);
      }
    }
  }
}

// Healing is fair too (BRIEF.md §5): a positive amount, a line of its own, and not something the player can repeat for ever
// to undo every danger. `heal` is limited when its rule fires once, or when it asks about something it itself uses up (a
// condition on a path the rule sets) or takes away (the rule removes or moves a thing). A rule that happens each day at
// a time (`when: "at"`) is limited by the day. A named change the rule runs counts as part of the rule.
function healProblems(r, e, id, state, out) {
  const named = typeof e.heal === "string" && e.heal.startsWith("$");           // a value the player's words fill in
  if (!named && (typeof e.heal !== "number" || !(e.heal > 0))) out.add("heal.amount", `${id}: heal is a number above 0, not ${JSON.stringify(e.heal)}`);
  if (!e.says) out.add("heal.no-says", `${id}: heals with no line of its own (says): only the echo is shown`);
  if (!Array.isArray(r.do) || r.named || limited(r, state)) return;   // (a named change is judged in the rules that run it)
  out.add("heal.repeatable", `${id}: heals every time it fires, so the player can undo any harm by repeating it; make it once, or have it use something up (a condition on something it sets, or a thing it removes)`);
}

// Can a rule only fire a limited number of times (so what it gives can't be had for ever)? When it is `once`, happens at a
// time of day, or uses something up: a condition on a path it sets itself (a count), or a thing it removes or moves.
export function limited(r, state) {
  if (r.once === true || r.when === "at") return true;
  const all = withChanges(state, r.do);
  const sets = new Set(all.filter(x => x && typeof x.set === "string").map(x => x.set));
  const takes = all.some(x => x && (typeof x.remove === "string" || "move" in x));
  const asks = (Array.isArray(r.if) ? r.if : r.if ? [r.if] : []).flatMap(c => c && typeof c === "object" ? Object.keys(c) : []);
  return takes || asks.some(k => sets.has(k));
}
