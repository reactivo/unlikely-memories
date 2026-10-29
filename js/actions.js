// The general actions the engine knows (PARSER.md §4b): at most 80, each one making sense with almost any object.
// object: "none" (never takes one), "optional" (can stand alone: "listen", "smell door") or "required".
// absent: true = it can name something that exists but isn't here ("ask about", "think about", "wait for").
// speech: true = what follows is words said, not a thing ("say hello", "shout her name"); who to, after the
// pack's `speechTo` words ("say hello to the waiter") or named first ("tell the waiter hello"). Rules read $text.
// The words for each action and its standard replies are in the language packs (words.verbs, replies).
// Verbs that only fit one kind of thing (dig, row) are added by the world with its rules, not listed here.

export const ACTIONS = {
  // Looking and the senses
  look:      { object: "none" },
  examine:   { object: "required" },
  read:      { object: "required" },
  search:    { object: "required" },
  listen:    { object: "optional" },
  smell:     { object: "optional" },
  taste:     { object: "required" },
  touch:     { object: "required" },
  // Carrying
  take:      { object: "required" },
  drop:      { object: "required" },
  put:       { object: "required" },     // put X in / on Y
  give:      { object: "required" },     // give X to Y
  show:      { object: "required" },     // show X to Y
  throw:     { object: "required" },     // throw X at Y
  wear:      { object: "required" },
  remove:    { object: "required" },     // take off something worn
  inventory: { object: "none" },
  // You and your days
  time:      { object: "none" },                   // the world's day and time ("date" too)
  status:    { object: "none" },                   // how you are: your health
  // Handling things
  open:      { object: "required" },
  close:     { object: "required" },
  lock:      { object: "required" },
  unlock:    { object: "required" },
  push:      { object: "required" },
  pull:      { object: "required" },
  turn:      { object: "required" },
  move:      { object: "required" },
  switch_on: { object: "required" },
  switch_off:{ object: "required" },
  attack:    { object: "required" },
  knock:     { object: "required" },
  use:       { object: "required" },
  eat:       { object: "required" },
  drink:     { object: "required" },
  // Moving yourself
  go:        { object: "none" },         // with a direction
  enter:     { object: "optional" },
  exit:      { object: "none" },
  climb:     { object: "optional" },
  jump:      { object: "none" },
  sit:       { object: "optional" },
  lie:       { object: "optional" },
  stand:     { object: "none" },
  sleep:     { object: "none" },
  wake:      { object: "optional" },
  wait:      { object: "optional", absent: true },   // "wait for the train"
  // People and voice
  talk:      { object: "optional" },
  ask:       { object: "optional", absent: true },   // "ask the postmaster for my letters"
  say:       { object: "optional", speech: true },
  shout:     { object: "none", speech: true },
  sing:      { object: "none", speech: true },
  wave:      { object: "optional" },
  kiss:      { object: "required" },
  think:     { object: "optional", absent: true },   // "think about the photograph"
  pray:      { object: "none" },
  // The game itself
  help:      { object: "none" },
  hint:      { object: "none" }                    // points to the opening's listening thing (never a hint itself)
};

// Actions the engine handles itself (js/verbs.js); all the others answer with their standard replies.
export const BUILT_IN = new Set(["look", "examine", "read", "take", "drop", "inventory", "go", "help", "hint", "time", "status"]);
