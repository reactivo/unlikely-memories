// The music of "Coat 41", written the way the AI writes it (BRIEF.md §7b): the world's part (the default export), which
// world.en.js adds as one `add music`, and `rooms`, each room's own part, which becomes that room's `music`.
//
// The theme is sung to: "Press, and somewhere a thing is done."
// A tune of its own: none.
//
// The composer's notes (never shown to a player):
//   Dorian for an office that is polite and a little sad, pentatonic minor for its plainness, whole-tone if the lift is
//   taken seriously; the music comes through a wall, from the next office, or from a radio left on after hours. The
//   instruments are the building's own: a service bell on the desk (struck, high and rare), the wire that runs from every
//   button to wherever it does its thing (plucked, the theme's voice), a switch that clicks (the one rhythm line, a tick
//   that is never quite regular), and in the engine room a drone of the boiler, the one held line, heard only there. The
//   theme is the world's first rule, "Press, and somewhere a thing is done", sung twice the same way as a plain question
//   (the stress on "some-" and "thing"), the third time lifted, with a grace note before "some", a run down on "thing", an
//   arpeggio and a chord on "done". It is a limping three-and-two feel. Its slightly wrong thing: the last "done" never
//   gets its root; the tune stops on the second step and a chord, as if the thing were done somewhere else. The chords
//   underneath rock between the home chord and its neighbour a step above, and never settle either.

export default {
  mode: ["dorian", "pentatonic-minor", "whole-tone"],
  tempo: 60,
  colour: ["through_wall", "radio", "gramophone"],
  instruments: {
    service_bell: { kind: "struck", ratio: 3.5, bright: 0.5, attack: 0, release: 3 },
    button_wire: { kind: "plucked", ratio: 2, bright: 0.5, attack: 0, release: 1 },
    switch_click: { kind: "tick", ratio: 1, bright: 0.4, attack: 0, release: 0.2 },
    boiler: { kind: "reed", ratio: 1, bright: 0.3, attack: 1.2, release: 1.5 }
  },
  tone: "hum",
  lines: [
    { play: "switch_click", octave: 3, notes: "1:0.5 -:5 1:0.5 -:3 1:0.5 -:8" },
    { play: "button_wire", octave: 3, notes: "1:1 -:2 3:1 -:6 2:1 -:9" },
    { play: "service_bell", octave: 5, notes: "-:25 5:1 -:30" }
  ],
  melody: {
    play: "button_wire",
    octave: 4,
    words: "Press, and somewhere a thing is done.",
    shape: "asked",
    notes: "5:1 5:0.5 6:0.5 5:1 3:0.5 3:0.5 2:1 1:2 5:1 5:0.5 6:0.5 5:1 3:0.5 3:0.5 2:1 4:2 5:1 5:0.5 6:0.125 8:1 6:0.5 5:0.25 4:0.25 3:0.25 3/4/5:1 2:1 2+5:1.5",
    chords: { play: "boiler", octave: 3, notes: "1+5:7 2+4:7 1+5:7" }
  }
};

// ---- Each room's own part (its music) ---------------------------------------------------------------------------------
export const rooms = {
  lift_car: { tone: "silence", lines: [{ play: "service_bell", octave: 5, notes: "-:20 1:1 -:30" }] },
  canteen: { tone: "fog", lines: [{ play: "button_wire", octave: 4, notes: "5:1 -:3 3:1 -:11" }] },
  engine: { tone: "hum", lines: [{ play: "boiler", octave: 2, notes: "1:6 -:10" }, { play: "switch_click", octave: 3, notes: "1:0.5 -:7.5" }] }
};
