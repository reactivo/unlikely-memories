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
    cycleStyles: ["rotate", "pingpong", "flicker", "blink"]
  }
};
