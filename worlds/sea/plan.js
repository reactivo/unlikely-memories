// The plan of "sea" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// floor is written from the same north-west corner, so a column is the same column on every floor. Exits are made from it.
export default {
  "-1": [
    ".",
    ".",
    ".",
    ".",
    ".",
    ".       .            corridor",
  ],
  "0": [   // the ground floor
    ".       .            lighthouse_base",
    ".",
    ".",
    ".       .            pier_end",
    ".       .            pier",
    ".       tideline     beach            cave",
    ".       huts         dunes",
    "dining  lobby        promenade        carousel",
    ".       post_office  square           cafe",
    ".       .            station",
  ],
  "1": [
    ".       .            lantern",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "room11  hallway",
  ],
};
