// The music of "The Last Word on Lantern Row", shared by world.en.js and world.es.js (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Opus 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/lantern.json from it.
//
// The theme is sung to: "Every lamp on the Row is lit by hand, the last one last."
// A tune of its own: last_lamp, "The dead keep their posts until someone relieves them."
//
// The composer's notes (never shown to a player):
//   Harmonic minor gives the Row its gaslit parlour air, a little theatrical like an inquest held at midnight, with lydian
//   for a fog that keeps words floating where they were said and plain major for a killing that was a kindness; the music
//   reaches you like an old record that plays on in the fog, or from far off, or through a wall. The theme is the Row's
//   rule, "Every lamp on the Row is lit by hand, the last one last", sung on the gas jet's low breath as a slow parlour
//   waltz in threes of half-beats, sinking each time down the Row towards the river, with a run on "Every", a chord ringing
//   on "lamp", a melisma on "Row", a scooped leap on "lit" and a grace before the second "lamp", over a lamp-harp bass that
//   falls one lamp at a time. Its slightly wrong thing is that it never comes home: the last "last" lands on the step below
//   the root, like the one lamp left dark. The lamp harp's figure counts the lamps down the Row three times and the third
//   time leaves off the last one, Constable Pye's boots walk his short beat four steps down and only three back, and the
//   gas jet sighs now and then high up; the fog itself is the bowed instrument, murmuring Mr Fenn's own repeated-note tune
//   ("The dead keep their posts until someone relieves them", its third time leaping once before it settles) only at the
//   last lamp, where there is no gas sigh because that lamp is unlit. Only four rooms differ: the Bell, where three men
//   sing the same too-cheerful tune each a little further behind the last, the coroner's court with its pen and the
//   listening fog in a big hall, the last lamp with Fenn's tune, and the substation, where the dynamo's held hum is the
//   world's one drone and the only music heard clean, under the Row's one electric bulb.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["harmonic-minor", "lydian", "major"],
  tempo: 42,
  colour: ["gramophone", "far_away", "through_wall"],
  instruments: {
    gas_jet: { kind: "blown", ratio: 1.5, bright: 0.2, attack: 0.15, release: 0.8 },
    lamp_harp: { kind: "plucked", ratio: 2.5, bright: 0.35, attack: 0, release: 1.4 },
    pye_boots: { kind: "knock", ratio: 1, bright: 0.15, attack: 0, release: 0.25 },
    murmuring_fog: { kind: "bowed", ratio: 1.5, bright: 0.2, attack: 0.35, release: 1.8 },
    bar_singers: { kind: "reed", ratio: 2, bright: 0.35, attack: 0.15, release: 0.5 },
    dynamo: { kind: "reed", ratio: 1, bright: 0.4, attack: 1.5, release: 1.2 },
    coroners_pen: { kind: "brush", ratio: 3, bright: 0.5, attack: 0, release: 0.15 }
  },
  tone: "fog",
  lines: [
    { play: "pye_boots", octave: 2, notes: "1:1 1:1 1:1 1:1 -:2 1:1 1:1 1:1 -:15" },
    { play: "lamp_harp", octave: 4, notes: "8:0.5 5:0.5 3:0.5 1:0.5 8:0.5 5:0.5 3:0.5 1:0.5 8:0.5 5:0.5 3:0.5 -:14.5" },
    { play: "gas_jet", octave: 5, notes: "-:11 5:1.5 4:0.5 -:17" }
  ],
  melody: {
    play: "gas_jet",
    octave: 3,
    words: "Every lamp on the Row is lit by hand, the last one last.",
    shape: "sinking",
    notes: "8:0.75 7:0.25 6:0.5 5+8:0.75 6:0.25 5:0.5 4:0.25 5:0.25 4:0.5 3:0.5 ~6:0.5 5:0.25 4:0.75 -:0.5 5:0.5 4:0.25 3:0.25 3:0.125 2+5:0.875 1:0.5 4:0.5 3:0.25 2:0.75 1:0.25 2:1 1:0.25 -1:1.5",
    chords: { play: "lamp_harp", octave: 2, notes: "8:1.5 7:1.5 6:1.5 5:1.5 4:1.5 3:1.5 2:1.5 1:1.5 -1:1.5" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  bell: {
    tone: "fire",
    lines: [
      { play: "bar_singers", octave: 3, notes: "1:0.5 3:0.5 5:1 5:0.5 6:0.5 5:1 3:1 2:0.5 1:1.5 -:12" },
      { play: "bar_singers", octave: 3, notes: "-:0.5 1:0.5 3:0.5 5:1 5:0.5 6:0.5 5:1 3:1 2:0.5 1:1.5 -:12" },
      { play: "bar_singers", octave: 3, notes: "-:1 1:0.5 3:0.5 5:1 5:0.5 6:0.5 5:1 3:1 2:0.5 1:1.5 -:12" }
    ]
  },
  court: {
    tone: "hall",
    lines: [
      { play: "coroners_pen", octave: 3, notes: "1:0.25 1:0.25 1:0.5 -:3 1:0.25 1:0.25 -:13.5" },
      { play: "murmuring_fog", octave: 3, notes: "-:12 3:1 2:0.5 -:13" }
    ]
  },
  last_lamp: {
    lines: [
      { play: "pye_boots", octave: 2, notes: "1:1 1:1 1:1 1:1 -:2 1:1 1:1 1:1 -:15" },
      { play: "lamp_harp", octave: 4, notes: "8:0.5 5:0.5 3:0.5 1:0.5 8:0.5 5:0.5 3:0.5 1:0.5 8:0.5 5:0.5 3:0.5 -:14.5" },
      { play: "murmuring_fog", octave: 4, notes: "-:9 5:0.5 5:0.5 5:1 4:0.25 3:1 -:17" }
    ],
    melody: {
      play: "murmuring_fog",
      octave: 4,
      words: "The dead keep their posts until someone relieves them.",
      shape: "repeated",
      notes: "5:0.5 5:1 5:0.5 5:0.5 3+5:1 -:0.5 5:0.25 5:0.25 5:0.5 5:0.5 5:0.5 6:0.125 5:0.375 4:0.25 5:0.25 3:1 5:0.5 5:1 5:0.5 5:0.5 8:0.5 5:0.5 6:0.125 5:0.375 4:0.25 3:0.25 1:1"
    }
  },
  substation: {
    tone: "hum",
    colour: "clean",
    lines: [
      { play: "dynamo", octave: 2, notes: "1:12 -:2 1:12 -:2 1:6 2:2 -:6" }
    ]
  }
};
