// "The Lake Lights It Again": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md only). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js?v=0.48.3";
import music, { rooms as roomMusic } from "./music.js?v=0.48.3";
import levels from "./levels.js?v=0.48.3";
import sprites from "./sprites.js?v=0.48.3";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Lake Lights It Again",
  blurb: "A lake village at the end of the day. The boathouse is locked, the boatman has not come home, and every lit window above is lit again below, a little late.",
  thumbnail: { picture: "quay", x: 30 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  synopsis: "You come down a stopped funicular to the quay of a lake village, carrying a ferry ticket for one crossing at nightfall. " +
    "Teodor the boatman rowed out to light the lamp on the island one evening and has not come back, and the village keeps his " +
    "hours for him: his boathouse locked, his chair empty, his lantern dry. The lake lights every window again below the village, " +
    "a little late, and tonight it has one lamp more than the village does.",
  tone: "The everyday, slightly wrong (BRIEF §6): a small lake village that keeps a missing man's habits as if he were late, not gone. " +
    "Plain, tender and dry. Water, wood, lamp oil and slate. Nobody is amazed that the lake keeps lights.",
  start: "Sunday, 17:10, on the quay (the opening, in the funicular car, at 16:40).",
  opening: "A funicular car stopped in its tunnel: a green bottle with a voice in it (hints), a ferry ticket you already carry (why you came). " +
    "The iron grille at the lower end, on a bright arch, is the way on.",
  music: "wistful dorian; a bottle played like a flute, a chapel bell, oarlocks knocking in the dark; the village heard across water",
  rules: [
    "Whatever the village lights, the lake lights again, a little late.",
    "A boat leaves the shore only for someone who carries a light of their own.",
    "Once the windows are lit, the water shows a street where there is none, and the street goes on past the shore.",
    "The village keeps Teodor's hours for him: the dry lantern, the empty chair, the padlock, as if he were only late."
  ],
  characters: ["Mrs Pell, who keeps the Heron and is not waiting", "Teodor, the boatman, who is late"],
  places: ["a funicular tunnel", "the quay", "the boathouse and its loft", "the jetty", "the lane", "the Heron", "the churchyard"],
  endings: [
    "The lamp: row out at night with a light and the oars, and light the island's lamp; the lake has its last window.",
    "The keeper: hang the lit lantern at the jetty post, and a boat comes in out of the dark with nobody at the oars.",
    "The street: walk out along the reflected street past the end of the jetty."
  ],
  chaos: 0.15
};

// Carried things get their sprites (sprites.js): the one shown when examined, and the one drawn on the floor.
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- The ending pictures ---------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here.
const endingPictures = {
  lamp: { alt: "A small island in a black lake at night, a lamp-post on it burning white, and the whole village shining upside down in the water below it, every window lit.", picture: endings.lamp },
  keep: { alt: "A jetty at dusk with a lit lantern hanging from its post, and a small empty rowing boat coming in over the water with its oars shipped.", picture: endings.keep },
  street: { alt: "A pale moon over a black lake, and a street of lit windows laid across the water, going out and out, past the end of the jetty.", picture: endings.street }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "car": the opening, never returned to; it faces north, down the tunnel. Area "shore": the quay (the lake lies north of it),
// the boathouse (and its loft above) east of it, the jetty running north into the lake. Area "village" (the hill rises south of
// the quay): the lane, the Heron east of it, the churchyard south, up the hill. Every picture faces north.
const rooms = {
  car: {
    name: "THE FUNICULAR", area: "car", at: [0, 0, 0],
    describe: [
      "A funicular car, stopped halfway down the hill in the dark of its tunnel. A lamp burns in the roof, and the brickwork drips onto the cable as it has since before there was a cable.",
      "Slatted benches line the walls, and a wet window looks onto brick. Ahead, the tunnel opens on a bright arch, closed by an iron {grille}, and nothing else is open."
    ],
    exits: { n: true },
    scenery: [
      { words: ["bench", "benches", "slats", "seat", "seats"], name: "the benches", says: "Slatted wood, worn pale by people who sat very still. The last place on the bench is warm." },
      { words: ["window", "pane", "sash"], name: "the window", says: "Wet on the outside only. Beyond it, the brick goes by, though the car does not move." },
      { words: ["lamp", "bulb", "roof"], name: "the lamp", says: "A small bulb in a wire cage. It burns without any sound at all, which is how you know it is not electric." },
      { words: ["cable", "rope", "wire"], name: "the cable", says: "A grey cable, stretched down through the floor into the dark, humming a single note that is not the note it hummed yesterday." },
      { words: ["tunnel", "brick", "bricks", "brickwork", "wall", "walls"], name: "the tunnel", says: "Soot-black brick, dripping. Someone has scratched a boat into it, and under the boat a smaller boat." },
      { words: ["arch", "daylight", "light"], name: "the arch", says: "A bright half-circle at the foot of the tunnel, gold at the top and blue at the bottom, like a picture of somewhere you were going." }
    ],
    ambience: { lines: [
      "A drop falls from the brickwork onto the cable and rings, very small, all the way down.",
      "The car settles a finger's width on its brake, as if somebody on the quay had pulled a rope.",
      "The bulb gutters and recovers, and the benches seem to have moved up one place.",
      "Far below, a bell tolls three times and then, correcting itself, once."
    ], every: [25, 60] },
    alt: "Looking north down a brick funicular tunnel from inside the car: benches on either side, a lit lamp in the roof, a wet window, an iron grille half across a bright arch at the far end.",
    overlayAlt: { bottle: "A green bottle stands on the bench, a small light moving in it." }
  },
  quay: {
    name: "THE QUAY", area: "shore", at: [0, 0, 0],
    describe: [
      "The quay at the foot of the village, where the hill runs out of rope and into water. The lake lies flat to the north, against the stones, and takes its colour from whatever is above it.",
      "East stands the tarred {boathouse door|boathouse_door}, chained and padlocked. Nets hang on a rack to the west, and floats are stacked under the wall. A jetty runs north into the lake. Steps climb south to the village."
    ],
    exits: { e: { to: "boathouse", in: true }, n: "jetty", s: "lane" },
    scenery: [
      { words: ["lake", "water", "waves", "stones"], name: "the lake", says: "Flat, wide and in no hurry. It keeps a little of everything it has been shown." },
      { words: ["nets", "net", "rack"], name: "the nets", says: "Brown nets hung to dry on a rack of poles. They have been dry for a long time and nobody has taken them in." },
      { words: ["floats", "float", "buoys"], name: "the floats", says: "Cork floats, stacked like loaves, each with a name painted on it that has been painted over." },
      { words: ["steps", "stair", "stairs", "village"], name: "the steps", says: "Stone steps, worn into shallow bowls, going up beside the rails. Every bowl holds a little water, whatever the weather.", leads: "s" },
      { words: ["rails", "rail", "funicular", "station"], name: "the funicular", says: "Two rails go up the hill into a tunnel mouth. The lower station is a bench and a bell, and the bell has no rope." },
      { words: ["jetty", "planks"], name: "the jetty", says: "Grey planks on grey piles, going out to a post.", leads: "n" }
    ],
    ambience: { lines: [
      "A rope tied to nothing slaps against a ring in the quay wall.",
      "Water talks to the stones in a low voice, and stops when you listen.",
      "A float rolls a quarter turn on its stack, and settles on its painted-over name.",
      "Up the hill behind you, a window shuts, and a little later, out on the water, a window shuts."
    ], every: [35, 75] },
    alt: "Looking north from a stone quay over a wide lake in the low sun: a rack of nets on the left, a jetty running out into the water ahead, a small island with a lamp-post, and a tarred boathouse with a chained door on the right.",
    overlayAlt: {}
  },
  boathouse: {
    name: "THE BOATHOUSE", area: "shore", at: [1, 0, 0],
    describe: [
      "Inside the boathouse it is brown and dry and smells of tar. The big lake doors stand open at the far end, on the water.",
      "A small {boat} rests on its slip, rowlocks empty, facing the lake. Ropes, floats and a row of hooks hang on the walls, and a {ladder|boat_ladder} climbs to the loft. The quay is west."
    ],
    exits: { w: "quay", u: "loft" },
    scenery: [
      { words: ["doors", "lake doors", "lake"], name: "the lake doors", says: "Two tall tarred doors, hooked back against the walls. Through them the lake looks like a larger room that belongs to this one." },
      { words: ["slip", "slipway", "rails", "planks", "floor"], name: "the slip", says: "A slope of planks running down into the water, greased with a thin green shine." },
      { words: ["ropes", "rope", "coils"], name: "the ropes", says: "Coils of rope on pegs, one for each of the old boats. Most of the pegs are bare." },
      { words: ["floats", "float"], name: "the floats", says: "Glass floats in a net on the wall. In each, a small green room with the lake in it." },
      { words: ["hooks", "hook", "wall", "walls"], name: "the hooks", says: "A row of brass hooks, one for each thing a boatman carries. Every hook but one has its thing." }
    ],
    waitFor: { time: "next 21:00", says: "You sit in the boat's shadow and wait, and the lake lays its light along the slip a little later than the village does.", if: [{ "time.hour": { between: [6, 21] } }] },
    ambience: { lines: [
      "The slip ticks as the planks cool, one by one, like someone counting.",
      "Water laps the end of the slip and leaves a little more of itself on it each time.",
      "The boat shifts on its keel-blocks, and settles facing the other way.",
      "A hook swings once on the wall, though nothing has touched it."
    ], every: [30, 70] },
    alt: "Inside a tarred boathouse, looking north down the slip to the open lake doors: a small rowing boat on the slip at the left, a door to the quay, ropes, floats and a row of hooks on the left wall, a ladder and a shelf on the right, and the lake in the low sun beyond the doors.",
    overlayAlt: { lantern: "A brass lantern hangs from a hook by the door." }
  },
  loft: {
    name: "THE LOFT", area: "shore", at: [1, 0, 1],
    describe: [
      "Under the roof the boathouse keeps what it doesn't use: sails gone to soft folds, a coil of chain, a lamp bracket with no lamp. A round window looks out over the lake.",
      "Dust lies on everything but a path from the {ladder|loft_ladder} to the window, which has been walked a great many times by somebody who stopped each time at the glass. The ladder goes down."
    ],
    exits: { d: "boathouse" },
    scenery: [
      { words: ["sails", "sail", "folds", "canvas"], name: "the sails", says: "Grey canvas, folded as small as sails go. They smell of a wind that stopped." },
      { words: ["chain", "coil"], name: "the chain", says: "Links as big as your wrist, rusted into one piece with the floor." },
      { words: ["bracket", "lamp"], name: "the bracket", says: "An iron arm for a lamp, bolted to a rafter. The bolts are bright, as if the lamp had been taken down this morning." },
      { words: ["window", "glass"], name: "the window", says: "Round, and thick as a bottle. Looking through it, the lake is a little nearer than it is." },
      { words: ["rafters", "rafter", "roof", "beams"], name: "the rafters", says: "Black with tar and old smoke. Two of them are worn pale in the middle, as if something long had been laid there and lifted often." },
      { words: ["path", "dust", "floor"], name: "the dust", says: "A path in the dust from the ladder to the window. Not a path back." }
    ],
    ambience: { lines: [
      "A rafter ticks in the warmth under the roof, and another answers it.",
      "Something small turns over in the sails, and is only dust.",
      "Through the round window, the lake shows you the loft, upside down, with someone standing in it.",
      "The boards give a little by the window, in the shape of a pair of feet."
    ], every: [30, 65] },
    alt: "A boathouse loft under the slope of the roof, looking north: a round window full of lake in the end wall, folded sails on the left, a chain and an empty lamp bracket on the right, oars lying across the beams, a ladder hole in the floor.",
    overlayAlt: {}
  },
  jetty: {
    name: "THE JETTY", area: "shore", at: [0, -1, 0],
    describe: [
      "A jetty of grey planks runs north into the lake, further than it needs to. Far across the water an island sits low, with a dark lamp-post on it.",
      "A mooring {post|post} stands at the end, with a hook on it. The jetty's {reflection|street} lies upside down between the piles, and reeds stand along the shore. The quay is south."
    ],
    exits: { s: "quay", n: { to: true, if: { "time.hour": { between: [19, 6] } }, closed: "The planks end, and the lake below them is brown and cold and has nothing to walk on. The lamps are not lit yet." } },
    scenery: [
      { words: ["lake", "water", "ripples"], name: "the lake", says: "Close to, it is brown and clear at once, so that you see the piles going down into it and the planks reflected, upside down, between." },
      { words: ["island", "lamp-post", "lamppost", "far"], name: "the island", says: "A low hump of reeds and one iron lamp-post, a mile out. The lamp on it has been dark for as long as Teodor has been late." },
      { words: ["reeds", "reed", "shore", "dinghy"], name: "the reeds", says: "Reeds along the shore, and a dinghy tied among them, its rope run out to a pile. It is tied the way a boat is tied by somebody who means to come back." },
      { words: ["planks", "piles", "jetty"], name: "the planks", says: "Grey, split and sound. Someone has hammered each nail head a little crooked, so that the whole jetty leans out to see." },
      { words: ["hook"], name: "the hook", says: "A brass hook screwed into the post at lamp height. The brass is bright at the tip, like a key that is used." }
    ],
    ambience: { lines: [
      "A plank creaks at the far end, under no weight at all.",
      "The water slaps a pile twice, and waits for an answer.",
      "A fish rises somewhere out in the lake, and the rings arrive a long time afterwards.",
      "Something in the lake, a long way out, is rowing."
    ], every: [35, 70] },
    waitFor: { time: "next 19:30", says: "You wait on the planks. The lake waits too, and picks up the first colour of the evening.", if: [{ "time.hour": { between: [6, 19] } }] },
    alt: "Looking north along a long grey wooden jetty running straight out into a wide lake in the low sun, a mooring post at its end, a low island with one lamp-post on the right, reeds and a moored dinghy on the left.",
    overlayAlt: {}
  },
  lane: {
    name: "THE LANE", area: "village", at: [0, 0, 0],
    describe: [
      "The lane runs down to the lake between houses that keep their shutters shut on it: slate, whitewash, a lamp on every third corner. A wedge of the lake shows at the bottom.",
      "East, the {Heron|heron} has its door open and its lamp over it. A painted {notice} is nailed to a post. North, steps go down to the quay. South, a cinder path climbs to the churchyard."
    ],
    exits: { n: "quay", e: { to: "inn", in: true }, s: "churchyard" },
    scenery: [
      { words: ["houses", "house", "cottages", "shutters", "slate", "whitewash"], name: "the houses", says: "Narrow whitewashed houses with their shutters drawn at the lake side, as if the lake were a neighbour with opinions." },
      { words: ["lamps", "lamp", "posts", "post", "corner", "corners"], name: "the lamps", says: "Iron lamps on iron posts, each one with a little ladder rung welded to the side, for a lamplighter who is late." },
      { words: ["lake", "water"], name: "the lake", says: "Down between the roofs, a wedge of it, very flat, with the sky laid on top." },
      { words: ["steps", "stair", "stairs", "hill"], name: "the steps", says: "Steep stone steps down to the quay, with the water showing between the houses at the bottom like the last page of something.", leads: "n" },
      { words: ["path", "churchyard", "chapel"], name: "the path", says: "A cinder path between two walls, going up to a small roofed gate.", leads: "s" }
    ],
    ambience: { lines: [
      "A shutter opens a hand's width on the lake side, and closes.",
      "Somewhere behind a wall, a kettle comes to the boil and is taken off at once.",
      "A cat crosses the lane and does not look at the water.",
      "A lamp ticks as it cools, or warms, a little way up the hill."
    ], every: [35, 75] },
    alt: "Looking north down a steep lane between whitewashed slate-roofed houses toward a wedge of lake: iron lamp-posts, the Heron's door on the right with its sign and lamp, a painted notice on a post, the low sun on the right-hand houses.",
    overlayAlt: {}
  },
  inn: {
    name: "THE HERON", area: "village", at: [1, 0, 0],
    describe: [
      "The Heron: low beams, a fire, six tables and a smell of wet wool drying. Every chair faces the window, and the window faces the lake.",
      "Photographs of boats hang behind the bar. A tall {chair} stands by the {fire}, kept empty. A shelf over the mantel holds a candle and a mug. The lane is west."
    ],
    exits: { w: "lane" },
    scenery: [
      { words: ["beams", "beam", "ceiling"], name: "the beams", says: "Black oak, low enough to touch. Someone has hung a hook on every fourth beam, and nothing on any of the hooks." },
      { words: ["tables", "table", "chairs"], name: "the tables", says: "Six small tables, six chairs each, all pushed in at the same angle, towards the window." },
      { words: ["window", "glass"], name: "the window", says: "Small panes, a little green. The lake is in them, and the lamp of the island, which is dark." },
      { words: ["photographs", "photograph", "photos", "boats", "bar", "counter"], name: "the photographs", says: "Boats on the lake, in a dozen summers. In every one the same man stands in the stern with his back to the camera, rowing away." },
      { words: ["shelf", "mantel", "candle", "mug"], name: "the mantel", says: "A candle burnt down to a stub it has been told to keep, and a mug of tea gone cold, and a clean ring beside it where a second mug used to stand." }
    ],
    mentions: [],
    ambience: { lines: [
      "The fire settles, and a log turns over to show its other side.",
      "A cup is put down on the bar, with great care, as if it were full.",
      "A chair scrapes by the window, though nobody sits in it.",
      "Outside the green panes, a boat goes by on the lake, with no one at its oars."
    ], every: [35, 70] },
    alt: "A low inn room by firelight: a bar with photographs behind it, a tall empty chair by a stone fireplace, small tables turned towards a window that shows the lake going blue.",
    overlayAlt: { matches: "A box of matches on the mantel beside a stub of candle." }
  },
  churchyard: {
    name: "THE CHURCHYARD", area: "village", at: [0, 1, 0],
    describe: [
      "A churchyard on the last flat ground before the hill goes steep: a small stone chapel, leaning stones, and a wall low enough to see the whole lake over.",
      "A small {bell} hangs in an open cote beside the chapel, its rope tied up out of reach. Under the roofed gate, nails hold what the village wants kept dry. The lane is north, below the wall."
    ],
    exits: { n: "lane" },
    scenery: [
      { words: ["chapel", "church", "door", "porch"], name: "the chapel", says: "Small, stone and shut. A card in the porch says services are held whenever someone is late." },
      { words: ["stones", "stone", "graves", "gravestones", "headstones"], name: "the stones", says: "Leaning slates in the long grass. Every name has a boat cut under it instead of a date, and one slate, at the end, has a boat and no name." },
      { words: ["wall", "lake"], name: "the wall", says: "Knee-high, mossy, warm on top. From it the lake is the whole of the lower sky." },
      { words: ["gate", "lychgate", "lych-gate", "nails", "nail", "roof"], name: "the lychgate", says: "A little roofed gate, dry underneath, with a row of nails driven into the beam. The village hangs here what it wants kept." },
      { words: ["grass", "garlic", "flowers"], name: "the grass", says: "Long grass and wild garlic. It bends away from the lake, all together, as in a wind that is not here." }
    ],
    mentions: ["cote"],
    ambience: { lines: [
      "The garlic gives off its smell in one breath, as though startled.",
      "A swallow goes through the lychgate and out the other side, in no hurry.",
      "The grass leans towards the hill, all together, and straightens.",
      "A long way below, a boat's oars knock once, in a boat you cannot see."
    ], every: [35, 75] },
    alt: "A small hillside churchyard looking north over a low wall to the lake in the low sun: a stone chapel on the left, a bell in an open cote, leaning gravestones in long grass, a roofed gate on the right, village roofs on the slope below.",
    overlayAlt: { boat_key: "An iron key hangs on a nail under the lychgate roof." }
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------------
const objects = {
  // The opening's three things: the bottle (hints), the ticket (intro) and the grille (the way on).
  bottle: { at: "car", portable: true, material: "glass", name: "Green bottle", note: "A voice, corked.",
    here: "A {green bottle|bottle} stands on the bench by the window, corked, with a small light moving in it.",
    words: { nouns: ["bottle"], adj: ["green"] },
    examine: "A green glass bottle, corked with a stub of cork. Inside, instead of a message, a small voice, which clears its throat whenever you look at it.", ...item("bottle") },
  ticket: { at: "player", portable: true, material: "paper", name: "Ferry ticket", note: "One crossing, not yet used.",
    words: { nouns: ["ticket"], adj: ["ferry"] },
    examine: "A ferry ticket, one crossing, stamped with a sunset and no date. On the back, in your handwriting: \"Row home before the lamps go out.\"", ...item("ticket") },
  grille: { at: "car", name: "Grille", note: "Slid half open.",
    words: { nouns: ["grille", "bars"], adj: ["iron"] }, leads: "n",
    examine: "An iron grille on a runner, slid half across the bright arch below. The gap is the width of a bottle." },

  // The chain: the key, the door, the oars, the lantern, the oil, the matches, the boat.
  boat_key: { at: "churchyard", portable: true, material: "metal", name: "Boat key", note: "Hung where the lake can't reach.",
    here: "A {key|boat_key} hangs on a nail under the lychgate roof, on a loop of wet string.",
    words: { nouns: ["key"], adj: ["boat", "iron"] },
    examine: "An iron key on a loop of string. The string is wet, though the nail is dry, and the iron is cold the way the bottom of a lake is cold.", ...item("boat_key") },
  boathouse_door: { at: "quay", door: "e", locked: true, material: "wood", name: "Boathouse door", note: "Chained and padlocked.",
    shut: "You go to the boathouse door and the padlock stops you, politely, with the weight of a closed hand.",
    lock: { key: "boat_key", says: "The padlock wants a key that is not on you. The keyhole is rusted round the edges, and clean in the middle, as if it were used a little every day by somebody who never turns up.",
      opens: "The padlock opens as if it had been waiting for the string to dry, and the chain slides off the door like a snake that has changed its mind." },
    words: { nouns: ["door", "boathouse", "padlock", "chain"], adj: ["tarred"] },
    examine: "A tall tarred door chained shut. Hung on the chain, a padlock with a clean brass keyhole. Somebody has swept the step in front of it this morning." },
  boat: { at: "boathouse", enterable: "in", material: "wood", name: "Boat", note: "Rowlocks empty.",
    words: { nouns: ["boat", "skiff", "rowlocks"], adj: ["small", "rowing"] },
    enter: "You step into the boat, and it takes your weight the way a hand takes a hand. The rowlocks wait on either side of you for oars.",
    examine: "A clinker skiff, tarred black, with a seat and two empty rowlocks, and a name on the stern painted over so often that it is now only a shape. The bottom boards are dry. They have not met the lake in some time, and are eager to." },
  lantern: { at: "boathouse", portable: true, material: "metal", name: "Brass lantern", note: "Dry, and waiting.",
    here: "A brass {lantern} hangs on a hook by the lake doors, its wick standing up as if listening.",
    words: { nouns: ["lantern", "lamp"], adj: ["brass", "dry", "cold"] },
    examine: "A boatman's lantern: brass, a glass chimney, a wick standing up dry. The font is empty and smells of somebody else's oil. Round its foot, scratched small: a boat, and under it a smaller boat.", ...item("lantern") },
  lit_lantern: { at: null, portable: true, material: "metal", name: "Lit lantern", note: "Burning, small and steady.",
    words: { nouns: ["lantern", "lamp"], adj: ["lit", "brass", "burning"] },
    examine: "The lantern burns a small steady yellow, and the lake, wherever you carry it, does not wait to be asked before lighting it again.", ...item("lit_lantern") },
  oil: { at: null, from: "pell", portable: true, material: "metal", name: "Tin of oil", note: "Lamp oil, a little.",
    brought: "Mrs Pell takes a tin from under the bar and puts it in your hand without looking at you, the way you hand a child a coat.",
    again: "\"One tin each,\" says Mrs Pell. \"Teodor's was the last, and he never used it.\"",
    words: { nouns: ["oil", "tin"], adj: ["lamp"] },
    examine: "A small tin with a spout and a smell of lamp. It is full to the lid, and the lid has been dented by the same thumb for years.", ...item("oil") },
  matches: { at: "inn", portable: true, material: "paper", name: "Box of matches", note: "Most of them left.",
    here: "A box of {matches} lies on the mantel, next to the stub of a candle that is waiting to be lit.",
    words: { nouns: ["matches", "match", "box"], adj: [], pl: true }, smell: "Sulphur, and the inside of somebody's coat pocket.",
    examine: "A box of safety matches, nearly full. On the lid, a boat, and a smaller boat.", ...item("matches") },
  oars: { at: "loft", portable: true, material: "wood", shape: ["oars_shape", "oars_blade"], name: "Oars", note: "A pair, blades together.", use: "fit",
    here: "A pair of {oars} lies across two rafters, the blades together, pale where hands go.",
    words: { nouns: ["oars", "oar", "paddles"], adj: ["pair"], pl: true },
    examine: "Two ash oars, the looms worn to the shape of a man who held them a particular way. The blades are painted with a band of yellow, like a lamp.", ...item("oars") },

  // People and fixtures.
  pell: { portrait: sprites.pell_portrait, at: "inn", name: "Mrs Pell", note: "Drying a dry cup.", material: "soft",
    here: "{Mrs Pell|pell} stands behind the bar, drying a cup that is already dry.",
    words: { nouns: ["pell", "landlady", "woman", "mrs"], adj: [], g: "f", proper: true },
    examine: "Mrs Pell is square, quiet and ageless, with her sleeves rolled and a tea towel over one shoulder. She does not look at the window. She keeps a great many things from looking at it.",
    give: "\"Thank you,\" says Mrs Pell, and looks at what you gave her as if it were weather, and gives it back.",
    talk: "\"You'll be wanting a seat,\" says Mrs Pell. \"Any chair but that one.\"",
    topics: {
      teodor: { words: ["teodor", "boatman", "man"], open: true, says: "\"Teodor's late,\" says Mrs Pell. \"He goes out at dusk to light the island's lamp, and he is late. He has been late for some time.\" She puts the cup down on a clean ring in the wood." },
      lake: { words: ["lake", "water", "village", "windows", "lamp"], open: true, label: "the lake", says: "\"We light them above,\" says Mrs Pell. \"It lights them again below, a little late. Nobody minds. It is when it lights one we haven't that we look.\"" },
      boathouse_door: { words: ["boathouse", "padlock", "key", "door"], label: "the boathouse key", says: "\"Teodor's key?\" Mrs Pell takes down a cup. \"He hung it up at the lychgate, up the hill, where the lake can't reach. That's where we hang whatever we want kept, in this village. It's a thing about the damp.\"" },
      boat: { words: ["boat", "skiff", "oars", "oar", "loft"], label: "the boat", says: "\"He kept the oars up in the loft, off the damp, like all good things. The boat doesn't go for just anybody. It wants someone with a light of their own, or it sits.\"" },
      lantern: { words: ["lantern", "lamp", "light", "oil", "matches"], label: "the lantern", says: "\"The lantern wants oil, and the oil wants asking for,\" says Mrs Pell. \"I have a tin or two under the bar. The matches are where the candle is. Don't ask me why a candle.\"" },
      default: "Mrs Pell goes on drying, which is a kind of answer."
    } },
  chair: { at: "inn", enterable: "on", material: "wood", name: "Tall chair", note: "Kept empty.",
    words: { nouns: ["chair", "stool"], adj: ["tall", "empty"] },
    enter: "You sit in the tall chair by the fire. The seat is warm and slightly too far from the floor, and everyone in the room, without turning, becomes very quiet. After a while you are allowed to stand again.",
    examine: "A tall oak chair with a high back, turned to the window. The seat is worn pale in the shape of a man, and is warm, though the fire is on the other side of the room." },
  bell: { at: "churchyard", name: "Bell", note: "Its rope tied up.", material: "metal",
    words: { nouns: ["bell", "cote", "clapper"], adj: ["small"] },
    push: "You reach up and push the bell with the flat of your hand. It rocks, and does not ring, and a long way out on the lake, a moment later, a bell rings once.",
    listen: "You listen. The bell says nothing; from the lake, very faintly, comes its answer.",
    examine: "A small bronze bell in an open cote. The rope has been tied back out of reach, and the knot is an old one. When the wind moves the bell, the sound arrives on the lake first." },
  boat_ladder: { at: "boathouse", leads: "u", material: "wood", name: "Ladder", note: "To the loft.",
    words: { nouns: ["ladder", "rungs"], adj: ["pine"] },
    examine: "Pine rungs worn to a hollow in the middle by feet that went up lightly and came down slowly." },
  loft_ladder: { at: "loft", leads: "d", material: "wood", name: "Ladder", note: "Back down.",
    words: { nouns: ["ladder", "rungs"], adj: ["pine"] },
    examine: "The top of the ladder, through a square hole. The last rung is worn bright on the side that faces the window." },
  heron: { at: "lane", leads: "e", name: "The Heron", note: "A pub, door open.",
    words: { nouns: ["heron", "inn", "pub"], adj: [] },
    examine: "A low whitewashed pub front with a heron painted on the sign, standing on one leg and looking at the lake. The door is open and the lamp over it is lit for somebody." },
  notice: { at: "lane", name: "Notice", note: "Painted, nailed to a post.",
    words: { nouns: ["notice", "sign"], adj: ["painted"] },
    read: "\"FERRY: one crossing, nightly, at nightfall. Passengers carry their own light. The boatman is late.\" Under it, in a different paint: \"Still.\"",
    examine: "A board nailed to a post, painted with a boat in white and some words in black. A second hand has added one more word at the bottom, and then scratched at it, and left it." },
  fire: { at: "inn", name: "Fire", note: "Low and steady.",
    words: { nouns: ["fire", "fireplace", "grate", "hearth"], adj: [] },
    smell: "Applewood and wet wool, and under it, very faintly, tar.",
    examine: "A low fire in a wide stone grate. The flames lean towards the window, and not, as flames should, up the chimney." },
  post: { at: "jetty", name: "Mooring post", note: "A hook at lamp height.",
    words: { nouns: ["post", "hook"], adj: ["mooring"] },
    examine: "An oak post at the end of the planks, gnawed by rope. A brass hook is screwed into it at the height a man would hold up a lamp, bright at the tip." },
  street: { at: "jetty", name: "Reflected street", note: "A street in the water.",
    words: { nouns: ["street", "reflection", "windows", "water"], adj: ["reflected", "lit"] },
    examine: "The jetty stands upside down in the water, plank under plank, with the piles for a railing. The lake is keeping something back for the evening." }
};

// ---- Puzzles ---------------------------------------------------------------------------------------------------------------
const puzzles = {
  get_key: { where: "churchyard", needs: [], solve: ["take key"], gives: ["boat_key"], clues: ["pell", "boathouse_door", "boat_key"],
    hints: ["Mrs Pell says what the village keeps dry: up the hill, under a little roof.", "Take the key from its nail at the lychgate, in the churchyard."] },
  open_boathouse: { where: "quay", needs: ["boat_key"], solve: ["unlock door with key", "go east"], reaches: "boathouse", clues: ["boathouse_door", "pell", "boat_key"],
    hints: ["The padlock on the boathouse door has a clean keyhole.", "Unlock the boathouse door with the iron key and go in."] },
  get_oars: { where: "loft", needs: ["open_boathouse"], solve: ["take oars"], gives: ["oars"], clues: ["pell", "boat"],
    hints: ["The boat has empty rowlocks, and Mrs Pell says where the oars were put.", "Climb the ladder to the loft and take the oars."] },
  get_lantern: { where: "boathouse", needs: ["open_boathouse"], solve: ["take lantern"], gives: ["lantern"], clues: ["pell", "boathouse_door"],
    hints: ["A boatman's lantern hangs by the lake doors, dry.", "Take the brass lantern from its hook."] },
  get_oil: { where: "inn", needs: [], solve: ["ask pell for oil"], gives: ["oil"], clues: ["pell", "lantern"],
    hints: ["The lantern's font is empty, and Mrs Pell keeps what it wants under the bar.", "Ask Mrs Pell for oil."] },
  get_matches: { where: "inn", needs: [], solve: ["take matches"], gives: ["matches"], clues: ["pell", "matches"],
    hints: ["Something is waiting by a stub of candle on the mantel.", "Take the matches from the mantel at the Heron."] },
  light_lantern: { where: "lane", needs: ["lantern", "oil", "matches"], solve: ["fill lantern with oil", "light lantern"], gives: ["lit_lantern"], clues: ["lantern", "matches", "pell"],
    hints: ["The lantern wants oil in its font, and then a flame.", "Fill the lantern with the oil, then light it."] },
  hang_lamp: { where: "jetty", needs: ["lit_lantern"], solve: ["wait for dusk", "hang lantern on post"], ending: true, clues: ["post", "pell", "lit_lantern"],
    hints: ["The post at the end of the jetty has a hook at lamp height, bright at the tip.", "Wait on the jetty for the windows to light, then hang the lit lantern on the post."] },
  row_out: { where: "boathouse", needs: ["oars", "lit_lantern"], solve: ["wait for night", "enter boat", "row"], ending: true, clues: ["boat", "ticket", "pell"],
    hints: ["The boat leaves the shore only for someone who carries a light, and the island's lamp is dark.", "Wait in the boathouse until the island is ready for it, then get into the boat with the oars and the lit lantern and row."] },
  walk_street: { where: "jetty", needs: [], solve: ["wait for dusk", "go north"], ending: true, clues: ["street", "post"],
    hints: ["The reflection of the jetty is keeping something back for the evening, and the village lights its windows at dusk.", "Wait on the jetty for the windows to light, then go north, off the end of the jetty."] }
};

// ---- Named changes -----------------------------------------------------------------------------------------------------------
const changes = {
  fuel: [
    { set: "lantern.fueled", to: true },
    { remove: "object", id: "oil" },
    { say: "You pour the oil into the font. The lantern drinks it in a single breath and stands a little straighter on its hook of air." }
  ],
  light_it: [
    { remove: "object", id: "lantern" },
    { remove: "object", id: "matches" },
    { move: "lit_lantern", to: "player" },
    { say: "You strike a match. It burns a moment, to see what you intend, and passes the flame to the wick. The lantern lights with a small, polite sound, and the match is ash." }
  ]
};

// ---- Rules -------------------------------------------------------------------------------------------------------------------
const NIGHT = { "time.hour": { between: [19, 6] } };
const DAY = { "time.hour": { between: [6, 19] } };
const rules = [
  // Filling and lighting the lantern.
  { id: "fill_a", match: { verb: "fill", obj: "lantern", obj2: "oil" }, if: [{ "lantern.fueled": false }], do: [{ change: "fuel" }] },
  { id: "fill_b", match: { verb: ["put", "use"], obj: "oil", obj2: "lantern" }, if: [{ "lantern.fueled": false }], do: [{ change: "fuel" }] },
  { id: "fill_again", match: { verb: ["fill", "put", "use"], obj: ["oil", "lantern"], obj2: ["oil", "lantern"] }, if: [{ "lantern.fueled": true }],
    do: [{ say: "The font is full to the neck already. The lantern looks at the oil in your hand the way you look at a second helping." }] },
  { id: "fill_bare", match: { verb: "fill", obj: "lantern" }, if: [{ "lantern.fueled": false }],
    do: [{ say: "You hold the lantern out, and it stays empty. It wants something poured in. Mrs Pell, at the Heron, keeps oil." }] },
  { id: "light_dry", match: { verb: "switch_on", obj: "lantern" }, if: [{ "lantern.fueled": false }],
    do: [{ say: "The wick is dry, and stands up with the stiffness of someone refusing a hand. There is nothing in the font to burn." }] },
  { id: "light_nomatch", match: { verb: "switch_on", obj: "lantern" }, if: [{ "lantern.fueled": true }, { "matches.at": { "!=": "player" } }],
    do: [{ say: "The wick is wet with oil and ready. You have nothing to light it with, and the lantern is polite about that. There are matches on a mantel in the Heron." }] },
  { id: "light_ok", match: { verb: "switch_on", obj: "lantern" }, if: [{ "lantern.fueled": true }], do: [{ change: "light_it" }] },
  { id: "use_matches", match: { verb: ["use", "put"], obj: "matches", obj2: "lantern" }, if: [{ "lantern.fueled": true }], do: [{ change: "light_it" }] },
  { id: "use_matches_dry", match: { verb: ["use", "put"], obj: "matches", obj2: "lantern" }, if: [{ "lantern.fueled": false }],
    do: [{ say: "You hold a match to a dry wick, and it will not take. The font wants oil first." }] },
  { id: "light_matches", match: { verb: ["switch_on", "attack"], obj: "matches" },
    do: [{ say: "You strike a match, and it burns a moment, and you put it out between finger and thumb. A match is for a lantern, and there are not many." }] },

  // Hanging the lit lantern on the post: the keeper's ending.
  { id: "hang_keep", match: { verb: ["hang", "put", "use"], obj: "lit_lantern", obj2: "post" }, if: [{ "player.at": "jetty" }, NIGHT],
    do: [{ say: "You hang the lantern on the hook, and the hook takes it as if it had been bare for years. Out on the water, in the dark where the street was, a boat's oars knock once, twice, and come in. It is an empty boat, its oars shipped, riding high and light. It touches the planks, and the post, and the lamp, and waits for someone to take the oars." },
      { end: true, picture: "keep" }] },
  { id: "hang_early", match: { verb: ["hang", "put", "use"], obj: "lit_lantern", obj2: "post" }, if: [{ "player.at": "jetty" }],
    do: [{ say: "You hold the lantern up to the hook. The hook is bright and ready, and the lake has no windows in it yet to answer a lamp. A lamp hung now would be a lamp hung in the day. The post can wait for evening." }] },
  { id: "hang_cold", match: { verb: ["hang", "put", "use"], obj: "lantern", obj2: "post" },
    do: [{ say: "A dark lantern on a hook is only a bucket with ideas. It wants a light first." }] },

  // The jetty's one way north: the street in the water.
  { id: "walk_street", match: { verb: "go", dir: "n" }, if: [{ "player.at": "jetty" }, NIGHT],
    do: [{ say: "You step off the end of the jetty onto the street. It holds, for the length of a long breath, lit on both sides, with the windows going by at the height of your shoulder, and then a little further on a window goes by that is not at your shoulder but below your feet, and the street, noticing, politely lets go." },
      { end: true, picture: "street" }] },

  // The evening: at seven the windows come on above and the lake lights them again (the pictures keep in step, silently);
  // at nine the lake lights a lamp on the island that nobody lit above.
  { id: "nightfall_draw", when: "at", at: "19:00", do: [
    { draw: "quay", remove: ["sun", "glitter_a", "glitter_b", "glitter_c", "glitter_d", "glitter_e", "coping_lit", "bh_strike", "bh_shade", "bh_roof_lit", "bh_lit", "sh_boathouse", "sh_rack", "float_glints", "gulls"],
      restyle: [{ id: "sky", fill: "fade:0,1/0,0/0,66" }, { id: "lake", fill: "fade:1,0/0,64/0,102" }, { id: "far_shore", fill: 0 }, { id: "far_win", color: 14 }, { id: "island_lamp", fill: 0 },
        { id: "cloud_a", color: 1 }, { id: "cloud_b", color: 1 }, { id: "cloud_c", color: 1 }, { id: "ripple_a", color: 1 }, { id: "ripple_b", color: 1 }, { id: "ripple_c", color: 1 }, { id: "ripple_d", color: 1 },
        { id: "quay_ground", fill: 1 }, { id: "coping", fill: 0, edge: 1 }, { id: "stones", color: 6 }, { id: "jetty_hook", fill: 6 },
        { id: "bh_wall", fill: 0, edge: 1 }, { id: "boathouse_door", edge: 1 }, { id: "bh_window", edge: 1 }, { id: "padlock", fill: 6 }, { id: "tree", edge: 1 },
        { id: "nets", fill: 0 }, { id: "net_knots", color: 6 }, { id: "float_a", fill: 0, edge: 1 }, { id: "float_b", fill: 0, edge: 1 }, { id: "float_c", fill: 0, edge: 1 }, { id: "float_d", fill: 0, edge: 1 }] },
    { set: "quay.alt", to: "Looking north from a stone quay over a black lake under a dark sky: a rack of nets on the left, a jetty running out into the water ahead, a small island with a lamp-post, a tarred boathouse with a chained door on the right, a few far windows lit across the water." },
    { draw: "jetty", remove: ["sun", "glitter_a", "glitter_b", "glitter_c", "glitter_d", "glitter_e", "plank_lit", "sh_pile_l1", "sh_pile_l2", "gulls"],
      restyle: [{ id: "sky", fill: "fade:0,1/0,0/0,70" }, { id: "lake", fill: "fade:1,0/0,68/0,136" }, { id: "far_shore", fill: 0 }, { id: "far_win", color: 14 }, { id: "island_lamp", fill: 0 },
        { id: "cloud_a", color: 1 }, { id: "cloud_b", color: 1 }, { id: "cloud_c", color: 1 },
        { id: "ripple_a", color: 1 }, { id: "ripple_b", color: 1 }, { id: "ripple_c", color: 1 }, { id: "ripple_d", color: 1 }, { id: "ripple_e", color: 1 },
        { id: "post_hook", fill: 6 }, { id: "reeds_tips_l", color: 6 }, { id: "reeds_tips_r", color: 6 }, { id: "foam", color: 1 }],
      add: ["dots street_l_a 61,102 70,95 79,88 87,83 93,78 98,75 c14", "dots street_l_b 64,97 74,90 82,85 88,81 94,77 c14",
        "dots street_r_a 156,102 146,95 136,88 128,83 122,78 117,75 c14", "dots street_r_b 153,97 142,90 134,85 127,81 121,77 c14"] },
    { set: "jetty.alt", to: "Looking north along a long grey wooden jetty running straight out into a black lake at night, a mooring post at its end, a low island with one lamp-post on the right, reeds and a moored dinghy on the left, and two rows of lit windows laid on the water either side of the jetty's line, going away to the end." },
    { draw: "lane", remove: ["sun_r", "road_sun", "sh_road"],
      restyle: [{ id: "sky", fill: "fade:0,1/0,0/0,66" }, { id: "lake_wedge", fill: 1 }, { id: "far_shore", fill: 0 }, { id: "road", fill: 1 }, { id: "houses_l", fill: 0, edge: 1 }, { id: "houses_r", fill: 0, edge: 1 },
        { id: "win_l1", fill: 14 }, { id: "win_l3", fill: 14 }, { id: "win_r1", fill: 14 }, { id: "win_r2", fill: 14 }, { id: "win_r3", fill: 14 },
        { id: "heron_door", fill: 14 }, { id: "heron_lamp", fill: 14 }, { id: "lamp_1", fill: 14 }, { id: "lamp_2", fill: 14 }, { id: "swallows", color: 1 }],
      add: ["ellipse heron_halo_c 222,57,22,16 mix:,14@0.1", "ellipse heron_halo_b 222,57,14,10 mix:,14@0.2", "ellipse heron_halo_a 222,57,7,5 mix:,14@0.35"] },
    { set: "lane.alt", to: "Looking north down a steep lane between dark slate-roofed houses at night, toward a wedge of black lake: windows lit along both rows, iron lamp-posts alight, the Heron's door on the right lit, with its sign and lamp, and a painted notice on a post." },
    { draw: "churchyard", remove: ["sun", "glitter_a", "glitter_b", "glitter_c", "glitter_d", "wall_top_lit", "chapel_strike", "chapel_lit", "sh_chapel", "sh_lych"],
      restyle: [{ id: "sky", fill: "fade:0,1/0,0/0,58" }, { id: "lake", fill: "fade:1,0/0,58/0,92" }, { id: "far_shore", fill: 0 }, { id: "far_win", color: 14 }, { id: "island_lamp", fill: 0 },
        { id: "cloud_a", color: 1 }, { id: "cloud_b", color: 1 }, { id: "cloud_c", color: 1 }, { id: "ripple_a", color: 1 }, { id: "ripple_b", color: 1 }, { id: "ripple_c", color: 1 },
        { id: "slope", fill: 1 }, { id: "village_windows", color: 14 }, { id: "wall", fill: 0, edge: 1 }, { id: "grass", fill: 1 },
        { id: "chapel", fill: 0, edge: 1 }, { id: "chapel_roof", edge: 1 }, { id: "chapel_door", edge: 1 }, { id: "chapel_window", edge: 1 }, { id: "chapel_window_b", edge: 1 },
        { id: "cote_roof", edge: 1 }, { id: "bell", fill: 6 }, { id: "lych_roof", edge: 1 }, { id: "lych_post_l", edge: 1 }, { id: "lych_post_r", edge: 1 }, { id: "lych_nails", color: 6 },
        { id: "grass_a", color: 6 }, { id: "grass_b", color: 6 }, { id: "grass_c", color: 6 }, { id: "grass_d", color: 6 }, { id: "grass_e", color: 6 },
        { id: "stone_a", edge: 1 }, { id: "stone_b", edge: 1 }, { id: "stone_c", edge: 1 }, { id: "stone_d", edge: 1 }, { id: "stone_e", edge: 1 }, { id: "stone_f", edge: 1 }, { id: "stone_g", edge: 1 }, { id: "yew", edge: 1 }] },
    { set: "churchyard.alt", to: "A small hillside churchyard at night, looking north over a low wall to the black lake: a stone chapel on the left, a bell in an open cote, leaning gravestones in long grass, a roofed gate on the right, the village roofs on the slope below with their windows lit, and a few far windows lit across the water." },
    { draw: "boathouse", remove: ["door_sun", "door_halo_c", "door_halo_b", "door_halo", "door_pool", "boat_lit", "dust"],
      restyle: [{ id: "door_sky_a", fill: "fade:0,1/196,46/196,59" }, { id: "door_sky_b", fill: 1 }, { id: "door_lake", fill: "fade:1,0/196,72/196,87" }, { id: "door_ripple_a", color: 1 }, { id: "door_ripple_b", color: 1 },
        { id: "wall_l", fill: 0 }, { id: "wall_r", fill: 0 }, { id: "floor", fill: 1 }, { id: "far_wall", fill: 0 }, { id: "door_post_l", edge: 1 }, { id: "door_post_r", edge: 1 }, { id: "door_lintel", edge: 1 },
        { id: "boat_seat", fill: 6 }, { id: "rowlock_l", fill: 6 }, { id: "rowlock_r", fill: 6 }, { id: "hooks", color: 6 }, { id: "ropes", fill: 6 }, { id: "ropes_b", fill: 6 }, { id: "floats", fill: 6 }, { id: "floats_b", color: 6 }, { id: "boathook_head", color: 6 }, { id: "lantern_hook", fill: 6 }] },
    { set: "boathouse.alt", to: "Inside a tarred boathouse at night, looking north down the slip to the open lake doors: a small rowing boat on the slip at the left, a door to the quay, ropes, floats and a row of hooks on the left wall, a ladder and a shelf on the right, and the black lake beyond the doors." },
    { draw: "loft", remove: ["win_halo_c", "win_halo_b", "win_halo_a", "floor_light", "window_lit", "motes"],
      restyle: [{ id: "wall_gable", fill: 0 }, { id: "floor", fill: 1 }, { id: "window_glass", fill: "fade:0,1/107,48/107,76" }, { id: "bracket_bolt", fill: 6 }, { id: "bracket_bolt2", fill: 6 },
        { id: "nails", color: 6 }, { id: "floor_nails", color: 6 }, { id: "chain_links", color: 6 },
        { id: "cobweb_a", color: 6 }, { id: "cobweb_b", color: 6 }] },
    { set: "loft.alt", to: "A boathouse loft at night under the slope of the roof, looking north: a round window of dark lake in the end wall, folded sails on the left, a chain and an empty lamp bracket on the right, oars lying across the beams, a ladder hole in the floor." },
    { draw: "inn", restyle: [{ id: "window_glass", fill: "fade:1,0/190,36/190,76" }] },
    { set: "street.examine", to: "In the lake the village stands upside down, window under window, and between the rows a street runs out across the water, lit from both sides, past the end of the jetty. It looks quite firm. A little way along it, one lit window is nobody's." }
  ] },
  { id: "nightfall_say", when: "at", at: "19:00", if: [{ "player.at": { in: ["quay", "jetty", "lane", "churchyard"] } }],
    do: [{ say: "The sun goes down into the lake, and along the shore the windows come on, one by one. Below them, a little late, the lake lights each of them again." }] },
  { id: "island_draw", when: "at", at: "21:00", do: [
    { draw: "quay", add: ["ellipse island_ghost 153,71,3,2 14"] },
    { draw: "jetty", add: ["ellipse island_ghost 213,73,3,2 14"] },
    { draw: "churchyard", add: ["ellipse island_ghost 166,61,3,2 14"] }
  ] },
  { id: "island_say", when: "at", at: "21:00", if: [{ "player.at": { in: ["quay", "jetty", "churchyard"] } }],
    do: [{ say: "Out on the lake, under the island where nothing is lit, a small yellow lamp comes on in the water, and stays. There is no lamp above it." }] },

  // Day and night lines: what holds only at some hours (the low sun, the lit windows) is said here, not in the room's text.
  { id: "quay_day", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "quay" }, DAY], do: [{ say: ["The low sun lies on the lake to the west, and turns the nets on their rack the colour of tea.", "The sunward wall of the boathouse is warm. The other side is cold, and keeps the tar smell in."] }] },
  { id: "quay_night", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "quay" }, NIGHT], do: [{ say: ["Across the lake a few far windows have come on, and the lake lights each of them again.", "The boathouse is a darker dark against the water, and the chain on its door is the only thing on it that shines."] }] },
  { id: "boathouse_day", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "boathouse" }, DAY], do: [{ say: ["The light comes in the shape of the doors and lies on the planks, and the dust in it does not settle."] }] },
  { id: "boathouse_night", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "boathouse" }, NIGHT], do: [{ say: ["The lake in the doors is black, and the boathouse is darker than the lake."] }] },
  { id: "loft_day", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "loft" }, DAY], do: [{ say: ["A round of light from the window lies on the boards, and the dust turns slowly in it."] }] },
  { id: "loft_night", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "loft" }, NIGHT], do: [{ say: ["The window is only a round of dark, with a paler dark in it, which is the lake."] }] },
  { id: "jetty_day", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "jetty" }, DAY], do: [{ say: ["The sun stands low in the west, and the piles lay their shadows across the planks, long and in no hurry."] }] },
  { id: "jetty_night", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "jetty" }, NIGHT], do: [{ say: ["The village has lit its windows, and the lake has lit them again: a street of them runs out beside the planks and past the end of the jetty, as if it knew a way."] }] },
  { id: "lane_day", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "lane" }, DAY], do: [{ say: ["The low sun strikes the upper walls of the houses on the right, and leaves the left-hand row, and half the lane, in shade."] }] },
  { id: "lane_night", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "lane" }, NIGHT], do: [{ say: ["Every window on the lane is lit, and the Heron's lamp burns over its door, a little brighter than the rest."] }] },
  { id: "churchyard_day", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "churchyard" }, DAY], do: [{ say: ["The low sun lies along the wall, and the gravestones' shadows run away to the right."] }] },
  { id: "churchyard_night", when: "every", every: { seconds: [30, 60] }, chance: 1, if: [{ "player.at": "churchyard" }, NIGHT], do: [{ say: ["Below the wall the village roofs have lit their windows, and across the water, a little late, the far shore has lit its own."] }] },

  // Rowing out to light the island's lamp.
  { id: "row_out", match: { verb: "row" }, if: [{ "player.in": "boat" }, { "player.carrying": { "has": "oars" } }, { "player.carrying": { "has": "lit_lantern" } }, { "time.hour": { between: [21, 6] } }],
    do: [{ say: "You ship the oars and the lantern lights the water in front of you, and the lake agrees to be rowed. The boathouse goes, and the village, window by window, and behind you the lake lights each one again, a little late. At the island, the dark lamp-post waits. You climb the three iron rungs and open the lamp, and hold the lantern to the wick, and it takes. Far below, across the water, the whole village is lit, and there is, at last, one lit window more in the lake than there are above." },
      { end: true, picture: "lamp" }] },
  { id: "row_early", match: { verb: "row" }, if: [{ "player.in": "boat" }, { "player.carrying": { "has": "oars" } }, { "player.carrying": { "has": "lit_lantern" } }],
    do: [{ say: "You fit the oars and look out at the lake. There is nothing out there yet to row to: the island's lamp-post is dark, and the lake has not yet lit its own. The boat waits with you, in no hurry, for the evening to get further on." }] },
  { id: "row_dark", match: { verb: "row" }, if: [{ "player.in": "boat" }, { "player.carrying": { "has": "oars" } }],
    do: [{ say: "The oars go in and the boat does not move. The water under the keel has no light of its own, and wants yours. The boat will not leave the shore without a lamp, lit, in the hand of whoever rows it." }] },
  // The boat's text invites putting the oars in the rowlocks: every way of saying it works, and points at ROW.
  { id: "fit_oars", match: { verb: ["put", "use", "fit"], obj: "oars", obj2: "boat" }, if: [{ "player.in": "boat" }],
    do: [{ say: "You set the oars in the rowlocks, and they settle there as if they had been waiting. The boat is ready to be rowed." }] },
  { id: "fit_oars_alone", match: { verb: "fit", obj: "oars" }, if: [{ "player.in": "boat" }],
    do: [{ say: "You set the oars in the rowlocks, and they settle there as if they had been waiting. The boat is ready to be rowed." }] },
  { id: "fit_oars_ashore", match: { verb: ["put", "use", "fit"], obj: "oars", obj2: "boat" },
    do: [{ say: "The rowlocks are for whoever sits in the boat. Get in, and the oars will go where they belong." }] },
  { id: "fit_oars_ashore_alone", match: { verb: "fit", obj: "oars" }, if: [{ "player.at": "boathouse" }],
    do: [{ say: "The rowlocks are for whoever sits in the boat. Get in, and the oars will go where they belong." }] },
  { id: "row_oarless", match: { verb: "row" }, if: [{ "player.in": "boat" }],
    do: [{ say: "You sit with your hands at the empty rowlocks, rowing the air. The boat is very patient, and does not move. Somewhere above, in the boathouse, there is wood for the purpose." }] }
];

// ---- The world ---------------------------------------------------------------------------------------------------------------
export default {
  because: "A lake village at the end of the day: a funicular car, a quay, a boathouse and its loft, a jetty, a lane, an inn and a churchyard; a boatman who is late.",
  facts: [
    "The opening is the stopped funicular car (area car); the first room of the world is the quay.",
    "Teodor the boatman rowed out at dusk to light the island's lamp and has not come back; the village keeps his hours.",
    "The chain: key (churchyard) -> boathouse -> oars (loft), lantern (boathouse), oil and matches (inn) -> lit lantern; endings at the jetty and by rowing out at night.",
    "Night means 19:00 to 06:00; the island's lamp can be rowed to from 21:00."
  ],
  properties: { "lantern.fueled": { type: "boolean", start: false } },
  opening: {
    room: "car", hints: "bottle", intro: "ticket", way: "grille",
    lines: {
      notYet: "The grille will not slide. On the bench, the bottle is still talking, in a small green voice, to nobody.",
      through: "You hold up the bottle, and the grille slides aside the width of a bottle and no more, and closes behind you as if it had only ever meant to.",
      hintFrame: "The cork twitches, and from the bottle someone says:",
      farewell: "The ticket goes soft in your fingers and is a small piece of lake, which runs off your sleeve."
    }
  },
  effects: [
    { time: "day 1 16:40", weekday: "sun" },                 // the opening is played at twenty to five
    { set: "game.entrance", to: "quay" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:10", weekday: "sun" },
      { say: "Up the hill, a bell counts to five, and loses its place at the third." }
    ] },
    // Verbs this world needs
    { add: "word", verb: "fill", words: ["fill", "pour"], reply: "There is nothing here that wants filling." },
    { add: "word", verb: "hang", words: ["hang", "hook"], reply: "There is nothing here that wants hanging." },
    { add: "word", verb: "fit", words: ["fit", "ship"], reply: "There is nothing here that wants fitting." },
    { add: "word", verb: "row", words: ["row", "scull"], object: "none", reply: "There is no boat to row. The boathouse, on the quay, has one." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
