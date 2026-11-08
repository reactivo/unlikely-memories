// The music of "Please Remain Present", shared by every language of the world (music has no words),
// written the way the AI writes it (BRIEF.md §7b, MUSIC.md §4): the world's part (the default export), which the world
// file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where the room
// is a different kind of place).
// Composed in the ninth run of the music bench (MUSIC.md §10) by the world's model, Claude Haiku 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/meridian.json from it.
//
// The theme is sung to: "Please remain present"
//
// The composer's notes (never shown to a player):
//   The modes are in, harmonic-minor and pentatonic-minor: far from home, the Authority's old-world politeness, and the
//   open, unresolved fog past the lobby glass. Gramophone comes first because the past keeps playing here and paper keeps
//   what the machines lose; radio and far_away are the other two ways the music could reach the player. The theme sings the
//   terminal's line 'Please remain present' on a low harmonium in a waltz: it asks twice, with a grace note before each
//   stressed word, a run and a melisma on 'main', a chord that rings on 'sent', and an arpeggio leap on the third asking.
//   Its slightly wrong thing is that the last phrase stops a beat short on 'pre-', with the lift cage's bass falling one
//   step at a time beneath it. The cable's figure keeps leaning on the second step and never settles on the root, the
//   radiator is the one rhythm line, ticking as though asked to wait, and the stair clock is the one chime, striking when
//   it is not right; Mrs Hale has her own short line in the Records Office, and the Registry, the cellar and the canteen
//   are quiet, clean or silent.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["in", "harmonic-minor", "pentatonic-minor"],
  tempo: 44,
  colour: ["gramophone", "radio", "far_away"],
  instruments: {
    stair_clock: { kind: "chime", ratio: 2.5, bright: 0.4, attack: 0, release: 4 },
    harmonium: { kind: "reed", ratio: 2, bright: 0.4, attack: 0.4, release: 1.2 },
    cable: { kind: "plucked", ratio: 3, bright: 0.7, attack: 0, release: 0.5 },
    radiator: { kind: "tick", ratio: 1, bright: 0.3, attack: 0.1, release: 0.1 },
    lift_cage: { kind: "bowed", ratio: 1.5, bright: 0.3, attack: 0.8, release: 1.5 },
    porter_bell: { kind: "struck", ratio: 3.5, bright: 0.5, attack: 0, release: 2.5 }
  },
  tone: "hum",
  lines: [
    { play: "cable", octave: 4, notes: "2:0.5 4:0.5 1:0.5 4:0.5 2:0.5 4:0.5 1:0.5 4:0.5 2:0.5 4:0.5 1:0.5 4:0.5 -:10" },
    { play: "radiator", octave: 3, notes: "1:0.5 -:1 1:0.5 -:2.5 1:0.5 -:3" },
    { play: "stair_clock", octave: 5, notes: "-:23 3:0.5 -:31" }
  ],
  melody: {
    play: "harmonium",
    octave: 3,
    words: "Please remain present",
    shape: "asked",
    notes: "6:0.125 5:1 3:0.5 4:0.25 5:0.25 6:0.25 5:0.25 3:0.5 1+5:1.5 -:0.5 8:0.125 6:1 4:0.5 5:0.25 6:0.25 5:0.25 3:0.5 2:1 -:0.5 1/3/5:1 6:0.5 5:0.5 4:0.25 5:0.25 4:0.25 3:1",
    chords: { play: "lift_cage", octave: 2, notes: "1+3:3.25 7+2:3.25 6+1:3.25 5+7:3.5" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  yard: { tone: "wind", colour: "through_wall", lines: [] },
  lobby: {
    tone: "fog",
    colour: "far_away",
    lines: [
      { play: "porter_bell", octave: 5, notes: "-:9 1:0.5 -:13 1:0.5 -:6" }
    ]
  },
  records: {
    tone: "hall",
    lines: [
      { play: "harmonium", octave: 4, notes: "5:0.5 3:0.5 4:0.5 2:1 -:9" }
    ]
  },
  cellar: { tone: "silence", colour: "underwater", lines: [] },
  canteen: { tone: "crowd", lines: [] },
  registry: { tone: "silence", colour: "clean", lines: [] }
};
