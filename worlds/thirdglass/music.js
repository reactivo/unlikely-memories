// The music of "The Third Glass", shared by every language of the world (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/thirdglass.json from it.
// One edit: the hands' tea-glass line was written in octave 6; it is 5 here, as the reader played it (MUSIC.md §4).
//
// The theme is sung to: "Bitter as life, strong as love, gentle as death"
// A tune of its own: tent, "humming under its breath"
//
// The composer's notes (never shown to a player):
//   In is first because the camp is hushed and far from anywhere, pentatonic-minor is open and unresolved like the sand
//   sea, and phrygian is the dark close air of the caves; the colours are far_away (a camp heard across dunes), radio (a
//   night voice off the station) and through_wall (the tent's own life). The theme's words are the tea rule, 'Bitter as
//   life, strong as love, gentle as death', sung on the imzad as three phrases, each lower than the last (sinking), with a
//   grace into 'bitter', a scoop into 'strong', an arpeggio down on 'love', a run on 'life', and a chord on 'death'; it
//   limps along in fives and a short seven, over a tea-glass bass that steps down the scale. The slightly wrong thing is
//   the long note on the weak word 'as' in the last phrase, where 'gentle' wanted it. The imzad is the one-string fiddle
//   hanging in Fadimata's tent, the tea glass is the three glasses (it clinks three times, quietly, once in a long while),
//   and the brazier tick is the pulse under the tent's rug. Rooms keep the same instruments: the tent hums its own small
//   imzad tune, the caves get a single glass, the room of hands only scattered tiny clinks, and the cistern is heard
//   underwater, holding what it was told.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["in", "pentatonic-minor", "phrygian"],
  tempo: 42,
  colour: ["far_away", "radio", "through_wall"],
  instruments: {
    imzad: { kind: "bowed", ratio: 2, bright: 0.35, attack: 0.5, release: 1.2 },
    tea_glass: { kind: "struck", ratio: 4, bright: 0.5, attack: 0, release: 1.8 },
    brazier: { kind: "tick", ratio: 1, bright: 0.3, attack: 0, release: 0.15 }
  },
  tone: "wind",
  lines: [
    { play: "brazier", octave: 3, notes: "1:0.5 -:3.5 1:0.5 -:2.5" },
    { play: "imzad", octave: 3, notes: "3:1.5 2:0.5 1:2 -:11" },
    { play: "tea_glass", octave: 5, notes: "-:13 5:0.25 -:0.75 5:0.25 -:0.75 5:0.25 -:23" }
  ],
  melody: {
    play: "imzad",
    octave: 3,
    words: "Bitter as life, strong as love, gentle as death",
    shape: "sinking",
    notes: "6:0.125 5:1 4:0.5 4:0.5 3:1 2:0.5 3:0.5 -:0.5 5:0.125 ~4:1.5 3:0.5 5/3/1:1 2:0.5 1:0.5 -:0.5 3:0.5 2:0.5 1:0.5 -1:1.5 1:0.5 2:0.5 1+5:1",
    chords: { play: "tea_glass", octave: 2, notes: "5:2.5 5:2.5 4:2.25 4:2.25 2:2.5 2:2.5" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  tent: {
    tone: "fire",
    colour: "through_wall",
    lines: [
      { play: "brazier", octave: 3, notes: "1:0.5 -:2.5 1:0.5 -:1.5 1:0.5 -:3" },
      { play: "tea_glass", octave: 4, notes: "-:11 3:0.5 -:0.5 2:1 -:15" }
    ],
    melody: {
      play: "imzad",
      octave: 2,
      words: "humming under its breath",
      shape: "narrow",
      notes: "3:1 2:0.5 3:0.5 2:1 1:1.5 -:1 2:0.5 1:0.5"
    }
  },
  ridge: {
    tone: "wind",
    lines: [
      { play: "imzad", octave: 4, notes: "8:1 6:1 5:2 -:20" }
    ]
  },
  gallery: {
    tone: "cave",
    lines: [
      { play: "tea_glass", octave: 4, notes: "-:9 3:0.5 -:0.5 2:1 -:17" }
    ]
  },
  hands: {
    tone: "silence",
    lines: [
      { play: "tea_glass", octave: 5, notes: "-:6 8:0.125 -:7 8:0.125 -:3 7:0.125 -:11" }
    ]
  },
  cistern: {
    tone: "cave",
    colour: "underwater",
    lines: [
      { play: "tea_glass", octave: 3, notes: "-:8 1:1 -:5 -1:1 -:12" }
    ]
  }
};
