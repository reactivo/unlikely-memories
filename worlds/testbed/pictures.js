// Pictures for "Testbed" (worlds/testbed/world.en.js and world.es.js), one per room and one per ending, plus the hammock's vision, in the
// short notation (BRIEF.md §7, ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front, ids on what a rule redraws or a
// cycle animates. Between them they use every shape, every fill, every edit and every cycle style the engine draws (a Testbed has to).
//
// The shot list, written before drawing (viewpoint; horizon; main subject and its size; lead colour):
//   tb-start    eye level, looking in; 100 (the floor line); the turnstile on the right third, a third of the height; light grey 7
//   tb-hub      eye level, looking in; 100; four doors across the wall, the board above them, the middle of the frame; light blue 9
//   tb-clinic   looking down; 10; the spike plate in the lower third, the cot small at the top; light cyan 11
//   tb-lab      eye level, looking in; 96 (the bench top); the lever tall on the right third; green 2
//   tb-bar      silhouette; the counter at 84; Dot black against the stove's red glow on the left third; red 4
//   tb-office   close-up; none; the desk and the woman filling two thirds of the frame; brown 6
//   tb-bedroom  looking up; 120; the lamp's pool of yellow in the middle, the clock high on the right; blue 1
//   tb-yard     wide landscape; 44 (the wall's foot); the bench on the left third, a low grey sky taking the top; dark grey 8
//   tb-lane     far away; 62; the lit window at the end, a tenth of the width; yellow 14 on black
//   tb-ways     eye level, looking in; 94; the wheel on the back wall, the shutter and the chute at the sides; cyan 3
//   tb-annex    eye level down a long room; 70, vanishing at x 160; the shelves converging, the pole along the floor; magenta 5
//               (a runner on the floor drawn with vp and x,y@t points; a yellow glow that fades into nothing)
//   tb-landing  looking up; 120; the stairs going up the back wall, narrow and tall; light grey 7
//   tb-chute    through something; the tube's round mouth, a bright disc at the far end; dark grey 8
//   tb-closet   close-up; none; bare boards and a strip of light under the door; brown 6
//   tb-pit      looking up; none; a square of light high above, earth walls closing in; brown 6
//   tb-roof     wide landscape; 28; the parapet in the lower third, the floor's grid far below like a plan; light blue 9
//   tb-cellar   eye level, looking in; 78; the round vault door on the right third, the boat in the middle; dark grey 8
//   tb-vault    close-up; none; brushed steel in two tones, the open door a dark disc at the left; white 15
//   tb-pantry   from above; none; two shelves laid flat, the jar on the lower one; brown 6
//   lit         (ending) close-up; none; the lever thrown over, white sparks along a cable; yellow 14
//   named       (ending) close-up; none; the open ledger on the desk, the last name in ink; white 15
//   fell        (ending) from far above; none; the roof flat and grey, one small dark figure at its edge; dark grey 8
//   died        (ending) close-up; none; the spike plate, one red drop; light grey 7
//   hammock_dream  (vision) from far above; none; the rooms as lit squares in a grid, the hub glowing white; blue 1
// Read down: no two neighbours share a viewpoint, a horizon or a lead colour.

export default {
  // ---- INTAKE (the opening): the turnstile on the right, a handset's hook beside it, a flat light ----------------------------------
  "tb-start": {
    version: 1,
    draw: `
      rect wall 0,0,320,100 fade:15,7/0,0/0,100
      rect floor 0,100,320,36 fade:7,8/0,100/0,136
      line - 0,100 320,100 c8
      ellipse glow 160,22,80,30 mix:,15@0.2
      rect light 128,4,64,8 15 e7
      rect panel_l 20,30,80,56 none e8
      rect panel_r 112,30,80,56 none e8
      rect hook_plate 232,56,10,26 8 e0
      line hook 232,60 226,60 c7
      rect pad 246,104,70,8 8 e0
      rect post 262,50,10,56 7 e0
      poly bar1 272,62 306,56 306,61 272,67 8 e0
      poly bar2 272,80 306,80 306,85 272,85 8 e0
      poly bar3 272,98 306,104 306,109 272,103 8 e0
      line shadow 40,112 246,112 c8
    `,
    overlays: [{ object: "handset", at: [226, 64] }]
  },

  // ---- THE HUB: four doors in a curved wall under the board, stairs up on the left, steps down on the right ------------------------
  "tb-hub": {
    version: 1,
    draw: `
      rect wall 0,0,320,100 fade:1,9/0,0/0,100
      rect floor 0,100,320,36 stripes:8,7
      ellipse rug 160,118,110,13 mix:7,15@0.5 e8
      line - 0,100 320,100 c0
      rect board 88,12,148,18 6 e0
      rect board_l 96,16,60,10 15
      rect board_r 164,16,64,10 15
      dots board_marks 104,21 112,21 120,21 128,21 140,21 172,21 184,21 196,21 208,21 c0
      rect door_n 56,46,38,54 4 e0
      rect plus_v 73,58,5,22 15
      rect plus_h 65,66,21,5 15
      rect door_e 108,46,38,54 14 e0
      ellipse glass 127,66,8,10 mix:0,15@0.4
      rect door_s 160,46,38,54 9 e0
      ellipse moon 179,66,9,9 15
      ellipse moon_cut 183,64,8,8 9
      rect door_w 212,46,38,54 10 e0
      ellipse leaf 231,64,8,12 2
      line stem 231,74 231,84 c0
      dots knobs 90,74 142,74 194,74 246,74 c0
      poly stair_a 0,100 0,44 34,28 34,34 14,44 14,100 8 e0
      poly stair_b 14,100 14,44 30,36 30,100 mix:8,7@0.5
      line stair_rail 0,40 34,26 c7
      poly steps_d 292,100 320,100 320,118 292,118 0
      line steps_1 292,104 320,104 c8
      line steps_2 296,109 320,109 c8
      line steps_3 300,114 320,114 c8
      rect lamp_post 156,32,6,10 8
      ellipse lamp_glow 159,40,16,8 mix:,14@0.25
    `,
    cycles: [{ name: "the hub lamp", areas: ["lamp_glow"], colors: [14, 6], style: "flicker", ms: [900, 1800] }],
    overlays: [{ object: "badge", at: [196, 108] }, { object: "cat", at: [100, 106] }]
  },

  // ---- CLINIC: from above, the tiled floor with the spike plate; the cot at the top left --------------------------------------------
  "tb-clinic": {
    version: 1,
    draw: `
      rect tiles 0,0,320,136 stripes:15,11
      rect tile_cols 0,0,320,136 mix:,3@0.12
      line grout1 0,34 320,34 c3
      line grout2 0,68 320,68 c3
      line grout3 0,102 320,102 c3
      line grout4 80,0 80,136 c3
      line grout5 160,0 160,136 c3
      line grout6 240,0 240,136 c3
      rect cot 18,10,70,36 7 e8
      rect blanket 22,14,40,28 9 e0
      rect pillow 66,14,18,28 15 e8
      rect cabinet 244,8,56,30 8 e0
      line cabinet_top 244,16 300,16 c7
      rect vent 140,6,34,18 8 e0
      line vent_1 144,10 170,10 c15
      line vent_2 144,15 170,15 c15
      line vent_3 144,20 170,20 c15
      rect plate 96,64,128,60 7 e0
      poly plate_in 104,72 216,72 216,116 104,116 8
      dots spikes_a 112,80 124,80 136,80 148,80 160,80 172,80 184,80 196,80 208,80 c15
      dots spikes_b 118,92 130,92 142,92 154,92 166,92 178,92 190,92 202,92 c15
      dots spikes_c 112,104 124,104 136,104 148,104 160,104 172,104 184,104 196,104 208,104 c15
      dots rust 130,80 172,92 196,104 c4
    `,
    overlays: [{ object: "pill", at: [40, 20] }]
  },

  // ---- LAB: a bench of cables, the lever tall on the right with its green lamp, a socket, a dial, the radio ---------------------------
  "tb-lab": {
    version: 1,
    draw: `
      rect wall 0,0,320,96 fade:2,10/0,0/0,96
      rect floor 0,96,320,40 fade:8,0/0,96/0,136
      line - 0,96 320,96 c0
      rect shelf 20,54,70,5 6 e0
      rect radio 34,38,36,16 8 e0
      ellipse radio_dial 46,46,5,5 7
      line radio_wire 70,46 96,34 96,10 c0
      line cable_a 0,70 60,80 120,76 190,90 c8
      line cable_b 320,64 260,80 200,74 150,92 c0
      line cable_c 0,86 80,92 150,88 c8
      rect bench 0,96,320,12 6 e0
      rect slot 238,44,24,52 7 e0
      rect slot_in 246,50,8,40 0
      poly lever_arm 250,86 258,14 262,14 254,86 7 e0
      ellipse lever_knob 260,12,8,8 4 e0
      ellipse lever_lamp 250,34,6,6 2 e0
      rect socket 188,70,30,24 8 e0
      rect socket_in 196,76,14,12 0
      dots contacts 200,82 206,82 c14
      ellipse dial 134,62,16,16 7 e0
      poly dial_hand 134,62 140,50 142,52 136,64 0
      dots dial_marks 120,62 122,52 134,46 146,52 148,62 c0
      ellipse button 90,74,9,9 10 e0
      ellipse button_glow 90,74,14,12 mix:,10@0.2
      rect door 6,60,26,48 8 e0
    `,
    overlays: []
  },

  // ---- THE BAR: a silhouette: Dot behind the counter against the stove's red glow; ice trough by the door ----------------------------
  "tb-bar": {
    version: 1,
    draw: `
      rect wall 0,0,320,84 fade:0,4/0,0/0,84
      rect floor 0,84,320,52 fade:4,0/0,84/0,136
      ellipse stove_glow 58,70,60,40 mix:,12@0.35
      rect stove 24,58,44,34 8 e0
      rect stove_door 34,70,24,16 4 e0
      rect stove_fire 38,74,16,8 14
      rect stove_pipe 44,24,8,34 8 e0
      poly dot_body 108,84 112,50 132,50 136,84 0
      ellipse dot_head 122,40,9,11 0
      poly dot_apron 112,60 132,60 134,84 110,84 mix:0,15@0.3
      rect counter 84,84,160,10 6 e0
      rect counter_front 84,94,160,36 mix:6,0@0.4 e0
      rect barrel_l 96,98,24,30 6 e0
      rect barrel_r 196,98,24,30 6 e0
      rect stool 150,102,14,4 6 e0
      rect stool_leg 156,106,2,22 0
      rect trough 252,92,56,26 15 e7
      rect ice 256,96,48,18 mix:11,15@0.4 e11
      poly ice_pile 262,96 272,88 284,96 mix:11,15@0.5
      line ice_glint 270,100 292,106 c15
      rect door 276,22,32,62 8 e0
      line door_gap 276,40 308,40 c0
    `,
    cycles: [{ name: "the stove", areas: ["stove_fire", "stove_glow"], colors: [12, 14], style: "flicker", ms: [400, 900] }],
    overlays: [{ object: "coin", at: [188, 70] }, { object: "green", at: [160, 68] }]
  },

  // ---- THE OFFICE: close up, the high desk across the frame, Mrs Oduya behind it with the open ledger ----------------------------------
  "tb-office": {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:6,0/0,0/0,136
      rect frame 244,14,48,36 14 e6
      rect frame_in 250,20,36,24 15 e0
      dots frame_text 256,32 262,32 268,32 274,32 280,32 c0
      line dust 244,13 292,13 c7
      poly woman_body 110,136 118,70 170,70 182,136 7 e8
      ellipse woman_head 144,52,14,16 6 e0
      poly woman_hair 130,46 144,34 158,46 156,40 144,30 132,40 0
      poly cardigan 112,136 118,76 142,80 142,136 mix:8,7@0.4
      rect desk 20,96,240,40 6 e0
      rect desk_top 14,92,252,8 15 e6
      poly ledger_l 60,94 130,86 150,92 80,100 15 e0
      poly ledger_r 150,92 220,86 240,94 170,100 15 e0
      line ledger_cols_l 70,94 134,90 c0
      line ledger_cols_l2 76,97 138,93 c7
      line ledger_cols_r 156,92 226,90 c0
      line ledger_cols_r2 160,95 232,93 c7
      line pen 196,84 222,76 c0
      dots ink 210,80 c0
    `,
    overlays: []
  },

  // ---- BEDROOM: looking up at the pool of the lamp's light, a clock high on the right ---------------------------------------------------
  "tb-bedroom": {
    version: 1,
    draw: `
      rect dark 0,0,320,136 fade:0,1/0,0/0,136
      ellipse lamp_glow 150,70,20,16 mix:,14@0.4
      ellipse pool 150,110,110,24 mix:1,14@0.25
      rect table 126,102,48,6 6 e0
      rect table_leg_l 130,108,4,28 6
      rect table_leg_r 166,108,4,28 6
      rect lamp_base 144,92,12,10 6 e0
      poly lamp_shade 140,92 160,92 154,76 146,76 14 e0
      ellipse lamp_core 150,84,3,3 15
      poly bunk 0,136 0,96 100,90 100,136 5 e0
      rect bunk_blanket 4,104,92,14 7 e8
      rect bunk_pillow 6,98,22,8 15 e8
      line hammock_a 214,40 320,70 c6
      line hammock_b 214,40 240,86 320,92 c6
      poly hammock 224,70 320,76 320,98 236,92 mix:6,0@0.5 e6
      ellipse clock 260,22,18,18 15 e0
      line clock_h1 260,22 260,12 c0
      line clock_h2 260,22 268,26 c0
      dots clock_marks 260,6 260,38 244,22 276,22 c0
    `,
    cycles: [{ name: "the lamp", areas: ["lamp_core", "lamp_shade"], colors: [14, 6], style: "pingpong", ms: 2400 }],
    overlays: []
  },

  // ---- THE YARD: a wide, low scene: grey sky over a brick wall, the bench on the left, the gate on the right -----------------------------
  "tb-yard": {
    version: 1,
    draw: `
      rect sky 0,0,320,44 fade:7,8/0,0/0,44
      rect wall 0,44,320,30 mix:6,4@0.3 e0
      line brick_1 0,52 320,52 c8
      line brick_2 0,60 320,60 c8
      line brick_3 0,68 320,68 c8
      rect earth 0,74,320,62 fade:6,8/0,74/0,136
      rect bench_seat 28,84,64,6 6 e0
      rect bench_back 28,70,64,5 6 e0
      rect bench_leg_a 32,90,4,16 6
      rect bench_leg_b 84,90,4,16 6
      poly gate 246,74 246,36 306,36 306,74 0
      rect gate_bars 252,40,48,34 none e8
      line gate_bar_1 264,40 264,74 c8
      line gate_bar_2 276,40 276,74 c8
      line gate_bar_3 288,40 288,74 c8
      dots stones 120,100 150,114 200,96 180,120 70,118 c7
      line crack 100,128 140,112 180,124 c8
    `,
    overlays: [{ object: "cat", at: [150, 98] }, { object: "watchman", at: [206, 66] }, { object: "bird", at: [56, 112] }]
  },

  // ---- THE LANE: far away: a long lane going away between blank walls to one small lit window --------------------------------------------
  "tb-lane": {
    version: 1,
    draw: `
      rect sky 0,0,320,136 fade:0,8/0,0/0,62
      poly wall_l 0,0 150,50 150,76 0,136 mix:8,0@0.2 e0
      poly wall_r 320,0 170,50 170,76 320,136 mix:8,0@0.2 e0
      poly floor 0,136 150,76 170,76 320,136 fade:8,0/0,136/0,76
      rect end 150,50,20,26 0
      rect window 156,56,8,10 14 e6
      ellipse window_glow 160,62,14,10 mix:,14@0.25
      line brick_l1 0,40 150,56 c8
      line brick_l2 0,80 150,66 c8
      line brick_r1 320,40 170,56 c8
      line brick_r2 320,80 170,66 c8
      dots cobbles 90,110 130,98 160,92 200,104 240,118 60,124 c8
    `,
    cycles: [{ name: "the window", areas: ["window", "window_glow"], colors: [14, 6], style: "rotate", ms: 3000 }],
    overlays: [{ object: "cat", at: [92, 96] }, { object: "watchman", at: [136, 62] }, { object: "bird", at: [236, 100] }, { object: "clerk", at: [150, 46] }]
  },

  // ---- THE WAYS: a bare landing: the wheel on the back wall, the shutter on the right, the chute on the left, the guard in the doorway ----
  "tb-ways": {
    version: 1,
    draw: `
      rect wall 0,0,320,94 fade:3,0/0,0/0,94
      rect floor 0,94,320,42 fade:8,0/0,94/0,136
      line - 0,94 320,94 c0
      ellipse chute 40,56,24,26 0 e8
      ellipse chute_in 40,58,16,18 8
      ellipse chute_far 40,60,7,8 11
      rect shutter 252,26,58,66 7 e8
      line shutter_1 252,38 310,38 c8
      line shutter_2 252,50 310,50 c8
      line shutter_3 252,62 310,62 c8
      line shutter_4 252,74 310,74 c8
      rect shutter_sign 262,12,38,10 15 e0
      ellipse wheel 140,52,26,26 8 e7
      ellipse wheel_hub 140,52,8,8 7 e0
      line wheel_s1 114,52 166,52 c7
      line wheel_s2 140,26 140,78 c7
      line wheel_s3 122,34 158,70 c7
      line wheel_s4 158,34 122,70 c7
      rect guard_door 190,30,34,64 0 e8
      poly guard 198,94 200,56 216,56 218,94 8 e0
      ellipse guard_head 208,48,6,7 6 e0
      line guard_arm 198,66 188,78 c8
      rect ladder_l 98,0,3,60 6
      rect ladder_r 114,0,3,60 6
      line ladder_1 98,12 114,12 c6
      line ladder_2 98,28 114,28 c6
      line ladder_3 98,44 114,44 c6
      rect floor_mid 110,104,100,24 mix:8,0@0.5
      rect alarm 286,6,12,8 4 e0
    `,
    cycles: [{ name: "the alarm", areas: ["alarm"], colors: [4, 12], style: "blink", ms: 1200 }],
    overlays: [{ object: "pass", at: [62, 106] }]
  },

  // ---- THE ANNEX: down a long narrow room: shelves converging, the pole along the floor, the hook above ---------------------------------
  "tb-annex": {
    version: 1,
    draw: `
      rect back 120,40,80,60 mix:5,0@0.5 e0
      poly ceiling 0,0 320,0 200,40 120,40 fade:0,5/0,0/0,40
      poly floor 0,136 320,136 200,100 120,100 fade:5,0/0,136/0,100
      poly wall_l 0,0 120,40 120,100 0,136 mix:5,0@0.3
      poly wall_r 320,0 200,40 200,100 320,136 mix:5,0@0.3
      line shelf_l1 0,50 120,56 c5
      line shelf_l2 0,84 120,76 c5
      line shelf_r1 320,50 200,56 c5
      line shelf_r2 320,84 200,76 c5
      poly shelf_l1_top 0,50 120,56 120,60 0,56 6 e0
      poly shelf_l2_top 0,84 120,76 120,80 0,90 6 e0
      poly shelf_r1_top 320,50 200,56 200,60 320,56 6 e0
      poly shelf_r2_top 320,84 200,76 200,80 320,90 6 e0
      line hook_chain 160,0 160,36 c14
      ellipse hook_ring 160,38,4,4 none e14
      poly pole_shape 40,128 280,120 282,124 42,132 6 e0
      vp 160,70
      poly runner 140,136@1 180,136@1 180,136@0.55 140,136@0.55 3 e0
      line runner_seam 160,136@1 160,136@0.55 c11
      rect floor_glow 0,100,320,36 fade:,14/0,100/0,136
      dots dust 60,96 140,110 240,100 c7
    `,
    overlays: []
  },

  // ---- THE LANDING: looking up a narrow flight of stairs going into the dark; the rail across the front -----------------------------------
  "tb-landing": {
    version: 1,
    draw: `
      rect dark 0,0,320,136 fade:0,8/0,0/0,136
      poly stairs 124,136 196,136 176,30 144,30 7 e0
      line step_1 130,118 190,118 c8
      line step_2 134,100 186,100 c8
      line step_3 138,84 182,84 c8
      line step_4 141,70 179,70 c8
      line step_5 143,58 177,58 c8
      line step_6 145,48 175,48 c8
      line step_7 146,40 174,40 c8
      rect top 144,26,32,6 0
      poly wall_l 0,0 124,136 0,136 mix:8,0@0.4
      poly wall_r 320,0 196,136 320,136 mix:8,0@0.4
      rect rail 0,108,320,6 8 e7
      rect rail_post_a 20,108,4,28 8
      rect rail_post_b 296,108,4,28 8
    `,
    overlays: []
  },

  // ---- THE CHUTE: through something: the round steel mouth, a bright disc of earth at the far end ----------------------------------------
  "tb-chute": {
    version: 1,
    draw: `
      rect dark 0,0,320,136 0
      ellipse tube_1 160,68,150,64 8 e7
      ellipse tube_2 160,68,120,52 mix:8,7@0.4
      ellipse tube_3 160,70,86,38 8 e0
      ellipse tube_4 160,72,54,24 mix:8,0@0.5
      ellipse far 160,74,22,12 6 e14
      ellipse far_glow 160,74,30,16 mix:,14@0.2
      line seam_1 40,40 120,60 c7
      line seam_2 280,40 200,60 c7
      line seam_3 50,100 124,86 c7
      line seam_4 270,100 196,86 c7
      rect handle 14,60,14,26 7 e0
    `,
    overlays: []
  },

  // ---- THE CLOSET: close up: bare boards, a strip of light under the door -----------------------------------------------------------------
  "tb-closet": {
    version: 1,
    draw: `
      rect boards 0,0,320,136 stripes:6,0
      rect boards_dim 0,0,320,136 mix:,0@0.45
      line board_1 40,0 40,136 c0
      line board_2 120,0 120,136 c0
      line board_3 200,0 200,136 c0
      line board_4 280,0 280,136 c0
      rect door 110,20,100,116 6 e0
      rect door_light 114,128,92,4 14
      ellipse knob 196,80,4,4 14 e6
      dots nails 128,40 128,100 196,40 c8
    `,
    overlays: []
  },

  // ---- THE PIT: looking up from its floor: a bright square of light high above, earth walls closing in ---------------------------------------
  "tb-pit": {
    version: 1,
    draw: `
      rect dark 0,0,320,136 fade:6,0/0,136/0,0
      poly wall_l 0,0 120,34 120,102 0,136 mix:6,0@0.4 e0
      poly wall_r 320,0 200,34 200,102 320,136 mix:6,0@0.4 e0
      poly wall_back 120,34 200,34 200,102 120,102 mix:6,0@0.55
      rect sky 120,34,80,68 fade:11,15/0,34/0,102
      line edge_a 120,34 200,34 c14
      dots roots 40,60 60,90 270,50 250,100 c2
      rect floor 0,126,320,10 mix:6,0@0.3
    `,
    overlays: []
  },

  // ---- THE ROOF: wide landscape: the parapet in the lower third, the grid of the floor far below like a plan ----------------------------------
  "tb-roof": {
    version: 1,
    draw: `
      rect sky 0,0,320,28 fade:9,11/0,0/0,28
      rect city 0,28,320,70 fade:1,8/0,28/0,98
      rect grid_a 20,40,50,36 none e7
      rect grid_b 80,40,50,36 none e7
      rect grid_c 140,40,50,36 none e7
      rect grid_d 200,40,50,36 none e7
      rect grid_e 260,40,50,36 none e7
      rect grid_f 50,78,50,16 none e7
      rect grid_g 140,78,50,16 none e7
      rect grid_h 230,78,50,16 none e7
      ellipse hub 165,58,8,6 15
      line paths 70,58 140,58 190,58 260,58 c14
      poly parapet 0,136 0,100 320,100 320,136 7 e0
      rect cap 0,98,320,6 8 e0
      line brick 0,112 320,112 c8
      line brick_2 0,124 320,124 c8
      ellipse sun 276,12,10,8 14
    `,
    overlays: []
  },

  // ---- THE CELLAR: low stone, the round vault door on the right third, the pantry door on the left, the boat in the middle -----------------
  "tb-cellar": {
    version: 1,
    draw: `
      rect wall 0,0,320,92 fade:8,0/0,0/0,92
      rect floor 0,92,320,44 fade:8,0/0,92/0,136
      line - 0,92 320,92 c0
      line stone_1 0,24 320,24 c0
      line stone_2 0,48 320,48 c0
      line stone_3 0,70 320,70 c0
      line joint_1 60,0 60,24 c0
      line joint_2 150,24 150,48 c0
      line joint_3 230,48 230,70 c0
      ellipse vault 262,60,36,36 8 e7
      ellipse vault_in 262,60,28,28 7 e8
      ellipse vault_wheel 262,60,10,10 8 e0
      line vault_spoke_1 252,60 272,60 c0
      line vault_spoke_2 262,50 262,70 c0
      ellipse vault_key 262,86,3,3 14
      rect pantry_door 24,40,34,52 6 e0
      dots pantry_knob 52,68 c14
      poly boat 100,100 180,100 172,120 108,120 6 e0
      line boat_rim 100,100 180,100 c14
      rect boat_blocks 112,120,56,8 8 e0
      rect chest 190,102,40,26 6 e0
      line chest_band 190,112 230,112 c0
      rect chest_lock 206,108,8,8 14 e0
      rect shelf 84,30,60,5 6 e0
      rect box 96,22,22,8 6 e0
      rect bin 126,12,16,18 6 e0
      rect water 0,128,320,8 mix:1,0@0.5
    `,
    cycles: [{ name: "the floor's water", areas: ["water"], colors: [1, 9], style: "rotate", ms: 2800 }],
    overlays: []
  },

  // ---- THE VAULT: close up: brushed steel in two tones, the open door a dark disc at the left ------------------------------------------------
  "tb-vault": {
    version: 1,
    draw: `
      rect steel 0,0,320,136 fade:15,7/0,0/0,136
      rect panel_a 0,0,320,136 stripes:15,7
      rect panel_dim 0,0,320,136 mix:,15@0.35
      line seam_a 80,0 80,136 c8
      line seam_b 240,0 240,136 c8
      line seam_c 0,100 320,100 c8
      ellipse door_open 36,66,40,52 0 e7
      ellipse door_in 40,66,30,44 8
      ellipse door_light 50,66,12,32 mix:8,15@0.5
      rect floor_shadow 0,100,320,36 mix:7,0@0.2
      ellipse spot 180,114,60,8 mix:,15@0.4
    `,
    overlays: [{ object: "tin", at: [168, 104] }]
  },

  // ---- THE PANTRY: from above: two shelves laid flat in a narrow room, the jar on the lower one -------------------------------------------
  "tb-pantry": {
    version: 1,
    draw: `
      rect floor 0,0,320,136 stripes:6,0
      rect floor_dim 0,0,320,136 mix:,0@0.5
      rect shelf_a 24,14,272,40 6 e0
      rect shelf_b 24,76,272,40 6 e0
      line grain_a 28,26 292,26 c0
      line grain_b 28,40 292,40 c0
      line grain_c 28,88 292,88 c0
      line grain_d 28,102 292,102 c0
      ellipse jar 150,96,14,14 11 e3
      ellipse jar_lid 150,96,8,8 3 e0
      dots webs 34,20 40,26 286,22 280,30 40,82 46,90 c7
      line web_a 24,14 60,14 24,48 c7
      line web_b 296,14 260,14 296,48 c7
      rect slit 292,0,20,136 mix:,15@0.3
    `,
    overlays: []
  }
};

// ---- The endings: each the strongest shot of its kind, close up or from far above; no overlays, no edits ---------------------------------------
export const endings = {
  // The lever thrown over: a steel slot, a lit green lamp, a thick white-yellow spark line running along a cable.
  lit: {
    version: 1,
    draw: `
      rect dark 0,0,320,136 fade:0,1/0,0/0,136
      ellipse glow 160,68,150,60 mix:,14@0.25
      rect slot 40,90,70,26 7 e0
      rect slot_in 52,98,46,10 0
      poly lever 84,98 150,40 160,46 94,106 8 e0
      ellipse knob 156,40,12,12 4 e0
      ellipse lamp 60,60,10,10 10 e15
      line cable_a 130,100 190,96 250,104 320,98 c8
      line sparks 130,100 150,88 170,102 190,86 210,100 230,84 250,98 c14
      line sparks_core 130,100 150,88 170,102 190,86 210,100 230,84 250,98 c15
      dots dots_a 140,76 180,70 220,72 260,86 c14
      dots dots_b 170,60 200,50 240,60 c15
    `,
    cycles: [{ name: "the sparks", areas: ["sparks", "glow"], colors: [14, 15], style: "flicker", ms: [80, 200] }]
  },
  // The ledger open on the desk, a column of names, the last one just written, a pen resting beside it.
  named: {
    version: 1,
    draw: `
      rect desk 0,0,320,136 fade:6,0/0,0/0,136
      poly page_l 20,30 156,20 156,120 24,126 15 e0
      poly page_r 164,20 300,30 296,126 164,120 15 e0
      line spine 160,20 160,122 c7
      line row_l1 36,44 146,40 c8
      line row_l2 36,58 146,54 c8
      line row_l3 36,72 146,68 c8
      line row_l4 36,86 146,82 c8
      line row_l5 36,100 146,96 c8
      line name_l1 40,44 90,43 c0
      line name_l2 40,58 110,57 c0
      line name_l3 40,72 80,71 c0
      line name_l4 40,86 120,85 c0
      line row_r1 176,40 284,44 c8
      line row_r2 176,54 284,58 c8
      line row_r3 176,68 284,72 c8
      line row_r4 176,82 284,86 c8
      line name_r1 180,40 230,41 c0
      line name_r2 180,54 240,55 c0
      line name_r3 180,68 250,69 c0
      line last_name 180,82 262,86 c1
      line pen 236,120 296,98 c0
      ellipse nib 238,119,3,3 14
    `
  },
  // From far above: the flat grey roof, a parapet at one edge, the street far below, one small dark figure at the very edge.
  fell: {
    version: 1,
    draw: `
      rect street 0,0,320,136 fade:8,0/0,0/0,136
      rect road 0,10,320,26 stripes:8,7
      rect road_dim 0,10,320,26 mix:,0@0.4
      line lane_1 0,23 320,23 c14
      rect roof 40,56,240,66 7 e0
      rect roof_dim 40,56,240,66 mix:,8@0.3
      rect parapet_n 40,56,240,5 8 e0
      rect parapet_s 40,117,240,5 8 e0
      rect parapet_w 40,56,5,66 8 e0
      rect parapet_e 275,56,5,66 8 e0
      line seam_1 120,61 120,117 c8
      line seam_2 200,61 200,117 c8
      poly figure 150,66 156,66 156,76 150,76 0
      ellipse figure_head 153,63,3,3 0
      ellipse shadow 154,80,6,2 mix:7,0@0.5
    `
  },
  // The spike plate, close up: short steel spikes in rows on a white floor, one red drop on the nearest.
  died: {
    version: 1,
    draw: `
      rect floor 0,0,320,136 fade:15,7/0,0/0,136
      rect plate 30,20,260,96 8 e0
      rect plate_in 40,30,240,76 mix:8,0@0.5
      poly spike_a1 70,100 80,56 90,100 7 e0
      poly spike_a2 130,100 140,56 150,100 7 e0
      poly spike_a3 190,100 200,56 210,100 7 e0
      poly spike_a4 250,100 260,56 270,100 7 e0
      poly spike_b1 100,70 108,40 116,70 15 e0
      poly spike_b2 160,70 168,40 176,70 15 e0
      poly spike_b3 220,70 228,40 236,70 15 e0
      ellipse drop 140,52,4,6 4
      line drop_trail 140,58 140,98 c4
      ellipse puddle 140,100,10,3 4
    `
  }
};

// ---- Visions: what the hammock shows ------------------------------------------------------------------------------------------------------
export const visions = {
  // From far above, the test floor as a plan: every room a lit square on a grid, the hub's brighter than the rest.
  hammock_dream: {
    version: 1,
    draw: `
      rect night 0,0,320,136 fade:0,1/0,0/0,136
      rect room_a 36,20,48,34 mix:1,14@0.35 e9
      rect room_b 136,20,48,34 mix:1,14@0.35 e9
      rect room_c 236,20,48,34 mix:1,14@0.35 e9
      rect room_d 36,82,48,34 mix:1,14@0.35 e9
      rect room_e 236,82,48,34 mix:1,14@0.35 e9
      rect hub 136,50,48,38 15 e14
      line way_a 84,37 136,37 c14
      line way_b 184,37 236,37 c14
      line way_c 160,54 160,88 c14
      line way_d 60,54 60,82 160,70 c14
      line way_e 260,54 260,82 160,70 c14
      ellipse hub_glow 160,69,40,26 mix:,15@0.15
    `
  }
};
