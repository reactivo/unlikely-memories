// The music spec (MUSIC.md §3 and §5): every tunable of how the engine plays a world's music, in one place, as content/art.js is
// the pictures'. The player (ui/sound/, ui/sound.js) and the test bench (tools/music/) read it; nothing else needs to know. A world
// writes none of this: it writes only its notes (js/music.js reads them). Times are in seconds, levels are gains (1 = unchanged),
// frequencies in Hz. These are the numbers Diego approved by ear on the bench's eighth and ninth runs (7 November 2026).

export default {
  // ---- The frame: what everything goes through ------------------------------------------------------------------------------
  master: { level: 1, off: 1.5 },                 // the level while playing (the loudness targets set the levels: `loudness`); the fade when ♫ goes off
  lowpass: { frequency: 3200, q: 0.5 },            // a gentle low-pass over everything
  compressor: { threshold: -18, ratio: 3 },
  // The echo: a convolution reverb made from noise when the audio starts (no file): its length, how fast it dies (the power of
  // its fall), the share of it before any room tone sets its own, and how quickly a new room's share is reached (time constant).
  reverb: { seconds: 4.5, decay: 3.2, wet: 0.35, follow: 1.5 },
  // Each room tone's share of echo (MUSIC.md §3: a hall and a cave long, rain short); a tone not here gets `spaceDefault`.
  space: { fog: 0.35, rain: 0.15, wind: 0.4, water: 0.35, cave: 0.85, hall: 0.75, hum: 0.12, crowd: 0.2, fire: 0.18, silence: 0.3 },
  spaceDefault: 0.3,
  // The music, the room tone and the sounds, each a bus before the frame: even ground (the loudness targets set the balance,
  // `loudness`); the bench's sliders start here, and the sound panel's (below) multiply them: at 100 a part plays exactly so.
  buses: { music: 1, tone: 1, sounds: 1 },
  // The sound panel (ui/soundpanel.js; docs/sound/PLAN.md, build 2): a slider's 0 to 100 gives its bus the gain (v / 100) ** exponent
  // of its level above (the one loudness curve: 2 feels even to the ear, 1 is straight); where each slider starts on a first visit
  // (the room tone's and the sounds' at today's level, the music a little under).
  panel: { exponent: 2, defaults: { music: 70, tone: 100, sounds: 100 } },

  // ---- Scenes: a room's music, crossfaded -------------------------------------------------------------------------------------
  scene: {
    crossfade: 4,                                 // the old room fades out and the new one in over this
    lead: 0.05,                                   // a new scene starts this far ahead of now
    first: 0.4,                                   // its first line's first note, after the start
    stagger: 3,                                   // each next line starts this much after the one before (so something sounds at once)
    ahead: 0.5,                                   // notes are scheduled this far ahead on the audio clock…
    every: 60,                                    // …by a timer this often (ms)
    late: 1,                                      // a line's note due longer ago than this is let go (the page was held up), not played late
    voices: 64,                                   // at most this many of the lines' notes sounding at once (a phone's budget); past it, let go
    toneStop: 0.1, colourStop: 8, release: 12     // after a fade: the tone stops, the colour's sources stop, the nodes are let go
  },
  // ---- Reactions (MUSIC.md §5; docs/music/PLAN.md stages 5–6): the engine's answer to the story, the same for every world ----
  reactions: {
    // An ending (any): the lines fade out over `out` while the room tone fades with the picture (`tone`, the ending's slow
    // dissolve: ui/transitions.js); after a breath the world's whole theme plays once, as written, with its chords; then the
    // music fades out over `after` and stays silent until a new game. A death: the theme as the `death.variant` plays it
    // (js/music.js, variant: "slower", half as long again) and `death.octave` octaves lower (brought into range, 1 to 5).
    ending: { out: 3, tone: 2, breath: 1.5, after: 4, death: { variant: "slower", octave: -1 } },
    // Sleep: everything fades out under the eyelids over `out` and back over `back` as you wake; the whole theme `theme` seconds
    // after waking, then the usual schedule.
    sleep: { out: 3, back: 4, theme: 5 },
    // Night, by the world's clock, from `from` o'clock to `to`: each line plays one pass in `every` (whole passes, each line in its
    // turn, so a line keeps its shape), and the theme `octave` octaves lower (brought into range). It changes with each line's next
    // pass and the theme's next turn, never at once.
    night: { from: 20, to: 6, every: 2, octave: -1 },
    // Unwell (docs/music/PLAN.md stage 6), from the player's health: at `at` and below (level 1), each line plays one pass in `every`
    // as at night (with night too, still one in `every`), and every note of the lines and the theme sits `detune` cents flat, drifting
    // ± `drift[1]` cents at `drift[0]` Hz, so it sounds unwell rather than wrong; the detune comes and goes over `glide` seconds. At
    // `worse` and below (level 2) the theme also comes as `worse.variant` plays it (slower) and `worse.octave` octaves lower (with
    // night, that many in all, never more). Each line from its next pass, the theme from its next turn. At 0 the story has ended:
    // the ending's reaction takes over, and nothing of this touches it.
    unwell: { at: 2, every: 2, detune: -12, drift: [0.04, 3], glide: 4, worse: { at: 1, variant: "slower", octave: -1 } },
    // The picture's filters that are on (state.filters, whatever turned them on) → what the music does while they are: the audio
    // twin of the picture filter. Filters not here (tint, vignette, mosaic, static, shake, wave) do nothing to the music for now;
    // a sound for one is added here, with its numbers below (each effect is the player's method of that name: ui/sound/player.js).
    // Reduced motion changes nothing (it is about movement on screen).
    filters: { sway: "wobble", ghost: "echo" },
    // The wobble: the pitch of every note sways together, a slow shared vibrato of ± `depth` cents at `rate` Hz, starting and stopping
    // over `glide` seconds.
    wobble: { rate: 0.3, depth: 20, glide: 1 },
    // The echo: the theme's tune (not its chords, not the lines) played again `beats` beats late on the same instrument, at `level`
    // (0.35: about −9 dB). From the theme's next turn.
    echo: { beats: 1, level: 0.35 }
  },

  // ---- The theme (MUSIC.md §2.15–16) ------------------------------------------------------------------------------------------
  theme: {
    first: 6,                                     // after the music starts
    back: 4,                                      // after the music comes back from a rest
    gap: [100, 160],                              // between plays (games may last 15 to 20 minutes)
    parts: ["whole", "question", "whole", "answer"],   // in turn, and round again
    lead: 0.1,                                    // its first note, after it is due
    chords: 0.7                                   // its accompaniment's level beside it
  },
  // Comes and goes (MUSIC.md §2.8): this long of music, then this long of only the room tone; the gate's time constant.
  comes: { on: 120, off: 60, fade: 2 },

  // ---- Notes (MUSIC.md §3, §5) ------------------------------------------------------------------------------------------------
  note: {
    level: 0.16,                                  // a note's level, before the rest below
    low: 160, lowBoost: 1.4,                      // notes under `low` a little louder
    high: 600, highCurve: 0.9,                    // notes above `high` softer the higher they go: × (high / f) ^ highCurve
    held: 0.6,                                    // held kinds softer than struck ones
    octaveUnder: 220,                             // under this a note is low: struck and plucked get an octave above (at `octaveGain`),
    octaveGain: 0.5,                              // and a held one fades after `lowCap` instead of `cap`
    cap: 8, lowCap: 4,                            // a held note fades after this, whatever its beats say
    attack: 0.004, heldAttack: 0.02,              // a struck note's attack; the least a held note's can be
    shortRelease: 1.2,                            // a short kind's (plucked) release at most
    index: { sine: 2.2, other: 1.2 },             // the modulation's depth: bright × pitch × this
    struck: { depth: 1.6, settle: 0.25, fall: 6, fallShort: 12, amp: 4, tail: 1.8 },   // depth from and to; release / fall; release / amp; end
    breath: { sustain: 0.8, depthFrom: 0.6, depthTo: 0.4, swell: 3, swellMin: 0.01, amp: 4, tail: 1.8,
              rate: [0.12, 0.08], depth: 0.12 },  // a held note: its swell, its depth, and its breathing (an LFO: rate + random × spread)
    vibrato: { rate: [4.5, 1], in: 0.4 },         // rate + random × spread; reached this long after the attack
    tremolo: 5.5,
    breathNoise: { band: 2, top: 6000, q: 6, level: 4, offset: 3 },   // blown: noise around (pitch × band), × level × the kind's breath
    partial: { level: 0.35, fall: 6 },            // a chime's partial: its level, and release / fall
    slide: { least: 0.06, along: 0.85 },          // a slide reaches its note at this share of the note (at least this long)
    scoop: { from: 0.93, time: 0.14 }             // a scoop rises from this share of the pitch over this long
  },
  // The kinds (MUSIC.md §3): each one's OPL2 waveform and envelope. decay: struck (rings at once and dies); else held.
  kinds: {
    struck:  { wave: "sine",    decay: true },
    plucked: { wave: "half",    decay: true, short: true },
    chime:   { wave: "sine",    decay: true, partial: 2.76 },
    bowed:   { wave: "abs",     vibrato: 0.006, minAttack: 0.25 },
    blown:   { wave: "sine",    breath: 0.35, vibrato: 0.003 },
    reed:    { wave: "quarter", tremolo: 0.12 }
  },
  waves: { samples: 2048, harmonics: 48 },        // the OPL2's waveforms as periodic waves
  noiseSeconds: 4,                                // the noise buffers (white, pink, brown) made when the audio starts
  // The rhythm kinds (MUSIC.md §2.19): noise or a falling blip, quiet; the step only tilts them. level × share × (base + bright × by).
  noises: {
    level: 0.22, base: 0.6, by: 0.8, release: 1.5,
    tick:  { band: [4, 1500, 8000], q: 2, tc: 0.012, len: 0.1 },
    knock: { blip: [0.5, 60, 300], fall: 0.6, level: 1.6, tc: 0.05, thud: { lowpass: 400, q: 0.7, tc: 0.03 } },
    clack: { band: [3, 900, 4000], q: 3, tc: 0.015, len: 0.1, second: { after: 0.045, band: [3.3, 900, 4400], level: 0.8 } },
    brush: { band: [3, 800, 5000], q: 0.8, level: 0.8, rise: 0.03, longest: 0.4, tc: 0.08 },
    drip:  { blip: [4, 800, 3000], fall: 0.55, level: 0.9, tc: 0.03 },
    burst: { len: 0.25, offset: 3 }, blipGlide: 0.08, blipLen: 0.5
  },
  // A music box (the colour): every note as a small struck tine, an octave up (at most `top`).
  box: { kind: "struck", ratio: 5, bright: 0.25, release: 1.8, up: 2, top: 4000 },

  // ---- Room tones (MUSIC.md §3): filtered noise and a few small random events -------------------------------------------------
  // sway: an LFO [rate, depth] on a level; sweep: on a filter's frequency; every: [least, random spread] between events.
  tones: {
    fog:   { noise: "brown", lowpass: 750, level: 0.32, sway: [0.06, 0.1] },
    rain:  { hiss: { highpass: 1200, lowpass: 6500, level: 0.035 }, roof: { lowpass: 300, level: 0.1 },
             drops: { band: 2600, q: 4, level: [0.15, 0.35], every: [0.03, 0.12], start: 0.05, hold: 0.002, tc: 0.012 } },
    wind:  { band: 520, q: 1.3, level: 0.12, sweep: [0.045, 260], sway: [0.07, 0.06] },
    water: { lowpass: 650, level: 0.2, sway: [0.17, 0.09], lap: { band: 1300, q: 1.2, level: 0.025, sway: [0.23, 0.02] } },
    cave:  { lowpass: 220, level: 0.08,
             drips: { every: [0.8, 2.5], start: 1, pitch: [900, 900], fall: 0.55, glide: 0.09, level: 0.07, hold: 0.005, tc: 0.03, len: 0.3 } },
    hall:  { lowpass: 220, level: 0.05 },
    hum:   { hz: 50, lowpass: 420, q: 2, level: 0.028, sweep: [0.13, 40], second: { hz: 100, level: 0.02 } },
    crowd: { band: 520, q: 0.9, level: 0.09, chatter: { band: 1500, q: 2.5, level: 0.03 },
             every: 0.25, murmur: [0.05, 0.09], murmurTc: 0.25, chatterTo: 0.06, chatterTc: 0.15 },
    fire:  { lowpass: 260, level: 0.25, sway: [0.3, 0.05],
             crackle: { highpass: 1800, level: [0.05, 0.2], every: [0.08, 0.6], start: 0.3, hold: 0.001, tc: [0.006, 0.01] } },
    silence: {}
  },

  // ---- Colours (MUSIC.md §2.19, §2.21): how the world's music reaches the player; the room tone stays as it is ----------------
  colours: {
    // (Each colour's gain comes from its level: the reference notes through it brought to their loudness clean. MUSIC.md §6c.)
    shaper: 1024,                                 // the saturation curve's points
    gramophone: { highpass: 280, lowpass: 3400, drive: 1.3, delay: 0.012, warble: [0.55, 0.0025],
                  crackle: { highpass: 2500, level: [0.03, 0.09], every: [0.05, 0.35], start: 0.1, hold: 0.001, tc: 0.003 },
                  hiss: { highpass: 4000, level: 0.006 } },
    radio: { highpass: 650, peak: { frequency: 1600, q: 1, gain: 3 }, lowpass: 2600, drive: 1.6, delay: 0.005, warble: [6, 0.0004],
             hiss: { band: 3000, q: 0.5, level: 0.012, sway: [0.07, 0.008] } },
    music_box: { highpass: 500 },
    far_away: { lowpass: 1000, dry: 0.6, echo: { delay: 0.33, feedback: 0.45, lowpass: 1200, level: 0.5 } },
    through_wall: { lowpass: 420, shelf: { frequency: 200, gain: 4 } },
    underwater: { delay: 0.02, lowpass: 550, warble: [0.25, 0.006], sweep: [0.15, 200] }
  },

  // ---- The bench's Hear button: an instrument alone, steps 1, 3, 5 ------------------------------------------------------------
  hear: { steps: [1, 3, 5], octave: 4, gap: 0.9, length: 0.8 },

  // ---- Sounds (docs/sound/PLAN.md, build 1): a short sound for a moment the screen already shows -------------------------------
  // The game's piece (ui/moments.js, soundsOf) reads the moment's list into plain terms, { kind, material, weight }; the player plays
  // them (ui/sound/sounds.js) in the world's key and mode (its music's; a world with no music, `key`), on their own bus beside the
  // music's, about level with the theme (`loudness.targets.sounds`; the sound panel's sliders will set the balance).
  // One table, `moments`: each kind → its notes. A note: `play` an instrument of `voices`, or "material" (the thing's: `materials`,
  // `generic` for none or a word not there; `shift` octaves from the material's own); `step` of the mode, `to` a step it slides to,
  // `octave` (a voice's), `at` seconds after the sound starts, `length` seconds, `level` (its level within the moment); a note with
  // no `step` has no pitch from the key (a door, eating: its kind makes its own sound). The
  // instruments are the music's kinds (MUSIC.md §3), the noise kinds too, with the music's numbers (`note`, `noises`), and the
  // sounds' own (`kinds`); each one's loudness is the meter's (an instrument at an octave, measured once: MUSIC.md §6c).
  sounds: {
    lowpass: 4200,                                // a gentle low-pass over them
    spacing: 0.12,                                // several in one moment: each this long after the one before, in the list's order
    most: 4,                                      // at most this many in a moment (the first ones)
    lead: 0.03,                                   // the first one this far ahead of now
    key: { root: 0, steps: [0, 2, 4, 5, 7, 9, 11] },   // a world with no music: C major
    // What a thing is made of (its `material`, BRIEF §8): the kind it sounds with and its shape. Picked up rises, put down falls.
    materials: {
      metal:   { kind: "chime",   ratio: 3.5, bright: 0.45, attack: 0, release: 1.4, octave: 5 },   // a bright cling, a long slightly inharmonic ring
      glass:   { kind: "struck",  ratio: 7,   bright: 0.25, attack: 0, release: 0.35, octave: 6 },   // high, clean, short
      wood:    { kind: "tock",    octave: 4 },                                                     // a hollow knock (the sounds' own kind, below)
      paper:   { kind: "brush",   ratio: 1,   bright: 0.5,  attack: 0, release: 0.2, octave: 4, length: 0.16 },   // a soft rustle (cloth too)
      stone:   { kind: "clack",   ratio: 1,   bright: 0.5,  attack: 0, release: 0.2, octave: 5 },    // a dry clack or clink (ceramic, shell)
      soft:    { kind: "struck",  ratio: 1,   bright: 0.08, attack: 0, release: 0.12, octave: 4 },  // a muted thud (food, leather, a cat)
      generic: { kind: "plucked", ratio: 1,   bright: 0.12, attack: 0, release: 0.2, octave: 4 }    // no material, or one not here
    },
    // The other instruments, each a kind of the music's and its numbers.
    voices: {
      gulp:    { kind: "struck",  ratio: 1,   bright: 0.05, attack: 0, release: 0.14 },   // drinking (a low note sliding up)
      thump:   { kind: "thump" },                                                         // a hurt
      shimmer: { kind: "chime",   ratio: 3,   bright: 0.12, attack: 0, release: 1.2 },    // a heal
      colour:  { kind: "plucked", ratio: 2,   bright: 0.25, attack: 0, release: 0.6 },    // a condition starting or ending
      latch:   { kind: "clack",   ratio: 1,   bright: 0.3,  attack: 0, release: 0.1 },    // a lock turning, a locked door rattling
      slide:   { kind: "brush",   ratio: 1,   bright: 0.3,  attack: 0, release: 0.2 },    // a lid or a drawer
      bell:    { kind: "struck",  ratio: 3,   bright: 0.35, attack: 0, release: 0.9 },    // a puzzle solved
      // A door opening, a door closing, eating (MUSIC.md §6b): realistic (`foley`), noise and timing, no pitch, no note of the world's
      // key; each a whole sound, measured and evened as one. Layers: `click`, `whoosh`, `thunk`, `grains` (ui/sound/sounds.js).
      // `length`: how long it lasts, about (the meter's slices). `as`: a metal door's shape.
      swing:  { kind: "foley", length: 0.65, layers: [
                { type: "click", bands: [[2600, 1.4, 1], [900, 1, 0.35]], level: [0.8, 1], tc: 0.004, count: 2, gap: [0.012, 0.02], decay: 0.55 },   // the handle
                { type: "click", after: [0.06, 0.1], bands: [[3400, 1.8, 1], [1200, 1, 0.3]], level: [0.6, 0.8], tc: 0.003 },                    // the latch let go
                { type: "whoosh", after: [0.02, 0.05], length: [0.38, 0.48], band: [260, 650, 320], q: 0.8, rise: 0.4, level: [0.2, 0.26] }],   // the swing's air
                as: { metal: { bright: 1.6, ring: 3 } } },
      clunk:  { kind: "foley", length: 0.7, layers: [
                { type: "whoosh", length: [0.2, 0.26], band: [300, 900, 600], q: 0.8, rise: 0.8, level: [0.8, 1] },                            // the air pushed
                { type: "thunk", after: [0.19, 0.23], modes: 18, range: [70, 560], tc: [0.006, 0.02], level: [0.4, 1], drop: 1.04, spread: 0.008,              // wood on the frame
                  noise: { lowpass: 900, level: 0.7, tc: 0.025 }, crack: { band: 1400, q: 1, level: 0.5, tc: 0.004 } },
                { type: "click", after: [0.05, 0.09], bands: [[3200, 1.8, 1], [1100, 1, 0.3]], level: [0.8, 1], tc: 0.003, count: 2,         // the latch: "ka-chunk"
                  gap: [0.008, 0.014], decay: 0.4 }],
                as: { metal: { bright: 1.9, ring: 4, length: 1 } } },
      crunch: { kind: "foley", length: 0.85, layers: [                                                                // two bites: "chomp-chomp"
                { type: "grains", bites: 2, bite: [0.18, 0.22], gap: [0.26, 0.36], density: [320, 40],
                  bands: [[1600, 2.5], [2400, 3], [3300, 3], [4300, 3.5]], tc: [0.0006, 0.0025], level: [0.3, 1], skew: 1, first: 1.5 }] }
    },
    // A hurt's weight, by the hit (how much health it took): its level × (base + per × (hit − 1)), the hit at most `most`.
    weight: { base: 0.7, per: 0.2, most: 5 },
    // The one table: each moment's kind → its notes.
    moments: {
      get:      [{ play: "material", step: 1 }, { play: "material", step: 5, at: 0.08 }],                    // picked up: rises
      lose:     [{ play: "material", step: 5 }, { play: "material", step: 1, at: 0.08 }],                    // put down: falls
      eat:      [{ play: "crunch" }],                                                                       // no step: in no key
      drink:    [{ play: "gulp", step: 1, to: 3, octave: 4, length: 0.12 }, { play: "gulp", step: 1, to: 3, octave: 4, at: 0.24, length: 0.12, level: 0.8 }],
      hurt:     [{ play: "thump", step: 1, octave: 2 }],
      heal:     [{ play: "shimmer", step: 1, octave: 5, level: 0.6 }, { play: "shimmer", step: 3, octave: 5, at: 0.06, level: 0.6 },
                 { play: "shimmer", step: 5, octave: 5, at: 0.12, level: 0.6 }, { play: "shimmer", step: 8, octave: 5, at: 0.18, level: 0.6 }],
      down:     [{ play: "colour", step: 3, octave: 4 }, { play: "colour", step: 1, octave: 4, at: 0.11 }],    // a harmful condition starts
      up:       [{ play: "colour", step: 1, octave: 4 }, { play: "colour", step: 3, octave: 4, at: 0.11 }],    // a good one starts, a harmful one ends
      sideways: [{ play: "colour", step: 2, octave: 4 }, { play: "colour", step: 2, octave: 4, at: 0.11 }],    // a neutral one
      open:     [{ play: "swing" }],                                                                        // a door opens (its material: `as`)
      close:    [{ play: "clunk" }],                                                                        // a door closes
      unlock:   [{ play: "latch", step: 5, octave: 5 }, { play: "material", step: 1, shift: -1, at: 0.1 }],                                 // a door unlocks
      rattle:   [{ play: "latch", step: 1, octave: 4 }, { play: "latch", step: 2, octave: 4, at: 0.07 }, { play: "latch", step: 1, octave: 4, at: 0.14 }],   // a locked door
      lid:      [{ play: "slide", step: 3, octave: 4, length: 0.14 }, { play: "material", step: 3, at: 0.12 }],                            // a container opens
      solved:   [{ play: "bell", step: 5, octave: 4 }, { play: "bell", step: 8, octave: 4, at: 0.09 }, { play: "bell", step: 10, octave: 4, at: 0.18 },
                 { play: "bell", step: 12, octave: 4, at: 0.27, length: 0.6 }]                                  // the old games' "points"
    },
    length: 0.25,                                // a note's length when it says none
    // The sounds' own kinds (ui/sound/sounds.js), not the music's: their weight in the middle, where a phone's speaker plays.
    kinds: {
      // A wooden knock: the board's modes [× the pitch, level, fall], starting `drop` sharp and settling over `glide`; the hit's click.
      tock:  { modes: [[1, 0.8, 0.045], [2.71, 0.45, 0.02], [4.9, 0.2, 0.01]], drop: 1.06, glide: 0.015,
               click: { band: 2400, q: 1.2, level: 0.35, tc: 0.004 } },
      // A blow: a low body falling from `from` × the pitch, a triangle `mid.ratio` above it, a dull punch of noise.
      thump: { body: { level: 0.35, tc: 0.12, from: 1.8, glide: 0.06 }, mid: { ratio: 3, level: 0.5, tc: 0.07 },
               punch: { band: 600, q: 0.9, level: 1, tc: 0.04 } }
    }
  },

  // ---- Even loudness (docs/sound/PLAN.md, build 1b and the sound review; MUSIC.md §6c): every part at about the same loudness ----
  // Each part (a world's instrument at an octave, a room tone, a colour, a sound's instrument) has a level, measured once when it is
  // made by rendering it offline with the code that plays it (ui/sound/measure.js; ui/sound/loudness.js: the loudest 400 ms,
  // K-weighted, and again through a phone's 300 Hz high-pass; the mean of the two in dB): the shared parts and the shipped worlds by
  // the developer's tool, a world the game's AI writes as it is made. While playing, each part is brought to its target with plain
  // arithmetic, as it would leave the speakers before the frame's compressor; nothing is measured.
  loudness: {
    // The targets, in dB: the music's notes (where its instruments sat, median, before: the music as loud as Diego approved it); a
    // rhythm line's noises, quiet under them (MUSIC.md §2.19); the room tones, under the music; the sounds, level with the theme.
    targets: { notes: -29, rhythm: -45, tones: -40, sounds: -29 },
    limits: 24,                                   // a gain is kept within ± this many dB (a part that measures as silence keeps its level)
    renders: 5,                                   // a part with chance in it (noise, a room tone, a door's layers) is measured this many times over
    // What each colour is matched against: these notes, clean and through it (in `sounds.key`), one every `each` seconds, `length` long.
    reference: { each: 1.2, length: 0.8, notes: [
      { inst: { kind: "plucked", ratio: 2, bright: 0.3, attack: 0, release: 1 }, octave: 3, steps: [1, 5] },
      { inst: { kind: "plucked", ratio: 2, bright: 0.3, attack: 0, release: 1 }, octave: 4, steps: [1, 5] },
      { inst: { kind: "bowed", ratio: 1, bright: 0.25, attack: 0.3, release: 1.5 }, octave: 3, steps: [3, 8] }] },
    // One gentle limiter at the very end, only so stacked sounds never clip: it should almost never act.
    limiter: { threshold: -3, knee: 0, ratio: 20, attack: 0.002, release: 0.15 }
  }
};
