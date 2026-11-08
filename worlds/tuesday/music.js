// The music of "The Train to Tuesday", shared by world.en.js and world.es.js (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Opus 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/tuesday.json from it.
//
// The theme is sung to: "The station clock is honest"
// A tune of its own: cafe, "a radio playing the same waltz"
//
// The composer's notes (never shown to a player):
//   Lydian first for a town floating between Sunday and Tuesday, major for the plain tenderness of a Sunday evening,
//   harmonic minor for the old-world railway café; gramophone because the town keeps playing its last Monday, far away
//   because it is a hill town heard from the halt and remembered, through a wall because the Monday is always someone
//   else's (the pond alone hears it clean, being a little clearer than the town). The theme sings the rule 'The station
//   clock is honest', seven syllables like the seven days, three times on the ledger cello (the archive's ledgers, which
//   keep the last Monday) low in octave 3, as a slow march, each phrase lower than the last, over the café radio's
//   accordion with a bass falling step by step. The first phrase leaps up through a grace note to 'sta-' and rings 'clock'
//   as a chord, the second scoops into 'sta-', breaks 'clock' into a falling arpeggio and runs down 'honest' in three quick
//   notes, and the third is quick and low and comes home. Its slightly wrong thing is that the third phrase is a beat
//   short, three beats where the march gave four, as the week is a day short. The one rhythm line is the honest station
//   clock, ticking a week with its second tick (Monday, after Sunday) missing; the figure is the lost property birdcage's
//   wires, plucked three times then left; the tunnel hum is held only at the platform's end, the shop clocks tick fast and
//   chime only at the clockmaker's, and the café radio plays its own waltz, too slowly to dance to.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["lydian", "major", "harmonic-minor"],
  tempo: 36,
  colour: ["gramophone", "far_away", "through_wall"],
  instruments: {
    ledger_cello: { kind: "bowed", ratio: 1, bright: 0.3, attack: 0.25, release: 1.2 },
    birdcage_wire: { kind: "plucked", ratio: 3, bright: 0.6, attack: 0, release: 0.5 },
    radio_accordion: { kind: "reed", ratio: 2, bright: 0.4, attack: 0.1, release: 0.5 },
    station_clock: { kind: "tick", ratio: 1, bright: 0.3, attack: 0, release: 0.1 },
    tunnel_hum: { kind: "blown", ratio: 1, bright: 0.1, attack: 2, release: 4 },
    shop_clocks: { kind: "chime", ratio: 2.8, bright: 0.35, attack: 0, release: 4 }
  },
  tone: "fog",
  lines: [
    { play: "station_clock", octave: 4, notes: "1:1 -:1 1:1 1:1 1:1 1:1 1:1 -:12" },
    { play: "birdcage_wire", octave: 4, notes: "1:0.5 3:0.25 5:0.25 6:0.5 5:0.5 1:0.5 3:0.25 5:0.25 6:0.5 5:0.5 1:0.5 3:0.25 5:0.25 6:0.5 5:0.5 -:15" }
  ],
  melody: {
    play: "ledger_cello",
    octave: 3,
    words: "The station clock is honest",
    shape: "sinking",
    notes: "3:0.25 7:0.125 8:0.625 7:0.25 5+8:1 6:0.25 7:0.5 6:0.25 5:0.25 -:0.5 2:0.25 ~5:0.5 4:0.25 5/3/1:1 2:0.25 3:0.5 4:0.25 3:0.25 2:0.25 -:0.5 -1:0.25 2:0.5 1:0.25 1:0.75 -1:0.25 2:0.5 1:0.5",
    chords: { play: "radio_accordion", octave: 2, notes: "8+5:2 7+5:2 6+3:2 5+3:2 4+1:1 3+1:1 2:0.5 1:0.5" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  station_hall: { tone: "hall" },
  platform_end: {
    tone: "hum",
    lines: [
      { play: "tunnel_hum", octave: 2, notes: "1:8 1~2:4 2:4 -:8" }
    ]
  },
  cafe: {
    tone: "silence",
    colour: "radio",
    lines: [
      { play: "birdcage_wire", octave: 3, notes: "1:1 3+5:1 3+5:1 1:1 3+5:1 3+5:1 -:9" }
    ],
    melody: {
      play: "radio_accordion",
      octave: 4,
      words: "a radio playing the same waltz",
      shape: "arch",
      notes: "1:1 3:0.5 5:0.5 8:1 7:1.5 6:0.5 5:1 4:1 3:0.5 2:0.5 3:1 1:2 -:1"
    }
  },
  clock_shop: {
    tone: "silence",
    lines: [
      { play: "station_clock", octave: 5, notes: "1:0.75 1:0.75 1:0.75 1:0.75 -:4" },
      { play: "shop_clocks", octave: 5, notes: "-:11 5:1 3:1 4:1 1:2 -:17" }
    ]
  },
  chapel: { tone: "hall", lines: [] },
  pond: { tone: "water", colour: "clean" },
  compartment: { tone: "hum", colour: "through_wall" },
  dining_car: { tone: "hum", colour: "through_wall", lines: [] }
};
