// Checker's lints: what is wrong with a world as written, without playing it (the playthrough is js/check.js). This file is the index of the
// checker's modules in js/checks/, by topic, and holds no check itself; whatever other files import from it is re-exported here.
//
//   checks/registry.js    every check, one entry each (id, level, brief, says), and the Report the checks write into
//   checks/shared.js      helpers and the world's texts      checks/lint.js    lintWorld: the order the problems and warnings are listed in
//   checks/space.js       the plan, exits, in and out, pairs of doors (the walks the checks read are in js/walkthrough.js)
//   checks/start.js       the start room's guarantees, the intro     checks/puzzles.js   puzzles, harm and healing
//   checks/things.js      ids, sprites, portraits, consumables, sources, things that move     checks/mentions.js   what texts mention and mark, offers, topics
//   checks/conditions.js  conditions in `if` and `waitFor`, conditions the player is in, what can never hold
//   checks/voice.js       lengths, hedges, regional words, words from the state, questions     checks/commands.js   commands in texts, verbs on scenery, ways in and out
//   checks/clock.js       clock times in texts     checks/drawings.js   one picture's shapes, cycles, loops, motion     checks/pictures.js   endings' pictures, overlays, palettes
//   checks/cover.js       the bible's card, the cover, the box art

export { REGISTRY, Report, entryOf } from "./checks/registry.js?v=0.71.0";
export { NO_MUSIC, effectsOf } from "./checks/shared.js?v=0.71.0";
export { lintWorld } from "./checks/lint.js?v=0.71.0";
export { openingCatches } from "./checks/start.js?v=0.71.0";
export { clockMentions } from "./checks/clock.js?v=0.71.0";
export { motionWarnings, shapeWarnings } from "./checks/drawings.js?v=0.71.0";
export { altNames, lacksOverlay, drawnAsShapes, mainPalette, shotPalette, biblePalettes } from "./checks/pictures.js?v=0.71.0";
export { bibleProblems, coverWarnings, boxartWarnings, coverCatches, boxartCatches, backgroundCatches, posterCatches } from "./checks/cover.js?v=0.71.0";
