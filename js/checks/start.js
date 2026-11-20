// The start room's guarantees (BRIEF.md §3; docs/start-room/PLAN.md) and the intro, the text shown once at the start. Pure: reads the state
// and the pack; the first puzzle is played with the checker's own run, which js/check.js hands in.

import { normalise } from "../parser.js?v=0.71.0";
import { step, exitNow } from "../engine.js?v=0.71.0";
import { placeOf, person } from "../place.js?v=0.71.0";
import { exitTo, waysOf } from "../exits.js?v=0.71.0";
import * as opening from "../opening.js?v=0.71.0";
import { Report } from "./registry.js?v=0.71.0";
import { unmarked, effectsOf } from "./shared.js?v=0.71.0";

// The intro (BRIEF.md §3, §6 "How long"): the text shown once at the start, above the start room's, its `opening.intro`. It is there
// (js/opening.js refuses a world without one, or one that names a thing), in the world's language, and near its length: about 90 words,
// two short paragraphs, warned past 150. The language is told by the pack's own small words (its articles, prepositions and "and"):
// a text in the world's language uses at least three different ones in 50 words; one in another language, almost none. The voice
// wordings the checker refuses (hedges) and the other text checks read it with the world's texts (worldTexts).
const INTRO_AIM = 90, INTRO_FAR = 150, INTRO_SMALL = 3;
export function introChecks(state, pack, out) {
  const t = state.opening?.intro;
  if (typeof t !== "string" || !t.trim()) return;
  const words = unmarked(t).split(/\s+/).filter(Boolean);
  if (words.length > INTRO_FAR) out.add("intro.long", `opening (intro): ${words.length} words; the intro aims at about ${INTRO_AIM} words, two short paragraphs; ${words.length} is far past it`);
  const w = pack.words, small = new Set([...(w.articles || []), ...(w.preps || []), ...(w.and || [])].map(x => String(x).toLowerCase()));
  const used = new Set((unmarked(t).toLowerCase().match(/\p{L}+/gu) ?? []).filter(x => small.has(x)));
  if (small.size && used.size < INTRO_SMALL)
    out.add("intro.language", `opening (intro): "${t.length > 70 ? t.slice(0, 70) + "…" : t}" doesn't read as the world's language: it uses ${used.size ? [...used].map(x => `"${x}"`).join(", ") : "none"} of its articles, prepositions and "and"; write the intro in the world's own language (BRIEF.md §3)`);
}

// The start room's guarantees (BRIEF.md §3; docs/start-room/PLAN.md): what the engine needs to build it (js/opening.js), then
//   1. one way out: the exit the `way` thing is, and no other (no other exit, nor a `true` one, nor a thing or scenery that leads
//      elsewhere, nor a rule that `connect`s one);
//   2. that exit closed at the start (locked by the way's lock, shut by its `if`, `false`, or wanting a thing held);
//   3–4. the world's first puzzle is the way out, with its hints, and opens it from the start room alone: played from the start with
//      the checker's own run (`play`: the state and the puzzles → a Run of js/check.js), only that puzzle, it reaches the room the
//      exit leads to, through that exit;
//   5. nothing it needs can be lost or wasted there: eaten, drunk, thrown, given to someone or put away in something in the start
//      room, or spoilt by any rule of the world whose match names it, and the way can still be opened (the same play, after each);
//   6. the hints thing in the room with a `here` line, and the two things with words of their own (below);
//   7. once out, you can go back in: from the room the way out leads to, with the way open, an exit takes you back into the start room
//      (any way: north, up, in…; the same play, then that step: goesBack).
// The hints thing's mechanics (the framed hint; never dropped) are the engine's, built the same for every world from the declaration:
// tests/openings.test.js pins them in every world and language, so they are not played here. The intro, the text shown at the start, is
// read with the world's texts (introChecks, and worldTexts for the voice).
// Returns the catches found: the problems of the opening, each with its id.
export function openingCatches(state, pack, play) {
  const d = state.opening, why = opening.problems(state, d), res = new Report();
  if (why.length) { for (const w of why) res.add("start.declaration", w); return res.found; }
  const { hints: H, way: W, room: roomId } = d;
  const objects = state.world.objects, rooms = state.world.rooms, room = rooms[roomId];
  const dir = opening.direction(state, d);

  // 1. One way out.
  for (const [x, to] of Object.entries(room.exits || {}))
    if (x !== dir && to !== false && to != null) res.add("start.one-way-out", `the start room has an exit ${x}${typeof exitTo(to) === "string" ? " to " + exitTo(to) : ""}: its only way out is the way out "${W}", ${dir} (BRIEF.md §3)`);
  for (const [oid, o] of Object.entries(objects))
    if (oid !== W && o.at === roomId) for (const x of waysOf(o)) res.add("start.one-way-out", `"${oid}" in the start room leads ${x}: its only way out is the way out "${W}" (BRIEF.md §3)`);
  for (const x of room.scenery || [])
    for (const w of waysOf(x)) res.add("start.one-way-out", `the start room's scenery "${x.name ?? x.words?.[0]}" leads ${w}: its only way out is the way out "${W}" (BRIEF.md §3)`);
  const seenConnect = new Set();
  for (const { effect: e, where } of effectsOf(state)) {
    if (e.connect !== roomId || e.dir === dir) continue;
    const line = `${where}: connects the start room ${e.dir ?? "?"} to ${e.to}: its only way out is the way out "${W}", ${dir} (BRIEF.md §3)`;
    if (!seenConnect.has(line)) { seenConnect.add(line); res.add("start.one-way-out", line); }
  }
  // 2. Closed at the start.
  if (exitNow(state, roomId, dir).go) res.add("start.way-open", `the way out ${dir} is open from the start: close it (a lock with its key in the room, \`{ to, if, closed }\`, or \`false\` until a rule \`connect\`s it) and open it by an action (BRIEF.md §3)`);
  // 3–4. The first puzzle is the way out, and opens it from the start room alone.
  const [first, p] = Object.entries(state.puzzles || {})[0] ?? [];
  if (!p || p.ending) res.add("start.first-puzzle", `the first puzzle must be the way out of the start room (\`where: "${roomId}"\`, \`reaches\` the room beyond, its solve and its hints)`);
  else {
    const named = `the first puzzle "${first}"`;
    if (p.where !== roomId) res.add("start.first-puzzle", `${named} must be the way out: its \`where\` is the start room "${roomId}"`);
    if (typeof p.reaches !== "string" || !rooms[p.reaches] || p.reaches === roomId) res.add("start.first-puzzle", `${named} must be the way out: it \`reaches\` the room the way out leads to`);
    if (!(p.hints || []).length) res.add("start.first-puzzle", `${named} must be the way out: it needs its hints, as any puzzle`);
    if (!res.problems.length) {
      const opens = (s, through) => {
        const run = play(s, { [first]: p });
        run.solve(first);
        if (run.problem) return run.problem;
        const wayNow = exitTo(run.state.world.rooms[roomId].exits?.[dir]);       // a room, or true: a way a rule answers (a hatch down to a cellar that is not under the van: BRIEF.md §2)
        if (!(wayNow === p.reaches || (wayNow === true && run.state.player.at === p.reaches)) || !run.state.seen.visited.includes(p.reaches))
          return `it reaches ${p.reaches}, but not through the way out "${W}" (${dir})`;
        through?.(run.state, run.clock);
        return null;
      };
      let out = null, clock = 0;   // (the state once the first puzzle has opened the way and you are through, and its clock: 7 starts there)
      const fails = opens(state, (s, c) => { out = s; clock = c; });
      if (fails) res.add("start.way-unopenable", `${named} doesn't open the way out from the start room alone (only what is in it, and what you carry): ${fails}`);
      else {
        // 5. Nothing it needs can be lost or wasted there.
        for (const why of wasted(state, p, roomId, dir, pack, opens)) res.add("start.loses-thing", `${named}: ${why}`);
        // 7. Once out, you can go back in.
        if (!goesBack(out, clock, p.reaches, roomId)) res.add("start.no-way-back", `once out, you can't go back into the start room: ${p.reaches}, where the way out "${W}" leads, needs an exit back into "${roomId}" (any way: north, up, in…), open once the way out is (BRIEF.md §3)`);
      }
    }
  }
  // 6. The hints thing is found where it lies.
  if (typeof objects[H].here !== "string" || !objects[H].here.trim()) res.add("start.hints-here", `the hints thing "${H}" needs a \`here\` line: where it is in the start room, marked`);

  // Every thing in the start room has its own nouns (BRIEF.md §3): a word that names two things there is a clash, and so is a word of
  // the hints thing that names anything else in the world (the way's: anything else in its own room). Things are the objects in
  // the room or carried, their parts, and the room's scenery; each is told apart in the message by id and kind, so one can be renamed.
  const fold = (list) => (list || []).map(x => normalise(String(x), pack.words.grammar));
  const kindOf = (id) => objects[id].at === "player" ? "carried" : "an object";
  const things = (only) => [
    ...Object.entries(objects).filter(([, o]) => !only || o.at === roomId || o.at === "player")
      .map(([oid, o]) => ({ id: oid, owner: oid, label: `"${oid}" (${kindOf(oid)})`, words: fold(o.words?.nouns) })),
    ...Object.entries(objects).filter(([, o]) => !only || o.at === roomId || o.at === "player")
      .flatMap(([oid, o]) => (o.parts || []).map(x => ({ id: null, owner: oid, label: `the part "${x.name ?? x.words?.[0]}" of "${oid}" (part)`, words: fold(x.words) }))),
    ...Object.entries(rooms).filter(([rid]) => !only || rid === roomId)
      .flatMap(([rid, r]) => (r.scenery || []).map(x => ({ id: null, owner: rid, label: `the scenery "${x.name ?? x.words?.[0]}" of room "${rid}" (scenery)`, words: fold(x.words) })))];
  const MAIN = [["hints", H], ["way", W]], clash = new Set();
  const name = (id) => `the ${MAIN.find(([, x]) => x === id)[0]} thing "${id}" (${kindOf(id)})`;
  const report = (w, x, y, text, why = "") => {
    const key = [w, x, y].sort().join("|");
    if (!clash.has(key)) { clash.add(key); res.add("start.nouns-clash", `"${w}" names two things${text}: ${x} and ${y}; rename one of them, so each thing has its own word${why}`); }
  };
  const CLAIMS = { hints: "the hints thing's words are claimed against every other thing and scenery in the world, not only those in the start room",
    way: "the way out's words are claimed against everything else in its own room" };
  for (const [k, id] of MAIN)                                          // a word of one of the two: nothing else answers to it
    for (const w of fold(objects[id].words.nouns)) for (const x of things(k === "way"))
      if (!(x.id === id) && x.words.includes(w)) report(w, name(id), x.label, "", ` (${CLAIMS[k]})`);
  const inside = things(true).filter(x => !MAIN.some(([, id]) => x.id === id));   // the others: their parts, the room's scenery, the rest
  for (let a = 0; a < inside.length; a++) for (let b = a + 1; b < inside.length; b++)
    for (const w of inside[a].words) if (inside[b].words.includes(w)) report(w, inside[a].label, inside[b].label, " in the start room");

  return res.found;
}
export const checkOpening = (state, pack, play) => openingCatches(state, pack, play).map(c => c.text);

// Guarantee 7 (Diego, 15 November 2026): from where the way out leads, with the way open (the state the first puzzle's play left, you
// there; `clock`, the play's real time), some exit of that room takes you back into the start room when you go that way. True if one does.
function goesBack(s, clock, there, roomId) {
  for (const [d, x] of Object.entries(s.world.rooms[there]?.exits || {})) {
    if (exitTo(x) !== roomId) continue;
    const r = step(s, { verb: "go", dir: d, at: clock + 1000 });
    if (!r.refused.length && r.next.player.at === roomId) return true;
  }
  const out = step(s, { verb: "go", dir: "out", at: clock + 1000 });        // or a rule answers OUT (the way out was a move by a rule: it is climbed back)
  return !out.refused.length && out.next.player.at === roomId;
}

// What a player could do in the start room that loses a thing the way out needs (B in docs/start-room/PLAN.md: nothing can be lost or
// wasted there): each thing the first puzzle needs or names, taken first, then eaten, drunk, thrown, given to each person and put in
// each thing there. One the engine accepts that takes the thing away, while the way is still closed, is played on from: if the way
// can't be opened after it (`opens` says why: a thing put down there is taken up again), it is a problem, naming the command.
// Then every rule of the world whose `match` names such a thing (portable or not: a lever broken, a rope cut), tried in the start room as
// its match words it, with the thing where it lies and, if it can be taken, in hand: if the way is still shut after it and can't be
// opened then, it is a problem, naming the command and the rule (Diego, 15 November 2026: I).
function wasted(state, p, roomId, dir, pack, opens) {
  const objects = state.world.objects, out = [], things = new Set((p.needs || []).filter(id => objects[id]));
  for (const c of p.solve || []) for (const x of [c?.obj, c?.obj2]) if (objects[x]) things.add(x);
  const others = Object.keys(objects).filter(id => placeOf(state, id) === roomId);
  const said = (a) => `${a.verb}${a.obj ? " " + a.obj : ""}${a.obj2 ? (a.verb === "give" ? " to " : a.verb === "put" ? " in " : " with ") + a.obj2 : ""}`;
  const seen = new Set();
  for (const t of things) {
    if (state.opening?.hints === t) continue;
    const starts = [state];
    if (objects[t].portable && placeOf(state, t) !== "player") {
      const r = step(state, { verb: "take", obj: t, at: 500 });
      if (!r.refused.length && placeOf(r.next, t) === "player") starts.push(r.next);
    }
    for (const rule of state.rules || []) {
      const m = rule.match;
      if (!m || rule.fixed || ![m.obj, m.obj2].some(v => [v].flat().includes(t))) continue;
      for (const a of matchActions(m, t)) for (const s of starts) {
        const key = rule.id + "|" + JSON.stringify(a) + "|" + (s === state ? 0 : 1);
        if (seen.has(key)) continue;
        seen.add(key);
        const r = step(s, { ...a, at: 1000 });
        if (r.refused.length || exitNow(r.next, roomId, dir).go) continue;          // (refused, or it opened the way)
        const fails = opens(r.next);
        if (fails) out.push(`${said(a)} in the start room (rule ${rule.id}${s === state ? "" : ", holding it"}) and then the way out can't be opened (${fails}): nothing it needs can be lost or spoilt there (BRIEF.md §3)`);
      }
    }
  }
  for (const t of things) {
    if (!objects[t].portable || state.opening?.hints === t) continue;
    let s = state;
    if (placeOf(s, t) !== "player") {
      const r = step(s, { verb: "take", obj: t, at: 500 });
      if (r.refused.length || placeOf(r.next, t) !== "player") continue;
      s = r.next;
    }
    const tries = [{ verb: "eat", obj: t }, { verb: "drink", obj: t }, { verb: "throw", obj: t },
      ...others.filter(o => o !== t && person(objects[o])).map(o => ({ verb: "give", obj: t, obj2: o })),
      ...others.filter(o => o !== t && !person(objects[o])).map(o => ({ verb: "put", obj: t, obj2: o }))];
    for (const a of tries) {
      const r = step(s, { ...a, at: 1000 });
      if (r.refused.length || placeOf(r.next, t) === "player" || exitNow(r.next, roomId, dir).go) continue;   // (still in hand, or the way is open)
      const fails = opens(r.next);
      if (fails) out.push(`${a.verb} ${t}${a.obj2 ? (a.verb === "give" ? " to " : " in ") + a.obj2 : ""} in the start room loses "${t}", and then the way out can't be opened (${fails}): nothing it needs can be lost there (BRIEF.md §3)`);
    }
  }
  return out;
}

// The actions a rule's `match` words, naming the thing `t` (each verb; obj and obj2 as `t` where they name it, else each one they name;
// the other keys as their first value): what a player could type that the rule answers.
function matchActions(m, t) {
  const pick = (v) => v === undefined ? [undefined] : Array.isArray(v) ? (v.includes(t) ? [t] : v) : [v];
  const one = (v) => (Array.isArray(v) ? v[0] : v);
  const base = {};
  for (const k of ["dir", "topic", "text", "value"]) if (m[k] !== undefined) base[k] = one(m[k]);
  const found = [];
  for (const verb of [m.verb ?? "use"].flat()) for (const obj of pick(m.obj)) for (const obj2 of pick(m.obj2))
    found.push({ verb, ...(obj !== undefined && { obj }), ...(obj2 !== undefined && { obj2 }), ...base });
  return found;
}
