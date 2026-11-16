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
  shot: "archetype: the icon (the world turns on one thing: the Registry's terminal, its column of names each with a green tick and one gap where a tick should be, a cursor waiting in it: am I still on the register?); it beat the dwarf (a small figure under the grey tower: a poster any bureaucratic or haunted building could have, while a column of ticks with one gap is only this world's). Title at the top, in the plain dark grey band (rows 0-95). Palette institution, lead dark grey 8, with brown 6 (the floor, a door), black, light grey 7 and 15, and one green (2 and 10, only on the screen). Light: one cold tube out of frame at the upper left (a lit rim on every left edge, a long dithered shadow running right and down the floor), the screen the brightest thing, and one small caged wall lamp in the right wing. Dominant: the terminal, head on and centred (columns 142-338, rows 112-336): a light grey bezel with a lit left rim and a shaded right edge, a dark green screen with seven name bars (light grey), a light green tick after each except the fourth, where a white cursor waits; on a dark grey neck and base; it stands in a black doorway (an alcove 112-368) like a monolith. No figure. Gradients: the wall, plain at the band and falling into the dark downward (the tube's light above the frame); the floor, brown under the terminal falling to dark toward us. Elements: the summons, a white sheet lying on the lit floor at the terminal's foot, left third (small beside the big); the black cable hanging from the conduit at the right of the doorway, sparking at its cut end. The question: the gap in the ticks with the cursor in it. Wings: left a brown door with a nameplate, a conduit and a drainpipe; right a notice board with three papers, the conduit and a caged lamp with two moths. moves: the cursor (slow pulse), one tick that drops out now and then (flicker), the wall lamp (flicker), the cable's sparks (loop), two moths round the lamp (loop).",
  title: 15,
  titleAt: "top",
  draw: `# the whole canvas in the lead colour, dark grey: the title band is this, plain
rect bg 0,0,480,400 8
# the wall: plain at the band, falling into the dark downward (one gradient: the tube's light above the frame)
rect wall 0,96,480,240 fade:8,0/0,96/0,396
# the conduits and the drainpipe along the wall
rect conduit_l 0,116,112,3 7
rect conduit_r 368,116,112,3 7
rect pipe_l 70,119,5,217 8
line pipe_l_rim 70,119 70,335 c7
# the left wing: a brown door with its nameplate
rect door_frame 8,160,58,176 0
rect door 13,165,48,171 6
rect door_plate 40,196,14,5 7
ellipse door_knob 22,256,2,2 7
# the right wing: a notice board with three papers
rect board 408,166,56,62 6 e0
rect note_a 414,172,14,20 15
rect note_b 432,176,12,16 7
rect note_c 448,172,10,22 15
dots tacks 421,174 438,178 453,174 c0
# the caged wall lamp on its arm, its halo
ellipse lamp_halo2 432,139,24,15 mix:,15@0.1
ellipse lamp_halo1 432,139,12,8 mix:,15@0.2
line lamp_arm 432,120 432,133 c0
rect lamp_cap 426,132,12,3 0
ellipse lamp 432,139,5,3 15
# the black cable hanging beside the doorway, lit on its left edge
poly cable 374,119 378,119 381,201 376,201 0
line cable_rim 374,120 376,200 c7
# the doorway behind the terminal: a black alcove, its left jamb lit
rect alcove 112,104,256,232 0 e8
line jamb 112,105 112,335 c7
# the floor: brown under the terminal, falling into the dark toward us (the second gradient)
vp 240,150
rect floor 0,336,480,64 fade:6,0/0,336/0,426
line skirt 0,336 480,336 c0
line joint1 -40,399@1 -40,399@0.75 c8
line joint2 70,399@1 70,399@0.75 c8
line joint3 170,399@1 170,399@0.75 c8
line joint4 310,399@1 310,399@0.75 c8
line joint5 410,399@1 410,399@0.75 c8
line joint6 520,399@1 520,399@0.75 c8
line joint_h1 0,352 480,352 c8
line joint_h2 0,374 480,374 c8
# the terminal's long shadow, running right and down the floor, and the thin dark under its foot
poly shadow 178,337 302,337 520,385 400,385 mix:,0@0.7
rect contact 176,336,130,3 0
# the terminal: neck and base, bezel, screen
rect mon_neck 214,302,52,20 8 e0
line neck_rim 215,303 215,321 c7
poly mon_base 184,322 296,322 304,336 176,336 7 e0
line mon_base_rim 186,323 294,323 c15
rect mon_bezel 142,112,196,190 7 e0
rect mon_shade 324,113,13,188 mix:7,8@0.5
line mon_rim 143,113 143,300 c15
line mon_rim_t 143,113 336,113 c15
rect mon_screen 160,128,160,158 2 e0
poly mon_glare 166,134 204,134 176,206 166,206 mix:,10@0.2
# seven names (bars), a tick after each but the fourth
rect name1 174,144,66,6 7
rect name2 174,164,48,6 7
rect name3 174,184,74,6 7
rect name4 174,204,58,6 7
rect name5 174,224,70,6 7
rect name6 174,244,52,6 7
rect name7 174,264,62,6 7
poly tick1 266,147 269,145 272,148 279,141 281,143 272,151 10
poly tick2 266,167 269,165 272,168 279,161 281,163 272,171 10
poly tick3 266,187 269,185 272,188 279,181 281,183 272,191 10
poly tick5 266,227 269,225 272,228 279,221 281,223 272,231 10
poly tick6 266,247 269,245 272,248 279,241 281,243 272,251 10
poly tick7 266,267 269,265 272,268 279,261 281,263 272,271 10
# the gap, and the cursor waiting in it
rect cursor 266,202,12,10 15
# the bezel's vents and its small lamp
line vent1 170,293 196,293 c8
line vent2 170,296 196,296 c8
rect mon_led 306,292,6,3 8
# the summons lying on the lit floor at the terminal's foot, its small shadow
poly paper_shadow 192,356 203,359 210,378 198,374 mix:,0@0.8
poly paper 166,358 192,354 198,374 172,379 15
line paper_t1 172,364 188,361 c7
line paper_t2 173,369 190,366 c7`,
  cycles: [
    {
      "name": "the cursor",
      "areas": [
        "cursor"
      ],
      "colors": [
        15,
        7
      ],
      "style": "pingpong",
      "ms": 900
    },
    {
      "name": "a tick that drops out",
      "areas": [
        "tick3"
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
      "name": "the wall lamp",
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
    }
  ],
  loops: [{"name":"the cable's sparks","at":[368,198],"style":"random","ms":170,"frames":[["................","................","................","..........f.....",".........7.7....","................","........f.......","...........7....","................","......7.........","................","................"],
    ["................","................","................","..........7.....","................","........f...f...","..........7.....","................","....7.......7...","................",".....f..........","................"],
    ["................","................","................","..........f.....","...........7....",".........7......","................",".....f.....f....","................","........7.......","...........7....","................"],
    ["................","................","................","................","..........7.....","................","...........f....","........7.......","................","..........f.....","................","..............7."]]},{"name":"two moths round the lamp","at":[419,129],"style":"loop","ms":170,"frames":[["..........................","..........................","............77............","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".................7........","..........................","..........................","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","...................7......","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........77..............","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","....7.................77..","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".........................."],
    ["..........................","..........................","..........................",".............77...........","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".................7........","..........................","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","....................7.....","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".........77...............","..........................","..........................",".........................."],
    ["..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................","....7.....................",".....................77...","..........................","..........................","..........................","..........................","..........................","..........................","..........................","..........................",".........................."]]}]
};
