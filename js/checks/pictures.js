// Pictures of a world: the endings' pictures and the vision's, the overlays and their descriptions, the figures of things that move, the
// palettes the bible names and the shots name, and the shapes a thing leaves behind when it is removed (BRIEF.md §7). Pure: reads the state,
// never changes it. (What is wrong with one drawing is js/checks/drawings.js.)

import art from "../../content/art.js?v=0.71.0";
import { readFigure, outsideBox, FIGURE, formOf, shapeSpan, thingsOf, awayFrom, isShapeOf } from "../picture.js?v=0.71.0";
import { waysOf } from "../exits.js?v=0.71.0";
import { sideOf, FACINGS } from "../space.js?v=0.71.0";
import { effectsOf, plannedWorld } from "./shared.js?v=0.71.0";
import { drawingProblems, motionChecks, shapeChecks } from "./drawings.js?v=0.71.0";

// What is wrong with the world's pictures: an `end` that names none, or one that doesn't exist; a world that can hurt the player
// and has no `died` picture; a picture, a room's or an ending's, that is badly drawn; an ending with no description (`alt` on its `add picture`, in the
// world file); a room's overlay with no description (`overlayAlt`, on the room); and a picture, or one of its overlays, that
// carries an `alt` itself (pictures.js holds shapes, not words).
// Is a thing drawn as its own shapes in a room's picture (a shape whose id is its id or starts with it and "_": isShapeOf), as a thing too
// long for a sprite is (a pole, oars: BRIEF.md §7, "Overlays")? Then it is no overlay there: the picture paints it while it lies in the room.
export const drawnAsShapes = (room, id) => (room?.picture?.draw || []).some(s => isShapeOf(s?.id, id));
// Does the room's `alt` name a thing that can be taken, where it starts (BRIEF.md §7: a takeable thing is an overlay, never named in the room's alt)?
// Only a thing with a picture to be drawn in as an overlay: not one drawn as its own shapes (drawnAsShapes). tests/worlds.test.js asks the same.
export function altNames(room, o, id) {
  if (!o?.portable || !room?.picture || drawnAsShapes(room, id) || typeof o.name !== "string" || !o.name.trim()) return false;
  return new RegExp(`\\b${o.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "iu").test(room.alt ?? "");
}
// Does a thing that can be taken lack its overlay where it starts: it is in a room with a picture, is not drawn as its own shapes there
// (drawnAsShapes), and the room's picture does not draw it as an overlay (BRIEF.md §7: a takeable thing is an overlay). tests/worlds.test.js asks the same.
export function lacksOverlay(room, id, o) {
  if (!o?.portable || !room?.picture || drawnAsShapes(room, id)) return false;
  return !(room.picture.overlays || []).some(x => x?.object === id);
}

// What is wrong with a thing's `figure` (BRIEF.md §7, "Overlays"): shapes in the short notation that parse, under the figure rules the
// pictures' own shapes keep, and every point inside its box. Reasons only (the caller's view says whose).
function figureChecks(out, figure) {
  const { shapes, problems } = readFigure(figure);
  if (problems.length) { for (const p of problems) out.add("figure.unreadable", p); return; }
  const box = `${FIGURE.width} wide and ${FIGURE.height} tall, (0,0) its top-left corner, its feet on the bottom line, centred on x = ${FIGURE.feet}`;
  for (const [i, sh] of shapes.entries()) {
    const outside = sh.outline ? [] : outsideBox(sh);
    if (outside.length) out.add("figure.outside-box", `shape ${i + 1} (${sh.id ?? Object.keys(sh).find(k => art.draw.shapes.includes(k))}) has points outside its box (${box}): ${outside.slice(0, 4).join("; ")}; draw it inside the box`);
  }
  drawingProblems(out, { draw: shapes });
}

// An overlay of a thing with a `figure` says how tall it is there and where its feet stand (BRIEF.md §7): `tall`, 8 to 136 whole pixels,
// and `at` = [x, y], the feet, inside the picture.
const TALL_MIN = 8, TALL_MAX = 136;
function figuredOverlayChecks(out, overlay, objects) {
  if (typeof objects?.[overlay?.object]?.figure !== "string") return;
  const { width: W, height: H } = art.picture, t = overlay.tall, at = overlay.at, id = overlay.object;
  if (!Number.isInteger(t) || t < TALL_MIN || t > TALL_MAX)
    out.add("overlay.figured", `the overlay "${id}" is a thing with a figure, so it needs \`tall\`, how tall it stands there in whole pixels, ${TALL_MIN} to ${TALL_MAX}${t === undefined ? "" : ` (it has ${JSON.stringify(t)})`}: { "object": "${id}", "at": [feet x, feet y], "tall": 60 }`);
  if (!(Array.isArray(at) && at.length === 2 && at.every(Number.isFinite) && at[0] >= 0 && at[0] < W && at[1] >= 0 && at[1] < H))
    out.add("overlay.figured", `the overlay "${id}" has a figure, so its \`at\` is where its feet stand and must lie inside the picture (x 0 to ${W - 1}, y 0 to ${H - 1}), not ${JSON.stringify(at)}`);
}

export function pictureProblems(state, out) {
  const pictures = state.pictures || {};
  const described = (x) => typeof x === "string" && x.trim();
  // A picture's own `alt`, or an overlay's: pictures are language-free, so the description belongs on the room or the `add picture`.
  const carried = (name, picture, say) => {
    if (picture && typeof picture === "object" && "alt" in picture)
      out.add("picture.carries-alt", `${name}: its picture carries an alt (a picture holds shapes only, no words); ${say}`);
    for (const o of Array.isArray(picture?.overlays) ? picture.overlays : []) if (o && typeof o === "object" && "alt" in o)
      out.add("picture.carries-alt", `${name}: the picture's overlay "${o.object}" carries an alt (a picture holds shapes only, no words); say it on the room (\`overlayAlt.${o.object}\`)`);
  };
  for (const [id, o] of Object.entries(state.world.objects)) if (o && "figure" in o) figureChecks(out.prefixed(`${id}: figure `), o.figure);
  const overlaysDescribed = (name, roomId, overlays) => {
    for (const o of Array.isArray(overlays) ? overlays : []) figuredOverlayChecks(out.prefixed(`${name}: `), o, state.world.objects);
    for (const o of Array.isArray(overlays) ? overlays : [])
      if (!described(state.world.rooms[roomId]?.overlayAlt?.[o?.object]))
        out.add("overlay.no-alt", `${name}: the overlay "${o?.object}" has no alt, its description for screen readers; write it on room "${roomId}" (\`overlayAlt.${o?.object}\`)`);
  };
  // An overlay a rule sets later (`{ draw: "<room>", overlays: [...] }`) counts as the room's too.
  const later = {};
  for (const { effect: e } of effectsOf(state)) if (typeof e.draw === "string" && Array.isArray(e.overlays)) for (const o of e.overlays) (later[e.draw] ??= new Set()).add(o?.object);
  for (const [id, room] of Object.entries(state.world.rooms)) {
    if (room?.overlayAlt && typeof room.overlayAlt === "object") for (const thing of Object.keys(room.overlayAlt))
      if (!(room.picture?.overlays || []).some(o => o?.object === thing) && !later[id]?.has(thing))
        out.add("overlay.alt-orphan", `rooms/${id}: overlayAlt.${thing} describes an overlay the room's picture doesn't have (add { "object": "${thing}", "at": [x, y] } to its overlays, or take the entry out)`);
    for (const o of Object.entries(state.world.objects).filter(([k, x]) => x?.at === id && altNames(room, x, k)).map(([k]) => k))
      out.add("room.alt-names-portable", `rooms/${id}: its alt names "${state.world.objects[o].name}" (${o}), a thing that can be taken: that is an overlay (overlayAlt.${o}), never named in the room's alt (BRIEF.md §7)`);
    for (const [oid, o] of Object.entries(state.world.objects)) if (o?.at === id && lacksOverlay(room, oid, o))
      out.add("overlay.missing-for-portable", `rooms/${id}: "${o.name}" (${oid}) can be taken and starts here, but the room's picture has no overlay for it (add { "object": "${oid}", "at": [x, y] } to its overlays and overlayAlt.${oid} to the room: BRIEF.md §7)`);
    if (!room?.picture) continue;
    carried(`rooms/${id}`, room.picture, "describe it on the room (`alt`)");
    overlaysDescribed(`rooms/${id}`, id, room.picture.overlays);
    const here = thingsOf(state, id);
    drawingProblems(out.prefixed(`rooms/${id}: `), room.picture, state.world.objects, here, awayFrom(state, id, here));
  }
  let hurts = null;
  for (const { effect: e, where } of effectsOf(state)) {
    if (typeof e.draw === "string" && Array.isArray(e.overlays)) {      // an edit that sets a room's overlays
      carried(where, { overlays: e.overlays }, "say it");
      overlaysDescribed(where, e.draw, e.overlays);
    }
    if (e.end === true) {
      if (typeof e.picture !== "string") out.add("end.no-picture", `${where}: ends the story without naming its picture (end: true, picture: "…")`);
      else if (!pictures[e.picture]) out.add("end.unknown-picture", `${where}: ends the story with picture "${e.picture}", which the world doesn't have`);
    }
    const lowers = typeof e.set === "string" && e.set === "player.health" && ((typeof e.add === "number" && e.add < 0) || (typeof e.to === "number" && e.to < 5));
    if ((typeof e.hurt === "number" || typeof e.hurt === "string") || lowers) hurts ??= where;
  }
  for (const [id, c] of Object.entries(state.conditions || {})) if (c?.health && "hurt" in c.health) hurts ??= "condition " + id;
  if (hurts && !pictures.died) out.add("end.died-missing", `${hurts} can hurt the player, so the world needs a "died" picture (the ending when health runs out)`);
  // A vision's picture (`dream: { picture }` on a room or a thing you sleep in: ARCHITECTURE.md §5 "Sleep") is one the world adds.
  for (const [kind, all] of [["rooms", state.world.rooms], ["objects", state.world.objects]])
    for (const [id, x] of Object.entries(all)) {
      const pic = x?.dream?.picture;
      if (typeof pic === "string" && !pictures[pic]) out.add("dream.unknown-picture", `${kind}/${id}: its dream shows picture "${pic}", which the world doesn't have (add picture)`);
    }
  for (const [id, p] of Object.entries(pictures)) {
    if (!described(p?.alt)) out.add("picture.no-alt", `pictures/${id}: has no alt, the description of the picture for screen readers; write it on its \`add picture\` (\`alt\`)`);
    carried(`pictures/${id}`, p?.picture, "describe it on its `add picture` (`alt`)");
    drawingProblems(out.prefixed(`pictures/${id}: `), p?.picture);
  }
}

// A world's main palette, the one its cover is drawn in (docs/splash/PLAN.md): the palette named most often by its rooms' `shot` lines (shotPalette);
// on a tie the start room's if it is one of them, else the first named; none named: the start room's, else the first of the bible's `palettes` line;
// null when there is none. { name, counts } (counts: each palette's rooms, most first).
export function mainPalette(state, bible) {
  const counts = new Map(), first = [];
  for (const room of Object.values(state.world.rooms)) {
    const n = shotPalette(room?.picture?.shot);
    if (n) { if (!counts.has(n)) first.push(n); counts.set(n, (counts.get(n) ?? 0) + 1); }
  }
  const sorted = first.map((n, i) => [n, counts.get(n), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]);
  const start = shotPalette(state.world.rooms[state.player.at]?.picture?.shot);
  const top = sorted.filter(s => s[1] === sorted[0]?.[1]).map(s => s[0]);
  const name = !sorted.length ? start ?? biblePalettes(bible)?.[0] ?? null : top.includes(start) ? start : top[0];
  return { name, counts: Object.fromEntries(sorted.map(s => [s[0], s[1]])) };
}

// The warnings for the world's pictures, a room's and an ending's, with the names the problems use. Only for a world written under the
// current BRIEF.md §7: some picture's shot plans its motion (a "moves:" part), or the bible has a `palettes` line. The repo's earlier worlds draw
// some motion and plan none, and would each be warned of every picture; a new world's stub pictures (one rectangle a room, no shot) are warned of
// by the second test, so a checker that is otherwise green still says the pictures aren't drawn.
export function pictureWarnings(state, bible, out) {
  const all = [...Object.entries(state.world.rooms).map(([id, r]) => [`rooms/${id}`, r?.picture]), ...Object.entries(state.pictures || {}).map(([id, p]) => [`pictures/${id}`, p?.picture])]
    .filter(([, pic]) => pic && typeof pic === "object");
  if (!all.some(([, pic]) => /moves:/i.test(typeof pic.shot === "string" ? pic.shot : "")) && !biblePalettes(bible)) return;
  for (const [name, pic] of all) {
    const view = out.prefixed(`${name}: `);
    motionChecks(view, pic);
    shapeChecks(view, pic, bible?.style ?? (bible ? "dithered" : null), name.startsWith("pictures/"));
  }
  waySideWarnings(state, out);   // (the same gate: an earlier world's pictures were drawn before the facing was asked)
}

// A way that is a thing (a thing with `door` or `leads` in a compass direction) and is drawn in its room's picture is drawn on the side its direction lies
// in the picture's `facing` (north when it has none; BRIEF.md §7, "Pictures face north"): a way to the left with the middle of its shapes left of the
// picture's middle, a way to the right right of it, a way behind you not drawn at all; a way ahead may be anywhere, and up and down are not asked. Its shapes
// are those whose id is the thing's id or starts with "<id>_" (its open drawing too: formOf). A warning for each way, naming the room, the thing, its
// direction, where it is drawn and where it should be.
const SIDE_WORDS = { ahead: "ahead", right: "on the right", left: "on the left", behind: "behind you" };
const FACING_NAMES = { n: "north", e: "east", s: "south", w: "west" };
export function waySideWarnings(state, out) {
  const objects = state.world.objects, middle = art.picture.width / 2;
  for (const [roomId, room] of Object.entries(state.world.rooms)) {
    const draw = room?.picture?.draw;
    if (!Array.isArray(draw) || !draw.length) continue;
    const here = thingsOf(state, roomId), has = (id) => here.has(id);          // (a shape is a thing's drawing only for a thing of this room)
    const facing = FACINGS.includes(room.picture.facing) ? room.picture.facing : "n";   // (a facing that is none of the four is the fields' to tell)
    const spans = new Map();                                                          // thing id → [left, right] over all its shapes
    for (const s of draw) {
      const f = formOf(s?.id, has), span = shapeSpan(s);
      if (!f || !span) continue;
      const w = spans.get(f.id);
      spans.set(f.id, w ? [Math.min(w[0], span[0]), Math.max(w[1], span[1])] : span);
    }
    for (const [id, o] of Object.entries(objects)) {
      const span = spans.get(id);
      if (o?.at !== roomId || !span) continue;
      const x = (span[0] + span[1]) / 2, drawn = x < middle ? "left" : x > middle ? "right" : "middle";
      for (const dir of waysOf(o)) {
        const side = sideOf(facing, dir);
        if (side === null || side === "ahead" || (side === "left" && x < middle) || (side === "right" && x > middle)) continue;
        const fits = FACINGS.filter(f => { const t = sideOf(f, dir); return t === "ahead" || (t === "left" && x < middle) || (t === "right" && x > middle); });
        const drawnAt = side === "behind" ? "it is drawn" : `it is drawn ${drawn === "middle" ? "in the middle" : "on the " + drawn} (the middle of its shapes is x = ${x})`;
        const fix = side === "behind" ? "take its drawing out (a way behind you is not drawn)" : `draw it on the ${side} (x ${side === "left" ? "<" : ">"} ${middle})`;
        out.add("picture.way-side", `rooms/${roomId}: ${o.name ?? id} (${id}) is the way ${FACING_NAMES[dir]}, which lies ${SIDE_WORDS[side]} in a picture facing ${FACING_NAMES[facing]}, but ${drawnAt}: ${fix}, or, if the room's text describes the picture facing another way, give the picture the \`facing\` it describes${fits.length ? ` (this drawing fits "facing": ${fits.map(f => `"${f}"`).join(" or ")})` : ""}`);
      }
    }
  }
}

// The palette a room's `shot` names, by the palette table's names (content/art.js `palettes`): a bare name between semicolons ("...; lamplight; one
// lantern..."), with a modifier after a comma ("gaslight, haze") or not, or "<name> palette" ("forest palette"), or "palette <name>" ("Palette lamplight."). The first one named, in the order of the
// text (a view out may name the sky's after the room's); null when none is.
export function shotPalette(shot) {
  if (typeof shot !== "string") return null;
  const names = new Set(art.palettes);
  let found = null;
  for (const part of shot.split(";")) {
    const bare = part.trim().split(",")[0].trim().toLowerCase();
    const low = part.toLowerCase(), words = [...(low.match(/\b([a-z]+) palette\b/g) || []).map(m => m.split(" ")[0]), ...(low.match(/\bpalette:? ([a-z]+)\b/g) || []).map(m => m.split(/:? /)[1])];
    const named = names.has(bare) ? bare : words.find(n => names.has(n));
    if (named) { found = named; break; }
  }
  return found;
}
// The names a bible's `palettes` line gives: "lamplight: the gas-lit rooms; cellar: below stairs" (or a list of such entries): each entry's name before its colon.
export function biblePalettes(bible) {
  const line = bible?.palettes;
  if (line == null) return null;
  const entries = Array.isArray(line) ? line : typeof line === "string" ? line.split(";") : [];
  return entries.map(e => String(e).split(":")[0].trim().toLowerCase()).filter(Boolean);
}

// Warnings, never problems (an older world has no `palettes` line, and none is asked of it): a room picture whose `shot` names a palette the bible's
// `palettes` doesn't list, and a `palettes` entry the palette table doesn't have. Endings' pictures are exempt (BRIEF.md §7, "Colour").
export function paletteWarnings(state, bible, out) {
  const listed = biblePalettes(bible);
  if (!listed) return;
  for (const n of listed.filter(n => !art.palettes.includes(n))) out.add("palette.unknown-name", `bible: palettes names "${n}", which the palette table (BRIEF.md §7) doesn't have`);
  for (const [id, room] of Object.entries(state.world.rooms)) {
    const n = shotPalette(room?.picture?.shot);
    if (n && !listed.includes(n)) out.add("palette.not-listed", `rooms/${id}: its shot names the palette "${n}", which the bible's palettes (${listed.join(", ") || "none"}) don't list; use one of them, or add it to the bible's palettes line`);
  }
}

// A picture change (`{ draw: "<room>", remove: [...] }`) that removes some shapes of a thing and leaves others of the same thing in the picture: a thing's shapes
// are those whose id is its own id or starts with "<id>_" (formOf: the longest id of a thing of that room, so "chest_key_lid" is the key's, not the chest's;
// "jag_body" and "jag_head" are the thing jag's, not those of any text before the first "_"). A thing that leaves, or is taken, takes all its shapes with it
// by itself (js/picture.js, roomDraw); one removed for good by a rule goes all at once, with the pattern "jag_*" (BRIEF.md §7). A warning naming the shapes left behind.
export function removalWarnings(state, out) {
  // (only for a world whose shots plan their motion, like the other picture warnings: the earlier worlds name shapes as they pleased)
  if (!plannedWorld(state)) return;
  for (const { effect: e, where } of effectsOf(state)) {
    if (typeof e.draw !== "string" || !Array.isArray(e.remove)) continue;
    const here = thingsOf(state, e.draw), has = (id) => here.has(id), group = (id) => formOf(id, has)?.id ?? null;
    const ids = (state.world.rooms[e.draw]?.picture?.draw || []).map(x => x?.id).filter(Boolean);
    const gone = new Set(e.remove.flatMap(r => typeof r === "string" && r.length > 1 && r.endsWith("*") ? ids.filter(i => i.startsWith(r.slice(0, -1))) : [r]));
    for (const g of new Set([...gone].map(group).filter(Boolean))) {
      const left = ids.filter(i => group(i) === g && !gone.has(i));
      if (left.length) out.add("picture.partial-removal", `${where}: removes some of the shapes of ${g} from ${e.draw} and leaves ${left.join(", ")}: a thing's shapes all start with its own id, and its removal is "${g}_*"`);
    }
  }
}
