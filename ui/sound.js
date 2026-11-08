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
//
// The browser's rules (MUSIC.md §7):
//   - The audio is made and woken inside the ♫ tap: on.music() → redraw() → update() runs synchronously, nothing awaited.
//     With ♫ remembered on, a page loaded without a tap can't start it: the first tap or key anywhere does (and each redraw
//     tries, which is enough where the browser remembers an earlier tap).
//   - When the system takes the sound away (a call, the player's own music: the context `interrupted`, or suspended not by us),
//     the piece tells the controller (on.musicStopped()) and ♫ shows off; the next ♫ tap starts it again. It never resumes by itself.
//   - A hidden tab suspends it, and a visible one resumes it (the game clock pauses too); if it doesn't run again, ♫ shows off.
//     This lives here, in the game's piece, never in the player: the bench must not pause (a claude.ai artifact can look hidden
//     while it is in view).
//   - ♫ off fades it out and then suspends the context: nothing runs while the music is off.

import S from "../content/music.js";
import { musicOf } from "../js/music.js";
import { parts } from "../js/time.js";
import { createPlayer, openAudio } from "./sound/player.js";

// The death ending: the engine's own (`died`, when health runs out) or a world's ending of that name; or no health left.
const died = (state) => state.ending === "died" || state.player.health <= 0;
// Night by the world's clock (ms since day 1, 00:00): from `from` o'clock to `to` (through midnight when from > to).
export function nightAt(ms) {
  const h = parts(ms).hour, { from, to } = S.reactions.night;
  return from > to ? h >= from || h < to : h >= from && h < to;
}

// Set up the sound (it has no element). Returns update(), asleep(), clock(), leave() and `debug` (for the debug panel's Music
// section).
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

  // The world's music, read again when the state's music or rooms change (a later change set may rewrite it).
  function read() {
    const rooms = state.world.rooms;
    if (from.music === state.music && from.rooms === rooms && from.id === state.worldId) return;
    from = { music: state.music, rooms, id: state.worldId };
    const own = Object.entries(rooms).filter(([, r]) => r?.music !== undefined).map(([id, r]) => [id, r.music]);
    const s = state.music == null ? null : JSON.stringify([state.worldId, state.music, own]);
    if (s !== sig) { sig = s; music = s ? musicOf(state).music : null; }
  }

  // Make or wake the audio (inside a tap, when there is one).
  function wake() {
    clearTimeout(rest);
    if (!ctx) {
      ctx = openAudio();
      ctx.addEventListener("statechange", () => {
        if (ctx.state === "running") ours = false;
        else if (!ours && want) stopped();                     // the system took the sound away
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
  // Play what the state says: the world's music in this room; hushed while asleep; at night, lower and sparser; at the end of the
  // story, the ending once (not on a restore: `reason`, the redraw's), then silence; when it goes on again, the music afresh.
  function follow(reason) {
    if (!want || !state || !ctx) return;
    read();
    if (!music) { if (player?.playing) player.stop(); playing = null; return; }   // a world with no music: nothing
    player ??= createPlayer(ctx, S);
    if (asleep !== hushed) { hushed = asleep; player.hush(asleep); }
    player.night(night);
    if (state.ended) {
      if (!ended && player.playing) reason === "restore" ? player.stop() : player.ending({ death: died(state) });
      ended = true;
      return;
    }
    if (ended) { ended = false; playing = null; }          // the story goes on (a new game, UNDO): the music as on arriving
    const room = state.player.at;
    if (playing !== sig || !player.playing) { player.play(music, room); playing = sig; }
    else player.room(room);
  }

  // With ♫ on but the audio not allowed to start yet (a page loaded without a tap, ♫ remembered on), the first tap or key
  // anywhere starts it, whatever it does in the game.
  const gesture = () => { if (want && state && ctx && ctx.state !== "running" && !document.hidden) { wake(); follow(); } };
  for (const type of ["click", "keydown", "touchend"]) document.addEventListener(type, gesture, true);
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) { if (ctx.state === "running") { ours = true; ctx.suspend(); } }
    else if (want && state) ctx.resume().then(() => { if (ctx.state !== "running") stopped(); }, stopped);
  });

  return {
    // ♫ switched, the room, the world's music, the end: follow them.
    update(prev, next, reason) {
      state = next.state;
      if (next.music !== want) {
        want = next.music;
        if (!want) return quiet();
      }
      if (want && (!ctx || (ctx.state !== "running" && !document.hidden))) wake();
      follow(reason);
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
      muted: () => player?.muted() ?? { lines: false, tone: false, theme: false }
    }
  };
}
