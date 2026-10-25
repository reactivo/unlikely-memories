// Whole-pixel scaling shared by the pieces that draw pictures (ui/scene.js, ui/home.js): pure, so tests can run it.
// A picture is shown at a whole number of screen pixels per picture pixel, so every pixel is the same size.

// Phones: below this width (the layout's breakpoint, css/tokens.css) the column fills the page's width instead of narrowing to a
// whole-pixel picture.
export const PHONE = "(max-width: 759px)";

// The picture on a phone: as wide as the room inside the page padding (`room` CSS pixels), its height in the picture's ratio,
// rounded to a whole device pixel so what is under it starts on the pixel grid. The scale is not a whole number, so some picture
// pixels end up one device pixel larger than others (accepted, for the width).
export function phoneSize(room, width, height, dpr = 1) {
  return { cssW: room, cssH: Math.round(room * height / width * dpr) / dpr };
}

// The largest whole number of screen pixels per picture pixel at which a picture `width` pixels wide fits in `room` CSS
// pixels, on a screen with `dpr` device pixels per CSS pixel (never below 1).
export const scaleFor = (room, width, dpr = 1) => Math.max(1, Math.floor(room * dpr / width + 0.001));

// The landing page's thumbnails fill their slot exactly, crisp. The slot is `room` CSS pixels wide (the layout decides it: 3/7 of the
// card, or all of it on a phone) on a screen with `dpr` device pixels per CSS pixel; the picture is cropped to fit it, not the
// other way round. s: the smallest whole number of device pixels per picture pixel for which the crop is at most `max` picture
// pixels wide; cw × ch: the crop (ch is 3/5 of cw, the 5:3 of the full 225 × 135 crop); the canvas is cw·s × ch·s device pixels, up
// to s − 1 narrower than the slot, so the slot is narrowed to it (cssW × cssH) and nothing of the tile shows round the picture.
export function thumbFit(room, dpr = 1, max = 225) {
  const device = Math.floor(room * dpr + 0.001);
  if (device < 1) return null;
  const s = Math.ceil(device / max), cw = Math.floor(device / s), ch = Math.max(1, Math.round(cw * 3 / 5));
  return { s, cw, ch, cssW: cw * s / dpr, cssH: ch * s / dpr };
}

// Where a cw × ch crop starts in the 320 × 136 picture: centred on the bible's spot (its x is the left of the full 225-wide crop, so
// the centre is x + 112.5, and 67.5 down), held inside the picture. A smaller crop is a tighter look at the same spot.
export function thumbCrop(x, cw, ch, width = 320, height = 136, full = { width: 225, height: 135 }) {
  const clamp = (v, max) => Math.max(0, Math.min(max, Math.round(v)));
  return { left: clamp(x + full.width / 2 - cw / 2, width - cw), top: clamp(full.height / 2 - ch / 2, height - ch) };
}
