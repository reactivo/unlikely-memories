// "The Train to Tuesday": a world after the opening, in English, written the way the AI is asked to write a world
// (WRITING-DIRECTION.md for the voice, GUIDE.md for the shape, ARCHITECTURE.md §3–6 for the data, ART-DIRECTION.md
// for the pictures). One change set, applied after the opening, all or nothing.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Train to Tuesday",
  blurb: "A hill town that abolished Mondays. Every night at twenty to midnight a train leaves for Tuesday, and nobody comes back.",
  thumbnail: { picture: "halt", x: 95 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0–95)
  synopsis: "You arrive, from wherever the opening was, on a Sunday evening, in a hill town " +
    "that abolished Mondays years ago. Every night at twenty to midnight a train leaves for Tuesday, and nobody comes " +
    "back. Upstairs at the town hall, someone has kept the last Monday, in case.",
  tone: "WRITING-DIRECTION.md. Railway-town melancholy: timetables, lost things, a decree framed in the station.",
  start: "Sunday, 19:30, in the station's lost property office.",
  opening: "A halt on a branch line, Sunday evening: a travel alarm (to begin again), a cocoa tin on a string (hints), a " +
    "diary leaf you already carry (why you came). The one carriage's open door is the way on.",
  rules: [
    "Monday was abolished by decree. The town goes from Sunday night to Tuesday by train.",
    "Whatever is left in the lost property office waits for whoever can say whose it is.",
    "The station clock is honest. The town keeps its hours by it.",
    "Going back is possible once: the clockmaker's backwards clock gives you yesterday, and takes something for it."
  ],
  endings: [
    "Tuesday: take the 23:40 with a ticket bought with an old coin. You skip your Monday, and every Monday after.",
    "Monday: give the archivist something you lost on your last Monday; put the Monday back on the station calendar. The town wakes to a Monday, and so do you, at your desk.",
    "Sunday: let the waiting grow too long (tension). The way you came closes and it stays Sunday, for you, for good."
  ],
  chaos: 0.3
};

// ---- Helpers (they read like the rules' own words) -----------------------------------------------------------------
const at = (...rooms) => ({ "player.at": rooms.length > 1 ? { in: rooms } : rooms[0] });
const holding = (id) => ({ [id + ".at"]: "player" });
const notAsking = { "$topic": null };
const hours = (from, to) => ({ "time.hour": { between: [from, to] } });
const notHours = (from, to) => ({ "time.hour": { between: [to, from] } });   // the other hours of the day
const tension = (n) => (n > 0 ? { unsettle: 1 } : { calm: 1 });   // one step of your mood (tension 0–5: INTERFACE.md §6c)
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- Texts that change ---------------------------------------------------------------------------------------------
const squareDusk = [
  "The station square, cobbled, with a {fountain} in the middle and a statue of the {Minister|statue} who abolished Mondays. The lamps are not lit yet. A lamplighter's ladder leans against the first one.",
  "North, the station. West, the Hotel Terminus. East, the café, its windows yellow. The high street goes south."
];
const squareNight = [
  "The station square, cobbled, with a {fountain} in the middle and a statue of the {Minister|statue} who abolished Mondays. The lamps are lit, and so is the little lamp under the water.",
  "North, the station. West, the Hotel Terminus. East, the café. The high street goes south."
];
const squareDay = [
  "The station square, cobbled, with a {fountain} in the middle and a statue of the {Minister|statue} who abolished Mondays. Pigeons stand on his hat in shifts.",
  "North, the station. West, the Hotel Terminus. East, the café. The high street goes south."
];

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  tuesday: { alt: "Through a train window: a dark tunnel rushing past in rings, and at the far end a growing white-and-yellow light. In the glass, faint, your own face.", picture: endings.tuesday },
  monday: { alt: "Close up, a tear-off calendar on a brown wall. Its top page has a wide red band and a torn lower edge, with a few grey lines of print. At the calendar's right edge, the round face of a clock.", picture: endings.monday },
  sunday: { alt: "Far away across an empty plain, a small railway station and its clock tower stand under a pale, flat sky. Two rails run to it. Nothing moves. The clock's hands are stopped.", picture: endings.sunday },
  died: { alt: "The railway track and the platform edge seen from far above: two rails across brown sleepers, a pale platform with a yellow line, a red signal lamp, and a tiny figure lying by the edge as bright lights come down the line from the top of the picture.", picture: endings.died }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "town" (x grows east, y grows south, z is the floor); area "train" is reached only when the train is in.
const rooms = {
  // The opening (GUIDE.md §8): a halt on the branch line, never returned to. Area "branch" is its own.
  halt: {
    name: "MONDAY HALT", area: "branch", at: [0, 0, 0],
    describe: [
      "A halt on the branch line, on a Sunday evening: a bench, a lamp, and a name board that says \"Monday\", though the line goes nowhere after it. The timetable lists one train a week, and it left yesterday.",
      "A single carriage waits at the end of the platform, its {carriage door|carriage_door} open and its light on, to the east."
    ],
    exits: { e: true },
    scenery: [
      { words: ["bench", "seat", "lamp", "platform", "halt", "board", "name", "sign"], name: "the halt", says: "A bench, a lamp, a name board. Somebody has painted the bench since the line closed, and not very long ago." },
      { words: ["timetable", "train", "line", "track", "tracks", "rails"], name: "the timetable", says: "One train, weekly, to a place whose name has been scratched off the board and written back in pencil: Tuesday." }
    ],
    mentions: ["bench", "lamp", "name board", "timetable", "carriage door"],
    ambience: { lines: ["The lamp over the bench hums a note and holds it.", "A telegraph wire ticks, once, like a clock deciding.", "Very far down the line, something that is not a train sounds its whistle and thinks better of it.", "The name board turns a little in the wind, and turns back."], every: [30, 70] },
    alt: "A small railway halt at dusk: a platform with a bench and a lamp, a name board, and a single lit carriage at the end with its door open.",
    overlayAlt: {
      alarm: "A brass travel alarm sits on the bench.",
      tin: "A cocoa tin sits on the bench, a string running from it off the platform."
    }
  },
  lost_property: {
    name: "LOST PROPERTY", area: "town", at: [0, 0, 0],
    describe: [
      "A long room of shelves: umbrellas, gloves, a birdcage, a wedding dress in a box, every label in the same patient hand. You are standing among them, as if someone had handed you in.",
      "Behind the counter, {Mr Ambrose|ambrose} keeps the {ledger}. A damp {crate|sea_crate} says SEA, ONE, UNCLAIMED. The station hall is east."
    ],
    exits: { e: "station_hall" },
    scenery: [{ words: ["shelves", "shelf", "umbrellas", "gloves", "birdcage", "dress", "wedding", "box", "labels", "label"], name: "the shelves", says: "Things people stopped looking for. Each has a label, and each label a date. None of the dates is a Monday after the decree." },
              { words: ["counter"], name: "the counter", says: "A long counter, scarred where a century of claimants have leaned." }],
    mentions: ["shelves", "birdcage", "counter", "Mr Ambrose", "ledger", "crate"],
    alt: "A long room of shelves crowded with umbrellas, boxes and a birdcage. A counter with a ledger and an old clerk; a damp crate by the wall."
  },
  station_hall: {
    name: "STATION HALL", area: "town", at: [1, 0, 0],
    describe: [
      "A tiled hall under a glass roof. The station {clock|station_clock} says [time]. Below it, a {tear-off calendar|calendar} and, framed, the {decree}.",
      "The {ticket window|window} has a brass grille and a shutter. The {timetable} takes up a whole wall and lists one train.",
      "The platform is north, the square south. Lost property is west; the waiting room, east."
    ],
    exits: { n: "platform", s: { to: "square", out: true }, w: "lost_property", e: "waiting_room" },
    waitFor: { time: "next 21:00", says: "You wait under the clock. It is honest about every minute.", if: [hours(6, 21)] },
    scenery: [{ words: ["roof", "glass", "tiles", "tiled", "hall"], name: "the hall", says: "Green and cream tiles, and glass so high that the pigeons under it look like thoughts." }],
    mentions: ["clock", "calendar", "decree", "ticket window", "grille", "shutter", "timetable", "roof"],
    alt: "A station hall with green and cream tiles under a glass roof. A big clock with a calendar below it and a framed notice. A ticket window with a brass grille on the right; a timetable on the left wall."
  },
  waiting_room: {
    name: "WAITING ROOM", area: "town", at: [2, 0, 0],
    describe: [
      "Benches, a cold stove, and posters for resorts that have closed. In the corner, a {photo booth|booth} with its curtain drawn.",
      "On the bench nearest the stove, {Mrs Oduya|oduya} sits with her suitcase on her knees, as she has since the last Monday.",
      "The station hall is west."
    ],
    exits: { w: "station_hall" },
    scenery: [{ words: ["benches", "bench", "stove", "posters", "poster", "resorts"], name: "the waiting room", says: "The stove has been cold for a long time. The posters promise sea air, mountain air, any air but this." }],
    mentions: ["benches", "stove", "posters", "photo booth", "curtain", "Mrs Oduya", "suitcase"],
    alt: "A dim waiting room with wooden benches and a black stove. An old woman sits with a suitcase on her knees. A photo booth with a drawn curtain in the corner."
  },
  platform: {
    name: "PLATFORM 1", area: "town", at: [1, -1, 0],
    describe: [
      "One platform, one line, one {bench}. The rails run east into a tunnel and west past the signal box. The {timetable board|board} hangs from the canopy.",
      "The hall is south. The platform's end is east; the signal box, west."
    ],
    exits: { s: "station_hall", e: "platform_end", w: "signal_box", n: true },
    scenery: [{ words: ["rails", "line", "track", "tracks", "canopy", "tunnel"], name: "the line", says: "One line, polished by one train, going one way." },
              { words: ["box", "signalbox", "stilts"], name: "the signal box", says: "A wooden box on stilts, all windows, west along the platform. Someone inside is keeping an eye on the line." }],
    mentions: ["bench", "signal box", "timetable board", "rails", "canopy", "tunnel"],
    // Worth waiting for while the train isn't in; once it has been, the words change (train_out).
    waitFor: { time: "next 23:30", says: "You wait on the platform. The hours come round the way trains do, all at once.", if: [{ "train.at": { "!=": "platform" } }] },
    alt: "A single platform under an iron canopy, with a bench and a hanging timetable board. The rails curve east into a tunnel; a signal box stands to the west."
  },
  platform_end: {
    name: "PLATFORM END", area: "town", at: [2, -1, 0],
    describe: [
      "The platform ends in a slope and a sign with a man crossing out a man. The rails go on, east, into the {tunnel}. Warm air comes out of it, and a hum.",
      "The platform is west."
    ],
    exits: { w: "platform", e: true },
    scenery: [{ words: ["sign", "slope", "rails", "man"], name: "the sign", says: "No one may go further. The sign says it without words, which is how you know it means it." }],
    mentions: ["sign", "tunnel", "rails"],
    alt: "The end of a platform sloping down to the rails, which run into the dark mouth of a tunnel. A warning sign on a post."
  },
  signal_box: {
    name: "SIGNAL BOX", area: "town", at: [0, -1, 0],
    describe: [
      "A wooden box on stilts, all windows. A row of levers stands like a choir. The {signalman} keeps his hand on the one that matters and his eyes on the {diagram} of the line, which is a single stroke.",
      "The platform is east, down the steps."
    ],
    exits: { e: { to: "platform", out: true } },
    scenery: [{ words: ["levers", "lever", "windows", "window", "stilts", "steps"], name: "the levers", says: "Taller than you, polished at the grip, and not yours to pull." }],
    mentions: ["levers", "signalman", "diagram", "windows"],
    alt: "Inside a signal box: a row of tall levers, windows all round, a man in shirtsleeves with one hand on a lever, a diagram of a single line on the wall."
  },
  square: {
    name: "STATION SQUARE", area: "town", at: [1, 1, 0],
    describe: squareDusk,
    exits: { n: "station_hall", w: "hotel", e: { to: "cafe", if: hours(7, 22), closed: "The café is dark, the chairs up on the tables. A card on the door: 7 TO 22." }, s: "high_street" },
    scenery: [{ words: ["lamps", "lamp", "ladder", "cobbles", "pigeons", "hat", "lamplighter"], name: "the lamps", says: "Iron lamps with glass hats. Someone lights them at eight, and the one under the fountain's water too." }],
    mentions: ["fountain", "statue", "lamps", "ladder"],
    // Worth waiting for from seven in the morning until the lamps are lit at eight; from the first morning the words change (daybreak).
    waitFor: { time: "next 20:00", says: "You wait by the fountain while the light goes.", if: [hours(7, 20)] },
    alt: "A cobbled square at dusk: a round fountain with a statue of a man in a top hat, iron lamps not yet lit, a ladder against one. The station front to the north, a hotel to the left, a café with yellow windows to the right."
  },
  hotel: {
    name: "HOTEL TERMINUS", area: "town", at: [0, 1, 0],
    describe: [
      "A narrow lobby that smells of polish and boiled cabbage. Behind the desk, the {night porter|porter} reads yesterday's paper, which is always Saturday's.",
      "Stairs go up to the rooms. The square is east."
    ],
    exits: { e: { to: "square", out: true }, u: { to: "hotel_room", if: { "room_key.at": "player" },
      closed: "The porter clears his throat. \"Rooms are for guests,\" he says. \"Guests ask.\"" } },
    scenery: [{ words: ["desk", "paper", "newspaper", "lobby", "cabbage", "polish"], name: "the lobby", says: "Brass, polish, a bell nobody rings. The paper is Saturday's; on Sunday there's no paper, and there's no Monday." },
              { words: ["stairs", "staircase"], name: "the stairs", says: "Narrow stairs going up to the rooms.", leads: "u" }],
    mentions: ["night porter", "paper", "stairs", "desk"],
    alt: "A narrow hotel lobby with a wooden desk, a man reading a newspaper behind it, key hooks on the wall, and a staircase going up on the right."
  },
  hotel_room: {
    name: "ROOM 4", area: "town", at: [0, 1, 1],
    describe: [
      "A room with a {bed}, a washstand and a window on the rails. The bed has been turned down for someone who never comes up.",
      "The stairs go down to the lobby."
    ],
    exits: { d: "hotel" },
    scenery: [{ words: ["washstand", "window", "rails", "jug", "basin"], name: "the window", says: "From here you see the line, and the tunnel it disappears into. At night the tunnel breathes." },
              { words: ["stairs", "staircase"], name: "the stairs", says: "Narrow stairs going down to the lobby.", leads: "d" }],
    mentions: ["bed", "washstand", "window", "stairs"],
    alt: "A small hotel room: an iron bed turned down, a washstand with a jug, a window looking out on railway lines."
  },
  cafe: {
    name: "CAFÉ DOMINGO", area: "town", at: [2, 1, 0],
    describe: [
      "Six tables, a zinc counter, a radio playing the same waltz. {Inés|ines} wipes the counter in slow circles. A chalk {board|menu} lists what there is, which is coffee.",
      "The square is west."
    ],
    exits: { w: { to: "square", out: true } },
    scenery: [{ words: ["tables", "table", "counter", "zinc", "radio", "waltz", "chairs"], name: "the café", says: "The waltz ends and begins again without a pause, like a person who has never been interrupted." }],
    mentions: ["tables", "counter", "radio", "Inés", "board"],
    alt: "A small café with round tables, a zinc counter and a radio on a shelf. A woman wipes the counter. A chalk menu board on the wall. Warm yellow light."
  },
  high_street: {
    name: "HIGH STREET", area: "town", at: [1, 2, 0],
    describe: [
      "Shops with their shutters down: a draper's, a chemist's, a shop that sells only calendars. The town hall is west, with a brass {plate} by its door. The clockmaker's is east, and its window is full of different times.",
      "The square is north. The park is south."
    ],
    exits: { n: "square", w: { to: "town_hall", if: hours(9, 17), closed: "The doors are shut. The brass plate gives the hours: nine to five." }, e: "clock_shop", s: "park" },
    scenery: [{ words: ["shops", "shutters", "draper", "drapers", "chemist", "chemists", "calendars", "calendar"], name: "the shops", says: "The calendar shop's window shows calendars with six days a week. They sell well." },
              { words: ["hall", "columns", "steps"], name: "the town hall", says: "Columns, steps, and doors that keep office hours. The brass plate gives them.", leads: "w" },
              { words: ["clockmakers", "clockmaker", "shop", "clocks", "window"], name: "the clockmaker's", says: "A window full of clocks, each showing a different time, and all of them right somewhere.", leads: "e" }],
    mentions: ["shops", "town hall", "plate", "clockmakers", "calendars"],
    waitFor: { time: "next 09:00", says: "You sit on the town hall steps. The night passes in no particular hurry. At nine a clerk unlocks the doors, looks at you, and decides not to ask.", if: [notHours(9, 17)] },
    alt: "A street of shuttered shops. On the left, a town hall with columns and a brass plate by the door; on the right, a clockmaker's window full of clock faces."
  },
  town_hall: {
    name: "TOWN HALL", area: "town", at: [0, 2, 0],
    describe: [
      "A marble hall with a counter for everything and nobody behind most of them. A sign points upstairs: ARCHIVE. Another points nowhere: COMPLAINTS.",
      "The high street is east."
    ],
    exits: { e: { to: "high_street", out: true }, u: "archive" },
    scenery: [{ words: ["stairs", "archive", "staircase"], name: "the stairs", says: "Marble stairs, worn in the middle, going up to the archive.", leads: "u" },
              { words: ["counter", "counters", "marble", "sign", "signs", "complaints"], name: "the counters", says: "Each counter has a bell and a small sign. MARRIAGES. DEATHS. WEATHER. The bell for COMPLAINTS has been taken away." }],
    mentions: ["counter", "sign", "archive"],
    alt: "A marble hall with a long row of empty counters, a staircase going up on the left, and two signs on stands."
  },
  archive: {
    name: "THE ARCHIVE", area: "town", at: [0, 2, 1],
    describe: [
      "Shelves of ledgers to the ceiling, and a smell of dust being kept on purpose. The {archivist} works at a desk under the only window, in a cardigan the colour of a filing cabinet.",
      "The stairs go down to the hall."
    ],
    exits: { d: "town_hall" },
    scenery: [{ words: ["shelves", "ledgers", "dust", "window", "desk"], name: "the shelves", says: "Every year of the town, bound, in order. The bindings skip one day a week, and the gaps have been taped." },
              { words: ["stairs", "staircase"], name: "the stairs", says: "Marble stairs going down to the hall.", leads: "d" }],
    mentions: ["shelves", "ledgers", "archivist", "desk", "window", "stairs"],
    alt: "A room of tall shelves full of bound ledgers. A woman in a grey cardigan at a desk under a window, a lamp beside her."
  },
  clock_shop: {
    name: "THE CLOCKMAKER'S", area: "town", at: [2, 2, 0],
    describe: [
      "Clocks on every wall, each keeping somebody's time, none of them yours. The {clockmaker} sits with a lens in one eye, mending a minute.",
      "On the counter stands a {clock|backwards_clock} that runs backwards. The high street is west."
    ],
    exits: { w: { to: "high_street", out: true } },
    scenery: [{ words: ["counter", "bench", "tweezers"], name: "the counter" },
              { words: ["clocks", "walls", "ticking", "lens", "faces"], name: "the clocks", says: "They tick at different speeds. Together they sound like rain that can't decide." }],
    mentions: ["clocks", "clockmaker", "lens", "backwards clock", "counter"],
    alt: "A small shop crowded with clocks of every size on the walls. An old man at a bench with a jeweller's lens; on the counter, one clock with its hands going the wrong way."
  },
  park: {
    name: "THE PARK", area: "town", at: [1, 3, 0],
    describe: [
      "Gravel paths, a bandstand with no band, and a hedge clipped into the shape of a week with a day missing.",
      "The high street is north. The chapel is west; the pond, east."
    ],
    exits: { n: "high_street", w: { to: "chapel", in: true }, e: "pond" },
    scenery: [
      { words: ["paths", "path", "gravel"], name: "the paths" },
      { words: ["bandstand", "band"], name: "the bandstand", says: "Music stands, folded. Someone has left a conductor's baton on the rail, pointing at nothing." },
      { words: ["hedge", "week", "day", "shape"], name: "the hedge", says: "Seven green blocks, then six. The gardener keeps the gap as carefully as the rest." }
    ],
    mentions: ["paths", "bandstand", "hedge"],
    ambience: { lines: ["An owl says one word and thinks better of the second.", "The gravel shifts, though no one is walking on it.", "Far off, in the tunnel, something hums a note and holds it."],
                if: [hours(20, 7)] },
    alt: "A small park: gravel paths, an empty round bandstand, a long hedge clipped into blocks with one gap. Trees behind."
  },
  chapel: {
    name: "THE CHAPEL", area: "town", at: [0, 3, 0],
    describe: [
      "A small chapel, cold, with a graveyard of plain {stones|gravestones} behind glass doors. Each stone bears a date and nothing else. All the dates are Mondays.",
      "The park is east."
    ],
    exits: { e: { to: "park", out: true } },
    scenery: [{ words: ["doors", "door", "glass", "chapel", "graveyard", "pews"], name: "the chapel", says: "Cold pews, a smell of wax. The glass doors to the graveyard are not locked; nobody visits." }],
    mentions: ["stones", "doors", "graveyard"],
    alt: "Inside a small cold chapel: plain pews and, through tall glass doors, a graveyard of identical small stones."
  },
  pond: {
    name: "THE POND", area: "town", at: [2, 3, 0],
    describe: [
      "A round {pond|pond_water} with a stone rim. The town hangs upside down in it, a little clearer than the real one.",
      "The park is west."
    ],
    exits: { w: "park" },
    scenery: [{ words: ["rim", "stone", "town", "reflection"], name: "the rim" }],
    mentions: ["pond", "rim", "town"],
    alt: "A round pond with a stone rim, reflecting rooftops and the station's clock tower upside down."
  },
  compartment: {
    name: "THE COMPARTMENT", area: "train", at: [0, 0, 0],
    describe: [
      "Six seats in green plush, a luggage rack, a {window|train_window} with a leather strap. A card on the wall says TUESDAY in letters worn soft by thumbs.",
      "The dining car is east. The platform is south, while the train is in."
    ],
    exits: { e: "dining_car", s: "platform" },
    scenery: [{ words: ["seats", "seat", "plush", "luggage", "rack", "card", "strap", "tuesday"], name: "the compartment", says: "The seats remember other people. The card says TUESDAY, and under it, smaller: NO RETURN TICKETS ISSUED." }],
    mentions: ["seats", "luggage rack", "window", "card", "strap"],
    waitFor: { time: "next 23:40", says: "You sit down. The seat is warm. Doors slam along the train, one after another, like a sentence finishing." },
    alt: "Inside a railway compartment: green plush seats, a luggage rack, a window with a leather strap, a small card on the wall."
  },
  dining_car: {
    name: "THE DINING CAR", area: "train", at: [1, 0, 0],
    describe: [
      "White tablecloths, a lamp on each table, and places laid for a meal that comes on Tuesday. The {guard} sits at the last table doing his sums.",
      "The compartment is west."
    ],
    exits: { w: "compartment" },
    scenery: [{ words: ["tablecloths", "tables", "table", "lamp", "lamps", "places", "cutlery"], name: "the tables", says: "Each place has a menu card. Under TUESDAY there is a list of dishes, and under MONDAY, a line." }],
    mentions: ["tablecloths", "lamp", "guard", "tables"],
    alt: "A railway dining car: white tablecloths, small lamps on each table, and a uniformed guard at the far end with a notebook."
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------
const objects = {
  // The opening: the two things to take, the one you carry, and the way on (BRIEF.md §3).
  alarm: { at: "halt", portable: true, name: "Travel alarm", note: "Wind it to begin again.", actions: ["Take alarm", "Wind alarm"], heldActions: ["Wind alarm", "Examine alarm"],
    words: { nouns: ["alarm", "bells"], adj: ["brass", "travel", "little"] }, ...item("alarm"),
    here: "On the bench sits a brass {travel alarm|alarm}, set for tomorrow.",
    examine: "A brass travel alarm, two small bells on top, a key at the back. It is set for tomorrow morning, and it has been tomorrow morning for some time." },
  tin: { at: "halt", portable: true, name: "Cocoa tin", note: "Someone at the other end.", actions: ["Take tin", "Listen to tin"], heldActions: ["Listen to tin", "Examine tin"],
    words: { nouns: ["tin", "string", "cocoa"], adj: ["cocoa", "cold", "long"] }, ...item("tin"),
    here: "Beside it a cocoa {tin} sends its string off the end of the platform.",
    examine: "A cocoa tin with a hole punched in the base and a length of string running out of it, along the platform and over the edge into the dark. The string is taut, as if something were on the other end." },
  diary_leaf: { at: "player", portable: true, name: "Diary leaf", note: "Ruled for a week.", actions: ["Read leaf"], heldActions: ["Read leaf"],
    words: { nouns: ["leaf", "diary"], adj: ["folded", "yellow", "ruled", "diary"] }, ...item("diary_leaf"),
    examine: "A diary leaf, ruled for a week. Sunday and Tuesday are filled in, in your hand; where Monday should be is a clean, careful gap, rubbed through to the next page." },
  carriage_door: { at: "halt", scenery: true, name: "Carriage door", note: "Open, and waiting.", actions: ["Examine door", "Enter carriage"],
    words: { nouns: ["door", "carriage"], adj: ["carriage", "open", "single"] },
    examine: "A green carriage, one only, with its door open and a step down to the gravel. The light inside is the yellow of a room where someone has just stood up." },

  // Lost property
  ambrose: { at: "lost_property", scenery: true, name: "Mr Ambrose", note: "The lost property clerk.", actions: ["Talk to Mr Ambrose"],
    words: { nouns: ["ambrose", "clerk", "man"], adj: ["mr", "mister", "old"] },
    examine: "A small man in sleeve protectors. He looks at you as though trying to remember where you were left.",
    talk: ["\"Lost something?\" he says. \"Everyone has. Say what, and I'll look in the book.\"", "\"Describe it,\" he says, \"and if it's yours it will know.\""],
    topics: {
      umbrella: { words: ["umbrella", "brolly"], says: "\"Grey umbrella,\" he reads. He looks at you. He looks at it." },
      you: { open: true, label: "myself", words: ["me", "myself", "arrival", "way"], says: "\"Came in this evening,\" he says. \"Nobody's claimed you yet. It happens.\"" },
      monday: { label: "Monday", words: ["monday", "mondays", "decree"], says: "\"We don't get Mondays any more. We get what was left in them.\" He taps the ledger." },
      sea: { about: "sea_crate", label: "crate", words: ["sea", "crate"], says: "\"Some fellow lost it years ago. It leaks. I keep a bucket under it on Thursdays.\"" },
      default: "He turns a page of the ledger, finds nothing, and turns it back."
    } },
  ledger: { at: "lost_property", scenery: true, name: "Ledger", note: "Everything lost, in order.", actions: ["Read ledger"], opens: ["monday", "umbrella"],
    words: { nouns: ["ledger", "book", "register"], adj: ["big", "black"] },
    examine: "Columns of lost things. Near the end, in the same patient hand: \"One umbrella, grey. Left on a Monday. Unclaimed.\" Beside it the owner's name has run in the rain, in handwriting that is yours.",
    parts: [{ words: ["columns", "hand", "entry", "entries"], name: "the entries" }], mentions: ["umbrella", "columns"] },
  umbrella: { at: "lost_property", portable: false, unnoticed: true, name: "Grey umbrella", note: "Yours, by the tag.", actions: ["Examine umbrella"], heldActions: ["Examine umbrella", "Give umbrella to archivist"],
    words: { nouns: ["umbrella", "brolly"], adj: ["grey", "gray"] }, ...item("umbrella"),
    examine: "A grey umbrella with a wooden handle and a paper tag. It smells of the last rain on the last Monday.",
    parts: [{ words: ["tag", "handle"], name: "the tag", says: "A name, run in the rain. In your handwriting, though you don't remember writing it." }], mentions: ["tag", "handle"] },
  sea_crate: { at: "lost_property", scenery: true, name: "Crate", note: "SEA, ONE, UNCLAIMED.", actions: ["Listen to crate", "Open crate"],
    words: { nouns: ["crate", "box", "sea"], adj: ["damp", "wet", "wooden"] },
    examine: "A wooden crate, stencilled SEA, ONE, UNCLAIMED. Water beads along its seams and runs, slowly, towards your feet.",
    listen: "Inside, very small, waves turn over in their sleep.",
    locked: true, lock: { says: "The lid is nailed down. Someone decided the sea should stay lost." },
    parts: [{ words: ["seams", "water", "lid", "nails", "stencil"], name: "the seams", says: "Salt water. It finds your feet every time, as if it had somewhere to be." }], mentions: ["seams", "water", "lid"] },

  // Station hall
  station_clock: { at: "station_hall", scenery: true, name: "Station clock", note: "Honest about every minute.", actions: ["Examine clock"],
    words: { nouns: ["clock"], adj: ["station", "big", "honest"] },
    examine: "A big plain clock. It says [time]. The town keeps its hours by it, and it keeps them well." },
  calendar: { at: "station_hall", scenery: true, name: "Calendar", note: "Torn off at Sunday.", actions: ["Examine calendar"], opens: ["monday"],
    words: { nouns: ["calendar", "stub", "pages"], adj: ["tear-off", "tear", "off"] },
    examine: "A tear-off calendar showing SUNDAY. Between Sunday's page and the next, Tuesday, there's a stub where a page was torn out, and a little paste, still sticky.",
    parts: [{ words: ["paste", "page"], name: "the stub", says: "Room for one page. The paste is still sticky, after all these years." }], mentions: ["stub", "paste"] },
  decree: { at: "station_hall", scenery: true, name: "Decree", note: "Framed, and signed.", actions: ["Read decree"], opens: ["monday"],
    words: { nouns: ["decree", "notice", "frame"], adj: ["framed"] },
    examine: "\"By order: Monday is abolished in this town, with effect from the next one. The last Monday shall be kept at the town hall, in case.\" Signed by the Minister, with a flourish that goes on too long.",
    parts: [{ words: ["flourish", "signature", "minister"], name: "the signature" }], mentions: ["signature"] },
  window: { at: "station_hall", scenery: true, name: "Ticket window", note: "Tickets from nine in the evening.", actions: ["Examine window", "Buy ticket"],
    words: { nouns: ["window", "grille", "shutter", "card"], adj: ["ticket", "booking", "brass"] },
    examine: "A brass grille, a shutter, and a card: TICKETS FROM 21:00. ONE FARE: ONE COIN. OLD CURRENCY ONLY.",
    mentions: ["grille", "shutter", "card"] },
  booking_clerk: { at: null, scenery: true, name: "Booking clerk", note: "Behind the grille.", actions: ["Buy ticket"],
    words: { nouns: ["clerk", "woman"], adj: ["booking", "ticket"] },
    examine: "A woman with a ticket punch and no expression to spare.",
    here: "The shutter is up. Behind the grille, the {booking clerk|booking_clerk} waits with her punch.",
    talk: "\"One fare, one coin,\" she says. \"The old sort. Tuesday's the only place we go.\"",
    topics: { coin: { about: "window", label: "coins", words: ["coin", "coins", "currency", "money", "fare"], says: "\"The old sort. They stopped making them when they stopped making Mondays. People threw them in the fountain on the square for luck.\"" },
              default: "\"Tickets,\" she says, as if that were the answer." } },
  timetable: { at: "station_hall", scenery: true, name: "Timetable", note: "One train.", actions: ["Read timetable"],
    words: { nouns: ["timetable", "wall"], adj: [] },
    examine: "A whole wall of timetable for one line: TUESDAY, DEPARTS 23:40, DAILY. The train comes in ten minutes before. Under RETURNS, someone has painted a neat dash." },

  // Waiting room
  booth: { at: "waiting_room", scenery: true, name: "Photo booth", note: "Curtain drawn.", actions: ["Enter booth"],
    words: { nouns: ["booth", "curtain", "photobooth"], adj: ["photo"] }, enterable: "in",
    enter: "You draw the curtain and sit on the little stool. There is a button, and a mirror that is a little behind you.",
    examine: "A photo booth with a stool and a red button. A notice says it develops TOMORROW'S photographs, NO REFUNDS.",
    parts: [{ words: ["stool", "mirror", "notice"], name: "the mirror", says: "Your face arrives in it a moment after you do." }],
    mentions: ["stool", "button", "notice"] },
  button: { at: "booth", scenery: true, name: "Button", note: "Red, worn pale.", actions: ["Push button"],
    words: { nouns: ["button"], adj: ["red"] }, examine: "A red button, worn pale in the middle." },
  photograph: { at: null, portable: true, name: "Photograph", note: "Tomorrow's, still wet.", actions: ["Examine photograph"],
    words: { nouns: ["photograph", "photo", "picture", "strip"], adj: ["wet"] }, ...item("photograph"),
    examine: "A strip of four photographs, still wet, in daylight: the town hall steps, then a woman in a grey cardigan upstairs at a window, holding up a calendar page that says MONDAY. In the last frame you are taking it." },
  oduya: { at: "waiting_room", scenery: true, name: "Mrs Oduya", note: "Waiting, with a suitcase.", actions: ["Talk to Mrs Oduya"],
    words: { nouns: ["oduya", "woman", "traveller", "lady", "suitcase"], adj: ["mrs", "old"] },
    examine: "A neat old woman in a hat with a feather that has given up. Her ticket is for the eight-twelve to Monday. It is very old.",
    talk: "\"I'm waiting for the eight-twelve,\" she says. \"It doesn't run any more. I'm very patient.\"",
    topics: {
      coin: { about: "window", label: "fares", words: ["coin", "coins", "money", "currency", "fare", "fares", "ticket"], says: "\"You'll want an old coin for a ticket. The fountain on the square is full of them. You can't see them until the lamp under the water comes on, at eight.\"" },
      monday: { label: "Monday", words: ["monday", "mondays", "decree"], says: "\"They kept the last one at the town hall, in case. In case of what, they never said. The archivist would know. Nine till five.\"" },
      train: { about: "timetable", words: ["train", "tuesday", "midnight"], says: "\"The Tuesday train. Twenty to midnight. Nobody comes back from Tuesday. I don't hold it against them.\"" },
      default: "\"Oh, I wouldn't know,\" she says. \"I've only been waiting.\""
    } },

  // Platform
  bench: { at: "platform", scenery: true, name: "Bench", note: "For waiting.", actions: ["Sit on bench"], opens: ["monday"],
    words: { nouns: ["bench", "seat"], adj: ["wooden"] }, enterable: "on",
    examine: "A bench with a brass plate: IN MEMORY OF MONDAY, WHO KEPT US BUSY.",
    parts: [{ words: ["plate"], name: "the plate", says: "IN MEMORY OF MONDAY, WHO KEPT US BUSY." }], mentions: ["plate"] },
  board: { at: "platform", scenery: true, name: "Timetable board", note: "One line.", actions: ["Read board"],
    words: { nouns: ["board"], adj: ["timetable", "hanging"] },
    examine: "TUESDAY, DEPARTS 23:40. The train is in ten minutes before. Passengers with tickets only." },
  train: { at: null, scenery: true, name: "Train", note: "For Tuesday.", actions: ["Board train"],
    words: { nouns: ["train", "carriage", "carriages", "engine"], adj: ["tuesday", "night"] }, enterable: "in",
    examine: "Three green carriages and an engine breathing steam in slow, deliberate breaths. Every window is lit. Nobody looks out.",
    here: "The {train} stands at the platform, breathing. North, its doors are open." },

  // Platform end
  tunnel: { at: "platform_end", scenery: true, name: "Tunnel", note: "Warm. Humming.", actions: ["Listen to tunnel"],
    words: { nouns: ["tunnel", "mouth", "dark"], adj: ["warm"] },
    examine: "Brick, and then nothing. The warm air smells of soot and something sweet, like a day you've been looking forward to.",
    listen: "A hum, low, patient. It sounds like a crowd saying a word it hasn't learned yet." },

  // Signal box
  signalman: { at: "signal_box", scenery: true, name: "Signalman", note: "Hand on the lever.", actions: ["Talk to signalman"],
    words: { nouns: ["signalman", "man"], adj: [] },
    examine: "Shirtsleeves, armbands, a moustache trained over many years. He doesn't take his hand off the lever.",
    talk: "\"Twenty to midnight,\" he says. \"Every night. I've never once let her go late.\"",
    topics: {
      train: { about: "board", words: ["train", "tuesday", "midnight"], says: "\"She's in at half past eleven and away at twenty to. You'll want a ticket. The guard's particular.\"" },
      tunnel: { words: ["tunnel", "dark", "line"], says: "\"Don't go in. Not when she's due. Not when she isn't, either.\"" },
      monday: { label: "Monday", words: ["monday", "mondays"], says: "\"There used to be the eight-twelve to Monday. I pulled the lever for it the last time myself.\" He looks at his hand." },
      default: "\"Not my line,\" he says. He means it kindly."
    } },
  diagram: { at: "signal_box", scenery: true, name: "Diagram", note: "A single stroke.", actions: ["Examine diagram"],
    words: { nouns: ["diagram", "map", "stroke"], adj: [] },
    examine: "The whole line, drawn on enamel: a single stroke from here to TUESDAY. A second stroke, to MONDAY, has been painted over in the same cream as the wall." },

  // Square
  fountain: { at: "square", scenery: true, name: "Fountain", note: "Coins in it.", actions: ["Examine fountain", "Take coin"],
    words: { nouns: ["fountain", "basin", "water"], adj: ["stone"] },
    examine: "A stone basin, the water still. Coins lie on the bottom, a currency nobody uses now. A little lamp is set into the floor of the basin.",
    parts: [{ words: ["lamp", "bottom"], name: "the lamp under the water", says: "A brass lamp in the floor of the basin. Lit at eight, with the others." }], mentions: ["coins", "lamp"] },
  coin: { at: "fountain", portable: true, name: "Old coin", note: "The old currency.", actions: ["Examine coin"], heldActions: ["Examine coin", "Buy ticket"],
    words: { nouns: ["coin", "coins", "money", "currency"], adj: ["old"] }, ...item("coin"),
    examine: "A heavy old coin. On one side, a profile with its eyes shut. On the other, the week, with all seven days." },
  statue: { at: "square", scenery: true, name: "Statue", note: "The Minister.", actions: ["Examine statue"],
    words: { nouns: ["statue", "minister"], adj: [] },
    examine: "The Minister who abolished Mondays, in bronze, one hand on his heart and the other holding a pen like a knife. On the plinth: HE GAVE US OUR SUNDAYS BACK.",
    parts: [{ words: ["plinth", "pen", "hand"], name: "the plinth" }], mentions: ["plinth", "pen"] },

  // Hotel
  porter: { at: "hotel", scenery: true, name: "Night porter", note: "Reading Saturday.", actions: ["Talk to porter"],
    words: { nouns: ["porter"], adj: ["night"] },
    examine: "A long man folded behind a short desk. He reads the same paper every night and is still surprised by it.",
    talk: "\"A room?\" he says, without looking up. \"Ask, then.\"",
    topics: {
      room: { open: true, label: "a room", words: ["room", "rooms", "key", "bed", "sleep"], says: "\"Number 4,\" he says." },
      train: { open: true, words: ["train", "tuesday"], says: "\"Guests go on the Tuesday train. They leave their luggage. It's all up in the attic.\"" },
      default: "\"Couldn't say,\" he says. \"Saturday's paper doesn't mention it.\""
    } },
  room_key: { at: null, portable: true, name: "Room key", note: "Number 4.", actions: ["Examine key"],
    words: { nouns: ["key"], adj: ["room", "hotel", "brass"] }, ...item("room_key"),
    examine: "A brass key on a wooden pear with a 4 burnt into it." },
  bed: { at: "hotel_room", scenery: true, name: "Bed", note: "Turned down.", actions: ["Sleep"],
    words: { nouns: ["bed", "sheets", "pillow"], adj: ["iron"] }, enterable: "on",
    examine: "An iron bed, turned down. The pillow is cool. Whoever it was turned down for has been expected for years." },

  // Café
  ines: { at: "cafe", scenery: true, name: "Inés", note: "Behind the counter.", actions: ["Talk to Inés", "Order coffee"],
    words: { nouns: ["ines", "waitress", "woman"], adj: [] },
    examine: "A woman with her sleeves rolled and a pencil behind each ear, in case one gives up.",
    talk: "\"Coffee?\" she says. It is the only question she asks.",
    topics: {
      monday: { label: "Monday", words: ["monday", "mondays", "archive", "archivist"], says: "\"The last Monday? Up at the town hall. Nine till five. The archivist won't give anything to anyone who can't prove they lost it.\"" },
      train: { open: true, words: ["train", "tuesday"], says: "\"People have their last coffee here,\" she says. \"Then they go. I wash the cup.\"" },
      coin: { about: "fountain", label: "coins", words: ["coin", "coins", "currency", "money"], says: "\"Old coins? In the fountain on the square. You'll see them when the water lamp comes on.\"" },
      coffee: { open: true, words: ["coffee", "cup", "drink"], says: "\"Coffee,\" she says." },
      default: "\"Coffee,\" she says. \"I'd know about coffee.\""
    } },
  menu: { at: "cafe", scenery: true, name: "Menu board", note: "Coffee, and nothing else.", actions: ["Read board"],
    words: { nouns: ["board", "menu", "chalk"], adj: ["menu", "chalk"] },
    examine: "In chalk: COFFEE. Under it, rubbed out but legible: CROISSANTS (MONDAYS ONLY)." },
  coffee: { at: null, portable: false, name: "Cup of coffee", note: "Hot, and free.", actions: ["Drink coffee"],
    words: { nouns: ["coffee", "cup"], adj: [] },
    examine: "Small, black, very hot. It smells of mornings you didn't have to get up for." },

  // High street, town hall, archive
  plate: { at: "high_street", scenery: true, name: "Brass plate", note: "Office hours.", actions: ["Read plate"], opens: ["monday"],
    words: { nouns: ["plate", "hours"], adj: ["brass", "office"] },
    examine: "TOWN HALL, OPEN 09:00 TO 17:00, ARCHIVE UPSTAIRS, CLOSED MONDAYS. The last line has been polished more than the others." },
  archivist: { at: "archive", scenery: true, name: "Archivist", note: "Keeps the last Monday.", actions: ["Talk to archivist"],
    words: { nouns: ["archivist", "woman"], adj: [] },
    examine: "A grey cardigan, half-moon glasses, and the patience of someone who files things alphabetically by feeling.",
    talk: "\"Yes?\" she says, which in the archive is a whole paragraph.",
    topics: {
      monday: { label: "Monday", words: ["monday", "mondays", "page", "decree", "last"], says: "\"The last Monday,\" she says. \"Kept, in case. It belongs to whoever lost one. Bring me something you lost on yours, and it's yours to put back.\"" },
      umbrella: { words: ["umbrella", "tag", "desk"], says: "\"Something you lost,\" she says. \"Not something you've heard about.\"" },
      default: "She looks it up, under a letter of her own choosing, and finds nothing."
    } },
  monday_page: { at: null, portable: true, name: "Monday", note: "The last one.", actions: ["Examine Monday"], heldActions: ["Examine Monday", "Put Monday on calendar"],
    words: { nouns: ["monday", "page"], adj: ["last", "calendar"] }, ...item("monday_page"),
    examine: "A calendar page: MONDAY, in black, with nothing written under it. It is heavier than paper should be. It is all still to do." },

  // Clockmaker's
  clockmaker: { at: "clock_shop", scenery: true, name: "Clockmaker", note: "Mending a minute.", actions: ["Talk to clockmaker"],
    words: { nouns: ["clockmaker", "man", "watchmaker"], adj: ["old"] },
    examine: "An old man with a lens screwed into one eye and a minute in his tweezers. It struggles a little.",
    talk: "\"Every clock here keeps somebody's time,\" he says. \"That one on the counter keeps yesterday's. Wind it, if you need one back.\"",
    topics: {
      clock: { about: "backwards_clock", words: ["clock", "backwards", "yesterday"], says: "\"Wind it and you'll have yesterday again. Only the day comes back. Whatever you did in it, you did.\"" },
      monday: { label: "Monday", words: ["monday", "mondays", "calendar"], says: "\"Put the page back where it was torn from,\" he says, \"and every clock in town will know what to do.\"" },
      default: "\"That's not a clock question,\" he says, and goes back to his minute."
    } },
  backwards_clock: { at: "clock_shop", scenery: true, name: "Backwards clock", note: "Yesterday's time.", actions: ["Wind clock"],
    words: { nouns: ["clock"], adj: ["backwards", "backward", "wrong"] },
    examine: "A brass carriage clock whose hands go round the wrong way, unhurried. A key sits in its back." },

  // Chapel, pond
  gravestones: { at: "chapel", scenery: true, name: "Stones", note: "All Mondays.", actions: ["Examine stones"], opens: ["monday"],
    words: { nouns: ["stones", "stone", "gravestones", "graves", "dates"], adj: ["plain"] },
    examine: "Small plain stones, each with a date, all Mondays. The newest says only: THE LAST ONE IS NOT HERE. KEPT AT THE TOWN HALL, IN CASE.",
    parts: [{ words: ["date", "newest"], name: "the newest stone", says: "THE LAST ONE IS NOT HERE. KEPT AT THE TOWN HALL, IN CASE." }], mentions: ["date"] },
  pond_water: { at: "pond", scenery: true, name: "Pond", note: "The town, upside down.", actions: ["Look in pond"],
    words: { nouns: ["pond", "water", "reflection"], adj: ["round"] },
    examine: "In the water the station clock is upside down and running the right way. On the calendar under it, in the reflection, there is a page between Sunday and Tuesday." },

  // The train
  train_window: { at: "compartment", scenery: true, name: "Window", note: "Leather strap.", actions: ["Look through window"],
    words: { nouns: ["window", "strap"], adj: ["leather", "train"] },
    examine: "Your face in the glass, and behind it the platform, and behind that the town, already looking smaller." },
  guard: { at: "dining_car", scenery: true, name: "Guard", note: "Doing sums.", actions: ["Talk to guard"],
    words: { nouns: ["guard", "conductor"], adj: [] },
    examine: "A guard in a coat with too many buttons, adding up a column that never ends.",
    talk: "\"Tickets,\" he says, and then, seeing yours, \"Ah. One way.\"",
    topics: {
      tuesday: { open: true, label: "Tuesday", words: ["tuesday", "train", "return", "back"], says: "\"Tuesday's lovely,\" he says. \"Nobody comes back. Nobody's ever written to say they wanted to.\"" },
      monday: { label: "Monday", words: ["monday", "mondays"], says: "He stops adding. \"We don't stop there,\" he says, and starts again from the top." },
      default: "\"Not on the timetable,\" he says."
    } }
};

// ---- Named changes ---------------------------------------------------------------------------------------------------
// Night and day reach every outdoor room: the square's text, the skies of the outdoor pictures.
// (and the sky through the windows of the signal box, the hotel room, the archive and the chapel)
const OUTDOOR_SKIES = { platform: "sky", platform_end: "sky", square: "sky", high_street: "sky", park: "sky", pond: "sky",
                        signal_box: "sky", hotel_room: "sky", archive: "sky", chapel: "sky" };
const sky = (top, bottom, h = 60) => ({ fade: [top, bottom], from: [0, 0], to: [0, h] });
const skies = (top, bottom) => Object.entries(OUTDOOR_SKIES).map(([room, id]) => ({ draw: room, restyle: [{ id, fill: sky(top, bottom) }] }));
const changes = {
  nightfall: [
    { set: "square.describe", to: squareNight },
    ...skies(0, 1),
    { draw: "pond", restyle: [{ id: "pond", fill: { fade: [0, 1], from: [0, 60], to: [0, 126] } }] },
    { draw: "station_hall", restyle: [{ id: "roof", fill: { mix: [1, 8], level: 0.6 } }] },
    { draw: "square", restyle: [{ id: "lamp_a", fill: 14 }, { id: "lamp_b", fill: 14 }, { id: "lamp_c", fill: 14 }, { id: "lamp_d", fill: 14 }, { id: "water_lamp", fill: { mix: [3, 11], level: 0.5 } }] }
  ],
  daybreak: [
    { set: "square.describe", to: squareDay }, { set: "square.waitFor.says", to: "You sit on the rim of the fountain and let the day go by. Late in the evening a man with a pole lights the lamps, and last of all the one under the water." },
    ...skies(9, 11),
    { draw: "pond", restyle: [{ id: "pond", fill: { fade: [9, 11], from: [0, 60], to: [0, 126] } }] },
    { draw: "station_hall", restyle: [{ id: "roof", fill: { mix: [11, 8], level: 0.6 } }] },
    { draw: "square", restyle: [{ id: "lamp_a", fill: 8 }, { id: "lamp_b", fill: 8 }, { id: "lamp_c", fill: 8 }, { id: "lamp_d", fill: 8 }, { id: "water_lamp", fill: 1 }] }
  ],
  // The train comes in and goes.
  train_in: [
    // The carriage is the platform's way in ("in", "enter") and the compartment's way out; the signal box, also off the
    // platform, is not marked: it is entered by its direction, and a bare "enter" with no train in is the train's hint.
    { move: "train", to: "platform" }, { connect: "platform", dir: "n", to: "compartment", passage: true, in: true },
    { connect: "compartment", dir: "s", to: "platform", passage: true, out: true },
    { draw: "platform", add: "rect train_body 0,50,300,26 2 e0 after:rails\nrect train_windows 10,56,280,10 stripes:14,6 after:train_body" }
  ],
  train_out: [
    { move: "train", to: null }, { disconnect: "platform", dir: "n" }, { disconnect: "compartment", dir: "s" },
    { set: "platform.waitFor.says", to: "You wait on the platform. The hour comes round the way the train does, all at once. At half past eleven, lights come out of the tunnel." },
    { draw: "platform", remove: ["train_body", "train_windows"] }
  ],
  yesterday: [
    { say: "You turn the key. The hands hurry backwards, the clocks on the walls fall silent one by one, and the light in the window goes the wrong way across the floor. It is yesterday. Whatever you did in it, you did." },
    { time: "-1d" }, { calm: 2 }
  ],
  // The endings
  tuesday_ending: [
    { say: "The train moves. The platform slides away, then the town, then the tunnel takes you. For a long time there is only the hum, and your face in the window. Then the window grows light. It is Tuesday. It is always going to be Tuesday now, and somewhere a Monday waits all day for someone who has gone ahead." },
    { end: true, picture: "tuesday" }
  ],
  monday_ending: [
    { move: "monday_page", to: null }, { set: "calendar.examine", to: "A tear-off calendar showing MONDAY." },
    { say: "You press the page onto the stub. The paste takes. For a moment nothing happens. Then the station clock strikes, and every clock in the town answers it, the clockmaker's last and loudest. The calendar shows MONDAY." },
    { say: "Somewhere behind you, [way] opens again. You go back the way you came, through lost property, and on the other side it is Monday morning. It is yours, all of it, still to do." },
    { end: true, picture: "monday" }
  ],
  sunday_ending: [
    { say: "Somewhere behind you, [way] closes, softly, the way a book does. In lost property, Mr Ambrose writes something in the ledger. The station clock does not strike. It is Sunday, and it is going to stay Sunday, and after a while you stop minding, which is the worst of it." },
    { end: true, picture: "sunday" }
  ]
};

// ---- Rules -----------------------------------------------------------------------------------------------------------
// Past the guard: the same whether you board the train by name ("board the train") or by its way ("in", "enter", "n").
const pastTheGuard = [{ say: "The guard looks at your ticket, punches it again for luck, and stands aside." }, { travel: "compartment" }, { describe: "$here" }];

const rules = [
  // Lost property: the umbrella, when you ask for it.
  { id: "claim_umbrella", match: { verb: "ask", obj: "ambrose", topic: "umbrella" }, if: [{ "umbrella.at": "lost_property" }],
    do: [{ say: "\"Grey umbrella,\" he reads. He looks at your hands, then at the tag, then takes it down from the shelf. \"Your writing,\" he says. \"They usually know.\"" },
         { set: "umbrella.portable", to: true }, { move: "umbrella", to: "player" }, tension(-5)] },
  { id: "take_umbrella_early", match: { verb: "take", obj: "umbrella" }, if: [{ "umbrella.portable": false }],
    do: [{ say: "It's behind the counter. Mr Ambrose doesn't hand things over to people who haven't asked." }] },
  { id: "claim_umbrella_say", match: { verb: "say", obj: [null, "ambrose"] }, if: [at("lost_property"), { "umbrella.at": "lost_property" }],
    do: [{ say: "\"If it's something you lost,\" says Mr Ambrose, \"ask me for it by name. Asking is how it's done.\"" }] },

  // The café: open seven in the morning to ten at night; coffee steadies you.
  { id: "cafe_closes", when: "at", at: "22:00", if: [at("cafe")],
    do: [{ say: "Inés turns the radio off in the middle of the waltz. \"Closing,\" she says, and you find yourself on the square." }, { travel: "square" }, { describe: "$here" }] },
  { id: "order_coffee", match: { verb: ["order", "buy", "ask"], obj: [null, "coffee", "ines"] }, if: [at("cafe"), { "$topic": { in: [null, "coffee"] } }, { "coffee.at": null }, { "coffee.day": { "!=": "$time.day" } }],
    do: [{ say: "Inés puts a small black {coffee} in front of you without a word. \"On the house,\" she says. \"Everything is, on Sundays.\"" }, { move: "coffee", to: "cafe" }, { set: "coffee.day", to: "$time.day" }] },
  { id: "coffee_served", match: { verb: ["order", "buy", "ask"], obj: [null, "coffee", "ines"] }, if: [at("cafe"), { "coffee.at": "cafe" }, { "$topic": { in: [null, "coffee"] } }], do: [{ say: "\"Drink that one first,\" says Inés." }] },
  { id: "coffee_done", match: { verb: ["order", "buy", "ask"], obj: [null, "coffee", "ines"] }, if: [at("cafe"), { "$topic": { in: [null, "coffee"] } }], do: [{ say: "\"One a day,\" says Inés. \"Any more and you'd start expecting things.\"" }] },
  { id: "drink_coffee", match: { verb: "drink", obj: "coffee" }, if: [{ "coffee.at": "cafe" }],
    do: [{ say: "It is very good. For a moment you can't think of anything you've ever been late for." }, { move: "coffee", to: null }, tension(-15)] },

  // The ticket window keeps its hours (nine in the evening to six in the morning).
  { id: "window_open_look", match: { verb: "examine", obj: "window" }, if: [hours(21, 6)],
    do: [{ say: "The shutter is up. Behind the grille, the booking clerk waits with her punch. The card says: ONE FARE: ONE COIN. OLD CURRENCY ONLY." }] },
  { id: "buy_ticket_have", match: { verb: "buy" }, if: [holding("ticket")], do: [{ say: "You have one already. One is all anyone needs." }] },
  { id: "buy_ticket", match: { verb: "buy", obj: [null, "ticket", "window", "booking_clerk"] }, if: [at("station_hall"), hours(21, 6), holding("coin")],
    do: [{ say: "You slide the old coin under the grille. The clerk bites it, nods, punches a ticket, and slides it back. \"Tuesday,\" she says. \"One way.\"" },
         { move: "coin", to: null }, { move: "ticket", to: "player" }] },
  { id: "buy_ticket_poor", match: { verb: "buy", obj: [null, "ticket", "window", "booking_clerk"] }, if: [at("station_hall"), hours(21, 6), { "ticket.at": { "!=": "player" } }],
    do: [{ say: "\"One fare, one coin,\" says the clerk. \"The old sort.\"" }] },
  { id: "buy_ticket_shut", match: { verb: "buy", obj: [null, "ticket", "window", "booking_clerk"] }, if: [at("station_hall"), notHours(21, 6)],
    do: [{ say: "The shutter is down. The card says: TICKETS FROM 21:00." }] },
  { id: "buy_elsewhere", match: { verb: "buy" }, do: [{ say: "Nothing here is for sale, except at the ticket window." }] },
  // The booking clerk is at her window while it's open.
  { id: "clerk_in", when: "at", at: "21:00", do: [{ move: "booking_clerk", to: "station_hall" }] },
  { id: "clerk_in_say", when: "at", at: "21:00", if: [at("station_hall")], do: [{ say: "The shutter of the ticket window goes up. A woman behind the grille sets out her punch." }] },
  { id: "clerk_out", when: "at", at: "06:00", do: [{ move: "booking_clerk", to: null }] },

  // The fountain's coins: only when the lamp under the water is lit (eight in the evening to seven in the morning).
  { id: "coin_dark", match: { verb: ["take", "search", "examine"], obj: ["coin", "fountain"] }, if: [at("square"), notHours(20, 7), { "coin.at": "fountain" }],
    do: [{ say: "The water gives back only the sky. Whatever is on the bottom, you can't make it out. The lamp in the basin isn't lit." }] },
  { id: "coin_take", match: { verb: "take", obj: ["coin", "fountain"] }, if: [at("square"), { "coin.at": "fountain" }],
    do: [{ say: "You roll up your sleeve. The water is colder than it looks. You come up with an old coin; the others settle back." }, { move: "coin", to: "player" }] },
  { id: "coin_more", match: { verb: "take", obj: ["coin", "fountain"] }, if: [at("square"), { "coin.at": { "!=": "square" } }],
    do: [{ say: "One is a fare. The rest are someone else's luck." }] },

  // Night falls at eight, the day breaks at seven: the square's text and every outdoor sky.
  { id: "nightfall", when: "at", at: "20:00", do: [{ change: "nightfall" }] },
  { id: "nightfall_say", when: "at", at: "20:00", if: [at("square")],
    do: [{ say: "A man with a pole goes from lamp to lamp. Last of all he leans over the fountain, and a light comes on under the water." }] },
  { id: "nightfall_say_out", when: "at", at: "20:00", if: [at("high_street", "platform", "platform_end", "park", "pond")],
    do: [{ say: "Up and down the town, the lamps come on." }] },
  { id: "daybreak", when: "at", at: "07:00", do: [{ change: "daybreak" }] },
  { id: "daybreak_say", when: "at", at: "07:00", if: [at("square", "high_street", "platform", "platform_end", "park", "pond")],
    do: [{ say: "It gets light. The lamps go out." }] },

  // The train: in at 23:30, away at 23:40, every night.
  { id: "train_arrives", when: "at", at: "23:30", do: [{ change: "train_in" }] },
  { id: "train_arrives_say", when: "at", at: "23:30", if: [at("platform", "platform_end", "signal_box", "station_hall")],
    do: [{ say: "Lights come out of the tunnel, then the train, slowly, as if it were being careful of you. It stops at the platform and breathes." }] },
  { id: "train_leaves_aboard", when: "at", at: "23:40", if: [at("compartment", "dining_car")], do: [{ change: "tuesday_ending" }] },
  { id: "train_leaves_say", when: "at", at: "23:40", if: [at("platform", "platform_end", "signal_box", "station_hall")],
    do: [{ say: "Doors slam. The train pulls out and the tunnel takes it. The platform is very quiet afterwards." }] },
  { id: "train_leaves", when: "at", at: "23:40", do: [{ change: "train_out" }] },
  // Boarding: with a ticket, past the guard.
  { id: "board_no_ticket", match: { verb: ["enter", "go", "board"], obj: [null, "train"] }, if: [at("platform"), { "train.at": "platform" }, { "ticket.at": { "!=": "player" } }, { "$exit": { in: ["compartment", null] } }],
    do: [{ say: "The guard steps down and stands in the door. \"Tickets,\" he says, and waits, and you have none." }] },
  { id: "board", match: { verb: ["enter", "board"], obj: "train" }, if: [at("platform"), holding("ticket")], do: pastTheGuard },
  // The carriage is marked as the platform's way in, so "in" and a bare "enter" go north (the engine turns the one into the other).
  { id: "board_by_way", match: { verb: "go", dir: "n" }, if: [at("platform"), { "train.at": "platform" }, holding("ticket")], do: pastTheGuard },
  { id: "no_train", match: { verb: ["enter", "go", "board"], obj: [null, "train"] }, if: [at("platform"), { "train.at": { "!=": "platform" } }, { "$exit": { in: [true, null] } }],
    do: [{ say: "The rails are empty. The board says the train is in at half past eleven." }] },
  { id: "wait_train", match: { verb: "wait" }, if: [at("platform"), { "train.at": "platform" }, { "$text": { "!=": null } }],
    do: [{ say: "The train is here. It won't wait much longer than you do." }] },

  // The tunnel: warned, then hurt.
  { id: "tunnel_warn", match: { verb: ["go", "enter"], obj: [null, "tunnel"] }, if: [at("platform_end"), { "$exit": { in: [true, null] } }], once: true,
    do: [{ say: "You step down onto the rails. The hum gets into your teeth. Somewhere inside, the dark leans towards you. You climb back up. Next time you might not." }, tension(10)] },
  { id: "tunnel_hurt", match: { verb: ["go", "enter"], obj: [null, "tunnel"] }, if: [at("platform_end"), { "$exit": { in: [true, null] } }],
    do: [{ say: "You walk in. The warm air thickens until it is like pushing through a crowd. Something passes very close, at speed, and is gone. You come out on your hands and knees, missing some of the evening." },
         { hurt: 2, says: "Something caught you as it passed." }, tension(15)] },

  // The town hall keeps office hours (nine to five); you can wait on its steps, or sleep at the hotel.
  { id: "hall_closes", when: "at", at: "17:00", if: [at("town_hall", "archive")],
    do: [{ say: "A bell rings for five. A clerk shows you out, politely, as if you were a draught." }, { travel: "high_street" }, { describe: "$here" }] },

  // The archivist: the last Monday, for something you lost on yours.
  { id: "give_umbrella", match: { verb: ["give", "show"], obj: "umbrella", obj2: "archivist" }, if: [holding("umbrella")],
    do: [{ say: "The archivist turns the umbrella over and reads the tag. She opens it, a little, and a few drops of a Monday's rain fall on her desk. \"Yes,\" she says. She takes a page from a drawer and gives it to you. \"Put it back where it came from.\"" },
         { move: "umbrella", to: null }, { move: "monday_page", to: "player" }, tension(-10)] },
  { id: "give_other_archivist", match: { verb: ["give", "show"], obj2: "archivist" }, do: [{ say: "\"That isn't from a Monday,\" she says, kindly, and gives it back." }] },

  // Putting the Monday back.
  { id: "restore_monday", match: { verb: ["put", "use", "attach", "stick"], obj: "monday_page", obj2: [null, "calendar"] }, if: [at("station_hall"), holding("monday_page")],
    do: [{ change: "monday_ending" }] },
  { id: "restore_monday_use", match: { verb: "use", obj: "calendar", obj2: "monday_page" }, if: [at("station_hall"), holding("monday_page")],   // (USE either way round)
    do: [{ change: "monday_ending" }] },
  { id: "restore_elsewhere", match: { verb: ["put", "use", "attach", "stick"], obj: "monday_page" }, if: [holding("monday_page")],
    do: [{ say: "It wants to go back where it was torn from: the calendar under the station clock." }] },

  // The hotel: a room for the asking; sleep until morning.
  { id: "ask_room", match: { verb: "ask", obj: "porter", topic: "room" }, if: [{ "room_key.at": null }],
    do: [{ say: "\"Number 4,\" he says, and puts a key on the desk without looking up. \"Breakfast is on Tuesdays.\"" }, { move: "room_key", to: "player" }] },
  { id: "sleep", match: { verb: ["sleep", "lie"], obj: [null, "bed"] }, if: [at("hotel_room"), { "bed.slept": { "!=": "$time.day" } }],
    do: [{ say: "You lie down. The bed fits you as if it had been waiting. Trains you don't hear go by. When you wake it is morning, and the room smells of someone else's toast." }, { time: "next 07:30" }, tension(-15), { set: "bed.slept", to: "$time.day" }] },
  { id: "sleep_again", match: { verb: ["sleep", "lie"], obj: [null, "bed"] }, if: [at("hotel_room")],
    do: [{ say: "You are not tired. The bed has been slept in already today, and by you." }] },
  { id: "sleep_elsewhere", match: { verb: "sleep" }, do: [{ say: "Not here. There's a hotel on the square." }] },

  // The photo booth: tomorrow's photograph, once.
  { id: "photo", match: { verb: ["push", "use"], obj: ["button", "booth"], obj2: [null] }, if: [{ "player.in": "booth" }, { "photograph.at": null }],
    do: [{ say: "The flash goes four times. You wait. A strip drops into the slot outside, and you fetch it, still wet." }, { move: "photograph", to: "player" }, tension(-5)] },
  { id: "photo_again", match: { verb: ["push", "use"], obj: ["button", "booth"], obj2: [null] }, if: [{ "player.in": "booth" }],
    do: [{ say: "The booth whirs and gives nothing back. NO REFUNDS, says the notice. Tomorrow only happens once." }] },
  { id: "photo_outside", match: { verb: "push", obj: "button" }, if: [{ "player.in": { "!=": "booth" } }],
    do: [{ say: "The button is inside. You have to sit in the booth first." }] },

  // The backwards clock: yesterday, once there is one.
  // (Not to before you came: a day back from day 2 only once it's past this evening's half past seven.)
  { id: "wind_back", match: { verb: ["wind", "turn", "use"], obj: "backwards_clock", obj2: [null] }, if: [{ "time.day": { ">=": 3 } }], do: [{ change: "yesterday" }] },
  { id: "wind_back_2", match: { verb: ["wind", "turn", "use"], obj: "backwards_clock", obj2: [null] }, if: [{ "time.day": 2 }, { "time.hour": { ">=": 20 } }], do: [{ change: "yesterday" }] },
  { id: "wind_back_first", match: { verb: ["wind", "turn", "use"], obj: "backwards_clock", obj2: [null] },
    do: [{ say: "The key turns and stops. \"Not yet,\" says the clockmaker. \"There's no yesterday here yet. Not one you were in.\"" }] },

  // Tension: the longer you stay, the harder it is to leave; warned, then the door closes.
  { id: "creep_0", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 0 }],
    do: [{ say: "A clock somewhere strikes the hour. You count the strokes and lose your place." }, { unsettle: 1 }] },
  { id: "creep_1", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 1 }],
    do: [{ say: "It occurs to you that you can't quite remember what day it was yesterday." }, { unsettle: 1 }] },
  { id: "creep_2", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 2 }],
    do: [{ say: "Somewhere behind you, [way] breathes out, long and slow, as if it were getting ready to stop." }, { unsettle: 1 }] },
  { id: "creep_3", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 3 }],
    do: [{ say: "You think of [way], the way you came. You are not sure you could still find it. A coffee, a sleep, anything that stops the waiting, might help." }, { set: "game.wayLastWarned", to: true }, { unsettle: 1 }] },
  { id: "creep_4", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 4 }],
    do: [{ say: "The waiting has got into your shoes, and your shoes have stopped wanting to go anywhere." }, { set: "game.wayLastWarned", to: true }, { unsettle: 1 }] },
  { id: "tension_end", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 5 } }, { "game.wayLastWarned": true }],
    do: [{ change: "sunday_ending" }] }
];

// ---- Puzzles (for the checker; GUIDE.md §3) ---------------------------------------------------------------------------
const puzzles = {
  get_coin: { where: "square", needs: [], solve: ["wait until the lamps are lit", "take coin"], gives: ["coin"], clues: ["oduya", "booking_clerk", "ines", "fountain"] , hints: ["The old coins are in the fountain, but the water only shows them once its lamp is lit, at eight.", "Wait by the fountain until the lamps are lit, then take a coin."] },
  get_ticket: { where: "station_hall", needs: ["coin"], solve: ["wait for the window to open", "buy ticket"], gives: ["ticket"], clues: ["window", "timetable"] , hints: ["The ticket window opens at nine in the evening, and it wants an old coin.", "Wait in the station hall for the window to open, then buy a ticket."] },
  board_train: { where: "platform", needs: ["get_ticket"], solve: ["wait for the train", "board train"], reaches: "compartment", clues: ["board", "signalman", "timetable"] , hints: ["The Tuesday train comes in at half past eleven. The guard wants a ticket.", "Wait on the platform for the train, then board it."] },
  leave_tuesday: { where: "compartment", needs: ["board_train"], solve: ["wait for the train to leave"], ending: true, clues: ["guard", "timetable"] , hints: ["It leaves at twenty to midnight. You only have to be on it.", "Sit in the compartment and wait for the train to leave."] },
  claim_umbrella: { where: "lost_property", needs: [], solve: ["ask Mr Ambrose about the umbrella"], gives: ["umbrella"], clues: ["ledger", "ambrose"] , hints: ["The ledger in lost property has something left on a Monday, in your handwriting.", "Ask Mr Ambrose about the umbrella."] },
  open_hall: { where: "high_street", needs: [], solve: ["wait until the town hall opens", "west"], reaches: "town_hall", clues: ["plate", "ines", "oduya"] , hints: ["The town hall keeps office hours: nine to five.", "Wait on the high street until the town hall opens, then go in."] },
  get_monday: { where: "archive", needs: ["umbrella", "open_hall"], solve: ["give umbrella to archivist"], gives: ["monday_page"], clues: ["archivist", "gravestones", "photograph", "decree"] , hints: ["The archivist keeps the last Monday for whoever lost something on one.", "Give the archivist your umbrella."] },
  restore_monday: { where: "station_hall", needs: ["monday_page"], solve: ["put Monday on calendar"], ending: true, clues: ["calendar", "clockmaker", "pond_water", "photograph"],
                    hints: ["The calendar under the station clock has a page missing between Sunday and Tuesday.", "Put the Monday on the calendar in the station hall."] }
};

// ---- The change set -----------------------------------------------------------------------------------------------------
// ---- The opening, declared (BRIEF.md §3): the ids of its room and four things, and the lines it says --------------------
const opening = {
  room: "halt", restart: "alarm", hints: "tin", intro: "diary_leaf", way: "carriage_door",
  lines: {
    notYet: "The carriage shifts away from your foot, politely, an inch. Passengers are asked to bring something to begin again with, and something to listen to.",
    notYetRestart: "The carriage shifts away from your foot, an inch. You have nothing to begin again with, and there is an alarm on the bench.",
    notYetHints: "The carriage shifts away from your foot, an inch. You have nothing to listen to, and there is a tin on the bench.",
    through: "You step up, and the door closes behind you with a small sound, like a ticket being punched, and the lamp on the platform goes out. When it opens again you are standing among shelves.",
    askRestart: "Wind the alarm back to the start of the day and begin again?",
    restartYes: "You wind the key until it will go no further. The platform runs backwards under your feet, the lamp, the bench, the evening, and…",
    restartNo: "You let the key go. The alarm ticks on, and it is still tomorrow.",
    hintFrame: "You put the tin to your ear. Down the string, someone with a stationmaster's patience says:",
    farewell: "You hold the leaf up to the lamp. The week comes apart along its ruled lines, and is gone, Sunday first."
  }
};

export default {
  because: "After the opening: a town without Mondays.",
  opening,
  // The properties this world's rules keep (ARCHITECTURE.md §3, "Fields and properties"); the engine's own aren't declared.
  properties: {
    "bed.slept": { type: "number" },    // the day the bed was last slept in
    "coffee.day": { type: "number" },   // the day the coffee was last served
    "game.wayLastWarned": { type: "boolean", start: false }   // the last warning about the way you came: the end waits for it
  },
  facts: [
    "The player arrives on a Sunday evening, in a town that abolished Mondays.",
    "A train leaves for Tuesday at 23:40 every night; nobody comes back.",
    "The last Monday is kept by the archivist at the town hall, for whoever lost one."
  ],
  effects: [
    { time: "day 1 19:00", weekday: "sun" },                  // the opening is played at seven
    // Where the opening's way on leads, and what arriving does: the town's time and its first line.
    { set: "game.entrance", to: "lost_property" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 19:30", weekday: "sun" },
      { say: "Somewhere a clock strikes half past seven, in the evening, on a Sunday." }
    ] },
    { set: "game.moods", to: [
      { below: 1, text: "Adequately content" }, { below: 2, text: "Restless" }, { below: 3, text: "Waiting" },
      { below: 4, text: "Overdue" }, { below: 6, text: "Last call" }
    ] },
    // Verbs this world needs
    { add: "word", verb: "buy", words: ["buy", "purchase", "pay for"], absent: true },
    { add: "word", verb: "board", words: ["board", "catch"] },
    { add: "word", verb: "wind", words: ["wind", "wind up", "wind back"] },
    { add: "word", verb: "order", words: ["order"], absent: true },
    { add: "word", verb: "attach", words: ["attach", "paste", "glue"] },
    { add: "word", verb: "stick", words: ["stick"] },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    { add: "object", id: "ticket", at: null, portable: true, name: "Ticket", note: "Tuesday. One way.", actions: ["Examine ticket"],
      words: { nouns: ["ticket"], adj: ["train", "tuesday"] }, ...item("ticket"),
      examine: "A stiff card ticket: TUESDAY, SINGLE. Punched twice. On the back: NOT VALID FOR RETURN, BECAUSE THERE ISN'T ONE." },
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
