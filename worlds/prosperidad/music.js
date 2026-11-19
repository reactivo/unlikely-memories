// The music of Prosperidad: a tired guitar and an accordion, the sprocket of a projector under them,
// and a gavel for the auction. Heard as a pirate radio late at night, or through a wall.

export default {
  mode: ["phrygian", "dorian", "harmonic-minor"],
  tempo: 66,
  colour: ["radio", "through_wall", "gramophone"],
  instruments: {
    guitarra: { kind: "plucked", ratio: 2, bright: 0.45, attack: 0, release: 0.9 },
    acordeon: { kind: "reed", ratio: 2, bright: 0.4, attack: 0.12, release: 0.6 },
    proyector: { kind: "clack", ratio: 1, bright: 0.35, attack: 0, release: 0.15 },
    martillo: { kind: "struck", ratio: 1, bright: 0.3, attack: 0, release: 1.4 },
  },
  tone: "hum",
  lines: [
    { play: "proyector", octave: 3, notes: "1:0.5 1:0.5 -:4 1:0.5 1:0.5 1:0.5 -:5" },
    { play: "guitarra", octave: 3, notes: "1:0.5 5:0.5 2:0.5 5:0.5 1:0.5 5:0.5 2:0.5 5:0.5 1:0.5 5:0.5 2:0.5 -:11.5" },
    { play: "acordeon", octave: 4, notes: "-:10 3:1 2:1 1:2 -:12" },
  ],
  melody: {
    play: "guitarra",
    octave: 4,
    words: "Everyone owes somebody",
    shape: "repeated",
    notes:
      "5:1 5:0.5 5:1 5:0.5 5:1 6:0.5 5:0.5 3:2 " +
      "6:1 6:0.5 5/6/8:1 6:0.5 7:0.125 8:1 7:0.5 6:0.5 5:2 " +
      "5:1 5:0.5 5:1 4:0.5 3:0.5 2:0.5 3:1",
    chords: { play: "acordeon", octave: 3, notes: "1+5:7 2+4+6:7 1+5:5.125" },
  },
};

export const rooms = {
  flat: {
    tone: "silence",
    lines: [
      { play: "guitarra", octave: 3, notes: "1:0.5 5:0.5 2:0.5 5:0.5 -:14" },
      { play: "acordeon", octave: 3, notes: "-:11 2:1 1:2 -:9" },
    ],
  },
  bar: {
    tone: "crowd",
    lines: [
      { play: "guitarra", octave: 3, notes: "1:0.5 5:0.5 2:0.5 5:0.5 1:0.5 5:0.5 2:0.5 -:9.5" },
      { play: "proyector", octave: 3, notes: "1:0.5 -:6 1:0.5 -:3.5" },
    ],
  },
  plaza: {
    tone: "wind",
    lines: [{ play: "acordeon", octave: 3, notes: "-:16 2:1 1:2 -:21" }],
  },
  pharm: {
    tone: "hum",
    lines: [],
  },
  stalls: {
    tone: "crowd",
    colour: "gramophone",
    lines: [
      { play: "proyector", octave: 3, notes: "1:0.5 1:0.5 1:0.5 -:2.5 1:0.5 -:3" },
      { play: "guitarra", octave: 3, notes: "1:0.5 5:0.5 2:0.5 5:0.5 1:0.5 5:0.5 2:0.5 5:0.5 -:10" },
      { play: "martillo", octave: 2, notes: "-:22 1:0.5 -:17" },
    ],
  },
  booth: {
    tone: "hum",
    colour: "through_wall",
    lines: [
      { play: "proyector", octave: 3, notes: "1:0.5 1:0.5 -:2 1:0.5 1:0.5 1:0.5 -:3" },
      { play: "acordeon", octave: 4, notes: "-:6 3:1 2:0.5 1:1.5 -:9" },
    ],
  },
};
