// "Emperor of the Crust": a world, in English, written the way the AI is asked to write a world (BRIEF.md). One
// change set, all or nothing; plain data. The Spanish version (world.es.js) is written on its own, not translated: same ids, rooms, rules
// and endings, other words. The pictures, sprites and music are shared (pictures.js, sprites.js, music.js): they have no words.
// Reworked 2026-11-19 from Diego's changes: the real Prosperidad of Madrid in an unnamed year, darker (darkness 3), the Minister a dealer
// with his book of debts, drink at the bar, a bad batch with its cure, the cover on the Emperor.

import pictures, { endings } from "./pictures.js?v=0.70.1";
import music, { rooms as roomMusic } from "./music.js?v=0.70.1";
import levels from "./levels.js?v=0.70.1";
import sprites from "./sprites.js?v=0.70.1";
import plan from "./plan.js?v=0.70.1";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Emperor of the Crust",
  blurb: "A night in Prosperidad, Madrid. Emperador owes the Minister, a dealer who walks his round of the bars and sells nothing on an unpaid page.",
  thumbnail: { picture: "avenida", x: 40 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  style: "flat",
  palettes: "neon: the strip, El Charlie, the corner, the plaza and the blind alley (night as a soft glow); lamplight: the lit rooms with a bulb or a candle (backstage, La Ópera, the pension, room seven, the occupied house); institution: the fluorescent rooms (the post office, the launderette); moonlight: the open dark above and beyond the lights (the patio, the roof, the cutting); ember: the works, lit by one furnace",
  genre: "picaresque: one night's round of favours through a rough district",
  strangeness: "0 (named: nothing impossible anywhere; the surprise comes from the people and the place)",
  darkness: "3 (named: Diego asked for it rougher, with drugs, heroin and sex work; people are hurt, cheated and die, and even the good ending costs something)",
  humour: "3 (drawn; not moved: the seed points at darkness, not at humour, and a black comedy is dark and funny; the humour is in the people and the events)",
  feeling: "1 (drawn; not moved: the funeral, a tape and a name matter, and they show in what people keep and do, never in what they say)",
  tension: "0 (drawn; not moved: the Minister's round is a schedule, not a threat; the one danger is a dose the player may choose)",
  size: "large",
  ingredient: "a mail-order catalogue; a chimney sweep",
  discarded: [
    "rules: a dealer who sells hours of the night; a dealer who is a policeman; a district that is grey by day because of something it owes",
    "strangeness 0: a dealer who is a priest; a raid on the bars as the climax; a tragic overdose as the moral",
    "start room: a cell opened with a key under a mat; a door that gives to a shoulder in its dent; a lift that sticks between two floors"
  ],
  synopsis: "You are Emperador, a punk of Prosperidad in Madrid, in a year nobody names. Tonight your hands shake, and your page in the Minister's book is unpaid. " +
    "The Minister is a dealer who walks the same round of the bars every night and sells to the whole strip, for money or on a debt. The one thing he " +
    "wants is a black silk tie for his sister's funeral at first light. You have a night of favours to work through a club, a launderette and " +
    "a roof, and the name you choose to give him at the end.",
  stuff: "hundred-peseta coins, a notebook of debts, tinfoil and a lighter, a transistor radio on a call-in show, laundry tokens, a chimney sweep's brush and a jar of soot, " +
    "a kohl pot, gaffer tape on a drum kit, a pensión that rents by the hour, the pigeonholes of a night sorting room, a portera's lodge, anisette and a carajillo, a black silk tie, a bus at first light",
  tone: "Picaresque, told plain and quick by a narrator who notes what things cost and who owes whom: short sentences that end on the fact, frank about bodies, drugs and work, " +
    "never judging, fond of the people. It notices prices, doorways, hands, debts and what people keep in their pockets, and leaves out sermons and flourishes. " +
    "\"A stage a hand high, a drum kit patched with gaffer tape, a floor that holds your shoes.\" " +
    "\"Marisol takes the corner and the lamp, and nobody takes her place.\" " +
    "\"The post office keeps its side counter open for the night sorters.\"",
  start: "Saturday, 01:00, in the blind alley behind El Charlie.",
  rules: [
    "The Minister walks the same round every night: El Charlie, the Avenida, La Ópera, the Avenida, the Estafeta, the Avenida. He gives each door a few minutes, and he sells at every one, for money or on a debt written in his book.",
    "Nobody on the strip gives anything for nothing, and nobody forgets what is owed. Everything that shines has been paid for, in money or in favours.",
    "The Minister sells nothing on a page that is not paid. A debt is cleared with money, or with something he needs.",
    "After midnight everybody goes by the name the strip gave them. The name on the papers is for daylight and for the people who knew you when you were small.",
    "Since Wednesday a green batch has gone round, cut with something that is not heroin. It has put two people in the hospital and one in the casa tomada."
  ],
  opening: "The blind alley behind El Charlie: a transistor radio on a crate (hints, a late-night call-in) and a crowbar by the bin. The fire door at the south end is painted into its frame, and the crowbar prises it. The intro: the beer mat, the unpaid page, the shaking hands.",
  music: "a nervous phrygian shuffle heard through a club wall; a bass drum that misses a beat, a cheap guitar on one chord and a chimney sweep's whistle; the radio between stations",
  characters: ["Cuco, who runs the sound at El Charlie", "Pelayo, who runs its bar", "Doña Aurora, who owns and sings at La Ópera", "Marisol, who works the corner",
    "Doña Remedios, of the night sorting room", "Tomás, the chimney sweep", "Don Nicanor, of the Pensión Esperanza", "Marga, the drummer at the works",
    "the Minister, who walks his round and sells"],
  endings: [
    "Emperador: trade the tie, give the name the strip gave you, take the wrap and the crown, and go back to the round.",
    "Javier: trade the tie, give the name on the papers, and take the first bus to a funeral with the wrap in your fist."
  ],
  chaos: 0.3
};

// Carried things get their sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// What the Minister accepts when he asks in whose name he writes the receipt (rules: sign_*), each also as "I am ...", "my name is ..." and "it is ...".
const said = (names) => names.flatMap(n => [n, "it is " + n, "i am " + n, "my name is " + n, "call me " + n, "write " + n, "put " + n]);
const CROWN = said(["emperor", "the emperor", "el emperador", "emperador", "the emperor of prosperidad"]);
const NAME = said(["javier", "javier maza", "javi"]);

// ---- The ending pictures ----------------------------------------------------------------------------------------------------
// The drawings are language-free (pictures.js); what each one says to a screen reader (alt) is said here, in this world's language.
const endingPictures = {
  crowned: { alt: "The Avenida at night from across the road: a small figure in a gold cardboard crown stands on a crate in the middle of the strip, with a ring of dark silhouettes round it and neon on every shopfront.", picture: endings.crowned },
  named: { alt: "A bus stop at grey dawn: a first bus with its windows lit yellow, and a small figure in a grey coat with a plain brown case at the step, the city behind them in grey.", picture: endings.named },
  died: { alt: "The Avenida at night from the kerb: a black figure lies on the wet pavement under one orange lamp, neon in every colour on the road, and nobody near.", picture: endings.died }
};

// ---- Rooms -----------------------------------------------------------------------------------------------------------
// One grid for each floor (plan.js). The blind alley, the start room, is north of the backstage; its way out is south.
const rooms = {
  callejon: {
    name: "THE BLIND ALLEY",
    describe: [
      "A blind alley behind El Charlie, brick on three sides: crates, a bin, a puddle that holds the pink of a neon tube. Half the tube is dead.",
      "You face south. At the end of the alley is the {fire door|puerta}, painted into its frame. The bass comes through the brick."
    ],
    exits: { s: "way" },
    scenery: [
      { words: ["bin", "dustbin", "rubbish", "lid"], name: "the bin", says: "Full, and nobody has emptied it this week. Under the lid, an old syringe and a lot of bottles." },
      { words: ["crates", "crate", "bottles"], name: "the crates", says: "Beer crates, empty, stacked to a man's height. One has a flat top." },
      { words: ["puddle", "puddles", "water", "pink"], name: "the puddle", says: "Rainwater, pink under the tube." },
      { words: ["tube", "sign", "neon"], name: "the neon tube", says: "Pink glass on the wall, lit at one end and dead at the other." },
      { words: ["wall", "walls", "brick", "bricks", "graffiti"], name: "the walls", says: "Grey brick with names in black marker, and dates, and one phone number crossed out twice." }
    ],
    ambience: { lines: [
      "Through the brick, the bass line turns over and starts again.",
      "A cat crosses the end of the alley and does not look at the door.",
      "The neon tube ticks twice.",
      "Somebody on the other side of the wall laughs for a long time, then stops."
    ], every: [25, 60] },
    alt: "A blind alley at night between two grey brick walls: a pink neon tube on the left wall, a bin and stacked crates against the bricks, and a steel fire door closing the far end.",
    overlayAlt: { radio: "A small transistor radio stands on a crate, its aerial out.", palanca: "A crowbar leans against the bin." }
  },
  trastienda: {
    name: "BACKSTAGE",
    describe: [
      "Backstage at El Charlie: amplifier cases, a rail of sequinned jackets, a mirror ringed with bulbs, half of them dead. A {guitar case|funda} lies on the floor, held shut with a belt.",
      "The curtain to the east shakes with the bass. The {fire door|puerta_trasera} to the alley stands open on its bar, north."
    ],
    exits: { e: "way", n: "way" },
    scenery: [
      { words: ["amps", "amp", "amplifier", "amplifiers", "cases", "speakers"], name: "the amplifier cases", says: "Black cases with the club's name stencilled on them. Under the name, a phone number, crossed out." },
      { words: ["rail", "jackets", "jacket", "sequins", "coats"], name: "the coat rail", says: "Sequinned jackets in small sizes, left by a glam band that split up in the toilets." },
      { words: ["mirror", "bulbs", "bulb"], name: "the mirror", says: "Your face, cut into bulb-sized pieces. Nobody has cleaned it since the band left." },
      { words: ["curtain", "velvet"], name: "the curtain", says: "Black velvet, grey at hand height.", leads: "e" }
    ],
    ambience: { lines: [
      "A bulb in the mirror goes out.",
      "On the floor beyond the curtain somebody cheers, late, for something that already happened.",
      "The coat rail shivers with the bass."
    ], every: [30, 70] },
    alt: "A cluttered backstage room at night: a mirror ringed with bulbs, a rail of sequinned jackets, stacked amplifier cases, a guitar case on the floor, and a black curtain on the right leading to the bar."
  },
  charlie: {
    name: "EL CHARLIE",
    describe: [
      "El Charlie, packed: a low stage, a drum kit patched with gaffer tape, walls covered in stickers, a floor that holds your shoes. At the back table two kids cut lines on a mirror.",
      "{Cuco|cuco} runs the sound from a plank on two crates, and {Pelayo|pelayo} the bar. Backstage is west, the street door south."
    ],
    exits: { w: "way", s: "way" },
    scenery: [
      { words: ["stage", "kit", "drums", "drum", "tape", "gaffer", "drummer"], name: "the stage", says: "Knee high and sticky. The drummer plays a kit that is mostly tape." },
      { words: ["walls", "wall", "stickers", "posters"], name: "the walls", says: "Stickers on stickers: bands, parties, a lost cat, a phone number for a lawyer." },
      { words: ["punks", "crowd", "people", "kids", "bodies", "floor"], name: "the punks", says: "Leather, safety pins, hair in colours. Half of them are under eighteen and the other half pretend to be." },
      { words: ["table", "mirror", "lines", "razor", "note", "powder", "back"], name: "the back table", says: "A mirror, a razor blade, a rolled note. Speed, from the lines and the jaws. They look up at you and look down again." },
      { words: ["desk", "plank", "sound", "knobs", "faders", "crates"], name: "the sound desk", says: "A mixing desk older than the band, on a plank. Three faders work." },
      { words: ["entrance", "street", "stamp", "queue"], name: "the street door", says: "A door with a punk on each side and a stamp for the back of the hand.", leads: "s" },
      { words: ["pin", "sign", "safety"], name: "the safety pin sign", says: "A big pin in light magenta tube above the bar, with one segment that drops out." }
    ],
    ambience: { lines: [
      "The bass finds your ribs and stays there.",
      "A cheer goes up for no reason that survives the next song.",
      "Somebody pogoes alone, and well.",
      "A bottle breaks, and the band plays through it.",
      "A boy leaves the back table for the toilets, white, with his hand over his mouth."
    ], every: [30, 70] },
    alt: "A punk bar at night: a low stage with a drum kit on the left, a sound desk with a man with a mohawk bent over it, a long bar with a big barman on the right, a back table with a mirror and white lines, and a crowd of dark figures.",
    overlayAlt: { ministro: "The Minister stands by the back table in his camel coat and grey hat, a leather case in one hand." }
  },
  avenida: {
    name: "THE AVENIDA",
    describe: [
      "The Avenida de América at night, looking north: grey shutters half up, neon in pink and cyan, a wet road. El Charlie's black front is at the far end, with a queue at its door.",
      "The Estafeta is east, La Ópera west. The avenue bends south to the corner."
    ],
    exits: { n: "way", e: "way", w: "way", s: "way" },
    scenery: [
      { words: ["shutters", "shutter", "shopfronts", "shops", "shopfront"], name: "the shutters", says: "Half up, half down. Behind the ones that are up, somebody sells something that is not on the sign." },
      { words: ["neon", "signs", "sign", "tubes", "colour", "colours"], name: "the neon", says: "A pink cocktail glass, a cyan arrow, a red that is rented by the month." },
      { words: ["road", "street", "avenue", "avenida", "kerb", "pavement", "car"], name: "the road", says: "Wet black, with the signs streaked in it. A car goes by at walking pace and does not stop." },
      { words: ["club", "charlie", "front", "porthole", "queue"], name: "El Charlie", says: "A black front with a round lit window. It was a dance hall once.", leads: "n" },
      { words: ["people", "doorways", "doorway", "figures", "men", "women"], name: "the people in the doorways", says: "They stand in the dry and watch the street. Some are waiting for a customer, some for a friend, and some for the Minister." }
    ],
    ambience: { lines: [
      "A car comes down the avenue at walking pace, looks at everything and takes nothing.",
      "A shutter goes up with a cough, and a room full of pink light is for sale.",
      "Someone laughs in a doorway, and somebody else stops.",
      "A radio plays behind a window, a song you almost know."
    ], every: [30, 70] },
    alt: "The Avenida at night, looking north along a wet street: shutters and neon signs on both sides in pink, cyan and magenta, the black front of a club with a round porthole window at the far end, and people standing in the doorways.",
    overlayAlt: { ministro: "The Minister stands in the middle of the pavement in his camel coat and grey hat, a leather case in one hand.", monedas: "Three coins lie on the pavement in front of the club's door." }
  },
  esquina: {
    name: "THE CORNER",
    describe: [
      "The corner on López de Hoyos, with the one street lamp that works. {Marisol|marisol} stands under it in a short coat, with a cut over one eyebrow that her powder does not hide.",
      "The Pensión Esperanza is east, the Lavandería west, the avenue north. A small plaza opens south."
    ],
    exits: { n: "way", e: "way", w: "way", s: "way" },
    scenery: [
      { words: ["lamp", "lamppost", "post", "light"], name: "the street lamp", says: "A grey pole and an orange globe. The pavement under it is worn pale in a circle." },
      { words: ["pension", "esperanza", "sign"], name: "the Pensión Esperanza", says: "A narrow front with a green sign: ROOMS BY THE HOUR.", leads: "e" },
      { words: ["launderette", "lavanderia", "lavandería", "laundry"], name: "the Lavandería", says: "A bright window full of white machines, lit all night.", leads: "w" },
      { words: ["pavement", "kerb", "corner", "street"], name: "the pavement", says: "Worn pale under the lamp, and wet at the kerb." },
      { words: ["cars", "car", "traffic"], name: "the cars", says: "They come round slowly, windows down. Marisol shakes her head at most of them." }
    ],
    ambience: { lines: [
      "A car slows at the kerb. Marisol looks at the driver, shakes her head, and it speeds up.",
      "Somebody in the pensión flushes a cistern, and the whole corner hears it.",
      "A woman comes out of the Lavandería with a clean sheet over her arm and walks off up the avenue.",
      "A man in a raincoat comes out of the pensión alone, checks his pockets, and goes."
    ], every: [30, 70] },
    sleep: "Not on the corner. It is somebody's place of work.",
    alt: "A street corner at night under one orange lamp: a woman in a short coat stands by the lamp post on the left, a green-signed pensión on the right, a bright launderette window further along, and neon colour on the wet road."
  },
  estafeta: {
    name: "THE ESTAFETA",
    describe: [
      "The side counter of the post office's night sorting room: pigeonholes to the ceiling, a strip light that stutters, a long counter. {Doña Remedios|remedios} stamps letters behind it.",
      "A canvas sack sits on a shelf, waiting for the night van. The avenue is west."
    ],
    exits: { w: "way" },
    scenery: [
      { words: ["sack", "bag", "canvas", "van"], name: "the mail sack", says: "Canvas, stencilled MAIL. Final demands, fines, and a letter a week from the same hand to the same address, returned each time." },
      { words: ["pigeonholes", "pigeonhole", "holes", "letters", "mail", "post"], name: "the pigeonholes", says: "Hundreds of them, most stuffed. The ones with a name card are the ones somebody still collects from." },
      { words: ["counter", "stamps", "stamp", "stamping", "ink"], name: "the counter", says: "Brass-edged and scratched, with an inkpad the colour of a bruise." },
      { words: ["light", "strip", "tube", "ceiling"], name: "the strip light", says: "It stutters on a long grey note." },
      { words: ["notice", "rules", "hours"], name: "the notice", says: "\"COUNTER OPEN FOR THE NIGHT SHIFT. NO PARCELS.\" Someone has added \"NO MERCY\" in pencil." }
    ],
    ambience: { lines: [
      "A stamp comes down on something, one flat note.",
      "A pigeonhole gives up a letter, and Doña Remedios files it back without reading.",
      "The strip light stutters, and in the gap nothing has moved."
    ], every: [30, 70] },
    alt: "A post office at night under a strip light: pigeonholes up the whole back wall, a long counter with a stout woman in a cardigan behind it on the left, and a fat canvas mail sack on a shelf on the right.",
    overlayAlt: { ministro: "The Minister stands at the end of the counter in his camel coat and grey hat, waiting for his post." }
  },
  opera: {
    name: "LA ÓPERA",
    describe: [
      "La Ópera, a bar with red plush gone brown and a gilt mirror. {Doña Aurora|aurora} sings on the little stage, bare to the waist under a feather boa, to a room of old men in overcoats.",
      "Gaspar serves at the short bar, where a coffee machine hisses at the end. A round table with a candle stands by the stage. The avenue is east."
    ],
    exits: { e: "way" },
    scenery: [
      { words: ["stage", "chandelier", "bulbs", "boa", "feathers", "lamp"], name: "the stage", says: "A tiny stage under a lamp of seven bulbs, three of them lit." },
      { words: ["plush", "curtains", "velvet", "booths", "seats"], name: "the plush", says: "Red once, brown now, shiny on the arms." },
      { words: ["mirrors", "mirror", "gilt"], name: "the mirror", says: "A gilt frame round dark glass. The room in it is twice as full." },
      { words: ["men", "regulars", "overcoats", "audience", "gentlemen"], name: "the regulars", says: "Old men with a glass each, listening with their eyes shut. Most of them are in somebody's book." },
      { words: ["bar", "counter", "bottles", "anisette", "glasses", "gaspar", "barman", "machine"], name: "the bar", says: "A short mahogany bar. Gaspar, the barman, has never been heard to speak. Anisette comes in small glasses, and a coffee costs a coin." },
      { words: ["table", "candle"], name: "the round table", says: "A candle in a bottle, and a seat with its back to the wall and a view of the door." }
    ],
    ambience: { lines: [
      "Doña Aurora takes a high note a little late and holds it.",
      "A man in a good coat weeps quietly. Nobody looks.",
      "The lamp loses a bulb, and Doña Aurora sings on."
    ], every: [30, 70] },
    alt: "A faded plush bar at night: a tiny stage under a seven-bulb lamp with a woman in a feather boa, bare to the waist, singing, old men in good coats in the booths, a gilt mirror, and a round table with a candle at the right.",
    overlayAlt: { ministro: "The Minister stands by the round table next to the stage in his camel coat and grey hat, a leather case in one hand." }
  },
  pension: {
    name: "PENSIÓN ESPERANZA",
    describe: [
      "The lobby of a pensión that rents rooms by the hour, the night or the month: a board of keys, a brass bell, a red runner worn to the weave on the way to the stairs.",
      "{Don Nicanor|nicanor} keeps the desk and a ledger. The {stairs|escalera_pension} go up to the rooms. The corner is west."
    ],
    exits: { w: "way", u: "way" },
    scenery: [
      { words: ["desk", "bell", "brass", "counter", "lamp"], name: "the desk", says: "Varnished, with a green lamp and a bell nobody rings." },
      { words: ["keys", "key", "board", "hooks"], name: "the key board", says: "Twelve hooks, ten keys. Two hooks have a name pencilled under them instead of a number." },
      { words: ["runner", "carpet", "weave"], name: "the runner", says: "Red once, worn to the weave in the middle." },
      { words: ["ledger", "book", "hours", "register"], name: "the ledger", says: "The Book of Hours: names, rooms, lengths of stay, in a clerk's hand." }
    ],
    ambience: { lines: [
      "Upstairs a bed knocks against a wall, and Don Nicanor turns a page.",
      "The bell rings once as a sleeve goes by, and nobody comes to see why.",
      "A couple come down the stairs not looking at each other and go out into the avenue."
    ], every: [30, 70] },
    sleep: "Not in the lobby. Don Nicanor rents the beds upstairs, by the hour, and not the floor.",
    alt: "A narrow pensión lobby lit by one lamp: a varnished desk with a thin man behind it on the right, a board of keys on the wall, and a staircase with a worn red runner on the left going up into the dark."
  },
  pension_hab: {
    name: "ROOM SEVEN",
    describe: [
      "Room seven is Marisol's: a tight-made bed with a red blanket, a wardrobe with its door ajar, a wash-stand with a cracked basin. The window gives on a pink sign that goes on and off.",
      "A {kohl pot|kohl} on the wash-stand is scraped to the bottom. By the bed, a {scrawl|pintada} in lipstick on the wallpaper. The stairs go down."
    ],
    exits: { d: "way" },
    scenery: [
      { words: ["bed", "blanket", "sheets", "pillow"], name: "the bed", says: "Made tight. The sheets are clean, which in this house is the point." },
      { words: ["wardrobe", "clothes", "dresses", "dress", "hangers"], name: "the wardrobe", says: "A few dresses on wire hangers. At the back, a man's jacket nobody came to claim." },
      { words: ["basin", "wash-stand", "washstand", "jug", "water", "mirror"], name: "the wash-stand", says: "A cracked basin, a jug, a mirror the size of a hand." },
      { words: ["window", "sign", "neon", "curtain"], name: "the window", says: "A pink sign across the road, HOTEL with the O dead. It lights the room and puts it out every four seconds." },
      { words: ["chair", "shawl"], name: "the chair", says: "A kitchen chair with a folded shawl on it." }
    ],
    ambience: { lines: [
      "The sign across the road goes pink, then off, then pink.",
      "Through the floor, a bed in the room below knocks against the wall.",
      "The wardrobe settles, and the jacket at the back swings once."
    ], every: [30, 70] },
    sleep: "Not in somebody's room, and not without being asked.",
    alt: "A small pensión room lit pink by a neon sign through the window: a tight-made bed with a red blanket, a wardrobe, a wash-stand with a basin and a small mirror, and lipstick writing on the wallpaper by the bed."
  },
  lavanderia: {
    name: "THE LAVANDERÍA",
    describe: [
      "A launderette open all night: a row of white washers, a bench bolted to the floor, and a big {dryer|secadora} with a round glass door and a slot for tokens.",
      "A long dark shape lies inside the dryer, against the glass, held by the latch. The corner is east."
    ],
    exits: { e: "way" },
    scenery: [
      { words: ["washers", "washer", "washing", "machines", "drums", "drum"], name: "the washers", says: "Ten white drums, most of them turning. A basket of somebody's sheets waits by the open one." },
      { words: ["bench", "seat", "bolts"], name: "the bench", says: "Grey slats on bolts. People sleep on it until the owner's nephew comes for the till." },
      { words: ["sign", "notice", "instructions"], name: "the sign", says: "\"TOKENS ONLY. NOT RESPONSIBLE FOR WHAT IS LEFT BEHIND.\"" },
      { words: ["light", "lights", "tube", "tubes"], name: "the tubes", says: "Cold white, the same at any hour." }
    ],
    ambience: { lines: [
      "A drum finishes its cycle and shudders still.",
      "A sock goes round in a washer's window, again and again.",
      "A woman folds a sheet in the corner without looking up, and leaves with it."
    ], every: [30, 70] },
    alt: "A launderette at night under cold white tubes: a row of white washing machines along the back wall, a bolted bench on the left, and a large dryer with a round glass door on the right, a long black brush lying against its glass.",
    overlayAlt: { cepillo: "A chimney sweep's long black brush lies on the open door of the dryer." }
  },
  plaza: {
    name: "PLAZA DEL CARBÓN",
    describe: [
      "A small square with a dry stone fountain full of flowerpots and one orange lamp. Tenements ring it, and a far chimney shows over the roofs. A rat crosses the cobbles now and then.",
      "The corner is north, the portal of the casa tomada south, the railway cutting east."
    ],
    exits: { n: "way", s: "way", e: "way" },
    scenery: [
      { words: ["fountain", "basin", "dry", "fish"], name: "the fountain", says: "A stone basin with a fish for a spout, dry for years. Somebody has filled it with flowerpots and bottle tops." },
      { words: ["lamp", "sodium", "lamppost"], name: "the sodium lamp", says: "Orange, the only light in the district that is the same colour all day." },
      { words: ["tenements", "tenement", "windows", "window", "buildings", "washing", "blocks"], name: "the tenements", says: "Brick blocks five floors high, with balconies full of washing. A window on each floor is lit green, red or blue." },
      { words: ["rat", "drain", "doorway"], name: "the rat", says: "A grey rat, a drain, a doorway, in that order, and gone." },
      { words: ["casa", "portal", "squat", "house"], name: "the casa tomada", says: "A tall block condemned for demolition, with a bicycle chained in its portal and a flag in a window. The tenants will not leave, and others have moved in.", leads: "s" },
      { words: ["cutting", "railway", "line", "tracks"], name: "the cutting", says: "A gap between two blocks where a goods line used to run. At the end of it, a tall chimney.", leads: "e" }
    ],
    ambience: { lines: [
      "A window opens in a tenement, a bowl of dishwater arrives on the cobbles, and the window closes.",
      "The lamp ticks as it cools.",
      "A child, up much too late, sits on the fountain and says something to it."
    ], every: [30, 70] },
    alt: "A small square at night: a dry stone fountain with flowerpots in it in the middle, one orange sodium lamp on the right, and tall tenements all round with windows lit in green, red and blue."
  },
  casa: {
    name: "THE CASA TOMADA",
    describe: [
      "The portal of the casa tomada, looking south: a wall of letterboxes, a bicycle chained to a radiator, a candle on the first stair. A mattress lies on the floor with a sheet over what is on it, and two boots showing.",
      "The hall runs on to the patio and its light. The plaza is behind you, north."
    ],
    exits: { n: "way", s: "way" },
    scenery: [
      { words: ["letterboxes", "letterbox", "boxes", "mail", "post"], name: "the letterboxes", says: "Forty boxes with names in felt-tip, stuffed with leaflets and fines. One says \"Maza, 3rd\", crossed out." },
      { words: ["bicycle", "bike", "radiator", "chain"], name: "the bicycle", says: "A flat tyre and a good lock, chained to a radiator that has not been warm in years." },
      { words: ["candle", "stair", "stairs", "saucer"], name: "the candle", says: "A stub in a saucer. A paper beside it lists who has paid for the wax." },
      { words: ["posters", "slogans", "wall", "walls", "graffiti"], name: "the walls", says: "Posters over posters, and a slogan in red: WHAT IS FOR SALE IS NOT YOURS." },
      { words: ["mattress", "sheet", "boots", "boy", "body", "toni"], name: "the mattress", says: "Toni, nineteen, from the second floor. He died here on Wednesday night, of the green batch, before the ambulance could find the street. The neighbours are collecting for the funeral." },
      { words: ["hall", "corridor", "tiles"], name: "the hall", says: "Black and white tiles, mostly black, running south to the patio's light." }
    ],
    ambience: { lines: [
      "A baby cries upstairs, and somebody sings over it.",
      "The candle leans in a draught from the patio.",
      "A door slams on the third floor, and the bicycle rattles on its chain.",
      "Somebody comes down the stairs, puts a coin in a jar by the mattress, and goes out."
    ], every: [30, 70] },
    alt: "The hall of an occupied house at night, looking south: stuffed letterboxes on the left, a bicycle chained to a radiator on the right, a candle on the first stair, a mattress with a sheet over it against the wall, and at the far end a bright square of the patio.",
    overlayAlt: { verde: "A folded paper wrap lies on the tiles beside the mattress." }
  },
  patio: {
    name: "THE PATIO",
    describe: [
      "A courtyard open to the sky, five floors of washing lines and candle-lit windows. The walls were painted blue by someone who wanted a sky, and the rain has taken most of it.",
      "An iron {ladder|escalera_patio} climbs the north wall to the roof. The hall is back north."
    ],
    exits: { n: "way", u: "way" },
    scenery: [
      { words: ["washing", "lines", "line", "sheets", "clothes", "trousers"], name: "the washing", says: "Sheets, shirts and one very large pair of trousers, hung out in the hope of sun." },
      { words: ["windows", "window", "candles", "candle", "floors"], name: "the windows", says: "Candles in the windows, five floors of them. The block has had no power since the winter." },
      { words: ["walls", "wall", "paint"], name: "the walls", says: "Sky blue, patchy, with black streaks where the rain runs." },
      { words: ["sky", "stars", "star"], name: "the sky", says: "A square of night with a few stars in it." },
      { words: ["flagstones", "stones", "puddles", "hopscotch", "chalk"], name: "the flagstones", says: "Cracked, with a chalk hopscotch that goes up to a number that does not exist." }
    ],
    ambience: { lines: [
      "A sheet flaps on its line.",
      "From a high window, a guitar plays the same four chords again.",
      "Rain begins, thinks better of it, and stops.",
      "A man on the third-floor landing is shaking, with his arms round himself. Somebody gives him a cigarette."
    ], every: [30, 70] },
    alt: "A tall courtyard at night seen from its floor: five storeys of grey wall with candle-lit windows and washing lines, a patch of dark sky at the top, and an iron ladder going up the right-hand wall."
  },
  azotea: {
    name: "THE ROOF",
    describe: [
      "The roof of the casa tomada: tar, aerials, a row of chimney pots along the ridge. The whole district lies below, wet colour on grey.",
      "{Tomás|tomas} sits on the ridge, black from head to foot, with only the whites of his eyes clean. The ladder goes down."
    ],
    exits: { d: "way" },
    scenery: [
      { words: ["pots", "pot", "chimneys", "chimney", "row"], name: "the chimney pots", says: "Eleven clay pots, each with a cap of soot." },
      { words: ["aerials", "aerial", "antennas", "antenna", "wires"], name: "the aerials", says: "Wire coat-hangers and bent rods, bolted to the pots. Most of them point at nothing." },
      { words: ["city", "skyline", "lights", "colour", "below"], name: "the city", says: "Neon on every street you can afford, and behind it the grey of the blocks." },
      { words: ["tar", "roof", "ridge", "tiles"], name: "the tar", says: "Soft underfoot and warm from the day." },
      { words: ["moon", "sky", "clouds", "smoke"], name: "the sky", says: "A low moon in a veil of smoke from the works." }
    ],
    ambience: { lines: [
      "A pigeon lands on a pot and leaves again.",
      "Tomás whistles three notes through his teeth and waits.",
      "A gust brings the noise of the whole district up the wall, then drops it."
    ], every: [30, 70] },
    sleep: "Not on the ridge. Tomás would have to carry you down.",
    alt: "A flat roof at night under a low moon: a row of chimney pots like dark figures on the left, a sweep in black with a tall hat sitting against a pot on the left third, a skyline of neon colour below on the right, and aerials against the sky."
  },
  terraplen: {
    name: "THE CUTTING",
    describe: [
      "A railway cutting under a low moon: grey ballast, two rusted rails and a goods wagon on a siding, its sliding door painted over in slogans. No train has come down this line in years.",
      "East, the rails run on to the works and its great chimney. The plaza is west."
    ],
    exits: { w: "way", e: "way" },
    scenery: [
      { words: ["rails", "rail", "line", "tracks", "track", "sleepers", "ballast"], name: "the rails", says: "Two rusted lines running east to the works." },
      { words: ["wagon", "slide", "slogans", "siding"], name: "the wagon", says: "The slogans on its door read WAGES, BREAD, NOT THIS. Under them, in older paint, PROSPERIDAD S.A." },
      { words: ["chimney", "works", "factory"], name: "the works", says: "A black hall with one chimney rising out of it, taller than the tenements." },
      { words: ["moon", "sky", "clouds"], name: "the moon", says: "Low and yellow, in smoke from the works." },
      { words: ["lamp", "signal", "lantern"], name: "the signal lamp", says: "A railway signal, red. Nobody has switched it off." }
    ],
    ambience: { lines: [
      "The signal lamp clicks, red, and stays red.",
      "Wind comes along the cutting, lifts a newspaper, turns its pages and drops it.",
      "Somewhere in the works a drum starts a rhythm, loses it and starts again."
    ], every: [30, 70] },
    alt: "A railway cutting at night under a low moon: two rusted rails running east to a black factory hall on the right third, with one very tall chimney against the sky, and a goods wagon on a siding on the left."
  },
  fabrica: {
    name: "THE WORKS",
    describe: [
      "The old works of Prosperidad S.A., which printed mail-order catalogues until the money ran out. One furnace still glows at the end of the hall, fed with pallets, and the great chimney stands in the middle of the floor.",
      "{Marga|marga} sits at her drums by the furnace. The way back is west, along the line."
    ],
    exits: { w: "way" },
    scenery: [
      { words: ["furnace", "fire", "embers", "glow", "grate", "pallets"], name: "the furnace", says: "A brick mouth with one red glow, fed with pallets. It is the band's only heating." },
      { words: ["ash", "floor", "ashes", "soot", "cinders", "pages"], name: "the ash", says: "Warm and deep, and under it, a floor of burnt catalogue pages." },
      { words: ["presses", "press", "machines", "machine", "rollers", "belts"], name: "the presses", says: "Iron rollers as tall as a man, still grey with ink." },
      { words: ["roof", "hole", "sky", "cloud"], name: "the roof", says: "A round hole where the chimney goes through, and the smoke of the pallets going out of it." },
      { words: ["hall", "walls", "wall", "bricks", "hand"], name: "the hall", says: "High brick, scorched on one wall in the shape of a hand where a boiler burst." },
      { words: ["chimney", "flue", "stack", "hatch"], name: "the great chimney", says: "A brick column as wide as a house, black from the floor to the roof. A small iron hatch at its foot has not been opened in years." }
    ],
    ambience: { lines: [
      "The furnace ticks and settles.",
      "A sheet of burnt paper stands up from the ash in the draught, and lies down.",
      "The great chimney creaks from top to bottom, one long note."
    ], every: [30, 70] },
    alt: "The inside of an old works lit red by one furnace: a brick furnace mouth glowing on the left, a girl at a drum kit beside it, the great black chimney rising through the middle of the hall to a hole in the roof on the right, iron presses and a floor of grey ash."
  }
};

// ---- Objects -----------------------------------------------------------------------------------------------------------
const objects = {
  // The start room: the hints thing, the way out (a fire door painted shut) and the crowbar that opens it (BRIEF.md §3).
  radio: { at: "callejon", portable: true, material: "metal", name: "Transistor radio", note: "A late-night call-in.",
    words: { nouns: ["radio", "transistor"], adj: ["transistor", "little", "old", "small"] }, ...item("radio"),
    here: "A {transistor radio|radio} stands on a crate, tuned to a late-night call-in.",
    examine: "A small transistor radio, held together with sticking plaster. Strangers phone the show at night to give each other advice, and some of it is good." },
  puerta: { at: "callejon", material: "metal", name: "Fire door", note: "Painted shut.", door: "s", locked: true,
    lock: { key: "palanca",
      says: "The fire door is painted into its frame. There is a seam down the hinge side, wide enough for the lip of something flat and strong.",
      opens: "You work the crowbar's lip into the seam and lean. The paint lets go, the fire door swings in on its bar, and the bass comes out to meet you.",
      then: "arrival" },
    shut: "You put a shoulder to the dent. The fire door does not move.",
    words: { nouns: ["door"], adj: ["fire", "steel", "metal", "grey"] },
    parts: [{ words: ["seam", "gap", "paint", "frame", "hinge", "dent"], name: "the seam", says: "A black line of old paint down the hinge side, and a dent at shoulder height where others tried." }],
    examine: "A steel fire door with a push bar and no handle on this side, painted into its frame by years of coats. A dent at shoulder height, and a seam down the hinge side." },
  palanca: { at: "callejon", portable: true, material: "metal", name: "Crowbar", note: "Heavy, flat at one end.",
    words: { nouns: ["crowbar", "jemmy", "bar"], adj: ["iron", "rusty", "heavy"] }, ...item("palanca"),
    here: "A {crowbar|palanca} leans against the bin, black with the paint of other doors.",
    examine: "A rusty crowbar, the lip of its claw clogged with paint from other doors." },

  // Backstage
  puerta_trasera: { at: "trastienda", material: "metal", name: "Back door", note: "Out to the alley.", door: "n",
    words: { nouns: ["door"], adj: ["back", "fire", "steel", "metal", "grey"] },
    examine: "The fire door from the inside: a push bar, propped open, and the alley's pink puddles beyond it." },
  funda: { at: "trastienda", container: true, open: false, material: "wood", name: "Guitar case", note: "Rattles when tipped.",
    words: { nouns: ["case"], adj: ["guitar", "black", "battered"] },
    examine: "A black guitar case with a broken clasp, held shut by a belt. When you tip it, something small and many rattles, and it is not a guitar." },
  cuerdas: { at: "funda", portable: true, material: "paper", name: "Bass strings", note: "Still in the sleeve.",
    words: { nouns: ["strings", "string", "sleeve", "pack"], adj: ["bass", "sealed", "spare"], pl: true }, ...item("cuerdas"),
    examine: "A paper sleeve of bass strings, sealed, with a band's name in biro: NADA PERSONAL." },

  // El Charlie
  cuco: { portrait: sprites.cuco_portrait, at: "charlie", name: "Cuco", note: "Runs the sound.",
    words: { nouns: ["cuco", "sound", "soundman"], adj: [], proper: true, g: "m" },
    examine: "A thin man in a leather jacket with a mohawk like a stripe of black paint, bent over a sound desk. He plays one cassette between bands and looks at nobody.",
    talk: `"Don't ask me for requests," says Cuco without turning round. "I have half a night."`,
    topics: {
      deck: { open: true, label: "the tape", words: ["tape", "cassette", "music", "desk", "night", "sound"], says: `"Between bands I play one tape, always the same, and tonight it is the wrong one," says Cuco. "The right one is with Marisol, on the corner. I am not going to ask her for it."` },
      marisol: { label: "Marisol", words: ["marisol", "corner", "woman"], says: `Something crosses his face and is put away. "Marisol kept my brother's tape for me, the night after, and I never went to collect it. That is all."` },
      tie: { label: "a black tie", words: ["tie", "black", "silk", "funeral", "corbata"], says: `"A black tie?" Cuco looks at you as if you had asked for his liver. "I have one in the desk drawer. My father's, for his funeral and mine. I would give it for that tape and for nothing else."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "book", "debt", "owe"], says: `"He stands by the back table, and the kids who look at the mirror look at him," says Cuco. "I am in his book too, for the loan of an amplifier I never paid back. Everyone who works a door is. Ask Pelayo when he is due."` },
      default: `"Sorry," says Cuco, over the bass. "I only hear what comes through the headphones."`
    },
    give: `"That is nice," says Cuco. "But it is not my tape."` },
  pelayo: { portrait: sprites.pelayo_portrait, at: "charlie", name: "Pelayo", note: "Runs the bar.",
    words: { nouns: ["pelayo", "barman", "bouncer"], adj: ["big"], proper: true, g: "m" },
    examine: "A very large man in a studded collar, with arms like two sleeping dogs and a pencil behind each ear. He pulls a beer and sets it down without a drop on the wood.",
    talk: `"What?" says Pelayo, which is how he says hello. "Beer or noise?"`,
    topics: {
      band: { open: true, label: "the band", words: ["band", "nacho", "string", "strings", "works", "bass", "bassist"], says: `"Nada Personal are down at the works tonight, rehearsing by a furnace," says Pelayo. "Nacho snapped a bass string on Tuesday and sulks without one. There is a spare pack in the guitar case backstage, if somebody wanted to be useful."` },
      bar: { open: true, label: "the bar", words: ["bar", "beer", "drink", "price", "tab", "coin"], says: `"A beer is a hundred-peseta coin," says Pelayo. "The punks drop them on the pavement out front on the way in, and I pick up what is left. Don't ask for credit. I have seen your face in the Minister's book."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "round", "when"], says: `"Regular as the post," says Pelayo. "He does El Charlie, then down the Avenida to La Ópera, back to the Estafeta for his letter, and the Avenida again. Four minutes a door. He sells, he writes it down, he goes."` },
      verde: { label: "the green batch", words: ["green", "batch", "wrap", "toni", "hospital"], says: `"Since Wednesday," says Pelayo. "Two of mine went out of here on a stretcher, and one did not get as far as the stretcher. Nobody who sells it will say where it is from. If somebody is stupid enough to take it, it is Don Nicanor and his milk. He has done it three times this week."` },
      default: `"Not my business," says Pelayo. "My business is that glass."`
    },
    give: `"I take coins or I take nothing," says Pelayo, and hands it back.` },

  // Beer at El Charlie: a beer is a hundred-peseta coin, and the three coins on the Avenida's pavement are spent one at a time (`remains`:
  // three coins, two coins, one coin; the beer's `requires` is the first of them). The second beer makes you drunk (the condition's `doses`).
  cerveza: { at: null, from: "pelayo", requires: "monedas", spends: true, times: 3, material: "glass", name: "Beer", note: "Cold, in a glass.",
    lacking: `"A beer is a coin," says Pelayo, and waits. "No tabs."`,
    brought: ["Pelayo takes a coin, pulls a {beer|cerveza} and sets it down.", "Pelayo takes another coin and pulls another {beer|cerveza}.", "Pelayo takes the last coin and pulls the last {beer|cerveza}, looking at you the whole time."],
    already: `"Drink that one first," says Pelayo.`, again: `"That is the lot," says Pelayo. "Past the third they sing, then they cry, then I mop."`,
    consumable: true, starts: "drunk", drink: ["Cold and bitter, the first thing tonight that was yours.", "Warmer, and a little further from the floor.", "It goes down like a dare."],
    words: { nouns: ["beer", "glass", "pint"], adj: ["cold"] },
    examine: "A glass of beer, cold, with a head cut level by the flat of a knife." },
  // Coffee at La Ópera: a coin too (the same coins as the beer's), served on Doña Aurora's word by Gaspar's hands. It ends the drunk
  // condition (`stops`). One coffee in all (`times: 1`). Drunk also ends by time (the condition's `lasts`) and by a sleep of four hours or
  // more (the engine's), so the world writes nothing for sleeping.
  cafe: { at: null, from: "aurora", requires: "monedas", spends: true, times: 1, material: "glass", name: "Coffee", note: "Black, in a small cup.",
    lacking: `"A coffee is a coin, darling," says Doña Aurora, between two bars. "I do not pay my chorus in good intentions."`,
    brought: "Doña Aurora takes the coin out of your hand without losing the note and nods at Gaspar, who sets down a {coffee|cafe}, black, without a word.",
    already: `"Drink that one first, darling," says Doña Aurora.`, again: `"One is enough," says Doña Aurora. "Two and you start singing, and I do not share the stage."`,
    consumable: true, stops: "drunk", drink: "Black, bitter and scalding. It tastes of coffee, and of the end of the night.",
    words: { nouns: ["coffee", "cup", "espresso"], adj: ["black", "hot", "small"] },
    examine: "A small cup of black coffee on a saucer, steaming, with the chip in its rim turned away from you." },
  monedas: { at: "avenida", portable: true, material: "metal", name: "Three coins", note: "A drink each.", remains: "monedas_2",
    words: { nouns: ["coins", "coin", "money", "change"], adj: ["three", "hundred", "silver"], pl: true }, ...item("monedas"),
    here: "Three {coins|monedas} lie on the pavement in front of El Charlie's door, where the queue stands.",
    lies: "Three coins lie where they were put down.",
    examine: "Three hundred-peseta coins, warm from somebody's pocket. A coin is a beer at El Charlie, or a coffee at La Ópera." },
  monedas_2: { at: null, portable: true, material: "metal", name: "Two coins", note: "A drink each.", remains: "moneda_1",
    words: { nouns: ["coins", "coin", "money", "change"], adj: ["two", "hundred", "silver"], pl: true }, ...item("monedas_2"),
    lies: "Two coins lie where they were put down.", examine: "Two hundred-peseta coins. A coin is a beer at El Charlie, or a coffee at La Ópera." },
  moneda_1: { at: null, portable: true, material: "metal", name: "Coin", note: "One drink.",
    words: { nouns: ["coin", "money", "change"], adj: ["last", "hundred", "silver"] }, ...item("moneda_1"),
    lies: "A coin lies where it was put down.", examine: "A hundred-peseta coin. One more drink: a beer at El Charlie, a coffee at La Ópera." },

  // The Minister: a dealer on his round (rooms in order, a step every four of your moves). He sells at every door: his arrival lines and the
  // timed rule ministro_sells show it; his book of debts is a part of him; the player's own page is unpaid.
  ministro: { portrait: sprites.ministro_portrait, at: "opera", name: "The Minister", note: "On his round.",
    rounds: { rooms: ["charlie", "avenida", "opera", "avenida", "estafeta", "avenida"], every: [4, 4] },
    arrives: [
      "The Minister comes in with his case and his notebook. Someone is already waiting for him: a handshake, a folded paper, notes that change hands without a count.",
      "The Minister arrives. A woman puts a hand on his arm, and he opens the case a hand's width. She leaves with her fist closed. He writes something in the notebook.",
      "The Minister arrives. A man in a hurry shows him empty hands. The Minister opens the notebook, writes, and sends him away with a nod."
    ],
    leaves: ["The Minister buttons his coat, shakes the last hand and goes on to the next door.", "The Minister looks at his wrist, where there is no watch, and leaves."],
    words: { nouns: ["minister", "dealer", "ildefonso", "ministro"], adj: ["the", "old", "tall"], g: "m" }, ...item("ministro"), figure: sprites.ministro_figure,
    parts: [{ words: ["book", "notebook", "ledger", "debts", "page", "pages"], name: "his book",
      says: "A black oilcloth notebook, names in columns and a sum at the end of each, the corner of every unpaid page turned down. Yours is turned down twice." }],
    here: "{The Minister|ministro} is here, in a camel coat and a grey hat, with a leather case in one hand and a black notebook open in the other.",
    examine: "A tall thin man of sixty in a camel coat, a grey hat and gold-rimmed glasses. His collar is open and there is no tie in it. He shakes hands like a bishop and counts like a bank, and he was a chemist before the Colegio struck him off.",
    talk: `"Good evening," says the Minister, as to a delegation. "I have four minutes, and I sell in all of them."`,
    topics: {
      want: { open: true, label: "a wrap", words: ["wrap", "wraps", "heroin", "buy", "sell", "sells", "price", "credit", "owe", "page", "money"], opens: ["tie"], says: `"A wrap is a wrap," says the Minister. "Money, or a line in the book. You have used the book: Thursday, Friday, two on Saturday, and not a peseta against it. I do not write a debt on a debt. Bring me what I need tonight and I will tear your page out and sell you one more. I need a black tie, silk if the district can manage it. The shops are shut and my own is where it should not be."` },
      book: { open: true, label: "his book", words: ["book", "notebook", "ledger", "debts", "names", "page"], says: `"Names, sums, dates," says the Minister. "Half the strip is in it, and a good half of those will not see Christmas. A debt is the one thing I sell that is never used up. Everything that shines has been paid for, Emperador, and I keep the receipts."` },
      sell: { open: true, label: "what he sells", words: ["sell", "stock", "case", "goods", "clean", "chemist", "quality"], says: `"Heroin, from my own hands, a wrap at a time, cut to a formula and not to a guess," says the Minister. "I was a chemist for twenty years. I put nothing in it that I could not name to a magistrate."` },
      tie: { label: "the tie", words: ["tie", "silk", "black", "funeral", "collar"], opens: ["matilde"], says: `"The funeral is at first light. A black tie, or I stay in the doorway," says the Minister. "Ask whoever has buried somebody: a man always keeps one tie he hates. And bring it to me on my round, not to my house. I have no house."` },
      matilde: { label: "the funeral", words: ["funeral", "matilde", "sister", "church", "mass", "judas"], says: `"My sister. Matilde Peláez, thirty years portera of number nine, now the casa tomada," says the Minister. "She fed half that stair on a salary that would not feed a cat. Mass at San Judas, first thing. She did not speak to me for nine years. I sold to her tenants, and she knew it."` },
      verde: { label: "the green batch", words: ["green", "batch", "wrap", "toni", "cut", "poison"], says: `"Not mine," says the Minister, and for once he is not selling. "Mine has never been green. Somebody is cutting with what he finds under the sink. A person who smokes it is poisoned inside the hour. Milk and charcoal, quickly. Nicanor keeps both."` },
      round: { open: true, label: "his round", words: ["round", "walk", "rounds", "where", "post", "letter"], says: `"El Charlie, the Avenida, La Ópera, the Avenida, the Estafeta for my letter, the Avenida again," says the Minister. "Four minutes a door. I have walked it eleven years and never been robbed, because nobody can plan against a man who is entirely predictable."` },
      default: `"A pleasant question," says the Minister, "but I have only four minutes."`
    },
    give: `"A kind thought," says the Minister, "but no. I want one thing tonight, and that is not it."` },

  // The avenue and the corner
  marisol: { portrait: sprites.marisol_portrait, at: "esquina", name: "Marisol", note: "Works the corner.",
    words: { nouns: ["marisol", "woman", "lady"], adj: [], proper: true, g: "f" },
    examine: "A woman in a short coat and good shoes, her hair up, her face tired under the powder. A cut over one eyebrow, a day old. She looks at every car as if she were reading its plate.",
    talk: `"Evening, Emperador," says Marisol. "If you are working, work the other pavement. If you are looking, look at the lamp."`,
    topics: {
      work: { open: true, label: "her work", words: ["work", "job", "corner", "lamp", "price", "customers", "room"], says: `"Twenty minutes in room seven, Nicanor takes his hour, and the customer pays after, not before. Before is how you get robbed." She says it like a timetable. "Eleven years under one lamp. It is a trade. Nobody asks the baker if she is ashamed."` },
      eyes: { open: true, label: "her eyes", words: ["eyes", "face", "kohl", "makeup", "make-up", "tired", "cut"], opens: ["tape"], says: `"The cut is a customer's ring," she says. "It will go. The kohl will not: the pot is empty, and the shop that sold that black has closed. A sweep's soot does the same job, and the only sweep left is on the roof of the casa tomada."` },
      tape: { label: "the tape", words: ["tape", "cassette", "cuco"], says: `"Cuco's brother's tape," she says. "Quique's. Two winters ago, the night after, Cuco gave it to me to keep and never came back for it. If somebody brought me a bit of that black for my eyes, I could spare it."` },
      name: { label: "your name", words: ["name", "javier", "emperor", "emperador"], says: `"They have called you Emperador since you were a joke somebody told," she says. "Before that you were Javier, from the third floor, with the cough. Matilde the portera fed you on the stair. Nicanor has it written down somewhere."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "book"], says: `"The Minister? He looks at money the way a priest looks at a bikini," says Marisol. "Half of us are in his book. He is on his round: ask at El Charlie, they keep his hours."` },
      verde: { label: "the green batch", words: ["green", "batch", "wrap", "toni", "poison"], says: `"Since Wednesday there is a green one going round, and Toni is on a mattress in the casa because of it," says Marisol. "If somebody takes it anyway, they take them to Nicanor. Milk and charcoal. It is the only thing that works."` },
      default: `"I do not know about that, love," says Marisol, "but if you find out, tell the lamp."`
    },
    give: `"Not for me, love," says Marisol. "I take only what I can use."` },
  hollin: { at: null, portable: true, material: "soft", name: "Jar of soot", note: "Fine and black.",
    words: { nouns: ["soot", "jar", "hollin", "black"], adj: ["jar", "fine", "black"] }, ...item("hollin"),
    examine: "A jam jar of chimney soot, as fine as flour. It is good for the eyes, and for nothing else." },

  // The post office
  remedios: { portrait: sprites.remedios_portrait, at: "estafeta", name: "Doña Remedios", note: "Stamps everything.",
    words: { nouns: ["remedios", "dona", "doña", "clerk", "woman"], adj: ["doña", "stout"], proper: true, g: "f" },
    examine: "A stout woman in a green cardigan and a hairnet, with a stamp in each hand and a third behind her ear. She does not look up at anything she has not already filed.",
    talk: `"Next," says Doña Remedios, though there is no one else. "Name, street, floor, in that order. No: floor first."`,
    topics: {
      post: { open: true, label: "the post", words: ["post", "letters", "mail", "sack", "stamp", "work", "van"], says: `"I sort what comes, I stamp what goes, I return what has nobody to go to," says Doña Remedios. "Nine in ten are returns. People move faster than their addresses."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "letter", "post"], says: `"Every Saturday, a registered letter, from the Colegio de Farmacéuticos," says Doña Remedios. "The only money he takes that he does not count in front of me. He signs with a hand like a prescription, and the whole sorting room knows what he does the rest of the week."` },
      matilde: { label: "Matilde", words: ["matilde", "portera", "peláez", "pelaez", "funeral"], says: `"Thirty years of Matilde's letters to a boy on the third floor of number nine, and thirty years of Return to sender: not known," says Doña Remedios. "Javier Maza. She never stopped writing. I never stopped sending them back. I stamp what is stamped."` },
      default: `"I cannot stamp that," says Doña Remedios, and stamps something else.`
    },
    give: `"I take letters and I take stamps," says Doña Remedios, "and that is neither."` },

  // The pension
  nicanor: { portrait: sprites.nicanor_portrait, at: "pension", name: "Don Nicanor", note: "Keeps the desk.",
    words: { nouns: ["nicanor", "don", "landlord", "clerk", "manager"], adj: ["don"], proper: true, g: "m" },
    examine: "A thin man with a moustache that has outlived two wives, in a green cardigan. Behind the desk, within reach, a milk jug and a tin of charcoal. He has a gift for not noticing, and uses it as a trade.",
    talk: `"Rooms by the hour, the night or the month," says Don Nicanor. "The month is for people who have given up. I do not recommend it."`,
    topics: {
      rooms: { open: true, label: "a room", words: ["room", "rooms", "bed", "night", "hour", "rent"], says: `"Two hundred an hour, six hundred a night, and no questions at either rate. The only room I do not rent is seven. That one belongs to a lady who pays on the first."` },
      book: { open: true, opens: ["name"], label: "the Book of Hours", words: ["book", "ledger", "hours", "names", "register"], says: `"Every name that has stayed here is in the Book," says Don Nicanor. "Even yours. Javier Maza, number seven, a winter long ago: a baby with a cough, in a room with no heating, and a mother on the late shift. The portera from the next block brought a pan of soup up the stairs. I remember because you slept better than your mother."` },
      marisol: { label: "Marisol", words: ["marisol", "seven", "tenant"], says: `"Room seven is Marisol's," says Don Nicanor. "She pays on the first and has never slammed a door. If you want to see how a lady lives, go up and look. She leaves it open."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"A gentleman," says Don Nicanor. "He rented the corner room by the night for years, until he stopped. I do not ask what a gentleman carries in his case, and he does not tell me. I will say he never once left anybody in my bed who did not wake up."` },
      verde: { label: "the green batch", words: ["green", "batch", "wrap", "poison", "milk", "charcoal", "toni"], says: `"Room four, three times this week," says Don Nicanor. "A glass of milk with charcoal in it, drunk at once, and then the stairs and the air. I do it for nothing. It is cheaper than a funeral, and I have been to enough of those. Ask me for the milk if somebody is going grey."` },
      default: `"I could not say," says Don Nicanor, and writes something in the Book.`
    },
    give: `"Thank you, but I run a strict house," says Don Nicanor, and gives it back.` },
  // The cure for the green batch: free from Don Nicanor (ASK, ORDER); it ends the poison and heals one.
  leche: { at: null, from: "nicanor", times: 2, material: "glass", name: "Milk and charcoal", note: "Grey and gritty.",
    brought: "Don Nicanor fills a glass from the jug, tips a spoon of charcoal into it from the tin, stirs, and sets down a glass of {milk and charcoal|leche}.",
    already: `"Drink that one first," says Don Nicanor.`, again: `"That is all there is," says Don Nicanor. "The jug is for the whole house."`,
    consumable: true, heals: 1, stops: "poisoned", drink: "Grey, thick and gritty. It stays down.",
    words: { nouns: ["milk", "charcoal", "glass", "mixture", "antidote", "cure"], adj: ["grey", "gritty"] },
    examine: "A glass of milk gone grey with charcoal, a spoon standing in it." },
  escalera_pension: { at: "pension", leads: "u", name: "Stairs", note: "Up to the rooms.",
    words: { nouns: ["stairs", "staircase", "steps"], adj: ["narrow", "worn"] },
    examine: "A narrow staircase with a worn red runner, going up to a landing and a row of numbered doors." },
  kohl: { at: "pension_hab", name: "Kohl pot", note: "Scraped to the bottom.",
    words: { nouns: ["pot", "kohl", "eyeliner"], adj: ["kohl", "black", "empty"] },
    examine: "A small round pot, scraped to the bottom with a fingernail. Not a flake left." },
  pintada: { at: "pension_hab", name: "Scrawl", note: "In lipstick, on the wall.",
    words: { nouns: ["scrawl", "writing", "wallpaper", "lipstick", "message"], adj: ["lipstick"] },
    examine: "In lipstick on the wallpaper, in a bold looping hand: \"CUCO. QUIQUE'S TAPE IS HERE WHEN YOU COME FOR IT YOURSELF.\" Under it, smaller: \"Not before.\"" },
  escalera_pension_hab: { at: "pension_hab", leads: "d", name: "Stairs", note: "Back down.",
    words: { nouns: ["stairs", "staircase", "steps"], adj: ["narrow", "worn"] },
    examine: "The stairs go down to the lobby." },

  // La Ópera
  aurora: { portrait: sprites.aurora_portrait, at: "opera", name: "Doña Aurora", note: "Owns the stage.",
    words: { nouns: ["aurora", "dona", "doña", "singer", "woman", "owner"], adj: ["doña", "feathered"], proper: true, g: "f" },
    examine: "A woman of fifty-eight with dyed red hair, a green feather boa and nothing else above the waist, standing on her stage as on a pulpit. She sings like someone who was once taken seriously and has decided to go on being.",
    talk: `"Darling," says Doña Aurora between two bars, "if you have come to listen, be quiet. If you have come to drink, Gaspar is deaf."`,
    topics: {
      room: { open: true, label: "the room", words: ["room", "bar", "ópera", "opera", "stage", "singing", "sing"], says: `"Forty years ago this was the café opposite the opera house, and every chorus girl in Madrid took her coffee at that table," says Doña Aurora. "The opera house is a bank now. The chorus girls are grandmothers. I am the last still in feathers."` },
      coffee: { open: true, label: "the coffee", words: ["coffee", "cup", "gaspar", "machine", "sober"], says: `"A coin, darling, as it was before the opera house became a bank," says Doña Aurora. "Gaspar makes it black and never discusses it. It has sobered better men than you."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "table", "gentleman", "book"], says: `"Don Ildefonso? The round table, his back to the wall, a carajillo he never finishes," says Doña Aurora. "He keeps a tab for my gentlemen, and a gentleman who owes comes back on Friday. I am in the book myself, for my girls' stockings. Wait a few minutes and he will be along. He gives me four."` },
      tie: { label: "a black tie", words: ["tie", "black", "silk", "funeral"], says: `"A black tie? Last night he asked me for one, with his sister not yet in the ground," says Doña Aurora. "The ones I have are bow ties and yellow. Ask round the bars, darling. Somebody has buried somebody."` },
      matilde: { label: "Matilde", words: ["matilde", "sister", "portera", "funeral"], says: `"Matilde Peláez, the portera of number nine. He never told anyone he had a sister, until she was a death," says Doña Aurora. "She kept a boy on the third floor alive with soup and wrote him letters for thirty years. He never wrote back. The Minister says so himself over his carajillo, every night this week."` },
      default: `"I could not say, darling," says Doña Aurora, "and I would want a chorus to say it for me."`
    },
    give: `"Lovely," says Doña Aurora. "But I only collect hearts and debts."` },

  // The launderette
  secadora: { at: "lavanderia", name: "Big dryer", note: "Wants tokens.",
    words: { nouns: ["dryer", "drier", "machine", "porthole", "slot"], adj: ["big", "end", "large"] },
    parts: [{ words: ["shape", "latch", "glass", "drum", "brush", "bristles"], name: "the shape in the drum", says: "Something long and dark lies against the glass, held in by the latch. The latch lets go only at the end of a paid cycle." }],
    examine: "A huge old dryer with a round glass door and a coin slot that says TOKENS. Something long and dark lies inside, held by a latch that only lets go at the end of a cycle.",
    switch_on: "The dryer does nothing. The slot says TOKENS.",
    push: "The dryer does nothing. The slot says TOKENS.",
    take: "It is bolted to the floor." },
  cepillo: { at: null, portable: true, material: "wood", name: "Sweep's brush", note: "Long, black, stiff.",
    words: { nouns: ["brush", "cepillo"], adj: ["sweep's", "sweeps", "chimney", "long", "black"] }, ...item("cepillo"),
    examine: "A chimney sweep's brush on a jointed cane, black to the handle. Burnt into the wood with a hot nail: T. H." },
  fichas: { at: null, portable: true, material: "metal", name: "Laundry tokens", note: "Brass, with a hole.",
    words: { nouns: ["tokens", "token", "coins"], adj: ["laundry", "brass"], pl: true }, ...item("fichas"),
    examine: "A fistful of brass tokens stamped LAVANDERÍA, each with a hole through it. Enough for one machine." },

  // The tape and the tie
  cinta: { at: null, portable: true, material: "paper", name: "Tape", note: "No label.",
    words: { nouns: ["tape", "cassette", "cinta"], adj: ["unlabelled", "plain", "cheap"] }, ...item("cinta"),
    examine: "A cheap cassette with no label, only a thumbprint in eyeliner. The spools are very evenly wound." },
  corbata: { at: null, portable: true, material: "soft", name: "Black tie", note: "Silk, creased.",
    words: { nouns: ["tie", "necktie", "corbata"], adj: ["black", "silk", "narrow"] }, ...item("corbata"),
    examine: "A narrow black silk tie, creased in the middle from one funeral too many." },
  papelina: { at: null, portable: true, material: "paper", name: "Paper wrap", note: "Folded small.",
    words: { nouns: ["wrap", "papelina", "paper", "packet"], adj: ["paper", "folded", "small"] }, ...item("papelina"),
    examine: "A square of paper folded to the size of a thumbnail, and heavier than it looks. Heroin, clean, from the Minister's own hands. It is what you came for." },

  // The bad batch (off the plot): a wrap beside Toni's mattress. Smoking it is a choice, and it poisons (the condition `poisoned`).
  verde: { at: "casa", portable: true, material: "paper", name: "Green wrap", note: "Folded, greenish.", use: "smoke",
    actions: ["Smoke wrap"], heldActions: ["Smoke wrap"],
    words: { nouns: ["wrap", "paper", "packet", "foil", "batch", "dose"], adj: ["green", "greenish", "folded", "bad"] }, ...item("verde"),
    here: "A folded {wrap|verde} lies on the tiles beside the mattress, where a hand let go of it.",
    lies: "A green wrap lies where it was put down.",
    examine: "A square of paper folded small. The powder inside is brown with a green tinge, and Toni's lips, under the sheet, were blue. It is the batch that has gone round since Wednesday." },

  // The occupied house
  escalera_patio: { at: "patio", leads: "u", name: "Ladder", note: "Up to the roof.",
    words: { nouns: ["ladder", "rungs"], adj: ["iron", "rusty"] },
    examine: "An iron ladder bolted to the north wall, the rungs worn bright at hand height." },
  escalera_azotea: { at: "azotea", leads: "d", name: "Ladder", note: "Back down.",
    words: { nouns: ["ladder", "rungs"], adj: ["iron", "rusty"] },
    examine: "The ladder you came up, going down into the patio's candlelight." },
  tomas: { portrait: sprites.tomas_portrait, at: "azotea", name: "Tomás", note: "The chimney sweep.",
    words: { nouns: ["tomas", "tomás", "sweep", "chimney sweep", "man"], adj: ["chimney"], proper: true, g: "m" },
    examine: "A chimney sweep from the top hat down, black everywhere but the whites of his eyes. There is a gap in his belt where a brush should hang. He coughs like a man who has swept for forty years.",
    talk: `"Mind the pots," says Tomás. "They are warm, and they keep what they are given."`,
    topics: {
      sweeping: { open: true, label: "the sweeping", words: ["sweep", "sweeping", "chimney", "chimneys", "pots", "work", "job", "soot"], says: `"Eleven pots up here, and a twelfth at the works that is bigger than all of them," says Tomás. "Forty years I have swept them. Whoever sweeps a chimney keeps the soot. That is the whole of the law."` },
      brush: { open: true, label: "his brush", words: ["brush", "lost", "cane"], says: `"I left it in the dryer at the Lavandería last winter, in my overalls," says Tomás. "The latch locked on it, and I had no token to run the cycle, and the owner's nephew will not open it for me. A sweep without his brush is a man with a chimney in his head."` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro", "book"], says: `"Don Ildefonso? I am in his book for a cough syrup I never paid," says Tomás. "I pay him in soot. He sits under every chimney I have swept. That is a minister, I suppose."` },
      default: `"Cannot say," says Tomás. "I only know soot."` },
    give: `"That is not mine," says Tomás, "but thank you."` },

  // The works
  marga: { portrait: sprites.marga_portrait, at: "fabrica", name: "Marga", note: "Drummer, Nada Personal.",
    words: { nouns: ["marga", "drummer", "girl"], adj: [], proper: true, g: "f" },
    examine: "A girl of nineteen at a drum kit made of one tom and a bucket, with cropped black hair, a torn T-shirt and her sticks in her belt like knives. She sleeps in this hall, on pallets, since her mother changed the locks.",
    talk: `"If you have come to tell me to turn it down, the answer is the furnace," says Marga. "It is louder than I am."`,
    topics: {
      band: { open: true, opens: ["strings"], label: "the band", words: ["band", "nada", "personal", "nacho", "rehearsal", "drums", "sticks"], says: `"Nada Personal. Four of us, three here: Nacho is sulking. He broke a bass string on Tuesday and the music shop is shut till Monday, and he says he cannot play without it, which is a lie, but a stubborn one," says Marga.` },
      strings: { label: "the strings", words: ["strings", "string", "bass", "sleeve", "pack"], says: `"Bass strings? You have a spare pack? Bring it, and I will give you the band's laundry fund. Fourteen tokens in a coffee tin. Nacho can wash his socks on Monday," says Marga.` },
      dealer: { open: true, label: "the Minister", words: ["minister", "dealer", "ministro"], says: `"The Minister? He came here once, to hear us. He stood at the back for three songs with his hat on, and left a tip in the tin. A hundred pesetas, in coins, like a hat in a church," says Marga.` },
      default: `"No idea," says Marga, and hits the bucket.`
    },
    give: `"Not mine," says Marga. "I will take strings, though."` }
};

// ---- The puzzles -----------------------------------------------------------------------------------------------------------
const puzzles = {
  // The way out of the start room comes first (BRIEF.md §3): the radio's first hints are about it.
  way_out: { where: "callejon", needs: [], solve: ["{take} crowbar", "unlock door with crowbar", "south"], reaches: "trastienda", clues: ["puerta", "palanca"],
    hints: ["The fire door is painted into its frame, with a seam down the hinge side, and something heavy leans against the bin.", "Take the crowbar, prise the fire door open with it, and go south."] },
  take_strings: { where: "trastienda", needs: [], solve: ["open case", "{take} strings"], gives: ["cuerdas"], clues: ["funda", "pelayo"],
    hints: ["The guitar case backstage rattles when it is tipped, and a band is short of something.", "Open the guitar case and take the bass strings."] },
  strings_for_tokens: { where: "fabrica", needs: ["cuerdas"], solve: ["give strings to marga"], gives: ["fichas"], clues: ["marga", "pelayo"],
    hints: ["Marga's band is down a string, and they keep their laundry money in a tin.", "Give the bass strings to Marga at the works, and she will give you the laundry tokens."] },
  run_dryer: { where: "lavanderia", needs: ["fichas"], solve: ["put tokens in dryer", "{take} brush"], gives: ["cepillo"], clues: ["secadora", "tomas"],
    hints: ["The dryer in the Lavandería takes tokens, and something long is waiting behind its latch.", "Put the tokens in the dryer, and take what comes out."] },
  sweep_roof: { where: "azotea", needs: ["cepillo"], solve: ["give brush to tomas"], gives: ["hollin"], clues: ["tomas", "cepillo", "marisol"],
    hints: ["The sweep on the roof of the casa tomada is missing his brush.", "Give the brush to Tomás, on the roof, and he will sweep a pot and give you the soot."] },
  line_eyes: { where: "esquina", needs: ["hollin"], solve: ["give soot to marisol"], gives: ["cinta"], clues: ["marisol", "hollin", "kohl"],
    hints: ["Marisol's kohl pot is empty, and a sweep's soot does what a pot cannot.", "Give the soot to Marisol on the corner, and she will give you Cuco's brother's tape."] },
  tape_for_tie: { where: "charlie", needs: ["cinta"], solve: ["give tape to cuco"], gives: ["corbata"], clues: ["cuco", "pintada"],
    hints: ["Cuco's tape is on the corner, and he owns the one black tie the Minister needs.", "Give the tape to Cuco, at El Charlie, and take the black tie."] },
  corona: { where: "avenida", needs: ["corbata"], solve: ["give tie to minister", "say emperor"], ending: true, clues: ["ministro", "cuco"],
    hints: ["The Minister wants a black tie for a funeral, and will clear your page for it. He will ask in whose name he writes the receipt.", "Give the tie to the Minister, and tell him you are Emperador."] },
  nombre: { where: "avenida", needs: ["corbata"], solve: ["give tie to minister", "say javier"], ending: true, clues: ["ministro", "marisol", "nicanor"],
    hints: ["Marisol and Don Nicanor both remember a name that is not Emperador.", "Give the tie to the Minister, and tell him you are Javier."] }
};

// ---- Rules -----------------------------------------------------------------------------------------------------------------
const rules = [
  // The dryer: tokens in, the latch lets go.
  { id: "put_tokens", match: { verb: ["put", "use"], obj: "fichas", obj2: "secadora" }, if: [{ "player.at": "lavanderia" }], once: true,
    again: "The dryer has had its tokens and tumbles on.",
    do: [{ say: "The tokens go in one by one, each with a small wet note. The dryer shudders through a cycle, the latch clicks, and the door drops open on a long black {brush|cepillo}, warm as bread." },
         { draw: "lavanderia", remove: ["cepillo_*"] }, { move: "fichas", to: null }, { move: "cepillo", to: "lavanderia" }] },
  // Marga: strings for the band's laundry tokens.
  { id: "give_strings", match: { verb: ["give", "show", "use", "put"], obj: "cuerdas", obj2: "marga" }, if: [{ "player.at": "fabrica" }], once: true,
    again: `"One pack is enough, thanks," says Marga. "Nacho can only break one at a time."`,
    do: [{ say: `Marga takes the sleeve in both hands and kisses the band's name on it, once. She reaches under the bucket for a coffee tin, tips fourteen brass {tokens|fichas} into her palm and puts them in yours. "Tell Nacho I did it," she says. "Tell him nothing else."` },
         { move: "cuerdas", to: null }, { move: "fichas", to: "player" }] },
  // The sweep: the brush back, the soot out.
  { id: "give_brush", match: { verb: ["give", "show", "use", "put"], obj: "cepillo", obj2: "tomas" }, if: [{ "player.at": "azotea" }], once: true,
    again: `"I have swept the one," says Tomás. "The jar is all yours."`,
    do: [{ say: `Tomás takes the brush as another man would take a child. He sweeps the nearest pot once, and a cloud of soot comes out. He fills a jar of {soot|hollin} from it without looking, and hands it to you. "For a lady's eyes," he says. "That is what it is for." The brush goes back in his belt.` },
         { move: "cepillo", to: null }, { move: "hollin", to: "player" }] },
  // Marisol: soot for her eyes, and the tape.
  { id: "give_soot", match: { verb: ["give", "show", "use", "put"], obj: "hollin", obj2: "marisol" }, if: [{ "player.at": "esquina" }], once: true,
    again: `"One jar is all I need," says Marisol.`,
    do: [{ say: `Marisol dips a finger in the jar and draws a line along each eye, a flick at the corner, without a mirror, in four seconds. When she turns to the lamp she has the face of a woman who has slept. "There," she says. "Now I can work. Go on, take it." She reaches into her coat and brings out a {tape|cinta} with a thumbprint in black. "Tell him it is from the corner. Tell him nothing else."` },
         { move: "hollin", to: null }, { move: "cinta", to: "player" }] },
  // Cuco: the tape, and the tie.
  { id: "give_tape", match: { verb: ["give", "show", "use", "put"], obj: "cinta", obj2: "cuco" }, if: [{ "player.at": "charlie" }], once: true,
    again: `"One is all I need," says Cuco.`,
    do: [{ say: `Cuco holds the tape as if it were hot. He slots it into a battered player under the desk, and the first bars of something cheap and enormous come out of one speaker. A boy's voice, a bad guitar. He does not look round. He opens the desk drawer, takes out a {black tie|corbata} and puts it in your hand without turning. "My father's," he says. "Do not spill on it."` },
         { move: "cinta", to: null }, { move: "corbata", to: "player" }] },
  // The Minister: the tie for the wrap, and in whose name he writes the receipt.
  { id: "trade_tie", match: { verb: ["give", "show", "use", "put"], obj: "corbata", obj2: "ministro" }, if: [{ "ministro.traded": false }],
    do: [{ say: `The Minister takes the tie in two fingers and runs it through them like a rosary. He puts it on without a mirror, and the open collar closes. "That will do," he says. He opens the notebook to your page, the corner turned down twice, and takes a {paper wrap|papelina} from the case. "Your page is cleared, and this is the last on the old account. I write every transaction in a name I mean to hold you to. Whose name do I write?"` },
         { set: "ministro.traded", to: true }, { move: "corbata", to: null }, { move: "papelina", to: "player" }] },
  { id: "sign_crown", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: CROWN } }],
    do: [{ say: `"Emperador," says the Minister, and writes it. "A title and not a name, but I have signed worse." He tears the page out, folds it, and puts it in your pocket. "Reign, then. The strip will want its emperor, and it will send him the bill."` },
         { say: `Before you have crossed the Avenida the news has gone round. Somebody finds a crate, somebody a crown of gilt cardboard from a closed opera, and the strip, which sells everything, gives you this for nothing, which is how you know it will cost you. Nobody laughs. By tomorrow you will be in a new page of the same book.` },
         { end: true, picture: "crowned" }] },
  { id: "sign_name", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: NAME } }],
    do: [{ say: `The pen stops. "Javier," says the Minister, and for a moment he is not selling anything. "Matilde's boy, from the third floor. She said you would turn up when it cost something." He writes the name slowly, the first real one in the book, and tears the page out. "The wrap is yours. I do not take back what I have sold, and I do not give advice. The first bus to San Judas leaves from the plaza. It has a seat, and so, tied as I am, have I."` },
         { say: `Nobody on the strip calls you Emperador when you walk to the stop. They say the other name. It sounds small, and it fits. Marisol, at her lamp, lifts a hand and says nothing. You keep the wrap in your fist the whole way to the bus and do not open it.` },
         { end: true, picture: "named" }] },
  { id: "sign_early", match: { verb: "say" }, if: [{ "ministro.traded": false }, { "ministro.at": "$here" }, { $text: { in: [...CROWN, ...NAME] } }],
    do: [{ say: `"Names come after business," says the Minister, not unkindly. "What do you have for me?"` }] },
  { id: "sign_drunk", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { "player.conditions": { has: "drunk" } }],
    do: [{ say: `The Minister puts the pen down. "I cannot write what I cannot hear," he says. "Say it again, plainly, when you can."` }] },
  { id: "sign_other", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }],
    do: [{ say: `"I cannot write that," says the Minister. "A name is something you can be held to. Try again."` }] },

  // The Minister sells: while he is in the room, now and then, somebody comes to him.
  { id: "ministro_sells", when: "every", every: { turns: [3, 3] }, chance: 1, if: [{ "ministro.at": "$here" }],
    do: [{ say: [
      "A boy in a leather jacket comes up to the Minister, puts notes in his hand, and takes a paper in a handshake. The Minister writes in the notebook without looking at him.",
      "A girl with her sleeve rolled down asks for credit. The Minister turns a page and shows her what she owes. She pays half, and he writes the rest.",
      "A man in a good overcoat takes the Minister aside, and they speak low. The case opens a hand's width and closes. The man leaves with his hand in his pocket.",
      "Somebody asks the Minister for a wrap on the book. He says the name of the page, and the sum, and the person goes away without one."
    ] }] },

  // The green wrap (off the plot): smoking it is a choice. It hurts at once, and the condition goes on hurting until the cure.
  { id: "smoke_green", match: { verb: "smoke", obj: "verde" }, if: [{ any: [{ "verde.at": "player" }, { "verde.at": "$here" }] }],
    do: [{ say: "You open the paper over a strip of foil, heat it from below and breathe the smoke in. It tastes of burnt plastic and then of metal. Your tongue goes numb, and the hall tilts." },
         { hurt: 1, says: "A cramp folds you at the waist, and your mouth fills with a taste like coins." },
         { move: "verde", to: null }, { start: "poisoned" }] }
];

// ---- The opening, declared (BRIEF.md §3) ----------------------------------------------------------------------------------------
const opening = {
  room: "callejon", hints: "radio", way: "puerta",
  intro: "Late, in the blind alley behind El Charlie, in Prosperidad. The bass comes through the brick. A puddle holds the pink of a tube that is half dead.\n\nYou come round on a crate, the one the strip calls Emperador, with a beer mat in your fist. On it, in Marisol's hand: the Minister, his round of the bars, tonight. You are in his book for four wraps of heroin, and he sells nothing on an unpaid page. Your hands have begun to shake, and your pockets are empty.",
  lines: {
    hintFrame: "You put the radio to your ear. On the late-night call-in a caller says:"
  }
};

// ---- The change set -----------------------------------------------------------------------------------------------------
export default {
  because: "A blind alley behind a punk bar in Prosperidad, Madrid, then the strip, two bars, a launderette and a roof on a Saturday night, and a dealer who walks his round, keeps a book of debts and wants a black tie.",
  opening,
  plan,                                   // where every room is (plan.js): exits are made from it
  facts: [
    "The player is Emperador, a punk of the strip in Prosperidad, Madrid, in an unnamed year; his name before that was Javier Maza, of number nine, third floor (now the casa tomada); the start room is the blind alley behind El Charlie, north of backstage through the fire door.",
    "The Minister, Don Ildefonso Peláez, a struck-off chemist, is a dealer who walks his round: El Charlie, the Avenida, La Ópera, the Avenida, the Estafeta, the Avenida. He sells heroin for money or on a debt written in his book; the player's page is unpaid and he will not write a debt on a debt. He wants a black tie for his sister Matilde's funeral.",
    "The chain: crowbar, bass strings from the guitar case, tokens from Marga, the sweep's brush from the Lavandería dryer, soot from Tomás, the tape (Quique's, Cuco's brother's) from Marisol, the black tie from Cuco, and the Minister's paper wrap.",
    "Two endings: Emperador takes the wrap and the crown; Javier takes the first bus to the funeral. A third way to end: the green batch, whose cure is milk and charcoal from Don Nicanor.",
    "Beer at El Charlie is a hundred-peseta coin each and the second makes the player drunk; a coffee at La Ópera sobers."
  ],
  properties: {
    "ministro.traded": { type: "boolean", start: false }   // the Minister has the tie and has asked in whose name he writes the receipt
  },
  effects: [
    { time: "day 1 01:00", weekday: "sat" },                 // the game starts at one in the morning, in the alley
    // What the fire door lets in when it opens (the lock's `then`): the door's own words, and the alley's text.
    { add: "change", id: "arrival", effects: [
      { set: "puerta.examine", to: "The fire door, open on its bar, with a clean crack of bare steel down the hinge side where the paint gave." },
      { set: "puerta.note", to: "Open, on its bar." },
      { set: "callejon.describe", to: [
        "A blind alley behind El Charlie, brick on three sides: crates, a bin, a puddle that holds the pink of a neon tube. Half the tube is dead.",
        "You face south. At the end of the alley the {fire door|puerta} stands open on its bar, and the bass comes out of it."
      ] }
    ] },
    // Drunk, after a couple of beers: the picture sways and doubles, words slur, feet take wrong turns; it wears off with time or a coffee.
    { add: "condition", id: "drunk", doses: 2, lasts: { seconds: [60, 90] }, starts: "You're drunk", ends: "You're sober again", status: "You're drunk on beer",
      filters: ["sway", "ghost"], speech: { slur: true, answer: `"Come again?" they say, to your slur.` },
      movement: { chance: 0.3, says: ["Your feet take you another way than the one you meant.", "You set off one way, and the street turns you round."] } },
    // Poisoned, after the green wrap: it hurts every few turns until the milk and charcoal (Don Nicanor), or until it ends on its own.
    { add: "condition", id: "poisoned", lasts: { turns: [24, 24] }, starts: "You're poisoned", ends: "The poison lets go", status: "You're poisoned by the green batch",
      filters: ["tint:poison"],
      health: { every: { turns: [4, 4] }, hurt: 1, says: ["Another cramp, and cold sweat down your back.", "Your hands will not keep still, and your heart goes too fast and too hard.", "The floor comes up, and you catch yourself on the wall."] } },
    // Verbs this world needs
    { add: "word", verb: "open", words: ["prise", "pry", "force", "jemmy", "lever"] },
    { add: "word", verb: "order", reply: "Nobody serves that here. A hundred-peseta coin buys a beer at El Charlie or a coffee at La Ópera, and the rest of the strip trades in favours and debts." },
    { add: "word", verb: "buy", reply: "Nobody serves that here. A hundred-peseta coin buys a beer at El Charlie or a coffee at La Ópera, and the rest of the strip trades in favours and debts." },
    { add: "word", verb: "dance", words: ["dance", "boogie", "jig", "pogo"], reply: "You move a little to the bass. Nobody looks." },
    { add: "word", verb: "smoke", words: ["smoke", "chase", "inject", "snort"], reply: "There is nothing here to smoke." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // the music (music.js, shared by both languages; its levels, levels.js, generated); each room's own as its `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
