// Pictures for the sample world (worlds/sea/world.en.js), one per room, written the way the AI writes them
// (ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front in the short notation (one line per
// shape, js/picture.js), ids on whatever the story may change, cycles only where they add something. Kept in their
// own file only so the world's text is easier to read; they travel inside the change set's `add room` effects.

export default {
  // ---- CORRIDOR 7-B (the opening): one-point perspective down the Ministry corridor; the small green door low on the right --
  corridor: {
    version: 1,
    draw: `
      poly ceiling 0,0 320,0 174,52 146,52 fade:8,0/160,0/160,47.27
      poly floor 0,136 146,76 174,76 320,136 fade:8,0/160,136/160,83.83
      poly left_wall 0,0 90.52,32.24 90.52,98.8 0,136 fade:7,8/0,68/91.25,68
      poly left_wall_far 90.52,32.24 146,52 146,76 90.52,98.8 fade:8,0/90.52,68/146.67,68
      poly right_wall 320,0 229.48,32.24 229.48,98.8 320,136 fade:7,8/320,68/228.75,68
      poly right_wall_far 229.48,32.24 174,52 174,76 229.48,98.8 fade:8,0/229.48,68/173.33,68
      rect far_end 147,52,27,25 0
      line - -44,136 140.8,76 c0
      line - -10,136 144,76 c0
      line - 24,136 147.2,76 c0
      line - 58,136 150.4,76 c0
      line - 92,136 153.6,76 c0
      line - 126,136 156.8,76 c0
      line - 160,136 160,76 c0
      line - 194,136 163.2,76 c0
      line - 228,136 166.4,76 c0
      line - 262,136 169.6,76 c0
      line - 296,136 172.8,76 c0
      line - 330,136 176,76 c0
      line - 364,136 179.2,76 c0
      line - 17.5,129 302.5,129 c0
      line - 43.8,118 276.2,118 c0
      line - 67.2,108 252.8,108 c0
      line - 87.6,100 232.4,100 c0
      line - 103.7,93 216.3,93 c0
      line - 116.8,88 203.2,88 c0
      line - 0,0 146,52 c0
      line - 320,0 174,52 c0
      line - 0,136 146,76 c0
      line - 320,136 174,76 c0
      rect lamp0 127,3,66,5 15
      rect lamp1 136,17,48,5 15
      rect lamp2 142,29,36,3 15
      rect lamp3 147,37,26,3 15
      rect lamp4 150,42,20,3 15
      poly door 240,83 253,86 253,107 240,102 fade:10,2/228.63,0/261.13,0 e0
      line door_panel 243,87 243,101 c2
      line door_panel2 250,88 250,104 c2
      dots frame_light 240,82 242,83 244,83 246,83 248,84 250,84 252,85 254,85 c14
      dots jamb 239,82 239,84 239,86 239,88 239,90 239,92 239,94 239,96 239,98 239,100 239,102 c6
      dots jamb_light 239,83 239,85 239,87 239,89 239,91 239,93 239,95 239,97 239,99 239,101 c14
      dots knob 245,95 c14
      dots knob_shadow 245,96 c6
      dots plaque 242,78 242,79 243,78 243,79 243,80 244,79 244,80 245,79 245,80 246,79 246,80 247,79 247,80 248,79 248,80 249,79 249,80 249,81 250,79 250,80 250,81 251,80 251,81 c14
      dots plaque_edge 242,77 243,77 244,78 245,78 246,78 247,78 248,78 249,78 250,78 251,79 c6
      dots door_light 241,103 242,103 243,103 244,104 245,104 246,105 247,105 248,105 249,106 250,106 251,107 252,107 c14
      poly spill 240,104 253,109 254.82,126.2 216.34,126.2 fade:,14/0,126.2/0,100.2
      rect puddle1 227,106,15,1 mix:1,3@0.37
      rect puddle2 223,107,23,1 mix:1,3@0.56
      rect puddle3 223,108,23,1 mix:1,3@0.75
      rect puddle4 223,109,23,1 mix:1,3@0.56
      rect puddle5 227,110,15,1 mix:1,3@0.37
      poly camera 292,26 301,24 301,32 292,34 7
      line camera_top 292,26 301,24 c15
      rect lens 285,27,7,6 8
      dots - 285,29 c0
      dots camera_light 299,28 c12
      rect camera_arm 303,12,2,16 0
      poly speaker 34,21 51,26 51,37 34,33 stripes:0,8
      line - 34,21 34,33 c0
      line - 51,26 51,37 c0
      poly poster 62,45 96,50 96,72 62,75 15 e0
      ellipse eye_rim 79,60,14.53,6.15 0
      ellipse eye 79,60,13,5.5 7
      ellipse iris 79,60,4.2,4.2 12
      ellipse pupil 79,60,2.49,2.49 0
      dots slogan 67,68 68,68 72,68 73,68 74,68 75,68 76,68 77,67 81,67 82,67 83,67 84,67 85,67 86,67 90,67 91,66 67,71 68,71 72,71 73,71 74,71 75,71 76,71 77,70 81,70 82,70 83,70 84,70 85,70 86,70 90,70 91,69 c4
    `,
    cycles: [
      { name: "door light", areas: ["door_light", "jamb_light", "frame_light", "spill"], colors: [14, 6], style: "pingpong", ms: 900 },
      { name: "lamps", areas: ["lamp0", "lamp1", "lamp2", "lamp3", "lamp4"], colors: [15, 7], style: "flicker", ms: [1500, 7000] },
      { name: "camera", areas: ["camera_light"], colors: [12, 8], style: "blink", ms: 700 }
    ],
    overlays: [
      { object: "stamp", at: [222, 112], alt: "A rubber stamp lies on the lino by the puddle." },
      { object: "suggestion_box", at: [72, 84], alt: "A small wooden suggestion box hangs on the wall under the poster." }
    ]
  },

  // ---- THE BEACH: wide landscape, the sea, the dark lighthouse, the green door standing in the sand -------------
  beach: {
    version: 1,
    draw: `
      rect sky 0,0,320,58 fade:0,1/0,0/0,58
      dots stars 12,8 40,20 77,6 103,30 131,12 170,4 190,26 228,9 281,14 300,36 60,40 150,44 c7
      ellipse halo 252,20,15,15 mix:,1@0.5
      ellipse moon 252,20,9,9 15
      rect sea 0,58,320,34 fade:1,0/0,58/0,92
      line moonpath 244,61 260,61 c9
      line moonpath2 240,65 264,65 c15
      line moonpath3 236,70 268,70 c9
      line moonpath4 232,76 272,76 c15
      line moonpath5 226,83 278,83 c9
      poly rock_far 196,58 202,53 214,52 221,58 0
      poly lighthouse 205,53 207,33 212,33 214,53 7
      rect lantern 206,29,7,4 8
      poly - 205,29 209.5,25 214,29 0
      poly surf 0,89 80,91 160,88 240,92 320,89 320,94 240,96 160,93 80,96 0,94 mix:1,7@0.35
      poly sand 0,94 80,96 160,93 240,96 320,94 320,136 0,136 fade:8,6/0,94/0,136
      poly pier 0,120 0,136 30,136 104,60 99,60 fade:6,8/0,136/0,60 e0
      line - 52,82 52,92 c0
      line - 72,72 72,80 c0
      line - 88,66 88,71 c0
      poly rocks 262,96 276,78 296,70 320,66 320,118 284,112 mix:0,8@0.25
      ellipse cave_mouth 304,96,12,14 0
      poly door 150,100 162,98 162,118 150,120 fade:10,2/146,0/166,0 e0
      dots knob 159,109 c14
      dots door_light 150,121 152,121 154,120 156,120 158,119 160,119 162,118 163,99 163,103 163,107 163,111 163,115 c14
      poly spill 150,121 163,118 190,128 146,134 fade:14,/0,120/0,134
      dots footprints 170,126 176,130 168,132 182,134 c6
    `,
    cycles: [
      {name: "door", areas: ["door_light", "spill"], colors: [14,6], style: "pingpong", ms: 900},
      {name: "moon on the water", areas: ["moonpath", "moonpath2", "moonpath3", "moonpath4", "moonpath5"], colors: [9,15,1], style: "rotate", ms: 600}
    ]
  },

  // ---- THE TIDE LINE: looking down at the sand; weed, a glove, a shoe, a page; the shell lies here ---------------
  tideline: {
    version: 1,
    draw: `
      rect sea 0,0,320,34 fade:0,1/0,0/0,34
      rect sand 0,30,320,106 mix:6,8@0.4
      poly wet 0,34 60,40 130,36 200,42 260,37 320,41 320,62 0,58 fade:8,/0,40/0,62
      poly foam 0,30 60,36 130,32 200,38 260,33 320,37 320,42 260,38 200,43 130,37 60,41 0,35 mix:1,7@0.5
      line weed 0,74 30,70 64,76 96,72 130,79 170,74 210,80 250,75 290,81 320,77 c2
      line - 0,76 30,72 64,78 96,74 130,81 170,76 210,82 250,77 290,83 320,79 c0
      dots - 20,71 44,73 88,75 118,77 150,78 192,79 236,76 272,80 304,79 c10
      poly glove 70,84 86,82 92,86 96,84 97,88 84,92 72,90 7 e8
      poly shoe 214,86 232,85 236,90 228,94 212,93 4 e0
      dots - 220,87 224,87 c15
      poly page 128,94 156,90 160,108 132,112 mix:15,7@0.45 e7
      line - 134,98 152,95 c8
      line - 135,102 148,100 c8
      dots prints 40,120 52,116 44,128 58,124 270,110 282,114 276,122 290,126 c8
    `,
    cycles: [
      {name: "foam", areas: ["foam"], colors: [7,9], style: "pingpong", ms: 1200}
    ],
    overlays: [
      {object: "shell", at: [182,104], alt: "A pale shell lies near the page."}
    ]
  },

  // ---- THE CAVE: from inside, looking out through the mouth at the night sea --------------------------------------
  cave: {
    version: 1,
    draw: `
      rect sky 0,0,320,80 fade:0,1/0,0/0,80
      dots stars 80,40 120,34 200,30 236,44 150,52 c7
      ellipse moon 206,50,7,7 15
      rect sea 0,80,320,30 fade:1,0/0,80/0,110
      line glint 196,84 216,84 c15
      line glint2 192,90 220,90 c9
      poly lighthouse 118,80 120,66 123,66 125,80 7
      poly roof 0,0 320,0 320,42 262,30 200,22 140,24 92,34 52,50 0,62 mix:0,8@0.15
      poly left 0,62 52,50 70,78 62,108 0,136 mix:0,8@0.2
      poly right 320,42 262,30 252,62 262,98 320,122 mix:0,8@0.2
      poly floor 0,136 62,108 110,104 200,102 262,98 320,122 320,136 fade:8,0/0,104/0,136
      ellipse pool 170,120,40,6 mix:0,1@0.5
      line pool_glint 160,120 176,120 c9
      dots drips 96,35 142,25 198,23 240,29 c9
    `,
    cycles: [
      {name: "drips", areas: ["drips", "pool_glint"], colors: [9,0], style: "blink", ms: 1300}
    ]
  },

  // ---- THE PIER: eye level, the boards running out to sea ---------------------------------------------------------
  pier: {
    version: 1,
    draw: `
      rect sky 0,0,320,60 fade:0,1/0,0/0,60
      dots stars 20,10 60,30 100,12 140,40 220,18 260,34 300,8 190,6 c7
      ellipse moon 60,22,8,8 15
      rect sea 0,60,320,76 fade:1,0/0,60/0,136
      dots glints 30,70 44,82 20,98 58,74 270,72 290,90 250,104 300,120 24,124 c9
      poly lighthouse 170,59 171,46 174,46 175,59 7
      poly deck 60,136 260,136 166,62 154,62 fade:6,8/0,136/0,62
      line gaps 72.7,126 247.3,126 c1
      line gaps2 87.9,114 232.1,114 c1
      line gaps3 100.6,104 219.4,104 c1
      line gaps4 112.1,95 207.9,95 c1
      line gaps5 122.2,87 197.8,87 c1
      line - 131.1,80 188.9,80 c0
      line - 138.8,74 181.2,74 c0
      line - 145.1,69 174.9,69 c0
      line - 60,136 154,62 c0
      line - 260,136 166,62 c0
      line posts 64,133 64,96 c6
      line - 88,114 88,92 c6
      line - 112,95 112,82 c6
      line - 130,81 130,73 c6
      line - 145,69 145,65 c6
      line - 256,133 256,96 c6
      line - 232,114 232,92 c6
      line - 208,95 208,82 c6
      line - 190,81 190,73 c6
      line - 175,69 175,65 c6
      line rope 64,98 88,93 112,83 130,74 145,66 156,62 c7
      line - 256,98 232,93 208,83 190,74 175,66 164,62 c7
      ellipse lifebuoy 52,104,10,10 4 e0
      ellipse - 52,104,5,5 1
      line - 42,104 46,104 c15
      line - 58,104 62,104 c15
      line - 52,94 52,98 c15
      line - 52,110 52,114 c15
      line paint 45,99 49,96 c8
    `,
    cycles: [
      {name: "the sea under the boards", areas: ["gaps", "gaps2", "gaps3", "gaps4", "gaps5"], colors: [1,9], style: "pingpong", ms: 1100}
    ]
  },

  // ---- END OF THE PIER: across the water to the lighthouse; the boat by the last post -----------------------------
  pier_end: {
    version: 1,
    draw: `
      rect sky 0,0,320,70 fade:0,1/0,0/0,70
      dots stars 16,12 96,8 140,30 180,14 270,10 300,40 120,52 40,44 c7
      ellipse moon 64,28,8,8 15
      rect sea 0,70,320,66 fade:1,0/0,70/0,136
      line glints 56,74 72,74 c15
      line glints2 50,80 78,80 c9
      line glints3 46,88 84,88 c15
      line glints4 40,98 90,98 c9
      poly rock 198,74 210,62 242,60 260,74 mix:0,8@0.3
      poly lighthouse 219,62 223,22 233,22 237,62 fade:15,7/219,0/237,0 e0
      poly - 220.5,47 235.5,47 235,42 221,42 4
      rect gallery 219,20,18,2 0
      rect lantern 222,12,12,8 8 e0
      line - 226,12 226,19 c0
      line - 230,12 230,19 c0
      poly - 220,12 228,5 236,12 0
      poly deck 0,136 0,110 148,110 170,136 fade:6,8/0,136/0,110 e0
      line - 0,118 154,118 c0
      line - 0,127 162,127 c0
      rect post 138,88,7,24 6 e0
      ellipse ring 148,102,3,3 none e7
    `,
    cycles: [
      {name: "moon on the water", areas: ["glints", "glints2", "glints3", "glints4"], colors: [15,9,1], style: "rotate", ms: 700}
    ],
    overlays: [
      {object: "boat", at: [174,116], alt: "A small blue rowing boat is tied to the post."}
    ]
  },

  // ---- THE BATHING HUTS: a row of faded huts and one freshly painted -----------------------------------------------
  huts: {
    version: 1,
    draw: `
      rect sky 0,0,320,70 fade:0,1/0,0/0,70
      dots stars 24,10 70,22 120,6 180,18 230,8 290,24 c7
      poly dunes 0,70 40,52 100,60 170,44 240,58 290,48 320,56 320,80 0,80 mix:0,8@0.3
      rect sand 0,78,320,58 fade:8,6/0,90/0,136
      poly - 9,62 32,48 55,62 8 e0
      rect - 12,62,40,38 stripes:7,8 e0
      rect - 24,74,16,26 8 e0
      poly - 57,62 80,48 103,62 8 e0
      rect - 60,62,40,38 stripes:7,8 e0
      rect - 72,74,16,26 8 e0
      poly - 105,62 128,48 151,62 8 e0
      rect - 108,62,40,38 stripes:7,8 e0
      rect - 120,74,16,26 8 e0
      poly hut_roof 153,62 176,46 199,62 4 e0
      rect hut 156,62,40,38 stripes:15,9 e0
      rect hut_door 168,74,16,26 1 e0
      rect padlock 180,85,3,3 14
      poly - 201,62 224,48 247,62 8 e0
      rect - 204,62,40,38 stripes:7,8 e0
      rect - 216,74,16,26 8 e0
      poly - 249,62 272,48 295,62 8 e0
      rect - 252,62,40,38 stripes:7,8 e0
      rect - 264,74,16,26 8 e0
      poly flag 176,34 186,37 176,40 12
      line - 176,34 176,46 c7
    `
  },

  // ---- THE DUNES: a boardwalk winding between dunes towards the glow of the promenade ----------------------------
  dunes: {
    version: 1,
    draw: `
      rect sky 0,0,320,70 fade:0,1/0,0/0,70
      dots stars 30,12 80,6 140,20 210,10 260,28 300,6 c7
      ellipse glow 170,70,70,14 mix:,6@0.35
      dots town 140,66 150,65 162,66 176,64 188,66 200,65 c14
      rect ground 0,80,320,56 fade:8,6/0,80/0,136
      poly dune_far 0,76 60,60 120,72 220,66 280,58 320,64 320,90 0,90 mix:0,6@0.25
      poly dune_left 0,136 0,70 40,66 90,82 120,100 96,136 fade:6,8/0,70/0,136
      poly dune_right 320,136 320,74 270,70 226,86 204,104 228,136 fade:6,8/0,70/0,136
      poly path 110,136 214,136 172,78 160,78 6 e0
      line - 114,128 208,128 c0
      line - 124,116 200,116 c0
      line - 134,104 190,104 c0
      line - 144,94 183,94 c0
      line - 151,86 177,86 c0
      line grass 10,70 8,60 c2
      line grass2 18,68 21,57 c10
      line grass3 30,67 28,58 c2
      line grass4 52,70 55,61 c10
      line grass5 70,76 68,66 c2
      line grass6 280,70 282,60 c10
      line grass7 292,72 290,62 c2
      line grass8 306,73 309,63 c10
      line grass9 252,76 250,67 c2
      line grass10 238,81 241,72 c10
    `,
    cycles: [
      {name: "grass", areas: ["grass", "grass2", "grass3", "grass4", "grass5", "grass6", "grass7", "grass8", "grass9", "grass10"], colors: [2,10], style: "flicker", ms: [800,2600]}
    ]
  },

  // ---- THE PROMENADE: railings, lamps that give no light, the hotel, the carousel -------------------------------
  promenade: {
    version: 1,
    draw: `
      rect sky 0,0,320,100 fade:0,1/0,0/0,100
      dots stars 130,10 170,24 210,8 120,40 190,46 c7
      rect hotel 8,20,104,84 fade:7,8/8,0/112,0 e0
      poly - 4,20 60,6 116,20 8 e0
      rect - 20,30,10,12 0
      rect - 38,30,10,12 0
      rect - 56,30,10,12 0
      rect - 74,30,10,12 0
      rect - 92,30,10,12 0
      rect - 20,48,10,12 0
      rect - 38,48,10,12 0
      rect - 56,48,10,12 0
      rect - 74,48,10,12 0
      rect - 92,48,10,12 0
      rect - 20,66,10,12 0
      rect - 38,66,10,12 0
      rect - 56,66,10,12 0
      rect - 74,66,10,12 0
      rect - 92,66,10,12 0
      rect window11 20,30,10,12 14
      poly awning 38,80 82,80 86,88 34,88 stripes:4,15
      rect hotel_door 50,88,20,16 fade:14,6/0,88/0,104 e0
      poly canopy 214,50 256,28 298,50 stripes:12,15 e0
      rect - 218,50,76,6 4 e0
      dots bulbs 222,53 230,53 238,53 246,53 254,53 262,53 270,53 278,53 286,53 c14
      line - 230,56 230,92 c14
      line - 256,56 256,92 c14
      line - 282,56 282,92 c14
      poly - 222,74 238,72 240,78 224,80 15
      poly - 248,80 264,78 266,84 250,86 7
      poly - 274,70 290,68 292,74 276,76 6
      ellipse carousel_base 256,94,42,6 8 e0
      rect ground 0,104,320,32 fade:8,0/0,104/0,136
      ellipse lamps 140,62,3,3 15
      line - 140,65 140,104 c8
      ellipse lamps2 168,66,3,3 15
      line - 168,69 168,104 c8
      ellipse lamps3 196,62,3,3 15
      line - 196,65 196,104 c8
      line railing 0,114 320,114 c15
      line - 0,122 320,122 c7
      line - 6,114 6,136 c7
      line - 26,114 26,136 c7
      line - 46,114 46,136 c7
      line - 66,114 66,136 c7
      line - 86,114 86,136 c7
      line - 106,114 106,136 c7
      line - 126,114 126,136 c7
      line - 146,114 146,136 c7
      line - 166,114 166,136 c7
      line - 186,114 186,136 c7
      line - 206,114 206,136 c7
      line - 226,114 226,136 c7
      line - 246,114 246,136 c7
      line - 266,114 266,136 c7
      line - 286,114 286,136 c7
      line - 306,114 306,136 c7
    `,
    cycles: [
      {name: "carousel lights", areas: ["bulbs"], colors: [14,6], style: "rotate", ms: 500}
    ]
  },

  // ---- THE CAROUSEL: close-up; the grey horse with 7-B on its saddle --------------------------------------------
  carousel: {
    version: 1,
    draw: `
      rect night 0,0,320,136 fade:0,1/0,0/0,136
      poly - 0,0 40,0 40,26 0,26 4
      poly - 40,0 80,0 80,26 40,26 15
      poly - 80,0 120,0 120,26 80,26 4
      poly - 120,0 160,0 160,26 120,26 15
      poly - 160,0 200,0 200,26 160,26 4
      poly - 200,0 240,0 240,26 200,26 15
      poly - 240,0 280,0 280,26 240,26 4
      poly - 280,0 320,0 320,26 280,26 15
      ellipse - 20,26,20,6 4
      ellipse - 60,26,20,6 15
      ellipse - 100,26,20,6 4
      ellipse - 140,26,20,6 15
      ellipse - 180,26,20,6 4
      ellipse - 220,26,20,6 15
      ellipse - 260,26,20,6 4
      ellipse - 300,26,20,6 15
      dots bulbs 10,30 30,31 50,30 70,31 90,30 110,31 130,30 150,31 170,30 190,31 210,30 230,31 250,30 270,31 290,30 310,31 c14
      ellipse platform 160,132,176,16 8 e0
      rect pole 157,32,6,104 fade:14,6/157,0/163,0 e0
      line - 60,32 60,112 c14
      ellipse - 60,76,20,9 15 e0
      poly - 74,72 86,58 92,62 82,76 15 e0
      line - 46,82 42,96 c15
      line - 54,84 54,98 c15
      line - 68,84 70,98 c15
      line - 76,82 80,94 c15
      line - 262,32 262,124 c14
      ellipse - 262,96,20,9 6 e0
      poly - 248,92 236,78 230,82 240,96 6 e0
      line - 250,102 246,116 c6
      line - 270,104 272,118 c6
      ellipse horse 160,86,32,13 7 e0
      poly horse_neck 184,80 204,56 214,60 198,86 7 e0
      poly horse_head 202,54 222,58 224,66 208,64 7 e0
      line mane 186,78 204,54 c15
      dots eye 214,59 c0
      line legs 138,94 128,114 c7
      line - 148,96 146,118 c7
      line - 174,96 178,118 c7
      line - 184,94 194,112 c7
      poly saddle 148,72 174,72 176,80 146,80 4 e0
      dots number 155,76 156,76 157,76 157,77 163,76 164,76 165,77 164,78 c14
      line tail 128,84 120,98 c8
    `,
    cycles: [
      {name: "bulbs", areas: ["bulbs"], colors: [14,6], style: "rotate", ms: 450}
    ]
  },

  // ---- HOTEL MIRAMAR (lobby): desk, board of keys with one hook empty, bell, palms, stairs ------------------------
  lobby: {
    version: 1,
    draw: `
      rect wall 0,0,320,92 mix:6,4@0.3
      line - 0,20 320,20 c14
      rect floor 0,92,320,44 fade:4,0/0,92/0,136
      poly worn 120,136 200,136 176,92 150,92 mix:4,6@0.5
      rect doors 8,30,50,62 fade:14,6/0,30/0,92 e0
      line - 33,30 33,92 c0
      rect keyboard 112,24,70,30 6 e0
      line - 121,30 121,34 c14
      line - 131,30 131,34 c14
      line - 141,30 141,34 c14
      line - 151,30 151,34 c14
      line - 161,30 161,34 c14
      line - 171,30 171,34 c14
      line - 121,39 121,43 c14
      line - 131,39 131,43 c14
      line - 141,39 141,43 c14
      line - 151,39 151,43 c14
      line - 161,39 161,43 c14
      line - 171,39 171,43 c14
      line - 121,48 121,52 c14
      line - 131,48 131,52 c14
      line - 141,48 141,52 c14
      line - 151,48 151,52 c14
      line - 161,48 161,52 c14
      line - 171,48 171,52 c14
      rect hook11 139,38,5,6 6
      dots - 141,38 c0
      rect desk 90,66,112,30 fade:6,4/0,66/0,96 e0
      rect - 86,62,120,5 6 e0
      ellipse bell 148,60,5,3 14 e6
      dots - 148,56 c14
      poly stairs 226,92 320,8 320,92 4 e0
      line - 236,92 320,92 c0
      line - 247,82 320,82 c0
      line - 258,72 320,72 c0
      line - 269,62 320,62 c0
      line - 280,52 320,52 c0
      line - 291,42 320,42 c0
      line - 302,32 320,32 c0
      line - 313,22 320,22 c0
      line banister 222,76 316,-6 c6
      rect palm 70,82,14,12 6 e0
      poly - 77,82 56,60 62,58 2
      poly - 77,82 94,56 99,60 2
      poly - 77,82 72,50 80,50 10
      rect palm2 208,82,14,12 6 e0
      poly - 215,82 196,58 202,56 2
      poly - 215,82 232,60 236,64 10
      ellipse chandelier 160,6,22,4 14
      ellipse glow 160,8,50,12 mix:,14@0.12
    `
  },

  // ---- THE DINING ROOM: the long table, the guests, the empty chair ------------------------------------------------
  dining: {
    version: 1,
    draw: `
      rect walls 0,0,320,136 fade:4,0/0,0/0,70
      rect back 110,30,100,40 mix:4,0@0.5
      rect window 140,34,40,26 1 e0
      line - 160,34 160,60 c0
      poly floor 0,136 110,70 210,70 320,136 fade:0,4/0,70/0,136
      ellipse chandelier 160,12,30,6 14 e6
      ellipse glow 160,14,70,18 mix:,14@0.1
      dots - 134,20 146,22 160,22 174,22 186,20 c15
      ellipse guest_far 160,62,5,6 6
      poly - 150,76 154,66 166,66 170,76 0
      poly - 40,136 52,104 92,104 100,136 5
      ellipse guest1 72,94,10,12 6
      poly - 78,120 86,96 110,96 114,120 0
      ellipse guest2 98,88,8,9 6
      poly - 102,104 108,86 124,86 126,104 1
      ellipse - 116,80,6,7 6
      poly - 118,92 122,80 132,80 134,92 0
      ellipse - 128,75,5,5 6
      poly - 280,136 268,104 228,104 220,136 0
      ellipse guest5 248,94,10,12 6
      poly - 242,120 234,96 210,96 206,120 5
      ellipse - 222,88,8,9 6
      poly - 218,104 212,86 196,86 194,104 0
      ellipse - 204,80,6,7 6
      poly - 202,92 198,80 188,80 186,92 1
      ellipse - 192,75,5,5 6
      poly table 96,136 224,136 186,72 134,72 fade:15,7/0,136/0,72 e7
      ellipse dessert 140,110,6,3 15 e7
      ellipse - 178,100,5,2 15 e7
      ellipse - 160,86,4,2 15 e7
      rect candles 150,94,2,6 15
      rect - 168,94,2,6 15
      rect - 159,80,2,5 15
      dots flames 150,93 151,92 168,93 169,92 159,79 160,78 c14
      rect chair 138,112,44,24 6 e0
      rect - 144,116,32,16 4
      rect card 152,106,16,5 15 e7
    `,
    cycles: [
      {name: "candles", areas: ["flames"], colors: [14,12], style: "flicker", ms: [300,1400]}
    ]
  },

  // ---- FIRST FLOOR: a hotel corridor, warm where the Ministry's is grey; door 11 ajar -------------------------------
  hallway: {
    version: 1,
    draw: `
      poly ceiling 0,0 320,0 180,50 140,50 fade:6,0/160,0/160,46
      poly floor 0,136 140,82 180,82 320,136 fade:4,0/160,136/160,86
      poly left_wall 0,0 140,50 140,82 0,136 fade:6,0/0,68/140,68
      poly right_wall 320,0 180,50 180,82 320,136 fade:6,0/320,68/180,68
      rect far_window 140,50,40,32 1
      line - 160,50 160,82 c0
      line - 140,66 180,66 c0
      line - 0,0 140,50 c0
      line - 320,0 180,50 c0
      line - 0,136 140,82 c0
      line - 320,136 180,82 c0
      poly runner 110,136 210,136 168,82 152,82 mix:4,6@0.3
      poly door11 18,32 46,42 46,111 18,122 6 e0
      line crack 47,43 47,110 c14
      poly spill 46,111 48,110 80,124 56,130 mix:,14@0.3
      dots key 42,76 43,76 43,77 c14
      poly - 78,58 96,64 96,96 78,101 6 e0
      poly - 110,68 120,71 120,87 110,90 6 e0
      poly - 302,32 274,42 274,111 302,122 6 e0
      poly - 242,58 224,64 224,96 242,101 6 e0
      poly - 210,68 200,71 200,87 210,90 6 e0
      ellipse sconces 62,52,2,3 14
      ellipse sconces2 104,64,1,2 14
      ellipse sconces3 258,52,2,3 14
      ellipse sconces4 216,64,1,2 14
    `,
    cycles: [
      {name: "sconces", areas: ["sconces", "sconces2", "sconces3", "sconces4"], colors: [14,6], style: "flicker", ms: [2000,8000]}
    ]
  },

  // ---- ROOM 11: the window on the sea, the coat on the chair, the bed; the letter on the pillow ------------------
  room11: {
    version: 1,
    draw: `
      rect wall 0,0,320,100 fade:8,0/0,0/0,100
      rect floor 0,100,320,36 fade:6,0/0,136/0,100
      line - 0,110 320,110 c0
      line - 0,122 320,122 c0
      rect window_sky 114,18,92,34 fade:0,1/0,18/0,52
      rect window_sea 114,52,92,22 fade:1,0/0,52/0,74
      poly lighthouse 176,52 178,38 181,38 183,52 7
      line glint 130,58 146,58 c9
      rect frame 110,14,100,64 none e7
      line - 160,14 160,77 c7
      line - 110,46 209,46 c7
      poly curtain 96,8 114,8 110,86 92,88 4 e0
      poly curtain2 206,8 224,8 228,88 210,86 4 e0
      rect chair 40,58,30,40 6 e0
      rect - 34,92,44,6 6 e0
      line - 36,98 36,120 c0
      line - 76,98 76,120 c0
      poly coat 36,56 74,56 80,96 62,104 44,104 30,96 1 e0
      line - 55,58 55,100 c9
      dots - 52,70 52,80 52,90 c7
      rect bed 200,86,120,28 6 e0
      poly cover 204,80 320,80 320,106 200,106 fade:15,7/0,80/0,106 e7
      rect headboard 306,56,14,50 6 e0
      ellipse pillow 288,80,16,6 15 e7
    `,
    overlays: [
      {object: "letter", at: [280,75], alt: "A letter lies on the pillow."}
    ]
  },

  // ---- THE SQUARE: the town hall clock at a quarter past five, a dry fountain, shut shops, the lit café -----------
  square: {
    version: 1,
    draw: `
      rect sky 0,0,320,100 fade:0,1/0,0/0,100
      dots stars 20,8 60,20 100,6 220,12 260,30 300,10 c7
      rect tower 140,8,40,40 fade:7,8/140,0/180,0 e0
      poly - 136,8 160,-4 184,8 8 e0
      ellipse clock 160,26,11,11 15 e0
      line hands 160,26 169,26 c0
      line - 160,26 163,32 c0
      rect town_hall 110,48,100,54 fade:7,8/110,0/210,0 e0
      rect - 124,58,10,16 0
      rect - 144,58,10,16 0
      rect - 166,58,10,16 0
      rect - 186,58,10,16 0
      rect - 150,80,20,22 0
      rect shops 0,52,106,50 8 e0
      rect - 8,64,28,26 stripes:7,8 e0
      rect - 70,64,28,26 stripes:7,8 e0
      rect post_door 44,70,18,32 1 e0
      dots - 58,86 c14
      rect cafe 214,52,106,50 8 e0
      rect cafe_window 236,64,56,24 fade:14,6/0,64/0,88 e0
      poly awning 230,56 298,56 302,64 226,64 stripes:4,15
      rect ground 0,102,320,34 mix:8,0@0.45
      poly cafe_light 236,102 292,102 304,120 228,120 mix:,6@0.35
      ellipse fountain 160,118,46,9 7 e0
      ellipse - 160,117,40,6 8
      rect - 156,94,8,22 7 e0
      ellipse - 160,94,14,4 7 e0
      dots pigeons 90,118 92,118 96,122 98,122 226,128 228,128 236,124 238,124 244,130 c7
    `
  },

  // ---- POST OFFICE: through the grille, the postmaster and his pigeonholes ----------------------------------------
  post_office: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:6,0/0,0/0,120
      rect pigeonholes 20,10,280,74 6 e0
      line - 20,24 300,24 c0
      line - 20,38 300,38 c0
      line - 20,52 300,52 c0
      line - 20,66 300,66 c0
      line - 40,10 40,84 c0
      line - 60,10 60,84 c0
      line - 80,10 80,84 c0
      line - 100,10 100,84 c0
      line - 120,10 120,84 c0
      line - 140,10 140,84 c0
      line - 160,10 160,84 c0
      line - 180,10 180,84 c0
      line - 200,10 200,84 c0
      line - 220,10 220,84 c0
      line - 240,10 240,84 c0
      line - 260,10 260,84 c0
      line - 280,10 280,84 c0
      rect letters 24,14,12,8 15
      rect - 64,28,12,8 15
      rect - 104,14,12,8 7
      rect - 144,42,12,8 15
      rect - 204,28,12,8 7
      rect - 244,56,12,8 15
      rect - 284,14,12,8 15
      rect - 44,70,12,8 7
      rect - 264,70,12,8 15
      poly light 140,14 180,14 240,112 80,112 mix:,14@0.12
      poly postmaster 112,112 124,92 196,92 208,112 1 e0
      ellipse head 160,76,15,18 fade:14,6/150,0/172,0 e0
      poly cap 143,64 177,64 175,54 145,54 1 e0
      rect - 141,63,38,3 0
      dots spectacles 153,74 154,74 155,74 165,74 166,74 167,74 156,73 164,73 c15
      line moustache 154,84 166,84 c0
      poly lampshade 150,0 170,0 180,14 140,14 2 e0
      ellipse bulb 160,15,4,2 14
      rect grille 56,40,208,2 7
      line - 64,42 64,112 c7
      line - 78,42 78,112 c7
      line - 92,42 92,112 c7
      line - 106,42 106,112 c7
      line - 120,42 120,112 c7
      line - 134,42 134,112 c7
      line - 148,42 148,112 c7
      line - 172,42 172,112 c7
      line - 186,42 186,112 c7
      line - 200,42 200,112 c7
      line - 214,42 214,112 c7
      line - 228,42 228,112 c7
      line - 242,42 242,112 c7
      line - 256,42 256,112 c7
      rect counter 0,112,320,24 fade:6,0/0,112/0,136 e0
      line - 0,112 320,112 c14
    `
  },

  // ---- THE CAFÉ: four tables, the waiter folding a napkin, the coffee machine sighing ---------------------------
  cafe: {
    version: 1,
    draw: `
      rect wall 0,0,320,92 mix:6,14@0.25
      line - 0,70 320,70 c4
      rect window 118,12,84,50 fade:0,1/0,12/0,62 e6
      line - 160,12 160,62 c6
      ellipse fountain_far 140,58,10,2 8
      rect - 138,50,4,8 8
      rect floor 0,92,320,44 mix:8,7@0.5
      rect counter 0,60,92,40 4 e0
      rect - 0,58,96,4 6 e0
      rect machine 20,34,44,24 7 e0
      rect - 26,40,8,10 8
      rect - 50,40,8,10 8
      dots - 42,38 44,38 c12
      poly steam 36,32 40,20 36,10 42,4 46,12 42,22 44,32 mix:,15@0.5
      poly steam2 50,32 54,22 50,14 56,8 58,16 56,26 mix:,7@0.5
      ellipse table 150,98,26,6 15 e7
      rect - 148,104,4,20 0
      rect - 140,122,20,3 0
      ellipse table2 226,112,30,7 15 e7
      rect - 224,119,4,16 0
      line - 112,84 112,124 c0
      line - 112,104 126,104 c0
      line - 126,104 126,124 c0
      line - 188,84 188,124 c0
      line - 174,104 188,104 c0
      line - 174,104 174,124 c0
      poly waiter 272,54 300,54 306,124 266,124 0
      poly - 282,54 290,54 288,80 284,80 15
      dots - 285,55 286,55 287,55 c0
      rect apron 272,92,32,32 15 e7
      ellipse waiter_head 286,44,9,11 fade:14,6/280,0/294,0
      poly - 277,38 295,38 294,32 278,32 0
      poly napkin 256,78 270,74 268,86 15 e7
    `,
    cycles: [
      {name: "steam", areas: ["steam", "steam2"], colors: [15,7,8], style: "rotate", ms: 350}
    ],
    overlays: [
      {object: "coffee", at: [146,91], alt: "A cup of coffee steams on the table."}
    ]
  },

  // ---- THE STATION: one platform, a sleeping train, rails that stop a little way out ------------------------------
  station: {
    version: 1,
    draw: `
      rect sky 0,0,320,70 fade:0,1/0,0/0,70
      dots stars 230,10 270,24 300,8 250,40 290,52 c7
      poly canopy 0,0 190,0 190,16 0,30 8 e0
      line - 40,27 40,104 c8
      line - 110,21 110,82 c8
      line - 160,17 160,70 c8
      poly platform 0,136 0,100 196,62 204,62 150,136 fade:7,8/0,136/0,62
      line edge_line 150,136 204,62 c14
      poly ground 150,136 204,62 320,62 320,136 fade:0,8/0,136/0,62
      line rails 214,136 236,70 240,64 c7
      line - 270,136 254,70 252,64 c7
      poly train 196,50 320,20 320,116 196,66 fade:2,0/320,0/196,0 e0
      line - 196,50 320,20 c7
      poly - 214,50 226,47 226,56 214,59 0
      poly - 240,44 256,40 256,52 240,56 0
      poly train_door 270,37 290,32 290,92 270,86 0
      poly - 298,30 316,26 316,42 298,46 0
      rect bench 36,104,44,4 6 e0
      rect - 36,94,44,4 6 e0
      line - 40,108 40,118 c0
      line - 76,108 76,118 c0
      rect timetable 92,52,28,20 15 e0
      line - 96,57 116,57 c8
      line - 96,61 114,61 c8
      line - 96,65 116,65 c8
      line - 106,72 106,92 c0
      ellipse lamp 160,26,3,3 14
      ellipse lamp_glow 160,30,16,8 mix:,14@0.15
      dots signal 244,58 245,58 c12
    `,
    cycles: [
      {name: "signal", areas: ["signal"], colors: [12,4], style: "blink", ms: 1500}
    ]
  },

  // ---- THE LIGHTHOUSE ROCK: looking up at the tower from its foot ------------------------------------------------
  lighthouse_base: {
    version: 1,
    draw: `
      rect sky 0,0,320,136 fade:0,1/0,0/0,136
      dots stars 20,12 60,40 96,8 230,20 270,46 300,10 40,80 280,84 250,60 70,64 c7
      rect sea 0,112,320,24 1
      poly rock 0,136 0,124 60,114 116,118 204,118 262,110 320,122 320,136 mix:0,8@0.3
      poly foam 0,124 30,119 60,114 64,118 32,124 0,130 mix:,15@0.5
      poly foam2 262,110 300,116 320,122 320,127 298,121 262,114 mix:,15@0.5
      poly tower 122,136 198,136 178,20 142,20 fade:15,7/122,0/198,0 e0
      poly band 125,110 195,110 193.2,100 126.8,100 4
      poly band2 132.9,68 187.1,68 185.6,60 134.4,60 4
      rect gallery 134,16,52,4 0
      line - 134,12 186,12 c8
      line - 136,12 136,16 c8
      line - 184,12 184,16 c8
      rect lantern 144,4,32,12 8 e0
      line - 152,4 152,15 c0
      line - 160,4 160,15 c0
      line - 168,4 168,15 c0
      poly - 142,4 160,-6 178,4 0
      rect door 150,116,20,20 0
      ellipse - 160,116,10,5 0
      rect window 157,80,6,10 0
    `,
    cycles: [
      {name: "foam", areas: ["foam", "foam2"], colors: [15,9], style: "pingpong", ms: 1000}
    ],
    overlays: [
      {object: "boat", at: [40,112], alt: "The rowing boat is tied to the mooring ring."}
    ]
  },

  // ---- THE LANTERN ROOM: the great lens, and through the glass, the sea and the far beach -------------------------
  lantern: {
    version: 1,
    draw: `
      rect sky 0,0,320,64 fade:0,1/0,0/0,64
      dots stars 20,12 60,30 110,8 200,20 250,8 290,34 c7
      ellipse moon 276,22,7,7 15
      rect sea 0,64,320,42 fade:1,0/0,64/0,106
      rect beach_far 0,62,320,3 6
      dots town_far 30,61 40,60 52,61 64,60 76,61 c6
      dots far_door 236,62 237,62 236,63 237,63 c14
      rect frame_top 0,0,320,6 0
      rect - 0,0,8,106 0
      rect - 76,0,8,106 0
      rect - 312,0,8,106 0
      rect - 244,0,8,106 0
      rect sill 0,106,320,8 6 e0
      rect floor 0,114,320,22 mix:8,0@0.4
      rect pedestal 144,96,32,40 6 e0
      ellipse lamp 160,66,32,36 mix:7,8@0.5 e0
      ellipse - 160,66,24,27 none e15
      ellipse - 160,66,16,18 none e7
      ellipse - 160,66,9,10 none e15
      ellipse wick 160,66,4,4 0
      dots - 160,65 c6
    `,
    cycles: [
      {name: "the door far away", areas: ["far_door"], colors: [14,6], style: "pingpong", ms: 900}
    ]
  }
};

// ---- THE ENDINGS: one picture each (BRIEF.md §7). Each is a different shot from any room, and the strongest in the world. ----
// Shot list (viewpoint · horizon · main subject, size · lead colour):
//   photograph  from far above · no horizon · a grid of grey desks and one tiny figure at one of them, 5% · 8 dark grey
//   shell       far away, establishing · horizon y 84 · the lit lighthouse and its sweep, 15% of the width, right · 14 yellow
//   drowned     looking up from under the water · the surface at y 18, high · a broken moon and long rays, top left · 1 blue
//   died        close-up, at sand level · horizon y 94, low · a hand on the wet sand reaching for the sea, 35% of the width · 6 brown
export const endings = {
  photograph: {
    alt: "An office floor seen from far above: rows of identical grey desks in grey partitions, and at one of them a tiny figure sitting very still.",
    picture: {
      version: 1,
      draw: `
        rect floor 0,0,320,136 mix:7,8@0.5
        rect aisle_h 0,64,320,10 mix:7,8@0.3
        rect aisle_v 150,0,14,136 mix:7,8@0.3
        rect - 20,10,100,40 8 e0
        rect - 20,84,100,40 8 e0
        rect - 190,10,100,40 8 e0
        rect - 190,84,100,40 8 e0
        line - 70,10 70,50 c0
        line - 70,84 70,124 c0
        line - 240,10 240,50 c0
        line - 240,84 240,124 c0
        rect desk_a 28,18,34,22 7
        rect desk_b 78,18,34,22 7
        rect desk_c 28,92,34,22 7
        rect desk_d 78,92,34,22 7
        rect desk_e 198,18,34,22 7
        rect desk_f 248,18,34,22 7
        rect desk_g 198,92,34,22 7
        rect desk_you 248,92,34,22 7
        rect - 34,22,10,8 0
        rect - 84,22,10,8 0
        rect - 34,96,10,8 0
        rect - 84,96,10,8 0
        rect - 204,22,10,8 0
        rect - 254,22,10,8 0
        rect - 204,96,10,8 0
        rect - 254,96,10,8 0
        ellipse - 266,112,10,4 0
        ellipse you 266,106,5,5 0
        ellipse speaker 156,68,3,3 0
        rect door 300,56,20,24 mix:8,0@0.5
      `
    }
  },
  shell: {
    alt: "Far off across black water at night, a lighthouse on its rock throws a wide sweep of yellow light over the sea and the town. On the dark beach near the left, where a door stood, there is only a piece of driftwood.",
    picture: {
      version: 1,
      draw: `
        rect sky 0,0,320,84 fade:0,1/0,0/0,84
        dots stars 20,10 70,22 130,8 180,26 220,12 300,10 c15
        ellipse moon 50,24,9,9 15
        rect sea 0,84,320,52 fade:1,0/0,84/0,136
        poly beam_r 266,40 320,54 320,84 266,44 mix:,14@0.45
        poly beam_l 266,40 100,62 100,84 266,44 mix:,14@0.3
        rect shimmer 120,84,150,10 mix:,14@0.25
        poly rock 236,88 250,78 282,78 296,88 0
        poly tower 262,78 266,46 272,46 276,78 stripes:15,4
        ellipse glow 269,43,14,10 mix:,14@0.45
        ellipse lamp 269,43,4,3 14
        poly town 130,98 130,92 140,92 140,88 150,88 150,94 170,94 170,90 184,90 184,98 mix:8,0@0.5
        dots windows 134,95 144,92 158,96 176,94 c14
        poly beach 0,106 80,102 200,106 320,108 320,136 0,136 mix:6,0@0.55
        poly driftwood 38,118 58,112 64,115 44,121 6
        line - 50,116 60,110 c6
      `,
      cycles: [{ name: "the light", areas: ["beam_r", "beam_l", "glow"], colors: [14, 6], style: "pingpong", ms: 3000 }]
    }
  },
  drowned: {
    alt: "Seen from under the water, looking up: a pale, broken moon on the surface far above and long shafts of light going down into the dark, where a small red shoe and a grey glove drift slowly.",
    picture: {
      version: 1,
      draw: `
        rect water 0,0,320,136 fade:1,0/0,18/0,136
        rect surface 0,0,320,18 fade:11,3/0,0/0,18
        ellipse moon 80,8,14,6 15
        poly ray_a 70,10 10,136 80,136 mix:,11@0.18
        poly ray_b 84,10 120,136 190,136 mix:,11@0.14
        poly ray_c 92,10 230,136 300,136 mix:,11@0.1
        line ripples 20,14 36,17 52,14 68,17 c11
        line - 150,12 170,16 190,12 210,16 c3
        ellipse - 240,40,3,3 11
        ellipse - 250,62,2,2 11
        ellipse - 232,84,2,2 11
        poly shoe 190,104 202,98 214,104 214,110 190,110 4
        poly glove 120,116 132,108 142,116 138,126 124,126 7
      `,
      cycles: [{ name: "the surface", areas: ["ripples", "moon"], colors: [11, 15], style: "flicker", ms: [600, 2000] }]
    }
  },
  died: {
    alt: "A hand, close to the camera, lies open on the wet sand at the tide's edge, reaching for the sea. Beyond it, a thin strip of grey water under a pale dawn sky.",
    picture: {
      version: 1,
      draw: `
        rect sky 0,0,320,94 fade:8,7/0,0/0,94
        rect sea 0,86,320,10 mix:1,3@0.5
        rect foam 0,94,320,3 15
        rect sand 0,97,320,39 fade:6,8/0,97/0,136
        dots grains 30,110 80,126 150,104 210,118 270,108 300,128 c14
        poly sleeve 0,136 0,114 36,110 52,136 8 e0
        poly palm 40,136 46,112 100,106 124,112 128,124 100,134 mix:12,6@0.4 e6
        line f1 124,112 160,104 c12
        line f2 126,116 168,112 c12
        line f3 126,121 164,120 c12
        line f4 120,126 150,130 c12
        line thumb 62,112 70,100 c12
        ellipse - 250,114,16,3 mix:,8@0.4
      `
    }
  }
};
