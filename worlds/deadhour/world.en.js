// "The Dead Hour at Pylon Nine": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings as endingPictures } from "./pictures.js";
import sprites from "./sprites.js";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "The Dead Hour at Pylon Nine",
  blurb: "A brass city hung in its own smoke, where the flying cars stop for one hour a night and the robots forget. An Inspector waits at Pylon Nine for a witness.",
  thumbnail: { picture: "rank", x: 55 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0-95)
  synopsis: "You are the fare in a hired floater, tied to a mooring mast in the smoke above Cinderhaven, with a punched card " +
    "that summons you to Pylon Nine as a witness. Nobody will say what you witnessed. The city runs on brass and steam, its cars " +
    "hang in the air on a stolen hour, and its servants are numbered hands that must stand still when the Chronometer strikes " +
    "thirteen. At the rail of the pylon an Inspector has been hailing the same car for a long time, and has stopped.",
  tone: "WRITING-DIRECTION.md. The everyday, slightly wrong, in a smoke-and-brass city: bureaucracy, curfew bells, oil and " +
    "warm metal, politeness as a form of fear. The robots are neither villains nor victims; they are tidy, courteous and " +
    "tired in a way that has no moving part. Dry humour, no gore, nothing shouted. A mystery told as a clerk would file it.",
  rules: [
    "Every night the Chronometer strikes thirteen, and the city's hands must stand still for that hour. Nobody remembers it, and nobody asks.",
    "A hand has a number, not a name. A name given to a hand is an unauthorised attachment, and it works like a key.",
    "Floaters stay up on the hour the city lost. A car with no lost hour in its works is a heavy brass box.",
    "Brass is always warm, as if someone had just let go of it.",
    "The smoke has no height. Everybody in it is exactly as high as where they are going."
  ],
  opening: "A hired floater tied to a mooring mast in the smoke: an ear trumpet that listens to the Exchange (the hints), a punched card summoning you (the intro), a gangway out into the smoke (the way on).",
  start: { day: 1, time: "22:40", weekday: "thu" },
  characters: [
    "Inspector Vane, Constabulary Hand number nine, stopped at the rail of Pylon Nine with one hand raised.",
    "Porter Eleven, who has pushed the same empty trolley since the dead hour began.",
    "Mrs Salter, who mends hands and watches, and once gave one of them a name.",
    "Clerk Pin, who keeps the Registry of Hands and does not hold with names."
  ],
  places: ["the skycab and its mast", "Pylon Nine (platform, floater rank)", "Cogwheel Market, Salter's repairs, the Registry of Hands", "the Chronometer Tower (foot, gear room, behind the face)"],
  endings: ["restored (the cog goes back in the Chronometer)", "kept (the cog is given to the porter)", "flown (the cog goes in a floater's works)"],
  chaos: 0.1
};

// The opening's declaration: its room, the hints thing, the intro, the way on, and the four lines.
const opening = {
  room: "skycab",
  hints: "trumpet",
  intro: "card",
  way: "gangway",
  lines: {
    notYet: "The gangway stays hooked up against the cab, and the smoke beyond it does not invite you. The ear trumpet is still hissing on its hook.",
    through: "You step onto the gangway. The planks are warm, and the smoke closes behind the cab like a hand.",
    hintFrame: "The trumpet hisses, and somewhere in the Exchange a voice says:",
    farewell: "The card feeds itself into the dark of the dash, and the holes go with it one at a time, like a train through a tunnel."
  }
};

// Named changes, run from rules.
const changes = {
  vane_wakes: [
    { say: "The key finishes its turn. Inspector Vane draws a breath he does not need and lowers the hand he has been holding up since the dead hour. \"Wilfred,\" he says, trying it. \"Mrs Salter's word. Nobody has said it since she did.\" He unpins a badge from his coat and puts it in your palm. \"Constabulary. It will open the tower for you.\"" },
    { remove: "object", id: "vane" },
    { remove: "object", id: "key" },
    { move: "wilfred", to: "pylon" },
    { move: "badge", to: "player" }
  ],
  cog_home: [
    { say: "You set the cog in the gap. It goes in with the sound of a drawer closing. Beneath you the drums take up the hour, and the great hand slides off thirteen and is nowhere, which is where it belongs. Down in the city every hand on every platform stops where it stands, and the dead hour begins, and ends, and is forgotten. In the morning Pylon Nine is bright and busy. At the rail an Inspector holds his hand up to a car that has gone, and does not know why." },
    { end: true, picture: "restored" }
  ],
  cog_given: [
    { say: "Porter Eleven turns the cog over twice in his clean, patient hand. Then he sits down on his trolley, which he has never done. Along the platform the other hands look at him, and one by one begin to sit. When the dead hour comes it finds them awake. Nobody tells them what to remember, and they remember it anyway, all of it, in a quiet that smells of warm oil. At the rail the Inspector lowers his hand at last." },
    { end: true, picture: "kept" }
  ],
  cog_flown: [
    { say: "The floater shudders, lifts its nose out of the smoke and goes up. Hours pass and are not counted. Beneath you the city shrinks to a coin, then to a spark, then to a thing you could have dreamed. When the stars come the meter on the dash is ticking for a fare nobody is paying, and you let it." },
    { end: true, picture: "flown" }
  ]
};

export default {
  because: "The opening in a hired floater in the smoke, then Pylon Nine, its floater rank, the market below with a repair shop and the Registry of Hands, and the Chronometer Tower; a tag, a key, a name, a badge, and a cog, with three ways to give the dead hour back or keep it.",
  facts: [
    "The punched card is the intro: it is out of play after the opening. The gangway is the way on; it leads to Pylon Nine.",
    "Chain: take the repair tag from Inspector Vane's cuff -> give it to Mrs Salter in her shop for the winding key -> wind Vane with the key, and say his name, Wilfred -> he wakes and gives his badge -> the badge opens the tower stair -> take the cog behind the Chronometer's bell -> three endings: put it back (restored), give it to Porter Eleven (kept), put it in the floater's lift works and board (flown).",
    "Vane (Constabulary Hand nine) took the dead hour's cog out of the Chronometer so the hands could remember, then wound himself down at the rail to wait for a witness. The player was in his cab and saw it, and forgot, because nobody remembers the dead hour.",
    "The split steam pipe in the gear room hurts 2 when touched. There is no other danger. The vane object is replaced by the wilfred object when he wakes."
  ],
  properties: {
    "vane.keyed": { type: "boolean", start: false },
    "works.fed": { type: "boolean", start: false }
  },
  opening,
  effects: [
    { time: "day 1 22:30" },

    // ---- the opening: a hired floater in the smoke ---------------------------------------------------------------
    { add: "room", id: "skycab", name: "THE SKYCAB", area: "dock", at: [0, 0, 0],
      describe: [
        "A hired floater, tied to a mooring mast and hanging in smoke. The leather seats are warm. The meter on the dash ticks over for a fare nobody is paying.",
        "The folding doors stand open on a {gangway} that runs out into the smoke and stops being visible. There is nothing else out there to go to."
      ],
      exits: { n: true },
      scenery: [
        { words: ["seats", "seat", "leather"], name: "the seats", says: "Buttoned leather, warm in the shape of someone who got out a moment ago." },
        { words: ["meter", "dash", "dashboard", "fare"], name: "the meter", says: "A brass dial with one hand, counting a fare in a currency you do not recognise. The total is your name, more or less." },
        { words: ["smoke", "mast", "doors"], name: "the smoke", says: "Grey, warm and without a top or a bottom. The mast goes up into it and the floater hangs from the mast, you hope." }
      ],
      ambience: {
        lines: [
          "The floater turns on its rope, slowly, to show you the same smoke from another side.",
          "Somewhere far off a bell strikes, and counts one more than it should.",
          "The meter ticks. It has noticed you are listening.",
          "A shape slides past in the smoke, lit from inside, and does not look at you."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "The inside of a brass floater cab, seen through its open doors: a gangway of planks runs out into grey smoke.",
      overlayAlt: { trumpet: "A brass ear trumpet hangs from the dash." },
      picture: pictures.skycab.picture },
    { add: "object", id: "trumpet", at: "skycab", portable: true, name: "Ear trumpet", note: "Hissing quietly.",
      here: "An {ear trumpet|trumpet} hangs from a hook on the dash, hissing, tied by a pipe to the Exchange.",
      words: { nouns: ["trumpet", "horn"], adj: ["ear", "brass"] },
      examine: "A brass ear trumpet on a hose that goes into the dash and nowhere after that. Held to the ear it hums with a great many people being put on hold.",
      sprite: sprites.trumpet, floorSprite: sprites.trumpet },
    { add: "object", id: "card", at: "player", portable: true, name: "Punched card", note: "Your summons.",
      words: { nouns: ["card", "summons"], adj: ["punched"] },
      examine: "A card of small square holes that you can read with a thumb. It asks you to be at Pylon Nine, as a witness, and to bring what you saw. You have nothing in your pockets that you saw.",
      sprite: sprites.card },
    { add: "object", id: "gangway", at: "skycab", name: "Gangway", note: "Into the smoke.",
      words: { nouns: ["gangway", "planks"], adj: ["warm"] },
      examine: "Four planks and a rope rail, hooked to the cab by one brass clip. The planks are warm. The far end is not there yet." },

    // ---- the way on, and the arrival ----------------------------------------------------------------------------
    { set: "game.entrance", to: "pylon" },
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    { add: "change", id: "arrival", effects: [
      { time: "day 1 22:40", weekday: "thu" },
      { say: "The platform is cold brass and the smoke smells of coal and warm oil. Behind you, [way] hooks itself up and leaves with the cab, and there is nowhere to hang a coat." }
    ] },

    // ---- Pylon Nine ----------------------------------------------------------------------------------------------
    { add: "room", id: "pylon", name: "PYLON NINE", area: "skyway", at: [0, 0, 0],
      describe: [
        "The arrivals platform of Pylon Nine, brass railings and a ticket booth, with the city hung below in its own smoke. Floaters come and go on their lines. Nobody on them looks down.",
        "{Inspector Vane|vane} stands at the rail with one hand raised, hailing a car that left an hour ago. {Porter Eleven|porter} waits by him with an empty trolley. The floater rank is east, and the {steps} go down to the market."
      ],
      exits: { e: "rank", d: { to: "market", passage: true } },
      scenery: [
        { words: ["booth", "ticket", "window"], name: "the booth", says: "A ticket booth with its shutter down and a notice behind the glass in brass letters you cannot read from here. A bell on the counter has been rung so often it has a groove." },
        { words: ["railings", "railing", "rail", "city"], name: "the railings", says: "Brass, warm, and polished by a great many hands that came here to be seen leaving. Below, the city lies in its smoke with its lamps on, like something asleep with its eyes open." },
        { words: ["trolley", "wheel"], name: "the trolley", says: "A porter's trolley with nothing on it. One wheel squeaks, in the same place, every time it turns." },
        { words: ["floaters", "floater", "lines", "cars"], name: "the floaters", says: "They slide along their lines in the smoke, brass hulls with a lamp at each end. Every one is exactly on time." }
      ],
      ambience: {
        lines: [
          "A floater slides along its line past the platform, and every face in it is turned the other way.",
          "The trolley's wheel squeaks once. Porter Eleven does not look at it.",
          "Down in the smoke a bell strikes the hour, and then strikes it again, in case.",
          "A cold draught comes up the steps, carrying the smell of a market."
        ],
        every: [30, 70], chance: 0.7
      },
      alt: "A brass platform on a pylon, with railings, a grey-coated Inspector with one hand raised at the rail, and floaters on their lines in the smoke.",
      overlayAlt: { tag: "A repair tag hangs from the Inspector's cuff." },
      picture: pictures.pylon.picture },
    { add: "object", id: "steps", at: "pylon", name: "Steps", note: "Down to the market.", leads: "d",
      words: { nouns: ["steps", "stairs", "treads"], adj: ["iron"] },
      examine: "Iron steps go down through a hole in the platform into the market's smoke. Every tread is worn into a dip by feet that no longer come this way." },
    { add: "object", id: "vane", at: "pylon", name: "Inspector Vane", note: "Stopped, hand raised.",
      talk: "Inspector Vane does not answer. His eyes are open and have nothing in them but the platform's reflection.",
      give: "He does not take it. His hand is busy, hailing.",
      words: { nouns: ["vane", "inspector", "hand"], adj: ["constabulary", "stopped"], g: "m", proper: true },
      examine: "A constabulary hand in a long brass coat, wound down in the middle of a gesture. There is a keyhole between his shoulder blades and a bead of oil on his collar. He is exactly the temperature of the railings.",
      search: "Between his shoulder blades the keyhole is empty, and clean, as if it were polished every night by someone who does not mention it.",
      smell: "Warm oil, and under it a small thin smell like a held breath." },
    { add: "object", id: "tag", at: "pylon", portable: true, name: "Repair tag", note: "Pinned to his cuff.",
      here: "A manila {repair tag|tag} hangs by a string from the Inspector's cuff.",
      words: { nouns: ["tag", "label"], adj: ["repair", "manila"] },
      examine: "A manila tag on a loop of string. On the front: \"Hand No. 9. Ticks late.\" On the back, in a small neat hand: \"Return to S. Salter, Watch & Hand Repairs, Cogwheel Market. No charge.\"",
      sprite: sprites.tag, floorSprite: sprites.tag },
    { add: "object", id: "porter", at: "pylon", name: "Porter Eleven", note: "Pushing nothing.",
      give: "\"I am not permitted to accept gratuities,\" says Porter Eleven, with a very small movement of his hand towards your pocket.",
      words: { nouns: ["porter", "eleven", "robot"], adj: ["tin"], g: "m", proper: true },
      examine: "A porter of dull brass with a cap riveted to his head and a number stamped on his chest. His left knee clicks when he shifts his weight, and he shifts it often, to give the sound something to do.",
      topics: {
        who: { open: true, label: "himself", words: ["himself", "you", "porter", "eleven"],
          says: "\"Porter Eleven, sir. Pylon Nine, arrivals. I carry what is given me.\" He looks at the empty trolley. \"Nothing has been given me since the dead hour.\"" },
        city: { open: true, label: "the dead hour", words: ["hour", "dead", "thirteen", "curfew", "bell"],
          says: "\"At thirteen all hands stand still, sir. It is a courtesy to the machinery.\" He is quiet for a moment. \"I do not remember it. I am told that is the point of a courtesy.\"" },
        inspector: { about: "vane", label: "the Inspector", words: ["inspector", "vane", "nine", "stopped", "hand"],
          says: "\"He has hailed that car since the dead hour, sir. Hands do not wind themselves down, so someone with a key did it, or he did, with a key I have not seen. His mender keeps shop in the market. Mrs Salter. She will have his tag in her book, if you can bring it.\"",
          opens: ["salter"] },
        salter: { label: "the mender", words: ["salter", "mender", "shop", "market"],
          says: "\"Under the steps, west of the lane. She mends what the Guild would rather replace. She will not give a key to a stranger, sir. She will give it to a tag.\"" },
        default: "\"I am not able to say, sir,\" says Porter Eleven, and the trolley's wheel squeaks as if in agreement." } },
    { add: "object", id: "wilfred", at: null, name: "Inspector Vane", note: "Awake, and polite.",
      give: "\"Keep it, please,\" says Inspector Vane. \"I would not know where to put it down.\"",
      words: { nouns: ["vane", "inspector", "wilfred", "hand"], adj: ["constabulary"], g: "m", proper: true },
      examine: "The Inspector stands at the rail with his hat on straight and his hand at his side, surprised by it. His eyes have colour in them now: an oil-brown that moves a little, like tea. He has a small keyhole's worth of draught down his spine, and does not mind it.",
      topics: {
        who: { open: true, label: "himself", words: ["himself", "you", "who", "inspector", "vane", "wilfred", "name"],
          says: "\"Constabulary Hand number nine. Wilfred, to one person.\" He looks at his raised-and-lowered hand. \"You are the witness. You were the fare in my cab last night, at the dead hour. You saw what I did, and you forgot it, as everyone forgets that hour. I am sorry. I had to have someone I could not ask.\"" },
        hour: { open: true, label: "the dead hour", words: ["hour", "dead", "thirteen", "curfew", "forget"],
          says: "\"The city stops its hands for one hour every night and calls it the dead hour. It is not dead. It is the only hour in which a hand might have time to think, so they stop us for it, and it takes the memory away with it. A wheel in the Chronometer does that. I found where it is kept.\"" },
        tower: { open: true, label: "what you did", words: ["did", "cog", "wheel", "tower", "chronometer", "took", "stole"],
          says: "\"I took the cog out of the Chronometer, at the top of the tower. I put it behind the bell, where nobody dusts. Then I came here, wound myself down and waited for you. The warden will let you up with my badge.\" He considers. \"The cog is a brass wheel. It will fit a clock, or a hand, or the works of a car. I have not decided which. I stopped before I could.\"" },
        salter: { about: "salter", label: "Mrs Salter", words: ["salter", "mender", "wilfred", "shop"],
          says: "\"She mended me when I was new, and said I ticked late. She is the only one who ever called me anything but nine.\"" },
        cog: { about: "cog", label: "the cog", words: ["cog", "wheel", "gap"],
          says: "\"Whatever you do with it, do it all the way,\" says Wilfred. \"A cog is a thing that only means anything if it turns.\"" },
        default: "\"I do not know,\" says Inspector Vane. \"It is a pleasure to say so.\"" } },
    { add: "object", id: "badge", at: null, portable: true, name: "Constabulary badge", note: "Nine, in red.",
      words: { nouns: ["badge", "shield"], adj: ["constabulary", "grey"] },
      examine: "A grey shield with one red bar and a number struck into it, nine. It is warm from the Inspector's coat and slightly sorry to be somewhere else.",
      sprite: sprites.badge, floorSprite: sprites.badge },

    // ---- the floater rank ----------------------------------------------------------------------------------------
    { add: "room", id: "rank", name: "THE FLOATER RANK", area: "skyway", at: [1, 0, 0],
      describe: [
        "A gantry of parked floaters, brass-hulled, each tied to a bollard by a rope that goes slack when the car lifts. The outer rail was taken down for repair, and the repair was not made.",
        "One {floater} has its door open and its lamp lit. Its {lift works|works} sits behind a hatch, open to the air and ticking warm. The platform is west."
      ],
      exits: { w: "pylon" },
      scenery: [
        { words: ["gantry", "bollard", "bollards", "rope", "ropes", "cars", "hulls"], name: "the gantry", says: "A lattice of black girders with a row of floaters lashed along it, nose to tail. The ropes creak whenever the smoke shifts, which is how you can tell it has." },
        { words: ["rail", "edge", "smoke"], name: "the edge", says: "There is a line of bolt holes where the rail was, and then smoke, and then nothing that has been looked at." },
        { words: ["lamp", "door"], name: "the lamp", says: "A yellow lamp, lit for a passenger who is late. It has been lit so long that the glass has gone amber." }
      ],
      ambience: {
        lines: [
          "A rope creaks, taking up the slack of a car that is thinking of leaving.",
          "The lamp on the open floater brightens, then remembers itself.",
          "Out in the smoke a floater goes past on a line you cannot see, humming one note."
        ],
        every: [30, 70], chance: 0.7
      },
      alt: "A gantry of parked brass floaters against a pink sunset smoke, one with its door open and a lamp lit.",
      picture: pictures.rank.picture },
    { add: "object", id: "floater", at: "rank", name: "Floater", note: "Door open, lamp lit.",
      actions: ["Board floater"],
      words: { nouns: ["floater", "hackney", "car"], adj: ["brass", "open"] },
      examine: "A brass hackney with a glass bonnet and a lamp at each end, tied to its bollard. The seat is warm. A plate on the dash says it is for hire, and has said so since before you were born." },
    { add: "object", id: "works", at: "rank", container: true, open: "always", name: "Lift works", note: "Open hatch, ticking.",
      words: { nouns: ["works", "hatch", "gap"], adj: ["lift"] },
      examine: "Under the hatch is a nest of brass wheels the colour of honey, all turning in step but one place, where a wheel is missing and the others go round it politely.",
      put: "Nothing fits there but one thing, and you are not holding it." },

    // ---- Cogwheel Market ------------------------------------------------------------------------------------------
    { add: "room", id: "market", name: "COGWHEEL MARKET", area: "undersmoke", at: [0, 0, 0],
      describe: [
        "The market under Pylon Nine, where the smoke comes down to be sold. Stalls of oil, springs and second-hand hands crowd the lane, lit by lamps hung from the pylon's belly.",
        "A robot's {head} with a price round its neck watches from a barrow. West is Salter's repair {shop|salter_shop}, east the {Registry|registry_front}, north the foot of the tower, and the {steps|market_steps} go up."
      ],
      exits: { w: { to: "repairs", in: true }, e: "registry", n: { to: "tower", passage: true }, u: { to: "pylon", passage: true } },
      scenery: [
        { words: ["stalls", "stall", "lane", "springs", "oil", "lamps"], name: "the stalls", says: "Springs on strings, oil in bottles the colours of weak tea, and a card that says everything is sold as seen. Everything is seen." },
        { words: ["tower", "chronometer"], name: "the tower", says: "To the north a black tower goes up into the smoke. Its clock face is lit from inside, and from here it seems to be looking at something just behind you." }
      ],
      ambience: {
        lines: [
          "A stallholder winds a toy bird, sets it down, and it sings the wrong song until it stops.",
          "The head on the barrow clears its throat, and then, embarrassed, its voice.",
          "Overhead the pylon hums, and a rain of fine oil comes down on the awnings.",
          "Someone is selling a clock by the pound."
        ],
        every: [30, 70], chance: 0.7
      },
      alt: "A market lane seen from above: red awnings over stalls, a barrow with a head on it, lamps hung from a great black pylon.",
      picture: pictures.market.picture },
    { add: "object", id: "market_steps", at: "market", name: "Steps", note: "Up to the platform.", leads: "u",
      words: { nouns: ["steps", "stairs"], adj: ["iron"] },
      examine: "The iron steps go up to the pylon through a hole in its belly. Pennies are wedged in the gaps between the treads, left by people who did not come back down to collect them." },
    { add: "object", id: "head", at: "market", name: "Robot head", note: "Priced to go.",
      talk: "The head opens its mouth, and a voice comes out that is somebody else's. \"Three shillings,\" it says, \"or the best offer.\" Its eyes ask for neither.",
      words: { nouns: ["head", "robot"], adj: ["robot", "brass"], g: "m" },
      examine: "A brass robot's head on a barrow, with a price on a card round its neck. Its eyes follow you with a tick between each place they look. The price has been crossed out twice and put back.",
      listen: "Inside the head a very small wheel turns, counting the days without anyone to answer.",
      smell: "Machine oil, and a faint smell of rain on a roof." },
    { add: "object", id: "registry_front", at: "market", name: "Registry", note: "East of the lane.", leads: "e",
      words: { nouns: ["registry", "front", "building"], adj: ["grey"] },
      examine: "A grey stone front with a brass plate and no windows. Above the door, in brass letters, is the number of hands in the city, which is changed daily by a man on a ladder." },
    { add: "object", id: "salter_shop", at: "market", name: "Repair shop", note: "West of the lane.", leads: "w",
      words: { nouns: ["shop", "front"], adj: ["repair"] },
      examine: "A shop the width of a coat, with springs hung in the window like dried fruit. A sign over the door has the name of the mender on it and the name of a trade that no longer exists." },

    // ---- Salter's ------------------------------------------------------------------------------------------------
    { add: "room", id: "repairs", name: "SALTER'S REPAIRS", area: "undersmoke", at: [-1, 0, 0],
      describe: [
        "A shop the width of a coat, hung with springs on string like dried fruit. Every clock in it shows a different hour, and each is right about something.",
        "{Mrs Salter|salter} works at the bench under a green lamp, with a brass hand held in a vice. The market is east."
      ],
      exits: { e: "market" },
      scenery: [
        { words: ["clocks", "clock", "hour"], name: "the clocks", says: "One shows the hour of a train long gone, one the hour of a birthday, and one says thirteen. The one that says thirteen has a small card under it. The card says \"Do not mind this one.\"" },
        { words: ["springs", "string", "fruit"], name: "the springs", says: "Hundreds of springs, each on a string, each marked with the name of the hand it came out of. Not a number among the labels." },
        { words: ["bench", "lamp", "vice", "hand"], name: "the bench", says: "A brass hand in a vice, its fingers curled round nothing, as if it had been holding somebody's. Mrs Salter works on it with a very small file and does not hurry." }
      ],
      ambience: {
        lines: [
          "A spring somewhere in the room unwinds with a small sigh, like a person deciding not to say it.",
          "The file goes back and forth, back and forth. Mrs Salter hums the same four notes as the toy bird in the market.",
          "One of the clocks strikes thirteen and nobody remarks on it."
        ],
        every: [30, 70], chance: 0.7
      },
      alt: "A close view of a mender's workbench under a green lamp: a brass hand held in a vice, springs hung on strings behind.",
      picture: pictures.salter.picture },
    { add: "object", id: "salter", at: "repairs", name: "Mrs Salter", note: "Filing, unhurried.",
      give: "\"Keep it, dear,\" says Mrs Salter. \"I have more than I can mend.\"",
      words: { nouns: ["salter", "mrs", "mender", "woman"], adj: ["old"], g: "f", proper: true },
      examine: "A small woman in an apron with every pocket full of springs, and a magnifying lens pushed up into grey hair. She works with her eyes half shut, as if listening to the metal.",
      topics: {
        who: { open: true, label: "herself", words: ["herself", "you", "shop", "mender"],
          says: "\"Hester Salter. I mend watches and hands. The Guild says a hand cannot be mended, only replaced, and I tell them it is the same thing done more slowly.\"" },
        hour: { open: true, label: "the dead hour", words: ["hour", "dead", "thirteen", "curfew", "clock"],
          says: "\"There is a clock in the corner that strikes it. I keep it. Somebody ought to listen to the hour nobody listens to. Don't mind that one, dear, everyone does.\"" },
        vane: { about: "vane", label: "the Inspector", words: ["inspector", "vane", "nine", "wilfred", "name", "hand"],
          says: "\"Nine? Is that what he goes by now? I called him Wilfred. He ticked late, and it suited him. If he's stopped, there's a key to wind him, and I hold it, but I give it to no one without his tag. The tag is how I know he sent you.\" She files a little. \"The key will turn for a hand that is called by its name, and for no other. Say it as you'd say it to someone across a table.\"" },
        tag: { about: "tag", label: "the tag", words: ["tag", "label", "string"],
          says: "She looks at it a long time without taking it. \"That's mine,\" she says. \"I wrote that on a Tuesday, I believe.\"" },
        default: "\"I couldn't say, dear,\" says Mrs Salter, and goes back to the file." } },
    { add: "object", id: "key", at: null, portable: true, name: "Winding key", note: "Warm from her apron.",
      words: { nouns: ["key"], adj: ["winding", "brass"] },
      examine: "A brass winding key the length of a finger, with a bow worn to the shape of a thumb. The bit is cut for one lock only, and it knows which.",
      sprite: sprites.key, floorSprite: sprites.key },

    // ---- The Registry of Hands -------------------------------------------------------------------------------------
    { add: "room", id: "registry", name: "REGISTRY OF HANDS", area: "undersmoke", at: [1, 0, 0],
      describe: [
        "A long room of pigeonholes, one for every hand in the city, each with a number and a brass flap. The air is paper and warm oil.",
        "{Clerk Pin|clerk} sits behind the counter, stamping something that is already stamped. A fat {ledger} lies open between you. The market is west."
      ],
      exits: { w: "market" },
      scenery: [
        { words: ["pigeonholes", "pigeonhole", "flap", "flaps", "numbers", "holes"], name: "the pigeonholes", says: "Thousands of them, floor to ceiling. Most flaps are down. The few that are up have a small clean space behind them, the shape of something taken out." },
        { words: ["counter", "stamp", "stamps", "paper"], name: "the counter", says: "A long oak counter with a brass rail, worn pale where people have waited to be told no." }
      ],
      ambience: {
        lines: [
          "A stamp comes down, and goes up, and comes down.",
          "A flap rattles by itself, and Clerk Pin does not look up.",
          "The ink in the well rises a little, to hear what you will say."
        ],
        every: [30, 70], chance: 0.7
      },
      alt: "A long room of pigeonholes in green light, with a clerk's silhouette at a counter and an open ledger.",
      picture: pictures.registry.picture },
    { add: "object", id: "clerk", at: "registry", name: "Clerk Pin", note: "Stamping.",
      give: "\"Items to be surrendered are surrendered at window two,\" says Clerk Pin. There is no window two.",
      words: { nouns: ["pin", "clerk"], adj: ["registry"], g: "m", proper: true },
      examine: "A clerk of dull grey brass with ink to the wrists. Its stamp comes down at the same angle every time, and its smile has been put on straight, once, a long while ago.",
      topics: {
        who: { open: true, label: "itself", words: ["itself", "you", "pin", "clerk", "registry", "hands"],
          says: "\"The Registry of Hands, sir. We hold the number of every hand in the city, and the particulars.\" The stamp comes down. \"A hand with no entry does not exist, and a hand with an entry does not need to.\"" },
        names: { open: true, label: "names", words: ["name", "names", "wilfred", "called", "called"],
          says: "\"Hands have numbers, sir. A name is an unauthorised attachment.\" The stamp comes down on nothing. \"Several have been found. They are returned to their owners as lost property.\"" },
        hour: { open: true, label: "the dead hour", words: ["hour", "dead", "thirteen", "curfew", "forget"],
          says: "\"At thirteen all hands cease. At fourteen, if there were one, they would resume. There is no fourteen.\" Its smile does not change. \"It has never come up.\"" },
        default: "\"That is not within the Registry's remit,\" says Clerk Pin, and stamps it." } },
    { add: "object", id: "ledger", at: "registry", name: "Ledger", note: "Open on a hand.",
      read: "The entry for nine: \"Constabulary Hand, issued to the Inspector's office. Known to his mender as Wilfred.\" The name is struck through in red, written in again in pencil, and struck through again. Someone has pressed so hard with the pencil that it shows through on the next page.",
      words: { nouns: ["ledger", "book", "entry"], adj: ["fat", "open"] },
      examine: "A ledger bound in black cloth, open on a column of numbers. Each entry is a line, and each line ends in a small box that is ticked or crossed. A great many boxes are ticked.",
      actions: ["Read ledger"] },

    // ---- The Chronometer Tower -------------------------------------------------------------------------------------
    { add: "room", id: "tower", name: "THE TOWER FOOT", area: "tower", at: [0, 0, 0],
      describe: [
        "The base of the Chronometer Tower: a round hall of black iron, with a spiral stair going up through the ceiling and the sound of a very large clock being patient.",
        "A brass {warden} stands across the stair with one hand out, like a turnstile that has learned manners. The market is south."
      ],
      exits: { s: { to: "market", passage: true }, u: { to: "gears", requires: "badge", lacking: "The warden's arm comes down across the stair. \"Constabulary only,\" it says, in the voice of someone reading a card." } },
      scenery: [
        { words: ["hall", "iron", "walls", "wall", "ceiling"], name: "the hall", says: "Black iron, riveted. The rivets are polished at the height of a hand, all the way round, by people who stood here and had to touch something." },
        { words: ["clock", "ticking", "sound"], name: "the sound", says: "A tick, then a long wait, then a tock. It is the sound a great deal of metal makes when it is being careful." }
      ],
      alt: "Looking up the inside of a black iron tower: a spiral stair climbs into dark, with a brass figure barring the first turn.",
      picture: pictures.tower.picture },
    { add: "object", id: "warden", at: "tower", name: "Warden", note: "Arm across the stair.",
      talk: "\"Constabulary only,\" says the warden. Then, softer, as if it had been wanting to say it: \"Nobody has asked me anything else in years.\"",
      give: "The warden looks at what you hold out, and then at the stair, and then at nothing.",
      words: { nouns: ["warden", "robot", "turnstile"], adj: ["brass"], g: "m" },
      examine: "A brass warden with a round head and no face to speak of, only a place where one was going to go. Its raised arm is spotted green at the elbow. A badge-shaped dent in its chest holds a little dust." },
    { add: "object", id: "stair", at: "tower", name: "Spiral stair", note: "Up the tower.", leads: "u",
      words: { nouns: ["stair", "stairs", "staircase"], adj: ["spiral", "iron"] },
      examine: "A spiral stair of black iron winding up through a hole in the ceiling. The treads ring a little even when nobody is on them." },

    { add: "room", id: "gears", name: "THE GEAR ROOM", area: "tower", at: [0, 0, 1],
      describe: [
        "Wheels as wide as ponds turn in the dark, and none of them hurries. A catwalk crosses between them, ringing underfoot, and the air tastes of copper.",
        "A split {pipe} weeps white steam along the rail, hot enough to hurt. The stair goes up to the clock, and down to the hall."
      ],
      exits: { u: "face", d: "tower" },
      scenery: [
        { words: ["wheels", "wheel", "gears", "gear", "teeth", "dark"], name: "the wheels", says: "Each wheel is turning another, and that one another, back to something very old at the middle that nobody has seen. You walk between them like a guest." },
        { words: ["catwalk", "rail", "rivets"], name: "the catwalk", says: "An iron catwalk with a rail worn smooth by the sleeve of someone who liked to look down." }
      ],
      ambience: {
        lines: [
          "A great wheel completes a turn it began before you came in.",
          "The pipe sighs steam, as a kettle does that has stopped expecting to be taken off.",
          "The catwalk rings, once, under a weight that is not yours."
        ],
        every: [25, 55], chance: 0.7
      },
      alt: "Looking down from a catwalk onto huge meshed brass wheels in the dark, with a white plume of steam leaking from a pipe.",
      picture: pictures.gears.picture },
    { add: "object", id: "pipe", at: "gears", name: "Steam pipe", note: "Split, and weeping.",
      words: { nouns: ["pipe", "steam", "split"], adj: ["steam", "split"] },
      examine: "A steam pipe as thick as a thigh, split along a seam, with steam coming out of the split in a thin white sheet. The metal either side of the split is the colour of a hot coin.",
      listen: "A thin high hiss, like an argument conducted in whispers.",
      smell: "Hot copper, and a trace of tea that someone left on a boiler a long time ago." },

    { add: "room", id: "face", name: "BEHIND THE FACE", area: "tower", at: [0, 0, 2],
      describe: [
        "The top of the Chronometer: the clock face seen from behind, a huge pale disc of milk glass lit from outside by a city that cannot be seen. The hands are shadows crossing it, and one of them points at thirteen.",
        "The {Chronometer|chronometer} fills the room, a stack of brass drums with one gap in it. A great bell hangs overhead, silent. The stair goes down."
      ],
      exits: { d: "gears" },
      scenery: [
        { words: ["face", "disc", "glass", "dial", "hands", "shadows"], name: "the face", says: "Milk glass the size of a pond, with the hours painted on it backwards. The hands are shadows, and they move, but not at any rate you could call time." },
        { words: ["bell", "clapper"], name: "the bell", says: "A bell the size of a cottage, hung with its mouth to the floor and its clapper tied up in cloth. Behind its rim there is a dusty shelf, and a clean space on the shelf." }
      ],
      alt: "A huge milk-glass clock face seen from behind, lit pale yellow, with stacked brass drums before it and a great bell above.",
      overlayAlt: { cog: "A brass cog lies on a shelf at the right." },
      picture: pictures.face.picture },
    { add: "object", id: "chronometer", at: "face", container: true, open: "always", name: "Chronometer", note: "Ticking in tens.",
      words: { nouns: ["chronometer", "clock", "drums", "gap"], adj: ["great", "brass"] },
      examine: "A stack of brass drums taller than a house, ticking in tens. One drum has a gap in it exactly the shape of whatever is missing, and the others lean towards the gap a little, the way people do at a funeral.",
      listen: "Ten ticks, a pause, ten ticks. In the pause, very faintly, a thirteenth.",
      put: "Nothing you are holding belongs in the gap." },
    { add: "object", id: "cog", at: "face", portable: true, name: "Cog", note: "Warm, ticking once.",
      here: "A brass {cog} lies on the dusty shelf behind the bell, put down carefully.",
      lies: "The {cog} lies where you left it, ticking once a minute.",
      words: { nouns: ["cog", "wheel"], adj: ["brass"] },
      examine: "A brass cog the size of a saucer, with one tooth worn to a point. It is warm, and ticks once a minute, for a minute that nobody else has.",
      sprite: sprites.cog, floorSprite: sprites.cog },

    // ---- words -----------------------------------------------------------------------------------------------------
    { add: "word", verb: "salute", words: ["salute"], reply: "You raise a hand to your brow. Nobody here takes it for an order." },

    // ---- rules: the chain, the danger, the endings ---------------------------------------------------------------
    { add: "rule", rule: { id: "wind_vane", match: { verb: ["use", "turn", "put"], obj: ["key", "vane"], obj2: ["vane", "key"] },
      if: [{ "player.at": "pylon" }, { "vane.keyed": false }],
      do: [{ set: "vane.keyed", to: true }, { say: "The key slides between his shoulder blades, turns, and stops halfway, embarrassed. It waits. It wants something said, and not by the wrist." }] } },
    { add: "rule", rule: { id: "wind_vane_again", match: { verb: ["use", "turn", "put"], obj: ["key", "vane"], obj2: ["vane", "key"] },
      if: [{ "player.at": "pylon" }, { "vane.keyed": true }],
      do: [{ say: "The key sits halfway round in his back, ticking patiently. You could turn it for an hour. It wants a word." }] } },
    { add: "rule", rule: { id: "say_wilfred", match: { verb: "say" },
      if: [{ "player.at": "pylon" }, { "vane.keyed": true }, { $text: { in: ["wilfred", "wilfred.", "inspector wilfred", "mr wilfred"] } }],
      do: [{ change: "vane_wakes" }] } },
    { add: "rule", rule: { id: "say_other", match: { verb: "say" },
      if: [{ "player.at": "pylon" }, { "vane.keyed": true }],
      do: [{ say: "Your word goes into the keyhole and finds nothing to turn. The key waits, halfway, and is very patient about it." }] } },
    { add: "rule", rule: { id: "say_unkeyed", match: { verb: "say" },
      if: [{ "player.at": "pylon" }, { "vane.keyed": false }],
      do: [{ say: "Your voice goes out across the platform and returns without the Inspector. His hand stays raised." }] } },

    { add: "rule", rule: { id: "tag_to_salter", match: { verb: "give", obj: "tag", obj2: "salter" },
      do: [
        { say: "Mrs Salter turns the tag over twice, reads the back, and puts it into her apron where she keeps the things she will not lose. She takes a key down from a nail without looking, as if it had been waiting at the right height. \"He ticks late,\" she says. \"Tell him that, from me. Call him what I did.\"" },
        { remove: "object", id: "tag" },
        { move: "key", to: "player" }
      ] } },

    { add: "rule", rule: { id: "steam_burn", match: { verb: ["touch", "push", "pull"], obj: "pipe" },
      do: [{ hurt: 2, says: "Your hand finds the split in the pipe and the steam finds your hand. It is the kind of heat that does not argue." }] } },

    { add: "rule", rule: { id: "cog_in_clock", match: { verb: ["put", "use"], obj: "cog", obj2: "chronometer" },
      if: [{ "player.at": "face" }],
      do: [{ change: "cog_home" }] } },
    { add: "rule", rule: { id: "cog_to_porter", match: { verb: ["give", "show"], obj: "cog", obj2: "porter" },
      if: [{ "player.at": "pylon" }],
      do: [{ change: "cog_given" }] } },
    { add: "rule", rule: { id: "cog_in_works", match: { verb: ["put", "use"], obj: "cog", obj2: "works" },
      if: [{ "player.at": "rank" }],
      do: [
        { set: "works.fed", to: true },
        { say: "The cog goes into the gap in the lift works and the other wheels shift politely to take its weight. The floater's lamp steadies, and a hum begins under the seat, the hum of something that has remembered how." },
        { remove: "object", id: "cog" }
      ] } },
    { add: "rule", rule: { id: "board_floater", match: { verb: ["enter", "climb", "sit"], obj: "floater" },
      if: [{ "works.fed": true }],
      do: [{ change: "cog_flown" }] } },
    { add: "rule", rule: { id: "board_empty", match: { verb: ["enter", "climb", "sit"], obj: "floater" },
      do: [{ say: "You put a foot on the step and look in. The pedals go down to nothing, and the hull is a heavy brass box. Something is missing from under the hatch." }] } },

    // ---- the endings' pictures ----------------------------------------------------------------------------------
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, alt: p.alt, picture: p.picture })),

    // ---- the puzzles --------------------------------------------------------------------------------------------
    { add: "puzzle", id: "take_tag", where: "pylon", needs: [], solve: ["take tag"], gives: ["tag"],
      clues: ["vane", "porter", "tag"],
      hints: ["The Inspector's cuff has something hanging from it that he is not using.", "Take the repair tag from the Inspector's cuff."] },
    { add: "puzzle", id: "get_key", where: "repairs", needs: ["tag"], solve: ["give tag to salter"], gives: ["key"],
      clues: ["tag", "porter", "salter"],
      hints: ["A mender gives nothing to a stranger, but she will give to a tag.", "Take the tag down to Mrs Salter's shop in the market and give it to her."] },
    { add: "puzzle", id: "wake_vane", where: "pylon", needs: ["key"], solve: ["use key with vane", "say wilfred"], gives: ["badge"],
      clues: ["salter", "ledger", "key"],
      hints: ["A key that turns only halfway is waiting for a word, and there is one a mender gave him.", "Put the key in the Inspector, then say his name: Wilfred."] },
    { add: "puzzle", id: "climb_tower", where: "tower", needs: ["badge"], solve: ["go up"], reaches: "gears",
      clues: ["warden", "wilfred", "badge"],
      hints: ["The warden stops everyone who is not the law.", "Climb the stair in the tower foot, with the Constabulary badge."] },
    { add: "puzzle", id: "take_cog", where: "face", needs: ["climb_tower"], solve: ["go up", "take cog"], gives: ["cog"],
      clues: ["wilfred", "cog", "chronometer"],
      hints: ["Something was taken from the clock and put down carefully, where nobody dusts.", "Climb to the top of the tower, and take the cog from the shelf behind the bell."] },
    { add: "puzzle", id: "restore", where: "face", needs: ["cog"], solve: ["put cog in chronometer"], ending: true,
      clues: ["chronometer", "wilfred", "cog"],
      hints: ["A cog is a thing that only means anything if it turns, and the clock has a gap.", "Put the cog in the Chronometer."] },
    { add: "puzzle", id: "keep", where: "pylon", needs: ["cog"], solve: ["give cog to porter"], ending: true,
      clues: ["porter", "wilfred", "cog"],
      hints: ["The Inspector said the cog would fit a hand, and one hand here has nothing to carry.", "Give the cog to Porter Eleven."] },
    { add: "puzzle", id: "fly", where: "rank", needs: ["cog"], solve: ["put cog in works", "enter floater"], ending: true,
      clues: ["works", "floater", "wilfred"],
      hints: ["A floater with a gap in its works is a box, and the gap is the right size.", "Put the cog in the lift works of the floater on the rank, then board it."] }
  ]
};
