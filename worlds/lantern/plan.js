// The plan of "lantern" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Every
// floor is written from the same north-west corner, so a column is the same column on every floor. Exits are made from it.
export default {
  "0": [   // the ground floor
    ".           court        .",
    "cab         row          pie_shop",   // the cab stands at the Row's kerb, west, on the street
    "substation  last_lamp    hut",
    "bell        river_steps  bridge",     // the Bell is down by the river, west of the steps
  ],
};
