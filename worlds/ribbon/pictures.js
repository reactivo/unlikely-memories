// Pictures for "The Weight of a Ribbon" (shared by the world's languages): one per room (13) and one per ending (3), as the world's AI drew them in the short notation
// (BRIEF.md §7); the poster of its page (cover) and its box art. Written by tools/world.mjs add from the hand-in.

export default {
  tethering_shed: {
    version: 1,
    shot: "Eye-level interior facing north; noon; warm amber canvas light filtering through burlap gaps casting a diagonal floor gradient and soft shaft; the tethering post with empty ring at column 107, stacked ash hurdles and hay bales filling wings; {hay}, {ring}, {post}, {hurdle}, {bale}, {bucket}; moves: dust in the sunbeam (the dust in a sunbeam recipe: a pingpong)",
    draw: `rect back_wall 0,0,320,86 fade:6,14/0,0/0,86
poly roof_shade 0,0 320,0 320,24 0,16 mix:6,0@0.5
poly floor 0,80 320,80 320,136 0,136 fade:14,6/0,80/0,136
poly hay_bed 16,84 304,84 316,136 4,136 mix:14,6@0.4
rect canvas_seam_l 72,0,3,82 mix:6,0@0.4
rect canvas_seam_r 248,0,3,82 mix:6,0@0.4
poly hurdle_w_post1 12,20 18,20 18,110 12,110 6 e0
poly hurdle_w_post2 38,28 44,28 44,116 38,116 6 e0
line hurdle_w_rail1 10,34 46,38 c6
line hurdle_w_rail2 10,54 46,58 c6
line hurdle_w_rail3 10,74 46,78 c6
line hurdle_w_rail4 10,94 46,98 c6
line hurdle_w_brace 14,36 42,96 c0
poly bale_w1 2,82 48,82 44,118 0,114 6 e0
poly bale_w1_top 2,82 28,76 68,76 48,82 14
poly bale_w2 14,94 62,94 58,132 10,128 6 e0
poly bale_w2_top 14,94 40,88 82,88 62,94 14
poly hurdle_e_post1 278,24 284,24 284,112 278,112 6 e0
poly hurdle_e_post2 304,18 310,18 310,108 304,108 6 e0
line hurdle_e_rail1 274,32 314,28 c6
line hurdle_e_rail2 274,52 314,48 c6
line hurdle_e_rail3 274,72 314,68 c6
line hurdle_e_rail4 274,92 314,88 c6
line hurdle_e_brace 308,30 280,94 c0
poly bale_e1 268,84 316,84 320,122 272,122 6 e0
poly bale_e1_top 268,84 288,78 320,78 316,84 14
poly bale_e2 252,98 302,98 306,134 256,134 6 e0
poly bale_e2_top 252,98 274,92 320,92 302,98 14
poly sunbeam 82,0 128,0 188,136 102,136 mix:,14@0.22
poly beam_floor_pool 102,96 174,96 188,136 102,136 mix:,15@0.18
poly post_shadow 110,112 182,126 176,132 106,116 mix:,0@0.65
poly post 102,32 114,32 112,116 100,116 6 e0
rect post_lit 108,32,3,84 14
ellipse ring_plate 107,68,4,5 8 e0
ellipse ring_hole 107,68,2,3 6
ellipse ring 107,74,5,5 none e15
poly tether_rope 107,79 104,86 108,98 114,104 14 e6
poly bench 184,86 244,86 242,98 182,98 6 e0
poly bench_top 184,86 200,80 256,80 244,86 14
rect bench_leg1 188,98,4,24 6 e0
rect bench_leg2 238,98,4,24 6 e0
poly bucket_shadow 210,122 232,122 236,128 206,128 mix:,0@0.6
poly bucket 212,106 228,106 225,124 215,124 8 e0
ellipse bucket_rim 220,106,8,2 7 e0
line bucket_handle 212,106 220,96 c8
line bucket_handle2 220,96 228,106 c8
line hay_straw1 78,114 88,112 c14
line hay_straw2 118,124 130,120 c14
line hay_straw3 142,108 152,112 c14
line hay_straw4 164,126 172,122 c14
line hay_straw5 194,118 206,120 c14
line hay_straw6 88,92 98,96 c14
line hay_straw7 148,88 158,86 c14
line hay_straw8 234,130 246,128 c14
line hay_straw9 60,122 70,126 c14
dots motes 96,22 108,36 122,18 104,52 116,44 128,58 112,70 126,82 138,68 118,94 132,102 144,88 122,112 138,118 152,104 142,126 158,122 168,114 c6`,
    cycles: [
      {
        name: "the dust in the sunbeam",
        areas: ["motes"],
        colors: [6, 6, 6, 14, 15],
        style: "pingpong",
        scatter: true,
        ms: 380
      }
    ],
    overlays: [{ object: "rusted_sickle", at: [194, 74] }, { object: "cattle_horn", at: [224, 74] }]
  },
  hurdle_passage: {
    version: 1,
    shot: "eye level facing north, looking along the sunken track between hazel wattles towards the open tethering shed; noon; glaring high summer sun casting short harsh shadows directly under the hurdles and stakes; hazel hurdles framing the passage on left and right, beaten earth lane in center receding to tethering shed entrance north, trampled summer grass verges; hazel {wattles}, ash stakes, tufts of {fleece} snagged on uprights, dried nettles and dock weeds along hurdle base; moves: grass blades in the wind (the grass in the wind recipe: a rotate)",
    draw: `rect sky 0,0,320,54 fade:9,11/0,0/0,54
rect horizon_glow 0,46,320,12 fade:11,15/0,46/0,58
poly shed_roof_far 106,32 160,22 214,32 214,44 106,44 6
poly shed_gable_shdw 106,44 160,22 214,44 6 mix:6,0@0.5
rect shed_opening 132,44,56,34 0
rect shed_post_l 130,44,4,34 6 e0
rect shed_post_r 186,44,4,34 6 e0
rect shed_beam 128,42,64,4 6 e0
poly far_trees_l 30,40 60,34 90,38 106,44 30,44 2
poly far_trees_r 214,44 240,36 275,34 305,42 214,44 2
poly verge_l 0,54 120,68 0,90 10
poly verge_r 320,54 200,68 320,90 10
vp 160,68
poly track 120,68 200,68 268,136 52,136 fade:14,6/160,68/160,136
poly verge_fore_l 0,84 68,136 0,136 2 mix:2,10@0.4
poly verge_fore_r 320,84 252,136 320,136 2 mix:2,10@0.4
poly hurdle_shdw_l 28,100 104,136 78,136 20,100 mix:6,0@0.7
poly hurdle_shdw_r 292,100 216,136 242,136 300,100 mix:6,0@0.7
rect wattle_l_far 102,52,24,24 6
rect wattle_r_far 194,52,24,24 6
line stake_l_1 106,46 106,76 c6
line stake_l_2 118,48 118,78 c6
line stake_l_3 126,50 126,80 c6
line stake_r_1 194,50 194,80 c6
line stake_r_2 202,48 202,78 c6
line stake_r_3 214,46 214,76 c6
poly wattle_l_mid 44,56 104,66 104,96 44,82 6 mix:6,14@0.3 e0
poly wattle_r_mid 216,66 276,56 276,82 216,96 6 mix:6,14@0.3 e0
line stake_lm_1 50,52 50,86 c6
line stake_lm_2 68,56 68,90 c6
line stake_lm_3 86,60 86,94 c6
line stake_lm_4 102,64 102,98 c6
line stake_rm_1 218,64 218,98 c6
line stake_rm_2 234,60 234,94 c6
line stake_rm_3 252,56 252,90 c6
line stake_rm_4 270,52 270,86 c6
line rod_l_1 44,60 104,70 c14
line rod_l_2 44,66 104,76 c6
line rod_l_3 44,72 104,82 c14
line rod_l_4 44,78 104,88 c6
line rod_r_1 216,70 276,60 c14
line rod_r_2 216,76 276,66 c6
line rod_r_3 216,82 276,72 c14
line rod_r_4 216,88 276,78 c6
poly wattle_l_fore -10,64 56,76 56,136 -10,136 6 e0
poly wattle_r_fore 264,76 330,64 330,136 264,136 6 e0
rect post_l_fore 24,68,8,68 6 e0
rect post_l_end 52,74,6,62 6 e0
rect post_r_end 262,74,6,62 6 e0
rect post_r_fore 288,68,8,68 6 e0
line weave_l_1 -10,72 56,84 c14
line weave_l_2 -10,80 56,92 c6
line weave_l_3 -10,88 56,100 c14
line weave_l_4 -10,96 56,108 c6
line weave_l_5 -10,104 56,116 c14
line weave_l_6 -10,112 56,124 c6
line weave_l_7 -10,120 56,132 c14
line weave_r_1 264,84 330,72 c14
line weave_r_2 264,92 330,80 c6
line weave_r_3 264,100 330,88 c14
line weave_r_4 264,108 330,96 c6
line weave_r_5 264,116 330,104 c14
line weave_r_6 264,124 330,112 c6
line weave_r_7 264,132 330,120 c14
dots fleece_1 52,82 53,82 54,83 52,84 c15
dots fleece_2 26,94 27,94 28,95 27,96 c15
dots fleece_3 103,72 104,72 c7
dots fleece_4 219,74 220,74 219,75 c15
dots fleece_5 263,90 264,90 264,91 c7
dots nettles_l 48,130 52,126 56,132 46,134 50,135 c2
dots nettles_r 264,130 268,128 272,134 262,135 c2
line dock_l 58,134 62,128 66,135 c10
line dock_r 256,134 252,127 248,135 c10
line rut_l 112,96 82,135 c6
line rut_r 208,96 238,135 c6
line grass_twin_1 74,134 76,128 78,134 c2
line grass_tuft_1 72,134 74,128 76,134 c10
line grass_twin_2 244,134 246,128 248,134 c2
line grass_tuft_2 242,134 244,128 246,134 c10
line grass_twin_3 62,135 64,130 66,135 c2
line grass_tuft_3 60,135 62,130 64,135 c10`,
    cycles: [
      {
        name: "grass in the wind",
        areas: ["grass_twin_1", "grass_twin_2", "grass_twin_3"],
        colors: [10, 10, 2],
        rest: 57,
        style: "rotate",
        sweep: [4, 27, 45],
        ms: 150
      }
    ],
    overlays: [{ object: "clover_bunch", at: [84, 122] }, { object: "arthur_pendrick", at: [160, 118], tall: 66 }]
  },
  fairgreen_centre: {
    version: 1,
    shot: "Eye-level facing north along the fair lane, vanishing point at 160,78; noon; bright summer sunlight cast from high overhead, shadows short and sharp beneath canvas eaves; the thoroughfare of trampled turf and bunting strings spanning stalls, with {stall} awnings framing each wing; dressing of {turf}, scattered {sawdust}, paper {wrappers}, canvas {marquee} guy ropes, and timber {hurdles}; moves: the bunting pennants (your own cycle: a wind flutter).",
    draw: `vp 160,78
rect sky 0,0,320,52 fade:9,11/0,0/0,52
rect ground 0,52,320,84 fade:14,6/0,52/0,136
poly far_trees 0,48 35,42 90,44 140,46 180,45 230,43 280,45 320,41 320,54 0,54 2
poly far_marquee 120,44 160,32 200,44 200,56 120,56 15 e6
poly far_marquee_shade 160,32 200,44 200,56 160,56 mix:15,6@0.3
poly lane_turf 128,54 192,54 240,136 80,136 mix:14,6@0.4
poly sawdust_patch_1 140,75 180,75 190,88 130,88 14
poly sawdust_patch_2 95,108 150,105 160,122 85,120 mix:14,6@0.2
poly tent_l_back 0,22 85,42 85,96 0,106 6
poly tent_l_roof 0,10 95,30 85,42 0,22 14
poly tent_l_valance 0,22 90,40 85,46 0,28 mix:14,4@0.5
poly tent_r_back 235,42 320,20 320,105 235,96 6
poly tent_r_roof 225,30 320,10 320,20 235,42 14
poly tent_r_valance 230,40 320,20 320,26 235,46 mix:14,2@0.5
poly post_l1 84,38 88,38 88,110 84,110 6 e0
poly post_r1 232,38 236,38 236,110 232,110 6 e0
poly counter_l 0,72 86,76 86,92 0,86 mix:6,0@0.4 e0
poly counter_r 234,76 320,72 320,86 234,92 mix:6,0@0.4 e0
poly hurdle_l 118,60 142,60 138,72 114,72 6 e0
poly hurdle_r 178,60 202,60 206,72 182,72 6 e0
line rope_l 92,32 120,68 c6
line rope_r 228,32 200,68 c6
poly crowd_mid 142,58 147,52 153,52 158,58 163,53 169,53 173,59 178,74 138,74 8 e0
poly crowd_f1_head 148,50 152,50 152,55 148,55 7
poly crowd_f1_hat 146,50 154,50 154,48 146,48 6
poly crowd_f2_head 164,51 168,51 168,56 164,56 7
poly crowd_f2_bonnet 163,49 169,49 169,52 163,52 12
poly shadow_l 0,102 90,100 86,114 0,118 mix:,0@0.6
poly shadow_r 230,100 320,102 320,118 234,114 mix:,0@0.6
line bunting_string_1 0,16 85,34 c0
line bunting_string_2 85,34 160,26 c0
line bunting_string_3 160,26 235,34 c0
line bunting_string_4 235,34 320,16 c0
poly b1 18,22 28,24 23,32 4
poly b2 42,27 52,29 47,38 12
poly b3 64,32 74,34 69,44 14
poly b4 100,32 110,30 105,42 2
poly b5 124,29 134,28 129,38 4
poly b6 142,27 152,26 147,35 12
poly b7 172,27 182,28 177,36 14
poly b8 194,30 204,32 199,41 2
poly b9 216,33 226,35 221,44 4
poly b10 248,31 258,29 253,39 12
poly b11 272,26 282,24 277,34 14
poly b12 296,21 306,19 301,28 2
poly wrapper1 108,114 114,113 115,116 109,117 15
poly wrapper2 178,122 184,120 185,123 179,124 15
poly wrapper3 148,94 152,93 153,95 149,96 12
line turf_tuft1 92,126 95,122 c2
line turf_tuft2 214,128 217,123 c2
line turf_tuft3 134,102 136,99 c2`,
    cycles: [
      {
        name: "bunting_flutter",
        areas: ["b1", "b3", "b5", "b7", "b9", "b11"],
        colors: [4, 12, 14, 2],
        style: "rotate",
        ms: 320
      }
    ],
    overlays: [{ object: "arthur_pendrick", at: [152, 124], tall: 68 }]
  },
  tea_tent: {
    version: 1,
    shot: "eye level facing north, vanishing point at 160,54; noon; high summer diffuse sunlight filtered through canvas awning, gradient from awning ridge down and from trestle boards into foreground turf; trestle table across center columns with {martha} behind it serving tea, {coppers} venting steam on east bench, wooden crate and baskets dressing west wing, open flap east showing fairgreen grass; {coppers}, {trestle_table}, {scones}, {crocks}, {martha}, {awning}; moves: steam from the copper (smoke from a chimney recipe: loop)",
    draw: `rect bg 0,0,320,136 6
poly grass 0,84 320,84 320,136 0,136 fade:2,6/160,84/160,136
poly flap_e 254,20 320,32 320,108 254,92 fade:9,11/254,20/320,80
poly fair_grass 254,78 320,84 320,114 254,92 10
poly fair_hedge 254,74 320,78 320,84 254,80 2
poly marquee_w 0,26 56,38 56,98 0,92 fade:14,6/0,26/56,98
poly canvas_back 50,22 260,22 260,88 50,88 fade:15,14/160,22/160,88
line ridge_pole 40,20 270,20 c6
line pole_w 52,20 52,110 c6
line pole_e 258,20 258,110 c6
line pole_mid 158,18 158,82 c6
poly roof_slope_l 0,0 160,0 158,22 0,22 fade:11,15/80,0/80,22
poly roof_slope_r 160,0 320,0 320,22 158,22 fade:11,15/240,0/240,22
rect side_bench_e 230,76,36,34 6
rect side_bench_top 226,74,44,4 14 e6
poly side_bench_shade 230,110 266,110 270,120 226,120 mix:6,0@0.5
poly side_bench_w 14,78 48,78 48,114 14,114 6
rect side_bench_w_top 10,76,42,4 14 e6
rect box_w1 18,84,22,18 6 e0
line box_w1_line 18,93 40,93 c0
rect box_w2 26,64,18,12 6 e0
ellipse basket_w 36,106,10,7 6
ellipse basket_w_rim 36,102,9,3 14
poly shadow_bench_w 12,118 50,118 44,128 6,128 mix:6,0@0.5
poly copper_stand 234,68 258,68 256,74 236,74 8 e0
rect copper_body 236,46,20,22 8 e0
ellipse copper_rim 246,46,10,3 7
rect copper_tap 232,62,5,3 14 e0
line copper_pipe 246,43 246,36 c8
ellipse copper_lid 246,43,8,2 7 e0
rect copper_body2 254,52,14,18 8 e0
ellipse copper_rim2 261,52,7,2 7
poly martha_body 144,44 172,44 178,82 138,82 4
poly martha_apron 149,48 167,48 172,82 144,82 15
ellipse martha_head 158,34,7,9 7
poly martha_hair 151,26 165,26 166,35 150,35 6
ellipse martha_bun 158,25,4,3 6
poly martha_collar 154,43 162,43 158,47 15
poly martha_arm_l 140,46 146,45 142,66 136,63 4
poly martha_arm_r 170,45 176,46 180,63 174,66 4
ellipse martha_hand_l 139,66,3,3 7
ellipse martha_hand_r 177,66,3,3 7
outline martha e0
poly table_top 42,80 274,80 278,92 38,92 fade:14,6/158,80/158,92
rect table_edge 38,92,240,4 6 e0
rect table_leg_l 52,96,6,36 6 e0
rect table_leg_r 256,96,6,36 6 e0
rect table_leg_m 156,96,6,36 6 e0
line table_brace 56,112 258,112 c0
poly table_cloth_mid 104,80 212,80 216,95 100,95 15
poly cloth_overhang 100,95 216,95 214,103 102,103 7 e0
poly table_shadow 36,128 280,128 274,135 42,135 mix:6,0@0.7
poly crock1 76,66 88,66 90,82 74,82 6 e0
ellipse crock1_top 82,66,6,2 14
poly crock2 90,70 100,70 102,82 88,82 4 e0
ellipse crock2_top 95,70,5,2 12
rect plate1 114,83,24,4 15 e7
ellipse scones_base 126,82,10,4 6
ellipse scone1 121,80,3,2 14 e6
ellipse scone2 127,79,3,2 14 e6
ellipse scone3 131,80,3,2 14 e6
ellipse scone4 124,77,3,2 14 e6
ellipse scone5 128,77,3,2 14 e6
rect tray2 204,83,28,4 8 e0
poly jug 222,68 232,68 234,83 220,83 15 e7
ellipse jug_top 227,68,5,2 7
line jug_handle 232,71 235,76 c7
ellipse cup1 210,82,3,2 15
ellipse cup2 216,82,3,2 15
ellipse crock3 62,75,7,6 6 e0
ellipse crock3_rim 62,72,6,2 14
rect crate_floor 72,112,24,14 6 e0
line crate_fl_slat 72,119 96,119 c0`,
    cycles: [],
    overlays: [{ object: "curd_tart", at: [166, 77] }],
    loops: [
      {
        name: "the steam",
        at: [240, 10],
        frames: [
          [
            "......77........",
            ".....77.........",
            "....87..........",
            "...87...........",
            "...87...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........77......",
            ".......77.......",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "...77...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........7.......",
            ".......7........",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7..........."
          ],
          [
            "....87..........",
            "...87...........",
            "...87...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........77......",
            ".......77.......",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "...77...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........7.......",
            ".......7........",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7..........."
          ],
          [
            "...87...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........77......",
            ".......77.......",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "...77...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........7.......",
            ".......7........",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            ".....7..........",
            ".....7.........."
          ],
          [
            ".....77.........",
            "......77........",
            ".......77.......",
            "........77......",
            ".......77.......",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "...77...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........7.......",
            ".......7........",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            ".....7..........",
            ".....7..........",
            ".....7..........",
            ".....7.........."
          ],
          [
            ".......77.......",
            "........77......",
            ".......77.......",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "...77...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........7.......",
            ".......7........",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            ".....7..........",
            ".....7..........",
            ".....7..........",
            ".....7..........",
            "....7...........",
            "....7..........."
          ],
          [
            ".......77.......",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "...77...........",
            "....77..........",
            ".....77.........",
            "......77........",
            ".......77.......",
            "........7.......",
            ".......7........",
            "......77........",
            ".....77.........",
            "....77..........",
            "...77...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7...........",
            ".....7..........",
            ".....7..........",
            ".....7..........",
            ".....7..........",
            "....7...........",
            "....7...........",
            "....7...........",
            "....7..........."
          ]
        ],
        ms: 280,
        style: "loop"
      }
    ]
  },
  produce_marquee: {
    version: 1,
    shot: "Eye level facing north looking down the long tent aisle, vanishing point slightly right of centre; forest; filtered noon sun through heavy green tent-cloth onto shaded trestles; long {trestles} heaped with prize {marrows}, pots of comb {honey}, and pale {cheese} rounds in columns 60 to 220, canvas flap opening east in the right wing, guy-ropes and side canvas in the left wing; {trestles}, {marrows}, {honey}, {cheese}, tent {pole}, {pennants}; moves: dust motes drifting across the sunbeam (the dust in a sunbeam recipe: a pingpong)",
    draw: `vp 180,68
rect bg 0,0,320,136 2
rect roof 0,0,320,68 fade:2,10/0,0/0,68
poly ridge 0,12 180,52 320,12 180,50 0,10 10
poly floor 0,136@1 320,136@1 320,136@0.4 0,136@0.4 fade:0,2/180,136/180,68
line ridge_seam 0,11 180,51 320,11 c2
poly wall_l 0,0 48,0 48,90 0,112 fade:0,2/0,112/48,0
poly wall_r 272,0 320,0 320,112 272,90 fade:0,2/320,112/272,0
poly east_opening 272,36 320,24 320,110 272,94 14
poly east_opening_inner 278,38 320,28 320,104 278,92 mix:14,6@0.35
poly flap_shadow 272,36 280,38 276,96 272,94 6
rect pole_main 178,16,4,100 6
line pole_highlight 179,16 179,116 c14
line rope_l1 180,30 20,86 c0
line rope_l2 180,42 36,92 c0
line rope_r1 180,30 260,82 c0
poly pennant_line 30,28 100,34 180,42 240,36 290,30 none e0
poly pennant1 60,31 72,32 66,42 12 e0
poly pennant2 118,36 130,37 124,47 14 e0
poly pennant3 210,38 222,37 216,48 12 e0
poly trestle_far 120,74 240,74 242,78 118,78 6
rect trestle_far_leg1 126,78,3,22 0
rect trestle_far_leg2 232,78,3,22 0
poly trestle_mid 80,82 250,82 256,92 74,92 6
poly trestle_top 74,90 256,90 250,82 80,82 10
rect trestle_mid_leg1 88,92,5,30 0
rect trestle_mid_leg2 240,92,5,30 0
line trestle_brace1 90,96 112,122 c0
line trestle_brace2 242,96 220,122 c0
poly trestle_front 52,98 228,98 222,124 44,124 2
poly trestle_cloth 52,98 228,98 226,108 48,108 14
poly trestle_cloth_drape 48,108 226,108 222,124 44,124 mix:14,6@0.5
line cloth_crease1 84,108 80,124 c6
line cloth_crease2 130,108 128,124 c6
line cloth_crease3 182,108 180,124 c6
rect trestle_f_leg1 54,122,6,14 0
rect trestle_f_leg2 214,122,6,14 0
ellipse marrow1 106,94,18,7 2
ellipse marrow1_top 106,93,16,5 10
line marrow1_stripe1 94,93 118,93 c14
line marrow1_stripe2 98,95 114,95 c2
line marrow1_stem 88,94 85,92 c6
ellipse marrow2 136,96,22,8 0
ellipse marrow2_body 137,95,20,7 2
ellipse marrow2_hi 138,94,17,5 10
line marrow2_stripe1 124,94 150,94 c14
line marrow2_stem 158,95 162,92 c6
ellipse marrow3 166,97,15,6 2
ellipse marrow3_hi 166,96,13,4 10
rect honey_jar1 184,88,8,11 14
rect honey_lid1 183,86,10,2 6
rect honey_jar2 194,87,9,12 14
rect honey_lid2 193,85,11,2 6
rect honey_jar3 205,89,8,10 14
rect honey_lid3 204,87,10,2 6
line honey_shelf 180,99 216,99 c6
ellipse cheese1_base 68,101,11,6 6
ellipse cheese1_top 68,98,11,5 14
rect cheese1_side 57,98,22,3 14
ellipse cheese2_base 82,103,12,6 6
ellipse cheese2_top 82,100,12,5 15
rect cheese2_side 70,100,24,3 14
ellipse cheese3_base 74,96,9,4 6
ellipse cheese3_top 74,94,9,4 15
rect cheese3_side 65,94,18,2 14
rect crate_l 10,102,28,26 6
line crate_l_diag 10,102 38,128 c0
line crate_l_rim 10,102 38,102 c14
rect crate_r 242,104,26,24 6
line crate_r_rim 242,104 268,104 c14
line crate_r_div 255,104 255,128 c0
poly sunbeam 276,36 320,24 210,136 120,136 mix:,14@0.2
poly floor_spill 140,118 200,118 220,136 130,136 mix:2,14@0.35
dots motes 150,112 162,105 174,120 188,110 195,95 204,82 212,102 225,92 238,80 246,72 168,116 182,104 192,122 208,114 220,98 230,88 242,76 254,64 158,118 178,108 186,114 216,88 228,104 240,94 250,84 260,70 c2`,
    cycles: [
      {
        name: "the dust motes",
        areas: ["motes"],
        colors: [2, 2, 2, 14, 15],
        style: "pingpong",
        scatter: true,
        ms: 380
      }
    ],
    overlays: [{ object: "curd_tart", at: [150, 99] }]
  },
  judging_ring: {
    version: 1,
    shot: "eye level facing north, vanishing point slightly west; noon; glaring direct sunlight overhead, two dithered gradients: sky pale blue fading to light cyan at the horizon, and the arena sawdust fading yellow to brown toward the roped fence; {rails} circling the ring with crowd silhouettes along the north fence line, bailiff pavilion canvas visible on the eastern wing, {sawdust} ground filling the ring; dressed with wooden {post} stanchions, {ropes}, judging {rosette} pinned to a post, cattle {pen} boards; moves: a pennant atop the marquee (the flag recipe: a loop).",
    draw: `vp 130,48
rect sky 0,0,320,48 fade:9,11/0,0/0,48
rect marquee_back 80,18,160,30 15
poly marquee_roof 70,22 160,2 250,22 15 e7
poly marquee_stripe1 90,20 110,13 118,24 96,27 4
poly marquee_stripe2 135,8 155,3 158,24 140,24 4
poly marquee_stripe3 180,7 200,12 196,24 178,24 4
poly marquee_stripe4 220,17 238,21 234,26 216,24 4
line pavilion_pole 160,2 160,18 c0
rect trees_bg 0,30,85,22 mix:2,10@0.3
rect trees_bg2 245,28,75,24 mix:2,10@0.3
poly orchard_trees 0,38 35,28 75,34 85,48 0,48 2
poly orchard_trees_r 240,48 255,32 290,26 320,34 320,48 2
rect ground_base 0,48,320,88 fade:6,14/0,48/0,135
poly ring_sawdust 0,72 320,68 320,135 0,135 14
poly ring_shadow 0,68 320,68 320,78 0,82 mix:14,6@0.45
poly crowd_base 50,46 270,46 270,62 50,62 8
poly crowd_fig1 62,38 72,38 74,60 60,60 0
ellipse crowd_head1 67,36,4,5 0
poly crowd_fig2 82,40 92,39 94,62 80,62 6
ellipse crowd_head2 87,37,4,4 6
poly crowd_fig3 105,37 116,36 118,60 103,60 8
ellipse crowd_head3 110,34,4,5 7
rect crowd_hat3 104,33,12,2 0
poly crowd_fig4 135,39 146,38 147,60 133,60 0
ellipse crowd_head4 140,35,4,4 0
poly crowd_fig5 170,37 182,36 183,61 168,61 8
ellipse crowd_head5 176,34,4,5 6
rect crowd_hat5 170,33,12,2 6
poly crowd_fig6 202,38 214,39 215,62 200,62 0
ellipse crowd_head6 208,35,4,4 0
poly crowd_fig7 230,40 242,40 244,61 228,61 6
ellipse crowd_head7 236,37,4,4 7
rect cattle_back 210,50,45,22 6
poly cattle_head 200,53 212,50 214,60 202,62 6
rect cattle_leg1 214,70,4,12 0
rect cattle_leg2 224,71,4,11 0
rect cattle_leg3 242,70,4,12 0
rect cattle_leg4 250,71,3,11 0
line post_bk1 55,46 55,68 c6
line post_bk2 95,47 95,69 c6
line post_bk3 135,47 135,70 c6
line post_bk4 175,47 175,70 c6
line post_bk5 215,48 215,70 c6
line post_bk6 255,48 255,69 c6
line rails_bk_top 40,54 275,54 c14
line rails_bk_mid 40,62 275,62 c6
line rails_bk_bot 40,67 275,67 c0
poly pavilion_wing 265,30 320,18 320,110 265,95 15 e7
poly pavilion_stripe1 280,26 295,22 295,102 280,98 4
poly pavilion_stripe2 310,19 320,17 320,110 310,106 4
rect booth_table 270,82,45,18 6 e0
rect booth_cloth 272,83,41,12 15
poly pen_fence_w 0,55 45,62 42,95 0,86 6 e0
line pen_rail1 0,64 45,71 c14
line pen_rail2 0,76 43,83 c14
rect post_w1 42,60,5,38 6 e0
line post_w1_hi 43,60 43,98 c14
rect post1 78,66,7,54 6 e0
line post1_hi 79,66 79,120 c14
rect post2 158,68,8,58 6 e0
line post2_hi 159,68 159,126 c14
rect post3 242,67,7,55 6 e0
line post3_hi 243,67 243,122 c14
line ropes_top 0,84 81,90 c14
line ropes_top_mid 85,90 162,94 c14
line ropes_top_r 166,94 245,91 c14
line ropes_top_far 249,91 320,84 c14
line ropes_bot 0,102 81,108 c6
line ropes_bot_mid 85,108 162,112 c6
line ropes_bot_r 166,112 245,109 c6
line ropes_bot_far 249,109 320,102 c6
poly post_shad1 85,120 115,124 115,127 82,121 mix:14,0@0.6
poly post_shad2 166,126 200,130 200,133 162,127 mix:14,0@0.6
poly post_shad3 249,122 280,126 280,129 245,123 mix:14,0@0.6
ellipse rosette 162,82,5,5 4
ellipse rosette_mid 162,82,2,2 14
line rosette_tail1 161,87 159,94 c4
line rosette_tail2 163,87 165,94 c4
dots sawdust_bits 110,95 125,108 140,88 185,102 210,91 95,114 230,115 175,120 c15
dots sawdust_shads 111,96 126,109 141,89 186,103 211,92 96,115 231,116 176,121 c6
line flag_pole 160,-2 160,2 c0`,
    cycles: [],
    overlays: [{ object: "arthur_pendrick", at: [108, 126], tall: 66 }],
    loops: [
      {
        name: "the flag",
        at: [160, 0],
        frames: [
          ["444cccc.......", "4444ccccc.....", "4444cccccc....", "4444ccccc.....", "444cccc......."],
          ["4444cccc......", "444cccc4c.....", "4444cccc4c....", "444ccccc4c....", "4444cccc......"],
          ["444ccccc......", "4444ccccc.....", "444cccc4cc....", "4444cccc4c....", "444cccc4......"],
          ["4444cccc......", "444ccccc4.....", "4444cccc4c....", "444ccccc4.....", "4444cccc......"]
        ],
        ms: 300,
        style: "loop"
      }
    ]
  },
  bailiff_booth: {
    version: 1,
    shot: "eye-level view facing north, vanishing point slightly right of centre; noon; overhead midday sunlight filtered under canvas; Bailiff Craddock {bailiff_craddock} seated behind a heavy deal {table} piled with {ledgers} and an {inkpot}, the wooden booth open at the west side towards the bright ring, sheltered beneath a canvas {awning} with a small green estate {flag} stirring at the roof corner; dressing includes deal {planks}, canvas {guyropes}, a {ledger_stack}, an iron {ledger_weight}, a {stool}, a {pennant}; moves: the estate flag (the flag recipe: a loop)",
    draw: `rect sky 0,0,320,68 fade:9,11/0,0/0,68
poly grass_far 0,64 320,64 320,136 0,136 fade:10,2/0,64/0,136
rect back_shadow 42,26,278,110 mix:6,0@0.4
poly wall_planks 42,26 320,26 320,110 42,110 fade:6,14/42,26/320,110
line plank_line1 42,42 320,42 c6
line plank_line2 42,58 320,58 c6
line plank_line3 42,74 320,74 c6
line plank_line4 42,90 320,90 c6
line plank_line5 42,106 320,106 c6
poly booth_floor 36,92 320,92 320,136 28,136 fade:14,6/180,92/180,136
line floor_seam1 80,92 72,136 c6
line floor_seam2 140,92 136,136 c6
line floor_seam3 200,92 204,136 c6
line floor_seam4 260,92 272,136 c6
rect post_w 36,16,8,120 6 e0
rect post_e 312,16,8,120 6 e0
rect beam_top 36,16,284,8 6 e0
poly awning_top 24,0 320,0 320,28 24,28 15
poly awn_red1 24,0 48,0 44,28 20,28 4
poly awn_red2 72,0 96,0 92,28 68,28 4
poly awn_red3 120,0 144,0 140,28 116,28 4
poly awn_red4 168,0 192,0 188,28 164,28 4
poly awn_red5 216,0 240,0 236,28 212,28 4
poly awn_red6 264,0 288,0 284,28 260,28 4
poly awn_valance 18,28 320,28 320,33 18,33 14
line awn_scallop1 18,33 42,33 c4
line awn_scallop2 66,33 90,33 c4
line awn_scallop3 114,33 138,33 c4
line awn_scallop4 162,33 186,33 c4
line awn_scallop5 210,33 234,33 c4
line awn_scallop6 258,33 282,33 c4
line rope_w 36,24 8,110 c8
line rope_ring 20,20 0,80 c8
line flag_pole 28,0 28,18 c0
rect stool 180,72,32,24 6 e0
rect stool_leg_l 184,88,4,20 6 e0
rect stool_leg_r 204,88,4,20 6 e0
poly craddock_legs 184,76 210,76 214,104 180,104 8
poly craddock_coat 174,48 218,48 222,86 170,86 6
poly craddock_vest 188,52 204,52 202,74 190,74 4
poly craddock_collar 192,48 200,48 198,54 194,54 15
ellipse craddock_head 196,40,8,10 7
rect craddock_hat_brim 182,34,28,3 0
poly craddock_hat_crown 186,22 206,22 204,34 188,34 0
poly craddock_arm_l 170,52 182,54 178,74 166,68 6
poly craddock_arm_r 212,52 224,54 228,70 216,74 6
ellipse craddock_hand_l 168,72,4,3 7
ellipse craddock_hand_r 228,72,4,3 7
outline craddock e0
rect table_shadow 88,112,184,12 mix:,0@0.7
poly table_top 84,72 276,72 268,88 72,88 fade:14,6/84,72/268,88
line table_edge 72,88 268,88 c14
rect table_apron 72,88,196,8 6 e0
rect table_leg_fl 76,96,8,36 6 e0
rect table_leg_fr 256,96,8,36 6 e0
rect table_leg_bl 92,88,6,32 mix:6,0@0.5 e0
rect table_leg_br 244,88,6,32 mix:6,0@0.5 e0
rect ledger1 104,74,32,10 4 e0
rect ledger1_pages 106,75,28,2 15
rect ledger2 102,70,34,4 6 e0
rect ledger3 148,74,24,10 6 e0
rect ledger3_ajar 144,72,32,8 15 e0
line ledger3_spine 160,72 160,80 c0
rect ledger_weight 158,74,4,4 8 e0
rect inkpot 216,74,8,8 7 e0
rect inkpot_neck 218,72,4,2 8
line quill 222,66 226,74 c15
rect ledger_stack 234,74,22,12 4 e0
line stack_div1 234,78 256,78 c0
line stack_div2 234,82 256,82 c0
poly pennant 312,24 294,30 312,36 2`,
    cycles: [],
    overlays: [
      { object: "tin_canteen", at: [120, 80] },
      { object: "brass_tether_key", at: [180, 80] },
      { object: "bridled_barnaby", at: [48, 96] }
    ],
    loops: [
      {
        name: "the estate flag",
        at: [28, 1],
        frames: [
          [
            "22222222222222..",
            "2aaaaaaaaaaaa2..",
            "2aaaaaaaaaaaa2..",
            "2aaaaaaaaaaaa2..",
            "2aaaaaaaaaaaa2..",
            "22222222222222.."
          ],
          [
            "222222222222....",
            ".2aaaaaaaaaa22..",
            ".2aaaaaaaaaaaa2.",
            ".2aaaaaaaaaaaa2.",
            ".22222222222222.",
            "....2222222222.."
          ],
          [
            "22222222222222..",
            "22aaaaaaaaaaaa2.",
            ".2aaaaaaaaaaaa22",
            ".2aaaaaaaaaaaa22",
            "22aaaaaaaaaaaa2.",
            "22222222222222.."
          ],
          [
            ".2222222222222..",
            "22aaaaaaaaaaaa2.",
            "2aaaaaaaaaaaa22.",
            "2aaaaaaaaaaaa22.",
            "22aaaaaaaaaaaa2.",
            ".2222222222222.."
          ]
        ],
        ms: 300,
        style: "loop"
      }
    ]
  },
  games_stall: {
    version: 1,
    shot: "Eye-level facing north toward the striped marquee and fairground, vanishing point at 150,68; noon; bright summer high sun casting short dark dithered shadows below timber posts and trestles; the striped canvas stall framing the scene, green baize trestle in center-left, Julian attending the {skittles} and coconut cups, parish orchard hedge and gravel path filling the right wing; dressing of {trestle}, {baize}, {skittles}, {board}, brass {pegs}, striped {canopy}, {coconuts}, {gravel}; moves: two grass tufts in the breeze (the grass in the wind recipe: a rotate)",
    draw: `rect sky 0,0,320,48 fade:9,11/0,0/0,48
rect ground 0,48,320,88 fade:14,6/0,48/0,136
poly hedge_far 190,48 320,48 320,68 190,64 2
poly orchard_trees 230,22 320,18 320,52 220,50 10
poly orchard_trunks 248,46 252,46 252,60 248,60 6
poly path_gravel 190,74 320,96 320,136 170,136 fade:14,6/170,74/320,136
poly grass_fair 0,48 190,48 170,136 0,136 2
poly grass_dither 0,70 180,70 170,136 0,136 mix:2,10@0.35
poly grass_far_hill 0,42 160,40 160,48 0,48 10
rect pole_l 42,10,5,116 6 e0
rect pole_r 242,10,5,116 6 e0
poly awning_top 30,8 254,8 244,38 40,38 15 e0
poly stripe_1 40,8 64,8 60,38 40,38 4
poly stripe_2 88,8 112,8 106,38 84,38 4
poly stripe_3 136,8 160,8 152,38 130,38 4
poly stripe_4 184,8 208,8 198,38 176,38 4
poly stripe_5 232,8 254,8 244,38 222,38 4
poly valance_red 38,36 246,36 244,43 38,43 4
dots valance_scallop 46,43 62,43 78,43 94,43 110,43 126,43 142,43 158,43 174,43 190,43 206,43 222,43 238,43 c15
rect shy_stand 184,62,52,4 6 e0
line shy_leg1 190,66 190,88 c6
line shy_leg2 230,66 230,88 c6
ellipse nut_cup1 194,60,4,3 6
ellipse nut_cup2 204,60,4,3 6
ellipse nut_cup3 214,60,4,3 6
ellipse nut_cup4 224,60,4,3 6
ellipse nut_1 194,56,3,4 0
ellipse nut_2 204,56,3,4 0
ellipse nut_3 214,56,3,4 0
ellipse nut_4 224,56,3,4 0
rect shy_shadow 182,88,56,8 mix:,0@0.7
poly trestle_shadow 50,118 165,118 175,130 58,130 mix:,0@0.7
poly trestle_board 54,80 162,80 160,86 54,86 6 e0
poly trestle_baize 56,76 160,76 162,82 56,82 2 e0
poly trestle_baize_top 58,74 158,74 160,76 56,76 10
line trestle_leg_l1 60,86 52,122 c6
line trestle_leg_l2 68,86 76,122 c6
line trestle_leg_r1 146,86 138,122 c6
line trestle_leg_r2 154,86 162,122 c6
line trestle_brace 56,104 158,104 c6
rect skittle_board 68,75,36,6 6 e0
rect skittle_board_rim 68,74,36,1 14
poly pin1 72,66 74,66 74,74 72,74 15 e0
poly pin2 78,65 80,65 80,73 78,73 15 e0
poly pin3 84,66 86,66 86,74 84,74 15 e0
poly pin4 90,65 92,65 92,73 90,73 15 e0
poly pin5 96,66 98,66 98,74 96,74 15 e0
rect peg_base 114,75,22,5 6
line peg1 118,68 118,75 c14
line peg2 124,67 124,75 c14
line peg3 130,68 130,75 c14
dots peg_tops 118,67 124,66 130,67 c15
poly julian_shadow 144,116 168,116 164,124 140,124 mix:,0@0.7
rect julian_trousers 148,82,12,36 8 e0
line julian_crease 154,82 154,118 c0
poly julian_waistcoat 146,62 162,62 163,83 145,83 6 e0
poly julian_shirt 148,52 160,52 162,64 146,64 15
poly julian_arm_l 143,62 147,62 144,82 140,82 15 e0
poly julian_arm_r 161,62 165,62 168,80 164,80 15 e0
ellipse julian_head 154,46,5,6 7 e0
rect julian_cap 148,40,13,4 8 e0
line julian_brim 146,44 163,44 c0
rect dice_mat 136,76,18,5 4
rect hedge_trim 210,54,110,12 mix:2,10@0.5
line wind_grass1_twin 28,114 26,108 30,108 c2
line wind_grass1 28,114 28,108 32,108 c10
line wind_grass2_twin 118,128 116,122 120,122 c2
line wind_grass2 118,128 118,122 122,122 c10
line grass_tuft_a 84,124 84,118 87,118 c10
line grass_tuft_b 14,96 14,91 17,91 c10
line path_edge 170,136 190,74 c6
line tent_stay_l 42,12 18,68 c0
line tent_stay_r 246,12 276,68 c0`,
    cycles: [
      {
        name: "the wind in the grass",
        areas: ["wind_grass1_twin", "wind_grass2_twin"],
        colors: [10, 10, 2],
        rest: 57,
        style: "rotate",
        sweep: [4, 27],
        ms: 150
      }
    ],
    overlays: [{ object: "bone_dice", at: [140, 68] }]
  },
  parish_orchard: {
    version: 1,
    shot: "eye-level view facing north towards an ancient pear tree, vanishing point at 160,70; noon; bright overhead sunlight with dappled shadows across dry bents; an old gnarled {tree} trunk at left center with heavy laden branches spreading across the upper frame, orchard grass and fallen {windfalls} on the orchard floor, orchard hedge in distance; {grass}, dropped {pears}, wooden field {gate} at north exit, distant {marquee} tent peak beyond hedge; moves: grass bents in the light breeze (grass in the wind recipe: a rotate)",
    draw: `rect sky 0,0,320,72 fade:9,11/0,0/0,72
poly dist_hedge 0,62 55,60 110,63 160,59 210,62 260,60 320,63 320,74 0,74 2
poly dist_tent 145,60 162,48 180,60 15 e0
line dist_tent_pole 162,46 162,60 c8
rect dist_hedge_base 0,72,320,6 2
rect lawn_base 0,74,320,62 fade:14,6/160,74/160,135
poly path_dirt 148,74 172,74 195,135 125,135 fade:6,14/160,74/160,135
rect gate_post_l 144,64,3,14 6 e0
rect gate_post_r 173,64,3,14 6 e0
line gate_bar1 146,67 174,67 c6
line gate_bar2 146,71 174,71 c6
line gate_brace 146,73 174,66 c6
ellipse shadow_trunk 105,124,42,10 mix:,0@0.7
ellipse shadow_canopy 180,105,55,14 mix:,0@0.7
ellipse shadow_canopy_r 245,112,40,11 mix:,0@0.7
poly trunk_back 78,130 92,75 106,62 118,72 108,132 6 e0
poly trunk_core 84,130 96,78 108,65 114,75 102,132 mix:6,0@0.5
poly bough_l 94,76 72,56 42,50 40,54 68,62 88,82 6 e0
poly bough_r 110,70 148,58 190,52 215,55 192,57 150,64 116,76 6 e0
poly bough_high 104,64 112,38 126,22 132,24 120,42 110,66 6 e0
poly canopy_far 10,12 85,2 170,8 240,4 310,14 320,38 275,46 220,35 170,42 110,34 50,44 0,32 2
poly canopy_mid 25,18 95,8 160,14 225,10 295,20 315,42 260,48 205,38 150,45 85,38 35,46 2
poly canopy_lit1 40,16 75,10 90,22 65,28 10
poly canopy_lit2 130,12 175,8 190,20 155,26 10
poly canopy_lit3 220,14 265,10 275,22 240,26 10
poly canopy_lit4 285,18 315,16 318,30 295,32 10
poly canopy_edge1 15,35 48,34 60,44 30,46 10
poly canopy_edge2 115,32 142,30 152,40 125,42 10
poly canopy_edge3 180,34 215,32 225,42 195,44 10
poly canopy_edge4 248,36 280,35 290,44 262,46 10
poly bark_ridge 88,126 98,82 104,80 94,128 0
poly bark_moss 82,118 86,104 88,114 84,124 2
ellipse pear_hang1 62,64,3,4 14 e6
ellipse pear_hang2 145,66,3,4 14 e6
ellipse pear_hang3 198,58,3,4 14 e6
ellipse pear_hang4 235,52,3,4 14 e6
ellipse windfall_1 128,118,4,3 14 e6
dots windfall_bruise1 128,118 129,118 c4
ellipse windfall_2 142,125,4,3 14 e6
dots windfall_bruise2 143,125 c6
ellipse windfall_3 115,128,3,3 14 e6
ellipse windfall_4 212,120,4,3 14 e6
dots windfall_bruise4 213,120 c4
ellipse windfall_5 228,126,3,3 14 e6
ellipse windfall_6 72,126,4,3 14 e6
ellipse windfall_7 265,122,4,3 14 e6
line bent_still_1 54,122 56,114 54,108 c10
line bent_still_2 64,130 66,120 63,115 c10
line bent_still_3 95,134 97,126 95,120 c10
line bent_still_4 158,132 160,124 163,118 c10
line bent_still_5 204,126 206,118 203,112 c10
line bent_still_6 242,128 244,120 242,114 c10
line bent_still_7 285,130 287,122 284,116 c10
line tuft_wind1 82,128 85,118 89,112 c14
line tuft_move1 82,128 87,118 92,112 c14
line tuft_wind2 178,124 181,114 186,108 c14
line tuft_move2 178,124 183,114 189,108 c14
line tuft_wind3 255,126 258,116 263,110 c14
line tuft_move3 255,126 260,116 266,110 c14`,
    cycles: [
      {
        name: "grass in the wind",
        areas: ["tuft_move1", "tuft_move2", "tuft_move3"],
        colors: [10, 10, 14],
        rest: 57,
        style: "rotate",
        sweep: [4, 27, 45],
        ms: 150
      }
    ],
    overlays: [{ object: "leather_halter", at: [108, 120] }]
  },
  lime_kiln_lane: {
    version: 1,
    shot: "eye level facing north, sunken cutting looking toward distant orchard trees; noon; harsh overhead sun casting dense shade beneath steep banks, with high midday glare over the chalk; deep chalk cutting framing rutted cart track in center, steep weed-choked embankment on left, tangled hedge bank on right; chalk rubble and cart ruts along the {lane}, ragged clumps of {nettles}, tall {dock} leaves, and yellow sprigs of wild {mustard}; moves: grass along the upper verge (the grass in the wind recipe: a rotate)",
    draw: `rect sky 0,0,320,42 fade:9,15/0,0/0,42
vp 158,58
poly far_verge 90,52 158,58 220,53 235,58 75,58 2
poly far_trees 120,52 135,46 150,44 165,47 180,53 158,58 10
poly orchard_boughs 130,48 142,42 155,41 168,45 158,58 2
poly bank_left_chalk 0,28 88,48 132,58 108,82 0,92 14
poly bank_left_shade 0,55 92,54 125,60 98,82 0,96 mix:14,6@0.5
poly bank_right_chalk 320,24 235,48 184,58 202,80 320,86 14
poly bank_right_shade 320,52 232,54 192,60 214,80 320,92 mix:14,6@0.5
poly track_bed 0,92 108,82 132,58 158,58 184,58 202,80 320,86 320,135 0,135 fade:14,6/158,58/158,135
poly rut_left_deep 146,59 143,68 116,92 78,135 70,135 110,91 140,68 144,59 6
poly rut_left_lip 147,59 144,68 118,92 82,135 80,135 116,92 143,68 146,59 15
poly rut_right_deep 170,59 174,68 198,92 238,135 246,135 204,91 177,68 172,59 6
poly rut_right_lip 169,59 172,68 195,92 234,135 236,135 197,92 173,68 170,59 15
poly chalk_shelf_l 0,38 48,46 36,62 0,66 15
poly chalk_shelf_r 270,44 320,36 320,68 282,64 15
poly chalk_scree_l 18,72 64,68 76,82 32,88 mix:14,15@0.4
poly chalk_scree_r 240,70 295,64 308,80 252,86 mix:14,15@0.4
poly hedge_crest_l 0,12 42,16 78,28 108,44 94,52 52,38 0,32 2
poly hedge_crest_r 216,42 262,28 320,10 320,28 268,42 226,50 2
poly nettles_bank_l 0,36 46,38 82,48 102,62 80,72 38,62 0,60 10
poly nettles_shade_l 0,48 42,48 78,56 95,66 75,76 32,68 0,68 2
poly nettles_bank_r 220,58 248,46 320,32 320,54 262,62 216,68 10
poly nettles_shade_r 222,64 252,52 320,44 320,62 258,70 214,72 2
poly dock_mass_l1 22,78 48,72 58,88 34,98 12,92 2
poly dock_leaf_l1 26,76 44,72 38,88 20,86 10
poly dock_leaf_l2 36,80 56,76 52,94 34,92 10
poly dock_mass_r1 254,82 284,74 304,88 278,102 248,94 2
poly dock_leaf_r1 258,82 280,76 274,96 252,90 10
poly dock_leaf_r2 274,78 300,76 292,96 270,94 10
poly dock_fore_l 8,98 38,94 48,114 18,126 0,118 2
poly dock_leaf_fl1 12,96 34,92 28,112 6,108 10
poly dock_leaf_fl2 24,102 44,98 38,120 18,118 10
poly dock_leaf_fl3 4,110 26,110 20,126 2,122 10
poly nettle_clump_l 74,72 98,68 114,84 94,94 72,86 10
poly nettle_dark_l 78,76 96,72 108,86 92,94 76,88 2
poly nettle_clump_r 202,72 228,68 242,84 224,92 198,84 10
poly nettle_dark_r 206,76 226,72 236,86 222,92 202,86 2
line mustard_stem_l1 62,64 58,48 c2
line mustard_stem_l2 68,66 68,44 c2
line mustard_stem_l3 74,68 78,50 c2
dots mustard_heads_l 57,47 59,46 67,43 69,42 77,49 79,48 c14
line mustard_stem_r1 238,62 242,46 c2
line mustard_stem_r2 246,65 248,42 c2
line mustard_stem_r3 252,68 258,48 c2
dots mustard_heads_r 241,45 243,44 247,41 249,40 257,47 259,46 c14
rect track_stone_1 142,88,6,3 15
rect track_stone_2 178,94,5,2 15
rect track_stone_3 124,106,8,4 15
rect track_stone_4 188,112,7,3 15
rect track_stone_5 152,122,10,4 15
rect track_stone_6 138,74,4,2 15
rect track_stone_7 168,76,4,2 15
rect track_shadow_1 142,91,6,2 6
rect track_shadow_2 178,96,5,1 6
rect track_shadow_3 124,110,8,2 6
rect track_shadow_4 188,115,7,2 6
rect track_shadow_5 152,126,10,2 6
line verge_blade_base1 106,44 103,34 c2
line verge_blade_base2 162,56 160,48 c2
line verge_blade_base3 218,42 221,32 c2
line verge_tw1 106,44 109,35 c2
line verge_tw2 162,56 165,49 c2
line verge_tw3 218,42 226,34 c2
line verge_blade1 106,44 103,34 c10
line verge_blade2 162,56 160,48 c10
line verge_blade3 218,42 221,32 c10
poly lane_flint_l 96,118 108,114 114,122 102,128 8
poly lane_flint_r 212,118 226,114 230,124 218,126 8
line lane_flint_edge_l 96,118 108,114 114,122 c7
line lane_flint_edge_r 212,118 226,114 c7`,
    cycles: [
      {
        name: "the grass",
        areas: ["verge_tw1", "verge_tw2", "verge_tw3"],
        colors: [10, 10, 2],
        rest: 57,
        style: "rotate",
        sweep: [4, 27, 45],
        ms: 150
      }
    ],
    overlays: []
  },
  old_lime_kiln: {
    version: 1,
    shot: "looking slightly down into the circular pit facing north, VP 160,54; noon; harsh overhead midday sun beating against the rim while cool shade pools below, gradient of sky above fading to rim and pit floor fading to cool shadows; {barnaby_goat} standing on lime rubble right of centre (x 185-235), overgrown crumbling masonry wings with briars and wild {roses}; dressing: limestone ashlar blocks, tangled {briars}, chalky rubble floor, discarded iron bucket {bucket}; moves: dust motes hanging in the hot shaft of light (dust in a sunbeam: pingpong scatter)",
    draw: `vp 160,54
rect sky 0,0,320,38 fade:9,11/0,0/0,38
rect pit_bg 0,38,320,98 6
poly pit_wall_far 28,34 292,34 310,85 10,85 6
rect sunbeam 120,32,80,104 mix:,14@0.2
poly pit_floor 0,80 320,80 320,136 0,136 fade:14,6/160,80/160,136
poly pit_shade 0,82 120,82 110,136 0,136 mix:6,0@0.5
poly pit_shade_r 220,82 320,82 320,136 240,136 mix:6,0@0.4
poly track_north 142,34 178,34 195,82 125,82 14
line track_ruts_l 148,34 135,82 c6
line track_ruts_r 172,34 185,82 c6
rect ashlar_1 35,42,42,12 7 e8
rect ashlar_2 82,40,46,14 7 e8
rect ashlar_3 192,40,48,13 7 e8
rect ashlar_4 244,43,44,12 7 e8
rect ashlar_5 16,56,52,14 6 e8
rect ashlar_6 72,55,50,15 7 e8
rect ashlar_7 200,54,48,15 6 e8
rect ashlar_8 252,57,54,14 7 e8
rect ashlar_9 42,70,58,14 6 e0
rect ashlar_10 216,70,54,14 6 e0
poly arch_west 0,60 26,68 22,110 0,118 0
poly arch_west_frame 26,64 32,67 28,110 22,110 6 e8
poly rim_overhang 0,28 320,28 320,38 0,38 10
poly rim_grass_1 10,24 60,24 55,34 8,34 2
poly rim_grass_2 110,25 210,25 205,33 115,33 2
poly rim_grass_3 260,24 320,24 320,34 255,34 2
line dogrose_stem1 18,22 35,48 42,62 c2
line dogrose_stem2 275,22 282,50 268,72 c2
line dogrose_stem3 240,24 246,45 c2
poly briars_w 0,40 18,48 12,85 0,80 2
poly briars_e 300,42 320,38 320,90 295,82 2
dots roses 32,44 40,58 280,46 270,68 244,42 c12
dots roses_c 33,45 281,47 c14
poly chalk_mound 120,96 170,88 200,98 145,104 15
poly chalk_shd 120,96 145,104 200,98 180,103 7
rect rub_1 90,112,8,4 15 e7
rect rub_2 108,124,10,5 7 e8
rect rub_3 162,118,12,6 15 e7
rect rub_4 245,114,9,5 6 e0
rect rub_5 132,106,6,3 15
rect rub_6 218,122,11,4 7 e8
poly bucket 78,110 88,110 86,122 76,122 8 e0
ellipse bucket_lip 83,110,5,2 7
line bucket_handle 77,110 83,103 89,110 c0
poly barnaby_goat_legs_back 196,102 201,102 201,118 196,118 7 e0
poly barnaby_goat_legs_fore 224,102 229,102 229,118 224,118 7 e0
poly barnaby_goat_leg_bl 190,102 195,102 194,120 189,120 15 e0
poly barnaby_goat_leg_fl 218,102 223,102 221,120 216,120 15 e0
poly barnaby_goat_body 186,84 228,84 228,104 186,104 15 e0
poly barnaby_goat_rump 182,88 188,84 188,102 182,98 15 e0
poly barnaby_goat_tail 180,88 184,86 182,92 15
poly barnaby_goat_neck 222,88 232,74 238,76 228,94 15 e0
poly barnaby_goat_head 230,72 242,72 246,80 234,82 15 e0
poly barnaby_goat_ear 229,74 224,78 228,80 15 e0
poly barnaby_goat_horn 232,72 228,63 231,62 235,71 6 e0
poly barnaby_goat_beard 242,80 245,86 242,86 15
dots barnaby_goat_eye 238,75 c0
poly barnaby_goat_ribbon 228,88 232,86 230,94 226,92 4
poly barnaby_goat_ribbon_tail 228,92 231,98 226,96 4
poly goat_shadow 182,120 234,120 226,124 176,124 mix:6,0@0.7
dots dust 132,48 145,55 160,42 178,50 138,68 155,72 168,64 148,82 182,78 135,92 162,96 174,102 150,112 185,116 140,122 165,128 c6`,
    cycles: [
      {
        name: "the dust motes",
        areas: ["dust"],
        colors: [6, 6, 6, 14, 15],
        style: "pingpong",
        scatter: true,
        ms: 380
      }
    ],
    overlays: [{ object: "clover_bunch", at: [152, 112] }],
    loops: []
  },
  briar_coppice: {
    version: 1,
    shot: "eye-level facing north, vanishing point 160,70; forest; midday summer light filtered through dense canopy; the boundary ditch with muddy hollow and {brambles} in center columns, an arched elder thicket filling the wings; limestone gravel {gravel}, thorn branches {thorns}, ditch water {water}; moves: ditch puddle shimmer (the shimmer recipe: a pingpong)",
    draw: `rect sky 0,0,320,55 fade:2,10/160,0/160,55
poly far_foliage 0,30 45,18 90,28 140,15 190,26 240,16 285,25 320,18 320,65 0,65 2
poly canopy_top 0,0 320,0 320,42 270,35 210,44 160,32 110,45 60,34 0,44 0
poly bank_left 0,55 120,55 90,136 0,136 fade:2,0/0,55/0,136
poly bank_right 320,55 200,55 230,136 320,136 fade:2,0/320,55/320,136
poly ditch_floor 90,136 120,55 200,55 230,136 142,136 fade:2,0/160,55/160,136
poly mud_hollow 105,80 215,80 225,128 95,128 mix:6,0@0.5
poly puddle 120,95 200,95 190,118 130,118 1
poly hawthorn_trunk_l 25,136 35,136 50,45 42,45 0
poly hawthorn_trunk_r 290,136 280,136 265,48 273,48 0
poly elder_stem_1 75,136 82,136 105,62 100,62 0
poly elder_stem_2 245,136 238,136 215,60 220,60 0
poly foliage_mass_l 0,38 75,32 95,65 60,92 0,85 2
poly foliage_mass_r 320,36 245,30 225,62 260,94 320,84 2
poly foliage_notch_l 15,40 55,36 40,55 10,50 10
poly foliage_notch_r 305,38 265,34 280,52 310,48 10
poly bramble_base 70,85 250,85 260,122 60,122 0
poly brambles_mass1 85,78 145,68 160,105 100,115 2
poly brambles_mass2 155,72 235,66 240,112 170,116 2
poly brambles_lit1 95,74 135,70 125,88 100,86 10
poly brambles_lit2 175,68 215,66 205,84 180,82 10
poly brambles_top 120,62 200,62 210,80 110,80 2
poly brambles_top_lit 135,64 185,63 175,74 145,74 10
poly gravel_patch1 100,122 135,120 140,130 105,132 7
poly gravel_patch2 175,121 215,119 220,131 180,133 7
poly gravel_patch3 140,128 175,127 170,135 135,135 15
poly gravel_rim 110,120 205,120 200,124 115,124 8
dots gravel_stones 102,123 118,121 126,125 134,122 142,129 152,130 162,128 178,122 188,124 198,121 208,125 214,128 146,134 168,133 c15
dots gravel_dark 108,124 122,123 130,127 138,124 158,131 174,125 184,126 194,123 204,127 c8
line thorn_arch1 60,105 85,75 115,65 140,72 155,90 c0
line thorn_arch2 165,92 180,70 210,64 240,76 265,108 c0
line thorn_cane1 90,112 110,82 145,78 170,95 c0
line thorn_cane2 150,96 175,80 215,82 235,110 c0
line thorn_cane3 105,95 130,72 160,70 185,86 210,115 c0
line thorn_spik1 88,78 85,74 c0
line thorn_spik2 112,67 114,62 c0
line thorn_spik3 138,73 142,69 c0
line thorn_spik4 182,72 180,68 c0
line thorn_spik5 208,66 211,61 c0
line thorn_spik6 238,78 242,74 c0
line thorn_spik7 112,84 109,80 c0
line thorn_spik8 142,80 144,75 c0
line thorn_spik9 172,82 170,77 c0
line thorn_spikA 212,84 215,80 c0
dots berries 108,90 124,84 136,92 148,88 172,86 184,94 196,88 220,92 c12
dots berries_dark 109,91 125,85 137,93 149,89 173,87 185,95 197,89 221,93 c4
line glint1 135,102 139,102 c15
line glint2 144,106 148,106 c11
line glint3 158,103 162,103 c15
line glint4 168,107 172,107 c11
line glint5 178,104 182,104 c15
line glint6 140,112 143,112 c11
line glint7 152,114 156,114 c15
line glint8 165,112 169,112 c11
line glint9 175,113 178,113 c15
line glintA 148,108 153,108 c15
line glintB 160,110 164,110 c11
line east_path 225,132 320,118 c6
line west_path 95,132 0,118 c6
rect east_exit_dark 310,105,10,25 0
rect west_exit_dark 0,105,10,25 0
line elder_twig1 48,58 70,52 c0
line elder_twig2 268,60 248,54 c0
line elder_twig3 222,68 205,62 c0`,
    cycles: [
      {
        name: "ditch puddle shimmer",
        areas: [
          "glint1",
          "glint2",
          "glint3",
          "glint4",
          "glint5",
          "glint6",
          "glint7",
          "glint8",
          "glint9",
          "glintA",
          "glintB"
        ],
        colors: [15, 11, 9],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    overlays: []
  },
  creek_footbridge: {
    version: 1,
    shot: "eye-level view facing south towards the parish boundary, vanishing point slightly right of centre; noon; harsh high summer sun overhead casting short hard shadows under the footbridge; two rough oak {planks} span the brown marshy {brook} in columns 90-210, with banks of flowering {rush} and prickly {briars} in the wings; the white chalk {road} climbing into the low chalk hills beyond; moves: sunlight glints on the marshy brook (the shimmer recipe: a pingpong)",
    facing: "s",
    draw: `vp 180,68
rect sky 0,0,320,52 fade:9,11/0,0/0,52
rect horizon_haze 0,48,320,10 fade:11,15/0,48/0,58
poly far_hill 0,54 60,46 140,48 220,44 280,48 320,44 320,62 0,62 fade:10,2/0,44/0,62
poly chalk_crest 40,52 90,48 180,50 260,46 320,50 320,64 40,64 fade:14,6/0,46/0,64
poly chalk_down 0,58 120,56 220,54 320,56 320,74 0,74 fade:14,6/0,54/0,74
poly road 168,54 186,54 212,84 154,84 fade:15,14/170,54/180,84
poly field_east 212,54 320,54 320,86 198,86 fade:2,10/200,54/320,86
poly field_west 0,54 168,54 148,86 0,86 fade:2,10/0,54/168,86
poly hedge_east 240,50 320,48 320,64 210,64 2 fade:2,0/240,48/320,64
poly hedge_west 0,52 80,50 110,64 0,64 2 fade:2,0/0,50/110,64
poly near_bank_south 0,72 320,72 320,92 0,92 fade:10,2/0,72/0,92
poly creek_bed 0,86 320,86 320,136 0,136 fade:6,0/0,86/0,136
poly water_surface 0,90 320,88 320,126 0,128 fade:6,2/0,88/0,128
poly near_bank_north 0,122 320,120 320,136 0,136 fade:2,6/0,120/0,136
poly brook_shadow 92,108 222,106 226,118 94,120 mix:,0@0.7
poly bridge_shadow 98,110 216,108 214,122 96,124 mix:,0@0.7
poly plank1 90,96 218,94 220,105 88,107 6 e0
poly plank1_top 90,96 218,94 219,101 89,103 14
poly plank2 92,104 220,102 222,113 90,115 6 e0
poly plank2_top 92,104 220,102 221,109 91,111 14
line grain1 104,98 140,97 c6
line grain2 160,96 200,95 c6
line grain3 110,106 150,105 c6
line grain4 170,104 210,103 c6
poly bank_left_mound 0,78 74,78 84,118 0,128 fade:10,2/0,78/84,128
poly bank_right_mound 236,76 320,76 320,126 226,116 fade:10,2/236,76/320,126
poly rush_clump_l1 12,68 38,62 52,98 18,104 2 e0
poly rush_clump_l2 44,70 72,66 82,106 48,112 10 e0
poly rush_clump_r1 230,68 262,64 274,104 240,110 2 e0
poly rush_clump_r2 268,66 304,62 318,102 280,108 10 e0
line stem_l1 28,64 34,96 c10
line stem_l2 40,60 44,98 c10
line stem_l3 60,62 58,104 c2
line stem_l4 70,64 66,108 c2
line stem_r1 242,62 248,102 c10
line stem_r2 256,60 254,104 c10
line stem_r3 282,58 276,106 c2
line stem_r4 298,62 292,102 c2
dots rush_heads_l 28,63 40,59 60,61 70,63 c12
dots rush_heads_r 242,61 256,59 282,57 298,61 c12
poly briar_patch_e 250,78 320,74 320,114 270,118 fade:2,0/250,74/320,118
line thorn1 262,82 278,92 c6
line thorn2 284,86 298,98 c6
line thorn3 270,96 288,108 c6
line thorn4 292,78 312,88 c6
poly path_east 218,92 250,86 280,88 232,98 14
poly water_reeds_far 130,86 142,84 146,92 128,92 2
poly water_reeds_mid 162,86 174,84 176,92 160,92 10
line water_edge_s 0,89 320,87 c6
line water_edge_n 0,124 320,122 c2
line shm1 114,91 118,91 c15
line shm2 124,93 127,93 c11
line shm3 148,90 152,90 c15
line shm4 158,92 161,92 c14
line shm5 180,89 184,89 c15
line shm6 192,91 195,91 c11
line shm7 110,118 114,118 c15
line shm8 126,119 130,119 c14
line shm9 142,117 146,117 c15
line shm10 168,118 172,118 c11
line shm11 184,119 187,119 c15
line shm12 202,117 206,117 c14
poly near_verge_l 0,126 82,122 74,136 0,136 fade:10,2/0,122/82,136
poly near_verge_r 234,122 320,120 320,136 242,136 fade:10,2/234,120/320,136
line mud_crack1 36,130 52,134 c6
line mud_crack2 268,128 284,132 c6`,
    cycles: [
      {
        name: "brook shimmer",
        areas: ["shm1", "shm2", "shm3", "shm4", "shm5", "shm6", "shm7", "shm8", "shm9", "shm10", "shm11", "shm12"],
        colors: [15, 11, 9],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    overlays: []
  }
};

export const endings = {
  win_prize_ring: {
    version: 1,
    shot: "Eye level, north; noon; direct overhead summer sun, warm bright ground; the prize goat {Barnaby} standing proud in columns 110-180 with a bright red prize {rosette} on his halter, Arthur resting by the hurdle behind him, {hurdles} in the wings, sawdust ring floor; dressing: {rosette}, {halter}, {hurdles}, {sawdust}; moves: the ribbon tail flutter (a candle tip cycle style flicker).",
    draw: `rect sky 0,0,320,44 fade:9,11/0,0/0,44
rect ring_grass 0,44,320,18 fade:2,10/0,44/0,62
rect ground 0,62,320,74 fade:14,6/0,62/0,136
poly sawdust_floor 0,68 320,68 320,136 0,136 fade:14,6/0,68/0,136
rect back_hedge 0,40,320,10 2
poly marquee_roof 220,18 320,28 320,44 220,44 15
poly marquee_shade 220,32 320,38 320,44 220,44 mix:15,7@0.4
line marquee_seam1 250,21 250,44 c7
line marquee_seam2 285,24 285,44 c7
rect fence_post_1 35,46,6,30 6
rect fence_post_2 85,46,6,30 6
rect fence_post_3 140,46,6,30 6
rect fence_post_4 200,46,6,30 6
rect fence_post_5 260,46,6,30 6
rect fence_rail_1 0,52,320,4 6
rect fence_rail_2 0,64,320,4 6
line hurdle_wattle_1 38,56 88,64 c6
line hurdle_wattle_2 88,56 142,64 c6
line hurdle_wattle_3 142,56 202,64 c6
line hurdle_wattle_4 202,56 262,64 c6
poly arthur_legs 210,75 224,75 228,95 212,95 8
poly arthur_coat 206,58 228,58 230,78 204,78 6
poly arthur_waistcoat 212,60 222,60 220,74 214,74 14
poly arthur_deed 215,63 219,63 218,67 215,67 15
ellipse arthur_head 217,52,5,6 7
rect arthur_hat_brim 210,48,15,2 6
poly arthur_hat_crown 213,42 221,42 222,48 212,48 6
ellipse goat_shadow 145,116,36,8 mix:,0@0.7
poly goat_leg_bl 120,95 125,95 124,115 119,115 7
rect hoof_bl 119,113,5,3 8
poly goat_leg_fl 162,94 167,94 168,116 163,116 7
rect hoof_fl 163,114,5,3 8
poly goat_leg_br 128,95 133,95 131,114 127,114 15
rect hoof_br 127,112,4,3 8
poly goat_leg_fr 170,94 175,94 174,115 170,115 15
rect hoof_fr 170,113,4,3 8
poly goat_body 118,74 168,72 178,82 172,98 122,98 114,88 15
poly goat_chest 165,74 182,78 184,88 172,97 15
poly goat_rump_shade 114,86 126,86 125,98 116,96 mix:15,7@0.4
poly goat_belly_shade 125,93 172,93 169,98 123,98 mix:15,7@0.5
poly goat_tail 110,80 116,77 115,83 15
poly goat_neck 164,74 176,60 186,63 177,82 15
poly goat_head 174,62 198,62 201,68 188,74 175,70 15
poly goat_jaw_shade 180,69 194,69 190,74 177,72 mix:15,7@0.4
poly goat_ear_left 171,58 177,58 174,65 7
poly goat_ear_right 179,59 187,58 181,66 15
poly goat_horn_left 176,60 170,44 174,44 179,58 6
poly goat_horn_right 180,59 176,43 180,43 183,57 14
ellipse goat_eye 188,64,1,1 0
poly goat_beard 192,72 198,72 194,80 15
line goat_halter_cheek 184,62 194,70 c6
line goat_halter_nose 191,65 194,71 c6
line goat_brow_band 179,62 188,62 c14
ellipse rosette_disc 185,63,5,5 4
ellipse rosette_mid 185,63,3,3 12
dots rosette_center 185,63 c14
poly rosette_tail_1 184,67 186,67 188,78 186,78 4
poly rosette_tail_2 186,67 188,67 189,76 187,76 12
poly rosette_flutter 187,73 189,73 191,78 189,78 12
rect wattle_left_post 14,48,6,38 6
rect wattle_left_rail 0,60,40,4 6
rect wattle_right_post 295,48,6,38 6
rect wattle_right_rail 280,60,40,4 6
dots sawdust_bits 105,108 140,122 178,118 205,110 230,125 150,130 90,126 125,128 c14
dots sawdust_dark 112,112 145,125 170,120 195,115 220,128 135,132 80,128 c6`,
    cycles: [
      {
        name: "the ribbon flutter",
        areas: ["rosette_flutter"],
        colors: [12, 15],
        style: "flicker",
        ms: [500, 1600]
      }
    ],
    loops: []
  },
  surrender_to_bailiff: {
    version: 1,
    shot: "Eye level, facing north; noon; hard overhead fairground light filtering under canvas awning with strong shadows; bailiff desk across columns 80-240 with {Bailiff Craddock} seated behind ledger and {Barnaby} horned profile in foreground right, canvas wall in wings; desk dressed with {ledger}, stone {inkpot}, brass {key}, tin {canteen}, coiled {rope}; moves: dust motes caught in midday tent gap (dust in a sunbeam: a pingpong).",
    draw: `rect sky_bg 0,0,320,136 6
rect awning_top 0,0,320,44 fade:14,6/160,0/160,44
rect canvas_wall 0,44,320,54 fade:6,14/160,44/160,98
poly valance_scallop 0,40 320,40 320,48 0,48 2
line valance_edge 0,48 320,48 c10
rect ground_turf 0,98,320,38 fade:2,6/160,98/160,136
rect timber_pole_l 28,16,8,82 6
rect timber_pole_r 284,16,8,82 6
line timber_line_l 36,16 36,98 c0
line timber_line_r 284,16 284,98 c14
poly sun_gap 48,0 72,0 96,98 56,98 mix:,14@0.2
rect table_top 54,80,212,14 6
poly table_bevel 54,94 266,94 262,98 58,98 0
rect table_front 58,98,204,36 mix:6,0@0.5
line table_edge 54,80 266,80 c14
line table_bottom 58,134 262,134 c0
rect desk_shadow 50,126,220,10 mix:,0@0.7
rect leg_fl 62,98,8,38 0
rect leg_fr 250,98,8,38 0
rect blotter 112,83,72,9 2
rect blotter_mat 114,84,68,7 10
rect ledger_l 124,82,24,9 15
rect ledger_r 148,82,24,9 7
line ledger_spine 148,82 148,91 c0
line ledger_rule_1 126,85 146,85 c8
line ledger_rule_2 126,88 146,88 c8
line ledger_rule_3 150,85 170,85 c8
line ledger_rule_4 150,88 170,88 c8
rect inkpot 102,83,8,9 8
rect inkpot_neck 104,81,4,2 0
rect canteen 84,81,10,12 7
rect canteen_cap 87,79,4,2 8
poly canteen_strap 83,83 82,93 95,93 94,83 none c0
rect brass_key 192,86,10,4 14
rect key_bit 198,88,3,4 14
rect rope_coil 182,85,24,8 6
line rope_strands 184,87 204,87 c14
line rope_strands_b 183,89 205,89 c0
line lead_drop 204,90 236,112 c14
poly craddock_torso 126,48 172,48 178,82 120,82 0
poly waistcoat 134,52 164,52 166,82 132,82 8
poly shirt_v 144,52 154,52 150,66 148,66 15
line tie 149,58 149,74 c4
rect collar_l 142,52,5,3 15
rect collar_r 151,52,5,3 15
ellipse craddock_head 149,38,10,13 6
poly bowler_crown 140,24 158,24 160,33 138,33 0
rect bowler_brim 134,32,30,3 0
line bowler_ribbon 139,31 159,31 c8
rect craddock_brow 142,39,14,3 8
rect craddock_nose 147,41,4,4 7
rect craddock_mustache 143,45,12,3 0
rect craddock_ear 138,37,3,5 6
poly craddock_arm_r 166,54 186,72 176,77 160,58 0
rect hand_pen 176,74,7,5 7
line pen_quill 177,75 168,70 c15
poly craddock_arm_l 130,54 122,76 130,80 136,60 0
rect hand_l 122,76,8,5 7
outline craddock_torso e0
poly goat_body 240,82 320,82 320,136 230,136 15
poly goat_chest 222,94 246,84 250,116 218,114 7
poly goat_neck 224,80 248,74 252,98 222,98 15
ellipse goat_head 218,72,16,11 15
poly goat_snout 198,73 214,67 216,79 198,77 7
rect goat_nose 196,73,3,4 0
rect goat_eye 212,69,3,2 0
rect goat_pupil 213,70,1,1 14
poly goat_beard 200,78 206,78 202,90 198,88 15
poly goat_ear 230,68 244,72 238,76 228,72 7
poly goat_horn_l 226,64 238,44 248,40 242,46 6
line horn_ridge_l 230,60 242,43 c14
poly goat_horn_r 234,65 248,46 256,44 252,50 0
line goat_jaw 202,77 218,79 c8
rect halter_strap 208,68,3,10 4
line halter_cheeks 200,75 214,70 c4
line halter_noseband 206,72 206,78 c12
rect tether_ring 207,78,3,3 14
outline goat_body e0
poly goat_shadow 210,128 320,128 320,136 216,136 mix:,0@0.7
rect estate_crest 12,54,16,22 2
line crest_border 12,54 28,54 c10
line crest_l 12,54 12,76 c10
line crest_r 28,54 28,76 c10
line crest_b 12,76 28,76 c10
rect crest_charge 17,60,6,8 14
dots motes 58,16 66,32 74,48 62,64 80,78 68,88 84,28 72,58 c6`,
    cycles: [
      {
        name: "the dust motes",
        areas: ["motes"],
        colors: [6, 6, 6, 14, 15],
        style: "pingpong",
        scatter: true,
        ms: 380
      }
    ],
    loops: []
  },
  abandon_fair: {
    version: 1,
    shot: "Eye level, facing south towards the chalk hills, vp 160,62; noon; bright sun above casting sharp short shadows; the empty white {road} winding away up the chalk slope on the middle columns, framed by meadow banks, the boundary {creek} in the foreground with rough {planks} crossing it; marsh {sedge} in the left wing, chalk downland {hills} in the right wing; moves: the creek surface (the shimmer recipe: a pingpong).",
    draw: `rect sky 0,0,320,62 fade:9,15/160,0/160,62
poly far_hill_l 0,55 70,44 140,51 210,42 320,53 320,62 0,62 10
poly far_hill_shade 0,58 60,49 130,55 190,47 320,58 320,62 0,62 mix:10,2@0.4
poly chalk_down_r 160,48 230,36 320,44 320,78 170,72 14
poly chalk_down_shade 180,52 240,40 320,49 320,78 200,74 mix:14,6@0.4
poly chalk_scarp 210,42 245,38 270,43 250,47 215,46 15
poly chalk_scarp_b 205,44 235,41 245,46 208,47 mix:15,7@0.3
poly down_grass_l 0,48 95,38 180,49 160,70 0,68 2
poly down_grass_l_mid 15,50 90,41 155,51 140,68 0,65 mix:2,10@0.5
poly mid_meadow 0,62 320,62 320,96 0,96 fade:2,10/160,96/160,62
poly road_p1 154,50 162,50 174,68 158,68 15
poly road_p2 158,68 174,68 195,84 172,84 15
poly road_p3 172,84 195,84 165,104 125,104 15
poly road_dust_shade 154,50 158,50 160,68 158,68 mix:15,6@0.3
poly road_dust_shade2 158,68 165,68 176,84 172,84 mix:15,6@0.3
poly road_dust_shade3 172,84 180,84 140,104 125,104 mix:15,6@0.25
poly bank_l 0,82 135,82 120,106 0,110 2
poly bank_l_top 0,82 135,82 128,88 0,88 10
poly bank_r 185,82 320,82 320,110 162,106 2
poly bank_r_top 185,82 320,82 320,88 180,88 10
rect creek_bed 0,102,320,34 6
rect creek_water 0,104,320,32 mix:6,2@0.4
poly water_deep 0,118 320,118 320,136 0,136 mix:6,0@0.5
rect plank1 122,101,18,34 6
rect plank1_top 122,101,16,34 mix:14,6@0.5
line plank1_edge 138,101 138,135 c0
rect plank2 144,102,18,33 6
rect plank2_top 144,102,16,33 mix:14,6@0.5
line plank2_edge 160,102 160,135 c0
poly plank1_shadow 138,103 144,103 144,136 138,136 mix:,0@0.7
poly plank2_shadow 160,104 167,104 167,136 160,136 mix:,0@0.7
poly near_turf_l 0,126 112,126 100,136 0,136 2
poly near_turf_r 174,126 320,126 320,136 186,136 2
line near_rim_l 0,126 112,126 c10
line near_rim_r 174,126 320,126 c10
poly sedge_l1 18,88 28,68 24,96 2
poly sedge_l2 26,88 38,62 33,98 10
poly sedge_l3 42,90 50,66 46,100 2
poly sedge_l4 56,92 62,70 59,102 10
poly sedge_l5 8,96 14,74 12,108 2
poly sedge_l6 72,94 82,72 78,105 10
poly sedge_l7 88,96 94,76 91,108 2
poly sedge_front1 82,108 88,90 85,124 10
poly sedge_front2 94,110 102,86 98,126 2
poly sedge_front3 104,112 110,94 107,126 10
poly rush_head1 37,60 39,60 39,64 37,64 6
poly rush_head2 49,64 51,64 51,68 49,68 6
poly rush_head3 101,84 103,84 103,88 101,88 6
poly sedge_r1 230,90 236,70 233,102 2
poly sedge_r2 242,88 250,64 246,100 10
poly sedge_r3 258,92 264,68 261,104 2
poly sedge_r4 274,90 282,66 278,102 10
poly sedge_r5 290,94 298,72 294,106 2
poly sedge_r6 304,92 312,70 308,104 10
poly sedge_front_r1 210,110 216,92 213,124 10
poly sedge_front_r2 222,108 230,88 226,126 2
line post_l 118,94 118,108 c6
line post_r 164,96 164,110 c6
line ribbon 118,98 122,101 c12
line shm1 40,112 43,112 c15
line shm2 48,114 51,114 c11
line shm3 72,111 75,111 c15
line shm4 85,115 88,115 c11
line shm5 178,112 181,112 c15
line shm6 195,114 198,114 c11
line shm7 210,111 213,111 c15
line shm8 225,115 228,115 c11
line shm9 134,122 137,122 c15
line shm10 152,124 155,124 c11
line shm11 170,121 173,121 c15
line shm12 186,125 189,125 c11`,
    cycles: [
      {
        name: "creek shimmer",
        areas: ["shm1", "shm2", "shm3", "shm4", "shm5", "shm6", "shm7", "shm8", "shm9", "shm10", "shm11", "shm12"],
        colors: [15, 11, 9],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    loops: []
  }
};

export const cover = {
  shot: "archetype: the split (beating the dwarf: the dividing line of the fair marquee canvas and fence splits the high festive sunlit fair above from the tense, shadowed tethering pen below); Arthur Pendrick's silhouette stands bent at left clutching a severed leather halter, staring at the empty iron ring, while above him the bustling parish marquees and judging bunting flutter in harsh noon glare; the empty tethering ring and shredded yellow ribbon pose the question; bg is 6 (brown); moves: judging bunting flutter (sweep rotate), distant flag (loop).",
  titleAt: "top",
  draw: `poly sky_noon 0,120 480,120 480,240 0,240 fade:11,14/240,120/240,240
rect sun_noon 210,126,60,30 15
poly marquee_bg_l 0,160 110,135 180,185 0,195 fade:14,6/90,135/90,195
poly marquee_bg_r 300,180 390,130 480,155 480,210 300,210 fade:14,6/390,130/390,210
poly marquee_main 110,135 240,120 370,140 380,240 100,240 fade:15,14/240,120/240,240
line ridge_line 110,135 240,120 c6
line ridge_line_r 240,120 370,140 c6
line seam_1 160,128 150,240 c6
line seam_2 210,123 205,240 c6
line seam_3 270,124 275,240 c6
line seam_4 325,131 335,240 c6
line flag_pole 240,120 240,128 c0
poly crowd_silhouette 0,215 480,215 480,252 0,252 0
poly hurdle_split 0,240 480,240 480,270 0,270 fade:6,0/240,240/240,270
line hurdle_rail_1 0,245 480,245 c8
line hurdle_rail_2 0,255 480,255 c8
line hurdle_rail_3 0,265 480,265 c0
line h_stake_1 40,238 40,272 c0
line h_stake_2 85,238 85,272 c0
line h_stake_3 130,238 130,272 c0
line h_stake_4 180,238 180,272 c0
line h_stake_5 230,238 230,272 c0
line h_stake_6 280,238 280,272 c0
line h_stake_7 330,238 330,272 c0
line h_stake_8 380,238 380,272 c0
line h_stake_9 430,238 430,272 c0
rect shed_floor 0,270,480,199 fade:0,6/240,270/240,469
poly hay_mound_r 320,469 480,469 480,380 370,410 fade:14,6/420,380/420,469
poly hay_strands_r 340,430 460,400 480,460 350,469 mix:14,6@0.5
poly hay_mound_l 0,469 130,469 120,420 0,390 fade:14,6/60,390/60,469
ellipse ring_shadow 260,420,48,16 0
rect stake_timber 252,330,16,90 0
poly stake_notch 252,330 268,330 260,320 0
line stake_grain 256,335 256,415 c8
line stake_grain2 264,340 264,410 c8
ellipse iron_staple 260,382,7,8 8
ellipse iron_staple_in 260,382,4,5 0
ellipse tether_ring 260,392,14,14 7
ellipse tether_ring_inner 260,392,9,9 0
line ring_shine 256,386 264,386 c15
poly broken_rope 260,392 268,412 262,416 256,396 6
line rope_fray1 268,412 272,418 c14
line rope_fray2 265,415 266,423 c14
line rope_fray3 262,416 260,422 c6
poly ribbon_piece_1 266,398 285,410 282,414 264,402 14
poly ribbon_piece_2 284,412 305,422 312,419 288,410 14
poly ribbon_drop 308,421 316,436 322,434 314,419 14
line ribbon_edge 266,398 316,436 c15
poly ribbon_torn 316,436 324,440 320,442 14
poly arthur_shadow 80,455 210,465 190,469 70,469 mix:,0@0.7
poly arthur_boots 115,445 130,445 136,462 110,462 0
poly arthur_legs 110,380 140,380 144,450 106,450 0
poly arthur_coat 95,305 145,290 152,390 90,385 0
poly arthur_arm_r 120,305 155,340 148,355 115,320 0
poly arthur_hand_r 152,345 162,352 158,358 148,352 6
poly halter_held 158,354 165,375 160,378 154,357 6
poly halter_buckle 163,372 168,375 166,380 161,377 14
poly arthur_head 125,248 146,242 150,268 130,274 0
poly arthur_cap 120,248 152,238 158,252 122,258 0
line cap_peak 148,245 164,252 c0
line shoulder_rim 100,305 135,288 c7
line arm_rim 130,305 155,340 c7
poly bailiff_shadow 370,250 420,250 435,258 360,258 mix:,0@0.7
poly bailiff_body 375,202 405,198 412,252 370,252 0
poly bailiff_head 382,185 398,185 398,202 382,202 0
poly bailiff_hat 378,185 402,185 402,178 378,178 0
line hat_brim 374,185 406,185 c0
line ledger_white 395,215 405,215 c15
poly b_swag_1 20,150 70,165 120,152 70,156 12
poly b_swag_2 120,152 170,168 220,154 170,158 14
poly b_swag_3 220,154 270,170 320,156 270,160 12
poly b_swag_4 320,156 370,172 420,158 370,162 14
poly b_swag_5 420,158 450,170 480,162 450,164 12
poly b_flag_1 60,162 70,180 80,163 4
poly b_flag_2 160,164 170,182 180,166 14
poly b_flag_3 260,166 270,184 280,168 4
poly b_flag_4 360,168 370,186 380,170 14
line bunting_cord 0,148 480,160 c0
dots dust_motes 200,320 220,305 245,340 280,315 295,360 215,380 235,400 310,385 c14
rect post_l 0,260,25,209 0
rect beam_top 0,260,480,15 0
line post_edge 25,260 25,469 c8
line beam_edge 0,275 480,275 c8`,
  cycles: [
    {
      name: "the bunting colours",
      areas: ["b_flag_1", "b_flag_2", "b_flag_3", "b_flag_4"],
      colors: [4, 14, 12],
      style: "rotate",
      sweep: true,
      ms: 320
    },
    {
      name: "the dust motes",
      areas: ["dust_motes"],
      colors: [14, 6, 0],
      style: "pingpong",
      scatter: true,
      ms: 450
    }
  ],
  loops: [
    {
      name: "marquee flag",
      at: [240, 120],
      frames: [
        ["222222........", "2222222.......", "222222........", "22222.........", "2222.........."],
        [".222222.......", "22222222......", ".2222222......", "222222........", ".2222........."],
        ["..222222......", ".22222222.....", "..2222222.....", ".2222222......", "222222........"],
        [".222222.......", "22222222......", ".2222222......", "222222........", ".2222........."]
      ],
      ms: 220,
      style: "loop"
    }
  ]
};

export const boxart = {
  shot: "archetype: the icon; the empty iron tethering ring and snapped hemp tether with a trailing golden-yellow ribbon; beat the dwarf because the mystery centers specifically on the broken pledge and missing prize goat marked by the ledger ribbon; background brown 6; noon light casting hard dithered diagonal shadows across weathered deal boards and scattered straw; the question: where did Barnaby go before the 3 o'clock bell?",
  titleAt: "top",
  draw: `rect canvas_bg 0,96,480,304 fade:6,14/240,96/240,400
poly floor_boards 0,160 480,160 480,400 0,400 fade:6,0/240,160/240,450
line board_gap1 0,220 480,220 c0
line board_gap2 0,285 480,285 c0
line board_gap3 0,355 480,355 c0
poly post_shadow 160,160 290,390 220,400 120,200 mix:0,6@0.65
poly stake_shadow 320,160 440,360 380,380 290,190 mix:0,6@0.6
rect wall_plank1 40,96,45,110 6 e0
rect wall_plank2 95,96,40,105 fade:6,0/115,96/115,201 e0
rect wall_plank3 350,96,50,115 6 e0
rect wall_plank4 410,96,45,108 fade:6,0/430,96/430,204 e0
rect post_main 180,110,88,180 fade:6,14/180,110/268,110 e0
rect post_face 188,110,72,180 6
line post_grain1 202,110 202,290 c0
line post_grain2 225,110 225,290 c8
line post_grain3 245,110 245,290 c0
poly beam_brace 180,110 268,110 248,150 200,150 mix:6,0@0.5 e0
ellipse plate_shadow 224,208,36,36 mix:0,6@0.7
rect ring_plate 204,188,40,40 8 e0
rect ring_plate_inner 208,192,32,32 7
dots bolts 210,194 238,194 210,222 238,222 c0
ellipse staple_base 224,208,12,12 8 e0
ellipse staple_hole 224,208,6,6 0
ellipse ring_shadow 242,254,28,34 mix:0,6@0.75
ellipse ring_outer 224,236,26,32 8 e0
ellipse ring_inner 224,236,16,22 6
poly ring_hi 204,220 212,212 216,228 206,236 15
poly ring_sh 238,248 248,242 244,262 236,264 0
poly tether_shadow 210,250 170,360 215,385 240,265 mix:0,6@0.7
poly tether_fray 212,238 236,238 244,258 206,256 6 e0
poly rope_body 206,256 244,258 238,290 196,286 mix:6,14@0.4 e0
poly rope_cut 196,286 238,290 230,305 186,298 14 e6
dots rope_fibers 184,299 188,304 193,308 200,307 212,310 222,309 231,304 c14
poly ribbon_shadow 224,230 200,320 250,380 280,370 240,290 mix:0,6@0.65
poly ribbon_loop1 220,226 230,222 242,234 230,240 14 e6
poly ribbon_fall1 228,238 238,234 222,284 210,282 14 e6
poly ribbon_twist 210,282 222,284 214,310 204,306 mix:14,6@0.5 e6
poly ribbon_fall2 204,306 214,310 236,360 222,364 14 e6
poly ribbon_tail1 222,364 236,360 258,382 242,386 14 e6
poly ribbon_notch1 258,382 242,386 246,394 262,388 0
poly ribbon_fall3 226,236 234,236 262,295 252,298 14 e6
poly ribbon_tail2 252,298 262,295 284,342 272,346 14 e6
poly ribbon_notch2 284,342 272,346 280,354 290,348 0
line straw1 110,260 145,280 c14
line straw2 125,270 160,265 c14
line straw3 270,320 310,335 c14
line straw4 285,310 325,330 c14
line straw5 170,360 205,375 c14
line straw6 150,370 190,365 c14
line straw7 330,270 365,285 c14
line straw8 80,340 120,350 c14
line straw9 360,340 395,360 c14
line straw10 220,380 250,395 c14
poly hoofprint_sh 140,320 152,314 158,328 144,336 0
ellipse hoofprint_l 143,322,4,6 0
ellipse hoofprint_r 151,324,4,6 0
poly dust_motes 200,120 280,120 340,300 220,300 mix:,14@0.15
dots motes_bright 215,145 235,160 255,140 228,190 262,210 240,245 270,270 c15`
};

// The colour the cover and the box art stand on, as the world states it (BRIEF.md §7); a world that states none has none: the game measures it from the rooms.
export const bg = 6;
