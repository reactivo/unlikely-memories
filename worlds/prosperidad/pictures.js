// Prosperidad: every picture is written out by hand, shape by shape. Flat style, 320 x 136.

const flat = {
  version: 1,
  shot: "Eye level, frontal, facing north; lamplight; one candle stub on a beer crate at the left third, its yellow light lying on the wall and the floor beside it, the rest of the room brown going to dark grey in the corners; the {wardrobe} on castors stands across the green {door} on the right third, the {door} showing at its edge; two {mattresses} lie on the boards in front, the left one rumpled, the right one made, a pair of {boots} at the left foot; left wing: the {window} bricked up from outside with one brick missing and a grey line of street light coming in; right wing: a pipe up the wall, a shirt on a nail and a beer crate of bottles; the {candle} is the only light; moves: the candle's flame (flicker), its light on the wall and the floor (lamplight)",
  draw: `# walls and ceiling
rect wall 0,0,320,92 6
rect ceil 0,0,320,12 8
rect ceil_beam 0,12,320,3 0
poly shade_l 0,15 56,15 38,92 0,92 8
poly shade_r 320,15 270,15 286,92 320,92 8
poly stain_a 122,15 170,15 176,38 150,48 126,36 8
poly stain_b 236,60 262,56 266,82 244,88 8
rect bare_a 206,18,14,7 4 e0
rect bare_b 220,25,16,7 4 e0
rect bare_c 200,26,12,7 4 e0
rect bare_d 252,20,14,7 4 e0
line crack_a 90,16 94,28 91,40 96,52 c0
line crack_b 228,36 232,46 229,58 c0
# the bricked window
rect win_frame 12,22,46,54 0
rect win_b1a 15,25,20,8 4 e0
rect win_b1b 36,25,19,8 6 e0
rect win_b2a 15,34,11,8 6 e0
rect win_b2b 27,34,20,8 4 e0
rect win_b2c 48,34,7,8 6 e0
rect win_b3a 15,43,22,8 4 e0
rect win_gap 38,43,12,8 9
rect win_b3b 51,43,4,8 4 e0
rect win_b4a 15,52,12,8 6 e0
rect win_b4b 28,52,22,8 4 e0
rect win_b4c 51,52,4,8 6 e0
rect win_b5a 15,61,19,12 4 e0
rect win_b5b 35,61,20,12 6 e0
rect win_sill 10,75,50,4 7 e0
# pipe, shirt and nail in the right wing
rect pipe 288,0,6,96 8 e0
rect pipe_hi 288,0,2,96 7
rect pipe_band_a 285,38,12,4 7 e0
rect pipe_band_b 285,70,12,4 7 e0
poly shirt 298,34 312,34 316,62 294,62 4 e0
line shirt_fold 303,40 304,58 c0
rect nail 303,30,2,5 0
# floor, in three bands
rect floor_far 0,92,320,12 8
rect floor_mid 0,104,320,14 6
rect floor_near 0,118,320,18 6
line grain_a 0,98 70,98 c0
line grain_b 90,97 190,97 c0
line grain_c 212,98 320,98 c0
rect fm_a 0,104,64,7 8 e0
rect fm_b 64,104,80,7 6 e0
rect fm_c 144,104,60,7 8 e0
rect fm_d 204,104,116,7 6 e0
rect fm_e 0,111,100,7 6 e0
rect fm_f 100,111,70,7 8 e0
rect fm_g 170,111,150,7 6 e0
rect fn_a 0,118,52,9 6 e0
rect fn_b 52,118,70,9 8 e0
rect fn_c 122,118,58,9 6 e0
rect fn_d 180,118,66,9 8 e0
rect fn_e 246,118,74,9 6 e0
rect fn_f 0,127,70,9 8 e0
rect fn_g 70,127,56,9 6 e0
rect fn_h 126,127,72,9 8 e0
rect fn_i 198,127,60,9 6 e0
rect fn_j 258,127,62,9 8 e0
# the beer crate with the candle
poly lit_wall 88,46 118,46 130,92 76,92 14
poly floor_lit 76,98 130,98 138,108 68,108 14
rect bbox 88,96,28,20 6 e0
rect bbox_slat_a 88,102,28,2 0
rect bbox_slat_b 88,108,28,2 0
rect bbox_top 86,94,32,3 14
ellipse glow 102,84,12,9 14
rect candle 100,88,4,7 15 e0
ellipse flame 102,84,2,3 12
rect flame_core 102,83,1,2 14
rect flame_tip_l 100,80,2,3 12
rect flame_tip_r 103,80,2,3 14
# the green door behind the wardrobe
rect door_frame 186,34,58,80 0
rect door 190,38,50,76 2 e0
rect door_p1 196,44,18,30 2 e0
rect door_p2 196,78,18,30 2 e0
rect door_p3 218,44,18,30 2 e0
rect door_p4 218,78,18,30 2 e0
dots door_knob 233,78 233,79 c14
# the wardrobe across it
rect ward_body 176,44,48,70 6 e0
rect ward_lit 176,44,5,70 14
rect ward_dark 219,44,5,70 8
rect ward_d1 184,50,17,56 6 e0
rect ward_d2 203,50,17,56 6 e0
dots ward_handles 199,76 205,76 c14
rect ward_top 173,40,54,5 6 e0
rect ward_top_lit 173,40,54,2 14
rect ward_foot_a 178,114,6,4 0
rect ward_foot_b 216,114,6,4 0
poly ward_shadow 224,114 262,108 262,114 232,120 0
# the bottle crate in the right wing
rect bbox2 262,96,30,22 6 e0
rect bbox2_slat 262,104,30,2 0
rect bottle_a 266,86,4,10 2 e0
rect bottle_b 273,88,4,8 2 e0
rect bottle_c 280,86,4,10 4 e0
# the mattresses
poly mat_a 16,108 138,108 150,126 6,126 7 e0
poly mat_a_edge 6,126 150,126 152,130 4,130 8
poly blanket_a 30,110 110,110 118,122 24,122 8
line blanket_a_fold_a 40,114 90,114 c0
line blanket_a_fold_b 50,118 100,118 c0
rect pillow_a 118,111,16,6 15 e0
poly mat_b 170,106 296,106 312,126 160,126 7 e0
poly mat_b_edge 160,126 312,126 314,130 158,130 8
poly blanket_b 176,108 290,108 302,122 170,122 8
rect blanket_b_fold 176,108,114,3 7
line blanket_b_line 184,116 284,116 c0
rect pillow_b 278,109,16,6 15 e0
# the boots at the left foot
rect boot_a 8,122,7,11 0
rect boot_a_sole 7,131,10,3 8
poly boot_b 18,130 32,127 34,132 18,134 0
dots boot_laces 11,124 11,127 11,130 c7
# light through the gap
poly gap_streak 36,92 46,92 74,122 52,122 9
`,
  cycles: [
    { name: "the candle's flame", areas: ["flame_tip_l", "flame_tip_r"], colors: [12, 14], style: "flicker", ms: [500, 1600] },
    { name: "the candle's light", areas: ["glow", "lit_wall", "floor_lit", "bbox_top"], colors: [14, 6], style: "flicker", ms: [700, 2200] },
  ],
  overlays: [{ object: "radio", at: [146, 110] }],
};

const hall = {
  version: 1,
  shot: "Eye level, one-point view north down a short hall to a small far end, vanishing point on the right third; institution; one bare bulb hanging from a wire at the middle, its white light on the tiled floor beneath; the bank of burst {letterboxes} on the left wall is the subject, big in the middle columns, the {tiles} of the green floor and the dado running to the far street door, the {stairs} climbing the right wall to a bricked landing, a green door at the far end with a thin spill of yellow; left wing: more letterboxes and a cable run, right wing: the wall with the stair rail and a fuse box; the {bulb} is the only light; moves: the bulb (flicker)",
  draw: `vp 213,64
# the shell of the hall
rect back 0,0,320,136 8
poly ceil 0,0@1 320,0@1 320,0@0.14 0,0@0.14 0
poly wall_l 0,0@1 0,0@0.14 0,136@0.14 0,136@1 8
poly wall_r 320,0@1 320,0@0.14 320,136@0.14 320,136@1 8
poly back_wall 0,0@0.14 320,0@0.14 320,136@0.14 0,136@0.14 7
# green tile dado along both walls
poly dado_l 0,92@1 0,92@0.14 0,136@0.14 0,136@1 2
poly dado_r 320,92@1 320,92@0.14 320,136@0.14 320,136@1 2
line dado_l_top 0,92@1 0,92@0.14 c0
line dado_r_top 320,92@1 320,92@0.14 c0
line dado_l_joint_a 0,92@0.9 0,136@0.9 c0
line dado_l_joint_b 0,92@0.8 0,136@0.8 c0
line dado_l_joint_c 0,92@0.7 0,136@0.7 c0
line dado_l_joint_d 0,92@0.6 0,136@0.6 c0
line dado_l_joint_e 0,92@0.5 0,136@0.5 c0
line dado_l_joint_f 0,92@0.4 0,136@0.4 c0
line dado_l_joint_g 0,92@0.3 0,136@0.3 c0
line dado_l_row_a 0,102@1 0,102@0.14 c0
line dado_l_row_b 0,112@1 0,112@0.14 c0
line dado_l_row_c 0,122@1 0,122@0.14 c0
line dado_r_joint_a 320,92@0.9 320,136@0.9 c0
line dado_r_joint_b 320,92@0.8 320,136@0.8 c0
line dado_r_joint_c 320,92@0.7 320,136@0.7 c0
line dado_r_joint_d 320,92@0.6 320,136@0.6 c0
line dado_r_joint_e 320,92@0.5 320,136@0.5 c0
line dado_r_joint_f 320,92@0.4 320,136@0.4 c0
line dado_r_joint_g 320,92@0.3 320,136@0.3 c0
line dado_r_row_a 320,102@1 320,102@0.14 c0
line dado_r_row_b 320,112@1 320,112@0.14 c0
line dado_r_row_c 320,122@1 320,122@0.14 c0
poly damp_l2 0,30@0.5 0,30@0.32 0,50@0.32 0,50@0.5 7
poly damp_r2 320,70@0.55 320,70@0.4 320,86@0.4 320,86@0.55 7
poly scuff_l 0,110@0.9 0,110@0.6 0,124@0.6 0,124@0.9 7
# the floor in bands
poly floor_c 0,136@0.3 320,136@0.3 320,136@0.14 0,136@0.14 7
poly floor_b 0,136@0.6 320,136@0.6 320,136@0.3 0,136@0.3 10
poly floor_a 0,136@1 320,136@1 320,136@0.6 0,136@0.6 2
line joint_a 40,136@1 40,136@0.14 c0
line joint_b 110,136@1 110,136@0.14 c0
line joint_c 180,136@1 180,136@0.14 c0
line joint_d 250,136@1 250,136@0.14 c0
line joint_e 320,136@1 320,136@0.14 c0
line joint_f 0,136@1 0,136@0.14 c0
line cross_a 0,136@0.8 320,136@0.8 c0
line cross_b 0,136@0.6 320,136@0.6 c0
line cross_c 0,136@0.45 320,136@0.45 c0
line cross_d 0,136@0.3 320,136@0.3 c0
poly worn_path 120,136@1 200,136@1 200,136@0.3 150,136@0.3 7
poly lily_a 30,136@0.9 40,136@0.9 40,136@0.8 30,136@0.8 10
poly lily_b 100,136@0.8 110,136@0.8 110,136@0.7 100,136@0.7 10
poly lily_c 240,136@0.9 250,136@0.9 250,136@0.8 240,136@0.8 10
poly lily_d 270,136@0.7 280,136@0.7 280,136@0.6 270,136@0.6 10
# the bank of letterboxes on the left wall
poly lbox_frame 0,30@0.9 0,30@0.4 0,108@0.4 0,108@0.9 0
poly lbox_a1 0,40@0.85 0,40@0.77 0,70@0.77 0,70@0.85 7 e0
poly lbox_a2 0,40@0.77 0,40@0.69 0,70@0.69 0,70@0.77 7 e0
poly lbox_a3 0,40@0.69 0,40@0.61 0,70@0.61 0,70@0.69 7 e0
poly lbox_a4 0,40@0.61 0,40@0.54 0,70@0.54 0,70@0.61 7 e0
poly lbox_a5 0,40@0.54 0,40@0.48 0,70@0.48 0,70@0.54 7 e0
poly lbox_a6 0,40@0.48 0,40@0.42 0,70@0.42 0,70@0.48 7 e0
poly lbox_b1 0,74@0.85 0,74@0.77 0,104@0.77 0,104@0.85 7 e0
poly lbox_b2 0,74@0.77 0,74@0.69 0,104@0.69 0,104@0.77 7 e0
poly lbox_b3 0,74@0.69 0,74@0.61 0,104@0.61 0,104@0.69 7 e0
poly lbox_b4 0,74@0.61 0,74@0.54 0,104@0.54 0,104@0.61 7 e0
poly lbox_b5 0,74@0.54 0,74@0.48 0,104@0.48 0,104@0.54 7 e0
poly lbox_b6 0,74@0.48 0,74@0.42 0,104@0.42 0,104@0.48 7 e0
poly lbox_slot_a1 0,50@0.84 0,50@0.78 0,54@0.78 0,54@0.84 0
poly lbox_slot_a2 0,50@0.76 0,50@0.7 0,54@0.7 0,54@0.76 0
poly lbox_slot_a3 0,50@0.68 0,50@0.62 0,54@0.62 0,54@0.68 0
poly lbox_slot_b2 0,84@0.76 0,84@0.7 0,88@0.7 0,88@0.76 0
poly lbox_slot_b3 0,84@0.68 0,84@0.62 0,88@0.62 0,88@0.68 0
poly lbox_flap_b1 0,76@0.85 0,76@0.78 0,92@0.78 0,92@0.85 0
poly lbox_flap_a4 0,42@0.6 0,42@0.55 0,66@0.55 0,66@0.6 0
# the stairs and the bricked landing on the right wall
poly stair_flight 320,136@0.9 320,136@0.45 320,70@0.45 320,100@0.9 7 e0
poly stair_rail 320,64@0.9 320,64@0.5 320,70@0.5 320,70@0.9 0
line stair_step_a 320,126@0.85 320,126@0.74 c0
line stair_step_b 320,116@0.78 320,116@0.67 c0
line stair_step_c 320,106@0.71 320,106@0.6 c0
line stair_step_d 320,96@0.64 320,96@0.53 c0
poly landing_wall 320,30@0.55 320,30@0.4 320,76@0.4 320,76@0.55 4 e0
poly landing_b1 320,36@0.52 320,36@0.46 320,46@0.46 320,46@0.52 6
poly landing_b2 320,52@0.52 320,52@0.46 320,62@0.46 320,62@0.52 6
poly landing_b3 320,44@0.46 320,44@0.42 320,54@0.42 320,54@0.46 6
poly landing_b4 320,60@0.55 320,60@0.5 320,68@0.5 320,68@0.55 6
poly landing_b5 320,36@0.42 320,36@0.4 320,46@0.4 320,46@0.42 6
poly landing_mortar 320,50@0.55 320,50@0.4 320,52@0.4 320,52@0.55 0
# the far end: a green door to the street
rect street_door_frame 192,56,32,17 0
rect street_door 195,58,26,15 2 e0
rect street_door_glass 204,60,8,6 14
line street_door_spill 202,74 214,74 c14
rect street_door_bar 207,58,2,15 0
dots street_door_handle 214,66 214,67 c14
# the hanging bulb and its light
line bulb_wire 150,0 150,26 c0
rect bulb_cap 148,24,5,4 8
ellipse bulb_glow 150,31,9,7 7
ellipse bulb 150,31,4,4 15
poly floor_lit 100,112 200,112 214,130 86,130 15
# the notice's paper lies on the lit tiles: an overlay, not drawn here
# cable run, fuse box and mark on the walls
line cable_a 0,16@0.9 0,16@0.3 c0
line cable_b 0,22@0.9 0,22@0.3 c8
rect fuse_box 296,30,18,24 7 e0
rect fuse_door 299,33,12,18 8 e0
dots fuse_screws 298,31 312,31 298,53 312,53 c0
line fuse_cable 305,54 305,66 c0
rect fuse_label 300,45,10,3 15
poly damp_l 0,0@0.9 0,0@0.6 0,22@0.6 0,22@0.9 7
poly scuff_r 320,100@0.9 320,100@0.7 320,112@0.7 320,112@0.9 8
poly door_mat 130,136@0.7 190,136@0.7 190,136@0.5 130,136@0.5 8 e0
`,
  cycles: [
    { name: "the bulb", areas: ["bulb", "bulb_glow", "floor_lit"], colors: [15, 7], style: "flicker", ms: [900, 3200] },
  ],
  overlays: [{ object: "notice", at: [140, 108] }],
};

const street = {
  version: 1,
  shot: "Eye level, one-point view north down the street to the Alborada's lit front at the far end, vanishing point on the right third; neon; sky magenta with light magenta at the horizon, buildings blue going to black near; the {marquee} (pink and cyan tubes round a frame of bulbs, a rising-sun symbol, a lit doorway under it) is the subject at the far end, its colours repeated as soft streaks on the wet {road}; left: the lit yellow window of {La Torera} in the building, {shutters} of rolled steel with peeled posters, a dead lamp on the pavement; right: more shutters, one lit upstairs window and a parked car; wings carry on the same street; the marquee is the only light; moves: the running bulbs of the marquee (running sign), one dead stretch of tube (faulty tube)",
  draw: `vp 213,66
rect sky 0,0,320,72 5
rect sky_low 0,50,320,22 13
poly cloud_a 20,14 90,10 112,18 40,22 13
poly cloud_b 200,26 264,22 286,30 214,34 13
poly far_a 96,50 106,38 122,38 126,30 140,30 144,50 1
poly far_b 244,50 250,34 262,34 266,26 284,26 290,50 1
poly far_c 150,50 150,40 170,40 170,50 1
# the two walls of the street
poly bld_l 0,0@1 0,0@0.3 0,136@0.3 0,136@1 1
poly bld_l_near 0,0@1 0,0@0.62 0,136@0.62 0,136@1 0
poly bld_r 320,0@1 320,0@0.3 320,136@0.3 320,136@1 1
poly bld_r_near 320,0@1 320,0@0.62 320,136@0.62 320,136@1 0
poly far_wall 0,0@0.3 320,0@0.3 320,136@0.3 0,136@0.3 1
# upper windows, a few lit
poly win_l1 0,16@0.75 0,16@0.7 0,30@0.7 0,30@0.75 11
poly win_l2 0,16@0.62 0,16@0.57 0,30@0.57 0,30@0.62 1
poly win_l3 0,16@0.5 0,16@0.45 0,30@0.45 0,30@0.5 11
poly win_l4 0,16@0.4 0,16@0.36 0,30@0.36 0,30@0.4 1
poly win_r1 320,18@0.62 320,18@0.56 320,34@0.56 320,34@0.62 11
poly win_r2 320,18@0.5 320,18@0.45 320,34@0.45 320,34@0.5 1
poly win_r3 320,18@0.4 320,18@0.36 320,34@0.36 320,34@0.4 1
# La Torera, the lit window on the left
poly torera_frame 0,58@0.8 0,58@0.58 0,106@0.58 0,106@0.8 6
poly torera_glass 0,62@0.78 0,62@0.6 0,100@0.6 0,100@0.78 14
poly torera_bar 0,82@0.78 0,82@0.6 0,86@0.6 0,86@0.78 6
poly torera_head_a 0,70@0.74 0,70@0.7 0,80@0.7 0,80@0.74 0
poly torera_head_b 0,72@0.67 0,72@0.63 0,82@0.63 0,82@0.67 0
poly torera_door 0,60@0.56 0,60@0.5 0,112@0.5 0,112@0.56 0
poly torera_sign 0,50@0.8 0,50@0.6 0,56@0.6 0,56@0.8 13
# rolled steel shutters
poly shutter_a 0,40@0.99 0,40@0.84 0,112@0.84 0,112@0.99 stripes:8,0
poly shutter_b 0,40@0.46 0,40@0.38 0,112@0.38 0,112@0.46 stripes:8,0
poly shutter_c 320,40@0.99 320,40@0.8 320,112@0.8 320,112@0.99 stripes:8,0
poly shutter_d 320,40@0.74 320,40@0.58 320,112@0.58 320,112@0.74 stripes:8,0
poly shutter_e 320,40@0.5 320,40@0.4 320,112@0.4 320,112@0.5 stripes:8,0
poly shutter_box_a 0,34@0.99 0,34@0.84 0,42@0.84 0,42@0.99 8
poly shutter_box_c 320,34@0.99 320,34@0.8 320,42@0.8 320,42@0.99 8
# peeled posters on the left wing
rect poster_a 8,46,16,22 13
rect poster_b 26,54,14,18 11
poly poster_peel 8,46 14,46 8,56 13
line poster_tear 28,56 34,62 31,70 c0
rect drain_pipe 42,0,4,104 8
rect drain_pipe_hi 42,0,1,104 7
# the pavements
poly pave_l 0,136@1 70,136@1 70,136@0.3 0,136@0.3 8
poly pave_r 250,136@1 320,136@1 320,136@0.3 250,136@0.3 8
line kerb_l 70,136@1 70,136@0.3 c7
line kerb_r 250,136@1 250,136@0.3 c7
line pave_joint_a 0,136@0.85 70,136@0.85 c0
line pave_joint_b 0,136@0.7 70,136@0.7 c0
line pave_joint_c 0,136@0.55 70,136@0.55 c0
line pave_joint_d 250,136@0.85 320,136@0.85 c0
line pave_joint_e 250,136@0.7 320,136@0.7 c0
line pave_joint_f 250,136@0.55 320,136@0.55 c0
# the wet road, in bands
poly road_far 70,136@0.45 250,136@0.45 250,136@0.3 70,136@0.3 5
poly road_mid 70,136@0.75 250,136@0.75 250,136@0.45 70,136@0.45 1
poly road_near 70,136@1 250,136@1 250,136@0.75 70,136@0.75 1
line road_dash_a 160,136@1 160,136@0.8 c8
line road_dash_b 160,136@0.7 160,136@0.55 c8
line road_dash_c 160,136@0.5 160,136@0.4 c8
ellipse manhole 145,123,16,3 8 e0
line manhole_a 135,123 155,123 c0
# the Alborada's front at the far end
rect marq_back 154,52,86,20 0
line marq_tube_t1 158,55 236,55 c13
line marq_tube_t2 158,56 236,56 c13
line marq_tube_b1 158,69 236,69 c11
line marq_tube_b2 158,68 236,68 c11
line marq_tube_l1 158,55 158,69 c11
line marq_tube_r1 236,55 236,69 c11
line marq_tube_dead 200,55 222,55 c13
poly marq_sun 186,66 190,60 197,57 204,60 208,66 14
line marq_ray_a 197,56 197,53 c13
line marq_ray_b 188,58 186,55 c13
line marq_ray_c 206,58 208,55 c13
dots bulb_a 160,52 164,52 168,52 172,52 c13
dots bulb_b 178,52 182,52 186,52 190,52 c13
dots bulb_c 196,52 200,52 204,52 208,52 c13
dots bulb_d 214,52 218,52 222,52 226,52 c13
dots bulb_e 232,52 236,52 238,56 238,62 c13
dots bulb_f 238,68 232,72 226,72 220,72 c13
rect doorway 186,73,26,14 0
rect door_glow 190,75,18,12 11
rect door_pad_l 186,73,4,14 4
rect door_pad_r 208,73,4,14 4
poly queue_a 192,87 192,80 195,78 198,80 198,87 0
poly queue_b 199,87 199,81 202,79 205,81 205,87 0
rect marq_pill_l 160,76,6,8 13
rect marq_pill_r 222,76,6,8 11
# streaks of the sign on the wet road
line streak_a 180,92 180,108 c13
line streak_b 190,92 190,112 c11
line streak_c 200,92 200,104 c13
line streak_d 210,92 210,110 c11
line streak_e 220,92 220,106 c13
line streak_f 232,95 232,104 c11
dots road_glint_a 175,98 185,104 195,100 205,108 215,102 c15
# the dead lamp on the left pavement
rect lamp_pole 78,34,3,92 8
rect lamp_pole_hi 78,34,1,92 7
poly lamp_arm 78,36 96,32 98,36 80,40 8
ellipse lamp_head 99,35,4,3 1
rect lamp_foot 74,122,11,4 7 e0
# a parked car on the right
poly car_body 262,112 270,100 292,96 316,100 320,112 320,124 262,124 0
poly car_win 272,100 290,97 306,100 308,107 270,107 1
rect car_wheel_a 268,120,16,8 8
rect car_wheel_b 298,120,16,8 8
line car_light 264,112 268,112 c4
rect car_plate 296,116,8,3 15
# the Minister's overlay stands near La Torera; shutters, posters and kerb carry the wings
poly bin 252,100 262,100 260,122 254,122 8 e0
rect bin_lid 250,98,14,3 7
`,
  cycles: [
    { name: "the running bulbs", areas: ["bulb_a", "bulb_b", "bulb_c", "bulb_d", "bulb_e", "bulb_f"], colors: [13, 5], rest: 5, style: "rotate", sweep: true, ms: 300 },
    { name: "the faulty tube", areas: ["marq_tube_dead"], colors: [13, 5], style: "flicker", ms: [800, 4000] },
  ],
  overlays: [{ object: "minister", at: [58, 124], tall: 60 }],
};


const bar = {
  version: 1,
  shot: "Eye level, frontal, facing north across the room to the {bar}; lamplight; one yellow lamp on a red shade hanging at the middle, its light lying on the wall behind and on the floor beneath; Rufino stands behind the {bar} on the left third, his white apron the lightest thing on him; on the right third the chalk {slate} of debts, a black board with white chalk strokes and sums; a {television} on a bracket high on the left, a glass {dome} of sandwiches on the zinc, a row of beer {taps} on the {bar}, five {stools} before it, shelves of bottles on the back wall; left wing: a calendar and an old coat on a hook, right wing: the street door with its glass; the {lamp} is the only light, the {television}'s blue a small second one; moves: the lamp (lamplight), the television's screen (flicker)",
  draw: `rect wall 0,0,320,116 6
rect ceil 0,0,320,10 8
rect ceil_beam 0,10,320,3 0
poly shade_l 0,13 50,13 34,116 0,116 8
poly shade_r 320,13 276,13 290,116 320,116 8
poly stain_a 220,14 262,14 266,30 238,36 8
rect plaster_a 60,18,30,16 8
rect bare_a 252,40,14,7 4 e0
rect bare_b 266,47,14,7 4 e0
line crack_a 130,14 134,26 131,38 136,48 c0
# the floor in bands
rect floor_far 0,116,320,8 8
rect floor_mid 0,124,320,6 6
rect floor_a 0,130,40,6 8 e0
rect floor_b 40,130,70,6 6 e0
rect floor_c 110,130,60,6 8 e0
rect floor_d 170,130,80,6 6 e0
rect floor_e 250,130,70,6 8 e0
poly floor_lit 118,124 200,124 206,136 112,136 14
# shelves of bottles on the back wall
rect shelf_a 94,40,64,3 0
rect shelf_b 94,58,64,3 0
rect bottle_a1 98,30,5,10 2 e0
rect bottle_a2 106,32,5,8 4 e0
rect bottle_a3 114,28,5,12 2 e0
rect bottle_a4 122,31,5,9 6 e0
rect bottle_a5 130,29,5,11 2 e0
rect bottle_a6 138,32,5,8 4 e0
rect bottle_a7 146,30,5,10 2 e0
rect bottle_b1 100,48,5,10 4 e0
rect bottle_b2 108,46,5,12 2 e0
rect bottle_b3 118,49,5,9 6 e0
rect bottle_b4 126,47,5,11 2 e0
rect bottle_b5 136,48,5,10 4 e0
rect bottle_b6 144,46,5,12 2 e0
# the lamp
poly lit_wall 138,64 182,64 196,92 124,92 14
ellipse lamp_glow 160,30,18,8 14
line lamp_wire 160,0 160,14 c0
poly lamp_shade 148,14 172,14 178,26 142,26 4 e0
ellipse lamp_bulb 160,28,5,2 14
# the slate of debts
rect slate_frame 200,24,50,52 6 e0
rect slate 204,28,42,44 0
line chalk_a 208,36 226,36 c15
line chalk_b 208,42 238,42 c7
line chalk_c 208,48 222,48 c15
line chalk_d 208,54 240,54 c7
line chalk_e 208,60 230,60 c15
line chalk_f 208,66 216,66 c7
line chalk_sum 232,60 242,60 c15
rect slate_ledge 202,76,46,3 6 e0
rect chalk_stub 214,74,6,2 15
# the television on its bracket
rect tv_bracket 60,22,4,16 8
rect tv_body 40,10,48,32 8 e0
rect tv_screen 44,14,36,24 9
rect tv_man_a 50,20,6,16 1
rect tv_man_b 62,22,6,14 1
rect tv_knob 82,16,3,3 7
poly tv_light 44,46 80,46 92,62 34,62 9
# Rufino behind the bar
rect rufino_apron 100,66,26,30 15
poly rufino_shirt 98,58 128,58 132,70 94,70 4
rect rufino_arm_l 90,66,7,26 7
rect rufino_arm_r 128,66,7,26 7
ellipse rufino_head 113,50,8,9 7
poly rufino_hair 105,46 113,40 121,46 121,50 105,50 8
dots rufino_eye 110,50 116,50 c0
rect rufino_hand 94,90,8,4 7
outline rufino e0
# the left wing: a calendar and an old coat on a hook
rect calendar 12,34,18,26 15 e0
rect calendar_pic 14,36,14,12 11
rect calendar_strip 14,50,14,8 7
poly coat_hook 36,44 44,44 42,52 38,52 8
poly old_coat 32,52 48,52 52,86 28,86 6 e0
line coat_fold 38,56 38,82 c0
# the right wing: the street door and its glass
rect door_frame 288,28,26,66 0
rect door_leaf 291,31,20,60 8 e0
rect door_glass 294,36,14,18 13
rect door_bar 300,36,2,18 0
# the counter and its zinc top
rect counter_top 20,92,270,7 7 e0
rect counter_top_hi 20,92,270,2 15
rect counter_front 20,99,270,17 8
rect counter_panel_a 26,102,60,11 6 e0
rect counter_panel_b 92,102,60,11 6 e0
rect counter_panel_c 158,102,60,11 6 e0
rect counter_panel_d 224,102,60,11 6 e0
rect counter_rail 20,113,270,3 7
rect counter_dent 150,92,10,2 8
# the taps
rect tap_base 56,84,60,8 7 e0
rect tap_a 62,76,4,10 15
rect tap_b 76,76,4,10 15
rect tap_c 90,76,4,10 15
rect tap_d 104,76,4,10 15
# the dome of sandwiches
ellipse dome_base 210,90,16,3 7
poly dome 194,90 196,78 206,72 214,72 224,78 226,90 11 e0
rect dome_roll_a 198,82,12,8 14 e0
rect dome_roll_b 212,84,12,6 6 e0
dots dome_glint 200,76 204,74 c15
# the stools before the bar
rect stool_a_seat 30,110,22,6 8 e0
line stool_a_leg_l 34,116 32,134 c0
line stool_a_leg_r 48,116 50,134 c0
rect stool_b_seat 112,112,22,6 8 e0
line stool_b_leg_l 116,118 114,134 c0
line stool_b_leg_r 130,118 132,134 c0
rect stool_c_seat 196,112,22,6 8 e0
line stool_c_leg_l 200,118 198,134 c0
line stool_c_leg_r 214,118 216,134 c0
rect stool_d_seat 244,110,22,6 8 e0
line stool_d_leg_l 248,116 246,134 c0
line stool_d_leg_r 262,116 264,134 c0
rect stool_e_seat 284,112,22,6 8 e0
line stool_e_leg_l 288,118 286,134 c0
line stool_e_leg_r 302,118 304,134 c0
rect mat 280,130,38,5 8 e0
poly floor_stain 70,122 96,122 100,128 66,128 8
`,
  cycles: [
    { name: "the lamp", areas: ["lamp_bulb", "lamp_glow", "lit_wall", "floor_lit"], colors: [14, 6], style: "flicker", ms: [700, 2200] },
    { name: "the television", areas: ["tv_screen", "tv_light"], colors: [9, 1], style: "flicker", ms: [2000, 6000] },
  ],
  overlays: [{ object: "minister", at: [275, 130], tall: 62 }],
};

const kerb = {
  version: 1,
  shot: "Wide view from the road, facing north across the {railing} to the pavement and the Avenida's bridge beyond; neon; sky magenta with light magenta at the horizon, a row of blue buildings, the bridge deck black with a string of {headlights} crossing it; three {lamps} on the pavement, the left and the right lit white with a pool of light magenta under each, the middle one dead; Dolo stands on the pavement on the left third in a man's brown overcoat hanging open over bare skin, her bare legs and the strip of skin the lightest things on her, a hard pink rim on her lit side, black hair; two other {women} in black silhouette under the left lamp and one under the right; a car slowing on the right with its beam on the wet {road}; left wing: shuttered doors and a lit window; right wing: the next lit lamp and the parked row; moves: the headlights on the bridge (running lights), the dead lamp trying to light (faulty)",
  draw: `rect sky 0,0,320,60 5
rect sky_low 0,44,320,16 13
poly cloud_a 30,12 96,8 118,16 50,20 13
poly cloud_b 214,20 280,16 300,24 230,28 13
poly far_a 0,60 0,44 20,44 24,38 44,38 48,60 1
poly far_b 120,60 126,40 146,40 150,34 170,34 174,60 1
poly far_c 270,60 274,42 296,42 300,50 320,50 320,60 1
# the bridge over the far end
rect bridge_rail 0,30,320,4 8
rect bridge_deck 0,34,320,9 0
rect bridge_under 0,43,320,3 8
rect pier_a 56,46,12,34 0
rect pier_b 150,46,12,34 0
rect pier_c 252,46,12,34 0
dots hl_a 20,38 26,38 32,38 c15
dots hl_b 70,38 76,38 82,38 88,38 c15
dots hl_c 126,38 132,38 138,38 c15
dots hl_d 190,38 196,38 202,38 208,38 c15
dots hl_e 270,38 276,38 282,38 c15
# the row of buildings behind the pavement
rect bld_row 0,60,320,38 1
poly bld_top_a 0,60 12,54 40,54 52,60 1
poly bld_top_b 190,60 200,52 236,52 244,60 1
rect win_a 14,66,7,9 11
rect win_b 28,66,7,9 0
rect win_c 56,64,7,9 0
rect win_d 100,66,7,9 11
rect win_e 126,66,7,9 0
rect win_f 170,66,7,9 0
rect win_g 214,64,7,9 11
rect win_h 258,66,7,9 0
rect win_i 296,64,7,9 11
rect shutter_a 6,80,32,18 stripes:8,0
rect shutter_b 78,80,26,18 stripes:8,0
rect shutter_c 156,80,30,18 stripes:8,0
rect shutter_d 262,80,32,18 stripes:8,0
rect door_a 118,76,22,22 0
rect door_b 218,78,20,20 0
# the pavement
rect pave_far 0,98,320,8 5
rect pave_near 0,106,320,14 1
line pj_a 24,106 18,120 c0
line pj_b 70,106 66,120 c0
line pj_c 118,106 116,120 c0
line pj_d 166,106 166,120 c0
line pj_e 214,106 216,120 c0
line pj_f 262,106 266,120 c0
line pj_g 306,106 312,120 c0
poly pool_a 30,110 76,110 86,119 22,119 13
poly pool_c 208,110 256,110 266,119 198,119 13
# lamps
rect lamp_a_pole 51,52,3,60 8
poly lamp_a_arm 52,52 68,46 70,50 54,56 8
ellipse lamp_a_head 70,48,5,3 15
rect lamp_b_pole 149,52,3,60 8
poly lamp_b_arm 150,52 166,46 168,50 152,56 8
ellipse lamp_b_head 168,48,5,3 1
rect lamp_c_pole 231,52,3,60 8
poly lamp_c_arm 232,52 248,46 250,50 234,56 8
ellipse lamp_c_head 250,48,5,3 15
# two women under the left lamp
poly wa_body 28,76 40,76 44,110 24,110 0
ellipse wa_head 34,70,5,6 0
poly wa_hair 29,66 35,62 41,68 40,74 30,72 0
rect wa_leg 30,108,4,6 0
rect wa_bag 40,92,7,8 4 e0
line wa_rim 40,76 43,108 c13
poly wb_body 62,80 72,80 76,110 58,110 0
ellipse wb_head 67,74,4,5 0
poly wb_hair 62,70 67,66 72,72 71,76 63,76 0
rect wb_leg 64,108,4,6 0
line wb_rim 72,80 75,108 c13
# Dolo, between the lamps
rect dolo_leg_l 100,92,5,20 15
rect dolo_leg_r 108,92,5,20 15
rect dolo_leg_shade 110,92,3,20 7
rect dolo_shoe_l 98,110,8,3 0
rect dolo_shoe_r 108,110,8,3 0
poly dolo_coat 94,58 122,58 128,100 90,100 6
poly dolo_gap 106,60 113,60 114,98 105,98 15
rect dolo_shade 112,60,2,38 7
ellipse dolo_breast 106,72,3,3 15
rect dolo_breast_shade 104,75,5,1 7
poly dolo_arm_l 90,60 97,60 96,96 88,96 6
poly dolo_arm_r 120,60 127,60 129,92 121,92 6
ellipse dolo_hand_l 92,97,3,3 15
ellipse dolo_hand_r 125,94,3,3 15
rect dolo_neck 105,54,5,6 15
ellipse dolo_head 107,48,6,8 15
poly dolo_hair 99,46 107,38 117,44 119,58 114,60 113,50 100,54 0
dots dolo_mouth 106,53 109,53 c4
line dolo_rim 120,62 126,98 c13
outline dolo e8
# the railing in front of the pavement
rect rail_top 0,108,320,2 8
rect rail_mid 0,114,320,2 8
rect rail_post_a 12,108,2,14 8
rect rail_post_b 52,108,2,14 8
rect rail_post_c 92,108,2,14 8
rect rail_post_d 132,108,2,14 8
rect rail_post_e 172,108,2,14 8
rect rail_post_f 212,108,2,14 8
rect rail_post_g 252,108,2,14 8
rect rail_post_h 292,108,2,14 8
rect rail_hip 86,108,16,2 7
# the third woman under the right lamp
poly wc_body 238,80 250,80 254,112 234,112 0
ellipse wc_head 244,74,5,6 0
poly wc_hair 239,70 245,66 251,72 250,78 240,76 0
line wc_rim 250,80 253,110 c13
# the kerb and the wet road
rect kerb 0,121,320,3 7 e0
rect road_far 0,124,320,5 1
rect road_near 0,129,320,7 1
line road_dash_a 10,132 40,132 c8
line road_dash_b 90,131 126,131 c8
line road_dash_c 180,132 214,132 c8
line road_dash_d 270,131 300,131 c8
line streak_a 52,124 52,134 c13
line streak_b 70,124 70,130 c11
line streak_c 232,124 232,134 c13
line streak_d 250,124 250,131 c11
dots road_glint 56,127 64,130 150,126 160,128 238,128 246,131 c15
# a car slowing on the right
poly car_body 258,128 266,118 290,114 316,118 320,128 320,136 258,136 0
poly car_win 268,118 288,115 304,118 306,125 266,125 1
poly car_beam 258,130 220,127 220,135 258,134 14
rect car_wheel 266,132,16,4 8
line car_light 258,128 262,128 c4
# left and right wings
rect step_a 6,114,22,4 7 e0
poly bin 296,100 306,100 304,120 298,120 8 e0
rect bin_lid 294,98,14,3 7
`,
  cycles: [
    { name: "the headlights", areas: ["hl_a", "hl_b", "hl_c", "hl_d", "hl_e"], colors: [15, 0], rest: 4, style: "rotate", sweep: true, ms: 300 },
    { name: "the dead lamp", areas: ["lamp_b_head"], colors: [1, 11], style: "flicker", ms: [3000, 9000] },
  ],
  overlays: [{ object: "minister", at: [190, 118], tall: 54 }],
};

const plaza = {
  version: 1,
  shot: "Eye level, frontal, facing north across a small paved square, an open place in layers; neon; sky magenta with light magenta at the horizon, a row of blue buildings with a few lit windows (one with a woman's black shape in it), four pruned {acacias} in black with thin regrowth; the concrete {bench} on the left third with a {lad} slumped against it on the ground, light grey school jacket, pale face with blue lips, black hair, a paper in his fist; the {syringe} with its orange cap lying by the drain in the front; the phone box on the right third, its glass lit light cyan, its light lying on the slabs; wings: more slabs and a kerb, a window above; the phone box is the only light; moves: the phone box's light (flicker), the window above (faulty light)",
  draw: `rect sky 0,0,320,56 5
rect sky_low 0,40,320,16 13
poly cloud_a 20,14 80,10 102,18 36,22 13
poly cloud_b 230,20 290,16 308,24 244,28 13
poly far_a 0,56 0,36 24,36 28,30 52,30 56,56 1
poly far_b 250,56 254,34 280,34 284,26 316,26 320,56 1
# the row of buildings round the square
rect bld_row 0,50,320,44 1
rect bld_floor_a 0,50,320,3 0
rect win_a 12,58,8,10 11
rect win_b 30,58,8,10 0
rect win_c 48,58,8,10 0
rect win_d 76,60,8,10 11
rect win_e 104,58,8,10 0
rect win_f 150,60,8,10 0
rect win_g 176,58,8,10 11
rect win_h 250,58,8,10 0
rect win_i 280,60,8,10 11
poly woman_window 177,68 178,62 182,62 183,68 0
rect shutter_a 6,76,34,18 stripes:8,0
rect shutter_b 120,76,30,18 stripes:8,0
rect shutter_c 262,76,40,18 stripes:8,0
rect door_a 56,72,22,22 0
rect door_b 214,74,10,20 0
# four pruned acacias
rect tree_a_trunk 38,56,5,40 0
poly tree_a_stump 30,56 36,46 44,44 52,52 48,58 32,60 0
poly tree_a_sprout 34,48 38,40 42,46 40,50 1
rect tree_b_trunk 140,60,5,36 0
poly tree_b_stump 132,60 138,50 146,48 154,56 150,62 134,64 0
poly tree_b_sprout 136,52 140,44 146,50 144,54 1
rect tree_c_trunk 232,58,5,38 0
poly tree_c_stump 224,58 230,48 238,46 246,54 242,60 226,62 0
poly tree_c_sprout 228,50 232,42 238,48 236,52 1
rect tree_d_trunk 292,56,5,40 0
poly tree_d_stump 284,56 290,46 298,44 306,52 302,58 286,60 0
poly tree_d_sprout 288,48 292,40 298,46 296,50 1
line tree_a_branch_a 34,52 26,44 c0
line tree_a_branch_b 44,50 52,42 c0
line tree_b_branch_a 136,56 128,48 c0
line tree_b_branch_b 146,54 154,46 c0
line tree_c_branch_a 228,54 220,46 c0
line tree_c_branch_b 238,52 246,44 c0
line tree_d_branch_a 290,52 282,44 c0
line tree_d_branch_b 300,50 308,42 c0
# the paving in bands
rect pave_far 0,94,320,8 5
rect pave_mid 0,102,320,14 1
rect pave_near 0,116,320,20 1
line slab_a 0,106 320,106 c0
line slab_b 0,112 320,112 c0
line slab_c 0,122 320,122 c0
line slab_d 0,130 320,130 c0
line slab_v1 20,102 14,116 c0
line slab_v2 72,102 68,116 c0
line slab_v3 128,102 126,116 c0
line slab_v4 190,102 190,116 c0
line slab_v5 250,102 254,116 c0
line slab_v6 304,102 310,116 c0
line slab_v7 40,116 28,136 c0
line slab_v8 110,116 104,136 c0
line slab_v9 180,116 180,136 c0
line slab_v10 252,116 262,136 c0
poly pave_crack 224,118 236,124 230,130 240,136 8
ellipse puddle_a 60,128,14,3 13
ellipse puddle_b 250,126,12,2 11
dots puddle_glint 56,128 62,128 248,126 c15
poly litter_a 40,130 52,128 56,132 44,134 8
line pave_crack_b 90,120 98,128 94,136 c0
rect gutter_edge 120,122,72,2 8
# the phone box
poly box_glow 196,114 240,114 250,126 186,126 13
rect box_frame 198,48,34,62 8 e0
rect box_glass 202,52,26,54 11
rect box_bar_a 214,52,2,54 8
rect box_bar_b 202,76,26,2 8
rect box_phone 206,82,8,12 0
rect box_roof 196,44,38,5 7 e0
rect box_sign 204,56,10,6 13
rect box_foot 198,108,34,3 0
rect box_numbers 206,64,10,8 7 e0
dots box_dial 208,66 211,66 214,66 208,69 211,69 214,69 c0
rect box_coin 210,74,3,5 7
line box_cord 207,92 207,102 c0
rect box_door_seam 216,52,1,54 0
# the bench and the lad slumped against it
rect bench_back 62,78,92,10 8 e0
rect bench_seat 58,90,100,7 7 e0
rect bench_leg_a 66,97,7,16 8 e0
rect bench_leg_b 142,97,7,16 8 e0
rect bench_slab 58,97,100,2 8
poly bench_shadow 154,113 176,110 176,114 150,116 0
line bench_plank_a 64,82 152,82 c0
line bench_plank_b 64,85 152,85 c0
line bench_hatch_a 66,100 100,100 c0
line bench_hatch_b 70,104 104,104 c0
ellipse pigeon_body 130,76,5,3 8
ellipse pigeon_head 135,74,2,2 8
dots pigeon_eye 136,74 c15
poly lad_legs 80,106 116,108 118,114 80,114 8
ellipse lad_shoe_l 119,112,4,3 0
ellipse lad_shoe_r 115,116,4,2 0
poly lad_body 76,82 92,80 98,106 78,108 7
poly lad_arm 90,88 100,100 96,106 88,98 7
rect lad_fist 97,104,5,4 15
ellipse lad_head 79,76,6,7 15
dots lad_lips 77,79 79,79 c11
poly lad_hair 73,72 79,66 87,72 85,76 75,76 0
# the syringe and the drain in the front
rect drain 128,124,60,6 0
line drain_bar_a 136,124 136,130 c8
line drain_bar_b 150,124 150,130 c8
line drain_bar_c 164,124 164,130 c8
line drain_bar_d 178,124 178,130 c8
rect syringe_cap 142,119,5,3 12
line syringe_needle 147,120 156,119 c7
rect syringe_barrel 134,118,8,3 7
# left wing: a kerb and a litter bin; right wing: a bollard
rect kerb_l 0,118,28,4 7 e0
poly bin 6,96 16,96 14,118 8,118 8 e0
rect bin_lid 4,94,14,3 7
rect bollard 300,100,6,18 7 e0
rect bollard_top 300,98,6,3 15
`,
  cycles: [
    { name: "the phone box light", areas: ["box_glass"], colors: [11, 3], style: "flicker", ms: [1200, 4000] },
    { name: "the window above", areas: ["win_g"], colors: [11, 1], style: "flicker", ms: [3000, 9000] },
  ],
  overlays: [{ object: "wrap", at: [119, 114] }, { object: "minister", at: [262, 120], tall: 62 }],
};

const front = {
  version: 1,
  shot: "Seen from the pavement, a little low, frontal, facing north to the old cinema's front; neon; sky magenta with light magenta at the horizon, a blue facade going to black near the eaves; the {marquee} (pink and cyan tubes round a frame of bulbs with two dead in the corner, a rising-sun symbol) across the top, the red padded {doors} below it with a lit porthole in each, Nando the doorman on the right third filling the doorway in black against the red, a bald pale head, arms folded; on the left the {poster} case with a painted nude woman on a bed beside a bottle, and above it the green pharmacy {cross} on the left wing; on the right wing the short {queue} leaning on each other, one with a bottle in a paper bag; wet pavement taking the marquee's colours; the marquee is the only light; moves: the running bulbs (running sign), one faulty stretch of tube (faulty tube), one arm of the green cross (faulty)",
  draw: `rect sky 0,0,320,20 5
rect sky_low 0,10,320,10 13
poly far_a 0,20 0,8 30,8 34,2 60,2 64,20 1
poly far_b 250,20 254,6 280,6 284,0 316,0 320,20 1
rect facade 0,14,320,88 1
rect facade_cornice 0,14,320,4 0
poly facade_stain 100,60 140,58 150,90 110,94 0
poly facade_peel 20,22 40,20 44,34 24,36 13
rect facade_b1 8,60,18,8 8 e0
rect facade_b2 28,60,20,8 8 e0
rect facade_b3 18,70,20,8 8 e0
rect facade_b4 8,80,18,8 8 e0
rect facade_b5 28,80,20,8 8 e0
rect facade_b6 268,60,18,8 8 e0
rect facade_b7 288,60,20,8 8 e0
rect facade_b8 278,70,20,8 8 e0
rect facade_pipe 310,18,5,86 8 e0
rect facade_pipe_hi 310,18,1,86 7
# the marquee
poly marq_box 80,24 296,24 304,56 72,56 0
poly marq_face 84,28 292,28 298,52 78,52 1
line marq_tube_t1 86,30 290,30 c13
line marq_tube_t2 86,31 290,31 c13
line marq_tube_b1 80,50 296,50 c11
line marq_tube_b2 80,49 296,49 c11
line marq_tube_l 84,30 80,50 c11
line marq_tube_r 288,30 296,50 c11
line marq_tube_fault 120,30 160,30 c13
line marq_tube_dead 230,31 262,31 c5
poly marq_sun 160,50 166,40 188,35 210,40 216,50 14
line marq_ray_a 188,34 188,30 c13
line marq_ray_b 172,38 168,34 c13
line marq_ray_c 204,38 208,34 c13
dots bulb_a 86,25 96,25 106,25 116,25 c13
dots bulb_b 126,25 136,25 146,25 156,25 c13
dots bulb_c 166,25 176,25 186,25 196,25 c13
dots bulb_d 206,25 216,25 226,25 236,25 c13
dots bulb_e 246,25 256,25 266,25 276,25 c13
dots bulb_f 286,25 292,25 296,30 300,40 c13
dots bulb_dead 74,40 76,48 78,54 c5
# the doors
rect door_frame 140,58,112,46 0
rect door_l 144,62,50,42 4 e0
rect door_r 198,62,50,42 4 e0
line door_quilt_a 152,70 186,70 c12
line door_quilt_b 152,80 186,80 c12
line door_quilt_c 152,90 186,90 c12
line door_quilt_d 206,70 240,70 c12
line door_quilt_e 206,80 240,80 c12
line door_quilt_f 206,90 240,90 c12
rect door_handle_l 190,82,3,8 14 e0
rect door_handle_r 199,82,3,8 14 e0
rect door_plate_l 148,96,42,5 6 e0
rect door_plate_r 202,96,42,5 6 e0
rect door_light_l 168,62,4,2 14
rect door_light_r 220,62,4,2 14
ellipse porthole_l 170,76,5,5 11
ellipse porthole_r 222,76,5,5 11
rect door_crack 195,62,3,42 0
rect door_step 134,102,124,4 7 e0
# the pavement in bands
rect pave_far 0,106,320,8 5
rect pave_mid 0,114,320,10 1
rect pave_near 0,124,320,12 1
line slab_a 0,114 320,114 c0
line slab_b 0,124 320,124 c0
line slab_v1 30,106 22,136 c0
line slab_v2 96,106 92,136 c0
line slab_v3 164,106 164,136 c0
line slab_v4 232,106 238,136 c0
line slab_v5 296,106 306,136 c0
poly door_spill 144,106 248,106 262,124 130,124 13
line streak_a 150,108 150,120 c13
line streak_b 170,108 170,126 c11
line streak_c 190,108 190,118 c13
line streak_d 210,108 210,124 c11
line streak_e 230,108 230,120 c13
dots pave_glint 160,116 180,122 200,114 220,120 c15
# Nando, filling the doorway
poly nando_body 208,52 250,52 256,104 204,104 0
rect nando_arms 214,70,30,9 0
ellipse nando_head 229,42,8,9 7
rect nando_neck 224,50,10,4 0
rect nando_hand_l 216,70,5,4 7
rect nando_hand_r 237,70,5,4 7
line nando_rim 250,54 255,102 c13
# the poster case on the left
rect case_frame 12,58,50,48 8 e0
rect poster_bg 16,62,42,40 13
rect poster_bed 18,88,38,8 4
poly poster_woman 20,84 54,80 56,88 22,92 15
poly poster_shade 22,89 54,86 56,88 22,92 7
ellipse poster_head 18,82,4,4 15
poly poster_hair 14,78 20,76 22,84 16,84 0
rect poster_bottle 50,86,3,10 2
rect poster_strip 18,64,34,6 14
poly poster_peel 46,62 58,62 58,74 13
poly poster_peel_back 46,62 58,74 52,74 15
rect case_foot 16,106,42,3 8
rect case_lock 36,104,6,3 14
line case_glare 18,64 40,100 c15
# the green cross on the left wing
line cross_bracket 6,22 24,22 c8
rect cross_post 17,22,3,8 8
rect cross_a 14,30,9,26 10
rect cross_b 6,38,26,9 10
rect cross_edge_a 14,30,2,26 2
rect cross_edge_b 6,38,26,2 2
# the queue on the right wing
poly q_a 262,98 262,70 266,66 272,68 274,98 0
ellipse q_a_head 268,62,4,5 0
poly q_b 276,98 276,74 281,70 288,72 290,98 0
ellipse q_b_head 283,66,4,5 0
poly q_c 292,98 292,72 297,68 304,70 308,98 0
ellipse q_c_head 299,63,4,5 0
rect q_bag 304,76,6,9 6 e0
rect q_bottle 306,70,2,6 2
line q_rim 274,72 274,96 c13
rect q_curb 256,100,64,3 7 e0
rect q_hand 300,80,4,3 7
line q_scarf 268,68 270,74 c4
`,
  cycles: [
    { name: "the running bulbs", areas: ["bulb_a", "bulb_b", "bulb_c", "bulb_d", "bulb_e", "bulb_f"], colors: [13, 5], rest: 5, style: "rotate", sweep: true, ms: 300 },
    { name: "the faulty tube", areas: ["marq_tube_fault"], colors: [13, 5], style: "flicker", ms: [800, 4000] },
    { name: "the green cross", areas: ["cross_b"], colors: [10, 2], style: "flicker", ms: [900, 3600] },
  ],
  overlays: [],
};

const foyer = {
  version: 1,
  shot: "Eye level, one-point view north down the foyer to the padded double {doors} at the far end, vanishing point on the right third; arcade; blue walls going to black near, a magenta ceiling with two yellow globes; the {doors} at the far end on the right third are the subject, with light cyan seeping round their edges and a patch of it on the {carpet}; on the left the marble {counter} with its brass grille, in front of it a {chalkboard} on an easel, black with chalk strokes; on the right the {stairs} climbing the wall in worn red carpet; the red {carpet} worn to its string in a path from the street door to the doors; left wing: the counter's end and the easel's legs, right wing: the foot of the stairs with a newel post; the doors are the main light; moves: the light round the doors (flicker)",
  draw: `vp 213,64
rect back 0,0,320,136 1
poly ceil 0,0@1 320,0@1 320,0@0.3 0,0@0.3 5
poly ceil_far 0,0@0.55 320,0@0.55 320,0@0.3 0,0@0.3 13
poly wall_l 0,0@1 0,0@0.3 0,136@0.3 0,136@1 1
poly wall_r 320,0@1 320,0@0.3 320,136@0.3 320,136@1 1
poly wall_l_near 0,0@1 0,0@0.72 0,136@0.72 0,136@1 0
poly wall_r_near 320,0@1 320,0@0.78 320,136@0.78 320,136@1 0
poly back_wall 0,0@0.3 320,0@0.3 320,136@0.3 0,136@0.3 1
# plaster panels on the walls
poly panel_l1 0,20@0.66 0,20@0.5 0,60@0.5 0,60@0.66 8
poly panel_l2 0,20@0.48 0,20@0.36 0,60@0.36 0,60@0.48 8
poly panel_r1 320,20@0.7 320,20@0.54 320,60@0.54 320,60@0.7 8
poly panel_r2 320,20@0.52 320,20@0.38 320,60@0.38 320,60@0.52 8
line cornice_l 0,12@1 0,12@0.3 c9
line cornice_r 320,12@1 320,12@0.3 c9
poly frame_l1 0,24@0.9 0,24@0.8 0,50@0.8 0,50@0.9 6
poly poster_l1 0,28@0.89 0,28@0.81 0,46@0.81 0,46@0.89 13
poly frame_l2 0,24@0.75 0,24@0.65 0,50@0.65 0,50@0.75 6
poly poster_l2 0,28@0.74 0,28@0.66 0,46@0.66 0,46@0.74 11
poly frame_r1 320,24@0.92 320,24@0.82 320,50@0.82 320,50@0.92 6
poly poster_r1 320,28@0.91 320,28@0.83 320,46@0.83 320,46@0.91 14
poly frame_r2 320,24@0.78 320,24@0.68 320,50@0.68 320,50@0.78 6
poly poster_r2 320,28@0.77 320,28@0.69 320,46@0.69 320,46@0.77 4
line skirt_l 0,128@1 0,128@0.3 c0
line skirt_r 320,128@1 320,128@0.3 c0
# two yellow globes on the ceiling
ellipse globe_a 196,26,4,3 14
ellipse globe_b 150,16,5,4 14
line globe_a_wire 196,0 196,23 c0
line globe_b_wire 150,0 150,12 c0
# the floor in bands
poly floor_far 0,136@0.45 320,136@0.45 320,136@0.3 0,136@0.3 5
poly floor_mid 0,136@0.7 320,136@0.7 320,136@0.45 0,136@0.45 8
poly floor_near 0,136@1 320,136@1 320,136@0.7 0,136@0.7 1
line joint_a 0,136@0.85 320,136@0.85 c0
line joint_b 0,136@0.7 320,136@0.7 c0
line joint_c 0,136@0.55 320,136@0.55 c0
line joint_d 0,136@0.45 320,136@0.45 c0
line joint_v1 20,136@1 20,136@0.3 c0
line joint_v2 60,136@1 60,136@0.3 c0
line joint_v3 300,136@1 300,136@0.3 c0
line joint_v4 340,136@1 340,136@0.3 c0
line joint_v5 0,136@1 0,136@0.3 c0
# the red carpet, worn to its string
poly carpet 90,136@1 290,136@1 290,136@0.3 90,136@0.3 4
poly carpet_worn 150,136@1 230,136@1 230,136@0.3 170,136@0.3 12
line carpet_edge_l 90,136@1 90,136@0.3 c0
line carpet_edge_r 290,136@1 290,136@0.3 c0
line carpet_fringe 90,136@0.9 290,136@0.9 c12
line carpet_fringe_b 90,136@0.5 290,136@0.5 c12
line carpet_pat_a 110,136@0.8 270,136@0.8 c12
line carpet_pat_b 110,136@0.65 270,136@0.65 c12
line carpet_pat_c 110,136@0.4 270,136@0.4 c12
poly carpet_stain 190,136@0.75 210,136@0.75 210,136@0.62 190,136@0.62 8
poly door_spill 184,86 224,86 254,112 150,112 11
# the far end: padded doors with light round their edges
rect doors_frame 174,46,56,40 0
rect door_l 177,49,24,37 4 e0
rect door_r 203,49,24,37 4 e0
rect doors_glow_l 175,49,1,37 11
rect doors_glow_r 229,49,1,37 11
rect doors_glow_t 177,47,50,1 11
ellipse porthole_l 190,64,3,3 11
ellipse porthole_r 214,64,3,3 11
rect door_nail_a 181,53,2,2 14
rect door_nail_b 220,74,2,2 14
rect door_nail_c 206,53,2,2 14
rect door_nail_d 183,78,2,2 14
rect door_handle_l 198,64,2,6 14
rect door_handle_r 204,64,2,6 14
rect door_rail 176,86,52,2 14
rect door_kick_l 177,80,24,6 8
rect door_kick_r 203,80,24,6 8
# the marble counter and its brass grille on the left
poly grille_frame 0,50@0.9 0,50@0.5 0,84@0.5 0,84@0.9 14
poly grille_glass 0,54@0.88 0,54@0.52 0,80@0.52 0,80@0.88 0
line grille_bar_a 0,54@0.8 0,80@0.8 c6
line grille_bar_b 0,54@0.7 0,80@0.7 c6
line grille_bar_c 0,54@0.6 0,80@0.6 c6
poly counter_top 0,84@0.95 0,84@0.5 40,84@0.5 40,84@0.95 15
poly counter_face 40,84@0.95 40,84@0.5 40,120@0.5 40,120@0.95 7
poly counter_vein_a 40,92@0.9 40,92@0.76 40,100@0.76 40,100@0.9 8
poly counter_vein_b 40,106@0.7 40,106@0.6 40,114@0.6 40,114@0.7 8
poly counter_crack 40,90@0.55 40,90@0.52 40,112@0.52 40,112@0.55 0
rect counter_brass 40,60,8,3 14
poly counter_shadow 10,118 40,118 52,126 0,126 0
# the stairs and their carpet on the right
poly stair_flight 320,136@0.95 320,136@0.5 320,50@0.5 320,100@0.95 8 e0
poly stair_carpet 320,128@0.9 320,128@0.55 320,60@0.55 320,96@0.9 4
line stair_step_a 320,120@0.85 320,120@0.74 c0
line stair_step_b 320,108@0.78 320,108@0.67 c0
line stair_step_c 320,96@0.7 320,96@0.6 c0
line stair_rail 320,70@0.95 320,50@0.5 c14
line stair_rod_a 320,126@0.88 320,126@0.78 c14
line stair_rod_b 320,114@0.8 320,114@0.7 c14
line stair_rod_c 320,102@0.72 320,102@0.62 c14
rect newel 290,56,6,56 6 e0
ellipse newel_ball 293,54,4,4 14
# the chalkboard on its easel, in front of the counter
poly easel_leg_l 28,96 32,96 24,134 20,134 6
poly easel_leg_r 70,96 74,96 82,134 78,134 6
rect easel_board_back 24,36,54,60 6 e0
rect easel_board 28,40,46,52 0
line chalk_a 32,48 54,48 c15
line chalk_b 32,56 66,56 c7
line chalk_c 32,64 58,64 c15
line chalk_d 32,72 68,72 c15
line chalk_e 32,80 52,80 c7
line chalk_under 32,86 68,86 c15
rect easel_tray 26,92,50,3 6 e0
line easel_chalk_dust 34,94 70,94 c15
rect easel_peg 50,95,4,3 6
`,
  cycles: [
    { name: "the light at the doors", areas: ["doors_glow_l", "doors_glow_r", "doors_glow_t", "door_spill"], colors: [11, 3], style: "flicker", ms: [900, 3000] },
  ],
  overlays: [],
};

const stalls = {
  version: 1,
  shot: "Eye level, frontal, from the back of the hall facing north to the stage; arcade; blue walls, a magenta ceiling with a light magenta rose, two plaster pillars; the torn grey {screen} across the back wall with a tear from its top corner down to a seam, a yellow wash of lamp light on its lower half; the low {stage} on the left third lit by one {lamp} on a pole, the {lectern} with a {gavel} on the right third where the auctioneer stands; the {crate} of film cans under the stage at the right, shut with a lid or open with the lid up and cans showing; the bare {floor} boards scuffed pale, two black clusters of dancers, the {seats} torn out down the middle and a few left along the walls with {coats} on them, two heads close together arguing on the left; wings: seats and coats; the lamp is the only light; moves: the lamp (lamplight)",
  draw: `rect back 0,0,320,136 1
rect ceil 0,0,320,14 5
rect ceil_edge 0,14,320,3 0
ellipse ceil_rose 160,7,22,4 13
rect wall_back 0,17,320,90 1
poly box_l_curtain 0,28 36,28 30,52 0,52 4
rect box_l_rail 0,52,40,5 6 e0
poly box_r_curtain 320,28 284,28 290,52 320,52 4
rect box_r_rail 280,52,40,5 6 e0
rect arch_top 58,17,204,11 8 e0
rect arch_fascia 58,28,204,4 6
rect pillar_l 44,17,14,88 8 e0
rect pillar_l_hi 44,17,3,88 7
rect pillar_l_cap 40,17,22,6 7 e0
rect pillar_l_base 40,100,22,6 7 e0
rect pillar_r 262,17,14,88 8 e0
rect pillar_r_hi 262,17,3,88 7
rect pillar_r_cap 258,17,22,6 7 e0
rect pillar_r_base 258,100,22,6 7 e0
# the torn screen
rect screen_frame 84,34,152,48 8 e0
rect screen 88,38,144,40 7
poly screen_patch_a 96,42 130,42 134,54 98,58 15
poly screen_patch_b 180,50 220,46 224,64 184,68 15
poly screen_stain 140,60 168,58 172,74 144,76 8
poly screen_tear 90,38 96,38 124,58 122,78 118,78 120,60 0
line screen_seam 120,60 120,78 c0
# the yellow wash of the lamp on the screen and the stage
poly screen_lit 92,52 150,52 158,78 84,78 14
# the stage
poly stage_top 54,80 266,80 280,90 40,90 6 e0
rect stage_front 40,90,240,12 8 e0
rect stage_skirt 40,102,240,4 0
line stage_board_a 70,84 252,84 c0
line stage_board_b 62,87 262,87 c0
poly stage_lit 96,82 150,82 160,90 86,90 14
rect stage_step_a 150,102,22,4 6 e0
rect stage_step_b 146,106,30,4 6 e0
# the lamp on its pole
rect lamp_pole 118,46,3,34 8
poly lamp_head 112,42 126,42 124,48 114,48 8 e0
ellipse lamp_bulb 119,50,4,2 14
# the lectern and the gavel
poly lectern_top 208,64 232,64 234,68 206,68 6 e0
rect lectern_body 210,68,20,26 6 e0
rect lectern_shade 224,68,6,26 8
rect gavel_head 214,60,6,4 14 e0
line gavel_handle 220,62 228,66 c14
ellipse lectern_ring 214,66,3,1 8
# the crate under the stage
rect cr_body 238,100,34,20 6 e0
rect cr_slat_a 238,106,34,2 0
rect cr_slat_b 238,112,34,2 0
rect crate 236,96,38,5 6 e0
dots crate_nails 240,98 248,98 258,98 268,98 c0
rect crate_open 240,100,30,5 0
poly crate_open_lid 240,98 270,80 276,84 246,100 6 e0
rect crate_open_can_a 242,96,10,5 7 e0
rect crate_open_can_b 256,96,10,5 7 e0
# the dance floor in bands
rect floor_far 0,106,320,10 8
rect floor_mid 0,116,320,10 6
rect floor_near 0,126,320,10 6
rect fm_a 0,116,60,5 8 e0
rect fm_b 60,116,90,5 6 e0
rect fm_c 150,116,70,5 8 e0
rect fm_d 220,116,100,5 6 e0
rect fn_a 0,126,80,5 6 e0
rect fn_b 80,126,60,5 8 e0
rect fn_c 140,126,90,5 6 e0
rect fn_d 230,126,90,5 8 e0
rect fn_e 0,131,50,5 8 e0
rect fn_f 50,131,100,5 6 e0
rect fn_g 150,131,60,5 8 e0
rect fn_h 210,131,110,5 6 e0
poly floor_scuff 120,118 220,116 232,126 108,128 7
poly floor_scuff_b 150,128 200,127 206,132 146,134 7
poly floor_scuff_c 30,122 60,121 64,126 26,127 7
poly floor_scuff_d 250,124 290,123 296,129 246,130 7
line floor_crack 140,118 150,122 144,128 c0
# seats and coats in the wings
rect seat_l_a 2,92,20,18 4 e0
rect seat_l_b 24,96,18,16 4 e0
poly coat_l 2,92 22,92 20,106 4,106 6
rect sitter_l_head 8,84,6,7 0
rect sitter_l_body 6,90,12,6 0
rect seat_r_a 296,92,20,18 4 e0
rect seat_r_b 276,96,18,16 4 e0
poly coat_r 296,94 314,94 312,108 298,108 8
rect seat_r_arm 274,92,2,18 8
rect seat_l_c 2,114,22,16 4 e0
poly coat_l2 2,114 22,114 20,126 4,126 8
rect sitter_r_head 304,86,6,7 0
rect sitter_r_body 302,92,12,6 0
rect seat_r_c 296,114,22,16 4 e0
poly coat_r2 296,114 316,114 314,126 298,126 6
line ceil_cable_a 20,17 20,30 c0
line ceil_cable_b 300,17 300,30 c0
rect speaker_l 24,64,10,22 8 e0
ellipse speaker_l_cone 29,76,3,3 0
rect speaker_r 286,64,10,22 8 e0
ellipse speaker_r_cone 291,76,3,3 0
# two heads close together, arguing
ellipse arg_a 28,86,4,5 0
ellipse arg_b 36,86,4,5 0
poly arg_a_body 24,92 32,92 33,108 22,108 0
poly arg_b_body 32,92 40,92 42,108 33,108 0
rect arg_bottle 29,98,3,8 2
# two clusters of dancers
poly crowd_a 62,136 62,114 66,108 72,110 78,104 84,108 90,106 96,112 102,136 0
ellipse crowd_a_h1 72,104,4,5 0
ellipse crowd_a_h2 84,102,4,5 0
ellipse crowd_a_h3 94,106,4,5 0
line crowd_a_arm 90,110 94,98 c0
poly crowd_b 178,136 178,116 184,110 190,112 196,106 204,110 210,108 216,114 224,136 0
ellipse crowd_b_h1 188,106,4,5 0
ellipse crowd_b_h2 200,102,4,5 0
ellipse crowd_b_h3 212,104,4,5 0
line crowd_b_arm 196,110 192,96 c0
`,
  cycles: [
    { name: "the lamp", areas: ["lamp_bulb", "screen_lit", "stage_lit"], colors: [14, 6], style: "flicker", ms: [700, 2200] },
  ],
  overlays: [{ object: "minister", at: [190, 88], tall: 50 }],
};

const booth = {
  version: 1,
  shot: "Eye level, frontal, facing north across the booth to its back wall; lamplight; one bare yellow bulb on a wire at the left third, its light lying on the wall and the floor; the film {projector} on an iron pedestal on the left third is the subject, black iron with two grey reels on arms above it, a brass lens, a lamp house with a yellow slit; Ofelia, an old woman in a grey cardigan over a red usher's jacket, sits on a stool at its right with one hand on the film, hair in a grey bun, glasses on a chain; behind them in the back wall two square {ports}, each showing the lit stage small and bright above a black slope of heads; the {lantern} for the slides on a small table on the right wing with its tray of glass {slides}; the {camp bed} made with hospital corners on the left wing and a stack of film cans on the floor; moves: the bulb (lamplight), the lamp house's slit (flicker)",
  draw: `rect wall 0,0,320,100 6
rect ceil 0,0,320,12 8
rect ceil_beam 0,12,320,3 0
poly shade_l 0,15 44,15 30,100 0,100 8
poly shade_r 320,15 280,15 292,100 320,100 8
poly stain_a 96,16 140,16 146,40 118,48 100,36 8
rect bare_a 250,20,14,7 4 e0
rect bare_b 264,27,16,7 4 e0
line crack_a 60,16 64,30 61,44 c0
# the floor in bands
rect floor_far 0,100,320,10 8
rect floor_mid 0,110,320,12 6
rect floor_near 0,122,320,14 6
rect fm_a 0,110,70,6 8 e0
rect fm_b 70,110,90,6 6 e0
rect fm_c 160,110,70,6 8 e0
rect fm_d 230,110,90,6 6 e0
rect fm_e 0,116,100,6 6 e0
rect fm_f 100,116,60,6 8 e0
rect fm_g 160,116,160,6 6 e0
rect fn_a 0,122,60,7 8 e0
rect fn_b 60,122,90,7 6 e0
rect fn_c 150,122,70,7 8 e0
rect fn_d 220,122,100,7 6 e0
rect fn_e 0,129,110,7 6 e0
rect fn_f 110,129,70,7 8 e0
rect fn_g 180,129,140,7 6 e0
# the two ports onto the stalls
rect port_a_frame 150,26,42,34 0
rect port_a_view 154,30,34,26 1
rect port_a_screen 160,30,22,4 7
rect port_a_stage 162,36,18,8 14
poly port_a_heads 154,56 154,48 162,46 170,50 178,46 188,48 188,56 0
rect port_a_sill 148,60,46,3 6 e0
rect port_b_frame 198,26,42,34 0
rect port_b_view 202,30,34,26 1
rect port_b_screen 208,30,22,4 7
rect port_b_stage 210,36,18,8 14
poly port_b_heads 202,56 202,50 210,46 218,50 226,46 236,50 236,56 0
rect port_b_sill 196,60,46,3 6 e0
# the bulb and its light
poly lit_wall 100,30 140,30 148,64 92,64 14
poly floor_lit 90,110 150,110 158,124 80,124 14
ellipse lamp_glow 120,24,12,8 14
line lamp_wire 120,0 120,16 c0
rect lamp_socket 117,16,6,4 8
ellipse lamp_bulb 120,26,3,3 15
# the camp bed on the left wing
rect bed_leg_a 4,104,3,16 8
rect bed_leg_b 46,104,3,16 8
rect bed_frame 2,98,50,6 8 e0
poly bed_mattress 4,92 48,92 52,98 2,98 7
rect bed_blanket 6,92,40,6 4 e0
rect bed_pillow 38,88,12,5 15 e0
rect shelf_cans 254,34,56,3 6 e0
rect shelf_can_a 258,26,12,8 7 e0
rect shelf_can_b 272,26,12,8 7 e0
rect shelf_can_c 286,26,12,8 7 e0
rect shelf_can_d 300,26,10,8 7 e0
rect hook_coat 258,50,4,3 8
poly old_cardigan 252,52 270,52 274,80 248,80 8 e0
line bed_corner 6,95 14,95 c0
# film cans stacked on the floor
rect can_a 156,112,24,5 7 e0
line film_loose_a 150,128 174,132 c15
line film_loose_b 174,132 196,128 c15
rect can_b 158,107,22,5 7 e0
rect can_c 160,102,20,5 7 e0
ellipse can_d 190,122,11,4 7 e0
# the projector on its pedestal
rect proj_base 76,122,40,6 0
rect proj_pedestal 92,90,14,34 8 e0
rect proj_body 70,58,74,32 8 e0
rect proj_body_hi 70,58,74,3 7
rect proj_gate 100,66,14,18 0
rect proj_lamphouse 46,54,26,38 8 e0
rect proj_slit 52,66,12,4 14
line proj_vent_a 50,76 68,76 c0
line proj_vent_b 50,80 68,80 c0
rect proj_arm_a 86,50,4,10 8
rect proj_arm_b 122,50,4,10 8
ellipse proj_reel_a 88,42,14,10 7 e0
ellipse proj_reel_b 124,42,14,10 7 e0
ellipse proj_hub_a 88,42,3,3 0
ellipse proj_hub_b 124,42,3,3 0
line proj_film_a 96,48 104,66 c15
line proj_film_b 116,48 110,66 c15
rect proj_lens 144,68,24,12 14 e0
rect proj_lens_ring 166,66,4,16 6
dots proj_knobs 76,62 82,62 76,68 c7
# Ofelia on her stool, a hand on the film
rect ofelia_stool_seat 226,98,32,4 6 e0
line ofelia_stool_leg_a 230,102 228,122 c6
line ofelia_stool_leg_b 254,102 256,122 c6
poly ofelia_skirt 228,90 258,90 260,108 226,108 8
poly ofelia_jacket 232,62 254,62 258,96 228,96 4
poly ofelia_cardigan 228,64 244,64 246,98 230,98 7
poly ofelia_arm 236,70 218,76 216,82 236,82 7
ellipse ofelia_hand 216,79,3,3 7
rect ofelia_neck 244,56,5,6 7
ellipse ofelia_head 246,52,7,8 7
poly ofelia_hair 240,48 246,43 254,48 252,56 242,54 8
ellipse ofelia_bun 252,44,4,4 8
dots ofelia_glasses 244,52 249,52 c0
dots ofelia_chain 242,62 241,66 c14
outline ofelia e0
# the slide lantern on its table in the right wing
rect table_top 262,94,52,4 6 e0
rect table_leg_a 266,98,3,24 6
rect table_leg_b 306,98,3,24 6
rect lantern_body 270,74,28,20 8 e0
rect lantern_lens 262,80,10,8 7 e0
rect lantern_stack 282,66,8,8 8 e0
rect lantern_tray 276,58,24,8 11 e0
rect slide_a 278,60,4,5 15
rect slide_b 284,60,4,5 15
rect slide_c 290,60,4,5 15
rect lantern_vent 274,70,18,2 0
line lantern_cord 296,86 304,100 c0
dots lantern_knobs 272,78 276,78 280,78 c7
`,
  cycles: [
    { name: "the bulb", areas: ["lamp_glow", "lit_wall", "floor_lit"], colors: [14, 6], style: "flicker", ms: [700, 2200] },
    { name: "the lamp house", areas: ["proj_slit"], colors: [14, 12], style: "flicker", ms: [1200, 4000] },
  ],
  overlays: [],
};

const pharm = {
  version: 1,
  shot: "Eye level, frontal, facing north across a glass counter to the back wall; institution; light grey walls, a dark grey ceiling with one fluorescent tube in white, white {shelves} of boxes on both sides; Don Eladio stands behind the counter on the left third in a white coat, pale face, combed grey hair, one hand raised to the corner of the framed {diploma} on the back wall, the diploma large with a brown frame and a red seal; the glass {counter} with razors, a scale and things for babies under its glass, a cash register on it; in the right wing the window with a green neon {cross} seen from inside; left wing: the end of the shelves; the tube is the only light; moves: the tube (faulty light), one arm of the green cross (faulty)",
  draw: `rect wall 0,0,320,100 7
rect ceil 0,0,320,14 8
rect ceil_edge 0,14,320,2 0
rect tube 96,5,128,4 15
rect tube_end_l 92,4,4,6 8
rect tube_end_r 224,4,4,6 8
poly tube_light 100,16 220,16 232,24 88,24 15
poly shade_l 0,16 18,16 8,100 0,100 8
poly shade_r 320,16 290,16 300,100 320,100 8
# shelves on the left
rect shelf_l 18,22,70,64 8 e0
rect shelf_l_r1 20,34,66,2 15
rect shelf_l_r2 20,50,66,2 15
rect shelf_l_r3 20,66,66,2 15
rect box_l1a 22,24,12,10 15 e0
rect box_l1b 36,26,12,8 7 e0
rect box_l1c 50,24,12,10 11 e0
rect box_l1d 64,26,12,8 15 e0
rect box_l2a 22,40,12,10 7 e0
rect box_l2b 36,40,12,10 15 e0
rect box_l2c 50,42,12,8 15 e0
rect box_l2d 64,40,12,10 11 e0
rect box_l3a 22,56,12,10 15 e0
rect box_l3b 36,58,12,8 11 e0
rect box_l3c 50,56,12,10 7 e0
rect box_l3d 64,58,12,8 15 e0
rect box_l4a 22,72,16,12 15 e0
rect box_l4b 42,72,16,12 7 e0
rect box_l4c 62,72,16,12 15 e0
# shelves on the right
rect shelf_r 204,22,70,64 8 e0
rect shelf_r_r1 206,34,66,2 15
rect shelf_r_r2 206,50,66,2 15
rect shelf_r_r3 206,66,66,2 15
rect box_r1a 208,24,12,10 15 e0
rect box_r1b 222,26,12,8 11 e0
rect box_r1c 236,24,12,10 7 e0
rect box_r1d 250,26,12,8 15 e0
rect box_r2a 208,40,12,10 11 e0
rect box_r2b 222,40,12,10 15 e0
rect box_r2c 236,42,12,8 15 e0
rect box_r2d 250,40,12,10 7 e0
rect box_r3a 208,56,12,10 15 e0
rect box_r3b 222,58,12,8 7 e0
rect box_r3c 236,56,12,10 15 e0
rect box_r3d 250,58,12,8 11 e0
rect jar_a 210,74,8,12 11 e0
rect jar_b 222,74,8,12 15 e0
rect jar_c 234,74,8,12 11 e0
rect jar_d 246,74,8,12 15 e0
rect label_l1 24,38,8,3 8
rect label_l2 40,54,8,3 8
rect label_r1 210,44,8,3 8
rect label_r2 238,60,8,3 8
rect tag_a 22,60,6,4 14
rect tag_b 244,28,6,4 14
# the diploma
rect diploma_frame 146,22,54,40 6 e0
rect diploma 150,26,46,32 15
line diploma_l1 154,32 190,32 c7
line diploma_l2 154,37 190,37 c7
line diploma_l3 154,42 184,42 c7
ellipse diploma_seal 186,52,4,4 4
rect diploma_ribbon 184,54,3,6 4
# Don Eladio behind the counter
poly eladio_coat 94,52 124,52 130,100 90,100 15
poly eladio_shade 116,52 124,52 130,100 122,100 7
rect eladio_tie 108,54,4,20 8
poly eladio_arm 124,60 142,46 146,50 128,68 15
ellipse eladio_hand 146,48,3,3 7
rect eladio_neck 106,46,6,6 7
ellipse eladio_head 109,40,7,9 7
poly eladio_hair 102,36 109,30 117,36 117,40 102,40 8
dots eladio_eyes 106,40 112,40 c0
outline eladio e8
# the green cross in the right wing window
rect window_frame 282,18,34,68 8 e0
rect window_glass 285,21,28,62 0
rect cross_a 296,30,8,30 10
rect cross_b 288,40,24,8 10
rect cross_edge_a 296,30,2,30 2
rect cross_edge_b 288,40,24,2 2
# the glass counter
rect counter_top 14,84,292,4 11 e0
rect counter_front 14,88,292,22 7
rect case_a 22,91,54,14 11 e0
rect case_b 84,91,54,14 11 e0
rect case_c 146,91,54,14 11 e0
rect case_d 208,91,54,14 11 e0
line razor_a 28,98 60,98 c15
line razor_b 28,101 52,101 c15
poly scale_a 94,104 100,96 118,96 124,104 8
rect scale_b 106,92,4,4 8
rect baby_a 154,96,10,8 15 e0
rect baby_b 168,98,8,6 13 e0
rect baby_c 180,96,10,8 15 e0
rect case_e 214,96,40,6 15 e0
rect register 232,74,24,12 8 e0
rect register_keys 236,78,16,4 7
rect register_drawer 232,86,24,3 7 e0
rect counter_foot 14,110,292,3 8
rect bin 304,94,10,14 8 e0
rect scale_floor 56,100,24,6 8 e0
rect scale_dial 62,94,12,6 15 e0
line scale_needle 68,96 72,97 c0
# the tiled floor in bands
rect floor_far 0,113,320,8 8
rect floor_mid 0,121,320,7 7
rect floor_near 0,128,320,8 8
line tile_a 40,113 30,136 c0
line tile_b 100,113 96,136 c0
line tile_c 160,113 160,136 c0
line tile_d 220,113 224,136 c0
line tile_e 280,113 292,136 c0
line tile_f 0,121 320,121 c0
line tile_g 0,128 320,128 c0
rect mat 130,130,60,5 8 e0
line mat_stripe_a 136,132 184,132 c0
poly floor_lit 90,113 230,113 250,136 70,136 15
`,
  cycles: [
    { name: "the tube", areas: ["tube", "tube_light", "floor_lit"], colors: [15, 7], style: "flicker", ms: [1500, 5000] },
    { name: "the green cross", areas: ["cross_b"], colors: [10, 2], style: "flicker", ms: [900, 3600] },
  ],
  overlays: [],
};

const humbled = {
  version: 1,
  shot: "Eye level from the back of the stalls, frontal; arcade; the torn cinema screen filled with an old black-and-white newsreel in greys, the Minister's huge face with thick glasses, moustache and a bored smile on the right third, a ribbon cut in front of a reservoir wall on the left, hats in a row below it; the dark hall in blue with two plaster pillars; a black mass of heads at the bottom, a few thrown back, a few arms raised, one bottle held up, laughing; the screen is the only light; moves: the newsreel's flicker (flicker)",
  draw: `rect back 0,0,320,136 1
rect ceil 0,0,320,8 5
rect pillar_l 8,8,16,90 8 e0
rect pillar_l_hi 8,8,3,90 7
rect pillar_r 296,8,16,90 8 e0
rect pillar_r_hi 296,8,3,90 7
rect scr_frame 36,8,248,90 8 e0
rect scr 40,12,240,82 7
rect sprocket_a 41,18,3,5 8
rect sprocket_b 41,30,3,5 8
rect sprocket_c 41,42,3,5 8
rect sprocket_d 41,54,3,5 8
rect sprocket_e 41,66,3,5 8
rect sprocket_f 41,78,3,5 8
rect sprocket_g 276,18,3,5 8
rect sprocket_h 276,30,3,5 8
rect sprocket_i 276,42,3,5 8
rect sprocket_j 276,54,3,5 8
rect sprocket_k 276,66,3,5 8
rect sprocket_l 276,78,3,5 8
# the reservoir and its wall, on the left of the newsreel
rect sky_film 40,12,240,34 15
poly hill_film 40,46 80,34 120,40 150,46 150,62 40,62 8
poly dam_film 40,52 150,48 150,72 40,76 7 e0
rect water_film 40,72,110,22 8
line water_dash_a 48,80 76,80 c7
line water_dash_b 90,84 124,84 c7
line water_dash_c 56,88 100,88 c7
poly ribbon 52,52 118,60 118,64 52,56 8
poly ribbon_cut 118,60 134,56 134,60 118,64 15
# hats in a row below the ribbon
ellipse hat_a 56,66,6,4 8
ellipse hat_b 72,68,6,4 8
ellipse hat_c 88,66,6,4 8
ellipse hat_d 104,68,6,4 8
ellipse hat_e 120,66,6,4 8
rect hat_row 50,68,80,10 8
ellipse hat_f 62,70,5,3 7
ellipse hat_g 96,70,5,3 7
ellipse hat_h 112,70,5,3 7
line pillar_l_line 16,8 16,98 c0
line pillar_r_line 304,8 304,98 c0
line ceil_line_a 0,8 320,8 c0
# the huge face of the Minister
poly suit_film 160,94 168,76 258,76 266,94 8
poly collar_film 196,76 214,88 232,76 15
ellipse face_film 213,48,28,36 15
poly face_shade_film 224,24 241,34 240,62 226,80 218,84 7
poly hair_film 190,30 196,16 214,10 232,16 238,30 228,26 214,22 200,26 8
ellipse glass_l 202,46,10,8 0
ellipse glass_r 226,46,10,8 0
ellipse lens_l 202,46,7,5 7
ellipse lens_r 226,46,7,5 7
line glass_bridge 211,46 217,46 c0
poly moustache_film 200,62 213,58 226,62 224,66 213,63 202,66 0
line mouth_film 204,72 222,72 c8
line smile_film 222,72 226,70 c8
poly hands_film 192,94 200,82 226,82 234,94 7
line hands_line 204,88 222,88 c8
line scissors_film 210,84 216,80 c15
# film wear
line scratch_a 160,12 162,94 c8
line scratch_b 170,12 168,60 c15
dots dust_a 60,24 100,30 140,20 252,26 266,60 c8
# the audience, black against the screen, laughing
poly crowd_a 4,136 4,112 12,106 22,108 30,100 40,106 52,102 64,108 76,104 88,108 100,102 112,108 124,112 124,136 0
poly crowd_b 120,136 120,114 130,108 142,110 150,102 162,108 174,104 186,110 198,106 210,112 222,108 236,112 236,136 0
poly crowd_c 230,136 230,110 240,104 252,108 262,100 274,106 286,104 298,108 316,112 316,136 0
ellipse head_a 22,102,5,6 0
ellipse head_b 46,98,5,6 0
ellipse head_c 70,100,5,6 0
ellipse head_d 100,98,5,6 0
ellipse head_e 140,104,5,6 0
ellipse head_f 166,100,5,6 0
ellipse head_g 194,102,5,6 0
ellipse head_h 246,100,5,6 0
ellipse head_i 270,96,5,6 0
ellipse head_j 292,100,5,6 0
line arm_a 36,106 32,92 c0
line arm_b 110,108 114,92 c0
line arm_c 206,110 202,96 c0
line arm_d 280,104 284,90 c0
rect bottle_up 31,86,3,8 2
rect bottle_up_neck 32,83,1,4 2
`,
  cycles: [
    { name: "the newsreel", areas: ["face_film", "sky_film", "scratch_b"], colors: [15, 7], style: "flicker", ms: [600, 2400] },
  ],
};

const cartera = {
  version: 1,
  shot: "Eye level, one-point view north down the street from behind two walkers, vanishing point on the right third; neon; sky magenta with light magenta at the horizon, blue buildings going to black near, the Alborada's marquee at the far end with pink and cyan tubes and a rising sun; Emperador walks on the right third seen from behind, a black silhouette with a mohawk fin and a studded jacket, a brown briefcase in his left hand, a pink rim of light on his left side; the Minister follows a step behind on the left in his brown suit, hands folded at his back, bald crown pale; the wet road repeating the sign's colours; the marquee is the only light; moves: the running bulbs of the marquee (running sign)",
  draw: `vp 213,60
rect sky 0,0,320,66 5
rect sky_low 0,46,320,20 13
poly cloud_a 20,12 90,8 112,16 40,20 13
poly far_a 100,50 108,38 124,38 128,30 142,30 146,50 1
poly far_b 246,50 252,36 264,36 268,28 286,28 292,50 1
poly bld_l 0,0@1 0,0@0.35 0,136@0.35 0,136@1 1
poly bld_l_near 0,0@1 0,0@0.66 0,136@0.66 0,136@1 0
poly bld_r 320,0@1 320,0@0.35 320,136@0.35 320,136@1 1
poly bld_r_near 320,0@1 320,0@0.66 320,136@0.66 320,136@1 0
poly far_wall 0,0@0.35 320,0@0.35 320,136@0.35 0,136@0.35 1
poly win_l1 0,16@0.8 0,16@0.74 0,30@0.74 0,30@0.8 11
poly win_l2 0,16@0.6 0,16@0.55 0,30@0.55 0,30@0.6 1
poly win_r1 320,18@0.66 320,18@0.6 320,34@0.6 320,34@0.66 11
poly win_r2 320,18@0.5 320,18@0.45 320,34@0.45 320,34@0.5 11
poly win_l3 0,16@0.45 0,16@0.4 0,30@0.4 0,30@0.45 11
poly win_r3 320,18@0.4 320,18@0.37 320,34@0.37 320,34@0.4 1
poly door_l 0,60@0.7 0,60@0.58 0,112@0.58 0,112@0.7 0
poly door_r 320,60@0.7 320,60@0.58 320,112@0.58 320,112@0.7 0
poly shutter_a 0,40@0.99 0,40@0.84 0,112@0.84 0,112@0.99 stripes:8,0
poly shutter_c 320,40@0.99 320,40@0.82 320,112@0.82 320,112@0.99 stripes:8,0
poly pave_l 0,136@1 70,136@1 70,136@0.35 0,136@0.35 8
poly pave_r 250,136@1 320,136@1 320,136@0.35 250,136@0.35 8
line kerb_l 70,136@1 70,136@0.35 c7
line kerb_r 250,136@1 250,136@0.35 c7
line pave_joint_a 0,136@0.85 70,136@0.85 c0
line pave_joint_b 0,136@0.7 70,136@0.7 c0
line pave_joint_c 0,136@0.55 70,136@0.55 c0
line pave_joint_d 250,136@0.85 320,136@0.85 c0
line pave_joint_e 250,136@0.7 320,136@0.7 c0
line pave_joint_f 250,136@0.55 320,136@0.55 c0
poly road_far 70,136@0.5 250,136@0.5 250,136@0.35 70,136@0.35 5
poly road_mid 70,136@0.78 250,136@0.78 250,136@0.5 70,136@0.5 1
poly road_near 70,136@1 250,136@1 250,136@0.78 70,136@0.78 1
line road_dash_a 160,136@1 160,136@0.85 c8
line road_dash_b 160,136@0.72 160,136@0.6 c8
line road_dash_c 160,136@0.5 160,136@0.42 c8
poly min_shadow 150,122 176,122 180,126 146,126 0
# the marquee at the far end
rect marq_back 162,50,84,20 0
line marq_tube_t1 166,53 242,53 c13
line marq_tube_t2 166,54 242,54 c13
line marq_tube_b1 166,67 242,67 c11
line marq_tube_b2 166,66 242,66 c11
line marq_tube_l 166,53 166,67 c11
line marq_tube_r 242,53 242,67 c11
poly marq_sun 192,64 196,58 204,55 212,58 216,64 14
line marq_ray_a 204,54 204,51 c13
dots bulb_a 168,50 174,50 180,50 186,50 c13
dots bulb_b 192,50 198,50 204,50 210,50 c13
dots bulb_c 216,50 222,50 228,50 234,50 c13
dots bulb_d 240,50 244,54 244,60 244,66 c13
rect doorway 196,70,24,16 0
rect door_glow 200,72,16,14 11
# the sign's colours on the wet road
line streak_a 184,90 184,106 c13
line streak_b 194,90 194,110 c11
line streak_c 206,90 206,104 c13
line streak_d 218,90 218,108 c11
line streak_e 230,90 230,102 c13
dots road_glint 180,96 190,102 200,98 212,106 224,100 c15
# the Minister, a step behind
poly min_legs 150,118 160,118 162,86 152,86 6
rect min_shoe_l 148,118,8,3 0
rect min_shoe_r 158,118,8,3 0
poly min_coat 146,60 166,60 170,92 144,92 6
rect min_hands 154,76,8,4 7
ellipse min_head 156,54,6,7 7
poly min_crown 150,52 156,47 162,52 162,54 150,54 8
line min_rim 166,62 170,90 c13
# Emperador carrying the briefcase
poly emp_legs 188,122 200,122 202,92 190,92 0
rect emp_boot_l 186,122,10,4 0
rect emp_boot_r 198,122,10,4 0
poly emp_jacket 182,64 210,64 214,98 180,98 0
rect emp_arm_l 176,66,6,32 0
rect emp_arm_r 210,66,6,26 0
ellipse emp_head 196,56,7,8 0
rect emp_mohawk 195,40,3,16 0
dots emp_studs 186,70 190,70 194,70 198,70 202,70 206,70 c15
rect emp_case 170,96,18,12 6 e0
line emp_case_handle 176,96 182,96 c14
line emp_rim 182,66 180,96 c13
line emp_rim_head 189,52 190,58 c13
`,
  cycles: [
    { name: "the running bulbs", areas: ["bulb_a", "bulb_b", "bulb_c", "bulb_d"], colors: [13, 5], rest: 3, style: "rotate", sweep: true, ms: 300 },
  ],
};

const sold = {
  version: 1,
  shot: "Wide view from the road, facing north across the railing to the pavement; neon; sky magenta with light magenta at the horizon, a row of blue buildings, one lit lamp on the left third with a pool of light magenta on the pavement under it; a man's brown overcoat left hanging over the railing under the lamp, its collar up and its sleeves down; a black car pulling away to the right, seen from the rear in three-quarter, its tail lights red and a man's leather coat hung in the rear window; the pavement otherwise empty, wet streaks of the lamp and the tail lights on the road; the lamp is the only light; moves: the tail lights (breathing light)",
  draw: `rect sky 0,0,320,60 5
rect sky_low 0,44,320,16 13
poly cloud_a 30,12 96,8 118,16 50,20 13
poly cloud_b 214,20 280,16 300,24 230,28 13
poly far_a 0,60 0,44 20,44 24,38 44,38 48,60 1
poly far_b 120,60 126,40 146,40 150,34 170,34 174,60 1
rect bld_row 0,60,320,38 1
poly bld_top_a 0,60 12,54 40,54 52,60 1
rect win_a 14,66,7,9 11
rect win_b 56,64,7,9 0
rect win_c 100,66,7,9 0
rect win_d 170,66,7,9 11
rect win_e 258,66,7,9 0
rect shutter_a 6,80,32,18 stripes:8,0
rect shutter_b 78,80,26,18 stripes:8,0
rect shutter_c 156,80,30,18 stripes:8,0
rect shutter_d 262,80,32,18 stripes:8,0
rect door_a 118,76,22,22 0
rect door_b 214,78,20,20 0
rect door_c 262,76,22,22 0
rect win_f 214,64,7,9 11
rect win_g 296,66,7,9 0
rect pave_far 0,98,320,8 5
rect pave_near 0,106,320,14 1
line pj_a 24,106 18,120 c0
line pj_b 70,106 66,120 c0
line pj_c 118,106 116,120 c0
line pj_d 166,106 166,120 c0
line pj_e 214,106 216,120 c0
line pj_f 262,106 266,120 c0
line pj_g 306,106 312,120 c0
poly bin 296,100 306,100 304,120 298,120 8 e0
rect bin_lid 294,98,14,3 7
poly pool_a 60,110 150,110 164,119 46,119 13
rect lamp_pole 104,52,3,60 8
poly lamp_arm 105,52 121,46 123,50 107,56 8
ellipse lamp_head 123,48,5,3 15
# the overcoat over the railing
poly coat_body 74,92 112,92 116,116 70,116 6 e0
poly coat_collar 78,88 90,88 92,96 82,98 8
poly coat_sleeve_l 70,96 78,96 74,118 66,116 6
poly coat_sleeve_r 108,96 116,96 118,116 110,118 6
line coat_fold_a 86,98 84,114 c0
line coat_fold_b 98,98 100,114 c0
line coat_seam 92,92 92,116 c8
rect rail_top 0,108,320,2 8
rect rail_mid 0,114,320,2 8
rect rail_post_a 12,108,2,14 8
rect rail_post_b 52,108,2,14 8
rect rail_post_c 92,108,2,14 8
rect rail_post_d 132,108,2,14 8
rect rail_post_e 172,108,2,14 8
rect rail_post_f 212,108,2,14 8
rect rail_post_g 252,108,2,14 8
rect kerb 0,121,320,3 7 e0
rect road_far 0,124,320,5 1
rect road_near 0,129,320,7 1
line road_dash_a 10,132 40,132 c8
line road_dash_b 90,131 126,131 c8
line road_dash_c 180,132 214,132 c8
line streak_a 112,124 112,134 c13
line streak_b 124,124 124,131 c11
line streak_c 258,124 258,134 c4
line streak_d 276,124 276,131 c12
dots road_glint 108,127 118,130 252,128 270,131 c15
# the car pulling away on the right
poly car_body 214,126 224,104 252,98 290,100 312,112 316,126 316,136 214,136 0
poly car_roof 232,100 252,94 286,96 300,106 230,106 0
poly car_window 238,100 252,96 282,98 292,106 236,106 1
poly car_coat 246,100 258,98 266,104 262,108 250,108 6
poly car_coat_sheen 248,101 254,100 256,106 250,107 12
rect car_light_l 218,114,10,5 4
rect car_light_r 296,112,10,5 4
rect car_light_glow_l 214,114,4,5 12
rect car_light_glow_r 306,112,4,5 12
rect car_plate 250,118,18,6 15
rect car_wheel_l 224,130,22,6 8
rect car_wheel_r 288,130,22,6 8
line car_bumper 216,126 314,126 c8
`,
  cycles: [
    { name: "the tail lights", areas: ["car_light_l", "car_light_r", "car_light_glow_l", "car_light_glow_r"], colors: [4, 12], style: "pingpong", ms: 600 },
  ],
};

const died = {
  version: 1,
  shot: "Low, frontal, facing north across the square at dawn; dusk; sky blue with magenta above and a band of light red at the horizon, a flat yellow sun low behind the buildings on the left third; the buildings, four pruned acacias, a phone box and a bench in black silhouette; on the paving at the foot of the bench a pair of boots standing side by side and a twist of paper, the lightest thing on the ground; the paving in bands going from light red far to magenta near; the sun is the only light; moves: the sun's glints on the wet paving (shimmer)",
  draw: `rect sky 0,0,320,62 5
rect sky_low 0,42,320,20 12
ellipse sun 76,58,16,16 14
poly cloud_a 150,16 210,12 230,20 168,24 12
poly cloud_b 240,32 290,28 310,36 252,40 12
# the buildings round the square, in black
poly bld_a 0,62 0,26 22,26 22,20 52,20 52,62 0
poly bld_b 100,62 100,34 130,34 130,28 170,28 170,62 0
poly bld_c 196,62 196,24 224,24 224,16 260,16 260,62 0
poly bld_d 266,62 266,36 296,36 296,30 320,30 320,62 0
rect win_a 8,34,6,8 14
rect win_b 30,32,6,8 0
rect win_c 108,42,6,8 0
rect win_d 148,38,6,8 14
rect win_e 204,32,6,8 14
rect win_f 240,24,6,8 0
rect win_g 276,44,6,8 0
# four pruned acacias
rect tree_a 36,52,5,40 0
poly tree_a_crown 28,52 34,42 42,40 50,48 46,54 30,56 0
rect tree_b 132,56,5,36 0
poly tree_b_crown 124,56 130,46 138,44 146,52 142,58 126,60 0
rect tree_c 236,54,5,38 0
poly tree_c_crown 228,54 234,44 242,42 250,50 246,56 230,58 0
rect tree_d 296,52,5,40 0
poly tree_d_crown 288,52 294,42 302,40 310,48 306,54 290,56 0
line tree_a_branch_a 34,52 26,44 c0
line tree_a_branch_b 44,50 52,42 c0
line tree_b_branch_a 136,56 128,48 c0
line tree_b_branch_b 146,54 154,46 c0
line tree_c_branch_a 228,54 220,46 c0
line tree_d_branch_a 290,52 282,44 c0
line box_bar_a 206,80 232,80 c0
line box_bar_b 206,92 232,92 c0
# the phone box and the bench
rect box_body 206,60,26,40 0
rect box_pane_a 210,64,8,32 12
rect box_pane_b 220,64,8,32 12
rect box_roof 204,56,30,5 0
rect bench_back 62,80,92,8 0
rect bench_seat 58,90,100,6 0
rect bench_leg_a 66,96,7,18 0
rect bench_leg_b 142,96,7,18 0
line bench_rim 62,80 154,80 c12
# the paving in bands
rect pave_far 0,92,320,10 12
rect pave_mid 0,102,320,16 5
rect pave_near 0,118,320,18 1
line slab_a 0,106 320,106 c0
line slab_b 0,114 320,114 c0
line slab_c 0,124 320,124 c0
line slab_d 0,132 320,132 c0
line slab_v1 30,102 24,118 c0
line slab_v2 100,102 98,118 c0
line slab_v3 170,102 170,118 c0
line slab_v4 240,102 246,118 c0
line slab_v5 20,118 8,136 c0
line slab_v6 110,118 106,136 c0
line slab_v7 190,118 190,136 c0
line slab_v8 270,118 282,136 c0
line pave_crack 220,118 230,126 224,134 c0
ellipse puddle_a 56,128,14,3 12
ellipse puddle_b 240,126,12,2 12
line bench_plank_a 64,82 152,82 c8
line bench_plank_b 64,85 152,85 c8
poly bench_shadow 154,114 200,112 204,116 150,118 0
# the boots and the paper at the foot of the bench
poly boot_a 100,122 108,122 108,108 104,106 102,114 100,114 0
rect boot_a_sole 98,121,12,3 8
poly boot_b 114,122 122,122 122,108 118,106 116,114 114,114 0
rect boot_b_sole 112,121,12,3 8
line boot_rim_a 108,108 108,120 c12
line boot_rim_b 122,108 122,120 c12
poly paper_twist 176,126 182,122 188,124 190,128 184,130 178,129 15
line paper_fold 178,126 188,127 c7
dots glint_a 40,104 60,108 90,105 c15
dots glint_b 150,110 190,106 230,112 c15
dots glint_c 250,108 280,112 300,106 c15
`,
  cycles: [
    { name: "the glints on the paving", areas: ["glint_a", "glint_b", "glint_c"], colors: [15, 14, 12], style: "pingpong", scatter: true, ms: 420 },
  ],
};

export const endings = { humbled, cartera, sold, died };

export const cover = {
  shot: "Archetype: the tower. It turns on one person watched and sought: Emperador, lot ten, a punk the street named as a joke, seen huge from below with the district small at his feet. The second-strongest was the close-up of his face half lit by the sign (kept for the box art): a punk's face under neon could belong to many worlds, a punk over a tiny Prosperidad with a rising-sun cinema sign behind his head only to this one. Emperador stands on the middle third, his black jacket and blue jeans cut by the picture's edge, a mohawk fin standing up from his head, the left arm hanging with the fist closed, the right arm bent with a cigarette held at the chest (its ember the one bright point), a pink rim of light on his right edge; behind his head the sunburst of the Alborada's sign in yellow and light red, its rays light magenta and magenta fanning wide over the grey; at his feet a tiny wet street with shuttered buildings, a small lit marquee with running bulbs and, far down on the left, a tiny man in a brown suit with a briefcase (the question: who is he, and what does he keep); background colour 8, as measured; light: the sign's neon; moves: the cigarette's ember (breathing light), the tiny marquee's running bulbs (running sign), its faulty tube (faulty tube), the cigarette's smoke (loop)",
  title: 15,
  titleAt: "top",
  draw: `rect bg 0,0,480,560 8
# the sunburst of the sign behind his head
poly ray_00 240,230 32,310 38,280 13
poly ray_01 240,230 45,261 61,235 5
poly ray_02 240,230 73,218 93,192 13
poly ray_03 240,230 108,178 132,158 5
poly ray_04 240,230 150,148 180,136 13
poly ray_05 240,230 200,130 230,126 5
poly ray_06 240,230 250,126 280,130 13
poly ray_07 240,230 300,136 330,148 5
poly ray_08 240,230 348,158 372,178 13
poly ray_09 240,230 387,192 407,218 5
poly ray_10 240,230 419,235 435,261 13
poly ray_11 240,230 442,280 448,310 5
ellipse sun_ring 240,230,92,92 12
ellipse sun_disc 240,230,78,78 14
ellipse sun_band 240,230,58,58 12
# the tiny street at his feet
poly bld_a 84,410 84,350 96,346 120,346 132,352 132,410 1
rect bld_a_win_a 92,356,6,8 11
rect bld_a_win_b 108,356,6,8 0
rect bld_a_win_c 92,372,6,8 0
rect bld_a_win_d 108,372,6,8 14
rect bld_b 132,368,30,42 5
rect bld_b_win_a 138,374,6,8 14
rect bld_b_win_b 150,374,6,8 0
rect bld_e 20,372,64,38 5
rect bld_e_shutter 28,384,22,26 stripes:8,0
rect bld_e_win 58,380,8,10 11
poly bld_c 330,410 330,340 346,336 380,336 396,344 396,410 1
rect bld_c_win_a 336,348,6,8 0
rect bld_c_win_b 336,364,6,8 11
rect bld_c_win_c 346,380,6,8 0
rect bld_d 396,360,64,50 5
rect bld_d_shutter 404,376,26,34 stripes:8,0
rect bld_d_win 440,372,8,10 14
rect bld_f 456,330,24,80 1
rect bld_f_win 462,344,8,10 11
rect marq_back 340,356,50,14 0
line marq_tube_t 343,359 387,359 c13
line marq_tube_b 343,367 387,367 c11
line marq_tube_fault 343,360 360,360 c13
poly marq_sun 358,367 361,363 366,361 371,363 374,367 14
dots bulb_a 343,357 351,357 359,357 c13
dots bulb_b 367,357 375,357 383,357 c13
dots bulb_c 387,357 388,363 387,369 c13
rect lamp_pole 104,384,2,36 8
ellipse lamp_head 105,382,4,3 15
rect lamp_far 396,380,2,30 8
ellipse lamp_far_head 397,378,3,2 15
# the wet road
rect ground_far 0,410,480,16 5
rect ground_mid 0,426,480,22 1
rect ground_near 0,448,480,22 1
line road_dash_a 40,456 90,456 c8
line road_dash_b 360,456 430,456 c8
line road_dash_c 20,438 70,438 c8
line road_dash_d 400,438 460,438 c8
line streak_a 346,414 346,444 c13
line streak_b 356,414 356,436 c11
line streak_c 366,414 366,446 c13
line streak_d 376,414 376,440 c11
line streak_e 100,414 100,436 c13
line streak_f 110,414 110,430 c11
ellipse manhole 90,444,14,3 8
poly kerb_l 0,416 84,410 84,414 0,422 7
poly kerb_r 396,410 480,416 480,422 396,414 7
dots road_glint 340,430 360,440 380,432 120,432 130,440 c15
# the tiny man with the briefcase and the queue
poly min_body 40,440 48,440 48,424 40,424 6
ellipse min_head 44,421,4,4 7
rect min_case 48,432,6,5 6 e0
poly q_a 410,440 414,440 414,428 410,428 0
poly q_b 418,440 422,440 422,426 418,426 0
poly q_c 426,440 430,440 430,428 426,428 0
# Emperador
ellipse emp_head 240,190,25,31 0
poly emp_mohawk 236,166 238,132 242,126 245,132 245,166 0
rect emp_neck 226,214,28,28 0
poly emp_jacket 168,252 196,238 226,236 254,236 284,238 312,252 326,330 300,340 180,340 154,330 0
poly emp_lapel_l 226,236 240,236 232,300 214,276 1
poly emp_lapel_r 254,236 240,236 248,300 266,276 1
line emp_zip 240,236 240,340 c8
poly emp_arm_l 156,252 176,242 186,300 176,400 154,402 150,330 0
ellipse emp_fist_l 165,412,12,14 0
poly emp_arm_r 304,242 324,254 340,330 322,376 304,352 306,300 0
poly emp_forearm 324,376 340,360 308,290 290,296 0
ellipse emp_hand 296,290,10,9 0
rect emp_belt 180,336,120,8 8
poly emp_leg_l 182,340 232,340 218,469 150,469 1
poly emp_leg_r 248,340 298,340 330,469 262,469 1
line emp_seam_l 208,344 186,469 c0
line emp_seam_r 272,344 296,469 c0
line emp_rim_head 262,168 258,206 c13
line emp_rim_jacket 312,252 326,330 c13
line emp_rim_leg 298,344 330,469 c13
line cig 296,284 288,274 c15
dots ember 287,273 c12
`,
  cycles: [
    { name: "the ember", areas: ["ember"], colors: [12, 4], style: "pingpong", ms: 600 },
    { name: "the running bulbs", areas: ["bulb_a", "bulb_b", "bulb_c"], colors: [13, 5], rest: 2, style: "rotate", sweep: true, ms: 300 },
    { name: "the faulty tube", areas: ["marq_tube_fault"], colors: [13, 5], style: "flicker", ms: [800, 4000] },
  ],
  loops: [
    {
      name: "the smoke",
      at: [284, 246],
      ms: 280,
      style: "loop",
      frames: [
        [
          "........",
          ".8......",
          "........",
          "...8....",
          "..8..8..",
          "...8..8.",
          "...8..8.",
          "...8..8.",
          "..8.88..",
          "..8.88..",
          ".8.88...",
          "8.88....",
          "7.7.....",
          "7.7.....",
          ".7.7....",
          "..7.7...",
          "..77....",
          "...77...",
          "...77...",
          "...77...",
          "..7.....",
          "..7.....",
          ".7......",
          "7.......",
        ],
        [
          "........",
          "...8....",
          "........",
          "....8...",
          "...8..8.",
          "...8..8.",
          "..8..8..",
          "..8..8..",
          ".8.88...",
          "8.88....",
          "8.88....",
          "8.88....",
          ".7.7....",
          "..7.7...",
          "..7.7...",
          "...7.7..",
          "...77...",
          "...77...",
          "..77....",
          "..77....",
          ".7......",
          "7.......",
          "7.......",
          "7.......",
        ],
        [
          "........",
          "....8...",
          "........",
          "....8...",
          "..8..8..",
          "..8..8..",
          ".8..8...",
          "8..8....",
          "8.88....",
          "8.88....",
          ".8.88...",
          "..8.88..",
          "..7.7...",
          "...7.7..",
          "...7.7..",
          "...7.7..",
          "..77....",
          "..77....",
          ".77.....",
          "77......",
          "7.......",
          "7.......",
          ".7......",
          "..7.....",
        ],
        [
          "........",
          "....8...",
          "........",
          "...8....",
          ".8..8...",
          "8..8....",
          "8..8....",
          "8..8....",
          ".8.88...",
          "..8.88..",
          "..8.88..",
          "...8.88.",
          "...7.7..",
          "...7.7..",
          "..7.7...",
          "..7.7...",
          ".77.....",
          "77......",
          "77......",
          "77......",
          ".7......",
          "..7.....",
          "..7.....",
          "...7....",
        ],
        [
          "........",
          "...8....",
          "........",
          ".8......",
          "8..8....",
          "8..8....",
          ".8..8...",
          "..8..8..",
          "..8.88..",
          "...8.88.",
          "...8.88.",
          "...8.88.",
          "..7.7...",
          "..7.7...",
          ".7.7....",
          "7.7.....",
          "77......",
          "77......",
          ".77.....",
          "..77....",
          "..7.....",
          "...7....",
          "...7....",
          "...7....",
        ],
        [
          "........",
          ".8......",
          "........",
          ".8......",
          ".8..8...",
          "..8..8..",
          "..8..8..",
          "...8..8.",
          "...8.88.",
          "...8.88.",
          "..8.88..",
          "..8.88..",
          ".7.7....",
          "7.7.....",
          "7.7.....",
          "7.7.....",
          ".77.....",
          "..77....",
          "..77....",
          "...77...",
          "...7....",
          "...7....",
          "..7.....",
          "..7.....",
        ],
      ],
    },
  ],
};

export const boxart = {
  shot: "Archetype: the close-up. It turns on Emperador's face: the look of a man who is lot ten and has not decided what to do about it. The second-strongest was the tower (kept for the cover). A big face of a punk with a mohawk, half lit pink by the sign on his left and half in black shadow, could be any punk's, but his iris carries the small yellow rising sun of the Alborada's sign, and that is only this world's. The head is cropped by the bottom edge and big in the middle columns: a tall black fin of mohawk rising to the top of the art, the left half of the face in planes of light grey and white, the right half black, one eye on the lit side looking to the left at the sign, a thick black brow, a cigarette between the lips with its ember, a leather collar with its blue lapel; a pink rim on his left edge and a light cyan rim on the right; wings: the neon tubes of the street and shuttered fronts in black and blue; background colour 8, the top band rows 0-95 one flat colour; light: the sign's neon; moves: nothing",
  title: 15,
  titleAt: "top",
  draw: `rect bg 0,0,480,400 8
# the street behind him, in the wings
poly wing_l 0,400 0,200 40,176 80,196 120,230 120,400 1
rect wing_l_win_a 14,214,10,12 11
rect wing_l_win_b 38,214,10,12 0
rect wing_l_win_c 14,246,10,12 0
rect wing_l_win_d 38,246,10,12 14
rect wing_l_shutter 8,290,50,60 stripes:8,0
line wing_l_tube_a 60,150 60,260 c13
line wing_l_tube_b 62,150 62,260 c13
line wing_l_tube_c 60,150 90,150 c11
line wing_l_tube_d 60,170 80,170 c11
poly wing_r 480,400 480,190 440,170 400,200 360,236 360,400 1
rect wing_r_win_a 432,210,10,12 0
rect wing_r_win_b 454,210,10,12 11
rect wing_r_win_c 432,244,10,12 14
rect wing_r_win_d 454,244,10,12 0
rect wing_r_shutter 424,290,50,60 stripes:8,0
line wing_r_tube_a 418,160 418,250 c11
line wing_r_tube_b 420,160 420,250 c11
line wing_r_tube_c 418,160 392,160 c13
dots wing_r_bulbs 424,180 424,190 424,200 424,210 c15
# the jacket and collar, cropped by the edge
poly jacket 120,400 140,340 190,318 290,318 340,340 360,400 0
poly collar_l 190,318 240,330 214,400 156,400 0
poly collar_r 290,318 240,330 266,400 324,400 0
poly lapel_l 190,322 238,334 214,400 168,400 1
poly lapel_r 290,322 242,334 266,400 312,400 1
line zip 240,334 240,400 c8
# the head
poly neck 200,300 280,300 290,330 190,330 0
ellipse head 240,236,112,136 0
poly fin 232,142 236,100 244,98 248,102 248,142 0
poly face_lit 240,110 170,150 150,236 168,300 200,340 240,350 240,300 232,250 236,170 7
poly forehead_plane 176,150 236,120 236,172 168,196 15
poly cheek_plane 160,230 220,232 226,300 188,320 168,290 7
poly cheek_high 170,236 204,238 206,262 176,264 15
poly jaw_plane 188,320 230,300 240,350 204,344 8
poly nose_plane 236,196 252,236 262,282 236,290 8
poly nose_lit 232,200 238,200 240,276 228,282 15
poly brow 168,196 230,188 232,208 170,214 0
ellipse eye_white 204,232,22,12 15
ellipse iris 196,232,10,10 0
ellipse sunpoint 194,230,3,3 14
poly lid_top 180,222 226,220 224,226 182,230 0
poly mouth 196,310 276,308 270,320 202,324 0
poly lip_lit 200,310 236,309 236,318 204,320 4
rect cig 236,314,66,6 15
rect cig_end 300,314,5,6 12
dots ember 305,317 c14
poly ear_l 150,226 164,220 164,270 152,266 7
dots earring 154,274 c14
line rim_l 150,226 152,300 c13
line rim_head_l 176,150 160,190 c13
line rim_r 350,236 346,300 c11
line rim_head_r 330,160 346,230 c11
`,
};

export default { flat, hall, street, bar, kerb, plaza, front, foyer, stalls, booth, pharm };
