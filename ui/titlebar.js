// Title bar: the place name, and the world's time ("Day 1 | 17:15:00": play time plus however far the story has
// moved it, js/time.js; a new day at midnight).

import { placeOf } from "../js/narrator.js";

// Set up the title bar on its element. Returns update() and showClock().
export function mount(root) {
  const $ = (id) => root.querySelector("#" + id);
  const pad = (n) => String(n).padStart(2, "0");   // 7 → "07"
  let shownSecond = -1;                             // the second on screen now (skip redraws within it)

  return {
    // The place name when you move (or the language changes), and the word "Day".
    update(prev, next) {
      const place = placeOf(next.state, next.pack);
      if ($("place").textContent !== place) $("place").textContent = place;
      if (!prev || prev.state.lang !== next.state.lang) $("l-day").textContent = next.pack.labels.day;
    },
    // Show the world's time (ms since day 1, 00:00). The controller calls this a few times a second.
    showClock(ms) {
      const total = Math.floor(ms / 1000);          // whole seconds since day 1, 00:00
      if (total === shownSecond) return;            // same second as on screen: nothing to change
      shownSecond = total;
      const day = Math.floor(total / 86400) + 1;    // days start at 1
      const s = total % 86400;                      // seconds into the current day
      $("v-day").textContent = day;
      $("v-hh").textContent = pad(Math.floor(s / 3600));
      $("v-mm").textContent = pad(Math.floor(s / 60) % 60);
      $("v-ss").textContent = pad(s % 60);
      // The same time in machine-readable form (ISO 8601 duration), for screen readers and tools.
      $("v-time").setAttribute("datetime",
        "P" + (day - 1) + "DT" + Math.floor(s / 3600) + "H" + (Math.floor(s / 60) % 60) + "M" + (s % 60) + "S");
    }
  };
}
