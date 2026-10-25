// Pictures for "Hartley's, After Hours" (worlds/hartleys/world.en.js), one per room, the way the AI writes them
// (ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front in the short notation, ids on what the
// text names and on what the story may change (the roof door opens).

export default {
  // ---- THE ARCADE (the opening): looking up from its floor, horizon 116; a glass roof over lit windows, the blind end wall and the door; lead blue --
  pavement: {
    version: 1,
    draw: `
      rect sky 0,0,320,136 fade:1,0/0,0/0,136
      poly roof 0,0 320,0 262,44 150,44 fade:9,5/0,0/0,44
      dots - 58,4 124,9 196,3 246,12 104,24 c15
      line - 41,12 304,12 c0
      line - 89,26 290,26 c0
      line - 123,36 273,36 c0
      line - 80,0 175,44 c0
      line - 160,0 206,44 c0
      line - 240,0 237,44 c0
      poly wall_l 0,0 150,44 150,116 0,136 fade:0,1/20,0/150,0
      poly wall_r 320,0 262,44 262,116 320,136 fade:0,1/300,0/262,0
      rect facade 150,44,112,72 mix:1,0@0.3
      poly floor 150,116 262,116 320,136 0,136 fade:1,0/0,116/0,136
      line - 0,136 150,116 c8
      line - 178,116 128,136 c8
      line - 206,116 206,136 c8
      line - 234,116 284,136 c8
      line - 262,116 320,136 c8
      poly window_l1 6,30 68,50 68,93 6,100 mix:14,15@0.2 e0
      poly window_l2 84,54 130,66 130,96 84,94 mix:14,15@0.2 e0
      poly window_r1 314,32 266,52 266,93 314,100 mix:14,15@0.2 e0
      ellipse head_l1 16,50,3,4 0
      poly dress_l1 13,56 19,56 19,70 24,98 8,98 13,70 4 e0
      ellipse head_l2 56,58,3,3 0
      poly dress_l2 53,64 59,64 58,76 62,96 50,96 54,76 1 e0
      ellipse head_l3 98,66,2,2 0
      poly dress_l3 96,70 100,70 100,78 103,94 93,94 96,78 5 e0
      ellipse head_r1 304,52,3,4 0
      poly dress_r1 301,58 307,58 307,72 312,98 296,98 301,72 2 e0
      ellipse head_r2 290,57,3,3 0
      poly dress_r2 287,62 293,62 292,74 297,95 283,95 288,74 5 e0
      ellipse head_r3 277,62,2,3 0
      poly dress_r3 275,66 279,66 279,76 283,93 271,93 275,76 4 e0
      poly sill_l 2,100 130,94 130,97 2,105 7 e0
      poly sill_r 319,100 260,93 260,96 319,106 7 e0
      ellipse door_glow 210,100,38,22 mix:,11@0.22
      rect nameplate 178,47,64,8 0 e14
      line - 184,51 236,51 c14
      ellipse canopy 210,60,24,5 6 e14
      rect door_surround 188,62,44,54 0 e14
      rect door_glass 192,66,36,50 mix:11,3@0.45
      line leaf_v 210,66 210,116 c14
      line leaf_h 192,92 228,92 c14
      rect step 184,116,52,3 7 e0
      ellipse door_spill 210,124,30,5 mix:,11@0.2
      line - 165,60 165,67 c6
      ellipse lamp_glow 165,76,13,10 mix:,14@0.25
      ellipse lamp 165,76,3,3 14
    `,
    cycles: [
      { name: "the wall lamp", areas: ["lamp"], colors: [14, 6], style: "flicker", ms: [900, 4500] },
      { name: "the door turning", areas: ["door_glass"], colors: [11, 3], style: "pingpong", ms: 1600 }
    ],
    overlays: [
      { object: "wireless", at: [46, 88], alt: "A small cream wireless sits on the sill." },
      { object: "mints", at: [30, 89], alt: "A paper bag of peppermints sits on the sill." }
    ]
  },

  // ---- HARTLEY'S: eye level, looking across the hall to the revolving door; the mosaic underfoot -------------------
  front_hall: {
    version: 1,
    draw: `
      rect ceiling 0,0,320,24 fade:6,0/0,24/0,0
      ellipse chandelier 160,10,22,6 mix:14,6@0.4 e6
      dots - 146,14 154,16 166,16 174,14 c15
      rect wall 0,24,320,70 fade:6,4/0,24/0,94
      rect - 0,24,40,70 mix:6,0@0.5
      rect - 280,24,40,70 mix:6,0@0.5
      rect revolving_door 128,34,64,58 mix:8,3@0.4 e6
      line door_leaf 160,34 160,92 c6
      line door_leaf2 136,38 184,88 c6
      rect - 124,30,72,6 6 e0
      rect floor 0,94,320,42 mix:6,8@0.5
      ellipse mosaic 160,116,92,14 mix:1,15@0.35 e6
      poly ship 140,118 180,118 172,124 148,124 6
      line - 160,104 160,118 c15
      poly - 161,105 172,114 161,114 15
      rect counter_l 0,74,96,20 6 e0
      rect - 0,74,96,3 14
      rect counter_r 224,74,96,20 6 e0
      rect - 224,74,96,3 14
      rect directory 60,50,26,34 0 e14
      line - 64,56 82,56 c14
      line - 64,62 80,62 c14
      line - 64,68 82,68 c14
      line - 64,74 78,74 c14
      line - 72,84 72,96 c6
      rect gage 238,40,16,40 0
      ellipse gage_head 246,34,6,7 6
      dots carnation 250,46 c12
      line - 240,80 240,96 c0
      line - 252,80 252,96 c0
    `,
    cycles: [{ name: "the door turning", areas: ["revolving_door"], colors: [3, 11], style: "pingpong", ms: 1600 }]
  },

  // ---- PERFUMERY: close-up across the counter; bottles in rows like a choir, the tester at the front ----------------
  perfumery: {
    version: 1,
    draw: `
      rect back 0,0,320,136 fade:5,0/0,0/0,136
      rect shelf1 20,20,280,4 7
      rect shelf2 20,50,280,4 7
      rect - 20,0,4,80 6
      rect - 296,0,4,80 6
      rect bottles 30,8,40,12 mix:13,11@0.5
      rect - 76,10,36,10 mix:14,12@0.5
      rect - 118,6,30,14 mix:9,15@0.5
      rect - 196,8,40,12 mix:10,11@0.5
      rect - 242,10,46,10 mix:13,15@0.5
      rect - 30,38,50,12 mix:11,9@0.5
      rect - 90,36,40,14 mix:12,13@0.5
      rect - 200,38,40,12 mix:14,10@0.5
      rect - 248,36,40,14 mix:15,9@0.5
      rect corre 150,16,28,62 15
      ellipse corre_head 164,10,8,9 7 e8
      poly - 150,30 140,60 146,62 154,36 15
      poly - 178,30 188,60 182,62 174,36 15
      rect counter 0,80,320,56 mix:6,0@0.35 e0
      rect - 0,80,320,4 7
      ellipse tester 160,104,10,13 mix:11,15@0.5 e7
      rect - 156,86,8,6 14
      ellipse - 170,90,4,4 4 e0
      rect - 150,110,20,4 15
    `,
    cycles: [{ name: "the tester", areas: ["tester"], colors: [11, 3], style: "pingpong", ms: 1800 }]
  },

  // ---- GLOVES: looking up at a wall of small drawers; one glove on the counter, close ------------------------------
  gloves: {
    version: 1,
    draw: `
      rect drawers 0,0,320,96 6
      line - 0,16 320,16 c0
      line - 0,32 320,32 c0
      line - 0,48 320,48 c0
      line - 0,64 320,64 c0
      line - 0,80 320,80 c0
      line - 40,0 40,96 c0
      line - 80,0 80,96 c0
      line - 120,0 120,96 c0
      line - 160,0 160,96 c0
      line - 200,0 200,96 c0
      line - 240,0 240,96 c0
      line - 280,0 280,96 c0
      dots - 20,8 60,8 100,8 140,8 180,8 220,8 260,8 300,8 20,24 60,24 100,24 140,24 180,24 220,24 260,24 300,24 20,40 60,40 100,40 140,40 180,40 220,40 260,40 300,40 20,56 60,56 100,56 140,56 180,56 220,56 260,56 300,56 20,72 60,72 100,72 140,72 180,72 220,72 260,72 300,72 20,88 60,88 100,88 140,88 180,88 220,88 260,88 300,88 c14
      rect - 120,48,40,16 mix:6,15@0.4
      rect counter 0,96,320,40 mix:6,0@0.3 e0
      rect - 0,96,320,3 14
      rect card 40,104,34,16 15 e0
      line - 44,110 70,110 c8
      line - 44,114 64,114 c8
      poly glove 150,124 196,124 204,116 200,108 190,106 178,104 160,106 150,112 15 e7
      line - 178,104 186,114 c7
      line - 168,106 176,116 c7
      line - 160,108 168,118 c7
    `
  },

  // ---- THE LIFTS: eye level, square on; brass doors, the half-moon indicator, stairs up and steps down -------------
  lift_lobby: {
    version: 1,
    draw: `
      rect wall 0,0,320,104 mix:6,0@0.45
      rect floor 0,104,320,32 mix:15,8@0.5
      ellipse indicator 160,18,26,12 14 e8
      rect - 132,18,56,12 mix:6,0@0.45
      line - 160,18 178,8 c0
      dots - 140,14 148,8 158,6 172,8 c0
      rect lift_frame 116,30,88,74 14 e6
      rect lift_doors 122,36,76,68 0
      line gate 126,36 126,104 c6
      line - 136,36 136,104 c6
      line - 184,36 184,104 c6
      line - 194,36 194,104 c6
      rect - 140,50,40,46 mix:15,6@0.2
      poly stairs 230,104 320,30 320,104 mix:6,4@0.4 e0
      line - 250,88 320,30 c0
      line - 270,104 320,62 c0
      line banister 228,96 320,22 c14
      poly steps 0,104 0,70 70,104 0
      line - 0,80 50,104 c8
      line - 0,90 30,104 c8
    `,
    cycles: [{ name: "indicator", areas: ["indicator"], colors: [14, 6], style: "pingpong", ms: 2200 }]
  },

  // ---- THE LIFT: inside, looking at Mr Pell and the lever; the gate folded behind ----------------------------------
  lift: {
    version: 1,
    draw: `
      rect walls 0,0,320,136 fade:4,0/0,0/0,136
      rect mirror 30,16,90,60 mix:7,9@0.4 e6
      ellipse - 75,46,12,16 mix:8,7@0.5
      rect bench 20,88,120,18 4 e0
      rect - 20,86,120,4 12
      rect - 24,106,6,22 6
      rect - 130,106,6,22 6
      rect lever_plate 230,30,50,30 14 e6
      line lift_lever 255,58 272,36 c0
      ellipse - 272,36,3,3 0
      dots - 236,36 244,32 256,30 268,32 276,36 c0
      rect pell 188,58,26,44 4
      line - 188,70 214,70 c14
      ellipse pell_head 201,50,8,9 6
      rect - 192,40,18,6 4 e0
      rect stool 190,102,22,4 6
      line - 194,106 194,128 c6
      line - 208,106 208,128 c6
      rect floor 0,128,320,8 mix:0,6@0.4
      line gate 300,0 300,136 c14
      line - 308,0 308,136 c14
      line - 300,20 308,30 c14
      line - 300,60 308,70 c14
      line - 300,100 308,110 c14
    `
  },

  // ---- FIRST FLOOR: from above the stairwell, looking down on the landing; the palm in its pot ---------------------
  first_landing: {
    version: 1,
    draw: `
      rect floor 0,0,320,136 mix:4,0@0.5
      rect carpet 90,0,140,136 4
      line - 96,0 96,136 c14
      line - 224,0 224,136 c14
      ellipse - 160,68,40,30 mix:4,12@0.3
      rect stairwell 120,90,80,46 0
      line banister 116,88 204,88 c6
      line - 116,88 116,136 c6
      line - 204,88 204,136 c6
      line - 124,100 196,100 c8
      line - 124,112 196,112 c8
      line - 124,124 196,124 c8
      ellipse pot 254,40,16,12 14 e6
      ellipse palm 254,30,30,18 mix:2,10@0.4
      line - 254,30 230,14 c2
      line - 254,30 280,16 c2
      line - 254,30 254,8 c2
      rect arch_w 0,30,30,60 0
      rect arch_e 290,96,30,40 0
    `
  },

  // ---- HABERDASHERY: eye level; ribbons, the counter, the brass tubes rising into the ceiling -----------------------
  haberdashery: {
    version: 1,
    draw: `
      rect wall 0,0,320,90 mix:6,15@0.25
      rect - 0,0,320,10 6
      rect ribbons 20,30,100,40 6
      ellipse - 34,42,10,10 12
      ellipse - 58,42,10,10 9
      ellipse - 82,42,10,10 14
      ellipse - 106,42,10,10 10
      ellipse - 34,62,8,8 13
      ellipse - 58,62,8,8 11
      ellipse - 82,62,8,8 15
      ellipse - 106,62,8,8 4
      line tubes 200,0 200,60 c14
      line - 216,0 216,60 c14
      line - 232,0 232,54 c14
      line - 200,60 216,60 c14
      line - 260,0 260,40 c6
      rect cradle 192,60,32,8 6 e0
      rect canister 198,62,20,8 14 e6
      line handle 236,54 236,78 c6
      rect - 232,78,8,6 6 e0
      rect thimble 136,34,26,44 1
      ellipse thimble_head 149,28,7,8 6
      line - 140,40 158,40 c14
      rect floor 0,90,320,46 mix:6,8@0.5
      rect counter 0,78,320,24 6 e0
      rect - 0,78,320,3 14
      line - 10,80 110,80 c7
    `,
    cycles: [{ name: "the tubes", areas: ["tubes"], colors: [14, 6], style: "rotate", ms: 700 }]
  },

  // ---- TOYS: close to the table, the train set going round; the bear on its shelf behind --------------------------
  toys: {
    version: 1,
    draw: `
      rect wall 0,0,320,80 mix:2,0@0.5
      rect shelf 190,40,120,4 6
      rect soldiers 20,48,90,24 0
      dots - 26,52 34,52 42,52 50,52 58,52 66,52 74,52 82,52 90,52 98,52 c4
      dots - 26,62 34,62 42,62 50,62 58,62 66,62 74,62 82,62 90,62 98,62 c4
      ellipse bear 240,28,12,12 6 e0
      ellipse - 240,14,8,8 6 e0
      ellipse - 233,8,3,3 4
      ellipse - 247,8,3,3 6
      dots - 237,13 243,13 c0
      rect table 0,80,320,56 6
      ellipse train_track 160,108,120,20 none e8
      ellipse - 160,108,110,16 none e8
      rect train 210,110,30,10 4 e0
      rect - 242,112,16,8 1 e0
      rect - 260,112,16,8 2 e0
      dots train_lights 212,112 218,112 c14
    `,
    cycles: [{ name: "train", areas: ["train_lights"], colors: [14, 6], style: "blink", ms: 600 }]
  },

  // ---- SECOND FLOOR: looking up the short flight to the roof door ---------------------------------------------------
  second_landing: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 mix:7,8@0.6
      rect carpet 0,108,320,28 mix:4,8@0.4
      poly flight 110,108 210,108 196,40 124,40 mix:4,0@0.45 e0
      line - 120,92 200,92 c0
      line - 122,76 198,76 c0
      line - 124,60 196,60 c0
      rect roof_door 136,6,48,34 2 e0
      rect - 142,12,36,10 15 e0
      dots - 178,26 c14
      rect arch_w 0,40,50,68 0
      rect arch_e 270,40,50,68 0
      line - 100,108 124,40 c6
      line - 220,108 196,40 c6
    `
  },

  // ---- FURNITURE: wide, a floor of rooms without walls; the sofa in front ------------------------------------------
  furniture: {
    version: 1,
    draw: `
      rect back 0,0,320,70 fade:8,0/0,0/0,70
      rect floor 0,70,320,66 mix:6,8@0.55
      rect dining 20,52,70,8 6 e0
      line - 26,60 26,72 c6
      line - 84,60 84,72 c6
      rect - 26,38,10,14 4
      rect - 74,38,10,14 4
      rect bed 120,48,80,18 15 e7
      rect - 120,40,14,26 6
      ellipse lamp 216,40,8,6 14
      line - 216,46 216,62 c6
      rect - 210,62,12,6 6
      poly sofa 70,128 250,128 250,100 230,96 90,96 70,100 2 e0
      rect - 70,92,20,36 2 e0
      rect - 230,92,20,36 2 e0
      ellipse dent 140,108,26,6 mix:2,0@0.5
    `
  },

  // ---- TEA ROOM: silhouette of Dot against the big window and the roofs -------------------------------------------
  tea_room: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 mix:6,0@0.55
      rect window 40,10,240,80 fade:9,1/0,10/0,90 e6
      poly roofs 40,90 40,66 70,60 90,70 120,56 150,66 180,52 210,64 240,58 280,68 280,90 8
      rect - 96,40,6,22 8
      rect - 196,34,6,24 8
      line - 160,10 160,90 c6
      line - 40,50 280,50 c6
      rect floor 0,96,320,40 mix:15,7@0.5
      ellipse table1 60,112,26,6 15 e7
      ellipse table2 260,112,26,6 15 e7
      poly dot 140,96 172,96 176,128 136,128 0
      ellipse dot_head 156,84,8,9 0
      rect - 150,77,12,4 15
      poly teapot 176,92 192,92 196,102 172,102 7 e0
      ellipse palm_l 14,70,18,26 mix:2,0@0.5
      ellipse palm_r 306,70,18,26 mix:2,0@0.5
      ellipse trolley 230,96,14,8 7 e0
    `
  },

  // ---- COATS: the row of mannequins, square on, facing you ----------------------------------------------------------
  coats: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:8,0/0,0/0,136
      line rail 0,28 320,28 c7
      rect coats_l 0,30,36,60 mix:1,8@0.5
      rect coats_r 284,30,36,60 mix:4,8@0.5
      rect floor 0,110,320,26 mix:8,0@0.5
      ellipse m1_head 70,36,7,8 7
      rect mannequins 60,46,20,52 9
      ellipse m2_head 120,34,7,8 7
      rect - 110,44,20,54 4
      ellipse m3_head 170,36,7,8 7
      rect yours 160,46,20,52 6
      ellipse m4_head 220,34,7,8 7
      rect - 210,44,20,54 2
      ellipse m5_head 266,36,7,8 7
      rect - 256,46,20,52 8
      line - 66,98 66,112 c7
      line - 116,98 116,112 c7
      line - 166,98 166,112 c7
      line - 216,98 216,112 c7
      line - 262,98 262,112 c7
      rect - 164,56,8,4 15
    `
  },

  // ---- BASEMENT: looking down the steps at the brass cash office, the tubes coming down into it --------------------
  basement: {
    version: 1,
    draw: `
      rect ceiling 0,0,320,30 mix:8,0@0.6
      line - 120,0 140,40 c14
      line - 160,0 160,40 c14
      line - 200,0 180,40 c14
      line - 60,0 130,40 c6
      line - 260,0 190,40 c6
      rect wall 0,30,320,70 mix:7,8@0.5
      rect shelves 10,40,70,60 6
      line - 10,60 80,60 c0
      line - 10,80 80,80 c0
      ellipse - 30,54,8,4 8
      ellipse - 56,54,8,4 8
      line - 260,40 280,100 c6
      line - 270,40 296,100 c6
      rect cash_office 120,40,80,70 14 e6
      rect panes 128,48,64,50 mix:15,7@0.4
      line - 160,48 160,98 c14
      ellipse ruth 150,66,10,16 8
      ellipse - 150,50,5,6 8
      rect floor 0,100,320,36 mix:8,7@0.5
      poly steps 230,136 320,136 320,104 260,104 0
      line - 244,128 320,128 c8
      line - 252,118 320,118 c8
    `
  },

  // ---- ROOF GARDEN: wide, a skyline of roofs and chimneys; the bench with its back to you -------------------------
  roof_garden: {
    version: 1,
    draw: `
      rect sky 0,0,320,70 fade:0,1/0,0/0,70
      dots stars 20,8 70,20 130,6 210,14 260,24 300,6 c7
      poly roofs 0,90 0,62 30,58 50,66 80,50 110,60 140,46 170,58 200,48 240,60 270,52 300,62 320,56 320,90 8
      rect - 60,36,8,22 8
      rect - 150,30,6,20 8
      rect - 230,34,8,22 8
      poly spire 196,48 204,48 200,14 7
      ellipse smoke 154,24,10,4 mix:7,0@0.6
      rect parapet 0,90,320,10 7 e8
      rect floor 0,100,320,36 mix:7,8@0.5
      ellipse tub_l 40,104,18,8 6 e0
      line - 40,104 30,88 c2
      line - 40,104 48,86 c2
      ellipse tub_r 280,104,18,8 6 e0
      line - 280,104 272,88 c2
      line - 280,104 290,90 c2
      rect roof_bench 110,96,100,10 6 e0
      rect - 110,108,100,6 6 e0
      line - 116,114 116,128 c6
      line - 204,114 204,128 c6
    `,
    cycles: [{ name: "stars", areas: ["stars"], colors: [7, 15], style: "flicker", ms: [1500, 5000] }]
  },

  // ---- THE FOURTH FLOOR: looking down the long room of rails; the afternoon under its own lamp at the end ----------
  fourth_floor: {
    version: 1,
    draw: `
      rect back 0,0,320,136 0
      poly floor 0,136 120,70 200,70 320,136 mix:8,0@0.6
      poly ceiling 0,0 120,50 200,50 320,0 mix:8,0@0.8
      line rail_l 0,20 120,54 c7
      line rail_r 320,20 200,54 c7
      poly - 0,22 20,28 20,80 0,76 mix:9,8@0.5
      poly - 26,30 44,35 44,82 26,80 mix:7,8@0.5
      poly - 52,37 68,42 68,82 52,81 mix:1,8@0.5
      poly - 74,43 88,47 88,80 74,80 mix:3,8@0.5
      poly - 320,22 300,28 300,80 320,76 mix:13,8@0.5
      poly - 294,30 276,35 276,82 294,80 mix:2,8@0.5
      poly - 270,37 254,42 254,82 270,81 mix:4,8@0.5
      ellipse glow 160,60,30,22 mix:14,0@0.75
      line lamp 160,24 160,38 c7
      ellipse - 160,40,6,3 14
      poly afternoon 148,46 172,46 176,84 144,84 mix:11,14@0.4 e3
      line - 160,46 160,42 c7
      rect fitter 188,58,12,28 8
      ellipse - 194,52,5,6 7
      dots - 200,66 c12
    `,
    cycles: [{ name: "the afternoon", areas: ["afternoon", "glow"], colors: [14, 6], style: "pingpong", ms: 2000 }]
  }
};

// ---- THE ENDINGS: one picture each (BRIEF.md §7). Each is a different shot from any room, and the strongest in the world. ----
// Shot list (viewpoint · horizon · main subject, size · lead colour):
//   afternoon  through the bus window · horizon y 74 · the sea and an elbow on the sill, the whole frame · 9 light blue
//   kept       looking up from the roof · horizon y 122, low · a column of light over the roofs, 85% of the height · 14 yellow
//   window     eye level, through the shop glass · horizon y 100 · you and two mannequins, 55% of the height, you right of centre · 6 brown
//   died       looking up from the floor · no horizon · the tube bundle and one lamp, off to the left · 8 dark grey
export const endings = {
  afternoon: {
    alt: "Through the window of a bus, wound down: a bright sea along the horizon, a green verge going by, and an elbow resting on the sill.",
    picture: {
      version: 1,
      draw: `
        rect sky 0,0,320,74 fade:11,9/0,0/0,74
        ellipse sun 250,26,14,14 14
        ellipse sun_glow 250,26,30,26 mix:,14@0.25
        dots gulls 80,40 96,34 120,46 c15
        rect sea 0,74,320,26 fade:3,1/0,74/0,100
        dots sparkle 30,80 74,88 120,78 170,92 220,82 280,90 c15
        poly hills 0,100 50,90 120,98 190,88 250,97 320,92 320,100 2
        rect verge 0,100,320,36 mix:2,10@0.5
        rect frame_top 0,0,320,10 0
        rect pillar_l 0,0,22,136 0
        rect pillar_r 298,0,22,136 0
        rect pole 266,0,5,136 7
        rect sill 0,110,320,26 mix:6,0@0.6
        poly arm 110,136 124,112 176,106 214,136 mix:12,6@0.4 e6
        ellipse hand 172,108,16,7 mix:12,6@0.4
        line - 150,112 190,112 c6
      `,
      cycles: [{ name: "sparkle", areas: ["sparkle"], colors: [15, 11], style: "flicker", ms: [400, 1500] }]
    }
  },
  kept: {
    alt: "A roof garden at dusk, seen from low down among the chimneys. A small bottle stands open, and a tall pale-gold column of light rises from it far above the roofs.",
    picture: {
      version: 1,
      draw: `
        rect sky 0,0,320,122 fade:0,1/0,0/0,122
        dots stars 20,10 60,30 110,12 230,8 270,26 300,12 c7
        poly plume 154,124 148,92 138,58 148,26 160,4 172,28 182,60 170,94 166,124 fade:14,1/0,124/0,0
        ellipse haze 160,70,50,62 mix:,14@0.25
        ellipse haze_in 160,90,22,30 mix:,15@0.3
        poly roofs 0,136 0,120 30,112 60,118 90,108 122,116 200,114 230,106 260,116 290,110 320,114 320,136 0
        rect - 36,90,8,24 0
        rect - 238,84,8,30 0
        rect - 276,96,8,18 0
        poly rail 0,128 320,128 320,136 0,136 8
        poly bottle 150,128 152,116 158,116 160,128 7
        rect cork 153,112,4,4 6
        poly figure 218,128 220,108 226,104 232,108 234,128 0
        ellipse - 226,100,5,5 0
      `,
      cycles: [{ name: "the afternoon", areas: ["plume", "haze_in"], colors: [14, 15], style: "pingpong", ms: 2400 }]
    }
  },
  window: {
    alt: "The front window of a department store at first light, seen from the pavement. Three figures stand in it, still: two mannequins, and between them you, in a coat a little warmer than yours, with a small red price tag on the sleeve.",
    picture: {
      version: 1,
      draw: `
        rect wall 0,0,320,136 mix:6,0@0.35
        rect window 18,12,284,88 fade:14,6/0,12/0,100
        rect floor 18,88,284,12 mix:6,0@0.5
        ellipse head_l 98,36,7,8 7
        poly mannequin_l 88,46 108,46 112,90 84,90 1
        ellipse head_r 266,36,7,8 7
        poly mannequin_r 256,46 276,46 280,90 252,90 1
        ellipse head 188,32,8,9 12
        poly you 174,42 202,42 208,90 168,90 6
        line - 174,44 164,76 c6
        line - 202,44 214,76 c6
        rect tag 210,70,6,5 4
        line - 213,66 213,70 c7
        poly glare 30,12 80,12 46,100 18,100 mix:,15@0.12
        poly glare2 100,12 120,12 86,100 66,100 mix:,15@0.1
        rect sign 18,2,284,8 0
        rect pavement 0,100,320,36 mix:8,0@0.5
        line - 0,104 320,104 c7
        poly passer 258,136 262,108 274,102 292,108 296,136 0
        ellipse - 278,98,7,8 0
      `
    }
  },
  died: {
    alt: "The ceiling of the store, seen from the floor: a bundle of pneumatic tubes running away to a single yellow lamp, and the edge of your shoes at the bottom of the picture.",
    picture: {
      version: 1,
      draw: `
        rect ceiling 0,0,320,136 fade:0,8/0,136/0,0
        poly panel_l 0,0 150,40 150,60 0,100 mix:8,0@0.5
        poly panel_r 320,0 230,40 230,60 320,100 mix:8,0@0.4
        poly tubes 10,136 60,136 200,52 196,40 mix:7,8@0.5 e0
        poly tube2 70,136 120,136 210,56 204,44 mix:7,8@0.4 e0
        line - 40,136 198,46 c15
        line - 98,136 206,50 c15
        line - 20,120 80,86 c8
        ellipse glow 214,38,34,16 mix:,14@0.35
        ellipse lamp 214,38,10,4 14
        line - 214,0 214,34 c7
        poly shoes_l 214,136 228,118 262,120 270,136 0
        poly shoes_r 276,136 284,122 316,124 320,136 0
      `
    }
  }
};
