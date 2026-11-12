// Music, the engine's side (MUSIC.md §4–§6): the forgiving reader of a world's music and the pure functions that say what
// should play (the key, the picks among three, a room's scene, the theme's halves and variants). Pure: no page, no Web Audio,
// never the state's randomness (the picks come from the world's id). Moved from the test bench (game/tools/music/index.html);
// the picks and the key are the bench's, bit for bit, so a world sounds in the game as it did there.
//
// Nothing here is ever refused (MUSIC.md §2.4): what can't be read is skipped or given a default, a number out of range is
// brought into range, and each of these is a note ({ text, warn? }), which the checker lists as a warning.
//
//   readMusic(raw, worldId, roomIds) → { music, notes }   raw: { music: the world's part, rooms: { room id: the room's part } };
//                                                          the world's part may carry its `levels` (MUSIC.md §6c), kept as they are
//   musicOf(state) → { music, notes }, or null for a world with no music (state.music, and each room's own `music`)
//   sceneOf(music, roomId) → { id, tone, lines, colour, own, ownTone, ownColour, theme: { mel, how, label } | null }
//   freqOf(music, step, octave) → the pitch in Hz of a step of the world's mode, in its key
//   variant(mel, how, play), shiftOctave(mel, k) → a theme changed (a room's variant; an octave down at night or for a death)
// (The theme's turns, whole, question, whole, answer, are the player's schedule: content/music.js.)

// ---- The constants -------------------------------------------------------------------------------------------------
// The modes, as semitones above the root (MUSIC.md §4).
export const MODES = { major: [0,2,4,5,7,9,11], minor: [0,2,3,5,7,8,10], dorian: [0,2,3,5,7,9,10], phrygian: [0,1,3,5,7,8,10],
  lydian: [0,2,4,6,7,9,11], mixolydian: [0,2,4,5,7,9,10], "pentatonic-minor": [0,3,5,7,10], "pentatonic-major": [0,2,4,7,9],
  "harmonic-minor": [0,2,3,5,7,8,11], "phrygian-dominant": [0,1,4,5,7,8,10], in: [0,1,5,7,8], "whole-tone": [0,2,4,6,8,10] };
export const COLOURS = ["clean", "gramophone", "radio", "music_box", "far_away", "through_wall", "underwater"];
export const TONES = ["fog", "rain", "wind", "water", "cave", "hall", "hum", "crowd", "fire", "silence"];
export const NOISES = ["tick", "knock", "clack", "brush", "drip"];        // the kinds for a rhythm line, made of noise
export const KINDS = ["struck", "plucked", "chime", "bowed", "blown", "reed", ...NOISES];
const SINGERS = ["bowed", "blown", "reed", "plucked"];            // the kinds a theme can move to (a variant)
export const KEYS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const DEFAULT_INSTRUMENT = { kind: "struck", ratio: 3.5, bright: 0.5, attack: 0, release: 4 };
export const LIMITS = { lines: 4, themeNotes: 40, steps: 4, beats: [0.125, 64], octave: [1, 5], step: [-14, 15] };
// How a room with music of its own brings the theme back (MUSIC.md §2.16).
const VARIANTS = ["instrument", "up", "down", "slower"];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const isObject = (x) => x !== null && typeof x === "object" && !Array.isArray(x);

// ---- The key and the picks -----------------------------------------------------------------------------------------
// A text's FNV-1a hash, the one source of every pick: one round per character, on its whole code point (an id outside the
// basic range hashes on all of it; an ASCII id hashes exactly as on the bench, which took each character's first code unit).
export function hash(text) {
  let h = 2166136261;
  for (const c of String(text)) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return h;
}
// The key is the engine's (MUSIC.md §2.14): the root, 0–11 (KEYS), from the world's id, the same every time.
export const keyOf = (worldId) => hash(worldId) % 12;
// One of up to three choices, best first, from a seed (MUSIC.md §2.20): the first half the time, the second a third, the third a sixth.
export function pickOf(seed, choices) {
  if (!choices.length) return undefined;
  const w = [3, 2, 1].slice(0, choices.length), sum = w.reduce((a, b) => a + b, 0);
  let r = hash(seed) % sum;
  for (let i = 0; i < w.length; i++) { if (r < w[i]) return choices[i]; r -= w[i]; }
  return choices[0];
}

// ---- Notes ---------------------------------------------------------------------------------------------------------
// A line's notes, "step:beats" apart by spaces (MUSIC.md §4): `-` a rest, `1+3+5` a chord, `1/3/5` an arpeggio, `5~3` a
// slide, `~5` a scoop, `~5~3` a scoop into 5 that then slides to 3; beats from 0.125 to 64, steps from -14 to 15. → { events,
// notes }: each event { steps, beats, tok } (and rest, arp, to or scoop); what can't be read is skipped and a number out of
// range brought into range, each with a note (nothing is dropped silently).
export function parseNotes(text) {
  const events = [], notes = [];
  for (const tok of String(text || "").trim().split(/\s+/).filter(Boolean)) {
    const pair = tok.split(":");
    if (pair.length > 2) { notes.push({ text: `"${tok}" skipped (not step:beats)`, warn: true }); continue; }
    const [a, b] = pair;
    const beats = Number(b);
    if (!Number.isFinite(beats) || beats <= 0) { notes.push({ text: `"${tok}" skipped (no beats)`, warn: true }); continue; }
    const bt = clamp(beats, ...LIMITS.beats);
    const step = (x) => {
      const c = clamp(x, ...LIMITS.step);
      if (c !== x) notes.push({ text: `"${tok}": step ${x} brought into range (${c})` });
      return c;
    };
    if (a === "-") { events.push({ rest: true, beats: bt, tok }); continue; }
    if (/^~?-?\d+(~-?\d+)?$/.test(a) && a.includes("~")) {          // ~5 scoops up into 5; 5~3 slides from 5 to 3; ~5~3 both
      const scoop = a.startsWith("~"), [x, y] = (scoop ? a.slice(1) : a).split("~").map(v => parseInt(v, 10));
      if (!x || (y !== undefined && !y)) { notes.push({ text: `"${tok}" skipped (not a step)`, warn: true }); continue; }
      events.push({ steps: [step(x)], ...(scoop ? { scoop: true } : {}), ...(y !== undefined ? { to: step(y) } : {}), beats: bt, tok });
      continue;
    }
    const arp = a.includes("/"), parts = a.split(arp ? "/" : "+");
    const steps = parts.map(x => parseInt(x, 10));
    if (!steps.length || steps.some((st, j) => !Number.isFinite(st) || st === 0 || String(st) !== parts[j].trim())) {
      notes.push({ text: `"${tok}" skipped (not a step)`, warn: true });
      continue;
    }
    if (steps.length > LIMITS.steps) notes.push({ text: `"${tok}" has ${steps.length} steps, the first ${LIMITS.steps} kept` });
    events.push({ steps: steps.slice(0, LIMITS.steps).map(step), arp: arp && steps.length > 1, beats: bt, tok });
  }
  return { events, notes };
}
// An event written back as a token ("5~3:2", "~5~3:1", "1/3/5:1"), as a variant changes it.
const tokOf = (e) => `${e.rest ? "-" : (e.scoop ? "~" : "") + (e.to !== undefined ? e.steps[0] + "~" + e.to : e.steps.join(e.arp ? "/" : "+"))}:${+e.beats.toFixed(2)}`;
// A line with its length in beats (`total`: the player times the line and the theme by it) and its sounding notes, worked out
// again from its events (after a cut or a variant).
const measured = (l) => ({ ...l, total: l.events.reduce((s, e) => s + e.beats, 0), sounding: l.events.filter(e => !e.rest).length });

// ---- The reader ----------------------------------------------------------------------------------------------------
// The world's music and its rooms', read forgivingly (MUSIC.md §4, "Mistakes"): the mode and colour picked from the world's
// three, the key from its id, numbers brought into range, unknown names given a default or left out. Rooms not in roomIds are
// ignored. Never throws.
export function readMusic(raw, worldId, roomIds = []) {
  const notes = [];                                        // what the reader did: { text, warn? }
  const data = isObject(raw) ? raw : {};
  const m = isObject(data.music) ? data.music : {};
  const num = (v, a, b, def, what, into = notes) => {
    const n = Number(v);
    if (!Number.isFinite(n)) { if (v !== undefined) into.push({ text: `${what}: "${v}" is not a number, ${def} used`, warn: true }); return def; }
    const c = clamp(n, a, b);
    if (c !== n) into.push({ text: `${what}: ${n} brought into range (${c})` });
    return c;
  };

  // The mode: three choices, best first, the engine's pick (a single word is still read; an old `scale` gives its mode).
  let modeList = (Array.isArray(m.mode) ? m.mode : m.mode !== undefined ? [m.mode] : []).map(x => String(x).trim().toLowerCase());
  if (!modeList.length && m.scale) { modeList = [String(m.scale).trim().split(/\s+/).slice(1).join(" ").toLowerCase()]; notes.push({ text: `"scale" read for its mode; the key is the engine's` }); }
  if (modeList.length > 3) notes.push({ text: `${modeList.length} modes, the first 3 kept` });
  const modeChoices = modeList.slice(0, 3).filter(x => { if (MODES[x]) return true; notes.push({ text: `mode "${x}" unknown, left out`, warn: true }); return false; });
  let mode = pickOf(worldId + "/mode", modeChoices);
  if (!mode) { notes.push({ text: "no mode that can be read: minor used", warn: true }); mode = "minor"; }
  const root = keyOf(worldId);
  const tempo = num(m.tempo, 20, 90, 40, "tempo");

  // The instruments: a kind it doesn't know, or none, is guessed from the attack (the same kind of note either way); with no
  // instruments, a default bell.
  const instruments = {};
  for (const [name, given] of Object.entries(isObject(m.instruments) ? m.instruments : {})) {
    const i = isObject(given) ? given : {};
    let kind = String(i.kind ?? "").toLowerCase();
    if (!KINDS.includes(kind)) {
      const guess = Number(i.attack) < 0.15 ? "struck" : "reed";
      notes.push({ text: `${name}: kind "${i.kind ?? ""}" ${i.kind === undefined ? "missing" : "unknown"}, ${guess} used`, warn: true });
      kind = guess;
    }
    instruments[name] = { kind,
      ratio: num(i.ratio, 0.5, 12, 1, `${name}.ratio`), bright: num(i.bright, 0, 1, 0.3, `${name}.bright`),
      attack: num(i.attack, 0, 8, 0, `${name}.attack`), release: num(i.release, 0.1, 10, 2, `${name}.release`) };
  }
  if (!Object.keys(instruments).length) { notes.push({ text: "no instruments: a default bell used", warn: true }); instruments.bell = { ...DEFAULT_INSTRUMENT }; }
  const firstInst = Object.keys(instruments)[0];

  // A colour: three, best first, picked like the mode (a room's is one word); one it doesn't know is left out, or clean. A list
  // is picked from with its own seed ("<world>/colour", a room's "<world>/<room>/colour"), so a room's list never touches the
  // world's pick. → { colour, choices } (choices: the list as read, [] for one word).
  const colour = (c, where, seed) => {
    if (c === undefined) return { colour: undefined, choices: [] };
    if (Array.isArray(c)) {
      const choices = c.slice(0, 3).filter(x => { if (COLOURS.includes(x)) return true; notes.push({ text: `${where}: colour "${x}" unknown, left out`, warn: true }); return false; });
      return { colour: pickOf(seed + "/colour", choices) ?? "clean", choices };
    }
    if (COLOURS.includes(c)) return { colour: c, choices: [] };
    notes.push({ text: `${where}: colour "${c}" unknown, clean used`, warn: true });
    return { colour: "clean", choices: [] };
  };
  const tone = (t, where) => {
    if (t === undefined) return undefined;
    if (TONES.includes(t)) return t;
    notes.push({ text: `${where}: tone "${t}" unknown, silence used`, warn: true });
    return "silence";
  };
  // One line, the k-th as written: on an instrument the world has, its octave 1–5 (6 comes down to 5), its notes read.
  // → { line, said }: its notes are kept apart (said), for lines() to tell only of the lines it keeps.
  const line = (given, k, where) => {
    const said = [], l = isObject(given) ? given : {};
    let inst = l.play;
    if (!instruments[inst]) { said.push({ text: `${where} line ${k + 1}: instrument "${inst}" unknown, "${firstInst}" used`, warn: true }); inst = firstInst; }
    const octave = num(l.octave ?? 3, ...LIMITS.octave, 3, `${where} line ${k + 1} octave`, said);
    const read = parseNotes(l.notes);
    for (const n of read.notes) said.push({ ...n, text: `${where} line ${k + 1}: ${n.text}` });
    return { line: measured({ play: inst, octave, events: read.events }), said };
  };
  // Lines: a line with no notes is dropped, then at most four are kept (the limit counts the lines that play). What the reader
  // did is told for the lines up to the last one kept; those beyond the limit are dropped whole, with the one note.
  const lines = (ls, where) => {
    if (!Array.isArray(ls)) return [];
    const read = ls.map((given, k) => {
      const r = line(given, k, where);
      if (!r.line.events.length) r.said.push({ text: `${where} line ${k + 1}: no notes, dropped`, warn: true });
      return r;
    });
    const playing = read.filter(r => r.line.events.length);
    if (playing.length > LIMITS.lines) notes.push({ text: `${where}: ${playing.length} lines, the first ${LIMITS.lines} kept`, warn: true });
    const last = playing.length > LIMITS.lines ? read.indexOf(playing[LIMITS.lines - 1]) : read.length - 1;
    for (const r of read.slice(0, last + 1)) notes.push(...r.said);
    return playing.slice(0, LIMITS.lines).map(r => r.line);
  };
  // A theme (the world's `melody`, or a room's own tune): a line with something to play, at most 40 sounding notes (rests
  // between them kept, rests after the last one dropped), its words, shape and chords.
  const melody = (mel, where) => {
    if (mel === undefined || mel === null) return undefined;
    const r = line(mel, 0, where);
    notes.push(...r.said);
    let l = r.line;
    if (!l.sounding) { notes.push({ text: `${where}: nothing to play`, warn: true }); return undefined; }
    if (l.sounding > LIMITS.themeNotes) {
      notes.push({ text: `${where}: ${l.sounding} notes, the first ${LIMITS.themeNotes} kept`, warn: true });
      let n = 0;
      const cut = l.events.findIndex(e => !e.rest && ++n === LIMITS.themeNotes);
      l = measured({ ...l, events: l.events.slice(0, cut + 1) });
    }
    if (typeof mel.words === "string") l.words = mel.words.trim();
    if (typeof mel.shape === "string") l.shape = mel.shape.trim();
    if (mel.chords !== undefined) {
      const c = line(mel.chords, 0, `${where} chords`);
      notes.push(...c.said);
      if (c.line.sounding) l.chords = c.line; else notes.push({ text: `${where} chords: nothing to play`, warn: true });
    }
    return l;
  };

  // The levels (MUSIC.md §6c): each part's measured loudness, { key: [full, phone] }, written by the step that makes the world (never by
  // the AI: ui/sound/measure.js). One that isn't two numbers is left out; a part with none plays as written.
  const levels = {};
  if (m.levels !== undefined) {
    const given = isObject(m.levels) ? m.levels : {};
    if (!isObject(m.levels)) notes.push({ text: "levels: not a table of parts, left out", warn: true });
    for (const [k, v] of Object.entries(given)) {
      if (Array.isArray(v) && v.length === 2 && v.every(Number.isFinite)) levels[k] = [v[0], v[1]];
      else notes.push({ text: `levels: "${k}" is not two numbers, left out`, warn: true });
    }
  }
  const worldTone = tone(m.tone, "world"), worldLines = lines(m.lines, "world"), world = colour(m.colour, "world", worldId);
  const music = { worldId, mode, key: KEYS[root], scale: `${KEYS[root]} ${mode}`, root, steps: MODES[mode], tempo, beat: 60 / tempo, instruments,
    tone: worldTone ?? "silence", lines: worldLines, colour: world.colour ?? "clean",
    melody: melody(m.melody, "theme"), rooms: {}, modeChoices, colourChoices: world.choices, levels };
  if (!music.melody) notes.push({ text: "no theme" });
  for (const [id, given] of Object.entries(isObject(data.rooms) ? data.rooms : {})) {
    if (!roomIds.includes(id)) { notes.push({ text: `room "${id}" is not in the world: ignored`, warn: true }); continue; }
    const r = isObject(given) ? given : {};
    const tn = tone(r.tone, id), ls = r.lines === undefined ? undefined : lines(r.lines, id), mel = melody(r.melody, `${id} tune`);
    const own = colour(r.colour, id, `${worldId}/${id}`);
    music.rooms[id] = { tone: tn, lines: ls, melody: mel, colour: own.colour, ...(own.choices.length ? { colourChoices: own.choices } : {}) };
  }
  return { music, notes };
}

// The music a game holds (state.music, the world's part; each room's own `music`), read; null when the world has none.
export function musicOf(state) {
  if (state?.music === undefined || state.music === null) return null;
  const rooms = state.world?.rooms || {};
  const own = Object.fromEntries(Object.entries(rooms).filter(([, r]) => r?.music !== undefined).map(([id, r]) => [id, r.music]));
  return readMusic({ music: state.music, rooms: own }, state.worldId, Object.keys(rooms));
}

// ---- What plays where ----------------------------------------------------------------------------------------------
// A step moved k steps up or down the mode (there is no step 0: 1 is the root, -1 the step below it).
export const shiftStep = (st, k) => { const i = (st > 0 ? st - 1 : st) + k; return i >= 0 ? i + 1 : i; };
// A line with each event changed by fn, its tokens written again and its length measured again.
const mapLine = (l, fn) => l && measured({ ...l, events: l.events.map(e => { const x = fn(e); return { ...x, tok: tokOf(x) }; }) });
// A theme brought back changed (MUSIC.md §2.16): on another instrument (`play`), two steps up or down, or slower (half as long again).
// Its chords move with it, except onto another instrument.
export function variant(mel, how, play) {
  if (how === "instrument") return { ...mel, play };
  if (how === "up" || how === "down") {
    const k = how === "up" ? 2 : -2;
    const shift = (e) => e.rest ? e : { ...e, steps: e.steps.map(st => shiftStep(st, k)), ...(e.to !== undefined ? { to: shiftStep(e.to, k) } : {}) };
    return { ...mapLine(mel, shift), chords: mapLine(mel.chords, shift) };
  }
  if (how === "slower") {
    const slow = (e) => ({ ...e, beats: e.beats * 1.5 });
    return { ...mapLine(mel, slow), chords: mapLine(mel.chords, slow) };
  }
  return mel;
}
// A theme moved by k octaves, its chords with it (the engine's reactions: night, a death); an octave out of 1–5 is brought into
// range, as the reader brings it.
export function shiftOctave(mel, k) {
  const move = (l) => l && { ...l, octave: clamp(l.octave + k, ...LIMITS.octave) };
  return { ...move(mel), chords: move(mel.chords) };
}
// The theme in a room (MUSIC.md §2.15–16): its own tune if it has one; a variant, chosen from the world and the room, if it
// has music of its own (lines or a tone); otherwise the theme as written. null when there is no theme.
export function themeIn(music, roomId) {
  const r = music.rooms[roomId] || {};
  if (r.melody) return { mel: r.melody, how: "own", label: "this room's own tune" };
  if (!music.melody) return null;
  if (r.lines === undefined && r.tone === undefined) return { mel: music.melody, how: "written", label: "the theme, as written" };
  const h = hash(music.worldId + "/" + roomId), m = music.melody;
  const others = Object.keys(music.instruments).filter(n => n !== m.play);
  const singers = others.filter(n => SINGERS.includes(music.instruments[n].kind));
  const choices = others.length ? VARIANTS : VARIANTS.slice(1);
  const how = choices[h % choices.length];
  if (how === "instrument") {
    const pool = singers.length ? singers : others, play = pool[(h >>> 8) % pool.length];
    return { mel: variant(m, how, play), how, label: `the theme, on the ${play}` };
  }
  return { mel: variant(m, how), how, label: how === "slower" ? "the theme, slower" : `the theme, two steps ${how === "up" ? "higher" : "lower"}` };
}
// What a room plays (MUSIC.md §2.1): the world's music with the room's own tone, lines and colour where it has them, and the theme there.
export function sceneOf(music, roomId) {
  const r = music.rooms[roomId] || {};
  return { id: roomId, tone: r.tone ?? music.tone, lines: r.lines ?? music.lines, own: r.lines !== undefined, ownTone: r.tone !== undefined,
    theme: themeIn(music, roomId), colour: r.colour ?? music.colour, ownColour: r.colour !== undefined };
}
// The pitch of a step (1 the root, 8 the root an octave up, -1 the step below) in an octave (4: the octave from middle C),
// in the world's key and mode.
export function freqOf(music, step, octave) {
  const n = music.steps.length, i = step > 0 ? step - 1 : step;
  const up = Math.floor(i / n), idx = ((i % n) + n) % n;
  return 440 * 2 ** ((12 * (octave + 1) + music.root + music.steps[idx] + 12 * up - 69) / 12);
}
// Which of a theme's events a part plays, { from, to } (to not included): the whole; the question, up to the event that
// reaches half its beats; the answer, the rest.
export function themePart(mel, part) {
  if (part === "whole") return { from: 0, to: mel.events.length };
  const total = mel.events.reduce((s, e) => s + e.beats, 0);
  let acc = 0, cut = 0;
  for (let i = 0; i < mel.events.length; i++) { acc += mel.events[i].beats; if (acc >= total / 2) { cut = i + 1; break; } }
  return part === "question" ? { from: 0, to: cut } : { from: cut, to: mel.events.length };
}
