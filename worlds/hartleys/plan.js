// The plan of "hartleys" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// floor is written from the same north-west corner, so a column is the same column on every floor. Exits are made from it.
export default {
  "-1": [
    ".",
    ".         .             basement",
  ],
  "0": [   // the ground floor
    ".         .             lift",
    ".         .             lift_lobby",
    ".         perfumery     front_hall      gloves",
    ".         .             pavement",
  ],
  "1": [
    ".",
    ".         haberdashery  first_landing   toys",
  ],
  "2": [
    ".",
    "tea_room  furniture     second_landing  coats",
  ],
  "3": [
    ".",
    ".         .             roof_garden",
  ],
  "4": [
    ".         .             fourth_floor",
  ],
};
