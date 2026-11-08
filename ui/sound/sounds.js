// The sounds (docs/sound/PLAN.md, build 1): a short sound for a moment the screen already shows (a thing picked up or put down,
// eaten or drunk, a hurt, a heal, a condition starting or ending, a door, a lid, a puzzle solved), each made of the music's own kinds
// (ui/sound/synth.js, `note`) in the world's key and mode. Plain functions of the kit and a destination: no globals, no knowledge
// of the game. They are told what to play in plain terms, `{ kind, material, weight }` (ui/sound.js, soundsOf, reads the moment), and
// a key, `{ root, steps }` (the world's music's, js/music.js; or the spec's `sounds.key`). Every number is the spec's
// (content/music.js, `sounds`: one table, `moments`, from a kind to its notes). Any randomness is the synth's, never the game's.
//
//   planOf(list, key, S) → [{ kind, inst, f, toF, t, dur, share }]   what plays, as numbers: t from the first sound's start (no audio)
//   playSounds(kit, dest, list, key, t0)                              the plan made sound, from audio time t0

import { freqOf } from "../../js/music.js";
import { note } from "./synth.js";

// A material's instrument: the spec's, or the generic one for none or a word it doesn't have.
export const materialOf = (name, S) => S.sounds.materials[name] ?? S.sounds.materials.generic;

// The notes of each sound in a moment, in its order, `spacing` apart, at most `most`. A kind the table doesn't have plays nothing.
export function planOf(list, key, S) {
  const O = S.sounds, out = [], pitch = (step, octave) => freqOf(key, step, octave);
  list.slice(0, O.most).forEach((s, k) => {
    const notes = O.moments[s.kind];
    if (!notes) return;
    const m = materialOf(s.material, S);
    const W = O.weight, weight = s.kind === "hurt" ? W.base + W.per * (Math.min(W.most, Math.max(1, s.weight ?? 1)) - 1) : 1;
    for (const n of notes) {
      const own = n.play === "material", inst = own ? m : O.voices[n.play];
      if (!inst) continue;
      const octave = own ? m.octave + (n.shift ?? 0) : n.octave ?? 4;
      out.push({ kind: s.kind, inst, f: pitch(n.step, octave), toF: n.to !== undefined ? pitch(n.to, octave) : undefined,
                 t: k * O.spacing + (n.at ?? 0), dur: n.length ?? inst.length ?? O.length,
                 share: (inst.level ?? 1) * (n.level ?? 1) * weight });
    }
  });
  return out;
}

// The plan made sound, on `dest`, from audio time t0.
// Steady: the music's shared pitch (unwell, the wobble: kit.pitch) is the music's, not theirs.
export function playSounds(kit, dest, list, key, t0) {
  const steady = { ...kit, pitch: null };
  for (const p of planOf(list, key, kit.S)) note(steady, dest, p.inst, p.f, t0 + p.t, p.dur, p.share, { toF: p.toF });
}
