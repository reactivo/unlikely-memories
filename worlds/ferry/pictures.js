// Pictures for "The Crossing at Zero Point" (shared by the world's languages): one per room (12) and one per ending (2), as the world's AI drew them in the short notation
// (BRIEF.md §7); the poster of its page (cover) and its box art. Written by tools/world.mjs add from the hand-in.

export default {
  cabin_14: {
    version: 1,
    shot: "Eye-level facing north inside the ferry berth, vanishing point at center; institution; fluorescent overhead bar casting harsh flat light downwards, cold industrial shadows; the north bulkhead with {cabin_door} at center-left and a metal {berth_locker} beside it, an industrial {bunk} frame along the east wing below a ribbed {vent}; dressing includes {linoleum} deck plating, an overhead bulkhead {lamp}, and wall {rivets}; moves: the overhead fluorescent tube (a faulty tube: flicker).",
    draw: `rect back_wall 0,0,320,105 8
rect ceiling 0,0,320,24 0
rect deck_far 0,105,320,12 8
rect deck_mid 0,117,320,10 0
rect deck_fore 0,127,320,9 8
rect panel_l1 0,24,42,81 7
rect panel_l2 44,24,48,81 7
rect panel_mid 94,24,78,81 8
rect panel_r1 174,24,68,81 7
rect panel_r2 244,24,76,81 7
line seam_1 43,24 43,105 c0
line seam_2 93,24 93,105 c0
line seam_3 173,24 173,105 c0
line seam_4 243,24 243,105 c0
rect duct_body 180,6,140,16 7
rect duct_under 180,22,140,2 8
line duct_rib1 195,6 195,22 c0
line duct_rib2 215,6 215,22 c0
line duct_rib3 235,6 235,22 c0
line duct_rib4 255,6 255,22 c0
line duct_rib5 275,6 275,22 c0
line duct_rib6 295,6 295,22 c0
rect lamp_mount 110,20,60,4 0
rect lamp_tube 114,24,52,3 15
rect lamp_flicker 114,24,52,3 7
rect frame_door 98,28,68,77 0
rect door_inner_shut 102,32,60,73 7
rect cabin_door 102,32,60,73 8
line door_seam 102,68 162,68 c0
rect door_plate 126,44,14,8 7
rect door_handle 152,65,6,4 15
rect door_frame_ajar 102,32,60,73 0
rect cabin_door_open 102,32,60,73 0
poly cabin_door_open_leaf 102,32 116,28 116,99 102,105 8 e0
line open_handle 112,66 115,66 c15
rect frame_locker 176,34,32,71 0
rect berth_locker 178,36,28,67 8
rect locker_slat1 184,42,16,2 0
rect locker_slat2 184,46,16,2 0
rect locker_slat3 184,50,16,2 0
rect locker_handle 180,68,3,8 15
rect berth_locker_open 178,36,28,67 0
poly berth_locker_open_door 178,36 166,40 166,102 178,103 8 e0
rect bunk_back 216,74,104,32 0
rect bunk_mat 218,72,102,8 7
rect bunk_blanket 238,71,82,9 8
line bunk_fold 238,71 238,80 c0
rect bunk_frame_front 216,80,104,4 7
rect bunk_leg1 220,84,6,36 0
rect bunk_leg2 308,84,6,36 0
rect bunk_shelf 216,112,104,3 8
dots wall_rivets 6,30 6,50 6,70 6,90 90,30 90,50 90,70 90,90 170,30 170,50 170,70 170,90 240,30 240,50 240,70 240,90 c0
rect desk_surface 12,86,64,6 7
rect desk_edge 12,92,64,3 8
rect desk_leg 20,95,5,26 0`,
    cycles: [{ name: "the light", areas: ["lamp_flicker"], colors: [7, 15], style: "flicker", ms: [800, 4000] }],
    overlays: [
      { object: "cabin_key", at: [26, 80] },
      { object: "intercom_box", at: [50, 78] },
      { object: "violin_case", at: [248, 64] }
    ]
  },
  companionway: {
    version: 1,
    shot: "eye-level perspective looking north along the corridor, vanishing point at (160, 68); institution; harsh fluorescent light spilling down from overhead fixtures; narrow steel bulkheads on either side, bulkhead passage arches left to the west and right to the east, steel {hatch} coaming set into the linoleum floor at center right, seated {guard} on a metal stool stationed by the bulkhead at right; dressing includes overhead fluorescent {tubes}, bulkhead conduit pipes, an emergency axe case on the left bulkhead, rivets, and dark steel doorframes; moves: the fluorescent tube (the neon sign recipe: a flicker)",
    draw: `vp 160,68
rect bg 0,0,320,136 8
poly ceil 0,0 320,0 216,46 104,46 8
poly ceil_far 104,46 216,46 186,58 134,58 7
rect far_wall 134,58,52,24 8
poly fl_far 134,82 186,82 220,102 100,102 2
poly fl_mid 100,102 220,102 268,122 52,122 2
poly fl_near 52,122 268,122 320,136 0,136 10
poly w_wall_near 0,0 104,46 100,102 0,136 8
poly e_wall_near 320,0 216,46 220,102 320,136 8
poly w_wall_far 104,46 134,58 134,82 100,102 7
poly e_wall_far 216,46 186,58 186,82 220,102 7
line seam1 0,136 134,82 c0
line seam2 320,136 186,82 c0
line ceil_seam1 0,0 134,58 c0
line ceil_seam2 320,0 186,58 c0
rect far_door 152,62,16,20 0
line far_trim 151,61 168,61 c7
rect arch_w 18,30,38,90 0
rect arch_w_inner 22,34,30,84 8
rect arch_e 264,30,38,90 0
rect arch_e_inner 268,34,30,84 8
rect tube_base_far 148,50,24,3 0
rect tube_far 150,51,20,1 15
rect tube_base_near 138,20,44,5 0
rect tubes 140,21,40,3 15
poly floor_light_far 144,82 176,82 182,92 138,92 10
poly floor_light_near 130,106 190,106 202,126 118,126 10
line pipe_w1 0,12 104,50 c7
line pipe_w2 0,16 104,52 c0
line pipe_e1 320,12 216,50 c7
line pipe_e2 320,16 216,52 c0
rect box_axe 62,56,16,28 0
rect box_axe_in 64,58,12,24 8
line axe_handle 70,60 70,80 c7
rect axe_head 67,61,6,4 7
line w_panel1 42,20 42,120 c0
line w_panel2 84,36 84,108 c0
line e_panel1 278,20 278,120 c0
line e_panel2 236,36 236,108 c0
rect hatch_rim 182,95,36,20 0
poly hatch_coam 184,97 216,97 214,113 182,113 7
rect hatch 185,98,28,14 8
line hatch_groove 199,98 199,112 c0
rect hatch_handle 197,104,4,2 7
rect hatch_ajar 185,98,28,14 0
poly hatch_ajar_leaf 213,84 219,82 219,102 213,104 8
line hatch_ajar_edge 213,84 213,104 c7
rect stool_top 228,96,16,3 7
line stool_leg1 230,99 228,112 c0
line stool_leg2 242,99 244,112 c0
line stool_strut 229,106 243,106 c7
rect guard_boots 232,108,12,5 0
rect guard_legs 233,96,10,13 8
rect guard_coat 230,76,14,22 8
rect guard_cuff 232,84,4,8 0
rect guard_arm 228,80,4,14 8
ellipse guard_head 237,70,4,5 7
rect guard_cap 232,65,10,4 0
line guard_peak 231,69 237,69 c0
line fl_line1 12,124 308,124 c0
line fl_line2 60,108 260,108 c0
line fl_line3 110,92 210,92 c0
dots linoleum_scuff 80,126 140,118 160,130 200,124 230,128 250,116 110,106 c0`,
    cycles: [{ name: "the tubes", areas: ["tubes"], colors: [15, 8], style: "flicker", ms: [800, 4000] }],
    overlays: [
      { object: "transit_pass", at: [116, 116] },
      { object: "inspector_brandt", at: [128, 116], tall: 66 }
    ]
  },
  purser_office: {
    version: 1,
    shot: "eye level facing north; institution; dim fluorescent tube overhead; a partition {counter} with frosted glass running east to west across the middle, pigeonhole {shelves} across the back wall crammed with paper files, the companionway doorframe to the east; dressing: overhead {tube}, bulkhead {clock}, wooden {stool}, filing {trays}, desk {lamp}; moves: the overhead tube (neon faulty recipe: flicker)",
    draw: `vp 160,54
rect ceiling 0,0,320,32 0
rect back_wall 0,32,320,52 8
poly floor 0,84 320,84 320,136 0,136 0
poly floor_band 0,98 320,98 320,136 0,136 8
poly floor_near 0,114 320,114 320,136 0,136 7
rect door_frame 268,26,48,72 8 e0
rect door_void 274,32,42,66 0
line door_sill 274,98 316,98 c7
rect pigeonholes 44,34,168,44 0
rect pigeon_bg 46,36,164,40 8
line p_h1 46,44 210,44 c0
line p_h2 46,52 210,52 c0
line p_h3 46,60 210,60 c0
line p_h4 46,68 210,68 c0
line p_v1 62,36 62,76 c0
line p_v2 78,36 78,76 c0
line p_v3 94,36 94,76 c0
line p_v4 110,36 110,76 c0
line p_v5 126,36 126,76 c0
line p_v6 142,36 142,76 c0
line p_v7 158,36 158,76 c0
line p_v8 174,36 174,76 c0
line p_v9 190,36 190,76 c0
rect form1 48,38,12,5 7
rect form2 64,46,12,5 7
rect form3 80,38,12,5 7
rect form4 96,54,12,5 7
rect form5 112,46,12,5 7
rect form6 128,62,12,5 7
rect form7 144,38,12,5 7
rect form8 160,54,12,5 7
rect form9 176,46,12,5 7
rect form10 192,38,12,5 7
rect form11 48,62,12,5 7
rect form12 80,62,12,5 7
rect form13 144,62,12,5 7
rect form14 176,62,12,5 7
ellipse clock_c 232,42,8,8 7 e0
ellipse clock_in 232,42,6,6 15
line clock_h 232,42 232,38 c0
line clock_m 232,42 235,42 c0
rect tray_b 222,66,18,12 8 e0
rect tray1 223,74,16,2 7
rect tray2 223,69,16,2 7
rect desk_rear 36,74,186,12 0
rect lamp_base 48,72,8,3 0
line lamp_stem 52,72 52,65 c0
poly lamp_shade 46,65 58,63 56,60 48,60 8
rect stool_seat 90,78,16,4 8 e0
line stool_l1 93,82 91,96 c0
line stool_l2 103,82 105,96 c0
line stool_r 92,90 104,90 c0
rect counter_face 18,92,238,40 8 e0
line counter_plank1 18,102 256,102 c0
line counter_plank2 18,114 256,114 c0
line counter_plank3 18,126 256,126 c0
rect counter_top 16,88,242,4 7 e0
line counter_top_edge 16,88 258,88 c15
rect glass_frame 26,50,224,38 8 e0
rect glass_pane 28,52,220,36 mix:7,8@0.5
line glass_bar1 82,50 82,88 c0
line glass_bar2 138,50 138,88 c0
line glass_bar3 194,50 194,88 c0
rect hatch_gap 96,82,44,6 0
rect fl_mount 110,8,100,3 8
rect tube_glow 114,11,92,2 7
rect tube_core 116,11,88,2 15
rect sign_exit 276,20,24,6 2 e0
line sign_div 278,23 298,23 c10
line panel_v1 30,92 30,132 c0
line panel_v2 70,92 70,132 c0
line panel_v3 110,92 110,132 c0
line panel_v4 150,92 150,132 c0
line panel_v5 190,92 190,132 c0
line panel_v6 230,92 230,132 c0
dots floor_marks 24,120 48,128 160,122 210,130 280,118 c0`,
    cycles: [{ name: "tube_flicker", areas: ["tube_core"], colors: [15, 7], style: "flicker", ms: [800, 3500] }],
    overlays: [
      { object: "inspector_brandt", at: [114, 86], tall: 52 },
      { object: "carbon_manifest", at: [148, 86] }
    ]
  },
  saloon: {
    version: 1,
    shot: "eye level facing north, vanishing point 160,62; deepnight; fluorescent strip lighting overhead on bulkhead panels; rows of {chairs} facing north bulkheads with thick round {portholes} looking onto dark spray, steel gangways leading west to {companionway} and east to {galley}, north sliding doors to {promenade}; overhead fluorescent {fixtures}, deck linoleum seams, vinyl seat backs, salt streaks on glass; moves: the fluorescent tube flicker (a faulty neon sign tube: flicker)",
    draw: `rect sky_bulkhead 0,0,320,70 1
rect ceiling 0,0,320,32 0
poly floor 0,136 320,136 260,70 60,70 1
poly deck_band1 0,136 320,136 295,108 25,108 3
poly deck_band2 25,108 295,108 275,86 45,86 1
poly deck_band3 45,86 275,86 260,70 60,70 0
line seam_c 160,70 160,136 c0
line seam_l1 110,70 60,136 c0
line seam_r1 210,70 260,136 c0
line seam_l2 85,70 0,116 c0
line seam_r2 235,70 320,116 c0
rect wall_mid 60,32,200,38 8
rect wall_panel_l 64,34,58,34 7
rect wall_panel_c 126,34,68,34 7
rect wall_panel_r 198,34,58,34 7
rect wall_shadow 60,32,200,4 0
rect wing_w 0,0,60,136 0
poly wing_w_wall 0,20 60,32 60,82 0,96 8
poly wing_w_door 8,36 44,42 44,80 8,86 0
rect wing_e 260,0,60,136 0
poly wing_e_wall 260,32 320,20 320,96 260,82 8
poly wing_e_door 276,42 312,36 312,86 276,80 0
rect beam_n 138,36,44,34 0
rect door_n_frame 140,38,40,32 8
rect door_n_leaf_l 142,40,17,30 1
rect door_n_leaf_r 161,40,17,30 1
line door_n_gap 160,40 160,70 c0
rect door_n_glass_l 144,43,13,16 3
rect door_n_glass_r 163,43,13,16 3
ellipse porthole_l_rim 92,50,15,15 0
ellipse porthole_l_bezel 92,50,14,14 8
ellipse porthole_l_glass 92,50,11,11 1
ellipse porthole_r_rim 228,50,15,15 0
ellipse porthole_r_bezel 228,50,14,14 8
ellipse porthole_r_glass 228,50,11,11 1
line spray_l1 88,43 85,55 c3
line spray_l2 94,42 91,58 c3
line spray_l3 99,46 97,54 c3
line spray_r1 224,43 221,55 c3
line spray_r2 230,42 227,58 c3
line spray_r3 235,46 233,54 c3
rect light_mount_l 80,12,48,4 8
rect light_tube_l 82,14,44,3 15
rect light_mount_r 192,12,48,4 8
rect light_tube_r 194,14,44,3 15
rect light_mount_c 136,8,48,4 8
rect fl_tube 138,10,44,3 11
rect lit_patch_l 76,70,56,4 3
rect lit_patch_r 188,70,56,4 3
poly lit_floor_c 120,70 200,70 220,136 100,136 3
rect bench_far_leg_l 78,74,3,10 0
rect bench_far_leg_r 106,74,3,10 0
rect bench_far_seat 74,72,38,4 1
rect bench_far_back 74,66,38,6 3
rect bench_far2_leg_l 212,74,3,10 0
rect bench_far2_leg_r 240,74,3,10 0
rect bench_far2_seat 208,72,38,4 1
rect bench_far2_back 208,66,38,6 3
rect bench_mid_sh 60,94,64,6 0
rect bench_mid_post_l 66,90,4,12 0
rect bench_mid_post_r 118,90,4,12 0
poly bench_mid_seat 60,88 128,88 126,93 58,93 1
rect bench_mid_c1 62,79,18,9 3
rect bench_mid_c2 85,79,18,9 3
rect bench_mid_c3 108,79,18,9 3
line bench_mid_edge 60,88 128,88 c11
rect bench_mid2_sh 196,94,64,6 0
rect bench_mid2_post_l 202,90,4,12 0
rect bench_mid2_post_r 254,90,4,12 0
poly bench_mid2_seat 196,88 264,88 262,93 194,93 1
rect bench_mid2_c1 198,79,18,9 3
rect bench_mid2_c2 221,79,18,9 3
rect bench_mid2_c3 244,79,18,9 3
line bench_mid2_edge 196,88 264,88 c11
rect bench_near_sh 72,126,176,8 0
rect bench_near_leg1 88,118,6,16 0
rect bench_near_leg2 157,118,6,16 0
rect bench_near_leg3 226,118,6,16 0
poly bench_near_beam 78,118 242,118 242,122 78,122 8
poly bench_near_base 70,114 250,114 246,120 74,120 1
rect bench_near_s1 74,98,36,16 3
rect bench_near_s1_t 76,100,32,12 1
rect bench_near_s2 116,98,36,16 3
rect bench_near_s2_t 118,100,32,12 1
rect bench_near_s3 168,98,36,16 3
rect bench_near_s3_t 170,100,32,12 1
rect bench_near_s4 210,98,36,16 3
rect bench_near_s4_t 212,100,32,12 1
line bench_near_rim 70,114 250,114 c11
rect table_near 140,110,40,18 8
rect table_top 138,108,44,3 7
line table_edge 138,108 182,108 c15
rect table_leg 158,111,4,19 0
rect ashtray 146,105,10,3 0
rect ashtray_inner 147,106,8,1 8
line ceiling_joint1 0,16 320,16 c8
line ceiling_joint2 0,24 320,24 c8
line deck_joint1 0,96 60,82 c0
line deck_joint2 320,96 260,82 c0
dots saltspecks 91,48 95,52 226,49 231,53 c3`,
    cycles: [
      {
        name: "fluorescent flicker",
        areas: ["fl_tube"],
        colors: [11, 3],
        style: "flicker",
        ms: [800, 3200]
      }
    ],
    overlays: [
      { object: "transit_pass", at: [166, 104] },
      { object: "stamped_manifest", at: [142, 104] },
      { object: "inspector_brandt", at: [108, 112], tall: 66 }
    ]
  },
  galley: {
    version: 1,
    shot: "eye level facing north; institution; dim dead tube light from overhead fixture, hard grey shadows; central stainless {worktops} in columns 80 to 220, stainless steel {draining racks} on wall above, deep kitchen sink and tiles, west exit doorway into passenger {saloon} in left wing, bulkheads and vent hoods in right wing; dressing: {worktops}, {draining racks}, overhead dead strip {fixtures}, ventilation {hood}, floor {tiles}, saloon {doorway}; moves: strip fixture filament (a neon sign recipe: faulty flicker)",
    draw: `rect back_wall 0,0,320,105 8
rect ceiling 0,0,320,24 0
rect floor_base 0,105,320,31 8
rect floor_band1 0,105,320,12 0
rect floor_band2 0,117,320,19 8
line tile_grid1 0,117 320,117 c0
line tile_grid2 0,127 320,127 c0
line tile_vert1 40,105 30,136 c0
line tile_vert2 80,105 70,136 c0
line tile_vert3 120,105 110,136 c0
line tile_vert4 160,105 150,136 c0
line tile_vert5 200,105 190,136 c0
line tile_vert6 240,105 230,136 c0
line tile_vert7 280,105 270,136 c0
rect door_frame 6,24,38,88 0
rect doorway 10,28,30,84 8
rect door_inner 14,32,22,76 0
rect saloon_glow 18,36,14,68 8
rect vent_hood 230,18,80,26 7
rect vent_lip 226,42,88,4 0
line vent_seam 260,18 260,42 c8
line vent_seam2 290,18 290,42 c8
rect vent_shadow 230,46,80,6 0
rect tile_panel_mid 54,34,168,44 7
line tile_h1 54,45 222,45 c8
line tile_h2 54,56 222,56 c8
line tile_h3 54,67 222,67 c8
line tile_v1 78,34 78,78 c8
line tile_v2 102,34 102,78 c8
line tile_v3 126,34 126,78 c8
line tile_v4 150,34 150,78 c8
line tile_v5 174,34 174,78 c8
line tile_v6 198,34 198,78 c8
rect rack_rail_top 62,40,152,2 0
rect rack_rail_bot 62,50,152,2 0
line rack_bar1 68,42 68,50 c7
line rack_bar2 74,42 74,50 c7
line rack_bar3 80,42 80,50 c7
line rack_bar4 86,42 86,50 c7
line rack_bar5 92,42 92,50 c7
line rack_bar6 98,42 98,50 c7
line rack_bar7 104,42 104,50 c7
line rack_bar8 110,42 110,50 c7
line rack_bar9 116,42 116,50 c7
line rack_bar10 122,42 122,50 c7
line rack_bar11 128,42 128,50 c7
line rack_bar12 134,42 134,50 c7
line rack_bar13 140,42 140,50 c7
line rack_bar14 146,42 146,50 c7
line rack_bar15 152,42 152,50 c7
line rack_bar16 158,42 158,50 c7
line rack_bar17 164,42 164,50 c7
line rack_bar18 170,42 170,50 c7
line rack_bar19 176,42 176,50 c7
line rack_bar20 182,42 182,50 c7
line rack_bar21 188,42 188,50 c7
line rack_bar22 194,42 194,50 c7
line rack_bar23 200,42 200,50 c7
line rack_bar24 206,42 206,50 c7
rect fixture_box1 80,10,60,6 0
rect fixture_box2 180,10,60,6 0
rect fixture_tube1 82,14,56,2 7
rect fixture_tube2 182,14,56,2 8
line tube_flicker 196,15 220,15 c7
rect counter_shadow 50,108,180,8 0
rect bench_body 54,78,172,32 0
rect bench_front 56,80,168,28 8
rect bench_top 50,74,180,6 7
line bench_top_edge 50,74 230,74 c15
line bench_top_dark 50,79 230,79 c0
rect sink_cutout 66,74,40,4 0
rect sink_basin 68,76,36,2 8
rect tap_post 84,66,4,8 7
rect tap_spout 84,64,10,2 7
line tap_drop 92,66 92,68 c15
rect door_seam1 112,80,2,28 0
rect door_seam2 168,80,2,28 0
rect handle1 106,86,2,10 7
rect handle2 118,86,2,10 7
rect handle3 162,86,2,10 7
rect handle4 174,86,2,10 7
rect right_counter_top 234,74,86,6 7
line right_edge 234,74 320,74 c15
rect right_counter_face 234,80,86,30 8
rect right_shadow 234,110,86,6 0
rect right_shelf_cut 246,84,68,20 0
rect right_shelf_bot 248,94,64,2 7
rect grease_pan 252,90,18,4 8
rect grease_pan_lip 250,89,22,1 7
rect kettle_body 280,86,12,8 8
line kettle_handle 282,84 288,84 c7
rect splashback 50,70,180,4 8
rect first_aid_box 26,44,14,16 2
rect first_aid_cross_v 32,48,2,8 7
rect first_aid_cross_h 29,51,8,2 7
line edge_post_l 0,0 0,136 c0
line edge_post_r 319,0 319,136 c0`,
    cycles: [
      {
        name: "dead strip tube",
        areas: ["tube_flicker"],
        colors: [7, 8],
        style: "flicker",
        ms: [800, 3200]
      }
    ],
    overlays: []
  },
  promenade_deck: {
    version: 1,
    shot: "eye level facing north, vanishing point at (160, 68); moonlight; harsh blue-black night with storm glare from an overcast Baltic horizon, cold deck lights throwing hard pale cyan highlights across wet steel; open steel promenade deck between columns 47 and 272, with the {sea} and low {horizon} beyond, the {superstructure} bulkheads and an overhead shelter overhang lining the wings; dressing includes the steel {deck}, heavy {rail}, welded {stanchions}, a bulkhead {vent}, an orange ring {lifebuoy} mounted on the bulkhead, and a deck {scupper}; moves: Baltic wave glints on the sound (the shimmer recipe: a pingpong), wind-driven spray specks over the rail (the snow or rain beyond a window recipe: a scroll)",
    draw: `rect sky 0,0,320,60 0
rect horizon_band 0,54,320,8 1
poly water_far 0,62 320,62 320,74 0,74 1
line sea_edge 0,62 320,62 c9
poly water_mid 0,74 320,74 320,88 0,88 1
poly water_near 0,88 320,88 320,102 0,102 0
line wave_h1 24,66 48,66 c9
line wave_h2 96,64 128,64 c11
line wave_h3 180,65 210,65 c9
line wave_h4 260,67 292,67 c9
line wave_m1 40,78 82,78 c9
line wave_m2 140,76 190,76 c11
line wave_m3 220,80 268,80 c9
line wave_n1 80,94 134,94 c9
line wave_n2 170,96 230,96 c11
line sh1 112,65 116,65 c15
line sh2 118,66 122,66 c11
line sh3 150,77 154,77 c15
line sh4 158,78 163,78 c9
line sh5 174,76 179,76 c15
line sh6 182,77 186,77 c11
line sh7 195,95 200,95 c15
line sh8 203,96 208,96 c11
line sh9 214,95 218,95 c9
line sh10 102,94 107,94 c15
line sh11 110,95 115,95 c11
rect spray_col1 88,40,4,45 0
rect spray_col2 150,42,4,45 0
rect spray_col3 214,40,4,45 0
dots sp_far 89,45 90,62 151,50 152,70 215,48 216,66 c7
dots sp_near 90,52 152,58 215,56 216,74 c15
poly deck 0,100 320,100 320,136 0,136 8
poly deck_wet 0,106 320,106 320,136 0,136 0
line deck_seam1 0,114 320,114 c8
line deck_seam2 0,124 320,124 c8
line deck_sheen1 70,114 140,114 c1
line deck_sheen2 170,124 250,124 c1
line deck_sheen3 110,128 190,128 c11
rect scupper 154,133,16,3 0
line scupper_lip 154,132 170,132 c7
poly super_w 0,0 46,0 42,108 0,112 8
line super_w_edge 46,0 42,108 c0
poly super_w_face 0,0 36,0 32,110 0,112 1
rect vent_box 10,48,18,34 0
rect vent_louver1 12,54,14,3 8
rect vent_louver2 12,62,14,3 8
rect vent_louver3 12,70,14,3 8
line vent_rim 10,48 28,48 c7
poly super_e 274,0 320,0 320,112 278,108 8
line super_e_edge 274,0 278,108 c0
poly super_e_face 282,0 320,0 320,112 286,110 1
rect buoystrap 296,44,2,36 8
ellipse lifebuoy_out 297,60,12,12 12
ellipse lifebuoy_in 297,60,6,6 1
rect buoy_quarter1 295,48,4,4 15
rect buoy_quarter2 295,68,4,4 15
rect buoy_quarter3 285,58,4,4 15
rect buoy_quarter4 305,58,4,4 15
poly roof 0,0 320,0 320,18 0,18 8
poly roof_rim 0,18 320,18 320,22 0,22 0
line roof_lip 0,22 320,22 c7
line roof_weld 0,10 320,10 c0
line rail_top 42,94 278,94 c11
line rail_top_shadow 42,95 278,95 c0
line rail_mid 42,100 278,100 c7
line rail_mid_shadow 42,101 278,101 c0
line rail_low 42,106 278,106 c8
rect post_1 56,94,3,18 7
line post_1_sh 58,94 58,112 c0
rect post_2 86,94,3,18 7
line post_2_sh 88,94 88,112 c0
rect post_3 116,94,3,18 7
line post_3_sh 118,94 118,112 c0
rect post_4 146,94,3,18 7
line post_4_sh 148,94 148,112 c0
rect post_5 174,94,3,18 7
line post_5_sh 176,94 176,112 c0
rect post_6 204,94,3,18 7
line post_6_sh 206,94 206,112 c0
rect post_7 234,94,3,18 7
line post_7_sh 236,94 236,112 c0
rect post_8 264,94,3,18 7
line post_8_sh 266,94 266,112 c0
line stay_w 44,22 56,94 c7
line stay_w_sh 45,22 57,94 c0
line stay_e 276,22 264,94 c7
line stay_e_sh 277,22 265,94 c0
line deck_stain1 120,120 135,120 c8
line deck_stain2 195,116 210,116 c8
line deck_puddle 130,122 175,122 c11
line deck_puddle2 135,123 170,123 c9
dots bolt_heads 58,113 88,113 118,113 148,113 176,113 206,113 236,113 266,113 c7
line spray_base 80,100 240,100 c11`,
    cycles: [
      {
        name: "the water shimmer",
        areas: ["sh1", "sh2", "sh3", "sh4", "sh5", "sh6", "sh7", "sh8", "sh9", "sh10", "sh11"],
        colors: [15, 11, 9],
        style: "pingpong",
        scatter: true,
        ms: 420
      },
      {
        name: "spray drift",
        areas: ["sp_far", "spray_col1", "spray_col2", "spray_col3"],
        style: "scroll",
        dir: "down",
        ms: 140
      }
    ],
    overlays: []
  },
  stern_rail: {
    version: 1,
    shot: "eye-level facing north looking aft over the wake, vanishing point at 160,76; moonlight; harsh cold deck floodlights with black night sea; aft railing and churning white wake in center columns 90-230, steel counter and bulwark flanking, deck stanchion and stern jackstaff with halyards on right; {counter} plating, {rail} stanchions, frothing {wake}, churning {water}, flagstaff with flapping {ensign}; moves: the wake (the running water recipe: a scroll), the flag (the flag recipe: a loop)",
    draw: `vp 160,76
rect sky 0,0,320,62 0
rect horizon_water 0,62,320,18 1
poly sea_band_mid 0,78 320,78 320,96 0,96 1
line sea_line1 18,66 48,66 c9
line sea_line2 260,65 292,65 c9
line sea_line3 80,72 130,72 c9
line sea_line4 190,71 244,71 c9
line sea_line5 32,82 96,82 c0
line sea_line6 220,84 286,84 c0
poly wake_body 118,62 202,62 238,102 82,102 9
poly wake_r1 122,64 198,64 196,66 124,66 15
poly wake_r2 120,68 200,68 198,70 122,70 11
poly wake_r3 114,73 206,73 204,75 116,75 15
poly wake_r4 110,78 210,78 208,80 112,80 11
poly wake_r5 104,83 216,83 214,85 106,85 15
poly wake_r6 98,89 222,89 220,91 100,91 11
poly wake_r7 92,94 228,94 226,96 94,96 15
poly wake_r8 86,99 234,99 232,101 88,101 11
line wake_foam1 104,65 116,69 c15
line wake_foam2 216,65 204,69 c15
line wake_foam3 88,77 106,83 c15
line wake_foam4 232,77 214,83 c15
line wake_foam5 70,92 90,99 c15
line wake_foam6 250,92 230,99 c15
poly counter_l 0,90 96,90 80,102 0,102 8
poly counter_r 224,90 320,90 320,102 240,102 8
line counter_rim 0,90 320,90 c7
rect deck 0,102,320,34 8
poly deck_plate1 0,102 120,102 110,136 0,136 0
poly deck_plate2 122,102 200,102 198,136 112,136 8
poly deck_plate3 202,102 320,102 320,136 200,136 0
line deck_seam1 121,102 111,136 c7
line deck_seam2 201,102 199,136 c7
line deck_line_l 0,118 116,118 c8
line deck_line_r 200,118 320,118 c8
line deck_line_mid 118,124 198,124 c7
rect bulwark_cap 0,98,320,5 7
rect bulwark_shade 0,103,320,2 0
line rail_top 0,84 320,84 c15
line rail_mid 0,91 320,91 c7
rect stanchion_0 12,84,3,19 7
rect stanchion_1 52,84,3,19 7
rect stanchion_2 92,84,3,19 7
rect stanchion_3 132,84,3,19 7
rect stanchion_4 172,84,3,19 7
rect stanchion_5 212,84,3,19 7
rect stanchion_6 252,84,3,19 7
rect stanchion_7 292,84,3,19 7
rect stan_b0 11,100,5,3 0
rect stan_b1 51,100,5,3 0
rect stan_b2 91,100,5,3 0
rect stan_b3 131,100,5,3 0
rect stan_b4 171,100,5,3 0
rect stan_b5 211,100,5,3 0
rect stan_b6 251,100,5,3 0
rect stan_b7 291,100,5,3 0
rect flagstaff_base 229,97,6,6 0
rect flagstaff_flange 228,95,8,2 7
rect flagstaff 231,34,2,63 7
line flagstaff_hilite 231,34 231,96 c15
ellipse staff_truck 232,33,2,2 15
line halyard_l 232,35 229,96 c7
line halyard_r 233,35 235,96 c7
line cleat 228,88 236,88 c15
poly flood_casing_l 34,70 46,70 44,78 36,78 0
rect flood_lens_l 37,72,6,5 15
poly flood_beam_l 36,77 44,77 68,102 20,102 9
poly flood_casing_r 274,70 286,70 284,78 276,78 0
rect flood_lens_r 277,72,6,5 15
poly flood_beam_r 276,77 284,77 308,102 260,102 9
rect scupper_l 28,105,8,3 0
rect scupper_r 284,105,8,3 0
line weld_mark1 60,110 74,110 c0
line weld_mark2 140,114 154,114 c0
line weld_mark3 234,112 248,112 c0
line weld_mark4 164,128 178,128 c0
dots deck_bolts 14,101 54,101 94,101 134,101 174,101 214,101 254,101 294,101 c15
dots deck_rivets 40,106 80,106 160,106 240,106 270,106 c0`,
    cycles: [
      {
        name: "the wake",
        areas: [
          "wake_body",
          "wake_r1",
          "wake_r2",
          "wake_r3",
          "wake_r4",
          "wake_r5",
          "wake_r6",
          "wake_r7",
          "wake_r8"
        ],
        style: "scroll",
        dir: "down",
        ms: 90
      }
    ],
    overlays: [],
    loops: [
      {
        name: "ensign",
        at: [233, 36],
        frames: [
          [
            "4ccccccccc44..",
            "44cccccccc44..",
            "444cccccccc44.",
            "44444444444444",
            "444cccccccc44.",
            "44cccccccc44.."
          ],
          [
            "44ccccccccc4..",
            "4cccccccccc44.",
            "4444cccccccc44",
            "44444444444444",
            "444cccccccc44.",
            "44ccccccccc44."
          ],
          [
            "44cccccccc44..",
            "444cccccccc44.",
            "44ccccccccc44.",
            "44444444444444",
            "4444cccccccc44",
            "444cccccccc44."
          ],
          [
            "444cccccccc44.",
            "44ccccccccc44.",
            "4cccccccccc44.",
            "44444444444444",
            "44ccccccccc44.",
            "444cccccccc44."
          ]
        ],
        ms: 300,
        style: "loop"
      }
    ]
  },
  wheelhouse_vestibule: {
    version: 1,
    shot: "eye-level view facing north toward teak bulkhead and brass bridge ladder, vanishing point 160,68; lamplight; warm incandescent bulkhead sconce overhead lighting teak grain and steel deck; bolted timber desk on west third holding ship forms and ink pad, brass ladder rising north-center to hatchway, heavy watertight steel doorframe open east to wet deck; dressing: bolted {desk}, teak {panelling}, ship's {stationery}, brass {ladder}, deckhead {sconce}, rubber matting; moves: incandescent sconce filament (the lamplight recipe: a flicker)",
    draw: `vp 160,68
rect bg 0,0,320,136 0
rect ceil 0,0,320,24 8
line ceil_seam1 0,12 320,12 c0
line ceil_seam2 0,24 320,24 c0
poly wall_back 48,24 272,24 272,94 48,94 6
poly wall_west 0,24 48,24 48,94 0,112 6
poly wall_east 272,24 320,24 320,112 272,94 6
rect pan_b1 56,28,32,62 0
rect pan_b1_in 58,30,28,58 6
rect pan_b2 96,28,40,62 0
rect pan_b2_in 98,30,36,58 6
rect pan_b3 144,28,32,62 0
rect pan_b3_in 146,30,28,58 6
rect pan_b4 184,28,40,62 0
rect pan_b4_in 186,30,36,58 6
rect pan_b5 232,28,32,62 0
rect pan_b5_in 234,30,28,58 6
line teak_grain1 64,32 64,84 c0
line teak_grain2 108,34 108,82 c0
line teak_grain3 196,36 196,80 c0
line teak_grain4 242,32 242,84 c0
poly floor_far 48,94 272,94 290,110 30,110 8
poly floor_mid 30,110 290,110 320,126 0,126 0
poly floor_near 0,126 320,126 320,136 0,136 8
rect deck_tread1 60,114,200,3 0
rect deck_tread2 44,120,232,3 0
rect deck_tread3 24,128,272,3 0
rect hatch_frame 142,20,36,6 8
rect hatch_recess 146,22,28,3 0
line ladder_rail_l 150,24 150,96 c14
line ladder_rail_r 170,24 170,96 c14
line ladder_shad_l 151,25 151,96 c6
line ladder_shad_r 171,25 171,96 c6
line rung1 150,34 170,34 c14
line rung2 150,46 170,46 c14
line rung3 150,58 170,58 c14
line rung4 150,70 170,70 c14
line rung5 150,82 170,82 c14
line rung6 150,94 170,94 c14
poly door_arch 274,30 318,25 318,108 274,96 8 e0
poly door_dark 278,35 314,31 314,104 278,93 0
poly deck_wet 282,70 314,68 314,104 282,93 1
line rail_out 286,64 314,62 c9
rect desk_bulkhead_mount 54,76,8,24 8 e0
poly desk_top 50,68 126,68 118,84 42,84 6 e0
poly desk_top_lit 52,69 124,69 117,73 45,73 14
poly desk_face 42,84 118,84 118,98 42,98 0
poly desk_flange 44,85 116,85 116,92 6 e0
rect desk_leg_l 52,98,6,18 8 e0
rect desk_leg_r 108,98,6,18 8 e0
line desk_stay 56,98 70,116 c0
line desk_bolt_l 52,115 58,115 c14
line desk_bolt_r 108,115 114,115 c14
rect forms_paper 62,72,20,8 15
rect forms_paper2 64,74,18,6 7
line forms_rule1 65,75 79,75 c8
line forms_rule2 65,77 78,77 c8
rect forms_pad 88,71,16,10 6 e0
rect forms_sheet 89,72,14,8 15
line sheet_line1 91,74 101,74 c0
line sheet_line2 91,76 100,76 c0
rect inkpad_box 108,76,8,6 0
rect inkpad_felt 109,77,6,4 4
ellipse sconce_glow_out 160,18,24,10 6
ellipse sconce_glow_in 160,18,12,5 14
rect sconce_base 156,12,8,4 8
rect sconce_arm 159,16,2,4 14
ellipse sconce_glass 160,20,4,4 15
poly light_pool_desk 54,69 120,69 112,82 46,82 14
poly light_pool_floor 120,96 200,96 226,112 94,112 6
line mat_edge_l 94,112 120,96 c0
line mat_edge_r 226,112 200,96 c0
rect bridge_board 62,34,30,10 0
rect bridge_board_face 63,35,28,8 6
line bridge_wire 77,24 77,34 c0
line board_line1 66,38 88,38 c14
line board_line2 66,40 85,40 c14
rect key_rack 198,42,22,8 0
dots keys 201,47 206,47 211,47 216,47 c14
rect cert_frame 238,40,20,18 0
rect cert_mat 240,42,16,14 7
rect cert_paper 242,44,12,10 15
line cert_txt 244,48 251,48 c0
rect extinguisher_bracket 26,56,6,28 0
rect extinguisher_body 24,60,10,22 4 e0
rect extinguisher_cap 26,57,6,4 8
line ext_nozzle 32,60 35,66 c0
rect pipe_overhead 0,6,320,4 8
line pipe_joint1 80,6 80,10 c0
line pipe_joint2 210,6 210,10 c0
line pipe_joint3 290,6 290,10 c0`,
    cycles: [
      {
        name: "the lamplight",
        areas: ["sconce_glow_in", "light_pool_desk"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ],
    overlays: [{ object: "rubber_stamp", at: [76, 70] }]
  },
  train_deck: {
    version: 1,
    shot: "Looking north along the echoing lower hold towards the bow doors, vanishing point at centre-left; deepnight; harsh ceiling sodium strips cast sharp cyan-blue highlights across steel ribbing and rail crowns; {wagons} and cylindrical {tankers} chained in parallel lines, with deep trackways running north-south, an iron bulkhead with passage east, and a steel vertical {ladder} ascending to the companionway; {rails} running down the floor, heavy {chains} binding the bogies to deck eyelets, and yellow overhead crane {girder} rails; moves: drip from overhead pipe (the drip recipe)",
    draw: `vp 140,52
rect ceiling 0,0,320,38 0
rect bulkhead_far 100,32,80,36 1
poly floor 0,136@1 320,136@1 320,136@0.45 0,136@0.45 1
poly deck_patch1 10,135 120,135 130,85 40,85 0
poly deck_patch2 170,135 310,135 240,80 160,80 0
rect strip_light1 70,10,35,2 14
rect strip_light2 175,10,40,2 14
rect strip_light3 130,16,20,2 14
poly beam_top1 0,0 320,0 220,18 0,14 8
poly beam_top2 0,18 320,18 320,22 0,22 0
poly girder_l 0,12 80,24 80,28 0,18 14
poly girder_r 210,24 320,12 320,18 210,28 14
poly rib_l1 0,18 15,22 15,135 0,135 8
poly rib_l2 45,26 55,28 55,115 45,115 0
poly rib_r1 305,22 320,18 320,135 305,135 8
poly rib_r2 265,28 275,26 275,115 265,115 0
poly track1_l 40,135@1 40,135@0.45 42,135@0.45 42,135@1 3
poly track1_r 68,135@1 68,135@0.45 70,135@0.45 70,135@1 3
poly track2_l 96,135@1 96,135@0.45 98,135@0.45 98,135@1 3
poly track2_r 124,135@1 124,135@0.45 126,135@0.45 126,135@1 3
poly track3_l 154,135@1 154,135@0.45 156,135@0.45 156,135@1 3
poly track3_r 182,135@1 182,135@0.45 184,135@0.45 184,135@1 3
poly track4_l 212,135@1 212,135@0.45 214,135@0.45 214,135@1 3
poly track4_r 240,135@1 240,135@0.45 242,135@0.45 242,135@1 3
line tie_1 20,126 130,126 c0
line tie_2 145,126 260,126 c0
line tie_3 35,112 132,112 c0
line tie_4 146,112 245,112 c0
line tie_5 50,100 134,100 c0
line tie_6 148,100 232,100 c0
line tie_7 65,90 135,90 c0
line tie_8 149,90 220,90 c0
line tie_9 80,82 136,82 c0
line tie_10 150,82 210,82 c0
poly bow_doors 115,36 165,36 165,68 115,68 0
line bow_frame 115,36 115,68 c3
line bow_frame_r 165,36 165,68 c3
line bow_split 140,36 140,68 c8
rect far_tanker 118,50,18,14 8
rect far_wagon 144,48,18,16 0
poly wagon_body 42,42 92,46 92,86 42,82 8
poly wagon_side 42,42 42,82 24,92 24,48 0
rect wagon_trim 46,48,42,32 1
line wagon_strut1 46,48 88,80 c3
line wagon_strut2 46,80 88,48 c3
line wagon_top 42,42 92,46 c3
rect wagon_bogie1 48,84,14,10 0
rect wagon_bogie2 76,86,14,10 0
ellipse wagon_wh1 52,91,4,4 8
ellipse wagon_wh2 84,93,4,4 8
poly tanker_cap 184,40 184,88 174,86 174,42 8
ellipse tanker_front 184,64,6,24 1
poly tanker_body 184,40 248,36 248,84 184,88 8
poly tanker_highlight 184,46 248,42 248,46 184,50 3
poly tanker_shadow 184,78 248,74 248,84 184,88 0
rect tanker_dome 210,32,16,6 0
rect tanker_frame 180,86,70,6 0
rect tanker_bogie1 190,92,16,10 0
rect tanker_bogie2 228,90,16,10 0
ellipse tanker_wh1 196,98,5,5 8
ellipse tanker_wh2 236,96,5,5 8
line chain_1 46,90 32,106 c14
line chain_2 88,94 104,112 c14
line chain_3 186,94 172,112 c14
line chain_4 240,92 258,110 c14
rect east_portal 280,48,30,68 0
line east_arch 280,48 310,48 c3
line east_wall 280,48 280,116 c3
poly east_glow 284,54 306,54 306,116 284,116 1
rect ladder_rail_l 270,16,2,105 7
rect ladder_rail_r 276,16,2,105 7
line rung_1 270,22 278,22 c15
line rung_2 270,32 278,32 c15
line rung_3 270,42 278,42 c15
line rung_4 270,52 278,52 c15
line rung_5 270,62 278,62 c15
line rung_6 270,72 278,72 c15
line rung_7 270,82 278,82 c15
line rung_8 270,92 278,92 c15
line rung_9 270,102 278,102 c15
line rung_10 270,112 278,112 c15
rect pipe_top 0,16,140,3 8
rect pipe_joint 110,15,4,5 0
line pipe_sheen 0,17 140,17 c3
ellipse drip_puddle 112,128,6,2 3
ellipse drip_puddle_core 112,128,3,1 11
rect hatch_rim 266,12,16,4 8
rect west_exit_cut 0,60,14,64 0
line west_frame 14,60 14,124 c3
poly shadow_l 0,110 35,110 40,135 0,135 0
poly shadow_r 250,115 320,115 320,135 240,135 0
dots grease_stains 80,122 100,124 160,120 180,126 145,115 152,116 c0`,
    cycles: [],
    overlays: [],
    loops: [
      {
        name: "the drip",
        at: [108, 19],
        ms: 380,
        style: "loop",
        frames: [
          [
            "....b....",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            "........."
          ],
          [
            "....b....",
            "....9....",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            "........."
          ],
          [
            "....9....",
            "....b....",
            "....f....",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            "........."
          ],
          [
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            "....9....",
            "....b....",
            "....f....",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            "........."
          ],
          [
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            "..b...b..",
            "...9.9...",
            "....f....",
            "........."
          ],
          [
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".bb...bb.",
            ".........",
            "........."
          ]
        ]
      }
    ]
  },
  cargo_van: {
    version: 1,
    shot: "Eye-level interior facing north inside the refrigerated van, vanishing point at (110, 68); institution; cold overhead industrial tube light casting grey tones across ribbed zinc panels; forward bulkhead with {coils} on the left third, frosty ceiling above, ribbed deck below, right wing showing the open sliding doorway out to the east; dressing includes cold floor grating, {frost} rime along structural ribs, and an electrical {junction_box}; moves: compressor frost indicator (a faulty neon sign tube: flicker)",
    draw: `rect bg 0,0,320,136 8
vp 110,68
poly ceiling 0,0 320,0 220,40@0.2 0,40@0.2 7
poly bulk_fwd 0,32 220,32 220,95 0,95 8
poly deck 0,95 220,95 240,136 0,136 8
poly wall_w 0,0 35,28 35,102 0,136 8
poly wall_e 220,32 250,0 250,136 220,95 7
rect door_gap 250,10,70,126 0
rect ext_deck 252,18,68,118 1
line ext_rail 252,110 320,110 c8
line ext_rail2 252,118 320,118 c0
rect ceil_panel1 40,8,160,18 7 e8
rect ceil_panel2 40,28,160,6 8
rect frost_rim1 38,6,164,2 15
rect frost_rim2 42,34,156,2 15
rect rib_w1 35,28,4,74 7
rect rib_w2 12,12,6,110 8
line rib_l1 35,28 35,102 c0
line rib_l2 39,28 39,102 c15
line rib_l3 12,12 12,122 c0
line rib_l4 18,12 18,122 c15
poly fwd_panel_l 35,32 125,32 125,95 35,95 7
poly fwd_panel_r 125,32 220,32 220,95 125,95 8
line seam_fwd 125,32 125,95 c0
rect coils_casing 50,42,65,48 0
rect coils_face 52,44,61,44 8
rect coils_grill 55,47,55,38 0
rect coils_fin1 56,49,53,2 7
rect coils_fin2 56,53,53,2 7
rect coils_fin3 56,57,53,2 7
rect coils_fin4 56,61,53,2 7
rect coils_fin5 56,65,53,2 7
rect coils_fin6 56,69,53,2 7
rect coils_fin7 56,73,53,2 7
rect coils_fin8 56,77,53,2 7
rect coils_pipe_l 46,60,6,18 7
rect coils_pipe_t 46,58,20,4 7
line frost_c1 52,43 113,43 c15
dots frost_c2 53,44 57,44 65,44 88,44 102,44 111,44 c15
rect jbox 140,50,14,20 0
rect jbox_face 141,51,12,18 7
line jbox_pipe 147,32 147,50 c8
rect jbox_latch 141,58,3,4 8
rect tube_fix1 100,12,40,4 0
rect tube_light 102,14,36,2 15
rect tube_glow 95,10,50,8 mix:7,15@0.5
line frost_fwd1 35,32 220,32 c15
line frost_fwd2 36,33 130,33 c15
dots frost_drop 45,34 50,35 72,34 91,35 110,34 160,34 185,35 c15
poly deck_rib1 0,98 220,98 222,101 0,101 7
poly deck_rib2 0,104 223,104 225,107 0,107 7
poly deck_rib3 0,111 227,111 230,115 0,115 7
poly deck_rib4 0,119 232,119 235,124 0,124 7
poly deck_rib5 0,128 238,128 240,134 0,134 7
line deck_groove1 0,101 222,101 c0
line deck_groove2 0,107 225,107 c0
line deck_groove3 0,115 230,115 c0
line deck_groove4 0,124 235,124 c0
line deck_groove5 0,134 240,134 c0
poly door_track_t 218,28 320,10 320,16 218,34 0
poly door_track_b 218,92 320,92 320,98 218,98 0
poly door_leaf 280,14 316,8 316,134 280,134 7
rect door_edge 280,14,4,120 8
line door_seam 282,14 282,134 c0
rect door_hasp 281,72,3,10 0
rect door_handle 282,68,2,18 15
rect frost_patch1 160,42,22,10 15
rect frost_patch2 175,48,16,14 15
rect frost_patch3 158,50,14,8 7
poly frost_corner 0,0 25,0 12,18 0,12 15
poly frost_corner2 205,32 220,32 220,48 212,42 15
line deck_diag1 20,136 60,95 c0
line deck_diag2 70,136 110,95 c0
line deck_diag3 120,136 160,95 c0
line deck_diag4 170,136 210,95 c0
rect vent_box 180,68,28,18 0
rect vent_inner 182,70,24,14 8
line vent_s1 184,74 204,74 c0
line vent_s2 184,78 204,78 c0
line vent_s3 184,82 204,82 c0
line coil_ind_glow 104,45 110,45 c2
line coil_ind_tube 105,45 109,45 c10`,
    cycles: [
      {
        name: "compressor frost indicator",
        areas: ["coil_ind_tube"],
        colors: [10, 2],
        style: "flicker",
        ms: [800, 3500]
      }
    ],
    overlays: [{ object: "lead_wire_seal", at: [184, 112] }]
  },
  engine_casing: {
    version: 1,
    shot: "Eye-level facing north, vanishing point on the right third; ember; warm incandescent work-lamps throwing hard amber and red down into the casing; massive twin diesel crankcases at columns 80-200 with heavy bolted plates, ribbed manifolds, high-pressure {piping}, steel safety {railings} along a shaking {catwalk}, and an access {ladder} leading west; overhead ducting, oil pans below, hanging {cables}, bulkheads flanking both wings; moves: oil vapor heat glints (the sparkle recipe: a sparkle)",
    draw: `rect bg 0,0,320,136 0
rect roof_duct 0,0,320,18 8
line duct_seam1 0,18 320,18 c0
line duct_seam2 0,6 320,6 c7
rect duct_plate1 40,2,35,14 7
rect duct_plate2 150,2,40,14 7
rect duct_plate3 245,2,30,14 7
line duct_b1 40,2 40,16 c0
line duct_b2 75,2 75,16 c0
line duct_b3 150,2 150,16 c0
line duct_b4 190,2 190,16 c0
line duct_b5 245,2 245,16 c0
line duct_b6 275,2 275,16 c0
rect back_wall 0,18,320,54 4
poly wall_shade 0,18 320,18 320,32 0,26 0
rect rib_l1 12,18,6,54 0
rect rib_l2 38,18,6,54 0
rect rib_r1 270,18,6,54 0
rect rib_r2 300,18,6,54 0
line rib_hi1 18,18 18,72 c4
line rib_hi2 44,18 44,72 c4
line rib_hi3 276,18 276,72 c4
line rib_hi4 306,18 306,72 c4
rect mach_pit 0,72,320,64 0
rect pit_glow 50,72,220,12 4
rect pit_core 75,74,170,6 12
rect eng1_base 68,36,76,52 8
rect eng1_top 72,28,68,10 7
line eng1_top_hi 72,28 140,28 c15
rect eng1_rib1 82,38,8,46 0
rect eng1_rib2 102,38,8,46 0
rect eng1_rib3 122,38,8,46 0
rect eng1_plate1 76,46,58,6 12
rect eng1_plate2 76,64,58,6 4
line eng1_bolt1 78,49 132,49 c14
line eng1_bolt2 78,67 132,67 c14
rect eng2_base 156,34,80,56 8
rect eng2_top 160,26,72,10 7
line eng2_top_hi 160,26 232,26 c15
rect eng2_rib1 170,36,8,50 0
rect eng2_rib2 192,36,8,50 0
rect eng2_rib3 214,36,8,50 0
rect eng2_plate1 166,44,62,6 12
rect eng2_plate2 166,62,62,6 4
line eng2_bolt1 168,47 226,47 c14
line eng2_bolt2 168,65 226,65 c14
rect piping 0,24,320,6 7
line pipe_shad 0,30 320,30 c0
line pipe_hi 0,24 320,24 c15
poly pipe_v1 88,18 94,18 94,36 88,36 8
poly pipe_v2 178,18 184,18 184,34 178,34 8
poly pipe_v3 226,18 232,18 232,34 226,34 8
rect pipe_flange1 86,22,10,3 12
rect pipe_flange2 176,22,10,3 12
rect pipe_flange3 224,22,10,3 12
line cables 0,16 64,28 c0
line cable_hi 0,17 64,29 c4
line cables2 210,16 320,26 c0
poly catwalk 0,84 320,84 320,102 0,102 8
rect grate_strip1 0,86,320,2 0
rect grate_strip2 0,90,320,2 0
rect grate_strip3 0,94,320,2 0
rect grate_strip4 0,98,320,2 0
line catwalk_edge 0,102 320,102 c12
line catwalk_shade 0,103 320,103 c0
poly catwalk_lower 0,104 320,104 320,136 0,136 4
rect lower_brace1 45,104,8,32 0
rect lower_brace2 135,104,8,32 0
rect lower_brace3 225,104,8,32 0
rect lower_brace4 295,104,8,32 0
line brace_hi1 45,104 45,136 c12
line brace_hi2 135,104 135,136 c12
line brace_hi3 225,104 225,136 c12
line brace_hi4 295,104 295,136 c12
rect railings 0,62,320,2 14
line rail_mid 0,72 320,72 c12
line rail_toe 0,82 320,82 c4
rect post1 24,62,3,22 14
rect post2 84,62,3,22 14
rect post3 144,62,3,22 14
rect post4 204,62,3,22 14
rect post5 264,62,3,22 14
rect ladder 6,56,12,80 8
line lad_rail1 6,56 6,136 c12
line lad_rail2 18,56 18,136 c12
line lad_r1 6,66 18,66 c14
line lad_r2 6,76 18,76 c14
line lad_r3 6,86 18,86 c14
line lad_r4 6,96 18,96 c14
line lad_r5 6,106 18,106 c14
line lad_r6 6,116 18,116 c14
line lad_r7 6,126 18,126 c14
ellipse lamp_glow1 110,26,16,8 4
ellipse lamp_core1 110,26,8,4 12
rect lamp_bulb1 108,24,4,3 14
ellipse lamp_glow2 200,24,16,8 4
ellipse lamp_core2 200,24,8,4 12
rect lamp_bulb2 198,22,4,3 14
rect oil_can 250,88,12,12 8
rect can_spout 258,84,3,4 7
line can_hi 250,88 250,100 c12
dots sp_core 115,88 116,88 114,88 115,87 115,89 c8
dots sp_mid 114,87 116,87 114,89 116,89 115,86 115,90 113,88 117,88 c8
dots sp_tips 111,88 112,88 118,88 119,88 115,85 115,91 c8`,
    cycles: [
      {
        name: "heat glint",
        areas: ["sp_core", "sp_mid", "sp_tips"],
        colors: [15, 15, 14, 8],
        rest: 46,
        style: "rotate",
        sweep: true,
        ms: 110
      }
    ],
    overlays: [{ object: "grease_cloth", at: [168, 88] }]
  },
  ballast_hold: {
    version: 1,
    shot: "eye level facing north, looking forward along the keel frame; cellar; low cold industrial floodlight; the dark bilge water and central keel girder in the middle columns, heavy steel bulkheads in the wings; {ribs} spanning the void, {bilge} water filling the lowest floor, a vertical steel {ladder} ascending to the hatch; moves: the surface glints on the bilge (the shimmer recipe: a pingpong)",
    draw: `vp 160,54
rect sky_dark 0,0,320,136 0
rect ceiling 0,0,320,38 8
poly ceil_rib1 0,0 320,0 300,14 20,14 0
poly ceil_rib2 20,14 300,14 280,26 40,26 8
poly ceil_rib3 40,26 280,26 260,36 60,36 0
line ceil_pipe1 0,18 320,18 c7
line ceil_pipe2 0,22 320,22 c8
poly wall_l 0,38 68,54 68,96 0,118 8
poly wall_r 320,38 252,54 252,96 320,118 8
poly rib_l1 0,38 24,42 24,112 0,118 0
poly rib_l2 44,48 56,51 56,102 44,107 0
poly rib_r1 320,38 296,42 296,112 320,118 0
poly rib_r2 276,48 264,51 264,102 276,107 0
rect bulkhead_far 68,54,184,42 1
poly floor_band1 68,96 252,96 280,114 40,114 8
poly floor_band2 40,114 280,114 320,136 0,136 6
rect hatch_frame 144,38,32,48 0
rect hatch_back 147,41,26,42 8
poly keel_center 152,96 168,96 174,136 146,136 6
line keel_seam 160,96 160,136 c0
rect keel_flange_l 146,132,14,4 0
rect keel_flange_r 160,132,14,4 0
rect rib_cross1 68,94,184,3 0
rect rib_cross2 54,104,212,4 0
rect rib_cross3 36,118,248,5 0
poly bilge_water_far 68,90 252,90 260,102 60,102 1
poly bilge_water_mid 60,102 260,102 284,120 36,120 1
poly bilge_water_fore 36,120 284,120 320,136 0,136 0
poly water_patch1 80,94 130,94 126,100 84,100 8
poly water_patch2 190,94 240,94 236,100 194,100 8
poly water_patch3 48,106 120,106 114,116 44,116 1
poly water_patch4 200,106 272,106 268,116 196,116 1
poly water_refl 148,96 172,96 176,126 144,126 6
line ladder_rail_l 150,42 150,134 c7
line ladder_rail_r 170,42 170,134 c7
line rung01 150,46 170,46 c7
line rung02 150,53 170,53 c7
line rung03 150,60 170,60 c7
line rung04 150,67 170,67 c7
line rung05 150,74 170,74 c7
line rung06 150,81 170,81 c7
line rung07 150,88 170,88 c7
line rung08 150,95 170,95 c7
line rung09 150,102 170,102 c7
line rung10 150,109 170,109 c7
line rung11 150,116 170,116 c7
line rung12 150,123 170,123 c7
line rung13 150,130 170,130 c7
line rung_shadow01 150,47 170,47 c0
line rung_shadow02 150,54 170,54 c0
line rung_shadow03 150,61 170,61 c0
line rung_shadow04 150,68 170,68 c0
line rung_shadow05 150,75 170,75 c0
line rung_shadow06 150,82 170,82 c0
line rung_shadow07 150,89 170,89 c0
line rung_shadow08 150,96 170,96 c0
line rung_shadow09 150,103 170,103 c0
line rung_shadow10 150,110 170,110 c0
line rung_shadow11 150,117 170,117 c0
line rung_shadow12 150,124 170,124 c0
line rung_shadow13 150,131 170,131 c0
rect cage_lamp 157,36,6,8 6
rect cage_bulb 159,38,2,4 14
rect cage_guard 158,37,4,6 none e0
ellipse light_cast 160,54,28,16 6
ellipse light_center 160,52,14,8 14
rect plate_rust1 84,62,18,6 6
rect plate_rust2 216,66,22,8 6
rect plate_rust3 108,76,32,4 6
rect plate_rust4 182,74,26,5 6
line rivet_l1 72,58 72,88 c0
line rivet_l2 140,58 140,88 c0
line rivet_r1 180,58 180,88 c0
line rivet_r2 248,58 248,88 c0
dots rust_spots 92,64 124,78 200,70 230,68 c4
line rust_drip1 92,65 92,72 c4
line rust_drip2 226,70 226,79 c4
line rust_edge_l 0,117 68,95 c6
line rust_edge_r 320,117 252,95 c6
line wshimmer1 98,96 102,96 c14
line wshimmer2 106,98 110,98 c6
line wshimmer3 120,95 123,95 c14
line wshimmer4 196,96 200,96 c6
line wshimmer5 208,98 212,98 c14
line wshimmer6 218,95 221,95 c6
line wshimmer7 74,108 79,108 c14
line wshimmer8 88,112 94,112 c6
line wshimmer9 104,110 108,110 c14
line wshimmer10 212,110 216,110 c6
line wshimmer11 230,112 236,112 c14
line wshimmer12 244,108 249,108 c6
line wshimmer13 52,124 59,124 c14
line wshimmer14 80,128 88,128 c6
line wshimmer15 232,128 240,128 c14
line wshimmer16 262,124 269,124 c6
line keel_light1 146,104 146,132 c14
line keel_light2 174,104 174,132 c8
line brace_l1 20,44 68,76 c0
line brace_r1 300,44 252,76 c0`,
    cycles: [
      {
        name: "the shimmer",
        areas: [
          "wshimmer1",
          "wshimmer2",
          "wshimmer3",
          "wshimmer4",
          "wshimmer5",
          "wshimmer6",
          "wshimmer7",
          "wshimmer8",
          "wshimmer9",
          "wshimmer10",
          "wshimmer11",
          "wshimmer12",
          "wshimmer13",
          "wshimmer14",
          "wshimmer15",
          "wshimmer16"
        ],
        colors: [15, 14, 6],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    overlays: []
  }
};

export const endings = {
  pass_inspection_ending: {
    version: 1,
    shot: "Eye level, north; deepnight; harsh fluorescent light; {Brandt} in profile at column 107 holding the stamped {manifest} up toward a ceiling tube, plastic {chairs} bolted in rows, portholes to the black sound in the right wing, companionway bulkhead in the left wing; {tube} overhead, bolted {table}, deck plates; moves: tube flicker (faulty sign recipe: a flicker).",
    draw: `rect bg 0,0,320,136 0
rect ceiling 0,0,320,24 8
rect deck 0,96,320,40 1
poly deck_far 0,84 320,84 320,96 0,96 8
rect bulk_back 0,24,320,60 1
rect bulk_stripe 0,54,320,6 0
poly deck_plates1 0,112 320,112 320,114 0,114 0
poly deck_plates2 0,126 320,126 320,128 0,128 0
rect bulkhead_left 0,20,46,116 8
rect doorway_comp 12,34,26,76 0
line comp_edge 11,33 38,33 38,110 11,110 c8
rect door_frame 10,32,2,80 7
rect beam_top 0,20,320,4 0
rect beam_corn 46,20,4,80 0
rect beam_right 268,20,4,80 0
rect bulk_win 272,20,48,116 8
rect port1 280,36,24,24 0
ellipse port_glass1 292,48,10,10 1
rect port2 280,72,24,24 0
line port_rim1 282,38 302,38 302,58 282,58 c7
line port_rim2 282,74 302,74 302,94 282,94 c7
rect tube_mount 88,14,72,4 0
rect tube_glow 80,18,88,6 3
rect tube 90,16,68,2 15
rect tube_flick 90,18,68,1 11
rect light_pool_deck 70,88,120,48 3
rect light_pool_core 85,96,90,32 11
poly shade_brandt 100,122 144,122 136,128 92,128 0
poly brandt_legs 104,82 116,82 114,122 102,122 0
poly brandt_coat 96,44 120,42 122,86 92,84 0
poly brandt_collar 100,40 114,38 116,46 98,46 8
ellipse brandt_head 106,32,7,8 7
rect brandt_cap 100,24,14,5 0
rect brandt_visor 108,28,10,2 0
poly brandt_arm_r 114,46 128,34 132,38 118,52 0
rect brandt_hand 128,32,4,4 7
rect manifest 126,22,12,14 15
rect manifest_carbon 128,24,8,10 3
line manifest_pencil 130,30 134,26 c5
rect brandt_arm_l 100,48,108,72 0
poly chair_row1_back 170,58 190,58 188,78 168,78 3
rect chair_row1_seat 166,78,26,6 1
poly chair_row1_leg1 172,84 174,84 174,102 172,102 0
poly chair_row1_leg2 184,84 186,84 186,102 184,102 0
poly chair_row2_back 204,58 224,58 222,78 202,78 3
rect chair_row2_seat 200,78,26,6 1
poly chair_row2_leg1 206,84 208,84 208,102 206,102 0
poly chair_row2_leg2 218,84 220,84 220,102 218,102 0
poly chair_row3_back 238,58 258,58 256,78 236,78 3
rect chair_row3_seat 234,78,26,6 1
poly chair_row3_leg1 240,84 242,84 242,102 240,102 0
poly chair_row3_leg2 252,84 254,84 254,102 252,102 0
rect table_top 160,82,90,4 8
poly table_leg1 170,86 172,86 172,108 170,108 0
poly table_leg2 238,86 240,86 240,108 238,108 0
rect table_brace 170,96,70,2 0
poly pass_transit 182,80 194,80 194,82 182,82 14
poly pass_clip 180,81 182,81 182,82 180,82 7
rect rib_wall1 84,24,2,60 0
rect rib_wall2 148,24,2,60 0
rect rib_wall3 212,24,2,60 0
line pipe_top 0,26 320,26 c7
line pipe_top_shadow 0,27 320,27 c0
rect vent_grille 54,32,20,10 0
line vent_slot1 56,34 72,34 c8
line vent_slot2 56,37 72,37 c8
line vent_slot3 56,40 72,40 c8
line deck_joint1 46,96 46,136 c0
line deck_joint2 150,96 150,136 c0
line deck_joint3 268,96 268,136 c0
outline brandt e0`,
    cycles: [
      { name: "tube flicker", areas: ["tube_flick"], colors: [11, 3], style: "flicker", ms: [800, 4000] }
    ],
    loops: []
  },
  drown_ending: {
    version: 1,
    shot: "Eye level, looking down and south-east over the vessel's counter; moonlight; cold night sky and churning foam under the moon; the {wake} on the middle columns with churning foam and surging dark water, the hull plates and {rail} in the left wing, open sea in the right wing; the steel counter plates, {stanchions}, and safety {mesh}; moves: the wake foam (shimmer: a pingpong).",
    draw: `rect sky 0,0,320,42 0
rect sea_bg 0,42,320,94 1
poly sea_dark 0,42 320,42 320,70 0,65 0
poly sea_mid 0,65 320,70 320,95 0,90 1
poly sea_deep 0,90 320,95 320,136 0,136 0
ellipse moon 260,18,7,7 15
rect cloud1 220,24,55,2 1
rect cloud2 240,28,40,1 1
poly wake_mass 90,52 230,52 280,136 40,136 1
poly wake_mid 105,54 215,54 260,136 60,136 9
poly wake_core 120,58 200,58 240,136 80,136 11
poly wake_crest1 125,62 195,62 205,72 115,72 15
poly wake_crest2 110,76 210,76 225,92 95,92 15
poly wake_crest3 90,96 230,96 250,118 70,118 15
poly wake_crest4 75,120 255,120 270,136 50,136 15
poly foam_patch1 130,66 185,68 180,71 135,70 11
poly foam_patch2 115,82 205,82 195,88 120,87 9
poly foam_patch3 100,102 220,104 210,112 110,110 11
poly foam_patch4 85,124 240,125 230,133 95,132 9
line gl1 140,60 144,60 c15
line gl2 170,61 175,61 c15
line gl3 130,70 135,70 c11
line gl4 180,72 184,72 c15
line gl5 122,80 128,80 c15
line gl6 190,83 196,83 c11
line gl7 145,86 152,86 c15
line gl8 165,88 171,88 c9
line gl9 110,98 116,98 c15
line gl10 198,100 205,100 c15
line gl11 135,105 142,105 c11
line gl12 175,107 182,107 c15
line gl13 95,115 102,115 c15
line gl14 212,116 220,116 c9
line gl15 125,122 133,122 c15
line gl16 185,123 193,123 c11
line gl17 80,128 88,128 c15
line gl18 225,130 234,130 c15
line wave_r1 250,55 275,55 c11
line wave_r2 260,65 295,65 c9
line wave_r3 245,78 280,78 c11
line wave_r4 270,92 310,92 c9
line wave_r5 255,110 300,110 c11
line wave_r6 280,126 318,126 c9
line wave_l1 45,58 75,58 c11
line wave_l2 25,72 60,72 c9
line wave_l3 15,88 45,88 c11
poly hull_edge 0,0 82,0 35,136 0,136 0
poly hull_lit 72,0 80,0 33,136 28,136 8
line hull_seam1 0,35 68,35 c8
line hull_seam2 0,75 53,75 c8
line hull_seam3 0,115 38,115 c8
rect deck_lip 0,0,84,8 8
rect deck_top 0,0,84,2 7
line stanchion1 15,0 15,50 c7
line stanchion1_sh 16,0 16,50 c0
line stanchion2 48,0 48,68 c7
line stanchion2_sh 49,0 49,68 c0
line stanchion3 78,0 78,92 c7
line stanchion3_sh 79,0 79,92 c0
line rail_top 0,8 85,8 c15
line rail_top_b 0,9 85,9 c7
line rail_mid 0,26 82,26 c7
line rail_low 0,44 79,44 c7
line mesh_diag1 5,8 25,44 c8
line mesh_diag2 20,8 40,44 c8
line mesh_diag3 35,8 55,44 c8
line mesh_diag4 50,8 70,44 c8
line mesh_diag5 65,8 80,44 c8
line mesh_diag6 25,8 5,44 c8
line mesh_diag7 40,8 20,44 c8
line mesh_diag8 55,8 35,44 c8
line mesh_diag9 70,8 50,44 c8
poly figure_torso 70,68 82,65 92,88 78,92 0
poly figure_legs 80,90 92,88 108,112 96,118 0
poly figure_feet 104,112 118,124 112,128 98,118 0
ellipse figure_head 74,62,5,5 0
line string_hum 82,82 112,118 c11`,
    cycles: [
      {
        name: "the shimmer",
        areas: [
          "gl1",
          "gl2",
          "gl3",
          "gl4",
          "gl5",
          "gl6",
          "gl7",
          "gl8",
          "gl9",
          "gl10",
          "gl11",
          "gl12",
          "gl13",
          "gl14",
          "gl15",
          "gl16",
          "gl17",
          "gl18"
        ],
        colors: [15, 11, 9],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    loops: []
  }
};
