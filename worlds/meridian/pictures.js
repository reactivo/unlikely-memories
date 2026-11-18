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
rect drawer 124,96,72,9 mix:6,0@0.3 e0
dots drawer_knob 160,100 c14
rect drawer_open 124,96,72,9 0 e0
rect drawer_open_front 124,105,72,8 mix:6,0@0.3 e0
dots drawer_open_knob 160,109 c14
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
rect stair_gate_rail 90,26,140,3 8 e0
line stair_gate_b1 110,28 110,100 c8
line stair_gate_b2 135,28 135,100 c8
line stair_gate_b3 160,28 160,100 c8
line stair_gate_b4 185,28 185,100 c8
line stair_gate_b5 210,28 210,100 c8
rect plate 150,72,20,8 7 e0
rect stair_gate_open_rail 90,16,140,3 8 e0
line stair_gate_open_b1 110,18 110,34 c8
line stair_gate_open_b2 135,18 135,34 c8
line stair_gate_open_b3 160,18 160,34 c8
line stair_gate_open_b4 185,18 185,34 c8
line stair_gate_open_b5 210,18 210,34 c8
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
  shot: "archetype: the icon (the one thing the story turns on: the Meridian Block's lifts, out of order, and the only way up the outside stair); it beat the dwarf (the old cover: the block, a small figure before it). Palette institution, lead dark grey 8, black, brown 6 and light grey 7 for the wall, frames and stair, green 2 and 10 for the Registry's lit door only, white 15 for the notice, the summons and the lamp. Flat shapes with a little mix, as the rooms are. Light: the door's green glow. Dominant: the corner of the block, black, its lift doors shut under a white out-of-order notice crossed out, the floor indicator over them; a light grey stair climbs the face in a diagonal to a landing; on the landing, in the green door, a black silhouette in a cap and coat 70 px tall in rows 164-234 facing the door, back arm hanging, front arm holding the summons (a white sheet) at its side. Question: will they get up the stair to the lit door. Wings: haze blocks, a fence and bins, a yard lamp. Title at the top in white 15. moves: the door's glow pulses, the indicator blinks, the yard lamp flickers, a notice drifts down the face and a moth circles the lamp.",
  title: 15,
  titleAt: "top",
  draw: `# the whole canvas in the lead colour, dark grey: bands and sky are this
rect bg 0,0,480,560 8
# far blocks behind, brown haze against the sky, in the wings
rect far_l1 0,262,64,207 mix:8,6@0.2
rect far_l2 48,316,52,153 mix:8,6@0.3
rect far_r1 408,250,72,219 mix:8,6@0.2
rect far_r2 396,324,40,145 mix:8,6@0.3
rect far_l1w 8,276,48,176 mix:0,6@0.4
rect far_r1w 416,264,56,190 mix:0,6@0.4
# the Meridian Block seen from a corner: the lift wall (left face) and the stair face (right face)
poly wall_l 90,152 250,126 250,468 90,468 0
poly wall_r 250,126 420,156 420,468 250,468 mix:0,8@0.3
line rim_l 90,152 250,126 c7
line rim_r 250,126 420,156 c6
line corner 250,126 250,468 c7
# drain pipes down the wall
line pipe_l 100,158 100,448 c6
line pipe_r 410,156 410,448 c6
# the lift doors, out of order: a light frame, two grey leaves, the gap, a notice across them
poly door_frame 108,172 232,152 232,332 108,352 7
poly leaf_l 112,176 168,167 168,338 112,348 mix:8,7@0.25
poly leaf_r 172,167 228,158 228,328 172,338 mix:8,7@0.25
line gap 170,166 170,338 c0
poly notice 128,250 210,236 212,264 130,278 15
line cross_a 146,256 192,252 c0
line cross_b 148,268 196,262 c0
# the floor indicator over the doors, the fourteenth lit
rect ind_panel 128,142,70,10 8
rect ind_1 131,144,9,6 6
rect ind_2 142,144,9,6 6
rect ind_3 153,144,9,6 6
rect ind_4 164,144,9,6 6
rect ind_14 186,144,9,6 2
# the vents low on the lift wall
line vent_0 104,372 164,372 c8
line vent_1 104,382 164,382 c8
line vent_2 104,392 164,392 c8
line vent_3 104,402 164,402 c8
line vent_4 104,412 164,412 c8
line vent_5 104,422 164,422 c8
line vent_6 104,432 164,432 c8
# dim windows on the stair face, low, the failed lights dark
rect win_0 346,262,54,10 mix:0,6@0.5
rect win_1 346,286,54,10 mix:0,6@0.12
rect win_2 346,310,54,10 mix:0,6@0.5
rect win_3 346,334,54,10 mix:0,6@0.5
rect win_4 346,358,54,10 mix:0,6@0.12
rect win_5 346,382,54,10 mix:0,6@0.5
rect win_6 346,406,54,10 mix:0,6@0.5
rect win_7 346,430,54,10 mix:0,6@0.5
rect win_8 262,376,60,10 mix:0,6@0.5
rect win_9 262,400,60,10 mix:0,6@0.12
rect win_10 262,424,60,10 mix:0,6@0.5
# the stair, the only way up: a wedge of brown under a light grey zigzag, climbing to the landing
poly stair_body 120,468 120,455 132,455 132,442 144,442 144,429 156,429 156,416 168,416 168,403 180,403 180,390 192,390 192,377 204,377 204,364 216,364 216,351 228,351 228,338 240,338 240,325 252,325 252,312 264,312 264,299 276,299 276,286 288,286 288,273 300,273 300,260 312,260 312,247 324,247 324,234 336,234 340,260 150,468 mix:6,0@0.5
line stair_t 120,468 120,455 132,455 132,442 144,442 144,429 156,429 156,416 168,416 168,403 180,403 180,390 192,390 192,377 204,377 204,364 216,364 216,351 228,351 228,338 240,338 240,325 252,325 252,312 264,312 264,299 276,299 276,286 288,286 288,273 300,273 300,260 312,260 312,247 324,247 324,234 336,234 c7
line stair_t2 120,467 120,456 132,456 132,443 144,443 144,430 156,430 156,417 168,417 168,404 180,404 180,391 192,391 192,378 204,378 204,365 216,365 216,352 228,352 228,339 240,339 240,326 252,326 252,313 264,313 264,300 276,300 276,287 288,287 288,274 300,274 300,261 312,261 312,248 324,248 324,235 336,235 c6
# its rail and posts
line rail 126,424 330,190 c7
line post_0 128,455 128,415 c6
line post_3 164,416 164,376 c6
line post_6 200,377 200,337 c6
line post_9 236,338 236,298 c6
line post_12 272,299 272,259 c6
line post_15 308,260 308,220 c6
# the landing before the lit door
rect landing 324,234,80,5 7
rect landing_u 324,239,80,12 mix:6,0@0.5
# the Registry's door: a light frame, green glass, its glow on the face
rect d_rim 332,152,68,82 7
rect d_glass 335,155,62,79 2
rect d_glow 340,160,52,74 10
ellipse d_halo 366,200,70,80 mix:,10@0.1
# the resident on the landing, a black silhouette in a cap and coat, facing the door, the summons in the near hand
ellipse fig_head 364,171,5,6 0
poly fig_cap 357,168 362,162 371,163 378,168 371,167 0
rect fig_neck 362,177,5,3 0
poly fig_body 355,179 373,179 377,200 379,224 351,224 352,200 0
poly fig_arm_b 355,181 351,184 349,206 353,207 356,190 0
poly fig_arm_f 372,181 377,184 381,204 377,206 0
rect fig_leg1 356,224,7,10 0
rect fig_leg2 366,224,7,10 0
rect fig_shoe1 353,232,10,2 0
rect fig_shoe2 366,232,11,2 0
rect fig_sheet_e 377,203,9,13 0
rect fig_sheet 378,204,7,11 15
# the yard: ground, bins, a lamp, a puddle holding the door's light
rect yard 0,448,480,21 0
line yard_l 0,448 480,448 c7
rect pool 340,452,50,14 mix:0,2@0.3
rect pool_s 352,454,26,8 mix:0,10@0.3
rect bin1 20,424,26,24 0
rect bin1_lid 17,420,32,5 0
rect bin2 54,432,22,16 0
line bin1_l 20,424 46,424 c7
line lamp_pole 440,380 440,448 c7
rect lamp_head 432,374,16,6 0
ellipse lamp_halo 440,390,22,14 mix:,6@0.2
ellipse lamp_bulb 440,384,3,3 15
rect fence_0 4,404,2,44 0
rect fence_1 17,404,2,44 0
rect fence_2 30,404,2,44 0
rect fence_3 43,404,2,44 0
rect fence_4 56,404,2,44 0
rect fence_5 69,404,2,44 0
line fence_t 0,404 78,404 c7
line fence_m 0,430 78,430 c6`,
  cycles: [{"name": "the Registry door's glow", "areas": ["d_glow"], "colors": [10, 2], "style": "pingpong", "ms": 1400}, {"name": "the lit indicator", "areas": ["ind_14"], "colors": [2, 6], "style": "blink", "ms": 1100}, {"name": "the yard lamp", "areas": ["lamp_bulb"], "colors": [15, 7], "style": "flicker", "ms": [900, 3200]}],
  loops: [{"name": "a notice drifts down the stair face", "at": [300, 300], "style": "loop", "ms": 260, "frames": [["............", "............", "..ffffff....", "..ffffff....", "..ffffff....", "..ffffff....", "..ffffff....", "............", "............", "............"], ["............", "............", "............", "...ffffff...", "....ffffff..", "....ffffff..", "............", "............", "............", "............"], ["............", "............", "............", "....ff......", "....ff......", "....ff......", "....ff......", "....ff......", "............", "............"], ["............", "............", "............", "..ffffff....", "...ffffff...", "...ffffff...", "............", "............", "............", "............"]]}, {"name": "a moth at the yard lamp", "at": [428, 378], "style": "random", "ms": 180, "frames": [["............", "............", "..7.........", "............", "............", "............", "............", "............"], ["............", "............", "............", "............", ".......7....", "............", "............", "............"], ["............", "............", "............", "..7...7.....", "............", "............", "............", "............"]]}]
};


// ---- The box art (the list of games: ui/home.js): the earlier 480 x 400 cover (16 November 2026), shown as its phone crop, columns 80-399, still. ----
export const boxart = {
 "shot": "archetype: the icon (the world turns on one thing: the Registry's terminal, its column of names each with a green tick and one gap where a tick should be, a cursor waiting in it: am I still on the register?); it beat the dwarf (a small figure under the grey tower: a poster any bureaucratic or haunted building could have, while a column of ticks with one gap is only this world's). Title at the top, in the plain dark grey band (rows 0-95). Palette institution, lead dark grey 8, with brown 6 (the floor, a door), black, light grey 7 and 15, and one green (2 and 10, only on the screen). Light: one cold tube out of frame at the upper left (a lit rim on every left edge, a long dithered shadow running right and down the floor), the screen the brightest thing, and one small caged wall lamp in the right wing. Dominant: the terminal, head on and centred (columns 142-338, rows 112-336): a light grey bezel with a lit left rim and a shaded right edge, a dark green screen with seven name bars (light grey), a light green tick after each except the fourth, where a white cursor waits; on a dark grey neck and base; it stands in a black doorway (an alcove 112-368) like a monolith. No figure. Gradients: the wall, plain at the band and falling into the dark downward (the tube's light above the frame); the floor, brown under the terminal falling to dark toward us. Elements: the summons, a white sheet lying on the lit floor at the terminal's foot, left third (small beside the big); the black cable hanging from the conduit at the right of the doorway, sparking at its cut end. The question: the gap in the ticks with the cursor in it. Wings: left a brown door with a nameplate, a conduit and a drainpipe; right a notice board with three papers, the conduit and a caged lamp with two moths. moves: the cursor (slow pulse), one tick that drops out now and then (flicker), the wall lamp (flicker), the cable's sparks (loop), two moths round the lamp (loop).",
 "title": 15,
 "titleAt": "top",
 "draw": "# the whole canvas in the lead colour, dark grey: the title band is this, plain\nrect bg 0,0,480,400 8\n# the wall: plain at the band, falling into the dark downward (one gradient: the tube's light above the frame)\nrect wall 0,96,480,240 fade:8,0/0,96/0,396\n# the conduits and the drainpipe along the wall\nrect conduit_l 0,116,112,3 7\nrect conduit_r 368,116,112,3 7\nrect pipe_l 70,119,5,217 8\nline pipe_l_rim 70,119 70,335 c7\n# the left wing: a brown door with its nameplate\nrect door_frame 8,160,58,176 0\nrect door 13,165,48,171 6\nrect door_plate 40,196,14,5 7\nellipse door_knob 22,256,2,2 7\n# the right wing: a notice board with three papers\nrect board 408,166,56,62 6 e0\nrect note_a 414,172,14,20 15\nrect note_b 432,176,12,16 7\nrect note_c 448,172,10,22 15\ndots tacks 421,174 438,178 453,174 c0\n# the caged wall lamp on its arm, its halo\nellipse lamp_halo2 432,139,24,15 mix:,15@0.1\nellipse lamp_halo1 432,139,12,8 mix:,15@0.2\nline lamp_arm 432,120 432,133 c0\nrect lamp_cap 426,132,12,3 0\nellipse lamp 432,139,5,3 15\n# the black cable hanging beside the doorway, lit on its left edge\npoly cable 374,119 378,119 381,201 376,201 0\nline cable_rim 374,120 376,200 c7\n# the doorway behind the terminal: a black alcove, its left jamb lit\nrect alcove 112,104,256,232 0 e8\nline jamb 112,105 112,335 c7\n# the floor: brown under the terminal, falling into the dark toward us (the second gradient)\nvp 240,150\nrect floor 0,336,480,64 fade:6,0/0,336/0,426\nline skirt 0,336 480,336 c0\nline joint1 -40,399@1 -40,399@0.75 c8\nline joint2 70,399@1 70,399@0.75 c8\nline joint3 170,399@1 170,399@0.75 c8\nline joint4 310,399@1 310,399@0.75 c8\nline joint5 410,399@1 410,399@0.75 c8\nline joint6 520,399@1 520,399@0.75 c8\nline joint_h1 0,352 480,352 c8\nline joint_h2 0,374 480,374 c8\n# the terminal's long shadow, running right and down the floor, and the thin dark under its foot\npoly shadow 178,337 302,337 520,385 400,385 mix:,0@0.7\nrect contact 176,336,130,3 0\n# the terminal: neck and base, bezel, screen\nrect mon_neck 214,302,52,20 8 e0\nline neck_rim 215,303 215,321 c7\npoly mon_base 184,322 296,322 304,336 176,336 7 e0\nline mon_base_rim 186,323 294,323 c15\nrect mon_bezel 142,112,196,190 7 e0\nrect mon_shade 324,113,13,188 mix:7,8@0.5\nline mon_rim 143,113 143,300 c15\nline mon_rim_t 143,113 336,113 c15\nrect mon_screen 160,128,160,158 2 e0\npoly mon_glare 166,134 204,134 176,206 166,206 mix:,10@0.2\n# seven names (bars), a tick after each but the fourth\nrect name1 174,144,66,6 7\nrect name2 174,164,48,6 7\nrect name3 174,184,74,6 7\nrect name4 174,204,58,6 7\nrect name5 174,224,70,6 7\nrect name6 174,244,52,6 7\nrect name7 174,264,62,6 7\npoly tick1 266,147 269,145 272,148 279,141 281,143 272,151 10\npoly tick2 266,167 269,165 272,168 279,161 281,163 272,171 10\npoly tick3 266,187 269,185 272,188 279,181 281,183 272,191 10\npoly tick5 266,227 269,225 272,228 279,221 281,223 272,231 10\npoly tick6 266,247 269,245 272,248 279,241 281,243 272,251 10\npoly tick7 266,267 269,265 272,268 279,261 281,263 272,271 10\n# the gap, and the cursor waiting in it\nrect cursor 266,202,12,10 15\n# the bezel's vents and its small lamp\nline vent1 170,293 196,293 c8\nline vent2 170,296 196,296 c8\nrect mon_led 306,292,6,3 8\n# the summons lying on the lit floor at the terminal's foot, its small shadow\npoly paper_shadow 192,356 203,359 210,378 198,374 mix:,0@0.8\npoly paper 166,358 192,354 198,374 172,379 15\nline paper_t1 172,364 188,361 c7\nline paper_t2 173,369 190,366 c7",
 "cycles": [
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
 "loops": [
  {
   "name": "the cable's sparks",
   "at": [
    368,
    198
   ],
   "style": "random",
   "ms": 170,
   "frames": [
    [
     "................",
     "................",
     "................",
     "..........f.....",
     ".........7.7....",
     "................",
     "........f.......",
     "...........7....",
     "................",
     "......7.........",
     "................",
     "................"
    ],
    [
     "................",
     "................",
     "................",
     "..........7.....",
     "................",
     "........f...f...",
     "..........7.....",
     "................",
     "....7.......7...",
     "................",
     ".....f..........",
     "................"
    ],
    [
     "................",
     "................",
     "................",
     "..........f.....",
     "...........7....",
     ".........7......",
     "................",
     ".....f.....f....",
     "................",
     "........7.......",
     "...........7....",
     "................"
    ],
    [
     "................",
     "................",
     "................",
     "................",
     "..........7.....",
     "................",
     "...........f....",
     "........7.......",
     "................",
     "..........f.....",
     "................",
     "..............7."
    ]
   ]
  },
  {
   "name": "two moths round the lamp",
   "at": [
    419,
    129
   ],
   "style": "loop",
   "ms": 170,
   "frames": [
    [
     "..........................",
     "..........................",
     "............77............",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".................7........",
     "..........................",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "...................7......",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........77..............",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "....7.................77..",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     ".............77...........",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".................7........",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "....................7.....",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".........77...............",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "....7.....................",
     ".....................77...",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".........................."
    ]
   ]
  }
 ]
};
