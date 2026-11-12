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
    maxShapes: 250,                                // every picture, in either style (BRIEF.md §7)
    edits: ["add", "remove", "replace", "restyle"]
  },
  styles: ["dithered", "flat"],                    // a world's `style` (its bible; none means dithered), BRIEF.md §7
  viewpoints: ["eye level", "wide landscape", "far away", "looking up at something outdoors",
               "looking down at an angle from the rim"],   // BRIEF.md §7, "Viewpoints"
  instructionsLanguage: "en",

  // Picture effects (ui/scene.js, ui/effects.js). Change them here; nothing else needs to know. (Transitions: ui/transitions.js.)
  effects: {
    respectReducedMotion: true,                    // with reduce motion: no cycling, and changes simply cut
    cycleStyles: ["rotate", "pingpong", "flicker", "blink"],
    // Picture filters (ui/effects.js, FILTERS; js/filters.js): drawn on the scene's own 320×136 pixels while the state has
    // them on (the `filter` effect; a condition's `filters`). Each one's tunables, all sizes in picture pixels. The order
    // here is the order they are drawn in when several are on, whatever order they came on in: first what changes the
    // picture itself (mosaic), then what moves it (sway, shake, wave), then what lies over it (ghost, static, vignette), and
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
      // again. amplitude: the furthest it moves; ms: how long it lasts; shakes: how many times it goes back and forth;
      // ease: 1 an even jolt; more, the most of it at once, then slowing down as it dies away (2 eases out).
      // Off with reduce motion (the story says what happened).
      shake: { amplitude: 4, ms: 450, shakes: 5, ease: 1 },
      // A ripple, once (relief, a breath, something soothing): the rows slide sideways on a short wave, as in sway but gentler,
      // that runs down the picture and dies away. amplitude: the furthest a row moves; rows: the wave's length in rows;
      // ms: how long it lasts; travel: how many waves run past in that time; rise: the share of it the wave takes to swell;
      // fade: how it dies away after that (1 evenly to nothing at the end; less, it stays fuller for longer). Off with reduce motion.
      wave: { amplitude: 2, rows: 40, ms: 2100, travel: 1, rise: 0.15, fade: 0.5 },
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
    },
    // Reactions (INTERFACE.md §6c): what the picture does when you are hurt or healed, whatever did it (the engine counts them
    // in state.reactions; a world writes nothing). Each is one of the moments above, `filter`, with these tunables in place of
    // its own. The page background flashes with it (css/base.css; its colours and timings: css/tokens.css), and the picture's
    // part lasts longer than the flash, so it lingers after it. A death is a hurt: its jolt plays, then the ending's picture.
    // Off with reduce motion (the flash stays, softer).
    reactions: {
      // Hurt: a jolt that hits with the flash and slows as it dies away, past the flash's end.
      hurt: { filter: "shake", ms: 1000, shakes: 6, ease: 1.5 },
      // Healed: one calm ripple down the picture, long after the flash has gone.
      heal: { filter: "wave", ms: 2100 }
    },
    // The old-CRT look (ART-DIRECTION.md §6.2; ui/crt.js draws it): one GPU pass over the finished picture and over the landing page's
    // thumbnails, on top of every effect above. Never changes the game. The debug panel's CRT section tries these live (and can
    // copy its values here). Strengths are 0 (off) to 1 (full) unless said; sizes are in the picture's own pixels unless said.
    crt: {
      on: true,                                    // the whole look; off, or with no WebGL, the plain picture shows
      scan: 0.2,                                   // scanlines: how dark the lower half of every picture row is
      mask: 0.06,                                  // RGB phosphor stripes, 1 CSS pixel each (R, G, B repeating across): how dark the other two colours are
      vignette: 0.24,                              // black at this opacity at the edge of the visible picture, clear inside 55% of the way out
      rgb: 0.4,                                    // colour fringing: red shifted left and blue right by this many picture pixels
      glow: 0.3,                                   // a soft blur of about 1.5 picture pixels, screen-blended over the picture at this strength
      flicker: 0.02,                               // a small random brightness change (up to this much, up or down) on each frame the scene draws; none on thumbnails nor with reduce motion
      contrast: 1.1,                               // the grade: 1 leaves the picture as it is
      saturation: 1.15,
      brightness: 1.05
    },
    // Sleep (INTERFACE.md §6c, "Sleep"; ui/scene.js plays it, ui/effects.js draws it, on the picture only): two black eyelids close
    // over the picture, the dark between them, and the lids open again to wake. One of three, by the sleep's kind (js/sleep.js: a
    // nap under 2 hours, a few hours under 6, until morning). All sizes in picture pixels, all times in ms unless said.
    sleep: {
      // The lids, each kind: `close` and `open` are steps [where the lids go (0 open … 1 shut), ms], one after another, each eased
      // (slow in, slow out); `dark`, how long the dark lasts at least. Until morning flutters: half shut, a breath, then shut;
      // waking, most of the way open, a breath, then open.
      nap:     { close: [[1, 1600]], dark: 2000, open: [[0, 1600]] },
      few:     { close: [[1, 2200]], dark: 4000, open: [[0, 2200]] },
      morning: { close: [[0.55, 1400], [0.45, 500], [1, 1600]], dark: 6000, open: [[0.7, 1500], [0.85, 500], [0, 2000]] },
      // The dark lasts at least until the dream or the vision has been told, and this much longer, to read it.
      afterText: 1500,
      // The lids' edge: `curve`, how much higher it sits at the sides than in the middle (a gentle arc); `soft`, half the width of
      // its dithered edge; `over`, how far past the middle each lid goes when shut, so they meet with no gap.
      lid: { curve: 6, soft: 3, over: 6 },
      // The dark is not quite black: `glowIn` and `glowOut`, how long it takes to come and to go (at the start and the end of the
      // dark, the lids shut). Colours are palette numbers (content/art.js, palette): the dark, its grey, and the rare warm speck.
      glowIn: 300, glowOut: 700,
      colors: { dark: 0, grey: 8, warm: 6 },
      // Specks: a few pixels, each glowing and fading slowly at its own pace. `lit` [min, max] seconds one glows for; `share`, how
      // many pixels are lit at a time (1 in 300); `warm`, the share of them that glow warm brown instead of grey.
      specks: { lit: [1.2, 2.4], share: 1 / 300, warm: 1 / 15 },
      // The afterimage: the room's brightest parts (its picture's luminance, blurred `blur` pixels each way, above `from` of its
      // brightest), dithered in grey at `strength`, fading with a time constant of `fade` seconds (gone in about 2.5 s); then a
      // darker patch where they were, where nothing glows: it comes in from `hole.at` seconds over `hole.rise`, and fades over
      // `hole.fade`.
      afterimage: { blur: 5, from: 0.5, strength: 0.38, fade: 1.4, hole: { at: 1.5, rise: 2, fade: 6 } },
      // One very faint wide band of grey, closing slowly in on the middle: it starts `from` out (1 the middle of an edge), moves in
      // `speed` a second, is `width` wide, as strong as `strength` at most, reached over `rise` seconds.
      band: { from: 1.15, speed: 0.07, width: 0.22, strength: 0.09, rise: 3 },
      // A vision's picture (a world's `dream`): it fades in from the dark and back out before waking, by the dither, over these.
      vision: { fadeIn: 1200, fadeOut: 1200 },
      // With reduce motion: a plain fade to black over `fade`, and back (a vision's picture shown still, in the dark).
      calm: { fade: 700 }
    }
  }
};
