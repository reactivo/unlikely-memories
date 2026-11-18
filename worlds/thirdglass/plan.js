// The plan of "thirdglass" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// floor is written from the same north-west corner, so a column is the same column on every floor. Exits are made from it.
export default {
  "-1": [
    ".        hands",
    "cistern  gallery",
  ],
  "0": [   // the ground floor
    ".        .        ridge  tent",
    ".        mouth    wadi   camp",
    ".        .        .      lines",
    ".        .        .      dunes",
  ],
};
