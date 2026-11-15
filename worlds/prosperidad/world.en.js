// "Emperor of Prosperidad": a world after the opening, in English, written the way the AI is asked to write a world (BRIEF.md). One
// change set, all or nothing; plain data. The Spanish version (world.es.js) is written on its own, not translated: same ids, rooms, rules
// and endings, other words. The pictures, sprites and music are shared (pictures.js, sprites.js, music.js): they have no words.

import pictures, { endings } from "./pictures.js?v=0.54.0";
import music, { rooms as roomMusic } from "./music.js?v=0.54.0";
import levels from "./levels.js?v=0.54.0";
import sprites from "./sprites.js?v=0.54.0";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Emperor of Prosperidad",
  blurb: "Prosperidad, 1985: a grey city that only has colour after dark. You are Emperador to the strip, a punk with no crown, until a parcel arrives with your name.",
  thumbnail: { picture: "avenida", x: 40 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  style: "flat",
  palettes: "neon: the strip, the club floor, the corner, the plaza and the blind alley (night as a soft glow); lamplight: the lit rooms with a bulb or a candle (backstage, the bar, the pension, room seven, the occupied house); institution: the fluorescent rooms (the depot, the launderette); moonlight: the open dark above and beyond the lights (the patio, the roof, the cutting); ember: the works, lit by one furnace",
  genre: "picaresque",
  strangeness: "3 (drawn 3: the seed is a real-feeling city in a real-feeling year, but a made-up one, so it stays)",
  size: "large",
  ingredient: "a mail-order catalogue; a chimney sweep",
  discarded: [
    "a dealer who sells hours of the night, and a countdown to dawn",
    "a police raid on the club as the climax, with the strip scattering",
    "a tragic fall into addiction told as a warning, with a sad ending that proves a point"
  ],
  synopsis: "You are Emperador, a street punk of Prosperidad, a grey city in the mid-1980s, which only has colour after dark, " +
    "and only for those who can pay for it. Tonight a mail-order parcel with your name on it is waiting at the all-night depot, " +
    "and in a city where nobody orders from the catalogue and nobody refuses a parcel, you set out across the strip, the " +
    "squats and the club to find out what the delivery costs and who is owed what.",
  stuff: "pesetas and duros, a transistor radio, laundry tokens, a chimney sweep's brush and a jar of soot, kohl, a hand stamp in UV ink, " +
    "a mirror ball, a pensión that rents by the hour, a pigeonhole depot, shutters that open once the night is old, a dead fountain in the Plaza del Carbón, a tape with no label, " +
    "sequinned jackets on a coat rail, anisette, a bus ticket for the five-ten",
  tone: "Picaresque: a sly, hungry narrator who prices everything and counts who owes whom, quick short sentences with a sting at the end, " +
    "frank about bodies, work and chemistry and never judging, fond of the people, fond of a grift. It notices what things cost and who is " +
    "standing in doorways; it leaves out sermons and sentiment. The mood is wry and tender, a night that is hard on everyone and funny anyway. " +
    "\"The strip sells everything twice: once to the customer, once to whoever says he saw it.\" " +
    "\"Marisol works the corner with the patience of a bank and the manners of a duchess.\" " +
    "\"In Prosperidad the colour comes on after dark, and somebody always sends the bill.\"",
  start: "Saturday, 01:10, on the Avenida (the opening, in the blind alley, at 01:00).",
  rules: [
    "Prosperidad is grey by day and only has colour after dark, and everything that shines has been paid for.",
    "The machines of the Lavandería give back what you are missing, clean and wrong.",
    "The mail-order book delivers to whoever it names; nobody has ever ordered from it, and nobody has ever refused a parcel.",
    "The chimneys keep the city's grey, and whoever sweeps one gets the soot."
  ],
  opening: "A blind alley behind a club: a transistor radio on a crate (hints), a torn catalogue page you already carry (why you came). The fire door at the far end is the way on.",
  music: "a nervous dorian shuffle heard through a club wall; a bass drum that misses a beat, a cheap guitar on one chord and a chimney sweep's whistle; the radio between stations",
  characters: ["Cuco, the DJ of the Submarino", "Marisol, who works the corner", "Doña Remedios, of the all-night depot", "Tomás, the chimney sweep",
    "Don Nicanor, of the Pensión Esperanza", "the Apothecary, of Los Galgos"],
  endings: [
    "Crowned: pay for the parcel and sign for it as Emperador.",
    "Named: pay for the parcel and sign for it with the name your mother gave you, and take the five-ten.",
    "Colour: take the sweep's brush up the great chimney at the works."
  ],
  chaos: 0.3
};

// Carried things get their sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// What the depot accepts when it asks in whose name it is signed (rules: sign_*), each also as "I am ...", "my name is ..." and "it is ...".
const said = (names) => names.flatMap(n => [n, "it is " + n, "i am " + n, "my name is " + n, "call me " + n, "sign " + n]);
const CROWN = said(["emperador", "emperor", "the emperor", "el emperador", "emperador of prosperidad"]);
const NAME = said(["dani"]);

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  crowned: { alt: "The Avenida at night from across the road: a small figure in a gold paper crown stands on a crate in the middle of the strip, with a ring of dark silhouettes round it and neon on every shopfront.", picture: endings.crowned },
  named: { alt: "A bus stop at grey dawn: a night bus with its windows lit yellow, and a small figure with a plain suitcase at the step, the city behind them in grey.", picture: endings.named },
  colour: { alt: "The great chimney of the works seen from the cutting at morning, soot blowing away from its top in a grey cloud, and below it the whole city turning yellow, red and green.", picture: endings.colour }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "callejon": the opening, never returned to. Area "club": the back room and the floor. Area "calle" (x grows east, y south):
// the Avenida with the depot east and Los Galgos west, the corner south of it with the pension east and the launderette west, the
// plaza below. Area "casa": the portal, the patio and the roof. Area "vias": the cutting and the works.
const rooms = {
  callejon: {
    name: "THE BLIND ALLEY", area: "callejon", at: [0, 0, 0],
    describe: [
      "Grey brick on both sides and a wall behind: the back of a club, with crates, a bin and puddles that hold the pink of a neon tube. The tube has been saying half a word since the spring.",
      "The only way on is the {fire door|puerta} at the far end. It has no handle on this side, only a bar, and a dent where others have asked."
    ],
    exits: { n: true },
    scenery: [
      { words: ["bin", "dustbin", "rubbish", "lid"], name: "the bin", says: "Full. It has been full since before the club had a name, and it keeps its own counsel." },
      { words: ["crates", "crate", "bottles"], name: "the crates", says: "Beer crates, empty, stacked by someone with a better memory for the stack than for the beer." },
      { words: ["puddles", "puddle", "water", "pink"], name: "the puddles", says: "Rainwater the colour of the sign. In Prosperidad even the puddles take colour after dark." },
      { words: ["tube", "sign", "neon", "word"], name: "the neon tube", says: "Half a word in pink glass, the other half dead. Whatever it was selling, it has stopped." },
      { words: ["wall", "walls", "brick", "bricks", "graffiti", "club"], name: "the walls", says: "Grey brick, and on it in black marker the names of people who stood here before you and were also waiting for something." }
    ],
    ambience: { lines: [
      "Through the brick, somebody's bass line turns over and goes back to sleep.",
      "A cat crosses the far end of the alley, looks at the fire door, and decides against it.",
      "The neon tube ticks. It is the only thing here with ambitions.",
      "Rain that has not fallen yet makes up its mind on the bin lid."
    ], every: [25, 60] },
    alt: "A blind alley at night between two grey brick walls: a pink neon tube on the left wall, a bin and stacked crates against the bricks, and a steel fire door closing the far end.",
    overlayAlt: { radio: "A small transistor radio stands on a crate, its aerial out." }
  },
  trastienda: {
    name: "BACKSTAGE", area: "club", at: [0, 0, 0],
    describe: [
      "Backstage at the Submarino: amplifier cases, a coat rail of sequinned jackets, a mirror ringed with bulbs, half of them dead. A {guitar case|funda} lies on its back on the floor, belonging to nobody who is looking.",
      "The beat comes through the curtain to the east, the bass turned up and the treble turned away. The fire door has closed behind you and gone back to being wall."
    ],
    exits: { e: "pista" },
    scenery: [
      { words: ["amps", "amp", "amplifier", "amplifiers", "cases", "speakers"], name: "the amplifier cases", says: "Black boxes with the club's name stencilled on, and under the name somebody's phone number, crossed out twice." },
      { words: ["rail", "jackets", "jacket", "sequins", "coats"], name: "the coat rail", says: "Sequinned jackets in sizes for people who no longer need them. They throw the bulbs back at you in small change." },
      { words: ["mirror", "bulbs", "bulb"], name: "the mirror", says: "You look like someone who is owed money and is not going to mention it. The mirror takes your side." },
      { words: ["curtain", "velvet"], name: "the curtain", says: "Black velvet gone grey at hand height. It breathes in time with the bass.", leads: "e" }
    ],
    ambience: { lines: [
      "A bulb in the mirror goes out, and the others look at each other.",
      "Somebody on the floor cheers, a long way off, for something that happened a minute ago.",
      "The coat rail shivers with the bass and throws sequins around the ceiling."
    ], every: [30, 70] },
    alt: "A cluttered backstage room at night: a mirror ringed with bulbs, a rail of sequinned jackets, stacked amplifier cases, a guitar case on the floor, and a black curtain on the right leading to the club."
  },
  pista: {
    name: "THE SUBMARINO", area: "club", at: [1, 0, 0],
    describe: [
      "The Submarino at one in the morning: a low black ceiling, a mirror ball turning grey into pink, and some three hundred people who have agreed not to look at the clock. A dancer, bare to the waist, works the podium like a shift.",
      "{Cuco|cuco} runs the booth, one deck short of a night. The backstage curtain is west. The street entrance is south."
    ],
    exits: { w: "trastienda", s: "avenida" },
    scenery: [
      { words: ["dancer", "podium", "dancing"], name: "the dancer", says: "Bare to the waist and unbothered, a woman with the posture of a metronome and the look of someone counting the house." },
      { words: ["ball", "mirror", "mirrorball", "ceiling"], name: "the mirror ball", says: "Half its mirrors have gone. The ones that remain throw pink on the crowd, and the crowd is grateful." },
      { words: ["crowd", "people", "dancers", "floor", "bodies"], name: "the crowd", says: "Punks, sailors on leave from a city with no sea, couples who are not couples. Everyone has paid, one way or another." },
      { words: ["booth", "decks", "deck", "turntable", "turntables", "records"], name: "the booth", says: "A plywood box and two turntables. One of them is quiet in a way that costs somebody." },
      { words: ["entrance", "street", "stamp", "stamps"], name: "the street entrance", says: "A velvet rope and a hand stamp in ink that glows. Everyone who leaves has a small blue ghost on the back of the hand.", leads: "s" }
    ],
    ambience: { lines: [
      "The bass finds your ribs and moves in.",
      "A cheer goes up for no reason that survives the next song.",
      "Somebody dances alone, and well, and nobody mentions it.",
      "The mirror ball throws a pink coin across your hand and takes it back."
    ], every: [30, 70] },
    alt: "The dance floor of a club at night: a mirror ball over a crowd of dark silhouettes, a bare-chested dancer on a podium on the left, and a DJ in a plywood booth on the right, magenta and cyan light over everything.",
  },
  avenida: {
    name: "THE AVENIDA", area: "calle", at: [0, 0, 0],
    describe: [
      "The strip: one long avenue of grey shutters that open, once the night is old, into every colour that costs money. Neon runs wet on the road, and the pavement belongs to whoever is standing on it.",
      "The Submarino's black front is north. The depot, the Estafeta, is east and Los Galgos bar west. South the avenue bends to the corner."
    ],
    exits: { n: "pista", e: "estafeta", w: "bar", s: "esquina" },
    scenery: [
      { words: ["shutters", "shutter", "shopfronts", "shops", "shopfront"], name: "the shutters", says: "Half up, half down, like eyelids. Behind them someone sells something that is not on the sign." },
      { words: ["neon", "signs", "sign", "tubes", "colour", "colours"], name: "the neon", says: "Pink, cyan, a red that is rented by the month. Every tube here is somebody's rent." },
      { words: ["road", "street", "avenue", "avenida", "kerb", "pavement"], name: "the road", says: "Wet black, with the signs repeated in it as soft streaks. Nobody has driven on it in an hour." },
      { words: ["club", "submarino", "front"], name: "the Submarino", says: "A black front with a round window like a porthole and a queue that moves when it feels like it.", leads: "n" },
      { words: ["people", "doorways", "doorway", "figures", "men", "women"], name: "the people in the doorways", says: "They stand in the dry and watch the street like shopkeepers. Most of them are." }
    ],
    ambience: { lines: [
      "A car comes down the avenue at walking pace, looks at everything, and takes nothing.",
      "A shutter goes up with a noise like a cough, and a room full of pink is for sale.",
      "Someone laughs in a doorway, and somebody else stops.",
      "A radio plays through a window, a song you almost know, in the wrong key for the street."
    ], every: [30, 70] },
    sleep: "Not on the strip. Somebody would sell you, and you would not see the money.",
    alt: "The Avenida at night, looking north along a wet street: shutters and neon signs on both sides in pink, cyan and magenta, the black front of a club with a round porthole window at the far end, and people standing in the doorways."
  },
  esquina: {
    name: "THE CORNER", area: "calle", at: [0, 1, 0],
    describe: [
      "The corner where the avenue bends, with the one street lamp that works. {Marisol|marisol} has stood under it for eleven years and speaks of it as other women speak of a lease.",
      "The Pensión Esperanza is east, the Lavandería west, the avenue north. A little plaza opens south."
    ],
    exits: { n: "avenida", e: "pension", w: "lavanderia", s: "plaza" },
    scenery: [
      { words: ["lamp", "lamppost", "post", "light"], name: "the street lamp", says: "A pole and an orange globe. It lights a circle of pavement with a rent that Marisol pays in manners." },
      { words: ["pension", "esperanza", "sign"], name: "the Pensión Esperanza", says: "A narrow front with a green sign, ROOMS BY THE HOUR in letters that have heard everything.", leads: "e" },
      { words: ["launderette", "lavanderia", "lavandería", "laundry"], name: "the Lavandería", says: "A bright window full of white machines, open all night, as though somebody had to wash the night off.", leads: "w" },
      { words: ["pavement", "kerb", "corner", "street"], name: "the pavement", says: "Worn at one spot into a pale oval, the size of a person's patience." },
      { words: ["cars", "car", "traffic"], name: "the cars", says: "They come round slowly with their windows down and their minds half made up." }
    ],
    ambience: { lines: [
      "A car slows at the kerb, Marisol shakes her head without turning round, and it speeds up.",
      "Someone in the pensión flushes a cistern, and the whole corner hears it.",
      "The lamp buzzes and dims, and brightens again, as if it had remembered the rent.",
      "A woman comes out of the Lavandería with a clean sheet over her arm and walks off down the avenue like a ghost with a receipt."
    ], every: [30, 70] },
    sleep: "Not on the corner. It is somebody's place of work.",
    alt: "A street corner at night under one orange lamp: a woman in a short coat stands by the lamp post on the left, a green-signed pensión on the right, a bright launderette window further along, and neon colour on the wet road."
  },
  estafeta: {
    name: "THE ESTAFETA", area: "calle", at: [1, 0, 0],
    describe: [
      "A post depot that never shut, because nobody told it how. Pigeonholes to the ceiling, a strip light that stutters, and a long counter where {Doña Remedios|remedios} stamps things that have not been sent yet.",
      "On the shelf behind her a brown parcel waits, addressed to Emperador. The avenue is west."
    ],
    exits: { w: "avenida" },
    scenery: [
      { words: ["parcel", "package", "box", "label"], name: "the parcel", says: "A brown parcel with string and wax, and a label with your name in a hand that has never met you. Doña Remedios is keeping it for the paying." },
      { words: ["pigeonholes", "pigeonhole", "holes", "letters", "mail", "post"], name: "the pigeonholes", says: "Thousands of them, every one stuffed. Nobody collects. The post is waiting for the people to get better at being addressed." },
      { words: ["counter", "stamps", "stamp", "stamping", "ink"], name: "the counter", says: "Brass-edged and scratched, with an inkpad in the middle the colour of a bruise." },
      { words: ["light", "strip", "tube", "ceiling"], name: "the strip light", says: "It stutters on a long grey note. Under it, everyone looks like a form." },
      { words: ["notice", "sign", "rules"], name: "the notice", says: "\"DELIVERIES AGAINST PAYMENT. NO PAYMENT, NO SIGNATURE. NO NAME, NO PARCEL.\" Someone has added \"NO KIDDING\" in pencil." }
    ],
    ambience: { lines: [
      "A stamp comes down on something, a clean flat note, like a small door closing.",
      "A pigeonhole coughs up a letter, and Doña Remedios files it back without reading.",
      "The strip light stutters, and in the gap the parcel on the shelf has moved a finger's width, and moves back."
    ], every: [30, 70] },
    alt: "A post depot at night under a strip light: pigeonholes up the whole back wall, a long counter with a stout woman in a cardigan behind it on the left, and a brown parcel tied with string on a shelf on the right.",
  },
  bar: {
    name: "LOS GALGOS", area: "calle", at: [-1, 0, 0],
    describe: [
      "Los Galgos: a zinc bar, a jukebox with one song in it, and a smell of anisette and wet coats. The regulars lean in a row like greyhounds in their traps, which is the name's whole joke.",
      "{The Apothecary|boticaria} keeps the end stool and a small leather bag, and does business in the voice of a woman selling aspirin. The avenue is east."
    ],
    exits: { e: "avenida" },
    scenery: [
      { words: ["bar", "zinc", "counter", "barman", "glasses", "anisette"], name: "the bar", says: "Zinc, dented by a century of elbows and one anniversary. The anisette comes in glasses the size of a thimble and costs the size of a cup." },
      { words: ["jukebox", "song", "music"], name: "the jukebox", says: "One song, over and over, about a girl who is always on the next train. The regulars have all met her." },
      { words: ["regulars", "greyhounds", "men", "drinkers", "stools"], name: "the regulars", says: "A row of backs in anoraks, each with a glass and a grievance, never the same grievance twice in a row." },
      { words: ["bag", "wraps", "paper", "papers", "powder", "pills"], name: "the leather bag", says: "Small square wraps of paper, folded with care, and a few brown bottles. The trade is quiet, regular and never the first topic." },
      { words: ["sign", "beer"], name: "the beer sign", says: "A neon bottle in green, half lit. It makes everyone's face look as though it had already heard the news." }
    ],
    ambience: { lines: [
      "The jukebox begins the same song for the fourth time and the regulars sigh in unison.",
      "Someone puts down a glass with the care of a man putting down an argument.",
      "The Apothecary writes a figure on a paper napkin and folds it into a very small square."
    ], every: [30, 70] },
    alt: "A smoky bar at night: a zinc counter along the back, a row of backs in anoraks on stools on the left, a jukebox glowing in the corner, and a woman with a leather bag on the end stool on the right.",
  },
  pension: {
    name: "PENSIÓN ESPERANZA", area: "calle", at: [1, 1, 0],
    describe: [
      "The lobby of a pensión that rents by the hour, by the night and, once, by the year. A key board, a brass bell, a runner worn to the weave on the way to the stairs.",
      "{Don Nicanor|nicanor} keeps the desk, and a ledger he calls the Book of Hours. The {stairs|escalera_pension} climb to the rooms. The corner is west."
    ],
    exits: { w: "esquina", u: "pension_hab" },
    scenery: [
      { words: ["desk", "bell", "brass", "counter"], name: "the desk", says: "A varnished desk with a bell nobody rings. Everyone who comes here is expected." },
      { words: ["keys", "key", "board", "hooks"], name: "the key board", says: "Twelve hooks, ten keys. Two hooks have names pencilled under them instead of numbers." },
      { words: ["runner", "carpet", "weave"], name: "the runner", says: "Red once. Now the colour of a long habit." },
      { words: ["ledger", "book", "hours", "register"], name: "the ledger", says: "The Book of Hours, in a clerk's hand: names, rooms, lengths of stay. Don Nicanor reads it aloud when he is lonely." }
    ],
    ambience: { lines: [
      "Upstairs a bed answers a question, and Don Nicanor turns a page.",
      "The bell on the desk rings once, untouched, and nobody comes to see why.",
      "A couple come down the stairs not looking at each other and out into the avenue not looking at anything."
    ], every: [30, 70] },
    sleep: "Not in the lobby. Don Nicanor sells the beds upstairs, by the hour, and does not give away the floor.",
    alt: "A narrow pensión lobby lit by one lamp: a varnished desk with a thin man behind it on the right, a board of keys on the wall, and a staircase with a worn red runner on the left going up into the dark."
  },
  pension_hab: {
    name: "ROOM SEVEN", area: "calle", at: [1, 1, 1],
    describe: [
      "Room seven: a bed made tight, a wardrobe, a wash-stand with a cracked basin and a window onto a neon sign, so that the whole room goes pink and off pink every four seconds. It is clean, and it is somebody's.",
      "A {kohl pot|kohl} stands on the wash-stand, scraped to the bottom. On the wallpaper by the bed there is a {scrawl|pintada} in lipstick. The stairs go down."
    ],
    exits: { d: "pension" },
    scenery: [
      { words: ["bed", "blanket", "sheets", "pillow"], name: "the bed", says: "Made tight enough to bounce a duro. The sheets are clean, and the clean is the point." },
      { words: ["wardrobe", "clothes", "dresses", "dress", "hangers"], name: "the wardrobe", says: "A few dresses on wire hangers, each a different night. At the back, a man's jacket that nobody has had the heart to return." },
      { words: ["basin", "wash-stand", "washstand", "jug", "water", "mirror"], name: "the wash-stand", says: "A cracked basin, a jug, a mirror the size of a hand. Whoever lives here does her face by feel." },
      { words: ["window", "sign", "neon", "curtain"], name: "the window", says: "A pink sign across the road: HOTEL, with the O dead. It is the only light in the room, and it goes on and off like a pulse." }
    ],
    ambience: { lines: [
      "The sign across the road goes pink, then off, then pink, like a slow pulse.",
      "Through the floor, a bed in the room below answers a question.",
      "The wardrobe settles. The jacket at the back swings on its hanger, once."
    ], every: [30, 70] },
    sleep: "Not in somebody's room. Not without being asked.",
    alt: "A small pensión room lit pink by a neon sign through the window: a tight-made bed with a red blanket, a wardrobe, a wash-stand with a basin and a small mirror, and lipstick writing on the wallpaper by the bed."
  },
  lavanderia: {
    name: "THE LAVANDERÍA", area: "calle", at: [-1, 1, 0],
    describe: [
      "A launderette open all night, because the machines do not sleep and nobody dares tell them. A wall of washers, a bench bolted to the floor, and a {big dryer|secadora} at the end with a slot for tokens and a window like a porthole.",
      "What goes into the machines comes out clean, and sometimes it comes out as something else: the sign says nothing about that. The corner is east."
    ],
    exits: { e: "esquina" },
    scenery: [
      { words: ["washers", "washer", "washing", "machines", "drums", "drum"], name: "the washers", says: "Ten white drums turning in ten small seas. Each one is full of somebody's week." },
      { words: ["bench", "seat", "bolts"], name: "the bench", says: "Bolted to the floor for reasons the launderette keeps to itself. A good place to wait, and a bad place to be asked to move." },
      { words: ["sign", "notice", "instructions", "slot"], name: "the sign", says: "\"TOKENS ONLY. NO TOKENS, NO WASH. NOT RESPONSIBLE FOR WHAT COMES BACK.\"" },
      { words: ["window", "porthole", "glass"], name: "the porthole", says: "A round glass in the dryer's door. In it, something is tumbling slowly, and it is not laundry." },
      { words: ["light", "lights", "tube", "tubes"], name: "the tubes", says: "Cold white, the light of a place that wants you to leave but has no objection to you staying." }
    ],
    ambience: { lines: [
      "A drum finishes its cycle with a long sigh, and the whole wall considers it.",
      "The dryer tumbles something in its window, and gives it a name you almost catch.",
      "A sock goes by in the porthole, and the dryer looks proud."
    ], every: [30, 70] },
    sleep: "Not on the bench. The machines would wash you.",
    alt: "A launderette at night under cold white tubes: a row of white washing machines along the back wall, a bolted bench on the left, and a large dryer with a round glass door on the right.",
  },
  plaza: {
    name: "PLAZA DEL CARBÓN", area: "calle", at: [0, 2, 0],
    describe: [
      "A square with a dead fountain and one sodium lamp, orange in a city that spends its colour after dark. Coal was sold here once. The name outlived the coal, as names do.",
      "Tenements ring it, each window a different shade of lit. The corner is north; behind you, south, is the portal of the casa tomada, and the cutting lies east."
    ],
    exits: { n: "esquina", s: "casa", e: "terraplen" },
    scenery: [
      { words: ["fountain", "basin", "dry"], name: "the fountain", says: "A stone basin with a dead fish for a spout, dry since before the sailors left. Someone has filled it with flowerpots and bottle tops." },
      { words: ["lamp", "sodium", "lamppost"], name: "the sodium lamp", says: "Orange. The only light in Prosperidad that is the same colour all day, which is why nobody trusts it." },
      { words: ["tenements", "tenement", "windows", "window", "buildings", "washing"], name: "the tenements", says: "Six floors of grey, and a window on every floor lit another colour: green with a television, red with a bulb, blue with something nobody wants to see." },
      { words: ["casa", "portal", "squat", "house"], name: "the casa tomada", says: "A tall grey house with a bicycle chained in its portal and a flag in a window. Twelve families, some of them related.", leads: "s" },
      { words: ["cutting", "railway", "line", "tracks"], name: "the cutting", says: "A gap between two tenements where the railway used to be. At the end of it, a very tall chimney against the sky.", leads: "e" }
    ],
    ambience: { lines: [
      "A window opens in a tenement, a bowl of dishwater arrives, and the window closes.",
      "The sodium lamp ticks as it cools, and the whole square listens.",
      "A child, up much too late, sits on the dead fountain and tells it something."
    ], every: [30, 70] },
    sleep: "Not in the square. The lamp never turns off, and neither do the neighbours.",
    alt: "A small square at night: a dry stone fountain with flowerpots in it in the middle, one orange sodium lamp on the left, and tall tenements all round with windows lit in green, red and blue."
  },
  casa: {
    name: "THE CASA TOMADA", area: "casa", at: [0, 0, 0],
    describe: [
      "The portal of the casa tomada, looking south: a wall of letterboxes, every one stuffed, and a bicycle chained to a radiator that gave up on the building in 1979. A candle burns on the first stair, paid for by a rota.",
      "The hall runs on to the patio and its light. The plaza is behind you, north."
    ],
    exits: { n: "plaza", s: "patio" },
    scenery: [
      { words: ["letterboxes", "letterbox", "boxes", "mail", "post"], name: "the letterboxes", says: "Forty boxes with names in felt-tip. Every one is stuffed with the same book: the mail-order book, unopened, a fresh copy for each tenant, every season." },
      { words: ["bicycle", "bike", "radiator", "chain"], name: "the bicycle", says: "Chained to a radiator that stopped heating the building in 1979. The bicycle has a flat tyre and a very good lock, which is the usual way round in this city." },
      { words: ["candle", "stair", "stairs", "rota"], name: "the candle", says: "A stub in a saucer on the first stair. A paper beside it lists the names of those who have paid for tonight's wax, and the rota is longer than the candle." },
      { words: ["graffiti", "slogans", "wall", "walls", "posters"], name: "the walls", says: "Slogans on slogans, posters on posters, so many layers that the building is mostly paper. One says, in red, WHAT IS FOR SALE IS NOT YOURS." },
      { words: ["hall", "corridor", "tiles"], name: "the hall", says: "Black and white tiles, mostly black. It leads south, towards the patio's cold clean light." }
    ],
    ambience: { lines: [
      "A baby cries upstairs, and somebody sings over it in a language nobody here speaks.",
      "The candle leans, as if somebody had asked it something.",
      "A door slams on the third floor, and a bicycle in the hall rings its own bell once."
    ], every: [30, 70] },
    sleep: "Not in the portal. There is a rota for floor space, and you are not on it.",
    alt: "The hall of an occupied house at night, looking south: a wall of stuffed letterboxes on the left, a bicycle chained to a radiator on the right, a candle on the first stair, and at the far end a bright square of the patio."
  },
  patio: {
    name: "THE PATIO", area: "casa", at: [0, 1, 0],
    describe: [
      "A courtyard open to the sky, six floors of washing lines and candle-lit windows. Someone has painted the walls the colour of a sky they cannot see, and the rain has taken most of it back.",
      "An iron {ladder|escalera_patio} climbs the north wall to the roof. The hall is back north."
    ],
    exits: { n: "casa", u: "azotea" },
    scenery: [
      { words: ["washing", "lines", "line", "sheets", "clothes"], name: "the washing", says: "Sheets, shirts and one enormous pair of trousers, hung out in the hope of a sun." },
      { words: ["windows", "window", "candles", "candle", "floors"], name: "the windows", says: "Candles in the windows, six floors of them. The building has no power and a great deal of light." },
      { words: ["walls", "wall", "paint", "sky"], name: "the walls", says: "Painted blue by someone with ambition and a short budget. A cloud has been added in white, and rubbed out with a sleeve." },
      { words: ["sky", "stars", "star"], name: "the sky", says: "A square of grey with the neon of the city underlit on it. The stars have been given the night off." },
      { words: ["flagstones", "stones", "puddles"], name: "the flagstones", says: "Cracked, and green in the cracks. A child has chalked hopscotch on them, up to a number that does not exist." }
    ],
    ambience: { lines: [
      "A sheet flaps on its line, and for a moment it is a ghost with good manners.",
      "From a high window, a guitar plays the same four chords and learns them again.",
      "Rain begins and thinks better of it."
    ], every: [30, 70] },
    sleep: "Not in the open. The whole house would see.",
    alt: "A tall courtyard at night seen from its floor: six storeys of grey wall with candle-lit windows and washing lines, a patch of dark sky at the top, and an iron ladder going up the right-hand wall."
  },
  azotea: {
    name: "THE ROOF", area: "casa", at: [0, 1, 1],
    describe: [
      "The roof of the casa tomada: tar, aerials and a row of chimney pots standing in the dark like a congregation. The whole city lies below, grey by day and wet colour now.",
      "{Tomás|tomas} sits on the ridge in the dark, black from head to foot. The only clean things about him are the whites of his eyes. The ladder goes down."
    ],
    exits: { d: "patio" },
    scenery: [
      { words: ["pots", "pot", "chimneys", "chimney", "row", "congregation"], name: "the chimney pots", says: "Eleven pots, brick and clay, each with a cap of soot. Only the twelfth, further off, still draws." },
      { words: ["aerials", "aerial", "antennas", "antenna", "wires"], name: "the aerials", says: "A forest of wire coat-hangers and brave ideas, all pointing at a television that moved away." },
      { words: ["city", "skyline", "lights", "colour", "below"], name: "the city", says: "Neon in every colour you can afford, and behind it, if you look, the grey, waiting for morning." },
      { words: ["tar", "roof", "ridge", "tiles"], name: "the tar", says: "Soft underfoot, and still warm from the day. It has a smell of old summers and burnt sugar." },
      { words: ["moon", "sky", "clouds"], name: "the sky", says: "A low moon in a veil of smoke. The smoke goes up from the chimneys, the way it did before anyone thought to ask." }
    ],
    ambience: { lines: [
      "A pigeon lands on a chimney pot, thinks of something, and leaves.",
      "Tomás whistles through his teeth, three notes, and waits for an answer from somewhere.",
      "A gust brings the whole city's noise up the wall in one lump, then drops it."
    ], every: [30, 70] },
    sleep: "Not on the ridge. The sweep would have to carry you down.",
    alt: "A flat roof at night under a low moon: a row of chimney pots like dark figures on the left, a sweep in black with a long pole sitting against a pot on the left third, a skyline of neon colour below on the right, and aerials against the sky.",
  },
  terraplen: {
    name: "THE CUTTING", area: "vias", at: [0, 0, 0],
    describe: [
      "A railway cutting under a low moon: grey ballast, two rusting rails and a wagon on a siding with its slide painted shut by slogans nobody has read. The line has not carried a train since the weather changed.",
      "East, the rails run on to the works and its great chimney. The plaza is west."
    ],
    exits: { w: "plaza", e: "fabrica" },
    scenery: [
      { words: ["rails", "rail", "line", "tracks", "track", "sleepers", "ballast"], name: "the rails", says: "Two rusted lines to the horizon, and the horizon is a factory. Nothing has run on them since the weather changed." },
      { words: ["wagon", "slide", "slogans", "siding"], name: "the wagon", says: "A goods wagon with its slide painted over in slogans: WAGES, BREAD, NOT THIS. Under them, in older paint, PROSPERIDAD S.A., MAIL ORDER." },
      { words: ["chimney", "works", "factory"], name: "the works", says: "A black hall and, rising out of it, a chimney taller than the tenements. It is the only thing in Prosperidad that is bigger than its own reputation." },
      { words: ["moon", "sky", "clouds"], name: "the moon", says: "Low and yellow, wrapped in a veil of the works' smoke." },
      { words: ["lamp", "signal", "lantern"], name: "the signal lamp", says: "A railway signal, red, which has been saying stop to nobody for a very long time." }
    ],
    ambience: { lines: [
      "A signal lamp clicks, red, and stays red.",
      "Wind comes along the cutting and picks up a mail-order book, and turns its pages, and drops it.",
      "Somewhere in the works, something heavy settles, like a large animal changing its mind."
    ], every: [30, 70] },
    sleep: "Not on the ballast. The rails are cold, and the works is not.",
    alt: "A railway cutting at night under a low moon: two rusted rails running east to a black factory hall on the right third, with one very tall chimney against the sky, and a goods wagon on a siding on the left."
  },
  fabrica: {
    name: "THE WORKS", area: "vias", at: [1, 0, 0],
    describe: [
      "The old works of Prosperidad S.A., which printed the mail-order book and burned what it could not sell. A furnace still glows at one end of the hall, and the {great chimney|gran_chimenea} stands in the middle of the floor like a tree that grew through its own roof, black from foot to cloud.",
      "The ash on the floor is warm. The way back is west, along the line."
    ],
    exits: { w: "terraplen" },
    scenery: [
      { words: ["furnace", "fire", "embers", "glow", "grate"], name: "the furnace", says: "A brick mouth with one red eye. It has not been fed in years. It has not been told." },
      { words: ["ash", "floor", "ashes", "soot", "cinders"], name: "the ash", says: "Warm, grey, and deep enough to take a shoe. Under it, a floor of the mail-order book's last print run, burnt in sheets." },
      { words: ["presses", "press", "machines", "machine", "rollers", "belts"], name: "the presses", says: "Iron rollers as tall as a man, still inked in a shade of grey that does not come out of the walls." },
      { words: ["roof", "hole", "sky", "cloud"], name: "the roof", says: "A great hole where the chimney goes up through it, and through the hole, a cloud that has been there since the printing stopped." },
      { words: ["hall", "walls", "wall", "bricks"], name: "the hall", says: "Brick, high as a cathedral, and scorched in the shape of a very large hand." }
    ],
    ambience: { lines: [
      "The furnace ticks and sighs, as if it were breathing out something it had been saving.",
      "A sheet of burnt paper stands up from the ash, thinks about it, and lies down.",
      "The great chimney creaks from top to bottom, one long note, and then nothing."
    ], every: [30, 70] },
    sleep: "Not in the ash. It would keep you.",
    alt: "The inside of an old works lit red by one furnace: a brick furnace mouth glowing on the left, the great black chimney rising through the middle of the hall to a hole in the roof on the right, iron presses and a floor of grey ash.",
  }
};

// ---- Objects -----------------------------------------------------------------------------------------------------------
const objects = {
  // The opening: the thing to take, the one you carry, and the way on (BRIEF.md §3).
  radio: { at: "callejon", portable: true, material: "metal", name: "Transistor radio", note: "Muttering between stations.",
    words: { nouns: ["radio", "transistor"], adj: ["transistor", "little", "old", "small"] }, ...item("radio"),
    here: "A {transistor radio|radio} stands on a crate, muttering between two stations.",
    examine: "A little transistor radio held together with sticking plaster, set between two stations. Somewhere in the hiss a voice is waiting for you to ask." },
  pagina: { at: "player", portable: true, material: "paper", name: "Catalogue page", note: "Torn, with a circle.",
    words: { nouns: ["page", "catalogue"], adj: ["catalogue", "torn", "mail-order"] }, ...item("pagina"),
    examine: "A page torn from a mail-order catalogue, thick with dust. A crown, in gold paper, circled in red felt-tip: \"CROWN OF EMPEROR. One size. Delivered to whoever the city names. Pay on receipt.\"" },
  puerta: { at: "callejon", material: "metal", name: "Fire door", note: "The only way on.", door: "n",
    words: { nouns: ["door"], adj: ["fire", "steel", "metal", "grey"] },
    examine: "A steel fire door with a push bar and a dent shaped like a shoulder. It is painted the same grey as the wall, in case anyone was thinking of leaving by another way." },

  // Backstage
  funda: { at: "trastienda", container: true, open: false, material: "wood", name: "Guitar case", note: "Rattles when tipped.",
    words: { nouns: ["case"], adj: ["guitar", "black", "battered"] },
    examine: "A black guitar case with a broken clasp, held shut by a belt. When you tip it, something small and many rattles, and it is not a guitar." },
  fichas: { at: "funda", portable: true, material: "metal", name: "Laundry tokens", note: "Brass, with a hole.",
    words: { nouns: ["tokens", "token", "coins"], adj: ["laundry", "brass"], pl: true }, ...item("fichas"),
    examine: "A fistful of brass tokens stamped LAVANDERÍA, each with a small hole through it. Enough for one machine, and the machine knows how many." },

  // The Submarino
  cuco: { portrait: sprites.cuco_portrait, at: "pista", name: "Cuco", note: "The DJ.",
    words: { nouns: ["cuco", "dj", "deejay"], adj: ["dj"], proper: true, g: "m" },
    examine: "A thin man in a leather jacket with a mohawk like a stripe of black paint, bent over two turntables, one of which is not turning. He has the look of a man whose music has left home.",
    talk: `"Don't ask me for a request," says Cuco without turning round. "I've only got half a night."`,
    topics: {
      deck: { open: true, label: "the quiet deck", words: ["deck", "turntable", "quiet", "silent", "music", "records", "booth"], says: `"One deck's dead, and I'm one tape short of a night," says Cuco. "The one I need left with somebody, and I've no way to ask for it. Pride's a bad stand to be dancing on."` },
      funda: { about: "funda", label: "the guitar case", words: ["case", "guitar", "tokens", "backstage"], says: `"The case in the back? Laundry tokens. Nobody plays the guitar any more, so the tokens have the space." He thinks. "The Lavandería takes them. It gives you back more than you put in, if you've lost something."` },
      marisol: { label: "Marisol", words: ["marisol", "corner", "woman"], says: `Something goes across his face and is put away. "Marisol? She's on the corner, where she's always been. We were friends once. She has my tape, and I'm not going to ask her."` },
      default: `"Sorry," says Cuco, over the bass. "I only hear what's coming through the headphones."`
    },
    give: `"That's nice," says Cuco. "But it isn't my tape."` },

  // The avenue and the corner
  marisol: { portrait: sprites.marisol_portrait, at: "esquina", name: "Marisol", note: "Works the corner.",
    words: { nouns: ["marisol", "woman", "lady"], adj: [], proper: true, g: "f" },
    examine: "A woman in a short coat and good shoes, her hair up, her face bare and tired. She has the patience of a bank and the manners of a duchess, and she has not once pretended to be anything else.",
    talk: `"Evening, Emperador," says Marisol. "If you're working, work on the other pavement. If you're looking, look at the lamp."`,
    topics: {
      work: { open: true, label: "her work", words: ["work", "job", "corner", "lamp", "price", "customers"], says: `"Fifteen minutes, a hundred pesetas, no kissing. Twelve years, one lamp, and nobody I've ever had to carry out." She says it like a train timetable. "It's a trade. Nobody's ashamed of selling bread."` },
      eyes: { open: true, label: "her eyes", words: ["eyes", "face", "kohl", "makeup", "make-up", "tired"], opens: ["tape"], says: `"My eyes look bad because my kohl pot is empty," she says. "Fifteen years I've used the same black, and the shop that sold it has gone out of business. I've seen sweeps' soot do for a lady what a pot can't."` },
      tape: { label: "the tape", words: ["tape", "cassette", "cuco"], says: `"Cuco's tape," she says, and does not smile. "He left it with me the night he stopped speaking to me. It has the one song he can't play and can't live without. If somebody brought me a bit of the black stuff for my eyes, I could spare it."` },
      name: { label: "your name", words: ["name", "dani", "emperador"], says: `"You've been Emperador since you were a joke someone told," she says. "Before that you were Dani, from the third floor, with the cough. Nicanor's got it written down somewhere."` },
      default: `"I don't know about that, love," says Marisol, "but if you find out, tell the lamp."`
    },
    give: `"Not for me, love," says Marisol. "I only take what I can use."` },
  hollin: { at: null, portable: true, material: "soft", name: "Jar of soot", note: "Fine and black.",
    words: { nouns: ["soot", "jar", "hollin", "black"], adj: ["jar", "fine", "black"] }, ...item("hollin"),
    examine: "A jam jar of chimney soot, fine as flour and black as a sworn oath. Good for the eyes, if you know the ladies, and good for the lungs of no one." },

  // The pension
  nicanor: { portrait: sprites.nicanor_portrait, at: "pension", name: "Don Nicanor", note: "Keeps the desk.",
    words: { nouns: ["nicanor", "don", "landlord", "clerk", "manager"], adj: ["don"], proper: true, g: "m" },
    examine: "A thin man with a moustache that has outlived two wives, in a cardigan the colour of the lobby. He has a gift for not noticing, and uses it as a trade.",
    talk: `"Rooms by the hour, the night or the year," says Don Nicanor. "The year is for people who have given up. I do not recommend it."`,
    topics: {
      rooms: { open: true, label: "a room", words: ["room", "rooms", "bed", "night", "hour", "rent"], says: `"Eight pesetas an hour, thirty a night, and no questions at either rate. The only room I don't rent is seven. That one's taken, by a lady who pays on the first."` },
      book: { open: true, label: "the Book of Hours", words: ["book", "ledger", "hours", "names", "register"], says: `"Every name that has ever stayed here is in the Book," says Don Nicanor. "Even yours. Dani, from number seven, 1979, third night. A baby with a cough, in a room with no heating. I remember because you were a better sleeper than your mother."` },
      marisol: { label: "Marisol", words: ["marisol", "seven", "tenant"], says: `"Room seven is Marisol's," says Don Nicanor. "She pays on the first and she has never once slammed a door. If you want to see how a lady lives, go up and look. She does not mind. She leaves it open."` },
      default: `"I could not say," says Don Nicanor, and writes something in the Book.`
    },
    give: `"Thank you, but I run a very strict establishment," says Don Nicanor, and gives it back.` },
  escalera_pension: { at: "pension", leads: "u", name: "Stairs", note: "Up to the rooms.",
    words: { nouns: ["stairs", "staircase", "steps"], adj: ["narrow", "worn"] },
    examine: "A narrow staircase with a worn red runner, going up to a landing and a row of rooms with numbers and no names." },
  kohl: { at: "pension_hab", name: "Kohl pot", note: "Scraped to the bottom.",
    words: { nouns: ["pot", "kohl", "eyeliner"], adj: ["kohl", "black", "empty"] },
    examine: "A small round pot, scraped to the bottom with a fingernail. Not a flake left. Whoever uses it uses it with the carefulness of a person doing sums." },
  pintada: { at: "pension_hab", name: "Scrawl", note: "In lipstick, on the wall.",
    words: { nouns: ["scrawl", "writing", "wallpaper", "lipstick", "message"], adj: ["lipstick"] },
    examine: "In lipstick, on the wallpaper by the bed, in a bold looping hand: \"CUCO. YOUR TAPE IS HERE WHEN YOU COME FOR IT YOURSELF.\" Underneath, smaller: \"Not before.\"" },
  escalera_pension_hab: { at: "pension_hab", leads: "d", name: "Stairs", note: "Back down.",
    words: { nouns: ["stairs", "staircase", "steps"], adj: ["narrow", "worn"] },
    examine: "The stairs go down to the lobby, where a clock is not quite keeping time." },

  // The launderette
  secadora: { at: "lavanderia", name: "Big dryer", note: "Wants tokens.",
    words: { nouns: ["dryer", "drier", "machine", "porthole"], adj: ["big", "end", "large"] },
    examine: "A huge old dryer with a round glass door and a coin slot that says TOKENS. In the glass, something is turning slowly, and you cannot tell whose it is.",
    switch_on: "The dryer does nothing. The slot says TOKENS, and it says it like a bailiff.",
    push: "The dryer does nothing. The slot says TOKENS.",
    take: "It is bolted to the floor, and has been since the Civil War." },
  cepillo: { at: null, portable: true, material: "wood", name: "Sweep's brush", note: "Long, black, stiff.",
    words: { nouns: ["brush", "cepillo"], adj: ["sweep's", "sweeps", "chimney", "long", "black"] }, ...item("cepillo"),
    examine: "A chimney sweep's brush on a jointed cane, black as the inside of a pot. Burnt into the handle with a hot nail: T. H." },

  // The Apothecary
  boticaria: { portrait: sprites.boticaria_portrait, at: "bar", name: "The Apothecary", note: "Sells small paper wraps.",
    words: { nouns: ["apothecary", "boticaria", "woman", "lady"], adj: ["the"], g: "f" },
    examine: "A small neat woman in a grey coat, her hair in a net, her bag on her knee. She looks like the kind of aunt who has given advice on everything and been proved right on most of it.",
    talk: `"Evening," says the Apothecary, as to a customer or a niece. "Don't tell me what you want. Tell me what you're short of."`,
    topics: {
      trade: { open: true, label: "her trade", words: ["trade", "wraps", "paper", "business", "sell", "selling", "bag", "powder", "pills"], says: `"I sell what people ask for," says the Apothecary. "Something to stay up, something to come down, something for the cold. I tell them what it does and what it costs, and then it's their business. Nobody I've served has ever said I lied."` },
      lavanderia: { about: "lavanderia", label: "the Lavandería", words: ["lavanderia", "launderette", "laundry", "machines", "dryer", "tokens"], says: `"The machines there give you back what you're missing. Not what you put in: what you're missing. I once put in a coat and got back a husband. Ask for what you want, with tokens, and keep your hands out of the drum."` },
      tomas: { label: "Tomás", words: ["tomas", "tomás", "sweep", "chimney", "roof"], says: `"Tomás the sweep? On the roof of the casa tomada. He lost his brush last winter, and has been sweeping the air with his hands ever since. Not a nice thing to watch."` },
      default: `"If it's not on the list, I can't help," says the Apothecary, "and the list is long."`
    },
    give: `"I never take payment in kind," says the Apothecary. "Only in coin or conversation."` },

  // The depot
  remedios: { portrait: sprites.remedios_portrait, at: "estafeta", name: "Doña Remedios", note: "Stamps everything.",
    words: { nouns: ["remedios", "dona", "doña", "clerk", "woman"], adj: ["doña", "stout"], proper: true, g: "f" },
    examine: "A stout woman in a cardigan and a hairnet, with a stamp in each hand and a third behind her ear. She does not look up at anything she has not already filed.",
    talk: `"Next," says Doña Remedios, though there is no one else. "Name, parcel, payment, in that order. Not that order. Pay first."`,
    topics: {
      parcel: { open: true, opens: ["name", "sign"], label: "the parcel", words: ["parcel", "package", "box", "mine", "emperador", "address"], says: `"Addressed to Emperador, care of the Avenida, " she reads. "Or, according to the old label under it, Dani, third floor of the casa tomada. It goes to whichever of you signs. It is paid on receipt. I do not make the rules. I stamp them."` },
      pay: { open: true, label: "the payment", words: ["pay", "payment", "money", "banknote", "price", "cost", "note"], says: `"Contra entrega," says Doña Remedios. "The payment is a banknote, any banknote, as long as it is earned. Not found, not given: earned. The catalogue is very strict about the earning, though not about the amount."` },
      sign: { label: "the signature", words: ["sign", "signature", "name", "dani"], says: `"You sign for it in a name. Say it, and I stamp it, and it is yours. Not the name you wish you had. The name you will sign for."` },
      default: `"I cannot stamp that," says Doña Remedios, and stamps something else.`
    },
    give: `"Payment is in banknotes," says Doña Remedios, "and this is not one."` },
  billete: { at: null, portable: true, material: "paper", name: "Banknote", note: "Crumpled, earned.",
    words: { nouns: ["banknote", "note", "money", "bill", "billete"], adj: ["crumpled", "folded", "earned", "hundred"] }, ...item("billete"),
    examine: "A crumpled hundred-peseta note, folded in four and slightly warm. Whatever else it is, it was earned." },

  // The tape
  cinta: { at: null, portable: true, material: "paper", name: "Tape", note: "No label.",
    words: { nouns: ["tape", "cassette", "cinta"], adj: ["unlabelled", "plain", "cheap"] }, ...item("cinta"),
    examine: "A cheap cassette with no label, only a thumbprint in what might be eyeliner. The spools are very evenly wound, as if the tape had been kept for something." },

  // The occupied house
  escalera_patio: { at: "patio", leads: "u", name: "Ladder", note: "Up to the roof.",
    words: { nouns: ["ladder", "rungs"], adj: ["iron", "rusty"] },
    examine: "An iron ladder bolted to the north wall, rungs worn bright at hand height. It goes up into the smoke." },
  escalera_azotea: { at: "azotea", leads: "d", name: "Ladder", note: "Back down.",
    words: { nouns: ["ladder", "rungs"], adj: ["iron", "rusty"] },
    examine: "The ladder you came up, going down into the patio's candlelight." },
  tomas: { portrait: sprites.tomas_portrait, at: "azotea", name: "Tomás", note: "The chimney sweep.",
    words: { nouns: ["tomas", "tomás", "sweep", "chimney sweep", "man"], adj: ["chimney"], proper: true, g: "m" },
    examine: "A chimney sweep from the top hat down, which is also black, and a face so sooty that when he smiles it looks like a flaw in the dark. A brush-shaped gap in his belt is where his brush was.",
    talk: `"Mind the pots," says Tomás. "They're warm, and they keep what they're given."`,
    topics: {
      sweeping: { open: true, opens: ["works"], label: "the sweeping", words: ["sweep", "sweeping", "chimney", "chimneys", "pots", "work", "job", "soot"], says: `"There's eleven pots up here, and a twelfth at the works that's bigger than all of them," says Tomás. "I've swept them for forty years. Whoever sweeps a chimney keeps the soot. That's the whole of the law."` },
      brush: { open: true, label: "his brush", words: ["brush", "lost", "cane"], says: `"It went to the Lavandería last winter, in my overall pocket, and the machines kept it," says Tomás. "They give you back what you're missing. Never what you ask for: only what's missing. If I was missing my brush, I'd have it back by now."` },
      works: { label: "the works", words: ["works", "chimney", "great", "fabrica", "factory"], says: `"The great chimney at the works takes all the grey," says Tomás. "Eight decades of it, and nobody's swept it since the printing stopped. If you went up there with a brush..." He shakes his head. "Mind, it's a very long way up, and I've only the one back."` },
      default: `"Can't say," says Tomás. "I only know soot."` },
    give: `"That's not mine," says Tomás, "but thank you."` },

  // The works
  gran_chimenea: { at: "fabrica", name: "Great chimney", note: "Black from foot to cloud.",
    words: { nouns: ["chimney", "flue", "stack"], adj: ["great", "big", "tall", "black"] },
    examine: "A brick chimney as wide as a house, going up through the hall and out through the roof, black from the floor to the cloud. At its foot, a small iron hatch, and a smell of eighty years of burnt paper.",
    take: "It is a chimney.",
    push: "You lean on it, and it leans back, a little, from a great height." }
};

// ---- The puzzles -----------------------------------------------------------------------------------------------------------
const puzzles = {
  take_tokens: { where: "trastienda", needs: [], solve: ["open case", "{take} tokens"], gives: ["fichas"], clues: ["funda", "cuco"],
    hints: ["Cuco's guitar case, backstage, rattles when it is tipped.", "Open the guitar case and take the tokens."] },
  feed_dryer: { where: "lavanderia", needs: ["fichas"], solve: ["put tokens in dryer", "{take} brush"], gives: ["cepillo"], clues: ["secadora", "boticaria", "tomas"],
    hints: ["The dryer in the Lavandería takes tokens, and gives you back what you are missing.", "Put the tokens in the dryer, and take what comes out."] },
  sweep_roof: { where: "azotea", needs: ["cepillo"], solve: ["give brush to tomas"], gives: ["hollin"], clues: ["tomas", "cepillo", "boticaria"],
    hints: ["The sweep on the roof of the casa tomada is missing his brush.", "Give the brush to Tomás, on the roof, and he will sweep a pot and give you the soot."] },
  line_eyes: { where: "esquina", needs: ["hollin"], solve: ["give soot to marisol"], gives: ["cinta"], clues: ["marisol", "hollin", "kohl"],
    hints: ["Marisol's kohl pot is empty, and sweeps' soot does for the eyes what a pot cannot.", "Give the soot to Marisol on the corner, and she will give you Cuco's tape."] },
  play_tape: { where: "pista", needs: ["cinta"], solve: ["give tape to cuco"], gives: ["billete"], clues: ["cuco", "cinta", "pintada"],
    hints: ["Cuco's other deck is quiet because his tape is on the corner. He pays well for what he misses.", "Give the tape to Cuco, in the club, and take the banknote."] },
  corona: { where: "estafeta", needs: ["billete"], solve: ["give note to remedios", "say emperador"], ending: true, clues: ["remedios", "billete", "marisol"],
    hints: ["The parcel is addressed to Emperador, and Doña Remedios stamps what is paid.", "Give the banknote to Doña Remedios at the depot, and say Emperador."] },
  nombre: { where: "estafeta", needs: ["billete"], solve: ["give note to remedios", "say dani"], ending: true, clues: ["remedios", "nicanor", "marisol"],
    hints: ["The parcel was addressed once to another name, and Don Nicanor's Book has it.", "Give the banknote to Doña Remedios, and say Dani."] },
  colour: { where: "fabrica", needs: ["cepillo"], solve: ["sweep chimney with brush"], ending: true, clues: ["gran_chimenea", "tomas", "cepillo"],
    hints: ["The great chimney at the works holds the city's grey, and a sweep's brush gets it out.", "Take the brush to the works, east of the cutting, and sweep the great chimney."] }
};

// ---- Rules -----------------------------------------------------------------------------------------------------------------
const rules = [
  // The dryer: tokens in, what you are missing out.
  { id: "put_tokens", match: { verb: ["put", "use"], obj: "fichas", obj2: "secadora" }, if: [{ "player.at": "lavanderia" }], once: true,
    again: "The dryer has had its tokens and tumbles on, thinking.",
    do: [{ say: "The tokens go in one by one, each with a small wet note. The dryer turns, and the glass fills with a slow grey tumble, and then, with a thump, a {brush|cepillo} comes down the chute as clean as a bone." },
         { move: "fichas", to: null }, { move: "cepillo", to: "lavanderia" }] },
  // The sweep: the brush back, the soot out.
  { id: "give_brush", match: { verb: ["give", "show", "use", "put"], obj: "cepillo", obj2: "tomas" }, if: [{ "player.at": "azotea" }], once: true,
    again: `"I've swept the one," says Tomás. "Keep the brush till you've need of it."`,
    do: [{ say: `Tomás takes the brush as another man would take a child. He sweeps the nearest pot, once, with a sound like a long breath, and a cloud of soot comes out, black as a church. He fills a jar of {soot|hollin} from it without looking, and hands you the jar and the brush together. "That's what it's for," he says. "That's what it's all for."` },
         { move: "hollin", to: "player" }] },
  // Marisol: soot for her eyes, and the tape.
  { id: "give_soot", match: { verb: ["give", "show", "use", "put"], obj: "hollin", obj2: "marisol" }, if: [{ "player.at": "esquina" }], once: true,
    again: `"One jar's all I need," says Marisol. "Don't spoil me."`,
    do: [{ say: `Marisol takes the jar and dips a finger in. She draws a line along each eye, a flick at the corner, without a mirror, in four seconds. When she turns to the lamp she looks like someone who has never been tired. "There," she says. "Now I'm open for business. Go on, take it." She reaches into her coat and brings out a {tape|cinta}, thumbprinted in black. "Tell him it's from the corner. Tell him nothing else."` },
         { move: "hollin", to: null }, { move: "cinta", to: "player" }] },
  // Cuco: the tape, and the banknote.
  { id: "give_tape", match: { verb: ["give", "show", "use", "put"], obj: "cinta", obj2: "cuco" }, if: [{ "player.at": "pista" }], once: true,
    again: `"One's all I need," says Cuco. "I've got the night back."`,
    do: [{ say: `Cuco holds the tape as if it were hot. He slots it in the dead deck, and the second turntable begins, and the whole floor shifts a quarter-turn, as though somebody had remembered something. He does not look round. He folds a {banknote|billete} into four and slips it into your hand without turning. "From the house. It's earned."` },
         { move: "cinta", to: null }, { move: "billete", to: "player" }] },
  // The depot: pay, then sign.
  { id: "pay_remedios", match: { verb: ["give", "show", "use", "put"], obj: "billete", obj2: "remedios" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": false }],
    do: [{ say: `Doña Remedios holds the note to the strip light, and then to her ear, and then to the stamp. She brings the stamp down on it, once. "Earned," she says. "Now. In whose name do I sign it?"` },
         { set: "remedios.paid", to: true }, { move: "billete", to: null }] },
  { id: "sign_crown", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": true }, { $text: { in: CROWN } }],
    do: [{ say: `"Emperador," says Doña Remedios, and stamps the label twice. She lifts the lid and takes out a crown of cardboard and gold paper, one size, which turns out to be yours. She sets it on your head herself.` },
         { say: `Out on the Avenida the neon is already on. By the time you reach the Submarino's front everyone has stopped to look, and nobody laughs. It is a grey city, and it has an emperor, and the work goes on.` },
         { end: true, picture: "crowned" }] },
  { id: "sign_name", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": true }, { $text: { in: NAME } }],
    do: [{ say: `Doña Remedios runs her finger down a form, finds a name, and stamps it. "Dani," she says, as if reading an old address. "Third floor, the casa tomada." She opens the parcel. There is a bus ticket in it for the five-ten, a clean shirt in tissue paper, and a smell of somewhere else.` },
         { say: `Nobody on the strip calls you Emperador when you walk to the stop. They call you by the other name. It sounds small, and strange, and fits.` },
         { end: true, picture: "named" }] },
  { id: "sign_unpaid", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": false }, { $text: { in: [...CROWN, ...NAME] } }],
    do: [{ say: `"Pay first," says Doña Remedios, without looking up. "Then sign. The catalogue is very particular."` }] },
  { id: "sign_other", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": true }],
    do: [{ say: `"That name is not on the label," says Doña Remedios, and gives it a stamp anyway, to be on the safe side. The parcel stays shut.` }] },

  // The great chimney: the brush, and the ending.
  { id: "sweep_great", match: { verb: ["sweep", "use"], obj: "gran_chimenea" }, if: [{ "player.at": "fabrica" }, { "cepillo.at": "player" }],
    do: [{ change: "big_sweep" }] },
  { id: "sweep_great_with", match: { verb: ["use", "put", "sweep"], obj: "cepillo", obj2: "gran_chimenea" }, if: [{ "player.at": "fabrica" }],
    do: [{ change: "big_sweep" }] },
  { id: "sweep_nothing", match: { verb: ["sweep", "use"], obj: "gran_chimenea" }, if: [{ "player.at": "fabrica" }],
    do: [{ say: "You wave your hands at the chimney, and a little soot comes down on them. It is a start, and it is nothing. A chimney like this wants a sweep's brush." }] },
  { id: "sweep_elsewhere", match: { verb: "sweep" }, if: [{ "player.at": "azotea" }],
    do: [{ say: `"Don't," says Tomás. "The pots here are mine. Take your brush to the works, if you want something that needs sweeping."` }] }
];

const changes = {
  big_sweep: [
    { say: "You set the brush against the hatch at the chimney's foot and push it up into the dark, and it goes in as though it had been invited. Soot comes down for a long time: a whole winter of it, and then the winter before that." },
    { say: "With the soot come all the colours it was holding. Red first, then green, then a yellow that has no business in this city. By the time you are out of the works, the sky has gone from grey to the colour of the Submarino's sign, in daylight, and the strip is deciding whether it likes it." },
    { end: true, picture: "colour" }
  ]
};

// ---- The opening, declared (BRIEF.md §3) ----------------------------------------------------------------------------------------
const opening = {
  room: "callejon", hints: "radio", intro: "pagina", way: "puerta",
  lines: {
    notYet: "The fire door does not move. The radio on the crate is still muttering to itself, and it sounds like it has something to say. Take it first.",
    through: "You put your shoulder to the bar. The fire door gives with the sound of a bin lid and lets you through, and by the time you turn round it is wall.",
    hintFrame: "You put the radio to your ear. Between two stations a voice says:",
    farewell: "The wind takes the page out of your hand and reads it to the alley, then lets it go."
  }
};

// ---- The change set -----------------------------------------------------------------------------------------------------
export default {
  because: "After the opening: a grey city's strip, squats and club on a Saturday night in 1985, and a parcel with your name on it.",
  opening,
  facts: [
    "The player is Emperador, a punk of the strip in Prosperidad, 1985; the opening is the blind alley behind the Submarino; the first room is backstage.",
    "A parcel for Emperador waits at the Estafeta; Doña Remedios hands it over for a banknote that was earned, and a name said aloud.",
    "The Lavandería's dryer gives back what you are missing; Tomás the sweep is missing his brush.",
    "The player's own name, before Emperador, was Dani.",
    "The great chimney at the works holds the city's grey; sweeping it with the sweep's brush is an ending."
  ],
  properties: {
    "remedios.paid": { type: "boolean", start: false }
  },
  effects: [
    { time: "day 1 01:00", weekday: "sat" },                 // the opening is played at one in the morning
    { set: "game.entrance", to: "trastienda" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 01:10", weekday: "sat" },
      { say: "Ten past one, and the whole city is paying for its colours." }
    ] },
    // Verbs this world needs
    { add: "word", verb: "sweep", words: ["sweep", "clean", "brush", "scrub"], absent: false, reply: "Nothing here needs sweeping." },
    { add: "word", verb: "order", reply: "The strip sells everything, and tonight you have nothing to buy it with." },
    { add: "word", verb: "buy", reply: "The strip sells everything, and tonight you have nothing to buy it with." },
    { add: "word", verb: "dance", words: ["dance", "boogie", "jig"], reply: "You move a little. The strip sees it and thinks nothing of it, which is what a dance on the strip is for." },
    { add: "word", verb: "sign", words: ["sign", "countersign", "endorse"], reply: "Signing is for the depot, and for a name said aloud." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js, shared by both languages; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
