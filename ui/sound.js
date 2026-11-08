// Sound: the world's music, drawn from the state like the picture (MUSIC.md §5–§7; ARCHITECTURE.md §7, "Music"). With ♫ on
// it plays the world's music (state.music, read by js/music.js) in the room you are in, crossfading as you move; the end of the
// story and sleep fade it out and back (their own reactions come later: docs/music/PLAN.md, stage 5). A world with no music
// plays nothing. It decides nothing about the game, never touches the state, and its randomness (the player's: ui/sound/) is
// never the game's. The sound itself is ui/sound/player.js, shared with the test bench; this piece only follows the game.
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
import { createPlayer, openAudio } from "./sound/player.js";

// Set up the sound (it has no element). Returns update(), asleep(), leave() and `debug` (for the debug panel's Music section).
export function mount(on) {
  let ctx = null, player = null;
  let want = false;              // ♫, as last drawn
  let ours = false;              // the context was suspended by us (♫ off, a hidden tab, the game left): not the system
  let state = null;              // the game now (null: no game on the page)
  let asleep = false, hushed = false;
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
  // Play what the state says: the world's music in this room, hushed at the end of the story and while asleep.
  function follow() {
    if (!want || !state || !ctx) return;
    read();
    if (!music) { if (player?.playing) player.stop(); playing = null; return; }   // a world with no music: nothing
    player ??= createPlayer(ctx, S);
    const room = state.player.at;
    if (playing !== sig || !player.playing) { player.play(music, room); playing = sig; }
    else player.room(room);
    const hush = !!state.ended || asleep;
    if (hush !== hushed) { hushed = hush; player.hush(hush); }
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
    update(prev, next) {
      state = next.state;
      if (next.music !== want) {
        want = next.music;
        if (!want) return quiet();
      }
      if (want && (!ctx || (ctx.state !== "running" && !document.hidden))) wake();
      follow();
    },
    // While you sleep (js/main.js, sleepThrough), and as you wake: the music fades out and back.
    asleep(on) { asleep = !!on; follow(); },
    // The game is left (the list of games shows): silence until a game is drawn again.
    leave() { state = null; asleep = false; quiet(); },
    // For the debug panel's Music section: what plays, the theme now, and the lines, the tone or the theme muted.
    debug: {
      info: () => (player && want ? player.info() : null),
      theme: () => player?.theme() ?? null,
      mute: (part, on) => player?.mute(part, on),
      muted: () => player?.muted() ?? { lines: false, tone: false, theme: false }
    }
  };
}
