// Pictures for "Please Remain Present" (worlds/meridian/world.en.js), one per room and one per ending, the way the AI
// writes them (BRIEF.md §7, ART-DIRECTION.md §4–6): 320 × 136, EGA colours 0–15, shapes back to front in the short
// notation, ids on what the story may change or a cycle animates.
//
// The shot list, written before drawing (viewpoint; horizon; main subject and its size; lead colour):
//   yard        looking up at the service door; horizon 110; the steel door tall, right third, 80% of the height; magenta 5
//   corridor    eye level, looking in; horizon 66; vanishing point at x 150; the shaft on the left wall, a third of the frame; cyan 3
//   records     looking down on the desk; horizon 24; the desk in the lower third, one lamp on it; brown 6
//   canteen     looking up; horizon 110; the urn tall and narrow, 85% of the height, left of centre; light red 12
//   staff       close-up, no horizon; the printer filling 70% of the frame on a plain fade; yellow 14
//   stairwell   through something (the gate's bars, a dark frame); its own horizon 70; the stairs rising behind the bars; light blue 9
//   lobby       wide landscape; horizon 42; the sealed glass front right of centre, the fog city beyond; magenta 13
//   cellar      far away; horizon 96; the generator small, left third, a fifth of the width; green 2
//   registry    close-up; no horizon; the terminal screen filling the frame on a dark fade; light green 10
//   present     silhouette; figure left third, black against a bright green fade; green 10
//   erased      from above; repeated grey strips, one small slip of white; magenta 13 (the lobby's lead, not its neighbours')
//   shaft       from far above; repeated rungs of cable, one small light at the bottom; blue 1
//   died        close-up of a floor, faintly ruled, a grey smear of light; dark 8
//
// Neighbours differ: yard (up, 110) is next to corridor (eye, 66); corridor is between the up and down rooms; records (down,
// 24) and cellar (far, 96) differ; stairwell (through) sits between eye-level corridor and the rest; registry is close up.

const rooms = {
  yard: {
    alt: "A fenced yard looking up at a single steel service door in the back wall, a tarpaulin and bins at the sides.",
    picture: { version: 1, draw: `rect sky 0,0,320,30 fade:8,7/0,0/0,30
rect fence 0,30,320,80 fade:5,8/0,30/0,110
rect ground 0,110,320,26 6 e0
poly tarp 28,96 112,96 116,110 26,110 15 e0
rect bin 268,84,20,26 8 e0
rect door_frame 186,12,68,100 8 e0
rect door 194,16,52,96 7 e8
line seam 220,16 220,112 c8
rect intercom_box 184,50,8,12 12 e0
line cord 188,62 184,80 c8` }
  },
  corridor: {
    alt: "A grey corridor, a lamp overhead, a notice board on the right wall and an open lift shaft on the left.",
    picture: { version: 1, draw: `rect ceiling 0,0,320,30 fade:8,7/0,0/0,30
poly lwall 0,30 150,46 150,92 0,136 3
poly rwall 320,30 250,46 250,92 320,136 11
rect back 150,46,100,46 7
poly floor 0,136 150,92 250,92 320,136 6
rect lamp 160,30,24,4 15
poly shaft 22,62 64,70 64,112 22,124 0 e8
rect shaft_sign 34,80,20,8 12 e0
rect board 268,48,22,30 6 e0
ellipse clock 200,58,6,6 15 e0`,
      cycles: [{ name: "lamp", areas: ["lamp"], colors: [15, 7], style: "flicker", ms: [900, 3000] }] }
  },
  records: {
    alt: "A desk and ledgers seen from above, one lamp lit on the desk and a drawer open in its front.",
    picture: { version: 1, draw: `rect shelves 0,0,320,24 8
rect ledgers 8,4,304,16 stripes:4,6
poly floor 0,24 320,24 320,136 0,136 mix:8,6@0.3
poly desk 70,64 250,64 300,110 20,110 6 e0
rect drawer 124,96,72,9 0 e0
poly ledger 150,74 204,70 210,86 156,90 15 e0
ellipse lamp 262,56,12,7 14 e0
ellipse glow 262,56,24,14 mix:,14@0.3` }
  },
  canteen: {
    alt: "A steaming urn looking up from the canteen floor, with a biscuit on the counter and a vending machine by the door.",
    picture: { version: 1, draw: `rect ceiling 0,0,320,40 8
rect wall 0,40,320,70 fade:12,8/0,40/0,110
rect floor 0,110,320,26 6 e0
rect urn 146,20,34,92 7 e0
rect urn_top 150,12,26,10 7 e0
dots steam 158,6 164,2 156,0 c15
rect counter 0,96,320,14 6 e0
rect biscuit 92,88,12,8 14 e0
rect vend 252,22,44,88 9 e0
rect vend_glass 258,30,32,36 11 e0
ellipse lamp 60,8,20,4 15` }
  },
  staff: {
    alt: "A grey printer close up, its light on, a red button and an empty output tray.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:6,8/0,0/0,136
rect printer 56,18,208,104 7 e0
rect printer_top 66,10,188,12 8 e0
rect tray 120,40,80,8 15 e0
rect light 232,28,12,6 14 e0
ellipse glow 238,31,22,14 mix:,14@0.4
rect button 92,72,24,10 4 e0
rect panel 80,94,160,18 8 e0` }
  },
  stairwell: {
    alt: "The stairs seen through the bars of a gate, a black cable sparking from the ceiling above them.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:9,1/0,0/0,136
poly stairs 80,136 160,70 240,70 300,136 8 e0
rect gate_rail 90,26,140,3 8 e0
line gate_b1 110,28 110,100 c8
line gate_b2 135,28 135,100 c8
line gate_b3 160,28 160,100 c8
line gate_b4 185,28 185,100 c8
line gate_b5 210,28 210,100 c8
rect plate 150,72,20,8 7 e0
line cable_line 178,14 176,40 c0
dots sparks 176,40 180,42 c14
ellipse light 200,20,6,4 14 e0
rect frame_l 0,0,46,136 0
rect frame_r 274,0,46,136 0
rect frame_t 46,0,228,14 0`,
      cycles: [{ name: "light", areas: ["light", "sparks"], colors: [14, 8], style: "flicker", ms: [700, 2200] }] }
  },
  lobby: {
    alt: "The lobby's glass front, sealed with a strip across it, the fog-lit city beyond and a flicker of lamps.",
    picture: { version: 1, draw: `rect sky 0,0,320,42 fade:8,7/0,0/0,42
rect city_a 16,20,30,22 8
rect city_b 56,14,26,28 8
rect city_c 200,18,44,24 8
rect city_d 254,26,40,16 8
rect ground 0,42,320,94 fade:13,6/0,42/0,136
rect front_glass 150,30,72,90 none e8
rect seal 150,30,72,6 8 e0
ellipse lamp1 40,38,6,4 14 e0
ellipse lamp2 220,36,6,4 14 e0
dots fog 30,70 90,80 250,64 300,92 c15`,
      cycles: [{ name: "lamps", areas: ["lamp1", "lamp2"], colors: [14, 8], style: "flicker", ms: [800, 2400] }] }
  },
  cellar: {
    alt: "The old generator far off in a damp cellar, a single bulb lit at the far end.",
    picture: { version: 1, draw: `rect wall 0,0,320,96 fade:0,2/0,0/0,96
rect floor 0,96,320,40 8 e0
rect pipes 0,20,320,3 6
rect generator 62,62,56,34 7 e0
rect gen_panel 76,72,20,10 14 e0
rect bulb 240,44,6,4 14 e0
ellipse glow 240,44,12,8 mix:,14@0.3` }
  },
  registry: {
    alt: "A terminal screen close up, its text lines in green and a cursor waiting in a gap, a slot and a shredder below.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:10,2/0,0/0,136
rect screen 52,16,216,98 0 e10
rect screen_in 64,28,192,74 2
rect bar1 84,46,150,4 10
rect bar2 84,58,110,4 10
rect bar3 84,70,130,4 10
rect cursor 230,70,6,4 15
rect slot 240,108,40,8 8 e0
rect shredder 16,100,50,30 8 e0`,
      cycles: [{ name: "screen", areas: ["screen_in"], colors: [2, 10], style: "pingpong", ms: 3000 }] }
  }
};

export default rooms;

// The ending pictures (ids as the world's `end`s name them), and the one for a death from harm.
export const endings = {
  present: {
    alt: "A black figure stands against a bright green light, a small shape on the left.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:15,10/0,0/320,136
ellipse halo 110,70,70,70 mix:,15@0.5
ellipse head 96,28,10,12 0
poly body 84,42 108,42 116,96 76,96 0
rect legs 80,96,11,34 0
rect legs2 96,96,11,34 0` }
  },
  erased: {
    alt: "A shredder seen from above: strips of grey, and one small slip of white among them.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 13
rect strip1 24,0,18,136 5 e0
rect strip2 60,0,18,136 5 e0
rect strip3 96,0,18,136 5 e0
rect strip4 132,0,18,136 5 e0
rect strip5 168,0,18,136 5 e0
rect strip6 204,0,18,136 5 e0
rect strip7 240,0,18,136 5 e0
rect strip8 276,0,18,136 5 e0
rect slip 150,58,22,14 15 e0` }
  },
  shaft: {
    alt: "A shaft seen from far above: rungs of cable going down, and one small light at the bottom.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 1
rect rungs 0,0,320,136 stripes:1,9
line cable 160,0 160,130 c0
ellipse small 160,118,4,3 14` }
  },
  died: {
    alt: "A dark floor, faintly ruled, with a grey smear of light across it.",
    picture: { version: 1, draw: `rect bg 0,0,320,136 fade:8,0/0,0/0,136
line tile1 0,60 320,60 c8
line tile2 0,96 320,96 c8
line tile3 80,60 60,136 c8
line tile4 240,60 260,136 c8
ellipse light 160,64,40,7 7` }
  }
};
