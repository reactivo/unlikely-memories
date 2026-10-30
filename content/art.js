// The art spec (ART-DIRECTION.md §7): the picture size, the 16 EGA colours, the dither, the drawing format, and the
// picture effects. Everything visual about pictures that might be tuned lives here, in one place.

export default {
  picture: { width: 320, height: 136, ratio: "40:17" },
  sprite: { width: 16, height: 16, transparent: true },
  palette: {
    name: "EGA",
    colors: ["#000000", "#0000AA", "#00AA00", "#00AAAA", "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
             "#555555", "#5555FF", "#55FF55", "#55FFFF", "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"]
  },
  dither: { type: "ordered", matrix: [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]] },
  draw: {
    shapes: ["rect", "poly", "ellipse", "line", "dots"],
    fills: ["color", "mix", "fade", "stripes", "null"],
    maxShapes: 200,
    edits: ["add", "remove", "replace", "restyle"]
  },
  viewpoints: ["eye level, looking in", "looking up", "looking down", "from above", "from far above",
               "wide landscape", "far away", "close-up", "silhouette", "through something"],
  instructionsLanguage: "en",

  // Picture effects (ui/scene.js, ui/effects.js). Change them here; nothing else needs to know. (Transitions: ui/transitions.js.)
  effects: {
    respectReducedMotion: true,                    // with reduce motion: no cycling, and changes simply cut
    cycleStyles: ["rotate", "pingpong", "flicker", "blink"],
    // Picture filters (ui/effects.js, FILTERS; js/filters.js): drawn on the scene's own 320×136 pixels while the state has
    // them on (the `filter` effect; a condition's `filters`). Each one's tunables, all sizes in picture pixels. The order
    // here is the order they are drawn in when several are on, whatever order they came on in: first what changes the
    // picture itself (mosaic), then what moves it (sway, shake), then what lies over it (ghost, static, vignette), and
    // last the colours (tint), so a tint colours everything, the static and the dark edges too.
    filters: {
      // Bigger blocks, less detail (dazed, half-asleep, a poor memory): each block shows the colour at its middle.
      // block: the block's size. Still by nature.
      mosaic: { block: 4 },
      // The scene sways: each row slides sideways along a slow wave, and the wave drifts (drunk, dizzy, seasick).
      // amplitude: the furthest a row moves; rows: the wave's length in rows; ms: one full sway;
      // still: with reduce motion, the wave held at this phase (0 to 1), so the picture is still visibly off.
      sway: { amplitude: 3, rows: 48, ms: 4200, still: 0.25 },
      // A jolt of the whole picture, once (a blow, a fall, a door slammed, a quake): it shakes, less and less, and is still
      // again. amplitude: the furthest it moves; ms: how long it lasts; shakes: how many times it goes back and forth.
      // Off with reduce motion (the story says what happened).
      shake: { amplitude: 4, ms: 450, shakes: 5 },
      // Seeing double (drunk, concussed, a ghost of yourself): a second copy of the picture, dx, dy off, drawn through a
      // checkerboard so it reads as see-through. Still by nature.
      ghost: { dx: 2, dy: 1 },
      // A bad signal (a haunted set, a failing camera, a fever): a few pixels flicker. share: how many of the pixels, 0 to 1;
      // ms: how long one sprinkle stays; colors: the palette numbers they flicker to; still: with reduce motion, the one
      // sprinkle shown (any whole number: which).
      static: { share: 0.006, ms: 90, colors: [7, 8, 15], still: 1 },
      // Darkness closing in from the edges, dithered (faint, tired, a narrow lamp, tunnel vision). from: how far out it
      // starts, to: where it is all dark (0 the middle, 1 the middle of an edge, 1.41 a corner). Still by nature.
      vignette: { from: 0.62, to: 1.18 },
      // The 16 colours swapped for another set (cold, poisoned, an old memory, washed out), each palette number for its
      // own colour here. Named: { "filter": "tint:cold" }. Still by nature.
      tint: {
        palettes: {
          cold:   ["#070A14", "#11173D", "#3D6562", "#48728A", "#3C2B3C", "#473864", "#575962", "#8C9AAE",
                   "#424E63", "#4D5B8B", "#8DB3AC", "#9EC4D3", "#7A718A", "#8C81B1", "#D4DECF", "#E6EEF7"],   // blue-grey
          poison: ["#120004", "#28041C", "#842B17", "#983332", "#600C0E", "#771026", "#9A2118", "#C7665C",
                   "#7E1E1F", "#942237", "#C57F5E", "#CF9382", "#BF3A36", "#CA4D5A", "#F5B287", "#FFC6AB"],   // red
          sepia:  ["#170D05", "#27181C", "#685724", "#77623B", "#512A15", "#61352C", "#794F25", "#AF906B",
                   "#644628", "#74513F", "#B2A672", "#C1B998", "#9E663E", "#AD7964", "#EAD8A8", "#F9EACE"],   // warm, old
          faint:  ["#6E6E6C", "#6E6EB8", "#6EBB6C", "#6EBBB8", "#BB6E6C", "#BB6EB8", "#BB946C", "#BBBBB8",
                   "#949492", "#9494DF", "#94E192", "#94E1DF", "#E19492", "#E194DF", "#E1E192", "#E1E1DF"]    // washed out
        }
      }
    }
  }
};
