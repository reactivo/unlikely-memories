// "The Button Hall": a world after the opening, in English, written the way the AI is asked to write a world (BRIEF.md alone).
// One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js";
import music, { rooms as roomMusic } from "./music.js";
import levels from "./levels.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Button Hall",
  blurb: "Every doorbell, crossing and lift call in town is wired to one brass wall, and you are the evening relief. Row nine has a gap in it.",
  thumbnail: { picture: "hall", x: 30 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0–95)
  synopsis: "You arrive as the evening relief at the Button Hall, where every doorbell, crossing light and lift call in town " +
    "is wired to a brass button on one wall. Row nine has a gap in it, where the button for Mill Street should be, and at " +
    "Mill Street a crowd has waited for its light to change since the Tuesday of the wind. The clerk before you has gone " +
    "home without saying where the button went.",
  tone: "A night clerk reading out a form: short flat sentences in the present tense, a municipal register that counts and " +
    "labels. The narrator notices plates, rows, which button is pressed and which is free, the click before anything answers; " +
    "it leaves out why, and never says how anyone feels. Samples: \"Row nine has a gap where Mill Street should be.\" / " +
    "\"Somewhere a doorbell rings in a house with nobody in. It is answered.\" / \"The chair is warm. It was not left for you.\"",
  style: "dithered",
  start: "Tuesday, 18:10, in the Button Hall (the opening, in the waiting booth, at 17:50).",
  opening: "The waiting booth, glass on all sides: a black receiver on the bench (hints), a punched relief card you " +
    "already carry (why you came). The sliding wicket in the far glass is the way on.",
  music: "wistful dorian, a clerk's pace; a doorbell struck and a bell-wire plucked, a relay ticking like a thumb on a button; " +
    "heard through a wall, from the next room of somebody else's evening",
  rules: [
    "Every button in town is wired to one on the Hall's wall, and pressing it there is pressing it here.",
    "A pressed button is always answered, by someone who did not press it.",
    "A street without its button is a street where no one can go on.",
    "Whoever sits at the relief desk relieves the last clerk, and stays."
  ],
  characters: ["The crowd at Mill Street", "The last clerk, who is not here"],
  places: ["The Waiting Booth", "The Button Hall", "Mill Street"],
  endings: [
    "Crossed: fit Mill Street's button into its gap and press it; the light goes green and the crowd crosses.",
    "Rung: press the big red ALL; every bell in town rings and everyone comes out on their steps.",
    "Relieved: sit at the relief desk and take the last clerk's place.",
    "Died: the battery cellar's bare terminals, touched too often."
  ],
  chaos: 0.1
};

// Carried things get their sprites (sprites.js): the one shown when examined, and the one drawn on the floor.
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- The ending pictures ------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here.
const endingPictures = {
  crossed: { alt: "Mill Street crossing in low evening sun: the light on the post glowing green, a crowd stepping off the kerb onto the striped road, their long shadows stretching ahead of them.", picture: endings.crossed },
  rung: { alt: "The town from far above at night, every window lit at once, small figures stepping out onto doorsteps in a hundred streets, and the Button Hall's dark roof in the middle.", picture: endings.rung },
  clerk: { alt: "Close up, the clerk's swivel chair at the foot of the wall of buttons, its seat dented; one row of buttons glows, and a coat hangs on the hook beside it.", picture: endings.clerk },
  died: { alt: "Close up, a row of brass battery terminals in a dark cellar, a blue spark leaping between two of them and lighting a glass jar behind.", picture: endings.died }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "booth": the opening, never returned to. Area "hall" (x east, y south, z up): the Hall at the middle, the console north with
// the clerk's office beside it, the stockroom west, the lamp room east, the gallery up the stairs and the battery cellar down them.
// Area "town": Mill Street, south of the Hall's street door.
const rooms = {
  booth: {
    name: "WAITING BOOTH", area: "booth", at: [0, 0, 0],
    describe: [
      "A glass booth with a bench and a number board lit on none of its numbers. Beyond the glass, an evening shift is changing.",
      "The only way on is the {wicket}, a sliding hatch in the far pane."
    ],
    exits: { n: true },
    scenery: [
      { words: ["bench", "seat"], name: "the bench", says: "Slatted, warm in one place." },
      { words: ["board", "numbers", "number"], name: "the board", says: "One to ninety-nine, every one dark. Yours has not been called, or has, and was missed." },
      { words: ["glass", "pane", "panes", "booth"], name: "the glass", says: "Clean on the inside. Outside, the evening goes about its business." }
    ],
    ambience: { lines: [
      "The board clicks once and stays on nothing.",
      "A bell rings, far off, twice. Someone answers it.",
      "The bench creaks, as if someone has just stood up.",
      "The receiver hums a note, thinks better of it, and stops."
    ], every: [30, 60] },
    alt: "A glass waiting booth: a bench, a number board with every number dark, and a small sliding hatch in the far glass.",
    overlayAlt: { receiver: "A black receiver lying on the bench." }
  },
  hall: {
    name: "THE BUTTON HALL", area: "hall", at: [0, 0, 0],
    describe: [
      "The far wall is all {buttons|wall}: rows of brass, each with a plate no bigger than a stamp. In row nine there is a {gap|socket} where Mill Street should be.",
      "The console is north, the lamp room east, the stockroom west. The {stairs} climb on one side and drop on the other. The {street door|street_door} is behind you, south."
    ],
    exits: { n: "console", e: "lamproom", w: "stockroom", u: "gallery", d: "cellar", s: "crossing" },
    ambience: { lines: [
      "Somewhere in the wall a button clicks, and a long way off a doorbell rings. It is answered.",
      "A row of buttons settles with a sound like knuckles.",
      "The stairs tick, cooling, though nothing warms them.",
      "A button on the wall comes up by itself. Someone, somewhere, has let go."
    ], every: [30, 60] },
    alt: "A hall whose far wall is covered in rows of small brass buttons. In the bottom row, one button is missing. A stair climbs on the right, another drops on the left."
  },
  console: {
    name: "THE CONSOLE", area: "hall", at: [0, -1, 0],
    describe: [
      "A desk the length of the room, lit by one green lamp. Under a raised flap at its middle sits a big red {button|all_button}.",
      "Rows of unlabelled spares line the edges. The Hall is south, the clerk's office west."
    ],
    exits: { s: "hall", w: "office" },
    scenery: [
      { words: ["desk", "console"], name: "the desk", says: "Green baize, scorched pale where a hand has rested." },
      { words: ["lamp", "green"], name: "the lamp", says: "A shaded lamp, lit green for no one in particular." },
      { words: ["spares", "edges", "edge", "rows", "row"], name: "the spares", says: "Hundreds of plain buttons, waiting to be somebody's." }
    ],
    ambience: { lines: [
      "The big button ticks as the desk cools, and nobody flinches.",
      "A spare, down an edge, is pressed by a draught. Nothing answers it.",
      "The green lamp hums on the note the Hall hums."
    ], every: [35, 70] },
    alt: "A long desk lit by a green lamp, with a big red button under a raised glass flap at its middle and rows of small brass buttons along its edges."
  },
  office: {
    name: "THE CLERK'S OFFICE", area: "hall", at: [-1, -1, 0],
    describe: [
      "A small office with a hat-stand, a desk and a swivel {chair} whose seat is still warm. A {ledger} lies open on the desk.",
      "The console is east."
    ],
    exits: { e: "console" },
    scenery: [
      { words: ["stand", "hat-stand", "hatstand", "coat", "hat"], name: "the hat-stand", says: "One coat and one hat, waiting for the same head." },
      { words: ["desk"], name: "the desk", says: "Inkwell, blotter, and a ring where a cup stood for years." }
    ],
    ambience: { lines: [
      "The chair turns a few degrees by itself and stops.",
      "The coat on the stand moves, as at a step.",
      "A drawer in the desk shuts on nothing."
    ], every: [35, 70] },
    alt: "A small office seen from a corner: a desk with an open ledger, a swivel chair, and a hat-stand with one coat and one hat."
  },
  stockroom: {
    name: "THE STOCKROOM", area: "hall", at: [-1, 0, 0],
    describe: [
      "Shelves of shallow cardboard drawers, each holding a dozen buttons of one kind. A tea-chest stands by the door.",
      "One low {drawer|lost_drawer}, wider than the rest, has a lock shaped like a buttonhole. The Hall is east."
    ],
    exits: { e: "hall" },
    scenery: [
      { words: ["shelves", "shelf", "drawers", "cardboard"], name: "the shelves", says: "Pearl, horn, bone, brass, cloth-covered: one kind to a drawer, sorted by someone with time." },
      { words: ["crate", "chest", "tea-chest", "teachest", "saucer"], name: "the crate", says: "A tea chest with a saucer on it." }
    ],
    ambience: { lines: [
      "A drawer slides out an inch, considers, and slides back.",
      "Buttons shift in a drawer like dry rain.",
      "Something small rolls across a shelf and is caught."
    ], every: [35, 70] },
    alt: "A stockroom of shallow drawers floor to ceiling, a low wide drawer on the left, and a tea-chest with a saucer on it.",
    overlayAlt: { mint: "A single white peppermint in the saucer." }
  },
  lamproom: {
    name: "THE LAMP ROOM", area: "hall", at: [1, 0, 0],
    describe: [
      "A hundred small lamps, one for every button on the wall, each lit while someone somewhere is waiting. Ninety-nine are green. One is red, and has been for a long time.",
      "Under the lamps a shallow {tray} is shut flush with the panel, and beside it is a small {tray button|tray_button}. The Hall is west."
    ],
    exits: { w: "hall" },
    scenery: [
      { words: ["lamps", "lamp", "panel", "green"], name: "the lamps", says: "Each is a little glass bead with a filament in it. Ninety-nine glow the colour of waiting." },
      { words: ["red"], name: "the red lamp", says: "Mill Street. Red since the Tuesday of the wind. The light at its crossing has been red as long." }
    ],
    ambience: { lines: [
      "A lamp goes out. In a house somewhere, a bell has been answered.",
      "A lamp comes on. Someone has pressed something and is waiting.",
      "The red lamp does not flicker. It gave that up years ago."
    ], every: [30, 60] },
    alt: "A wall of a hundred small round lamps, nearly all green, one red in the lower row, with a shut steel tray and a small square button beneath.",
    overlayAlt: { pearl: "A pearl button in the open tray." }
  },
  gallery: {
    name: "THE GALLERY", area: "hall", at: [0, 0, 1],
    describe: [
      "An iron catwalk along the top of the wall. From here the buttons make a pattern, and the pattern has a hole in it.",
      "A brass {spyglass} on a stand points through a high window. The stairs go down."
    ],
    exits: { d: "hall" },
    scenery: [
      { words: ["catwalk", "rail", "railing"], name: "the catwalk", says: "Iron, painted green, with the paint worn to iron where hands have been." },
      { words: ["pattern", "hole", "wall", "buttons"], name: "the wall", says: "From above it is plain: rows of ten, and one gap in row nine, where Mill Street should be." },
      { words: ["window"], name: "the window", says: "High and narrow, thick with the evening." },
      { words: ["stairs", "steps"], name: "the stairs", leads: "d" }
    ],
    ambience: { lines: [
      "The catwalk hums faintly, in time with the wall below.",
      "A button below is pressed. You feel it in your shoes.",
      "The spyglass shifts a degree on its stand, as if someone had looked."
    ], every: [35, 70] },
    alt: "An iron catwalk above the wall of brass buttons, seen from the rail: the rows below with one gap in the bottom row, and a brass spyglass on a stand by a high window."
  },
  cellar: {
    name: "THE BATTERY CELLAR", area: "hall", at: [0, 0, -1],
    describe: [
      "Rows of glass jars, one for every button upstairs, each with a pair of {terminals} that buzz. A rubber mat runs down the middle.",
      "The bare brass hums a note you feel in your teeth, and a blue spark walks from one post to the next. The stairs go up."
    ],
    exits: { u: "hall" },
    scenery: [
      { words: ["jars", "jar", "water", "salt"], name: "the jars", says: "Each is labelled with a street. The one for Mill Street is dry and furred with salt." },
      { words: ["mat", "rubber"], name: "the mat", says: "Black rubber, the width of one careful person." },
      { words: ["stairs", "steps"], name: "the stairs", leads: "u" },
      { words: ["spark"], name: "the spark", says: "Blue, quick, and not interested in you yet." }
    ],
    ambience: { lines: [
      "A spark walks from one post to the next and goes out in a corner.",
      "A jar bubbles once. Upstairs, a bell is answered.",
      "The hum drops a note and climbs back up."
    ], every: [30, 60] },
    alt: "A cellar of glass jars wired to bare brass terminals, a blue spark between two posts, a black rubber mat, and stairs going up."
  },
  crossing: {
    name: "MILL STREET", area: "town", at: [0, 0, 0],
    describe: [
      "Dusk at a pedestrian crossing. A crowd stands at the kerb, not crossing. The light on the post is red.",
      "The post has a bare plate where a button should be, with two wires running off towards the Hall. The Hall's door is north."
    ],
    exits: { n: "hall" },
    scenery: [
      { words: ["crowd", "people", "kerb"], name: "the crowd", says: "Forty or so, each with somewhere to be and a coat for it. A few have been here long enough to lean on one another." },
      { words: ["post", "plate", "wires", "wire"], name: "the post", says: "A bare plate, drilled for a button that is not there. Two wires leave it and go under the road, towards the Hall." },
      { words: ["light", "red"], name: "the light", says: "Red. It has been red so long that it has begun to look like a colour of the street." },
      { words: ["road", "stripes", "crossing"], name: "the crossing", says: "Four wide stripes, worn grey in the middle by nothing." },
      { words: ["door"], name: "the Hall's door", leads: "n" }
    ],
    ambience: { lines: [
      "Someone in the crowd checks a watch that has stopped, and puts it away politely.",
      "A tram goes by on the next street. Nobody turns.",
      "Two people at the kerb swap places, to be fair.",
      "The light hums, red, as it has for eleven years."
    ], every: [30, 60] },
    alt: "A street crossing at dusk under a purple sky: a crowd standing at the kerb, a post with a red light and a bare plate, and the striped road empty ahead."
  }
};

// ---- Things ----------------------------------------------------------------------------------------------------------------
const objects = {
  // The opening
  receiver: {
    at: "booth", portable: true, material: "metal", name: "Receiver", note: "Humming to itself.",
    here: "A black {receiver} lies on the bench, humming to itself.",
    words: { nouns: ["receiver", "handset", "phone"], adj: ["black"] },
    examine: "A black handset on a cord that goes nowhere. It hums the note a switchboard hums when it is thinking of you.",
    ...item("receiver")
  },
  card: {
    at: "player", portable: true, material: "paper", name: "Relief card", note: "Punched with square holes.",
    words: { nouns: ["card"], adj: ["relief", "punched"] },
    examine: "Square holes spell out \"Relief. Button Hall. Evening.\" Under them, in pencil: \"Be quicker than the last one.\"",
    ...item("card")
  },
  wicket: {
    at: "booth", name: "Wicket", note: "A hatch in the glass.",
    words: { nouns: ["wicket", "hatch"], adj: ["sliding"] },
    examine: "A sliding hatch the size of a small door, its edge worn bright by thumbs."
  },

  // The Hall
  wall: {
    at: "hall", name: "Wall of buttons", note: "Rows of brass.", use: "push",
    words: { nouns: ["wall", "buttons", "button", "rows"], adj: ["brass"] },
    parts: [{ words: ["plate", "plates"], name: "the plates", says: "Street names in a clerk's hand: Baker Street, the Pier, Gas Works, Church Walk." }],
    examine: "Brass buttons a thumb wide, in rows of ten. Each plate is the name of a street. Row nine is one short.",
    push: [
      "You press Baker Street. Far off, a doorbell rings in a house with nobody in. It is answered.",
      "You press the Pier. A foghorn, a long way away, takes it personally.",
      "You press Gas Works. A lamp comes on in a window and goes off again.",
      "You press Church Walk. A latch lifts, somewhere, for no one you can see."
    ]
  },
  socket: {
    at: "hall", name: "Gap", note: "Row nine, empty.",
    words: { nouns: ["gap", "socket", "hole"], adj: ["empty", "bare"] },
    examine: "A round socket with one bare wire in it. The plate beneath says Mill Street, and has been polished by someone expecting a button.",
    push: "There is nothing to press. The wire only waits."
  },
  stairs: {
    at: "hall", name: "Stairs", note: "Up and down.", leads: ["u", "d"],
    words: { nouns: ["stairs", "steps", "stair"], adj: ["iron"] },
    examine: "Iron steps, worn in the middle. One flight goes up to a gallery, the other down into a hum."
  },
  street_door: {
    at: "hall", door: "s", material: "wood", name: "Street door", note: "To Mill Street.",
    words: { nouns: ["door"], adj: ["street"] },
    examine: "A glass door onto the evening. Beyond it a street light stays red."
  },
  fitted_button: {
    at: null, name: "Mill button", note: "In row nine.", use: "push",
    words: { nouns: ["button", "mill"], adj: ["mill", "street", "brass"] },
    examine: "Brass, polished by the fingers that wanted it. The plate beneath says Mill Street."
  },

  // The console and the office
  all_button: {
    at: "console", name: "Big red button", note: "Under a flap.", use: "push",
    words: { nouns: ["button"], adj: ["big", "red"] },
    parts: [
      { words: ["flap"], name: "the flap", says: "A glass flap on a hinge, open. It has not been closed in a long time." },
      { words: ["plate"], name: "the plate", says: "\"Every bell in town. At once.\"" }
    ],
    examine: "The size of a saucer, worn bright at the middle. Someone has wanted to, many times, and has not."
  },
  chair: {
    at: "office", name: "Relief chair", note: "Still warm.",
    words: { nouns: ["chair"], adj: ["relief", "swivel"] },
    examine: "Worn to the shape of someone who sat very still for years. A plate on its back says: \"Whoever sits here relieves the last.\""
  },
  ledger: {
    at: "office", name: "Ledger", note: "A clerk's hand.",
    words: { nouns: ["ledger", "book", "log"], adj: [] },
    examine: "One entry a day in a tidy hand: \"Pressed. Answered.\" One entry is longer than the rest.",
    read: "\"Mill Street. Button taken out for cleaning, filed in the Lost drawer. The drawer keeps a pearl lock. The pearl is in the lamp room tray. Replace tomorrow.\" The date is eleven years old. The entries stop there."
  },

  // The stockroom
  mint: {
    at: "stockroom", portable: true, material: "soft", consumable: true, heals: 1, name: "Peppermint", note: "White and strong.",
    here: "A single {peppermint|mint} waits in a saucer on the crate.",
    words: { nouns: ["mint", "peppermint"], adj: ["white"] },
    examine: "A white peppermint with a ring of red round its edge, like a button that has been sucked.",
    eat: "It is very strong. Something behind your eyes sits up.",
    ...item("mint")
  },
  lost_drawer: {
    at: "stockroom", container: true, open: false, locked: true, material: "wood", name: "Lost drawer", note: "A buttonhole lock.",
    lock: {
      key: "pearl",
      says: "The lock is a buttonhole, cut to a button's thickness. It wants one that fits.",
      opens: "The pearl slips into the buttonhole and the drawer slides out, grudgingly."
    },
    words: { nouns: ["drawer"], adj: ["lost", "low", "wide"] },
    examine: "Low and wide, labelled \"Lost\" in a clerk's hand. The lock is a buttonhole."
  },
  mill_button: {
    at: "lost_drawer", portable: true, material: "metal", name: "Mill button", note: "Brass, with a shank.",
    words: { nouns: ["button", "mill"], adj: ["mill", "street", "brass"] },
    examine: "A brass button with a raised ring and a shank behind. The back is stamped, very small, with a street.",
    ...item("mill_button")
  },

  // The lamp room
  tray: {
    at: "lamproom", name: "Tray", note: "Shut flush.",
    words: { nouns: ["tray"], adj: ["lamp", "shallow", "steel"] },
    examine: "A shallow steel tray, flush with the panel. It has no handle."
  },
  tray_button: {
    at: "lamproom", name: "Tray button", note: "Small and square.", use: "push",
    words: { nouns: ["button"], adj: ["tray", "small", "square"] },
    examine: "A small square button, its plate worn to \"Tray\". Cleaner than anything else here: it has been pressed lately, or often."
  },
  pearl: {
    at: null, portable: true, material: "stone", name: "Pearl button", note: "Thin as a coin.",
    words: { nouns: ["button", "pearl"], adj: ["pearl"] },
    examine: "A flat pearl button, thin as a coin, with two pairs of holes for thread.",
    ...item("pearl")
  },

  // The gallery
  spyglass: {
    at: "gallery", name: "Spyglass", note: "Aimed at the window.", actions: ["Look through spyglass"],
    words: { nouns: ["spyglass", "telescope"], adj: ["brass"] },
    examine: "A brass spyglass on a stand, aimed through the window.",
    search: "Through the window and the dusk: Mill Street, and a crowd at its crossing, standing the way people stand when they have forgotten what they are waiting for."
  },

  // The cellar
  terminals: {
    at: "cellar", name: "Terminals", note: "Bare and buzzing.",
    words: { nouns: ["terminals", "terminal", "posts", "post", "brass"], adj: ["bare"] },
    examine: "Brass posts the size of thumbs, bright with a blue light. They are bare and they are alive."
  }
};

// ---- Rules ---------------------------------------------------------------------------------------------------------------------
const rules = [
  // The lamp room: the tray button slides the tray out with the pearl
  { id: "press_tray", match: { verb: "push", obj: "tray_button" }, once: true,
    again: "The tray slides in and out again, as pleased as it was.",
    do: [
      { set: "tray.out", to: true },
      { move: "pearl", to: "lamproom" },
      { say: "The tray slides out with a sigh. In it lies a pearl button." }
    ] },
  { id: "open_tray", match: { verb: ["open", "pull"], obj: "tray" },
    do: [{ say: "The tray will not move by hand. The small button beside it does that." }] },

  // The wall's gap: the Mill button goes in, and then it can be pressed
  { id: "fit_button", match: { verb: ["put", "use", "fit"], obj: "mill_button", obj2: "socket" }, if: [{ "player.at": "hall" }],
    do: [
      { say: "The button goes in with a click like a knuckle. Row nine is whole." },
      { move: "mill_button", to: null },
      { move: "socket", to: null },
      { move: "fitted_button", to: "hall" },
      { set: "hall.describe", to: [
        "The far wall is all {buttons|wall}: rows of brass, each with a plate no bigger than a stamp. Row nine is whole.",
        "The console is north, the lamp room east, the stockroom west. The {stairs} climb on one side and drop on the other. The {street door|street_door} is behind you, south."
      ] },
      { set: "hall.alt", to: "A hall whose far wall is covered in rows of small brass buttons, none missing. A stair climbs on the right, another drops on the left." },
      { draw: "hall", add: ["ellipse mill_btn 218,91,5,3 14 e6", "dots mill_glint 217,90 c15"] }
    ] },
  { id: "fit_pearl", match: { verb: ["put", "use", "fit"], obj: "pearl", obj2: "socket" }, if: [{ "player.at": "hall" }],
    do: [{ say: "The pearl slides into the gap and slides out again, a size too small. It is for locks, not for Mill Street." }] },
  { id: "press_fitted", match: { verb: "push", obj: "fitted_button" },
    do: [
      { say: "You press it. Down the wire, under the road, a post clicks. In Mill Street the light turns green, and the crowd steps off the kerb together, a little stiffly, like people stepping into cold water. They cross. Nobody looks back at the Hall; it is, after all, only a wall." },
      { end: true, picture: "crossed" }
    ] },

  // The console: the big button
  { id: "press_all", match: { verb: "push", obj: "all_button" },
    do: [
      { say: "You press it. Every bell in town rings at once. Windows light and doors open, and everyone steps out to see who it was. It was everyone. They stand on their steps and look at one another until the lamps go out." },
      { end: true, picture: "rung" }
    ] },

  // The office: the relief chair
  { id: "sit_chair", match: { verb: ["sit", "enter", "lie"], obj: "chair" },
    do: [
      { say: "You sit. The chair takes your weight as if it had been kept for you. Far off, someone presses a button, and you find you know the answer. Somewhere, the last clerk puts on his hat." },
      { end: true, picture: "clerk" }
    ] },

  // The cellar: the bare terminals
  { id: "terminals_bite", match: { verb: ["touch", "push", "pull", "attack"], obj: "terminals" },
    do: [{ hurt: 2, says: "The terminals take your fingers, politely, and give them back." }] }
];

// ---- Puzzles (for the checker and the hints). The endings in the order the hints should reach them. ----------------------------------
const puzzles = {
  open_tray: { where: "lamproom", needs: [], solve: ["press tray button", "take pearl button"], gives: ["pearl"],
    clues: ["tray_button", "ledger", "tray"],
    hints: ["Beside the shut tray in the lamp room there is a small button.", "Press the tray button, then take the pearl button."] },
  open_drawer: { where: "stockroom", needs: ["pearl"], solve: ["unlock drawer with pearl button", "take mill button"], gives: ["mill_button"],
    clues: ["lost_drawer", "ledger", "socket"],
    hints: ["The Lost drawer has a lock shaped like a buttonhole.", "Unlock the Lost drawer with the pearl button, and take the Mill button."] },
  end_crossed: { where: "hall", needs: ["mill_button"], solve: ["put mill button in gap", "press mill button"], ending: true,
    clues: ["socket", "spyglass", "ledger"],
    hints: ["Row nine has a gap, and Mill Street has a button.", "Put the Mill button in the gap, then press it."] },
  end_rung: { where: "console", needs: [], solve: ["press red button"], ending: true,
    clues: ["all_button", "wall"],
    hints: ["The big red button's plate promises every bell in town.", "Press the big red button."] },
  end_clerk: { where: "office", needs: [], solve: ["sit on chair"], ending: true,
    clues: ["chair", "ledger"],
    hints: ["The warm chair has a plate on its back.", "Sit on the relief chair."] }
};

// ---- The world ---------------------------------------------------------------------------------------------------------
export default {
  because: "The Button Hall: a waiting booth, then a hall of brass buttons, the console, an office, a stockroom, a lamp room, a gallery, a battery cellar and Mill Street.",
  facts: [
    "Row nine of the wall has a gap where the Mill Street button belongs; the button is in the Lost drawer, whose lock wants the pearl button from the lamp room tray.",
    "Endings: crossed (fit and press the Mill button), rung (press the big red button), clerk (sit in the relief chair), died (the cellar's terminals)."
  ],
  properties: {
    "tray.out": { type: "boolean", start: false }
  },
  opening: {
    room: "booth", hints: "receiver", intro: "card", way: "wicket",
    lines: {
      notYet: "The wicket does not slide. The receiver is still humming on the bench.",
      through: "You push the wicket up and climb through. It drops shut behind you with a small bell.",
      hintFrame: "The receiver clicks. A voice says:",
      farewell: "The card is punched once more, by nobody, and is confetti."
    }
  },
  effects: [
    { time: "day 1 17:50", weekday: "tue" },                 // the opening is played at ten to six
    { set: "game.entrance", to: "hall" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 18:10", weekday: "tue" },
      { say: "Somewhere a bell rings, once, and is answered." }
    ] },
    // Verbs this world needs
    { add: "word", verb: "fit", words: ["fit", "seat", "slot", "attach"], reply: "There is nothing here to fit." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
