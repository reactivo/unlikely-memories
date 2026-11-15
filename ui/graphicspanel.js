// The graphics block of the options panel (≡): two switches, CRT effect and Reflections (INTERFACE.md §2c). What a device remembers
// is one value, { crt, reflections } (js/prefs.js), both on at a first visit; it is kept by the controller (js/main.js), as the sound's
// mix is: the pure parts are here, and the panel only reads and tells the controller what was switched. The Reflections row shows
// on wide windows only (css/layout.css).

export const KEY = "parser-graphics";                     // the remembered value
export const SWITCHES = ["crt", "reflections"];

// What is remembered, read back: the stored text (or null). Anything missing or not a true/false is on.
export function readGraphics(raw) {
  let g = null;
  try { g = JSON.parse(raw); } catch (e) {}
  g = g && typeof g === "object" ? g : {};
  return Object.fromEntries(SWITCHES.map(k => [k, g[k] !== false]));
}

// One switch flipped.
export const toggled = (graphics, which) => ({ ...graphics, [which]: !graphics[which] });

// Set up the block on its element (the options panel's GRAPHICS section). Returns update().
export function mount(panel, on) {
  const $ = (id) => panel.querySelector("#" + id);
  const sw = Object.fromEntries(SWITCHES.map(k => [k, $("graphics-" + k)]));
  for (const k of SWITCHES) sw[k].addEventListener("click", () => on.graphicsToggled(k));

  return {
    // On a language change, translate the block; when a switch changes, show it.
    update(prev, next) {
      const t = next.pack.graphics;
      if (!prev || prev.state.lang !== next.state.lang) {
        $("graphics-title").textContent = t.title;
        for (const k of SWITCHES) $("label-" + k).textContent = t[k];
      }
      if (!prev || prev.graphics !== next.graphics) for (const k of SWITCHES) sw[k].setAttribute("aria-checked", String(next.graphics[k]));
    }
  };
}
