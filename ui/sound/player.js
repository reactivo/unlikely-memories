// The player (MUSIC.md §5): a world's music played from what js/music.js reads, with the engine's frame. Scenes (a room's lines,
// tone and colour, crossfaded from the room before), the lines' scheduler on the audio clock, the theme's schedule and its turns
// (whole, question, whole, answer), comes and goes, and the frame itself (levels, the low-pass, the compressor, the echo).
// Plain functions of an AudioContext: no globals, no knowledge of the game (it is given a world's music and a room, never the
// state), so the test bench (tools/music/) plays exactly what the game plays. It never pauses by itself when the page looks
// hidden: the game's piece (ui/sound.js) does that, the bench must not (MUSIC.md §7). Every number is the spec's (content/music.js).
//
// Two halves:
//   createClockwork(S, random) — what plays when, as numbers: pure, no audio, driven by a clock it is given (tests/sound.test.js).
//   createPlayer(ctx, S, opts) — the clockwork made sound: { play(music, room), room(id), stop(fade), theme(), hush(on),
//                                mute(part, on), comes(on), volume(part, v), hear(music, name), info(), level() }
// And openAudio(ctx): the AudioContext made or woken inside a tap (the rules browsers set: MUSIC.md §7).

import { sceneOf, themePart, freqOf } from "../../js/music.js";
import { makeKit, playEvent, note, gain, filt, chain } from "./synth.js";
import { makeTone } from "./tones.js";
import { makeColour } from "./colours.js";

// ---- The clockwork: what plays when ------------------------------------------------------------------------------------------

// A scene's lines, ready to play from t0: each starts at its first note (not a rest), one after another `stagger` apart, so
// something sounds at once. A line with nothing sounding is left out (it would only be silence).
export function linesFrom(lines, t0, S) {
  return lines.filter(l => l.sounding).map((line, k) => {
    let i = 0;
    while (line.events[i].rest) i++;
    return { line, i, next: t0 + S.scene.first + k * S.scene.stagger, played: [] };
  });
}

// The events of a line due before `ahead`, each at its time; the line's place moves on (it loops at its own length).
export function due(cursor, ahead, beat) {
  const out = [], { line } = cursor;
  while (cursor.next < ahead) {
    const e = line.events[cursor.i];
    out.push({ e, i: cursor.i, t: cursor.next, beats: e.beats });
    cursor.played.push({ t: cursor.next, i: cursor.i }); if (cursor.played.length > 8) cursor.played.shift();
    cursor.next += e.beats * beat;
    cursor.i = (cursor.i + 1) % line.events.length;
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

// What plays when, from a clock it is given (seconds): the scene (a room's music), its lines as they come due, the theme a few
// seconds after the start, after a rest and every 100 to 160 s between, and comes and goes. `random` is the player's own (the
// gaps between themes), never the game's.
export function createClockwork(S, random = Math.random) {
  let music = null, scene = null, theme = null, themeNext = Infinity, count = 0, cycle = 0, resting = false, comes = true;
  const parts = S.theme.parts;
  const sceneAt = (roomId, now) => {
    const sc = sceneOf(music, roomId), t0 = now + S.scene.lead;
    return { id: roomId, sc, t0, lines: linesFrom(sc.lines, t0, S), share: 1 / Math.sqrt(Math.max(1, sc.lines.length)), box: sc.colour === "music_box" };
  };
  const clock = {
    get music() { return music; },
    get scene() { return scene; },
    get theme() { return theme; },                 // the theme last played: { room, label, how, part, mel, notes, chords, end }
    get themeNext() { return themeNext; },
    get nextPart() { return parts[count % parts.length]; },
    get resting() { return resting; },
    // A world's music starts in a room: its theme from the first turn, `first` seconds from now.
    start(m, roomId, now) { music = m; theme = null; count = 0; themeNext = now + S.theme.first; scene = sceneAt(roomId, now); return scene; },
    // Another room: a new scene; the theme's schedule goes on.
    room(roomId, now) { scene = sceneAt(roomId, now); return scene; },
    // Comes and goes on or off, its cycle from now (a fresh start: not resting).
    comes(on, now) { comes = on; cycle = now; },
    stop() { music = null; scene = null; theme = null; themeNext = Infinity; resting = false; },
    // The theme now (its next turn), in the room's way (as written, a variant, or its own tune); null when there is none.
    playTheme(now) {
      const th = scene?.sc.theme;
      if (!th) return null;
      const part = parts[count % parts.length], plan = themeTimes(th.mel, part, now + S.theme.lead, music.beat);
      theme = { room: scene.id, label: th.label, how: th.how, part, mel: th.mel, ...plan };
      count++;
      themeNext = plan.end + S.theme.gap[0] + random() * (S.theme.gap[1] - S.theme.gap[0]);
      return theme;
    },
    // Everything due by now + `ahead`: { notes: [{ line, e, i, t, beats }], rest: true / false when the music goes or comes
    // back (undefined: no change), theme: a part of the theme starting now, or null }.
    advance(now) {
      const out = { notes: [], rest: undefined, theme: null }, ahead = now + S.scene.ahead;
      if (scene) for (const l of scene.lines) for (const n of due(l, ahead, music.beat)) out.notes.push({ line: l.line, ...n });
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
    const ua = navigator.userAgent, apple = /iPhone|iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (apple && navigator.audioSession) { try { navigator.audioSession.type = "playback"; } catch (e) {} }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const b = ctx.createBuffer(1, 1, ctx.sampleRate), sb = ctx.createBufferSource(); sb.buffer = b; sb.connect(ctx.destination); sb.start();
  if (ctx.state !== "running") ctx.resume().catch(() => {});      // (whether it runs is the caller's to watch: ctx.state)
  return ctx;
}

// The player on a context. opts.comes: comes and goes on (the game) or off (the bench's default); opts.random: the player's own.
export function createPlayer(ctx, S, { comes = true, random = Math.random } = {}) {
  const kit = makeKit(ctx, S);
  // The frame: mix → low-pass → compressor → hush → master → speakers; the echo from the mix back into the low-pass; the music
  // through the gate (comes and goes) into the mix, the room tone straight in.
  const master = gain(ctx, 0), hushed = gain(ctx, 1);
  const lp = filt(ctx, "lowpass", S.lowpass.frequency, S.lowpass.q);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = S.compressor.threshold; comp.ratio.value = S.compressor.ratio;
  chain(lp, comp, hushed, master); master.connect(ctx.destination);
  const meter = ctx.createAnalyser(); meter.fftSize = 1024; master.connect(meter);
  const mix = gain(ctx, 1); mix.connect(lp);
  const R = S.reverb, len = Math.floor(ctx.sampleRate * R.seconds), ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, R.decay); }
  const rev = ctx.createConvolver(); rev.buffer = ir; const wet = gain(ctx, R.wet);
  mix.connect(rev); rev.connect(wet); wet.connect(lp);
  const gate = gain(ctx, 1); gate.connect(mix);
  const musicBus = gain(ctx, S.buses.music); musicBus.connect(gate);
  const toneBus = gain(ctx, S.buses.tone); toneBus.connect(mix);

  const clock = createClockwork(S, random);
  const mutes = { lines: false, tone: false, theme: false };
  let current = null, timer = null, playing = false, comesOn = comes;

  // A scene's sound: its buses (the lines and the theme through the colour, the tone apart), faded in over the crossfade.
  function startScene(scene) {
    const t0 = scene.t0, C = S.scene.crossfade;
    const bus = gain(ctx, 0), lines = gain(ctx, mutes.lines ? 0 : 1), theme = gain(ctx, mutes.theme ? 0 : 1);
    const tbus = gain(ctx, 0), tone = gain(ctx, mutes.tone ? 0 : 1), colour = makeColour(kit, scene.sc.colour);
    lines.connect(bus); theme.connect(bus); bus.connect(colour.input); colour.output.connect(musicBus);
    tbus.connect(tone); tone.connect(toneBus);
    for (const b of [bus, tbus]) { b.gain.setValueAtTime(0, t0); b.gain.linearRampToValueAtTime(1, t0 + C); }
    wet.gain.setTargetAtTime(S.space[scene.sc.tone] ?? S.spaceDefault, t0, R.follow);
    return { scene, bus, lines, theme, tbus, tone, room: makeTone(kit, scene.sc.tone, tbus), colour, toneTo: t0 };
  }
  function stopScene(a, fade) {
    const t = ctx.currentTime, P = S.scene;
    for (const b of [a.bus, a.tbus]) { b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(0, t + fade); }
    a.room.stop(t + fade + P.toneStop); a.colour.stop(t + fade + P.colourStop);
    setTimeout(() => { for (const n of [a.bus, a.tbus, a.lines, a.theme, a.tone]) n.disconnect(); }, (fade + P.release) * 1000);
  }
  // A part of the theme, on the scene's theme bus, its chords under it.
  function sound(th) {
    const m = clock.music, inst = m.instruments[th.mel.play], box = current.scene.box;
    for (const n of th.notes) playEvent(kit, current.theme, m, inst, n.e, th.mel.octave, n.t, n.beats, 1, box);
    const c = th.mel.chords;
    if (c) for (const n of th.chords) playEvent(kit, current.theme, m, m.instruments[c.play], n.e, c.octave, n.t, n.beats, S.theme.chords, box);
  }
  // The scheduler, every `every` ms: what is due, made sound.
  function tick() {
    if (!current) return;
    const now = ctx.currentTime, out = clock.advance(now), m = clock.music, sc = current.scene;
    for (const n of out.notes) playEvent(kit, current.lines, m, m.instruments[n.line.play], n.e, n.line.octave, n.t, n.beats, sc.share, sc.box);
    const ahead = now + S.scene.ahead;
    if (current.toneTo < ahead) { const a = Math.max(current.toneTo, now); current.room.tick(a, ahead); current.colour.tick(a, ahead); current.toneTo = ahead; }
    if (out.rest !== undefined) gate.gain.setTargetAtTime(out.rest ? 0 : 1, now, S.comes.fade);
    if (out.theme) sound(out.theme);
  }
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
      current = startScene(clock.start(music, roomId, now));
      clearInterval(timer); timer = setInterval(tick, S.scene.every); tick();
    },
    // Another room of the same world: crossfaded.
    room(roomId) {
      if (!playing || clock.scene?.id === roomId) return;
      stopScene(current, S.scene.crossfade);
      current = startScene(clock.room(roomId, ctx.currentTime));
      tick();
    },
    // Silence, fading out.
    stop(fade = S.master.off) {
      if (!playing) return;
      playing = false;
      clearInterval(timer); timer = null;
      fadeTo(master.gain, 0, fade);
      if (current) stopScene(current, fade);
      current = null; clock.stop();
    },
    // The theme now (its next turn), unless it is playing already. → the part played, or null.
    theme() {
      if (!playing || (clock.theme && ctx.currentTime < clock.theme.end)) return null;
      const th = clock.playTheme(ctx.currentTime);
      if (th) sound(th);
      return th;
    },
    // Everything faded out (the end of the story, sleep) and back in; the music goes on underneath.
    hush(on) { fadeTo(hushed.gain, on ? 0 : 1, on ? S.hush.out : S.hush.back); },
    // The lines, the room tone or the theme silenced, or heard again (the debug panel).
    mute(part, on) {
      if (!(part in mutes)) return;
      mutes[part] = !!on;
      const node = current && { lines: current.lines, tone: current.tone, theme: current.theme }[part];
      if (node) node.gain.setTargetAtTime(on ? 0 : 1, ctx.currentTime, 0.05);
    },
    muted: () => ({ ...mutes }),
    comes(on) { comesOn = !!on; clock.comes(comesOn, ctx.currentTime); },
    // The music's or the room tone's level (the bench's sliders).
    volume(part, v) { (part === "tone" ? toneBus : musicBus).gain.setTargetAtTime(v, ctx.currentTime, 0.1); },
    // An instrument alone (the bench's Hear): steps 1, 3, 5, straight to the music bus.
    hear(music, name) {
      const H = S.hear, t = ctx.currentTime + 0.05, inst = music.instruments[name];
      if (!playing) { master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(S.master.level, t); }
      H.steps.forEach((st, k) => note(kit, musicBus, inst, freqOf(music, st, H.octave), t + k * H.gap, H.length));
    },
    // What plays now: for the bench's page and the debug panel.
    info() {
      return { playing, now: ctx.currentTime, state: ctx.state, music: clock.music, scene: clock.scene, theme: clock.theme,
               themeNext: clock.themeNext, nextPart: clock.nextPart, resting: clock.resting, mutes: { ...mutes } };
    },
    // The peak level leaving the page now, in dB (-99: nothing).
    level() {
      const a = new Float32Array(meter.fftSize); meter.getFloatTimeDomainData(a);
      let peak = 0; for (const v of a) peak = Math.max(peak, Math.abs(v));
      return peak > 0 ? 20 * Math.log10(peak) : -99;
    }
  };
}
