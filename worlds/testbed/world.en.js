// "Testbed": a world that holds every mechanism the engine has, in a few rooms, in English. A tool, not a story: written by hand from
// the engine docs (BRIEF.md, ARCHITECTURE.md, MUSIC.md), short and plain, one example of each thing the engine accepts. New engine
// features go in here, and their checks run here (BUILDING.md §2); tests/coverage.test.js fails, naming what is missing, when this
// world doesn't use something the engine accepts. One change set, all or nothing; plain data, no shortcuts.
//
// The map: the opening (an intake room), then a hub with a short way to each mechanism's room. Every room id starts with `tb-`.
//   hub: clinic (north: health, hurts and heals, death) > lab (east: USE, own verbs, travel, filters, the ending `lit`)
//        bar (east, an `in` way: conditions, things that come from someone, doses) > office (east: people, topics, questions, the ending `named`)
//        bedroom (south: sleep, dreams, visions, time) · yard (west: things that move) > lane (west: a follower's rooms, the clerk)
//        ways (up: every kind of exit, connect and disconnect) > annex, landing, chute, closet, pit, roof (the ending `fell`)
//        cellar (down: doors, locks, pairs, containers) > vault (east), pantry (west)

import pictures, { endings, visions } from "./pictures.js?v=0.50.4";
import music, { rooms as roomMusic } from "./music.js?v=0.50.4";
import levels from "./levels.js?v=0.50.4";
import sprites from "./sprites.js?v=0.50.4";

// ---- The game bible ---------------------------------------------------------------------------------------------------------
export const bible = {
  title: "Testbed",
  blurb: "Every mechanism the game has, in a few rooms: for trying things and for the checks. Nothing here is a story; everything here works.",
  thumbnail: { picture: "tb-hub", x: 48 },
  synopsis: "You are a tester, and this is the test floor: a hub with a short way to each thing the game can do. Health and " +
    "hurts, drinks and conditions, sleep and dreams, a cat that follows and a watchman on his round, doors, locks and " +
    "containers, people and questions, a lever, a roof. Nothing here is a story. Everything here works.",
  tone: "Plain and short. Each room says what it is for and shows the one thing. No jokes that get in the way of the test.",
  start: "Monday, noon, at the hub (the opening, in the intake room, at noon too).",
  opening: "An intake room with a turnstile: a handset (hints), a test slip you carry, and the turnstile to the hub.",
  music: "slow dorian; a signal wire and a bench bell; a test tone that never settles",
  rules: [
    "Each room is for one mechanism, and shows it once.",
    "Whatever the engine accepts is somewhere on this floor.",
    "Nothing here is a story, and nothing here is hidden.",
    "Every ending can be reached from the puzzles alone."
  ],
  characters: ["Dot, who keeps the bar", "Mrs Oduya, who keeps the book", "a cat, a watchman, a bird and a night clerk"],
  endings: ["lit: put the fuse in the lab's socket and pull the lever", "named: say whose name goes in the book",
    "fell: jump from the roof", "died: out of health"],
  chaos: 0
};

// Carried things get their sprites (sprites.js): the one shown when examined, and the one drawn on the floor.
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });
const hours = (a, b) => ({ "time.hour": { between: [a, b] } });

// ---- The ending pictures and the vision ---------------------------------------------------------------------------------------
const endingPictures = {
  lit: { alt: "Close up, a lever thrown over in a steel slot, a green light lit above it and a thick line of white sparks running away along a cable.", picture: endings.lit },
  named: { alt: "Close up, an open ledger on a wooden desk, a column of names in black ink and one name written last, a pen resting beside it.", picture: endings.named },
  fell: { alt: "From far above, a flat roof and a small dark figure at its edge, with the street a long way below, grey in the dusk.", picture: endings.fell },
  died: { alt: "Close up, a plate of short steel spikes on a white floor, a single red drop on the nearest one.", picture: endings.died }
};
const visionPictures = {
  hammock_dream: { alt: "A dream of the test floor from above: every room a lit square in a grid, a thin yellow line joining them, and one square, the hub, glowing white.", picture: visions.hammock_dream }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------------
const rooms = {
  "tb-start": {
    name: "INTAKE", area: "start", at: [0, 0, 0],
    describe: [
      "A small white room with a light in the ceiling and nothing on the walls. This is where testers are let in.",
      "The only way on is the {turnstile|gate} in the north wall."
    ],
    exits: { n: true },
    scenery: [
      { words: ["wall", "walls", "floor", "ceiling"], name: "the walls", says: "White, clean, and the same on every side." },
      { words: ["light", "lamp"], name: "the light", says: "A flat white light with no source and no shadow." }
    ],
    ambience: { lines: ["The light hums at one note.", "Somewhere behind the wall a switch is thrown, and thrown back."], every: [25, 60] },
    alt: "A small white room seen from the doorway: a flat light in the ceiling, bare walls, and a turnstile of steel bars at the far end.",
    overlayAlt: { handset: "A grey handset hangs on a hook by the turnstile." }
  },
  "tb-hub": {
    name: "THE HUB", area: "hub", at: [0, 0, 0],
    describe: [
      "A round room with a door in every wall. A {board} lists what is behind each: the clinic north, the bar east, the bedroom south, the yard west.",
      "Iron stairs go up to the ways, and stone steps go down to the cellar."
    ],
    exits: { n: "tb-clinic", e: { to: "tb-bar", in: true }, s: "tb-bedroom", w: "tb-yard", u: "tb-ways", d: "tb-cellar" },
    scenery: [
      { words: ["stairs", "staircase"], name: "the stairs", says: "Iron stairs, going up to a landing and a door.", leads: "u" },
      { words: ["steps", "step"], name: "the steps", says: "Stone steps, worn in the middle, going down into the cold.", leads: "d" },
      { words: ["doors", "door", "walls", "wall"], name: "the doors", says: "Six doors of the same plain grey. A name is painted over each." }
    ],
    ambience: { lines: ["Every door in the hub clicks once, in turn.", "A draught goes round the hub, trying each door."], every: [30, 70], chance: 0.6 },
    sleep: "Not in the hub: the doors would keep opening.",
    listen: "Six doors, breathing slowly.",
    smell: "Floor polish, and a little ozone.",
    alt: "A round room seen from the middle: a row of bright doors set in a curved wall, each with a painted shape over it, an iron stair going up on the left and stone steps going down on the right.",
    overlayAlt: { badge: "A brass badge lies on the floor by the board.", cat: "A grey cat walks beside you." }
  },

  // The clinic: health, hurts and heals, death. East of it, the lab.
  "tb-clinic": {
    name: "CLINIC", area: "hub", at: [0, -1, 0],
    describe: [
      "A tiled room with a cot, a {cabinet} of steel and a {vent} in the wall. A square plate of short {spikes|spike} is set in the floor, with a sign that reads Not For Feet.",
      "The hub is south. The lab is east."
    ],
    exits: { n: false, s: "tb-hub", e: "tb-lab" },
    scenery: [
      { words: ["cot", "bed"], name: "the cot", says: "A narrow cot with a blanket folded square. Nobody has lain on it." },
      { words: ["sign", "plate"], name: "the sign", says: "Not For Feet, in red." },
      { words: ["tiles", "tile", "floor"], name: "the tiles", says: "White tiles, grouted in grey. They are cold." }
    ],
    ambience: { lines: ["The vent sighs.", "A drip falls on a tile, and is wiped up by nobody."], every: [30, 70] },
    alt: "A white tiled room: a steel cabinet on the right, a square vent high in the wall, a narrow cot at the back and a plate of short steel spikes set in the floor in front.",
    overlayAlt: { pill: "A small white pill lies on the cot." }
  },
  "tb-lab": {
    name: "LAB", area: "hub", at: [1, -1, 0],
    describe: [
      "A bench room of cables. A {lever} stands in a steel slot beside an open {socket}, a {dial} is set in the wall, and a {button} glows by the door. A {radio} hisses on a shelf.",
      "A hook hangs from the ceiling. The clinic is west."
    ],
    exits: { w: { to: "tb-clinic", out: true } },
    scenery: [
      { words: ["hook", "ceiling"], name: "the hook", id: "hook", says: "An iron hook in the ceiling, for something long.", },
      { words: ["cables", "cable", "bench", "shelf"], name: "the cables", says: "Black cables, taped to the bench and each other." }
    ],
    ambience: { lines: ["Something in the wall ticks, and settles.", "A cable warms, and cools."], every: [30, 70] },
    alt: "A low bench room full of black cables: a tall steel lever in a slot on the right, an open socket beside it, a round dial in the wall, a lit green button by the door and a small radio on a shelf.",
    overlayAlt: { wire: "A coil of wire lies on the bench." }
  },

  // The bar: conditions, and things that come from someone. East of it, the office.
  "tb-bar": {
    name: "THE BAR", area: "hub", at: [1, 0, 0],
    describe: [
      "A long low bar with one stool. {Dot|dot} keeps it. A {stove} glows in the corner, and an {ice|ice} trough sits by the door.",
      "The hub is west, and the office east."
    ],
    exits: { w: "tb-hub", e: "tb-office" },
    scenery: [
      { words: ["bar", "counter", "stool"], name: "the bar", says: "A long plank on two barrels. One stool, which nobody uses." },
      { words: ["door"], name: "the door", says: "The door to the hub.", leads: "w" }
    ],
    ambience: { lines: ["The stove ticks as it cools and warms.", "A glass is set down, and picked up, and set down."], every: [25, 60], chance: 0.8 },
    sleep: "Not at the bar, with Dot looking at you.",
    alt: "A long low bar in warm light: a wooden counter across the middle with a barmaid behind it, a red-hot stove in the corner and a trough of white ice by the door on the right.",
    overlayAlt: { coin: "A coin lies on the counter.", green: "A tall green glass stands on the counter." }
  },
  "tb-office": {
    name: "OFFICE", area: "hub", at: [2, 0, 0],
    describe: [
      "A small office with a high desk. {Mrs Oduya|oduya} sits behind it with a {ledger}, and does not look up.",
      "A day of the week sits in a frame on the wall. The bar is west."
    ],
    exits: { w: "tb-bar" },
    scenery: [
      { words: ["desk", "desks"], name: "the desk", says: "A high desk, far too tidy." },
      { words: ["frame", "wall"], name: "the frame", says: "A frame with one word in it, and a thin line of dust along the top." }
    ],
    mentions: ["monday"],
    sleep: "Not in the office. Mrs Oduya would write it down.",
    alt: "A small office: a tall wooden desk across the room, a woman in a grey cardigan behind it with a thick open book in front of her, and a small frame on the wall.",
    overlayAlt: {}
  },

  // The bedroom: sleep, dreams, visions, time.
  "tb-bedroom": {
    name: "BEDROOM", area: "hub", at: [0, 1, 0],
    describe: [
      "A dim room with a {bunk} against one wall and a {hammock} slung across the other. A {lamp} burns on a table, and a {clock} ticks over it.",
      "The hub is north."
    ],
    exits: { n: "tb-hub" },
    scenery: [{ words: ["table"], name: "the table", says: "A small table with room for a lamp and not much else." }],
    ambience: { lines: ["The clock ticks, and ticks, and has an idea.", "The hammock sways, as if someone had just got out."], every: [30, 70] },
    waitFor: { time: "next 07:00", says: "You lie on the bunk, awake, until it is morning.", if: [hours(22, 7)] },
    dream: { says: "You dream of an empty floor, with a light on, and one door open." },
    alt: "A dim room: a low bunk on the left, a hammock slung across the back, a small table in the middle with a yellow lamp on it and a round clock on the wall above.",
    overlayAlt: {}
  },

  // The yard and the lane: things that move.
  "tb-yard": {
    name: "THE YARD", area: "hub", at: [-1, 0, 0],
    describe: [
      "A bare yard of beaten earth, with a {bench} against the wall and a small gate to the lane. The sky is low and the light is flat.",
      "The hub is east. The lane is west, and a gap in the wall leads north round to it."
    ],
    exits: { e: "tb-hub", w: "tb-lane", n: { to: "tb-lane", passage: true } },
    scenery: [
      { words: ["gate"], name: "the gate", says: "A small iron gate, standing open.", leads: "w" },
      { words: ["wall", "earth", "sky"], name: "the wall", says: "A brick wall, with nothing on it." },
      { words: ["gap"], name: "the gap", says: "A gap in the wall, just wide enough, going round to the lane.", leads: "n" }
    ],
    ambience: { lines: ["A gust crosses the yard, and goes.", "Dust turns over by the bench."], every: [30, 70] },
    alt: "A bare yard of beaten brown earth under a low grey sky, with a wooden bench against a brick wall on the left and an open iron gate at the far right.",
    overlayAlt: { cat: "A grey cat sits on the earth.", watchman: "A watchman in a long coat stands by the wall.", bird: "A small bird hops along the wall." }
  },
  "tb-lane": {
    name: "THE LANE", area: "hub", at: [-2, 0, 0],
    describe: [
      "A narrow lane between blank walls, with a lit window at the end. It is quiet.",
      "The yard is east."
    ],
    exits: { e: "tb-yard" },
    scenery: [{ words: ["walls", "wall", "lane"], name: "the walls", says: "Blank brick on both sides, scraped clean." }],
    ambience: { lines: ["The window light flickers, and holds.", "Something small scrapes along the wall."], every: [30, 60], if: [hours(20, 6)] },
    waitFor: { time: "next 20:00", says: "You wait in the lane, and the light behind the window goes up a little.", if: [hours(6, 20)] },
    sleep: "Not in the lane, with a window watching.",
    alt: "A narrow lane between two blank brick walls, going away to a lit yellow window at the far end, with a cobbled floor.",
    overlayAlt: { cat: "A grey cat sits on the cobbles.", watchman: "A watchman in a long coat walks the lane.", bird: "A small bird sits on a wall.", clerk: "A night clerk in a green visor stands under the window." }
  },

  // The ways: every kind of exit.
  "tb-ways": {
    name: "THE WAYS", area: "hub", at: [0, 0, 1],
    describe: [
      "A landing with an exit of a different kind on each side. A big iron {wheel} is set in the wall, and a {ladder} goes up.",
      "North is the annex, behind a guard. East is the landing, and west the chute. A cupboard is in the corner. The hub is down."
    ],
    exits: {
      n: { to: "tb-annex", requires: "pass", spends: true, lacking: "The guard looks at your empty hands and does not move." },
      e: { to: "tb-landing", if: hours(8, 20), closed: "The shutter is down. A sign says eight." },
      w: "tb-chute",
      in: "tb-closet",
      u: "tb-roof",
      d: "tb-hub"
    },
    scenery: [
      { words: ["guard"], name: "the guard", says: "A guard in grey stands in the north doorway, with a hand out." },
      { words: ["shutter", "sign"], name: "the shutter", says: "A steel shutter, with a sign: Open From Eight To Eight." },
      { words: ["cupboard", "corner"], name: "the cupboard", says: "A low cupboard, big enough to stand in.", leads: "in" },
      { words: ["chute", "hole"], name: "the chute", says: "A round chute in the west wall, going down and away.", leads: "w" }
    ],
    ambience: { lines: ["The wheel ticks over by itself, once.", "The guard shifts his weight, and keeps his hand out."], every: [30, 70] },
    sleep: "Not on the landing: the guard would step over you.",
    alt: "A bare landing with an iron wheel set in the back wall, a steel shutter on the right, a round chute on the left, a guard in grey in the doorway at the back and a ladder going up.",
    overlayAlt: { pass: "A white pass lies on the floor." }
  },
  "tb-annex": {
    name: "ANNEX", area: "hub", at: [0, -1, 1],
    describe: [
      "A narrow annex lined with shelves. A brass hook hangs from the ceiling over the middle of the room.",
      "The ways are south."
    ],
    exits: { s: "tb-ways" },
    scenery: [
      { words: ["hook"], name: "the hook", id: "annex_hook", says: "A brass hook in the ceiling, over the middle of the room." },
      { words: ["shelves", "shelf"], name: "the shelves", says: "Empty shelves, dusted." }
    ],
    alt: "A long narrow room lined with empty shelves, seen end on, with a brass hook in the ceiling and a long wooden pole lying along the floor.",
    overlayAlt: {}
  },
  "tb-landing": {
    name: "LANDING", area: "hub", at: [1, 0, 1],
    describe: [
      "A short landing with a rail. A flight of {stairs|landing_stairs} goes up.",
      "The ways are west."
    ],
    exits: { w: "tb-ways", u: "tb-roof" },
    scenery: [{ words: ["rail", "landing"], name: "the rail", says: "A steel rail, cold." }],
    alt: "A short landing with a steel rail across the front and a narrow flight of stairs going up the back wall into the dark.",
    overlayAlt: {}
  },
  "tb-chute": {
    name: "THE CHUTE", area: "hub", at: [-1, 0, 1],
    describe: [
      "A round steel tube, tilted. There is a handle on the east side that no longer turns.",
      "It goes on down to the yard."
    ],
    exits: { e: { to: "tb-ways", if: false, closed: "The way back has no handle on this side." }, d: "tb-yard" },
    scenery: [{ words: ["tube", "handle", "steel"], name: "the tube", says: "Polished steel, with a smooth slope down." }],
    alt: "The inside of a round steel tube, tilted, looking down it to a small bright circle of beaten earth.",
    overlayAlt: {}
  },
  "tb-closet": {
    name: "CLOSET", area: "hub", at: [0, 0, 2],
    placeholder: "A cupboard with nothing in it yet.",
    exits: { out: "tb-ways" },
    alt: "The inside of a cupboard: bare boards and a thin line of light under the door.",
    overlayAlt: {}
  },
  "tb-pit": {
    name: "THE PIT", area: "hub", at: [0, 1, 1],
    describe: [
      "A square hole in the floor of the ways, dug by a wheel. It is dry, and lit from above.",
      "A way goes north."
    ],
    exits: {},
    scenery: [{ words: ["hole", "pit", "floor"], name: "the pit", says: "Dry earth, and a smell of coins." }],
    alt: "A square pit seen from its floor, with straight earth walls and a bright square of light high above.",
    overlayAlt: {}
  },
  "tb-roof": {
    name: "THE ROOF", area: "hub", at: [0, 0, 3],
    describe: [
      "A flat roof with a low parapet, and the whole floor spread out far below. The wind is steady.",
      "The edge is near. The ways are down."
    ],
    exits: { d: "tb-ways" },
    scenery: [
      { words: ["edge", "parapet", "drop"], name: "the edge", says: "A low parapet, and then nothing for a long way." },
      { words: ["wind"], name: "the wind", says: "Steady, from the west, with no weather in it." }
    ],
    ambience: { lines: ["The wind leans on you, politely.", "Far below, a door opens and closes."], every: [25, 60] },
    sleep: "Not on the roof, at the edge.",
    alt: "A flat grey roof in a thin evening light, with a low parapet along the front and the grid of the test floor laid out far below like a plan.",
    overlayAlt: {}
  },

  // The cellar: doors, locks, pairs, containers.
  "tb-cellar": {
    name: "THE CELLAR", area: "hub", at: [0, 0, -1],
    describe: [
      "A low stone cellar with three doors. The {vault door|vault_door} is east, and the {pantry door|cellar_door} west. A {chest} stands by the wall, a {box} on a shelf, and a {bin} under it. A {boat} sits on blocks.",
      "The hub is up. An arch north leads to the sound of water."
    ],
    exits: { u: "tb-hub", n: "tb-falls", e: "tb-vault", w: "tb-pantry" },
    scenery: [{ words: ["blocks", "wall", "shelf", "stone"], name: "the wall", says: "Dressed stone, damp to the touch." }],
    mentions: ["scrap"],
    ambience: { lines: ["Water drips somewhere, and counts.", "The boat creaks on its blocks, going nowhere."], every: [25, 60] },
    sleep: "Not in the cellar: it is far too damp.",
    alt: "A low stone cellar with a round vault door of steel in the right wall, a small wooden door on the left, a big dark chest by the back wall and a small boat on blocks in the middle.",
    overlayAlt: {}
  },
  // The falls: a picture that moves (a scrolling waterfall, glints that flicker each on their own, a torch, a pennant and a ripple).
  "tb-falls": {
    name: "THE FALLS", area: "hub", at: [0, -1, -1],
    describe: [
      "A wet cave with a waterfall pouring down the back wall into a wide black pool. A torch burns in a bracket on the left, and a pennant hangs from a pole on the right.",
      "The cellar is south."
    ],
    exits: { s: "tb-cellar" },
    scenery: [
      { words: ["waterfall", "water", "fall", "falls"], name: "the waterfall", says: "Water, all of it going the same way." },
      { words: ["pool", "glints"], name: "the pool", says: "Black and wide, with small lights that come and go on it." },
      { words: ["torch", "bracket", "flame"], name: "the torch", says: "A torch, burning low and uneven." },
      { words: ["pennant", "pole", "flag"], name: "the pennant", says: "A red pennant on a grey pole, moving though there is no wind." }
    ],
    ambience: { lines: ["The waterfall goes on, the same noise in a new order.", "The torch gutters, and recovers."], every: [25, 60] },
    sleep: "Not by the water: the noise would get into the dream.",
    alt: "A wet stone cave with a tall waterfall pouring down the middle of the back wall into a wide dark pool, small lights glinting on the water, a torch in a bracket on the left wall and a red pennant on a pole on the right.",
    overlayAlt: {}
  },
  "tb-vault": {
    name: "THE VAULT", area: "hub", at: [1, 0, -1],
    describe: [
      "A small steel room, empty and bright.",
      "The cellar is west."
    ],
    exits: { w: "tb-cellar" },
    scenery: [{ words: ["room", "steel", "walls"], name: "the walls", says: "Steel on every side, brushed." }],
    alt: "A small bright room of brushed steel with a round open door at the left, a smooth floor, and nothing on the walls.",
    overlayAlt: { tin: "A dented tin sits on the floor." }
  },
  "tb-pantry": {
    name: "THE PANTRY", area: "hub", at: [-1, 0, -1],
    describe: [
      "A narrow pantry of wooden shelves, lit by a slit in the wall. A {jar} sits among cobwebs.",
      "The cellar is east."
    ],
    exits: { e: "tb-cellar" },
    scenery: [{ words: ["shelves", "shelf", "cobwebs", "cobweb", "slit"], name: "the shelves", says: "Wooden shelves, hung with old webs." }],
    alt: "A narrow pantry of dark wooden shelves with a slit of white light in the back wall, and a small glass jar on the middle shelf.",
    overlayAlt: {}
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------------
const objects = {
  // The opening: the thing to take, the one you carry, and the way on (BRIEF.md §3).
  handset: { at: "tb-start", portable: true, material: "stone", name: "Handset", note: "A voice, waiting.",
    words: { nouns: ["handset", "phone"], adj: ["grey"] }, ...item("handset"),
    here: "A {handset} hangs on a hook by the turnstile, crackling to itself.",
    examine: "A grey handset on a curly cord. Listen to it, and it tells you what to try." },
  slip: { at: "player", portable: true, material: "paper", name: "Slip", note: "Your test slip.",
    words: { nouns: ["slip", "sheet"], adj: ["test", "white"] }, ...item("slip"),
    examine: "A white slip: \"Tester. Try everything. Report what breaks.\"" },
  gate: { at: "tb-start", name: "Turnstile", note: "To the hub.",
    words: { nouns: ["turnstile", "gate"], adj: ["steel"] },
    examine: "A turnstile of three steel bars. It turns one way." },

  // The hub
  board: { at: "tb-hub", name: "Board", note: "What is where.",
    words: { nouns: ["board"], adj: ["notice"] },
    examine: "A board with six lines: Clinic, Bar, Bedroom, Yard, Ways, Cellar. A seventh line has been rubbed out.",
    read: "$board.examine" },
  badge: { at: "tb-hub", portable: true, droppable: false, material: "metal", name: "Badge", note: "Tester, first class.",
    words: { nouns: ["badge"], adj: ["brass", "tester"] }, ...item("badge"),
    here: "A brass {badge} lies on the floor by the board.", lies: "The badge lies where you left it, if you did.",
    drop: "You will want to keep the badge. It says who you are.",
    examine: "A brass badge: Tester, First Class." },

  parrot: { at: "tb-hub", name: "Parrot", note: "Answers to every verb.",
    words: { nouns: ["parrot", "bird"], adj: ["green", "grey"] },
    here: "A {parrot} sits on the rail of the board, answering to everything.",
    examine: "A parrot with a line for every verb a thing can answer to. Try them on it.",
    search: "The parrot lets you look through its feathers. There is nothing in them.",
    taste: "It tastes of seed.",
    take: "It will not be taken. It has a perch.",
    put: "There is no room on the parrot for anything.",
    show: "The parrot looks at it, and looks away.",
    throw: "You would not.",
    wear: "It is not that kind of parrot.",
    remove: "There is nothing on the parrot to remove.",
    close: "Nothing on the parrot opens or closes.",
    unlock: "The parrot has no lock.",
    push: "The parrot walks off the end of your finger, and back on.",
    pull: "It holds the perch tighter.",
    turn: "The parrot turns its head all the way round, and then back.",
    move: "It moves itself, thank you.",
    switch_on: "The parrot is already on.",
    switch_off: "The parrot cannot be switched off.",
    attack: "The parrot bites first.",
    knock: "The parrot knocks back, with its beak.",
    exit: "The parrot is not a place.",
    climb: "You climb nothing; the parrot climbs your sleeve.",
    jump: "The parrot jumps, and you do not.",
    sit: "The parrot has no room for you.",
    lie: "Not on the parrot.",
    stand: "The parrot stands. You may stand too.",
    wake: "The parrot was never asleep.",
    wait: "The parrot waits with you.",
    ask: "The parrot asks you the same thing back.",
    say: "The parrot says it back, a little wrong.",
    shout: "The parrot shouts louder.",
    sing: "The parrot joins in, on the wrong note.",
    wave: "The parrot waves a wing.",
    kiss: "The parrot lets you.",
    think: "The parrot thinks about seed.",
    pray: "The parrot bows its head, and eats something." },

  // The clinic: health
  spike: { at: "tb-clinic", name: "Spikes", note: "Not for feet.",
    words: { nouns: ["spikes", "spike"], adj: ["steel", "short"], pl: true },
    examine: "A square plate of short steel spikes, set in the floor. A little rust, and a little of something darker.",
    touch: "You put a fingertip to the spikes, and they put one back." },
  cabinet: { at: "tb-clinic", name: "Cabinet", note: "Steel, and loud.", material: "metal",
    words: { nouns: ["cabinet"], adj: ["steel"] },
    examine: "A steel cabinet with a flat top. It rings when it is struck." },
  vent: { at: "tb-clinic", name: "Vent", note: "Clean air.",
    words: { nouns: ["vent"], adj: ["wall"] },
    examine: "A square vent high in the wall. The air from it is clear and cool." },
  pill: { at: "tb-clinic", portable: true, material: "soft", name: "Pill", note: "White, and bitter.",
    consumable: true, heals: 1, stops: "poisoned", eat: "It is bitter, and then it is not.",
    words: { nouns: ["pill", "tablet"], adj: ["white", "small"] }, ...item("pill"),
    here: "A small white {pill} lies on the cot.",
    examine: "A small white pill. A label on the cot says it cures poison." },

  // The lab
  lever: { at: "tb-lab", name: "Lever", note: "In a steel slot.", use: "pull",
    words: { nouns: ["lever", "handle"], adj: ["steel", "tall"] },
    examine: "A tall steel lever, set in a slot. Above it a green lamp is dark." },
  socket: { at: "tb-lab", container: true, open: "always", name: "Socket", note: "Open, and empty.", material: "metal",
    words: { nouns: ["socket"], adj: ["open", "steel"] },
    examine: "An open socket the size of a fist, with two brass contacts." },
  dial: { at: "tb-lab", name: "Dial", note: "Set to nothing.",
    words: { nouns: ["dial"], adj: ["round"] },
    examine: "A round dial with six marks. It turns by itself when you ask, and the picture changes." },
  button: { at: "tb-lab", name: "Button", note: "Green, and lit.",
    words: { nouns: ["button"], adj: ["green", "lit"] },
    examine: "A green button in the wall, lit from inside. A card says it goes to the landing." },
  radio: { at: "tb-lab", name: "Radio", note: "Between stations.",
    words: { nouns: ["radio"], adj: ["small"] },
    examine: "A small radio between stations, hissing.", listen: "Hiss, and under it, one word." },

  wire: { at: null, portable: true, material: "soft", name: "Wire", note: "A coil of it.",
    words: { nouns: ["wire", "coil"], adj: ["copper"] }, ...item("wire"),
    here: "A coil of copper {wire} lies on the bench.",
    examine: "A coil of copper wire, still warm from the radio." },

  // The bar
  dot: { at: "tb-bar", name: "Dot", note: "Keeps the bar.",
    words: { nouns: ["dot", "barmaid"], adj: [], g: "f", proper: true },
    examine: "A tall woman in a white apron, drying a glass that is already dry.",
    talk: "\"What will it be?\" says Dot. \"Beer, tea, a bun, or a key, if you have the coin.\"",
    give: "\"Not mine,\" says Dot, and hands it back.",
    topics: {
      menu: { open: true, label: "the menu", words: ["menu", "drinks", "food", "beer", "tea", "bun"], says: "\"Beer, three a day, and the third goes to your head. Tea, one a day. A bun, between six and ten. A key, for a coin.\"" },
      coin: { about: "coin", label: "the coin", words: ["coin", "money", "pay"], says: "\"The coin on the counter. It is not mine, and it is not yours, and it is exactly the price of a key.\"" },
      default: "\"Can't help you with that,\" says Dot, and polishes the glass."
    } },
  beer: { at: null, from: "dot", times: 3, material: "glass", name: "Beer", note: "Cold, in a glass.",
    brought: ["Dot pulls a {beer} and slides it over.", "Dot pulls another {beer}.", "Dot pulls a third {beer}, and looks at you for a moment."],
    already: "\"Drink that one first,\" says Dot.", again: "\"No more beer,\" says Dot. \"Three is the limit.\"",
    consumable: true, starts: "drunk", drink: ["Cold and plain.", "Cold and plain, and a little warmer.", "It goes straight to your knees."],
    words: { nouns: ["beer", "glass"], adj: ["cold"] },
    examine: "A glass of beer, cold, with a very small head." },
  tea: { at: null, from: "dot", daily: true, times: 1, material: "stone", name: "Tea", note: "Hot, in a mug.",
    brought: "Dot sets down a mug of {tea}.", already: "\"That one is still hot,\" says Dot.", again: "\"One a day,\" says Dot. \"Come back tomorrow.\"",
    consumable: true, heals: 1, stops: "drunk", drink: "It is exactly as strong as you like it.",
    words: { nouns: ["tea", "mug"], adj: ["hot"] },
    examine: "A mug of hot tea, the colour of a table." },
  bun: { at: null, from: "dot", if: [hours(6, 22)], material: "soft", name: "Bun", note: "Warm, with a split.",
    brought: "Dot puts a {bun} on the counter.", again: "\"The ovens are cold,\" says Dot. \"Between six and ten.\"",
    consumable: true, heals: 1, eat: "It is warm, and it is gone.",
    words: { nouns: ["bun", "roll"], adj: ["warm"] },
    examine: "A warm bun with a split down the middle." },
  chest_key: { at: null, from: "dot", requires: "coin", spends: true, lacking: "\"A key is a coin,\" says Dot, and waits.", material: "metal",
    name: "Chest key", note: "Small, for the chest.", portable: true,
    brought: "Dot takes the coin, and gives you a small {key|chest_key}.", again: "\"One key,\" says Dot. \"I have only the one.\"",
    words: { nouns: ["key"], adj: ["chest", "small", "tin"] }, ...item("chest_key"),
    examine: "A small key on a loop of wire, tagged: Chest." },
  coin: { at: "tb-bar", portable: true, material: "metal", name: "Coin", note: "Exactly one.",
    words: { nouns: ["coin"], adj: ["copper"] }, ...item("coin"),
    here: "A copper {coin} lies by the glass.", lies: "A copper coin lies where it was put down.",
    examine: "A copper coin, worn smooth on one side." },
  green: { at: "tb-bar", portable: true, material: "glass", name: "Green draught", note: "A tall green glass.",
    consumable: true, starts: "poisoned", drink: "It tastes of pennies, and then of nothing at all.",
    words: { nouns: ["draught", "glass"], adj: ["green", "tall"] }, ...item("green"),
    here: "A green {draught|green} stands on the counter.",
    examine: "A tall glass of green liquid. A card says: Poison, for testing." },
  stove: { at: "tb-bar", name: "Stove", note: "Glowing, and warm.",
    words: { nouns: ["stove"], adj: ["red"] },
    examine: "A squat stove with its door open. It is the warmest thing on the floor." },
  ice: { at: "tb-bar", name: "Ice", note: "A trough of it.",
    words: { nouns: ["ice", "trough"], adj: ["white"] },
    examine: "A long trough of ice. It does not melt. Nobody has asked it to." },

  // The office
  oduya: { at: "tb-office", name: "Mrs Oduya", portrait: sprites.oduya_portrait, note: "Keeps the book.",
    words: { nouns: ["oduya", "mrs", "registrar"], adj: ["mrs"], g: "f", proper: true },
    examine: "A woman in a grey cardigan, writing in a ledger. She has been writing since the floor opened.",
    talk: "\"Yes?\" says Mrs Oduya, without looking up.",
    give: "\"Put it on the desk,\" says Mrs Oduya, and then, \"No. Take it back.\"",
    topics: {
      herself: { open: true, label: "herself", words: ["herself", "who", "registrar"], says: "\"I keep the book,\" says Mrs Oduya. \"Names go in it.\"" },
      ledger: { label: "the ledger", words: ["ledger", "book"], opens: ["debt"], says: "\"The book holds who owes what. It is not a long book, and it is not a short one.\"" },
      debt: { about: "debt", label: "who owes", words: ["debt", "owes", "owe", "owing"], opens: ["verdict"], says: "\"Somebody always owes,\" says Mrs Oduya. \"The book keeps the name until it is paid.\"" },
      verdict: { about: "verdict", label: "whose name", words: ["verdict", "name", "whose"], says: "\"Ask me properly.\"" },
      monday: { about: "monday", label: "Monday", words: ["monday", "day", "week"], says: "\"Mondays are a fact. I do not argue with facts.\"" },
      default: "\"That is not in the book,\" says Mrs Oduya."
    } },
  ledger: { at: "tb-office", name: "Ledger", note: "Who owes what.", opens: ["debt"],
    words: { nouns: ["ledger", "book"], adj: ["thick", "black"] },
    parts: [{ words: ["columns", "column", "page", "pages"], name: "the columns", says: "Names on the left, sums on the right, and nothing in the middle." }],
    mentions: ["monday"],
    examine: "A thick black ledger. Each page has two columns: a name, and what is owed. A day of the week is pressed flat between two pages.", read: "$ledger.examine" },
  monday: { at: "tb-office", unnoticed: true, name: "Monday", note: "The framed day.",
    words: { nouns: ["monday"], proper: true },
    examine: "The word in the frame is Monday." },
  poster: { at: "tb-office", name: "Poster", note: "Shows a coin.", img: "coin",
    words: { nouns: ["poster"], adj: ["small"] },
    examine: "A small poster of a coin, with the word Spend under it. Its picture is the coin's." },

  // The bedroom
  bunk: { at: "tb-bedroom", enterable: "on", name: "Bunk", note: "To sleep on.",
    words: { nouns: ["bunk", "bed"], adj: ["low"] },
    enter: "You climb onto the bunk and lie down.",
    examine: "A low bunk with a grey blanket. A card on it says: Lie down to sleep until half past seven." },
  hammock: { at: "tb-bedroom", enterable: "in", name: "Hammock", note: "Has a dream in it.",
    dream: { says: "You are in a hammock over the test floor, and every room is lit, and each one has a door open.", picture: "hammock_dream", opens: "floor", once: true },
    words: { nouns: ["hammock"], adj: ["canvas"] },
    enter: "You get into the hammock, and it takes your weight with a sigh.",
    examine: "A canvas hammock slung from two hooks. Sleeping in it gives a dream, once." },
  lamp: { at: "tb-bedroom", name: "Lamp", note: "Yellow, and lit.",
    words: { nouns: ["lamp"], adj: ["yellow"] },
    examine: "A yellow lamp on the table. When it goes out, the edges of everything go dark." },
  clock: { at: "tb-bedroom", name: "Clock", note: "Moves time.",
    waitFor: { time: "next 12:00", says: "You watch the clock until it reads noon.", if: [{ "time.hour": { "!=": 12 } }] },
    actions: ["Wind clock"],
    words: { nouns: ["clock"], adj: ["round"] },
    examine: "A round clock with a winding key. It says [time]. Winding it moves the day on an hour." },

  // The yard and the lane: things that move
  cat: { at: "tb-yard", name: "Cat", note: "Wanders, and follows.",
    rounds: { rooms: ["tb-yard", "tb-lane"], every: [3, 5], random: true },
    places: [{ at: "player", if: [{ "cat.stroked": true }], within: ["tb-yard", "tb-lane", "tb-hub"] }],
    arrives: "The cat pads in.", leaves: "The cat slips out.",
    words: { nouns: ["cat"], adj: ["grey"] }, ...item("cat"),
    here: "A grey {cat} sits there, as if it had always been there.",
    examine: "A grey cat. It wanders the yard and the lane until it is stroked, and then it follows you through the hub, the yard and the lane. Shoo it, and it wanders again.",
    talk: "The cat looks at you, and then at something behind you." },
  watchman: { at: "tb-yard", name: "Watchman", note: "On his round.",
    rounds: { rooms: ["tb-yard", "tb-lane"], every: [4, 4] },
    words: { nouns: ["watchman", "guardsman"], adj: ["long"] }, ...item("watchman"),
    here: "A {watchman} walks his round.",
    examine: "A watchman in a long coat. He walks the yard and the lane, one step every four moves of yours." },
  bird: { at: "tb-lane", name: "Bird", note: "Moves on its own.",
    rounds: { rooms: ["tb-yard", "tb-lane"], every: { seconds: [30, 50] }, random: true },
    arrives: ["A bird flutters in."], leaves: ["The bird flutters off."],
    words: { nouns: ["bird", "sparrow"], adj: ["small", "brown"] }, ...item("bird"),
    here: "A small {bird} hops about.",
    examine: "A small brown bird. It moves on its own, every half minute or so, whether you are reading or not." },
  clerk: { at: "tb-lane", name: "Night clerk", note: "Only after eight.",
    places: [{ at: "tb-lane", if: [hours(20, 6)] }],
    arrives: "The night clerk comes on shift.", leaves: "The night clerk goes off shift.",
    words: { nouns: ["clerk"], adj: ["night", "green"] }, ...item("clerk"),
    here: "A night {clerk} stands under the window.",
    examine: "A clerk in a green visor. He is in the lane from eight at night until six in the morning." },
  bench: { at: "tb-yard", enterable: "on", name: "Bench", note: "To sit on.",
    words: { nouns: ["bench"], adj: ["wooden"] },
    enter: "You sit on the bench.",
    examine: "A wooden bench. You can sit on it, and the room says so." },

  // The ways
  pass: { at: "tb-ways", portable: true, material: "paper", name: "Pass", note: "For the guard.",
    words: { nouns: ["pass"], adj: ["white", "guard's"] }, ...item("pass"),
    here: "A white {pass} lies on the floor.",
    examine: "A white pass: \"Annex. One use.\"" },
  wheel: { at: "tb-ways", name: "Wheel", note: "Digs, and fills.",
    words: { nouns: ["wheel"], adj: ["iron", "big"] },
    examine: "A big iron wheel set in the wall. Turn it, and a way opens to a pit; turn it again, and the way shuts." },
  ladder: { at: "tb-ways", leads: ["u", "d"], name: "Ladder", note: "Up, or down.",
    words: { nouns: ["ladder"], adj: ["iron"] },
    examine: "An iron ladder. Climbing goes up; climbing down goes down." },
  pole: { at: "tb-annex", portable: true, material: "wood", shape: "pole_shape", name: "Pole", note: "Long, for the hook.",
    here: "A long wooden pole lies along the floor, from wall to wall.",
    words: { nouns: ["pole"], adj: ["long", "wooden"] }, ...item("pole"),
    examine: "A long wooden pole, as long as the room." },
  landing_stairs: { at: "tb-landing", leads: "u", name: "Stairs", note: "Up to the roof.",
    words: { nouns: ["stairs", "flight"], adj: ["narrow"], pl: true },
    examine: "A narrow flight of stairs going up." },

  // The cellar
  vault_door: { at: "tb-cellar", door: "e", material: "metal", locked: true, name: "Vault door", note: "Round, and steel.",
    shut: "You walk up to the vault door and put your hand on it. Locked.",
    lock: { key: "vault_key", says: "The keyhole wants a long brass key.", opens: "The key turns, and the vault door swings open on a bright room.", then: "vault_open" },
    words: { nouns: ["vault door", "door"], adj: ["round", "steel"] },
    examine: "A round steel door with a keyhole." },
  cellar_door: { at: "tb-cellar", door: "w", pair: "pantry_door", material: "wood", locked: true, name: "Pantry door", note: "Locked from here.",
    shut: "The pantry door is shut and locked.",
    lock: { key: "pantry_key", says: "The pantry door wants a tiny key.", opens: "The tiny key turns, and the pantry door swings open." },
    words: { nouns: ["pantry door", "door"], adj: ["wooden", "small"] },
    examine: "A small wooden door, locked. It has a twin on the other side." },
  pantry_door: { at: "tb-pantry", door: "e", pair: "cellar_door", material: "wood", locked: true, name: "Cellar door", note: "Locked from here too.",
    shut: "The cellar door is shut and locked.",
    lock: { key: "pantry_key", says: "The cellar door is locked on this side too.", opens: "The tiny key turns, and the cellar door swings open." },
    words: { nouns: ["cellar door", "door"], adj: ["wooden"] },
    examine: "A small wooden door, the same one seen from the other side." },
  chest: { at: "tb-cellar", container: true, open: false, locked: true, material: "wood", name: "Chest", note: "Locked, with a fuse in it.",
    lock: { key: "chest_key", says: "The chest is locked. The lock is small." },
    words: { nouns: ["chest"], adj: ["big", "dark"] },
    examine: "A big dark chest, locked." },
  fuse: { at: "chest", portable: true, material: "metal", name: "Fuse", note: "Fits the socket.",
    words: { nouns: ["fuse"], adj: ["brass"] }, ...item("fuse"),
    examine: "A brass fuse the size of a thumb." },
  vault_key: { at: "chest", portable: true, material: "metal", name: "Vault key", note: "Long, and brass.",
    words: { nouns: ["key"], adj: ["vault", "brass", "long"] }, ...item("vault_key"),
    examine: "A long brass key, tagged: Vault." },
  box: { at: "tb-cellar", container: true, open: true, material: "wood", name: "Box", note: "Open, with a lid.",
    words: { nouns: ["box"], adj: ["small", "tin"] },
    examine: "A small open box with a lid that closes." },
  pantry_key: { at: "box", portable: true, material: "metal", name: "Pantry key", note: "Tiny.",
    words: { nouns: ["key"], adj: ["pantry", "tiny"] }, ...item("pantry_key"),
    examine: "A tiny key, tagged: Pantry." },
  bin: { at: "tb-cellar", container: true, open: "always", material: "wood", name: "Bin", note: "Open for good.",
    words: { nouns: ["bin"], adj: ["wooden"] },
    examine: "A wooden bin with no lid. Things can go in and out of it." },
  boat: { at: "tb-cellar", enterable: "in", container: true, open: "always", material: "wood", name: "Boat", note: "On blocks.",
    words: { nouns: ["boat"], adj: ["small"] },
    enter: "You step into the boat, and sit down in it.",
    examine: "A small boat on blocks, a long way from any water." },
  scrap: { at: "tb-cellar", unnoticed: true, name: "Scrap", note: "Of paper.",
    words: { nouns: ["scrap"], adj: ["paper"] },
    examine: "A scrap of paper with half a word on it." },
  jar: { at: "tb-pantry", container: true, open: false, material: "glass", name: "Jar", note: "Closed.",
    words: { nouns: ["jar"], adj: ["glass"] },
    examine: "A glass jar with a screw lid, empty." },
  tin: { at: "tb-vault", portable: true, material: "metal", name: "Tin", note: "Rattles.",
    heldActions: ["Shake tin"],
    words: { nouns: ["tin"], adj: ["dented"] }, ...item("tin"),
    here: "A dented {tin} sits on the floor.",
    examine: "A dented tin that rattles when shaken." }
};

// ---- Named changes -----------------------------------------------------------------------------------------------------------
const changes = {
  vault_open: [{ say: "The vault door swings wide, and a cool bright light comes out of it." }],
  nap: [
    { say: "You lie down, and the room goes quiet." },
    { set: "bunk.slept", to: "$time.day" },
    { sleep: "next 07:30" }
  ]
};

// ---- Rules -----------------------------------------------------------------------------------------------------------------
// The dial turns through the settings, one rule each (a filter on, the last one off), counting up with `add`.
const rules = [
  // The opening's own rules come from the declaration. Hurts and heals.
  { id: "touch_spike", match: { verb: "touch", obj: "spike" }, do: [{ hurt: 1, says: "The spikes go in a little way, and come out again." }] },
  { id: "smell_vent", match: { verb: "smell", obj: "vent" }, once: true, again: "The air from the vent is cool, and nothing else.",
    do: [{ heal: 1, says: "You breathe in cool, clean air, and your head clears." }] },
  { id: "kick_cabinet", match: { verb: "attack", obj: "cabinet" },
    do: [{ say: "The cabinet rings like a bell, and the whole room jumps with it." }, { filter: "shake" }] },
  { id: "read_gauge", match: { verb: "think", obj: "vent" }, do: [{ say: "You think about the vent." }, { echo: "You feel a little clearer", kind: "clear" }] },
  { id: "breathe_wave", match: { verb: "wait" }, if: [{ "player.at": "tb-clinic" }], once: true,
    do: [{ say: "You stand and breathe, and the room settles." }, { filter: "wave" }] },
  // The lab: USE, travel, the lever and its question, the dial.
  { id: "pull_lever_ready", match: { verb: "pull", obj: "lever" }, if: [{ "fuse.at": "socket" }],
    do: [{ say: "The lever is stiff. The socket hums, and the green lamp over the slot is lit." },
         { confirm: "Throw it for good?", style: "sys", yes: [{ say: "You throw the lever. The fuse flashes, and every light on the floor comes on at once." }, { end: true, picture: "lit" }],
           no: [{ say: "You let the lever go, slowly, and it stays where it is." }] }] },
  { id: "pull_lever_empty", match: { verb: "pull", obj: "lever" },
    do: [{ say: "The lever moves, and nothing happens. The socket beside it is empty." }] },
  { id: "push_button", match: { verb: "push", obj: "button" }, do: [{ say: "The button clicks, and the floor goes out from under you, politely." }, { travel: "tb-landing" }] },
  { id: "use_pole_hook", match: { verb: "use", obj: "pole", scenery: "annex_hook" }, if: [{ "player.at": "tb-annex" }],
    do: [{ say: "You hang the pole on the hook, and it swings once, and hangs there." }, { move: "pole", to: "tb-annex" }] },
  { id: "put_coin_socket", match: { verb: "put", obj: "coin", obj2: "socket", prep: "in" }, if: [{ "$obj2": "socket" }],
    do: [{ say: "The coin is too thin for the contacts, and rolls back into your hand." }] },
  { id: "tune_radio", match: { verb: "tune", obj: "radio" },
    do: [{ say: "You tune the radio, and the hiss stops, and one word comes through: Testbed." }, { set: "radio.tuned", to: true }, { remove: "rule", id: "radio_hiss" },
         { move: "wire", to: "tb-lab" },
         { draw: "tb-lab", overlays: [{ object: "wire", at: [236, 108] }], cycles: [{ name: "the lamp", areas: ["lever_lamp"], colors: [10, 2], style: "pingpong", ms: 1600 }],
           loops: [{ name: "sparks", at: [226, 98], style: "random", ms: 150, frames: [["..f.", ".fef", "..f.", "...."], ["....", ".f..", "fef.", ".f.."]] }] }] },
  { id: "radio_hiss", when: "every", every: { turns: [4, 6] }, chance: 1, if: [{ "player.at": "tb-lab" }, { "radio.tuned": false }],
    do: [{ say: "The radio hisses, and a word almost comes out of it." }] },
  { id: "whistle_note", match: { verb: "whistle" }, do: [{ say: "You whistle one thin note. The cables answer." }] },
  { id: "intone_open", match: { verb: "intone", text: "open sesame" }, do: [{ say: "You say it exactly, and the room takes it as a joke." }] },
  { id: "intone_any", match: { verb: "intone" }, if: [{ "$text": { in: ["testbed", "the testbed"] } }],
    do: [{ say: "\"[player.rank],\" you say, and the lab agrees." }] },
  { id: "summon_dot", match: { verb: "summon", obj: "dot" }, if: [{ "dot.place": { "!=": "$here" } }, { "$here": { "!=": "tb-bar" } }],
    do: [{ say: "Dot is in the bar, east of the hub. She cannot hear you from here." }] },
  { id: "shake_tin", match: { verb: "shake", obj: "tin" }, once: true, again: "The tin rattles again, in the same way.",
    do: [{ say: "The tin rattles: a very small coin, or a very large bean." }] },
  { id: "dial_0", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 0 }],
    do: [{ filter: "vignette" }, { set: "dial.setting", add: 1 }, { say: "The picture darkens at the edges." }] },
  { id: "dial_1", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 1 }],
    do: [{ unfilter: "vignette" }, { filter: "mosaic" }, { set: "dial.setting", add: 1 }, { say: "The picture goes to coarse blocks." }] },
  { id: "dial_2", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": { "=": 2 } }],
    do: [{ unfilter: "mosaic" }, { filter: "static" }, { set: "dial.setting", add: 1 }, { say: "A few pixels begin to flicker, like a bad signal." }] },
  { id: "dial_3", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 3 }],
    do: [{ unfilter: "static" }, { filter: "tint:sepia" }, { set: "dial.setting", add: 1 }, { say: "The picture turns the colour of an old photograph." }] },
  { id: "dial_4", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 4 }],
    do: [{ filter: "tint:faint" }, { set: "dial.setting", add: 1 }, { say: "The picture washes out." }] },
  { id: "dial_5", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": { "<=": 5 } }],
    do: [{ unfilter: "tint" }, { set: "dial.setting", to: 0 }, { say: "The dial clicks back to nothing, and the picture is plain again." }] },
  // The bar: conditions.
  { id: "warm_hands", match: { verb: "touch", obj: "stove" }, if: [{ "player.conditions": { has: "cold" } }],
    do: [{ say: "You hold your hands to the stove until the cold lets go." }, { stop: "cold" }] },
  { id: "touch_stove", match: { verb: "touch", obj: "stove" }, once: true, again: "The stove is as warm as before.",
    do: [{ say: "You hold your hands to the stove, and the warmth goes in and stays." }, { start: "warm" }] },
  { id: "touch_ice", match: { verb: "touch", obj: "ice" },
    do: [{ say: "You put your hand in the trough, and the cold goes up to the elbow." }, { start: "cold" }] },
  { id: "take_coin_say", match: { verb: "smell", obj: "coin" }, if: [{ any: [{ "player.conditions": { has: "drunk" } }, { "player.conditions": { has: "cold" } }] }],
    do: [{ say: "You smell the coin, which is more than most people do, in your state." }] },
  // The bedroom: the lamp, the clock, the bunk. Time.
  { id: "lamp_off", match: { verb: "switch_off", obj: "lamp" }, do: [{ say: "The lamp goes out, and the edges of the room go dark." }, { filter: "vignette" }, { draw: "tb-bedroom", replace: ["ellipse lamp_glow 150,70,20,16 mix:,0@0.6"] }] },
  { id: "lamp_on", match: { verb: "switch_on", obj: "lamp" }, do: [{ say: "The lamp comes on, and the room is the right size again." }, { unfilter: "vignette" }, { draw: "tb-bedroom", replace: ["ellipse lamp_glow 150,70,20,16 mix:,14@0.4"] }] },
  { id: "wind_clock", match: { verb: "turn", obj: "clock" }, if: [{ "clock.rang": { "<": 3 } }],
    do: [{ time: "+1h" }, { set: "clock.rang", add: 1 }, { say: "You wind the clock, and the day moves on an hour. The count is [clock.rang]." }] },
  { id: "wind_clock_late", match: { verb: "turn", obj: "clock" }, if: [{ "clock.rang": { ">=": 3 } }],
    do: [{ time: "next 06:00" }, { say: "The clock, wound enough, goes round to six in the morning." }] },
  { id: "lie_bunk", match: { verb: "lie", obj: "bunk" }, do: [{ change: "nap" }] },
  // The yard: the cat.
  { id: "stroke_cat", match: { verb: "touch", obj: "cat" }, do: [{ say: "You stroke the cat, and it leans into the hand, and now it is coming with you." }, { set: "cat.stroked", to: true }] },
  { id: "shoo_cat", match: { verb: "attack", obj: "cat" }, if: [{ "cat.stroked": true }],
    do: [{ say: "You shoo the cat, and it goes off on its own again." }, { set: "cat.stroked", to: false }] },
  { id: "bench_sit_line", match: { verb: "look" }, if: [{ "player.in": "bench" }], do: [{ say: "You are on the bench, and the yard goes on without you." }, { describe: "$here" }] },
  // The ways: walking, the wheel, the roof.
  { id: "go_west_ways", match: { verb: "go", dir: "w" }, if: [{ "player.at": "tb-ways" }, { "$exit": "tb-chute" }], then: "default",
    do: [{ say: "The chute takes you with a short shout of air." }] },
  { id: "go_east_shut", match: { verb: "go", dir: "e" }, if: [{ "player.at": "tb-ways" }, { "$exit": false }], then: "default",
    do: [{ say: "The shutter is a thing you can see from here." }] },
  { id: "wheel_dig", match: { verb: "turn", obj: "wheel" }, if: [{ "wheel.stage": 0 }],
    do: [{ say: "The wheel turns, and a hatch in the floor south of you slides back on a pit." },
         { draw: "tb-ways", add: ["rect hatch 130,112,60,14 0 e8"] },
         { connect: "tb-ways", dir: "s", to: "tb-pit" },
         { connect: "tb-pit", dir: "s", to: "tb-closet", passage: true, in: true },
         { connect: "tb-pit", dir: "n", to: "tb-ways", out: true },
         { connect: "tb-pit", dir: "e", to: "tb-landing", passage: true, if: { "wheel.stage": { ">=": 1 } }, closed: "The wall is solid until the wheel has turned." },
         { connect: "tb-pit", dir: "w", to: "tb-chute", passage: true, requires: "pass", spends: true, lacking: "You would need a pass." },
         { change: "no_such_change", optional: true },
         { set: "wheel.stage", to: 1 }] },
  { id: "wheel_fill", match: { verb: "turn", obj: "wheel" }, if: [{ "wheel.stage": 1 }],
    do: [{ say: "The wheel turns back, and the hatch slides shut over the pit." },
         { draw: "tb-ways", remove: ["hatch"] },
         { disconnect: "tb-ways", dir: "s" }, { disconnect: "tb-pit", dir: "s" }, { disconnect: "tb-pit", dir: "n" }, { disconnect: "tb-pit", dir: "e" }, { disconnect: "tb-pit", dir: "w" },
         { set: "wheel.stage", to: 0 }] },
  { id: "jump_roof", match: { verb: "jump" }, if: [{ "player.at": "tb-roof" }],
    do: [{ say: "You step off the edge. The floor comes up, quite slowly, and then not slowly at all." }, { hurt: 5, says: "The ground is very hard." },
         { end: true, picture: "fell" }] },
  // The office: topics that open topics, and the question.
  { id: "ask_verdict", match: { verb: "ask", obj: "oduya", topic: "verdict" },
    do: [{ say: "\"Whose name goes in the book?\" says Mrs Oduya, pen up." }, { ask: "verdict" }] },
  { id: "verdict_right", match: { verb: "answer", question: "verdict" },
    if: [{ "player.answers.verdict": { in: ["oduya", "mrs oduya", "the registrar", "registrar"] } }],
    do: [{ say: "\"[player.answers.verdict],\" Mrs Oduya says, and writes it down. \"At last. I was beginning to think I would have to.\"" },
         { end: true, picture: "named" }] },
  { id: "verdict_blank", match: { verb: "answer", question: "verdict", blank: true },
    do: [{ say: "You say nothing. Mrs Oduya waits, and writes down the nothing." }] },
  { id: "verdict_other", match: { verb: "answer", question: "verdict" },
    do: [{ say: "\"[player.answers.verdict],\" says Mrs Oduya, and tries it in the margin. \"No. That is not who owes.\"" }] },
  { id: "think_ledger", match: { verb: "think", obj: "ledger" }, do: [{ say: "You think about the ledger, and a debt comes to mind.", style: "sys" }, { know: "debt" }] },
  { id: "think_absent", match: { verb: "think", absent: "wire" }, do: [{ say: "You think about the wire, but it is not here to be thought about." }] },
  { id: "ask_default", match: { verb: "ask", obj: "dot" }, if: [{ "$topic": null }], do: [{ say: "Dot waits to be asked about something." }] },
  { id: "read_ledger", match: { verb: "read", obj: "ledger" }, do: [{ say: "$ledger.examine", img: "coin" }] },
  { id: "tear_scrap", match: { verb: "attack", obj: "scrap" }, do: [{ say: "You tear the scrap, and the half word is gone." }, { remove: "object", id: "scrap" }] },
  // The hub: the board reads the state back to you, and a scheduled rule or two.
  { id: "board_status", match: { verb: "read", obj: "board" },
    if: [{ "game.turn": { ">=": 0 } }, { "game.clock": { ">=": 0 } }, { "game.entrance": "tb-hub" }, { "game.ended": false }, { "time.day": { ">=": 1 } },
         { "time.minute": { ">=": 0 } }, { "time.second": { ">=": 0 } }, { "time.weekday": { "!=": "sun" } }, { "player.health": { ">": 0 } },
         { "player.carrying": { has: "slip" } }, { "player.at": "tb-hub" }, { "$in": null }, { "$obj.at": "tb-hub" }, { "badge.place": "tb-hub" }, { "oduya.person": true },
         { "badge.holder": null }, { "$exits": { "!=": null } }, { "game.ending": null }, { "fuse.chain": { has: "fuse" } }],
    do: [{ say: "The board reads back what the game knows: the turn, the clock, the day and the hour, and your health.", img: "coin" }] },
  { id: "board_plain", match: { verb: "read", obj: "board" }, do: [{ say: "$board.examine" }] },
  { id: "dusk_sky", when: "at", at: "19:00", do: [{ draw: "tb-yard", restyle: [{ id: "sky", fill: 8 }] }] },
  { id: "bell_tower", when: "at", at: "day 2 08:00", once: true, do: [{ say: "Somewhere above the floor, a bell strikes eight, and nobody is surprised." }] },
  { id: "hub_tick", when: "every", every: { turns: [8, 12] }, chance: 0.5, if: [{ "player.at": "tb-hub" }], do: [{ say: "The doors of the hub click, one after another." }] },
  // A rule added in play, ahead of another (BRIEF §8, "Rules"): the board is read the plain way first once the lamp is out.
  { id: "board_dim", match: { verb: "read", obj: "board" }, if: [{ "tb-hub.dim": true }], do: [{ say: "The board is hard to read in the dark." }] }
];
// ---- Puzzles ---------------------------------------------------------------------------------------------------------------
const puzzles = {
  take_coin: { where: "tb-bar", needs: [], solve: ["{take} coin"], gives: ["coin"], clues: ["dot", "coin"],
    hints: ["A coin lies by the glass on the counter.", "Take the coin from the bar."] },
  buy_key: { where: "tb-bar", needs: ["take_coin"], solve: ["buy chest key"], gives: ["chest_key"], clues: ["dot", "chest_key"],
    hints: ["Dot sells a small key for exactly one coin.", "Buy the chest key from Dot, with the coin."] },
  open_chest: { where: "tb-cellar", needs: ["buy_key"], solve: ["unlock chest with chest key", "take fuse from chest"], gives: ["fuse"], clues: ["chest", "chest_key"],
    hints: ["The small key fits the big chest in the cellar.", "Unlock the chest with the chest key, and take the fuse."] },
  take_vault_key: { where: "tb-cellar", needs: ["open_chest"], solve: ["take vault key from chest"], gives: ["vault_key"], clues: ["chest", "vault_door"],
    hints: ["The chest holds a long brass key too.", "Take the vault key from the chest."] },
  open_vault: { where: "tb-cellar", needs: ["take_vault_key"], solve: ["unlock vault door with vault key", "east"], reaches: "tb-vault", clues: ["vault_door", "vault_key"],
    hints: ["The brass key fits the vault door.", "Unlock the vault door with the vault key, then go east."] },
  open_pantry: { where: "tb-cellar", needs: [], solve: ["take pantry key from box", "unlock pantry door with pantry key", "west"], reaches: "tb-pantry", clues: ["box", "cellar_door"],
    hints: ["The box holds a tiny key.", "Take the pantry key from the box, unlock the pantry door with it, and go west."] },
  light: { where: "tb-lab", needs: ["open_chest"], solve: ["put fuse in socket", "pull lever", "yes"], ending: true, clues: ["lever", "socket", "fuse"],
    hints: ["The socket is empty, and the lever does nothing without a fuse in it.", "Put the fuse in the socket, pull the lever, and say yes."] },
  named: { where: "tb-office", needs: [], solve: ["examine ledger", "ask oduya about ledger", "ask oduya about debt", "ask oduya about verdict", "oduya"], ending: true,
    clues: ["oduya", "ledger"],
    hints: ["Mrs Oduya keeps the book, and the book keeps a name.", "Ask her about the ledger, then the debt, then the verdict, and answer with her own name."] },
  meet_clerk: { where: "tb-yard", needs: [], solve: ["west"], reaches: "tb-lane", time: "next 20:00", clues: ["clerk", "watchman"],
    hints: ["The lane has a night clerk, after eight.", "Wait for the evening, then go west."] },
  fell: { where: "tb-roof", needs: [], solve: ["jump"], ending: true, clues: ["ladder", "landing_stairs"],
    hints: ["The roof has an edge, and the edge has a drop.", "Climb up to the roof, and jump."] }
};

// ---- The opening, declared (BRIEF.md §3) -----------------------------------------------------------------------------------
const opening = {
  room: "tb-start", hints: "handset", intro: "slip", way: "gate",
  lines: {
    notYet: "The turnstile will not turn. The handset is still on its hook, and it wants to be carried first.",
    through: "You push the turnstile. It turns once, and is a wall again by the time you look back.",
    hintFrame: "The handset crackles. A flat voice says:",
    farewell: "The slip is read, and goes grey, and is gone."
  }
};

// ---- The change set --------------------------------------------------------------------------------------------------------
export default {
  because: "After the opening: the test floor, a hub with a way to each mechanism of the engine.",
  opening,
  facts: [
    "The player arrives at the hub of the test floor, on a Monday, at noon.",
    "Each room is for one mechanism; a cat, a watchman, a bird and a night clerk move on their own.",
    "Three endings: lit (the lab), named (the office), fell (the roof), and died when health runs out."
  ],
  properties: {
    "cat.stroked": { type: "boolean", start: false },
    "dial.setting": { type: "number", min: 0, max: 5, start: 0 },
    "wheel.stage": { type: "number", min: 0, max: 1, start: 0 },
    "clock.rang": { type: "number", min: 0, max: 9, start: 0 },
    "bunk.slept": { type: "number", min: 0, max: 99, start: 0 },
    "radio.tuned": { type: "boolean", start: false },
    "tb-hub.dim": { type: "boolean", start: false },
    "player.rank": { type: "string", start: "tester" }
  },
  effects: [
    { time: "day 1 12:00", weekday: "mon" },                  // the opening is played at noon
    { set: "game.entrance", to: "tb-hub" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 12:00", weekday: "mon" },
      { say: "The hub is lit, and every door is shut but one." }
    ] },
    // Verbs this world adds
    { add: "word", verb: "tune", words: ["tune", "tune in", "adjust"], object: "required", reply: "That does not tune." },
    { add: "word", verb: "whistle", words: ["whistle", "pipe"], object: "none", reply: "You whistle. Nothing answers." },
    { add: "word", verb: "intone", words: ["intone", "recite"], speech: true, reply: "You intone, and the room takes no notice." },
    { add: "word", verb: "summon", words: ["summon", "page"], absent: true, reply: "Nobody comes." },
    { add: "word", verb: "shake", words: ["shake", "rattle"], object: "required", reply: "It does not shake." },
    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(visionPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    // Conditions: drunk (seconds, doses), poisoned (turns, hurts), cold (seconds, until, hurts), warm (turns, heals).
    { add: "condition", id: "drunk", doses: 3, lasts: { seconds: [60, 90] }, starts: "You're drunk", ends: "You're sober again", status: "You're drunk on beer",
      filters: ["sway", "ghost"], speech: { slur: true, answer: "\"Come again?\" they say, to your slur." },
      movement: { chance: 0.3, says: ["Your feet take you another way than the one you meant.", "You set off one way, and the room turns you round."] } },
    { add: "condition", id: "poisoned", lasts: { turns: [8, 10] }, starts: "You're poisoned", ends: "The poison passes", status: "You're poisoned",
      filters: ["tint:poison"], health: { every: { turns: [3, 3] }, hurt: 1, says: ["The poison turns over in you.", "Your stomach clenches round the poison."] } },
    { add: "condition", id: "cold", lasts: { seconds: [40, 60] }, until: [{ "player.at": "tb-hub" }], starts: "You're cold", ends: "You're warm again", status: "You're cold to the bone",
      filters: ["tint:cold"], health: { every: { seconds: [25, 35] }, hurt: 1, says: "The cold bites at your hands." } },
    { add: "condition", id: "warm", lasts: { turns: [6, 8] }, starts: "The warmth stays in your hands", ends: "Your hands are cold again", status: "The stove's warmth is still in your hands",
      health: { every: { turns: [3, 3] }, heal: 1, says: "The warmth reaches somewhere it was needed." } },
    { add: "music", ...music, levels },   // the music (music.js, shared by both languages; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule })),
    { add: "rule", rule: { id: "board_first", match: { verb: "examine", obj: "board" }, do: [{ say: "$board.examine" }] }, before: "board_status" }
  ]
};
