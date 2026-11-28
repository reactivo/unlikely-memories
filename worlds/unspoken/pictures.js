// Pictures for "Ferry of the Unspoken" (shared by the world's languages): one per room (13) and one per ending (2), as the world's AI drew them in the short notation
// (BRIEF.md §7); the poster of its page (cover) and its box art. Written by tools/world.mjs add from the hand-in.

export default {
  storage_locker: {
    version: 1,
    shot: "Eye-level facing north inside the cramped steel space, vanishing point at 160,66; deepnight; harsh single overhead ceiling bulkhead lamp casting a downward cyan glare over deep blue and black ribbing; the heavy steel {locker door} filling the north exit at centre, the left wing filled with upright structural ribs, the right wing with a steel {shelf} holding rolled {canvas} and an oil {drum}; dressing includes structural ribs, deck plates, {conduit}, deck seams, the overhead {lamp}; moves: the bulkhead lamp filament (a candle: a flicker).",
    draw: `vp 160,66
rect bk_back 0,0,320,136 0
poly wall_left 0,0 88,38 88,96 0,136 fade:0,1/0,0/88,50
poly wall_right 320,0 232,38 232,96 320,136 fade:0,1/320,0/232,50
poly ceiling 0,0 320,0 232,38 88,38 fade:0,1/160,0/160,38
poly deck 0,136 320,136 232,96 88,96 fade:1,3/160,136/160,96
rect back_recess 88,38,144,58 1
poly deck_patch 108,96 212,96 232,136 88,136 mix:,3@0.35
line rib_l1 18,0 18,136 c0
line rib_l2 38,0 38,136 c1
line rib_l3 58,0 58,136 c0
line rib_l4 74,0 74,136 c1
line rib_r1 302,0 302,136 c0
line rib_r2 282,0 282,136 c1
line rib_r3 262,0 262,136 c0
line rib_r4 246,0 246,136 c1
rect bulkhead_frame 104,36,112,62 0
rect frame_inner 108,38,104,58 1
rect locker_door 112,40,96,56 1 e0
line door_seam1 112,68 208,68 c0
line door_brace_v 160,40 160,96 c0
rect dog_handle 198,64,6,8 0
rect dog_center 200,66,2,4 3
line seam_floor1 110,98 60,136 c0
line seam_floor2 210,98 260,136 c0
line seam_floor3 160,96 160,136 c0
rect conduit_run 0,18,320,3 0
line conduit_core 0,19 320,19 c1
rect shelf_board 236,74,84,4 0
poly shelf_top 236,74 320,68 320,72 236,76 1
line shelf_bracket1 254,78 254,92 c0
line shelf_bracket2 294,78 294,92 c0
poly canvas_roll 252,66 288,62 290,74 254,74 1 e0
ellipse canvas_end 252,70,3,4 3
poly drum_body 278,92 316,84 316,130 278,136 0
ellipse drum_top 297,88,18,5 1 e0
line drum_rim 278,110 316,104 c1
rect bench_left 0,84,54,42 0
poly bench_top 0,84 54,78 62,84 0,90 1 e0
rect overhead_bracket 152,30,16,4 0
ellipse lamp_housing 160,34,10,4 0
ellipse lamp_halo3 160,38,28,14 mix:,3@0.1
ellipse lamp_halo2 160,38,18,9 mix:,3@0.25
ellipse lamp_halo1 160,37,10,5 3
ellipse lamp_bulb 160,36,4,2 14
rect lamp_tip_l 159,35,2,2 14
rect lamp_tip_r 161,35,2,2 3
rect shadow_bench 0,126,64,10 mix:,0@0.7
rect shadow_drum 270,128,50,8 mix:,0@0.7`,
    cycles: [
      {
        name: "the filament",
        areas: ["lamp_tip_l", "lamp_tip_r"],
        colors: [14, 3],
        style: "flicker",
        ms: [500, 1600]
      }
    ],
    overlays: [{ object: "pocket_radio", at: [20, 72] }, { object: "brass_wedge", at: [266, 60] }]
  },
  vehicle_deck: {
    version: 1,
    shot: "Looking north along the vehicle deck from eye level, vanishing point at (160, 56); gaslight, haze; sodium vapor down-light from overhead conduits; the massive hull of a tied-down {lorry} dominating the right wing (165-270) with heavy steel {turnbuckles} angled to the ribbed steel deck; the left wing holding bulkheads and structural ribs; dressing of overhead steel {conduits}, deck {chains}, deck {stanchions}, and exhaust vents; moves: overhead sodium tube hum (candlelamp flicker recipe: a flicker)",
    draw: `vp 160,56
rect deck_base 0,0,320,136 mix:8,0@0.4
rect ceil_zone 0,0,320,56 fade:8,6/160,0/160,56
rect deck_floor 0,56,320,80 fade:6,8/160,56/160,136
poly deck_rib_l 0,136 0,80 148,56 154,56 0,136 mix:8,0@0.5
poly deck_rib_r 320,136 320,80 172,56 166,56 320,136 mix:8,0@0.5
poly bulkhead_l 0,0 60,0 75,56 0,56 8
poly bulkhead_r 320,0 260,0 245,56 320,56 8
line deck_groove_1 160,56 20,136 c0
line deck_groove_2 160,56 60,136 c0
line deck_groove_3 160,56 100,136 c0
line deck_groove_4 160,56 140,136 c0
line deck_groove_5 160,56 180,136 c0
line deck_groove_6 160,56 220,136 c0
line deck_groove_7 160,56 260,136 c0
line deck_groove_8 160,56 300,136 c0
rect far_bulkhead 145,42,30,22 mix:6,0@0.5
rect far_archway 152,46,16,18 0
rect far_opening_glow 154,48,12,16 mix:6,14@0.35
ellipse haze_veil 160,62,140,24 mix:,6@0.25
rect lorry_rear 175,28,85,68 mix:8,0@0.3 e0
rect lorry_canvas 177,30,81,38 8
poly lorry_flap 177,48 258,48 256,66 179,66 mix:6,8@0.4 e0
rect lorry_chassis 180,68,76,20 0
rect lorry_bumper 176,86,84,6 8 e0
line lorry_seam 218,30 218,66 c0
rect lorry_mudguard_l 182,78,16,14 0
rect lorry_wheel_l 184,82,12,16 0
rect lorry_mudguard_r 242,78,16,14 0
rect lorry_wheel_r 244,82,12,16 0
line lorry_tie_bar 185,88 255,88 c6
line turnbuckles 184,88 152,118 c0
line turnbuckle_core 166,101 170,105 c6
line turnbuckle_body 167,100 171,104 c7
line turnbuckles_r 256,88 288,118 c0
line turnbuckle_core_r 270,101 274,105 c6
line turnbuckle_body_r 271,100 275,104 c7
rect pallet_l 25,85,42,22 mix:6,0@0.5 e0
line pallet_plank_1 25,92 67,92 c0
line pallet_plank_2 25,99 67,99 c0
rect crate_on_pallet 28,68,36,20 6 e0
line crate_x1 28,68 64,88 c0
line crate_x2 28,88 64,68 c0
rect conduit_main 40,8,240,4 0
rect conduit_drop_1 95,12,2,14 0
rect conduit_drop_2 160,12,2,14 0
rect conduit_drop_3 225,12,2,14 0
ellipse lamp_halo_far 160,26,16,8 mix:,14@0.35
ellipse lamp_halo_mid 95,28,26,12 mix:,14@0.35
ellipse lamp_halo_near 225,28,24,11 mix:,14@0.35
rect lamp_housing_1 90,24,10,3 0
rect lamp_housing_2 156,24,8,3 0
rect lamp_housing_3 220,24,10,3 0
rect sodium_tube_1 92,26,6,2 14
rect sodium_tube_2 157,26,6,2 14
rect sodium_tube_3 222,26,6,2 14
line chains_deck 35,110 50,116 c0
line chains_deck_link 38,112 47,115 c8
rect stanchions_base 80,95,8,4 0
rect stanchions_pole 83,45,2,52 8
poly lorry_shadow 168,90 268,90 285,105 150,105 mix:,0@0.7`,
    cycles: [
      {
        name: "sodium tube hum",
        areas: ["sodium_tube_1", "sodium_tube_2", "sodium_tube_3"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ],
    overlays: [{ object: "inspector_vane", at: [125, 118], tall: 62 }]
  },
  cargo_hold: {
    version: 1,
    shot: "Eye-level interior facing north, vanishing point at (110, 68); cellar; single overhead caged inspection bulb casting warm pools against damp cold steel hull; subject is an iron {ladder} descending through a deck hatchway at columns 100-128, flanked by stacked wooden {crates} filling the west wing and steel ballast {drums} filling the east wing; dressing includes exposed weeping {ribs} along the bulkhead and deck plating {seams}; moves: water weeping along the wet steel hull frames (the running water recipe: a scroll).",
    draw: `vp 110,68
rect bg 0,0,320,136 0
poly hull_wall 0,0 320,0 320,90 0,90 fade:0,8/110,0/110,90
poly deck_floor 0,90 320,90 320,136 0,136 fade:8,0/110,90/110,145
poly bulb_glow 70,10 150,10 180,100 40,100 mix:,14@0.25
ellipse bulb_halo 110,32,26,14 mix:,14@0.35
ellipse bulb_core 110,32,3,3 15
line bulb_cord 110,0 110,30 c0
rect cage_frame 106,30,8,6 none e8
poly rib_1 30,0 36,0 36,90 30,90 8 e0
poly rib_2 72,0 76,0 76,90 72,90 8 e0
poly rib_3 150,0 154,0 154,90 150,90 8 e0
poly rib_4 196,0 200,0 200,90 196,90 8 e0
poly rib_5 248,0 254,0 254,90 248,90 8 e0
poly rib_6 295,0 302,0 302,90 295,90 8 e0
rect weep_body 197,15,2,65 1
poly weep_r1 197,22 199,22 199,24 197,24 mix:1,9@0.5
poly weep_r2 197,38 199,38 199,41 197,41 mix:1,9@0.75
poly weep_r3 197,55 199,55 199,57 197,57 mix:1,9@0.25
poly weep_r4 197,68 199,68 199,70 197,70 9
rect crate_stack_w1 0,35,48,101 6 e0
rect crate_plank_w1 0,55,48,2 0
rect crate_plank_w2 0,78,48,2 0
rect crate_plank_w3 0,102,48,2 0
line crate_diag_w1 0,35 48,78 c0
line crate_diag_w2 0,78 48,136 c0
rect crate_stack_w2 44,52,46,72 6 e0
rect crate_w2_top 44,52,46,3 14
rect crate_w2_plank1 44,76,46,2 0
rect crate_w2_plank2 44,100,46,2 0
line crate_w2_brace 44,52 90,100 c0
line crate_gap_shadow 90,55 90,124 c0
rect drum_e1 216,62,32,54 8 e0
ellipse drum_e1_top 232,62,16,5 7
ellipse drum_e1_rim 232,62,16,5 none e0
line drum_e1_rib1 216,78 248,78 c0
line drum_e1_rib2 216,98 248,98 c0
rect drum_e2 244,56,34,64 1 e0
ellipse drum_e2_top 261,56,17,5 9
ellipse drum_e2_rim 261,56,17,5 none e0
line drum_e2_rib1 244,74 278,74 c0
line drum_e2_rib2 244,96 278,96 c0
rect drum_e3 274,48,44,78 8 e0
ellipse drum_e3_top 296,48,22,6 7
ellipse drum_e3_rim 296,48,22,6 none e0
line drum_e3_rib1 274,70 318,70 c0
line drum_e3_rib2 274,96 318,96 c0
poly hatch_hole 98,96 128,96 132,118 94,118 0 e8
poly hatch_coaming 96,95 130,95 135,119 92,119 none e7
poly hatch_lip_shade 94,118 132,118 135,121 92,121 8
line ladder_rail_l 104,82 100,128 c7
line ladder_rail_r 122,82 118,128 c7
line ladder_rung_1 104,86 122,86 c15
line ladder_rung_2 103,94 121,94 c15
line ladder_rung_3 102,102 120,102 c15
line ladder_rung_4 101,110 119,110 c15
line ladder_rung_5 100,118 118,118 c15
line ladder_rung_6 99,126 117,126 c15
line deck_seam_1 0,106 94,106 c0
line deck_seam_2 135,106 216,106 c0
line deck_seam_3 0,122 92,122 c0
line deck_seam_4 135,122 320,122 c0
poly pool_light 92,100 138,100 146,126 84,126 mix:,14@0.2`,
    cycles: [
      {
        name: "the weep",
        areas: ["weep_body", "weep_r1", "weep_r2", "weep_r3", "weep_r4"],
        style: "scroll",
        dir: "down",
        ms: 90
      }
    ],
    overlays: []
  },
  back_room: {
    version: 1,
    shot: "eye-level one-point perspective facing north, vanishing point at (110, 56); deepnight; cold cyan bulkhead spill from the cargo hold to the east fading across floorplates into dense blue-black shadow, two large dithered gradients: receding steel deck fading from bright cyan spill to dark blue, and back bulkhead receding into shadow; steel {desk} bolted to floor at left, tall stacked wooden shipping pallets filling the west wing and framing the recess, dead overhead inspection lamp housing above; dressing includes bolted floor brackets, ribbed conduit, junction box, steel rivets, wall ribs; moves: amber indicator glint on distant junction box (the a sparkle recipe: a sparkle)",
    draw: `vp 110,56
rect back_wall 0,0,320,80 fade:0,1/320,0/0,0
rect ceiling 0,0,320,24 mix:1,0@0.6
poly deck 0,80 320,80 320,136 0,136 fade:1,3/0,80/320,136
poly deck_shadow 0,80 180,80 140,136 0,136 mix:,0@0.6
rect rib_l1 18,0,8,80 0
rect rib_l2 44,0,6,80 mix:1,0@0.5
rect rib_c1 112,0,6,80 1
rect rib_c2 176,0,8,80 mix:1,3@0.3
rect rib_r1 240,0,10,80 3
rect rib_r2 304,0,16,80 3
line seam1 0,94 320,94 c0
line seam2 0,112 320,112 c0
line deck_plank1 110,56@0.4 40,136 c1
line deck_plank2 110,56@0.4 120,136 c1
line deck_plank3 110,56@0.4 210,136 c3
line deck_plank4 110,56@0.4 280,136 c3
poly pallet_w1 0,12 38,18 38,136 0,136 0
rect pallet_slat1 2,20,34,8 mix:6,0@0.5 e0
rect pallet_slat2 2,34,34,9 mix:6,0@0.5 e0
rect pallet_slat3 2,49,34,9 mix:6,0@0.5 e0
rect pallet_slat4 2,64,34,9 mix:6,0@0.5 e0
rect pallet_slat5 2,79,34,9 mix:6,0@0.5 e0
rect pallet_slat6 2,94,34,9 mix:6,0@0.5 e0
rect pallet_slat7 2,109,34,9 mix:6,0@0.5 e0
rect pallet_slat8 2,124,34,9 mix:6,0@0.5 e0
poly pallet_w2 36,24 58,28 58,136 36,136 mix:6,0@0.7 e0
rect slat_b1 38,32,18,6 0
rect slat_b2 38,46,18,6 0
rect slat_b3 38,60,18,6 0
rect slat_b4 38,74,18,6 0
rect slat_b5 38,88,18,6 0
rect slat_b6 38,102,18,6 0
rect slat_b7 38,116,18,6 0
rect slat_b8 38,128,18,6 0
poly desk_shadow 80,118 174,118 160,132 66,132 mix:,0@0.7
poly desk_leg_fl 82,102 88,102 86,128 80,128 0
poly desk_leg_fr 160,102 166,102 164,128 158,128 0
poly desk_leg_bl 96,92 101,92 99,112 94,112 0
poly desk_leg_br 170,92 175,92 173,112 168,112 0
rect desk_bracket_l 78,126,10,3 1 e0
rect desk_bracket_r 156,126,10,3 1 e0
poly desk_pedestal 134,88 166,88 164,118 132,118 1 e0
poly desk_top 78,82 152,82 174,92 98,92 3 e1
poly desk_front 78,84 152,84 150,118 78,118 1 e0
rect desk_drawer1 136,92,26,7 0 e1
rect desk_drawer2 136,101,26,7 0 e1
rect desk_drawer3 136,110,26,6 0 e1
line desk_pull1 146,95 152,95 c3
line desk_pull2 146,104 152,104 c3
line desk_pull3 146,113 152,113 c3
poly desk_rim 78,82 152,82 152,84 78,84 11
line lamp_conduit 124,0 124,34 c0
rect lamp_bracket 120,34,8,4 0
poly lamp_shade 112,38 136,38 142,48 106,48 0 e1
ellipse lamp_bulb 124,49,8,3 mix:1,0@0.8
poly beam_spill_e 216,0 236,0 320,136 260,136 mix:,3@0.25
poly door_frame_e 284,18 290,16 290,136 284,136 0
rect jbox 196,44,14,18 1 e0
line pipe1 198,0 198,44 c0
line pipe2 208,62 208,80 c0
dots jbox_rivets 198,46 208,46 198,60 208,60 c8
dots spark_core 203,52 c1
dots spark_mid 202,52 204,52 203,51 203,53 c1
dots spark_tips 200,52 206,52 203,49 203,55 c1
rect pallet_e_shadow 298,40,22,96 0
rect pallet_e_slat1 300,50,20,8 mix:6,1@0.5 e0
rect pallet_e_slat2 300,66,20,8 mix:6,1@0.5 e0
rect pallet_e_slat3 300,82,20,8 mix:6,1@0.5 e0
rect pallet_e_slat4 300,98,20,8 mix:6,1@0.5 e0
rect pallet_e_slat5 300,114,20,8 mix:6,1@0.5 e0
rect pallet_e_slat6 300,128,20,8 mix:6,1@0.5 e0`,
    cycles: [
      {
        name: "indicator sparkle",
        areas: ["spark_core", "spark_mid", "spark_tips"],
        colors: [14, 14, 11, 1],
        rest: 46,
        style: "rotate",
        sweep: true,
        ms: 110
      }
    ],
    overlays: []
  },
  gangway: {
    version: 1,
    shot: "Eye-level facing north along the ferry's drenched exterior catwalk towards the passenger saloon companionway, vanishing point at 107,66; deepnight; harsh industrial fluorescent tube above bulkhead casting sharp cyan down steel plates, dark Atlantic sea below; steel weather door to passenger saloon at columns 96-120, open companionway wing east with salt-caked safety railing, deck plunge west; dressing: heavy marine {weather door}, non-skid ribbed steel deck {plates}, pipe safety {railing}, bulkhead acoustic dampening {conduits}, exterior emergency deck {lamp}; moves: sea spray foam below the rail (the shimmer recipe: a pingpong), overhead fluorescent fixture (a neon sign recipe: a flicker)",
    draw: `vp 107,66
rect sky_dark 0,0,320,66 0
rect sea_base 0,66,320,70 fade:0,1/0,66/0,135
poly sea_near 0,105 320,105 320,135 0,135 mix:1,0@0.6
rect deck_overhang 0,0,320,22 mix:8,0@0.4
rect ceiling_beam 0,18,320,4 0
poly bulkhead_right 140,22 320,0 320,135 140,110 fade:1,3/140,66/280,66
poly bulkhead_shade 140,22 320,0 320,40 140,36 mix:1,0@0.5
poly gangway_floor 40,110 140,110 230,135 0,135 fade:3,1/107,110/107,135
line floor_seam1 0,130 215,130 c0
line floor_seam2 15,122 185,122 c0
line floor_seam3 30,116 160,116 c0
poly west_void 0,66 40,110 0,135 0 e0
line rub_rail 0,92 40,110 c8
line rub_rail_lip 0,93 40,111 c7
rect door_recess 92,34,32,76 0
rect saloon_glow 96,38,24,72 mix:3,11@0.5
rect door_frame 90,32,36,78 mix:8,0@0.3 e0
rect weather_door 94,36,28,74 8 e0
rect door_window 102,46,12,18 1 e0
line door_window_cross 102,55 113,55 c0
line door_window_up 107,46 107,63 c0
rect door_handle 96,74,4,12 7
line door_seal 94,36 94,110 c0
line door_hinge1 120,44 121,50 c7
line door_hinge2 120,96 121,102 c7
line deck_lamp_bracket 104,22 110,22 c0
rect deck_lamp_housing 100,24,14,5 8 e0
rect deck_lamp 102,28,10,2 11
ellipse deck_lamp_halo 107,29,18,8 mix:,11@0.25
poly rail_post_1 48,95 50,95 50,115 48,115 8 e0
poly rail_post_2 32,100 34,100 34,125 32,125 8 e0
poly rail_post_3 12,106 14,106 14,135 12,135 8 e0
line rail_top 0,118 60,90 c7
line rail_mid 0,126 60,102 c8
line rail_bot 0,134 60,112 c0
line conduit_1 146,26 320,12 c8
line conduit_2 146,30 320,16 c0
line conduit_3 146,84 320,92 c8
rect dampening_box 180,48,14,22 8 e0
rect dampening_dial 184,52,6,6 11 e0
line dampening_pipe 187,70 187,110 c0
poly east_stanchion_1 170,22 174,22 174,118 170,116 8 e0
poly east_stanchion_2 240,14 246,14 246,128 240,125 8 e0
poly east_stanchion_3 300,4 308,4 308,135 300,135 8 e0
line catwalk_lip 40,110 0,135 c7
line floor_dither_1 48,112 136,112 c3
line floor_dither_2 42,118 152,118 c3
line floor_dither_3 30,126 180,126 c3
line floor_dither_4 10,132 205,132 c3
line glint_1 12,82 15,82 c11
line glint_2 20,86 24,86 c15
line glint_3 8,92 11,92 c11
line glint_4 28,95 33,95 c3
line glint_5 16,101 19,101 c15
line glint_6 24,106 27,106 c11
line glint_7 6,114 10,114 c3
line glint_8 18,120 22,120 c11`,
    cycles: [
      {
        name: "sea foam glints",
        areas: ["glint_1", "glint_2", "glint_3", "glint_4", "glint_5", "glint_6", "glint_7", "glint_8"],
        colors: [15, 11, 3],
        style: "pingpong",
        scatter: true,
        ms: 420
      },
      {
        name: "deck lamp flicker",
        areas: ["deck_lamp", "deck_lamp_halo"],
        colors: [11, 3],
        style: "flicker",
        ms: [800, 3200]
      }
    ],
    overlays: [{ object: "inspector_vane", at: [128, 114], tall: 66 }]
  },
  passenger_saloon: {
    version: 1,
    shot: "Interior eye level facing north, vanishing point on the central bench column; deepnight; harsh ceiling fluorescent tube flicker against dark ferry bulkheads; central orange {benches} framed by companionway stair rising north and flanking doors west and east, scuffed linoleum {floor} below, steel deckhead above; dressing includes lifejacket {lockers}, bulkhead {clock}, ceiling {tubes}, bulkhead {rivets}, and companionway {handrail}; moves: the central fluorescent tube (a faulty neon sign: flicker).",
    draw: `vp 160,62
rect ceiling 0,0,320,38 fade:0,1/160,0/160,38
rect deckhead_beam_l 0,16,108,6 0
rect deckhead_beam_r 212,16,108,6 0
poly wall_back 108,24 212,24 212,82 108,82 fade:1,3/160,24/160,82
poly wall_l 0,24 108,24 108,82 0,96 fade:0,1/0,60/108,60
poly wall_r 212,24 320,24 320,96 212,82 fade:1,0/212,60/320,60
poly floor_base 0,96 108,82 212,82 320,96 fade:1,3/160,82/160,110
rect floor_lower 0,110,320,26 fade:3,1/160,110/160,136
line scuff_1 50,118 84,119 c8
line scuff_2 130,125 174,126 c8
line scuff_3 220,115 258,116 c8
line scuff_4 90,105 116,106 c0
line scuff_5 190,102 214,103 c0
rect stair_recess 134,34,52,48 0
poly stair_tread_5 138,76 182,76 182,79 138,79 8
poly stair_tread_4 140,71 180,71 180,74 140,74 8
poly stair_tread_3 142,66 178,66 178,69 142,69 8
poly stair_tread_2 144,61 176,61 176,64 144,64 8
poly stair_tread_1 146,56 174,56 174,59 146,59 8
poly stair_shadow 144,59 176,59 176,61 144,61 0
line handrail_l 137,79 145,52 c7
line handrail_r 183,79 175,52 c7
line handrail_top 145,52 175,52 c7
poly door_purser_frame 16,36 46,38 46,92 16,94 0
poly door_purser_panel 19,39 43,41 43,89 19,91 mix:1,0@0.5
rect door_purser_porthole 27,48,8,12 3
line door_purser_handle 40,66 40,70 c7
poly door_obs_frame 274,38 304,36 304,94 274,92 0
poly door_obs_panel 277,41 301,39 301,91 277,89 mix:1,3@0.3
rect door_obs_porthole 285,48,8,12 11
line door_obs_handle 280,66 280,70 c7
rect locker_box_l 58,54,36,28 0
rect locker_face_l 60,56,32,24 mix:1,8@0.5
line locker_line_l 76,56 76,80 c0
rect locker_vent_l1 64,60,8,2 0
rect locker_vent_l2 80,60,8,2 0
rect locker_box_r 226,54,36,28 0
rect locker_face_r 228,56,32,24 mix:1,8@0.5
line locker_line_r 244,56 244,80 c0
rect locker_vent_r1 232,60,8,2 0
rect locker_vent_r2 248,60,8,2 0
ellipse clock_case 160,20,8,8 7
ellipse clock_face 160,20,6,6 15
line clock_h 160,20 160,17 c0
line clock_m 160,20 163,20 c0
poly bench_far_leg_l 148,86 150,86 150,94 148,94 0
poly bench_far_leg_r 170,86 172,86 172,94 170,94 0
poly bench_far_back 142,78 178,78 178,83 142,83 12
poly bench_far_seat 140,83 180,83 183,88 137,88 4
poly bench_mid_leg_l 134,96 137,96 137,108 134,108 0
poly bench_mid_leg_r 183,96 186,96 186,108 183,108 0
poly bench_mid_back 125,86 195,86 195,93 125,93 12
poly bench_mid_seat 121,93 199,93 203,101 117,101 4
line bench_mid_rib1 146,86 144,101 c12
line bench_mid_rib2 174,86 176,101 c12
poly bench_near_leg_l 116,112 121,112 121,130 116,130 0
poly bench_near_leg_r 199,112 204,112 204,130 199,130 0
line bench_near_brace 121,122 199,122 c0
poly bench_near_back 102,98 218,98 218,108 102,108 12
line bench_near_highlight 103,99 217,99 c14
poly bench_near_seat 96,108 224,108 230,120 90,120 4
line bench_seat_crease 94,113 226,113 c12
line bench_seat_front 90,120 230,120 c0
line bench_near_div1 138,98 135,120 c0
line bench_near_div2 160,98 160,120 c0
line bench_near_div3 182,98 185,120 c0
poly bench_shadow 88,124 232,124 216,134 104,134 mix:,0@0.7
rect tube_l_housing 40,8,60,3 0
rect tube_l 42,9,56,1 11
rect tube_r_housing 220,8,60,3 0
rect tube_r 222,9,56,1 11
rect tube_c_housing 130,5,60,3 0
rect tube_c 132,6,56,2 15
ellipse tube_c_glow 160,7,44,5 mix:,11@0.35
dots rivets_l 10,28 10,48 10,68 10,88 c8
dots rivets_r 310,28 310,48 310,68 310,88 c8`,
    cycles: [
      {
        name: "the flicker",
        areas: ["tube_c", "tube_c_glow"],
        colors: [15, 11, 3],
        style: "flicker",
        ms: [800, 3200]
      }
    ],
    overlays: [{ object: "inspector_vane", at: [76, 114], tall: 68 }]
  },
  purser_office: {
    version: 1,
    shot: "Eye-level facing north toward the ticket counter, vanishing point at 108,60; institution; dim fluorescent strip above the desk fading along bulkheads; counter in middle with frosted wire-glass partition and brass grate, seated {purser} behind counter at x=108, east doorway to passenger saloon in right wing; frosted glass partition, steel desk with rubber mat, bulkhead ledger racks, overhead fluorescent tube {tube}; moves: the tube (a faulty neon sign recipe: a flicker)",
    draw: `vp 108,60
rect ceil 0,0,320,38 fade:0,8/108,0/108,38
rect wall_back 0,38,320,44 8
poly wall_left 0,0@1 108,60@0.2 108,60@0.2 0,135@1 fade:0,8/0,60/108,60
poly floor 0,135 320,135 320,82 0,82 fade:8,0/108,82/108,135
rect door_frame 274,40,46,95 0
rect door_opening 278,44,42,91 fade:8,0/278,80/320,80
line - 274,40 320,40 c7
line - 274,40 274,135 c7
rect rack_base 52,44,40,38 0
rect rack_inner 54,46,36,34 8
line - 54,54 90,54 c7
line - 54,62 90,62 c7
line - 54,70 90,70 c7
rect - 56,48,6,6 7
rect - 64,48,5,6 0
rect - 72,48,7,6 7
rect - 56,56,8,6 0
rect - 66,56,6,6 7
rect - 74,56,7,6 0
rect - 56,64,5,6 7
rect - 63,64,7,6 0
rect - 72,64,6,6 7
rect counter_back 40,80,180,55 0
poly counter_top 36,80 224,80 236,92 30,92 7
rect counter_front 30,92,206,43 mix:8,0@0.5
line - 30,92 236,92 c15
line - 30,135 236,135 c0
rect glass_frame 94,40,86,40 0
rect glass_panel 96,42,82,38 mix:7,8@0.3 e0
line - 96,50 178,50 c8
line - 96,60 178,60 c8
line - 96,70 178,70 c8
line - 110,42 110,80 c8
line - 124,42 124,80 c8
line - 138,42 138,80 c8
line - 152,42 152,80 c8
line - 166,42 166,80 c8
rect grate_cutout 98,62,54,18 0
line - 102,62 102,80 c7
line - 108,62 108,80 c7
line - 114,62 114,80 c7
line - 120,62 120,80 c7
line - 126,62 126,80 c7
line - 132,62 132,80 c7
line - 138,62 138,80 c7
line - 144,62 144,80 c7
line - 150,62 150,80 c7
line - 98,62 152,62 c7
rect purser_coat 96,56,26,24 0
poly purser_shoulders 92,62 126,62 122,56 96,56 0
ellipse purser_head 109,51,6,7 8
rect purser_hair 104,45,11,6 0
rect purser_collar 107,56,4,4 7
rect purser_tie 108,60,2,6 0
outline purser e7
rect mat 150,84,60,6 0
rect ledger_desk 156,82,24,5 8 e0
line - 158,84 178,84 c7
line - 158,86 178,86 c7
rect speaker 164,52,14,14 0
rect - 166,54,10,10 8
dots - 168,56 172,56 170,59 168,62 172,62 c0
rect sign_plate 100,32,46,6 2
line - 102,35 144,35 c10
rect fixture 90,12,84,5 0
rect fixture_rim 88,11,88,2 8
rect tube 92,14,80,3 15
ellipse tube_glow 132,15,48,8 mix:,15@0.25
poly beam 84,17 180,17 210,80 54,80 mix:,15@0.15
rect pipe_left 20,0,4,135 0
line - 22,0 22,135 c8
rect pipe_right 258,0,5,135 0
line - 260,0 260,135 c7
rect trim_base 0,78,40,4 0
line - 0,78 40,78 c7
rect trim_right 224,78,50,4 0
line - 224,78 274,78 c7`,
    cycles: [{ name: "the tube", areas: ["tube"], colors: [15, 8], style: "flicker", ms: [800, 4000] }],
    overlays: [{ object: "cargo_manifest", at: [188, 83] }]
  },
  observation_deck: {
    version: 1,
    shot: "eye-level facing north on the open foredeck, vanishing point near centre-left; harbournight; cold starlight and dim bulkhead running lights, sea receding into blackness; salt-stained timber deck in the foreground, wooden {benches} facing the bow, steel {railing} framing the dark water, companionway bulkhead in the west wing; dressing includes salt-rimed bench slats, bolted deck cleats, lifebuoy housing, steel {stanchions}; moves: sea glints (the shimmer recipe: a pingpong), stars (the stars recipe: a pingpong)",
    draw: `vp 108,68
rect sky 0,0,320,68 0
poly sea 0,68 320,68 320,136 0,136 fade:1,0/0,68/0,136
dots stars_still 24,12 55,22 89,8 142,18 198,11 230,28 285,15 310,24 c15
dots stars_dim 40,30 115,25 170,32 250,19 292,34 c11
dots stars_twinkle 68,14 130,10 182,24 215,8 262,20 305,12 c15
poly bow_spray 160,68 280,68 320,95 210,85 mix:1,15@0.2
line wake_1 220,72 270,75 c11
line wake_2 200,78 285,82 c1
line wake_3 180,85 300,92 c11
line wake_4 160,94 250,98 c1
poly deck_planks 0,86 320,86 320,136 0,136 fade:6,0/0,86/0,140
line plank_seam1 0,98 320,98 c0
line plank_seam2 0,112 320,112 c0
line plank_seam3 0,126 320,126 c0
poly west_bulkhead 0,30 46,45 46,136 0,136 mix:8,0@0.5
line bulkhead_edge 46,45 46,136 c8
rect companionway_frame 8,56,30,76 0
rect companionway_ajar 10,58,26,74 0
poly companionway_sill 8,132 38,132 42,136 6,136 8
poly cabin_shadow 0,86 85,86 110,136 0,136 mix:,0@0.6
rect bench_leg_l1 92,102,3,24 0
rect bench_leg_r1 148,102,3,24 0
rect bench_stretcher1 95,116,53,3 0
poly bench_back1 88,88 152,88 152,98 88,98 6
line bench_back_slit1 88,93 152,93 c0
poly bench_seat1 86,98 154,98 150,104 88,104 6 e0
line bench_seat_frost1 88,99 152,99 c7
rect bench_shadow1 86,125,66,4 mix:,0@0.7
rect bench_leg_l2 176,102,3,24 0
rect bench_leg_r2 232,102,3,24 0
rect bench_stretcher2 179,116,53,3 0
poly bench_back2 172,88 236,88 236,98 172,98 6
line bench_back_slit2 172,93 236,93 c0
poly bench_seat2 170,98 238,98 234,104 172,104 6 e0
line bench_seat_frost2 172,99 236,99 c7
rect bench_shadow2 170,125,66,4 mix:,0@0.7
line rail_top 46,74 320,74 c7
line rail_mid 46,80 320,80 c8
line rail_bot 46,86 320,86 c0
line post_1 70,74 70,86 c8
line post_2 110,74 110,86 c8
line post_3 150,74 150,86 c8
line post_4 190,74 190,86 c8
line post_5 230,74 230,86 c8
line post_6 270,74 270,86 c8
line post_7 310,74 310,86 c8
rect cleat_base1 278,118,16,3 0
rect cleat_horn1 276,116,20,2 7
rect cleat_base2 62,118,16,3 0
rect cleat_horn2 60,116,20,2 7
ellipse ring_housing 28,42,7,7 4
ellipse ring_hole 28,42,4,4 8
line g1 210,70 213,70 c15
line g2 245,71 248,71 c11
line g3 270,69 272,69 c15
line g4 195,73 198,73 c11
line g5 230,74 233,74 c15
line g6 280,73 283,73 c11
line g7 260,76 264,76 c15
line g8 295,75 298,75 c11`,
    cycles: [
      {
        name: "sea glints",
        areas: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"],
        colors: [15, 11, 1],
        style: "pingpong",
        scatter: true,
        ms: 420
      },
      { name: "stars", areas: ["stars_twinkle"], colors: [15, 9], style: "pingpong", ms: 2400 }
    ],
    overlays: []
  },
  wheelhouse: {
    version: 1,
    shot: "Eye-level facing north toward the forward bridge windows, VP 160,54; deepnight; phosphor green radar sweep and blue cabin gloom, bulkhead falling into dark; the brass {helm} on its gyro column at x 106, dark bridge console across middle, de-icing spin discs on the forward bridge windows; companionway railing to saloon at right wing, bulkhead instruments and acoustic {hydrophone} console at left wing; moves: the radar sweep (a beam: rotate)",
    draw: `vp 160,54
rect sky_black 0,0,320,54 0
poly floor 0,135 320,135 320,88 0,88 fade:1,0/160,135/160,88
rect fwd_bulkhead 0,0,320,88 1
poly ceiling 0,0 320,0 320,18 0,18 fade:0,1/160,0/160,20
rect win_cut 24,18,272,36 0
rect win_pane_l 28,20,80,32 1
rect win_pane_m 120,20,80,32 1
rect win_pane_r 212,20,80,32 1
rect sea_out 24,36,272,18 0
line horizon 24,36 296,36 c1
rect post_1 108,18,12,36 8
rect post_2 200,18,12,36 8
rect sill 24,52,272,4 8
ellipse clearview_l 68,36,12,12 3
ellipse clearview_m 160,36,12,12 3
ellipse clearview_r 252,36,12,12 3
ellipse clear_hub_l 68,36,2,2 8
ellipse clear_hub_m 160,36,2,2 8
ellipse clear_hub_r 252,36,2,2 8
poly console_top 18,72 302,72 320,88 0,88 fade:8,1/160,72/160,88
rect console_face 0,88,320,47 8
poly console_shade 0,88 320,88 320,135 0,135 mix:8,0@0.5
rect radar_hood 208,62,44,30 0
ellipse ppi_screen 230,76,17,17 0
ellipse ppi_ring 230,76,14,14 none e2
ellipse ppi_inner 230,76,7,7 none e2
poly swp0 230,76 244,70 244,76 2
poly swp1 230,76 242,86 236,90 0
poly swp2 230,76 220,89 216,84 0
poly swp3 230,76 216,68 222,63 0
poly swp4 230,76 230,62 238,64 0
dots radar_blip 237,72 225,82 c10
rect gyro_base 98,96,20,38 8
rect gyro_col 104,80,8,22 6
rect gyro_mount 101,76,14,5 14
ellipse helm_rim 108,68,14,14 none e14
ellipse helm_hub 108,68,3,3 14
line helm_spk1 108,54 108,82 c14
line helm_spk2 94,68 122,68 c14
line helm_spk3 98,58 118,78 c14
line helm_spk4 98,78 118,58 c14
rect hydro_panel 32,82,46,38 0
rect hydro_plate 34,84,42,34 8
rect hydrophone_jack 48,96,6,6 0
ellipse jack_hole 51,99,1,1 7
line jack_rim 47,95 55,95 c7
rect hydro_dial 60,88,10,10 0
ellipse dial_face 65,93,4,4 10
line dial_needle 65,93 67,91 c14
rect desk_shelf 134,84,36,10 6
rect telegraph_base 138,82,28,4 6
rect stair_well 276,88,44,47 0
line stair_rail 276,80 276,135 c8
line stair_hand 276,80 320,104 c7
line step_1 280,98 320,98 c8
line step_2 284,108 320,108 c8
line step_3 288,118 320,118 c8
line step_4 292,128 320,128 c8
rect ind_lamp1 86,76,4,3 2
rect ind_lamp2 92,76,4,3 12
rect ind_lamp3 124,76,4,3 14
rect side_pipe_l 6,0,4,88 8
rect side_pipe_r 314,0,4,88 8
rect beam_glow 0,54,320,1 mix:,3@0.25`,
    cycles: [
      {
        name: "radar sweep",
        areas: ["swp0", "swp1", "swp2", "swp3", "swp4"],
        colors: [10, 2, 0, 0, 0],
        style: "rotate",
        sweep: true,
        ms: 400
      }
    ],
    overlays: [{ object: "master_signal_key", at: [144, 74] }]
  },
  engine_room: {
    version: 1,
    shot: "eye level facing north, vanishing point center; cellar; bulkheads lit by an overhead yellow work-cage bulb, deep shadows in the wings; two massive {engine} blocks left and right flanking a central diamond-plate gangway, overhead lagged {pipe} manifolds; an iron {ladder} bolted to the east bulkhead leading upward, a heavy round-cornered watertight {door} set low in the west bulkhead; moves: the bulb cage lamp (the candlelight, lamplight recipe: a flicker)",
    draw: `vp 160,65
rect bg 0,0,320,136 0
poly backwall 100,24 220,24 220,95 100,95 8
poly bulkhead_fade 100,24 220,24 220,95 100,95 fade:8,0/160,30/160,95
poly ceil 0,0 320,0 220,24 100,24 mix:8,0@0.6
poly deck 0,136 320,136 220,95 100,95 mix:8,1@0.5
poly deck_light 100,95 220,95 240,136 80,136 fade:6,0/160,95/160,136
poly deck_center 135,95 185,95 200,136 120,136 mix:6,14@0.25
poly wall_left 0,0 100,24 100,95 0,136 mix:8,0@0.4
poly wall_right 320,0 220,24 220,95 320,136 mix:8,0@0.7
poly deck_rib1 90,105 230,105 234,107 86,107 0
poly deck_rib2 80,118 240,118 245,120 75,120 0
poly deck_rib3 68,132 252,132 258,135 62,135 0
rect pipe_horiz1 20,8,280,7 7
rect pipe_horiz1_shade 20,12,280,3 8
rect pipe_horiz2 40,18,240,6 6
rect pipe_horiz2_shade 40,21,240,3 0
poly pipe_elbow_l 40,18 55,18 55,42 40,42 7
poly pipe_elbow_r 265,18 280,18 280,45 265,45 7
rect pipe_vert_l 42,42,11,40 6
rect pipe_vert_r 267,45,11,40 6
rect manifold_band1 60,7,4,9 0
rect manifold_band2 110,7,4,9 0
rect manifold_band3 160,7,4,9 0
rect manifold_band4 210,7,4,9 0
rect manifold_band5 260,7,4,9 0
rect door_frame 10,64,28,62 8
rect door_recess 12,66,24,58 0
rect door 14,68,20,54 8 e0
line door_wheel 24,92 24,98 c0
line door_wheel_h 21,95 27,95 c0
rect door_sill 8,124,32,4 6
line lad_rail_l 290,20 290,134 c8
line lad_rail_r 304,20 304,134 c8
line lad_rung1 290,32 304,32 c7
line lad_rung2 290,44 304,44 c7
line lad_rung3 290,56 304,56 c7
line lad_rung4 290,68 304,68 c7
line lad_rung5 290,80 304,80 c7
line lad_rung6 290,92 304,92 c7
line lad_rung7 290,104 304,104 c7
line lad_rung8 290,116 304,116 c7
line lad_rung9 290,128 304,128 c7
poly eng_l_side 48,50 96,58 96,112 48,118 8
poly eng_l_top 48,50 96,58 90,54 44,47 6
poly eng_l_front 96,58 124,62 124,122 96,112 6
poly eng_l_shade 48,50 96,58 96,112 48,118 mix:8,0@0.5
rect eng_l_cover1 100,66,20,10 8 e0
rect eng_l_cover2 100,80,20,10 8 e0
rect eng_l_cover3 100,94,20,10 8 e0
rect eng_l_cover4 100,108,20,10 8 e0
line eng_l_pipe 65,48 65,30 c6
line eng_l_pipe2 82,52 82,26 c6
poly eng_r_front 196,62 224,58 224,112 196,122 6
poly eng_r_side 224,58 272,50 272,118 224,112 mix:8,0@0.6
poly eng_r_top 196,62 224,58 270,47 228,52 mix:6,0@0.3
rect eng_r_cover1 200,66,20,10 8 e0
rect eng_r_cover2 200,80,20,10 8 e0
rect eng_r_cover3 200,94,20,10 8 e0
rect eng_r_cover4 200,108,20,10 8 e0
line eng_r_pipe 238,52 238,26 c6
line eng_r_pipe2 255,48 255,30 c6
rect gauge_panel 152,48,16,22 8 e0
ellipse gauge1 160,54,4,4 15
ellipse gauge1_rim 160,54,4,4 none e0
line gauge1_needle 160,54 162,52 c4
rect gauge2 156,62,8,5 0
rect gauge2_lit 157,63,6,3 14
rect junction_box 128,42,12,14 6 e0
line conduit1 134,56 134,80 c0
line conduit2 140,48 152,52 c0
poly eng_l_shadow 96,112 124,122 136,124 102,114 mix:,0@0.7
poly eng_r_shadow 196,122 224,112 218,114 184,124 mix:,0@0.7
line cage_wire 160,0 160,26 c0
rect cage_fixture 157,26,6,3 8
ellipse cage_glow_outer 160,34,36,24 mix:,14@0.12
ellipse cage_glow_mid 160,33,20,14 mix:,14@0.22
ellipse cage_bulb 160,32,4,5 14
ellipse cage_filament 160,32,1,2 15
line cage_bar1 157,29 157,37 c0
line cage_bar2 163,29 163,37 c0
line cage_bar3 158,37 162,37 c0
rect floor_spill 145,98,30,34 mix:,14@0.2`,
    cycles: [
      {
        name: "the cage light",
        areas: ["cage_bulb", "cage_glow_mid", "floor_spill"],
        colors: [14, 6],
        style: "flicker",
        ms: [700, 2200]
      }
    ],
    overlays: []
  },
  bilge_well: {
    version: 1,
    shot: "eye-level looking north toward hull ribs, vanishing point at 107,68; cellar; dim yellow inspection cage overhead casting downward pool on wet iron, cold blue shadow receding into bulkhead ribs; massive cast-iron bilge pumps and piping filling left and center columns 60-150, low watertight hatchway leading east in right wing 260-310; {grate} under sloshing bilge water in sump trench across foreground, heavy iron pipes, rivets, overhead conduit; moves: oily water in the bilge sump (the shimmer recipe: a pingpong)",
    draw: `vp 107,68
rect bg 0,0,320,136 0
poly back_wall 0,0 320,0 320,88 0,88 fade:8,1/107,-20/107,88
poly floor_plane 0,88 320,88 320,136 0,136 fade:1,0/107,88/107,145
rect cage_glow 95,8,26,24 mix:,14@0.25
rect cage_core 103,14,10,12 14
rect cage_guard 101,12,14,16 mix:0,8@0.5 e0
line cage_conduit 108,0 108,12 c8
poly floor_lamp_pool 50,88 170,88 195,136 20,136 fade:6,0/107,88/107,136
poly rib_l1 12,0 26,0 26,94 12,94 mix:8,0@0.5 e0
poly rib_l2 44,0 56,0 56,92 44,92 mix:8,1@0.5 e0
poly rib_c1 158,0 168,0 168,90 158,90 mix:8,1@0.5 e0
poly rib_r1 210,0 220,0 220,90 210,90 mix:8,0@0.5 e0
poly rib_r2 248,0 256,0 256,92 248,92 mix:8,0@0.5 e0
line pipe_horiz_top 0,22 320,22 c8
line pipe_horiz_mid 0,26 320,26 c6
line pipe_horiz_bot 0,30 320,30 c0
rect hatch_frame 266,42,46,62 8 e0
rect hatch_opening 272,48,34,56 0
poly hatch_coaming 268,102 316,102 312,106 270,106 6 e0
rect hatch_door_ajar 304,46,14,58 mix:8,6@0.4 e0
line hatch_lip 272,48 306,48 c7
rect pump_base 68,64,54,34 6 e0
rect pump_body 74,40,42,28 6 e0
ellipse pump_dome 95,40,21,12 8
ellipse pump_dome_top 95,38,18,9 6
rect pump_flange 82,66,26,5 8 e0
line pump_seam 74,52 116,52 c0
line pump_lit_edge 74,40 74,68 c14
poly suction_trunk 106,58 136,58 136,92 124,92 124,68 106,68 8 e0
line suction_crease 106,64 128,64 c6
line suction_lit 106,59 135,59 c14
rect suction_elbow 124,84,16,14 6 e0
rect valve_wheel_hub 110,48,6,6 8
line valve_spoke_v 113,42 113,60 c7
line valve_spoke_h 104,51 122,51 c7
ellipse valve_wheel 113,51,8,8 none e7
rect small_pipe_a 54,32,8,58 8 e0
line small_pipe_lit 55,32 55,90 c14
rect small_pipe_elbow 54,86,16,8 6 e0
rect sump_trench 0,104,250,32 0
poly trench_back 0,104 250,104 246,108 0,108 mix:8,0@0.5
poly trench_wall_r 246,108 250,104 254,136 248,136 8 e0
poly drain_grate 18,108 238,108 244,134 10,134 0 e8
line grate_bar_1 36,108 30,134 c8
line grate_bar_2 56,108 52,134 c8
line grate_bar_3 76,108 74,134 c6
line grate_bar_4 96,108 96,134 c14
line grate_bar_5 116,108 118,134 c14
line grate_bar_6 136,108 140,134 c6
line grate_bar_7 156,108 162,134 c8
line grate_bar_8 176,108 184,134 c8
line grate_bar_9 196,108 206,134 c8
line grate_bar_10 216,108 228,134 c8
line grate_cross_1 16,114 240,114 c8
line grate_cross_2 14,120 242,120 c8
line grate_cross_3 12,126 243,126 c8
line grate_slit_1 82,111 92,111 c0
line grate_slit_2 102,111 112,111 c0
line grate_slit_3 80,117 92,117 c0
line grate_slit_4 100,117 114,117 c0
line grate_slit_5 78,123 92,123 c0
line grate_slit_6 100,123 116,123 c0
poly oily_film_1 72,112 128,110 134,126 68,124 mix:6,0@0.5
poly oily_film_2 90,115 118,114 122,122 86,121 mix:14,6@0.3
line g1 88,113 91,113 c14
line g2 98,115 102,115 c15
line g3 108,114 111,114 c14
line g4 92,118 95,118 c15
line g5 104,119 108,119 c14
line g6 114,117 117,117 c6
line g7 84,122 87,122 c6
line g8 96,123 100,123 c14
line g9 106,122 109,122 c15
line g10 118,124 121,124 c6
poly deck_plates_r 250,104 320,104 320,136 248,136 mix:8,1@0.5 e0
line deck_seam_r 284,104 286,136 c0
dots rivet_row_r 258,106 270,106 295,106 310,106 c8
dots rivet_row_low 256,128 274,128 300,128 316,128 c8
poly deck_plates_l 0,104 18,104 10,134 0,134 mix:8,0@0.6 e0
line conduit_vert 164,0 164,72 c8
rect junction_box 161,34,7,9 6 e0
line catwalk_rail 0,56 44,56 c8
line catwalk_stanchion 40,56 40,92 c8`,
    cycles: [
      {
        name: "oily water in the bilge sump",
        areas: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g10"],
        colors: [15, 14, 6],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    overlays: []
  },
  docking_slip: {
    version: 1,
    shot: "Eye-level facing north looking along the slipway between the ferry hull and terminal wharf, vanishing point at 107,68; deepnight; harsh industrial cyan floodlights from wharf over black water, soft cyan gradients along the slip; subject is the heavy timber {pilings} and mooring {bollards} with tied {lines} at columns 90-130, left wing filled by the ferry {hull} and {gangway}, right wing filled by the wet concrete wharf and glass {doors} to the concourse; dressing includes {pilings}, cast iron {bollards}, mooring {lines}, ferry {hull}, {gangway}, water {foam}, and glass {doors}; moves: foam shimmer at the slip water (the shimmer recipe: a pingpong).",
    draw: `vp 107,68
rect bg 0,0,320,136 0
rect sky 0,0,320,55 fade:0,1/107,-20/107,55
poly water 0,55 320,55 320,136 0,136 fade:1,0/107,55/107,150
poly wharf 170,55 320,55 320,136 185,136 fade:1,3/170,55/300,136
poly wharf_edge 168,55 174,55 188,136 182,136 0
line wharf_lip 174,55 188,136 c3
poly hull_body 0,38 72,58 60,136 0,136 fade:0,1/0,38/72,136
line strake 0,72 68,82 c8
line strake_hi 0,71 68,81 c7
rect term_wall 220,20,100,55 1
poly term_roof 210,15 320,10 320,22 210,25 8
rect doors_frame 242,32,54,40 8
rect doors_glass 244,34,50,38 3
line doors_div 269,34 269,72 c0
rect doors_glow 246,36,46,34 mix:3,11@0.4
poly flood_beam 230,22 210,136 290,136 250,22 mix:,3@0.25
poly gangway 0,98 86,108 82,118 0,110 8
poly gangway_floor 0,99 84,109 81,114 0,105 7
line gangway_rail1 0,92 84,102 c8
line gangway_rail2 0,94 84,104 c7
line gang_post1 24,96 24,107 c8
line gang_post2 56,100 56,111 c8
rect pile1 92,44,14,76 0
poly pile1_top 92,44 99,41 106,44 99,47 8
line pile1_edge 106,44 106,120 c8
rect pile2 108,48,12,70 0
poly pile2_top 108,48 114,45 120,48 114,51 8
line pile2_edge 120,48 120,118 c8
rect pile3 80,52,10,64 0
poly pile3_top 80,52 85,49 90,52 85,55 8
rect pile4 122,54,11,62 0
poly pile4_top 122,54 127,51 133,54 127,57 8
poly pile_brace 78,82 135,86 135,92 78,88 0
line pile_brace_hi 78,82 135,86 c8
rect bollard1_base 190,92,16,8 0
ellipse bollard1_cap 198,82,7,4 0
rect bollard1_post 194,84,8,12 8
ellipse bollard1_lip 198,82,6,3 7
rect bollard2_base 178,66,12,6 0
ellipse bollard2_cap 184,60,5,3 0
rect bollard2_post 181,61,6,8 8
ellipse bollard2_lip 184,60,4,2 7
line line1 112,68 181,63 c8
line line1_b 112,69 181,64 c7
line line2 68,82 194,86 c8
line line2_b 68,83 194,87 c7
poly foam_base 85,116 145,118 135,132 75,130 mix:1,3@0.5
poly foam_slip 60,126 120,128 110,136 50,136 mix:1,11@0.3
line shm1 96,120 101,120 c11
line shm2 108,122 114,122 c3
line shm3 118,121 123,121 c11
line shm4 88,124 94,124 c3
line shm5 102,125 109,125 c11
line shm6 114,126 119,126 c15
line shm7 125,124 130,124 c3
line shm8 76,128 83,128 c11
line shm9 92,129 97,129 c15
line shm10 104,130 110,130 c11
line shm11 118,129 124,129 c3
line shm12 82,132 89,132 c3
line shm13 98,133 105,133 c11
line shm14 112,134 117,134 c15`,
    cycles: [
      {
        name: "water shimmer",
        areas: [
          "shm1",
          "shm2",
          "shm3",
          "shm4",
          "shm5",
          "shm6",
          "shm7",
          "shm8",
          "shm9",
          "shm10",
          "shm11",
          "shm12",
          "shm13",
          "shm14"
        ],
        colors: [15, 11, 3],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    overlays: []
  },
  terminal_concourse: {
    version: 1,
    shot: "Eye-level facing north down the vast aluminium hall, vanishing point on the left third at 108,68; institution; cold institutional strip lighting with hard terrazzo reflections; the mechanical {arrival_board} spanning columns 72-144, the bank of steel {turnstiles} across columns 160-230, ribbed aluminium panels in the west wing, high frosted glass clerestory and street glow in the east wing; dressing: {bench} along west wall, directional {sign} hanging from stanchion, rubber floor {mats}; moves: mechanical board split-flap cycling (your own cycles: rotate)",
    draw: `vp 108,68
rect bg 0,0,320,136 0
rect wall_far 80,42,120,38 fade:8,7/80,42/80,80
poly ceil 0,0 320,0 200,42 80,42 mix:8,0@0.5
poly floor 0,136 320,136 200,80 80,80 fade:8,7/108,80/108,136
poly wall_w 0,0 80,42 80,80 0,136 fade:8,0/80,68/0,68
poly wall_e 320,0 200,42 200,80 320,136 fade:7,8/200,68/320,68
line rib_w1 18,0 18,136 c8
line rib_w2 38,0 38,136 c8
line rib_w3 58,0 58,136 c8
poly beam_w1 10,0 24,0 74,42 66,42 8
poly beam_w2 40,0 54,0 76,42 70,42 8
poly beam_e1 310,0 296,0 204,42 212,42 8
poly beam_e2 280,0 266,0 208,42 214,42 8
rect light_strip1 94,44,72,2 15
rect light_strip2 100,50,60,1 15
rect light_refl1 94,84,72,3 mix:,15@0.3
rect light_refl2 100,92,60,2 mix:,15@0.2
poly win_e 216,46 312,18 312,38 216,56 mix:8,7@0.5 e0
line win_bar1 248,36 248,51 c0
line win_bar2 280,26 280,44 c0
poly doors_w 6,66 28,60 28,114 6,128 8 e0
poly doors_w_in 9,69 25,64 25,110 9,123 0
line doors_w_mull 17,66 17,116 c8
rect board_body 74,48,54,14 0
rect flap1 76,50,11,4 8
rect flap2 89,50,11,4 8
rect flap3 102,50,11,4 8
rect flap4 115,50,11,4 8
rect flap5 76,56,11,4 8
rect flap6 89,56,11,4 8
rect flap7 102,56,11,4 8
rect flap8 115,56,11,4 8
line flap_div1 76,52 87,52 c0
line flap_div2 89,52 100,52 c0
line flap_div3 102,52 113,52 c0
line flap_div4 115,52 126,52 c0
line flap_div5 76,58 87,58 c0
line flap_div6 89,58 100,58 c0
line flap_div7 102,58 113,58 c0
line flap_div8 115,58 126,58 c0
rect board_mount1 82,42,2,4 8
rect board_mount2 118,42,2,4 8
rect sign_body 148,46,24,8 2 e0
rect sign_pip 152,49,4,2 10
line sign_stem 160,42 160,46 c0
rect glass_wall 162,56,46,24 mix:8,7@0.2 e0
line glass_mull1 177,56 177,80 c8
line glass_mull2 192,56 192,80 c8
poly turnstile_base 164,74 214,74 218,84 162,84 8 e0
rect pod1 166,70,6,12 7 e0
rect pod2 180,70,6,12 7 e0
rect pod3 194,70,6,12 7 e0
rect pod4 208,70,6,12 7 e0
line arm1_a 172,74 179,72 c15
line arm1_b 172,74 177,77 c15
line arm2_a 186,74 193,72 c15
line arm2_b 186,74 191,77 c15
line arm3_a 200,74 207,72 c15
line arm3_b 200,74 205,77 c15
poly turnstile_shd 160,84 220,84 216,88 158,88 mix:,0@0.7
poly bench_seat 34,98 56,88 56,92 34,103 8 e0
poly bench_back 34,92 56,83 56,87 34,97 7 e0
line bench_leg1 36,103 36,112 c0
line bench_leg2 44,99 44,107 c0
line bench_leg3 54,92 54,100 c0
poly mat_exit 168,88 212,88 222,106 160,106 mix:0,8@0.3 e0
line floor_grid1 90,80 18,136 c8
line floor_grid2 130,80 148,136 c8
line floor_grid3 168,80 256,136 c8
line floor_seam1 0,118 320,118 c8
line floor_seam2 0,96 320,96 c8
rect pillar_e 254,34,18,92 8 e0
poly pillar_e_top 254,34 272,34 266,28 248,28 7
rect pillar_e_lit 254,34,4,92 7`,
    cycles: [
      {
        name: "arrival board",
        areas: ["flap2", "flap4", "flap7"],
        colors: [8, 7, 15, 0],
        style: "rotate",
        sweep: [0, 2, 5],
        ms: 320
      }
    ],
    overlays: []
  }
};

export const endings = {
  ending_escape: {
    version: 1,
    shot: "Eye level, facing north; deepnight; overhead concourse lights fading into the wet dark; the bank of corroded {turnstiles} across columns 80-240 with the wet tracks and distant yard beyond, wet concourse floor in the near ground, metal pillars in the wings; dressing includes the overhead {board}, the track {lanterns}, and the salt-rusted {railings}; moves: the rail yard lanterns (the glimmer recipe: a pingpong).",
    draw: `vp 160,62
rect bg 0,0,320,136 0
rect sky 0,0,320,70 fade:0,1/0,-20/0,70
poly floor 0,135 319,135 319,65 0,65 fade:0,1/0,135/0,50
poly wet_concourse 0,135 319,135 272,92 48,92 fade:1,3/0,135/0,90
poly yard_ground 48,92 272,92 200,65 120,65 fade:0,1/0,65/0,92
rect pillar_l 0,0,36,136 8
rect pillar_l_in 36,0,8,136 0
rect pillar_r 284,0,36,136 8
rect pillar_r_in 276,0,8,136 0
line track_l1 150,65 70,92 c3
line track_r1 154,65 96,92 c3
line track_l2 166,65 224,92 c3
line track_r2 170,65 250,92 c3
line tie_1 140,68 180,68 c0
line tie_2 130,73 190,73 c0
line tie_3 118,79 202,79 c0
line tie_4 102,85 220,85 c0
rect roof_beam 0,0,320,24 8
rect roof_trim 0,24,320,4 0
rect board 100,8,120,18 0
line board_div1 100,14 220,14 c8
line board_div2 100,20 220,20 c8
dots board_ticks 105,11 115,11 125,11 135,11 145,11 155,11 165,11 175,11 185,11 195,11 205,11 215,11 c7
dots board_ticks2 108,17 118,17 128,17 138,17 148,17 158,17 168,17 178,17 188,17 198,17 208,17 c7
poly gate_shadow 48,92 272,92 272,98 48,98 mix:,0@0.7
rect turnstile_base 48,82,224,10 8
line turnstile_top 48,82 272,82 c7
rect rust_strip 48,88,224,4 6
rect housing_1 68,72,14,20 8
rect housing_2 110,72,14,20 8
rect housing_3 153,72,14,20 8
rect housing_4 196,72,14,20 8
rect housing_5 238,72,14,20 8
rect rust_patch1 70,76,8,8 6
rect rust_patch2 112,80,6,6 6
rect rust_patch3 155,74,7,7 6
rect rust_patch4 198,78,6,7 6
rect rust_patch5 240,75,8,9 6
line arm_1a 82,78 102,86 c7
line arm_1b 82,78 96,68 c7
line arm_2a 124,78 144,86 c7
line arm_2b 124,78 138,68 c7
line arm_3a 167,78 187,86 c7
line arm_3b 167,78 181,68 c7
line arm_4a 210,78 230,86 c7
line arm_4b 210,78 224,68 c7
line arm_5a 252,78 270,86 c7
line arm_5b 252,78 266,68 c7
line railings 36,86 48,86 c7
line railings_vert1 40,86 40,110 c8
line railings_vert2 46,86 46,110 c8
line railings_r 272,86 284,86 c7
line railings_r_vert1 274,86 274,110 c8
line railings_r_vert2 280,86 280,110 c8
line puddle_glint1 80,108 140,108 c3
line puddle_glint2 170,115 240,115 c3
line puddle_glint3 100,122 210,122 c3
line post_1 138,52 138,68 c0
line post_2 182,50 182,68 c0
line post_3 160,56 160,66 c0
ellipse light_halo1 138,52,3,3 mix:,10@0.3
ellipse light_halo2 182,50,3,3 mix:,10@0.3
ellipse light_halo3 160,56,2,2 mix:,10@0.3
dots lanterns 138,52 182,50 160,56 c10
line wet_sheen1 138,69 138,76 c2
line wet_sheen2 182,69 182,78 c2
line wet_sheen3 160,67 160,72 c2`,
    cycles: [
      {
        name: "the lanterns",
        areas: ["lanterns"],
        colors: [10, 2, 10],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    loops: []
  },
  ending_scuttle: {
    version: 1,
    shot: "Eye level, looking down into the sump, facing north; cellar; one low lamp, cold cast iron fading to dark; the {grate} and shattered {instrument} on the middle columns, bilge {pipes} in the left wing, heavy cast-iron {manifold} framing the right wing; dressing: oily bilge {sludge} and {bolts}; moves: the glint on the oil (the shimmer recipe: a pingpong).",
    draw: `vp 160,70
rect back_wall 0,0,320,86 fade:8,0/160,0/160,86
rect sump_floor 0,86,320,50 fade:0,8/160,135/160,86
rect bilge_pool 30,90,260,46 fade:1,0/160,120/160,90
poly sump_trench 40,94 280,94 290,135 30,135 0
rect pipe_left_shadow 10,0,32,136 mix:1,0@0.7
rect pipe_left 8,0,26,136 8
rect pipe_left_hi 14,0,6,136 7
line pipe_joint_1 8,42 34,42 c0
line pipe_joint_2 8,44 34,44 c7
line pipe_joint_3 8,96 34,96 c0
line pipe_joint_4 8,98 34,98 c7
rect manifold_body 240,0,80,136 8
rect manifold_core 254,10,54,120 fade:6,0/254,68/308,68
line flange_line1 240,24 320,24 c0
line flange_line2 240,26 320,26 c7
line flange_line3 240,80 320,80 c0
line flange_line4 240,82 320,82 c7
dots bolts 246,18 246,32 246,74 246,88 246,104 246,120 c7
rect well_curb 58,54,156,76 8
rect well_pit 64,58,144,68 0
poly well_rim_top 58,54 214,54 208,58 64,58 7
poly well_rim_bot 64,126 208,126 214,130 58,130 8
poly well_rim_l 58,54 64,58 64,126 58,130 7
poly well_rim_r 214,54 208,58 208,126 214,130 0
rect impeller_housing 86,72,100,44 8
ellipse impeller_hub 136,94,18,18 0
poly impeller_blade1 136,94 116,80 120,74 136,90 6
poly impeller_blade2 136,94 156,80 160,86 140,96 6
poly impeller_blade3 136,94 148,112 142,116 134,98 6
poly impeller_blade4 136,94 118,108 114,102 132,92 6
rect grate_bar1 68,60,4,64 7
rect grate_bar2 84,60,4,64 7
rect grate_bar3 100,60,4,64 7
rect grate_bar4 116,60,4,64 7
rect grate_bar5 132,60,4,64 7
rect grate_bar6 148,60,4,64 7
rect grate_bar7 164,60,4,64 7
rect grate_bar8 180,60,4,64 7
rect grate_bar9 196,60,4,64 7
line grate_cross1 64,74 208,74 c0
line grate_cross2 64,96 208,96 c0
line grate_cross3 64,114 208,114 c0
poly inst_belly 122,86 146,82 152,98 126,104 6
poly inst_shoulder 114,84 126,80 126,92 116,92 6
poly inst_rib_frag1 106,78 116,74 112,82 6
poly inst_rib_frag2 138,102 154,106 148,112 14
poly inst_scroll 98,82 108,80 106,86 96,86 14
poly inst_splint1 128,90 144,76 140,74 126,88 14
poly inst_splint2 140,94 162,96 158,100 136,98 14
line string_wire1 104,82 132,92 c15
line string_wire2 104,84 148,84 c7
line string_wire3 118,88 156,102 c15
dots sawdust 112,94 118,98 124,106 130,108 144,110 150,108 156,102 160,94 110,80 120,76 134,74 148,78 126,96 138,92 c7
rect oil_wash 50,126,180,10 fade:1,0/140,126/140,136
line gl1 78,128 82,128 c14
line gl2 96,131 101,131 c6
line gl3 124,129 130,129 c14
line gl4 142,132 147,132 c6
line gl5 168,130 173,130 c14
line gl6 188,128 191,128 c6
line contact_shadow 64,130 208,130 c0`,
    cycles: [
      {
        name: "oil shimmer",
        areas: ["gl1", "gl2", "gl3", "gl4", "gl5", "gl6"],
        colors: [15, 14, 6],
        style: "pingpong",
        scatter: true,
        ms: 420
      }
    ],
    loops: []
  }
};

export const cover = {
  shot: "archetype: the split, yes: the crossing divides the cold night strait above from the secret acoustic telemetry below, beat: the dwarf; the ferry Tycho's massive black bow quarters slice east across the midnight strait at row 290, churning cyan wake; on the upper observation deck at row 160 stands the silhouette of courier holding the resonance violin against the cold mist, while Inspector Vane watches from the bridge companionway; the lower half (rows 290-469) plunges into deep sonar cross-sections and submerged hull plates vibrating with soundwaves; question: will the courier decipher the deep-water telemetry before dawn or be caught by the inspector; bg is 0; light: sodium yellow and phosphor cyan against cold marine black; moves: radar pulse sweep (rotate), spray glints on bow wake (pingpong).",
  titleAt: "top",
  draw: `poly sky_mist 0,120 479,120 479,290 0,290 fade:1,0/240,120/240,290
rect wheelhouse_glow 160,135,160,50 fade:11,1/240,135/240,185
poly superstructure 80,140 400,140 430,285 50,285 8
line deck_rail 60,210 420,210 c7
line deck_rail_lower 55,230 425,230 c8
poly hull_front 110,240 370,240 440,320 40,320 0 e8
rect deck_house 180,145,120,40 1
poly wheelhouse_win 190,148 290,148 285,165 195,165 3
poly vane_sil 260,150 268,148 274,152 272,168 262,168 0
poly bow_bulkhead 140,220 340,220 380,300 100,300 fade:8,0/240,220/240,300
poly courier_body 140,165 152,165 156,210 134,210 0
ellipse courier_head 146,158,5,6 0
poly violin_case 150,172 165,190 162,194 147,176 6 e14
poly violin_neck 163,188 174,202 172,204 161,190 14
poly mast 238,122 242,122 243,180 237,180 8
line mast_stay_l 240,126 120,210 c7
line mast_stay_r 240,126 360,210 c7
ellipse mast_lamp 240,124,3,3 14
poly water_surface 0,290 479,290 479,469 0,469 fade:1,bg/240,290/240,469
poly bow_wave_l 0,330 220,300 180,360 0,390 fade:3,1/100,310/0,390
poly bow_wave_r 479,330 260,300 300,360 479,390 fade:3,1/380,310/479,390
poly stem_wake 210,300 270,300 290,469 190,469 fade:11,bg/240,300/240,469
poly sonar_ring1 240,380 280,410 240,440 200,410 none e3
poly sonar_ring2 240,360 310,410 240,460 170,410 none e1
line sonar_spoke1 240,410 240,340 c11
line sonar_spoke2 240,410 320,410 c3
line sonar_spoke3 240,410 160,410 c3
line sonar_spoke4 240,410 240,469 c1
poly telemetry_cone 240,300 130,469 350,469 mix:1,bg@0.4
line w1 120,330 160,330 c11
line w2 100,345 150,345 c3
line w3 80,365 140,365 c11
line w4 320,330 360,330 c11
line w5 330,345 380,345 c3
line w6 340,365 400,365 c11
line w7 210,360 270,360 c15
line w8 190,390 290,390 c11
line w9 170,420 310,420 c3
poly wing_l 0,220 80,220 70,290 0,290 8
poly wing_r 400,220 479,220 479,290 410,290 8
line rib_l1 20,230 20,285 c0
line rib_l2 50,230 50,285 c0
line rib_r1 430,230 430,285 c0
line rib_r2 460,230 460,285 c0`,
  cycles: [
    {
      name: "radar sweep",
      areas: ["sonar_spoke1", "sonar_spoke2", "sonar_spoke4", "sonar_spoke3"],
      colors: [11, 3, 1, 0],
      style: "rotate",
      sweep: true,
      ms: 400
    },
    {
      name: "wake foam",
      areas: ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"],
      colors: [15, 11, 3],
      style: "pingpong",
      scatter: true,
      ms: 320
    }
  ],
  loops: []
};

export const boxart = {
  shot: "archetype: the dwarf; yes: the courier stands dwarfed before the towering steel hull, churning black strait, and searching sodium beam of the midnight ferry Tycho; beat: the icon; the courier in silhouette at x152 holding the {courier pouch} and {resonance violin} case, facing the vast iron ferry looming across x180-479; backdrop: cold open water and looming superstructure; the question: whether the courier can slip past the inspector and deliver the resonance device across the strait; bg: 0; light: cold marine glare and distant sickly sodium beam.",
  titleAt: "top",
  draw: `poly swell1 0,260 90,250 180,265 310,255 420,268 480,260 480,400 0,400 1
poly swell2 0,310 110,295 240,318 360,300 480,312 480,400 0,400 mix:1,0@0.6
poly bow 190,110 480,98 480,330 380,320 220,270 190,210 8
poly hull_shade 190,210 220,270 380,320 480,330 480,360 360,345 210,285 185,225 0
poly rubrail 192,205 480,120 480,128 192,213 7
poly superstructure 260,96 480,96 480,180 260,180 8
rect deckhouse 310,102,170,55 7
rect bridge_win 325,115,155,14 1
rect win_div1 350,115,4,14 0
rect win_div2 385,115,4,14 0
rect win_div3 420,115,4,14 0
rect win_div4 455,115,4,14 0
poly beam 335,110 0,280 0,380 345,114 mix:,14@0.25
poly mast 380,96 386,96 384,115 382,115 0
line stay1 383,98 330,115 c7
line stay2 383,98 440,115 c7
poly foam 170,250 240,285 360,335 480,350 480,365 350,350 230,300 160,260 11
dots foam_spray 165,248 178,255 192,268 215,278 250,295 280,310 320,325 370,340 410,352 445,358 c15
poly pier 0,280 180,270 210,400 0,400 8
poly pier_edge 0,280 180,270 182,277 0,288 7
rect pile1 40,285,16,115 0
rect pile2 110,280,18,120 0
rect pile3 175,273,20,127 0
poly bollard 85,268 97,268 95,285 87,285 0
ellipse bollard_cap 91,268,7,3 7
poly shadow_courier 140,365 195,350 205,356 145,372 mix:0,8@0.7
poly coat 144,305 160,305 166,355 138,355 0
ellipse head 152,295,5,7 0
rect neck 150,301,4,5 0
poly hat 145,293 159,293 157,288 147,288 0
line hat_brim 143,294 161,294 c7
poly arm_r 158,308 165,328 161,330 155,312 0
poly case 160,325 166,323 170,348 163,350 6
line case_rim 163,324 167,349 c14
poly arm_l 144,308 139,328 143,330 148,312 0
poly bag 136,324 144,324 145,340 135,340 6
line bag_strap 144,308 138,325 c7
rect leg_l 143,354,5,16 0
rect leg_r 154,354,5,16 0
rect shoe_l 140,368,8,4 0
rect shoe_r 153,368,8,4 0
outline courier e7
line splash1 180,280 190,275 c11
line splash2 205,295 215,290 c11
line wake1 0,340 120,335 c9
line wake2 40,370 160,365 c9`
};

// The colour the cover and the box art stand on, as the world states it (BRIEF.md §7); a world that states none has none: the game measures it from the rooms.
export const bg = 0;
