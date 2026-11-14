// The music of "A Light for the Galerie Aubry", written the way the AI writes it (BRIEF.md §7b): the world's part (the default export),
// which the world file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music`.
// Composed by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b.
//
// The theme is sung to: "Light the Phare once, and let the picture say when." (the ledger's line)
//
// The composer's notes (never shown to a player):
//   Dorian for a caper that is wry rather than sad, harmonic minor for the old-Paris theatre of a bell-wired gallery and
//   mixolydian for the easy walk of a crew that has done this before; heard on an old record, or as a radio between stations,
//   or through a wall, because the Galerie is somebody else's house. The bell-wire is a plucked figure that counts its own
//   steps, the watch-clock is the world's one rhythm line (Gaspard's rounds, four ticks and a long rest), the speaking horn is a
//   reed that murmurs one long step now and then like Madame Lenoir, and the lens's glass rings chime once, very high, a long
//   way apart. The theme is the ledger's line on the horn, in a limp of threes and twos, arching up to the root an octave
//   above on "Phare", a grace note before "pic-", a chord ringing on "when", sung twice, the second time higher; its slightly
//   wrong thing is that it stops in the middle of the third phrase, one beat short, like a frame that will not come off its
//   hook, over a chime that moves between the root chord and the one above. Four rooms differ: the cellar in its cave tone, the
//   boiler room with a fire's crackle and no lines, the lens room almost silent with only the glass chime, and the roof with wind.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["dorian", "harmonic-minor", "mixolydian"],
  tempo: 64,
  colour: ["gramophone", "radio", "through_wall"],
  instruments: {
    bell_wire:   { kind: "plucked", ratio: 2,   bright: 0.6, attack: 0,   release: 0.9 },
    speaking_horn: { kind: "reed",  ratio: 2,   bright: 0.4, attack: 0.1, release: 0.5 },
    lens_ring:   { kind: "chime",   ratio: 3.5, bright: 0.5, attack: 0,   release: 4 },
    watch_clock: { kind: "tick",    ratio: 1,   bright: 0.4, attack: 0,   release: 0.2 }
  },
  tone: "hall",
  lines: [
    { play: "watch_clock", octave: 3, notes: "1:1 -:1 1:1 -:1 1:1 -:1 1:1 -:5" },
    { play: "bell_wire", octave: 3, notes: "1:0.5 5:0.5 3:0.5 5:0.5 1:0.5 5:0.5 3:0.5 5:0.5 -:11" },
    { play: "speaking_horn", octave: 3, notes: "-:13 2:2 1:1 -:19" },
    { play: "lens_ring", octave: 5, notes: "-:26 8:1 -:11" }
  ],
  melody: {
    play: "speaking_horn", octave: 4, words: "Light the Phare once, and let the picture say when.", shape: "arch",
    notes: "3:0.5 5:0.5 8:1 7:0.5 8:0.5 5:2 6:0.125 5:0.5 3:1 5:0.5 6:0.5 5:1 3:0.5 2:0.5 3:1 5:0.5 3:0.5 1+5:2 5:0.5 7:0.5 8:1 8:0.5 7:0.5 6:1 5:1.5 3:0.5 5:0.5 6:1",
    chords: { play: "lens_ring", octave: 3, notes: "1+5:4 4+6:4 1+5:4 2+4:4 1+5:5" }
  }
};

// ---- Each room's own part (music: on the room) ------------------------------------------------------------------------
export const rooms = {
  cellar: { tone: "cave", lines: [{ play: "bell_wire", octave: 2, notes: "1:0.5 5:0.5 1:0.5 -:13" }] },
  boiler: { tone: "fire", lines: [] },
  lens_room: { tone: "silence", lines: [{ play: "lens_ring", octave: 5, notes: "-:18 1:1 5:1 -:25" }] },
  roof: { tone: "wind", lines: [{ play: "speaking_horn", octave: 3, notes: "-:9 3:2 2:1 -:14" }] }
};
