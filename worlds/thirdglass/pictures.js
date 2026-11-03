// Pictures for "The Third Glass" (worlds/thirdglass/world.en.js), one per room and one per ending, the way the AI writes them
// (BRIEF.md section 7): 320 x 136, EGA colours 0-15, shapes back to front in the short notation, ids on what the story may
// change or a cycle animates.
//
// The shot list, written before drawing (viewpoint; horizon; main subject and its size; lead colour):
//   dunes     wide landscape; horizon 74; the lone door in its frame, right third, 40% of the height; blue 1
//   camp      eye level, looking in; horizon 68, sun off centre right; the well on the right third, tents either side; yellow 14
//   tent      close-up, no horizon; the brazier, teapot and glasses filling 70% of the frame on a dark fade; light red 12
//   lines     wide landscape; horizon 44; the row of kneeling camels, the white one at the right third; light magenta 13
//   wadi      from above, no horizon; rippled sand in stripes flowing west, the flat stone small in the lower right; brown 6
//   ridge     looking down; horizon 18; the camp small in the pale dish below, cairn near, one thread of smoke far; magenta 5
//   mouth     looking up; horizon 112; the red rock tall and narrow, left of centre, the crack dark at its foot; red 4
//   gallery   eye level, looking in; horizon 66, vanishing point right of centre; the seated painted woman at the far end; yellow 14
//   hands     close-up, no horizon; one pale hand filling the frame among many, on a dark fade; light red 12 (hands is
//             not a neighbour of tent)
//   cistern   looking down; horizon 16; the round pool in the lower two thirds with the light twice in it; light blue 9
//   departed  silhouette; the caravan on a dune crest, black against a bright fade; light red 12 to yellow 14
//   stayed    from above; three glasses on a tin tray among rugs, the third still steaming; brown 6
//   lost      from far above; repeated dune ribs, one small dark figure sitting; yellow 14
//   died      close-up; a grey smear of light across sand and one footprint; dark grey 8
//
// Neighbours differ: dunes (wide, 74) is alone; camp (eye, 68) sits between tent (close) and lines (wide, 44) and wadi (above);
// wadi (above) / ridge (down, 18) / mouth (up, 112): three viewpoints; gallery (eye, 66) / hands (close) / cistern (down 16).


const rooms = {
  dunes: {
    picture: { version: 1, draw: `rect sky 0,0,320,74 fade:0,1/0,0/0,74
dots stars 120,19 52,46 202,30 79,5 34,1 205,35 148,51 30,14 266,34 184,17 88,52 54,16 109,60 13,53 133,51 139,12 84,19 148,40 190,5 310,21 198,32 127,11 126,30 143,5 280,53 153,0 149,36 159,54 260,12 211,27 306,18 220,28 82,14 156,16 22,5 23,29 143,33 273,41 241,44 175,9 100,4 211,58 103,40 225,17 94,22 223,47 301,20 285,12 165,6 31,45 117,17 298,39 121,7 169,59 90,18 235,1 21,22 42,57 146,47 167,1 c15
dots stars2 165,18 164,9 210,55 317,43 39,18 316,12 227,18 69,16 195,38 81,21 293,0 186,2 232,10 186,50 185,18 292,6 224,13 217,13 58,3 31,3 86,38 76,38 20,34 251,37 127,20 c11
dots twinkle 18,9 270,20 209,43 102,32 103,17 224,28 251,4 c15
ellipse horizonglow 160,76,180,14 mix:,9@0.18
poly far 0,74 34,66 78,72 130,63 188,71 240,64 290,69 320,66 320,84 0,84 mix:1,9@0.35
line farrim 0,74 34,66 78,72 130,63 188,71 240,64 290,69 320,66 c9
poly mid 0,84 50,76 120,83 190,77 260,82 320,76 320,100 0,100 mix:1,0@0.3
line midrim 0,84 50,76 120,83 190,77 260,82 320,76 c3
poly facet1 50,76 120,83 80,100 30,100 mix:0,1@0.5
poly facet2 190,77 260,82 230,100 170,100 mix:0,1@0.5
rect ground 0,96,320,40 fade:1,0/0,96/0,136
poly crest1 0,110 60,98 150,106 230,100 320,108 320,136 0,136 mix:0,1@0.3
line crest1rim 0,110 60,98 150,106 230,100 320,108 c1
poly crest2 0,126 80,118 170,124 260,118 320,124 320,136 0,136 0
ellipse doorshadow 232,113,24,3 0
rect lintel 207,52,42,5 6 e0
rect postl 207,57,5,56 6 e0
rect postr 244,57,5,56 6 e0
rect door 212,57,32,56 mix:6,0@0.25 e0
line grain1 220,60 220,110 c0
line grain2 230,60 230,110 c0
line crack 243,58 243,112 c14
dots hinges 214,66 214,100 c8
dots handle 238,86 c14`,
      cycles: [{ name: "twinkle", areas: ["twinkle"], colors: [15, 9], style: "pingpong", ms: 2400 }],
      overlays: [{ object: "shell", at: [190, 104] }] },
    alt: "A night desert of dunes under stars, with a lone wooden door standing in its frame on the sand."
  },
  camp: {
    picture: { version: 1, draw: `rect sky 0,0,320,40 fade:1,9/0,0/0,40
rect glow 0,40,320,32 fade:9,14/0,40/0,72
ellipse sunglow 236,64,34,18 mix:,15@0.3
ellipse sun 236,64,12,12 15
poly far 0,72 30,64 70,69 120,62 170,68 220,66 280,63 320,68 320,78 0,78 mix:6,14@0.35
poly mid 0,78 50,71 110,76 170,72 240,74 320,71 320,82 0,82 mix:6,14@0.6
rect ground 0,80,320,56 fade:14,6/0,80/0,136
dots pebbles 14,126 40,132 70,124 96,130 150,128 176,134 270,130 300,126 30,114 290,114 c6
poly tentd 52,76 60,70 90,69 98,76 mix:0,8@0.2 e8
poly tentb 138,80 148,72 180,71 190,80 mix:0,8@0.2 e8
poly shb 176,80 190,80 204,106 196,106 mix:,0@0.5
poly tenta 4,102 18,80 104,78 120,102 mix:0,8@0.2 e8
line tentaband 10,92 114,92 c8
line polea1 24,102 24,88 c6
line polea2 98,102 98,88 c6
poly sha 108,100 124,101 196,112 190,115 mix:,0@0.55
poly tentc 248,100 262,79 316,77 320,100 mix:0,8@0.2 e8
line tentcband 256,92 320,92 c8
line polec1 266,100 266,86 c6
line polec2 314,100 314,86 c6
poly shc 252,99 264,100 242,114 236,112 mix:,0@0.55
ellipse ashes 130,118,11,3 8 e0
line tripod1 122,102 130,118 c6
line tripod2 138,102 130,118 c6
ellipse pot 130,106,5,4 8 e0
poly flame 124,116 127,108 129,112 131,104 134,112 137,108 136,117 12
poly flamecore 128,116 130,110 133,116 14
line smoke 131,100 129,90 133,80 131,70 c7
ellipse figshadow 169,117,20,2 mix:,0@0.5
ellipse fighead 158,97,2,2 1
poly fig 154,100 162,100 164,115 152,115 1 e0
ellipse wellshadow 214,125,30,4 mix:,0@0.5
rect wellbody 192,106,46,18 fade:7,8/192,0/238,0
line course1 192,112 238,112 c8
line course2 192,118 238,118 c8
dots joints 200,109 214,109 228,109 206,115 222,115 198,121 212,121 232,121 c8
ellipse wellrim 215,106,23,6 7 e8
ellipse wellin 215,107,18,4 0
ellipse waterfill 215,108,16,3 0
rect postl 194,76,3,32 6 e0
rect postr 233,76,3,32 6 e0
rect bar 192,74,46,4 6 e0
line rope 215,78 215,103 c6
ellipse pulley 215,81,3,3 8 e0
rect bucket 211,100,8,6 6 e0
poly rock 0,128 20,123 40,129 34,136 0,136 8 e0
line br1 -2,10 30,16 62,12 c0
line br2 30,16 44,30 c0
line br3 62,12 80,6 c0
dots leaves 10,14 20,20 36,18 50,14 44,24 66,10 74,9 42,32 c2`,
      cycles: [{ name: "fire", areas: ["flame", "flamecore"], colors: [12, 14], style: "flicker", ms: [90, 220] }],
      overlays: [{ object: "charcoal", at: [146, 112] }] },
    alt: "A desert camp at dawn: black tents round a stone well, a fire in the middle, red dunes beyond."
  },
  tent: {
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:0,4/0,0/0,136
rect hang 0,0,320,12 mix:0,8@0.3
rect rug 0,98,320,38 stripes:4,6
poly diam1 20,112 40,102 60,112 40,122 12
poly diam2 100,112 120,102 140,112 120,122 14
poly diam3 180,112 200,102 220,112 200,122 12
poly diam4 260,112 280,102 300,112 280,122 14
rect pole 28,0,8,98 6 e0
ellipse imzadbody 32,62,11,14 6 e0
ellipse imzadhole 32,66,4,4 0
line imzadstring 32,12 32,50 c14
line imzadbow 40,30 40,86 c6
rect shelf 244,36,64,5 6 e0
rect shelfpost 248,41,4,22 6 e0
rect shelfpost2 300,41,4,22 6 e0
ellipse glow 112,74,72,46 mix:,12@0.3
poly leg1 78,108 90,92 96,92 86,110 8 e0
poly leg2 142,108 130,92 124,92 134,110 8 e0
poly bowl 70,86 150,86 134,106 86,106 8 e0
ellipse rim 110,86,40,6 7 e0
ellipse coals 110,86,36,4 12
dots embers 90,86 100,85 112,87 122,85 130,86 104,88 c14
poly spout 128,62 158,44 164,49 134,74 7 e0
poly handle 88,58 70,60 74,80 90,76 7 e0
ellipse handlehole 80,68,4,6 0
ellipse pot 110,68,24,18 7 e0
ellipse potshine 102,62,7,8 mix:7,15@0.6
ellipse lid 110,50,10,4 7 e0
dots knob 110,45 c15
line steam1 160,38 158,28 162,18 158,8 c15
line steam2 164,40 168,30 164,22 c7
ellipse tray 234,112,58,12 7 e8
ellipse trayin 234,111,48,8 8
poly g1 198,86 214,86 212,110 200,110 mix:6,14@0.3 e11
poly g2 224,86 240,86 238,110 226,110 mix:6,14@0.3 e11
poly g3 250,86 266,86 264,110 252,110 mix:6,14@0.5 e11
line steam3 258,82 255,72 261,62 256,50 c15
line steam4 262,80 266,70 262,60 c7
ellipse patch 230,126,90,5 mix:,0@0.4`,
      cycles: [{ name: "coals", areas: ["coals", "embers"], colors: [12, 14], style: "flicker", ms: [120, 300] }, { name: "steam", areas: ["steam3", "steam4"], colors: [15, 7], style: "pingpong", ms: 1800 }],
      overlays: [{ object: "lamp", at: [268, 20] }] },
    alt: "The inside of a black tent: a brazier with a teapot, three tea glasses on a tin tray, a lamp on a shelf."
  },
  lines: {
    picture: { version: 1, draw: `rect sky 0,0,320,44 fade:5,13/0,0/0,44
ellipse sunl 60,44,40,14 mix:,15@0.3
rect ground 0,44,320,92 fade:14,6/0,44/0,136
poly far 0,44 40,38 90,43 140,37 200,42 260,36 320,41 320,50 0,50 mix:6,13@0.4
dots stones 24,60 70,66 120,58 180,64 220,72 300,60 40,100 16,120 290,126 100,124 c6
ellipse sh0 108,85,13,1 mix:,0@0.5
ellipse k0body 102,78,12,5 6 e0
ellipse k0hump 100,72,4,3 6 e0
poly k0neck 109,78 111,70 114,61 118,59 119,62 117,65 116,75 114,82 6 e0
poly k0head 116,58 125,59 126,62 119,63 6 e0
rect k0fold 91,82,24,3 6 e0
line k0tail 90,77 88,82 c0
rect load0 95,66,12,5 14 e0
ellipse sh1 144,92,17,1 mix:,0@0.5
ellipse k1body 138,83,15,6 6 e0
ellipse k1hump 136,76,5,4 6 e0
poly k1neck 147,83 150,74 154,62 158,60 160,63 157,68 155,80 154,88 6 e0
poly k1head 155,58 167,60 168,63 159,64 6 e0
rect k1fold 125,88,30,3 6 e0
line k1tail 123,82 120,89 c0
rect load1 130,69,15,7 14 e0
ellipse sh2 182,101,20,1 mix:,0@0.5
ellipse k2body 176,90,18,8 6 e0
ellipse k2hump 173,82,6,5 6 e0
poly k2neck 187,90 190,79 195,65 201,62 203,66 199,72 197,87 195,96 6 e0
poly k2head 197,60 211,62 212,66 202,68 6 e0
rect k2fold 160,96,36,4 6 e0
line k2tail 158,89 154,97 c0
rect load2 166,73,19,8 14 e0
ellipse shlead 262,121,34,4 mix:,0@0.5
ellipse lead_body 256,105,28,12 15 e7
ellipse lead_hump 252,92,9,8 15 e7
poly lead_neck 274,105 278,87 286,64 295,60 298,66 292,75 289,99 286,114 15 e7
poly lead_head 289,57 312,60 313,66 296,69 15 e7
rect lead_fold 230,114,57,7 15 e7
line lead_tail 228,102 222,116 c7
poly lead_saddle 244,94 264,94 262,102 246,102 4 e0
dots lead_eye 287,63 c0
ellipse agshadow 212,115,14,2 mix:,0@0.5
ellipse aghead 208,78,4,4 1
poly agbody 202,83 214,83 217,113 199,113 1 e0
rect agveil 205,76,6,3 9
line agarm 214,92 224,86 c1
rect postl 8,56,4,66 6 e0
rect postr 84,58,4,66 6 e0
line wash 10,62 86,66 c7
rect wash1 56,66,10,18 1 e0
rect wash2 70,67,9,14 9 e0
rect wash3 16,63,8,10 3 e0`,
      overlays: [{ object: "cloth", at: [28, 64] }] },
    alt: "A row of kneeling camels at dawn, a white camel at the end, a man tying a load, washing on a line."
  },
  wadi: {
    picture: { version: 1, draw: `rect bed 0,0,320,136 14
rect banknorth 0,0,320,22 fade:6,14/0,0/0,22
rect banksouth 0,114,320,22 fade:14,6/0,114/0,136
line edgen 0,22 320,22 c6
line edges 0,114 320,114 c6
dots scrub 12,8 48,14 90,6 130,12 176,8 210,14 250,6 290,12 30,124 74,130 120,122 190,128 240,124 300,130 c2
line rip0 332,26 331,32 329,38 328,44 327,50 326,56 326,62 326,68 326,74 326,80 327,86 328,92 329,98 330,104 332,110 c6
line rip1 321,26 320,32 318,38 317,44 316,50 315,56 315,62 315,68 315,74 315,80 316,86 317,92 318,98 319,104 321,110 c6
line rip2 310,26 309,32 307,38 306,44 305,50 304,56 304,62 304,68 304,74 304,80 305,86 306,92 307,98 308,104 310,110 c6
line rip3 299,26 298,32 296,38 295,44 294,50 293,56 293,62 293,68 293,74 293,80 294,86 295,92 296,98 297,104 299,110 c6
line rip4 288,26 287,32 285,38 284,44 283,50 282,56 282,62 282,68 282,74 282,80 283,86 284,92 285,98 286,104 288,110 c6
line rip5 277,26 276,32 274,38 273,44 272,50 271,56 271,62 271,68 271,74 271,80 272,86 273,92 274,98 275,104 277,110 c6
line rip6 266,26 265,32 263,38 262,44 261,50 260,56 260,62 260,68 260,74 260,80 261,86 262,92 263,98 264,104 266,110 c6
line rip7 255,26 254,32 252,38 251,44 250,50 249,56 249,62 249,68 249,74 249,80 250,86 251,92 252,98 253,104 255,110 c6
line rip8 244,26 243,32 241,38 240,44 239,50 238,56 238,62 238,68 238,74 238,80 239,86 240,92 241,98 242,104 244,110 c6
line rip9 233,26 232,32 230,38 229,44 228,50 227,56 227,62 227,68 227,74 227,80 228,86 229,92 230,98 231,104 233,110 c6
line rip10 222,26 221,32 219,38 218,44 217,50 216,56 216,62 216,68 216,74 216,80 217,86 218,92 219,98 220,104 222,110 c6
line rip11 211,26 210,32 208,38 207,44 206,50 205,56 205,62 205,68 205,74 205,80 206,86 207,92 208,98 209,104 211,110 c6
line rip12 200,26 199,32 197,38 196,44 195,50 194,56 194,62 194,68 194,74 194,80 195,86 196,92 197,98 198,104 200,110 c6
line rip13 189,26 188,32 186,38 185,44 184,50 183,56 183,62 183,68 183,74 183,80 184,86 185,92 186,98 187,104 189,110 c6
line rip14 178,26 177,32 175,38 174,44 173,50 172,56 172,62 172,68 172,74 172,80 173,86 174,92 175,98 176,104 178,110 c6
line rip15 167,26 166,32 164,38 163,44 162,50 161,56 161,62 161,68 161,74 161,80 162,86 163,92 164,98 165,104 167,110 c6
line rip16 156,26 155,32 153,38 152,44 151,50 150,56 150,62 150,68 150,74 150,80 151,86 152,92 153,98 154,104 156,110 c6
line rip17 145,26 144,32 142,38 141,44 140,50 139,56 139,62 139,68 139,74 139,80 140,86 141,92 142,98 143,104 145,110 c6
line rip18 134,26 133,32 131,38 130,44 129,50 128,56 128,62 128,68 128,74 128,80 129,86 130,92 131,98 132,104 134,110 c6
line rip19 123,26 122,32 120,38 119,44 118,50 117,56 117,62 117,68 117,74 117,80 118,86 119,92 120,98 121,104 123,110 c6
line rip20 112,26 111,32 109,38 108,44 107,50 106,56 106,62 106,68 106,74 106,80 107,86 108,92 109,98 110,104 112,110 c6
line rip21 101,26 100,32 98,38 97,44 96,50 95,56 95,62 95,68 95,74 95,80 96,86 97,92 98,98 99,104 101,110 c6
line rip22 90,26 89,32 87,38 86,44 85,50 84,56 84,62 84,68 84,74 84,80 85,86 86,92 87,98 88,104 90,110 c6
line rip23 79,26 78,32 76,38 75,44 74,50 73,56 73,62 73,68 73,74 73,80 74,86 75,92 76,98 77,104 79,110 c6
line rip24 68,26 67,32 65,38 64,44 63,50 62,56 62,62 62,68 62,74 62,80 63,86 64,92 65,98 66,104 68,110 c6
line rip25 57,26 56,32 54,38 53,44 52,50 51,56 51,62 51,68 51,74 51,80 52,86 53,92 54,98 55,104 57,110 c6
line rip26 46,26 45,32 43,38 42,44 41,50 40,56 40,62 40,68 40,74 40,80 41,86 42,92 43,98 44,104 46,110 c6
line rip27 35,26 34,32 32,38 31,44 30,50 29,56 29,62 29,68 29,74 29,80 30,86 31,92 32,98 33,104 35,110 c6
line rip28 24,26 23,32 21,38 20,44 19,50 18,56 18,62 18,68 18,74 18,80 19,86 20,92 21,98 22,104 24,110 c6
line rip29 13,26 12,32 10,38 9,44 8,50 7,56 7,62 7,68 7,74 7,80 8,86 9,92 10,98 11,104 13,110 c6
poly rockw 0,4 30,8 44,30 50,62 40,92 24,114 0,120 4 e0
line strata0 0,16 34,19 c12
line strata1 0,30 39,33 c12
line strata2 0,44 44,47 c12
line strata3 0,84 34,87 c12
line strata4 0,98 39,101 c12
line strata5 0,108 44,111 c12
poly crackw 0,58 30,62 36,66 30,70 0,74 0
poly rockshade 0,4 14,6 18,40 14,100 0,120 mix:4,0@0.4
ellipse stoneshadow 282,98,22,5 mix:,0@0.5
poly stone 264,90 288,86 304,94 296,104 272,106 7 e8
poly stonehi 270,92 286,89 292,93 276,97 mix:7,15@0.5
line track 200,112 214,104 226,108 238,98 250,102 262,92 c0`,
      cycles: [{ name: "current", areas: ["rip0","rip3","rip6","rip9","rip12","rip15","rip18","rip21","rip24","rip27"], colors: [6, 14], style: "rotate", ms: 1400 }] },
    alt: "A dry riverbed seen from above, its sand rippled and flowing west towards a red rock, a flat stone at the edge."
  },
  ridge: {
    picture: { version: 1, draw: `rect sky 0,0,320,18 fade:1,9/0,0/0,18
rect glowr 0,10,320,8 mix:9,14@0.4
rect floor 0,18,320,118 fade:13,5/0,18/0,136
ellipse greenstrip 292,18,16,2 10
line smoke 292,17 292,1 c15
line rib0 0,26 32,29 64,29 96,28 128,25 160,23 192,23 224,26 256,28 288,29 320,28 c5
line ribl0 0,29 32,32 64,32 96,31 128,28 160,26 192,26 224,29 256,31 288,32 320,31 c15
line rib1 0,39 32,38 64,35 96,33 128,33 160,35 192,38 224,39 256,38 288,36 320,33 c5
line ribl1 0,42 32,41 64,38 96,36 128,36 160,38 192,41 224,42 256,41 288,39 320,36 c15
line rib2 0,45 32,43 64,43 96,45 128,48 160,49 192,48 224,46 256,43 288,43 320,45 c5
line ribl2 0,48 32,46 64,46 96,48 128,51 160,52 192,51 224,49 256,46 288,46 320,48 c15
line rib3 0,53 32,55 64,58 96,59 128,59 160,56 192,53 224,53 256,54 288,57 320,59 c5
line ribl3 0,56 32,58 64,61 96,62 128,62 160,59 192,56 224,56 256,57 288,60 320,62 c15
line rib4 0,67 32,69 64,69 96,66 128,64 160,63 192,64 224,67 256,69 288,69 320,67 c5
line ribl4 0,70 32,72 64,72 96,69 128,67 160,66 192,67 224,70 256,72 288,72 320,70 c15
line rib5 0,79 32,76 64,74 96,73 128,74 160,77 192,79 224,79 256,77 288,74 320,73 c5
line ribl5 0,82 32,79 64,77 96,76 128,77 160,80 192,82 224,82 256,80 288,77 320,76 c15
line rib6 0,84 32,83 64,84 96,86 128,89 160,89 192,87 224,84 256,83 288,83 320,86 c5
line ribl6 0,87 32,86 64,87 96,89 128,92 160,92 192,90 224,87 256,86 288,86 320,89 c15
line rib7 0,94 32,96 64,99 96,99 128,97 160,95 192,93 224,93 256,96 288,98 320,99 c5
line ribl7 0,97 32,99 64,102 96,102 128,100 160,98 192,96 224,96 256,99 288,101 320,102 c15
line rib8 0,109 32,109 64,107 96,105 128,103 160,103 192,106 224,108 256,109 288,108 320,105 c5
line ribl8 0,112 32,112 64,110 96,108 128,106 160,106 192,109 224,111 256,112 288,111 320,108 c15
ellipse dish 110,84,64,18 mix:15,13@0.5
line sh0 88,80 112,84 c8
line sh1 100,90 112,84 c8
line sh2 126,92 112,84 c8
line sh3 138,80 112,84 c8
line sh4 112,76 112,84 c8
poly tentr0 82,83 84,77 92,77 94,83 0
poly tentr1 94,93 96,87 104,87 106,93 0
poly tentr2 120,95 122,89 130,89 132,95 0
poly tentr3 132,83 134,77 142,77 144,83 0
poly tentr4 106,79 108,73 116,73 118,79 0
ellipse wellr 112,85,3,2 7
poly fg 0,100 70,92 140,108 150,136 0,136 8 e0
poly fg2 0,118 40,112 90,124 70,136 0,136 0
poly fg3 270,110 320,102 320,136 252,136 8 e0
ellipse cairn1 236,118,16,7 7 e8
ellipse cairn2 236,109,11,5 15 e8
ellipse cairn3 236,102,7,4 7 e8
ellipse cairn4 236,97,4,3 15 e8
ellipse cairnshadow 250,123,18,3 mix:,0@0.5`,
      cycles: [{ name: "smoke", areas: ["smoke"], colors: [15, 7], style: "pingpong", ms: 2600 }] },
    alt: "A high ridge looking down on a pale dish of sand, with a tiny camp in it, a stone cairn, and a thread of smoke far off."
  },
  mouth: {
    picture: { version: 1, draw: `rect sky 0,0,320,112 fade:9,11/0,0/0,112
poly rock 40,112 56,50 80,14 112,0 168,0 186,34 200,112 4 e0
poly rocklit 40,112 56,50 80,14 112,0 124,0 96,26 76,60 64,112 mix:4,12@0.45
line layer0 60,20 170,16 c12
line layer1 63,38 166,34 c12
line layer2 66,56 162,52 c12
line layer3 69,74 158,70 c12
line layer4 72,92 154,88 c12
poly crack 106,112 110,70 118,52 124,44 130,56 136,112 0
poly crackin 112,112 114,80 122,62 128,80 130,112 8
ellipse breath 121,108,18,5 mix:,11@0.5
ellipse cow0b 60,98,13,6 12
poly cow0h 70,94 81,95 81,101 70,99 12
line cow0horn 73,94 72,88 c12
line cow0l 51,102 51,111 57,102 57,111 64,102 64,111 70,102 70,111 c12
ellipse cow1b 80,86,10,4 12
poly cow1h 88,83 96,84 96,88 88,87 12
line cow1horn 90,83 89,78 c12
line cow1l 73,89 73,96 78,89 78,96 83,89 83,96 88,89 88,96 c12
ellipse cow2b 98,96,12,5 12
poly cow2h 107,92 117,94 117,98 107,97 12
line cow2horn 110,92 109,87 c12
line cow2l 90,100 90,108 96,100 96,108 102,100 102,108 107,100 107,108 c12
rect sand 0,112,320,24 fade:14,6/0,112/0,136
line rp1 0,120 90,116 160,122 230,117 320,121 c6
line rp2 0,128 70,125 150,130 240,126 320,130 c6
poly fgrock 250,136 262,100 280,92 300,100 320,96 320,136 0 e8
line thorn1 270,98 262,70 c0
line thorn2 266,84 252,76 c0
line thorn3 268,88 284,76 c0
dots thornleaf 262,70 252,76 284,76 270,70 c2`,
      cycles: [{ name: "breath", areas: ["breath"], colors: [11, 9], style: "pingpong", ms: 2200 }] },
    alt: "A tall red rock with a dark crack at its foot, red painted cattle walking into it."
  },
  gallery: {
    picture: { version: 1, draw: `rect bg 0,0,320,136 0
poly ceiling 0,0 320,0 262,40 172,40 mix:0,6@0.2
poly floor 0,136 172,96 262,96 320,136 fade:6,0/0,136/0,96
poly leftwall 0,0 172,40 172,96 0,136 fade:6,0/0,60/172,60
poly rightwall 262,40 320,0 320,136 262,96 fade:0,6/262,60/320,60
rect backwall 172,40,90,56 fade:6,14/172,0/262,0
ellipse lightglow 90,80,110,58 mix:,14@0.2
poly river 6,100 60,90 110,84 164,76 164,82 110,92 60,100 6,112 mix:,9@0.8
ellipse gi1body 30,66,16,8 14
poly gi1neck 38,61 44,61 49,18 44,18 14
poly gi1head 42,15 56,18 56,22 45,22 14
line gi1legs 18,70 18,94 25,70 25,94 37,70 37,94 44,70 44,94 c14
dots gi1spots 23,63 31,67 38,63 42,46 45,32 c6
ellipse gi2body 84,70,12,6 14
poly gi2neck 90,67 94,67 98,36 94,36 14
poly gi2head 93,34 103,36 103,39 95,39 14
line gi2legs 76,73 76,90 81,73 81,90 89,73 89,90 94,73 94,90 c14
dots gi2spots 79,68 85,71 90,68 93,56 95,46 c6
line dancer0 104,84 104,74 c12
line dancerarm0 100,70 104,74 108,70 c12
line dancer1 117,84 117,74 c12
line dancerarm1 113,70 117,74 121,70 c12
line dancer2 130,84 130,74 c12
line dancerarm2 126,70 130,74 134,70 c12
line dancer3 143,84 143,74 c12
line dancerarm3 139,70 143,74 147,70 c12
line dancer4 156,84 156,74 c12
line dancerarm4 152,70 156,74 160,70 c12
dots dancerheads 104,71 117,71 130,71 143,71 156,71 c12
ellipse paintwell 238,86,12,4 4
rect paintwellwall 226,80,24,8 4
ellipse flame 252,76,2,4 12
ellipse womanhead 205,54,5,5 12
poly woman 197,60 213,60 218,90 192,90 12
poly womanarmL 198,64 188,78 192,82 202,70 12
poly womanarmR 212,64 220,78 216,82 208,70 12
ellipse worn 205,96,24,3 mix:,15@0.4
line womanline 192,90 218,90 c4
poly nearl 0,0 24,0 12,136 0,136 0
poly nearr 296,0 320,0 320,136 306,136 0`,
      cycles: [{ name: "firelight", areas: ["lightglow", "flame"], colors: [14, 6], style: "flicker", ms: [180, 420] }] },
    alt: "A long cave chamber painted with giraffes and dancers, and at its end a life-size woman sitting by a well."
  },
  hands: {
    picture: { version: 1, draw: `rect wall 0,0,320,136 fade:4,12/0,0/320,136
rect shade 0,0,320,136 mix:,0@0.15
poly bigpalm 119,75 162,71 168,101 159,122 133,125 120,106 14
poly bigf0 119,80 128,79 119,31 110,36 14
poly bigf1 128,79 139,77 130,16 122,17 14
poly bigf2 139,77 150,76 145,10 136,11 14
poly bigf3 150,76 161,75 160,22 151,23 14
poly bigth 121,97 127,114 94,91 99,77 14
poly sm0palm 32,38 45,34 49,43 48,50 40,53 35,48 7
poly sm0f0 32,40 35,39 29,25 26,27 7
poly sm0f1 35,39 38,38 31,19 28,20 7
poly sm0f2 38,38 42,36 35,16 33,17 7
poly sm0f3 42,36 45,35 41,19 38,20 7
poly sm0th 34,45 38,50 26,45 26,41 7
poly sm1palm 254,27 269,31 267,42 261,48 252,46 250,38 7
poly sm1f0 253,29 256,30 259,12 256,13 7
poly sm1f1 256,30 260,31 265,9 262,8 7
poly sm1f2 260,31 264,32 271,9 268,8 7
poly sm1f3 264,32 268,33 274,15 271,14 7
poly sm1th 251,35 251,42 243,29 247,25 7
poly sm2palm 283,105 298,106 298,117 293,123 284,122 281,115 7
poly sm2f0 283,106 286,107 286,90 283,91 7
poly sm2f1 286,107 290,107 291,86 288,86 7
poly sm2f2 290,107 293,107 296,85 293,85 7
poly sm2f3 293,107 297,108 300,90 297,90 7
poly sm2th 282,112 283,118 274,109 276,104 7
poly sm3palm 15,109 31,106 34,117 31,125 22,126 16,120 7
poly sm3f0 16,110 19,110 14,93 11,95 7
poly sm3f1 19,110 23,109 18,87 15,88 7
poly sm3f2 23,109 27,108 23,85 20,85 7
poly sm3f3 27,108 31,108 29,88 26,89 7
poly sm3th 17,117 19,123 7,115 8,110 7
poly sm4palm 229,87 238,91 235,98 231,101 226,98 225,93 7
poly sm4f0 228,88 230,89 234,79 232,79 7
poly sm4f1 230,89 232,90 238,77 236,76 7
poly sm4f2 232,90 235,91 241,78 240,77 7
poly sm4f3 235,91 237,92 243,82 241,81 7
poly sm4th 227,92 226,96 222,87 225,85 7
poly sm5palm 66,67 74,67 75,74 73,78 67,78 65,74 7
poly sm5f0 66,68 67,68 66,58 65,59 7
poly sm5f1 67,68 70,68 69,56 67,56 7
poly sm5f2 70,68 72,68 72,55 70,55 7
poly sm5f3 72,68 74,68 75,57 73,57 7
poly sm5th 66,72 66,75 60,70 61,67 7
poly sm6palm 205,29 214,26 216,32 215,37 209,38 206,35 7
poly sm6f0 205,29 207,29 203,20 202,21 7
poly sm6f1 207,29 209,28 205,16 204,17 7
poly sm6f2 209,28 211,28 208,15 206,15 7
poly sm6f3 211,28 213,27 212,17 210,17 7
poly sm6th 206,33 208,36 200,33 201,30 7
poly sm7palm 106,20 115,22 115,29 111,33 106,32 104,27 7
poly sm7f0 105,21 107,22 108,11 106,11 7
poly sm7f1 107,22 110,22 112,8 110,8 7
poly sm7f2 110,22 112,22 115,8 113,7 7
poly sm7f3 112,22 115,23 118,11 116,11 7
poly sm7th 105,25 105,29 99,22 101,19 7
rect vig 0,0,320,12 mix:,0@0.5`,
      cycles: [{ name: "glow", areas: ["bigpalm"], colors: [14, 15], style: "pingpong", ms: 2600 }] },
    alt: "A small round cave covered in hundreds of pale handprints on a red wall."
  },
  cistern: {
    picture: { version: 1, draw: `rect bg 0,0,320,136 0
rect farwall 0,0,320,16 fade:8,0/0,0/0,16
ellipse floor 160,76,150,56 8 e0
ellipse floorin 160,76,140,50 mix:8,7@0.3
poly channel 0,70 70,72 110,76 110,84 70,84 0,86 mix:8,0@0.3
ellipse lip 188,76,92,40 7 e8
ellipse pool 188,78,82,34 1 e0
ellipse poolfade 188,82,70,24 mix:1,9@0.45
ellipse ring1 188,80,50,18 none e9
ellipse ring2 188,80,30,10 none e11
ellipse light1 170,70,6,3 15
ellipse light2 202,88,6,3 14
dots drops 170,40 171,44 c9
poly stalg 120,0 130,0 126,16 mix:7,8@0.5
poly stalg2 250,0 262,0 256,18 mix:7,8@0.5`,
      cycles: [{ name: "ripple", areas: ["ring1", "ring2"], colors: [9, 11], style: "rotate", ms: 1800 }, { name: "twin", areas: ["light1", "light2"], colors: [15, 14], style: "pingpong", ms: 2200 }] },
    alt: "A round cave chamber with a still pool in the middle, lit from above, and a stone lip round it."
  }
};
export default rooms;

export const endings = {
  departed: {
    alt: "The caravan leaves at sunrise: camels in a line along a dune crest, black against the light, a rider on the white camel at the head.",
    picture: { version: 1, draw: `rect sky 0,0,320,136 fade:12,14/0,0/0,100
ellipse sunglow 214,86,56,26 mix:,15@0.35
ellipse sun 214,84,16,16 15
poly crest 0,136 0,108 70,100 140,96 214,100 280,92 320,88 320,136 0
rect c0leg0 31,95,2,11 0 e0
rect c0leg1 35,95,2,11 0 e0
rect c0leg2 43,95,2,11 0 e0
rect c0leg3 47,95,2,11 0 e0
ellipse c0body 40,92,10,4 0 e0
ellipse c0hump 38,87,3,3 0 e0
poly c0neck 47,92 48,85 51,77 54,75 55,77 53,81 52,90 51,95 0 e0
poly c0head 52,74 60,75 61,77 55,78 0 e0
line c0tail 30,90 28,98 c0
rect c1leg0 66,91,2,12 0 e0
rect c1leg1 70,91,2,12 0 e0
rect c1leg2 80,91,2,12 0 e0
rect c1leg3 84,91,2,12 0 e0
ellipse c1body 76,87,12,5 0 e0
ellipse c1hump 74,81,4,3 0 e0
poly c1neck 83,87 85,79 88,70 92,68 93,71 91,74 90,84 88,91 0 e0
poly c1head 90,67 99,68 100,71 93,72 0 e0
line c1tail 64,84 62,94 c0
rect c2leg0 101,86,2,14 0 e0
rect c2leg1 105,86,2,14 0 e0
rect c2leg2 117,86,2,14 0 e0
rect c2leg3 121,86,2,14 0 e0
ellipse c2body 112,82,13,6 0 e0
ellipse c2hump 110,76,4,4 0 e0
poly c2neck 120,82 122,73 126,63 130,61 132,64 129,68 127,79 126,86 0 e0
poly c2head 127,59 138,61 139,64 131,65 0 e0
line c2tail 99,79 97,90 c0
rect c3leg0 136,82,2,16 0 e0
rect c3leg1 141,82,2,16 0 e0
rect c3leg2 153,82,2,16 0 e0
rect c3leg3 158,82,2,16 0 e0
ellipse c3body 148,78,15,6 0 e0
ellipse c3hump 146,71,5,4 0 e0
poly c3neck 157,78 160,68 164,57 168,54 170,57 167,62 165,75 164,82 0 e0
poly c3head 165,53 177,54 178,57 169,59 0 e0
line c3tail 133,75 131,87 c0
rect c4leg0 169,83,2,17 0 e0
rect c4leg1 174,83,2,17 0 e0
rect c4leg2 188,83,2,17 0 e0
rect c4leg3 193,83,2,17 0 e0
ellipse c4body 182,78,16,7 0 e0
ellipse c4hump 179,70,5,4 0 e0
poly c4neck 192,78 195,67 199,54 204,52 206,55 203,60 201,74 199,83 0 e0
poly c4head 201,50 214,52 215,55 205,57 0 e0
line c4tail 166,74 163,88 c0
rect leadleg0 236,75,3,21 0 e0
rect leadleg1 243,75,3,21 0 e0
rect leadleg2 259,75,3,21 0 e0
rect leadleg3 266,75,3,21 0 e0
ellipse leadbody 252,69,20,8 0 e0
ellipse leadhump 249,59,6,5 0 e0
poly leadneck 265,69 268,56 273,40 279,37 281,41 277,48 275,64 273,75 0 e0
poly leadhead 275,35 291,37 292,41 280,44 0 e0
line leadtail 232,64 229,81 c0
ellipse rider 244,56,3,3 0
poly riderb 240,62 248,62 250,72 238,72 0
poly figa 276,98 280,86 284,98 0
ellipse figahead 280,84,2,2 0` }
  },
  stayed: {
    alt: "Three tea glasses on a tin tray, seen from above among rugs; the third still steaming.",
    picture: { version: 1, draw: `rect rug 0,0,320,136 6
rect rugb1 0,0,320,10 4
rect rugb2 0,126,320,10 4
rect rugb3 0,0,10,136 4
rect rugb4 310,0,10,136 4
poly rugd0 24,68 40,56 56,68 40,80 12
poly rugd1 62,68 78,56 94,68 78,80 12
poly rugd2 100,68 116,56 132,68 116,80 12
poly rugd3 138,68 154,56 170,68 154,80 12
poly rugd4 176,68 192,56 208,68 192,80 12
poly rugd5 214,68 230,56 246,68 230,80 12
poly rugd6 252,68 268,56 284,68 268,80 12
poly rugd7 290,68 306,56 322,68 306,80 12
ellipse glow 70,110,50,30 mix:,12@0.3
ellipse trayshadow 156,76,94,56 mix:,0@0.5
ellipse tray 150,70,92,54 7 e8
ellipse trayin 150,70,80,44 8
ellipse glass0o 112,72,14,14 15 e11
ellipse glass0t 112,72,10,10 6
ellipse glass1o 150,72,14,14 15 e11
ellipse glass1t 150,72,10,10 6
ellipse glass2o 188,72,14,14 15 e11
ellipse glass2t 188,72,10,10 6
ellipse glass2t2 188,72,10,10 14
line steam1 188,60 184,46 192,34 186,20 c15
line steam2 192,58 198,44 192,32 c7
line steam3 184,58 178,46 182,36 c7
ellipse pot 262,32,18,18 7 e8
poly spout 248,28 220,16 224,12 252,22 7 e8
ellipse lid 262,32,8,8 8 e7`,
      cycles: [{ name: "steam", areas: ["steam1", "steam2", "steam3"], colors: [15, 7], style: "pingpong", ms: 1800 }] }
  },
  lost: {
    alt: "The sand sea from far above: ribs of dunes, one line of tracks, and a small dark figure sitting at its end.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 14
poly band0 0,6 20,7 40,8 60,8 80,7 100,6 120,4 140,4 160,4 180,6 200,7 220,8 240,8 260,7 280,6 300,4 320,4 320,12 300,12 280,14 260,15 240,16 220,16 200,15 180,14 160,12 140,12 120,12 100,14 80,15 60,16 40,16 20,15 0,14 mix:14,6@0.35
poly band2 0,26 20,25 40,24 60,23 80,22 100,22 120,23 140,25 160,26 180,26 200,25 220,24 240,23 260,22 280,22 300,23 320,24 320,32 300,31 280,30 260,30 240,31 220,32 200,33 180,34 160,34 140,33 120,31 100,30 80,30 60,31 40,32 20,33 0,34 mix:14,6@0.35
poly band4 0,41 20,40 40,40 60,41 80,42 100,44 120,44 140,44 160,42 180,41 200,40 220,40 240,41 260,42 280,43 300,44 320,44 320,52 300,52 280,51 260,50 240,49 220,48 200,48 180,49 160,50 140,52 120,52 100,52 80,50 60,49 40,48 20,48 0,49 mix:14,6@0.35
poly band6 0,58 20,60 40,61 60,62 80,62 100,61 120,60 140,58 160,58 180,58 200,60 220,61 240,62 260,62 280,61 300,60 320,59 320,67 300,68 280,69 260,70 240,70 220,69 200,68 180,66 160,66 140,66 120,68 100,69 80,70 60,70 40,69 20,68 0,66 mix:14,6@0.35
poly band8 0,80 20,80 40,80 60,78 80,77 100,76 120,76 140,77 160,78 180,80 200,80 220,80 240,78 260,77 280,76 300,76 320,77 320,85 300,84 280,84 260,85 240,86 220,88 200,88 180,88 160,86 140,85 120,84 100,84 80,85 60,86 40,88 20,88 0,88 mix:14,6@0.35
poly band10 0,97 20,96 40,94 60,94 80,94 100,96 120,97 140,98 160,98 180,97 200,96 220,94 240,94 260,94 280,96 300,97 320,98 320,106 300,105 280,104 260,102 240,102 220,102 200,104 180,105 160,106 140,106 120,105 100,104 80,102 60,102 40,102 20,104 0,105 mix:14,6@0.35
poly band12 0,112 20,112 40,113 60,114 80,116 100,116 120,116 140,114 160,113 180,112 200,112 220,113 240,114 260,116 280,116 300,116 320,114 320,122 300,124 280,124 260,124 240,122 220,121 200,120 180,120 160,121 140,122 120,124 100,124 80,124 60,122 40,121 20,120 0,120 mix:14,6@0.35
poly band14 0,132 20,133 40,134 60,134 80,133 100,131 120,130 140,130 160,130 180,132 200,133 220,134 240,134 260,133 280,132 300,130 320,130 320,138 300,138 280,140 260,141 240,142 220,142 200,141 180,140 160,138 140,138 120,138 100,139 80,141 60,142 40,142 20,141 0,140 mix:14,6@0.35
line rib0 0,6 20,7 40,8 60,8 80,7 100,6 120,4 140,4 160,4 180,6 200,7 220,8 240,8 260,7 280,6 300,4 320,4 c6
line ribl0 0,10 20,11 40,12 60,12 80,11 100,10 120,8 140,8 160,8 180,10 200,11 220,12 240,12 260,11 280,10 300,8 320,8 c15
line rib1 0,17 20,17 40,17 60,15 80,14 100,13 120,13 140,14 160,15 180,17 200,17 220,17 240,15 260,14 280,13 300,13 320,14 c6
line ribl1 0,21 20,21 40,21 60,19 80,18 100,17 120,17 140,18 160,19 180,21 200,21 220,21 240,19 260,18 280,17 300,17 320,18 c15
line rib2 0,26 20,25 40,24 60,23 80,22 100,22 120,23 140,25 160,26 180,26 200,25 220,24 240,23 260,22 280,22 300,23 320,24 c6
line ribl2 0,30 20,29 40,28 60,27 80,26 100,26 120,27 140,29 160,30 180,30 200,29 220,28 240,27 260,26 280,26 300,27 320,28 c15
line rib3 0,34 20,33 40,31 60,31 80,31 100,33 120,34 140,35 160,35 180,34 200,33 220,31 240,31 260,31 280,33 300,34 320,35 c6
line ribl3 0,38 20,37 40,35 60,35 80,35 100,37 120,38 140,39 160,39 180,38 200,37 220,35 240,35 260,35 280,37 300,38 320,39 c15
line rib4 0,41 20,40 40,40 60,41 80,42 100,44 120,44 140,44 160,42 180,41 200,40 220,40 240,41 260,42 280,43 300,44 320,44 c6
line ribl4 0,45 20,44 40,44 60,45 80,46 100,48 120,48 140,48 160,46 180,45 200,44 220,44 240,45 260,46 280,47 300,48 320,48 c15
line rib5 0,49 20,49 40,50 60,51 80,53 100,53 120,53 140,51 160,50 180,49 200,49 220,50 240,51 260,53 280,53 300,53 320,51 c6
line ribl5 0,53 20,53 40,54 60,55 80,57 100,57 120,57 140,55 160,54 180,53 200,53 220,54 240,55 260,57 280,57 300,57 320,55 c15
line rib6 0,58 20,60 40,61 60,62 80,62 100,61 120,60 140,58 160,58 180,58 200,60 220,61 240,62 260,62 280,61 300,60 320,59 c6
line ribl6 0,62 20,64 40,65 60,66 80,66 100,65 120,64 140,62 160,62 180,62 200,64 220,65 240,66 260,66 280,65 300,64 320,63 c15
line rib7 0,69 20,70 40,71 60,71 80,70 100,69 120,67 140,67 160,67 180,69 200,70 220,71 240,71 260,70 280,69 300,67 320,67 c6
line ribl7 0,73 20,74 40,75 60,75 80,74 100,73 120,71 140,71 160,71 180,73 200,74 220,75 240,75 260,74 280,73 300,71 320,71 c15
line rib8 0,80 20,80 40,80 60,78 80,77 100,76 120,76 140,77 160,78 180,80 200,80 220,80 240,78 260,77 280,76 300,76 320,77 c6
line ribl8 0,84 20,84 40,84 60,82 80,81 100,80 120,80 140,81 160,82 180,84 200,84 220,84 240,82 260,81 280,80 300,80 320,81 c15
line rib9 0,89 20,88 40,87 60,85 80,85 100,85 120,87 140,88 160,89 180,89 200,88 220,87 240,86 260,85 280,85 300,86 320,87 c6
line ribl9 0,93 20,92 40,91 60,89 80,89 100,89 120,91 140,92 160,93 180,93 200,92 220,91 240,90 260,89 280,89 300,90 320,91 c15
line rib10 0,97 20,96 40,94 60,94 80,94 100,96 120,97 140,98 160,98 180,97 200,96 220,94 240,94 260,94 280,96 300,97 320,98 c6
line ribl10 0,101 20,100 40,98 60,98 80,98 100,100 120,101 140,102 160,102 180,101 200,100 220,98 240,98 260,98 280,100 300,101 320,102 c15
line rib11 0,104 20,103 40,103 60,104 80,105 100,107 120,107 140,107 160,105 180,104 200,103 220,103 240,104 260,105 280,106 300,107 320,107 c6
line ribl11 0,108 20,107 40,107 60,108 80,109 100,111 120,111 140,111 160,109 180,108 200,107 220,107 240,108 260,109 280,110 300,111 320,111 c15
line rib12 0,112 20,112 40,113 60,114 80,116 100,116 120,116 140,114 160,113 180,112 200,112 220,113 240,114 260,116 280,116 300,116 320,114 c6
line ribl12 0,116 20,116 40,117 60,118 80,120 100,120 120,120 140,118 160,117 180,116 200,116 220,117 240,118 260,120 280,120 300,120 320,118 c15
line rib13 0,121 20,123 40,124 60,125 80,125 100,124 120,123 140,121 160,121 180,121 200,123 220,124 240,125 260,125 280,124 300,123 320,121 c6
line ribl13 0,125 20,127 40,128 60,129 80,129 100,128 120,127 140,125 160,125 180,125 200,127 220,128 240,129 260,129 280,128 300,127 320,125 c15
line rib14 0,132 20,133 40,134 60,134 80,133 100,131 120,130 140,130 160,130 180,132 200,133 220,134 240,134 260,133 280,132 300,130 320,130 c6
line ribl14 0,136 20,137 40,138 60,138 80,137 100,135 120,134 140,134 160,134 180,136 200,137 220,138 240,138 260,137 280,136 300,134 320,134 c15
line rib15 0,143 20,143 40,143 60,141 80,140 100,139 120,139 140,140 160,141 180,143 200,143 220,143 240,141 260,140 280,139 300,139 320,140 c6
line ribl15 0,147 20,147 40,147 60,145 80,144 100,143 120,143 140,144 160,145 180,147 200,147 220,147 240,145 260,144 280,143 300,143 320,144 c15
dots tracks 40,20 52,26 64,30 80,38 92,44 108,50 120,56 136,60 152,64 170,66 188,66 206,68 218,70 c6
ellipse figshadow 238,76,12,4 mix:,0@0.6
ellipse figbody 230,68,7,8 0
ellipse fighead 230,59,4,4 0
line figknees 226,74 232,78 c0` }
  },
  died: {
    alt: "A grey smear of light across dark sand, and one footprint.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:0,8/0,0/0,136
ellipse smear 160,66,150,22 mix:,7@0.45
ellipse smear2 160,66,96,12 mix:,15@0.3
line dr0 0,90 20,91 40,91 60,90 80,90 100,89 120,89 140,90 160,91 180,91 200,90 220,89 240,89 260,89 280,90 300,91 320,91 c8
line dr1 0,98 20,98 40,97 60,96 80,96 100,96 120,97 140,98 160,98 180,97 200,96 220,96 240,96 260,97 280,98 300,98 320,97 c8
line dr2 0,105 20,104 40,103 60,103 80,103 100,104 120,105 140,105 160,104 180,103 200,103 220,103 240,104 260,105 280,105 300,104 320,103 c8
line dr3 0,111 20,110 40,110 60,110 80,111 100,112 120,112 140,111 160,110 180,110 200,111 220,111 240,112 260,112 280,111 300,110 320,110 c8
line dr4 0,117 20,117 40,118 60,118 80,119 100,119 120,118 140,117 160,117 180,118 200,119 220,119 240,119 260,118 280,117 300,117 320,118 c8
line dr5 0,124 20,125 40,126 60,126 80,126 100,125 120,124 140,124 160,125 180,126 200,126 220,126 240,125 260,124 280,124 300,125 320,126 c8
line dr6 0,132 20,133 40,133 60,133 80,132 100,131 120,131 140,132 160,133 180,133 200,133 220,132 240,131 260,131 280,132 300,133 320,133 c8
ellipse heel 150,108,6,6 0 e8
ellipse sole 154,94,8,10 0 e8
ellipse toe0 147,82,2,2 0 e8
ellipse toe1 152,80,2,2 0 e8
ellipse toe2 157,80,2,2 0 e8
ellipse toe3 162,82,2,2 0 e8
ellipse toe4 166,86,2,2 0 e8` }
  }
};

// What changes when the well is filled (restyle, and a shimmer on the water) and when Afternoon stands (her kneeling shapes
// removed, her standing ones added).
export const afterWell = [{ id: "waterfill", fill: 9 }];
export const afterWellCycles = [{ name: "water", areas: ["waterfill"], colors: [9, 11], style: "rotate", ms: 1600 }];
export const afterStand = {
  remove: ["lead_body", "lead_hump", "lead_neck", "lead_head", "lead_fold", "lead_tail", "lead_saddle", "lead_eye"],
  add: [
    "rect stand_leg0 234,90,4,30 15 e7",
    "rect stand_leg1 243,90,4,30 15 e7",
    "rect stand_leg2 267,90,4,30 15 e7",
    "rect stand_leg3 276,90,4,30 15 e7",
    "ellipse stand_body 256,81,28,12 15 e7",
    "ellipse stand_hump 252,68,9,8 15 e7",
    "poly stand_neck 274,81 278,63 286,40 295,36 298,42 292,51 289,75 286,90 15 e7",
    "poly stand_head 289,33 312,36 313,42 296,45 15 e7",
    "line stand_tail 228,75 223,99 c7",
    "poly stand_saddle 244,80 264,80 262,88 246,88 4 e0",
    "dots stand_eye 287,48 c0"
  ]
};
