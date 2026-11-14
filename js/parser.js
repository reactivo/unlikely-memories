// Parser: turns what you type into actions for the engine (PARSER.md layers 0–2). Pure: reads the state and the
// language's words, never changes anything. It says what you meant; whether it's possible is the engine's job.
//
//   parse(text, state, words, seen?, which?) → one of:
//     { actions: [ { verb, obj?, dir?, prep?, obj2?, … }, … ] }   one or more commands, in order
//     { meta: "undo" | "earlier" | "save" | "load" | "oops" | "clear" | "map" | "quit", arg? }   session commands, run by the controller
//     { error: { say: "@key", arg?, word?, didYouMean? } }           nothing to do: a reply in the world's voice
//
// words = the language pack (its `words`: verbs, directions, articles…). The world adds its own: each object's `words`
// ({ nouns, adj }), each room's `scenery`, and verbs it added (state.vocab), so things the AI creates are understood
// without touching the packs.
//
// A "Which do you mean…?" comes back with `which` (the typed text, the words that were ambiguous, the candidates). The
// controller hands it back to the next parse(): a reply whose words pick out exactly one candidate finishes the
// original command with it; a reply that fits none, or several, is read as a new command (PARSER.md layer 0).

import { holds, answers, ANSWER_LENGTH } from "./engine.js?v=0.49.0";
import { exitTo, wayAt, wayOf, waysOf } from "./exits.js?v=0.49.0";
import { inScope, person } from "./place.js?v=0.49.0";
import { ACTIONS, isAction } from "./actions.js?v=0.49.0";
import { distance } from "./fields.js?v=0.49.0";

// Lower case, no accents, punctuation out except separators (. , ;). What's particular to a language comes from its pack's
// grammar (words.grammar): its elisions written out in full (French "l'oiseau" → "le oiseau") and its folds: what a keyboard
// without a letter types for it (`fold`: German { "ß": "ss", "ä": "ae" }), applied before the accents come off. A letter
// with no fold just loses its accent, so Spanish "ñ" reads as "n": "enseña" and "ensena" are the same word. Typed input and
// every word list (the pack's, the world's) go through this, so they always meet.
// Worked out once per text and grammar (a pack's grammar is one object for good): the world's words are read again on each parse, and
// the packs' elisions build a pattern each time. (A state's own words can't key this: a test changes them in place.) Kept small.
const normalised = new WeakMap();
export function normalise(text, grammar = NO_GRAMMAR) {
  let seen = normalised.get(grammar);
  if (!seen) normalised.set(grammar, seen = new Map());
  let out = seen.get(text);
  if (out === undefined) {
    if (seen.size > 5000) seen.clear();
    seen.set(text, out = fold(text, grammar));
  }
  return out;
}
const NO_GRAMMAR = {};
function fold(text, grammar) {
  let t = text.toLowerCase().replace(/[‘’]/g, "'").normalize("NFC");
  // (an apostrophe inside a word goes, after the language's elisions: "clockmaker's" → "clockmakers")
  for (const [short, full] of Object.entries(grammar.elisions || {}))
    t = t.replace(new RegExp("(^|[\\s.,;])" + short.replace(/'/g, "'"), "g"), "$1" + full + " ");
  t = t.replace(/(\p{L})'(\p{L})/gu, "$1$2");
  for (const [letter, typed] of Object.entries(grammar.fold || {})) t = t.replaceAll(letter.toLowerCase().normalize("NFC"), typed);
  t = t.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return t.replace(/[¿¡!?"'«»“”()]/g, " ")
    .replace(/([.,;])/g, " $1 ")
    .replace(/\s+/g, " ").trim();
}

// The spelling the player sees. Matching works on folded words ("senor"), but what is shown back keeps the original
// ("señor"): `note` records, for each word of a text that normalising changes, how it was written (folded → original).
function note(into, text, grammar) {
  for (const piece of String(text).toLowerCase().split(/\s+/)) {
    const folded = normalise(piece, grammar);
    if (folded && folded !== piece && !folded.includes(" ")) into.set(folded, into.get(folded) ?? piece);
  }
}
const show = (tokens, W) => tokens.map(t => W.shown.get(t) ?? t).join(" ");

// The player's own text with one word put right, in the spelling they typed ("¿Querías decir…?"): the unknown word (as
// parse() reports it, normalised) is replaced by the suggestion, as the pack or the world writes it.
export function retype(raw, word, fix, grammar = {}) {
  let done = false;
  return raw.toLowerCase().replace(/[\p{L}\p{M}\p{N}'’]+/gu, w => (!done && normalise(w, grammar) === word ? ((done = true), fix) : w)).trim();
}

// Read what you typed. A "did you mean…?" is only offered when the corrected command would be understood here: each
// close word is tried in its place, and the first that reads as a command is the suggestion (none if none does).
// seen (optional): the text the player has just read (the room, the last lines). A thing named there that the game
// can't answer about gets "@onlyMentioned" rather than "You see no … here", which would contradict it.
export function parse(text, state, words, seen = "", which = null) {
  const r = read(text, state, words, seen, which);
  const options = r.error?.options;
  if (!options) return r;
  const { options: _, ...error } = r.error;
  // Offered only if the corrected command would be accepted now; a doubtful typo only if something answers it (a
  // rule or the thing itself, not a verb's stock reply: "miss the train" isn't offered as "kiss the train").
  const said = normalise(text, words.words.grammar).split(" ");
  const offers = (o) => {
    const r = read(said.map(t => (t === error.word ? o.word : t)).join(" "), state, words, seen);
    if (r.error?.scenery) return true;                                   // scenery answers too
    if (!r.actions) return false;
    const a = answers(state, r.actions);
    return o.clear ? a.works : a.meaningful;
  };
  const fix = options.find(offers);
  const shown = vocabulary(withWorld(words, state)).shown;           // the suggestion as it is written, not folded ("enseñar")
  return { error: { ...error, didYouMean: fix ? shown.get(fix.word) ?? fix.word : null } };
}

// The reading itself (parse() adds the "did you mean"): layer 0 (an answer, the end, "which do you mean"), session
// commands, then each command in turn. picks: things already chosen in answer to "Which do you mean…?".
function read(text, state, words, seen = "", which = null, picks = []) {
  const V = vocabulary(withWorld(words, state)), seenShown = new Map();
  const W = { ...V, seen: seenWords(seen, words.words.grammar, seenShown), picks, shown: new Map([...V.shown, ...seenShown]) };
  const tokens = normalise(text, words.words.grammar).split(" ").filter(Boolean);

  // Layer 0: a waiting question reads the input as its answer first.
  let q = state.pending.question;
  const said = tokens.filter(x => !W.punct.has(x));
  if (q && q.yesNo) {                                          // a yes/no question (engine: `confirm`)
    if (said.length === 1 && W.yes.has(said[0])) return { actions: [{ verb: "answer", question: q.ask, value: "yes" }] };
    if (said.length === 1 && W.no.has(said[0])) return { actions: [{ verb: "answer", question: q.ask, value: "no" }] };
    // Not an answer: it goes on as a normal command (the engine drops the question), or answers the question for words
    // the session asked over (UNDO while it waits: `then`).
    q = q.then ?? null;
  }
  // SLEEP's question ("How long do you sleep?", engine: `choices`): a length is the answer, with or without the verb ("a short nap",
  // "until morning", "sleep until 18:00", "3 hours"), read as that SLEEP; anything else goes on as a normal command (the engine
  // drops the question).
  if (q && q.choices) {
    const chosen = sleepAnswer(said, W);
    if (chosen) return { actions: [{ verb: "sleep", sleep: chosen }] };
    q = null;
  }
  // A question for words (engine: `ask`): whatever comes next is the answer, a word, a sentence, "look", nothing at all
  // (an empty line is an answer too: `blank`). Only the game's own commands, typed alone, are not:
  // the session's (UNDO, SAVE, LOAD, MAP…: the controller keeps the question open) and HELP.
  if (q && !state.ended) {
    const meta = matchPhrase(tokens, 0, W.meta), verb = matchPhrase(tokens, 0, W.verbs);
    if (meta && meta.len === said.length && (meta.id !== "quit" || quits(meta, tokens, W))) return { meta: meta.id, arg: "" };
    if (verb?.id === "help" && verb.len === said.length) return { actions: [{ verb: "help" }] };
    return { actions: [{ verb: "answer", question: q.ask, text: text.trim().slice(0, ANSWER_LENGTH), blank: !said.length }] };
  }
  // After the end the game is locked: only the restart words ("begin again": the story's last line offers them), LOAD, UNDO
  // and QUIT (alone) are read; anything else, the session commands included, answers with the story's last line.
  if (state.ended) {
    const said = tokens.filter(t => !W.punct.has(t)), meta = matchPhrase(tokens, 0, W.meta);
    if (W.restart.some(p => p.parts.length === said.length && p.parts.every((w, i) => said[i] === w))) return { actions: [{ verb: "begin_again" }] };
    if (meta && ["undo", "load"].includes(meta.id)) return { meta: meta.id, arg: tokens.slice(meta.len).join(" ") };
    if (meta?.id === "quit" && meta.len === said.length) return { meta: "quit", arg: "" };   // (nowhere to go out to: "exit" and "salir" are QUIT here)
    return { error: { say: "@gameOver", style: "sys" } };
  }
  // An answer to "Which do you mean…?": words that name exactly one of the candidates ("brass", "the iron one", "iron
  // key") finish the command that was asked about, with that thing. None, or several, and it's a new command.
  if (which) {
    const reply = tokens.filter(t => !W.punct.has(t) && !W.articles.has(t) && !W.preps.has(t) && !W.one.has(t));
    const fits = (id) => { const n = W.names[id] || {}; return reply.every(t => (n.nouns || []).includes(t) || (n.adj || []).includes(t) || (n.multi || []).some(run => run.includes(t))); };
    const hit = reply.length ? which.candidates.filter(fits) : [];
    if (hit.length === 1) return read(which.text, state, words, seen, null, [...(which.picks || []), { phrase: which.phrase, id: hit[0] }]);
  }
  if (!tokens.length || tokens.every(t => W.punct.has(t))) return { actions: [{ verb: "none" }] };
  if (tokens.every(t => W.yes.has(t) || W.no.has(t) || W.punct.has(t)) && !matchPhrase(tokens, 0, W.dirs) &&
      !matchPhrase(tokens, 0, W.verbs)) return { error: { say: "@unsure" } };    // "yes" when nothing was asked

  // Session commands (only at the start of the input).
  const meta = matchPhrase(tokens, 0, W.meta);
  if (meta && !(meta.id === "quit" && !quits(meta, tokens, W))) return { meta: meta.id, arg: tokens.slice(meta.len).join(" ") };

  // Layer 1: split into commands, then read each.
  const actions = [];
  // The things mentioned lately, newest first: what "it" / "lo" / "la" can mean.
  const recent = [...(state.mentioned || [])];
  if (state.lastObj && !recent.includes(state.lastObj)) recent.unshift(state.lastObj);
  for (const part of splitCommands(tokens, W)) {
    const r = readCommand(part, state, W, recent);
    if (r.error?.say === "@which" || r.error?.say === "@whoMean")   // the controller keeps this for the reply
      return { error: { ...r.error, which: { text, phrase: r.error.phrase, candidates: r.error.arg, picks } } };
    if (r.error) return { error: r.error };
    for (const a of r.actions) { actions.push(a); mention(recent, a); }
  }
  return { actions };
}

// Is this QUIT? The whole input is its words ("quit game" is, "quit the game now" is not). "exit" and "salir" are also the way out
// of a place and the list of ways out (the verb `exit`), and that meaning stays while the story goes on: they quit only after the end
// (above), or as "exit game" / "salir del juego".
function quits(meta, tokens, W) {
  if (tokens.filter(t => !W.punct.has(t)).length !== meta.len) return false;
  const verb = matchPhrase(tokens, 0, W.verbs), dir = matchPhrase(tokens, 0, W.dirs);
  return !((verb?.id === "exit" && verb.len === meta.len) || (dir?.id === "out" && dir.len === meta.len));
}

// The words of what was just shown, markup out ({label|id} → label, `Command` → Command).
function seenWords(seen, grammar, shown = new Map()) {
  if (!seen) return new Set();
  const plain = seen.replace(/\{([^|}]*)(\|[^}]*)?\}/g, "$1").replace(/`/g, "");
  note(shown, plain.replace(/[.,;:¿¡!?"«»“”()]/g, " "), grammar);
  return new Set(normalise(plain, grammar).split(" "));
}

// ---- Vocabulary ---------------------------------------------------------------------------------------

// The pack's words plus the world's: object words, room scenery and added verbs. The same object back when the
// world adds nothing new, so the vocabulary cache keeps working.
const worldWords = new WeakMap();
function withWorld(words, state) {
  const names = {}, scenery = {}, verbs = {}, parts = {}, shown = new Map();
  // The world's words are read the way typed words are (accents, folded letters, apostrophes, capitals), so "Inés" or
  // "clockmaker's" in a world still matches what the player types (and what comes back to them is as the world wrote it).
  const g = words.words.grammar, norm = (list) => (list || []).map(w => { note(shown, w, g); return normalise(String(w), g); });
  // A name of several words ("lift shaft", "tablón de anuncios") is read as one: its words in order, as typed, without the
  // articles and prepositions the reading drops ("de"). A word of one token is an ordinary one.
  const idle = new Set(norm([...(words.words.articles || []), ...(words.words.preps || [])]));
  const runs = (list) => list.filter(x => x.includes(" ")).map(x => x.split(" ").filter(t => !idle.has(t))).filter(r => r.length > 1);
  // A topic's `label` is one of its words: "Ask about <label>" always asks that topic. (Several words are one run, as above.)
  const label = (x) => (typeof x?.label === "string" && x.label.trim() ? norm([x.label])[0] : null);
  const normWords = (x) => ({ ...x, words: norm([...(x.words || []), ...(label(x) ? [x.label] : [])]), label: label(x) ?? undefined });
  const topics = {}, roomNames = {};
  for (const [id, r] of Object.entries(state.world.rooms))           // rooms by name: "hotel" for HOTEL MIRAMAR
    if (typeof r.name === "string" && !r.name.startsWith("@")) { note(shown, r.name, g); roomNames[id] = normalise(r.name, g).split(" "); }
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.words) {
      names[id] = { ...o.words, nouns: norm(o.words.nouns), adj: norm(o.words.adj) };
      const multi = runs(names[id].nouns);
      if (multi.length) names[id].multi = multi;
    }
    if (o.topics) topics[id] = Object.fromEntries(Object.entries(o.topics).map(([k, v]) => [k, typeof v === "object" ? normWords(v) : v]));
    if (o.parts) parts[id] = o.parts.map(normWords);
  }
  for (const [id, r] of Object.entries(state.world.rooms)) if (r.scenery) scenery[id] = r.scenery.map(normWords);
  // A world's words for one of the pack's verbs are added to the pack's (lantern's "pay for" beside "order").
  for (const [verb, v] of Object.entries(state.vocab || {})) verbs[verb] = norm([...(words.words.verbs[verb] || []), ...(v.words || [])]);
  const key = JSON.stringify([names, scenery, verbs, topics, roomNames, parts]);
  if (key === "[{},{},{},{},{},{}]") return words;
  const seen = worldWords.get(words);
  if (seen && seen.key === key) return seen.value;
  const value = { ...words, names, scenery, topics, roomNames, parts,
                  shown: Object.fromEntries(shown), words: { ...words.words, verbs: { ...words.words.verbs, ...verbs } } };
  worldWords.set(words, { key, value });
  return value;
}

// Sets and lookups built from the pack's words (cached per pack).
const cache = new WeakMap();
function vocabulary(words) {
  if (cache.has(words)) return cache.get(words);
  const w0 = words.words, g = w0.grammar || {};
  // The pack's words are read like typed ones (accents, folded letters), so a pack may write its words as they are
  // spelt ("enseñar") and still meet what a keyboard without that letter types.
  const nl = (list) => (list || []).map(x => normalise(x, g));
  const nm = (map) => Object.fromEntries(Object.entries(map || {}).map(([k, list]) => [k, nl(list)]));
  const keys = (map, f = (x) => x) => Object.fromEntries(Object.entries(map || {}).map(([k, x]) => [normalise(k, g), f(x)]));
  const a = g.attached;
  const w = { ...w0, verbs: nm(w0.verbs), meta: nm(w0.meta), dirs: nm(w0.dirs), articles: nl(w0.articles), preps: nl(w0.preps),
    and: nl(w0.and), then: nl(w0.then), it: nl(w0.it), yes: nl(w0.yes), no: nl(w0.no), pronouns: keys(w0.pronouns),
    restart: nl(w0.restart), filler: w0.filler && { start: nl(w0.filler.start), end: nl(w0.filler.end) },
    grammar: { ...g, secondObject: nl(g.secondObject), fromWords: nl(g.fromWords), speechTo: nl(g.speechTo), oneWords: nl(g.oneWords),
               nameParts: nl(g.nameParts), contractions: keys(g.contractions, nl),
               attached: a && { ...a, forms: nl(a.forms), verbEndings: nl(a.verbEndings),
                                pairs: keys(a.pairs, (p) => ({ person: normalise(p.person, g), thing: normalise(p.thing, g) })),
                                doubling: a.doubling && { forms: nl(a.doubling.forms), preps: nl(a.doubling.preps) } } } };
  const shown = new Map();
  for (const list of Object.values(w0.verbs)) for (const word of list) note(shown, word, g);
  const phrases = (map) => Object.entries(map).flatMap(([id, list]) => list.map(p => ({ id, parts: p.split(" ") })))
                                               .sort((a, b) => b.parts.length - a.parts.length);   // longest first
  const v = {
    verbs: phrases(w.verbs), meta: phrases(w.meta), dirs: phrases(w.dirs),
    articles: new Set(w.articles), preps: new Set(w.preps), and: new Set(w.and), then: new Set(w.then),
    it: new Set(w.it), pronouns: w.pronouns || {}, yes: new Set(w.yes), no: new Set(w.no),
    attached: w.grammar?.attached || null, secondObject: new Set(w.grammar?.secondObject || []),
    speechTo: new Set(w.grammar?.speechTo || []),
    askFor: new Set(w.grammar?.askFor || []),         // "ask Dot FOR tea": asking for a thing, not about it (decision 51)
    whom: new Set(w.grammar?.whom || []),             // Spanish "pregunta A Inés", "pide A Inés un café": the person asked
    fromWords: phrases({ f: w.grammar?.fromWords || [] }),   // "take letter FROM bottle": where a thing is taken out of
    restart: phrases({ r: w.restart || [] }),         // "begin again", "new game": a command only after the end
    one: new Set(w.grammar?.oneWords || []),          // "the iron ONE": stands for the thing, names nothing
    contractions: w.grammar?.contractions || {},      // Spanish "al" → "a el", read right after the verb
    nameParts: new Set(w.grammar?.nameParts || []),   // prepositions that can be part of a name ("butaca DEL pasillo")
    fillerStart: phrases({ f: w.filler?.start || [] }), fillerEnd: phrases({ f: w.filler?.end || [] }),
    punct: new Set([".", ",", ";"]),
    names: words.names || {},
    topics: words.topics || {},
    roomNames: words.roomNames || {},
    topicWords: [],
    scenery: words.scenery || {},
    parts: words.parts || {},                     // things an object's lines mention: { objectId: [{ words, name, says? }] }
    shown: new Map([...shown, ...Object.entries(words.shown || {})]),   // how the words that normalising changes were written
    verbWord: Object.fromEntries(Object.entries(w0.verbs).map(([id, list]) => [id, list[0]])),   // "take" → "take", as the pack writes it
    sleep: sleepWords(w0.sleep, nl, phrases)              // what says how long a SLEEP lasts (sleepLength)
  };
  v.topicWords = Object.values(words.topics || {}).flatMap(t => Object.values(t).flatMap(x => (x.words || []).flatMap(e => e.split(" "))));   // (a label of several words: each one is known)
  v.known = new Set([...v.verbs, ...v.meta, ...v.dirs, ...v.fillerStart, ...v.fillerEnd].flatMap(p => p.parts).concat(v.topicWords, Object.values(v.roomNames).flat())
    .concat(w.articles, w.preps, w.and, w.then, w.it, w.yes, w.no,
            Object.values(v.names).flatMap(n => [...(n.nouns || []), ...(n.adj || []), ...(n.multi || []).flat()]),
            Object.values(v.scenery).flat().flatMap(s => s.words), Object.values(v.parts).flat().flatMap(s => s.words)));
  v.verbWords = new Set(v.verbs.filter(p => p.parts.length === 1).map(p => p.parts[0]));   // for typo suggestions
  v.thingWords = new Set(Object.values(v.names).flatMap(n => [...(n.nouns || []), ...(n.adj || []), ...(n.multi || []).flat()])
    .concat(Object.values(v.scenery).flat().flatMap(s => s.words)));
  cache.set(words, v);
  return v;
}

// Does a phrase from the list start at tokens[i]? Returns { id, len } for the longest one, or null.
function matchPhrase(tokens, i, list) {
  for (const p of list) if (p.parts.every((part, k) => tokens[i + k] === part)) return { id: p.id, len: p.parts.length };
  return null;
}

// ---- Layer 1: splitting ---------------------------------------------------------------------------------

// Split on . ; "then", and on "and" / "," when a verb or direction follows ("open box and take mint"); otherwise
// "and" joins objects ("take key and lamp").
function splitCommands(tokens, W) {
  const parts = [[]];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const startsCommand = () => !!(matchPhrase(tokens, i + 1, W.verbs) || dirAt(tokens, i + 1, W) || splitEnclitic(tokens[i + 1], W));
    if (t === "." || t === ";" || W.then.has(t) || ((W.and.has(t) || t === ",") && startsCommand())) {
      if (parts.at(-1).length) parts.push([]);
      continue;
    }
    parts.at(-1).push(t);
  }
  return parts.filter(p => p.length);
}

// Does a direction start at tokens[i]? One that is also a preposition ("in", "dentro") only when it ends the command:
// "look in the box and in the drawer" is one command.
function dirAt(tokens, i, W) {
  const d = matchPhrase(tokens, i, W.dirs), next = tokens[i + (d?.len ?? 0)];
  return d && (!W.preps.has(tokens[i]) || next === undefined || W.punct.has(next) || W.then.has(next) || W.and.has(next)) ? d : null;
}

// Words that add nothing (the pack's `filler`): "can I…", "please", "anyway". Before a command only if a verb or
// direction follows ("can I get on", not "I" for the inventory); after it only if something is left, and not after
// a verb of speech ("say please").
function withoutFiller(tokens, W) {
  const startsCommand = (i) => !!(matchPhrase(tokens, i, W.verbs) || dirAt(tokens, i, W) || splitEnclitic(tokens[i], W));
  let from = 0, end = 0;
  for (let f; (f = matchPhrase(tokens, end, W.fillerStart));) { end += f.len; if (startsCommand(end)) from = end; }
  if (end === tokens.length) return startsCommand(0) ? tokens : null;   // nothing but filler ("please"); "i" alone is still the inventory
  let to = tokens.length;
  const v = matchPhrase(tokens, from, W.verbs);
  if (!(v && ACTIONS[v.id]?.speech))
    for (let again = true; again;) {
      again = false;
      for (const p of W.fillerEnd) {
        const at = to - p.parts.length;
        if (at > from && p.parts.every((part, k) => tokens[at + k] === part)) { to = at; again = true; break; }
      }
    }
  return tokens.slice(from, to);
}

// Pronouns attached to the verb, as the pack's grammar says: joined at the end (Spanish "cogelo" → "coge" + "lo";
// "tragarse" → "tragar", trying its verb endings) or after a hyphen (French "prends-le"). { verb, pronoun } or null.
function splitEnclitic(token, W) {
  const a = W.attached;
  if (!token || !a) return null;
  const verbOf = (stem) => matchPhrase([stem], 0, W.verbs) || (a.verbEndings || []).map(end => matchPhrase([stem + end], 0, W.verbs)).find(Boolean);
  if (a.hyphen && token.includes("-")) {
    const i = token.lastIndexOf("-"), stem = token.slice(0, i), p = token.slice(i + 1);
    const v = a.forms.includes(p) && verbOf(stem);
    return v ? { verb: v.id, pronoun: p } : null;
  }
  if (!a.joined) return null;
  // The shortest pronoun first: "probarsela" is "probarse" + "la" (to try on), not "probar" + "sela" (to taste); "dáselo" has no
  // verb "dase", so it is "da" + "selo".
  for (const e of [...a.forms].sort((x, y) => x.length - y.length)) {
    if (token.length <= e.length + 1 || !token.endsWith(e)) continue;
    const v = verbOf(token.slice(0, -e.length));
    if (v) return { verb: v.id, pronoun: e };
  }
  return null;
}

// ---- Layer 2: one command ---------------------------------------------------------------------------------

// Verbs that, on a thing that is a way out (`leads` or `door`), mean going that way. "open" is one too (the door opens, and you go through),
// but not on a locked thing (that goes to its lock: the key turns, or the lock says what it wants) nor on a container.
const LEADS_VERBS = new Set(["go", "climb", "enter", "exit", "use", "take", "open"]);

// What a verb typed alone means when the room has that way (an `in` / `out` exit, one marked `in: true` / `out: true`, or the way back
// from a place entered by one marked `in: true`):
// "enter" / "get in" is IN, "leave" / "get out" is OUT.
const WAY_OF = { enter: "in", exit: "out" };

// A contraction right after the verb (or verb phrase) is written out: Spanish "sal del coche" → "sal de el coche", "sube al
// tren" → "sube a el tren", which then reads as the phrases "sube a" or "tira de" do. Anywhere else it stays as it is, so
// a name like "la butaca del pasillo" still matches. The pack's grammar says which words (`contractions`). Straight after
// the verb: the words before it are a verb (a phrase, or with a pronoun attached), or become one once it is written out.
function splitContraction(tokens, W) {
  const at = tokens.findIndex(t => W.contractions[t]);
  if (at < 1) return tokens;
  const verbLen = (ts) => matchPhrase(ts, 0, W.verbs)?.len ?? (splitEnclitic(ts[0], W) ? 1 : 0);
  const written = [...tokens.slice(0, at), ...W.contractions[tokens[at]], ...tokens.slice(at + 1)];
  return verbLen(tokens) === at || verbLen(written) > at ? written : tokens;
}

// Up or down, if a word of a verb phrase says so ("climb up", *subir a*): the way it climbs. Null if none does.
function upOrDown(words, W) {
  return words.map(w => matchPhrase([w], 0, W.dirs)?.id).find(dir => dir === "u" || dir === "d") ?? null;
}

// One command (layer 2): its verb, then a direction, or its objects and what comes with them. { actions } or { error }.
// recent: the things mentioned lately, newest first (what a pronoun can mean).
function readCommand(tokens, state, W, recent) {
  tokens = withoutFiller(tokens.filter(t => t !== ","), W);
  if (!tokens) return { error: { say: "@unsure" } };
  tokens = splitContraction(tokens, W);
  let verb = null, rest = tokens, pronoun = null, verbText = null, indirect = null;

  // The verb first, with its articles still in place ("dar un golpe", "dar la vuelta" are phrases).
  const v = matchPhrase(tokens, 0, W.verbs);
  if (v) { verb = v.id; verbText = show(tokens.slice(0, v.len), W); rest = tokens.slice(v.len); }
  else {
    const enc = splitEnclitic(tokens[0], W);
    if (enc) { verb = enc.verb; verbText = W.verbWord[enc.verb]; pronoun = enc.pronoun; rest = tokens.slice(1); }
  }
  // Two pronouns joined to the verb ("dáselo" = to him it): the one for the thing, and one for the person it goes to (the
  // pack's `attached.pairs`). The person is whoever is named after it ("a ella"), else the person the pronoun means.
  const pair = pronoun && W.attached?.pairs?.[pronoun];
  if (pair) { pronoun = pair.thing; indirect = pair.person; }
  // Waiting for something ("wait for the train", "wait until night"): the words go with it, and the thing too if
  // they name one (here or not); whether there's anything to wait for is the world's to say (js/verbs.js).
  if (verb === "wait" && rest.some(t => !W.punct.has(t))) {
    const said = rest.filter(t => !W.punct.has(t));
    const words = said.filter(t => !W.articles.has(t) && !W.preps.has(t));
    const r = words.length ? resolve(words, state, W, false, true) : {};
    return { actions: [{ verb, ...(r.id ? { obj: r.id, ...(r.absent ? { absent: [r.id] } : {}) } : {}), text: said.join(" ") }] };
  }
  // Sleeping ("sleep until 18:00", "sleep 3 hours", "nap", "sleep in the bunk"): how long, from the words that say it (the verb's own
  // too: "nap" is a short one), and the thing the rest names, if it names one here. The engine decides the rest (js/engine.js, sleep).
  if (verb === "sleep") {
    const all = tokens.filter(t => !W.punct.has(t)), found = sleepLength(all, W);
    const start = all.length - rest.filter(t => !W.punct.has(t)).length;   // (where the verb's own words end)
    const left = all.filter((t, i) => i >= start && !found?.used.has(i) && !W.articles.has(t) && !W.preps.has(t) && !W.sleep?.filler.has(t));
    const r = left.length ? resolve(left, state, W, false) : {};
    return { actions: [{ verb, ...(r.id && !r.scenery ? { obj: r.id } : {}), ...(found ? { sleep: found.sleep } : {}) }] };
  }
  // Words said ("say hello", "shout her name"): what follows is speech, not a thing.
  if (verb && (ACTIONS[verb]?.speech || state.vocab?.[verb]?.speech) && rest.some(t => !W.punct.has(t)))
    return readSpeech(verb, rest, pronoun, state, W, recent);
  // Then articles carry no meaning, except a word that is also a pronoun and stands alone after a preposition: the
  // Spanish "con él" (written without its accent, "el", it is the article too).
  const lone = (i) => W.pronouns[rest[i]] && W.preps.has(i ? rest[i - 1] : v ? tokens[v.len - 1] : null) &&
                      (i === rest.length - 1 || W.and.has(rest[i + 1]) || W.punct.has(rest[i + 1]));
  rest = rest.filter((t, i) => !W.articles.has(t) || lone(i));

  // A direction alone, or after "go": go that way. (In and out are also prepositions: "in", "dentro", so the whole
  // rest is tried first.)
  const whole = matchPhrase(rest, 0, W.dirs);
  if ((verb === null || verb === "go") && whole && whole.len === rest.length) return { actions: [{ verb: "go", dir: whole.id }] };
  // "enter" / "leave" alone, in a room with a way in / out, go that way (not while in or on something: that gets you out
  // of it). Without such a way they keep their own meaning.
  if (WAY_OF[verb] && !rest.length && !pronoun && wayAt(state.world.rooms, state.player.at, WAY_OF[verb]) &&
      !(verb === "exit" && state.player.in)) return { actions: [{ verb: "go", dir: WAY_OF[verb] }] };
  const bare = rest.filter(t => !W.preps.has(t));
  const d = matchPhrase(bare, 0, W.dirs);
  if ((verb === null || verb === "go") && d && d.len === bare.length) return { actions: [{ verb: "go", dir: d.id }] };
  // A way typed with a thing that is a way wins over the thing's own `leads` when the thing or the room goes that way ("climb down the
  // stairs" that lead up, in a room with a way down); else the thing's own way stands (steps that go down to the river, south).
  const here = state.world.rooms[state.player.at]?.exits || {};
  const typed = (dir, thing) => (dir && (thing.ways?.includes(dir) || exitTo(here[dir])) ? dir : null);
  if (verb === "climb" && d && d.len === bare.length && exitTo(here[d.id])) return { actions: [{ verb: "go", dir: d.id }] };   // ("climb down", "climb downstairs")
  // A direction and where it leads ("go upstairs to the archive", "go up the ladder"): the room's name decides the
  // way; else a thing here that is a way, by the way typed (above).
  if ((verb === null || verb === "go" || verb === "climb") && d && d.len < bare.length) {   // ("climb down the ladder")
    const tail = bare.slice(d.len);
    const room = neighbourNamed(tail, state, W);
    if (room) return { actions: [{ verb: "go", dir: room }] };
    const thing = resolve(tail, state, W, false);
    if (thing.leads && typed(d.id, thing)) return { actions: [{ verb: "go", dir: d.id }] };
  }
  if (verb === "go" && !rest.length) return { error: { say: "@whatTo", arg: verbText } };

  // Verbs that need nothing more.
  if (verb && !rest.length && !pronoun) {
    const kind = ACTIONS[verb]?.object ?? state.vocab?.[verb]?.object ?? "optional";   // a world verb: its own
    if (kind !== "required") {                                                       // "jump", "listen", "row"
      // Typed alone, it goes to the one thing here it fits ("enter" by door 11; "talk" with only the waiter
      // here), unless the room, or a rule for the verb on its own, answers it here.
      const alone = state.world.rooms[state.player.at]?.[verb] != null || answersAlone(verb, state);
      const one = alone ? null : onlyCandidate(verb, state) || onlyAnswer(verb, state);
      return { actions: [one ? { verb, obj: one } : { verb }] };
    }
    const guess = NO_GUESS.has(verb) ? null : onlyCandidate(verb, state);   // "knock": the only thing to knock on
    if (guess) return { actions: [{ verb, obj: guess }] };
    return { error: { say: "@whatTo", arg: verbText } };
  }

  // Taking something out of something ("take letter from bottle", "saca la carta de la botella"): the thing, and where it
  // comes out of. Only when the words don't already name one thing whole ("caja de pastillas"). Taking follows
  // containers, so the second thing only has to be found.
  if (verb === "take" && !pronoun) {
    const cut = sourceCut(rest, W);
    if (cut && resolve(rest, state, W, false, false, verb).error) {
      const thing = resolve(rest.slice(0, cut.at), state, W, false, false, verb);
      const from = thing.id && !thing.scenery ? resolve(rest.slice(cut.at + cut.len), state, W, false) : null;
      if (from?.id) return { actions: [{ verb, obj: thing.id, prep: rest.slice(cut.at, cut.at + cut.len).join(" "), obj2: from.id }] };
      if (from?.error && !from.scenery) return { error: from.error };
    }
  }

  if (W.whom.size && (verb === "ask" || verb === "order")) rest = whomPlaced(verb, rest, state, W);
  // The object(s): noun phrases joined by "and"; a preposition can introduce a second object ("with key").
  const objs = [], phrases = splitPhrases(rest, W, !!pronoun, (ws) => namesOne(ws, state, W));
  // Asking with no one named ("ask about the umbrella", "pregunta por la llave"): it goes to whoever you're talking
  // to, or the only one here with something to say.
  if (verb === "ask" && !pronoun && phrases.length) {
    // ("ask ABOUT the postmaster": a preposition first means nobody is named, even when the topic is a person.)
    const lead = W.preps.has(rest[0]) ? {} : resolve(phrases[0].words, state, W, false, true);   // (someone named, here or not)
    if (!(lead.id && W.topics[lead.id])) {
      const who = partner(state, W);
      if (who) {
        const forIt = W.askFor.has(rest[0]);                        // "ask for tea": the "for" is kept (decision 51)
        // ASK FOR a thing that comes from them asks for it, even when a topic of theirs has its words (her menu says "tea")
        const last = phrases.at(-1), mine = forIt && fromThem(last.words, who, state, W);
        const topic = mine ? "?" : topicOf(phrases.flatMap(p => p.words), W.topics[who], W) || "?";
        // no topic for it: the thing asked about, if the last words name one (here or not), as "ask Dot about X" has it
        const thing = mine || (topic === "?" ? resolve(last.words, state, W, false, true) : {});
        const about = thing.id && !thing.scenery && thing.id !== who && state.world.objects[thing.id]
          ? { prep: last.prep ?? (W.preps.has(rest[0]) ? rest[0] : null), obj2: thing.id, ...(thing.absent ? { absent: [thing.id] } : {}) }
          : { prep: forIt ? rest[0] : null };
        return { actions: [{ verb, obj: who, ...about, topic, ...(forIt ? { askFor: true } : {}) }] };
      }
    }
  }
  // An attached pronoun that only repeats the person named after it ("pregúntale al portero": le = al portero)
  // is dropped; alone ("pregúntale por el faro") it stands for them.
  const dbl = W.attached?.doubling;
  const doubled = pronoun && dbl?.forms.includes(pronoun) && phrases.length && (!phrases[0].prep || dbl.preps.includes(phrases[0].prep));
  if (doubled) phrases[0] = { ...phrases[0], prep: null };
  else if (pronoun) phrases.unshift({ words: [pronoun], prep: null, attached: true });
  if (indirect && !phrases.slice(1).some(ph => ph.prep)) phrases.push({ words: [indirect], prep: dbl?.preps?.[0] ?? null });   // "dáselo": to whom
  if (KEY_VERBS.has(verb) && phrases.length === 2) W = withLockPicks(phrases, state, W, recent);
  let prep = null, obj2 = null, topic, absent = [], scenery = null;
  const absentOK = !!(ACTIONS[verb]?.absent || state.vocab?.[verb]?.absent);   // "order coffee", "think about the sea"
  for (const ph of phrases) {
    // Asking someone about something: their topics first, by their words ("ask the waiter about the lighthouse");
    // something nobody has a topic for is still a question, answered by their default.
    if (verb === "ask" && ph.prep && objs.length === 1 && W.topics?.[objs[0]] && !(W.askFor.has(ph.prep) && fromThem(ph.words, objs[0], state, W))) {
      topic = topicOf(ph.words, W.topics[objs[0]], W);
      if (topic) { prep = ph.prep; continue; }
    }
    // "enter the hotel", "go to the square", "sube al desván": a neighbouring room by its name goes that way (unless
    // something in reach has that name: "enter room 11" is door 11).
    if ((verb === "enter" || verb === "go" || verb === "climb") && phrases.length === 1) {
      const thing = resolve(ph.words, state, W, false);
      const dir = (thing.error || thing.scenery) && neighbourNamed(ph.words, state, W);
      if (dir) return { actions: [{ verb: "go", dir }] };
    }
    let r = ph.words.length === 1 && W.it.has(ph.words[0]) ? resolvePronoun(ph.words[0], recent, state, W)
                                                          : resolve(ph.words, state, W, !verb && ph === phrases[0],
                                                                    absentOK && (verb !== "ask" || !!ph.prep), verb);   // whoever you ask must be here
    if (ph.attached && verb && phrases.length === 1 && !indirect) r = attachedTo(r, verb, ph.words[0], state, W);
    // No verb, and the words after the first name something here ("ring bell" with no "ring"): the first word is
    // a verb the game doesn't know, not part of a name.
    if (["@notHere", "@onlyMentioned"].includes(r.error?.say) && !verb && ph === phrases[0] && ph.words.length > 1) {
      const after = resolve(ph.words.slice(1), state, W, false);
      if (after.id || after.scenery) return { error: typoOptions(ph.words[0], W.verbWords) };
    }
    if (r.error && verb === "ask" && ph.prep && objs.length === 1 && W.topics?.[objs[0]]) { topic = "?"; prep = ph.prep; continue; }
    // A thing that is a way out (`leads`): going, climbing, entering, opening, using or taking it goes that way ("climb the
    // stairs", "use the ladder", "take the stairs", "open the door").
    // A climbing verb that says its way ("climb up", *subir a*) goes that way; else the thing's own (up, for stairs both ways).
    if (r.leads && phrases.length === 1 && LEADS_VERBS.has(verb) && !(verb === "take" && state.world.objects[r.id]?.portable)
        && !(verb === "open" && (state.world.objects[r.id]?.locked || state.world.objects[r.id]?.container)))
      return { actions: [{ verb: "go", dir: (verb === "climb" && v && typed(upOrDown(tokens.slice(0, v.len), W), r)) || r.leads }] };
    if (r.error) return r;
    if (r.absent) absent.push(r.id);
    if (verb === "ask" && ph.prep && objs.length === 1 && W.topics?.[objs[0]] && !r.scenery) topic = "?";   // still a question
    if (r.scenery) {                                         // mentioned in the text, but not there to use
      // ...except to use something on it ("use rope on tree", "use tree with rope"): the action names the scenery (its
      // `id`, else its first word), so a world's rule for using something with the room can answer it.
      if (verb === "use" && phrases.length === 2 && phrases[1].prep && !scenery) { scenery = r.sceneryId; continue; }
      const looking = !verb || ["examine", "look", "read", "search"].includes(verb);
      if (looking && r.says) return { error: { say: r.says, scenery: true } };    // its own line, if it has one
      return { error: { say: looking ? "@sceneryLook" : "@sceneryOther", arg: r.scenery, scenery: true } };
    }
    if (ph.prep && objs.length) { prep = ph.prep; obj2 = r.id; } else objs.push(r.id);
  }
  if (scenery && objs.length === 1) return { actions: [{ verb, obj: objs[0], prep: phrases[1].prep, scenery }] };
  if (!verb) {
    if (objs.length) return { actions: objs.map(obj => ({ verb: "examine", obj })) };   // just a thing: look at it
    return { error: { say: "@noVerb" } };
  }
  if (verb === "look") verb = "examine";                    // "look door", "mirar puerta"
  const extra = { ...(topic ? { prep, topic } : {}), ...(absent.length ? { absent } : {}), ...(verb === "ask" && W.askFor.has(prep) ? { askFor: true } : {}) };
  return { actions: objs.map(obj => (obj2 ? { verb, obj, prep, obj2, ...extra } : { verb, obj, ...extra })) };
}

// The person asked, named after the pack's `grammar.whom` (Spanish "a", "al"), put where the reading expects them, so they are the
// one asked by name and not whoever you are talking to: first for ASK ("pregunta a Inés por el café", "pregunta por el café a Inés"
// → "pregunta Inés por el café", as "ask Ines about coffee"), last for ORDER, the Spanish asking for ("pide a Inés un café" →
// "pide un café a Inés", whose "a" names the source). Only someone with topics, here or not (one who isn't here is told so); any
// other words are left as they are.
function whomPlaced(verb, rest, state, W) {
  const person = (ws) => { const r = ws.length ? resolve(ws, state, W, false, true) : {}; return !!(r.id && W.topics[r.id]); };
  const upTo = (from) => { const i = rest.findIndex((t, j) => j >= from && W.preps.has(t)); return i < 0 ? rest.length : i; };
  if (W.whom.has(rest[0])) {
    // the longest run of words after "a" that names someone ("a la camarera"; "a Inés un café": Inés)
    for (let end = upTo(1); end > 1; end--) {
      if (!person(rest.slice(1, end))) continue;
      const who = rest.slice(1, end), after = rest.slice(end);
      if (verb === "ask") return [...who, ...after];
      return after.length && !W.preps.has(after[0]) ? [...after, rest[0], ...who] : rest;
    }
    return rest;
  }
  // ASK about something, then whom: "pregunta por el café a Inés"
  const at = rest.findLastIndex(t => W.whom.has(t));
  if (verb === "ask" && at > 0 && W.preps.has(rest[0]) && person(rest.slice(at + 1))) return [...rest.slice(at + 1), ...rest.slice(0, at)];
  return rest;
}

// Verbs that put a key to a lock.
const KEY_VERBS = new Set(["unlock", "open", "lock", "use"]);

// Two things in reach fit the words ("key": the brass key and the iron one) and only one of them goes with the lock the command
// names ("unlock chest with key", "use key with chest", either way round): that one is meant, and nobody is asked. The reading
// carries on with the words as already answered (`picks`, as an answer to "Which do you mean…?" is).
function withLockPicks(phrases, state, W, recent) {
  const read = (ph) => ph.words.length === 1 && W.it.has(ph.words[0]) ? resolvePronoun(ph.words[0], recent, state, W) : resolve(ph.words, state, W, false);
  const things = phrases.map(read), picks = [];
  things.forEach((r, i) => {
    const other = things[1 - i].id;
    if (r.error?.say !== "@which" || !other) return;
    const o = state.world.objects, fit = r.error.arg.filter(c => o[other].lock?.key === c || o[c].lock?.key === other);
    if (fit.length === 1) picks.push({ phrase: r.error.phrase, id: fit[0] });
  });
  return picks.length ? { ...W, picks: [...W.picks, ...picks] } : W;
}

// Where the words say a thing is taken out of ("from", "out of"; the pack's `fromWords`): the first one after at least one
// word, { at, len }, or null.
function sourceCut(tokens, W) {
  for (let i = 1; i < tokens.length; i++) { const m = matchPhrase(tokens, i, W.fromWords); if (m) return { at: i, len: m.len }; }
  return null;
}

// Something said: { verb, text, obj? }. Who it's said to: after the pack's speechTo words, at the end ("say hello
// TO THE WAITER"), or an attached pronoun ("dile hola"), or someone here named first ("tell THE WAITER hello").
// Someone = a thing that answers talking (`talk` or `topics`).
function readSpeech(verb, words, pronoun, state, W, recent) {
  words = words.filter(t => !W.punct.has(t));
  const thing = (ws) => { ws = ws.filter(t => !W.articles.has(t)); return ws.length ? resolve(ws, state, W, false) : {}; };
  let obj = null;
  for (let i = words.length - 1; i > 0 && !obj; i--) {
    if (!W.speechTo.has(words[i])) continue;
    const r = thing(words.slice(i + 1));
    if (r.id) { obj = r.id; words = words.slice(0, i); }
  }
  if (!obj && pronoun) { const r = resolvePronoun(pronoun, recent, state, W); if (r.error) return r; obj = r.id; }
  const someone = (id) => person(state.world.objects[id]);
  for (let n = 1; n < words.length && n <= 4 && !obj; n++) {
    const r = thing(words.slice(0, n));
    if (r.id && someone(r.id)) { obj = r.id; words = words.slice(n); }
  }
  const text = words.join(" ");
  return { actions: [{ verb, ...(obj ? { obj } : {}), ...(text ? { text } : {}) }] };
}

// Split the words after the verb into noun phrases: on "and"/","; a preposition after a first object starts a
// second one ("unlock door with key"); prepositions before the first object are dropped ("look at", "knock on").
// hasFirst: the first object came attached to the verb ("pregúntale POR el faro": le, then a second object).
// A contraction (Spanish "al", "del") that brings in a second object is kept as the words it stands for ("a", "de"), so
// "da la caracola al administrador" reads like "da la caracola a el administrador". One that can be part of a name (the
// pack's `nameParts`: "del") stays in it when the words around it are one name ("la butaca del pasillo": `names` says
// whether these words, all together, name a thing).
function splitPhrases(tokens, W, hasFirst = false, names = () => false) {
  const out = [];
  let cur = { words: [], prep: null };
  tokens.forEach((t, i) => {
    if (W.and.has(t)) { if (cur.words.length) out.push(cur); cur = { words: [], prep: null }; return; }
    if (W.preps.has(t)) {
      const first = !cur.words.length && !out.length, written = W.contractions[t]?.[0] ?? t;
      if (first && hasFirst && W.secondObject.has(t)) { cur.prep = written; return; }
      if (first) return;                                                  // "look at door"
      if (cur.words.length && W.secondObject.has(t)) {
        if (W.nameParts.has(t)) {                                         // "butaca del pasillo": one name, not two things
          const end = tokens.findIndex((x, j) => j > i && (W.preps.has(x) || W.and.has(x)));
          if (names([...cur.words, ...tokens.slice(i + 1, end < 0 ? tokens.length : end)])) return;
        }
        out.push(cur); cur = { words: [], prep: written };
      }
      return;                                                             // "caja de pastillas": part of the name
    }
    cur.words.push(t);
  });
  if (cur.words.length) out.push(cur);
  return out;
}

// Do these words fit this thing's names: one of its nouns among them, and all of them its nouns or adjectives? A noun of several
// words ("lift shaft", `multi`) is one noun: its words, together and in order, count as it, and cover each other.
function fitsName(n, words) {
  if (!n) return false;
  const nouns = new Set(n.nouns || []), adj = new Set(n.adj || []);
  if (!n.multi) return words.some(w => nouns.has(w)) && words.every(w => nouns.has(w) || adj.has(w));
  const covered = words.map(w => nouns.has(w) || adj.has(w));
  let noun = words.some(w => nouns.has(w));
  for (const run of n.multi)
    for (let i = 0; i + run.length <= words.length; i++)
      if (run.every((t, k) => words[i + k] === t)) { noun = true; run.forEach((_, k) => { covered[i + k] = true; }); }
  return noun && covered.every(Boolean);
}

// Do these words end in one of the thing's nouns (a run of several words counts as one)? "mint" ends the mint, not the tin of mints.
function endsInNoun(n, words) {
  return (n.nouns || []).includes(words.at(-1)) || (n.multi || []).some(run => run.every((t, k) => words.at(k - run.length) === t));
}

// Do these words, all together, name one thing (anywhere), scenery here, or a neighbouring room? "butaca pasillo" does, for
// "la butaca del pasillo", and "escalera rio" for "ir a la escalera del río", so the "del" isn't taken for a second object.
function namesOne(phrase, state, W) {
  const words = phrase.filter(w => !W.preps.has(w));
  if (words.length < 2 || words.some(w => !W.known.has(w))) return false;
  return Object.keys(state.world.objects).some(id => fitsName(W.names[id], words)) ||
         sceneryHere(state, W).some(s => words.every(w => s.words.includes(w))) || !!neighbourNamed(words, state, W);
}

// The direction of the neighbouring room these words name (all of them in its name), or null.
function neighbourNamed(phrase, state, W) {
  const words = phrase.filter(w => !W.preps.has(w) && !W.articles.has(w));
  if (!words.length) return null;
  const exits = Object.entries(state.world.rooms[state.player.at].exits || {}).map(([d, x]) => [d, exitTo(x)]).filter(([, to]) => typeof to === "string");
  const hit = exits.find(([, to]) => W.roomNames[to] && words.every(w => W.roomNames[to].includes(w)));
  return hit ? hit[0] : null;
}

// Who a question goes to when no one is named: the one you're talking to, if they're still here; else the only one
// here with topics.
function partner(state, W) {
  const t = state.talkingTo;
  if (t && W.topics[t] && inScope(state, t)) return t;
  const here = Object.keys(W.topics).filter(id => state.world.objects[id] && inScope(state, id));
  return here.length === 1 ? here[0] : null;
}

// Which of someone's topics do these words name? The topic's key, or null.
// A topic's label is asked as it is shown ("Ask about the fourth floor"): the topic whose label these words are, whole, comes
// first; then the first whose words are among them, a word of several words (a label, "tablón de anuncios") as one.
function topicOf(phrase, topics, W) {
  const words = phrase.filter(w => !W.preps.has(w) && !W.articles.has(w));
  const run = (x) => x.split(" ").filter(t => !W.preps.has(t) && !W.articles.has(t));
  const has = (r) => r.length > 0 && words.some((_, i) => r.every((t, k) => words[i + k] === t));
  const topic = Object.entries(topics).filter(([k, t]) => k !== "default" && t && typeof t === "object");
  const found = topic.find(([, t]) => t.label && run(t.label).join(" ") === words.join(" ")) ||
                topic.find(([, t]) => (t.words || []).some(e => has(run(e))));
  return found ? found[0] : null;
}

// Which object do these words name? Only things in scope (here, carried, or inside those). first: these are the
// first words typed (no verb was found), so an unknown first word is more likely a mistyped verb. absentOK: the verb may
// name something that exists but isn't here (marked absent): "order coffee". verb: what's being done, to choose between
// two that fit (taking means one you don't already hold).
function resolve(phrase, state, W, first, absentOK = false, verb = null) {
  const words = phrase.filter(w => !W.preps.has(w));
  const unknown = words.find(w => !W.known.has(w));
  if (unknown && W.seen.has(unknown) && !(first && unknown === words[0])) return { error: { say: "@onlyMentioned", arg: show(words, W) } };
  if (unknown) return { error: typoOptions(unknown, first && unknown === words[0] ? W.verbWords : wordsHere(state, W)) };
  const fits = (id) => fitsName(W.names[id], words);
  const matches = Object.keys(state.world.objects).filter(id => fits(id));
  const here = matches.filter(id => inScope(state, id));
  if (here.length === 1) return { id: here[0], ...leadsOf(state.world.objects[here[0]]) };
  const scenery = sceneryHere(state, W).find(s => words.some(w => s.words.includes(w)));
  if (!here.length && scenery) return { scenery: scenery.name, says: scenery.says, sceneryId: scenery.id ?? scenery.words[0], ...leadsOf(scenery) };
  if (!here.length && absentOK && matches.length === 1) return { id: matches[0], absent: true };
  if (here.length > 1) {
    // Already answered ("Which do you mean…?"): the one that was picked for these words.
    const picked = W.picks.find(p => p.phrase === words.join(" ") && here.includes(p.id));
    if (picked) return { id: picked.id, ...leadsOf(state.world.objects[picked.id]) };
    // Prefer an exact noun match ("mint" names the mint, not the tin of mints)
    const exact = here.filter(id => endsInNoun(W.names[id], words));
    if (exact.length === 1) return { id: exact[0] };
    const free = verb === "take" ? here.filter(id => !state.player.carrying.includes(id)) : [];
    if (free.length === 1) return { id: free[0], ...leadsOf(state.world.objects[free[0]]) };
    return { error: { say: "@which", arg: here, phrase: words.join(" ") } };
  }
  if (W.seen.has(words.at(-1))) return { error: { say: "@onlyMentioned", arg: show(words, W) } };   // just read about
  return { error: { say: "@notHere", arg: show(phrase, W) } };
}

// A thing that is a way out (stairs, a ladder, a path: `leads: "u"`; a door, a gate, a hatch: `door: "e"`), as { leads } for resolve();
// else nothing.
function leadsOf(thing) {
  return wayOf(thing) ? { leads: wayOf(thing), ways: waysOf(thing) } : {};
}

// What's mentioned here but not there to use: the room's scenery, and the parts of things in reach (the key in
// door 11's lock, the ticket in the coat's pocket).
function sceneryHere(state, W) {
  const parts = Object.entries(W.parts).filter(([id]) => state.world.objects[id] && inScope(state, id)).flatMap(([, p]) => p);
  return [...(W.scenery[state.player.at] || []), ...parts];
}

// Remember what an action mentioned, newest first (its object, then the second one: "put the oars in the boat").
function mention(recent, a) {
  for (const id of [a.obj2, a.obj]) if (id) { const i = recent.indexOf(id); if (i >= 0) recent.splice(i, 1); recent.unshift(id); }
}

// Does the thing fit the pronoun: its gender (`g`) and number (`pl`), where both say one?
function fitsPronoun(word, id, state, W) {
  const want = W.pronouns[word] || {}, o = state.world.objects[id], w = o?.words || W.names[id] || {};
  return (!want.g || !w.g || w.g === want.g) && (want.pl === undefined || !!w.pl === want.pl);
}

// What a pronoun means (the pack's `pronouns` say what each prefers).
// - By default the most recent thing in reach that fits its gender (`g`) and number (`pl`) ("la" → la caja, "los" → los
//   remos, "them" → something plural); if none fits, the most recent thing in reach; if none, ask.
// - A pronoun that prefers a person (`person`: "him", "her", *le*, *él*) means a person and never a thing: the last person
//   mentioned, or talked to (`talkingTo`), if in reach; else the only person in reach; with several and none mentioned,
//   ask who. A person is a character: an object with `topics` or `talk` (js/use.js, `person`).
function resolvePronoun(word, recent, state, W) {
  const want = W.pronouns[word] || {};
  const fits = (id) => fitsPronoun(word, id, state, W);
  if (want.person) {
    const picked = W.picks.find(p => p.phrase === word && inScope(state, p.id));          // "Who do you mean?" was answered
    if (picked) return { id: picked.id };
    const people = (ids) => ids.filter(id => person(state.world.objects[id]) && inScope(state, id) && fits(id));
    const known = people([...recent, state.talkingTo].filter(Boolean))[0];
    if (known) return { id: known };
    const all = people(Object.keys(state.world.objects));
    if (all.length === 1) return { id: all[0] };
    return all.length ? { error: { say: "@whoMean", arg: all, phrase: word } } : { error: { say: "@noPerson" } };
  }
  const here = recent.filter(id => inScope(state, id));
  if (!here.length) return { error: { say: "@noIt" } };
  return { id: here.find(fits) || here[0] };
}

// A pronoun joined to the verb ("pruébatela", "ábrela") means what the verb typed alone would go to (the one thing here it fits), when
// that thing fits the pronoun and the pronoun has nothing else to mean that the verb does something with: nothing mentioned lately, or
// something only a stock reply answers (the dressmaker just talked to, for "pruébatela"). Else it stays what it means (resolvePronoun).
function attachedTo(r, verb, word, state, W) {
  const want = W.pronouns[word];
  if (!want || want.person) return r;
  const required = (ACTIONS[verb]?.object ?? state.vocab?.[verb]?.object) === "required";
  const alone = required ? (NO_GUESS.has(verb) ? null : onlyCandidate(verb, state)) : onlyCandidate(verb, state) || onlyAnswer(verb, state);
  if (!alone || alone === r.id || !fitsPronoun(word, alone, state, W)) return r;
  if (r.id && answers(state, [{ verb, obj: r.id }]).meaningful) return r;
  return { id: alone };
}

// For a verb typed alone: the one thing in scope that answers it with a property of that name, if exactly one does.
function onlyAnswer(verb, state) {
  const ids = Object.entries(state.world.objects).filter(([id, o]) => o[verb] != null && typeof o[verb] !== "boolean" && inScope(state, id));
  return ids.length === 1 ? ids[0][0] : null;
}

// Verbs never completed by guessing (too general: "take" alone should ask what).
const NO_GUESS = new Set(["examine", "take", "drop", "go"]);

// For a verb typed alone ("knock"): if exactly one thing in scope has a game rule for that verb, it's that.
function onlyCandidate(verb, state) {
  const ids = new Set();
  for (const r of state.rules) {
    const m = r.match || {};
    if (![].concat(m.verb).includes(verb) || m.obj === undefined) continue;
    for (const id of [].concat(m.obj)) if (inScope(state, id)) ids.add(id);
  }
  return ids.size === 1 ? [...ids][0] : null;
}

// Nothing makes sense of the word: the known words of the right kind (`pool`) one slip away (a letter missing, extra,
// changed or swapped), for parse() to try in its place. In a long word that's a clear typo; in a short one only two
// swapped letters or a doubled letter are. A changed letter is doubtful, even a neighbouring key ("miss" isn't clearly
// "kiss", though m touches k). Clear ones first. [{ word, clear }]
function typoOptions(word, pool) {
  const options = word.length < 4 ? [] : [...pool].filter(k => k.length >= 3 && distance(word, k) === 1)
    .map(k => ({ word: k, clear: word.length >= 5 || clearSlip(word, k) }))
    .sort((a, b) => b.clear - a.clear);
  return { say: "@unsure", word, didYouMean: null, options };
}

// Is a one-slip difference between a short word and a known one clearly a typo?
function clearSlip(word, known) {
  if (word.length === known.length) {
    const diff = [...word].map((_, i) => i).filter(i => word[i] !== known[i]);
    return diff.length === 2;                                             // two letters swapped, not one changed
  }
  const [long, short] = word.length > known.length ? [word, known] : [known, word];
  const i = [...short].findIndex((c, j) => c !== long[j]), at = i < 0 ? short.length : i;
  return long[at] === long[at - 1] || long[at] === long[at + 1];          // a letter doubled, or a double one single
}

// The words for things here: what's in reach, and this room's scenery (not the cave's roof when you're upstairs).
function wordsHere(state, W) {
  const ids = Object.keys(W.names).filter(id => state.world.objects[id] && inScope(state, id));
  return new Set(ids.flatMap(id => [...(W.names[id].nouns || []).filter(x => !x.includes(" ")), ...(W.names[id].adj || []), ...(W.names[id].multi || []).flat()])
    .concat(sceneryHere(state, W).flatMap(s => s.words)));
}

// Does a rule answer this verb typed on its own, here and now?
function answersAlone(verb, state) {
  return state.rules.some(r => {
    const m = r.match || {};
    if (!isAction(r) || !m.verb || ![].concat(m.verb).includes(verb)) return false;
    if (m.obj !== undefined && !(Array.isArray(m.obj) && m.obj.includes(null))) return false;
    return holds(state, r.if, { verb });
  });
}

// ---- How long a sleep lasts ---------------------------------------------------------------------------------------
// The pack's words for it (`words.sleep`), read like typed ones: the three names (nap, few, morning), "until" before a time of day,
// the units after a number (hours, minutes), the numbers in words, a.m. and p.m., noon and midnight, and the words around them that
// add nothing ("for"). Null for a pack with none.
function sleepWords(S, nl, phrases) {
  if (!S) return null;
  const set = (x) => new Set(nl(x));
  return { names: phrases({ nap: nl(S.nap), few: nl(S.few), morning: nl(S.morning) }), until: phrases({ u: nl(S.until) }),
    hours: set(S.hours), minutes: set(S.minutes), am: phrases({ am: nl(S.am) }), pm: phrases({ pm: nl(S.pm) }),
    noon: phrases({ noon: nl(S.noon) }), midnight: phrases({ midnight: nl(S.midnight) }), filler: set(S.filler),
    numbers: Object.fromEntries(Object.entries(S.numbers || {}).map(([k, n]) => [nl([k])[0], n])) };
}
// What these words say of a sleep's length: { sleep, used } (the indexes of the words that said it), or null. sleep is
// { until: minutes of the day } ("until 18:00", "till 6 pm", "hasta las seis de la tarde", "until noon"), { minutes } ("3 hours",
// "an hour", "45 minutes", "3h") or { name } ("a short nap", "a few hours", "until morning"), tried in that order.
function sleepLength(tokens, W) {
  const S = W.sleep;
  if (!S) return null;
  const span = (from, len) => new Set(Array.from({ length: len }, (_, k) => from + k));
  for (let i = 0; i < tokens.length; i++) {
    const u = matchPhrase(tokens, i, S.until), at = u && clockAt(tokens, i + u.len, S);
    if (at) return { sleep: { until: at.minutes }, used: span(i, u.len + at.len) };
  }
  for (let i = 0; i < tokens.length; i++) {
    const glued = /^(\d{1,3})([a-z]+)$/.exec(tokens[i]), n = glued ? +glued[1] : numberOf(tokens[i], S);
    const unit = glued ? glued[2] : tokens[i + 1], len = glued ? 1 : 2;
    if (!(n > 0) || !unit) continue;
    if (S.hours.has(unit)) return { sleep: { minutes: n * 60 }, used: span(i, len) };
    if (S.minutes.has(unit)) return { sleep: { minutes: n }, used: span(i, len) };
  }
  for (let i = 0; i < tokens.length; i++) {
    const m = matchPhrase(tokens, i, S.names);
    if (m) return { sleep: { name: m.id }, used: span(i, m.len) };
  }
  return null;
}
// A number, in figures or in words ("3", "three", "tres", "an"), or null.
const numberOf = (t, S) => (/^\d{1,3}$/.test(t) ? +t : S.numbers[t] ?? null);
// A time of the day at tokens[i]: "18:00", "18", "six", "6pm", "6 pm", "seis de la tarde"; noon, midnight. { minutes, len } or null.
function clockAt(tokens, i, S) {
  const t = tokens[i];
  if (t === undefined) return null;
  for (const [list, h] of [[S.noon, 12], [S.midnight, 0]]) { const m = matchPhrase(tokens, i, list); if (m) return { minutes: h * 60, len: m.len }; }
  let h = null, min = 0, len = 1, half = null, m;   // half: "am" or "pm", when the words say which
  if ((m = /^(\d{1,2}):(\d{2})$/.exec(t))) { h = +m[1]; min = +m[2]; }
  else if ((m = /^(\d{1,2})([a-z]+)$/.exec(t)) && (matchPhrase([m[2]], 0, S.am) || matchPhrase([m[2]], 0, S.pm))) { h = +m[1]; half = matchPhrase([m[2]], 0, S.pm) ? "pm" : "am"; }
  else h = numberOf(t, S);
  if (h === null || h > 24 || min > 59) return null;
  if (!half) {
    const pm = matchPhrase(tokens, i + 1, S.pm), am = !pm && matchPhrase(tokens, i + 1, S.am);
    if (pm || am) { half = pm ? "pm" : "am"; len += (pm || am).len; }
  }
  if (half === "pm" && h < 12) h += 12;
  if (half === "am" && h === 12) h = 0;
  return { minutes: (h % 24) * 60 + min, len };
}
// The answer to SLEEP's question: words that say a length and nothing else (the verb, articles, prepositions and the words that
// add nothing aside). Null when they say more, or no length.
function sleepAnswer(tokens, W) {
  const found = sleepLength(tokens, W);
  if (!found) return null;
  const verbs = new Set();
  for (let i = 0; i < tokens.length; i++) { const v = matchPhrase(tokens, i, W.verbs); if (v?.id === "sleep") for (let k = 0; k < v.len; k++) verbs.add(i + k); }
  const left = tokens.filter((t, i) => !found.used.has(i) && !verbs.has(i) && !W.articles.has(t) && !W.preps.has(t) && !W.sleep.filler.has(t));
  return left.length ? null : found.sleep;
}

// The thing the words name, when it comes from `who` (`from`, decision 40), here or not: what ASK FOR asks for, before any topic of theirs
// with the same words ("ask Dot for tea" is her tea, not her menu, whose words say "tea"). Null otherwise.
function fromThem(words, who, state, W) {
  const r = resolve(words, state, W, false, true);
  return r.id && !r.scenery && state.world.objects[r.id]?.from === who ? r : null;
}
