// Sound: the world's music, drawn from the state like the picture (MUSIC.md §5–§7; ARCHITECTURE.md §7, "Music"). With ♫ on
// it plays the world's music (state.music, read by js/music.js) in the room you are in, crossfading as you move. A world with no
// music plays nothing. It decides nothing about the game, never touches the state, and its randomness (the player's: ui/sound/) is
// never the game's. The sound itself is ui/sound/player.js, shared with the test bench; this piece only follows the game, and
// tells the player what it needs in the player's words (content/music.js, reactions; docs/music/PLAN.md, stage 5):
//   - The story ends (`ended`): the ending (the lines fade, the world's whole theme once, then silence); the death ending (the
//     `died` ending, or no health left): the same, the theme slower and lower. Silence after it until the story goes on again (a
//     new game, or UNDO), when the music starts as on arriving, the theme first. Reached on a restore (a loaded game), or with ♫
//     turned on after it: silence, never the ending's theme late.
//   - Sleep (js/main.js, sleepThrough, tells it: asleep()): everything fades out under the lids and back as you wake, the whole
//     theme a few seconds later.
//   - Night by the world's clock (js/main.js tells it the time shown on the title bar: clock()): the lines thinned, the theme lower.
//   - Health (docs/music/PLAN.md, stage 6): at 2 and below, unwell (the lines thinned, everything slightly flat); at 1, worse (the
//     theme slower and lower too); healed above it, well again. At 0 the story has ended: the ending takes over.
//   - The picture's filters that are on (state.filters, whatever turned them on: a condition's `filters` or a `filter` effect),
//     through one table (content/music.js, reactions.filters): sway → the wobble, ghost → the echo; the others, nothing yet.
//     A world writes nothing for any of it.
//   - The sounds (docs/sound/PLAN.md, build 1): the controller hands it each moment's list as it hands the log (moment()), and it
//     reads it into plain terms (soundsOf: one entry a sound, { kind, material, weight }), which the player plays in the world's
//     key and mode (ui/sound/sounds.js; content/music.js, sounds). Only what the screen already shows: a thing you get or lose
//     (its `material`), something eaten or drunk, a hurt (its weight by the hit) or a heal, a condition starting or ending (in the
//     colour of its echo), a door opening, closing, unlocking or refusing (locked), a container opening, a puzzle solved (the
//     engine's `solved` mark). Only while ♫ is on and the audio runs; never on a restore, UNDO, a load or a new game (the
//     controller hands it only moments played, as the reactions: ui/effects.js, reactionOf); a world with no music plays them in
//     the spec's key. While you sleep the controller holds the moment until you wake.
//   - Even loudness (docs/sound/PLAN.md, build 1b): every part plays at the gain the page's meter measured for it (ui/sound/loudness.js,
//     in the player); measured in the background when the audio starts and when a world plays, once per device (saved in its storage).
//
// The browser's rules (MUSIC.md §7):
//   - The audio is made and woken inside the ♫ tap: on.music() → redraw() → update() runs synchronously, nothing awaited.
//     With ♫ remembered on, a page loaded without a tap can't start it: the first tap or key anywhere does (and each redraw
//     tries, which is enough where the browser remembers an earlier tap).
//   - When the system takes the sound away while the page stays in view (a call, the player's own music: the context
//     `interrupted`, or suspended not by us), the piece tells the controller (on.musicStopped()) and ♫ shows off; the next ♫ tap
//     starts it again. It never resumes by itself.
//   - Leaving the page is never the system taking the sound: on iOS the context goes `interrupted` as you switch away, before the
//     page is hidden, so a context that stops is judged only after `LEAVING` ms, and not at all if by then the page is hidden or
//     gone (pagehide). A hidden tab suspends it, and a visible one (or pageshow) tries to resume it (the game clock pauses too);
//     ♫ stays on, and if it doesn't run again, the first tap or key anywhere starts it.
//     This lives here, in the game's piece, never in the player: the bench must not pause (a claude.ai artifact can look hidden
//     while it is in view).
//   - A dead context is replaced inside the tap: on iOS a context that was interrupted can stay `interrupted` or `suspended` for
//     good however often it is resumed. So in a tap (♫ turned on, or the first tap or key anywhere), a context that has run and
//     isn't running now (or is closed) is closed and a fresh one made, synchronously, with a fresh player that plays the room as
//     on arriving, the theme first. A context that has never run (made before any tap) is only resumed.
//   - ♫ off fades it out and then suspends the context: nothing runs while the music is off.

import S from "../content/music.js";
import { musicOf } from "../js/music.js";
import { parts } from "../js/time.js";
import { parseFilter } from "../js/filters.js";
import { createPlayer, openAudio } from "./sound/player.js";

// The death ending: the engine's own (`died`, when health runs out) or a world's ending of that name; or no health left.
const died = (state) => state.ending === "died" || state.player.health <= 0;
// How long a context that stopped by itself is given before it counts as the system taking the sound (ms): long enough for the
// page to say it is being left (iOS interrupts the context first).
const LEAVING = 1000;
// Night by the world's clock (ms since day 1, 00:00): from `from` o'clock to `to` (through midnight when from > to).
export function nightAt(ms) {
  const h = parts(ms).hour, { from, to } = S.reactions.night;
  return from > to ? h >= from || h < to : h >= from && h < to;
}

// How unwell the player is, from their health (S.reactions.unwell): 0 well, 1 unwell (at `at` and below), 2 worse (at `worse.at`).
export function unwellAt(health) {
  const U = S.reactions.unwell;
  return health <= U.worse.at ? 2 : health <= U.at ? 1 : 0;
}
// What the music does for the picture's filters on (S.reactions.filters): { wobble: true / false, echo: … }, each of the table's
// effects, on when a filter that maps to it is on ("tint:cold" is read as "tint").
export function effectsOf(filters = []) {
  const on = new Set(filters.map(f => S.reactions.filters[parseFilter(f).name]).filter(Boolean));
  return Object.fromEntries(Object.values(S.reactions.filters).map(e => [e, on.has(e)]));
}

// What a moment's list sounds like, in plain terms (docs/sound/PLAN.md, build 1: one entry a sound, in the list's order):
//   get / lose       a thing you now have, or no longer have (its `gained` / `lost` echo), with its material
//   eat / drink      a consumable thing gone out of play this moment (the engine's EAT and DRINK move it to nowhere; held, its
//                    `lost` echo is this, not a put down): drink when it has a `drink` line and no `eat` line, else eat
//   hurt / heal      a health echo: a hurt with its weight, the hit (how much health it took, from the health before the moment,
//                    `was`, echo by echo); a heal, at full health too (the green flash)
//   down / up / sideways   a condition's echo, by its colour (its `tone`: hurt, healed, neutral; js/conditions.js)
//   open / close / unlock  a door (a thing with `door`): set open or shut, or unlocked, with its material
//   lid              a container opened (set open, or unlocked), with its material
//   rattle           a locked door refusing: one of its own lines said (`shut`, its lock's `says`), or the stock "locked" with it
//                    in the room
//   solved           a puzzle solved (the engine's mark, never an ending's)
// `now` is the game after the moment, `was` before it (both read only); a thing's material is its own word, as written.
export function soundsOf(applied, now, was = now) {
  const things = now.world.objects, old = was.world.objects;
  const thing = (id) => things[id] ?? old[id] ?? {};
  const material = (id) => thing(id).material;
  const gone = new Set(applied.filter(e => "move" in e && e.to === null && thing(e.move).consumable === true).map(e => e.move));
  const lockedDoors = Object.entries(things).filter(([, o]) => o.door != null && o.locked === true && o.at === now.player.at);
  const refused = (e) => lockedDoors.find(([id, o]) => e.say === o.shut || e.say === o.lock?.says || (e.say === "@locked" && (!e.things || e.things.includes(id))));
  const out = [];
  let health = was.player.health;
  const level = (e) => (typeof e.level === "number" ? e.level : health);   // (a health echo's level: where it lands)
  for (const e of applied) {
    if ("echo" in e) {
      if (e.kind === "gained") out.push({ kind: "get", material: material(e.thing) });
      else if (e.kind === "lost" && !gone.has(e.thing)) out.push({ kind: "lose", material: material(e.thing) });
      else if (e.kind === "hurt") { const to = level(e); out.push({ kind: "hurt", weight: Math.max(1, health - to) }); health = to; }
      else if (e.kind === "healed") { out.push({ kind: "heal" }); health = level(e); }
      else if (e.kind === "condition") out.push({ kind: e.tone === "hurt" ? "down" : e.tone === "healed" ? "up" : "sideways" });
    } else if ("move" in e && gone.has(e.move)) {
      const o = thing(e.move);
      out.push({ kind: o.drink != null && o.eat == null ? "drink" : "eat" });
    } else if ("unlock" in e) {
      const o = thing(e.unlock);
      if (o.door != null) out.push({ kind: "unlock", material: o.material });
      else if (o.container) out.push({ kind: "lid", material: o.material });
    } else if (typeof e.set === "string" && /^[^.]+\.open$/.test(e.set) && things[e.set.split(".")[0]]) {
      const o = things[e.set.split(".")[0]];
      if (o.door != null && typeof e.to === "boolean") out.push({ kind: e.to ? "open" : "close", material: o.material });
      else if (o.container && e.to === true) out.push({ kind: "lid", material: o.material });
    } else if ("say" in e && refused(e)) out.push({ kind: "rattle", material: thing(refused(e)[0]).material });
    else if ("solved" in e) out.push({ kind: "solved" });
  }
  return out;
}

// The sounds a debug panel or a bench can try, each kind of the spec's table (a door opening or closing and eating: the version
// picked, `sounds.pick`), and the materials.
export const SOUND_KINDS = [...new Set([...Object.keys(S.sounds.moments), ...Object.keys(S.sounds.versions)])];
export const MATERIALS = Object.keys(S.sounds.materials).filter(m => m !== "generic");

// Set up the sound (it has no element). Returns update(), moment(), asleep(), clock(), leave() and `debug` (for the debug panel's
// Music section).
export function mount(on) {
  let ctx = null, player = null;
  let want = false;              // ♫, as last drawn
  let ours = false;              // the context was suspended by us (♫ off, a hidden tab, the game left): not the system
  let state = null;              // the game now (null: no game on the page)
  let asleep = false, hushed = false;
  let ended = false;             // the story's end has been followed (its ending played, or silence): nothing plays until it goes on
  let night = false;             // the world's clock is at night (clock())
  let music = null, sig = null;  // the world's music as read, and what it was read from (a signature of the state's music)
  let from = {};                 // the state's parts it was last read from, to read again only when one changes
  let playing = null;            // the signature the player was started with
  let rest = null;               // the timer that suspends the context once the music has faded out
  let ran = false;               // the context now has run (so, not running now, it is dead or ours: a tap replaces it)
  let verdict = null;            // the timer that judges a context that stopped by itself (LEAVING)
  let gone = false;              // the page is being left (pagehide), or hidden

  // The world's music, read again when the state's music or rooms change (a later change set may rewrite it).
  function read() {
    const rooms = state.world.rooms;
    if (from.music === state.music && from.rooms === rooms && from.id === state.worldId) return;
    from = { music: state.music, rooms, id: state.worldId };
    const own = Object.entries(rooms).filter(([, r]) => r?.music !== undefined).map(([id, r]) => [id, r.music]);
    const s = state.music == null ? null : JSON.stringify([state.worldId, state.music, own]);
    if (s !== sig) { sig = s; music = s ? musicOf(state).music : null; }
  }

  // The key the sounds play in: the world's music's, or the spec's for a world with none.
  const keyOf = () => (music ? { root: music.root, steps: music.steps } : S.sounds.key);

  // Make or wake the audio. In a tap (`tap`: ♫ turned on, the first tap or key anywhere), a context that has run and isn't running
  // now is not trusted: it is closed and a fresh one made, with a fresh player (iOS can leave an interrupted one dead for good).
  function wake(tap = false) {
    clearTimeout(rest);
    if (ctx && tap && ctx.state !== "running" && (ran || ctx.state === "closed")) {
      const old = ctx;
      player?.stop(0); player?.close(); player = null; playing = null; hushed = false;
      ctx = null; ran = false;
      old.close().catch(() => {});
    }
    if (!ctx) {
      const c = ctx = openAudio(); ours = false; ran = c.state === "running";
      c.addEventListener("statechange", () => {
        if (c !== ctx) return;                                   // a context replaced (closing): not ours to judge
        if (c.state === "running") { ours = false; ran = true; return; }
        if (ours || !want) return;
        clearTimeout(verdict);                                   // stopped by itself: the system, unless the page is being left
        verdict = setTimeout(() => { if (c === ctx && c.state !== "running" && !ours && want && !gone && !document.hidden) stopped(); }, LEAVING);
      });
    } else if (ctx.state !== "running") openAudio(ctx);
  }
  // The system took the sound: silence, and ♫ shows off (the controller redraws: update() then sees ♫ off).
  function stopped() {
    if (!want) return;
    player?.stop(0); playing = null;
    on.musicStopped();
  }
  // Fade out, then suspend the context (ours), unless ♫ came back on meanwhile.
  function quiet() {
    if (player?.playing) player.stop();
    playing = null;
    clearTimeout(rest);
    rest = setTimeout(() => { if (ctx?.state === "running" && !(want && state)) { ours = true; ctx.suspend(); } }, (S.master.off + 0.5) * 1000);
  }
  // Play what the state says: the world's music in this room; hushed while asleep; at night, lower and sparser; unwell, wobbling,
  // echoed as health and the filters say; at the end of the story, the ending once (not on a restore: `reason`, the redraw's),
  // then silence; when it goes on again, the music afresh.
  function follow(reason) {
    if (!want || !state || !ctx) return;
    read();
    player ??= createPlayer(ctx, S);                       // (made with no music too: its sounds still play)
    if (!music) { if (player.playing) player.stop(); playing = null; return; }   // a world with no music: no music
    if (asleep !== hushed) { hushed = asleep; player.hush(asleep); }
    player.night(night);
    if (state.ended) {
      if (!ended && player.playing) reason === "restore" ? player.stop() : player.ending({ death: died(state) });
      ended = true;
      return;
    }
    if (ended) { ended = false; playing = null; }          // the story goes on (a new game, UNDO): the music as on arriving
    player.unwell(unwellAt(state.player.health));
    for (const [effect, on] of Object.entries(effectsOf(state.filters))) player[effect](on);
    const room = state.player.at;
    if (playing !== sig || !player.playing) { player.play(music, room); playing = sig; }
    else player.room(room);
  }

  // With ♫ on but the audio not allowed to start yet (a page loaded without a tap, ♫ remembered on, or back on the page with the
  // context not running again), the first tap or key
  // anywhere starts it, whatever it does in the game (a dead context replaced: wake).
  const gesture = () => { if (want && state && ctx && ctx.state !== "running" && !document.hidden) { wake(true); follow(); } };
  for (const type of ["click", "keydown", "touchend"]) document.addEventListener(type, gesture, true);
  // Leaving the page: suspended (ours), ♫ untouched. Back: resumed if it will; if not, ♫ stays on and the first tap starts it.
  const away = () => { gone = true; if (ctx?.state === "running") { ours = true; ctx.suspend(); } };
  const back = () => { gone = false; if (ctx && want && state && ctx.state !== "running") ctx.resume().catch(() => {}); };
  document.addEventListener("visibilitychange", () => (document.hidden ? away() : back()));
  window.addEventListener("pagehide", away);
  window.addEventListener("pageshow", () => { if (!document.hidden) back(); });

  return {
    // ♫ switched, the room, the world's music, the end: follow them.
    update(prev, next, reason) {
      state = next.state;
      const tapped = next.music && !want;                       // ♫ turned on: a tap (or a page loaded with ♫ remembered on)
      if (next.music !== want) {
        want = next.music;
        if (!want) return quiet();
      }
      if (want && (!ctx || (ctx.state !== "running" && !document.hidden))) wake(tapped);
      follow(reason);
    },
    // A moment played (js/main.js: a command, the world on its own, a walk, the debug panel's; a sleep's once you wake): its list, as
    // the log gets it, `now` the game after it and `was` before. Its sounds, if ♫ is on and the audio runs.
    moment(applied, now, was) {
      if (!want || !player || ctx?.state !== "running" || !now) return;
      state = now; read();
      player.sounds(soundsOf(applied, now, was), keyOf());
    },
    // While you sleep (js/main.js, sleepThrough), and as you wake: the music fades out and back, the whole theme soon after.
    asleep(on) {
      const woke = asleep && !on;
      asleep = !!on; follow();
      if (woke && want && state && !state.ended && player?.playing) player.wake();
    },
    // The world's time now (ms; the title bar's: js/main.js, showTime): night or day for the music.
    clock(ms) {
      const n = nightAt(ms);
      if (n === night) return;
      night = n;
      if (want && player) player.night(n);
    },
    // The game is left (the list of games shows): silence until a game is drawn again.
    leave() { state = null; asleep = false; ended = false; quiet(); },
    // For the debug panel's Music section: what plays, the theme now, the reactions tried (the ending, the death ending, waking:
    // the player's alone, the game untouched), and the lines, the tone or the theme muted.
    debug: {
      info: () => (player && want ? player.info() : null),
      theme: () => player?.theme() ?? null,
      ending: (death) => player?.ending({ death }) ?? null,
      wake: () => player?.wake() ?? false,
      mute: (part, on) => player?.mute(part, on),
      muted: () => player?.muted() ?? { lines: false, tone: false, theme: false },
      // A sound tried (the player's alone: the game untouched), in this world's key: { kind, material, weight }; the kinds and the
      // materials there are to try.
      sound: (s) => { if (want && player && state) { read(); player.sounds([s], keyOf()); } },
      kinds: SOUND_KINDS, materials: MATERIALS,
      // The measuring (ui/sound/loudness.js): this world's parts and the shared ones, with what the meter has of each.
      loudness: () => (player && state ? (read(), player.parts(music, [state.player.at, ...Object.keys(music?.rooms ?? {})])) : [])
    }
  };
}
