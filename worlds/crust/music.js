// The music of "Emperor of the Crust", shared by the world's languages (music has no words): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music`. Written by tools/world.mjs add from the hand-in.

export default {
  mode: ["phrygian", "in", "dorian"],
  tempo: 74,
  colour: ["underwater", "through_wall", "radio"],
  instruments: {
    mains_hum: { kind: "reed", ratio: 1, bright: 0.2, attack: 1.5, release: 3 },
    busker_guitar: { kind: "plucked", ratio: 2, bright: 0.5, attack: 0, release: 0.9 },
    bar_accordion: { kind: "reed", ratio: 2, bright: 0.4, attack: 0.25, release: 0.8 },
    sewing_machine: { kind: "clack", ratio: 1, bright: 0.5, attack: 0, release: 0.15 }
  },
  tone: "wind",
  lines: [
    { play: "mains_hum", octave: 1, notes: "1:16 -:4" },
    { play: "busker_guitar", octave: 3, notes: "3:0.5 2:0.5 1:1 -:9 2:0.25 1:0.25 -:7" }
  ],
  melody: {
    play: "busker_guitar",
    octave: 3,
    words: "Come before the coach, Javier.",
    shape: "asked",
    notes: "5:0.5 5:0.5 6:1 5:0.5 3:0.5 4:0.5 6:0.125 5:0.375 3:1 -:1 6:0.5 6:0.5 7:1 6:0.5 4:0.5 5:0.5 7:0.125 6:0.375 4:1 -:1 5:0.5 5:0.5 8:1 6:0.5 5:0.5 4/6/8:1",
    chords: { play: "bar_accordion", octave: 3, notes: "1+5:3 2+4+6:2 1+5:3 2+4+6:2 1+5:3 2+4+6:3" }
  }
};

export const rooms = {
  alley: { colour: "through_wall" },
  charlie: { tone: "hum" },
  workshop: {
    tone: "silence",
    lines: [
      {
        play: "sewing_machine",
        octave: 3,
        notes: "1:0.25 1:0.25 1:0.25 1:0.25 1:0.25 1:0.25 1:0.25 1:0.25 -:9"
      }
    ]
  },
  opera: { tone: "hall", lines: [{ play: "bar_accordion", octave: 3, notes: "1+5:3 -:2 4+6:3 -:9" }] },
  solar: { tone: "fire" }
};
