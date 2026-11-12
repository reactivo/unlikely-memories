// Pictures for "The Button Hall" (worlds/buttons/world.en.js), one per room and one per ending, the way the AI writes them (BRIEF.md §7):
// 320 × 136, EGA colours 0–15, shapes back to front in the short notation, ids on what the story may change or a cycle animates. The world's
// style is dithered. Each picture carries its `shot`, written before its shapes.

export default {
  // ---- THE WAITING BOOTH (the opening) ---------------------------------------------------------------------------------------
  booth: {
    version: 1,
    shot: "Eye level, frontal, facing north; one-point view, vanishing point (213,66) on the {wicket}, a sliding hatch in the far {glass} on the right third; " +
      "pinklobby: side walls light magenta giving way to brown towards the corners (gradient one, the ceiling lamp's light falling off), the floor grey deepening with distance " +
      "(gradient two); one light, a yellow ceiling strip at x 156 with a soft halo on the ceiling; subject the wicket, x 197-229, a shutter half down over a black opening; " +
      "on the left third a slatted {bench} with the {receiver} on its seat and a number {board} on the left wall above it, every number dark; " +
      "left wing a pinned poster and coat hooks, right wing a potted plant and a notice rail.",
    draw: `
      vp 213,66
      poly ceiling 0,0 320,0 276,40 150,40 8
      poly wall_l 0,0 150,40 150,94 0,136 fade:6,13/0,60/150,60
      poly wall_r 320,0 276,40 276,94 320,136 fade:6,13/320,60/276,60
      rect wall_back 150,40,126,54 13
      poly floor 0,136 150,94 276,94 320,136 fade:7,8/0,136/0,94
      rect pane_far 156,44,114,46 mix:13,7@0.3
      line - 156,44 270,44 c8
      line - 156,90 270,90 c8
      line mullion1 194,44 194,90 c8
      line mullion2 232,44 232,90 c8
      rect wicket 197,56,32,32 6 e0
      rect hatch 201,60,24,24 0
      rect shutter 201,60,24,12 8 e7
      line - 201,72 225,72 c7
      dots hatch_handle 222,66 c14
      poly lamp 136,6 176,6 172,13 140,13 14 e0
      ellipse halo1 156,22,36,16 mix:,14@0.1
      ellipse halo2 156,20,24,10 mix:,14@0.2
      ellipse halo3 156,18,13,6 mix:,14@0.35
      line - 150,40 0,0 c7
      line - 276,40 320,0 c7
      line beam1 213,20@1 213,20@0.4 c8
      line - 60,0@1 150,40 c8
      line - 260,0@1 276,40 c8
      line skirt_l 0,128 150,95 c8
      line skirt_r 320,128 276,95 c8
      line tile1 20,136@1 20,136@0.4 c8
      line tile2 80,136@1 80,136@0.4 c8
      line tile3 140,136@1 140,136@0.4 c8
      line tile4 200,136@1 200,136@0.4 c8
      line tile5 260,136@1 260,136@0.4 c8
      line tile6 320,136@1 320,136@0.4 c8
      line - 0,120 320,120 c8
      line - 0,108 300,108 c8
      rect bench_back 62,76,102,10 6 e0
      line - 62,80 164,80 c0
      line - 62,83 164,83 c0
      rect bench_seat 58,98,110,8 6 e0
      rect bench_shade 58,106,110,3 0
      rect bench_leg1 64,109,4,15 8
      rect bench_leg2 156,109,4,15 8
      rect bench_post1 64,86,3,12 8
      rect bench_post2 158,86,3,12 8
      rect board 78,34,56,22 0 e7
      dots board_numbers 84,40 94,40 104,40 114,40 124,40 84,46 94,46 104,46 114,46 124,46 84,52 94,52 104,52 114,52 124,52 c8
      line - 78,34 134,34 c7
      rect poster 8,40,26,38 7 e0
      rect poster_band 12,46,18,5 8
      line - 12,58 30,58 c8
      line - 12,63 26,63 c8
      line - 12,68 28,68 c8
      dots hooks 12,24 22,24 32,24 c0
      line - 12,24 12,30 c0
      line - 22,24 22,30 c0
      line - 32,24 32,30 c0
      rect rail 286,46,32,3 8 e0
      rect slip1 290,50,8,10 7 e0
      rect slip2 302,50,8,13 15 e0
      poly pot 286,112 310,112 306,134 290,134 6 e0
      poly leaf1 298,112 288,84 294,82 300,112 0 e8
      poly leaf2 298,112 306,80 311,84 302,112 0 e8
      poly leaf3 298,112 314,96 316,102 302,114 0 e8
      poly leaf4 296,112 284,98 282,104 294,116 0 e8
      ellipse scuff 108,126,18,2 mix:,8@0.4
    `,
    overlays: [{ object: "receiver", at: [100, 84] }]
  },

  // ---- THE BUTTON HALL: eye level, one-point view to the wall of buttons -----------------------------------------------------
  hall: {
    version: 1,
    shot: "Eye level, frontal, facing north; one-point view, vanishing point (200,60) just left of the gap on the right third; lamplight: brown walls and floor, " +
      "yellow only where the one hanging lamp (x 190, on the ceiling) falls, with a soft halo round it on the ceiling and the top of the back wall; " +
      "gradients: the floor brown near to black far (the lamp's light falling off with distance) and the side walls brown at the back corner to black at the edges (the same cause); " +
      "subject the {wall} of brass buttons across the back wall, x 106-274, nine rows of studs drawn as dithered brass bands with their {plates}, the {gap} in row nine at x 218; " +
      "on the left a flight of {stairs} rising along the side wall with a banister, on the right a stairwell opening in the floor with steps going down; " +
      "wings: left the stair's foot and a coat hook, right a framed notice and a red fire bucket on a shelf.",
    draw: `
      vp 200,60
      poly ceiling 0,0 320,0 280,18 100,18 0
      poly wall_l 0,0 100,18 100,100 0,136 fade:6,0/100,60/0,60
      poly wall_r 320,0 280,18 280,100 320,136 fade:6,0/280,60/320,60
      rect wall_back 100,18,180,82 6 e0
      poly floor 0,136 100,100 280,100 320,136 fade:6,0/0,136/0,100
      rect panel 106,22,168,74 0
      rect row1 108,25,164,5 mix:14,6@0.5
      rect row2 108,33,164,5 mix:14,6@0.5
      rect row3 108,41,164,5 mix:14,6@0.5
      rect row4 108,49,164,5 mix:14,6@0.5
      rect row5 108,57,164,5 mix:14,6@0.5
      rect row6 108,65,164,5 mix:14,6@0.5
      rect row7 108,73,164,5 mix:14,6@0.5
      rect row8 108,81,164,5 mix:14,6@0.5
      rect row9a 108,89,106,5 mix:14,6@0.5
      rect row9b 224,89,48,5 mix:14,6@0.5
      ellipse gap 218,91,5,3 0 e6
      line plates1 108,31 272,31 c8
      line plates2 108,47 272,47 c8
      line plates3 108,63 272,63 c8
      line plates4 108,79 272,79 c8
      line plates5 108,95 272,95 c8
      rect plate_mill 213,95,10,2 7
      line cell0 121,22 121,96 c0
      line cell1 134,22 134,96 c0
      line cell2 147,22 147,96 c0
      line cell3 160,22 160,96 c0
      line cell4 173,22 173,96 c0
      line cell5 186,22 186,96 c0
      line cell6 199,22 199,96 c0
      line cell7 212,22 212,96 c0
      line cell8 225,22 225,96 c0
      line cell9 238,22 238,96 c0
      line cell10 251,22 251,96 c0
      line cell11 264,22 264,96 c0
      line - 106,22 274,22 c14
      line - 100,18 0,0 c6
      line - 280,18 320,0 c6
      line lamp_cord 190,0 190,8 c6
      poly lamp_shade 180,8 200,8 205,16 175,16 14 e0
      ellipse lamp_bulb 190,18,3,2 15
      ellipse halo1 190,20,46,18 mix:,14@0.1
      ellipse halo2 190,19,30,12 mix:,14@0.2
      ellipse halo3 190,18,16,7 mix:,14@0.35
      line skirt_l 0,128 100,98 c0
      line skirt_r 320,128 280,98 c0
      line fl1 20,136@1 20,136@0.53 c6
      line fl2 80,136@1 80,136@0.53 c6
      line fl3 140,136@1 140,136@0.53 c6
      line fl4 200,136@1 200,136@0.53 c6
      line fl5 260,136@1 260,136@0.53 c6
      line fl6 320,136@1 320,136@0.53 c6
      line - 0,118 320,118 c6
      line - 0,106 300,106 c6
      poly stringer 4,132 96,98 96,92 4,100 6 e0
      line step1 20,124 20,98 c0
      line step2 38,118 38,94 c0
      line step3 56,111 56,86 c0
      line step4 74,105 74,78 c0
      line banister 4,88 96,52 c14
      line post1 20,98 20,82 c0
      line post2 56,86 56,68 c0
      line post3 90,60 90,44 c0
      poly under_stair 4,132 96,98 96,100 4,136 0
      poly stairwell 232,112 276,106 286,118 236,128 0 e6
      line well_step1 238,116 280,110 c6
      line well_step2 240,121 283,114 c6
      line well_rail 232,106 276,102 c14
      rect hook_bar 20,60,28,3 6 e0
      dots hooks 24,64 34,64 44,64 c0
      rect frame 290,34,24,30 0 e6
      rect notice 294,38,16,22 7
      line - 296,44 308,44 c8
      line - 296,50 306,50 c8
      line - 296,56 308,56 c8
      rect shelf 288,98,30,3 6 e0
      poly bucket 296,102 312,102 310,116 298,116 4 e0
      line - 296,106 312,106 c12
    `,
    cycles: [{ name: "the hanging lamp", areas: ["lamp_bulb"], colors: [15, 14], style: "flicker", ms: [900, 2200] }]
  },

  // ---- THE CONSOLE: low, across the long desk; deepnight, the green lamp on the left third, the red button on the right ------
  console: {
    version: 1,
    shot: "Close and low, level with the desk top, looking across the long {desk} north at the back wall; deepnight; one light, the shaded green {lamp} at x 107 with a soft green halo " +
      "on the baize and the wall above it; gradients: the back wall blue at the top to cyan lower where the lamp's glow reaches it (light falling off), and the floor blue to black towards the viewer; " +
      "subject the big red {button} under its raised glass {flap} on the right third, x 213, on a dark base; along the near and far edges of the desk rows of yellow {spares}; " +
      "on the wall a town map with a few red points; wings: left a black filing cabinet with brass pulls, right a pipe running up the wall and a radiator.",
    draw: `
      rect wall 0,0,320,72 fade:1,3/0,0/0,72
      rect map 128,10,104,46 mix:1,3@0.35 e0
      line - 134,22 224,22 c0
      line - 134,34 224,34 c0
      line - 150,10 150,56 c0
      line - 182,10 182,56 c0
      line - 206,10 206,56 c0
      line - 134,46 224,46 c0
      dots map_points 140,16 164,28 190,40 212,18 168,50 c4
      rect window 44,12,44,30 0 e3
      line - 66,12 66,42 c3
      line - 44,27 88,27 c3
      rect floor 0,72,320,64 fade:1,0/0,72/0,136
      line - 0,72 320,72 c8
      ellipse halo1 107,70,56,22 mix:,10@0.1
      ellipse halo2 107,70,38,14 mix:,10@0.2
      ellipse halo3 107,70,20,8 mix:,10@0.35
      line lamp_stem 107,84 107,58 c8
      poly lamp_shade 92,50 122,50 132,62 82,62 2 e0
      ellipse lamp_bulb 107,64,7,2 15
      poly desk_top 0,100 320,100 304,80 16,80 2 e0
      poly pool 70,100 150,100 140,88 80,88 mix:,10@0.25
      rect desk_front 0,100,320,36 0
      rect desk_edge 0,100,320,2 6
      line - 0,112 320,112 c8
      line - 0,124 320,124 c8
      rect drawer1 20,104,60,16 0 e8
      rect drawer2 100,104,60,16 0 e8
      rect drawer3 180,104,60,16 0 e8
      rect drawer4 260,104,50,16 0 e8
      dots pulls 50,112 130,112 210,112 285,112 c14
      dots spares_near 24,96 40,96 56,96 72,96 88,96 104,96 120,96 136,96 152,96 168,96 184,96 200,96 216,96 232,96 248,96 264,96 280,96 296,96 c14
      dots spares_far 40,84 56,84 72,84 88,84 104,84 120,84 136,84 152,84 168,84 184,84 200,84 216,84 232,84 248,84 264,84 280,84 c14
      dots spares_mid 30,90 46,90 62,90 78,90 94,90 110,90 126,90 142,90 158,90 174,90 190,90 206,90 222,90 238,90 254,90 270,90 286,90 c6
      poly flap 196,56 230,56 234,76 192,76 mix:,11@0.12 e11
      line - 196,56 192,76 c11
      line - 230,56 234,76 c11
      ellipse button_base 213,86,26,7 8 e0
      ellipse all_button 213,82,19,6 4 e12
      ellipse button_hi 207,80,7,2 12
      rect penstand 46,74,10,8 8 e0
      line pen1 49,74 47,66 c15
      line pen2 52,74 54,64 c14
      ellipse clock 262,28,10,10 3 e0
      line - 262,28 262,22 c0
      line - 262,28 267,30 c0
      rect skirting 0,66,320,4 8 e0
      line - 134,28 224,28 c0
      line - 134,40 224,40 c0
      rect cab 8,48,32,70 0 e8
      rect cab_d1 12,54,24,16 8 e0
      rect cab_d2 12,76,24,16 8 e0
      rect cab_d3 12,98,24,16 8 e0
      dots cab_pulls 24,62 24,84 24,106 c14
      rect pipe 292,0,8,100 8 e0
      line - 296,0 296,100 c1
      rect rad 270,70,44,30 8 e1
      line - 276,72 276,98 c1
      line - 284,72 284,98 c1
      line - 292,72 292,98 c1
      line - 300,72 300,98 c1
      line - 308,72 308,98 c1
    `,
    cycles: [{ name: "the green lamp", areas: ["lamp_bulb"], colors: [15, 10], style: "pingpong", ms: 3000 }]
  },

  // ---- THE CLERK'S OFFICE: seen into a corner, institution grey; the chair and ledger on the left third, the hat-stand on the right -------
  office: {
    version: 1,
    shot: "Eye level from the doorway looking north into a small room; one-point view, vanishing point (107,66) on the {desk} and {chair}; institution: grey walls going to black at the corners, " +
      "one ceiling globe (white) at x 140 with a soft halo on the ceiling and the back wall, and one small green thing, the lamp on the desk; gradients: the floor grey to black away from the door (the globe's light falling off); " +
      "subject the swivel {chair} on the left third (x 107) beside the {desk} with the open {ledger} and an inkwell; on the right third, on the right wall, the {hat-stand} with one coat and one hat (x 230); " +
      "wings: left a filing shelf with box files and a framed certificate, right a barred window (dark) and a radiator.",
    draw: `
      vp 107,66
      poly ceiling 0,0 320,0 250,26 40,26 8
      poly wall_l 0,0 40,26 40,104 0,136 8
      poly wall_r 320,0 250,26 250,104 320,136 8
      rect wall_back 40,26,210,78 7
      poly floor 0,136 40,104 250,104 320,136 fade:7,0/0,136/0,104
      ellipse halo1 140,34,60,22 mix:,15@0.1
      ellipse halo2 140,32,38,14 mix:,15@0.2
      ellipse halo3 140,30,18,7 mix:,15@0.35
      line globe_cord 140,0 140,22 c8
      ellipse globe 140,26,6,5 15 e8
      line - 40,26 0,0 c7
      line - 250,26 320,0 c7
      line skirt_l 0,128 40,104 c0
      line skirt_r 320,128 250,104 c0
      line - 40,104 250,104 c0
      line board1 60,136@1 60,136@0.55 c8
      line board2 120,136@1 120,136@0.55 c8
      line board3 180,136@1 180,136@0.55 c8
      line board4 240,136@1 240,136@0.55 c8
      line board5 300,136@1 300,136@0.55 c8
      rect desk_top 60,78,100,6 0 e8
      rect desk_front 62,84,96,26 0 e8
      line - 110,84 110,110 c8
      dots desk_pulls 86,94 134,94 c7
      rect desk_leg1 62,110,5,10 0
      rect desk_leg2 153,110,5,10 0
      rect blotter 74,75,40,3 8
      rect ledger_l 118,72,18,5 15 e0
      rect ledger_r 137,72,18,5 15 e0
      line - 120,74 134,74 c8
      line - 139,74 153,74 c8
      rect inkwell 66,72,5,6 0 e7
      line lamp_stem 90,76 90,66 c8
      poly lamp_shade 84,60 98,60 102,67 80,67 2 e0
      ellipse lamp_spill 90,80,16,3 mix:,14@0.25
      line chair_post 106,112 106,100 c8
      poly chair_seat 90,96 124,96 128,102 86,102 2 e0
      poly chair_back 94,70 120,70 122,95 92,95 2 e0
      line - 98,74 98,92 c0
      line - 106,74 106,92 c0
      line - 114,74 114,92 c0
      line chair_base1 106,112 90,120 c0
      line chair_base2 106,112 122,120 c0
      line chair_base3 106,112 106,122 c0
      dots castors 90,121 122,121 106,123 c0
      line stand_pole 230,50 230,112 c0
      line stand_foot1 230,112 218,120 c0
      line stand_foot2 230,112 242,120 c0
      line stand_arm1 230,52 220,56 c0
      line stand_arm2 230,52 240,56 c0
      poly coat 218,56 232,56 236,92 214,92 0 e8
      line - 225,58 225,90 c8
      poly hat 222,46 238,46 236,50 224,50 0 e8
      rect shelf 6,48,28,3 0 e8
      rect box1 8,32,6,16 8 e0
      rect box2 16,34,6,14 8 e0
      rect box3 24,32,6,16 8 e0
      rect cert 8,60,20,14 15 e0
      line - 12,66 24,66 c8
      rect win 280,40,28,40 0 e7
      line - 288,40 288,80 c7
      line - 298,40 298,80 c7
      rect rad 280,98,28,16 8 e7
      line - 286,100 286,112 c7
      line - 294,100 294,112 c7
      line - 302,100 302,112 c7
    `
  },

  // ---- THE STOCKROOM: eye level down a narrow aisle of drawers; goldenhour, a band of low sun across the back wall ------------
  stockroom: {
    version: 1,
    shot: "Eye level, facing north, one-point view down a narrow aisle, vanishing point (160,64); goldenhour: brown walls, floor and wood, light red and yellow only on the band of low sun " +
      "that comes through a high window and strikes the back wall (x 120-210), magenta in the deepest corners, black for gaps and silhouettes, one red accent; gradient: the floor brown to black " +
      "away from the sun (one only); subject on the left third the low wide {drawer} with its buttonhole lock, x 60-160, black with a yellow edge, among five rows of small drawers of the {shelves}; " +
      "on the right third a tea-chest {crate} with a {saucer} and the {peppermint} on it (x 213); wings: left a ladder against the shelves, right a sack and a stack of cardboard boxes.",
    draw: `
      vp 160,64
      poly ceiling 0,0 320,0 270,22 50,22 0
      poly wall_l 0,0 50,22 50,106 0,136 6
      poly wall_r 320,0 270,22 270,106 320,136 6
      rect wall_back 50,22,220,84 6 e0
      poly floor 0,136 50,106 270,106 320,136 fade:6,0/0,136/0,106
      line - 50,34 270,34 c0
      line - 50,46 270,46 c0
      line - 50,58 270,58 c0
      line - 50,70 270,70 c0
      line - 50,82 270,82 c0
      line - 72,22 72,90 c0
      line - 94,22 94,90 c0
      line - 116,22 116,90 c0
      line - 138,22 138,90 c0
      line - 160,22 160,90 c0
      line - 182,22 182,90 c0
      line - 204,22 204,90 c0
      line - 226,22 226,90 c0
      line - 248,22 248,90 c0
      poly sunband 120,22 176,22 214,90 158,90 mix:12,14@0.4
      poly sunfloor 150,108 200,108 236,136 170,136 mix:,12@0.3
      dots knobs1 61,28 83,28 105,28 127,28 149,28 171,28 193,28 215,28 237,28 259,28 c14
      dots knobs2 61,40 83,40 105,40 127,40 149,40 171,40 193,40 215,40 237,40 259,40 c14
      dots knobs3 61,52 83,52 105,52 127,52 149,52 171,52 193,52 215,52 237,52 259,52 c14
      dots knobs4 61,64 83,64 105,64 127,64 149,64 171,64 193,64 215,64 237,64 259,64 c14
      dots knobs5 61,76 83,76 105,76 127,76 149,76 171,76 193,76 215,76 237,76 259,76 c14
      rect lost_drawer 60,92,100,14 0 e14
      rect lock_slot 100,97,20,3 6 e12
      ellipse lock_hole 120,98,3,2 0
      poly corner_l 50,22 56,25 56,103 50,106 5
      poly corner_r 270,22 264,25 264,103 270,106 5
      line - 50,22 0,0 c0
      line - 270,22 320,0 c0
      line - 20,136@1 20,136@0.58 c0
      line - 90,136@1 90,136@0.58 c0
      line - 230,136@1 230,136@0.58 c0
      line - 300,136@1 300,136@0.58 c0
      poly crate_top 190,110 244,110 252,118 184,118 6 e0
      rect crate_front 184,118,68,18 6 e0
      line - 184,124 252,124 c0
      line - 184,130 252,130 c0
      line - 206,118 206,136 c0
      line - 230,118 230,136 c0
      ellipse saucer 214,111,12,3 12 e0
      line ladder_l 14,34 22,130 c0
      line ladder_r 32,34 40,130 c0
      line - 16,46 34,46 c0
      line - 17,58 35,58 c0
      line - 18,70 36,70 c0
      line - 19,82 37,82 c0
      line - 20,94 38,94 c0
      line - 21,106 39,106 c0
      line - 22,118 40,118 c0
      ellipse sack 296,122,18,12 6 e0
      poly sack_top 288,112 304,112 300,106 292,106 6 e0
      rect box1 284,84,30,12 6 e0
      rect box2 288,96,26,12 6 e0
      line - 284,90 314,90 c0
      line - 288,102 314,102 c0
      rect win_hi 150,5,36,9 14 e0
      line - 168,5 168,14 c0
      dots dust 130,40 142,52 150,64 160,48 172,60 180,72 190,56 c15
    `,
    overlays: [{ object: "mint", at: [206, 96] }]
  },

  // ---- THE LAMP ROOM: close, flat on to the panel of lamps; arcade, a glass roof band above -----------------------------------
  lamproom: {
    version: 1,
    shot: "Close, eye level, flat on to a panel with no floor or ceiling in view, facing north; arcade: blue walls, a band of glass roof light blue to magenta along the top (gradient one, the sky through glass), " +
      "no other gradient; the light is the {lamps} themselves, ten rows of small green lights drawn as dithered strips, one red {lamp} in the bottom row at x 232; " +
      "subject the lamp panel across the picture, x 46-274; below it on the centre-left third (x 107) a shut steel {tray} flush with the panel and, beside it at x 213, a small square {tray button}; " +
      "wings: left a bundle of cables running down to a drum, right a fuse box with one small red lamp and a pipe.",
    draw: `
      rect wall 0,0,320,136 1
      rect roof 0,0,320,12 fade:9,5/0,0/0,12
      line - 0,12 320,12 c0
      line roof_bar1 80,0 80,12 c0
      line roof_bar2 160,0 160,12 c0
      line roof_bar3 240,0 240,12 c0
      rect frame 36,14,248,100 0 e3
      rect lamps1 46,20,228,3 mix:10,0@0.5
      rect lamps2 46,29,228,3 mix:10,0@0.5
      rect lamps3 46,38,228,3 mix:10,0@0.5
      rect lamps4 46,47,228,3 mix:10,0@0.5
      rect lamps5 46,56,228,3 mix:10,0@0.5
      rect lamps6 46,65,228,3 mix:10,0@0.5
      rect lamps7 46,74,228,3 mix:10,0@0.5
      rect lamps8 46,83,228,3 mix:10,0@0.5
      rect lamps9 46,92,180,3 mix:10,0@0.5
      rect lamps9b 240,92,34,3 mix:10,0@0.5
      ellipse red_lamp 232,93,5,3 4 e12
      line - 46,17 274,17 c8
      line - 46,26 274,26 c8
      line - 46,35 274,35 c8
      line - 46,44 274,44 c8
      line - 46,53 274,53 c8
      line - 46,62 274,62 c8
      line - 46,71 274,71 c8
      line - 46,80 274,80 c8
      line - 46,89 274,89 c8
      line - 46,98 274,98 c8
      dots rivets 40,18 40,60 40,108 280,18 280,60 280,108 c7
      line sep1 90,17 90,98 c8
      line sep2 134,17 134,98 c8
      line sep3 178,17 178,98 c8
      line sep4 222,17 222,98 c8
      rect conduit 0,2,320,5 8 e0
      rect label_a 52,8,30,3 7
      rect label_b 130,8,30,3 7
      rect label_c 210,8,30,3 7
      rect ledge 0,118,320,18 8 e0
      rect mug 240,108,8,10 7 e0
      dots mug_steam 244,104 245,101 c15
      line - 0,128 320,128 c0
      rect tray 66,104,100,10 7 e0
      rect tray_slot 72,108,88,2 8
      dots tray_pulls 78,106 154,106 c0
      rect tray_button 206,104,14,10 14 e0
      rect plate_tray 204,100,18,2 15
      poly cable1 6,0 14,0 22,118 14,118 0 e8
      poly cable2 16,0 22,0 36,118 28,118 8 e0
      poly cable3 2,20 8,20 14,118 8,118 0
      ellipse drum 22,124,22,6 8 e0
      line - 8,126 36,126 c0
      rect fuse_box 292,24,24,34 8 e0
      rect fuse_door 295,27,18,28 0 e7
      ellipse fuse_lamp 304,36,2,2 12
      line - 298,44 310,44 c7
      line - 298,50 310,50 c7
      rect pipe 300,58,6,56 8 e0
      line - 303,58 303,114 c7
      rect pipe_joint 296,84,14,4 8 e0
    `,
    cycles: [{ name: "a lamp going out", areas: ["lamps5"], colors: [10, 2], style: "flicker", ms: [1500, 3500] }],
    overlays: [{ object: "pearl", at: [108, 98] }]
  },

  // ---- THE GALLERY: eye level along the catwalk, the wall of buttons running away on the right; lamplight ---------------------
  gallery: {
    version: 1,
    shot: "Eye level on the catwalk, facing north along it; one-point view, vanishing point (107,58) on the left third; lamplight: brown walls, black iron, yellow only where the one hanging lamp " +
      "(x 107, near the far end) falls, with a soft halo on the ceiling and far wall, a blue night {window} on the left wall; gradients: the iron grating floor brown to black along its length (distance), " +
      "the right wall brown to black at the near edge (light falling off); subject on the right the {wall} of buttons running away along the catwalk, nine receding bands of studs with the {hole} in the ninth at x 243; " +
      "on the left third a brass {spyglass} on a stand by the window; the iron {catwalk} with its rail along the left edge; wings: left a coil of rope and a cage lamp, right the far end of the wall and a bolted girder.",
    draw: `
      vp 107,58
      poly ceiling 0,0 320,0 134,42 80,42 0
      poly wall_l 0,0 80,42 80,74 0,136 6
      poly wall_r 320,0 134,42 134,74 320,136 fade:6,0/134,60/320,60
      rect wall_far 80,42,54,32 6 e0
      poly floor 0,136 320,136 134,74 80,74 fade:6,0/0,136/0,74
      poly strip1 320,20@1 320,28@1 320,28@0.45 320,20@0.45 mix:14,6@0.5
      poly strip2 320,31@1 320,39@1 320,39@0.45 320,31@0.45 mix:14,6@0.5
      poly strip3 320,42@1 320,50@1 320,50@0.45 320,42@0.45 mix:14,6@0.5
      poly strip4 320,53@1 320,61@1 320,61@0.45 320,53@0.45 mix:14,6@0.5
      poly strip5 320,64@1 320,72@1 320,72@0.45 320,64@0.45 mix:14,6@0.5
      poly strip6 320,75@1 320,83@1 320,83@0.45 320,75@0.45 mix:14,6@0.5
      poly strip7 320,86@1 320,94@1 320,94@0.45 320,86@0.45 mix:14,6@0.5
      poly strip8 320,97@1 320,105@1 320,105@0.45 320,97@0.45 mix:14,6@0.5
      poly strip9a 320,108@1 320,116@1 320,116@0.667 320,108@0.667 mix:14,6@0.5
      poly strip9b 320,108@0.611 320,116@0.611 320,116@0.45 320,108@0.45 mix:14,6@0.5
      ellipse hole 243,92,3,2 0 e6
      line - 320,18@1 320,18@0.45 c0
      line - 320,118@1 320,118@0.45 c0
      line - 0,0 80,42 c6
      line - 320,0 134,42 c6
      line lamp_cord 107,0 107,26 c0
      poly lamp_shade 100,26 114,26 118,32 96,32 14 e0
      ellipse lamp_bulb 107,34,3,2 15
      ellipse halo1 107,32,44,16 mix:,14@0.1
      ellipse halo2 107,32,28,10 mix:,14@0.2
      ellipse halo3 107,32,14,6 mix:,14@0.35
      line grate1 40,136@1 40,136@0.35 c0
      line grate2 100,136@1 100,136@0.35 c0
      line grate3 160,136@1 160,136@0.35 c0
      line grate4 220,136@1 220,136@0.35 c0
      line grate5 280,136@1 280,136@0.35 c0
      line - 0,120 320,120 c0
      line - 0,104 300,104 c0
      line - 0,90 270,90 c0
      line rail_top 0,112 80,52 c0
      line rail_mid 0,124 80,64 c0
      line rail_post1 14,100 14,126 c0
      line rail_post2 40,82 40,108 c0
      line rail_post3 62,66 62,90 c0
      poly window 8,22 36,30 36,52 8,48 1 e14
      line - 22,26 22,50 c14
      poly win_light 8,52 36,56 36,66 8,70 mix:,9@0.2
      line stand_leg1 56,118 66,96 c0
      line stand_leg2 76,118 66,96 c0
      line stand_leg3 66,118 66,96 c0
      poly scope 40,84 90,70 92,75 42,91 6 e0
      rect scope_lens 38,84,4,7 14 e0
      line - 54,86 56,80 c14
      ellipse rope 20,122,10,5 6 e0
      line - 12,121 28,121 c0
      rect cage_lamp 6,70,10,12 0 e14
      line - 6,76 16,76 c14
      line pipe1 0,12 80,44 c0
      line pipe2 0,18 80,48 c0
      dots rivets 100,30 106,32 112,34 118,36 124,38 c0
      poly tag 150,108 160,108 160,118 150,118 14 e0
      line - 154,108 156,100 c0
      rect hatch_gr 120,92,26,3 0
      line sw1 20,54 36,60 c14
      rect girder 276,0,14,130 8 e0
      dots bolts 283,10 283,30 283,50 283,70 283,90 283,110 c7
    `,
    cycles: [{ name: "the hanging lamp", areas: ["lamp_bulb"], colors: [15, 14], style: "flicker", ms: [900, 2400] }]
  },

  // ---- THE BATTERY CELLAR: eye level along the central mat to the bare terminals; the cellar palette -------------------------
  cellar: {
    version: 1,
    shot: "Eye level at the foot of the stairs, facing north; one-point view, vanishing point (213,64) on the {terminals} on the right third; the cellar palette: cold blue and dark grey stone, brown wood, " +
      "yellow only where the one hanging bulb (x 80, left) falls, with a soft halo on the left wall, and a small blue spark between two posts as the one small light; gradient: the floor dark grey to black away from the bulb (one only); " +
      "subject nine brass posts along a rail across the back wall, x 156-268, a spark between the fifth and sixth; on the left wall three racks of glass {jars}, the dry salt-furred one among them; " +
      "a black rubber {mat} down the middle of the floor towards the posts; wings: left the foot of the iron {stairs}, right more racks and a coil of wire.",
    draw: `
      vp 213,64
      poly ceiling 0,0 320,0 296,34 130,34 0
      poly wall_l 0,0 130,34 130,100 0,136 1
      poly wall_r 320,0 296,34 296,100 320,136 1
      rect wall_back 130,34,166,66 8 e0
      poly floor 0,136 130,100 296,100 320,136 fade:8,0/0,136/0,100
      line - 0,0 130,34 c8
      line - 320,0 296,34 c8
      line rack1 0,60 130,62 c6
      line rack2 0,92 130,75 c6
      line rack3 0,118 130,85 c6
      rect rack_post 126,34,4,66 6 e0
      rect jar1 10,44,14,16 1 e8
      rect jar2 40,46,12,14 1 e8
      rect jar3 72,48,10,12 1 e8
      rect jar4 100,50,8,11 1 e8
      rect jar5 12,76,14,16 1 e8
      rect jar6 44,76,12,14 1 e8
      rect jar_dry 76,74,10,12 8 e8
      poly salt 76,80 86,80 85,86 77,86 15
      rect jar8 104,68,8,9 1 e8
      rect jar9 8,102,16,16 1 e8
      rect jar10 40,98,13,14 1 e8
      rect jar11 70,92,11,12 1 e8
      rect jar12 98,86,8,9 1 e8
      ellipse halo1 80,28,50,22 mix:,14@0.1
      ellipse halo2 80,27,32,14 mix:,14@0.2
      ellipse halo3 80,26,16,7 mix:,14@0.35
      line lamp_cord 80,0 80,14 c8
      poly lamp_shade 72,14 88,14 92,22 68,22 14 e0
      ellipse lamp_bulb 80,24,3,2 15
      rect term_rail 148,92,132,6 6 e0
      rect post1 156,78,6,14 6 e0
      rect post2 170,78,6,14 6 e0
      rect post3 184,78,6,14 6 e0
      rect post4 198,78,6,14 6 e0
      rect post5 212,78,6,14 6 e0
      rect post6 226,78,6,14 6 e0
      rect post7 240,78,6,14 6 e0
      rect post8 254,78,6,14 6 e0
      rect post9 268,78,6,14 6 e0
      dots post_tips 158,78 172,78 186,78 200,78 214,78 228,78 242,78 256,78 270,78 c14
      ellipse spark_glow 220,72,16,8 mix:,1@0.4
      line spark 215,76 218,70 221,76 224,70 227,76 c15
      line wires 150,52 290,52 c8
      line - 150,60 290,60 c8
      poly mat 160,136 238,136 224,100 208,100 0 e8
      line - 188,100 196,136 c8
      poly stair_stringer 0,136 60,102 60,96 0,128 6 e0
      line step1 14,130 14,114 c0
      line step2 30,122 30,104 c0
      line step3 46,112 46,96 c0
      line stair_rail 0,100 60,66 c14
      rect rack_r1 300,56,20,3 6 e0
      rect rack_r2 300,84,20,3 6 e0
      rect jar_r1 304,42,12,14 1 e8
      rect jar_r2 304,70,12,14 1 e8
      line pipe_c1 0,12 130,40 c8
      line pipe_c2 0,18 130,44 c8
      line drip 100,0 100,10 c9
      ellipse puddle 120,126,16,3 mix:,1@0.5
      rect tag_jar 14,64,6,4 14
      ellipse coil 302,120,16,7 6 e0
      ellipse coil_in 302,120,9,3 0
    `,
    cycles: [{ name: "the spark", areas: ["spark"], colors: [15, 9], style: "flicker", ms: [100, 500] }]
  },

  // ---- MILL STREET: wide at dusk, the post and its red light on the left third, the crowd at the kerb on the right ---------------
  crossing: {
    version: 1,
    shot: "A wide street at eye level, facing north; one-point view, vanishing point (107,66) on the {post} on the left third; dusk: sky blue to magenta to light red in two bands, a low yellow sun at x 150 half behind " +
      "the far buildings, solid black silhouettes; the road dark and the four {stripes} of the {crossing} in light red running away to the vanishing point; the {light} on the post red, small, with a faint halo; " +
      "subject on the right third (x 190-290) the {crowd} at the kerb, eight black figures of different heights; long solid shadows of three of them fall towards the viewer from the sun; " +
      "wings: left a dark tree and a hydrant with a red cap, right a bus shelter and a lamp standard.",
    draw: `
      vp 107,66
      rect sky1 0,0,320,34 fade:1,5/0,0/0,34
      rect sky2 0,34,320,34 fade:5,12/0,34/0,68
      ellipse sun 150,62,13,13 14
      poly bld1 0,40 30,40 30,70 0,70 0
      poly bld2 30,52 60,52 60,70 30,70 0
      poly bld3 60,34 84,34 84,70 60,70 0
      poly bld4 118,48 150,48 150,70 118,70 0
      poly bld5 168,30 200,30 200,70 168,70 0
      poly bld6 200,44 244,44 244,70 200,70 0
      poly bld7 244,26 270,26 270,70 244,70 0
      poly bld8 270,46 320,46 320,70 270,70 0
      dots bld_windows 6,46 14,46 22,46 6,56 14,56 22,56 36,58 46,58 66,40 74,40 66,52 74,52 124,54 134,54 124,62 134,62 174,36 184,36 174,48 184,48 174,60 184,60 250,32 260,32 250,44 260,44 250,56 276,52 288,52 300,52 276,60 288,60 c14
      rect road 0,70,320,66 mix:0,1@0.3
      poly pavement 214,66 320,66 320,136 180,136 mix:5,12@0.25
      line kerb 214,66 180,136 c12
      line dash1 40,76 50,76 c12
      line dash2 150,74 164,74 c12
      ellipse puddle 60,126,20,4 mix:,5@0.4
      line tram 0,16 320,16 c0
      line tram2 0,18 320,18 c1
      poly stripe1 10,136@1 46,136@1 46,136@0.3 10,136@0.3 12
      poly stripe2 66,136@1 102,136@1 102,136@0.3 66,136@0.3 12
      poly stripe3 122,136@1 158,136@1 158,136@0.3 122,136@0.3 12
      poly stripe4 178,136@1 214,136@1 214,136@0.3 178,136@0.3 12
      line - 0,136 107,66 c1
      line - 320,136 214,66 c1
      rect post_pole 105,40,5,64 0
      rect post_head 97,34,20,24 0 e5
      ellipse red_light 107,42,5,5 4
ellipse red_light_rim 107,42,5,5 none e12
      ellipse halo1 107,42,13,11 mix:,4@0.2
      rect plate 99,72,16,12 12 e0
      line wire1 106,84 100,112 c5
      line wire2 110,84 114,112 c5
      rect post_base 102,104,10,4 0
      poly shadow1 190,120 202,120 236,136 214,136 0
      poly shadow2 238,120 250,120 286,136 262,136 0
      poly shadow3 214,118 226,118 252,136 232,136 0
      ellipse head1 196,84,4,4 0
      poly body1 190,90 202,90 204,120 188,120 0
      ellipse head2 212,78,4,4 0
      poly body2 206,84 220,84 222,118 204,118 0
      ellipse head3 228,86,4,4 0
      poly body3 222,92 234,92 236,120 220,120 0
      ellipse head4 242,80,4,4 0
      poly body4 236,86 248,86 250,122 234,122 0
      ellipse head5 256,86,4,4 0
      poly body5 250,92 262,92 264,124 248,124 0
      ellipse head6 270,82,4,4 0
      poly body6 264,88 276,88 278,126 262,126 0
      ellipse head7 286,88,4,4 0
      poly body7 280,94 292,94 294,128 278,128 0
      poly umbrella 232,70 262,70 247,60 0
      line - 247,70 247,86 c0
      ellipse tree 14,70,22,28 0
      rect trunk 12,90,5,22 0
      rect hydrant 36,112,8,12 0 e5
      rect hydrant_cap 35,109,10,4 4 e0
      rect shelter_roof 280,64,40,4 0
      rect shelter_post 296,66,3,44 0
      rect lamp_standard 308,20,3,92 0
      ellipse lamp_head 309,18,6,3 14
    `,
    cycles: [{ name: "the red light", areas: ["red_light"], colors: [4, 12], style: "pingpong", ms: 3200 }]
  }
};

// ---- Ending pictures: the strongest shots, one subject each -----------------------------------------------------------------
export const endings = {
  // crossed: the crossing at low sun, the crowd stepping off the kerb, the light green
  crossed: {
    version: 1,
    shot: "Low at street level, facing north into the sun; lowsun: sky pale yellow near the low sun to light blue overhead, the sun a flat yellow disc at x 160, " +
      "things against the bright sky black silhouettes, the sunlit stripes yellow and brown, shade blue-black; the post on the left third with its light GREEN, a red accent only on the hydrant cap; " +
      "subject the crowd crossing the four stripes in mid-stride on the right two thirds, black figures with long solid shadows falling towards the viewer; wings: left the post's far kerb and a tree, right a bus shelter.",
    draw: `
      vp 107,66
      rect sky 0,0,320,70 fade:14,9/0,66/0,0
      ellipse sun 160,64,14,14 14
      poly bldl 0,44 40,44 40,70 0,70 0
      poly bldm 40,56 90,56 90,70 40,70 0
      poly bldr 210,40 250,40 250,70 210,70 0
      poly bldr2 250,52 320,52 320,70 250,70 0
      dots win 8,52 18,52 28,52 54,62 66,62 78,62 218,46 230,46 240,46 260,58 274,58 288,58 c14
      rect road 0,70,320,66 mix:6,1@0.35
      poly stripe1 10,136@1 46,136@1 46,136@0.3 10,136@0.3 14
      poly stripe2 66,136@1 102,136@1 102,136@0.3 66,136@0.3 14
      poly stripe3 122,136@1 158,136@1 158,136@0.3 122,136@0.3 14
      poly stripe4 178,136@1 214,136@1 214,136@0.3 178,136@0.3 14
      poly stripe5 234,136@1 270,136@1 270,136@0.3 234,136@0.3 14
      line - 0,100 320,100 c1
      rect post_pole 105,40,5,64 0
      rect post_head 97,34,20,24 0 e1
      ellipse green_light 107,42,5,5 10 e14
      ellipse halo1 107,42,13,11 mix:,10@0.25
      rect post_base 102,104,10,4 0
      poly sh1 150,112 160,112 140,136 126,136 0
      poly sh2 190,108 200,108 190,136 176,136 0
      poly sh3 226,112 236,112 232,136 218,136 0
      poly sh4 262,108 272,108 276,136 262,136 0
      ellipse h1 155,84,4,4 0
      poly b1 149,90 161,90 163,116 147,116 0
      ellipse h2 195,80,4,4 0
      poly b2 189,86 201,86 203,114 187,114 0
      ellipse h3 231,86,4,4 0
      poly b3 225,92 237,92 239,118 223,118 0
      ellipse h4 267,82,4,4 0
      poly b4 261,88 273,88 275,116 259,116 0
      ellipse h5 123,92,4,4 0
      poly b5 117,98 129,98 131,122 115,122 0
      ellipse h6 295,90,4,4 0
      poly b6 289,96 301,96 303,124 287,124 0
      line leg1 150,116 148,124 c0
      line leg2 158,116 162,126 c0
      line leg3 190,114 186,122 c0
      line leg4 198,114 204,124 c0
      line leg5 228,118 226,126 c0
      line leg6 236,118 240,128 c0
      ellipse tree 20,74,24,30 0
      rect trunk 18,96,5,22 0
      rect hydrant 40,114,8,12 0 e6
      rect hydrant_cap 39,111,10,4 4 e0
      rect shelter_roof 284,70,36,4 0
      rect shelter_post 300,72,3,42 0
      line lane1 20,94 60,94 c1
      line lane2 100,92 140,92 c1
      line lane3 260,96 300,96 c1
      line kerb2 214,66 180,136 c4
      dots road_stones 30,120 70,126 110,118 140,128 20,108 c8
      line tram_wire 0,10 320,10 c0
      line tram_wire2 0,14 320,14 c1
      rect wall_post 316,40,4,70 0
      dots win2 40,60 52,60 c14
      rect bench 270,104,24,3 0
      line - 272,107 272,114 c0
      line - 292,107 292,114 c0
    `
  },

  // rung: every window in town lit at once, from far above
  rung: {
    version: 1,
    shot: "From far above, looking straight down at the town at night; deepnight: blue streets and rooftops going to cyan where the windows' light falls, black roofs, yellow for every window and doorway; " +
      "subject the Button Hall's dark roof in the centre third (x 107-213) with one cyan skylight, around it rows of small black roofs with their windows all lit and small yellow figures on doorsteps; " +
      "gradient: the ground blue to black towards the corners (one); wings: more streets and roofs.",
    draw: `
      rect ground 0,0,320,136 fade:1,0/160,68/0,0
      rect street_h1 0,28,320,6 3
      rect street_h2 0,64,320,6 3
      rect street_h3 0,100,320,6 3
      rect street_v1 52,0,6,136 3
      rect street_v2 264,0,6,136 3
      rect street_v3 160,0,6,28 3
      rect street_v4 160,106,6,30 3
      poly hall_roof 98,36 222,36 222,98 98,98 0 e11
      rect skylight 148,56,24,22 11 e0
      line - 148,67 172,67 c0
      line - 160,56 160,78 c0
      line ridge1 104,46 216,46 c1
      line ridge2 104,86 216,86 c1
      line ridge3 104,60 140,60 c1
      line ridge4 180,60 216,60 c1
      rect vent1 108,40,8,4 1 e11
      rect vent2 198,40,8,4 1 e11
      rect vent3 108,88,8,4 1 e11
      rect vent4 198,88,8,4 1 e11
      rect chimney 134,86,6,8 1 e11
      line hall_door 160,98 160,106 c11
      dots hall_lights 120,100 130,100 190,100 200,100 c14
      rect tower_clock 156,22,8,8 11 e0
      line - 160,22 160,30 c0
      poly roof1 4,4 22,4 22,24 4,24 0 e1
      poly roof2 28,6 46,6 46,24 28,24 0 e1
      poly roof3 64,4 90,4 90,24 64,24 0 e1
      poly roof4 104,6 128,6 128,24 104,24 0 e1
      poly roof5 136,4 154,4 154,24 136,24 0 e1
      poly roof6 172,6 196,6 196,24 172,24 0 e1
      poly roof7 204,4 226,4 226,24 204,24 0 e1
      poly roof8 232,6 258,6 258,24 232,24 0 e1
      poly roof9 276,4 316,4 316,24 276,24 0 e1
      poly roof10 4,38 22,38 22,60 4,60 0 e1
      poly roof11 28,40 48,40 48,60 28,60 0 e1
      poly roof12 64,38 90,38 90,60 64,60 0 e1
      poly roof13 230,40 258,40 258,60 230,60 0 e1
      poly roof14 276,38 316,38 316,60 276,60 0 e1
      poly roof15 4,74 22,74 22,96 4,96 0 e1
      poly roof16 28,76 48,76 48,96 28,96 0 e1
      poly roof17 64,74 92,74 92,96 64,96 0 e1
      poly roof18 230,76 258,76 258,96 230,96 0 e1
      poly roof19 276,74 316,74 316,96 276,96 0 e1
      poly roof20 4,110 22,110 22,132 4,132 0 e1
      poly roof21 64,110 92,110 92,132 64,132 0 e1
      poly roof22 104,112 128,112 128,132 104,132 0 e1
      poly roof23 172,112 196,112 196,132 172,132 0 e1
      poly roof24 232,110 258,110 258,132 232,132 0 e1
      poly roof25 276,110 316,110 316,132 276,132 0 e1
      dots lit1 8,10 14,10 8,16 14,16 32,10 40,10 68,10 76,10 84,10 68,17 84,17 108,12 116,12 122,12 140,10 148,10 176,12 184,12 190,12 208,10 216,10 238,12 250,12 280,10 292,10 304,10 280,18 292,18 304,18 c14
      dots lit2 8,44 14,44 8,52 14,52 32,46 40,46 68,44 76,44 84,44 68,52 84,52 234,46 244,46 252,46 280,44 292,44 304,44 280,52 292,52 304,52 c14
      dots lit3 8,80 14,80 8,88 14,88 32,82 40,82 68,80 76,80 84,80 68,88 84,88 234,82 244,82 252,82 280,80 292,80 304,80 280,88 292,88 304,88 c14
      dots lit4 8,116 14,116 8,124 14,124 68,116 76,116 84,116 108,118 116,118 122,118 176,118 184,118 190,118 236,116 246,116 254,116 280,116 292,116 304,116 c14
      dots steps 24,30 62,30 94,66 132,66 164,32 198,66 262,32 270,66 14,102 56,102 98,102 160,104 226,102 266,102 c15
      dots people 25,32 61,32 95,68 133,68 163,34 199,68 261,34 271,68 15,104 57,104 99,104 161,106 227,104 267,104 c14
    `
  },

  // clerk: the relief chair at the foot of the wall, the coat on the hook
  clerk: {
    version: 1,
    shot: "Close, eye level, facing the wall; lamplight: brown wall and floor, yellow on the lit row and the lamp's pool, black for the chair and the coat; one light, the shaded desk lamp at the left (x 60), with a soft halo; " +
      "subject the swivel chair on the centre-left third (x 107), its seat dented, seen from the front before the wall of buttons, one row of the wall lit yellow; on the right third a coat on a hook; " +
      "gradient: the floor brown to black away from the lamp (one only); wings: left the desk edge, right the doorframe.",
    draw: `
      rect wall 0,0,320,100 6
      rect panel 40,10,240,76 0 e6
      rect row1 46,16,228,5 mix:14,6@0.5
      rect row2 46,26,228,5 mix:14,6@0.5
      rect row3 46,36,228,5 mix:14,6@0.5
      rect row4 46,46,228,5 mix:14,6@0.5
      rect row5 46,56,228,5 mix:14,6@0.5
      rect row6 46,66,228,5 14
      rect row7 46,76,228,5 mix:14,6@0.5
      line - 46,22 274,22 c0
      line - 46,32 274,32 c0
      line - 46,42 274,42 c0
      line - 46,52 274,52 c0
      line - 46,62 274,62 c0
      line - 46,72 274,72 c0
      poly floor 0,136 0,100 320,100 320,136 fade:6,0/0,100/0,136
      line - 0,100 320,100 c0
      line - 0,112 320,112 c0
      ellipse halo1 60,44,60,32 mix:,14@0.1
      ellipse halo2 60,44,38,20 mix:,14@0.2
      ellipse halo3 60,44,18,9 mix:,14@0.35
      line lamp_stem 60,100 60,60 c8
      poly lamp_shade 46,40 74,40 80,56 40,56 14 e0
      ellipse lamp_bulb 60,58,5,2 15
      rect desk_edge 0,100,34,36 0 e6
      poly chair_back 86,52 128,52 132,98 82,98 0 e6
      line - 94,58 94,94 c6
      line - 106,58 106,94 c6
      line - 118,58 118,94 c6
      poly chair_seat 76,98 140,98 148,108 68,108 0 e6
      ellipse dent 108,102,22,3 6
      line chair_post 108,108 108,122 c6
      line chair_base1 108,122 84,132 c6
      line chair_base2 108,122 134,132 c6
      line chair_base3 108,122 108,134 c6
      dots castors 84,133 134,133 108,135 c6
      line hook_bar 214,30 214,36 c14
      rect hook_plate 206,28,16,4 6 e0
      poly coat 200,36 230,36 236,96 194,96 0 e6
      line - 214,38 214,94 c6
      line coat_sleeve1 200,38 192,70 c6
      line coat_sleeve2 230,38 238,70 c6
      poly hat 204,22 224,22 220,28 208,28 0 e6
      rect frame 290,0,30,136 0 e6
      rect plate_relief 150,100,40,3 14
      poly cuff 60,64 70,64 66,70 62,70 0 e6
      dots stud_glints 60,18 100,18 140,18 180,18 220,18 260,18 c15
      line - 40,10 40,86 c6
      line - 280,10 280,86 c6
      rect nameplate 100,88,120,3 6
      line sleeve_fold 214,60 214,90 c0
      line - 296,0 296,136 c6
    `
  },

  // died: the bare terminals and the spark that reaches you
  died: {
    version: 1,
    shot: "Close, eye level; ember: black, red and light red, yellow on the brass where the spark lights it, blue where the dark shows; one light, the spark, a flat jagged shape in yellow and white; " +
      "subject five big brass posts across the centre (x 60-260), the spark leaping from the third to the fourth and a hand-sized shape reaching in from the left edge; behind them a dark glass jar, its water glowing red; " +
      "gradient: the back wall black to red behind the jar (the spark's glow, one only); wings: more posts and a wire coil.",
    draw: `
      rect back 0,0,320,136 0
      rect glow 70,20,180,90 fade:4,0/160,20/160,110
      rect jar 100,24,120,86 1 e8
      rect jar_water 104,52,112,54 mix:4,12@0.35
      line - 104,52 216,52 c12
      dots bubbles 120,70 140,84 168,66 190,90 206,74 c12
      rect rail 20,100,280,12 6 e0
      rect post1 60,60,16,44 6 e0
      rect post2 110,60,16,44 6 e0
      rect post3 160,60,16,44 6 e0
      rect post4 210,60,16,44 6 e0
      rect post5 260,60,16,44 6 e0
      rect cap1 56,54,24,8 14 e0
      rect cap2 106,54,24,8 14 e0
      rect cap3 156,54,24,8 14 e0
      rect cap4 206,54,24,8 14 e0
      rect cap5 256,54,24,8 14 e0
      ellipse spark_glow 190,52,40,22 mix:,14@0.3
      line spark 172,54 180,40 186,56 194,38 200,56 208,44 212,56 c15
      line spark2 176,56 184,44 190,58 c14
      poly hand 0,60 40,56 50,66 48,86 0,90 12 e4
      line - 10,64 40,62 c4
      line - 10,72 44,72 c4
      line - 10,80 44,80 c4
      ellipse coil 296,120,22,10 6 e0
      ellipse coil_in 296,120,14,5 0
      rect floor 0,112,320,24 mix:0,4@0.4
      line hi1 63,62 63,102 c14
      line hi2 113,62 113,102 c14
      line hi3 163,62 163,102 c14
      line hi4 213,62 213,102 c14
      line hi5 263,62 263,102 c14
      rect bolt_l 24,106,6,4 8 e0
      rect bolt_r 288,106,6,4 8 e0
      line wire_a 276,64 300,40 c12
      line wire_b 300,40 320,44 c12
      line jar_hi 106,28 106,48 c12
      line jar_lid 100,24 220,24 c12
      dots sparks_small 150,34 160,30 230,36 240,44 150,44 c14
      line finger1 10,64 40,60 c12
      poly thumb 30,86 50,84 52,96 32,98 12 e4
      line crack 120,112 130,130 c4
      line crack2 200,112 190,132 c4
      ellipse shadow 140,120,60,3 mix:0,4@0.7
      poly stand_l 20,100 40,112 40,136 20,136 8 e0
      rect label 230,40,30,10 14 e0
    `,
    cycles: [{ name: "the spark", areas: ["spark"], colors: [15, 14], style: "flicker", ms: [80, 300] }]
  }
};
