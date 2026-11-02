// Names in commands: how a command names a thing (ARCHITECTURE.md §6, "Naming a thing in a command"). Whenever the engine
// writes a command for the player, a USE line, a hint, a click line, it names the thing the way its `name` writes it: the noun as
// it appears there, with its accents ("Coger buzón", not "Coger buzon"), in lower case unless it is a proper name ("Hablar con
// Ambrose"). One helper, so every command the engine words names things alike. Pure: it reads a thing's fields and its name's
// text, nothing else, and has no imports (the opening builds its hints from it, before any pack is chosen).

// A word as it is compared: lower case, no accents (ñ is n), no apostrophe. Both sides go through this, so what the world writes
// as a noun ("buzon") meets what its name writes ("Buzón").
const fold = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "");

// The words of a name as it is written, with the punctuation round them off ("Photo of Madrid," → Photo, of, Madrid).
const wordsOf = (name) => String(name).split(/\s+/).map(w => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);

// A word that starts the name only because a name starts with a capital ("Buzón", "Tin"): lower case. Not a proper name, an
// initial ("TV", "X-ray") or a word with a capital inside.
const lowered = (word) => (/^\p{Lu}[^\p{Lu}]*$/u.test(word) ? word.charAt(0).toLowerCase() + word.slice(1) : word);

// How a word of a thing (a noun, an adjective, possibly several words: "lift shaft") is written in its name, else as the world
// wrote it. The first word of a name is written in lower case, unless the name is a proper one.
function spell(word, nameWords, proper) {
  const parts = fold(word).split(/\s+/).filter(Boolean);
  if (!parts.length) return String(word);
  for (let i = 0; i + parts.length <= nameWords.length; i++) {
    if (!parts.every((p, k) => fold(nameWords[i + k]) === p)) continue;
    const written = nameWords.slice(i, i + parts.length);
    if (i === 0 && !proper) written[0] = lowered(written[0]);
    return written.join(" ");
  }
  return String(word);
}

// The whole name as it is written, for a command: its words in order, the first in lower case ("old coin", "the fitter", "la modista")
// unless it is a proper name or has a number in it ("Door 11"), whose capital stays; a language that writes a numbered name in lower
// case in a sentence (Spanish: "puerta 11", "caseta 7", like "la caseta 7") says so with `lowerNumbers`. A name's own leading
// article is part of it.
const numbered = (nameWords) => nameWords.some(w => /\d/.test(w));
const written = (nameWords, proper, lowerNumbers) => {
  const words = [...nameWords];
  if (!proper && (lowerNumbers || !numbered(words))) words[0] = lowered(words[0]);
  return words.join(" ");
};

// Do the thing's own words cover every word of its name? A name word that is none of its nouns or adjectives ("Odd thing", when only
// "thing" is a noun) is a word the parser would not take for this thing, so the whole name is not written. Little words that a name
// joins its words with ("de", "del", "of", "the") need no entry of their own.
const LITTLE = new Set("a an the of to for in on at with and or el la los las un una de del al y en con para por".split(" "));
const covers = (o, nameWords) => {
  const has = new Set([...(o.words.nouns || []), ...(o.words.adj || [])].flatMap(x => fold(x).split(/\s+/)));
  return nameWords.every(x => has.has(fold(x)) || LITTLE.has(fold(x)));
};

// The ways a thing can be named in a command, best first (a thing is the object `o`, its name's text `name`):
// - a name that starts with a title, whole, as the pack spells it (`titled`: Spanish "señor Cotter", the title in lower case, no article),
//   and a proper name as it is written, whole ("Mrs Hale"), when it reads;
// - a name of more than one word, whole, as it is written ("old coin", "desk drawer", "puerta giratoria", "the fitter"), when its words
//   cover all of it (and the caller's own test, when it has one, accepts it);
// - each of its nouns, spelled as its name writes it ("buzón", "Ambrose", "tablón de anuncios"): the way for a name of one word, and the
//   way back for a name that would not read as that same thing;
// - an adjective and its first noun ("brass key"), for when the noun alone means two things.
// `second`: the thing is the second of two in a command ("Unlock hut door with key", "Dar memorando del Ministerio a administrador"):
// the first thing carries the weight, so the second is named short, by its first noun, and its whole name comes next, for when the
// short one does not read as that thing (two keys). `lowerNumbers`: the language writes a numbered name in lower case ("caseta 7").
// [] for a thing with no nouns. The caller takes the first that reads (called), or tries them in its command.
export function spellings(o, name, titled, { second = false, lowerNumbers = false } = {}) {
  const w = o?.words, nouns = (w?.nouns || []).filter(n => typeof n === "string" && n.trim());
  if (!nouns.length) return [];
  const proper = !!w.proper, nameWords = typeof name === "string" ? wordsOf(name) : [];
  const out = [];
  const title = nameWords.length > 1 ? titled?.(name) : null;
  if (title) out.push(title);
  if (proper && nameWords.length > 1) out.push(written(nameWords, true, lowerNumbers));
  const whole = nameWords.length > 1 && covers(o, nameWords) ? written(nameWords, proper, lowerNumbers) : null;
  const spelled = nouns.map(n => spell(n, nameWords, proper));
  if (second && whole) out.push(spelled[0], whole, ...spelled.slice(1));
  else out.push(...(whole ? [whole] : []), ...spelled);
  // (in the order the name writes them: "brass key", and "llave latón" where the name says "llave de latón")
  for (const a of w.adj || []) if (typeof a === "string" && a.trim()) {
    const pair = [spell(a, nameWords, proper), spell(nouns[0], nameWords, proper)], at = (x) => nameWords.findIndex(y => fold(y) === fold(x));
    out.push((at(pair[1]) >= 0 && at(pair[1]) < at(pair[0]) ? pair.reverse() : pair).join(" "));
  }
  return [...new Set(out)];
}

// The name of a thing as a command writes it: the first of its spellings that `reads` accepts (all of them, if no test is
// given), or null when none does, so a command that would not be understood is not written.
export function called(o, name, reads = () => true, titled, how) {
  return spellings(o, name, titled, how).find(reads) ?? null;
}
