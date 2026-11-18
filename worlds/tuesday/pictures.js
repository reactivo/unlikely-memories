// Pictures for "The Train to Tuesday" (worlds/tuesday/world.en.js), one per room, the way the AI writes them
// (ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front in the short notation, ids on what the
// story may change (the outdoor skies change with night and day; the square's lamps; the train comes and goes).

export default {
  // ---- MONDAY HALT (the opening): side-on along the platform, at dusk; the lit carriage at the end, the hills behind -----
  halt: {
    version: 1,
    draw: `
      rect sky 0,0,320,78 fade:1,5/0,0/0,78
      dots stars 20,8 58,16 104,6 150,14 212,8 256,18 296,6 c15
      dots stars_dim 40,28 126,26 182,30 238,34 c7
      poly hills 0,78 0,62 44,54 96,66 150,52 214,64 268,50 320,60 320,78 0
      rect field 0,78,320,18 mix:0,2@0.3
      rect platform_top 0,94,194,6 7 e0
      rect platform_face 0,100,194,14 mix:8,0@0.4
      poly platform_end 194,94 194,114 208,114 0
      line - 0,96 194,96 c14
      rect track_bed 0,114,320,22 fade:8,0/0,114/0,136
      rect ties 14,120,292,10 stripes:6,0
      rect rail_near 14,118,292,2 7
      rect rail_far 14,130,292,2 7
      ellipse lamp_glow 70,54,28,16 mix:,14@0.25
      line lamp_post 70,58 70,94 c8
      ellipse lamp 70,52,8,5 14 e8
      rect bench_back 18,72,44,3 6 e0
      rect bench_seat 18,82,44,4 6 e0
      line - 22,75 22,82 c0
      line - 58,75 58,82 c0
      line - 22,86 22,94 c0
      line - 58,86 58,94 c0
      rect post_l 114,68,3,26 6
      rect post_r 164,68,3,26 6
      rect name_board 106,56,68,14 15 e0
      rect - 106,56,68,3 1
      rect - 112,63,56,2 0
      poly spill 176,94 196,94 206,114 172,114 mix:,14@0.3
      poly roof 196,62 204,54 322,54 322,62 8 e0
      rect carriage 198,62,126,46 2 e0
      rect window_1 212,70,22,16 14 e0
      rect window_2 244,70,22,16 14 e0
      rect carriage_doorway 202,66,18,42 14 e0
      rect door_glow 204,68,14,38 fade:14,6/0,68/0,106
      rect step 200,108,20,3 8
      rect underframe 198,108,126,5 0
      ellipse wheel_1 232,114,7,5 8 e0
      ellipse wheel_2 292,114,7,5 8 e0
      rect end_wall_l 0,58,12,78 8 e0
      rect buffer_l 12,114,5,20 4 e0
      rect buffer_r 306,114,6,20 4 e0
      rect end_wall_r 312,98,8,38 8 e0
    `,
    cycles: [
      { name: "the platform lamp", areas: ["lamp"], colors: [14, 6], style: "flicker", ms: [1200, 5000] },
      { name: "the carriage light", areas: ["door_glow", "spill"], colors: [14, 6], style: "pingpong", ms: 1400 }
    ],
    overlays: [
      { object: "tin", at: [42, 76] }
    ]
  },

  // ---- LOST PROPERTY: eye level, looking along the shelves; the counter, the clerk, the green door among things ----
  lost_property: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:6,0/0,0/0,100
      rect floor 0,104,320,32 mix:6,8@0.5
      rect shelf_back 0,10,120,92 8
      line - 0,34 120,34 c0
      line - 0,58 120,58 c0
      line - 0,82 120,82 c0
      rect - 6,20,10,14 4
      rect - 20,24,14,10 9
      ellipse birdcage 50,24,8,10 none e14
      line - 50,14 50,34 c14
      rect - 68,44,22,14 15
      line umbrellas 10,46 12,56 c7
      line - 18,44 20,56 c1
      line - 26,45 28,56 c4
      rect - 96,64,16,18 6
      rect - 8,66,30,16 7
      rect counter 150,78,140,30 6 e0
      rect - 150,78,140,4 14
      rect ledger 200,72,34,8 0 e15
      line - 217,72 217,80 c15
      ellipse ambrose_head 252,52,9,10 6
      rect ambrose 240,62,24,16 8
      rect - 238,62,4,16 15
      rect - 262,62,4,16 15
      rect sea_crate 296,92,22,16 6 e0
      line sea_crate_plank 296,100 318,100 c0
      rect sea_crate_open 296,96,22,12 6 e0
      rect sea_crate_open_sea 298,96,18,5 mix:1,9@0.5
      poly sea_crate_open_lid 290,90 304,84 306,88 292,94 6 e0
      ellipse damp 300,112,14,3 mix:1,9@0.5
    `
  },

  // ---- STATION HALL: looking in, tiles and glass; the clock and calendar high in the middle ----------------------
  station_hall: {
    version: 1,
    draw: `
      rect roof 0,0,320,30 mix:11,8@0.6
      line - 0,10 320,10 c8
      line - 0,20 320,20 c8
      line - 80,0 80,30 c8
      line - 160,0 160,30 c8
      line - 240,0 240,30 c8
      rect wall 0,30,320,80 mix:2,15@0.55
      rect - 0,92,320,18 2
      rect floor 0,110,320,26 mix:15,8@0.5
      ellipse clock_face 160,48,16,16 15 e0
      line hands 160,48 160,36 c0
      line - 160,48 168,52 c0
      rect calendar 150,68,20,16 15 e0
      rect - 150,68,20,4 4
      rect decree 190,58,30,24 6 e0
      rect - 193,61,24,18 7
      rect timetable 14,40,100,52 0 e7
      line - 20,50 108,50 c14
      line - 20,58 80,58 c7
      line - 20,66 90,66 c7
      line - 20,74 70,74 c7
      rect window 236,58,60,46 6 e0
      rect shutter 242,64,48,34 stripes:8,7
      line grille 242,64 242,98 c14
      line - 254,64 254,98 c14
      line - 266,64 266,98 c14
      line - 278,64 278,98 c14
      line - 290,64 290,98 c14
      rect - 236,96,60,8 14
    `,
    overlays: [
      { object: "booking_clerk", at: [242, 64] }
    ]
  },

  // ---- WAITING ROOM: close and dim; the stove, the woman on her bench, the booth's curtain ----------------------
  waiting_room: {
    version: 1,
    draw: `
      rect wall 0,0,320,100 fade:8,0/0,0/0,100
      rect floor 0,100,320,36 mix:6,0@0.5
      rect poster1 30,16,40,30 3 e0
      ellipse - 50,26,10,6 14
      rect poster2 90,20,36,26 9 e0
      poly - 94,42 108,28 122,42 2
      rect stove 140,60,30,44 0 e8
      rect - 152,20,6,40 0
      rect bench 10,86,120,8 6 e0
      rect - 14,94,4,12 6
      rect - 122,94,4,12 6
      ellipse oduya_head 70,58,7,8 6
      poly oduya_hat 60,54 80,54 76,46 64,46 4
      line feather 76,46 84,40 c12
      rect oduya 60,66,22,22 5
      rect suitcase 56,78,30,12 6 e0
      rect booth 236,24,62,82 7 e0
      rect curtain 244,34,46,66 stripes:4,12
      rect - 236,24,62,8 8
    `
  },

  // ---- PLATFORM 1: eye level along the platform; canopy, bench, the board; the tunnel mouth far to the right ------
  platform: {
    version: 1,
    draw: `
      rect sky 0,0,320,60 fade:1,4/0,0/0,60
      rect - 0,60,320,14 8
      rect signalbox_far 4,44,26,16 6 e0
      rect - 8,48,18,6 14
      ellipse tunnel 300,64,26,22 0
      rect rails 0,74,320,10 mix:8,0@0.5
      line - 0,76 320,76 c7
      line - 0,82 320,82 c7
      rect platform_edge 0,84,320,6 15
      rect floor 0,90,320,46 mix:7,8@0.5
      poly canopy 0,0 220,0 220,16 0,26 8 e0
      line - 40,22 40,90 c0
      line - 140,18 140,90 c0
      rect board 70,20,44,14 0 e7
      line - 74,26 100,26 c14
      rect bench 150,104,60,6 6 e0
      rect - 152,110,4,10 6
      rect - 204,110,4,10 6
    `
  },

  // ---- PLATFORM END: looking down the slope into the tunnel mouth -------------------------------------------------
  platform_end: {
    version: 1,
    draw: `
      rect sky 0,0,320,50 fade:1,4/0,0/0,50
      poly hill 0,50 90,20 230,24 320,50 2
      rect wall 120,40,140,96 mix:4,8@0.5
      ellipse tunnel 190,96,52,56 0
      ellipse hum 190,104,30,32 mix:,1@0.25
      poly slope 0,96 80,136 0,136 7
      rect platform 0,70,80,26 mix:7,8@0.5
      line rails 120,136 170,96 c7
      line - 260,136 210,96 c7
      line - 132,128 248,128 c6
      line - 146,116 234,116 c6
      line - 158,106 222,106 c6
      line - 40,30 40,70 c8
      rect sign 26,16,28,20 15 e0
      line - 30,32 50,20 c4
    `,
    cycles: [{ name: "hum", areas: ["hum"], colors: [1, 0], style: "pingpong", ms: 1600 }]
  },

  // ---- SIGNAL BOX: inside, the levers in a row, the man with his hand on one, the diagram ------------------------
  signal_box: {
    version: 1,
    draw: `
      rect sky 0,0,320,60 fade:1,4/0,0/0,60
      line - 80,0 80,60 c6
      line - 160,0 160,60 c6
      line - 240,0 240,60 c6
      rect wall 0,60,320,30 6
      rect diagram 20,66,120,18 15 e0
      line - 26,75 134,75 c0
      line - 60,75 90,82 c15
      rect floor 0,90,320,46 mix:6,0@0.4
      line lever1 170,120 176,70 c12
      line lever2 190,120 194,70 c12
      line lever3 210,120 212,70 c1
      line lever4 230,120 230,70 c12
      line lever5 250,120 248,70 c0
      rect - 160,118,110,6 8
      ellipse signalman_head 268,52,9,10 6
      rect signalman 256,62,26,40 15
      line - 256,72 232,74 c15
    `
  },

  // ---- STATION SQUARE: wide, the station front behind; fountain and statue in the middle; lamps; café lit ---------
  square: {
    version: 1,
    draw: `
      rect sky 0,0,320,50 fade:1,4/0,0/0,50
      rect station 90,14,140,56 7 e0
      poly - 90,14 160,0 230,14 8
      ellipse - 160,32,10,10 15 e0
      rect - 146,44,28,26 0
      rect hotel 0,30,80,60 6 e0
      rect - 10,40,14,16 14
      rect - 40,40,14,16 0
      rect cafe 240,34,80,56 4 e0
      rect cafe_window 252,48,56,22 14
      rect cobbles 0,90,320,46 mix:8,0@0.4
      ellipse fountain 160,110,50,12 7 e0
      ellipse water 160,110,44,9 1
      ellipse water_lamp 160,111,6,3 1
      rect plinth 152,84,16,22 8 e0
      rect statue 154,62,12,22 6
      ellipse - 160,58,5,6 6
      rect - 154,50,12,6 0
      line - 40,90 40,60 c0
      line - 280,90 280,60 c0
      line - 110,96 110,66 c0
      line - 210,96 210,66 c0
      ellipse lamp_a 40,58,4,4 8 e0
      ellipse lamp_b 280,58,4,4 8 e0
      ellipse lamp_c 110,64,3,3 8 e0
      ellipse lamp_d 210,64,3,3 8 e0
      line ladder 36,90 44,60 c6
    `
  },

  // ---- HOTEL TERMINUS: looking in at the desk, key hooks, the stair going up --------------------------------------
  hotel: {
    version: 1,
    draw: `
      rect wall 0,0,320,96 mix:5,6@0.4
      rect floor 0,96,320,40 mix:4,0@0.5
      rect hooks 120,20,80,30 6 e0
      dots keys 130,30 145,30 160,30 175,30 190,30 130,42 145,42 175,42 190,42 c14
      rect desk 100,70,130,40 6 e0
      rect - 100,70,130,4 14
      ellipse porter_head 166,48,8,9 6
      rect porter 154,58,24,14 0
      rect paper 146,60,40,14 15 e8
      line - 150,64 180,64 c8
      poly stairs 240,136 320,136 320,20 290,20 8
      line - 252,124 320,124 c0
      line - 262,110 320,110 c0
      line - 272,96 320,96 c0
      line - 282,82 320,82 c0
      line - 292,68 320,68 c0
    `
  },

  // ---- ROOM 4: close, the bed turned down, the window on the rails ------------------------------------------------
  hotel_room: {
    version: 1,
    draw: `
      rect wall 0,0,320,100 mix:3,8@0.6
      rect floor 0,100,320,36 6
      rect sky 200,16,80,60 fade:1,4/0,16/0,76 e15
      line - 200,46 280,46 c15
      line - 240,16 240,76 c15
      line - 204,70 276,58 c8
      ellipse - 266,60,8,8 1
      rect bed 20,70,150,40 15 e0
      rect - 20,70,150,12 7
      poly - 120,70 170,70 170,90 4
      rect - 20,60,6,56 0
      rect - 164,60,6,56 0
      rect washstand 186,90,40,30 6 e0
      ellipse - 206,88,10,4 7
    `
  },

  // ---- CAFÉ DOMINGO: warm, the counter, Inés, the board; tables in front --------------------------------------------
  cafe: {
    version: 1,
    draw: `
      rect wall 0,0,320,96 fade:14,6/0,0/0,96
      rect floor 0,96,320,40 mix:6,4@0.4
      rect menu 30,16,50,34 0 e6
      line - 36,26 70,26 c15
      line - 36,36 60,36 c8
      rect counter 150,64,150,40 7 e0
      rect - 150,64,150,4 15
      rect radio 260,30,30,20 6 e0
      ellipse - 268,40,4,4 14
      ellipse ines_head 210,44,8,9 6
      rect ines 198,54,24,12 0
      ellipse table 70,110,30,6 15 e0
      line - 70,116 70,132 c0
      ellipse - 130,118,24,5 15 e0
      line - 130,123 130,134 c0
    `
  },

  // ---- HIGH STREET: one-point perspective down the street; the town hall's columns left, clocks right -------------
  high_street: {
    version: 1,
    draw: `
      rect sky 0,0,320,50 fade:1,4/0,0/0,50
      poly left 0,0 120,46 120,96 0,136 8
      poly right 320,0 200,46 200,96 320,136 8
      rect far 120,46,80,50 0
      poly road 0,136 120,96 200,96 320,136 mix:8,0@0.5
      rect town_hall 4,30,70,80 7 e0
      line - 14,40 14,104 c15
      line - 30,40 30,104 c15
      line - 46,40 46,104 c15
      line - 62,40 62,104 c15
      rect plate 76,72,8,6 14
      rect shop_window 250,40,56,40 0 e6
      ellipse - 262,52,7,7 15
      ellipse - 282,58,6,6 7
      ellipse - 296,50,5,5 14
      ellipse - 270,70,5,5 15
      rect shutters 210,54,30,40 stripes:8,0
      rect - 86,58,28,36 stripes:8,0
    `
  },

  // ---- TOWN HALL: marble, a row of empty counters, the stair --------------------------------------------------------
  town_hall: {
    version: 1,
    draw: `
      rect wall 0,0,320,96 mix:15,7@0.5
      rect floor 0,96,320,40 stripes:7,15
      rect counters 40,64,240,34 7 e0
      line - 100,64 100,98 c0
      line - 160,64 160,98 c0
      line - 220,64 220,98 c0
      rect - 40,64,240,4 8
      poly stairs 0,136 50,136 50,30 20,30 8
      line - 6,124 50,124 c0
      line - 12,108 50,108 c0
      line - 18,92 50,92 c0
      rect sign 280,40,30,16 15 e0
      line - 295,56 295,96 c0
    `
  },

  // ---- THE ARCHIVE: shelves to the ceiling; the archivist at the window --------------------------------------------
  archive: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:6,0/0,0/0,136
      rect shelves 0,0,120,136 mix:6,8@0.5
      line - 0,30 120,30 c0
      line - 0,62 120,62 c0
      line - 0,94 120,94 c0
      rect - 220,0,100,136 mix:6,8@0.5
      line - 220,30 320,30 c0
      line - 220,62 320,62 c0
      line - 220,94 320,94 c0
      rect sky 140,10,60,40 fade:1,4/0,10/0,50 e0
      line - 170,10 170,50 c0
      rect desk 136,84,72,10 6 e0
      ellipse archivist_head 172,64,8,9 6
      rect archivist 160,72,24,14 8
      ellipse lamp 196,80,6,5 14
    `
  },

  // ---- THE CLOCKMAKER'S: clocks everywhere; the backwards clock on the counter ---------------------------------------
  clock_shop: {
    version: 1,
    draw: `
      rect wall 0,0,320,100 mix:6,0@0.3
      rect floor 0,100,320,36 mix:6,8@0.5
      ellipse - 30,24,14,14 15 e0
      ellipse - 70,40,10,10 7 e0
      ellipse - 110,20,12,12 14 e0
      ellipse - 240,22,14,14 15 e0
      ellipse - 284,44,12,12 7 e0
      ellipse - 200,46,9,9 14 e0
      rect - 150,8,20,44 6 e0
      ellipse - 160,20,7,7 15
      rect counter 100,80,140,30 6 e0
      rect backwards_clock 160,60,24,20 14 e0
      ellipse - 172,70,7,7 15
      line hands 172,70 167,65 c0
      ellipse clockmaker_head 60,70,8,9 6
      rect clockmaker 48,80,24,24 8
      ellipse lens 64,68,3,3 11
    `
  },

  // ---- THE PARK: wide; the bandstand, the hedge with a gap ---------------------------------------------------------
  park: {
    version: 1,
    draw: `
      rect sky 0,0,320,56 fade:1,4/0,0/0,56
      ellipse - 40,60,40,24 2
      ellipse - 280,58,46,26 2
      rect grass 0,70,320,66 mix:2,0@0.3
      poly path 140,136 180,136 166,70 154,70 7
      poly bandstand_roof 200,40 260,40 250,30 210,30 4
      rect bandstand 206,40,48,30 none e15
      line - 214,40 214,70 c15
      line - 246,40 246,70 c15
      rect - 200,70,60,6 15
      rect hedge 10,90,16,14 2
      rect - 30,90,16,14 2
      rect - 50,90,16,14 2
      rect - 90,90,16,14 2
      rect - 110,90,16,14 2
      rect - 130,90,16,14 2
    `
  },

  // ---- THE CHAPEL: inside, cold; the glass doors and the stones beyond ------------------------------------------------
  chapel: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 mix:7,8@0.6
      poly arch 110,20 160,0 210,20 210,110 110,110 0
      rect sky 116,24,88,86 fade:1,4/0,24/0,110 e7
      line - 160,24 160,110 c7
      rect gravestones 124,80,10,14 7
      rect - 144,82,10,12 7
      rect - 168,80,10,14 7
      rect - 188,82,10,12 7
      rect pews 0,104,100,10 6
      rect - 0,118,100,10 6
      rect - 220,104,100,10 6
      rect - 220,118,100,10 6
      rect floor 0,128,320,8 8
    `
  },

  // ---- THE POND: looking down at the water; the town upside down in it ----------------------------------------------
  pond: {
    version: 1,
    draw: `
      rect sky 0,0,320,40 fade:1,4/0,0/0,40
      rect grass 0,40,320,96 mix:2,0@0.4
      ellipse rim 160,92,130,40 7 e8
      ellipse pond 160,92,122,34 fade:1,4/0,60/0,126
      rect - 120,92,80,24 0
      poly - 120,92 160,124 200,92 8
      ellipse - 160,104,6,6 15
      rect - 80,92,24,16 0
      rect - 216,92,24,14 0
    `,
    cycles: [{ name: "ripple", areas: ["pond"], colors: [1, 9], style: "pingpong", ms: 1400 }]
  },

  // ---- THE COMPARTMENT: inside, green plush, the window full of platform lights -------------------------------------
  compartment: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 6
      rect window 90,14,140,64 0 e8
      dots - 110,50 150,46 200,52 c14
      line strap 160,14 160,40 c6
      rect seat_l 0,60,80,76 2 e0
      rect - 0,60,80,10 10
      rect seat_r 240,60,80,76 2 e0
      rect - 240,60,80,10 10
      rect rack 0,6,80,6 8
      rect - 240,6,80,6 8
      rect card 136,84,48,14 15 e0
      line - 142,91 178,91 c0
      rect floor 80,110,160,26 mix:4,0@0.5
    `
  },

  // ---- THE DINING CAR: down the length of the car; white cloths, little lamps; the guard far end ---------------------
  dining_car: {
    version: 1,
    draw: `
      rect ceiling 0,0,320,30 6
      poly left 0,30 120,50 120,96 0,136 4
      poly right 320,30 200,50 200,96 320,136 4
      rect far 120,50,80,46 0
      poly floor 0,136 120,96 200,96 320,136 mix:4,0@0.5
      rect - 10,90,70,14 15
      rect - 240,90,70,14 15
      rect - 100,80,30,8 15
      rect - 190,80,30,8 15
      ellipse lamps 44,86,4,4 14
      ellipse - 276,86,4,4 14
      ellipse - 114,76,3,3 14
      ellipse - 204,76,3,3 14
      ellipse guard_head 160,62,6,7 6
      rect guard 152,70,16,22 1
    `
  }
};

// ---- THE ENDINGS: one picture each (BRIEF.md §7). Each is a different shot from any room, and the strongest in the world. ----
// Shot list (viewpoint · horizon · main subject, size · lead colour):
//   tuesday  through the train window · horizon y 60 · the light at the end of the tunnel, 25% of the frame, centre · 14 yellow
//   monday   close-up · no horizon · the tear-off calendar page (red band, no lettering), 90% of the height, centre · 4 red
//   sunday   far away, establishing · horizon y 104, low · the small station and its stopped clock, 20% of the width, left third · 7 light grey
//   died     from far above · no horizon · two rails and a tiny figure by the platform edge, 4% · 12 light red
export const endings = {
  tuesday: {
    version: 1,
    draw: `
      rect carriage 0,0,320,136 8
      rect window 50,14,220,92 0
      ellipse tunnel_a 160,60,120,66 8
      ellipse tunnel_b 160,60,84,50 0
      ellipse tunnel_c 160,60,62,38 8
      ellipse tunnel_d 160,60,44,28 0
      ellipse tunnel_e 160,60,30,20 7
      ellipse light 160,60,20,13 14
      ellipse light_in 160,60,10,7 15
      dots lamps 90,40 74,62 100,86 230,40 250,62 224,86 c14
      ellipse face 96,62,14,18 mix:,15@0.15
      poly shoulders 66,106 74,86 118,86 126,106 mix:,15@0.12
      rect frame_top 0,0,320,14 mix:8,0@0.5
      rect frame_bottom 0,106,320,30 mix:8,0@0.5
      rect frame_l 0,0,50,136 mix:8,0@0.5
      rect frame_r 270,0,50,136 mix:8,0@0.5
      rect sill 40,106,240,8 6
      poly seat 0,136 0,124 40,118 40,136 6
      rect ticket 210,98,14,8 14
    `,
    cycles: [{ name: "the light", areas: ["light", "light_in"], colors: [14, 15], style: "pingpong", ms: 2200 }]
  },
  monday: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:6,0/0,0/0,136
      ellipse clock 284,26,22,22 15 e0
      line - 284,26 284,12 c0
      line - 284,26 296,32 c0
      rect pad 96,10,128,120 7 e0
      rect sheet 90,6,140,118 15 e0
      rect band 90,6,140,34 4
      ellipse ring_l 120,6,4,3 8
      ellipse ring_r 200,6,4,3 8
      poly tear 90,40 100,44 112,41 124,45 138,41 150,44 164,41 178,45 192,41 206,44 218,41 230,44 230,40 mix:7,15@0.5
      rect big 120,52,80,10 mix:4,15@0.35
      rect - 120,68,56,6 mix:8,15@0.5
      rect - 120,80,68,6 mix:8,15@0.5
      rect - 120,92,44,6 mix:8,15@0.5
      dots lines 100,106 110,106 120,106 130,106 140,106 150,106 160,106 170,106 180,106 190,106 200,106 210,106 c8
      poly glue 90,40 230,40 230,44 90,42 mix:,15@0.5
      rect stub 94,126,132,3 8
    `,
    cycles: [{ name: "the clock", areas: ["clock"], colors: [15, 14], style: "flicker", ms: [300, 900] }]
  },
  died: {
    version: 1,
    draw: `
      rect ballast 0,0,320,136 mix:8,6@0.4
      rect platform 0,0,100,136 mix:7,8@0.5
      rect edge 94,0,6,136 14
      rect - 120,6,100,5 6
      rect - 120,20,100,5 6
      rect - 120,34,100,5 6
      rect - 120,48,100,5 6
      rect - 120,62,100,5 6
      rect - 120,76,100,5 6
      rect - 120,90,100,5 6
      rect - 120,104,100,5 6
      rect - 120,118,100,5 6
      rect rail_l 134,0,4,136 7
      rect rail_r 196,0,4,136 7
      poly cone 140,24 190,24 230,96 110,96 mix:,14@0.2
      rect train 120,0,90,24 8 e0
      ellipse lamp_l 140,20,5,3 14
      ellipse lamp_r 188,20,5,3 14
      ellipse signal 250,30,5,5 12
      ellipse signal_glow 250,30,12,12 mix:,12@0.3
      ellipse body 80,92,10,4 12
      ellipse head 70,92,4,4 12
    `,
    cycles: [{ name: "signal", areas: ["signal", "signal_glow"], colors: [12, 4], style: "blink", ms: 800 }]
  }
};

// ---- THE COVER (its page, /tuesday/: docs/splash/PLAN.md): 480 x 560, the title drawn by the game on its band -----------------------------------
export const cover = {
  shot: "archetype: the icon. Its yes: the whole story is one object, the last carriage of the 23:40 that leaves for Tuesday, seen from behind and to the left from the platform, on the rails that run off into the dark; its rear panel carries a clock at twenty to twelve, red tail lamps and a lit door window, a red signal waits beyond it, and a suitcase left on the platform in the foreground says nobody comes back. Beat the tower (the Minister, used on the old cover). moves: the carriage windows, the tail lamps and the signal, the windows of the town, a bird over the roofs, a moth at the lamp",
  title: 15,
  titleAt: "top",
  draw: `
rect bg 0,0,480,560 6
# stars over the line (below the title band)
dots stars 20,140 52,128 96,150 130,132 176,124 410,134 440,150 462,128 392,160 24,160 70,122 458,164 c15
dots stars_dim 40,150 110,128 150,146 420,126 450,142 30,128 400,148 470,150 c7
poly hill_l 0,176 0,148 30,142 70,150 120,160 160,170 160,176 mix:6,0@0.55
poly hill_r 330,176 380,162 420,150 460,144 480,140 480,176 mix:6,0@0.55
# the town to the left, in the wing
poly t_roof_1 0,172 0,156 8,148 18,156 18,172 0
poly t_roof_2 18,172 18,160 30,152 42,160 42,172 0
rect t_chim_2 36,146,4,10 0
rect t_tower 50,142,16,30 0
poly t_spire 48,142 58,124 68,142 0
ellipse t_clock 58,152,6,6 14 e0
poly t_roof_3 70,172 70,158 82,150 96,158 96,172 0
poly t_roof_4 96,172 96,162 106,156 118,162 118,172 0
rect t_win_a 8,162,3,4 14
rect t_win_b 26,164,3,4 14
rect t_win_c 78,164,3,4 14
rect t_win_d 104,166,3,4 14
# the town to the right, beyond the signal
poly r_roof_1 400,172 400,152 412,142 426,152 426,172 0
rect r_chim_1 418,134,4,12 0
poly r_roof_2 426,172 426,160 440,150 454,160 454,172 0
poly r_roof_3 454,172 454,150 466,140 480,148 480,172 0
rect r_win_a 410,158,3,4 14
rect r_win_b 436,162,3,4 14
rect r_win_c 462,156,3,4 14
rect ground 0,170,480,300 fade:0,8/0,172/0,469
poly sleeper_0 254,265 338,265 343,267 257,267 6
poly sleeper_1 261,271 350,271 355,274 263,274 6
poly sleeper_2 268,277 363,277 369,281 271,281 6
poly sleeper_3 276,285 378,285 385,288 280,288 6
poly sleeper_4 286,294 395,294 403,298 290,298 6
poly sleeper_5 297,304 415,304 424,309 302,309 6
poly sleeper_6 310,316 438,316 450,321 316,321 6
poly sleeper_7 325,330 467,330 480,337 333,337 6
poly sleeper_8 344,347 501,347 517,356 353,356 6
poly sleeper_9 368,369 543,369 564,379 379,379 6
poly sleeper_10 398,396 597,396 625,410 413,410 6
poly sleeper_11 437,432 669,432 706,451 458,451 6
poly rail_a 255,256 259,256 547,482 533,482 7
line rail_a_shine 255,256 533,482 c15
poly rail_b 305,256 309,256 727,482 713,482 7
line rail_b_shine 305,256 713,482 c15
poly sleeper2_0 290,216 330,216 337,218 295,218 6
poly sleeper2_1 305,221 350,221 359,224 312,224 6
poly sleeper2_2 324,228 375,228 386,231 333,231 6
poly sleeper2_3 349,236 408,236 422,240 360,240 6
poly sleeper2_4 383,247 451,247 470,252 398,252 6
poly sleeper2_5 429,262 511,262 539,270 451,270 6
poly rail2_a 240,199 241,199 649,326 641,326 7
poly rail2_b 257,199 258,199 739,326 731,326 7
dots ballast 236,300 260,320 300,290 330,330 372,310 420,350 444,300 460,380 392,420 340,400 300,440 250,360 210,420 270,460 430,440 470,330 400,290 190,330 354,276 280,284 c8
dots ballast_lt 250,284 320,300 380,330 440,320 300,380 360,440 420,400 460,420 330,350 c7
poly platform 0,170 150,170 309,469 0,469 fade:8,7/0,170/0,469
line seam_3 150,170 90,469 c8
line seam_13 150,170 -109,469 c8
line seam_24 150,170 -328,469 c8
line seam_36 150,170 -568,469 c8
line seam_50 150,170 -847,469 c8
line seam_70 150,170 -1245,469 c8
line seam_95 150,170 -1744,469 c8
line seam_130 150,170 -2441,469 c8
line seam_z140 0,212 172,212 c8
line seam_z85 0,239 187,239 c8
line seam_z60 0,268 202,268 c8
line seam_z46 0,298 218,298 c8
line seam_z37 0,329 235,329 c8
line seam_z31 0,359 251,359 c8
line seam_z26 0,396 270,396 c8
line seam_z23 0,431 289,431 c8
poly platform_edge 150,170 309,469 282,469 14
line platform_lip 150,170 309,469 c0
dots scuffs 14,230 60,250 120,236 40,300 24,350 60,420 150,380 200,400 120,440 30,456 210,330 230,440 90,330 180,440 c7
dots scuffs_dk 28,262 80,222 130,260 50,330 20,396 100,404 190,360 160,432 70,448 220,372 c8
ellipse pool_30 129,218,60,15 mix:,14@0.3
ellipse pool_17 138,198,34,9 mix:,14@0.3
ellipse pool_10.5 142,187,21,5 mix:,14@0.3
ellipse glow_30 111,136,27,14 mix:,14@0.22
rect post_30 109,125,4,90 0
poly head_30 102,125 120,125 117,140 105,140 0
ellipse bulb_30 111,133,5,6 14
ellipse glow_17 128,151,15,8 mix:,14@0.22
rect post_17 127,145,2,51 0
poly head_17 123,145 133,145 132,154 124,154 0
ellipse bulb_17 128,149,3,3 14
ellipse glow_10.5 136,158,9,5 mix:,14@0.22
rect post_10.5 135,154,2,32 0
poly head_10.5 133,154 139,154 138,159 134,159 0
ellipse bulb_10.5 136,157,2,2 14
ellipse sig_glow 380,131,13,13 mix:,4@0.25
rect sig_post 378,125,4,128 0
rect sig_head 373,121,14,26 0
ellipse sig_red 380,127,4,4 4
ellipse sig_yel 380,138,3,3 8
poly car_side 222,123 161,163 161,182 222,249 8 e0
poly car_roof_side 222,121 161,163 161,165 222,138 0
poly car_stripe 222,219 161,177 161,179 222,233 4
poly car_skirt 222,235 161,180 161,182 222,251 0
poly car_win_0 214,160 208,161 208,202 214,205 14 e0
poly car_win_1 204,162 200,163 200,197 204,200 14 e0
poly car_win_2 197,163 194,163 194,194 197,196 14 e0
poly car_win_3 192,164 189,164 189,191 192,193 14 e0
poly car_win_4 187,164 185,165 185,189 187,191 14 e0
poly car_win_5 184,165 182,165 182,188 184,189 14 e0
poly car_win_6 181,165 179,166 179,186 181,187 14 e0
poly car_win_7 178,166 177,166 177,185 178,186 14 e0
poly car_gap_0 176,152 175,153 175,198 176,199 0
poly car_win_8 174,166 173,167 173,183 174,183 14 e0
poly car_win_9 172,167 172,167 172,182 172,182 14 e0
poly car_win_10 171,167 170,167 170,181 171,182 14 e0
poly car_win_11 170,167 169,167 169,181 170,181 14 e0
poly car_win_12 169,167 168,167 168,180 169,180 14 e0
poly car_win_13 168,167 167,167 167,180 168,180 14 e0
poly car_win_14 167,167 167,168 167,179 167,179 14 e0
poly car_win_15 166,168 166,168 166,179 166,179 14 e0
poly car_gap_1 165,160 165,160 165,187 165,187 0
poly car_win_16 165,168 164,168 164,178 165,178 14 e0
poly car_win_17 164,168 164,168 164,178 164,178 14 e0
poly car_win_18 164,168 163,168 163,177 164,177 14 e0
poly car_win_19 163,168 163,168 163,177 163,177 14 e0
poly car_win_20 163,168 162,168 162,177 163,177 14 e0
poly car_win_21 162,168 162,168 162,177 162,177 14 e0
poly car_win_22 162,168 162,168 162,176 162,176 14 e0
poly car_win_23 161,168 161,168 161,176 161,176 14 e0
ellipse car_wheel_22 210,234,10,10 0
ellipse car_wheel_36 204,228,9,9 0
ellipse car_wheel_160 179,201,5,5 0
ellipse car_wheel_174 178,200,5,5 0
ellipse car_wheel_227 173,195,4,4 0
ellipse car_wheel_241 172,194,4,4 0
poly car_rear 222,135 232,127 356,127 366,135 366,249 222,249 8 e0
poly car_roof 219,137 232,124 356,124 369,137 369,142 219,142 0
rect car_rear_shade 344,142,22,107 mix:8,0@0.4
rect car_rear_band 222,215,144,8 4
ellipse car_clock_rim 294,173,27,27 0
ellipse car_clock 294,173,24,24 14
line car_tick_12 294,150 294,155 c0
line car_tick_3 317,173 312,173 c0
line car_tick_6 294,196 294,191 c0
line car_tick_9 271,173 276,173 c0
line car_hand_h 294,173 292,161 c0
line car_hand_h_b 295,173 293,161 c0
line car_hand_m 294,173 278,183 c0
line car_hand_m_b 295,173 279,183 c0
ellipse car_hub 294,173,2,2 0
rect car_door 272,205,44,10 0
rect car_door_win 278,209,32,16 14
line car_door_split 294,227 294,215 c8
ellipse car_halo_l 240,237,15,15 mix:,4@0.3
ellipse car_lampring_l 240,237,8,8 0
ellipse car_lamp_l 240,237,5,5 4
ellipse car_halo_r 348,237,15,15 mix:,4@0.3
ellipse car_lampring_r 348,237,8,8 0
ellipse car_lamp_r 348,237,5,5 4
rect car_buffer_l 228,225,10,8 0
rect car_buffer_r 350,225,10,8 0
rect car_under 226,249,136,15 0
line car_coupling 284,243 304,243 c8
poly case_shadow 95,320 175,320 245,354 135,354 mix:,0@0.55
poly case_body 95,320 95,274 101,268 169,268 175,274 175,320 0
poly case_handle 123,268 127,260 143,260 147,268 143,268 141,263 129,263 127,268 0
line case_strap_l 117,268 117,320 c8
line case_strap_r 153,268 153,320 c8
line case_rim 101,268 169,268 c14
rect case_tag 155,276,6,10 4
line case_tag_string 153,268 158,276 c8
`,
  cycles: [{"name":"the carriage windows","areas":["car_win_0","car_win_1","car_win_2","car_win_3","car_win_4","car_win_5","car_win_6","car_win_7","car_win_8","car_win_9","car_win_10","car_win_11","car_win_12","car_win_13","car_win_14","car_win_15","car_win_16","car_win_17","car_win_18","car_win_19","car_win_20","car_win_21","car_win_22","car_win_23","car_door_win"],"colors":[14,8],"style":"flicker","ms":[2500,7000]},{"name":"the tail lamps and the signal","areas":["car_lamp_l","car_lamp_r","sig_red"],"colors":[4,12],"style":"pingpong","ms":900},{"name":"the windows of the town","areas":["t_win_a","t_win_b","t_win_c","t_win_d","r_win_a","r_win_b","r_win_c"],"colors":[14,0],"style":"flicker","ms":[3000,9000]}],
  loops: [{"name":"a bird over the roofs","path":[[470,142],[120,150]],"travel":9000,"pause":4000,"ms":170,"style":"loop","under":"car","frames":[["0............0","00..0....0..00","000.000000.000",".0000000000000","..00..00..00..","...0......0..."],["..............","....0....0....","...00000000...",".000000000000.","00..000000..00","0............0"]]},{"name":"a moth at the lamp","at":[117,121],"ms":180,"style":"loop","frames":[["f.f.",".ff.","f.f."],[".ff.","f..f",".ff."]]}]
};


// ---- The box art (the list of games: ui/home.js): the earlier 480 x 400 cover (16 November 2026), shown as its phone crop, columns 80-399, still. ----
export const boxart = {
 "shot": "archetype: the icon. Its yes: the world turns on one thing, Monday itself, cut out of the week by decree; the poster is the week with its Monday column missing. It beat the tower (the Minister's statue over the square: any town with a monument could own that poster, and the decree's power doesn't need his outline). Title at the top (a flat brown 6 band, rows 0-95: the wall carried on, the title in yellow 14). Facing: straight at the wall, eye level, upright. Palette gaslight (lead brown 6; dark grey 8, black, yellow 14 for the lamp and the lit paper, one red 4 accent); the light is one gas lamp on a bracket at the left, at about x 88, y 172, a flat yellow globe with a dithered halo on the wall, so the calendar is lit from the left and throws a dither shadow down and to the right (the diagonal, with the rails inside the gap, which converge on the far light). Dominant: one huge tear-off wall calendar on the wall, centred, columns 116-362, rows 104-388: a dark grey board with a black binding strip (three hanger holes showing the wall), a yellow lit sheet (the right half checked with brown for shade: it turns from the lamp), a brown month band with two bars (no letters), a row of day-name dashes, a grid of five rows by seven columns with a dash of a number in each cell, and the pad's edge in stripes under the sheet. The Monday column (second from the left, columns 155-189) is cut clean out of the sheet and the board: a dark hole 34 wide and 220 high, dark grey fading to black. Through it, the question: a railway line runs away up the hole in perspective (two brown rails, sleepers), a small black train leaving, two carriages with yellow windows and a red tail lamp (the one red accent), a pale yellow light at the far end. Not the answer: nothing says how to board or what Tuesday holds. No figures. Backdrop: the brown wall falling into the dark towards the bottom (a gradient with its cause, the lamp's reach), tongue-and-groove seams in the wings, a dark grey skirting along the foot. Wings: left, a gas pipe running diagonally down from the corner into the lamp's bracket, the lamp {gas lamp} with its halo, and a stack of two brown {suitcases} with black straps against the skirting; right, a round {station clock} on the wall with black hands at twenty to twelve (a muted yellow face, black rim, four tick dots) and a rail of four luggage {tags} hanging on it. Other elements from the game: the train, the clock, the lamp. Scale contrast: the calendar fills the poster, the train in its hole is 25 pixels tall. moves: the gas lamp and its halo (flicker), the carriages' windows and the far light (flicker), the red tail lamp (pingpong), two moths round the lamp (loop).",
 "title": 14,
 "titleAt": "top",
 "draw": "\nrect bg 0,0,480,400 6\nrect wall 0,96,480,304 fade:6,0/0,100/0,476\nline seam_l1 26,98 26,399 c0\nline seam_l2 56,98 56,399 c0\nline seam_r1 424,98 424,399 c0\nline seam_r2 454,98 454,399 c0\nrect skirting 0,390,480,10 8 e0\nrect case_big 4,344,64,46 6 e0\nrect case_top 14,324,42,20 6 e0\nrect case_strap_1 20,344,3,46 0\nrect case_strap_2 48,344,3,46 0\nline case_handle 28,324 28,320 42,320 42,324 c0\nrect tag_rail 384,252,96,3 8 e0\nrect tag_1 392,255,11,16 mix:14,6@0.5 e0\nrect tag_2 412,255,11,22 mix:14,6@0.5 e0\nrect tag_3 434,255,11,13 mix:14,6@0.5 e0\nrect tag_4 456,255,11,19 mix:14,6@0.5 e0\ndots tag_holes 397,258 417,258 439,258 461,258 c0\nellipse clock_rim 436,166,29,29 0\nellipse clock_face 436,166,26,26 mix:14,6@0.3\ndots clock_ticks 436,143 436,189 413,166 459,166 c0\nline clock_min 436,166 419,176 c0\nline clock_hr 436,166 434,152 c0\nellipse clock_hub 436,166,2,2 0\nellipse halo_3 88,172,70,56 mix:,14@0.1\nellipse halo_2 88,172,48,38 mix:,14@0.2\nellipse halo_1 88,172,28,22 mix:,14@0.35\npoly pipe 0,112 0,118 58,150 82,162 82,157 56,144 8 e0\nrect lamp_cap 82,159,12,4 8 e0\nellipse lamp 88,172,8,10 14 e0\nrect lamp_base 83,181,10,4 8 e0\npoly shadow_cal 134,114 380,114 380,398 134,398 mix:,0@0.65\nrect board 116,104,246,284 8 e0\nline board_rim 117,106 117,386 c6\nrect cal_head 116,104,246,16 0\nellipse hole_a 160,112,3,2 6\nellipse hole_b 239,112,3,2 6\nellipse hole_c 318,112,3,2 6\nrect sheet 122,124,236,254 14\nrect sheet_shade_a 240,124,66,254 mix:14,6@0.25\nrect sheet_shade_b 306,124,52,254 mix:14,6@0.5\nrect pad 122,378,236,6 stripes:14,6\nrect month 122,124,236,26 6\nrect month_a 134,132,58,8 14\nrect month_b 292,132,34,8 14\nrect dn_1 129,157,14,2 8\nrect dn_3 197,157,14,2 8\nrect dn_4 231,157,14,2 8\nrect dn_5 265,157,14,2 8\nrect dn_6 299,157,14,2 8\nrect dn_7 331,157,14,2 8\nline grid_h1 122,168 358,168 c8\nline grid_h2 122,210 358,210 c8\nline grid_h3 122,252 358,252 c8\nline grid_h4 122,294 358,294 c8\nline grid_h5 122,336 358,336 c8\nline grid_v1 223,152 223,378 c8\nline grid_v2 257,152 257,378 c8\nline grid_v3 291,152 291,378 c8\nline grid_v4 324,152 324,378 c8\ndots num_r1 127,173 128,173 129,173 194,173 195,173 196,173 228,173 229,173 230,173 262,173 263,173 264,173 296,173 297,173 298,173 329,173 330,173 331,173 c8\ndots num_r2 127,215 128,215 129,215 194,215 195,215 196,215 228,215 229,215 230,215 262,215 263,215 265,215 266,215 296,215 297,215 299,215 300,215 329,215 330,215 332,215 333,215 c8\ndots num_r3 127,257 128,257 130,257 131,257 194,257 195,257 197,257 198,257 228,257 229,257 231,257 232,257 262,257 263,257 265,257 266,257 296,257 297,257 299,257 300,257 329,257 330,257 332,257 333,257 c8\ndots num_r4 127,299 128,299 130,299 131,299 194,299 195,299 197,299 198,299 228,299 229,299 231,299 232,299 262,299 263,299 265,299 266,299 296,299 297,299 299,299 300,299 329,299 330,299 332,299 333,299 c8\ndots num_r5 127,341 128,341 130,341 131,341 194,341 195,341 197,341 198,341 228,341 229,341 231,341 232,341 262,341 263,341 265,341 266,341 296,341 297,341 298,341 329,341 330,341 331,341 c8\nrect slot 155,152,34,220 fade:8,0/0,152/0,427 e0\nvp 172,156\nellipse far_halo 172,164,11,8 mix:,14@0.3\nellipse far_light 172,162,4,3 14\nline rail_l 163,372@1 163,372@0.05 c6\nline rail_r 181,372@1 181,372@0.05 c6\nline sl_1 157,372@0.94 187,372@0.94 c6\nline sl_2 157,372@0.82 187,372@0.82 c6\nline sl_3 157,372@0.71 187,372@0.71 c6\nline sl_4 157,372@0.61 187,372@0.61 c6\nline sl_5 157,372@0.52 187,372@0.52 c6\nline sl_6 157,372@0.34 187,372@0.34 c6\nline sl_7 157,372@0.28 187,372@0.28 c6\nline sl_8 157,372@0.22 187,372@0.22 c6\nline sl_9 157,372@0.17 187,372@0.17 c6\npoly train_c2 166,236 166,227 168,224 176,224 178,227 178,236 0\nrect train_c2_win_a 168,228,3,4 14\nrect train_c2_win_b 173,228,3,4 14\npoly train_body 165,262 165,243 168,238 177,238 180,243 180,262 0\nrect train_win_a 167,244,4,5 14\nrect train_win_b 174,244,4,5 14\nellipse train_lamp 172,257,2,2 4\nrect train_floor 164,262,17,2 0\n",
 "cycles": [
  {
   "name": "the gas lamp",
   "areas": [
    "lamp",
    "halo_1",
    "halo_2",
    "halo_3"
   ],
   "colors": [
    14,
    6
   ],
   "style": "flicker",
   "ms": [
    1200,
    4200
   ]
  },
  {
   "name": "the carriage windows and the far light",
   "areas": [
    "train_win_a",
    "train_win_b",
    "train_c2_win_a",
    "train_c2_win_b",
    "far_light"
   ],
   "colors": [
    14,
    6
   ],
   "style": "flicker",
   "ms": [
    3000,
    8000
   ]
  },
  {
   "name": "the tail lamp",
   "areas": [
    "train_lamp"
   ],
   "colors": [
    4,
    12
   ],
   "style": "pingpong",
   "ms": 900
  }
 ],
 "loops": [
  {
   "name": "two moths round the gas lamp",
   "at": [
    75,
    162
   ],
   "ms": 170,
   "style": "loop",
   "frames": [
    [
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "...7.7....................",
     "....7.....................",
     "..........................",
     "..........................",
     "..........................",
     ".....................7....",
     ".....................7....",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     ".........7................",
     ".........7................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..............7.7.........",
     "...............7..........",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "...............7.7........",
     "................7.........",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".......7..................",
     ".......7..................",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".....................7....",
     ".....................7....",
     "..........................",
     "..7.7.....................",
     "...7......................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     "..........................",
     "......7...................",
     "......7...................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..................7.7.....",
     "...................7......",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     ".........................."
    ],
    [
     "..........................",
     "..........................",
     ".............7.7..........",
     "..............7...........",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "..........................",
     "...........7..............",
     "...........7..............",
     "..........................",
     "..........................",
     ".........................."
    ]
   ]
  }
 ]
};
