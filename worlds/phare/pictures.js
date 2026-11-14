// Pictures for "A Light for the Galerie Aubry" (worlds/phare/world.en.js), one per room and one per ending, written by hand in the
// short notation (BRIEF.md §7): 320 x 136, EGA colours 0-15, shapes back to front, ids on what the story may change or a cycle animates.
// Style: dithered. The shot list, written before drawing (viewpoint; subject and columns; palette):
//   cart          eye level, looking in, north; the hatch on the right third, the horn on the left third; lamplight
//   cellar        eye level, down a brick vault to a stair, north; the stair and its light on the right third, the tally on the left; cellar
//   packing_room  three-quarter, from a corner, north; the labelled frame on the left third, the bench on the right; goldenhour
//   boiler        silhouette against the fire door; the boiler on the left third, the shelf of tins on the right; ember
//   vestibule     one-point, north, down a marble floor to the hall doors; the visitors' book on the left third; gaslight
//   cloakroom     frontal, a counter across the foot, pegs behind; the coat on the left third, the bell and flask on the right; cafe
//   hall          one-point, north, down a long hall of frames to the stair on the right third; arcade
//   office        frontal at the desk; the desk and green bracket on the right third, the ledger below it; lamplight
//   west_gallery  from the doorway, north-west; plaster casts, the watchman on his chair on the left third; institution
//   landing       frontal at a half-landing; the round window on the left third, the heavy door on the right; gaslight
//   lens_room     eye level, north, under a dome; the lens on the left third, the painting on the right; deepnight
//   roof          wide landscape from the ridge, north; the drainpipe on the right third, the moon on the left; moonlight
//   caught        (ending) the front steps from the street, lit; fog
//   carried       (ending) far away, dawn over the roofs; the figure on the left third, the dome burning on the right; dusk
//   keeper        (ending) close-up, the lens lit, the beam over the roofs; deepnight
// Read down: no two neighbours share a viewpoint; the endings take the silhouette and close-up and far-away views.

export default {
  // ---- THE PACKING VAN (the opening) -------------------------------------------------------------------------------
  cart: {
    version: 1,
    shot: "Eye level, looking in, north; lamplight; one lantern hanging in the middle, a flat yellow pane in brown glow; the {hatch} in the floor on the right third, brightest, lit yellow with a ring; the {horn} on its nail on the left third, with its tube trailing off; wings: strapped {crates} stacked to the roof either side, straw and a coil of rope on the floor, the {tarpaulin} laced down; dressing: {straw}, a coil of rope; moves: the lantern's glow (lamplight)",
    draw: `
      vp 160,64
      rect tarp 0,0,320,96 mix:6,0@0.3
      poly tarp_fold_l 0,0 44,0 56,96 0,96 mix:6,0@0.55
      poly tarp_fold_r 320,0 276,0 264,96 320,96 mix:6,0@0.55
      line rib1 96,0 102,96 c0
      line rib2 160,0 160,96 c0
      line rib3 226,0 220,96 c0
      line seam 0,46 320,42 c0
      dots laces 8,92 30,92 52,92 74,92 96,92 118,92 140,92 162,92 184,92 206,92 228,92 250,92 272,92 294,92 c14
      rect floor 0,96,320,40 6
      line plank1 0,136@1 0,136@0.55 c0
      line plank2 60,136@1 60,136@0.55 c0
      line plank3 120,136@1 120,136@0.55 c0
      line plank4 200,136@1 200,136@0.55 c0
      line plank5 260,136@1 260,136@0.55 c0
      line plank6 320,136@1 320,136@0.55 c0
      poly floor_lit 120,96 200,96 240,136 80,136 mix:6,14@0.2
      rect crate_l1 4,54,66,42 6 e0
      line - 4,68 70,68 c0
      line - 4,82 70,82 c0
      line - 24,54 24,96 c0
      rect crate_l2 12,22,52,32 6 e0
      line - 12,38 64,38 c0
      line - 34,22 34,54 c0
      rect crate_l_label 44,64,14,8 7
      dots crate_l_nails 8,58 8,90 66,58 66,90 16,26 60,26 c14
      rect crate_r1 252,52,62,44 6 e0
      line - 252,66 314,66 c0
      line - 252,82 314,82 c0
      line - 282,52 282,96 c0
      rect crate_r2 260,22,50,30 6 e0
      line - 260,38 310,38 c0
      line - 286,22 286,52 c0
      rect crate_r_label 262,70,14,8 7
      dots crate_r_nails 256,56 310,56 264,26 306,26 256,92 310,92 c14
      poly shadow_l 4,96 70,96 96,110 24,110 0
      poly shadow_r 314,96 252,96 232,110 300,110 0
      poly straw_a 90,122 112,114 140,118 160,124 138,132 100,132 14 e6
      poly straw_b 262,124 282,116 304,120 312,130 280,134 14 e6
      line straw_c 96,126 120,120 c6
      line straw_d 270,128 296,122 c6
      ellipse rope 36,122,16,6 6 e0
      ellipse rope_in 36,122,8,3 0
      line rope_tail 52,122 66,126 80,124 c6
      poly hatch 188,106 240,106 258,128 170,128 14 e0
      line - 202,106 192,128 c6
      line - 216,106 214,128 c6
      line - 230,106 236,128 c6
      ellipse hatch_ring 214,116,5,2 8 e0
      rect hatch_frame 168,128,92,3 6
      rect nail 103,38,3,4 7
      line horn_tube 104,60 84,72 52,84 24,78 c8
      line horn_tube2 24,78 8,70 c8
      line chain 160,0 160,18 c8
      rect lant_cap 152,18,16,4 8
      rect lant_body 154,22,12,16 6 e0
      ellipse lant_glow 160,30,28,20 mix:,14@0.2
      ellipse lant_glow2 160,30,15,11 mix:,14@0.35
      rect lant_pane 157,25,6,10 14
      ellipse lant_flame 160,31,2,3 12
      rect lant_foot 154,38,12,3 8
      ellipse pail 290,124,9,5 7 e0
      rect pail_rim 281,119,18,2 8
      line broom 20,100 30,132 c6
      poly broom_head 24,128 36,128 38,134 22,134 14 e6
    `,
    cycles: [{ name: "the lantern's glow", areas: ["lant_glow", "lant_glow2", "lant_pane"], colors: [14, 6], style: "flicker", ms: [700, 2200] }],
    overlays: [{ object: "horn", at: [96, 40] }]
  },

  // ---- CRATE CELLAR: down a brick vault to a stair and its light ---------------------------------------------------------
  cellar: {
    version: 1,
    shot: "Eye level, down a brick vault, north; vanishing point at x 213; cellar; one lamp off to the left throwing yellow on the brick and the cases, cold blue-grey beyond; the stair rising to a lit doorway on the right third, the {tally} of white chalk strokes on the left wall; doorways west and east in the side walls; wings: stacked {cases} and an arch of {vaults}, wet brick; dressing: {bricks}, a lamp on a hook; moves: the lamp (lamplight)",
    draw: `
      vp 213,60
      rect wall 0,0,320,136 mix:1,0@0.4
      poly vault 0,0 320,0 213,60 213,60 0,0 mix:8,0@0.5
      poly floor 0,136@1 320,136@1 320,136@0.2 0,136@0.2 mix:8,6@0.35
      poly wall_l 0,0@1 0,136@1 0,136@0.2 0,0@0.2 mix:8,1@0.4
      poly wall_r 320,0@1 320,136@1 320,136@0.2 320,0@0.2 mix:8,1@0.45
      poly end_wall 140,50 280,50 280,100 140,100 0
      poly stair_door 190,52 236,52 236,98 190,98 14 e0
      rect stair_dark 196,52,34,4 6
      poly step1 176,98 250,98 256,106 170,106 7 e0
      poly step2 182,90 244,90 248,98 178,98 7 e0
      poly step3 188,82 238,82 242,90 184,90 8 e0
      poly step4 194,74 232,74 236,82 190,82 8 e0
      poly step5 200,66 226,66 230,74 196,74 8 e0
      line brick_l1 0,28 44,36 c0
      line brick_l2 0,52 60,56 c0
      line brick_l3 0,76 70,78 c0
      line brick_l4 0,100 80,98 c0
      line brick_r1 320,28 280,36 c0
      line brick_r2 320,52 270,56 c0
      line brick_r3 320,76 262,78 c0
      line brick_r4 320,100 256,98 c0
      poly arch_w 0,40 38,48 38,100 0,112 0 e1
      poly arch_e 320,40 292,46 292,92 320,104 0 e1
      rect case_l1 12,60,36,30 6 e0
      line - 12,74 48,74 c0
      line - 30,60 30,90 c0
      rect case_l2 22,36,26,24 6 e0
      line - 22,48 48,48 c0
      rect case_r1 262,66,40,28 6 e0
      line - 262,80 302,80 c0
      line - 282,66 282,94 c0
      rect case_r2 274,44,26,22 6 e0
      rect case_stencil 24,70,10,6 7
      rect case_stencil2 268,72,10,6 7
      rect tally_wall 70,40,52,36 mix:8,0@0.35
      line tally1 78,48 78,60 c15
      line tally2 84,48 84,60 c15
      line tally3 90,48 90,60 c15
      line tally4 96,48 96,60 c15
      line tally5 76,60 100,48 c15
      line tally6 108,48 108,60 c15
      line tally7 114,48 114,60 c15
      line tally8 104,66 118,66 c15
      poly lamp_pool 60,136 150,136 130,110 80,110 mix:6,14@0.4
      poly lamp_wall 60,100 120,100 126,56 66,56 mix:6,14@0.22
      ellipse lamp_glow 90,30,24,18 mix:,14@0.2
      ellipse lamp_glow2 90,30,12,9 mix:,14@0.35
      line lamp_hook 90,0 90,18 c8
      rect lamp_body 85,18,10,13 6 e0
      rect lamp_pane 87,20,6,8 14
      poly shadow_case 12,90 48,90 80,110 40,110 0
      poly shadow_stair 176,106 256,106 270,118 160,118 0
      line drip 150,0 150,14 c1
      ellipse puddle 120,124,18,4 1 e8
      line puddle_glint 110,124 122,124 c9
      dots damp 20,20 40,10 70,16 270,14 300,20 250,30 c1
      rect rail 244,60,3,40 8 e0
      line brick_e1 150,60 188,60 c0
      line brick_e2 238,60 270,60 c0
      line brick_e3 150,76 188,76 c0
      line brick_e4 238,76 270,76 c0
      rect lamp_bracket 84,16,12,3 8
      dots moss 12,44 30,48 46,40 290,44 c2
    `,
    cycles: [{ name: "the lamp", areas: ["lamp_glow", "lamp_glow2", "lamp_pane"], colors: [14, 6], style: "flicker", ms: [700, 2200] }],
    overlays: []
  },

  // ---- PACKING ROOM: a bench, drifts of wood-wool, the label on a bare frame ----------------------------------------------
  packing_room: {
    version: 1,
    shot: "Three-quarter view from a corner, north; lamplight; one low lamp from the left throwing yellow on the bench top, brown walls, black shadows; the bare frame with its {label} on the left third, light on the label; the {bench} on the right third with a hammer on a nail; wings: {frames} leaning against the wall, drifts of {wood-wool} on the floor; dressing: {crowbars} hung on the wall; moves: the lamp glow (lamplight)",
    draw: `
      vp 120,64
      rect wall 0,0,320,100 6
      poly wall_dark 0,0 320,0 320,30 0,30 mix:6,0@0.5
      poly wall_edge 0,0 20,0 20,100 0,100 mix:6,0@0.4
      rect floor 0,100,320,36 mix:6,0@0.3
      line plank1 0,136@1 0,136@0.6 c0
      line plank2 80,136@1 80,136@0.6 c0
      line plank3 160,136@1 160,136@0.6 c0
      line plank4 240,136@1 240,136@0.6 c0
      line plank5 320,136@1 320,136@0.6 c0
      rect frame_big 80,20,56,64 6 e0
      rect frame_in 88,28,40,48 mix:6,0@0.55
      line frame_gild 80,20 136,20 c14
      line frame_gild2 80,20 80,84 c14
      rect label 96,42,24,14 15 e0
      line - 100,46 116,46 c0
      line - 100,50 112,50 c0
      line - 100,53 114,53 c0
      dots tacks 98,44 118,44 98,54 118,54 c0
      rect frame2 150,34,40,50 6 e0
      rect frame2_in 156,40,28,38 mix:6,0@0.5
      line frame2_gild 150,34 190,34 c14
      rect frame3 22,40,40,44 6 e0
      rect frame3_in 28,46,28,32 mix:6,0@0.5
      rect paper_wrap 24,50,36,26 15 e0
      line - 24,58 60,58 c0
      line - 24,66 60,66 c0
      poly bench_top 196,76 316,76 320,86 190,86 14 e0
      rect bench_body 200,86,112,28 6 e0
      line - 200,94 312,94 c0
      rect bench_leg1 202,114,8,22 6 e0
      rect bench_leg2 302,114,8,22 6 e0
      line crowbar1 222,28 222,64 c0
      line crowbar1_hook 222,28 228,24 c0
      line crowbar2 240,32 240,66 c15
      line crowbar2_hook 240,32 246,28 c15
      line crowbar3 258,30 258,64 c0
      rect hammer_head 280,46,12,5 15 e0
      line hammer_shaft 286,51 286,72 c6
      rect nail 284,44,3,3 0
      ellipse lamp_glow 40,16,28,20 mix:,14@0.2
      ellipse lamp_glow2 40,16,14,10 mix:,14@0.35
      rect lamp_pane 36,10,8,12 14
      line lamp_cord 40,0 40,10 c0
      poly bench_lit 196,76 316,76 320,86 190,86 mix:14,6@0.5
      poly wool1 20,112 50,104 80,110 90,120 60,128 26,126 14 e6
      poly wool2 120,118 150,112 180,118 176,128 130,130 14 e6
      poly wool3 250,122 282,116 310,122 304,132 260,134 14 e6
      line wool_strand1 30,116 62,110 c6
      line wool_strand2 130,122 164,118 c6
      line wool_strand3 262,126 296,122 c6
      poly shadow_frame 80,84 136,84 150,100 94,100 0
      poly shadow_bench 190,114 312,114 320,128 200,128 0
      rect nail_box 160,100,22,12 15 e0
      line - 160,106 182,106 c0
      poly shadow_wool 90,128 126,128 140,134 100,134 0
      poly saw 300,40 316,44 316,54 300,50 15 e0
      line saw_teeth 300,50 316,54 c0
      ellipse twine 120,128,8,4 14 e6
      ellipse twine_in 120,128,3,1 6
      rect paper_roll 28,92,10,30 15 e0
    `,
    cycles: [{ name: "the lamp", areas: ["lamp_glow", "lamp_glow2", "lamp_pane"], colors: [14, 6], style: "flicker", ms: [700, 2200] }],
    overlays: []
  },

  // ---- BOILER ROOM: the boiler's red door, a coal chute, a shelf of tins --------------------------------------------------
  boiler: {
    version: 1,
    shot: "Eye level, frontal, north; ember; the one light the boiler's open fire door, red to yellow, on the left third; the {boiler} black against it; the {chute} climbing into the dark centre-right; a shelf of {tins} on the right third, the oil can among them; wings: pipes and coal heaps, a dim brick wall; dressing: {coal}; moves: the fire (firelight)",
    draw: `
      vp 160,64
      rect wall 0,0,320,136 mix:4,0@0.4
      rect floor 0,104,320,32 mix:4,0@0.6
      line brick1 0,24 320,24 c0
      line brick2 0,48 320,48 c0
      line brick3 0,72 320,72 c0
      line brick4 0,96 320,96 c0
      poly boiler 52,40 170,40 176,104 46,104 0 e4
      rect boiler_band1 46,56,130,4 8
      rect boiler_band2 46,82,130,4 8
      ellipse boiler_dome 111,42,59,10 8 e0
      rect fire_door 84,66,54,32 0 e8
      rect fire_glow 88,70,46,24 12
      rect fire_core 98,76,26,16 14
      ellipse fire_hot 111,86,8,5 15
      ellipse glow_out 111,86,60,22 mix:,12@0.18
      ellipse glow_out2 111,86,36,14 mix:,12@0.3
      poly floor_glow 56,104 166,104 190,136 32,136 mix:4,14@0.4
      rect pipe1 176,20,6,50 8 e0
      rect pipe2 188,34,6,60 7 e0
      rect pipe_bend 176,16,24,5 8 e0
      rect pipe_valve 184,58,14,6 4 e0
      dots rivets 50,60 50,86 172,60 172,86 c7
      poly chute 220,0 252,0 262,60 214,60 0 e8
      line chute_l 224,0 218,60 c8
      line chute_r 248,0 258,60 c8
      poly shutter 216,60 260,60 260,70 216,70 8 e0
      line chain 226,70 234,86 242,72 c7
      poly coal1 200,104 240,94 270,100 280,112 210,114 0 e8
      poly coal2 14,108 40,100 62,106 60,120 20,120 0 e8
      dots coal_shine 214,102 236,98 252,104 24,110 40,106 c7
      rect shelf 232,68,76,5 6 e0
      rect shelf2 232,92,76,5 6 e0
      rect shelf_post1 232,68,4,36 6 e0
      rect shelf_post2 304,68,4,36 6 e0
      rect tin1 240,52,12,16 7 e0
      rect tin2 256,56,10,12 8 e0
      rect tin3 270,50,12,18 7 e0
      rect tin4 286,56,12,12 8 e0
      rect tin5 240,78,10,14 8 e0
      rect tin6 256,74,14,18 7 e0
      rect tin_label 258,80,10,6 15
      rect tin7 276,76,12,16 8 e0
      rect tin_cap1 240,50,12,2 14
      rect tin_cap2 270,48,12,2 4
      poly shadow_boiler 46,104 176,104 200,120 66,120 0
      poly shadow_tins 232,104 308,104 316,118 240,118 0
      rect bucket 14,84,14,18 7 e0
      line bucket_h 14,84 28,84 c8
      line poker 30,60 30,102 c8
      rect poker_h 28,58,6,3 8
      ellipse gauge 150,60,7,7 15 e0
      line gauge_hand 150,60 154,56 c0
      rect brick_arch 80,60,62,4 8
      rect ash_pan 90,100,40,6 8 e0
      dots ash 96,104 106,104 118,104 126,104 c7
      rect shovel_head 34,96,10,8 7 e0
      line shovel 38,96 38,70 c8
      rect lamp_hook 292,20,3,10 8
      rect tin8 300,56,6,12 7 e0
      line pipe_drip 185,64 185,76 c9
    `,
    cycles: [{ name: "the fire", areas: ["fire_glow", "fire_core", "glow_out", "glow_out2", "floor_glow"], colors: [12, 4], style: "flicker", ms: [500, 1600] }],
    overlays: [{ object: "oilcan", at: [296, 52] }]
  },

  // ---- VESTIBULE: marble, a stand with the visitors' book, doors ahead -----------------------------------------------------
  vestibule: {
    version: 1,
    shot: "One-point view, north, vanishing point at x 160,62; lamplight; marble floor in brown and black squares running to the great hall's doorway, a gas globe either side; the visitors' {book} on its stand on the left third; wings: a marble pilaster and the {marble} floor, the cloakroom doorway on the right; dressing: gas globes on brackets; moves: the globes (lamplight)",
    draw: `
      vp 160,62
      rect wall 0,0,320,100 mix:6,0@0.35
      rect ceiling 0,0,320,26 mix:6,0@0.6
      poly floor 0,136@1 320,136@1 320,136@0.2 0,136@0.2 mix:6,0@0.5
      poly wall_l 0,0@1 0,136@1 0,136@0.2 0,0@0.2 mix:6,0@0.4
      poly wall_r 320,0@1 320,136@1 320,136@0.2 320,0@0.2 mix:6,0@0.4
      poly door_far 138,40 182,40 182,92 138,92 0 e14
      poly door_far_glow 144,46 176,46 176,92 144,92 mix:6,14@0.4
      line door_far_bar 160,46 160,92 c0
      line tile1 0,136@1 0,136@0.2 c0
      line tile2 80,136@1 80,136@0.2 c0
      line tile3 160,136@1 160,136@0.2 c0
      line tile4 240,136@1 240,136@0.2 c0
      line tile5 320,136@1 320,136@0.2 c0
      line tile_cross1 0,126 320,126 c0
      line tile_cross2 0,110 320,110 c0
      line tile_cross3 40,96 280,96 c0
      line tile_cross4 80,88 240,88 c0
      rect pilaster_l 10,10,26,96 6 e0
      rect pilaster_l_cap 6,10,34,6 14 e0
      rect pilaster_l_base 6,100,34,6 14 e0
      rect pilaster_r 284,10,26,96 6 e0
      rect pilaster_r_cap 280,10,34,6 14 e0
      rect pilaster_r_base 280,100,34,6 14 e0
      poly cloak_door 250,46 280,40 280,100 250,102 0 e6
      rect cloak_lintel 246,38,38,4 14
      rect stand_leg 100,92,6,28 6 e0
      rect stand_foot 94,118,18,4 6 e0
      poly stand_top 84,80 126,72 130,86 88,92 6 e0
      poly book 90,76 118,72 120,80 92,84 15 e0
      line book_spine 104,74 106,82 c0
      line book_line1 94,78 102,76 c0
      line book_line2 108,76 116,74 c0
      line pen 124,70 134,64 c0
      rect globe_l_post 60,24,3,40 0
      ellipse globe_l 62,22,6,7 14
      ellipse globe_l_glow 62,22,18,14 mix:,14@0.22
      ellipse globe_l_glow2 62,22,10,8 mix:,14@0.38
      rect globe_r_post 258,24,3,40 0
      ellipse globe_r 260,22,6,7 14
      ellipse globe_r_glow 260,22,18,14 mix:,14@0.22
      ellipse globe_r_glow2 260,22,10,8 mix:,14@0.38
      poly pool_l 30,136 100,136 120,112 52,112 mix:6,14@0.25
      poly pool_r 220,136 290,136 270,112 200,112 mix:6,14@0.25
      poly shadow_stand 100,122 130,122 150,130 110,130 0
      rect door_far_lintel 134,34,52,6 14 e0
      dots tile_marks 40,130 120,122 200,124 280,132 c15
      ellipse mat 160,126,28,5 4 e0
      poly step_r 276,100 320,104 320,112 270,110 15 e0
      rect umb_stand 268,104,12,24 6 e0
      line umb1 272,104 270,90 c0
      line umb2 276,104 280,88 c0
      rect plaque_l 44,50,10,14 14 e0
      rect plaque_r 266,50,10,14 14 e0
      ellipse bust_head 224,76,5,6 15 e0
      rect bust_plinth 218,82,14,22 15 e0
      ellipse clock 160,20,6,6 15 e0
      line clock_h 160,20 160,16 c0
      line clock_h2 160,20 164,20 c0
      line picture_rail_l 0,70@1 0,70@0.3 c14
      line picture_rail_r 320,70@1 320,70@0.3 c14
    `,
    cycles: [{ name: "the globes", areas: ["globe_l", "globe_l_glow", "globe_l_glow2", "globe_r", "globe_r_glow", "globe_r_glow2"], colors: [14, 6], style: "flicker", ms: [900, 2400] }],
    overlays: []
  },

  // ---- CLOAKROOM: a counter, pegs, a heavy coat -------------------------------------------------------------------------------
  cloakroom: {
    version: 1,
    shot: "Frontal at a counter, north; lamplight; brown walls and floor, a lit yellow counter top, white fittings; the one {coat} on a peg on the left third, big and dark; a brass {bell} on the green counter on the right third, the flask beside it; wings: rows of empty {pegs}, a ticket rack; dressing: a ticket rack; moves: the bell's glint (glint)",
    draw: `
      rect wall 0,0,320,100 mix:6,0@0.35
      rect wall_top 0,0,320,12 6
      rect floor 0,100,320,36 mix:6,0@0.45
      line floor_line1 0,112 320,112 c0
      line floor_line2 0,126 320,126 c0
      line peg_rail 20,28 300,28 c0
      rect rail_board 14,24,292,8 6 e0
      rect peg1 30,32,3,10 15
      rect peg2 54,32,3,10 15
      rect peg3 78,32,3,10 15
      rect peg4 190,32,3,10 15
      rect peg5 214,32,3,10 15
      rect peg6 238,32,3,10 15
      rect peg7 262,32,3,10 15
      rect peg8 286,32,3,10 15
      poly coat 84,32 130,32 138,96 76,96 0 e6
      poly coat_collar 94,32 120,32 114,48 100,48 0
      line coat_seam 107,48 107,96 c0
      rect coat_pocket 112,70,16,12 0
      line coat_hem 76,96 138,96 c4
      line coat_sleeve 84,36 78,86 c0
      rect hook_coat 104,26,8,6 14
      rect counter 0,84,320,18 6 e0
      rect counter_top 0,80,320,4 14 e0
      rect counter_front 0,102,320,10 6 e0
      line counter_p1 80,86 80,102 c0
      line counter_p2 160,86 160,102 c0
      line counter_p3 240,86 240,102 c0
      line - 0,106 320,106 c0
      poly baize 152,77 230,77 234,84 148,84 4 e0
      ellipse bell_base 208,74,10,3 14 e0
      ellipse bell_dome 208,68,8,7 14 e0
      rect bell_knob 206,58,4,4 14
      rect bell_glint 204,64,2,6 15
      rect rack 20,52,40,24 15 e0
      line rack_l1 20,60 60,60 c0
      line rack_l2 20,68 60,68 c0
      line rack_v 40,52 40,76 c0
      rect ticket1 24,54,6,5 15
      rect ticket2 44,62,6,5 15
      rect ticket3 24,70,6,5 15
      rect clock_face 262,48,20,20 15 e0
      line clock_h1 272,58 272,50 c0
      line clock_h2 272,58 278,58 c0
      ellipse clock_dot 272,58,1,1 0
      poly shadow_counter 0,112 320,112 320,122 0,122 0
      rect stool 250,92,22,4 15 e0
      rect stool_leg1 252,96,3,16 15
      rect stool_leg2 268,96,3,16 15
      dots wall_stains 40,12 90,8 150,16 220,10 290,14 c6
      line frame_line 0,12 320,12 c14
      rect mirror 170,30,24,26 9 e0
      line mirror_glint 174,34 180,44 c15
      rect hat_shelf 230,10,70,4 6 e0
      rect hatbox_a 238,0,16,10 15 e0
      rect hatbox_b 262,2,14,8 14 e0
      rect hatbox_c 282,0,14,10 4 e0
      line umbrella 300,70 306,98 c0
      poly umb_cloth 296,62 312,62 308,76 300,76 0 e0
      rect lost_glove 44,92,8,6 15
      ellipse floor_mat 130,128,30,5 14 e6
      ellipse ink_pot 130,76,4,3 0 e0
      rect docket 100,74,16,4 15 e0
    `,
    cycles: [{ name: "the bell's glint", areas: ["bell_glint"], colors: [15, 14], style: "flicker", ms: [900, 2600] }],
    overlays: [{ object: "flask", at: [180, 64] }]
  },

  // ---- SALLE DES MARINES: a long hall of sea pictures under gas, a stair on the right ---------------------------------------------
  hall: {
    version: 1,
    shot: "One-point view, north, vanishing point at x 213,60; deepnight; blue walls going to black at the far end, gilt frames lit by a gas jet each, a {wire} from every frame to a brass bell on the cornice; the stair climbing on the right third; the {pictures} marching away down the left wall; wings: nearer frames, the doorway to the {jets}; dressing: bells on the cornice, gas jets; moves: the jets (lamplight)",
    draw: `
      vp 213,60
      rect wall 0,0,320,136 1
      poly floor 0,136@1 320,136@1 320,136@0.15 0,136@0.15 mix:1,3@0.35
      poly wall_l 0,0@1 0,136@1 0,136@0.15 0,0@0.15 mix:1,0@0.2
      poly wall_r 320,0@1 320,136@1 320,136@0.15 320,0@0.15 mix:1,0@0.25
      poly ceil 0,0@1 320,0@1 320,0@0.15 0,0@0.15 mix:1,0@0.55
      poly end 196,50 232,50 232,76 196,76 0
      poly frame_l1 6,26 56,34 56,92 6,100 14 e0
      poly frame_l1_in 12,34 50,40 50,86 12,92 mix:1,0@0.5
      poly frame_l2 68,34 110,40 110,84 68,90 14 e0
      poly frame_l2_in 74,41 104,45 104,78 74,83 mix:1,0@0.4
      poly frame_l3 120,40 150,43 150,76 120,79 3 e0
      poly frame_l3_in 124,45 146,47 146,72 124,74 mix:1,0@0.5
      poly frame_r1 314,26 280,34 280,92 314,100 14 e0
      poly frame_r1_in 308,34 286,40 286,86 308,92 mix:1,0@0.5
      poly frame_r2 270,36 250,40 250,80 270,86 3 e0
      poly frame_r2_in 266,40 254,43 254,78 266,82 mix:1,0@0.4
      line sea_l1 14,70 46,66 c3
      line sea_l2 76,64 100,62 c3
      line sea_r1 288,70 304,66 c3
      line wave_l 18,60 28,56 38,60 c11
      line wave_l2 80,58 90,54 98,58 c11
      rect bell_a 30,16,8,8 14 e0
      rect bell_b 90,20,6,6 14 e0
      rect bell_c 288,16,8,8 14 e0
      rect bell_d 254,22,5,5 14 e0
      line wire_a 34,24 32,32 c14
      line wire_b 93,26 91,38 c14
      line wire_c 292,24 296,32 c14
      line wire_d 256,27 258,40 c14
      ellipse jet_a 28,106,3,4 14
      ellipse jet_a_glow 28,104,18,14 mix:,14@0.22
      ellipse jet_a_glow2 28,104,9,7 mix:,14@0.4
      ellipse jet_b 86,94,3,4 14
      ellipse jet_b_glow 86,92,13,10 mix:,14@0.22
      ellipse jet_b_glow2 86,92,7,5 mix:,14@0.4
      ellipse jet_c 296,106,3,4 14
      ellipse jet_c_glow 296,104,18,14 mix:,14@0.22
      ellipse jet_c_glow2 296,104,9,7 mix:,14@0.4
      line floor_l1 0,136@1 0,136@0.15 c0
      line floor_l2 100,136@1 100,136@0.15 c0
      line floor_l3 220,136@1 220,136@0.15 c0
      line floor_l4 320,136@1 320,136@0.15 c0
      line floor_c1 0,120 320,120 c0
      line floor_c2 40,106 290,106 c0
      poly stair_a 236,76 276,76 276,96 236,96 1 e0
      poly step_1 230,96 282,96 290,104 222,104 3 e0
      poly step_2 236,88 276,88 280,96 232,96 3 e0
      poly step_3 240,80 272,80 276,88 236,88 1 e0
      line stair_rail 280,104 250,70 c14
      rect rail_post 248,70,3,14 14
      poly rug 90,128 210,128 224,134 76,134 5 e0
      poly door_l 130,48 150,48 150,80 130,80 0 e1
      dots floor_gleam 60,126 140,112 180,124 260,116 c11
      rect plinth 160,86,12,18 3 e0
      ellipse bust 166,82,5,6 11 e0
      rect sconce_l 150,52,6,10 14 e0
      rect sconce_r 232,50,6,10 14 e0
      dots frame_nails 14,28 48,34 76,36 104,42 c14
      line floor_c3 60,98 270,98 c0
      line cornice_l 0,16@1 0,16@0.5 c14
      line cornice_r 320,16@1 320,16@0.5 c14
    `,
    cycles: [{ name: "the jets", areas: ["jet_a", "jet_a_glow", "jet_a_glow2", "jet_b", "jet_b_glow", "jet_b_glow2", "jet_c", "jet_c_glow", "jet_c_glow2"], colors: [14, 6], style: "flicker", ms: [800, 2200] }],
    overlays: []
  },

  // ---- THE OFFICE: a roll-top desk, a green gas bracket, an open ledger ----------------------------------------------------------
  office: {
    version: 1,
    shot: "Eye level, frontal at the desk, north; lamplight; brown panelled walls, one green-shaded gas bracket on the wall over the desk on the right third, its yellow light pooling on the {desk}; the open {ledger} on the desk, white; the {matches} box beside it; wings: a bookcase on the left, a hat-stand; dressing: the {bracket}; moves: the gas (lamplight)",
    draw: `
      rect wall 0,0,320,96 mix:6,0@0.35
      rect wainscot 0,60,320,36 6
      line panel_1 0,60 320,60 c14
      line panel_v1 40,60 40,96 c0
      line panel_v2 100,60 100,96 c0
      line panel_v3 180,60 180,96 c0
      line panel_v4 250,60 250,96 c0
      rect floor 0,96,320,40 mix:6,0@0.4
      line board1 0,108 320,108 c0
      line board2 0,122 320,122 c0
      rect case 6,14,70,82 6 e0
      rect case_in 12,20,58,70 mix:6,0@0.6
      line shelf1 12,38 70,38 c14
      line shelf2 12,56 70,56 c14
      line shelf3 12,74 70,74 c14
      rect book1 14,24,5,14 4 e0
      rect book2 20,26,5,12 2 e0
      rect book3 26,22,6,16 14 e0
      rect book4 34,26,5,12 1 e0
      rect book5 16,42,6,14 14 e0
      rect book6 24,44,5,12 4 e0
      rect book7 32,40,7,16 7 e0
      rect box_a 14,60,22,14 7 e0
      rect box_b 40,62,24,12 6 e0
      rect desk_top 150,92,160,10 6 e0
      rect desk_body 156,102,148,30 6 e0
      line desk_d1 156,112 304,112 c0
      line desk_d2 230,102 230,132 c0
      rect desk_roll 156,56,148,36 mix:6,0@0.5 e0
      line roll_slat1 156,64 304,64 c0
      line roll_slat2 156,72 304,72 c0
      line roll_slat3 156,80 304,80 c0
      rect desk_handle1 190,116,10,3 14
      rect desk_handle2 262,116,10,3 14
      poly ledger 182,86 232,84 236,92 178,94 15 e0
      line ledger_spine 206,85 207,93 c8
      line ledger_l1 186,88 202,87 c8
      line ledger_l2 186,91 202,90 c8
      line ledger_l3 212,87 228,86 c8
      line ledger_l4 212,90 230,89 c8
      line pen 240,86 250,82 c0
      rect inkwell 254,84,8,8 8 e0
      rect bracket_arm 278,36,18,3 14
      poly bracket_shade 270,30 296,30 300,42 266,42 2 e0
      ellipse bracket_flame 284,44,3,4 14
      ellipse bracket_glow 284,50,28,20 mix:,14@0.2
      ellipse bracket_glow2 284,50,14,10 mix:,14@0.35
      poly pool 200,92 310,92 320,104 190,104 mix:6,14@0.4
      poly shadow_desk 156,132 304,132 316,136 150,136 0
      rect stand_pole 112,40,4,76 8 e0
      poly stand_top 100,40 128,40 124,48 104,48 8
      line hat 100,44 128,44 c0
      poly hat_a 102,34 126,34 128,42 100,42 0 e8
      rect chair 120,100,28,6 6 e0
      line chair_leg1 122,106 122,128 c0
      line chair_leg2 146,106 146,128 c0
      ellipse waste 316,124,10,6 7 e0
      rect rug 120,128,120,6 4 e0
      rect fire_screen 90,110,22,20 7 e0
      ellipse office_clock 120,18,9,9 15 e0
      line office_clock_h 120,18 120,12 c0
    `,
    cycles: [{ name: "the gas", areas: ["bracket_flame", "bracket_glow", "bracket_glow2", "pool"], colors: [14, 6], style: "flicker", ms: [900, 2400] }],
    overlays: [{ object: "matches", at: [244, 76] }]
  },

  // ---- THE CASTS: plaster gods under the jets, Gaspard on his chair -------------------------------------------------------------
  west_gallery: {
    version: 1,
    shot: "Seen from the doorway, north-west; deepnight; dark blue walls, pale cyan plaster {casts} on blue pedestals under gas jets, a bentwood chair on the left third with Gaspard seated in it, a dark blue coat with a light edge, a pale face, a black kepi with a yellow band; a brass key on the floor by the chair when it falls; one door ahead in the gallery's blues with a lit pale edge; wings: more {plaster} athletes either side; dressing: pedestals; moves: the jets (lamplight)",
    draw: `
      vp 160,60
      rect wall 0,0,320,136 mix:1,0@0.35
      poly floor 0,136@1 320,136@1 320,136@0.2 0,136@0.2 mix:1,3@0.3
      poly wall_l 0,0@1 0,136@1 0,136@0.2 0,0@0.2 1
      poly wall_r 320,0@1 320,136@1 320,136@0.2 320,0@0.2 1
      poly door 140,44 180,44 180,96 140,96 mix:1,3@0.4 e11
      line door_bar 160,44 160,96 c0
      rect door_knob 172,72,3,3 14
      poly ped_l 14,84 54,84 56,126 12,126 1 e0
      ellipse cast_l_body 34,56,12,26 11 e0
      ellipse cast_l_head 34,28,6,7 11 e0
      line cast_l_arm 24,48 14,70 c3
      line cast_l_arm2 44,48 56,66 c3
      poly ped_r 266,84 306,84 308,126 264,126 1 e0
      ellipse cast_r_body 286,56,12,26 11 e0
      ellipse cast_r_head 286,28,6,7 11 e0
      line cast_r_arm 276,48 266,64 c3
      poly ped_m 104,84 134,84 136,114 102,114 1 e0
      ellipse cast_m_body 119,64,8,18 3 e0
      ellipse cast_m_head 119,44,5,6 3 e0
      poly ped_m2 186,84 216,84 218,114 184,114 1 e0
      ellipse cast_m2_body 201,64,8,18 3 e0
      ellipse cast_m2_head 201,44,5,6 3 e0
      ellipse jet_l 66,34,3,4 14
      ellipse jet_l_glow 66,34,14,10 mix:,14@0.2
      ellipse jet_l_glow2 66,34,7,5 mix:,14@0.35
      ellipse jet_r 254,34,3,4 14
      ellipse jet_r_glow 254,34,14,10 mix:,14@0.2
      ellipse jet_r_glow2 254,34,7,5 mix:,14@0.35
      line bracket_l 66,40 66,52 c1
      line bracket_r 254,40 254,52 c1
      poly chair_seat 66,102 100,102 102,108 64,108 6 e0
      line chair_back 68,72 68,102 c6
      line chair_back2 98,72 98,102 c6
      line chair_back3 68,72 98,72 c6
      line chair_leg1 66,108 64,128 c6
      line chair_leg2 100,108 102,128 c6
      line chair_leg3 80,108 80,128 c6
      rect gaspard_thighs 68,98,36,10 0 e1
      rect gaspard_shin_l 70,108,8,18 0 e1
      rect gaspard_shin_r 90,108,8,18 0 e1
      rect gaspard_boot_l 66,126,14,4 0
      rect gaspard_boot_r 88,126,14,4 0
      poly gaspard_body 66,76 100,76 106,100 62,100 1 e3
      rect gaspard_shade 92,78,10,22 mix:1,0@0.5
      dots gaspard_buttons 82,82 82,88 82,94 c14
      line gaspard_strap 72,78 92,98 c3
      rect gaspard_clock 90,94,10,9 3 e0
      dots gaspard_clock_dot 94,98 c0
      line gaspard_chain 76,96 80,100 c14
      ellipse gaspard_head 82,66,8,9 11 e0
      poly gaspard_kepi 71,58 93,58 95,63 69,63 0 e3
      rect gaspard_band 71,60,22,2 14
      rect gaspard_brim 68,63,28,2 0
      ellipse gaspard_nose 82,68,2,2 3
      rect gaspard_moustache 76,71,12,2 0
      dots gaspard_eyes 78,66 86,66 c0
      ellipse gaspard_hand_l 68,100,4,3 11 e0
      ellipse gaspard_hand_r 98,100,4,3 11 e0
      poly pool_floor 40,136 280,136 240,112 80,112 mix:1,3@0.35
      poly shadow_l 14,126 54,126 78,132 30,132 0
      poly shadow_r 266,126 306,126 296,132 256,132 0
      dots floor_marks 50,124 120,118 200,120 270,126 c3
      line plinth_line 0,100 320,100 c0
      rect fire_bucket 232,100,12,16 1 e3
      rect sign 150,24,20,8 3 e0
      rect tag_l 20,126,28,4 3 e0
      rect tag_r 270,126,28,4 3 e0
      rect tag_m 106,114,24,3 3 e0
      rect tag_m2 188,114,24,3 3 e0
      line lintel_door 138,42 182,42 c3
      dots plaster_dust 100,122 150,126 210,124 c11
    `,
    cycles: [{ name: "the jets", areas: ["jet_l", "jet_l_glow", "jet_l_glow2", "jet_r", "jet_r_glow", "jet_r_glow2"], colors: [14, 6], style: "flicker", ms: [800, 2200] }],
    overlays: [{ object: "lens_key", at: [40, 118] }]
  },

  // ---- THE LANDING: a round window, a heavy door with a brass plate ------------------------------------------------------------------
  landing: {
    version: 1,
    shot: "Eye level, frontal on a half-landing, north; lamplight, brown; the round window with a pale moon on the left third; the heavy {door} with its brass {plate} on the right third; stair rails at the foot; wings: panelled wall and a gas bracket either side; dressing: the plate; moves: the gas (lamplight)",
    draw: `
      rect wall 0,0,320,136 mix:6,0@0.35
      rect panel_l 0,40,320,70 mix:6,0@0.3
      line dado 0,84 320,84 c14
      line dado2 0,110 320,110 c14
      rect floor 0,110,320,26 mix:6,0@0.55
      line board1 0,122 320,122 c0
      ellipse win_frame 100,52,32,32 6 e0
      ellipse win_glass 100,52,26,26 0
      ellipse moon 104,48,8,8 15
      dots win_stars 92,40 112,38 90,56 118,60 96,64 c9
      line win_bar1 74,52 126,52 c6
      line win_bar2 100,26 100,78 c6
      poly door_frame 200,28 284,28 284,112 200,112 6 e0
      poly door 206,34 278,34 278,112 206,112 mix:6,0@0.35 e0
      line door_p1 206,56 278,56 c0
      line door_p2 206,84 278,84 c0
      line door_p3 242,34 242,112 c0
      rect plate 222,58,40,12 14 e0
      line plate_l1 226,62 258,62 c6
      line plate_l2 226,66 252,66 c6
      ellipse knob 270,76,3,3 14
      rect keyhole 268,82,3,6 0
      rect door_hinge1 206,40,4,8 0
      rect door_hinge2 206,98,4,8 0
      rect arch 196,24,92,6 14 e0
      line bracket_a 30,24 30,50 c0
      ellipse flame_a 30,22,4,5 14
      ellipse flame_a_glow 30,24,18,14 mix:,14@0.22
      ellipse flame_a_glow2 30,24,9,7 mix:,14@0.38
      line bracket_b 160,20 160,44 c0
      ellipse flame_b 160,18,4,5 14
      ellipse flame_b_glow 160,20,18,14 mix:,14@0.22
      ellipse flame_b_glow2 160,20,9,7 mix:,14@0.38
      poly stair_rail 0,136 0,118 90,108 90,112 mix:6,14@0.5
      line rail_top 0,116 90,106 c14
      rect post1 0,106,5,30 6 e0
      rect post2 40,106,5,26 6 e0
      rect post3 80,102,5,26 6 e0
      poly step_edge 0,128 112,124 112,136 0,136 15 e0
      poly pool 150,136 230,136 250,116 170,116 mix:6,14@0.4
      poly shadow_door 204,112 284,112 300,124 216,124 0
      rect mat 210,116,60,6 4 e0
      line sconce_wire 30,50 30,74 c0
      rect frame_small 300,44,16,22 14 e0
      rect frame_small_in 303,48,10,14 1
      line skirt 0,106 320,106 c0
      rect frame_b 20,56,18,24 14 e0
      rect frame_b_in 23,59,12,18 4
      rect frame_c 140,56,20,24 14 e0
      rect frame_c_in 143,59,14,18 1
      poly vase 52,96 66,96 64,110 54,110 6 e0
      poly fern 50,80 58,70 66,80 62,96 56,96 0
      dots door_studs 214,40 270,40 214,106 270,106 c14
      line crack 20,90 26,100 c0
      rect rail_cap 0,102,90,3 14
      ellipse moon_glow 104,48,14,14 mix:,15@0.2
      rect window_sill 72,80,56,4 6 e0
      line door_gap 206,112 278,112 c0
      dots dust 160,60 180,70 150,80 c15
      line cobweb 270,30 284,44 c15
    `,
    cycles: [{ name: "the gas", areas: ["flame_a", "flame_a_glow", "flame_a_glow2", "flame_b", "flame_b_glow", "flame_b_glow2"], colors: [14, 6], style: "flicker", ms: [900, 2400] }],
    overlays: []
  },

  // ---- SALLE DU PHARE: the great lens under a dome, the painting on the north wall --------------------------------------------------------------
  lens_room: {
    version: 1,
    shot: "Eye level, north, under a glass dome; deepnight; blue walls going to cyan where the moon lights the glass; the great {lens} on the left third, a beehive of glass rings 60 pixels tall in light cyan and white, its {lamp} cold inside; the {painting} on the north wall on the right third, black rocks and a dark sea with a pale lighthouse, its painted lamp unlit; wings: the {dome} ribs, the iron {ladder}, a brass table; dressing: bell wire from the frame to a bell; moves: the glints on the lens (shimmer)",
    draw: `
      vp 200,60
      rect wall 0,0,320,136 1
      poly floor 0,136@1 320,136@1 320,136@0.2 0,136@0.2 mix:1,3@0.3
      poly wall_l 0,0@1 0,136@1 0,136@0.2 0,0@0.2 mix:1,0@0.25
      poly wall_r 320,0@1 320,136@1 320,136@0.2 320,0@0.2 mix:1,0@0.3
      poly dome 0,0 320,0 280,28 40,28 mix:1,0@0.4
      line rib1 0,0 70,28 c0
      line rib2 106,0 120,28 c0
      line rib3 214,0 200,28 c0
      line rib4 320,0 250,28 c0
      poly skylight_frame 106,0 214,0 200,28 120,28 6 e0
      poly skylight_glass 114,0 206,0 194,22 126,22 mix:1,3@0.25
      line skylight_bar 182,0 182,22 c6
      ellipse moon_dome 160,12,8,8 15
      dots dome_stars 130,6 190,10 150,22 176,22 c11
      rect table 56,98,80,10 14 e0
      rect table_leg1 62,108,6,26 6 e0
      rect table_leg2 124,108,6,26 6 e0
      rect lens_base 66,86,60,12 6 e0
      rect lens_r1 72,74,48,12 11 e0
      rect lens_r2 76,60,40,14 3 e0
      rect lens_r3 80,46,32,14 11 e0
      rect lens_r4 84,34,24,12 3 e0
      rect lens_cap 90,26,12,8 6 e0
      rect lens_core 90,44,12,36 3
      ellipse lens_flame 96,60,3,6 1
      line lens_band1 72,74 120,74 c14
      line lens_band2 76,60 116,60 c14
      line lens_band3 80,46 112,46 c14
      line lens_cage_l 70,34 70,98 c6
      line lens_cage_r 122,34 122,98 c6
      line lens_glint1 78,80 90,80 c15
      line lens_glint2 100,66 112,66 c15
      line lens_glint3 86,52 94,52 c15
      line lens_glint4 98,40 104,40 c15
      line lens_glint5 108,84 118,84 c15
      rect frame_out 188,30,64,56 14 e0
      rect paint_sea 194,36,52,44 1
      rect paint_canvas 194,36,52,44 mix:1,0@0.6
      poly paint_rocks 194,66 246,62 246,80 194,80 0
      poly paint_tower 216,42 226,42 228,66 214,66 7 e0
      rect paint_cap 214,38,14,5 4 e0
      rect paint_lamp 218,40,6,4 8
      poly paint_beam 222,42 246,36 246,60 224,46 mix:1,0@0.6
      line paint_wave1 198,72 210,70 c9
      line paint_wave2 230,74 242,72 c9
      line wire_a 252,34 262,26 262,14 c14
      rect bell 258,10,8,8 14 e0
      rect ladder_l 276,6,3,86 7
      rect ladder_r 296,6,3,86 7
      line rung1 279,20 296,20 c7
      line rung2 279,36 296,36 c7
      line rung3 279,52 296,52 c7
      line rung4 279,68 296,68 c7
      line rung5 279,84 296,84 c7
      poly shadow_lens 60,134 140,134 170,126 80,126 0
      poly shadow_frame 188,100 252,100 270,114 200,114 0
      poly light_floor 160,136 250,136 230,110 180,110 mix:1,3@0.5
      rect plaque 204,92,28,6 14 e0
      rect crate_small 8,106,28,22 6 e0
      line - 8,116 36,116 c0
      line frame_shadow 188,86 252,86 c0
      rect table_lip 54,96,84,3 6
    `,
    cycles: [{ name: "the glints", areas: ["lens_glint1", "lens_glint2", "lens_glint3", "lens_glint4", "lens_glint5"], colors: [15, 11, 3], style: "pingpong", scatter: true, ms: 420 }],
    overlays: []
  },

  // ---- THE ROOF: zinc and chimney pots under a low moon, a drainpipe -----------------------------------------------------------------------------
  roof: {
    version: 1,
    shot: "Wide landscape from a ridge, north; moonlight; a blue night sky with stars, a flat white moon low on the left third; black silhouettes of zinc roofs and chimney pots going away, the river a pale band beyond; the {drainpipe} running down the back wall on the right third, close and black; wings: more {roofs} and pots on both sides; dressing: pots, a pigeon on a ridge; moves: the stars (stars)",
    draw: `
      rect sky 0,0,320,64 fade:1,0/0,0/0,64
      dots stars_still 10,6 40,18 66,8 90,28 120,12 150,6 170,22 196,10 226,26 250,8 276,18 304,12 18,40 52,48 110,44 180,40 240,44 296,36 c15
      dots stars_tint 28,28 70,36 134,30 204,38 262,32 c11
      dots stars_twinkle 22,14 84,22 144,16 212,18 258,22 300,28 c15
      ellipse moon 80,40,9,9 15
      rect river 0,58,320,8 mix:1,9@0.4
      line river_glint1 40,60 60,60 c9
      line river_glint2 180,62 210,62 c9
      line river_glint3 260,59 280,59 c9
      poly far_roofs 0,66 40,56 80,64 140,54 200,62 260,54 320,60 320,80 0,80 0
      poly mid_roofs 0,80 50,66 110,76 170,64 240,78 320,68 320,100 0,100 0
      rect pot_far1 60,48,5,10 0
      rect pot_far2 160,44,5,10 0
      rect pot_far3 250,46,5,10 0
      rect pot_mid1 24,56,8,16 0
      rect pot_mid2 100,62,8,16 0
      rect pot_mid3 196,58,8,18 0
      rect pot_mid4 290,56,8,18 0
      poly near_roof 0,136 0,98 90,92 150,102 190,96 320,90 320,136 mix:1,0@0.4
      line ridge 0,98 90,92 150,102 190,96 320,90 c8
      line zinc1 20,110 70,106 c8
      line zinc2 110,112 160,114 c8
      line zinc3 200,108 260,104 c8
      line zinc4 30,124 90,120 c8
      line zinc5 130,126 190,128 c8
      rect pot_near1 32,76,10,24 0 e8
      rect pot_near1_cap 30,72,14,4 0 e8
      rect pot_near2 130,86,12,22 0 e8
      rect pot_near2_cap 128,82,16,4 0 e8
      poly wall_back 196,0 320,0 320,136 196,136 mix:1,0@0.5 e0
      rect wall_back_hi 196,0,3,136 8
      rect pipe 214,28,7,108 8 e0
      rect pipe_bracket1 210,44,15,4 8 e0
      rect pipe_bracket2 210,80,15,4 8 e0
      rect pipe_bracket3 210,112,15,4 8 e0
      rect pipe_elbow 214,24,26,6 8 e0
      rect pipe_top 238,20,6,10 8 e0
      poly pigeon 150,92 162,86 166,92 154,96 7 e0
      ellipse pigeon_head 164,86,3,3 7 e0
      rect hatch_frame 108,100,26,10 0 e8
      poly shadow_pipe 220,100 240,100 244,120 224,120 0
      line wire 260,30 296,34 310,26 c8
      dots window 270,60 276,60 282,60 c14
      poly dormer 40,100 62,100 66,112 36,112 0 e8
      rect dormer_win 46,104,10,6 14
      poly dormer2 150,112 172,112 176,124 146,124 0 e8
      rect dormer2_win 156,116,10,6 14
      line ridge_tile1 40,94 80,92 c8
      line ridge_tile2 200,98 260,94 c8
      dots smoke_a 36,70 40,64 46,60 c8
      dots smoke_b 136,80 140,74 146,70 c8
      poly skylight 100,122 130,122 134,130 96,130 0 e8
      line skylight_bar 112,122 114,130 c8
      dots stars_far 14,52 60,60 100,56 c11
      line gutter 196,92 320,88 c8
      rect vane 150,52,2,10 0
      line vane_arm 144,54 158,54 c0
      rect pot_far4 20,50,4,8 0
      rect pot_far5 290,48,4,10 0
      rect pot_far6 116,52,5,8 0
    `,
    cycles: [{ name: "the stars", areas: ["stars_twinkle"], colors: [15, 9], style: "pingpong", ms: 2400 }],
    overlays: []
  }
};

// ---- The endings (BRIEF.md §7) ---------------------------------------------------------------------------------------------------
export const endings = {
  // Caught by the bell: the Galerie's front steps from the street, every window lit.
  caught: {
    version: 1,
    shot: "Looking up at the Galerie's front from the street, north; fog; a black front with every window lit yellow in the grey, a red lamp at the door; a gendarme's lantern at the foot of the steps on the left third; one long shadow up the door; moves: nothing",
    draw: `
      rect sky 0,0,320,136 mix:8,7@0.5
      rect fog_low 0,90,320,46 mix:7,15@0.35
      poly front 40,20 280,20 280,104 40,104 0 e8
      rect cornice 34,14,252,8 8 e7
      rect win1 56,34,28,22 14 e0
      rect win2 100,34,28,22 14 e0
      rect win3 192,34,28,22 14 e0
      rect win4 236,34,28,22 14 e0
      rect win5 56,66,28,22 14 e0
      rect win6 100,66,28,22 14 e0
      rect win7 192,66,28,22 14 e0
      rect win8 236,66,28,22 14 e0
      line bar1 70,34 70,56 c0
      line bar2 114,34 114,56 c0
      line bar3 206,34 206,56 c0
      line bar4 250,34 250,56 c0
      line bar5 70,66 70,88 c0
      line bar6 114,66 114,88 c0
      line bar7 206,66 206,88 c0
      line bar8 250,66 250,88 c0
      rect door 144,60,32,44 4 e0
      line door_bar 160,60 160,104 c0
      rect lamp_red 180,52,8,8 12 e0
      poly steps 120,104 200,104 216,136 104,136 7 e0
      line step1 112,114 208,114 c8
      line step2 108,125 212,125 c8
      poly shadow 150,104 170,104 180,136 130,136 0
      rect lantern 60,100,10,14 12 e0
      rect lantern_pane 63,103,4,8 14
      line lantern_h 61,100 69,100 c8
      ellipse lantern_glow 65,108,18,12 mix:,12@0.3
      ellipse figure_head 85,92,4,4 8 e0
      rect figure_body 79,96,12,26 8 e0
      line figure_leg1 82,122 80,134 c0
      line figure_leg2 88,122 90,134 c0
      poly pave 0,120 320,120 320,136 0,136 mix:8,0@0.5
      dots rain 20,30 280,40 300,70 10,70 30,110 c15
      line sill1 54,57 86,57 c7
      line sill2 98,57 130,57 c7
      line sill3 190,57 222,57 c7
      line sill4 234,57 266,57 c7
      line sill5 54,89 86,89 c7
      line sill6 98,89 130,89 c7
      line sill7 190,89 222,89 c7
      line sill8 234,89 266,89 c7
      line rail_l 104,104 100,136 c7
      line rail_r 216,104 220,136 c7
      line cobble1 0,126 100,124 c7
      line cobble2 220,126 320,124 c7
      line cobble3 0,132 90,134 c8
      line cobble4 230,132 320,134 c8
      rect post 300,50,3,70 8 e0
      ellipse post_lamp 301,48,5,6 12
      ellipse post_glow 301,48,16,12 mix:,12@0.25
      ellipse fig2_head 250,100,3,3 8 e0
      rect fig2_body 246,103,9,20 8 e0
      line fig2_leg 248,123 246,134 c0
      line fig2_leg2 253,123 255,134 c0
      rect pil_l 134,56,6,48 7 e0
      rect pil_r 180,56,6,48 7 e0
      rect pediment 130,50,60,6 7 e0
    `,
    cycles: [],
    overlays: []
  },

  // Carried: far away at dawn, a thin figure on the ridge with a roll under one arm, the dome burning behind.
  carried: {
    version: 1,
    shot: "Far away, from over the roofs, north; dusk; a magenta sky going to light red at the horizon, a yellow sun disc just rising on the right; black roofs and chimney pots in rows; a thin black figure on a ridge on the left third with a roll under one arm; the dome far off on the right third, its lens burning white; moves: the stars (stars)",
    draw: `
      rect sky 0,0,320,70 5
      rect sky_low 0,50,320,26 12
      dots stars_still 12,8 44,18 76,6 110,22 150,10 190,6 230,20 270,8 304,18 c15
      dots stars_twinkle 30,26 94,14 170,26 250,28 290,12 c13
      ellipse sun 262,62,10,10 14
      poly far_roofs 0,76 50,62 100,72 160,58 220,70 280,60 320,68 320,90 0,90 0
      poly roofs_a 0,90 40,76 100,86 170,74 240,86 320,76 320,110 0,110 0
      rect pot_a 30,64,6,14 0
      rect pot_b 120,70,6,16 0
      rect pot_c 200,62,6,16 0
      poly roofs_b 0,136 0,106 70,98 150,108 230,100 320,106 320,136 0
      line ridge_hi 0,106 70,98 150,108 230,100 320,106 c8
      rect pot_d 46,86,10,20 0
      rect pot_e 260,84,10,22 0
      rect dome_base 232,56,26,10 0
      poly dome 234,56 256,56 252,46 238,46 0
      ellipse lens_burn 245,52,6,6 15
      ellipse lens_glow 245,52,16,12 mix:,13@0.3
      line river 0,92 90,92 c9
      line river2 150,98 230,96 c9
      dots smoke 150,40 156,32 162,26 c8
      poly spire 120,62 124,32 128,62 0
      rect spire_base 116,62,16,12 0
      rect pot_f 14,92,6,14 0
      rect pot_g 72,88,6,14 0
      rect pot_h 140,92,6,16 0
      rect pot_i 180,86,6,14 0
      rect pot_j 290,90,6,14 0
      rect pot_k 306,98,6,12 0
      rect win_a 20,116,6,5 14
      rect win_b 80,112,6,5 14
      rect win_c 160,118,6,5 14
      rect win_d 240,112,6,5 14
      rect win_e 290,118,6,5 14
      line tile_a 10,112 60,108 c8
      line tile_b 90,104 140,110 c8
      line tile_c 170,110 220,106 c8
      line tile_d 240,104 290,108 c8
      line tile_e 30,126 100,124 c8
      line dome_rib1 240,56 242,46 c8
      line dome_rib2 250,56 248,46 c8
      rect dome_lantern 242,42,6,5 15
      dots bird1 170,30 174,28 178,30 c0
      dots bird2 190,38 194,36 198,38 c0
      poly cloud1 40,40 90,38 120,44 80,48 13
      poly cloud2 210,36 260,34 300,40 250,44 13
      poly bridge 150,90 230,90 230,96 150,96 0
      line bridge_arch 160,96 170,90 180,96 c8
      dots roof_glints 60,100 140,104 210,96 c8
      ellipse sun_glow 262,62,22,14 mix:,14@0.25
      rect figure_legs_l 86,100,5,12 8 e7
      rect figure_legs_r 94,100,5,12 8 e7
      poly figure_body 82,64 100,64 104,100 78,100 15 e0
      rect figure_scarf 85,62,12,3 12 e0
      ellipse figure_head 91,57,5,5 12 e0
      poly figure_hat 85,51 98,51 100,55 83,55 0
      line figure_arm 98,72 108,80 c0
      poly roll_canvas 100,66 118,56 121,60 103,71 14 e0
      line roll_edge 101,70 119,60 c6
      line bridge_arch2 190,96 200,90 210,96 c8
    `,
    cycles: [{ name: "the stars", areas: ["stars_twinkle"], colors: [13, 5], style: "pingpong", ms: 2400 }],
    overlays: []
  },

  // Keeper: close up, the lit lens, a beam across a black sky over the roofs.
  keeper: {
    version: 1,
    shot: "Close up, north; deepnight; the lit lens filling the left two thirds, rings of white and yellow glass in a brass cage, a wide pale beam fanning out to the right over black roofs; a black sky with a few stars; moves: the stars (stars)",
    draw: `
      rect sky 0,0,320,136 0
      dots stars_still 200,10 230,26 260,12 290,30 310,8 250,40 c15
      dots stars_twinkle 214,20 270,22 300,18 c11
      poly beam 150,50 320,0 320,100 150,76 mix:1,3@0.5
      poly beam_core 150,56 320,26 320,76 150,70 mix:3,15@0.35
      poly roofs 190,136 190,112 230,104 270,110 320,100 320,136 0
      rect pot_a 238,92,6,12 0
      rect pot_b 292,88,6,12 0
      rect base 20,112,120,24 6 e0
      rect ring1 30,92,100,20 14 e0
      rect ring2 36,72,88,20 15 e0
      rect ring3 42,52,76,20 14 e0
      rect ring4 48,34,64,18 15 e0
      rect ring5 54,18,52,16 14 e0
      rect cap 60,6,40,12 6 e0
      rect flame 66,50,28,46 15
      ellipse flame_hot 80,74,10,18 14
      line band1 30,92 130,92 c6
      line band2 36,72 124,72 c6
      line band3 42,52 118,52 c6
      line band4 48,34 112,34 c6
      line cage_l 28,10 28,112 c6
      line cage_r 132,10 132,112 c6
      line glint1 40,84 60,84 c11
      line glint2 100,64 118,64 c11
      line glint3 52,44 70,44 c11
      line glint4 90,26 104,26 c11
      ellipse glow 80,64,70,60 mix:,14@0.12
      dots stars_far 160,16 180,30 220,48 280,6 c8
      line beam_edge1 154,52 320,2 c11
      line beam_edge2 154,74 320,98 c11
      rect rw1 200,116,4,5 14
      rect rw2 226,112,4,5 14
      rect rw3 250,120,4,5 14
      rect rw4 276,114,4,5 14
      rect rw5 298,118,4,5 14
      rect rw6 312,108,4,5 14
      rect pot_c 210,100,5,10 0
      rect pot_d 262,98,5,12 0
      rect pot_e 306,94,5,10 0
      rect pot_f 226,94,4,10 0
      dots cage_bolts 28,20 28,60 28,100 132,20 132,60 132,100 c7
      line hi1 34,94 120,94 c15
      line hi2 40,74 118,74 c15
      line hi3 46,54 114,54 c15
      line hi4 52,36 108,36 c15
      line hi5 58,20 102,20 c15
      line prism1 50,92 50,112 c6
      line prism2 64,92 64,112 c6
      line prism3 96,92 96,112 c6
      line prism4 110,92 110,112 c6
      line prism5 56,72 56,92 c6
      line prism6 104,72 104,92 c6
      rect base_trim 20,112,120,3 14
      line base_bolt1 30,124 40,124 c14
      line base_bolt2 100,124 110,124 c14
      dots smoke 250,86 254,80 c8
      dots smoke2 300,80 304,74 c8
      line tile1 200,122 250,120 c8
      line tile2 270,128 318,126 c8
    `,
    cycles: [{ name: "the stars", areas: ["stars_twinkle"], colors: [11, 9], style: "pingpong", ms: 2400 }],
    overlays: []
  }
};
