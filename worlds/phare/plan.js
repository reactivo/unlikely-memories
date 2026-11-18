// The plan of "phare" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// floor is written from the same north-west corner, so a column is the same column on every floor. Exits are made from it.
export default {
  "-1": [
    ".",
    ".",
    "packing_room  cellar     boiler",   // the cellar under the vestibule (the stairs are a real down), the boiler room under the cloakroom
  ],
  "0": [   // the ground floor
    ".",
    "west_gallery  hall       office",
    ".             vestibule  cloakroom",
    ".             cart",                  // the van, at the dock on the street, south of the vestibule: its hatch is a move by a rule
  ],
  "1": [
    ".             lens_room",
    ".             landing",
  ],
  "2": [
    ".             roof",
  ],
};
