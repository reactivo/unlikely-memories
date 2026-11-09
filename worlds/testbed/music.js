// The music of "Testbed", shared by world.en.js and world.es.js (music has no words that change), written the way the AI writes it
// (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world file adds as one `add music`; and `rooms`,
// each room's own part, which becomes that room's `music`. Like everything in the Testbed it is written to hold every mechanism:
// every instrument kind, every tone, every colour, a chord, an arpeggio, a slide, a scoop, a rest, a note below the root, a short
// note, and a theme with chords underneath. This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's
// tools/music/worlds/testbed.json from it, and `python3 tools/music/levels.py` its levels.js.
//
// The theme is sung to: "Testing, testing, one, two, three: nothing here is quite for real."
//
// The composer's notes (never shown to a player):
//   Dorian, a little minor and an opening "in", for a test rig that hums to itself: it is meant to sound like an instrument being
//   checked, not played, so the world's part is a wire that is plucked, a bench bell, a relay that ticks and a drip, over a hum.
//   The theme is a slow arch up and back that rests on the fifth, with a chord on "one", an arpeggio on "three", a slide into
//   "nothing", a scooped "quite" and a note below the root at the end. The rooms that differ each take one tone and, where it
//   suits, one colour, so that every tone and every colour is heard once somewhere.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["dorian", "minor", "in"],
  tempo: 40,
  colour: ["radio", "clean", "gramophone"],
  instruments: {
    wire: { kind: "plucked", ratio: 2, bright: 0.5, attack: 0, release: 0.8 },
    bench_bell: { kind: "chime", ratio: 3, bright: 0.4, attack: 0, release: 1.6 },
    plate: { kind: "struck", ratio: 1, bright: 0.3, attack: 0, release: 1.2 },
    bow: { kind: "bowed", ratio: 1.5, bright: 0.25, attack: 0.3, release: 1.5 },
    flute: { kind: "blown", ratio: 2, bright: 0.2, attack: 0.15, release: 0.7 },
    reed: { kind: "reed", ratio: 1, bright: 0.4, attack: 0.1, release: 0.5 },
    relay: { kind: "tick", ratio: 1, bright: 0.5, attack: 0, release: 0.1 },
    knocker: { kind: "knock", ratio: 1, bright: 0.2, attack: 0, release: 0.25 },
    lever_clack: { kind: "clack", ratio: 2, bright: 0.5, attack: 0, release: 0.1 },
    brush: { kind: "brush", ratio: 3, bright: 0.5, attack: 0, release: 0.15 },
    drip: { kind: "drip", ratio: 2, bright: 0.4, attack: 0, release: 0.4 }
  },
  tone: "hum",
  lines: [
    { play: "wire", octave: 3, notes: "1:1 -:1 5:1 -:1 1:1 -:1 3:1 -:1" },
    { play: "bench_bell", octave: 5, notes: "-:6 8:1 -:1" },
    { play: "relay", octave: 3, notes: "1:0.5 -:3.5 1:0.5 -:3.5" },
    { play: "drip", octave: 4, notes: "-:5 5:0.5 -:2.5" }
  ],
  melody: {
    play: "flute",
    octave: 4,
    words: "Testing, testing, one, two, three: nothing here is quite for real.",
    shape: "arch",
    notes: "1:0.5 1:0.5 3:0.5 3:0.5 5+8:1 5:0.5 8/5/3:1 ~3:0.5 5~8:1 8:0.5 6:0.5 5:1 -:0.5 3:0.25 4:0.25 3:0.5 2:0.5 1:1 -1:1.5",
    chords: { play: "bow", octave: 2, notes: "1:4 4:4 5:4 1:4" }
  }
};

// ---- Each room's own part (its music): where it is a different kind of place ----------------------------------------------
export const rooms = {
  "tb-bar": {
    tone: "crowd",
    colour: "music_box",
    lines: [
      { play: "reed", octave: 3, notes: "1:0.5 3:0.5 5:1 5:0.5 6:0.5 5:1 3:1 -:3" },
      { play: "knocker", octave: 2, notes: "1:1 -:1 1:1 -:1" }
    ]
  },
  "tb-office": {
    tone: "silence",
    colour: "far_away",
    lines: [
      { play: "brush", octave: 3, notes: "1:0.25 1:0.25 -:3.5 1:0.25 -:3.75" }
    ]
  },
  "tb-bedroom": {
    tone: "fog",
    colour: "through_wall",
    lines: [
      { play: "bow", octave: 3, notes: "1:6 3:4 2:6" },
      { play: "bench_bell", octave: 5, notes: "-:10 8:1 -:5" }
    ]
  },
  "tb-yard": {
    tone: "wind",
    lines: [
      { play: "flute", octave: 4, notes: "-:2 5:1 4:0.5 3:0.5 -:4" },
      { play: "lever_clack", octave: 2, notes: "1:0.5 -:3.5" }
    ]
  },
  "tb-lane": {
    tone: "rain",
    colour: "underwater",
    lines: [
      { play: "drip", octave: 4, notes: "5:0.5 -:1.5 3:0.5 -:2.5 5:0.5 -:3" },
      { play: "plate", octave: 2, notes: "1:3 -:5" }
    ],
    melody: {
      play: "wire",
      octave: 4,
      words: "Rain on the lane, and one lit window.",
      shape: "sinking",
      notes: "5:0.5 5:0.5 4:0.5 3:1 2:0.5 3:0.5 2:0.5 1:1.5"
    }
  },
  "tb-cellar": {
    tone: "water",
    lines: [
      { play: "drip", octave: 3, notes: "1:0.5 -:2.5 1:0.5 -:3.5" },
      { play: "bow", octave: 2, notes: "1:8" }
    ]
  },
  "tb-pit": {
    tone: "cave",
    lines: [
      { play: "plate", octave: 2, notes: "1:2 -:6" },
      { play: "drip", octave: 4, notes: "-:3 3:0.5 -:4.5" }
    ]
  },
  "tb-vault": {
    tone: "hall",
    colour: "clean",
    lines: [
      { play: "bench_bell", octave: 4, notes: "1:1 5:1 3:1 -:5" }
    ]
  },
  "tb-lab": {
    tone: "hum",
    lines: [
      { play: "relay", octave: 3, notes: "1:0.25 1:0.25 -:1.5" },
      { play: "reed", octave: 2, notes: "1:6 -:2" }
    ]
  },
  "tb-roof": {
    tone: "wind",
    colour: "far_away",
    lines: [
      { play: "flute", octave: 5, notes: "8:1 7:0.5 5:0.5 -:6" }
    ]
  },
  "tb-chute": {
    tone: "fire",
    lines: [
      { play: "lever_clack", octave: 2, notes: "1:0.5 1:0.5 -:3" },
      { play: "knocker", octave: 2, notes: "-:2 1:0.5 -:1.5" }
    ]
  }
};
