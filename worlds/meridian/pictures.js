// Pictures for "Please Remain Present" (worlds/meridian/world.en.js), one per room and one per ending, the way the AI
// writes them (BRIEF.md §7, ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front in the short
// notation, ids on what the story may change or a cycle animates.
//
// The shot list, written before drawing (viewpoint; horizon; main subject and its size; lead colour):
//   yard        looking up at the service door; horizon 110; the steel door tall, right third, 80% of the height; magenta 5
//   corridor    eye level, looking in; horizon 66; vanishing point at x 150; the shaft on the left wall, a third of the frame; cyan 3
//   records     looking down on the desk; horizon 24; the desk in the lower third, one lamp on it; brown 6
//   canteen     looking up; horizon 110; the urn tall and narrow, 85% of the height, left of centre; light red 12
//   staff       close-up, no horizon; the printer filling 70% of the frame on a plain fade; yellow 14
//   stairwell   through something (the gate's bars, a dark frame); its own horizon 70; the stairs rising behind the bars; light blue 9
//   lobby       wide landscape; horizon 42; the sealed glass front right of centre, the fog city beyond; magenta 13
//   cellar      far away; horizon 96; the generator small, left third, a fifth of the width; green 2
//   registry    close-up; no horizon; the terminal screen filling the frame on a dark fade; light green 10
//   present     silhouette; figure left third, black against a bright green fade; green 10
//   erased      from above; repeated grey strips, one small slip of white; magenta 13 (the lobby's lead, not its neighbours')
//   shaft       from far above; repeated rungs of cable, one small light at the bottom; blue 1
//   died        close-up of a floor, faintly ruled, a grey smear of light; dark 8
//
// Neighbours differ: yard (up, 110) is next to corridor (eye, 66); corridor is between the up and down rooms; records (down,
// 24) and cellar (far, 96) differ; stairwell (through) sits between eye-level corridor and the rest; registry is close up.

const rooms = {
  yard: { version: 1, draw: `rect sky 0,0,320,30 fade:8,7/0,0/0,30
rect fence 0,30,320,80 fade:5,8/0,30/0,110
rect ground 0,110,320,26 6 e0
poly tarp 28,96 112,96 116,110 26,110 15 e0
rect bin 268,84,20,26 8 e0
rect door_frame 186,12,68,100 8 e0
rect door 194,16,52,96 7 e8
line seam 220,16 220,112 c8`,
      overlays: [{ object: "intercom", at: [178, 48] }] },
  corridor: { version: 1, draw: `rect ceiling 0,0,320,30 fade:8,7/0,0/0,30
poly lwall 0,30 150,46 150,92 0,136 3
poly rwall 320,30 250,46 250,92 320,136 11
rect back 150,46,100,46 7
poly floor 0,136 150,92 250,92 320,136 6
rect lamp 160,30,24,4 15
poly shaft 22,62 64,70 64,112 22,124 0 e8
rect shaft_sign 34,80,20,8 12 e0
rect board 268,48,22,30 6 e0
ellipse clock 200,58,6,6 15 e0`,
      cycles: [{ name: "lamp", areas: ["lamp"], colors: [15, 7], style: "flicker", ms: [900, 3000] }] },
  records: { version: 1, draw: `rect shelves 0,0,320,24 8
rect ledgers 8,4,304,16 stripes:4,6
poly floor 0,24 320,24 320,136 0,136 mix:8,6@0.3
poly desk 70,64 250,64 300,110 20,110 6 e0
rect drawer 124,96,72,9 0 e0
poly ledger 150,74 204,70 210,86 156,90 15 e0
ellipse lamp 262,56,12,7 14 e0
ellipse glow 262,56,24,14 mix:,14@0.3` },
  canteen: { version: 1, draw: `rect ceiling 0,0,320,40 8
rect wall 0,40,320,70 fade:12,8/0,40/0,110
rect floor 0,110,320,26 6 e0
rect urn 146,20,34,92 7 e0
rect urn_top 150,12,26,10 7 e0
dots steam 158,6 164,2 156,0 c15
rect counter 0,96,320,14 6 e0
rect vend 252,22,44,88 9 e0
rect vend_glass 258,30,32,36 11 e0
ellipse lamp 60,8,20,4 15`,
      overlays: [{ object: "biscuit", at: [124, 86] }] },
  staff: { version: 1, draw: `rect bg 0,0,320,136 fade:6,8/0,0/0,136
rect printer 56,18,208,104 7 e0
rect printer_top 66,10,188,12 8 e0
rect tray 120,40,80,8 15 e0
rect light 232,28,12,6 14 e0
ellipse glow 238,31,22,14 mix:,14@0.4
rect button 92,72,24,10 4 e0
rect panel 80,94,160,18 8 e0` },
  stairwell: { version: 1, draw: `rect bg 0,0,320,136 fade:9,1/0,0/0,136
poly stairs 80,136 160,70 240,70 300,136 8 e0
rect gate_rail 90,26,140,3 8 e0
line gate_b1 110,28 110,100 c8
line gate_b2 135,28 135,100 c8
line gate_b3 160,28 160,100 c8
line gate_b4 185,28 185,100 c8
line gate_b5 210,28 210,100 c8
rect plate 150,72,20,8 7 e0
line cable_line 178,14 176,40 c0
dots sparks 176,40 180,42 c14
ellipse light 200,20,6,4 14 e0
rect frame_l 0,0,46,136 0
rect frame_r 274,0,46,136 0
rect frame_t 46,0,228,14 0`,
      cycles: [{ name: "light", areas: ["light", "sparks"], colors: [14, 8], style: "flicker", ms: [700, 2200] }] },
  lobby: { version: 1, draw: `rect sky 0,0,320,42 fade:8,7/0,0/0,42
rect city_a 16,20,30,22 8
rect city_b 56,14,26,28 8
rect city_c 200,18,44,24 8
rect city_d 254,26,40,16 8
rect ground 0,42,320,94 fade:13,6/0,42/0,136
rect front_glass 150,30,72,90 none e8
rect seal 150,30,72,6 8 e0
ellipse lamp1 40,38,6,4 14 e0
ellipse lamp2 220,36,6,4 14 e0
dots fog 30,70 90,80 250,64 300,92 c15`,
      cycles: [{ name: "lamps", areas: ["lamp1", "lamp2"], colors: [14, 8], style: "flicker", ms: [800, 2400] }] },
  cellar: { version: 1, draw: `rect wall 0,0,320,96 fade:0,2/0,0/0,96
rect floor 0,96,320,40 8 e0
rect pipes 0,20,320,3 6
rect generator 62,62,56,34 7 e0
rect gen_panel 76,72,20,10 14 e0
rect bulb 240,44,6,4 14 e0
ellipse glow 240,44,12,8 mix:,14@0.3` },
  registry: { version: 1, draw: `rect bg 0,0,320,136 fade:10,2/0,0/0,136
rect screen 52,16,216,98 0 e10
rect screen_in 64,28,192,74 2
rect bar1 84,46,150,4 10
rect bar2 84,58,110,4 10
rect bar3 84,70,130,4 10
rect cursor 230,70,6,4 15
rect slot 240,108,40,8 8 e0
rect shredder 16,100,50,30 8 e0`,
      cycles: [{ name: "screen", areas: ["screen_in"], colors: [2, 10], style: "pingpong", ms: 3000 }] }
};

export default rooms;

// The ending pictures (ids as the world's `end`s name them), and the one for a death from harm.
export const endings = {
  present: { version: 1, draw: `rect bg 0,0,320,136 fade:15,10/0,0/320,136
ellipse halo 110,70,70,70 mix:,15@0.5
ellipse head 96,28,10,12 0
poly body 84,42 108,42 116,96 76,96 0
rect legs 80,96,11,34 0
rect legs2 96,96,11,34 0` },
  booth: { version: 1, draw: `rect bg 0,0,320,136 fade:8,0/0,0/0,136
rect frame 104,14,112,122 7 e0
ellipse light 160,22,12,5 10
ellipse head 160,62,10,12 0
poly body 146,76 174,76 182,124 138,124 0
rect chair 132,118,56,8 0
rect glass 112,34,96,102 mix:,15@0.5` },
  erased: { version: 1, draw: `rect bg 0,0,320,136 13
rect strip1 24,0,18,136 5 e0
rect strip2 60,0,18,136 5 e0
rect strip3 96,0,18,136 5 e0
rect strip4 132,0,18,136 5 e0
rect strip5 168,0,18,136 5 e0
rect strip6 204,0,18,136 5 e0
rect strip7 240,0,18,136 5 e0
rect strip8 276,0,18,136 5 e0
rect slip 150,58,22,14 15 e0` },
  shaft: { version: 1, draw: `rect bg 0,0,320,136 1
rect rungs 0,0,320,136 stripes:1,9
line cable 160,0 160,130 c0
ellipse small 160,118,4,3 14` },
  died: { version: 1, draw: `rect bg 0,0,320,136 fade:8,0/0,0/0,136
line tile1 0,60 320,60 c8
line tile2 0,96 320,96 c8
line tile3 80,60 60,136 c8
line tile4 240,60 260,136 c8
ellipse light 160,64,40,7 7` }
};

// ---- THE COVER (its page, /meridian/: docs/splash/PLAN.md): 480 x 400, the title drawn by the game on its band ---------------------------
export const cover = {
  shot: "archetype: the dwarf (the world turns on a place bigger than you: the grey tower where the machines fail and the Registry waits on a high floor); title at the top, in the plain dark grey band (rows 0-95), title colour white (15). Palette: institution (dark grey 8 leads; black, dark grey, light grey, white 15; one green thing, the Registry's window; a brass buzzer in brown 6 as the one small accent). Dithered. Viewpoint: from the yard floor looking up the block's back wall, vanishing point far above the picture (240,-400), so the floor lines and the corners run in strong diagonals; the tower takes the whole poster and goes up into a fog that becomes the plain band, with no edge at the band. Light: one caged lamp over the steel service door (centre right, 295,257); a lit cone on the wall (gradient 1: light grey dither fading to plain dark grey up and away from the lamp, drawn as two halves meeting under the lamp) and a pool on the yard ground (gradient 2: the same fade along the ground, the figure standing mid-pool); hard shadow: the figure's long dithered shadow runs away from the lamp to the left and towards us. Dominant: {the tower}: seven floors of black ribbon windows with dark mullions, a few windows lit pale, rising into the fog; the sky wedges at the top corners are pale fog fading to the band's grey. The figure (the player, left third, x 170, 56 px of coat and legs under a tilted-back brimmed hat, about 66 px with the hat): a black silhouette with one light rim along the coat's right edge; the head tilted back and the nose up, looking up the tower at the green window; the right arm bent at the chest holding the folded {summons} (white, the brightest thing on the figure); the left arm hangs at its side; the legs apart, shoes toward the right. The question: the one lit green window high up on the tower (the Registry on its floor): will you get up there? Not the answer, no way shown. Other elements: {the service door} with its {caged lamp} and the {buzzer} beside it, lit steel in a black frame; {puddles} on the yard with the lamp's glints in the right one. Wings: left, the dark wall going on with a {drainpipe}, a sheet-metal {fence} with panel seams and two {bins}; right, a {junction box} with a cable, the fence again, a {tarpaulin} over the lift motor, a small puddle. moves: the lamp (flicker, with its halo), the Registry's window (a failing green light, flicker), the puddle's glints (shimmer); loop: two moths round the lamp.",
  title: 15,
  titleAt: "top",
  draw: `# the whole canvas in the lead colour: dark grey (also the title band, plain)
rect bg 0,0,480,400 8
# fog wedges at the top corners, pale below and plain at the band
poly sky_l 0,100 62,100 0,252 fade:7,8/0,250/0,112
poly sky_r 480,100 418,100 480,252 fade:7,8/480,250/480,112
# the tower, in perspective from far above the picture
vp 240,-400
poly wall_l -30,330@1 295,330@1 295,330@0.6849 -30,330@0.6849 fade:7,8/295,330/160,150
poly wall_r 295,330@1 510,330@1 510,330@0.6849 295,330@0.6849 fade:7,8/295,330/440,150
poly plinth -30,330@1 510,330@1 510,330@0.985 -30,330@0.985 mix:0,8@0.5
# seven floors of ribbon windows, black below, thinning into the fog above
poly band1 -30,330@0.8959 510,330@0.8959 510,330@0.8630 -30,330@0.8630 0
poly band2 -30,330@0.8428 510,330@0.8428 510,330@0.8148 -30,330@0.8148 0
poly band3 -30,330@0.7978 510,330@0.7978 510,330@0.7748 -30,330@0.7748 mix:0,8@0.3
poly band4 -30,330@0.7611 510,330@0.7611 510,330@0.7430 -30,330@0.7430 mix:0,8@0.3
poly band5 -30,330@0.7321 510,330@0.7321 510,330@0.7172 -30,330@0.7172 mix:0,8@0.6
poly band6 -30,330@0.7085 510,330@0.7085 510,330@0.6970 -30,330@0.6970 mix:0,8@0.6
# the mullions, one dark line up each column
line mull1 20,330@0.8959 20,330@0.6849 c8
line mull2 70,330@0.8959 70,330@0.6849 c8
line mull3 120,330@0.8959 120,330@0.6849 c8
line mull4 170,330@0.8959 170,330@0.6849 c8
line mull5 220,330@0.8959 220,330@0.6849 c8
line mull6 270,330@0.8959 270,330@0.6849 c8
line mull7 320,330@0.8959 320,330@0.6849 c8
line mull8 370,330@0.8959 370,330@0.6849 c8
line mull9 420,330@0.8959 420,330@0.6849 c8
line mull10 470,330@0.8959 470,330@0.6849 c8
# a few windows still lit
poly lit1 124,330@0.8959 166,330@0.8959 166,330@0.8630 124,330@0.8630 7
poly lit2 24,330@0.7978 66,330@0.7978 66,330@0.7748 24,330@0.7748 7
poly lit3 424,330@0.8428 466,330@0.8428 466,330@0.8148 424,330@0.8148 7
poly lit4 174,330@0.7611 216,330@0.7611 216,330@0.7430 174,330@0.7430 7
poly lit5 374,330@0.7978 416,330@0.7978 416,330@0.7748 374,330@0.7748 7
# the Registry's window, the one green light
ellipse reg_halo 316,129,26,11 mix:,10@0.2
poly reg_win 324,330@0.7321 366,330@0.7321 366,330@0.7172 324,330@0.7172 10
# the drainpipe in the left wing, the junction box and its cable in the right
line pipe_l 14,330@1 14,330@0.6849 c7
line pipe_r 466,330@1 466,330@0.6849 c7
rect box 410,262,16,12 0 e8
line box_cable 418,274 418,300 c8
# the service door, its frame black, the steel door light, the lamp over it
rect door_frame 266,268,58,62 0
rect door 271,273,48,57 7 e8
line door_seam 295,273 295,330 c8
rect buzzer 328,300,3,4 6
rect buzzer_label 327,305,5,3 7
ellipse lamp_halo2 295,258,20,11 mix:,15@0.1
ellipse lamp_halo1 295,257,11,6 mix:,15@0.2
line lamp_arm 295,267 295,259 c0
ellipse lamp 295,257,5,3 15
# the yard: the ground in two halves, lit round the door, darker away from it
poly ground_l 0,330 300,330 300,399 0,399 fade:7,8/300,336/50,399
poly ground_r 300,330 480,330 480,399 300,399 fade:7,8/300,336/480,399
line kerb 0,330 480,330 c0
# the side fences, with their seams and top edges
rect fence_l 0,280,96,66 mix:8,0@0.4 e0
rect fence_r 384,280,96,66 mix:8,0@0.4 e0
line fence_l_top 0,281 96,281 c7
line fence_r_top 384,281 480,281 c7
line seam_l1 24,282 24,344 c8
line seam_l2 48,282 48,344 c8
line seam_l3 72,282 72,344 c8
line seam_r1 408,282 408,344 c8
line seam_r2 432,282 432,344 c8
line seam_r3 456,282 456,344 c8
# two bins on the left, the tarpaulin over the lift motor on the right
rect bin_a 20,322,26,26 8 e0
rect bin_b 52,326,22,22 8 e0
poly tarp 404,348 414,330 436,320 466,328 480,348 mix:7,8@0.4 e0
line tarp_strap 420,328 424,347 c0
# puddles, with the lamp's glints in the one under it
ellipse puddle_a 300,377,34,6 0
ellipse puddle_b 410,362,18,4 0
line g1 290,375 294,375 c15
line g2 297,377 303,377 c7
line g3 287,378 291,378 c7
line g4 303,374 307,374 c15
line g5 294,380 299,380 c7
# the figure's long shadow, away from the lamp
poly shadow 158,362 184,367 56,399 40,392 mix:,0@0.7
ellipse shadow_head 46,394,6,4 mix:,0@0.7
# the figure: a black silhouette, the summons held up in the right hand
rect fig_shoel 160,364,11,3 0
rect fig_shoer 172,364,11,3 0
poly fig_legl 161,353 168,353 168,365 161,365 0
poly fig_legr 172,353 179,353 180,365 173,365 0
poly fig_coat 162,319 178,319 181,334 186,354 156,354 160,334 0
poly fig_arml 159,320 164,320 163,345 158,345 0
ellipse fig_handl 160,347,2,2 0
poly paper 187,314 197,316 195,326 186,324 15
line paper_fold 188,319 196,321 c7
poly fig_armr_a 175,320 180,321 185,335 181,336 0
poly fig_armr_b 181,335 185,336 192,325 188,323 0
ellipse fig_handr 190,323,2,2 0
rect fig_neck 168,314,5,6 0
ellipse fig_head 172,309,4,5 0
poly fig_nose 175,307 180,305 176,311 0
ellipse fig_crown 171,303,5,3 0
poly fig_brim 165,303 179,299 180,301 166,306 0
line fig_rim 178,320 181,335 186,354 c7`,
  cycles: [
    {
      "name": "the caged lamp",
      "areas": [
        "lamp",
        "lamp_halo1",
        "lamp_halo2"
      ],
      "colors": [
        15,
        7
      ],
      "style": "flicker",
      "ms": [
        900,
        3000
      ]
    },
    {
      "name": "the Registry's window",
      "areas": [
        "reg_win",
        "reg_halo"
      ],
      "colors": [
        10,
        2
      ],
      "style": "flicker",
      "ms": [
        1500,
        5000
      ]
    },
    {
      "name": "the puddle's glints",
      "areas": [
        "g1",
        "g2",
        "g3",
        "g4",
        "g5"
      ],
      "colors": [
        15,
        7,
        8
      ],
      "style": "pingpong",
      "scatter": true,
      "ms": 420
    }
  ],
  loops: [{"name":"two moths round the lamp","at":[282,247],"style":"loop","ms":170,"frames":[["..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","....................0.0...",".....................0....",".....0....................",".....0....................","..........................","..........................","..........................","..........................","..........................","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..................0.......","..................0.......","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".......0.0................","........0.................","..........................",".........................."],
    ["..........................","..........................","..........................","..........0.0.............","...........0..............","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","...............0..........","...............0..........",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","......0...................","......0...................","..........................","..........................","...................0.0....","....................0.....","..........................","..........................","..........................","..........................","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","..........................",".................0........",".................0........","..........................","..........................","..........................","..........................","..........................","..........................","........0.0...............",".........0................","..........................","..........................","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","........0.0...............",".........0................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".................0........",".................0........","..........................","..........................",".........................."]]}]
};
