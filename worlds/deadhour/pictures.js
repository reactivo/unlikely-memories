// Pictures for "The Dead Hour at Pylon Nine" (worlds/deadhour/world.en.js), one per room and one per ending, the way the AI writes
// them (BRIEF.md section 7): 320 x 136, EGA colours 0-15, shapes back to front in the short notation, ids on what the story may
// change or a cycle animates.
//
// The shot list, written before drawing (viewpoint; horizon; main subject and its size; lead colour):
//   skycab    through something (the cab's doors, a dark frame round it); its own horizon 86; the gangway running into smoke, right third; light grey 7
//   pylon     eye level, looking in; horizon 66, vanishing point at x 90; the stopped Inspector on the left third, a third of the height; brown 6
//   rank      wide landscape; horizon 72; the open floater with its lamp lit on the centre-right, floaters either side; light magenta 13
//   market    from above; none; a lane of striped awnings, the barrow with the head small and drawn larger on the right; red 4
//   salter    close-up; none; the brass hand in its vice filling the left of the frame, on a dark fade; yellow 14
//   registry  eye level, looking in; horizon 62, vanishing point at x 230; the wall of pigeonholes, the clerk at the counter on the right third; green 2
//   tower     looking up; 115; the spiral stair tall and narrow on the left third, the lit hole above, the warden at the foot; blue 1
//   gears     looking down; horizon 16; the great meshed wheels in the lower two thirds, the steaming pipe on the right; dark grey 8 (brass edges)
//   face      silhouette; none; drums, bell and hands black against the pale dial, the gap in the drums on the left third; yellow 14
//   restored  close-up; none; the dial, hands together on the thirteenth tick, on a dark fade; light cyan 11
//   kept      from above; none; the platform with hands seated in rows in lamp pools, one small porter drawn larger on his trolley; light magenta 13
//   flown     wide landscape; horizon 42; the small floater high in the stars on the right third, the city a coin of light under the smoke; light blue 9
//   died      close-up; none; a white sheet of steam across a dark iron wall and a dropped cap; dark grey 8
//
// Neighbours differ: skycab (through, 86) / pylon (eye, 66); pylon / rank (wide, 72) / market (above); market / salter (close-up) /
// registry (eye, 62, green); market / tower (up, 115); tower / gears (down, 16) / face (silhouette).

const rooms = {
  skycab: {
    picture: { version: 1, draw: `rect smoke 0,0,320,86 fade:15,7/0,0/0,86
rect smoke2 0,86,320,50 fade:7,8/0,86/0,136
ellipse puff1 210,40,80,16 mix:,15@0.4
ellipse puff2 70,70,70,10 mix:,15@0.3
ellipse puff3 250,110,60,10 mix:,8@0.4
ellipse lamp 262,56,6,4 14
poly gangway 150,136 300,136 256,90 232,90 6 e0
line plank1 168,136 238,92 c0
line plank2 196,136 244,92 c0
line plank3 228,136 250,92 c0
line plank4 262,136 254,92 c0
line rope1 150,136 232,90 c7
line rope2 300,136 256,90 c7
line rope1b 190,100 232,80 c7
poly clip 140,122 154,118 158,130 144,134 14 e0
rect frame_top 0,0,320,18 0 e8
poly frame_l 0,0 58,0 46,136 0,136 0 e8
poly frame_r 282,0 320,0 320,136 300,136 0 e8
rect dash 0,112,320,24 0 e6
rect dashrim 0,112,320,3 6
ellipse meter 72,124,14,10 7 e0
line meterhand 72,124 80,119 c0
dots rivets 62,120 66,128 98,120 104,128 112,120 c14
line hook 124,114 124,106 c6
poly seatback 0,70 40,64 46,112 0,112 6 e0
dots seatbuttons 14,82 28,80 12,96 28,94 c0`,
      cycles: [{ name: "smudge", areas: ["lamp"], colors: [14, 6], style: "pingpong", ms: 2400 }],
      overlays: [{ object: "trumpet", at: [116, 94] }] }
  },

  pylon: {
    picture: { version: 1, draw: `rect sky 0,0,320,66 fade:8,7/0,0/0,66
ellipse haze 160,60,170,10 mix:,15@0.35
poly city 0,66 0,56 14,56 14,48 22,48 22,56 40,56 40,40 46,40 46,56 70,56 70,50 86,50 86,56 110,56 110,36 114,36 114,56 150,56 150,52 170,52 170,56 210,56 210,44 218,44 218,56 250,56 250,50 270,50 270,56 296,56 296,40 302,40 302,56 320,56 320,66 8 e0
dots chimneysmoke 42,34 44,28 112,30 116,24 212,38 216,32 298,34 c7
rect floor 0,66,320,70 fade:6,0/0,66/0,136
line board1 90,66 -120,136 c0
line board2 90,66 -10,136 c0
line board3 90,66 110,136 c0
line board4 90,66 230,136 c0
line board5 90,66 350,136 c0
line board6 90,66 470,136 c0
poly railback 0,64 320,64 320,68 0,68 6 e0
line railtop 0,52 320,52 c14
rect railpost1 18,52,4,14 6 e0
rect railpost2 70,52,4,14 6 e0
rect railpost3 190,52,4,14 6 e0
rect railpost4 290,52,4,14 6 e0
ellipse floater1 214,30,18,6 9 e0
ellipse floater1dome 214,26,8,5 15 e0
ellipse lamp1 197,30,2,2 14
ellipse floater2 270,18,12,4 9 e0
ellipse lamp2 259,18,2,2 14
rect booth 244,34,58,64 6 e0
rect boothroof 240,28,66,8 0 e6
rect boothwindow 254,48,38,22 8 e0
rect shutter 254,48,38,10 6 e0
rect boothbell 262,72,8,5 14 e0
rect boothdoor 252,76,14,22 0
poly shadow 90,108 142,108 160,114 100,114 mix:,0@0.6
rect ivl 94,92,5,16 0
rect ivr 101,92,5,16 0
poly icoat 90,64 110,64 112,96 90,96 8 e0
rect ibuttons 99,68,2,22 14
ellipse ihead 100,58,5,6 7 e0
rect ihat 94,48,12,4 0
rect ihatbrim 92,52,16,2 0
poly iarm 106,66 110,66 118,44 114,43 8 e0
ellipse ihand 116,42,3,3 6 e0
rect pbody 134,78,12,24 6 e0
rect plegs 135,102,10,8 0
ellipse phead 140,72,5,5 6 e0
rect pcap 135,66,10,3 0
dots peyes 138,72 142,72 c14
rect trolley 150,92,24,6 8 e0
line trolleyhandle 150,92 150,78 c7
ellipse wheel1 156,101,3,3 0 e7
ellipse wheel2 170,101,3,3 0 e7
rect lamp 296,34,3,3 14
rect lampstem 297,37,1,28 0`,
      cycles: [{ name: "lamp", areas: ["lamp", "lamp1", "lamp2"], colors: [14, 6], style: "flicker", ms: [200, 600] }],
      overlays: [{ object: "tag", at: [110, 46] }] }
  },

  rank: {
    picture: { version: 1, draw: `rect sky 0,0,320,72 fade:5,13/0,0/0,72
dots stars 12,6 40,14 77,5 130,10 182,4 240,8 290,12 310,3 c11
ellipse sunglow 250,72,90,22 mix:,12@0.5
ellipse sun 262,70,14,6 14
ellipse smoke1 60,66,70,6 mix:5,13@0.5
poly farcity 0,72 0,64 18,64 18,58 30,58 30,64 56,64 56,54 62,54 62,64 120,64 120,60 140,60 140,64 220,64 220,56 232,56 232,64 290,64 290,58 310,58 310,64 320,64 320,72 5 e0
rect below 0,72,320,64 fade:13,8/0,72/0,136
ellipse puff 120,90,100,6 mix:,15@0.3
poly deck 0,104 320,104 320,136 0,136 8 e0
line deckrim 0,104 320,104 c7
line girder1 0,104 40,136 c0
line girder2 40,104 80,136 c0
line girder3 80,104 120,136 c0
line girder4 120,104 160,136 c0
line girder5 160,104 200,136 c0
line girder6 200,104 240,136 c0
line girder7 240,104 280,136 c0
line girder8 280,104 320,136 c0
rect bolard1 66,100,4,6 0 e7
rect bolard2 156,100,4,6 0 e7
rect bolard3 296,100,4,6 0 e7
ellipse hulla 40,92,28,9 6 e0
ellipse hulladome 40,84,13,8 9 e0
ellipse hullalamp 14,94,2,2 14
ellipse hullb 118,90,22,8 6 e0
ellipse hullbdome 118,83,10,7 9 e0
ellipse hullblamp 98,92,2,2 12
ellipse floater 208,86,40,14 6 e0
ellipse floaterdome 208,72,20,14 11 e0
ellipse floaterseat 208,80,12,5 4 e0
poly floaterfin 244,84 258,70 262,88 6 e0
ellipse floatertail 252,88,10,5 6 e0
poly dooropen 188,78 196,74 198,92 188,96 0 e7
ellipse lamp 168,88,3,3 14 e6
ellipse lampglow 168,88,9,8 mix:,14@0.4
rect works 224,92,22,9 0 e6
rect worksglow 227,94,16,5 14
dots workswheels 230,97 236,97 242,97 c6
line rope1 70,102 100,92 c6
line rope2 160,102 188,94 c6
line rope3 298,102 262,92 c6
dots boltholes 304,106 308,106 312,106 316,106 c14
line gone 296,104 320,104 c0`,
      cycles: [
        { name: "lamp", areas: ["lamp", "lampglow"], colors: [14, 6], style: "flicker", ms: [250, 700] },
        { name: "sunglow", areas: ["sunglow"], colors: [12, 13], style: "pingpong", ms: 3200 }
      ] }
  },

  market: {
    picture: { version: 1, draw: `rect ground 0,0,320,136 8
rect lane 0,48,320,38 mix:8,7@0.35
line lanemid 0,67 320,67 c8
rect awn1 6,4,44,36 stripes:4,15 e0
rect awn2 58,6,40,34 stripes:4,15 e0
rect awn3 106,4,44,36 stripes:6,15 e0
rect awn4 158,8,38,32 stripes:4,15 e0
rect awn5 12,94,40,34 stripes:4,15 e0
rect awn6 62,96,44,34 stripes:12,15 e0
rect awn7 114,94,40,36 stripes:4,15 e0
rect awn8 164,98,34,32 stripes:4,15 e0
rect crate1 98,52,10,10 6 e0
rect crate2 112,54,8,8 6 e0
ellipse pylonring 262,68,40,36 mix:8,0@0.7
ellipse pylon 262,68,28,24 0 e8
ellipse pylonin 262,68,14,12 8 e7
dots lamps 262,40 280,44 292,56 296,68 292,80 280,92 262,96 244,92 232,80 228,68 232,56 244,44 c14
rect barrow 160,60,26,12 6 e0
ellipse barrowwheel 164,76,5,5 0 e7
line barrowhandle 186,64 200,58 c6
ellipse head 170,56,8,8 6 e0
dots headeyes 167,55 173,55 c14
rect priceplate 166,64,8,4 15
dots people 40,60 52,72 74,56 88,76 128,72 140,56 218,74 222,60 c7`,
      cycles: [{ name: "lamps", areas: ["lamps"], colors: [14, 6], style: "flicker", ms: [300, 900] }] }
  },

  salter: {
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:0,6/0,0/0,136
poly cone 120,22 196,22 250,120 70,120 mix:,14@0.3
poly shade 110,18 206,18 190,4 126,4 2 e0
ellipse bulb 158,22,16,3 14
rect springs1 8,4,2,50 7
rect springs2 20,4,2,36 7
rect springs3 32,4,2,60 7
rect springs4 296,4,2,44 7
rect springs5 306,4,2,62 7
dots coils1 9,10 9,16 9,22 9,28 9,34 9,40 21,12 21,20 21,28 33,10 33,18 33,26 33,34 33,42 33,50 c14
dots coils2 297,10 297,18 297,26 297,34 307,12 307,20 307,28 307,36 307,44 307,52 c14
rect bench 0,102,320,34 6 e0
line benchedge 0,102 320,102 c14
rect vice 30,84,56,22 8 e0
rect vicejaw 80,70,12,36 7 e0
rect vicebolt 18,92,14,6 7 e0
poly palm 36,50 78,46 82,82 40,86 6 e0
poly finger1 40,50 36,36 44,30 48,46 6 e0
poly finger2 52,48 50,30 58,28 60,46 6 e0
poly finger3 64,47 64,30 72,30 72,46 6 e0
poly finger4 76,48 80,34 87,36 84,50 6 e0
poly thumb 36,70 26,64 22,72 38,80 6 e0
line knuckle1 44,50 44,58 c0
line knuckle2 56,48 56,58 c0
line knuckle3 68,48 68,58 c0
ellipse wrist 54,92,8,6 8 e0
poly body 220,136 224,84 280,78 316,92 320,136 8 e0
ellipse head 270,64,14,16 7 e0
poly hair 254,60 262,46 282,44 290,58 284,52 270,52 7 e8
ellipse lens 258,62,5,5 11 e0
rect file 214,92,34,4 7 e0
line filearm 250,100 214,94 c7
rect clock 200,110,22,18 15 e0
dots clockticks 204,114 210,114 216,114 212,122 c0`,
      cycles: [{ name: "lamp", areas: ["cone", "bulb"], colors: [14, 6], style: "pingpong", ms: 3000 }] }
  },

  registry: {
    picture: { version: 1, draw: `rect ceiling 0,0,320,26 fade:0,2/0,0/0,26
rect wall 0,26,320,38 mix:2,10@0.3
rect holes1 0,30,320,16 mix:0,2@0.35
rect holes2 0,46,320,16 mix:0,2@0.35
line row0 0,30 320,30 c0
line row1 0,46 320,46 c0
line row2 0,62 320,62 c0
line col0 20,30 20,62 c0
line col1 52,30 52,62 c0
line col2 84,30 84,62 c0
line col3 116,30 116,62 c0
line col4 148,30 148,62 c0
line col5 180,30 180,62 c0
line col6 212,30 212,62 c0
line col7 244,30 244,62 c0
line col8 276,30 276,62 c0
dots flaps 10,38 36,38 68,54 100,38 132,54 164,38 196,54 228,38 260,54 292,38 c14
rect floor 0,62,320,74 fade:2,0/0,62/0,136
line plank1 230,62 -60,136 c0
line plank2 230,62 80,136 c0
line plank3 230,62 230,136 c0
line plank4 230,62 380,136 c0
line plank5 230,62 520,136 c0
rect cabinet1 4,60,28,12 6 e0
rect cabinet2 288,58,28,14 6 e0
poly clerkbody 252,78 292,78 296,100 248,100 0 e8
ellipse clerkhead 272,68,9,10 8 e0
dots clerkeyes 268,67 276,67 c14
rect clerkarm 244,82,8,16 8 e0
rect stamp 244,70,8,12 6 e0
rect counter 0,98,320,38 6 e0
rect counterrim 0,98,320,4 14
rect counterfront 0,112,320,24 mix:6,0@0.5
rect ledger 120,100,60,16 15 e0
line ledgercentre 150,100 150,116 c8
line ledgerline1 124,104 146,104 c8
line ledgerline2 124,108 146,108 c8
line ledgerline3 154,104 176,104 c8
line ledgerline4 154,108 176,108 c8
rect inkpot 192,102,8,8 0 e7
rect lampbase 60,96,12,4 0 e6
poly lampshade 54,84 78,84 72,96 60,96 14 e0
ellipse lampglow 66,100,24,8 mix:,14@0.4`,
      cycles: [{ name: "lamp", areas: ["lampshade", "lampglow"], colors: [14, 6], style: "flicker", ms: [300, 900] }] }
  },

  tower: {
    picture: { version: 1, draw: `rect walls 0,0,320,136 fade:0,1/0,0/0,136
line rib1 110,30 0,0 c8
line rib2 110,30 60,136 c8
line rib3 110,30 200,0 c8
line rib4 110,30 320,20 c8
line rib5 110,30 320,100 c8
line rib6 110,30 230,136 c8
ellipse hole 110,30,42,18 1 e8
ellipse holeglow 110,30,30,12 mix:1,14@0.6
ellipse holelight 110,30,16,6 14
rect floor 0,115,320,21 fade:1,0/0,115/0,136
ellipse floorring 160,125,130,8 mix:,8@0.5
poly stairrail 70,118 120,112 124,40 78,34 mix:1,0@0.7
poly step1 72,114 124,108 124,112 72,118 8 e0
poly step2 76,98 122,94 122,98 76,102 8 e0
poly step3 80,82 120,78 120,82 80,86 8 e0
poly step4 84,66 118,64 118,68 84,70 8 e0
poly step5 88,50 116,48 116,52 88,54 8 e0
poly step6 92,38 114,36 114,40 92,42 8 e0
line post 124,108 124,40 c7
line post2 72,114 78,36 c7
rect warden_body 232,56,26,52 6 e0
ellipse warden_head 245,48,9,10 6 e0
poly warden_arm 232,70 204,78 204,84 232,80 6 e0
rect warden_legs 236,108,18,8 0 e7
rect warden_base 228,114,34,4 8 e0
dots warden_eyes 242,47 248,47 c0
line crack 245,56 245,106 c0`,
      cycles: [{ name: "glow", areas: ["holelight", "holeglow"], colors: [14, 6], style: "pingpong", ms: 2800 }] }
  },

  gears: {
    picture: { version: 1, draw: `rect void 0,0,320,136 0
rect catwalk 0,0,320,16 8 e0
line cwrail 0,15 320,15 c7
rect cwpost1 20,0,4,16 7 e0
rect cwpost2 140,0,4,16 7 e0
rect cwpost3 260,0,4,16 7 e0
ellipse gearA 80,84,46,46 6 e0
ellipse gearAin 80,84,34,34 mix:6,0@0.45
ellipse gearAhub 80,84,9,9 7 e0
dots gearAteeth 127,84 124,100 116,114 104,125 88,130 72,130 57,125 44,114 36,100 33,84 36,68 44,54 56,43 72,38 88,38 103,43 116,54 124,68 c14
line spokeA1 80,84 80,52 c0
line spokeA2 80,84 108,100 c0
line spokeA3 80,84 52,100 c0
ellipse gearB 190,102,36,36 6 e0
ellipse gearBin 190,102,26,26 mix:6,0@0.45
ellipse gearBhub 190,102,7,7 7 e0
dots gearBteeth 226,109 219,124 207,135 191,139 175,136 162,126 154,111 154,95 161,80 173,69 189,65 205,68 218,78 226,93 c14
line spokeB1 190,102 190,76 c0
line spokeB2 190,102 212,115 c0
line spokeB3 190,102 168,115 c0
ellipse gearC 290,92,28,28 mix:6,8@0.5 e0
ellipse gearChub 290,92,6,6 7 e0
dots gearCteeth 318,95 312,109 299,119 283,119 270,111 262,97 264,81 274,69 289,64 304,68 315,79 c6
rect pipe 214,18,106,12 7 e0
line pipeband1 236,18 236,30 c8
line pipeband2 272,18 272,30 c8
line split 250,30 256,30 c0
ellipse steam1 256,40,10,10 mix:,15@0.7
ellipse steam2 262,56,14,12 mix:,15@0.5
ellipse steam3 270,76,18,14 mix:,15@0.3
ellipse steam4 276,98,24,16 mix:,15@0.18`,
      cycles: [{ name: "steam", areas: ["steam1", "steam2", "steam3"], colors: [15, 7], style: "pingpong", ms: 1400 }] }
  },

  face: {
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:6,14/0,0/0,136
ellipse dial 190,68,110,64 fade:14,15/190,30/190,100
ellipse dialrim 190,68,110,64 none e6
ellipse dialglow 190,68,60,30 mix:,15@0.5
dots hours 190,10 224,16 252,36 266,68 252,100 224,120 190,126 156,120 128,100 114,68 128,36 156,16 c0
line handlong 190,68 176,16 c0
line handlong2 191,68 177,16 c0
line handshort 190,68 218,34 c0
ellipse hub 190,68,5,5 0
rect drumbase 0,100,100,36 0 e8
rect drum1 8,74,80,28 0 e8
rect drum2 14,50,68,26 0 e8
rect gap 28,38,40,12 fade:14,15/48,38/48,50
rect drum3 20,24,56,16 0 e8
rect drumtop 30,8,36,18 0 e8
line tick1 12,86 84,86 c8
line tick2 18,62 78,62 c8
poly bell 100,0 150,0 166,50 156,56 94,56 84,50 0 e8
rect clapper 124,56,4,16 0
rect shelf 230,100,70,6 0 e8
poly shelfleg 240,106 250,106 250,122 244,122 0
poly shelfleg2 280,106 290,106 288,122 282,122 0
rect floorbar 0,124,320,12 0`,
      cycles: [{ name: "dial", areas: ["dialglow"], colors: [15, 14], style: "pingpong", ms: 3200 }],
      overlays: [{ object: "cog", at: [246, 86] }] }
  }
};

export default rooms;

// Each ending's picture, with its description for screen readers; the world file adds them.
export const endings = {
  restored: {
    alt: "A huge clock dial in the dark, both hands together on the thirteenth mark, a small brass cog glowing at its heart.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:1,0/0,0/0,136
ellipse dial 160,68,64,64 fade:15,11/160,10/160,128
ellipse dialrim 160,68,64,64 none e3
ellipse dialin 160,68,54,54 mix:15,11@0.3 e11
dots ticks 160,16 184,22 203,38 212,62 209,86 194,107 172,118 148,118 126,107 111,86 108,62 117,38 136,22 c1
line hand1 160,68 136,22 c1
line hand2 161,68 137,22 c1
line hand3 162,68 138,24 c1
ellipse cog 160,68,9,9 14 e6
ellipse coghole 160,68,3,3 1
dots cogteeth 160,57 171,68 160,79 149,68 168,60 168,76 152,76 152,60 c6
ellipse glow 160,68,80,56 mix:,11@0.15`,
      cycles: [{ name: "glow", areas: ["glow"], colors: [11, 3], style: "pingpong", ms: 2600 }] }
  },
  kept: {
    alt: "The pylon platform from above: rows of brass robots sitting on the boards in pools of lamplight, a small porter on his trolley in front.",
    picture: { version: 1, draw: `rect boards 0,0,320,136 mix:8,0@0.4
line b1 0,24 320,24 c0
line b2 0,48 320,48 c0
line b3 0,72 320,72 c0
line b4 0,96 320,96 c0
line b5 0,120 320,120 c0
ellipse pool1 70,40,56,22 mix:,13@0.35
ellipse pool2 190,40,56,22 mix:,13@0.35
ellipse pool3 130,100,64,24 mix:,13@0.35
ellipse pool4 270,92,40,18 mix:,13@0.3
ellipse r1b 40,40,8,6 6 e0
ellipse r1h 40,34,4,4 6 e0
ellipse r2b 70,40,8,6 6 e0
ellipse r2h 70,34,4,4 6 e0
ellipse r3b 100,40,8,6 6 e0
ellipse r3h 100,34,4,4 6 e0
ellipse r4b 160,40,8,6 6 e0
ellipse r4h 160,34,4,4 6 e0
ellipse r5b 190,40,8,6 6 e0
ellipse r5h 190,34,4,4 6 e0
ellipse r6b 220,40,8,6 6 e0
ellipse r6h 220,34,4,4 6 e0
ellipse r7b 90,100,8,6 6 e0
ellipse r7h 90,94,4,4 6 e0
ellipse r8b 120,100,8,6 6 e0
ellipse r8h 120,94,4,4 6 e0
ellipse r9b 150,100,8,6 6 e0
ellipse r9h 150,94,4,4 6 e0
ellipse r10b 260,92,8,6 6 e0
ellipse r10h 260,86,4,4 6 e0
ellipse r11b 290,92,8,6 6 e0
ellipse r11h 290,86,4,4 6 e0
rect trolley 150,56,36,14 8 e0
ellipse porterb 168,62,12,10 6 e0
ellipse porterh 168,54,7,7 6 e0
dots porterlamp 164,52 172,52 c14
ellipse inspector 296,20,6,5 8 e0
ellipse inspectorh 296,14,4,4 7 e0
line inspectorarm 300,20 306,22 c8
rect rail 0,0,320,4 14`,
      cycles: [{ name: "lamps", areas: ["pool1", "pool2", "pool3"], colors: [13, 5], style: "pingpong", ms: 3400 }] }
  },
  flown: {
    alt: "A small brass floater high in the stars above a bank of smoke, with a single coin of city light glowing far beneath it.",
    picture: { version: 1, draw: `rect sky 0,0,320,42 fade:0,9/0,0/0,42
dots stars1 14,6 38,18 62,4 96,12 128,6 150,22 180,8 210,16 262,6 290,20 308,8 c15
dots stars2 26,28 74,24 110,30 164,32 198,26 246,34 276,30 304,34 c11
rect smoke 0,42,320,94 fade:9,1/0,42/0,136
ellipse smokebank 160,48,190,6 mix:,15@0.5
ellipse city 90,106,44,12 mix:,14@0.5
ellipse citycore 90,106,16,5 14
ellipse smoke2 220,88,90,8 mix:,8@0.5
ellipse floater 238,26,18,6 6 e0
ellipse floaterdome 238,22,8,5 11 e0
ellipse floaterlamp 220,26,2,2 14
line trail 256,28 316,40 c9
line trail2 258,30 320,48 c11`,
      cycles: [{ name: "city", areas: ["citycore"], colors: [14, 12], style: "pingpong", ms: 2400 }] }
  },
  died: {
    alt: "A white sheet of steam across a dark iron wall, and a dropped brass cap on the floor.",
    picture: { version: 1, draw: `rect wall 0,0,320,136 fade:0,8/0,0/0,136
line rivet1 0,20 320,20 c8
line rivet2 0,60 320,60 c8
line rivet3 0,100 320,100 c8
ellipse steam 160,60,150,26 mix:,15@0.5
ellipse steam2 160,60,100,14 mix:,15@0.5
ellipse steam3 210,40,60,10 mix:,7@0.5
rect floor 0,112,320,24 0
ellipse cap 120,120,18,4 6 e0
rect capcrown 110,110,20,10 6 e0
line capline 110,118 130,118 c0` }
  }
};
