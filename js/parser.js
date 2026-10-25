// Parser: turns what you type into actions for the engine (PARSER.md layers 0–2). Pure: reads the state and the
// language's words, never changes anything. It says what you meant; whether it's possible is the engine's job.
//
//   parse(text, state, words, seen?, which?) → one of:
//     { actions: [ { verb, obj?, dir?, prep?, obj2?, … }, … ] }   one or more commands, in order
//     { meta: "undo" | "earlier" | "save" | "load" | "oops" | "clear" | "map" | "quit", arg? }   session commands, run by the controller
//     { error: { say: "@key", arg?, word?, didYouMean? } }           nothing to do: a reply in the world's voice
//
// words = the language pack's `words` (verbs, directions, articles…) plus `names` (object id → nouns, adjectives).
// The world adds its own: each object's `words` ({ nouns, adj }), each room's `scenery`, and verbs it added
// (state.vocab), so things the AI creates are understood without touching the packs.
//
// A "Which do you mean…?" comes back with `which` (the typed text, the words that were ambiguous, the candidates). The
// controller hands it back to the next parse(): a reply whose words pick out exactly one candidate finishes the
// original command with it; a reply that fits none, or several, is read as a new command (PARSER.md layer 0).

import { ACTIONS } from "./actions.js";
import { holds, answers } from "./engine.js";
import { exitTo, wayFor } from "./exits.js";
import { placeOf, shut } from "./use.js";
import { distance } from "./fields.js";

// Lower case, no accents, punctuation out except separators (. , ;). What's particular to a language comes from
// its pack's grammar (words.grammar): the letters it keeps (Spanish ñ), its elisions written out in full (French
// "l'oiseau" → "le oiseau").
export function normalise(text, grammar = {}) {
  let t = text.toLowerCase().replace(/[‘’]/g, "'");
  // (an apostrophe inside a word goes, after the language's elisions: "clockmaker's" → "clockmakers")
  for (const [short, full] of Object.entries(grammar.elisions || {}))
    t = t.replace(new RegExp("(^|[\\s.,;])" + short.replace(/'/g, "'"), "g"), "$1" + full + " ");
  t = t.replace(/(\p{L})'(\p{L})/gu, "$1$2");
  const keep = grammar.keep || [];
  keep.forEach((ch, i) => { t = t.replaceAll(ch, String.fromCharCode(0xE000 + i)); });   // set kept letters aside
  t = t.normalize("NFD").replace(/[̀-ͯ]/g, "");
  keep.forEach((ch, i) => { t = t.replaceAll(String.fromCharCode(0xE000 + i), ch); });
  return t.replace(/[¿¡!?"'«»“”()]/g, " ")
    .replace(/([.,;])/g, " $1 ")
    .replace(/\s+/g, " ").trim();
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
  return { error: { ...error, didYouMean: fix?.word || null } };
}

function read(text, state, words, seen = "", which = null, picks = []) {
  const W = { ...vocabulary(withWorld(words, state)), seen: seenWords(seen, words.words.grammar), picks };
  const tokens = normalise(text, words.words.grammar).split(" ").filter(Boolean);

  // Layer 0: a waiting question reads the input as its answer first.
  const q = state.pending.question;
  if (q && q.ask === "name") return { actions: [{ verb: "answer", question: "name", text: text.trim().slice(0, 40), blank: !tokens.length }] };
  if (q && q.yesNo) {                                          // a yes/no question (engine: `confirm`)
    const t = tokens.filter(x => !W.punct.has(x));
    if (t.length === 1 && W.yes.has(t[0])) return { actions: [{ verb: "answer", question: q.ask, value: "yes" }] };
    if (t.length === 1 && W.no.has(t[0])) return { actions: [{ verb: "answer", question: q.ask, value: "no" }] };
    // Not an answer: it goes on as a normal command (the engine drops the question).
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
    const fits = (id) => { const n = W.names[id] || {}; return reply.every(t => (n.nouns || []).includes(t) || (n.adj || []).includes(t)); };
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
    const r = readCommand(part, state, W, words, recent);
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
function seenWords(seen, grammar) {
  if (!seen) return new Set();
  return new Set(normalise(seen.replace(/\{([^|}]*)(\|[^}]*)?\}/g, "$1").replace(/`/g, ""), grammar).split(" "));
}

// ---- Vocabulary ---------------------------------------------------------------------------------------

// The pack's words plus the world's: object words, room scenery and added verbs. The same object back when the
// world adds nothing new, so the vocabulary cache keeps working.
const merged = new WeakMap();
function withWorld(words, state) {
  const names = {}, scenery = {}, verbs = {}, parts = {};
  // The world's words are read the way typed words are (accents, apostrophes, capitals), so "Inés" or
  // "clockmaker's" in a world still matches what the player types.
  const g = words.words.grammar, norm = (list) => (list || []).map(w => normalise(String(w), g));
  const normWords = (x) => ({ ...x, words: norm(x.words) });
  const topics = {}, roomNames = {};
  for (const [id, r] of Object.entries(state.world.rooms))           // rooms by name: "hotel" for HOTEL MIRAMAR
    if (typeof r.name === "string" && !r.name.startsWith("@")) roomNames[id] = normalise(r.name, words.words.grammar).split(" ");
  for (const [id, o] of Object.entries(state.world.objects)) {
    if (o.words) names[id] = { ...o.words, nouns: norm(o.words.nouns), adj: norm(o.words.adj) };
    if (o.topics) topics[id] = Object.fromEntries(Object.entries(o.topics).map(([k, v]) => [k, typeof v === "object" ? normWords(v) : v]));
    if (o.parts) parts[id] = o.parts.map(normWords);
  }
  for (const [id, r] of Object.entries(state.world.rooms)) if (r.scenery) scenery[id] = r.scenery.map(normWords);
  for (const [verb, v] of Object.entries(state.vocab || {})) verbs[verb] = v.words;
  const key = JSON.stringify([names, scenery, verbs, topics, roomNames, parts]);
  if (key === "[{},{},{},{},{},{}]") return words;
  const seen = merged.get(words);
  if (seen && seen.key === key) return seen.value;
  const value = { ...words, names: { ...words.names, ...names }, scenery: { ...words.scenery, ...scenery }, topics, roomNames, parts,
                  words: { ...words.words, verbs: { ...words.words.verbs, ...verbs } } };
  merged.set(words, { key, value });
  return value;
}

// Sets and lookups built from the pack's words (cached per pack).
const cache = new WeakMap();
function vocabulary(words) {
  if (cache.has(words)) return cache.get(words);
  const w = words.words;
  const phrases = (map) => Object.entries(map).flatMap(([id, list]) => list.map(p => ({ id, parts: p.split(" ") })))
                                               .sort((a, b) => b.parts.length - a.parts.length);   // longest first
  const v = {
    verbs: phrases(w.verbs), meta: phrases(w.meta), dirs: phrases(w.dirs),
    articles: new Set(w.articles), preps: new Set(w.preps), and: new Set(w.and), then: new Set(w.then),
    it: new Set(w.it), pronouns: w.pronouns || {}, yes: new Set(w.yes), no: new Set(w.no),
    attached: w.grammar?.attached || null, secondObject: new Set(w.grammar?.secondObject || []),
    speechTo: new Set(w.grammar?.speechTo || []),
    fromWords: phrases({ f: w.grammar?.fromWords || [] }),   // "take letter FROM bottle": where a thing is taken out of
    restart: phrases({ r: w.restart || [] }),         // "begin again", "new game": a command only after the end
    one: new Set(w.grammar?.oneWords || []),          // "the iron ONE": stands for the thing, names nothing
    contractions: w.grammar?.contractions || {},      // Spanish "al" → "a el", read right after the verb
    fillerStart: phrases({ f: w.filler?.start || [] }), fillerEnd: phrases({ f: w.filler?.end || [] }),
    punct: new Set([".", ",", ";"]),
    names: words.names || {},
    topics: words.topics || {},
    roomNames: words.roomNames || {},
    topicWords: [],
    scenery: words.scenery || {},
    parts: words.parts || {},                     // things an object's lines mention: { objectId: [{ words, name, says? }] }
    verbWord: Object.fromEntries(Object.entries(w.verbs).map(([id, list]) => [id, list[0]]))   // "take" → "take"
  };
  v.topicWords = Object.values(words.topics || {}).flatMap(t => Object.values(t).flatMap(x => x.words || []));
  v.known = new Set([...v.verbs, ...v.meta, ...v.dirs, ...v.fillerStart, ...v.fillerEnd].flatMap(p => p.parts).concat(v.topicWords, Object.values(v.roomNames).flat())
    .concat(w.articles, w.preps, w.and, w.then, w.it, w.yes, w.no,
            Object.values(v.names).flatMap(n => [...(n.nouns || []), ...(n.adj || [])]),
            Object.values(v.scenery).flat().flatMap(s => s.words), Object.values(v.parts).flat().flatMap(s => s.words)));
  v.verbWords = new Set(v.verbs.filter(p => p.parts.length === 1).map(p => p.parts[0]));   // for typo suggestions
  v.thingWords = new Set(Object.values(v.names).flatMap(n => [...(n.nouns || []), ...(n.adj || [])])
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
  for (const e of a.forms) {
    if (token.length <= e.length + 1 || !token.endsWith(e)) continue;
    const v = verbOf(token.slice(0, -e.length));
    if (v) return { verb: v.id, pronoun: e };
  }
  return null;
}

// ---- Layer 2: one command ---------------------------------------------------------------------------------

// Verbs that, on a thing that is a way out (`leads`), mean going that way.
const LEADS_VERBS = new Set(["go", "climb", "enter", "exit", "use", "take"]);

// What a verb typed alone means when the room has that way (an `in` / `out` exit, or one marked `in: true` / `out: true`):
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

function readCommand(tokens, state, W, words, recent) {
  tokens = withoutFiller(tokens.filter(t => t !== ","), W);
  if (!tokens) return { error: { say: "@unsure" } };
  tokens = splitContraction(tokens, W);
  let verb = null, rest = tokens, pronoun = null, verbText = null, indirect = null;

  // The verb first, with its articles still in place ("dar un golpe", "dar la vuelta" are phrases).
  const v = matchPhrase(tokens, 0, W.verbs);
  if (v) { verb = v.id; verbText = tokens.slice(0, v.len).join(" "); rest = tokens.slice(v.len); }
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
  if (WAY_OF[verb] && !rest.length && !pronoun && wayFor(state.world.rooms[state.player.at]?.exits, WAY_OF[verb]) &&
      !(verb === "exit" && state.player.in)) return { actions: [{ verb: "go", dir: WAY_OF[verb] }] };
  const bare = rest.filter(t => !W.preps.has(t));
  const d = matchPhrase(bare, 0, W.dirs);
  if ((verb === null || verb === "go") && d && d.len === bare.length) return { actions: [{ verb: "go", dir: d.id }] };
  // A direction and where it leads ("go upstairs to the archive", "go up the ladder"): the room's name decides the
  // way; else a thing here that leads that way.
  if ((verb === null || verb === "go") && d && d.len < bare.length) {
    const tail = bare.slice(d.len);
    const room = neighbourNamed(tail, state, W);
    if (room) return { actions: [{ verb: "go", dir: room }] };
    const thing = resolve(tail, state, W, false);
    if (thing.leads === d.id) return { actions: [{ verb: "go", dir: d.id }] };
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

  // The object(s): noun phrases joined by "and"; a preposition can introduce a second object ("with key").
  const objs = [], phrases = splitPhrases(rest, W, !!pronoun);
  // Asking with no one named ("ask about the umbrella", "pregunta por la llave"): it goes to whoever you're talking
  // to, or the only one here with something to say.
  if (verb === "ask" && !pronoun && phrases.length) {
    // ("ask ABOUT the postmaster": a preposition first means nobody is named, even when the topic is a person.)
    const lead = W.preps.has(rest[0]) ? {} : resolve(phrases[0].words, state, W, false, true);   // (someone named, here or not)
    if (!(lead.id && W.topics[lead.id])) {
      const who = partner(state, W);
      if (who) return { actions: [{ verb, obj: who, prep: null, topic: topicOf(phrases.flatMap(p => p.words), W.topics[who], W) || "?" }] };
    }
  }
  // An attached pronoun that only repeats the person named after it ("pregúntale al portero": le = al portero)
  // is dropped; alone ("pregúntale por el faro") it stands for them.
  const dbl = W.attached?.doubling;
  const doubled = pronoun && dbl?.forms.includes(pronoun) && phrases.length && (!phrases[0].prep || dbl.preps.includes(phrases[0].prep));
  if (doubled) phrases[0] = { ...phrases[0], prep: null };
  else if (pronoun) phrases.unshift({ words: [pronoun], prep: null });
  if (indirect && !phrases.slice(1).some(ph => ph.prep)) phrases.push({ words: [indirect], prep: dbl?.preps?.[0] ?? null });   // "dáselo": to whom
  let prep = null, obj2 = null, topic, absent = [], scenery = null;
  const absentOK = !!(ACTIONS[verb]?.absent || state.vocab?.[verb]?.absent);   // "order coffee", "think about the sea"
  for (const ph of phrases) {
    // Asking someone about something: their topics first, by their words ("ask the waiter about the lighthouse");
    // something nobody has a topic for is still a question, answered by their default.
    if (verb === "ask" && ph.prep && objs.length === 1 && W.topics?.[objs[0]]) {
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
    const r = ph.words.length === 1 && W.it.has(ph.words[0]) ? resolvePronoun(ph.words[0], recent, state, W)
                                                            : resolve(ph.words, state, W, !verb && ph === phrases[0],
                                                                      absentOK && (verb !== "ask" || !!ph.prep), verb);   // whoever you ask must be here
    // No verb, and the words after the first name something here ("ring bell" with no "ring"): the first word is
    // a verb the game doesn't know, not part of a name.
    if (["@notHere", "@onlyMentioned"].includes(r.error?.say) && !verb && ph === phrases[0] && ph.words.length > 1) {
      const after = resolve(ph.words.slice(1), state, W, false);
      if (after.id || after.scenery) return { error: suggestion(ph.words[0], W, W.verbWords) };
    }
    if (r.error && verb === "ask" && ph.prep && objs.length === 1 && W.topics?.[objs[0]]) { topic = "?"; prep = ph.prep; continue; }
    // A thing that is a way out (`leads`): going, climbing, entering, using or taking it goes that way ("climb the
    // stairs", "use the ladder", "take the stairs").
    if (r.leads && phrases.length === 1 && LEADS_VERBS.has(verb) && !(verb === "take" && state.world.objects[r.id]?.portable))
      return { actions: [{ verb: "go", dir: r.leads }] };
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
  const extra = (obj) => ({ ...(topic ? { prep, topic } : {}), ...(absent.length ? { absent } : {}) });
  return { actions: objs.map(obj => (obj2 ? { verb, obj, prep, obj2, ...extra(obj) } : { verb, obj, ...extra(obj) })) };
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
  const someone = (id) => { const o = state.world.objects[id]; return o && (o.talk != null || !!o.topics); };
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
function splitPhrases(tokens, W, hasFirst = false) {
  const out = [];
  let cur = { words: [], prep: null };
  for (const t of tokens) {
    if (W.and.has(t)) { if (cur.words.length) out.push(cur); cur = { words: [], prep: null }; continue; }
    if (W.preps.has(t)) {
      const first = !cur.words.length && !out.length;
      if (first && hasFirst && W.secondObject.has(t)) { cur.prep = t; continue; }
      if (first) continue;                                                // "look at door"
      if (cur.words.length && W.secondObject.has(t)) { out.push(cur); cur = { words: [], prep: t }; continue; }
      continue;                                                           // "caja de pastillas": part of the name
    }
    cur.words.push(t);
  }
  if (cur.words.length) out.push(cur);
  return out;
}

// Which object do these words name? Only things in scope (here, carried, or inside those). first: these are the
// first words typed (no verb was found), so an unknown first word is more likely a mistyped verb.
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
function topicOf(phrase, topics, W) {
  const words = phrase.filter(w => !W.preps.has(w) && !W.articles.has(w));
  const found = Object.entries(topics).find(([k, t]) => k !== "default" && words.some(w => (t.words || []).includes(w)));
  return found ? found[0] : null;
}

// absentOK: the verb may name something that exists but isn't here (marked absent): "order coffee". verb: what's
// being done, to choose between two that fit (taking means one you don't already hold).
function resolve(phrase, state, W, first, absentOK = false, verb = null) {
  const words = phrase.filter(w => !W.preps.has(w));
  const unknown = words.find(w => !W.known.has(w));
  if (unknown && W.seen.has(unknown) && !(first && unknown === words[0])) return { error: { say: "@onlyMentioned", arg: words.join(" ") } };
  if (unknown) return { error: suggestion(unknown, W, first && unknown === words[0] ? W.verbWords : wordsHere(state, W)) };
  const fits = (id) => {
    const n = W.names[id]; if (!n) return false;
    const nouns = new Set(n.nouns || []), adj = new Set(n.adj || []);
    return words.some(w => nouns.has(w)) && words.every(w => nouns.has(w) || adj.has(w));
  };
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
    const exact = here.filter(id => (W.names[id].nouns || []).includes(words.at(-1)));
    if (exact.length === 1) return { id: exact[0] };
    const free = verb === "take" ? here.filter(id => !state.player.carrying.includes(id)) : [];
    if (free.length === 1) return { id: free[0], ...leadsOf(state.world.objects[free[0]]) };
    return { error: { say: "@which", arg: here, phrase: words.join(" ") } };
  }
  if (W.seen.has(words.at(-1))) return { error: { say: "@onlyMentioned", arg: words.join(" ") } };   // just read about
  return { error: { say: "@notHere", arg: phrase.join(" ") } };
}

// What's mentioned here but not there to use: the room's scenery, and the parts of things in reach (the key in
// door 11's lock, the ticket in the coat's pocket).
// A thing that is a way out (stairs, a ladder, a path: `leads: "u"`), as { leads } for resolve(); else nothing.
function leadsOf(thing) {
  return thing?.leads ? { leads: thing.leads } : {};
}

function sceneryHere(state, W) {
  const parts = Object.entries(W.parts).filter(([id]) => state.world.objects[id] && inScope(state, id)).flatMap(([, p]) => p);
  return [...(W.scenery[state.player.at] || []), ...parts];
}

// Is the object here, carried, or inside something that is? Not if it's inside a closed container (the locked
// hut's oars can't be talked about until it's open). Things in something that isn't a container (mints in
// a tin) are always in reach.
export function inScope(state, id) {
  const place = placeOf(state, id);
  return !shut(state, id) && (place === state.player.at || place === "player");
}

// Remember what an action mentioned, newest first (its object, then the second one: "put the oars in the boat").
function mention(recent, a) {
  for (const id of [a.obj2, a.obj]) if (id) { const i = recent.indexOf(id); if (i >= 0) recent.splice(i, 1); recent.unshift(id); }
}

// What a pronoun means (the pack's `pronouns` say what each prefers).
// - By default the most recent thing in reach that fits its gender (`g`) and number (`pl`) ("la" → la caja, "los" → los
//   remos, "them" → something plural); if none fits, the most recent thing in reach; if none, ask.
// - A pronoun that prefers a person (`person`: "him", "her", *le*, *él*) means a person and never a thing: the last person
//   mentioned, or talked to (`talkingTo`), if in reach; else the only person in reach; with several and none mentioned,
//   ask who. A person is a character: an object with `topics`.
function resolvePronoun(word, recent, state, W) {
  const want = W.pronouns[word] || {};
  const fits = (id) => {
    const o = state.world.objects[id], w = o?.words || W.names[id] || {};
    return (!want.g || !w.g || w.g === want.g) && (want.pl === undefined || !!w.pl === want.pl);
  };
  if (want.person) {
    const picked = W.picks.find(p => p.phrase === word && inScope(state, p.id));          // "Who do you mean?" was answered
    if (picked) return { id: picked.id };
    const people = (ids) => ids.filter(id => state.world.objects[id]?.topics && inScope(state, id) && fits(id));
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

// Nothing makes sense of the word: the known words of the right kind one letter away (a clear typo), for parse()
// to try in its place.
// Known words one slip away (a letter missing, extra, changed or swapped). In a long word that's a clear typo; in a
// short one only two swapped letters or a doubled letter are. A changed letter is doubtful, even a neighbouring key
// ("miss" isn't clearly "kiss", though m touches k). Clear ones first. [{ word, clear }]
function suggestion(word, W, pool) {
  const options = word.length < 4 ? [] : [...pool].filter(k => k.length >= 3 && distance(word, k) === 1)
    .map(k => ({ word: k, clear: word.length >= 5 || clearSlip(word, k) }))
    .sort((a, b) => b.clear - a.clear);
  return { say: "@unsure", word, didYouMean: null, options };
}

// Is a one-slip difference between a short word and a known one clearly a typo?
function clearSlip(word, known) {
  if (word.length === known.length) {
    const diff = [...word].map((c, i) => i).filter(i => word[i] !== known[i]);
    return diff.length === 2;                                             // two letters swapped, not one changed
  }
  const [long, short] = word.length > known.length ? [word, known] : [known, word];
  const i = [...short].findIndex((c, j) => c !== long[j]), at = i < 0 ? short.length : i;
  return long[at] === long[at - 1] || long[at] === long[at + 1];          // a letter doubled, or a double one single
}

// The words for things here: what's in reach, and this room's scenery (not the cave's roof when you're upstairs).
function wordsHere(state, W) {
  const ids = Object.keys(W.names).filter(id => state.world.objects[id] && inScope(state, id));
  return new Set(ids.flatMap(id => [...(W.names[id].nouns || []), ...(W.names[id].adj || [])])
    .concat(sceneryHere(state, W).flatMap(s => s.words)));
}

// Does a rule answer this verb typed on its own, here and now?
function answersAlone(verb, state) {
  return state.rules.some(r => {
    const m = r.match || {};
    if ((r.when || "action") !== "action" || !m.verb || ![].concat(m.verb).includes(verb)) return false;
    if (m.obj !== undefined && !(Array.isArray(m.obj) && m.obj.includes(null))) return false;
    return holds(state, r.if, { verb });
  });
}
