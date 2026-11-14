// "A Light for the Galerie Aubry": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md only). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js?v=0.50.1";
import music, { rooms as roomMusic } from "./music.js?v=0.50.1";
import levels from "./levels.js?v=0.50.1";
import sprites from "./sprites.js?v=0.50.1";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "A Light for the Galerie Aubry",
  blurb: "A Paris gallery after closing, every frame wired to a bell. One painting, one cold lighthouse lens, and a night watchman with a weakness.",
  thumbnail: { picture: "lens_room", x: 40 },
  synopsis: "You are the hands of a Paris crew, sent in through a packing van's floor to take one painting from the Galerie " +
    "Aubry on the Quai Voltaire: a lighthouse at night, hung in a room that holds the lens from a real lighthouse. Every frame in " +
    "the building is wired to a bell, and a watchman walks the galleries. The picture is dark, and the lens is cold.",
  style: "dithered",
  palettes: "lamplight: the lamp- and gas-lit rooms (the van, the packing room, the vestibule, the cloakroom, the office, the landing); cellar: below stairs (the cellar); ember: the boiler room, by its fire; deepnight: the dark galleries and the lens room under its dome (the hall, the casts, the lens room); moonlight: the roof",
  genre: "heist caper, told as a thief's walk-through",
  strangeness: 1,
  size: "medium",
  ingredient: "a lighthouse lens",
  discarded: [
    "The Louvre and a famous portrait, with a smile.",
    "A masked ball, with the crew in borrowed costumes.",
    "A guard bought off with a purse of gold."
  ],
  stuff: ["bell-wire from every frame", "a watchman's rounds tally", "lamp oil in lens-works tins", "packing straw and wood-wool",
    "a speaking horn on a nail", "gas jets under the sea pictures", "a visitors' book", "a coal chute chained from the street"],
  tone: "A thief's walk-through, told clipped and dry: the narrator notices locks, habits, floors, who sleeps and who drinks, " +
    "and leaves out feeling. Short sentences, trade words, a conspirator's wry understatement. The one impossible thing is told " +
    "the way the rounds are told: as a fact of the building. Samples: \"The visitors' book holds one name tonight, in a very steady hand.\" " +
    "\"Every frame has a wire, and every wire has a bell, and the bells are the only staff who never sleep.\" " +
    "\"The painted lamp is dark. It is a courteous sort of dark, like a door held for someone.\"",
  rules: [
    "Every picture in the Galerie is wired to a bell, and a lifted frame rings every bell in the building.",
    "Gaspard the watchman drinks nothing on duty, and wants everything off it.",
    "The painted lighthouse lights its lamp only when the real lens is lit.",
    "The street doors are chained after the last visitor, and the way out is never the way in."
  ],
  opening: "A packing van backed against the Galerie's loading dock: a speaking horn on a nail (hints), a calling card you carry (why you are here), and the hatch in the floor, which opens down into the cellar.",
  music: "wry dorian; a plucked bell-wire, a reed speaking horn and the glass chime of a lens; a watch-clock ticking in a big quiet house",
  characters: ["Gaspard, the watchman", "Madame Lenoir, the voice in the horn"],
  endings: ["The bell: take the picture before the lens is lit.", "Carried: the canvas over the roofs and down a drainpipe.", "The keeper: turn the lit lens over Paris."],
  chaos: 0.1
};

const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
const endingPictures = {
  caught: { alt: "The Galerie's front steps from the street, lit red and white: every window blazing, a gendarme's lantern at the foot of the steps, and a long shadow thrown up the door.", picture: endings.caught },
  carried: { alt: "Paris roofs at dawn from far away: a thin figure on a ridge against a magenta sky, a roll of canvas under one arm, and behind it, high in a glass dome, a lens still burning.", picture: endings.carried },
  keeper: { alt: "Close up, the lit lens in its dome, a beehive of white and yellow rings, and a wide beam fanning out over rooftops under a black sky.", picture: endings.keeper }
};

// ---- Rooms ------------------------------------------------------------------------------------------------------------
// Area "van": the opening. Area "galerie": the cellar below (z -1), the ground floor, the landing and lens room (z 1), the roof (z 2).
const rooms = {
  cart: {
    name: "THE PACKING VAN", area: "van", at: [0, 0, 0],
    describe: [
      "A packing van, backed against the Galerie Aubry's loading dock, the tarpaulin laced down on every side. Straw underfoot, crates stacked to the roof, a lantern turned low.",
      "The only way on is the {hatch} in the floor, down into the cellar."
    ],
    exits: { d: true },
    scenery: [
      { words: ["straw"], name: "the straw", says: "Packing straw, and not clean: someone has slept in it." },
      { words: ["tarpaulin", "tarp"], name: "the tarpaulin", says: "Laced to the rail every hand's width. Nothing gets in or out that way." },
      { words: ["crates", "boxes"], name: "the crates", says: "Stacked and strapped, and stencilled for a firm that does not exist." },
      { words: ["lantern"], name: "the lantern", says: "Turned down to a bead. Madame Lenoir does not like light on a job." }
    ],
    ambience: { lines: ["Over your head a gas jet sputters, and settles.", "Boots cross the dock above you, and stop, and go on.", "The tarpaulin breathes in and out with the draught.", "A wheel passes in the street and does not stop."], every: [30, 70], chance: 0.8 },
    alt: "The inside of a covered van: crates stacked to the roof, straw on the floor, a low lantern, and a square hatch in the floor.",
    overlayAlt: { horn: "A brass speaking horn hanging on a nail." },
    mentions: []
  },
  cellar: {
    name: "CRATE CELLAR", area: "galerie", at: [0, 0, -1],
    describe: [
      "Brick vaults, blackened by gas and damp, and packing cases stencilled for Calais and Marseille. A watchman's {tally} is chalked by the stairs.",
      "Stairs climb to the vestibule. West is the packing room, east the boiler room."
    ],
    exits: { u: "vestibule", w: "packing_room", e: "boiler" },
    scenery: [
      { words: ["cases", "case", "crates"], name: "the cases", says: "Stencilled, nailed, and not yours." },
      { words: ["stairs", "stair"], name: "the stairs", leads: "u" },
      { words: ["vaults", "brick", "bricks"], name: "the vaults", says: "Old brick, sweating." }
    ],
    ambience: { lines: ["Water ticks somewhere in the brick.", "The floor above you creaks under a heavy, slow tread.", "A rat considers you and decides against."], every: [30, 70], chance: 0.8 },
    alt: "A brick cellar under the gallery: stacked packing cases, a stair going up, chalk marks on the wall, doorways to the west and east.",
    overlayAlt: {}
  },
  packing_room: {
    name: "PACKING ROOM", area: "galerie", at: [-1, 0, -1],
    describe: [
      "A bench scarred by crowbars, wood-wool in drifts, and a row of bare frames waiting to be wrapped. A {label} is tacked to the nearest.",
      "The cellar is east."
    ],
    exits: { e: "cellar" },
    scenery: [
      { words: ["bench", "crowbars"], name: "the bench", says: "Scarred pine. Someone has been prising lids here for forty years." },
      { words: ["wood-wool", "wool", "shavings"], name: "the wood-wool", says: "Soft, pale and everywhere." },
      { words: ["frames", "frame"], name: "the frames", says: "Bare gilt, wrapped in brown paper. Nothing in them." }
    ],
    ambience: { lines: ["Wood-wool shifts in a corner of its own accord, the way it does.", "A hammer hangs on a nail and does not swing.", "Something above you drags a chair, and thinks better of it."], every: [30, 70], chance: 0.8 },
    alt: "A packing room: a scarred bench, drifts of wood-wool, bare frames leaning on the wall, a paper label on the nearest.",
    overlayAlt: {}
  },
  boiler: {
    name: "BOILER ROOM", area: "galerie", at: [1, 0, -1],
    describe: [
      "An iron boiler banked for the night, ticking as it cools. A coal chute climbs into the dark, its shutter chained from the street.",
      "Tins stand on a shelf. The cellar is west."
    ],
    exits: { w: "cellar" },
    scenery: [
      { words: ["boiler"], name: "the boiler", says: "Warm iron. It has kept the pictures dry for years and has opinions about it." },
      { words: ["chute", "shutter", "coal"], name: "the coal chute", says: "Chained from the street side. Nobody leaves by it." },
      { words: ["tins", "tin", "shelf"], name: "the tins", says: "Lamp oil, boot black and something that says POISON in a cheerful hand." }
    ],
    ambience: { lines: ["The boiler ticks, and ticks, and then does not.", "Coal settles in the chute with a long sigh.", "A pipe knocks twice, as if it were a visitor."], every: [30, 70], chance: 0.8 },
    alt: "A boiler room: a squat iron boiler, a coal chute going up into darkness, and a shelf of tins.",
    overlayAlt: { oilcan: "A tin oil can on the shelf." }
  },
  vestibule: {
    name: "VESTIBULE", area: "galerie", at: [0, 0, 0],
    describe: [
      "Marble floor, a visitors' {book} open on its stand, and the street doors chained for the night.",
      "The great hall is north, the cloakroom east. Stairs go down to the cellar."
    ],
    exits: { n: "hall", e: "cloakroom", d: "cellar" },
    scenery: [
      { words: ["doors", "chain", "street"], name: "the street doors", says: "Chained on the inside, with a lock the size of a fist. The way out is not this way." },
      { words: ["marble", "floor"], name: "the marble", says: "Cold, white and cleaner than you." },
      { words: ["stairs", "stair"], name: "the stairs", leads: "d" }
    ],
    ambience: { lines: ["The chain on the street doors shifts against its lock.", "Gaslight breathes in the globes, and out.", "A carriage goes by outside and sends a shadow over the ceiling."], every: [30, 70], chance: 0.8 },
    alt: "A marble vestibule under gaslight: a visitors' book on a stand, chained street doors, a stair going down, doorways north and east.",
    overlayAlt: {}
  },
  cloakroom: {
    name: "CLOAKROOM", area: "galerie", at: [1, 0, 0],
    describe: [
      "Pegs, a counter with a brass bell, and one coat left hanging since the last visitor. Nobody has come back for it.",
      "The vestibule is west."
    ],
    exits: { w: "vestibule" },
    scenery: [
      { words: ["pegs", "peg"], name: "the pegs", says: "Empty, all but one." },
      { words: ["coat", "overcoat"], name: "the coat", says: "A heavy overcoat, a size too big for the peg. It smells of brandy, and of a man who thinks nobody looks in cloakrooms." },
      { words: ["counter", "bell"], name: "the counter", says: "A brass call-bell on a green baize. Nothing here needs it rung." }
    ],
    ambience: { lines: ["The coat sways on its peg when nobody has touched it.", "The call-bell hums, very faintly, to itself.", "A draught from the vestibule turns the ticket-rack."], every: [30, 70], chance: 0.8 },
    alt: "A cloakroom: a row of empty pegs, one heavy coat, and a counter with a brass bell.",
    overlayAlt: { flask: "A silver flask on the counter." }
  },
  hall: {
    name: "SALLE DES MARINES", area: "galerie", at: [0, -1, 0],
    describe: [
      "Sea pictures to the ceiling: storms, harbours, a drowned bell tower. Each frame has a gas jet beneath it and a fine {wire} from its corner up to a brass bell on the cornice.",
      "The vestibule is south, an office east, the watchman's gallery west. Stairs climb to the landing."
    ],
    exits: { s: "vestibule", e: "office", w: "west_gallery", u: "landing" },
    scenery: [
      { words: ["pictures", "frames", "picture", "storms", "harbours"], name: "the sea pictures", says: "Gilt frames, black water. Not what you came for, and every one of them listening." },
      { words: ["jets", "jet", "gas"], name: "the gas jets", says: "A row of small blue flames, one under each frame, turned low." },
      { words: ["stairs", "stair", "staircase"], name: "the stairs", leads: "u" }
    ],
    ambience: { lines: ["A gas jet gutters under a frame, and every bell on the cornice leans a little.", "Far off a floorboard answers a floorboard.", "The drowned bell tower in the nearest picture looks, for a moment, as if it has rung."], every: [30, 70], chance: 0.8 },
    alt: "A tall hall hung with sea pictures in gilt frames, a gas jet under each, a bell-wire running from every frame to the cornice; doorways and a stair.",
    overlayAlt: {}
  },
  office: {
    name: "THE OFFICE", area: "galerie", at: [1, -1, 0],
    describe: [
      "A small office: a roll-top desk, a green-shaded gas bracket, and Aubry's {ledger} open at the day's page.",
      "The hall is west."
    ],
    exits: { w: "hall" },
    scenery: [
      { words: ["desk", "roll-top", "drawers"], name: "the desk", says: "Locked, but only in the way a desk is locked at the end of a long day." },
      { words: ["bracket", "shade"], name: "the gas bracket", says: "A green glass shade, and the smell of a very careful old man." }
    ],
    ambience: { lines: ["The gas bracket hisses a very small note.", "A pen rolls a quarter turn on the blotter, though no one is near.", "The ledger's page lifts in a draught and falls back."], every: [30, 70], chance: 0.8 },
    alt: "A small office: a roll-top desk, a green-shaded gas bracket, an open ledger.",
    overlayAlt: { matches: "A box of matches by the gas bracket." }
  },
  west_gallery: {
    name: "THE CASTS", area: "galerie", at: [-1, -1, 0],
    describe: [
      "Plaster casts of gods and athletes stand pale under the jets, close enough to knock a shoulder against.",
      "The hall is east."
    ],
    exits: { e: "hall" },
    scenery: [
      { words: ["casts", "cast", "gods", "athletes", "plaster"], name: "the casts", says: "Plaster gods with plaster noses, and a faint smell of brandy among them." },
      { words: ["chair"], name: "the chair", says: "Bentwood, and dented to a particular shape." }
    ],
    ambience: { lines: ["A plaster athlete creaks, and it is only the chair.", "The rounds-clock on a strap ticks louder than it should.", "A long snore goes by, and is cut off by a long wake."], every: [30, 70], chance: 0.8 },
    alt: "A gallery of plaster casts of gods and athletes under gas jets, a watchman slumped on a bentwood chair among them.",
    overlayAlt: { lens_key: "A brass key lying on the floor." }
  },
  landing: {
    name: "THE LANDING", area: "galerie", at: [0, -1, 1],
    describe: [
      "A half-landing under a round window, the gas turned low. The stairs run back down.",
      "North, a heavy {door|lens_door} with a brass plate."
    ],
    exits: { d: "hall", n: "lens_room" },
    scenery: [
      { words: ["stairs", "stair"], name: "the stairs", leads: "d" },
      { words: ["plate", "brass"], name: "the plate", says: "LENS WORKS OF SAINT-OUEN: PHARES. The brass has been polished by someone who loves it." },
      { words: ["window"], name: "the round window", says: "Black glass, and a moon in it that is not hurrying." }
    ],
    ambience: { lines: ["The round window ticks as the night cools it.", "Below, a bell stirs on its wire and is still.", "The stairs creak under no one."], every: [30, 70], chance: 0.8 },
    alt: "A half-landing: a round window, a stair going down, and a heavy door to the north with a brass plate.",
    overlayAlt: {}
  },
  lens_room: {
    name: "SALLE DU PHARE", area: "galerie", at: [0, -2, 1],
    describe: [
      "Under a glass dome stands the great {lens}, a beehive of glass rings taller than you, its {lamp} cold inside. Facing it hangs a {painting}: a lighthouse on black rocks, a black sea, the painted lamp dark.",
      "South is the landing. An iron ladder climbs to the dome hatch."
    ],
    exits: { s: "landing", u: "roof" },
    scenery: [
      { words: ["dome", "glass"], name: "the dome", says: "Black glass in iron ribs, and the moon sitting in it." },
      { words: ["ladder", "hatch"], name: "the ladder", leads: "u" },
      { words: ["rocks", "sea", "lighthouse"], name: "the painted lighthouse", says: "Painted, and waiting." }
    ],
    ambience: { lines: ["The lens gives back a ring of the moon, one pane at a time.", "The iron ribs of the dome tick as they cool.", "In the painting something, at the edge of the paint, has not moved."], every: [30, 70], chance: 0.8 },
    alt: "A domed room: a great beehive lens of glass rings on a brass table, and on the north wall a painting of a lighthouse at night, its lamp dark.",
    overlayAlt: {}
  },
  roof: {
    name: "THE ROOF", area: "galerie", at: [0, -2, 2],
    describe: [
      "Zinc roofs and chimney pots under a low moon, Paris going away in every direction, the river a dull blade beyond. The dome hatch is below you.",
      "A {drainpipe} runs down the back wall to the alley."
    ],
    exits: { d: "lens_room" },
    scenery: [
      { words: ["roofs", "zinc", "pots", "chimney", "paris", "river"], name: "the roofs", says: "Zinc and smoke, and a river that has seen better thieves." },
      { words: ["hatch", "dome"], name: "the hatch", leads: "d" }
    ],
    ambience: { lines: ["A church clock strikes somewhere, a little behind the others.", "Pigeons shift on a ridge and settle.", "The zinc ticks as it gives back the day."], every: [30, 70], chance: 0.8 },
    alt: "A zinc roof under a low moon: chimney pots, a ridge of roofs going off, the river in the distance, and a drainpipe at the back wall.",
    overlayAlt: {}
  }
};

// ---- Objects ----------------------------------------------------------------------------------------------------------
const objects = {
  horn: {
    at: "cart", portable: true, material: "metal", name: "Speaking horn", note: "Murmuring.",
    here: "A brass speaking {horn} hangs on a nail by the tailboard, murmuring.",
    words: { nouns: ["horn"], adj: ["speaking", "brass"] }, ...item("horn"),
    examine: "A brass horn on a long tube that runs under the tarpaulin to somewhere warm. It listens, and sometimes it answers."
  },
  card: {
    at: "player", portable: true, material: "paper", name: "Calling card", note: "Cream and curled.",
    words: { nouns: ["card"], adj: ["calling"] }, ...item("card"),
    examine: "Aubry & Fils, Quai Voltaire. Come after the last visitor. On the back, in a quick hand: Bring patience. The picture likes the dark."
  },
  hatch: {
    at: "cart", name: "Hatch", note: "Down into the cellar.",
    words: { nouns: ["hatch", "trapdoor"], adj: [] },
    examine: "A square of planks with an iron ring, set in the van's floor. Under it is the cellar of the Galerie Aubry."
  },
  tally: {
    at: "cellar", name: "Tally", note: "Chalk strokes.",
    words: { nouns: ["tally"], adj: ["chalk", "watchman's"] },
    examine: "Strokes of chalk, five to a bar: the watchman's rounds. The last stroke is scored at the third bell, and after it there are none. Gaspard walks, and then Gaspard sits."
  },
  label: {
    at: "packing_room", name: "Label", note: "A clerk's hand.",
    words: { nouns: ["label", "tag"], adj: ["shipping"] },
    examine: "In a clerk's hand: LE DERNIER FEU, Salle du Phare, first floor. To be unhooked only once the lens is lit. The lens is never lit."
  },
  oilcan: {
    at: "boiler", portable: true, material: "metal", name: "Oil can", note: "Stencilled LENS.",
    here: "A tin {oil can|oilcan} stands among the tins on the shelf, stencilled for the Phare.",
    words: { nouns: ["can", "oilcan", "tin"], adj: ["oil"] }, ...item("oilcan"),
    examine: "Fine lamp oil, the kind that does not smoke. The tin is stencilled for the Phare, and it is not empty."
  },
  book: {
    at: "vestibule", name: "Visitors' book", note: "One name tonight.",
    words: { nouns: ["book"], adj: ["visitors'", "visitors"] },
    examine: "One name tonight, in a very steady hand: M. Lenoir, with regrets."
  },
  flask: {
    at: "cloakroom", portable: true, material: "metal", name: "Flask", note: "Silver, dented.",
    here: "A silver {flask} lies on the counter beside the bell, as if left to be found.",
    words: { nouns: ["flask"], adj: ["silver", "dented"] }, ...item("flask"),
    examine: "A dented silver flask, heavy with brandy. Gaspard's initials are on the cap, scratched with a pin."
  },
  wire: {
    at: "hall", name: "Bell-wire", note: "Every frame has one.",
    words: { nouns: ["wire", "wires"], adj: ["bell", "fine", "brass", "taut"] },
    examine: "Taut brass wire from each frame to its bell on the cornice. Lift a frame, and every bell in the building knows."
  },
  ledger: {
    at: "office", name: "Ledger", note: "Aubry's hand.",
    words: { nouns: ["ledger"], adj: ["aubry's"] },
    examine: "Aubry's hand: Hung the Dernier Feu at last. The lens first, always. Then let the picture say when. Keep Gaspard from the brandy."
  },
  matches: {
    at: "office", portable: true, material: "paper", name: "Matches", note: "A box, half full.",
    here: "A box of {matches} sits by the gas bracket.",
    words: { nouns: ["matches", "match", "matchbox", "box"], adj: [] }, ...item("matches"),
    examine: "A box of long matches, half full, with a ship on the lid. A lamp-lighter's matches."
  },
  gaspard: {
    at: "west_gallery", name: "Gaspard", note: "The watchman.", portrait: sprites.gaspard_portrait,
    here: "{Gaspard|gaspard} the watchman sits on a bentwood chair among the casts, a {key|lens_key} on a chain at his belt, awake in the way a man is awake who would rather not be.",
    words: { nouns: ["gaspard", "watchman", "man"], adj: ["old"], g: "m", proper: true },
    examine: "A thick, grey watchman in a dented kepi, with a rounds-clock on a strap. His nose is the colour of brandy. A brass key hangs on a chain at his belt.",
    topics: {
      who: { words: ["gaspard", "you", "who"], open: true, says: "\"Gaspard. I walk, I sit, I walk. Don't touch the pictures, monsieur. They tell on you.\"" },
      lens: { words: ["lens", "phare", "painting", "picture", "lamp"], open: true, says: "\"The old man's lens? Lit once, the day it came. The picture across from it lit its lamp too, all by itself. Since then, nobody lights it.\"" },
      brandy: { words: ["brandy", "drink", "flask", "coat"], open: true, says: "\"On duty? Never. Off duty, a little. I have an overcoat in the cloakroom that knows more than I do.\"" },
      key: { words: ["key", "chain"], open: true, says: "\"The lens room? On my belt, where I can feel it. A man who sleeps loses things.\"" },
      default: "\"I walk, monsieur, I sit. I don't know more than that.\""
    }
  },
  lens_key: {
    at: "gaspard", portable: true, material: "metal", name: "Brass key", note: "The lens room.",
    words: { nouns: ["key"], adj: ["brass", "lens"] }, ...item("lens_key"),
    examine: "A long brass key with a ring of glass set in its bow, the lens works' mark."
  },
  lens_door: {
    at: "landing", name: "Heavy door", note: "The Salle du Phare.", door: "n", material: "wood", locked: true,
    lock: { key: "lens_key", says: "The door is locked. The keyhole is Gaspard's size.", opens: "The key turns with a long, glassy click, and the heavy door swings back." },
    words: { nouns: ["door"], adj: ["heavy"] },
    examine: "Oak, bound in brass, and locked. The plate says the room beyond is the lens works' own."
  },
  lens: {
    at: "lens_room", name: "Lens", note: "A beehive of glass.",
    words: { nouns: ["lens", "rings", "prisms"], adj: ["great", "glass"] },
    examine: "Rings of glass in a brass cage, each ring a rung in a stair of light. Lit, it would throw a beam over every roof in Paris. It has stood cold since it came from Calais.",
    turn: "The lens turns on its bearing, a ring of dark glass sliding by after another. Cold glass throws nothing."
  },
  lamp: {
    at: "lens_room", name: "Lamp", note: "At the lens's heart.",
    words: { nouns: ["lamp", "burner", "wick", "tank"], adj: ["brass"] },
    examine: "A brass burner at the heart of the lens, bone dry. The tank wants oil, and the wick wants a flame."
  },
  painting: {
    at: "lens_room", name: "Painting", note: "Le Dernier Feu.",
    words: { nouns: ["painting", "picture", "frame"], adj: ["lighthouse"] },
    examine: "A lighthouse on black rocks, painted at night, its lamp dark. The sea is waiting for a light. A wire runs from the frame to a bell.",
    parts: [{ words: ["wire", "bell"], name: "the wire", says: "A brass wire from the frame's corner to a bell on the wall. Lift the frame, and the bell speaks." }]
  },
  canvas: {
    at: null, portable: true, material: "paper", name: "Rolled canvas", note: "Le Dernier Feu.",
    words: { nouns: ["canvas", "roll"], adj: ["rolled"] }, ...item("canvas"),
    examine: "The canvas, rolled in on itself, the painted sea inside. It is faintly warm, and the lamp in it is lit."
  },
  drainpipe: {
    at: "roof", name: "Drainpipe", note: "Down to the alley.",
    words: { nouns: ["drainpipe", "pipe"], adj: ["iron"] },
    examine: "A cast-iron pipe, bracketed to the back wall, running down into the dark of the alley. Its brackets are polished by use.",
  }
};

// ---- Rules ------------------------------------------------------------------------------------------------------------
const rules = [
  { id: "give_flask", match: { verb: "give", obj: "flask", obj2: "gaspard" }, if: [{ "gaspard.asleep": false }],
    do: [
      { set: "gaspard.asleep", to: true },
      { move: "flask", to: null },
      { move: "lens_key", to: "west_gallery" },
      { set: "gaspard.here", to: "{Gaspard|gaspard} the watchman sleeps on his bentwood chair among the casts, snoring in two keys, his chain empty." },
      { say: "Gaspard looks at the flask as a man looks at a letter from home. He drinks, and drinks, and his chin finds his chest. The key slides off its chain and rings once on the floor." }
    ] },
  { id: "gaspard_asleep", match: { verb: ["talk", "ask"], obj: "gaspard" }, if: [{ "gaspard.asleep": true }],
    do: [{ say: "He answers in a snore, and then, more politely, in another." }] },
  { id: "fill_lamp_with_can", match: { verb: ["put", "use", "fill"], obj: "oilcan", obj2: "lamp" }, if: [{ "oilcan.at": "player" }, { "player.at": "lens_room" }],
    do: [
      { set: "lamp.filled", to: true },
      { move: "oilcan", to: null },
      { say: "You tip the can into the tank. The oil goes in with a small, satisfied sound, and the wick drinks." }
    ] },
  { id: "fill_lamp", match: { verb: "fill", obj: "lamp" }, if: [{ "player.at": "lens_room" }, { "oilcan.at": "player" }],
    do: [
      { set: "lamp.filled", to: true },
      { move: "oilcan", to: null },
      { say: "You tip the can into the tank. The oil goes in with a small, satisfied sound, and the wick drinks." }
    ] },
  { id: "fill_lamp_empty", match: { verb: "fill", obj: "lamp" }, if: [{ "player.at": "lens_room" }],
    do: [{ say: "Nothing in your hands to fill it with. The tank wants lamp oil." }] },
  { id: "light_lamp_dry", match: { verb: "switch_on", obj: ["lamp", "lens"] }, if: [{ "player.at": "lens_room" }, { "lamp.filled": false }],
    do: [{ say: "You find the wick with a thumb. It is dry as a biscuit, and the tank is empty. It wants oil before it wants a flame." }] },
  { id: "light_lamp_nomatch", match: { verb: "switch_on", obj: ["lamp", "lens"] }, if: [{ "player.at": "lens_room" }, { "lamp.filled": true }, { "lamp.lit": false }, { "matches.at": { "!=": "player" } }],
    do: [{ say: "The wick is wet and ready. Nothing in your hands will light it." }] },
  { id: "light_lamp", match: { verb: "switch_on", obj: ["lamp", "lens"] }, if: [{ "player.at": "lens_room" }, { "lamp.filled": true }, { "lamp.lit": false }, { "matches.at": "player" }],
    do: [{ change: "light_lens" }] },
  { id: "light_lamp_with_matches", match: { verb: ["put", "use"], obj: "matches", obj2: ["lamp", "lens"] }, if: [{ "player.at": "lens_room" }, { "lamp.filled": true }, { "lamp.lit": false }, { "matches.at": "player" }],
    do: [{ change: "light_lens" }] },
  { id: "light_lamp_again", match: { verb: "switch_on", obj: ["lamp", "lens"] }, if: [{ "lamp.lit": true }],
    do: [{ say: "It is lit already, and in no mood to be lit twice." }] },
  { id: "take_painting_lit", match: { verb: ["take", "unhook"], obj: "painting" }, if: [{ "lamp.lit": true }, { "canvas.at": null }],
    do: [
      { move: "canvas", to: "player" },
      { set: "painting.examine", to: "An empty frame on its hook, the wire slack from it, the black rocks gone with the canvas." },
      { set: "lens_room.describe", to: [
        "Under a glass dome the great {lens} burns, a beehive of light, its {lamp} lit, its beam going up through the glass. Facing it, the {painting} hangs empty, its wire slack.",
        "South is the landing. An iron ladder climbs to the dome hatch."
      ] },
      { set: "lens_room.alt", to: "A domed room: a great beehive lens of glass rings burning white and yellow, and on the north wall an empty gilt frame with a slack wire." },
      { draw: "lens_room", restyle: [{ id: "paint_canvas", fill: 0 }, { id: "paint_lamp", fill: 0 }] },
      { say: "The frame lets go of the canvas as though it had been waiting to be asked. The wire stays slack. You roll the painted sea in on itself, a {canvas}, and it is warm." }
    ] },
  { id: "take_painting_dark", match: { verb: ["take", "unhook"], obj: "painting" }, if: [{ "lamp.lit": false }, { "canvas.at": null }],
    do: [
      { say: "The frame comes off its hook, and the wire goes tight, and every bell in the Galerie answers: the cornice, the hall, the cellar, the street. Gaspard comes awake. A whistle goes up outside. By the time you reach the landing, every window is lit." },
      { end: true, picture: "caught" }
    ] },
  { id: "turn_lens_lit", match: { verb: "turn", obj: "lens" }, if: [{ "lamp.lit": true }],
    do: [
      { say: "You put your shoulder to the lens. It swings, and the beam goes out of the dome and goes round Paris: roofs, river, a window with someone at it, a bridge. You keep it turning until the whistles reach the stairs, and you are still turning it, the keeper of a light nobody asked for." },
      { end: true, picture: "keeper" }
    ] },
  { id: "canvas_on_pipe", match: { verb: ["put", "tie", "drop", "throw", "lower", "use"], obj: "canvas", obj2: "drainpipe" }, if: [{ "canvas.at": "player" }],
    do: [
      { say: "The pipe won't carry it for you, so you roll the canvas under your coat and go down the pipe with it. In the alley a van waits under its tarpaulin, and a horn on a nail says, very quietly, \"Well.\" Behind you, high in the dome, the lens is still burning, and nobody in Paris has asked why." },
      { end: true, picture: "carried" }] },
  { id: "climb_pipe_empty", match: { verb: ["climb", "enter", "use"], obj: "drainpipe" }, if: [{ "canvas.at": { "!=": "player" } }],
    do: [{ say: "You lay a hand on the pipe, and stop. You came for the picture." }] },
  { id: "climb_pipe", match: { verb: ["climb", "enter", "use"], obj: "drainpipe" }, if: [{ "canvas.at": "player" }],
    do: [
      { say: "You go down the pipe with the canvas rolled under your coat. In the alley a van waits under its tarpaulin, and a horn on a nail says, very quietly, \"Well.\" Behind you, high in the dome, the lens is still burning, and nobody in Paris has asked why." },
      { end: true, picture: "carried" }
    ] }
];

// ---- Changes ----------------------------------------------------------------------------------------------------------
const changes = {
  light_lens: [
    { set: "lamp.lit", to: true },
    { move: "matches", to: null },
    { set: "lamp.examine", to: "A brass burner at the heart of the lens, burning clean and tall." },
    { set: "lens.examine", to: "Rings of glass in a brass cage, each ring a rung in a stair of light, burning. The beam goes up through the dome. Turned, it would sweep every roof in Paris." },
    { set: "painting.examine", to: "A lighthouse on black rocks, painted at night, and its painted lamp lit. A painted beam has crossed the painted sea once, and stopped. The wire from the frame to the bell hangs slack." },
    { set: "lens_room.describe", to: [
      "Under a glass dome the great {lens} burns, a beehive of light, its {lamp} lit, its beam going up through the glass. Facing it hangs a {painting}: a lighthouse on black rocks, its painted lamp lit, a painted beam lying across the sea.",
      "The frame's wire hangs slack. South is the landing. An iron ladder climbs to the dome hatch."
    ] },
    { set: "lens_room.alt", to: "A domed room: a great beehive lens of glass rings burning white and yellow, and on the north wall a painting of a lighthouse at night, its painted lamp lit and a pale beam across the black sea." },
    { draw: "lens_room", restyle: [{ id: "lens_flame", fill: 14 }, { id: "paint_lamp", fill: 14 }, { id: "paint_beam", fill: 14 }, { id: "lens_core", fill: 15 }] },
    { say: "The wick takes the flame and the lens wakes ring by ring, white, then yellow. In the painting the painted lamp lights too, and its painted beam crosses the painted sea once, slowly, and stops. The wire from the frame goes slack." }
  ]
};

// ---- Puzzles ----------------------------------------------------------------------------------------------------------
const puzzles = {
  get_flask: { where: "cloakroom", needs: [], solve: ["take flask"], gives: ["flask"], clues: ["flask", "gaspard"],
    hints: ["Gaspard's brandy has to be somewhere he thinks nobody looks.", "Take the flask from the cloakroom, east of the vestibule."] },
  get_oil: { where: "boiler", needs: [], solve: ["take oil can"], gives: ["oilcan"], clues: ["oilcan", "lamp"],
    hints: ["A lens needs lamp oil, and a boiler room keeps tins.", "Take the oil can from the boiler room, east of the cellar."] },
  get_matches: { where: "office", needs: [], solve: ["take matches"], gives: ["matches"], clues: ["matches", "lamp"],
    hints: ["A desk keeps matches for the gas bracket.", "Take the matches from the office, east of the great hall."] },
  sleep_gaspard: { where: "west_gallery", needs: ["flask"], solve: ["give flask to gaspard", "take key"], gives: ["lens_key"], clues: ["gaspard", "flask", "lens_door", "tally"],
    hints: ["The watchman keeps the lens room's key on his belt, and he would sooner have a drink.", "Give him the flask, then take the key from the floor."] },
  free_painting: { where: "lens_room", needs: ["oilcan", "matches", "lens_key"], solve: ["put oil can in lamp", "light lamp", "take painting"], gives: ["canvas"], clues: ["ledger", "label", "painting", "lens"],
    hints: ["The ledger says the lens first, then let the picture say when.", "Fill the lamp with oil, light it with a match, then take the painting."] },
  caught: { where: "lens_room", needs: ["lens_key"], solve: ["take painting"], ending: true, clues: ["wire", "painting", "label"],
    hints: ["Every frame has a wire, and every wire has a bell.", "Take the painting while the lens is dark, and every bell rings."] },
  carried: { where: "roof", needs: ["canvas"], solve: ["go up", "climb pipe"], ending: true, clues: ["drainpipe", "canvas"],
    hints: ["The roof has a drainpipe, and an alley behind it.", "With the canvas, go up the ladder and climb the drainpipe."] },
  keeper: { where: "lens_room", needs: ["oilcan", "matches", "lens_key"], solve: ["put oil can in lamp", "light lamp", "turn lens"], ending: true, clues: ["lens", "lamp"],
    hints: ["A lit lens can be turned.", "Light the lens and turn it."] }
};

// ---- The opening, declared (BRIEF.md §3) ------------------------------------------------------------------------------
const opening = {
  room: "cart", hints: "horn", intro: "card", way: "hatch",
  lines: {
    notYet: "The hatch stays down. Madame Lenoir's horn is still murmuring on its nail, and you do not go anywhere without hearing her out.",
    through: "You lift the hatch and drop through into the smell of the cellar. It settles shut over you without a sound.",
    hintFrame: "The horn crackles, and Madame Lenoir says:",
    farewell: "The card goes into the lantern flame and is smoke before you can read it twice."
  }
};

// ---- The change set ---------------------------------------------------------------------------------------------------
export default {
  because: "After the opening: the Galerie Aubry by night, one painting and one cold lens.",
  opening,
  facts: [
    "The player arrives in the Galerie Aubry's cellar, Quai Voltaire, Paris, at half past eleven at night.",
    "Every picture is wired to a bell; lifting a frame rings them all.",
    "The painted lighthouse in Le Dernier Feu lights its lamp only when the real lens in the same room is lit.",
    "Gaspard the watchman keeps the lens room key on his belt and drinks nothing on duty."
  ],
  properties: {
    "lamp.filled": { type: "boolean", start: false },
    "lamp.lit": { type: "boolean", start: false },
    "gaspard.asleep": { type: "boolean", start: false }
  },
  effects: [
    { time: "day 1 23:20", weekday: "fri" },
    { set: "game.entrance", to: "cellar" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 23:30", weekday: "fri" },
      { say: "Above you the Galerie Aubry ticks and settles, like a clock that has been told a secret." }
    ] },
    { add: "word", verb: "fill", words: ["fill", "pour", "top up", "refill"], reply: "There is nothing here to fill." },
    { add: "word", verb: "unhook", words: ["unhook"], reply: "Nothing here comes off a hook." },
    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
