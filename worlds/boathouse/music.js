// The music of "The Lake Lights It Again", shared by world.en.js (music has no words), written the way the AI writes it
// (BRIEF.md §7b): the world's part (the default export), which the world file adds as one `add music`; and `rooms`, each
// room's own part, which becomes that room's `music` (only where the room is a different kind of place).
// Composed by the world's model, Claude Sonnet 5.5, from BRIEF.md §7b alone.
// This file is the source: `node tools/music/collect.mjs --worlds` rebuilds the bench's copy from it.
//
// The theme is sung to: "The lake lights again, a little late."
// A tune of its own: the empty chair at the Heron, three notes, "3:1 2:0.5 1:1.5", sighed when nobody sits.
//
// The composer's notes (never shown to a player):
//   Dorian for a village that is wistful but warm and keeps a missing man's hours; lydian for a lake that shows a street
//   where there is none; the "in" mode for the hushed far-from-home of a place that is waiting. The music reaches you across
//   water (far_away), or from under it (underwater, where the village stands upside down), or through a wall, the inn's
//   life going on next door to yours. Tempo 42, a night watch, a waiting room: the village is not hurrying.
//   Instruments, each a thing in the world: the bottle (blown), because the voice in the bottle is the world's hints and
//   because it can sing: it carries the theme; the net harp (plucked), a harp strung like the nets on the quay rack, for the
//   figure that keeps moving; the chapel bell (struck), which rings on the lake before it rings in the churchyard; the
//   oarlock (knock), the one rhythm line, two knocks and a third a little late, for a boat you cannot see. No held line.
//   The theme sings the world's first rule, "The lake lights again, a little late": the question "The lake lights again" asked
//   twice, and the second time an octave too low, the way a reflection answers; the third time is different, with a run on
//   "little" and a chord on "late" that rings. That octave-too-low answer is its one slightly wrong thing. A waltz, in threes
//   of half-beats, over the home chord and its neighbour rocking, the second chord leaning where the water leans. The inn's
//   tune is Teodor's chair: three notes sighed under the fire, behind the wall.

// ---- The world's part (add music) -------------------------------------------------------------------------------------
export default {
  mode: ["dorian", "lydian", "in"],
  tempo: 42,
  colour: ["far_away", "underwater", "through_wall"],
  instruments: {
    bottle:       { kind: "blown",   ratio: 1.5, bright: 0.35, attack: 0.15, release: 1 },
    net_harp:     { kind: "plucked", ratio: 1.5, bright: 0.45, attack: 0,    release: 1.6 },
    chapel_bell:  { kind: "struck",  ratio: 3.5, bright: 0.45, attack: 0,    release: 4 },
    oarlock:      { kind: "knock",   ratio: 1,   bright: 0.3,  attack: 0,    release: 0.2 }
  },
  tone: "water",
  lines: [
    // the net harp's figure: a broken chord said twice, then leaning on the second step, then a long rest
    { play: "net_harp", octave: 3, notes: "1:0.5 3:0.5 5:0.5 3:0.5 1:0.5 3:0.5 5:0.5 3:0.5 2:0.5 4:0.5 6:0.5 4:0.5 -:14" },
    // the oarlock: two knocks, and a third a little late
    { play: "oarlock", octave: 3, notes: "1:0.5 1:0.5 -:3 1:0.5 -:13" },
    // the chapel bell, high and far off, twice in a long quiet
    { play: "chapel_bell", octave: 5, notes: "-:23 1:1 -:9 5:1 -:6" }
  ],
  melody: { play: "bottle", octave: 4, words: "The lake lights again, a little late", shape: "asked",
    notes: "5:0.5 6:1 6:0.125 8:0.5 7:0.5 6:0.25 5:0.25 6:1 " +
           "-3:0.5 -2:1 -2:0.125 1:0.5 -1:0.5 -2:0.25 -3:0.25 -2:1 " +
           "5:0.5 6:0.5 8:0.5 7:0.25 6:0.25 5:0.25 6:0.25 -:0.5 3:0.5 1+5:2",
    chords: { play: "net_harp", octave: 3, notes: "1+3+5:4 2+4+6:4 1+3+5:4 2+4+6:2" } }
};

// ---- Each room's own part (a room's `music`) --------------------------------------------------------------------------
export const rooms = {
  // the funicular car: dripping brick, a long echo, one bell far below
  car: { tone: "cave", lines: [{ play: "chapel_bell", octave: 5, notes: "-:20 1:1 -:30" }] },
  // the boathouse: a big room of wood and water, only the oarlock knocking in it
  boathouse: { tone: "hall", lines: [{ play: "oarlock", octave: 3, notes: "1:0.5 1:0.5 -:3 1:0.5 -:9" }] },
  // the Heron: the fire, the living room next door, and the empty chair's three notes
  inn: { tone: "fire", colour: "through_wall",
    lines: [{ play: "net_harp", octave: 3, notes: "-:11 3:1 2:0.5 1:1.5 -:20" }] },
  // the churchyard: wind, and the bell, which rings on the lake first
  churchyard: { tone: "wind", lines: [{ play: "chapel_bell", octave: 5, notes: "-:9 1:1 -:25" }, { play: "net_harp", octave: 4, notes: "-:16 5:0.5 3:0.5 1:1 -:18" }] }
};
