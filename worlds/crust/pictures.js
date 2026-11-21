// Pictures for "Emperor of the Crust" (shared by the world's languages): one per room (16) and one per ending (4), as the world's AI drew them in the short notation
// (BRIEF.md §7); the poster of its page (cover) and its box art. Written by tools/world.mjs add from the hand-in.

export default {
  alley: {
    version: 1,
    shot: "Eye level, looking north down the alley to its back wall, vanishing point on the neon tube's third at (213,66); neon; one pink light, the half-dead tube on the back wall, its glow a flat magenta patch round it and a pink puddle under it, near corners going to black; the tube and the puddle on columns 190-240, the {crates} and {radio} stacked on the right, the {bin} and the {fire door} in the left wing; dressing: the {slat}, mortar lines, damp stains, a vent in the back wall; moves: the faulty tube (the neon sign recipe: faulty), the puddle's glints (the shimmer recipe: a pingpong).",
    draw: `vp 213,66
rect sky 0,0,320,52 5
rect sky_low 0,32,320,20 13
poly wall_left 0,14@1 0,14@0.35 0,136@0.35 0,136@1 1
poly wall_right 320,14@1 320,14@0.35 320,136@0.35 320,136@1 1
rect wall_back 138,48,112,43 1
rect wall_back_cap 138,46,112,3 8
poly coping_left 0,14@1 0,14@0.35 0,10@0.35 0,10@1 8
poly coping_right 320,14@1 320,14@0.35 320,10@0.35 320,10@1 8
rect tube_glow 184,53,60,16 5
poly stain_back 226,62 250,62 250,91 232,91 0
poly stain_left 0,60@0.9 0,60@0.62 0,136@0.62 0,136@0.9 0
poly stain_right 320,40@0.85 320,40@0.5 320,90@0.5 320,90@0.85 0
poly floor_far 0,136@0.55 320,136@0.55 320,136@0.35 0,136@0.35 5
poly floor_mid 0,136@0.8 320,136@0.8 320,136@0.55 0,136@0.55 8
poly floor_near 0,136@1 320,136@1 320,136@0.8 0,136@0.8 1
poly door_frame 0,76@0.78 0,76@0.52 0,136@0.52 0,136@0.78 8
poly fire_door 0,80@0.75 0,80@0.55 0,136@0.55 0,136@0.75 7 e0
poly fire_door_panel 0,88@0.7 0,88@0.6 0,128@0.6 0,128@0.7 8
line fire_door_seam 0,80@0.65 0,136@0.65 c0
poly fire_door_open 0,80@0.75 0,80@0.55 0,136@0.55 0,136@0.75 0
poly fire_door_open_leaf 0,80@0.55 0,80@0.5 0,136@0.5 0,136@0.55 7
poly fire_door_open_gap 0,100@0.66 0,100@0.64 0,136@0.64 0,136@0.66 6
line mortar_l1 0,30@1 0,30@0.35 c0
line mortar_l2 0,56@1 0,56@0.35 c0
line mortar_l3 0,100@1 0,100@0.78 c0
line mortar_l4 0,120@1 0,120@0.78 c0
line mortar_r1 320,30@1 320,30@0.35 c0
line mortar_r2 320,56@1 320,56@0.35 c0
line mortar_r3 320,84@1 320,84@0.35 c0
line mortar_r4 320,112@1 320,112@0.35 c0
line joint_l1 0,30@0.95 0,56@0.95 c0
line joint_l2 0,56@0.88 0,76@0.88 c0
line joint_l3 0,100@0.92 0,120@0.92 c0
line joint_r1 320,30@0.92 320,56@0.92 c0
line joint_r2 320,56@0.8 320,84@0.8 c0
line joint_r3 320,84@0.7 320,112@0.7 c0
line joint_r4 320,112@0.88 320,136@0.88 c0
line mortar_b1 138,59 250,59 c0
line mortar_b2 138,72 250,72 c0
line mortar_b3 138,84 250,84 c0
line joint_b1 160,48 160,59 c0
line joint_b2 190,59 190,72 c0
line joint_b3 168,72 168,84 c0
line joint_b4 236,72 236,84 c0
poly crate_far_top 282,78 306,78 301,74 284,74 6
rect crate_far_a 282,78,24,26 6 e0
rect crate_far_b 282,104,24,26 6 e0
line crate_far_plank1 282,86 306,86 c0
line crate_far_plank2 282,94 306,94 c0
line crate_far_plank3 282,112 306,112 c0
line crate_far_plank4 282,121 306,121 c0
poly crate_far_side 306,78 309,76 309,126 306,130 8
rect crate_radio 250,104,30,26 6 e0
poly crate_radio_top 250,104 280,104 276,100 253,100 13
line crate_radio_plank1 250,112 280,112 c0
line crate_radio_plank2 250,121 280,121 c0
line crate_radio_gap 262,104 262,130 c0
rect crate_gap 250,119,5,3 0
rect bin_body 112,102,26,28 8 e0
rect bin_lit 114,102,5,28 7
rect bin_dark 133,102,5,28 0
poly bin_lid 110,99 140,99 138,103 112,103 7 e0
rect bin_band 112,112,26,2 0
line bin_dent 122,118 128,120 c0
poly bin_shadow 138,130 152,132 138,133 0
ellipse puddle 212,120,32,6 13
ellipse puddle_dark 212,123,26,3 5
line puddle_gl1 200,119 204,119 c15
line puddle_gl2 208,121 213,121 c13
line puddle_gl3 216,119 220,119 c15
line puddle_gl4 222,121 227,121 c13
line puddle_gl5 211,118 214,118 c15
poly crack_floor 150,126 168,126 176,129 156,130 8
line crack_a 168,124 176,128 c0
line crack_b 232,126 244,131 c0
dots grit_near 20,128 36,132 52,127 66,131 80,129 96,133 100,127 c8
poly gutter_floor 40,136 90,136 74,130 58,130 0
poly shade_near_l 0,136 40,136 48,118 0,100 0
poly shade_near_r 320,136 280,136 270,122 320,104 0
rect sky_cloud 150,26,60,6 5
rect sky_cloud2 232,20,40,5 5
rect pipe_back 144,48,4,43 8
line pipe_back_hi 144,50 144,90 c7
rect pipe_bracket1 142,62,8,2 0
rect pipe_bracket2 142,82,8,2 0
line tube_bracket 214,56 214,64 c8
line tube_bracket2 232,56 232,64 c8
line tube_dead1 190,61 213,61 c1
line tube_dead2 190,62 213,62 c1
line tube_live1 215,61 238,61 c13
line tube_live2 215,62 238,62 c13
rect tube_end 189,60,2,4 8
rect tube_end2 238,60,2,4 8
poly wall_glow_floor 200,91 226,91 232,100 194,100 5
poly shadow_bin_floor 114,130 150,130 156,134 110,134 0
rect sill_vent 168,66,14,8 8 e0
line vent_bar1 170,68 180,68 c0
line vent_bar2 170,70 180,70 c0
line vent_bar3 170,72 180,72 c0
dots wet_marks 60,60 70,62 40,80 52,96 c0`,
    overlays: [{ object: "radio", at: [257, 88] }, { object: "slat", at: [142, 118] }],
    cycles: [
      {
        name: "the faulty tube",
        areas: ["tube_live1", "tube_live2"],
        colors: [13, 5],
        style: "flicker",
        ms: [800, 4000]
      },
      {
        name: "the puddle's glints",
        areas: ["puddle_gl1", "puddle_gl2", "puddle_gl3", "puddle_gl4", "puddle_gl5"],
        colors: [15, 13, 5],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  backstage: {
    version: 1,
    shot: "Eye level, looking north at the back wall, no vanishing point; lamplight; one light, the bulbs of the mirror, throwing flat yellow patches on the dresser's top and the floor below it, the corners going to dark; the {rail} of stage clothes on columns 66-170 (a third at 107), the {mirror} with its ring of bulbs on columns 176-226, the black {curtain} on the right at 240-280, stacked {cases} filling the left wing; dressing: stickers and a stencil on the cases, an extinguisher, grease pots and bottles on the dresser, a stool and a poster in the right wing, cables on the floor; moves: the bulbs and the light they throw (the lamplight recipe: a flicker).",
    draw: `rect ceiling 0,0,320,12 8
rect wall_back 0,12,320,80 6
rect skirting 0,88,320,4 5
poly corner_l 0,12 30,12 18,92 0,92 mix:6,0@0.5
poly corner_r 320,12 298,12 306,92 320,92 mix:6,0@0.5
rect floor_far 0,92,320,11 6
rect floor_mid 0,103,320,14 8
rect floor_near 0,117,320,19 6
line floor_gap1 0,103 320,103 c0
line floor_gap2 0,117 320,117 c0
line plank_j1 40,92 36,103 c0
line plank_j2 150,92 146,103 c0
line plank_j3 260,92 258,103 c0
line plank_j4 90,103 84,117 c0
line plank_j5 200,103 196,117 c0
line plank_j6 60,117 52,136 c0
line plank_j7 170,117 164,136 c0
line plank_j8 280,117 288,136 c0
poly patch_damp 118,14 150,14 146,30 120,34 8
poly patch_damp2 290,40 314,40 312,70 294,66 8
line crack_wall 104,16 108,26 104,38 c0
line crack_wall2 304,80 300,90 c0
rect amp_a 2,60,50,38 0 e8
rect amp_b 8,34,42,26 0 e8
rect amp_c 54,76,18,22 0 e8
line amp_a_handle 20,66 34,66 c7
line amp_b_handle 20,40 34,40 c7
dots amp_corners 4,62 50,62 4,96 50,96 10,36 48,36 c7
rect sticker_a 10,68,10,8 4
rect sticker_b 30,80,12,9 14
rect sticker_c 38,40,8,6 7
rect stencil 12,86,26,5 7
line amp_hatch_a 4,76 52,76 c8
poly shadow_amps 2,98 74,98 84,106 0,106 0
rect extinguisher 62,22,7,18 4
line extinguisher_hose 65,22 68,28 c0
line rail_br1 68,44 68,34 c7
line rail_br2 164,44 164,34 c7
line rail_pole 66,44 168,44 c7
poly stage_a 72,46 88,46 90,76 70,76 7
poly stage_b 90,46 106,46 108,82 88,82 2
poly stage_c 108,46 124,46 126,74 106,74 4
poly stage_d 126,46 142,46 144,78 124,78 7
dots seq_a 76,54 80,60 84,68 78,70 c15
dots seq_b 94,56 100,64 96,72 102,76 c10
dots seq_c 112,54 118,62 114,68 c14
dots seq_d 130,54 136,60 132,70 c15
poly stage_a_collar 76,46 84,46 80,52 8
poly stage_b_collar 94,46 102,46 98,52 8
line stage_fold1 80,56 80,74 c8
line stage_fold2 98,58 98,80 c0
rect mirror_frame 176,24,50,48 0
rect mirror_glass 180,28,42,40 8
poly mirror_glint 184,28 192,28 184,60 180,60 7
poly mirror_shade 200,50 222,50 222,68 190,68 0
rect bulb_on_1 177,24,3,3 14
rect bulb_off_1 190,24,3,3 8
rect bulb_on_2 202,24,3,3 14
rect bulb_off_2 214,24,3,3 8
rect bulb_off_3 222,36,3,3 8
rect bulb_on_3 222,48,3,3 14
rect bulb_off_4 222,60,3,3 8
rect bulb_off_5 176,36,3,3 8
rect bulb_on_4 176,48,3,3 14
rect bulb_off_6 176,60,3,3 8
rect bulb_off_7 190,69,3,3 8
rect bulb_on_5 204,69,3,3 14
rect bulb_off_8 216,69,3,3 8
rect dresser_body 170,78,64,22 5 e0
rect dresser_top 168,74,68,5 6 e0
rect dresser_lit 170,74,64,2 14
line dresser_drawer 172,88 232,88 c0
rect dresser_knob 198,90,6,2 7
rect bottle_a 178,64,4,10 2
rect bottle_b 184,66,3,8 7
rect grease_pots 208,68,14,6 7
rect brush 196,70,8,3 14
poly shadow_dresser 170,100 234,100 246,108 172,108 0
poly lit_floor 176,102 238,102 250,114 166,114 14
rect curtain_rod 236,18,48,3 7
rect curtain 240,21,40,81 0
line curtain_f1 248,21 247,100 c8
line curtain_f2 256,21 257,100 c8
line curtain_f3 264,21 263,100 c8
line curtain_f4 272,21 273,100 c8
line curtain_hem 240,100 280,100 c8
rect stool_seat 292,84,18,4 6 e0
line stool_leg1 294,88 292,106 c0
line stool_leg2 308,88 310,106 c0
rect poster_a 290,26,22,30 8
rect poster_band 293,30,16,8 4
ellipse poster_sun 301,46,4,4 14
line poster_tape 290,26 292,28 c7
line cable_a 60,108 100,112 130,106 c0
dots dropped_sequin 150,112 154,114 c14
line cable_b 252,110 280,114 300,110 c0`,
    overlays: [{ object: "jacket", at: [148, 46] }],
    cycles: [
      {
        name: "the mirror's bulbs",
        areas: ["bulb_on_1", "bulb_on_2", "bulb_on_3", "bulb_on_4", "bulb_on_5", "dresser_lit", "lit_floor"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  charlie: {
    version: 1,
    shot: "Eye level, looking north across the dance floor at the stage, no vanishing point; deepnight; one light, the magenta tube of the safety pin over the bar, a flat magenta patch round it on the wall and a magenta patch on the floor below it, cyan where the light lies on the floor; the low {stage} with the taped {kit} on columns 68-204 (a third at 107), the zinc {bar} with {Quino} behind it and the {sign} of the pin on the right at 214-320; dressing: {stickers} on stickers over the back wall, the {desk} on its plank and a tape deck at the left of the stage, the back {table} with a mirror, a blade and a note in the left corner, a black door in the back wall, bottles on shelves behind the bar; moves: the pin's clasp (the neon sign recipe: faulty), the tape deck's red light (the neon sign recipe: on and off).",
    draw: `rect ceiling 0,0,320,10 0
rect wall_back 0,10,320,84 1
rect beam 0,10,320,5 8
rect beam_under 0,15,320,2 0
rect floor_far 0,94,320,12 1
rect floor_mid 0,106,320,14 3
rect floor_near 0,120,320,16 1
line floor_gap1 0,106 320,106 c0
line floor_gap2 0,120 320,120 c0
poly spill_a 30,110 70,110 64,118 24,118 0
poly spill_b 190,124 250,124 240,132 180,132 0
poly spill_c 100,98 130,98 126,103 96,103 0
rect sticker_1 6,20,12,9 13
rect sticker_2 24,26,9,12 14
rect sticker_3 40,18,14,8 11
rect sticker_4 64,30,10,10 4
rect sticker_5 90,20,12,8 15
rect sticker_6 112,16,9,12 13
rect sticker_7 134,24,12,9 14
rect sticker_8 154,18,10,13 3
rect sticker_9 174,26,12,8 15
rect sticker_10 190,20,9,10 4
rect sticker_11 206,16,12,9 11
rect sticker_12 288,22,12,10 13
rect sticker_13 304,34,10,12 14
rect sticker_14 62,46,12,8 15
rect sticker_15 150,44,10,9 13
rect sticker_16 100,44,8,6 14
rect sticker_back_1 8,24,6,4 0
rect sticker_back_2 94,22,6,4 0
rect sticker_back_3 156,22,4,5 0
poly sticker_peel 168,40 184,40 180,52 170,50 7
poly patch_wall 220,50 250,50 246,64 224,66 8
rect backstage_door 4,36,22,58 0 e8
rect backstage_plate 18,62,5,8 7
line backstage_hinge 6,44 6,84 c8
rect stage_top 68,74,136,7 3
rect stage_front 68,81,136,15 1
line stage_edge 68,81 204,81 c0
rect stage_lip 68,96,136,2 0
poly stage_spill 100,82 140,82 136,90 96,90 0
line stage_seam1 96,82 94,96 c0
line stage_seam2 150,82 152,96 c0
line stage_seam3 184,82 186,96 c0
ellipse kit_bass 107,66,15,11 15
ellipse kit_bass_hole 107,66,5,5 8
line kit_tape1 93,62 121,70 c8
line kit_tape2 93,70 121,62 c8
rect kit_stand 102,76,10,2 8
ellipse kit_snare 138,66,10,4 7
ellipse kit_snare_top 138,63,10,3 15
line kit_snare_tape 130,63 146,63 c8
ellipse kit_tom 120,52,8,4 15
ellipse kit_tom2 144,50,8,4 15
line kit_tom_tape 112,52 128,52 c8
line kit_stand_a 120,56 120,64 c0
line kit_stand_b 144,54 144,62 c0
line kit_cymbal_arm 82,40 88,64 c8
ellipse kit_cymbal 82,40,10,2 14
ellipse kit_cymbal2 170,42,10,2 14
line kit_cymbal_arm2 170,42 166,64 c8
rect kit_stool 92,74,9,3 8
rect mic_stand 186,52,2,22 8
rect mic_head 184,48,6,5 7
rect sound_plank 30,92,40,4 6
rect sound_desk 32,84,38,8 8 e0
rect sound_panel 34,86,34,4 0
dots sound_knobs 38,87 44,87 50,87 56,87 62,87 c14
rect sound_plank_leg_l 32,96,3,10 6
rect sound_plank_leg_r 65,96,3,10 6
rect deck_body 40,78,18,6 8 e0
rect deck_led 54,80,2,2 4
rect table_top 2,104,30,5 6 e0
rect table_leg_l 5,109,3,12 6
rect table_leg_r 27,109,3,12 6
rect table_mirror 8,100,12,4 11
rect table_blade 22,102,5,2 7
rect table_note 11,98,9,2 14
line table_line 10,100 18,100 c7
poly table_lamp_dead 28,80 34,80 33,90 29,90 8
line table_lamp_cord 31,90 31,104 c0
rect bar_top 214,82,106,6 7 e0
rect bar_front 214,88,106,26 8
rect bar_foot 214,114,106,3 0
rect bar_panel1 224,92,22,18 1
rect bar_panel2 252,92,22,18 1
rect bar_panel3 280,92,22,18 1
line bar_gutter 214,88 320,88 c0
rect shelf_back 222,48,98,2 8
rect shelf_back2 222,64,98,2 8
rect bottle_1 228,38,4,10 4
rect bottle_2 236,40,3,8 2
rect bottle_3 296,40,4,8 14
rect bottle_4 304,36,4,12 11
rect bottle_5 238,54,4,10 14
rect bottle_6 288,54,3,10 4
rect quino_apron 246,58,26,24 0
rect quino_shirt 246,58,26,10 7
rect quino_arm_l 242,66,6,16 7
rect quino_arm_r 270,66,6,16 7
ellipse quino_head 259,50,6,7 7
line quino_mous 255,53 263,53 c0
rect quino_cloth 276,80,10,3 15
rect pin_glow 232,20,52,28 5
line pin_a 238,30 268,30 c13
line pin_b 238,31 268,31 c13
line pin_clasp1 268,26 278,26 278,38 268,38 c13
line pin_clasp2 268,27 277,27 277,37 268,37 c13
line pin_coil1 238,30 234,26 238,22 244,26 238,30 c13
line pin_coil2 238,31 235,27 238,23 243,26 238,31 c13
dots pin_dead 252,30 254,30 256,30 c5
poly bar_glow_floor 214,106 320,106 320,120 204,120 5
poly light_stage 80,98 190,98 200,118 70,118 3`,
    cycles: [
      {
        name: "the pin's clasp",
        areas: ["pin_clasp1", "pin_clasp2"],
        colors: [13, 5],
        style: "flicker",
        ms: [800, 4000]
      },
      { name: "the tape deck's light", areas: ["deck_led"], colors: [4, 8], style: "blink", ms: 1200 }
    ]
  },
  front: {
    version: 1,
    shot: "Eye level, looking north across the pavement at the club front, no vanishing point; neon; one light, the round lit porthole, a flat magenta glow round it and a magenta and pink patch of it on the pavement below, one small streetlamp in the left wing, the sky light magenta over magenta, the buildings blue and the road blue; the black {front} of the club on columns 120-292 with the {porthole} lit pink at its third (213) over the black {door} under it, {posters} over posters either side; dressing: the neighbouring buildings with a few lit windows and a pipe, a shuttered shop at the right, a kerb and the wet {avenue} with the lights streaked in it; moves: the porthole (the neon sign recipe: faulty), the streaks in the wet road (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,40 5
rect sky_low 0,26,320,14 13
rect cloud_a 30,12,70,4 13
rect cloud_b 220,18,60,4 13
rect bldg_left 0,32,120,64 1
rect bldg_left_cap 0,30,120,3 8
rect bldg_right 292,36,28,60 1
rect bldg_right_cap 292,34,28,3 8
rect win_l1 12,40,10,12 11
rect win_l2 32,40,10,12 0
rect win_l3 52,40,10,12 13
rect win_l4 78,40,10,12 0
rect win_l5 12,62,10,12 0
rect win_l6 32,62,10,12 11
rect win_l7 52,62,10,12 0
rect win_l8 78,62,10,12 15
rect win_ledge1 10,52,14,2 8
rect win_ledge2 30,52,14,2 8
rect win_ledge3 50,52,14,2 8
rect win_ledge4 76,52,14,2 8
line pipe_left 104,34 104,96 c8
line pipe_left_hi 105,34 105,96 c7
poly stain_left 0,76 40,76 36,96 0,96 0
line mortar_left1 0,58 120,58 c0
line mortar_left2 0,80 120,80 c0
line brick_joint1 20,58 20,80 c0
line brick_joint2 66,58 66,80 c0
line brick_joint3 94,34 94,58 c0
rect win_r1 298,44,10,12 11
rect shutter_r 296,64,20,32 stripes:8,0
line mortar_right 292,60 320,60 c0
rect club_front 120,20,172,76 0 e8
rect club_parapet 120,16,172,5 8
rect club_parapet_hi 120,16,172,1 7
poly stain_club 134,22 150,22 146,46 136,44 8
poly stain_club2 262,24 286,24 284,40 266,36 8
ellipse porthole_glow 213,46,19,19 5
ellipse porthole_ring 213,46,13,13 8
ellipse porthole_glass 213,46,10,10 13
ellipse porthole_core 213,46,5,5 15
dots porthole_bolts 200,46 226,46 213,33 213,59 204,37 222,37 204,55 222,55 c7
rect poster_1 130,54,18,28 13
rect poster_1_band 132,58,14,8 4
rect poster_2 150,60,16,24 14
rect poster_2_band 152,64,12,6 0
rect poster_3 166,52,14,32 11
rect poster_3_band 168,56,10,10 5
rect poster_4 134,84,14,10 15
rect poster_5 234,54,16,26 15
rect poster_5_band 236,58,12,8 4
rect poster_6 252,58,18,22 13
rect poster_6_band 254,62,14,6 0
rect poster_7 272,50,14,30 14
rect poster_7_band 274,54,10,10 5
poly poster_torn 180,56 190,60 184,70 178,66 0
poly poster_torn2 246,82 258,84 252,92 244,90 0
line poster_tape1 130,54 134,56 c7
line poster_tape2 272,50 276,52 c7
rect charlie_door 200,62,26,34 0 e8
line charlie_door_panel 202,80 224,80 c8
line charlie_door_hinge 202,64 202,94 c8
line charlie_door_handle 221,74 221,84 c7
rect charlie_card 204,68,6,8 15
rect door_step 196,96,34,3 7
rect door_step_shade 196,99,34,2 8
rect pave_far 0,96,320,5 5
rect pave_mid 0,101,320,9 1
line slab_1 40,101 34,110 c0
line slab_2 100,101 96,110 c0
line slab_3 160,101 158,110 c0
line slab_4 250,101 252,110 c0
line slab_5 300,101 306,110 c0
rect kerb 0,110,320,3 8
rect kerb_top 0,110,320,1 7
rect road 0,113,320,23 1
poly light_pave 190,96 238,96 246,110 182,110 5
poly light_pave_in 200,96 226,96 230,108 196,108 13
rect grate 90,109,16,3 0
line lamp_post 24,40 24,96 c8
rect lamp_head 18,34,12,5 8
ellipse lamp_globe 24,42,3,2 15
poly lamp_pool 6,96 42,96 48,110 0,110 13
line lamp_pool_edge 6,96 42,96 c5
line streak_p1 208,114 206,132 c13
line streak_p2 216,114 218,128 c5
line streak_p3 212,116 211,134 c13
line streak_c1 40,114 38,126 c11
line streak_c2 58,114 60,128 c15
line streak_c3 304,114 302,124 c11
line lane_1 20,128 60,128 c8
line lane_2 100,128 140,128 c8
line lane_3 260,128 300,128 c8
dots road_grit 80,120 150,124 190,130 250,122 280,134 c8
rect drain_road 150,124,12,2 0
poly road_patch 120,118 170,118 164,124 114,124 8`,
    cycles: [
      {
        name: "the porthole",
        areas: ["porthole_glass"],
        colors: [13, 5],
        style: "flicker",
        ms: [1500, 6000]
      },
      {
        name: "the streaks in the wet road",
        areas: ["streak_p1", "streak_p3"],
        colors: [15, 13, 5],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  metro: {
    version: 1,
    shot: "Eye level, looking north at the station wall, no vanishing point; neon; one light, the lit metro diamond over the arch, a flat cyan patch of it on the pavement below, the sky light magenta over magenta, the wall blue over grey tiles; the arch with its padlocked steel {shutter} on columns 72-142 (a third at 107) and the {payphone} on the tiled {wall} at its other third (213); dressing: notices taped to the wall, a litter bin, a drainpipe, a hours plate beside the arch, a bollard at the right, a puddle under the phone with the signs' colours streaked in the wet pavement; moves: the diamond's white core (the neon sign recipe: faulty), the puddle's glints (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,30 5
rect sky_low 0,18,320,12 13
rect cloud_a 200,8,70,4 13
rect cloud_b 20,12,50,4 13
rect station_wall 0,26,320,70 1
rect station_cap 0,24,320,3 8
rect station_cap_hi 0,24,320,1 7
rect tile_band 0,60,320,36 8
line tile_h1 0,66 320,66 c0
line tile_h2 0,72 320,72 c0
line tile_h3 0,78 320,78 c0
line tile_h4 0,84 320,84 c0
line tile_h5 0,90 320,90 c0
line tile_v1 20,60 20,96 c0
line tile_v2 48,60 48,96 c0
line tile_v3 160,60 160,96 c0
line tile_v4 182,60 182,96 c0
line tile_v5 236,60 236,96 c0
line tile_v6 262,60 262,96 c0
line tile_v7 292,60 292,96 c0
rect tile_chip1 8,68,4,4 1
rect tile_chip2 252,80,4,4 1
poly tile_stain 28,60 46,60 40,96 24,96 0
rect arch 72,44,70,52 0 e8
rect arch_top 70,40,74,5 7
rect metro_shutter 76,48,62,48 stripes:8,0
rect metro_shutter_bar 76,90,62,4 7
rect metro_padlock 104,84,6,6 14
line metro_chain 105,84 109,84 c7
line metro_shutter_seam 107,48 107,90 c0
poly metro_sign 106,16 122,28 106,40 90,28 11
poly metro_sign_in 106,21 115,28 106,35 97,28 15
line metro_sign_post 106,40 106,44 c8
rect hours_plate 124,48,12,8 7
line hours_a 126,51 134,51 c0
line hours_b 126,53 132,53 c0
rect payphone_hood 196,50,30,8 8
rect payphone_box 198,58,26,34 7 e0
rect payphone_panel 202,64,18,12 8
rect payphone_slot 213,80,6,2 0
dots payphone_dial 204,82 207,82 210,82 204,85 207,85 210,85 c0
line payphone_cord 205,76 201,84 203,90 c0
rect payphone_receiver 198,86,4,12 0
rect notice_1 236,50,12,16 13
rect notice_2 252,52,10,12 14
rect notice_3 266,48,12,18 11
rect notice_4 240,70,14,10 15
rect notice_5 258,72,10,12 4
rect notice_1_band 238,54,8,4 0
rect notice_3_band 268,52,8,4 0
poly notice_torn 280,56 290,60 284,70 278,66 0
line notice_tape1 236,50 240,52 c7
line notice_tape2 266,48 270,50 c7
rect bin_wall 18,76,16,20 8 e0
rect bin_wall_lid 16,73,20,4 7
line bin_wall_band 18,84 34,84 c0
line drain_left 52,28 52,96 c8
line drain_left_hi 53,28 53,96 c7
rect pave_far 0,96,320,6 5
rect pave_mid 0,102,320,14 1
rect pave_near 0,116,320,20 1
line slab_a 30,102 24,116 c0
line slab_b 90,102 84,116 c0
line slab_c 160,102 158,116 c0
line slab_d 230,102 232,116 c0
line slab_e 290,102 296,116 c0
line slab_f 60,116 50,136 c0
line slab_g 150,116 146,136 c0
line slab_h 250,116 258,136 c0
poly light_arch 80,96 140,96 152,114 68,114 3
poly light_arch_in 90,96 130,96 138,110 82,110 11
ellipse puddle 168,122,30,5 13
ellipse puddle_dark 168,125,24,3 5
line puddle_gl1 156,121 160,121 c15
line puddle_gl2 164,123 169,123 c13
line puddle_gl3 174,121 178,121 c15
line puddle_gl4 182,123 187,123 c13
line streak_m1 102,114 100,134 c11
line streak_m2 112,114 114,128 c3
line streak_m3 206,114 204,130 c13
poly shade_near 0,136 30,136 36,120 0,110 0
poly shade_near_r 320,136 290,136 284,124 320,112 0
rect bollard 268,86,6,12 8
rect bollard_cap 267,84,8,3 7
poly bollard_shadow 270,98 286,100 270,102 0
dots grit_near 40,124 70,128 120,132 200,126 240,132 c8
line kerb_far 0,102 320,102 c8`,
    cycles: [
      {
        name: "the diamond",
        areas: ["metro_sign_in"],
        colors: [15, 11],
        style: "flicker",
        ms: [800, 4000]
      },
      {
        name: "the puddle's glints",
        areas: ["puddle_gl1", "puddle_gl2", "puddle_gl3", "puddle_gl4"],
        colors: [15, 13, 5],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  crossing: {
    version: 1,
    shot: "Eye level, looking north across the avenue, no vanishing point; neon; one light, the lit glass door of the bank with a flat light cyan patch on its steps and a streak of it in the wet road, one small light, the orange clock on its pole, the sky light magenta over magenta; the {bank} with its four columns, pediment and bronze shutters on columns 112-320 with the door at its third (213), the tall blind {wall} of pale stone on the left at 0-112, the {clock} on its pole at the corner between them; dressing: torn bills on the wall, a kerb, zebra bars and a puddle on the road; moves: the clock's colon (the neon sign recipe: on and off), the puddle's glints (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,36 5
rect sky_low 0,22,320,14 13
rect cloud_a 170,8,80,4 13
rect cloud_b 262,16,48,3 13
rect bank_wall 0,6,112,90 8
rect bank_wall_b1 0,10,40,14 7
rect bank_wall_b2 42,12,30,12 7
rect bank_wall_b3 74,10,38,14 7
rect bank_wall_b4 10,28,34,14 7
rect bank_wall_b5 60,30,36,12 7
rect bank_wall_b6 0,46,26,14 7
rect bank_wall_b7 30,48,40,12 7
rect bank_wall_b8 78,46,34,14 7
rect bank_wall_b9 8,64,38,14 7
rect bank_wall_b10 52,66,30,12 7
rect bank_wall_b11 86,64,26,14 7
rect bank_wall_b12 0,82,34,14 7
rect bank_wall_b13 40,82,36,12 7
rect bank_wall_b14 82,82,30,14 7
line bank_wall_m1 0,26 112,26 c0
line bank_wall_m2 0,44 112,44 c0
line bank_wall_m3 0,62 112,62 c0
line bank_wall_m4 0,80 112,80 c0
poly bank_wall_stain 70,10 96,10 92,44 74,40 0
poly bank_wall_stain2 4,56 20,56 16,78 6,76 0
rect bank_wall_cap 0,4,112,3 7
rect bank_wall_bill 20,32,12,14 13
rect bank_wall_bill2 36,34,10,12 14
poly bank_wall_torn 50,50 60,54 54,62 48,58 0
rect bankfront_body 112,34,208,62 1
poly bankfront_pediment 124,34 216,18 308,34 8
poly bankfront_pediment_in 142,34 216,24 290,34 1
rect bankfront_cornice 112,32,208,4 7
rect bankfront_steps1 120,86,192,4 7
rect bankfront_steps2 116,90,200,3 8
rect bankfront_steps3 112,93,208,3 7
rect bankfront_door 203,56,20,30 11
line bankfront_door_bar 213,56 213,86 c0
line bankfront_door_bar2 203,70 223,70 c0
rect bankfront_door_frame 201,54,24,3 8
rect bankfront_col1 134,40,10,46 7
rect bankfront_col1_lit 135,40,3,46 15
rect bankfront_col1_dark 141,40,3,46 8
rect bankfront_col2 170,40,10,46 7
rect bankfront_col2_lit 171,40,3,46 15
rect bankfront_col2_dark 177,40,3,46 8
rect bankfront_col3 246,40,10,46 7
rect bankfront_col3_lit 247,40,3,46 15
rect bankfront_col3_dark 253,40,3,46 8
rect bankfront_col4 282,40,10,46 7
rect bankfront_col4_lit 283,40,3,46 15
rect bankfront_col4_dark 289,40,3,46 8
rect bankfront_shutter1 148,48,18,38 6
rect bankfront_shutter2 262,48,16,38 6
line bankfront_shutter1_rib 150,50 150,84 c0
line bankfront_shutter1_rib2 157,50 157,84 c0
line bankfront_shutter2_rib 264,50 264,84 c0
line bankfront_shutter2_rib2 271,50 271,84 c0
rect bankfront_plate 184,42,14,8 14
line bankfront_plate_a 186,45 196,45 c0
rect bankfront_lamp_l 190,50,4,4 15
rect bankfront_lamp_r 232,50,4,4 15
poly light_steps 196,93 230,93 240,100 186,100 11
poly light_door 207,86 219,86 223,93 203,93 15
line clock_bracket 112,56 124,56 c8
rect clock_box 120,50,26,14 0 e8
line clock_d1 124,54 128,54 c12
line clock_d2 132,54 136,54 c12
line clock_d3 124,60 128,60 c12
line clock_d4 132,60 136,60 c12
dots clock_colon 130,55 130,59 c12
rect clock_pole 112,64,3,32 8
rect pave_far 0,96,320,6 5
rect pave_mid 0,102,320,10 1
rect kerb 0,112,320,3 8
rect kerb_top 0,112,320,1 7
rect road 0,115,320,21 1
line slab_1 50,102 44,112 c0
line slab_2 120,102 118,112 c0
line slab_3 230,102 232,112 c0
line slab_4 290,102 296,112 c0
rect zebra_1 30,120,32,6 8
rect zebra_2 76,120,32,6 8
rect zebra_3 122,120,32,6 8
rect zebra_4 168,120,32,6 8
rect zebra_5 214,120,32,6 8
rect zebra_6 260,120,32,6 8
line streak_c1 210,116 208,134 c11
line streak_c2 217,116 219,130 c3
line streak_o1 132,116 134,128 c12
line streak_o2 140,116 139,132 c4
line streak_w1 60,116 58,126 c8
poly light_road 190,115 236,115 250,136 176,136 5
poly puddle_road 80,128 120,128 114,134 74,134 8
line puddle_gl1 90,130 96,130 c15
line puddle_gl2 100,132 106,132 c7
poly shade_near 0,136 28,136 32,122 0,116 0
poly shade_near_r 320,136 296,136 292,124 320,118 0`,
    cycles: [
      { name: "the clock's colon", areas: ["clock_colon"], colors: [12, 4], style: "blink", ms: 1000 },
      {
        name: "the puddle's glints",
        areas: ["puddle_gl1", "puddle_gl2"],
        colors: [15, 7, 8],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  coachstop: {
    version: 1,
    shot: "Eye level, looking north along the kerb, no vanishing point; neon; one light, the warm lit tailor's shop behind its half-raised shutter, a flat yellow patch of it on the pavement, the sky light magenta over magenta, the buildings blue; the tailor's {shutter} half raised over the lit shop on columns 76-160 (a third at 107) and the long grey {coach} at the kerb on columns 152-318 (a third at 213); the bus {shelter} with one pane gone and the {timetable} on the left at 0-70; dressing: shop gold lettering on the glass, a dummy and bolts of cloth inside, sweet wrappers under the bench, a cracked puddle on the road, lit windows on the building at the right; moves: the shop's light (the lamplight recipe: a flicker), the puddle's glints (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,34 5
rect sky_low 0,22,320,12 13
rect cloud_a 180,10,80,4 13
rect bldg_right 172,30,148,70 1
rect bldg_right_cap 172,28,148,3 8
rect bldg_gap 168,26,4,74 0
rect win_r1 184,38,10,12 11
rect win_r2 204,38,10,12 0
rect win_r3 224,38,10,12 13
rect win_r4 244,38,10,12 0
rect win_r5 264,38,10,12 0
rect win_r6 284,38,10,12 15
rect win_r7 304,38,10,12 0
rect win_ledge1 182,50,14,2 8
rect win_ledge2 222,50,14,2 8
rect win_ledge3 282,50,14,2 8
line mortar_r1 172,60 320,60 c0
line mortar_r2 172,80 320,80 c0
poly stain_r 232,60 262,60 256,80 236,78 0
rect shop_wall 66,26,104,72 1
rect shop_cap 66,24,104,3 8
rect shop_cornice 66,46,104,4 8
line shop_mortar 66,40 170,40 c0
line shop_mortar2 66,62 170,62 c0
rect shopfront_interior 76,52,84,44 6
rect shopfront_gold1 84,78,20,3 14
rect shopfront_gold2 108,78,26,3 14
rect shopfront_gold3 138,78,16,3 14
rect shopfront_counter 120,86,38,10 14
poly shopfront_dummy 88,84 96,84 98,96 86,96 0
rect shopfront_dummy_head 90,80,4,5 0
line shopfront_shelf 78,70 158,70 c8
rect shopfront_bolt1 100,64,10,6 5
rect shopfront_bolt2 112,64,10,6 4
rect shop_door 76,52,84,22 stripes:8,0
rect shop_door_bar 76,72,84,3 7
line shop_door_hi 76,53 160,53 c7
rect shop_frame_l 74,50,3,48 8
rect shop_frame_r 160,50,3,48 8
rect shop_sill 72,96,94,3 8
rect pave_far 0,98,320,6 5
rect pave_mid 0,104,320,6 1
rect kerb 0,110,320,3 8
rect kerb_top 0,110,320,1 7
poly light_shop 76,99 160,99 172,110 66,110 14
rect road 0,113,320,23 1
rect shelter_roof 0,50,70,4 8
rect shelter_roof_hi 0,50,70,1 7
rect shelter_post1 2,54,3,46 8
rect shelter_post2 65,54,3,46 8
rect shelter_pane1 5,56,28,40 3
rect shelter_pane2 36,56,28,40 0
poly shelter_shard1 36,56 46,56 36,72 0
poly shelter_shard2 64,96 54,96 64,84 0
line shelter_rail 5,76 33,76 c8
rect shelter_bench 8,92,50,3 6
line shelter_bench_leg1 12,95 12,104 c0
line shelter_bench_leg2 54,95 54,104 c0
rect timetable 40,64,20,28 7 e0
line timetable_crack 42,66 52,76 56,90 c15
line timetable_a 43,70 56,70 c0
line timetable_b 43,75 56,75 c0
line timetable_c 43,80 54,80 c0
dots wrappers 8,106 22,108 34,104 58,108 70,106 c14
poly shade_shelter 0,100 70,100 78,106 0,106 0
rect coach_body 152,62,166,46 7
rect coach_roof 152,58,166,5 8
rect coach_lower 152,94,166,14 8
line coach_stripe 152,92 318,92 c0
rect coach_win_1 160,68,18,16 8 e0
rect coach_win_2 182,68,18,16 8 e0
rect coach_win_3 204,68,18,16 8 e0
rect coach_win_4 226,68,18,16 8 e0
rect coach_win_5 248,68,18,16 8 e0
poly coach_windscreen 296,64 318,72 318,90 296,90 11 e0
rect coach_card 302,76,10,8 15
rect coach_door 280,66,14,42 8 e0
rect coach_door_glass 283,70,8,18 11
rect coach_lamp 314,100,5,4 14
ellipse coach_wheel_1 186,108,11,11 0
ellipse coach_hub_1 186,108,4,4 7
ellipse coach_wheel_2 266,108,11,11 0
ellipse coach_hub_2 266,108,4,4 7
line coach_hi 154,64 276,64 c15
rect coach_mirror 292,62,4,6 8
poly coach_shadow 150,112 316,112 306,118 160,118 0
line streak_s1 90,113 88,130 c14
line streak_s2 108,113 110,128 c14
line streak_s3 130,113 128,134 c6
line streak_c1 214,115 212,132 c11
poly puddle_road 30,122 80,122 74,130 22,130 8
line puddle_gl1 40,124 46,124 c15
line puddle_gl2 54,126 60,126 c7
poly shade_near 0,136 28,136 34,124 0,118 0
poly shade_near_r 320,136 296,136 290,126 320,120 0`,
    overlays: [{ object: "gafas", at: [60, 106], tall: 50 }, { object: "merche", at: [140, 106], tall: 52 }],
    cycles: [
      {
        name: "the shop's light",
        areas: ["shopfront_counter", "light_shop"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      },
      {
        name: "the puddle's glints",
        areas: ["puddle_gl1", "puddle_gl2"],
        colors: [15, 7, 8],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  tailor: {
    version: 1,
    shot: "Eye level, looking north into the shop, no vanishing point; lamplight; one light, the pendant lamp over the dummy, a flat yellow patch of it on the floor, one small light, the yellow glow behind the bead curtain, the corners going to dark; the {dummy} in its half-made grey suit on columns 80-130 (a third at 107), the {counter} with the brass {bell}, the till and the {invoice} pinned above it on columns 150-252, the bead {curtain} to the workshop at 246-298; dressing: bolts of {cloth} on three shelves in the left wing, a bolt on the counter, shears on a hook, a tape measure along the counter's edge, plank floor; moves: the pendant lamp's light (the lamplight recipe: a flicker).",
    draw: `rect ceiling 0,0,320,10 8
rect wall_back 0,10,320,82 6
rect skirting 0,88,320,4 5
poly corner_l 0,10 24,10 14,92 0,92 mix:6,0@0.5
poly corner_r 320,10 300,10 308,92 320,92 mix:6,0@0.5
rect floor_far 0,92,320,10 6
rect floor_mid 0,102,320,14 8
rect floor_near 0,116,320,20 6
line floor_gap1 0,102 320,102 c0
line floor_gap2 0,116 320,116 c0
line plank_j1 50,92 46,102 c0
line plank_j2 160,92 158,102 c0
line plank_j3 270,92 272,102 c0
line plank_j4 100,102 94,116 c0
line plank_j5 220,102 222,116 c0
line plank_j6 30,116 20,136 c0
line plank_j7 140,116 136,136 c0
line plank_j8 260,116 268,136 c0
poly patch_damp 160,12 196,12 190,28 164,30 8
line crack_wall 280,14 284,28 278,40 c0
rect shelf_a 0,30,70,3 8
rect shelf_b 0,54,70,3 8
rect shelf_c 0,78,70,3 8
rect bolt_a1 4,16,14,14 8
rect bolt_a2 20,18,12,12 0
rect bolt_a3 34,14,14,16 2
rect bolt_a4 50,18,14,12 7
rect bolt_b1 6,40,12,14 0
rect bolt_b2 20,38,16,16 2
rect bolt_b3 38,42,12,12 8
rect bolt_b4 52,40,14,14 6
rect bolt_c1 4,64,16,14 7
rect bolt_c2 22,66,12,12 8
rect bolt_c3 36,62,14,16 0
rect bolt_c4 52,66,14,12 2
line bolt_a1_edge 4,20 18,20 c0
line bolt_b2_edge 20,46 36,46 c0
line bolt_c3_edge 36,70 50,70 c0
rect shelf_label_1 6,32,8,2 15
rect shelf_label_2 40,56,8,2 15
line pendant_cord 107,10 107,24 c0
poly pendant_shade 99,26 115,26 119,33 95,33 8 e0
ellipse pendant_bulb 107,34,4,2 14
line tdummy_pole 107,70 107,100 c0
rect tdummy_base 99,100,16,3 8
poly tdummy_torso 94,44 120,44 124,58 116,84 98,84 90,58 8
poly tdummy_lapel_l 100,44 107,44 107,66 98,56 7
poly tdummy_lapel_r 107,44 114,44 116,56 107,66 7
poly tdummy_sleeve_l 90,58 80,86 86,88 96,66 8
poly tdummy_sleeve_r 120,58 130,80 126,84 116,66 7
ellipse tdummy_neck 107,42,4,3 6
line tdummy_tape 100,44 98,56 c14
line tdummy_tape2 114,44 116,56 c14
dots tdummy_pins 122,62 126,74 82,78 90,84 c14
line tdummy_basting 124,62 128,78 c15
rect counter_top 150,80,100,5 6 e0
rect counter_lit 152,80,96,1 14
rect counter_front 150,85,100,28 6
rect counter_panel_1 156,90,26,18 5
rect counter_panel_2 190,90,26,18 5
rect counter_panel_3 224,90,22,18 5
rect counter_tape 150,83,100,2 14
dots counter_ticks 156,84 164,84 172,84 180,84 188,84 196,84 204,84 212,84 220,84 228,84 236,84 244,84 c0
ellipse bell 206,77,5,3 14
rect bell_button 205,73,3,3 14
rect till_body 228,66,22,14 8 e0
rect till_top 226,64,26,3 7
dots till_keys 232,72 236,72 240,72 244,72 232,75 236,75 240,75 244,75 c7
rect invoice 230,38,13,17 15
line invoice_a 232,43 241,43 c0
line invoice_b 232,47 241,47 c0
line invoice_c 232,51 238,51 c0
dots invoice_pin 236,39 c4
rect bolt_counter 162,70,28,10 2
line bolt_counter_edge 162,75 190,75 c0
rect shears_hook 142,30,2,3 8
poly shears 140,34 146,34 144,50 142,50 7
rect door_frame_top 246,28,52,4 8
rect door_frame_l 246,28,4,68 8
rect door_frame_r 294,28,4,68 8
rect bead_glow 250,32,44,64 14
line bead_1 254,32 254,92 c8
line bead_2 259,32 259,88 c6
line bead_3 264,32 264,94 c8
line bead_4 269,32 269,90 c6
line bead_5 274,32 274,94 c8
line bead_6 279,32 279,88 c6
line bead_7 284,32 284,92 c8
line bead_8 289,32 289,90 c6
poly light_floor 80,102 135,102 150,116 66,116 14
poly light_beads 250,96 294,96 306,110 238,110 14
poly shadow_counter 150,113 252,113 262,120 154,120 0
poly shadow_dummy 100,103 130,103 138,108 92,108 0
poly shade_near 0,136 30,136 34,122 0,116 0
poly shade_near_r 320,136 292,136 288,124 320,118 0`,
    cycles: [
      {
        name: "the pendant lamp",
        areas: ["pendant_bulb", "light_floor", "counter_lit"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  workshop: {
    version: 1,
    shot: "Eye level, looking north at the end wall, no vanishing point; lamplight; one light, the hanging lamp over the bench, a flat yellow strip on the bench's top edge and a flat patch of it on the floor, the corners going to dark; the old {tailor} Bonifacio seated at the {bench} on columns 94-132 (a third at 107) with the sewing machine on its left, the stained {sheet} pinned flat to the wall on columns 190-290 (a third at 213), a plank {shelf} over the bench with the stopped clock and a button tin and room for the lantern; dressing: bolts of cloth leaning in the left wing, tape measures on a rail, scraps of cloth and thread on the floor, pins in a saucer and chalk on the bench; moves: the lamp's light (the lamplight recipe: a flicker).",
    draw: `rect ceiling 0,0,320,10 8
rect wall_back 0,10,320,82 6
rect skirting 0,88,320,4 5
poly corner_l 0,10 22,10 14,92 0,92 mix:6,0@0.5
poly corner_r 320,10 302,10 308,92 320,92 mix:6,0@0.5
rect floor_far 0,92,320,10 6
rect floor_mid 0,102,320,14 8
rect floor_near 0,116,320,20 6
line floor_gap1 0,102 320,102 c0
line floor_gap2 0,116 320,116 c0
line plank_j1 60,92 56,102 c0
line plank_j2 180,92 178,102 c0
line plank_j3 280,92 282,102 c0
line plank_j4 120,102 114,116 c0
line plank_j5 240,102 242,116 c0
line plank_j6 70,116 60,136 c0
line plank_j7 200,116 196,136 c0
rect sheet 190,22,100,64 7
rect sheet_hem 190,22,100,3 15
poly sheet_stain_1 206,34 232,30 246,44 240,60 218,64 204,52 8
poly sheet_stain_2 248,48 272,44 280,62 262,74 250,66 8
poly sheet_stain_3 196,66 214,70 210,82 198,82 8
line sheet_fold1 190,48 290,50 c8
line sheet_fold2 238,25 240,86 c8
dots sheet_pins 192,26 238,26 286,26 192,84 288,84 c14
poly sheet_shadow 290,26 296,30 296,92 290,86 0
rect bolt_l1 6,30,10,60 2
poly bolt_l1_top 6,30 16,30 18,26 8,26 8
rect bolt_l2 20,34,10,56 8
poly bolt_l2_top 20,34 30,34 32,30 22,30 7
rect bolt_l3 34,40,10,50 0 e8
line bolt_l1_edge 12,32 12,88 c0
line bolt_l2_edge 26,36 26,88 c0
rect shelf_plank 40,32,100,3 8
rect shelf_plank_hi 40,32,100,1 7
rect shelf_bracket1 48,35,3,8 8
rect shelf_bracket2 128,35,3,8 8
rect clock_case 52,18,14,14 7 e0
ellipse clock_face 59,25,5,5 15
line clock_hands 59,25 59,21 c0
line clock_hands2 59,25 62,26 c0
rect button_tin 72,24,12,8 4
rect button_tin_lid 72,22,12,3 7
line button_tin_band 72,28 84,28 c0
line lamp_cord 164,10 164,38 c0
poly lamp_shade 156,38 172,38 178,46 150,46 8 e0
ellipse lamp_bulb 164,47,5,2 14
rect bench_top 30,78,150,6 6 e0
rect bench_lit 40,78,130,1 14
rect bench_front 34,84,142,26 5
rect bench_drawer1 42,88,34,16 6
rect bench_drawer2 82,88,34,16 6
rect bench_drawer3 122,88,46,16 6
dots bench_knobs 58,96 98,96 144,96 c14
rect bench_leg_l 34,110,5,6 5
rect bench_leg_r 171,110,5,6 5
rect machine_base 54,74,38,4 8 e0
poly machine_body 56,58 86,58 90,74 54,74 8 e0
rect machine_arm 56,54,34,5 8
ellipse machine_wheel 94,60,6,6 7
line machine_needle 60,59 60,73 c15
rect machine_cloth 50,73,44,3 2
rect chalk 150,75,9,3 15
ellipse pin_saucer 138,76,7,2 7
dots pin_heads 134,75 138,75 142,75 c14
poly cloth_lap 98,70 128,70 124,82 100,82 2
poly bonifacio_body 98,50 126,50 130,80 94,80 0
poly bonifacio_shirt 104,50 120,50 122,66 102,66 7
poly bonifacio_arm_l 98,56 90,72 98,78 106,62 7
poly bonifacio_arm_r 126,56 132,72 124,76 118,62 7
ellipse bonifacio_head 112,44,6,7 7
rect bonifacio_hair 106,37,12,4 15
line bonifacio_glasses 107,40 117,40 c0
line bonifacio_glasses2 108,45 116,45 c0
line bonifacio_tape 105,52 119,52 c14
dots bonifacio_pins 104,56 106,60 108,64 c14
rect hook_rail 6,22,30,2 8
line hook_tape1 12,24 12,34 c14
line hook_tape2 24,24 24,30 c14
poly scrap_1 150,120 172,120 168,128 148,128 2
poly scrap_2 220,126 240,126 244,132 224,134 4
poly scrap_3 84,122 100,122 98,130 82,128 8
dots thread_bits 190,112 208,120 226,114 258,122 276,128 c14
poly light_floor 118,102 188,102 204,116 104,116 14
poly shadow_bench 34,110 178,110 190,118 40,118 0
poly shade_near 0,136 28,136 32,122 0,116 0
poly shade_near_r 320,136 294,136 290,124 320,118 0`,
    overlays: [{ object: "lantern", at: [108, 16] }],
    cycles: [
      {
        name: "the hanging lamp",
        areas: ["lamp_bulb", "bench_lit", "light_floor"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  opera: {
    version: 1,
    shot: "Eye level, looking south into the room from the door, no vanishing point; lamplight; one light, the brass lamp of seven bulbs over the stage with a flat yellow patch on the stage front, one small light, the candle in a bottle with two flat nested glows, the corners going to dark; {Cano} at the round {table} with the candle before him on the red plush booth on columns 98-150 (a third at 107), the short mahogany {bar} with {Aniceto} behind it and the {machine} on it on the left at 0-98, the tiny {stage} under the {lamp} of seven bulbs on columns 196-278; dressing: the gilt {mirror} with holes in its silver and bottles on a shelf behind the bar, a mic stand and a stool on the stage, a second {plush} booth in the right wing, a plank floor; moves: the lamp's light (the lamplight recipe: a flicker), the candle's glow (the candle recipe: a flicker).",
    draw: `rect ceiling 0,0,320,10 8
rect wall_back 0,10,320,82 6
rect skirting 0,88,320,4 5
poly corner_l 0,10 20,10 12,92 0,92 mix:6,0@0.5
poly corner_r 320,10 304,10 310,92 320,92 mix:6,0@0.5
rect floor_far 0,92,320,10 6
rect floor_mid 0,102,320,14 8
rect floor_near 0,116,320,20 6
line floor_gap1 0,102 320,102 c0
line floor_gap2 0,116 320,116 c0
line plank_j1 60,92 56,102 c0
line plank_j2 200,92 198,102 c0
line plank_j3 100,102 94,116 c0
line plank_j4 250,102 252,116 c0
line plank_j5 40,116 30,136 c0
line plank_j6 170,116 166,136 c0
line plank_j7 290,116 298,136 c0
rect gilt_frame 2,12,100,44 14
rect gilt_glass 6,16,92,36 8
poly gilt_hole1 14,20 30,20 26,34 16,32 6
poly gilt_hole2 62,38 82,36 84,50 66,50 6
poly gilt_hole3 84,18 94,18 92,28 86,26 6
line gilt_shine1 10,18 22,48 c7
line gilt_shine2 40,18 52,50 c7
rect gilt_top 2,10,100,3 6
dots gilt_studs 8,14 34,14 60,14 86,14 c6
rect shelf_bar 40,34,58,2 8
rect shelf_bar_hi 40,34,58,1 7
rect bottle_1 44,24,4,10 2
rect bottle_2 52,22,4,12 4
rect bottle_3 60,26,4,8 7
rect bottle_4 68,24,4,10 2
rect bottle_5 76,26,4,8 4
rect bottle_anis 86,22,4,12 7
rect bottle_anis_label 86,27,4,4 14
rect machine_body 6,58,26,20 7 e0
rect machine_lit 8,58,4,20 15
rect machine_dark 28,58,4,20 8
rect machine_top 4,54,30,4 8 e0
line machine_wand 34,62 40,72 c7
rect machine_cups 10,52,16,2 15
rect machine_tray 8,74,22,3 8
poly aniceto_body 46,48 74,48 78,80 42,80 15
rect aniceto_tie 58,51,6,3 4
ellipse aniceto_head 60,42,6,7 7
rect aniceto_hair 55,35,10,3 8
poly aniceto_arm_l 46,54 40,70 48,74 54,62 15
poly aniceto_arm_r 74,54 80,68 72,72 68,62 15
rect aniceto_cup 76,68,6,5 15
line aniceto_cloth 72,70 80,66 c7
rect bar_top 0,78,98,5 6 e0
rect bar_lit 2,78,94,1 14
rect bar_front 0,83,98,26 5
rect bar_panel1 6,88,26,16 6
rect bar_panel2 38,88,26,16 6
rect bar_panel3 70,88,24,16 6
dots bar_studs 12,92 20,92 44,92 52,92 76,92 84,92 c14
rect bar_foot 0,109,98,3 0
rect plush_a 98,48,52,40 4
poly plush_a_worn 104,52 118,52 114,68 106,66 6
poly plush_a_worn2 130,62 144,60 142,78 132,78 6
dots plush_a_buttons 108,60 122,60 136,60 108,72 122,72 136,72 c0
poly cano_body 108,52 136,52 140,86 104,86 0
ellipse cano_head 122,44,6,7 7
rect cano_hair 116,37,12,4 8
line cano_mous 118,47 126,47 c0
dots cano_chain 118,54 121,56 124,56 127,54 c14
rect plush_a_seat 98,84,52,8 6 e0
rect table_top 108,86,28,4 6 e0
rect cano_hand_l 110,84,7,3 7
rect cano_hand_r 128,84,7,3 7
rect table_stem 120,90,4,18 0
rect table_foot 112,106,20,3 8
rect candle_bottle 119,72,5,14 2
rect candle_wax 120,66,3,6 15
ellipse candle_glow_out 121,66,14,10 6
ellipse candle_glow_in 121,66,7,5 14
ellipse candle_flame 121,63,2,3 12
dots candle_core 121,63 c14
rect lamp7_cord 236,10,2,14 0
rect lamp7_bar 212,24,50,3 6 e0
rect lamp7_b1 213,27,4,4 14
rect lamp7_b2 221,27,4,4 14
rect lamp7_b3 229,27,4,4 14
rect lamp7_b4 237,27,4,4 14
rect lamp7_b5 245,27,4,4 14
rect lamp7_b6 253,27,4,4 14
rect lamp7_dead 259,27,4,4 8
rect stage_top 196,76,82,5 6 e0
rect stage_front 196,81,82,12 5
rect stage_step 232,93,24,3 6
poly stage_spot 206,81 268,81 274,93 200,93 14
rect mic_stand 236,52,2,24 8
rect mic_head 234,48,6,5 7
rect stage_stool 252,68,8,4 6
line stage_stool_l1 253,72 252,76 c0
line stage_stool_l2 259,72 260,76 c0
line mic_cable 237,76 220,84 c0
rect plush_b 282,42,38,46 4
rect plush_b_seat 282,82,38,10 6 e0
poly plush_b_worn 288,48 304,46 300,66 290,64 6
dots plush_b_buttons 292,56 306,56 292,70 306,70 c0
rect curtain_rail 276,36,44,2 8
poly shadow_bar 0,112 98,112 108,118 0,118 0
poly shadow_table 108,108 138,108 148,114 106,114 0
poly lit_floor 100,102 150,102 160,114 92,114 14
poly shade_near 0,136 28,136 32,122 0,116 0
poly shade_near_r 320,136 292,136 288,124 320,118 0`,
    facing: "s",
    cycles: [
      {
        name: "the lamp of seven bulbs",
        areas: ["lamp7_b1", "lamp7_b2", "lamp7_b3", "lamp7_b4", "lamp7_b5", "lamp7_b6", "stage_spot"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      },
      {
        name: "the candle",
        areas: ["candle_glow_in"],
        colors: [14, 6],
        style: "flicker",
        ms: [500, 1600]
      }
    ]
  },
  hostal: {
    version: 1,
    shot: "Eye level, looking south into the lobby from the door, no vanishing point; pinklobby; one light, the paper-shaded desk lamp, a flat yellow patch of it on the wall behind and a strip on the desk top, ceiling and floor in greys; {Visitación} in black behind the {desk} with the register and the cigar box at her elbow on columns 40-190 (a third at 107), the {keys} on their board right of her at 150-200 and the {stairs} going up on the right at 232-320; dressing: the {tariff} card on the left wall, a plastic plant in the left corner, a clock, a worn lino floor with seams; moves: the lamp's light (the lamplight recipe: a flicker).",
    draw: `rect ceiling 0,0,320,12 8
rect ceiling_beam 0,12,320,3 7
rect wall_left 0,15,160,73 13
rect wall_right 160,15,160,73 6
rect dado_left 0,70,160,18 5
rect dado_right 160,70,160,18 8
line dado_rail 0,70 320,70 c8
rect skirting 0,88,320,4 0
poly wall_stain_l 20,30 40,30 36,56 22,54 6
poly wall_stain_r 204,20 232,20 228,44 208,40 5
line wall_crack_l 70,18 74,30 68,44 c6
line wall_crack_r 280,18 284,34 c0
rect floor_far 0,92,320,10 8
rect floor_mid 0,102,320,14 7
rect floor_near 0,116,320,20 8
line floor_gap1 0,102 320,102 c0
line floor_gap2 0,116 320,116 c0
poly lino_worn 120,102 190,102 196,116 112,116 8
line lino_seam1 60,92 54,102 c0
line lino_seam2 150,92 148,102 c0
line lino_seam3 250,92 254,102 c0
line lino_seam4 90,102 82,116 c0
line lino_seam5 210,102 214,116 c0
line lino_seam6 40,116 30,136 c0
line lino_seam7 160,116 156,136 c0
line lino_seam8 280,116 290,136 c0
rect tariff_card 20,28,28,36 15 e0
rect tariff_band 23,32,22,6 4
line tariff_a 24,44 44,44 c0
line tariff_b 24,48 44,48 c0
line tariff_c 24,52 40,52 c0
line tariff_d 24,56 42,56 c0
dots tariff_pins 21,29 46,29 c4
rect keys_board 150,30,50,36 6 e0
dots keys_hooks1 154,38 162,38 170,38 178,38 186,38 194,38 c7
dots keys_hooks2 154,48 162,48 170,48 178,48 186,48 194,48 c7
dots keys_hooks3 154,58 162,58 170,58 186,58 194,58 c7
dots keys_row1 154,41 162,41 170,41 178,41 186,41 194,41 c14
dots keys_row2 154,51 162,51 170,51 178,51 186,51 194,51 c14
dots keys_row3 154,61 162,61 170,61 186,61 194,61 c14
rect keys_cap 148,28,54,3 8
ellipse clock_face 220,30,8,8 15
line clock_hand1 220,30 220,25 c0
line clock_hand2 220,30 224,32 c0
ellipse clock_rim 220,30,9,9 8
rect pot 8,76,16,14 4
ellipse plant_a 12,62,8,8 2
ellipse plant_b 22,66,7,7 10
ellipse plant_c 16,54,6,6 2
line plant_stem 16,62 16,76 c2
poly visitacion_body 90,50 124,50 128,78 86,78 0
ellipse visitacion_head 107,42,6,7 7
rect visitacion_hair 101,35,12,5 8
ellipse visitacion_bun 107,31,4,3 8
line visitacion_chain 102,48 105,56 109,56 112,48 c7
rect visitacion_glasses 102,41,10,2 0
poly visitacion_arm_l 90,56 82,74 92,78 98,64 0
poly visitacion_arm_r 124,56 134,72 124,76 118,64 0
rect visitacion_box 128,70,18,7 6 e0
rect visitacion_box_band 130,72,14,2 15
rect desk_top 40,76,150,5 6 e0
rect desk_lit 44,76,142,1 14
rect desk_front 44,81,142,22 5
rect desk_panel1 50,86,40,12 6
rect desk_panel2 96,86,40,12 6
rect desk_panel3 142,86,40,12 6
dots desk_knobs 70,92 116,92 162,92 c14
rect register 78,70,26,6 15
line register_a 82,72 100,72 c4
line register_b 82,74 98,74 c0
line register_spine 91,70 91,76 c0
rect pen_stand 112,72,4,4 4
poly lit_wall 130,44 182,44 188,76 124,76 14
rect lamp_pool 120,80,60,2 14
line lamp_stem 156,76 156,64 c8
poly lamp_shade 146,50 166,50 170,64 142,64 6
rect lamp_base 150,74,12,3 8
rect stairs_wall 232,15,88,73 6
poly stairs_dark 232,20 320,20 320,50 232,88 8
poly stairs_run 232,92 232,88 320,48 320,56 0
rect stair_1 236,84,16,8 7
rect stair_2 252,76,16,16 8
rect stair_3 268,68,16,24 7
rect stair_4 284,60,16,32 8
rect stair_5 300,52,20,40 7
line stair_edge1 236,84 252,84 c0
line stair_edge2 252,76 268,76 c0
line stair_edge3 268,68 284,68 c0
line stair_edge4 284,60 300,60 c0
line stairs_rail 236,70 320,34 c6
rect stairs_post 236,70,3,22 6
rect stairs_runner 236,88,84,3 4
poly shadow_desk 40,103 190,103 204,110 46,110 0
poly shade_near 0,136 28,136 32,122 0,116 0
poly shade_near_r 320,136 296,136 292,124 320,118 0`,
    facing: "s",
    overlays: [{ object: "dni", at: [130, 54] }, { object: "merche", at: [200, 114], tall: 54 }],
    cycles: [
      {
        name: "the desk lamp",
        areas: ["lit_wall", "desk_lit", "lamp_pool"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  landing: {
    version: 1,
    shot: "Eye level, looking north along the landing, vanishing point on the end wall's third at (213,66); pinklobby; one light, the paper-shaded lamp hanging mid-way, a flat yellow patch of it on the floor and a strip on each wall, ceiling and floor in greys, each wall pink giving way to brown; three shut numbered {doors} down each side, the near left and right ones the ways to rooms 3 and 7, the {lamp} hanging at the middle, a small window at the end with a radiator and an extinguisher; dressing: a worn lino path to the boards, door mats, a stained ceiling, a small picture at the end; moves: the lamp's light (the lamplight recipe: a flicker).",
    draw: `vp 213,66
rect back_wall 149,46,96,41 6
rect back_dado 149,74,96,13 5
line back_rail 149,74 245,74 c8
line back_skirt 149,86 245,86 c0
poly ceiling 0,0@1 320,0@1 320,0@0.3 0,0@0.3 8
poly wall_left_near 0,0@1 0,0@0.62 0,136@0.62 0,136@1 13
poly wall_left_far 0,0@0.62 0,0@0.3 0,136@0.3 0,136@0.62 6
poly wall_right_near 320,0@1 320,0@0.62 320,136@0.62 320,136@1 6
poly wall_right_far 320,0@0.62 320,0@0.3 320,136@0.3 320,136@0.62 13
poly floor_far 0,136@0.55 320,136@0.55 320,136@0.3 0,136@0.3 8
poly floor_mid 0,136@0.8 320,136@0.8 320,136@0.55 0,136@0.55 7
poly floor_near 0,136@1 320,136@1 320,136@0.8 0,136@0.8 8
poly lino_path 100,136@1 230,136@1 230,136@0.3 100,136@0.3 6
line lino_gap1 0,136@0.8 320,136@0.8 c0
line lino_gap2 0,136@0.55 320,136@0.55 c0
line lino_board1 130,136@1 130,136@0.3 c0
line lino_board2 160,136@1 160,136@0.3 c0
line lino_board3 190,136@1 190,136@0.3 c0
line cornice_l 0,8@1 0,8@0.3 c7
line cornice_r 320,8@1 320,8@0.3 c7
line skirt_l 0,128@1 0,128@0.3 c0
line skirt_r 320,128@1 320,128@0.3 c0
poly doorframe_l1 0,48@0.99 0,48@0.78 0,136@0.78 0,136@0.99 8
poly doorframe_l2 0,48@0.77 0,48@0.62 0,136@0.62 0,136@0.77 8
poly doorframe_l3 0,48@0.6 0,48@0.44 0,136@0.44 0,136@0.6 8
poly doorframe_r1 320,48@0.97 320,48@0.78 320,136@0.78 320,136@0.97 8
poly doorframe_r2 320,48@0.76 320,48@0.61 320,136@0.61 320,136@0.76 8
poly doorframe_r3 320,48@0.58 320,48@0.43 320,136@0.43 320,136@0.58 8
poly door_l1 0,52@0.97 0,52@0.8 0,136@0.8 0,136@0.97 6 e0
poly door_l2 0,52@0.75 0,52@0.64 0,136@0.64 0,136@0.75 6 e0
poly door_l3 0,52@0.58 0,52@0.46 0,136@0.46 0,136@0.58 5
poly door_r1 320,52@0.95 320,52@0.8 320,136@0.8 320,136@0.95 5
poly door_r2 320,52@0.74 320,52@0.63 320,136@0.63 320,136@0.74 5
poly door_r3 320,52@0.56 320,52@0.45 320,136@0.45 320,136@0.56 6 e0
line door_l1_panel 0,70@0.88 0,100@0.88 c0
line door_l2_panel 0,70@0.7 0,100@0.7 c0
line door_l3_panel 0,70@0.52 0,100@0.52 c0
line door_r1_panel 320,70@0.88 320,100@0.88 c0
line door_r2_panel 320,70@0.68 320,100@0.68 c0
line door_r3_panel 320,70@0.5 320,100@0.5 c0
line plate_l1 0,78@0.84 0,84@0.84 c14
line plate_l2 0,78@0.69 0,84@0.69 c14
line plate_l3 0,78@0.52 0,84@0.52 c14
line plate_r1 320,78@0.86 320,84@0.86 c14
line plate_r2 320,78@0.68 320,84@0.68 c14
line plate_r3 320,78@0.5 320,84@0.5 c14
dots handle_l1 0,96@0.82 0,96@0.66 0,96@0.5 c14
dots handle_r1 320,96@0.82 320,96@0.66 320,96@0.48 c14
poly stain_wall_l 0,24@0.95 0,24@0.8 0,60@0.8 0,60@0.95 5
poly stain_wall_r 320,18@0.85 320,18@0.7 320,50@0.7 320,50@0.85 8
line crack_l 0,10@0.9 0,40@0.88 c0
line crack_r 320,12@0.7 320,36@0.72 c0
rect window_frame 172,52,44,26 8
rect window_glass 175,55,38,20 1
line window_bar 194,55 194,75 c8
line window_bar2 175,65 213,65 c8
rect window_sill 170,78,48,3 7
rect extinguisher 224,62,8,18 4
line extinguisher_hose 228,62 232,68 c0
line lamp_cord 181,26 181,40 c0
poly lamp_shade 172,40 190,40 194,52 168,52 14
ellipse lamp_bulb 181,53,4,2 14
poly lit_floor 140,136@0.75 200,136@0.75 200,136@0.55 140,136@0.55 14
poly lit_wall_l 0,40@0.66 0,40@0.5 0,70@0.5 0,70@0.66 14
poly lit_wall_r 320,40@0.66 320,40@0.5 320,70@0.5 320,70@0.66 14
line dado_l 0,92@1 0,92@0.3 c8
line dado_r 320,92@1 320,92@0.3 c8
poly ceil_stain 150,6 196,6 190,26 156,24 7
rect picture_back 156,50,12,16 4
rect picture_back_in 158,52,8,12 15
rect door_mat_l 40,122,16,3 4
rect door_mat_r 266,118,14,3 4
poly wall_patch_l 0,8@0.9 0,8@0.72 0,30@0.72 0,30@0.9 8
poly wall_patch_r 320,70@0.7 320,70@0.54 320,92@0.54 320,92@0.7 7
rect radiator 150,70,20,16 7 e0
line radiator_f1 154,72 154,84 c8
line radiator_f2 158,72 158,84 c8
line radiator_f3 162,72 162,84 c8
line radiator_f4 166,72 166,84 c8
dots grit_floor 120,126 150,130 190,122 230,128 60,132 c8
poly shadow_l 0,136@1 0,136@0.8 0,120@0.8 0,120@1 0
poly shadow_r 320,136@1 320,136@0.8 320,120@0.8 320,120@1 0`,
    overlays: [{ object: "merche", at: [192, 118], tall: 64 }],
    cycles: [
      {
        name: "the lamp",
        areas: ["lamp_shade", "lamp_bulb", "lit_floor", "lit_wall_l", "lit_wall_r"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  room3: {
    version: 1,
    shot: "Eye level, looking north at the back wall, no vanishing point; lamplight; one light, the square of someone's kitchen light at the bottom of the black light well in the window, a flat yellow patch of it on the floor, everything else going to dark; the stripped iron {bed} with its stained mattress on columns 30-138 (a third at 107), the {window} on the light well above it at 92-158, the {chair} with a man's shoes under it and the {basin} on its stand with a dripping tap on the right, the door east on the right at 268-304 as the way to the landing; dressing: a twist of paper, the {wrapper}, on the floor by the bed, damp stains on the wall, a towel on a rail, plank floor; moves: the kitchen light (the lamplight recipe: a flicker).",
    draw: `rect ceiling 0,0,320,12 8
rect wall_back 0,12,320,80 6
rect skirting 0,88,320,4 5
poly corner_l 0,12 40,12 24,92 0,92 mix:6,0@0.5
poly corner_r 320,12 280,12 296,92 320,92 mix:6,0@0.5
rect floor_far 0,92,320,10 6
rect floor_mid 0,102,320,14 8
rect floor_near 0,116,320,20 6
line floor_gap1 0,102 320,102 c0
line floor_gap2 0,116 320,116 c0
line plank_j1 50,92 46,102 c0
line plank_j2 140,92 138,102 c0
line plank_j3 230,92 232,102 c0
line plank_j4 90,102 84,116 c0
line plank_j5 190,102 192,116 c0
line plank_j6 60,116 50,136 c0
line plank_j7 170,116 166,136 c0
line plank_j8 260,116 268,136 c0
poly wall_damp 40,14 80,14 74,40 44,38 8
line wall_crack 170,14 174,30 168,44 c0
poly wall_damp2 290,20 316,20 312,42 294,40 8
rect ceiling_beam 0,12,320,3 7
rect window_frame 96,24,58,46 8
rect window_glass 100,28,50,38 0
rect window_kitchen 128,44,14,14 14
line window_kitchen_bar 135,44 135,58 c0
line window_kitchen_bar2 128,51 142,51 c0
rect window_bar_v 124,28,3,38 8
rect window_bar_h 100,45,50,3 8
rect window_sill 92,70,66,4 7 e0
poly light_floor 120,92 160,92 188,116 112,116 14
rect bed_head_l 30,58,4,36 0
line bed_head_hi 31,58 31,92 c8
rect bed_head_r 134,66,4,28 0
rect bed_rail 30,62,108,3 0
rect bed_frame 32,88,104,4 0
rect mattress 34,74,102,14 7
rect ticking_1 40,74,6,14 8
rect ticking_2 58,74,6,14 8
rect ticking_3 76,74,6,14 8
rect ticking_4 94,74,6,14 8
rect ticking_5 112,74,6,14 8
rect ticking_6 128,74,6,14 8
rect mattress_hi 34,74,102,1 15
poly mattress_stain 60,76 92,76 88,86 64,86 6
poly mattress_wash 98,78 124,78 120,86 100,86 15
line mattress_seam 34,80 136,80 c0
rect bed_leg_l 32,92,3,8 0
rect bed_leg_r 132,92,3,8 0
poly bed_shadow 32,100 140,100 152,108 36,108 0
rect chair_back 170,58,4,34 6 e0
rect chair_seat 170,76,26,4 6 e0
rect chair_leg_a 170,80,3,18 6
rect chair_leg_b 192,80,3,18 6
rect chair_rung 172,90,22,2 6
poly shoe_l 176,96 190,96 192,100 176,100 0
poly shoe_r 182,100 196,100 198,104 182,104 0
poly shoe_l_sole 176,100 192,100 192,101 176,101 8
rect basin_stand 214,66,4,30 8
rect basin_stand2 236,66,4,30 8
rect basin_top 210,62,34,4 7 e0
ellipse basin_bowl 227,63,14,4 15
rect basin_tap 226,50,3,12 7
rect basin_tap_head 224,50,10,3 7
rect basin_drop 227,58,1,3 11
poly basin_crack 218,62 224,62 222,66 0
rect door_frame 268,28,36,66 8
rect door_east 270,30,32,62 5
rect door_east_panel1 274,34,24,20 6
rect door_east_panel2 274,60,24,28 6
rect door_east_knob 296,62,3,3 14
line door_east_hinge 272,34 272,88 c0
poly wrapper 150,96 158,94 160,100 152,102 7
poly wrapper_fold 152,96 158,95 156,99 0
line towel_hook_line 211,42 211,30 c0
poly towel_hook 208,30 214,30 214,42 208,42 8
line towel 208,42 214,42 c15
rect towel_rail 204,28,14,2 7
poly shade_chair 170,98 200,98 208,104 172,106 0
poly shade_basin 212,96 244,96 252,104 214,104 0
poly shade_near 0,136 30,136 34,122 0,116 0
poly shade_near_r 320,136 292,136 288,124 320,118 0
dots grit_floor 60,120 100,124 150,128 210,122 250,130 c0`,
    cycles: [
      {
        name: "the kitchen light",
        areas: ["window_kitchen", "light_floor"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  room7: {
    version: 1,
    shot: "Eye level, looking north at the back wall, no vanishing point; lamplight; one light, the bare bulb over the bed, flat yellow strips of it on the spread and the floor, one small light, a pale blue patch of the window on the floor, the corners going to dark; the made {bed} under its candlewick spread with the packed {bag} on it on columns 38-158 (a third at 107), the tall {window} with its shutters open at 184-250 showing across the avenue the pale blind wall of the bank, the coach at its left and a lit shop, the one-door {wardrobe} with bare hangers on the right at 256-290 and the {basin} beside it, a {chair} between the bed and the window, the door west on the left at 4-36 as the way to the landing; dressing: damp stains and a crack, plank floor; moves: the bulb's light (the lamplight recipe: a flicker).",
    draw: `rect ceiling 0,0,320,12 8
rect wall_back 0,12,320,80 6
rect skirting 0,88,320,4 5
poly corner_l 0,12 24,12 14,92 0,92 mix:6,0@0.5
poly corner_r 320,12 296,12 306,92 320,92 mix:6,0@0.5
rect floor_far 0,92,320,10 6
rect floor_mid 0,102,320,14 8
rect floor_near 0,116,320,20 6
line floor_gap1 0,102 320,102 c0
line floor_gap2 0,116 320,116 c0
line plank_j1 80,92 76,102 c0
line plank_j2 170,92 168,102 c0
line plank_j3 270,92 272,102 c0
line plank_j4 120,102 114,116 c0
line plank_j5 230,102 232,116 c0
line plank_j6 50,116 40,136 c0
line plank_j7 200,116 196,136 c0
line plank_j8 290,116 298,136 c0
poly wall_damp 262,14 296,14 290,34 266,32 8
line wall_crack 150,14 154,28 148,40 c0
rect door_frame_w 2,24,34,70 8
rect door_west 4,26,30,66 5
rect door_west_panel1 8,30,22,22 6
rect door_west_panel2 8,58,22,30 6
rect door_west_knob 28,60,3,3 14
line door_west_hinge 6,30 6,88 c0
rect wardrobe_body 256,24,34,72 5 e0
rect wardrobe_inside 266,28,22,62 0
line wardrobe_rail 266,34 288,34 c7
line wardrobe_hanger1 272,34 274,40 c7
line wardrobe_hanger2 282,34 284,40 c7
rect wardrobe_door 256,26,10,68 6 e0
rect wardrobe_knob 263,58,2,3 14
rect wardrobe_top 254,22,38,3 6
rect shutter_l 176,22,8,54 5
rect shutter_r 250,22,6,54 5
rect window_frame 184,20,66,58 8
rect window_view 188,24,58,50 1
rect view_bank 202,28,42,44 8
rect view_bank_c1 202,30,42,8 7
rect view_bank_c2 202,46,42,8 7
rect view_bank_c3 202,62,42,8 7
line view_bank_m 202,44 244,44 c0
rect view_coach 190,58,20,10 7
rect view_coach_win 192,60,16,3 8
rect view_shop 190,44,8,12 14
rect view_ground 188,68,58,6 8
rect window_bar_v 214,24,3,50 8
rect window_bar_h 188,48,58,3 8
rect window_sill 182,76,70,4 7 e0
poly light_window 186,80 252,80 262,100 176,100 9
rect bed_head 38,56,4,38 0
rect bed_foot 154,66,4,28 0
rect bed_rail 38,60,120,3 0
rect bed_base 40,88,116,4 0
rect spread 42,70,112,18 4
rect spread_pillow 46,64,22,8 15
rect spread_band 42,76,112,3 6
rect spread_edge 42,86,112,2 5
line spread_fold1 68,70 70,86 c5
line spread_fold2 118,70 116,86 c5
dots spread_tufts 52,80 64,82 78,78 92,82 106,79 120,82 134,78 146,82 c15
rect bed_leg_l 40,92,3,8 0
rect bed_leg_r 152,92,3,8 0
poly bed_shadow 40,100 158,100 170,108 44,108 0
poly bag 106,58 146,58 150,76 102,76 6 e0
poly bag_side 102,76 150,76 148,80 104,80 0
line bag_strap 116,58 114,50 138,50 136,58 c0
line bag_zip 108,66 144,66 c15
dots bag_pin 126,66 c7
rect bag_corner_l 102,72,4,6 8
rect bag_corner_r 146,72,4,6 8
rect chair_back 160,56,4,36 6 e0
rect chair_seat 160,76,20,4 6 e0
rect chair_leg_a 160,80,3,18 6
rect chair_leg_b 177,80,3,18 6
rect chair_rung 162,90,16,2 6
rect basin_top 294,62,26,4 7 e0
rect basin_stand 298,66,4,30 8
rect basin_bowl 296,60,22,3 15
rect basin_tap 306,50,3,10 7
rect basin_tap_head 304,50,8,3 7
line cord_lamp 98,12 98,26 c0
rect lamp_bulb 95,26,6,6 14
line lamp_flex 98,26 98,28 c0
poly light_spread 66,70 154,70 150,76 62,76 14
poly light_floor 80,102 140,102 156,116 70,116 14
poly shade_chair 160,98 182,98 190,104 162,106 0
poly shade_basin 296,96 320,96 320,104 300,104 0
poly shade_wardrobe 256,96 292,96 300,104 258,104 0
poly shade_near 0,136 28,136 32,122 0,116 0
poly shade_near_r 320,136 294,136 290,124 320,118 0
dots grit_floor 60,120 100,124 150,128 210,122 250,130 c0`,
    overlays: [{ object: "merche", at: [172, 120], tall: 76 }],
    cycles: [
      {
        name: "the bulb",
        areas: ["lamp_bulb", "light_spread", "light_floor"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ]
  },
  pharmacy: {
    version: 1,
    shot: "Eye level, looking south across the pavement at the pharmacy front, no vanishing point; neon; one light, the lit white hatch in the shutter, a flat yellow patch of it on the pavement, one small light, the green neon cross with a flat dark green glow behind it and a green patch on the pavement, the sky light magenta over magenta, the buildings blue; the steel {hatch} open in the shutter on columns 78-136 (a third at 107) with {Ildefonso} behind it, the {cross} on its bracket at the right third (213); dressing: a {mat} of rubber and a bell on its string at the sill, a card in the shutter, ribs and a dent and rust on the shutter, a drainpipe, a sign board over the hatch, a puddle with the cross's green streaked in the wet pavement; moves: the cross's arm (the neon sign recipe: faulty), the puddle's glints (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,36 5
rect sky_low 0,24,320,12 13
rect cloud_a 20,10,60,4 13
rect cloud_b 230,14,70,4 13
rect bldg_l 0,32,44,64 1
rect bldg_l_cap 0,30,44,3 8
rect win_l1 8,42,10,12 13
rect win_l2 26,42,10,12 0
rect win_l3 8,64,10,12 0
rect win_l4 26,64,10,12 11
line mortar_l1 0,58 44,58 c0
line mortar_l2 0,82 44,82 c0
rect bldg_r 250,36,70,60 1
rect bldg_r_cap 250,34,70,3 8
rect win_r1 262,44,10,12 0
rect win_r2 284,44,10,12 11
rect win_r3 304,44,10,12 0
line mortar_r1 250,64 320,64 c0
line pipe_r 258,36 258,96 c8
line pipe_r_hi 259,36 259,96 c7
rect facade 40,30,210,66 1
rect facade_cap 40,28,210,3 8
poly facade_stain 56,34 76,34 72,52 58,50 0
poly facade_stain2 150,40 170,40 164,56 152,54 0
rect sign_board 62,34,100,12 8 e0
rect sign_strip 66,38,92,4 2
rect sign_cap 62,46,100,2 0
rect shutter_main 40,48,210,48 8
line rib_1 50,48 50,96 c0
line rib_2 62,48 62,96 c0
line rib_3 74,48 74,96 c0
line rib_4 140,48 140,96 c0
line rib_5 152,48 152,96 c0
line rib_6 164,48 164,96 c0
line rib_7 176,48 176,96 c0
line rib_8 188,48 188,96 c0
line rib_9 240,48 240,96 c0
rect shutter_dent 150,70,18,10 7
poly shutter_rust 190,76 210,76 206,96 188,96 6
rect hatch_frame 80,52,54,36 8 e0
rect hatch_inside 84,56,46,28 7
rect hatch_shelf1 84,64,46,2 8
rect hatch_shelf2 84,74,46,2 8
rect hatch_box1 88,58,10,6 15
rect hatch_box2 102,58,8,6 4
rect hatch_box3 114,58,12,6 11
rect hatch_box4 90,66,12,8 15
rect hatch_box5 106,68,8,6 13
rect hatch_lamp 96,54,22,2 14
rect hatch_flap 78,46,58,6 8 e0
rect hatch_flap_hi 78,46,58,1 7
line hatch_chain1 80,52 80,58 c7
line hatch_chain2 134,52 134,58 c7
poly ildefonso_body 98,86 124,86 126,74 118,70 104,70 96,74 15
ellipse ildefonso_head 111,64,5,6 7
rect ildefonso_hair_l 105,62,2,4 8
rect ildefonso_hair_r 116,62,2,4 8
rect ildefonso_top 106,58,10,3 8
rect ildefonso_collar 108,69,6,2 7
dots ildefonso_buttons 111,73 111,77 111,81 c8
rect ildefonso_arm_l 94,76,6,10 15
rect ildefonso_arm_r 122,76,6,10 15
rect hatch_sill 78,86,58,4 7 e0
dots hatch_tablets 98,85 101,85 104,85 107,84 112,85 118,84 c15
rect hatch_bell 128,88,4,4 14
line hatch_bell_string 130,86 130,88 c0
rect guardia_card 140,60,10,14 15
rect guardia_band 142,64,6,3 2
line guardia_tape 140,60 144,62 c7
poly cross_glow 206,36 219,36 219,46 230,46 230,59 219,59 219,70 206,70 206,59 195,59 195,46 206,46 2
line cross_h1 198,52 228,52 c10
line cross_h2 198,53 228,53 c10
line cross_v1 212,39 212,68 c10
line cross_v2 213,39 213,68 c10
line cross_bracket 190,56 196,56 c8
line cross_bracket2 190,56 190,48 c8
rect mat 84,108,50,9 8 e0
rect mat_worn 96,110,26,5 7
rect pave_far 0,96,320,6 5
rect pave_mid 0,102,320,10 1
rect pave_near 0,112,320,24 1
line slab_1 20,102 14,112 c0
line slab_2 160,102 158,112 c0
line slab_3 226,102 228,112 c0
line slab_4 300,102 306,112 c0
line slab_5 60,112 48,136 c0
line slab_6 180,112 176,136 c0
line slab_7 270,112 280,136 c0
poly light_hatch 80,96 134,96 146,112 68,112 14
poly light_cross 196,96 232,96 240,108 188,108 2
ellipse puddle 200,122,28,5 13
ellipse puddle_dark 200,125,22,3 5
line puddle_gl1 190,121 195,121 c15
line puddle_gl2 200,123 205,123 c13
line puddle_gl3 210,121 214,121 c15
line streak_c1 210,114 208,134 c10
line streak_c2 216,114 218,128 c2
line streak_h1 100,114 98,134 c14
poly shade_near 0,136 28,136 32,122 0,114 0
poly shade_near_r 320,136 296,136 292,124 320,116 0
dots grit_near 40,124 70,130 120,128 150,132 250,128 c8`,
    facing: "s",
    cycles: [
      {
        name: "the cross's arm",
        areas: ["cross_h1", "cross_h2"],
        colors: [10, 2],
        style: "flicker",
        ms: [800, 4000]
      },
      {
        name: "the puddle's glints",
        areas: ["puddle_gl1", "puddle_gl2", "puddle_gl3"],
        colors: [15, 13, 5],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  solar: {
    version: 1,
    shot: "Eye level, looking north across the lot, no vanishing point; neon; one light, the fire in the oil drum, a flat light red pool on the ground round it, the sky light magenta over magenta, the walls and ground blue; old {Remedios} on a car seat with her thermos at the left third (107) and the burning {drum} beside her on columns 128-152, the standing doorframe in the {rubble} at the right third (213); dressing: the bare side {walls} on both wings with the ghosts of stairs, wallpaper and a hearth on them, a stripped {mattress} with its springs out at the right, broken bricks, planks, {weeds} with bottle glass and syringe caps shining in them in the foreground, a far wall with lit windows; moves: the fire in the drum (the fire recipe: a loop), the glass in the weeds (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,40 5
rect sky_low 0,26,320,14 13
rect cloud_a 90,12,70,4 13
rect cloud_b 210,18,50,4 13
poly far_roofs 70,52 84,44 100,50 120,42 140,48 160,40 180,46 200,42 220,50 240,44 262,52 262,96 70,96 1
rect far_wall 70,70,192,26 1
rect far_cap 70,68,192,3 8
rect far_window1 90,76,8,10 13
rect far_window2 150,76,8,10 0
rect far_window3 226,76,8,10 11
rect wall_l 0,18,70,94 1
rect wall_l_cap 0,16,70,3 8
poly wallghost_l_stairs 4,60 20,60 20,68 36,68 36,76 52,76 52,112 4,112 8
rect wallghost_l_paper 8,26,44,26 5
poly wallghost_l_stain 40,22 66,22 62,40 44,38 0
line wallghost_l_mortar1 0,40 70,40 c0
line wallghost_l_mortar2 0,58 70,58 c0
rect wall_r 262,24,58,88 1
rect wall_r_cap 262,22,58,3 8
rect wallghost_r_paper 270,34,40,30 5
poly wallghost_r_hearth 272,80 300,80 300,112 272,112 0
poly wallghost_r_stain 296,26 318,26 316,48 300,44 8
line wallghost_r_mortar1 262,46 320,46 c0
line wallghost_r_mortar2 262,70 320,70 c0
rect ground_far 0,96,320,8 5
rect ground_mid 0,104,320,14 1
rect ground_near 0,118,320,18 1
poly ground_patch1 20,104 60,104 56,112 16,112 8
poly ground_patch2 230,106 262,106 258,116 226,116 8
poly rubble_a 160,106 192,98 214,104 218,112 156,114 6
rect rubble_brick1 164,102,6,4 12
rect rubble_brick2 176,100,8,4 6
rect rubble_brick3 190,102,6,4 12
rect rubble_brick4 200,106,6,4 6
poly rubble_b 24,110 54,104 70,108 74,116 20,118 6
rect rubble_brick5 30,108,6,4 12
rect rubble_brick6 44,106,8,4 6
rect rubble_brick7 28,113,6,4 12
rect rubble_brick8 58,110,6,4 12
line rubble_crack 160,112 190,108 c0
poly doorframe_shadow 236,110 252,110 244,114 232,114 0
rect doorframe_l 214,60,4,50 6
rect doorframe_r 240,60,4,50 6
rect doorframe_top 212,56,34,4 6
line doorframe_hi 214,60 214,110 c14
poly mattress 244,112 290,106 306,114 252,124 7
poly mattress_stain 262,112 284,109 292,114 270,118 8
line mattress_spring1 256,112 258,118 c8
line mattress_spring2 270,110 272,116 c8
line mattress_spring3 284,109 286,114 c8
poly seat_back 84,70 100,68 102,98 86,100 0
rect seat_cushion 86,98,34,6 0
line seat_spring1 90,102 90,106 c8
line seat_spring2 112,102 112,106 c8
poly remedios_legs 96,96 118,96 120,110 98,112 0
poly remedios_body 96,78 114,78 118,100 94,98 8
poly remedios_arm 112,84 126,92 122,98 110,90 8
ellipse remedios_head 105,70,6,7 6
poly remedios_scarf 98,62 112,62 114,74 98,74 5
ellipse remedios_knot 105,76,3,2 5
rect remedios_thermos 124,100,6,10 7
rect remedios_thermos_cap 124,98,6,3 4
rect remedios_cup 120,96,4,4 15
outline remedios e0
rect drum_body 128,82,24,30 8 e0
rect drum_lit 130,82,4,30 7
rect drum_dark 146,82,4,30 0
line drum_rib1 128,92 152,92 c0
line drum_rib2 128,102 152,102 c0
ellipse drum_top 140,82,12,3 0
dots drum_holes 134,88 144,88 138,98 148,98 c0
ellipse fire_pool_out 140,114,40,8 4
ellipse fire_pool_in 140,114,22,4 12
poly pallet_wood 120,112 134,112 130,118 118,118 6
rect plank_1 96,120,26,3 6
rect plank_2 150,120,20,3 6
rect plank_3 270,126,24,3 6
line plank_gap 96,121 122,121 c0
line weeds_tuft1 30,126 32,120 34,126 c2
line weeds_tuft2 40,128 43,121 46,128 c10
line weeds_tuft3 120,128 122,121 125,128 c2
line weeds_tuft4 180,126 183,119 186,126 c10
line weeds_tuft5 230,128 232,121 235,128 c2
line weeds_tuft6 290,128 292,121 295,128 c10
dots weeds_glass 36,130 128,131 188,129 236,131 62,132 c11
dots weeds_caps 44,125 126,126 184,124 286,126 c15
poly shade_near 0,136 28,136 32,122 0,116 0
poly shade_near_r 320,136 296,136 292,124 320,118 0`,
    cycles: [
      {
        name: "the fire's pool",
        areas: ["fire_pool_in"],
        colors: [12, 4],
        style: "flicker",
        ms: [500, 1600]
      },
      {
        name: "the glass in the weeds",
        areas: ["weeds_glass", "weeds_caps"],
        colors: [15, 11, 8],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    loops: [
      {
        name: "the fire",
        at: [135, 67],
        style: "random",
        ms: 240,
        frames: [
          [
            ".......c..",
            "..........",
            "..........",
            "....4.4...",
            "....444...",
            "...4444...",
            "...4c4c4..",
            "..4cccc4..",
            "..4ccccc..",
            "..ccecec4.",
            ".4ceeeecc.",
            ".ceefefec.",
            "4ceeffffe4",
            "cefffffffc",
            "effffffffe"
          ],
          [
            "..........",
            "..c.......",
            "..........",
            ".....4....",
            "...4.4.4..",
            "...44444..",
            "...44c44..",
            "...ccccc..",
            "..4ccccc4.",
            ".4ccceccc.",
            ".cceeeeec.",
            ".cceefeec4",
            ".eefffffec",
            "4ffffffffe",
            "effffffffe"
          ],
          [
            "........c.",
            "..........",
            ".c........",
            "....44....",
            "....44....",
            "....44.4..",
            "..44cc44..",
            "..44cc4c..",
            "..cccccc..",
            "..cceecc..",
            "..cceece4.",
            "44eeffeec.",
            "ccffffffc4",
            "eeffffffec",
            "effffffffe"
          ],
          [
            "...c......",
            "..........",
            "..........",
            "......4...",
            "....4.4...",
            "...4444...",
            "...444c...",
            "...cccc44.",
            ".4.cccc44.",
            ".c4cccecc.",
            ".cceeeecc.",
            ".cceeefee.",
            "4eeffffff.",
            "cffffffff4",
            "effffffffe"
          ]
        ]
      }
    ]
  }
};

export const endings = {
  coach_away: {
    version: 1,
    shot: "Eye level, looking north down the empty avenue, vanishing point on the coach's third at (213,66); dusk; one light, the low sun at the end of the avenue, the sky magenta with a light red band at the horizon, the buildings dark blue and the road blue, a flat yellow path of the sun on the road; the grey coach from behind as a black silhouette on columns 174-252 (a third at 213) with its rear window lit light red and a woman's hand in it holding up a cassette, a black silhouette of a man with a mohawk standing on the kerb at the left third (66) with empty hands; dressing: lit windows in the blocks either side, lane lines, cracks and stones on the road; moves: the coach's tail lights (the neon sign recipe: on and off), the glints on the sun's path (the shimmer recipe: a pingpong).",
    draw: `vp 213,66
rect sky 0,0,320,64 5
rect sky_low 0,50,320,16 12
rect cloud_a 20,18,90,4 12
rect cloud_b 130,30,70,3 12
rect cloud_c 240,16,60,3 12
ellipse sun 130,58,13,13 14
poly bldg_l_far 0,40@0.4 0,40@0.2 0,112@0.2 0,112@0.4 0
poly bldg_l_mid 0,16@0.75 0,16@0.4 0,112@0.4 0,112@0.75 1
poly bldg_l_near 0,0@1 0,0@0.75 0,112@0.75 0,112@1 1
poly bldg_r_far 320,40@0.4 320,40@0.2 320,112@0.2 320,112@0.4 0
poly bldg_r_mid 320,20@0.75 320,20@0.4 320,112@0.4 320,112@0.75 1
poly bldg_r_near 320,0@1 320,0@0.75 320,112@0.75 320,112@1 1
poly win_l1 0,40@0.95 0,40@0.88 0,52@0.88 0,52@0.95 14
poly win_l2 0,60@0.95 0,60@0.88 0,72@0.88 0,72@0.95 0
poly win_l3 0,36@0.7 0,36@0.6 0,48@0.6 0,48@0.7 14
poly win_l4 0,60@0.7 0,60@0.6 0,72@0.6 0,72@0.7 0
poly win_r1 320,36@0.95 320,36@0.88 320,48@0.88 320,48@0.95 0
poly win_r2 320,58@0.95 320,58@0.88 320,70@0.88 320,70@0.95 14
poly win_r3 320,40@0.7 320,40@0.6 320,52@0.6 320,52@0.7 0
poly road_far 0,112@0.4 320,112@0.4 320,112@0.2 0,112@0.2 5
poly road_mid 0,112@0.75 320,112@0.75 320,112@0.4 0,112@0.4 1
poly road_near 0,136@1 320,136@1 320,112@1 0,112@1 1
poly road_slice 0,112@1 320,112@1 320,112@0.75 0,112@0.75 1
poly kerb_l 0,136@1 40,136@1 40,112@0.2 0,112@0.2 8
poly kerb_r 280,136@1 320,136@1 320,112@0.2 280,112@0.2 8
line lane_a 213,136@1 213,112@0.2 c12
line lane_b 213,136@1 213,112@0.4 c8
poly sun_road 120,112@0.2 140,112@0.2 190,136 100,136 12
line gl_1 126,100 134,100 c14
line gl_2 122,108 136,108 c14
line gl_3 118,118 140,118 c14
rect coach_body 178,58,70,46 0
rect coach_roof 176,56,74,4 0
line coach_rim 176,56 250,56 c12
rect coach_window 190,66,46,14 12
rect coach_window_frame 188,64,50,2 0
poly coach_hand 210,80 220,70 224,72 220,80 0
rect coach_fist 214,64,10,8 0
rect coach_cassette 218,62,7,10 15
dots coach_reels 220,65 223,65 c0
rect coach_tail_l 182,92,8,4 4
rect coach_tail_r 236,92,8,4 4
rect coach_plate 205,94,16,5 15
rect coach_bumper 174,100,78,4 8
rect coach_tyre_l 184,104,14,6 0
rect coach_tyre_r 228,104,14,6 0
rect coach_vent 200,84,26,4 8
poly coach_shadow 176,108 250,108 266,120 164,120 0
dots exhaust_a 210,112 214,114 218,116 c8
poly fig_body 54,84 78,84 82,112 52,112 0
rect fig_leg_l 56,112,9,22 0
rect fig_leg_r 68,112,9,22 0
ellipse fig_head 66,74,6,8 0
rect fig_mohawk 65,62,3,12 0
rect fig_arm_l 48,86,6,24 0
rect fig_arm_r 80,86,6,24 0
line fig_rim 78,84 82,112 c12
poly fig_shadow 52,134 120,134 150,130 66,130 0
line crack_a 20,124 40,128 c0
line crack_b 250,120 270,126 c0
dots stones_a 90,126 120,130 150,124 c8`,
    cycles: [
      {
        name: "the tail lights",
        areas: ["coach_tail_l", "coach_tail_r"],
        colors: [4, 12],
        style: "pingpong",
        ms: 600
      },
      {
        name: "the glints on the sun's path",
        areas: ["gl_1", "gl_2", "gl_3"],
        colors: [14, 12, 5],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  },
  stopped: {
    version: 1,
    shot: "Eye level, looking north across the avenue at the far pavement, no vanishing point; neon; one light, the streetlamp at the left with a pink pool and a white core on the pavement, the sky light magenta over magenta, the buildings blue; two men in black coats and a woman in a green coat between them walking away from the lamp, as black silhouettes with the green coat the one colour, on columns 120-256 (the woman at the third 180), her bag in the right man's hand, long black cast shadows on the pavement; dressing: lit windows and ledges, a shutter, mortar lines, a puddle and streaks in the wet road; moves: the streetlamp (the neon sign recipe: faulty).",
    draw: `rect sky 0,0,320,40 5
rect sky_low 0,26,320,14 13
rect cloud_a 200,10,70,4 13
rect cloud_b 30,16,50,3 13
rect bldg_back 0,34,320,62 1
rect bldg_cap 0,32,320,3 8
rect win_1 14,44,10,12 11
rect win_2 40,44,10,12 0
rect win_3 70,44,10,12 13
rect win_4 100,44,10,12 0
rect win_5 150,44,10,12 11
rect win_6 190,44,10,12 0
rect win_7 230,44,10,12 15
rect win_8 262,44,10,12 0
rect win_9 296,44,10,12 13
rect win_ledge1 12,56,14,2 8
rect win_ledge2 68,56,14,2 8
rect win_ledge3 148,56,14,2 8
rect win_ledge4 228,56,14,2 8
line mortar_1 0,64 320,64 c0
line mortar_2 0,82 320,82 c0
line joint_1 60,64 60,82 c0
line joint_2 190,64 190,82 c0
line joint_3 280,82 280,96 c0
poly stain_1 100,64 130,64 126,82 104,80 0
rect shutter_a 250,66,36,30 stripes:8,0
rect shutter_a_bar 250,92,36,4 7
rect pave_far 0,96,320,6 5
rect pave_mid 0,102,320,12 1
rect kerb 0,114,320,4 8
rect kerb_top 0,114,320,1 7
rect road 0,118,320,18 1
line slab_1 30,102 26,114 c0
line slab_2 110,102 108,114 c0
line slab_3 250,102 252,114 c0
line lamp_post 40,34 40,102 c8
rect lamp_head 32,28,16,5 8
ellipse lamp_globe 40,34,4,3 15
poly lamp_pool 8,96 72,96 84,114 0,114 13
poly lamp_pool_in 22,96 58,96 64,112 14,112 15
poly shadow_a 120,110 152,110 218,116 180,116 0
poly shadow_w 164,110 196,110 262,116 226,116 0
poly shadow_b 208,108 240,108 300,116 270,116 0
poly man_a_coat 126,60 150,60 154,100 122,100 0
poly man_a_hem 122,100 154,100 156,108 120,108 0
rect man_a_leg_l 128,108,8,6 0
rect man_a_leg_r 140,108,8,6 0
ellipse man_a_head 138,52,6,7 0
rect man_a_collar 132,58,12,3 0
poly arm_ab 150,68 168,72 168,78 150,76 0
poly woman_coat 168,66 192,66 196,106 164,106 2
poly woman_hem 164,106 196,106 198,110 162,110 2
rect woman_leg_l 170,110,6,4 0
rect woman_leg_r 182,110,6,4 0
ellipse woman_head 180,58,5,6 7
rect woman_hair 174,50,13,6 0
rect woman_collar 174,66,12,3 10
line woman_edge 168,66 164,106 c10
poly man_b_coat 210,60 238,60 242,102 206,102 0
poly man_b_hem 206,102 242,102 244,108 204,108 0
rect man_b_leg_l 212,108,8,6 0
rect man_b_leg_r 226,108,8,6 0
ellipse man_b_head 224,52,6,7 0
rect man_b_collar 218,58,12,3 0
poly arm_b 238,70 244,92 238,94 232,76 0
poly bag 238,92 254,92 256,104 240,104 6
line bag_strap 240,92 246,86 252,92 c0
rect bag_pin 246,98,2,2 7
poly puddle 120,124 180,124 172,132 112,132 8
line streak_a 16,118 14,134 c13
line streak_b 30,118 31,130 c15
line streak_c 270,118 272,132 c11
line lane_a 20,130 60,130 c8
line lane_b 230,130 280,130 c8
dots grit 90,122 190,126 300,124 60,134 c8
poly shade_near 0,136 28,136 32,122 0,118 0
poly shade_near_r 320,136 296,136 292,124 320,120 0`,
    cycles: [
      {
        name: "the streetlamp",
        areas: ["lamp_globe", "lamp_pool_in"],
        colors: [15, 13],
        style: "flicker",
        ms: [800, 4000]
      }
    ]
  },
  ran: {
    version: 1,
    shot: "Eye level, looking north down the avenue in fog, vanishing point on the far end at (213,66); fog; one coloured light, the two red tail lights of a far coach with a flat dark grey glow round each, the sky light grey with white near the horizon, everything paler with distance and the near things darkest; the far coach as a grey shape on columns 196-230 at the third (213) with the red lights going away, the empty kerb and a bus shelter in black at the left, a bus-stop sign on its post, lane lines running to the far end; dressing: pale buildings either side with dark windows, a pavement and kerb, a puddle and cracks on the road; moves: the tail lights (the neon sign recipe: on and off).",
    draw: `vp 213,66
rect sky 0,0,320,56 7
rect sky_low 0,40,320,26 15
rect cloud_a 20,14,80,4 15
rect cloud_b 190,22,70,3 15
poly bldg_l_far 0,30@0.35 0,30@0.18 0,100@0.18 0,100@0.35 7
poly bldg_r_far 320,34@0.35 320,34@0.18 320,100@0.18 320,100@0.35 7
poly bldg_l_mid 0,16@0.65 0,16@0.35 0,100@0.35 0,100@0.65 8
poly bldg_r_mid 320,20@0.65 320,20@0.35 320,100@0.35 320,100@0.65 8
poly bldg_l_near 0,0@1 0,0@0.65 0,100@0.65 0,100@1 8
poly bldg_r_near 320,0@1 320,0@0.65 320,100@0.65 320,100@1 8
poly win_l1 0,30@0.9 0,30@0.8 0,44@0.8 0,44@0.9 0
poly win_l2 0,60@0.9 0,60@0.8 0,74@0.8 0,74@0.9 0
poly win_l3 0,30@0.55 0,30@0.46 0,42@0.46 0,42@0.55 0
poly win_r1 320,30@0.9 320,30@0.8 320,44@0.8 320,44@0.9 0
poly win_r2 320,60@0.9 320,60@0.8 320,74@0.8 320,74@0.9 0
poly win_r3 320,36@0.55 320,36@0.46 320,48@0.46 320,48@0.55 0
line mortar_l 0,70@1 0,70@0.35 c0
line mortar_r 320,60@1 320,60@0.35 c0
poly road_far 0,100@0.45 320,100@0.45 320,100@0.18 0,100@0.18 7
poly road_mid 0,100@0.75 320,100@0.75 320,100@0.45 0,100@0.45 8
poly road_near 0,136@1 320,136@1 320,100@0.75 0,100@0.75 8
poly pave_l 0,100@1 60,100@1 60,100@0.18 0,100@0.18 7
poly pave_r 260,100@1 320,100@1 320,100@0.18 260,100@0.18 7
poly kerb_l 56,100@1 60,100@1 60,100@0.18 56,100@0.18 15
poly kerb_r 260,100@1 264,100@1 264,100@0.18 260,100@0.18 15
line lane_a 160,136@1 213,66 c15
line lane_b 210,100@1 213,66 c7
rect coach_far 196,60,34,16 8
rect coach_far_win 200,62,26,6 7
ellipse tail_glow_l_out 205,72,6,4 8
ellipse tail_glow_r_out 221,72,6,4 8
ellipse tail_l 205,72,3,2 4
ellipse tail_r 221,72,3,2 4
dots tail_core 205,72 221,72 c12
poly streak_l 200,74 210,74 230,136 170,136 7
rect shelter_roof 0,16,86,5 0
rect shelter_post1 4,21,4,86 0
rect shelter_post2 78,21,4,86 0
rect shelter_pane 10,24,64,56 8
rect shelter_pane_hi 12,26,8,52 7
rect shelter_bench 14,92,56,3 0
line shelter_leg1 18,95 18,106 c0
line shelter_leg2 64,95 64,106 c0
rect timetable_board 40,44,16,22 7
line timetable_a 43,50 53,50 c0
line timetable_b 43,56 53,56 c0
line timetable_c 43,62 50,62 c0
rect sign_post 98,32,3,78 0
rect sign_disc 90,26,18,12 7 e0
rect sign_bar 94,30,10,3 0
poly kerb_stain 100,112 150,112 140,122 90,120 7
ellipse puddle 130,126,30,5 15
ellipse puddle_dark 130,129,24,3 7
line puddle_gl1 118,125 124,125 c15
line puddle_gl2 134,127 140,127 c8
line crack_a 40,120 60,128 c0
line crack_b 230,116 250,124 c0
dots grit 20,130 90,134 170,128 250,132 290,126 c8
poly shade_near 0,136 30,136 34,122 0,116 0
poly shade_near_r 320,136 290,136 286,126 320,120 0`,
    cycles: [{ name: "the tail lights", areas: ["tail_core"], colors: [12, 4], style: "blink", ms: 1200 }]
  },
  died: {
    version: 1,
    shot: "Low, along the wet pavement looking north, vanishing point at (107,64); moonlight; one light, the moon, the sky blue with light blue at the horizon, black skyline, a light cyan edge towards the moon; one open hand in white with light grey shade lying palm up on the wet stones on columns 166-252 (a third at 213), a black cuff reaching it from the right, the pavement setts and seams running away to the left, a crushed can and a puddle with the moon in it; dressing: a far streetlamp, cracks, setts; moves: the glints in the puddle (the shimmer recipe: a pingpong).",
    draw: `vp 107,64
rect sky 0,0,320,56 1
rect sky_low 0,44,320,14 9
ellipse moon 252,24,10,10 15
rect cloud_a 20,16,70,3 9
rect cloud_b 170,34,60,3 9
poly skyline 0,58 20,44 40,52 56,36 74,50 96,46 120,54 150,40 176,52 204,46 230,56 262,48 290,56 320,44 320,64 0,64 0
line skyline_edge 230,56 262,48 290,56 320,44 c11
rect lamp_far_post 172,44,2,20 0
rect lamp_far 170,42,6,3 15
poly ground_far 0,136@0.55 320,136@0.55 320,136@0.2 0,136@0.2 9
poly ground_mid 0,136@0.8 320,136@0.8 320,136@0.55 0,136@0.55 1
poly ground_near 0,136@1 320,136@1 320,136@0.8 0,136@0.8 1
line seam_1 0,136@1 107,64 c0
line seam_2 60,136@1 107,64 c0
line seam_3 130,136@1 107,64 c0
line seam_4 200,136@1 107,64 c0
line seam_5 270,136@1 107,64 c0
line row_1 0,136@0.8 320,136@0.8 c0
line row_2 0,136@0.55 320,136@0.55 c0
line row_3 0,136@0.35 320,136@0.35 c0
poly setts_a 20,130 60,130 54,136 16,136 9
poly setts_b 150,128 190,128 184,134 146,134 9
poly setts_c 290,126 320,126 320,134 286,134 9
poly kerb_left 0,136@1 14,136@1 14,136@0.2 0,136@0.2 8
ellipse puddle 80,118,34,7 9
ellipse puddle_moon 90,118,5,3 15
line puddle_gl1 66,117 72,117 c15
line puddle_gl2 78,120 86,120 c11
line puddle_gl3 98,117 104,117 c15
poly can_body 116,116 140,112 144,122 120,128 7
poly can_shade 120,124 144,122 142,126 122,130 8
ellipse can_end 116,121,4,6 8
line can_dent 126,118 134,116 c8
line can_ring 128,122 136,120 c15
poly cuff 252,100 320,92 320,130 252,126 0
line cuff_edge 252,100 320,92 c11
poly sleeve_seam 262,102 320,96 320,100 262,106 8
rect cuff_stud 272,108,3,3 7
rect cuff_stud2 284,106,3,3 7
poly hand_palm 196,104 252,104 252,126 200,128 190,116 15
poly hand_shade 214,118 252,118 252,126 204,128 7
poly hand_thumb 216,104 228,92 236,96 224,108 15
poly hand_thumb_shade 226,100 236,96 232,108 224,108 7
poly finger_1 196,104 168,98 166,103 196,111 15
poly finger_2 194,112 168,108 168,113 196,119 15
poly finger_3 192,119 170,118 171,123 194,126 15
poly finger_4 190,125 174,127 176,131 194,131 15
line finger_gap1 196,111 170,106 c7
line finger_gap2 196,118 172,114 c7
line finger_gap3 194,125 174,123 c7
line palm_crease1 210,112 240,114 c7
line palm_crease2 214,120 238,122 c7
poly hand_shadow 168,132 252,132 262,136 160,136 0
poly stone_chip1 40,100 56,100 52,104 38,104 0
poly stone_chip2 270,80 290,80 286,84 268,84 0
line crack_a 20,124 50,130 c0
line crack_b 296,120 316,130 c0
dots grit 30,120 70,130 150,122 210,134 250,120 c8
poly shade_near 0,136 30,136 34,122 0,116 0
poly shade_near_r 320,136 292,136 288,124 320,118 0`,
    cycles: [
      {
        name: "the glints in the puddle",
        areas: ["puddle_gl1", "puddle_gl2", "puddle_gl3"],
        colors: [15, 11, 9],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ]
  }
};

export const cover = {
  version: 1,
  shot: "archetype: the close-up; its yes: the whole story turns on one face, the crust punk's, half in neon light and half in the dark, a tin crown on a pink mohawk and a lit cigarette at the mouth's corner, looking sideways at the coach; the one it beat: the tower, because he is a nobody on a strip, not a power over it, and a low-angle giant could be any gang's king. The close-up wins the test: the crown, the pin and the coach together belong only to this night. Dominant element: the head, 200 wide and 270 tall, centred in the middle, on a black jacket with lapels and studs that the art's clean edge cuts at row 469, the mohawk's tip at row 124; the lit half on the left (planes of cheek, brow and chin in 7 and 15), the dark half on the right (8 and 0), one eye with a gleam in the dark, the other looking right; the cigarette runs from the mouth to the right (the arm that points: it points at the coach). Backdrop: a magenta glow disc behind the head, a black building on the left with lit windows and the magenta safety pin sign over the street, a lower building on the right. The other elements: the safety pin sign (the club) and the small coach with lit windows high on the right (the question: where does it go, and who is on it). Background: bg 1, blue, with the title above in white; the light is the neon: magenta from behind, cold white on the cheek. Moves: the faulty pin sign, the ember, a few of the coach's windows, and a thin smoke trail rising from the cigarette.",
  draw: `ellipse glow_ring 240,300,172,152 13
ellipse glow_out 240,300,168,148 5
rect glow_dash_1 384,262,16,2 13
rect glow_dash_2 372,300,22,2 13
rect glow_dash_3 380,340,18,2 13
rect glow_dash_4 100,150,16,2 13
poly bld_l1 0,170 30,160 60,176 96,164 170,172 170,469 0,469 0
line bld_l1_rim 170,172 170,469 c13
poly bld_l1_step 96,164 130,170 130,176 96,170 8
rect win_l1 18,200,12,16 14
rect win_l2 40,200,12,16 8
rect win_l3 18,246,12,16 8
rect win_l4 40,246,12,16 11
rect win_l5 18,300,12,16 13
rect win_l6 40,300,12,16 8
rect win_l7 18,354,12,16 8
rect win_l8 40,354,12,16 14
rect win_l9 18,408,12,16 11
rect win_l10 40,408,12,16 8
line brick_l1 0,230 170,230 c8
line brick_l2 0,284 170,284 c8
line brick_l3 0,338 170,338 c8
line brick_l4 0,392 170,392 c8
line brick_l5 70,230 70,284 c8
line brick_l6 110,284 110,338 c8
rect pin_glow 84,196,78,34 5
line pin_body_1 92,212 134,212 c13
line pin_body_2 92,213 134,213 c13
line pin_clasp_1 92,204 106,204 106,222 92,222 c13
line pin_clasp_2 93,205 105,205 105,221 93,221 c13
line pin_coil_1 134,212 142,203 152,212 142,221 134,212 c13
line pin_coil_2 135,212 142,204 151,212 142,220 135,212 c13
poly bld_r1 356,262 380,254 410,268 444,258 479,264 479,469 356,469 0
line bld_r1_rim 356,262 356,469 c13
rect win_r1 376,300,12,16 14
rect win_r2 400,300,12,16 8
rect win_r3 424,300,12,16 11
rect win_r4 376,356,12,16 8
rect win_r5 400,356,12,16 13
rect win_r6 424,356,12,16 8
line brick_r1 356,336 479,336 c8
line brick_r2 356,392 479,392 c8
rect coach_road 334,254,64,4 8
rect coach_body 338,232,56,22 0
rect coach_roof 338,229,56,4 8
rect coach_win_1 344,238,8,7 14
rect coach_win_2 356,238,8,7 14
rect coach_win_3 368,238,8,7 14
rect coach_win_4 380,238,8,7 14
ellipse coach_wheel_1 350,254,5,5 8
ellipse coach_wheel_2 382,254,5,5 8
rect coach_light 392,246,3,4 4
ellipse head 240,290,100,136 8
poly head_lit 250,162 200,172 163,208 143,262 146,338 170,398 210,428 224,430 236,392 240,330 246,262 252,200 7
poly head_lit_cheek 160,262 196,270 188,302 164,298 15
poly head_lit_brow 170,222 222,214 224,226 176,236 15
poly head_lit_chin 196,392 236,402 232,424 208,420 15
poly head_dark_jaw 282,376 336,326 330,372 300,416 0
poly head_dark_cheek 290,280 332,272 324,322 296,312 0
poly head_dark_temple 304,196 330,236 326,262 296,226 0
ellipse ear_l 138,292,12,26 7
ellipse ear_l_in 138,292,5,14 15
ellipse ear_r 342,292,12,26 8
ellipse ear_r_in 342,292,5,14 0
rect neck_dark 188,420,106,49 8
poly neck_lit 188,420 232,420 240,469 180,469 7
poly neck_shade 252,420 294,420 306,469 252,469 0
poly mohawk 230,198 234,126 250,124 254,198 13
poly mohawk_shade 244,198 246,125 250,124 254,198 5
poly mohawk_tuft_1 234,134 228,128 236,126 13
poly mohawk_tuft_2 250,130 258,126 252,134 13
poly crown_point_1 176,198 184,170 194,198 7
poly crown_point_2 196,198 206,164 218,198 7
poly crown_point_3 214,198 226,176 230,198 15
poly crown_point_4 256,198 262,176 274,198 8
poly crown_point_5 270,198 282,164 292,198 8
poly crown_point_6 288,198 298,170 306,198 0
poly crown_band 172,196 308,196 314,218 166,218 7
poly crown_band_lit 172,196 214,196 210,218 166,218 15
poly crown_band_dark 262,196 308,196 314,218 258,218 8
rect crown_can 222,200,30,14 4
rect crown_can_bar 226,204,22,3 15
line crown_glint_1 178,172 184,196 c15
line crown_glint_2 198,168 204,196 c15
line crown_dent 280,204 292,212 c0
poly brow_l 170,236 224,228 226,240 176,248 0
poly brow_r 256,228 312,236 306,248 258,240 0
ellipse eye_l 198,246,17,8 15
ellipse eye_l_iris 202,246,6,6 3
ellipse eye_l_pupil 202,246,2,2 0
line eye_l_lid 182,240 214,240 c0
line eye_l_low 184,252 212,252 c8
ellipse eye_r 284,248,16,7 0
dots eye_r_gleam 288,246 c7
poly nose_shadow 242,250 254,310 270,324 240,326 0
poly nose_lit 236,250 226,306 214,322 238,322 15
ellipse nose_tip 238,318,13,8 7
ellipse nostril_l 228,324,4,2 0
ellipse nostril_r 250,324,4,2 0
poly mouth 206,350 240,356 276,350 282,356 240,368 204,358 0
poly lip_lit 210,360 238,362 236,368 214,366 7
line mouth_crease_l 200,350 196,360 c8
line stubble_1 170,320 176,326 c0
line stubble_2 180,332 186,338 c0
line stubble_3 300,350 306,356 c0
line stubble_4 292,364 298,370 c0
poly cig 276,350 362,334 364,340 278,358 15
rect cig_band 296,346,6,8 14
rect ember 360,332,6,8 12
dots ember_core 363,336 c14
poly jacket_l 60,469 100,436 180,420 204,469 0
poly jacket_r 420,469 380,436 300,420 276,469 0
poly lapel_l 100,436 180,420 204,469 150,469 8
poly lapel_r 380,436 300,420 276,469 330,469 8
line lapel_l_edge 104,436 150,469 c7
line lapel_r_edge 376,436 330,469 c7
poly collar_l 180,420 204,469 196,469 172,426 0
dots studs_l 112,448 126,456 140,462 c7
dots studs_r 368,448 354,456 340,462 c7
line zip 240,430 240,469 c7
rect patch_a 70,452,32,16 4
rect patch_a_bar 74,458,24,3 15
line safety_pin_a 130,440 150,448 c13
line safety_pin_b 150,448 148,454 130,446 c13
line seam_l 80,469 112,444 c8
line seam_r 400,469 368,444 c8`,
  titleAt: "top",
  cycles: [
    {
      name: "the faulty pin sign",
      areas: ["pin_body_1", "pin_body_2", "pin_clasp_1", "pin_clasp_2", "pin_coil_1", "pin_coil_2"],
      colors: [13, 5],
      style: "flicker",
      ms: [800, 4000]
    },
    { name: "the ember", areas: ["ember"], colors: [12, 4], style: "pingpong", ms: 700 },
    {
      name: "the coach's windows",
      areas: ["coach_win_1", "coach_win_2", "coach_win_3", "coach_win_4"],
      colors: [14, 6],
      style: "pingpong",
      scatter: true,
      ms: 420
    }
  ],
  loops: [
    {
      name: "the smoke from the cigarette",
      at: [356, 302],
      frames: [
        [
          ".........8.8.8..",
          "..........8.8...",
          "..........8.8.8.",
          "..........8.8...",
          "........8.8.8...",
          "........8.8.....",
          "......8.8.8.....",
          "......8.8.......",
          ".....8.8........",
          "......8.8.......",
          "......8.8.......",
          ".......8.8......",
          ".......8.8......",
          ".........8.8....",
          "........8.8.....",
          "........88......",
          ".......888......",
          ".......88.......",
          ".....8.8........",
          "....77..........",
          "....777.........",
          ".....77.........",
          ".....77.........",
          "......77........",
          "......77........",
          ".......77.......",
          "........7.......",
          ".......7........",
          "......7.........",
          ".....7.........."
        ],
        [
          "..........8.8.8.",
          "..........8.8...",
          ".........8.8.8..",
          "........8.8.....",
          "......8.8.8.....",
          "......8.8.......",
          ".....8.8.8......",
          "......8.8.......",
          "......8.8.......",
          "........8.8.....",
          "........8.8.....",
          ".........8.8....",
          "........8.8.....",
          ".........8.8....",
          ".......8.8......",
          "......88........",
          ".....888........",
          ".....88.........",
          "....8.8.........",
          "....77..........",
          ".....777........",
          "......77........",
          ".......77.......",
          ".......77.......",
          ".......77.......",
          ".......77.......",
          "......7.........",
          ".....7..........",
          "....7...........",
          "...7............"
        ],
        [
          ".........8.8.8..",
          ".........8.8....",
          "......8.8.8.....",
          ".......8.8......",
          ".....8.8.8......",
          "......8.8.......",
          "......8.8.8.....",
          "........8.8.....",
          "........8.8.....",
          "..........8.8...",
          ".........8.8....",
          ".........8.8....",
          ".......8.8......",
          ".......8.8......",
          ".....8.8........",
          ".....88.........",
          "....888.........",
          ".....88.........",
          ".....8.8........",
          "......77........",
          "......777.......",
          "........77......",
          "........77......",
          ".......77.......",
          "......77........",
          ".....77.........",
          "....7...........",
          "....7...........",
          "...7............",
          "...7............"
        ],
        [
          ".......8.8.8....",
          ".......8.8......",
          "......8.8.8.....",
          ".......8.8......",
          "......8.8.8.....",
          "........8.8.....",
          "........8.8.8...",
          "..........8.8...",
          ".........8.8....",
          "..........8.8...",
          "........8.8.....",
          ".......8.8......",
          ".....8.8........",
          ".....8.8........",
          "....8.8.........",
          ".....88.........",
          ".....888........",
          ".......88.......",
          ".......8.8......",
          ".......77.......",
          "........777.....",
          "........77......",
          ".......77.......",
          "......77........",
          "....77..........",
          "...77...........",
          "....7...........",
          "....7...........",
          "....7...........",
          ".....7.........."
        ],
        [
          "......8.8.8.....",
          ".......8.8......",
          ".......8.8.8....",
          "........8.8.....",
          "........8.8.8...",
          "..........8.8...",
          ".........8.8.8..",
          "..........8.8...",
          "........8.8.....",
          "........8.8.....",
          "......8.8.......",
          "......8.8.......",
          "....8.8.........",
          ".....8.8........",
          ".....8.8........",
          "......88........",
          ".......888......",
          ".........88.....",
          "........8.8.....",
          ".......77.......",
          "......777.......",
          "......77........",
          ".....77.........",
          "....77..........",
          "...77...........",
          "...77...........",
          "....7...........",
          ".....7..........",
          "......7.........",
          ".......7........"
        ],
        [
          ".......8.8.8....",
          ".........8.8....",
          "........8.8.8...",
          "..........8.8...",
          ".........8.8.8..",
          "..........8.8...",
          "........8.8.8...",
          "........8.8.....",
          "......8.8.......",
          "......8.8.......",
          ".....8.8........",
          "......8.8.......",
          ".....8.8........",
          ".......8.8......",
          ".......8.8......",
          "........88......",
          "........888.....",
          ".........88.....",
          ".......8.8......",
          "......77........",
          "....777.........",
          ".....77.........",
          "....77..........",
          "....77..........",
          "....77..........",
          ".....77.........",
          "......7.........",
          ".......7........",
          ".......7........",
          ".......7........"
        ]
      ],
      ms: 280,
      style: "loop"
    }
  ]
};

export const boxart = {
  version: 1,
  shot: "archetype: the close-up, the cover's idea composed for 480 x 400: the same head, bigger and cropped by the bottom edge, half lit and half dark, the pink mohawk's tip at row 98 just under the title band (rows 0-95, bg only), the tin crown on it, the cigarette running right to its ember; backdrop a magenta glow disc behind the head, the black building on the left with the lit windows and the safety pin sign, the lower building on the right, and the small coach with lit windows by the right building (the question); bg 1, blue, neon light; a still, nothing moves.",
  draw: `ellipse glow_ring 240,274,172,152 13
ellipse glow_out 240,274,168,148 5
rect glow_dash_1 384,236,16,2 13
rect glow_dash_2 372,274,22,2 13
rect glow_dash_3 380,314,18,2 13
rect glow_dash_4 100,124,16,2 13
poly bld_l1 0,144 30,134 60,150 96,138 170,146 170,399 0,399 0
line bld_l1_rim 170,146 170,399 c13
poly bld_l1_step 96,138 130,144 130,150 96,144 8
rect win_l1 18,174,12,16 14
rect win_l2 40,174,12,16 8
rect win_l3 18,220,12,16 8
rect win_l4 40,220,12,16 11
rect win_l5 18,274,12,16 13
rect win_l6 40,274,12,16 8
rect win_l7 18,328,12,16 8
rect win_l8 40,328,12,16 14
line brick_l1 0,204 170,204 c8
line brick_l2 0,258 170,258 c8
line brick_l3 0,312 170,312 c8
line brick_l4 0,366 170,366 c8
line brick_l5 70,204 70,258 c8
line brick_l6 110,258 110,312 c8
rect pin_glow 84,170,78,34 5
line pin_body_1 92,186 134,186 c13
line pin_body_2 92,187 134,187 c13
line pin_clasp_1 92,178 106,178 106,196 92,196 c13
line pin_clasp_2 93,179 105,179 105,195 93,195 c13
line pin_coil_1 134,186 142,177 152,186 142,195 134,186 c13
line pin_coil_2 135,186 142,178 151,186 142,194 135,186 c13
poly bld_r1 356,236 380,228 410,242 444,232 479,238 479,399 356,399 0
line bld_r1_rim 356,236 356,399 c13
rect win_r1 376,274,12,16 14
rect win_r2 400,274,12,16 8
rect win_r3 424,274,12,16 11
rect win_r4 376,330,12,16 8
rect win_r5 400,330,12,16 13
rect win_r6 424,330,12,16 8
line brick_r1 356,310 479,310 c8
line brick_r2 356,366 479,366 c8
rect coach_road 334,228,64,4 8
rect coach_body 338,206,56,22 0
rect coach_roof 338,203,56,4 8
rect coach_win_1 344,212,8,7 14
rect coach_win_2 356,212,8,7 14
rect coach_win_3 368,212,8,7 14
rect coach_win_4 380,212,8,7 14
ellipse coach_wheel_1 350,228,5,5 8
ellipse coach_wheel_2 382,228,5,5 8
rect coach_light 392,220,3,4 4
ellipse head 240,264,100,136 8
poly head_lit 250,136 200,146 163,182 143,236 146,312 170,372 210,402 224,404 236,366 240,304 246,236 252,174 7
poly head_lit_cheek 160,236 196,244 188,276 164,272 15
poly head_lit_brow 170,196 222,188 224,200 176,210 15
poly head_lit_chin 196,366 236,376 232,398 208,394 15
poly head_dark_jaw 282,350 336,300 330,346 300,390 0
poly head_dark_cheek 290,254 332,246 324,296 296,286 0
poly head_dark_temple 304,170 330,210 326,236 296,200 0
ellipse ear_l 138,266,12,26 7
ellipse ear_l_in 138,266,5,14 15
ellipse ear_r 342,266,12,26 8
ellipse ear_r_in 342,266,5,14 0
poly mohawk 230,172 234,100 250,98 254,172 13
poly mohawk_shade 244,172 246,99 250,98 254,172 5
poly mohawk_tuft_1 234,108 228,102 236,100 13
poly mohawk_tuft_2 250,104 258,100 252,108 13
poly crown_point_1 176,172 184,144 194,172 7
poly crown_point_2 196,172 206,138 218,172 7
poly crown_point_3 214,172 226,150 230,172 15
poly crown_point_4 256,172 262,150 274,172 8
poly crown_point_5 270,172 282,138 292,172 8
poly crown_point_6 288,172 298,144 306,172 0
poly crown_band 172,170 308,170 314,192 166,192 7
poly crown_band_lit 172,170 214,170 210,192 166,192 15
poly crown_band_dark 262,170 308,170 314,192 258,192 8
rect crown_can 222,174,30,14 4
rect crown_can_bar 226,178,22,3 15
poly brow_l 170,210 224,202 226,214 176,222 0
poly brow_r 256,202 312,210 306,222 258,214 0
ellipse eye_l 198,220,17,8 15
ellipse eye_l_iris 202,220,6,6 3
ellipse eye_l_pupil 202,220,2,2 0
line eye_l_lid 182,214 214,214 c0
line eye_l_low 184,226 212,226 c8
ellipse eye_r 284,222,16,7 0
dots eye_r_gleam 288,220 c7
poly nose_shadow 242,224 254,284 270,298 240,300 0
poly nose_lit 236,224 226,280 214,296 238,296 15
ellipse nose_tip 238,292,13,8 7
ellipse nostril_l 228,298,4,2 0
ellipse nostril_r 250,298,4,2 0
poly mouth 206,324 240,330 276,324 282,330 240,342 204,332 0
poly lip_lit 210,334 238,336 236,342 214,340 7
poly cig 276,324 362,308 364,314 278,332 15
rect cig_band 296,320,6,8 14
rect ember 360,306,6,8 12
dots ember_core 363,310 c14`,
  titleAt: "top"
};

// The colour the cover and the box art stand on, as the world states it (BRIEF.md §7); a world that states none has none: the game measures it from the rooms.
export const bg = 1;
