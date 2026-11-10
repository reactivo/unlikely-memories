// Pictures for "The Lake Lights It Again" (worlds/boathouse/world.en.js), one per room and one per ending, written by hand
// in the short notation (BRIEF.md §7): 320 × 136, EGA colours 0-15, shapes back to front, ids on what the story may change.
// Phone crop: columns 47-272 carry the story; the wings (0-46, 273-319) carry the same place on.
//
// The shot list, written before drawing (viewpoint and vanishing point; palette; light; gradients and their causes; subject
// and columns; wings):
//   car        eye level through the car's front, one-point, vp 213,62; cellar; one roof lamp at x107 (halo 10/20/35%), the arch's
//              glow on the floor; walls blue to black from the lamp (light falling off), floor dark grey to black away from the lamp;
//              subject the grille on the bright arch at the far end, on the third x213, the lamp on the other third x107; wings: car
//              posts, a strap, a red plate, bench ends
//   quay       wide landscape across the lake, no vp, horizon 64; goldenhour; one low sun at x178 (halo 10/20/35%); sky 12 up, 14 at
//              the horizon (sky deepening upward), lake 14 to 6 (reflection fading with the angle), hill 12 to 6 (surface turning from
//              the sun); solid cast shadows to the left; subject the boathouse on x107 and the funicular on the hill at x213; wings:
//              nets on a rack at the left, a ragged tree and a stack of floats at the right
//   boathouse  eye level inside, one-point, vp 213,64; goldenhour inside, the lake through its doors in dusk; one light, the doors
//              (a pool on the planks fading from the doors to nothing); subject the boat on the slip on x107 and the lake doors at
//              the vp on x213; wings: hooks and a net of glass floats at the left, a shelf with a bucket and a ladder at the right
//   loft       from a corner, under the roof's slope, no vp; goldenhour; the round window the one light (a patch on the floor fading
//              from the window); subject the round window on x107, the ladder hatch and the oars on the rafters on x213; wings:
//              sails at the left, a chain and a lamp bracket at the right
//   jetty      eye level along the planks, one-point, vp 213,68; goldenhour; one sun low at the end, x245; sky 12 up to 14, water
//              14 to 6; long cast shadows toward the viewer; subject the post at the end on x213, the island on x107; wings: reeds
//              and a moored dinghy at the left, reeds and a rope at the right
//   lane       looking up the hill, one-point, vp 107,48; goldenhour; low sun from the left, so the right row is lit (light red,
//              turning to brown away from the sun) and the left row in shade; solid shadows of the left row across the road;
//              subject the path to the churchyard on x107 and the Heron with its lamp on x213; wings: more houses, the notice on
//              its post, a wedge of the lake between roofs
//   inn        flat elevation, interior, no vp; lamplight; two lights, the fire (x107) and a hanging lamp (x213), each with a halo;
//              walls darken upward away from the lamps (light falling off); subject the fire and the tall chair on x107, the bar,
//              the photographs and Mrs Pell on x213; wings: tables turned to a blue window at the right, a lamp bracket at the left
//   churchyard far away, eye level over the wall, no vp; goldenhour; a low sun at the right, x258; sky 12 up, 14 at the horizon;
//              lake 14 to 6; cast shadows toward the left; subject the chapel on x107 and the lychgate on x213; wings: a yew and a
//              wall at the left, more stones and the lake at the right
//   lamp       (ending) wide landscape at night, no vp; harbournight; one light, the island's lamp, white, on x213; sky black to blue
//              upward (the sky deepening upward), water the same, the village upside down in it; wings: the dark shore and reeds
//   keep       (ending) eye level, the jetty's end, no vp; dusk; sky blue to magenta to light red toward the horizon (the sun gone);
//              black silhouettes; the lantern the one lit thing on the post at x213, the empty boat coming in on x107; wings: reeds
//   street     (ending) from the jetty's end looking out, one-point, vp 160,66; moonlight; the moon the only light, a flat disc on
//              x213; the street of lit windows in the water, going away to the vp; wings: black reeds and the near planks
// Read down: neighbours (car-quay, quay-boathouse, quay-jetty, quay-lane, boathouse-loft, lane-inn, lane-churchyard) differ in
// viewpoint; the palettes are three for rooms (cellar, goldenhour, lamplight) and one each for the endings.

export default {
  // ---- THE FUNICULAR (the opening): looking down the tunnel from inside the car -----------------------------------------
  car: {
    version: 1,
    draw: `
      vp 213,62
      poly wall_l 0,0@1 0,136@1 0,136@0.17 0,0@0.17 fade:1,0/107,20/205,62
      poly wall_r 320,0@1 320,136@1 320,136@0.17 320,0@0.17 fade:1,0/150,20/238,62
      poly ceil 0,0@1 320,0@1 320,0@0.17 0,0@0.17 fade:8,0/107,10/213,62
      poly floor 0,136@1 320,136@1 320,136@0.17 0,136@0.17 fade:8,0/107,136/213,76
      poly arch_sky 175,66 175,57 181,52 195,50 213,49 231,50 233,57 233,66 fade:12,14/213,49/213,66
      rect arch_lake 175,66,58,10 mix:1,9@0.3
      poly island_far 200,67 206,63 214,62 222,64 228,67 0
      line island_post 214,62 214,55 c0
      rect island_lamp 213,53,3,3 8
      rect grille 176,51,30,25 mix:0,8@0.45
      line grille_a 182,51 182,76 c8
      line grille_b 189,51 189,76 c8
      line grille_c 196,51 196,76 c8
      line grille_rail 176,58 206,58 c8
      rect arch_post_l 171,51,4,25 8 e0
      rect arch_post_r 232,51,4,25 8 e0
      poly arch_lintel 169,52 181,47 213,45 243,47 238,52 213,50 183,52 8
      line rail_l 120,136@1 120,136@0.17 c6
      line rail_r 306,136@1 306,136@0.17 c6
      line cable 213,136@1 213,136@0.17 c1
      line sleeper_a 120,136@0.85 306,136@0.85 c6
      line sleeper_b 120,136@0.62 306,136@0.62 c6
      line sleeper_c 120,136@0.44 306,136@0.44 c6
      line sleeper_d 120,136@0.31 306,136@0.31 c6
      line ring_a 0,136@0.75 0,0@0.75 320,0@0.75 320,136@0.75 c8
      line ring_b 0,136@0.5 0,0@0.5 320,0@0.5 320,136@0.5 c8
      line ring_c 0,136@0.33 0,0@0.33 320,0@0.33 320,136@0.33 c1
      line brick_l1 0,22@1 0,22@0.17 c8
      line brick_l2 0,47@1 0,47@0.17 c8
      line brick_l3 0,69@1 0,69@0.17 c8
      line brick_l4 0,98@1 0,98@0.17 c8
      line brick_r1 320,30@1 320,30@0.17 c8
      line brick_r2 320,55@1 320,55@0.17 c8
      line brick_r3 320,84@1 320,84@0.17 c8
      line brick_r4 320,110@1 320,110@0.17 c8
      dots soot_l 66,30 82,52 74,84 120,40 134,62 128,92 98,70 150,52 c0
      dots soot_r 270,36 252,60 280,90 244,76 262,106 c0
      line scratch_boat 124,52 132,56 144,52 c8
      line scratch_boat2 132,50 132,41 c8
      poly bench_l 0,102 92,98 104,136 0,136 6 e0
      poly bench_r 320,102 238,98 228,136 320,136 6 e0
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
      rect lamp_base 103,22,9,4 6 e0
      ellipse lamp 107,29,4,5 14 e8
      ellipse arch_halo 205,62,34,18 mix:,14@0.12
      ellipse arch_glow 205,83,36,6 mix:,12@0.3
      ellipse puddle 150,126,26,4 mix:1,14@0.3
      dots drips 98,68 99,74 99,80 c14
    `,
    overlays: [{ object: "bottle", at: [58, 82] }]
  },

  // ---- THE QUAY: a wide landscape across the lake, the boathouse at the left, the funicular and the village at the right ---
  quay: {
    version: 1,
    draw: `
      rect sky 0,0,320,66 fade:12,14/0,0/0,66
      ellipse sunhalo_c 178,46,38,30 mix:,14@0.1
      ellipse sunhalo_b 178,46,24,19 mix:,14@0.2
      ellipse sunhalo_a 178,46,14,12 mix:,14@0.35
      ellipse sun 178,46,8,7 14
      poly far_hills 0,66 0,62 26,58 58,61 96,60 140,63 190,61 240,62 320,57 320,66 mix:12,6@0.4
      rect lake 0,64,320,38 fade:14,6/0,64/0,102
      rect sun_path 172,64,14,36 mix:,14@0.35
      dots glitter 176,68 182,72 178,78 183,84 174,90 180,95 c14
      line ripple_a 196,74 210,74 c14
      line ripple_b 224,82 240,82 c14
      line ripple_c 184,92 202,92 c12
      line ripple_d 140,98 156,98 c12
      poly island 204,64 211,60 221,59 230,62 236,64 0
      line island_post 220,59 220,48 c0
      rect island_lamp 218,46,4,3 6
      poly bank 0,64 40,66 100,74 150,86 150,102 0,102 fade:6,0/140,80/0,70
      dots bank_bush 16,72 34,70 52,74 70,76 88,80 112,84 c0
      dots bank_lit 100,78 120,82 134,86 c12
      poly hill 205,102 215,86 238,66 270,46 320,28 320,102 fade:12,6/205,90/320,40
      line rail_a 222,100 246,80 276,56 320,40 c0
      line rail_b 228,102 252,82 282,58 320,43 c0
      line village_steps 258,98 274,84 296,70 320,60 c12
      rect station 214,88,24,12 6 e0
      poly station_roof 211,89 226,80 241,88 0 e12
      rect house_a 258,60,16,12 12 e6
      poly roof_a 256,60 266,52 276,60 0 e12
      rect win_a 264,64,4,4 0
      rect house_b 282,44,16,12 12 e6
      poly roof_b 280,44 290,37 300,44 0 e12
      rect win_b 288,48,4,4 0
      rect house_d 236,72,14,10 12 e6
      poly roof_d 234,72 243,65 252,72 0 e12
      rect win_d 241,75,4,4 0
      rect bh_wall 76,52,70,46 fade:6,12/76,70/146,70 e6
      poly bh_roof 68,56 94,38 112,32 130,36 154,56 0 e12
      line bh_ridge 94,38 112,32 130,36 c6
      rect boathouse_door 94,64,24,34 0 e6
      line door_chain 94,78 118,82 c12
      rect padlock 104,80,4,4 14
      rect bh_window 106,44,8,6 0 e12
      line plank_a 82,54 82,98 c0
      line plank_b 88,54 88,98 c6
      line plank_c 126,54 126,98 c0
      line plank_d 138,54 138,98 c0
      poly quay_ground 0,100 320,101 320,136 0,136 6
      rect coping 0,97,320,5 12 e0
      poly jetty 150,102 176,102 170,74 162,74 6 e0
      line jetty_p1 152,98 174,98 c0
      line jetty_p2 154,92 173,92 c0
      line jetty_p3 156,86 171,86 c0
      line jetty_p4 158,80 170,80 c0
      rect jetty_post 164,70,4,10 0
      line joint_a 20,108 70,106 c0
      line joint_b 90,118 150,116 c0
      line joint_c 190,110 260,111 c0
      line joint_d 40,126 120,125 c0
      line joint_e 200,124 300,122 c0
      dots stones 30,114 110,112 170,120 240,116 290,130 c12
      line rack_a 10,84 10,112 c0
      line rack_b 40,84 40,112 c0
      line rack_bar 8,86 42,86 c0
      poly nets 10,87 40,87 36,108 18,110 12,100 mix:6,0@0.5
      dots net_knots 16,92 26,96 32,90 22,104 30,102 c12
      poly tree_trunk 300,102 304,102 305,48 301,48 0
      poly tree 288,40 292,24 300,14 308,18 314,10 320,16 320,44 312,50 304,44 296,48 0
      ellipse float_a 286,116,6,4 12 e0
      ellipse float_b 298,114,6,4 14 e0
      ellipse float_c 292,122,7,5 12 e0
      ellipse float_d 304,121,6,4 14 e0
      poly sh_boathouse 80,99 146,99 128,127 52,127 0
      poly sh_rack 12,112 40,112 30,126 4,126 0
      poly sh_floats 282,121 312,121 306,132 276,132 0
      ellipse quay_light 150,120,90,12 mix:,12@0.25
    `
  },

  // ---- THE BOATHOUSE: inside, looking down the slip to the open lake doors; the lake in dusk through them -----------------
  boathouse: {
    version: 1,
    draw: `
      vp 213,64
      poly wall_l 0,0@1 0,136@1 0,136@0.32 0,0@0.32 fade:12,6/145,64/0,64
      poly wall_r 320,0@1 320,136@1 320,136@0.32 320,0@0.32 fade:12,6/247,64/320,64
      poly ceil 0,0@1 320,0@1 320,0@0.32 0,0@0.32 fade:6,0/213,43/213,0
      poly floor 0,136@1 320,136@1 320,136@0.32 0,136@0.32 6
      rect far_wall 145,43,102,44 6
      rect door_sky_a 163,46,66,13 fade:1,5/196,46/196,59
      rect door_sky_b 163,59,66,13 fade:5,12/196,59/196,72
      ellipse door_sun 196,71,6,5 14
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
      line beam_a 0,0@0.9 320,0@0.9 c0
      line beam_b 0,0@0.65 320,0@0.65 c0
      line beam_c 0,0@0.45 320,0@0.45 c0
      line rafter_l1 60,0@1 60,0@0.32 c0
      line rafter_l2 130,0@1 130,0@0.32 c0
      line rafter_r1 266,0@1 266,0@0.32 c0
      line rafter_r2 190,0@1 190,0@0.32 c0
      poly boat 78,100 146,100 138,124 86,124 0 e6
      poly boat_rim 74,98 150,98 146,102 78,102 6 e0
      poly boat_inside 80,92 144,92 150,98 74,98 6
      rect boat_seat 92,94,44,3 12
      rect rowlock_l 72,92,3,6 14
      rect rowlock_r 149,92,3,6 14
      line stern_p1 80,108 144,108 c6
      line stern_p2 82,116 142,116 c6
      line ladder 262,26 262,104 c12
      line ladder_r 274,26 274,104 c12
      line rung_a 262,36 274,36 c12
      line rung_b 262,50 274,50 c12
      line rung_c 262,64 274,64 c12
      line rung_d 262,78 274,78 c12
      line rung_e 262,92 274,92 c12
      rect hatch 256,16,28,10 0
      dots hooks 0,50@0.95 0,50@0.8 0,50@0.66 0,50@0.55 0,50@0.46 c14
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
      poly boat_shadow 86,124 138,124 156,136 70,136 0
      poly door_pool 165,88 227,88 285,136 108,136 fade:,14/196,88/196,136
      ellipse door_halo 196,70,24,12 mix:,14@0.2
      dots dust 190,96 205,104 176,110 220,114 198,124 c14
    `,
    overlays: [{ object: "lantern", at: [234, 50] }]
  },

  // ---- THE LOFT: from a corner of the room under the roof, the round window on the left wall --------------------------------
  loft: {
    version: 1,
    draw: `
      poly wall_l 0,-8 213,10 213,100 0,116 6
      poly wall_r 213,10 320,-8 320,114 213,100 fade:6,0/213,60/320,60
      poly floor 0,116 213,100 320,114 320,136 0,136 mix:6,12@0.25
      poly ceil 0,0 320,0 320,2 213,10 0,-8 fade:6,0/213,12/213,0
      line corner 213,10 213,100 c0
      line wp_l1 40,0 40,113 c0
      line wp_l2 80,0 80,110 c0
      line wp_l3 150,3 150,105 c0
      line wp_l4 185,7 185,102 c0
      line wp_r1 240,5 240,104 c0
      line wp_r2 280,0 280,109 c0
      line wp_r3 300,0 300,111 c0
      ellipse win_halo_c 107,56,44,36 mix:,12@0.1
      ellipse win_halo_b 107,56,30,25 mix:,12@0.2
      ellipse win_halo_a 107,56,21,20 mix:,14@0.35
      ellipse win_frame 107,56,17,17 0 e6
      ellipse window_glass 107,56,14,14 fade:1,12/107,42/107,70
      line window_bar_h 93,56 121,56 c0
      line window_bar_v 107,42 107,70 c0
      poly dust_path 200,122 124,112 128,110 204,118 6
      line board_a 0,124 190,106 c0
      line board_b 20,132 230,112 c0
      line board_c 140,136 320,120 c0
      poly hatch 190,118 250,114 262,130 196,134 0
      line loft_ladder 222,116 222,92 c12
      line loft_ladder_r 240,115 240,91 c12
      line loft_rung_a 222,100 240,99 c12
      line loft_rung_b 222,108 240,107 c12
      line raft_a 213,10 120,0 c0
      line raft_b 213,10 40,0 c0
      line raft_c 213,10 290,0 c0
      line tie_a 120,30 270,14 c0
      line tie_b 130,40 275,22 c0
      poly oars_shape 138,36 268,18 269,21 139,40 6 e12
      poly oars_blade 262,15 276,13 277,20 263,22 14 e0
      poly sails 6,96 40,86 50,104 44,118 0,120 mix:12,6@0.5 e0
      line fold_a 12,100 40,96 c6
      line fold_b 10,108 44,106 c6
      line fold_c 16,114 40,114 c6
      poly sail_b 20,70 44,64 48,86 24,90 mix:12,6@0.4 e0
      poly crate 52,100 84,98 86,114 54,116 6 e0
      line crate_slat 54,107 85,106 c0
      poly chain_coil 280,116 310,112 314,124 284,128 0 e6
      dots chain_links 288,118 296,120 304,118 292,124 c12
      line bracket 288,28 288,52 306,52 c0
      rect bracket_bolt 287,30,3,3 14
      rect bracket_bolt2 286,48,3,3 14
      line cobweb_a 217,12 232,12 226,22 c12
      line cobweb_b 217,12 217,26 226,22 c12
      dots nails 60,40 100,24 170,34 200,66 250,60 290,50 c14
      ellipse floor_light 112,112,42,9 fade:,14/112,104/112,121
      dots motes 96,76 110,84 120,94 100,100 114,70 c14
      dots wall_knots 24,30 70,50 140,20 176,44 c0
      line crack_l 120,70 126,92 c0
      poly sack 252,100 276,98 280,112 256,114 mix:12,6@0.5 e0
      line sack_tie 258,100 272,98 c6
      line floor_crack 60,126 120,122 c0
      dots floor_nails 40,120 100,116 160,112 230,118 c14
      poly sail_hang 160,12 190,12 186,40 164,36 mix:12,6@0.4 e0
      line sail_hang_cord 175,0 175,12 c0
    `
  },

  // ---- THE JETTY: eye level along the planks to the post at the end, the island at the left, the low sun at the right -------
  jetty: {
    version: 1,
    draw: `
      vp 213,68
      rect sky 0,0,320,70 fade:12,14/0,0/0,70
      ellipse sunhalo_c 245,62,38,30 mix:,14@0.1
      ellipse sunhalo_b 245,62,24,19 mix:,14@0.2
      ellipse sunhalo_a 245,62,14,12 mix:,14@0.35
      ellipse sun 245,62,8,7 14
      poly far_hills 0,70 0,64 30,60 70,63 120,62 170,64 220,61 270,63 320,60 320,70 mix:12,6@0.4
      rect lake 0,68,320,68 fade:14,6/0,68/0,136
      rect sun_path 238,68,16,68 mix:,14@0.3
      dots glitter 244,72 248,78 242,84 250,92 246,100 c14
      poly island 90,70 98,66 108,65 120,67 128,70 0
      line island_post 108,65 108,54 c0
      rect island_lamp 106,52,4,3 6
      rect island_refl 90,71,38,6 mix:0,6@0.35
      dots gulls 62,34 74,30 82,36 150,24 160,20 c0
      line ripple_a 40,80 62,80 c14
      line ripple_b 120,90 148,90 c12
      line ripple_c 290,84 312,84 c12
      line ripple_d 60,108 96,108 c12
      line ripple_e 300,112 318,112 c14
      poly jetty 150,136@1 276,136@1 276,136@0.12 150,136@0.12 6 e0
      line pl_a 150,136@0.92 276,136@0.92 c0
      line pl_b 150,136@0.8 276,136@0.8 c0
      line pl_c 150,136@0.7 276,136@0.7 c0
      line pl_d 150,136@0.57 276,136@0.57 c0
      line pl_e 150,136@0.48 276,136@0.48 c0
      line pl_f 150,136@0.39 276,136@0.39 c0
      line pl_g 150,136@0.3 276,136@0.3 c0
      line pl_h 150,136@0.22 276,136@0.22 c0
      line pl_l1 180,136@1 180,136@0.12 c0
      line pl_l2 213,136@1 213,136@0.12 c0
      line pl_l3 246,136@1 246,136@0.12 c0
      poly pile_a 144,124@0.8 150,124@0.8 150,136@0.8 144,136@0.8 0 e6
      poly pile_b 144,124@0.45 150,124@0.45 150,136@0.45 144,136@0.45 0 e6
      poly pile_c 276,124@0.8 282,124@0.8 282,136@0.8 276,136@0.8 0 e6
      poly pile_d 276,124@0.45 282,124@0.45 282,136@0.45 276,136@0.45 0 e6
      poly pile_e 144,124@0.26 150,124@0.26 150,136@0.26 144,136@0.26 0 e6
      poly pile_f 276,124@0.26 282,124@0.26 282,136@0.26 276,136@0.26 0 e6
      rect post 211,59,5,18 0 e6
      rect post_hook 215,64,3,2 14
      line post_refl 213,78 213,92 c0
      poly sh_post 211,77 216,77 224,104 212,104 0
      poly sh_pile_l 159,123 164,123 150,136 142,136 0
      poly sh_pile_r 262,123 267,123 252,136 244,136 0
      line reeds_l1 4,136 8,96 c0
      line reeds_l2 12,136 16,88 c0
      line reeds_l3 22,136 20,100 c0
      line reeds_l4 30,136 36,92 c0
      poly dinghy 8,106 40,104 36,114 14,114 0 e12
      line dinghy_rope 40,106 62,110 c0
      line reeds_r1 306,136 302,96 c0
      line reeds_r2 312,136 316,88 c0
      line reeds_r3 296,136 292,104 c0
      ellipse rope_coil 294,122,8,4 mix:6,12@0.5 e0
      dots lake_sparkle 70,94 100,100 130,106 290,98 c14
      dots foam 138,128 154,130 270,128 286,130 c12
      dots nails_a 165,136@0.92 261,136@0.92 165,136@0.7 261,136@0.7 165,136@0.48 261,136@0.48 c12
      dots reeds_tips_l 8,96 16,88 20,100 36,92 c12
      dots reeds_tips_r 302,96 316,88 292,104 c12
      line far_reeds_a 50,70 60,66 c0
      line far_reeds_b 150,70 158,66 c0
      line cloud_a 20,24 66,24 c14
      line cloud_b 130,34 190,34 c14
      line cloud_c 270,18 306,18 c14
    `
  },

  // ---- THE LANE: looking up the hill between two rows of houses, the Heron lit on the right, the path to the churchyard on the left
  lane: {
    version: 1,
    draw: `
      vp 107,48
      rect sky 0,0,320,66 fade:12,14/0,0/0,66
      poly hill_far 86,38 150,38 150,66 86,66 mix:12,6@0.4
      poly road 0,136@1 320,136@1 320,136@0.2 0,136@0.2 6
      poly houses_l 0,0@1 0,136@1 0,136@0.2 0,0@0.2 6
      poly houses_r 320,0@1 320,136@1 320,136@0.2 320,0@0.2 12
      line div_l1 0,0@0.78 0,136@0.78 c0
      line div_l2 0,0@0.6 0,136@0.6 c0
      line div_l3 0,0@0.31 0,136@0.31 c0
      line div_r1 320,0@0.84 320,136@0.84 c6
      line div_r2 320,0@0.7 320,136@0.7 c6
      line div_r3 320,0@0.4 320,136@0.4 c6
      poly eave_l1 0,0@1 0,22@1 0,22@0.6 0,0@0.6 0 e6
      poly eave_l2 0,0@0.6 0,18@0.6 0,18@0.31 0,0@0.31 0 e6
      poly eave_r1 320,0@1 320,24@1 320,24@0.7 320,0@0.7 0 e12
      poly eave_r2 320,0@0.7 320,20@0.7 320,20@0.4 320,0@0.4 0 e12
      rect chimney_l 52,0,6,12 0
      rect chimney_r1 252,0,7,10 0
      rect chimney_r2 196,12,5,9 0
      poly win_l1 0,40@0.88 0,40@0.8 0,56@0.8 0,56@0.88 0 e6
      poly win_l2 0,40@0.7 0,40@0.64 0,54@0.64 0,54@0.7 0 e6
      poly win_l3 0,88@0.88 0,88@0.8 0,104@0.8 0,104@0.88 0 e6
      poly win_l4 0,86@0.7 0,86@0.64 0,98@0.64 0,98@0.7 0 e6
      poly win_r1 320,40@0.8 320,40@0.74 320,58@0.74 320,58@0.8 0 e12
      poly win_r2 320,40@0.62 320,40@0.56 320,56@0.56 320,56@0.62 0 e12
      poly win_r3 320,86@0.8 320,86@0.74 320,104@0.74 320,104@0.8 0 e12
      poly win_r4 320,80@0.46 320,80@0.42 320,90@0.42 320,90@0.46 0 e12
      poly heron_door 320,70@0.58 320,70@0.5 320,136@0.5 320,136@0.58 0 e12
      rect heron_sign 244,50,12,8 14 e0
      line sign_bird 247,56 250,52 253,56 c0
      line heron_arm 232,60 223,57 c0
      ellipse heron_lamp 222,57,3,3 6 e0
      poly path_gap 0,30@0.46 0,30@0.36 0,136@0.36 0,136@0.46 mix:12,6@0.4 e6
      poly path 56,96 70,96 78,68 72,68 6
      poly path_gate 66,58 76,58 79,66 64,66 0 e12
      poly alley_gap 320,20@0.92 320,20@0.78 320,136@0.78 320,136@0.92 fade:12,1/288,30/288,120
      line kerb_l 0,136@0.9 0,136@0.2 c0
      line kerb_r 320,136@0.9 320,136@0.2 c6
      rect notice_post 255,70,3,66 0
      rect notice_board 244,70,26,16 14 e0
      line notice_l1 248,75 266,75 c0
      line notice_l2 248,80 262,80 c0
      rect lamp_1_post 29,40,3,96 0
      ellipse lamp_1 30,36,5,5 6 e0
      line lamp_1_arm 24,48 36,48 c0
      rect lamp_2_post 131,64,2,22 0
      ellipse lamp_2 132,61,2,3 6 e0
      dots cobbles_a 120,128 142,122 160,114 188,110 210,124 236,130 c0
      dots cobbles_b 150,126 176,120 200,116 260,122 c12
      line gutter_l 36,126 74,100 c0
      line sill_r 320,104@0.8 320,104@0.74 c6
      poly sh_road 0,136 85,66 100,66 70,136 0
      ellipse road_glow 220,118,60,12 mix:,12@0.25
      dots swallows 150,20 162,14 176,24 c0
      poly door_l1 0,74@0.58 0,74@0.5 0,136@0.5 0,136@0.58 0 e6
      poly door_r2 320,76@0.7 320,76@0.64 320,136@0.64 320,136@0.7 0 e12
      line step_r 320,136@0.52 320,136@0.46 c6
      dots whitewash_stains 20,60 40,100 90,50 c0
      dots right_stains 290,50 270,90 240,40 c6
      line drainpipe_r 320,8@0.62 320,120@0.62 c6
      dots gravel 100,120 130,132 170,126 c6
      poly pot_plant 276,120 284,120 286,130 274,130 0 e12
    `
  },

  // ---- THE HERON: a flat view of the back wall: the fire and the tall chair at the left, the bar and Mrs Pell at the right -----
  inn: {
    version: 1,
    draw: `
      rect wall 0,0,320,104 fade:0,6/160,0/160,70
      rect floor 0,104,320,32 fade:6,0/0,104/0,136
      rect beam_a 0,8,320,8 0 e6
      rect beam_b 58,0,8,22 0 e6
      rect beam_c 190,0,8,22 0 e6
      dots beam_hooks 24,18 90,18 140,18 232,18 300,18 c14
      poly hearth 62,48 154,48 154,104 62,104 6 e0
      line stone_a 62,62 154,62 c0
      line stone_b 62,78 154,78 c0
      line stone_c 62,92 154,92 c0
      line stone_d 90,62 90,78 c0
      line stone_e 124,78 124,92 c0
      ellipse lamp_halo_c 213,46,48,32 mix:,14@0.1
      ellipse lamp_halo_b 213,46,30,20 mix:,14@0.2
      ellipse lamp_halo_a 213,46,16,11 mix:,14@0.35
      ellipse fire_halo_c 107,92,62,40 mix:,14@0.1
      ellipse fire_halo_b 107,92,40,28 mix:,14@0.2
      ellipse fire_halo_a 107,92,24,18 mix:,14@0.35
      ellipse fire_pool 107,118,48,8 fade:,14/107,110/107,126
      ellipse wall_halo 46,66,12,10 mix:,14@0.2
      rect fire_open 80,68,56,36 0
      rect log_a 88,98,40,6 6 e0
      poly flames 94,100 98,84 104,90 108,76 114,88 120,82 126,100 14
      poly ember 100,100 106,92 112,96 118,100 4
      rect mantel 56,44,104,6 6 e0
      rect candle 108,36,3,8 14 e0
      rect mug 128,38,7,6 6 e0
      poly chair_back 154,52 174,52 174,96 154,96 0 e6
      rect chair_seat 152,92,24,5 6 e0
      rect chair_cushion 154,88,20,4 4
      line chair_leg_a 154,97 154,114 c0
      line chair_leg_b 174,97 174,114 c0
      rect bar_top 184,88,96,5 14 e0
      rect bar 184,93,96,31 6 e0
      line bar_p1 200,93 200,124 c0
      line bar_p2 232,93 232,124 c0
      line bar_p3 262,93 262,124 c0
      rect shelf_back 188,72,88,3 6 e0
      dots bottles 194,68 202,68 216,68 230,68 246,68 262,68 c14
      rect photo_a 192,50,14,10 mix:6,14@0.4 e0
      rect photo_b 210,46,10,12 mix:6,14@0.4 e0
      rect photo_c 224,52,16,9 mix:6,14@0.4 e0
      rect photo_d 244,48,12,12 mix:6,14@0.4 e0
      rect photo_e 260,52,10,9 mix:6,14@0.4 e0
      poly pell_body 224,92 227,78 246,78 248,92 0
      ellipse pell_head 236,72,5,6 0
      rect pell_towel 243,80,3,9 14
      rect pell_cup 230,86,5,4 14
      line lamp_chain 213,0 213,36 c0
      poly lamp_shade 204,36 222,36 218,44 208,44 0 e6
      rect window 282,30,32,44 0 e6
      rect window_glass 284,32,28,40 fade:9,1/298,32/298,72
      line window_bar_v 298,32 298,72 c6
      line window_bar_h 284,50 312,50 c6
      dots window_island 300,62 c0
      rect window_sill 280,74,36,3 6 e0
      ellipse table_a 298,108,22,5 6 e0
      rect table_a_leg 296,112,4,16 0
      rect chair_r 280,92,8,32 0 e6
      rect chair_r_seat 278,108,14,3 6 e0
      rect settle 0,86,44,30 6 e0
      rect settle_back 0,70,44,16 0 e6
      rect cushion_l 6,84,14,6 4
      rect hook_board 8,40,22,4 6 e0
      dots board_hooks 12,46 20,46 28,46 c14
      poly cap 14,46 24,46 22,52 16,52 0
      line wall_bracket 36,56 36,70 44,70 c0
      ellipse wall_lamp 46,66,3,4 14 e0
      line fb_a 0,112 320,112 c0
      line fb_b 0,122 320,122 c0
      line fb_c 0,132 320,132 c0
      line fb_d 90,104 96,136 c0
      line fb_e 210,104 206,136 c0
      ellipse lamp_bulb 213,45,4,3 14
    `,
    cycles: [{ name: "fire", areas: ["flames"], colors: [14, 6], style: "flicker", ms: [300, 700] }],
    overlays: [{ object: "matches", at: [84, 33] }]
  },

  // ---- THE CHURCHYARD: far away over the wall to the lake, the chapel at the left, the lychgate at the right ------------------
  churchyard: {
    version: 1,
    draw: `
      rect sky 0,0,320,60 fade:12,14/0,0/0,60
      ellipse sunhalo_c 258,52,38,30 mix:,14@0.1
      ellipse sunhalo_b 258,52,24,19 mix:,14@0.2
      ellipse sunhalo_a 258,52,14,12 mix:,14@0.35
      ellipse sun 258,52,8,7 14
      poly far_hills 0,60 0,56 30,52 70,55 120,54 170,56 220,53 280,55 320,52 320,60 mix:12,6@0.4
      rect lake 0,58,320,38 fade:14,6/0,58/0,96
      rect sun_path 250,58,16,38 mix:,14@0.3
      dots glitter 254,62 260,68 252,74 262,82 256,90 c14
      line ripple_a 30,68 52,68 c14
      line ripple_b 110,76 136,76 c12
      line ripple_c 170,86 196,86 c12
      poly island 168,60 176,57 186,56 194,58 200,60 0
      line island_post 185,56 185,47 c0
      rect island_lamp 183,45,4,3 6
      poly slope 0,84 70,80 140,86 220,82 320,84 320,98 0,98 fade:12,6/320,84/0,98
      poly roof_s1 40,90 48,85 58,90 0
      poly roof_s2 96,92 106,86 118,92 0
      poly roof_s3 230,90 240,84 252,90 0
      dots village_windows 44,91 100,93 236,91 280,94 c6
      poly wall 0,96 320,98 320,108 0,106 6 e0
      line wall_top 0,96 320,98 c12
      line wall_joint_a 20,100 60,101 c0
      line wall_joint_b 120,102 180,103 c0
      line wall_joint_c 252,102 300,103 c0
      rect chapel 70,38,68,66 fade:6,12/70,70/138,70 e6
      poly chapel_roof 64,42 94,22 114,18 132,24 144,42 0 e12
      poly chapel_door 98,104 98,80 106,74 114,80 114,104 0 e12
      rect chapel_window 80,54,6,12 0 e12
      rect chapel_window_b 124,54,6,12 0 e12
      line chapel_course_a 70,62 138,62 c6
      line chapel_course_b 70,84 98,84 c6
      rect cote_post_l 152,74,3,30 0 e12
      rect cote_post_r 164,74,3,30 0 e12
      poly cote_roof 148,74 158,64 170,74 0 e12
      ellipse bell 159,80,4,5 14 e0
      line bell_rope 159,85 159,94 c0
      dots bell_knot 159,95 160,96 c6
      rect lych_post_l 190,62,5,42 0 e12
      rect lych_post_r 240,62,5,42 0 e12
      rect lych_beam 188,62,58,5 0 e12
      poly lych_roof 184,62 216,46 248,62 0 e12
      dots lych_nails 196,65 204,65 212,65 220,65 228,65 c14
      poly grass 0,108 320,110 320,136 0,136 6
      line grass_a 14,118 18,112 c14
      line grass_b 60,128 64,122 c14
      line grass_c 150,116 154,110 c14
      line grass_d 200,130 204,124 c14
      line grass_e 272,124 276,118 c14
      poly stone_a 40,112 42,98 52,96 54,112 0 e6
      poly stone_b 78,118 82,104 92,103 92,118 0 e6
      poly stone_c 130,124 130,110 144,108 145,124 0 e6
      poly stone_d 226,116 228,102 240,102 241,116 0 e6
      poly stone_e 262,122 266,106 278,108 278,122 0 e6
      poly stone_f 292,116 294,102 306,100 308,116 0 e6
      poly stone_g 306,128 308,112 318,112 319,128 0 e6
      line stone_boat_a 82,110 88,112 c6
      line stone_boat_b 297,108 302,110 c6
      poly yew 0,24 6,6 16,12 24,0 36,8 44,24 40,50 46,70 40,96 0,96 0
      poly yew_trunk 14,96 22,96 20,108 16,108 0 e6
      poly sh_lych 190,104 245,104 205,118 150,118 0
      poly sh_stone_c 130,124 145,124 108,132 94,132 0
      poly sh_stone_a 40,112 54,112 26,121 12,121 0
    `,
    overlays: [{ object: "boat_key", at: [206, 64] }]
  },
};

// ---- The ending pictures (world.en.js adds each with its alt): their palettes at their boldest, one subject each --------------
export const endings = {
  // THE LAMP (harbournight): the island's lamp lit white on x213, the village shining upside down in the black lake
  lamp: {
    version: 1,
    draw: `
      rect sky 0,0,320,70 fade:0,1/0,0/0,70
      dots stars_a 20,8 50,22 88,12 130,30 170,10 200,26 252,12 290,30 306,8 c15
      dots stars_b 36,36 112,6 152,40 232,6 274,44 66,48 c15
      rect water 0,70,320,66 fade:1,0/0,70/0,136
      poly shore_l 0,70 0,62 30,60 150,62 150,70 0
      poly house_a 22,62 30,52 40,52 48,62 0
      poly house_b 50,62 56,48 68,46 76,62 0
      poly house_c 78,62 84,54 96,52 102,62 0
      poly house_d 104,62 110,50 122,48 128,62 0
      poly house_e 130,62 138,54 148,54 152,62 0
      rect tower 124,30,8,22 0
      poly tower_roof 122,30 128,22 134,30 0
      rect chimney_a 34,46,4,8 0
      rect chimney_b 62,40,4,8 0
      dots windows_a 30,58 36,58 60,56 66,52 70,58 c15
      dots windows_b 88,58 94,58 114,56 118,52 136,58 142,58 c15
      dots windows_c 128,40 128,46 c15
      poly refl_shore 0,70 150,70 150,78 0,78 mix:0,1@0.5
      poly refl_a 22,78 30,88 40,88 48,78 mix:0,1@0.6
      poly refl_b 50,78 56,92 68,94 76,78 mix:0,1@0.6
      poly refl_c 78,78 84,86 96,88 102,78 mix:0,1@0.6
      poly refl_d 104,78 110,90 122,92 128,78 mix:0,1@0.6
      dots refl_windows_a 30,82 36,82 60,84 66,88 70,82 c15
      dots refl_windows_b 88,82 94,82 114,84 118,88 136,82 142,82 c15
      dots refl_windows_c 128,100 128,94 c15
      line refl_strokes_a 24,80 46,80 c1
      line refl_strokes_b 80,90 100,90 c1
      line refl_strokes_c 112,96 130,96 c1
      poly island 188,70 198,64 210,62 224,63 236,67 244,70 0
      line island_post 213,62 213,38 c0
      poly lamp_cap 208,34 213,30 218,34 0
      ellipse halo_c 213,42,34,28 mix:,15@0.1
      ellipse halo_b 213,42,22,19 mix:,15@0.2
      ellipse halo_a 213,42,13,12 mix:,15@0.35
      rect lamp_glass 208,35,10,13 15
      rect lamp_base 207,48,12,2 0
      rect lamp_path 209,72,8,64 mix:,15@0.4
      line lamp_ref 213,72 213,110 c15
      poly skiff 168,76 196,76 192,83 172,83 0
      line skiff_oar 176,76 186,70 c0
      line wave_a 190,80 204,80 c1
      line wave_b 222,76 240,76 c1
      line wave_c 250,84 280,84 c1
      line wave_d 150,100 190,100 c1
      line wave_e 230,104 270,104 c1
      line wave_f 100,116 150,116 c1
      line wave_g 260,122 300,122 c1
      line reeds_l1 4,136 8,92 c0
      line reeds_l2 12,136 16,86 c0
      line reeds_l3 22,136 20,98 c0
      line reeds_l4 32,136 38,90 c0
      line reeds_r1 304,136 300,94 c0
      line reeds_r2 312,136 316,86 c0
      line reeds_r3 294,136 290,102 c0
      poly near_bank_l 0,136 0,118 24,124 40,136 0
      poly near_bank_r 320,136 320,120 290,126 276,136 0
      dots stars_c 16,56 96,34 186,22 246,36 c15
      poly tower_refl 124,78 132,78 132,100 124,100 mix:0,1@0.6
      poly skiff_refl 168,85 196,85 192,88 172,88 mix:0,1@0.5
      rect post_foot 211,60,4,4 0
      dots island_reeds 192,66 200,64 232,64 240,68 c1
    `
  },

  // THE KEEPER (dusk): the lit lantern on the jetty's post on x213, an empty boat coming in on x107
  keep: {
    version: 1,
    draw: `
      rect sky_a 0,0,320,36 fade:1,5/0,0/0,36
      rect sky_b 0,36,320,34 fade:5,12/0,36/0,70
      dots first_stars 30,10 90,18 150,8 270,14 c15
      poly far_shore 0,70 0,62 40,58 90,64 150,60 210,63 270,59 320,62 320,70 0
      rect water 0,70,320,66 fade:12,1/0,70/0,136
      poly house_a 20,62 28,54 40,54 46,62 0
      poly house_b 54,62 60,52 72,52 80,62 0
      poly house_c 100,62 108,50 120,50 126,62 0
      poly house_d 140,62 146,56 158,56 164,62 0
      dots far_lights 24,60 36,60 58,58 66,58 108,56 116,56 144,60 152,60 c14
      dots far_lights_refl 24,76 36,78 58,80 66,76 108,82 116,78 144,76 152,80 c14
      poly island 250,70 260,66 272,65 288,67 300,70 0
      line island_post 274,65 274,56 c0
      rect island_lamp 272,54,4,3 0
      ellipse halo_c 211,76,34,28 mix:,14@0.1
      ellipse halo_b 211,76,22,19 mix:,14@0.2
      ellipse halo_a 211,76,13,12 mix:,14@0.35
      rect lantern_path 205,98,12,38 mix:,14@0.3
      poly deck 150,136 320,136 320,118 226,110 200,110 0
      line deck_p1 170,128 310,128 c1
      line deck_p2 190,120 316,120 c1
      line deck_p3 206,114 250,114 c1
      poly post 210,66 217,66 217,112 210,112 0
      rect post_hook 217,74,5,2 0
      poly lantern_cap 203,70 214,70 211,66 206,66 0
      rect lantern_glass 204,71,9,11 14 e12
      rect lantern_base 204,82,9,2 0
      poly boat_hull 70,90 150,90 140,100 82,100 0
      poly boat_bow 150,90 162,82 152,96 0
      poly boat_stern 64,84 72,90 70,100 0
      line thwart 100,90 100,86 c0
      line oar_a 84,88 112,78 c0
      line oar_b 128,88 100,76 c0
      poly boat_refl 70,102 150,102 140,108 82,108 mix:0,1@0.5
      line boat_wake_a 40,96 66,96 c12
      line boat_wake_b 30,102 60,102 c12
      line wave_a 190,90 204,90 c12
      line wave_b 240,86 262,86 c12
      line wave_c 110,114 150,114 c12
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
      dots stars_c 56,24 120,6 200,22 300,30 c15
      line cloud_a 20,44 90,44 c12
      line cloud_b 200,30 280,30 c12
      line cloud_c 120,50 170,50 c5
      poly house_e 170,62 178,54 190,54 196,62 0
      dots far_lights_b 174,60 184,60 c14
      dots far_lights_refl_b 174,78 184,80 c14
      line deck_p4 160,134 316,134 c1
      dots foam 40,110 90,122 300,110 c12
    `
  },

  // THE STREET (moonlight): the moon on x213, the street of lit windows laid across the water, going away to the vp
  street: {
    version: 1,
    draw: `
      vp 160,66
      rect sky 0,0,320,66 fade:0,1/0,0/0,66
      dots stars_a 20,8 60,20 100,10 140,28 180,8 250,14 290,22 c15
      dots stars_b 40,40 120,6 200,40 270,6 306,44 c9
      ellipse moon 213,26,9,9 15
      rect water 0,66,320,70 fade:9,0/0,66/0,136
      poly far_shore 0,66 0,62 40,58 100,63 160,60 230,62 290,58 320,61 320,66 0
      dots far_lamps 50,62 82,64 130,62 190,63 240,61 c11
      poly street 100,136@1 220,136@1 220,136@0.06 100,136@0.06 mix:9,1@0.35
      poly row_l 60,40@1 60,136@1 60,136@0.06 60,40@0.06 0 e1
      poly row_r 260,40@1 260,136@1 260,136@0.06 260,40@0.06 0 e1
      line div_l1 60,40@0.8 60,136@0.8 c1
      line div_l2 60,40@0.62 60,136@0.62 c1
      line div_l3 60,40@0.46 60,136@0.46 c1
      line div_l4 60,40@0.3 60,136@0.3 c1
      line div_r1 260,40@0.84 260,136@0.84 c1
      line div_r2 260,40@0.66 260,136@0.66 c1
      line div_r3 260,40@0.5 260,136@0.5 c1
      line div_r4 260,40@0.34 260,136@0.34 c1
      poly roofs_l 60,40@1 60,30@1 60,30@0.06 60,40@0.06 0 e1
      poly roofs_r 260,40@1 260,30@1 260,30@0.06 260,40@0.06 0 e1
      dots win_l_a 60,84@0.95 60,84@0.8 60,84@0.66 60,84@0.54 60,84@0.44 60,84@0.36 60,84@0.28 60,84@0.2 c15
      dots win_l_b 60,104@0.9 60,104@0.74 60,104@0.6 60,104@0.5 60,104@0.4 60,104@0.32 60,104@0.24 c15
      dots win_l_c 60,64@0.86 60,64@0.7 60,64@0.56 60,64@0.46 60,64@0.38 60,64@0.3 c11
      dots win_r_a 260,84@0.95 260,84@0.8 260,84@0.66 260,84@0.54 260,84@0.44 260,84@0.36 260,84@0.28 260,84@0.2 c15
      dots win_r_b 260,104@0.9 260,104@0.74 260,104@0.6 260,104@0.5 260,104@0.4 260,104@0.32 260,104@0.24 c15
      dots win_r_c 260,64@0.86 260,64@0.7 260,64@0.56 260,64@0.46 260,64@0.38 260,64@0.3 c11
      line street_mid 160,136@1 160,136@0.06 c9
      line street_edge_l 100,136@1 100,136@0.06 c9
      line street_edge_r 220,136@1 220,136@0.06 c9
      line moon_ref_a 207,70 219,70 c15
      line moon_ref_b 204,76 222,76 c15
      line moon_ref_c 208,84 218,84 c11
      line moon_ref_d 203,94 223,94 c15
      line moon_ref_e 206,106 220,106 c11
      line wave_a 20,80 50,80 c1
      line wave_b 270,90 306,90 c1
      line wave_c 30,110 70,110 c1
      line wave_d 250,118 290,118 c1
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
      dots win_l_d 60,94@0.85 60,94@0.7 60,94@0.58 60,94@0.48 60,94@0.4 60,94@0.32 c15
      dots win_r_d 260,94@0.85 260,94@0.7 260,94@0.58 260,94@0.48 260,94@0.4 260,94@0.32 c15
      dots lamps_l 60,56@0.9 60,56@0.66 60,56@0.5 60,56@0.38 c11
      dots lamps_r 260,56@0.9 260,56@0.66 260,56@0.5 260,56@0.38 c11
      rect chimney_l 70,26,5,8 0
      rect chimney_r 244,26,5,8 0
      line horizon_glow 0,66 320,66 c11
      dots stars_c 80,30 160,14 230,30 c15
      line moon_ref_f 212,118 218,118 c15
      line wave_e 100,100 130,100 c1
      line wave_f 190,112 230,112 c1
    `
  }
};
