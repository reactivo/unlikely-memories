// The music of "The Dead Hour at Pylon Nine", shared by every language of the world (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/deadhour.json from it.
//
// The theme is sung to: "Every night the Chronometer strikes thirteen"
// A tune of its own: repairs, "A name works like a key"
//
// The composer's notes (never shown to a player):
//   Harmonic minor gives the brass city its old-world, faintly theatrical bureaucracy, with phrygian (dark, close) and 'in'
//   (hushed, far from home) as the same city heard more narrowly; the radio colour is the Exchange left on in an empty cab,
//   with gramophone and distance as other ways the past keeps playing. The theme's words are the first rule, 'Every night
//   the Chronometer strikes thirteen', sung on a repeated fifth like a hand standing still, with a grace note on each
//   stressed syllable, a descending melisma on 'thirteen', a rising arpeggio in the answer, a leap to the octave and a
//   chord on the last 'strikes', over a bell drone that leans on the second step. Its slightly wrong thing is that the
//   third phrase is a beat short and ends on the second step instead of coming home, as if the thirteenth had not quite
//   struck; the feel is a limp of threes and twos. The rhythm line is the skycab's fare meter ticking in a cycle of
//   thirteen beats for a fare nobody is paying, and the figure is the spring on string (the springs hung in Salter's shop)
//   circling 1-2-5-2 and leaning on the second step; the silent bell of the Chronometer sounds once in a long rest. Mrs
//   Salter's shop gets its own narrow little tune on 'A name works like a key', with different ticks like clocks that each
//   show another hour, the gear room is a low hum with a lone spring, and behind the face the bell finally rings twice, far
//   off.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["harmonic-minor", "phrygian", "in"],
  tempo: 42,
  colour: ["radio", "gramophone", "far_away"],
  instruments: {
    ear_trumpet: { kind: "reed", ratio: 2, bright: 0.45, attack: 0.12, release: 0.6 },
    spring_string: { kind: "plucked", ratio: 3, bright: 0.55, attack: 0, release: 1 },
    silent_bell: { kind: "struck", ratio: 3.5, bright: 0.4, attack: 0, release: 4 },
    fare_meter: { kind: "tick", ratio: 1, bright: 0.5, attack: 0, release: 0.15 }
  },
  tone: "hum",
  lines: [
    { play: "fare_meter", octave: 4, notes: "1:0.5 -:1.5 1:0.5 -:2.5 1:0.5 -:1.5 1:0.5 -:5.5" },
    { play: "spring_string", octave: 3, notes: "1:0.5 2:0.5 5:0.5 2:0.5 1:0.5 2:0.5 5:0.5 2:0.5 -:13" },
    { play: "silent_bell", octave: 3, notes: "-:26 1:1 -:2" }
  ],
  melody: {
    play: "ear_trumpet",
    octave: 4,
    words: "Every night the Chronometer strikes thirteen",
    shape: "repeated",
    notes: "5:0.5 5:0.25 5:0.5 -:0.25 5:0.25 6:0.125 5:0.125 5:0.5 -:0.25 6:0.125 5:0.5 4:0.25 3:0.25 2:1 6:0.5 6:0.25 6:0.5 -:0.25 6:0.25 7/6/5:0.5 -:0.25 8:0.125 6:0.5 4:1.5 5:0.5 5:0.25 5:0.5 -:0.25 5:0.25 4:0.125 3:0.125 1+5:0.75 2:0.5",
    chords: { play: "silent_bell", octave: 3, notes: "1+5:5 1+5:4 2+5:4" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  market: { tone: "crowd" },
  repairs: {
    tone: "silence",
    lines: [
      { play: "fare_meter", octave: 5, notes: "1:0.5 -:2.5 1:0.5 -:4.5 1:0.5 -:1.5 1:0.5 -:6.5" }
    ],
    melody: {
      play: "spring_string",
      octave: 4,
      words: "A name works like a key",
      shape: "narrow",
      notes: "3:0.5 3:0.25 4:0.25 3:0.5 2:0.5 3:1 -:0.5 5:0.125 4:0.5 3:0.25 4:0.25 5:0.5 4:0.25 3:0.25 1/2/3:0.5 2:0.5 1+3:1"
    }
  },
  gears: {
    tone: "hum",
    lines: [
      { play: "spring_string", octave: 2, notes: "1:0.5 -:3.5 5:0.5 -:6.5 2:0.5 -:5" }
    ]
  },
  face: {
    tone: "hall",
    colour: "far_away",
    lines: [
      { play: "silent_bell", octave: 3, notes: "-:20 1:1 -:12 1:1 -:7" }
    ]
  }
};
