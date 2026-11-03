// "The Third Glass": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings as endingPictures, afterWell, afterWellCycles, afterStand } from "./pictures.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Third Glass",
  blurb: "A camp of black tents round a dry well, a camel that will not stand, and painted caves where the old rain waits. Someone is expecting you.",
  thumbnail: { picture: "camp", x: 30 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  synopsis: "You come out of the sand sea through a door with no wall, into a camp of black tents round a dry well. " +
    "The caravan cannot leave: the lead camel will not stand, the skins are empty, and the camp's eldest pours tea in glasses " +
    "of three and never asks why you came. West of the camp the dry river still runs, under a red rock, into caves where " +
    "someone painted the waiting.",
  tone: "WRITING-DIRECTION.md. The everyday, slightly wrong, told in the heat and quiet of a caravan camp: hospitality, tea, " +
    "patience and distance. The people are practical, courteous and unhurried, and they are never the strange thing; the strangeness " +
    "belongs to the desert and its water. Dry humour, long sight lines, very little water.",
  rules: [
    "Every shadow in the camp lies towards the well, at any hour.",
    "Water remembers. What a well, a river or a rain has been told, it keeps, and gives back when it is ready.",
    "A camel stands only for a place where someone is expecting her. Without that she is a hill.",
    "Tea is poured in three glasses: bitter as life, strong as love, gentle as death. A guest who finishes the third is no longer a guest.",
    "Nobody who walks east alone into the sand sea has been seen to come back; the tracks all point the same way."
  ],
  opening: "A night desert of identical dunes: a shell that murmurs the sea that was here (the hints), a cord of knots in your pocket (the intro), a door standing in its frame with no wall (the way on).",
  start: { day: 1, time: "06:10" },
  characters: [
    "Fadimata, the camp's eldest, who pours tea in threes and never asks why you came.",
    "Aghali, a young Tuareg driver who has re-tied the same load since the well went quiet.",
    "Afternoon, the white lead camel, who answers when spoken to and is not impressed."
  ],
  places: ["the sand sea", "the well camp (tent, camel lines)", "the dry river, the ridge", "the cave: mouth, painted gallery, room of hands, cistern"],
  endings: ["departed (the bell is hung on Afternoon and she is ridden out)", "stayed (the third glass)", "lost (walking east alone)"],
  chaos: 0.15
};

// The opening's declaration: its room, the hints thing, the intro, the way on, and the four lines.
const opening = {
  room: "dunes",
  hints: "shell",
  intro: "tally",
  way: "door",
  lines: {
    notYet: "The door stays shut. At its foot the shell goes on murmuring to the sand.",
    through: "The door opens on woodsmoke and the smell of tea. You go through, and the night does not follow.",
    hintFrame: "The shell murmurs, and out of the murmur someone says:",
    farewell: "The cord goes slack in your fingers, and is a line drawn in the sand, and then only sand."
  }
};

// Named changes, run from rules.
const changes = {
  skin_filled: [
    { say: "You hold the goatskin under, and the pool comes up into it without a sound, as if it had been waiting to be asked. The skin grows heavy and warm, like something asleep." },
    { remove: "object", id: "skin" },
    { move: "water_skin", to: "player" }
  ],
  well_filled: [
    { say: "You tip the skin over the rim. The water goes down the well without a splash, and for a moment nothing happens, politely. Then the rope tightens by itself, and the bucket comes up full, with something green sitting in the water like a fish." },
    { set: "well.full", to: true },
    { set: "well.listen", to: "You lean over the rim and listen. Far below, the water is telling the well everything it has just been told." },
    { set: "well.examine", to: "A ring of stones, a rope, a full bucket. The water in it is the colour of the inside of a bell, and a very long way down, more of it is speaking." },
    { set: "camp.describe", to: [
      "Five black tents stand round the well, with the tea fire between them and the dunes close all round, like a hand. The well is full, and talks to itself quietly, as a well does when it has been given something to say.",
      "Every shadow here lies towards the {well}, at any hour. The eldest's {tent|black_tent} is north, the camels south, a dry riverbed west. East there is only sand, and the tracks into it do not come back."
    ] },
    { draw: "camp", restyle: afterWell, cycles: afterWellCycles },
    { remove: "object", id: "water_skin" },
    { move: "bell", to: "player" }
  ]
};

export default {
  because: "The opening in a night desert, then a well camp, a dry river and a cave of painted walls; a lamp, a copy of a painted woman, a camel that stands, a skin of old rain, a well, a bell; and an elder's three glasses.",
  facts: [
    "The tally cord is the intro: it is out of play after the opening. The door is the way on; it leads to the camp.",
    "Chain: lamp (tent) -> cloth (camel lines) + charcoal (camp fire) -> rub the painted woman in the gallery -> show the rubbing to Afternoon, who stands and lets go of the goatskin -> fill it in the cistern -> put it in the well, which gives up a bell -> give the bell to Afternoon and ride her: departed.",
    "Fadimata's tea comes three times: the third drunk ends the story (stayed). Walking east from the camp kills outright (lost). The viper under the flat stone hurts once (2). The tea and the handprint heal.",
    "A lit lamp is needed to go down from the cave mouth. The lamp lights anywhere, with no match."
  ],
  properties: {
    "tea.glasses": { type: "number", min: 0, max: 3, start: 0 },
    "lamp.lit": { type: "boolean", start: false },
    "afternoon.standing": { type: "boolean", start: false },
    "afternoon.belled": { type: "boolean", start: false },
    "well.full": { type: "boolean", start: false }
  },
  opening,
  effects: [
    { time: "day 1 03:30" },

    // ---- the opening: the sand sea, a door standing in its frame ------------------------------------------------
    { add: "room", id: "dunes", name: "THE SAND SEA", area: "erg", at: [0, 0, 0],
      describe: [
        "Dunes in every direction, each the same as the last, under more stars than the sky has any use for. The sand is still warm from a day that ended long ago. Your tracks begin at your heels.",
        "A {door} stands in the sand to the north, hung in a frame with no wall. It is the only thing here that is not sand."
      ],
      exits: { n: true },
      scenery: [
        { words: ["dunes", "dune", "sand", "crest", "crests"], name: "the dunes", says: "Dune after dune, combed the same way by the same wind. You could walk to the nearest and find you had never left." },
        { words: ["stars", "star", "sky"], name: "the stars", says: "More than are needed. They hang low and close together, like people waiting to be told something." },
        { words: ["tracks", "track", "heels"], name: "your tracks", says: "They begin at your heels. Nothing leads up to them." }
      ],
      ambience: {
        lines: [
          "A grain of sand slides down a dune, and takes its time about it.",
          "A star you were looking at moves over, to make room.",
          "The wind turns over in its sleep and is quiet.",
          "Far off, something is struck, rings once, and is sand again."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A night desert of dunes under stars, with a lone wooden door standing in its frame on the sand.",
      overlayAlt: { shell: "A spiral shell lies at the foot of the door." },
      picture: pictures.dunes.picture },
    { add: "object", id: "shell", at: "dunes", portable: true, name: "Shell", note: "Murmuring the old sea.",
      here: "At the foot of the door a {shell} lies on its side, murmuring.",
      words: { nouns: ["shell", "seashell"], adj: ["spiral", "pale"] },
      examine: "A spiral shell, pale with salt, the size of a fist. Held to the ear it keeps the sea that was here once, and it is still arguing with the sand about it.",
      sprite: sprites.shell },
    { add: "object", id: "tally", at: "player", portable: true, name: "Tally cord", note: "One knot undone.",
      words: { nouns: ["tally", "cord"], adj: ["knotted", "leather"] },
      examine: "A leather cord with a knot for every day of walking. You tied them so as not to forget where you were going, and the last one has come undone.",
      sprite: sprites.cord },
    { add: "object", id: "door", at: "dunes", name: "Door", note: "Alone in its frame.",
      actions: ["Knock on door"],
      words: { nouns: ["door", "frame"], adj: ["grey", "wooden"] },
      examine: "A plain door of grey acacia, hung in a frame with no wall. The hinges are rusted. The handle is polished by hands that were not yours." },

    // ---- the way on, and the arrival ----------------------------------------------------------------------------
    { set: "game.entrance", to: "camp" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 06:10" },
      { say: "It is morning here, and cool. Behind you, [way] closes, and its frame stands in the dust a moment with nothing in it, then does not." }
    ] },
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),

    // ---- the well camp --------------------------------------------------------------------------------------------
    { add: "room", id: "camp", name: "THE WELL CAMP", area: "camp", at: [0, 0, 0],
      describe: [
        "Five black tents stand round a well, with the tea fire between them and the dunes close all round, like a hand. The well has been dry since winter, and the camp is still polite about it.",
        "Every shadow here lies towards the {well}, at any hour. The eldest's {tent|black_tent} is north, the camels south, a dry riverbed west. East there is only sand, and the tracks into it do not come back."
      ],
      exits: { n: { to: "tent", in: true }, s: "lines", w: "wadi", e: true },
      scenery: [
        { words: ["tents", "camp"], name: "the camp", says: "Five tents of goat hair, black going grey, each with its back to the wind and its door to the well." },
        { words: ["fire", "tea fire", "embers", "ashes"], name: "the fire", says: "A small fire of acacia, kept in all night by someone who then pretends not to have." },
        { words: ["shadows", "shadow"], name: "the shadows", says: "Each lies from its owner towards the well, long and patient, like a dog that has been told to wait." },
        { words: ["sand", "dunes", "tracks"], name: "the sand", says: "The tracks go east into it and do not come back. They are made by everyone, and by no one in particular." }
      ],
      ambience: {
        lines: [
          "Somewhere a glass touches a glass, and a voice says a word, and it is quiet again.",
          "A tent rope hums in the wind, and stops when you look at it.",
          "The shadows lean a little closer to the well, in case it speaks.",
          "A camel clears its throat to the south, and nobody asks."
        ],
        every: [35, 70], chance: 0.7
      },
      alt: "A desert camp at dawn: black tents round a stone well, a fire in the middle, red dunes beyond.",
      overlayAlt: { charcoal: "Burnt sticks lie at the edge of the fire." },
      picture: pictures.camp.picture },
    { add: "object", id: "well", at: "camp", container: true, open: "always", name: "Well", note: "Dry as a held breath.",
      words: { nouns: ["well", "rim"], adj: ["dry", "stone"] },
      parts: [{ words: ["rope"], name: "the rope", says: "A palm-rope gone grey and stiff. It goes down into the dark and does not mention what is at the end." },
              { words: ["bucket"], name: "the bucket", says: "A leather bucket on the end of the rope, patient as a hand held out." }],
      listen: "You lean over the rim and listen. The well listens back, with great attention, and neither of you says anything.",
      examine: "A ring of stones, a rope, and a dry bucket. Nothing comes up when you look but the looking. A well is a long listening, and this one has stopped." },
    { add: "object", id: "black_tent", at: "camp", leads: "n", name: "Black tent", note: "The eldest's tent.",
      words: { nouns: ["tent", "black tent"], adj: ["eldest's", "black"] },
      examine: "Goat hair, woven close and gone the grey of a shadow. The smoke goes up from its roof in a line so straight it looks ruled." },
    { add: "object", id: "charcoal", at: "camp", portable: true, name: "Charcoal", note: "Black right through.",
      here: "Burnt sticks of {charcoal} lie where the fire pushed them out.",
      words: { nouns: ["charcoal", "stick", "sticks"], adj: ["burnt"] },
      examine: "A burnt stick of acacia, black right through. It marks your fingers at once, as though it had been waiting to write something.",
      sprite: sprites.charcoal },

    // ---- the black tent -------------------------------------------------------------------------------------------
    { add: "room", id: "tent", name: "THE BLACK TENT", area: "camp", at: [0, -1, 0],
      describe: [
        "Inside it is dusk, whatever the hour. Rugs lie three deep, a brazier ticks, and a small enamel teapot has been about to boil since before you came.",
        "{Fadimata|fadimata} keeps the brazier, with her glasses lined up on a tin tray. A one-string {imzad} hangs from the tent pole, humming under its breath. The flap to the south is the way out."
      ],
      exits: { s: "camp" },
      scenery: [
        { words: ["rugs", "rug", "carpet"], name: "the rugs", says: "The oldest is woven with this camp seen from above: five tents, a well, and a little way off, a figure sitting that is not here either." },
        { words: ["brazier", "teapot", "pot", "coals"], name: "the brazier", says: "Coals the colour of the inside of an eyelid. The teapot sits on them like a hen, and is about to say something." },
        { words: ["glasses", "tray"], name: "the glasses", says: "Small and plain, they stand in a row on a tin tray, in threes." },
        { words: ["pole", "flap", "shelf"], name: "the tent", says: "Black goat hair and a pole worn pale where hands have steadied themselves." }
      ],
      ambience: {
        lines: [
          "The brazier ticks over, like something being counted.",
          "The teapot almost boils.",
          "The imzad's string hums one note and leaves it on the rug like a coin.",
          "A little sand falls from the roof, and is sorry."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "The inside of a black tent: rugs, a glowing brazier with a teapot, an old woman, a lamp on a shelf.",
      overlayAlt: { lamp: "A little clay lamp stands on the shelf." },
      picture: pictures.tent.picture },
    { add: "object", id: "fadimata", at: "tent", name: "Fadimata", note: "Pouring, unhurried.",
      words: { nouns: ["fadimata", "elder"], adj: ["old"], g: "f", proper: true },
      examine: "Small, unveiled and upright, with silver at her wrists and an expression of immense settled patience. When she pours, the tea falls in one long clean arc that does not splash.",
      give: "\"Keep it,\" says Fadimata. \"I have enough that is mine.\"",
      topics: {
        tea: { open: true, label: "the tea", words: ["tea", "glasses", "glass", "teapot", "three"],
          says: "\"Three glasses, always. The first is bitter as life. The second is strong as love. The third is gentle as death.\" She says it in the voice other people keep for the weather. \"Most guests leave before the third. The ones who finish it stay.\"" },
        well: { label: "the well", words: ["well", "water", "dry"],
          says: "\"A well is a long listening,\" she says. \"This one stopped when no one spoke to it. The water went under the red rock to wait, and the riverbed still runs towards it, west, the way it always did.\"" },
        lamp: { label: "the dark", words: ["lamp", "dark", "light", "shelf"],
          says: "\"The dark under the rock is older than manners,\" says Fadimata. \"Take the lamp from the shelf and light it. It is not particular about matches.\"" },
        camel: { about: "afternoon", label: "Afternoon", words: ["afternoon", "camel", "stand", "caravan"],
          says: "\"She stands when she is expected somewhere,\" says Fadimata. \"She has not been expected anywhere for eleven years. We are all very good at waiting, in this camp. It is how we got here.\"" },
        rock: { about: "wadi", label: "the red rock", words: ["rock", "cave", "caves", "painting", "painted", "paintings"],
          says: "\"My mother's mother sat in that cave until it was painted,\" says Fadimata. \"She was not an artist. Mind the flat stone beside the path, the one with the track. It is not shy, and it is not stone.\"" },
        east: { open: true, label: "the east", words: ["east", "sand", "tracks", "dunes", "desert", "alone"], opens: ["east"],
          says: "\"The sand to the east keeps whoever walks into it alone,\" says Fadimata. \"It is not unkind. It is only very thorough.\"" },
        aghali: { label: "Aghali", words: ["aghali", "driver", "boy"],
          says: "\"He is tying the same load. It is kinder to let him.\"" },
        default: "\"Drink,\" says Fadimata, which is what she says to most things."
      } },
    { add: "object", id: "tea", at: null, from: "fadimata", times: 3, name: "Tea", note: "In a small glass.",
      brought: [
        "Fadimata pours from a great height into a small {glass|tea}, and the foam stands up like a held breath.",
        "She pours the second glass from the same height. It is darker, and sweeter, and does not apologise.",
        "She pours the third glass slowly, and for the first time does not watch the stream. \"You do not have to,\" she says. \"Most do not.\""
      ],
      already: "\"Drink that one first,\" says Fadimata.",
      again: "\"Three,\" says Fadimata. \"It has always been three.\"",
      consumable: true, heals: 1,
      drink: [
        "Bitter as life. It takes some getting used to, and then you have.",
        "Strong as love. Your hands remember being warm.",
        "Gentle. Very gentle."
      ],
      words: { nouns: ["tea", "glass"], adj: ["small", "hot"] },
      examine: "Tea the colour of a river in the evening, in a glass no bigger than an egg-cup, with a crown of foam. The steam goes straight up. There is a little more of it than the glass can account for." },
    { add: "object", id: "imzad", at: "tent", name: "Imzad", note: "One string, humming.",
      words: { nouns: ["imzad", "fiddle", "string"], adj: ["one-string"] },
      listen: "The string hums a single note. It is a note you knew once, and it has kept your place in it.",
      touch: "You touch the string and it stops, politely. Then it starts again, a shade lower, as if you had changed its mind.",
      examine: "A one-string fiddle with a round body covered in skin, hung from the pole by its bow. It is played by women, for whoever is missed. It looks, hanging there, like a held question." },
    { add: "object", id: "lamp", at: "tent", portable: true, use: "switch_on", name: "Clay lamp", note: "Wick dry. Oil full.",
      here: "A little clay {lamp} waits on the shelf behind her.",
      words: { nouns: ["lamp", "wick"], adj: ["clay", "little"] },
      examine: "A palm-sized lamp of fired clay, with a spout for the wick and a handle for a finger. The oil is full to the brim. The wick has the look of something that will light for anyone it likes.",
      sprite: sprites.lamp },

    // ---- the camel lines --------------------------------------------------------------------------------------------
    { add: "room", id: "lines", name: "CAMEL LINES", area: "camp", at: [0, 1, 0],
      describe: [
        "The camels are kept south of the camp in a long row, kneeling, all facing the same way. They have knelt since the well went quiet, and chew as though nothing were the matter.",
        "{Afternoon|afternoon}, the white lead camel, kneels at the end of the row beneath a full saddle. {Aghali|aghali} ties a load on the next one, undoes it, and ties it again. Washing hangs between two posts. The camp is north."
      ],
      exits: { n: "camp" },
      scenery: [
        { words: ["camels", "row", "herd", "others"], name: "the camels", says: "A dozen camels, kneeling in step, each with its eyes shut at the same angle. They are waiting, and they are good at it." },
        { words: ["washing", "line", "posts", "post"], name: "the washing", says: "Cotton and blue indigo, drying in air that has no moisture in it to offer. It dries anyway, out of tact." },
        { words: ["saddle", "saddles", "loads", "load"], name: "the loads", says: "Salt and millet in sacks, lashed and tied, ready for a road that has not been agreed on." }
      ],
      ambience: {
        lines: [
          "A camel breathes out along its whole length.",
          "Aghali pulls a strap tight, looks at it, and loosens it.",
          "The washing lifts, as if someone had just walked past it.",
          "A fly crosses the lines from one ear to another, and is not stopped."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A row of kneeling camels at dawn, a white camel at the end, a man tying a load, washing on a line.",
      overlayAlt: { cloth: "A white cloth hangs on the line." },
      picture: pictures.lines.picture },
    { add: "object", id: "afternoon", at: "lines", name: "Afternoon", note: "Kneeling. Unmoved.",
      actions: ["Ride Afternoon"],
      words: { nouns: ["afternoon", "camel"], adj: ["white", "lead"], g: "f", proper: true },
      examine: "A tall white dromedary, kneeling as if she had decided to. Her lip is long and her opinion of you is longer. An empty {goatskin|skin} hangs from her saddle the way an unanswered question hangs.",
      give: "Afternoon looks at it as at a rumour.",
      topics: {
        standing: { open: true, label: "standing", words: ["stand", "standing", "rise", "up", "kneel", "kneeling", "walk", "go"],
          says: "\"I stand for a place with someone in it,\" she says, not unkindly. \"I kneel for a place with no one. I have knelt for eleven years. It is restful, and it is a lie.\"" },
        skin: { label: "the goatskin", words: ["skin", "goatskin", "saddle", "empty"],
          says: "\"It is empty. I do not carry empty. It is a matter of principle, and of knees.\"" },
        smoke: { about: "ridge", label: "the smoke", words: ["smoke", "green", "east", "ridge", "fire"],
          says: "\"There is a fire in the east that has not gone out,\" says Afternoon. \"I can smell whose it is.\" She says no more. Her ears say a great deal." },
        woman: { open: true, label: "the woman", words: ["woman", "painting", "cloth", "picture", "copy", "waiting"],
          says: "\"Bring me her,\" says Afternoon. \"Not the paint. Her. A copy will do. I am not proud.\"" },
        default: "Afternoon considers you, and what is behind you, and says nothing."
      } },
    { add: "object", id: "aghali", at: "lines", name: "Aghali", note: "Tying a load, again.",
      words: { nouns: ["aghali", "driver"], adj: ["young"], g: "m", proper: true },
      examine: "A young Tuareg in an indigo veil, so that only his eyes are free of it. The dye has come off on his hands and forehead, and the blue goes in deeper than it should.",
      opens: ["veil"],
      give: "\"Keep it,\" says Aghali. \"A man should have something to hold on a journey.\"",
      topics: {
        cloth: { label: "the washing", words: ["cloth", "washing", "line", "cotton", "white"],
          says: "\"That is mine,\" says Aghali, and then, after looking at it for some time: \"Take it. I have not had anything to wrap since the well went quiet.\"" },
        caravan: { open: true, label: "the caravan", words: ["caravan", "road", "leave", "load", "loads", "well", "water"],
          says: "\"We cannot cross with dry skins, and the camel will not stand. So I tie the load again. It is the only thing I can do that is not wrong.\"" },
        camel: { about: "afternoon", label: "Afternoon", words: ["afternoon", "camel"],
          says: "\"She is the oldest of us. When she kneels, we kneel. We have been very good at it.\"" },
        east: { label: "the sand", words: ["east", "sand", "dunes", "desert", "tracks", "alone"],
          says: "\"Nobody walks east alone,\" says Aghali. \"The sand is the same in every direction, and it keeps what it is given. We go east together, or not at all.\"" },
        veil: { label: "the veil", words: ["veil", "tagelmust", "indigo", "blue", "dye"],
          says: "\"It is the colour that comes off,\" he says, and shows you his blue hands. \"A man wears his veil, and then the veil wears him.\"" },
        default: "\"Hm,\" says Aghali, and pulls a strap tighter."
      } },
    { add: "object", id: "cloth", at: "lines", portable: true, name: "White cloth", note: "Washed past speech.",
      here: "A white {cloth} dries on the line, quite dry.",
      words: { nouns: ["cloth", "cotton"], adj: ["white"] },
      examine: "A length of white cotton, washed so many times it has nothing left to say. It would take whatever was pressed against it, like a face.",
      sprite: sprites.cloth },
    { add: "object", id: "skin", at: "afternoon", portable: true, name: "Goatskin", note: "Empty. Tarred inside.",
      words: { nouns: ["goatskin", "skin", "waterskin", "water skin"], adj: ["empty", "goat"] },
      examine: "A goatskin water bag, tarred inside, empty, smelling of every journey it has been on. Its mouth is tied with a thong, and the thong has given up.",
      sprite: sprites.skin },
    { add: "object", id: "water_skin", at: null, portable: true, name: "Full goatskin", note: "Heavy. Old rain.",
      drink: "It is not yours to drink. It is the well's, and the well has been waiting.",
      words: { nouns: ["goatskin", "skin", "waterskin", "water skin"], adj: ["full", "heavy", "goat"] },
      examine: "Heavy and warm and slightly alive. Old rain moves in it with a soft, interested sound, as of someone turning over a name.",
      sprite: sprites.water_skin },
    { add: "object", id: "rubbing", at: null, portable: true, name: "Rubbing", note: "She, in black.",
      words: { nouns: ["rubbing", "copy"], adj: ["black", "cloth"] },
      examine: "The cloth is grey with charcoal, and on it, small and exact, sits a woman by a well with a flame at her knee. Her hands are open. Her eyes are two dots, and both look out of the cloth at you.",
      sprite: sprites.rubbing },
    { add: "object", id: "bell", at: null, portable: true, name: "Camel bell", note: "Green with old water.",
      push: "The bell gives one low round note, and the camp looks up. Every head in it turns towards the camels.",
      words: { nouns: ["bell"], adj: ["camel", "bronze", "green"] },
      examine: "A bronze camel bell, green with old water, that went down the well on the day the well went quiet. The clapper is a small stone. It has been waiting to be asked.",
      sprite: sprites.bell },

    // ---- the dry river, the ridge ------------------------------------------------------------------------------------
    { add: "room", id: "wadi", name: "THE DRY RIVER", area: "wadi", at: [0, 0, 0],
      describe: [
        "A riverbed of pale sand between low banks, rippled as finely as wood grain. Nothing has run here since before the camp, and the sand runs anyway, west, quietly, a little faster than you can walk.",
        "A flat {stone|flat_stone} lies beside the path, with a single curved track ending at its edge. A red rock stands to the west, a ridge climbs north, and the camp is east."
      ],
      exits: { e: "camp", w: "mouth", n: "ridge" },
      scenery: [
        { words: ["ripples", "sand", "riverbed", "bed", "banks", "bank"], name: "the riverbed", says: "The ripples travel west, all together, a current of sand that no water was ever asked to join." },
        { words: ["rock", "red rock"], name: "the red rock", says: "A hill of red sandstone with a dark crack at its foot. The riverbed runs straight into it, and does not come out the other side." },
        { words: ["track", "tracks"], name: "the track", says: "One line, drawn and not lifted. It ends at the stone and does not begin again." },
        { words: ["ridge", "slope"], name: "the ridge", leads: "n", says: "A long slope of broken stones, easy under the foot." }
      ],
      ambience: {
        lines: [
          "The ripples in the sand slide west, all of them, in step.",
          "A lizard stops, considers the sky, and goes on.",
          "From the rock comes a breath of air that smells of wet stone, which you had forgotten was a smell.",
          "A pebble rolls a little way along the bed, as if keeping an appointment."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A dry riverbed seen from above, its sand rippled and flowing west towards a red rock, a flat stone at the edge.",
      picture: pictures.wadi.picture },
    { add: "object", id: "flat_stone", at: "wadi", use: "touch", name: "Flat stone", note: "A track ends at it.",
      words: { nouns: ["stone", "slab"], adj: ["flat"] },
      examine: "A flat stone the size of a tray, the colour of the bed. The track beside it is one curved line, and it stops at the stone's edge and does not start again." },
    { add: "room", id: "ridge", name: "THE RIDGE", area: "wadi", at: [0, -1, 0],
      describe: [
        "The ridge is a long spine of broken stone, and the whole sand sea lies under it, ribbed like the roof of a mouth. The camp is a pinch of black seed in a pale dish, its shadows all pointing in.",
        "Far to the east, past where the dunes should stop, there is a smudge of green and a thread of smoke going straight up. Someone has kept that fire a very long time. A {cairn} marks the top."
      ],
      exits: { s: "wadi" },
      scenery: [
        { words: ["smoke", "green", "smudge", "fire", "thread"], name: "the smoke", says: "A thread of smoke, ruled straight from a far green place to the sky. Whoever keeps that fire is expecting someone." },
        { words: ["dunes", "sand", "sea"], name: "the sand sea", says: "Ribs of sand from edge to edge. In all that, the only thing that is not the same as the rest is the smoke." }
      ],
      ambience: {
        lines: [
          "The wind comes over the ridge and sorts through your clothes for something it lost.",
          "Far to the east the thread of smoke leans, and straightens.",
          "A stone shifts on the cairn, settles, and is again the stone it was."
        ],
        every: [35, 70], chance: 0.6
      },
      alt: "A high ridge looking down on a pale dish of sand, with a tiny camp in it, a stone cairn, and a thread of smoke far off.",
      picture: pictures.ridge.picture },
    { add: "object", id: "cairn", at: "ridge", name: "Cairn", note: "A stone from everyone.",
      touch: "You lay a hand on the stones. Each is warm, and each fits a hand that is not yours. You take yours away as a courtesy.",
      words: { nouns: ["cairn", "stones"], adj: ["stone"] },
      examine: "A heap of stones, one from every traveller who stopped here to look east. The oldest are worn round with being held. The newest is still the shape of a pocket." },

    // ---- the cave --------------------------------------------------------------------------------------------------
    { add: "room", id: "mouth", name: "THE CAVE MOUTH", area: "wadi", at: [-1, 0, 0],
      describe: [
        "The red rock leans over a crack as tall as a doorway, and the cold comes out of it like a breath held a very long time. Out of the sun the air smells of wet stone and old smoke.",
        "Cattle are painted on the wall beside the crack, red, walking inward. A passage goes down into a dark so complete you could lean on it. The dry river is behind you."
      ],
      exits: { e: "wadi", d: { to: "gallery", if: [{ "lamp.at": "player" }, { "lamp.lit": true }],
        closed: "You go three steps down, and the dark has weight and no floor you can see. You come back up to the mouth. Down there wants a light you carry, and have lit." } },
      scenery: [
        { words: ["cattle", "cows", "herd", "ox", "oxen"], name: "the cattle", says: "Ochre, a finger wide, laid on thousands of years ago by someone who had time. The last cow looks back, at you, or at whoever is behind you. They are walking in, not out, as if the dark were a pasture." },
        { words: ["passage", "dark", "crack"], name: "the passage", leads: "d", says: "The passage goes down, and the dark in it has a floor somewhere, which it is not showing." },
        { words: ["rock", "red rock"], name: "the red rock", says: "Red sandstone, with a cold in its heart." }
      ],
      ambience: {
        lines: [
          "A breath of cold comes up the passage and goes through you without asking.",
          "A drop of water falls somewhere below, and the dark counts it.",
          "The painted cattle seem for a moment to have taken a step."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A tall red rock with a dark crack at its foot, red painted cattle walking into it.",
      picture: pictures.mouth.picture },
    { add: "room", id: "gallery", name: "THE PAINTED GALLERY", area: "cave", at: [0, 0, -1],
      describe: [
        "Your light finds a long chamber painted from floor to roof in ochre and white: giraffes, a river with fish in it, dancers in rows. The paint moves when the flame does, and settles when it is still.",
        "At the far end, life-size, a {woman|painting} sits by a well with a small flame at her knee, facing the way you came in. A narrow way goes north, the sound of water is west, and the passage rises behind you."
      ],
      exits: { u: "mouth", n: "hands", w: "cistern" },
      scenery: [
        { words: ["giraffes", "giraffe", "fish", "river", "dancers", "dancing", "ochre", "paint"], name: "the paintings", says: "Giraffes with their heads in the roof, a river you could drink if it were not paint, dancers in rows with their arms in the air. They are all looking at the woman." },
        { words: ["well", "flame"], name: "the painted well", says: "A painted well with a painted flame beside it. The flame does not flicker. Of everything in the room, it is the only thing that waits." }
      ],
      ambience: {
        lines: [
          "The painted river runs, for as long as your light leans that way.",
          "A giraffe lifts its head, and your light is steadied.",
          "Far in the dark, water drips into water, and counts.",
          "The dancers take one step towards the woman, and are still."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A long cave chamber painted with giraffes and dancers, and at its end a life-size woman sitting by a well.",
      picture: pictures.gallery.picture },
    { add: "object", id: "painting", at: "gallery", use: "touch", name: "Painted woman", note: "Waiting, facing the way in.",
      words: { nouns: ["woman", "painting", "figure"], adj: ["painted", "red"] },
      touch: "You lay a palm on her painted hand. The rock is cool and smooth, the kind that keeps what is pressed on it. Copying her would want something to press, and something to press with.",
      examine: "She is painted red and white, sitting upright, her hands open on her knees. Her eyes are two dots, and both are looking at the way in. The stone around her is fine and smooth, the kind that keeps what is pressed upon it, and it is worn pale below her where something has leaned for a very long time." },
    { add: "room", id: "hands", name: "THE ROOM OF HANDS", area: "cave", at: [0, -1, -1],
      describe: [
        "A small round chamber, its walls and roof printed with hands: pigment blown round a palm, so that each hand is left pale. Children's hands, a hand with six fingers, a hand without a thumb, hundreds, all spread, all at the height of someone arriving.",
        "One {handprint} at eye level is exactly your size. The way out is south."
      ],
      exits: { s: "gallery" },
      scenery: [
        { words: ["hands", "fingers", "pigment", "palms", "walls"], name: "the hands", says: "Hundreds of them, each one a place where somebody stood and held still. Not one has a name. Not one needed it." }
      ],
      ambience: {
        lines: [
          "Your own hand lifts a little, without being asked, and returns.",
          "The pale hands seem, in your light, to move a finger's width nearer.",
          "A long way off, water falls once, and the hands listen."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A small round cave covered in hundreds of pale handprints on a red wall.",
      picture: pictures.hands.picture },
    { add: "object", id: "handprint", at: "hands", use: "touch", name: "Handprint", note: "Exactly your size.",
      words: { nouns: ["handprint", "print"], adj: ["pale", "your"] },
      examine: "A pale hand in a halo of red, spread at the height of your shoulder. Its fingers are the length of yours. It is not yours, and it is still slightly warm." },
    { add: "room", id: "cistern", name: "THE CISTERN", area: "cave", at: [-1, 0, -1],
      describe: [
        "A round chamber cut by water, with a pool in the middle so still that your light hangs in it twice. The air is cold and tastes of coins. A channel comes in under the gallery wall and stops at the pool's edge; nothing leaves.",
        "The {pool} is rain that fell before the camp and before the river, and it remembers every roof. A stone lip runs round it, worn smooth by people who came to be told things."
      ],
      exits: { e: "gallery" },
      scenery: [
        { words: ["channel", "lip", "edge"], name: "the channel", says: "The channel is dry, and polished by water that was not in a hurry. It runs from the river to the pool, and the pool takes everything it is given." }
      ],
      ambience: {
        lines: [
          "A ring spreads across the pool, from nothing, and reaches the edge, and is gone.",
          "The pool says something slowly, in a language made entirely of vowels.",
          "Your light and its twin lean towards each other, and do not touch."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A round cave chamber with a still pool in the middle, lit from above, and a stone lip round it.",
      picture: pictures.cistern.picture },
    { add: "object", id: "pool", at: "cistern", container: true, open: "always", name: "Pool", note: "Old rain, very still.",
      words: { nouns: ["pool", "water", "cistern", "rain"], adj: ["still", "old"] },
      listen: "You listen. The pool is saying something slowly, in a language made entirely of vowels, and you almost have it.",
      examine: "Black, level, and deeper than your light. It does not reflect you. It reflects the roof of a house you lived in once, and then, as you look, a roof you did not." },

    // ---- rules: the chain, the hurts, the endings -------------------------------------------------------------
    { add: "word", verb: "play", words: ["play"], object: "required", reply: "There is nothing here that would play for you." },
    { add: "word", verb: "fill", words: ["fill"], object: "required", reply: "There is nothing here to fill." },
    { add: "word", verb: "pour", words: ["pour", "empty"], object: "required", reply: "There is nothing here to pour." },
    { add: "word", verb: "hang", words: ["hang", "tie", "fasten"], object: "required", reply: "There is nothing here to hang it on." },

    // the lamp lights for anyone it likes
    { add: "rule", rule: { id: "lamp_on", match: { verb: "switch_on", obj: "lamp" }, if: [{ "lamp.lit": false }],
      do: [{ set: "lamp.lit", to: true }, { say: "You hold the wick out, and it lights, without a match, to be helpful. The flame stands up straight and watches the room." }] } },
    { add: "rule", rule: { id: "lamp_on_again", match: { verb: "switch_on", obj: "lamp" }, if: [{ "lamp.lit": true }],
      do: [{ say: "It is burning already. It would like to be thanked once, and has been." }] } },
    { add: "rule", rule: { id: "lamp_off", match: { verb: "switch_off", obj: "lamp" }, if: [{ "lamp.lit": true }],
      do: [{ set: "lamp.lit", to: false }, { say: "You pinch the wick. The flame goes out with a small, dignified sound." }] } },

    // east alone is the sand sea
    { add: "rule", rule: { id: "walk_east", match: { verb: "go", dir: "e" }, if: [{ "player.at": "camp" }],
      do: [
        { say: "You walk east until the camp is a rumour, and then not even that. Every dune is the same dune, and you have been walking it a long time." },
        { hurt: 5, says: "After a while you sit down, and the sand takes the shape of you." },
        { end: true, picture: "lost" }
      ] } },

    // the viper under the stone
    { add: "rule", rule: { id: "stone_viper", match: { verb: ["move", "search", "push", "pull", "touch"], obj: "flat_stone" }, once: true,
      again: "Under the stone there is only the hollow it left, and a faint cool.",
      do: [{ hurt: 2, says: "You lift the edge of the stone. What was under it lifts its head. The bite is small, neat and entirely sure of itself, and then the track goes away across the sand, one long line." }] } },

    // the hand in the print
    { add: "rule", rule: { id: "handprint_rest", match: { verb: "touch", obj: "handprint" }, once: true,
      again: "The print is cool and fits as before, and gives you nothing more. It has given what it had.",
      do: [{ heal: 1, says: "You set your palm in the print. It fits to the fingertip, and for a moment someone else's tiredness comes into your hand as if being handed over, and goes out of yours." }] } },

    // the old rain
    { add: "rule", rule: { id: "drink_pool", match: { verb: "drink", obj: "pool" }, once: true,
      again: "You drink again. It tastes of rain, only, this time, which is also something.",
      do: [{ heal: 1, says: "You drink from your cupped hands. It tastes of every roof it ever fell on, and of one in particular." }] } },

    // the imzad is not for visitors
    { add: "rule", rule: { id: "play_imzad", match: { verb: "play", obj: "imzad" },
      do: [{ say: "Fadimata lifts one finger, without looking up, and you take your hand away. \"It is not tuned for visitors,\" she says. \"It is tuned for being missed.\"" }] } },

    // the third glass
    { add: "rule", rule: { id: "third_glass", match: { verb: "drink", obj: "tea" }, if: [{ "tea.glasses": 2 }],
      do: [
        { say: "You drink the third glass. It is gentle, the way a hand is gentle on the back of a head. The tent is warm. Outside, Aghali ties a load, and unties it, and ties it again; you hear it the way you hear rain on another roof." },
        { say: "Fadimata pours again. There is always room in the tent for one more." },
        { end: true, picture: "stayed" }
      ] } },
    { add: "rule", rule: { id: "count_glass", match: { verb: "drink", obj: "tea" },
      do: [{ set: "tea.glasses", add: 1 }], then: "default" } },

    // the copy of the painted woman
    { add: "rule", rule: { id: "rub_painting", match: { verb: "touch", obj: "painting" },
      if: [{ "cloth.at": "player" }, { "charcoal.at": "player" }],
      do: [
        { say: "You press the cloth against the stone round the woman, and rub with the charcoal until she comes up out of the rock in black: her hands, her knees, the well, the flame at her knee, small and exact. When you lift the cloth she is still on the wall as well. She does not seem to mind being in two places, having been in one for so long." },
        { remove: "object", id: "cloth" },
        { move: "rubbing", to: "player" }
      ] } },
    { add: "rule", rule: { id: "rub_painting_with", match: { verb: ["use", "put"], obj: ["cloth", "charcoal"], obj2: "painting" },
      if: [{ "cloth.at": "player" }, { "charcoal.at": "player" }],
      do: [
        { say: "You press the cloth against the stone round the woman, and rub with the charcoal until she comes up out of the rock in black: her hands, her knees, the well, the flame at her knee, small and exact. When you lift the cloth she is still on the wall as well. She does not seem to mind being in two places, having been in one for so long." },
        { remove: "object", id: "cloth" },
        { move: "rubbing", to: "player" }
      ] } },

    // Afternoon stands for a place with someone in it
    { add: "rule", rule: { id: "show_rubbing", match: { verb: ["show", "give", "use"], obj: "rubbing", obj2: "afternoon" },
      if: [{ "afternoon.standing": false }],
      do: [
        { say: "You hold the cloth up in front of her. She looks at it for a long time: at the woman, and the flame, and the open hands. Then she looks at you, as at someone who has finally said it. She gets up, back legs and then front, like a house raised in the wrong order, and the empty goatskin slides off her saddle into your hands." },
        { set: "afternoon.standing", to: true },
        { move: "skin", to: "player" },
        { set: "afternoon.note", to: "Standing. Looking east." },
        { set: "afternoon.examine", to: "A tall white dromedary, standing as if she had always meant to. Her lip is long and her opinion of you is longer. She is looking east, at something she can smell." },
        { set: "lines.describe", to: [
          "The camels are kept south of the camp in a long row, all facing the same way. Since the well went quiet they have knelt. Today one of them is standing, and the rest look at her as at someone who has said something.",
          "{Afternoon|afternoon}, the white lead camel, stands at the end of the row under her saddle, looking east. {Aghali|aghali} has stopped tying the load. Washing hangs between two posts. The camp is north."
        ] },
        { draw: "lines", remove: afterStand.remove, add: afterStand.add }
      ] } },
    { add: "rule", rule: { id: "show_rubbing_again", match: { verb: ["show", "give", "use"], obj: "rubbing", obj2: "afternoon" },
      do: [{ say: "Afternoon has seen it. She stands, and looks east, and goes on looking." }] } },

    // the skin and the pool
    { add: "rule", rule: { id: "fill_skin_pool", match: { verb: ["put", "use"], obj: "skin", obj2: "pool" },
      do: [{ change: "skin_filled" }] } },
    { add: "rule", rule: { id: "fill_skin_word", match: { verb: "fill", obj: "skin" }, if: [{ "player.at": "cistern" }],
      do: [{ change: "skin_filled" }] } },
    { add: "rule", rule: { id: "fill_skin_nowhere", match: { verb: "fill", obj: ["skin", "water_skin"] },
      do: [{ say: "There is nothing here to fill it from. The water that matters is underground, and listening." }] } },

    // the full skin and the well
    { add: "rule", rule: { id: "pour_well", match: { verb: ["put", "use"], obj: "water_skin", obj2: "well" },
      do: [{ change: "well_filled" }] } },
    { add: "rule", rule: { id: "pour_word", match: { verb: "pour", obj: "water_skin" }, if: [{ "player.at": "camp" }],
      do: [{ change: "well_filled" }] } },
    { add: "rule", rule: { id: "pour_nowhere", match: { verb: "pour", obj: "water_skin" },
      do: [{ say: "Not here. It came a long way up to be spilled on sand." }] } },

    // the bell and the ride
    { add: "rule", rule: { id: "bell_camel", match: { verb: ["give", "put", "use", "hang"], obj: "bell", obj2: "afternoon" },
      if: [{ "afternoon.standing": true }],
      do: [
        { say: "You hang the bell from her collar. She moves her head once, to hear it, and then holds still for the length of a breath, as a person does who has heard her name." },
        { set: "afternoon.belled", to: true },
        { move: "bell", to: "afternoon" }
      ] } },
    { add: "rule", rule: { id: "bell_camel_kneeling", match: { verb: ["give", "put", "use", "hang"], obj: "bell", obj2: "afternoon" },
      do: [{ say: "She does not look. A bell is for a camel that has somewhere to be." }] } },
    { add: "rule", rule: { id: "ride_belled", match: { verb: ["climb", "enter", "sit"], obj: "afternoon" },
      if: [{ "afternoon.belled": true }],
      do: [
        { say: "You climb on, and Afternoon rises under you and does not look back. Aghali is already at the head of the line, with the skins swinging full on the camels behind, and the bell has begun. Behind you Fadimata stands at the tent flap with the pot in her hand, not waving. Every shadow in the camp turns at once and lies down towards the east, where the smoke is." },
        { say: "The caravan walks out into the sand sea. The dunes are not the same in every direction any more." },
        { end: true, picture: "departed" }
      ] } },
    { add: "rule", rule: { id: "ride_standing", match: { verb: ["climb", "enter", "sit"], obj: "afternoon" },
      if: [{ "afternoon.standing": true }],
      do: [{ say: "She stands, patient, and does not move off. Something is missing from her, and she is not going to say what. You think of the well, and of what comes up from it." }] } },
    { add: "rule", rule: { id: "ride_kneeling", match: { verb: ["climb", "enter", "sit"], obj: "afternoon" },
      do: [{ say: "You put a foot on her folded leg. She is a hill, and a hill that has made up its mind." }] } },

    // ---- the endings' pictures ----------------------------------------------------------------------------------
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, alt: p.alt, picture: p.picture })),

    // ---- the puzzles --------------------------------------------------------------------------------------------
    { add: "puzzle", id: "get_lamp", where: "tent", needs: [], solve: ["take lamp", "light lamp"], gives: ["lamp"],
      clues: ["lamp", "fadimata", "painting"],
      hints: ["The dark under the red rock is older than manners, says someone in a black tent.", "Take the clay lamp from the shelf in the black tent, and light it."] },
    { add: "puzzle", id: "get_cloth", where: "lines", needs: [], solve: ["take cloth"], gives: ["cloth"],
      clues: ["cloth", "aghali", "afternoon"],
      hints: ["Nobody is using the white cloth drying on the line by the camels.", "Take the white cloth from the line in the camel lines."] },
    { add: "puzzle", id: "get_charcoal", where: "camp", needs: [], solve: ["take charcoal"], gives: ["charcoal"],
      clues: ["charcoal", "painting"],
      hints: ["The fire pushes out what it cannot finish burning.", "Take the charcoal from the edge of the fire in the camp."] },
    { add: "puzzle", id: "copy_woman", where: "gallery", needs: ["lamp", "cloth", "charcoal"], solve: ["rub painting"], gives: ["rubbing"],
      clues: ["painting", "afternoon", "cloth", "charcoal"],
      hints: ["The stone round the painted woman is smooth enough to keep what is pressed on it.", "Rub the painted woman with the charcoal, with the cloth over her."] },
    { add: "puzzle", id: "stand_camel", where: "lines", needs: ["rubbing"], solve: ["show rubbing to camel"], gives: ["skin"],
      clues: ["afternoon", "rubbing", "painting", "fadimata"],
      hints: ["A camel stands for a place where someone is expecting her.", "Show the rubbing of the painted woman to Afternoon."] },
    { add: "puzzle", id: "fill_skin", where: "cistern", needs: ["skin", "lamp"], solve: ["put skin in pool"], gives: ["water_skin"],
      clues: ["pool", "fadimata", "skin"],
      hints: ["The river runs west into the rock, and ends where the water is still.", "Put the goatskin in the pool in the cistern, under the painted gallery."] },
    { add: "puzzle", id: "fill_well", where: "camp", needs: ["water_skin"], solve: ["put skin in well"], gives: ["bell"],
      clues: ["well", "fadimata", "water_skin"],
      hints: ["A well is a long listening. It has been waiting to be given something to say.", "Put the full goatskin in the well in the camp."] },
    { add: "puzzle", id: "depart", where: "lines", needs: ["bell", "stand_camel"], solve: ["give bell to camel", "climb camel"], ending: true,
      clues: ["bell", "afternoon", "cairn"],
      hints: ["A caravan leaves when its bell rings, and the camel knows where.", "Give the bell to Afternoon, and ride her."] },
    { add: "puzzle", id: "stay", where: "tent", needs: [], solve: ["order tea", "drink tea", "order tea", "drink tea", "order tea", "drink tea"], ending: true,
      clues: ["tea", "fadimata"],
      hints: ["Fadimata pours in threes. Most guests leave before the last.", "Order tea and drink it, three times, and stay."] },
    { add: "puzzle", id: "lost", where: "camp", needs: [], solve: ["go east"], ending: true,
      clues: ["aghali", "fadimata"],
      hints: ["The tracks go east into the sand and do not come back. Nobody walks east alone.", "Walk east from the camp, alone."] }
  ]
};
