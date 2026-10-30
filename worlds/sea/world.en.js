// The sample world: what comes after Corridor 7-B, in English, written the way the AI is asked to write a world
// (WRITING-DIRECTION.md for the voice, ARCHITECTURE.md §3–6 for the data, ART-DIRECTION.md for the pictures).
// It's one change set: the effects that turn the opening corridor into the whole game, applied all or nothing by
// the engine's own checks (js/engine.js applyChangeSet), so anything the engine wouldn't accept is refused.
// Texts are literal (a game is written in one language, ARCHITECTURE.md §8); ids and the drawing lists aren't
// shown to the player.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- The game bible (what the author would write; here written to match the corridor) --------------------------
// Kept with the world so the director can read it later; nothing in the engine uses it yet.
export const bible = {
  title: "The Sea Is a Rumour",
  blurb: "Behind a small green door that breathes, a seaside town on a Sunday that never ends, where the life you didn't live has kept your coat.",
  thumbnail: { picture: "pier_end", x: 40 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0–95)
  synopsis: "A clerk at the Ministry of Adequate Happiness finds a small green door that breathes. Behind it, a " +
    "seaside town on a Sunday that never ends, where the life they didn't live has been waiting: a hotel room " +
    "with their coat, a letter in their handwriting, a bathing hut with their number. Across the water, a dark " +
    "lighthouse burns only what you are willing to forget.",
  tone: "WRITING-DIRECTION.md: the everyday, slightly wrong; calm, concise, with echoes of what could have been.",
  opening: "Corridor 7-B at the Ministry, a Monday morning: a suggestion box (hints), a " +
    "memo you already carry (why you came). The small green door that breathes is the way on.",
  rules: [
    "Once given, your name stays with the door. Nobody here can give it back.",
    "It is always a quarter past five on a Sunday. Nobody in the town finds anything strange.",
    "The sea gives things back, slowly.",
    "The lighthouse lamp burns only what you are willing to forget."
  ],
  endings: [
    "Burn the photograph: forget the life that could have been; wake at your desk, level minus four, content.",
    "Burn the shell: let the Ministry forget you; the door closes, the clocks start, Monday comes.",
    "Drown: the sea takes you, and gives you back, in its own time."
  ],
  chaos: 0.3
};

// ---- Small helpers for conditions (they read like the rules' own words) ----------------------------------------
const at = (room) => ({ "player.at": room });
const holding = (id) => ({ [id + ".at"]: "player" });
const notAsking = { "$topic": null };                 // not asking about something (then their topics answer)

// Each portable object carries its sprite (16 × 16, hex palette numbers) and, if it can lie in a picture, a small
// floor version (content/sample.sprites.js).
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// Room texts that changes swap in and out (the beach and the lantern room). A change rewrites a room's whole text; when two changes can touch the same room, the
// later one accounts for the earlier (GUIDE.md §6): lighting the lamp after the door has turned to driftwood uses
// the texts with both.
const sand = "The tide line runs west. To the east, black rocks and the mouth of a cave. Dunes rise to the south.";
const doorStands = "A beach at night. The sand is still warm, as if the sun had only just left. The green {door|beach_door} stands alone in the sand, attached to nothing, breathing.";
const doorGone = "A beach at night. The sand is still warm, as if the sun had only just left. Where the green door stood, a piece of {driftwood|beach_door} stands upright in the sand, about the size of a small door.";
const seaDark = "The sea is calm and very large. A wooden pier walks out into it to the north. Far off, on a rock, a {lighthouse|lighthouse_far} stands dark.";
const seaLit = "The sea is calm and very large. A wooden pier walks out into it to the north. Far off, on its rock, the {lighthouse|lighthouse_far} is lit, its beam turning slowly over the water.";
const lampCold = "Glass on every side, and the sea on every side of the glass. In the middle stands the {lamp}, its great lens cold.";
const lampLit = "Glass on every side, and the sea on every side of the glass. In the middle, the {lamp} burns behind its great lens, and the light goes out over the water.";
const farDoor = "Far off, the beach. The green door is a small lit square in the sand.";
const farSand = "Far off, the beach. Where the door was, there is only dark sand.";
const down = "The stairs go down.";

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  photograph: { alt: "An office floor seen from far above: rows of identical grey desks in grey partitions, and at one of them a tiny figure sitting very still.", picture: endings.photograph },
  shell: { alt: "Far off across black water at night, a lighthouse on its rock throws a wide sweep of yellow light over the sea and the town. On the dark beach near the left, where a door stood, there is only a piece of driftwood.", picture: endings.shell },
  drowned: { alt: "Seen from under the water, looking up: a pale, broken moon on the surface far above and long shafts of light going down into the dark, where a small red shoe and a grey glove drift slowly.", picture: endings.drowned },
  died: { alt: "A hand, close to the camera, lies open on the wet sand at the tide's edge, reaching for the sea. Beyond it, a thin strip of grey water under a pale dawn sky.", picture: endings.died }
};

// ---- Rooms ------------------------------------------------------------------------------------------------------
// area + at: where it is (js/space.js). Coast: x grows east, y grows south (the sea is north). The lighthouse is an
// area of its own, reached only by boat. exits: a room id; true = there's a way, but a rule answers; false = none.

const rooms = {
  // The opening (GUIDE.md §8): the Ministry corridor, never returned to. Area "ministry" is its own.
  corridor: {
    name: "CORRIDOR 7-B", area: "ministry", at: [0, 0, -4],
    describe: [
      "Ministry of Adequate Happiness, level minus four. Grey walls, grey lino, grey light, as every morning for eleven years. A {loudspeaker} murmurs that you are content.",
      "Today a small {green door|green_door} breathes low in the wall, with water and a line of yellow light under it. The eye on the {poster} watches you; a {camera} turns to look somewhere else."
    ],
    exits: { e: true },
    scenery: [
      { words: ["wall", "walls", "ceiling", "lamp", "lamps", "light", "lino", "linoleum", "floor", "corridor", "hallway"], name: "the corridor", says: "Grey lino, grey walls, lamps that were switched on in 1987 and never asked." },
      { words: ["plaque"], name: "the plaque", says: "Engraved in old-fashioned letters: \"Knock only if you remember your name.\"" },
      { words: ["puddle", "water"], name: "the puddle", says: "Warm water, from nowhere. It smells of a place you have never been but somehow remember." }
    ],
    mentions: ["loudspeaker", "poster", "camera", "green door"],
    ambience: { lines: [
      "The {loudspeaker} clears its throat. \"Contentment on level minus four is within expected parameters.\"",
      "\"A reminder,\" murmurs the {loudspeaker}. \"Doors that were not there yesterday are not there today.\"",
      "The {loudspeaker} hums a few bars of the Ministry anthem, then thinks better of it.",
      "\"You are content,\" the {loudspeaker} murmurs. \"Please remain content until further notice.\"",
      "\"A message from the Ministry: elsewhere is a rumour.\"",
      "Somewhere above, the {loudspeaker} crackles. \"Lunch will be adequate.\""], every: [40, 90] },
    alt: "A long grey corridor lit by ceiling lamps. A poster with a red eye hangs on the left wall; a camera on the right wall faces away. Low on the right wall, a tiny green door leaks yellow light and water onto the floor.",
    overlayAlt: {
      suggestion_box: "A small wooden suggestion box hangs on the wall under the poster."
    }
  },
  beach: {
    name: "THE BEACH", area: "coast", at: [0, 0, 0],
    describe: [
      doorStands, seaDark, sand
    ],
    exits: { n: "pier", w: "tideline", e: { to: "cave", in: true }, s: "dunes" },
    ambience: { lines: ["A gull calls once and is not answered.", "A wave comes further up the sand than the others, touches the door, and goes back.", "The door breathes in. Somewhere very far off, a loudspeaker clears its throat."],
                if: [{ "beach_door.shut": { "!=": true } }] },
    alt: "A beach at night under a full moon. A small green door stands upright in the sand, light leaking from its edges. A pier runs out to sea on the left; far off, a dark lighthouse on a rock. Black rocks and a cave mouth on the right.",
    scenery: [
      { words: ["sand", "beach"], name: "the sand" }, { words: ["sea", "water", "waves", "ocean"], name: "the sea", says: "Black, and very cold to look at. Further out it pulls, patiently, like something that has all the time in the world." },
      { words: ["moon", "sky", "stars"], name: "the sky" }, { words: ["pier", "jetty"], name: "the pier" },
      { words: ["rocks", "rock", "cave", "mouth"], name: "the rocks", leads: "e" }, { words: ["dunes", "dune"], name: "the dunes" }
    ]
  },
  tideline: {
    name: "THE TIDE LINE", area: "coast", at: [-1, 0, 0],
    describe: [
      "The tide has left a line along the sand: weed, a {glove}, a child's {shoe}, a typed {page} going soft. Everything the sea gives back, it gives back slowly.",
      "The beach runs east. To the south, the bathing huts."
    ],
    exits: { e: "beach", s: "huts" },
    alt: "Wet sand seen from above. A line of seaweed crosses it, with a grey glove, a small red shoe and a sodden typed page.",
    overlayAlt: { shell: "A pale shell lies near the page." },
    scenery: [
      { words: ["weed", "seaweed", "line", "tide"], name: "the weed" }, { words: ["sand", "beach"], name: "the sand" },
      { words: ["sea", "water", "foam", "waves"], name: "the sea", says: "Black, and very cold to look at. Further out it pulls, patiently, like something that has all the time in the world." }, { words: ["huts"], name: "the huts" }
    ]
  },
  cave: {
    name: "THE CAVE", area: "coast", at: [1, 0, 0],
    describe: [
      "The cave is low and smells of salt and old coins. Water drips somewhere you can't see.",
      "Say anything here and the cave says it back, a moment late and in another voice.",
      "The way out is west, to the beach."
    ],
    exits: { w: { to: "beach", out: true } },
    listen: "Drips. The sea outside. And under them, very faint, the sound of someone holding their breath.",
    alt: "Inside a dark cave, looking out through its mouth at the moon over the sea. A pool on the cave floor catches the light.",
    scenery: [
      { words: ["rock", "rocks", "walls", "roof", "salt", "coins"], name: "the rock" }, { words: ["water", "drips", "drip", "pool"], name: "the water" },
      { words: ["echo", "voice"], name: "the echo" }, { words: ["sea", "moon"], name: "the view" },
      { words: ["cave", "mouth", "entrance"], name: "the cave", leads: "w" }
    ]
  },
  pier: {
    name: "THE PIER", area: "coast", at: [0, -1, 0],
    describe: [
      "Old boards, grey with salt, with gaps wide enough to see the sea breathing underneath. The pier goes on north into the dark.",
      "A {lifebuoy} hangs on a post. Someone painted a name on it, then painted over the name.",
      "South, the beach."
    ],
    exits: { s: "beach", n: "pier_end" },
    alt: "A wooden pier stretching away from you into the night sea, with rope rails and a red and white lifebuoy on the nearest post.",
    scenery: [
      { words: ["boards", "planks", "pier", "gaps", "deck"], name: "the boards" }, { words: ["sea", "water"], name: "the sea", says: "Black, and very cold to look at. Further out it pulls, patiently, like something that has all the time in the world." },
      { words: ["post", "posts", "rope", "rail", "rails"], name: "the posts" }, { words: ["lighthouse"], name: "the lighthouse" }
    ]
  },
  pier_end: {
    name: "END OF THE PIER", area: "coast", at: [0, -2, 0],
    describe: [
      "The pier stops here, as if it had changed its mind. The last post has an iron ring for mooring.",
      "Across the black water, the {lighthouse|lighthouse_near} stands on its rock. Too far to swim. Not too far to row.",
      "The pier leads back south."
    ],
    exits: { s: "pier", n: true },
    alt: "The end of a pier at night. Across the water, a white lighthouse with a red band stands on a rock, its lantern dark.",
    overlayAlt: { boat: "A small blue rowing boat is tied to the post." },
    scenery: [
      { words: ["post", "ring", "pier", "boards"], name: "the post" }, { words: ["sea", "water"], name: "the sea", says: "Black, and very cold to look at. Further out it pulls, patiently, like something that has all the time in the world." },
      { words: ["rock"], name: "the rock" }
    ]
  },
  huts: {
    name: "THE BATHING HUTS", area: "coast", at: [-1, 1, 0],
    describe: [
      "A row of bathing huts faces the sea, striped, numbered, shut for the season. The paint has faded on all of them but one: {hut 7|hut}, freshly painted, as if somebody were expected.",
      "The tide line is north. The dunes are east."
    ],
    exits: { n: "tideline", e: "dunes" },
    alt: "A row of six striped bathing huts at night. Five are faded grey; one, in the middle, is freshly painted white and blue, with a red roof and a padlock on its door.",
    scenery: [
      { words: ["huts", "row", "paint", "stripes"], name: "the huts" }, { words: ["sand", "beach"], name: "the sand" },
      { words: ["flag"], name: "the flag" }, { words: ["dunes", "sea"], name: "the view" }
    ]
  },
  dunes: {
    name: "THE DUNES", area: "coast", at: [0, 1, 0],
    describe: [
      "A path of boards winds between the dunes. The grass moves a little, though there is no wind.",
      "Somewhere a {radio} plays a song that ended years ago, and goes on ending.",
      "North, the beach. South, the lights of the promenade. West, the bathing huts."
    ],
    exits: { n: "beach", s: "promenade", w: "huts" },
    alt: "A boardwalk winding between dark dunes topped with marram grass, towards the faint glow of a town.",
    scenery: [
      { words: ["dunes", "dune", "sand"], name: "the dunes" }, { words: ["grass", "marram"], name: "the grass" },
      { words: ["path", "boards", "boardwalk"], name: "the path" }, { words: ["lights", "promenade", "town"], name: "the lights" }
    ]
  },
  promenade: {
    name: "THE PROMENADE", area: "coast", at: [0, 2, 0],
    describe: [
      "White railings, and lamps that are lit but give no light. Everyone has gone in for tea.",
      "West, the Hotel Miramar keeps its door open. East, a carousel turns with nobody on it. The square is south; the dunes, north."
    ],
    exits: { n: "dunes", s: "square", w: { to: "lobby", in: true }, e: "carousel" },
    alt: "A seaside promenade at night: white railings in front, three lit lamps, a tall hotel on the left with one window lit and its door open, a striped carousel on the right.",
    scenery: [
      { words: ["railings", "railing", "rail"], name: "the railings" }, { words: ["lamps", "lamp", "light", "lights"], name: "the lamps" },
      { words: ["hotel", "miramar", "door"], name: "the hotel", leads: "w" }, { words: ["carousel", "merry-go-round", "roundabout"], name: "the carousel" },
      { words: ["square"], name: "the square" }
    ]
  },
  carousel: {
    name: "THE CAROUSEL", area: "coast", at: [1, 2, 0],
    describe: [
      "The carousel turns with nobody on it, to a music-box tune played a little too slowly. The horses rise and fall.",
      "One of them, a grey {horse}, has a number painted on its saddle: 7-B.",
      "The promenade is west."
    ],
    exits: { w: "promenade" },
    alt: "Close up on a carousel under a red and white canopy ringed with bulbs. A grey horse with a red saddle is in front; a white and a brown horse are further round.",
    scenery: [
      { words: ["carousel", "canopy", "bulbs", "music", "tune", "pole"], name: "the carousel" },
      { words: ["horses"], name: "the other horses" }
    ]
  },
  lobby: {
    name: "HOTEL MIRAMAR", area: "coast", at: [-1, 2, 0],
    describe: [
      "Palms in brass pots, and a carpet worn into paths. Behind the desk, the {board of keys|keyboard} has one empty hook. A {bell} waits on the desk.",
      "Through double doors to the west, cutlery chimes. Stairs go up. The promenade is east."
    ],
    exits: { e: { to: "promenade", out: true }, w: "dining", u: "hallway" },
    alt: "A hotel lobby: a reception desk with a brass bell, a board of keys behind it, palms in pots, glowing double doors on the left and red-carpeted stairs on the right.",
    scenery: [
      { words: ["palms", "palm", "pots", "pot"], name: "the palms" }, { words: ["carpet", "paths", "floor"], name: "the carpet" },
      { words: ["desk", "reception"], name: "the desk" }, { words: ["stairs", "staircase", "steps"], name: "the stairs", leads: "u" },
      { words: ["doors", "cutlery"], name: "the doors" }
    ]
  },
  dining: {
    name: "THE DINING ROOM", area: "coast", at: [-2, 2, 0],
    describe: [
      "A long table, a white cloth, the remains of a dessert. Twelve {guests} in evening dress sit around it, talking quietly. They have been at dessert for a long time. Nobody has thought to leave.",
      "At the near end there is an empty {chair}, and a {card} on the plate in front of it.",
      "The lobby is east."
    ],
    exits: { e: "lobby" },
    ambience: { lines: ["Somebody proposes a toast. Everybody raises a glass. Nobody drinks.", "A guest laughs at a joke that was told before you arrived.", "The salt goes round the table again."], every: [30, 70], chance: 0.8 },
    alt: "A long dining table in perspective, white cloth and candles, guests in evening dress along both sides under a chandelier. An empty chair at the near end has a card on its plate.",
    scenery: [
      { words: ["table", "cloth", "candles", "candle", "chandelier"], name: "the table" },
      { words: ["dessert", "plates", "plate", "meringue"], name: "the dessert" }, { words: ["window"], name: "the window" },
      { words: ["dress", "evening"], name: "the evening dress" }
    ]
  },
  hallway: {
    name: "FIRST FLOOR", area: "coast", at: [-1, 2, 1],
    describe: [
      "A corridor of numbered doors. The carpet swallows your steps. It is very like another corridor you know, and nothing like it.",
      "{Door 11|door11} stands ajar, its key still in the lock. The stairs lead down."
    ],
    exits: { d: "lobby", w: { to: "room11", in: true } },
    alt: "A warm hotel corridor in perspective, brown walls and a red carpet, doors on both sides. The nearest door on the left is ajar, light at its edge.",
    scenery: [
      { words: ["doors", "corridor", "hall", "hallway"], name: "the doors" }, { words: ["carpet", "floor", "runner"], name: "the carpet" },
      { words: ["stairs", "staircase"], name: "the stairs", leads: "d" }, { words: ["window"], name: "the window" }, { words: ["lamps", "sconces"], name: "the lamps" }
    ]
  },
  room11: {
    name: "ROOM 11", area: "coast", at: [-2, 2, 1],
    describe: [
      "A small room with a {window} on the sea. The bed is made. On the chair, a {coat} in your size and your colour, though you have never owned a coat like it.",
      "The door is east."
    ],
    exits: { e: { to: "hallway", out: true } },
    alt: "A small hotel room at night: a window on the dark sea between red curtains, a blue coat over a chair, a made bed with a white pillow.",
    overlayAlt: { letter: "A letter lies on the pillow." },
    scenery: [
      { words: ["bed", "pillow", "cover", "sheets"], name: "the bed" }, { words: ["chair"], name: "the chair" },
      { words: ["curtains", "curtain"], name: "the curtains" }, { words: ["door", "room"], name: "the door", leads: "e" },
      { words: ["sea", "water"], name: "the sea" }
    ]
  },
  square: {
    name: "THE SQUARE", area: "coast", at: [0, 3, 0],
    describe: [
      "Shut shops around a fountain with no water in it. The {clock} on the town hall says a quarter past five. It is Sunday. It has been Sunday for some time.",
      "Pigeons walk about with their hands behind their backs.",
      "The post office is west. A café is east, lit. The station is south; the promenade, north."
    ],
    exits: { n: "promenade", w: "post_office", e: "cafe", s: "station" },
    ambience: { lines: ["A pigeon walks the whole way round the fountain and stops where it started.", "The pendulum behind the clock face goes on swinging. The hands don't move.", "Someone in a shut shop turns a sign from \"Closed\" to \"Closed.\""] },
    alt: "A town square at night: a town hall with a clock tower at a quarter past five, a dry fountain, shuttered shops on the left with a blue post office door, a lit café on the right. Pigeons on the cobbles.",
    scenery: [
      { words: ["fountain", "basin"], name: "the fountain" }, { words: ["shops", "shop", "shutters"], name: "the shops" },
      { words: ["pigeons", "pigeon", "birds"], name: "the pigeons" }, { words: ["town", "hall", "tower"], name: "the town hall" },
      { words: ["post", "office"], name: "the post office", leads: "w" }, { words: ["cafe"], name: "the café", leads: "e" },
      { words: ["station"], name: "the station", leads: "s" }, { words: ["sign"], name: "the sign" }
    ]
  },
  post_office: {
    name: "POST OFFICE", area: "coast", at: [-1, 3, 0],
    describe: [
      "Wooden counters, a smell of glue and rain. Behind the grille, the {postmaster} sorts letters into pigeonholes marked with dates instead of names. The pigeonholes go back further than the room does.",
      "The door is east."
    ],
    exits: { e: { to: "square", out: true } },
    alt: "Through the bars of a post office grille: a postmaster in a blue cap and spectacles under a green lamp, pigeonholes full of letters behind him.",
    scenery: [
      { words: ["counter", "counters", "grille", "bars"], name: "the counter" }, { words: ["pigeonholes", "letters", "dates"], name: "the pigeonholes" },
      { words: ["lamp", "glue"], name: "the lamp" }, { words: ["door", "doorway", "post", "office"], name: "the door", leads: "e" }
    ]
  },
  cafe: {
    name: "THE CAFÉ", area: "coast", at: [1, 3, 0],
    describe: [
      "Four tables, and one {waiter}, who has been folding the same napkin for as long as anyone remembers. The napkin is folded, unfolded and folded again, a little differently each time. The coffee machine sighs.",
      "The square is west."
    ],
    exits: { w: { to: "square", out: true } },
    alt: "A small warm café: a steaming coffee machine on the counter, round marble tables, a waiter in a white apron folding a napkin, a window on the dark square.",
    overlayAlt: { coffee: "A cup of coffee steams on the table." },
    scenery: [
      { words: ["tables", "table", "chairs", "chair"], name: "the tables" }, { words: ["machine", "steam"], name: "the coffee machine" },
      { words: ["napkin"], name: "the napkin" }, { words: ["window", "square"], name: "the window" },
      { words: ["door", "doorway", "cafe"], name: "the door", leads: "w" }
    ]
  },
  station: {
    name: "THE STATION", area: "coast", at: [0, 4, 0],
    describe: [
      "One platform, one bench, one {train} with its doors open and its engine asleep. The {timetable} lists every train as leaving at a quarter past five.",
      "The rails run south into the dark, and stop a little way out, as if they had forgotten where they were going. The square is north."
    ],
    exits: { n: "square", s: true },
    ambience: { lines: ["The engine turns over in its sleep.", "A whistle blows, very far away, for some other train.", "The signal at the end of the line changes from red to red."], every: [40, 90], chance: 0.6 },
    alt: "A station platform at night under a canopy. A dark green train waits on the right with an open door. A bench and a white timetable board on the platform; a red signal far down the line.",
    scenery: [
      { words: ["platform", "canopy"], name: "the platform" }, { words: ["bench"], name: "the bench" },
      { words: ["rails", "rail", "tracks", "line", "signal"], name: "the rails" }, { words: ["engine"], name: "the engine" }
    ]
  },
  lighthouse_base: {
    name: "THE LIGHTHOUSE ROCK", area: "lighthouse", at: [0, 0, 0],
    describe: [
      "A rock in the sea, just big enough for a lighthouse and a mooring ring. Waves arrive from every side, unhurried.",
      "The lighthouse goes up, white, into the dark. Its door is open. Inside, an iron staircase turns upward. The boat is the only way back."
    ],
    exits: { u: "lantern", s: true },
    alt: "Looking up at a tall white lighthouse with red bands, its lantern dark against the stars. Foam breaks on the rock at its foot; the door is open.",
    overlayAlt: { boat: "The rowing boat is tied to the mooring ring." },
    scenery: [
      { words: ["lighthouse", "tower", "door", "staircase", "stairs"], name: "the lighthouse", leads: "u" },
      { words: ["rock", "ring"], name: "the rock" }, { words: ["sea", "waves", "water", "foam"], name: "the sea", says: "Black, and very cold to look at. Further out it pulls, patiently, like something that has all the time in the world." }
    ]
  },
  lantern: {
    name: "THE LANTERN ROOM", area: "lighthouse", at: [0, 0, 1],
    describe: [
      lampCold, farDoor, down
    ],
    exits: { d: "lighthouse_base" },
    alt: "Inside the lantern room: a great glass lens in the middle on a brass pedestal; through the window frames, the night sea and a thin far beach with one tiny yellow light.",
    scenery: [
      { words: ["glass", "windows", "window"], name: "the glass" }, { words: ["sea", "beach", "door", "square"], name: "the view" },
      { words: ["stairs"], name: "the stairs", leads: "d" }
    ]
  }
};

// ---- Objects ----------------------------------------------------------------------------------------------------
// name / note / actions: what clicking it shows (heldActions when carried); words: how the parser knows it;
// examine: its description; here: a line added to the room while it's there. (The coffee starts out of play; the
// "order" verb can name it anyway, ARCHITECTURE.md §3.)

const objects = {
  // The opening: the thing to take, the one you carry, and the way on (BRIEF.md §3).
  suggestion_box: { at: "corridor", portable: true, name: "Suggestion box", note: "Someone is reading it aloud.", actions: ["Take box", "Listen to box"], heldActions: ["Listen to box", "Examine box"],
    words: { nouns: ["box", "slot"], adj: ["suggestion", "wooden", "brass"] }, ...item("suggestion_box"),
    here: "Under the poster, a {suggestion box|suggestion_box} hangs by one screw.",
    examine: "A small wooden box with a brass slot, labelled \"Suggestions.\" It has not been emptied in your time, and it is not full. From inside, very faintly, a voice is reading." },
  memo: { at: "player", portable: true, name: "Ministry memo", note: "Folded in four.", actions: ["Read memo"], heldActions: ["Read memo"],
    words: { nouns: ["memo", "memorandum"], adj: ["ministry", "folded"] }, ...item("memo"),
    examine: "A Ministry memo, folded in four, the seal still green. \"To all staff: a door has been reported on level minus four. It is not there. Please do not use it.\"" },
  green_door: { at: "corridor", scenery: true, name: "Green door", note: "Small, and breathing.", actions: ["Examine door", "Knock"],
    words: { nouns: ["door", "keyhole", "wood"], adj: ["green", "small", "little", "breathing", "tiny"] },
    examine: "The wood is warm, like skin. It rises and falls slowly, in time with your own breathing. Above it, a brass plaque: \"Knock only if you remember your name.\"" },
  loudspeaker: { at: "corridor", scenery: true, name: "Loudspeaker", note: "It murmurs.", actions: ["Listen"],
    words: { nouns: ["loudspeaker", "speaker", "voice"], adj: [] },
    examine: "\"You are content,\" it murmurs. \"You are content. You were always here.\"" },
  poster: { at: "corridor", scenery: true, name: "Poster", note: "A single red eye.", actions: ["Examine poster"],
    words: { nouns: ["poster", "eye", "words"], adj: ["red", "single", "watching"] },
    examine: "A single red eye above the words \"Content is mandatory.\" The eye blinks when you are not looking." },
  camera: { at: "corridor", scenery: true, name: "Camera", note: "Turned away.", actions: ["Examine camera"],
    words: { nouns: ["camera"], adj: ["security"] },
    examine: "It has turned away. For the first time in eleven years, nobody is watching you." },
  // The beach
  beach_door: { at: "beach", scenery: true, name: "Green door", note: "Standing in the sand, breathing.", actions: ["Examine door", "Enter door"],
    words: { nouns: ["door", "frame", "keyhole"], adj: ["green", "small", "breathing"] },
    examine: "The same door. From this side, too, it is breathing. Through the keyhole you can see grey lino and hear a loudspeaker." },
  lighthouse_far: { at: "beach", scenery: true, name: "Lighthouse", note: "Far off, dark.",
    words: { nouns: ["lighthouse", "tower", "lamp"], adj: ["dark", "far", "distant"] },
    examine: "Its lamp is dark. Nobody has lit it for a long time, and no ships come in." },

  // The tide line
  shell: { at: "tideline", portable: true, ...item("shell"), name: "Shell", note: "Pale, curled like an ear.",
    actions: ["Take shell", "Listen to shell"], heldActions: ["Examine shell", "Listen to shell"],
    listen: "You hold the shell to your ear. Very small, very far away, a loudspeaker: \"You are content. You are content. Lunch will be adequate.\"",
    words: { nouns: ["shell", "seashell", "conch"], adj: ["pale", "curled", "white"] },
    examine: "Pale and ridged, curled like an ear. Hold it to yours and you can hear, very small, a loudspeaker murmuring that you are content.",
    here: "Among the weed lies a {shell}, pale and curled like an ear." },
  glove: { at: "tideline", scenery: true, name: "Glove", note: "A left hand, grey wool.", take: "You leave it where the sea put it. It isn't finished giving it back.",
    words: { nouns: ["glove"], adj: ["grey", "gray", "wool", "woollen", "left"] },
    examine: "A grey wool glove for a left hand. It is still warm inside, as if someone had only just taken it off." },
  shoe: { at: "tideline", scenery: true, name: "Shoe", note: "A child's, red.", take: "You leave it where the sea put it. It isn't finished giving it back.",
    words: { nouns: ["shoe"], adj: ["red", "small", "child's", "childs"] },
    examine: "A small red shoe, buckled. You had a pair like it once. Yours had a scuff on the left toe. So does this one." },
  page: { at: "tideline", scenery: true, name: "Typed page", note: "A form, going soft.", take: "You leave it where the sea put it. It isn't finished giving it back.",
    words: { nouns: ["page", "form", "paper", "sheet"], adj: ["typed", "wet", "soggy", "sodden"] },
    examine: "A Ministry form. The ink has run. One line is still legible: \"Reason for leaving:\" The space after it is empty." },

  // The cave
  echo: { at: "cave", scenery: true, name: "Echo", note: "It answers late.", actions: ["Shout"],
    words: { nouns: ["echo"] }, examine: "You can't see it. You can only hear it waiting." },

  // The pier
  lifebuoy: { at: "pier", scenery: true, name: "Lifebuoy", note: "A name, painted over.",
    take: "It's tied to the post with a knot nobody has untied in years. You don't either.",
    words: { nouns: ["lifebuoy", "buoy", "ring", "lifering", "name", "paint"], adj: ["red", "white", "life"] },
    examine: "Red and white, cracked with salt. Under the new paint, the old name shows through. It has as many letters as yours." },
  lighthouse_near: { at: "pier_end", scenery: true, name: "Lighthouse", note: "On its rock, dark.",
    words: { nouns: ["lighthouse", "tower", "lantern"], adj: ["dark", "white"] },
    examine: "White, with a red band. Its lantern is dark. From here you can see the door at its foot is open." },
  boat: { at: "pier_end", scenery: true, container: true, name: "Rowing boat", note: "Small, blue, no oars.",
    actions: ["Examine boat", "Enter boat"], img: "boat", sprite: sprites.boat, floorSprite: sprites.boat_floor,
    words: { nouns: ["boat", "rowboat", "dinghy", "rowlocks"], adj: ["rowing", "small", "blue", "little"] },
    examine: "Small and blue, with a puddle in the bottom. It has rowlocks, but no oars.",
    here: "A small blue {rowing boat|boat} knocks against the ring." },

  // The huts
  hut: { at: "huts", scenery: true, container: true, locked: true, name: "Hut 7", note: "Freshly painted. Locked.",
    lock: { key: "key", says: "The padlock holds. It's new, and it was put there for a reason.",
            opens: "The key turns as if it had done it every morning. The door swings out, and the {oars} that were leaning on it slide gently onto the sand. Inside, on a nail, hangs a {photograph}.",
            then: "open_hut" },
    enter: "You step inside. It smells of rope and of summers. There's nothing else here but what you can see.",
    actions: ["Examine hut", "Open hut"],
    words: { nouns: ["hut", "7", "seven", "door", "padlock", "lock", "crack"], adj: ["bathing", "fresh", "freshly", "painted", "new", "number"] },
    examine: "Number 7, in blue. The padlock is new. Through a crack in the boards you can see the handle of an oar." },
  oars: { at: "hut", portable: true, ...item("oars"), name: "Oars", note: "Two, worn smooth.",
    actions: ["Take oars"], heldActions: ["Examine oars"],
    words: { nouns: ["oars", "oar", "paddles", "paddle"], adj: ["wooden", "two", "pair"], pl: true },
    examine: "Two oars, worn smooth where hands have held them. Your hands fit the worn places exactly.",
    here: "A pair of {oars} lies on the sand by the open hut." },
  photograph: { at: "hut", portable: true, ...item("photograph"), name: "Photograph", note: "A beach in daylight.",
    actions: ["Take photograph"], heldActions: ["Examine photograph"],
    words: { nouns: ["photograph", "photo", "picture", "snapshot", "nail"], adj: ["old"] },
    examine: "A beach in daylight. Someone in a striped bathing suit is laughing at whoever holds the camera. It is you, eleven years younger, in a life you don't remember having." },

  // The dunes
  radio: { at: "dunes", scenery: true, name: "Radio", note: "Somewhere. You can't see it.", actions: ["Listen"],
    listen: ["The song reaches the line about coming home, and starts again from the beginning.", "A woman sings that she is waiting. She has been waiting for some time.", "Between songs, a voice reads the shipping forecast for seas that have no names."],
    words: { nouns: ["radio", "song", "music"] },
    examine: "You can't see it. The song comes from everywhere in the dunes at once, like a smell." },

  // The carousel
  horse: { at: "carousel", scenery: true, name: "Grey horse", note: "7-B on the saddle.", actions: ["Examine horse", "Ride horse"],
    words: { nouns: ["horse", "saddle", "number"], adj: ["grey", "gray", "wooden"] },
    examine: "Grey, with a red saddle and a chipped ear. The number on the saddle is your desk number. The paint is fresh." },

  // The hotel
  keyboard: { at: "lobby", scenery: true, name: "Board of keys", note: "One hook is empty.",
    take: "Those belong to other people's rooms. Only one is yours, and it's not here.",
    words: { nouns: ["board", "keys", "hook", "hooks", "keyboard"], adj: ["empty"] },
    examine: "Brass hooks in rows, a key on each but one: number 11. Under the empty hook, in small letters: \"The guest has left the key in the door.\"" },
  bell: { at: "lobby", scenery: true, name: "Bell", note: "Brass, for service.", actions: ["Push bell"],
    push: "Ding. Nobody comes. Upstairs, a door opens and closes, politely.",
    words: { nouns: ["bell"], adj: ["brass", "service", "desk"] },
    examine: "A brass bell for service, polished by many hands." },
  guests: { at: "dining", scenery: true, name: "Guests", note: "At dessert, for a long time.", actions: ["Talk to guests"],
    topics: {
      postmaster: { words: ["postmaster", "post", "letters", "parcel"], says: "\"The postmaster?\" says a woman in green. \"He'll give you nothing without a name. Unless the sea vouches for you. It does, sometimes.\"" },
      lighthouse: { about: "lighthouse_far", words: ["lighthouse", "lamp", "light"], says: "\"The lighthouse,\" says a man, to nobody. \"My brother lit it once. He burned his wedding ring. Couldn't remember why he'd ever minded.\"" },
      hut: { words: ["hut", "huts", "7", "seven"], says: "\"Hut 7,\" says someone. \"Such a pretty colour. Who painted it, do you think?\" Nobody knows. Everybody looks at you." },
      default: "They consider it politely, and go back to their dessert."
    },
    talk: [
      "\"The postmaster?\" says a woman in green. \"He'll give you nothing without a name. Unless the sea vouches for you. It does, sometimes.\"",
      "\"The lighthouse,\" says a man, to nobody. \"My brother lit it once. He burned his wedding ring. Couldn't remember why he'd ever minded.\"",
      "\"Hut 7,\" says someone. \"Such a pretty colour. Who painted it, do you think?\" Nobody knows. Everybody looks at you.",
      "\"You're not staying for coffee?\" asks the man beside the empty chair. \"Nobody ever stays for coffee. The café does it better.\""
    ],
    words: { nouns: ["guests", "guest", "people", "diners", "man", "woman", "men", "women"], adj: ["dining"], pl: true },
    examine: "Twelve of them, in evening dress gone soft at the seams. They pass the salt, and laugh, and pass it back. None of them looks at the door." },
  chair: { at: "dining", scenery: true, name: "Empty chair", note: "Reserved.", actions: ["Read card", "Sit"],
    words: { nouns: ["chair", "seat", "place"], adj: ["empty", "near"] },
    examine: "An empty chair, pulled out a little, as if someone had just got up, or was about to sit down." },
  card: { at: "dining", scenery: true, name: "Card", note: "A place card.",
    words: { nouns: ["card"], adj: ["place", "name"] },
    examine: "A place card. A name has been written on it and rubbed out so many times the card has worn thin." },
  door11: { at: "hallway", scenery: true, name: "Door 11", note: "Ajar, the key in the lock.", actions: ["Enter door"], leads: "w",
    words: { nouns: ["door", "11", "eleven", "room"], adj: ["ajar", "open", "number"] },
    examine: "Number 11, in brass. It stands ajar. The key in the lock has a tag with the hotel's name, worn smooth." },
  window: { at: "room11", scenery: true, name: "Window", note: "On the sea.", actions: ["Look through window"],
    words: { nouns: ["window", "glass", "view"] },
    examine: "The sea, and on its rock, the lighthouse, dark. Someone has stood here often: there is a clean patch on the glass at the height of your eyes." },
  coat: { at: "room11", scenery: true, name: "Coat", note: "Your size, your colour.", actions: ["Search coat"],
    take: "You put it on. It fits perfectly. You take it off again: it belongs to someone braver.",
    words: { nouns: ["coat", "pocket", "pockets", "ticket"], adj: ["blue"] },
    examine: "Blue wool, your size. In the pocket, a bus ticket dated eleven years ago, to a town you have never been to. It was never used." },
  letter: { at: "room11", portable: true, ...item("letter"), name: "Letter", note: "In your handwriting.",
    actions: ["Take letter", "Read letter"], heldActions: ["Read letter"],
    words: { nouns: ["letter", "envelope", "note", "handwriting"] },
    examine: "In your handwriting: \"If you are reading this, you came after all. The postmaster keeps what's ours. He won't give anything to someone without a name, but he trusts the sea. Hut 7. The boat. The lamp burns what you are willing to forget. I couldn't choose. Maybe you can.\"",
    here: "On the pillow lies a {letter}." },

  // The square
  clock: { at: "square", scenery: true, name: "Clock", note: "A quarter past five.",
    turn: "It's too high to reach. And it isn't the clock that's stopped.",
    words: { nouns: ["clock", "hands", "pendulum", "face"], adj: ["town", "hall"] },
    examine: "Its hands are still at a quarter past five. Behind the face, a pendulum swings anyway, keeping time for nobody." },

  // The post office
  postmaster: { at: "post_office", scenery: true, name: "Postmaster", note: "Behind the grille.", actions: ["Talk to postmaster"],
    topics: {
      name: { open: true, label: "my name", words: ["name", "names", "my"], says: "\"Names are the sea's business,\" he says. \"It gives them back, when it's ready. Not before.\"" },
      sea: { open: true, words: ["sea", "shell", "beach"], says: "\"The sea knows where everyone's from,\" he says. \"It listens at the door.\"" },
      default: "He looks at you over his spectacles. \"That isn't post.\""
    },
    words: { nouns: ["postmaster", "postman", "man", "clerk"], adj: ["old"] },
    examine: "A small man in a blue cap and round spectacles. He sorts without looking, as if he knew where everything goes." },
  parcel: { at: null, portable: true, ...item("parcel"), name: "Parcel", note: "Addressed to you.",
    actions: ["Open parcel"], heldActions: ["Examine parcel", "Open parcel"],
    words: { nouns: ["parcel", "package", "packet", "string", "paper"], adj: ["small", "brown"] },
    examine: "Brown paper and string, a stamp with a lighthouse on it. Addressed in your handwriting: \"Level minus four. When you come.\"" },
  key: { at: null, portable: true, ...item("key"), name: "Key", note: "Brass, on a tag: 7.",
    actions: ["Examine key"], heldActions: ["Examine key"],
    words: { nouns: ["key", "tag"], adj: ["brass", "small", "7", "seven"] },
    examine: "A small brass key on a cardboard tag. On the tag, in your handwriting: 7." },

  // The café
  waiter: { at: "cafe", scenery: true, name: "Waiter", note: "Folding a napkin.", actions: ["Talk to waiter"],
    topics: {
      lighthouse: { about: "lighthouse_far", words: ["lighthouse", "lamp", "light"], says: "\"You used to sit there, by the window, and look at it,\" he says. \"You said one day you'd light it. You said it as if it were a joke.\"" },
      coffee: { words: ["coffee", "usual", "sugar"], says: "\"One sugar,\" he says. \"You always took one sugar. Then you stopped coming, and nobody took sugar at all.\"" },
      default: "He folds the napkin into a swan while he thinks about it, and unfolds it again. \"I only know about coffee, and about you.\""
    },
    talk: ["\"Drink it while it's hot,\" he says. \"It never stays hot for long. Nothing does, on Sundays.\"",
           "\"You used to sit by the window,\" he says. \"You used to talk about the lighthouse. Then one Sunday you didn't come.\""],
    words: { nouns: ["waiter", "man"], adj: ["old"] },
    examine: "Black jacket, white apron. He folds the napkin into a swan, unfolds it, and starts again. He looks at you as if you were late." },
  coffee: { at: null, portable: false, ...item("coffee"), name: "Coffee", note: "Hot.", actions: ["Drink coffee"],
    words: { nouns: ["coffee", "cup"], adj: ["hot", "black"] },
    examine: "Black, one sugar. You've never taken sugar.",
    here: "A {cup of coffee|coffee} steams on the table." },

  // The station
  train: { at: "station", scenery: true, name: "Train", note: "Doors open, engine asleep.", actions: ["Enter train"],
    enter: "You sit in the empty carriage among other people's coats. The train doesn't move. After a while you get off again. Some departures need more than a ticket.",
    words: { nouns: ["train", "carriage", "doors", "door"], adj: ["green", "sleeping", "empty"] },
    examine: "Green carriages, empty seats, the luggage racks full of other people's coats. The engine breathes slowly in its sleep." },
  timetable: { at: "station", scenery: true, name: "Timetable", note: "Every train: 5.15.",
    words: { nouns: ["timetable", "board", "times", "schedule"], adj: ["white"] },
    examine: "Three destinations, all leaving at 5.15, Sundays only: \"Adequate Happiness, via Level Minus Four.\" \"The Life You Did Not Live.\" \"Elsewhere.\"" },

  // The lantern room
  lamp: { at: "lantern", scenery: true, container: true, name: "Lamp", note: "The great lens, cold.", actions: ["Examine lamp", "Light lamp"],
    switch_on: "There is nothing to burn. The wick waits for something you are willing to forget.",
    words: { nouns: ["lamp", "lens", "wick", "light", "brass", "cup"], adj: ["great", "cold", "big"] },
    examine: "A wick in a brass cup, behind a lens as tall as a man. Scratched into the brass: \"I burn what you are willing to forget.\" The wick is dry." }
};

// ---- Rules ------------------------------------------------------------------------------------------------------

// Named changes: effects written once and run from any rule with { change: "name" } (ARCHITECTURE.md §5).
const changes = {
  // The green door turns to driftwood: the beach, the far view from the lantern room, and both sides' texts.
  driftwood: [
    { set: "beach_door.shut", to: true },
    { set: "beach_door.examine", to: "A piece of driftwood, stood upright in the sand, about the size of a small door. It isn't breathing." },
    { set: "beach_door.note", to: "Driftwood now." }, { set: "beach_door.actions", to: ["Examine door"] },
    { set: "beach.describe", to: [doorGone, seaDark, sand] },
    { set: "lantern.describe", to: [lampCold, farSand, down] },
    { draw: "beach", replace: ["poly door 151,101 161,99 160,118 150,120 mix:6,8@0.4 e0"],
      remove: ["knob", "door_light", "spill"],
      cycles: [{ name: "moon on the water", areas: ["moonpath", "moonpath2", "moonpath3", "moonpath4", "moonpath5"], colors: [9, 15, 1], style: "rotate", ms: 600 }] },
    { draw: "lantern", remove: ["far_door"], cycles: [] }
  ],
  // The lamp catches: the lens in the lantern room, and the lantern seen from the beach and the end of the pier.
  // (The room texts are rewritten by the endings, which know whether the door is still there.)
  lamp_lit: [
    { set: "lamp.note", to: "Lit." },
    { set: "lamp.examine", to: "The wick burns behind the great lens, and the light goes out over the water, and comes back, and goes out again." },
    { set: "lighthouse_far.examine", to: "Lit. Its beam turns, slow, over the water." },
    { set: "lighthouse_near.examine", to: "Lit. Its beam turns, slow, over the water." },
    { draw: "lantern", restyle: [{ id: "lamp", fill: { mix: [14, 15], level: 0.5 } }, { id: "wick", fill: 14 }],
      cycles: [{ name: "the lamp", areas: ["lamp"], colors: [14, 15], style: "pingpong", ms: 700 }] },
    { draw: "beach", restyle: [{ id: "lantern", fill: 14 }] },
    { draw: "pier_end", restyle: [{ id: "lantern", fill: 14 }] }
  ],
  // Hut 7 opens (run by its lock, once the key turns).
  open_hut: [
    { set: "hut.examine", to: "Number 7, its door open. Inside: a smell of rope and summers, a nail on the wall, and the shape in the dust where the oars stood." },
    { set: "hut.note", to: "Open." }, { set: "hut.actions", to: ["Examine hut"] },
    { move: "oars", to: "huts" },
    { draw: "huts", replace: ["rect hut_door 168,74,16,26 0 e1"], remove: ["padlock"], add: ["rect nail_photo 173,80,6,5 15 e8 after:hut_door", "poly oars_shaft 138,110 168,113 168,116 138,113 7", "ellipse oars_blade 172,115,5,2 15"] }
  ],
  // Crossing to the lighthouse and back.
  row_out: [{ move: "oars", to: "boat" }, { move: "boat", to: "lighthouse_base" },
    { say: "You row. The pier gets smaller, then the town, then the green light of the door. The lighthouse gets larger, and quieter, and then you are there." },
    { travel: "lighthouse_base" }, { describe: "$here" }],
  row_back: [{ move: "boat", to: "pier_end" },
    { say: "You row back. The town comes up out of the dark to meet you, exactly as you left it." },
    { travel: "pier_end" }, { describe: "$here" }],
  // The two endings at the lamp.
  end_photograph: [{ remove: "object", id: "photograph" }, { change: "lamp_lit" },
    { set: "beach.describe", to: [doorStands, seaLit, sand] }, { set: "lantern.describe", to: [lampLit, farDoor, down] },
    { say: "The photograph curls in the brass cup and catches. The light is enormous. It goes out over the water and sweeps the town, every window, every hut, the face in each one. When it has passed, you can't remember what you were looking for." },
    { say: "You are at your desk, level minus four. The corridor is grey, the lino is grey, the light is grey. The loudspeaker murmurs that you are content. You find that you very nearly are." },
    { end: true, picture: "photograph" }],
  end_shell: [{ remove: "object", id: "shell" }, { change: "lamp_lit" },
    { set: "beach.describe", to: [doorGone, seaLit, sand] }, { set: "lantern.describe", to: [lampLit, farSand, down] },
    { say: "The shell burns with a small blue flame, and the loudspeaker in it says \"You are\" and nothing else. The light goes out over the water. On the beach, the green door closes, and is a piece of driftwood." },
    { say: "In the town, the clock moves: a quarter past five, twenty past. Monday is coming, and nobody here knows what happens on Monday. Across the water, from somewhere near the door, your name comes back to you." },
    { end: true, picture: "shell" }],
  // The last line of every ending.
  over: []
};
const oarsReady = { "oars.at": { in: ["player", "boat"] } };

// Tried in order, before the standard verbs. Rules added with `before` go ahead of the corridor's rule of that id.

const rules = [
  // -- Going through the door, both ways -----------------------------------------------------------------------
  { id: "beach_door_knock", match: { verb: "knock", obj: "beach_door" },
    do: [{ say: "You knock. From the other side, after a while, three knocks come back." }] },
  { id: "beach_through", match: { verb: ["enter", "go", "open", "push"], obj: "beach_door" },
    do: [{ say: "You kneel at the door. It is a door only from the other side; from here it opens onto sand." }] },

  // -- Help, outside the corridor --------------------------------------------------------------------------------
  { id: "help_town", match: { verb: "help" },
    do: [{ say: "Look around, and examine what the text mentions: `Examine shell`, `Read letter`. Talk to people: `Talk to waiter`. Things can be given, shown, put in other things: `Give shell to postmaster`, `Put oars in boat`. `Inventory` shows what you carry." }] },

  // -- The tide line ------------------------------------------------------------------------------------------------

  // -- The cave: whatever you say comes back, wrong ---------------------------------------------------------------
  { id: "cave_voice", match: { verb: ["shout", "say", "sing", "talk", "ask", "think"] }, if: [at("cave")],
    do: [{ say: [
      "The cave answers with a name. It isn't yours. It sounds like it could have been.",
      "From the dark, late, and in your own voice: \"It burns what you are willing to forget.\"",
      "The cave repeats what you said, and then something you didn't say, very quietly: \"Hut 7.\"",
      "The echo comes back as laughter. Somebody else's, on a beach, in daylight."
    ] }] },

  // -- The pier --------------------------------------------------------------------------------------------------

  // -- Swimming: the cold takes hold at once, holds on longer each time, and the last time keeps you ---------------------------------------------------------------------
  { id: "swim_drown", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } },
      { "player.health": { "<=": 2 } }],
    do: [{ say: "The cold closes over you, gently, the way it closes over everything. The sea takes you in. In its own time, it will give you back." },
         { hurt: 5, says: "The cold takes the last of you." }, { end: true, picture: "drowned" }] },
  { id: "swim_hurt_last", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } }, { "player.health": { "<=": 4 } }],
    do: [{ say: "You go in again. This time the thing underneath holds on longer before it lets go. You crawl out onto the sand knowing, the way you know your own handwriting, that next time it won't." },
         { hurt: 2, says: "It held on longer this time." }] },
  { id: "swim_hurt", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } }],
    do: [{ say: "You go in. The cold is total. Something underneath takes your ankle, considers you, and lets go. You come out on the sand, coughing, and shaking, and less than you were." },
         { hurt: 2, says: "Its grip has left a mark." }] },
  { id: "swim_dry", match: { verb: "swim" }, do: [{ say: "There's no water here to swim in." }] },

  // -- The huts: the key from the parcel opens hut 7 -----------------------------------------------------------
  { id: "hut_photo", match: { verb: ["examine", "search", "look"], obj: "hut" }, if: [{ "hut.open": true }, { "photograph.at": "hut" }],
    do: [{ say: "$hut.examine" }, { say: "On a nail inside hangs a {photograph}." }] },
  { id: "photo_taken", match: { verb: "take", obj: "photograph" }, if: [{ "photograph.at": "hut" }],
    do: [{ move: "photograph", to: "player" }, { draw: "huts", remove: ["nail_photo"] }, { say: "You take it down from the nail. It comes away as if it had been waiting." }] },

  // -- The boat: oars in it, then row --------------------------------------------------------------------------
  // The oars lie on the sand by the hut as shapes in its picture: taking them removes the shapes, dropping them there redraws them.
  { id: "oars_up", match: { verb: "take", obj: "oars" }, if: [{ "player.at": "huts" }, { "oars.at": "huts" }],
    do: [{ draw: "huts", remove: ["oars_shaft", "oars_blade"] }], then: "default" },
  { id: "oars_down", match: { verb: "drop", obj: "oars" }, if: [{ "player.at": "huts" }, { "oars.at": "player" }],
    do: [{ draw: "huts", add: ["poly oars_shaft 138,110 168,113 168,116 138,113 7", "ellipse oars_blade 172,115,5,2 15"] }], then: "default" },
  { id: "oars_in_boat", match: { verb: ["put", "use"], obj: "oars", obj2: "boat" }, if: [holding("oars")],
    do: [{ move: "oars", to: "boat" }, { set: "boat.examine", to: "Small and blue, the oars in the rowlocks, ready." },
         { say: "You set the oars in the rowlocks. They fit as if they'd been waiting." }] },
  { id: "oars_from_boat", match: { verb: "take", obj: "oars" }, if: [{ "oars.at": "boat" }],
    do: [{ move: "oars", to: "player" }, { set: "boat.examine", to: "Small and blue, with a puddle in the bottom. It has rowlocks, but no oars." }, { say: "You take the oars back." }] },
  { id: "row_out", match: { verb: ["row", "enter"], obj: [null, "boat", "oars"] }, if: [at("pier_end"), oarsReady], do: [{ change: "row_out" }] },
  { id: "row_out_use", match: { verb: "use", obj: ["boat", "oars"], obj2: [null] }, if: [at("pier_end"), oarsReady], do: [{ change: "row_out" }] },   // (USE with a second thing is put, unlock or give)
  { id: "row_out_north", match: { verb: "go", dir: "n" }, if: [at("pier_end"), oarsReady], do: [{ change: "row_out" }] },
  { id: "row_back", match: { verb: ["row", "exit"], obj: [null, "boat", "oars"] }, if: [at("lighthouse_base")], do: [{ change: "row_back" }] },
  { id: "row_back_boat", match: { verb: ["enter", "use"], obj: ["boat", "oars"] }, if: [at("lighthouse_base")], do: [{ change: "row_back" }] },
  { id: "row_back_south", match: { verb: "go", dir: "s" }, if: [at("lighthouse_base")], do: [{ change: "row_back" }] },
  { id: "lighthouse_in", match: { verb: ["enter", "climb"], obj: [null] }, if: [at("lighthouse_base")],
    do: [{ say: "You go in and climb. The staircase turns, and turns, and you count the steps until you lose count." }, { travel: "lantern" }, { describe: "$here" }] },
  { id: "row_no_oars", match: { verb: ["row", "enter"], obj: [null, "boat"] }, if: [at("pier_end")],
    do: [{ say: "You sit in the boat. Without oars it goes nowhere. The sea rocks it, patiently, like a cradle no one is watching." }] },
  { id: "row_nowhere", match: { verb: "row" }, do: [{ say: "There's nothing here to row." }] },

  // -- The dunes -------------------------------------------------------------------------------------------------

  // -- The carousel: one ride ------------------------------------------------------------------------
  { id: "ride", match: { verb: ["ride", "climb", "sit", "enter"], obj: [null, "horse"] }, if: [at("carousel"), { "horse.rode": { "!=": true } }],
    do: [{ set: "horse.rode", to: true }, { say: [
      "You ride once round. Each time you pass the promenade, a different window of the hotel is lit, and in each one, someone who looks like you is looking out.",
      "You ride. The tune slows almost to a stop and starts again. For a whole turn you are a child, and someone is waving.",
      "Round you go. The lighthouse, the hotel, the sea; the lighthouse, the hotel, the sea. It's very calming, for a carousel nobody is on."
    ] }] },

  { id: "ride_again", match: { verb: ["ride", "climb", "sit", "enter"], obj: [null, "horse"] }, if: [at("carousel")],
    do: [{ say: "You ride again. It is only a carousel now, and it goes round." }] },

  // -- The hotel ------------------------------------------------------------------------------------------------
  { id: "dining_stuck", match: { verb: ["go", "exit", "enter"] }, if: [{ "player.seated": true }],
    do: [{ say: "You can't think of a polite way to leave while you're sitting down. The conversation has turned warmly towards you." }] },
  { id: "dining_sit", match: { verb: ["sit", "enter"], obj: [null, "chair"] }, if: [at("dining"), { "player.seated": { "!=": true } }],
    do: [{ set: "player.seated", to: true },
         { say: "You sit. Someone passes you the salt. The conversation turns towards you, and it is warm, and it is very hard to think of a reason to get up." }] },
  { id: "dining_stand", match: { verb: ["stand", "exit"] }, if: [{ "player.seated": true }],
    do: [{ set: "player.seated", to: false }, { say: "You stand. Nobody minds. Nobody notices. It is surprisingly easy, which is somehow worse." }] },
  { id: "hallway_door", match: { verb: ["enter", "go", "open", "push"], obj: "door11" },
    do: [{ travel: "room11" }, { describe: "$here" }] },
  { id: "letter_read", match: { verb: ["read", "examine"], obj: "letter" }, once: true,
    do: [{ say: "$obj.examine" }] },

  // -- The post office: no name, no post; the shell vouches for you ---------------------------------------------
  { id: "post_shell", match: { verb: ["give", "show"], obj: "shell" }, if: [at("post_office"), holding("shell"), { "postmaster.gave": { "!=": true } }],
    do: [{ set: "postmaster.gave", to: true }, { move: "parcel", to: "player" },
         { say: "He holds the shell to his ear and listens for a long time. \"Level minus four,\" he says at last. \"We've had something for you for years.\" He hands back the shell, and slides a small {parcel} under the grille." }] },
  { id: "post_talk_done", match: { verb: ["talk", "ask", "say"], obj: [null, "postmaster"] }, if: [at("post_office"), { "postmaster.gave": true }, notAsking],
    do: [{ say: "\"That's everything that was yours,\" he says. \"The rest is still addressed to somebody else.\"" }] },
  { id: "post_talk", match: { verb: ["talk", "ask", "say"], obj: [null, "postmaster"] }, if: [at("post_office"), notAsking],
    do: [{ say: "\"Name?\" he asks. You open your mouth. Your name is with a door on the beach. \"No name, no post,\" he says, not unkindly. \"Unless someone can vouch for where you're from.\"" }] },
  { id: "post_shell_again", match: { verb: ["give", "show"], obj: "shell" }, if: [at("post_office"), { "postmaster.gave": true }],
    do: [{ say: "\"I've listened,\" he says. \"You have everything that was yours.\"" }] },
  { id: "post_give_other", match: { verb: ["give", "show"], obj2: "postmaster" },
    do: [{ say: "He looks at it over his spectacles and slides it back. \"That doesn't say where you're from.\"" }] },
  { id: "parcel_open", match: { verb: ["open", "search", "attack"], obj: "parcel" }, if: [holding("parcel")],
    do: [{ remove: "object", id: "parcel" }, { move: "key", to: "player" },
         { say: "Inside, wrapped in a page of the Ministry newsletter, is a small brass {key} on a tag. On the tag, in your handwriting: 7." }] },

  // -- The café: the coffee ----------------------------------------------------------------------------
  { id: "cafe_order", match: { verb: ["talk", "ask", "order", "say", "drink"], obj: [null, "waiter", "coffee"] }, if: [at("cafe"), { "coffee.at": { "!=": "cafe" } }, { "coffee.had": { "!=": true } }, notAsking],
    do: [{ move: "coffee", to: "cafe" }, { say: "Before you can say anything, he puts a {cup of coffee|coffee} on the table. \"The usual,\" he says. You have never been here before." }] },
  { id: "coffee_drink", match: { verb: ["drink", "eat", "take", "taste"], obj: "coffee" }, if: [{ "coffee.at": "cafe" }],
    do: [{ move: "coffee", to: null }, { set: "coffee.had", to: true }, { heal: 1, says: "It tastes of a morning you didn't have. Your hands stop shaking. You hadn't noticed they were shaking." }] },

  { id: "cafe_again", match: { verb: ["order", "ask"], obj: ["waiter", "coffee"] }, if: [at("cafe"), { "coffee.had": true }, { "coffee.at": null }],
    do: [{ say: "\"The usual,\" he says, and looks at the napkin. \"You've had it. It's all there is, on a Sunday.\"" }] },

  // -- The square and the station -------------------------------------------------------------------------------
  { id: "station_south", match: { verb: "go", dir: "s" }, if: [at("station")],
    do: [{ say: "You follow the rails a little way. Where they stop, the dark goes on, and there's nothing to walk on. You come back." }] },
  { id: "pier_end_north", match: { verb: "go", dir: "n" }, if: [at("pier_end")],
    do: [{ say: "There's only water that way. The boat could take you, with something to row it." }] },

  // -- The lantern room: what you are willing to forget ----------------------------------------------------------
  { id: "burn_photograph", match: { verb: ["put", "burn", "throw", "give", "use"], obj: "photograph", obj2: [null, "lamp"] }, if: [at("lantern"), holding("photograph")], do: [{ change: "end_photograph" }] },
  { id: "light_photograph", match: { verb: "switch_on", obj: "lamp", obj2: "photograph" }, if: [at("lantern"), holding("photograph")], do: [{ change: "end_photograph" }] },
  { id: "burn_shell", match: { verb: ["put", "burn", "throw", "give", "use"], obj: "shell", obj2: [null, "lamp"] }, if: [at("lantern"), holding("shell")], do: [{ change: "driftwood" }, { change: "end_shell" }] },
  { id: "light_shell", match: { verb: "switch_on", obj: "lamp", obj2: "shell" }, if: [at("lantern"), holding("shell")], do: [{ change: "driftwood" }, { change: "end_shell" }] },
  { id: "burn_other", match: { verb: ["put", "burn", "throw", "give"], obj2: "lamp" }, if: [at("lantern")],
    do: [{ say: ["The lamp won't take it. That isn't something you could forget.", "The wick stays dry. Not that. Something you would miss."] }] },
  { id: "burn_any", match: { verb: "burn" }, if: [at("lantern")],
    do: [{ say: "The lamp burns only what you are willing to forget. You have to choose it, and put it in." }] },
  { id: "burn_nothing", match: { verb: "burn" }, do: [{ say: "You have nothing to burn it with." }] },

];

// ---- Puzzles, described as data (GUIDE.md §3) --------------------------------------------------------------
// The rules above do the work; this says what each puzzle needs, the commands that solve it and what it gives, so
// js/check.js can play every ending through the real parser and engine. Clues name the objects, rules or puzzles
// that point at it.
const puzzles = {
  vouch:      { where: "post_office", needs: ["shell"], solve: ["give shell to postmaster"], gives: ["parcel"],
                clues: ["letter", "guests", "post_talk"],
                hints: ["The postmaster gives nothing to anyone without a name, but he trusts the sea. Something the tide left on the sand might speak for you.", "Carry the pale shell from the tide line to the post office and let the postmaster hear it."] },
  open_parcel: { needs: ["parcel"], solve: ["open parcel"], gives: ["key"], clues: ["parcel", "post_shell"],
                hints: ["The parcel is addressed in your handwriting, and the string is only string.", "Undo the parcel in your hands; what is inside is small and brass."] },
  open_hut:   { where: "huts", needs: ["key"], solve: ["unlock hut with key"], gives: ["oars", "photograph"],
                clues: ["letter", "cave_voice", "hut"],
                hints: ["One bathing hut is freshly painted, as if somebody were expected, and its padlock is new. Your tag says seven.", "The brass key from the parcel belongs to the padlock on hut 7, at the bathing huts. Inside, take what you find."] },
  row_out:    { where: "pier_end", needs: ["oars"], solve: ["put oars in boat", "row"], reaches: "lighthouse_base",
                clues: ["boat", "letter", "lighthouse_near"],
                hints: ["The boat at the end of the pier has rowlocks and nothing to put in them. Hut 7 kept something worn smooth by hands like yours.", "Bring the oars from hut 7 to the boat at the end of the pier, set them in the rowlocks, and row out to the lighthouse."] },
  forget_photograph: { where: "lantern", needs: ["photograph", "row_out"], solve: ["put photograph in lamp"], ending: true,
                clues: ["lamp", "letter", "guests"],
                hints: ["The lamp burns only what you are willing to forget. One thing you carry is a life you did not have.", "In the lantern room, feed the photograph from hut 7 to the lamp."] },
  forget_shell: { where: "lantern", needs: ["shell", "row_out"], solve: ["burn shell"], ending: true,
                clues: ["lamp", "letter", "cave_voice"],
                hints: ["The lamp is not particular, only that you choose. One thing you carry is the sea speaking for you, and the Ministry still inside it.", "In the lantern room, burn the shell from the tide line, and let the Ministry forget you."] }
};

// ---- The opening, declared (BRIEF.md §3): the ids of its room and three things, and the lines it says --------------------
const opening = {
  room: "corridor", hints: "suggestion_box", intro: "memo", way: "green_door",
  lines: {
    notYet: "The breathing pauses. \"You'll want someone to talk to,\" says a voice from very far away. \"The suggestion box still listens.\"",
    through: "You kneel and knock three times. The breathing stops. From very far away a voice asks: \"What is your name?\" You tell it, and it keeps the name. The brass plaque softens and drips onto the lino, and the door swings inward. It is very small, and then it isn't.",
    hintFrame: "You put your ear to the slot. Someone elsewhere in the Ministry reads out a suggestion:",
    farewell: "The memo creases along its folds, one by one, as if being filed, and is not in your hand."
  }
};

// ---- The change set -----------------------------------------------------------------------------------------
export default {
  because: "The player gave their name at the green door; the world behind it is built.",
  opening,
  // The properties this world's rules keep (ARCHITECTURE.md §3, "Fields and properties"); the engine's own aren't declared.
  properties: {
    "coffee.had": { type: "boolean", start: false },        // the one coffee has been drunk
    "horse.rode": { type: "boolean", start: false },        // the one ride has been taken
    "beach_door.shut": { type: "boolean", start: false },   // the green door has turned to driftwood
    "player.seated": { type: "boolean", start: false },   // you are sitting at the dining table
    "postmaster.gave": { type: "boolean", start: false }   // the postmaster has handed over the parcel
  },
  facts: [
    "Behind the green door: a beach at night, a seaside town on an endless Sunday, a dark lighthouse.",
    "The player's name stays with the door; nobody in the town can be told it.",
    "The lighthouse lamp burns only what the player is willing to forget: the photograph, or the shell."
  ],
  effects: [
    { time: "day 1 08:55", weekday: "mon" },                 // the opening is a Monday morning at the Ministry
    // What arriving does: the town's time, and its first line.
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:15", weekday: "sun" },
      { say: "The air is salt. Somewhere a clock says [time], and it is Sunday, and nobody minds." }
    ] },
    // Verbs only this world needs
    { add: "word", verb: "row", words: ["row", "scull", "row to", "row back"] },
    { add: "word", verb: "swim", words: ["swim", "bathe", "dive", "wade", "go swimming", "swim in"], object: "optional" },
    { add: "word", verb: "burn", words: ["burn", "set fire to", "set alight", "incinerate", "sacrifice", "forget"] },
    { add: "word", verb: "ride", words: ["ride", "mount", "ride on", "get on"] },
    { add: "word", verb: "order", words: ["order", "ask for"], absent: true },   // "order coffee": it isn't here yet

    // Puzzles (descriptions, for the checker)
    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),

    // Named changes (run by rules with { change: name })
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),

    // Rooms, objects and rules
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule })),

    // Where the opening's way on leads.
    { set: "game.entrance", to: "beach" }
  ]
};
