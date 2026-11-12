// The music of "The Button Hall", written the way the AI writes it (BRIEF.md §7b): the world's part (the default export), which
// the world file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the
// room is a different kind of place).
// Composed by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b alone.
//
// The theme is sung to: "A pressed button is always answered."
// A tune of its own: crossing, "Red as long as the street."
//
// The composer's notes (never shown to a player):
//   The Hall sounds like somebody else's evening heard through a wall: dorian, wistful but warm, at a clerk's pace of fifty-two,
//   with a pentatonic-minor second choice (open, unresolved, a wait that never ends) and lydian third (floating, for a town where
//   every bell is answered by someone else). Through a wall first, then a radio left on in the next office, then a music box for
//   a place run on small brass mechanisms. The doorbell is the one struck bell, rung far off in the town and answered a step
//   higher a long time after; the bell wire is the plucked wire that runs under the road from every button to its bell, and it
//   carries both a quiet figure that counts a broken chord twice and rests, and the theme; the relay is the one rhythm line, a
//   thumb coming off a button, two clicks then one. The theme sings the second rule, "A pressed button is always answered", as
//   the same short question three times (a pressed button?) with a grace note leaning on "pressed", the third time answered, a
//   run down on "always", a chord ringing on "answered" and a scoop up into it; its slightly wrong thing is that the answer
//   never comes home, it ends on the step below the root. Under it two chords rock, the home chord and the one with the
//   second step. Only four rooms differ: the lamp room, where the relay ticks faster for a hundred lamps and a doorbell is
//   answered a step up; the battery cellar, low and dull, far away under the floor, with the hum; the gallery, high up in the
//   wind of its window; and Mill Street, where a crowd waits with a whistler among it who has the one tune of its own,
//   "Red as long as the street", on a narrow few notes that never leave the kerb.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["dorian", "pentatonic-minor", "lydian"],
  tempo: 52,
  colour: ["through_wall", "radio", "music_box"],
  instruments: {
    doorbell: { kind: "struck", ratio: 3.5, bright: 0.45, attack: 0, release: 2.5 },
    bell_wire: { kind: "plucked", ratio: 2, bright: 0.5, attack: 0, release: 1.1 },
    relay: { kind: "tick", ratio: 1, bright: 0.5, attack: 0, release: 0.1 },
    waiting_whistle: { kind: "blown", ratio: 1, bright: 0.25, attack: 0.12, release: 0.6 }
  },
  tone: "hall",
  lines: [
    { play: "relay", octave: 3, notes: "1:0.25 1:0.25 -:7.5 1:0.25 -:12" },
    { play: "bell_wire", octave: 3, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 3:0.5 5:0.5 -:13" },
    { play: "doorbell", octave: 5, notes: "-:14 5:1 -:6 8:1 -:23" }
  ],
  melody: {
    play: "bell_wire",
    octave: 4,
    words: "A pressed button is always answered.",
    shape: "asked",
    notes: "6:0.125 5:1 5:0.5 3:0.5 4:1.5 6:0.125 5:1 5:0.5 3:0.5 4:1.5 6:0.125 5:1 5:0.5 3:0.5 5:0.5 6:0.5 8:1.5 7:0.5 6:0.5 5:0.5 3:0.5 ~2:1 1+5:1.5 -1:1",
    chords: { play: "doorbell", octave: 3, notes: "1+5:4 1+5:4 2+5:4 1+5:5" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  lamproom: {
    tone: "hum",
    lines: [
      { play: "relay", octave: 4, notes: "1:0.25 1:0.25 1:0.25 1:0.25 -:4 1:0.25 1:0.25 -:9" },
      { play: "doorbell", octave: 5, notes: "-:9 5:1 -:7 6:1 -:17" }
    ]
  },
  gallery: {
    tone: "wind",
    lines: [
      { play: "bell_wire", octave: 5, notes: "-:10 8:0.5 5:0.5 3:1 -:20" }
    ]
  },
  cellar: {
    tone: "hum",
    colour: "far_away",
    lines: [
      { play: "bell_wire", octave: 2, notes: "1:1 -:5 2:1 -:9" }
    ]
  },
  crossing: {
    tone: "crowd",
    lines: [
      { play: "doorbell", octave: 4, notes: "-:24 3:1 -:30" }
    ],
    melody: {
      play: "waiting_whistle",
      octave: 4,
      words: "Red as long as the street",
      shape: "narrow",
      notes: "3:0.5 4:0.5 5:1 5:0.5 4:0.5 3:1 4:0.125 5:0.375 4:0.5 3:1.5 -:1 3:0.5 4:0.5 5:1 4:0.5 3:0.5 3:2"
    }
  }
};
