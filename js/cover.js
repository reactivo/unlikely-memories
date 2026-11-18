// A cover's timing and size, pure (docs/splash/PLAN.md, third build; INTERFACE.md §13a): ui/splash.js and the Node tests use it.

import art from "../content/art.js?v=0.66.1";

// How many of a cover's `count` shapes are shown `t` ms after the splash opened: the first at once (t = 0: 1, the background), the last at
// `ms`, in between as the fraction of the time to the power `ease` (> 1: slow at first, quicker at the end), so the whole takes `ms`
// whatever `count` is. With `skip` (a tap or key) or `calm` (reduced motion) all of them. No shapes: 0.
export function shownAt(count, t, { skip = false, calm = false, drawIn = art.cover.drawIn } = {}) {
  if (count <= 0) return 0;
  if (skip || calm || t >= drawIn.ms) return count;
  const p = Math.max(0, t) / drawIn.ms;
  return Math.min(count, 1 + Math.floor(count * p ** drawIn.ease));
}

// The columns an upright phone shows of a cover: art.cover.crop, from column 80 to 399 (inclusive), 320 of the 480.
export const cropColumns = () => art.cover.crop[1] - art.cover.crop[0] + 1;

// The width on screen, in CSS pixels, of the phone's crop (320 columns) when its pixels are each a whole number of DEVICE pixels (width = 320 × k / dpr,
// the largest k that fits `avail` CSS pixels): every cover pixel the same size, on a 3x phone as well as a 2x one, where a whole multiple of 320 CSS
// pixels would be too small or too big. When even one device pixel to a cover pixel doesn't fit, `avail` itself. Only the phone's case: a wide window
// shows the whole 480 x 400 fitted to its height at any scale (the CRT look hides the unevenness; ui/splash.css).
export function fitWidth(avail, dpr = 1, width = cropColumns()) {
  const k = Math.floor((avail * dpr) / width + 1e-9);
  return k < 1 ? avail : (width * k) / dpr;
}
