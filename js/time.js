// World time: the clock on the title bar, and the one the story follows (ARCHITECTURE.md §5, "Time"). Pure.
//
// It runs with play time (state.clock, which only counts while you're playing) and the story moves it: jumps
// forward ("+8h", "next 06:00") or back ("-1d"), or to a set time ("day 1 17:00", a world's start). Only the
// clock moves; what you changed stays changed.
//
//   world time (ms since day 1, 00:00) = state.clock + state.time.shift

export const MINUTE = 60000, HOUR = 60 * MINUTE, DAY = 24 * HOUR;
export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];   // ids; each language names them

export const worldTime = (state) => Math.max(0, state.clock + (state.time?.shift || 0));

// The parts of a world time: day (from 1), hour, minute, second, and the weekday id if the world set one for day 1.
export function parts(ms, firstWeekday = null) {
  const day = Math.floor(ms / DAY) + 1, inDay = ms % DAY;
  const start = WEEKDAYS.indexOf(firstWeekday);
  return { day, hour: Math.floor(inDay / HOUR), minute: Math.floor(inDay / MINUTE) % 60, second: Math.floor(inDay / 1000) % 60,
           weekday: start < 0 ? null : WEEKDAYS[(start + day - 1) % 7] };
}

// Where a time effect moves the clock, from now (world ms). Returns { to } or { error }.
//   "+8h", "-1d", "+1d 2h 30m"       forward or back by an amount
//   "next 06:00"                     the next time it's 06:00 (later today, or tomorrow)
//   "day 1 17:00"                    a set time (a world's start)
export function moveTo(spec, now) {
  const s = String(spec).trim().toLowerCase();
  let m;
  if ((m = s.match(/^([+-])\s*((?:\d+\s*[dhm]\s*)+)$/))) {
    let amount = 0;
    for (const [, n, unit] of m[2].matchAll(/(\d+)\s*([dhm])/g)) amount += +n * { d: DAY, h: HOUR, m: MINUTE }[unit];
    return { to: Math.max(0, now + (m[1] === "-" ? -amount : amount)) };
  }
  if ((m = s.match(/^next\s+(\d{1,2}):(\d{2})$/))) {
    const t = clockTime(+m[1], +m[2]);
    if (t === null) return { error: "no such time: " + spec };
    const today = now - (now % DAY) + t;
    return { to: today > now ? today : today + DAY };
  }
  if ((m = s.match(/^day\s+(\d+),?\s+(\d{1,2}):(\d{2})$/))) {
    const t = clockTime(+m[2], +m[3]);
    if (t === null || +m[1] < 1) return { error: "no such time: " + spec };
    return { to: (+m[1] - 1) * DAY + t };
  }
  return { error: "a time is \"+8h\", \"-1d\", \"next 06:00\" or \"day 1 17:00\": " + spec };
}

// A scheduled rule's time: "17:15" (every day) or "day 2 08:00" (once). Returns { daily, at } or { error }.
export function schedule(spec) {
  const s = String(spec).trim().toLowerCase();
  let m;
  if ((m = s.match(/^(\d{1,2}):(\d{2})$/))) {
    const t = clockTime(+m[1], +m[2]);
    return t === null ? { error: "no such time: " + spec } : { daily: true, at: t };
  }
  const r = moveTo(s, 0);
  return s.startsWith("day") && !r.error ? { daily: false, at: r.to } : { error: "a scheduled time is \"17:15\" (every day) or \"day 2 08:00\" (once): " + spec };
}

// The first time a schedule comes round after `from` and no later than `to` (world ms), or null.
export function occursBetween(sched, from, to) {
  if (!sched.daily) return sched.at > from && sched.at <= to ? sched.at : null;
  let t = from - (from % DAY) + sched.at;
  if (t <= from) t += DAY;
  return t <= to ? t : null;
}

// The next time a schedule comes round after `from`, or null (a one-off already past).
export function nextAfter(sched, from) {
  return occursBetween(sched, from, Number.MAX_SAFE_INTEGER);
}

function clockTime(h, min) {
  return h >= 0 && h < 24 && min >= 0 && min < 60 ? h * HOUR + min * MINUTE : null;
}
