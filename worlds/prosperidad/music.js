// The music of "Emperor of Prosperidad", shared by world.en.js and world.es.js (music has no words), written the way the AI writes it
// (BRIEF.md §7b): the world's part (the default export), which the world file adds as one `add music`; and `rooms`, each room's own part,
// which becomes that room's `music` (only where the room is a different kind of place).
// Composed by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/prosperidad.json from it.
//
// The theme is sung to (the world's first rule, in Spanish, as the Spanish world has it): "Todo lo que brilla se paga."
//   (in English: "Everything that shines has been paid for.")
//
// The composer's notes (never shown to a player):
//   Dorian for a punk night that is nervous and a little warm, phrygian for the squats and the dark close rooms, pentatonic minor for
//   the open, unresolved street; heard through a wall, as a club's music always is from the pavement, or on a radio between stations,
//   or as if under water, for a city that is half a dream. The world's pulse is the club's bass drum through the brick, a four that
//   misses its fourth beat (the slightly wrong thing the world keeps), a cheap guitar leaning on the second step of the mode (never
//   settling: the squat's one chord), and the chimney sweep's whistle, a few high notes a long way apart. The theme is the world's
//   rule on the whistle, in a limp of fives (three and two): it starts high and falls in stages, three times: the first
//   at the top (with a run and a grace note), the second lower (with a grace note before "bri-" and a long note on the weak syllable),
//   the third a beat short (a chord on "pa-" and an arpeggio, ending below the root, so it never comes home), over the guitar's
//   fifth and a chord that leans on the second. The room parts: the Submarino with its crowd and an organ (the only room where the
//   music is heard clean, since you are inside it), the Estafeta with a rubber stamp for its one rhythm and no tone, the
//   Lavandería with its drum brushing round and round over water, the roof with Tomás's three notes and the wind, and the works with
//   only the furnace's fire.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["dorian", "phrygian", "pentatonic-minor"],
  tempo: 78,
  colour: ["through_wall", "radio", "underwater"],
  instruments: {
    bombo: { kind: "knock", ratio: 1, bright: 0.2, attack: 0, release: 0.3 },
    cheap_guitar: { kind: "plucked", ratio: 2, bright: 0.55, attack: 0, release: 1 },
    sweeps_whistle: { kind: "blown", ratio: 1, bright: 0.3, attack: 0.12, release: 0.6 },
    club_organ: { kind: "reed", ratio: 2, bright: 0.4, attack: 0.08, release: 0.5 },
    rubber_stamp: { kind: "tick", ratio: 1, bright: 0.5, attack: 0, release: 0.15 },
    washing_drum: { kind: "brush", ratio: 2, bright: 0.4, attack: 0, release: 0.2 }
  },
  tone: "hum",
  lines: [
    { play: "bombo", octave: 2, notes: "1:0.5 -:1.5 1:0.5 -:1.5 1:0.5 -:1.5 1:0.5 -:2.5" },
    { play: "cheap_guitar", octave: 3, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 2:0.5 5:0.5 -:13" },
    { play: "sweeps_whistle", octave: 5, notes: "-:23 5:1 4:0.5 2:2 -:15" }
  ],
  melody: {
    play: "sweeps_whistle",
    octave: 4,
    words: "Todo lo que brilla se paga.",
    shape: "falling",
    notes: "8:1 7:0.5 8:0.5 6:1.5 5:0.5 6:0.25 5:0.25 3:0.5 6:0.125 5:0.875 4:0.5 5:0.5 3:1.5 2:0.5 3:0.5 1:1 4:0.5 3:0.5 2+5:1 1/3/5:1 -1:1",
    chords: { play: "cheap_guitar", octave: 2, notes: "1+5:5 2+5:5.5 1+5:4" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  pista: {
    tone: "crowd",
    colour: "clean",
    lines: [
      { play: "bombo", octave: 2, notes: "1:0.5 -:0.5 1:0.5 -:0.5 1:0.5 -:0.5 1:0.5 -:0.5 1:0.5 -:0.5 1:0.5 -:0.5 1:0.5 -:0.5 -:1" },
      { play: "club_organ", octave: 3, notes: "3:0.5 5:0.5 3:0.5 2:0.5 1:2 -:5 5:0.5 3:0.5 2:1 -:9" }
    ]
  },
  estafeta: {
    tone: "silence",
    lines: [
      { play: "rubber_stamp", octave: 3, notes: "1:0.25 -:7 1:0.25 -:3 1:0.25 -:12.5" }
    ]
  },
  lavanderia: {
    tone: "water",
    lines: [
      { play: "washing_drum", octave: 3, notes: "1:0.5 -:0.5 1:0.5 -:0.5 1:0.5 -:2" },
      { play: "cheap_guitar", octave: 4, notes: "-:17 5:1 3:1 -:21" }
    ]
  },
  azotea: {
    tone: "wind",
    lines: [
      { play: "sweeps_whistle", octave: 5, notes: "5:0.5 4:0.5 2:1.5 -:10 5:0.5 4:0.5 2:1.5 -:14 5:0.5 4:0.5 6:2 -:18" }
    ]
  },
  fabrica: {
    tone: "fire",
    lines: []
  }
};
