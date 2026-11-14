// Standard verbs: what happens when no game rule matches your action (ARCHITECTURE.md §4).
// They are rules in the same format as any other, tried in order after the game's own rules; fixed for the
// whole game. Texts are "@keys" into the language pack. "$obj" = the action's object, "$here" = your room.
// A few actions are handled here in full (look, take…); every other action (js/actions.js) answers with its
// standard reply from the pack (replies.<action>, varied).

import { ACTIONS, BUILT_IN } from "./actions.js?v=0.50.3";

const reachable = { "$obj.place": { in: ["$here", "player"] } };   // in the room or carried (or inside those)
const reachable2 = { "$obj2.place": { in: ["$here", "player"] } };  // the same for the action's second object
// What examining a thing says: its `examine` (and picture), and the ideas it brings up (`opens`: the decree → "monday", so
// characters can be asked about them). Reading and searching say the same when nothing else answers them.
const examined = [{ say: "$obj.examine", img: "$obj.img" }, { know: "$obj.opens" }];
const describes = [reachable, { "$obj.examine": { "!=": null } }];   // in reach, with an `examine` of its own

// Actions a thing can answer with a property of the same name ({ take: "It's tied to the post." }, { talk: [ … ] }).
// Not these: `open` is a state, and the others are handled in full below.
// (`use` is not a line either: it names the action USE alone stands for, `use: "pull"`.)
// (`order` neither: what is ordered is a thing that comes `from` someone, and a world verb's reply is its `add word`'s.)
const NO_ANSWER = new Set(["open", "examine", "look", "inventory", "go", "help", "hint", "time", "status", "use", "order", "buy"]);
export const ANSWERED = Object.keys(ACTIONS).filter(a => !NO_ANSWER.has(a));

const rules = [
  // Nothing to do (input with only punctuation).
  { id: "std_none", match: { verb: "none" }, do: [] },

  // Being in or on things (`enterable: "in"` or `"on"`; where you are: player.in). Getting in uses the thing's own
  // `enter` line if it has one; getting out works by every common way. (Moving gets you out first: js/engine.js, before
  // any rule, so a world's own direction rules can't keep you in.)
  { id: "std_in_already", match: { verb: ["enter", "sit", "climb", "lie"] }, if: [{ "player.in": { "!=": null } }, { "$obj.enterable": { "!=": null } }, { "player.in": "$obj" }],
    do: [{ say: "@alreadyIn", things: ["$obj"] }] },

  // Locks: a locked thing opens with its key (`lock: { key, says, opens, then }`), or says why not. A locked thing you could
  // get into stays shut to you, and so does a closed container: the lock and the lid come before getting in.
  { id: "std_unlock", match: { verb: ["unlock", "open"] }, if: [{ "$obj.locked": true }], do: [{ unlock: "$obj" }] },
  { id: "std_locked", match: { verb: ["enter", "push", "pull"] }, if: [{ "$obj.locked": true }, { "$obj.lock.says": { "!=": null } }],
    do: [{ say: "$obj.lock.says" }] },
  { id: "std_locked_plain", match: { verb: ["enter", "push", "pull"] }, if: [{ "$obj.locked": true }], do: [{ say: "@locked" }] },
  { id: "std_locked_in", match: { verb: ["sit", "climb", "lie"] }, if: [{ "$obj.enterable": { "!=": null } }, { "$obj.locked": true }, { "$obj.lock.says": { "!=": null } }],
    do: [{ say: "$obj.lock.says" }] },
  { id: "std_locked_in_plain", match: { verb: ["sit", "climb", "lie"] }, if: [{ "$obj.enterable": { "!=": null } }, { "$obj.locked": true }], do: [{ say: "@locked" }] },
  { id: "std_get_in_closed", match: { verb: ["enter", "sit", "climb", "lie"] }, if: [{ "$obj.enterable": { "!=": null } }, { "$obj.container": true }, { "$obj.open": false }],
    do: [{ say: "@closed", things: ["$obj"], vary: true }] },

  { id: "std_get_in_own", match: { verb: ["enter", "sit", "climb", "lie"] }, if: [{ "$obj.enterable": { "!=": null } }, { "$obj.enter": { "!=": null } }],
    do: [{ set: "player.in", to: "$obj" }, { say: "$obj.enter" }] },
  { id: "std_get_on", match: { verb: ["enter", "sit", "climb", "lie"] }, if: [{ "$obj.enterable": "on" }],
    do: [{ set: "player.in", to: "$obj" }, { say: "@gotOn", things: ["$obj"] }] },
  { id: "std_get_in", match: { verb: ["enter", "sit", "climb", "lie"] }, if: [{ "$obj.enterable": { "!=": null } }],
    do: [{ set: "player.in", to: "$obj" }, { say: "@gotIn", things: ["$obj"] }] },
  { id: "std_get_off", match: { verb: ["exit", "stand"], obj: [null] }, if: [{ "player.in": { "!=": null } }, { "$in.enterable": "on" }],
    do: [{ say: "@gotOff", things: ["$in"] }, { set: "player.in", to: null }] },
  { id: "std_get_out", match: { verb: ["exit", "stand"], obj: [null] }, if: [{ "player.in": { "!=": null } }],
    do: [{ say: "@gotOut", things: ["$in"] }, { set: "player.in", to: null }] },
  { id: "std_get_off_named", match: { verb: ["exit", "stand"] }, if: [{ "player.in": { "!=": null } }, { "player.in": "$obj" }, { "$obj.enterable": "on" }],
    do: [{ say: "@gotOff", things: ["$obj"] }, { set: "player.in", to: null }] },
  { id: "std_get_out_named", match: { verb: ["exit", "stand"] }, if: [{ "player.in": { "!=": null } }, { "player.in": "$obj" }],
    do: [{ say: "@gotOut", things: ["$obj"] }, { set: "player.in", to: null }] },
  { id: "std_not_in", match: { verb: "exit" }, if: [{ "$obj.enterable": { "!=": null } }],
    do: [{ say: "@notIn", things: ["$obj"] }] },
  { id: "std_ways_out", match: { verb: "exit", obj: [null] }, do: [{ say: "@waysOut", arg: "$exits" }] },

  // Containers: OPEN on a closed container in reach that isn't locked opens it, CLOSE on an open one closes it (a locked one
  // goes to its lock, above; CLOSE on one says it's locked). What it holds is then in reach, or shut away again; opening says
  // what it holds ("Inside: a {crank}.", each thing marked), so a world writes no rule for that. A world's own open rule comes
  // first: write one only for what is special. One with no lid (`open: "always"`: a boat, a bin, a slot) is open for good: OPEN
  // and CLOSE get a plain no, and only a world's own rule may change it.
  { id: "std_open_always", match: { verb: "open" }, if: [{ "$obj.container": true }, { "$obj.open": "always" }, reachable], do: [{ say: "@cantOpen" }] },
  { id: "std_close_always", match: { verb: "close" }, if: [{ "$obj.container": true }, { "$obj.open": "always" }, reachable], do: [{ say: "@cantClose" }] },
  { id: "std_open", match: { verb: "open" }, if: [{ "$obj.container": true }, { "$obj.open": false }, { "$obj.locked": { "!=": true } }, reachable],
    do: [{ set: "$obj.open", to: true }, { say: "@opened", things: ["$obj"] }, { inside: "$obj" }] },
  { id: "std_open_already", match: { verb: "open" }, if: [{ "$obj.container": true }, reachable], do: [{ say: "@alreadyOpen", things: ["$obj"] }] },
  { id: "std_close_locked", match: { verb: "close" }, if: [{ "$obj.container": true }, { "$obj.locked": true }, reachable], do: [{ say: "@locked", things: ["$obj"] }] },
  { id: "std_close", match: { verb: "close" }, if: [{ "$obj.container": true }, { "$obj.open": true }, reachable],
    do: [{ set: "$obj.open", to: false }, { say: "@closedIt", things: ["$obj"] }] },
  { id: "std_close_already", match: { verb: "close" }, if: [{ "$obj.container": true }, reachable], do: [{ say: "@alreadyClosed", things: ["$obj"] }] },

  // Waiting for something (said: "wait for the train", "wait until night"): only where there's a reason. A thing
  // here or the room with `waitFor: { time, says, if? }` moves the world's clock (its line, then the time: "next
  // 17:15") while its `if` holds (same conditions as a rule's; none = always); anywhere else, or when it doesn't
  // hold, there's nothing worth waiting for. "wait" alone waits for the room's own `waitFor` while its `if` holds (its moment is
  // still ahead); otherwise it is the standard reply: a moment passes.
  { id: "std_wait_thing", match: { verb: "wait" }, if: [{ "$text": { "!=": null } }, reachable, { "$obj.waitFor": { "!=": null } }, { "$obj.waitFor.if": { holds: true } }],
    do: [{ say: "$obj.waitFor.says" }, { time: "$obj.waitFor.time" }] },
  { id: "std_wait_here", match: { verb: "wait" }, if: [{ "$here.waitFor": { "!=": null } }, { "$here.waitFor.if": { holds: true } }],
    do: [{ say: "$here.waitFor.says" }, { time: "$here.waitFor.time" }] },
  { id: "std_wait_nothing", match: { verb: "wait" }, if: [{ "$text": { "!=": null } }], do: [{ say: "@noWait", vary: true }] },

  // Sleeping (the engine's own `sleep`: js/engine.js, ARCHITECTURE.md §5 "Sleep"). A room where you can't sleep says so in its own
  // line (`sleep`, a plain fact: "Not on the platform, with the trains."), whatever the command names, after a world's own rules;
  // then a thing's own `sleep` line and a world's reply for the verb (`add word`), below; then the engine (std_sleep): refused in
  // the opening, over a question, in a conversation or a hold (the stock "This is no time to sleep."); with no length yet, "How long
  // do you sleep?"; else the sleep.
  { id: "std_sleep_refused", match: { verb: "sleep" }, if: [{ "$here.sleep": { "!=": null } }, { "$here.fixed": { "!=": true } }], do: [{ say: "$here.sleep" }] },

  // A thing that comes from someone or something (`from`, decisions 40, 44, 45): ORDER it, BUY it, ASK FOR it or ASK its source FOR it
  // (or about it), where its source is, and it comes (the engine's `bring`: js/engine.js, wanted and bring): set in front of you, or
  // into your hands if it can be carried, with its `brought` line; `times` times, each once the last is gone (while the last is
  // there, its `already` line or the stock one); else its `again` line.
  { id: "std_bring", match: { verb: ["order", "buy", "ask"] }, if: [{ "$wanted": { "!=": null } }], do: [{ bring: "$wanted" }] },

  // Food and drink (`consumable: true`, decisions 42 and 43): EAT or DRINK it where it is in reach, carried or not (not what someone
  // holds), and it is used up, with what it does: its line (`eat` or `drink`, else the stock one) as the heal's line (`heals: n`), and
  // a condition started (`starts`) or ended (`stops`). The verb is the one it has a line for; with no line, either. The engine's
  // `consume` effect (js/engine.js); the echo "You no longer have…" is the engine's own, so only for a thing you carried.
  ...[["eat", "drink"], ["drink", "eat"]].map(([verb, other]) => ({ id: `std_${verb}_it`, match: { verb },
    if: [{ "$obj.consumable": true }, reachable, { "$obj.holder": null }, { any: [{ ["$obj." + verb]: { "!=": null } }, { ["$obj." + other]: null }] }],
    do: [{ consume: "$obj" }] })),

  // A thing that can't be dropped (`droppable: false`) is not dropped or put away, whatever else answers (its `drop` line, or
  // the stock one); giving it is another matter, and so is a rule of the world that moves it on purpose (those come first).
  ...["drop", "put"].flatMap(verb => [
    { id: `std_${verb}_kept`, match: { verb }, if: [{ "$obj.droppable": false }, { "$obj.place": "player" }, { "$obj.drop": { "!=": null } }], do: [{ say: "$obj.drop" }] },
    { id: `std_${verb}_kept_plain`, match: { verb }, if: [{ "$obj.droppable": false }, { "$obj.place": "player" }], do: [{ say: "@cantDrop" }] }
  ]),

  // Taking what you already have: the stock "you already have it", before the thing's own `take` line (a refusal, for where
  // it lies: "It's tied to the post." would be wrong in your hands).
  { id: "std_take_have", match: { verb: "take" }, if: [{ "$obj.at": "player" }], do: [{ say: "@already" }] },

  // Answers by property: a thing answers a verb with its property of that name; a room answers a verb typed with
  // no object ("listen", "smell"); asking someone falls back to what they say when you talk to them.
  ...ANSWERED.map(a => ({ id: "std_answer_" + a, match: { verb: a }, if: [{ ["$obj." + a]: { "!=": null } }], do: [{ say: "$obj." + a }] })),
  // Giving or showing something to a person who has a `give` line of their own: their line (the thing's own comes first).
  { id: "std_answer_give_to", match: { verb: ["give", "show"] }, if: [{ "$obj2.give": { "!=": null } }], do: [{ say: "$obj2.give" }] },
  // Talking to a person who has topics but no `talk` line: they are there, and wait for your question (their topics follow).
  { id: "std_talk_topics", match: { verb: "talk" }, if: [{ "$obj.person": true }], do: [{ say: "@talkReady", things: ["$obj"] }] },
  // Asking someone about a topic: their line for it; a topic they don't have: their `default`, or a neutral reply.
  { id: "std_ask_topic", match: { verb: "ask" }, if: [{ "$topic": { "!=": null } }, { "$obj.topics.$topic.says": { "!=": null } }],
    do: [{ say: "$obj.topics.$topic.says" }, { know: "$obj.topics.$topic.opens" }] },
  // A condition that holds your tongue (js/speech.js, `answer`): what anyone answers to what they have no answer for.
  { id: "std_ask_condition", match: { verb: "ask" }, if: [{ "$topic": { "!=": null } }, { "$obj.topics": { "!=": null } }, { "$speech.answer": { "!=": null } }],
    do: [{ say: "$speech.answer" }] },
  { id: "std_ask_default", match: { verb: "ask" }, if: [{ "$topic": { "!=": null } }, { "$obj.topics.default": { "!=": null } }],
    do: [{ say: "$obj.topics.default" }] },
  { id: "std_ask_unknown", match: { verb: "ask" }, if: [{ "$topic": { "!=": null } }], do: [{ say: "@noTopic", vary: true }] },
  { id: "std_answer_ask_talk", match: { verb: "ask" }, if: [{ "$obj.talk": { "!=": null } }], do: [{ say: "$obj.talk" }] },
  ...ANSWERED.map(a => ({ id: "std_here_" + a, match: { verb: a, obj: [null] }, if: [{ ["$here." + a]: { "!=": null } }], do: [{ say: "$here." + a }] })),

  { id: "std_help", match: { verb: "help" }, do: [{ say: "@help", style: "sys" }] },   // the system speaking: grey
  { id: "std_hint", match: { verb: "hint" }, do: [{ listenFor: true }] },
  { id: "std_look", match: { verb: "look" }, do: [{ describe: "$here" }] },
  { id: "std_inventory", match: { verb: "inventory" }, do: [{ describe: "inventory" }] },
  // TIME and STATUS: the world's day and time, and how you are, in the game's voice (white). A world can answer
  // them its own way in a place ("The clocks here have no hands."): its rules come first.
  { id: "std_time", match: { verb: "time" }, do: [{ describe: "time" }] },
  { id: "std_status", match: { verb: "status" }, do: [{ describe: "status" }] },

  // Examine: the object's own description (and picture), or "nothing special".
  { id: "std_examine", match: { verb: "examine" }, if: describes, do: examined },
  { id: "std_examine_plain", match: { verb: "examine" }, if: [reachable], do: [{ say: "@nothingSpecial" }] },

  // Take: already carried; portable and here (or in something here, or in something you carry); or fixed in place. Not what
  // you are in or on (get out first, only if you could carry it: a booth you are in just won't come away), and not what a person has (that can be taken at all), unless a rule of the world answers (`unlessAnswered`: nor
  // after a rule that asked for the default). Taking and dropping say nothing of their own: the engine's echo of what you gain
  // and lose ("You get the key", js/engine.js) is the whole reply, except taking out of something you carry, which gains
  // nothing and so says so itself.
  // "Take X from Y" only when X is directly in Y. (Already carried: above, before the answers.)
  { id: "std_take_not_in", match: { verb: "take" }, if: [{ "$obj2": { "!=": null } }, { "$obj.at": { "!=": "$obj2" } }],
    do: [{ say: "@notInside", things: ["$obj", "$obj2"], vary: true }] },
  { id: "std_take_on", match: { verb: "take" }, if: [{ "player.in": "$obj" }, { "$obj.enterable": "on" }, { "$obj.portable": true }], do: [{ say: "@getOffToTake", things: ["$obj"] }] },
  { id: "std_take_inside", match: { verb: "take" }, if: [{ "player.in": "$obj" }, { "$obj.portable": true }], do: [{ say: "@getOutToTake", things: ["$obj"] }] },
  { id: "std_take_person", match: { verb: "take" }, if: [{ "$obj.holder": { "!=": null } }, { "$obj.portable": true }, reachable], unlessAnswered: true,
    do: [{ say: "@wontGive", things: ["$obj.holder", "$obj"] }] },
  { id: "std_take_out", match: { verb: "take" }, if: [{ "$obj.place": "player" }, { "$obj.portable": true }],
    do: [{ say: "@tookOut", things: ["$obj", "$obj.at"] }, { move: "$obj", to: "player" }] },
  // (`place` follows containers, so this also takes things out of an open hut or box in the room.)
  { id: "std_take", match: { verb: "take" }, if: [{ "$obj.place": "$here" }, { "$obj.portable": true }],
    do: [{ move: "$obj", to: "player" }] },
  { id: "std_take_fixed", match: { verb: "take" }, if: [{ "$obj.place": "$here" }], do: [{ say: "@cantTake" }] },

  // Drop: only what you carry.
  { id: "std_drop", match: { verb: "drop" }, if: [{ "$obj.at": "player" }],
    do: [{ move: "$obj", to: "$here" }] },
  { id: "std_drop_not", match: { verb: "drop" }, do: [{ say: "@notCarried" }] },

  // Put: something you carry goes into an open container in reach ("put on" is read as in; no surfaces, no sizes: a
  // world stops odd cases with its own rules, which come first). Not carried: nothing to put. A thing in itself, or in
  // something it holds, or a thing that isn't a container: the stock reply. A closed container says so.
  { id: "std_put_not_carried", match: { verb: "put" }, if: [{ "$obj.place": { "!=": "player" } }], do: [{ say: "@notCarried" }] },
  { id: "std_put_inside", match: { verb: "put" }, if: [{ "$obj2": { "!=": null } }, { "$obj2.chain": { has: "$obj" } }],
    do: [{ say: "@replies.put", vary: true }] },
  { id: "std_put_closed", match: { verb: "put" }, if: [{ "$obj2": { "!=": null } }, { "$obj2.container": true }, { "$obj2.open": false }, reachable2],
    do: [{ say: "@closed", things: ["$obj2"], vary: true }] },
  { id: "std_put_in", match: { verb: "put" }, if: [{ "$obj2": { "!=": null } }, { "$obj2.container": true }, { "$obj2.open": { in: [true, "always"] } }, reachable2],
    do: [{ move: "$obj", to: "$obj2" }, { say: "@putIn", things: ["$obj", "$obj2"], vary: true }] },

  // Use: not an action of its own. "use X with Y" becomes the action meant and runs as if typed: a world's rule for the pair the other
  // way round, else unlock, put in or give (js/use.js); a thing's own `use` ("pull") is what USE alone means for it; else the one verb
  // the world's rules answer it by ("smell tester": js/engine.js, ownUse); USE alone otherwise lists what you could do (the
  // controller, js/view.js); anything that means nothing gets the stock reply. A world's own rules for "use" come first.
  { id: "std_use_field", match: { verb: "use", obj2: [null], scenery: [null] }, if: [{ "$obj.use": { "!=": null } }], do: [{ useAs: "field" }] },
  { id: "std_use_alone", match: { verb: "use", obj2: [null], scenery: [null] }, do: [{ useAs: "own" }] },
  { id: "std_use_with", match: { verb: "use" }, do: [{ useAs: "pair" }] },

  // Read: like examining, unless a game rule says what's written.
  { id: "std_read", match: { verb: "read" }, if: describes, do: examined },

  // Go: through an exit that leads to a room; a closed or missing exit is wall. A shut way with a line of its own
  // (an exit `{ to, if, closed }`, or a locked thing that `leads` that way: its lock's `says`, else "locked") says it; one without gets
  // the standard "no way".
  { id: "std_go_locked_plain", match: { verb: "go" }, if: [{ "$exit.by": { "!=": null } }, { "$exit.closed": "@locked" }], do: [{ say: "@locked", things: ["$exit.by"] }] },
  { id: "std_go_lacking", match: { verb: "go" }, if: [{ "$exit.needs": { "!=": null } }, { "$exit.closed": "@lacking" }], do: [{ say: "@lacking", things: ["$exit.needs"] }] },
  { id: "std_go_closed", match: { verb: "go" }, if: [{ "$exit.closed": { "!=": null } }], do: [{ say: "$exit.closed" }] },
  // "Go to the lamp", "walk to the gate" with the thing here and not a way out (a way out is read as going that way: js/parser.js):
  // it is right here. The world's own rule for going to it comes first, as everywhere.
  { id: "std_go_here", match: { verb: "go" }, if: [{ "$obj.name": { "!=": null } }], do: [{ say: "@hereAlready" }] },
  { id: "std_go_blocked", match: { verb: "go" }, if: [{ "$exit": { in: [false, true, null] } }], do: [{ say: "@noWay", vary: true }] },
  { id: "std_go", match: { verb: "go" }, do: [{ travel: "$exit" }] },

  // Searching or looking in something with no answer of its own: what you see when you examine it.
  { id: "std_search", match: { verb: "search" }, if: describes, do: examined },

  // Giving or showing to a person who has nothing to say about it: not "there's no one to give it to".
  { id: "std_reply_give_person", match: { verb: "give" }, if: [{ "$obj2.person": true }], do: [{ say: "@replies.givePerson", things: ["$obj", "$obj2"], vary: true }] },
  { id: "std_reply_show_person", match: { verb: "show" }, if: [{ "$obj2.person": true }], do: [{ say: "@replies.showPerson", things: ["$obj", "$obj2"], vary: true }] },

  // A verb a world gave a reply (`add word` with `reply`, decision 20): that line, when nothing else answers it (a world's own verb,
  // or one of the pack's: lantern's "There is porter at the Bell…" for ORDER). A reply, like the pack's: nothing is offered for it.
  // Not in the opening: nothing a world adds reaches it.
  { id: "std_reply_word", match: {}, if: [{ "$word.reply": { "!=": null } }, { "$here.fixed": { "!=": true } }], do: [{ say: "$word.reply" }] },
  { id: "std_sleep", match: { verb: "sleep" }, do: [{ sleep: "$sleep" }] },

  // Every other action: its standard reply (and read, when there's nothing to read).
  ...Object.keys(ACTIONS).filter(a => !BUILT_IN.has(a) || a === "read")
    .map(a => ({ id: "std_reply_" + a, match: { verb: a }, do: [{ say: "@replies." + a, vary: true }] })),

  // An answer to a question for words (`ask`) that no rule of the world catches: a plain reply. (A yes/no question's
  // answer never gets here: the engine runs it first.)
  { id: "std_unheard", match: { verb: "answer" }, do: [{ say: "@answerUnheard" }] },

  // Anything else.
  { id: "std_unknown", match: {}, do: [{ say: "@unsure", vary: true }] }
];

// The generic answers: a verb's stock reply, or "you can't" / "nothing special" / "no way", or what is so already ("already
// open", "you have it"). A command answered only by one of these isn't worth offering ("Did you mean…?", suggestion lines):
// nothing in the world answers it. A refusal in the world's own words is not generic, and is offered (Diego, 3 November 2026: it
// gives the player a clue): a lock's `says` (std_locked, std_locked_in, and OPEN through the engine's `unlock`), a shut way's own
// line (std_go_closed: a door's `shut`, an exit's `closed` or `lacking`), and the line naming what a way wants you to hold
// (std_go_lacking: the pack's `lacking`, but it names the world's thing). The engine's `bring` and `unlock` mark their own stock
// refusals generic (js/engine.js); the opening's "not yet" is the world's line too (js/opening.js).
const GENERIC = new Set(["std_in_already", "std_not_in", "std_locked_plain", "std_wait_nothing", "std_ask_unknown",
  "std_examine_plain", "std_take_not_in", "std_take_have", "std_take_fixed", "std_drop_not", "std_go_blocked", "std_go_here", "std_unknown",
  "std_put_not_carried", "std_put_inside", "std_put_closed", "std_use_alone", "std_unheard", "std_open_already", "std_close_already", "std_close_locked", "std_open_always", "std_close_always",
  "std_locked_in_plain", "std_get_in_closed", "std_take_on", "std_take_inside", "std_take_person",
  "std_drop_kept", "std_drop_kept_plain", "std_put_kept", "std_put_kept_plain", "std_go_locked_plain"]);
export default rules.map(r => (GENERIC.has(r.id) || r.id.startsWith("std_reply_") ? { ...r, generic: true } : r));

// The standard answer that only shows what examining the thing shows: reading a thing with nothing else to answer it
// (std_read plays `examined`). A command answered by it, about a thing whose EXAMINE is the standard one too, would only
// repeat it: the game doesn't offer it for that thing (js/view.js, `offering`). Not std_search: "Look through window" is
// read as SEARCH, and a world offers it to say where to look.
export const EXAMINED = new Set(["std_read"]);
