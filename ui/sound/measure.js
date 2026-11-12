// The measuring (MUSIC.md §6c): each part rendered offline by the code that plays it live, and its perceived loudness weighed
// (ui/sound/loudness.js). Done once, when a part is made, never while playing:
//   - the parts every world shares and the seven shipped worlds' own: by the developer's tool, `python3 game/tools/music/levels.py`,
//     which writes content/levels.js and worlds/<id>/levels.js (generated, never written by hand);
//   - a world the game's AI writes: by the world-making path, as a step of building it, after the checker: measureWorld(changeSet,
//     worldId) gives back the change set with its music's `levels` (the AI never writes them). The tool measures the shipped worlds
//     with the same function, so there is one path.
// Browser only (an OfflineAudioContext). Each part's randomness (noise, a door's layers) is seeded from its key, so a part measures
// the same every time and the tool's files change only when a part does; a part with chance in it is rendered `loudness.renders`
// times, each seeded apart, and averaged. One render at a time, each let go before the next.
//
//   render(part, seed) → { full, phone }           one render, weighed: mean squares
//   measureParts(parts, onPart, S) → { key: level } one after another, each a level [full, phone] in dB (onPart(part, level, i, n):
//                                                  progress)
//   sharedLevels(S, onPart)                        the shared parts' levels (content/levels.js)
//   worldLevels(S, music, shared, onPart)          a world's own levels, its music as read (js/music.js): its parts the shared lack
//   measureWorld(changeSet, worldId, opts)         the world-making step: the change set, its `add music` with `levels` (opts:
//                                                  { S, shared, onPart, measure }: measure, worldLevels unless a test gives another)

import S0 from "../../content/music.js";
import SHARED from "../../content/levels.js";
import { readMusic } from "../../js/music.js";
import { weighSlices, hash, isLevel, toDb } from "./loudness.js";
import { fixedParts, musicParts } from "./parts.js";

const RATE = 44100;
const round = (v) => Math.round(v * 100) / 100;

// Math.random, seeded (mulberry32), while fn runs: a part's graph is built synchronously, so this covers all its randomness.
function seeded(seed, fn) {
  const was = Math.random;
  let a = seed >>> 0;
  Math.random = () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), a | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { return fn(); } finally { Math.random = was; }
}

export async function render(part, seed = 0, rate = RATE) {
  const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new Offline(1, Math.ceil(rate * part.seconds), rate);       // the three-argument form: Safari's prefixed one takes only this
  seeded(parseInt(hash(part.key), 16) + seed, () => part.play(ctx, ctx.destination));
  const buf = await new Promise((resolve, reject) => {
    ctx.oncomplete = (e) => resolve(e.renderedBuffer);                     // (old Safari: an event, no promise)
    const p = ctx.startRendering();
    if (p && p.then) p.then(resolve, reject);
  });
  const { full, phone } = weighSlices(buf.getChannelData(0), buf.sampleRate, part.slices);
  return { full: 10 ** (full / 10), phone: 10 ** (phone / 10) };
}

// Each part's level: its renders' mean squares averaged, in dB.
async function measureParts(parts, onPart = () => {}, S = S0) {
  const out = {};
  for (const [i, p] of parts.entries()) {
    if (out[p.key]) continue;
    const n = p.chance ? S.loudness.renders : 1;
    let full = 0, phone = 0;
    for (let k = 0; k < n; k++) {
      const r = await render(p, k);
      full += r.full / n; phone += r.phone / n;
      await new Promise(res => setTimeout(res, 0));                        // (the page breathes between renders)
    }
    out[p.key] = [round(toDb(full)), round(toDb(phone))];
    onPart(p, out[p.key], i, parts.length);
  }
  return out;
}

export const sharedLevels = (S = S0, onPart) => measureParts(fixedParts(S), onPart, S);

export function worldLevels(S, music, shared = SHARED.parts, onPart) {
  return measureParts(musicParts(S, music, Object.keys(music.rooms)).filter(p => !isLevel(shared[p.key])), onPart, S);
}

// The world-making step: a world's change set (its effects: `add music`, `add room`s with their own `music`) and its id → the same
// change set, its `add music` given `levels` (whatever was there before is replaced). A world with no music comes back as it was.
export async function measureWorld(changeSet, worldId, { S = S0, shared = SHARED.parts, onPart, measure = worldLevels } = {}) {
  const effects = changeSet.effects ?? [], add = effects.find(e => e.add === "music");
  if (!add) return changeSet;
  const rooms = effects.filter(e => e.add === "room"), own = rooms.filter(r => r.music !== undefined).map(r => [r.id, r.music]);
  const { add: _, levels: __, ...given } = add;
  const { music } = readMusic({ music: given, rooms: Object.fromEntries(own) }, worldId, rooms.map(r => r.id));
  const levels = await measure(S, music, shared, onPart);
  return { ...changeSet, effects: effects.map(e => (e === add ? { add: "music", ...given, levels } : e)) };
}
