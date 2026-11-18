// The sound block of the options panel (≡): three sliders, Music, Room and Sounds (INTERFACE.md §2c, docs/sound/PLAN.md, build 2;
// until 14 November 2026 they had a popover of their own, opened by ♫, with a Mute all button; then ♫ was a mute switch beside the title bar: then the SOUND heading's on/off switch; since 16 November 2026 that switch has its own row, Sound on/off, as GRAPHICS' rows). A slider is a native <input type="range">, 0 to 100, and sets the
// player's bus of that part (ui/sound.js): `gainOf`, one loudness curve, 100 being the part's own level (nothing gets louder).
// What a device remembers is one value, { muted, music, tone, sounds } (js/prefs.js), kept by the controller (js/main.js): the
// pure parts are here, the panel only reads and tells it what was moved or switched.

import S from "../content/music.js?v=0.66.0";

export const KEY = "parser-sound";                        // the remembered value
export const PARTS = ["music", "tone", "sounds"];         // the sliders, and the player's buses (the Room slider is the `tone` bus)

// The gain a slider's position (0 to 100) gives a part: its bus's own gain at 100, then a curve, so equal steps sound even.
export const gainOf = (part, v, spec = S) => spec.buses[part] * (v / 100) ** spec.panel.exponent;

// What is remembered, read back: the stored text (or null), and the old ♫ switch ("off" if it was turned off). Anything missing or
// out of range is the spec's default; a first visit is unmuted.
export function readMix(raw, old = null, spec = S) {
  let m = null;
  try { m = JSON.parse(raw); } catch (e) {}
  m = m && typeof m === "object" ? m : {};
  const at = (p) => (Number.isFinite(m[p]) ? Math.min(100, Math.max(0, Math.round(m[p]))) : spec.panel.defaults[p]);
  return { muted: raw == null ? old === "off" : m.muted === true, music: at("music"), tone: at("tone"), sounds: at("sounds") };
}

// Whether anything can be heard: not muted, and some slider above 0 (what the player hears: ui/sound.js).
export const audible = (mix) => !mix.muted && PARTS.some(p => mix[p] > 0);
// A slider moved to `v`; moving any of them while muted, up or down, unmutes (all keep their places). Until 14 November 2026 only
// raising one did, so Room and Sounds, at 100 by default, could never unmute.
export const moved = (mix, part, v) => ({ ...mix, [part]: v, muted: mix.muted && v === mix[part] });
// The switch toggled: mute all, or unmute (with every slider at 0 there is nothing to hear: back to the defaults).
export const toggled = (mix, spec = S) =>
  audible(mix) ? { ...mix, muted: true } : { ...(PARTS.some(p => mix[p] > 0) ? mix : spec.panel.defaults), muted: false };

// How far a slider's track is filled (soundpanel.css draws the part up to the thumb from --fill).
const fill = (s) => s.style.setProperty("--fill", `${(s.value - s.min) / (s.max - s.min) * 100}%`);

// Set up the block on its element (the options panel's SOUND section). Returns update().
export function mount(panel, on) {
  const $ = (id) => panel.querySelector("#" + id);
  const sliders = Object.fromEntries(PARTS.map(p => [p, $("sound-" + p)]));

  const sw = $("sound-switch");                            // role=switch: ON = sound plays (not muted)
  const block = sw.closest(".sound");
  sw.addEventListener("click", () => on.soundToggled());
  for (const p of PARTS) {
    const s = sliders[p];
    s.addEventListener("input", () => { fill(s); on.soundMoved(p, +s.value); });
    // Yellow while held (soundpanel.css): from the press to the release, wherever the finger ends up.
    s.addEventListener("pointerdown", () => s.classList.add("dragging"));
    for (const e of ["pointerup", "pointercancel", "lostpointercapture", "blur"]) s.addEventListener(e, () => s.classList.remove("dragging"));
  }
  addEventListener("pointerup", () => { for (const p of PARTS) sliders[p].classList.remove("dragging"); });   // a release off the slider

  return {
    // On a language change, translate the block; when a slider changes, show it.
    update(prev, next) {
      const t = next.pack.sound;
      if (!prev || prev.state.lang !== next.state.lang) {
        $("sound-title").textContent = t.title;
        $("label-sound").textContent = t.onoff;
        for (const p of PARTS) $("label-" + p).textContent = t[p];
      }
      if (!prev || prev.mix !== next.mix) {
        for (const p of PARTS) { sliders[p].value = next.mix[p]; fill(sliders[p]); }
        sw.setAttribute("aria-checked", String(!next.mix.muted));   // only muted or not (every slider at 0 is still "on")
        block.classList.toggle("muted", !!next.mix.muted);           // the sliders and their labels dark grey (soundpanel.css)
      }
    }
  };
}
