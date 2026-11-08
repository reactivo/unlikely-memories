// The music of "Hartley's, After Hours", shared by world.en.js and world.es.js (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Opus 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/hartleys.json from it.
//
// The theme is sung to: "Hartley's closes at six and never empties."
// A tune of its own: lift, "B, G, 1, 2, 4"
//
// The composer's notes (never shown to a player):
//   Harmonic minor gives Hartley's its mahogany-and-brass theatre, major its plain palm-court tenderness, and lydian the
//   floating strangeness of the fourth floor's afternoons; the music reaches you like an old record (or through the floors,
//   or from the arcade's wireless), heard clean only in the tea room where it is played and on the roof where nothing is
//   left between you and it. The theme is a too-slow waltz sung by the perfume bottles (the choir about to sing) to the
//   rule "Hartley's closes at six and never empties", falling in three stages like the lift going down: a long "Hart-", a
//   grace note into "clo-", a ringing chord on "six", the echo "closes at six" ending in a falling arpeggio, then a leap up
//   for "ne-" and a melisma that runs down through "emp-". Its slightly wrong thing is that it never comes home: it closes
//   every phrase and ends on the second step, over the cash railway's oom-pah-pah rocking between the home chord and its
//   neighbour and left on the neighbour. The cotton reel's figure is a broken waltz chord played twice, the way Miss
//   Thimble measures everything twice, and the canister line is the cash railway's tubes clacking into their cradles now
//   and then. The lift bell rings two notes for a floor nobody asked for, and in the lift it is Mr Pell's own tune, the
//   indicator's B, G, 1, 2, 4, which skips a step where the third floor should be.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["harmonic-minor", "major", "lydian"],
  tempo: 60,
  colour: ["gramophone", "through_wall", "radio"],
  instruments: {
    perfume_choir: { kind: "blown", ratio: 1.5, bright: 0.3, attack: 0.2, release: 0.9 },
    cash_railway: { kind: "reed", ratio: 2, bright: 0.35, attack: 0.3, release: 0.8 },
    cotton_reel: { kind: "plucked", ratio: 2.5, bright: 0.55, attack: 0, release: 0.5 },
    lift_bell: { kind: "struck", ratio: 3.5, bright: 0.45, attack: 0, release: 2.5 },
    canister: { kind: "clack", ratio: 1, bright: 0.4, attack: 0, release: 0.15 }
  },
  tone: "crowd",
  lines: [
    { play: "canister", octave: 3, notes: "1:0.5 1:0.5 -:2.5 1:0.25 -:15.25" },
    { play: "cotton_reel", octave: 3, notes: "1:0.5 5:0.5 3:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 3:0.5 5:0.5 3:0.5 5:0.5 -:11" },
    { play: "lift_bell", octave: 5, notes: "-:13 5:1 3:1 -:24" }
  ],
  melody: {
    play: "perfume_choir",
    octave: 5,
    words: "Hartley's closes at six and never empties.",
    shape: "falling",
    notes: "8:2 7:1 7:0.125 6:1.375 5:1 4:0.5 3+5:2 -:1 6:1 5:0.5 4:0.5 5/3/1:1 -:1 -1:0.5 3:1 2:0.5 4:0.125 3:0.875 2:0.25 1:0.25 -1:0.5 2:1",
    chords: { play: "cash_railway", octave: 3, notes: "1:1 3+5:1 3+5:1 2:1 4+6:1 4+6:1 1:1 3+5:1 3+5:1 1:1 3+5:1 3+5:1 2:1 4+6:1 4+6:1 2:1 4+6:1 4+6:1" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  pavement: { tone: "rain", colour: "radio" },
  lift: {
    tone: "hum",
    lines: [],
    melody: {
      play: "lift_bell",
      octave: 4,
      words: "B, G, 1, 2, 4",
      shape: "arch",
      notes: "-1:0.5 1:0.5 2:0.5 3:0.5 5:1.5 3:1"
    }
  },
  toys: {
    colour: "music_box",
    lines: [
      { play: "cotton_reel", octave: 4, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 3:0.75 5:1 -:14" }
    ]
  },
  tea_room: {
    tone: "hall",
    colour: "clean",
    lines: [
      { play: "cash_railway", octave: 3, notes: "1:1 3+5:1 3+5:1 2:1 4+6:1 -:10" }
    ]
  },
  basement: {
    tone: "hum",
    colour: "through_wall",
    lines: [
      { play: "canister", octave: 3, notes: "1:0.5 1:0.5 -:2 1:0.5 1:0.5 -:6.5" },
      { play: "cotton_reel", octave: 3, notes: "1:0.5 5:0.5 3:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 3:0.5 5:0.5 3:0.5 5:0.5 -:11" }
    ]
  },
  roof_garden: { tone: "wind", colour: "clean", lines: [] },
  fourth_floor: {
    tone: "silence",
    colour: "far_away",
    lines: [
      { play: "cotton_reel", octave: 5, notes: "-:7 6:0.25 5:0.25 -:21.5" },
      { play: "perfume_choir", octave: 4, notes: "3:1 2:0.5 -:2 1:1 -:18" }
    ]
  }
};
