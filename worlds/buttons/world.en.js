// "The Button Exchange": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md only). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js";
import music, { rooms as roomMusic } from "./music.js";
import levels from "./levels.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Button Exchange",
  blurb: "Every lost button is kept in a drawer here, and change is given only in buttons. Your coat is one short, and a switchboard in the back is waiting to be pressed.",
  thumbnail: { picture: "hall", x: 45 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  synopsis: "You come up out of a cloakroom in a service lift to the Button Exchange, a glass-roofed trading hall where every button " +
    "ever lost comes to be traded for another, under the eye of Mr Tally, who keeps the count and has never once got it right. " +
    "Your coat is waiting on its stand, one button short, with your name in the collar in somebody else's handwriting. The Exchange " +
    "will give you the button back, if you can work out what it was lost on.",
  tone: "The everyday, slightly wrong (BRIEF §6): a trading hall, a mercery, a sorting room, run by people who are very sure of their " +
    "small rules. Horn, thread, brass, wool and the grey light of a roof that is never quite clean. Nobody is amazed that buttons " +
    "remember. Plain, dry and tender: a loss is kept in a drawer until someone says the right word to it.",
  start: "Wednesday, 17:10, in the trading hall (the opening, in the cloakroom, at 17:00).",
  opening: "A windowless cloakroom of coats: a brass thimble on the counter with a voice in it (hints), a cloakroom ticket you already carry " +
    "(why you came). The brass-gated service lift at the far end, with its panel of buttons, is the way on.",
  music: "bright lydian, a little too bright; a plucked thread, a clerk's whistle, buttons dropped on china, a thimble tapping time; the Exchange heard through a wall",
  rules: [
    "Every button remembers the coat it left, and the word it left on.",
    "A buttonhole stays open until something is put through it.",
    "Nothing pressed stays pressed: every button comes back up, a little reluctantly.",
    "The Exchange gives change in buttons, and only in buttons."
  ],
  characters: ["Mr Tally, who keeps the count and never gets it right", "Miss Spool, who gives thread to anyone with something to sew"],
  places: ["the cloakroom", "the trading hall", "the drawer wall", "the mercery", "the sorting room", "the switchboard", "the gallery", "the back yard"],
  endings: [
    "The coat: sewn whole and worn; you leave by a door nobody mentioned.",
    "The chair: the whole coat goes to Mr Tally, and you take his place at the counter.",
    "The red button: every button in the building goes home at once."
  ],
  chaos: 0.1
};

// Carried things get their sprites (sprites.js): the one shown when examined.
const item = (id) => ({ sprite: sprites[id] });

// ---- The ending pictures ---------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here.
const endingPictures = {
  outside: { alt: "A wet street at dusk under a magenta sky, a lone figure in a long coat walking away from a revolving door, the coat buttoned to the collar, a low yellow sun ahead.", picture: endings.outside },
  kept: { alt: "A clerk's counter seen from behind it at lamplight: an open ledger with a clean page, a pen, a brass bell, a green eyeshade left on a hook, and nobody in the hall beyond.", picture: endings.kept },
  released: { alt: "A single red button the size of a plate, pressed down into its brass collar in the dark, glowing, with small buttons spilling out of the shadows round it like sparks.", picture: endings.released }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "cloak": the opening, never returned to. Area "exchange": the trading hall at the centre, the drawer wall north of it (and
// the switchboard west of the drawers), the mercery east and the back yard beyond it, the sorting room west, the gallery above.
// Every picture faces north.
const rooms = {
  cloak: {
    name: "THE CLOAKROOM", area: "cloak", at: [0, 0, 0],
    describe: [
      "The cloakroom of the Exchange, long and low and windowless, lit by one bulb. Rails of coats run away into the dark on either side, every coat on its hook with its sleeves a little raised, as if about to be asked something.",
      "Past the counter, at the far end, a brass {lift} stands with its gate drawn across, and nothing else in the room is open."
    ],
    exits: { n: true },
    scenery: [
      { words: ["coats", "rails", "rail", "hooks", "hook", "sleeves"], name: "the coats", says: "Wool, tweed and gabardine, every one buttoned wrong by a hand that was in a hurry. None of them has an owner who has asked for it." },
      { words: ["counter", "desk", "ledge"], name: "the counter", says: "A scarred wooden counter with a brass bell on it that has lost its clapper and its opinion." },
      { words: ["bulb", "lamp", "light"], name: "the bulb", says: "A bare bulb on a flex. It burns with the patience of something that has been told it is for later." },
      { words: ["gate", "cage"], name: "the gate", says: "A folding brass gate, drawn across. It belongs to the lift." }
    ],
    ambience: { lines: [
      "Along the rail, a coat shrugs itself a little straighter on its hook.",
      "The bulb ticks, as if cooling, though it has been lit all day.",
      "A hook creaks under the weight of nothing at all."
    ], every: [25, 60] },
    alt: "Looking north down a long windowless cloakroom: a counter on the left with a brass bell, rails of coats on both sides under a bare bulb, and at the far end a brass lift with its green gate drawn across.",
    overlayAlt: { thimble: "A brass thimble stands upside down on the counter." }
  },

  hall: {
    name: "THE EXCHANGE", area: "exchange", at: [0, 0, 0],
    describe: [
      "The Button Exchange, a trading hall under a glass roof, where every button ever lost comes to be traded for another. Brass rails divide the floor into pitches, and the light is the colour of weak tea.",
      "{Mr Tally|tally} keeps the long counter, writing in a {ledger} with no last page. Doors lead east and west, {stairs} climb to a gallery, and a lit passage goes north."
    ],
    exits: { n: "drawers", e: "mercery", w: "sorting", u: "gallery" },
    scenery: [
      { words: ["roof", "glass", "panes"], name: "the glass roof", says: "Grey panes, rain-streaked on the inside. Whatever has been watching from the other side has stopped." },
      { words: ["rails", "rail", "pitches", "pitch", "floor"], name: "the pitches", says: "Brass rails on a floor of small tiles, dividing the hall into pitches where, long ago, people stood to trade. Every pitch is empty and a little warm." },
      { words: ["counter"], name: "the counter", says: "A long mahogany counter, polished by elbows. Every inch of it has been leaned on by someone who was just about to say something." },
      { words: ["stand", "hooks"], name: "the stand", says: "A bentwood coat stand with a dozen hooks and one coat." },
      { words: ["doors", "door"], name: "the doors", says: "Two plain doors, one in each side wall, with brass handles polished by thumbs." },
      { words: ["passage", "arch"], name: "the passage", says: "An arch at the far end, lit a cold cyan, with a smell of horn coming out of it." }
    ],
    ambience: { lines: [
      "Under the glass, a tile of the floor clicks, like a button set down on a saucer.",
      "Mr Tally writes a long figure in the ledger, looks at it, and rubs it out with his thumb.",
      "From the east comes the stitch of a sewing machine, regular as a clock that has nothing to do with the hour."
    ], every: [30, 70] },
    alt: "Looking north across a glass-roofed trading hall: a long counter with a clerk behind it, a stand beside it, brass rails dividing the tiled floor, doors in each side wall, stairs rising on the left, and a lit arch at the far end.",
    overlayAlt: { coat: "A coat hangs on the stand by the counter." }
  },

  drawers: {
    name: "THE DRAWER WALL", area: "exchange", at: [0, -1, 0],
    describe: [
      "A passage that is mostly a wall: ten thousand small drawers, floor to ceiling, each with a brass pull and an empty card holder. A rolling ladder leans on them, and the wall breathes out a smell of horn, bone and pocket lint.",
      "One {drawer} at knee height is warm, and hums as if about to speak. A door leads west into a humming room, and the hall is south."
    ],
    exits: { s: "hall", w: "switchroom" },
    scenery: [
      { words: ["drawers", "wall", "pulls", "pull", "cards", "holders"], name: "the drawers", says: "Brass pulls, blank cards, and behind each one the particular silence of something kept. You try a few. They are not warm." },
      { words: ["ladder", "rail"], name: "the ladder", says: "It rolls on a brass rail along the wall and stops where it likes. Whatever you want is not up there." },
      { words: ["door"], name: "the door", says: "A low door to the west, painted the dark green of a place with machines in it." }
    ],
    ambience: { lines: [
      "A drawer somewhere along the wall slides shut with a sound like a swallowed word.",
      "The ladder rolls half a yard along its rail, thinks better of it, and rolls back.",
      "Behind the wall, ten thousand small things shift their weight at once."
    ], every: [25, 60] },
    alt: "A passage whose whole north wall is ten thousand small brass-pulled drawers floor to ceiling, a rolling ladder on the left, one low drawer on the right glowing warm, and a green door in the west wall.",
    overlayAlt: {}
  },

  mercery: {
    name: "MISS SPOOL'S", area: "exchange", at: [1, 0, 0],
    describe: [
      "A narrow mercery built into the side of the hall, its shelves banked with spools, tapes and papers of pins. It smells of starch and warm iron, and a sewing machine on the counter stitches a seam by itself, in no cloth.",
      "{Miss Spool|miss_spool} sits behind the counter in a high chair, with a pincushion on her wrist like a second pulse. The hall is west, and a back door opens east on a yard."
    ],
    exits: { w: "hall", e: "backyard" },
    scenery: [
      { words: ["shelves", "shelf", "spools", "tapes", "pins", "papers"], name: "the shelves", says: "Spools in every colour a coat has ever been, in rows, graded like a sunset that is being careful." },
      { words: ["machine", "seam"], name: "the machine", says: "A black treadle machine with gold lettering worn to a rumour. Its needle goes up and down in no hurry and sews nothing to nothing." },
      { words: ["counter"], name: "the counter", says: "A counter with a brass yardstick set into the edge, scored by a great many careful measurings." },
      { words: ["pincushion", "cushion"], name: "the pincushion", says: "A red velvet pincushion on Miss Spool's wrist, with pins in it like a small, tidy hedgehog." },
      { words: ["chair"], name: "the chair", says: "A tall chair, tall enough that Miss Spool's feet have never had a floor to meet." },
      { words: ["door"], name: "the door", says: "A back door, held open a hand's width by a draught. Beyond it a yard, and grey light." }
    ],
    ambience: { lines: [
      "The treadle goes down and comes up. The needle, without cloth, finishes a seam and starts another.",
      "Miss Spool bites off a thread and looks at the end of it with disapproval, as if it had said something.",
      "On a high shelf, a spool unwinds a turn by itself, then turns back."
    ], every: [30, 65] },
    alt: "Inside a narrow mercery: shelves of spools and tape on the back wall, a counter with a treadle sewing machine, an old woman in a high chair behind it with a pincushion on her wrist, and a back door open on a grey yard to the right.",
    overlayAlt: { needle: "A needle lies on the counter beside the sewing machine." }
  },

  sorting: {
    name: "THE SORTING ROOM", area: "exchange", at: [-1, 0, 0],
    describe: [
      "A long room painted the pink of the inside of a shell, where six old women in grey sit at a table and sort buttons into saucers. They look up together as you arrive and down together when you do not speak.",
      "Behind them a card index of drawers climbs the wall, and a small lamp hangs low over each pair of hands. A {saucer} at your end of the table is nearer than the rest. The hall is east."
    ],
    exits: { e: "hall" },
    scenery: [
      { words: ["women", "woman", "sorters", "hands"], name: "the sorters", says: "Six old women in grey, with very clean hands. They turn each button over once, look at the back of it, and put it where it belongs." },
      { words: ["table"], name: "the table", says: "A long scrubbed table, grooved along its length like a ploughed field, and every groove is full of buttons." },
      { words: ["index", "cards", "drawers"], name: "the index", says: "Small drawers, each with a card holder, each card in a hand so neat it looks printed. You cannot read it from here, and nobody has offered." },
      { words: ["lamps", "lamp"], name: "the lamps", says: "Small shaded lamps on long flexes, each one a few inches above a pair of hands, as if it had been asked to watch." }
    ],
    ambience: { lines: [
      "Six buttons are set down on six saucers at once, with a sound like rain starting.",
      "One of the women hums half a tune. The others finish it for her, a little behind.",
      "A lamp over the table swings very slightly, and every shadow on the buttons leans the same way."
    ], every: [30, 70] },
    alt: "Looking down the length of a pink-walled sorting room: six old women in grey at a long table of saucers, small lamps hanging over their hands, a wall of card-index drawers behind them, a door to the hall on the right.",
    overlayAlt: {}
  },

  switchroom: {
    name: "THE SWITCHBOARD", area: "exchange", at: [-1, -1, 0],
    describe: [
      "A machine room behind the drawers, narrow and warm. A {switchboard|board} runs from floor to ceiling, hundreds of buttons each with a small lamp of its own colour, and none of them labelled.",
      "Nobody presses them, and they come back up by themselves, a little reluctantly. At the bottom, apart from the rest, is a {red button|red}. The drawers are east."
    ],
    exits: { e: "drawers" },
    scenery: [
      { words: ["lamps", "lamp", "lights"], name: "the lamps", says: "Small round lamps, one to a button: amber, green, a pink like a fingernail, a blue like the underneath of a wave. They darken when their button is down and come back on slowly." },
      { words: ["pipes", "pipe", "wires", "cables", "floor", "ceiling"], name: "the wiring", says: "Cables and pipes go up into the ceiling in bundles, warm to the touch, each tied with a bit of tape in a colour." }
    ],
    ambience: { lines: [
      "A button deep in the board goes down by itself. Somewhere through the wall, a drawer slides shut.",
      "The lamps change colour one after another, left to right, as if somebody were walking along them.",
      "The board hums a note, and the note is a little lower than last time."
    ], every: [25, 55] },
    alt: "A narrow machine room lit by lamps: a switchboard covering the whole far wall in hundreds of small coloured lamps and buttons, cables and pipes in bundles overhead, a single big red button apart from the rest at the bottom right.",
    overlayAlt: {}
  },

  gallery: {
    name: "THE GALLERY", area: "exchange", at: [0, 0, 1],
    describe: [
      "A gallery runs round the hall above the counter, with a brass rail to lean on and the whole trading floor laid out below. From here the pitches are a picture, set in thousands of buttons: a hand, open, letting go of a sleeve.",
      "A {plaque} is screwed to the rail. The stairs go down."
    ],
    exits: { d: "hall" },
    scenery: [
      { words: ["rail", "railing", "brass"], name: "the rail", says: "Brass, worn dull where hands have leaned out and looked down for as long as there has been a hall." },
      { words: ["hand", "sleeve", "picture", "buttons", "mosaic", "floor", "pitches"], name: "the mosaic", says: "Brown horn, black jet, small white shirt buttons for the knuckles, all of it set in the floor. The hand is open. It has been open for a very long time." },
      { words: ["stairs", "staircase", "steps"], name: "the stairs", says: "They go down to the hall.", leads: "d" },
      { words: ["roof", "glass", "pigeon"], name: "the roof", says: "A pigeon walks on the other side of the glass, on top of its own shadow." }
    ],
    ambience: { lines: [
      "Below, Mr Tally looks up from his ledger, sees nobody he knows, and looks down again.",
      "A button comes loose from the mosaic with a tick, rolls the length of the hand, and is still.",
      "The glass overhead ticks as the cold comes on it, pane by pane."
    ], every: [30, 70] },
    alt: "Looking north from the gallery rail down over the trading hall: the tiled floor set in buttons like a mosaic of an open hand, brass rails, the long counter, and the lit arch at the far end beneath the glass roof.",
    overlayAlt: {}
  },

  backyard: {
    name: "THE BACK YARD", area: "exchange", at: [2, 0, 0],
    describe: [
      "A back yard the size of a handkerchief, closed in by high brick and washed in a thin grey light. Washing lines run across it, hung with coats to dry, forty or fifty, each with one sleeve out and each one button short.",
      "The coat at the end of the line waves its sleeve at nobody, slowly, as a person does from a platform. The mercery is west."
    ],
    exits: { w: "mercery" },
    scenery: [
      { words: ["coats", "lines", "line", "washing", "pegs", "sleeve", "sleeves"], name: "the washing", says: "Forty coats on three lines, dripping from the cuffs. Each has one sleeve out, each is one button short, and the last of them is waving." },
      { words: ["brick", "bricks", "wall", "walls", "yard", "sky"], name: "the yard", says: "Soot-black brick on every side, and above it a square of sky the colour of a pavement. Nobody has been out to look at it for years." }
    ],
    ambience: { lines: [
      "The coat at the end of the line waves, and the others, a moment later, wave back a little.",
      "A drip falls from a cuff onto a stone, and the stone answers, low.",
      "A peg lets go of a sleeve, and the sleeve hangs a moment longer in the air than it should."
    ], every: [30, 65] },
    alt: "A tiny back yard in grey light: three washing lines of dripping coats receding between high brick walls, the coat at the far end of the line waving a sleeve, a lit yellow window in the wall on the right.",
    overlayAlt: {}
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------
const objects = {
  // The opening
  thimble: {
    at: "cloak", portable: true, material: "metal", name: "Thimble", note: "Murmuring to itself.",
    here: "A {thimble} stands upside down on the counter, murmuring.",
    words: { nouns: ["thimble"], adj: ["brass"] },
    examine: "A brass thimble, worn thin at the crown and dimpled like the skin of an orange. Held to the ear, it says nothing in a small, patient voice, and is waiting for you to be ready.",
    ...item("thimble")
  },
  ticket: {
    at: "player", portable: true, material: "paper", name: "Ticket", note: "Punched twice.",
    words: { nouns: ["ticket", "card"], adj: ["cloakroom"] },
    examine: "A cloakroom ticket, punched twice. One coat, it says, one button short. On the back, in your handwriting, pressed hard enough to dent the card: \"Don't let them give you change.\"",
    ...item("ticket")
  },
  lift: {
    at: "cloak", name: "Lift", note: "Brass gate, shut.", leads: "n",
    words: { nouns: ["lift", "elevator"], adj: ["brass", "service"] },
    examine: "A service lift in a brass cage, its gate drawn across. Beside it a panel holds a great many small brass buttons, one for every floor there has never been, polished where nobody has pressed them.",
    parts: [{ words: ["panel", "buttons", "brass buttons"], name: "the panel", says: "Rows and rows of small brass buttons, none numbered. The ones near the bottom are polished, and the one at the top has never been touched." }]
  },

  // The hall
  tally: {
    at: "hall", name: "Mr Tally", note: "Keeping the count.",
    words: { nouns: ["tally", "mr", "mister", "clerk"], adj: [], g: "m", proper: true },
    examine: "A thin man in sleeve-garters and a green eyeshade, writing with a pen that has run out. He has been standing since the first button, and the counter has a shallow place in it where he leans.",
    topics: {
      exchange: { words: ["exchange", "hall", "place", "here"], about: "hall", open: true,
        says: "\"The Button Exchange,\" says Mr Tally. \"You bring a button, we give you a button. We have never been short. We have never been right, either, but that is the ledger's business.\"" },
      tally: { words: ["tally", "you", "yourself", "name"], open: true,
        says: "\"Tally. I keep the count.\" He looks at the ledger. \"It comes out one short every night. I have stopped asking whose.\"" },
      coat: { words: ["coat", "overcoat", "nineteen"],
        says: "\"Nineteen. Yes, that came in on its own two sleeves. One button short, as they all are, and we do not give back what we did not take, so you will have to go and find it. The buttons are in the drawers, north of here, and a button comes off at a parting, as a rule: a hand lets go of a sleeve.\"" },
      ledger: { words: ["ledger", "book", "change", "figures", "pay", "price"],
        says: "\"Change is given in buttons,\" says Mr Tally. \"It is the only thing we have enough of. I would not take any, if I were you. Change is how they get you to stay.\"" },
      drawers: { words: ["drawers", "wall", "warm", "humming"], about: "drawers",
        says: "\"Ten thousand,\" says Mr Tally. \"Ten thousand and one, when one is warm. A drawer gives up what it has when it hears what it has been waiting to hear. I could not tell you what that is. It is different for every drawer, and I am only the clerk.\"" },
      switchroom: { words: ["switchboard", "board", "switches", "lamps"], about: "switchroom",
        says: "\"Don't press anything you can't put back,\" says Mr Tally. \"Especially the red one. The rest come up by themselves. That one lets go of everything.\"" },
      plaque: { words: ["plaque", "founded", "founder"], about: "plaque",
        says: "\"Founded on a parting. We have been open ever since, because we could not find the person to hand the key to.\"" },
      default: "\"I would tell you,\" says Mr Tally, \"if I were asked it by someone with a button.\""
    },
    give: "\"That is not owed to the Exchange,\" says Mr Tally, and slides it back across the counter, very slightly further than you gave it.",
    talk: "Mr Tally lifts the eyeshade a quarter of an inch, which is as far as it goes."
  },
  ledger: {
    at: "hall", name: "Ledger", note: "No last page.",
    words: { nouns: ["ledger", "book"], adj: [] },
    examine: "A ledger bound in black cloth, open at a page of figures in a copperplate hand. Every column of figures ends, as every column here ends, one short.",
    read: "In the margin, in pencil, someone has written the same word down the whole page, and rubbed each one out with a thumb until it is only a grey smear that says, if you hold the book to the light, that it was once a word."
  },
  stairs: {
    at: "hall", name: "Stairs", note: "To the gallery.", leads: "u",
    words: { nouns: ["stairs", "staircase", "steps"], adj: ["brass"] },
    examine: "A narrow staircase of dark wood with a brass rail, worn into a shallow dip on every tread, climbing to a gallery. The dip is deeper on the way down than the way up."
  },
  coat: {
    at: "hall", portable: true, material: "soft", name: "Coat", note: "One button short.",
    words: { nouns: ["coat", "overcoat"], adj: ["my", "blue"] },
    here: "Your {coat} hangs on the stand by the counter, with your name in the collar and one button short.",
    examine: "Your coat, with your name in the collar in someone else's handwriting. It has five buttons and six holes, and the sixth hole has a loose end of red thread hanging out of it, like something it meant to say. A cloth tag in the collar reads, in a clerk's hand: \"Came off at a parting.\"",
    smell: "Wool, rain, and a pocket in which someone has kept a ticket for a long time. Under it, very faintly, a doorway at the end of an afternoon.",
    ...item("coat")
  },

  // The drawer wall
  drawer: {
    at: "drawers", name: "Warm drawer", note: "Humming, as if to speak.",
    container: true, open: false, locked: true, material: "wood",
    lock: { says: "The pull will not move. The drawer hums, warm under your hand, like someone about to speak first." },
    words: { nouns: ["drawer", "pull"], adj: ["warm", "low", "small", "humming"] },
    examine: "A small drawer at knee height with a brass pull the colour of an old coin. The card holder is empty, and the wood is warm, the way a chair is warm when somebody has just left it.",
    listen: "Inside, something holds its breath, and is polite about it."
  },
  horn_button: {
    at: "drawer", portable: true, material: "stone", name: "Horn button", note: "Leaning at something.",
    words: { nouns: ["button", "horn"], adj: ["horn", "brown", "four-hole"] },
    examine: "A horn button, four holes and a thin brown rim, worn smooth where a thumb used to turn it. Held in the hand, it leans very slightly towards your coat, wherever your coat is.",
    smell: "Horn, and the inside of a pocket, and a little of somewhere warm.",
    ...item("horn_button")
  },

  // The mercery
  miss_spool: {
    at: "mercery", name: "Miss Spool", note: "Watching a seam.",
    words: { nouns: ["spool", "miss"], adj: [], g: "f", proper: true },
    examine: "A small, upright woman in a grey cardigan, whose eyes go to your hands before your face. She has the look of someone who knows how things are held together and does not think much of it.",
    topics: {
      mercery: { words: ["mercery", "shop", "place", "here"], about: "mercery", open: true,
        says: "\"A mercery,\" says Miss Spool. \"Thread, needles, tape, and the odd consolation. Mind the machine. It does not like to be watched.\"" },
      spool: { words: ["spool", "you", "yourself", "name"], open: true,
        says: "\"Spool,\" she says. \"I sew what comes off. Not everyone wants it sewn back, and I do not ask.\"" },
      coat: { words: ["coat", "overcoat", "nineteen", "sewing"],
        says: "\"Nineteen,\" she says, and her eyes go over the coat in your hands like a thumb over a seam. \"I can lend a needle and give thread, to anyone who has something to sew. I do not sew for people. It is not that I mind. It is that a button sewn by somebody else does not know whose it is.\"" },
      horn_button: { words: ["button", "buttons", "horn"],
        says: "\"Horn,\" she says. \"Four holes. Oh, that is a good one. Thread through all four, twice, crossed, and keep it tight. A loose one comes off at the next goodbye.\"" },
      needle: { words: ["needle", "needles"],
        says: "\"Mind the eye of it,\" says Miss Spool. \"It sees more than a needle should. It saw me, once, and has not forgotten.\"" },
      default: "Miss Spool bites off a thread and considers the end of it, which is the nearest she comes to an answer."
    },
    give: "\"I do not take things in,\" says Miss Spool, \"only out,\" and puts it back in your hand."
  },
  needle: {
    at: "mercery", portable: true, material: "metal", name: "Needle", note: "Eye too large for it.",
    here: "A single {needle} lies on the counter beside the machine, pointing at the hall.",
    words: { nouns: ["needle"], adj: [] },
    examine: "A steel needle with an eye a little too large for it. Looking through the eye, you can see the hall, and in the hall your own back, going away.",
    ...item("needle")
  },
  thread: {
    at: null, from: "miss_spool", portable: true, material: "soft", name: "Thread", note: "Red, and long enough.",
    if: [{ "coat.at": "player" }],
    brought: "Miss Spool bites off a length of {thread}, draws it through the air, and hands it to you as though it were a small, fierce piece of news.",
    again: "\"Thread is for something that needs sewing,\" says Miss Spool, \"and one length is all anyone needs.\"",
    words: { nouns: ["thread", "length"], adj: ["red"] },
    examine: "A length of red thread wound on a wooden spool, exactly as long as it needs to be. The loose end, if you let it go, finds the hole it was meant for.",
    ...item("thread")
  },

  // The sorting room
  saucer: {
    at: "sorting", name: "Saucer", note: "The fullest of them.", material: "stone",
    words: { nouns: ["saucer", "dish"], adj: ["chipped", "full"] },
    examine: "A chipped saucer of horn and bone buttons, heaped up like seed. A card on its rim says, in a hand so neat it looks printed: \"Came off at a goodbye.\" It is the fullest saucer in the room.",
    listen: "The buttons in it tick against each other, quietly, like the heels of people leaving."
  },

  // The switchboard
  board: {
    at: "switchroom", name: "Switchboard", note: "Hundreds of buttons.", use: "push",
    words: { nouns: ["switchboard", "board", "panel", "switches"], adj: [] },
    examine: "A switchboard that covers the whole wall: hundreds of buttons, each with a lamp the size of a pea, and none of them labelled. Below the last row, a worn patch where no thumb has been, and under it the red button.",
    parts: [{ words: ["buttons", "button lamps"], name: "the buttons", says: "Hundreds, each with a small lamp. When you look at one it goes down by itself, and comes back up, and looks innocent." }],
    push: [
      "You press a button at random. Somewhere behind the wall a drawer slides shut, gently. The button rises under your finger, a little reluctantly, and the lamp comes on again.",
      "You press a button near the middle. Far off, a woman says a name once, and stops. The button comes up.",
      "You press a pale pink one. Something in the wall lets go of something, and sighs. The button returns to your fingertip, as polite as a handshake."
    ],
    listen: "Under the hum, hundreds of things are holding on."
  },
  red: {
    at: "switchroom", name: "Red button", note: "Apart from the rest.", use: "push",
    words: { nouns: ["button"], adj: ["red", "big", "large"] },
    examine: "A red button the size of a saucer, set in a brass collar, with no lamp, because it has never needed to show you where it is. It stands a little apart from the rest, like someone who has not been asked to dance."
  },

  // The gallery
  plaque: {
    at: "gallery", name: "Plaque", note: "Founded on something.", material: "metal",
    words: { nouns: ["plaque", "plate"], adj: ["brass"] },
    examine: "A small brass plaque, polished at the corners and dull in the middle. It says, in the small capitals of a long time ago: \"Founded on a parting. Open until further notice.\""
  }
};

// ---- Puzzles ---------------------------------------------------------------------------------------------------------
// Every ending, each on its own picture. The main chain: the coat, the drawer's button, a needle and thread, the sewing.
const puzzles = {
  take_coat: { where: "hall", needs: [], solve: ["take coat"], gives: ["coat"], clues: ["coat", "tally"],
    hints: ["The coat on the stand has your name in its collar.", "Take the coat."] },
  open_drawer: { where: "drawers", needs: ["take_coat"], solve: ["say goodbye", "take button"], gives: ["horn_button"], clues: ["drawer", "tally", "plaque", "saucer", "coat"],
    hints: ["One drawer is warm, as if about to speak, and a button comes off at a parting.", "At the warm drawer, say goodbye, then take the button."] },
  get_thread: { where: "mercery", needs: ["take_coat"], solve: ["take needle", "order thread"], gives: ["needle", "thread"], clues: ["miss_spool", "needle", "coat"],
    hints: ["Miss Spool lends needles and gives thread to anyone with something to sew.", "In the mercery, take the needle and order thread."] },
  sew_button: { where: "hall", needs: ["open_drawer", "get_thread"], solve: ["sew button on coat"], gives: ["coat"], clues: ["miss_spool", "horn_button", "coat"],
    hints: ["A button wants a needle, thread and a coat.", "Sew the button on the coat."] },
  walk_out: { where: "hall", needs: ["sew_button"], solve: ["wear coat"], ending: true, clues: ["coat", "tally"],
    hints: ["A whole coat is for wearing.", "Wear the coat."] },
  stay: { where: "hall", needs: ["sew_button"], solve: ["give coat to tally"], ending: true, clues: ["tally", "ledger"],
    hints: ["Mr Tally has been standing since the first button.", "Give the whole coat to Mr Tally."] },
  press_red: { where: "switchroom", needs: [], solve: ["press red button"], ending: true, clues: ["red", "board", "tally"],
    hints: ["One button in the switchroom has no lamp, and Mr Tally would rather it were left alone.", "Press the red button."] }
};

// ---- Named changes -----------------------------------------------------------------------------------------------------
const changes = {
  sew_on: [
    { say: "You thread the needle, which takes three tries and a look from the eye, and put the red thread through all four holes of the horn button, twice, crossed, as you were told. The needle goes in and comes out like something relieved. When you bite the thread, the button holds. The sixth hole of the coat is a buttonhole at last, and it closes round the button like a hand." },
    { move: "horn_button", to: null },
    { move: "thread", to: null },
    { set: "coat.whole", to: true },
    { set: "coat.note", to: "Whole." },
    { set: "coat.examine", to: "Your coat, with your name in the collar in someone else's handwriting. Six buttons, six holes, and the thread through each of them crossed twice. The coat is warm all through, as if someone had only just stood up from it." }
  ]
};

// ---- Rules -----------------------------------------------------------------------------------------------------------
const sewn = [{ "coat.at": "player" }, { "horn_button.at": "player" }, { "needle.at": "player" }, { "thread.at": "player" }, { "coat.whole": false }];
const lacking = "Sewing takes three things in your hands, and the coat itself: a button, a needle, and thread. You have not got them all yet.";
const sewThings = [null, "coat", "horn_button", "needle", "thread"];
const rules = [
  // The drawer opens for the word the button was lost on.
  { id: "drawer_opens", match: { verb: "say" }, if: [{ "player.at": "drawers" }, { "drawer.locked": true }, { $text: { in: ["goodbye", "good bye", "goodbye then", "bye", "farewell"] } }],
    do: [
      { set: "drawer.locked", to: false },
      { set: "drawer.open", to: true },
      { say: "\"Goodbye,\" you say, and the warm drawer slides out a hand's width, the way a held door opens when the other person lets go. Inside, on a bed of grey lint, lies a {horn button|horn_button} with four holes." }
    ] },
  { id: "drawer_deaf", match: { verb: "say" }, if: [{ "player.at": "drawers" }, { "drawer.locked": true }],
    do: [{ say: "The wall listens, politely, ten thousand drawers at a time, and gives nothing back. Only the warm one hums, a little higher." }] },

  // The sewing, in every way a player will put it.
  { id: "sew_ok", match: { verb: ["sew"], obj: sewThings }, if: sewn, do: [{ change: "sew_on" }] },
  { id: "sew_ok_with", match: { verb: ["put", "use"], obj: ["horn_button", "needle", "thread"], obj2: "coat" }, if: sewn, do: [{ change: "sew_on" }] },
  { id: "sew_ok_coat", match: { verb: ["put", "use"], obj: "coat", obj2: ["horn_button", "needle", "thread"] }, if: sewn, do: [{ change: "sew_on" }] },
  { id: "sew_not_yet", match: { verb: ["sew"], obj: sewThings }, if: [{ "coat.whole": false }], do: [{ say: lacking }] },
  { id: "sew_not_yet_with", match: { verb: ["put", "use"], obj: ["horn_button", "needle", "thread"], obj2: "coat" }, if: [{ "coat.whole": false }], do: [{ say: lacking }] },

  // Wearing the coat: open at the sixth hole, or whole (the way out).
  { id: "wear_whole", match: { verb: "wear", obj: "coat" }, if: [{ "coat.whole": true }],
    do: [
      { say: "You put on the coat and do it up, every button in its hole. It fits as a coat fits that has been waiting for you, and it is warm all through. You find the way out the way you do in a coat that fits, by following the draught: past the counter, through a revolving door that nobody mentioned, and out into a street where it is a little past five and everyone is going home." },
      { end: true, picture: "outside" }
    ] },
  { id: "wear_open", match: { verb: "wear", obj: "coat" }, if: [{ "coat.whole": false }],
    do: [{ say: "You put the coat on. It hangs open at the sixth hole and holds a hand over it, politely, so that nobody will see. You take it off again, and it looks relieved and a little worse." }] },

  // Giving the whole coat to Mr Tally.
  { id: "give_whole_coat", match: { verb: "give", obj: "coat", obj2: "tally" }, if: [{ "coat.whole": true }, { "player.at": "hall" }],
    do: [
      { say: "Mr Tally turns the coat over and counts its buttons with his thumb, and the count comes out, for the first time in the building, even. \"Nobody brings those,\" he says. He folds it over his arm and lifts the flap of the counter, and holds it up for you, and nothing in the hall objects when you go through. By the time you have found the chair, he has found the door. The ledger lies open at a page with nothing written on it yet." },
      { end: true, picture: "kept" }
    ] },

  // The red button.
  { id: "press_the_red", match: { verb: "push", obj: "red" }, if: [{ "player.at": "switchroom" }],
    do: [
      { say: "The red button goes down and stays down, which nothing here has ever done. Through the wall ten thousand drawers slide open at once, with a sound like a long breath let out. The buttons go, from their saucers and their pitches and the thread of every coat, rolling over the boards towards the doors, each of them going home. In the hall Mr Tally puts the cap on his pen. Along the passage the lamps go out, one after another, and last of all the one under your finger." },
      { end: true, picture: "released" }
    ] }
];

// ---- The world's change set --------------------------------------------------------------------------------------------
export default {
  because: "After the opening: the Button Exchange, a trading hall where lost buttons are kept in drawers and traded for others.",
  facts: ["Buttons come off at a parting and are kept in a drawer, which opens for the word they were lost on.", "The coat is whole once the horn button is sewn on.", "Three endings: wear the coat, give it to Mr Tally, press the red button."],
  properties: { "coat.whole": { type: "boolean", start: false } },
  opening: {
    room: "cloak", hints: "thimble", intro: "ticket", way: "lift",
    lines: {
      notYet: "The gate stays drawn across. On the counter, the thimble goes on murmuring to itself, to nobody, in a voice about the size of a thimble.",
      through: "You hold up the thimble, and the brass gate folds itself aside the width of a thimble and then, grudgingly, a little more. The lift takes you in and goes up, and the gate is shut behind you before you have finished looking round.",
      hintFrame: "You hold the thimble to your ear, and a small voice in it says:",
      farewell: "The ticket goes soft in your fingers, and is a little warm lint, which a draught takes."
    }
  },
  effects: [
    { time: "day 1 17:00", weekday: "wed" },                 // the opening is played at five
    { set: "game.entrance", to: "hall" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:10", weekday: "wed" },
      { say: "Somewhere behind a wall, a sewing machine finishes a seam and starts another." }
    ] },
    // Verbs this world needs
    { add: "word", verb: "sew", words: ["sew", "stitch", "mend", "darn", "fasten", "attach"], reply: "There is nothing here that wants sewing." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
