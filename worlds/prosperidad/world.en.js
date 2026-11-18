// "Emperor of the Crust": a world, in English, written the way the AI is asked to write a world (BRIEF.md). One
// change set, all or nothing; plain data. The Spanish version (world.es.js) is written on its own, not translated: same ids, rooms, rules
// and endings, other words. The pictures, sprites and music are shared (pictures.js, sprites.js, music.js): they have no words.
// Reworked 2026-11-15 (strangeness 0): the story is now the hunt for a dealer who walks a round of the strip's rooms.

import pictures, { endings } from "./pictures.js?v=0.65.0";
import music, { rooms as roomMusic } from "./music.js?v=0.65.0";
import levels from "./levels.js?v=0.65.0";
import sprites from "./sprites.js?v=0.65.0";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Emperor of the Crust",
  blurb: "Prosperidad, 1985. The Emperor needs the Minister, a dealer who walks a round of the bars, takes no money and wants a favour first. It is a long night.",
  thumbnail: { picture: "avenida", x: 40 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  style: "flat",
  palettes: "neon: the strip, El Charlie, the corner, the plaza and the blind alley (night as a soft glow); lamplight: the lit rooms with a bulb or a candle (backstage, La Ópera, the pension, room seven, the occupied house); institution: the fluorescent rooms (the post office, the launderette); moonlight: the open dark above and beyond the lights (the patio, the roof, the cutting); ember: the works, lit by one furnace",
  genre: "picaresque",
  strangeness: "0 (named: nothing impossible anywhere; the surprise comes from the people and the place)",
  size: "large",
  ingredient: "a mail-order catalogue; a chimney sweep",
  discarded: [
    "rules: a dealer who sells hours of the night; a dealer who is a policeman; a city that is grey by day because of something it owes",
    "strangeness 0: a dealer who is a priest; a raid on the bars at four as the climax; a tragic overdose as the moral",
    "start room: a cell opened with a key under a mat; a door that gives to a shoulder in its dent (the first version); a lift that sticks between two floors"
  ],
  synopsis: "You are the Emperor, a street punk of Prosperidad, a grey city in 1985 that lives after dark, and tonight you have one errand: " +
    "to find the Minister, a dealer who walks the same round of rooms every night and never takes money. He takes favours, and he wants a thing " +
    "that no shop will sell you at this hour. So you live on your wits across the strip, the squats, two bars and a launderette, trading " +
    "small favours with the people who are awake, and learning on the way who you were before you were somebody's emperor.",
  stuff: "pesetas and duros, a transistor radio tuned to a call-in show, laundry tokens, a chimney sweep's brush and a jar of soot, kohl, a pack of bass strings, " +
    "gaffer tape on a drum kit, a pensión that rents by the hour, a post office of pigeonholes, a feather boa, a razor and a mirror, a mourning ribbon on a portera's lodge, anisette, a black silk tie, a first bus",
  tone: "Picaresque: a sly, hungry narrator who prices everything and counts who owes whom, quick short sentences with a sting at the end, " +
    "frank about bodies, work and chemistry and never judging, fond of the people, fond of a grift. It notices what things cost and who is " +
    "standing in doorways; it leaves out sermons and sentiment. The mood is wry and tender, a night that is hard on everyone and funny anyway. " +
    "\"The strip sells everything twice: once to the customer, once to whoever says he saw it.\" " +
    "\"Marisol works the corner with the patience of a bank and the manners of a duchess.\" " +
    "\"In Prosperidad the colour comes on after dark, and somebody always sends the bill.\"",
  start: "Saturday, 01:00, in the blind alley behind El Charlie; ten past one once through its fire door.",
  rules: [
    "Prosperidad is grey by day and lives by neon after dark, and everything that shines has been paid for, in money or in favours.",
    "The Minister never stays put: he walks the same round every night, El Charlie, the Avenida, La Ópera, the post and the Avenida again, a drink at each door, and he takes no money.",
    "Nobody on the strip gives anything for nothing, and nobody forgets what they are owed: a favour is a debt with better manners.",
    "After midnight everybody goes by the name the strip gave them; the name on the papers is for daylight and for the people who knew you when you were small."
  ],
  opening: "A blind alley behind a club, the start room, south of its backstage: a transistor radio on a crate (hints, a late-night call-in), the intro, a beer mat's message about the Minister (why you came). The fire door at the far end is painted into its frame: a crowbar that leans against the bin prises it open.",
  music: "a nervous dorian shuffle heard through a club wall; a bass drum that misses a beat, a cheap guitar on one chord and a chimney sweep's whistle; the radio between stations",
  characters: ["Cuco, who runs the sound at El Charlie", "Pelayo, who runs its bar", "Doña Aurora, who owns and sings at La Ópera", "Marisol, who works the corner",
    "Doña Remedios, of the all-night post office", "Tomás, the chimney sweep", "Don Nicanor, of the Pensión Esperanza", "Marga, the drummer at the works",
    "the Minister, who walks his round"],
  endings: [
    "Emperor: trade the tie, give the name the strip gave you, and go out to be crowned.",
    "Javier: trade the tie, give the name on the papers, and take the first bus to a funeral."
  ],
  chaos: 0.3
};

// Carried things get their sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// What the Minister accepts when he asks in whose name he writes it (rules: sign_*), each also as "I am ...", "my name is ..." and "it is ...".
const said = (names) => names.flatMap(n => [n, "it is " + n, "i am " + n, "my name is " + n, "call me " + n, "write " + n, "put " + n]);
const CROWN = said(["emperor", "the emperor", "el emperador", "emperador", "the emperor of prosperidad"]);
const NAME = said(["javier", "javier ortega", "javi"]);

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  crowned: { alt: "The Avenida at night from across the road: a small figure in a gold cardboard crown stands on a crate in the middle of the strip, with a ring of dark silhouettes round it and neon on every shopfront.", picture: endings.crowned },
  named: { alt: "A bus stop at grey dawn: a first bus with its windows lit yellow, and a small figure in a grey coat with a plain brown case at the step, the city behind them in grey.", picture: endings.named }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// Area "club": the blind alley, the start room, south of the back room behind its fire door; the back room and the bar floor. Area "calle" (x grows east, y south):
// the Avenida with the post office east and La Ópera west, the corner south of it with the pension east and the launderette west, the
// plaza below. Area "casa": the portal, the patio and the roof. Area "vias": the cutting and the works.
const rooms = {
  callejon: {
    name: "THE BLIND ALLEY", area: "club", at: [0, 1, 0],
    describe: [
      "Grey brick on both sides and a wall behind: the back of El Charlie, with crates, a bin and puddles that hold the pink of a neon tube. The tube has been saying half a word since the spring.",
      "The only way out is the {fire door|puerta} at the far end, painted into its frame. The bass comes through it like a pulse through a wall."
    ],
    exits: { n: "trastienda" },
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
      "Somebody on the other side of the wall laughs for a long time and then stops, as if told."
    ], every: [25, 60] },
    alt: "A blind alley at night between two grey brick walls: a pink neon tube on the left wall, a bin and stacked crates against the bricks, and a steel fire door closing the far end.",
    overlayAlt: { radio: "A small transistor radio stands on a crate, its aerial out.", palanca: "A crowbar leans against the bin." }
  },
  trastienda: {
    name: "BACKSTAGE", area: "club", at: [0, 0, 0],
    describe: [
      "Backstage at El Charlie: amplifier cases, a coat rail of sequinned jackets left by a glam band nobody liked, a mirror ringed with bulbs, half of them dead. A {guitar case|funda} lies on its back on the floor, belonging to nobody who is looking.",
      "The noise comes through the curtain to the east, all bass and no treble. The {fire door|puerta_trasera} to the alley is south, propped open on its bar."
    ],
    exits: { e: "charlie", s: "callejon" },
    scenery: [
      { words: ["amps", "amp", "amplifier", "amplifiers", "cases", "speakers"], name: "the amplifier cases", says: "Black boxes with the club's name stencilled on, and under the name somebody's phone number, crossed out twice." },
      { words: ["rail", "jackets", "jacket", "sequins", "coats"], name: "the coat rail", says: "Sequinned jackets in sizes for people who no longer need them. They throw the bulbs back at you in small change." },
      { words: ["mirror", "bulbs", "bulb"], name: "the mirror", says: "You look like someone who is owed money and is not going to mention it. The mirror takes your side." },
      { words: ["curtain", "velvet"], name: "the curtain", says: "Black velvet gone grey at hand height. It trembles in time with the bass.", leads: "e" }
    ],
    ambience: { lines: [
      "A bulb in the mirror goes out, and the others look at each other.",
      "Somebody on the floor cheers, a long way off, for something that happened a minute ago.",
      "The coat rail shivers with the bass and throws sequins around the ceiling."
    ], every: [30, 70] },
    alt: "A cluttered backstage room at night: a mirror ringed with bulbs, a rail of sequinned jackets, stacked amplifier cases, a guitar case on the floor, and a black curtain on the right leading to the bar."
  },
  charlie: {
    name: "EL CHARLIE", area: "club", at: [1, 0, 0],
    describe: [
      "El Charlie at one in the morning: a low stage, a drum kit held together with gaffer tape, black walls papered in stickers, a floor that keeps your shoes. Eighty punks, and at the back table two of them cutting lines on a mirror, in no hurry.",
      "{Cuco|cuco} runs the sound from a plank by the stage; {Pelayo|pelayo} runs the bar, a longer plank. The backstage curtain is west, the street door south."
    ],
    exits: { w: "trastienda", s: "avenida" },
    scenery: [
      { words: ["stage", "kit", "drums", "drum", "tape", "gaffer"], name: "the stage", says: "Knee high and sticky. The drum kit is more tape than kit, and the drummer hits it as if it owed him money." },
      { words: ["walls", "wall", "stickers", "posters", "graffiti"], name: "the walls", says: "Stickers on stickers: bands, parties, a political party, a lost cat. The black underneath has not been seen since 1981." },
      { words: ["punks", "crowd", "people", "kids", "bodies", "floor"], name: "the punks", says: "Leather, safety pins, hair in colours that cost more than the beer. Everyone here is somebody's child and has decided not to mention it." },
      { words: ["table", "mirror", "lines", "razor", "note", "powder", "back"], name: "the back table", says: "A mirror, a razor, a rolled note and two friends who have agreed on a price. Nobody here judges; the mirror gets wiped when it is done." },
      { words: ["desk", "plank", "sound", "knobs", "faders"], name: "the sound desk", says: "A plank on two beer crates, with a mixing desk older than the band. It has three working faders and Cuco's whole opinion of the world." },
      { words: ["entrance", "street", "stamp"], name: "the street door", says: "A door with a punk on each side of it and a stamp for the back of the hand. It lets out more than it lets in.", leads: "s" }
    ],
    ambience: { lines: [
      "The bass finds your ribs and moves in.",
      "A cheer goes up for no reason that survives the next song.",
      "Somebody pogoes alone, and well, and nobody mentions it.",
      "A bottle breaks somewhere, and the band plays through it, which is what bands are for."
    ], every: [30, 70] },
    alt: "A punk bar at night: a low stage with a drum kit on the left, a sound desk with a man with a mohawk bent over it, a long bar with a big barman on the right, a back table with a mirror and white lines, and a crowd of dark figures.",
    overlayAlt: { ministro: "The Minister stands by the back table in his camel coat and grey hat, a leather case in one hand." }
  },
  avenida: {
    name: "THE AVENIDA", area: "calle", at: [0, 0, 0],
    describe: [
      "The strip: one long avenue of grey shutters that open, once the night is old, into every colour that costs money. Neon runs wet on the road, and the pavement belongs to whoever is standing on it.",
      "El Charlie's black front is north, its porthole window lit. The Estafeta, the post office, is east, and La Ópera west. South the avenue bends to the corner."
    ],
    exits: { n: "charlie", e: "estafeta", w: "opera", s: "esquina" },
    scenery: [
      { words: ["shutters", "shutter", "shopfronts", "shops", "shopfront"], name: "the shutters", says: "Half up, half down, like eyelids. Behind them someone sells something that is not on the sign." },
      { words: ["neon", "signs", "sign", "tubes", "colour", "colours"], name: "the neon", says: "Pink, cyan, a red that is rented by the month. Every tube here is somebody's rent." },
      { words: ["road", "street", "avenue", "avenida", "kerb", "pavement"], name: "the road", says: "Wet black, with the signs repeated in it as soft streaks. Nobody has driven on it in an hour." },
      { words: ["club", "charlie", "front", "porthole"], name: "El Charlie", says: "A black front that used to be a dance hall called the Submarino, with a round window like a porthole, lit, and a queue that moves when it feels like it.", leads: "n" },
      { words: ["people", "doorways", "doorway", "figures", "men", "women"], name: "the people in the doorways", says: "They stand in the dry and watch the street like shopkeepers. Most of them are." }
    ],
    ambience: { lines: [
      "A car comes down the avenue at walking pace, looks at everything, and takes nothing.",
      "A shutter goes up with a noise like a cough, and a room full of pink is for sale.",
      "Someone laughs in a doorway, and somebody else stops.",
      "A radio plays through a window, a song you almost know, in the wrong key for the street."
    ], every: [30, 70] },
    sleep: "Not on the strip. Somebody would sell you, and you would not see the money.",
    alt: "The Avenida at night, looking north along a wet street: shutters and neon signs on both sides in pink, cyan and magenta, the black front of a club with a round porthole window at the far end, and people standing in the doorways.",
    overlayAlt: { ministro: "The Minister stands in the middle of the pavement in his camel coat and grey hat, a leather case in one hand.", monedas: "Three coins lie on the pavement in front of the club's door." }
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
      "A post office that never shut, because nobody told it how. Pigeonholes to the ceiling, a strip light that stutters, and a long counter where {Doña Remedios|remedios} stamps letters for people who have moved.",
      "A canvas sack sags in the corner, waiting for the night van. The avenue is west."
    ],
    exits: { w: "avenida" },
    scenery: [
      { words: ["sack", "bag", "canvas", "van"], name: "the mail sack", says: "Canvas, stencilled MAIL, fat with the strip's correspondence: final demands, love letters, and letters from the same hand every week to the same address, returned." },
      { words: ["pigeonholes", "pigeonhole", "holes", "letters", "mail", "post"], name: "the pigeonholes", says: "Thousands of them, every one stuffed. Nobody collects. The post is waiting for the people to get better at being addressed." },
      { words: ["counter", "stamps", "stamp", "stamping", "ink"], name: "the counter", says: "Brass-edged and scratched, with an inkpad in the middle the colour of a bruise." },
      { words: ["light", "strip", "tube", "ceiling"], name: "the strip light", says: "It stutters on a long grey note. Under it, everyone looks like a form." },
      { words: ["notice", "rules", "hours"], name: "the notice", says: "\"OPEN WHEN THERE IS POST. THERE IS ALWAYS POST.\" Someone has added \"EXCEPT FOR YOU\" in pencil." }
    ],
    ambience: { lines: [
      "A stamp comes down on something, a clean flat note, like a small door closing.",
      "A pigeonhole gives up a letter, and Doña Remedios files it back without reading.",
      "The strip light stutters, and in the gap Doña Remedios has not moved at all."
    ], every: [30, 70] },
    alt: "A post office at night under a strip light: pigeonholes up the whole back wall, a long counter with a stout woman in a cardigan behind it on the left, and a fat canvas mail sack on a shelf on the right.",
    overlayAlt: { ministro: "The Minister stands at the end of the counter in his camel coat and grey hat, waiting for his post." }
  },
  opera: {
    name: "LA ÓPERA", area: "calle", at: [-1, 0, 0],
    describe: [
      "La Ópera: red plush gone brown, gilt mirrors with the gilt gone, a tiny stage under a chandelier of seven bulbs. Doña Aurora sings on it every night, bare to the waist under a feather boa, to a room of men in good coats who have lost their theatres.",
      "{Doña Aurora|aurora} owns the room, the stage and the debts, and has a voice that has outlasted all three. The avenue is east."
    ],
    exits: { e: "avenida" },
    scenery: [
      { words: ["stage", "chandelier", "bulbs", "boa", "feathers"], name: "the stage", says: "A tiny stage with a chandelier of seven bulbs, three of them lit. Doña Aurora stands under it in a feather boa and nothing else, with the dignity of a woman who has seen the worst of opera and the best of the audience." },
      { words: ["plush", "curtains", "velvet", "booths", "seats"], name: "the plush", says: "Red once, brown now, with a shine on the arms where a thousand elbows have rested their opinions." },
      { words: ["mirrors", "mirror", "gilt"], name: "the mirrors", says: "Gilt frames round old glass, and in the glass a room twice as full and twice as young. It is a kind lie." },
      { words: ["men", "regulars", "coats", "audience", "gentlemen"], name: "the regulars", says: "Old men in good coats, each with a glass and a seat that is his, listening with their eyes shut as if the aria were being sung by someone they once loved." },
      { words: ["bar", "counter", "bottles", "anisette", "glasses"], name: "the bar", says: "A short mahogany bar with a mirror behind it and a barman called Gaspar who has never been heard to speak. The anisette comes in glasses the size of a thimble and costs the size of a cup. A coffee machine hisses at the far end of it, and a coffee is a coin." },
      { words: ["table", "candle", "seat"], name: "the table by the stage", says: "A round table with a candle in a bottle and a view of the door. Nobody sits at it who is not expected." }
    ],
    ambience: { lines: [
      "Doña Aurora takes a high note a little too late and hangs on to it, like a hat in a wind.",
      "Someone in a good coat weeps quietly, and nobody looks, and that is the house rule.",
      "The chandelier loses a bulb. The room does not mention it."
    ], every: [30, 70] },
    alt: "A faded plush bar at night: a tiny stage under a seven-bulb chandelier with a woman in a feather boa, bare to the waist, singing, old men in good coats in the booths, a gilt mirror, and a round table with a candle at the right.",
    overlayAlt: { ministro: "The Minister stands by the round table next to the stage in his camel coat and grey hat, a leather case in one hand." }
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
      "The bell on the desk rings once, as somebody's sleeve goes by, and nobody comes to see why.",
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
      "A launderette open all night, because the owner is in Valencia and nobody has told the machines. A wall of washers, a bench bolted to the floor, and a {big dryer|secadora} at the end with a slot for tokens and a window like a porthole.",
      "Something long and dark lies against the dryer's glass, behind a latch that has not clicked in a year. The corner is east."
    ],
    exits: { e: "esquina" },
    scenery: [
      { words: ["washers", "washer", "washing", "machines", "drums", "drum"], name: "the washers", says: "Ten white drums turning in ten small seas. Each one is full of somebody's week." },
      { words: ["bench", "seat", "bolts"], name: "the bench", says: "Bolted to the floor for reasons the launderette keeps to itself. A good place to wait, and a bad place to be asked to move." },
      { words: ["sign", "notice", "instructions"], name: "the sign", says: "\"TOKENS ONLY. NO TOKENS, NO WASH. NOT RESPONSIBLE FOR WHAT IS LEFT BEHIND.\"" },
      { words: ["light", "lights", "tube", "tubes"], name: "the tubes", says: "Cold white, the light of a place that wants you to leave but has no objection to you staying." }
    ],
    ambience: { lines: [
      "A drum finishes its cycle with a long sigh, and the whole wall considers it.",
      "A sock goes round in a washer's window, again and again, like a man looking for his stop.",
      "Somewhere in the machines a coin drops, and nobody has put one in."
    ], every: [30, 70] },
    sleep: "Not on the bench. The machines would wash you.",
    alt: "A launderette at night under cold white tubes: a row of white washing machines along the back wall, a bolted bench on the left, and a large dryer with a round glass door on the right, a long black brush lying against its glass.",
    overlayAlt: { cepillo: "A chimney sweep's long black brush lies on the open door of the dryer." }
  },
  plaza: {
    name: "PLAZA DEL CARBÓN", area: "calle", at: [0, 2, 0],
    describe: [
      "A square with a dry fountain and one sodium lamp, orange in a city that keeps its colour for after dark. Coal was sold here once. The name outlived the coal, as names do.",
      "Tenements ring it, each window a different shade of lit, and now and then a rat crosses the cobbles, from the drain to a doorway. The corner is north, the portal of the casa tomada south, the cutting east."
    ],
    exits: { n: "esquina", s: "casa", e: "terraplen" },
    scenery: [
      { words: ["fountain", "basin", "dry", "fish"], name: "the fountain", says: "A stone basin with a stone fish for a spout, dry since before the sailors left. Someone has filled it with flowerpots and bottle tops." },
      { words: ["lamp", "sodium", "lamppost"], name: "the sodium lamp", says: "Orange. The only light in Prosperidad that is the same colour all day, which is why nobody trusts it." },
      { words: ["tenements", "tenement", "windows", "window", "buildings", "washing"], name: "the tenements", says: "Six floors of grey, and a window on every floor lit another colour: green with a television, red with a bulb, blue with something nobody wants to see." },
      { words: ["rat", "drain", "doorway"], name: "the rat", says: "Gone before you have looked: a grey rat, a drain, a doorway, in that order." },
      { words: ["casa", "portal", "squat", "house"], name: "the casa tomada", says: "A tall grey house with a bicycle chained in its portal and a flag in a window. Twelve families, some of them related.", leads: "s" },
      { words: ["cutting", "railway", "line", "tracks"], name: "the cutting", says: "A gap between two tenements where the railway used to be. At the end of it, a very tall chimney against the sky.", leads: "e" }
    ],
    ambience: { lines: [
      "A window opens in a tenement, a bowl of dishwater arrives, and the window closes.",
      "The sodium lamp ticks as it cools, and the whole square listens.",
      "A child, up much too late, sits on the dry fountain and tells it something."
    ], every: [30, 70] },
    sleep: "Not in the square. The lamp never turns off, and neither do the neighbours.",
    alt: "A small square at night: a dry stone fountain with flowerpots in it in the middle, one orange sodium lamp on the right, and tall tenements all round with windows lit in green, red and blue.",
  },
  casa: {
    name: "THE CASA TOMADA", area: "casa", at: [0, 0, 0],
    describe: [
      "The portal of the casa tomada, looking south: a wall of letterboxes, every one stuffed, and a bicycle chained to a radiator that gave up on the building in 1979. A candle burns on the first stair, paid for by a rota.",
      "The hall runs on to the patio and its light. The plaza is behind you, north."
    ],
    exits: { n: "plaza", s: "patio" },
    scenery: [
      { words: ["letterboxes", "letterbox", "boxes", "mail", "post"], name: "the letterboxes", says: "Forty boxes with names in felt-tip, every one stuffed with leaflets, fines and catalogues nobody will open. One has \"Maza, 3rd\" on it, crossed out." },
      { words: ["bicycle", "bike", "radiator", "chain"], name: "the bicycle", says: "Chained to a radiator that stopped heating the building in 1979. The bicycle has a flat tyre and a very good lock, which is the usual way round in this city." },
      { words: ["candle", "stair", "stairs", "rota"], name: "the candle", says: "A stub in a saucer on the first stair. A paper beside it lists the names of those who have paid for tonight's wax, and the rota is longer than the candle." },
      { words: ["graffiti", "slogans", "wall", "walls", "posters"], name: "the walls", says: "Slogans on slogans, posters on posters, so many layers that the building is mostly paper. One says, in red, WHAT IS FOR SALE IS NOT YOURS." },
      { words: ["hall", "corridor", "tiles"], name: "the hall", says: "Black and white tiles, mostly black. It leads south, towards the patio's cold clean light." }
    ],
    ambience: { lines: [
      "A baby cries upstairs, and somebody sings over it in a language nobody here speaks.",
      "The candle leans in a draught from the patio.",
      "A door slams on the third floor, and the bicycle in the hall rattles on its chain."
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
      { words: ["walls", "wall", "paint"], name: "the walls", says: "Painted blue by someone with ambition and a short budget. A cloud has been added in white, and rubbed out with a sleeve." },
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
      { words: ["pots", "pot", "chimneys", "chimney", "row", "congregation"], name: "the chimney pots", says: "Eleven pots, brick and clay, each with a cap of soot. Only the twelfth, far off at the works, still draws." },
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
    alt: "A flat roof at night under a low moon: a row of chimney pots like dark figures on the left, a sweep in black with a tall hat sitting against a pot on the left third, a skyline of neon colour below on the right, and aerials against the sky."
  },
  terraplen: {
    name: "THE CUTTING", area: "vias", at: [0, 0, 0],
    describe: [
      "A railway cutting under a low moon: grey ballast, two rusting rails and a wagon on a siding with its slide painted shut by slogans nobody has read. The line has not carried a train in ten years.",
      "East, the rails run on to the works and its great chimney. The plaza is west."
    ],
    exits: { w: "plaza", e: "fabrica" },
    scenery: [
      { words: ["rails", "rail", "line", "tracks", "track", "sleepers", "ballast"], name: "the rails", says: "Two rusted lines to the horizon, and the horizon is a factory. Nothing has run on them in ten years." },
      { words: ["wagon", "slide", "slogans", "siding"], name: "the wagon", says: "A goods wagon with its slide painted over in slogans: WAGES, BREAD, NOT THIS. Under them, in older paint, PROSPERIDAD S.A." },
      { words: ["chimney", "works", "factory"], name: "the works", says: "A black hall and, rising out of it, a chimney taller than the tenements. It is the only thing in Prosperidad that is bigger than its own reputation." },
      { words: ["moon", "sky", "clouds"], name: "the moon", says: "Low and yellow, wrapped in a veil of the works' smoke." },
      { words: ["lamp", "signal", "lantern"], name: "the signal lamp", says: "A railway signal, red, which has been saying stop to nobody for a very long time." }
    ],
    ambience: { lines: [
      "A signal lamp clicks, red, and stays red.",
      "Wind comes along the cutting and picks up a newspaper, and turns its pages, and drops it.",
      "Somewhere in the works, a drum starts a rhythm, loses it, and starts again."
    ], every: [30, 70] },
    sleep: "Not on the ballast. The rails are cold, and the works is not.",
    alt: "A railway cutting at night under a low moon: two rusted rails running east to a black factory hall on the right third, with one very tall chimney against the sky, and a goods wagon on a siding on the left."
  },
  fabrica: {
    name: "THE WORKS", area: "vias", at: [1, 0, 0],
    describe: [
      "The old works of Prosperidad S.A., which printed catalogues until the money ran out. A furnace still glows at one end of the hall, fed with pallets by whoever sleeps here, and the great chimney stands in the middle of the floor, black from foot to roof, the flue the building was built round.",
      "{Marga|marga} sits at her drums by the furnace. The way back is west, along the line."
    ],
    exits: { w: "terraplen" },
    scenery: [
      { words: ["furnace", "fire", "embers", "glow", "grate", "pallets"], name: "the furnace", says: "A brick mouth with one red eye, fed with pallets. It is the only heating the band has, and the band is in the oven's debt." },
      { words: ["ash", "floor", "ashes", "soot", "cinders"], name: "the ash", says: "Warm, grey, and deep enough to take a shoe. Under it, a floor of old catalogue pages, burnt in sheets." },
      { words: ["presses", "press", "machines", "machine", "rollers", "belts"], name: "the presses", says: "Iron rollers as tall as a man, still inked in a shade of grey that does not come out of the walls." },
      { words: ["roof", "hole", "sky", "cloud"], name: "the roof", says: "A great hole where the chimney goes up through it, and through the hole, the smoke of the pallets." },
      { words: ["hall", "walls", "wall", "bricks"], name: "the hall", says: "Brick, high as a cathedral, and scorched in the shape of a very large hand where a boiler once burst." },
      { words: ["chimney", "flue", "stack"], name: "the great chimney", says: "A brick chimney as wide as a house, going up through the hall and out through the roof, black from the floor to the cloud. A small iron hatch at its foot has not been opened in eighty years." }
    ],
    ambience: { lines: [
      "The furnace ticks and sighs, as if it were breathing out something it had been saving.",
      "A sheet of burnt paper stands up from the ash in the draught, and lies down.",
      "The great chimney creaks from top to bottom, one long note, and then nothing."
    ], every: [30, 70] },
    sleep: "Not in the ash. Marga says it keeps whoever lies down in it.",
    alt: "The inside of an old works lit red by one furnace: a brick furnace mouth glowing on the left, a girl at a drum kit beside it, the great black chimney rising through the middle of the hall to a hole in the roof on the right, iron presses and a floor of grey ash."
  }
};

// ---- Objects -----------------------------------------------------------------------------------------------------------
const objects = {
  // The start room: the hints thing, the way out (a fire door painted shut) and the crowbar that opens it (BRIEF.md §3).
  radio: { at: "callejon", portable: true, material: "metal", name: "Transistor radio", note: "A late-night call-in.",
    words: { nouns: ["radio", "transistor"], adj: ["transistor", "little", "old", "small"] }, ...item("radio"),
    here: "A {transistor radio|radio} stands on a crate, tuned to a late-night call-in.",
    examine: "A little transistor radio held together with sticking plaster. It is tuned to a call-in show where strangers phone in at night to give each other advice, and some of it is good." },
  puerta: { at: "callejon", material: "metal", name: "Fire door", note: "Painted shut.", door: "n", locked: true,
    lock: { key: "palanca",
      says: "The fire door is painted into its frame. There is a seam along the hinge side, wide enough for the lip of something flat and strong.",
      opens: "You work the crowbar's lip into the seam and lean. The paint lets go like ice, the fire door swings in on its bar, and the bass comes out to meet you.",
      then: "arrival" },
    shut: "You put a shoulder to the dent. The fire door does not even rattle.",
    words: { nouns: ["door"], adj: ["fire", "steel", "metal", "grey"] },
    parts: [{ words: ["seam", "gap", "paint", "frame", "hinge", "dent"], name: "the seam", says: "A black line of old paint along the hinge side, with a dent at shoulder height where others have tried." }],
    examine: "A steel fire door with a push bar and no handle on this side, painted into its frame by a decade of coats. A dent at shoulder height says others have tried; a seam along the hinge side says they should have brought something." },
  palanca: { at: "callejon", portable: true, material: "metal", name: "Crowbar", note: "Heavy, flat at one end.",
    words: { nouns: ["crowbar", "jemmy", "bar"], adj: ["iron", "rusty", "heavy"] }, ...item("palanca"),
    here: "A {crowbar|palanca} leans against the bin, black with the paint of other doors.",
    examine: "A rusty crowbar, the lip of its claw clogged with paint from other doors. Heavy enough to be an argument." },

  // Backstage
  puerta_trasera: { at: "trastienda", material: "metal", name: "Back door", note: "Out to the alley.", door: "s",
    words: { nouns: ["door"], adj: ["back", "fire", "steel", "metal", "grey"] },
    examine: "The fire door from the inside: a push bar, propped open, and the alley's pink puddles beyond it." },
  funda: { at: "trastienda", container: true, open: false, material: "wood", name: "Guitar case", note: "Rattles when tipped.",
    words: { nouns: ["case"], adj: ["guitar", "black", "battered"] },
    examine: "A black guitar case with a broken clasp, held shut by a belt. When you tip it, something small and many rattles, and it is not a guitar." },
  cuerdas: { at: "funda", portable: true, material: "paper", name: "Bass strings", note: "Still in the sleeve.",
    words: { nouns: ["strings", "string", "sleeve", "pack"], adj: ["bass", "sealed", "spare"], pl: true }, ...item("cuerdas"),
    examine: "A paper sleeve of bass strings, sealed, with a band's name biro'd on it: NADA PERSONAL. Somebody was saving them for a night like this." },

  // El Charlie
  cuco: { portrait: sprites.cuco_portrait, at: "charlie", name: "Cuco", note: "Runs the sound.",
    words: { nouns: ["cuco", "sound", "soundman"], adj: [], proper: true, g: "m" },
    examine: "A thin man in a leather jacket with a mohawk like a stripe of black paint, bent over a sound desk with three working faders. He has the look of a man whose music has left home.",
    talk: `"Don't ask me for a request," says Cuco without turning round. "I've only got half a night."`,
    topics: {
      deck: { open: true, label: "the tape", words: ["tape", "cassette", "music", "desk", "night", "sound"], says: `"Between bands I play one tape, always the same, and tonight it's the wrong one," says Cuco. "The right one left with somebody, and I've no way to ask for it. Pride's a bad stand to be dancing on."` },
      marisol: { label: "Marisol", words: ["marisol", "corner", "woman"], says: `Something goes across his face and is put away. "Marisol? She's on the corner, where she's always been. We were friends once. She has my tape, and I'm not going to ask her."` },
      tie: { label: "a black tie", words: ["tie", "black", "silk", "funeral", "corbata"], says: `"A black tie?" Cuco looks at you as if you had asked for his liver. "I've got one, in the desk drawer. My father's, for his funeral and mine. Silk, as it happens. I'd give it up for the tape, and for nothing else."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"Him? He stands by the back table when he comes, and he doesn't look at the mirror, and the kids who do look at him," says Cuco. "Ask Pelayo when he's due. Pelayo keeps the clock."` },
      default: `"Sorry," says Cuco, over the bass. "I only hear what's coming through the headphones."`
    },
    give: `"That's nice," says Cuco. "But it isn't my tape."` },
  pelayo: { portrait: sprites.pelayo_portrait, at: "charlie", name: "Pelayo", note: "Runs the bar.",
    words: { nouns: ["pelayo", "barman", "bouncer"], adj: ["big"], proper: true, g: "m" },
    examine: "A very large man in a studded collar, with arms like a pair of sleeping dogs and a pencil behind each ear. He serves beer like a man laying a table for the dead, and never spills.",
    talk: `"What?" says Pelayo, which is how he says hello. "Beer or noise?"`,
    topics: {
      band: { open: true, label: "the band", words: ["band", "nacho", "string", "strings", "works", "bass", "bassist"], says: `"Nada Personal are down at the works tonight, rehearsing with a furnace," says Pelayo. "Nacho snapped a bass string on Tuesday and sulks without one. There's a spare pack in the guitar case backstage, if somebody wanted to be a hero."` },
      bar: { open: true, label: "the bar", words: ["bar", "beer", "drink", "price", "tab"], says: `"A beer's a coin," says Pelayo. "Not thirty pesetas, not a favour: a coin. The punks drop them on the pavement out front on their way in, and that is what they are for. Don't ask for credit; I've seen your face on a wanted list."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "round", "when"], says: `"Regular as the post," says Pelayo. "He does El Charlie, a beer, then down the Avenida to La Ópera, back by the Avenida to the post for his letter, then the Avenida again, and round to me. He gives each door four minutes and not a second more, because a man who stays is a man who gets noticed."` },
      default: `"Not my business," says Pelayo. "My business is that glass."`
    },
    give: `"I take cash or I take nothing," says Pelayo, and hands it back.` },

  // Beer at El Charlie: a beer is a coin, and the three coins on the Avenida's pavement are spent one at a time (`remains`: three coins,
  // two coins, one coin; the beer's `requires` is the first of them). The second beer makes you drunk (the condition's `doses`).
  cerveza: { at: null, from: "pelayo", requires: "monedas", spends: true, times: 3, material: "glass", name: "Beer", note: "Cold, in a glass.",
    lacking: `"A beer's a coin," says Pelayo, and waits. "I don't do tabs."`,
    brought: ["Pelayo takes a coin, pulls a {beer|cerveza} and sets it down like a man laying a table for the dead.", "Pelayo takes another coin, and pulls another {beer|cerveza}.", "Pelayo takes the last coin, pulls the last {beer|cerveza}, and looks at you like a man counting the house."],
    already: `"Drink that one first," says Pelayo.`, again: `"That's three," says Pelayo. "Past three they sing, then they cry, and then I mop."`,
    consumable: true, starts: "drunk", drink: ["Cold and bitter, and the first thing tonight that was yours.", "Warmer, and a little further from the floor.", "It goes down like a dare."],
    words: { nouns: ["beer", "glass", "pint"], adj: ["cold"] },
    examine: "A glass of beer, cold, with a head that Pelayo cut with the side of a knife." },
  // Coffee at La Ópera: a coin too (the same coins as the beer's), served by Doña Aurora's word and Gaspar's hands. It ends the drunk condition
  // (`stops`); drunk or not, it tastes of coffee. One coffee in all (`times: 1`). Drunk also ends by time (the condition's `lasts`) and by a sleep of
  // four hours or more (the engine's: js/sleep.js, SOBERS), so the world writes nothing for sleeping.
  cafe: { at: null, from: "aurora", requires: "monedas", spends: true, times: 1, material: "glass", name: "Coffee", note: "Black, in a small cup.",
    lacking: `"A coffee is a coin, darling," says Doña Aurora, between two bars. "I don't pay my chorus in good intentions."`,
    brought: "Doña Aurora takes the coin out of your hand without losing the note, and nods at Gaspar, who sets down a {coffee|cafe}, black, without a word.",
    already: `"Drink that one first, darling," says Doña Aurora.`, again: `"One is enough," says Doña Aurora. "Two and you start singing, and I do not share the stage."`,
    consumable: true, stops: "drunk", drink: "Black, bitter and scalding. It tastes of coffee, and of the good side of the night.",
    words: { nouns: ["coffee", "cup", "espresso"], adj: ["black", "hot", "small"] },
    examine: "A small cup of black coffee on a saucer, steaming, with the chip in its rim turned politely away from you." },
  monedas: { at: "avenida", portable: true, material: "metal", name: "Three coins", note: "A drink each.", remains: "monedas_2",
    words: { nouns: ["coins", "coin", "money", "change"], adj: ["three", "copper"], pl: true }, ...item("monedas"),
    here: "Three {coins|monedas} lie on the pavement in front of El Charlie's door, where the queue stands and pockets are loose.",
    lies: "Three coins lie where they were put down.",
    examine: "Three copper coins, warm from somebody's pocket, worn smooth. A coin is a beer at El Charlie, or a coffee at La Ópera." },
  monedas_2: { at: null, portable: true, material: "metal", name: "Two coins", note: "A drink each.", remains: "moneda_1",
    words: { nouns: ["coins", "coin", "money", "change"], adj: ["two", "copper"], pl: true }, ...item("monedas_2"),
    lies: "Two coins lie where they were put down.", examine: "Two copper coins, worn smooth. A coin is a beer at El Charlie, or a coffee at La Ópera." },
  moneda_1: { at: null, portable: true, material: "metal", name: "Coin", note: "One drink.",
    words: { nouns: ["coin", "money", "change"], adj: ["last", "copper"] }, ...item("moneda_1"),
    lies: "A coin lies where it was put down.", examine: "A copper coin, worn smooth. One more drink: a beer at El Charlie, a coffee at La Ópera." },

  // The Minister: on his round (the rounds: rooms listed in order, a step every four of your moves)
  ministro: { portrait: sprites.ministro_portrait, at: "opera", name: "The Minister", note: "On his round.",
    rounds: { rooms: ["charlie", "avenida", "opera", "avenida", "estafeta", "avenida"], every: [4, 4] },
    arrives: ["The Minister comes in, nods to the room as to a provincial audience, and takes the best spot it has.", "The Minister arrives with his case, his hat and his four minutes."],
    leaves: ["The Minister finishes his drink, buttons his coat and goes on to the next door.", "The Minister looks at his watch, which is not there, and leaves."],
    words: { nouns: ["minister", "dealer", "ildefonso", "ministro"], adj: ["the", "old", "tall"], g: "m" }, ...item("ministro"),
    here: "{The Minister|ministro} is here, in a camel coat and a grey hat, with a leather case in one hand and the air of a man visiting the provinces.",
    examine: "A tall thin man of sixty in a camel coat, a grey hat and gold-rimmed glasses, with a leather case that is never put down. His collar is open at the neck and there is no tie in it. He shakes hands like a bishop and counts like a bank.",
    talk: `"Good evening," says the Minister, as to a delegation. "I have four minutes, and I never spend them badly."`,
    topics: {
      want: { open: true, label: "what he takes", words: ["take", "takes", "money", "price", "want", "wants", "favour", "favours"], opens: ["tie"], says: `"Money is a paper trail, and I do not leave paper," says the Minister. "I take things. Tonight I need one, and it is a black tie, a good one, silk if the city can manage it. The shops are shut, my own is somewhere it should not be, and I will not go to a funeral with an open collar."` },
      coat: { open: true, label: "what you came for", words: ["coat", "case", "stock", "wrap", "wraps", "goods", "powder", "what", "came"], says: `"What you came for is in this case, and it will still be in this case when I have my tie," says the Minister. "Not before. I have never sold on credit, and I have never been sorry."` },
      tie: { label: "the tie", words: ["tie", "silk", "black", "funeral", "collar"], opens: ["matilde"], says: `"The funeral is in the morning. A black tie, my friend, or I stay in the doorway," says the Minister. "Ask the ones who bury and marry, a man always keeps one tie he hates. And bring it to me on my round, not to my house. I have no house."` },
      matilde: { label: "the funeral", words: ["funeral", "matilde", "sister", "church", "mass", "judas"], says: `"My sister. Matilde Peláez, thirty years portera of number nine, Calle Hierro, now the casa tomada," says the Minister. "She fed half the stair on a salary that would not feed a cat. Mass at San Judas, first thing. The first bus stops outside, and I will be there, tied."` },
      round: { open: true, label: "his round", words: ["round", "walk", "rounds", "where", "post", "letter"], says: `"I do El Charlie, the Avenida, La Ópera, the Avenida, the post for my letter, the Avenida again," says the Minister. "Four minutes a door. I have walked it eleven years and I have never been robbed, because nobody can predict a man who is entirely predictable."` },
      default: `"A pleasant question," says the Minister, "but I have only four minutes."`
    },
    give: `"A kind thought," says the Minister, "but no. I want one thing tonight, and that is not it."` },

  // The avenue and the corner
  marisol: { portrait: sprites.marisol_portrait, at: "esquina", name: "Marisol", note: "Works the corner.",
    words: { nouns: ["marisol", "woman", "lady"], adj: [], proper: true, g: "f" },
    examine: "A woman in a short coat and good shoes, her hair up, her face bare and tired. She has the patience of a bank and the manners of a duchess, and she has not once pretended to be anything else.",
    talk: `"Evening, Emperor," says Marisol. "If you're working, work on the other pavement. If you're looking, look at the lamp."`,
    topics: {
      work: { open: true, label: "her work", words: ["work", "job", "corner", "lamp", "price", "customers"], says: `"Fifteen minutes, a hundred pesetas, no kissing. Eleven years, one lamp, and nobody I've ever had to carry out." She says it like a train timetable. "It's a trade. Nobody's ashamed of selling bread."` },
      eyes: { open: true, label: "her eyes", words: ["eyes", "face", "kohl", "makeup", "make-up", "tired"], opens: ["tape"], says: `"My eyes look bad because my kohl pot is empty," she says. "Fifteen years I've used the same black, and the shop that sold it has gone out of business. A sweep's soot does for a lady what a pot can't, and the only sweep left is on the roof of the casa tomada."` },
      tape: { label: "the tape", words: ["tape", "cassette", "cuco"], says: `"Cuco's tape," she says, and does not smile. "He left it with me the night he stopped speaking to me. It has the one song he can't play and can't live without. If somebody brought me a bit of the black stuff for my eyes, I could spare it."` },
      name: { label: "your name", words: ["name", "javier", "emperor", "emperador"], says: `"You've been the Emperor since you were a joke someone told," she says. "Before that you were Javier, from the third floor, with the cough. Matilde the portera fed you on the stair. Nicanor's got it written down somewhere."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"The Minister? Don't try to buy. He has a manner of looking at money like a priest at a bikini," says Marisol. "He takes favours. And he's on his round: ask at El Charlie, they keep his hours."` },
      default: `"I don't know about that, love," says Marisol, "but if you find out, tell the lamp."`
    },
    give: `"Not for me, love," says Marisol. "I only take what I can use."` },
  hollin: { at: null, portable: true, material: "soft", name: "Jar of soot", note: "Fine and black.",
    words: { nouns: ["soot", "jar", "hollin", "black"], adj: ["jar", "fine", "black"] }, ...item("hollin"),
    examine: "A jam jar of chimney soot, fine as flour and black as a sworn oath. Good for the eyes, if you know the ladies, and good for the lungs of no one." },

  // The post office
  remedios: { portrait: sprites.remedios_portrait, at: "estafeta", name: "Doña Remedios", note: "Stamps everything.",
    words: { nouns: ["remedios", "dona", "doña", "clerk", "woman"], adj: ["doña", "stout"], proper: true, g: "f" },
    examine: "A stout woman in a cardigan and a hairnet, with a stamp in each hand and a third behind her ear. She does not look up at anything she has not already filed.",
    talk: `"Next," says Doña Remedios, though there is no one else. "Name, street, floor, in that order. Not that order. Floor first."`,
    topics: {
      post: { open: true, label: "the post", words: ["post", "letters", "mail", "sack", "stamp", "work", "van"], says: `"I sort what comes, I stamp what goes, I return what has nobody to go to," says Doña Remedios. "Nine out of ten are returns. People move faster than their addresses."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "letter", "post"], says: `"Every Saturday, a registered letter, his pension from the Pharmacists' College," says Doña Remedios. "The only money he takes, and he calls it a refund. He signs with a hand like a prescription. A struck-off chemist, if you want my opinion, and nobody has asked for it."` },
      matilde: { label: "Matilde", words: ["matilde", "portera", "peláez", "pelaez", "funeral"], says: `"Thirty years of Matilde's letters to a boy on the third floor of number nine, and thirty years of 'Return to sender: not known'," says Doña Remedios. "Javier Maza, Calle Hierro nine. She never stopped writing. I never stopped sending them back. Don't look at me: I stamp what's stamped."` },
      default: `"I cannot stamp that," says Doña Remedios, and stamps something else.`
    },
    give: `"I take letters and I take stamps," says Doña Remedios, "and that is not either."` },

  // The pension
  nicanor: { portrait: sprites.nicanor_portrait, at: "pension", name: "Don Nicanor", note: "Keeps the desk.",
    words: { nouns: ["nicanor", "don", "landlord", "clerk", "manager"], adj: ["don"], proper: true, g: "m" },
    examine: "A thin man with a moustache that has outlived two wives, in a cardigan the colour of the lobby. He has a gift for not noticing, and uses it as a trade.",
    talk: `"Rooms by the hour, the night or the year," says Don Nicanor. "The year is for people who have given up. I do not recommend it."`,
    topics: {
      rooms: { open: true, label: "a room", words: ["room", "rooms", "bed", "night", "hour", "rent"], says: `"Eight pesetas an hour, thirty a night, and no questions at either rate. The only room I don't rent is seven. That one's taken, by a lady who pays on the first."` },
      book: { open: true, opens: ["name"], label: "the Book of Hours", words: ["book", "ledger", "hours", "names", "register"], says: `"Every name that has ever stayed here is in the Book," says Don Nicanor. "Even yours. Javier Maza, number seven, 1979, third night. A baby with a cough, in a room with no heating, and a mother on the late shift. The portera from the corner of Calle Hierro brought a pan of soup up the stairs. I remember because you were a better sleeper than your mother."` },
      marisol: { label: "Marisol", words: ["marisol", "seven", "tenant"], says: `"Room seven is Marisol's," says Don Nicanor. "She pays on the first and she has never once slammed a door. If you want to see how a lady lives, go up and look. She does not mind. She leaves it open."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"A gentleman," says Don Nicanor. "He rented the corner room by the night for forty years, until the night he did not. I do not ask what a gentleman carries in his case, and a gentleman does not tell me."` },
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

  // La Ópera
  aurora: { portrait: sprites.aurora_portrait, at: "opera", name: "Doña Aurora", note: "Owns the stage.",
    words: { nouns: ["aurora", "dona", "doña", "singer", "woman", "owner"], adj: ["doña", "feathered"], proper: true, g: "f" },
    examine: "A woman of fifty-eight with a mass of dyed red hair, a green feather boa and nothing else above the waist, who stands as if the stage were a pulpit and the room a congregation of her debtors. She sings like someone who was once taken seriously, and has decided to take herself so.",
    talk: `"Darling," says Doña Aurora between two bars, "if you've come to listen, shut up. If you've come to drink, Gaspar is deaf."`,
    topics: {
      room: { open: true, label: "the room", words: ["room", "bar", "ópera", "opera", "stage", "singing", "sing"], says: `"Forty years ago this was the café opposite the opera house, and every chorus girl in the city took her coffee at that table," says Doña Aurora. "The opera house is a bank now. The chorus girls are grandmothers. I am the last of them still in feathers."` },
      coffee: { open: true, label: "the coffee", words: ["coffee", "cup", "gaspar", "machine", "sober"], says: `"A coin, darling, the same as before the opera house became a bank," says Doña Aurora. "Gaspar makes it black and never discusses it. It has sobered up better men than you."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "table", "gentleman"], says: `"Don Ildefonso? Round table, back to the wall, a carajillo he never finishes," says Doña Aurora. "He's a gentleman and he has been a minister for eleven years, because he visits his constituencies on schedule. Wait a few minutes and he'll be along, he gives me four."` },
      tie: { label: "a black tie", words: ["tie", "black", "silk", "funeral"], says: `"A black tie? Last night he asked me for one, poor man, with his sister still warm on a slab," says Doña Aurora. "The ones I have are bow ties and yellow. Ask round the bars, darling. Someone has buried somebody."` },
      matilde: { label: "Matilde", words: ["matilde", "sister", "portera", "funeral"], says: `"Matilde Peláez, the portera of Calle Hierro nine. He never told anyone he had a sister, until she was a death," says Doña Aurora. "She kept a boy on the third floor alive with soup, and wrote him letters for thirty years. He never wrote back. The Minister says so himself, over his carajillo, every night this week."` },
      default: `"I could not say, darling," says Doña Aurora, "and I would have a chorus to say it for me."`
    },
    give: `"Lovely," says Doña Aurora. "But I only collect hearts and debts."` },

  // The launderette
  secadora: { at: "lavanderia", name: "Big dryer", note: "Wants tokens.",
    words: { nouns: ["dryer", "drier", "machine", "porthole", "slot"], adj: ["big", "end", "large"] },
    parts: [{ words: ["shape", "latch", "glass", "drum", "brush", "bristles"], name: "the shape in the drum", says: "Something long and dark lies against the glass, held in by the latch. The latch lets go only at the end of a paid cycle." }],
    examine: "A huge old dryer with a round glass door and a coin slot that says TOKENS. Something long and dark lies inside, held by a latch that only lets go at the end of a cycle.",
    switch_on: "The dryer does nothing. The slot says TOKENS, and it says it like a bailiff.",
    push: "The dryer does nothing. The slot says TOKENS.",
    take: "It is bolted to the floor, and has been since the Civil War." },
  cepillo: { at: null, portable: true, material: "wood", name: "Sweep's brush", note: "Long, black, stiff.",
    words: { nouns: ["brush", "cepillo"], adj: ["sweep's", "sweeps", "chimney", "long", "black"] }, ...item("cepillo"),
    examine: "A chimney sweep's brush on a jointed cane, black as the inside of a pot. Burnt into the handle with a hot nail: T. H." },
  fichas: { at: null, portable: true, material: "metal", name: "Laundry tokens", note: "Brass, with a hole.",
    words: { nouns: ["tokens", "token", "coins"], adj: ["laundry", "brass"], pl: true }, ...item("fichas"),
    examine: "A fistful of brass tokens stamped LAVANDERÍA, each with a small hole through it. Enough for one machine, and the machine knows how many." },

  // The tape and the tie
  cinta: { at: null, portable: true, material: "paper", name: "Tape", note: "No label.",
    words: { nouns: ["tape", "cassette", "cinta"], adj: ["unlabelled", "plain", "cheap"] }, ...item("cinta"),
    examine: "A cheap cassette with no label, only a thumbprint in what might be eyeliner. The spools are very evenly wound, as if the tape had been kept for something." },
  corbata: { at: null, portable: true, material: "soft", name: "Black tie", note: "Silk, creased.",
    words: { nouns: ["tie", "necktie", "corbata"], adj: ["black", "silk", "narrow"] }, ...item("corbata"),
    examine: "A narrow black silk tie, creased in the middle from one funeral too many and still, somehow, the best thing in the bar." },
  papelina: { at: null, portable: true, material: "paper", name: "Paper wrap", note: "Folded small.",
    words: { nouns: ["wrap", "papelina", "paper", "packet"], adj: ["paper", "folded", "small"] }, ...item("papelina"),
    examine: "A little square of paper folded to the size of a thumbnail, and heavier than it looks. It is what you came for, and nobody has told you what you do with it next." },

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
      sweeping: { open: true, label: "the sweeping", words: ["sweep", "sweeping", "chimney", "chimneys", "pots", "work", "job", "soot"], says: `"Eleven pots up here, and a twelfth at the works that's bigger than all of them," says Tomás. "I've swept them for forty years. Whoever sweeps a chimney keeps the soot. That's the whole of the law."` },
      brush: { open: true, label: "his brush", words: ["brush", "lost", "cane"], says: `"I left it in the dryer at the Lavandería last winter, in my overalls," says Tomás. "The latch locked on it and I'd no token to run the cycle, and the owner's in Valencia. A sweep without a brush is a man with a chimney in his head."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"Don Ildefonso? He pays me in kindness, and I pay him in soot," says Tomás. "Every chimney he's ever sat under has been swept by a man who owed him. That's a minister, I suppose."` },
      default: `"Can't say," says Tomás. "I only know soot."` },
    give: `"That's not mine," says Tomás, "but thank you."` },

  // The works
  marga: { portrait: sprites.marga_portrait, at: "fabrica", name: "Marga", note: "Drummer, Nada Personal.",
    words: { nouns: ["marga", "drummer", "girl"], adj: [], proper: true, g: "f" },
    examine: "A girl of nineteen at a drum kit made of two drums and a bucket, with cropped black hair, a torn T-shirt and her sticks stuck in her belt like knives. She watches you with the patience of someone who has been told to wait for everything.",
    talk: `"If you've come to tell me to turn it down, the answer's the furnace," says Marga. "It's louder than I am."`,
    topics: {
      band: { open: true, opens: ["strings"], label: "the band", words: ["band", "nada", "personal", "nacho", "rehearsal", "drums", "sticks"], says: `"Nada Personal. Four of us, three here: Nacho's gone to sulk. He broke a bass string on Tuesday and the music shop's shut till Monday, and he says he can't play without it, which is a lie, but a stubborn one," says Marga.` },
      strings: { label: "the strings", words: ["strings", "string", "bass", "sleeve", "pack"], says: `"Bass strings? You've got a spare pack? Bring it, and I'll give you the band's laundry fund. Fourteen tokens in a coffee tin. Nacho can wash his socks on Monday, he'll be glad to," says Marga.` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"The Minister? He came here once, to hear us. Stood at the back for three songs with his hat on. Left a tip in the tin. A hundred pesetas, in coins, like a hat in a church," says Marga.` },
      default: `"Dunno," says Marga, and hits the bucket.`
    },
    give: `"Not mine," says Marga. "I'll take strings, though."` }
};

// ---- The puzzles -----------------------------------------------------------------------------------------------------------
const puzzles = {
  // The way out of the start room comes first (BRIEF.md §3): the radio's first hints are about it.
  way_out: { where: "callejon", needs: [], solve: ["{take} crowbar", "unlock door with crowbar", "north"], reaches: "trastienda", clues: ["puerta", "palanca"],
    hints: ["The fire door is painted into its frame, with a seam along the hinge side, and something heavy leans against the bin.", "Take the crowbar, prise the fire door open with it, and go north."] },
  take_strings: { where: "trastienda", needs: [], solve: ["open case", "{take} strings"], gives: ["cuerdas"], clues: ["funda", "pelayo"],
    hints: ["The guitar case backstage rattles when it is tipped, and a band is short of something.", "Open the guitar case and take the bass strings."] },
  strings_for_tokens: { where: "fabrica", needs: ["cuerdas"], solve: ["give strings to marga"], gives: ["fichas"], clues: ["marga", "pelayo"],
    hints: ["Marga's band is down a string, and they keep their laundry money in a tin.", "Give the bass strings to Marga at the works, and she will give you the laundry tokens."] },
  run_dryer: { where: "lavanderia", needs: ["fichas"], solve: ["put tokens in dryer", "{take} brush"], gives: ["cepillo"], clues: ["secadora", "tomas"],
    hints: ["The dryer in the Lavandería takes tokens, and something long is waiting behind its latch.", "Put the tokens in the dryer, and take what comes out."] },
  sweep_roof: { where: "azotea", needs: ["cepillo"], solve: ["give brush to tomas"], gives: ["hollin"], clues: ["tomas", "cepillo", "marisol"],
    hints: ["The sweep on the roof of the casa tomada is missing his brush.", "Give the brush to Tomás, on the roof, and he will sweep a pot and give you the soot."] },
  line_eyes: { where: "esquina", needs: ["hollin"], solve: ["give soot to marisol"], gives: ["cinta"], clues: ["marisol", "hollin", "kohl"],
    hints: ["Marisol's kohl pot is empty, and sweeps' soot does for the eyes what a pot cannot.", "Give the soot to Marisol on the corner, and she will give you Cuco's tape."] },
  tape_for_tie: { where: "charlie", needs: ["cinta"], solve: ["give tape to cuco"], gives: ["corbata"], clues: ["cuco", "pintada"],
    hints: ["Cuco's tape is on the corner, and he owns the one black tie the Minister needs.", "Give the tape to Cuco, at El Charlie, and take the black tie."] },
  corona: { where: "avenida", needs: ["corbata"], solve: ["give tie to minister", "say emperor"], ending: true, clues: ["ministro", "cuco"],
    hints: ["The Minister takes no money, and wants a black tie for a morning funeral. He will ask in whose name he writes it.", "Give the tie to the Minister, and tell him you are the Emperor."] },
  nombre: { where: "avenida", needs: ["corbata"], solve: ["give tie to minister", "say javier"], ending: true, clues: ["ministro", "marisol", "nicanor"],
    hints: ["Marisol and Don Nicanor both remember a name that is not the Emperor.", "Give the tie to the Minister, and tell him you are Javier."] }
};

// ---- Rules -----------------------------------------------------------------------------------------------------------------
const rules = [
  // The crowbar in the seam, said the other ways a player says it: the lock's own line opens it (the lock's key is the crowbar).
  // The dryer: tokens in, the latch lets go.
  { id: "put_tokens", match: { verb: ["put", "use"], obj: "fichas", obj2: "secadora" }, if: [{ "player.at": "lavanderia" }], once: true,
    again: "The dryer has had its tokens and tumbles on, thinking.",
    do: [{ say: "The tokens go in one by one, each with a small wet note. The dryer shudders through a cycle, the latch clicks like a knuckle, and the door drops open on a long black {brush|cepillo}, warm as bread." },
         { draw: "lavanderia", remove: ["cepillo_*"] }, { move: "fichas", to: null }, { move: "cepillo", to: "lavanderia" }] },
  // Marga: strings for the band's laundry tokens.
  { id: "give_strings", match: { verb: ["give", "show", "use", "put"], obj: "cuerdas", obj2: "marga" }, if: [{ "player.at": "fabrica" }], once: true,
    again: `"One pack's enough, thanks," says Marga. "Nacho can only break one at a time."`,
    do: [{ say: `Marga takes the sleeve as if it were a live thing and kisses the band's name on it, once. She reaches under the bucket for a coffee tin, tips fourteen brass {tokens|fichas} into her palm and puts them in yours. "Tell Nacho I did it," she says. "Tell him nothing else."` },
         { move: "cuerdas", to: null }, { move: "fichas", to: "player" }] },
  // The sweep: the brush back, the soot out.
  { id: "give_brush", match: { verb: ["give", "show", "use", "put"], obj: "cepillo", obj2: "tomas" }, if: [{ "player.at": "azotea" }], once: true,
    again: `"I've swept the one," says Tomás. "The jar's all yours."`,
    do: [{ say: `Tomás takes the brush as another man would take a child. He sweeps the nearest pot, once, with a sound like a long breath, and a cloud of soot comes out, black as a church. He fills a jar of {soot|hollin} from it without looking, and hands you the jar. "Keep it for a lady's eyes," he says. "That's what it's for." The brush goes back in his belt, and the gap in it closes.` },
         { move: "cepillo", to: null }, { move: "hollin", to: "player" }] },
  // Marisol: soot for her eyes, and the tape.
  { id: "give_soot", match: { verb: ["give", "show", "use", "put"], obj: "hollin", obj2: "marisol" }, if: [{ "player.at": "esquina" }], once: true,
    again: `"One jar's all I need," says Marisol. "Don't spoil me."`,
    do: [{ say: `Marisol takes the jar and dips a finger in. She draws a line along each eye, a flick at the corner, without a mirror, in four seconds. When she turns to the lamp she looks like someone who has never been tired. "There," she says. "Now I'm open for business. Go on, take it." She reaches into her coat and brings out a {tape|cinta}, thumbprinted in black. "Tell him it's from the corner. Tell him nothing else."` },
         { move: "hollin", to: null }, { move: "cinta", to: "player" }] },
  // Cuco: the tape, and the tie.
  { id: "give_tape", match: { verb: ["give", "show", "use", "put"], obj: "cinta", obj2: "cuco" }, if: [{ "player.at": "charlie" }], once: true,
    again: `"One's all I need," says Cuco. "I've got the night back."`,
    do: [{ say: `Cuco holds the tape as if it were hot. He slots it in a battered player under the desk, and the first bars of something cheap and enormous come out of one speaker, and the whole floor shifts a quarter-turn, as though somebody had remembered something. He does not look round. He opens the desk drawer, takes out a {black tie|corbata}, and slips it into your hand without turning. "My father's. Don't spill on it."` },
         { move: "cinta", to: null }, { move: "corbata", to: "player" }] },
  // The Minister: the tie for what you came for, and in whose name he writes it.
  { id: "trade_tie", match: { verb: ["give", "show", "use", "put"], obj: "corbata", obj2: "ministro" }, if: [{ "ministro.traded": false }],
    do: [{ say: `The Minister takes the tie in two fingers and runs it through them like a rosary. He puts it on, in the dark, without a mirror, and the open collar closes on his throat like a door on an argument. "That will do," he says. "That will do very well." From the leather case he takes a {paper wrap|papelina}, folded to the size of a thumbnail, and lays it in your palm. "What you came for. The book, now: I write every transaction, and I write the name I mean to be held to. Whose name?"` },
         { set: "ministro.traded", to: true }, { move: "corbata", to: null }, { move: "papelina", to: "player" }] },
  { id: "sign_crown", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: CROWN } }],
    do: [{ say: `"The Emperor," says the Minister, and writes it. "A title, and not a name, but I have signed worse." He closes the book. "Reign, then. The strip will want its emperor, and it will send him the bill."` },
         { say: `Before you have crossed the Avenida the news has gone round faster than he walks. Somebody finds a crate, somebody else a crown of gilt cardboard from a long-closed opera, and the strip, which has everything for sale, gives you this for nothing, which is how you know it will cost you. Nobody laughs. The work goes on.` },
         { end: true, picture: "crowned" }] },
  { id: "sign_name", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: NAME } }],
    do: [{ say: `The pen stops. "Javier," says the Minister, and for a moment he is not selling anything. "Matilde's boy, on the third floor. She said you would turn up when it cost something." He writes the name slowly, the first real one in the book. "You may keep what is in your hand. I do not give refunds, and I do not give advice. The first bus leaves from the plaza for San Judas. It has a seat, and so, tied as I am, have I."` },
         { say: `Nobody on the strip calls you the Emperor when you walk to the stop. They say the other name. It sounds small, and strange, and fits. Marisol, at her lamp, lifts a hand and does not say anything, and you carry what you came for in one pocket and a clean shirt in the other.` },
         { end: true, picture: "named" }] },
  { id: "sign_early", match: { verb: "say" }, if: [{ "ministro.traded": false }, { "ministro.at": "$here" }, { $text: { in: [...CROWN, ...NAME] } }],
    do: [{ say: `"Names come after business," says the Minister, not unkindly. "What is it you have for me?"` }] },
  { id: "sign_other", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }],
    do: [{ say: `"I cannot write that," says the Minister. "A name is something you can be held to. Try again."` }] }
];

// ---- The opening, declared (BRIEF.md §3) ----------------------------------------------------------------------------------------
const opening = {
  room: "callejon", hints: "radio", way: "puerta",
  intro: "You are the Emperor of Prosperidad, and tonight the Emperor wants something. The Minister has it: he walks his round of the bars every night, and he doesn't take money. A beer mat told you so, in capitals, before the wind had it. It is one in the morning, and you have no money anyway.",
  lines: {
    hintFrame: "You put the radio to your ear. On the late-night call-in a caller says:"
  }
};

// ---- The change set -----------------------------------------------------------------------------------------------------
export default {
  because: "A blind alley behind a punk bar, then a grey city's strip, two bars and a launderette on a Saturday night in 1985, and a dealer who walks his round and wants a black tie.",
  opening,
  facts: [
    "The player is the Emperor, a punk of the strip in Prosperidad, 1985; his name before that was Javier (Maza, of Calle Hierro nine, third floor); the start room is the blind alley behind El Charlie, south of backstage through the fire door.",
    "The Minister, Don Ildefonso Peláez, is a dealer who walks his round: El Charlie, the Avenida, La Ópera, the Avenida, the Estafeta, the Avenida; he takes no money. He wants a black tie for his sister Matilde's funeral.",
    "The chain: crowbar, bass strings from the guitar case, tokens from Marga, the sweep's brush from the Lavandería dryer, soot from Tomás, the tape from Marisol, the black tie from Cuco, and the Minister's paper wrap.",
    "Two endings: the Emperor takes the wrap and the crown; Javier takes the first bus to the funeral."
  ],
  properties: {
    "ministro.traded": { type: "boolean", start: false }   // the Minister has the tie and has asked in whose name he writes it
  },
  effects: [
    { time: "day 1 01:00", weekday: "sat" },                 // the game starts at one in the morning, in the alley
    // What the fire door lets in when it opens (the lock's `then`): the Avenida's hour, its line, and the door's own words.
    { add: "change", id: "arrival", effects: [
      { time: "day 1 01:10", weekday: "sat" },
      { set: "puerta.examine", to: "The fire door, open on its bar, with a clean crack of bare steel down the hinge side where the paint gave." },
      { set: "puerta.note", to: "Open, on its bar." },
      { set: "callejon.describe", to: [
        "Grey brick on both sides and a wall behind: the back of El Charlie, with crates, a bin and puddles that hold the pink of a neon tube. The tube has been saying half a word since the spring.",
        "The {fire door|puerta} at the far end stands open on its bar, a clean crack of steel down its hinge side, and the bass comes out of it like a pulse through a wall."
      ] },
      { say: "Ten past one, and the whole city is paying for its colours." }
    ] },
    // Drunk, after a couple of beers: the picture sways and doubles, words slur, feet take wrong turns; it wears off with time.
    { add: "condition", id: "drunk", doses: 2, lasts: { seconds: [60, 90] }, starts: "You're drunk", ends: "You're sober again", status: "You're drunk on beer",
      filters: ["sway", "ghost"], speech: { slur: true, answer: `"Come again?" they say, to your slur.` },
      movement: { chance: 0.3, says: ["Your feet take you another way than the one you meant.", "You set off one way, and the street turns you round."] } },
    // Verbs this world needs
    { add: "word", verb: "open", words: ["prise", "pry", "force", "jemmy", "lever"] },
    { add: "word", verb: "order", reply: "Nobody here has any use for pesetas; the strip forgot them. A coin buys a beer or a coffee, and anything else tonight is paid in favours." },
    { add: "word", verb: "buy", reply: "Nobody here has any use for pesetas; the strip forgot them. A coin buys a beer or a coffee, and anything else tonight is paid in favours." },
    { add: "word", verb: "dance", words: ["dance", "boogie", "jig", "pogo"], reply: "You move a little. The strip sees it and thinks nothing of it, which is what a dance on the strip is for." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js, shared by both languages; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
