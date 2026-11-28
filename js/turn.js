// The controller's turn (ARCHITECTURE.md §2, "The controller"): a command from top to bottom (parse → engine → narrator → screen), the
// world's own tick and its one timer, a walk on the map, a sleep on the screen, and the story's paragraphs. Holds no game logic and
// builds no text: the engine and the narrator do; the screen is ui/'s, told here what to show. What it shares lives in js/current.js;
// a session command (undo, save…) goes to js/session.js.

import { state, setState, packOf, view, clock, ui, mix, graphics, transcript, keep, keepForUndo } from "./current.js?v=0.77.1";
import { session, confirmed, restart, autosave, restarting } from "./session.js?v=0.77.1";
import { step, nextDue, takesBlank, withoutYesNo } from "./engine.js?v=0.77.1";
import { parse, retype } from "./parser.js?v=0.77.1";
import { inScope } from "./place.js?v=0.77.1";
import { describe, text, listName, joined } from "./narrator.js?v=0.77.1";
import { suggestion, topicsLine, story, offers } from "./view.js?v=0.77.1";
import { walk, tripWords } from "./map.js?v=0.77.1";
import * as soundpanel from "../ui/soundpanel.js?v=0.77.1";

const QUIET_RETRY = 500;      // ms to wait before trying again when the world can't act yet (you're typing…)

let shown = null;                                        // what the screen showed last time
let timer = null;                                        // the single timer: wakes the world when a timed rule is due
export let asleep = null;                                // a sleep playing on the screen (sleepThrough): { shift, run }; nothing else moves meanwhile
let turnStart = null;                                    // this turn's first paragraph: { el, entry } (see enteredRoom)
export let lastInput = null;                             // the last command typed (for OOPS)
export let lastUnknown = null;                           // the unknown word in it, if any (for OOPS)
export let pendingWhich = null;                          // "Which do you mean…?" is waiting: what the next input may answer (parse)

// What each piece is given to draw: a state, its language pack, the sound (`mix`, the sliders and the mute, and `music`, whether
// anything can be heard) and the screen settings. Also for the start room's theme on a world's own page (js/screens.js).
export const viewOf = (s) => ({ state: s, pack: packOf(s), music: soundpanel.audible(mix), mix, graphics });

// Redraw the screen: each piece gets the view of the state and updates what changed since last time. reason: "turn" (a command),
// "tick" (the world on its own), "restore" (new game, undo, load: no animation), "tap" (the sound switch or a slider).
export function redraw(reason) {
  const next = viewOf(state);
  for (const piece of Object.values(ui)) piece.update(shown, next, reason);
  shown = next;
}
// A world opened in the game view: every piece draws itself afresh at the next redraw (js/screens.js, openWorld).
export function forgetShown() { shown = null; }

// Run one command: echo it, parse it, then either run a session command (undo, save…), name a problem with
// the words, or let the engine apply each action and tell what happened.
// Every way of running a command comes through here (Enter, compass, story links, objects, choices), so this is
// where it is remembered for ↑ / ↓: `kept` is what is stored (default: the command as run).
export function runCommand(raw, kept = raw) {
  if (restarting || asleep) return;                      // a new game is about to start; you are asleep
  ui.log.hurry();                                        // text still appearing shows at once, then the answer (ui/log.js)
  ui.prompt.remember(kept);                              // (the history ignores empty lines)
  const blank = !raw.trim();
  if (blank && !takesBlank(state)) return;               // a blank Enter does nothing (unless a question for words waits: it is the answer)
  const from = state.player.at;
  turnStart = null;
  ui.prompt.clearHint();                                 // a command: the hint steps aside (it comes back after two idle minutes)
  if (!blank) echo("> " + raw);                          // (a blank answer has no echo: never a lone ">" in the story)
  play(raw);
  enteredRoom(from);
  ui.log.toEnd();
}

// A room clicked on the map: walk there, one real move after another (js/map.js: every rule applies). Only the arrival is
// shown (or where the walk stopped and what was said), after the typed trip as the echo. One turn: one UNDO takes it all back.
export function travel(room) {
  if (restarting || asleep || state.ended) return;
  const pack = packOf(state), from = state.player.at, before = state;
  const trip = walk(withoutQuestion(state), room, pack, clock.now());   // a question waiting is dropped: a walk is moves, not an answer
  if (!trip) return;                                     // here already, or not on the map
  ui.log.hurry();                                        // text still appearing shows at once, then the walk (ui/log.js)
  newTurn();
  ui.prompt.clearHint();
  echo("> " + tripWords(trip.path, pack));
  keepForUndo(before);
  setState(trip.next);
  played(trip.paragraphs, trip.applied, before, from);
}

// A move that wasn't typed is made (`state` is after it, `before` the state before, `from` the room it began in): its paragraphs and
// sounds, the screen, a new room's visit, the timer, the save, the story followed (a walk on the map; main.js's `dev`).
export function played(paragraphs, applied, before, from) {
  show(paragraphs);
  heard(applied, before);
  redraw("turn");
  enteredRoom(from);
  schedule(); autosave();
  ui.log.toEnd();
}

// A turn that wasn't typed (a walk on the map, and main.js's `dev`): no paragraph of it yet, and no "Which do you mean…?" waits.
export function newTurn() { turnStart = null; pendingWhich = null; }

// After a turn: if it took you to another room, the story starts a new visit from this turn's first line (your
// command), and everything before it becomes past (ui/log.js). Marked in the saved story too, for loading.
export function enteredRoom(from) {
  if (restarting || state.player.at === from || !turnStart) return;
  ui.log.newVisit(turnStart.el);
  turnStart.entry.visit = true;
}

// A clicked command as if typed: "EXAMINE DOOR" → "Examine door" (so its echo reads like what you'd type).
export function sentenceCase(text) {
  const t = text.trim().toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// A clicked object (in the story, or an item in the inventory): examine it, as if typed ("Examine tin"), then
// suggest what else you could do with it (if it's still within reach, and nothing else is waiting for an answer).
export function examineObject(id, label, fromInventory = false) {
  const pack = packOf(state), verb = pack.words.verbs.examine[0];
  runCommand(verb.charAt(0).toUpperCase() + verb.slice(1) + " " + label);
  if (restarting || state.ended || state.pending.question || !inScope(state, id)) return;
  suggest(suggestion(state, pack, id, fromInventory, true));
}

// The state with no question waiting (the same state when none is).
const withoutQuestion = (s) => (s.pending.question ? { ...s, pending: { ...s.pending, question: null } } : s);

// Parse and play some typed words (also used by OOPS, which replays earlier words).
export function play(raw) {
  const which = pendingWhich;
  pendingWhich = null;                                   // it waits for the next input only
  const pack = packOf(state), parsed = parse(raw, state, pack, seenText(pack), which);
  if (parsed.meta) {                                     // a session command drops a yes/no question; a question for words stays open
    setState(withoutYesNo(state));
    return session(parsed.meta, parsed.arg);
  }
  lastInput = raw; lastUnknown = null;
  if (parsed.error) return problem(parsed.error, raw);
  // Answering one of the session's own questions (undo, load…) isn't a move to take back.
  const q = state.pending.question, answering = parsed.actions[0]?.verb === "answer" && parsed.actions[0].question === q?.ask && q?.yes?.some(e => e.session);
  if (!answering) keepForUndo(state);
  let again = false, then = null;
  for (const action of parsed.actions) {
    const was = state, { next, applied, refused } = step(state, { ...action, at: clock.now() });
    setState(next);
    if (moment(applied, refused, was)) return;           // a sleep: told in time with the eyes closing (the command's remaining actions are dropped)
    then = applied.find(e => e.session)?.session ?? then; // a question answered yes: something for the session
    if (applied.some(e => e.restart)) { again = true; break; }   // beginning again was chosen
    if (state.pending.question) break;                   // a question was asked: the command's remaining actions are dropped; the answer is a command of its own
  }
  redraw("turn");
  if (then) return confirmed(then);
  // After someone answers (talking, asking, saying something to them): what you could ask them about next.
  const talked = parsed.actions.findLast(a => ["talk", "ask", "say"].includes(a.verb) && a.obj);
  if (talked && !again && !state.ended && !state.pending.question && state.talkingTo === talked.obj && inScope(state, talked.obj)) {
    const line = topicsLine(state, pack, talked.obj);
    if (line) suggest(line);
  }
  if (again) restart({ said: true });                  // (BEGIN AGAIN: the engine has said againYes)
  else { schedule(); autosave(); }
}

// What one step of the engine said, told the same way for a typed command and for the world's own tick: a rule's impossible
// request is warned of, a sleep goes through sleepThrough (the eyes close, the lock; its end redraws and schedules, so true: the
// caller stops there), else the story's paragraphs (USE alone also says what you could do with the thing) and their sounds.
// `state` is already the state after the step; `was` the one before.
function moment(applied, refused, was) {
  if (refused.length) console.warn("Effects refused by the engine:", refused);   // a rule asked for something impossible
  const slept = applied.find(e => "sleep" in e);
  if (slept) { sleepThrough(applied, slept, was); return true; }
  show(story(applied, state, packOf(state)));
  for (const line of offers(applied, state, packOf(state), was)) suggest(line);   // a way just opened: the line that offers going through it
  heard(applied, was);
  return false;
}

// A sleep (js/engine.js, `sleep`; INTERFACE.md §6c, "Sleep"), told in time with the picture (ui/scene.js, sleep): what comes before
// the eyes close ("You close your eyes."), then the eyes close; in the dark, what is said there (a dream, a vision's line), and the
// dark lasts until it has been told; the picture woken to goes under the lids, they open, and then the waking (its line, the
// echoes, the room) and everything the screen shows of the moment (redraw: the clock, the reactions, the inventory). A sleep you
// don't wake from ends in the dark, then the death and the ending. Meanwhile the compass, the inventory and the command line are
// locked and greyed (ui/page.js, asleep); a tap, a click or a key skips to waking. The title bar's clock keeps the time you fell
// asleep at. Never on a restore: a loaded game, UNDO and a new game only show the story as it was told. The moment's sounds come
// once you wake (`was`: the game before it).
function sleepThrough(applied, mark, was) {
  const pack = packOf(state), i = applied.indexOf(mark), j = applied.findIndex(e => e.woke);
  const before = applied.slice(0, i), dark = j < 0 ? [] : applied.slice(i + 1, j), after = applied.slice(j < 0 ? i + 1 : j + 1);
  const picture = mark.vision && state.pictures?.[mark.vision];
  show(story(before, state, pack));
  ui.log.toEnd();
  let told = false;
  const tellDark = () => { if (told) return 0; told = true; show(story(dark, state, pack)); ui.log.toEnd(); return ui.log.busyFor(); };
  const run = ui.scene.sleep({
    kind: mark.sleep, wake: mark.wake !== false, vision: picture ? { id: mark.vision, world: state.worldId, picture: picture.picture } : null,
    dark: tellDark,
    open: () => ui.scene.update(shown, viewOf(state), "restore"),   // the picture woken to, under the lids
    done: () => {
      tellDark();
      asleep = null;
      ui.page.asleep(false);
      ui.sound.asleep(false);
      show(story(after, state, pack));
      heard(applied, was);
      redraw("turn");
      showTime();
      schedule(); autosave();
      ui.log.toEnd();
      if (!state.ended) ui.prompt.focus();
    }
  });
  asleep = { shift: shown?.state?.time?.shift ?? 0, run };
  ui.page.asleep(true, () => run.skip());
  ui.sound.asleep(true);                                 // the music fades out under the lids, and back as you wake
}
// The game view is left while a sleep plays (js/screens.js, leaveGame): it stops where it is.
export function cancelSleep() { if (asleep) { asleep.run.cancel(); asleep = null; ui.page.asleep(false); } }

// Nothing to do with the words (not a turn): a reply in the world's voice, varied ("You're not sure how to do
// that."), plus "Did you mean…?" for a clear typo.
function problem(error, raw) {
  const pack = packOf(state);
  let arg = error.arg;
  if (error.say === "@which" || error.say === "@whoMean") {   // "Which do you mean: the green door or the grey door?"
    arg = joined(arg.map(id => listName(id, state, pack)), pack.or);   // (always two or more)
  }
  if (error.which) pendingWhich = error.which;           // the next input may be the answer
  if (error.word) lastUnknown = error.word;
  say(text(vary(error.say, pack), pack, arg), error.style || "");
  if (error.didYouMean) say(text("@didYouMean", pack, retype(raw, error.word, error.didYouMean, pack.words.grammar)), "sys");
}

// One of a pack entry's phrasings ("@unsure" → "@unsure.2"): the next one in turn, so never the same twice in a
// row (and the same each time the game is played, which keeps the screen check repeatable).
const lastVariant = {};
function vary(key, pack) {
  const list = pack[key.slice(1)];
  if (!Array.isArray(list)) return key;
  const i = ((lastVariant[key] ?? -1) + 1) % list.length;
  lastVariant[key] = i;
  return key + "." + i;
}

// A game is replaced (js/session.js, forgetGame): the memory of the last turn goes (OOPS, "Which do you mean…?", where this turn began).
export function forgetTurn() { lastInput = null; lastUnknown = null; pendingWhich = null; turnStart = null; }

// Set the single timer for whatever the engine says is due next (in game time). Nothing due: no timer.
export function schedule() {
  clearTimeout(timer);
  if (view !== "game" || !clock.running || restarting) return;
  const due = nextDue(state);
  if (due !== null) timer = setTimeout(tick, Math.max(0, due - clock.now()));
}
// No timer until the next schedule(): a new game is about to start (js/session.js, restart), the game is left or the tab hidden (js/screens.js).
export function unschedule() { clearTimeout(timer); }

// The world takes a turn on its own (a timed rule is due): no echo, no turn counted. It waits while you're
// typing, while text is still appearing, while a question is waiting for your answer, or while you sleep.
function tick() {
  if (view !== "game") return;                           // (the list of games is showing)
  if (ui.prompt.typing() || ui.log.busy() || state.pending.question || asleep) { timer = setTimeout(tick, QUIET_RETRY); return; }
  const follow = ui.log.atEnd();                         // only follow the new text if you were already there
  const from = state.player.at;
  turnStart = null;
  const was = state, { next, applied, refused } = step(state, { tick: true, at: clock.now() });
  setState(next);
  if (moment(applied, refused, was)) return;             // (all of it the world's own: set apart, "aside", by the engine's mark; a sleep goes through)
  redraw("tick");
  enteredRoom(from);
  if (follow) ui.log.toEnd();
  schedule(); autosave();
}

// Add story paragraphs to the log ({ text, style, img, level, slot }; img = an object's picture shown beside the text; level =
// the health bars; slot = the small inventory slot before the echo of a thing gained or lost, with its sprite; a thing with no
// sprite has none). The paragraph is kept whole in the transcript, so a loaded game draws them again (and a line saved with an
// empty slot draws none: ui/log.js slotArt).
export function show(paragraphs) {
  for (const p of paragraphs) note(ui.log.line(p, state, false), p);
}
// A moment's sounds (ui/sound.js, moment): its list, handed over as the log's paragraphs are, with the game before it (`was`) and
// after (the state now). Only for a moment played: a restore, UNDO, a load and a new game hand over none.
export function heard(applied, was) { ui.sound.moment(applied, state, was); }
// One line of text (a reply, a note) and an echoed command, kept in the transcript too.
export function say(t, style = "") { show([{ text: t, style }]); }
export function echo(t) { note(ui.log.say(t, "cmd"), { text: t, style: "cmd" }); }
// A paragraph just added: kept for saves, and remembered if it's the first of this turn.
function note(el, entry) { keep(entry); turnStart ||= { el, entry }; }
// The title bar shows the world's time: play time plus however far the story has moved it (js/time.js); while you sleep, the time you
// fell asleep at (it jumps as you wake). The music hears it too (night: ui/sound.js).
export function showTime() {
  const ms = clock.now() + (asleep ? asleep.shift : state?.time?.shift || 0);
  ui.titlebar.showClock(ms);
  ui.sound.clock(ms);
}

// What the player has just read: the room's text and the last few lines. Something named there that the game
// can't answer about gets a neutral reply instead of "You see no … here" (js/parser.js, the safety net).
export function seenText(pack) {
  const room = describe(state, state.player.at, pack).map(l => l.text);
  const lately = transcript.slice(-8).filter(p => p.style !== "cmd").map(p => p.text);
  return [...room, ...lately].filter(t => typeof t === "string").join(" ");
}

// Show a suggestion line (after clicking an object or item). Not a turn.
function suggest(text) {
  if (!text) return;
  ui.log.suggest(text);
  ui.log.toEnd();
  ui.prompt.focus();
}
