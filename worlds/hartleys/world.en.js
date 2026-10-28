// "Hartley's, After Hours": a world after the opening, in English, written the way the AI is asked to write a world
// (WRITING-DIRECTION.md for the voice, GUIDE.md for the shape, ARCHITECTURE.md §3–6 for the data, ART-DIRECTION.md
// for the pictures). One change set, applied after the opening, all or nothing.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Hartley's, After Hours",
  blurb: "The old department store, a little before closing. After a certain hour everything costs a memory, and on the fourth floor they sell missed afternoons.",
  thumbnail: { picture: "front_hall", x: 48 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0–95)
  synopsis: "You find yourself in Hartley's, the old department store, on a Saturday a little before closing. " +
    "Hartley's sells everything, and after a certain hour the price of everything is a memory. On the fourth " +
    "floor, by appointment only, it sells afternoons: the ones people missed.",
  tone: "WRITING-DIRECTION.md. Department-store manners: mahogany, brass, floorwalkers, cash railways, a store that " +
    "has never quite managed to close.",
  start: "Saturday, 17:10, on the ground floor.",
  opening: "The arcade behind the store, at ten to five: a bag of peppermints (to begin again), a wireless (hints), a " +
    "shopping list you already carry (why you came). The revolving door is the way in.",
  rules: [
    "Everything at Hartley's has a price, and the price is a memory.",
    "Payment goes to the cash office by tube, and only by tube.",
    "The mannequins move only while nobody is looking at them.",
    "Hartley's closes at six and never empties: a customer who stays too long becomes part of the display."
  ],
  endings: [
    "The afternoon: pay with a memory you have and try on the afternoon you missed. You go into it, and the one you had is gone.",
    "Kept: take the memory up to the roof garden and let it out. Hartley's has nothing to sell you after that.",
    "The window: stay too long (tension). In the morning you're in the front window, with a price on your sleeve."
  ],
  chaos: 0.3
};

// ---- Helpers (they read like the rules' own words) -----------------------------------------------------------------
const at = (...rooms) => ({ "player.at": rooms.length > 1 ? { in: rooms } : rooms[0] });
const holding = (id) => ({ [id + ".at"]: "player" });
const tension = (n) => (n > 0 ? { unsettle: 1 } : { calm: 1 });   // one step of your mood (tension 0–5: INTERFACE.md §6c)
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  afternoon: { alt: "Through the window of a bus, wound down: a bright sea along the horizon, a green verge going by, and an elbow resting on the sill.", picture: endings.afternoon },
  kept: { alt: "A roof garden at dusk, seen from low down among the chimneys. A small bottle stands open, and a tall pale-gold column of light rises from it far above the roofs.", picture: endings.kept },
  window: { alt: "The front window of a department store at first light, seen from the pavement. Three figures stand in it, still: two mannequins, and between them you, in a coat a little warmer than yours, with a small red price tag on the sleeve.", picture: endings.window },
  died: { alt: "The ceiling of the store, seen from the floor: a bundle of pneumatic tubes running away to a single yellow lamp, and the edge of your shoes at the bottom of the picture.", picture: endings.died }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "store" (x grows east, y grows south, z is the floor: -1 the basement, 0 the ground floor, up to 3, the roof).
// Area "fourth": the fourth floor, reached only by the lift.
const rooms = {
  // The opening (GUIDE.md §8): the arcade behind the store, shut at both ends, never returned to. Area "arcade" is its own.
  pavement: {
    name: "THE ARCADE", area: "arcade", at: [0, 0, 0],
    describe: [
      "The arcade behind Hartley's, at ten to five on a Saturday: a tiled passage under a glass roof, shuttered behind you. Every window along it is lit, and the dresses in them have turned a little towards you. The air smells of wet umbrellas.",
      "The only way in is the {revolving door|street_door}, to the north."
    ],
    exits: { n: true },
    scenery: [
      { words: ["window", "windows", "glass", "display", "dresses", "dress"], name: "the windows", says: "Dresses on stands, in colours from before you were born, each turned a few degrees towards you. The ones at the back are turned a few degrees more." },
      { words: ["sill", "sills", "ledge"], name: "the sill", says: "A stone sill, wide enough for a bag of peppermints, worn smooth by people who stopped to look at dresses and then didn't leave." },
      { words: ["arcade", "passage", "roof", "tiles", "floor", "shutter", "street"], name: "the arcade", says: "Wet tiles, though it hasn't rained, and a glass roof with the last of the light in it. The shutter behind you has no handle, and the street beyond it is somebody else's Saturday." }
    ],
    mentions: ["windows", "dresses", "sill", "revolving door"],
    ambience: { lines: ["In the nearest window a dress has changed its hands, and is looking at the glass as if it hadn't.", "Something heavy is wheeled past on the far side of the shutter, and nobody apologises.", "Somewhere inside, someone laughs at a price.", "The wireless on the sill finds a station, loses it, and apologises."], every: [30, 70] },
    alt: "A glass-roofed arcade at dusk, seen from its floor and shut at both ends: lit windows full of dresses along both walls, a revolving door in the blind end wall, a lamp beside it.",
    overlayAlt: {
      wireless: "A small cream wireless sits on the sill.",
      mints: "A paper bag of peppermints sits on the sill."
    }
  },
  front_hall: {
    name: "HARTLEY'S", area: "store", at: [1, 1, 0],
    describe: [
      "The ground floor of Hartley's, all mahogany and brass, as it has been since your grandmother was measured for her first coat. You are standing on the mosaic by the {directory} board, as if you had always been about to come in.",
      "The {revolving door|revolving_door} turns slowly on its own. {Mr Gage|gage}, the floorwalker, wears a carnation and watches everything. Perfumery is west, gloves east, the lifts north."
    ],
    exits: { w: "perfumery", e: "gloves", n: "lift_lobby", s: true },
    scenery: [{ words: ["mosaic", "mahogany", "brass", "counters", "ceiling", "chandelier"], name: "the hall", says: "A mosaic of a ship in full sail, worn through at the bow by a hundred years of people standing where you stand." }],
    mentions: ["mosaic", "directory", "revolving door", "Mr Gage", "carnation"],
    ambience: { lines: ["Somewhere a till rings, though nobody has bought anything.", "A cash canister goes overhead in its tube, hurrying, like a thought on its way to someone.", "The revolving door turns once, empty, and stops."], every: [45, 90] },
    alt: "A grand store hall: mahogany counters, brass, a mosaic floor of a ship. A directory board on a stand, a floorwalker with a carnation, and a revolving door at the front."
  },
  perfumery: {
    name: "PERFUMERY", area: "store", at: [0, 1, 0],
    describe: [
      "Counters of bottles lined up like a choir about to sing. Each bottle smells of a particular afternoon. {Madame Corre|corre} stands among them in white gloves.",
      "On the counter, a {tester} with a label in her own hand. The ground floor hall is east."
    ],
    exits: { e: "front_hall" },
    scenery: [{ words: ["bottles", "bottle", "counters", "counter", "choir", "perfume", "perfumes"], name: "the bottles", says: "Small bottles with handwritten labels: THE LAST DAY OF THE HOLIDAYS. A HOSPITAL CORRIDOR AT NIGHT. SNOW, BEFORE IT FALLS. They are not for sale. They are what Madame Corre makes things from." }],
    mentions: ["bottles", "Madame Corre", "gloves", "tester", "label", "counter"],
    smell: "Twenty afternoons at once, none of them yours, all of them nearly.",
    alt: "A perfume counter crowded with small bottles on glass shelves. A tall woman in white gloves stands behind it; a single tester bottle on the counter in front."
  },
  gloves: {
    name: "GLOVES", area: "store", at: [2, 1, 0],
    describe: [
      "Drawers of gloves to the ceiling, each pair asleep in tissue. A card on the counter says BACK IN FIVE MINUTES, in a hand that went out of fashion long ago.",
      "On the counter one {glove} lies alone, its fingers closed, the way a hand closes on something in a pocket. The ground floor hall is west."
    ],
    exits: { w: "front_hall" },
    scenery: [{ words: ["drawers", "drawer", "tissue", "pairs", "counter", "minutes", "sign"], name: "the drawers", says: "Every drawer is labelled with a size and a feeling: SEVEN AND A HALF, NERVOUS. EIGHT, FOR FUNERALS. The card on the counter has gone yellow waiting." }],
    mentions: ["drawers", "tissue", "glove", "counter"],
    alt: "A glove counter with tall walls of small wooden drawers. On the counter, one cream glove lying by itself, its fingers curled shut."
  },
  lift_lobby: {
    name: "THE LIFTS", area: "store", at: [1, 0, 0],
    describe: [
      "Brass lift doors under an {indicator} that points to floors nobody has asked for in years: B, G, 1, 2, 4.",
      "The lift is north, its gate open. Stairs go up to the first floor; steps go down to the basement. The hall is south."
    ],
    exits: { n: { to: "lift", in: true }, s: "front_hall", u: "first_landing", d: "basement" },
    scenery: [{ words: ["stairs", "staircase", "banister"], name: "the stairs", says: "A wide staircase with a mahogany banister, going up.", leads: "u" },
              { words: ["steps", "basement"], name: "the steps", says: "Stone steps going down to the basement, with a smell of soap coming up them.", leads: "d" },
              { words: ["doors", "gate", "lift"], name: "the lift doors", says: "Brass doors, and inside them a brass gate, folded open.", leads: "n" }],
    mentions: ["lift", "indicator", "stairs", "steps", "gate"],
    alt: "A lift lobby: brass doors with a folding gate open, a semicircular floor indicator above them, a staircase going up on one side and stone steps going down on the other."
  },
  lift: {
    name: "THE LIFT", area: "store", at: [1, -1, 0],
    describe: [
      "A lift like a small drawing room: a mirror, a velvet bench, a brass gate. {Mr Pell|pell} sits on his stool by the {lever|lift_lever} and looks at the ceiling, where the floors would be.",
      "The gate opens south, onto the lobby."
    ],
    exits: { s: { to: "lift_lobby", out: true }, u: true, d: false },
    scenery: [{ words: ["mirror", "bench", "velvet", "stool", "ceiling", "buttons", "button", "gate", "lift"], name: "the lift", says: "There are no buttons. There is Mr Pell, and the lever, and a small brass keyhole beside the number 4. The gate is folded open onto the lobby.", leads: "s" }],
    mentions: ["mirror", "bench", "gate", "Mr Pell", "stool", "lever"],
    alt: "Inside an old lift: a mirror, a red velvet bench, a folding brass gate, and a man in a uniform on a stool, one hand near a brass lever."
  },
  first_landing: {
    name: "FIRST FLOOR", area: "store", at: [1, 0, 1],
    describe: [
      "The first floor landing: a palm in a brass pot, and a carpet worn to the threads by people deciding which way to go.",
      "Haberdashery is west, toys east. The stairs go up and down."
    ],
    exits: { w: "haberdashery", e: "toys", u: "second_landing", d: "lift_lobby" },
    scenery: [{ words: ["palm", "pot", "carpet", "threads"], name: "the palm", says: "A palm that has been on the first floor longer than anyone. It leans towards the stairs, as if it were thinking of going." },
              { words: ["stairs", "staircase", "banister"], name: "the stairs", says: "Mahogany stairs, going up to the second floor and down to the ground." }],
    mentions: ["palm", "pot", "carpet", "stairs"],
    alt: "A wide landing with a worn red carpet, a palm in a brass pot, and stairs going up and down. Archways to the left and right."
  },
  haberdashery: {
    name: "HABERDASHERY", area: "store", at: [0, 0, 1],
    describe: [
      "Ribbons on reels, buttons in drawers, and a counter where {Miss Thimble|thimble} measures everything twice. Above her, the brass {tubes} of the cash railway go up into the ceiling.",
      "A {canister} waits in its cradle under a {handle}. The landing is east."
    ],
    exits: { e: "first_landing" },
    scenery: [{ words: ["ribbons", "ribbon", "reels", "reel", "buttons", "drawers", "counter", "tape"], name: "the ribbons", says: "Every colour, on reels, and a brass tape measure screwed to the edge of the counter, worn smooth in the first yard." }],
    mentions: ["ribbons", "buttons", "counter", "Miss Thimble", "tubes", "canister", "handle"],
    alt: "A haberdashery counter with reels of coloured ribbon and small drawers of buttons. A woman with a tape measure. Above her, brass tubes run up into the ceiling; a canister sits in a cradle below a handle."
  },
  toys: {
    name: "TOYS", area: "store", at: [2, 0, 1],
    describe: [
      "Rocking toys, toy soldiers, a train set going round a table in a loop that never gets anywhere. A {clockwork bear|bear} sits on a shelf, waiting to be wound.",
      "The landing is west."
    ],
    exits: { w: "first_landing" },
    scenery: [{ words: ["soldiers", "soldier", "train", "set", "table", "loop", "toys", "shelf", "shelves"], name: "the toys", says: "The soldiers stand in rows, facing the stairs. The train goes round. Nobody has bought a toy here since the children grew up." }],
    mentions: ["soldiers", "train set", "clockwork bear", "shelf"],
    alt: "A toy department: shelves of soldiers and rocking horses, a model train circling a table, and a small brown clockwork bear sitting on a shelf."
  },
  second_landing: {
    name: "SECOND FLOOR", area: "store", at: [1, 0, 2],
    describe: [
      "The second floor landing, quieter, with a smell of new carpet. A {door|roof_door} at the top of a short flight says ROOF GARDEN, CLOSED FOR THE WINTER. It has been closed for a great many winters.",
      "Furniture is west, coats east. The stairs go down."
    ],
    exits: { w: "furniture", e: "coats", d: "first_landing", u: true },
    scenery: [{ words: ["stairs", "staircase", "carpet"], name: "the stairs", says: "The main stairs go down to the first floor.", leads: "d" },
              { words: ["flight", "steps"], name: "the flight", says: "A short flight goes up to the roof door.", leads: "u" }],
    mentions: ["carpet", "door", "flight", "stairs"],
    alt: "A quiet landing with new carpet. A short flight of steps leads up to a painted door with a sign. Archways left and right."
  },
  furniture: {
    name: "FURNITURE", area: "store", at: [0, 0, 2],
    describe: [
      "Rooms without walls: a dining room, a bedroom, a parlour, each laid out for a family that hasn't arrived. The {sofa} in the parlour still keeps the shape of somebody.",
      "The landing is east; the tea room, west."
    ],
    exits: { e: "second_landing", w: "tea_room" },
    scenery: [{ words: ["rooms", "dining", "bedroom", "parlour", "table", "bed", "lamp", "family"], name: "the rooms", says: "Places laid at the table, a lamp on the bedside, slippers by the bed. Everything is waiting to be somebody's." }],
    mentions: ["dining room", "bedroom", "parlour", "sofa"],
    alt: "A furniture floor laid out as rooms with no walls: a dining table set for four, a bed with a lamp, and a deep sofa with a dent in its cushions."
  },
  tea_room: {
    name: "TEA ROOM", area: "store", at: [-1, 0, 2],
    describe: [
      "Twelve tables, palms, a trolley of cakes under silver domes. {Dot|dot}, the waitress, has poured the same pot of tea for the same empty table since the war.",
      "A window looks over the roofs of the town. Furniture is east."
    ],
    exits: { e: "furniture" },
    scenery: [{ words: ["tables", "table", "palms", "trolley", "cakes", "domes", "window", "roofs", "pot"], name: "the tea room", says: "From the window, the roofs of the town go away in every direction. Above the store, a roof garden nobody visits." }],
    mentions: ["tables", "palms", "trolley", "cakes", "Dot", "window", "roofs"],
    alt: "A tea room: small round tables with white cloths, potted palms, a cake trolley with silver domes, a waitress with a teapot, and a tall window onto rooftops."
  },
  coats: {
    name: "COATS", area: "store", at: [2, 0, 2],
    describe: [
      "Coats on rails, and coats on {mannequins}, the mannequins in a row facing the door. When you look away, they face you.",
      "One of them wears a coat exactly like yours, only a little warmer. The landing is west."
    ],
    exits: { w: "second_landing" },
    scenery: [{ words: ["rails", "rail", "coats", "hangers"], name: "the rails", says: "Coats for every weather, and one rail at the end for weathers that haven't been invented." }],
    mentions: ["rails", "mannequins", "coat"],
    ambience: { lines: ["Out of the corner of your eye, a mannequin lowers its hand.", "A hanger rings against a rail, once, though nobody is near it.", "The mannequins are exactly where they were. You are almost sure."], every: [40, 80] },
    alt: "A coat department: rails of coats and a row of pale mannequins in coats and hats, all facing the doorway."
  },
  basement: {
    name: "BASEMENT", area: "store", at: [1, 0, -1],
    describe: [
      "The basement: pans, brooms, a smell of soap. In the middle stands the cash office, a booth of brass and frosted panes where every tube in the store comes down.",
      "Inside, {Miss Ruth|ruth} sorts the canisters as they drop. The steps go up."
    ],
    exits: { u: "lift_lobby" },
    scenery: [{ words: ["pans", "brooms", "soap", "booth", "office", "panes", "tubes", "brass"], name: "the cash office", says: "A brass booth with frosted panes and a small sign: ALL PAYMENTS BY TUBE. The tubes from every floor come down into it like the roots of something." },
              { words: ["steps", "stairs"], name: "the steps", says: "Stone steps going up to the lifts.", leads: "u" }],
    mentions: ["pans", "brooms", "cash office", "Miss Ruth", "steps", "panes"],
    alt: "A basement of shelves with pans and brooms. In the middle, a brass booth with frosted panes, tubes coming down into its roof from above, a woman's shape inside."
  },
  roof_garden: {
    name: "ROOF GARDEN", area: "store", at: [1, 0, 3],
    describe: [
      "Gravel, bare roses in tubs, and a {bench|roof_bench} facing the town. The roofs go away in every direction, the chimneys standing about like people waiting for a bus.",
      "Nobody has sat here since the garden closed. The door to the stairs is below."
    ],
    exits: { d: "second_landing" },
    scenery: [{ words: ["gravel", "roses", "rose", "tubs", "roofs", "chimneys", "town", "sky"], name: "the roofs", says: "Slate and chimneys, the gasworks, the spire. From up here the town looks like something you could fold and put away." },
              { words: ["door", "stairs"], name: "the door", says: "The roof door, open, and the stairs down.", leads: "d" }],
    mentions: ["gravel", "roses", "tubs", "bench", "roofs", "chimneys", "door"],
    alt: "A rooftop garden: gravel, bare rose bushes in tubs, a wooden bench facing a skyline of roofs and chimneys under a dark blue sky."
  },
  fourth_floor: {
    name: "THE FOURTH FLOOR", area: "fourth", at: [0, 0, 4],
    describe: [
      "A long room of rails, and on the rails, afternoons, hung like coats, each with a label in a careful hand. A rainy one in a grey that would suit you. A blue one that smells of the sea.",
      "Under its own lamp hangs the {afternoon} you didn't go. {The fitter|fitter} waits with pins in her mouth. The lift is south."
    ],
    exits: { s: { to: "lift", in: true } },
    scenery: [{ words: ["rails", "rail", "afternoons", "labels", "label", "grey", "blue", "lamp"], name: "the afternoons", says: "AUGUST 1958, THE FAIR. A SUNDAY, NOT VISITING. THE BUS NOT TAKEN. Each one cut to fit somebody, and none of them collected." }],
    mentions: ["rails", "afternoons", "label", "afternoon", "fitter", "lamp"],
    alt: "A long dim room of clothes rails hung with soft shapes of different colours, like coats made of weather. At the end, one hangs under a lamp, and a woman with a pincushion waits beside it."
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------
const objects = {
  // The opening: the two things to take, the one you carry, and the way in (BRIEF.md §3).
  mints: { at: "pavement", portable: true, name: "Bag of peppermints", note: "Take one to begin again.", actions: ["Take peppermints", "Eat peppermint"], heldActions: ["Eat peppermint", "Examine peppermints"],
    words: { nouns: ["peppermints", "peppermint", "mints", "mint", "bag", "sweets"], adj: ["paper", "striped"] }, ...item("mints"),
    here: "On the sill of the nearest window sits a paper bag of {peppermints|mints}.",
    examine: "A striped paper bag, twisted shut at the top. Inside, peppermints, each in its own wrapper, each still warm from a hand. The bag is never lighter." },
  wireless: { at: "pavement", portable: true, name: "Wireless", note: "Reading out the departments.", actions: ["Take wireless", "Listen to wireless"], heldActions: ["Listen to wireless", "Examine wireless"],
    words: { nouns: ["wireless", "radio"], adj: ["cream", "small"] }, ...item("wireless"),
    here: "Beside it a small {wireless} murmurs to itself.",
    examine: "A cream wireless the size of a loaf, tuned between two stations. A woman's voice reads out the departments of Hartley's, one floor at a time, and starts again at the top." },
  shopping_list: { at: "player", portable: true, name: "Shopping list", note: "Mostly rubbed out.", actions: ["Read list"], heldActions: ["Read list"],
    words: { nouns: ["list"], adj: ["shopping", "pencil", "folded"] }, ...item("shopping_list"),
    examine: "In your own pencil: \"Something I should remember.\" Under it, rubbed out so often the paper has worn through, a second line." },
  street_door: { at: "pavement", scenery: true, name: "Revolving door", note: "Turning, with nobody in it.", actions: ["Examine door", "Enter door"],
    words: { nouns: ["door"], adj: ["revolving", "brass", "front"] },
    examine: "Brass and glass, turning slowly with nobody in it. Each pane shows a slightly later afternoon than the one before." },

  // Ground floor
  directory: { at: "front_hall", scenery: true, name: "Directory", note: "Every floor, in gold.", actions: ["Read directory"], opens: ["fourth", "roof"],
    words: { nouns: ["directory", "board", "stand"], adj: ["store", "gold"] },
    examine: "Gold letters on black: BASEMENT, HOUSEHOLD AND CASH OFFICE. GROUND, PERFUMERY, GLOVES. FIRST, HABERDASHERY, TOYS. SECOND, FURNITURE, COATS, TEA ROOM. ROOF GARDEN (CLOSED). FOURTH, LOST AFTERNOONS, BY APPOINTMENT. Between SECOND and FOURTH there is nothing, and nobody has ever asked." },
  indicator: { at: "lift_lobby", scenery: true, name: "Indicator", note: "B to 4.", actions: ["Examine indicator"], opens: ["fourth"],
    words: { nouns: ["indicator", "arrow", "letters", "dial"], adj: ["floor", "brass"] },
    examine: "A brass half-moon with an arrow: B, G, 1, 2, and then, after a gap, 4. The arrow rests on 4, and has for years. Under the 4, engraved: LOST AFTERNOONS. BY APPOINTMENT." },
  revolving_door: { at: "front_hall", scenery: true, name: "Revolving door", note: "Turning on its own.", actions: ["Push revolving door"],
    words: { nouns: ["door", "doors"], adj: ["revolving", "front", "turning"] },
    examine: "Four leaves of mahogany and bevelled panes, turning slowly. Through it, the arcade is the colour of tea.",
    push: "You push. The door turns you all the way round and sets you down inside again, a little more politely than before. Hartley's doesn't let its customers go without something." },
  gage: { at: "front_hall", scenery: true, name: "Mr Gage", note: "The floorwalker.", actions: ["Talk to Mr Gage"],
    words: { nouns: ["gage", "floorwalker", "man", "carnation"], adj: ["mr", "mister"] },
    examine: "A tall man in a morning coat with a carnation that has been fresh for thirty years. He looks at you the way he looks at stock.",
    talk: ["\"Is madam being served?\" he says, and then, looking again, \"Is sir?\" He settles on neither. \"Everything has a price at Hartley's. Do look around.\"", "\"We close at six,\" he says. \"We have never quite managed to be closed.\""],
    topics: {
      fourth: { label: "the fourth floor", words: ["fourth", "afternoons", "appointment", "appointments"], says: "\"Lost afternoons. By appointment. The cash office issues appointments; payment by tube, from haberdashery.\"" },
      roof: { about: "roof_door", label: "the roof garden", words: ["roof", "garden", "winter"], says: "\"Closed for the winter. The key went to Gloves to be mended and never came back. Gloves keep things.\"" },
      price: { label: "prices", words: ["price", "prices", "pay", "money", "memory", "memories"], says: "\"Before six, the usual. After six, a memory.\" He consults his watch. \"Near enough six.\"" },
      closing: { open: true, label: "closing time", words: ["closing", "close", "six", "time", "leave", "leaving"], says: "\"Six o'clock. Customers who stay on are put somewhere useful. The windows, mostly.\"" },
      default: "\"I'm sure I couldn't say,\" he says, \"and I'm sure it's in stock.\""
    } },

  // Perfumery
  corre: { at: "perfumery", scenery: true, name: "Madame Corre", note: "Perfumer. White gloves.", actions: ["Talk to Madame Corre"],
    words: { nouns: ["corre", "perfumer", "woman", "madame"], adj: ["madame"] },
    examine: "A tall woman with her hair up like a question. Her white gloves have never touched anything that didn't want to be touched.",
    parts: [{ words: ["gloves", "hair"], name: "her gloves", says: "White gloves, buttoned at the wrist. She takes them off for nobody." }], mentions: ["gloves"],
    talk: "\"Smell the tester,\" she says. \"I bottle what you remember. It is the only thing anyone here will take as payment.\"",
    topics: {
      tester: { about: "tester", label: "the tester", words: ["tester", "perfume", "smell", "bottle"], says: "\"Number seven. It reminds everyone of something they had. One each; memories are not samples.\"" },
      price: { label: "prices", words: ["price", "prices", "pay", "payment", "money", "memory", "memories"], says: "\"Everything at Hartley's is paid for with something you remember. The cash office is not sentimental.\"" },
      keeping: { about: "memory", label: "keeping it", words: ["keep", "keeping", "free", "roof", "high", "open", "uncork"], says: "\"You could keep it, of course. Take it somewhere high, under the sky, and let it out. Then it is yours for good, and nobody can sell it to you again.\"" },
      default: "She lifts a bottle, smells it, and puts it back. \"No,\" she says. \"Not that.\""
    } },
  tester: { at: "perfumery", scenery: true, name: "Tester", note: "No. 7.", actions: ["Smell tester", "Read label"], opens: ["price"],
    words: { nouns: ["tester", "label", "atomiser", "atomizer", "spray"], adj: ["perfume", "number", "seven"] },
    examine: "A crystal tester with a rubber bulb. The label says: NO. 7. AN AFTERNOON INDOORS. And below, smaller: PRICE ON REQUEST." },
  memory: { at: null, portable: true, name: "Memory", note: "An afternoon, stoppered.", actions: ["Examine memory"], heldActions: ["Smell memory", "Open memory"],
    words: { nouns: ["memory", "bottle", "phial", "stopper", "cork"], adj: ["small", "little", "stoppered", "my"] }, ...item("memory"),
    here: "A small stoppered {bottle|memory} stands here, with an afternoon in it.",
    examine: "A little bottle stoppered with cork. Inside, very small, rain on a kitchen window and someone you loved, asleep in a chair. It is warm to hold.",
    smell: "Rain, toast, a radio in the next room. You had that afternoon. You had forgotten you had it." },

  // Gloves
  glove: { at: "gloves", scenery: true, name: "Glove", note: "Holding something.", actions: ["Examine glove", "Shake glove"],
    words: { nouns: ["glove", "fingers"], adj: ["cream", "lone", "single", "kid"] },
    examine: "A cream kid glove, a left one, with its fingers closed around something. It is warm, like a hand that has just been holding another.",
    take: "It won't be carried. It would rather be held." },
  roof_key: { at: null, portable: true, name: "Roof key", note: "Long, brass, mended.", actions: ["Examine roof key"],
    words: { nouns: ["key", "latchkey"], adj: ["roof", "brass", "long", "mended"] }, ...item("roof_key"),
    here: "A long brass {key|roof_key} lies here, labelled ROOF.",
    examine: "A long brass key with a paper label: ROOF. MENDED. It has been mended so carefully that it's hard to say where." },

  // The lift
  pell: { at: "lift", scenery: true, name: "Mr Pell", note: "The lift man.", actions: ["Talk to Mr Pell"],
    words: { nouns: ["pell", "man", "operator", "liftman", "attendant"], adj: ["mr", "mister", "lift"] },
    examine: "A small man in a maroon uniform with a stripe down each leg. He has taken the lift up and down for so long he no longer believes in stairs.",
    talk: "\"Fourth floor only,\" says Mr Pell. \"Stairs for the rest. By appointment.\"",
    topics: {
      fourth: { label: "the fourth floor", words: ["fourth", "afternoons", "appointment", "up"], says: "\"Lost afternoons. You'll want an appointment ticket. Payment by tube, from haberdashery, and the cash office sends one back.\"" },
      lift: { open: true, label: "the lift", words: ["lift", "elevator", "lever", "floors", "floor"], says: "\"She only goes to the fourth,\" he says, patting the lever. \"She doesn't care for the other floors. Neither do I.\"" },
      default: "\"Couldn't tell you,\" says Mr Pell. \"I'm only ever between floors.\""
    } },
  lift_lever: { at: "lift", scenery: true, name: "Lever", note: "Mr Pell's.", actions: ["Examine lever"],
    words: { nouns: ["lever", "handle"], adj: ["brass", "lift"] },
    examine: "A brass lever in a half-moon of numbers. The 4 has a keyhole beside it instead of a notch.",
    pull: "Mr Pell puts his hand over yours, kindly, and takes it off the lever. \"Mine,\" he says." },

  // Haberdashery
  thimble: { at: "haberdashery", scenery: true, name: "Miss Thimble", note: "Measures twice.", actions: ["Talk to Miss Thimble"],
    words: { nouns: ["thimble", "woman", "haberdasher", "assistant"], adj: ["miss"] },
    examine: "A small woman with a tape measure round her neck and pins along her lapel in order of size.",
    talk: "\"Measure twice, pay once,\" says Miss Thimble. \"Payments go up the tube.\"",
    topics: {
      tubes: { about: "tubes", label: "the tubes", words: ["tube", "tubes", "railway", "canister", "handle", "payment", "pay"], says: "\"Put your payment in the canister, pull the handle, and the cash office does the rest. Mind your fingers in the tubes. They're greedy.\"" },
      fourth: { label: "the fourth floor", words: ["fourth", "afternoons", "appointment"], says: "\"Afternoons? That's the fourth. They'll want paying first.\"" },
      default: "\"We don't stock that,\" she says, \"but I can measure you for it.\""
    } },
  tubes: { at: "haberdashery", scenery: true, name: "Tubes", note: "The cash railway.", actions: ["Examine tubes"],
    words: { nouns: ["tubes", "tube", "railway", "pipes"], adj: ["brass", "cash", "pneumatic"] },
    examine: "Brass tubes, polished by the air rushing through them. Every now and then one breathes in, hard, and the whole floor hears it." },
  canister: { at: "haberdashery", scenery: true, container: true, open: true, name: "Canister", note: "In its cradle.", actions: ["Examine canister", "Pull handle"],
    words: { nouns: ["canister", "cylinder", "cradle", "carrier"], adj: ["brass", "cash"] },
    examine: "A brass canister with felt at each end, open, waiting for something to carry. It has been to the cash office and back more times than anyone has been anywhere." },
  handle: { at: "haberdashery", scenery: true, name: "Handle", note: "Sends the canister.", actions: ["Pull handle"],
    words: { nouns: ["handle", "chain", "pull"], adj: ["brass", "wooden"] },
    examine: "A wooden handle on a brass chain, with a little enamel sign: PULL TO SEND." },

  // Toys
  bear: { at: "toys", scenery: true, name: "Clockwork bear", note: "Waiting to be wound.", actions: ["Wind bear"],
    words: { nouns: ["bear", "teddy", "clockwork", "toy"], adj: ["clockwork", "brown", "small"] },
    examine: "A brown clockwork bear with a winding handle in its back and one ear sewn on again in the wrong colour. Its eyes are buttons, and they have seen a great deal of the first floor." },

  // Second floor
  roof_door: { at: "second_landing", scenery: true, name: "Roof door", note: "Closed for the winter.", actions: ["Examine door", "Unlock door"], opens: ["roof"],
    words: { nouns: ["door", "sign"], adj: ["roof", "garden", "painted"] },
    examine: "A painted door at the top of a short flight. ROOF GARDEN, CLOSED FOR THE WINTER. Locked; the keyhole is long and brass-coloured, as if it missed something.",
    locked: true, lock: { key: "roof_key", says: "Locked. The keyhole wants a long brass key.", opens: "The long key turns as if it had never been away. The door opens on cold air and the smell of the town.", then: "roof_open" } },
  sofa: { at: "furniture", scenery: true, name: "Sofa", note: "Keeps somebody's shape.", actions: ["Sit on sofa"], enterable: "on",
    words: { nouns: ["sofa", "settee", "couch", "cushions", "dent"], adj: ["deep", "parlour"] },
    examine: "A deep sofa in faded green. The dent in its cushions is the shape of someone sitting with their feet tucked under them, reading.",
    enter: "You sit. The dent fits you nearly, the way a borrowed coat fits. From here the store sounds very far away." },
  dot: { at: "tea_room", scenery: true, name: "Dot", note: "The waitress.", actions: ["Talk to Dot", "Order tea"],
    words: { nouns: ["dot", "waitress", "woman"], adj: [] },
    examine: "A waitress in a black dress and a white cap, with a teapot she has never once put down.",
    talk: "\"Tea?\" says Dot. \"There's always tea.\"",
    topics: {
      tea: { open: true, words: ["tea", "pot", "cup", "cake", "cakes"], says: "\"One pot each,\" says Dot. \"Any more and you'd stop noticing it.\"" },
      afternoon: { about: "fourth", label: "afternoons", words: ["afternoon", "afternoons", "fourth", "missed"], says: "\"Mine was a Thursday in 1961. I didn't go to the dance.\" She pours. \"If I had it back I'd not buy it. I'd take it up on the roof and let it out, like a bird.\"" },
      roof: { about: "roof_door", label: "the roof garden", words: ["roof", "garden"], says: "\"Lovely up there, before they closed it. You could let anything go, up there.\"" },
      default: "\"I just do the tea,\" says Dot."
    } },
  tea: { at: null, portable: false, name: "Pot of tea", note: "Hot.", actions: ["Drink tea"],
    words: { nouns: ["tea", "pot", "teapot", "cup"], adj: [] },
    examine: "A small pot of tea and a cup with a rose on it. It smells of the four o'clocks of your childhood." },
  mannequins: { at: "coats", scenery: true, name: "Mannequins", note: "Facing the door. Mostly.", actions: ["Examine mannequins", "Search coat"], opens: ["fourth", "price"],
    words: { nouns: ["mannequins", "mannequin", "figures", "coat"], adj: ["pale", "warmer"], pl: true },
    examine: "Pale figures in coats and hats. The one in a coat like yours has a ticket pinned to its sleeve: FOURTH FLOOR. PAID FOR IN FULL, BY TUBE. Its pocket is buttoned.",
    search: "In the pocket of the coat like yours, a note in pencil: \"Haberdashery. Canister, then the handle. Pay with what you have. It is worth it, they say.\" The handwriting is yours.",
    parts: [{ words: ["sleeve", "pocket", "note", "hats", "hat", "pin"], name: "the coat", says: "The coat like yours. Its pocket is buttoned, and something crackles in it." },
            { words: ["ticket"], name: "the ticket on the sleeve", says: "FOURTH FLOOR. PAID FOR IN FULL, BY TUBE. Pinned on, the way they pin a price." }], mentions: ["sleeve", "pocket", "hats", "ticket"] },

  // Basement
  ruth: { at: "basement", scenery: true, name: "Miss Ruth", note: "The cash office.", actions: ["Talk to Miss Ruth"],
    words: { nouns: ["ruth", "cashier", "woman", "shape"], adj: ["miss"] },
    examine: "A shape behind frosted panes, quick and neat, catching canisters as they fall and sending them back up with change.",
    talk: "Miss Ruth can't hear you through the panes. She points, without looking up, at the sign: ALL PAYMENTS BY TUBE.",
    give: "There's no gap in the booth for that. She taps the sign: ALL PAYMENTS BY TUBE." },

  // Roof
  roof_bench: { at: "roof_garden", scenery: true, name: "Bench", note: "Facing the town.", actions: ["Sit on bench"], enterable: "on",
    words: { nouns: ["bench", "seat"], adj: ["wooden", "garden"] },
    examine: "A wooden bench with a brass plate: FOR THOSE WHO HAD ENOUGH. The slats are warm, though nobody has sat here for years." },

  // Fourth floor
  afternoon: { at: "fourth_floor", scenery: true, name: "The afternoon you didn't go", note: "Your size.", actions: ["Examine afternoon", "Wear afternoon"],
    words: { nouns: ["afternoon", "one"], adj: ["missed", "your", "lamp"] },
    examine: "Soft as an old coat, the colour of a bus window in June. The label says: THE SEA. YOU STAYED IN. It smells of salt and of someone calling your name from the top of a beach.",
    take: "\"Try it on,\" says the fitter, round her pins. \"Afternoons aren't for carrying.\"" },
  fitter: { at: "fourth_floor", scenery: true, name: "The fitter", note: "Pins in her mouth.", actions: ["Talk to the fitter"],
    words: { nouns: ["fitter", "woman", "seamstress", "tailor"], adj: [] },
    examine: "A woman in a grey smock with a pincushion on her wrist and a mouthful of pins. She has altered afternoons for every size of regret.",
    talk: "\"Paid for,\" she says, round the pins. \"Try it on. It'll take you in at the waist.\"",
    topics: {
      afternoon: { about: "afternoon", label: "the afternoon", words: ["afternoon", "sea", "missed", "bus"], says: "\"It's been waiting for you. They do. Put it on, and you'll be in it, and the other one, the one you paid with, won't trouble you again.\"" },
      price: { label: "the price", words: ["price", "paid", "memory", "payment", "cost"], says: "\"An afternoon for an afternoon,\" she says. \"Fair's fair. Hartley's always is.\"" },
      default: "She takes a pin out of her mouth to answer, thinks better of it, and puts it back."
    } }
};

// ---- Named changes ---------------------------------------------------------------------------------------------------
const changes = {
  roof_open: [
    { connect: "second_landing", dir: "u", to: "roof_garden" },
    { set: "roof_door.examine", to: "The roof door, open. Cold air comes down the flight, and the sound of the town." },
    { draw: "second_landing", restyle: [{ id: "roof_door", fill: 0 }] }
  ],
  // The endings
  afternoon_ending: [
    { say: "You put it on. It fits as if it had been waiting, which it had. The fitter takes it in at the shoulders, and the fourth floor goes thin as tissue." },
    { say: "It is June, years ago, and you are on the bus to the sea after all, with the window down. Somewhere a version of you stays in, in a kitchen, with the rain, and never finds out. You don't think of them again. You can't." },
    { end: true, picture: "afternoon" }
  ],
  kept_ending: [
    { move: "memory", to: null },
    { say: "You pull the cork. The afternoon comes out all at once: a kitchen, rain on the window, a radio in the next room, someone you loved asleep in a chair. It goes up over the roofs and stays, the way smoke stays on a still evening." },
    { say: "Below you the store goes on selling. It has nothing to sell you now. Somewhere far behind you, [way] opens again, and you find you know the way." },
    { end: true, picture: "kept" }
  ],
  window_ending: [
    { say: "The lights go out floor by floor, from the top, like a building closing its eyes. Mr Gage comes round with his book. He counts the mannequins. He counts you." },
    { say: "In the morning the window dressers find you standing in the front window, between two mannequins, in a coat a little warmer than yours, with a price on your sleeve. People stop to look. Somewhere far behind you, [way] closes, softly." },
    { end: true, picture: "window" }
  ]
};

// ---- Rules -----------------------------------------------------------------------------------------------------------
const rules = [
  // The revolving door: it won't let you out.
  { id: "front_door", match: { verb: ["go", "enter"], obj: [null, "revolving_door"] }, if: [at("front_hall"), { "$exit": { in: [true, null] } }],
    do: [{ say: "You step into the revolving door. It turns you all the way round and sets you down inside again. Hartley's doesn't let its customers go without something." }] },

  // The tester: a memory, bottled, once.
  { id: "smell_tester", match: { verb: ["smell", "use", "push"], obj: "tester", obj2: [null] }, if: [{ "memory.at": null }], once: true,
    do: [{ say: "You press the bulb. Rain on a kitchen window. Toast. A radio in the next room, and someone you loved asleep in a chair, on an afternoon you had forgotten you had." },
         { say: "Madame Corre holds a little bottle under your nose, and the afternoon goes into it. She corks it and gives it to you. \"Payment,\" she says. \"Or not. That is up to you.\"" },
         { move: "memory", to: "player" }, tension(-5)] },
  { id: "smell_tester_again", match: { verb: ["smell", "use", "push"], obj: "tester", obj2: [null] },
    do: [{ say: "Madame Corre caps the tester with one gloved finger. \"One each,\" she says. \"Memories are not samples.\"" }] },

  // The cash railway: put the payment in the canister, pull the handle.
  { id: "put_canister", match: { verb: "put", obj2: "canister" }, if: [at("haberdashery"), { "$obj.at": "player" }],
    do: [{ move: "$obj", to: "canister" }, { say: "You put it in the canister. The canister approves." }] },
  { id: "send_memory", match: { verb: ["pull", "use", "send"], obj: ["handle", "canister", "memory"] }, if: [at("haberdashery"), { "memory.at": "canister" }],
    do: [{ say: "You pull the handle. The tube breathes in, hard, and the canister is gone, up into the ceiling, with a sound like a word swallowed." },
         { say: "A moment later it drops back into its cradle with a thump. Inside, a pink appointment ticket, and no memory. You take the ticket. You can't, for the moment, remember what it cost." },
         { move: "memory", to: null }, { move: "lift_ticket", to: "player" }] },
  { id: "send_other", match: { verb: ["pull", "use", "send"], obj: ["handle", "canister"], obj2: [null] }, if: [at("haberdashery")],
    do: [{ say: "The canister goes up the tube and comes straight back with whatever was in it, and a slip: PAYMENT NOT ACCEPTED. MEMORIES ONLY." }] },
  { id: "send_away", match: { verb: "send" },
    do: [{ say: "Payments go by tube, from the canister in haberdashery." }] },

  // The tubes: warned, then hurt.
  { id: "tubes_warn", match: { verb: ["enter", "touch", "climb"], obj: "tubes" }, once: true,
    do: [{ say: "You reach up to the tube. It breathes in and takes hold of your sleeve like a child wanting to show you something, hard. Miss Thimble raps the counter. \"Not with your hands, dear. It takes fingers.\" You get your sleeve back." }, tension(10)] },
  { id: "tubes_hurt", match: { verb: ["enter", "touch", "climb"], obj: "tubes" },
    do: [{ say: "You put your hand up the tube. It takes the whole arm, to the shoulder, and then thinks better of it and lets go." }, { hurt: 2, says: "The tube had your arm for a moment." }, tension(15)] },

  // The glove: a handshake, and the roof key.
  { id: "shake_glove", match: { verb: ["shake", "touch"], obj: "glove" }, if: [{ "roof_key.at": null }], once: true,
    do: [{ say: "You take the glove's hand. It holds on, warm, for a long moment, the way someone does at a station. Then its fingers open, and there is a long brass key in your palm." },
         { move: "roof_key", to: "player" }, tension(-5)] },
  { id: "shake_glove_again", match: { verb: ["shake", "touch"], obj: "glove" },
    do: [{ say: "The glove holds your hand a little longer than it needs to, then lets go." }] },

  // The roof door keeps the stairs shut until it's unlocked.
  { id: "roof_shut", match: { verb: "go", dir: "u" }, if: [at("second_landing"), { "roof_door.locked": true }],
    do: [{ say: "You go up the short flight to the roof door. Locked. The keyhole wants a long brass key." }] },

  // The lift: the fourth floor, with an appointment ticket.
  { id: "lift_up", match: { verb: ["show", "give"], obj: "lift_ticket", obj2: [null, "pell"] }, if: [at("lift"), holding("lift_ticket")],
    do: [{ say: "Mr Pell reads the ticket, punches it, and gives it back. \"The fourth,\" he says. He puts the lever over. The lift goes up for longer than the store is tall." },
         { travel: "fourth_floor" }, { describe: "$here" }] },
  { id: "lift_go_up", match: { verb: "go", dir: "u" }, if: [at("lift"), holding("lift_ticket")],
    do: [{ say: "Mr Pell holds out his hand for your ticket, and punches it. \"The fourth.\" The lift goes up for longer than the store is tall." },
         { travel: "fourth_floor" }, { describe: "$here" }] },
  { id: "lift_lever_up", match: { verb: ["push", "pull", "use"], obj: "lift_lever", obj2: [null] }, if: [at("lift"), holding("lift_ticket")],
    do: [{ say: "Mr Pell holds out his hand for your ticket, and punches it. \"The fourth.\" He puts the lever over. The lift goes up for longer than the store is tall." },
         { travel: "fourth_floor" }, { describe: "$here" }] },
  { id: "lift_no_ticket_go", match: { verb: "go", dir: "u" }, if: [at("lift")],
    do: [{ say: "Mr Pell taps the keyhole by the 4. \"By appointment,\" he says. \"Payment by tube, from haberdashery.\"" }] },
  { id: "lift_no_ticket", match: { verb: ["push", "pull", "use", "show", "give"], obj: ["lift_lever", "pell"] }, if: [at("lift"), { "lift_ticket.at": { "!=": "player" } }],
    do: [{ say: "Mr Pell taps the keyhole by the 4. \"By appointment,\" he says. \"Payment by tube, from haberdashery.\"" }] },
  { id: "lift_down", match: { verb: "go", dir: "s" }, if: [at("fourth_floor")],
    do: [{ say: "Mr Pell takes you down without a word, which is his way of being kind." }, { travel: "lift" }, { describe: "$here" }] },

  // The fourth floor: the afternoon you didn't go.
  { id: "wear_afternoon", match: { verb: ["wear", "enter", "use"], obj: "afternoon", obj2: [null] }, if: [at("fourth_floor")],
    do: [{ change: "afternoon_ending" }] },

  // The memory: let out somewhere high, under the sky.
  { id: "keep_memory", match: { verb: ["open", "use", "drink", "pull"], obj: "memory", obj2: [null] }, if: [at("roof_garden"), holding("memory")],
    do: [{ change: "kept_ending" }] },
  { id: "keep_memory_not_here", match: { verb: ["open", "use", "drink", "pull"], obj: "memory", obj2: [null] }, if: [holding("memory")],
    do: [{ say: "You put your thumb to the cork, and stop. Not here, under a ceiling. It wants somewhere high, with sky." }] },

  // The bear: wound, it says what the first floor has seen.
  { id: "wind_bear", match: { verb: ["turn", "use", "push"], obj: "bear", obj2: [null] },
    do: [{ say: ["You wind the bear. It walks to the edge of the shelf and says, in a voice like a music box running down: \"The glove in Gloves is holding the roof key. It only lets go for a handshake.\"",
                 "You wind the bear. It nods three times and says: \"Afternoons on the fourth. Pay by tube. Everybody pays with the one they liked.\"",
                 "You wind the bear. \"The roof,\" it says. \"Somewhere high. Things let out up there stay out.\" It sits down, pleased."] }] },

  // Tea: once, and it steadies you.
  { id: "order_tea", match: { verb: ["order", "ask"], obj: [null, "tea", "dot"] }, if: [at("tea_room"), { "$topic": { in: [null, "tea"] } }, { "tea.at": null }], once: true,
    do: [{ say: "Dot pours, without asking, into a {cup|tea} with a rose on it, and sets it in front of you. \"On the house,\" she says. \"Tea always is. It's the house that costs.\"" }, { move: "tea", to: "tea_room" }] },
  { id: "tea_once", match: { verb: ["order", "ask"], obj: [null, "tea", "dot"] }, if: [at("tea_room"), { "$topic": { in: [null, "tea"] } }],
    do: [{ say: "\"One pot each,\" says Dot. \"Any more and you'd stop noticing it.\"" }] },
  { id: "drink_tea", match: { verb: "drink", obj: "tea" }, if: [{ "tea.at": "tea_room" }],
    do: [{ say: "It is exactly as strong as you like it, which nobody has known for years. The store goes quiet around the cup." }, { move: "tea", to: null }, tension(-15)] },

  // Closing time, at six: said everywhere, and the waiting gets heavier.
  { id: "closing_bell", when: "at", at: "18:00",
    do: [{ say: "A bell rings three times, somewhere in the walls. \"Hartley's is now closed,\" says a voice from every ceiling. \"Customers are asked to make their way to the doors.\" Nobody does." }, tension(10)] },

  // Tension: the longer you stay, the more you belong to the store; warned twice, then the window.
  { id: "tension_rises", when: "every", every: { turns: [10, 10] }, do: [{ unsettle: 1 }] },
  { id: "tension_warn", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 3 } }], once: true,
    do: [{ say: "Somewhere above you, the lights on a floor go out. Mr Gage's voice, quite close: \"Customers who stay on are put somewhere useful.\"" }] },
  { id: "tension_last", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 4 } }, { "game.storeLastWarned": { "!=": true } }],
    do: [{ say: "You catch yourself standing very still, the way the mannequins do. A cup of tea, a sit down, anything that isn't waiting, might help." }, { set: "game.storeLastWarned", to: true }] },
  { id: "tension_end", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 5 } }, { "game.storeLastWarned": true }],
    do: [{ change: "window_ending" }] }
];

// ---- Puzzles (for the checker; GUIDE.md §3) ---------------------------------------------------------------------------
const puzzles = {
  get_memory: { where: "perfumery", needs: [], solve: ["smell tester"], gives: ["memory"], clues: ["tester", "corre", "gage"],
    hints: ["Madame Corre bottles what you remember, if you smell her tester.", "Smell the tester in perfumery."] },
  pay_by_tube: { where: "haberdashery", needs: ["memory"], solve: ["put memory in canister", "pull handle"], gives: ["lift_ticket"], clues: ["thimble", "mannequins", "ruth", "pell"],
    hints: ["Payment goes to the cash office by tube, from the canister in haberdashery.", "Put the memory in the canister, then pull the handle."] },
  ride_up: { where: "lift", needs: ["lift_ticket"], solve: ["show ticket to Pell"], reaches: "fourth_floor", clues: ["pell", "directory", "gage"],
    hints: ["Mr Pell only goes to the fourth, and only by appointment.", "In the lift, show Mr Pell your ticket."] },
  try_on: { where: "fourth_floor", needs: ["ride_up"], solve: ["wear afternoon"], ending: true, clues: ["fitter", "afternoon"],
    hints: ["The fitter has it ready, in your size.", "Wear the afternoon."] },
  get_roof_key: { where: "gloves", needs: [], solve: ["shake glove"], gives: ["roof_key"], clues: ["glove", "gage", "bear"],
    hints: ["The glove in Gloves is holding something for whoever greets it properly.", "Shake the glove."] },
  open_roof: { where: "second_landing", needs: ["roof_key"], solve: ["unlock door", "up"], reaches: "roof_garden", clues: ["roof_door", "directory", "dot"],
    hints: ["The roof door on the second floor wants a long brass key.", "Unlock the roof door, then go up."] },
  let_it_out: { where: "roof_garden", needs: ["memory", "open_roof"], solve: ["open memory"], ending: true, clues: ["corre", "dot", "bear"],
    hints: ["Madame Corre said a memory let out somewhere high stays yours.", "On the roof, open the memory."] }
};

// ---- The change set -----------------------------------------------------------------------------------------------------
// ---- The opening, declared (BRIEF.md §3): the ids of its room and four things, and the lines it says --------------------
const opening = {
  room: "pavement", restart: "mints", hints: "wireless", intro: "shopping_list", way: "street_door",
  lines: {
    notYet: "The door turns past you without a gap in it. Customers with empty hands are asked to wait, and there is a bag and a wireless on the sill.",
    notYetRestart: "The door turns past you without a gap in it. You have nothing to begin again with, and there is a bag of peppermints on the sill.",
    notYetHints: "The door turns past you without a gap in it. You have nothing to listen to, and there is a wireless on the sill.",
    through: "The next pane comes round with a gap in it, and you step into the gap, and ride it round, and step out into the store. Behind you the arcade goes on being a Saturday.",
    askRestart: "Put a peppermint in your mouth and begin again?",
    restartYes: "You unwrap a peppermint and put it on your tongue. It tastes of every time you were handed one. The windows go dark, one by one, and…",
    restartNo: "You twist the bag shut and keep it. Not yet.",
    hintFrame: "The wireless goes quiet between two departments, and a voice, quite kindly, says:",
    farewell: "You fold the list once, and it keeps folding, smaller, until you are holding nothing, carefully."
  }
};

export default {
  because: "After the opening: a department store at closing time.",
  opening,
  // The properties this world's rules keep (ARCHITECTURE.md §3, "Fields and properties"); the engine's own aren't declared.
  properties: {
    "game.storeLastWarned": { type: "boolean", start: false }   // the last warning from the store: the end waits for it
  },
  facts: [
    "The player arrives in Hartley's department store on a Saturday, a little before it closes at six.",
    "At Hartley's the price of everything is a memory, paid by tube to the cash office.",
    "The fourth floor sells missed afternoons, by appointment."
  ],
  effects: [
    { time: "day 1 16:50", weekday: "sat" },                  // the opening is played at ten to five
    // Where the opening's way on leads, and what arriving does: the store's time and its first line.
    { set: "game.entrance", to: "front_hall" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:10", weekday: "sat" },
      { say: "A voice from the ceiling, kind and very tired, says that Hartley's will be closing at six." }
    ] },
    { set: "game.moods", to: [
      { below: 1, text: "Just browsing" }, { below: 2, text: "Being served" }, { below: 3, text: "Undecided" },
      { below: 4, text: "Overstaying" }, { below: 6, text: "On display" }
    ] },
    // Verbs this world needs
    { add: "word", verb: "shake", words: ["shake", "shake hands with", "hold hands with"] },
    { add: "word", verb: "order", words: ["order"], absent: true },
    { add: "word", verb: "send", words: ["send", "dispatch"] },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    { add: "object", id: "lift_ticket", at: null, portable: true, name: "Appointment ticket", note: "Fourth floor.", actions: ["Examine ticket"], heldActions: ["Examine ticket", "Show ticket to Pell"],
      words: { nouns: ["ticket", "appointment"], adj: ["pink", "appointment", "lift"] }, ...item("lift_ticket"),
      here: "A pink {ticket|lift_ticket} lies here.",
      examine: "A pink ticket: HARTLEY'S. FOURTH FLOOR. ONE APPOINTMENT. PAID. On the back, in the cash office's hand: ONE AFTERNOON, INDOORS, WITH RAIN." },
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
