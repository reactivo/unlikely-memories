// The lint of a world as written (not played): every check of js/checks/*.js, in the order the checker has always listed the problems and the
// warnings. The playthrough is js/check.js. Pure: reads the state and the pack, never changes either.

import { idProblems, spriteProblems, portraitChecks, useProblems, consumableProblems, sourceProblems, moverChecks } from "./things.js?v=0.74.2";
import { puzzleProblems, harmWarnings } from "./puzzles.js?v=0.74.2";
import { planChecks, exitShapeProblems, exitsLeadProblems, pairProblems, inOutProblems } from "./space.js?v=0.74.2";
import { offeredWarnings, sourceTopicWarnings, mentionProblems, topicWarnings, markedThingWarnings } from "./mentions.js?v=0.74.2";
import { conditionShapeProblems, listComparisons, neverHolds, neverOpen, neverWaits, conditionChecks } from "./conditions.js?v=0.74.2";
import { pictureWarnings, paletteWarnings, removalWarnings, pictureProblems } from "./pictures.js?v=0.74.2";
import { bibleChecks } from "./cover.js?v=0.74.2";
import { roomLengthWarnings, sleepWarnings, hedgeProblems, regionalWarnings, wordWarnings, answerWarnings } from "./voice.js?v=0.74.2";
import { introChecks } from "./start.js?v=0.74.2";
import { commandProblems, wayWarnings, sceneryVerbWarnings } from "./commands.js?v=0.74.2";
import { clockTimeWarnings } from "./clock.js?v=0.74.2";

// Every lint of the world as written: into `out` (a Report: js/checks/registry.js), the problems and warnings in the order they have always had.
export function lintWorld(state, pack, bible, puzzles, out) {
  idProblems(state, out);
  puzzleProblems(state, pack, puzzles, out);
  spriteProblems(state, out);
  portraitChecks(state, out);
  planChecks(state, out);
  const badExits = exitShapeProblems(state, out);
  exitsLeadProblems(state, pack, badExits, out);
  pairProblems(state, out);
  inOutProblems(state, out);
  offeredWarnings(state, pack, out);
  sourceTopicWarnings(state, pack, out);
  mentionProblems(state, pack, out);
  topicWarnings(state, out);
  conditionShapeProblems(state, out);
  useProblems(state, pack, out);
  moverChecks(state, out);   // a thing that moves: its facts, its here line, its sprite and its overlays
  harmWarnings(state, out);
  consumableProblems(state, out);
  sourceProblems(state, out);
  pictureWarnings(state, bible, out);
  paletteWarnings(state, bible, out);
  removalWarnings(state, out);
  markedThingWarnings(state, pack, out);
  pictureProblems(state, out);   // the ending's picture: each `end` names one the world has; a world that can hurt you has a `died` one
  if (bible) bibleChecks(out, bible, state);
  roomLengthWarnings(state, out);
  sleepWarnings(state, out);
  introChecks(state, pack, out);
  // What the texts say: the commands in them parse; a clock time they name has something in the world at that hour, or
  // [time] (BRIEF.md §4); a way in or out has an exit; a verb offered on scenery is answered; no words of the other region;
  // every [..] is known. Then the exits and waits that can never open or fire.
  commandProblems(state, pack, out);
  hedgeProblems(state, pack, bible, out);
  clockTimeWarnings(state, pack, out);
  listComparisons(state, out);
  wayWarnings(pack, state, out);
  sceneryVerbWarnings(state, pack, out);
  if (pack.words.regional) regionalWarnings(state, pack, bible, out);
  wordWarnings(state, pack, out);
  answerWarnings(state, pack, out);
  conditionChecks(state, out);
  const never = neverHolds(state);
  neverOpen(never, state, badExits, out);
  neverWaits(never, state, out);
}
