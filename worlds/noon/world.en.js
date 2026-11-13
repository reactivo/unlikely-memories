// "The River Turns at Noon": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md only). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings } from "./pictures.js?v=0.48.3";
import music, { rooms as roomMusic } from "./music.js?v=0.48.3";
import levels from "./levels.js?v=0.48.3";
import sprites from "./sprites.js?v=0.48.3";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The River Turns at Noon",
  blurb: "1871, the Upper Ketari. The river turns at noon, a temple eats only what the river gave it, and the Society wants a gold bell that has lost its tongue.",
  thumbnail: { picture: "gorge", x: 40 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  style: "flat",
  synopsis: "You are a British explorer on the Upper Ketari in 1871, sent by the Society to find what the river keeps. " +
    "The river runs up the valley for one hour after noon, the people of the village keep their accounts in knotted cord, and in a " +
    "temple across a gorge hangs a gold bell that has been silent since its tongue went missing. Everyone has managed without noon. " +
    "The Society would like the bell.",
  tone: "A field report in the second person: dry, exact and a little formal, a clerk's eye in the green. The narrator notices " +
    "weights, hours, who owes whom, and the small manners of animals; it leaves out wonder, fear and the explorer's feelings, and " +
    "never explains the river. Short plain sentences, then a longer wry one. The people of the valley are not impressed, and are " +
    "right. Sample lines: \"The rain stops as you step out, politely, as if it had been waiting for you to be ready.\" / " +
    "\"The jaguar is thin, and has noticed that you are not.\" / \"Noon has been quiet in the valley since the bell lost its tongue. Everyone has managed.\"",
  start: "Tuesday, 06:10, on the landing (the opening, in the tent, at 05:40).",
  opening: "A canvas tent on a mud bank, in the rain: a parrot in a cage that reads your journal aloud (hints), the Society's letter " +
    "you already carry (why you came). The tent flap, tied half back on the wet green, is the way on.",
  music: "slow in-mode river music, far away and under water; a cane flute, a log drum and a plucked tally cord; a bell that never sounds",
  rules: [
    "The river runs up the valley for the hour after noon, and carries whatever floats on it.",
    "A gift is a debt, and the village keeps every debt on a knotted cord; nobody is thanked for nothing.",
    "The temple's gate eats only what the river gave it, and what it is given it counts.",
    "Noon has been quiet since the bell in the temple lost its tongue; the river turns anyway, out of habit."
  ],
  characters: ["Ennu, who keeps the village accounts", "Kito, who makes paddles", "the old jaguar in the fig"],
  places: ["a tent on a mud bank", "the landing", "the village", "the trail", "the strangler fig", "the gorge and its rope bridge", "the temple steps", "the court", "the bell chamber"],
  endings: [
    "Rung: fit the stone tongue and ring the bell at noon; the river turns because it was told to.",
    "Carried: take the bell away; the river never turns again.",
    "Fell: cross the rotten bridge."
  ],
  chaos: 0.1
};

// Carried things get their sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id] });

// ---- The ending pictures ---------------------------------------------------------------------------------------------------
const endingPictures = {
  rung: { alt: "A wide bright river at noon with silver fish leaping upstream, all in the same direction, under a pale sky.", picture: endings.rung },
  carried: { alt: "A dugout canoe low on a brown river at sunset, going down to the sea, a small gold shape in its middle.", picture: endings.carried },
  fell: { alt: "A narrow gorge in white spray, a rope bridge with missing planks high above, and one grey plank falling.", picture: endings.fell },
  died: { alt: "A pith helmet floating on a magenta river at dusk, drifting down towards the sea.", picture: endings.died }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "camp": the opening, never returned to; it faces north, out of the flap. Area "bank": the landing, the trail north of it, the
// fig further north, the gorge east of the trail. Area "village": west of the landing. Area "temple", across the gorge, reached by
// the river at noon: the steps, the court north of them, the bell chamber north of that. Every picture faces north.
const rooms = {
  bivouac: {
    name: "THE TENT", area: "camp", at: [0, 0, 0],
    describe: [
      "A canvas tent on a mud bank, shut up against the morning. Rain taps the roof like a clerk with a pencil, and everything that can go green has.",
      "The cot is made, the boots stand by it, and a lantern hangs from the ridge pole. The only way out is the {flap}, tied half back on grey light and wet leaves."
    ],
    exits: { n: true },
    scenery: [
      { words: ["cot", "bed", "blanket", "net"], name: "the cot", says: "Made with a precision the rest of the camp gave up some weeks ago." },
      { words: ["boots", "boot"], name: "the boots", says: "Two boots side by side, each holding last night's rain." },
      { words: ["lantern", "lamp", "pole", "ridge"], name: "the lantern", says: "A hurricane lantern with a short flame, burning for want of anyone to put it out." },
      { words: ["canvas", "roof", "walls", "wall", "rain"], name: "the canvas", says: "The rain keeps a steady, official time on it." },
      { words: ["chest", "trunk"], name: "the chest", says: "The expedition chest, stencilled with the Society's initials and a good deal of mud." }
    ],
    ambience: { lines: [
      "A drop finds the one thin place in the canvas and lands on your boot, as it did all night.",
      "Something in the roof sighs, wetly, and goes back to sleep.",
      "The rain pauses for a count of ten, to see whether you are listening, and then goes on."
    ], every: [30, 60], chance: 0.7 },
    alt: "The inside of a canvas tent in the rain: a made cot, a lantern, a chest, and the flap open on wet green leaves.",
    overlayAlt: { parrot: "A grey parrot in a wicker cage on the chest." },
    picture: pictures.bivouac,
    ...(roomMusic.bivouac ? { music: roomMusic.bivouac } : {})
  },

  landing: {
    name: "THE LANDING", area: "bank", at: [0, 0, 0],
    describe: [
      "A bank of grey mud where the river bends, where the expedition tied up and stopped expecting anything. The {canoe} lies half out of the water beside the Society's {crate}, which has been rained on in three languages.",
      "The river runs down to the sea, brown and in no hurry. A trail climbs into the green to the north, and smoke rises from the village to the west."
    ],
    exits: { n: "trail", w: "village" },
    scenery: [
      { words: ["river", "water", "current", "weed"], name: "the river", says: "Brown water the width of a street. A line of weed on the bank shows that it runs both ways, which is the sort of thing you write down and then cross out." },
      { words: ["mud", "bank", "bend"], name: "the mud", says: "Grey, soft and honest. It keeps every footprint, and the footprints say who has been here: you, and a great many fish." },
      { words: ["trail", "forest", "jungle", "green", "trees"], name: "the forest", says: "A green wall with one gap in it. It has not yet been introduced." },
      { words: ["smoke", "sea"], name: "the smoke", says: "A grey thread over the trees to the west, going up as if it had been told the way." }
    ],
    waitFor: { time: "next 12:00", says: "You sit on the bank and watch the river keep its morning. It does not hurry. Neither, in the end, does noon.", if: [{ "time.hour": { between: [0, 12] } }] },
    ambience: { lines: [
      "A fish turns over in the shallows and looks, for an instant, as if it had a question.",
      "The canoe knocks once against the mud, like a man at a door who does not expect an answer.",
      "A heron lifts off the far bank, and the river carries its reflection a long way after it."
    ], every: [35, 80], chance: 0.7 },
    alt: "A grey mud bank on a brown river in the early sun: a dugout canoe half out of the water, a packing crate beside it, and the green forest behind.",
    overlayAlt: { fish: "A grey fish lying on the mud by the canoe." },
    picture: pictures.landing
  },

  village: {
    name: "THE VILLAGE", area: "village", at: [0, 0, 0],
    describe: [
      "Eleven houses on stilts, thatched to the ground, round a yard of beaten earth. Fish dry on racks over a low fire, and the smoke goes where it likes.",
      "A path leads east, back to the landing."
    ],
    exits: { e: "landing" },
    scenery: [
      { words: ["houses", "house", "thatch", "stilts", "roofs"], name: "the houses", says: "Eleven, each on its own stilts, each with a ladder pulled up for the night and not yet put down." },
      { words: ["fish", "racks", "rack"], name: "the racks", says: "Fish in rows, split and smoked. They are counted every morning, and nobody has ever found one missing." },
      { words: ["paddles", "blades"], name: "the paddles", says: "Bone-bladed paddles of every size, leaning ready against the house. Kito made them all, and can tell them apart by their faults." },
      { words: ["fire", "smoke", "yard", "earth"], name: "the fire", says: "A low fire, tended by whoever is nearest, and swept round every hour as if it were a guest." }
    ],
    ambience: { lines: [
      "Somewhere a child is told, firmly, not to, and does not.",
      "A pot knocks twice against stone, and a house answers with a cough.",
      "The smoke changes its mind about the roofs, and goes the other way."
    ], every: [30, 70], chance: 0.7 },
    alt: "A village yard under thatched houses on stilts: fish drying on racks over a low fire, an old woman sitting with a cord, a man at a paddle.",
    picture: pictures.village,
    ...(roomMusic.village ? { music: roomMusic.village } : {})
  },

  trail: {
    name: "THE TRAIL", area: "bank", at: [0, -1, 0],
    describe: [
      "The trail climbs from the river between trunks too wide to see round. Toucans argue overhead, and the ground is a soft green rot that keeps every footprint, yours and one much larger.",
      "A carved {post} stands at the fork. The landing is south, the fig is north, and a gap in the leaves to the east lets in the sound of a gorge."
    ],
    exits: { s: "landing", n: "fig", e: "gorge" },
    scenery: [
      { words: ["toucans", "toucan"], name: "the toucans", says: "Three of them, black and orange, quarrelling over a fig as though it were the last, which it is not." },
      { words: ["footprints", "footprint", "prints", "print", "tracks"], name: "the footprints", says: "Yours, small and boot-shaped. And going north, one set as wide as a dinner plate, each print holding its own little pool." },
      { words: ["trunks", "trunk", "trees", "leaves", "rot", "ground"], name: "the forest", says: "Green on green, damp to the touch. Nothing in it is in a hurry, except what is eating something." },
      { words: ["monkeys", "monkey", "troop"], name: "the monkeys", says: "A troop crosses overhead without apology, and a small one looks down to see whether you have noticed." },
      { words: ["gap", "gorge", "sound"], name: "the gap", says: "A gap in the leaves, and beyond it a noise like a great many people washing." }
    ],
    ambience: { lines: [
      "A nut drops on the path and lies there, watching you not take it.",
      "Overhead, the monkeys go by in order of rank, and the smallest looks back.",
      "Something large, a long way north, turns over with the sound of a heavy sack settling."
    ], every: [30, 70], chance: 0.7 },
    alt: "A jungle trail between huge trunks: a carved post at a fork, big paw prints in the green mud, light coming down in pale shafts.",
    picture: pictures.trail
  },

  fig: {
    name: "THE FIG", area: "bank", at: [0, -2, 0],
    describe: [
      "A strangler fig has taken a dead tree and kept its shape. The roots make rooms, and in the largest the air is warm and smells of cat.",
      "A {jaguar} lies along the lowest limb, thin as a hawser, with one eye on you. The trail is south."
    ],
    exits: { s: "trail" },
    scenery: [
      { words: ["fig", "tree", "roots", "root", "rooms", "room"], name: "the fig", says: "Roots as thick as a man, folded round the dead tree like hands round a cup. The tree is still in there, and has not been told." },
      { words: ["limb", "branch", "cord", "leather"], name: "the limb", says: "A grey branch worn smooth along its top by something that has lain there a long time." }
    ],
    ambience: { lines: [
      "A single hair of light moves across the floor of roots and is gone.",
      "The cat breathes in, very slowly, and the whole fig waits for her to finish.",
      "Far overhead a branch ticks, as wood does when it has decided something."
    ], every: [30, 60], chance: 0.7 },
    alt: "The hollow inside a strangler fig: a thin jaguar lying along a limb, a long grey stone hanging beside her, a shaft of light on the roots.",
    overlayAlt: { clapper: "A long grey stone hanging on a cord from the limb." },
    picture: pictures.fig
  },

  gorge: {
    name: "THE GORGE", area: "bank", at: [1, -1, 0],
    describe: [
      "The forest stops at the lip of a gorge as if it had been told to. You look east: far below, white water; far across, grey steps climb out of the trees to a temple.",
      "A rope {bridge} crosses to it, its planks grey as bone, three of them gone, the ropes frayed to what ropes are made of. The trail is west."
    ],
    exits: { w: "trail", e: true },
    scenery: [
      { words: ["gorge", "water", "spray", "falls", "river", "drop"], name: "the gorge", says: "A long way down, the river goes white and loud, and the sound arrives a moment after the sight of it." },
      { words: ["temple", "steps", "stone", "trees"], name: "the temple", says: "A stepped grey front, green at the edges, the stairs going down into the water at its foot. It is nearer than it is, and further than the bridge admits." }
    ],
    ambience: { lines: [
      "The ropes hum a single note in the wind and drop it.",
      "Far across, a plank lets go and takes a long time to arrive.",
      "A cloud of spray comes up the cliff, looks at you, and goes down again."
    ], every: [30, 60], chance: 0.7 },
    alt: "A deep gorge with white water far below, a frayed rope bridge across it with planks missing, and a grey stepped temple among trees on the far side.",
    picture: pictures.gorge
  },

  steps: {
    name: "THE STEPS", area: "temple", at: [0, 0, 0],
    describe: [
      "The river, running the wrong way, has put you down at the foot of a long flight of grey steps, green with a thousand years of being left alone. A stone figure sits on every tenth step, facing the water.",
      "At the top, a {gate} like a wide stone mouth. Your {canoe|canoe_up} waits at the water's edge, ready to go back when the river does."
    ],
    exits: { n: "court" },
    scenery: [
      { words: ["steps", "step", "stairs", "flight"], name: "the steps", says: "Wide, shallow and slick, cut for people who were in no hurry and expected to arrive." },
      { words: ["figures", "figure", "statues", "statue"], name: "the figures", says: "Squat stone shapes with their hands on their knees, all facing the river, as if waiting for it to say something." },
      { words: ["river", "water", "edge", "bank"], name: "the river", says: "The same brown river, here running up the valley with an air of knowing the way." }
    ],
    waitFor: { time: "next 13:00", says: "You sit on a stone knee and wait. The river holds its place for you, and at one o'clock lets go.", if: [{ "time.hour": { between: [12, 13] } }] },
    ambience: { lines: [
      "A leaf goes by on the water, upstream, with the air of a leaf that has been there before.",
      "One of the stone figures has, you would swear, moved its hand from one knee to the other.",
      "The steps drip, on a count, like a clock that has stopped trying to be useful."
    ], every: [30, 60], chance: 0.7 },
    alt: "A flight of mossy grey steps rising from a river into trees, stone figures on the steps, and a great stone gate like a frog's mouth at the top.",
    picture: pictures.steps
  },

  court: {
    name: "THE COURT", area: "temple", at: [0, -1, 0],
    describe: [
      "A court of flagstones with grass in every joint. Daylight falls straight down through a round hole in the roof, onto a stone {basin} that holds a hand of rainwater and not one leaf.",
      "A {frieze} runs along the wall, and a low passage leads north into the dark. The steps are back south."
    ],
    exits: { s: "steps", n: "chamber" },
    scenery: [
      { words: ["flagstones", "flagstone", "floor", "grass", "joints", "court"], name: "the flagstones", says: "Big grey slabs, each with a green seam. Nobody has swept here, and nothing has been dropped." },
      { words: ["hole", "roof", "light", "daylight", "shaft", "sky"], name: "the hole", says: "A round hole the size of a cartwheel, with a circle of sky in it. The light comes down like a plumb line." },
      { words: ["passage", "dark"], name: "the passage", says: "Low, square and black. The air that comes out of it is cold and smells of old coins." }
    ],
    ambience: { lines: [
      "A leaf comes down the shaft of light and is not allowed into the basin.",
      "Water drips somewhere in the dark, on a count that never quite comes out.",
      "The light on the flagstones shifts a hand's breadth, as though it had been told something."
    ], every: [30, 60], chance: 0.7 },
    alt: "A flagstone court under a round hole in the roof, a shaft of light on a stone basin, and a carved frieze along the wall.",
    picture: pictures.court
  },

  chamber: {
    name: "THE BELL CHAMBER", area: "temple", at: [0, -2, 0],
    describe: [
      "A square chamber with a hole in its roof, and no floor but a stone walk round a {pool} of black water. Two eyes sit on the water as two stones would, if stones watched.",
      "Over the pool, from a beam, hangs the {bell}: gold, the size of a bread oven, its mouth open and empty. The walk runs back south."
    ],
    exits: { s: "court" },
    scenery: [
      { words: ["eyes", "eye"], name: "the eyes", says: "Two pale knobs on the black water, level, patient, and not stones." },
      { words: ["walk", "walkway", "stone", "floor"], name: "the walk", says: "A ledge of grey stone a foot wide, going round the pool, polished by a great many people being careful." },
      { words: ["beam", "roof", "hole", "light", "shaft"], name: "the beam", says: "A black beam as thick as a mast, and below the hole in the roof a column of noon-coloured light, which falls on the bell and goes no further." }
    ],
    waitFor: { time: "next 12:00", says: "You stand on the walk and wait. The light in the roof climbs the wall, and goes quiet at the top.", if: [{ "time.hour": { between: [13, 12] } }] },
    ambience: { lines: [
      "The black water moves once, at the far edge, and the eyes do not.",
      "The bell shivers, by itself, in a draught that does not reach you.",
      "A drop falls from the beam into the pool, and the ripple goes out and meets nothing."
    ], every: [30, 60], chance: 0.7 },
    alt: "A square stone chamber with a pool of black water, two eyes on its surface, and a great gold bell hanging from a beam in a shaft of light.",
    picture: pictures.chamber,
    ...(roomMusic.chamber ? { music: roomMusic.chamber } : {})
  }
};

// ---- Objects ---------------------------------------------------------------------------------------------------------
const objects = {
  // The opening
  parrot: { at: "bivouac", portable: true, material: "wood", name: "Parrot", note: "Reads your journal aloud.",
    here: "A {parrot} sits in its cage on the chest, reading your journal aloud to nobody and getting the dates wrong.",
    words: { nouns: ["parrot", "bird", "cage"], adj: [] },
    examine: "A grey parrot with a red tail, in a wicker cage, who has been through the whole journal and has opinions. When it is quiet enough to listen, it tells you what you wrote.",
    ...item("parrot") },
  letter: { at: "player", portable: true, material: "paper", name: "Letter", note: "The Society's orders.",
    words: { nouns: ["letter", "orders"], adj: [] },
    examine: "The Society's letter, Latin at the top and plain at the bottom: \"Find what the river keeps. Return with it, or with a reason.\" It is signed by a secretary, in ink that has never been wet.",
    ...item("letter") },
  flap: { at: "bivouac", name: "Tent flap", note: "Tied half back.",
    words: { nouns: ["flap"], adj: ["tent"] },
    examine: "The tent flap, tied half back with a bootlace. Beyond it the bank is grey mud and the forest is a green wall that has not yet been introduced." },

  // The landing
  canoe: { at: "landing", enterable: "in", name: "Canoe", note: "Black with use.",
    words: { nouns: ["canoe", "boat", "dugout"], adj: [] },
    enter: "You step into the canoe. It settles, and points both ways at once.",
    examine: "A dugout, black with use, pointed at both ends so that it never has to decide which way it is going. The gunwale is worn pale in two places, one for each direction." },
  crate: { at: "landing", container: true, material: "wood", name: "Crate", note: "The Society's stores.",
    words: { nouns: ["crate", "box", "case"], adj: ["society's", "packing"] },
    examine: "A packing crate stencilled STORES - THIS WAY UP, lying on its side, so that the stencil is hopeful. The lid is not nailed. A list pasted inside says {hooks} and {salt}, in that order of use." },
  hooks: { at: "crate", portable: true, material: "metal", name: "Fishhooks", note: "Brass, forty of them.",
    words: { nouns: ["hooks", "hook", "fishhooks"], adj: ["brass", "fish"] },
    examine: "Forty brass fishhooks in oiled paper, the kind the Society sends to people who have fish. Brass, in this valley, is better than bone, and everyone knows it.",
    ...item("hooks") },
  salt: { at: "crate", portable: true, material: "soft", name: "Salt", note: "A cloth bag.",
    words: { nouns: ["salt", "bag"], adj: ["cloth"] },
    examine: "A cloth bag of white salt, the good sort, which in this valley is a kind of money, or an insult, depending on who is holding it.",
    ...item("salt") },
  fish: { at: "landing", portable: true, material: "soft", name: "Fish", note: "Going stiff.",
    here: "A grey {fish} lies on the mud by the canoe, as long as a forearm and going nowhere.",
    words: { nouns: ["fish"], adj: ["grey", "river"] },
    examine: "A river fish the length of your forearm, going stiff. The people of the village leave one at the fig for the old cat, in the years when she is thin.",
    ...item("fish") },

  // The village
  ennu: { at: "village", name: "Ennu", note: "Keeps the accounts.", material: "soft", portrait: sprites.ennu_portrait,
    here: "{Ennu|ennu}, who keeps the village accounts, sits at the middle house with a cord of knots across her knees, and is not surprised by you.",
    words: { nouns: ["ennu", "woman", "elder"], adj: ["old"], g: "f", proper: true },
    parts: [{ words: ["cord", "knots", "accounts"], name: "the cord", says: "Rows of knots in three colours, each row an account. You are on it, towards the end of a long one." }],
    examine: "Ennu is old and straight-backed, with a face like a well-kept map. She has been keeping the village accounts since before the Society had a letterhead.",
    give: "\"We will see what that comes to,\" says Ennu, and gives it back, as a clerk returns a form.",
    talk: "\"You are on the cord,\" says Ennu. \"Ask.\"",
    topics: {
      river: { words: ["river", "noon", "turn", "turns", "current", "water"], open: true, label: "the river",
        says: "\"It turns at noon, for an hour, and runs up the valley,\" says Ennu. \"Everything afloat goes with it. At one it remembers the sea.\"" },
      temple: { words: ["temple", "gate", "guest", "shell", "frog", "steps"], open: true, label: "the temple",
        says: "\"The gate is a frog, and a frog eats only what the river gave it,\" says Ennu. \"A guest is given a shell, and the shell is counted. Guests are counted in salt. Yours is good salt, better than ours, which is not a compliment to the salt.\"" },
      bell: { words: ["bell", "gold", "tongue", "clapper", "quiet"], open: true, label: "the bell",
        says: "\"It has hung without its tongue since my grandmother's time,\" says Ennu. \"Noon is quiet. We have managed. The tongue went up the trail in the arms of one of your people, long ago, who met the cat. The cat has it still.\"" },
      default: "\"That is not on the cord,\" says Ennu. \"Ask me something that is.\""
    } },
  kito: { at: "village", name: "Kito", note: "Shapes paddles.", material: "soft", portrait: sprites.kito_portrait,
    here: "{Kito|kito} is shaping a paddle blade at the next house, and looks at your empty hands before he looks at you.",
    words: { nouns: ["kito", "man", "boy"], adj: ["young"], g: "m", proper: true },
    examine: "Kito is young, long-armed and unhurried, with a knife and a half-made blade. He has made every paddle in the village, and has opinions about every one.",
    give: "\"Not that,\" says Kito, and hands it back. \"The other thing.\"",
    talk: "\"The canoe is yours for the asking,\" says Kito. \"The paddle is not.\"",
    topics: {
      paddle: { words: ["paddle", "paddles", "canoe", "blade"], open: true, label: "a paddle",
        says: "\"The canoe wants a paddle, and a paddle wants a hook,\" says Kito. \"Not ours. Ours are bone, and the fish know it. The brass ones, from your box.\" He turns the blade in his hands and does not offer it yet." },
      bridge: { words: ["bridge", "gorge", "rope", "ropes"], open: true, label: "the bridge",
        says: "\"Nobody crosses the rope bridge,\" says Kito. \"It was made by people who knew about weight, and it has been forgetting them for a hundred years. The river is the road. Ask Ennu what hour.\"" },
      cat: { words: ["cat", "jaguar", "fig", "trail", "tree"], open: true, label: "the cat",
        says: "\"The old cat in the fig is thin this year,\" says Kito. \"The fish run late. She does not mind what she is not hungry for.\"" },
      default: "\"Ask Ennu,\" says Kito. \"It will be on her cord.\""
    } },
  paddle: { at: null, from: "kito", requires: "hooks", spends: true, portable: true, material: "wood", name: "Paddle", note: "Pale from the knife.",
    brought: "Kito takes the hooks, counts them without looking, and hands you a {paddle} still pale from the knife.",
    again: "\"One paddle,\" says Kito. \"That was the arrangement.\"",
    lacking: "\"Hooks,\" says Kito. \"Brass. From your box.\"",
    words: { nouns: ["paddle"], adj: [] },
    examine: "A single-bladed paddle of pale wood, with a shoulder cut in the grip for a hand that is used to being useful.",
    ...item("paddle") },
  shell: { at: null, from: "ennu", requires: "salt", spends: true, portable: true, material: "stone", name: "River shell", note: "On a cord. A guest's.",
    brought: "Ennu takes the salt, weighs it in her hand, ties a knot in the cord, and gives you a {shell} on a string.",
    again: "\"One guest, one shell,\" says Ennu, and moves a knot.",
    lacking: "\"A guest is counted in salt,\" says Ennu. \"Yours is in the box.\"",
    words: { nouns: ["shell"], adj: ["river"] },
    examine: "A river shell as long as your hand, curved like a tongue, with a notch worn in its lip. It has been counted, and it feels counted.",
    ...item("shell") },

  // The trail, the fig, the gorge
  post: { at: "trail", name: "Carved post", note: "A sun, and two rivers.",
    words: { nouns: ["post", "pole"], adj: ["carved"] },
    examine: "A post carved with a round sun. Under it a river runs down, and over it a river runs up, and the carver has left a fist's gap between them, at the sun." },
  jaguar: { at: "fig", name: "Jaguar", note: "Thin, and watching.",
    words: { nouns: ["jaguar", "cat", "animal"], adj: ["old", "thin"], g: "f" },
    examine: "A jaguar, all ribs and spots, lying along the limb with her chin on a root. Her eye follows you without effort. She is thin, and has noticed that you are not.",
    give: "The cat looks at it, and then at you, in that order.",
    listen: "A slow, wet, rasping breath, like a saw in green wood.",
    take: "The cat is not that sort of thing, and knows it." },
  clapper: { at: "fig", portable: true, material: "stone", name: "Stone tongue", note: "Long, grey, notched.",
    here: "A long {clapper} of grey stone hangs on a cord from the limb, a hand's reach from the cat.",
    words: { nouns: ["clapper", "tongue", "stone"], adj: ["stone", "long", "grey"] },
    examine: "A long stone, worn smooth by a hand and a cord, with a notch at the top where something hooked. It is the size and shape of a tongue, and is heavier than it looks.",
    ...item("clapper") },
  bridge: { at: "gorge", leads: "e", name: "Rope bridge", note: "Three planks gone.",
    words: { nouns: ["bridge"], adj: ["rope"] },
    parts: [{ words: ["planks", "plank", "ropes", "rope"], name: "the planks", says: "Grey as bone, three gone, the rest remembering what they were. The ropes are down to their last strand." }],
    examine: "A rope bridge of the old sort, hand over hand. The planks are grey as bone, three are gone, and the ropes have frayed down to what ropes are made of." },

  // The temple
  canoe_up: { at: "steps", enterable: "in", name: "Canoe", note: "Waiting for the river.",
    words: { nouns: ["canoe", "boat", "dugout"], adj: [] },
    enter: "You step into the canoe. It settles, and points back down the valley.",
    examine: "The same black dugout, put down on the steps' last green stair as neatly as a cup on a saucer. It is facing the way it came." },
  gate: { at: "steps", door: "n", locked: true, material: "stone", name: "Stone gate", note: "A frog's mouth, shut.",
    words: { nouns: ["gate", "frog", "mouth", "door"], adj: ["stone"] },
    lock: { key: "shell", says: "The gate is a frog's mouth, shut. At its lip, a notch the shape of a shell waits for something the river gave.",
      opens: "The shell fits the notch with a small, wet click. The mouth opens a hand's width, then wide, with the sound of a very old yawn." },
    shut: "You go up the steps to the stone mouth. It is shut, and has the patience of the very old.",
    examine: "The mouth of a stone frog as wide as a door, shut, with a notch at its lip the size and curve of a river shell." },
  frieze: { at: "court", name: "Frieze", note: "Figures and a bell.",
    words: { nouns: ["frieze", "carving", "figures"], adj: [] },
    examine: "Figures with their arms raised stand under a hanging bell. One has fitted a long stone into its mouth, and behind them a river climbs the wall." },
  basin: { at: "court", name: "Basin", note: "A hand of rainwater.",
    words: { nouns: ["basin", "water", "rainwater"], adj: ["stone"] },
    examine: "A stone basin the size of a hat, with a hand of rainwater in it, clear to the stone. Nothing has ever fallen in, the leaves included." },
  bell: { at: "chamber", use: "push", name: "Bell", note: "Gold. Its mouth empty.",
    words: { nouns: ["bell"], adj: ["gold", "golden", "noon"] },
    parts: [{ words: ["hook", "chain", "mouth"], name: "the hook", says: "A hook of gold inside the bell's mouth, bare. Something long and notched hung from it once." }],
    listen: "Nothing. The bell is full of the quiet where noon should be.",
    examine: "A bell of solid gold, the size of a bread oven, hung from a beam by a chain of the same. Its mouth is empty, and the hook inside it hangs bare, waiting for a tongue." },
  pool: { at: "chamber", name: "Pool", note: "Black. Watched.",
    words: { nouns: ["pool", "water"], adj: ["black"] },
    examine: "Black water with no bottom you would care to name. Two pale knobs sit on it, level and patient, and the water around them is perfectly still." }
};

// ---- Puzzles -----------------------------------------------------------------------------------------------------------
const puzzles = {
  get_paddle: { where: "village", needs: ["hooks"], solve: ["ask kito for paddle"], gives: ["paddle"], clues: ["hooks", "kito", "crate"],
    hints: ["The man at the next house makes paddles, and wants something from the Society's crate.", "Open the crate on the landing, take the hooks, and ask Kito for a paddle."] },
  get_shell: { where: "village", needs: ["salt"], solve: ["ask ennu for shell"], gives: ["shell"], clues: ["salt", "ennu", "crate"],
    hints: ["Ennu counts guests in the good salt from your crate.", "Open the crate, take the salt, and ask Ennu for a shell."] },
  get_clapper: { where: "fig", needs: ["fish"], solve: ["give fish to jaguar", "take clapper"], gives: ["clapper"], clues: ["fish", "jaguar", "ennu", "kito"],
    hints: ["The cat in the fig is thin, and the stone beside her is not hers.", "Give the fish from the landing to the jaguar, and take the stone tongue when she has gone."] },
  ride: { where: "landing", needs: ["paddle"], time: "next 12:00", solve: ["enter canoe", "paddle"], reaches: "steps", clues: ["canoe", "post", "ennu", "noon_landing"],
    hints: ["The river runs up the valley for an hour after noon, and carries what floats on it.", "With a paddle in hand, wait for noon on the landing, get into the canoe and paddle."] },
  open_gate: { where: "steps", needs: ["shell"], solve: ["unlock gate with shell", "go north"], reaches: "court", clues: ["gate", "shell", "ennu"],
    hints: ["The frog's mouth has a notch at its lip, the shape of something the river gave.", "Unlock the gate with the shell, and go north."] },
  ring_bell: { where: "chamber", needs: ["clapper"], time: "next 12:00", solve: ["put clapper in bell", "ring bell"], ending: true, clues: ["frieze", "bell", "ennu"],
    hints: ["The frieze in the court shows what the bell wants, and when.", "Put the stone tongue in the bell, and ring it at noon."] },
  carry_off: { where: "chamber", needs: [], solve: ["take bell"], ending: true, clues: ["bell", "frieze"],
    hints: ["The bell is gold, and hangs by a hook.", "Take the bell."] },
  fell: { where: "gorge", needs: [], solve: ["go east"], ending: true, clues: ["bridge", "kito"],
    hints: ["The bridge is old, and the planks are grey as bone.", "Go east, over the bridge."] }
};

// ---- Changes and rules -----------------------------------------------------------------------------------------------------
const changes = {
  jaguar_fed: [
    { set: "fig.fed", to: true },
    { remove: "object", id: "fish" },
    { remove: "object", id: "jaguar" },
    { draw: "fig", remove: ["jag_*"] },
    { set: "fig.describe", to: [
      "A strangler fig has taken a dead tree and kept its shape. The roots make rooms, and in the largest the air is warm and smells of cat, though the cat has gone down to the water.",
      "The lowest limb lies bare and flattened where she lay. The trail is south."
    ] },
    { set: "fig.alt", to: "The hollow inside a strangler fig: an empty limb, a long grey stone hanging from it, a shaft of light on the roots." },
    { set: "clapper.here", to: "A long {clapper} of grey stone hangs on a cord from the limb, where the cat lay." }
  ],
  bridge_fall: [
    { say: "The first plank holds. The second is only a shape the rope remembers. The gorge is longer than it looks, and quiet." },
    { hurt: 5, says: "The rope goes, and so do you." },
    { end: true, picture: "fell" }
  ]
};

const rules = [
  // The river turns, daily
  { id: "noon_landing", when: "at", at: "12:00", if: [{ "player.at": "landing" }],
    do: [{ say: "The river stops, as a man does who has remembered something, and begins to run up the valley, taking its leaves with it." }] },
  { id: "noon_elsewhere", when: "at", at: "12:00", if: [{ "player.at": { "!=": "landing" } }],
    do: [{ say: "Down at the river, a long way off, something turns round." }] },
  { id: "one_oclock", when: "at", at: "13:00",
    do: [{ say: "Somewhere below, the river remembers the sea." }] },

  // The canoe
  { id: "paddle_not_in", match: { verb: "paddle", obj: [null, "canoe"] }, if: [{ "player.at": "landing" }, { "player.in": { "!=": "canoe" } }],
    do: [{ say: "You are not in the canoe. Paddling the mud is a poor use of the morning." }] },
  { id: "paddle_no_paddle", match: { verb: "paddle", obj: [null, "canoe"] }, if: [{ "player.at": "landing" }, { "paddle.at": { "!=": "player" } }],
    do: [{ say: "Your hands make a poor paddle, and the canoe agrees." }] },
  { id: "paddle_up", match: { verb: "paddle", obj: [null, "canoe"] },
    if: [{ "player.at": "landing" }, { "player.in": "canoe" }, { "paddle.at": "player" }, { "time.hour": { between: [12, 13] } }],
    do: [{ say: "You push off at the turn. The river takes the canoe as a hand takes a cup, and the bank goes by backwards, uphill, with its mud and its trail and its smoke, and then the forest closes and there are only the water and the sound of the paddle." },
      { time: "+20m" }, { travel: "steps" }] },
  { id: "paddle_early", match: { verb: "paddle", obj: [null, "canoe"] },
    if: [{ "player.at": "landing" }, { "player.in": "canoe" }, { "paddle.at": "player" }],
    do: [{ say: "You work the canoe a length out against a river that is plainly running to the sea. It is not the hour. The current explains this to you, patiently, all the way back to the mud." }] },
  { id: "paddle_down", match: { verb: "paddle", obj: [null, "canoe_up"] },
    if: [{ "player.at": "steps" }, { "player.in": "canoe_up" }, { "paddle.at": "player" }, { "time.hour": { between: [13, 12] } }],
    do: [{ say: "You push off, and the river, which has seen the sea again, takes you down the valley at the speed of an opinion. The landing arrives, mud first." },
      { travel: "landing" }] },
  { id: "paddle_down_wait", match: { verb: "paddle", obj: [null, "canoe_up"] }, if: [{ "player.at": "steps" }, { "player.in": "canoe_up" }, { "paddle.at": "player" }],
    do: [{ say: "The river is still running up the valley, and your paddle is not the one it is listening to. It lets go at one." }] },
  { id: "paddle_steps_out", match: { verb: "paddle", obj: [null, "canoe_up"] }, if: [{ "player.at": "steps" }, { "player.in": { "!=": "canoe_up" } }],
    do: [{ say: "You are not in the canoe. It is waiting, with the patience of a thing that has only the one idea." }] },

  // The gate
  { id: "shell_in_mouth", match: { verb: ["put", "fit"], obj: "shell", obj2: "gate" }, if: [{ "player.at": "steps" }, { "shell.at": "player" }, { "gate.locked": true }],
    do: [{ set: "gate.locked", to: false }, { say: "The shell fits the notch with a small, wet click. The mouth opens a hand's width, then wide, with the sound of a very old yawn." }] },

  // The jaguar
  { id: "feed_jaguar", match: { verb: ["give", "throw", "put"], obj: "fish", obj2: "jaguar" }, if: [{ "player.at": "fig" }, { "fig.fed": false }, { "fish.at": "player" }],
    do: [{ say: "The fish leaves your hand in the air. The cat comes down the limb without hurry, takes it with the manners of the very hungry, and goes off through the roots towards the water. The limb is empty, and still warm." },
      { change: "jaguar_fed" }] },
  { id: "drop_fish_jaguar", match: { verb: "drop", obj: "fish" }, if: [{ "player.at": "fig" }, { "fig.fed": false }, { "fish.at": "player" }],
    do: [{ say: "The fish lands on the roots. The cat comes down the limb without hurry, takes it with the manners of the very hungry, and goes off through the roots towards the water. The limb is empty, and still warm." },
      { change: "jaguar_fed" }] },
  { id: "take_clapper_cat", match: { verb: ["take", "pull", "move"], obj: "clapper" }, if: [{ "player.at": "fig" }, { "fig.fed": false }],
    do: [{ hurt: 3, says: "You reach. The cat does not wake so much as arrive. A paw takes you across the arm, and the cord is not yours yet." }] },
  { id: "touch_cat", match: { verb: ["attack", "touch", "kiss"], obj: "jaguar" }, if: [{ "player.at": "fig" }],
    do: [{ hurt: 2, says: "The cat's paw says no, once, across your shoulder, and goes back to being a limb." }] },

  // The court and the chamber
  { id: "sip_basin", match: { verb: ["drink", "taste"], obj: "basin" }, once: true, again: "The basin is a hand deep, and you have had your hand's worth.",
    do: [{ heal: 1, says: "You drink from your cupped hand. The rainwater tastes of stone and nothing else, which is a relief." }] },
  { id: "pool_bites", match: { verb: ["touch", "drink", "taste", "enter"], obj: "pool" }, if: [{ "player.at": "chamber" }],
    do: [{ hurt: 3, says: "The black water parts. Something takes your arm in a grip that has never been argued with, thinks better of it, and lets go." }] },
  { id: "fit_tongue", match: { verb: ["put", "fit"], obj: "clapper", obj2: "bell" }, if: [{ "player.at": "chamber" }, { "clapper.at": "player" }, { "bell.tongued": false }],
    do: [{ set: "bell.tongued", to: true }, { remove: "object", id: "clapper" },
      { set: "bell.examine", to: "The bell hangs with its stone tongue fitted, a long grey weight on the gold hook, still, and waiting for its hour." },
      { say: "The stone tongue goes up into the bell's mouth and finds the hook as a key finds the lock it was cut for. It hangs there, and does not swing. The bell has the air of a thing that is going to be asked a question." }] },
  { id: "ring_noon", match: { verb: ["push", "attack"], obj: "bell" }, if: [{ "player.at": "chamber" }, { "bell.tongued": true }, { "time.hour": { between: [12, 13] } }],
    do: [{ say: "You strike the bell, and noon, which has been quiet in the valley since before the Society had a charter, goes out through the roof, along the gorge and down the river in one long gold note. At the water the river stops, listens, and runs up the valley because it was told to, and the fish go with it, silver, all at once, as though the whole afternoon had been waiting for permission. Far off, a village answers, loudly, and nobody counts it. In the journal, under Treasure, you write: Noon." },
      { end: true, picture: "rung" }] },
  { id: "ring_off_hour", match: { verb: ["push", "attack"], obj: "bell" }, if: [{ "player.at": "chamber" }, { "bell.tongued": true }],
    do: [{ say: "You strike the bell and it speaks once, a clean low note, out through the roof and down the valley. Nothing happens. It is not noon, and noon is particular." }] },
  { id: "ring_no_tongue", match: { verb: ["push", "attack"], obj: "bell" }, if: [{ "player.at": "chamber" }],
    do: [{ say: "You strike the gold with your knuckle. It answers with a sound like a word said into a pillow. It wants a tongue." }] },
  { id: "take_bell", match: { verb: ["take", "pull", "move"], obj: "bell" }, if: [{ "player.at": "chamber" }],
    do: [{ say: "The bell comes off its hook as easily as a hat. It is heavier than gold has any right to be, and you carry it down the steps and out onto the water at the hour the river turns back. It rides down to the sea with you, and the Society will have its treasure by Christmas. At noon the next day the river does not turn. It runs to the sea, and goes on running there, and nobody in the valley says anything about it for some time." },
      { end: true, picture: "carried" }] },

  // The bridge
  { id: "go_bridge", match: { verb: "go", dir: "e" }, if: [{ "player.at": "gorge" }], do: [{ change: "bridge_fall" }] },
  { id: "cross_bridge", match: { verb: ["cross", "enter", "climb"], obj: "bridge" }, if: [{ "player.at": "gorge" }], do: [{ change: "bridge_fall" }] }
];

// ---- The world ---------------------------------------------------------------------------------------------------------
export default {
  because: "A British explorer on a jungle river in 1871: a village, a rotten bridge, a jaguar's fig, and a temple the river reaches only at noon, where a gold bell has lost its tongue.",
  facts: [
    "The river runs up the valley between 12:00 and 13:00; the canoe reaches the temple steps only then, and the bell rings the ending only then.",
    "The paddle comes from Kito for the hooks, the shell from Ennu for the salt, both from the crate; the stone tongue hangs in the fig beside a jaguar who leaves for a fish.",
    "Three endings: the bell rung (rung), taken (carried), the bridge (fell)."
  ],
  properties: {
    "fig.fed": { type: "boolean", start: false },
    "bell.tongued": { type: "boolean", start: false }
  },
  opening: {
    room: "bivouac", hints: "parrot", intro: "letter", way: "flap",
    lines: {
      notYet: "You start for the flap. On the chest, the parrot shrieks the word \"Journal\" until you stop; it is plainly coming with you.",
      through: "You carry the cage through the flap, and the flap ties itself shut behind you with a knot you did not teach it.",
      hintFrame: "The parrot, who has read your journal, says:",
      farewell: "The letter drinks the damp until the ink lets go of it, and then it is only a leaf, which you let fall."
    }
  },
  effects: [
    { time: "day 1 05:40", weekday: "tue" },                 // the opening is played at twenty to six
    { set: "game.entrance", to: "landing" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 06:10", weekday: "tue" },
      { say: "The rain stops as you step out, politely, as if it had been waiting for you to be ready." }
    ] },
    // Verbs this world needs
    { add: "word", verb: "paddle", words: ["paddle", "row", "punt"], reply: "There is nothing here to paddle." },
    { add: "word", verb: "fit", words: ["fit", "attach", "hang", "tie"], reply: "There is nothing here that wants fitting." },
    { add: "word", verb: "cross", words: ["cross", "traverse"], reply: "There is nothing here to cross." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
