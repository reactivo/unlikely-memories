// The plan of "unspoken" (BRIEF.md §2): one grid for each floor, a row of room ids for each row of squares, "." for an empty square. Written by tools/world.mjs add
// from the hand-in.
export default {
  "0": [
    ". . purser_office passenger_saloon observation_deck . docking_slip terminal_concourse",
    "back_room cargo_hold vehicle_deck gangway . . . .",
    ". . storage_locker . . . . ."
  ],
  "1": [". . . wheelhouse . . . .", ". . . . . . . .", ". . . . . . . ."],
  "-1": [". . . . . . . .", "bilge_well engine_room . . . . . .", ". . . . . . . ."]
};
