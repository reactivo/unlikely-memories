// Pictures for "The Lake Lights It Again" (worlds/boathouse/world.en.js), version 2: every picture drawn again from scratch under
// BRIEF §7 as it now stands, one per room and one per ending, written by hand in the short notation: 320 × 136, EGA colours 0-15,
// shapes back to front, ids on what the story may change. Phone crop: columns 47-272 carry the story; the wings (0-46, 273-319)
// carry the same place on. Every picture faces north (the lake lies north of the quay, the jetty runs north into it), so the
// low sun, in the west, stands on the left and its shadows fall to the right.
//
// The shot list, written before drawing (viewpoint, facing and vanishing point; palette; light; gradients and their causes;
// subject and columns; wings):
//   car        eye level through the car's front, facing north down the tunnel, one-point, vp 213,62; cellar; one light, the roof
//              lamp at x107 (halo 10/20/35% on flat walls and ceiling only); ONE gradient, the floor dark grey to black away from
//              the lamp; subject the grille on the bright arch on x213, the lamp on x107; wings: car posts, a strap, a red plate,
//              bench ends
//   quay       wide landscape over the lake, facing north, vp 107,64 (the jetty); goldenhour; one low sun in the west (a flat
//              disc, x58, no halo); gradients: the sky (12 up to 14 at the horizon) and the lake (14 to 6, the reflection fading
//              with the angle); everything else flat; solid cast shadows to the right; subject the jetty on x107 and the boathouse
//              wall with its chained door on x213; wings: nets on a rack at the left, floats and a ragged tree at the right
//   boathouse  eye level inside, facing north down the slip, one-point, vp 213,64; goldenhour inside (walls and floor flat brown,
//              tarred ceiling black), the lake through the doors in dusk (sky 1-5-12, flat yellow sun); one light, the lake
//              doors (halo and a pool on the planks, on flat surfaces); ONE gradient, the lake in the doors; no cast shadows
//              (indoor); subject the boat on the slip on x107, the lake doors at the vp on x213; wings: the quay door, hooks,
//              ropes and a net of glass floats at the left, a shelf, a bucket, a ladder and a boathook at the right
//   loft       flat elevation of the gable end under the roof, facing north, no vp; goldenhour; one light, the round window (halo
//              and a patch on the floor, flat surfaces); the glass is the only gradient (small); subject the round window on
//              x107, the ladder hatch and the oars across the beams on x213; wings: folded sails at the left, a chain and a lamp
//              bracket at the right
//   jetty      eye level along the planks, facing north, one-point, vp 107,68; goldenhour; one low sun in the west (flat disc,
//              x56); gradients: the sky and the lake only; the planks flat; short solid shadows of the near piles to the right;
//              subject the post at the end on x107, the island on x213; wings: reeds and a moored dinghy at the left, reeds and a
//              buoy at the right
//   lane       looking down the hill, facing north, one-point, vp 107,54; goldenhour; low sun from the west, so the right row's
//              upper walls are struck (light red bands) and the left row is in shade, with its solid shadow across the left of the
//              road; one gradient, the sky; subject the wedge of lake at the bottom on x107, the Heron with its lamp on x213;
//              wings: more houses, the notice on its post, a lamp
//   inn        flat elevation of the north wall, interior, no vp; lamplight; one main light, the fire on x107 (halo and pool, flat
//              wall and floor), the hanging lamp a small flat light; no gradient but the small window glass; subject the fire and
//              the tall chair on x107, the window on x178, Mrs Pell at the bar on x213; wings: a settle and a hook board at the
//              left, a table and chair at the right
//   churchyard far away, eye level over the wall, facing north, no vp; goldenhour; one low sun in the west (flat disc, x54);
//              gradients: the sky and the lake; the slope and the grass flat; solid shadows to the right; subject the chapel on
//              x107, the lychgate on x213 with the bell cote between; wings: a yew and a wall at the left, more stones at the right
//   lamp       (ending) from the island looking back south at the village, wide landscape at night, no vp; harbournight; one
//              light, the island's lamp, white, on x213, a halo on the flat sky; the water the only gradient; wings: dark shore
//              and reeds
//   keep       (ending) eye level at the jetty's end, facing north, no vp; dusk; the sky three bands of blue, magenta, light red
//              (the sun gone), flat dark water; the lantern on its post on x213 the main light (halo and pool on flat water and
//              planks); the empty boat coming in on x107; wings: reeds, a bollard
//   street     (ending) from the jetty's end looking out, facing north, one-point, vp 107,66; moonlight; the moon a flat disc on
//              x213 the only light; the water the only gradient; the street of lit windows going away to the vp; wings: black
//              reeds and the near planks
// Read down: neighbours (car-quay, quay-boathouse, quay-jetty, quay-lane, boathouse-loft, lane-inn, lane-churchyard) differ in
// viewpoint; the palettes are three for rooms (cellar, goldenhour, lamplight) and one each for the endings.

export default {
  // ---- THE FUNICULAR (the opening): looking north down the tunnel from inside the car --------------------------------------
  car: {
    version: 1,
    draw: `
      vp 213,62
      poly wall_l 0,0@1 0,136@1 0,136@0.17 0,0@0.17 1
      poly wall_r 320,0@1 320,136@1 320,136@0.17 320,0@0.17 1
      poly ceil 0,0@1 320,0@1 320,0@0.17 0,0@0.17 8
      poly floor 0,136@1 320,136@1 320,136@0.17 0,136@0.17 fade:8,0/107,136/213,76
      poly arch_sky 178,66 178,58 184,53 196,51 213,50 230,51 233,58 233,66 fade:12,14/213,50/213,66
      rect arch_lake 178,66,55,10 mix:1,9@0.3
      poly island_far 202,67 208,63 214,62 222,64 228,67 0
      line island_post 214,62 214,55 c0
      rect island_lamp 213,53,3,3 6
      rect grille 178,52,31,24 mix:0,8@0.45
      line grille_a 184,52 184,76 c8
      line grille_b 191,52 191,76 c8
      line grille_c 198,52 198,76 c8
      line grille_d 205,52 205,76 c8
      line grille_rail 178,60 209,60 c8
      line grille_lit 178,52 178,76 c14
      rect arch_post_l 172,52,5,24 8 e0
      rect arch_post_r 232,52,5,24 8 e0
      poly arch_lintel 170,53 182,48 213,46 244,48 238,53 213,51 184,53 8
      line rail_l 120,136@1 120,136@0.17 c6
      line rail_r 306,136@1 306,136@0.17 c6
      line cable 213,136@1 213,136@0.17 c1
      line sleeper_a 120,136@0.85 306,136@0.85 c6
      line sleeper_b 120,136@0.62 306,136@0.62 c6
      line sleeper_c 120,136@0.44 306,136@0.44 c6
      line sleeper_d 120,136@0.3 306,136@0.3 c6
      line ring_a 0,136@0.75 0,0@0.75 320,0@0.75 320,136@0.75 c8
      line ring_b 0,136@0.5 0,0@0.5 320,0@0.5 320,136@0.5 c8
      line ring_c 0,136@0.33 0,0@0.33 320,0@0.33 320,136@0.33 c8
      line brick_l1 0,26@1 0,26@0.17 c8
      line brick_l2 0,64@1 0,64@0.17 c8
      line brick_l3 0,104@1 0,104@0.17 c8
      line brick_r1 320,34@1 320,34@0.17 c8
      line brick_r2 320,72@1 320,72@0.17 c8
      line brick_r3 320,112@1 320,112@0.17 c8
      dots soot_l 66,30 82,52 74,84 120,40 134,62 c0
      dots soot_r 270,36 252,60 280,90 244,76 c0
      line scratch_boat 124,52 132,56 144,52 c8
      line scratch_boat2 132,50 132,41 c8
      poly window_r 320,50@0.55 320,50@0.42 320,90@0.42 320,90@0.55 0 e8
      poly bench_l 0,102 92,98 104,136 0,136 6 e0
      poly bench_r 320,102 238,98 228,136 320,136 6 e0
      line bench_l_lit 0,102 92,98 c14
      line slat_l1 0,113 98,109 c0
      line slat_l2 0,124 102,121 c0
      line slat_r1 320,113 232,109 c0
      line slat_r2 320,124 229,121 c0
      rect post_l 0,0,17,136 6 e0
      rect post_r 303,0,17,136 6 e0
      poly roof_beam 0,0 320,0 320,10 0,13 6 e0
      line strap 8,13 8,40 c0
      rect strap_loop 5,40,6,9 0 e6
      rect plate_r 309,40,9,12 4 e0
      line plate_lines 311,44 316,44 c0
      line plate_lines2 311,48 316,48 c0
      ellipse halo_c 107,29,34,28 mix:,14@0.1
      ellipse halo_b 107,29,22,18 mix:,14@0.2
      ellipse halo_a 107,29,12,10 mix:,14@0.35
      line lamp_cord 107,13 107,24 c0
      rect lamp_cage 103,23,9,3 6 e0
      ellipse lamp 107,29,4,5 14 e8
      dots drips 98,68 99,74 99,80 c14
    `,
    overlays: [{ object: "bottle", at: [58, 82] }]
  },

  // ---- THE QUAY: a wide landscape over the lake to the north, the jetty at the left third, the boathouse at the right -------
  quay: {
    version: 1,
    draw: `
      vp 107,64
      rect sky 0,0,320,66 fade:12,14/0,0/0,66
      ellipse sun 58,55,7,7 14
      line cloud_a 20,22 62,22 c14
      line cloud_b 118,28 150,28 c14
      line cloud_c 214,16 252,16 c14
      dots gulls 90,36 100,32 108,38 190,22 c0
      poly far_shore 0,66 0,60 30,57 66,59 110,57 150,59 200,57 250,59 320,56 320,66 mix:6,0@0.5
      dots far_win 24,61 52,60 96,59 124,59 176,60 232,59 286,58 c6
      poly island 136,66 143,62 152,61 162,62 170,66 0
      line island_post 153,61 153,50 c0
      rect island_lamp 151,48,4,3 6
      rect lake 0,64,320,38 fade:14,6/0,64/0,102
      line glitter_a 52,72 64,72 c12
      line glitter_b 50,78 66,78 c12
      line glitter_c 54,85 62,85 c14
      line glitter_d 48,92 68,92 c14
      line glitter_e 52,97 64,97 c14
      line ripple_a 14,76 34,76 c12
      line ripple_b 136,74 154,74 c6
      line ripple_c 138,90 158,90 c14
      line ripple_d 260,84 282,84 c14
      poly quay_ground 0,100 320,101 320,136 0,136 6
      poly coping 0,97 320,98 320,102 0,101 6 e0
      line coping_lit 0,97 92,98 c12
      poly jetty 82,100@1 132,100@1 132,100@0.12 82,100@0.12 6 e0
      line pl_a 82,100@0.9 132,100@0.9 c0
      line pl_b 82,100@0.76 132,100@0.76 c0
      line pl_c 82,100@0.64 132,100@0.64 c0
      line pl_d 82,100@0.53 132,100@0.53 c0
      line pl_e 82,100@0.43 132,100@0.43 c0
      line pl_f 82,100@0.34 132,100@0.34 c0
      line pl_g 82,100@0.26 132,100@0.26 c0
      line pl_h 82,100@0.19 132,100@0.19 c0
      rect pile_l1 81,91,3,9 0
      rect pile_r1 130,91,3,9 0
      rect pile_l2 91,80,2,6 0
      rect pile_r2 121,80,2,6 0
      rect jetty_post 105,60,4,9 0
      rect jetty_hook 108,62,3,2 14
      rect bh_wall 172,52,82,48 6 e0
      poly bh_strike 173,54 212,54 212,60 173,66 12
      poly bh_shade 238,53 253,53 253,99 238,99 mix:6,0@0.4
      poly bh_roof 164,54 186,38 212,32 240,38 262,54 0
      line bh_roof_lit 164,54 186,38 212,32 c12
      line bh_lit 172,53 172,99 c12
      rect boathouse_door 184,66,22,34 0 e6
      line door_chain 184,80 206,84 c6
      rect padlock 192,82,3,3 14
      rect bh_window 224,58,10,8 0 e6
      line bh_plank_a 180,54 180,99 c0
      line bh_plank_b 212,54 212,99 c0
      line bh_plank_c 219,54 219,99 c0
      line bh_plank_d 242,54 242,99 c0
      rect bh_step 182,100,26,3 0
      line bh_contact 172,100 254,100 c0
      line joint_a 14,108 70,106 c0
      line joint_b 90,118 150,116 c0
      line joint_c 190,110 250,111 c0
      line joint_d 40,126 120,125 c0
      dots stones 30,114 110,112 170,120 240,116 290,130 c12
      line rack_a 12,82 12,110 c0
      line rack_b 40,82 40,110 c0
      line rack_bar 10,84 42,84 c0
      poly nets 12,85 40,85 37,105 26,108 16,104 mix:6,0@0.5
      dots net_knots 18,92 28,96 34,90 24,102 32,100 c12
      poly tree_trunk 300,100 305,100 304,46 300,46 0
      poly tree 286,40 290,26 298,14 306,18 312,8 320,14 320,44 312,50 304,44 296,48 0 e12
      ellipse float_a 286,126,6,4 6 e0
      ellipse float_b 298,124,6,4 6 e0
      ellipse float_c 292,131,7,4 6 e0
      ellipse float_d 306,130,6,4 6 e0
      dots float_glints 284,123 296,121 290,128 304,127 c12
      poly sh_boathouse 254,100 320,101 320,118 240,118 0
      poly sh_rack 12,110 42,110 70,118 40,118 0
    `
  },

  // ---- THE BOATHOUSE: inside, looking north down the slip to the open lake doors; the lake in dusk through them -------------
  boathouse: {
    version: 1,
    draw: `
      vp 213,64
      poly wall_l 0,0@1 0,136@1 0,136@0.32 0,0@0.32 6
      poly wall_r 320,0@1 320,136@1 320,136@0.32 320,0@0.32 6
      poly ceil 0,0@1 320,0@1 320,0@0.32 0,0@0.32 0
      poly floor 0,136@1 320,136@1 320,136@0.32 0,136@0.32 6
      rect far_wall 145,43,102,44 6
      rect door_sky_a 163,46,66,13 fade:1,5/196,46/196,59
      rect door_sky_b 163,59,66,13 fade:5,12/196,59/196,72
      ellipse door_sun 176,70,5,5 14
      rect door_lake 163,72,66,15 fade:12,1/196,72/196,87
      line door_ripple_a 170,78 182,78 c12
      line door_ripple_b 204,82 220,82 c12
      rect door_post_l 160,44,4,44 0 e6
      rect door_post_r 228,44,4,44 0 e6
      rect door_lintel 158,41,76,6 0 e6
      line slip_a 30,136@1 30,136@0.32 c0
      line slip_b 88,136@1 88,136@0.32 c0
      line slip_c 150,136@1 150,136@0.32 c0
      line slip_d 205,136@1 205,136@0.32 c0
      line slip_e 262,136@1 262,136@0.32 c0
      line slip_f 305,136@1 305,136@0.32 c0
      line seam_a 0,136@0.8 320,136@0.8 c0
      line seam_b 0,136@0.6 320,136@0.6 c0
      line seam_c 0,136@0.45 320,136@0.45 c0
      line beam_a 0,0@0.9 320,0@0.9 c6
      line beam_b 0,0@0.65 320,0@0.65 c6
      line beam_c 0,0@0.45 320,0@0.45 c6
      line rafter_l1 60,0@1 60,0@0.32 c6
      line rafter_l2 130,0@1 130,0@0.32 c6
      line rafter_r1 266,0@1 266,0@0.32 c6
      line rafter_r2 190,0@1 190,0@0.32 c6
      poly boat_stern 80,100 140,100 134,122 86,122 0 e6
      poly boat_inside 74,96 146,96 138,88 82,88 6
      poly boat_rim 74,96 146,96 140,100 80,100 6 e0
      rect boat_seat 92,90,44,3 12
      rect rowlock_l 71,92,3,6 14
      rect rowlock_r 146,92,3,6 14
      line stern_p1 84,108 138,108 c6
      line stern_p2 86,116 136,116 c6
      line boat_lit 74,96 80,100 c12
      line boat_contact 86,122 134,122 c0
      poly door_quay 14,40@1 14,40@0.9 14,112@0.9 14,112@1 0 e6
      rect ladder_l 256,26,2,80 0
      rect ladder_r 268,26,2,80 0
      line rung_a 256,36 270,36 c0
      line rung_b 256,50 270,50 c0
      line rung_c 256,64 270,64 c0
      line rung_d 256,78 270,78 c0
      line rung_e 256,92 270,92 c0
      rect hatch 250,16,26,10 0
      dots hooks 0,50@0.95 0,50@0.8 0,50@0.66 0,50@0.55 c14
      ellipse ropes 34,72,9,7 mix:6,12@0.45 e0
      ellipse ropes_b 70,66,6,5 mix:6,12@0.45 e0
      poly float_net 8,84 40,84 36,108 14,108 mix:6,0@0.5
      ellipse floats 20,92,5,5 mix:14,12@0.5 e0
      dots floats_b 14,100 28,98 34,92 22,106 c14
      rect shelf 284,86,30,3 6 e0
      rect tin_r 290,76,8,10 4 e0
      poly bucket 302,78 312,78 310,86 304,86 0 e6
      line boathook 300,18 300,66 c0
      line boathook_head 296,18 304,18 c12
      rect lantern_hook 241,52,3,3 14
      poly door_pool 165,88 227,88 285,136 108,136 fade:,14/196,88/196,136
      ellipse door_halo_c 196,70,38,22 mix:,14@0.1
      ellipse door_halo_b 196,70,26,15 mix:,14@0.2
      ellipse door_halo 196,70,16,9 mix:,14@0.35
      dots dust 190,96 205,104 176,110 220,114 198,124 c14
    `,
    overlays: [{ object: "lantern", at: [234, 50] }]
  },

  // ---- THE LOFT: the gable end under the roof, the round window on the left third, the hatch and the oars on the right ------
  loft: {
    version: 1,
    draw: `
      poly wall_gable 22,112 22,58 160,8 298,58 298,112 6
      poly roof_l 0,0 160,0 160,8 22,58 22,112 0,116 0
      poly roof_r 320,0 160,0 160,8 298,58 298,112 320,116 0
      poly floor 0,112 320,112 320,136 0,136 6
      line rafter_l1 40,0 40,114 c6
      line rafter_l2 90,0 22,60 c6
      line rafter_r1 280,0 280,114 c6
      line rafter_r2 232,0 298,60 c6
      line wall_board_a 60,24 60,112 c0
      line wall_board_b 130,12 130,112 c0
      line wall_board_c 190,12 190,112 c0
      line wall_board_d 250,40 250,112 c0
      line tie_a 83,36 237,36 c6
      line tie_b 50,48 270,48 c6
      poly oars_shape 120,32 250,44 250,47 120,35 12 e0
      poly oars_blade 248,41 266,45 266,50 248,48 14 e0
      ellipse win_halo_c 107,62,44,36 mix:,12@0.1
      ellipse win_halo_b 107,62,30,25 mix:,12@0.2
      ellipse win_halo_a 107,62,21,19 mix:,14@0.35
      ellipse window_frame 107,62,17,17 0 e6
      ellipse window_glass 107,62,14,14 fade:1,12/107,48/107,76
      line window_bar_h 93,62 121,62 c0
      line window_bar_v 107,48 107,76 c0
      line window_lit 94,58 96,52 c14
      line board_a 0,122 320,122 c0
      line board_b 0,130 320,130 c0
      line plank_gap_a 70,112 60,136 c0
      line plank_gap_b 150,112 160,136 c0
      line plank_gap_c 290,112 300,136 c0
      poly dust_path 232,126 120,114 126,112 236,122 mix:6,0@0.5
      ellipse floor_light 112,118,42,7 fade:,14/112,112/112,125
      poly hatch 206,118 258,114 268,130 214,134 0
      line loft_ladder_l 224,120 224,96 c0
      line loft_ladder_r 242,119 242,95 c0
      line loft_rung_a 224,104 242,103 c0
      line loft_rung_b 224,112 242,111 c0
      poly sails 4,98 38,88 48,106 42,120 0,122 6 e0
      line fold_a 10,102 38,98 c0
      line fold_b 8,110 42,108 c0
      line fold_c 14,116 38,116 c0
      poly sail_b 8,70 40,64 44,88 12,92 6 e0
      poly sail_hang 22,64 36,60 34,76 24,78 6 e0
      poly chain_coil 280,118 310,114 314,126 284,130 0 e6
      dots chain_links 288,120 296,122 304,120 292,126 c14
      line bracket 288,30 288,54 306,54 c0
      rect bracket_bolt 287,32,3,3 14
      rect bracket_bolt2 286,50,3,3 14
      poly crate 52,102 84,100 86,116 54,118 6 e0
      line crate_slat 54,109 85,108 c0
      poly sack 250,102 274,100 278,114 254,116 6 e0
      line sack_tie 256,102 270,100 c0
      line cobweb_a 28,60 44,60 38,70 c12
      line cobweb_b 28,60 28,74 38,70 c12
      line brace_l 22,100 60,70 c0
      line brace_r 298,100 262,70 c0
      line dust_line_a 40,118 100,116 c6
      line dust_line_b 150,126 210,124 c6
      line sail_cord 150,0 150,12 c0
      dots nails 76,24 100,28 170,20 200,44 232,50 262,62 c14
      dots motes 96,82 110,90 120,98 100,104 114,76 c14
      dots floor_nails 40,124 100,128 160,124 230,128 c14
    `
  },

  // ---- THE JETTY: eye level along the planks to the post at the end, the island at the right, the low sun at the left -----
  jetty: {
    version: 1,
    draw: `
      vp 107,68
      rect sky 0,0,320,70 fade:12,14/0,0/0,70
      ellipse sun 56,60,7,7 14
      line cloud_a 130,22 176,22 c14
      line cloud_b 236,30 282,30 c14
      line cloud_c 20,34 52,34 c14
      dots gulls 150,40 160,36 168,42 78,24 c0
      poly far_shore 0,70 0,64 26,61 60,63 100,61 140,63 190,61 240,63 290,60 320,62 320,70 mix:6,0@0.5
      dots far_win 20,66 46,65 88,65 132,65 168,66 244,66 298,65 c6
      poly island 196,70 203,66 212,65 224,67 232,70 0
      line island_post 213,65 213,54 c0
      rect island_lamp 211,52,4,3 6
      rect lake 0,68,320,68 fade:14,6/0,68/0,136
      line glitter_a 50,78 62,78 c12
      line glitter_b 48,86 64,86 c12
      line glitter_c 52,94 62,94 c14
      line glitter_d 46,102 64,102 c14
      line glitter_e 50,110 60,110 c14
      line ripple_a 20,84 36,84 c12
      line ripple_b 150,88 176,88 c14
      line ripple_c 238,80 262,80 c12
      line ripple_d 262,100 290,100 c14
      line ripple_e 186,112 214,112 c14
      poly jetty 40,136@1 174,136@1 174,136@0.08 40,136@0.08 6 e0
      line plank_lit 40,136@1 40,136@0.08 c12
      line pl_a 40,136@0.92 174,136@0.92 c0
      line pl_b 40,136@0.8 174,136@0.8 c0
      line pl_c 40,136@0.68 174,136@0.68 c0
      line pl_d 40,136@0.57 174,136@0.57 c0
      line pl_e 40,136@0.47 174,136@0.47 c0
      line pl_f 40,136@0.38 174,136@0.38 c0
      line pl_g 40,136@0.3 174,136@0.3 c0
      line pl_h 40,136@0.22 174,136@0.22 c0
      rect pile_l1 42,106,8,24 0 e6
      rect pile_r1 164,106,8,24 0 e6
      rect pile_l2 68,88,5,14 0
      rect pile_r2 142,88,5,14 0
      rect pile_l3 84,78,3,8 0
      rect pile_r3 128,78,3,8 0
      rect post 104,58,6,18 0
      rect post_hook 109,64,3,2 14
      poly sh_pile_l1 50,126 124,134 124,136 44,136 0
      poly sh_pile_l2 73,100 112,105 112,106 71,106 0
      line reeds_l1 4,136 8,96 c0
      line reeds_l2 12,136 16,88 c0
      line reeds_l3 22,136 20,100 c0
      line reeds_l4 30,128 34,94 c0
      poly dinghy 6,110 36,108 32,120 12,120 0
      line dinghy_rim 6,110 36,108 c6
      line dinghy_rope 36,110 46,118 c0
      line reeds_r1 306,136 302,96 c0
      line reeds_r2 312,136 316,88 c0
      line reeds_r3 296,136 292,104 c0
      ellipse buoy 288,112,4,3 4 e0
      dots reeds_tips_l 8,96 16,88 20,100 34,94 c12
      dots reeds_tips_r 302,96 316,88 292,104 c12
      dots foam 138,128 154,130 270,128 286,130 c12
      line far_reeds_a 50,70 60,66 c0
      line far_reeds_b 150,70 158,66 c0
      dots lake_sparkle 70,94 100,100 130,106 290,98 c6
      line pile_cap_l1 42,106 50,106 c12
      line pile_cap_r1 164,106 172,106 c6
      line post_lit 104,58 104,76 c12
    `
  },

  // ---- THE LANE: looking north down the hill between two rows of houses, the lake at the bottom, the Heron lit on the right --
  lane: {
    version: 1,
    draw: `
      vp 107,54
      rect sky 0,0,320,66 fade:12,14/0,0/0,66
      rect lake_wedge 86,54,64,17 mix:14,6@0.5
      poly far_shore 86,54 100,52 118,53 134,51 150,54 150,58 86,58 mix:6,0@0.5
      poly road 0,136@1 320,136@1 320,136@0.2 0,136@0.2 6
      poly houses_l 0,0@1 0,136@1 0,136@0.2 0,0@0.2 6 e0
      poly houses_r 320,0@1 320,136@1 320,136@0.2 320,0@0.2 6 e0
      poly sun_r 320,18@0.84 320,18@0.2 320,48@0.2 320,48@0.84 12
      poly road_sun 262,136 318,136 152,72 146,72 12
      line div_l1 0,0@0.78 0,136@0.78 c0
      line div_l2 0,0@0.52 0,136@0.52 c0
      line div_r1 320,0@0.84 320,136@0.84 c0
      line div_r2 320,0@0.7 320,136@0.7 c0
      line div_r3 320,0@0.4 320,136@0.4 c0
      poly eave_l 0,0@1 0,16@1 0,16@0.2 0,0@0.2 0 e6
      poly eave_r 320,0@1 320,22@1 320,22@0.2 320,0@0.2 0 e6
      rect chimney_l 52,15,6,12 0
      rect chimney_r1 252,6,7,12 0
      rect chimney_r2 196,21,5,11 0
      poly win_l1 0,40@0.88 0,40@0.8 0,56@0.8 0,56@0.88 0 e6
      poly win_l2 0,40@0.64 0,40@0.58 0,54@0.58 0,54@0.64 0 e6
      poly win_l3 0,88@0.88 0,88@0.8 0,104@0.8 0,104@0.88 0 e6
      poly win_l4 0,86@0.64 0,86@0.58 0,98@0.58 0,98@0.64 0 e6
      poly win_r1 320,40@0.86 320,40@0.8 320,58@0.8 320,58@0.86 0 e6
      poly win_r2 320,40@0.72 320,40@0.66 320,56@0.66 320,56@0.72 0 e6
      poly win_r3 320,86@0.86 320,86@0.8 320,104@0.8 320,104@0.86 0 e6
      poly win_r4 320,70@0.44 320,70@0.4 320,80@0.4 320,80@0.44 0 e6
      poly heron_door 320,70@0.58 320,70@0.5 320,136@0.5 320,136@0.58 0 e6
      rect heron_sign 214,48,14,8 14 e0
      line sign_bird 217,54 221,50 225,54 c0
      line heron_arm 232,60 224,57 c0
      ellipse heron_lamp 222,57,3,3 6 e0
      poly door_l1 0,74@0.58 0,74@0.52 0,136@0.52 0,136@0.58 0 e6
      line kerb_l 0,136@0.9 0,136@0.2 c0
      line kerb_r 320,136@0.9 320,136@0.2 c0
      rect notice_post 252,70,3,60 0
      rect notice_board 242,70,26,16 15 e0
      line notice_l1 246,75 264,75 c0
      line notice_l2 246,80 260,80 c0
      rect lamp_1_post 29,40,3,96 0
      ellipse lamp_1 30,36,5,5 6 e0
      line lamp_1_arm 24,48 36,48 c0
      rect lamp_2_post 131,64,2,22 0
      ellipse lamp_2 132,61,2,3 6 e0
      dots cobbles_a 120,128 142,122 160,114 188,110 210,124 236,130 c0
      dots cobbles_b 150,126 176,120 200,116 260,122 c6
      line drainpipe_r 320,8@0.72 320,120@0.72 c0
      poly pot_plant 276,120 284,120 286,130 274,130 0 e6
      dots swallows 150,20 162,14 176,24 c0
      poly shutter_l1 0,40@0.8 0,40@0.77 0,56@0.77 0,56@0.8 0
      poly shutter_l3 0,88@0.8 0,88@0.77 0,104@0.77 0,104@0.8 0
      poly shutter_r1 320,40@0.8 320,40@0.77 320,58@0.77 320,58@0.8 0
      poly shutter_r3 320,86@0.8 320,86@0.77 320,104@0.77 320,104@0.8 0
      line sill_l1 0,56@0.88 0,56@0.8 c6
      line sill_r1 320,58@0.86 320,58@0.8 c6
      line plinth_l 0,120@1 0,120@0.2 c0
      line plinth_r 320,120@1 320,120@0.2 c0
      line gutter_l 0,18@0.78 0,18@0.2 c6
      dots stain_l 22,70 44,96 76,50 c0
      dots stain_r 290,50 270,90 240,40 c0
      ellipse cat 150,119,6,3 0
      line cat_tail 156,118 162,112 c0
      poly sh_road 0,136@1 170,136@1 170,136@0.2 0,136@0.2 0
    `
  },

  // ---- THE HERON: a flat view of the north wall: the fire and the tall chair at the left, the window, Mrs Pell at the bar -----
  inn: {
    version: 1,
    draw: `
      rect wall 0,18,320,86 6
      rect ceiling 0,0,320,18 0
      rect floor 0,104,320,32 0
      rect beam_a 0,8,320,8 6 e0
      rect beam_b 58,0,8,22 6 e0
      rect beam_c 190,0,8,22 6 e0
      dots beam_hooks 24,18 90,18 140,18 232,18 300,18 c14
      line floor_a 0,114 320,114 c6
      line floor_b 0,124 320,124 c6
      line floor_c 0,133 320,133 c6
      line floor_d 90,104 96,136 c6
      line floor_e 210,104 206,136 c6
      rect hearth 64,50,72,54 6 e0
      line stone_a 64,62 136,62 c0
      line stone_b 64,76 136,76 c0
      line stone_c 64,92 136,92 c0
      line stone_d 92,62 92,76 c0
      line stone_e 112,76 112,92 c0
      ellipse fire_halo_c 100,88,58,36 mix:,14@0.1
      ellipse fire_halo_b 100,88,38,26 mix:,14@0.2
      ellipse fire_halo_a 100,88,22,17 mix:,14@0.35
      ellipse fire_pool 100,119,40,7 fade:,14/100,112/100,126
      rect fire_open 78,66,44,38 0
      rect log_a 84,98,32,6 6 e0
      poly flames 88,100 92,84 98,90 102,76 108,88 114,82 118,100 14
      poly ember 94,100 100,92 106,96 112,100 4
      line hearth_lit 64,50 64,104 c14
      poly hearth_shade 128,50 136,50 136,104 128,104 mix:6,1@0.4
      rect mantel 58,44,86,6 6 e0
      rect candle 120,38,3,6 15
      rect mug 132,38,7,6 6 e0
      poly chair_back 146,54 166,54 166,98 146,98 0 e6
      rect chair_seat 144,94,24,5 6 e0
      rect chair_cushion 146,90,20,4 4
      line chair_leg_a 146,99 146,116 c0
      line chair_leg_b 166,99 166,116 c0
      line chair_lit 146,54 146,98 c14
      rect window 172,34,36,44 0 e6
      rect window_glass 174,36,32,40 fade:9,1/190,36/190,76
      line window_bar_v 190,36 190,76 c6
      line window_bar_h 174,54 206,54 c6
      dots window_island 196,64 c0
      rect window_sill 170,78,40,3 6 e0
      rect chair_b1 172,96,10,26 0 e6
      rect chair_b1_seat 170,106,14,3 6 e0
      ellipse table_b 190,116,16,4 6 e0
      rect table_b_leg 188,118,4,16 0
      rect bar_top 206,88,84,5 6 e0
      line bar_top_lit 206,88 290,88 c14
      rect bar 206,93,84,31 6 e0
      line bar_p1 224,93 224,124 c0
      line bar_p2 252,93 252,124 c0
      line bar_p3 274,93 274,124 c0
      rect shelf_back 210,72,76,3 6 e0
      dots bottles 216,68 224,68 238,68 252,68 268,68 280,68 c14
      rect photo_a 212,50,14,10 mix:6,14@0.4 e0
      rect photo_b 230,46,10,12 mix:6,14@0.4 e0
      rect photo_c 244,52,16,9 mix:6,14@0.4 e0
      rect photo_d 264,48,12,12 mix:6,14@0.4 e0
      poly pell_body 206,92 209,78 226,78 228,92 0
      ellipse pell_head 217,72,5,6 0
      rect pell_towel 223,80,3,9 15
      rect pell_cup 212,86,5,4 14
      line lamp_chain 250,0 250,36 c0
      poly lamp_shade 241,36 259,36 255,44 245,44 0 e6
      ellipse lamp_bulb 250,45,4,3 14
      ellipse table_a 298,112,20,5 6 e0
      rect table_a_leg 296,116,4,18 0
      rect chair_r 280,98,8,30 0 e6
      rect chair_r_seat 278,112,14,3 6 e0
      rect settle 0,88,44,30 6 e0
      rect settle_back 0,70,44,18 0 e6
      rect cushion_l 6,86,14,6 4
      rect hook_board 8,40,22,4 6 e0
      dots board_hooks 12,46 20,46 28,46 c14
      poly cap 14,46 24,46 22,52 16,52 0
    `,
    cycles: [{ name: "fire", areas: ["flames"], colors: [14, 6], style: "flicker", ms: [300, 700] }],
    overlays: [{ object: "matches", at: [84, 33] }]
  },

  // ---- THE CHURCHYARD: far away over the wall to the lake in the north, the chapel at the left, the lychgate at the right ----
  churchyard: {
    version: 1,
    draw: `
      rect sky 0,0,320,58 fade:12,14/0,0/0,58
      ellipse sun 54,50,7,7 14
      line cloud_a 100,20 140,20 c14
      line cloud_b 210,28 252,28 c14
      line cloud_c 20,30 46,30 c14
      poly far_shore 0,58 0,53 26,50 64,52 108,50 150,52 196,50 240,52 290,49 320,51 320,58 mix:6,0@0.5
      dots far_win 18,54 44,53 82,53 128,53 176,53 226,53 276,52 c6
      rect lake 0,58,320,34 fade:14,6/0,58/0,92
      poly island 150,58 157,54 166,53 175,55 182,58 0
      line island_post 166,53 166,43 c0
      rect island_lamp 164,41,4,3 6
      line glitter_a 48,64 60,64 c12
      line glitter_b 46,70 62,70 c12
      line glitter_c 50,76 60,76 c14
      line glitter_d 44,82 62,82 c14
      line ripple_a 100,68 124,68 c12
      line ripple_b 196,74 224,74 c14
      line ripple_c 250,66 276,66 c12
      poly slope 0,86 70,82 140,88 220,84 320,86 320,100 0,100 6
      poly roof_s1 38,92 46,86 58,92 0
      poly roof_s2 96,94 106,87 118,94 0
      poly roof_s3 228,92 238,85 252,92 0
      poly roof_s4 288,94 298,88 310,94 0
      dots village_windows 44,92 100,94 236,92 296,95 c6
      poly wall 0,96 320,98 320,108 0,106 6 e0
      line wall_top_lit 0,96 120,97 c12
      line wall_joint_a 20,101 60,102 c0
      line wall_joint_b 120,102 180,103 c0
      line wall_joint_c 252,102 300,103 c0
      poly grass 0,108 320,110 320,136 0,136 6
      poly sh_chapel 138,104 196,104 184,120 128,120 0
      poly sh_lych 245,104 300,104 286,118 236,118 0
      rect chapel 72,40,66,64 6 e0
      poly chapel_strike 73,56 96,56 96,62 73,68 12
      line chapel_lit 72,41 72,103 c12
      poly chapel_roof 66,44 94,24 112,19 130,25 144,44 0 e12
      poly chapel_door 96,104 96,80 104,74 112,80 112,104 0 e6
      rect chapel_window 80,54,6,12 0 e6
      rect chapel_window_b 124,54,6,12 0 e6
      line chapel_course_a 73,72 138,72 c0
      line chapel_course_b 73,90 96,90 c0
      rect cote_post_l 152,74,3,30 0
      rect cote_post_r 166,74,3,30 0
      poly cote_roof 148,74 158,64 170,74 0 e12
      ellipse bell 160,80,4,5 14
      line bell_rope 160,85 160,92 c0
      rect lych_post_l 190,62,5,42 0 e6
      rect lych_post_r 240,62,5,42 0 e6
      rect lych_beam 188,62,58,5 0
      poly lych_roof 184,62 216,46 248,62 0 e12
      dots lych_nails 196,65 204,65 212,65 220,65 228,65 c14
      line grass_a 14,118 18,112 c12
      line grass_b 60,128 64,122 c12
      line grass_c 150,116 154,110 c12
      line grass_d 200,130 204,124 c12
      line grass_e 272,128 276,122 c12
      poly stone_a 38,114 41,99 51,97 54,114 0 e6
      poly stone_b 80,120 83,105 93,104 94,120 0 e6
      poly stone_c 124,126 126,111 141,108 143,126 0 e6
      poly stone_d 222,118 225,103 238,102 241,118 0 e6
      poly stone_e 258,124 263,107 276,109 277,124 0 e6
      poly stone_f 290,118 292,103 305,100 308,118 0 e6
      poly stone_g 300,131 303,114 316,113 318,131 0 e6
      line stone_boat_a 82,112 90,114 c6
      line stone_boat_b 294,108 301,110 c6
      poly yew 0,22 6,6 16,12 24,0 36,8 44,24 40,50 46,70 40,96 0,96 0 e12
      poly yew_trunk 14,96 22,96 20,108 16,108 0
    `,
    overlays: [{ object: "boat_key", at: [206, 64] }]
  },
};

// ---- The ending pictures (world.en.js adds each with its alt): their palettes at their boldest, one subject each --------------
export const endings = {
  // THE LAMP (harbournight): from the island, back south at the village; the island's lamp lit white on x213, the village
  // shining upside down in the black water, and one lamp more in the lake than above
  lamp: {
    version: 1,
    draw: `
      rect sky 0,0,320,64 0
      poly sky_glow 0,52 320,52 320,64 0,64 1
      dots stars_a 20,8 50,22 88,12 130,30 170,10 252,12 290,30 306,8 c15
      dots stars_b 36,36 112,6 152,40 274,44 66,40 c15
      rect water 0,64,320,72 fade:1,0/0,64/0,136
      poly shore_l 0,64 0,58 30,56 150,58 150,64 0
      poly house_a 22,58 30,48 40,48 48,58 0
      poly house_b 50,58 56,44 68,42 76,58 0
      poly house_c 78,58 84,50 96,48 102,58 0
      poly house_d 104,58 110,46 122,44 128,58 0
      poly house_e 130,58 138,50 148,50 152,58 0
      rect tower 124,26,8,22 0
      poly tower_roof 122,26 128,18 134,26 0
      rect chimney_a 34,42,4,8 0
      rect chimney_b 62,36,4,8 0
      dots windows_a 30,54 36,54 60,52 66,48 70,54 c15
      dots windows_b 88,54 94,54 114,52 118,48 136,54 142,54 c15
      dots windows_c 128,36 128,42 c15
      poly refl_shore 0,64 150,64 150,70 0,70 0
      poly refl_a 22,70 30,80 40,80 48,70 0
      poly refl_b 50,70 56,84 68,86 76,70 0
      poly refl_c 78,70 84,78 96,80 102,70 0
      poly refl_d 104,70 110,82 122,84 128,70 0
      poly refl_e 130,70 138,78 148,78 152,70 0
      dots refl_windows_a 30,74 36,74 60,76 66,80 70,74 c15
      dots refl_windows_b 88,74 94,74 114,76 118,80 136,74 142,74 c15
      dots refl_windows_c 128,92 128,86 c15
      line refl_stroke_a 24,72 46,72 c1
      line refl_stroke_b 80,82 100,82 c1
      line refl_stroke_c 112,88 130,88 c1
      poly island 164,136 168,110 190,102 240,100 268,106 292,136 0
      line island_post 213,102 213,50 c0
      poly lamp_cap 207,38 213,32 219,38 0
      ellipse halo_c 213,44,34,18 mix:,15@0.1
      ellipse halo_b 213,44,22,13 mix:,15@0.2
      ellipse halo_a 213,44,13,9 mix:,15@0.35
      rect lamp_glass 208,38,10,13 15
      rect lamp_base 207,51,12,2 0
      line lamp_lit 207,38 207,51 c15
      line island_rung_a 206,70 220,70 c0
      line island_rung_b 206,82 220,82 c0
      line island_rung_c 206,94 220,94 c0
      ellipse lamp_ghost 140,104,3,2 14
      line lamp_ghost_ref 138,108 142,108 c14
      line wave_a 150,90 190,90 c1
      line wave_b 230,90 270,90 c1
      line wave_c 100,100 140,100 c1
      line wave_d 100,116 150,116 c1
      line wave_e 20,108 70,108 c1
      line wave_f 20,124 80,124 c1
      line reeds_l1 4,136 8,96 c0
      line reeds_l2 12,136 16,90 c0
      line reeds_l3 22,136 20,100 c0
      line reeds_l4 32,136 38,94 c0
      line reeds_r1 304,136 300,98 c0
      line reeds_r2 312,136 316,90 c0
      line reeds_r3 296,136 292,106 c0
      poly near_bank_l 0,136 0,118 24,124 40,136 0
      poly near_bank_r 320,136 320,120 296,126 282,136 0
      dots stars_c 16,56 96,34 186,22 246,36 c15
      dots island_reeds 170,108 180,104 262,104 c1
    `
  },

  // THE KEEPER (dusk): the lit lantern on the jetty's post on x213, an empty boat coming in on x107
  keep: {
    version: 1,
    draw: `
      rect sky_a 0,0,320,26 fade:1,5/0,0/0,26
      rect sky_b 0,26,320,30 fade:5,12/0,26/0,56
      dots first_stars 30,10 90,18 150,8 270,14 c15
      line cloud_a 20,34 90,34 c12
      line cloud_b 200,22 280,22 c12
      line cloud_c 120,42 170,42 c5
      poly far_shore 0,56 0,50 40,46 90,52 150,48 210,51 270,47 320,50 320,56 0
      poly house_a 20,50 28,42 40,42 46,50 0
      poly house_b 54,50 60,40 72,40 80,50 0
      poly house_c 100,50 108,38 120,38 126,50 0
      poly house_d 140,50 146,44 158,44 164,50 0
      poly house_e 170,50 178,42 190,42 196,50 0
      dots far_lights 24,48 36,48 58,46 66,46 108,44 116,44 144,48 152,48 174,48 184,48 c14
      rect water 0,56,320,80 1
      dots far_lights_refl 24,60 36,62 58,64 66,60 108,66 116,62 144,60 152,64 174,62 184,64 c14
      line sunset_a 20,60 80,60 c5
      line sunset_b 120,58 190,58 c12
      line sunset_c 250,62 310,62 c5
      line sunset_d 60,70 130,70 c5
      poly island 250,56 260,52 272,51 288,53 300,56 0
      line island_post 274,51 274,42 c0
      rect island_lamp 272,40,4,3 0
      ellipse halo_c 211,76,34,22 mix:,14@0.1
      ellipse halo_b 211,76,22,15 mix:,14@0.2
      ellipse halo_a 211,76,13,10 mix:,14@0.35
      poly deck 150,136 320,136 320,118 226,110 200,110 0
      ellipse lantern_pool 213,112,36,6 fade:,14/213,108/213,120
      line deck_p1 170,128 310,128 c1
      line deck_p2 190,120 316,120 c1
      line deck_p3 206,114 250,114 c1
      line deck_p4 160,134 316,134 c1
      poly post 210,64 217,64 217,112 210,112 0
      rect post_hook 217,72,5,2 0
      poly lantern_cap 203,68 214,68 211,64 206,64 0
      rect lantern_glass 204,69,9,11 14 e12
      rect lantern_base 204,80,9,2 0
      line post_lit 210,66 210,110 c14
      poly boat_hull 70,90 150,90 140,100 82,100 0
      poly boat_bow 150,90 162,82 152,96 0
      poly boat_stern 64,84 72,90 70,100 0
      line thwart 100,90 100,86 c0
      line oar_a 84,88 112,78 c0
      line oar_b 128,88 100,76 c0
      poly boat_refl 70,102 150,102 140,108 82,108 0
      line boat_wake_a 40,96 66,96 c12
      line boat_wake_b 30,102 60,102 c12
      line wave_a 190,90 204,90 c12
      line wave_b 240,86 262,86 c12
      line wave_c 110,116 150,116 c12
      line wave_d 20,120 70,120 c12
      line wave_e 60,130 110,130 c12
      line wave_f 290,96 316,96 c12
      line reeds_l1 4,136 8,98 c0
      line reeds_l2 12,136 16,90 c0
      line reeds_l3 22,136 20,104 c0
      line reeds_l4 32,136 38,96 c0
      line reeds_r1 308,136 304,98 c0
      line reeds_r2 316,136 319,92 c0
      ellipse coil 292,126,10,4 0
      poly bollard 280,118 288,118 288,128 280,128 0
      line mooring_rope 288,122 250,124 c0
      dots foam 40,110 90,122 300,110 c12
    `
  },

  // THE STREET (moonlight): the moon on x213, the street of lit windows laid across the water, going away to the vp on x107
  street: {
    version: 1,
    draw: `
      vp 107,66
      rect sky 0,0,320,66 fade:0,1/0,0/0,66
      dots stars_a 20,8 60,20 100,10 140,28 180,8 250,14 290,22 c15
      dots stars_b 40,40 120,6 200,40 270,6 306,44 c9
      ellipse moon 213,24,9,9 15
      poly far_shore 0,66 0,62 40,58 100,63 160,60 230,62 290,58 320,61 320,66 0
      dots far_lamps 50,62 82,64 130,62 190,63 240,61 c11
      rect water 0,66,320,70 fade:9,0/0,66/0,136
      poly street 60,136@1 160,136@1 160,136@0.06 60,136@0.06 mix:9,1@0.35
      poly row_l 20,44@1 20,136@1 20,136@0.06 20,44@0.06 0 e1
      poly row_r 190,44@1 190,136@1 190,136@0.06 190,44@0.06 0 e1
      line div_l1 20,44@0.8 20,136@0.8 c1
      line div_l2 20,44@0.62 20,136@0.62 c1
      line div_l3 20,44@0.46 20,136@0.46 c1
      line div_l4 20,44@0.3 20,136@0.3 c1
      line div_r1 190,44@0.84 190,136@0.84 c1
      line div_r2 190,44@0.66 190,136@0.66 c1
      line div_r3 190,44@0.5 190,136@0.5 c1
      line div_r4 190,44@0.34 190,136@0.34 c1
      dots win_l_a 20,84@0.95 20,84@0.8 20,84@0.66 20,84@0.54 20,84@0.44 20,84@0.36 20,84@0.28 20,84@0.2 c15
      dots win_l_b 20,104@0.9 20,104@0.74 20,104@0.6 20,104@0.5 20,104@0.4 20,104@0.32 20,104@0.24 c15
      dots win_l_c 20,64@0.86 20,64@0.7 20,64@0.56 20,64@0.46 20,64@0.38 20,64@0.3 c11
      dots win_r_a 190,84@0.95 190,84@0.8 190,84@0.66 190,84@0.54 190,84@0.44 190,84@0.36 190,84@0.28 190,84@0.2 c15
      dots win_r_b 190,104@0.9 190,104@0.74 190,104@0.6 190,104@0.5 190,104@0.4 190,104@0.32 190,104@0.24 c15
      dots win_r_c 190,64@0.86 190,64@0.7 190,64@0.56 190,64@0.46 190,64@0.38 190,64@0.3 c11
      line street_mid 107,136@1 107,136@0.06 c9
      line street_edge_l 60,136@1 60,136@0.06 c9
      line street_edge_r 160,136@1 160,136@0.06 c9
      line moon_ref_a 207,70 219,70 c15
      line moon_ref_b 204,76 222,76 c15
      line moon_ref_c 208,84 218,84 c11
      line moon_ref_d 203,94 223,94 c15
      line moon_ref_e 206,106 220,106 c11
      line wave_a 230,80 262,80 c1
      line wave_b 270,90 306,90 c1
      line wave_c 250,118 290,118 c1
      poly deck 0,136 320,136 320,124 0,124 0
      line deck_p1 20,130 300,130 c1
      line deck_p2 80,124 90,136 c1
      line deck_p3 190,124 180,136 c1
      line deck_p4 270,124 280,136 c1
      poly bollard_l 30,114 38,114 38,126 30,126 0
      poly bollard_r 282,116 290,116 290,126 282,126 0
      line reeds_l1 4,124 8,86 c0
      line reeds_l2 14,124 18,80 c0
      line reeds_r1 308,124 304,88 c0
      line reeds_r2 316,124 319,82 c0
      poly roofs_l 20,44@1 20,30@1 20,30@0.06 20,44@0.06 0 e1
      poly roofs_r 190,44@1 190,30@1 190,30@0.06 190,44@0.06 0 e1
      rect chimney_l 30,26,5,8 0
      rect chimney_r 150,38,4,6 0
      dots win_l_d 20,94@0.85 20,94@0.7 20,94@0.58 20,94@0.48 20,94@0.4 20,94@0.32 c15
      dots win_r_d 190,94@0.85 190,94@0.7 190,94@0.58 190,94@0.48 190,94@0.4 190,94@0.32 c15
      dots lamps_l 20,56@0.9 20,56@0.66 20,56@0.5 20,56@0.38 c11
      dots lamps_r 190,56@0.9 190,56@0.66 190,56@0.5 190,56@0.38 c11
      dots stars_c 80,30 160,14 230,30 c15
      line moon_ref_f 212,118 218,118 c15
      line wave_d 100,100 130,100 c1
      line wave_e 190,112 230,112 c1
      poly skiff_far 250,70 262,70 258,74 254,74 0
      line horizon_glow 0,66 320,66 c11
    `
  }
};
