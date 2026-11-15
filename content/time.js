// The day in four parts, by the light (ARCHITECTURE.md §5, "Time"): the same for every world, and no world can change them. The one
// table of them: nothing else writes these hours. In order from the first of the day; each part lasts until the next, and the last
// runs past midnight to the first again (night: 20:00 to 06:00). `from` is the hour a part begins; `wake` (a part that has one) is the
// hour "Until <part>" wakes you at (a sleep, js/sleep.js). The names are the language packs' (`parts`). js/time.js reads this
// (`partAt`); a rule reads the part as `time.part`; the music's night is the part "night" (content/music.js, reactions.night).
export default [
  { id: "dawn", from: 6, wake: 7 },
  { id: "daytime", from: 8 },
  { id: "dusk", from: 17 },
  { id: "night", from: 20 }
];
