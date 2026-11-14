// "Please Remain Present": a world after the opening, in English, written the way the AI is asked to write a world
// (BRIEF.md, built from WRITING-DIRECTION.md for the voice, BRIEF.md §2 for the shape, ARCHITECTURE.md §3–6 for the data,
// ART-DIRECTION.md for the pictures). One change set, all or nothing; plain data, no shortcuts.

import pictures, { endings as endingPictures } from "./pictures.js?v=0.50.0";
import music, { rooms as roomMusic } from "./music.js?v=0.50.0";
import levels from "./levels.js?v=0.50.0";
import sprites from "./sprites.js?v=0.50.0";

// ---- The game bible -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Please Remain Present",
  blurb: "The machines of the Meridian Block are failing one by one, and the Registry, which keeps proof that you exist, is closed for audit. Your summons still stands.",
  thumbnail: { picture: "stairwell", x: 40 },   // the card on the landing page: this room's picture, cropped 225 pixels wide from column x (0–95)
  synopsis: "You stand in a fenced yard behind the Meridian Block, a grey tower where the city's machines fail a " +
    "little more each year. A resident exists only while a machine keeps them on the register, and that register can be " +
    "confirmed only in person, at a Registry on the fourteenth floor that is closed for audit. The summons folded in your " +
    "pocket says you must still go.",
  tone: "WRITING-DIRECTION.md. The everyday, slightly wrong: a tower of forms, lifts, notices and reprints, told as plainly as " +
    "the weather. Nobody is surprised by the machines. Dry, tender, a little lonely; the Authority is always polite.",
  rules: [
    "Machines fail in small, well-meant ways, and the city calls every failure a delay.",
    "You exist on the register only while a machine confirms you, and a confirmation is made in person, once.",
    "Paper keeps what the machines lose, and few people read paper any more.",
    "The Authority never fails. It sends notices, and the notices are kind.",
    "The lifts are out of order; the stairs are the only way up that anyone admits to."
  ],
  opening: "A fenced service yard behind the Meridian Block: an intercom on its cord (the hints), a summons in your pocket (the intro), the one service door in (the way on).",
  music: "slow waltz; a harmonium asking politely, one beat short; a stair clock that is not right; a radiator told to wait",
  start: { day: 1, time: "06:50", weekday: "mon" },
  characters: ["Mrs Hale, the Archivist, who keeps the paper and sorts cards nobody has asked for."],
  endings: ["present (the slip goes in the slot)", "booth (present in person: you sit in the last booth)", "erased (the slip goes in the shredder)", "shaft (a step into the dark)"],
  chaos: 0.2
};

// The opening's declaration: its room, the hints thing, the intro, the way on, and the four lines.
const opening = {
  room: "yard",
  hints: "intercom",
  intro: "summons_notice",
  way: "door",
  lines: {
    notYet: "The door stays shut. The intercom, on its cord by the frame, is still talking to nobody.",
    through: "The door gives, then opens the rest of the way, as if it had remembered how. You go in, and the yard forgets you at once.",
    hintFrame: "The intercom crackles. Someone says:",
    farewell: "The summons goes soft in your fingers and runs off into the grain of the paper."
  }
};

// Named changes, run from rules and locks.
const changes = {
  gate_open: [
    { draw: "stairwell", remove: ["gate_rail", "gate_b1", "gate_b2", "gate_b3", "gate_b4", "gate_b5"] }
  ]
};

// What each ending picture says to a screen reader (alt); the drawings are language-free (pictures.js).
const endingAlts = {
  present: "A black figure stands against a bright green light, a small shape on the left.",
  booth: "The last booth from outside: a seated figure behind frosted glass, and a green light just come on above it.",
  erased: "A shredder seen from above: strips of grey, and one small slip of white among them.",
  shaft: "A shaft seen from far above: rungs of cable going down, and one small light at the bottom.",
  died: "A dark floor, faintly ruled, with a grey smear of light across it.",
};

export default {
  because: "The opening in a fenced service yard; then the Meridian Block: sixth-floor corridor, records, canteen, staff room, stairwell, lobby, cellar, registry; a slip to reprint, a crank for the gate, and the registry's slot, last booth or shredder.",
  facts: [
    "The summons is the intro: it is out of play after the opening.",
    "The slip comes from the Staff Room printer (once). The crank is in the Records drawer.",
    "The stair gate's lock takes the crank; it opens the stairs to the registry (up from the stairwell).",
    "The lift shaft kills outright (hurt 5, with the shaft picture). The cable hurts once (2); the biscuit and the urn's first cup heal 1 each.",
    "Sitting in the last booth confirms you in person, without the slip: the present ending, on its own picture (booth)."
  ],
  properties: {},
  opening,
  effects: [
    { time: "day 1 06:40" },

    { add: "music", ...music, levels },   // the music (music.js; its levels, levels.js, generated); each room's own as its `music`

    // ---- the opening: a fenced yard, its way on the one door, in ----------------------------------------------
    { add: "room", id: "yard", name: "SERVICE YARD", area: "yard", at: [0, 0, 0],
      describe: [
        "A yard at the back of the Meridian Block, fenced in sheet metal taller than a person. Bins stand in the puddles, and a lift motor rusts under a tarpaulin, left out here when the lifts were given up.",
        "The only {door} is in the back wall."
      ],
      exits: { in: true },
      scenery: [
        { words: ["housing", "motor", "tarpaulin"], name: "the housing", says: "A lift motor under a tarpaulin, its brass plate turned to the wall and its cables cut short. The rain got under the tarpaulin long ago, and the motor has stopped minding." },
        { words: ["bins", "bin"], name: "the bins", says: "Full of paper that was once forms, and is now mostly weather." },
        { words: ["fence", "sheet metal", "metal"], name: "the fence", says: "Riveted sheet metal, with nothing on it at all." }
      ],
      ambience: {
        lines: [
          "A drip falls from the gutter, and each drop lands a little differently.",
          "Somewhere over the fence a lift motor starts to hum, and thinks better of it.",
          "The tarpaulin lifts in the wind, and lies down again."
        ],
        every: [30, 60], chance: 0.7
      },
      alt: "A fenced yard looking up at a single steel service door in the back wall, a tarpaulin and bins at the sides.",
      overlayAlt: { intercom: "An intercom hangs on its cord beside the door." },
      picture: pictures.yard, music: roomMusic.yard },
    { add: "object", id: "intercom", at: "yard", portable: true, material: "stone", name: "Intercom", note: "Humming on its cord.",
      here: "Beside the door's frame an {intercom} hangs on a coiled cord, humming a little, the way a thing does when someone at the other end is about to speak.",
      words: { nouns: ["intercom", "receiver", "handset"], adj: ["grey"] },
      examine: "An intercom handset on a coiled cord, the mouthpiece worn pale by other people's breath. Someone at the far end is breathing slowly, and does not mind waiting for you.",
      sprite: sprites.receiver, floorSprite: sprites.receiver_floor },
    { add: "object", id: "summons_notice", at: "player", portable: true, material: "paper", name: "Summons", note: "Stamped and folded.",
      words: { nouns: ["summons"], adj: [] },
      examine: "A summons in the Authority's own typeface, asking you to present yourself in person at the Registry, fourteenth floor. Underneath, in smaller type: Do not use the lifts.",
      sprite: sprites.summons },
    { add: "object", id: "door", at: "yard", name: "Door", note: "Shut, for now.",
      actions: ["Open door"], words: { nouns: ["door", "service door"], adj: ["steel"] },
      examine: "A steel service door, painted the colour of a lunch eaten years ago. Round its edge comes a seam of cooler air, and the sound of a corridor with nobody in it." },

    // ---- the way on, and the arrival --------------------------------------------------------------------------
    { set: "game.entrance", to: "corridor" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 06:50", weekday: "mon" },
      { say: "The corridor lights come on one at a time, as though each has been asked." }
    ] },
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),

    // ---- the Meridian Block -----------------------------------------------------------------------------------
    { add: "room", id: "corridor", name: "SIXTH FLOOR", area: "block", at: [0, 0, 0],
      describe: [
        "The sixth floor of the Meridian Block: grey doors, each with a nameplate and no light under it. The clock over the stairs reads [time], and has not been right in years.",
        "A {notice board|notice_board} is pinned with one notice in three colours. The {shaft} stands open on the south wall: a lift's doorway onto a warm dark. Ways lead west, east and north."
      ],
      exits: { w: "records", e: "canteen", n: "stairwell" },
      scenery: [
        { words: ["nameplates", "nameplate"], name: "the nameplates", says: "Names, and beside some of them a date, and beside those, a second date that is later." },
        { words: ["clock"], name: "the clock", says: "It reads [time], and is very sure of it." }
      ],
      ambience: {
        lines: [
          "The lamp overhead flickers, thinks about it, and carries on.",
          "Somewhere on the floor, a door tries its lock for nobody.",
          "A cistern refills in the walls, with a sigh that takes a long time."
        ],
        every: [35, 70], chance: 0.6
      },
      alt: "A grey corridor, a lamp overhead, a notice board on the right wall and an open lift shaft on the left.",
      picture: pictures.corridor },
    { add: "object", id: "notice_board", at: "corridor", name: "Notice board", note: "The same notice, in three colours.",
      opens: ["audit"], words: { nouns: ["notice board", "board", "notice"], adj: [] },
      examine: "The notice says, in red: \"The Registry is closed for audit.\" Under it, in black: \"Presence may be confirmed in person.\" Someone has crossed out \"in person\" in pencil and written \"if possible.\" At the foot, in the Authority's kindest type: \"Replacement summonses may be printed in the Staff Room.\"" },
    { add: "object", id: "shaft", at: "corridor", name: "Lift shaft", note: "Open. No car in it.",
      words: { nouns: ["shaft", "lift shaft"], adj: [] },
      examine: "The doors stand open on a shaft with no car in it, only a cable going down into a dark that is warm. A sign on the frame says OUT OF ORDER. DO NOT ENTER, in the Authority's kindest type." },

    { add: "room", id: "records", name: "RECORDS OFFICE", area: "block", at: [-1, 0, 0],
      describe: [
        "The Records Office, where the paper is kept, because the machines lost the rest. Ledgers climb the shelves to a ceiling stained like a map, and the one lamp on the desk works only while the Archivist is looking at it.",
        "Behind the desk, {Mrs Hale|archivist} sorts index cards into an order nobody has asked for in years. A shelf label points down at the {drawer}. Stairs go down to the cellar."
      ],
      exits: { e: "corridor", d: "cellar" },
      mentions: ["hale"],
      scenery: [
        { words: ["ledgers", "shelves"], name: "the ledgers", says: "Columns of names, each with dates beside them. Most of the dates are the same." },
        { words: ["lamp", "desk lamp"], name: "the desk lamp", says: "It is on. It is not, quite, on for you." },
        { words: ["label"], name: "the shelf label", says: "The label reads: \"Manual override. See drawer.\" It is older than the drawer." },
        { words: ["stairs", "steps"], name: "the stairs", leads: "d", says: "Stone steps going down to the cellar, the cold coming up them to meet you." }
      ],
      sleep: "Not in the Records Office. Mrs Hale would file you under Pending.",
      alt: "A desk and ledgers seen from above, one lamp lit on the desk and a drawer open in its front.",
      picture: pictures.records, music: roomMusic.records },
    { add: "object", id: "archivist", portrait: sprites.archivist_portrait, at: "records", name: "Mrs Hale", note: "Sorting cards.",
      words: { nouns: ["mrs", "hale", "archivist"], adj: [], g: "f", proper: true },
      topics: {
        stair_gate: { words: ["gate", "stairs", "override"], open: true,
          says: "\"The gate hasn't been wound since the audit. It needs a crank, and the crank is in my drawer, where it has always been.\"" },
        registry: { words: ["registry", "presence", "confirm"], open: true,
          says: "\"You have to go in person. They would send a machine if they could, and it wouldn't come.\"" },
        crank: { words: ["crank", "handle"], says: "\"Mind the handle. It bites when it has been waiting.\"" },
        audit: { words: ["audit", "generator", "power"],
          says: "\"The audit can't be finished in the dark, and the generator can't be started until the audit is finished. So it stays on and doesn't run, and the Registry keeps its lights on that. It's the quietest the building has been since I came.\"" },
        porter: { words: ["porter", "abbot", "speaker"],
          says: "\"Mr Abbot. They automated him the spring before the audit. He's in the speaker now, mostly, and in the bell. He was always better at bells than at people.\"" },
        default: "She looks at you over her glasses, and goes back to the cards."
      } },
    { add: "object", id: "drawer", at: "records", material: "wood", name: "Desk drawer", note: "Shut.", container: true, open: false,
      words: { nouns: ["drawer", "desk drawer"], adj: ["desk"] },
      examine: "The drawer sticks, then gives, the way drawers do when they are tired of being asked. Inside, under a folded tea towel, something brass." },
    { add: "object", id: "crank", at: "drawer", portable: true, material: "metal", name: "Crank", note: "Brass, and greased.",
      words: { nouns: ["crank", "handle"], adj: ["brass"] },
      examine: "A brass crank for winding a gate up by hand, the handle worn to a shine by a hand that stopped. It is heavier than it looks, and warm from the drawer.",
      sprite: sprites.crank },

    { add: "room", id: "cellar", name: "CELLAR", area: "block", at: [-1, 0, -1],
      describe: [
        "The cellar under the Records Office. The old generator sits in its own dust, and it has not run since the audit. Nobody has switched it off, either; a tag on it says so.",
        "Pipes run along the ceiling, and a single bulb is lit at the far end, for nobody. The {generator} is the size of a car, and quiet, the way a sleeping thing is quiet."
      ],
      exits: { u: "records" },
      scenery: [
        { words: ["tag"], name: "the tag", says: "The tag says: \"Not to be switched off.\" Under it, in a different pen: \"Not to be switched on.\" At the foot, in the smallest print: \"Suspended pending audit.\"" },
        { words: ["pipes"], name: "the pipes", says: "They are cold, and they go on a long way in both directions, which pipes should not." }
      ],
      alt: "The old generator far off in a damp cellar, a single bulb lit at the far end.",
      picture: pictures.cellar, music: roomMusic.cellar },
    { add: "object", id: "generator", at: "cellar", name: "Generator", note: "Quiet.", opens: ["audit"],
      words: { nouns: ["generator", "switch"], adj: ["old"] }, use: "switch_on",
      examine: "A brass plate says it supplies the Registry lights and the lift motors. Under it, in pencil: Last serviced 1987. Its switch is set to ON.",
      switch_on: "The switch is on already, and has been since the audit. The generator does not start: at the foot of the tag, in the smallest print, it is suspended pending audit.",
      switch_off: "Your hand is on the switch when the tag turns over in the draught: \"Not to be switched off.\" Upstairs, the Registry's lights stay on because the generator is on, not because it runs. You leave it be.",
      listen: "Nothing turns inside it. Deep in the brass a relay clicks, once, to say it is still on." },

    { add: "room", id: "canteen", name: "CANTEEN", area: "block", at: [1, 0, 0],
      describe: [
        "The canteen of the Meridian Block, where meals were served until the kitchens were automated, and then served by the kitchens until they stopped. The tables are wiped for a lunch the hatch has not yet decided to make.",
        "An {urn} gurgles on the counter, full of hot water for nobody, and a {vending machine|vending} hums beside the door, taking coins and giving nothing back."
      ],
      exits: { w: "corridor", e: "staff" },
      alt: "A steaming urn on a long counter, seen looking up from the canteen floor, and a vending machine by the door.",
      overlayAlt: { biscuit: "A biscuit sits on a saucer by the urn." },
      picture: pictures.canteen, music: roomMusic.canteen },
    { add: "object", id: "urn", at: "canteen", name: "Urn", note: "Gurgling.",
      words: { nouns: ["urn", "tap", "water"], adj: ["hot"] }, use: "drink",
      examine: "Hot water, a tap, and a mirror of steam. It has been on for a long time and is still waiting for the first cup." },
    { add: "object", id: "vending", at: "canteen", name: "Vending machine", note: "Humming.",
      words: { nouns: ["machine", "vending machine", "button", "buttons"], adj: ["vending"] },
      examine: "Coins are fed to it. Nothing has come out since the lights came on. Behind its glass every spiral holds the same packet, of a brand that stopped being made.",
      push: "You press each button in turn. Each one lights up, thanks you, and gives you nothing, in the same order.",
      attack: "You kick it. Something drops inside, a long way down, and stays there. A small screen says: THANK YOU FOR YOUR PATIENCE." },
    { add: "object", id: "biscuit", consumable: true, heals: 1, eat: "You eat it in two bites. It tastes of every Tuesday.",
      at: "canteen", portable: true, material: "soft", name: "Biscuit", note: "On a saucer.",
      here: "A {biscuit} sits on a saucer by the urn.",
      words: { nouns: ["biscuit", "biscuits"], adj: [] },
      examine: "A plain biscuit, a little soft, with the dent of a thumb in it that was not yours.",
      sprite: sprites.biscuit },

    { add: "room", id: "staff", name: "STAFF ROOM", area: "block", at: [2, 0, 0],
      describe: [
        "The Staff Room, where the Authority's notices were drafted and approved. A blind is down over the window, and a radiator ticks as though it has been asked to wait.",
        "A {printer} stands against the wall with its tray open and empty, and its light on, in case someone comes to ask for something."
      ],
      exits: { w: "canteen" },
      scenery: [
        { words: ["blind", "window"], name: "the blind", says: "Pulled down, and a line of grey light comes round the edge of it, as if the window had been asked to stay shut." },
        { words: ["radiator"], name: "the radiator", says: "Cold, and ticking anyway." }
      ],
      alt: "A grey printer close up, its light on, a red button and an empty output tray.",
      picture: pictures.staff },
    { add: "object", id: "printer", at: "staff", name: "Printer", note: "Its light is on.",
      words: { nouns: ["printer", "button", "red button"], adj: ["grey"] }, use: "push",
      examine: "A grey printer with one red button, and a tray that says RE-ISSUE across it in the same kind type. Anyone who has lost a summons can have it printed again. The tray is empty, and the light is on in case someone comes.",
      push: "The printer hums, and prints nothing, as it has done enough for one morning." },
    { add: "object", id: "slip", at: null, portable: true, material: "paper", name: "Slip", note: "Warm from the printer.",
      words: { nouns: ["slip", "reissue"], adj: [] },
      examine: "Your summons again, in the same words, in a newer typeface. Underneath, in smaller type: Presence may be confirmed in person, once.",
      sprite: sprites.slip },

    { add: "room", id: "stairwell", name: "STAIRWELL", area: "block", at: [0, -1, 0],
      describe: [
        "The stairwell of the Meridian Block, concrete on every side, smelling of cold rain and of the lift that is not in it. Stairs climb past a {gate|stair_gate} towards the fourteenth floor, and go down towards the lobby.",
        "A black {cable|cable} hangs low over the flight and sparks each time the light stutters. The corridor is south, back the way you came."
      ],
      exits: {
        s: "corridor",
        d: "lobby",
        u: "registry"
      },
      scenery: [
        { words: ["stairs", "steps"], name: "the stairs", leads: ["u", "d"], says: "Concrete, worn into the middle by a hundred years of people going somewhere else." },
        { words: ["plate"], name: "the plate", says: "The plate says: \"Manual override. See Records.\" Someone has underlined Records twice." }
      ],
      ambience: {
        lines: [
          "The light goes out, thinks better of it, and comes back.",
          "The cable hums, and the sparks go on a little longer than they should.",
          "Rain comes down the stairwell's throat, from somewhere far above."
        ],
        every: [30, 60], chance: 0.6
      },
      sleep: "Not under that cable, with the light stuttering.",
      alt: "The stairs seen through the bars of a gate, a black cable sparking from the ceiling above them.",
      picture: pictures.stairwell },
    { add: "object", id: "stair_gate", at: "stairwell", material: "metal", name: "Gate", note: "Shut, across the stairs.",
      words: { nouns: ["gate", "stair gate", "bars"], adj: ["iron"] }, door: "u", locked: true,
      shut: "The gate across the stairs is shut. A plate on it says: \"Manual override. See Records.\"",
      lock: { key: "crank",
        says: "The gate has a hole where a handle goes, not a keyhole. Nothing you carry fits it.",
        opens: "You fit the crank into the hole and wind. The gate rattles up one bar at a time, and stops a little short of the top.",
        then: "gate_open" },
      examine: "Black iron bars, and at waist height a square hole with a cog behind it, meant for a crank. Someone has painted the cog red so that it could be seen." },
    { add: "object", id: "cable", at: "stairwell", name: "Cable", note: "Hanging low.",
      words: { nouns: ["cable", "wire"], adj: ["black"] },
      examine: "A black cable, thick as a wrist, hanging out of the ceiling and humming like a fridge. Every time the light stutters it sparks, and the sparks last a little longer than they should." },

    { add: "room", id: "lobby", name: "LOBBY", area: "block", at: [0, -1, -1],
      describe: [
        "The lobby of the Meridian Block, with a porter's counter nobody has manned since the porter was automated, a {bell} on it, and a {bench} bolted to the floor. The front is glass, from the floor to the high ceiling.",
        "Beyond the {glass|glass_front}, the street is lit by lamps that all flicker together, and a fog takes the far buildings a floor at a time. A sheet of paper is stuck to the glass: \"Under review.\""
      ],
      exits: { u: "stairwell" },
      scenery: [
        { words: ["counter", "porter's counter"], name: "the counter", says: "Empty, with a bell on it that nobody has rung for a while." },
        { words: ["street", "lamps", "fog", "city", "bus"], name: "the street", says: "Lamps, fog, and a bus stop with three people at it, all facing this way." },
        { words: ["sheet"], name: "the sheet", says: "\"Under review.\" The corners have curled from the cold of the glass." }
      ],
      ambience: {
        lines: [
          "A lamp outside gives up, and comes back, and gives up again.",
          "The fog moves past the glass in a body that is not quite a person.",
          "Somewhere behind the counter, a bell considers ringing, and does not."
        ],
        every: [35, 70], chance: 0.6
      },
      alt: "The lobby's glass front, sealed with a strip across it, the fog-lit city beyond and a flicker of lamps.",
      picture: pictures.lobby, music: roomMusic.lobby },
    { add: "object", id: "glass_front", at: "lobby", name: "Glass front", note: "Sealed.", actions: ["Look through glass"],
      words: { nouns: ["glass", "front glass", "front", "seal"], adj: [] },
      examine: "Thick glass with a wire in it. The seal across the middle is new, which is the only new thing in the room. Through it the city stands in the fog, waiting to be confirmed.",
      push: "You lean on the glass. It gives a little, like a held breath, and the seal holds. There is no handle on this side.",
      attack: "You hit the glass. It takes it without a mark. Outside, a lamp flickers, as if it had felt it.",
      search: "Through the glass: the street, the lamps, and a bus stop with three people at it, all facing the Meridian Block. None of them gets on a bus, because none comes.",
      knock: "You knock. At the bus stop, someone turns round slowly to see if it was for them, and turns back." },
    { add: "object", id: "bell", at: "lobby", name: "Bell", note: "On the counter.", opens: ["porter"], actions: ["Ring bell"],
      words: { nouns: ["bell"], adj: ["brass"] },
      examine: "A brass bell on the porter's counter, the kind you press with the flat of your hand. A card under it says: \"Ring for the porter.\"",
      push: "You ring the bell. A speaker under the counter answers in a man's voice, kept from when it was a man's: \"Thank you. Someone will be with you presently.\" Nobody is, presently." },
    { add: "object", id: "bench", at: "lobby", name: "Bench", note: "Bolted down.", enterable: "on",
      words: { nouns: ["bench"], adj: [] },
      examine: "Bolted down, so that it can be sat on and not taken away.",
      enter: "You sit. The bench was bolted down for this, and holds you the way it was told to: firmly, and without asking where you are going." },

    { add: "room", id: "registry", name: "REGISTRY", area: "block", at: [0, -1, 1],
      describe: [
        "The Registry, fourteenth floor, where residents are confirmed. It is bright and quiet, the way a waiting room is when it expects you by name. Frosted {booths|booth} run down one wall, each with a green light on, except the last.",
        "A {terminal} shows PLEASE REMAIN PRESENT in a patient font. Beside it a {slot} is the width of a summons, and a {shredder} hums under a placard: \"Repeat presence is destroyed.\" The stairs go down."
      ],
      exits: { d: "stairwell" },
      scenery: [
        { words: ["placard"], name: "the placard", says: "\"Repeat presence is destroyed.\" It has been there since before anyone can remember a repeat." },
        { words: ["stairs", "steps"], name: "the stairs", leads: "d", says: "The stairs you came up, going back down to the stairwell." }
      ],
      ambience: {
        lines: [
          "The booths switch their green lights on, one at a time, to be sure.",
          "The cursor waits in the gap, and does not blink.",
          "A chair in the last booth creaks, as if someone sat down and then thought better of it."
        ],
        every: [35, 70], chance: 0.6
      },
      sleep: "PLEASE REMAIN PRESENT, says the terminal. You remain present.",
      alt: "A terminal screen close up, its text lines in green and a cursor waiting in a gap, a slot and a shredder below.",
      picture: pictures.registry, music: roomMusic.registry },
    { add: "object", id: "terminal", at: "registry", name: "Terminal", note: "Waiting for a tick.",
      words: { nouns: ["terminal", "screen"], adj: ["desk"] },
      examine: "The screen shows the register: columns of names, each with a small green tick. There is a gap where a tick should be, and a cursor waiting in it, patient as a dog.",
      touch: "You touch the screen. The cursor comes to your finger, considers it, and goes back to the gap. A finger is not the whole of a person." },
    { add: "object", id: "booth", at: "registry", name: "Last booth", note: "Dark, with a chair in it.", enterable: "in",
      actions: ["Sit in last booth"],
      words: { nouns: ["booth", "booths", "chair"], adj: ["last", "dark", "frosted"] },
      examine: "Frosted glass, and a green light in each booth, except the last, which is dark and has a chair in it. The chair faces the glass, and has been kept for someone." },
    { add: "object", id: "slot", at: "registry", container: true, open: "always", material: "metal", name: "Slot", note: "Lit from inside.",
      words: { nouns: ["slot"], adj: ["narrow"] },
      examine: "A slot the width of a summons, lit from inside. A small plate reads PRESENCE. The slot is warm, as if it has been waiting a long time for you." },
    { add: "object", id: "shredder", at: "registry", container: true, open: "always", material: "metal", name: "Shredder", note: "Warm from use.",
      words: { nouns: ["shredder"], adj: ["grey"] },
      examine: "A grey shredder with a cover that is warm from use. Its basket is empty, which means either that nothing was destroyed today, or that everything was destroyed quickly." },

    // ---- the pictures of the endings and the death (before the rules that end the story) ----------------------
    ...Object.entries(endingPictures).map(([id, picture]) => ({ add: "picture", id, alt: endingAlts[id], picture })),

    // ---- rules: the chain, the hurts, the endings -------------------------------------------------------------
    { add: "word", verb: "print", words: ["print", "reprint", "print out"], object: "optional",
      reply: "Only the printer in the Staff Room prints, and only for someone who has lost a summons." },
    { add: "word", verb: "type", words: ["type", "type in"], object: "optional", speech: true,
      reply: "There is no keyboard anywhere in the Meridian Block. Its machines are not told things; they are shown them." },
    { add: "rule", rule: { id: "print_slip", match: { verb: ["push", "print"], obj: [null, "printer"] }, if: [{ "player.at": "staff" }], once: true,
      again: "$printer.push",
      do: [
        { say: "The printer wakes, considers you, and pushes out one {slip}: your summons, reissued, in a slightly newer typeface." },
        { move: "slip", to: "player" }
      ] } },
    { add: "rule", rule: { id: "urn_first_cup", match: { verb: "drink", obj: "urn" }, if: [{ "player.at": "canteen" }], once: true,
      again: "Hot water, and nothing more. The first cup was the one it had been waiting to give.",
      do: [{ heal: 1, says: "You run the tap into your cupped hands and drink. It is only hot water, and the first the urn has given anyone in years; afterwards it gurgles, as if it had been thanked." }] } },
    { add: "rule", rule: { id: "cable_bites", match: { verb: ["touch", "take", "grab", "pull"], obj: "cable" }, if: [{ "player.at": "stairwell" }], once: true,
      do: [{ hurt: 2, says: "The cable bites. A white line runs across your palm, and stays there a while." }] } },
    { add: "rule", rule: { id: "shaft_fall", match: { verb: ["enter", "jump", "climb"], obj: "shaft" }, if: [{ "player.at": "corridor" }],
      do: [
        { hurt: 5, says: "You step over the sill, and there is no floor, only the cable going down for a long time." },
        { end: true, picture: "shaft" }
      ] } },
    { add: "rule", rule: { id: "slip_confirmed", match: { verb: "put", obj: "slip", obj2: "slot" },
      if: [{ "player.at": "registry" }, { "slip.at": "player" }],
      do: [
        { say: "The slot takes the slip, reads it, and says your name in a voice built to sound like a friend. Down the row, the last booth turns green. You are present, and nobody on the fourteenth floor will ask you to come back." },
        { end: true, picture: "present" }
      ] } },
    { add: "rule", rule: { id: "booth_sat", match: { verb: ["sit", "enter"], obj: "booth" }, if: [{ "player.at": "registry" }],
      do: [
        { say: "You sit down in the last booth. The frosted glass closes round you like a held breath, and the light over the chair thinks about it, and turns green. Nobody asks for paper. You are present, in person, and nobody on the fourteenth floor will ask you to come back." },
        { end: true, picture: "booth" }
      ] } },
    { add: "rule", rule: { id: "slip_shredded", match: { verb: "put", obj: "slip", obj2: "shredder" },
      if: [{ "player.at": "registry" }, { "slip.at": "player" }],
      do: [
        { say: "The shredder takes the slip in one bite and gives nothing back. Somewhere down the booths a green light goes out, and nobody on the fourteenth floor looks up from the screen." },
        { end: true, picture: "erased" }
      ] } },

    // ---- puzzles: the chain, each step needing the one before ---------------------------------------------------
    { add: "puzzle", id: "print_slip", where: "staff", needs: [], solve: ["push printer"], gives: ["slip"],
      clues: ["notice_board", "printer"],
      hints: ["The notice board says where a lost summons can be printed again.", "Push the printer."] },
    { add: "puzzle", id: "find_crank", where: "records", needs: [], solve: ["open drawer", "take crank"], gives: ["crank"],
      clues: ["stair_gate", "archivist"],
      hints: ["The gate wants something the shelf label says is in the desk.", "Open the drawer and take the crank."] },
    { add: "puzzle", id: "open_gate", where: "stairwell", needs: ["crank"], solve: ["unlock gate with crank", "go up"], reaches: "registry",
      clues: ["stair_gate", "crank"],
      hints: ["The gate has a hole that is not for a key.", "Unlock the gate with the crank, then go up."] },
    { add: "puzzle", id: "confirm_presence", where: "registry", needs: ["slip", "open_gate"], solve: ["put slip in slot"], ending: true,
      clues: ["slot", "notice_board"],
      hints: ["The slot is the width of a summons, and it is warm.", "Put the slip in the slot."] },
    { add: "puzzle", id: "sit_in_booth", where: "registry", needs: ["open_gate"], solve: ["sit in booth"], ending: true,
      clues: ["booth", "notice_board", "terminal"],
      hints: ["The last booth is dark, and its chair has been kept for someone.", "Sit in the last booth."] },
    { add: "puzzle", id: "erase_presence", where: "registry", needs: ["slip", "open_gate"], solve: ["put slip in shredder"], ending: true,
      clues: ["shredder", "slot"],
      hints: ["Something in this room is quieter than the slot, and it destroys.", "Put the slip in the shredder."] },
    { add: "puzzle", id: "step_into_shaft", where: "corridor", needs: [], solve: ["enter shaft"], ending: true,
      clues: ["shaft", "summons_notice"],
      hints: ["The lift shaft stands open on a warm dark, and its sign asks you kindly not to.", "Step into the lift shaft."] }
  ]
};
