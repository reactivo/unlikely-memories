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
      rect carriage_door_open 202,66,18,42 14 e0
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
      { object: "alarm", at: [26, 76] },
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
      line - 296,100 318,100 c0
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
    `
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
