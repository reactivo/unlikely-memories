// The player (MUSIC.md §5): a world's music played from what js/music.js reads, with the engine's frame. Scenes (a room's lines,
// tone and colour, crossfaded from the room before), the lines' scheduler on the audio clock, the theme's schedule and its turns
// (whole, question, whole, answer), comes and goes, the reactions (an ending, waking, night, unwell, the wobble and the echo), the
// sounds, and the frame itself (the low-pass, the compressor, the reverb, the limiter, the shared pitch every note follows).
// Plain functions of an AudioContext: no globals, no knowledge of the game (it is given a world's music and a room, never the
// state; it is told "an ending", "a death", "night", "awake", "unwell", "wobble", "echo", never why), so the test bench
// (tools/music/) plays exactly what the game plays. It never pauses by itself when the page looks hidden: the game's piece
// (ui/sound.js) does that, the bench must not (MUSIC.md §7). Every number is the spec's (content/music.js).
//
// Two halves:
//   createClockwork(S, random) — what plays when, as numbers: pure, no audio, driven by a clock it is given (tests/sound.test.js).
//   createPlayer(ctx, S, opts) — the clockwork made sound: { play(music, room), room(id), stop(fade), theme(), hush(on),
//                                ending({ death }), wake(), night(on), unwell(level), wobble(on), echo(on), mute(part, on), muted(),
//                                comes(on), volume(part, v), hear(music, name), sounds(list, key), info(), level() }
//                                Every part plays at the gain its level gives (MUSIC.md §6c: the shared levels, content/levels.js,
//                                and the world's, its music's `levels`), worked out as it is first played; nothing is measured here.
//   pitchOf(level, wobble, S) — the shared pitch for a level of unwell and the wobble, as numbers (cents, Hz).
//   levelsOf(S, music) — the levels a world's parts play at (the shared and its own), and which of its parts have none.
// And openAudio(ctx): the AudioContext made or woken inside a tap (the rules browsers set: MUSIC.md §7).

import { sceneOf, themePart, freqOf, variant, shiftOctave } from "../../js/music.js?v=0.50.1";
import { makeKit, playEvent, note, gain, filt, chain } from "./synth.js?v=0.50.1";
import { makeTone } from "./tones.js?v=0.50.1";
import { makeColour } from "./colours.js?v=0.50.1";
import { playSounds } from "./sounds.js?v=0.50.1";
import { createLevels } from "./loudness.js?v=0.50.1";
import { instrumentPart, tonePart, colourPart, soundParts, soundId, musicParts } from "./parts.js?v=0.50.1";
import SHARED from "../../content/levels.js?v=0.50.1";

// ---- The clockwork: what plays when ------------------------------------------------------------------------------------------

// A scene's lines, ready to play from t0: each starts at its first note (not a rest), one after another `stagger` apart, so
// something sounds at once. A line with nothing sounding is left out (it would only be silence). Each is the k-th, on its first
// pass (once round the line), not quiet.
export function linesFrom(lines, t0, S) {
  return lines.filter(l => l.sounding).map((line, k) => {
    let i = 0;
    while (line.events[i].rest) i++;
    return { line, k, i, next: t0 + S.scene.first + k * S.scene.stagger, pass: 0, quiet: false, played: [] };
  });
}

// The events of a line due before `ahead`, each at its time; the line's place moves on (it loops at its own length). Each time
// round is a pass: as one begins, `quiet(cursor)` says whether the line sits it out (night's thinning), and a quiet pass's events
// go by unplayed. Whole passes, so a line that plays keeps its shape. An event due before `late` goes by unplayed too: after the
// page was held up (a phone busy elsewhere, a timer paused), the line takes up where it should be instead of playing all it missed
// at once.
export function due(cursor, ahead, beat, quiet = () => false, late = -Infinity) {
  const out = [], { line } = cursor;
  while (cursor.next < ahead) {
    const e = line.events[cursor.i];
    if (!cursor.quiet && cursor.next >= late) {
      out.push({ e, i: cursor.i, t: cursor.next, beats: e.beats });
      cursor.played.push({ t: cursor.next, i: cursor.i }); if (cursor.played.length > 8) cursor.played.shift();
    }
    cursor.next += e.beats * beat;
    cursor.i = (cursor.i + 1) % line.events.length;
    if (cursor.i === 0) { cursor.pass++; cursor.quiet = quiet(cursor); }
  }
  return out;
}

// Comes and goes (MUSIC.md §2.8): resting (only the room tone) for `off` seconds after each `on` seconds of music, from `start`.
export const restingAt = (now, start, C) => (now - start) % (C.on + C.off) >= C.on;

// A part of the theme from t0: its notes, and its chords under the same stretch of it (they don't loop), each at its time;
// and when it ends.
export function themeTimes(mel, part, t0, beat) {
  const { from, to } = themePart(mel, part);
  const b0 = mel.events.slice(0, from).reduce((a, e) => a + e.beats, 0), notes = [], chords = [];
  let at = b0;
  for (let i = from; i < to; i++) { const e = mel.events[i]; notes.push({ e, i, t: t0 + (at - b0) * beat, beats: e.beats }); at += e.beats; }
  const b1 = at;
  if (mel.chords) {
    at = 0;
    mel.chords.events.forEach((e, i) => {
      if (at >= b0 && at < b1) chords.push({ e, i, t: t0 + (at - b0) * beat, beats: Math.min(e.beats, b1 - at) });
      at += e.beats;
    });
  }
  return { notes, chords, end: t0 + (b1 - b0) * beat };
}

// The pitch every note follows (S.reactions): unwell (level 1 or 2) sits `detune` cents flat with a slow drift; the wobble sways
// it ± `depth` cents. As numbers: { flat, drift: [rate, depth], wobble: [rate, depth], glide: { flat, wobble } }; all 0 when well
// and steady (and at an ending, whose theme is as written).
export function pitchOf(level, wobble, S) {
  const U = S.reactions.unwell, W = S.reactions.wobble;
  return { flat: level ? U.detune : 0, drift: [U.drift[0], level ? U.drift[1] : 0], wobble: [W.rate, wobble ? W.depth : 0],
           glide: { flat: U.glide, wobble: W.glide } };
}

// What plays when, from a clock it is given (seconds): the scene (a room's music), its lines as they come due, the theme a few
// seconds after the start, after a rest and every 100 to 160 s between, and comes and goes; and the reactions it is told of
// (S.reactions): an ending (the whole theme once, then nothing), waking (the whole theme first), night (the lines thinned, the
// theme lower), unwell (level 1: the lines thinned as at night; level 2: the theme slower and lower too; the detune is the
// player's, from `pitch`), the wobble (only the pitch) and the echo (the theme's tune again a beat late). Each line changes from
// its next pass, the theme from its next turn; an ending's theme is untouched by any of them. `random` is the player's own (the
// gaps between themes), never the game's.
export function createClockwork(S, random = Math.random) {
  let music = null, scene = null, theme = null, themeNext = Infinity, count = 0, cycle = 0, resting = false, comes = true;
  let night = false, ended = null, wakePart = null, unwell = 0, wobble = false, echo = false;
  const parts = S.theme.parts, R = S.reactions;
  // At night, or unwell, a line sits out all but one pass in `every`, each line in its turn (so they don't all fall quiet
  // together); both at once thin it no further than the sparser of the two.
  const every = () => Math.max(night ? R.night.every : 1, unwell ? R.unwell.every : 1);
  const thin = (c) => { const n = every(); return n > 1 && (c.pass + c.k) % n !== 0; };
  const sceneAt = (roomId, now) => {
    const sc = sceneOf(music, roomId), t0 = now + S.scene.lead, lines = linesFrom(sc.lines, t0, S);
    for (const l of lines) l.quiet = thin(l);
    return { id: roomId, sc, t0, lines, share: 1 / Math.sqrt(Math.max(1, sc.lines.length)), box: sc.colour === "music_box" };
  };
  const clock = {
    get music() { return music; },
    get scene() { return scene; },
    get theme() { return theme; },                 // the theme last played: { room, label, how, part, mel, notes, chords, end }
    get themeNext() { return themeNext; },
    get nextPart() { return wakePart ?? parts[count % parts.length]; },
    get resting() { return resting; },
    get night() { return night; },
    get ended() { return ended; },                 // the ending under way: { death, lines, at, theme, over, played, done }, or null
    get unwell() { return unwell; },               // 0 well, 1 unwell, 2 worse
    get wobble() { return wobble; },
    get echo() { return echo; },
    // The pitch every note follows now (pitchOf): steady at an ending, whatever it was told.
    get pitch() { return ended ? pitchOf(0, false, S) : pitchOf(unwell, wobble, S); },
    // A world's music starts in a room: its theme from the first turn, `first` seconds from now.
    start(m, roomId, now) { music = m; theme = null; count = 0; ended = null; wakePart = null; themeNext = now + S.theme.first; scene = sceneAt(roomId, now); return scene; },
    // Another room: a new scene; the theme's schedule goes on. (Not once the story has ended: the ending plays on.)
    room(roomId, now) { if (!ended) scene = sceneAt(roomId, now); return scene; },
    // Comes and goes on or off, its cycle from now (a fresh start: not resting).
    comes(on, now) { comes = on; cycle = now; },
    stop() { music = null; scene = null; theme = null; themeNext = Infinity; resting = false; ended = null; wakePart = null; },
    // Night on or off: each line from its next pass, the theme from its next turn.
    setNight(on) { night = !!on; },
    // Unwell (0, 1, 2), the wobble, the echo: the lines from each one's next pass, the theme from its next turn, the pitch as the
    // player glides it.
    setUnwell(level) { unwell = Math.max(0, Math.min(2, level | 0)); },
    setWobble(on) { wobble = !!on; },
    setEcho(on) { echo = !!on; },
    // The story has ended: the lines go on for `out` seconds (fading), then after a breath the world's whole theme, as written
    // (a death: as its variant plays it, an octave lower), with its chords, once; then `done`. Nothing else is due after it.
    end(now, death = false) {
      if (!music || !scene || ended) return ended;
      const E = R.ending, at = now + E.out + E.breath, m = music.melody;
      let th = null;
      if (m) {
        const mel = death ? shiftOctave(variant(m, E.death.variant), E.death.octave) : m;
        th = { room: scene.id, label: death ? "the theme, at a death" : "the theme, at the ending", how: death ? "death" : "ending", part: "whole", mel,
               ...themeTimes(mel, "whole", at, music.beat) };
      }
      ended = { death: !!death, lines: now + E.out, at, theme: th, over: th ? th.end : at, played: false, done: false };
      themeNext = Infinity; resting = false; wakePart = null;
      return ended;
    },
    // Awake again (after a sleep): out of any rest, the comes-and-goes cycle from now, and the whole theme `sleep.theme` seconds
    // from now, then its turns as before. → false once the story has ended (nothing to wake).
    wake(now) {
      if (!scene || ended) return false;
      resting = false; cycle = now; themeNext = now + R.sleep.theme; wakePart = "whole";
      return true;
    },
    // The theme now (its next turn, or the whole after waking), in the room's way (as written, a variant, or its own tune); worse
    // than unwell, slower (once: a room's slower variant stays as it is); an octave down at night or worse than unwell (one in
    // all, never two); with the echo, its tune again a beat late (`echo`: { after, level }, or null); null when there is none.
    playTheme(now) {
      const th = scene?.sc.theme;
      if (!th || ended) return null;
      const part = wakePart ?? parts[count % parts.length], V = R.unwell.worse, worse = unwell >= 2;
      let mel = worse && th.how !== V.variant ? variant(th.mel, V.variant) : th.mel;
      const down = Math.min(night ? R.night.octave : 0, worse ? V.octave : 0);
      if (down) mel = shiftOctave(mel, down);
      const plan = themeTimes(mel, part, now + S.theme.lead, music.beat);
      const why = [worse && "slower and lower (unwell)", night && !worse && "lower (night)", echo && "echoed"].filter(Boolean);
      theme = { room: scene.id, label: th.label + why.map(w => ", " + w).join(""), how: th.how, part, mel, ...plan,
                echo: echo ? { after: R.echo.beats * music.beat, level: R.echo.level } : null };
      if (wakePart) wakePart = null; else count++;
      themeNext = plan.end + S.theme.gap[0] + random() * (S.theme.gap[1] - S.theme.gap[0]);
      return theme;
    },
    // Everything due by now + `ahead`: { notes: [{ line, e, i, t, beats }], rest: true / false when the music goes or comes
    // back (undefined: no change), theme: a part of the theme starting now (or soon, at an ending), or null, over: true once,
    // when an ending's theme has ended (silence from now) }.
    advance(now) {
      const out = { notes: [], rest: undefined, theme: null }, ahead = now + S.scene.ahead;
      if (scene && !(ended && now >= ended.lines))
        for (const l of scene.lines) for (const n of due(l, ahead, music.beat, thin, now - S.scene.late)) out.notes.push({ line: l.line, ...n });
      if (ended) {
        if (ended.theme && !ended.played && ahead >= ended.at) { ended.played = true; out.theme = theme = ended.theme; }
        if (!ended.done && now >= ended.over) { ended.done = true; out.over = true; }
        return out;
      }
      const want = comes && restingAt(now, cycle, S.comes);
      if (want !== resting) { resting = want; out.rest = want; if (!want) themeNext = now + S.theme.back; }
      if (!resting && scene && now >= themeNext && !(theme && now < theme.end)) out.theme = clock.playTheme(now);
      return out;
    }
  };
  return clock;
}

// ---- The audio -------------------------------------------------------------------------------------------------------------------

// An iPhone or iPad (an iPad says "Macintosh" and has a touch screen).
const appleMobile = () => typeof navigator !== "undefined" &&
  (/iPhone|iPad/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

// The AudioContext, made (or woken) inside a tap: synchronously, nothing awaited before it (MUSIC.md §7). On an iPhone or iPad the
// music plays through the silent switch (MUSIC.md §2.7: `playback`, where Safari has `navigator.audioSession`), set before the page's
// first context of any kind (nothing else makes one: the game measures nothing while it plays); a one-sample buffer unlocks iOS.
// Returns the context (`existing` if given).
export function openAudio(existing) {
  let ctx = existing;
  if (!ctx) {
    if (appleMobile() && navigator.audioSession) { try { navigator.audioSession.type = "playback"; } catch (e) {} }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const b = ctx.createBuffer(1, 1, ctx.sampleRate), sb = ctx.createBufferSource(); sb.buffer = b; sb.connect(ctx.destination); sb.start();
  if (ctx.state !== "running") ctx.resume().catch(() => {});      // (whether it runs is the caller's to watch: ctx.state)
  return ctx;
}

// The levels a world's parts play at: its own (its music's `levels`, written when the world was made) and the shared ones
// (content/levels.js), the world's first. A world with no music: the shared ones alone. `missing` lists the world's parts with no
// level (there should be none: each plays as written), worked out only when asked.
export function levelsOf(S, music = null) {
  const levels = createLevels(S, music?.levels, SHARED.parts);
  return { ...levels, missing: () => (music ? musicParts(S, music, Object.keys(music.rooms)).filter(p => !levels.has(p.key) || (p.ref && !levels.has(p.ref))).map(p => p.label) : []) };
}

// The player on a context. opts.comes: comes and goes on (the game) or off (the bench's default); opts.random: the player's own;
// opts.buses: the music's, the room tone's and the sounds' gains to start at (the game's: the sound panel's sliders, ui/soundpanel.js; default the spec's).
export function createPlayer(ctx, S, { comes = true, random = Math.random, buses = S.buses } = {}) {
  const kit = makeKit(ctx, S);

  // ---- The frame, made once: mix → low-pass → compressor → hush → master → out → limiter → speakers. The echo from the mix back
  // into the low-pass; the music through the gate (comes and goes) into the mix, the room tone straight in. The sounds on a bus of
  // their own, through their own low-pass, straight to `out`: heard whether the music plays or not (a world with no music, after an
  // ending), never hushed (they come after waking) nor faded with the music. The limiter (S.loudness.limiter) only so stacked sounds
  // never clip.
  const master = gain(ctx, 0), hushed = gain(ctx, 1), out = gain(ctx, 1);
  const lp = filt(ctx, "lowpass", S.lowpass.frequency, S.lowpass.q);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = S.compressor.threshold; comp.ratio.value = S.compressor.ratio;
  const L = S.loudness.limiter, limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = L.threshold; limiter.knee.value = L.knee; limiter.ratio.value = L.ratio; limiter.attack.value = L.attack; limiter.release.value = L.release;
  chain(lp, comp, hushed, master, out, limiter); limiter.connect(ctx.destination);
  let scope = null;                                          // the level meter (level(), the music bench's only): made on its first call, not kept running for nothing
  const sfx = gain(ctx, buses.sounds); chain(sfx, filt(ctx, "lowpass", S.sounds.lowpass, S.lowpass.q), out);
  const mix = gain(ctx, 1); mix.connect(lp);
  const R = S.reverb, len = Math.floor(ctx.sampleRate * R.seconds), ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, R.decay); }
  const rev = ctx.createConvolver(); rev.buffer = ir; const wet = gain(ctx, R.wet);
  mix.connect(rev); rev.connect(wet); wet.connect(lp);
  const gate = gain(ctx, 1); gate.connect(mix);
  const musicBus = gain(ctx, buses.music); musicBus.connect(gate);
  const toneBus = gain(ctx, buses.tone); toneBus.connect(mix);

  // ---- The pitch every note follows (pitchOf): a steady offset (unwell's detune), a very slow drift and the wobble, summed into
  // each note's detune (synth.js, note: kit.pitch).
  const flat = ctx.createConstantSource(); flat.offset.value = 0; flat.start();
  const pitch = gain(ctx, 1); flat.connect(pitch);
  const drift = gain(ctx, 0), wob = gain(ctx, 0);
  lfoOf(S.reactions.unwell.drift[0], drift); lfoOf(S.reactions.wobble.rate, wob);
  drift.connect(pitch); wob.connect(pitch);
  kit.pitch = pitch;
  function lfoOf(rate, to) { const o = ctx.createOscillator(); o.frequency.value = rate; o.connect(to); o.start(); return o; }
  let pitched = "";                                          // the pitch last glided to (so a redraw doesn't restart the glide)
  function retune() {
    const p = clock.pitch, key = JSON.stringify(p);
    if (key === pitched) return;
    pitched = key;
    fadeTo(flat.offset, p.flat, p.glide.flat); fadeTo(drift.gain, p.drift[1], p.glide.flat); fadeTo(wob.gain, p.wobble[1], p.glide.wobble);
  }
  const fadeTo = (param, v, secs) => { const t = ctx.currentTime; param.cancelScheduledValues(t); param.setValueAtTime(param.value, t); param.linearRampToValueAtTime(v, t + secs); };

  // ---- Levels (MUSIC.md §6c): each part's gain from its level, worked out once as it is first played (a part with none: 1, as
  // written). A note's gain goes into its share; a colour's and a room tone's set their own output.
  let levels = levelsOf(S), gains = new Map();
  const gainOf = (key, part) => { if (!gains.has(key)) gains.set(key, levels.gain(part()) ?? 1); return gains.get(key); };
  const instGain = (music, name, octave, box) => gainOf(`${name} ${octave}${box ? " box" : ""}`, () => instrumentPart(S, music, music.instruments[name], octave, box, name));
  const soundGain = (p, key) => { const id = soundId(p); return gainOf(`sound ${key.root} ${key.steps} ${id}`, () => soundParts(S, key).get(id) ?? { key: "" }); };
  let told = null;                                           // what the levels are, for info (worked out when first asked)
  function useLevels(music) { if (levels.music !== music) { levels = { ...levelsOf(S, music), music }; gains = new Map(); told = null; } }
  const levelsInfo = () => (told ??= { own: Object.keys(levels.music?.levels ?? {}).length, shared: Object.keys(SHARED.parts).length, missing: levels.missing() });

  // The most the limiter has pulled down, in dB (info: it should barely act), from `settle` s after the player is made: Chromium's
  // compressor reports a large reduction as it starts, whatever it is given (a quiet sine alone: -16 dB, back to 0 within 2 s).
  let deepest = 0;
  const settle = ctx.currentTime + 3;
  const reduction = () => (typeof limiter.reduction === "number" ? limiter.reduction : limiter.reduction?.value ?? 0);   // (old Safari: a param)

  const clock = createClockwork(S, random);
  const mutes = { lines: false, tone: false, theme: false };
  let current = null, timer = null, playing = false, comesOn = comes, hushOn = false;
  let lastSounds = null;                                     // the sounds last played: { kinds, at } (info: the debug panel's)

  // ---- Scenes: a room's sound, its buses (the lines and the theme through the colour, the tone apart), faded in over the crossfade.
  function startScene(scene) {
    const t0 = scene.t0, C = S.scene.crossfade, sc = scene.sc, m = clock.music;
    const bus = gain(ctx, 0), lines = gain(ctx, mutes.lines ? 0 : 1), theme = gain(ctx, mutes.theme ? 0 : 1);
    const tbus = gain(ctx, 0), tone = gain(ctx, mutes.tone ? 0 : 1);
    const colour = makeColour(kit, sc.colour, S.colours[sc.colour] ? gainOf("colour " + sc.colour, () => colourPart(S, sc.colour)) : 1);
    lines.connect(bus); theme.connect(bus); bus.connect(colour.input); colour.output.connect(musicBus);
    tbus.connect(tone); tone.connect(toneBus);
    for (const b of [bus, tbus]) { b.gain.setValueAtTime(0, t0); b.gain.linearRampToValueAtTime(1, t0 + C); }
    wet.gain.setTargetAtTime(S.space[sc.tone] ?? S.spaceDefault, t0, R.follow);
    const room = makeTone(kit, sc.tone, tbus, S.tones[sc.tone] && sc.tone !== "silence" ? gainOf("tone " + sc.tone, () => tonePart(S, sc.tone)) : 1);
    return { scene, bus, lines, theme, tbus, tone, room, colour, toneTo: t0, music: m };
  }
  function stopScene(a, fade) {
    const t = ctx.currentTime, P = S.scene;
    a.gone = t + fade;                                       // silent from then
    for (const b of [a.bus, a.tbus]) { b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(0, t + fade); }
    a.room.stop(t + fade + P.toneStop); a.colour.stop(t + fade + P.colourStop);
    setTimeout(() => { for (const n of [a.bus, a.tbus, a.lines, a.theme, a.tone]) n.disconnect(); a.colour.close(); a.room.close(); }, (fade + P.release) * 1000);
  }
  // One event of a line or the theme, at its instrument's gain at that octave (as the music box plays it, in a music box's room).
  // The lines keep to a budget: at most `scene.voices` of their notes sounding at once (a phone's share of nodes); past it a line's
  // note is let go. The shipped worlds never reach it; a world written with very many long notes could.
  const voices = { ends: [], peak: 0, over: 0 };
  function playOne(a, dest, name, e, octave, t, beats, share, line = false) {
    const m = a.music, box = a.scene.box, V = voices;
    if (line) {
      V.ends = V.ends.filter(x => x > ctx.currentTime);
      if (V.ends.length >= S.scene.voices) { V.over++; return; }
    }
    const ends = playEvent(kit, dest, m, m.instruments[name], e, octave, t, beats, share * instGain(m, name, octave, box), box);
    if (line) { V.ends.push(...ends); V.peak = Math.max(V.peak, V.ends.length); }
  }
  // A part of the theme, on the scene's theme bus, its chords under it. Its notes wait (`waiting`, in time order) until they are due
  // within `ahead`, as the lines' do: a theme lasts up to a minute, and made all at once it was hundreds of nodes at a time. A note of
  // a scene that has faded out by its time is let go (it would be silent).
  let waiting = [];
  function sound(th) {
    const a = current, mel = th.mel, c = mel.chords, add = (name, n, octave, t, share) => waiting.push({ a, name, e: n.e, octave, t, beats: n.beats, share });
    for (const n of th.notes) add(mel.play, n, mel.octave, n.t, 1);
    if (th.echo) for (const n of th.notes) add(mel.play, n, mel.octave, n.t + th.echo.after, th.echo.level);
    if (c) for (const n of th.chords) add(c.play, n, c.octave, n.t, S.theme.chords);
    waiting.sort((x, y) => x.t - y.t);
  }
  function release(until) {
    let i = 0;
    for (; i < waiting.length && waiting[i].t < until; i++) {
      const w = waiting[i];
      if (!(w.a.gone < w.t)) playOne(w.a, w.a.theme, w.name, w.e, w.octave, w.t, w.beats, w.share);
    }
    if (i) waiting = waiting.slice(i);
  }
  // The scheduler, every `every` ms: what is due, made sound.
  function tick() {
    if (!current) return;
    const now = ctx.currentTime, due = clock.advance(now), sc = current.scene, ahead = now + S.scene.ahead;
    for (const n of due.notes) playOne(current, current.lines, n.line.play, n.e, n.line.octave, n.t, n.beats, sc.share, true);
    if (now > settle) deepest = Math.min(deepest, reduction());
    if (current.toneTo < ahead) { const a = Math.max(current.toneTo, now); current.room.tick(a, ahead); current.colour.tick(a, ahead); current.toneTo = ahead; }
    if (due.rest !== undefined) gate.gain.setTargetAtTime(due.rest ? 0 : 1, now, S.comes.fade);
    if (due.theme) sound(due.theme);
    release(ahead);
    if (due.over) stop(S.reactions.ending.after);            // the ending's theme is over: silence (until play() again)
  }
  // Silence, fading out.
  function stop(fade = S.master.off) {
    if (!playing) return;
    playing = false;
    clearInterval(timer); timer = null;
    fadeTo(master.gain, 0, fade);
    if (current) stopScene(current, fade);
    release(Infinity);                                       // (what is heard as it fades out)
    current = null; clock.stop();
  }
  // The comes-and-goes gate open again (an ending's theme and waking are heard even if the music was resting).
  const ungate = () => { const t = ctx.currentTime; gate.gain.cancelScheduledValues(t); gate.gain.setTargetAtTime(1, t, S.comes.fade); };
  // The master up, if it is down (play, or the bench's Hear while stopped).
  const up = (t) => { master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(S.master.level, t); };

  return {
    ctx,
    get playing() { return playing; },
    // A world's music, from a room: from silence, or crossfaded from what plays (another world, or the same one read again).
    play(music, roomId) {
      const now = ctx.currentTime;
      if (!playing) {
        playing = true; up(now);
        clock.comes(comesOn, now); gate.gain.cancelScheduledValues(now); gate.gain.setValueAtTime(1, now);
      }
      if (current) stopScene(current, S.scene.crossfade);
      useLevels(music);
      current = startScene(clock.start(music, roomId, now));
      retune();
      clearInterval(timer); timer = setInterval(tick, S.scene.every); tick();
    },
    // Another room of the same world: crossfaded.
    room(roomId) {
      if (!playing || clock.ended || clock.scene?.id === roomId) return;
      stopScene(current, S.scene.crossfade);
      current = startScene(clock.room(roomId, ctx.currentTime));
      tick();
    },
    // Silence, fading out.
    stop,
    // The theme now (its next turn), unless it is playing already. → the part played, or null.
    theme() {
      if (!playing || (clock.theme && ctx.currentTime < clock.theme.end)) return null;
      const th = clock.playTheme(ctx.currentTime);
      if (th) { sound(th); release(ctx.currentTime + S.scene.ahead); }
      return th;
    },
    // Everything faded out (sleep) and back in; the music goes on underneath.
    hush(on) { const H = S.reactions.sleep; hushOn = !!on; fadeTo(hushed.gain, on ? 0 : 1, on ? H.out : H.back); },
    // An ending (S.reactions.ending): the lines fade out, the room tone with the picture, then the world's whole theme once (a
    // death: slower and lower), then silence; play() starts the music again. → the ending (clockwork, end), or null.
    ending({ death = false } = {}) {
      if (!playing || !current || clock.ended) return null;
      const E = S.reactions.ending, e = clock.end(ctx.currentTime, death);
      fadeTo(current.lines.gain, 0, E.out);
      fadeTo(current.tbus.gain, 0, E.tone);
      retune();                                              // steady: the ending's theme as written
      ungate();
      tick();
      return e;
    },
    // Awake again: the whole theme a few seconds from now, then its turns as before. → whether it will come.
    wake() {
      if (!playing || !clock.wake(ctx.currentTime)) return false;
      ungate();
      return true;
    },
    // Night (S.reactions.night): the lines thinned from each one's next pass, the theme lower from its next turn.
    night(on) { clock.setNight(on); },
    // Unwell (S.reactions.unwell): 0 well; 1 the lines thinned, every note a little flat; 2 the theme slower and lower too.
    unwell(level) { clock.setUnwell(level); retune(); },
    // The wobble (S.reactions.wobble): the pitch of everything sways together, now, with a short glide.
    wobble(on) { clock.setWobble(on); retune(); },
    // The echo (S.reactions.echo): the theme's tune again a beat late, quieter, from its next turn.
    echo(on) { clock.setEcho(on); },
    // The lines, the room tone or the theme silenced, or heard again (the debug panel).
    mute(part, on) {
      if (!(part in mutes)) return;
      mutes[part] = !!on;
      const node = current && { lines: current.lines, tone: current.tone, theme: current.theme }[part];
      if (node) node.gain.setTargetAtTime(on ? 0 : 1, ctx.currentTime, 0.05);
    },
    muted: () => ({ ...mutes }),
    comes(on) { comesOn = !!on; clock.comes(comesOn, ctx.currentTime); },
    // The music's, the room tone's or the sounds' level (the bench's sliders).
    volume(part, v) { ({ tone: toneBus, sounds: sfx }[part] ?? musicBus).gain.setTargetAtTime(v, ctx.currentTime, 0.1); },
    // An instrument alone (the bench's Hear): steps 1, 3, 5, straight to the music bus, at its gain at that octave.
    hear(music, name) {
      const H = S.hear, t = ctx.currentTime + 0.05, inst = music.instruments[name];
      if (!playing) up(t);
      const lv = music === levels.music ? levels : levelsOf(S, music), g = lv.gain(instrumentPart(S, music, inst, H.octave, false, name)) ?? 1;
      H.steps.forEach((st, k) => note(kit, musicBus, inst, freqOf(music, st, H.octave), t + k * H.gap, H.length, g));
    },
    // Sounds (ui/sound/sounds.js): each { kind, material, weight }, in the list's order, a little apart, in the key given
    // ({ root, steps }: the world's music's, or S.sounds.key). Whether the music plays or not.
    sounds(list, key = S.sounds.key) {
      if (!list.length) return;
      playSounds(kit, sfx, list, key, ctx.currentTime + S.sounds.lead, (p) => soundGain(p, key));
      lastSounds = { kinds: list.slice(0, S.sounds.most).map(s => s.kind + (s.material ? " (" + s.material + ")" : "")), at: ctx.currentTime };
    },
    // What plays now: for the bench's page and the debug panel.
    info() {
      return { playing, now: ctx.currentTime, state: ctx.state, music: clock.music, scene: clock.scene, theme: clock.theme,
               themeNext: clock.themeNext, nextPart: clock.nextPart, resting: clock.resting, hushed: hushOn, night: clock.night, ending: clock.ended,
               unwell: clock.unwell, wobble: clock.wobble, echo: clock.echo, pitch: clock.pitch,
               tuning: { flat: flat.offset.value, wobble: wob.gain.value },   // the pitch as it is now, in cents (mid-glide too)
               mutes: { ...mutes }, sounds: lastSounds, levels: levelsInfo(), limiter: { now: reduction(), deepest },
               buses: { music: musicBus.gain.value, tone: toneBus.gain.value, sounds: sfx.gain.value },   // the sound panel's sliders as gains, mid-glide too
               voices: { now: voices.ends.filter(x => x > ctx.currentTime).length, peak: voices.peak, over: voices.over } };
    },
    // The peak level leaving the page now, in dB (-99: nothing).
    level() {
      if (!scope) { scope = ctx.createAnalyser(); scope.fftSize = 1024; limiter.connect(scope); }   // (reads silence until the bench asks again)
      const a = new Float32Array(scope.fftSize); scope.getFloatTimeDomainData(a);
      let peak = 0; for (const v of a) peak = Math.max(peak, Math.abs(v));
      return peak > 0 ? 20 * Math.log10(peak) : -99;
    }
  };
}
