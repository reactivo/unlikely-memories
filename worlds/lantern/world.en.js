// "The Last Word on Lantern Row": a world after the opening, in English, written the way the AI is asked to write a
// world (BRIEF.md, built from WRITING-DIRECTION.md for the voice, GUIDE.md for the shape, ARCHITECTURE.md §3–6 for the
// data, ART-DIRECTION.md for the pictures). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Last Word on Lantern Row",
  blurb: "A London fog that keeps what is said in it. A lamplighter lies dead under the one lamp he didn't light, still at his post. The inquest sits at midnight.",
  thumbnail: { picture: "row", x: 60 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0–95)
  synopsis: "You step out of a stopped cab into a London fog so thick it keeps what is said in it. You have been " +
    "summoned as the witness at the inquest of Albert Fenn, lamplighter, who died this evening under the one lamp on " +
    "Lantern Row he didn't light, and who is still sitting there, waiting to be relieved. The court sits at midnight, " +
    "and it will want a name.",
  tone: "WRITING-DIRECTION.md. Fog-bound London of gas lamps, pie shops and inquests; police manners; a murder with no " +
    "mark on the body. Tender: the killing is a kindness said at the wrong moment.",
  start: "Thursday, 22:30, on Lantern Row (the opening, in the cab, at 22:20).",
  opening: "Inside a hansom cab stopped in the fog: a canary in a cage (hints), a " +
    "summons you already carry (why you came). The fog outside the folding doors is the way on.",
  rules: [
    "Words said in the fog hang where they were said until someone hears them out.",
    "The dead keep their posts until someone relieves them.",
    "A name said in the coroner's court is the truth from then on; the fog sees to it.",
    "Every lamp on the Row is lit by hand, the last one last."
  ],
  characters: ["Mr Fenn, the dead lamplighter", "Constable Pye", "Mrs Halloran, of the pie shop", "Mr Voss, of the Electric Company",
    "Mr Cotter, of the Bell", "Dr Mabbott, the coroner", "Pip, a mudlark"],
  endings: [
    "The truth: bring the last words heard at the lamp to the inquest; they go home to whoever said them, and the fog lifts.",
    "Relieved: light the last lamp yourself and take the lamplighter's post.",
    "The wrong name: name Mr Voss at the inquest. The fog keeps it, and never lifts.",
    "Died: the river takes you, if you go down into it again after its warning."
  ],
  chaos: 0.2
};

// Carried things get their sprites (sprites.js): the one shown when examined, and the one drawn on the floor.
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// The names the court accepts when it asks "Whose?" (rules: name_*), each also as "it was …", "accuse …", "name …"
// and "say …" (the answer is compared without case or punctuation: "Mrs. Halloran!" is "mrs halloran").
const answered = (names) => names.flatMap(n => [n, "it was " + n, "accuse " + n, "i accuse " + n, "name " + n, "say " + n]);
const HALLORAN = answered(["halloran", "mrs halloran", "missus halloran", "the baker", "baker", "the pie woman", "pie woman", "piewoman"]);
const VOSS = answered(["voss", "mr voss", "mister voss", "the company", "company", "the electric company", "electric company"]);
const FENN = answered(["fenn", "mr fenn", "mister fenn", "albert", "albert fenn", "the lamplighter", "lamplighter", "the deceased", "deceased"]);

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  truth: { alt: "Lantern Row from far above at dawn, the fog gone: rooftops in rows, a line of twelve lit lamps along the street, and the river curving past, pink with the sky. Two small figures walk away along the river, arm in arm.", picture: endings.truth },
  relieved: { alt: "Close up, the lantern of the last lamp, lit: four panes of yellow light round a white flame, the iron cap above, and the brass hook of a lamplighter's pole at the tap below.", picture: endings.relieved },
  blamed: { alt: "From far above, a flat grey sea of fog over London, chimney pots poking through it in rows, and one small hard white light where Lantern Row should be.", picture: endings.blamed },
  died: { alt: "Close up, a small brass birdcage in grey fog. The canary sits on its perch with its head tucked under its wing, and the fog comes in between the bars.", picture: endings.died }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "cab": the opening, never returned to. Area "row" (x grows east, y grows south): the court north of the Row,
// the Bell west and the pie shop east of it; the last lamp south, with the substation west, the hut east and the river
// steps south; the bridge east of the steps.
const rooms = {
  cab: {
    name: "THE CAB", area: "cab", at: [0, 0, 0],
    describe: [
      "Inside a hansom cab, stopped. The horse has gone, and the cabman with it; the reins hang past the window like a sentence nobody finished. Through the glass there is only white.",
      "In front of your knees the folding doors stand open on the {fog|cab_fog}, and it is the only way on."
    ],
    exits: { out: true },
    scenery: [
      { words: ["reins", "cabman", "horse", "shafts"], name: "the reins", says: "Leather reins, going up over the roof to where a cabman was. They are still warm where he held them." },
      { words: ["window", "glass", "pane"], name: "the window", says: "A small side window, misted. On the other side of it, white, and nothing in the white." },
      { words: ["seat", "cushion", "plush", "cab", "hansom"], name: "the seat", says: "Red plush worn shiny by a great many people going somewhere in a hurry. Yours is the only warm place on it.", leads: "out" },
      { words: ["hook", "roof", "ceiling"], name: "the hook", says: "A brass hook in the roof, for a lantern. Somebody has hung a bird on it instead." }
    ],
    mentions: ["reins", "window", "glass", "fog", "doors", "seat", "hook", "roof"],
    ambience: { lines: [
      "The cab rocks a little on its springs, as if the horse had only just stepped out of the shafts.",
      "Somewhere in the white a bell rings once, very far off, for someone else.",
      "The canary shifts along its perch and looks at the doors.",
      "A drop of fog gathers on the window, and decides against running down."
    ], every: [25, 60] },
    alt: "From inside a dark hansom cab, red plush on either side, looking out through its open folding doors at thick white fog. Reins hang down across the opening; far off in the fog, the smudge of one lit lamp.",
    overlayAlt: {
      canary: "A canary in a small brass cage hangs from a hook in the roof."
    }
  },
  row: {
    name: "LANTERN ROW", area: "row", at: [1, 0, 0],
    describe: [
      "Lantern Row: a short street of shop fronts between the coroner's court and the river, lit by gas. In this fog the lamps hang like oranges wrapped in muslin, and it could be any hour.",
      "{Constable Pye|pye} walks his beat, which is the Row, which is short. The court is north, behind oak {doors|court_doors}. The Bell is west, the pie shop east. South, the Row runs down to the last lamp and the river."
    ],
    exits: {
      n: { to: "court", if: { "time.hour": { between: [0, 6] } }, closed: "The court doors are shut. The card on them says the inquest sits at midnight." },
      w: { to: "bell", if: { "time.hour": { between: [11, 23] } }, closed: "The Bell is shut. Through the window the chairs stand on the tables with their legs in the air, like something that has given up." },
      e: "pie_shop", s: "last_lamp"
    },
    scenery: [
      { words: ["lamps", "lamp", "gas", "oranges", "muslin"], name: "the lamps", says: "Gas lamps on iron posts, one every few doors, each lit by hand. In the fog they give light to themselves and not much to anyone else." },
      { words: ["bell", "pub"], name: "the Bell", says: "A low pub front, brown varnish and brass, with a smell of porter coming through the door.", leads: "w" },
      { words: ["pie", "pies", "halloran's"], name: "the pie shop", says: "The pie shop's window is yellow and steamed over.", leads: "e" },
      { words: ["shops", "shop", "fronts", "front", "street", "row"], name: "the shop fronts", says: "A tobacconist, a chandler, a shop that mends umbrellas and nothing else. All shut, all lit by somebody else's lamp." },
      { words: ["fog", "muck", "peasouper"], name: "the fog", says: "Yellow-grey and thick enough to lean on. Now and then a word goes by in it at head height, too faint to make out." },
      { words: ["cobbles", "cobble", "kerb"], name: "the cobbles", says: "Wet cobbles. The fog has been lying on them so long they have taken its colour." }
    ],
    mentions: ["Constable Pye", "doors", "lamps", "shop fronts", "fog", "cobbles"],
    ambience: { lines: [
      "A lamp further down the Row coughs, and steadies.",
      "Footsteps go by in the fog, quite close, and nobody comes with them.",
      "A word drifts past at head height, too faint to make out, like a moth that has lost its lamp.",
      "Constable Pye stops, writes something in his notebook, and walks on.",
      "You look back for the cab. There is only [way], the same as everywhere else."
    ], every: [40, 80] },
    // The court sits at midnight: worth waiting for here whenever it isn't sitting.
    waitFor: { time: "next 00:00", says: "You wait by the court doors. The fog comes and stands beside you, and waits too.", if: [{ "time.hour": { between: [6, 24] } }] },
    alt: "A street of shop fronts in thick grey fog, seen from the middle of the cobbles: gas lamps going away as orange blurs, the Bell's red window on the left, the pie shop's yellow one on the right, the court's dark doors at the far end, and a policeman in a helmet standing on the right."
  },
  bell: {
    name: "THE BELL", area: "row", at: [0, 0, 0],
    describe: [
      "The Bell: brown varnish, low beams, and a warmth like the inside of somebody's coat. Men in caps sing at the bar, each a little behind the one before.",
      "{Mr Cotter|cotter}, the landlord, polishes a glass that will never be clean enough for him. A {fire} burns in the grate. The Row is east."
    ],
    exits: { e: { to: "row", out: true } },
    scenery: [
      { words: ["bar", "counter", "pumps"], name: "the bar", says: "Mahogany, scarred with forty years of elbows. The pumps have brass handles worn to the shape of hands." },
      { words: ["men", "man", "caps", "cap", "singers", "singing", "song", "chorus"], name: "the men at the bar", says: "Dockers and cabmen, singing about a river and a girl who wouldn't. None of them knows all the words. Between them they nearly do." },
      { words: ["beams", "beam", "varnish", "ceiling"], name: "the beams", says: "Low enough to duck for. The varnish has gone the colour of strong tea." },
      { words: ["glass", "glasses"], name: "the glass", says: "Mr Cotter holds it up to the lamp, finds something wrong with it that nobody else could, and goes on polishing." },
      { words: ["grate"], name: "the grate", says: "An iron grate, banked high with coal." }
    ],
    mentions: ["Mr Cotter", "fire", "bar", "men", "glass", "beams", "grate"],
    ambience: { lines: [
      "The singing stops for a breath, and starts again a little further on.",
      "Someone at the bar says Fenn's name, and the others drink to it without quite knowing why.",
      "The fire settles. A man in a cap looks into it as if it owed him money.",
      "The door opens, the fog looks in, and somebody shuts the door on it."
    ], every: [35, 70] },
    alt: "A low-beamed public house in silhouette: men in caps black against the red and orange glow of a coal fire on the left, a long dark bar, the landlord behind it holding up a glass."
  },
  pie_shop: {
    name: "HALLORAN'S PIES", area: "row", at: [2, 0, 0],
    describe: [
      "A pie shop the width of a coat rack: a counter, a window steamed blind, and an {oven} that has not gone out since the old Queen. Everything smells of pastry and hot fat.",
      "{Mrs Halloran|halloran} stands behind the counter with flour to the elbow, wiping a place that is already clean. The Row is west."
    ],
    exits: { w: { to: "row", out: true } },
    scenery: [
      { words: ["counter", "trays", "tray", "pies", "pastry"], name: "the counter", says: "Trays of pies in rows, each with a little steam hole cut in the shape of a leaf. One row has a gap in it." },
      { words: ["window", "steam", "letter"], name: "the window", says: "Steamed blind from the inside. Someone has written a single letter in the steam with a finger, an A, and the steam has nearly taken it back." }
    ],
    mentions: ["oven", "Mrs Halloran", "counter", "window", "pies", "flour"],
    smell: "Pastry and hot fat, and under them something sweeter: the smell of a kitchen where someone is always expected.",
    alt: "A pie shop seen from above: a long brown counter with trays of golden pies in rows, the glowing mouth of an iron oven at the top, a steamed window along the bottom, and a woman in a white cap leaning over the counter on the right."
  },
  court: {
    name: "CORONER'S COURT", area: "row", at: [1, -1, 0],
    describe: [
      "A varnished room with a bench, a {witness box|witness_box} and a jury of twelve chairs, in which the fog sits, listening. Inquests on the Row are held at midnight, so the deceased can attend if he likes.",
      "{Dr Mabbott|mabbott}, the coroner, waits at the bench with his pen. The Row is south."
    ],
    exits: { s: { to: "row", out: true } },
    scenery: [
      { words: ["bench", "panels", "leather"], name: "the bench", says: "High and green, with brass studs. It was built so that coroners could look down on things, and they do." },
      { words: ["chairs", "chair", "jury", "fog"], name: "the jury", says: "Twelve chairs in two rows. The fog has taken all of them and sits very still, the way a jury does when it has already decided to listen." }
    ],
    mentions: ["witness box", "Dr Mabbott", "bench", "chairs", "jury", "fog", "pen"],
    alt: "Looking up from the witness box at a high green coroner's bench: a thin man in black above it with a pen, a green-shaded lamp beside him, and on the right twelve jury chairs with pale fog sitting in them."
  },
  last_lamp: {
    name: "THE LAST LAMP", area: "row", at: [1, 1, 0],
    describe: [
      "The bottom of the Row, where the cobbles stop at the river wall. Every lamp on the Row is lit except the last {lamp|dark_lamp}. Under it, on the kerb, sits {Mr Fenn|fenn}, the lamplighter, his hands on his knees. He died here this evening, and has not been relieved.",
      "The {fog|fog_lamp} is thickest here, and murmurs. His {hut|hut_door} is east, the Electric Company's substation west. Steps go down to the river, south; the Row goes back up north."
    ],
    exits: {
      n: "row", w: "substation", s: "river_steps",
      // The hut is the one building here "in" means (the substation is entered by its name): the way east is also the way in.
      e: { to: "hut", in: true, if: { "hut_door.locked": false }, closed: "The hut door is locked. It wants Mr Fenn's key." }
    },
    scenery: [
      { words: ["kerb", "cobbles", "wall", "river"], name: "the river wall", says: "A low wall of black stone, and the river slapping it somewhere below. The kerb is worn where one man has sat down on it once." },
      { words: ["steps", "stairs"], name: "the steps", says: "Stone steps going down to the river, south.", leads: "s" }
    ],
    mentions: ["lamp", "Mr Fenn", "kerb", "cobbles", "fog", "hut", "river wall", "steps"],
    ambience: { lines: [
      "The fog murmurs, a word here, half a word there, like a crowd in another room.",
      "The river slaps the wall below, once, as if to make a point.",
      "A lamp up the Row hisses, and Mr Fenn turns his head towards it, from habit.",
      "Mr Fenn clears his throat, thinks better of it, and goes on being dead."
    ], every: [35, 70] },
    // Worth waiting for until the Bell shuts and the Row goes quiet.
    waitFor: { time: "next 23:00", says: "You wait by the last lamp with Mr Fenn. Neither of you says anything, which he prefers.", if: [{ "time.hour": { between: [11, 23] } }] },
    alt: "A wide view along a river wall in dark blue fog. On the left a tall iron lamp-post, unlit, its glass black; at its foot a small man in a cap sits on the kerb. On the right, a green wooden hut with its door. Far off up the Row, the faint glow of other lamps."
  },
  hut: {
    name: "THE LAMPLIGHTER'S HUT", area: "row", at: [2, 1, 0],
    describe: [
      "Mr Fenn's hut: a wooden box the size of a wardrobe, smelling of gas and paraffin. Forty years of caps hang on forty years of nails, the oldest at the top.",
      "His {log book|logbook} lies open on the shelf at today's page. The door is west."
    ],
    exits: { w: { to: "last_lamp", out: true } },
    scenery: [
      { words: ["caps", "cap", "nails", "nail"], name: "the caps", says: "The same cap forty times, each a little greener than the one after it. The newest nail is empty." },
      { words: ["shelf", "tin", "matches"], name: "the shelf", says: "A plank on two brackets, holding the log book and a tin of matches nobody has needed in forty years." },
      { words: ["door", "hut"], name: "the door", says: "The hut door, open, and the last lamp outside it, west.", leads: "w" }
    ],
    mentions: ["caps", "nails", "log book", "shelf", "door"],
    alt: "Inside a tiny wooden hut, looking at its back wall: three rows of old caps on nails, bright green at the top and greyer lower down, the last nail empty, and a shelf with an open log book and a red tin.",
    overlayAlt: { trumpet: "A dented brass ear trumpet lies on the floor." }
  },
  substation: {
    name: "THE SUBSTATION", area: "row", at: [0, 1, 0],
    describe: [
      "The Electric Company's substation: a brick room with the only electric bulb on the Row, and a {dynamo} that hums like a man who knows he is right.",
      "{Mr Voss|voss} sits at a desk under the bulb with his {ledger} open, in a bowler hat he has not taken off since the Company sent him. The last lamp is east."
    ],
    exits: { e: { to: "last_lamp", out: true } },
    scenery: [
      { words: ["bulb", "light", "flex"], name: "the bulb", says: "One electric bulb on a flex, very white, very sure. It makes the brick look as if it had been caught at something." },
      { words: ["desk", "brick", "bricks", "wires", "wire"], name: "the desk", says: "A Company desk, Company brick, Company wires going down into the floor, waiting for Monday." }
    ],
    mentions: ["dynamo", "Mr Voss", "ledger", "bulb", "desk", "bowler hat"],
    ambience: { lines: [
      "The dynamo changes its note a little, as if it had thought of something.",
      "The bulb flickers once, and Mr Voss looks up at it, hurt.",
      "Under the floor, the Row's new wires hum to themselves, waiting for Monday."
    ], every: [40, 80] },
    alt: "A brick room lit by one bare electric bulb: a big humming dynamo on the left, and on the right a man in a bowler hat at a desk with an open ledger."
  },
  river_steps: {
    name: "THE RIVER STEPS", area: "row", at: [1, 2, 0],
    describe: [
      "Stone steps go down from the river wall to a strip of mud, and below it the Thames goes by, brown and in no hurry. You hear it better than you see it.",
      "At the bottom {Pip|pip}, a mudlark, turns things over with a stick and keeps the good ones in a bucket. The {river} slaps the last step, as if it wanted the next one. The bridge is east; the last lamp, back up north."
    ],
    exits: { n: "last_lamp", e: "bridge" },
    scenery: [
      { words: ["steps", "stairs", "wall"], name: "the steps", says: "Stone steps, green at the bottom, going back up to the last lamp, north.", leads: "n" },
      { words: ["mud", "strip", "foreshore"], name: "the mud", says: "Black mud, shining. Things go into it and, if Pip is about, come out again." }
    ],
    mentions: ["Pip", "river", "mud", "steps", "bucket", "stick", "Thames"],
    ambience: { lines: [
      "The river sucks at the bottom step and lets it go.",
      "Pip holds something up to the fog, decides against it, and drops it back in the mud.",
      "Far out on the water a boat's bell rings, and nobody answers it.",
      "A word floats by on the current, face down."
    ], every: [35, 75] },
    alt: "Looking down from a river wall: stone steps going down on the left to a strip of black mud, a small girl in a big coat with a bucket on the mud, and the brown river filling the picture up to a far bank lost in fog."
  },
  bridge: {
    name: "THE BRIDGE", area: "row", at: [2, 2, 0],
    describe: [
      "Out on the bridge the fog thins, as if it had stopped to catch its breath. The river goes under you without a sound. Back on the bank, Lantern Row is a short string of lit lamps with a gap at the end.",
      "The {parapet} is wet and cold under your hands. The far half of the bridge has been lost in the fog for years, and nobody goes to look for it. The river steps are west."
    ],
    exits: { w: "river_steps" },
    scenery: [
      { words: ["river", "water", "thames"], name: "the river", says: "Below, the river, going under the bridge as if it had an appointment." },
      { words: ["lamps", "lamp", "string", "gap", "bank", "lantern", "row"], name: "the Row", says: "Eleven lamps in a line, small and yellow, and then a gap where the twelfth should be." },
      { words: ["half", "far", "end"], name: "the far half", says: "Fog, and more fog. The bridge goes into it and does not come out. Nobody on the Row has ever needed the other bank." }
    ],
    mentions: ["parapet", "river", "lamps", "bank", "far half"],
    alt: "Far off across pale blue fog and dark water, a low bank with a short row of tiny yellow lamps and a gap at the end of it; a stone parapet along the bottom of the picture."
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------
const objects = {
  // The opening: the thing to take, the one you carry, and the way on (BRIEF.md §3).
  canary: { at: "cab", portable: true, name: "Canary", note: "Watching the fog for you.", actions: ["Take canary", "Listen to canary"], heldActions: ["Listen to canary", "Examine canary"],
    words: { nouns: ["canary", "bird", "cage"], adj: ["yellow", "brass", "small", "little"] }, ...item("canary"),
    here: "From a hook in the roof hangs a {canary} in a small brass cage, watching the fog for you.",
    examine: "A yellow canary in a brass cage the size of a hat. Miners take them underground to tell them when the air goes bad. This one has been brought to London, where it has a great deal to say." },
  summons: { at: "player", portable: true, name: "Summons", note: "Folded, official.", actions: ["Read summons"], heldActions: ["Read summons"],
    words: { nouns: ["summons"], adj: ["folded", "official"] }, ...item("summons"),
    examine: "\"You are called as witness to the inquest into the death of Albert Fenn, lamplighter, of Lantern Row. The court sits at midnight.\" Under the seal, in another hand, smaller: \"The deceased will be present.\"" },
  cab_fog: { at: "cab", scenery: true, name: "Fog", note: "The only way on.", actions: ["Examine fog", "Enter fog"],
    words: { nouns: ["fog", "doors", "door", "white"], adj: ["folding", "open", "thick"] },
    examine: "The cab's folding doors stand open on a fog so thick it has a grain, like paper. Somewhere in it, very far off, a lamp is lit, or remembered." },

  // Lantern Row
  pye: { at: "row", scenery: true, name: "Constable Pye", note: "On his beat.", actions: ["Talk to Constable Pye"],
    words: { nouns: ["pye", "constable", "policeman", "officer", "bobby"], adj: ["constable", "police"] },
    examine: "A tall young constable in a cape, with a lamp of his own and a {notebook} he holds like a hymn book. His helmet has collected a little fog in its crown.",
    parts: [{ words: ["helmet", "cape"], name: "his helmet", says: "Fog has pooled in the crown of it. He hasn't noticed, or is too polite to." }], mentions: ["notebook", "helmet", "cape"],
    talk: "\"Evening,\" says Constable Pye. \"You'll be the witness. Inquest's at midnight, in the court. I've got the persons present written down, if you want them.\"",
    topics: {
      present: { open: true, label: "the persons present", words: ["persons", "present", "list", "suspects", "people", "notebook"], says: "\"Persons present at the last lamp this evening,\" he reads. \"Mr Voss, of the Company. Mrs Halloran, of the pies. The deceased. That's all the fog let me see.\"" },
      fog: { open: true, label: "the fog", words: ["fog", "words", "word", "voices"], says: "\"Words hang in this fog till somebody hears them out. Known fact. You'd want a lamplighter's trumpet for it, and quiet. It's never quiet on the Row till the Bell shuts at eleven.\"" },
      fenn: { label: "Mr Fenn", words: ["fenn", "albert", "lamplighter", "death", "body", "deceased"], says: "\"Found him at the last lamp, sitting. Not a mark on him. He said good evening. I said good evening back. Then I wrote it down.\"" },
      voss: { label: "Mr Voss", words: ["voss", "company", "electric", "electricity"], says: "\"Said something unkind to Mr Fenn at the third lamp. Said it again to me, for the notebook. Proud of it, he was.\"" },
      halloran: { label: "Mrs Halloran", words: ["halloran", "pies", "pie"], says: "\"Mrs Halloran gave him his pie, same as every night. She's not said a word since. She never did say much.\"" },
      inquest: { open: true, label: "the inquest", words: ["inquest", "court", "coroner", "midnight", "mabbott", "name"], says: "\"Midnight, in the court, north of here. Dr Mabbott likes a name. Mind you give him the right one. A name said in there stays said.\"" },
      default: "\"I'll make a note of that,\" says Constable Pye, and does."
    } },
  notebook: { at: "pye", scenery: true, name: "Notebook", note: "Persons present.", actions: ["Read notebook"],
    words: { nouns: ["notebook", "list"], adj: ["constable's", "police", "black"] },
    examine: "In a careful hand: \"Persons present at the last lamp, this evening: Mr Voss (Electric Co.). Mrs Halloran (pies). The deceased.\" Underneath, smaller: \"Fog very thick. Could not see faces. Heard a voice.\"" },
  court_doors: { at: "row", scenery: true, name: "Court doors", note: "The inquest sits at midnight.", actions: ["Examine doors"], leads: "n",
    words: { nouns: ["doors", "door", "card"], adj: ["court", "oak", "coroner's"] },
    examine: "Oak doors with a card pinned to them: \"Inquest. A. Fenn, lamplighter. Midnight.\" They open when the court sits, and not before." },

  // The Bell
  cotter: { at: "bell", scenery: true, name: "Mr Cotter", note: "The landlord.", actions: ["Talk to Mr Cotter", "Order porter"],
    words: { nouns: ["cotter", "landlord", "publican", "barman"], adj: ["mr", "mister"] },
    examine: "A broad man in shirtsleeves and a waistcoat, who has heard every song in the Bell sung wrong and forgiven none of them.",
    talk: "\"What'll it be?\" says Mr Cotter. \"We shut at eleven. After that the Row's so quiet you could hear a word drop.\"",
    topics: {
      porter: { open: true, label: "a drink", words: ["porter", "drink", "half", "pint", "beer", "ale"], says: "\"One,\" says Mr Cotter. \"I said. I'm not running a hospital.\"" },
      closing: { open: true, label: "closing time", words: ["closing", "close", "eleven", "shut", "time", "quiet"], says: "\"Eleven sharp. The Row goes quiet then. Fenn used to say it was the only hour you could hear the gas think.\"" },
      fenn: { label: "Mr Fenn", words: ["fenn", "albert", "lamplighter"], says: "\"Never set foot in here. Teetotal, forty years. Had his pie at Halloran's instead, every night, regular as the lamps.\"" },
      voss: { label: "Mr Voss", words: ["voss", "company", "electric"], says: "\"In here earlier, crowing. Told Fenn his lamps were finished, he said, and Fenn said thank you and went and lit the next one. Voss didn't care for that.\"" },
      halloran: { label: "Mrs Halloran", words: ["halloran", "pies", "pie"], says: "\"Sweet on Fenn for forty years, she was. Never said a word to him about it, that anybody heard.\"" },
      default: "\"Couldn't say,\" says Mr Cotter. \"I only pour.\""
    } },
  fire: { at: "bell", scenery: true, name: "Fire", note: "Banked high.", actions: ["Examine fire"],
    words: { nouns: ["fire", "coal", "flames"], adj: ["coal"] },
    examine: "Coal, banked high and roaring quietly to itself. The fog comes in at the door, takes one look at it, and goes out again." },
  porter: { at: null, portable: false, name: "Half of porter", note: "Dark, with a head.", actions: ["Examine porter"],
    words: { nouns: ["porter", "drink", "half", "pint", "beer", "ale"], adj: ["dark"] },
    examine: "Dark as the river and warmer." },

  // The pie shop
  halloran: { at: "pie_shop", scenery: true, name: "Mrs Halloran", note: "Flour to the elbow.", actions: ["Talk to Mrs Halloran", "Order pie"],
    words: { nouns: ["halloran", "woman", "baker", "piewoman"], adj: ["mrs", "missus"] },
    examine: "A small woman in a white cap and a floury apron. Her hands keep working when the rest of her has stopped.",
    parts: [{ words: ["flour", "apron", "hands", "cap"], name: "her apron", says: "Flour to the elbow, and on the apron, two floury handprints, where she has held something against it." }], mentions: ["flour", "apron"],
    talk: "\"We're shut,\" says Mrs Halloran, though the door was open and the oven is lit. \"Have a pie anyway. Somebody should.\"",
    topics: {
      pie: { open: true, label: "a pie", words: ["pie", "pies", "food", "supper"], says: "\"One's plenty,\" she says. \"He only ever had the one.\"" },
      fenn: { label: "Mr Fenn", words: ["fenn", "albert", "lamplighter", "death"], says: "\"Forty years he had his pie here, and took it down to the last lamp, and lit her.\" She wipes the counter where it is already clean. \"I walked down with him tonight. First time in forty years.\"" },
      voss: { label: "Mr Voss", words: ["voss", "company", "electric"], says: "\"That Voss. Told Albert his lamps were finished, under my window, at the third lamp. Albert said thank you. He would.\"" },
      fog: { open: true, label: "the fog", words: ["fog", "words", "word", "said"], says: "\"Whatever you say in that fog stays said,\" she says. \"That's why I never said much. Not in forty years.\"" },
      inquest: { about: "court", label: "the inquest", words: ["inquest", "court", "coroner", "midnight"], says: "\"I'll not go,\" she says. \"I've nothing to say.\" She has flour to the elbow, and she looks at it." },
      default: "\"I only do pies, love,\" says Mrs Halloran."
    } },
  oven: { at: "pie_shop", scenery: true, name: "Oven", note: "Never out.", actions: ["Examine oven"],
    words: { nouns: ["oven", "range", "door"], adj: ["iron", "black"] },
    examine: "A black iron oven, its door ajar on a glow the colour of a good evening. It has been lit since the old Queen, and Mrs Halloran talks to it when the shop is empty." },
  pie: { at: null, portable: false, name: "Pie", note: "Hot, still steaming.", actions: ["Examine pie"],
    words: { nouns: ["pie", "pies", "supper"], adj: ["hot", "steak"] },
    examine: "A pie in a paper, too hot to hold and too good to put down." },

  // The court
  mabbott: { at: "court", scenery: true, name: "Dr Mabbott", note: "The coroner.", actions: ["Talk to Dr Mabbott"],
    words: { nouns: ["mabbott", "coroner", "doctor"], adj: ["dr", "doctor"] },
    examine: "A thin man in a black coat, with a pen behind each ear and a third in his hand. He has held an inquest on every death on the Row since the old Queen, and agreed with most of them.",
    parts: [{ words: ["pen", "pens", "ink"], name: "his pen", says: "Steel-nibbed, and dry. It is waiting for a name." }], mentions: ["pen"],
    talk: "\"Ah, the witness,\" says Dr Mabbott. \"Take your time. The court hears words, and the court hears names. Whatever is said in here stays said.\"",
    topics: {
      words: { open: true, label: "evidence", words: ["evidence", "words", "word", "proof", "witness"], says: "\"Words, if you have them,\" he says. \"The fog will have kept the last ones said at the lamp. Bring them, and the court will hear them out.\"" },
      names: { open: true, label: "naming someone", words: ["name", "names", "naming", "accuse", "accusing", "blame", "who"], says: "\"A name said in this court is the truth from then on. The fog sees to it. You may name a person present at the lamp; the constable has the list. Choose with care. It can't be unsaid.\"" },
      fenn: { label: "Mr Fenn", words: ["fenn", "albert", "deceased", "lamplighter", "death"], says: "\"No mark on him, and he still at his post. A death by words, I should say. The question is whose.\"" },
      verdict: { open: true, label: "the verdict", words: ["verdict", "inquest", "finding"], says: "\"The court finds what it is told,\" he says. \"That is the trouble with courts.\"" },
      default: "\"Not a matter for this court,\" says Dr Mabbott, and makes a small note anyway."
    } },
  witness_box: { at: "court", scenery: true, name: "Witness box", note: "For you.", actions: ["Enter witness box"], enterable: "in",
    words: { nouns: ["box"], adj: ["witness"] },
    enter: "You step into the witness box. It is exactly your size, as if the carpenter had known.",
    examine: "A pen of varnished wood with a rail worn pale by the hands of people who saw something. It is exactly your size." },

  // The last lamp
  fenn: { at: "last_lamp", scenery: true, name: "Mr Fenn", note: "Dead, and on duty.", actions: ["Talk to Mr Fenn"],
    words: { nouns: ["fenn", "lamplighter", "albert", "man", "body"], adj: ["mr", "mister", "dead", "old"] },
    examine: "A small man in a cap and a coat gone green at the seams, sitting very straight on the kerb with his hands on his knees. There is a {key|hut_key} on a string round his neck. He is dead, and still on duty.",
    take: "He is heavier than he looks. He has been at his post a long time.",
    parts: [{ words: ["coat", "seams", "hands", "knees", "cap"], name: "his coat", says: "Green at the seams, polished at the elbows by forty years of reaching up." }], mentions: ["key", "coat", "cap"],
    talk: "\"Evening,\" says Mr Fenn, without getting up. \"I can't leave my post. Not till I'm relieved.\"",
    topics: {
      death: { open: true, label: "his death", words: ["death", "died", "dead", "murder", "killed", "who", "dying"], says: "\"Couldn't tell you who,\" he says. \"Wouldn't be fair, not before the inquest. Ask the fog. It was here.\"" },
      fog: { open: true, label: "the fog", words: ["fog", "words", "word", "listen", "listening"], says: "\"Holds everything, this fog. Every word said in it hangs where it was said till somebody hears it out. I used to listen to the gas with my old trumpet. It's in the hut.\"" },
      hut: { about: "hut_door", label: "his hut", words: ["hut", "key", "trumpet", "string"], says: "\"Key's round my neck. Take it. I shan't be going anywhere.\"" },
      lamp: { about: "dark_lamp", label: "the last lamp", words: ["lamp", "lamps", "light", "post", "pole", "relieved", "relieve"], says: "\"Twelve lamps every night, the last one last. Whoever lights her takes the post. That's how I had it off old Dacre, and he off his father.\"" },
      voss: { label: "Mr Voss", words: ["voss", "company", "electric"], says: "\"Mr Voss. Told me my lamps were finished. I said thank you. You do, to the Company.\"" },
      halloran: { label: "Mrs Halloran", words: ["halloran", "pie", "pies"], says: "He looks up the Row towards the pie shop for a long time. \"Best pies on the river,\" he says. \"I've had one every night for forty years, and gone on to the last lamp.\"" },
      inquest: { open: true, label: "the inquest", words: ["inquest", "court", "coroner", "midnight"], says: "\"Midnight. I'll not be attending. Can't leave my post.\"" },
      default: "\"Couldn't say,\" says Mr Fenn. \"I only did the lamps.\""
    } },
  hut_key: { at: "fenn", portable: true, name: "Hut key", note: "On a string.", actions: ["Take key"], heldActions: ["Examine key", "Unlock door with key"],
    words: { nouns: ["key", "string"], adj: ["hut", "iron", "small"] }, ...item("hut_key"),
    here: "A small iron {key|hut_key} on a string lies where you left it.",
    examine: "A small iron key on a length of string, warm from a neck that isn't any more." },
  dark_lamp: { at: "last_lamp", scenery: true, name: "The last lamp", note: "The only one not lit.", actions: ["Examine lamp", "Light lamp"],
    words: { nouns: ["lamp", "lamppost", "post", "lantern", "glass"], adj: ["last", "unlit", "dark", "twelfth", "iron"] },
    examine: "An iron post and a lantern of four panes, cold, with the tap shut. It is the twelfth lamp of twelve, and the only one on the Row that nobody lit tonight. It is too high to reach without a lamplighter's pole.",
    climb: "The post is iron and wet, and there is nothing to hold on to. Lamplighters never climbed. They had a pole for it." },
  fog_lamp: { at: "last_lamp", scenery: true, name: "Fog", note: "Murmuring, word by word.", actions: ["Listen to fog"],
    words: { nouns: ["fog", "murmur", "murmuring", "mist"], adj: ["thick"] },
    examine: "The fog is thickest here, and it murmurs: a word, half a word, too faint to make out, all of them said here and none of them heard yet." },
  hut_door: { at: "last_lamp", scenery: true, name: "Hut door", note: "Mr Fenn's.", actions: ["Examine door", "Open door"], leads: "e",
    words: { nouns: ["door", "hut"], adj: ["hut", "wooden", "green"] },
    examine: "The door of a wooden hut the size of a wardrobe, painted green a great many times. Locked: it wants Mr Fenn's key.",
    locked: true, lock: { key: "hut_key", says: "The hut door is locked. It wants Mr Fenn's key.",
      opens: "The key turns as if it has done it every night for forty years. The hut door swings open on a smell of gas and paraffin.", then: "hut_opened" } },

  // The hut
  trumpet: { at: "hut", portable: true, name: "Ear trumpet", note: "For listening to gas.", actions: ["Take trumpet"], heldActions: ["Listen to trumpet", "Examine trumpet"],
    words: { nouns: ["trumpet"], adj: ["ear", "brass", "dented"] }, ...item("trumpet"),
    here: "There is a dented brass {ear trumpet|trumpet} here.",
    examine: "A brass ear trumpet, dented, the kind the old lamplighters held to a lamp to hear whether the gas was breathing. Inside the bell of it, the brass is bright, as if it had been listening to something warm." },
  pole: { at: "hut", portable: true, name: "Lamplighter's pole", note: "Still burning.", actions: ["Take pole"], heldActions: ["Examine pole"],
    words: { nouns: ["pole", "flame", "hook"], adj: ["lamplighter's", "long", "brass"] }, ...item("pole"),
    here: "Mr Fenn's long {pole} leans here, its little blue flame still burning.",
    examine: "A long pole with a brass hook for the tap and a small blue flame at the tip that has not gone out in forty years. It is heavier at the end that did the work." },
  logbook: { at: "hut", scenery: true, name: "Log book", note: "Every lamp, every night.", actions: ["Read log book"],
    words: { nouns: ["book", "logbook", "log", "page"], adj: ["log", "open", "lamp"] },
    examine: "Every lamp of every night for forty years, in pencil. Today's page: \"Lamp one, lit. Two, lit. Three, lit. Voss called, unpleasant. Four, lit,\" and so on to eleven, and then: \"Pie.\" Under that, \"Twelve,\" and nothing after it." },

  // The substation
  voss: { at: "substation", scenery: true, name: "Mr Voss", note: "The Electric Company.", actions: ["Talk to Mr Voss"],
    words: { nouns: ["voss", "man", "company"], adj: ["mr", "mister", "electric"] },
    examine: "A neat man in a celluloid collar and a {bowler hat|bowler}, who looks at the dynamo the way other men look at their sons.",
    mentions: ["bowler hat"],
    talk: "\"Voss, Electric Company,\" he says, and offers a hand you didn't ask for. \"On Monday the Row goes electric. You'll be wanting to ask me about Fenn. Everybody is.\"",
    topics: {
      fenn: { open: true, label: "Mr Fenn", words: ["fenn", "albert", "lamplighter", "death", "said", "words"], says: "\"I told him straight, at his third lamp. Your lamps are finished, Fenn. Monday the Row goes electric.\" He sniffs. \"He said thank you and went on to the fourth. Thank you.\"" },
      alibi: { open: true, label: "this evening", words: ["evening", "alibi", "tonight", "where", "dynamo"], says: "\"I came straight back here to my dynamo, and here I've been. Ask it.\" The dynamo hums, as if it would rather not be asked." },
      electric: { open: true, label: "the electric", words: ["electric", "electricity", "monday", "bulb", "light"], says: "\"Monday,\" he says. \"Twelve electric lamps, all at once, from this room. Nobody will have to walk anywhere ever again.\"" },
      halloran: { label: "Mrs Halloran", words: ["halloran", "pies", "pie"], says: "\"The pie woman. Sweet on him forty years, and never once said so. You'd think she'd have said, at the end.\" He thinks about it. \"Maybe she did.\"" },
      inquest: { about: "court", label: "the inquest", words: ["inquest", "court", "coroner", "midnight", "name"], says: "\"They'll want a name,\" he says. \"Mine's a good one for it, I expect. Everybody likes to blame the Company.\"" },
      default: "\"That's not the Company's concern,\" says Mr Voss."
    } },
  bowler: { at: "voss", scenery: true, name: "Bowler hat", note: "Company issue.", actions: ["Examine bowler"],
    words: { nouns: ["bowler", "hat"], adj: ["bowler", "black"] },
    examine: "A black bowler, brushed against the fog. He has not taken it off since the Company sent him, in case the Company looks in." },
  dynamo: { at: "substation", scenery: true, name: "Dynamo", note: "Humming, very sure.", actions: ["Listen to dynamo"],
    words: { nouns: ["dynamo", "machine", "drum", "coil"], adj: ["big", "humming"] },
    examine: "A great iron drum wound with copper, humming. It is going to light twelve lamps at once on Monday and has already stopped thinking about anything else.",
    listen: "A hum, low and certain, with no words in it at all. Mr Voss finds it restful.",
    touch: "Warm, and very sure of itself. It doesn't notice you." },
  ledger: { at: "substation", scenery: true, name: "Ledger", note: "Company figures.", actions: ["Read ledger"],
    words: { nouns: ["ledger", "figures", "columns"], adj: ["company", "open"] },
    examine: "Columns of figures, and at the bottom of today, in a neat hand: \"Informed F. of Monday, at his third lamp. He thanked me. Returned here.\" The word thanked is underlined twice." },

  // The river steps
  pip: { at: "river_steps", scenery: true, name: "Pip", note: "A mudlark.", actions: ["Talk to Pip"],
    words: { nouns: ["pip", "mudlark", "girl", "child"], adj: [] },
    examine: "A girl of about ten in a man's coat, mud to the knee, with a {bucket} of things that were lost and a stick for finding more.",
    parts: [{ words: ["bucket", "stick", "coat"], name: "her bucket", says: "Spoons, buttons, a doorknob, half a pair of spectacles. And at the bottom, something small and pale that she covers with her hand when you look." }], mentions: ["bucket", "stick"],
    talk: "\"Finders,\" says Pip, without looking up. \"Ask me what I found, if you want.\"",
    topics: {
      found: { open: true, label: "what she found", words: ["found", "finds", "bucket", "things", "mud", "find"], says: "\"Spoons. A button. Words, sometimes, when they drop in the river. They go hard in the mud, like biscuits. Nothing tonight.\" She looks up the steps. \"Tonight I heard.\"" },
      heard: { open: true, label: "what she heard", words: ["heard", "hear", "voice", "lady", "tonight", "sound"], says: "\"A lady, up by the lamp. Kind voice. Floury, if a voice can be. She said something, soft. Then Mr Fenn sat down. I heard his knees go, like a gate.\"" },
      fenn: { label: "Mr Fenn", words: ["fenn", "albert", "lamplighter"], says: "\"He gave me a penny to hold his ladder. He didn't have a ladder. He liked the company.\"" },
      river: { open: true, label: "the river", words: ["river", "thames", "water", "swim"], says: "\"Don't go in. It's colder than it looks and it doesn't give things back. Except to me.\"" },
      default: "\"Dunno,\" says Pip. \"It's not in the bucket.\""
    } },
  river: { at: "river_steps", scenery: true, name: "River", note: "Brown, in no hurry.", actions: ["Examine river"],
    words: { nouns: ["river", "thames", "water"], adj: ["brown", "cold"] },
    examine: "Brown water, moving fast under its own calm, with the fog lying on it like a lid. It looks cold, and hungry, and the last step is dark where it has already reached for you. It doesn't give things back, Pip says." },

  // The bridge
  parapet: { at: "bridge", scenery: true, name: "Parapet", note: "Cold stone.", actions: ["Examine parapet"],
    words: { nouns: ["parapet", "stone", "balustrade", "rail"], adj: ["wet", "cold", "stone"] },
    examine: "Cold stone, wet with fog. From here you can see the shape the fog makes over the Row: thickest round the last lamp, and round the chimney of the pie shop, leaning towards it like someone listening." },

  // What comes to hand later
  last_words: { at: null, portable: true, name: "Last words", note: "Cupped in your hands.", actions: ["Examine words"], heldActions: ["Examine words", "Give words to Mabbott"],
    words: { nouns: ["words", "sentence"], adj: ["last", "warm"], pl: true }, ...item("last_words"),
    here: "The {last words|last_words} lie here, faintly warm.",
    examine: "\"Leave it, Albert. Sit down a minute. Nobody will miss one lamp.\" A woman's voice, low and warm, with flour on it. The words are still a little warm, and they smell of pastry." }
};

// ---- Named changes ---------------------------------------------------------------------------------------------------
const changes = {
  key_taken: [
    { set: "fenn.examine", to: "A small man in a cap and a coat gone green at the seams, sitting very straight on the kerb with his hands on his knees. His neck looks bare without the string. He is dead, and still on duty." },
    { set: "fenn.mentions", to: ["coat", "cap"] }
  ],
  hut_opened: [
    { set: "hut_door.examine", to: "The door of Mr Fenn's hut, open on a smell of gas and paraffin. The key turned in it as if it knew you." },
    { draw: "last_lamp", restyle: [{ id: "hut_door", fill: 0 }] }
  ],
  // The endings
  truth_ending: [
    { move: "last_words", to: null },
    { say: "You open your hands. The last words go up out of them, over the jury of chairs and out through the court doors, and down the Row. Dr Mabbott writes without looking. After a while the doors open again, and Mrs Halloran comes in with flour to the elbow and the words held against her apron, the way you would hold a dropped glove. \"I asked him to sit down,\" she says. \"Just the once.\"" },
    { say: "\"Death by kindness,\" says Dr Mabbott, and blots it. Outside, for the first time in years, the fog lifts off Lantern Row. At the last lamp Mr Fenn gets up, stiffly, and gives her his arm, and they go off along the river together, past every lamp, the way people do who have all the time there is." },
    { end: true, picture: "truth" }
  ],
  relieved_ending: [
    { say: "You lift the pole to the last lamp and open the tap. The gas breathes, catches, and the lamp comes on, yellow, the twelfth of twelve." },
    { say: "Mr Fenn gets up off the kerb. He puts his cap on your head, nods once, and goes off up the Row without looking back, a man with nowhere to be. The fog closes behind him. You are the lamplighter of Lantern Row now. Every evening you light twelve lamps, the last one last, and nobody has ever asked you to stay." },
    { end: true, picture: "relieved" }
  ],
  blamed_ending: [
    { say: "\"Mr Voss,\" you say. Dr Mabbott writes it down. The twelve chairs of the jury creak, all together. The fog has heard it, and it keeps it." },
    { say: "On Monday the Row goes electric, and Mr Voss is not there to see it. The fog never lifts again. Down at the last lamp Mr Fenn sits on, unrelieved, and up the Row, very faint, a voice that smells of pastry goes on asking him to stay." },
    { end: true, picture: "blamed" }
  ]
};

// ---- Rules -----------------------------------------------------------------------------------------------------------
const rules = [
  // The key round Mr Fenn's neck.
  { id: "take_key", match: { verb: "take", obj: "hut_key" }, if: [{ "hut_key.at": "fenn" }],
    do: [{ say: "Mr Fenn bows his head so you can lift the string over it. \"Mind the cap,\" he says." }, { change: "key_taken" }], then: "default" },
  { id: "ask_key", match: { verb: "ask", obj: "fenn", topic: "hut" }, if: [{ "hut_key.at": "fenn" }],
    do: [{ say: "\"Key's round my neck,\" says Mr Fenn, and bows his head so you can lift the string over it. \"I shan't be going anywhere.\"" }, { move: "hut_key", to: "player" }, { change: "key_taken" }] },

  // Listening to the fog at the last lamp: with the trumpet, once the Bell has shut and the Row is quiet.
  { id: "hear_noisy", match: { verb: ["listen", "use", "put"], obj: [null, "fog_lamp", "trumpet"] },
    if: [{ "player.at": "last_lamp" }, { "trumpet.at": "player" }, { "time.hour": { between: [11, 23] } }],
    do: [{ say: "You hold the trumpet to the fog. It fills to the brim with the chorus from the Bell, a dozen men each a little behind the next. Under it, very small, something is trying to be heard. It will have to wait until the Bell shuts." }] },
  { id: "hear_words", match: { verb: ["listen", "use", "put"], obj: [null, "fog_lamp", "trumpet"] },
    if: [{ "player.at": "last_lamp" }, { "trumpet.at": "player" }, { "last_words.at": null }],
    do: [{ say: "You hold the trumpet to the fog and listen. Most of what the fog holds is weather. Then, close by the lamp, low: a woman's voice, warm, with flour on it. \"Leave it, Albert. Sit down a minute. Nobody will miss one lamp.\"" },
         { say: "The words come down out of the fog and settle in your cupped hands, light as a moth, still a little warm." },
         { move: "last_words", to: "player" }] },
  { id: "heard_already", match: { verb: ["listen", "use", "put"], obj: [null, "fog_lamp", "trumpet"] },
    if: [{ "player.at": "last_lamp" }, { "trumpet.at": "player" }],
    do: [{ say: "The fog has nothing more to say here. It has said enough." }] },
  { id: "listen_fog_bare", match: { verb: "listen", obj: [null, "fog_lamp"] }, if: [{ "player.at": "last_lamp" }],
    do: [{ say: "The fog murmurs: a word here, half a word there, too faint to make out. Mr Fenn used to listen to the gas with a trumpet; it would hear this." }] },
  { id: "trumpet_elsewhere", match: { verb: ["listen", "use"], obj: "trumpet", obj2: [null] }, if: [{ "trumpet.at": "player" }],
    do: [{ say: ["You hold the trumpet up to the fog. It is full of small ordinary things: a cough, a door, somebody's \"well, then\". Nothing that was said here matters.",
                 "The trumpet brings you a cough, two streets off, and somebody's kettle. The words that matter were said at the last lamp."] }] },

  // The last words: they are for the court, and nowhere else.
  { id: "words_to_court", match: { verb: ["give", "show", "drop", "open", "throw"], obj: "last_words" },
    if: [{ "player.at": "court" }, { "last_words.at": "player" }],
    do: [{ change: "truth_ending" }] },
  { id: "words_to_halloran", match: { verb: ["give", "show"], obj: "last_words", obj2: "halloran" }, if: [{ "last_words.at": "player" }],
    do: [{ say: "Mrs Halloran looks at what is in your hands for a long moment, and puts both her own behind her back. \"Not here,\" she says. \"Not in front of the pies.\"" }] },
  { id: "words_kept", match: { verb: ["give", "show", "drop", "open", "throw", "put"], obj: "last_words" }, if: [{ "last_words.at": "player" }],
    do: [{ say: "You keep your hands cupped round them. Let go of them here and the fog would only have them back. They want saying where they'll be heard properly: in the court, north of the Row, when it sits." }] },

  // The inquest: naming someone. A name said here stays said, so the court asks first.
  { id: "accuse_halloran", match: { verb: "accuse", obj: "halloran" }, if: [{ "player.at": "court" }, { "last_words.at": "player" }],
    do: [{ confirm: "Name Mrs Halloran before the court? A name said here stays said.", yes: [{ change: "truth_ending" }],
           no: [{ say: "You close your mouth on it. The fog in the jury chairs sits back, disappointed." }] }] },
  { id: "accuse_halloran_bare", match: { verb: "accuse", obj: "halloran" }, if: [{ "player.at": "court" }],
    do: [{ say: "\"On what evidence?\" says Dr Mabbott, mildly. \"The court hears words, not feelings. The fog will have kept the last ones said at the lamp.\"" }] },
  { id: "accuse_voss", match: { verb: "accuse", obj: "voss" }, if: [{ "player.at": "court" }],
    do: [{ confirm: "Name Mr Voss before the court? A name said here stays said.", yes: [{ change: "blamed_ending" }],
           no: [{ say: "You close your mouth on it. The fog in the jury chairs sits back, disappointed." }] }] },
  { id: "accuse_nobody", match: { verb: "accuse", obj: [null] }, if: [{ "player.at": "court" }],
    do: [{ say: "\"Whom?\" says Dr Mabbott, his pen lifted. \"Persons present at the lamp: Mr Voss, Mrs Halloran, and the deceased.\"" }] },
  { id: "accuse_fenn", match: { verb: "accuse", obj: "fenn" }, if: [{ "player.at": "court" }],
    do: [{ say: "\"The deceased can't be named at his own inquest,\" says Dr Mabbott. \"It upsets them.\"" }] },
  { id: "accuse_other", match: { verb: "accuse" }, if: [{ "player.at": "court" }],
    do: [{ say: "\"Not on the constable's list,\" says Dr Mabbott. \"Persons present at the lamp: Mr Voss, Mrs Halloran, and the deceased.\"" }] },
  { id: "accuse_elsewhere", match: { verb: "accuse" },
    do: [{ say: "Names are for the inquest: the coroner's court, north of the Row, when it sits at midnight." }] },
  { id: "say_words_in_court", match: { verb: "say" }, if: [{ "player.at": "court" }, { "last_words.at": "player" },
      { "$text": { in: ["words", "the words", "last words", "the last words", "them", "it", "leave it albert", "leave it, albert"] } }],
    do: [{ change: "truth_ending" }] },
  { id: "say_voss", match: { verb: "say" }, if: [{ "player.at": "court" }, { "$text": { in: ["voss", "mr voss", "mister voss", "it was voss", "it was mr voss"] } }],
    do: [{ confirm: "Name Mr Voss before the court? A name said here stays said.", yes: [{ change: "blamed_ending" }],
           no: [{ say: "You close your mouth on it. The fog in the jury chairs sits back, disappointed." }] }] },
  { id: "say_halloran", match: { verb: "say" }, if: [{ "player.at": "court" }, { "last_words.at": "player" }, { "$text": { in: ["halloran", "mrs halloran", "missus halloran", "it was halloran", "it was mrs halloran"] } }],
    do: [{ confirm: "Name Mrs Halloran before the court? A name said here stays said.", yes: [{ change: "truth_ending" }],
           no: [{ say: "You close your mouth on it. The fog in the jury chairs sits back, disappointed." }] }] },
  { id: "say_halloran_bare", match: { verb: "say" }, if: [{ "player.at": "court" }, { "$text": { in: ["halloran", "mrs halloran", "missus halloran", "it was halloran", "it was mrs halloran"] } }],
    do: [{ say: "\"On what evidence?\" says Dr Mabbott, mildly. \"The court hears words, not feelings. The fog will have kept the last ones said at the lamp.\"" }] },
  { id: "say_in_court", match: { verb: "say" }, if: [{ "player.at": "court" }],
    do: [{ say: "\"If you are naming someone,\" says Dr Mabbott, \"name them plainly, and the court will write it down.\"" }] },

  // The court asks for the name itself: in the witness box (every time you step in), or when you talk to Dr Mabbott with
  // the last words in hand. One answer, then play goes on. (You can only be in the court while it sits; an answer typed
  // after it has risen, on the Row, goes unheard.)
  { id: "box_asks", match: { verb: ["enter", "sit", "climb", "lie"], obj: "witness_box" }, if: [{ "player.in": { "!=": "witness_box" } }],
    do: [{ set: "player.in", to: "witness_box" }, { say: "$obj.enter" },
         { say: "\"The court will hear a name,\" says Dr Mabbott, pen lifted. \"Whose?\"" }, { ask: "name" }] },
  { id: "box_asks_again", match: { verb: ["enter", "sit", "climb", "lie"], obj: "witness_box" },
    do: [{ say: "\"The court will hear a name,\" says Dr Mabbott, pen lifted. \"Whose?\"" }, { ask: "name" }] },
  { id: "mabbott_asks", match: { verb: "talk", obj: "mabbott" }, if: [{ "last_words.at": "player" }],
    do: [{ say: "\"The court will hear a name,\" says Dr Mabbott, pen lifted. \"Whose?\"" }, { ask: "name" }] },
  // The answer: the same as naming them (ACCUSE, SAY), so the same questions and lines.
  { id: "name_blank", match: { verb: "answer", question: "name", blank: true }, if: [{ "player.at": "court" }],
    do: [{ say: "You say nothing. The fog in the jury chairs leans in, and waits with you." }] },
  { id: "name_halloran", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "last_words.at": "player" }, { "player.answers.name": { in: HALLORAN } }],
    do: [{ confirm: "Name Mrs Halloran before the court? A name said here stays said.", yes: [{ change: "truth_ending" }],
           no: [{ say: "You close your mouth on it. The fog in the jury chairs sits back, disappointed." }] }] },
  { id: "name_halloran_bare", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "player.answers.name": { in: HALLORAN } }],
    do: [{ say: "\"On what evidence?\" says Dr Mabbott, mildly. \"The court hears words, not feelings. The fog will have kept the last ones said at the lamp.\"" }] },
  { id: "name_voss", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "player.answers.name": { in: VOSS } }],
    do: [{ confirm: "Name Mr Voss before the court? A name said here stays said.", yes: [{ change: "blamed_ending" }],
           no: [{ say: "You close your mouth on it. The fog in the jury chairs sits back, disappointed." }] }] },
  { id: "name_fenn", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "player.answers.name": { in: FENN } }],
    do: [{ say: "\"The deceased can't be named at his own inquest,\" says Dr Mabbott. \"It upsets them.\"" }] },
  { id: "name_other", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }],
    do: [{ say: "\"Not on the constable's list,\" says Dr Mabbott. \"Persons present at the lamp: Mr Voss, Mrs Halloran, and the deceased.\"" }] },

  // The pole lies in the hut as a shape in its picture: taking it removes the shape, dropping it back in the hut redraws it.
  { id: "pole_up", match: { verb: "take", obj: "pole" }, if: [{ "player.at": "hut" }, { "pole.at": "hut" }],
    do: [{ draw: "hut", remove: ["pole_shape", "pole_flame"] }], then: "default" },
  { id: "pole_down", match: { verb: "drop", obj: "pole" }, if: [{ "player.at": "hut" }, { "pole.at": "player" }],
    do: [{ draw: "hut", add: ["line pole_shape 256,112 244,26 c14", "ellipse pole_flame 244,22,2,3 9"] }], then: "default" },

  // The last lamp: whoever lights it takes the post.
  { id: "light_lamp", match: { verb: ["switch_on", "use"], obj: ["dark_lamp", "pole"], obj2: [null, "dark_lamp", "pole"] },
    if: [{ "player.at": "last_lamp" }, { "pole.at": "player" }],
    do: [{ confirm: "Light the last lamp of Lantern Row? Whoever lights her keeps her.", yes: [{ change: "relieved_ending" }],
           no: [{ say: "You lower the pole. Mr Fenn lets out a breath he doesn't need." }] }] },
  { id: "light_lamp_bare", match: { verb: ["switch_on", "use"], obj: "dark_lamp" }, if: [{ "player.at": "last_lamp" }, { "pole.at": { "!=": "player" } }],
    do: [{ say: "The lamp is too high to reach, and you have nothing to light it with. Mr Fenn's pole is in his hut, east of here." }] },
  { id: "relieve_fenn", match: { verb: "relieve" }, if: [{ "player.at": "last_lamp" }, { "pole.at": "player" }],
    do: [{ confirm: "Light the last lamp of Lantern Row? Whoever lights her keeps her.", yes: [{ change: "relieved_ending" }],
           no: [{ say: "You lower the pole. Mr Fenn lets out a breath he doesn't need." }] }] },
  { id: "relieve_fenn_bare", match: { verb: "relieve" }, if: [{ "player.at": "last_lamp" }],
    do: [{ say: "\"Not like that,\" says Mr Fenn. \"Whoever lights the last lamp takes the post. My pole's in the hut, east of here.\"" }] },
  { id: "relieve_elsewhere", match: { verb: "relieve" },
    do: [{ say: "Mr Fenn keeps his post at the last lamp, at the bottom of the Row, south. Only whoever lights it can relieve him." }] },
  { id: "light_elsewhere", match: { verb: ["switch_on", "use"], obj: "pole", obj2: [null] }, if: [{ "pole.at": "player" }],
    do: [{ say: "Every lamp here is lit already. Only the last one, at the bottom of the Row, is waiting." }] },

  // A drink by the fire, a pie, a breath of clearer air: one each.
  { id: "order_porter", match: { verb: ["order", "ask"], obj: [null, "porter", "cotter"] }, if: [{ "player.at": "bell" }, { "$topic": { in: [null, "porter"] } }], once: true,
    do: [{ heal: 1, says: "Mr Cotter pulls you a half of porter without asking which. You drink it by the fire. The fog in your chest goes and sits somewhere else for a while." }] },
  { id: "porter_again", match: { verb: ["order", "ask"], obj: [null, "porter", "cotter"] }, if: [{ "player.at": "bell" }, { "$topic": { in: [null, "porter"] } }],
    do: [{ say: "\"One,\" says Mr Cotter. \"I said. I'm not running a hospital.\"" }] },
  { id: "order_pie", match: { verb: ["order", "ask"], obj: [null, "pie", "halloran"] }, if: [{ "player.at": "pie_shop" }, { "$topic": { in: [null, "pie"] } }], once: true,
    do: [{ heal: 1, says: "Mrs Halloran wraps a pie in paper and gives it to you hot. You eat it standing up. It tastes of being expected." }] },
  { id: "pie_again", match: { verb: ["order", "ask"], obj: [null, "pie", "halloran"] }, if: [{ "player.at": "pie_shop" }, { "$topic": { in: [null, "pie"] } }],
    do: [{ say: "\"One's plenty,\" says Mrs Halloran. \"He only ever had the one.\"" }] },
  { id: "order_elsewhere", match: { verb: "order" },
    do: [{ say: "There is porter at the Bell, west on the Row, and pies at Halloran's, east of it." }] },
  { id: "breathe_bridge", match: { verb: "breathe" }, if: [{ "player.at": "bridge" }], once: true,
    do: [{ say: "You breathe. The air out here is only half fog; the other half is the river going by. For a moment your chest is your own." }] },
  { id: "breathe_again", match: { verb: "breathe" }, if: [{ "player.at": "bridge" }],
    do: [{ say: "You breathe. It helps less the second time. It is still fog, only thinner." }] },
  { id: "breathe_elsewhere", match: { verb: "breathe" },
    do: [{ say: "You breathe in fog, and it breathes you back. Out on the bridge, past the river steps, the air is thinner." }] },

  // Words said in the fog stay where they were said.
  { id: "sing_bell", match: { verb: "sing" }, if: [{ "player.at": "bell" }],
    do: [{ say: ["You join in. Nobody minds. Between all of you, you nearly know the words.", "You sing the chorus with the men at the bar, a little behind the one before you, as is the custom."] }] },
  { id: "shout_fog", match: { verb: ["shout", "sing"] }, if: [{ "player.at": { in: ["row", "last_lamp", "river_steps", "bridge", "court"] } }],
    do: [{ say: ["Your words go out into the fog and stop a little way off, hanging there, embarrassed. Somebody will hear them out one day.",
                 "The fog takes what you said and keeps it, a little above your head, where you can't get it back."] }] },

  // The river: it takes hold, the first time. (Its danger is in the room and in the river's own text; Pip says it too.)
  { id: "river_hurt", match: { verb: ["enter", "swim"], obj: [null, "river"] }, if: [{ "player.at": "river_steps" }],
    do: [{ say: "You go down into the river. It is colder than anything has a right to be, and it has you by the legs, and then, as if it had changed its mind, it lets go. You crawl back up the steps." },
         { hurt: 2, says: "The river had you for a moment, and kept some of you." }] },

  // The Bell shuts at eleven; the court sits at midnight and rises at six.
  { id: "bell_shuts_inside", when: "at", at: "23:00", if: [{ "player.at": "bell" }],
    do: [{ say: "Mr Cotter rings the handbell over the bar. \"Time,\" he says, and the singing stops in the middle of a word. You find yourself out on the Row with the others, who go off into the fog in different directions and do not come out of it." },
         { travel: "row" }, { describe: "$here" }] },
  { id: "bell_shuts", when: "at", at: "23:00", if: [{ "player.at": { in: ["row", "last_lamp", "pie_shop", "substation", "hut", "river_steps"] } }],
    do: [{ say: "Up the Row a handbell rings in the Bell, and the singing stops in the middle of a word. Lantern Row goes quiet, quiet enough to hear a word drop." }] },
  // What the Row's picture shows of it: the Bell's window goes dark at eleven and lights at eleven in the morning; the
  // court doors stand open from midnight to six.
  { id: "bell_dark", when: "at", at: "23:00", do: [{ draw: "row", restyle: [{ id: "bell_window", fill: "mix:0,4@0.2" }] }] },
  { id: "bell_lit", when: "at", at: "11:00", do: [{ draw: "row", restyle: [{ id: "bell_window", fill: "mix:4,12@0.45" }] }] },
  { id: "court_open", when: "at", at: "00:00", do: [{ draw: "row", restyle: [{ id: "court_doors", fill: "mix:6,14@0.5" }] }] },
  { id: "court_shut", when: "at", at: "06:00", do: [{ draw: "row", restyle: [{ id: "court_doors", fill: "mix:6,0@0.5" }] }] },
  { id: "court_sits", when: "at", at: "00:00", if: [{ "player.at": "row" }],
    do: [{ say: "Somewhere above the fog a clock strikes midnight. The court doors open by themselves, and the fog goes in first." }] },
  { id: "court_rises", when: "at", at: "06:00", if: [{ "player.at": "court" }],
    do: [{ say: "Morning, somewhere above the fog. Dr Mabbott closes his book. \"The court will sit again at midnight,\" he says, and you are shown out." },
         { travel: "row" }, { describe: "$here" }] },

];

// ---- Puzzles (for the checker and the hints; GUIDE.md §3). The endings in the order the hints should reach them. ----
const puzzles = {
  take_key: { where: "last_lamp", needs: [], solve: ["{take} key"], gives: ["hut_key"], clues: ["fenn", "hut_door"],
    hints: ["Mr Fenn keeps the key to his hut on a string round his neck.", "Take the key from Mr Fenn, at the last lamp."] },
  open_hut: { where: "last_lamp", needs: ["hut_key"], solve: ["unlock door with key", "east"], reaches: "hut", clues: ["hut_door", "fenn"],
    hints: ["His hut is just east of the last lamp, and the key fits it.", "Unlock the hut door with the key, then go east."] },
  take_trumpet: { where: "hut", needs: ["open_hut"], solve: ["{take} trumpet"], gives: ["trumpet"], clues: ["fenn", "pye"],
    hints: ["Mr Fenn used to listen to the gas with an old trumpet. He keeps it in his hut.", "In the hut, take the ear trumpet."] },
  hear_words: { where: "last_lamp", needs: ["trumpet"], solve: ["wait until the Bell shuts", "listen to fog"], gives: ["last_words"], clues: ["pye", "fenn", "trumpet", "cotter"],
    hints: ["The fog keeps what was said in it, but it takes a lamplighter's trumpet to hear it, and quiet. The Row is never quiet until the Bell shuts at eleven.",
            "With the ear trumpet from the hut, wait by the last lamp until the Bell shuts, then listen to the fog."] },
  open_court: { where: "row", needs: [], solve: ["wait until midnight", "north"], reaches: "court", clues: ["court_doors", "pye", "fenn"],
    hints: ["The inquest sits at midnight, in the court north of the Row.", "Wait on the Row until midnight, then go north into the court."] },
  truth: { where: "court", needs: ["last_words", "open_court"], solve: ["give words to Mabbott"], ending: true, clues: ["mabbott", "halloran", "pip", "logbook", "parapet"],
    hints: ["The court hears words, and you have the last ones said at the lamp.", "In the court, give the last words to Dr Mabbott."] },
  relieve: { where: "last_lamp", needs: ["pole"], solve: ["light lamp", "yes"], ending: true, clues: ["fenn", "pole", "logbook"],
    hints: ["Whoever lights the last lamp takes the lamplighter's post.", "With the pole from the hut, light the last lamp, and say yes."] },
  blame_voss: { where: "court", needs: ["open_court"], solve: ["accuse Voss", "yes"], ending: true, clues: ["pye", "voss", "notebook", "mabbott"],
    hints: ["Dr Mabbott wants a name, and Mr Voss expects it to be his.", "In the court, accuse Mr Voss, and say yes."] }
};

// ---- The opening, declared (BRIEF.md §3): the ids of its room and three things, and the lines it says ----------------
const opening = {
  room: "cab", hints: "canary", intro: "summons", way: "cab_fog",
  lines: {
    notYet: "You put a foot on the step, and the fog puts it back, politely, the way a doorman would. Not yet: the canary is still on its hook, and nobody goes out into a fog like this without one.",
    through: "You step down into the fog. It closes over the cab behind you like water over a dropped coin, and the cobbles come up to meet your feet.",
    hintFrame: "The canary puts its head on one side and sings, in a voice like a very small police constable:",
    farewell: "The fog leans in through the doors and reads the summons over your shoulder. When it has finished, it takes it, and you let it."
  }
};

// ---- The change set -----------------------------------------------------------------------------------------------------
export default {
  because: "After the opening: a fog-bound street on the night of a lamplighter's inquest.",
  opening,
  facts: [
    "The player arrives on Lantern Row, London, in thick fog, on a Thursday at half past ten at night.",
    "Albert Fenn, lamplighter, died this evening under the one lamp he didn't light, and sits there still, dead, until relieved.",
    "The inquest sits at midnight in the coroner's court, north of the Row; the Bell shuts at eleven.",
    "Mrs Halloran's words, \"Leave it, Albert. Sit down a minute,\" hang in the fog at the last lamp."
  ],
  effects: [
    { time: "day 1 22:20", weekday: "thu" },                 // the opening is played at twenty past ten
    { set: "game.entrance", to: "row" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 22:30", weekday: "thu" },
      { say: "Somewhere above the fog a church clock strikes half past ten, and doesn't sound sure of it." }
    ] },
    // Verbs this world needs
    { add: "word", verb: "accuse", words: ["accuse", "blame", "name", "charge", "denounce"], absent: true },
    { add: "word", verb: "order", words: ["order", "buy", "pay for"], absent: true },
    { add: "word", verb: "breathe", words: ["breathe", "breathe in", "take a breath", "inhale"] },
    { add: "word", verb: "swim", words: ["swim", "wade", "paddle", "dive"] },
    { add: "word", verb: "relieve", words: ["relieve", "take over from", "stand in for", "replace"] },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
