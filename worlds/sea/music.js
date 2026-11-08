// The music of "The Sea Is a Rumour", shared by world.en.js and world.es.js (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Opus 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/sea.json from it.
//
// The theme is sung to: "The sea gives things back, slowly."
// A tune of its own: carousel, "The horses rise and fall."
//
// The composer's notes (never shown to a player):
//   Mixolydian is the seaside Sunday's easy bandstand air, lydian the floating Sunday whose clocks never move, and
//   pentatonic-minor the sea itself, open and never quite answering; the music reaches you from across the water first,
//   then from under it, or from the radio in the dunes that plays a song that ended years ago. The theme sings the town's
//   own rule, "The sea gives things back, slowly", as a low palm-court waltz on that radio's voice (dune_radio), three
//   times and each time lower: the first with a grace note and a ringing chord on "sea", the second with an arpeggio on it,
//   a quick three-note melisma on every "slow-", while the sea under the pier (sea_swell) walks a bass line down the scale
//   one bar at a time, like the tide going out. The slightly wrong thing is that the third time, after "back", "slowly"
//   arrives one beat late, the way the cave says things back a moment late, and nobody minds. The quiet figure is the
//   carousel's music box (carousel_comb) folding the same broken chord three times, a little differently each time, like
//   the café waiter's napkin, and the rhythm line is the surf breathing on the sand, in and out, the same breath that comes
//   under the green door at the Ministry; the carousel alone gets a tune of its own, "The horses rise and fall", a
//   fairground waltz written too slowly. The desk bell of the Miramar is rung for nobody, the dining room's cutlery chimes
//   through the double doors, and the café's coffee machine sighs; the post office has only its rain.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["mixolydian", "lydian", "pentatonic-minor"],
  tempo: 62,
  colour: ["far_away", "underwater", "radio"],
  instruments: {
    dune_radio: { kind: "bowed", ratio: 1.5, bright: 0.3, attack: 0.25, release: 1.2 },
    carousel_comb: { kind: "plucked", ratio: 5, bright: 0.55, attack: 0, release: 1.4 },
    sea_swell: { kind: "blown", ratio: 1, bright: 0.1, attack: 0.8, release: 2.5 },
    surf: { kind: "brush", ratio: 1, bright: 0.2, attack: 0.6, release: 1.5 },
    desk_bell: { kind: "struck", ratio: 3.5, bright: 0.65, attack: 0, release: 2.5 },
    cutlery: { kind: "chime", ratio: 7, bright: 0.6, attack: 0, release: 1.2 },
    coffee_machine: { kind: "brush", ratio: 1, bright: 0.35, attack: 0.3, release: 1 }
  },
  tone: "water",
  lines: [
    { play: "surf", octave: 3, notes: "1:0.5 -:1.5 1:1 -:10" },
    { play: "carousel_comb", octave: 4, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 4:0.5 5:0.5 1:0.5 6:0.5 3:0.5 5:0.5 -:16" }
  ],
  melody: {
    play: "dune_radio",
    octave: 3,
    words: "The sea gives things back, slowly.",
    shape: "sinking",
    notes: "5:0.5 7:0.125 5+8:1.375 7:0.5 6:1 5:1 6:0.25 5:0.25 4:0.5 5:0.5 3:0.5 1/3/5:1.5 4:0.5 3:1 2:1 3:0.25 2:0.25 1:0.5 2:0.5 1:0.5 2:1.5 1:0.5 -1:1 1:1 -:1 2:0.25 1:0.25 -1:0.5 1:1.5",
    chords: { play: "sea_swell", octave: 2, notes: "-:0.5 8:3 7:3 6:3 5:3 4:3 3:1.5 2:1.5 1:1.5" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  corridor: {
    tone: "hum",
    colour: "through_wall",
    lines: [
      { play: "surf", octave: 2, notes: "1:0.5 -:2 1:1 -:13.5" }
    ]
  },
  cave: {
    tone: "cave",
    lines: [
      { play: "carousel_comb", octave: 4, notes: "5:0.5 6:0.5 5:1 -:1.5 2:0.5 3:0.5 2:1 -:14" }
    ]
  },
  dunes: {
    tone: "fog",
    colour: "radio",
    lines: [
      { play: "dune_radio", octave: 3, notes: "3:0.5 2:0.5 1:2 -:4 2:0.5 1:2 -:7 1:2 -:12" }
    ]
  },
  carousel: {
    tone: "hum",
    colour: "music_box",
    lines: [
      { play: "carousel_comb", octave: 5, notes: "3:1 5:2 3:1 6:2 -:14" }
    ],
    melody: {
      play: "carousel_comb",
      octave: 5,
      words: "The horses rise and fall.",
      shape: "wave",
      notes: "3:1 5:2 3:1 6:0.125 8:0.875 7:0.5 6:0.5 5+8:1.5 -:1.5 3:1 5:2 3:1 6:1 5:0.5 4:0.5 1/3/5:3"
    }
  },
  lobby: {
    tone: "hall",
    lines: [
      { play: "desk_bell", octave: 5, notes: "-:12 8:1 -:23" },
      { play: "cutlery", octave: 5, notes: "-:5 8:0.25 6:0.25 -:3 7:0.25 -:18" }
    ]
  },
  dining: {
    tone: "crowd",
    colour: "gramophone",
    lines: [
      { play: "cutlery", octave: 5, notes: "8:0.25 6:0.25 -:7 5:0.25 -:11" },
      { play: "carousel_comb", octave: 4, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 4:0.5 5:0.5 1:0.5 6:0.5 3:0.5 5:0.5 -:16" }
    ]
  },
  cafe: {
    tone: "silence",
    lines: [
      { play: "coffee_machine", octave: 3, notes: "1:1.5 -:11" },
      { play: "carousel_comb", octave: 4, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 4:0.5 5:0.5 1:0.5 6:0.5 3:0.5 5:0.5 -:16" }
    ]
  },
  post_office: { tone: "rain", lines: [] }
};
