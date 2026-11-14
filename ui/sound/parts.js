// The parts (MUSIC.md §6c): each a thing that makes sound on its own and has a level (ui/sound/loudness.js), with its key (made from
// its numbers, so the same part in two worlds is one key), its group (its target: content/music.js, `loudness`) and how to play it
// alone for the measuring (ui/sound/measure.js), with the same code the player plays it with live, through the same low-pass. Plain
// functions of the spec and a world's music: no globals, no knowledge of the game. The player only needs the keys.
//
//   instrumentPart(S, music, inst, octave, box, name)  a world's instrument at an octave (box: as the music box plays it): its notes
//                                                     1, 3 and 5 in the world's key and mode, one a slice (a noise kind: eight
//                                                     hits, for its chance)
//   tonePart(S, name)                                  a room tone, for whole cycles of its slowest sway (toneSeconds), in 4 s slices
//   referencePart(S, box)                              the spec's reference notes (`loudness.reference`), clean: what a colour is
//                                                      matched to
//   colourPart(S, name)                                the reference notes through a colour (its gain: the reference's loudness less
//                                                      its own)
//   soundParts(S, key)                                 every sound's instrument at the octave the table plays it (`sounds.moments`,
//                                                      each material), in a key ({ root, steps }: a world's, or the spec's);
//                                                      soundId(p) finds a planned note's. In each world's
//                                                      key: a sound whose notes sit near 300 Hz comes out up to 4 dB louder a few
//                                                      semitones up (a phone hears it)
//   musicParts(S, music, roomIds)                      a world's parts, room by room in the order given: each scene's instruments
//                                                      (its theme's also an octave lower, as night, worse than unwell and a death
//                                                      play it), tone and colour (with its reference); then its sounds, in its key
//   fixedParts(S)                                      the parts every world shares: the room tones, the colours, and the sounds in
//                                                      the spec's key (a world with no music)
// A part: { key, group: "notes" | "rhythm" | "tones" | "sounds" | "colours" | "reference", label, seconds, slices, play(ctx, dest), ref?,
// chance (randomness in its sound: measured several times over) }.

import { NOISES, TONES, COLOURS, LIMITS, freqOf, themeIn } from "../../js/music.js?v=0.49.3";
import { makeKit, note, filt } from "./synth.js?v=0.49.3";
import { makeTone } from "./tones.js?v=0.49.3";
import { makeColour } from "./colours.js?v=0.49.3";
import { planOf, playNote, EFFECT_KINDS } from "./sounds.js?v=0.49.3";
import { keyOf, stable } from "./loudness.js?v=0.49.3";

const lowpass = (ctx, S, f = S.lowpass.frequency) => filt(ctx, "lowpass", f, S.lowpass.q);
const lead = 0.02;                                 // each slice's sound starts this far in
// A part with chance in its sound (noise, a door's or a crunch's random layers) is played this many times, one a slice, `each` apart at least, and their
// loudness averaged: measured five times over, every part then moved by about 0.3 dB at most (sd) — MUSIC.md §6c.
const CHANCE = 8, EACH = 0.6;
// A door or eating (`foley`: a whole sound whose layers, waits and grains are all picked each play): twice as many.
const WHOLE = ["foley"];

// What a note of this instrument is (the music box's own when it plays it): decaying or held, and whether chance is in its sound.
function shape(S, inst, box) {
  const noise = NOISES.includes(inst.kind), played = box && !noise ? { ...inst, kind: S.box.kind, release: S.box.release } : inst;
  const K = S.kinds[played.kind] || S.kinds.struck;
  return { noise, held: !noise && !K.decay };
}

export function instrumentPart(S, music, inst, octave, box = false, name = inst.kind) {
  const { noise, held } = shape(S, inst, box);
  const steps = noise ? Array.from({ length: CHANCE }, (_, k) => [1, 3, 5][k % 3]) : [1, 3, 5];   // (a blown note's breath: too small to need more)
  const len = held ? Math.max(1.5, inst.attack + 1) : noise ? 0.5 : 0.8;
  const each = held ? len + Math.min(inst.release, 2) + 0.3 : noise ? EACH + 0.1 : 1;
  const freqs = steps.map(st => freqOf(music, st, octave));
  const { kind, ratio, bright, attack, release } = inst;
  const numbers = { inst: { kind, ratio, bright, attack, release }, freqs: freqs.slice(0, 3), steps: steps.length, box: box && !noise ? S.box : undefined,
    spec: { note: S.note, kind: S.kinds[kind], noises: noise ? S.noises : undefined, lowpass: S.lowpass, waves: S.waves } };
  return { key: keyOf("instrument", numbers), group: noise ? "rhythm" : "notes", label: `${name} (${kind}, octave ${octave}${box && !noise ? ", music box" : ""})`,
    seconds: each * steps.length, slices: steps.length, held, noise, chance: noise || held,
    play(ctx, dest) {
      const kit = makeKit(ctx, S), lp = lowpass(ctx, S); lp.connect(dest);
      freqs.forEach((f, k) => note(kit, lp, inst, f, k * each + lead, len, 1, { box }));
    } };
}

// A tone is rendered for whole cycles of its slowest sway or sweep (where its level and colour come back round: wind's 22 s, fog's
// 17), at least 8 s, in slices of about 4 s (each long enough for a cave's drips): within 0.5 dB of 24 s in six slices.
export function toneSeconds(T) {
  const rates = [];
  (function walk(o) { for (const [k, v] of Object.entries(o || {})) if ((k === "sway" || k === "sweep") && Array.isArray(v)) rates.push(v[0]); else if (v && typeof v === "object" && !Array.isArray(v)) walk(v); })(T);
  const cycle = rates.length ? 1 / Math.min(...rates) : 8;
  return Math.ceil(8 / cycle - 1e-9) * cycle;
}
export function tonePart(S, name) {
  const seconds = toneSeconds(S.tones[name]);
  return { key: keyOf("tone", { name, tone: S.tones[name], lowpass: S.lowpass, noise: S.noiseSeconds }), group: "tones", label: name.replace("_", " "),
    seconds, slices: Math.max(2, Math.round(seconds / 4)), chance: true,
    play(ctx, dest) {
      const kit = makeKit(ctx, S), lp = lowpass(ctx, S); lp.connect(dest);
      makeTone(kit, name, lp).tick(0, seconds);
    } };
}

// The reference notes (S.loudness.reference: [{ inst, octave, steps }]) in the spec's key, one a slice, into `dest` (box: as the music
// box plays them).
function referenceNotes(S) {
  const R = S.loudness.reference, out = [];
  for (const r of R.notes) for (const st of r.steps) out.push({ inst: r.inst, f: freqOf(S.sounds.key, st, r.octave) });
  return out;
}
function referencePart(S, box = false) {
  const notes = referenceNotes(S), each = S.loudness.reference.each, seconds = each * notes.length;
  return { key: keyOf("reference", { ref: S.loudness.reference, box: box ? S.box : undefined, note: S.note, kinds: S.kinds, lowpass: S.lowpass, waves: S.waves }),
    group: "reference", label: "the reference notes" + (box ? " (music box)" : ""), seconds, slices: notes.length, notes, chance: true,
    play(ctx, dest, into) {
      const kit = makeKit(ctx, S), lp = lowpass(ctx, S); lp.connect(dest);
      const to = into ? into(kit, lp) : lp;
      notes.forEach((n, k) => note(kit, to, n.inst, n.f, k * each + lead, S.loudness.reference.length, 1, { box }));
    } };
}
export function colourPart(S, name) {
  const ref = referencePart(S, name === "music_box");
  return { key: keyOf("colour", { name, colour: S.colours[name], shaper: S.colours.shaper, ref: ref.key }), group: "colours", label: name.replace("_", " "),
    ref: ref.key, refPart: ref, seconds: ref.seconds, slices: ref.slices, chance: true,
    play(ctx, dest) {
      ref.play(ctx, dest, (kit, lp) => { const c = makeColour(kit, name); c.output.connect(lp); c.tick(0, ref.seconds); return c.input; });
    } };
}

// A planned sound note's part: its instrument at its octave.
export const soundId = (p) => stable({ inst: p.inst, octave: p.octave });
const soundCache = new WeakMap();
export function soundParts(S, key = S.sounds.key) {
  const cache = soundCache.get(S) ?? soundCache.set(S, new Map()).get(S), id0 = stable({ root: key.root, steps: key.steps });
  if (cache.has(id0)) return cache.get(id0);
  const O = S.sounds, byId = new Map();
  const materials = [...Object.keys(O.materials), undefined];
  for (const kind of Object.keys(O.moments)) for (const material of materials) for (const p of planOf([{ kind, material }], key, S)) {
    const id = soundId(p);
    if (byId.has(id)) continue;
    const chance = NOISES.includes(p.inst.kind) || EFFECT_KINDS.includes(p.inst.kind) || !!S.kinds[p.inst.kind]?.breath;
    const n = chance ? CHANCE * (WHOLE.includes(p.inst.kind) ? 2 : 1) : 1, each = chance ? Math.max(EACH, p.dur + 0.35) : Math.max(1, p.dur + 0.5), one = { ...p, share: 1 };
    byId.set(id, { key: keyOf("sound", { id, dur: p.dur, toF: p.toF, f: p.f, spec: { note: S.note, noises: S.noises, kinds: O.kinds, lowpass: O.lowpass, kind: S.kinds[p.inst.kind] } }),
      group: "sounds", label: `${describe(O, p.inst)} (${p.inst.kind}${p.f === undefined ? "" : `, octave ${p.octave}`})`, seconds: each * n, slices: n, note: one, dur: p.dur, id, chance,
      play(ctx, dest) {
        const kit = makeKit(ctx, S), lp = lowpass(ctx, S, O.lowpass); lp.connect(dest);
        for (let k = 0; k < n; k++) playNote(kit, lp, one, k * each + lead);
      } });
  }
  cache.set(id0, byId);
  return byId;
}
// Which of the table's instruments it is: a material, a voice, or a voice's shape for a material.
function describe(O, inst) {
  for (const [m, v] of Object.entries(O.materials)) if (v === inst) return m;
  for (const [n, v] of Object.entries(O.voices)) {
    if (v === inst) return n;
    for (const [m, as] of Object.entries(v.as || {})) if (stable(inst) === stable({ ...v, ...as })) return n + ", " + m;
  }
  return "?";
}

// The octaves a theme moves by (S.reactions: lower at night, worse than unwell, at a death), as js/music.js's shiftOctave brings
// them into range.
const shiftsOf = (S) => [...new Set([0, S.reactions.night.octave, S.reactions.unwell.worse.octave, S.reactions.ending.death.octave])];
const within = (o) => Math.min(LIMITS.octave[1], Math.max(LIMITS.octave[0], o));

export function musicParts(S, music, roomIds = []) {
  const out = new Map(), add = (p) => { if (p && !out.has(p.key)) out.set(p.key, p); };
  const inst = (name, octave, box) => { const i = music.instruments[name]; if (i) add(instrumentPart(S, music, i, octave, box, name)); };
  for (const id of [...roomIds, undefined]) {
    const r = music.rooms[id] || {}, tone = r.tone ?? music.tone, colour = r.colour ?? music.colour, box = colour === "music_box";
    const lines = r.lines ?? music.lines;
    for (const l of lines) inst(l.play, l.octave, box);
    const th = themeIn(music, id)?.mel;
    if (th) for (const k of shiftsOf(S)) { inst(th.play, within(th.octave + k), box); if (th.chords) inst(th.chords.play, within(th.chords.octave + k), box); }
    if (tone && tone !== "silence" && S.tones[tone]) add(tonePart(S, tone));
    if (colour && colour !== "clean" && S.colours[colour]) { const c = colourPart(S, colour); add(c.refPart); add(c); }
  }
  for (const p of soundParts(S, { root: music.root, steps: music.steps }).values()) add(p);
  return [...out.values()];
}
const fixedCache = new WeakMap();
export function fixedParts(S) {
  if (fixedCache.has(S)) return fixedCache.get(S);
  const out = [];
  for (const t of TONES) if (t !== "silence" && S.tones[t]) out.push(tonePart(S, t));
  for (const c of COLOURS) if (c !== "clean" && S.colours[c]) { const p = colourPart(S, c); out.push(p.refPart, p); }
  out.push(...soundParts(S).values());
  const list = out.filter((p, i) => out.findIndex(q => q.key === p.key) === i);
  fixedCache.set(S, list);
  return list;
}
