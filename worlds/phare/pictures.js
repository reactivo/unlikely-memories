// Pictures for "A Light for the Galerie Aubry" (worlds/phare/world.en.js), one per room and one per ending, written by hand in the
// short notation (BRIEF.md §7): 320 x 136, EGA colours 0-15, shapes back to front, ids on what the story may change or a cycle animates.
// Style: dithered. Every picture's `shot` names its palette, its gradients with their causes, its subject and its dressing.

export default {
  cart: {
    version: 1,
    shot: "Eye level inside the laced van, facing north; vp on the hatch's third (213,50). Palette lamplight. One light: the lantern hung over the hatch. Gradient 1: the tarpaulin wall falls into the dark from the lantern's side, plain brown at right to a dense black dither at the far left, because the lantern's light dies out across the canvas; the floor is flat brown with a half-black shade checked in on the lantern-less side. Gradient 2: the tarpaulin roof, black dither at the top running into brown, because the lantern cannot reach the roof. Subject: the hatch in the floor with its iron ring, columns 176-250 (right third), under the lantern; the horn's nail and tube on the left third (the horn overlay hangs at 96,40). Left wing: stacked {crates} with label and nails, a coil of rope; right wing: more {crates}, a pail and a broom against them. Dressing: {straw} on the floor, the {tarpaulin} with its ribs and laces, the {lantern} with a soft halo, a {hatch} ring. moves: the lantern's glow and its pool (flicker).",
    draw: `vp 213,50
rect ceil 0,0,320,28 fade:0,6/0,-7/0,28
rect tarp 0,28,320,64 fade:6,0/250,60/-80,60
rect rib1 111,28,3,64 0
rect rib2 168,28,3,64 0
rect rib3 262,28,3,64 0
line tarp_fold_l 124,30 138,60 128,90 c0
line tarp_fold_r 196,30 190,64 200,92 c0
line seam 240,28 242,92 c0
dots laces 238,36 242,38 238,46 242,48 238,56 242,58 238,66 242,68 238,76 242,78 c14
rect floor 0,92,320,44 6
rect floor_shade 0,92,160,44 mix:6,0@0.5
rect floor_dark 0,118,70,18 mix:6,0@0.5
line plank1 20,136@1 20,136@0.49 c0
line plank2 80,136@1 80,136@0.49 c0
line plank3 140,136@1 140,136@0.49 c0
line plank4 290,136@1 290,136@0.49 c0
line plank5 350,136@1 350,136@0.49 c0
line plank6 -30,136@1 -30,136@0.49 c0
ellipse lant_pool 213,112,62,18 mix:,14@0.2
poly hatch_frame 172,136@0.9 254,136@0.9 254,136@0.55 172,136@0.55 0
poly hatch 176,136@0.86 250,136@0.86 250,136@0.58 176,136@0.58 mix:6,14@0.4 e0
line hatch_plank1 196,102 230,102 c6
line hatch_plank2 190,112 238,112 c6
ellipse hatch_ring 213,114,5,2 14
dots hatch_nails 192,101 234,101 186,122 242,122 c14
dots nail 104,41 c14
line horn_tube 104,56 100,72 98,92 c6
line horn_tube2 105,56 101,72 99,92 c0
rect crate_l1 0,64,46,36 mix:6,0@0.5 e0
line crate_l1_planks 0,76 46,76 c0
line crate_l1_planks2 0,88 46,88 c0
rect crate_l2 4,32,38,32 mix:6,0@0.5 e0
line crate_l2_planks 4,44 42,44 c0
line crate_l2_planks2 4,54 42,54 c0
rect crate_l_label 14,70,16,9 6 e0
line crate_l_stencil 16,74 28,74 c0
dots crate_l_nails 2,66 44,66 2,98 44,98 6,34 40,34 c14
ellipse rope 62,112,12,5 6 e0
line rope_in 54,112 70,112 c0
line rope_tail 72,114 82,118 c0
rect crate_r1 272,60,48,40 6 e0
line crate_r1_planks 272,72 320,72 c0
line crate_r1_planks2 272,86 320,86 c0
rect crate_r2 280,28,40,32 6 e0
line crate_r2_planks 280,40 320,40 c0
line crate_r2_planks2 280,50 320,50 c0
rect crate_r_label 288,66,18,9 14 e0
line crate_r_stencil 291,70 303,70 c0
dots crate_r_nails 274,62 318,62 274,98 318,98 282,30 316,30 c14
rect crate_r_lit 272,60,4,40 14
rect shadow_l 0,100,52,4 0
rect shadow_r 272,100,48,4 0
rect pail 290,102,16,16 6 e0
line pail_rim 290,103 306,103 c14
line pail_band 290,110 306,110 c0
line broom 282,64 274,112 c0
poly broom_head 270,110 280,112 284,122 266,120 14 e0
line straw_a 150,120 160,118 c14
line straw_b 172,128 184,126 c14
line straw_c 100,124 112,122 c14
line straw_d 240,126 252,128 c14
ellipse lant_glow 213,33,30,21 mix:,14@0.12
ellipse lant_glow2 213,33,17,12 mix:,14@0.25
line chain 213,0 213,24 c0
rect lant_cap 207,24,12,3 0
rect lant_body 208,27,10,13 0
rect lant_pane 210,29,6,9 14
rect lant_foot 209,40,8,2 0`,
    cycles: [{"name":"the lantern's glow","areas":["lant_glow","lant_glow2","lant_pane","lant_pool"],"colors":[14,6],"style":"flicker","ms":[700,2200]}],
    overlays: [{"object":"horn","at":[96,40]}]
  },
  cellar: {
    version: 1,
    shot: "Eye level, one-point, facing north down a short brick vault to a stair; vp (213,66) on the stair's third. Palette cellar. One light: the oil lamp hung on the left wall at x 64; a small second light: the stairwell's glow at the far end. Gradient 1: both side walls, brown (left, near the lamp) and dark grey (right, farther from it), running with the depth from near to far into a dense black dither at the far corners, because the lamp's reach dies out along the vault (one cause on two walls); the floor is flat cold stone with the lamp's yellow pool and a shaded far end. Gradient 2: the stairwell opening, yellow at the top to brown at the bottom, because the light of the floor above falls down the steps. Subject: the lit stair in the end wall, columns 190-236 (right third); the watchman's chalk {tally} on the wall at the left third (columns 94-124). Left wing: stacked packing {cases} stencilled for Calais under the lamp; right wing: more {cases}, a puddle on the floor. Dressing: brick courses running with the depth, a drip from the vault, a {stair} rail. moves: the lamp (flicker).",
    draw: `vp 213,66
poly vault 0,0@1 320,0@1 320,0@0.38 0,0@0.38 mix:1,0@0.5
poly end_wall 0,0@0.38 320,0@0.38 320,136@0.38 0,136@0.38 mix:8,1@0.5
poly wall_l 0,0@1 0,136@1 0,136@0.38 0,0@0.38 fade:6,0/10,66/165,66
poly wall_r 320,0@1 320,136@1 320,136@0.38 320,0@0.38 fade:8,0/315,66/238,66
poly floor 0,136@1 320,136@1 320,136@0.38 0,136@0.38 mix:8,1@0.5
line brick_l1 0,20@1 0,20@0.38 c0
line brick_l2 0,50@1 0,50@0.38 c0
line brick_l3 0,90@1 0,90@0.38 c0
line brick_l4 0,120@1 0,120@0.38 c0
line brick_r1 320,20@1 320,20@0.38 c0
line brick_r2 320,50@1 320,50@0.38 c0
line brick_r3 320,90@1 320,90@0.38 c0
line brick_r4 320,120@1 320,120@0.38 c0
dots brick_joints 24,30 52,30 38,62 70,62 90,70 18,106 46,106 296,30 280,62 300,100 c0
line arch_w 140,0@1 140,0@0.5 c8
line arch_e 290,0@1 290,0@0.5 c8
rect stair_door 196,50,34,42 fade:14,6/213,50/213,92
rect arch_w_post 188,46,8,46 8
rect arch_e_post 230,46,8,46 8
rect arch_lintel 188,42,50,6 8 e0
rect step1 196,84,34,8 6 e0
rect step2 199,77,32,7 6 e0
rect step3 202,70,26,7 6 e0
rect step4 204,64,22,6 6 e0
rect step5 206,58,18,6 6 e0
line stair_rail 236,52 236,92 c6
ellipse floor_spill 213,100,24,5 mix:,14@0.25
rect tally_wall 94,56,30,24 mix:1,0@0.5 e0
line tally1 98,60 98,66 c15
line tally2 101,60 101,66 c15
line tally3 104,60 104,66 c15
line tally4 107,60 107,66 c15
line tally5 96,64 109,62 c15
line tally6 98,72 98,78 c15
line tally7 101,72 101,78 c15
line tally8 104,72 104,78 c15
ellipse lamp_pool 64,120,48,12 mix:,14@0.2
rect case_l1 4,76,40,34 6 e0
line case_l1_planks 4,88 44,88 c0
line case_l1_planks2 4,100 44,100 c0
rect case_stencil 12,92,20,6 0
rect case_l2 8,46,32,30 6 e0
line case_l2_planks 8,58 40,58 c0
rect case_stencil2 14,62,16,5 0
dots case_l_nails 6,78 42,78 6,108 42,108 10,48 38,48 c14
rect case_l_lit 4,76,3,34 14
rect case_r1 262,68,48,42 6 e0
line case_r1_planks 262,82 310,82 c0
line case_r1_planks2 262,96 310,96 c0
rect case_r2 272,42,36,26 6 e0
line case_r2_planks 272,54 308,54 c0
dots case_r_nails 264,70 308,70 264,108 308,108 274,44 306,44 c14
rect shadow_case 262,108,48,4 0
rect shadow_case_l 0,108,48,4 0
ellipse puddle 160,118,26,5 1 e0
line puddle_glint 152,117 164,117 c14
line drip 160,92 160,102 c1
line lamp_hook 64,0 64,34 c0
line lamp_bracket 64,34 76,38 c0
ellipse lamp_glow 64,46,26,20 mix:,14@0.12
ellipse lamp_glow2 64,46,14,11 mix:,14@0.25
rect lamp_cap 60,36,9,3 0
rect lamp_body 60,39,9,12 0
rect lamp_pane 62,41,5,8 14
rect lamp_foot 60,51,9,2 0`,
    cycles: [{"name":"the lamp","areas":["lamp_glow","lamp_glow2","lamp_pane"],"colors":[14,6],"style":"flicker","ms":[700,2200]}],
    overlays: []
  },
  packing_room: {
    version: 1,
    shot: "Three-quarter view from a corner of the cellar room, facing north: a back wall at the left and a side wall angled in at the right (vp 120,62). Palette lamplight. One light: a lamp hung over the bench at x 190. Gradient 1: the back wall, plain brown at the lamp's side to a dense black dither at the far left, because the lamp's reach dies out across the wall; the floor is flat brown planks with the lamp's yellow pool on it and the left corner checked into shade; the side wall and the ceiling are a half-black shade check, turned from the light. Subject: the nearest bare gilt {frame}, large, with its paper {label}, on the left third (columns 80-140); the scarred {bench} with its {crowbars} and tools on the right third (columns 170-262). Left wing: two more bare {frames} leaning, a drift of {wood-wool}; right wing: a shelf, a roll of paper behind a small crate. Dressing: on the bench a box of nails and a ball of twine; a hammer and a saw on nails; wood-wool strands on the floor. moves: the lamp's glow and the bench's pool (flicker).",
    draw: `vp 120,62
poly ceil 0,0 320,0 320,0@0.65 0,22 mix:6,0@0.5
line beam1 100,0 120,18 c0
line beam2 230,0 238,20 c0
rect wall 0,22,250,88 fade:6,0/200,60/-62,60
poly wall_r 320,0@1 320,136@1 320,136@0.65 320,0@0.65 mix:6,0@0.5
line wall_edge 250,22 250,110 c0
line wall_base 0,110 250,110 c0
poly floor 0,136 320,136 320,136@0.65 0,110 6
poly floor_dark 0,136 90,136 90,136@0.65 0,110 mix:6,0@0.5
line plank1 30,136@1 30,136@0.65 c0
line plank2 90,136@1 90,136@0.65 c0
line plank3 150,136@1 150,136@0.65 c0
line plank4 210,136@1 210,136@0.65 c0
line plank5 270,136@1 270,136@0.65 c0
line plank6 330,136@1 330,136@0.65 c0
ellipse bench_lit 214,116,60,10 mix:,14@0.2
rect frame2 22,44,36,50 14 e0
rect frame2_in 27,49,26,40 mix:6,0@0.5
rect frame3 54,52,30,42 14 e0
rect frame3_in 59,57,20,32 mix:6,0@0.5
rect frame_big 84,34,56,64 14 e0
rect frame_in 91,41,42,50 mix:6,0@0.5
line frame_gild 86,36 138,36 c6
line frame_gild2 86,96 138,96 c6
poly paper_wrap 94,88 128,84 132,92 96,94 6 e0
rect label 100,76,15,10 15 e0
dots tacks 102,78 112,78 c4
line label_lines 103,81 112,81 c0
rect shadow_frame 84,98,56,3 0
rect shadow_frame2 22,94,40,3 0
poly wool1 150,118 170,112 190,116 196,124 160,128 mix:6,14@0.5
poly wool2 24,114 44,110 60,116 50,124 28,122 mix:6,14@0.5
poly wool3 100,120 118,116 130,122 114,128 mix:6,14@0.5
line wool_strand1 164,112 160,106 c14
line wool_strand2 38,110 42,104 c14
line wool_strand3 112,116 116,110 c14
line lamp_cord 190,0 190,26 c0
ellipse lamp_glow 190,34,29,20 mix:,14@0.12
ellipse lamp_glow2 190,34,16,11 mix:,14@0.25
rect lamp_pane 185,28,11,11 14 e0
rect bench_top 172,80,92,7 14 e0
rect bench_body 174,87,88,10 6 e0
rect bench_leg1 178,97,5,26 6 e0
rect bench_leg2 252,97,5,26 6 e0
rect shadow_bench 176,123,86,3 0
line crowbar1 188,80 200,52 c0
line crowbar1_hook 200,52 196,50 c0
line crowbar2 196,80 210,56 c0
line crowbar2_hook 210,56 206,54 c0
line crowbar3 204,80 220,60 c0
rect hammer_head 238,46,11,5 0
line hammer_shaft 243,51 243,70 c0
dots nail 243,45 c14
poly saw 154,46 186,48 186,53 154,56 14 e0
dots saw_teeth 156,56 160,57 164,56 168,57 172,56 176,57 180,56 c0
rect nail_box 224,72,12,8 6 e0
line twine_in 228,72 232,72 c0
ellipse twine 252,76,6,4 14 e0
rect paper_roll 286,96,10,22 15 e0
rect crate_small 280,100,36,22 6 e0
line shelf 270,64 320,58 c0
rect shelf_lit 270,60,50,3 14`,
    cycles: [{"name":"the lamp","areas":["lamp_glow","lamp_glow2","lamp_pane","bench_lit"],"colors":[14,6],"style":"flicker","ms":[700,2200]}],
    overlays: []
  },
  boiler: {
    version: 1,
    shot: "Eye level, facing north at the squat iron {boiler}, a black silhouette against the red firelit wall behind it; no vanishing point, a frontal view. Palette ember. One light: the fire through the boiler's open fire door. Gradient 1: the brick wall, red at its foot to a dense black dither at the top, because the fire at floor level lights the wall from below and the light dies upward. Gradient 2: the floor, light red at the boiler's foot to a dense black dither at the near edge, because the firelight lies on the floor and dies out toward you (one cause on two surfaces, the wall and the floor). Subject: the boiler with its glowing fire door, bands and dome, columns 56-156 (left third). Left wing: the {coal chute} climbing into the dark behind its chained {shutter}, a heap of {coal} and a shovel; right wing: the {shelf} of {tins} on two posts (the oil can overlay stands on the upper shelf at 296,52). Dressing: pipes with a bend and a valve from the dome, a gauge on the boiler face, a bucket and a poker, an ash pan, rivets. moves: the fire's glow, its halo and the lit floor (flicker).",
    draw: `rect wall 0,0,320,112 fade:4,0/0,112/0,-28
rect floor_glow 0,112,320,24 fade:12,0/0,112/0,142
line brick1 0,96 320,96 c0
line brick2 0,80 320,80 c0
line brick3 0,64 320,64 c0
line brick4 0,48 320,48 c0
dots brick_joints 30,90 58,90 200,90 240,90 190,72 226,72 270,56 14,72 c0
poly chute 0,28 44,0 44,64 0,104 0
poly chute_l 0,28 44,0 44,3 0,32 4
poly chute_r 0,100 44,62 44,64 0,104 4
rect chute_gap 20,24,10,10 1
rect shutter 2,40,22,26 mix:4,0@0.5 e4
line chain 2,50 24,56 c7
line chain_drop 24,56 24,66 c7
poly coal1 4,114 20,102 40,106 52,116 40,124 8,122 0 e4
poly coal2 44,118 62,108 78,114 70,124 52,124 0 e4
dots coal_shine 14,108 24,106 30,110 48,114 62,112 c12
line shovel 54,70 40,112 c4
poly shovel_head 32,108 46,106 48,118 30,118 7 e0
rect boiler 56,38,100,74 0 e4
ellipse boiler_dome 106,38,36,9 0 e4
rect boiler_band1 56,52,100,4 mix:4,0@0.5
rect boiler_band2 56,96,100,4 mix:4,0@0.5
dots rivets 62,54 74,54 86,54 98,54 130,54 142,54 150,54 62,98 76,98 90,98 134,98 148,98 c7
ellipse glow_out 106,92,40,26 mix:,12@0.1
ellipse glow_out2 106,92,26,17 mix:,12@0.2
rect fire_door 84,76,44,32 0 e12
rect fire_glow 88,80,36,24 12
rect fire_core 94,86,24,14 12
rect fire_hot 100,90,12,7 14
line fire_bar1 94,80 94,104 c0
line fire_bar2 118,80 118,104 c0
rect ash_pan 88,108,36,5 0 e12
poly ash 92,112 120,112 118,116 94,116 mix:4,0@0.5
ellipse gauge 138,60,7,7 7 e0
line gauge_hand 138,60 141,57 c0
ellipse pipe_bend 150,28,8,6 4 e0
rect pipe1 100,16,6,22 4 e0
rect pipe2 100,10,62,6 4 e0
rect pipe_bend_down 158,10,6,28 4 e0
ellipse pipe_valve 160,50,6,6 7 e0
line pipe_drip 161,56 161,66 c12
line pipe_hang 70,38 70,20 c4
rect lamp_hook 70,16,6,4 4
rect shadow_boiler 52,112,108,4 0
line poker 168,62 178,110 c7
dots poker_h 167,61 169,61 c7
ellipse bucket 192,104,9,6 7 e0
rect bucket_body 184,100,16,14 7 e0
line bucket_h 184,100 192,92 200,100 c7
line bucket_band 184,106 200,106 c0
rect shelf 250,70,70,3 4 e0
rect shelf2 250,98,70,3 4 e0
rect shelf_post1 252,70,3,38 0
rect shelf_post2 316,70,3,38 0
rect tin1 258,54,10,16 7 e0
rect tin2 270,58,10,12 7 e0
rect tin3 282,52,10,18 7 e0
rect tin_label 260,60,6,6 4
rect tin7 314,58,6,12 7 e0
rect tin4 262,82,12,16 7 e0
rect tin5 278,86,10,12 7 e0
rect tin6 292,80,14,18 7 e0
rect tin_cap1 262,80,12,2 0
rect tin_cap2 292,78,14,2 0
rect tin8 306,88,8,10 7 e0
rect shadow_tins 250,108,70,3 0`,
    cycles: [{"name":"the fire","areas":["fire_glow","fire_core","glow_out","glow_out2","floor_glow"],"colors":[12,4],"style":"flicker","ms":[500,1600]}],
    overlays: [{"object":"oilcan","at":[296,52]}]
  },
  vestibule: {
    version: 1,
    shot: "One-point view, eye level, facing north down the marble vestibule to the hall doors; vp (107,62) on the {book} stand's third. Palette lamplight. Light: two gas globes on the side walls, the right one the main light, the left a small one. Gradient 1: the side walls and the floor, brown near to a dense black dither at the far end, because the vestibule recedes away from the globes into the dark of the hall (one cause on three surfaces; the black doorway lies beyond it); the ceiling is a half-black shade check. Subject: the visitors' book open on its stand, white pages, columns 94-122 (left third), in front of the far doors. The cloakroom doorway on the right wall to the east, columns 228-252. Left wing: an umbrella stand and a plaque on the wall; right wing: the right globe on its bracket with a halo, a bust on a plinth. Dressing: marble tile lines running to the vanishing point, a red mat, a clock over the cloakroom door, picture rails, pilasters. moves: the globes and their halos (flicker).",
    draw: `vp 107,62
poly ceiling 0,0@1 320,0@1 320,0@0.35 0,0@0.35 mix:6,0@0.5
poly wall_l 0,0@1 0,136@1 0,136@0.35 0,0@0.35 fade:6,0/0,60/87,60
poly wall_r 320,0@1 320,136@1 320,136@0.35 320,0@0.35 fade:6,0/320,60/147,60
poly floor 0,136@1 320,136@1 320,136@0.35 0,136@0.35 fade:6,0/0,136/0,76
poly wall 0,0@0.35 320,0@0.35 320,136@0.35 0,136@0.35 mix:6,0@0.8
rect door_far 94,52,26,36 0 e6
rect door_far_glow 98,58,18,30 mix:6,14@0.35
line door_far_bar 107,58 107,88 c0
line door_far_lintel 92,51 122,51 c6
line tile1 40,136@1 40,136@0.35 c0
line tile2 110,136@1 110,136@0.35 c0
line tile3 180,136@1 180,136@0.35 c0
line tile4 250,136@1 250,136@0.35 c0
line tile5 -30,136@1 -30,136@0.35 c0
line tile_cross1 0,136@0.9 320,136@0.9 c0
line tile_cross2 0,136@0.75 320,136@0.75 c0
line tile_cross3 0,136@0.6 320,136@0.6 c0
line tile_cross4 0,136@0.48 320,136@0.48 c0
line picture_rail_l 0,22@1 0,22@0.35 c6
line picture_rail_r 320,22@1 320,22@0.35 c6
poly pilaster_l 0,10@0.8 0,10@0.7 0,120@0.7 0,120@0.8 6 e0
poly pilaster_l_cap 0,8@0.82 0,8@0.68 0,14@0.68 0,14@0.82 14
poly pilaster_l_base 0,118@0.82 0,118@0.68 0,124@0.68 0,124@0.82 14
poly pilaster_r 320,10@0.72 320,10@0.62 320,120@0.62 320,120@0.72 6 e0
poly pilaster_r_cap 320,8@0.74 320,8@0.6 320,14@0.6 320,14@0.74 14
poly pilaster_r_base 320,118@0.74 320,118@0.6 320,124@0.6 320,124@0.74 14
poly cloak_door 320,40@0.67 320,40@0.58 320,118@0.58 320,118@0.67 mix:6,0@0.8 e6
line cloak_lintel 320,38@0.68 320,38@0.57 c14
ellipse clock 240,34,6,6 15 e0
line clock_h 240,34 240,30 c0
line clock_h2 240,34 243,35 c0
rect umb_stand 8,96,14,26 6 e0
line umb1 12,96 16,80 c0
line umb2 18,96 22,84 c0
rect plaque_l 28,56,12,16 14 e0
rect plaque_r 278,60,12,16 14 e0
rect bust_plinth 292,88,18,34 6 e0
ellipse bust_head 301,78,8,10 15 e0
rect bust_neck 297,86,8,4 15
rect mat 62,124,92,8 4 e0
dots tile_marks 40,112 80,100 150,108 200,120 230,116 270,126 c0
rect stand_top 94,80,28,4 6 e0
rect stand_leg 106,84,4,32 6 e0
ellipse stand_foot 108,118,13,3 6 e0
poly book 96,74 118,72 122,80 100,82 15 e0
line book_spine 108,73 110,81 c4
line book_line1 99,76 106,76 c0
line book_line2 112,76 119,76 c0
line pen 118,78 122,70 c14
rect shadow_stand 92,121,34,3 0
line globe_l_post 20,40 34,44 c0
ellipse globe_l_glow 30,44,20,14 mix:,14@0.12
ellipse globe_l_glow2 30,44,11,8 mix:,14@0.25
ellipse globe_l 31,44,4,4 14
line globe_r_post 320,34 296,40 c0
ellipse globe_r_glow 286,40,28,20 mix:,14@0.12
ellipse globe_r_glow2 286,40,16,11 mix:,14@0.25
ellipse globe_r 288,40,5,5 14
rect pool_l 24,52,14,3 mix:6,14@0.4
rect pool_r 278,48,18,3 mix:6,14@0.4
rect shadow_bust 292,122,18,3 0
rect step_r 276,124,44,12 mix:6,0@0.5
line step_edge 276,124 320,124 c14`,
    cycles: [{"name":"the globes","areas":["globe_l","globe_l_glow","globe_l_glow2","globe_r","globe_r_glow","globe_r_glow2"],"colors":[14,6],"style":"flicker","ms":[900,2400]}],
    overlays: []
  },
  cloakroom: {
    version: 1,
    shot: "Frontal, eye level, facing north at a counter that runs across the foot of the picture, the {pegs} on a rail behind it; no vanishing point. Palette lamplight. One light: a small gas bracket lamp on the wall at the right (x 262). Gradient 1: the back wall, plain brown at the lamp's side to a dense black dither at the far left, because the lamp's light dies out across the wall; the floor is a half-black shade check. Subject: the one heavy {coat}, a black silhouette with a brown lit edge, on its peg in the left third (columns 88-134), and on the right third the brass call-{bell} on the green baize counter top (columns 206-220), with the flask overlay lying on the counter at 180,64. Left wing: an umbrella against the wall, a stool and a floor mat; right wing: a ticket rack, a mirror and the lamp. Dressing: eight {pegs}, a clock and a hat shelf with hatboxes on the wall, an inkpot and a docket on the counter, a lost glove. moves: the bell's glint (flicker).",
    draw: `rect wall 0,0,320,112 fade:6,0/262,50/-80,50
rect floor 0,112,320,24 mix:6,0@0.5
line floor_line1 0,122 320,122 c0
line floor_line2 0,130 320,130 c0
rect rail_board 40,34,232,6 6 e0
line wall_top 40,41 272,41 c0
rect peg1 48,40,3,6 6 e0
rect peg2 70,40,3,6 6 e0
rect peg3 92,40,3,6 6 e0
rect peg4 108,40,3,7 14 e0
rect peg5 138,40,3,6 6 e0
rect peg6 160,40,3,6 6 e0
rect peg7 204,40,3,6 6 e0
rect peg8 244,40,3,6 6 e0
line hook_coat 109,40 109,48 c14
poly coat 92,44 126,44 130,104 88,104 0 e6
poly coat_collar 98,44 118,44 114,56 102,56 6
poly coat_sleeve 126,46 136,60 132,96 126,88 0 e6
line coat_seam 108,56 108,102 c6
rect coat_pocket 94,78,11,12 0 e6
line coat_hem 88,104 130,104 c6
rect rack 282,42,32,50 6 e0
line rack_l1 282,56 314,56 c0
line rack_l2 282,72 314,72 c0
line rack_v 298,42 298,92 c0
rect ticket1 286,46,8,8 15
rect ticket2 302,60,8,8 15
rect ticket3 286,76,8,8 15
ellipse clock_face 160,22,9,9 15 e0
line clock_h1 160,22 160,16 c0
line clock_h2 160,22 164,24 c0
dots clock_dot 160,13 160,31 151,22 169,22 c0
rect mirror 222,28,22,28 1 e14
line mirror_glint 226,32 232,44 c9
line frame_line 220,27 246,27 c14
rect hat_shelf 150,56,56,3 6 e0
rect hatbox_a 152,44,16,12 6 e0
rect hatbox_b 170,46,14,10 14 e0
rect hatbox_c 186,44,16,12 6 e0
line umbrella 20,58 30,114 c14
poly umb_cloth 14,56 28,58 26,84 16,82 0 e6
rect stool 36,102,22,4 6 e0
line stool_leg1 38,106 36,122 c0
line stool_leg2 56,106 58,122 c0
rect floor_mat 36,126,44,6 4 e0
rect counter 86,84,220,40 6 e0
rect counter_top 86,80,220,5 14 e0
rect baize 98,80,196,2 2
rect counter_p1 96,90,60,28 mix:6,0@0.5 e0
rect counter_p2 164,90,60,28 mix:6,0@0.5 e0
rect counter_p3 232,90,64,28 mix:6,0@0.5 e0
ellipse bell_base 213,79,8,2 14 e0
ellipse bell_dome 213,75,7,5 14 e0
rect bell_knob 212,69,3,2 14
rect bell_glint 210,72,3,2 15
rect ink_pot 268,73,7,7 0 e6
rect docket 244,77,14,3 15
poly lost_glove 126,76 136,76 138,80 124,80 14 e0
rect shadow_counter 86,124,220,4 0
line lamp_bracket 262,32 262,44 c0
ellipse lamp_glow 262,40,22,15 mix:,14@0.12
ellipse lamp_glow2 262,40,12,9 mix:,14@0.25
ellipse lamp_globe 262,40,4,4 14`,
    cycles: [{"name":"the bell's glint","areas":["bell_glint"],"colors":[15,14],"style":"flicker","ms":[900,2600]}],
    overlays: [{"object":"flask","at":[180,64]}]
  },
  hall: {
    version: 1,
    shot: "One-point view, eye level, facing north down the long Salle des Marines to the stair at its end; vp (213,62) on the stair's third (the west gallery doorway on the left wall, the office doorway on the right wall). Palette deepnight. Light: three small gas {jets} under the frames, yellow, each with a soft halo. Gradient 1: the side walls, blue at the near edge to a dense black dither at the far end, because the hall recedes away from the jets into the dark (one cause on both walls). Gradient 2: the floor, cyan near to blue far, because the jets' light lies on the paving and thins with distance. Subject: the stair at the end of the hall (steps in cyan, a dark landing above), columns 190-238, with the red-magenta runner leading to it. Left wing: gilt {frames} of sea pictures under their jets; right wing: a frame and a plaster bust on a plinth. Dressing: a {wire} from each frame's corner to a brass bell on the cornice, floor tile lines, a rug, a stair rail. moves: the jets and their halos (flicker).",
    draw: `vp 213,62
poly ceil 0,0@1 320,0@1 320,0@0.4 0,0@0.4 mix:1,0@0.5
poly wall_l 0,0@1 0,136@1 0,136@0.4 0,0@0.4 fade:1,0/0,60/160,60
poly wall_r 320,0@1 320,136@1 320,136@0.4 320,0@0.4 fade:1,0/320,60/240,60
poly end 0,0@0.4 320,0@0.4 320,136@0.4 0,136@0.4 mix:1,0@0.8
poly floor 0,136@1 320,136@1 320,136@0.4 0,136@0.4 fade:3,1/0,136/0,92
line cornice_l 0,16@1 0,16@0.4 c14
line cornice_r 320,16@1 320,16@0.4 c14
line floor_l1 -40,136@1 -40,136@0.4 c0
line floor_l2 60,136@1 60,136@0.4 c0
line floor_l3 140,136@1 140,136@0.4 c0
line floor_l4 290,136@1 290,136@0.4 c0
line floor_c1 0,136@0.85 320,136@0.85 c0
line floor_c2 0,136@0.7 320,136@0.7 c0
line floor_c3 0,136@0.55 320,136@0.55 c0
poly rug 176,136@1 250,136@1 250,136@0.45 176,136@0.45 5 e1
poly door_l 0,40@0.7 0,40@0.58 0,118@0.58 0,118@0.7 0 e3
poly door_r 320,40@0.58 320,40@0.5 320,118@0.5 320,118@0.58 0 e3
poly frame_l1 0,30@0.92 0,30@0.78 0,76@0.78 0,76@0.92 14 e0
poly frame_l1_in 0,36@0.9 0,36@0.8 0,70@0.8 0,70@0.9 0
line sea_l1 0,50@0.9 0,54@0.8 c3
line sea_l2 0,60@0.9 0,62@0.8 c3
poly frame_l2 0,34@0.52 0,34@0.44 0,70@0.44 0,70@0.52 14 e0
poly frame_l2_in 0,38@0.5 0,38@0.46 0,66@0.46 0,66@0.5 0
line wave_l 0,52@0.5 0,54@0.46 c3
line wave_l2 0,58@0.5 0,59@0.46 c3
poly frame_r1 320,30@0.88 320,30@0.74 320,76@0.74 320,76@0.88 14 e0
poly frame_r1_in 320,36@0.86 320,36@0.76 320,70@0.76 320,70@0.86 0
line sea_r1 320,52@0.86 320,54@0.76 c3
dots bell_a 0,16@0.88 c14
dots bell_b 0,16@0.5 c14
dots bell_c 320,16@0.8 c14
dots bell_d 0,16@0.7 c14
line wire_a 0,30@0.9 0,16@0.88 c3
line wire_b 0,34@0.5 0,16@0.5 c3
line wire_c 320,30@0.8 320,16@0.8 c3
line wire_d 0,30@0.7 0,16@0.7 c3
ellipse jet_a_glow 32,80,20,13 mix:,14@0.12
ellipse jet_a_glow2 32,80,9,6 mix:,14@0.25
ellipse jet_a 32,80,3,4 14
ellipse jet_b_glow 111,74,15,10 mix:,14@0.12
ellipse jet_b_glow2 111,74,7,5 mix:,14@0.25
ellipse jet_b 111,74,2,3 14
ellipse jet_c_glow 299,78,17,12 mix:,14@0.12
ellipse jet_c_glow2 299,78,8,6 mix:,14@0.25
ellipse jet_c 299,78,3,4 14
line floor_gleam 30,122 56,122 c3
line floor_gleam2 96,106 112,106 c3
line floor_gleam3 270,114 296,114 c3
rect step_1 190,84,48,8 3 e0
rect step_2 194,76,40,8 3 e0
rect step_3 198,68,32,8 3 e0
rect stair_a 198,52,32,16 0
line stair_rail 242,56 242,92 c14
rect rail_post 240,54,4,4 14
rect plinth 274,92,20,32 1 e0
ellipse bust 284,84,8,10 15 e0
rect shadow_plinth 270,124,28,3 0
rect shadow_stair 186,92,56,2 0
line frame_nails 22,31 44,31 c14
line door_l_lintel 0,38@0.71 0,38@0.57 c14
line door_r_lintel 320,38@0.59 320,38@0.49 c14
line sconce_l 0,20@0.62 0,28@0.62 c14
line sconce_r 320,20@0.64 320,28@0.64 c14
line cornice_l2 0,20@1 0,20@0.4 c1
line cornice_r2 320,20@1 320,20@0.4 c1
rect rug_end 196,92,34,2 14
rect jet_a_pipe 31,84,2,6 14
rect jet_b_pipe 110,76,2,5 14
rect jet_c_pipe 298,82,2,6 14`,
    cycles: [{"name":"the jets","areas":["jet_a","jet_a_glow","jet_a_glow2","jet_b","jet_b_glow","jet_b_glow2","jet_c","jet_c_glow","jet_c_glow2"],"colors":[14,6],"style":"flicker","ms":[800,2200]}],
    overlays: []
  },
  office: {
    version: 1,
    shot: "Frontal, eye level, facing north at the {desk}: a roll-top desk with its open {ledger} and a green-shaded gas {bracket} above it, all on the right third (columns 168-294), no vanishing point. Palette lamplight. One light: the gas bracket's flame inside its green glass shade at x 226. Gradient 1: the back wall above the panelling, plain brown near the bracket at right to a dense black dither at the far left, because the gas light dies out across the wall; the wainscot and floor are half-black shade checks, with the bracket's yellow pool flat on the desk top. Subject: the roll-top desk, its slatted roll, drawers and handles, with the matches overlay lying on the desk top at 244,76. Left third: a bookcase with books and boxes on its shelves (columns 70-140); left wing: a coat stand with a hat, a fire screen; right wing: a waste basket. Dressing: panelling, a chair pulled up at the desk, a red rug, an inkwell and a pen, a clock on the wall. moves: the gas flame, its halo and the desk's pool (flicker).",
    draw: `rect wall 0,0,320,84 fade:6,0/250,50/-80,50
rect wainscot 0,84,320,26 mix:6,0@0.5
rect floor 0,110,320,26 mix:6,0@0.7
line wall_line 0,84 320,84 c0
rect panel_1 0,84,320,2 6
line panel_v1 40,86 40,110 c0
line panel_v2 110,86 110,110 c0
line panel_v3 300,86 300,110 c0
line panel_v4 160,86 160,110 c0
line board1 0,118 320,118 c0
line board2 0,128 320,128 c0
ellipse office_clock 118,16,8,8 15 e0
line office_clock_h 118,16 118,10 c0
rect case 70,22,72,76 6 e0
rect case_in 74,26,64,68 mix:6,0@0.5
line shelf1 74,48 138,48 c6
line shelf2 74,70 138,70 c6
line shelf3 74,92 138,92 c6
rect book1 78,34,6,14 4 e0
rect book2 86,36,5,12 14 e0
rect book3 93,33,6,15 0 e6
rect book4 101,35,6,13 4 e0
rect book5 82,56,6,14 14 e0
rect book6 90,54,7,16 0 e6
rect book7 100,57,6,13 4 e0
rect box_a 112,58,22,12 14 e0
rect box_b 82,78,26,14 6 e0
rect shadow_case 70,98,72,3 0
rect rug 118,118,100,12 4 e0
rect fire_screen 4,66,38,44 6 e0
line fire_screen_bar 10,72 10,106 c0
line fire_screen_bar2 22,72 22,106 c0
line fire_screen_bar3 34,72 34,106 c0
line stand_pole 58,30 58,108 c0
rect stand_top 52,28,12,3 14
ellipse hat 58,24,8,4 0 e6
rect hat_a 54,20,8,5 0 e6
rect chair 150,74,5,30 6 e0
rect chair_seat 140,100,28,5 6 e0
line chair_leg1 142,105 140,126 c0
line chair_leg2 164,105 166,126 c0
rect roll_hood 174,60,114,4 6 e0
rect desk_roll 176,64,110,28 6 e0
line roll_slat1 176,71 286,71 c0
line roll_slat2 176,78 286,78 c0
line roll_slat3 176,85 286,85 c0
rect desk_top 168,92,126,6 6 e0
rect desk_lit 168,92,126,2 14
rect desk_body 172,98,118,32 6 e0
rect desk_d1 178,104,50,22 mix:6,0@0.5 e0
rect desk_d2 234,104,50,22 mix:6,0@0.5 e0
dots desk_handle1 203,114 c14
dots desk_handle2 259,114 c14
ellipse pool 230,95,50,6 mix:,14@0.3
poly ledger 184,90 226,88 230,95 180,97 15 e0
line ledger_spine 205,89 205,96 c4
line ledger_l1 186,91 202,90 c0
line ledger_l2 186,93 202,92 c0
line ledger_l3 208,90 224,89 c0
line ledger_l4 208,93 224,92 c0
line pen 232,92 240,86 c0
rect inkwell 266,86,6,7 0 e6
line bracket_arm 226,26 226,44 c0
ellipse bracket_glow 226,54,26,18 mix:,14@0.12
ellipse bracket_glow2 226,54,14,10 mix:,14@0.25
poly bracket_shade 217,44 235,44 238,58 214,58 2 e0
ellipse bracket_flame 226,53,3,4 14
rect waste 296,106,14,18 6 e0
line waste_rim 296,106 310,106 c14
rect shadow_desk 172,130,118,4 0
rect shadow_waste 294,124,18,3 0`,
    cycles: [{"name":"the gas","areas":["bracket_flame","bracket_glow","bracket_glow2","pool"],"colors":[14,6],"style":"flicker","ms":[900,2400]}],
    overlays: [{"object":"matches","at":[244,76]}]
  },
  west_gallery: {
    version: 1,
    shot: "One-point view from the east doorway, eye level, facing north-west down the long gallery of plaster casts; vp (107,62) on the watchman's third. Palette deepnight. Light: two small yellow gas jets on the side walls, each with a soft halo. Gradient 1: both side walls, blue near to a dense black dither at the far end, because the gallery recedes from the jets into the dark (one cause on two walls). Gradient 2: the floor, cyan near to blue far, because the jets' light lies on the paving and thins with distance. Subject: {Gaspard} the watchman seated on a bentwood {chair}, kepi, brandy nose, coat with brass buttons, rounds-clock on its strap, columns 88-128 (left third); the key overlay lies on the floor at 40,118. Beside him, further on: plaster {casts} of gods and athletes on pedestals, pale cyan, in the left wing (one), the right wing (one) and the middle (two small ones near the door). Dressing: a magenta fire bucket, a lit sign bar over the far door, small tags on the plinths, plaster dust on the floor. moves: the jets and their halos (flicker).",
    draw: `vp 107,62
poly ceil 0,0@1 320,0@1 320,0@0.45 0,0@0.45 mix:1,0@0.5
poly wall_l 0,0@1 0,136@1 0,136@0.45 0,0@0.45 fade:1,0/0,60/74,60
poly wall_r 320,0@1 320,136@1 320,136@0.45 320,0@0.45 fade:1,0/320,60/174,60
poly wall 0,0@0.45 320,0@0.45 320,136@0.45 0,136@0.45 mix:1,0@0.8
poly floor 0,136@1 320,136@1 320,136@0.45 0,136@0.45 fade:3,1/0,136/0,95
rect door 160,52,22,40 0 e3
line door_bar 171,52 171,92 c1
dots door_knob 164,74 c14
rect sign 160,45,22,4 14 e0
line lintel_door 158,50 184,50 c3
line plinth_line 0,100@1 0,100@0.45 c0
line floor_marks 150,124 176,124 c0
rect ped_l 4,92,28,34 1 e0
rect cast_l_body 10,58,16,34 3 e0
ellipse cast_l_head 18,52,6,7 3 e0
line cast_l_arm 10,62 4,76 c15
line cast_l_arm2 26,62 30,74 c15
rect tag_l 12,100,12,4 14
rect ped_r 262,88,30,40 1 e0
rect cast_r_body 268,52,18,36 3 e0
ellipse cast_r_head 277,45,7,8 3 e0
line cast_r_arm 286,56 296,70 c15
rect tag_r 270,100,14,4 14
rect ped_m 196,86,22,34 1 e0
rect cast_m_body 200,62,14,24 3 e0
ellipse cast_m_head 207,57,5,6 3 e0
rect tag_m 200,96,12,4 14
rect ped_m2 148,92,16,28 1 e0
rect cast_m2_body 151,72,10,20 3 e0
ellipse cast_m2_head 156,68,4,5 3 e0
rect tag_m2 150,100,12,3 14
rect shadow_l 0,126,34,3 0
rect shadow_r 262,128,32,3 0
rect chair_seat 90,100,34,5 0 e3
line chair_back 92,64 90,100 c3
line chair_back2 94,62 92,100 c3
line chair_back3 96,66 94,100 c3
line chair_leg1 92,105 88,126 c3
line chair_leg2 122,105 126,126 c3
line chair_leg3 108,105 108,124 c3
poly gaspard_thighs 96,98 124,98 134,106 100,106 mix:1,3@0.4 e0
rect gaspard_shin_l 98,106,8,18 mix:1,3@0.4 e0
rect gaspard_shin_r 112,106,8,18 mix:1,3@0.4 e0
rect gaspard_boot_l 96,122,12,5 0 e3
rect gaspard_boot_r 112,122,12,5 0 e3
poly gaspard_body 92,66 124,66 128,100 90,100 mix:1,3@0.4 e0
rect gaspard_shade 114,68,10,32 mix:1,0@0.5
dots gaspard_buttons 106,72 106,80 106,88 c14
line gaspard_strap 96,68 120,94 c14
ellipse gaspard_clock 114,88,4,4 14 e0
dots gaspard_clock_dot 114,88 c0
line gaspard_chain 96,98 104,100 c14
ellipse gaspard_head 108,57,8,9 3 e0
poly gaspard_kepi 98,48 118,48 120,53 96,53 1 e3
rect gaspard_band 98,52,20,2 14
line gaspard_brim 96,54 122,54 c0
dots gaspard_nose 108,59 c4
line gaspard_moustache 103,62 113,62 c0
dots gaspard_eyes 104,57 112,57 c0
ellipse gaspard_hand_l 100,100,3,3 3 e0
ellipse gaspard_hand_r 120,100,3,3 3 e0
rect fire_bucket 168,108,10,12 5 e0
dots plaster_dust 40,112 70,120 130,126 176,128 230,122 280,130 c3
ellipse jet_l_glow 40,52,20,13 mix:,14@0.12
ellipse jet_l_glow2 40,52,9,6 mix:,14@0.25
ellipse jet_l 40,52,3,4 14
line bracket_l 40,56 40,62 c14
ellipse jet_r_glow 298,44,20,14 mix:,14@0.12
ellipse jet_r_glow2 298,44,9,6 mix:,14@0.25
ellipse jet_r 298,44,3,4 14
line bracket_r 298,48 298,54 c14`,
    cycles: [{"name":"the jets","areas":["jet_l","jet_l_glow","jet_l_glow2","jet_r","jet_r_glow","jet_r_glow2"],"colors":[14,6],"style":"flicker","ms":[800,2200]}],
    overlays: [{"object":"lens_key","at":[40,118]}]
  },
  landing: {
    version: 1,
    shot: "Frontal, eye level, facing north at the wall of the half-landing; no vanishing point. Palette lamplight. One light: the low gas bracket flame flame_a between the window and the door (x 176), a small one, flame_b, far right. Gradient 1: the back wall, plain brown beside the gas flame to a dense black dither at both outer edges, because the gas is turned low and its light dies out sideways along the wall (one cause, two wall shapes, split at the flame); the dado and floor are half-black shade checks. Subject: the heavy oak {door} in brass-bound frame with its brass {plate}, keyhole and studs, columns 186-240 (right third), 82 tall; the round {window} on the left third (columns 80-134), night blue glass with a pale moon and bars. Left wing: the stair rail with posts running down, a small gilt frame; right wing: a vase on a stand, a gilt frame. Dressing: a red mat before the door, hinges, a crack in the door, dust, a skirting line. moves: the two gas flames and their halos (flicker).",
    draw: `rect wall_l 0,0,176,84 fade:6,0/176,50/-44,50
rect wall_r 176,0,144,84 fade:6,0/176,50/356,50
rect dado 0,84,320,18 mix:6,0@0.5
rect dado2 0,100,320,2 6
rect floor 0,102,320,34 mix:6,0@0.7
line board1 0,118 320,118 c0
line skirt 0,102 320,102 c0
rect window_sill 76,74,62,4 14 e0
ellipse win_frame 107,48,29,29 6 e0
ellipse win_glass 107,48,25,25 1
ellipse moon 116,40,5,5 15
dots win_stars 98,36 104,60 120,56 94,50 c9
line win_bar1 82,48 132,48 c0
line win_bar2 107,23 107,73 c0
rect door_frame 184,24,58,88 14 e0
rect door 189,30,48,82 6 e0
rect door_p1 194,35,38,18 mix:6,0@0.5 e0
rect door_p2 194,58,38,18 mix:6,0@0.5 e0
rect door_p3 194,81,38,26 mix:6,0@0.5 e0
rect plate 214,54,14,8 14 e0
line plate_l1 216,57 226,57 c0
line plate_l2 216,59 224,59 c0
ellipse knob 192,76,2,2 14
dots keyhole 195,70 c0
rect door_hinge1 187,38,3,5 0
rect door_hinge2 187,100,3,5 0
dots door_studs 192,34 200,34 208,34 216,34 224,34 232,34 c14
line crack 222,86 226,96 224,104 c0
rect door_gap 189,110,48,2 0
poly arch 184,24 213,14 242,24 14 e0
rect mat 188,114,54,8 4 e0
rect shadow_door 184,112,60,3 0
line sconce_wire 176,16 176,36 c0
rect bracket_a 172,36,8,4 0
ellipse flame_a_glow 176,48,26,19 mix:,14@0.12
ellipse flame_a_glow2 176,48,14,11 mix:,14@0.25
ellipse flame_a 176,47,2,4 14
line bracket_b 296,42 296,48 c0
ellipse flame_b_glow 296,52,17,12 mix:,14@0.12
ellipse flame_b_glow2 296,52,9,7 mix:,14@0.25
ellipse flame_b 296,52,2,3 14
rect frame_small 252,38,18,22 14 e0
rect frame_small_in 256,42,10,14 0
rect frame_b 18,34,22,28 14 e0
rect frame_b_in 22,38,14,20 0
rect frame_c 276,66,16,20 14 e0
rect frame_c_in 280,70,8,12 0
rect vase 282,100,12,12 14 e0
rect vase_stand 284,112,8,10 6 e0
line vase_lip 281,100 295,100 c0
line stair_rail 0,100 104,128 c14
line rail_top 0,98 104,126 c6
rect post1 8,100,3,28 0
rect post2 40,108,3,24 0
rect post3 74,116,3,20 0
line step_edge 0,130 100,130 c0
line rail_cap 0,97 104,125 c14
dots dust 150,110 168,124 250,100 270,128 c14
line door_arch_edge 188,26 238,26 c0
dots wall_nails 30,36 262,40 c14
line frame_b_wire 24,34 30,24 c0`,
    cycles: [{"name":"the gas","areas":["flame_a","flame_a_glow","flame_a_glow2","flame_b","flame_b_glow","flame_b_glow2"],"colors":[14,6],"style":"flicker","ms":[900,2400]}],
    overlays: []
  },
  lens_room: {
    version: 1,
    shot: "Eye level, facing north, frontal, at the foot of the domed room; no vanishing point; the dome is drawn as the arched band of glass above the wall's top edge, never looked up into. Palette deepnight. No near light: the moon seen through the glass is the only light, and the lens is cold (its {lamp} dark; lit later). Gradient 1: the night sky seen through the dome glass, a dense black dither at the top running to blue at the wall's rim, because the sky brightens toward the horizon. Gradient 2: the back wall, blue just under the dome to a dense black dither at the floor, because the moonlight comes down through the glass and dies out toward the floor; the floor is a half-black shade check with irregular pale patches where the moon falls through the gaps between the iron ribs. Subject: the great beehive {lens} of glass rings in a brass cage on a brass table, 72 tall, columns 66-146 (left third), with five glints on the glass; on the right third (columns 176-250) the gilt-framed {painting} of a lighthouse on black rocks, a black sea, the painted lamp dark and its painted beam hidden in the sky colour, with a bell-{wire} from the frame's corner to a small bell. Left wing: a crate and the plaque; right wing: the iron {ladder} to the dome hatch. Dressing: iron ribs of the dome, a skylight and a moon disc, stars. moves: the glints on the lens (shimmer).",
    draw: `rect dome_bg 0,0,320,38 0
poly dome 0,38 20,26 60,12 110,5 160,3 210,5 260,12 300,26 320,38 fade:0,1/0,0/0,38
line rib1 160,5 90,38 c0
line rib2 160,5 130,38 c0
line rib3 160,5 190,38 c0
line rib4 160,5 230,38 c0
rect skylight_frame 146,3,28,8 0 e3
rect skylight_glass 150,5,20,4 1
line skylight_bar 160,3 160,11 c3
ellipse moon_dome 244,20,6,6 15
dots dome_stars 40,24 74,16 124,12 196,10 268,30 18,34 c15
line rim 0,38 320,38 c3
rect wall 0,38,320,70 fade:1,0/0,38/0,126
rect floor 0,108,320,28 mix:1,0@0.5
poly light_floor 170,112 240,112 262,132 150,132 mix:,3@0.25
poly light_floor2 80,120 100,118 110,130 76,132 mix:,3@0.2
rect frame_out 176,40,74,56 mix:6,14@0.5 e0
rect paint_canvas 181,45,64,46 1
rect paint_sea 181,72,64,19 mix:1,0@0.5
poly paint_rocks 200,91 206,78 214,72 226,76 232,91 0
rect paint_tower 209,50,8,26 3 e0
poly paint_cap 207,50 213,44 219,50 0 e3
rect paint_lamp 211,48,4,3 0
poly paint_beam 215,49 245,40 245,54 1
line paint_wave1 184,80 196,80 c3
line paint_wave2 226,84 240,84 c3
line wire_a 250,44 262,30 c3
dots bell 262,29 c14
rect frame_shadow 178,96,74,3 0
line ladder_l 286,110 288,22 c3
line ladder_r 302,110 304,22 c3
line rung1 287,100 303,100 c3
line rung2 287,86 303,86 c3
line rung3 287,72 303,72 c3
line rung4 287,58 303,58 c3
line rung5 287,44 303,44 c3
rect crate_small 12,96,28,26 mix:1,0@0.5 e3
line crate_lid 12,102 40,102 c3
rect table_top 66,104,82,5 mix:6,14@0.5 e0
rect table_leg1 72,109,4,22 mix:6,14@0.5 e0
rect table_leg2 138,109,4,22 mix:6,14@0.5 e0
line table_lip 66,104 148,104 c14
rect plaque 92,112,28,6 14 e0
poly lens_base 76,104 138,104 132,96 82,96 mix:6,14@0.5 e0
rect lens_r1 80,82,54,14 mix:3,1@0.5 e3
rect lens_r2 84,68,46,14 mix:3,1@0.5 e3
rect lens_r3 88,54,38,14 mix:3,1@0.5 e3
rect lens_r4 92,42,30,12 mix:3,1@0.5 e3
poly lens_cap 98,42 116,42 112,32 102,32 14 e0
rect lens_band1 80,81,54,2 14
rect lens_band2 84,67,46,2 14
rect lens_band3 88,53,38,2 14
line lens_cage_l 80,96 92,42 c14
line lens_cage_r 134,96 122,42 c14
ellipse lens_flame 107,66,4,7 1
rect lens_core 105,63,3,7 3
line lens_glint1 86,86 94,86 c11
line lens_glint2 92,72 100,72 c15
line lens_glint3 100,58 108,58 c11
line lens_glint4 112,90 120,90 c15
line lens_glint5 108,46 114,46 c11
rect shadow_lens 70,130,78,3 0
line plaque_line 96,115 116,115 c0`,
    cycles: [{"name":"the glints","areas":["lens_glint1","lens_glint2","lens_glint3","lens_glint4","lens_glint5"],"colors":[15,11,3],"style":"pingpong","scatter":true,"ms":420}],
    overlays: []
  },
  roof: {
    version: 1,
    shot: "Wide landscape from the ridge of the zinc roof, facing north; the horizon at y 60, no vanishing point. Palette moonlight: only the sky and the distance take gradients; every solid thing is a black silhouette with at most a 1-pixel light edge on the side facing the moon. Light: the moon, a flat white disc on the left third (x 107, y 26); no halo. Gradient 1: the sky, a dense black dither at the top running to blue and then light blue at the horizon (two stacked shapes), because the night sky brightens toward the horizon. Gradient 2: the distant city, light blue at the horizon to blue below it, because distance thickens the air (the far roofs stand in it). Subject: the iron {drainpipe} with its gutter head and brackets, a black pipe with a light edge, 66 tall against the sky in the right third (columns 204-226), with a low parapet at its foot. Left wing: a tall chimney pot and a weather vane; right wing: a second near pot and dormers on the mid roofs. Mid layer: black roofs with {chimney pots}, a pigeon on a ridge; far layer: blue roofs, the {river} as a pale blade with glints under the moon. Near: the zinc roof with seams, its ridge lit, the {hatch} frame. Dressing: stars, a thin wire, ridge tiles, a gutter. moves: the stars (twinkle).",
    draw: `rect sky 0,0,320,34 fade:0,1/0,0/0,34
rect sky_low 0,34,320,26 fade:1,9/0,34/0,60
dots stars_still 10,8 24,20 40,12 58,26 74,6 90,16 130,10 150,24 168,8 186,18 204,6 224,14 246,22 262,8 280,16 298,6 312,22 34,30 120,28 270,30 c15
dots stars_tint 16,14 52,10 98,28 140,16 176,26 214,10 238,26 288,26 308,12 c11
dots stars_twinkle 30,18 82,12 112,6 160,14 196,24 232,6 258,18 290,10 c15
ellipse moon 107,26,9,9 15
rect haze 0,60,320,20 fade:9,1/0,60/0,80
poly far_roofs 0,66 0,60 20,58 30,54 50,56 66,52 90,56 120,54 150,58 180,52 210,56 240,54 270,58 300,52 320,56 320,66 1
rect pot_far1 66,48,3,5 1
rect pot_far2 120,50,3,5 1
rect pot_far3 180,48,3,5 1
rect pot_far4 240,50,3,5 1
rect pot_far5 270,53,3,5 1
rect pot_far6 300,48,3,5 1
dots far_lights 36,60 78,58 132,60 196,58 244,60 c9
rect river 0,70,320,5 9
line river_glint1 96,71 102,71 c15
line river_glint2 108,73 116,73 c11
line river_glint3 120,72 124,72 c15
poly mid_roofs 0,100 0,86 30,80 60,84 90,78 124,82 160,76 196,82 230,78 262,84 296,78 320,82 320,100 0
rect pot_mid1 56,70,5,12 0
rect pot_mid2 92,66,5,12 0
rect pot_mid3 160,64,5,12 0
rect pot_mid4 262,72,5,12 0
poly dormer 130,84 150,84 146,74 134,74 0 e9
rect dormer_win 137,78,6,5 1
poly dormer2 290,86 308,86 305,78 293,78 0 e9
rect dormer2_win 296,81,5,4 1
ellipse pigeon 76,81,5,3 0
ellipse pigeon_head 80,79,2,2 0
line ridge 0,100 320,100 c9
poly near_roof 0,136 0,102 320,98 320,136 0
line zinc1 0,108 320,106 c1
line zinc2 0,116 320,114 c1
line zinc3 0,124 320,122 c1
line zinc4 90,100 70,136 c1
line zinc5 240,100 270,136 c1
dots ridge_tile1 20,100 60,100 100,100 150,100 c9
dots ridge_tile2 210,99 250,99 290,98 c9
rect pot_near1 18,70,12,32 0 e9
rect pot_near1_cap 15,66,18,4 0 e9
rect pot_near2 282,74,12,26 0 e9
rect pot_near2_cap 279,70,18,4 0 e9
line vane 40,40 40,70 c0
line vane_arm 32,48 48,48 c0
rect wall_back 180,92,80,8 0
line wall_back_hi 180,92 260,92 c9
rect pipe 210,36,5,60 0
line pipe_hi 209,36 209,96 c11
poly pipe_top 202,28 226,28 226,36 202,36 0 e9
rect pipe_elbow 202,36,8,6 0
line pipe_bracket1 208,50 217,50 c0
line pipe_bracket2 208,66 217,66 c0
line pipe_bracket3 208,82 217,82 c0
rect shadow_pipe 204,96,16,2 0
line gutter 150,100 204,100 c9
line wire 0,44 320,40 c1
poly hatch_frame 118,116 160,114 164,128 114,130 0 e9
rect skylight 24,112,20,10 0 e9
line skylight_bar 34,112 34,122 c9
line near_edge 0,102 320,98 c1`,
    cycles: [{"name":"the stars","areas":["stars_twinkle"],"colors":[15,9],"style":"pingpong","ms":2400}],
    overlays: []
  }
};

export const endings = {
  caught: {
    version: 1,
    shot: "Ending. Eye level from the street, facing north at the Galerie's front, frontal; no vanishing point. Palette fog (night rain): black, dark grey, light grey, white, with one coloured light, red. Light: every {window} blazing white, a small second light, the gendarme's {lantern} in light red with a halo. Gradient 1: the night sky, a dense black dither at the top running into dark grey, because the sky dies into the wet fog above the roofline. Gradient 2: the facade, dark grey at the cornice to light grey at the foot, because fog glows low where the lit windows and lamps reach the street. Subject: the door in its pillared porch with the steps, red and lit, columns 174-262 (right third), and the long solid black shadow of the gendarme thrown up the steps and across the door; the gendarme, a black silhouette with his lantern on the left third (columns 98-130), 60 tall. Left wing: a street lamp {post} with a red lamp and its halo; right wing: a second small {figure} at the foot of the steps and the {rail}. Dressing: eight barred windows with sills, {cobbles} on the pavement, {rain} streaks, low {fog} over the pavement. moves: nothing.",
    draw: `rect sky 0,0,320,44 fade:0,8/0,-11/0,44
rect front 18,22,284,80 fade:7,8/0,102/0,22
rect pave 0,102,320,34 8
rect pave_dark 0,124,320,12 mix:8,0@0.5
rect cornice 14,18,292,5 7 e0
poly pediment 174,38 213,22 252,38 7 e0
rect pil_l 178,42,9,60 7 e0
rect pil_r 238,42,9,60 7 e0
rect win1 24,28,20,24 15 e0
rect win2 52,28,20,24 15 e0
rect win3 80,28,20,24 15 e0
rect win4 108,28,20,24 15 e0
rect win5 252,28,20,24 15 e0
rect win6 280,28,18,24 15 e0
rect win7 24,62,20,24 15 e0
rect win8 52,62,20,24 15 e0
line bar1 34,28 34,52 c0
line bar2 62,28 62,52 c0
line bar3 90,28 90,52 c0
line bar4 118,28 118,52 c0
line bar5 262,28 262,52 c0
line bar6 289,28 289,52 c0
line bar7 34,62 34,86 c0
line bar8 62,62 62,86 c0
line sill1 22,53 46,53 c7
line sill2 50,53 74,53 c7
line sill3 78,53 102,53 c7
line sill4 106,53 130,53 c7
line sill5 250,53 274,53 c7
line sill6 278,53 300,53 c7
line sill7 22,87 46,87 c7
line sill8 50,87 74,87 c7
rect door 192,48,44,54 12 e0
line door_bar 214,48 214,102 c0
ellipse lamp_red 214,44,4,4 4 e0
poly steps 172,102 254,102 262,110 164,110 7 e0
poly step1 164,110 262,110 270,118 156,118 8 e0
poly step2 156,118 270,118 278,126 148,126 7 e0
line rail_l 150,126 176,104 c7
line rail_r 276,126 252,104 c7
line cobble1 20,112 70,112 c0
line cobble2 190,132 250,132 c0
line cobble3 100,120 150,120 c0
line cobble4 290,116 316,116 c0
rect fog_low 0,104,320,18 mix:,7@0.25
poly shadow 112,126 170,122 190,104 192,54 214,40 236,50 236,92 208,106 196,124 0
rect figure_body 100,66,14,38 0 e7
ellipse figure_head 107,59,5,6 0 e7
poly figure_cap 102,52 112,52 114,56 100,56 0 e7
rect figure_leg1 101,104,5,20 0
rect figure_leg2 109,104,5,20 0
line figure_arm 114,72 124,82 c0
line lantern_h 124,82 124,86 c0
rect lantern 121,86,6,8 0 e7
rect lantern_pane 122,87,4,6 12
ellipse lantern_glow 124,90,16,12 mix:,12@0.15
line post 12,40 12,122 c0
ellipse post_lamp 12,38,5,5 4 e0
ellipse post_glow 12,38,14,10 mix:,4@0.15
ellipse fig2_head 268,95,3,3 0 e7
rect fig2_body 264,98,8,16 0 e7
rect fig2_leg 265,114,3,10 0
rect fig2_leg2 269,114,3,10 0
dots rain 20,10 50,24 90,6 130,18 170,8 200,30 240,12 280,22 310,8 40,60 150,70 260,64 300,90 c7`,
    cycles: [],
    overlays: []
  },
  carried: {
    version: 1,
    shot: "Ending. Far away, a wide landscape of Paris roofs at dawn from a distant ridge, facing north; the horizon at y 80, no vanishing point. Palette dusk: sky blue to magenta to light red, black silhouettes, a yellow sun. Light: the flat yellow {sun} disc low at the far left (no halo), and the burning {lens} in the dome, whose soft halo lies only inside the dome's black glass. Gradient 1: the sky, blue at the top to magenta to light red at the horizon (two stacked shapes), because dawn warms the sky toward the sun. Gradient 2: the haze over the far city, light red at the horizon to magenta below it, because distance thickens the air. Subject: a thin {figure} in a hat and a light red scarf on the roof ridge, 52 tall, a black silhouette against the magenta sky with a {roll} of canvas under one arm, left third (columns 98-128); on the right third (columns 190-236) the glass {dome} of the Galerie on its drum, the lens burning yellow inside. Left wing: far {roofs} and {chimney pots}, the sun; right wing: a church {spire} and the {bridge} over the {river}. Dressing: stars still in the top sky, two {clouds}, two {birds}, tile courses and sun glints on the near roof. moves: the stars (twinkle).",
    draw: `rect sky 0,0,320,40 fade:1,5/0,0/0,40
rect sky_low 0,40,320,40 fade:5,12/0,40/0,80
dots stars_still 12,6 34,14 60,8 88,18 118,6 150,12 176,4 206,16 238,8 268,14 300,6 316,18 c15
dots stars_twinkle 24,22 70,10 130,16 192,8 250,20 288,26 c13
ellipse sun 30,70,8,8 14
rect haze 0,80,320,20 fade:12,5/0,80/0,100
poly cloud1 56,30 96,26 124,30 96,35 mix:12,5@0.5
poly cloud2 232,44 262,40 290,44 262,49 mix:12,5@0.5
line bird1 150,46 154,43 158,46 c0
line bird2 164,52 167,50 171,52 c0
poly far_roofs 0,98 0,86 24,82 44,86 70,80 98,86 130,82 160,88 190,82 222,86 252,80 282,86 320,82 320,98 5
poly roofs_a 0,104 0,94 30,90 60,96 96,90 130,96 170,92 210,98 250,92 290,96 320,92 320,104 mix:5,0@0.5
rect pot_a 40,84,3,6 0
rect pot_b 108,86,3,6 0
rect pot_c 244,84,3,6 0
rect river 0,100,320,5 12
rect bridge 150,98,120,5 0
ellipse bridge_arch 176,103,10,5 12
ellipse bridge_arch2 214,103,10,5 12
rect dome_base 186,72,54,30 0
poly dome 186,72 190,58 200,48 213,44 226,48 236,58 240,72 0
line dome_rib1 213,44 200,72 c5
line dome_rib2 213,44 226,72 c5
rect dome_lantern 210,36,7,8 0
ellipse lens_glow 213,62,13,10 mix:,14@0.2
ellipse lens_burn 213,63,6,8 14
poly spire 276,100 282,46 288,100 0
rect spire_base 272,92,20,10 0
poly roofs_b 0,136 0,108 60,104 90,98 130,104 200,106 260,102 320,106 320,136 0
line ridge_hi 60,104 90,98 130,104 c12
line tile_a 20,114 130,112 c5
line tile_b 40,122 190,120 c5
line tile_c 200,114 310,112 c5
line tile_d 140,128 300,126 c5
line tile_e 10,130 90,128 c5
dots roof_glints 70,102 94,98 118,102 c12
rect pot_d 150,96,4,10 0
rect pot_e 168,98,4,8 0
rect pot_f 20,98,4,8 0
rect pot_g 296,98,4,8 0
rect pot_h 240,96,3,6 0
rect win_a 196,84,4,5 14
rect win_b 210,84,4,5 14
rect win_c 224,84,4,5 14
rect win_d 36,108,3,3 14
rect win_e 280,110,3,3 14
poly figure_legs_l 102,88 108,88 108,104 102,104 0
poly figure_legs_r 108,88 114,88 114,104 108,104 0
poly figure_body 101,64 115,64 117,90 99,90 0 e12
rect figure_scarf 103,62,10,3 12
ellipse figure_head 108,58,4,5 0
poly figure_hat 102,54 114,54 111,48 105,48 0
line figure_arm 115,70 122,80 c0
poly roll_canvas 114,76 126,70 128,74 116,82 15 e0
line roll_edge 116,78 126,72 c0`,
    cycles: [{"name":"the stars","areas":["stars_twinkle"],"colors":[13,5],"style":"pingpong","ms":2400}],
    overlays: []
  },
  keeper: {
    version: 1,
    shot: "Ending. Close up at eye level, facing north-east, frontal; no vanishing point. Palette deepnight, the lens lit white and yellow. Light: the lit {lens} and the {beam} it throws; the beam lies only on the flat black sky, the dome glass behind the lens carries no halo. Gradient 1: the dome's glass and iron behind the lens, blue near the lens to a dense black dither at the dome's far edge, because the light of the lens dies out across the glass. Gradient 2: the haze at the rooftop horizon, cyan at the horizon to blue below it, because distance thickens the air over Paris. Subject: the great beehive lens, white rings banded in yellow in a brass cage on its base, 92 tall, columns 54-160 (left third), its flame bright inside; the wide {beam} fans from the dome to the right edge over the rooftops, a yellow wedge thinning to nothing, with a brighter core. Left wing: the dome's iron {ribs}; right wing: black {roofs} with chimney {pots}, {smoke}, stars and a low haze. Dressing: cyan {prisms} and {glints} on the glass, bolts on the base, roof {tiles}. moves: the stars (twinkle).",
    draw: `rect sky 0,0,320,92 0
dots stars_still 200,8 224,20 250,6 270,26 296,12 312,30 210,40 240,48 286,44 c11
dots stars_twinkle 214,14 262,16 304,22 232,34 276,38 c11
dots stars_far 206,26 258,32 300,40 218,50 c3
rect haze 190,76,130,34 fade:3,1/0,78/0,110
poly dome 0,112 0,22 20,8 60,2 120,2 164,12 186,40 190,112 fade:1,0/170,60/-47,60
line rib1 92,2 20,60 0,110 c0
line rib2 92,2 60,50 40,110 c0
line rib3 120,2 150,50 160,110 c0
line rib4 120,2 170,40 188,110 c0
rect floor 0,110,190,26 mix:1,0@0.5
poly roofs 190,110 190,92 210,88 232,92 252,84 276,90 296,86 320,90 320,110 0
rect pot_a 226,80,4,12 0
rect pot_b 292,76,4,12 0
poly beam 190,56 320,8 320,74 190,66 fade:14,/190,60/320,40
poly beam_core 190,59 320,32 320,48 190,63 fade:15,/190,61/320,40
line beam_edge1 190,56 320,8 c14
line beam_edge2 190,66 320,74 c14
rect roofs_far 190,100,130,10 0
dots tile1 200,104 224,100 250,102 280,104 306,100 c1
dots tile2 214,106 240,108 270,106 300,108 c1
line smoke 228,78 230,70 227,62 c3
line smoke2 294,74 296,66 293,58 c3
poly base 54,110 160,110 152,100 62,100 14 e0
rect base_trim 54,108,106,2 0
dots base_bolt1 62,104 80,104 98,104 116,104 c0
dots base_bolt2 134,104 150,104 c0
rect ring1 62,84,90,16 15 e0
rect ring2 67,70,80,14 15 e0
rect ring3 72,56,70,14 15 e0
rect ring4 78,42,58,14 15 e0
rect ring5 84,30,46,12 15 e0
poly cap 92,30 122,30 114,18 100,18 14 e0
rect band1 62,83,90,2 14
rect band2 67,69,80,2 14
rect band3 72,55,70,2 14
rect band4 78,41,58,2 14
line cage_l 62,100 84,30 c14
line cage_r 152,100 130,30 c14
dots cage_bolts 64,96 72,76 80,52 140,52 148,76 150,96 c0
ellipse flame 107,62,7,11 14
ellipse flame_hot 107,64,3,6 15
line prism1 70,92 80,92 c3
line prism2 90,92 100,92 c3
line prism3 114,92 124,92 c3
line prism4 76,78 84,78 c3
line prism5 98,64 108,64 c3
line prism6 124,64 132,64 c3
line glint1 66,88 72,88 c11
line glint2 134,74 140,74 c11
line glint3 96,48 104,48 c11
line glint4 112,36 118,36 c11
line hi1 64,86 64,98 c3
line hi2 70,72 70,82 c3
line hi3 76,58 76,68 c3
line hi4 82,44 82,54 c3
line hi5 88,32 88,40 c3`,
    cycles: [{"name":"the stars","areas":["stars_twinkle"],"colors":[11,9],"style":"pingpong","ms":2400}],
    overlays: []
  }
};
