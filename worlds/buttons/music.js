// The music of "The Button Exchange", written the way the AI writes it (BRIEF.md §7b): the world's part (the default export),
// which world.en.js adds as one `add music`; and `rooms`, each room's own part, which becomes that room's `music` (only where
// the room is a different kind of place).
// Composed by Claude Sonnet 5.5 in the world-F build run (new-world skill), from BRIEF.md §7b alone.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's copy of it.
//
// The theme is sung to: "A button for a button, and the change in buttons."
// A tune of its own: the sorting room, "Came off at a goodbye."
//
// The composer's notes (never shown to a player):
//   The Exchange is a market hall that does its trading by tally and by rule, so its music is a clerk's: Mr Tally whistles
//   through his teeth, high up in the fifth octave, a little too bright, as a man whistles who has nothing to whistle about and a
//   good many figures to keep. Lydian is the first mode because its raised fourth is the floating note of a count that never
//   quite closes; dorian for the wistful warm side (a lost thing kept kindly); pentatonic-major for a plain hall without a semitone
//   to its name. It is heard as from a music box (everything high, small and plucked, like the mechanism of a button
//   drawer), or through the wall of the next room, or from across the street. The theme sings the Exchange's own rule, "A button
//   for a button, and the change in buttons", on one repeated note (a clerk's tally, one for one), the second phrase turning with a
//   grace note and a chord that rings on "change", and the answer a step higher with an arpeggio on its last "button". Its
//   slightly wrong thing is that the last phrase stops after "the change in", a beat short and with no buttons given: the change
//   never comes. Underneath, a plucked thread (the thread_string) falls by whole bars, one step at a time. The lines are the
//   hall's small sounds, all mostly rests: a thimble tapping time (the one rhythm line), a thread's figure that leans on the
//   second step and never settles, and a button dropped on a saucer now and then. Only three rooms differ: the sorting room,
//   where six old women hum half a tune and the others finish it a beat behind ("Came off at a goodbye", falling); the
//   switchboard, with its one held hum, the world's single drone, heard through the wall of the drawers; and the back yard,
//   in grey fog and far away, where one thread note falls, like a drip, off a cuff.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["lydian", "dorian", "pentatonic-major"],
  tempo: 68,
  colour: ["music_box", "through_wall", "far_away"],
  instruments: {
    tally_whistle: { kind: "blown", ratio: 1, bright: 0.3, attack: 0.1, release: 0.5 },
    thread_string: { kind: "plucked", ratio: 2, bright: 0.5, attack: 0, release: 0.9 },
    saucer_buttons: { kind: "struck", ratio: 5, bright: 0.6, attack: 0, release: 1.2 },
    thimble_tap: { kind: "tick", ratio: 1, bright: 0.4, attack: 0, release: 0.15 },
    sorters_hum: { kind: "bowed", ratio: 1.5, bright: 0.2, attack: 0.4, release: 1.5 },
    switch_hum: { kind: "reed", ratio: 1, bright: 0.3, attack: 1.2, release: 1 }
  },
  tone: "hall",
  lines: [
    { play: "thimble_tap", octave: 4, notes: "1:0.5 1:0.5 1:0.5 -:6.5" },
    { play: "thread_string", octave: 3, notes: "1:0.5 3:0.5 5:0.5 3:0.5 2:0.5 3:0.5 5:0.5 3:0.5 -:11" },
    { play: "saucer_buttons", octave: 5, notes: "-:13 8:0.5 8:0.5 -:3 5:0.5 -:17" }
  ],
  melody: {
    play: "tally_whistle",
    octave: 5,
    words: "A button for a button, and the change in buttons.",
    shape: "repeated",
    notes: "5:0.5 5:0.5 5:1 5:0.5 5:0.5 5:0.5 5:1 5:0.5 5:0.5 6:0.125 5+7:1 5:0.5 4:0.5 3:1.5 6:0.5 6:0.5 6:1 6:0.5 6:0.5 6:0.5 1/3/5:1 6:0.5 6:0.5 7:0.125 6:1 6:0.5",
    chords: { play: "thread_string", octave: 2, notes: "8:4 7:4 6:4 5:4.25" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  sorting: {
    tone: "silence",
    lines: [
      { play: "saucer_buttons", octave: 5, notes: "-:7 1:0.5 1:0.5 1:0.5 1:0.5 1:0.5 1:0.5 -:9" },
      { play: "sorters_hum", octave: 3, notes: "-:9 3:1 -:15" }
    ],
    melody: {
      play: "sorters_hum",
      octave: 3,
      words: "Came off at a goodbye.",
      shape: "falling",
      notes: "5:1 5:0.5 4:0.5 3:1 2:0.5 3:0.5 1:2"
    }
  },
  switchroom: {
    tone: "hum",
    colour: "through_wall",
    lines: [
      { play: "switch_hum", octave: 2, notes: "1:8 -:3 1:8 -:5 2:4 -:6" },
      { play: "thimble_tap", octave: 5, notes: "1:0.5 -:2.5 1:0.5 -:5" }
    ]
  },
  backyard: {
    tone: "fog",
    colour: "far_away",
    lines: [
      { play: "thread_string", octave: 3, notes: "5:1 3:1 -:11 5:1 -:19" }
    ]
  }
};
