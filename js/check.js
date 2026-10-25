// Checker: can a world be finished, and is it fair? Reads the puzzles a world describes as data (state.puzzles,
// GUIDE.md §3) and plays them, for each ending, through the real parser and engine, the way a player would type
// them: walking between rooms, picking up what's needed, solving each puzzle with its own commands. Pure: never
// touches the page; used by the tests now, and later to check a world the AI builds before it's played.
//
// Also: the world's opening keeps the contract of BRIEF.md §3 (checkOpening below): its room in an area of its own,
// two things to take and one carried, the way on held back and then leading into the world, the lines said, no
// word of the three things used by anything else.
//
// Also: the ending's picture (BRIEF.md §7): every `end` effect names a picture the world has, a world that can hurt the player
// has a `died` picture (the one the story ends with when health runs out), and each picture in `state.pictures` is well formed
// and described (`alt`).
//
// Also: an exit with a condition (`{ to, if, closed }`) is well formed, and can open: the playthrough waits for the hour
// of a timed one, and a way no property or hour could ever open is warned of (neverOpen below).
//
// Also: every exit leads where it says (and rooms can be gone to by name, and stairs climbed), what things offer when
// clicked does something, and everything a text mentions answers (`mentions`, written with each room
// and object: the things its lines name, GUIDE.md §6).
//
// A puzzle: { where?, needs: [thing or puzzle ids], solve: [commands], gives?: [things], reaches?: room,
//             ending?: true, clues: [object, rule or puzzle ids], time?: "next 22:00" }
// `time`: when it can be solved; the checker moves the world's clock there first (a player would play on, or wait).
//
// Also, given the bible (the third argument): its blurb is 110–160 characters and its thumbnail names one of the world's room pictures
// (never an ending's or `died`) with a whole-number x from 0 to 95 (bibleProblems below; GUIDE.md §1). Without a bible these aren't looked at.
//
//   check(state, pack, bible?) → { ok, problems: [...], warnings: [...], endings: { id: [commands played] } }

import { parse } from "./parser.js";
import { step, applyChangeSet, answers as answered, holds, exitNow } from "./engine.js";
import { placeOf } from "./use.js";
import { solveCommand } from "./narrator.js";
import { isExitObject, exitTo, exitConditions } from "./exits.js";
import { moveTo, worldTime, parts } from "./time.js";
import { inScope } from "./parser.js";
import * as opening from "./opening.js";
import { TEXT_WORDS, PROPERTY_WORD, FIELDS, suggest, conditionProblems } from "./fields.js";
import art from "../content/art.js";

export function check(state, pack, bible) {
  const problems = [], warnings = [...(state.warnings || [])], endings = {};   // (the world's own, found when it loaded: js/fields.js)
  // The opening's way on `reaches: "entrance"`: wherever the world says it leads.
  // (With no world yet, there's nowhere for it to lead: the opening's puzzles are left out.)
  const puzzles = Object.fromEntries(Object.entries(state.puzzles || {})
    .filter(([, p]) => p.reaches !== "entrance" || state.entrance)
    .map(([id, p]) => [id, p.reaches === "entrance" ? { ...p, reaches: state.entrance } : p]));
  if (state.entrance && !state.world.rooms[state.entrance])
    problems.push(`the opening's way on leads to "${state.entrance}", which isn't a room`);
  if (!Object.keys(puzzles).length) return { ok: false, problems: ["the world describes no puzzles"], warnings, endings };
  if (!state.opening) problems.push("the world has no opening");
  else for (const why of checkOpening(state, pack)) problems.push("the opening: " + why);

  // Ids are unique across rooms, objects and puzzles (the engine refuses to add a second; this repeats it for a state built
  // by other means): a rule reads `$here.waitFor` or `last_lamp.visited` by id, and would read the wrong one.
  const kinds = { room: state.world.rooms, object: state.world.objects, puzzle: state.puzzles || {} };
  for (const id of new Set(Object.values(kinds).flatMap(x => Object.keys(x)))) {
    const names = Object.entries(kinds).filter(([, x]) => id in x).map(([k]) => k);
    if (names.length > 1) problems.push(`${id}: the id is used by ${names.map(k => (k === "object" ? "an " : "a ") + k).join(" and ")}; ids are unique across rooms, objects and puzzles`);
  }

  // The description itself: everything it names exists.
  const known = (id) => !!(state.world.objects[id] || puzzles[id] || state.rules.some(r => r.id === id));
  for (const [id, p] of Object.entries(puzzles)) {
    for (const n of p.needs || []) if (!state.world.objects[n] && !puzzles[n]) problems.push(`${id}: needs "${n}", which doesn't exist`);
    for (const g of p.gives || []) if (!state.world.objects[g]) problems.push(`${id}: gives "${g}", which doesn't exist`);
    if (p.where && !state.world.rooms[p.where]) problems.push(`${id}: no such room "${p.where}"`);
    if (p.reaches && !state.world.rooms[p.reaches]) problems.push(`${id}: no such room "${p.reaches}"`);
    for (const c of p.clues || []) if (!known(c)) problems.push(`${id}: clue "${c}" isn't an object, rule or puzzle`);
    if (!p.ending && !(p.gives || []).length && !p.reaches) problems.push(`${id}: solving it should give something, reach somewhere or end the story`);
    // A clue that is a `once` rule is a line that passes once (and the game can't show it twice): it is news, not a clue
    // that lasts, so it doesn't count towards the two. The step needs lasting ones: a description, an examine, a character's line.
    const passing = (p.clues || []).filter(c => !state.world.objects[c] && !puzzles[c] && state.rules.some(r => r.id === c && r.once));
    const lasting = (p.clues || []).length - passing.length;
    if (lasting < 2) warnings.push(passing.length
      ? `${id}: ${lasting} lasting clue(s); main steps should have two (${passing.join(", ")} ${passing.length > 1 ? "are once rules" : "is a once rule"}: ${passing.length > 1 ? "their lines pass" : "its line passes"} once, so ${passing.length > 1 ? "they don't" : "it doesn't"} count; put a clue in a description, an examine or a character's line${passing.some(c => Object.values(puzzles).some(q => q !== p && (q.clues || []).includes(c))) ? "; and a once rule can't be the clue of two steps" : ""})`
      : `${id}: ${(p.clues || []).length} clue(s); main steps should have two`);
  }
  if (!Object.values(puzzles).some(p => p.ending)) problems.push("no puzzle ends the story");
  // A language whose standard replies agree with the thing they are about (Spanish "Cogida.") needs each thing's gender.
  if (pack.words.grammar?.gender)
    for (const [id, o] of Object.entries(state.world.objects))
      if (!["m", "f"].includes(o.words?.g)) problems.push(`${id}: no gender (words.g, "m" or "f"): the standard replies agree with it in this language`);

  // An exit with a condition: `{ to, if?, closed? }`: it leads to a room (or `true`: a rule answers), its `if` is
  // written like a rule's, and its `closed` is a line (or a list of lines to vary).
  // (First, since playing through them below would stumble on a bad one: those are left out of it.)
  const badExits = new Set();
  for (const [id, room] of Object.entries(state.world.rooms)) for (const [dir, raw] of Object.entries(room.exits || {})) {
    if (!isExitObject(raw)) continue;
    const at = `${id}: exit ${dir}`, before = problems.length;
    if (raw.to !== true && !(typeof raw.to === "string" && state.world.rooms[raw.to])) problems.push(`${at} leads to ${JSON.stringify(raw.to)}, which isn't a room (or true)`);
    if (raw.if !== undefined && typeof raw.if !== "boolean") for (const why of conditionProblems(exitConditions(raw))) problems.push(`${at}: if: ${why}`);
    else if (raw.if !== undefined && raw.if !== true && raw.if !== false) problems.push(`${at}: if must be a condition, a list of them, true or false`);
    const lines = [].concat(raw.closed ?? []);
    if (raw.closed !== undefined && !(lines.length && lines.every(x => typeof x === "string" && x.trim()))) problems.push(`${at}: closed is the line said when the way is shut: text, or a list of texts`);
    if (problems.length > before) badExits.add(id + "." + dir);
  }

  // Every exit leads where it says: from each room, "go" each way that names a room arrives there (a rule that
  // swallows directions, like "go" with no object, would trap the player). Walked at the world's own time: after
  // its arrival (the opening may be at another hour).
  const arrived = applyChangeSet(state, { effects: [{ change: "arrival", optional: true }] }).next;
  for (const [id, room] of Object.entries(arrived.world.rooms)) {
    for (const [dir, raw] of Object.entries(room.exits || {})) {
      const to = exitTo(raw);
      if (typeof to !== "string" || badExits.has(id + "." + dir)) continue;
      let there = { ...arrived, player: { ...arrived.player, at: id } };
      if (isExitObject(raw) && !exitNow(there, id, dir).go) {          // shut now: try it open (waiting for its hour)
        there = opensByWaiting(there, id, dir);
        if (!there) continue;                                           // held by something else: the playthrough, and neverOpen, say
      }
      const r = step(there, { verb: "go", dir, at: 0 });
      if (r.next.player.at !== to) problems.push(`going ${dir} from ${id} doesn't reach ${to} (${(r.applied.find(e => e.say) || {}).say || "nothing happens"})`.slice(0, 160));
    }
  }
  // Rooms by name: "go <the room's name>" from next door gets there (the name is what the player reads on screen;
  // through a door's own rule counts).
  // And a thing that leads somewhere (`leads: "u"`: stairs, a ladder): climbing it goes that way, to a room.
  const go = pack.words.verbs.go[0], climb = pack.words.verbs.climb[0];
  const travels = (s, command) => { const r = parse(command, s, pack); return r.actions?.length === 1 && r.actions[0].verb === "go" ? r.actions[0].dir : null; };
  const reaches = (s, command, to) => {
    const r = parse(command, s, pack);
    let g = s;
    for (const a of r.actions || []) g = step(g, { ...a, at: 0 }).next;
    return g.player.at === to;
  };
  for (const [id, room] of Object.entries(arrived.world.rooms)) {
    const there = { ...arrived, player: { ...arrived.player, at: id } };
    for (const [dir, raw] of Object.entries(room.exits || {})) {
      const to = exitTo(raw);
      const name = typeof to === "string" && arrived.world.rooms[to]?.name;
      if (name && !isExitObject(raw) && !reaches(there, go + " " + name.toLowerCase(), to)) warnings.push(`${id}: "${go} ${name.toLowerCase()}" doesn't go ${dir} to ${to}`);
    }
    const leading = [...(room.scenery || []).map(x => ({ word: x.words?.[0], leads: x.leads })),
      ...Object.entries(arrived.world.objects).filter(([oid, o]) => o.at === id && o.leads).map(([oid, o]) => ({ word: pack.names?.[oid]?.nouns?.[0] ?? o.words?.nouns?.[0], leads: o.leads }))];
    for (const { word, leads } of leading.filter(x => x.leads && x.word)) {
      if (!(leads in (room.exits || {}))) problems.push(`${id}: "${word}" leads ${leads}, but there's no way ${leads} from here`);
      else if (travels(there, climb + " " + word) !== leads) problems.push(`${id}: "${climb} ${word}" doesn't go ${leads}`);
    }
  }
  // What a thing offers when clicked (`actions`; `heldActions` when carried) does something where it's offered: it's
  // read, and answered by a rule or the thing (not a stock reply). Only someone else being elsewhere may stop it
  // (offered lines leave those out: js/view.js).
  for (const [id, o] of Object.entries(state.world.objects)) {
    const room = placeOf(state, id);
    if (!state.world.rooms[room]) continue;
    for (const [list, held] of [[o.actions, false], [o.heldActions, true]]) for (const command of list || []) {
      const s = structuredClone(state);
      s.player.at = room;
      if (held) s.world.objects[id].at = "player";
      const r = parse(command, s, pack);
      if (r.error?.scenery || r.error?.say === "@notHere") continue;
      if (!r.actions) warnings.push(`${id}: offers "${command}", which isn't understood (${r.error?.say})`);
      else if (!answered(s, r.actions).meaningful) warnings.push(`${id}: offers "${command}", which gets only a stock reply ${held ? "when carried" : "there"}`);
    }
  }
  // Everything a text mentions answers: "examine" each one where the text is read (an object's lines: with the
  // object in hand) must find a thing, scenery or a part, never "You see no … here".
  const look = pack.words.verbs.examine[0];
  const answers = (s, m) => { const r = parse(look + " " + m, s, pack); return !!(r.actions || r.error?.scenery); };
  for (const [id, room] of Object.entries(arrived.world.rooms)) {
    const s = { ...arrived, player: { ...arrived.player, at: id } };
    for (const m of room.mentions || []) if (!answers(s, m)) problems.push(`${id} mentions "${m}", but nothing there answers to it`);
  }
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (!o.mentions) continue;
    const s = structuredClone(state);                // read where the object is (its room), with it in hand
    const room = placeOf(state, id);
    if (state.world.rooms[room]) s.player.at = room;
    s.world.objects[id].at = "player";
    for (const m of o.mentions) if (!answers(s, m)) problems.push(`${id} mentions "${m}", but nothing answers to it`);
  }
  // Clicking an object in the story examines it with the words shown ({label|id}: "Examine label"), so each label,
  // read where it's shown (a room's text, or an object's `here` line in its room), must name that very object.
  const read = (x) => typeof x === "string" && x.startsWith("@") ? x.slice(1).split(".").reduce((v, k) => v?.[k], pack) : x;
  const marked = (line) => [...String(read(line) ?? "").matchAll(/\{([^|}]+)(?:\|([^}]+))?\}/g)].map(m => [m[1], m[2] ?? m[1]]);
  const clicks = (where, lines) => {
    const s = { ...arrived, player: { ...arrived.player, at: where } };
    for (const [label, oid] of lines.flatMap(marked)) {
      if (!s.world.objects[oid]) { problems.push(`${where}: "{${label}|${oid}}" marks "${oid}", which isn't an object`); continue; }
      if (!inScope(s, oid)) continue;                // shut away for now (the oars in the hut): shown only once it's open
      const r = parse(look + " " + label, s, pack);
      if (r.actions?.[0]?.obj !== oid) problems.push(`${where}: clicking "${label}" doesn't examine "${oid}" ("${look} ${label}" isn't read as it)`);
    }
  };
  for (const [id, room] of Object.entries(arrived.world.rooms)) clicks(id, [].concat(room.describe || []));
  for (const [id, o] of Object.entries(arrived.world.objects))
    if (o.here && arrived.world.rooms[placeOf(arrived, id)]) clicks(placeOf(arrived, id), [o.here]);

  // Topics offered after talking (js/view.js): each label, clicked, asks that very topic; each idea something brings
  // up (an `opens` or a `know` somewhere), or the topic could never be offered.
  const askAbout = (label) => (typeof pack.askAbout === "function" ? pack.askAbout(label) : "ask about " + label);
  const brought = new Set(JSON.stringify([state.world.objects, state.rules, state.changes]).match(/"(?:opens|know)":(\[[^\]]*\]|"[^"]*")/g)?.flatMap(m => JSON.parse(m.slice(m.indexOf(":") + 1))) || []);
  for (const [id, o] of Object.entries(state.world.objects)) {
    for (const [key, t] of Object.entries(o.topics || {})) {
      if (key === "default" || !t || typeof t !== "object") continue;
      const about = t.about ?? key;
      if (!t.open && !state.world.objects[about] && !state.world.rooms[about] && !brought.has(about))
        warnings.push(`${id}: topic "${key}" is about "${about}", which nothing brings up (opens, know): it's never offered`);
      const where = placeOf(state, id);
      if (!state.world.rooms[where]) continue;
      const s = { ...state, player: { ...state.player, at: where }, talkingTo: id };
      const label = t.label ?? t.words?.[0] ?? key, r = parse(askAbout(label), s, pack);
      if (r.actions?.[0]?.topic !== key) problems.push(`${id}: "${askAbout(label)}" doesn't ask about "${key}" (its label isn't one of its words)`);
    }
  }

  // Conditions are well formed: every rule's `if` and every `waitFor` (`{ time, says, if? }`, on a room or a thing)
  // use the operators the engine knows, so a typo is found here and not when the player gets there.
  for (const r of state.rules) for (const why of conditionProblems(r.if)) problems.push(`${r.id}: ${why}`);
  for (const r of state.rules) if (r.once !== undefined && r.once !== true) problems.push(`${r.id}: once is true (the rule fires at most once) or left out, not ${JSON.stringify(r.once)}`);
  for (const [id, thing] of [...Object.entries(state.world.rooms), ...Object.entries(state.world.objects)]) {
    const w = thing.waitFor;
    if (w === undefined || w === null) continue;
    if (typeof w !== "object" || Array.isArray(w)) { problems.push(`${id}: waitFor must be { time, says, if? }`); continue; }
    for (const k of Object.keys(w)) if (!["time", "says", "if"].includes(k)) problems.push(`${id}: waitFor has no "${k}" (it is { time, says, if? })`);
    if (typeof w.time !== "string" || moveTo(w.time, 0).error) problems.push(`${id}: waitFor.time must be a time like "next 17:15" or "+5m"`);
    if (typeof w.says !== "string" || !w.says.trim()) problems.push(`${id}: waitFor.says is missing: the line said while you wait`);
    for (const why of conditionProblems(w.if)) problems.push(`${id}: waitFor.if: ${why}`);
  }

  // A thing's `use` says what USE alone means for it: an action the game knows (or a verb this world adds), never USE itself.
  const verbs = new Set([...Object.keys(pack.words.verbs), ...Object.keys(state.vocab || {})]);
  for (const [id, o] of Object.entries(state.world.objects))
    if (o.use !== undefined && (typeof o.use !== "string" || o.use === "use" || !verbs.has(o.use)))
      problems.push(`${id}: use must be the verb USE alone stands for (an action or a word this world adds, not "use"), not ${JSON.stringify(o.use)}`);

  // Harm is fair (GUIDE.md §3): health is lost with `hurt` and the rule's own red line (`says`), never by setting
  // it; and no single hit is big enough to end the story without the "one more like that" warning first (health starts
  // at 100, so a hit is 30 at most), unless the rule is itself an ending.
  const changes = Object.entries(state.changes || {}).map(([name, effects]) => ({ id: "change " + name, do: effects, named: true }));
  for (const r of [...state.rules, ...changes]) {
    if (!r || !Array.isArray(r.do)) continue;
    const id = r.id ?? "a change";
    for (const e of r.do) {
      if (e?.set === "player.health" && ((typeof e.add === "number" && e.add < 0) || typeof e.to === "number"))
        warnings.push(`${id}: changes health directly; use { hurt: n, says: "…" } so the loss is said, in red`);
      else if (e?.set === "player.health" && typeof e.add === "number" && e.add > 0)
        warnings.push(`${id}: raises health directly; use { heal: n, says: "…" } so it is capped at 100 and said`);
      if (e && "heal" in e) healProblems(r, e, id, state, problems, warnings);
      if (!e || !("hurt" in e)) continue;
      if (!e.says) warnings.push(`${id}: hurts with no line of its own (says): only "You're hurt." is shown`);
      if (typeof e.hurt === "number" && e.hurt > 30 && !r.do.some(x => x?.end))
        warnings.push(`${id}: a hit of ${e.hurt} is too big outside an ending; a hit is 30 at most, so the warning before the end always comes`);
    }
  }

  // The ending's picture: each `end` names one the world has; a world that can hurt you has a `died` one; each is well formed.
  problems.push(...pictureProblems(state));
  if (bible) problems.push(...bibleProblems(bible, state));

  // Room texts within WRITING-DIRECTION.md §5: about 30–80 words, 2 paragraphs (3 at most), the opening's too.
  for (const [id, room] of Object.entries(state.world.rooms)) {
    if (!Array.isArray(room.describe) || room.describe.some(p => typeof p !== "string" || p.startsWith("@"))) continue;
    const words = room.describe.join(" ").replace(/\{([^|}]*)(\|[^}]*)?\}/g, "$1").split(/\s+/).filter(Boolean).length;
    if (words > 80) warnings.push(`${id}: ${words} words; a room's text is about 30–80`);
    if (room.describe.length > 3) warnings.push(`${id}: ${room.describe.length} paragraphs; 2, or 3 at most`);
  }

  // Clock times the text names (GUIDE.md §3): each needs something in the world at that hour, or [time].
  warnings.push(...clockTimeWarnings(state, pack, arrived));
  warnings.push(...wayWarnings(state, pack, arrived));
  warnings.push(...wordWarnings(state, pack));
  const never = neverHolds(state, arrived);
  warnings.push(...neverOpen(state, never, arrived, badExits));
  warnings.push(...neverWaits(state, never, arrived));
  if (problems.length) return { ok: false, problems, warnings, endings };

  // Each ending, from a fresh start.
  for (const [id, p] of Object.entries(puzzles)) {
    if (!p.ending) continue;
    const run = new Run(state, pack, puzzles, warnings);
    run.solve(id);
    if (run.problem) problems.push(`ending "${id}": ${run.problem}`);
    else if (!run.state.ended) problems.push(`ending "${id}": played to the end, but the story didn't end`);
    else if (!run.state.ending) problems.push(`ending "${id}": the story ended without a picture (end: true, picture: "…")`);
    endings[id] = run.played;
  }
  return { ok: !problems.length, problems, warnings, endings };
}

// ---- Pictures that aren't a room's: the endings' ------------------------------------------------------------------------
// Every effect in the rules and named changes, in any depth: { effect, where } (where: the rule or change it is in).
function effectsOf(state) {
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

// What is wrong with the bible's card for the landing page: a blurb of BLURB_MIN to BLURB_MAX characters, and a thumbnail { picture, x }
// naming a room's picture (not an ending's, nor `died`, which would give the ending away) with a whole-number x from 0 to 95 (the crop
// is 225 of the picture's 320 columns).
export const BLURB_MIN = 110, BLURB_MAX = 160;
export function bibleProblems(bible, state) {
  const problems = [], blurb = bible?.blurb, thumb = bible?.thumbnail, columns = art.picture.width - 225;
  if (typeof blurb !== "string" || !blurb.trim()) problems.push("bible: no blurb, the short description on the world's card");
  else if (blurb.length < BLURB_MIN || blurb.length > BLURB_MAX) problems.push(`bible: the blurb is ${blurb.length} characters, it should be ${BLURB_MIN}–${BLURB_MAX}`);
  if (!thumb || typeof thumb !== "object") problems.push("bible: no thumbnail ({ picture: a room's picture id, x: 0–95 })");
  else {
    const id = thumb.picture;
    if (typeof id !== "string" || !id) problems.push("bible: the thumbnail names no picture");
    else if (id === "died" || state.pictures?.[id]) problems.push(`bible: the thumbnail is the ending's picture "${id}"; it must be a room's (an ending would be a spoiler)`);
    else if (!state.world.rooms[id]?.picture) problems.push(`bible: the thumbnail's picture "${id}" isn't one of the world's room pictures`);
    if (!Number.isInteger(thumb.x) || thumb.x < 0 || thumb.x > columns) problems.push(`bible: the thumbnail's x (${JSON.stringify(thumb.x)}) should be a whole number from 0 to ${columns}`);
  }
  return problems;
}

// What is wrong with the world's pictures that aren't a room's: an `end` that names none, or one that doesn't exist; a world
// that can hurt the player and has no `died` picture; a picture that is badly drawn or has no description.
function pictureProblems(state) {
  const problems = [], pictures = state.pictures || {};
  let hurts = null;
  for (const { effect: e, where } of effectsOf(state)) {
    if (e.end === true) {
      if (typeof e.picture !== "string") problems.push(`${where}: ends the story without naming its picture (end: true, picture: "…")`);
      else if (!pictures[e.picture]) problems.push(`${where}: ends the story with picture "${e.picture}", which the world doesn't have`);
    }
    const lowers = typeof e.set === "string" && e.set === "player.health" && ((typeof e.add === "number" && e.add < 0) || (typeof e.to === "number" && e.to < 100));
    if ((typeof e.hurt === "number" || typeof e.hurt === "string") || lowers) hurts ??= where;
  }
  if (hurts && !pictures.died) problems.push(`${hurts} can hurt the player, so the world needs a "died" picture (the ending when health runs out)`);
  for (const [id, p] of Object.entries(pictures)) {
    if (typeof p?.alt !== "string" || !p.alt.trim()) problems.push(`pictures/${id}: has no alt, the description of the picture for screen readers`);
    for (const why of drawingProblems(p?.picture)) problems.push(`pictures/${id}: ${why}`);
  }
  return problems;
}

// What is wrong with one picture ({ version, draw: [shapes], cycles?, overlays? }), as a room's is checked: only the shapes
// and fills of the art spec, colours 0–15, at most `maxShapes`, unique ids, at most 3 cycles that point at real shapes.
function drawingProblems(picture) {
  if (!picture || !Array.isArray(picture.draw) || !picture.draw.length) return ["has no drawing list"];
  const why = [], colour = (c) => Number.isInteger(c) && c >= 0 && c <= 15, ids = picture.draw.map(d => d?.id).filter(Boolean);
  if (picture.draw.length > art.draw.maxShapes) why.push(`has ${picture.draw.length} shapes, at most ${art.draw.maxShapes}`);
  if (new Set(ids).size !== ids.length) why.push("has a shape id used twice");
  picture.draw.forEach((s, i) => {
    const kinds = art.draw.shapes.filter(k => s && k in s);
    if (kinds.length !== 1) return why.push(`shape ${i + 1} is not one of ${art.draw.shapes.join(", ")}`);
    const f = s.fill, k = kinds[0];
    const fills = [f, ...(f && f.mix ? f.mix : []), ...(f && f.fade ? f.fade : []), ...(f && f.stripes ? f.stripes : [])];
    if (k === "line" || k === "dots" ? !colour(s.color) : [s.edge, ...fills].some(c => c !== undefined && c !== null && typeof c !== "object" && !colour(c)))
      why.push(`shape ${i + 1} (${s.id ?? k}) has a colour outside 0–15`);
  });
  if ((picture.cycles || []).length > 3) why.push("has more than 3 cycles");
  for (const c of picture.cycles || []) {
    if (!art.effects.cycleStyles.includes(c.style)) why.push(`cycle "${c.name ?? "?"}": style is one of ${art.effects.cycleStyles.join(", ")}`);
    if (!Array.isArray(c.colors) || !c.colors.every(colour)) why.push(`cycle "${c.name ?? "?"}": colors are palette numbers 0–15`);
    for (const a of c.areas || []) if (typeof a === "string" ? !ids.includes(a) : !(Array.isArray(a) && a.length === 4))
      why.push(`cycle "${c.name ?? "?"}": area ${JSON.stringify(a)} is neither a shape id of the picture nor [x, y, width, height]`);
  }
  return why;
}

// Healing is fair too (GUIDE.md §3): a positive amount, a line of its own, and not something the player can repeat for ever
// to undo every danger. `heal` is limited when its rule fires once, or when it asks about something it itself uses up (a
// condition on a path the rule sets) or takes away (the rule removes or moves a thing). A rule that happens each day at
// a time (`when: "at"`) is limited by the day. A named change the rule runs counts as part of the rule.
function healProblems(r, e, id, state, problems, warnings) {
  const named = typeof e.heal === "string" && e.heal.startsWith("$");           // a value the player's words fill in
  if (!named && (typeof e.heal !== "number" || !(e.heal > 0))) problems.push(`${id}: heal is a number above 0, not ${JSON.stringify(e.heal)}`);
  if (!e.says) warnings.push(`${id}: heals with no line of its own (says): only "You feel a little better." is shown, and nothing at all at full health`);
  if (!Array.isArray(r.do) || r.once === true || r.when === "at" || r.named) return;   // (a named change is judged in the rules that run it)
  const all = r.do.flatMap(x => x && typeof x.change === "string" ? [x, ...(state.changes?.[x.change] || [])] : [x]);
  const sets = new Set(all.filter(x => x && typeof x.set === "string").map(x => x.set));
  const takes = all.some(x => x && (typeof x.remove === "string" || "move" in x));
  const asks = (Array.isArray(r.if) ? r.if : r.if ? [r.if] : []).flatMap(c => c && typeof c === "object" ? Object.keys(c) : []);
  if (takes || asks.some(k => sets.has(k))) return;
  warnings.push(`${id}: heals every time it fires, so the player can undo any harm by repeating it; make it once, or have it use something up (a condition on something it sets, or a thing it removes)`);
}

// ---- Exits that wait, and exits that can never open -----------------------------------------------------------------
// The world's clock moved to the next time it is h:00 (null if the engine refuses).
function atHour(state, h) {
  const r = applyChangeSet(state, { effects: [{ time: `next ${h}:00` }] });
  return r.refused.length ? null : r.next;
}

// The game as it would be after waiting, soonest first, until this exit is open: the first hour at which its
// conditions hold (everything else as it is now). Null when no hour opens it: it needs something else first.
function opensByWaiting(state, room, dir) {
  const now = worldTime(state);
  const hours = [...Array(24).keys()].map(h => [moveTo(`next ${h}:00`, now).to, h]).sort((a, b) => a[0] - b[0]);
  for (const [, h] of hours) {
    const s = atHour(state, h);
    if (s && exitNow(s, room, dir).go) return s;
  }
  return null;
}

// Conditions that can never hold, for the exits and the waits below. Returns never(list, here?): why a list of conditions (all
// of them must hold) can't hold, or null when it might. Cautious: only a certain "never" is said; whatever it can't tell (a
// value taken from elsewhere, a number added to) counts as possible. A condition can never hold when it:
//   - names a thing, a room or a property that doesn't exist (a typo, a thing never added), or a place that isn't one;
//   - asks for the player in another room than the one it is written for (`here`: a room's own wait);
//   - asks for a number outside the range its property was declared with (`>= 12` of a 0–10 property);
//   - needs an hour of the day that isn't any (a window like [9, 9]), or a declared property that nothing ever sets
//     to a value that passes.
function neverHolds(state, arrived) {
  const inJson = [state.rules, state.changes], rooms = arrived.world.rooms, objects = arrived.world.objects;
  // Every value a declared property can take: what it starts as, and every literal `set` of it. Null if one is unknowable.
  const valuesOf = (id, prop) => {
    const o = objects[id] ?? rooms[id];
    const values = [o?.[prop] ?? state.properties?.[id + "." + prop]?.start ?? null];
    let unknown = false;
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      if (typeof node.set === "string" && (node.set === id + "." + prop || new RegExp(`^\\$(?:obj2?|here|in)\\.${prop}$`).test(node.set))) {
        if ("to" in node && !(typeof node.to === "string" && node.to.startsWith("$"))) values.push(node.to); else unknown = true;
      }
      Object.values(node).forEach(walk);
    };
    inJson.forEach(walk);
    return unknown ? null : values;
  };
  const text = (path, want) => `${path} ${JSON.stringify(want)}`;
  // Things and rooms a rule adds in play aren't there yet: what names them can't be judged. (Nor can a wait a rule sets later.)
  const later = new Set();
  (function find(node) {
    if (Array.isArray(node)) return node.forEach(find);
    if (!node || typeof node !== "object") return;
    if (["room", "object"].includes(node.add) && typeof node.id === "string") later.add(node.id);
    Object.values(node).forEach(find);
  })(inJson);
  // The kind of thing an id names: the engine's own ("player", "game", "time"), an object, a room, or nothing.
  const kindOf = (id) => ["player", "game", "time"].includes(id) ? id : objects[id] ? "object" : rooms[id] ? "room" : later.has(id) ? "later" : null;
  const ownFields = (kind) => kind === "object" ? [...FIELDS.object, ...FIELDS.any] : kind === "room" ? [...FIELDS.room, "place"] : FIELDS[kind] ?? [];
  // A comparison a declared number can't satisfy, whatever sets it (a set is held to the range): [operator, number] pairs.
  const outOfRange = (d, want) => {
    const [lo, hi] = [Number.isFinite(d.min) ? d.min : -Infinity, Number.isFinite(d.max) ? d.max : Infinity];
    const tests = want !== null && typeof want === "object" ? Object.entries(want) : [["=", want]];
    return tests.some(([op, n]) => typeof n === "number" && (op === "=" ? n < lo || n > hi : op === ">" ? hi <= n : op === ">=" ? hi < n
      : op === "<" ? lo >= n : op === "<=" ? lo > n : false));
  };
  // Why this one condition ({ path: want }) can never hold, or null when it might. here: the room a room's wait is in.
  const leaf = (path, want, here) => {
    if (JSON.stringify(want)?.includes("$") || path.includes("$")) return null;
    if (path === "time.hour") {
      const holdsAt = (h) => { const s = atHour(arrived, h); return !s || holds(s, [{ [path]: want }]); };
      return [...Array(24).keys()].some(holdsAt) ? null : `no hour of the day fits ${text(path, want)}`;
    }
    const m = /^([A-Za-z_][\w-]*)\.([A-Za-z_][\w-]*)$/.exec(path);
    if (!m) return null;
    const [, id, prop] = m, kind = kindOf(id);
    if (kind === "later") return null;
    if (!kind) return `${path} names "${id}", which is neither a thing nor a room${suggest(id, [...Object.keys(objects), ...Object.keys(rooms), "player"])}`;
    if (path === "player.at" && typeof want === "string") {
      if (!rooms[want]) return `${text(path, want)} names a room that doesn't exist${suggest(want, Object.keys(rooms))}`;
      if (here && want !== here) return `${text(path, want)} asks for the player in ${want}, but this is ${here}`;
    }
    if (prop === "at" && kind === "object" && typeof want === "string" && want !== "player" && !rooms[want] && !objects[want])
      return `${text(path, want)} names a place that doesn't exist${suggest(want, [...Object.keys(rooms), ...Object.keys(objects)])}`;
    const d = state.properties?.[path];
    if (!d && !ownFields(kind).includes(prop)) return `${path} isn't declared, so it holds nothing${suggest(path, Object.keys(state.properties || {}))}`;
    if (!d) return null;
    if (d.type === "number" && outOfRange(d, want)) return `${text(path, want)} is outside the range ${path} was declared with`;
    const values = valuesOf(id, prop);
    if (!values) return null;
    const passes = values.some(v => {
      const s = structuredClone(arrived), o = s.world.objects[id] ?? s.world.rooms[id];
      if (o) o[prop] = v;
      return holds(s, [{ [path]: want }]);
    });
    return passes ? null : `nothing ever sets ${path} to a value that passes ${text(path, want)}`;
  };
  // Why a list of conditions (all of them) can never hold: one of them can't; for `any`, every item can't.
  const never = (list, here = null) => {
    for (const c of list) for (const [path, want] of Object.entries(c)) {
      if (path === "any") {
        const whys = Array.isArray(want) ? want.map(x => never(Array.isArray(x) ? x : [x], here)) : [];
        if (whys.length && whys.every(Boolean)) return whys[0];
        continue;
      }
      const why = leaf(path, want, here);
      if (why) return why;
    }
    return null;
  };
  never.laterSet = (id) => JSON.stringify(inJson).includes(`"set":"${id}.waitFor`);   // a rule that sets a wait afterwards
  return never;
}

// Exits whose condition can never hold: it needs a declared property that no rule ever sets to a value that passes, or an hour
// of the day that isn't any, or something that isn't there (see neverHolds). `if: false` is the way written as no way through
// (a one-way door): it is meant, so it is left alone.
function neverOpen(state, never, arrived, badExits) {
  const out = [];
  for (const [id, room] of Object.entries(arrived.world.rooms)) for (const [dir, raw] of Object.entries(room.exits || {})) {
    const list = exitConditions(raw);
    if (badExits.has(id + "." + dir) || !list?.length || list.some(c => !c || typeof c !== "object" || Array.isArray(c))) continue;
    const why = never(list);
    if (why) out.push(`${id}: the exit ${dir} can never open: ${why}`);
  }
  return out;
}

// A wait (a room's or a thing's `waitFor`) that can never fire: the `if` that says when waiting is worth it can never hold
// (neverHolds), so "wait for…" would always get "nothing here worth waiting for". A room's own wait only counts while you are in
// that room. A wait with no `if`, or one that might hold, is left alone.
function neverWaits(state, never, arrived) {
  const out = [];
  for (const [id, thing] of [...Object.entries(arrived.world.rooms), ...Object.entries(arrived.world.objects)]) {
    const list = thing.waitFor?.if;
    if (!Array.isArray(list) || !list.length || list.some(c => !c || typeof c !== "object" || Array.isArray(c)) || conditionProblems(list).length || never.laterSet(id)) continue;   // (a badly written one is a problem already)
    const why = never(list, arrived.world.rooms[id] ? id : null);
    if (why) out.push(`${id}: the wait can never fire (waitFor.if): ${why}`);
  }
  return out;
}

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
  const text = String(raw).replace(/\{([^|}]*)(?:\|[^}]*)?\}/g, "$1").replace(/\s+/g, " ").toLowerCase();
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

// Every player-facing text of a world: [{ where, field, text }]. Not pictures or their descriptions (`alt`).
const TEXT_KEYS = new Set(["describe", "says", "say", "closed", "note", "examine", "here", "talk", "take", "listen", "enter", "text", "default", "hint", "hints", "lines"]);
const NOT_TEXT = new Set(["picture", "alt", "draw", "sprite", "floorSprite", "words", "mentions", "if", "match", "id", "name", "label"]);
function worldTexts(state, pack) {
  const out = [];
  for (const [id, r] of Object.entries(state.world.rooms)) collectTexts(r, id, pack, out);
  for (const [id, o] of Object.entries(state.world.objects)) collectTexts(o, id, pack, out);
  for (const r of state.rules) collectTexts(r, r.id, pack, out);
  for (const [name, effects] of Object.entries(state.changes || {})) collectTexts(effects, "change " + name, pack, out);
  for (const [id, p] of Object.entries(state.puzzles || {})) collectTexts(p, id, pack, out);
  return out;
}

// The player-facing texts inside one piece (a room, a thing, a rule, one effect…), added to `out`.
function collectTexts(root, where, pack, out = []) {
  const resolve = (v) => typeof v === "string" && v.startsWith("@") ? v.slice(1).split(".").reduce((x, k) => x?.[k], pack) : v;
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach(x => walk(x, path));
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (NOT_TEXT.has(k)) continue;
      if (TEXT_KEYS.has(k)) {
        const lines = [].concat(resolve(v)).flatMap(x => [].concat(resolve(x)));
        for (const t of lines) if (typeof t === "string") out.push({ where, field: [...path, k].join("."), text: t });
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

// ---- A room that says you can go in or out, with nothing that answers ------------------------------------------------
// A room's text (its `describe`, a scenery's `says`, the `examine` and `here` of a thing in it) that invites the player to go
// in ("step inside", "enter") or out ("get out"), in the words of the pack's `invites` (words.invites: { in, out, not }, whole
// words; a match right after one of `not` is a refusal, "don't go in"), while the room has nothing that answers: "in" (or
// "out") typed in it is only "there's no way", and for in, no "enter" alone finds a door and no boat or the like is there to get into. Like the
// other text warnings it is a nudge: mark the exit that goes there `in: true` (`out: true`), or give the room an `in` / `out` exit.
function wayWarnings(state, pack, arrived) {
  const invites = pack.words.invites, out = [];
  if (!invites) return out;
  const words = (t) => String(t).replace(/\{([^|}]*)(?:\|[^}]*)?\}/g, "$1").toLowerCase().match(/[\p{L}\p{N}'\u2019]+/gu) ?? [];
  const find = (tokens, phrases) => {
    for (const phrase of phrases) {
      const p = phrase.split(" ");
      for (let i = 0; i + p.length <= tokens.length; i++) {
        if (!p.every((w, j) => tokens[i + j] === w)) continue;
        if (!tokens.slice(Math.max(0, i - 2), i).some(w => invites.not.includes(w.replace(/\u2019/g, "'")))) return phrase;
      }
    }
    return null;
  };
  const texts = (id, room) => [
    ...(Array.isArray(room.describe) ? room.describe : []).filter(t => typeof t === "string" && !t.startsWith("@")).map(t => ({ field: "describe", text: t })),
    ...(room.scenery || []).filter(x => typeof x.says === "string").map(x => ({ field: `scenery "${x.words?.[0]}"`, text: x.says })),
    ...Object.entries(arrived.world.objects).filter(([, o]) => o.at === id)
      .flatMap(([oid, o]) => ["examine", "here"].filter(k => typeof o[k] === "string").map(k => ({ field: `${oid} ${k}`, text: o[k] })))
  ];
  // Does typing it in that room get an answer: a move, a line, a thing to enter? (not the stock "no way")
  const answers = (id, commands) => {
    const s = { ...arrived, player: { ...arrived.player, at: id, in: null } };
    return commands.some(c => { const r = parse(c, s, pack); return r.actions && answered(s, r.actions).meaningful; });
  };
  for (const [id, room] of Object.entries(arrived.world.rooms)) {
    const found = texts(id, room);
    for (const [way, verb] of [["in", pack.words.verbs.enter[0]], ["out", null]]) {
      const hit = found.map(f => ({ ...f, phrase: find(words(f.text), invites[way]) })).find(f => f.phrase);
      const enterable = way === "in" && Object.values(arrived.world.objects).some(o => o.at === id && o.enterable);   // a boat to get into
      if (!hit || enterable || answers(id, [pack.words.dirs[way][0], ...(verb ? [verb] : [])])) continue;
      out.push(`${id} (${hit.field}): says "${hit.phrase}", but nothing in the room answers "${pack.words.dirs[way][0]}": mark the exit that goes ${way} \`${way}: true\` (or give the room an \`${way}\` exit)`);
    }
  }
  return out;
}

// The hours the world does something at: conditions on time.hour (every operator's value, both ends of a range), the
// times of scheduled rules, waitFor, time effects and puzzles ("next 23:30", "day 1 17:10", "17:15"), and the hour
// the world starts at. Returns a Set of 0–23.
function worldHours(state, arrived) {
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
  for (const s of [state, arrived]) hour(parts(worldTime(s)).hour);
  return hours;
}

function clockTimeWarnings(state, pack, arrived) {
  const hours = worldHours(state, arrived), warnings = [], seen = new Set();
  const show = ({ hour, minute }) => `${hour}:${String(minute).padStart(2, "0")}`;
  for (const { where, field, text } of worldTexts(state, pack)) {
    if (/\[time\]/.test(text)) continue;
    for (const m of clockMentions(text)) {
      if (m.times.some(t => hours.has(t.hour))) continue;
      const line = `${where} (${field}): "${m.text}" names ${m.times.map(show).join("/")}, but nothing in the world happens at that hour`;
      if (!seen.has(line)) { seen.add(line); warnings.push(line); }
    }
  }
  return warnings;
}

// ---- Words from the state in the text ------------------------------------------------------------------------------
// A [..] in a text is one of the game's words ([time], [day], [weekday], [way]) or a declared property, [thing.property]
// (js/fields.js, "Words from the state in a text"). A name that is neither is a slip: the text would show it as written. A
// yes/no property shows as nothing. And a property that holds nothing yet (no `start`, nothing in the world sets it) shows
// as nothing too ("Ah, ."): warned of wherever the line could be shown before something sets it. In a rule that is
// where the rule can run before: not after a `set` of it earlier in the same rule, nor when the rule's own `if` asks
// about it. Only warns.
function wordWarnings(state, pack) {
  const out = [], seen = new Set(), declared = state.properties || {}, paths = Object.keys(declared);
  const warn = (where, field, why) => { const line = `${where} (${field}): ${why}`; if (!seen.has(line)) { seen.add(line); out.push(line); } };

  // Every text: the words it names must be known.
  for (const { where, field, text } of worldTexts(state, pack)) {
    for (const [, token] of String(text).matchAll(/\[([^\[\]]+)\]/g)) {
      if (TEXT_WORDS.includes(token)) continue;
      if (/^[A-Za-z_][\w-]*\.[A-Za-z_][\w-]*$/.test(token)) {
        if (!declared[token]) warn(where, field, `[${token}] names a property that isn't declared${suggest(token, paths)}`);
        else if (declared[token].type === "boolean") warn(where, field, `[${token}] is a yes/no property: a text shows numbers and words, so it would show nothing`);
        continue;
      }
      const same = paths.find(x => x.split(".")[1] === token);
      warn(where, field, `[${token}] isn't one of the game's words (${TEXT_WORDS.join(", ")}) or a property written thing.property${same ? ` (did you mean [${same}]?)` : suggest(token, TEXT_WORDS)}`);
    }
  }

  // A declared number or string that holds nothing now: no start, and nothing at load put a value in it.
  const empty = (path) => {
    const d = declared[path];
    if (!d || d.type === "boolean") return false;
    const [id, prop] = path.split(".");
    const o = id === "player" ? state.player : id === "game" ? state : state.world.objects[id] ?? state.world.rooms[id];
    return typeof (o?.[prop] ?? d.start) !== "number" && typeof (o?.[prop] ?? d.start) !== "string";
  };
  const named = (text) => [...String(text).matchAll(PROPERTY_WORD)].map(m => m[1] + "." + m[2]).filter(empty);
  const unset = (where, field, path) => warn(where, field, `[${path}] can be shown before anything sets it, and it has no start: it would show nothing (give it a start)`);

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
  return out;
}

// The opening's contract (BRIEF.md §3), checked from its start: what the engine needs to build it (js/opening.js), and
// what only play shows: the way on held back with each thing missing and leading into the world with both, by words
// and by going that way; the restart thing asking; the hints thing framing its hint; the intro saying its text and
// its farewell and leaving; none of the three dropped. Returns the problems found.
function checkOpening(state, pack) {
  const d = state.opening, why = opening.problems(state, d);
  if (why.length) return why;
  const problems = [], { restart: R, hints: H, intro: I, way: W, room: roomId, lines } = d;
  const objects = state.world.objects, rooms = state.world.rooms, room = rooms[roomId];
  const noun = (id) => objects[id].words.nouns[0], low = (list) => (list || []).map(x => String(x).toLowerCase());

  // Its room: in an area of its own, never returned to, and nothing else to take.
  for (const [id, r] of Object.entries(rooms)) {
    if (id !== roomId && r.area === room.area) problems.push(`room "${id}" is in the opening's area "${room.area}": the opening has an area of its own`);
    for (const [dir, to] of Object.entries(r.exits || {}))
      if (exitTo(to) === roomId) problems.push(`${id} has an exit ${dir} back to the opening room: it is never returned to`);
  }
  for (const [dir, to] of Object.entries(room.exits || {}))
    if (typeof exitTo(to) === "string") problems.push(`the opening room has an exit ${dir} to ${to}: its only way on is the way on`);
  for (const [id, o] of Object.entries(objects))
    if ((o.at === roomId || o.at === "player") && o.portable && ![R, H, I].includes(id))
      problems.push(`"${id}" can be taken in the opening: only the restart and hints things can be (the intro is carried)`);
  if (state.tension !== 0) problems.push("the opening has no tension");
  if (!state.puzzles.opening_way) problems.push("the opening's own steps aren't among the puzzles");

  // The three things' words: nothing else in the world answers to them (the way's: nothing else in its room).
  const words = (id) => low(objects[id].words.nouns);
  const users = (id, only) => [
    ...Object.entries(objects).filter(([oid, o]) => oid !== id && (!only || o.at === roomId))
      .flatMap(([oid, o]) => [...low(o.words?.nouns).map(w => [w, oid]), ...(o.parts || []).flatMap(x => low(x.words).map(w => [w, oid + " (a part)"]))]),
    ...Object.entries(rooms).filter(([rid]) => !only || rid === roomId)
      .flatMap(([rid, r]) => (r.scenery || []).flatMap(x => low(x.words).map(w => [w, rid + "'s scenery"])))];
  for (const [k, id] of [["restart", R], ["hints", H], ["intro", I], ["way", W]])
    for (const w of words(id)) for (const [x, who] of users(id, k === "way"))
      if (x === w) problems.push(`"${w}", a word of the ${k} thing "${id}", is also a word of ${who}`);

  // Play it from its start.
  if (state.player.at !== roomId) return [...problems, "the opening has to be checked from its start: the player isn't in its room"];
  const v = pack.words.verbs, dir = opening.direction(state, d);
  const type = (s, command) => {
    const p = parse(command, s, pack);
    return p.actions ? step(s, { ...p.actions[0], at: 0 }) : { next: s, applied: [], refused: [], error: p.error?.say ?? p.meta };
  };
  const said = (r) => r.applied.filter(e => e.say).map(e => e.say);
  const holding = (...ids) => { const s = structuredClone(state); for (const id of ids) { s.world.objects[id].at = "player"; s.player.carrying.push(id); } return s; };
  for (const command of [v.enter[0] + " " + noun(W), v.go[0] + " " + pack.words.dirs[dir][0]]) {
    for (const [have, line, label] of [[[], "notYet", "with neither thing"], [[R], "notYetHints", "without the hints thing"], [[H], "notYetRestart", "without the restart thing"]]) {
      const r = type(holding(...have), command);
      if (!said(r).includes(lines[line])) problems.push(`"${command}" ${label} doesn't say the "${line}" line${r.error ? ` (not understood: ${r.error})` : ""}`);
    }
    const r = type(holding(R, H), command);
    if (r.refused.length) problems.push(`"${command}" with both things: the engine refused ${r.refused[0].reason}`);
    else if (r.next.player.at !== state.entrance) problems.push(`"${command}" with both things doesn't lead to ${state.entrance}${r.error ? ` (not understood: ${r.error})` : ""}`);
    else {
      if (!said(r).includes(lines.through)) problems.push(`"${command}" with both things doesn't say the "through" line`);
      if (r.next.world.rooms[roomId].exits[dir] !== false) problems.push("the way on doesn't close behind you");
    }
  }
  let r = type(holding(R), v.use[0] + " " + noun(R));
  if (!r.next.pending.question || !r.applied.some(e => e.confirm && e.say === lines.askRestart)) problems.push(`using the restart thing doesn't ask "${lines.askRestart}"`);
  r = type(state, v.listen[0] + " " + noun(H));
  if (!r.applied.some(e => e.hint === lines.hintFrame && (e.text || e.commands))) problems.push("listening to the hints thing doesn't give a hint in the world's frame");
  r = type(state, v.read[0] + " " + noun(I));
  if (!said(r).includes(objects[I].examine) || !said(r).includes(lines.farewell) || r.next.world.objects[I].at !== null)
    problems.push("reading the intro doesn't say its text, then its farewell, and take it out of play");
  for (const id of [R, H, I]) {
    r = type(holding(R, H), v.drop[0] + " " + noun(id));
    if (!said(r).includes("@cantDrop")) problems.push(`"${noun(id)}" can be dropped`);
  }
  return problems;
}

// One playthrough towards a goal.
class Run {
  constructor(state, pack, puzzles, warnings = []) {
    this.state = state; this.pack = pack; this.puzzles = puzzles; this.warnings = warnings;
    this.solved = new Set(); this.played = []; this.problem = null; this.clock = 0;
  }

  // USE counts as one of the sensible commands (GUIDE.md §3): where a step puts, unlocks or gives with two things, "use A
  // with B" and "use B with A" must do just what the step's own command does, here and now. Warns (naming the puzzle) when
  // one doesn't: a world rule that answers only one order, say. Nothing is played: each is tried on a copy.
  useCheck(id, command) {
    const { pack } = this;
    command = solveCommand(command, pack);
    const parsed = parse(command, this.state, pack);
    const a = parsed.actions?.length === 1 && parsed.actions[0];
    if (!a || !a.obj2 || !["put", "unlock", "give", "open"].includes(a.verb) || !pack.words.verbs.use) return;
    const objects = this.state.world.objects;
    const noun = (x) => pack.names?.[x]?.nouns?.[0] ?? objects[x]?.words?.nouns?.[0];
    if (!noun(a.obj) || !noun(a.obj2)) return;
    const withWord = pack.words.grammar?.secondObject?.[0] ?? "with", use = pack.words.verbs.use[0];
    // What came of it: the world and you as they are, whether the story ended, and what was said.
    const result = (action) => {
      const r = step(this.state, { ...action, at: this.clock + 1000 }), n = r.next;
      return { refused: r.refused.length, said: r.applied.filter(e => e.say).map(e => String(e.say)),
               digest: JSON.stringify([n.world, n.player, n.ended, n.tension, n.time?.shift, n.pending.question && true]) };
    };
    const typed = result(a);
    for (const [x, y] of [[a.obj, a.obj2], [a.obj2, a.obj]]) {
      const written = `${use} ${noun(x)} ${withWord} ${noun(y)}`, p = parse(written, this.state, pack);
      const warn = (why) => { const w = `${id}: "${written}" ${why}, where "${command}" works`; if (!this.warnings.includes(w)) this.warnings.push(w); };
      if (!p.actions || p.actions.length !== 1) { warn(`isn't understood (${p.error?.say})`); continue; }
      const used = result(p.actions[0]);
      if (used.refused || used.digest !== typed.digest || used.said.join("|") !== typed.said.join("|"))
        warn(`doesn't do the same (it says ${JSON.stringify((used.said[0] ?? "nothing").slice(0, 50))}, not ${JSON.stringify((typed.said[0] ?? "nothing").slice(0, 50))})`);
    }
  }

  // Type a command, as a player would. Fails on words the parser can't read or effects the engine refuses.
  type(command) {
    if (this.problem) return;
    command = solveCommand(command, this.pack);
    this.played.push(command);
    const parsed = parse(command, this.state, this.pack);
    if (!parsed.actions) return this.fail(`"${command}" isn't understood (${parsed.error ? parsed.error.say : parsed.meta})`);
    for (const action of parsed.actions) {
      const r = step(this.state, { ...action, at: (this.clock += 1000) });
      if (r.refused.length) return this.fail(`"${command}": the engine refused ${r.refused[0].reason}`);
      this.state = r.next;
      if (this.state.pending.question) break;
    }
  }
  fail(why) { if (!this.problem) this.problem = why; }

  // Solve a puzzle: first what it needs, then go where it is, then its commands; then check it did what it says.
  solve(id) {
    if (this.problem || this.solved.has(id)) return;
    const p = this.puzzles[id];
    this.solved.add(id);
    for (const n of p.needs || []) {
      if (this.puzzles[n]) this.solve(n);
      else this.get(n, id);
    }
    if (p.where) this.go(p.where);
    if (p.time) {
      const r = applyChangeSet(this.state, { effects: [{ time: p.time }] });
      if (r.refused.length) return this.fail(`"${id}": ${r.refused[0].reason}`);
      this.state = r.next;
    }
    for (const c of p.solve) { this.useCheck(id, c); this.type(c); }
    if (this.problem) return;
    const s = this.state;
    for (const g of p.gives || []) if (!s.world.objects[g] || !inScope(s, g)) return this.fail(`solving "${id}" should give "${g}", but it isn't to hand`);
    if (p.reaches && s.player.at !== p.reaches) return this.fail(`solving "${id}" should reach ${p.reaches}, but you're in ${s.player.at}`);
  }

  // Get a thing: if a puzzle gives it, solve that; then pick it up wherever it lies.
  get(thing, forPuzzle) {
    if (this.problem || this.state.player.carrying.includes(thing)) return;
    const giver = Object.entries(this.puzzles).find(([, p]) => (p.gives || []).includes(thing));
    if (giver) this.solve(giver[0]);
    if (this.problem || this.state.player.carrying.includes(thing)) return;
    const o = this.state.world.objects[thing];
    const place = placeOf(this.state, thing);
    if (!o || !this.state.world.rooms[place]) return this.fail(`"${forPuzzle}" needs "${thing}", but it can't be found`);
    this.go(place);
    const noun = o.words?.nouns?.[0] ?? this.pack.names?.[thing]?.nouns?.[0] ?? thing;
    const take = this.pack.words.verbs.take[0];
    this.type(take + " " + noun);
    if (!this.problem && !this.state.player.carrying.includes(thing)) this.fail(`"${take} ${noun}" didn't pick up "${thing}"`);
  }

  // Walk to a room by its open exits (waiting for the hour of a timed one). If there's no way, solve a puzzle that opens one (it `reaches` somewhere and
  // can be reached itself: the green door, the boat), and try again.
  go(room) {
    if (this.problem || this.state.player.at === room) return;
    let path = route(this.state, this.state.player.at, room);
    while (!path) {
      const opener = Object.entries(this.puzzles).find(([id, p]) => p.reaches && !this.solved.has(id) &&
        (!p.where || p.where === this.state.player.at || route(this.state, this.state.player.at, p.where)));
      if (!opener) return this.fail(`can't get from ${this.state.player.at} to ${room}`);
      this.solve(opener[0]);
      if (this.problem) return;
      path = route(this.state, this.state.player.at, room);
    }
    for (const dir of path) {
      const here = this.state.player.at, raw = this.state.world.rooms[here].exits[dir];
      if (isExitObject(raw) && !exitNow(this.state, here, dir).go) {     // shut: wait for its hour (the clock moves, as a puzzle's `time` does)
        const later = opensByWaiting(this.state, here, dir);
        if (!later) return this.fail(`${dir} from ${here} is shut, and waiting doesn't open it`);
        this.state = later;
      }
      this.type(this.pack.words.dirs[dir][0]);
      if (isExitObject(raw) && !this.problem && this.state.player.at === here) return this.fail(`${dir} from ${here}: the way stays shut`);
    }
  }
}

// The shortest walk between two rooms by exits that lead to rooms (a shut one counts when waiting for its hour opens
// it): a list of directions, or null.
function route(state, from, to) {
  const seen = new Set([from]), queue = [[from, []]];
  while (queue.length) {
    const [room, path] = queue.shift();
    if (room === to) return path;
    for (const [dir, raw] of Object.entries(state.world.rooms[room].exits || {})) {
      const next = exitTo(raw);
      if (typeof next !== "string" || seen.has(next) || !state.world.rooms[next]) continue;
      if (isExitObject(raw) && !exitNow(state, room, dir).go && !opensByWaiting(state, room, dir)) continue;   // shut, and waiting won't open it
      seen.add(next); queue.push([next, [...path, dir]]);
    }
  }
  return null;
}
