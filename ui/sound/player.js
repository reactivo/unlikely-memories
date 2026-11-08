// The player (MUSIC.md §5): a world's music played from what js/music.js reads, with the engine's frame. Scenes (a room's lines,
// tone and colour, crossfaded from the room before), the lines' scheduler on the audio clock, the theme's schedule and its turns
// (whole, question, whole, answer), comes and goes, the reactions (an ending, waking, night, unwell, the wobble and the echo)
// and the frame itself (levels, the low-pass, the compressor, the reverb, the shared pitch every note follows).
// Plain functions of an AudioContext: no globals, no knowledge of the game (it is given a world's music and a room, never the
// state; it is told "an ending", "a death", "night", "awake", "unwell", "wobble", "echo", never why), so the test bench (tools/music/) plays exactly what the
// game plays. It never pauses by itself when the page looks hidden: the game's piece (ui/sound.js) does that, the bench must not
// (MUSIC.md §7). Every number is the spec's (content/music.js).
//
// Two halves:
//   createClockwork(S, random) — what plays when, as numbers: pure, no audio, driven by a clock it is given (tests/sound.test.js).
//   createPlayer(ctx, S, opts) — the clockwork made sound: { play(music, room), room(id), stop(fade), theme(), hush(on),
//                                ending({ death }), wake(), night(on), unwell(level), wobble(on), echo(on), mute(part, on),
//                                comes(on), volume(part, v), hear(music, name), sounds(list, key), info(), level(), parts(music, rooms),
//                                close() }
//                                Every part plays at the meter's gain (ui/sound/loudness.js, ui/sound/parts.js; MUSIC.md §6c): its
//                                written level until it is measured, then a short glide to the measured gain.
//   meterOf(S), partsOf(meter, S, music, rooms), measureWorld(meter, S, music, room), targetOf / gainOf(meter, S, part): the page's
//                                loudness meter and what it has (the bench reads them before any sound is made).
//   pitchOf(level, wobble, S) — the shared pitch for a level of unwell and the wobble, as numbers (cents, Hz).
// And openAudio(ctx): the AudioContext made or woken inside a tap (the rules browsers set: MUSIC.md §7).

import { sceneOf, themePart, freqOf, variant, shiftOctave } from "../../js/music.js";
import { makeKit, playEvent, note, gain, filt, chain } from "./synth.js";
import { makeTone } from "./tones.js";
import { makeColour } from "./colours.js";
import { playSounds } from "./sounds.js";
import { createMeter } from "./loudness.js";
import SEED from "../../content/loudness.seed.js";
import { instrumentPart, tonePart, colourPart, soundParts, soundId, musicParts, fixedParts } from "./parts.js";

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
// go by unplayed. Whole passes, so a line that plays keeps its shape.
export function due(cursor, ahead, beat, quiet = () => false) {
  const out = [], { line } = cursor;
  while (cursor.next < ahead) {
    const e = line.events[cursor.i];
    if (!cursor.quiet) {
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
        for (const l of scene.lines) for (const n of due(l, ahead, music.beat, thin)) out.notes.push({ line: l.line, ...n });
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

// The AudioContext, made (or woken) inside a tap: synchronously, nothing awaited before it (MUSIC.md §7). On an iPhone or iPad the
// music plays through the silent switch (MUSIC.md §2.7: `playback`, where Safari has `navigator.audioSession`); a one-sample
// buffer unlocks iOS. Returns the context (`existing` if given).
export function openAudio(existing) {
  let ctx = existing;
  if (!ctx) {
    if (appleMobile() && navigator.audioSession) { try { navigator.audioSession.type = "playback"; } catch (e) {} }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  opened = true; if (shared) shared.release();                   // the meter may render now: the session's type is set
  const b = ctx.createBuffer(1, 1, ctx.sampleRate), sb = ctx.createBufferSource(); sb.buffer = b; sb.connect(ctx.destination); sb.start();
  if (ctx.state !== "running") ctx.resume().catch(() => {});      // (whether it runs is the caller's to watch: ctx.state)
  return ctx;
}

// The meter every player on the page shares (a fresh player after a dead context keeps what was measured), with the shipped seed
// (content/loudness.seed.js: every shared part and the shipped worlds' instruments, measured by tools/music/seed.py) as the levels
// until this device has measured each part itself.
let shared = null, opened = false;
// For now an iPhone or iPad measures nothing itself (Offline: null): the seed's levels, else the written ones. The game there ran a
// while with the sound on, then froze and the page reloaded (8 November 2026), likely the meter's renders (memory); until the sound's
// review settles it.
// An iPhone or iPad (an iPad says "Macintosh" and has a touch screen). There the meter renders nothing before openAudio: an offline
// context made first fixed the audio session as the default, and silent mode muted everything (8 November 2026).
export const appleMobile = () => typeof navigator !== "undefined" &&
  (/iPhone|iPad/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));
export const meterOf = (S) => (shared ??= createMeter({ held: appleMobile() && !opened, Offline: appleMobile() ? null : undefined, gap: S.loudness.gap, limits: S.loudness.limits, seed: SEED.parts }));
// A part's target (S.loudness.targets; a colour's: its reference's loudness, clean) and its gain now (null: not measured, its
// written level).
export const targetOf = (meter, S, part) => (part.group === "colours" ? meter.known(part.ref)?.loudness ?? null : S.loudness.targets[part.group] ?? null);
export const gainOf = (meter, S, part) => { const t = targetOf(meter, S, part); return t == null ? null : meter.gainOf(part.key, t); };
// Every part of a world (in the order of its rooms given, then the ones every world shares) with what the meter has of it: { label,
// group, key, target, full, phone, loudness (dB, at its written level), gain (dB), from: "storage" | "fresh" | null }. The bench's.
export function partsOf(meter, S, music, roomIds = []) {
  const list = [...(music ? musicParts(S, music, roomIds) : []), ...fixedParts(S)];
  return list.filter((p, i) => list.findIndex(q => q.key === p.key) === i).map(p => {
    const k = meter.known(p.key), g = gainOf(meter, S, p);
    return { label: p.label, group: p.group, key: p.key, target: targetOf(meter, S, p), full: k?.full ?? null, phone: k?.phone ?? null,
             loudness: k?.loudness ?? null, gain: g == null ? null : 20 * Math.log10(g), from: k?.from ?? null, failed: !k && !!meter.failed?.(p.key) };
  });
}
// A world's parts, measured in the background: the room you are in first, then its sounds (in its key), the other rooms, the rest every
// world shares.
export function measureWorld(meter, S, music, roomId) {
  meter.want(musicParts(S, music, [roomId]).filter(p => p.group !== "sounds"), true);
  meter.want([...soundParts(S, { root: music.root, steps: music.steps }).values()]);
  meter.want(musicParts(S, music, Object.keys(music.rooms)));
  meter.want(fixedParts(S));
}

// The player on a context. opts.comes: comes and goes on (the game) or off (the bench's default); opts.random: the player's own;
// opts.meter: the loudness meter (the page's shared one by default).
export function createPlayer(ctx, S, { comes = true, random = Math.random, meter = meterOf(S) } = {}) {
  const kit = makeKit(ctx, S);
  // The frame: mix → low-pass → compressor → hush → master → out → speakers; the echo from the mix back into the low-pass; the
  // music through the gate (comes and goes) into the mix, the room tone straight in. The sounds (S.sounds) on a bus of their own,
  // through their own low-pass, straight to `out`: heard whether the music plays or not (a world with no music, after an ending),
  // never hushed (they come after waking) nor faded with the music. Last, one gentle limiter (S.loudness.limiter), only so stacked
  // sounds never clip.
  const master = gain(ctx, 0), hushed = gain(ctx, 1), out = gain(ctx, 1);
  const lp = filt(ctx, "lowpass", S.lowpass.frequency, S.lowpass.q);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = S.compressor.threshold; comp.ratio.value = S.compressor.ratio;
  const L = S.loudness.limiter, limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = L.threshold; limiter.knee.value = L.knee; limiter.ratio.value = L.ratio; limiter.attack.value = L.attack; limiter.release.value = L.release;
  chain(lp, comp, hushed, master, out, limiter); limiter.connect(ctx.destination);
  const scope = ctx.createAnalyser(); scope.fftSize = 1024; limiter.connect(scope);
  const sfx = gain(ctx, S.buses.sounds); chain(sfx, filt(ctx, "lowpass", S.sounds.lowpass, S.lowpass.q), out);
  const mix = gain(ctx, 1); mix.connect(lp);
  const R = S.reverb, len = Math.floor(ctx.sampleRate * R.seconds), ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, R.decay); }
  const rev = ctx.createConvolver(); rev.buffer = ir; const wet = gain(ctx, R.wet);
  mix.connect(rev); rev.connect(wet); wet.connect(lp);
  const gate = gain(ctx, 1); gate.connect(mix);
  const musicBus = gain(ctx, S.buses.music); musicBus.connect(gate);
  const toneBus = gain(ctx, S.buses.tone); toneBus.connect(mix);

  // The pitch every note follows (pitchOf): a steady offset (unwell's detune), a very slow drift and the wobble, summed into each
  // note's detune (synth.js, note: kit.pitch).
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

  // ---- Loudness (MUSIC.md §6c): every part through a trim, a gain node at the meter's gain (its written level, 1, until measured;
  // then a glide); a part not yet measured is measured in the background, ahead of the rest.
  const trims = new Map();                                   // key → { part, nodes }: the trims now in use
  const gainNow = (part) => gainOf(meter, S, part);
  function trim(part, into) {
    let t = trims.get(part.key);
    if (!t) trims.set(part.key, t = { part, nodes: new Set() });
    const v = gainNow(part), g = gain(ctx, v ?? 1); g.connect(into); t.nodes.add(g);
    if (v == null) meter.want(part.refPart ? [part.refPart, part] : [part], true);
    return g;
  }
  function untrim(part, g) { trims.get(part.key)?.nodes.delete(g); g.disconnect(); }
  const unsubscribe = meter.on((key) => {                    // measured: its trims glide to the gain (a colour's when its reference is)
    for (const t of trims.values()) if (t.part.key === key || t.part.ref === key) {
      const v = gainNow(t.part);
      if (v != null) for (const g of t.nodes) { try { fadeTo(g.gain, v, S.loudness.glide); } catch (e) {} }
    }
  });
  // A world's instrument at an octave (as the music box plays it, or not): its part, made once.
  const instruments = new WeakMap();
  function instrumentOf(music, inst, octave, box) {
    let m = instruments.get(inst);
    if (!m) instruments.set(inst, m = new Map());
    const id = octave + (box ? "b" : "");
    if (!m.has(id)) m.set(id, instrumentPart(S, music, inst, octave, box, Object.keys(music.instruments).find(n => music.instruments[n] === inst)));
    return m.get(id);
  }
  // The trim a scene's note goes through: one per instrument and octave on each of its buses (the lines, the theme).
  function via(a, bus, inst, octave) {
    const part = instrumentOf(clock.music, inst, octave, a.scene.box), id = bus + " " + part.key;
    let g = a.trims.get(id);
    if (!g) { g = trim(part, a[bus]); a.trims.set(id, g); a.owned.push([part, g]); }
    return g;
  }
  // A sound's note: its instrument's gain in this key; until that is measured, the same instrument's in C (the seed's: within a few
  // dB), else 1.
  function soundGain(p, key) {
    const part = soundParts(S, key).get(soundId(p));
    if (!part) return 1;
    const v = gainNow(part);
    if (v != null) return v;
    meter.want([part], true);
    const inC = soundParts(S).get(soundId(p));
    return (inC && gainNow(inC)) ?? 1;
  }
  // When the audio starts: the parts every world shares, in the background (a world's own when it plays: measureWorld); after the
  // tap's own task, which has enough to do.
  setTimeout(() => { meter.want([...soundParts(S).values()]); meter.want(fixedParts(S)); }, 0);
  // The most the limiter has pulled down, in dB (info: it should barely act), from `settle` s after the player is made: Chromium's
  // compressor reports a large reduction as it starts, whatever it is given (a quiet sine alone: -16 dB, back to 0 within 2 s).
  let deepest = 0;
  const settle = ctx.currentTime + 3;
  const reduction = () => (typeof limiter.reduction === "number" ? limiter.reduction : limiter.reduction?.value ?? 0);   // (old Safari: a param)

  const clock = createClockwork(S, random);
  const mutes = { lines: false, tone: false, theme: false };
  let current = null, timer = null, playing = false, comesOn = comes, hushOn = false;
  let lastSounds = null;                                     // the sounds last played: { kinds, at } (info: the debug panel's)

  // A scene's sound: its buses (the lines and the theme through the colour, the tone apart), faded in over the crossfade.
  function startScene(scene) {
    const t0 = scene.t0, C = S.scene.crossfade;
    const bus = gain(ctx, 0), lines = gain(ctx, mutes.lines ? 0 : 1), theme = gain(ctx, mutes.theme ? 0 : 1);
    const tbus = gain(ctx, 0), tone = gain(ctx, mutes.tone ? 0 : 1), colour = makeColour(kit, scene.sc.colour);
    const owned = [], own = (part, into) => { const g = trim(part, into); owned.push([part, g]); return g; };
    lines.connect(bus); theme.connect(bus); bus.connect(colour.input);
    colour.output.connect(S.colours[scene.sc.colour] ? own(colourPart(S, scene.sc.colour), musicBus) : musicBus);
    tbus.connect(tone); tone.connect(toneBus);
    for (const b of [bus, tbus]) { b.gain.setValueAtTime(0, t0); b.gain.linearRampToValueAtTime(1, t0 + C); }
    wet.gain.setTargetAtTime(S.space[scene.sc.tone] ?? S.spaceDefault, t0, R.follow);
    const into = S.tones[scene.sc.tone] && scene.sc.tone !== "silence" ? own(tonePart(S, scene.sc.tone), tbus) : tbus;
    return { scene, bus, lines, theme, tbus, tone, room: makeTone(kit, scene.sc.tone, into), colour, toneTo: t0, trims: new Map(), owned };
  }
  function stopScene(a, fade) {
    const t = ctx.currentTime, P = S.scene;
    for (const b of [a.bus, a.tbus]) { b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(0, t + fade); }
    a.room.stop(t + fade + P.toneStop); a.colour.stop(t + fade + P.colourStop);
    setTimeout(() => { for (const n of [a.bus, a.tbus, a.lines, a.theme, a.tone]) n.disconnect(); for (const [part, g] of a.owned) untrim(part, g); }, (fade + P.release) * 1000);
  }
  // A part of the theme, on the scene's theme bus, its chords under it.
  function sound(th) {
    const m = clock.music, inst = m.instruments[th.mel.play], box = current.scene.box;
    const to = via(current, "theme", inst, th.mel.octave);
    for (const n of th.notes) playEvent(kit, to, m, inst, n.e, th.mel.octave, n.t, n.beats, 1, box);
    if (th.echo) for (const n of th.notes) playEvent(kit, to, m, inst, n.e, th.mel.octave, n.t + th.echo.after, n.beats, th.echo.level, box);
    const c = th.mel.chords, ci = c && m.instruments[c.play];
    if (c) { const under = via(current, "theme", ci, c.octave); for (const n of th.chords) playEvent(kit, under, m, ci, n.e, c.octave, n.t, n.beats, S.theme.chords, box); }
  }
  // The scheduler, every `every` ms: what is due, made sound.
  function tick() {
    if (!current) return;
    const now = ctx.currentTime, out = clock.advance(now), m = clock.music, sc = current.scene;
    for (const n of out.notes) { const inst = m.instruments[n.line.play]; playEvent(kit, via(current, "lines", inst, n.line.octave), m, inst, n.e, n.line.octave, n.t, n.beats, sc.share, sc.box); }
    if (ctx.currentTime > settle) deepest = Math.min(deepest, reduction());
    const ahead = now + S.scene.ahead;
    if (current.toneTo < ahead) { const a = Math.max(current.toneTo, now); current.room.tick(a, ahead); current.colour.tick(a, ahead); current.toneTo = ahead; }
    if (out.rest !== undefined) gate.gain.setTargetAtTime(out.rest ? 0 : 1, now, S.comes.fade);
    if (out.theme) sound(out.theme);
    if (out.over) stop(S.reactions.ending.after);            // the ending's theme is over: silence (until play() again)
  }
  // Silence, fading out.
  function stop(fade = S.master.off) {
    if (!playing) return;
    playing = false;
    clearInterval(timer); timer = null;
    fadeTo(master.gain, 0, fade);
    if (current) stopScene(current, fade);
    current = null; clock.stop();
  }
  // The comes-and-goes gate open again (an ending's theme and waking are heard even if the music was resting).
  const ungate = () => { const t = ctx.currentTime; gate.gain.cancelScheduledValues(t); gate.gain.setTargetAtTime(1, t, S.comes.fade); };
  const fadeTo = (param, v, secs) => { const t = ctx.currentTime; param.cancelScheduledValues(t); param.setValueAtTime(param.value, t); param.linearRampToValueAtTime(v, t + secs); };

  return {
    ctx,
    get playing() { return playing; },
    // A world's music, from a room: from silence, or crossfaded from what plays (another world, or the same one read again).
    play(music, roomId) {
      const now = ctx.currentTime;
      if (!playing) {
        playing = true;
        master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(S.master.level, now);
        clock.comes(comesOn, now); gate.gain.cancelScheduledValues(now); gate.gain.setValueAtTime(1, now);
      }
      if (current) stopScene(current, S.scene.crossfade);
      setTimeout(() => measureWorld(meter, S, music, roomId), 0);
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
      if (th) sound(th);
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
      if (!playing) { master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(S.master.level, t); }
      const part = instrumentOf(music, inst, H.octave, false), g = trim(part, musicBus);
      H.steps.forEach((st, k) => note(kit, g, inst, freqOf(music, st, H.octave), t + k * H.gap, H.length));
      setTimeout(() => untrim(part, g), (H.steps.length * H.gap + 8) * 1000);
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
               mutes: { ...mutes }, sounds: lastSounds,
               loudness: meter.info(), limiter: { now: reduction(), deepest } };
    },
    // Every part of a world with what the meter has of it (partsOf).
    parts: (music, roomIds = []) => partsOf(meter, S, music, roomIds),
    meter,
    // Let go of the meter (a player replaced): its trims no longer follow it.
    close() { unsubscribe(); },
    // The peak level leaving the page now, in dB (-99: nothing).
    level() {
      const a = new Float32Array(scope.fftSize); scope.getFloatTimeDomainData(a);
      let peak = 0; for (const v of a) peak = Math.max(peak, Math.abs(v));
      return peak > 0 ? 20 * Math.log10(peak) : -99;
    }
  };
}
