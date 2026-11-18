// Pictures for "Emperor of the Crust" (world.en.js / world.es.js, shared), one per room and one per ending, written by hand in the
// short notation (BRIEF.md §7): 320 x 136, EGA colours 0-15, shapes back to front, ids on what the story may change or a cycle animates.
// Style: flat. Every picture's `shot` names its palette, its light, its subject and its dressing, and what moves.
// Palettes: neon (the strip, El Charlie, the corner, the plaza, the blind alley), lamplight (backstage, La Opera, the pension, the
// occupied house), institution (the post office, the launderette), moonlight (the patio, the roof, the cutting), ember (the works).
// The Minister is an overlay (his figure, shapes scaled to each spot's height) in the four rooms of his round: El Charlie, the avenida, La Opera and the post office.

export default {
  // ---- THE BLIND ALLEY (the opening): eye level, one-point view to the steel fire door on the right third; neon pink -----------
  callejon: {
    version: 1,
    shot: "Eye level, facing north, one-point view, vp on the right third (213,50). Palette neon, flat. One light: a pink neon tube on the left wall, half dead, and the glow of the city over the roofs. Subject: the steel {fire door} at the far end, on the right third, painted shut: a dark seam of old paint down its hinge side and a dent at shoulder height. Open (once the crowbar has prised it, shape ids puerta_open…): the door swung in on its bar, a narrow grey slab on the hinge side, the doorway dark with the club's magenta and pink light and bass glow in it, spilling a wedge of pink on the alley floor. Left wing and near left: the pink {neon tube} on the grey brick wall, a {bin} against the wall with an iron {crowbar} leaning on it, a stack of {crates} with a flat top where the {radio} stands. Right wing: more {crates} and a pipe down the wall. Floor: bands from magenta far to blue near, with {puddles} holding the sign's pink. Sky magenta over blue, the far roofs black. moves: the tube (faulty), the puddle glints (shimmer)",
    draw: `vp 213,50
rect sky 0,0,320,30 1
rect glow 0,30,320,34 5
poly roofs 144,54 144,44 156,44 156,36 170,36 170,44 188,44 188,32 206,32 206,40 228,40 228,30 246,30 246,38 256,38 256,54 0
rect roof_win1 150,48,3,3 14
rect roof_win2 192,36,3,3 11
rect roof_win3 232,34,3,3 13
poly floor_far 0,136@1 320,136@1 320,136@0.3 0,136@0.3 5
poly floor_mid 0,136@1 320,136@1 320,136@0.6 0,136@0.6 1
poly floor_near 0,136@1 320,136@1 320,136@0.86 0,136@0.86 mix:1,0@0.5
poly wall_l_far 0,-30@0.6 0,170@0.6 0,170@0.3 0,-30@0.3 8
poly wall_l_near 0,-30@1 0,170@1 0,170@0.6 0,-30@0.6 1
poly wall_r_far 320,-30@0.6 320,170@0.6 320,170@0.3 320,-30@0.3 8
poly wall_r_near 320,-30@1 320,170@1 320,170@0.6 320,-30@0.6 1
rect endwall 145,26,100,60 8
line course_e1 145,38 245,38 c0
line course_e2 145,50 245,50 c0
line course_e3 145,62 245,62 c0
line course_e4 145,74 245,74 c0
rect brick_e1 150,28,18,8 1
rect brick_e2 186,28,22,8 1
rect brick_e3 226,40,16,8 1
rect brick_e4 160,52,20,8 1
rect brick_e5 148,64,16,8 1
rect brick_e6 214,64,20,8 1
rect brick_e7 176,76,18,8 1
line course_l1 0,0@1 0,0@0.3 c0
line course_l2 0,25@1 0,25@0.3 c0
line course_l3 0,50@1 0,50@0.3 c0
line course_l4 0,75@1 0,75@0.3 c0
line course_l5 0,100@1 0,100@0.3 c0
line course_l6 0,125@1 0,125@0.3 c0
line course_r1 320,0@1 320,0@0.3 c0
line course_r2 320,25@1 320,25@0.3 c0
line course_r3 320,50@1 320,50@0.3 c0
line course_r4 320,75@1 320,75@0.3 c0
line course_r5 320,100@1 320,100@0.3 c0
line course_r6 320,125@1 320,125@0.3 c0
line joint_l1 12,0 12,24 c0
line joint_l2 30,25 30,50 c0
line joint_l3 8,75 8,100 c0
line joint_r1 306,25 306,50 c0
line joint_r2 288,75 288,100 c0
rect door_frame 197,45,32,42 0
rect puerta 200,48,26,38 7 e0
rect puerta_panel 203,52,20,14 8
rect puerta_panel2 203,70,20,12 8
line puerta_bar 203,68 223,68 c15
line puerta_dent 205,58 211,62 c0
line puerta_seam 201,50 201,84 c0
dots puerta_rivets 202,50 224,50 202,84 224,84 c8
rect puerta_open 200,48,26,38 0
rect puerta_open_glow 202,50,22,35 mix:5,13@0.28
rect puerta_open_core 207,56,12,29 mix:13,15@0.45
poly puerta_open_leaf 200,48 205,51 205,83 200,86 7 e0
line puerta_open_bar 202,68 202,74 c15
poly puerta_open_spill 200,87 226,87 242,102 190,102 mix:,13@0.3
ellipse door_lamp 213,41,3,2 11
rect door_sill 196,86,34,3 8
rect tube_glow 8,28,46,40 5
line tube_a 14,34 14,62 c13
line tube_a2 15,34 15,62 c13
line tube_b 14,34 28,34 c13
line tube_b2 14,35 28,35 c13
line tube_c 28,34 28,46 c13
line tube_c2 27,34 27,46 c13
line tube_d 14,46 28,46 c13
line tube_d2 14,47 28,47 c13
line tube_e 38,34 38,62 c1
line tube_f 38,34 52,34 c1
line tube_g 38,48 50,48 c1
line tube_h 38,62 52,62 c1
dots tube_clamps 12,34 12,62 30,34 30,46 c8
line pipe_r 296,0 296,126 c8
line pipe_r2 297,0 297,126 c7
rect pipe_clamp1 293,30,8,4 8
rect pipe_clamp2 293,80,8,4 8
rect bin_body 6,92,36,38 8 e0
rect bin_lid 3,88,42,6 7 e0
line bin_rib1 14,96 14,128 c0
line bin_rib2 24,96 24,128 c0
line bin_rib3 34,96 34,128 c0
rect bin_glow 6,92,5,38 5
ellipse bin_shadow 24,131,24,3 0
rect crates_a 58,100,46,30 6 e0
line crates_a_pl1 58,110 104,110 c0
line crates_a_pl2 58,120 104,120 c0
line crates_a_pl3 81,100 81,130 c0
dots crates_a_nails 61,103 101,103 61,127 101,127 c14
rect crates_a_lit 58,100,5,30 14
ellipse crates_a_shadow 82,131,26,3 0
rect crates_b 266,96,40,34 6 e0
line crates_b_pl1 266,107 306,107 c0
line crates_b_pl2 266,118 306,118 c0
line crates_b_pl3 286,96 286,130 c0
rect crates_c 276,78,30,18 6 e0
line crates_c_pl 276,87 306,87 c0
dots crates_b_nails 269,99 303,99 269,127 303,127 c14
ellipse crates_b_shadow 286,131,24,3 0
line bottles_1 266,76 266,82 c11
line bottles_2 270,76 270,82 c3
ellipse puddle_1 120,120,28,5 5
ellipse puddle_2 222,112,18,3 5
ellipse puddle_3 180,128,22,4 5
ellipse puddle_ref 38,128,10,3 13
line glint_1a 108,119 112,119 c13
line glint_1b 118,121 124,121 c13
line glint_1c 130,119 134,119 c13
line glint_1d 126,122 130,122 c13
line glint_2a 216,112 220,112 c13
line glint_2b 224,113 228,113 c13
line glint_3a 172,128 176,128 c13
line glint_3b 184,127 190,127 c13
line gutter_l 0,134 130,126 c0
dots litter 90,128 100,124 136,130 246,122 c8
line crack_f1 120,134 150,128 c0
line crack_f2 240,134 262,130 c0`,
    cycles: [
      { name: "the faulty tube", areas: ["tube_a", "tube_a2", "tube_b", "tube_b2", "tube_c", "tube_c2", "tube_d", "tube_d2"], colors: [13, 5], style: "flicker", ms: [800, 4000] },
      { name: "the puddle glints", areas: ["glint_1a", "glint_1b", "glint_1c", "glint_1d", "glint_2a", "glint_2b", "glint_3a", "glint_3b"], colors: [13, 15, 5], style: "pingpong", scatter: true, ms: 420 }
    ],
    overlays: [{ object: "radio", at: [72, 84] }, { object: "palanca", at: [42, 108] }]
  },

  // ---- BACKSTAGE: eye level, frontal, a bare bulb; the guitar case on the left third, the club's glow through the curtain on the right ----
  trastienda: {
    version: 1,
    shot: "Eye level, facing north, frontal, no vanishing point. Palette lamplight, flat. One light: a bare bulb hung centre; the club's magenta glow through the parted curtain on the right third (a picture within the picture). Subject: the {guitar case} on the floor, left third (x about 107), long and black with a belt (open, shape ids funda_open…: the lid up, the red plush lining and the neck hollow showing); second thing: the {curtain} door on the right third. Back wall: the {mirror} ringed with bulbs, a coat rail of sequinned jackets on the left wing, stacked {amplifier cases} on the right wing, a bare bulb. Floor planks in bands. moves: the bulb (flicker), the glow through the curtain (blink)",
    draw: `rect wall 0,0,320,102 mix:6,0@0.5
rect wall_lit 66,0,190,102 6
rect floor_far 0,102,320,12 6
rect floor_mid 0,114,320,12 mix:6,0@0.5
rect floor_near 0,126,320,10 mix:6,0@0.25
line plank_1 0,114 320,114 c0
line plank_2 0,126 320,126 c0
line plank_3 24,102 24,136 c0
line plank_4 96,114 96,136 c0
line plank_5 168,102 168,114 c0
line plank_6 250,114 250,136 c0
line plank_7 300,102 300,114 c0
line panel_1 66,0 66,102 c0
line panel_2 130,0 130,102 c0
line panel_3 194,0 194,102 c0
line panel_4 256,0 256,102 c0
line base_rail 0,98 320,98 c0
rect skirt 0,98,320,4 0
line cord 160,0 160,14 c0
rect lamp_glow_o 144,2,32,26 6
ellipse lamp_glow_i 160,17,10,8 14
ellipse bulb 160,17,4,5 15
rect mirror_frame 112,34,60,46 0
rect mirror 116,38,52,38 7
poly mirror_sheen 120,40 134,40 124,66 120,66 15
line mirror_crack 150,44 154,58 148,70 c8
dots mirror_bulbs_a 112,34 124,34 136,34 148,34 160,34 172,34 112,46 112,58 112,70 112,80 c14
dots mirror_bulbs_b 172,46 172,58 172,70 172,80 124,80 136,80 148,80 160,80 c14
dots mirror_dead 148,34 172,58 124,80 c8
rect mirror_shelf 108,82,68,3 0
ellipse mirror_pot1 120,80,4,2 4
rect mirror_pot2 140,78,6,4 7
line mirror_brush 152,80 160,77 c6
line rail_bar 0,38 72,38 c8
line rail_hook1 10,38 10,42 c8
line rail_hook2 26,38 26,42 c8
line rail_hook3 42,38 42,42 c8
line rail_hook4 58,38 58,42 c8
poly jacket_a 2,42 20,42 22,92 0,92 5
poly jacket_b 22,42 38,42 40,88 24,88 13
poly jacket_c 40,42 54,42 56,96 42,96 1
poly jacket_d 56,42 70,42 72,90 58,90 4
dots seq_a 6,50 12,60 8,72 16,82 14,52 c15
dots seq_b 28,52 34,62 26,74 34,80 c15
dots seq_c 46,52 50,66 44,80 52,86 c11
dots seq_d 62,54 66,66 60,78 68,84 c14
rect jacket_floor 2,98,70,6 0
rect amp1 276,60,44,40 0 e8
rect amp2 282,26,38,34 0 e8
ellipse amp1_cone 298,80,12,12 8
ellipse amp1_rim 298,80,12,12 none e7
ellipse amp1_dust 298,80,4,4 0
ellipse amp2_cone 301,43,10,10 8
ellipse amp2_rim 301,43,10,10 none e7
ellipse amp2_dust 301,43,3,3 0
line amp_handle1 284,66 292,66 c7
line amp_handle2 288,30 296,30 c7
rect amp_corner1 276,60,4,4 7
rect amp_corner2 316,96,4,4 7
rect amp_sticker 306,92,10,5 14
line amp_cable 276,98 250,112 220,118 c0
rect door_back 194,36,50,68 13
rect door_far 196,40,46,50 5
poly door_floor 196,90 242,90 242,104 196,104 1
rect door_light1 204,40,6,50 13
rect door_light2 226,40,6,50 13
poly dancer_a 212,90 214,66 220,64 224,66 224,90 0
ellipse dancer_a_head 218,60,5,6 0
poly dancer_b 232,90 232,72 238,70 240,90 0
ellipse dancer_b_head 236,66,4,5 0
poly curtain_l 188,30 206,30 202,50 208,106 186,106 0
poly curtain_r 236,30 256,30 256,106 238,106 242,50 0
rect curtain_rod 184,28,76,4 8
line curtain_fold1 196,34 194,104 c8
line curtain_fold2 246,34 248,104 c8
rect door_frame_l 192,30,3,76 8
rect funda_body 70,106,72,18 0 e8
rect funda_lid 70,104,72,6 8
rect funda_neck 142,110,16,8 0 e8
line funda_seam 70,114 142,114 c8
rect funda_belt 100,102,6,26 6
rect funda_buckle 101,112,4,5 14
rect funda_clasp 124,108,6,4 7
dots funda_studs 74,108 84,108 74,120 84,120 134,120 c7
rect funda_label 108,116,14,5 14
ellipse funda_shadow 106,126,40,3 0
rect funda_open_lid 72,90,68,12 8 e0
line funda_open_hinge 72,102 140,102 c0
rect funda_open_body 70,104,72,20 4 e0
rect funda_open_pad 74,108,64,12 mix:4,0@0.35
rect funda_open_neck 142,110,16,8 4 e0
rect funda_open_hollow 144,112,12,4 0
dots funda_open_studs 74,106 84,106 130,106 c7
ellipse funda_open_shadow 106,126,40,3 0
rect crate_l 4,106,26,20 6 e0
line crate_l_pl 4,116 30,116 c0
rect poster 238,6,26,32 13 e0
line poster_a 242,14 260,14 c0
line poster_b 242,20 256,20 c0
rect poster_c 242,26,10,8 14
line pipe_ceil 0,2 320,2 c8
line pipe_drop 72,2 72,30 c8
rect switch_plate 78,60,6,8 7
dots switch 81,63 81,66 c0
line shadow_l 0,98 70,98 c0
rect scuff_1 40,108,14,3 8
line scuff_2 180,120 220,122 c0
dots litter 60,130 150,132 220,130 280,128 c8`,
    cycles: [
      { name: "the bulb", areas: ["lamp_glow_i", "bulb"], colors: [14, 6], style: "flicker", ms: [700, 2200] },
      { name: "the club's glow", areas: ["door_light1", "door_light2"], colors: [13, 5], style: "blink", ms: 1400 }
    ]
  },

  // ---- EL CHARLIE: wide view of the floor; the stage and its drummer (left third), Cuco at the sound desk, Pelayo at the bar (right third) ----
  charlie: {
    version: 1,
    shot: "Wide, eye level, facing north across the floor, no vanishing point. Palette neon, flat. One light: the stage wash from the back wall, a flat magenta panel behind the stage on the left, a cyan panel behind the sound desk and a magenta panel behind the bar. Subject on the left third (x about 107): the low {stage} with the drummer seated behind a kit patched with grey gaffer tape, a black silhouette with a mohawk against the magenta panel. Second thing on the middle third: {Cuco} at the sound desk, a thin black silhouette with a tall mohawk and headphones against the cyan panel, bent over a plank on two crates with a mixer. Right third (x about 213): {Pelayo} behind the bar, huge, a black silhouette with a collar of spikes and a pencil behind each ear, against the shelf of bottles; between desk and bar a small {back table} with a lit mirror and white lines on it and two black silhouettes bent over it. Between and in front the {crowd}, black silhouettes at different heights with mohawks and a few raised arms. Walls blue, plastered with {stickers} in light cyan, white and light magenta and a few white scrawls; right wing a light magenta neon safety pin sign. Floor: magenta far to blue near with flat patches of coloured light and dark beer spills. moves: the stage wash (flicker), the safety pin sign (blink)",
    draw: `rect wall 0,0,320,100 1
line wall_p1 40,0 40,100 c0
line wall_p2 110,0 110,100 c0
line wall_p3 180,0 180,100 c0
line wall_p4 212,0 212,100 c0
line wall_p5 300,0 300,100 c0
rect ceil_band 0,0,320,8 0
line ceil_truss 0,10 320,10 c8
dots ceil_lights 24,12 70,12 120,12 170,12 216,12 262,12 300,12 c11
rect sticker_1 4,20,10,8 13
rect sticker_2 18,32,8,10 11
rect sticker_3 112,14,12,8 15
rect sticker_4 178,20,10,10 13
rect sticker_5 288,42,12,8 11
rect sticker_6 304,26,10,10 15
rect sticker_7 4,60,8,10 15
line scrawl_1 6,46 30,42 c15
line scrawl_2 8,50 24,54 c15
line scrawl_3 304,64 316,56 c13
rect sign_glow 246,8,62,26 5
line sign_a 256,18 296,18 c13
line sign_b 256,26 296,26 c13
ellipse sign_ring 254,22,3,5 13
line sign_c 296,18 299,22 c13
line sign_d 299,22 296,26 c13
rect panel_stage 16,22,92,70 5 e0
rect panel_stage_hi 22,26,80,62 13
poly drummer_torso 44,62 46,46 58,46 62,62 60,76 46,76 0
ellipse drummer_head 52,38,5,6 0
poly drummer_mohawk 49,33 52,22 55,33 0
line drummer_arm_l 46,50 40,62 c0
line drummer_arm_r 58,50 66,62 c0
line kit_cym_stand_a 26,54 30,90 c8
ellipse kit_cym_a 26,52,11,2 14 e0
line kit_cym_stand_b 90,58 88,90 c8
ellipse kit_cym_b 90,56,11,2 14 e0
line kit_tom_stand_a 38,70 44,80 c8
line kit_tom_stand_b 68,70 60,80 c8
ellipse kit_tom_a 38,66,8,4 7 e0
ellipse kit_tom_b 68,66,8,4 7 e0
ellipse kit_kick 52,80,12,12 7 e0
ellipse kit_kick_head 52,80,8,8 8
ellipse kit_kick_dot 52,80,2,2 15
line kit_tape_a 42,72 62,86 c15
line kit_tape_b 40,84 64,76 c15
rect kit_snare 78,82,14,6 7 e0
line kit_snare_stand 85,88 85,92 c8
rect stage_top 12,92,98,5 7 e0
rect stage_front 12,97,98,14 8 e0
line stage_pl1 40,97 40,111 c0
line stage_pl2 70,97 70,111 c0
line stage_pl3 96,97 96,111 c0
rect stage_lit 12,97,5,14 15
rect stage_tape 12,100,98,2 7
rect amp_1 104,56,16,36 0 e8
ellipse amp_cone1 112,66,5,5 8
ellipse amp_cone2 112,82,5,5 8
line amp_handle 106,58 118,58 c7
rect panel_desk 124,38,50,54 3 e0
rect panel_desk_hi 130,42,38,46 11
poly cuco_body 138,84 140,60 152,56 162,60 164,84 0
ellipse cuco_head 150,50,6,7 0
poly cuco_mohawk 146,44 150,26 154,44 0
poly cuco_mohawk2 152,44 158,30 160,44 0
line cuco_arm_l 142,64 136,82 c0
line cuco_arm_r 160,64 166,82 c0
line cuco_phones 144,50 156,50 c0
rect desk_crate_l 128,86,14,18 6 e0
rect desk_crate_r 156,86,14,18 6 e0
line desk_crate_l_pl 128,95 142,95 c0
line desk_crate_r_pl 156,95 170,95 c0
rect desk_top 124,82,50,5 6 e0
rect desk_mixer 136,74,26,8 7 e0
dots desk_knobs 140,77 146,77 152,77 158,77 c4
rect desk_lamp 166,74,4,8 14
poly lp_a_body 166,104 168,88 176,82 180,86 178,104 0
ellipse lp_a_head 176,78,4,5 0
poly lp_b_body 200,104 200,88 206,82 210,86 210,104 0
ellipse lp_b_head 206,78,4,5 0
poly table_top 176,88 202,88 204,91 174,91 6
rect table_leg1 180,91,3,12 0
rect table_leg2 196,91,3,12 0
rect table_mirror 180,85,18,3 7 e0
dots table_lines 183,86 188,86 193,86 c15
rect panel_bar 224,28,92,62 5 e0
rect panel_bar_hi 230,32,80,54 13
rect shelf_1 232,50,76,3 6
rect shelf_2 232,66,76,3 6
rect bottle_1 236,42,3,8 2
rect bottle_2 242,40,3,10 14
rect bottle_3 248,42,3,8 6
rect bottle_4 296,42,3,8 6
rect bottle_5 300,40,3,10 2
rect bottle_6 240,58,3,8 14
rect bottle_7 296,58,3,8 2
poly pel_body 246,92 248,66 256,56 284,56 292,66 294,92 0
ellipse pel_head 270,48,8,9 0
poly pel_arm_l 246,70 238,86 244,90 254,74 0
poly pel_arm_r 292,70 300,84 296,90 288,76 0
rect pel_glass 296,80,5,7 11
dots pel_spikes 262,58 266,60 270,61 274,60 278,58 c7
dots pel_pencils 261,46 279,46 c14
rect bar_top 222,88,96,5 6 e0
rect bar_front 222,93,96,18 8 e0
line bar_pl1 250,93 250,111 c0
line bar_pl2 280,93 280,111 c0
rect bar_lit 222,93,4,18 15
rect bar_tap 268,80,3,8 7
dots bar_glasses 232,86 242,86 308,86 c11
rect floor_far 0,100,320,10 5
rect floor_mid 0,110,320,12 1
rect floor_near 0,122,320,14 mix:1,0@0.5
line floor_seam1 0,110 320,110 c0
line floor_seam2 0,122 320,122 c0
ellipse floor_patch_a 120,116,30,4 13
ellipse floor_patch_b 250,118,32,4 11
ellipse spill_a 40,128,24,3 8
ellipse spill_b 190,126,20,3 8
poly crowd_a 0,100 4,92 12,90 20,94 28,92 36,90 42,96 48,100 0
poly crowd_b 54,106 58,100 66,98 74,102 82,100 90,104 96,108 0
poly crowd_c 126,108 132,102 142,100 152,104 160,102 168,108 0
poly crowd_d 214,106 220,100 230,98 240,102 252,100 262,104 270,108 0
poly crowd_e 282,106 288,100 300,98 312,102 320,100 320,108 0
poly crowd_near_l 0,118 6,108 18,106 30,110 42,108 52,118 52,136 0,136 0
poly crowd_near_r 262,120 270,110 282,108 294,112 306,108 320,112 320,136 262,136 0
ellipse head_1 8,90,5,6 0
ellipse head_2 26,90,5,6 0
ellipse head_3 74,98,5,6 0
ellipse head_4 146,98,5,6 0
ellipse head_5 232,96,5,6 0
ellipse head_6 300,96,5,6 0
ellipse head_7 20,104,6,7 0
ellipse head_8 286,106,6,7 0
poly mohawk_1 5,84 8,74 11,84 0
poly mohawk_2 71,92 74,82 77,92 0
poly mohawk_3 229,90 232,80 235,90 0
poly mohawk_4 297,90 300,78 303,90 0
line arm_1 30,94 36,78 c0
line arm_2 90,102 94,86 c0
line arm_3 156,100 160,84 c0
line arm_4 254,98 260,82 c0
dots cans 24,126 140,130 224,128 300,126 c7
line cable_a 10,124 60,130 c8
line cable_b 130,106 170,108 c8`,
    cycles: [
      { name: "the stage wash", areas: ["panel_stage_hi"], colors: [13, 5], style: "flicker", ms: [900, 2600] },
      { name: "the safety pin sign", areas: ["sign_a", "sign_b", "sign_ring", "sign_c", "sign_d"], colors: [13, 1], style: "blink", ms: 1500 }
    ],
    overlays: [{ object: "ministro", at: [226, 104], tall: 56 }]
  },

  // ---- THE AVENIDA: eye level down the strip to El Charlie's front; neon on both sides; the thumbnail ------------------------
  avenida: {
    version: 1,
    shot: "Eye level, facing north, a strong one-point view, vp on the right third (200,62) to a small far end. Palette neon, flat. Sky blue with magenta low down, the far roofs black. Left facade: blue, grey {shutters} half up, a lit window (cyan) of the bar with black silhouettes, a pink neon blade sign on a bracket (a cocktail glass of tube in a black box); right facade: a white-lit depot window, shutters, and a cyan blade sign on a bracket with three chevrons of tube; two rows of lit windows on each side. Subject: the black front of {El Charlie} at the far end on the right third, a round lit porthole window and a queue of black silhouettes at its entrance. Wet road in bands, magenta far to blue near, with the signs repeated in it as soft streaks; a black car on the right, {people in the doorways} as black silhouettes. moves: the arrow sign (running chevrons), the faulty pink tube (flicker)",
    draw: `vp 200,62
rect sky 0,0,320,28 1
rect glow 0,28,320,36 5
poly roofs 148,56 148,46 160,46 160,40 172,40 172,48 186,48 186,36 200,36 200,44 214,44 214,34 228,34 228,48 234,48 234,56 0
poly road_far 0,136@1 320,136@1 320,136@0.25 0,136@0.25 5
poly road_mid 0,136@1 320,136@1 320,136@0.55 0,136@0.55 1
poly road_near 0,136@1 320,136@1 320,136@0.82 0,136@0.82 mix:1,0@0.5
poly wall_l 0,0 150,46.5 150,78.5 0,128 1
poly wall_r 320,0 230,46.5 230,78.5 320,128 1
poly wall_l_ground 0,128 150,78.5 150,70 0,100 mix:1,0@0.5
poly wall_r_ground 320,128 230,78.5 230,70 320,100 mix:1,0@0.5
poly walk_l 0,136 0,128 150,78.5 165,79 35,136 mix:5,1@0.5
poly walk_r 320,136 320,128 230,78.5 220,79 295,136 mix:5,1@0.5
line kerb_l 35,136 165,79 c8
line kerb_r 295,136 220,79 c8
line course_l1 0,10 150,49 c0
line course_l2 0,38 150,56 c0
line course_l3 0,68 150,63.5 c0
line course_r1 320,10 230,49 c0
line course_r2 320,38 230,56 c0
line course_r3 320,68 230,63.5 c0
poly win_l1 40,25.2 71,32.3 71,42.6 40,38 11 e0
poly win_l2 88.9,36.4 104.8,40.1 104.8,47.7 88.9,45.3 0 e0
poly win_l3 116.7,42.8 125.9,45 125.9,50.9 116.7,49.5 13 e0
poly win_l4 135.5,47.2 141.2,48.5 141.2,53.2 135.5,52.3 0 e0
poly win_l5 40,47.6 71,50.4 71,60.7 40,60.4 0 e0
poly win_l6 88.9,52 104.8,53.4 104.8,61 88.9,60.9 15 e0
poly win_l7 116.7,54.5 125.9,55.3 125.9,61.3 116.7,61.2 11 e0
poly win_l8 135.5,56.2 141.2,56.7 141.2,61.4 135.5,61.4 13 e0
poly win_r1 296,25.2 277.4,32.3 277.4,42.6 296,38 13 e0
poly win_r2 266.7,36.4 257.1,40.1 257.1,47.7 266.7,45.3 11 e0
poly win_r3 250,42.8 244.4,45 244.4,50.9 250,49.5 0 e0
poly win_r4 238.7,47.2 235.3,48.5 235.3,53.2 238.7,52.3 15 e0
poly win_r5 296,47.6 277.4,50.4 277.4,60.7 296,60.4 11 e0
poly win_r6 266.7,52 257.1,53.4 257.1,61 266.7,60.9 0 e0
poly win_r7 250,54.5 244.4,55.3 244.4,61.3 250,61.2 15 e0
poly win_r8 238.7,56.2 235.3,56.7 235.3,61.4 238.7,61.4 0 e0
poly bar_window 18.2,80.2 94.7,72.5 94.7,89.4 18.2,109.3 11 e0
poly bar_sil_1 43.8,88.6 55.1,86.6 55.1,99.7 43.8,102.6 0
poly bar_sil_2 71,82.6 79.5,81.3 79.5,93.3 71,95.5 0
poly shutter_l 100,70 133.3,67.3 133.3,84 100,95 stripes:8,0
poly door_l 137.5,71.4 145.9,70.1 145.9,79.8 137.5,82.6 0
poly depot_window 309.1,80.2 263.2,72.5 263.2,89.4 309.1,109.3 15 e0
poly depot_row 300,87 266.7,78.7 266.7,80.9 300,90.3 8
poly shutter_r 260,70 240,67.3 240,84 260,95 stripes:8,0
poly door_r 237.5,71.4 232.4,70.1 232.4,79.8 237.5,82.6 0
line bar_bracket 62,40 66,40 c8
line bar_bracket2 62,50 66,44 c8
rect bar_sign_box 66,38,26,20 0 e8
rect bar_sign_glow 68,40,22,16 5
line bar_tube_a 71,44 87,44 c13
line bar_tube_b 71,44 79,52 c13
line bar_tube_c 87,44 79,52 c13
line bar_tube_d 79,52 79,55 c13
line arrow_bracket 280,40 277,40 c8
line arrow_bracket2 280,50 277,44 c8
rect arrow_sign_box 252,38,25,20 0 e8
rect arrow_sign_glow 254,40,21,16 3
line arrow_a 270,43 265,48 270,53 c11
line arrow_b 264,43 259,48 264,53 c11
line arrow_c 258,43 253,48 258,53 c11
poly fig_r2 254,93 254,84 255,80 258,80 259,84 259,93 0
ellipse fig_r2h 256,78,2,3 0
poly fig_r3 262,96 262,85 263,81 267,81 268,85 268,96 0
ellipse fig_r3h 265,79,2,3 0
rect club_front 150,42,80,42 0 e8
ellipse club_port 190,60,9,9 11 e15
ellipse club_port_in 190,60,5,5 15
rect club_door 170,64,12,20 11
rect club_awning 166,60,20,4 5
rect club_sign 200,48,22,8 13 e0
dots club_sign_dots 206,52 212,52 218,52 c15
rect club_glow_l 150,42,6,42 5
poly q_1 170,84 170,74 172,70 175,70 178,74 178,84 0
poly q_2 180,84 180,72 182,68 185,68 188,72 188,84 0
ellipse q_1h 173,67,2,3 0
ellipse q_2h 183,65,2,3 0
poly q_3 160,84 160,75 162,72 165,72 167,76 167,84 0
ellipse q_3h 163,69,2,3 0
poly fig_l1 14,122 14,100 16,96 20,96 22,100 22,122 0
ellipse fig_l1h 18,92,3,4 0
poly fig_l2 72,106 72,90 74,86 77,86 79,90 79,106 0
ellipse fig_l2h 75,83,2,3 0
poly fig_r1 296,122 296,100 298,96 302,96 304,100 304,122 0
ellipse fig_r1h 300,92,3,4 0
poly car_body 214,112 218,104 238,102 262,104 270,112 270,120 214,120 0
poly car_roof 226,104 232,96 254,96 262,104 0
rect car_win 232,98,26,5 8
ellipse car_lamp 268,112,3,2 14
ellipse car_lamp2 216,112,3,2 14
rect car_bumper 212,119,60,3 8
ellipse car_wheel1 230,121,6,4 8
ellipse car_wheel2 256,121,6,4 8
rect car_glow 270,110,10,6 14
line streak_a 80,100 82,136 c13
line streak_b 120,104 122,136 c11
line streak_c 150,92 150,136 c11
line streak_d 234,118 232,136 c14
line streak_e 280,100 284,136 c13
line streak_f 190,86 190,136 c11
line streak_g 40,112 44,136 c13
ellipse puddle_a 110,120,22,4 5
ellipse puddle_b 220,128,26,4 5
ellipse puddle_c 40,130,16,3 5
line dash_1 60,128 74,128 c5
line dash_2 130,132 150,132 c5
line dash_3 256,134 280,134 c5
rect pole_l 28,50,3,60 8
rect pole_r 292,40,3,70 8
line wire_1 30,52 120,40 c8
line wire_2 294,44 210,36 c8
dots litter 100,132 170,130 240,134 c8
line crack_1 100,124 124,120 c0
line crack_2 270,126 300,130 c0
line drain 52,128 64,128 c0
rect post_box 276,100,12,22 4 e0
line post_box_slot 278,106 286,106 c0
rect sign_post 36,70,3,40 8
rect sign_board 28,64,20,10 15 e0
line sign_line 31,68 45,68 c0`,
    cycles: [
      { name: "the arrow sign", areas: ["arrow_a", "arrow_b", "arrow_c"], colors: [11, 3], rest: 2, style: "rotate", sweep: true, ms: 300 },
      { name: "the faulty pink tube", areas: ["bar_tube_a", "bar_tube_b", "bar_tube_c", "bar_tube_d"], colors: [13, 5], style: "flicker", ms: [800, 4000] }
    ],
    overlays: [{ object: "ministro", at: [101, 132], tall: 46 }, { object: "monedas", at: [40, 106] }]
  },

  // ---- THE CORNER: frontal, the one working street lamp; Marisol on the left third; the pension's sign on the right ---------------
  esquina: {
    version: 1,
    shot: "Eye level, facing north, frontal, no vanishing point; the corner building across the street. Palette neon, flat. One light: the orange {street lamp} (globe light red with a yellow core) on a grey pole at the middle, its flat orange pool on the pavement. Subject on the left third (x about 107): {Marisol}, about 62 pixels tall, in a short light-magenta coat, brown bare legs and dark red shoes, black hair up in a bun, one hand on her hip, stands in the lamp's pool. On the right third: the {Pensión Esperanza}, a green sign and a lit cyan entrance; at the left wing the bright white window of the {Lavandería} with machines. The corner building blue with sparse lit windows; the pavement bands magenta far to blue near, with a black {car} at the kerb on the right. moves: the street lamp (flicker), the pension's green sign (blink)",
    draw: `rect sky 0,0,320,24 1
rect glow 0,24,320,24 5
poly roofs 56,52 56,40 70,40 70,32 86,32 86,38 104,38 104,26 128,26 128,34 150,34 150,28 172,28 172,40 196,40 196,32 214,32 214,42 236,42 236,34 262,34 262,52 0
rect building 50,46,214,60 1
rect building_shade 50,46,24,60 mix:1,0@0.5
rect building_shade2 240,46,24,60 mix:1,0@0.5
line course_1 50,58 264,58 c0
line course_2 50,70 264,70 c0
line course_3 50,82 264,82 c0
line course_4 50,94 264,94 c0
rect win_1 82,50,14,8 11
rect win_2 116,62,14,8 13
rect win_3 168,50,14,8 11
rect win_4 196,62,14,8 15
rect win_5 82,74,14,8 13
rect win_6 150,74,14,8 11
rect win_7 214,50,14,8 13
rect win_8 116,86,14,8 11
rect win_9 196,86,14,8 13
rect win_10 62,62,10,8 8
rect win_11 238,74,10,8 8
line win_bars 82,54 96,54 c0
line win_bars2 168,54 182,54 c0
line win_bars3 196,66 210,66 c0
rect cornice 46,44,222,4 8
rect laundry_front 0,64,52,42 8
rect laundry_win 4,70,44,30 15 e0
rect laundry_m1 8,76,12,22 7 e0
rect laundry_m2 22,76,12,22 7 e0
rect laundry_m3 36,76,10,22 7 e0
ellipse laundry_d1 14,88,4,4 0
ellipse laundry_d2 28,88,4,4 0
ellipse laundry_d3 41,88,3,3 0
rect laundry_sign 6,66,40,4 13
poly pension_front 252,106 252,52 320,52 320,106 mix:1,0@0.5
rect pension_door 270,66,22,40 11 e0
rect pension_door_in 274,70,14,36 15
poly pension_awning 262,64 300,64 304,70 258,70 5
rect pension_sign 268,56,30,7 2 e0
dots pension_sign_dots 274,59 282,59 290,59 c10
rect pension_win_1 258,76,6,8 13
rect pension_win_2 300,76,6,8 11
poly pension_step 266,106 296,106 298,110 264,110 8
poly door_fig 280,106 280,84 282,80 286,80 288,84 288,106 0
ellipse door_fig_h 284,76,3,4 0
rect pole 126,22,4,84 8
line pole_hi 126,22 126,106 c7
rect pole_arm 118,20,12,3 8
rect pole_base 123,100,10,6 7
ellipse globe 118,22,7,6 12
ellipse globe_core 118,22,3,3 14
line globe_cap 112,17 124,17 c8
rect walk_far 0,106,320,10 5
rect walk_mid 0,116,320,10 1
rect walk_near 0,126,320,10 mix:1,0@0.5
line kerb_a 0,116 320,116 c8
line kerb_b 0,126 320,126 c0
ellipse pool_o 112,114,40,7 12
ellipse pool_i 112,114,22,4 14
rect walk_stone1 8,108,26,6 1
rect walk_stone2 40,108,22,6 1
rect walk_stone3 220,108,30,6 1
rect walk_stone4 262,108,24,6 1
poly m_legs 96,106 98,82 104,82 106,106 104,106 102,86 100,106 6
poly m_legs2 108,106 110,82 116,82 118,106 116,106 114,86 112,106 6
poly m_leg_sh 104,106 102,86 100,106 8
rect m_shoe1 94,104,10,3 4
rect m_shoe2 108,104,10,3 4
poly m_coat 94,80 120,80 124,56 90,56 13
poly m_coat_sh 108,80 120,80 124,56 112,56 5
poly m_coat_hem 94,80 120,80 120,84 94,84 5
rect m_belt 94,70,28,3 5
poly m_neck 104,54 108,54 108,58 104,58 6
ellipse m_head 106,48,5,7 6
ellipse m_head_sh 109,48,2,6 8
ellipse m_hair 106,44,6,5 0
ellipse m_bun 106,38,4,4 0
poly m_arm_hip 118,58 124,66 120,72 114,64 13
poly m_arm_down 92,58 88,70 91,74 96,62 13
ellipse m_hand 90,76,2,3 6
rect m_bag 118,72,8,6 4
outline m e8
poly car_body 8,126 14,120 36,118 62,120 72,126 72,134 8,134 0
poly car_roof 22,119 28,112 52,112 60,119 0
rect car_win 30,114,24,5 8
ellipse car_lamp 68,126,3,2 14
ellipse car_lamp2 12,126,3,2 14
ellipse car_wheel1 26,134,6,3 8
ellipse car_wheel2 54,134,6,3 8
rect car_glow 72,124,10,6 14
rect bin 232,96,12,12 8 e0
rect bin_lid 230,93,16,4 7
line streak_a 112,120 112,136 c12
line streak_b 38,70 40,106 c15
line streak_c 282,106 282,136 c11
line streak_d 210,116 212,136 c13
ellipse puddle_a 180,130,20,3 5
ellipse puddle_b 250,124,16,3 5
line dash_1 130,124 150,124 c5
line dash_2 160,132 196,132 c5
rect grate 200,118,16,4 0
line grate_1 204,118 204,122 c8
line grate_2 208,118 208,122 c8
line grate_3 212,118 212,122 c8
line wire_1 130,24 250,18 c8
line wire_2 0,30 118,22 c8
dots litter 150,110 180,112 76,112 c8
line crack 140,134 170,128 c0`,
    cycles: [
      { name: "the street lamp", areas: ["globe_core", "globe", "pool_i", "pool_o"], colors: [14, 12], style: "flicker", ms: [700, 2200] },
      { name: "the pension's green sign", areas: ["pension_sign"], colors: [2, 10], style: "blink", ms: 1600 }
    ]
  },

  // ---- THE ESTAFETA: frontal; the clerk behind her counter on the left third, the parcel on its shelf on the right third ------------
  estafeta: {
    version: 1,
    shot: "Eye level, facing north, frontal across a counter, no vanishing point. Palette institution, flat. One light: the stuttering white {strip light} over the counter, lighting a flat white patch on the counter top. Subject on the left third (x about 107): {Doña Remedios}, stout, in a green cardigan (the picture's one green thing) with a brown hairnet over brown hair, a pale grey face, a stamp raised in one hand, behind the long counter. Right third (x about 213): a swollen canvas {mail sack} tied at the neck, with a white band and a red stamp, on a shelf. Back wall: {pigeonholes} to the ceiling in dark grey, some with white letters sticking out; the {counter} grey with a purple inkpad; a {notice} on the right wall; floor tiles in bands. moves: the strip light (flicker)",
    draw: `rect wall 0,0,320,92 8
rect wall_hi 0,0,320,6 0
rect hole_1 8,12,26,14 0
rect hole_2 38,12,22,14 0
rect hole_3 64,12,26,14 0
rect hole_4 94,12,24,14 0
rect hole_5 122,12,26,14 0
rect hole_6 152,12,22,14 0
rect hole_7 178,12,26,14 0
rect hole_8 208,12,24,14 0
rect hole_9 236,12,22,14 0
rect hole_10 262,12,26,14 0
rect hole_11 292,12,22,14 0
rect hole_12 8,30,26,14 0
rect hole_13 38,30,22,14 0
rect hole_14 64,30,26,14 0
rect hole_15 94,30,24,14 0
rect hole_16 122,30,26,14 0
rect hole_17 152,30,22,14 0
rect hole_18 178,30,26,14 0
rect hole_19 208,30,24,14 0
rect hole_20 236,30,22,14 0
rect hole_21 262,30,26,14 0
rect hole_22 292,30,22,14 0
rect hole_23 8,48,26,14 0
rect hole_24 38,48,22,14 0
rect hole_25 64,48,26,14 0
rect hole_26 94,48,24,14 0
rect hole_27 262,48,26,14 0
rect hole_28 292,48,22,14 0
rect hole_29 8,66,26,14 0
rect hole_30 38,66,22,14 0
rect hole_31 64,66,26,14 0
rect hole_32 236,66,22,14 0
rect hole_33 262,66,26,14 0
rect hole_34 292,66,22,14 0
line shelf_line_1 0,28 320,28 c7
line shelf_line_2 0,46 320,46 c7
line shelf_line_3 0,64 320,64 c7
line shelf_line_4 0,82 320,82 c7
rect letter_1 14,16,12,8 15
rect letter_2 70,34,14,8 7
rect letter_3 126,16,12,8 15
rect letter_4 184,34,12,8 15
rect letter_5 240,16,10,8 7
rect letter_6 268,52,14,8 15
rect letter_7 42,70,10,8 7
rect letter_8 298,34,10,8 15
rect shelf 186,56,64,4 6
rect shelf_bracket1 190,60,3,8 0
rect shelf_bracket2 242,60,3,8 0
poly sack_shelf 194,56 196,44 204,37 214,34 224,37 232,44 236,56 7
poly sack_shelf_sh 224,37 232,44 236,56 220,56 8
rect sack_shelf_tie 208,32,12,4 0
rect sack_shelf_band 196,46,38,6 15
rect sack_shelf_stamp 214,47,12,4 4
line sack_shelf_c1 202,40 200,56 c8
line sack_shelf_c2 212,37 210,46 c8
rect light_fix 126,2,72,6 7 e0
rect light_tube 130,4,64,2 15
rect counter_top 0,90,320,8 7 e0
rect light_patch 128,94,70,3 15
rect counter_front 0,98,320,20 8
line counter_pl1 60,98 60,118 c0
line counter_pl2 160,98 160,118 c0
line counter_pl3 260,98 260,118 c0
rect counter_kick 0,116,320,4 0
rect inkpad 232,86,22,6 5 e0
rect inkpad_in 236,87,14,3 13
rect scale_base 276,86,26,5 7 e0
rect scale_dish 280,78,18,8 7 e0
line scale_arm 289,78 289,62 c7
ellipse scale_dial 289,60,6,5 15 e0
line scale_tick 289,58 289,62 c0
rect string_spool 156,82,10,8 6 e0
line string_line 166,86 180,90 c6
poly r_body 88,92 90,66 106,56 128,66 130,92 2
poly r_body_sh 116,92 128,66 130,92 8
poly r_cardi_front 106,92 108,66 114,66 114,92 7
dots r_buttons 110,72 110,78 110,84 c0
poly r_arm_down 90,70 82,90 90,92 96,72 2
poly r_arm_up 124,68 138,52 144,56 130,76 2
rect r_stamp 138,44,10,10 6 e0
rect r_stamp_handle 141,38,4,6 0
ellipse r_hand 142,56,4,3 7
ellipse r_neck 108,56,5,4 7
ellipse r_head 108,46,10,11 7
ellipse r_head_sh 114,46,4,10 8
ellipse r_hair 108,38,10,6 6
poly r_net 98,40 98,56 100,54 102,40 6
rect r_hairnet 98,36,20,3 0
dots r_eyes 104,46 112,46 c0
line r_mouth 106,52 110,52 c4
line r_brow 102,43 106,42 c8
outline r e0
rect notice 262,22,38,34 15 e0
line notice_a 266,28 296,28 c0
line notice_b 266,34 292,34 c0
line notice_c 266,40 296,40 c0
rect notice_d 266,46,18,6 4
dots notice_pins 264,24 298,24 c0
rect hook_rack 0,50,40,3 8
line hook_1 6,53 6,58 c7
line hook_2 20,53 20,58 c7
poly coat_hook 2,58 14,58 16,86 0,86 7
rect stamp_rack 40,76,30,10 0 e7
dots stamp_rack_d 46,81 54,81 62,81 c7
rect floor_far 0,120,320,8 7
rect floor_mid 0,128,320,8 8
line tile_1 0,128 320,128 c0
line tile_2 40,120 20,136 c0
line tile_3 110,120 100,136 c0
line tile_4 190,120 190,136 c0
line tile_5 270,120 282,136 c0
rect sack 8,122,34,12 7 e0
line sack_tie 14,126 36,126 c0
poly sack_top 12,122 20,116 32,116 38,122 7
rect crate_post 270,120,40,14 6 e0
line crate_post_pl 270,127 310,127 c0
dots floor_marks 80,132 150,130 220,134 c0
line cord 164,8 164,30 c7
rect desk_lamp_g 296,66,6,16 7 e0`,
    cycles: [
      { name: "the strip light", areas: ["light_tube", "light_patch"], colors: [15, 7], style: "flicker", ms: [500, 1600] }
    ],
    overlays: [{ object: "ministro", at: [163, 128], tall: 74 }]
  },

  // ---- LA OPERA: frontal across the little stage; Doña Aurora singing on the left third, the round table and the gilt mirror on the right ----
  opera: {
    version: 1,
    shot: "Eye level, facing north, frontal, no vanishing point. Palette lamplight, flat. One light: a hanging lamp of seven bulbs over the little stage (three lit yellow, four dead grey), a flat yellow patch on the stage boards. Subject on the left third (x about 107): {Doña Aurora} singing on the little {stage}, a woman of fifty-eight bare from the waist up, pale skin (white with light grey) with a shade under the breasts and at the side, a mass of red-dyed hair, a green feather {boa} round her neck and trailing down one arm, a long dark red skirt to the boards, one arm raised. Behind her red velvet {curtains} gone brown on each side and a brown velvet wall with a gold-framed {mirror} on the right whose glass is dark grey with white glints. Right third (x about 213): a round {table} with a white candle in a bottle, its flame yellow, in front of the mirror. Left wing: the short mahogany {bar} with a shelf of bottles behind it and Gaspar the barman a black silhouette behind it; in front of the stage the backs of three older men in good overcoats, black silhouettes, each with a small glass. Floor brown planks in bands. moves: the lamp (flicker), the candle flame (flicker)",
    draw: `rect wall 0,0,320,100 6
rect wall_hi 0,0,320,6 0
line wall_p1 46,6 46,100 c0
line wall_p2 176,6 176,100 c0
line wall_p3 250,6 250,100 c0
rect velvet_1 6,16,30,70 4
rect velvet_2 228,16,20,70 4
rect velvet_3 254,16,50,70 4
line velvet_f1 14,16 14,86 c0
line velvet_f2 24,16 24,86 c0
line velvet_f3 234,16 234,86 c0
line velvet_f4 242,16 242,86 c0
line velvet_f5 264,16 264,86 c0
line velvet_f6 280,16 280,86 c0
line velvet_f7 296,16 296,86 c0
poly curtain_l 50,6 74,6 70,92 50,92 4
poly curtain_r 148,6 172,6 172,92 150,92 4
line curtain_lf1 58,6 56,92 c0
line curtain_lf2 66,6 64,92 c0
line curtain_rf1 156,6 158,92 c0
line curtain_rf2 164,6 164,92 c0
rect stage_back 74,20,74,72 0 e8
rect stage_top 50,92,120,5 6 e0
rect stage_front 50,97,120,13 0 e6
line stage_trim 50,97 170,97 c14
line stage_pl1 80,97 80,110 c6
line stage_pl2 110,97 110,110 c6
line stage_pl3 140,97 140,110 c6
ellipse stage_pool 110,92,40,3 14
line lamp_chain 112,0 112,12 c8
rect lamp_bar 82,12,60,3 14 e0
ellipse bulb_1 84,19,3,4 14
ellipse bulb_2 94,19,3,4 8
ellipse bulb_3 104,19,3,4 14
ellipse bulb_4 112,19,3,4 8
ellipse bulb_5 120,19,3,4 14
ellipse bulb_6 130,19,3,4 8
ellipse bulb_7 140,19,3,4 8
poly aurora_skirt 96,64 126,64 134,92 88,92 4
line aurora_skirt_f1 104,66 98,92 c0
line aurora_skirt_f2 112,66 112,92 c0
line aurora_skirt_f3 120,66 126,92 c0
poly aurora_torso 102,46 118,46 119,52 115,60 114,66 106,66 105,60 101,52 15
poly aurora_torso_sh 116,48 118,47 119,52 115,60 114,66 112,66 113,60 116,52 7
rect aurora_neck 108,42,4,5 15
rect aurora_neck_sh 108,45,4,2 7
ellipse aurora_breast_sh_l 107,58,4,3 7
ellipse aurora_breast_sh_r 113,58,4,3 7
ellipse aurora_breast_l 107,57,4,3 15
ellipse aurora_breast_r 113,57,4,3 15
ellipse aurora_breast_side_sh 119,60,4,3 7
ellipse aurora_breast_side 119,58,4,3 15
line aurora_navel 110,63 110,64 c7
ellipse aurora_head 110,36,6,8 15
poly aurora_head_sh 113,32 116,36 114,42 111,44 115,38 7
poly aurora_arm_up 118,46 128,34 131,36 122,52 15
poly aurora_arm_up_sh 120,50 129,36 131,36 122,52 7
poly aurora_arm_down 102,48 96,60 99,64 105,52 15
poly aurora_arm_sh 98,56 96,60 99,64 100,60 7
ellipse aurora_hair 109,32,8,6 4
poly aurora_hair_fall 102,34 98,52 104,50 106,38 4
poly aurora_boa 100,44 120,44 122,50 116,52 108,52 98,50 2
poly aurora_boa_tail 96,52 104,50 104,60 100,74 96,80 92,66 2
dots aurora_boa_hi 100,47 106,46 112,46 118,48 94,62 98,72 98,78 c10
outline aurora e0
rect hall_shadow 86,10,2,2 0
rect bar_shelf 4,50,40,3 6 e0
rect bar_wall 2,30,44,22 0
rect bar_bottle_1 8,40,3,10 2
rect bar_bottle_2 16,38,3,12 14
rect bar_bottle_3 24,40,3,10 6
rect bar_bottle_4 32,38,3,12 2
rect bar_bottle_5 38,40,3,10 14
poly gaspar_body 10,86 12,66 22,60 32,66 34,86 0
ellipse gaspar_head 22,54,6,7 0
rect bar_top 0,84,46,4 6 e0
rect bar_front 0,88,46,22 0 e6
line bar_front_1 15,88 15,110 c6
line bar_front_2 30,88 30,110 c6
rect bar_lit 0,88,4,22 14
dots bar_glasses 10,82 22,82 34,82 c11
rect mirror_frame 182,26,42,50 14 e0
rect mirror_glass 186,30,34,42 8
line mirror_glint_1 190,36 198,50 c15
line mirror_glint_2 204,36 210,48 c15
line mirror_glint_3 212,56 216,64 c7
rect mirror_cap 186,22,34,4 14 e0
rect table_cloth 252,100,34,4 4 e0
ellipse table_top 269,100,20,5 6 e0
rect table_leg 266,104,6,22 0
ellipse table_foot 269,127,10,3 0
rect candle_bottle 266,88,6,12 2 e0
rect candle 268,80,2,9 15
ellipse candle_flame 269,77,2,3 14
ellipse candle_pool 269,100,12,2 14
rect floor_far 0,100,320,10 6
rect floor_mid 0,110,320,12 mix:6,0@0.5
rect floor_near 0,122,320,14 mix:6,0@0.5
line floor_seam1 0,110 320,110 c0
line floor_seam2 0,122 320,122 c0
line floor_pl1 70,110 62,122 c0
line floor_pl2 190,110 196,122 c0
line floor_pl3 40,122 28,136 c0
line floor_pl4 150,122 148,136 c0
line floor_pl5 240,122 252,136 c0
poly man_a_body 60,136 62,118 76,112 90,116 92,136 0
ellipse man_a_head 76,108,6,7 0
rect man_a_hair 72,100,8,3 7
poly man_b_body 126,136 128,120 142,114 156,118 158,136 0
ellipse man_b_head 142,110,6,7 0
rect man_b_hair 138,102,8,3 7
poly man_c_body 200,136 202,122 214,116 226,120 228,136 0
ellipse man_c_head 214,112,6,7 0
rect man_c_hair 210,104,8,3 7
dots glasses 70,126 138,128 212,130 c11
line rug_edge 30,128 100,130 c4
line rug_edge2 170,126 250,128 c4`,
    cycles: [
      { name: "the lamp", areas: ["bulb_1", "bulb_3", "bulb_5", "stage_pool"], colors: [14, 6], style: "flicker", ms: [800, 2400] },
      { name: "the candle flame", areas: ["candle_flame", "candle_pool"], colors: [14, 12], style: "flicker", ms: [400, 1200] }
    ],
    overlays: [{ object: "ministro", at: [239, 104], tall: 52 }]
  },

  // ---- PENSIÓN ESPERANZA: eye level, a little off-centre; the staircase on the left, Don Nicanor behind his desk on the right third ----
  pension: {
    version: 1,
    shot: "Eye level, facing north, slightly oblique, vp on the left at the foot of the stairs (60,84). Palette lamplight, flat. One light: a green-shaded desk lamp on the {desk}, a flat yellow patch on its top and the wall behind it. Subject on the right third (x about 213): {Don Nicanor}, thin, with a moustache and a green cardigan, a pale light grey face, behind the varnished desk, one hand on a brass {bell}. Left third: the {stairs} going up into the dark, a worn red runner, a banister of posts. Back wall brown, with the {key board} of hooks and keys, and the open {ledger} on the desk. Floor brown planks in bands with a red runner. moves: the desk lamp (flicker)",
    draw: `vp 60,84
rect wall 0,0,320,100 mix:6,0@0.5
rect wall_lit 150,0,150,100 6
line wall_p1 150,0 150,100 c0
line wall_p2 200,0 200,100 c0
line wall_p3 250,0 250,100 c0
line wall_p4 300,0 300,100 c0
rect dado 0,70,320,30 mix:6,0@0.5
line dado_top 0,70 320,70 c0
rect key_board 170,14,70,46 0 e8
rect key_board_in 174,18,62,38 6
dots hooks_1 180,26 192,26 204,26 216,26 228,26 c14
dots hooks_2 180,40 192,40 204,40 216,40 228,40 c14
line key_1 180,26 180,32 c14
line key_2 192,26 192,32 c14
line key_3 204,26 204,32 c14
line key_4 216,26 216,32 c14
line key_5 180,40 180,46 c14
line key_6 204,40 204,46 c14
line key_7 228,40 228,46 c14
rect key_tag1 190,32,5,4 15
rect key_tag2 226,46,5,4 15
poly stair_wall 0,0 0,100 150,100 150,0 mix:6,0@0.5
poly stair_dark 0,0 0,60 60,32 60,0 0
poly step_1 0,136@1 150,136@1 150,136@0.7 0,136@0.7 4
poly step_2 0,112@1 120,112@1 120,112@0.7 0,112@0.7 6
poly stair_side 0,0 0,100 110,100 110,60 mix:6,0@0.5
poly tread_1 4,104 74,104 74,98 4,98 4
poly tread_2 4,92 64,92 64,86 4,86 4
poly tread_3 4,80 54,80 54,74 4,74 4
poly tread_4 4,68 44,68 44,62 4,62 4
poly tread_5 4,56 34,56 34,50 4,50 4
poly riser_1 74,104 74,98 80,98 80,104 6
poly riser_2 64,92 64,86 70,86 70,92 6
poly riser_3 54,80 54,74 60,74 60,80 6
poly riser_4 44,68 44,62 50,62 50,68 6
poly riser_5 34,56 34,50 40,50 40,56 6
line banister_rail 6,110 98,98 94,48 c6
line banister_rail2 6,48 92,98 c0
line post_1 98,98 98,112 c6
line post_2 82,98 82,112 c6
line post_3 66,98 66,112 c6
line post_4 50,98 50,112 c6
rect newel 94,96,8,22 6 e0
rect newel_cap 92,94,12,4 14
rect rug_runner 0,120,170,8 4
rect rug_edge 0,120,170,2 14
rect floor_far 0,118,320,8 6
rect floor_mid 0,126,320,10 mix:6,0@0.5
line floor_pl1 0,126 320,126 c0
line floor_pl2 60,118 40,136 c0
line floor_pl3 160,118 160,136 c0
line floor_pl4 260,118 282,136 c0
line floor_pl5 110,126 100,136 c0
rect desk_back 168,88,148,34 6 e0
rect desk_top 164,84,156,6 mix:6,14@0.5 e0
rect desk_panel1 176,94,40,22 mix:6,0@0.5
rect desk_panel2 224,94,40,22 mix:6,0@0.5
rect desk_panel3 272,94,36,22 mix:6,0@0.5
line desk_rail 168,118 316,118 c0
rect desk_lamp_base 172,76,8,8 8 e0
poly desk_lamp_shade 168,64 186,64 190,74 164,74 2 e0
ellipse desk_lamp_bulb 177,75,4,2 15
rect desk_lamp_patch 160,82,34,2 14
rect desk_lamp_wall 158,40,34,20 14
rect ledger 224,78,26,8 15 e0
line ledger_spine 237,78 237,86 c0
line ledger_l1 227,81 235,81 c7
line ledger_l2 227,84 235,84 c7
line ledger_l3 239,81 247,81 c7
rect ledger_cover 222,85,30,3 6 e0
ellipse bell_dome 270,82,6,4 14
rect bell_base 262,86,16,2 6
rect bell_knob 269,77,3,3 14
rect pen_stand 290,80,10,6 7 e0
line pen 296,74 296,80 c0
poly n_body 202,86 204,62 212,56 226,56 234,62 236,86 2
poly n_body_sh 226,86 234,62 236,86 8
poly n_cardi_front 212,86 214,62 218,62 218,86 7
rect n_collar 212,54,14,4 15
dots n_buttons 216,66 216,72 216,78 c0
poly n_arm 236,70 252,82 246,88 232,78 2
ellipse n_hand 250,84,4,3 7
ellipse n_neck 219,52,4,4 7
ellipse n_head 219,44,8,10 7
ellipse n_head_sh 224,44,3,9 8
ellipse n_hair_l 212,40,3,6 8
ellipse n_hair_r 226,40,3,6 8
ellipse n_bald 219,36,7,3 7
rect n_moustache 214,48,10,2 0
dots n_eyes 216,43 222,43 c0
line n_mouth 217,52 221,52 c4
outline n e0
rect door_back 266,28,40,52 0 e8
rect door_back_in 270,32,32,44 1
rect door_back_glow 274,36,10,30 13
line door_back_bar 270,56 302,56 c0
rect clock_back 130,28,24,24 7 e0
line clock_h 142,40 142,32 c0
line clock_m 142,40 148,44 c0
rect picture_1 20,12,24,20 6 e0
rect picture_in 24,16,16,12 1
rect umbrella_stand 104,96,14,24 0 e8
line umbrella_1 108,96 106,80 c0
line umbrella_2 114,96 118,78 c0
rect plant_pot 292,98,16,18 4 e0
poly plant_a 292,98 296,78 300,98 2
poly plant_b 300,98 306,76 310,98 2
line lamp_cord 177,0 177,64 c0
dots dust 110,130 200,132 280,130 c0`,
    cycles: [
      { name: "the desk lamp", areas: ["desk_lamp_bulb", "desk_lamp_patch", "desk_lamp_wall"], colors: [14, 6], style: "flicker", ms: [700, 2200] }
    ]
  },

  // ---- ROOM SEVEN: eye level, frontal; the made bed on the left third, the window with the pink sign on the right third -----------
  pension_hab: {
    version: 1,
    shot: "Eye level, facing north, frontal, no vanishing point. Palette lamplight, flat; the window is a picture within the picture, a blue night with a pink neon sign across the road. One light: that pink sign, throwing flat magenta patches on the floor and the blanket. Subject on the left third (x about 107): the tight-made {bed} with a red blanket and a white pillow. Right third (x about 213): the {window} with the pink sign. Wall: the {scrawl} in red lipstick by the bed, a small {mirror} and the {wash-stand} with a cracked basin, jug and a {kohl pot}; left wing the {wardrobe} with its door ajar, a man's jacket at the back; right wing a chair with a folded shawl. Floor planks in bands. moves: the sign through the window (blink)",
    draw: `rect wall 0,0,320,100 mix:6,0@0.5
line wall_p1 50,0 50,100 c0
line wall_p2 110,0 110,100 c0
line wall_p3 170,0 170,100 c0
line wall_p4 230,0 230,100 c0
line wall_p5 290,0 290,100 c0
rect skirting 0,96,320,4 0
rect wall_lit_l 70,0,70,96 6
rect window_frame 180,16,66,60 0 e8
rect window_pane 186,22,54,48 1
rect window_far 186,48,54,22 0
rect sign_post 206,54,3,16 8
rect sign_board 196,34,34,18 13
rect sign_inner 200,38,26,10 5
rect sign_o 206,38,8,10 1
rect win_lit_1 190,52,6,6 11
rect win_lit_2 224,56,6,6 15
line window_bar_v 213,22 213,70 c0
line window_bar_h 186,46 240,46 c0
rect window_sill 178,74,70,4 8
poly curtain_l 176,14 190,14 188,74 176,74 5
poly curtain_r 240,14 252,14 252,74 238,74 5
line curtain_fold_l 182,14 182,74 c0
line curtain_fold_r 246,14 246,74 c0
rect curtain_rod 172,12,84,3 8
poly sign_cast_wall 186,78 240,78 252,98 174,98 5
poly sign_cast_floor 190,100 250,100 290,126 170,126 5
rect bed_head 66,48,86,34 0 e8
rect bed_head_in 72,54,74,22 6
rect bed_post_l 62,44,6,66 0
rect bed_post_r 150,44,6,66 0
ellipse bed_knob_l 65,42,4,3 14
ellipse bed_knob_r 153,42,4,3 14
rect bed_mattress 66,82,86,24 15 e0
rect bed_pillow 72,72,34,12 15 e0
line bed_pillow_ln 76,78 100,78 c7
rect bed_blanket 66,88,86,22 4
rect bed_blanket_hi 66,88,86,3 12
line bed_fold_1 80,92 80,108 c0
line bed_fold_2 108,92 108,108 c0
line bed_fold_3 136,92 136,108 c0
rect bed_patch 100,96,44,8 5
rect bed_frame 62,108,94,6 0
rect bed_leg_l 64,114,5,8 0
rect bed_leg_r 148,114,5,8 0
rect scrawl_wall 158,44,18,34 mix:6,0@0.5
line scrawl_1 160,50 170,48 172,54 c4
line scrawl_2 162,58 174,56 c4
line scrawl_3 160,64 168,62 174,66 c4
line scrawl_4 164,72 172,70 c4
rect mirror_frame 270,28,26,32 0 e8
rect mirror_glass 273,31,20,26 7
poly mirror_sheen 275,33 282,33 275,48 15
rect wash_top 262,78,44,6 6 e0
rect wash_body 264,84,40,34 mix:6,0@0.5 e0
line wash_door 284,84 284,118 c0
rect basin 270,70,26,8 7 e0
line basin_crack 280,70 284,77 c0
rect jug 298,66,8,12 7 e0
rect jug_handle 306,69,2,6 7
rect kohl_pot 262,72,6,6 8 e0
line kohl_lid 262,72 268,72 c0
rect towel 304,84,4,22 15
rect wardrobe 4,24,56,92 6 e0
rect wardrobe_dark 8,28,22,84 0
poly wardrobe_door 30,28 58,32 58,112 30,112 mix:6,0@0.5 e0
rect wardrobe_cornice 2,20,60,5 0
rect wardrobe_feet 6,116,48,4 0
poly dress_1 10,34 18,34 20,86 8,86 13
poly dress_2 20,34 26,34 28,92 18,92 11
poly jacket_man 12,40 24,40 24,76 10,76 8
line hanger_bar 8,32 30,32 c8
dots wardrobe_knob 54,70 c14
rect floor_far 0,114,320,8 6
rect floor_mid 0,122,320,14 mix:6,0@0.5
line floor_pl1 0,122 320,122 c0
line floor_pl2 40,114 30,136 c0
line floor_pl3 120,114 120,136 c0
line floor_pl4 200,114 210,136 c0
line floor_pl5 290,114 304,136 c0
rect chair_seat 196,104,26,5 6 e0
rect chair_back 196,84,4,24 6
rect chair_leg1 198,109,3,14 6
rect chair_leg2 218,109,3,14 6
poly shawl 200,98 220,98 222,108 198,108 4
line shawl_fold 206,98 208,108 c0
rect rug 70,124,76,8 5
rect rug_band 70,126,76,2 4
rect shoes_pair 160,118,16,4 4
dots dust 20,130 110,134 180,132 260,130 c0
line cord_lamp 120,0 120,12 c0
rect bulb_off 117,12,6,6 8 e0
rect nail_pic 128,20,22,16 6 e0
rect nail_pic_in 131,23,16,10 1
rect slipper_l 80,128,8,3 4
rect slipper_r 92,127,8,3 4
rect rug_fringe 60,124,3,8 7
rect rug_fringe2 150,124,3,8 7
rect plank_mark1 20,132,24,1 0
rect plank_mark2 190,130,30,1 0
rect wall_hook1 40,24,3,3 0
rect wall_hook2 280,40,3,3 0
dots dust_x 14,110 140,118 220,112 300,120 c8
rect skirting_x 0,134,320,2 0`,
    cycles: [
      { name: "the sign through the window", areas: ["sign_board"], colors: [13, 5], style: "blink", ms: 2000 }
    ]
  },

  // ---- THE LAVANDERÍA: eye level, frontal; the row of washers across the back, the big dryer on the right third --------------------
  lavanderia: {
    version: 1,
    shot: "Eye level, facing north, frontal, no vanishing point. Palette institution, flat. One light: cold white tubes on the ceiling, flat white patches on the machines' tops and the floor. Subject on the right third (x about 213): the big old {dryer} with a round glass {porthole} door and a coin slot, a long black chimney sweep's {brush} lying against the glass inside, a green stop light on its top (the picture's one green thing). Left third (x about 107): the bolted {bench} of grey slats. Back wall: a row of white {washers} with round doors; a {sign} board on the wall; left wing a washer with its door open and a laundry basket; right wing a trolley with a folded white sheet. Floor tiles in grey bands. moves: the tube (flicker)",
    draw: `rect wall 0,0,320,96 8
rect wall_hi 0,0,320,6 0
line tile_v1 0,0 0,96 c0
line tile_h1 0,24 320,24 c7
line tile_h2 0,48 320,48 c7
line tile_h3 0,72 320,72 c7
rect tile_stain1 20,26,22,18 7
rect tile_stain2 170,52,26,16 7
rect tube_fix 80,6,160,6 7 e0
rect tube_1 84,8,70,2 15
rect tube_2 166,8,70,2 15
rect tube_patch 70,96,180,3 15
line tube_chain1 90,0 90,6 c7
line tube_chain2 230,0 230,6 c7
rect sign_board 130,28,60,24 15 e0
line sign_ln1 136,34 184,34 c0
line sign_ln2 136,40 178,40 c0
line sign_ln3 136,46 170,46 c0
dots sign_pins 132,30 188,30 c0
rect washer_1 8,60,36,40 7 e0
rect washer_2 48,60,36,40 7 e0
rect washer_3 88,60,36,40 7 e0
rect washer_4 128,60,36,40 7 e0
rect washer_5 168,60,36,40 7 e0
rect washer_top_1 8,56,36,4 15
rect washer_top_2 48,56,36,4 15
rect washer_top_3 88,56,36,4 15
rect washer_top_4 128,56,36,4 15
rect washer_top_5 168,56,36,4 15
ellipse door_1 26,82,12,12 8 e0
ellipse door_2 66,82,12,12 8 e0
ellipse door_3 106,82,12,12 8 e0
ellipse door_4 146,82,12,12 8 e0
ellipse door_5 186,82,12,12 8 e0
ellipse glass_1 26,82,9,9 1
ellipse glass_2 66,82,9,9 3
ellipse glass_3 106,82,9,9 1
ellipse glass_4 146,82,9,9 3
ellipse glass_5 186,82,9,9 1
ellipse drum_1 26,82,5,5 15
ellipse drum_3 106,82,5,5 7
ellipse drum_5 186,82,5,5 15
rect washer_knob_1 14,64,6,4 0
rect washer_knob_2 54,64,6,4 0
rect washer_knob_3 94,64,6,4 0
rect washer_knob_4 134,64,6,4 0
rect washer_knob_5 174,64,6,4 0
rect washer_lit_1 8,60,3,40 15
rect washer_lit_2 48,60,3,40 15
rect washer_lit_3 88,60,3,40 15
rect washer_lit_4 128,60,3,40 15
rect washer_lit_5 168,60,3,40 15
rect dryer_body 208,32,76,70 7 e0
rect dryer_top 204,28,84,6 15 e0
rect dryer_panel 214,36,64,10 8
rect dryer_slot 218,38,18,6 0
dots dryer_buttons 244,41 252,41 260,41 268,41 c15
rect dryer_stop 270,36,6,6 2
ellipse dryer_ring 246,72,22,22 8 e0
ellipse dryer_glass 246,72,17,17 1
line cepillo_handle 238,86 256,62 c6
line cepillo_handle2 239,86 257,62 c6
poly cepillo_head 230,80 238,76 244,84 240,90 232,88 0
line dryer_hi 232,64 236,60 c15
rect dryer_lit 208,34,4,66 15
rect dryer_feet 212,102,64,4 0
rect dryer_shadow 214,104,70,3 0
rect bench_seat 76,100,70,6 7 e0
rect bench_slat1 76,102,70,2 8
rect bench_back 76,86,70,5 7 e0
rect bench_leg1 82,106,5,22 8
rect bench_leg2 136,106,5,22 8
rect bench_bolt1 82,126,5,3 0
rect bench_bolt2 136,126,5,3 0
rect basket 4,110,22,16 6 e0
line basket_ln1 4,116 26,116 c0
line basket_ln2 4,122 26,122 c0
poly basket_cloth 6,110 12,102 20,104 24,110 15
poly cloth_fold 12,102 16,110 20,104 7
rect trolley_bed 288,110,30,4 8 e0
rect trolley_sheet 290,98,26,12 15 e0
line trolley_fold 290,104 316,104 c7
line trolley_post 292,114 292,128 c8
line trolley_post2 314,114 314,128 c8
ellipse trolley_wheel1 292,130,3,2 0
ellipse trolley_wheel2 314,130,3,2 0
rect floor_far 0,106,320,10 7
rect floor_mid 0,116,320,10 8
rect floor_near 0,126,320,10 mix:8,0@0.5
line fl_1 0,116 320,116 c0
line fl_2 0,126 320,126 c0
line fl_3 60,106 52,136 c0
line fl_4 150,106 148,136 c0
line fl_5 232,106 242,136 c0
line fl_6 300,106 316,136 c0
ellipse puddle 160,122,18,3 15
line drip_a 40,108 40,126 c7
dots lint 100,124 200,132 270,122 c7
rect wall_clock 288,28,22,22 7 e0
line clock_h 299,39 299,32 c0
line clock_m 299,39 304,42 c0
rect poster_l 14,22,30,26 15 e0
rect poster_in 18,26,22,10 4
line poster_ln 18,42 38,42 c0
rect soap_dispenser 60,40,14,16 7 e0
rect soap_dispenser_c 62,46,10,6 4`,
    cycles: [
      { name: "the tube", areas: ["tube_1", "tube_2", "tube_patch"], colors: [15, 7], style: "flicker", ms: [900, 2600] }
    ],
    overlays: [{ object: "cepillo", at: [238, 88] }]
  },

  // ---- PLAZA DEL CARBÓN: wide, from the square's south edge; the dry fountain on the left third, the orange sodium lamp on the right ---
  plaza: {
    version: 1,
    shot: "Wide landscape, facing north across the square, no vanishing point; horizon low at 96. Palette neon, flat. One light: the orange {sodium lamp} (light red globe, yellow core) on the right third, its flat orange pool on the cobbles. Subject on the left third (x about 107): the dry stone {fountain}, a basin on a plinth with a dead fish for a spout, filled with flowerpots, a child's black silhouette sitting on its rim. Around it the {tenements}, three layers: a far block of blue in the middle, two near blocks in shaded blue at the wings, windows flat green, red, blue and cyan; a black chimney far off on the skyline in the middle. Sky blue with magenta low down. Cobbles in bands, magenta far to blue near. moves: the sodium lamp (flicker), a green television window (flicker), a rat crossing the cobbles now and then (travelling loop)",
    draw: `rect sky 0,0,320,26 1
rect glow 0,26,320,38 5
poly roofs_far 96,70 96,58 108,58 108,50 122,50 122,56 138,56 138,46 156,46 156,54 174,54 174,44 190,44 190,52 206,52 206,60 232,60 232,70 0
rect far_block 100,64,130,36 1
line far_course1 100,74 230,74 c0
line far_course2 100,84 230,84 c0
rect far_win1 110,66,8,6 11
rect far_win2 128,76,8,6 13
rect far_win3 150,66,8,6 15
rect far_win4 168,76,8,6 11
rect far_win5 190,66,8,6 13
rect far_win6 208,76,8,6 11
rect chimney 160,12,8,52 0
rect chimney_cap 158,10,12,3 0
rect chimney_band 160,28,8,2 8
rect near_l 0,10,98,90 mix:1,0@0.5
rect near_r 232,2,88,98 mix:1,0@0.5
line course_l1 0,28 98,28 c0
line course_l2 0,46 98,46 c0
line course_l3 0,64 98,64 c0
line course_l4 0,82 98,82 c0
line course_r1 232,20 320,20 c0
line course_r2 232,38 320,38 c0
line course_r3 232,56 320,56 c0
line course_r4 232,74 320,74 c0
rect cornice_l 0,8,98,3 8
rect cornice_r 232,0,88,3 8
rect win_l1 8,14,14,10 2
rect win_l2 32,14,14,10 8
rect win_l3 56,14,14,10 4
rect win_l4 80,14,14,10 1
rect win_l5 8,32,14,10 4
rect win_l6 32,32,14,10 11
rect win_l7 56,32,14,10 8
rect win_l8 80,32,14,10 13
rect win_l9 8,50,14,10 8
rect win_l10 32,50,14,10 4
rect win_l11 56,50,14,10 2
rect win_l12 80,50,14,10 8
rect win_l13 8,68,14,10 13
rect win_l14 32,68,14,10 8
rect win_l15 56,68,14,10 11
rect win_l16 80,68,14,10 4
rect win_r1 240,6,14,10 11
rect win_r2 264,6,14,10 8
rect win_r3 288,6,14,10 4
rect win_r4 240,24,14,10 8
rect win_r5 264,24,14,10 2
rect win_r6 288,24,14,10 13
rect win_r7 240,42,14,10 13
rect win_r8 264,42,14,10 4
rect win_r9 288,42,14,10 8
rect win_r10 240,60,14,10 4
rect win_r11 264,60,14,10 11
rect win_r12 288,60,14,10 2
rect win_r13 240,78,14,10 8
rect win_r14 264,78,14,10 13
rect win_r15 288,78,14,10 4
rect shop_l 0,86,98,16 0
rect shop_l_win 8,88,24,10 11
rect shop_l_door 44,88,14,14 13
rect shop_r 232,86,88,16 0
rect shop_r_win 244,88,30,10 15
rect shop_r_door 290,88,14,14 11
rect ground_far 0,100,320,8 5
rect ground_mid 0,108,320,14 1
rect ground_near 0,122,320,14 mix:1,0@0.5
line cobble_l1 0,108 320,108 c0
line cobble_l2 0,122 320,122 c0
rect cobble_a 20,110,16,6 8
rect cobble_b 60,112,14,6 8
rect cobble_c 140,110,16,6 8
rect cobble_d 250,112,16,6 8
rect cobble_e 40,126,18,6 mix:1,0@0.25
rect cobble_f 200,128,20,6 mix:1,0@0.25
rect plinth 88,98,36,8 7 e0
rect plinth_lit 88,98,4,8 15
rect basin 78,88,56,12 7 e0
rect basin_rim 76,84,60,5 15 e0
rect basin_in 82,88,48,4 8
rect basin_shade 120,90,14,10 8
rect stem 102,78,8,12 7 e0
poly fish 100,70 112,70 114,76 98,76 7
poly fish_tail 98,70 94,66 96,74 7
ellipse fish_eye 108,72,1,1 0
rect pot_1 84,82,8,6 6
rect pot_2 96,80,8,8 4 e0
rect pot_3 112,82,8,6 6
rect pot_4 122,80,8,8 6 e0
poly leaf_1 94,76 98,70 100,76 10
poly leaf_2 124,74 128,68 130,76 10
dots caps 86,86 100,86 114,86 126,86 c14
poly child 126,86 126,72 128,68 132,68 134,72 134,86 0
ellipse child_h 130,64,3,4 0
rect lamp_post 214,36,4,66 8
rect lamp_post_hi 214,36,1,66 7
rect lamp_base 210,96,12,6 8
rect lamp_arm 206,32,12,3 8
ellipse lamp_globe 208,32,8,7 12
ellipse lamp_core 208,32,4,3 14
line lamp_cap 202,26 214,26 c8
ellipse pool_o 214,112,42,6 12
ellipse pool_i 214,112,22,3 14
line streak_a 208,116 208,136 c12
line streak_b 40,92 40,110 c11
line streak_c 270,92 270,110 c13
ellipse puddle_a 160,126,22,3 5
ellipse puddle_b 60,130,18,3 5
poly bench 150,116 190,116 192,120 148,120 6
rect bench_leg 156,120,3,6 0
rect bench_leg2 182,120,3,6 0
poly bin 238,104 248,104 250,116 236,116 8
rect bin_lid 236,102,14,3 7
dots litter 20,132 120,128 180,130 280,130 c8
line crack_1 110,116 140,126 c0
line crack_2 230,124 262,130 c0
line wire_a 0,22 98,14 c8
line wire_b 232,10 320,16 c8`,
    cycles: [
      { name: "the sodium lamp", areas: ["lamp_core", "lamp_globe", "pool_i", "pool_o"], colors: [14, 12], style: "flicker", ms: [700, 2200] },
      { name: "the television window", areas: ["win_l1", "win_r5", "win_l11", "win_r12"], colors: [2, 10], style: "flicker", ms: [600, 1800] }
    ],
    loops: [
      { name: "the rat", style: "loop", ms: 120, path: [[-14, 111], [322, 111]], travel: 3500, pause: 25000, frames: [
        ["............", "....000000..", ".00000000000", "0.....00...0", "............"],
        ["....000000..", ".00000000000", "0....0...0.0", ".....0...0..", "............"],
        ["............", "....000000..", ".00000000000", "0......00..0", "............"],
        ["....000000..", ".00000000000", "0.....00.0.0", "......0..0..", "............"]
      ] }
    ]
  },

  // ---- THE CASA TOMADA: looking SOUTH down the hall to the patio's light; letterboxes on the left, a bicycle on the right ------------
  casa: {
    version: 1,
    shot: "Eye level, FACING SOUTH (the room text says so) down the hall, a one-point view, vp on the right third at the far end (213,58). Palette lamplight, flat; the far end is a picture within the picture, the patio's cold light, light cyan and blue. One light: a {candle} in a saucer on the first stair at the left third, with a hard-edged two-ellipse glow. Subject on the left third (x about 107): the wall of stuffed {letterboxes} with white leaflets sticking out, and the candle; second thing on the right: the {bicycle} chained to a radiator, flat tyre. Walls brown with torn {posters}, a red slogan; floor black and white tiles in bands. moves: the candle's flame and glow (flicker)",
    draw: `vp 213,58
rect far_light 190,36,46,48 11
rect far_sky 196,38,34,16 1
rect far_wall 190,54,46,30 7
line far_line 213,38 213,84 c8
rect far_step 192,80,42,6 8
poly floor_far 0,136@1 320,136@1 320,136@0.3 0,136@0.3 8
poly floor_mid 0,136@1 320,136@1 320,136@0.62 0,136@0.62 7
poly floor_near 0,136@1 320,136@1 320,136@0.86 0,136@0.86 mix:8,0@0.5
poly wall_l_far 0,-30@0.62 0,170@0.62 0,170@0.3 0,-30@0.3 6
poly wall_l_near 0,-30@1 0,170@1 0,170@0.62 0,-30@0.62 mix:6,0@0.5
poly wall_r_far 320,-30@0.62 320,170@0.62 320,170@0.3 320,-30@0.3 6
poly wall_r_near 320,-30@1 320,170@1 320,170@0.62 320,-30@0.62 mix:6,0@0.5
poly ceil 0,-30@1 320,-30@1 320,-30@0.3 0,-30@0.3 0
line wall_ln_l1 0,0@1 0,0@0.3 c0
line wall_ln_l2 0,100@1 0,100@0.3 c0
line wall_ln_r1 320,0@1 320,0@0.3 c0
line wall_ln_r2 320,100@1 320,100@0.3 c0
line tile_1 0,136@0.9 320,136@0.9 c0
line tile_2 0,136@0.74 320,136@0.74 c0
line tile_3 0,136@0.5 320,136@0.5 c0
line tile_4 0,136@0.38 320,136@0.38 c0
line tile_c1 60,136@1 60,136@0.3 c0
line tile_c2 160,136@1 160,136@0.3 c0
line tile_c3 260,136@1 260,136@0.3 c0
poly tile_blk1 20,136@1 60,136@1 60,136@0.9 20,136@0.9 0
poly tile_blk2 100,136@1 140,136@1 140,136@0.9 100,136@0.9 0
poly tile_blk3 180,136@1 220,136@1 220,136@0.9 180,136@0.9 0
poly tile_blk4 60,136@0.9 100,136@0.9 100,136@0.74 60,136@0.74 0
poly tile_blk5 140,136@0.9 180,136@0.9 180,136@0.74 140,136@0.74 0
poly tile_blk6 220,136@0.9 260,136@0.9 260,136@0.74 220,136@0.74 0
poly box_a1 0,24@0.96 0,36@0.96 0,36@0.88 0,24@0.88 8
poly box_a2 0,24@0.86 0,36@0.86 0,36@0.78 0,24@0.78 8
poly box_a3 0,24@0.76 0,36@0.76 0,36@0.69 0,24@0.69 8
poly box_a4 0,24@0.67 0,36@0.67 0,36@0.6 0,24@0.6 8
poly box_b1 0,44@0.96 0,56@0.96 0,56@0.88 0,44@0.88 8
poly box_b2 0,44@0.86 0,56@0.86 0,56@0.78 0,44@0.78 8
poly box_b3 0,44@0.76 0,56@0.76 0,56@0.69 0,44@0.69 8
poly box_b4 0,44@0.67 0,56@0.67 0,56@0.6 0,44@0.6 8
poly box_c1 0,64@0.96 0,76@0.96 0,76@0.88 0,64@0.88 8
poly box_c2 0,64@0.86 0,76@0.86 0,76@0.78 0,64@0.78 8
poly box_c3 0,64@0.76 0,76@0.76 0,76@0.69 0,64@0.69 8
poly box_c4 0,64@0.67 0,76@0.67 0,76@0.6 0,64@0.6 8
poly leaf_1 0,22@0.94 0,28@0.94 0,28@0.9 0,22@0.9 15
poly leaf_2 0,42@0.84 0,48@0.84 0,48@0.8 0,42@0.8 15
poly leaf_3 0,62@0.74 0,68@0.74 0,68@0.71 0,62@0.71 15
poly leaf_4 0,62@0.94 0,68@0.94 0,68@0.9 0,62@0.9 7
poly leaf_5 0,22@0.64 0,28@0.64 0,28@0.61 0,22@0.61 7
poly poster_r1 320,20@0.92 320,54@0.92 320,54@0.8 320,20@0.8 13
poly poster_r2 320,24@0.74 320,50@0.74 320,50@0.64 320,24@0.64 11
poly poster_r3 320,66@0.9 320,86@0.9 320,86@0.78 320,66@0.78 15
poly slogan_r 320,58@0.6 320,66@0.6 320,66@0.44 320,58@0.44 4
poly slogan_l 0,84@0.58 0,92@0.58 0,92@0.42 0,84@0.42 4
rect stair_riser 82,112,44,10 6 e0
rect stair_tread 78,108,52,6 7 e0
rect stair_riser2 90,100,36,8 6
rect saucer 98,102,16,3 15
rect candle_stub 104,94,5,8 15
ellipse candle_glow_o 106,86,22,16 6
ellipse candle_glow_i 106,88,12,9 14
ellipse candle_flame 106,89,3,4 12
ellipse candle_core 106,90,1,2 15
ellipse candle_pool 108,116,36,5 14
poly stair_post 74,92 78,92 78,116 74,116 0
rect radiator 262,86,24,30 8 e0
line rad_fin1 266,88 266,114 c0
line rad_fin2 272,88 272,114 c0
line rad_fin3 278,88 278,114 c0
line rad_fin4 284,88 284,114 c0
rect rad_pipe 258,112,32,3 7
ellipse bike_wheel_b 240,118,18,18 0
ellipse bike_wheel_b_in 240,118,15,15 8
ellipse bike_hub_b 240,118,3,3 7
ellipse bike_wheel_f 292,122,12,14 0
ellipse bike_wheel_f_in 292,122,9,11 8
ellipse bike_hub_f 292,122,2,2 7
poly bike_tyre_flat 280,130 304,130 306,136 278,136 0
line bike_frame_1 240,118 262,96 c7
line bike_frame_2 262,96 282,118 c7
line bike_frame_3 240,118 282,118 c7
line bike_frame_4 262,96 262,90 c7
line bike_bars 256,90 270,90 c7
line bike_fork 282,118 292,122 c7
rect bike_saddle 232,100,14,3 0
line bike_seat_post 239,103 240,118 c7
line bike_chain 262,86 274,114 c0
rect bike_lock 258,106,8,6 4 e0
line lock_chain 264,112 262,116 c14
rect mat 40,124,40,4 4
rect mat_hi 40,124,40,1 12
rect clock_dead 148,20,16,16 7 e0
line clock_dead_h 156,28 156,24 c0
line clock_dead_m 156,28 160,30 c0
rect boot 150,118,12,6 0
rect boot_2 164,120,10,5 0
dots litter 150,132 220,128 20,132 c7
line crack_1 190,134 208,126 c0
line crack_2 30,134 56,128 c0
rect bell_pull 196,60,3,12 14
rect drain 40,126,12,5 0
rect drain_bar1 42,126,1,5 8
rect drain_bar2 46,126,1,5 8
rect drain_bar3 50,126,1,5 8
rect bottle 8,126,3,7 2
rect bottle_neck 9,124,1,2 2
dots litter_x 20,118 60,134 100,128 180,134 c8
line crack_1_x 60,120 90,128 c0
line crack_2_x 150,116 170,126 c0
rect door_handle 218,64,2,4 14
rect door_sill 196,86,40,2 8`,
    cycles: [
      { name: "the candle", areas: ["candle_glow_i", "candle_pool", "candle_glow_o"], colors: [14, 6], style: "flicker", ms: [700, 2200] },
      { name: "the candle's flame", areas: ["candle_flame"], colors: [12, 6], style: "flicker", ms: [500, 1600] }
    ]
  },

  // ---- THE PATIO: from the courtyard floor, facing north; sheets on their lines on the left third, the iron ladder on the right third -----
  patio: {
    version: 1,
    shot: "Looking up from the courtyard floor, at the foot of the north wall, facing north; a tall narrow frame with a square of sky at the top. Palette moonlight, flat. One light: a low white moon out of frame; candle-lit windows (small yellow) on every floor. Subject on the right third (x about 213): the iron {ladder} bolted to the back wall with black rails and rungs, going up to the roof edge. Left third (x about 107): the {washing}, white and pale blue sheets and shirts on two lines, one very large pair of trousers. The walls are painted sky blue, patchy (blue and light blue) with black rain streaks; side walls shaded; a square of night {sky} with white stars; flagstones in bands from light blue far to blue near, cracked, with a chalk hopscotch. moves: the stars (pingpong), the candle windows (flicker)",
    draw: `rect sky 96,0,128,26 1
rect sky_low 96,18,128,8 9
poly roof_l 0,0 96,0 96,10 70,16 0,22 0
poly roof_r 224,0 320,0 320,22 250,16 224,10 0
rect back_wall 80,26,160,74 1
rect wall_patch1 92,30,40,24 9
rect wall_patch2 170,56,50,26 9
rect wall_patch3 108,70,26,20 9
rect wall_stain1 150,28,6,40 8
rect wall_stain2 100,56,5,36 8
rect wall_stain3 226,32,5,60 8
line wall_course1 80,40 240,40 c8
line wall_course2 80,60 240,60 c8
line wall_course3 80,80 240,80 c8
rect side_l 0,22,82,80 mix:1,0@0.5
rect side_r 238,22,82,80 mix:1,0@0.5
line side_l_edge 82,22 82,102 c9
line side_r_edge 238,22 238,102 c9
rect win_b1 92,32,10,12 14
rect win_b2 124,32,10,12 8
rect win_b3 152,32,10,12 14
rect win_b4 184,32,10,12 8
rect win_b5 224,32,10,12 14
rect win_b6 92,62,10,12 8
rect win_b7 124,62,10,12 14
rect win_b8 152,62,10,12 14
rect win_b9 184,62,10,12 8
rect win_b10 224,62,10,12 8
rect win_l1 10,36,12,14 14
rect win_l2 34,36,12,14 8
rect win_l3 58,36,12,14 8
rect win_l4 10,60,12,14 8
rect win_l5 34,60,12,14 14
rect win_l6 58,60,12,14 14
rect win_r1 250,36,12,14 8
rect win_r2 274,36,12,14 14
rect win_r3 298,36,12,14 8
rect win_r4 250,60,12,14 14
rect win_r5 274,60,12,14 8
rect win_r6 298,60,12,14 14
line win_bar_b1 97,32 97,44 c0
line win_bar_b3 157,32 157,44 c0
line win_bar_b5 229,32 229,44 c0
rect sill_1 90,44,14,2 0
rect sill_2 150,44,14,2 0
rect sill_3 182,74,14,2 0
rect sill_4 122,74,14,2 0
rect flower_box 150,74,16,4 6
rect rail_l 210,22,3,80 0
rect rail_r 224,22,3,80 0
rect rung_1 213,28,11,2 0
rect rung_2 213,36,11,2 0
rect rung_3 213,44,11,2 0
rect rung_4 213,52,11,2 0
rect rung_5 213,60,11,2 0
rect rung_6 213,68,11,2 0
rect rung_7 213,76,11,2 0
rect rung_8 213,84,11,2 0
rect rung_9 213,92,11,2 0
rect bolt_1 208,40,7,3 8
rect bolt_2 222,66,7,3 8
rect ladder_top 206,20,24,3 0
line wash_line1 4,44 100,52 c0
line wash_line2 20,70 130,78 c0
line wash_line3 238,50 316,58 c0
poly sheet_1 20,44 44,46 44,70 20,66 15
poly sheet_2 54,48 76,50 76,68 54,66 11
poly shirt_1 82,50 96,52 94,64 84,62 9
poly trousers_a 30,72 50,74 52,100 44,100 40,84 36,100 28,100 7
poly trousers_b 50,74 66,76 66,100 60,100 56,86 54,100 52,100 7
poly towel_1 100,76 112,78 112,92 100,90 15
poly sheet_3 244,52 262,54 260,76 244,74 15
poly shirt_2 270,56 286,58 284,70 272,68 11
dots pegs 22,45 40,46 56,49 72,50 84,51 32,72 104,77 246,53 262,55 272,57 c4
rect floor_far 0,102,320,10 9
rect floor_mid 0,112,320,12 1
rect floor_near 0,124,320,12 mix:1,0@0.5
line flag_1 0,112 320,112 c0
line flag_2 0,124 320,124 c0
line flag_3 80,102 66,136 c0
line flag_4 170,102 174,136 c0
line flag_5 270,102 290,136 c0
rect flag_moss1 30,114,20,4 8
rect flag_moss2 220,118,26,4 8
poly crack_1 140,114 150,120 146,124 156,130 8
line hop_1 100,116 124,116 c15
line hop_2 100,126 124,126 c15
line hop_3 100,116 100,126 c15
line hop_4 124,116 124,126 c15
line hop_5 106,126 106,134 c15
line hop_6 118,126 118,134 c15
line hop_7 106,134 118,134 c15
rect bucket 280,116,12,10 8 e0
rect bucket_h 282,112,8,2 8
rect barrel 8,108,20,22 6 e0
line barrel_h1 8,114 28,114 c0
line barrel_h2 8,124 28,124 c0
rect crate 40,122,24,10 6 e0
line crate_pl 40,127 64,127 c0
dots stars_a 104,4 112,12 124,8 136,16 148,6 160,12 172,4 184,16 196,8 208,12 c15
dots stars_b 118,20 142,10 166,18 190,6 214,18 c11
rect moon_patch 150,24,24,4 11
dots litter 90,132 150,130 230,134 c8`,
    cycles: [
      { name: "the stars", areas: ["stars_a"], colors: [15, 9], style: "pingpong", ms: 2400 },
      { name: "the candle windows", areas: ["win_b1", "win_b3", "win_b5", "win_b7", "win_b8", "win_l1", "win_l5", "win_l6", "win_r2", "win_r4", "win_r6"], colors: [14, 6], style: "flicker", ms: [700, 2200] }
    ]
  },

  // ---- THE ROOF: wide at roof level, facing north; Tomás sitting against a chimney pot on the left third, the row of pots, the city's colour below ---
  azotea: {
    version: 1,
    shot: "Eye level at the roof ridge, facing north, wide, no vanishing point; horizon low at 100. Palette moonlight, flat. One light: a low white moon disc on the right, its light on the tar (blue) only. Subject on the left third (x about 107): {Tomás} the chimney sweep sitting on the ridge against the first pot, a black silhouette in a tall top hat, only the whites of his eyes showing. A row of eleven {chimney pots} as black silhouettes along the ridge to the right, with their {aerials} as black lines; far off on the right a very tall black chimney. Beyond the ridge the {city} below: black blocks with lit windows in light magenta, cyan, white and yellow, and one pink neon glow. Sky blue with light blue low down, white stars; tar in two flat bands, blue far to shaded blue near, with patches. moves: the stars (pingpong), the city's windows (flicker)",
    draw: `rect sky 0,0,320,62 1
rect sky_low 0,62,320,22 9
ellipse moon 258,24,9,9 15
dots stars_a 14,6 40,16 66,8 92,20 118,6 146,14 174,6 202,18 230,8 292,10 310,22 c15
dots stars_b 28,26 80,30 134,26 190,30 244,6 c11
poly city_far 0,84 0,76 14,76 14,68 30,68 30,74 48,74 48,64 64,64 64,72 84,72 84,66 100,66 100,76 120,76 120,70 138,70 138,78 160,78 160,66 178,66 178,74 196,74 196,68 214,68 214,76 236,76 236,70 254,70 254,78 276,78 276,66 296,66 296,74 320,74 320,84 8
rect tower_far 284,40,6,36 0
rect tower_far_cap 282,38,10,3 0
rect tower_far_band 284,52,6,2 8
poly city_near 0,100 0,86 16,86 16,80 36,80 36,88 58,88 58,82 80,82 80,90 104,90 104,84 126,84 126,92 150,92 150,86 174,86 174,94 200,94 200,88 226,88 226,96 250,96 250,90 276,90 276,98 320,98 320,100 1
rect cwin_1 18,70,3,3 13
rect cwin_2 34,70,3,3 11
rect cwin_3 50,66,3,3 15
rect cwin_4 70,74,3,3 14
rect cwin_5 88,68,3,3 13
rect cwin_6 104,78,3,3 11
rect cwin_7 142,72,3,3 15
rect cwin_8 164,68,3,3 13
rect cwin_9 184,76,3,3 14
rect cwin_10 202,70,3,3 11
rect cwin_11 242,72,3,3 13
rect cwin_12 262,80,3,3 15
rect cwin_13 20,88,3,3 11
rect cwin_14 62,84,3,3 14
rect cwin_15 98,92,3,3 13
rect cwin_16 154,88,3,3 11
rect cwin_17 210,90,3,3 15
rect cwin_18 252,92,3,3 13
rect neon_glow 118,60,24,10 5
rect neon_bar1 122,63,16,2 13
rect neon_bar2 122,67,10,2 13
line aerial_1 126,70 126,50 c0
line aerial_1a 118,56 134,56 c0
line aerial_1b 120,62 132,62 c0
line aerial_2 196,70 196,46 c0
line aerial_2a 188,52 204,52 c0
line aerial_2b 190,58 202,58 c0
line aerial_3 250,70 250,54 c0
line aerial_3a 244,58 256,58 c0
rect roof_far 0,100,320,12 9
rect roof_near 0,112,320,24 1
poly ridge 0,104 320,98 320,106 0,112 8
poly ridge_lit 0,106 320,100 320,102 0,108 15
line tar_seam1 0,120 320,116 c0
line tar_seam2 0,128 320,124 c0
rect tar_patch1 30,116,34,6 0
rect tar_patch2 130,124,40,6 0
rect tar_patch3 240,118,36,6 0
rect pot_1 130,70,18,30 0
rect pot_1_cap 128,66,22,5 0
rect pot_2 156,64,16,36 0
rect pot_2_cap 154,60,20,5 0
rect pot_3 180,72,18,28 0
rect pot_3_cap 178,68,22,5 0
rect pot_4 206,66,16,34 0
rect pot_4_cap 204,62,20,5 0
rect pot_5 232,74,18,26 0
rect pot_5_cap 230,70,22,5 0
rect pot_6 258,68,16,32 0
rect pot_6_cap 256,64,20,5 0
rect pot_7 284,76,16,24 0
rect pot_7_cap 282,72,20,5 0
rect pot_8 304,72,14,28 0
rect pot_8_cap 302,68,18,5 0
line pot_1_edge 130,70 130,100 c9
line pot_4_edge 206,66 206,100 c9
line pot_6_edge 258,68 258,100 c9
rect pot_far_1 110,82,8,18 0
rect pot_far_2 96,86,8,14 0
rect pot_base 126,98,196,4 0
poly t_body 84,104 84,84 88,76 100,74 108,78 110,104 0
poly t_knees 100,104 104,92 116,88 124,92 124,104 0
poly t_leg_front 106,104 110,94 122,92 126,104 0
rect t_boot 118,102,12,4 0
ellipse t_head 96,68,5,6 0
rect t_hat 90,48,12,18 0
rect t_hat_brim 86,64,20,3 0
rect t_hat_band 90,60,12,2 8
poly t_arm 100,80 112,90 108,96 96,86 0
dots t_eyes 94,68 98,68 c15
line t_collar 92,74 100,74 c8
line t_pole_rest 80,104 76,70 c0
rect smoke_a 140,50,3,4 9
rect smoke_b 164,44,3,4 9
rect smoke_c 214,48,3,4 9
line pigeon_1 60,98 66,92 70,98 c0
rect pigeon_body 62,94,8,5 0
dots litter 10,124 60,132 120,134 200,132 290,130 c8
line crack 60,132 90,126 c0
rect bucket 8,106,14,12 0
rect bucket_lit 8,106,2,12 9
rect pot_1_flue 134,70,8,2 8
rect pot_2_flue 160,64,8,2 8
rect pot_3_flue 184,72,8,2 8
rect pot_4_flue 208,66,8,2 8
rect pot_5_flue 236,74,8,2 8
rect pot_6_flue 262,68,8,2 8
rect pot_7_flue 288,76,8,2 8
rect pot_8_flue 306,72,8,2 8
rect roof_edge_wall 0,134,320,2 8
line tar_seam3 0,134 320,130 c8
rect gutter 0,108,320,1 8
rect brick_loose 200,126,10,4 6
rect brick_loose2 214,128,8,3 6
rect hat_shine 90,48,2,16 8
rect pole_tip 74,68,5,3 8`,
    cycles: [
      { name: "the stars", areas: ["stars_a"], colors: [15, 9], style: "pingpong", ms: 2400 },
      { name: "the city windows", areas: ["cwin_1", "cwin_2", "cwin_3", "cwin_4", "cwin_5", "cwin_13", "cwin_14", "cwin_18"], colors: [13, 11, 15, 14], style: "flicker", scatter: true, ms: [1500, 5000] }
    ]
  },

  // ---- THE CUTTING: rails converging east to the works on the right third; a goods wagon on the left third ---------------------------
  terraplen: {
    version: 1,
    shot: "Eye level on the ballast between the rails, facing east, wide, one vanishing point at the far end of the rails (x 228, y 80). Palette moonlight, flat. One light: a low yellow moon in the left sky, its light on the rails and the wagon roof only; one red signal lamp. Subject on the right third (x about 213): the black {works} hall at the end of the line with the great chimney rising out of it, a smoke cloud on top. Left third (x about 107): the goods {wagon} on its siding, slide painted over with slogans in white. Between them the two rusted {rails} running to the works over {sleepers} on grey ballast in bands; embankments on both sides in shaded blue and black; a red {signal lamp} on a post at the right foot. Night sky blue, light blue near the horizon, white stars, the moon wrapped in smoke. moves: the signal lamp (blink), the stars (pingpong)",
    draw: `rect sky 0,0,320,48 1
rect sky_low 0,48,320,32 9
ellipse moon 50,20,11,11 14
ellipse moon_veil 50,24,15,5 8
dots stars_a 12,8 90,6 130,18 166,8 200,22 252,10 290,6 308,20 c15
dots stars_b 28,30 110,10 150,32 230,30 274,34 c11
rect hills_far 0,70,320,16 8
poly hills_l 0,86 0,66 40,62 80,72 120,76 140,86 0
poly hills_r 320,86 320,60 288,64 250,72 200,80 190,86 0
rect works_hall 188,56,92,36 0
poly works_roof 184,56 192,46 276,46 284,56 0
rect works_door 220,72,24,20 8
rect works_door_in 224,76,16,16 0
rect works_win1 196,62,8,6 14
rect works_win2 252,62,8,6 14
rect works_win3 266,62,6,6 14
rect works_vent 200,40,10,8 0
rect chim 238,2,14,50 0
rect chim_cap 235,0,20,4 8
rect chim_band1 238,18,14,3 8
rect chim_band2 238,34,14,3 8
line chim_edge 238,4 238,52 c9
poly cloud_a 224,10 232,4 246,6 262,2 276,8 270,18 250,20 232,18 8
poly cloud_b 240,24 252,20 270,22 282,28 262,32 246,30 7
rect ground_far 0,86,320,10 mix:1,0@0.5
poly bank_l 0,96 0,136 90,136 70,112 40,100 0
poly bank_r 320,96 320,136 244,136 252,112 258,100 0
poly bank_l_top 0,96 40,100 70,112 90,136 60,136 20,106 0,100 0
poly bank_r_top 320,96 258,100 252,112 244,136 270,136 290,108 320,102 0
poly ballast_far 150,86 230,84 252,96 120,96 8
poly ballast_mid 120,96 252,96 266,112 96,112 7
poly ballast_near 96,112 266,112 290,136 70,136 8
poly rail_a_far 226,86 228,86 140,136 124,136 0
poly rail_b_far 232,86 234,86 250,136 236,136 0
poly rail_a_hi 226,86 227,86 133,136 129,136 9
poly rail_b_hi 232,86 233,86 244,136 240,136 9
poly sleep_1 214,87 250,87 252,89 212,89 0
poly sleep_2 204,90 262,90 266,93 200,93 0
poly sleep_3 190,95 276,95 282,99 182,99 0
poly sleep_4 170,102 296,102 306,108 156,108 0
poly sleep_5 140,111 316,111 330,120 114,120 0
poly sleep_6 90,124 320,124 330,136 60,136 0
rect post 276,48,4,44 0
rect lamp_box 272,44,12,10 0
ellipse lamp_red 278,49,3,3 4
rect lamp_hood 270,42,16,3 8
rect wagon_body 6,54,134,34 6
rect wagon_roof 2,50,142,5 0
rect wagon_floor 4,86,138,5 0
rect wagon_slide 42,58,54,26 0
rect wagon_slide_in 46,62,46,18 6
rect wagon_rib1 20,56,2,32 0
rect wagon_rib2 120,56,2,32 0
line wagon_plank1 6,64 140,64 c0
line wagon_plank2 6,74 140,74 c0
rect slogan_1 50,66,6,3 15
rect slogan_2 58,66,10,3 15
rect slogan_3 70,66,8,3 15
rect slogan_4 52,72,12,3 15
rect slogan_5 68,72,8,3 15
rect old_paint 100,60,16,4 14
rect old_paint2 100,68,16,3 14
rect wheel_l 18,88,24,8 0
rect wheel_r 100,88,24,8 0
ellipse wheel_l_disc 30,92,11,5 8
ellipse wheel_r_disc 112,92,11,5 8
rect buffer 144,72,6,10 0
rect buffer_stem 138,76,8,3 8
rect siding_rail 0,98,150,3 0
rect siding_rail_hi 0,98,150,1 9
rect siding_sleep1 10,100,10,5 0
rect siding_sleep2 50,100,10,5 0
rect siding_sleep3 90,100,10,5 0
rect siding_sleep4 128,100,10,5 0
dots weeds 12,108 34,116 60,106 150,110 200,126 270,122 300,118 c2
dots litter 70,128 108,132 280,134 c15
rect book 150,124,12,8 15
rect book_spine 150,124,2,8 4
line crack_a 12,120 40,126 c0
rect puddle 188,118,36,6 9
rect puddle_hi 192,119,12,2 15
rect fence 0,84,40,3 0
line fence_post1 8,84 8,94 c0
line fence_post2 30,84 30,94 c0
rect shadow_wagon 4,96,150,6 0
rect works_hall_band 188,70,92,2 8
rect works_win4 206,62,8,6 14
rect works_door_bar 231,76,2,16 0
rect works_gutter 184,56,100,2 8
rect wagon_door_l 24,58,2,28 8
rect wagon_door_r 112,58,2,28 8
rect wagon_handle 92,70,4,2 7
rect wagon_number 8,58,10,4 15
rect wagon_number2 8,66,10,2 15
rect wagon_lamp 126,58,5,5 8
rect rail_bolt1 40,98,3,2 7
rect rail_bolt2 70,98,3,2 7
rect rail_bolt3 100,98,3,2 7
rect tin 210,128,6,6 7
rect tin_rim 210,128,6,1 15
rect post_arm 266,52,16,2 0
rect post_arm_lens 268,50,4,3 8
rect sign_slogan 10,40,24,12 0
rect sign_slogan_t 13,44,18,2 15`,
    cycles: [
      { name: "the stars", areas: ["stars_a"], colors: [15, 9], style: "pingpong", ms: 2400 },
      { name: "the signal lamp", areas: ["lamp_red"], colors: [4, 0], style: "blink", ms: 1600 }
    ]
  },

  // ---- THE WORKS: a cathedral of brick lit by one furnace; the great chimney in the middle of the floor on the right third ----------
  fabrica: {
    version: 1,
    shot: "Eye level on the ash floor at the west door, facing east, one-point view, vp on the right third (213,60). Palette ember. One light: the furnace mouth at the far left, red-orange, lighting the ash and the foot of the presses. Subject on the right third (x about 213): the great chimney standing in the middle of the floor, a huge black column with soot-grey bands rising through a round hole in the roof into a cloud, scorched in the shape of a hand on the wall behind. Left third (x about 107): the {furnace} brick arch with its red eye, and the {presses}, two iron rollers as tall as a man, inked grey, with belts. Between the presses and the chimney (x about 178): {Marga}, a girl of nineteen sitting at a makeshift drum kit of a floor tom and a bucket, a black ragged bob, a torn light grey T-shirt, bare arms lit light red, sticks in her hands. The hall walls are dark brick (black and brown in bands), high; the roof beams black; {ash} on the floor in bands from red-lit near the furnace to black at the right; the sky through the roof hole dark grey with a grey cloud. moves: the furnace (flicker), the embers (flicker)",
    draw: `vp 213,60
rect wall_top 0,0,320,40 0
rect wall_mid 0,40,320,36 mix:6,0@0.5
rect wall_low 0,76,320,24 6
poly beam_1 0,12 320,12 320,18 0,18 8
poly beam_2 0,28 320,28 320,32 0,32 8
rect brick_1 0,40,320,2 0
rect brick_2 0,52,320,2 0
rect brick_3 0,64,320,2 0
rect brick_4 0,76,320,2 0
rect brick_5 0,88,320,2 0
rect hole 176,0,76,16 8
rect hole_cloud 188,2,52,9 7
rect hole_cloud2 200,8,32,5 8
rect hand_palm 262,52,26,22 0
rect hand_f1 262,36,4,18 0
rect hand_f2 268,32,4,22 0
rect hand_f3 274,34,4,20 0
rect hand_f4 280,38,4,16 0
rect hand_th 252,56,12,5 0
rect window_a 20,22,10,14 0
rect window_a_in 22,24,6,10 8
rect window_b 60,22,10,14 0
rect window_b_in 62,24,6,10 8
rect window_c 290,22,10,14 0
rect window_c_in 292,24,6,10 8
rect floor 0,100,320,36 0
poly ash_far 0,100 320,100 320,108 0,108 6
poly ash_mid 0,108 320,108 320,120 0,120 mix:6,0@0.5
poly ash_near 0,120 320,120 320,136 0,136 0
poly ash_glow_far 0,100 120,100 140,108 0,108 4
poly ash_glow_mid 0,108 150,108 190,120 0,120 mix:4,0@0.5
poly ash_glow_near 0,120 160,120 210,136 0,136 mix:4,0@0.25
rect furnace_body 0,60,64,42 6
rect furnace_top 0,52,70,10 0
rect furnace_base 0,98,70,6 0
rect furnace_arch 12,72,38,30 0
ellipse furnace_arch_top 31,72,19,10 0
rect furnace_mouth 18,78,26,24 4
ellipse furnace_mouth_top 31,78,13,8 4
rect furnace_core 22,86,18,16 12
rect furnace_heart 26,92,10,10 14
rect furnace_grate 16,96,30,2 0
rect furnace_bar1 24,84,2,18 0
rect furnace_bar2 34,84,2,18 0
rect furnace_pipe 50,0,10,52 0
rect furnace_pipe_edge 50,0,2,52 8
rect press_1_body 84,56,24,48 0
rect press_1_head 80,48,32,10 8
rect press_1_roll 88,64,16,32 8
rect press_1_ink 88,64,16,6 7
rect press_1_band 84,96,24,4 6
rect press_2_body 124,62,22,42 0
rect press_2_head 120,56,30,8 8
rect press_2_roll 128,70,14,26 8
rect press_2_ink 128,70,14,5 7
rect belt_a 108,64,16,2 0
rect belt_b 108,72,16,2 0
rect belt_c 110,82,14,2 0
line belt_line 110,60 124,60 c0
rect wheel_1 96,50,6,6 14
rect wheel_2 134,56,6,6 14
rect chim_shadow 224,100,52,6 0
rect chim_base 200,96,58,10 0
rect chim_base_top 204,92,50,5 8
rect chim_col 208,0,42,92 0
rect chim_band_1 208,16,42,4 8
rect chim_band_2 208,36,42,4 8
rect chim_band_3 208,56,42,4 8
rect chim_band_4 208,76,42,4 8
rect chim_lit 208,0,5,92 6
rect chim_lit_2 208,40,5,52 4
rect chim_door 222,70,14,22 8
rect chim_door_in 225,74,8,18 0
rect chim_rung_1 214,10,4,2 8
rect chim_rung_2 214,24,4,2 8
rect chim_rung_3 214,46,4,2 8
rect chim_rung_4 214,64,4,2 8
rect soot_stripe_1 232,0,3,92 8
rect soot_stripe_2 242,0,2,92 8
ellipse ash_heap_1 160,114,18,5 8
ellipse ash_heap_2 96,122,22,5 mix:6,0@0.5
ellipse ash_heap_3 280,120,24,5 6
ellipse ash_heap_4 300,128,18,4 0
rect shoe_print_1 70,126,6,3 0
rect shoe_print_2 86,130,6,3 0
rect shoe_print_3 108,128,6,3 0
rect ember_1 150,118,3,2 12
rect ember_2 168,124,3,2 12
rect ember_3 120,120,3,2 14
rect ember_4 190,128,3,2 4
rect ember_5 70,114,3,2 12
rect ember_6 100,134,3,2 14
dots cinders 4,110 56,114 180,106 240,118 268,130 310,112 c8
rect sheet_1 130,126,12,6 15
rect sheet_1_text 132,128,8,1 8
rect sheet_2 252,126,14,5 7
rect sheet_2_text 254,128,10,1 8
rect sheet_3 270,112,10,4 7
line pipe_floor 150,100 150,106 c0
rect kit_stool 170,86,18,14 6 e0
poly marga_legs 170,76 186,76 190,92 186,92 182,84 176,92 170,92 8
poly marga_torso 170,56 186,56 188,76 168,76 7
poly marga_torso_sh 182,56 186,56 188,76 182,76 8
poly marga_arm_l 170,58 162,72 166,76 173,62 12
poly marga_arm_l_sh 166,70 162,72 166,76 168,72 4
poly marga_arm_r 186,58 196,70 192,74 184,62 12
poly marga_arm_r_sh 192,70 196,70 192,74 190,72 4
line marga_stick_l 162,72 156,82 c14
line marga_stick_r 196,70 199,80 c14
ellipse marga_head 178,49,6,7 12
ellipse marga_hair 178,43,8,5 0
poly marga_hair_fall 170,44 168,58 173,54 174,46 0
dots marga_eyes 175,49 181,49 c0
rect kit_drum_a 154,82,16,14 7 e0
ellipse kit_drum_a_head 162,82,8,2 15
line kit_drum_a_tape 154,89 170,89 c14
rect kit_bucket 184,84,14,14 6 e0
rect kit_bucket_rim 183,83,16,2 14
rect lamp_hook 300,32,2,14 0
rect lamp_body 296,44,10,8 8`,
    cycles: [
      { name: "the furnace", areas: ["furnace_core", "furnace_heart"], colors: [12, 4, 14], style: "flicker", ms: [400, 1100] },
      { name: "the embers", areas: ["ember_1", "ember_2", "ember_3", "ember_4", "ember_5", "ember_6"], colors: [12, 4, 6], style: "flicker", scatter: true, ms: [600, 2200] }
    ]
  },
};

// ---- Endings ---------------------------------------------------------------------------------------------------------------------
export const endings = {
  // CROWNED: the Avenida at night, the figure on a crate in a gold paper crown, black silhouettes round it against two big lit panels.
  crowned: {
    version: 1,
    shot: "Eye level at the far kerb, facing the strip, frontal, no vanishing point, few big shapes. Palette neon, at its boldest, flat. One light: two big lit sign walls, a light magenta one behind the figure and a light cyan one on the right, each with two tubes. Subject on the left third (x about 107): the small {emperor} standing on a wooden {crate} on the wet road, a black silhouette with no face colour, both arms up in a V, a gold paper {crown} the one yellow thing on him. Round the crate a ring of {silhouettes}, black masses with heads at different heights and a few raised arms, one holding a green bottle, merging into one black band at the bottom. Night sky blue with a magenta glow low down, three black far blocks with lit windows; the road magenta far to blue near with cyan and magenta streaks and puddles. moves: the sign tubes (flicker), the crown's glint (pingpong)",
    draw: `rect sky 0,0,320,34 1
rect glow 0,34,320,26 5
rect far_a 150,30,26,34 0
rect far_b 262,24,20,40 0
rect far_c 0,40,30,24 0
rect far_win1 156,38,4,4 14
rect far_win2 164,48,4,4 11
rect far_win3 266,32,4,4 13
rect far_win4 266,46,4,4 14
rect panel_l_frame 36,24,148,72 0
rect panel_l 40,28,140,64 13
rect panel_l_band1 40,60,140,10 5
rect panel_l_band2 40,78,140,14 5
line tube_l_a 46,32 174,32 c11
line tube_l_b 46,35 174,35 c11
rect panel_r_frame 206,30,100,66 0
rect panel_r 210,34,92,58 11
rect panel_r_band 210,66,92,26 3
line tube_r_a 216,40 296,40 c13
line tube_r_b 216,43 296,43 c13
rect road_far 0,96,320,14 5
rect road_mid 0,110,320,14 1
rect road_near 0,124,320,12 mix:1,0@0.5
line kerb_a 0,96 320,96 c8
line kerb_b 0,110 320,110 c0
ellipse puddle_a 60,116,30,4 11
ellipse puddle_b 220,118,34,4 13
ellipse puddle_c 150,130,24,3 11
rect puddle_hi_a 52,115,12,2 15
rect puddle_hi_b 212,117,14,2 15
line streak_a 70,104 72,136 c13
line streak_b 150,102 148,136 c11
line streak_c 240,104 244,136 c13
rect pole_l 186,40,3,58 8
rect pole_r 304,36,3,62 8
rect crate_top 84,100,46,6 6
rect crate_front 84,106,46,16 6
rect crate_plank1 84,112,46,2 0
rect crate_plank2 84,118,46,2 0
rect crate_shadow 80,122,56,4 0
poly fig_legs 98,100 100,82 116,82 118,100 112,100 108,88 104,100 0
poly fig_torso 92,64 124,64 120,82 96,82 0
poly fig_arm_l 92,64 84,50 80,36 86,34 92,48 98,62 0
poly fig_arm_r 124,64 132,50 136,36 130,34 124,48 118,62 0
ellipse fig_hand_l 83,34,3,3 0
ellipse fig_hand_r 133,34,3,3 0
ellipse fig_head 108,56,6,7 0
rect crown_band 101,45,14,4 14
poly crown_points 101,45 103,37 106,43 108,35 111,43 113,37 115,45 14
rect crown_glint 107,39,2,2 15
poly mass_l 0,120 0,96 10,88 22,86 30,92 44,92 56,98 70,104 80,120 0
ellipse head_l1 16,80,6,7 0
ellipse head_l2 40,84,6,7 0
poly arm_l_up 52,98 56,78 60,76 60,80 58,100 0
ellipse hand_l_up 58,75,3,3 0
poly mass_r 136,120 136,104 150,98 160,92 174,92 184,86 198,88 212,94 230,90 246,86 262,90 280,86 300,84 320,90 320,120 0
ellipse head_r1 166,86,6,7 0
ellipse head_r2 190,80,6,7 0
ellipse head_r3 254,80,6,7 0
ellipse head_r4 290,78,6,7 0
poly arm_r_up1 222,92 224,70 228,68 228,72 227,94 0
ellipse hand_r_up1 226,67,3,3 0
poly arm_r_up2 270,88 274,68 278,68 276,90 0
ellipse hand_r_up2 276,67,3,3 0
rect bottle 274,56,4,9 10
rect bottle_neck 275,52,2,4 10
ellipse head_nl 14,122,9,10 0
poly sho_nl 0,136 0,128 8,122 22,122 32,128 38,136 0
ellipse head_nr 304,124,10,11 0
poly sho_nr 276,136 280,128 290,122 316,122 320,128 320,136 0
dots confetti 70,30 90,44 150,54 170,40 196,70 300,64 c14
dots confetti_b 60,52 124,34 140,62 c15`,
    cycles: [
      { name: "the sign tubes", areas: ["tube_l_a", "tube_l_b", "tube_r_a", "tube_r_b"], colors: [11, 3, 13, 5], style: "flicker", scatter: true, ms: [800, 3200] },
      { name: "the crown's glint", areas: ["crown_glint"], colors: [15, 14], style: "pingpong", ms: 1100 }
    ]
  },

  // NAMED: a bus stop at grey dawn, the night bus with its windows lit yellow, a small figure with a plain suitcase at the step.
  named: {
    version: 1,
    shot: "Eye level at the kerb, facing north across the road, no vanishing point, a wide flat view. Palette institution, grey and pale, at its boldest. One light: the night {bus} in the middle third with every window lit yellow, its lamps warm on the kerb. Subject on the left third (x about 107): a small {traveller} in a plain grey coat with a short fair haircut and a brown {suitcase} at the bus step, back to us, one foot on the step. Right third (x about 213): the {bus stop} post and its pale sign, a bench with a litter bin. Behind them the grey {city}: blocks in light grey and grey in bands with a few lit windows and the pale dawn at the horizon, light grey to white to yellow low down. Pavement in bands of light grey and white with cracks; road black grey. moves: the bus windows (flicker), the dawn (pingpong)",
    draw: `rect sky 0,0,320,30 7
rect sky_mid 0,30,320,16 15
rect sky_low 0,46,320,14 14
rect sun 150,50,20,10 14
poly city_far 0,64 0,54 16,54 16,44 36,44 36,52 56,52 56,40 76,40 76,50 96,50 96,46 116,46 116,56 136,56 136,48 160,48 160,60 184,60 184,44 208,44 208,52 232,52 232,42 252,42 252,54 276,54 276,46 296,46 296,56 320,56 320,64 8
rect city_band_1 0,56,320,2 7
poly city_near 0,86 0,70 24,70 24,58 54,58 54,68 82,68 82,62 110,62 110,72 140,72 140,64 168,64 168,70 196,70 196,60 226,60 226,68 256,68 256,56 288,56 288,66 320,66 320,86 0
rect near_win1 8,74,3,3 14
rect near_win2 36,64,3,3 14
rect near_win3 66,74,3,3 14
rect near_win4 92,68,3,3 14
rect near_win5 122,76,3,3 14
rect near_win6 150,70,3,3 14
rect near_win7 206,66,3,3 14
rect near_win8 240,74,3,3 14
rect near_win9 266,62,3,3 14
rect near_win10 298,72,3,3 14
rect road_far 0,86,320,4 0
rect road 0,90,320,18 8
rect road_line 0,98,320,2 15
rect road_dash1 10,98,24,2 8
rect road_dash2 70,98,24,2 8
rect road_dash3 130,98,24,2 8
rect road_dash4 190,98,24,2 8
rect road_dash5 250,98,24,2 8
rect kerb 0,106,320,4 15
rect kerb_shade 0,110,320,2 7
rect pave_1 0,112,320,10 7
rect pave_2 0,122,320,14 15
line pave_joint1 0,122 320,122 c8
line pave_crack1 40,112 44,122 c8
line pave_crack2 190,122 196,136 c8
line pave_crack3 288,112 292,122 c8
rect bus_body 132,54,108,48 14
rect bus_top 132,54,108,10 7
rect bus_stripe 132,86,108,4 4
rect bus_skirt 132,90,108,12 7
rect bus_win1 138,64,18,18 14
rect bus_win2 160,64,18,18 14
rect bus_win3 182,64,18,18 14
rect bus_win4 204,64,18,18 14
rect bus_door 226,66,12,34 0
rect bus_door_win 228,68,8,30 14
rect bus_front_glass 224,56,14,8 0
rect bus_sign 150,56,40,6 0
rect bus_sign_text 154,58,32,2 14
rect bus_lamp 238,90,4,4 15
rect wheel_f 218,98,20,10 0
rect wheel_f_hub 224,100,8,6 8
rect wheel_r 146,98,20,10 0
rect wheel_r_hub 152,100,8,6 8
rect bus_light_beam 242,100,30,8 14
rect bus_step 224,102,16,4 8
rect pass_1 140,68,6,8 0
rect pass_2 164,70,6,8 0
rect pass_3 208,68,6,8 0
ellipse pass_1_h 143,66,3,3 0
ellipse pass_2_h 167,68,3,3 0
ellipse pass_3_h 211,66,3,3 0
rect trav_shoe_l 94,106,8,4 0
rect trav_shoe_r 106,106,8,4 0
rect trav_leg_l 95,88,7,18 8
rect trav_leg_r 106,88,7,18 8
rect trav_coat 90,62,28,30 7
rect trav_coat_shade 90,62,6,30 8
rect trav_collar 96,62,16,4 8
ellipse trav_head 104,54,7,8 12
rect trav_hair 96,44,16,8 6
rect trav_ear 112,52,2,4 12
rect trav_arm 112,66,6,16 7
rect trav_hand 113,80,5,5 12
rect case_body 120,92,22,16 6
rect case_edge 120,92,22,3 0
rect case_strap 128,92,2,16 0
rect case_handle 126,88,10,4 0
rect case_lock 130,98,4,3 14
rect post 262,54,4,56 8
rect post_base 258,106,12,4 8
rect stop_sign 250,40,28,16 15
rect stop_sign_border 250,40,28,2 4
rect stop_sign_text1 254,46,20,2 0
rect stop_sign_text2 254,50,14,2 0
rect bench_seat 284,92,34,4 6
rect bench_back 284,82,34,3 6
rect bench_leg1 286,96,3,12 0
rect bench_leg2 312,96,3,12 0
rect bin 296,98,12,16 8
rect bin_lid 294,96,16,3 0
rect bin_paper 300,94,6,4 15
dots litter 20,128 56,126 160,130 230,128 270,132 c8
rect shadow_trav 90,108,46,3 8
rect shadow_bus 132,108,108,3 8`,
    cycles: [
      { name: "the bus windows", areas: ["bus_win1", "bus_win2", "bus_win3", "bus_win4"], colors: [14, 15, 14], style: "flicker", scatter: true, ms: [900, 3000] },
      { name: "the dawn", areas: ["sun"], colors: [14, 15], style: "pingpong", ms: 3000 }
    ]
  }
};

// ---- The cover: the splash page (docs/splash/PLAN.md; /prosperidad/) ------------------------------------------------
// The taller 480 x 560 cover (17 November 2026): the Emperor from behind, a huge black back cut by row 469, looking down the Avenida in one clean
// one-point perspective. Rows 0-119 and 470-559 one flat blue; the road's near band is that blue so the art lands on row 469.
export const cover = {
  shot: "archetype: the split (two names, one man: the strip's Emperor above the waterline of a wet street, Javier, the name on the papers, in its reflection; it beat the dwarf, the sign over a tiny figure, which could be any neon night). A film still, the avenida in one-point view at knee height, vanishing point (240,268), on a blue night: a huge flat magenta sunburst (a pink disc 13 with 11 rays 5 up to row 128) behind the Emperor, a 124 pixel black silhouette on a magenta glow in the middle of the wet street, feet on row 300: a crown-like mohawk, nose, a cigarette with a white tip, raised collar, jacket; his near arm hangs, his far arm bends into his pocket; he looks left. Below his feet, on a magenta pool, his reflection is another man: short hair, a plain jacket, both arms at his sides, a small case in one hand, a white shirt V and a black silk tie, cut by ripples. Grey and black blocks on both sides in perspective (lit windows 13 11 6, a magenta sign 13 and a cyan one 11, a water tank, a chimney), brown crates, a bin and a lamp post on the sidewalks, light streaks in the road, a grey gutter slab landing on row 469. The question: which man steps out of the door at dawn. Rows 0-119 plain blue 1; background blue 1 leads, black, brown 6, grey 8, magenta 5, lights 13 11 15; flat. moves: the left sign (flicker), the cyan sign (flicker), a few glints (twinkle), the chimney smoke (loop), a rat on the road (travelling loop)",
  title: 15,
  titleAt: "top",
  draw: `
rect sky 0,0,480,560 1
dots stars 30,160 62,206 48,250 96,140 150,150 126,190 330,146 372,170 420,150 452,196 438,246 404,130 c15
dots starsC 20,196 110,132 356,134 466,160 460,236 c11
poly ray15 299,215.1 334.7,200.6 296.6,206 5
poly ray30 294.2,200.2 324.9,177 289.4,192 5
poly ray45 285.6,187 309.3,156.7 279,180.4 5
poly ray60 274,176.6 289,141.1 265.8,171.8 5
poly ray75 260,169.4 265.4,131.3 250.9,167 5
poly ray90 244.7,166.2 240,128 235.3,166.2 5
poly ray105 229.1,167 214.6,131.3 220,169.4 5
poly ray120 214.2,171.8 191,141.1 206,176.6 5
poly ray135 201,180.4 170.7,156.7 194.4,187 5
poly ray150 190.6,192 155.1,177 185.8,200.2 5
poly ray165 183.4,206 145.3,200.6 181,215.1 5
ellipse discRing 240,226,80,80 5
ellipse disc 240,226,74,74 13
poly L3 188,232 222,255 222,272.6 188,281.4 8
poly l3a 194.8,245.2 205,250.2 205,258.6 194.8,256 0 e0
poly l3b 194.8,261.6 205,263 205,271 194.8,271.9 13 e0
poly R3 258,255 292,229 292,281.4 258,272.6 5
poly r3a 264.8,255.2 276.7,248.8 276.7,257.3 264.8,260.9 0 e0
poly r3b 264.8,264.1 276.7,262 276.7,270.9 264.8,270 13 e0
poly L2 120,196 188,237 188,281.4 120,299 0
poly l2w0 128.2,212.4 147.2,221.9 147.2,233.1 128.2,225.9 13 e0
poly l2w1 157.4,227 177.8,237.2 177.8,244.7 157.4,237 0 e8
poly l2w2 128.2,239.3 147.2,244.2 147.2,255.4 128.2,252.7 0 e8
poly l2w3 157.4,246.9 177.8,252.1 177.8,259.6 157.4,256.8 13 e0
poly l2w4 128.2,266.2 147.2,266.5 147.2,277.7 128.2,279.6 6 e0
poly l2w5 157.4,266.7 177.8,267 177.8,274.5 157.4,276.6 0 e8
poly R2 292,234 360,190 360,299 292,281.4 8
line r2c0 292,249.7 360,226 c0
line r2c1 292,265.3 360,261.9 c0
poly r2w0 302.2,233.1 320.6,222.8 320.6,234.6 302.2,242.1 0 e0
poly r2w1 331.4,216.8 351.8,205.4 351.8,221.7 331.4,230.1 13 e0
poly r2w2 302.2,250.1 320.6,244.8 320.6,256.6 302.2,259.1 11 e0
poly r2w3 331.4,241.7 351.8,235.9 351.8,252.2 331.4,255 0 e0
poly r2w4 302.2,267.1 320.6,266.8 320.6,278.6 302.2,276.1 0 e0
poly r2w5 331.4,266.7 351.8,266.4 351.8,282.7 331.4,280 6 e0
poly L1 0,150 120,208 120,299 0,330 8
line l1c0 0,204 120,235.3 c0
line l1c1 0,249 120,258.1 c0
line l1c2 0,290.4 120,279 c0
poly signFr 7.2,174.4 84,204.7 84,225.9 7.2,205.9 0
poly signIn 12,181.5 79.2,206.5 79.2,221 12,202 13
line signTxt 19.2,194.1 72,211.4 c0
poly l1w0 12,224.2 43.2,230.1 43.2,247.8 12,244.8 0 e0
poly l1w1 60,233.2 91.2,239 91.2,252.5 60,249.5 11 e0
poly l1w2 12,261.9 43.2,262.6 43.2,280.4 12,282.4 13 e0
poly l1w3 60,263 91.2,263.7 91.2,277.2 60,279.3 0 e0
poly l1w4 98.4,240.4 115.2,243.5 115.2,254.9 98.4,253.2 0 e0
poly l1w5 98.4,263.9 115.2,264.3 115.2,275.7 98.4,276.8 0 e0
rect tankLegs 44,170,3,12 0
rect tankLegs2 62,168,3,14 0
rect tank 40,150,28,22 0
poly tankCap 38,150 54,140 70,150 0
line tankBand 40,158 68,158 c8
poly R1 360,203 480,138 480,330 360,299 0
poly cyFr 396,198.5 470.4,165.3 470.4,198.5 396,220.9 8
poly cyanIn 400.8,200.2 465.6,172.9 465.6,194.5 400.8,215.6 11
line cyTxt 410.4,204.3 456,187.3 c0
poly r1w0 369.6,239.3 391.2,234.5 391.2,249 369.6,251.7 13 e0
poly r1w1 400.8,232.4 422.4,227.6 422.4,245.1 400.8,247.8 0 e8
poly r1w2 432,225.4 453.6,220.7 453.6,241.2 432,243.9 11 e0
poly r1w3 460.8,219.1 477.6,215.3 477.6,238.1 460.8,240.3 6 e0
poly r1w4 369.6,262.1 391.2,261.1 391.2,275.6 369.6,274.5 0 e8
poly r1w5 400.8,260.7 422.4,259.7 422.4,277.2 400.8,276.1 11 e0
poly r1w6 432,259.2 453.6,258.2 453.6,278.8 432,277.7 13 e0
poly r1w7 460.8,257.9 477.6,257.1 477.6,280 460.8,279.1 0 e8
rect chim 368,152,12,48 0
rect chimCap 365,148,18,5 8
line antenna 318,214 318,196 c0
line antennaX 310,202 326,202 c0
line roofL 0,150 120,208 c0
line roofR 480,138 360,203 c8
poly walkL 0,330 0,430 240,268 mix:8,1@0.35
poly walkR 480,330 480,430 240,268 mix:8,1@0.35
poly road 240,268 480,430 480,469 0,469 0,430 mix:1,0@0.25
line jL348 240,268 0,348 c0
line jR348 240,268 480,348 c0
line jL368 240,268 0,368 c0
line jR368 240,268 480,368 c0
line jL390 240,268 0,390 c0
line jR390 240,268 480,390 c0
line jL414 240,268 0,414 c0
line jR414 240,268 480,414 c0
line kerbL 240,268 0,430 c15
line kerbR 240,268 480,430 c15
ellipse poolRim 240,392,92,42 mix:5,1@0.5
poly glowRoad 200,262 280,262 322,392 158,392 5
ellipse pool 240,392,72,30 5
poly mohawk 228.5,189.6 225.1,173.5 231.9,179.3 230.8,159.7 237.7,173.5 240,152.8 244.6,173.5 249.2,159.7 248.1,179.3 254.9,173.5 251.5,189.6 0
poly head 228.5,185 240,180.4 251.5,185 253.8,198.8 248.1,211.4 233.1,212.6 228.5,206.9 226.2,203.4 221.6,201.1 226.2,196.5 0
line cig 227.3,206.9 215.8,209.2 c0
dots cigTip 213.7,209.2 c15
poly neck 235.4,210.3 244.6,210.3 244.6,220.7 235.4,220.7 0
poly collarL 219.3,204.6 235.4,214.9 235.4,225.3 217,221.8 0
poly collarR 260.7,204.6 244.6,214.9 244.6,225.3 263,221.8 0
poly jacket 217,219.5 226.2,216.1 253.8,216.1 263,219.5 265.3,235.6 260.7,249.4 273.4,263.2 206.7,263.2 219.3,249.4 214.7,235.6 0
poly armL 217,219.5 208.9,228.7 200.9,244.8 198.6,262.1 206.7,264.4 210.1,249.4 218.2,237.9 220.4,226.4 0
ellipse handL 202,267,5,5 0
poly armR 263,219.5 273.4,226.4 289.4,247.1 281.4,260.9 267.6,257.4 265.3,251.7 276.8,245.9 269.9,234.4 0
poly legL 219.3,260.9 237.7,260.9 236.6,293.1 243.4,297.7 243.4,301.1 210.1,301.1 211.3,296.6 219.3,293.1 0
poly legR 242.3,260.9 260.7,260.9 260.7,293.1 268.8,296.6 269.9,301.1 237.7,301.1 237.7,297.7 243.4,293.1 0
poly jLegL 221.6,339.1 237.7,339.1 236.6,304.6 243.4,300 212.4,300 219.3,304.6 0
poly jLegR 242.3,339.1 258.4,339.1 260.7,304.6 267.6,300 237.7,300 243.4,304.6 0
poly jJacket 214.7,380.5 223.9,385.1 256.1,385.1 265.3,380.5 263,336.8 217,336.8 0
poly jArmL 203.2,378.2 212.4,378.2 211.3,334.5 203.2,334.5 0
poly jArmR 267.6,378.2 276.8,378.2 276.8,334.5 268.8,334.5 0
poly jCase 271.1,334.5 292.9,334.5 292.9,316.1 271.1,316.1 0
poly jNeck 235.4,392 244.6,392 244.6,380.5 235.4,380.5 0
poly jHead 227.3,401.2 229.7,413.9 240,418.4 250.3,413.9 252.7,401.2 246.9,389.7 233.1,389.7 0
poly jShirt 230.8,383.9 249.2,383.9 240,359.8 15
poly jTie 238.8,381.6 241.2,381.6 243.4,362.1 240,356.4 236.6,362.1 0
rect rip0 200,322,80,2 5
rect rip1 190,352,100,2 5
rect rip2 204,386,72,2 5
rect rip3 196,406,92,2 5
rect slL0 112,352,5,12 13
rect slL1 114,372,5,10 13
rect slL2 116,394,5,8 13
rect slR0 360,352,5,12 11
rect slR1 358,374,5,10 11
rect slR2 356,396,5,8 11
rect slLb0 100,356,3,8 5
rect slLb1 96,380,3,8 5
poly dash-1404 148.7,404 155.3,404 149,414 142.1,414 15
poly dash1404 324.7,404 331.3,404 337.9,414 331,414 15
poly dash-1428 132.8,428 140.1,428 131.3,442 123.5,442 15
poly dash1428 339.9,428 347.2,428 356.5,442 348.7,442 15
rect shine0 40,426,24,1 8
rect shine1 70,444,16,1 8
rect shine2 150,448,20,1 8
rect shine3 296,448,18,1 8
rect shine4 380,430,22,1 8
rect shine5 430,446,16,1 8
rect shine6 22,404,14,1 8
rect shine7 452,408,14,1 8
rect crate1 56,342,26,24 6 e0
line crate1x 56,354 82,354 c0
line crate1y 69,342 69,366 c0
rect crate2 64,320,20,22 6 e0
line crate2x 64,331 84,331 c0
rect bin 96,340,16,24 8 e0
rect binLid 94,337,20,4 0
rect pole 346,196,4,140 0
poly poleArm 346,198 346,194 330,190 330,194 0
poly lamp 322,194 334,194 332,200 324,200 15
rect poleBase 343,330,10,6 8 e0
dots glints 384,201.5 444,239.1 468,308.7 154,220.2 140.4,259.6 174.4,282.1 414,306 c11
rect slab 0,456,480,13 8
line slabTop 0,456 480,456 c0
rect seam0 34,457,2,12 0
rect seam1 118,457,2,12 0
rect seam2 204,457,2,12 0
rect seam3 290,457,2,12 0
rect seam4 372,457,2,12 0
rect seam5 452,457,2,12 0
ellipse manhole 330,436,22,5 0 e8
dots manholeD 322,436 330,435 338,436 c8
ellipse puddleA 126,438,16,3 5
ellipse puddleB 412,442,14,3 5
`,
  cycles: [{"name":"the left sign","areas":["signIn"],"colors":[13,5],"style":"flicker","ms":[900,3600]},{"name":"the cyan sign","areas":["cyanIn"],"colors":[11,15],"style":"flicker","ms":[700,3000]},{"name":"the lit windows","areas":["glints"],"colors":[11,13],"style":"pingpong","scatter":true,"ms":900}],
  loops: [{"name":"the chimney smoke","at":[367,125],"style":"loop","ms":300,"frames":[[".....88f........",".......88.......","......888.......","........8f......","........888.....",".........88.....","........88f.....",".........88.....","........888.....","........8f......",".......888......",".......88.......","......8f........","......88........",".....88.........","....8f..........","....88..........","...88...........","...8f...........","...88...........","...88...........","...8f...........","....88..........","....88.........."],["........888.....",".........88.....","........88f.....",".........88.....",".......888......","........8f......","......888.......","......88........",".....88f........",".....88.........","...888..........","....8f..........","...88...........","...88...........","...8f...........","...88...........","...88...........","....8f..........","....88..........",".....88.........","......8f........",".......88.......",".......88.......","........8f......"],[".......888......",".......8f.......",".....888........","......88........","....88f.........","....88..........","...888..........","...8f...........","..888...........","...88...........","..88f...........","...88...........","....88..........","....8f..........",".....88.........","......88........",".......8f.......",".......88.......","........88......","........8f......",".........88.....",".........88.....",".........8f.....",".........88....."],["...88f..........","....88..........","..888...........","...8f...........","..888...........","...88...........","..88f...........","....88..........","...888..........",".....8f.........",".....888........",".......88.......",".......8f.......","........88......","........88......",".........8f.....",".........88.....",".........88.....",".........8f.....","........88......","........88......",".......8f.......",".......88.......","......88........"],["..888...........","...88...........","...88f..........","....88..........","....888.........","......8f........","......888.......",".......88.......",".......88f......","........88......","........888.....",".........8f.....",".........88.....",".........88.....","........8f......","........88......",".......88.......",".......8f.......","......88........",".....88.........","....8f..........","....88..........","...88...........","...8f..........."]]},{"name":"the rat","style":"loop","ms":120,"path":[[-20,440],[500,440]],"travel":5200,"pause":8000,"frames":[[".......ddddd....","......000000dd..","0000000000000f00",".....0000000000.","......00..00...."],[".......ddddd....","......000000dd..",".....000000000f0","00000000000000..",".....0.0..0.0..."],[".......ddddd....","......000000dd..","0000000000000f00",".....0000000000.","....0.0....0.0.."]]}]
};


// ---- The box art (the list of games: ui/home.js): the earlier 480 x 400 cover (16 November 2026), shown as its phone crop, columns 80-399, still. ----
export const boxart = {
 "shot": "archetype: the tower (the story turns on one person whose presence rules the poster: the Emperor, the street punk you play, the title's own man). Title at the top: rows 0-95 plain blue across the whole 480 width, the facade starts below it in the same blue so the band stays flat. The Emperor is one huge flat black silhouette seen from below, about 284 pixels tall from the tip of his mohawk (row 112) to his boots (row 396), standing a little right of centre at x about 258, in profile turned to the left, looking away down the strip, a short leather jacket with the collar up, tight trousers, boots in a stride, the mohawk a tall fin swept back over the crown; a cigarette hangs from his lips with a small red ember, the one bright point; his near arm (the viewer's left) hangs at his side, bent a little out, the hand a closed fist at mid-thigh, so a gap of light shows between arm and jacket; his far arm is in his jacket pocket, the elbow pushing out on the right; no inner detail. Rim light: a thin light cyan edge on his left side only (the fin's front, the jacket's left edge, the near arm's outer edge, the near leg's left edge), thrown by a cyan tube sign at the left. Backdrop: the blue wall of El Charlie with black seams, a few worn patches and lit windows, and on it one huge round porthole sign, a light magenta disc in a magenta rim with a ring of white bulbs, a white hot spot behind his head so the head and fin read dark against the lightest thing, a few stains and drips on the disc; the wall meets the wet road at the horizon, at his knee (row 332); the road in three flat bands (light magenta far, magenta, blue near) with streaks of the sign's light and a magenta puddle under his boots. Element 3 and the question: a tiny man, a black silhouette in a trilby and a long coat, about 42 pixels tall, standing at the left in a lit light-cyan doorway at the foot of the wall, a leather case in one hand, the other in his pocket, his back half turned: the Minister, small; who is he, and what will he want of you. Wings (columns 0-79 and 400-479, the strip carrying on, all dim and nothing the poster needs): on the left, the next building along, a wall with a black seam, four windows in magenta and cyan (one light cyan), a worn stain, a roller shutter of black and blue rows at the street, a small dim magenta sign and a street lamp on a bent arm with its small light-cyan bulb and a pool of light on the road; on the right, another building with a black seam, windows in magenta and cyan, a stain, a shop with a magenta awning, a black door and a dim cyan shop window, and a lamp post that also carries a hanging cyan blade sign on a bracket, with its pool of light on the road; the road's three bands and streaks run on across both wings. Palette neon (the bible's first), flat: blue 1 leads (title band, wall, near road), light magenta 13 and magenta 5 for the porthole and its rim, black for the figures, small light cyan 11, white 15 and one red ember. light: the lit porthole behind him, the cyan tube beside, the two street lamps in the wings. moves: the cyan tube (faulty flicker), the small corner sign (blink), the blade sign in the right wing (blink), the bulbs round the porthole (twinkle), the smoke curling up from his cigarette (loop), a small black rat that runs left to right along the road behind his boots across the whole width now and then (travelling loop, hidden behind his legs)",
 "title": 15,
 "titleAt": "top",
 "draw": "\nrect sky 0,0,480,400 1\n\n# the wall of El Charlie and the buildings either side: seams and worn patches (in the dark, away from the glow)\nline course1 0,132 150,132 c0\nline course2 366,128 479,128 c0\nline course3 0,262 479,262 c0\nline course4 0,300 479,300 c0\nrect seamA 98,100,2,162 0\nrect seamB 372,100,2,162 0\nrect seamL 40,100,2,162 0\nrect seamC 402,100,2,162 0\npoly stain1 80,104 104,102 110,130 92,148 80,140 0\npoly stain1W 64,112 80,104 80,140 70,150 58,140 0\npoly stain2 356,246 399,240 399,262 370,262 0\npoly stain2W 399,240 420,244 424,262 399,262 0\npoly stain3 80,226 98,222 104,246 80,262 0\npoly stain3W 66,230 80,226 80,262 62,258 0\npoly stain4 404,206 430,204 434,232 410,244 404,238 0\n\n# lit windows, the poster's and the wings'\nrect win1 322,146,18,24 11\nrect win2 350,146,18,24 13\nrect win3 350,196,18,24 11\nrect win4 88,160,16,22 13\nrect win5 88,196,16,22 11\nline pipe 384,100 384,332 c0\nrect wL1 8,140,16,22 5\nrect wL2 46,140,16,22 3\nrect wL3 8,184,16,22 3\nrect wL4 46,184,16,22 5\nrect wL5 46,226,16,22 11\nline wLm1 8,151 23,151 c0\nline wLm2 46,195 61,195 c0\nline wLm3 54,226 54,247 c0\nrect wR1 414,136,16,22 5\nrect wR2 446,136,16,22 3\nrect wR3 414,182,16,22 3\nrect wR4 446,182,16,22 5\nline wRm1 414,147 429,147 c0\nline wRm2 454,136 454,157 c0\nline wRm3 446,193 461,193 c0\n\n# the wings' shopfronts: a roller shutter on the left, an awning, a door and a window on the right\nrect shutT 2,264,66,4 0\nrect shut 4,268,62,64 stripes:1,0\nrect sgLg 68,212,10,22 5\nrect sgL 70,216,6,14 13\npoly awn 408,262 479,262 479,284 408,284 5\nline awnE 408,284 479,284 c0\nrect doorR 424,288,26,44 0\nrect tranR 424,285,26,3 5\nrect shopW 456,290,20,28 3\nline shopWm 456,304 475,304 c0\n\n# the corner sign at the right\nrect signRg 364,274,30,14 5\nrect signR 369,278,20,6 13\n\n# the huge porthole sign: rim, disc, inner ring, hot spot, stains\nellipse rim 258,204,105,105 5\nellipse disc 258,204,98,98 13\nellipse ring 258,204,86,86 5\nellipse face 258,204,82,82 13\nellipse spot 254,152,40,40 15\npoly patch1 188,262 220,254 232,278 208,292 186,282 5\npoly patch2 294,276 324,262 338,284 312,296 5\nline drip1 210,291 210,306 c5\nline drip2 314,295 314,310 c5\nline drip3 280,299 280,314 c5\ndots bulbs 359,204 354,235 340,263 317,286 289,300 258,305 227,300 199,286 176,263 162,235 157,204 162,173 176,145 199,122 227,108 258,103 289,108 317,122 340,145 354,173 c15\n\n# the cyan tube sign at the left of the poster, leaning\npoly tubeG 102,118 124,118 146,322 124,322 3\nline tubeA 113,122 136,318 c11\nline tubeB 114,122 137,318 c11\n\n# the Minister's lit doorway and the road, across the whole width\nrect door 132,296,38,36 11\nrect roadF 0,332,480,12 13\nrect roadM 0,344,480,18 5\nrect roadN 0,362,480,37 1\nline streak1 192,336 324,336 c15\nline streak2 160,340 350,340 c11\nline streak3 120,352 180,352 c13\nline streak4 320,354 380,354 c13\nline streak5 88,370 140,370 c5\nline streak6 334,376 396,376 c5\nline streak7 94,390 150,390 c13\nline streakW1 6,335 40,335 c11\nline streakW2 12,358 56,358 c13\nline streakW3 4,372 46,372 c5\nline streakW4 20,388 70,388 c13\nline streakW5 410,337 458,337 c11\nline streakW6 436,356 476,356 c13\nline streakW7 420,376 470,376 c5\nline streakW8 440,392 478,392 c13\nellipse puddle 258,386,84,11 5\nellipse puddleS 258,385,56,6 13\n\n# the street lamps of the wings: poles, arms, heads, small bulbs, pools of light on the road\nellipse poolL 50,352,20,4 13\nellipse poolR 428,352,20,4 13\nrect lampPL 29,176,3,156 0\nline lampAL 30,177 46,170 c0\nrect lampHL 42,168,12,5 0\nellipse lampBL 48,175,4,3 11\nrect lampPR 437,172,3,160 0\nline lampAR 437,174 426,170 c0\nrect lampHR 420,168,12,5 0\nellipse lampBR 426,175,4,3 11\nrect brk 437,206,30,3 0\nrect bladeG 458,209,16,46 3\nrect blade 462,213,8,38 11\nline bladeM 462,232 469,232 c3\n\n# the Minister, small: hat, face, coat, case, legs\npoly mn_crown 146,304 156,304 157,310 145,310 0\npoly mn_brim 140,310 162,309 162,312 140,313 0\nellipse mn_face 150,317,4,4 0\npoly mn_coat 143,321 159,321 163,342 141,342 0\npoly mn_arm 142,323 146,323 141,338 138,338 0\nrect mn_case 132,338,10,7 0\nrect mn_legL 145,342,5,5 0\nrect mn_legR 153,342,5,5 0\n\n# the Emperor: mohawk, head, neck, collar, jacket, arms, legs, boots\npoly em_fin 237,134 239,120 245,113 253,112 261,115 268,126 270,142 263,132 251,127 243,129 0\npoly em_head 250,129 262,131 269,142 269,158 263,169 252,174 242,173 235,168 231,163 232,159 226,156 232,150 233,143 238,134 0\npoly em_neck 240,168 262,168 268,184 236,186 0\npoly em_collarL 230,192 238,170 248,182 244,194 0\npoly em_collarR 272,192 266,170 256,182 260,194 0\npoly em_jacket 238,184 216,188 208,206 210,240 216,266 212,276 294,278 290,264 298,228 302,200 294,189 270,184 0\npoly em_armN 216,188 234,192 222,250 210,296 194,294 200,246 0\nellipse em_fist 201,304,8,9 0\npoly em_armF 296,194 304,200 318,240 308,264 294,266 292,230 0\npoly em_legL 222,274 258,274 250,334 246,386 216,386 220,334 0\npoly em_bootL 192,397 204,384 248,382 250,397 0\npoly em_legR 264,274 292,274 294,334 302,386 272,386 270,334 0\npoly em_bootR 270,386 304,382 306,396 270,397 0\nline em_cig 231,164 222,165 c0\nrect em_ember 218,163,5,4 4\nrect em_core 219,164,2,2 14\n\n# the rim light on his left edge\nline rim1 237,134 239,120 245,113 c11\nline rim2 216,188 208,206 210,240 c11\nline rim3 216,189 200,246 194,294 c11\nline rim4 222,276 220,334 216,386 c11\n",
 "cycles": [
  {
   "name": "the cyan tube",
   "areas": [
    "tubeA",
    "tubeB"
   ],
   "colors": [
    11,
    3
   ],
   "style": "flicker",
   "ms": [
    800,
    4000
   ]
  },
  {
   "name": "the corner sign",
   "areas": [
    "signR",
    "signRg"
   ],
   "colors": [
    13,
    5,
    1
   ],
   "style": "blink",
   "ms": 1200
  },
  {
   "name": "the blade sign",
   "areas": [
    "blade",
    "bladeG"
   ],
   "colors": [
    11,
    3,
    1
   ],
   "style": "blink",
   "ms": 1700
  },
  {
   "name": "the bulbs",
   "areas": [
    "bulbs"
   ],
   "colors": [
    15,
    13
   ],
   "style": "pingpong",
   "scatter": true,
   "ms": 600
  }
 ],
 "loops": [
  {
   "name": "the cigarette smoke",
   "at": [
    208,
    133
   ],
   "style": "loop",
   "ms": 280,
   "frames": [
    [
     "......8.88......",
     ".......8...8....",
     ".........88.8...",
     "........8.8.....",
     ".......88.88....",
     "........8.8.....",
     ".....8.88.......",
     ".....8...8......",
     ".....8888.......",
     ".....8.8........",
     "......8888......",
     ".......8.8......",
     ".........8888...",
     ".........8.8....",
     "..........888...",
     "..........8.8...",
     "..........777...",
     ".........777....",
     "........777.....",
     ".......777......",
     "........77......",
     "........77......",
     ".........77.....",
     "..........77....",
     "...........77...",
     "............77..",
     "............7...",
     "............7...",
     "............7...",
     "............7..."
    ],
    [
     ".......8.88.....",
     ".......8...8....",
     "........88.8....",
     "......8.8.......",
     ".....88.88......",
     "......8.8.......",
     "....8.88........",
     ".....8...8......",
     "......8888......",
     ".......8.8......",
     "........8888....",
     ".........8.8....",
     "..........8888..",
     ".........8.8....",
     ".........888....",
     ".........8.8....",
     "........777.....",
     ".......777......",
     ".......777......",
     ".......777......",
     ".........77.....",
     "..........77....",
     "...........77...",
     "............77..",
     "............77..",
     "............77..",
     "............7...",
     "...........7....",
     "...........7....",
     "...........7...."
    ],
    [
     "......8.88......",
     "......8...8.....",
     "......88.8......",
     "....8.8.........",
     "....88.88.......",
     "......8.8.......",
     ".....8.88.......",
     "......8...8.....",
     "........8888....",
     ".........8.8....",
     ".........8888...",
     ".........8.8....",
     ".........8888...",
     "........8.8.....",
     ".......888......",
     ".......8.8......",
     ".......777......",
     ".......777......",
     "........777.....",
     ".........777....",
     "...........77...",
     "............77..",
     "............77..",
     "............77..",
     "...........77...",
     "..........77....",
     "...........7....",
     "...........7....",
     "...........7....",
     "...........7...."
    ],
    [
     "....8.88........",
     "....8...8.......",
     ".....88.8.......",
     "....8.8.........",
     ".....88.88......",
     "........8.8.....",
     ".......8.88.....",
     "........8...8...",
     ".........8888...",
     ".........8.8....",
     "........8888....",
     ".......8.8......",
     ".......8888.....",
     "......8.8.......",
     "......888.......",
     ".......8.8......",
     "........777.....",
     ".........777....",
     "..........777...",
     "...........777..",
     "............77..",
     "............77..",
     "...........77...",
     "..........77....",
     "..........77....",
     ".........77.....",
     "..........7.....",
     "...........7....",
     "...........7....",
     "............7..."
    ],
    [
     "...8.88.........",
     "....8...8.......",
     "......88.8......",
     "......8.8.......",
     ".......88.88....",
     "..........8.8...",
     "........8.88....",
     "........8...8...",
     "........8888....",
     ".......8.8......",
     "......8888......",
     "......8.8.......",
     "......8888......",
     "......8.8.......",
     ".......888......",
     ".........8.8....",
     "..........777...",
     "...........777..",
     "...........777..",
     "...........777..",
     "...........77...",
     "..........77....",
     ".........77.....",
     ".........77.....",
     ".........77.....",
     ".........77.....",
     "...........7....",
     "...........7....",
     "............7...",
     "............7..."
    ],
    [
     "....8.88........",
     "......8...8.....",
     "........88.8....",
     "........8.8.....",
     "........88.88...",
     "..........8.8...",
     ".......8.88.....",
     "......8...8.....",
     "......8888......",
     ".....8.8........",
     ".....8888.......",
     "......8.8.......",
     ".......8888.....",
     "........8.8.....",
     ".........888....",
     "..........8.8...",
     "...........777..",
     "...........777..",
     "..........777...",
     ".........777....",
     ".........77.....",
     "........77......",
     "........77......",
     ".........77.....",
     "..........77....",
     "..........77....",
     "............7...",
     "............7...",
     "............7...",
     "............7..."
    ]
   ]
  },
  {
   "name": "the rat",
   "style": "loop",
   "ms": 120,
   "path": [
    [
     -20,
     389
    ],
    [
     500,
     389
    ]
   ],
   "travel": 5300,
   "pause": 25000,
   "under": "em",
   "frames": [
    [
     ".......ddddd....",
     "......000000dd..",
     "0000000000000f00",
     ".....0000000000.",
     "......00..00...."
    ],
    [
     ".......ddddd....",
     "......000000dd..",
     ".....000000000f0",
     "00000000000000..",
     ".....0.0..0.0..."
    ],
    [
     ".......ddddd....",
     "......000000dd..",
     "0000000000000f00",
     ".....0000000000.",
     "....0.0....0.0.."
    ]
   ]
  }
 ]
};
