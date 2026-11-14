// English pack: interface labels and standard replies. A world's own texts are in its folder (worlds/<id>/). Markup: `Command` → <COMMAND>; {label|id} → clickable object.

// Play time in words, for the end note: "less than a minute", "23 minutes", "1 hour and 5 minutes".
const playedFor = (ms) => {
  const m = Math.floor(ms / 60000), h = Math.floor(m / 60), r = m % 60;
  const unit = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  return !m ? "less than a minute" : !h ? unit(m, "minute", "minutes") : unit(h, "hour", "hours") + (r ? " and " + unit(r, "minute", "minutes") : "");
};

// "the" and a thing's name in a sentence (o: the thing, or { words }: its gender, number and mark): for [way] (the pack's `the`),
// the echoes of what you gain and lose, and every standard line that names a thing. A proper name (`words.proper`: "Monday",
// "Mr Ambrose") has no article: "You get Monday". `The`: the same at the start of a sentence.
// A name that already starts with its own article ("The fitter", "A coin") is never given another: "the fitter", not "the the fitter".
// Its article is then lower case in a sentence and capital at the start of one; a proper name keeps what it is written with
// ("The Bell"), unless what follows the article is lower case ("The fitter" marked proper), which is no name's capital.
const OWN = /^(the|a|an)\s+(?=\S)/i;
const own = (name, w) => OWN.test(String(name)) && !(w?.proper && /^\p{Lu}/u.test(String(name).replace(OWN, "")));
const withCase = (name, up) => { const n = String(name); return (up ? n.charAt(0).toUpperCase() : n.charAt(0).toLowerCase()) + n.slice(1); };
// A name that ends in a number ("Hut 7", "Door 11") reads as a name, not as a thing: no article, and its capital kept in a sentence
// ("You open Hut 7.", "Hut 7 is already closed."). Spanish keeps its article ("la caseta 7"; content/es.js).
const numbered = (name) => /\d$/.test(String(name).trim());
const the = (name, o) => (own(name, o?.words) ? withCase(name, false) : o?.words?.proper ? name : numbered(name) ? withCase(name, true) : "the " + name);
const The = (name, w) => (own(name, w) ? withCase(name, true) : w?.proper ? name : numbered(name) ? withCase(name, true) : "The " + name);
const theW = (name, w) => the(name, { words: w });                  // by its gender, number and mark (`w`, as the narrator hands them)
// "a" / "an" and a thing's name ("a coin", "an apple"; "some tins" for a plural; a proper name bare; a name with its own article keeps it).
// A name the narrator marked as a clickable thing ("{crank|crank}") keeps its mark round the name alone: "a {crank}".
const MARK = /^\{([^|}]*)\|([^}]*)\}$/;
const a = (name, w) => {
  const m = MARK.exec(String(name)), label = m ? m[1] : String(name), wrap = (x) => (m ? `{${x}|${m[2]}}` : x);
  if (own(label, w)) return wrap(withCase(label, false));
  if (w?.proper) return wrap(label);
  if (numbered(label)) return wrap(withCase(label, true));
  return (w?.pl ? "some " : /^[aeiou]/i.test(label) ? "an " : "a ") + wrap(label);
};
const listOf = (items, last) => (items.length > 1 ? items.slice(0, -1).join(", ") + last + items.at(-1) : items[0] ?? "");

export default {
  hint: "Type `Help` for ideas",   // beside the prompt at the start (no full stop: it isn't a sentence in the story)
  or: " or ",
  and: " and ",
  // The end of the story (any ending): nothing is asked. First a short grey note, once (d = { ms: play time, rooms: rooms
  // seen }), then this line, which any other command gets again: the three ways on. `Undo` takes the last move back; `Begin again`
  // (also: restart, new game…) starts a new game of the same world, from its opening, and says againYes; `Quit` goes to the list of games.
  endNote: (d) => `You played for ${playedFor(d.ms)}. You saw ${d.rooms} ${d.rooms === 1 ? "room" : "rooms"}.`,
  gameOver: "The story is over. `Undo` your last move, `Begin again` or `Quit`.",
  againYes: "Everything goes dark. Then, slowly, it begins again…",
  hintDo: (cmds) => "Try " + cmds.join(", then ") + ".",
  askAbout: (l) => `Ask about ${l}`,   // a topic offered after someone answers you ("Ask about umbrella")
  talkedOut: (d, w) => `You have nothing else to talk about with ${theW(d.name, w)}${d.forNow ? " (for now)" : ""}.`,   // after they answer, when nothing is left
  noWay: ["You can't go that way.", "There's no way through there.", "That way leads nowhere."],
  hereAlready: "It's right here.",                                  // "go to the lamp" with the lamp here and not a way out
  // When nothing makes sense of what you typed: in the world's voice, never about words (several, varied).
  unsure: ["You're not sure how to do that.", "Nothing comes of it.", "That doesn't get you anywhere.",
           "Nothing here seems to respond to that."],

  // Parser replies (js/parser.js): the problem, named
  didYouMean: (w) => `Did you mean \`${w}\`?`,                    // only for a clear typo
  // Things the room's text mentions but that aren't there to use (the room's `scenery`, in its room texts): w = "the walls".
  sceneryLook: [(w) => `You see nothing special about ${w}.`, (w) => `Nothing out of the ordinary about ${w}.`,
            (w) => `Just ${w}. Nothing to see.`],
  sceneryOther: [(w) => `There's not much you can do with ${w}.`, (w) => `Better leave ${w} alone.`],
  noVerb: "What do you want to do? Start with a verb, like `Examine` or `Take`.",
  whatTo: (v) => `What do you want to ${v}?`,
  notHere: (w) => `You see no ${w} here.`,
  noWait: ["There's nothing here worth waiting for.", "Nothing here is coming.", "You could wait. Nothing here would come of it."],
  // SLEEP (js/engine.js, `sleep`; ARCHITECTURE.md §5 "Sleep"): the question and its answers (each clickable, as the parser reads
  // them: words.sleep), the dim line under it, and the lines of a sleep: eyes closed, a dream (the first line of a hint), the
  // waking (d: { time "07:00", day, newDay: the day changed, hour }), the end of you (a sleep in a condition that hurts: then
  // one of the death lines, `hurt.dead`) and where you can't (the opening, a question waiting, a conversation, a hold).
  sleep: {
    ask: "How long do you sleep?",
    choices: { nap: "A short nap", few: "A few hours", morning: "Until morning" },
    or: "Or say until when: \"sleep until 18:00\".",
    close: "You close your eyes.",
    dream: (s) => `In a dream, someone says: "${s}"`,
    wake: (d) => `You wake. It is ${d.time}${d.newDay ? ", day " + d.day : ""}.`,
    never: "You fall asleep, and do not wake.",
    notNow: "This is no time to sleep."
  },
  // The world's time in words, for [time] in a text: { hour, minute } → "a quarter past five".
  timeWords({ hour, minute }) {
    const n = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
               "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one",
               "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine"];
    const h = (x) => n[x % 12 || 12];
    if (minute === 0) return hour === 0 ? "midnight" : hour === 12 ? "noon" : h(hour) + " o'clock";
    if (minute === 15) return "a quarter past " + h(hour);
    if (minute === 30) return "half past " + h(hour);
    if (minute === 45) return "a quarter to " + h(hour + 1);
    const m = minute < 30 ? minute : 60 - minute, words = n[m] + (m % 5 ? (m === 1 ? " minute" : " minutes") : "");
    return words + (minute < 30 ? " past " + h(hour) : " to " + h(hour + 1));
  },
  // TIME: d = { weekday (or null), time "16:42", day }. Days 1–3 in words, then digits.
  timeNow(d) {
    const day = d.day <= 3 ? `the ${["first", "second", "third"][d.day - 1]} day` : `day ${d.day}`;
    return d.weekday ? `Today is ${d.weekday}, ${d.time}, ${day} of your adventure.` : `It's ${d.time}, on ${day} of your adventure.`;
  },
  // One phrase per health step (index 1 to 5), shared by STATUS and the echoes (INTERFACE.md §6c). None names a cause. [0] is the echo of a death (STATUS never shows it).
  health: ["You're dead", "You can barely stand", "You feel awful", "You feel unwell", "You feel a little off", "You're in good health"],
  // STATUS: d = { health: the step, 5 to 1 }.
  statusNow(d) { return this.health[d.health] + "."; },
  // STATUS, under the health line: one line for each condition you are in (js/conditions.js), its world's own `status` phrase, s.
  statusCondition: (s) => s + ".",
  // Words said while a condition slurs them (js/speech.js): how they came out, t.
  slurred: (t) => `It comes out as "${t}".`,
  weekdays: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
  onlyMentioned: (w) => `There's nothing more to the ${w} than that.`,   // named in the text, nothing to answer
  noIt: "I'm not sure what \"it\" means here.",
  which: (list) => `Which do you mean: ${list}?`,
  whoMean: (list) => `Who do you mean: ${list}?`,
  noPerson: "I'm not sure who you mean.",
  useUp: "Use ↑ to bring back your last command.",
  nothingToFix: "There's nothing to fix: the last command had no unknown word.",
  undone: "You take back your last move.",
  cantUndo: "There's nothing to take back.",
  askUndo: "Take back your last move?",
  // One saved game per game: SAVE keeps it, LOAD goes back to it (both ask first when something would be lost).
  saved: "Game saved. `Load` brings you back here.",
  loaded: "Back where you saved.",
  noSave: "There's no saved game yet. `Save` keeps one.",
  askSave: "Save over your saved game? There's only one for each game.",
  // d: { place, day, time, saved: Date, now: Date } (js/main.js).
  askLoad(d) { return `Your saved game:\n\n${d.place}, Day ${d.day} at ${d.time}. Saved ${this.savedWhen(d.saved, d.now)}.\n\nGo back to it? What you've done since will be lost.`; },
  // When a game was saved, in real time: "today at 13:40", "yesterday at 21:05", "on 22 October at 18:00".
  savedWhen(t, now) {
    const hm = String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0");
    const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(), diff = Math.round((day(now) - day(t)) / 864e5);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return diff === 0 ? "today at " + hm : diff === 1 ? "yesterday at " + hm : `on ${t.getDate()} ${months[t.getMonth()]} at ${hm}`;
  },
  askRestart: "Restart the game? You'll begin again from the start. A game you saved can still be loaded.",
  saveFailed: "The game couldn't be saved here (this browser is blocking storage).",
  // Every yes/no question ends with these (js/narrator.js); "no" to a question with nothing of its own to say.
  yesNo: "`Yes` / `No`",
  confirmNo: "All right.",
  // A question for words (`ask`: a name, a password): the grey line after it, and the reply when no rule takes the answer up.
  typeAnswer: "Type your answer.",
  answerUnheard: "You answer nothing.",
  // HELP: how the game works, and the commands that work anywhere. (Hints come from the thing that listens.)
  help: "Type what you want to do in a few words, like \"open the door\" or \"take the lamp\". Click any object+ to examine it, or any command in capitals to do it at once.\n\nCommon actions: `Look`, `Examine`, `Take`, `Drop`, `Open`, `Inventory`, `Time`, `Status`, `Talk to`, `Wait`.\n\nDirections: `N`, `S`, `E`, `W`, `Up`, `Down`, `In`, `Out`. `Map` shows where you've been, and a click on a room there walks you to it.\n\nGame: `Undo`, `Save`, `Load`, `Quit` (back to the list of games).",
  // HINT: never a hint itself, only where to listen (n = the opening's listening thing, named).
  hintCarried: (n) => `Something you carry might know more. Try \`Listen to ${n}\`.`,
  hintHere: (n) => `Something here might know more. Try \`Listen to ${n}\`.`,
  hintAway: "Somewhere you left something that listens. It might know more.",
  hintNone: "Nobody is listening. Not yet.",

  // Standard verbs (js/verbs.js), for objects without their own rule
  locked: "It's locked.", unlocked: "It opens.",
  noTopic: ["They don't seem to know anything about that.", "No answer worth having.", "A shrug."],
  // Being in or on things (js/verbs.js): n = [the thing's name, in a sentence], w = [its gender, number and mark].
  gotIn: (n, w) => `You get into ${theW(n[0], w[0])}.`, gotOn: (n, w) => `You get onto ${theW(n[0], w[0])}.`,
  gotOut: (n, w) => `You get out of ${theW(n[0], w[0])}.`, gotOff: (n, w) => `You get off ${theW(n[0], w[0])}.`,
  outFirst: (n, w) => `You get out of ${theW(n[0], w[0])} first.`, offFirst: (n, w) => `You get off ${theW(n[0], w[0])} first.`,
  // Taking what you are in or on: get out of it first.
  getOutToTake: (n, w) => `You'll have to get out of ${theW(n[0], w[0])} first.`, getOffToTake: (n, w) => `You'll have to get off ${theW(n[0], w[0])} first.`,
  alreadyIn: (n, w) => `You're already there, in ${theW(n[0], w[0])}.`,
  notIn: (n, w) => `You're not in ${theW(n[0], w[0])}.`,
  // Where you are, in a room's description: n = the thing's name, w = its gender, number and mark.
  youAreIn: (n, w) => `You are in ${theW(n, w)}.`, youAreOn: (n, w) => `You are on ${theW(n, w)}.`,
  // "leave" with nowhere to leave: the ways out, as commands.
  waysOut: function (dirs) {
    const ways = (dirs || []).map(d => "`" + this.dirs[d] + "`");
    if (!ways.length) return "There's no way out from here.";
    return "You can go " + (ways.length > 1 ? ways.slice(0, -1).join(", ") + this.or + ways.at(-1) : ways[0]) + ".";
  },
  // Echoes (INTERFACE.md §6c): one short line under the story text after a change to your health, for the step
  // you land on (health 5–0), in the colour of its kind, with the five health bars before it. js/narrator.js picks them.
  // hurt: a phrase of its own for a step when you get hurt (null: the `health` one). English has none.
  // gained, lost: a thing you now have, or no longer have (the engine's own echoes, whatever moved it), with no full stop:
  // n = its name as in a list ("roof key"), w = its gender, number and mark (a proper name: "You get Monday").
  echo: {
    healed: [null, "You feel a little better", "You feel better", "You feel much better", "You feel almost yourself again", "You feel well"],
    hurt: [null, null, null, null, null, null],
    gained: (n, w) => "You get " + theW(n, w),
    lost: (n, w) => "You no longer have " + theW(n, w)
  },
  // Losing the last of your health (js/engine.js, `hurt`): the cause's own words first (s) if it has some.
  hurt: {
    // The end: one of these, picked at random.
    dead: [
      (s) => (s ? s + " " : "") + "This is the end, you think, briefly, before fading away for good.",
      (s) => (s ? s + " " : "") + "The world goes quiet one sound at a time, until there is nothing left to hear.",
      (s) => (s ? s + " " : "") + "You lie down, though you don't remember deciding to. Everything grows very far away, and then it isn't there at all.",
      (s) => (s ? s + " " : "") + "Somewhere a door closes gently, the way doors close on rooms nobody will use again. It was yours.",
      (s) => (s ? s + " " : "") + "You had meant to do so many things. The thought stays a moment longer than you do."
    ]
  },
  cantTake: "It won't come away.", nothingSpecial: "You see nothing special.",
  notCarried: "You aren't carrying that.",
  // Taking something out of what you carry (nothing is gained, so it says so): n = [the thing, what it was in]. Taking what a
  // person has: n = [the person, the thing]. Talking to a person who has topics but no line for it: n = [the person].
  tookOut: (n, w) => `You take ${theW(n[0], w[0])} out of ${theW(n[1], w[1])}.`,
  wontGive: (n, w) => `${The(n[0], w[0])} won't give ${w[1]?.pl ? "them" : "it"} up.`,
  talkReady: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "wait" : "waits"} for your question.`,
  // USE and its words alone (js/view.js, useLine): d = { name: the thing, list: the commands it offers, as a sentence }; w = its words.
  useHow: (d, w) => `Use ${theW(d.name, w)} how? ${d.list}.`,
  // The two-thing commands USE alone offers, written the way a player types them (nouns, no articles).
  useWith: { unlock: (door, key) => `Unlock ${door} with ${key}`, put: (thing, into) => `Put ${thing} in ${into}`, give: (thing, who) => `Give ${thing} to ${who}` },
  // The commands the engine words itself for one thing (js/narrator.js, the opening's hints), the way a player types them: x = the thing's
  // name as a command writes it (js/names.js: its whole name when it has more than one word, with its own article, "the fitter"; else its
  // noun, as its name spells it). Each one is read back as the verb it
  // names (tests/words.test.js). "Sit on" and "Get off" are for what you sit on, "Enter" and "Get out of" for what you get into.
  basic: {
    take: (x) => `Take ${x}`, talk: (x) => `Talk to ${x}`, listen: (x) => `Listen to ${x}`, read: (x) => `Read ${x}`,
    open: (x) => `Open ${x}`, close: (x) => `Close ${x}`,
    enterIn: (x) => `Enter ${x}`, enterOn: (x) => `Sit on ${x}`, exitIn: (x) => `Get out of ${x}`, exitOn: (x) => `Get off ${x}`,
    climbUp: (x) => `Climb ${x}`, climbDown: (x) => `Climb down ${x}`, goThrough: (x) => `Go through ${x}`,
    order: (x) => `Order ${x}`, buy: (x) => `Buy ${x}`,
    examine: (x) => `Examine ${x}`
  },
  // Putting one thing in another (js/verbs.js): n = [the thing, where it goes], names in a sentence, w = their gender, number and mark.
  putIn: [(n, w) => `You put ${theW(n[0], w[0])} in ${theW(n[1], w[1])}.`, (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} into ${theW(n[1], w[1])}.`,
          (n, w) => `You place ${theW(n[0], w[0])} in ${theW(n[1], w[1])}.`],
  // Taking a thing from somewhere it isn't: n = [the thing, the place].
  notInside: [(n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "aren't" : "isn't"} in ${theW(n[1], w[1])}.`, (n, w) => `You look in ${theW(n[1], w[1])}, but ${theW(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} not there.`,
              (n, w) => w[0]?.proper ? `${n[0]} isn't in ${theW(n[1], w[1])} to take.` : `There is no ${n[0]} in ${theW(n[1], w[1])} to take.`],
  closed: [(n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} closed.`, (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} shut.`,
           (n, w) => `You would have to open ${theW(n[0], w[0])} first.`],
  // Opening and closing a container (js/verbs.js): n = [the thing], w = [its gender, number and mark].
  opened: (n, w) => `You open ${theW(n[0], w[0])}.`, closedIt: (n, w) => `You close ${theW(n[0], w[0])}.`,
  // Eating or drinking a consumable thing that has no line of its own for it (js/verbs.js, std_eat_it).
  ate: (n, w) => `You eat ${theW(n[0], w[0])}.`, drank: (n, w) => `You drink ${theW(n[0], w[0])}.`,
  // A thing that comes from someone or something (js/engine.js, `bring`), when it has no line of its own for it: n = [the thing].
  brought: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} put in front of you.`,
  stillHere: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} in front of you already.`,
  haveOne: (n, w) => `You already have ${theW(n[0], w[0])}.`,
  noMore: (n, w) => `There ${w[0]?.pl ? "are" : "is"} no more ${n[0]} to be had.`,
  // What a thing that comes from somewhere, or a way, wants you to hold (`requires`), when you don't and it has no `lacking` line: n = [that thing].
  lacking: (n, w) => `You would need ${theW(n[0], w[0])}.`,
  // What an opened container holds, each thing marked (js/engine.js, `inside`): n = their names, w = their gender, number and mark.
  inside: (n, w) => `Inside: ${listOf(n.map((x, i) => a(x, w[i])), " and ")}.`,
  // What can be taken and lies in a room with no `here` line in force, each thing marked (js/narrator.js, `lyingLine`), one line after
  // the room's paragraphs: "There is a {coin} here.", "There is a {coin} and some {oars} here." (the verb agrees with the first). A
  // proper name has a sentence of its own: "{Dot} is here.", and after the rest "{Dot} is here too.". n = their names, w = their marks.
  lying: (n, w) => {
    const all = n.map((x, i) => [x, w[i]]), common = all.filter(([, v]) => !v?.proper), proper = all.filter(([, v]) => v?.proper);
    return [common.length ? `There ${common[0][1]?.pl ? "are" : "is"} ${listOf(common.map(([x, v]) => a(x, v)), " and ")} here.` : "",
            proper.length ? `${listOf(proper.map(([x]) => x), " and ")} ${proper.length > 1 || proper[0][1]?.pl ? "are" : "is"} here${common.length ? " too" : ""}.` : ""]
      .filter(Boolean).join(" ");
  },
  // A thing that moves (js/movers.js), coming where you are or going from where you are, when it has no `arrives` / `leaves` line of
  // its own: by the way it came from or goes, as the exits say (`none`: no exit joins the two rooms, or it comes from nowhere or goes
  // out of play). n = [its name, in a sentence], w = [its gender, number and mark].
  moving: {
    arrives: {
      n: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} in from the north.`, s: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} in from the south.`,
      e: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} in from the east.`, w: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} in from the west.`,
      u: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} down from above.`, d: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} up from below.`,
      in: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} out from inside.`, out: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} in from outside.`,
      none: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} in.`
    },
    leaves: {
      n: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} off north.`, s: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} off south.`,
      e: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} off east.`, w: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} off west.`,
      u: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} up.`, d: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} down.`,
      in: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} in.`, out: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "go" : "goes"} out.`,
      none: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} gone.`
    },
    // Following you (a place "player"): coming in with you, in place of its `arrives`; and staying where it is as you go into a room
    // it doesn't follow you into (outside its `within`).
    follows: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "come" : "comes"} with you.`,
    stays: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "stay" : "stays"} behind.`
  },
  cantOpen: "That isn't something you can open.", cantClose: "That isn't something you can close.",   // no lid: open for good (`open: "always"`)
  alreadyOpen: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} already open.`,
  alreadyClosed: (n, w) => `${The(n[0], w[0])} ${w[0]?.pl ? "are" : "is"} already closed.`,
  invEmpty: "You are carrying nothing.", invList: (list) => "You are carrying: " + list + ".",

  // Things the opening's mechanics say (js/opening.js): the world writes the rest in its own voice.
  already: "You already have it, safe in your pocket.",
  cantDrop: "Better keep it. You may need it.",
  // A hint, said by the world's own line (the opening's `hintFrame`): the frame, then the hint in quotes.
  framed: (frame, hint) => `${frame} "${hint}"`,
  // "the" and a name, for [way] in a text: the way on from the opening ("the revolving door"); a proper name, bare.
  the,
  // A room with no name of its own: what the title bar, the map and LOAD's question call it (js/narrator.js placeName, js/map.js).
  place: "SOMEWHERE",
  // A language with no world yet: a single room, so the game still has somewhere to be.
  noWorld: { place: "NOWHERE", alt: "A blank picture.",
             text: "There is no world to play in this language yet. Go back to the list of games and choose another language." },

  // Interface
  options: "Options",
  sound: { title: "SOUND", music: "Music", tone: "Room", sounds: "Sounds", mute: "Mute all", unmute: "Unmute all" },   // the SOUND block of the options (ui/soundpanel.js); mute and unmute are what a tap on ♫ does (ui/tools.js)
  a11y: { story: "Story", command: "Type a command" },
  panel: { game: "GAME", restart: "Restart game", quit: "Quit" },
  // The landing page (ui/home.js). The game's name is not translated. The buttons show in capitals (home.css): CONTINUE on a world with a saved game, NEW GAME always.
  home: { subtitle: "Artificial Interactive Fiction", newGame: "New game", resume: "Continue", version: "Version",
          language: (l) => `Language: ${{ en: "English", es: "Spanish" }[l]}`,   // the switch's buttons, top right
          none: "There are no games in English yet." },
  labels: { directions: "DIRECTIONS", inv: "INVENTORY", day: "Day", map: "Map" },
  // The map (js/map.js, ui/map.js): shown in capitals by its stylesheet. `level(n)` names a level that isn't the ground.
  map: { title: "Map", close: "Close the map", hint: "Drag to move, pinch to zoom", ground: "Ground level",
         level: (n) => `Level ${n < 0 ? "−" : ""}${Math.abs(n)}`, rooms: "Rooms on this level", here: "you are here" },
  dirs: { n: "North", s: "South", e: "East", w: "West", u: "Up", d: "Down", in: "In", out: "Out" }, noExit: "no exit",
  // The compass buttons' names: their tooltip, what a screen reader says and what a click types (the map walks with dirs above).
  dirTips: { n: "North", s: "South", e: "East", w: "West", u: "Up", d: "Down", in: "In", out: "Out" },

  // Standard replies, by action (js/actions.js): what an action says when no rule gives it a meaning. Neutral, so
  // they suit any game; 2–3 phrasings, never the same one twice in a row.
  replies: {
    read: ["There's nothing written on it.", "You see nothing to read."],
    search: ["You find nothing of interest.", "Nothing turns up.", "A careful search reveals nothing."],
    listen: ["You hear nothing unusual.", "You listen. Nothing out of the ordinary.", "Only the usual sounds."],
    smell: ["You smell nothing unusual.", "No particular smell.", "Nothing your nose finds interesting."],
    taste: ["Better not put that in your mouth.", "You decide against tasting it.", "Not a good idea."],
    touch: ["It feels just as you'd expect.", "Nothing unusual to the touch.", "You feel nothing special."],
    put: ["That won't go there.", "There's no point putting it there.", "You can't put it there."],
    give: ["They don't seem interested.", "Nobody here wants that.", "There's no one to give it to."],
    show: ["Nobody reacts.", "No one seems interested.", "There's no one to show it to."],
    // To a person who has no line of their own for it (the thing, then the person, come with the line, but "they" does for one or many):
    givePerson: ["They don't want it.", "They don't seem interested.", "That isn't something they want."],
    showPerson: ["They look, and say nothing.", "They don't seem interested.", "They are not impressed."],
    throw: ["You think better of it.", "Throwing that won't help.", "You decide to keep hold of it."],
    wear: ["You can't wear that.", "That isn't something to wear."],
    remove: ["You're not wearing that.", "There's nothing to take off."],
    open: ["It doesn't open.", "That isn't something you can open.", "It won't open."],
    close: ["It doesn't close.", "That isn't something you can close.", "There's nothing to close."],
    lock: ["You can't lock that.", "It has no lock."],
    unlock: ["You can't unlock that.", "It isn't locked, or not with anything you have."],
    push: ["Nothing happens.", "It doesn't move.", "Pushing it achieves nothing."],
    pull: ["Nothing happens.", "It doesn't budge.", "Pulling it achieves nothing."],
    turn: ["It doesn't turn.", "Nothing happens.", "It won't turn."],
    move: ["It doesn't move.", "It stays where it is.", "You can't move it."],
    switch_on: ["You can't turn that on.", "Nothing to switch on there."],
    switch_off: ["You can't turn that off.", "Nothing to switch off there."],
    attack: ["Violence won't help here.", "You think better of it.", "That would solve nothing."],
    knock: ["You knock. Nothing happens.", "A dull knock. No answer.", "No one answers."],
    use: ["That doesn't seem to do anything.", "Nothing comes of it.", "You turn it over. Nothing comes to mind."],
    eat: ["That's not something you can eat.", "Not edible.", "You decide not to eat that."],
    drink: ["That's not something you can drink.", "There's nothing to drink there."],
    order: ["There's nothing like that to order here.", "Nobody here is taking orders."],
    buy: ["There's nothing like that for sale here.", "Nobody here is selling that."],
    enter: ["You can't go in there.", "There's no way in."],
    exit: ["There's no obvious way out from here.", "You can't leave that way."],
    climb: ["You can't climb that.", "There's nothing to climb.", "It isn't climbable."],
    jump: ["You jump on the spot. Nothing happens.", "You jump. You land.", "A small jump. Nothing changes."],
    sit: ["You'd rather stay on your feet.", "There's nowhere comfortable to sit.", "You decide not to sit."],
    lie: ["This isn't the place to lie down.", "You'd rather stay on your feet."],
    stand: ["You're already standing.", "You are on your feet."],
    sleep: ["You're not tired.", "This is no time to sleep.", "You close your eyes for a moment. Nothing changes."],
    wake: ["You're already awake.", "Nobody here is asleep."],
    wait: ["Time passes.", "You wait.", "A moment goes by."],
    talk: ["There's no one to talk to.", "Nobody answers.", "Silence."],
    ask: ["There's no one to ask.", "Nobody answers.", "No reply."],
    say: ["You speak. Nobody answers.", "Your words fade away.", "Nothing answers."],
    shout: ["You shout. Nothing answers.", "Your voice echoes and dies.", "A shout, then silence."],
    sing: ["You hum a few bars.", "You sing quietly to yourself.", "A few notes, then silence."],
    wave: ["You wave. Nobody waves back.", "No one sees you wave."],
    kiss: ["Better not.", "You keep your affection to yourself.", "Not the moment."],
    think: ["You think hard. Nothing comes.", "You gather your thoughts.", "Thinking helps a little. Not much."],
    pray: ["You pray. Nothing happens, as far as you can tell.", "A quiet prayer. No answer."]
  },

  // The parser's words for English (PARSER.md layers 1–2). Verbs: the engine's verb → the words for it
  // (two-word verbs like "pick up" are fine). Meta commands run outside the game (undo, save…).
  words: {
    verbs: {
      look: ["look", "l", "look around"],
      examine: ["examine", "x", "ex", "look at", "inspect", "check", "study", "describe", "observe", "watch", "view", "peer at"],
      read: ["read", "skim"],
      search: ["search", "look in", "look inside", "look under", "look behind", "look through", "rummage", "rummage in", "explore"],
      listen: ["listen", "listen to", "hear"],
      smell: ["smell", "sniff", "smell at"],
      taste: ["taste", "lick"],
      touch: ["touch", "feel", "stroke", "pat", "rub", "poke", "caress", "tickle"],
      take: ["take", "get", "grab", "pick up", "pick", "collect", "pocket", "snatch", "carry", "steal", "acquire"],
      drop: ["drop", "put down", "discard", "dump", "let go of", "release"],
      put: ["put", "place", "insert", "set", "stick", "lay"],
      give: ["give", "hand", "offer", "pass", "feed"],
      show: ["show", "present", "display"],
      throw: ["throw", "toss", "hurl", "fling", "chuck", "lob"],
      wear: ["wear", "put on", "don", "dress in"],
      remove: ["take off", "remove", "doff", "undress"],
      inventory: ["inventory", "inv", "i"],
      time: ["time", "date", "what time is it"],
      status: ["status", "me", "myself", "diagnose", "diagnosis", "how am i"],
      open: ["open", "unwrap", "uncover", "pry open", "prise open"],
      close: ["close", "shut", "cover", "slam"],
      lock: ["lock"],
      unlock: ["unlock"],
      push: ["push", "press", "shove", "nudge", "prod", "ring"],   // "ring bell": pressing a bell
      pull: ["pull", "tug", "yank", "drag", "draw", "pull on"],
      turn: ["turn", "rotate", "twist", "spin", "wind", "screw", "unscrew"],
      move: ["move", "shift", "slide", "lift", "raise", "lower", "roll"],
      switch_on: ["turn on", "switch on", "light", "ignite", "activate", "start"],
      switch_off: ["turn off", "switch off", "extinguish", "put out", "blow out", "deactivate", "stop"],
      attack: ["hit", "attack", "strike", "smash", "kick", "punch", "break", "bash", "whack", "fight", "destroy", "slap",
               "thump", "shatter", "wreck", "kill", "stab"],
      knock: ["knock", "knock on", "rap", "rap on", "bang", "bang on"],
      use: ["use", "utilise", "utilize", "apply", "operate", "employ"],
      eat: ["eat", "swallow", "consume", "devour", "chew", "munch", "gobble"],
      drink: ["drink", "sip", "gulp", "quaff", "swig"],
      order: ["order"],
      buy: ["buy", "purchase", "pay for"],
      go: ["go", "walk", "run", "head", "travel", "proceed", "move to", "crawl", "visit", "go back", "come back", "head back",
           "walk back", "get back", "return"],   // "go back down the stairs": down the stairs
      enter: ["enter", "go in", "go into", "get in", "get into", "step in", "step into", "go inside", "board", "get on",
              "get onto", "get aboard", "go aboard", "climb aboard", "climb in", "climb into", "hop on", "hop in",
              "hop into", "step on", "step onto", "step aboard", "embark"],
      exit: ["exit", "go out", "get out", "step out", "leave", "get off", "climb out", "get out of"],
      climb: ["climb", "scale", "climb up", "climb on", "climb over", "ascend", "clamber", "ride", "mount", "slide down", "shin up", "shin down", "shimmy up", "shimmy down"],
      jump: ["jump", "leap", "hop", "skip", "jump over", "jump on"],
      sit: ["sit", "sit down", "sit on", "sit in"],
      lie: ["lie", "lie down", "lie on", "recline"],
      stand: ["stand", "stand up", "get up", "rise"],
      sleep: ["sleep", "nap", "doze", "rest", "snooze"],
      wake: ["wake", "wake up", "awaken", "rouse"],
      wait: ["wait", "z", "pause", "linger", "stay"],
      talk: ["talk", "talk to", "speak", "speak to", "chat", "chat with", "greet", "hello", "hi", "converse"],
      ask: ["ask", "question", "inquire", "enquire", "query"],
      say: ["say", "tell", "reply", "answer", "whisper", "mutter"],
      shout: ["shout", "yell", "scream", "cry", "call", "call out", "holler"],
      sing: ["sing", "hum", "whistle", "chant"],
      wave: ["wave", "wave at", "wave to", "beckon", "gesture"],
      kiss: ["kiss", "hug", "embrace", "cuddle"],
      think: ["think", "ponder", "remember", "reflect", "meditate", "consider", "wonder"],
      pray: ["pray", "pray to", "worship", "bless"],
      help: ["help"],
      hint: ["hint", "hints", "clue", "clues"]
    },
    // Begin the story again: understood only after the end (js/parser.js), where the story's last line offers it.
    restart: ["begin again", "start again", "begin anew", "restart", "start over", "new game", "play again", "begin a new game", "start a new game"],
    meta: {
      earlier: ["again", "g", "repeat"],   // no command of their own: the reply points to the up arrow (useUp)
      undo: ["undo"],
      oops: ["oops"],
      save: ["save"],
      load: ["load", "restore"],
      clear: ["clear", "cls"],
      map: ["map"],                         // the map of where you've been (ui/map.js)
      quit: ["quit game", "exit game", "quit", "exit"]   // back to the list of games. Longest first. "exit" is also the way out of a place and lists the ways out: while the story goes on it keeps that meaning, and quits only after the end (js/parser.js)
    },
    dirs: { n: ["n", "north"], s: ["s", "south"], e: ["e", "east"], w: ["w", "west"], u: ["u", "up", "upstairs", "up stairs", "upwards", "upward"],
            d: ["d", "down", "downstairs", "down stairs", "downwards", "downward"],
            // Into / out of a place (a cab, a hut). The verbs among them (enter, leave, get out…) are read as verbs first and
            // mean the same when typed alone in a room with that way (js/parser.js).
            in: ["in", "inside", "enter", "go in", "get in", "step in"],
            out: ["out", "outside", "exit", "leave", "go out", "get out", "step out"] },
    // What a room's text says when it invites the player to go in or out (the checker warns when nothing in the room answers
    // "in" / "out": js/check.js). Whole words; `not` before a phrase makes it a refusal ("don't go in").
    invites: {
      in: ["go in", "go inside", "step in", "step inside", "walk in", "come in", "get in", "get inside", "go into", "step into", "walk into", "enter"],
      out: ["go out", "go outside", "step out", "step outside", "walk out", "get out"],
      not: ["not", "never", "dont", "don't", "cant", "can't", "cannot", "wont", "won't"],
      // The words right before a verb the text offers ("you can swim", "you could row out"): the checker warns when what is offered
      // is scenery that nothing answers (js/check.js, "A scenery noun with a verb that nothing answers").
      can: ["you", "can", "could", "may", "might", "would", "should", "must", "will"]
    },
    articles: ["the", "a", "an", "some", "my"],
    preps: ["until", "till", "at", "on", "to", "in", "into", "with", "from", "under", "about", "of", "inside", "through", "for"],
    and: ["and"],                         // joins objects, or (before a verb) two commands
    then: ["then"],                       // always starts a new command
    it: ["it", "them", "that", "him", "her"],   // the last thing mentioned (him / her: the last person, below)
    // What each one prefers: plural (`pl`), gender (`g`), a person (`person`: a character, an object with topics; "him"
    // and "her" never mean a thing). The parser only follows what is written here.
    pronouns: { it: { pl: false }, them: { pl: true }, him: { g: "m", person: true }, her: { g: "f", person: true } },
    // What's particular to English when reading (js/parser.js). A new language sets these for itself.
    grammar: {
      fold: {},                                    // what a keyboard without a letter types for it ({ "ß": "ss" }), read before accents come off: none
      elisions: {},                                // short forms written out in full before reading
      secondObject: ["with", "in", "into", "on", "to", "at", "about", "through", "for"],   // "unlock door WITH key"
      fromWords: ["from", "out of"],               // "take letter FROM bottle": where a thing is taken out of
      attached: null,                              // pronouns joined to verbs: none in English
      speechTo: ["to", "at"],                      // who words are said to: "say hello TO the waiter"
      askFor: ["for"],                             // "ask Dot FOR tea", "ask for tea": asking for a thing (it comes), not about it
      whom: [],                                    // the word before the person asked (Spanish "pregunta A Inés"); English names them bare: "ask Dot"
      oneWords: ["one", "ones"],                   // "the iron ONE": answers "Which do you mean?" without naming anything
      contractions: {},                            // words written out in full right after the verb (Spanish al, del): none
      // What a verb takes before its object, in the commands the engine words (js/view.js, phraseFor: "Knock on door") and in hints
      // (`{knock+}`). The rest read fine bare ("enter door", "push bell").
      verbPreps: { knock: "on", lie: "on", sit: "on", wave: "at" },
      nameParts: [],                               // prepositions that can be part of a name ("butaca DEL pasillo"): none
      lowerNames: true,                            // names in a sentence start in lower case ("tin of mints"); German: false
      gender: false                                // things have no gender (`words.g`) to agree with: the standard replies ignore it
    },
    // Words around a command that add nothing: before it only if a verb or direction follows ("can I get on"), after
    // it if something is left ("get on anyway").
    filler: {
      start: ["can i", "could i", "may i", "can you", "could you", "i want to", "i wanna", "i need to", "i would like to",
              "id like to", "i will", "i try to", "try to", "let me", "lets", "please", "just", "now", "i"],
      end: ["please", "anyway", "anyhow", "now", "for me", "thanks", "thank you", "if i can", "if possible"]
    },
    yes: ["yes", "y", "yeah", "yep", "ok", "okay", "sure"],
    no: ["no", "n", "nope", "not"],
    // How long a SLEEP lasts (js/parser.js, sleepLength), typed after the verb or as the answer to "How long do you sleep?": the
    // three answers' names (nap: an hour; few: four; morning: until the next 07:00), "until" and a time of day ("until 18:00",
    // "till 6 pm", "until noon"), a number and a unit ("3 hours", "an hour", "45 minutes", "3h"), and words that add nothing.
    sleep: {
      nap: ["a short nap", "short nap", "a quick nap", "quick nap", "a nap", "nap", "a little", "a while", "a bit"],
      few: ["a few hours", "few hours", "some hours", "several hours", "a few"],
      morning: ["until morning", "till morning", "til morning", "until the morning", "till the morning", "until tomorrow", "till tomorrow",
                "until dawn", "till dawn", "until daybreak", "morning", "the morning", "all night", "the whole night", "through the night", "overnight"],
      until: ["until", "till", "til", "untill"],
      hours: ["hours", "hour", "hrs", "hr", "h"],
      minutes: ["minutes", "minute", "mins", "min", "m"],
      numbers: { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 },
      am: ["am", "in the morning"], pm: ["pm", "in the afternoon", "in the evening", "at night"],
      noon: ["noon", "midday"], midnight: ["midnight"],
      filler: ["for", "about", "around", "just", "only", "please"]
    }
  }
};
