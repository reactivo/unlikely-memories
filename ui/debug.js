// The debug panel (ARCHITECTURE.md §7, "The debug panel"; INTERFACE.md §14): a floating bar for trying things in any world,
// opened by typing /debug at the prompt. Loaded only when first opened (js/main.js imports it then), with its stylesheet
// (ui/debug.css). Never part of the game: it changes the game only through the controller's small interface `dev` (below),
// which runs the engine's own effects (js/debug.js), so the state stays valid and saves as usual. The game knows nothing of it.
//
// What `dev` gives it (js/main.js, the debug panel's block):
//   dev.state()             the game now (read only), or null
//   dev.pack()              its language pack
//   dev.now()               play time now (ms), for the live clock
//   dev.run(effects, opts)  one moment of these effects (js/debug.js, moment): told in the story (opts.note: a dim line first),
//                           kept for UNDO and saved; opts.tell false: only what the world said on its own is told; opts.undo false
//   dev.sound()             the music playing (ui/sound.js, debug): info(), theme(), ending(death), wake(), mute(part, on), muted(),
//                           sound({ kind, material }) and the kinds and materials to try
//   dev.crt()               the CRT look (ui/crt.js): { settings(), defaults(), ranges, set(values | null) }; the settings now in effect,
//                           content/art.js's, the range of each, and set() puts these over the defaults (null: the defaults) and
//                           draws the picture and the thumbnails again at once
//   dev.languages()         the languages this world is written in
//   dev.language(lang)      a new game of this world in that language
//
// It remembers itself on this device (localStorage, "parser-debug"): open or collapsed, where it is, its settings and which
// sections are open, the CRT look's values (crt: null until one is changed). Closing it with × forgets all of that, the CRT look's
// values too (art.js's come back); /debug opens it fresh.

import * as debug from "../js/debug.js?v=0.49.0";
import { parts, hhmm } from "../js/time.js?v=0.49.0";
import { text } from "../js/narrator.js?v=0.49.0";
import { FONTS, DEFAULT as DEFAULT_FONT, useFont } from "../js/fonts.js?v=0.49.0";
import { touch } from "./media.js?v=0.49.0";

const KEY = "parser-debug";   // what this device remembers (js/main.js reads it too, to open the panel again on a reload)
// font, logRem, logLine, letter: the Typography section's (null: the font's own value). (logRem: the story's size in rem; until
// 5 Nov 2026 it was a size in px, under another name, which is now ignored.) crt: the CRT section's settings, all of them (null: art.js's).
const DEFAULTS = { collapsed: false, x: null, y: null, sections: {}, instant: false, nudge: true, motion: "system", rules: false, wholeMap: false,
                   font: DEFAULT_FONT, logRem: null, logLine: null, letter: null, crt: null };
const SECTIONS = ["picture", "crt", "music", "events", "travel", "inventory", "time", "inspect", "page", "typography", "settings"];

// What this device remembers, or null (nothing, or storage blocked).
function recall() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v === "object" ? { ...DEFAULTS, ...v } : null; }
  catch (e) { return null; }
}
function keep(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
function forget() { try { localStorage.removeItem(KEY); } catch (e) {} }

// What the panel says once the story is over: its game actions do nothing then (the engine refuses a moment after the end), so
// they are disabled and this line says why. Its own controls (–, ×, dragging, the settings) keep working.
const ENDED = "The story has ended: UNDO or a new game.";

// A small element: tag, class, text, attributes.
function el(tag, cls, label, attrs = {}) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (label !== undefined) e.textContent = label;
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
// A button that runs `act` when clicked; `pressed`: a toggle, shown on or off; `key`: what it does, the same from one drawing to
// the next (morph, below, keeps the button that is on the page when its key is the same); `off`: disabled.
function button(label, act, pressed, key, off = false) {
  const b = el("button", "", label, { type: "button" });
  if (pressed !== undefined) b.setAttribute("aria-pressed", String(!!pressed));
  if (key) b.dataset.key = key;
  if (off) b.disabled = true;
  b.addEventListener("click", act);
  return b;
}
// A row: a label, then its controls.
function row(label, ...controls) {
  const r = el("div", "row");
  if (label) r.append(el("span", "label", label));
  const c = el("span", "controls");
  c.append(...controls);
  r.append(c);
  return r;
}
// A checkbox with its label.
function check(label, on, act) {
  const l = el("label", "check"), box = el("input", "", undefined, { type: "checkbox" });
  box.checked = !!on;
  box.addEventListener("change", () => act(box.checked));
  l.append(box, document.createTextNode(" " + label));
  return l;
}

// Bring what is on the page in line with a fresh drawing of it, changing only what differs: an element whose tag and key are the
// same stays (with its listeners, the focus, a finger or the mouse pressed on it), its attributes and text brought up to date;
// anything else is replaced. The panel is drawn again after every change of the game, a condition's tick too, and replacing every
// button then took away the one being pressed: the press was lost, the click never came (Diego, 3 Nov 2026). So every button's
// action reads the game at the moment it is clicked (never the state it was drawn from), and a kept button does what it says.
function morph(into, fresh) {
  const old = [...into.childNodes];
  if (old.length !== fresh.length || old.some((o, i) => !alike(o, fresh[i]))) { into.replaceChildren(...fresh); return; }
  old.forEach((o, i) => sync(o, fresh[i]));
}
const alike = (a, b) => a.nodeType === b.nodeType && (a.nodeType !== 1 || (a.tagName === b.tagName && a.getAttribute("data-key") === b.getAttribute("data-key")));
function sync(a, b) {
  if (a.nodeType !== 1) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
  for (const { name } of [...a.attributes]) if (!b.hasAttribute(name)) a.removeAttribute(name);
  for (const { name, value } of [...b.attributes]) if (a.getAttribute(name) !== value) a.setAttribute(name, value);
  if (a.tagName === "INPUT") a.checked = b.checked;
  morph(a, [...b.childNodes]);
  if (a.tagName === "SELECT" && document.activeElement !== a) a.value = b.value;
}


// Build the panel (hidden) and add it to the page. Returns open(), update(), showsRules() and wholeMap().
export function mount(dev) {
  const css = el("link", "", undefined, { rel: "stylesheet", href: new URL("./debug.css?v=0.49.0", import.meta.url).href });
  document.head.append(css);
  const html = document.documentElement;
  let v = null;                                    // what it remembers while open (null: closed)

  const root = el("section", "debug", undefined, { "aria-label": "Debug panel", hidden: "" });
  const bar = el("header", "bar");
  const title = el("h2", "title", "Debug");
  const fold = el("button", "fold", "–", { type: "button", "aria-label": "Collapse the debug panel", "aria-expanded": "true" });
  const close = el("button", "close", "×", { type: "button", "aria-label": "Close the debug panel" });
  bar.append(title, fold, close);
  const body = el("div", "body");
  const ended = el("p", "ended", ENDED, { role: "status", hidden: "" });
  body.append(ended);
  const parts$ = {};                               // each section's content, filled by draw()
  for (const id of SECTIONS) {
    const d = el("details", "section", undefined, { "data-section": id });
    d.append(el("summary", "", id === "crt" ? "CRT" : id.charAt(0).toUpperCase() + id.slice(1)));
    parts$[id] = el("div", "content");
    d.append(parts$[id]);
    d.addEventListener("toggle", () => {
      if (!v) return;
      v.sections[id] = d.open; keep(v);
      const st = s();
      if (d.open && st) drawSection(id, st, dev.pack());          // opened: drawn now (closed ones are not drawn as the game moves)
    });
    body.append(d);
  }
  root.append(bar, body);
  document.body.append(root);

  // The panel's keys and clicks are its own: the command line doesn't take the focus or the keys from its fields (ui/prompt.js),
  // and Esc doesn't restart the game (ui/keys.js).
  for (const kind of ["keydown", "keyup", "click"]) root.addEventListener(kind, (e) => e.stopPropagation());
  // While you type on a touch screen, a tap on one of its buttons keeps the keyboard open, as a tap on the story's buttons does
  // (ui/prompt.js): the tap would take the focus from the command line, the keyboard closing moved the page and the panel under
  // the finger, and the tap was lost.
  root.addEventListener("mousedown", (e) => {
    const a = document.activeElement;
    if (touch.matches && a && !root.contains(a) && a.matches("input, textarea") && e.target.closest("button")) e.preventDefault();
  });

  // ---- Settings, as the page shows them ----
  function apply() {
    html.toggleAttribute("data-debug-instant", !!v?.instant);   // ui/debug.css: no fading in of story text
    html.toggleAttribute("data-debug-rules", !!v?.rules);       // ui/debug.css: the rule lines show
    html.toggleAttribute("data-debug-no-nudge", v ? v.nudge === false : false);   // ui/follow.js, resync: off only to test it
    if (v && v.motion !== "system") html.dataset.motion = v.motion === "reduce" ? "reduce" : "full";   // ui/scene.js, calm()
    else delete html.dataset.motion;
    crtApply();
    root.toggleAttribute("data-collapsed", !!v?.collapsed);
    fold.textContent = v?.collapsed ? "+" : "–";
    fold.setAttribute("aria-expanded", String(!v?.collapsed));
    fold.setAttribute("aria-label", v?.collapsed ? "Expand the debug panel" : "Collapse the debug panel");
    if (v && v.x !== null && v.y !== null) place(v.x, v.y);
    else { root.removeAttribute("data-placed"); root.style.removeProperty("--debug-x"); root.style.removeProperty("--debug-y"); }
    for (const d of body.querySelectorAll("details")) d.open = !!v?.sections[d.dataset.section];
    type();
  }
  // The Typography section, on the page: the font (js/fonts.js: data-font on <html>, its CSS loaded once) and the story's size and
  // line height, inline on <html> (--log-text, --log-line: css/typography.css) when changed from the font's own. Closed (v null):
  // m5x7 and its own values. Never part of the game or its saves.
  function type() {
    const font = v?.font ?? DEFAULT_FONT;
    setInline("--log-text", v?.logRem != null ? v.logRem + "rem" : null);
    setInline("--log-line", v?.logLine != null ? String(v.logLine) : null);
    setInline("--letter-spacing", v?.letter != null ? v.letter + "em" : null);
    useFont(font).then(() => { if ((v?.font ?? DEFAULT_FONT) === font) fields(); });
  }
  // The CRT section's values, on the page: through dev.crt() (closed, v null: art.js's). Only when they changed.
  let crtShown = "null";
  function crtApply() {
    const key = JSON.stringify(v?.crt ?? null);
    if (key !== crtShown) { crtShown = key; dev.crt().set(v?.crt ?? null); }
  }
  const setInline = (name, value) => { if (value === null) html.style.removeProperty(name); else html.style.setProperty(name, value); };
  // Put the panel's top left corner at (x, y), kept on screen (at least its title bar).
  function place(x, y) {
    const w = root.offsetWidth || 320, h = bar.offsetHeight || 32;
    x = Math.round(Math.max(0, Math.min(innerWidth - w, x)));
    y = Math.round(Math.max(0, Math.min(innerHeight - h, y)));
    root.setAttribute("data-placed", "");
    root.style.setProperty("--debug-x", x + "px");
    root.style.setProperty("--debug-y", y + "px");
    return [x, y];
  }
  window.addEventListener("resize", () => { if (v && v.x !== null) [v.x, v.y] = place(v.x, v.y); });

  // ---- Dragging by the title bar (mouse and touch) ----
  // A drag ends however the pointer goes: lifted, cancelled, or its capture lost (the panel hidden under it, the window losing
  // the focus); one that never ended would leave the bar holding the pointer.
  let drag = null;
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button") || (e.pointerType === "mouse" && e.button !== 0)) return;
    const r = root.getBoundingClientRect();
    drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top };
    bar.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  bar.addEventListener("pointermove", (e) => {
    if (!drag || !v || e.pointerId !== drag.id) return;
    [v.x, v.y] = place(e.clientX - drag.dx, e.clientY - drag.dy);
  });
  const drop = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null;
    if (bar.hasPointerCapture?.(e.pointerId)) bar.releasePointerCapture(e.pointerId);
    if (v) keep(v);
  };
  for (const kind of ["pointerup", "pointercancel", "lostpointercapture"]) bar.addEventListener(kind, drop);

  fold.addEventListener("click", () => { if (!v) return; v.collapsed = !v.collapsed; keep(v); apply(); draw(); });
  // × closes it, whatever the game is doing: hidden first, then forgotten.
  close.addEventListener("click", () => {
    root.hidden = true;
    drag = null;
    v = null;
    forget();
    apply();
  });

  // ---- The sections, drawn from the state ----
  // Every action reads the game as it is when clicked (s()), never the state the button was drawn from (morph, above). The game's
  // actions are disabled once the story is over (ENDED).
  const s = () => dev.state();
  const run = (effects, note, opts = {}) => { if (effects.length) dev.run(effects, { note: note ? "Debug: " + note + "." : undefined, ...opts }); };
  // A button of the game: `make(st)` gives its effects and `note(st)` the dim line before them, both on the game when clicked.
  const act = (make, note, opts) => () => { const st = s(); if (st && !st.ended) run(make(st), note ? note(st) : null, opts); };
  const play = (label, make, note, key, pressed, st, opts) => button(label, act(make, note, opts), pressed, key, !!st.ended);

  function picture(st) {
    const on = new Set(st.filters || []), quiet = { tell: false };
    return [
      row("Filters", ...debug.lasting().map(f => play(f, (now) => debug.filter(f, !(now.filters || []).includes(f)), null, "filter:" + f, on.has(f), st, quiet))),
      row("Once", ...debug.moments().map(m => play(m, () => debug.filter(m), null, "once:" + m, undefined, st, quiet))),
      row("Reaction", ...["hurt", "heal"].map(k => play(k, () => debug.reaction(k), null, "reaction:" + k, undefined, st, quiet)))
    ];
  }
  // The music: what the world's music is here (js/debug.js, music), what plays now (the player: dev.sound()), night or day, unwell
  // and the filters as the music has them (the wobble, the echo; tried with the Events and Picture sections), the
  // theme now, the reactions tried (the ending, the death ending, waking: the player's alone, the story goes on; the music comes
  // back with the next move), the lines, the room tone or the theme muted (the player's, not the game's: never saved), and what
  // the reader skipped or changed. And the sounds (docs/sound/PLAN.md), each kind and each material tried on the player alone, in
  // this world's key (a world with no music too): a material is picked up, and is the one the kinds that have one are played with.
  // And the levels (MUSIC.md §6c): how many the world has of its own and how many are shared, any part with none, and the limiter.
  let tried = "wood";
  function music(st) {
    const m = debug.music(st), snd = dev.sound(), info = snd.info(), muted = snd.muted();
    const off = !info, sounds = [
      row("Sounds", ...snd.kinds.map(k => button(k, () => snd.sound({ kind: k, material: tried, weight: 2 }), undefined, "sound:" + k, off))),
      row("Material", ...snd.materials.map(mt => button(mt, () => { tried = mt; snd.sound({ kind: "get", material: mt }); draw(); }, tried === mt, "material:" + mt, off)))];
    if (!m) return [el("p", "note", "This world has no music."), ...sounds];
    const dl = el("dl", "facts");
    const fact = (k, val, cls = "") => dl.append(el("dt", "", k), el("dd", cls, String(val)));
    for (const [label, cls, text] of MUSIC_FACTS) fact(label, text(info, st), cls);   // (the 500 ms timer below brings these up to date)
    fact("mode", m.mode + " in " + m.key + ", tempo " + m.tempo);
    fact("colour", m.colour.replace("_", " "));
    fact("room", st.player.at + ": " + m.tone + ", " + (m.own ? m.lines + " own line" + (m.lines === 1 ? "" : "s") : "the world's lines"));
    fact("theme here", m.theme);
    const notes = el("div", "notes");
    for (const n of m.notes) notes.append(el("p", "note", n));
    if (!m.notes.length) notes.append(el("p", "note", "Read as written: no notes."));
    return [dl,
      row("Theme", button("play now", () => { snd.theme(); draw(); }, undefined, "music:theme", !info?.playing || !!info.ending)),
      row("Try", ...[["ending", () => snd.ending(false)], ["death ending", () => snd.ending(true)], ["wake", () => snd.wake()]]
        .map(([label, go]) => button(label, () => { go(); draw(); }, undefined, "music:" + label, !info?.playing || !!info.ending))),
      row("Mute", ...["lines", "tone", "theme"].map(p => button(p, () => { snd.mute(p, !snd.muted()[p]); draw(); }, muted[p], "mute:" + p))),
      ...sounds,
      notes];
  }
  // Night, as the player has it (the world's clock: ui/sound.js).
  const nightText = (info) => (!info?.playing ? "–" : info.night ? "on: the lines thinned, the theme lower" : "off");
  // Unwell (health: ui/sound.js), and the picture's filters as the music has them (the wobble, the echo), as the player has them.
  // (With the pitch as it is now: how flat, how wide the wobble, mid-glide too.)
  function unwellText(info) {
    if (!info?.playing) return "–";
    const c = Math.round(-info.tuning.flat), flat = c ? c + " cents flat" : "";
    return info.unwell ? info.unwell + ": the lines thinned, " + (flat || "in tune") + (info.unwell > 1 ? ", the theme slower and lower" : "")
      : "off" + (flat ? " (" + flat + ", gliding back)" : "");
  }
  function filtersText(info) {
    if (!info?.playing) return "–";
    const w = Math.round(info.tuning.wobble);
    return "wobble " + (info.wobble ? "on" : "off") + (w ? " (±" + w + " cents)" : "") + " · echo " + (info.echo ? "on" : "off");
  }
  // The theme last played, as the player played it (its label says how: a variant, lower at night, slower and lower unwell, echoed).
  const themeText = (info) => (!info?.theme ? "–" : info.theme.label + " (" + info.theme.part + "), " + Math.round(info.theme.end - (info.theme.notes[0]?.t ?? info.theme.end)) + " s");
  // The levels every part plays at (measured when they were made, never while playing: MUSIC.md §6c): the world's own and the shared
  // ones, any of its parts with none (there should be none: each plays as written); and the most the limiter has pulled down (it
  // should barely act).
  function loudnessText(info) {
    if (!info?.levels) return "–";
    const L = info.levels, lim = Math.round(-(info.limiter?.deepest ?? 0) * 10) / 10;
    return `levels: ${L.own} of this world's, ${L.shared} shared` + (L.missing.length ? `; ${L.missing.length} with none (as written)` : "; none missing") +
      `; limiter ${lim ? "−" + lim + " dB at most" : "untouched"}`;
  }
  // The gains of the music, room tone and sounds buses, as the sound panel's sliders set them (1 at 100: ui/soundpanel.js).
  const busesText = (info) => (!info?.buses ? "–" : `music ${info.buses.music.toFixed(3)} · room ${info.buses.tone.toFixed(3)} · sounds ${info.buses.sounds.toFixed(3)}`);
  // The sounds the player was last told to play (a moment's, or tried here), and how long ago.
  const soundsText = (info) => (!info?.sounds ? "–" : info.sounds.kinds.join(", ") + ", " + Math.max(0, Math.round(info.now - info.sounds.at)) + " s ago");
  // What plays now, in a few words: off, silent after the end, resting, the theme's part playing, or when its next turn comes;
  // an ending under way.
  function nowPlaying(info, st) {
    if (!info) return "off (♫)";
    if (!info.playing) return st?.ended ? "silent: the story has ended" : "off (♫)";
    const e = info.ending, th = info.theme, when = (t) => Math.max(0, Math.round(t - info.now)) + " s";
    const part = e ? (e.death ? "the death ending: " : "the ending: ") + (!e.theme ? "the lines fading, then silence"
        : info.now < e.at ? "the lines fading, the theme in " + when(e.at) : "the theme (whole) playing, then silence")
      : th && info.now < th.end ? "the theme (" + th.part + ") playing" : "the theme (" + info.nextPart + ") in " + when(info.themeNext);
    return (info.state !== "running" ? info.state + " · " : "") + (info.hushed ? "hushed (asleep) · " : "") + (info.resting ? "resting: only the room tone · " : "") + part;
  }
  // The facts about what the player is doing, as [label, the class of its value, the text from (info, st)]: drawn by music() and
  // kept up to date by the timer, from this one list.
  const MUSIC_FACTS = [["playing", "music-now", nowPlaying], ["night", "music-night", nightText], ["unwell", "music-unwell", unwellText],
    ["filters", "music-filters", filtersText], ["last theme", "music-theme", themeText], ["last sounds", "music-sounds", soundsText],
    ["loudness", "music-loudness", loudnessText], ["buses", "music-buses", busesText]];
  function events(st) {
    const n = [1, 2, 3, 4, 5], h = st.player.health, list = debug.conditions(st);
    const out = [
      row("Hurt", ...n.map(i => play(String(i), () => debug.hurt(i), () => "hurt " + i, "hurt:" + i, undefined, st))),
      row("Heal", ...n.map(i => play(String(i), () => debug.heal(i), () => "heal " + i, "heal:" + i, undefined, st))),
      row("Health", ...[0, ...n].map(i => play(String(i), () => debug.health(i), () => "health " + i, "health:" + i, h === i, st))),
      row("Death", play("die", () => debug.health(0), () => "death", "die", undefined, st)),
      // A condition's toggle: on, it says "stop …", the same button stops it.
      row("Conditions", ...list.map(c => {
        const on = (now) => !!now.player.conditions?.[c.id];
        return play((c.on ? "stop " : "") + c.label, (now) => (on(now) ? debug.stop(now, c.id) : debug.start(now, c.id)), (now) => (on(now) ? "stop " : "start ") + c.label, "condition:" + c.id, c.on, st);
      }))
    ];
    // What a test condition that is on does to you, so its ticks are no surprise (always there, empty when none is on: the rows
    // above stay the same elements from one drawing to the next).
    const notes = el("div", "notes");
    for (const c of list) if (c.on && c.test) notes.append(el("p", "note", c.label + ": " + debug.pace(c.id) + "."));
    return [...out, notes];
  }
  function travel(st, pack) {
    const out = [check("show whole map", v.wholeMap, (on) => { if (!v) return; v.wholeMap = on; keep(v); markAll(); })];
    for (const g of debug.rooms(st, pack)) {
      out.push(el("p", "group", g.label));
      const list = el("div", "rooms");
      for (const r of g.rooms) {
        const b = play(r.name, () => debug.travel(r.id), () => "travel to " + r.id, "travel:" + r.id, r.here, st);
        b.title = r.id + (r.visited ? "" : " (not visited)");
        b.dataset.id = r.id;
        if (!r.visited) b.classList.add("unvisited");
        list.append(b);
      }
      out.push(list);
    }
    return out;
  }
  function inventory(st, pack) {
    const list = el("div", "rooms");
    for (const t of debug.things(st, pack)) {
      const held = (now) => now.player.carrying.includes(t.id);
      const b = play(t.name, (now) => debug.take(now, t.id), (now) => (held(now) ? "drop " : "get ") + t.id, "take:" + t.id, t.held, st);
      b.title = t.id;
      b.dataset.id = t.id;
      list.append(b);
    }
    return [list];
  }
  // The time section is made once (its fields keep what you type); drawing only brings it up to date.
  const day = el("input", "", undefined, { type: "number", min: "1", step: "1", "aria-label": "Day", inputmode: "numeric" });
  const hour = el("input", "", undefined, { type: "number", min: "0", max: "23", step: "1", "aria-label": "Hour", inputmode: "numeric" });
  const setTime = button("set", () => {
    const st = s();
    if (!st || st.ended) return;
    const d = Math.max(1, Math.floor(+day.value || 1)), h = Math.max(0, Math.min(23, Math.floor(+hour.value || 0)));
    run(debug.time(d, h), "time day " + d + " " + String(h).padStart(2, "0") + ":00");
  }, undefined, "set-time");
  parts$.time.append(row("Day", day), row("Hour", hour, setTime));
  function time(st) {
    const now = parts(worldNow(st));
    if (document.activeElement !== day) day.value = now.day;
    if (document.activeElement !== hour) hour.value = now.hour;
    for (const c of [day, hour, setTime]) c.disabled = !!st.ended;
  }
  // The Typography section is made once too (its fields keep what you type); fields() brings it up to date.
  const probe = el("span", "text-log", undefined, { hidden: "", "aria-hidden": "true" });   // the story's style, to read its values
  const fontList = el("select", "", undefined, { "aria-label": "Font", "data-key": "font" });
  for (const f of FONTS) fontList.append(el("option", "", f.name, { value: f.id }));
  fontList.addEventListener("change", () => { if (!v) return; v.font = fontList.value; v.logRem = v.logLine = v.letter = null; keep(v); type(); });
  // A number field with − and + buttons: `get()` the value shown, `set(n)` a new one (null: the font's own), `step` and `places`;
  // `any`: zero and negative values too (letter spacing), otherwise only above zero.
  function stepper(label, step, places, get, set, any = false) {
    const input = el("input", "", undefined, { type: "number", step: String(step), ...(any ? {} : { min: String(step) }), inputmode: "decimal", "aria-label": label });
    const round = (n) => Math.round(n / step) * step;
    const put = (n) => { if (!v || !Number.isFinite(n) || (!any && !(n > 0))) return; set(+n.toFixed(places) || 0); keep(v); type(); };
    input.addEventListener("change", () => put(parseFloat(input.value)));
    const minus = button("−", () => put(round(get() - step)), undefined, "minus:" + label);
    const plus = button("+", () => put(round(get() + step)), undefined, "plus:" + label);
    minus.setAttribute("aria-label", label + " smaller"); plus.setAttribute("aria-label", label + " larger");
    return { input, row: row(label, minus, input, plus), show: () => { if (document.activeElement !== input) input.value = get().toFixed(places); } };
  }
  // A slider with its value beside it: `get()` the value now, `set(n)` a new one (kept with the panel, and drawn at once).
  function slider(label, min, max, step, get, set) {
    const places = (String(step).split(".")[1] || "").length;
    const input = el("input", "", undefined, { type: "range", min: String(min), max: String(max), step: String(step), "aria-label": label });
    const out = el("span", "value");
    const show = () => { input.value = String(get()); out.textContent = get().toFixed(places); };
    input.addEventListener("input", () => { if (!v) return; set(+input.value); keep(v); crtApply(); fields(); });
    return { input, row: row(label, input, out), show };
  }
  // The story's values as the page has them now (the inline ones, or the font's own).
  const now = () => {
    const cs = getComputedStyle(probe), size = parseFloat(cs.fontSize), lh = cs.lineHeight, root = parseFloat(getComputedStyle(html).fontSize) || 16;
    // Letter spacing: the token as written (em, or 0), read from <html>, where the body inherits it.
    return { size, rem: size / root, line: lh.endsWith("px") ? parseFloat(lh) / size : parseFloat(lh), letter: parseFloat(getComputedStyle(html).getPropertyValue("--letter-spacing")) || 0 };
  };
  // In rem, like the font sizes (tokens.css): a step of 0.005rem is 0.08px at the usual 16px.
  const size = stepper("Story text size (rem)", 0.005, 3, () => now().rem, (n) => { v.logRem = n; });
  const line = stepper("Story line height", 0.01, 2, () => now().line, (n) => { v.logLine = n; });
  // The page's letter spacing (--letter-spacing, css/typography.css: every text, the story and the interface alike), in em.
  const letter = stepper("Letter spacing (em)", 0.01, 2, () => now().letter, (n) => { v.letter = n; }, true);
  const reset = button("Reset to the font's defaults", () => { if (!v) return; v.logRem = v.logLine = v.letter = null; keep(v); type(); }, undefined, "type-reset");
  parts$.typography.append(probe, row("Font", fontList), size.row, line.row, letter.row, row("", reset),
    el("p", "note", "Not saved with the game. × puts m5x7 back."));
  // The CRT section (the look of ui/crt.js, art.js's effects.crt): made once like Typography; fields() keeps it in line. Every change
  // keeps all the values with the panel (v.crt) and draws at once. Reset: art.js's. Copy: the values now, as JSON.
  const crt = () => dev.crt();
  const change = (k, n) => { v.crt = { ...crt().settings(), [k]: n }; };
  const crtOn = check("on", true, (on) => { if (!v) return; change("on", on); keep(v); crtApply(); fields(); });
  const sliders = Object.entries(crt().ranges).map(([k, [min, max, step]]) => [k, slider(k, min, max, step, () => crt().settings()[k], (n) => change(k, n))]);
  const copied = el("p", "note", "");
  const crtReset = button("Reset to art.js's", () => { if (!v) return; v.crt = null; keep(v); crtApply(); fields(); }, undefined, "crt-reset");
  const crtCopy = button("Copy", () => {
    const json = JSON.stringify(crt().settings());
    (navigator.clipboard?.writeText(json) ?? Promise.reject()).then(() => { copied.textContent = "Copied."; }, () => { copied.textContent = "Couldn't copy: " + json; });
  }, undefined, "crt-copy");
  parts$.crt.append(crtOn, ...sliders.map(([, s]) => s.row), row("", crtReset, crtCopy), copied,
    el("p", "note", "Not saved with the game. × puts art.js's back."));
  function fields() {
    crtOn.querySelector("input").checked = crt().settings().on;
    for (const [, s] of sliders) s.show();
    if (document.activeElement !== fontList) fontList.value = v?.font ?? DEFAULT_FONT;
    size.show(); line.show(); letter.show();
  }
  function inspect(st) {
    const dl = el("dl", "facts");
    const fact = (k, val) => dl.append(el("dt", "", k), el("dd", k === "clock" ? "clock" : "", val === "" ? "—" : String(val)));
    fact("room", st.player.at + (st.player.in ? " (in " + st.player.in + ")" : ""));
    fact("carrying", st.player.carrying.join(", "));
    fact("health", st.player.health);
    fact("conditions", Object.keys(st.player.conditions || {}).join(", "));
    fact("filters", (st.filters || []).join(", "));
    fact("ideas", (st.seen?.ideas || []).join(", "));
    fact("clock", clockText(st));
    fact("turn", st.turn + (st.ended ? " (ended)" : ""));
    return [dl, check("show rule ids", v.rules, (on) => { if (!v) return; v.rules = on; keep(v); apply(); })];
  }
  // The page: how far it is scrolled, the window's height, where the top ends and the story starts, and what last moved it;
  // now, and as it was 2 s after the last new game (ui/log.js, page). For layout bugs on a phone (Safari's first screen).
  function page() {
    const { first, now } = dev.page();
    const block = (title, m) => {
      const dl = el("dl", "facts");
      for (const [k, val] of Object.entries(m)) dl.append(el("dt", "", k), el("dd", "", String(val)));
      return [el("p", "note", title), dl];
    };
    return [...(first ? block("2 s after the new game", first) : [el("p", "note", "Start a new game to record its first screen.")]),
            ...block("Now", now)];
  }
  function settings(st) {
    const motion = el("select", "", undefined, { "aria-label": "Reduce motion" });
    for (const [val, label] of [["system", "as the system"], ["reduce", "on"], ["full", "off"]]) {
      const o = el("option", "", label, { value: val });
      if (v.motion === val) o.selected = true;
      motion.append(o);
    }
    motion.addEventListener("change", () => { if (!v) return; v.motion = motion.value; keep(v); apply(); });
    const langs = dev.languages();
    return [
      check("instant text", v.instant, (on) => { if (!v) return; v.instant = on; keep(v); apply(); }),
      // The one-pixel nudge that makes Safari on an iPhone draw the page where it says it is, after the game puts it back
      // (ui/follow.js, resync). Off, to test whether it is what fixes a new game's first screen.
      check("Safari nudge", v.nudge !== false, (on) => { if (!v) return; v.nudge = on; keep(v); apply(); }),
      row("Reduce motion", motion),
      // (a new game, so it works after the end too)
      row("Language", ...langs.map(l => button(l.toUpperCase(), () => { const now = s(); if (now && l !== now.lang) dev.language(l); }, l === st.lang, "lang:" + l))),
      el("p", "note", "Another language starts a new game of this world.")
    ];
  }

  // The world's time now: play time running, plus how far the story moved it.
  const worldNow = (st) => Math.max(0, dev.now() + (st.time?.shift || 0));
  function clockText(st) {
    const p = parts(worldNow(st), st.time?.weekday);
    return "day " + p.day + " " + hhmm(p) + ":" + String(p.second).padStart(2, "0") + (p.weekday ? " (" + p.weekday + ")" : "");
  }
  setInterval(() => {
    if (!v || v.collapsed) return;
    const st = s();
    if (!st) return;
    const out = isOpen("inspect") && parts$.inspect.querySelector("dd.clock"), cells = isOpen("music") && MUSIC_FACTS.map(([, cls, text]) => [parts$.music.querySelector("dd." + cls), text]);
    if (out) out.textContent = clockText(st);
    if (cells && cells[0][0]) {                                          // (a world with no music has none of these)
      const info = dev.sound().info();
      for (const [cell, text] of cells) cell.textContent = text(info, st);
    }
  }, 500);

  // Is this section open (shown)? A closed one is not drawn or kept up to date: it is drawn when it opens.
  const isOpen = (id) => !!v?.sections[id];
  function drawSection(id, st, pack) {
    const make = { picture, music, events, travel, inventory, inspect, page, settings };
    if (id === "time") time(st);
    else if (id === "typography" || id === "crt") fields();
    else morph(parts$[id], make[id](st, pack));
  }
  // Draw every open section from the state, after every change of the game (morph: only what differs changes on the page).
  function draw() {
    const st = s();
    if (!v || !st) return;
    const pack = dev.pack();
    for (const id of SECTIONS) if (isOpen(id)) drawSection(id, st, pack);
    ended.hidden = !st.ended;
    const room = st.player.at ? " · " + (st.world.rooms[st.player.at]?.name ? text(st.world.rooms[st.player.at].name, pack) : st.player.at) : "";
    const label = "Debug · " + (st.worldId ?? "") + " " + st.lang + room + (st.ended ? " · ended" : "");
    if (title.textContent !== label) title.textContent = label;
  }

  // Show whole map: every room marked visited (js/debug.js, visitAll), quietly, and again whenever a new room appears or a new
  // game starts while it is on. Not kept for UNDO (UNDO would only be marked again). After the redraw that asked for it.
  let marking = false;
  function markAll() {
    const st = s();
    if (!v?.wholeMap || !st || st.ended || marking || !debug.unvisited(st).length) return;
    marking = true;
    setTimeout(() => { marking = false; const now = s(); if (v?.wholeMap && now && !now.ended) run(debug.visitAll(now), null, { tell: false, undo: false }); });
  }

  return {
    // Show the panel: as it was remembered (a reload), or fresh. Typed /debug while it is open: it unfolds. On a touch screen the
    // keyboard closes (the command line lets go of the focus), so the page and the panel stay still under your finger.
    open() {
      if (!v) v = recall() ?? structuredClone(DEFAULTS);
      else v.collapsed = false;
      keep(v);
      root.hidden = false;
      if (touch.matches && document.activeElement?.matches?.("input, textarea") && !root.contains(document.activeElement)) document.activeElement.blur();
      apply(); draw(); markAll();
    },
    // After every redraw of the game: the panel follows the state.
    update() { if (v) { draw(); markAll(); } },
    // Is "show rule ids" on? (js/main.js adds the line under each answer only then.)
    showsRules: () => !!v?.rules,
    // Is "show whole map" on? (A room clicked on the map is then reached even when the walk there can't: js/main.js.)
    wholeMap: () => !!v?.wholeMap
  };
}
