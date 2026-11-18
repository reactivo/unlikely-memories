// Pictures for "The Last Word on Lantern Row" (worlds/lantern/world.en.js), one per room and one per ending, the way
// the AI writes them (BRIEF.md §7, ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front in the
// short notation, ids on what the story may change or a cycle animates.
//
// The shot list, written before drawing (viewpoint; horizon; main subject and its size; lead colour):
//   cab          through something (the cab's open front); its own horizon 86; the fog, a lamp smudge on the right third, small; white 15
//   row          eye level, looking in; 66, vanishing point at x 200; the street going away to the court doors, Pye on the right third (a third of the height); brown 6
//   bell         silhouette; the bar top at 88; men in caps, black against the fire on the left third (fire a fifth of the width); red 4
//   pie_shop     from above; none; the counter laid flat, two thirds of the width, trays of pies with one gap; yellow 14
//   court        looking up; 120; the high bench and Dr Mabbott, four fifths of the height, on the left third; green 2
//   last_lamp    wide landscape; 74 (the river wall); the dark lamp-post on the left third, Mr Fenn small at its foot, the hut on the right; blue 1
//   hut          eye level, looking in; 78, vanishing point at x 140; forty caps on the back wall, half the frame; light green 10
//   substation   looking up; none; the dynamo, the height of the frame, on the left third, the bare bulb above; light cyan 11
//   river_steps  looking down; 18; Pip small on the mud in the lower third, the river filling the middle; brown 6 (not next to the Row)
//   bridge       far away; 98; the Row across the water, a sixth of the width, on the left third; cyan 3
//   truth        (ending) from far above; none; the Row at dawn in a pattern of roofs, two small figures by the river; light magenta 13
//   relieved     (ending) close-up; none; the twelfth lamp's lantern, lit, three quarters of the frame; yellow 14
//   blamed       (ending) from far above; none; a sea of grey fog with chimney pots through it, one cold white point; dark grey 8
//   died         (ending) close-up; none; the canary's cage, three quarters of the frame, the bird with its head under its wing; light grey 7
// Read down: no two neighbours share a viewpoint, a horizon or a lead colour; the endings use the two viewpoints no
// room does (close-up, from far above).

export default {
  // ---- THE CAB (the start room): through the open front of a hansom cab; nothing out there but fog; the fare on the seat --
  cab: {
    version: 1,
    draw: `
      rect fog 0,0,320,86 fade:15,7/0,10/0,86
      ellipse lamp_glow 226,52,14,11 mix:,14@0.2
      line lamp_post 226,58 226,88 c7
      ellipse lamp 226,52,3,4 14
      rect cobbles 0,86,320,50 fade:7,8/0,86/0,136
      ellipse fog_bank 150,90,120,6 mix:,15@0.25
      poly side_l 0,0 44,12 44,112 0,136 mix:0,4@0.2
      poly side_r 320,0 284,12 284,112 320,136 mix:0,4@0.2
      poly roof 0,0 320,0 284,12 44,12 0
      line - 44,12 284,12 c8
      line - 44,12 44,112 c8
      line - 284,12 284,112 c8
      rect window 10,34,22,26 mix:7,15@0.5 e0
      line - 21,34 21,60 c8
      line hook 104,0 104,6 c14
      line reins 150,12 154,40 158,76 162,98 c6
      line - 178,12 176,44 174,80 172,100 c6
      poly door_l 44,70 70,78 70,114 44,120 6 e0
      line - 57,76 57,116 c0
      poly door_r 284,70 258,78 258,114 284,120 6 e0
      line - 271,76 271,116 c0
      poly floor 0,136 44,112 284,112 320,136 0
      rect seat 0,122,320,14 mix:4,0@0.35
      line - 0,122 320,122 c4
    `,
    cycles: [{ name: "the far lamp", areas: ["lamp_glow", "lamp"], colors: [14, 6], style: "pingpong", ms: 2600 }],
    overlays: [
      { object: "canary", at: [96, 6] },
      { object: "shilling", at: [200, 118] }
    ]
  },

  // ---- LANTERN ROW: eye level down the street to the court doors, in brown fog; the constable on the right ---------
  row: {
    version: 1,
    draw: `
      rect fog 0,0,320,66 fade:8,6/0,0/0,66
      poly wall_l 0,4 194,54 194,70 0,128 mix:8,0@0.4
      poly wall_r 320,0 206,54 206,70 320,128 mix:8,0@0.4
      poly street 0,128 194,70 206,70 320,128 320,136 0,136 fade:6,8/0,70/0,136
      line - 0,128 194,70 c8
      line - 320,128 206,70 c8
      rect court 190,44,20,26 0
      rect court_doors 194,52,12,18 mix:6,0@0.5 e8
      line - 200,52 200,70 c8
      rect house_window 12,58,40,34 0 e8
      line - 32,58 32,92 c8
      rect pie_window 272,60,38,32 mix:6,14@0.45 e0
      line - 291,60 291,92 c0
      rect shop_l 86,52,22,24 mix:8,6@0.3 e0
      rect shop_r 232,50,18,22 mix:8,6@0.3 e0
      ellipse fog_near 160,80,170,26 mix:,6@0.25
      line - 70,30 70,112 c0
      ellipse glow_l1 70,28,20,14 mix:,14@0.35
      ellipse lamp_l1 70,28,5,6 14 e0
      line - 136,46 136,88 c0
      ellipse glow_l2 136,44,12,9 mix:,14@0.35
      ellipse lamp_l2 136,44,3,4 14
      line - 170,54 170,77 c8
      ellipse lamp_l3 170,53,2,2 14
      line - 268,28 268,110 c0
      ellipse glow_r1 268,26,18,13 mix:,14@0.35
      ellipse lamp_r1 268,26,5,6 14 e0
      line - 226,46 226,86 c0
      ellipse glow_r2 226,44,11,8 mix:,14@0.35
      ellipse lamp_r2 226,44,3,4 14
      dots lamp_far 184,57 216,56 c14
      poly pye_cape 236,88 256,88 262,124 230,124 1 e0
      rect pye_legs 238,124,6,8 0
      rect - 248,124,6,8 0
      ellipse pye_head 246,81,5,6 7 e0
      ellipse pye_helmet 246,72,6,8 1 e0
      rect - 239,76,15,2 1
      dots - 246,63 c7
      dots pye_lamp 238,104 c14
      rect cobbles 0,126,320,10 mix:8,6@0.3
    `,
    cycles: [{ name: "the lamps", areas: ["lamp_l1", "lamp_l2", "lamp_r1", "lamp_r2", "glow_l1", "glow_r1"], colors: [14, 6], style: "flicker", ms: [1200, 6000] }]
  },

  // ---- THE BELL: men in caps in silhouette against the coal fire; the landlord at the far end of the bar ------------
  bell: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:14,4/30,0/320,0
      ellipse glow 64,96,96,70 mix:,14@0.35
      rect beams 0,6,320,7 0
      rect - 0,28,320,5 0
      line - 0,13 320,13 c4
      rect grate 30,88,66,40 0
      rect mantel 22,80,82,8 0
      poly fire 38,124 46,98 54,110 62,90 72,108 80,96 88,124 14
      poly fire_low 40,124 52,110 62,118 74,108 86,124 12
      ellipse coal 63,122,24,5 4
      rect bar 140,88,180,48 0
      line - 140,88 320,88 c6
      rect floor 0,128,320,8 0
      ellipse man1_head 120,62,8,9 0
      poly man1_cap 110,58 122,52 132,58 0
      poly man1_body 104,120 108,74 132,74 136,120 0
      ellipse man2_head 160,64,8,9 0
      poly man2_cap 150,60 162,54 172,60 0
      poly man2_body 144,120 148,76 172,76 176,120 0
      ellipse man3_head 196,60,8,9 0
      poly man3_cap 186,56 198,50 208,56 0
      poly man3_body 180,120 184,72 208,72 212,120 0
      ellipse man4_head 232,66,7,8 0
      poly man4_cap 223,62 234,57 243,62 0
      poly man4_body 218,120 222,77 242,77 246,120 0
      ellipse cotter_head 288,48,9,10 0
      poly cotter_body 270,88 274,60 302,60 306,88 0
      line cotter_arm 300,62 310,46 c0
      rect glass 306,38,6,8 mix:7,15@0.5 e0
      rect pumps 252,80,4,8 7
      rect - 262,80,4,8 7
    `,
    cycles: [{ name: "the fire", areas: ["fire", "fire_low"], colors: [14, 12, 4], style: "flicker", ms: [150, 600] }]
  },

  // ---- HALLORAN'S PIES: from above, the counter laid out like a plan; the oven at the top, the steamed window below --
  pie_shop: {
    version: 1,
    draw: `
      rect floor 0,0,320,136 mix:8,0@0.5
      ellipse warmth 60,30,120,74 mix:,14@0.18
      rect oven 8,2,78,40 0 e8
      rect oven_top 12,6,70,12 8
      ellipse oven_mouth 47,30,24,8 fade:15,4/47,24/47,38
      ellipse oven_glow 47,30,40,16 mix:,14@0.3
      rect counter 26,52,252,42 6 e0
      line - 26,58 278,58 c0
      rect tray1 40,60,64,28 7 e8
      rect tray2 112,60,64,28 7 e8
      rect tray3 184,60,64,28 7 e8
      ellipse pie1 52,68,7,5 14 e6
      ellipse pie2 72,68,7,5 14 e6
      ellipse pie3 92,68,7,5 14 e6
      ellipse pie4 52,81,7,5 14 e6
      ellipse pie5 72,81,7,5 14 e6
      ellipse pie6 92,81,7,5 14 e6
      ellipse pie7 124,68,7,5 14 e6
      ellipse pie8 144,68,7,5 14 e6
      ellipse pie9 164,68,7,5 14 e6
      ellipse pie10 124,81,7,5 14 e6
      ellipse pie11 144,81,7,5 14 e6
      ellipse pie12 164,81,7,5 14 e6
      ellipse pie13 196,68,7,5 14 e6
      ellipse pie14 236,68,7,5 14 e6
      ellipse pie15 196,81,7,5 14 e6
      ellipse pie16 216,81,7,5 14 e6
      ellipse pie17 236,81,7,5 14 e6
      dots steam_holes 52,67 72,67 92,67 124,67 144,67 164,67 196,67 236,67 c6
      ellipse halloran 296,74,20,15 1 e0
      rect arm_l 262,64,26,6 15 e7
      rect arm_r 262,80,26,6 15 e7
      ellipse halloran_cap 298,74,11,10 15 e7
      rect window 0,114,320,22 mix:7,15@0.6
      line - 0,114 320,114 c0
      line - 106,114 106,136 c8
      line - 212,114 212,136 c8
    `,
    cycles: [{ name: "the oven", areas: ["oven_glow"], colors: [14, 12], style: "pingpong", ms: 2200 }]
  },

  // ---- CORONER'S COURT: looking up from the witness box at the high green bench; the jury of fog on the right -------
  court: {
    version: 1,
    draw: `
      rect wall 0,0,320,120 fade:0,2/0,0/0,120
      rect floor 0,120,320,16 6
      poly bench 22,120 40,34 178,34 196,120 2 e0
      poly panel1 46,42 102,42 100,112 34,112 mix:2,0@0.25 e10
      poly panel2 116,42 172,42 184,112 118,112 mix:2,0@0.25 e10
      dots studs 44,38 74,38 108,38 142,38 174,38 30,116 70,116 108,116 148,116 188,116 c14
      rect bench_top 32,28,156,8 6 e0
      poly mabbott 78,30 84,10 110,10 116,30 0
      ellipse mabbott_head 97,6,7,8 7 e0
      line pen 116,24 124,14 c15
      ellipse lamp_light 152,32,18,6 mix:,14@0.5
      line - 152,14 152,26 c8
      poly lamp_shade 140,18 164,18 170,28 134,28 2 e10
      rect chair1 216,58,10,14 6 e0
      rect chair2 232,58,10,14 6 e0
      rect chair3 248,58,10,14 6 e0
      rect chair4 264,58,10,14 6 e0
      rect chair5 280,58,10,14 6 e0
      rect chair6 296,58,10,14 6 e0
      rect chair7 212,84,12,16 6 e0
      rect chair8 230,84,12,16 6 e0
      rect chair9 248,84,12,16 6 e0
      rect chair10 266,84,12,16 6 e0
      rect chair11 284,84,12,16 6 e0
      rect chair12 302,84,12,16 6 e0
      rect - 210,72,100,3 6
      rect - 206,100,112,3 6
      ellipse jury_fog 262,64,56,12 mix:,7@0.3
      ellipse jury_fog2 264,90,62,12 mix:,7@0.3
      ellipse - 250,58,8,6 mix:,15@0.4
      ellipse - 290,84,8,6 mix:,15@0.4
      rect witness_box 0,124,320,12 6 e0
      line - 0,127 320,127 c7
    `,
    cycles: [{ name: "the jury", areas: ["jury_fog", "jury_fog2"], colors: [7, 15], style: "pingpong", ms: 3200 }]
  },

  // ---- THE LAST LAMP: a wide view along the river wall; the one dark lamp, the dead man under it, the hut ------------
  last_lamp: {
    version: 1,
    draw: `
      rect fog 0,0,320,74 fade:9,1/0,0/0,74
      ellipse murmur1 160,34,70,12 mix:,9@0.35
      ellipse murmur2 220,56,60,10 mix:,9@0.35
      ellipse murmur3 70,52,50,8 mix:,9@0.3
      ellipse far_glow1 22,40,7,5 mix:,14@0.2
      ellipse far_glow2 46,50,5,4 mix:,14@0.2
      dots far_lamps 22,40 46,50 c6
      rect river_wall 0,74,320,14 mix:0,1@0.3
      line - 0,74 320,74 c8
      rect steps 172,74,30,14 mix:8,1@0.4
      line - 172,80 202,80 c8
      line - 172,84 202,84 c8
      rect cobbles 0,88,320,48 fade:1,0/0,88/0,136
      rect kerb 0,112,250,4 8
      rect lamp_post 104,22,5,92 0
      poly lamp_base 98,114 115,114 111,104 102,104 0
      poly lamp 96,12 117,12 113,26 100,26 0 e8
      poly lamp_cap 98,12 106,4 115,12 0
      line - 92,26 121,26 c0
      poly fenn_coat 112,96 128,96 132,114 108,114 mix:2,8@0.5 e0
      ellipse fenn_head 120,90,4,5 7 e0
      poly fenn_cap 115,88 125,88 126,85 114,85 8 e0
      rect fenn_knees 108,108,26,4 8 e0
      rect hut 250,36,70,84 mix:2,0@0.4 e0
      poly hut_roof 244,38 320,24 320,36 250,44 0
      rect hut_door 266,62,26,56 2 e0
      dots hut_door_knob 287,90 c14
      rect hut_door_open 266,62,26,56 0 e0
      rect hut_door_open_glow 270,66,18,52 mix:0,6@0.35
      ellipse hut_door_open_lamp 280,100,5,4 mix:,14@0.4
      poly hut_door_open_leaf 266,62 272,65 272,115 266,118 2 e0
      rect hut_step 262,118,34,4 8
    `,
    cycles: [{ name: "the murmuring", areas: ["murmur1", "murmur2", "murmur3"], colors: [9, 1], style: "pingpong", ms: 3000 }]
  },

  // ---- THE LAMPLIGHTER'S HUT: eye level in a hut the size of a wardrobe; forty caps on the back wall ----------------
  hut: {
    version: 1,
    draw: `
      rect back 64,6,176,92 mix:6,0@0.45
      line - 86,6 86,98 c0
      line - 108,6 108,98 c0
      line - 130,6 130,98 c0
      line - 152,6 152,98 c0
      line - 174,6 174,98 c0
      line - 196,6 196,98 c0
      line - 218,6 218,98 c0
      poly wall_l 0,0 64,6 64,98 0,136 mix:6,0@0.7
      poly wall_r 320,0 240,6 240,98 320,136 mix:6,0@0.7
      poly ceiling 0,0 320,0 240,6 64,6 0
      poly floor 0,136 64,98 240,98 320,136 mix:6,8@0.5
      line - 32,117 288,117 c0
      dots nails 76,14 98,14 120,14 142,14 164,14 186,14 208,14 230,14 76,32 98,32 120,32 142,32 164,32 186,32 208,32 230,32 76,50 98,50 120,50 142,50 164,50 186,50 208,50 230,50 c7
      poly caps_top 68,22 70,16 82,16 84,22 90,24 68,24 10
      poly - 90,22 92,16 104,16 106,22 112,24 90,24 10
      poly - 112,22 114,16 126,16 128,22 134,24 112,24 10
      poly - 134,22 136,16 148,16 150,22 156,24 134,24 10
      poly - 156,22 158,16 170,16 172,22 178,24 156,24 10
      poly - 178,22 180,16 192,16 194,22 200,24 178,24 10
      poly - 200,22 202,16 214,16 216,22 222,24 200,24 10
      poly - 222,22 224,16 236,16 238,22 244,24 222,24 10
      poly caps_mid 68,40 70,34 82,34 84,40 90,42 68,42 mix:10,2@0.5
      poly - 90,40 92,34 104,34 106,40 112,42 90,42 mix:10,2@0.5
      poly - 112,40 114,34 126,34 128,40 134,42 112,42 mix:10,2@0.5
      poly - 134,40 136,34 148,34 150,40 156,42 134,42 mix:10,2@0.5
      poly - 156,40 158,34 170,34 172,40 178,42 156,42 mix:10,2@0.5
      poly - 178,40 180,34 192,34 194,40 200,42 178,42 mix:10,2@0.5
      poly - 200,40 202,34 214,34 216,40 222,42 200,42 mix:10,2@0.5
      poly - 222,40 224,34 236,34 238,40 244,42 222,42 mix:10,2@0.5
      poly caps_low 68,58 70,52 82,52 84,58 90,60 68,60 mix:2,8@0.5
      poly - 90,58 92,52 104,52 106,58 112,60 90,60 mix:2,8@0.5
      poly - 112,58 114,52 126,52 128,58 134,60 112,60 mix:2,8@0.5
      poly - 134,58 136,52 148,52 150,58 156,60 134,60 mix:2,8@0.5
      poly - 156,58 158,52 170,52 172,58 178,60 156,60 8
      poly - 178,58 180,52 192,52 194,58 200,60 178,60 8
      poly - 200,58 202,52 214,52 216,58 222,60 200,60 8
      rect shelf 84,80,120,4 6 e0
      rect logbook 108,72,36,8 15 e8
      line - 126,72 126,80 c8
      line - 112,75 122,75 c7
      line - 130,75 140,75 c7
      rect matches 170,74,10,6 4 e0
      line pole_shape 256,112 244,26 c14
      ellipse pole_flame 244,22,2,3 9
    `,
    cycles: [{ name: "the caps", areas: ["caps_top"], colors: [10, 2], style: "pingpong", ms: 4000 }],
    overlays: [
      { object: "trumpet", at: [180, 104] }
    ]
  },

  // ---- THE SUBSTATION: looking up at the dynamo and the one bare bulb; Mr Voss at his desk on the right -------------
  substation: {
    version: 1,
    draw: `
      rect wall 0,0,320,136 fade:11,8/214,36/40,136
      ellipse bulb_light 214,40,46,34 mix:,15@0.2
      line - 0,30 320,30 c3
      line - 0,60 320,60 c3
      line - 0,90 320,90 c3
      line - 170,30 170,60 c3
      line - 250,0 250,30 c3
      line - 290,60 290,90 c3
      poly dynamo 18,136 30,10 140,10 152,136 8 e0
      rect windings 36,30,98,86 stripes:6,0
      ellipse dynamo_end 85,12,56,10 7 e0
      ellipse dynamo_hub 85,12,14,4 3 e0
      line arc 60,120 70,116 80,122 90,116 100,120 c11
      rect dynamo_foot 10,124,150,12 0
      line flex 214,0 214,30 c7
      ellipse bulb 214,36,6,8 15 e0
      poly desk 198,104 320,98 320,136 192,136 6 e0
      line - 192,112 320,106 c0
      rect ledger 220,98,40,8 15 e8
      line - 240,98 240,106 c8
      poly voss 254,98 258,70 290,70 294,98 0
      rect voss_collar 266,64,16,6 15
      ellipse voss_head 274,56,9,10 7 e0
      ellipse bowler 274,46,11,7 0
      rect - 260,48,28,3 0
    `,
    cycles: [
      { name: "the bulb", areas: ["bulb"], colors: [15, 7], style: "flicker", ms: [3000, 9000] },
      { name: "the hum", areas: ["arc", "dynamo_hub"], colors: [11, 3], style: "pingpong", ms: 900 }
    ]
  },

  // ---- THE RIVER STEPS: looking down from the river wall at the steps, the mud and Pip; the river fills the rest ----
  river_steps: {
    version: 1,
    draw: `
      rect far_fog 0,0,320,18 fade:15,7/0,0/0,18
      rect river 0,18,320,78 fade:8,6/0,18/0,96
      line ripple1 20,40 70,40 c8
      line ripple2 150,30 230,30 c8
      line ripple3 90,62 170,62 c6
      line ripple4 230,76 300,76 c6
      line ripple5 30,84 100,84 c8
      ellipse fog_lid 200,22,140,8 mix:,7@0.4
      rect mud 0,96,320,24 mix:0,8@0.3
      dots mud_shine 120,104 150,110 210,102 250,112 280,104 c7
      poly steps 0,136 0,60 30,60 30,74 50,74 50,88 70,88 70,102 90,102 90,116 110,116 110,136 mix:7,8@0.45
      line - 0,60 30,60 c15
      line - 30,74 50,74 c15
      line - 50,88 70,88 c15
      line - 70,102 90,102 c15
      line - 90,116 110,116 c15
      dots weed 4,62 24,62 34,76 44,76 54,90 64,90 c2
      rect wall_edge 0,128,320,8 0
      poly pip_coat 192,98 202,98 206,112 188,112 6 e0
      ellipse pip_head 197,95,3,3 7 e0
      line pip_stick 186,104 178,114 c6
      rect pip_bucket 208,106,6,6 8 e0
    `,
    cycles: [{ name: "the river", areas: ["ripple1", "ripple2", "ripple3", "ripple4", "ripple5"], colors: [8, 6, 0], style: "rotate", ms: 900 }]
  },

  // ---- THE BRIDGE: far away, across the water, the Row is a short string of lamps with a gap at the end ------------
  bridge: {
    version: 1,
    draw: `
      rect fog 0,0,320,98 fade:15,3/0,0/0,98
      ellipse fog_thin 230,40,110,30 mix:,11@0.3
      ellipse fog_thick 92,84,40,10 mix:,7@0.3
      rect bank 0,94,320,6 mix:8,3@0.5
      poly row_houses 50,98 50,90 56,86 62,90 68,86 74,90 80,86 86,90 92,86 98,90 104,86 110,90 112,98 0
      rect chimney 92,80,3,6 0
      ellipse chimney_fog 94,78,9,5 mix:,7@0.4
      dots row_lamps 54,95 59,95 64,95 69,95 74,95 79,95 84,95 89,95 94,95 99,95 104,95 c14
      rect water 0,100,320,18 fade:1,0/0,100/0,118
      line glint1 40,104 70,104 c3
      line glint2 140,110 190,110 c3
      line glint3 230,106 270,106 c3
      rect parapet 0,118,320,18 mix:7,8@0.4 e0
      line - 0,121 320,121 c15
      rect - 60,124,4,12 8
      rect - 150,124,4,12 8
      rect - 240,124,4,12 8
    `,
    cycles: [{ name: "the water", areas: ["glint1", "glint2", "glint3"], colors: [3, 1, 11], style: "rotate", ms: 1100 }]
  }
};

// ---- The endings (BRIEF.md §7): the strongest shots, in the viewpoints no room uses -------------------------------
export const endings = {
  // The truth: from far above, the Row at dawn with the fog gone; two small figures walk off along the river.
  truth: {
    version: 1,
    draw: `
      rect ground 0,0,320,136 mix:8,0@0.4
      rect roof1 4,4,44,24 mix:4,8@0.3 e0
      rect roof2 54,4,60,24 mix:8,7@0.3 e0
      rect roof3 120,4,38,24 mix:4,6@0.4 e0
      rect roof4 164,4,70,24 mix:8,4@0.3 e0
      rect roof5 240,4,76,24 mix:6,8@0.4 e0
      dots chimneys 14,10 30,10 70,10 96,10 134,10 180,10 210,10 256,10 290,10 c0
      rect street 0,32,320,10 mix:7,13@0.25
      dots lamps 12,37 38,37 64,37 90,37 116,37 142,37 168,37 194,37 220,37 246,37 272,37 298,37 c14
      rect roof6 0,46,62,24 mix:8,4@0.3 e0
      rect roof7 68,46,54,24 mix:4,6@0.4 e0
      rect roof8 128,46,88,24 mix:8,7@0.3 e0
      rect roof9 222,46,46,24 mix:6,8@0.4 e0
      rect roof10 274,46,46,24 mix:4,8@0.3 e0
      dots chimneys2 20,52 46,52 90,52 150,52 190,52 240,52 296,52 c0
      rect embankment 0,74,320,10 mix:7,13@0.35
      poly river 0,84 120,86 220,92 320,88 320,136 0,136 fade:5,1/0,84/0,136
      line sheen1 10,98 110,100 c13
      line sheen2 160,110 300,106 c13
      line sheen3 40,124 200,126 c13
      ellipse mist 260,118,50,4 mix:,13@0.3
      ellipse dawn_light 214,78,22,8 mix:,15@0.35
      rect figure1 206,72,4,9 0
      rect figure2 212,72,4,9 7
      ellipse - 208,70,2,2 0
      ellipse - 214,70,2,2 7
      line shadows 210,81 246,83 c0
      line - 216,81 250,82 c8
    `,
    cycles: [{ name: "the river at dawn", areas: ["sheen1", "sheen2", "sheen3"], colors: [13, 15, 5], style: "rotate", ms: 1200 }]
  },
  // Relieved: close up, the twelfth lamp's lantern, lit at last, against the dark.
  relieved: {
    version: 1,
    draw: `
      rect dark 0,0,320,136 fade:1,0/0,0/0,136
      ellipse glow 120,66,110,66 mix:,14@0.3
      ellipse glow_in 120,66,70,46 mix:,14@0.45
      poly cap 70,22 120,4 170,22 0 e8
      rect brim 66,22,108,6 0
      poly lantern 72,28 168,28 156,104 84,104 14 e0
      line - 120,28 120,104 c0
      line - 96,28 102,104 c0
      line - 144,28 138,104 c0
      ellipse flame 120,70,9,16 15
      ellipse flame_core 120,74,4,8 14
      poly base 84,104 156,104 140,116 100,116 0
      rect post 112,116,16,20 0
      line pole 300,136 180,104 146,110 c6
      line - 300,135 180,103 c6
      ellipse hook 146,110,4,3 none e14
    `,
    cycles: [
      { name: "the flame", areas: ["flame", "flame_core"], colors: [15, 14], style: "flicker", ms: [200, 900] },
      { name: "the light", areas: ["glow_in"], colors: [14, 6], style: "pingpong", ms: 2400 }
    ]
  },
  // The wrong name: from far above, a sea of grey fog with chimney pots through it, and one cold electric point.
  blamed: {
    version: 1,
    draw: `
      rect fog 0,0,320,136 fade:7,8/0,0/0,136
      ellipse bank1 70,30,90,16 mix:,15@0.25
      ellipse bank2 240,80,110,18 mix:,15@0.25
      ellipse bank3 120,116,120,14 mix:,7@0.3
      rect pots1 20,18,4,6 0
      rect - 60,22,4,6 0
      rect - 102,16,4,6 0
      rect - 150,20,4,6 0
      rect - 196,14,4,6 0
      rect - 240,20,4,6 0
      rect - 286,16,4,6 0
      rect pots2 36,58,4,6 0
      rect - 84,54,4,6 0
      rect - 130,60,4,6 0
      rect - 236,56,4,6 0
      rect - 280,62,4,6 0
      rect pots3 14,100,4,6 0
      rect - 64,96,4,6 0
      rect - 110,102,4,6 0
      rect - 160,98,4,6 0
      rect - 208,104,4,6 0
      rect - 256,96,4,6 0
      rect - 300,100,4,6 0
      ellipse electric_glow 184,62,10,7 mix:,15@0.5
      rect electric 182,60,4,4 15
    `,
    cycles: [{ name: "the fog", areas: ["bank1", "bank2"], colors: [15, 7], style: "pingpong", ms: 5000 }]
  },
  // Died: close up, the canary in its cage, gone quiet, its head under its wing, with the fog coming in through the bars.
  died: {
    version: 1,
    draw: `
      rect fog 0,0,320,136 fade:7,8/0,0/0,136
      ellipse fog_in 120,70,80,46 mix:,15@0.15
      line hook 120,0 120,10 c6
      ellipse ring 120,12,5,3 none e14
      poly dome 64,40 76,22 96,14 120,12 144,14 164,22 176,40 mix:6,14@0.3 e0
      rect base 56,118,128,10 6 e0
      rect tray 52,128,136,6 0
      line bars 64,40 64,118 c14
      line - 80,24 80,118 c14
      line - 96,16 96,118 c14
      line - 120,12 120,118 c14
      line - 144,16 144,118 c14
      line - 160,24 160,118 c14
      line - 176,40 176,118 c14
      line perch 76,92 164,92 c6
      ellipse canary 124,82,16,11 14 e6
      ellipse wing 128,80,11,7 mix:14,6@0.3
      poly tail 108,86 96,98 102,98 112,90 14 e6
      line - 128,93 128,96 c6
      line - 120,93 120,96 c6
      ellipse wisp 236,70,70,12 mix:,15@0.2
      ellipse wisp2 150,108,50,6 mix:,15@0.25
    `,
    cycles: [{ name: "the fog coming in", areas: ["wisp", "wisp2", "fog_in"], colors: [15, 7], style: "pingpong", ms: 4200 }]
  }
};

// Visions (a room's `dream`: what sleeping there shows in the dark, ARCHITECTURE.md §5 "Sleep"): drawn like an ending's picture.
//   fenn_dream   (the hut's) eye level, looking along the Row; 70; the dark last lamp on the left third, Mr Fenn sitting at its foot with
//                somebody faint beside him, the lit lamps going away into the fog; blue 9, as dreams are, and dim: it comes up out of the dark
export const visions = {
  // Mr Fenn's last round, as the hut remembers it: the lamps lit one by one going away up the Row, the last one dark, and him sitting
  // down under it to hear out something kind.
  fenn_dream: {
    version: 1,
    draw: `
      rect fog 0,0,320,136 fade:1,0/0,0/0,136
      ellipse haze 226,68,90,14 mix:,9@0.1
      poly street 0,136 320,136 236,70 222,70 fade:8,0/0,70/0,136
      line kerb 0,121 222,71 c1
      line pole 38,132 48,40 c6
      dots pole_flame 48,39 c9
      line lamp1_post 54,132 54,30 c8
      rect lamp1 47,20,14,11 0 e8
      line lamp2_post 112,112 112,56 c8
      rect lamp2 108,49,8,7 0 e8
      ellipse glow3 150,63,11,9 mix:,14@0.2
      line lamp3_post 150,98 150,66 c8
      rect lamp3 148,61,5,5 mix:14,6@0.5
      ellipse glow4 176,69,7,6 mix:,14@0.3
      line lamp4_post 176,89 176,72 c8
      dots lamp4 176,69 177,69 c14
      ellipse glow5 194,71,5,4 mix:,14@0.35
      line lamp5_post 194,82 194,73 c8
      dots lamp5 194,71 c14
      ellipse glow6 207,71,4,3 mix:,14@0.4
      dots lamp6 207,71 c14
      dots lamp7 216,70 c14
      dots lamp8 222,69 c14
      poly fenn_back 61,108 71,108 73,122 60,122 8
      poly fenn_lap 60,119 83,119 83,125 60,126 8
      poly fenn_shins 78,121 83,121 85,132 78,132 8
      ellipse fenn_head 66,104,4,5 8
      poly fenn_cap 61,100 71,100 72,97 62,96 2
      poly kind_one 90,100 98,100 101,132 87,132 mix:,7@0.25
      ellipse kind_head 94,95,4,5 mix:,7@0.25
      ellipse wisp 130,104,96,7 mix:,9@0.1
      ellipse wisp2 262,92,70,5 mix:,9@0.1
    `
  }
};

// ---- THE COVER (its page, /lantern/: docs/splash/PLAN.md): 480 x 400, the title drawn by the game on its band ---------------------------
export const cover = {
  "shot": "archetype: the tower (it turns on one person whose presence rules the place: Mr Fenn, the dead lamplighter, still at his post; it beat the icon, the dark lamp, which a lamp on any other street could be, and the dwarf, the cover it replaces). Dithered style; title at the top on the flat dark grey 8 band (rows 0-119, white 15); main palette: dark grey 8 (the fog, the sky), brown 6 (the wet cobbles), light grey 7 (fog light, rim light), yellow 14 (the lamps), white 15 (flame cores), black. Dominant: Mr Fenn huge from a low camera, one black silhouette (cap at row 148, boots at row 339), in profile facing the dark lamp, rim light 7 on cap, face, shoulder and arm; his far arm hangs empty at his side; his near arm is raised and holds the lamplighter's pole, which runs up behind his shoulder to the dark lamp's tap and hooks it; he stands before the fog's pale pool, which is behind the dark lamp. The question: why is that one lamp dark. Backdrop: the Row's houses lost in the fog with a few lit windows, four lit lamps along it, wet cobbles with fan and course lines, lamp reflections and puddles, his long shadow thrown at us across the stones, a drain grate cut by the picture's edge at row 469. moves: the gas flames (flicker), the lit windows (flicker), the flame cores (pingpong), moths round the near left lamp (loop), a crow crossing the fog (travelling loop)",
  "title": 15,
  "titleAt": "top",
  "draw": "\nrect bg 0,0,480,560 8\n# the fog's pale pool behind the dark lamp and the man: dithered rings on the page's own grey\nellipse glow5 262,212,196,92 mix:8,7@0.08\nellipse glow4 262,212,160,84 mix:8,7@0.16\nellipse glow3 262,210,120,72 mix:8,7@0.28\nellipse glow2 262,206,84,58 mix:8,7@0.42\nellipse glow1 268,198,50,40 mix:7,15@0.2\n# the Row's houses lost in the fog, roofs sloping to the far end\npoly house_l 0,196 168,262 168,300 0,330 mix:8,0@0.55\npoly house_l2 0,262 96,282 96,314 0,330 mix:8,0@0.3\npoly house_r 479,188 350,258 350,300 479,330 mix:8,0@0.55\npoly house_r2 479,250 400,274 400,310 479,330 mix:8,0@0.3\nrect chim_l1 30,176,12,34 mix:8,0@0.55\nrect chim_l2 118,222,9,26 mix:8,0@0.55\nrect chim_r1 436,168,12,34 mix:8,0@0.55\nrect chim_r2 372,226,9,26 mix:8,0@0.55\nrect win_l1 40,252,11,14 14\nrect win_l2 128,276,8,10 14\nrect win_r1 430,252,11,14 14\nrect win_r2 382,272,8,10 14\nrect win_r3 452,296,9,11 14\n# the wet cobbles: grey far off, brown near, darker in front, courses and fan lines to the vanishing point (262,298)\npoly road 0,296 479,296 479,469 0,469 fade:8,6/0,296/0,360\npoly road2 0,380 479,380 479,469 0,469 mix:6,0@0.22\npoly road3 0,430 479,430 479,469 0,469 mix:6,0@0.34\nline kerb_l 168,300 0,330 c7\nline kerb_r 350,300 479,330 c7\nline cob_fm120 262,304 -120,469 c0\nline cob_fm10 262,304 -10,469 c0\nline cob_f70 262,304 70,469 c0\nline cob_f140 262,304 140,469 c0\nline cob_f200 262,304 200,469 c0\nline cob_f262 262,304 262,469 c0\nline cob_f320 262,304 320,469 c0\nline cob_f385 262,304 385,469 c0\nline cob_f460 262,304 460,469 c0\nline cob_f560 262,304 560,469 c0\nline cob_f680 262,304 680,469 c0\nline cob_h0 0,308 479,308 c0\nline cob_h1 0,322 479,322 c0\nline cob_h2 0,340 479,340 c0\nline cob_h3 0,362 479,362 c0\nline cob_h4 0,390 479,390 c0\nline cob_h5 0,424 479,424 c0\nline cob_h6 0,462 479,462 c0\n# lit lamps down the Row, big near, small far (flat flames, halos mixed)\nellipse halo_lampA 106,209,40,40 mix:,14@0.2\nrect lampA_shaft 104,222,4,90 0\npoly lampA_base 101,314 104,304 108,304 111,314 0\nrect lampA_bar 95,222,22,3 0\npoly lampA_body 98,196 114,196 112,222 100,222 14\nrect lampA_core 105,201,2,14 15\npoly lampA_cap 95,196 106,186 117,196 0\nellipse halo_lampB 150,228,32,34 mix:,14@0.2\nrect lampB_shaft 148,238,4,66 0\npoly lampB_base 145,306 148,296 152,296 155,306 0\nrect lampB_bar 141,238,18,3 0\npoly lampB_body 144,218 156,218 154,238 146,238 14\nrect lampB_core 149,223,2,8 15\npoly lampB_cap 141,218 150,208 159,218 0\nellipse halo_lampC 376,230,32,34 mix:,14@0.2\nrect lampC_shaft 374,240,4,64 0\npoly lampC_base 371,306 374,296 378,296 381,306 0\nrect lampC_bar 367,240,18,3 0\npoly lampC_body 370,220 382,220 380,240 372,240 14\nrect lampC_core 375,225,2,8 15\npoly lampC_cap 367,220 376,210 385,220 0\nellipse halo_lampD 424,207,40,40 mix:,14@0.2\nrect lampD_shaft 422,220,4,94 0\npoly lampD_base 419,316 422,306 426,306 429,316 0\nrect lampD_bar 413,220,22,3 0\npoly lampD_body 416,194 432,194 430,220 418,220 14\nrect lampD_core 423,199,2,14 15\npoly lampD_cap 413,194 424,184 435,194 0\n# reflections of the lit lamps in the wet road, puddles\npoly rA 103,320 109,320 111,396 101,396 mix:,14@0.35\npoly rAb 98,330 114,330 118,396 94,396 mix:,14@0.12\npoly rD 421,322 427,322 429,396 419,396 mix:,14@0.35\npoly rDb 416,332 432,332 436,396 412,396 mix:,14@0.12\npoly rB 147,312 153,312 155,350 145,350 mix:,14@0.3\npoly rC 373,312 379,312 381,350 371,350 mix:,14@0.3\nellipse puddle_a 130,408,52,6 mix:6,7@0.3\nellipse puddle_b 372,440,66,7 mix:6,7@0.3\nellipse puddle_c 60,452,40,5 mix:6,7@0.25\n# the dark lamp: post and lantern black against the glow\npoly dpost_base 303,308 309,292 321,292 327,308 0\nrect dpost_ring 306,284,18,5 0\nrect dpost_shaft 309,190,6,98 0\nrect dpost_ring2 306,250,12,3 0\nrect dpost_bar 292,190,40,4 0\npoly dark_lan 288,150 336,150 332,190 292,190 mix:8,0@0.55\nline dark_mul1 312,151 312,189 c0\nline dark_mul2 290,170 334,170 c0\npoly dark_cap 278,152 312,134 346,152 0\nrect dark_fin 311,126,2,9 0\nrect dark_tap 309,194,6,6 0\nline dark_rim1 278,152 312,134 346,152 c7\nline dark_rim2 336,152 332,190 c7\nline dpost_rim 315,196 315,284 c7\n# fog ribbons across the Row, in front of the lamps\nellipse fogA 262,312,260,7 mix:8,7@0.22\nellipse fogB 90,356,160,6 mix:8,7@0.2\nellipse fogC 410,376,130,6 mix:8,7@0.2\n# his long shadow thrown at us across the wet stones (light behind him)\npoly shadow 198,338 262,338 214,469 -10,469 mix:6,0@0.72\npoly shadow2 206,340 252,340 190,469 40,469 mix:6,0@0.84\nline sh_c1 200,350 262,350 c6\nline sh_c2 150,382 250,382 c6\nline sh_c3 90,424 230,424 c6\nline sh_c4 20,462 214,462 c6\n# Mr Fenn, huge from a low camera: one black silhouette, cap, coat, the pole up to the dark lamp's tap\nline pole_a 210,314 306,196 c0\nline pole_b 211,314 307,196 c0\nline pole_c 212,314 308,196 c0\nline pole_hook 306,196 311,192 316,196 c0\npoly fenn_legL 198,300 216,300 214,326 228,334 228,339 196,339 198,326 0\npoly fenn_legR 226,300 244,300 246,324 264,332 264,337 230,339 228,326 0\npoly fenn_coat 190,206 194,197 204,194 222,194 236,198 242,208 244,250 258,302 244,310 214,306 186,312 178,300 190,254 0\npoly fenn_arm_far 174,208 186,200 186,244 184,280 172,288 164,282 166,246 0\nellipse fenn_hand_far 170,288,7,8 0\nline fenn_gap 187,214 189,296 c7\nrect fenn_neck 201,186,14,14 0\npoly fenn_scarf 194,194 222,194 226,204 192,206 0\npoly fenn_head 196,164 222,164 224,172 229,177 224,180 225,185 219,190 211,191 202,189 196,181 0\npoly fenn_cap 192,162 194,153 204,148 218,148 225,154 226,162 0\npoly fenn_brim 222,159 240,164 224,167 0\npoly fenn_arm_near 236,202 249,205 266,238 285,210 293,217 270,256 256,260 236,226 0\nellipse fenn_hand_near 288,214,7,7 0\n# rim light from the glow on the edges that face it\nline fenn_rim_cap 204,148 218,148 225,154 226,162 c7\nline fenn_rim_face 229,177 224,180 225,185 219,190 c7\nline fenn_rim_sh 236,198 246,210 250,252 262,302 c7\nline fenn_rim_arm 249,205 266,238 285,210 c7\nline fenn_rim_hand 283,210 289,208 c7\n# the foreground: a drain grate, cut by the picture's edge\nrect grate 300,452,90,17 0\nline grate_306 306,452 306,469 c6\nline grate_316 316,452 316,469 c6\nline grate_326 326,452 326,469 c6\nline grate_336 336,452 336,469 c6\nline grate_346 346,452 346,469 c6\nline grate_356 356,452 356,469 c6\nline grate_366 366,452 366,469 c6\nline grate_376 376,452 376,469 c6\nline grate_386 386,452 386,469 c6\nline grate_t 300,460 390,460 c6\n# the picture ends cleanly at row 469: the band below is the plain background again\nrect floor_cut 0,470,480,90 8\n",
  "cycles": [
    {
      "name": "the gas flames",
      "areas": [
        "lampA_body",
        "lampB_body",
        "lampC_body",
        "lampD_body"
      ],
      "colors": [
        14,
        6
      ],
      "style": "flicker",
      "ms": [
        1400,
        5200
      ]
    },
    {
      "name": "the lit windows",
      "areas": [
        "win_l1",
        "win_l2",
        "win_r1",
        "win_r2",
        "win_r3"
      ],
      "colors": [
        14,
        6
      ],
      "style": "flicker",
      "ms": [
        2200,
        7000
      ]
    },
    {
      "name": "the flame cores",
      "areas": [
        "lampA_core",
        "lampD_core",
        "lampB_core",
        "lampC_core"
      ],
      "colors": [
        15,
        14
      ],
      "style": "pingpong",
      "ms": 2600
    }
  ],
  "loops": [
    {
      "name": "moths round the near left lamp",
      "at": [
        94,
        176
      ],
      "style": "loop",
      "ms": 170,
      "frames": [
        [
          "........................",
          "........................",
          "........................",
          "........................",
          "....7...................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "................7.......",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "...........7............",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................"
        ],
        [
          "........................",
          "........................",
          "........................",
          ".........7..............",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "...................7....",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........7...............",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................"
        ],
        [
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "..............7.........",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          ".....7..................",
          "........................",
          ".................7......",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................"
        ],
        [
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          ".......7................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "........................",
          "..................7.....",
          "...7....................",
          "........................",
          "........................",
          "........................",
          "........................"
        ]
      ]
    },
    {
      "name": "a crow crossing the fog",
      "style": "loop",
      "ms": 160,
      "path": [
        [
          20,
          146
        ],
        [
          440,
          134
        ]
      ],
      "travel": 14000,
      "pause": 5000,
      "frames": [
        [
          "........",
          "0.....0.",
          ".0...0..",
          "..000...",
          "........"
        ],
        [
          "........",
          "........",
          "..000...",
          ".0...0..",
          "0.....0."
        ]
      ]
    }
  ]
};


// ---- The box art (the list of games: ui/home.js): the earlier 480 x 400 cover (16 November 2026), shown as its phone crop, columns 80-399, still. ----
export const boxart = {
 "shot": "archetype: the dwarf (the story turns on a place bigger than you: a fog-bound street that keeps what is said in it); title at the top, a flat brown band over rows 0-95; gaslight (leads brown 6, dark grey 8, black, yellow lamps 14; one small green accent for a cap), the lamps along the Row lit in a haze, hard light from the far end. Dominant: the huge unlit gas lamp-post of the Row (the one Mr Fenn didn't light), a black silhouette seen from a low camera on the left third, its dark lantern cap near the band's edge, with a thin yellow rim light on its right edge; at its foot a small figure, Mr Fenn the dead lamplighter, a black silhouette sitting against the post's base in profile, head bowed, a green cap, his near arm reaching down to a lamplighter's pole that leans up beside him (the other arm rests on his knee, hidden), a long dithered shadow running away to the lower left. Backdrop: one-point view, vanishing point at x 330, y 272, the street going away between the pub wall (left, a red-lit window, a door) and the pie shop (right, a lit window, a chimney), shrinking pairs of lit lamps {lamps} converging on the court doors {court doors} glowing yellow in the fog at the end of the Row, Constable Pye {constable} a tiny black figure with his lamp standing before them. Elements: Mr Fenn {lamplighter}, the lit lamps, the court, the constable. The question: why is the lamplighter dead under the one lamp that is dark? Gradients: the pub wall darkening towards the camera (the lamps at the far end light it, the near end falls into the dark); the sky from brown at the band down to dark grey at the horizon (the air thickening with distance). Wings: left, the pub wall with its red window, a door, dark upper windows, a lit window and a drainpipe; right, the pie shop with its lit window and door, upper windows, a wall lamp with its halo, two chimneys against the sky. Light: the lamps, soft halos round the nearest, pools on the pavement and reflections on the wet road, rim lights on the silhouettes on the side towards the lamps. moves: the gas flames (flicker), the fog glow (pingpong), the lit windows (flicker), moths round the middle lamp (loop), smoke from the pie shop chimney (loop)",
 "title": 14,
 "titleAt": "top",
 "draw": "\n# the whole canvas: gaslight's lead, brown; the top band stays this one flat colour\nrect bg 0,0,480,400 6\nrect air 0,96,480,176 fade:6,8/0,96/0,272\nvp 330,272\n# the fog glow at the far end of the Row\nellipse glow_far3 338,262,110,46 mix:,14@0.1\nellipse glow_far2 338,264,64,30 mix:,14@0.2\nellipse glow_far1 338,266,30,16 mix:,14@0.35\n# the court at the end, dark, with its lit doors\npoly court 314,272 314,246 322,238 330,232 338,238 346,246 346,272 mix:8,0@0.5 e0\nrect court_doors 325,252,10,20 14\nline court_mull 330,252 330,271 c8\n# chimneys against the sky (the wall is drawn over their feet)\nrect chimney_r1 446,124,10,40 0\nrect chimney_r1_cap 444,122,14,3 0\nrect chimney_r2 410,200,9,40 0\nrect chimney_r2_cap 408,198,13,3 0\n# the house wall (left, shuttered): darker nearer the camera\npoly wall_l 0,100@1 0,300@1 0,300@0.1 0,100@0.1 fade:8,6/-60,0/300,0\nline roof_l 0,100@1 0,100@0.1 c0\npoly win_l1 14,140@1 14,140@0.95 14,176@0.95 14,176@1 0 e8\npoly win_l2 52,138@1 52,138@0.93 52,174@0.93 52,174@1 0 e8\npoly win_lit 92,160@1 92,160@0.92 92,198@0.92 92,198@1 14 e0\npoly house_window 10,215@1 10,215@0.88 10,262@0.88 10,262@1 0 e8\nline house_mull 10,238@1 10,238@0.88 c8\npoly house_door 58,222@1 58,222@0.9 58,295@0.9 58,295@1 0 e8\nline pipe_l 78,142 78,292 c0\n# the pie shop wall (right)\npoly wall_r 480,130@1 480,296@1 480,296@0.15 480,130@0.15 mix:8,0@0.45\nline roof_r 480,130@1 480,130@0.15 c0\npoly pie_window 470,210@1 470,210@0.7 470,262@0.7 470,262@1 mix:6,14@0.45 e0\nline pie_mull1 470,236@1 470,236@0.7 c0\nline pie_mull2 470,210@0.85 470,262@0.85 c0\npoly pie_door 415,238@1 415,238@0.9 415,286@0.9 415,286@1 0 e8\npoly win_r1 468,166@1 468,166@0.75 468,192@0.75 468,192@1 0 e8\nellipse halo_w 438,258,14,11 mix:,14@0.2\nline brk_r 456,258 441,258 c0\nellipse brk_lamp 438,258,3,4 14\n# the ground: pavements, the dark wet road, flagstones and kerbs\npoly ground 0,300@1 0,400@1 480,400@1 480,296@1 480,296@0.02 0,300@0.02 mix:8,6@0.55\npoly road 185,400@1 440,400@1 440,400@0.02 185,400@0.02 mix:0,8@0.55\nellipse fog_hz 330,280,150,9 mix:,6@0.3\nline joint_h1 0,318 278,318 c8\nline joint_h2 0,334 258,334 c8\nline joint_h3 0,352 238,352 c8\nline joint_h4 0,378 210,378 c8\nline joint_v1 30,400@1 30,400@0.05 c8\nline joint_v2 100,400@1 100,400@0.05 c8\nline joint_v3 160,400@1 160,400@0.05 c8\nline joint_v4 470,400@1 470,400@0.05 c8\nline kerb_l 185,400@1 185,400@0.02 c0\nline kerb_r 440,400@1 440,400@0.02 c0\n# pools of light and reflections\nellipse pool_f 210,348,58,16 mix:,14@0.12\nellipse pool_a 372,326,38,7 mix:,14@0.25\nellipse pool_b 290,312,26,5 mix:,14@0.25\npoly refl_a 366,324 376,324 372,352 368,352 mix:,14@0.3\npoly refl_b 287,309 293,309 292,334 288,334 mix:,14@0.25\n# the far lamps, small\nellipse halo_g 336,262,8,6 mix:,14@0.25\nrect lampg_shaft 335,263,1,16 0\npoly lampg_body 334,259 338,259 338,263 334,263 14\nellipse halo_f 320,260,9,7 mix:,14@0.25\nrect lampf_shaft 319,262,1,19 0\npoly lampf_body 317,257 322,257 322,262 317,262 14\nellipse halo_e 342,251,9,7 mix:,14@0.25\nrect lampe_shaft 342,255,2,32 0\npoly lampe_cap 337,247 342,243 347,247 0\npoly lampe_body 339,247 346,247 345,255 340,255 14\nellipse halo_d 308,245,10,8 mix:,14@0.25\nrect lampd_shaft 307,250,2,41 0\npoly lampd_cap 302,240 308,235 314,240 0\npoly lampd_body 304,240 312,240 311,250 305,250 14\n# Constable Pye before the court doors, tiny\npoly pye_cape 327,279 333,279 335,292 325,292 0\nellipse pye_head 330,276,2,3 0\npoly pye_helmet 327,273 330,267 333,273 0\ndots pye_lamp 337,286 337,287 c14\n# the middle right lamp (the moths')\nellipse halo_c1 352,230,16,13 mix:,14@0.12\nellipse halo_c2 352,230,9,8 mix:,14@0.25\nrect mlamp_shaft 351,236,3,62 0\npoly mlamp_globe 346,224 358,224 356,236 348,236 14\npoly mlamp_cap 344,224 352,217 360,224 0\nrect mlamp_fin 351,213,2,4 0\n# the big lit lamp, left of the street\nellipse halo_b1 290,217,26,20 mix:,14@0.1\nellipse halo_b2 290,217,17,14 mix:,14@0.2\nellipse halo_b3 290,217,11,9 mix:,14@0.35\nrect lampb_shaft 288,226,4,81 0\npoly lampb_base 285,307 287,298 293,298 295,307 0\nrect lampb_bar 283,230,16,2 0\npoly lampb_body 283,208 297,208 295,226 285,226 14\nline lampb_mul 290,209 290,225 c0\npoly lampb_cap 280,208 290,199 300,208 0\nrect lampb_fin 289,195,2,5 0\n# the near lit lamp, right of the street\nellipse halo_a1 372,197,40,30 mix:,14@0.1\nellipse halo_a2 372,197,28,22 mix:,14@0.2\nellipse halo_a3 372,197,18,14 mix:,14@0.35\nrect lampa_shaft 369,208,6,113 0\npoly lampa_base 366,321 368,308 376,308 378,321 0\nrect lampa_ring 368,260,8,2 0\nrect lampa_bar 361,214,22,2 0\npoly lampa_body 362,186 382,186 379,208 365,208 14\nline lampa_mul 372,187 372,207 c0\nline lampa_mul2 363,197 381,197 c0\npoly lampa_cap 358,186 372,174 386,186 0\nrect lampa_fin 371,168,2,6 0\n# the long shadows, away from the lamps, falling to the lower left\npoly post_shadow 146,361 176,361 113,400 83,400 mix:,0@0.7\npoly fenn_shadow 182,362 240,362 177,400 119,400 mix:,0@0.7\n# the lamplighter's pole, leaning beside him\nline pole_a 228,362 200,262 c0\nline pole_b 229,362 201,262 c0\nline pole_hook 200,263 197,259 197,255 c14\n# Mr Fenn at the post's foot: one black silhouette in profile, his back to the post\npoly fenn_thigh 182,350 214,336 222,344 186,362 0\npoly fenn_shin 212,340 224,340 228,361 240,362 240,364 214,364 0\npoly fenn_torso 180,356 182,318 188,310 202,310 208,320 207,346 190,352 0\nellipse fenn_head 198,302,6,7 0\npoly fenn_cap 191,299 193,293 203,292 209,297 200,298 2\npoly fenn_arm 194,318 203,317 226,334 221,341 0\nline fenn_rim_chest 208,321 207,344 c14\ndots fenn_rim_face 204,299 204,303 c14\n# the huge unlit lamp-post, black, on the left third\npoly post_base 146,361 150,330 172,330 176,361 0\nrect post_ring 148,324,22,6 0\npoly post_shaft 155,330 158,176 166,176 169,330 0\nrect post_ring2 154,250,16,3 0\nrect post_ring3 156,176,12,4 0\nrect post_bar 140,194,44,3 0\nellipse post_knob_l 140,195,3,3 0\nellipse post_knob_r 184,195,3,3 0\npoly post_lan 142,124 182,124 178,176 146,176 0\npoly post_panes 146,129 178,129 175,171 149,171 8\nline post_mul1 156,129 156,171 c0\nline post_mul2 168,129 168,171 c0\nline post_mul3 148,150 176,150 c0\npoly post_cap 136,126 162,108 188,126 0\nrect post_fin 160,100,4,9 0\nellipse post_ball 162,101,2,2 0\nline post_rim_cap 163,108 188,126 c14\nline post_rim_lan 183,126 179,174 c14\nline post_rim_sh 168,318 166,200 c14\nline post_rim_base 175,360 172,332 c14\n",
 "cycles": [
  {
   "name": "the gas flames",
   "areas": [
    "lampa_body",
    "lampb_body",
    "mlamp_globe",
    "lampd_body",
    "lampe_body",
    "halo_a2",
    "halo_a3",
    "halo_b2",
    "halo_b3",
    "brk_lamp"
   ],
   "colors": [
    14,
    6
   ],
   "style": "flicker",
   "ms": [
    1400,
    5200
   ]
  },
  {
   "name": "the fog glow",
   "areas": [
    "glow_far1",
    "glow_far2",
    "glow_far3"
   ],
   "colors": [
    14,
    6
   ],
   "style": "pingpong",
   "ms": 2800
  },
  {
   "name": "the lit windows",
   "areas": [
    "court_doors",
    "pie_window",
    "win_lit"
   ],
   "colors": [
    14,
    6
   ],
   "style": "flicker",
   "ms": [
    2000,
    7000
   ]
  }
 ],
 "loops": [
  {
   "name": "moths round the lamp",
   "at": [
    340,
    222
   ],
   "style": "loop",
   "ms": 170,
   "under": "mlamp",
   "frames": [
    [
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "...7....................",
     "........................",
     ".....................777",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................"
    ],
    [
     "........................",
     "........................",
     "........................",
     ".................7......",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     ".....777................",
     "........................",
     "........................"
    ],
    [
     "........................",
     "........................",
     "........................",
     "......777...............",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "..............7.........",
     "........................",
     "........................",
     "........................"
    ],
    [
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "..7.....................",
     "...................777..",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................"
    ],
    [
     "........................",
     "........................",
     "..................7.....",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "......777...............",
     "........................",
     "........................"
    ],
    [
     "........................",
     "........................",
     "........................",
     "........................",
     "........777.............",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     "........................",
     ".................7......",
     "........................",
     "........................"
    ]
   ]
  },
  {
   "name": "smoke from the pie shop chimney",
   "at": [
    446,
    100
   ],
   "style": "loop",
   "ms": 280,
   "frames": [
    [
     "......8.........",
     ".....8..8.......",
     "......8.8.......",
     "......8.8.......",
     ".......8..8.....",
     "........8.8.....",
     ".........88.....",
     "........8..8....",
     "........8.8.....",
     ".......88.8.....",
     "......8.8.......",
     ".....7.77.......",
     "....7.7.........",
     "...77.7.........",
     "...7.7..........",
     "....777.........",
     ".....77.........",
     "......77........",
     "......77........",
     "......77........",
     "......7.........",
     ".....7..........",
     "....7...........",
     "...7............"
    ],
    [
     ".....8..........",
     "......8..8......",
     "........8.8.....",
     "........8.8.....",
     ".........8..8...",
     ".........8.8....",
     ".........88.....",
     ".......8..8.....",
     "......8.8.......",
     ".....88.8.......",
     ".....8.8........",
     "....7.77........",
     "...7.7..........",
     "....77.7........",
     ".....7.7........",
     "......777.......",
     ".......77.......",
     ".......77.......",
     "......77........",
     ".....77.........",
     "....7...........",
     "...7............",
     "...7............",
     "..7............."
    ],
    [
     ".......8........",
     "........8..8....",
     "..........8.8...",
     ".........8.8....",
     ".........8..8...",
     "........8.8.....",
     ".......88.......",
     ".....8..8.......",
     ".....8.8........",
     "....88.8........",
     "....8.8.........",
     ".....7.77.......",
     ".....7.7........",
     "......77.7......",
     ".......7.7......",
     ".......777......",
     ".......77.......",
     "......77........",
     "....77..........",
     "...77...........",
     "...7............",
     "..7.............",
     "..7.............",
     "...7............"
    ],
    [
     ".........8......",
     ".........8..8...",
     "..........8.8...",
     "........8.8.....",
     ".......8..8.....",
     "......8.8.......",
     "......88........",
     "....8..8........",
     "....8.8.........",
     ".....88.8.......",
     "......8.8.......",
     ".......7.77.....",
     ".......7.7......",
     ".......77.7.....",
     ".......7.7......",
     "......777.......",
     ".....77.........",
     "....77..........",
     "...77...........",
     "..77............",
     "..7.............",
     "...7............",
     "....7...........",
     ".....7.........."
    ],
    [
     ".........8......",
     "........8..8....",
     "........8.8.....",
     "......8.8.......",
     "......8..8......",
     ".....8.8........",
     ".....88.........",
     ".....8..8.......",
     "......8.8.......",
     ".......88.8.....",
     "........8.8.....",
     "........7.77....",
     ".......7.7......",
     "......77.7......",
     ".....7.7........",
     "....777.........",
     "....77..........",
     "...77...........",
     "..77............",
     "...77...........",
     "....7...........",
     ".....7..........",
     "......7.........",
     "......7........."
    ],
    [
     ".......8........",
     "......8..8......",
     ".......8.8......",
     ".....8.8........",
     ".....8..8.......",
     "......8.8.......",
     ".......88.......",
     ".......8..8.....",
     "........8.8.....",
     "........88.8....",
     "........8.8.....",
     ".......7.77.....",
     ".....7.7........",
     "....77.7........",
     "....7.7.........",
     "...777..........",
     "...77...........",
     "....77..........",
     "....77..........",
     ".....77.........",
     "......7.........",
     "......7.........",
     "......7.........",
     ".....7.........."
    ]
   ]
  }
 ]
};
