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
  // ---- THE CAB (the opening): through the open front of a hansom cab; nothing out there but fog --------------------
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
      { object: "canary", at: [96, 6], alt: "A canary in a small brass cage hangs from a hook in the roof." },
      { object: "egg_timer", at: [236, 108], alt: "An egg timer lies on the seat." }
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
      rect bell_window 12,58,40,34 mix:4,12@0.45 e0
      line - 32,58 32,92 c0
      rect pie_window 272,60,38,32 mix:6,14@0.45 e0
      line - 291,60 291,92 c0
      rect shop_l 86,52,22,24 mix:8,6@0.3 e0
      rect shop_r 232,50,18,22 mix:8,6@0.3 e0
      ellipse fog_near 160,80,170,26 mix:,6@0.25
      line - 70,30 70,112 c0
      ellipse glow_l1 70,28,20,14 mix:,14@0.35
      ellipse lamp_l1 70,28,5,6 14 e6
      line - 136,46 136,88 c0
      ellipse glow_l2 136,44,12,9 mix:,14@0.35
      ellipse lamp_l2 136,44,3,4 14
      line - 170,54 170,77 c8
      ellipse lamp_l3 170,53,2,2 14
      line - 268,28 268,110 c0
      ellipse glow_r1 268,26,18,13 mix:,14@0.35
      ellipse lamp_r1 268,26,5,6 14 e6
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
    cycles: [{ name: "the oven", areas: ["oven_mouth"], colors: [14, 12], style: "pingpong", ms: 2200 }]
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
      dots - 287,90 c14
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
    `,
    cycles: [{ name: "the caps", areas: ["caps_top"], colors: [10, 2], style: "pingpong", ms: 4000 }],
    overlays: [
      { object: "pole", at: [244, 80], alt: "A lamplighter's pole leans in the corner, its little blue flame burning." },
      { object: "trumpet", at: [180, 104], alt: "A dented brass ear trumpet lies on the floor." }
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
      ellipse bulb 214,36,6,8 15 e7
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
    alt: "Lantern Row from far above at dawn, the fog gone: rooftops in rows, a line of twelve lit lamps along the street, and the river curving past, pink with the sky. Two small figures walk away along the river, arm in arm.",
    picture: {
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
    }
  },
  // Relieved: close up, the twelfth lamp's lantern, lit at last, against the dark.
  relieved: {
    alt: "Close up, the lantern of the last lamp, lit: four panes of yellow light round a white flame, the iron cap above, and the brass hook of a lamplighter's pole at the tap below.",
    picture: {
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
    }
  },
  // The wrong name: from far above, a sea of grey fog with chimney pots through it, and one cold electric point.
  blamed: {
    alt: "From far above, a flat grey sea of fog over London, chimney pots poking through it in rows, and one small hard white light where Lantern Row should be.",
    picture: {
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
    }
  },
  // Died: close up, the canary in its cage, gone quiet, its head under its wing, with the fog coming in through the bars.
  died: {
    alt: "Close up, a small brass birdcage in grey fog. The canary sits on its perch with its head tucked under its wing, and the fog comes in between the bars.",
    picture: {
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
  }
};
