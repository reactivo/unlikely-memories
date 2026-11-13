// Pictures for "The River Turns at Noon" (worlds/noon/world.en.js), one per room and one per ending, written by hand in the short notation
// (BRIEF.md §7, the shared core and the flat style): 320 x 136, EGA colours 0-15, shapes back to front, ids on what the story may change or a
// cycle animates. Phone crop: columns 47-272 carry the story; the wings (0-46, 273-319) carry the same place on. Every picture faces north.
export default {
  // ---- THE TENT (the opening): inside the canvas, facing north to the flap -----------------------------------------------------
  bivouac: {
    version: 1,
    shot: "Eye level inside the tent, facing north, one-point, vp 213,62; lamplight; one light, the hurricane lantern on its ridge pole at x150 (a hard two-ellipse glow, flat lit patches on the back wall and the floor); canvas brown, the far corners dim; the {flap} on the right third x190-236 tied half back on a forest view in greens; subject the flap on x213, second the {chest} on x107 with the {parrot} overlay on it; left wing: a coat on a peg and the canvas creases; right wing: the {cot} under its {net}, and a pair of {boots}; moves: the lantern flame (flame), its light (lamplight)",
    draw: `
      vp 213,62
      poly roof 0,0@1 320,0@1 320,0@0.45 0,0@0.45 mix:6,0@0.5
      poly wall_l 0,0@1 0,136@1 0,136@0.45 0,0@0.45 mix:6,0@0.5
      poly wall_r 320,0@1 320,136@1 320,136@0.45 320,0@0.45 mix:6,0@0.5
      poly backwall 0,0@0.45 320,0@0.45 320,136@0.45 0,136@0.45 6
      poly floor 0,136@1 320,136@1 320,136@0.45 0,136@0.45 6
      poly floor_far 0,136@0.62 320,136@0.62 320,136@0.45 0,136@0.45 mix:6,0@0.5
      poly floor_mid 0,136@0.82 320,136@0.82 320,136@0.62 0,136@0.62 6
      line seam_r1 0,0@1 0,0@0.45 c0
      line seam_r2 107,0 117,34 c0
      line seam_r3 213,0 213,34 c0
      line seam_r4 320,0@1 320,0@0.45 c0
      line seam_l1 0,136@1 0,136@0.45 c0
      line seam_l2 0,68@1 0,68@0.45 c0
      line seam_l3 320,68@1 320,68@0.45 c0
      line seam_l4 320,136@1 320,136@0.45 c0
      line ridge 0,0@1 0,0@0.45 c0
      line ridge_pole 117,34 261,34 c0
      line ridge_pole2 117,35 261,35 c8
      line pole_l 117,34 117,95 c0
      line pole_r 261,34 261,95 c0
      line seam_b1 148,34 148,95 c0
      line seam_b2 189,34 189,95 c0
      line seam_b3 236,34 236,95 c0
      line seam_b4 261,34 261,95 c0
      dots stitch_b1 148,40 148,46 148,52 148,58 148,64 148,70 148,76 148,82 148,88 c14
      dots stitch_b2 236,40 236,46 236,52 236,58 236,64 236,70 236,76 236,82 236,88 c14
      poly stain_a 150,60 168,57 175,66 166,74 154,72 6
      poly stain_b 126,70 138,68 142,78 130,82 mix:6,0@0.5
      poly stain_c 244,46 256,44 258,58 248,60 mix:6,0@0.5
      poly patch_a 120,44 134,42 136,52 122,54 14
      poly patch_b 152,84 164,84 162,92 152,92 14
      line patch_a_line 120,48 136,47 c6
      line patch_b_line 152,88 164,88 c6
      poly back_lit 138,36 164,36 160,52 142,52 14
      line crack_a 122,40 126,50 124,58 c0
      line crack_b 250,64 254,72 252,80 c0
      line damp_h1 130,92 146,92 c8
      line damp_h2 240,92 256,92 c8
      poly view 193,40 233,40 233,86 193,86 2
      poly view_top 193,40 233,40 233,52 193,52 10
      poly lf_a 196,44 206,43 208,52 198,54 2
      poly lf_b 216,42 228,44 226,54 214,52 2
      poly lf_c 200,60 210,58 212,70 202,72 10
      poly lf_d 220,62 230,60 232,72 222,74 10
      poly lf_e 196,74 206,72 208,84 196,84 2
      poly lf_f 214,76 226,74 228,86 214,86 2
      line trunk_a 206,40 208,86 c0
      line trunk_b 207,40 209,86 c0
      line trunk_c 224,42 222,86 c0
      line trunk_d 225,42 223,86 c0
      line trunk_e 194,40 195,86 c0
      line branch_a 208,56 226,50 c0
      line branch_b 196,70 206,66 c0
      poly mud 192,84 234,84 238,95 188,95 6
      line mud_a 196,88 206,88 c0
      line mud_b 214,91 228,91 c0
      line mud_c 200,92 208,92 c8
      poly flap_l 189,34 193,34 197,60 201,95 189,95 6 e0
      poly flap_r 236,34 232,34 230,60 228,95 236,95 6 e0
      line flap_fold_l 191,40 195,90 c0
      line flap_fold_r 234,40 231,90 c0
      line flap_tie_l 193,58 200,60 c0
      line flap_tie_r 232,58 226,60 c0
      dots flap_stitch_l 191,48 192,56 193,64 194,72 195,80 c14
      dots flap_stitch_r 234,48 233,56 232,64 231,72 230,80 c14
      poly floor_lit 120,112 190,108 214,116 190,128 128,128 14
      line floor_lit_b 126,118 186,114 c6
      line floor_lit_c 134,124 192,120 c6
      line plank_1 0,136@0.82 0,136@0.62 c0
      line plank_2 80,136 120,95 c0
      line plank_3 160,136 160,95 c0
      line plank_4 240,136 200,95 c0
      line plank_5 320,136@0.82 320,136@0.62 c0
      line floor_edge_a 0,136@0.62 320,136@0.62 c0
      line floor_edge_b 0,136@0.82 320,136@0.82 c0
      line mud_print_a 60,122 70,120 c0
      line mud_print_b 64,127 76,125 c0
      line mud_print_c 270,124 282,122 c0
      line mud_print_d 262,129 276,127 c0
      poly chest_top 80,86 140,86 146,92 74,92 14 e0
      poly chest_face 74,92 146,92 146,114 74,114 6 e0
      poly chest_side 146,92 154,88 154,110 146,114 mix:6,0@0.5 e0
      line chest_band_a 90,92 90,114 c0
      line chest_band_b 130,92 130,114 c0
      line chest_lock 108,92 108,102 c0
      rect chest_plate 104,100,8,6 14 e0
      dots chest_nails 78,96 78,108 142,96 142,108 94,112 126,112 c14
      line chest_grain 80,98 100,98 c0
      line chest_grain2 116,106 140,106 c0
      poly chest_shadow 74,114 154,110 160,116 78,118 0
      poly cot_leg_l 244,104 248,104 248,120 244,120 0
      poly cot_leg_r 300,104 304,104 304,120 300,120 0
      poly cot_frame 238,98 312,98 312,104 238,104 0
      poly cot_canvas 240,92 310,92 312,98 238,98 6 e0
      poly blanket 242,86 306,86 310,94 240,94 4 e0
      line blanket_f1 250,88 252,94 c0
      line blanket_f2 270,87 272,94 c0
      line blanket_f3 290,88 292,94 c0
      poly pillow 292,82 308,82 310,88 290,88 15 e0
      line pillow_f 296,84 304,85 c7
      poly cot_net 236,34 240,34 252,60 250,98 238,98 mix:6,0@0.5
      line net_a 240,38 252,98 c0
      line net_b 244,38 256,98 c0
      line net_c 238,60 254,60 c0
      line net_d 238,76 252,76 c0
      line boot_a 262,114 274,114 c0
      poly boot_l 262,106 268,106 270,116 262,116 0
      poly boot_r 272,108 278,108 280,116 272,116 0
      line boot_hi_l 264,108 268,108 c6
      line boot_hi_r 274,110 278,110 c6
      line peg_cord 40,18 52,50 c0
      line peg_cord2 52,50 56,60 c0
      poly coat 44,52 60,52 62,84 42,84 6 e0
      line coat_f1 48,56 48,82 c0
      line coat_f2 54,56 56,82 c0
      line coat_collar 44,52 60,52 c14
      dots coat_buttons 51,58 51,66 51,74 c14
      line peg 40,52 64,52 c0
      line pole_l_wing 0,0@1 0,136@1 c0
      line wing_seam_a 18,10 18,60 c0
      line wing_seam_b 80,28 80,92 c0
      poly stain_d 8,70 20,66 24,80 12,84 mix:6,0@0.5
      line wall_crease_l1 4,100 40,96 c0
      line wall_crease_l2 8,112 44,106 c0
      line wall_crease_r1 280,70 316,66 c0
      line wall_crease_r2 276,78 318,74 c0
      line rain_a 52,6 54,14 c14
      line rain_b 100,12 102,18 c14
      line rain_c 280,10 282,16 c14
      line rain_d 300,22 302,28 c14
      line lantern_cord 150,0 150,30 c0
      poly lantern_cap 145,28 155,28 153,32 147,32 0
      rect lantern_body 146,32,8,14 0 e0
      ellipse glow_out 150,39,12,10 6
      ellipse glow_in 150,39,6,6 14
      rect lantern_glass 147,34,6,10 12
      ellipse flame 150,40,2,3 12
      poly flame_core 149,39 151,39 151,42 149,42 14
      poly flame_tip_l 148,35 150,35 150,38 148,38 12
      poly flame_tip_r 150,35 152,35 152,38 150,38 6
      line lantern_base 146,46 154,46 c0
    `,
    cycles: [
      { name: "the flame", areas: ["flame_tip_l", "flame_tip_r"], colors: [12, 6], style: "flicker", ms: [500, 1600] },
      { name: "the lamplight", areas: ["glow_in", "glow_out", "back_lit", "floor_lit", "patch_a", "patch_b", "chest_top"], colors: [14, 6], style: "flicker", ms: [700, 2200] }
    ],
    overlays: [{ object: "parrot", at: [100, 70] }]
  },
  // ---- THE LANDING: the mud bank, the canoe and the crate, looking north over the river --------------------------------------
  landing: {
    version: 1,
    shot: "Wide landscape, eye level on the bank, facing north across the bend of the river, no vp; goldenhour; one low sun in the east (a flat yellow disc, x250, no halo), so shadows fall left, west; sky in flat bands of light red and yellow; the river in flat bands stepping from light red far off to brown, with the sun's path under the sun; subject the {canoe} half out of the water on x107 and the {crate} beside it on x165, second the gap of the {trail} in the far forest on x213; wings: a black trunk and fronds at the left, a stump and roots at the right, and thin smoke from the village in the left wing; the {fish} overlay on the mud at the left; moves: the sun's path on the water (moon path)",
    draw: `
      rect sky 0,0,320,58 12
      ellipse sun 250,16,9,9 14
      poly cloud_a 16,14 58,10 92,13 86,17 40,19 14
      poly cloud_d 190,8 226,6 240,10 204,12 14
      poly far_trees 0,58 0,48 10,44 18,47 28,41 38,45 50,42 60,47 72,43 84,48 96,44 110,47 124,42 140,46 156,43 170,47 186,41 200,45 228,46 244,41 258,45 272,42 286,46 300,43 314,47 320,45 320,58 0 e12
      poly mid_trees_a 0,64 0,54 12,50 22,53 34,47 46,52 58,56 70,50 84,54 96,58 110,52 124,56 130,64 6
      poly mid_trees_b 130,64 134,56 148,52 160,56 172,50 184,55 196,58 202,64 6
      poly mid_trees_c 232,64 236,56 250,50 262,54 276,48 290,53 304,50 320,54 320,64 6
      poly lit_a 12,50 22,53 34,47 40,50 28,52 6 e12
      poly lit_b 172,50 184,55 190,54 178,50 12
      poly lit_c 262,54 276,48 290,53 280,52 12
      poly lit_d 304,50 320,54 320,52 314,49 12
      poly lit_e 58,56 70,50 78,52 66,55 12
      poly lit_f 110,52 124,56 120,52 12
      poly gap 202,58 206,52 218,52 224,58 232,64 202,64 0
      poly gap_path 206,64 226,64 232,76 200,76 6
      poly gap_lit 210,64 220,64 224,72 212,72 12
      line trunk_a 20,54 22,66 c0
      line trunk_b 90,54 92,66 c0
      line trunk_c 150,54 152,66 c0
      line trunk_d 244,52 246,66 c0
      line trunk_e 296,52 298,66 c0
      poly far_bank 0,64 320,64 320,70 0,70 6
      poly far_bank_lit 220,64 320,64 320,67 220,67 12
      poly river_far 0,70 320,70 320,78 0,78 12
      poly river_mid 0,78 320,78 320,92 0,92 6
      poly river_near 0,92 320,92 320,104 0,104 6
      line dash_a 14,72 30,72 c14
      line dash_b 60,74 70,74 c14
      line dash_c 110,72 126,72 c14
      line dash_d 150,75 160,75 c14
      line dash_e 280,73 296,73 c14
      line dash_f 30,82 48,82 c5
      line dash_g 80,86 100,86 c5
      line dash_h 140,82 158,82 c5
      line dash_i 200,85 220,85 c5
      line dash_j 270,84 290,84 c5
      line dash_k 20,96 44,96 c5
      line dash_l 120,98 150,98 c5
      line dash_m 230,96 262,96 c5
      line path_a 236,72 262,72 c14
      line path_b 232,76 270,76 c12
      line path_c 226,82 276,82 c14
      line path_d 218,88 282,88 c12
      line path_e 206,95 290,95 c14
      line path_f 196,102 300,102 c12
      poly bank 0,136 0,98 24,94 60,98 96,95 130,100 170,97 210,102 250,99 296,103 320,100 320,136 6
      poly bank_far 0,98 24,94 60,98 96,95 130,100 170,97 210,102 250,99 296,103 320,100 320,104 0,104 5
      poly bank_lit 170,97 210,102 250,99 296,103 320,100 320,106 250,106 200,106 12
      poly mud_a 0,112 40,108 76,112 60,118 20,118 5
      poly mud_b 180,112 230,108 270,114 240,120 196,118 5
      poly mud_c 270,122 300,118 320,122 320,132 280,132 5
      poly mud_d 20,126 70,122 100,128 70,134 24,134 5
      line rut_a 6,116 40,114 c0
      line rut_b 40,122 90,119 c0
      line rut_c 200,126 250,123 c0
      line rut_d 160,130 210,127 c0
      line rut_e 280,128 316,124 c0
      line crack_a 120,118 130,122 124,128 c0
      line crack_b 232,116 240,121 236,126 c0
      poly stone_a 108,126 113,124 117,127 109,129 12
      line stone_a_under 109,129 117,127 c0
      poly stone_b 196,132 201,130 205,133 197,135 12
      line stone_b_under 197,135 205,133 c0
      poly mud_e 90,120 126,118 134,123 96,126 5
      line print_a 140,126 148,125 c0
      line print_b 150,130 158,129 c0
      line print_c 130,131 138,130 c0
      poly pebble_a 236,126 241,124 244,127 237,129 12
      line pebble_a_under 237,129 244,127 c0
      poly pebble_b 52,130 57,128 60,131 53,133 12
      line canoe_shadow 70,116 160,116 c0
      poly canoe_shade 54,112 120,114 150,114 130,118 66,118 0
      poly canoe_hull 62,106 74,102 120,98 144,100 152,106 146,112 126,114 76,114 0 e12
      poly canoe_in 74,104 120,101 142,102 146,106 138,109 78,110 6
      poly canoe_bilge 82,106 130,104 140,106 132,108 86,108 5
      line canoe_thwart_a 96,102 98,109 c0
      line canoe_thwart_b 120,101 122,108 c0
      line canoe_thwart_c 108,100 110,107 c0
      line canoe_bow 60,108 66,103 c0
      line canoe_rim_lit 76,102 122,98 142,100 c12
      line canoe_grain_a 70,112 130,112 c6
      line canoe_grain_b 66,108 74,110 c6
      dots canoe_marks 88,111 104,112 118,112 134,112 c6
      poly crate_shade 150,114 190,114 200,120 160,120 0
      rect crate 156,98,32,18 6 e0
      poly crate_top 156,98 188,98 192,94 160,94 12 e0
      poly crate_side 188,98 192,94 192,112 188,116 5 e0
      line crate_plank_a 156,104 188,104 c0
      line crate_plank_b 156,110 188,110 c0
      line crate_lid_edge 158,98 188,98 c0
      rect crate_stencil 164,100,14,3 0
      dots crate_nails 158,100 158,112 186,100 186,112 c14
      line crate_grain 160,107 176,107 c6
      line crate_split 172,110 176,114 c0
      poly stump 292,110 312,108 316,126 288,128 0 e12
      poly stump_top 292,108 312,106 314,110 294,112 6 e0
      line stump_ring 296,109 308,108 c5
      line root_a 288,126 276,134 c0
      line root_b 292,128 286,136 c0
      line root_c 314,126 320,134 c0
      poly trunk_near 0,0 14,0 16,40 12,76 18,112 8,136 0,136 0 e12
      line trunk_near_hi 12,10 13,70 c6
      line trunk_near_lit 14,50 15,100 c12
      poly frond_a 14,70 40,60 50,70 30,68 0
      poly frond_b 14,86 38,84 56,96 32,92 0
      poly frond_c 14,52 34,40 46,44 28,50 0
      line frond_vein_a 16,70 44,64 c6
      line frond_vein_b 16,86 50,92 c6
      line smoke 34,60 36,52 33,44 36,36 33,28 c5
      line smoke_b 36,56 38,48 36,40 c12
      poly reeds_l 22,100 24,86 26,100 0
      poly reeds_l2 28,100 31,84 33,100 0
      poly reeds_l3 36,100 38,90 40,100 0
      poly reeds_r 286,100 288,88 290,100 0
      poly reeds_r2 294,100 297,86 299,100 0
      poly reeds_r3 302,100 304,92 306,100 0
      line reeds_r_lit 297,100 299,88 c12
      line root_d 296,126 300,134 c0
      line root_e 308,126 312,134 c0
    `,
    cycles: [
      { name: "the sun's path", areas: ["path_a", "path_b", "path_c", "path_d", "path_e", "path_f"], colors: [12, 14, 6], style: "rotate", ms: 600 }
    ],
    overlays: [{ object: "fish", at: [40, 104] }]
  },
  // ---- THE VILLAGE: the yard, the houses on stilts, the racks and the fire, looking north -------------------------------------
  village: {
    version: 1,
    shot: "Eye level in the yard, facing north, no vp; noon; the sun overhead, so no cast shadows, only contact shadows under the eaves and stilts; sky in three flat bands of light blue, light cyan and white; forest wall behind in greens; thatched houses on stilts, yellow thatch with brown rows; subject Ennu sitting at the middle house on x107 with her cord, second the {racks} of fish over a low {fire} on x213, a thin trail of smoke going up from it; wings: a house with a ladder at the left, Kito's house on the right with {paddles} leaning on it and Kito standing, banana plants; moves: the smoke (a loop, rising from the fire), the firelight (flicker)",
    draw: `
      rect sky_a 0,0,320,48 9
      poly cloud_a 20,8 56,6 78,10 50,13 15
      poly cloud_b 200,12 240,9 272,13 230,16 15
      poly cloud_c 120,24 150,22 170,26 140,28 15
      poly forest_far 0,76 0,52 12,46 26,50 40,44 56,49 70,43 86,48 100,42 118,47 132,41 150,46 166,42 184,47 200,41 218,46 234,42 252,48 268,43 286,47 302,42 320,47 320,76 2
      poly forest_lit_a 40,44 56,49 70,43 60,45 10
      poly forest_lit_b 132,41 150,46 166,42 150,43 10
      poly forest_lit_c 252,48 268,43 286,47 272,46 10
      poly forest_lit_d 0,52 12,46 26,50 14,50 10
      poly forest_mass_a 0,76 0,62 20,58 34,64 54,60 74,66 96,60 116,66 140,62 160,67 184,61 210,66 236,60 262,65 286,59 304,64 320,60 320,76 2
      poly forest_clump_a 8,64 22,60 32,66 18,68 10
      poly forest_clump_b 100,62 116,60 126,66 108,68 10
      poly forest_clump_c 188,62 204,60 214,66 196,68 10
      poly forest_clump_d 270,62 286,60 296,66 280,68 10
      line trunk_a 60,56 62,76 c0
      line trunk_b 150,52 152,76 c0
      line trunk_c 236,52 238,76 c0
      line trunk_d 300,50 302,76 c0
      poly ground_far 0,76 320,76 320,92 0,92 14
      poly ground_mid 0,92 320,92 320,112 0,112 6
      poly ground_near 0,112 320,112 320,136 0,136 6
      poly ground_mid_lit 0,92 320,92 320,98 0,98 14
      poly patch_a 20,100 60,98 76,104 44,108 6
      poly patch_b 230,100 280,98 296,106 250,110 14
      poly patch_c 120,116 170,114 190,122 140,124 14
      poly patch_d 10,122 54,120 70,128 24,132 14
      poly patch_e 250,120 300,118 316,128 270,130 14
      line rut_a 4,118 60,116 c0
      line rut_b 80,126 150,122 c0
      line rut_c 200,128 280,124 c0
      line rut_d 170,104 230,102 c0
      line rut_e 30,134 110,130 c0
      line crack_a 150,118 158,122 152,128 c0
      line crack_b 276,112 284,116 280,122 c0
      line sweep_a 100,108 130,106 c14
      line sweep_b 104,112 140,110 c14
      line sweep_c 150,108 180,106 c14
      dots print_a 140,120 146,118 150,124 156,122 c0
      poly h2_stilt_l 78,88 82,88 82,104 78,104 0
      poly h2_stilt_m 108,88 112,88 112,104 108,104 0
      poly h2_stilt_r 136,88 140,88 140,104 136,104 0
      poly h2_floor 72,84 144,84 146,90 70,90 6 e0
      poly h2_wall 76,66 140,66 140,84 76,84 6 e0
      poly h2_door 100,68 118,68 118,84 100,84 0
      line h2_plank_a 84,66 84,84 c0
      line h2_plank_b 94,66 94,84 c0
      line h2_plank_c 126,66 126,84 c0
      line h2_plank_d 134,66 134,84 c0
      poly h2_roof 62,70 76,44 140,44 154,70 14 e0
      poly h2_roof_shade 112,44 140,44 154,70 130,70 6
      poly h2_eave 60,70 156,70 152,76 64,76 6 e0
      line h2_row_a 68,62 148,62 c6
      line h2_row_b 72,54 144,54 c6
      line h2_row_c 76,48 140,48 c6
      line h2_row_d 62,68 154,68 c0
      poly h2_ladder_l 148,76 150,76 150,104 148,104 0
      poly h2_ladder_r 154,76 156,76 156,104 154,104 0
      line h2_rung_a 148,82 156,82 c0
      line h2_rung_b 148,90 156,90 c0
      line h2_rung_c 148,98 156,98 c0
      poly h1_stilt_a 6,88 10,88 10,104 6,104 0
      poly h1_stilt_b 32,88 36,88 36,104 32,104 0
      poly h1_stilt_c 54,88 58,88 58,104 54,104 0
      poly h1_floor 0,84 64,84 66,90 0,90 6 e0
      poly h1_wall 0,70 56,70 56,84 0,84 6 e0
      poly h1_roof -4,76 10,50 52,50 70,76 14 e0
      poly h1_roof_shade 34,50 52,50 70,76 48,76 6
      line h1_row_a 4,70 64,70 c6
      line h1_row_b 8,62 58,62 c6
      line h1_row_c 14,56 50,56 c6
      line h1_row_d 0,75 66,75 c0
      poly h1_door 22,72 38,72 38,84 22,84 0
      poly h3_stilt_a 254,88 258,88 258,104 254,104 0
      poly h3_stilt_b 286,88 290,88 290,104 286,104 0
      poly h3_stilt_c 312,88 316,88 316,104 312,104 0
      poly h3_floor 248,84 320,84 320,90 246,90 6 e0
      poly h3_wall 252,66 320,66 320,84 252,84 6 e0
      poly h3_roof 242,70 258,44 320,44 320,70 14 e0
      poly h3_roof_shade 290,44 320,44 320,70 308,70 6
      line h3_row_a 246,62 320,62 c6
      line h3_row_b 252,54 320,54 c6
      line h3_row_c 258,48 320,48 c6
      line h3_row_d 242,68 320,68 c0
      poly h3_door 270,68 286,68 286,84 270,84 0
      poly paddle_a 244,70 247,70 249,108 245,108 14 e0
      poly paddle_a_blade 241,98 251,98 251,112 241,112 14 e0
      poly paddle_b 232,76 235,76 237,108 233,108 14 e0
      poly paddle_b_blade 229,100 239,100 239,112 229,112 14 e0
      line paddle_a_edge 242,100 242,110 c6
      line paddle_b_edge 230,102 230,110 c6
      poly kito_body 275,87 277,85 280,85 282,87 282,91 280,93 284,95 285,100 284,112 283,119 284,127 281,127 279,119 278,117 277,119 275,127 272,127 273,119 272,112 271,100 272,95 276,93 274,91 4 e0
      poly kito_legs 274,116 278,116 277,127 273,127 6
      poly kito_legs2 279,116 283,116 284,127 280,127 6
      ellipse kito_head 278,89,3,4 6 e0
      line kito_blade 284,100 292,98 c14
      line kito_blade2 286,100 292,102 c14
      poly rack_post_l 184,76 187,76 187,106 184,106 0
      poly rack_post_r 232,76 235,76 235,106 232,106 0
      line rack_bar_a 184,82 235,82 c0
      line rack_bar_b 184,90 235,90 c0
      poly fish_a 190,83 194,83 193,92 191,92 12 e4
      poly fish_b 199,83 203,83 202,92 200,92 12 e4
      poly fish_c 208,83 212,83 211,92 209,92 12 e4
      poly fish_d 217,83 221,83 220,92 218,92 12 e4
      poly fish_e 226,83 230,83 229,92 227,92 12 e4
      poly fish_f 194,91 198,91 197,100 195,100 12 e4
      poly fish_g 204,91 208,91 207,100 205,100 12 e4
      poly fish_h 214,91 218,91 217,100 215,100 12 e4
      poly fish_i 224,91 228,91 227,100 225,100 12 e4
      ellipse fire_glow_o 210,110,24,8 6
      ellipse fire_glow_i 210,110,13,5 14
      poly fire_stones 196,112 224,112 222,118 198,118 8 e0
      ellipse fire_stone_a 198,114,4,3 7 e0
      ellipse fire_stone_b 210,117,5,3 7 e0
      ellipse fire_stone_c 222,114,4,3 7 e0
      poly fire_logs 200,111 220,109 220,113 200,115 0
      poly flame_a 203,110 207,98 210,108 214,96 217,108 219,110 12
      poly flame_b 206,110 210,102 213,110 14
      line log_grain 202,113 218,111 c6
      poly ennu_body 103,86 104,83 107,82 110,83 111,86 110,90 109,92 115,93 117,98 118,106 121,110 120,114 94,114 95,110 97,106 97,98 99,93 105,92 104,90 4 e0
      ellipse ennu_head 107,88,5,6 6 e0
      poly ennu_hair 101,84 113,84 112,88 102,88 15
      poly ennu_knees 96,108 118,108 120,114 94,114 6
      line ennu_cord 98,110 116,112 c14
      dots ennu_knots 100,111 104,111 108,112 112,112 c0
      line ennu_arm 112,96 117,106 c0
      poly mat 90,114 122,114 126,120 88,120 14 e0
      line mat_a 94,116 120,116 c6
      poly plant_b_back 163,92 154,84 146,86 142,92 150,91 158,94 2
      poly plant_a_back 163,92 172,82 182,84 186,90 178,89 170,93 2
      poly plant_c_front 162,92 159,80 165,75 168,82 167,92 10 e0
      line plant_stem 163,100 163,90 c2
      line plant_vein_a 164,90 164,78 c0
      ellipse bush_l 20,100,14,8 2 e0
      ellipse bush_l_lit 18,97,9,4 10
      poly pot_a 130,114 142,114 144,124 128,124 6 e0
      line pot_rim 130,114 142,114 c14
      line pot_band 129,119 143,119 c0
      line pot_hi 132,116 132,122 c14
    `,
    cycles: [
      { name: "the firelight", areas: ["fire_glow_i", "fire_glow_o", "flame_a"], colors: [14, 6], style: "flicker", ms: [500, 1600] }
    ],
    loops: [
      { name: "the smoke", at: [205, 66], ms: 280, style: "loop",
        frames: [
          [".........8..8...", ".........8..8...", ".........8..8...", ".........8..8...", ".........8......", "......8..8......", "......8.........", "......8.........", "......8.........", "......8.........", "......8.........", "......8..8......", ".........8......", ".........8......", ".........8......", "........777.....", ".......7.7......", "......77........", "....77..........", "....77..........", "...7............", "....7...........", "....77..........", ".....77.........", "......77........", ".......77.......", ".......77.......", ".......77.......", "......7.........", ".....7.........."],
          [".........8..8...", ".........8..8...", ".........8......", "......8..8......", "......8..8......", "......8.........", "......8.........", "......8.........", "......8.........", "......8..8......", ".........8......", ".........8......", ".........8......", ".........8......", ".........8......", "......77........", "....77..........", "....77..........", "...7.7..........", "....7...........", "....77..........", ".....77.........", "......77........", ".......77.......", ".......77.......", ".......77.......", "......77........", "....77..........", "....7...........", "...7............"],
          [".........8......", "......8..8......", "......8..8......", "......8.........", "...8..8.........", "......8.........", "......8.........", "......8..8......", ".........8......", ".........8......", ".........8......", ".........8......", ".........8......", "......8.........", "......8.........", "....77..........", "...7.7..........", "...77...........", "....77..........", ".....77.........", "......77........", ".......77.......", ".......77.......", "........7.......", "......77........", "....77..........", "...77...........", "..77............", "..7.............", "...7............"],
          ["......8..8......", "......8.........", "...8..8.........", "...8..8.........", "......8.........", "......8..8......", ".........8......", ".........8......", ".........8......", ".........8......", "......8..8......", "......8.........", "......8.........", "...8............", "...8............", "...77...........", "....77..........", ".....77.........", "......77........", ".......77.......", ".......77.......", "........7.......", "......77........", "....7...........", "...77...........", "..77............", "..77............", "..77............", "...7............", "....7..........."],
          ["...8..8.........", "...8..8.........", "......8.........", "......8..8......", "......8..8......", ".........8......", ".........8......", ".........8......", "......8..8......", "......8.........", "......8.........", "...8..8.........", "...8............", "...8............", "......8.........", ".....77.........", "......77........", "......777.......", ".......777......", "........7.......", "......77........", "....7...........", "...77...........", "..7.............", "..77............", "..77............", "...77...........", "....77..........", ".....7..........", "......7........."],
          ["......8.........", "......8..8......", "......8..8......", ".........8......", ".........8......", ".........8......", "......8..8......", "......8.........", "......8.........", "...8..8.........", "...8............", "...8..8.........", "......8.........", "......8.........", "......8.........", "......777.......", ".......777......", "......7.7.......", ".....777........", "....7...........", "...77...........", "..7.............", "..77............", "..77............", "...77...........", "....77..........", ".....77.........", ".....77.........", "......7.........", "......7........."]
        ] }
    ]
  },
  // ---- THE TRAIL: the path going away north under the trunks, the carved post at the fork ------------------------------------------
  trail: {
    version: 1,
    shot: "Eye level on the path, facing north, one-point, vp 107,62 (the bright far end of the trail); forest palette; one light, the sun through gaps in the canopy, flat yellow patches on the path and the ground, no cast shadows; the path in flat bands from yellow far off to green near, ruts and tufts; subject the carved {post} at the fork on x213, second the pale {footprints} going north up the path to the bright end on x107; wings: a huge trunk with vines at the left, a trunk and ferns at the right; {toucans} and {monkeys} in the canopy; moves: three tufts in the wind (grass), nothing else",
    draw: `
      vp 107,62
      rect far_haze 0,0,320,74 10
      ellipse far_glow 107,58,34,18 14
      poly far_trunk_a 66,24 71,24 72,68 66,68 2
      poly far_trunk_b 80,26 84,26 85,68 80,68 2
      poly far_trunk_c 132,22 137,22 138,68 132,68 2
      poly far_trunk_d 148,26 152,26 153,68 148,68 2
      poly far_trunk_e 160,24 165,24 166,68 160,68 2
      poly far_trunk_f 24,26 30,26 31,68 24,68 2
      poly canopy_shade 0,0 320,0 320,34 314,39 304,43 294,39 288,34 282,39 272,42 262,39 256,34 250,40 240,43 230,40 224,34 218,38 208,41 198,38 192,34 186,39 176,43 166,39 160,34 154,39 144,42 134,39 128,34 122,40 112,43 102,40 96,34 90,38 80,41 70,38 64,34 58,39 48,43 38,39 32,34 26,39 16,42 6,39 0,34 0
      poly canopy_back 0,0 320,0 320,30 314,35 304,39 294,35 288,30 282,35 272,38 262,35 256,30 250,36 240,39 230,36 224,30 218,34 208,37 198,34 192,30 186,35 176,39 166,35 160,30 154,35 144,38 134,35 128,30 122,36 112,39 102,36 96,30 90,34 80,37 70,34 64,30 58,35 48,39 38,35 32,30 26,35 16,38 6,35 0,30 2
      ellipse canopy_lit_a 40,16,24,8 10
      ellipse canopy_lit_a2 64,20,14,6 10
      ellipse canopy_lit_b 150,14,26,8 10
      ellipse canopy_lit_b2 176,19,14,6 10
      ellipse canopy_lit_c 266,16,24,8 10
      ellipse canopy_lit_c2 240,20,14,6 10
      poly gap_a 74,24 82,21 92,25 97,31 90,36 80,34 14
      poly gap_b 152,25 162,22 171,26 174,32 166,37 156,35 14
      poly gap_c 260,25 270,22 280,26 284,32 276,37 264,35 14
      poly canopy_dark_l 0,0 80,0 80,12 76,17 70,21 64,17 60,12 56,17 50,20 44,17 40,12 36,17 30,21 24,17 20,12 16,17 10,20 4,17 0,12 0
      poly canopy_dark_m 112,0 214,0 214,10 209,15 201,18 194,15 188,10 183,15 176,18 168,15 163,10 158,14 150,17 143,14 138,10 132,15 125,18 117,15 112,10 0
      poly canopy_dark_r 248,0 320,0 320,14 315,19 308,22 301,19 296,14 291,19 284,23 277,19 272,14 267,19 260,22 253,19 248,14 0
      line vine_a 52,10 54,44 c10
      line vine_b 198,6 196,40 c10
      line vine_c 270,16 272,50 c10
      line vine_d 232,10 230,36 c0
      line vine_e 118,10 116,32 c10
      line vine_f 140,8 142,30 c0
      line limb_a 30,18 62,20 c0
      line limb_b 84,24 120,24 c0
      line limb_c 240,34 282,34 c0
      poly bank_mid_l 0,64 6,56 22,60 38,54 56,60 74,56 92,62 96,70 0,72 2
      poly bank_mid_r 122,66 134,58 152,62 170,56 190,62 210,58 230,62 250,56 270,60 286,56 320,60 320,72 122,72 2
      poly bank_lit_l 8,62 24,60 40,57 58,62 40,64 10
      poly bank_lit_r 140,62 160,59 176,58 196,62 172,64 10
      poly mid_trunk_a 168,36 178,36 180,70 166,70 2
      poly mid_trunk_a_shade 174,36 178,36 180,70 174,70 0
      poly mid_trunk_b 244,34 253,34 255,70 242,70 2
      poly mid_trunk_b_shade 249,34 253,34 255,70 249,70 0
      poly mid_trunk_c 46,36 54,36 56,70 44,70 2
      poly mid_trunk_c_shade 51,36 54,36 56,70 51,70 0
      poly mid_trunk_d 100,36 106,36 107,66 99,66 2
      poly mid_trunk_d_shade 103,36 106,36 107,66 103,66 0
      line mid_bark_a 171,40 172,66 c10
      line mid_bark_b 247,38 248,66 c10
      line mid_bark_c 49,40 50,66 c10
      line mid_bark_d 101,40 102,62 c10
      poly floor_far 0,70 320,70 320,82 0,82 10
      poly floor_mid 0,82 320,82 320,104 0,104 2
      poly floor_near 0,104 320,104 320,136 0,136 0
      poly path_far 80,136@0.28 230,136@0.28 230,136@0.12 80,136@0.12 14
      poly path_mid 80,136@0.6 230,136@0.6 230,136@0.28 80,136@0.28 10
      poly path_near 80,136@1 230,136@1 230,136@0.6 80,136@0.6 2
      line rut_a 120,136@1 120,136@0.2 c0
      line rut_b 180,136@1 180,136@0.2 c0
      line rut_c 150,136@0.9 150,136@0.3 c0
      line path_edge_l 80,136@1 80,136@0.12 c10
      line path_edge_r 230,136@1 230,136@0.12 c10
      poly patch_a 82,96 104,93 116,98 110,104 92,106 14
      poly patch_b 148,114 172,111 190,115 182,122 156,123 14
      poly patch_c 258,100 282,97 298,102 288,108 266,108 14
      poly patch_d 138,84 150,82 158,86 148,90 14
      ellipse print_a 128,108,5,3 0
      dots print_a_toes 122,104 126,103 130,103 134,104 c0
      ellipse print_b 118,98,4,3 0
      dots print_b_toes 113,95 116,94 120,94 123,95 c0
      ellipse print_c 112,90,3,2 0
      dots print_c_toes 108,87 111,86 114,86 116,87 c0
      ellipse print_d 134,120,5,3 0
      dots print_d_toes 129,116 c0
      poly fern_l_back 24,136 28,112 46,100 62,108 78,98 98,112 104,136 2
      poly fern_l_front 40,136 48,118 64,112 80,120 100,122 112,136 2
      poly fern_l_lit_a 36,112 46,104 60,110 76,102 90,112 70,116 52,118 10
      poly fern_l_lit_b 56,124 66,116 80,122 98,124 76,128 10
      poly fern_l_shade 40,136 112,136 104,130 48,130 0
      poly fern_r_back 236,136 240,114 256,102 270,110 286,100 296,116 300,136 2
      poly fern_r_front 218,136 226,120 244,114 262,122 280,126 296,136 2
      poly fern_r_lit_a 244,112 256,104 270,110 284,102 292,114 268,118 10
      poly fern_r_lit_b 232,126 244,118 262,124 276,128 250,130 10
      poly fern_r_shade 218,136 296,136 288,130 226,130 0
      poly trunk_l 0,0 28,0 34,40 30,84 38,136 0,136 0 e10
      line trunk_l_hi 24,0 28,44 26,90 c2
      line trunk_l_bark_a 8,10 12,50 c2
      line trunk_l_bark_b 16,30 18,80 c2
      line trunk_l_bark_c 6,76 12,116 c2
      poly trunk_l_root 0,124 20,116 40,136 0,136 0
      poly trunk_r 290,0 320,0 320,136 282,136 292,100 286,50 0 e10
      line trunk_r_hi 292,0 288,60 290,100 c2
      line trunk_r_bark_a 306,10 304,60 c2
      line trunk_r_bark_b 312,40 314,100 c2
      line trunk_r_bark_c 298,70 302,120 c2
      line trunk_r_bark_d 310,96 308,130 c2
      line trunk_l_bark_d 20,96 24,130 c2
      poly post_base 198,106 224,106 228,114 194,114 2 e0
      poly post 205,60 219,60 221,110 203,110 0 e10
      poly post_cap 203,58 221,58 219,62 205,62 14
      ellipse post_sun 212,72,4,4 14
      line post_ray_a 212,64 212,67 c14
      line post_ray_b 205,72 208,72 c14
      line post_ray_c 216,72 219,72 c14
      line post_down_a 206,84 209,86 212,84 215,86 218,84 c10
      line post_down_b 206,90 209,92 212,90 215,92 218,90 c10
      line post_up_a 206,98 209,96 212,98 215,96 218,98 c14
      line post_up_b 206,104 209,102 212,104 215,102 218,104 c14
      poly toucan_body 258,24 266,23 270,26 271,30 266,33 262,38 258,38 258,30 0
      poly toucan_beak 270,26 282,28 271,32 12
      poly toucan_chest 260,29 265,29 264,34 261,34 14
      poly toucan_eye 266,25 268,25 267,27 10
      poly monkey_a 36,6 40,5 44,8 44,12 47,16 45,20 40,21 36,18 37,12 6
      line monkey_a_tail 45,18 54,16 52,8 c6
      line monkey_a_arm 41,12 38,18 c0
      poly monkey_b 94,14 98,13 102,16 102,20 104,23 100,25 94,24 93,18 6
      line monkey_b_tail 103,22 112,24 110,32 c6
      line monkey_b_arm 98,18 95,23 c0
      line tuft_d 70,134 72,128 74,134 76,127 78,134 c10
      line tuft_e 230,134 232,128 234,134 236,127 238,134 c10
      line twin_a 100,132 105,126 104,132 109,124 108,132 113,126 112,132 c2
      line tuft_a 100,132 102,126 104,132 106,124 108,132 110,126 112,132 c10
      line twin_b 160,134 165,128 164,134 169,126 168,134 173,128 172,134 c2
      line tuft_b 160,134 162,128 164,134 166,126 168,134 170,128 172,134 c10
      line twin_c 204,132 209,126 208,132 213,124 212,132 217,126 216,132 c2
      line tuft_c 204,132 206,126 208,132 210,124 212,132 214,126 216,132 c10
    `,
    cycles: [
      { name: "the grass in the wind", areas: ["twin_a", "twin_b", "twin_c"], colors: [10, 10, 2], rest: 57, style: "rotate", sweep: [4, 27, 45], ms: 150 }
    ]
  },
  // ---- THE FIG: the hollow of roots, the thin jaguar on her limb, the stone tongue beside her ---------------------------------------
  fig: {
    version: 1,
    shot: "Eye level in the hollow of the strangler fig, facing north, no vp; forest palette; one light, a hole in the fig's crown at the top right, a flat yellow patch on the floor on x213 and a small lit root; no cast shadows (shade of the hollow); subject the {jaguar} lying along the lowest {limb} on x107, thin, her head on a root at the left, the stone {clapper} overlay hanging from the limb beside her; second the shaft's patch of light on the floor on x213; wings: near roots in black at both edges, leaf litter and a fungus shelf; moves: dust in the shaft (sunbeam)",
    draw: `
      rect back 0,0,320,100 10
      poly crown_shade 0,0 320,0 320,14 315,17 308,19 300,17 295,14 290,17 283,20 276,17 271,14 266,17 258,19 251,17 246,14 241,17 234,20 226,17 222,14 217,17 209,19 202,17 197,14 192,17 185,20 177,17 172,14 167,17 160,19 153,17 148,14 143,17 135,20 128,17 123,14 118,17 111,19 103,17 98,14 94,17 86,20 79,17 74,14 69,17 62,19 54,17 49,14 44,17 37,20 30,17 25,14 20,17 12,19 5,17 0,14 0
      poly crown 0,0 320,0 320,10 315,13 308,15 300,13 295,10 290,13 283,16 276,13 271,10 266,13 258,15 251,13 246,10 241,13 234,16 226,13 222,10 217,13 209,15 202,13 197,10 192,13 185,16 177,13 172,10 167,13 160,15 153,13 148,10 143,13 135,16 128,13 123,10 118,13 111,15 103,13 98,10 94,13 86,16 79,13 74,10 69,13 62,15 54,13 49,10 44,13 37,16 30,13 25,10 20,13 12,15 5,13 0,10 2
      poly hole 208,0 246,0 245,8 238,13 228,10 218,14 210,9 14
      ellipse crown_lit_a 60,5,26,4 10
      ellipse crown_lit_b 150,5,30,4 10
      ellipse crown_lit_c 282,5,24,4 10
      poly shaft_air 214,12 240,12 246,104 190,104 14
      poly r2 44,0 58,0 52,60 62,100 46,100 38,50 2 e0
      poly r3 86,0 102,0 98,50 106,66 90,66 82,30 2 e0
      poly r4 130,0 146,0 142,50 150,66 132,66 126,30 2 e0
      poly r5 168,0 184,0 180,50 188,66 170,66 164,30 2 e0
      poly r6 250,0 270,0 266,50 272,76 252,76 246,40 2 e0
      line r2_hi 50,0 46,48 52,96 c10
      line r3_hi 94,0 90,32 96,64 c10
      line r4_hi 138,0 134,32 140,64 c10
      line r5_hi 176,0 172,32 178,64 c10
      line r6_hi 260,0 256,37 262,74 c10
      line r2_bark_a 54,10 52,40 c0
      line r3_bark_a 98,8 96,40 c0
      line r4_bark_a 142,8 140,40 c0
      line r6_bark_a 266,8 264,44 c0
      line r2_bark_b 48,44 46,72 c0
      line r3_bark_b 90,30 88,60 c0
      line r4_bark_b 134,30 132,58 c0
      line r5_bark_a 172,20 170,52 c0
      line r6_bark_b 256,30 254,64 c0
      line r2_crack 52,70 56,84 c0
      poly r_twist_a 60,40 84,36 86,44 62,48 2 e0
      poly r_twist_b 104,28 128,34 126,42 102,36 2 e0
      poly r_twist_c 200,30 244,36 242,44 198,38 2 e0
      poly r_twist_d 144,40 166,34 168,42 146,48 2 e0
      line twist_hi_a 62,41 84,38 c10
      line twist_hi_b 104,30 126,35 c10
      line twist_hi_c 202,32 242,37 c10
      poly lit_root 238,14 252,16 250,46 240,46 14 e0
      line lit_root_a 242,18 244,42 c10
      poly floor_far 0,100 320,100 320,112 0,112 10
      poly floor_mid 0,112 320,112 320,124 0,124 2
      poly floor_near 0,124 320,124 320,136 0,136 0
      poly litter_a 18,104 40,100 66,102 74,108 50,110 26,110 2
      poly litter_b 250,104 276,100 304,103 306,109 280,111 258,110 2
      poly litter_c 84,116 112,112 146,114 150,120 116,122 90,122 0
      poly litter_d 40,128 70,124 104,126 112,132 76,134 46,134 2
      poly litter_e 214,126 244,122 280,125 290,132 250,134 222,133 2
      poly litter_hi_a 30,104 50,102 64,105 46,107 10
      poly litter_hi_b 262,104 280,102 296,105 276,107 10
      poly litter_hi_c 98,116 118,114 138,116 118,118 10
      poly litter_hi_d 52,128 72,126 94,128 72,130 10
      poly litter_hi_e 228,128 248,125 270,128 248,130 10
      poly floor_light 188,106 214,103 240,105 252,114 244,121 206,122 186,116 14 e0
      poly floor_light_b 202,124 222,122 238,125 232,129 206,129 14
      line floor_light_a 196,112 244,112 c10
      line floor_light_c 206,126 234,126 c10
      poly limb 28,60 262,54 264,70 26,76 2 e0
      poly limb_top 28,60 262,54 262,58 28,64 10
      poly limb_under 26,72 264,66 264,70 26,76 0
      line limb_grain_a 40,66 130,64 c0
      line limb_grain_b 180,62 250,60 c0
      poly limb_knot_a 150,64 158,63 158,70 150,71 0
      poly limb_knot_b 226,60 234,60 234,67 226,67 0
      line limb_crack 100,66 108,72 c0
      poly root_head 52,58 90,56 92,66 50,68 2 e0
      line root_head_hi 54,60 88,58 c10
      poly jag_body 58,57 57,52 62,49 65,44 71,40 74,35 78,41 83,41 85,43 94,43 107,41 126,40 150,40 171,41 184,43 191,48 193,55 198,64 200,78 197,90 191,96 189,92 193,84 193,72 189,64 188,62 182,64 180,76 179,81 174,81 176,74 173,64 161,62 135,62 117,63 106,63 104,76 101,80 97,80 98,72 98,64 89,62 80,62 71,62 63,61 58,60 14 e0
      poly jag_shade 90,59 117,60 152,59 180,59 184,61 173,63 161,62 135,62 117,63 107,63 98,62 6
      poly jag_ear 72,41 74,37 77,42 6
      ellipse jag_eye 66,48,2,1 0
      poly jag_nose 58,54 61,54 61,57 58,57 12
      line jag_mouth 59,59 69,60 c0
      line jag_whisk_a 58,56 50,54 c0
      line jag_whisk_b 58,58 50,60 c0
      dots jag_spots 96,45 97,45 96,46 97,46 108,51 109,51 108,52 109,52 120,45 121,45 120,46 121,46 132,51 133,51 132,52 133,52 144,45 145,45 144,46 145,46 156,51 157,51 156,52 157,52 168,45 169,45 168,46 169,46 180,51 181,51 180,52 181,52 76,46 77,46 84,50 85,50 112,56 113,56 140,56 141,56 168,55 169,55 c0
      line jag_belly 100,62 190,60 c0
      line jag_rib_a 112,52 116,60 c0
      line jag_rib_b 130,50 134,58 c0
      line jag_rib_c 148,48 152,56 c0
      line jag_rib_d 166,48 170,56 c0
      line jag_claw_a 106,81 108,84 c0
      line jag_claw_b 110,81 112,84 c0
      line jag_tail_ring_a 200,76 206,76 c0
      line jag_tail_ring_b 198,84 204,84 c0
      line cord_loop 156,56 156,64 c0
      poly mushroom_a 276,84 296,82 298,90 278,92 15 e0
      poly mushroom_b 280,92 298,90 300,98 282,100 15 e0
      poly mushroom_light 278,93 298,91 299,95 280,97 14
      line mushroom_lines 280,88 294,87 c0
      line mushroom_gill_a 281,95 297,93 c0
      poly near_l 0,0 28,0 24,60 34,136 0,136 0 e10
      poly near_r 290,0 320,0 320,136 286,136 294,98 288,50 0 e10
      poly near_l_root 0,100 30,96 44,136 0,136 0 e10
      poly near_r_root 320,104 296,100 280,136 320,136 0 e10
      line near_l_hi 24,0 20,50 26,100 c2
      line near_r_hi 292,0 288,50 294,100 c2
      line near_l_bark_a 8,10 10,70 c2
      line near_l_bark_b 14,30 16,110 c2
      line near_r_bark_a 306,10 308,80 c2
      line near_r_bark_b 300,40 302,120 c2
      line near_l_bark_c 4,60 6,120 c2
      line near_r_bark_c 314,50 312,120 c2
      line r5_bark_b 168,44 170,62 c0
      line r6_bark_c 262,50 264,72 c0
      line r2_bark_c 46,70 48,96 c0
      line r3_bark_c 94,48 96,64 c0
      line r4_bark_c 138,48 140,64 c0
      poly r_twist_e 262,58 290,64 288,72 260,66 2 e0
      line twist_hi_d 144,42 166,36 c10
      line twist_hi_e 262,60 288,66 c10
      ellipse crown_lit_d 100,5,22,4 10
      ellipse crown_lit_e 20,5,18,4 10
      poly litter_f 150,106 176,103 200,105 196,110 160,110 2
      poly litter_hi_f 158,106 176,104 192,106 174,108 10
      poly litter_hi_g 52,106 66,104 76,107 60,109 10
      line limb_grain_c 60,70 120,68 c0
      line limb_grain_d 150,68 210,66 c0
      line jag_brow 66,47 72,46 c0
      poly jag_ear_b 90,43 93,38 96,44 6
      line jag_cheek 70,56 76,58 c0
      poly mushroom_c 270,98 284,96 286,102 272,104 15 e0
      line mushroom_gill_b 272,101 284,99 c0
      line near_l_bark_d 20,40 22,100 c2
      line near_r_bark_d 304,30 306,110 c2
      dots shaft_specks 218,16 224,20 232,24 220,28 228,32 236,36 222,40 230,44 238,48 216,52 226,56 234,60 220,64 230,68 238,72 222,76 232,80 218,84 226,88 236,92 224,96 234,100 216,22 238,30 214,46 240,58 216,70 238,82 214,92 236,18 c14
    `,
    cycles: [
      { name: "the dust in the shaft", areas: ["shaft_specks"], colors: [14, 14, 14, 15, 10], style: "pingpong", scatter: true, ms: 380 }
    ],
    overlays: [{ object: "clapper", at: [150, 56] }]
  },
  // ---- THE GORGE: from the lip, looking east along the rope bridge to the temple across the chasm -----------------------------------
  gorge: {
    version: 1,
    shot: "Wide landscape from the lip of the gorge, facing east (the text says you look east across it; the bridge is the way east), one-point, vp 213,62 (the temple across); noon palette; the sun overhead, no cast shadows; sky in three flat bands, far forest in greens; subject the rope {bridge} on x107 running away to the far side, its planks grey as bone with three gaps and its ropes frayed, second the stepped {temple} among trees on x213, a dark gate in its front; chasm walls in brown and yellow steps, white water far below, a {falls} on the far wall; wings: near cliff tops with tufts and a leaning tree at the left, rocks and ferns at the right; moves: the fall (running water), birds far off (loop)",
    draw: `
      vp 213,62
      rect sky_a 0,0,320,66 9
      poly cloud_a 20,10 66,8 92,12 56,15 15
      poly cloud_b 150,14 196,10 226,14 180,18 15
      poly cloud_c 252,6 300,4 320,8 280,11 15
      poly hills 0,72 0,58 36,52 84,58 134,50 190,56 246,50 320,58 320,72 10
      poly hills_dark 0,72 0,66 50,62 110,66 170,62 240,66 320,62 320,72 2
      poly far_side 0,66 320,66 320,82 0,82 2
      poly clump_a 120,66 140,58 160,62 170,70 10
      poly clump_b 262,66 280,56 300,60 320,66 10
      poly clump_c 140,70 156,64 168,72 148,74 10
      poly clump_d 250,70 266,62 280,70 262,74 10
      line trunk_a 130,62 132,76 c0
      line trunk_b 276,60 278,76 c0
      poly temple_t1 168,58 258,58 262,70 164,70 14 e0
      poly temple_t2 182,46 244,46 248,58 178,58 14 e0
      poly temple_t3 198,36 228,36 232,46 194,46 14 e0
      poly temple_comb 206,28 220,28 222,36 204,36 6 e0
      poly temple_shade_a 240,58 258,58 262,70 244,70 6
      poly temple_shade_b 226,46 244,46 248,58 230,58 6
      poly temple_shade_c 220,36 228,36 232,46 222,46 6
      poly temple_gate 206,60 220,60 220,70 206,70 0 e14
      poly temple_gate_arch 208,56 218,56 220,60 206,60 0
      line temple_line_a 166,64 260,64 c6
      line temple_line_b 180,52 246,52 c6
      line temple_line_c 196,41 230,41 c6
      poly temple_steps 196,70 232,70 244,82 186,82 14 e0
      line step_a 192,74 238,74 c6
      line step_b 188,78 242,78 c6
      poly chasm_far_wall 0,82 320,82 320,100 0,100 6
      poly chasm_far_lit 0,82 320,82 320,86 0,86 14
      poly chasm_far_rock_a 160,86 190,86 194,96 164,96 14
      poly chasm_far_rock_b 250,88 290,88 294,98 254,98 14
      poly chasm_far_rock_c 120,90 146,90 148,98 122,98 6
      line chasm_crack_a 170,88 174,98 c0
      line chasm_crack_b 266,88 270,98 c0
      line chasm_crack_c 200,86 204,96 c0
      poly water_far 0,100 320,100 320,112 0,112 11
      poly water_far_foam 140,102 190,102 196,108 144,108 15
      poly water_far_foam_b 230,104 290,104 296,110 234,110 15
      poly water_mid 0,112 320,112 320,124 0,124 9
      poly water_mid_foam 130,114 190,114 196,120 134,120 11
      line water_dash_a 200,116 240,116 c11
      line water_dash_b 252,120 290,120 c11
      line water_dash_c 110,118 126,118 c15
      poly fall_body 124,82 140,82 140,100 124,100 11
      line fall_row_a 126,84 138,84 c15
      line fall_row_b 126,88 138,88 c15
      line fall_row_c 126,92 138,92 c15
      line fall_row_d 126,96 138,96 c15
      line fall_lip 122,81 142,81 c15
      poly fall_spray 118,98 148,98 150,104 120,104 15
      poly cliff_l_far 0,86 60,82 90,90 80,112 0,112 6
      poly cliff_l_lit 0,86 60,82 90,90 88,94 0,92 14
      line cliff_l_crack_a 20,94 24,108 c0
      line cliff_l_crack_b 50,90 54,106 c0
      line cliff_l_crack_c 72,94 74,110 c0
      poly cliff_r_far 300,100 320,96 320,112 296,112 6
      poly water_near 0,124 320,124 320,136 0,136 9
      line water_near_a 110,128 150,128 c11
      line water_near_b 210,130 260,130 c11
      line water_near_c 80,132 100,132 c15
      poly ground_l 0,136 0,108 34,104 70,112 92,124 100,136 14
      poly ground_l_mid 0,108 34,104 70,112 92,124 96,128 0,122 6
      poly ground_r 172,136 180,126 206,120 250,114 320,108 320,136 14
      poly ground_r_mid 206,120 250,114 320,108 320,116 244,122 200,126 6
      line ground_l_edge 34,104 70,112 92,124 100,136 c0
      line ground_r_edge 172,136 180,126 206,120 250,114 320,108 c0
      line cliff_crack_l 40,116 50,130 c0
      line cliff_crack_r 240,126 250,136 c0
      line tuft_l_a 14,106 16,100 18,106 20,99 22,106 24,101 26,106 c2
      line tuft_l_b 40,110 42,104 44,110 46,103 48,110 50,105 52,110 c10
      line tuft_r_a 270,112 272,106 274,112 276,105 278,112 280,107 282,112 c2
      line tuft_r_b 296,110 298,104 300,110 302,103 304,110 306,105 308,110 c10
      poly ground_patch_l 8,122 40,120 52,128 18,130 6
      poly ground_patch_r 220,126 270,124 290,132 232,134 6
      line ground_rut_l 4,128 60,126 c0
      line ground_rut_r 210,130 300,128 c0
      line ground_r_crack 268,128 284,132 c0
      poly stone_l 24,118 29,116 32,119 25,121 6
      line stone_l_under 25,121 32,119 c0
      poly stone_r 250,128 255,126 258,129 251,131 6
      line stone_r_under 251,131 258,129 c0
      poly deck 96,136@1 150,136@1 150,136@0.15 96,136@0.15 0
      poly plank_1 96,136@1 150,136@1 150,136@0.9 96,136@0.9 14 e0
      poly plank_2 96,136@0.82 150,136@0.82 150,136@0.72 96,136@0.72 14 e0
      poly plank_3 96,136@0.58 150,136@0.58 150,136@0.5 96,136@0.5 14 e0
      poly plank_4 96,136@0.42 150,136@0.42 150,136@0.35 96,136@0.35 14 e0
      poly plank_5 96,136@0.27 150,136@0.27 150,136@0.22 96,136@0.22 14 e0
      poly plank_6 96,136@0.18 150,136@0.18 150,136@0.15 96,136@0.15 14 e0
      line plank_grain_a 100,136@0.96 146,136@0.96 c6
      line plank_grain_b 100,136@0.55 146,136@0.55 c6
      line rope_l 96,136@1 96,136@0.15 c0
      line rope_r 150,136@1 150,136@0.15 c0
      line rail_l 90,92@1 90,92@0.15 c0
      line rail_r 156,92@1 156,92@0.15 c0
      line rail_l2 90,96@1 90,96@0.15 c0
      line rail_r2 156,96@1 156,96@0.15 c0
      line post_l_a 90,92@1 96,136@1 c0
      line post_r_a 156,92@1 150,136@1 c0
      line post_l_b 90,92@0.6 96,136@0.6 c0
      line post_r_b 156,92@0.6 150,136@0.6 c0
      line post_l_c 90,92@0.35 96,136@0.35 c0
      line post_r_c 156,92@0.35 150,136@0.35 c0
      line frayed_a 90,92@0.52 90,98@0.5 c14
      line frayed_b 156,92@0.46 156,98@0.44 c14
      line frayed_c 90,92@0.3 90,98@0.28 c14
      line rail_gap_l 90,92@0.72 90,92@0.66 c9
      line rail_gap_r 156,92@0.66 156,92@0.6 c11
      poly tree_l 0,60 14,54 22,0 30,0 24,56 40,66 32,106 20,106 8,70 0 e14
      ellipse tree_l_crown_a 34,30,30,10 2 e0
      ellipse tree_l_crown_b 52,12,26,8 2 e0
      ellipse tree_l_crown_c 22,6,18,6 2 e0
      ellipse tree_l_lit_a 34,26,20,5 10
      ellipse tree_l_lit_b 52,9,16,4 10
      line tree_l_bark_a 24,10 22,50 c6
      poly rock_r_a 292,104 310,98 320,106 320,118 296,116 6 e0
      poly rock_r_lit 296,100 310,98 316,102 300,104 14
      ellipse fern_r_a 304,88,16,8 2 e0
      ellipse fern_r_b 310,82,12,6 10
      poly bird_perch 270,90 282,90 284,100 270,100 6
    `,
    cycles: [
      { name: "the fall", areas: ["fall_body", "fall_row_a", "fall_row_b", "fall_row_c", "fall_row_d"], style: "scroll", dir: "down", ms: 90 }
    ],
    loops: [
      { name: "the birds", at: [0, 0], ms: 340, style: "loop", path: [[-26, 14], [322, 30]], travel: 16000, pause: 6000,
        frames: [
          ["0...0...................", ".000....................", "........................", ".................00000..", "........................", "..........000...........", ".........0...0..........", "........................", "........................", "........................"],
          ["........................", "00000...................", "........................", ".................00000..", "........................", ".........00000..........", "........................", "........................", "........................", "........................"],
          ["........................", ".000....................", "0...0............0...0..", "..................000...", "........................", ".........00000..........", "........................", "........................", "........................", "........................"],
          ["........................", "00000...................", "........................", ".................00000..", "........................", ".........00000..........", "........................", "........................", "........................", "........................"],
          ["........................", "00000...................", "........................", "..................000...", ".........0...0...0...0..", "..........000...........", "........................", "........................", "........................", "........................"],
          ["........................", "00000...................", "........................", ".................00000..", "........................", ".........00000..........", "........................", "........................", "........................", "........................"]
        ] }
    ]
  },
  // ---- THE STEPS: looking up the flight from the river to the stone gate ---------------------------------------------------------------
  steps: {
    version: 1,
    shot: "Looking up at something outdoors from the water's edge, facing north, one-point, vp 107,40 (the gate at the top of the flight on x107); forest palette; one light, the sun through the canopy at the top, flat yellow patches on a few treads, no cast shadows; steps in flat bands of treads and risers narrowing up to the {gate}, stone {figures} sitting on two of them; subject the stone frog's mouth {gate} on x107, second the {canoe} at the water's edge on x213; the river across the foot in flat bands with glints; wings: tree trunks with vines and ferns on both sides; moves: glints on the river (shimmer)",
    draw: `
      vp 107,40
      rect back_haze 0,0,320,70 10
      poly far_trunk_a 14,26 18,26 19,68 14,68 2
      poly far_trunk_b 40,26 44,26 45,68 40,68 2
      poly far_trunk_c 172,26 176,26 177,68 172,68 2
      poly far_trunk_d 196,26 200,26 201,68 196,68 2
      poly far_trunk_e 230,26 234,26 235,68 230,68 2
      poly far_trunk_f 262,26 266,26 267,68 262,68 2
      poly far_trunk_g 290,26 294,26 295,68 290,68 2
      poly canopy_shade 0,0 320,0 320,28 314,32 305,34 297,32 291,28 285,33 276,36 268,33 262,28 256,32 247,35 239,32 233,28 227,33 218,36 209,33 204,28 198,32 189,34 180,32 175,28 169,33 160,36 151,33 145,28 140,32 131,35 122,32 116,28 111,33 102,36 93,33 87,28 81,32 73,34 64,32 58,28 52,33 44,36 35,33 29,28 23,32 15,35 6,32 0,28 0
      poly canopy 0,0 320,0 320,24 314,28 305,30 297,28 291,24 285,29 276,32 268,29 262,24 256,28 247,31 239,28 233,24 227,29 218,32 209,29 204,24 198,28 189,30 180,28 175,24 169,29 160,32 151,29 145,24 140,28 131,31 122,28 116,24 111,29 102,32 93,29 87,24 81,28 73,30 64,28 58,24 52,29 44,32 35,29 29,24 23,28 15,31 6,28 0,24 2
      ellipse canopy_lit_a 44,12,26,7 10
      ellipse canopy_lit_a2 68,16,14,5 10
      ellipse canopy_lit_b 150,10,28,7 10
      ellipse canopy_lit_c 262,12,26,7 10
      ellipse canopy_lit_c2 238,16,14,5 10
      poly gap_a 28,18 36,15 46,18 50,24 42,28 32,26 14
      poly gap_b 96,19 104,16 114,19 118,25 110,29 100,27 14
      poly gap_c 188,18 196,15 206,18 210,24 202,28 192,26 14
      poly canopy_dark_l 0,0 70,0 70,10 66,15 61,18 56,15 52,10 49,14 44,17 38,14 35,10 32,15 26,18 21,15 18,10 14,14 9,17 4,14 0,10 0
      poly canopy_dark_r 252,0 320,0 320,12 315,17 309,21 302,17 297,12 293,17 286,20 279,17 275,12 270,17 263,21 257,17 252,12 0
      line vine_a 46,0 48,44 c10
      line vine_b 270,0 268,48 c10
      line vine_c 236,0 238,30 c0
      poly gate_wall 66,34 148,34 150,70 64,70 2 e0
      poly gate_top 72,30 142,30 146,40 68,40 10 e0
      ellipse gate_eye_l 88,30,10,7 10 e0
      ellipse gate_eye_r 126,30,10,7 10 e0
      ellipse eye_pupil_l 88,30,3,3 0
      ellipse eye_pupil_r 126,30,3,3 0
      poly gate_mouth 78,48 136,48 140,68 74,68 0 e10
      poly gate_lip 74,44 140,44 142,50 72,50 10 e0
      line course_a 66,40 148,40 c0
      line course_b 66,56 78,56 c0
      line course_c 136,56 148,56 c0
      line course_d 64,64 76,64 c0
      line course_e 138,64 150,64 c0
      line gate_jamb_l 74,50 76,68 c10
      line gate_jamb_r 140,50 138,68 c10
      poly bush_l 0,72 0,60 3,56 7,54 11,56 13,60 16,56 20,53 24,56 26,60 29,56 33,54 37,56 40,60 42,56 46,53 50,56 53,60 55,56 59,54 63,56 66,60 66,72 2
      poly bush_r 150,72 150,58 154,54 159,52 165,54 169,58 173,54 178,51 184,54 188,58 192,55 197,52 203,55 207,58 210,54 216,52 222,54 226,58 229,54 235,51 241,54 244,58 248,55 254,52 260,55 263,58 267,54 273,52 278,54 282,58 286,54 292,51 297,54 301,58 305,55 311,52 316,55 320,58 320,72 2
      poly bush_l_lit 6,62 20,58 36,60 52,58 60,62 30,66 10
      poly bush_r_lit 160,62 190,56 220,58 250,56 290,58 300,62 230,66 10
      line vine_d 120,0 122,20 c10
      line vine_e 160,0 158,18 c0
      line course_f 66,48 76,48 c0
      line course_g 138,48 148,48 c0
      line trunk_l_bark_d 20,30 22,100 c2
      line trunk_r_bark_d 304,30 306,100 c2
      ellipse canopy_lit_d 200,10,16,5 10
      poly ground_far 0,70 320,70 320,86 0,86 10
      poly ground_mid 0,86 320,86 320,112 0,112 2
      line ground_edge 0,86 320,86 c0
      poly step_t1 20,136@0.24 194,136@0.24 194,136@0.28 20,136@0.28 10
      poly step_r1 20,136@0.28 194,136@0.28 194,136@0.33 20,136@0.33 2
      poly step_t2 20,136@0.33 194,136@0.33 194,136@0.39 20,136@0.39 10
      poly step_r2 20,136@0.39 194,136@0.39 194,136@0.46 20,136@0.46 2
      poly step_t3 20,136@0.46 194,136@0.46 194,136@0.54 20,136@0.54 10
      poly step_r3 20,136@0.54 194,136@0.54 194,136@0.63 20,136@0.63 2
      poly step_t4 20,136@0.63 194,136@0.63 194,136@0.74 20,136@0.74 10
      poly step_r4 20,136@0.74 194,136@0.74 194,136@0.86 20,136@0.86 2
      poly step_t5 20,136@0.86 194,136@0.86 194,136@1 20,136@1 10
      line riser_line_a 20,136@0.28 194,136@0.28 c0
      line riser_line_b 20,136@0.39 194,136@0.39 c0
      line riser_line_c 20,136@0.54 194,136@0.54 c0
      line riser_line_d 20,136@0.74 194,136@0.74 c0
      line edge_l 20,136@1 20,136@0.24 c0
      line edge_r 194,136@1 194,136@0.24 c0
      poly sun_t2 92,72 110,71 120,75 110,78 94,77 14
      poly sun_t3 78,85 112,83 126,88 114,92 84,91 14
      poly sun_t4 68,101 110,99 126,105 108,110 74,109 14
      poly sun_g_left 22,92 40,90 52,95 42,100 26,100 14
      poly sun_g_right 196,95 218,93 232,98 220,104 200,103 14
      line crack_a 60,136@0.9 70,136@0.78 c0
      line crack_b 140,136@0.8 130,136@0.68 c0
      line crack_c 100,136@0.6 108,136@0.48 c0
      poly fig_l 55,91 56,82 59,79 61,78 60,75 61,72 64,70 67,72 68,75 67,78 69,79 71,82 72,91 10 e0
      poly fig_l_shade 66,79 69,79 71,82 72,91 66,91 2
      line fig_l_arm 58,84 58,90 c0
      poly fig_r 136,110 137,98 141,94 144,92 143,88 144,84 148,81 152,84 153,88 152,92 155,94 159,98 160,110 10 e0
      poly fig_r_shade 152,93 155,94 159,98 160,110 152,110 2
      line fig_r_arm 139,100 139,108 c0
      dots fig_eyes 62,73 65,73 146,85 150,85 c0
      poly water 0,112 320,112 320,136 0,136 2
      poly water_far 0,112 320,112 320,120 0,120 10
      poly water_near 0,128 320,128 320,136 0,136 0
      line dash_a 10,116 30,116 c2
      line dash_b 70,118 96,118 c2
      line dash_c 140,116 166,116 c2
      line dash_d 230,118 260,118 c2
      line dash_e 40,124 70,124 c0
      line dash_f 120,126 160,126 c0
      line dash_g 210,124 250,124 c0
      line dash_h 280,126 316,126 c0
      line glint_b 100,116 105,116 c14
      line glint_c 96,119 100,119 c10
      line glint_d 104,121 108,121 c10
      line glint_e 150,113 155,113 c14
      line glint_f 158,115 162,115 c14
      line glint_g 154,118 158,118 c10
      line glint_h 162,120 167,120 c10
      poly bank_l 0,100 30,104 60,112 40,120 0,126 2 e0
      poly bank_r 240,104 280,100 320,98 320,126 270,122 2 e0
      poly bank_l_lit 0,100 30,104 40,106 0,106 10
      poly bank_r_lit 280,100 320,98 320,104 290,104 10
      poly canoe_hull 190,112 206,108 244,108 262,112 250,120 202,120 0 e10
      poly canoe_in 202,110 244,110 252,113 204,113 2
      line canoe_rim 196,110 246,108 c10
      line canoe_grain 200,117 246,117 c2
      poly fern_l_back 4,126 8,106 22,94 40,102 54,96 66,110 70,126 2
      poly fern_l_front 14,126 22,112 38,108 52,116 76,118 80,126 2
      poly fern_l_lit 14,104 24,96 38,102 52,98 62,108 40,110 24,112 10
      poly fern_r_back 262,126 266,108 280,96 294,104 306,98 316,112 316,126 2
      poly fern_r_front 242,126 250,114 266,110 284,118 304,120 316,126 2
      poly fern_r_lit 268,106 280,98 292,104 304,100 312,110 290,112 272,114 10
      poly trunk_l 0,0 26,0 32,40 28,80 34,126 0,126 0 e10
      line trunk_l_hi 22,0 26,50 24,100 c2
      line trunk_l_bark_a 8,10 12,70 c2
      line trunk_l_bark_b 14,40 16,110 c2
      line trunk_l_bark_c 4,60 6,120 c2
      poly trunk_r 292,0 320,0 320,126 288,126 296,90 290,44 0 e10
      line trunk_r_hi 294,0 290,50 296,90 c2
      line trunk_r_bark_a 308,10 306,80 c2
      line trunk_r_bark_b 300,40 302,110 c2
      line trunk_r_bark_c 314,50 312,120 c2
    `,
    cycles: [
      { name: "the glints", areas: ["glint_b", "glint_c", "glint_d", "glint_e", "glint_f", "glint_g", "glint_h"], colors: [14, 10, 2], style: "pingpong", scatter: true, ms: 420 }
    ]
  },
  // ---- THE COURT: the flagstones under the round hole in the roof, the basin in its light, the frieze, the dark passage -----------
  court: {
    version: 1,
    shot: "Eye level in the court, facing north, one-point, vp 213,66 (the low black passage in the back wall on x213); noon palette; one light, the sun straight down through a round hole in the roof, a flat white patch on the floor round the {basin} on x107; no cast shadows (overhead sun and a roofed court); stone walls in yellow and brown courses with green moss, the carved {frieze} in a band along the back wall (figures under a hanging bell, a long stone fitted to its mouth, a river climbing); floor in flat bands of flagstones with grass in the joints; wings: the side walls' courses, a fallen block and a creeper at the left, a stone lamp niche and ferns at the right; moves: dust in the sunbeam",
    draw: `
      vp 213,66
      poly roof 0,0@1 320,0@1 320,0@0.4 0,0@0.4 6
      poly wall_l 0,0@1 0,136@1 0,136@0.4 0,0@0.4 14
      poly wall_r 320,0@1 320,136@1 320,136@0.4 320,0@0.4 6
      poly backwall 0,0@0.4 320,0@0.4 320,136@0.4 0,136@0.4 14
      poly floor_far 0,136@0.62 320,136@0.62 320,136@0.4 0,136@0.4 14
      poly floor_mid 0,136@0.82 320,136@0.82 320,136@0.62 0,136@0.62 6
      poly floor_near 0,136@1 320,136@1 320,136@0.82 0,136@0.82 14
      poly roof_beam_a 0,0@1 20,0@1 20,0@0.4 0,0@0.4 0
      poly roof_beam_b 300,0@1 320,0@1 320,0@0.4 300,0@0.4 0
      poly roof_beam_c 150,0@1 170,0@1 170,0@0.4 150,0@0.4 0
      ellipse hole_rim 107,10,30,9 6 e0
      ellipse hole 107,10,26,7 15
      ellipse hole_sky 107,10,22,5 11
      ellipse hole_cloud 100,9,9,2 15
      poly shaft_a 82,16 132,16 140,96 74,96 15
      poly hole_edge_l 78,12 82,16 74,16 6
      poly wall_course_l1 0,20@1 0,20@0.4 0,32@0.4 0,32@1 6
      poly wall_course_l2 0,60@1 0,60@0.4 0,72@0.4 0,72@1 6
      poly wall_course_l3 0,100@1 0,100@0.4 0,112@0.4 0,112@1 6
      line wall_line_l1 0,0@1 0,0@0.4 c0
      line wall_line_l2 0,40@1 0,40@0.4 c0
      line wall_line_l3 0,80@1 0,80@0.4 c0
      line wall_line_l4 0,120@1 0,120@0.4 c0
      line wall_line_r1 320,0@1 320,0@0.4 c0
      line wall_line_r2 320,40@1 320,40@0.4 c0
      line wall_line_r3 320,80@1 320,80@0.4 c0
      line wall_line_r4 320,120@1 320,120@0.4 c0
      line wall_joint_l1 40,0@1 40,0@0.4 c0
      line wall_joint_l2 0,0@0.7 0,136@0.7 c0
      line wall_joint_r1 320,0@0.7 320,136@0.7 c0
      line wall_joint_r2 280,0@1 280,0@0.4 c0
      line wall_hi_l 0,0@1 0,0@0.4 c15
      poly back_block_a 128,37 150,37 150,56 128,56 6
      poly back_block_b 160,56 190,56 190,92 160,92 6
      poly back_block_c 236,56 256,56 256,92 236,92 6
      line back_line_a 128,56 256,56 c0
      line back_line_b 128,74 256,74 c0
      line back_line_c 150,37 150,92 c0
      line back_line_d 236,56 236,92 c0
      line back_top_a 130,57 158,57 c14
      line back_top_b 238,57 262,57 c14
      poly frieze_band 128,40 256,40 256,54 128,54 6 e0
      poly frieze_bell 188,40 200,40 202,50 186,50 14 e0
      line frieze_bell_rope 194,36 194,40 c0
      poly frieze_fig_a 134,44 138,44 139,54 133,54 0
      poly frieze_fig_b 146,43 150,43 151,54 145,54 0
      poly frieze_fig_c 160,44 164,44 165,54 159,54 0
      poly frieze_fig_d 222,44 226,44 227,54 221,54 0
      poly frieze_fig_e 236,43 240,43 241,54 235,54 0
      poly frieze_fig_f 246,44 250,44 251,54 245,54 0
      line frieze_arm_a 132,42 136,44 c0
      line frieze_arm_b 148,41 152,43 c0
      line frieze_arm_c 162,42 166,44 c0
      line frieze_arm_d 226,42 224,44 c0
      line frieze_arm_e 242,41 238,43 c0
      poly frieze_stone 204,44 216,44 216,46 204,46 15 e0
      poly frieze_fig_g 208,42 212,42 213,54 207,54 0
      line frieze_river_a 130,52 150,50 170,52 186,50 c9
      line frieze_river_b 204,52 218,48 232,52 c9
      line frieze_river_c 240,48 252,44 c11
      line frieze_river_d 148,50 168,48 c9
      line frieze_edge_a 128,40 256,40 c14
      line frieze_edge_b 128,54 256,54 c0
      poly passage 197,92 197,68 205,60 221,60 229,68 229,92 0 e14
      poly passage_in 203,92 203,70 208,64 218,64 223,70 223,92 0
      line passage_step 197,92 229,92 c6
      poly moss_a 130,74 150,74 152,92 130,92 2
      poly moss_b 236,76 254,76 256,92 238,92 10
      poly moss_c 196,56 206,56 206,60 198,60 2
      poly moss_d 150,56 160,56 160,62 150,62 10
      line floor_flag_a 0,136@1 320,136@1 c0
      line floor_flag_b 0,136@0.82 320,136@0.82 c0
      line floor_flag_c 0,136@0.62 320,136@0.62 c0
      line floor_joint_a 80,136@1 80,136@0.4 c0
      line floor_joint_b 160,136@1 160,136@0.4 c0
      line floor_joint_c 240,136@1 240,136@0.4 c0
      line floor_joint_d 20,136@1 20,136@0.4 c0
      line floor_joint_e 300,136@1 300,136@0.4 c0
      line floor_joint_f 120,136@1 120,136@0.4 c0
      line floor_joint_g 200,136@1 200,136@0.4 c0
      poly patch_floor 60,108 156,108 170,122 46,122 15 e0
      poly patch_floor_b 80,124 138,124 148,130 70,130 15
      line patch_a 70,114 150,114 c14
      line patch_b 86,127 134,127 c14
      poly basin_base 88,96 126,96 130,106 84,106 14 e0
      poly basin_shade 118,96 126,96 130,106 122,106 6
      ellipse basin_rim 107,94,17,4 14 e0
      ellipse basin_water 107,94,13,3 11
      line basin_glint 100,94 112,94 c15
      line basin_crack 96,98 98,104 c0
      line basin_crack_b 112,98 114,104 c0
      line basin_chip 114,91 118,95 c0
      line basin_course 84,101 130,101 c0
      line basin_course_b 88,98 126,98 c0
      poly moss_basin 88,102 100,102 100,106 90,106 2
      poly fallen_block 6,106 40,102 46,116 10,120 14 e0
      poly fallen_shade 28,104 40,102 46,116 34,118 6
      line fallen_line 10,110 42,108 c0
      line fallen_line_b 14,116 40,114 c0
      line fallen_hi 8,106 24,104 c14
      poly creeper_a 4,40 12,40 10,100 6,100 2
      ellipse creeper_mass_a 12,64,12,8 10 e0
      ellipse creeper_mass_b 12,82,11,7 2 e0
      ellipse creeper_mass_c 14,96,10,6 10 e0
      line creeper_vein 10,62 22,60 c2
      line creeper_vein_b 10,80 22,78 c2
      poly niche 284,50 304,50 304,76 284,76 0 e14
      poly niche_lamp 290,66 298,66 298,74 290,74 6 e0
      ellipse niche_flame 294,63,2,3 14
      line niche_edge 284,50 304,50 c15
      line niche_soot 294,52 294,58 c0
      ellipse fern_a 292,102,18,8 10 e0
      ellipse fern_a2 306,98,12,6 2 e0
      ellipse fern_b 304,112,16,6 2 e0
      line fern_vein_a 280,104 300,98 c2
      line fern_vein_b 300,112 316,106 c10
      line joint_grass_a 252,118 254,112 256,118 258,111 260,118 c2
      line joint_grass_b 268,124 270,118 272,124 274,117 276,124 c2
      line crack_a 44,100 50,116 46,132 c0
      line crack_b 270,98 276,114 c0
      dots shaft_specks 90,20 100,26 112,22 120,30 94,34 106,38 116,44 98,48 124,50 90,56 108,60 96,70 112,74 122,80 100,84 116,88 94,92 108,96 126,92 88,30 128,40 92,62 124,70 98,22 114,28 c15
    `,
    cycles: [
      { name: "the dust in the sunbeam", areas: ["shaft_specks"], colors: [15, 15, 15, 14, 6], style: "pingpong", scatter: true, ms: 380 }
    ]
  },
  // ---- THE BELL CHAMBER: the black pool, its two eyes, the gold bell in the shaft of noon -------------------------------------------
  chamber: {
    version: 1,
    shot: "Eye level on the walk, facing north across the pool, no vp; cellar palette; one light, the shaft of daylight through the hole in the roof on x107 falling on the gold {bell} and the water under it, flat yellow and brown on what it reaches, the rest of the stone in half-light blues and dark greys going to black, no cast shadows; subject the {bell} hung from the black {beam} on x107, second the black {pool} with its two {eyes} on x213; stone walk across the foot, back wall in dark blocks; wings: columns with carved bands at the left, a broken block and a scrap of red cloth at the right; moves: glints on the pool under the bell (shimmer), a sparkle on the bell (sparkle)",
    draw: `
      rect back 0,0,320,136 0
      poly wall_blocks 20,28 300,28 300,86 20,86 8
      poly wall_dark_l 20,28 80,28 80,86 20,86 1
      poly wall_dark_r 250,28 300,28 300,86 250,86 0
      poly wall_light 70,28 150,28 150,86 70,86 8
      poly wall_shade_top 20,28 300,28 300,38 20,38 1
      line blk_h1 20,44 300,44 c0
      line blk_h2 20,58 300,58 c0
      line blk_h3 20,72 300,72 c0
      line blk_v1 40,28 40,44 c0
      line blk_v2 96,44 96,58 c0
      line blk_v3 150,28 150,44 c0
      line blk_v4 202,44 202,58 c0
      line blk_v5 260,28 260,44 c0
      line blk_v6 70,58 70,72 c0
      line blk_v7 130,58 130,72 c0
      line blk_v8 190,58 190,72 c0
      line blk_v9 250,58 250,72 c0
      line blk_v10 40,72 40,86 c0
      line blk_v11 110,72 110,86 c0
      line blk_v12 220,72 220,86 c0
      line blk_hi_1 72,29 148,29 c1
      line blk_hi_2 72,45 148,45 c1
      line blk_hi_3 72,59 148,59 c1
      line blk_hi_4 150,29 200,29 c1
      poly alcove 70,28 146,28 146,76 70,76 0
      poly hole 92,0 124,0 118,12 98,12 14
      poly hole_edge_l 86,0 92,0 98,12 90,10 8
      poly hole_edge_r 124,0 130,0 126,10 118,12 8
      poly beam 30,14 290,14 290,24 30,24 6 e0
      line beam_grain_a 40,17 140,17 c0
      line beam_grain_b 180,19 280,19 c0
      line beam_grain_c 60,22 120,22 c0
      poly beam_knot 150,17 156,17 156,20 150,20 0
      poly beam_lit 80,14 134,14 134,24 80,24 14 e0
      line chain 107,24 107,34 c14
      line chain_b 106,26 106,32 c6
      poly bell_body 96,34 118,34 124,44 132,66 134,72 80,72 82,66 90,44 14 e0
      poly bell_shade 112,34 118,34 124,44 132,66 134,72 114,72 6
      poly bell_rim 82,66 132,66 134,72 80,72 6 e0
      poly bell_band 88,48 126,48 128,52 86,52 6
      line bell_band_b 84,60 130,60 c6
      line bell_hi 96,38 92,64 c14
      line bell_streak 100,44 98,62 c15
      dots bell_rivets 92,50 122,50 90,62 124,62 c6
      ellipse bell_mouth 107,72,27,4 0
      line bell_hook 107,72 107,70 c14
      poly bell_hook_end 105,69 109,69 109,73 105,73 14
      poly pool 20,80 300,80 300,120 20,120 0 e8
      poly pool_far 20,80 300,80 300,92 20,92 1
      poly pool_mid 20,92 300,92 300,104 20,104 8
      poly pool_near 20,104 300,104 300,120 20,120 0
      line pool_dash_a 40,84 70,84 c8
      line pool_dash_b 200,86 240,86 c8
      line pool_dash_c 60,96 100,96 c1
      line pool_dash_d 230,98 280,98 c1
      line pool_dash_e 140,108 180,108 c8
      line pool_dash_f 30,112 60,112 c8
      line pool_dash_g 250,110 290,110 c8
      line pool_dash_h 180,90 196,90 c1
      poly pool_light 74,94 142,94 150,112 66,112 14
      line glint_a 84,96 90,96 c14
      line glint_b 94,100 102,100 c14
      line glint_c 110,97 116,97 c6
      line glint_d 78,104 86,104 c6
      line glint_e 120,104 130,104 c14
      line glint_f 98,108 106,108 c6
      line glint_g 126,98 132,98 c6
      line glint_h 112,106 118,106 c14
      ellipse eye_l 206,100,5,3 14 e0
      ellipse eye_r 222,100,5,3 14 e0
      line eye_slit_l 206,98 206,102 c0
      line eye_slit_r 222,98 222,102 c0
      line snout_ridge 200,104 228,104 c8
      line ripple_eye_a 196,106 232,106 c1
      line ripple_eye_b 192,109 236,109 c8
      poly walk 0,120 320,120 320,136 0,136 8 e0
      poly walk_lit 90,120 150,120 156,136 84,136 14 e0
      poly walk_far 0,116 20,116 20,120 0,120 8
      poly walk_far_r 300,116 320,116 320,120 300,120 8
      line walk_joint_a 0,128 320,128 c0
      line walk_joint_b 40,120 36,136 c0
      line walk_joint_c 100,120 98,136 c0
      line walk_joint_d 170,120 172,136 c0
      line walk_joint_e 240,120 246,136 c0
      line walk_joint_f 300,120 306,136 c0
      line walk_crack_a 120,122 124,128 118,134 c6
      line walk_crack_b 200,126 212,130 c8
      line walk_crack_c 60,124 70,128 c8
      poly walk_dark_l 0,120 60,120 50,136 0,136 1
      poly walk_dark_r 260,120 320,120 320,136 270,136 1
      line walk_edge 0,120 320,120 c8
      poly col_l_a 0,14 18,14 18,120 0,120 8 e0
      poly col_l_b 22,24 36,24 36,86 22,86 1 e0
      poly col_l_shade 12,14 18,14 18,120 12,120 1
      line col_l_band_a 0,34 18,34 c0
      line col_l_band_b 0,56 18,56 c0
      line col_l_band_c 0,80 18,80 c0
      line col_l_band_d 0,102 18,102 c0
      poly cap_l 0,10 22,10 22,14 0,14 8 e0
      poly col_r_a 302,14 320,14 320,120 302,120 8 e0
      poly col_r_shade 302,14 308,14 308,120 302,120 1
      line col_r_band_a 302,34 320,34 c0
      line col_r_band_b 302,56 320,56 c0
      line col_r_band_c 302,80 320,80 c0
      line col_r_band_d 302,102 320,102 c0
      line col_r_crack 312,70 314,90 c0
      poly cap_r 298,10 320,10 320,14 298,14 8 e0
      poly block_r 270,104 296,102 300,118 274,120 8 e0
      poly block_r_top 270,104 296,102 298,106 272,108 1
      line block_r_line 274,112 298,110 c0
      line block_r_crack 280,106 288,116 c0
      poly cloth 22,126 38,124 40,132 24,134 4 e0
      line cloth_fold_a 26,128 36,127 c0
      line cloth_fold_b 28,132 38,130 c0
      line cloth_fold_c 30,126 38,125 c0
      dots spark_core 138,46 137,46 139,46 138,45 138,47 c0
      dots spark_mid 137,45 139,45 137,47 139,47 136,46 140,46 138,44 138,48 c0
      dots spark_tips 135,46 134,46 141,46 142,46 138,43 138,42 138,49 138,50 c0
      poly pillar_dark 0,120 14,120 14,136 0,136 0
    `,
    cycles: [
      { name: "the glints", areas: ["glint_a", "glint_b", "glint_c", "glint_d", "glint_e", "glint_f", "glint_g", "glint_h"], colors: [14, 6, 8], style: "pingpong", scatter: true, ms: 420 },
      { name: "the sparkle", areas: ["spark_core", "spark_mid", "spark_tips"], colors: [15, 15, 14, 0], rest: 46, style: "rotate", sweep: true, ms: 110 }
    ]
  }
};

export const endings = {
  // ---- ENDING: rung. The river at noon, running up the valley, and the fish running with it ---------------------------------------------
  rung: {
    version: 1,
    shot: "Eye level over the water, facing north up the river, one-point, vp 213,54; sea palette; the noon sky in flat bands of cyan, light cyan and white, no sun disc; the river in flat bands of light cyan far off to cyan near, black silhouettes of the jungle on both banks with a light cyan edge; subject a run of silver fish leaping up the river on x107, a school of smaller ones going away to the vanishing point; wings: black reeds and a leaning palm at the left, a black rock and fronds at the right; moves: glints on the water (shimmer)",
    draw: `
      vp 213,54
      rect s1 0,0,320,56 11
      poly cloud_b 140,6 190,4 214,8 170,12 15
      poly cloud_c 250,14 296,12 320,16 274,20 15
      poly cloud_d 60,30 110,28 130,32 80,35 15
      poly hills 0,60 0,48 14,44 28,48 44,42 62,47 80,43 100,48 120,44 150,50 180,46 206,50 214,52 240,46 262,50 280,44 300,48 320,44 320,60 0 e11
      poly jungle_l 0,70 0,52 10,48 22,53 34,47 50,54 62,58 60,70 0 e11
      poly jungle_r 320,70 320,50 308,46 294,52 280,46 264,54 252,58 256,70 0 e11
      poly clump_l 20,56 30,50 44,54 52,62 30,64 0
      poly clump_r 270,58 282,50 296,54 306,62 286,66 0
      line jungle_lit_l 10,50 34,49 c11
      line jungle_lit_r 262,52 296,50 c11
      poly bank_l 0,62 -100,136@0.12 -100,136@1 0,136 1
      poly bank_r 320,62 420,136@0.12 420,136@1 320,136 1
      poly bl_p1 4,100 40,96 60,102 20,108 3
      poly bl_p2 30,120 80,114 100,122 50,130 3
      poly bl_p3 70,90 110,88 124,94 84,98 3
      poly bl_c1 0,90 14,80 30,84 40,94 20,100 0 e3
      poly bl_c2 40,106 60,98 84,100 90,110 60,114 0 e3
      poly bl_c3 80,84 100,78 120,80 126,88 100,92 0 e3
      poly bl_c4 0,118 20,108 38,114 40,128 0,130 0 e3
      line bl_dash_a 10,106 36,104 c11
      line bl_dash_b 56,124 94,120 c11
      line bl_dash_c 84,98 112,95 c11
      line bl_dash_d 14,132 50,130 c3
      poly br_p1 262,100 300,96 318,102 280,108 3
      poly br_p2 270,120 310,114 320,122 290,130 3
      poly br_p3 240,86 270,84 280,90 250,94 3
      poly br_c1 258,92 276,84 296,88 304,98 280,102 0 e3
      poly br_c2 292,106 312,98 320,100 320,112 300,116 0 e3
      poly br_c3 246,78 262,72 280,74 286,82 262,86 0 e3
      poly br_c4 280,120 300,116 320,120 320,134 284,134 0 e3
      line br_dash_a 266,106 296,104 c11
      line br_dash_b 272,126 306,124 c11
      line br_dash_c 244,92 270,90 c11
      line br_dash_d 290,134 318,132 c3
      poly river_far -100,136@0.35 420,136@0.35 420,136@0.12 -100,136@0.12 11
      poly river_mid -100,136@0.65 420,136@0.65 420,136@0.35 -100,136@0.35 3
      poly river_near -100,136@1 420,136@1 420,136@0.65 -100,136@0.65 3
      poly shore_l_lit -100,136@0.45 -96,136@0.45 -96,136@0.12 -100,136@0.12 11
      poly shore_r_lit 420,136@0.45 416,136@0.45 416,136@0.12 420,136@0.12 11
      line far_water_dash_a 120,136@0.2 160,136@0.2 c3
      line far_water_dash_b 200,136@0.18 240,136@0.18 c3
      line mid_dash_a 100,136@0.5 150,136@0.5 c1
      line mid_dash_b 190,136@0.46 250,136@0.46 c1
      line mid_dash_c 60,136@0.55 90,136@0.55 c11
      line mid_dash_d 220,136@0.58 270,136@0.58 c11
      line near_dash_a 20,136@0.8 80,136@0.8 c1
      line near_dash_b 140,136@0.82 210,136@0.82 c1
      line near_dash_c 250,136@0.85 300,136@0.85 c1
      line near_dash_d 90,136@0.94 150,136@0.94 c11
      line near_dash_e 180,136@0.97 250,136@0.97 c11
      line near_dash_f 30,136@0.97 70,136@0.97 c11
      poly fish_a 96,70 106,64 118,64 126,70 118,76 106,76 15 e1
      poly fish_a_tail 126,70 134,64 134,76 15 e1
      poly fish_a_belly 100,72 120,72 118,76 106,76 11
      dots fish_a_eye 102,68 c1
      line fish_a_line 104,70 124,69 c11
      line fish_a_fin 106,64 112,60 118,64 c1
      poly fish_b 130,56 138,52 148,52 154,56 148,60 138,60 15 e1
      poly fish_b_tail 154,56 160,52 160,60 15 e1
      poly fish_b_belly 134,58 148,58 148,60 138,60 11
      dots fish_b_eye 134,55 c1
      line fish_b_fin 138,52 142,49 148,52 c1
      poly fish_c 62,88 70,83 80,83 86,88 80,93 70,93 15 e1
      poly fish_c_tail 86,88 92,83 92,93 15 e1
      poly fish_c_belly 66,90 80,90 80,93 70,93 11
      dots fish_c_eye 66,86 c1
      line fish_c_fin 72,83 76,79 80,83 c1
      poly fish_d 170,60 176,58 182,58 186,60 182,63 176,63 15 e1
      poly fish_d_tail 186,60 190,58 190,63 15 e1
      poly fish_e 196,58 200,57 204,57 207,58 204,60 200,60 15 e1
      poly fish_e_tail 207,58 210,57 210,60 15
      poly fish_f 150,70 156,68 162,68 166,70 162,73 156,73 15 e1
      poly fish_f_tail 166,70 170,68 170,73 15 e1
      poly fish_g 228,60 233,58 238,58 241,60 238,62 233,62 15 e1
      poly fish_g_tail 241,60 244,58 244,62 15
      poly ripple_a 90,82 130,82 134,86 94,86 11
      poly ripple_b 56,96 96,96 100,100 60,100 11
      poly ripple_c 124,66 160,66 164,69 128,69 11
      poly ripple_d 150,76 176,76 178,79 152,79 11
      line school_a 150,136@0.3 154,136@0.3 c15
      line school_b 170,136@0.28 174,136@0.28 c15
      line school_c 188,136@0.26 192,136@0.26 c15
      line school_d 206,136@0.24 210,136@0.24 c15
      line school_e 224,136@0.22 228,136@0.22 c15
      line school_f 160,136@0.22 164,136@0.22 c15
      line school_g 196,136@0.2 200,136@0.2 c15
      line school_h 232,136@0.28 236,136@0.28 c15
      line glint_a 70,104 76,104 c15
      line glint_b 82,108 90,108 c11
      line glint_c 150,100 158,100 c15
      line glint_d 164,104 172,104 c11
      line glint_e 230,102 238,102 c15
      line glint_f 242,108 252,108 c11
      line glint_g 120,116 130,116 c15
      line glint_h 200,114 210,114 c11
      line glint_i 110,126 120,126 c15
      line glint_j 262,120 270,120 c11
      poly reeds_l 6,136 8,116 12,136 0
      poly reeds_l2 14,136 18,112 22,136 0
      poly reeds_l3 24,136 28,120 32,136 0
      poly palm_l 8,116 22,100 36,106 18,112 0
      poly palm_l2 8,116 4,96 18,104 0
      line palm_trunk_l 8,136 12,100 c0
      line palm_vein_l 8,116 20,104 c11
      poly reeds_r 290,136 294,114 298,136 0
      poly reeds_r2 300,136 304,110 308,136 0
      line reed_hi_l 8,116 9,134 c11
      line reed_hi_r 292,114 293,134 c11
      line fish_a_gill 104,66 105,74 c1
      line fish_b_gill 134,53 135,59 c1
      line fish_c_gill 66,85 67,92 c1
      poly rock_r 280,120 296,112 314,118 320,136 276,136 0 e11
      poly fronds_r 296,112 312,98 320,104 308,114 0
      poly fronds_r2 300,112 316,92 320,96 0
      line rock_r_hi 284,122 300,116 c11
      line rock_r_crack 292,124 296,134 c1
      line rock_r_crack_b 300,124 304,134 c1
      line shore_dash_l 0,100 30,96 c11
      line shore_dash_r 270,98 320,94 c11
    `,
    cycles: [
      { name: "the glints", areas: ["glint_a", "glint_b", "glint_c", "glint_d", "glint_e", "glint_f", "glint_g", "glint_h", "glint_i", "glint_j"], colors: [15, 11, 3], style: "pingpong", scatter: true, ms: 420 }
    ]
  },
  // ---- ENDING: carried. The canoe going down to the sea at sunset with the gold bell in it -------------------------------------------
  carried: {
    version: 1,
    shot: "Eye level on the water, facing north-east down the river towards the sea (the river runs to the sea that evening), one-point, vp 213,58; goldenhour; one low sun, a flat yellow disc on x213 at the end of the river, so the sun's path runs down the water towards us and shadows fall to the left; the sky in flat bands of light red and yellow; the river in flat bands of brown with the sun's path; black jungle on both banks with a light red edge; subject the dugout canoe on x107 with a paddling silhouette and the gold bell in its middle, a small flat yellow shape; wings: black reeds and a tall trunk at the left, a leaning palm at the right; moves: the sun's path on the water (moon path)",
    draw: `
      vp 213,58
      rect sky 0,0,320,60 12
      ellipse sun 213,50,10,10 14 e12
      poly cloud_a 16,14 66,10 100,14 60,18 14
      poly cloud_c 250,10 300,8 320,12 270,16 14
      poly far_sea 0,60 320,60 320,64 0,64 12
      poly jungle_far_l 0,64 0,52 20,48 40,54 60,50 84,56 104,62 120,64 0 e12
      poly jungle_far_r 320,64 320,50 296,46 274,54 250,50 232,58 216,64 0 e12
      poly far_isle 150,62 160,58 174,59 186,62 0 e12
      line far_isle_lit 158,59 172,58 c12
      poly bank_l 0,62 -150,136@0.12 -150,136@1 0,136 6
      poly bank_r 320,62 470,136@0.12 470,136@1 320,136 6
      poly bl_p1 6,96 46,92 70,100 24,106 5
      poly bl_p2 24,116 80,110 108,120 50,128 5
      poly bl_p3 76,86 112,84 126,92 84,96 5
      poly bl_c1 0,86 16,76 34,80 42,90 20,98 0 e12
      poly bl_c2 40,104 62,96 86,98 94,108 62,112 0 e12
      poly bl_c3 84,80 104,74 122,78 128,86 104,90 0 e12
      poly bl_c4 0,114 18,106 40,112 42,126 0,128 0 e12
      poly bl_c5 44,126 64,120 82,124 84,134 46,134 0 e12
      line bl_rut_a 8,104 40,102 c0
      line bl_rut_b 60,122 100,118 c0
      line bl_rut_c 14,120 36,118 c0
      line bl_lit_a 80,96 114,93 c12
      line bl_lit_b 30,128 64,125 c12
      poly br_p1 258,98 300,94 318,100 276,106 5
      poly br_p2 266,118 308,112 320,120 288,128 5
      poly br_p3 236,84 268,82 278,88 246,92 5
      poly br_c1 256,90 274,82 296,86 304,96 278,100 0 e12
      poly br_c2 290,104 312,96 320,98 320,110 298,114 0 e12
      poly br_c3 244,76 260,70 278,72 284,80 260,84 0 e12
      poly br_c4 278,118 300,114 320,118 320,132 282,132 0 e12
      poly br_c5 240,104 256,98 272,100 276,110 250,112 0 e12
      line br_rut_a 262,104 296,102 c0
      line br_rut_b 270,124 306,122 c0
      line br_rut_c 290,116 312,114 c0
      line br_lit_a 246,90 272,88 c12
      line br_lit_b 280,130 312,128 c12
      poly river_far -150,136@0.35 470,136@0.35 470,136@0.12 -150,136@0.12 12
      poly river_mid -150,136@0.65 470,136@0.65 470,136@0.35 -150,136@0.35 6
      poly river_near -150,136@1 470,136@1 470,136@0.65 -150,136@0.65 6
      line path_a 190,64 236,64 c14
      line path_b 184,70 244,70 c12
      line path_c 176,78 252,78 c14
      line path_d 164,88 262,88 c12
      line path_e 150,100 276,100 c14
      line path_f 130,114 290,114 c12
      line dash_a 70,70 100,70 c5
      line dash_b 260,72 290,72 c5
      line dash_c 60,82 96,82 c5
      line dash_d 250,84 290,84 c5
      line dash_e 40,96 90,96 c5
      line dash_f 240,98 296,98 c5
      line dash_g 20,112 80,112 c5
      line dash_h 250,114 310,114 c5
      line dash_i 20,128 100,128 c5
      line dash_j 230,126 300,126 c5
      line dash_k 150,70 168,70 c5
      line dash_l 110,78 134,78 c5
      line dash_m 120,92 150,92 c5
      line dash_n 190,104 230,104 c5
      poly canoe_shadow 54,112 134,112 150,118 66,120 0
      poly canoe_hull 54,104 74,98 124,96 148,102 152,108 140,114 70,116 58,110 0 e12
      poly canoe_in 70,100 124,98 144,103 136,107 74,108 6
      poly canoe_lit 74,100 124,98 144,103 138,104 78,104 12
      line canoe_rim 60,102 78,98 124,96 146,102 c12
      line canoe_grain_a 66,112 130,111 c6
      line canoe_grain_b 80,108 120,108 c6
      line canoe_thwart 96,98 98,106 c0
      line canoe_thwart_b 100,98 102,106 c0
      line canoe_waterline 60,115 146,113 c12
      line canoe_prow 146,102 150,106 c14
      poly bell_gold 92,88 106,88 110,98 112,102 86,102 88,98 14 e0
      poly bell_shade 102,88 106,88 110,98 112,102 100,102 6
      line bell_hi 92,90 90,100 c14
      line bell_band 90,94 110,94 c6
      poly paddler_body 112,76 122,76 124,98 110,98 0
      ellipse paddler_head 117,70,5,6 0
      poly paddler_hat 110,66 124,66 126,70 108,70 0
      line hat_band 110,69 124,69 c6
      line paddle_shaft 124,80 142,108 c0
      poly paddle_blade 140,104 148,106 146,114 138,112 0
      line paddle_ripple 134,116 150,116 c12
      line paddle_ripple_b 130,120 156,120 c12
      line paddle_drip 143,112 143,116 c12
      poly trunk_l 0,0 22,0 26,50 22,90 28,136 0,136 0 e12
      line trunk_l_hi 20,0 24,50 22,90 c6
      line trunk_l_bark_a 8,10 10,70 c6
      line trunk_l_bark_b 14,40 14,110 c6
      line trunk_l_bark_c 4,60 6,120 c6
      line trunk_l_bark_d 16,80 18,134 c6
      poly frond_l_a 22,40 54,26 68,34 40,42 0
      poly frond_l_b 22,56 56,50 74,62 40,64 0
      poly frond_l_c 22,24 48,10 62,14 36,28 0
      line frond_l_vein_a 24,40 62,32 c6
      line frond_l_vein_b 24,58 68,58 c6
      line frond_l_vein_c 24,28 52,18 c6
      poly reeds_l 36,136 38,114 42,136 0
      poly reeds_l2 44,136 48,110 52,136 0
      poly reeds_l3 54,136 58,120 62,136 0
      poly reeds_r 274,136 278,116 282,136 0
      poly reeds_r2 284,136 288,112 292,136 0
      poly reeds_r3 294,136 298,122 302,136 0
      line reed_hi_l 38,114 39,134 c12
      line reed_hi_r 278,116 279,134 c12
      poly palm_r_trunk 296,136 302,92 308,92 304,136 0
      poly palm_r_a 304,92 286,80 270,86 296,92 0
      poly palm_r_b 304,92 320,76 320,86 306,96 0
      poly palm_r_c 304,92 296,70 308,76 0
      line palm_vein_a 302,92 276,84 c12
      line palm_vein_b 306,92 318,82 c12
      line palm_vein_c 304,92 298,76 c12
      line palm_ring_a 297,100 305,100 c12
      line palm_ring_b 297,112 305,112 c12
      line palm_ring_c 297,124 304,124 c12
      poly bank_lit_l -150,136@0.5 -146,136@0.5 -146,136@0.12 -150,136@0.12 12
      poly bank_lit_r 470,136@0.5 466,136@0.5 466,136@0.12 470,136@0.12 12
      line sea_line 120,60 310,60 c14
      dots bird_a 150,38 154,36 158,38 c0
      dots bird_b 170,28 174,26 178,28 c0
      dots bird_c 120,36 124,34 128,36 c0
    `,
    cycles: [
      { name: "the sun's path", areas: ["path_a", "path_b", "path_c", "path_d", "path_e", "path_f"], colors: [12, 14, 6], style: "rotate", ms: 600 }
    ]
  },
  // ---- ENDING: fell. The gorge in spray, the bridge high above with its missing planks, a plank and a helmet falling -----------------
  fell: {
    version: 1,
    shot: "Looking up at something outdoors from the foot of the gorge, facing north, one-point, vp 160,30; fog palette, the whole gorge in spray, no cast shadows; the walls of the gorge in flat bands of dark grey and light grey with black cracks, white water falling down the far wall and a white foam at the foot, a pale sky slit at the top; subject the rope bridge small and high on x213 with its three missing planks and frayed ropes, one grey plank falling beneath it and a yellow pith helmet falling on x107; wings: wet black rock at both sides; moves: the fall down the far wall (running water)",
    draw: `
      vp 160,30
      rect back 0,0,320,136 7
      poly sky_slit 120,0 200,0 186,22 134,22 15
      poly sky_slit_b 134,0 186,0 180,12 140,12 7
      poly wall_l 0,0 120,0 134,22 150,40 150,100 120,136 0,136 8
      poly wall_r 200,0 320,0 320,136 200,136 170,100 170,40 186,22 8
      poly slab_l_a 0,0 56,0 66,136 0,136 8 e0
      poly slab_l_b 56,0 120,0 140,28 150,60 150,112 66,136 66,100 7 e0
      poly slab_r_a 264,0 320,0 320,136 254,136 8 e0
      poly slab_r_b 200,0 264,0 254,136 170,112 170,60 180,28 7 e0
      line slab_l_joint_a 20,30 52,34 c0
      line slab_l_joint_b 10,76 60,82 c0
      line slab_r_joint_a 270,30 316,34 c0
      line slab_r_joint_b 262,78 312,84 c0
      line slab_r_joint_c 262,110 316,114 c0
      poly damp_l 4,64 26,60 30,72 8,76 7
      poly damp_r 276,66 304,62 308,76 282,80 7
      poly wall_far 134,22 186,22 170,40 150,40 150,112 170,112 8
      poly ledge_l1 0,46 40,42 56,48 0,52 7 e0
      poly ledge_l2 70,70 130,64 146,72 74,78 8 e0
      poly ledge_l3 20,96 64,92 76,100 24,104 7 e0
      poly ledge_r1 280,38 320,34 320,44 284,46 7 e0
      poly ledge_r2 178,66 244,60 250,70 180,74 8 e0
      poly ledge_r3 236,96 296,92 300,102 240,106 7 e0
      line ledge_l1_hi 2,46 38,43 c15
      line ledge_l2_hi 72,70 128,65 c15
      line ledge_l3_hi 22,96 62,93 c15
      line ledge_r1_hi 282,38 318,35 c15
      line ledge_r2_hi 180,66 242,61 c15
      line ledge_r3_hi 238,96 294,93 c15
      line ledge_l_crack 100,72 108,76 c0
      line ledge_r_crack 200,64 206,70 c0
      line hatch_a 190,76 194,82 c0
      line hatch_b 200,76 204,82 c0
      line hatch_c 210,76 214,82 c0
      poly water_floor 0,112 320,112 320,136 0,136 15
      poly water_floor_dark 0,120 90,118 100,128 0,130 7
      poly water_floor_dark_r 230,118 320,120 320,132 240,130 7
      poly foam_ring_a 120,112 200,112 214,124 106,124 7
      poly foam_ring_b 130,114 190,114 200,122 120,122 15
      line water_dash_a 20,118 70,116 c8
      line water_dash_b 240,122 300,120 c8
      line water_dash_c 90,130 140,128 c8
      line water_dash_d 190,132 240,130 c8
      line water_dash_e 100,120 120,119 c7
      line water_dash_f 200,120 224,119 c7
      line water_dash_g 40,126 90,125 c8
      line water_dash_h 250,126 300,125 c8
      line water_dash_i 140,134 190,134 c7
      poly spray_cloud_a 100,76 140,72 150,82 110,88 15
      poly spray_cloud_b 176,86 214,82 224,92 184,98 15
      poly spray_cloud_c 70,100 106,96 116,106 78,110 15
      poly spray_cloud_d 214,102 252,98 260,108 222,112 15
      poly spray_cloud_e 130,96 160,92 170,100 138,104 15
      poly wet_rock_a 40,106 76,102 82,112 46,114 8 e0
      poly wet_rock_b 244,106 284,102 292,112 250,114 8 e0
      poly wet_rock_c 150,108 170,106 172,112 152,114 7 e0
      line wet_rock_a_hi 42,106 72,103 c15
      line wet_rock_b_hi 246,106 282,103 c15
      line wet_streak_a 30,10 34,60 c15
      line wet_streak_b 90,8 94,52 c15
      line wet_streak_c 232,10 228,54 c15
      line wet_streak_d 290,12 294,64 c15
      line wet_streak_e 110,30 112,70 c0
      line wet_streak_f 196,30 194,68 c0
      line crack_a 20,0 34,40 24,80 40,120 c0
      line crack_b 70,10 84,50 76,90 c0
      line crack_c 100,22 110,60 104,100 c0
      line crack_d 300,0 286,44 296,80 280,120 c0
      line crack_e 250,12 240,52 250,92 c0
      line crack_f 214,26 220,60 212,96 c0
      poly rock_l1 0,52 30,48 36,60 0,64 8 e0
      poly rock_l2 60,92 100,86 106,100 64,104 8 e0
      poly rock_r1 280,44 320,40 320,56 284,58 8 e0
      poly rock_r2 220,86 256,82 262,96 224,98 8 e0
      poly fall_body 150,40 170,40 172,110 148,110 15
      line fall_row_a 152,46 168,46 c7
      line fall_row_b 152,54 168,54 c7
      line fall_row_c 152,62 168,62 c7
      line fall_row_d 152,70 168,70 c7
      line fall_row_e 152,78 168,78 c7
      line fall_row_f 152,86 168,86 c7
      line fall_row_g 152,94 168,94 c7
      line fall_row_h 152,102 168,102 c7
      line fall_lip 146,39 174,39 c15
      line foam_dash_a 100,118 130,118 c7
      line foam_dash_b 190,118 220,118 c7
      line foam_dash_c 80,130 120,130 c8
      line foam_dash_d 200,132 250,132 c8
      line foam_dash_e 150,121 170,121 c7
      poly bridge_deck 190,28 236,30 236,32 190,30 0
      line rope_a 186,26 190,28 240,30 244,28 c0
      line rope_b 186,32 190,30 240,32 244,34 c0
      line post_l 190,24 190,32 c0
      line post_r 240,26 240,34 c0
      line post_m 214,25 214,31 c0
      poly plank_a 192,29 200,29 200,31 192,31 14
      poly plank_b 204,29 210,29 210,31 204,31 14
      poly plank_c 226,29 234,29 234,31 226,31 14
      poly plank_d 216,29 222,29 222,31 216,31 14
      line rope_fray_a 214,25 218,28 c14
      line rope_fray_b 204,32 206,36 c14
      line rope_fray_c 232,32 236,36 c14
      poly plank_fall_a 172,44 182,40 184,43 174,47 14 e0
      poly plank_fall_b 232,60 244,54 246,58 234,64 14 e0
      line fall_trace_a 178,34 174,44 c7
      line fall_trace_b 238,34 234,58 c7
      poly helmet_dome 102,72 112,66 124,70 124,78 100,78 14 e0
      poly helmet_brim 94,78 130,78 134,82 90,82 14 e0
      poly helmet_shade 114,66 124,70 124,78 114,78 7
      line helmet_band 100,76 124,76 c0
      line helmet_hi 104,72 110,68 c15
      line helmet_trace_a 112,52 112,64 c7
      line helmet_trace_b 108,42 108,52 c7
      line helmet_trace_c 116,44 116,56 c7
      poly near_rock_l 0,60 20,56 26,76 24,126 0,136 0 e7
      poly near_rock_r 320,56 300,52 296,76 300,126 320,136 0 e7
      line near_rock_hi_l 18,60 22,110 c8
      line near_rock_hi_r 302,60 298,110 c8
      line near_rock_crack_l 10,80 14,110 c8
      line near_rock_crack_r 310,80 306,110 c8
    `,
    cycles: [
      { name: "the fall", areas: ["fall_body", "fall_row_a", "fall_row_b", "fall_row_c", "fall_row_d", "fall_row_e", "fall_row_f", "fall_row_g", "fall_row_h"], style: "scroll", dir: "down", ms: 90 }
    ]
  },
  // ---- ENDING: died. A pith helmet floating on the river at dusk, drifting down to the sea ----------------------------------------------
  died: {
    version: 1,
    shot: "Eye level over the water, facing north down the river at dusk, one-point, vp 213,56; dusk palette; one low sun, a flat yellow disc on x213 at the end of the river; sky in flat bands of blue, magenta and light red; the river in flat bands of magenta stepping to blue near, black jungle silhouettes on both banks with a light red edge; subject a light red pith helmet floating on x107 with two rings spreading from it; wings: black reeds and a trunk at the left, a leaning palm at the right; moves: glints on the water (shimmer)",
    draw: `
      vp 213,56
      rect s1 0,0,320,58 5
      ellipse sun 213,52,10,9 14
      poly cloud_b 150,14 196,10 228,14 180,18 12
      poly cloud_c 260,8 308,6 320,10 276,14 12
      poly cloud_d 40,28 96,26 128,30 76,33 12
      poly jungle_far_l 0,64 0,50 18,46 38,52 58,48 80,54 100,60 118,64 0 e12
      poly jungle_far_r 320,64 320,48 298,44 276,52 252,48 232,58 218,64 0 e12
      poly far_isle 150,62 160,58 174,59 186,62 0 e12
      line far_isle_lit 158,59 172,58 c12
      poly bank_l 0,62 -150,136@0.12 -150,136@1 0,136 1
      poly bank_r 320,62 470,136@0.12 470,136@1 320,136 1
      poly bl_p1 2,98 44,94 66,102 22,108 5
      poly bl_p2 26,118 78,112 104,122 48,130 5
      poly bl_p3 74,88 110,86 124,94 82,98 5
      poly bl_c1 0,88 14,78 32,82 40,92 18,100 0 e12
      poly bl_c2 38,104 60,96 84,98 92,108 60,112 0 e12
      poly bl_c3 82,82 102,76 120,80 126,88 102,92 0 e12
      poly bl_c4 0,116 16,108 38,114 40,128 0,130 0 e12
      poly bl_c5 44,126 64,120 82,124 84,134 46,134 0 e12
      line bl_dash_a 8,104 36,102 c12
      line bl_dash_b 56,122 92,118 c12
      line bl_dash_c 86,96 112,93 c12
      poly br_p1 260,98 300,94 318,100 278,106 5
      poly br_p2 268,118 308,112 320,120 288,128 5
      poly br_p3 238,84 268,82 278,88 248,92 5
      poly br_c1 256,90 274,82 296,86 304,96 278,100 0 e12
      poly br_c2 292,104 312,96 320,98 320,110 300,114 0 e12
      poly br_c3 244,76 260,70 280,72 286,80 262,84 0 e12
      poly br_c4 280,118 300,114 320,118 320,132 284,132 0 e12
      poly br_c5 240,104 256,98 272,100 276,110 250,112 0 e12
      line br_dash_a 264,104 294,102 c12
      line br_dash_b 270,124 304,122 c12
      line br_dash_c 244,90 270,88 c12
      poly river_far -150,136@0.35 470,136@0.35 470,136@0.12 -150,136@0.12 12
      poly river_mid -150,136@0.65 470,136@0.65 470,136@0.35 -150,136@0.35 5
      poly river_near -150,136@1 470,136@1 470,136@0.65 -150,136@0.65 1
      line dash_a 70,72 100,72 c1
      line dash_b 250,74 290,74 c1
      line dash_c 60,84 96,84 c12
      line dash_d 240,86 280,86 c12
      line dash_e 30,100 80,100 c12
      line dash_f 230,102 290,102 c12
      line dash_g 20,116 90,116 c5
      line dash_h 220,118 296,118 c5
      line dash_i 10,130 100,130 c5
      line dash_j 210,128 300,128 c5
      line dash_k 150,70 168,70 c1
      line dash_l 110,78 134,78 c1
      line dash_m 40,92 70,92 c12
      line dash_n 240,94 280,94 c12
      line dash_o 120,96 150,96 c12
      line dash_p 110,134 160,134 c5
      line dash_q 150,126 190,126 c5
      line glint_a 200,66 206,66 c14
      line glint_b 214,68 222,68 c12
      line glint_c 196,76 206,76 c14
      line glint_d 212,78 224,78 c12
      line glint_e 190,90 204,90 c14
      line glint_f 210,92 226,92 c12
      line glint_g 180,106 198,106 c14
      line glint_h 204,108 224,108 c12
      line glint_i 168,120 190,120 c14
      line glint_j 196,122 220,122 c12
      ellipse ring_a 107,100,34,7 5
      ellipse ring_a_in 107,100,28,5 1
      ellipse ring_b 107,100,20,4 12
      ellipse ring_b_in 107,100,14,3 1
      poly helmet_shade 82,98 134,98 130,104 86,104 0
      poly helmet_dome 90,96 98,86 118,84 128,92 128,98 88,98 12 e0
      poly helmet_brim 80,98 138,98 142,102 76,102 12 e0
      poly helmet_lit 92,94 98,88 108,86 100,94 14
      poly helmet_dark 114,86 126,90 128,98 114,98 4
      line helmet_band 90,94 126,94 c0
      line helmet_vent 108,84 108,87 c0
      line helmet_seam 108,86 112,96 c0
      line helmet_stitch 80,100 138,100 c0
      poly helmet_buckle 120,95 124,95 124,98 120,98 14
      line helmet_brim_lit 82,98 134,98 c14
      line helmet_trail_a 142,102 160,104 c12
      line helmet_trail_b 146,104 170,106 c12
      line helmet_trail_c 150,106 180,108 c12
      poly trunk_l 0,0 20,0 24,50 20,90 26,136 0,136 0 e12
      line trunk_l_hi 18,0 22,50 20,90 c5
      line trunk_l_bark_a 8,10 10,70 c5
      line trunk_l_bark_b 12,40 14,110 c5
      line trunk_l_bark_c 4,60 6,120 c5
      line trunk_l_bark_d 16,80 18,134 c5
      line trunk_l_bark_e 10,100 12,130 c5
      poly frond_l_a 20,46 52,32 66,40 38,48 0
      poly frond_l_b 20,62 54,56 72,68 38,70 0
      poly frond_l_c 20,28 44,14 58,18 34,32 0
      line frond_l_vein_a 22,46 60,38 c5
      line frond_l_vein_b 22,64 66,64 c5
      line frond_l_vein_c 22,30 50,20 c5
      poly reeds_l 34,136 36,114 40,136 0
      poly reeds_l2 42,136 46,110 50,136 0
      poly reeds_l3 52,136 56,120 60,136 0
      poly reeds_r 276,136 280,116 284,136 0
      poly reeds_r2 286,136 290,112 294,136 0
      poly reeds_r3 296,136 300,122 304,136 0
      line reed_hi_l 36,114 37,134 c12
      line reed_hi_r 280,116 281,134 c12
      line reed_hi_l2 54,120 55,134 c12
      poly palm_r_trunk 298,136 304,92 310,92 306,136 0
      poly palm_r_a 306,92 288,80 272,86 298,92 0
      poly palm_r_b 306,92 320,76 320,86 308,96 0
      poly palm_r_c 306,92 298,70 310,76 0
      line palm_vein_a 304,92 278,84 c5
      line palm_vein_b 308,92 318,82 c5
      line palm_vein_c 306,92 300,76 c5
      line palm_ring_a 299,100 307,100 c5
      line palm_ring_b 299,112 307,112 c5
      line palm_ring_c 299,124 306,124 c5
      line palm_ring_d 299,80 304,84 c5
      poly bank_lit_l -150,136@0.5 -146,136@0.5 -146,136@0.12 -150,136@0.12 12
      poly bank_lit_r 470,136@0.5 466,136@0.5 466,136@0.12 470,136@0.12 12
      line sea_line 120,58 310,58 c14
      dots bird_a 150,40 154,38 158,40 c0
      dots bird_b 176,30 180,28 184,30 c0
      dots bird_c 120,34 124,32 128,34 c0
    `,
    cycles: [
      { name: "the glints", areas: ["glint_a", "glint_b", "glint_c", "glint_d", "glint_e", "glint_f", "glint_g", "glint_h", "glint_i", "glint_j"], colors: [14, 12, 5], style: "pingpong", scatter: true, ms: 420 }
    ]
  }
};
