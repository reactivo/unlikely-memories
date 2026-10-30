// Standard verbs: what happens when no game rule matches your action (ARCHITECTURE.md §4).
// They are rules in the same format as any other, tried in order after the game's own rules; fixed for the
// whole game. Texts are "@keys" into the language pack. "$obj" = the action's object, "$here" = your room.
// A few actions are handled here in full (look, take…); every other action (js/actions.js) answers with its
// standard reply from the pack (replies.<action>, varied).

import { ACTIONS, BUILT_IN } from "./actions.js";

const reachable = { "$obj.place": { in: ["$here", "player"] } };   // in the room or carried (or inside those)
const reachable2 = { "$obj2.place": { in: ["$here", "player"] } };  // the same for the action's second object
// What examining a thing says: its `examine` (and picture), and the ideas it brings up (`opens`: the decree → "monday", so
// characters can be asked about them). Reading and searching say the same when nothing else answers them.
const examined = [{ say: "$obj.examine", img: "$obj.img" }, { know: "$obj.opens" }];
const describes = [reachable, { "$obj.examine": { "!=": null } }];   // in reach, with an `examine` of its own

// Actions a thing can answer with a property of the same name ({ take: "It's tied to the post." }, { talk: [ … ] }).
// Not these: `open` is a state, and the others are handled in full below.
// (`use` is not a line either: it names the action USE alone stands for, `use: "pull"`.)
const NO_ANSWER = new Set(["open", "examine", "look", "inventory", "go", "help", "hint", "time", "status", "use"]);
export const ANSWERED = Object.keys(ACTIONS).filter(a => !NO_ANSWER.has(a));

const rules = [
  // Nothing to do (input with only punctuation).
  { id: "std_none", match: { verb: "none" }, do: [] },

  // Being in or on things (`enterable: "in"` or `"on"`; where you are: player.in). Getting in uses the thing's own
  // `enter` line if it has one; getting out works by every common way. (Moving gets you out first: js/engine.js, before
// any rule, so a world's own direction rules can't keep you in.)
  { id: "std_in_already", match: { verb: ["enter", "sit", "climb", "lie"] }, if: [{ "player.in": { "!=": null } }, { "$obj.enterable": { "!=": null } }, { "player.in": "$obj" }],
    do: [{ say: "@alreadyIn", things: ["$obj"] }] },
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

  // Locks: a locked thing opens with its key (`lock: { key, says, opens, then }`), or says why not.
  { id: "std_unlock", match: { verb: ["unlock", "open"] }, if: [{ "$obj.locked": true }], do: [{ unlock: "$obj" }] },
  { id: "std_locked", match: { verb: ["enter", "push", "pull"] }, if: [{ "$obj.locked": true }, { "$obj.lock.says": { "!=": null } }],
    do: [{ say: "$obj.lock.says" }] },
  { id: "std_locked_plain", match: { verb: ["enter", "push", "pull"] }, if: [{ "$obj.locked": true }], do: [{ say: "@locked" }] },

  // Waiting for something (said: "wait for the train", "wait until night"): only where there's a reason. A thing
  // here or the room with `waitFor: { time, says, if? }` moves the world's clock (its line, then the time: "next
  // 17:15") while its `if` holds (same conditions as a rule's; none = always); anywhere else, or when it doesn't
  // hold, there's nothing worth waiting for. "wait" alone is the standard reply: a moment passes.
  { id: "std_wait_thing", match: { verb: "wait" }, if: [{ "$text": { "!=": null } }, reachable, { "$obj.waitFor": { "!=": null } }, { "$obj.waitFor.if": { holds: true } }],
    do: [{ say: "$obj.waitFor.says" }, { time: "$obj.waitFor.time" }] },
  { id: "std_wait_here", match: { verb: "wait" }, if: [{ "$text": { "!=": null } }, { "$here.waitFor": { "!=": null } }, { "$here.waitFor.if": { holds: true } }],
    do: [{ say: "$here.waitFor.says" }, { time: "$here.waitFor.time" }] },
  { id: "std_wait_nothing", match: { verb: "wait" }, if: [{ "$text": { "!=": null } }], do: [{ say: "@noWait", vary: true }] },

  // Answers by property: a thing answers a verb with its property of that name; a room answers a verb typed with
  // no object ("listen", "smell"); asking someone falls back to what they say when you talk to them.
  ...ANSWERED.map(a => ({ id: "std_answer_" + a, match: { verb: a }, if: [{ ["$obj." + a]: { "!=": null } }], do: [{ say: "$obj." + a }] })),
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

  // Take: already carried; portable and here (or in something here); or fixed in place. Taking and dropping say nothing of
  // their own: the engine's echo of what you gain or lose ("You get the key", js/engine.js) is the whole reply.
  // "Take X from Y" only when X is directly in Y.
  { id: "std_take_not_in", match: { verb: "take" }, if: [{ "$obj2": { "!=": null } }, { "$obj.at": { "!=": "$obj2" } }],
    do: [{ say: "@notInside", things: ["$obj", "$obj2"], vary: true }] },
  { id: "std_take_have", match: { verb: "take" }, if: [{ "$obj.at": "player" }], do: [{ say: "@already" }] },
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
  { id: "std_put_in", match: { verb: "put" }, if: [{ "$obj2": { "!=": null } }, { "$obj2.container": true }, { "$obj2.open": true }, reachable2],
    do: [{ move: "$obj", to: "$obj2" }, { say: "@putIn", things: ["$obj", "$obj2"], vary: true }] },

  // Use: not an action of its own. "use X with Y" becomes the action meant (unlock, put in, give: js/use.js) and runs as if
  // typed; a thing's own `use` ("pull") is what USE alone means for it; USE alone otherwise lists what you could do (the
  // controller, js/view.js); anything that means nothing gets the stock reply. A world's own rules for "use" come first.
  { id: "std_use_field", match: { verb: "use", obj2: [null], scenery: [null] }, if: [{ "$obj.use": { "!=": null } }], do: [{ useAs: "field" }] },
  { id: "std_use_alone", match: { verb: "use", obj2: [null], scenery: [null] }, do: [{ useHow: "$obj" }] },
  { id: "std_use_with", match: { verb: "use" }, do: [{ useAs: "pair" }] },

  // Read: like examining, unless a game rule says what's written.
  { id: "std_read", match: { verb: "read" }, if: describes, do: examined },

  // Go: through an exit that leads to a room; a closed or missing exit is wall. A shut way with a line of its own
  // (an exit `{ to, if, closed }`) says it; one without gets the standard "no way".
  { id: "std_go_closed", match: { verb: "go" }, if: [{ "$exit.closed": { "!=": null } }], do: [{ say: "$exit.closed" }] },
  { id: "std_go_blocked", match: { verb: "go" }, if: [{ "$exit": { in: [false, true, null] } }], do: [{ say: "@noWay", vary: true }] },
  { id: "std_go", match: { verb: "go" }, do: [{ travel: "$exit" }, { describe: "$here" }] },

  // Searching or looking in something with no answer of its own: what you see when you examine it.
  { id: "std_search", match: { verb: "search" }, if: describes, do: examined },

  // Every other action: its standard reply (and read, when there's nothing to read).
  ...Object.keys(ACTIONS).filter(a => !BUILT_IN.has(a) || a === "read")
    .map(a => ({ id: "std_reply_" + a, match: { verb: a }, do: [{ say: "@replies." + a, vary: true }] })),

  // An answer to a question for words (`ask`) that no rule of the world catches: a plain reply. (A yes/no question's
  // answer never gets here: the engine runs it first.)
  { id: "std_unheard", match: { verb: "answer" }, do: [{ say: "@answerUnheard" }] },

  // Anything else.
  { id: "std_unknown", match: {}, do: [{ say: "@unsure", vary: true }] }
];

// The generic answers: a verb's stock reply, or "you can't" / "nothing special" / "no way". A command answered only
// by one of these isn't worth offering ("Did you mean…?", suggestion lines): nothing in the world answers it.
const GENERIC = new Set(["std_in_already", "std_not_in", "std_locked_plain", "std_wait_nothing", "std_ask_unknown",
  "std_examine_plain", "std_take_not_in", "std_take_have", "std_take_fixed", "std_drop_not", "std_go_blocked", "std_unknown",
  "std_put_not_carried", "std_put_inside", "std_put_closed", "std_use_alone", "std_unheard"]);
export default rules.map(r => (GENERIC.has(r.id) || r.id.startsWith("std_reply_") ? { ...r, generic: true } : r));

// The standard answer that only shows what examining the thing shows: reading a thing with nothing else to answer it
// (std_read plays `examined`). A command answered by it, about a thing whose EXAMINE is the standard one too, would only
// repeat it: the game doesn't offer it for that thing (js/view.js, `offering`). Not std_search: "Look through window" is
// read as SEARCH, and a world offers it to say where to look.
export const EXAMINED = new Set(["std_read"]);
