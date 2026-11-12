// Pictures for "The Button Exchange" (worlds/buttons/world.en.js), one per room and one per ending, drawn by hand the way the AI
// draws them (BRIEF.md §7): 320 × 136, EGA colours 0–15, shapes back to front in the short notation, `vp` and `x,y@t` for perspective,
// ids on what the story may change or the text names. Every picture faces north.
//
// The shot list, written before drawing (viewpoint, facing, vanishing point; palette; light; gradients and their causes; subject and
// its columns; the wings):
//   cloak      eye level down a long corridor, north, vp 213,64; institution (dark grey leads, one green: the lift gate); one bare bulb
//              over the left-centre; one gradient: the floor falling off from the bulb; the lift on the far wall at x 196-230 (the way on),
//              the counter and thimble on the left third (x 58-122); wings: coats on rails, close, left and right
//   hall       wide, far back, one-point, north, vp 213,68; arcade (blue walls fading to black, a glass roof light blue to magenta, lit
//              shop windows, a cyan arch at the end); light: the cyan arch, with a halo; gradients: the two walls (distance); counter and
//              Mr Tally on the left third (x 61-205), the arch on the right third (x 198-230), the coat stand beside it; wings: stairs up
//              on the left wall, doors in both walls, windows
//   drawers    flat on, close, a facade, north, no vp; lamplight (brown leads); one hanging lamp over the middle, with a halo and a pool;
//              no gradient; the ladder on the left third (x 95-120), the warm drawer on the right third (x 204-236); wings: more drawers,
//              a night window on the right, a green door on the left wall at x 52-78
//   mercery    shop interior from the doorway, eye level, flat, north; cafe (yellow wall deepening to brown away from the open back
//              door, a red floor, light grey furniture); light: the daylight at the back door on the right; one gradient: the wall;
//              Miss Spool and the counter on the left third (x 95-125), the sewing machine on the right third (x 172-218); wings:
//              shelves of spools on the left, the back door on a grey yard on the right
//   sorting    eye level close, down the length of a table, north, vp 107,60; pinklobby (walls light magenta to brown, grey ceiling and
//              floor); small yellow lamps only; gradients: the two side walls (distance); the table, the saucer and the six women on the
//              left third (x 4-210); wings: the right wall and its door, the left wall
//   switchroom wide, one-point into a machine room, north, vp 213,64; deepnight (blue to cyan); light: the lamps of the board; gradients:
//              the floor and the left wall (the board's glow); the board across the far wall and the red button on the right third
//              (x 213); wings: pipes and cables overhead, a green door on the right wall
//   gallery    from the gallery rail looking down at an angle over the hall, north, vp 213,30; arcade (the same hall); light: the cyan arch;
//              gradients: the two walls; the mosaic hand on the floor on the right third (x 195-231), the counter far left; wings: the
//              rail and the stairs down on the left, the plaque on the rail on the right
//   yard       wide landscape, a narrow yard, north, vp 107,70; fog (light grey leads, one yellow window); one gradient: the ground
//              (fog thickening with distance); the three lines of coats on the left and middle, the waving coat last; wings: the wall and
//              the back door on the left, the lit window on the right
//   outside    (ending) wide landscape, a street at the end of the day, north, vp 213,76; dusk; the sun low on the right third (x 213),
//              the figure in the coat on the left third (x 107) walking away, a revolving door in the wing; one gradient: the wet street
//   kept       (ending) from behind the counter, eye level, north; lamplight; one lamp with a halo and a pool; the open ledger under the
//              lamp on the left third (x 107), the bell on the right third (x 213); no gradient
//   released   (ending) close-up, nothing behind it; ember (black to red to yellow); the pressed red button, three quarters of the
//              frame, the one light, with a halo; one gradient: the floor; the buttons spilling out of the dark round it
// Read down: no two neighbours share a viewpoint, a vanishing point or a palette (the hall and the gallery are one place, one palette,
// told apart by their viewpoint: far back one-point against from above, at an angle); the endings use the close-up, from behind, and a
// far street that no room does.

export default {
  // ---- THE CLOAKROOM (the opening): down a windowless corridor of coats to the lift --------------------------------
  cloak: {
    version: 1,
    draw: `
      vp 213,64
      poly ceiling 0,0@1 320,0@1 320,0@0.3 0,0@0.3 0
      poly floor 0,136@1 320,136@1 320,136@0.3 0,136@0.3 fade:7,8/0,136/0,86
      poly wall_l 0,0@1 0,0@0.3 0,136@0.3 0,136@1 8
      poly wall_r 320,0@1 320,0@0.3 320,136@0.3 320,136@1 8
      rect far_wall 149,45,96,41 mix:8,0@0.5
      line base_l 0,128@1 0,128@0.3 c0
      line base_r 320,128@1 320,128@0.3 c0
      line cornice_l 0,12@1 0,12@0.3 c0
      line cornice_r 320,12@1 320,12@0.3 c0
      line rail_l 0,40@1 0,40@0.3 c7
      line rail_r 320,40@1 320,40@0.3 c7
      poly coat_l1 0,40@1 0,40@0.86 0,104@0.86 0,98@1 7 e0
      poly coat_l2 0,40@0.84 0,40@0.72 0,106@0.72 0,100@0.84 0 e8
      poly coat_l3 0,40@0.7 0,40@0.6 0,98@0.6 0,104@0.7 7 e0
      poly coat_l4 0,40@0.58 0,40@0.5 0,102@0.5 0,96@0.58 15 e8
      poly coat_l5 0,40@0.48 0,40@0.41 0,96@0.41 0,102@0.48 0 e8
      poly coat_l6 0,40@0.39 0,40@0.33 0,98@0.33 0,94@0.39 7 e0
      poly coat_r1 320,40@1 320,40@0.88 320,106@0.88 320,100@1 0 e8
      poly coat_r2 320,40@0.86 320,40@0.74 320,98@0.74 320,104@0.86 7 e0
      poly coat_r3 320,40@0.72 320,40@0.62 320,104@0.62 320,98@0.72 0 e8
      poly coat_r4 320,40@0.6 320,40@0.52 320,96@0.52 320,102@0.6 7 e0
      poly coat_r5 320,40@0.5 320,40@0.43 320,100@0.43 320,94@0.5 15 e8
      poly coat_r6 320,40@0.41 320,40@0.35 320,92@0.35 320,98@0.41 0 e8
      poly sleeve_l 0,96@0.86 0,96@0.8 0,112@0.8 0,108@0.86 7 e0
      poly sleeve_r 320,100@0.74 320,100@0.68 320,116@0.68 320,112@0.74 7 e0
      dots hooks_l 0,40@0.98 0,40@0.85 0,40@0.71 0,40@0.59 0,40@0.49 0,40@0.4 0,40@0.32 c15
      dots hooks_r 320,40@0.95 320,40@0.8 320,40@0.67 320,40@0.56 320,40@0.47 320,40@0.38 c15
      dots tags_l 0,70@0.92 0,76@0.65 0,72@0.45 c15
      dots tags_r 320,74@0.78 320,70@0.55 320,76@0.4 c15
      poly counter_front 30,136@0.85 30,136@0.5 30,100@0.5 30,100@0.85 7 e0
      poly counter_top 30,100@0.85 30,100@0.5 0,100@0.5 0,100@0.85 15 e7
      line counter_edge 30,112@0.85 30,112@0.5 c8
      line counter_foot 30,136@0.85 30,136@0.5 c0
      ellipse bell 104,83,3,2 15
      rect lift_shaft 196,48,34,38 0
      rect lift_gate 199,52,28,34 mix:2,0@0.35 e10
      line gate_bar1 203,52 203,86 c10
      line gate_bar2 208,52 208,86 c10
      line gate_bar3 213,52 213,86 c10
      line gate_bar4 218,52 218,86 c10
      line gate_bar5 223,52 223,86 c10
      line gate_x1 199,52 227,86 c2
      line gate_x2 227,52 199,86 c2
      rect lift_top 194,44,38,5 8 e7
      rect lift_sign 205,38,16,4 10
      line lift_post_l 194,44 194,86 c7
      line lift_post_r 232,44 232,86 c7
      rect lift_panel 234,56,7,18 7 e0
      dots panel_buttons 237,59 237,63 237,67 237,71 c15
      dots panel_dim 236,61 239,65 236,69 c8
      poly mat 120,136@1 200,136@1 190,136@0.6 130,136@0.6 mix:0,8@0.5
      line tile_a 60,136@1 60,136@0.3 c8
      line tile_b 160,136@1 160,136@0.3 c8
      line tile_c 260,136@1 260,136@0.3 c8
      line cross_a 0,136@0.8 320,136@0.8 c8
      line cross_b 0,136@0.6 320,136@0.6 c8
      line cross_c 0,136@0.45 320,136@0.45 c8
      ellipse halo_3 150,26,46,30 mix:,15@0.1
      ellipse halo_2 150,25,32,20 mix:,15@0.2
      ellipse halo_1 150,24,18,12 mix:,15@0.35
      line flex 150,0 150,17 c8
      ellipse bulb 150,21,3,4 15
    `,
    cycles: [{ name: "the bulb", areas: ["bulb"], colors: [15, 7], style: "flicker", ms: [1200, 3200] }],
    overlays: [
      { object: "thimble", at: [62, 79] }
    ]
  },

  // ---- THE EXCHANGE: far back down the trading hall, the cyan arch at the end --------------------------------------
  hall: {
    version: 1,
    draw: `
      vp 213,68
      poly roof 0,0@1 320,0@1 320,0@0.35 0,0@0.35 fade:9,5/0,0/0,44
      line rib_a 40,0@1 40,0@0.35 c1
      line rib_b 120,0@1 120,0@0.35 c1
      line rib_c 200,0@1 200,0@0.35 c1
      line rib_d 280,0@1 280,0@0.35 c1
      line rib_cross_a 0,0@0.7 320,0@0.7 c1
      line rib_cross_b 0,0@0.5 320,0@0.5 c1
      poly floor 0,136@1 320,136@1 320,136@0.35 0,136@0.35 mix:1,0@0.35
      poly wall_l 0,0@1 0,0@0.35 0,136@0.35 0,136@1 fade:1,0/0,0/138,0
      poly wall_r 320,0@1 320,0@0.35 320,136@0.35 320,136@1 fade:1,0/320,0/250,0
      rect far_wall 138,44,112,48 0
      line cornice_l 0,12@1 0,12@0.35 c0
      line cornice_r 320,12@1 320,12@0.35 c0
      line pilaster_l1 0,0@0.62 0,136@0.62 c0
      line pilaster_l2 0,0@0.46 0,136@0.46 c0
      line pilaster_r1 320,0@0.66 320,136@0.66 c0
      line pilaster_r2 320,0@0.48 320,136@0.48 c0
      ellipse halo_3 214,70,34,24 mix:,11@0.1
      ellipse halo_2 214,72,26,19 mix:,11@0.2
      ellipse halo_1 214,74,20,16 mix:,11@0.35
      rect arch 198,52,32,40 11 e0
      ellipse arch_top 214,54,16,7 11
      poly arch_pool 198,92 230,92 250,102 180,102 fade:,11/214,92/214,124
      line rail_a 40,136@1 40,136@0.4 c14
      line rail_b 240,136@1 240,136@0.4 c14
      line rail_c 0,136@0.72 320,136@0.72 c14
      line rail_d 0,136@0.5 320,136@0.5 c14
      line tile_a 100,136@1 100,136@0.35 c0
      line tile_b 170,136@1 170,136@0.35 c0
      line tile_c 280,136@1 280,136@0.35 c0
      line tile_d 0,136@0.88 320,136@0.88 c0
      line tile_e 0,136@0.62 320,136@0.62 c0
      line tile_f 0,136@0.42 320,136@0.42 c0
      poly stairs 0,136@0.95 0,136@0.62 0,70@0.62 0 e1
      line tread_a 0,125@0.88 0,125@0.64 c1
      line tread_b 0,110@0.82 0,110@0.64 c1
      line tread_c 0,95@0.76 0,95@0.64 c1
      poly door_w 0,136@0.55 0,136@0.45 0,70@0.45 0,70@0.55 4 e0
      poly window_l 0,96@0.42 0,96@0.34 0,48@0.34 0,48@0.42 14 e0
      dots goods_l 0,80@0.4 0,86@0.37 0,76@0.36 c0
      poly window_r1 320,96@0.62 320,96@0.5 320,46@0.5 320,46@0.62 14 e0
      poly window_r2 320,96@0.46 320,96@0.38 320,50@0.38 320,50@0.46 14 e0
      dots goods_r 320,80@0.58 320,86@0.56 320,76@0.54 320,82@0.43 320,78@0.41 c0
      poly door_e 320,136@0.82 320,136@0.68 320,64@0.68 320,64@0.82 2 e0
      dots door_handles 320,100@0.7 0,100@0.5 c14
      poly counter_front -40,136@0.6 200,136@0.6 200,96@0.6 -40,96@0.6 0 e1
      poly counter_top -40,96@0.6 200,96@0.6 200,96@0.5 -40,96@0.5 4 e0
      line counter_rail 61,92 205,92 c14
      line counter_panel_a 100,88 100,108 c1
      line counter_panel_b 150,88 150,108 c1
      line counter_panel_c 190,88 190,108 c1
      poly tally_body 101,68 119,68 123,85 97,85 7 e0
      ellipse tally_head 110,62,4,5 15
      rect tally_shade 105,59,10,3 2
      dots tally_garters 102,76 118,76 c4
      line tally_arm 119,72 126,82 c7
      rect ledger 116,80,16,4 15 e0
      ellipse counter_bell 150,81,3,2 14
      dots floor_buttons 80,126 140,130 260,122 300,128 c14
      rect stand_pole 232,62,2,46 0
      dots stand_hooks 228,66 238,66 228,74 238,74 c0
      ellipse stand_foot 233,108,7,2 0
    `,
    cycles: [{ name: "the arch", areas: ["arch", "arch_top"], colors: [11, 15], style: "pingpong", ms: 3400 }],
    overlays: [
      { object: "coat", at: [225, 70] }
    ]
  },

  // ---- THE DRAWER WALL: flat on, a facade of drawers floor to ceiling, one lamp, one warm drawer --------------------
  drawers: {
    version: 1,
    draw: `
      rect ceiling 0,0,320,10 0
      rect wall 0,10,320,102 6
      rect floor 0,112,320,24 mix:0,6@0.4
      line row_1 0,22 320,23 c0
      line row_2 0,34 320,34 c0
      line row_3 0,46 320,47 c0
      line row_4 0,58 320,58 c0
      line row_5 0,70 320,71 c0
      line row_6 0,82 320,82 c0
      line row_7 0,94 320,95 c0
      line row_8 0,106 320,106 c0
      line col_1 22,10 22,58 23,58 23,112 c0
      line col_2 41,10 41,46 42,46 42,112 c0
      line col_3 66,10 66,70 65,70 65,112 c0
      line col_4 81,10 81,34 82,34 82,112 c0
      line col_5 104,10 104,82 105,82 105,112 c0
      line col_6 126,10 126,22 127,22 127,112 c0
      line col_7 147,10 147,58 148,58 148,112 c0
      line col_8 172,10 172,46 171,46 171,112 c0
      line col_9 190,10 190,70 191,70 191,112 c0
      line col_10 213,10 213,34 214,34 214,112 c0
      line col_11 238,10 238,58 237,58 237,112 c0
      line col_12 255,10 255,82 256,82 256,112 c0
      line col_13 281,10 281,22 282,22 282,112 c0
      line col_14 303,10 303,46 302,46 302,112 c0
      dots pulls_1 11,16 32,16 54,16 73,16 93,16 115,16 137,16 160,16 181,16 202,16 226,16 247,16 268,16 292,16 311,16 c14
      dots pulls_2 11,28 32,28 54,28 73,28 93,28 115,28 137,28 160,28 181,28 202,28 226,28 247,28 268,28 292,28 311,28 c14
      dots pulls_3 11,40 32,40 54,40 73,40 93,40 115,40 137,40 160,40 181,40 202,40 226,40 247,40 268,40 292,40 311,40 c14
      dots pulls_4 11,52 32,52 54,52 73,52 93,52 115,52 137,52 160,52 181,52 202,52 226,52 247,52 268,52 292,52 311,52 c14
      dots pulls_5 11,64 32,64 54,64 73,64 93,64 115,64 137,64 160,64 181,64 202,64 226,64 247,64 268,64 292,64 311,64 c14
      dots pulls_6 11,76 32,76 54,76 73,76 93,76 115,76 137,76 160,76 181,76 247,76 268,76 292,76 311,76 c14
      dots pulls_7 11,88 32,88 54,88 73,88 93,88 115,88 137,88 160,88 181,88 247,88 268,88 292,88 311,88 c14
      dots cards 8,13 29,25 62,37 78,49 120,61 144,73 187,85 289,97 c15
      ellipse halo_3 160,30,52,24 mix:,14@0.1
      ellipse halo_2 160,29,36,17 mix:,14@0.2
      ellipse halo_1 160,28,20,10 mix:,14@0.35
      line lamp_flex 160,10 160,18 c0
      poly lamp_shade 150,18 170,18 175,25 145,25 0 e6
      ellipse lamp_flame 160,27,4,4 14
      poly ladder_l 95,112 98,112 102,14 99,14 0 e6
      poly ladder_r 115,112 118,112 121,14 118,14 0 e6
      rect rung_1 98,100,19,3 0
      rect rung_2 98,82,20,3 0
      rect rung_3 99,64,19,3 0
      rect rung_4 99,46,19,3 0
      rect rung_5 100,28,19,3 0
      ellipse wheel_l 96,113,3,2 0
      ellipse wheel_r 116,113,3,2 0
      rect drawer_warm 204,83,32,11 14 e15
      ellipse drawer_pull 220,89,3,1 6
      line drawer_glint 205,84 235,84 c15
      dots drawer_hum 212,80 228,79 220,78 240,86 200,90 c15
      rect door_w 52,52,26,60 2 e0
      line door_frame 50,52 50,112 c0
      rect door_lintel 50,48,30,4 0
      dots door_handle 74,84 c14
      rect window 262,18,22,28 1 e0
      line window_bar_v 273,18 273,46 c9
      line window_bar_h 262,32 284,32 c9
      poly pool 120,112 200,112 232,136 88,136 fade:,14/160,112/160,136
      line plank_1 0,122 320,122 c0
      line plank_2 0,130 320,130 c0
      line skirting 0,111 320,111 c0
    `,
    cycles: [{ name: "the lamp", areas: ["lamp_flame"], colors: [14, 6], style: "flicker", ms: [900, 2400] }]
  },

  // ---- MISS SPOOL'S: a shop, eye level, flat; shelves of spools, the counter, the machine, the back door on a grey yard ----------
  mercery: {
    version: 1,
    draw: `
      rect wall 0,0,320,96 fade:14,6/260,0/0,0
      rect floor 0,100,320,36 4
      rect skirt 0,96,320,4 0
      line floor_a 0,112 320,112 c0
      line floor_b 0,124 320,124 c0
      rect sign 70,4,100,8 4 e0
      line sign_a 78,8 160,8 c15
      line ribbon_a 40,12 40,28 c4
      line ribbon_b 210,12 210,28 c2
      line ribbon_c 232,12 232,28 c15
      rect shelf_a 0,30,250,3 6 e0
      rect shelf_b 0,54,250,3 6 e0
      rect shelf_c 0,78,250,3 6 e0
      line shelf_edge_a 0,33 250,33 c0
      line shelf_edge_b 0,57 250,57 c0
      line shelf_edge_c 0,81 250,81 c0
      line bracket_a 30,33 30,38 c0
      line bracket_b 120,57 120,62 c0
      line bracket_c 200,81 200,86 c0
      line bracket_d 70,81 70,86 c0
      rect spools_a 4,18,240,12 mix:4,15@0.4
      rect spools_b 4,42,240,12 mix:2,0@0.4
      rect spools_c 4,66,240,12 mix:7,4@0.4
      dots spool_tops_a 10,19 26,19 44,20 61,19 80,20 99,19 118,20 137,19 155,20 174,19 193,20 212,19 231,19 c15
      dots spool_tops_b 14,43 33,43 50,44 70,43 88,44 107,43 126,43 146,44 164,43 183,44 203,43 222,44 c10
      dots spool_tops_c 8,67 24,68 42,67 59,67 78,68 97,67 120,68 141,67 160,68 179,67 198,68 217,67 c15
      rect pins_a 4,82,16,10 15 e0
      line pins_line 6,87 18,87 c4
      ellipse tape_a 238,92,6,6 4 e0
      ellipse tape_b 250,88,5,5 15 e0
      rect jar 226,74,12,12 7 e0
      rect jar_lid 227,72,10,3 8
      rect chair_back 92,44,4,48 6 e0
      poly spool_body 99,56 121,56 126,90 94,90 8 e0
      dots cardigan 110,62 110,68 110,74 110,80 c15
      poly spool_arm 100,76 94,88 100,90 108,82 8 e0
      ellipse spool_head 110,48,6,7 15 e0
      ellipse spool_bun 110,40,4,3 7
      rect counter 30,92,190,36 7 e0
      rect counter_top 28,88,194,5 15 e7
      line yardstick 30,94 220,94 c14
      line drawer_a 80,96 80,126 c0
      line drawer_b 130,96 130,126 c0
      line drawer_c 180,96 180,126 c0
      dots drawer_pulls 55,110 105,110 155,110 200,110 c8
      rect counter_shade 31,122,188,6 mix:7,8@0.5
      ellipse pincushion 122,87,4,3 4 e0
      dots pins 121,85 123,84 c15
      rect machine_base 172,82,46,6 8 e0
      poly machine_arm 176,66 212,66 218,82 172,82 8 e0
      ellipse machine_wheel 212,73,6,6 7 e0
      line machine_needle 180,72 180,84 c15
      rect machine_foot 176,84,16,3 7
      ellipse machine_spool 195,64,3,2 4
      rect door_frame 256,18,52,80 6 e0
      rect yard_view 260,22,44,72 7
      line yard_wash 260,40 304,40 c8
      poly yard_coat1 266,41 276,41 278,70 264,70 8
      poly yard_coat2 284,41 296,41 298,66 282,66 0
      rect yard_ground 260,84,44,10 8
      rect door_sill 254,96,56,3 0
      poly door_pool 262,100 300,100 270,130 200,130 mix:,7@0.3
    `,
    cycles: [],
    overlays: [
      { object: "needle", at: [135, 76] }
    ]
  },

  // ---- THE SORTING ROOM: eye level, down a long table in a pink room; six old women, small lamps -----------------------------
  sorting: {
    version: 1,
    draw: `
      vp 107,60
      poly ceiling 0,0@1 320,0@1 320,0@0.3 0,0@0.3 8
      poly floor 0,136@1 320,136@1 320,136@0.3 0,136@0.3 mix:8,7@0.35
      poly wall_l 0,0@1 0,0@0.3 0,136@0.3 0,136@1 fade:13,6/0,60/75,60
      poly wall_r 320,0@1 320,0@0.3 320,136@0.3 320,136@1 fade:13,6/320,60/171,60
      rect back_wall 75,42,96,41 6
      rect index 80,48,86,30 8 e0
      line index_a 80,58 166,58 c0
      line index_b 80,68 166,68 c0
      dots index_pulls_a 90,53 104,53 118,53 132,53 146,53 160,53 c14
      dots index_pulls_b 90,63 104,63 118,63 132,63 146,63 160,63 c14
      dots index_pulls_c 90,73 104,73 118,73 132,73 146,73 160,73 c14
      line beam_a 0,0@0.8 320,0@0.8 c0
      line beam_b 0,0@0.55 320,0@0.55 c0
      line beam_c 0,0@0.4 320,0@0.4 c0
      line skirt_l 0,124@1 0,124@0.3 c0
      line skirt_r 320,124@1 320,124@0.3 c0
      line board_a -40,136@1 -40,136@0.3 c0
      line board_b 60,136@1 60,136@0.3 c0
      line board_c 160,136@1 160,136@0.3 c0
      line board_d 260,136@1 260,136@0.3 c0
      line cross_a 0,136@0.8 320,136@0.8 c0
      line cross_b 0,136@0.55 320,136@0.55 c0
      poly door_e 320,136@0.8 320,136@0.62 320,76@0.62 320,76@0.8 6 e0
      dots door_handle 320,110@0.64 c14
      poly table_top 47,98@1 167,98@1 167,98@0.35 47,98@0.35 7
      poly table_side_l 47,98@1 47,98@0.35 47,104@0.35 47,106@1 8
      poly table_side_r 167,98@1 167,98@0.35 167,104@0.35 167,106@1 8
      poly table_front 47,98@1 167,98@1 167,106@1 47,106@1 8 e0
      line leg_l 50,106 50,125 c0
      line leg_r 164,106 164,125 c0
      line groove_a 77,98 100,73 c8
      line groove_b 107,98 107,73 c8
      line groove_c 137,98 114,73 c8
      dots buttons_a 60,94 90,90 120,95 148,92 84,84 130,82 c14
      dots buttons_b 70,90 102,86 138,88 94,78 122,77 c6
      dots buttons_c 80,96 112,92 155,96 106,80 c15
      ellipse saucer 107,96,12,3 15 e8
      dots saucer_buttons 102,95 107,96 112,95 105,97 109,97 c14
      ellipse saucer_b 80,88,7,2 15
      ellipse saucer_c 134,87,7,2 15
      ellipse saucer_d 96,80,4,1 15
      ellipse saucer_e 118,79,4,1 15
      ellipse wl1_head 25,56,7,8 15 e8
      poly wl1_body 10,68@1 40,68@1 46,106@1 4,106@1 8 e0
      ellipse wl2_head 48,57,5,6 15 e8
      poly wl2_body 10,68@0.72 40,68@0.72 46,106@0.72 4,106@0.72 8 e0
      ellipse wl3_head 66,58,4,4 15 e8
      poly wl3_body 10,68@0.5 40,68@0.5 46,106@0.5 4,106@0.5 8 e0
      ellipse wr1_head 189,56,7,8 15 e8
      poly wr1_body 174,68@1 204,68@1 210,106@1 168,106@1 8 e0
      ellipse wr2_head 166,57,5,6 15 e8
      poly wr2_body 174,68@0.72 204,68@0.72 210,106@0.72 168,106@0.72 8 e0
      ellipse wr3_head 148,58,4,4 15 e8
      poly wr3_body 174,68@0.5 204,68@0.5 210,106@0.5 168,106@0.5 8 e0
      dots hands 75,90 140,90 90,80 125,80 c15
      line lamp_cord_a 107,0 107,25 c0
      ellipse lamp_a 107,28,6,3 14 e0
      line lamp_cord_b 107,0 107,34 c0
      ellipse lamp_b 107,36,5,2 14 e0
      line lamp_cord_c 107,0 107,40 c0
      ellipse lamp_c 107,42,4,2 14 e0
    `,
    cycles: [],
    overlays: []
  },

  // ---- THE SWITCHBOARD: a narrow machine room, the board across the far wall in lamps, the red button below it -------------------
  switchroom: {
    version: 1,
    draw: `
      vp 213,64
      poly ceiling 0,0@1 320,0@1 320,0@0.5 0,0@0.5 0
      poly floor 0,136@1 320,136@1 320,136@0.5 0,136@0.5 fade:1,3/0,136/0,100
      poly wall_l 0,0@1 0,0@0.5 0,136@0.5 0,136@1 fade:1,3/0,0/107,0
      poly wall_r 320,0@1 320,0@0.5 320,136@0.5 320,136@1 1
      rect back_wall 107,32,159,68 0
      rect board 112,36,150,60 1 e3
      line frame_top 112,36 262,36 c0
      line frame_bottom 112,96 262,96 c0
      line frame_left 112,36 112,96 c0
      line frame_right 262,36 262,96 c0
      line sep_a 112,52 262,52 c0
      line sep_b 112,68 262,68 c0
      line sep_c 112,84 262,84 c0
      line sep_v 187,36 187,84 c0
      rect strip_a 118,40,22,2 5
      rect strip_b 146,40,18,2 13
      rect strip_c 196,40,24,2 14
      rect strip_d 228,40,26,2 3
      rect strip_e 120,56,18,2 14
      rect strip_f 150,56,24,2 11
      rect strip_g 200,56,20,2 5
      rect strip_h 232,56,22,2 13
      dots lamps_a 118,45 129,47 141,44 152,48 163,45 174,47 194,45 206,47 218,44 230,48 243,45 255,47 c5
      dots lamps_b 120,61 132,63 144,60 156,64 168,61 180,63 194,61 207,64 221,60 234,63 247,61 258,64 c13
      dots lamps_c 118,73 131,76 143,72 157,75 171,73 184,76 196,72 210,75 224,73 238,76 251,72 c14
      dots lamps_d 120,80 134,82 148,79 162,82 176,80 192,82 220,79 236,82 252,80 c3
      dots lamps_e 118,88 131,90 144,87 158,90 172,88 186,91 236,88 248,90 258,87 c11
      ellipse patch 213,80,9,5 mix:1,0@0.5
      ellipse red_collar 213,91,9,5 14 e0
      ellipse red_button 213,90,7,4 4
      dots red_gleam 211,89 c12
      poly pipe_a 40,0@1 60,0@1 60,0@0.5 40,0@0.5 1 e3
      poly pipe_b 250,0@1 275,0@1 275,0@0.5 250,0@0.5 1 e3
      poly pipe_c 150,0@1 160,0@1 160,0@0.5 150,0@0.5 8 e3
      rect tape_a 50,6,12,4 5
      rect tape_b 262,10,14,4 14
      rect tape_c 154,4,10,3 13
      line cable_a 320,20@1 320,50@0.7 320,30@0.55 c3
      line cable_b 320,34@0.95 320,64@0.68 320,44@0.54 c3
      line cable_c 0,24@0.9 0,56@0.65 0,36@0.52 c3
      line tile_a 0,136@1 0,136@0.5 c0
      line tile_b 100,136@1 100,136@0.5 c0
      line tile_c 220,136@1 220,136@0.5 c0
      line tile_d 320,136@1 320,136@0.5 c0
      line cross_a 0,136@0.85 320,136@0.85 c0
      line cross_b 0,136@0.65 320,136@0.65 c0
      poly door_e 320,136@0.82 320,136@0.62 320,70@0.62 320,70@0.82 2 e0
      dots rivets_l 0,30@0.9 0,60@0.9 0,90@0.9 0,120@0.9 0,30@0.7 0,60@0.7 0,90@0.7 0,120@0.7 c3
      poly box_l 0,70@0.85 0,70@0.7 0,100@0.7 0,100@0.85 8 e3
      ellipse valve 36,108,4,4 14 e0
      ellipse puddle_a 150,118,16,3 mix:,3@0.4
      ellipse puddle_b 260,106,10,2 mix:,11@0.4
      line grating_a 60,124 140,124 c0
      line grating_b 70,130 130,130 c0
      dots rivets_r 320,30@0.9 320,60@0.9 320,90@0.9 320,120@0.9 320,30@0.7 320,60@0.7 320,90@0.7 320,120@0.7 c8
      line skirting_back 107,100 266,100 c3
      ellipse gauge_a 284,64,5,5 11 e0
      ellipse gauge_b 284,80,5,5 14 e0
      line gauge_pipe 284,69 284,75 c3
      rect fusebox 20,56,16,24 8 e0
      dots fuses 24,60 28,60 32,60 24,66 28,66 32,66 c14
      line conduit 28,0 28,56 c3
    `,
    cycles: [{ name: "the board", areas: ["lamps_c", "lamps_a"], colors: [14, 5], style: "flicker", ms: [700, 2200] }]
  },

  // ---- THE GALLERY: from the rail, looking down at an angle over the hall; a mosaic of an open hand in the floor ------------------
  gallery: {
    version: 1,
    draw: `
      vp 213,30
      rect roof 0,0,320,26 fade:9,5/0,0/0,26
      line roof_rib_a 40,0@1 40,0@0.15 c1
      line roof_rib_b 120,0@1 120,0@0.15 c1
      line roof_rib_c 280,0@1 280,0@0.15 c1
      rect far_wall 181,26,48,20 0
      ellipse halo_3 213,38,15,10 mix:,11@0.1
      ellipse halo_2 213,38,13,9 mix:,11@0.2
      ellipse halo_1 213,38,11,8 mix:,11@0.35
      rect arch 203,32,20,14 11 e0
      poly floor 0,136@1 320,136@1 320,136@0.15 0,136@0.15 mix:1,0@0.3
      poly wall_l 0,0@1 0,0@0.15 0,136@0.15 0,136@1 fade:1,0/0,60/181,60
      poly wall_r 320,0@1 320,0@0.15 320,136@0.15 320,136@1 fade:1,0/320,60/229,60
      poly window_l1 0,96@0.75 0,96@0.6 0,50@0.6 0,50@0.75 14 e0
      poly window_l2 0,96@0.5 0,96@0.4 0,56@0.4 0,56@0.5 14 e0
      poly window_r1 320,96@0.75 320,96@0.6 320,50@0.6 320,50@0.75 14 e0
      poly window_r2 320,96@0.5 320,96@0.4 320,56@0.4 320,56@0.5 14 e0
      dots goods_l 0,80@0.72 0,86@0.68 0,76@0.45 c0
      dots goods_r 320,80@0.72 320,86@0.66 320,76@0.46 c0
      poly door_w 0,136@0.9 0,136@0.78 0,60@0.78 0,60@0.9 4 e0
      poly door_e 320,136@0.9 320,136@0.78 320,60@0.78 320,60@0.9 2 e0
      line tile_a 60,136@1 60,136@0.15 c0
      line tile_b 140,136@1 140,136@0.15 c0
      line tile_c 280,136@1 280,136@0.15 c0
      line cross_a 0,136@0.9 320,136@0.9 c0
      line cross_b 0,136@0.7 320,136@0.7 c0
      line cross_c 0,136@0.5 320,136@0.5 c0
      line cross_d 0,136@0.35 320,136@0.35 c0
      line rail_a 40,136@1 40,136@0.3 c14
      line rail_b 260,136@1 260,136@0.3 c14
      line rail_c 0,136@0.6 320,136@0.6 c14
      poly tally_body 111,60 129,60 131,72 109,72 7 e0
      ellipse tally_head 120,53,3,4 15
      rect tally_shade 117,50,7,2 2
      poly counter_front -40,136@0.5 200,136@0.5 200,110@0.5 -40,110@0.5 0 e1
      poly counter_top -40,110@0.5 200,110@0.5 200,110@0.42 -40,110@0.42 4 e0
      line counter_rail -40,112@0.5 200,112@0.5 c14
      poly hand_sleeve 190,136@0.98 236,136@0.98 236,136@0.8 190,136@0.8 9 e1
      poly hand_palm 190,136@0.8 236,136@0.8 236,136@0.68 190,136@0.68 14 e0
      poly hand_finger_1 186,136@0.68 196,136@0.68 195,136@0.5 187,136@0.5 14 e0
      poly hand_finger_2 199,136@0.68 209,136@0.68 209,136@0.46 200,136@0.46 14 e0
      poly hand_finger_3 215,136@0.68 225,136@0.68 224,136@0.46 216,136@0.46 14 e0
      poly hand_finger_4 228,136@0.68 238,136@0.68 236,136@0.52 229,136@0.52 14 e0
      poly hand_thumb 186,136@0.78 186,136@0.7 150,136@0.62 160,136@0.7 14 e0
      dots hand_jet 205,110 213,108 221,111 227,106 c0
      dots hand_knuckles 198,100 208,97 220,97 233,100 c15
      dots floor_buttons_a 80,124 150,118 260,112 290,126 c11
      dots floor_buttons_b 40,100 108,128 176,124 300,104 c4
      poly stair_a 0,100 40,114 40,136 0,136 0 e1
      line tread_a 0,108 40,121 c1
      line tread_b 0,116 40,128 c1
      line tread_c 0,124 40,134 c1
      line stair_rail 0,98 40,112 c14
      poly rail_floor 0,126 320,126 320,136 0,136 0
      rect rail_bar 0,119,320,4 14 e0
      rect post_l 0,108,10,28 0 e14
      rect post_r 310,108,10,28 0 e14
      rect support_a 48,123,3,3 0
      rect support_b 120,123,3,3 0
      rect support_c 268,123,3,3 0
      rect plaque 252,120,20,6 15 e0
      line plaque_l1 255,122 269,122 c0
      line plaque_l2 256,124 268,124 c0
    `,
    cycles: [{ name: "the arch", areas: ["arch"], colors: [11, 15], style: "pingpong", ms: 3400 }]
  },

  // ---- THE BACK YARD: a narrow yard in grey light, three lines of coats going away, the last one waving ---------------------------
  backyard: {
    version: 1,
    draw: `
      vp 107,70
      rect sky 0,0,320,60 fade:15,7/0,0/0,60
      poly wall_l 0,30@1 0,30@0.4 0,136@0.4 0,136@1 8
      poly wall_r 320,30@1 320,30@0.4 320,136@0.4 320,136@1 8
      rect back_wall 64,54,128,42 mix:8,7@0.6
      line coping_back 64,54 192,54 c0
      poly ground 0,136@1 320,136@1 320,136@0.4 0,136@0.4 fade:8,7/0,136/0,96
      line mortar_l1 0,50@1 0,50@0.4 c0
      line mortar_l2 0,80@1 0,80@0.4 c0
      line mortar_l3 0,110@1 0,110@0.4 c0
      line mortar_r1 320,50@1 320,50@0.4 c0
      line mortar_r2 320,80@1 320,80@0.4 c0
      line mortar_r3 320,110@1 320,110@0.4 c0
      dots joints_l 0,40@0.9 0,60@0.8 0,70@0.7 0,95@0.9 0,100@0.6 0,120@0.8 0,65@0.5 c0
      dots joints_r 320,42@0.9 320,64@0.8 320,72@0.7 320,95@0.9 320,100@0.6 320,120@0.8 320,65@0.5 c0
      poly pipe 150,54 153,54 153,96 150,96 0 e7
      line wash_a 0,40@0.85 320,40@0.85 c0
      line wash_b 0,40@0.6 320,40@0.6 c0
      line wash_c 0,40@0.42 320,40@0.42 c0
      poly coat_c1 40,40@0.42 24,46@0.42 20,108@0.42 60,112@0.42 56,46@0.42 8 e7
      poly coat_c2 110,40@0.42 94,46@0.42 90,110@0.42 130,106@0.42 126,46@0.42 8 e7
      poly coat_c3 180,40@0.42 164,46@0.42 160,106@0.42 200,110@0.42 196,46@0.42 8 e7
      poly coat_c4 250,40@0.42 234,46@0.42 230,112@0.42 270,108@0.42 266,46@0.42 8 e7
      poly coat_c5 320,40@0.42 304,46@0.42 300,108@0.42 340,110@0.42 336,46@0.42 8 e7
      poly wave_sleeve 266,48@0.42 290,30@0.42 294,36@0.42 272,54@0.42 8 e7
      poly coat_b1 30,40@0.6 14,46@0.6 10,110@0.6 50,106@0.6 46,46@0.6 8 e7
      poly coat_b2 85,40@0.6 69,46@0.6 65,106@0.6 105,110@0.6 101,46@0.6 8 e7
      poly coat_b3 140,40@0.6 124,46@0.6 120,112@0.6 160,108@0.6 156,46@0.6 8 e7
      poly coat_b4 195,40@0.6 179,46@0.6 175,108@0.6 215,106@0.6 211,46@0.6 8 e7
      poly coat_b5 250,40@0.6 234,46@0.6 230,104@0.6 270,110@0.6 266,46@0.6 8 e7
      poly coat_b6 305,40@0.6 289,46@0.6 285,110@0.6 325,108@0.6 321,46@0.6 8 e7
      poly coat_a1 40,40@0.85 24,46@0.85 20,110@0.85 60,106@0.85 56,46@0.85 0 e7
      poly coat_a2 100,40@0.85 84,46@0.85 80,108@0.85 120,112@0.85 116,46@0.85 0 e7
      poly coat_a3 160,40@0.85 144,46@0.85 140,106@0.85 180,110@0.85 176,46@0.85 0 e7
      poly coat_a4 220,40@0.85 204,46@0.85 200,112@0.85 240,108@0.85 236,46@0.85 0 e7
      poly coat_a5 280,40@0.85 264,46@0.85 260,108@0.85 300,106@0.85 296,46@0.85 0 e7
      poly sleeve_a2 84,60@0.85 60,76@0.85 62,82@0.85 88,68@0.85 0 e7
      poly sleeve_a4 236,64@0.85 262,82@0.85 258,88@0.85 232,72@0.85 0 e7
      poly sleeve_b3 156,56@0.6 180,70@0.6 177,76@0.6 154,62@0.6 8 e7
      dots pegs_a 40,38@0.85 100,38@0.85 160,38@0.85 220,38@0.85 280,38@0.85 c15
      dots pegs_b 30,38@0.6 85,38@0.6 140,38@0.6 195,38@0.6 250,38@0.6 305,38@0.6 c15
      dots pegs_c 40,38@0.42 110,38@0.42 180,38@0.42 250,38@0.42 c15
      poly yard_window 320,96@0.7 320,96@0.55 320,60@0.55 320,60@0.7 14 e0
      line window_bar_v 240,63 240,87 c0
      line window_bar_h 224,75 256,75 c0
      poly yard_door 0,136@0.92 0,136@0.74 0,60@0.74 0,60@0.92 0 e7
      dots door_handle 0,100@0.78 c7
      ellipse puddle_a 80,118,22,3 mix:,15@0.4
      ellipse puddle_b 220,108,16,2 mix:,15@0.4
      ellipse puddle_c 150,92,8,1 mix:,15@0.4
      dots drips 60,90 120,92 180,100 230,96 c15
      line stone_a 0,128 320,130 c0
      line stone_b 0,112 320,113 c0
      line flag_a -40,136@1 -40,136@0.4 c0
      line flag_b 90,136@1 90,136@0.4 c0
      line flag_c 220,136@1 220,136@0.4 c0
      line flag_d 350,136@1 350,136@0.4 c0
      ellipse bucket 228,100,6,5 0 e7
      line bucket_handle 222,98 228,92 234,98 c7
      ellipse haze_a 107,76,90,10 mix:,15@0.25
      ellipse haze_b 107,58,120,14 mix:,15@0.2
    `,
    cycles: [{ name: "the window", areas: ["yard_window"], colors: [14, 6], style: "pingpong", ms: 3800 }]
  }
};

// ---- The ending pictures: no overlays, no edits ---------------------------------------------------------------------------------
export const endings = {
  // OUTSIDE: wide landscape, a street at the end of the day; the figure in the buttoned coat walking towards the low sun
  outside: {
    version: 1,
    draw: `
      rect sky_a 0,0,320,26 fade:1,5/0,0/0,26
      rect sky_b 0,26,320,28 fade:5,12/0,26/0,54
      rect sky_c 0,54,320,26 12
      poly cloud_a 20,40 70,36 110,42 80,48 30,47 5
      poly cloud_b 150,22 200,18 250,24 210,30 160,29 5
      poly cloud_c 240,48 290,44 316,50 270,56 245,54 5
      poly cloud_d 100,60 140,58 160,62 130,66 108,65 13
      line cloud_streak_a 10,30 60,28 c5
      line cloud_streak_b 180,40 230,38 c5
      line cloud_streak_c 120,12 170,10 c5
      ellipse sun 213,72,12,12 14
      poly far_bld_a 170,64 184,64 184,80 170,80 0
      poly far_bld_b 238,62 250,62 250,80 238,80 0
      poly bld_l1 0,14 50,14 50,80 0,80 0
      poly bld_l2 50,36 92,36 92,80 50,80 0
      poly bld_l3 92,52 130,52 130,80 92,80 0
      poly bld_l4 130,62 168,62 168,80 130,80 0
      poly bld_r1 250,40 290,40 290,80 250,80 0
      poly bld_r2 290,18 320,18 320,80 290,80 0
      rect chimney_a 20,6,6,8 0
      rect chimney_b 64,28,5,8 0
      rect chimney_c 300,10,6,8 0
      line antenna_a 108,52 108,40 c0
      line antenna_b 268,40 268,28 c0
      dots windows_l 14,30 24,30 34,44 14,50 24,60 34,64 62,48 76,56 62,68 104,62 118,70 142,70 c14
      dots windows_r 258,50 272,56 258,64 298,30 312,36 298,50 312,60 298,70 c14
      poly street 0,136 320,136 320,80 0,80 fade:5,1/0,80/0,136
      line kerb_l 0,136 180,82 c1
      line kerb_r 320,136 246,82 c1
      dots reflect_a 206,86 220,88 212,92 226,95 205,98 218,102 210,108 c14
      line reflect_1 200,90 224,90 c12
      line reflect_2 204,96 222,96 c12
      line reflect_3 208,103 218,103 c12
      ellipse puddle_a 60,100,14,2 mix:,12@0.5
      ellipse puddle_b 160,118,18,3 mix:,12@0.5
      ellipse puddle_c 280,112,12,2 mix:,12@0.5
      line post_a 182,52 182,82 c0
      ellipse post_a_head 182,50,3,2 14
      line post_b 246,56 246,82 c0
      ellipse post_b_head 246,54,3,2 14
      rect door_frame 10,54,32,26 0 e9
      ellipse door_cyl 26,67,12,12 mix:9,11@0.5 e0
      line door_cross_a 14,67 38,67 c0
      line door_cross_b 26,55 26,79 c0
      line wire_a 0,24 90,30 180,26 c0
      line wire_b 180,26 250,34 320,28 c0
      line wire_c 0,44 60,48 130,44 c0
      poly fig_shadow 98,124 112,124 124,136 90,136 0
      ellipse fig_head 107,84,4,4 0
      poly fig_coat 100,88 114,88 117,116 97,116 0
      poly fig_arm 96,90 93,106 96,106 99,92 0
      rect fig_leg_l 101,116,4,8 0
      rect fig_leg_r 108,116,4,8 0
      dots birds 60,22 70,26 82,20 130,34 c0
      rect door_step 6,80,40,3 0
      poly awning 4,50 48,50 44,56 8,56 4
      dots cobbles 20,126 70,130 150,132 230,128 290,124 c1
      poly bld_r3 232,56 250,56 250,80 232,80 0
      line wire_d 250,34 320,28 c0
      dots windows_far 174,70 178,74 242,70 244,74 c14
    `,
    cycles: []
  },

  // KEPT: from behind the counter at lamplight; the open ledger with a clean page, the bell, a green eyeshade left on its hook
  kept: {
    version: 1,
    draw: `
      rect hall_dark 0,0,320,92 0
      poly roof_glass 40,0 280,0 260,36 60,36 1
      line glass_rib_a 100,0 94,36 c9
      line glass_rib_b 160,0 160,36 c9
      line glass_rib_c 220,0 226,36 c9
      dots stars 70,6 110,14 150,8 190,20 240,10 270,26 90,28 c15
      rect far_floor 0,80,320,12 mix:0,6@0.3
      line far_rail_a 0,84 320,84 c6
      line far_rail_b 0,89 320,89 c6
      line far_tile_a 60,80 40,92 c6
      line far_tile_b 150,80 150,92 c6
      line far_tile_c 250,80 270,92 c6
      rect col_a 4,38,12,54 mix:0,6@0.4
      rect col_b 168,40,10,52 mix:0,6@0.4
      rect col_c 232,40,10,52 mix:0,6@0.4
      rect shelf_l1 14,52,80,3 6 e0
      rect shelf_l2 14,72,80,3 6 e0
      rect spines_a 16,40,76,12 mix:4,0@0.4
      rect spines_b 16,60,76,12 mix:6,0@0.4
      dots spine_tops 20,41 34,41 50,42 66,41 82,42 c14
      rect pillar_r 270,8,24,84 mix:0,6@0.5
      dots hooks_r 282,30 282,50 282,70 c14
      poly hat 274,22 290,22 288,30 276,30 0 e14
      rect eyeshade 274,44,16,5 2 e0
      rect notice_board 190,12,44,36 mix:0,6@0.6
      rect notice_a 196,20,14,18 15 e6
      rect notice_b 214,26,12,12 14 e6
      poly counter_top 0,96 320,92 320,136 0,136 6 e0
      rect counter_front 0,126,320,10 0
      line counter_far 0,96 320,92 c14
      line grain_a 0,106 320,102 c0
      line grain_b 0,114 320,110 c0
      line grain_c 0,122 320,119 c0
      line grain_d 40,98 30,128 c0
      ellipse halo_3 150,76,70,46 mix:,14@0.1
      ellipse halo_2 150,76,48,32 mix:,14@0.2
      ellipse halo_1 150,76,26,18 mix:,14@0.35
      poly lamp_pool 100,100 200,98 230,128 70,130 fade:,14/150,100/150,128
      poly ledger_cover 58,114 154,114 150,132 62,134 4 e0
      poly ledger_l 62,112 106,106 108,120 66,128 15 e6
      poly ledger_r 108,106 152,112 148,128 110,120 15 e6
      line figures_a 70,114 102,110 c6
      line figures_b 70,118 104,114 c6
      line figures_c 70,122 106,118 c6
      dots page_clean 120,114 126,116 134,118 140,119 c14
      line pen 120,104 138,96 c0
      ellipse ink 168,104,5,3 0 e6
      ellipse cup 188,104,6,2 15 e8
      ellipse cup_saucer 188,106,9,2 15
      rect stack_a 20,98,34,6 4 e6
      rect stack_b 22,92,30,6 6 e14
      rect stack_c 24,86,28,6 2 e6
      dots clips 100,118 144,100 176,112 c15
      ellipse lamp_base 150,100,9,3 14 e6
      rect lamp_column 148,76,4,24 14
      poly lamp_shade 138,76 162,76 168,64 132,64 0 e14
      ellipse lamp_glow 150,78,6,4 15
      ellipse bell_top 213,100,8,6 14 e6
      rect bell_base 205,102,16,3 14
      ellipse bell_knob 213,92,2,2 14
    `,
    cycles: [{ name: "the lamp", areas: ["lamp_glow"], colors: [15, 14], style: "flicker", ms: [1500, 3600] }]
  },

  // RELEASED: close-up; the red button pressed down into its collar in the dark, buttons spilling out of the shadows round it
  released: {
    version: 1,
    draw: `
      rect bg 0,0,320,136 0
      rect drawer_a 6,12,44,20 0 e4
      rect drawer_b 58,20,44,20 0 e4
      rect drawer_c 110,8,44,20 0 e4
      rect drawer_d 164,16,44,20 0 e4
      rect drawer_e 216,6,44,20 0 e4
      rect drawer_f 268,18,44,20 0 e4
      rect drawer_g 20,44,44,16 0 e1
      rect drawer_h 252,46,44,16 0 e1
      dots pulls 28,22 80,30 132,18 186,26 238,16 290,28 c12
      dots embers 40,50 90,44 150,30 210,42 270,52 300,34 c12
      dots embers_b 66,60 126,50 180,56 240,66 c14
      poly floor 0,100 320,100 320,136 0,136 mix:0,4@0.3
      line floor_a 0,112 320,112 c4
      line floor_b 0,122 320,122 c4
      line floor_c 0,131 320,131 c4
      line floor_d 80,100 40,136 c4
      ellipse halo_3 160,78,140,64 mix:,4@0.1
      ellipse halo_2 160,78,104,48 mix:,12@0.2
      ellipse halo_1 160,78,76,34 mix:,14@0.35
      poly pool 100,100 220,100 280,136 40,136 fade:,12/160,100/160,136
      ellipse reflect 160,112,40,6 mix:4,12@0.3
      ellipse collar_o 160,92,82,34 7 e0
      ellipse collar_i 160,88,70,28 0
      dots bolts 84,92 100,106 130,120 190,120 220,106 236,92 c0
      line collar_rim 90,88 124,76 c15
      poly btn_side 100,80 220,80 216,96 104,96 4
      ellipse btn_top 160,78,60,22 4 e12
      ellipse btn_hi 140,72,20,6 12
      dots btn_glint 150,70 c14
      ellipse spill_a 26,100,8,5 12 e0
      ellipse spill_b 48,116,10,6 14 e0
      ellipse spill_c 14,124,9,5 7 e0
      ellipse spill_d 60,104,6,4 12 e0
      ellipse spill_e 84,120,7,4 14 e0
      ellipse spill_f 36,84,5,3 7 e0
      ellipse spill_g 296,104,8,5 14 e0
      ellipse spill_h 270,120,10,6 12 e0
      ellipse spill_i 306,126,9,5 7 e0
      ellipse spill_j 250,104,6,4 14 e0
      ellipse spill_k 232,124,7,4 12 e0
      ellipse spill_l 284,86,5,3 7 e0
      ellipse spill_m 200,118,6,3 14 e0
      ellipse spill_n 120,122,5,3 12 e0
      ellipse spill_o 18,110,4,2 12 e0
      ellipse spill_p 306,92,4,2 12 e0
      ellipse spill_q 100,128,4,2 14 e0
      ellipse spill_r 212,130,4,2 7 e0
      ellipse spill_s 70,132,4,2 12 e0
      ellipse spill_t 262,132,4,2 14 e0
      dots holes 24,100 28,100 46,116 50,116 12,124 16,124 58,104 62,104 82,120 86,120 34,84 38,84 c0
      dots holes_r 294,104 298,104 267,120 273,120 304,126 308,126 248,104 252,104 230,124 234,124 c0
      line thread_trail 130,122 150,126 190,124 230,128 c12
      rect drawer_i 112,38,40,14 0 e1
      rect drawer_j 166,40,40,14 0 e1
      dots embers_c 20,70 100,70 220,74 300,70 c4
      dots sparks 160,50 150,56 170,60 c14
      ellipse spill_u 40,70,3,2 12 e0
      ellipse spill_v 186,126,3,2 12 e0
      ellipse spill_w 140,130,3,2 14 e0
    `,
    cycles: [{ name: "the glow", areas: ["halo_1", "halo_2"], colors: [14, 12], style: "pingpong", ms: 3000 }]
  }
};
