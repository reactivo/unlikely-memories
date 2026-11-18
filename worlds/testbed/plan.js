// The plan of "testbed" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// floor is written from the same north-west corner, so a column is the same column on every floor. Exits are made from it.
// The plan's own example is here: the yard, a shed south of it (IN from the yard, OUT from the shed), a store behind the shed, and the attic
// on the shed's square a floor up (up from the shed, down from the attic). tests/testbed.test.js reads the squares and the lines off the state.
export default {
  "-1": [
    ".        .          tb-falls",
    ".        tb-pantry  tb-cellar  tb-vault",
    ".        .          tb-sump",
  ],
  "0": [   // the ground floor
    ".        .          tb-clinic  tb-lab",
    "tb-lane  tb-yard    tb-hub     tb-bar      tb-office",
    ".        tb-shed    tb-start   tb-bedroom",
    ".        tb-store",
  ],
  "1": [
    ".        .          tb-annex",
    ".        tb-chute   tb-ways    tb-landing",
    ".        tb-attic   tb-pit",
    ".        .          tb-closet",
  ],
  "2": [
    ".",
    ".        .          tb-roof",
  ],
};
