// The music of "The River Turns at Noon" (world.en.js), written the way the AI writes it (BRIEF.md §7b only): the world's part (the
// default export), which the world file adds as one `add music`; and `rooms`, each room's own part, which becomes that room's
// `music` (only where the room is a different kind of place).
// Composed by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's tools/music/worlds/noon.json from it.
//
// The theme is sung to: "The river turns at noon"
// A tune of its own: Ennu's count, in the village, five notes on a tally cord ("the shell is counted").
//
// The composer's notes (never shown to a player):
//   The `in` mode is the music of someone far from home, which an explorer is on a river with nowhere to be but noon; dorian for
//   the river's own warmth (a wistful tune that is not sad about it) and lydian for a stream that runs uphill. The sound reaches
//   you from far away, or under the water the river is, or through the wall of a village that is going about its business and
//   not performing for the guest. Four instruments, all from the valley: a cane flute (blown: it carries the theme), a plucked
//   tally cord (the village's accounts, struck like a string), a log drum (the one rhythm line, a slow knock on the beat of a
//   walk), and the temple's gold bell (struck, heard only in its chamber). The theme sings the title as a slow limp, low in the
//   third octave: "The riv-er turns at noon" rises, comes round again higher with a quick run down on "turns" and a chord left
//   ringing on "noon", and the third time sings only "The river turns at" and stops, with two beats of rest where "noon" should
//   be; the bell has no tongue, and that word is the one place the tune keeps quiet. Under it the tally cord falls a step at a
//   time, like water coming down the valley, and the figure on the cord keeps its broken chord going between visits and leaves
//   off the last note of its third round. In the village the world's music is Ennu's count: five notes on the cord, the same
//   five every time, over the log drum; the village is heard through its own wall. In the bell chamber the bell almost sounds: a
//   grace note of an eighth of a beat, once in a long while, over the cave's drip, and nothing after it.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["in", "dorian", "lydian"],
  tempo: 44,
  colour: ["far_away", "underwater", "through_wall"],
  instruments: {
    cane_flute: { kind: "blown", ratio: 1, bright: 0.3, attack: 0.12, release: 0.6 },
    tally_cord: { kind: "plucked", ratio: 2, bright: 0.4, attack: 0, release: 0.7 },
    log_drum: { kind: "knock", ratio: 1, bright: 0.15, attack: 0, release: 0.3 },
    noon_bell: { kind: "struck", ratio: 3.5, bright: 0.45, attack: 0, release: 4 }
  },
  tone: "water",
  lines: [
    { play: "log_drum", octave: 2, notes: "1:0.5 1:0.5 -:3 1:0.5 -:5.5" },
    { play: "tally_cord", octave: 3, notes: "1:0.5 3:0.5 5:0.5 3:0.5 1:0.5 3:0.5 5:0.5 3:0.5 1:0.5 3:0.5 5:0.5 -:0.5 -:12" },
    { play: "cane_flute", octave: 4, notes: "-:9 6:1 5:0.5 3:1.5 -:14" }
  ],
  melody: {
    play: "cane_flute",
    octave: 3,
    words: "The river turns at noon",
    shape: "wave",
    notes: "1:0.25 3:1 2:0.5 5:1 4:0.25 3:1.5 3:0.25 5:0.75 4:0.5 6:1 5:0.25 8:0.5 7:0.25 6:0.25 5+8:1.5 5:0.25 6:0.125 5:0.5 3:0.5 4:1 3:0.25 2:0.25 -:2",
    chords: { play: "tally_cord", octave: 2, notes: "8:2.625 7:2 6:2 5:2 4:2 3:2 2:2" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  village: {
    tone: "fire",
    colour: "through_wall",
    lines: [
      { play: "tally_cord", octave: 3, notes: "5:1 5:1 3:1 5:1 2:2 -:11" },
      { play: "log_drum", octave: 2, notes: "1:1 -:3 1:0.5 1:0.5 -:5" }
    ]
  },
  chamber: {
    tone: "cave",
    lines: [
      { play: "noon_bell", octave: 5, notes: "5:0.125 -:59.875" }
    ]
  }
};
