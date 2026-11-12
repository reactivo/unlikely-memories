// "Coat 41": a world after the opening, in English, written the way the AI is asked to write a world (BRIEF.md only).
// One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js";
import music, { rooms as roomMusic } from "./music.js";
import levels from "./levels.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Coat 41",
  blurb: "You came for a coat with a button missing. The Button Office keeps a wall of brass buttons, and every one does something somewhere. Press with care.",
  thumbnail: { picture: "panel", x: 40 },
  synopsis: "You ride a lift to the Button Office to collect Coat 41, which is one button short. The building is a wall of " +
    "brass buttons, each with a plate that says what it does somewhere else. Mr Hobb keeps the desk, Mrs Venn the needle, " +
    "and nobody has ever pressed a button for themselves.",
  style: "dithered",
  tone: "A clerk's voice: clipped, numbered, deadpan. Short plain sentences, now and then a list. The narrator notices " +
    "plates, numbers and brass, and leaves out feelings and explanations; the strange thing is said once, in the same " +
    "breath as the ordinary one. Samples: " +
    "\"Forty buttons, forty plates. Thirty-one tell the truth.\" " +
    "\"Mr Hobb files you under visitor and returns to his crossword.\" " +
    "\"Press, and somewhere a thing is done. You are told after, if at all.\"",
  rules: [
    "A button does what its plate says, somewhere else in the building, and the plate does not say where.",
    "Every button lost in the city ends up on the wall.",
    "Nothing here is handed out unasked: keys, tea, coats.",
    "The street door opens only for a whole coat."
  ],
  opening: "A lift car, stopped; a handset on its hook talks (hints); you carry a label (COAT 41. ONE BUTTON SHORT.); the " +
    "folding gate is the way on.",
  music: "limping dorian; a service bell, a plucked button wire and a switch that clicks; music from the next office",
  start: "Friday evening, the Button Office.",
  characters: ["Mr Hobb, the porter", "Mrs Venn, the tailor"],
  places: ["the lobby", "the panel room", "the register", "the sorting room", "the mending room", "the canteen", "the engine room"],
  endings: ["Whole: collect the coat and leave by the street door.", "All: press the big button.", "Died: the warm button."],
  chaos: 0.15
};

// Carried things get their sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id] });

// ---- The opening -------------------------------------------------------------------------------------------------------
const opening = {
  room: "lift_car", hints: "handset", intro: "label", way: "gate",
  lines: {
    notYet: "The gate stays shut. The handset on its hook is still talking.",
    through: "The gate folds back and lets you through, then folds shut on an empty lift.",
    hintFrame: "The handset clears its throat. A voice says:",
    farewell: "The string loosens by itself. The label is gone before it lands."
  }
};

// ---- The ending pictures -----------------------------------------------------------------------------------------------
const endingPictures = {
  whole: { alt: "A street door standing open on an evening street, and a grey coat in the doorway with four buttons in a row.", picture: endings.whole },
  unbuttoned: { alt: "A wall of brass with every button gone, and a heap of loose buttons below it, caught in lamplight.", picture: endings.unbuttoned },
  died: { alt: "A brass button the size of a plate, close up, with a thread of smoke rising from it in the dark.", picture: endings.died }
};

// ---- Rooms -------------------------------------------------------------------------------------------------------------
const rooms = {
  lift_car: {
    name: "THE LIFT", area: "lift", at: [0, 0, 0],
    describe: [
      "A lift car, stopped. The panel by the wall has no numbers, only blank brass.",
      "A folding {gate} is the only way on."
    ],
    exits: { out: true },
    scenery: [
      { words: ["panel", "brass", "buttons"], name: "the panel", id: "panel_lift", says: "Twelve blank buttons, polished by a thumb that never found its number." },
      { words: ["hook"], name: "the hook", id: "hook", says: "A brass hook, made for a handset." }
    ],
    ambience: { lines: [
      "The car settles, like a person deciding to sit.",
      "Far below, a button is pressed.",
      "The cable above you ticks twice."
    ], every: [25, 60] },
    alt: "A small lift car: a panel of blank brass buttons, a hook on the wall, and a folding gate at the far end.",
    overlayAlt: { handset: "A black handset hangs on its hook." }
  },
  lobby: {
    name: "THE LOBBY", area: "office", at: [0, 0, 0],
    describe: [
      "A long {desk}, a board of keys, and a {street door|street_door} with a sign: \"Whole coats only.\" Nobody has used the door today, or this year.",
      "Brass runs up the walls, and now and then a button in it clicks back out. The Panel Room is east, mending west, the canteen south."
    ],
    exits: { e: "panel", w: "mending", s: "canteen" },
    scenery: [
      { words: ["board", "nails", "nail", "keys"], name: "the board", id: "board", says: "Twelve nails, eleven keys. The twelfth nail has a plate: REGISTER." },
      { words: ["sign"], name: "the sign", id: "sign", says: "\"Whole coats only.\" The paint has been touched up many times." },
      { words: ["walls", "wall", "brass", "plate", "plates"], name: "the walls", id: "walls_lobby", says: "Brass plates and brass buttons, floor to ceiling. They are cool and very clean." }
    ],
    ambience: { lines: [
      "Somewhere in the wall, a button clicks back out.",
      "Mr Hobb turns a page. It makes the sound of a much bigger page.",
      "The brass ticks as it cools."
    ], every: [30, 70] },
    alt: "A long hall of brass walls going away to a glass street door under a sign. On the left, a desk with a man behind it and a board of keys; dark doorways on either side.",
    overlayAlt: {}
  },
  panel: {
    name: "THE PANEL ROOM", area: "office", at: [1, 0, 0],
    describe: [
      "A wall of brass buttons, each under its plate. At hand height: {7|b07}, {13|b13}, {22|b22}, {28|b28}, {35|b35}, {41|b41}, {52|b52}, {60|b60}.",
      "13 hums. The register is north, sorting south, the engine room east, the lobby west."
    ],
    exits: { w: "lobby", n: "register", s: "sorting", e: "engine" },
    scenery: [
      { words: ["wall", "rows", "plate", "plates", "brass"], name: "the wall", id: "wall_panel", says: "Rows of brass to the ceiling. Only the buttons at hand height are within reach." }
    ],
    ambience: { lines: [
      "A button somewhere above you pops in, and stays.",
      "The humming changes its mind, then goes back.",
      "A plate rattles. Nothing has touched it."
    ], every: [25, 60] },
    alt: "A wall of brass buttons in rows. On the right, eight buttons in a dark block under small plates, the second one red with smoke rising. In the middle, an arched doorway onto shelves; doorways at both ends.",
    overlayAlt: {}
  },
  register: {
    name: "THE REGISTER", area: "office", at: [1, -1, 0],
    describe: [
      "Shelves of ledgers to the ceiling, spines the colour of tea. Every coat in the city has a line here, kept up to date in a hand nobody has seen. A tall {cabinet} stands at the end.",
      "The Panel Room is south."
    ],
    exits: { s: "panel" },
    scenery: [
      { words: ["shelves", "ledgers", "spines", "books"], name: "the shelves", id: "shelves", says: "Every coat in the city has a line here. Most of the lines say: pressed in." }
    ],
    ambience: { lines: [
      "A ledger slides a finger's width on its shelf.",
      "Dust settles, in order.",
      "The lamp hisses over a name."
    ], every: [30, 70] },
    alt: "A narrow aisle between ledger shelves, floor to ceiling, ending in a tall brown cabinet under a hanging lamp, with a lectern to one side.",
    overlayAlt: {}
  },
  sorting: {
    name: "THE SORTING ROOM", area: "office", at: [1, 1, 0],
    describe: [
      "Trays on trays of loose buttons, sorted by something other than colour. A lamp hangs low over the long table. Every button here was returned by someone, and nobody has been thanked.",
      "The Panel Room is north."
    ],
    exits: { n: "panel" },
    scenery: [
      { words: ["trays", "tray", "buttons"], name: "the trays", id: "trays", says: "Horn, shell, glass, the odd one of lead. Each tray is a rule nobody wrote down." },
      { words: ["table", "lamp"], name: "the table", id: "table", says: "A long table under a green lamp. The wood is worn in two shallow dips, where elbows go." }
    ],
    ambience: { lines: [
      "A button rolls across a tray and lies down in its own place.",
      "The lamp swings a little, as if a door had opened.",
      "Something small is sorted, with a click."
    ], every: [25, 60] },
    alt: "A long table under a green hanging lamp, trays of loose buttons on shelves down both sides, and a door at the far end.",
    overlayAlt: { spool: "A spool of grey thread stands between two trays.", shell_button: "A pale shell button lies alone at the table's edge." }
  },
  mending: {
    name: "THE MENDING ROOM", area: "office", at: [-1, 0, 0],
    describe: [
      "A treadle machine under a high window, a headless dress-form, a rail of coats on hangers. Every coat is waiting for one thing: a button, a thread, a hem. Nothing here has been finished since the building opened.",
      "The lobby is east."
    ],
    exits: { e: "lobby" },
    scenery: [
      { words: ["machine", "treadle"], name: "the machine", id: "machine", says: "A treadle machine. It keeps stitching a little after her foot stops." },
      { words: ["form", "dress-form"], name: "the dress-form", id: "form", says: "It has no head. It looks relieved." },
      { words: ["rail", "coats", "window"], name: "the rail", id: "rail", says: "Coats on hangers, each one a button short of something. None of them is yours." }
    ],
    ambience: { lines: [
      "The treadle clacks twice and rests.",
      "Mrs Venn bites a thread. The thread gives in.",
      "A coat on the rail shrugs, or the draught does."
    ], every: [25, 60] },
    alt: "A tailor's corner: a treadle sewing machine with a woman at it, a window with a night sky, a headless dress-form, and a rail of coats on the left wall.",
    overlayAlt: {}
  },
  canteen: {
    name: "THE CANTEEN", area: "office", at: [0, 1, 0],
    describe: [
      "Four tables, one brass {urn}, a tray of cups on its side. The tea is always just made, and nobody is ever seen making it. Every chair is warm.",
      "The lobby is north."
    ],
    exits: { n: "lobby" },
    scenery: [
      { words: ["tables", "table", "chairs"], name: "the tables", id: "tables", says: "Four small tables with four chairs each. Every chair has been sat in recently." },
      { words: ["cups", "tray"], name: "the cups", id: "cups", says: "White cups, each with a chip at the same place on the rim." }
    ],
    ambience: { lines: [
      "The urn ticks, cooling and heating at once.",
      "A chair settles, though nobody got up.",
      "A spoon turns in a cup in the next room."
    ], every: [30, 70] },
    alt: "A small canteen: four tables with chairs, a tall brass urn on a counter, and cups on a tray.",
    overlayAlt: {}
  },
  engine: {
    name: "THE ENGINE ROOM", area: "office", at: [2, 0, 0],
    describe: [
      "A drum of copper pipes, warm as an animal and as talkative. The pipes knock once whenever a button is pressed anywhere in the building. A {big button|big_button} stands on a post before it.",
      "The Panel Room is west."
    ],
    exits: { w: "panel" },
    scenery: [
      { words: ["drum", "pipes", "copper"], name: "the drum", id: "drum", says: "Copper pipes, going somewhere warm. They knock once for each button pressed." },
      { words: ["post"], name: "the post", id: "post", says: "An iron post, waist high, with the button on top." }
    ],
    ambience: { lines: [
      "The pipes knock once. Somewhere, a button was pressed.",
      "Steam moves in the drum like a held breath.",
      "The floor hums, one note, then another."
    ], every: [25, 60] },
    alt: "A copper drum of pipes filling the back of the room, glowing warm, with a big red button on an iron post in front of it.",
    overlayAlt: {}
  }
};

// ---- Objects -----------------------------------------------------------------------------------------------------------
const panelButton = (n, plate, push, extra = {}) => ({
  at: "panel", name: `Button ${n}`, note: "Brass, under a plate.", words: { nouns: ["button", String(n), `button ${n}`], adj: [] },
  examine: `The plate says: ${plate}`, ...(push ? { push } : {}), ...extra
});

const objects = {
  // The opening
  handset: { at: "lift_car", portable: true, material: "metal", name: "Handset", note: "Someone is talking.", words: { nouns: ["handset"], adj: [] },
    here: "A {handset} hangs on its hook, talking quietly.", examine: "A black handset on a curly cord. Whoever is in it keeps talking, kindly.", ...item("handset") },
  label: { at: "player", portable: true, material: "paper", name: "Label", note: "Tied to your wrist.", words: { nouns: ["label"], adj: [] },
    examine: "A luggage label on string round your wrist: \"COAT 41. ONE BUTTON SHORT.\"", ...item("label") },
  gate: { at: "lift_car", material: "metal", name: "Gate", note: "Folding, brass.", words: { nouns: ["gate"], adj: ["folding"] },
    examine: "A folding brass gate, the kind that pinches. Beyond it, a corridor you can't make out." },

  // The lobby
  desk: { at: "lobby", material: "wood", name: "Desk", note: "Ink and a blotter.", words: { nouns: ["desk"], adj: [] },
    examine: "Ink, a blotter, a bell nobody rings. Behind it hangs the board of keys.",
    parts: [{ words: ["blotter", "ink"], name: "the blotter", says: "Blotting paper, covered in the same word written backwards." }, { words: ["bell"], name: "the bell", says: "A brass bell with a dust cap. Nobody has needed to ring for service." }] },
  hobb: { at: "lobby", name: "Mr Hobb", note: "Behind the desk.", words: { nouns: ["hobb", "mr", "porter"], adj: [], g: "m", proper: true },
    here: "{Mr Hobb|hobb} sits behind the desk, filing nothing.",
    parts: [{ words: ["cardigan", "hands"], name: "his cardigan", says: "Grey wool, buttoned wrongly by exactly one button." }],
    examine: "Grey cardigan, grey hands. He holds every key in the building and has the manner of a man nobody has asked for one.",
    topics: {
      office: { words: ["office", "building", "place"], open: true, says: "\"The Button Office. Visitors collect. Nobody returns.\"" },
      default: "\"Ask for it by name,\" says Hobb."
    } },
  register_key: { at: null, from: "hobb", portable: true, material: "metal", name: "Register key", note: "Its bow is a button.",
    words: { nouns: ["key"], adj: ["register"] }, brought: "Hobb lifts a {key|register_key} off its nail without looking up.",
    examine: "Brass, with a round bow like a button. The plate on its nail said REGISTER.", parts: [{ words: ["bow", "nail", "plate"], name: "the bow", says: "Round, flat, with four tiny holes it does not need." }], ...item("register_key") },
  street_door: { at: "lobby", material: "wood", name: "Street door", note: "Glass, and evening.", words: { nouns: ["door"], adj: ["street"] },
    examine: "A glass door onto a street in the evening light. A sign says: \"Whole coats only.\"" },

  // The panel room
  b07: panelButton(7, "STOPS A CLOCK.", "Somewhere a clock stops. You hear it not ticking."),
  b13: panelButton(13, "WARM.", "", { examine: "The plate says: WARM. A thread of smoke leans off the brass." }),
  b22: panelButton(22, "FEEDS A CAT.", "Somewhere a cat is fed. It does not thank you."),
  b28: panelButton(28, "OPENS A WINDOW.", "A window opens somewhere. A draught comes to say which."),
  b35: panelButton(35, "SAYS SORRY.", "A voice in the wall says sorry. It does not say to whom."),
  b41: panelButton(41, "RETURNS ONE.", "", { examine: "The plate says: RETURNS ONE. The brass is worn to a dip, as if one thumb kept coming back." }),
  b52: panelButton(52, "LOCKS UP.", "Far off, something is locked. Nobody offers you the key."),
  b60: panelButton(60, "MAKES IT RAIN.", "It rains, briefly, on a floor you are not standing on."),

  // The register
  cabinet: { at: "register", container: true, open: false, locked: true, material: "wood", name: "Cabinet", note: "Tall, with a round keyhole.",
    words: { nouns: ["cabinet"], adj: ["tall"] },
    lock: { key: "register_key", says: "The cabinet is locked. Its keyhole is round, the size of a key's bow.", opens: "The key turns. The cabinet opens with a sigh." },
    examine: "Dark wood, one keyhole, a plate: REGISTER ONLY.", parts: [{ words: ["keyhole", "plate"], name: "the keyhole", says: "Round, and the size of a key's bow. The plate over it says REGISTER ONLY." }] },
  ledger: { at: "cabinet", portable: true, material: "paper", name: "Ledger", note: "Open at a coat.", words: { nouns: ["ledger"], adj: [] },
    examine: "It falls open at one line: \"Coat 41. Horn button, two holes. Pressed into the wall at 41.\" The margin is full of other coats.",
    read: "\"Coat 41. Horn button, two holes. Pressed into the wall at 41.\"", ...item("ledger") },
  horn_button: { at: null, portable: true, material: "stone", name: "Horn button", note: "Two holes.", words: { nouns: ["button"], adj: ["horn"] },
    examine: "A horn button, brown, with two holes and a thumb's worth of wear.", ...item("horn_button") },

  // The sorting room
  spool: { at: "sorting", portable: true, material: "wood", name: "Spool", note: "Grey thread.", words: { nouns: ["spool", "thread", "cotton"], adj: [] },
    here: "A {spool} of grey thread stands between two trays, looking sorted.", examine: "Grey thread, nearly full, on a wooden spool.", ...item("spool") },
  shell_button: { at: "sorting", portable: true, material: "stone", name: "Shell button", note: "Four holes.", words: { nouns: ["button"], adj: ["shell"] },
    here: "A {shell button|shell_button} lies alone at the edge of the table.", examine: "A pale shell button, four holes. It belongs to a different coat.", ...item("shell_button") },

  // The mending room
  venn: { at: "mending", name: "Mrs Venn", note: "A needle in her mouth.", words: { nouns: ["venn", "mrs", "tailor"], adj: [], g: "f", proper: true },
    here: "{Mrs Venn|venn} sits at the machine, a needle in her mouth.",
    examine: "A narrow woman with thread on her cuffs. She has not looked up since you came, and she knows who you are. {Coat 41|coat} lies across her knee.",
    parts: [{ words: ["needle"], name: "the needle", says: "A long steel needle, held in her teeth like a thought she is keeping." }, { words: ["cuffs", "cuff"], name: "her cuffs", says: "Grey thread, wound round and round, like a second set of cuffs." }],
    give: "\"Not Forty-one's,\" says Mrs Venn, and hands it back.",
    topics: {
      coat: { words: ["coat", "41", "forty-one"], open: true, says: "\"Forty-one. Its fourth button went into the wall, as they do. I have needles. The thread went to the sorting room.\"" },
      default: "\"Mm,\" says Mrs Venn round the needle."
    } },
  coat: { at: "venn", portable: true, material: "soft", name: "Coat 41", note: "Whole, and yours.", words: { nouns: ["coat"], adj: ["41"] },
    examine: "A grey coat, four buttons in a row. The newest one is the horn one.", ...item("coat") },

  // The canteen
  urn: { at: "canteen", material: "metal", name: "Urn", note: "Warm brass.", words: { nouns: ["urn", "tap"], adj: ["brass"] },
    examine: "A brass urn, taller than it needs to be, with a stiff tap. The plate says: TEA.", parts: [{ words: ["plate"], name: "the plate", says: "TEA, in brass capitals worn smooth." }] },
  tea: { at: null, from: "urn", times: 2, consumable: true, heals: 1, name: "Tea", note: "Hot.", words: { nouns: ["tea", "cup"], adj: [] },
    brought: "The urn gives you a {cup|tea}, full.", drink: "It is exactly as hot as you hoped.",
    examine: "Tea in a white cup, chipped in the usual place." },

  // The engine room
  big_button: { at: "engine", name: "Big button", note: "Worn by a thumb.", words: { nouns: ["button"], adj: ["big", "red"] },
    examine: "Red once, now the colour of a thumb. The plate says: ALL.", parts: [{ words: ["plate"], name: "the plate", says: "ALL. The brass is worn bright round the A." }] }
};

// ---- Rules ------------------------------------------------------------------------------------------------------------
const rules = [
  { id: "push_13", match: { verb: "push", obj: "b13" },
    do: [{ say: "The button clicks. A spark crosses from it to your finger." }, { hurt: 1, says: "It was warm for a reason." }] },
  { id: "push_41", match: { verb: "push", obj: "b41" }, once: true, again: "Nothing comes. The wall has returned what it had.",
    do: [{ say: "The button sinks and the wall coughs. A horn button drops into your hand." }, { move: "horn_button", to: "player" }] },
  { id: "sew", match: { verb: ["give", "put"], obj: "horn_button", obj2: "venn" }, if: [{ "spool.at": "player" }],
    do: [{ say: "Mrs Venn threads the needle, sews four stitches and bites the end. The spool is spent. \"Forty-one,\" she says, and holds out the coat." },
      { remove: "object", id: "horn_button" }, { remove: "object", id: "spool" }, { move: "coat", to: "player" }] },
  { id: "sew_no_thread", match: { verb: ["give", "put"], obj: "horn_button", obj2: "venn" },
    do: [{ say: "\"Needles I have,\" says Mrs Venn. \"Thread, no.\"" }] },
  { id: "door_whole", match: { verb: ["open", "push", "enter", "knock"], obj: "street_door" }, if: [{ "coat.at": "player" }],
    do: [{ say: "The street door opens for a whole coat. Outside it is evening, on a street you nearly know. Behind you, somewhere, a button is pressed for someone else." },
      { end: true, picture: "whole" }] },
  { id: "door_bare", match: { verb: ["open", "push", "enter", "knock"], obj: "street_door" },
    do: [{ say: "The street door stays shut. The sign is right there." }] },
  { id: "push_all", match: { verb: "push", obj: "big_button" },
    do: [{ say: "You press ALL. Every button in the building lets go and falls, like hail, like applause. The wall is smooth. Mr Hobb looks up, relieved, and files it." },
      { end: true, picture: "unbuttoned" }] }
];

// ---- Puzzles ----------------------------------------------------------------------------------------------------------
const puzzles = {
  get_key: { where: "lobby", needs: [], solve: ["ask hobb for key"], gives: ["register_key"], clues: ["hobb", "desk"],
    hints: ["Hobb holds every key, and waits to be asked for one.", "Ask Hobb for the key."] },
  open_cabinet: { where: "register", needs: ["register_key"], solve: ["unlock cabinet with key", "take ledger"], gives: ["ledger"], clues: ["cabinet", "register_key"],
    hints: ["The cabinet's keyhole is the size of the register key.", "Unlock the cabinet with the key, then take the ledger."] },
  press_41: { where: "panel", needs: ["ledger"], solve: ["push 41"], gives: ["horn_button"], clues: ["ledger", "b41", "venn"],
    hints: ["The ledger says where Coat 41's button went: into the wall.", "Push 41."] },
  get_thread: { where: "sorting", needs: [], solve: ["take spool"], gives: ["spool"], clues: ["venn", "spool"],
    hints: ["Mrs Venn has needles, and no thread. The thread went to the sorting room.", "Take the spool."] },
  sew_coat: { where: "mending", needs: ["horn_button", "spool"], solve: ["give horn button to venn"], gives: ["coat"], clues: ["venn", "coat"],
    hints: ["Mrs Venn will sew when she has the button and the thread.", "Give the horn button to Mrs Venn."] },
  go_out: { where: "lobby", needs: ["coat"], solve: ["open street door"], ending: true, clues: ["street_door", "coat"],
    hints: ["The sign says whole coats only.", "Open the street door, carrying the coat."] },
  press_all: { where: "engine", needs: [], solve: ["push big button"], ending: true, clues: ["big_button", "hobb"],
    hints: ["The big button's plate says ALL.", "Push the big button."] }
};

// ---- The change set ----------------------------------------------------------------------------------------------------
export default {
  because: "After the opening: the Button Office, where a coat is one button short.",
  opening,
  properties: {},
  facts: [
    "The player arrives in the lobby of the Button Office on a Friday evening to collect Coat 41, which is missing its fourth button.",
    "Coat 41's horn button was pressed into the wall at button 41; Mrs Venn holds the coat and needs thread from the sorting room.",
    "The street door opens only for a whole coat."
  ],
  effects: [
    { time: "day 1 17:40" },
    { set: "game.entrance", to: "lobby" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:50", weekday: "fri" },
      { say: "Brass on every wall, and a smell of warm metal." }
    ] },
    { add: "word", verb: "sew", words: ["sew", "stitch", "mend"], reply: "Mrs Venn does the sewing. Give her what she needs." },
    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
