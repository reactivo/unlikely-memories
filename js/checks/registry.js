// The checker's registry: every check the world checker makes (js/checks/*.js), one entry each, and the report the checks write into.
// An entry is { id, level, brief, says }:
//   id     stable and readable, "<topic>.<what>" (`plan.room-without-square`, `voice.hedge`); one id for each distinct rule, so what a
//          build's hand-in caught can be counted by rule. A check that gives a problem and a warning has an id for each.
//   level  "problem" (the world is refused or fails the checker) or "warning" (said, never refuses).
//   brief  the section of BRIEF.md that states the rule, as its number ("§2", "§7b"); null only where BRIEF has no such rule
//          (tests/sample.test.js pins that every one names a heading that is there).
//   says   one line: what it checks.
// The text of a problem or a warning is the checks' own (no id is part of it); `Report` keeps both: the strings the checker has always
// returned, and the catches ({ id, level, brief, text }) that say which check made each.

const entry = (level) => (id, brief, says) => ({ id, level, brief, says });
const problem = entry("problem"), warning = entry("warning");

export const REGISTRY = [
  // ---- the world as loaded and the music (js/check.js)
  warning("fields.warning", "§8", "what the world's file got wrong and still plays, found as it loaded (js/fields.js)"),
  warning("music.note", "§7b", "what the music's forgiving reader skipped or brought into range"),
  warning("music.none", "§7b", "the world has no music"),
  // ---- ids, puzzles and the playthrough
  problem("ids.shared", "§8", "a room, an object and a puzzle never share an id"),
  problem("puzzle.unknown-thing", "§4", "what a puzzle needs, gives or has as a clue exists"),
  problem("puzzle.unknown-room", "§4", "the rooms a puzzle is in or reaches exist"),
  problem("puzzle.no-result", "§4", "solving a puzzle gives something, reaches somewhere, sets something or ends the story"),
  problem("puzzle.unknown-property", "§4", "what a puzzle sets is a property declared on a thing"),
  warning("puzzle.clues-few", "§4", "a main step (a puzzle an ending needs, or the way out) has two lasting clues"),
  problem("puzzle.no-ending", "§4", "some puzzle ends the story"),
  problem("puzzle.no-gender", "§6", "in a language whose replies agree with the thing, each thing has its gender"),
  problem("play.no-puzzles", "§4", "the world describes puzzles"),
  problem("play.not-in-reach", "§4", "each step of a solve names only what is in reach where it is played (or what its verb may name from afar), and an answer comes with its question open"),
  problem("play.engine-refused", "§4", "each step a puzzle plays is accepted by the engine"),
  problem("play.time-refused", "§4", "a puzzle's `time` can be moved to"),
  problem("play.gives-missing", "§4", "solving a puzzle puts what it gives to hand"),
  problem("play.given-before", "§4", "a thing a puzzle gives that can't be carried comes into view with its solve, not before"),
  problem("play.reaches-missed", "§4", "solving a puzzle takes you to the room it reaches"),
  problem("play.sets-missed", "§4", "solving a puzzle makes true the property it sets"),
  problem("play.thing-unreachable", "§4", "what a puzzle needs can be found and gone to"),
  problem("play.take-failed", "§4", "taking what a puzzle needs picks it up"),
  problem("play.mover-lost", "§4", "a thing that moves, named by a step, can be found or waited for"),
  problem("play.lock-stuck", "§8", "a locked thing's key can be had and opens it"),
  problem("play.no-route", "§4", "every room a puzzle goes to can be walked to"),
  problem("play.not-ended", "§4", "each ending's puzzles end the story"),
  problem("play.ending-no-picture", "§7", "the story ends with a picture"),
  problem("play.replay-differs", "§4", "an ending played again as the tests play it ends the same"),
  warning("play.ending-unplayed", "§4", "every `end` in a rule is reached by a puzzle with ending: true"),
  // ---- the start room
  problem("start.no-opening", "§3", "the world has an opening"),
  problem("start.declaration", "§3", "the opening is declared as the engine needs it (js/opening.js)"),
  problem("start.one-way-out", "§3", "the start room has one way out, the way thing's"),
  problem("start.way-open", "§3", "the way out is closed at the start"),
  problem("start.first-puzzle", "§3", "the first puzzle is the way out, with its hints"),
  problem("start.way-unopenable", "§3", "the first puzzle opens the way out from the start room alone"),
  problem("start.loses-thing", "§3", "nothing the way out needs can be lost or spoilt in the start room"),
  problem("start.no-way-back", "§3", "once out, there is a way back into the start room"),
  problem("start.hints-here", "§3", "the hints thing has a `here` line"),
  problem("start.nouns-clash", "§3", "each thing in the start room has nouns of its own"),
  warning("intro.long", "§6", "the intro is about 90 words, warned past 150"),
  problem("intro.language", "§3", "the intro is written in the world's language"),
  // ---- space and exits
  problem("plan.none", "§2", "the world has a plan"),
  problem("plan.room-without-square", "§2", "every room is on a square of the plan"),
  problem("plan.exit-mismatch", "§2", "an exit leads to the room on the next square that way"),
  problem("exit.target-unknown", "§8", "an exit with a condition leads to a room (or true)"),
  problem("exit.condition", "§8", "an exit's `if` is a condition the engine reads"),
  problem("exit.closed-text", "§8", "an exit's `closed` is a line, or a list of lines"),
  problem("exit.not-reached", "§2", "going each way from a room arrives where the exit says"),
  warning("exit.name-not-reached", "§6", "\"go <room name>\" from next door gets there"),
  problem("exit.thing-way-missing", "§8", "a thing that leads somewhere has the exit it leads by"),
  problem("exit.thing-climb", "§8", "climbing a thing that leads somewhere goes that way"),
  problem("exit.inout-no-thing", "§8", "an in or out way is a thing in the room that is that way"),
  problem("door.pair", "§8", "two doors that are a pair each name the other"),
  warning("exit.never-opens", "§8", "an exit's condition can hold"),
  warning("wait.never-fires", "§8", "a wait's condition can hold"),
  warning("text.invites-way", "§8", "a room that says you can go in or out has something that answers"),
  // ---- things
  warning("sprite.held-missing", "§7", "every thing that can end up in the player's hands has a sprite (the game draws a plain one from its material when it has none)"),
  problem("portrait.malformed", "§7", "a character's portrait is 16 rows of 16 hex digits and dots"),
  warning("portrait.missing", "§7", "a character in a world with planned motion has a portrait"),
  warning("offer.repeats-engine", "§8", "what a thing offers is not what the engine offers by itself"),
  warning("offer.not-understood", "§8", "what a thing offers is a command the game reads"),
  warning("offer.stock-reply", "§8", "what a thing offers is answered by more than a stock reply"),
  warning("source.topic-repeats-again", "§8", "a source's topic for a thing that comes from it does not repeat the thing's `again` line"),
  problem("mark.unanswered", "§4", "what a thing's own text marks answers"),
  problem("mark.not-object", "§4", "a {label|id} marks an object"),
  problem("mark.click-mismatch", "§4", "clicking a marked label examines the thing it marks"),
  warning("shot.mark-unanswered", "§7", "what a picture's shot marks answers in the room"),
  warning("lies.not-portable", "§8", "a `lies` line is on a thing that can be taken"),
  problem("room-text.names-portable", "§6", "a room's text never names a thing that can be taken"),
  warning("portable.held-unmarked", "§8", "a thing a character holds is marked by the character's lines"),
  warning("portable.unmarked", "§8", "a thing that can be taken is marked in some text the player meets"),
  warning("topic.never-offered", "§8", "a topic is brought up by something"),
  problem("use.not-action", "§8", "a thing's `use` is an action the game knows"),
  problem("mover.declaration", "§8", "a thing that moves has `places`, `rounds` or both, well formed"),
  problem("mover.no-here", "§8", "a thing that moves has a `here` line"),
  problem("mover.no-sprite", "§8", "a thing that moves has a sprite"),
  problem("mover.portable", "§8", "a thing that moves is not one you take"),
  problem("mover.no-overlay", "§7", "a thing that moves has an overlay in each room it can be in"),
  warning("mover.follower-no-overlay", "§7", "a thing that follows you has an overlay in each room"),
  problem("consumable.unknown-condition", "§5", "the condition a consumable starts or stops exists"),
  warning("consumable.does-nothing", "§5", "a consumable heals, starts or stops something"),
  warning("consumable.no-line", "§5", "a consumable has an `eat` or `drink` line"),
  problem("source.unknown", "§8", "the source of a thing that comes from somewhere exists"),
  warning("source.starts-somewhere", "§8", "a thing that comes when asked for starts nowhere"),
  // ---- puzzles' fairness: harm and healing
  warning("harm.direct-loss", "§5", "health is lost with `hurt`, never set"),
  warning("heal.direct-raise", "§5", "health is raised with `heal`, never set"),
  warning("harm.hurt-no-says", "§5", "a hurt has a line of its own"),
  problem("harm.hit-size", "§5", "a hit is a whole number from 1 to 5"),
  warning("harm.five-no-end", "§5", "a hit of 5 comes with an end in the same rule"),
  warning("harm.four-rare", "§5", "a hit of 4 is very rare"),
  problem("heal.amount", "§5", "a heal is a number above 0"),
  warning("heal.no-says", "§5", "a heal has a line of its own"),
  warning("heal.repeatable", "§5", "a heal cannot be repeated for ever"),
  // ---- conditions in `if`, and the conditions the player is in
  problem("cond.malformed", "§8", "a condition uses the operators the engine knows"),
  problem("rule.once-shape", "§8", "a rule's `once` is true or left out"),
  problem("wait.malformed", "§8", "a `waitFor` is { time, says, if? }, well formed"),
  warning("cond.list-compare", "§8", "a list is asked with `has`, not compared with = or !="),
  problem("cond.undeclared", "§8", "a condition a rule starts or stops is one the world declares"),
  problem("cond.asks-undeclared", "§8", "a condition a rule asks about is one the world declares"),
  problem("filter.invalid", "§8", "a picture filter a rule turns on or off is one there is"),
  problem("cond.never-ends", "§8", "a condition can end"),
  warning("cond.never-started", "§8", "a declared condition is started by something"),
  warning("cond.heal-repeatable", "§5", "a condition that heals cannot be started again and again"),
  problem("cond.hurt-no-cure", "§8", "a condition that can take all your health leaves time to reach its cure"),
  // ---- text and voice
  warning("length.room-words", "§6", "a room's text aims at about 45 words"),
  warning("length.room-paragraphs", "§6", "a room's text is 2 paragraphs, 3 at most"),
  warning("sleep.refused-most", "§8", "most rooms do not refuse sleep"),
  problem("voice.hedge", "§6", "the narrator states and never hedges"),
  warning("voice.regional", "§6", "no words of another region of the language"),
  problem("command.unreadable", "§6", "a command in backticks in a text is one the game reads, naming what the world has"),
  warning("text.scenery-verb", "§4", "a verb a text offers on a scenery noun is answered"),
  warning("clock.unmatched-time", "§4", "a clock time a text names has something in the world at that hour"),
  warning("words.unknown", "§11", "a [..] in a text is a word of the game or a declared property"),
  warning("words.unset", "§11", "a property a text shows has a value to show"),
  warning("ask.unanswered", "§8", "a question for words has a rule that catches the answer"),
  warning("ask.never-asked", "§8", "an answer a rule reads is asked by something"),
  // ---- pictures
  problem("picture.no-alt", "§7", "an ending's picture has an alt"),
  problem("picture.carries-alt", "§7", "a picture and its overlays carry no alt: pictures hold shapes, not words"),
  problem("overlay.no-alt", "§7", "each overlay has an overlayAlt on its room"),
  problem("overlay.alt-orphan", "§7", "an overlayAlt describes an overlay the picture has"),
  problem("overlay.figured", "§7", "an overlay of a thing with a figure says how tall and where its feet stand"),
  problem("overlay.missing-for-portable", "§7", "a thing that can be taken has an overlay where it starts"),
  problem("room.alt-names-portable", "§7", "a room's alt does not name a thing that can be taken"),
  problem("figure.unreadable", "§7", "a thing's figure is shapes in the short notation that parse"),
  problem("figure.outside-box", "§7", "a figure's points are inside its box"),
  problem("end.no-picture", "§7", "an `end` names a picture"),
  problem("end.unknown-picture", "§7", "an `end` names a picture the world has"),
  problem("end.died-missing", "§5", "a world that can hurt the player has a `died` picture"),
  problem("dream.unknown-picture", "§7", "a dream's picture is one the world adds"),
  problem("draw.no-list", "§7", "a picture has a drawing list"),
  problem("draw.shot", "§7", "a picture's shot is one string that marks only {word}"),
  problem("draw.too-many-shapes", "§7", "a picture has at most the most shapes"),
  problem("draw.duplicate-id", "§7", "a shape id is used once"),
  problem("draw.shape-kind", "§7", "a shape is one of the notation's shapes"),
  problem("draw.colour", "§7", "colours are palette numbers 0-15"),
  problem("draw.outline", "§7", "an outline names a shape and has a colour"),
  problem("draw.open-drawing", "§7", "a thing that opens is drawn shut and open"),
  problem("cycle.too-many", "§7", "a picture has at most 3 cycles"),
  problem("cycle.style", "§7", "a cycle's style is one the engine knows"),
  problem("cycle.scroll", "§7", "a scroll has a direction and a step time, and no colours"),
  problem("cycle.colors", "§7", "a cycle's colors, scatter and rest are well formed"),
  problem("cycle.sweep", "§7", "a sweep is for rotate, one step for each area"),
  problem("cycle.area", "§7", "a cycle's areas are shape ids, groups of them or [x, y, width, height]"),
  warning("cycle.scroll-overlap", "§7", "a scroll's area is never also another cycle's (the engine gives a shared pixel to the first cycle in the list)"),
  warning("cycle.area-empty", "§7", "a cycle's area paints something (the engine does not run a cycle with nothing to move)"),
  problem("loop.list", "§7", "a picture's loops are a list"),
  problem("loop.too-many", "§7", "a picture has at most the most loops"),
  problem("loop.malformed", "§7", "a loop has a name, style, speed, frames of equal size and a place inside the picture"),
  warning("motion.pace", "§7", "a cycle's steps are no quicker than the recipes'"),
  warning("motion.shot-plan", "§7", "a shot says what moves, or \"moves: nothing\""),
  warning("picture.few-shapes", "§7", "a picture has the shapes its style asks for"),
  warning("picture.way-side", "§7", "a way that is a thing is drawn on the side its direction lies in the picture's facing, and one behind you not at all"),
  warning("picture.partial-removal", "§7", "a thing's shapes are all removed together"),
  warning("palette.unknown-name", "§7", "the palettes the bible names are in the palette table"),
  warning("palette.not-listed", "§7", "a room's shot names a palette the bible lists"),
  // ---- the bible's card, the cover and the box art
  problem("bible.no-blurb", "§1", "the card has a blurb"),
  warning("bible.blurb-length", "§1", "the blurb is of a length a card can show (60 to 240 characters, about 20 to 30 words)"),
  problem("bible.no-thumbnail", "§1", "the card has a thumbnail"),
  problem("bible.thumbnail", "§1", "the thumbnail names a room's picture with an x from 0 to 95"),
  problem("bible.style", "§7", "the picture style is dithered or flat"),
  problem("bible.flat-fade", "§7", "a flat world's pictures have no fade fill"),
  warning("bible.bg-colour", "§7", "the bible's bg, when given, is a colour white reads on (1, 4, 5, 6, 8, 9) or black 0"),
  warning("cover.title-at", "§7", "the cover's titleAt names its band"),
  warning("cover.title-colour", "§7", "the cover's title, when given, is a palette colour"),
  warning("cover.band", "§7", "no art is drawn in the cover's bands"),
  warning("cover.title-hidden", "§7", "the cover's title reads on the background"),
  warning("cover.cycle-band", "§7", "no cycle or loop touches a band"),
  warning("cover.cycle-colours", "§7", "a cover's cycle never names the background (bg) among its colours, and paints one colour"),
  warning("cover.loop-list", "§7", "a cover's loops are a list"),
  warning("cover.loop-too-many", "§7", "a cover has at most the most loops"),
  warning("cover.loop-malformed", "§7", "a cover's loop has a name, style, speed, frames of equal size and a place inside the picture"),
  warning("cover.loop-under", "§7", "a loop passes behind a shape that shows"),
  warning("cover.motion-counts", "§7", "a cover has 2-3 cycles and 1-2 loops, at most one scatter"),
  warning("boxart.title-at", "§7", "the box art's titleAt names its band"),
  warning("boxart.title-colour", "§7", "the box art's title, when given, is a palette colour"),
  warning("boxart.band", "§7", "no art is drawn in the box art's title band"),
  warning("boxart.title-hidden", "§7", "the box art's title band is not the title's own colour"),
];

const BY_ID = new Map(REGISTRY.map(e => [e.id, e]));
export const entryOf = (id) => BY_ID.get(id) ?? null;

// One catch: what a check found, with its id, level and the BRIEF section it states.
export function catchOf(id, text) {
  const e = BY_ID.get(id);
  if (!e) throw new Error(`the checker has no check "${id}" (js/checks/registry.js)`);
  return { id, level: e.level, brief: e.brief, text };
}

// What the checks write into. `add(id, text)` puts the text on the problems or the warnings by the check's level, and keeps the catch;
// the lists are the strings the checker has always returned, each in the order it was found. `catches()` is the same findings with their
// ids: the problems, then the warnings, each in its list's order.
export class Report {
  constructor() { this.problems = []; this.warnings = []; this.found = []; }
  add(id, text) {
    const c = catchOf(id, text);
    (c.level === "problem" ? this.problems : this.warnings).push(text);
    this.found.push(c);
  }
  // A view that puts `prefix` before every text it is given ("rooms/hall: …").
  prefixed(prefix) { return { add: (id, text) => this.add(id, prefix + text), prefixed: (p) => this.prefixed(prefix + p) }; }
  catches() { return [...this.found.filter(c => c.level === "problem"), ...this.found.filter(c => c.level === "warning")]; }
}

// The texts a check function found, in the order it found them (for the exported functions that return a list of strings).
export function collect(fn) {
  const out = new Report();
  fn(out);
  return out.found.map(c => c.text);
}
// The catches a check function found, each text with `prefix` before it ("cover: ").
export function collectCatches(fn, prefix = "") {
  const out = new Report();
  fn(out);
  return out.found.map(c => ({ ...c, text: prefix + c.text }));
}
