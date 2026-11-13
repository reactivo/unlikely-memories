// Sleep on the screen (INTERFACE.md §6c, "Sleep"; its tunables: content/art.js, effects.sleep). Its phases and timing: the lids close,
// the dark (at least its own length, and until the dream or the vision has been told), the lids open; and its drawing: the picture
// while you sleep, drawn last, after the filters (`sleepPicture`, with the afterimage of the room and the dark's own numbers,
// `afterimageOf`, `darkField`). ui/scene.js owns the picture and its loop and asks this: `mount(...)` hands it what it needs,
// `start()` begins a sleep, `advance(now)` moves it on each frame while it `playing()`, `frame(pic, now)` draws it over a frame.
// Purely visual: never the game's state; the specks' randomness is a hash of the pixel, so a sleep draws the same each time.

import art from "../content/art.js?v=0.48.3";
import { threshold } from "./draw.js?v=0.48.3";
import { hash } from "./effects.js?v=0.48.3";
import { calm } from "./media.js?v=0.48.3";

// Set up the sleep on the scene's picture (W × H palette numbers): `base(worldId, id, picture)` paints a picture (a vision's), `animate()` asks
// for the next frame, `render(now)` draws one, `hold(colour)` makes the dark the picture (a sleep you don't wake from).
export function mount({ W, H, base, animate, render, hold }) {
  let run = null;                // a sleep playing: the lids, the dark, and where it has got to
  let field = null;              // the dark's own numbers, worked out the first time (darkField)

  // ---- The phases (INTERFACE.md §6c, "Sleep"; its tunables: content/art.js, effects.sleep) ----
  // Three phases: the lids close (their steps, eased; with reduce motion a plain fade to black), the dark (at least its own length,
  // and until the dream or the vision has been told: the controller's `dark()` tells it and says how long that takes), and the lids
  // open (`open()` first: the controller puts the picture woken to under them). Then `done()`. A sleep you don't wake from ends
  // in the dark, which stays as the picture until the ending's comes in. `skip()` goes straight to the end.
  function advance(now) {
    const o = run.o, eased = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
    const along = (steps, from) => {                             // where the lids are along their steps, and whether they are done
      let t = now - run.t0, at = from;
      for (const [to, ms] of steps) { if (t < ms) return { lid: at + (to - at) * eased(t / ms), over: false }; t -= ms; at = to; }
      return { lid: at, over: true };
    };
    if (run.phase === "close") {
      const r = run.fade != null ? { lid: 1, fade: Math.min(1, (now - run.t0) / o.calm.fade) } : along(run.plan.close, 0);
      run.lid = r.lid; if (r.fade != null) run.fade = r.fade;
      if (r.over || run.fade === 1) darkens(now);
    }
    if (run?.phase === "dark") {
      const t = now - run.darkAt, left = run.darkEnd - now, ramp = (x, ms) => Math.max(0, Math.min(1, x / ms));
      run.glow = Math.min(ramp(t, o.glowIn), ramp(left, o.glowOut));
      run.vision = run.fade != null ? 1 : Math.min(ramp(t - o.glowIn, o.vision.fadeIn), ramp(left - o.glowOut, o.vision.fadeOut));
      if (now >= run.darkEnd) {
        if (!run.wake) return finish(false);
        run.phase = "open"; run.t0 = now; run.glow = 0; run.vision = 0;
        run.open?.();
      }
    }
    if (run?.phase === "open") {
      const r = run.fade != null ? { lid: 1, fade: Math.max(0, 1 - (now - run.t0) / o.calm.fade) } : along(run.plan.open, 1);
      run.lid = r.lid; if (r.fade != null) run.fade = r.fade;
      if (run.fade != null ? run.fade === 0 : r.over) finish(true);
    }
  }
  // The lids are shut: the dark begins, and the controller tells what is said in it (`dark()`: how long until it has been told).
  function darkens(now) {
    const o = run.o, told = run.dark?.() ?? 0, fades = run.visionPx ? o.vision.fadeIn + o.vision.fadeOut : 0;
    Object.assign(run, { phase: "dark", lid: 1, darkAt: now,
      darkEnd: now + Math.max(run.plan.dark, told + o.afterText, o.glowIn + o.glowOut + fades) });
  }
  // The end of a sleep: woken, the lids gone; or not (a death), the dark kept as the picture, for the ending's to come in over.
  function finish(woke) {
    const { done } = run;
    if (!woke) hold(run.o.colors.dark);
    run = null;
    render(performance.now());
    done?.();
  }

  return {
    playing: () => run !== null,
    advance,
    // The frame as the sleeper sees it: the lids and the dark over `pic`, the room's afterimage taken as the eyes close.
    frame(pic, now) {
      if (!run) return pic;
      if (!run.after && !run.visionPx && run.fade == null) run.after = afterimageOf(pic, run.o);   // (the room as the eyes close)
      return sleepPicture(pic, run, now, run.o);
    },
    // A sleep, played on the picture: { kind: "nap" | "few" | "morning" (js/sleep.js), vision: { id, world, picture } (a world's picture,
    // shown in the dark) or null, wake: false when you don't wake, dark(), open(), done() }: see advance(). Returns { skip(), cancel() }.
    // Never on a restore (the controller only plays a moment just played).
    start({ kind, vision = null, wake = true, dark, open, done }) {
      const o = art.effects.sleep;
      field ??= darkField(W, H, o);
      run = { o, plan: o[kind] || o.nap, wake, dark, open, done, phase: "close", t0: performance.now(), lid: 0, fade: calm() ? 0 : null,
              glow: 0, darkAt: null, darkEnd: null, vision: 0, visionPx: vision ? base(vision.world, "vision:" + vision.id, vision.picture).px : null,
              after: null, field };
      const mine = run;
      animate();
      return {
        skip() {                                                 // a tap, a click or a key: straight to waking (or to the end)
          if (run !== mine) return;
          if (run.phase === "close") run.dark?.();
          if (run.wake && run.phase !== "open") run.open?.();
          finish(run.wake);
        },
        cancel() { if (run === mine) { run = null; render(performance.now()); } }   // the game is left: no more of it, nothing told
      };
    },
  };
}

// ---- The drawing ------------------------------------------------------------------------------------------------------
// The picture while you sleep (INTERFACE.md §6c, "Sleep"; its tunables: content/art.js, effects.sleep, here `o`). The sleep (above, `mount`: when the lids
// move, when the dark comes and goes) draws each frame through sleepPicture, last, after the filters,
// on the picture's own palette numbers: two black eyelids with a gently curved, dithered edge, and between them the dark. The
// dark is nearly black: specks that glow and fade each at its own pace, the room's brightest parts as a fading afterimage and then
// a darker patch where they were, one faint wide band closing in on the middle; or a vision's picture, fading in and out by the
// dither. With reduce motion, a plain fade to black (a vision shown still). Purely visual: never the game's state; the specks'
// randomness is a hash of the pixel, so a sleep draws the same each time.
//   run: { lid: 0 open … 1 shut; fade: with reduce motion, the fade to black 0 … 1 (else null); glow: the dark's life 0 … 1;
//          darkAt: when the dark began (ms), or null; vision: its picture's fade 0 … 1; visionPx: its pixels, or null;
//          after: the afterimage (afterimageOf); field: the dark's own numbers (darkField) }
export function sleepPicture(pic, run, now, o) {
  const { px, w, h } = pic, out = px.slice(), c = o.colors, soft = o.lid.soft, cx = (w - 1) / 2;
  const T = run.darkAt == null ? 0 : Math.max(0, now - run.darkAt) / 1000;
  const lidY = run.lid * (h / 2 + o.lid.over + soft) - soft;    // (open, the lids' soft edge is just out of sight)
  // What the dark shows at a pixel (k; th: its dither threshold): the vision, else the glow of the dark, else black.
  const A = o.afterimage, B = o.band, f = run.field;
  const R = Math.max(0, B.from - T * B.speed), bandNow = B.strength * Math.min(1, T / B.rise), turn = 0.3 * T;
  const hole = Math.min(1, Math.max(0, (T - A.hole.at) / A.hole.rise)) * Math.exp(-Math.max(0, T - A.hole.at) / A.hole.fade);
  const shown = Math.exp(-T / A.fade) * A.strength;
  const dark = (k, th) => {
    if (run.visionPx && run.vision > th) return run.visionPx[k];
    if (run.fade != null || !(run.glow > 0) || !f) return c.dark;
    const a0 = run.visionPx ? 0 : run.after?.[k] ?? 0, neg = a0 * hole;
    const band = Math.exp(-(((f.r[k] - R) / B.width) ** 2)) * bandNow * (0.7 + 0.3 * (f.sin2[k] * Math.cos(turn) + f.cos2[k] * Math.sin(turn))) * (1 - Math.min(1, 2 * neg));
    if ((a0 * shown + band) * run.glow > th * 0.9 + 0.04) return c.grey;
    if (run.glow > 0.5 && neg < 0.3) {                           // a speck: lit for a while in its own long round
      const u = (T + f.phase[k]) % f.period[k];
      if (u < f.dur[k] && Math.sin(Math.PI * u / f.dur[k]) > th) return f.warm[k] ? c.warm : c.grey;
    }
    return c.dark;
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = y * w + x, th = threshold(x, y);
    let covered;
    if (run.fade != null) covered = run.fade > th;              // reduce motion: the plain fade
    else if (run.lid >= 0.999) covered = true;
    else {
      const curve = o.lid.curve * ((x - cx) / cx) ** 2, edge = Math.min(y - (lidY - curve), (h - 1 - y) - (lidY - curve));
      covered = (edge < -soft ? 1 : edge > soft ? 0 : (soft - edge) / (2 * soft)) > th;
    }
    if (covered) out[k] = dark(k, th);
  }
  return { ...pic, px: out };
}

// The afterimage of a picture (palette numbers, `rgb` their colours): how bright each pixel is, blurred, as a share 0 … 1 of how far
// above `o.afterimage.from` of the brightest it is. Taken once, as the eyes close.
export function afterimageOf({ px, w, h, rgb }, o) {
  let L = new Float32Array(w * h);
  for (let k = 0; k < L.length; k++) { const [r, g, b] = rgb[px[k]]; L[k] = (0.3 * r + 0.59 * g + 0.11 * b) / 255; }
  const box = (a, r) => {                                         // a box blur, r each way, across then down
    const t = new Float32Array(w * h), o2 = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, n = 0; for (let i = Math.max(0, x - r); i <= Math.min(w - 1, x + r); i++) { s += a[y * w + i]; n++; } t[y * w + x] = s / n; }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, n = 0; for (let j = Math.max(0, y - r); j <= Math.min(h - 1, y + r); j++) { s += t[j * w + x]; n++; } o2[y * w + x] = s / n; }
    return o2;
  };
  L = box(box(L, o.afterimage.blur), o.afterimage.blur);
  let max = 0;
  for (const v of L) max = Math.max(max, v);
  const from = o.afterimage.from;
  return L.map(v => (max > 0 ? Math.max(0, (v / max - from) / (1 - from)) : 0));
}

// The dark's own numbers, for each pixel, worked out once: how far it is from the middle (`r`, 1 the middle of an edge, rows
// counted a little longer, so the band is rounder), the band's slow wobble round it (`sin2`, `cos2`), and its speck: how long it
// glows (`dur`, s), how long its round is (`period`: so that `share` of the pixels are lit at a time), where in it the sleep starts
// (`phase`), and whether it glows warm.
export function darkField(w, h, o) {
  const n = w * h, f = { r: new Float32Array(n), sin2: new Float32Array(n), cos2: new Float32Array(n), dur: new Float32Array(n),
    period: new Float32Array(n), phase: new Float32Array(n), warm: new Uint8Array(n) };
  const [lo, hi] = o.specks.lit, cx = (w - 1) / 2, cy = (h - 1) / 2, u = (k, i) => hash(k, i) / 4294967296;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = y * w + x, nx = (x - cx) / cx, ny = (y - cy) / cy * 1.4, a = 2 * Math.atan2(ny, nx);
    f.r[k] = Math.hypot(nx, ny); f.sin2[k] = Math.sin(a); f.cos2[k] = Math.cos(a);
    f.dur[k] = lo + u(k, 1) * (hi - lo);
    f.period[k] = f.dur[k] * (2 / 3) / o.specks.share * (0.7 + 0.6 * u(k, 2));   // (lit about two thirds of its glow: the dither)
    f.phase[k] = u(k, 3) * f.period[k];
    f.warm[k] = u(k, 4) < o.specks.warm ? 1 : 0;
  }
  return f;
}
