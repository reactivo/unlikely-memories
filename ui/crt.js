// The CRT look (ART-DIRECTION.md §6.2; ARCHITECTURE.md §7, "Picture"): an old screen drawn on top of the finished picture, by one
// WebGL pass. Purely visual: never touches the game, and the scene's own drawing (ui/scene.js) is the same with or without it.
//
//   screen(source, { w, h })    the scene's: a WebGL canvas right after the scene's 2D canvas `source`, drawn from its pixels on
//                               every draw(imageData) the scene makes (never a loop of its own); the 2D canvas is hidden while it shows.
//   thumbnails()                the landing page's: a group of 2D canvases, each drawn once at its displayed size through ONE
//                               shared WebGL context, again on a resize or a change of settings. add(canvas, imageData), clear().
//   settings(), configure(v)    the settings now in effect: content/art.js (effects.crt), or those the debug panel set instead.
//
// No WebGL, a shader that won't compile, or a lost context: the WebGL canvas goes and the plain canvas shows, as it always did.
// At most two contexts in all: the scene's and the thumbnails'. Safe to import in Node (nothing touches the page until used).
//
// The look, in the shader's order: the picture's own pixels, hard-edged (nearest); colour fringing (red looks `rgb` source pixels
// to the right, blue as far to the left: so red lands left, blue right); glow (a soft blur of about 1.5 pixels, screen-blended at
// `glow`; blurred from the unfringed picture, which at that size looks the same and costs a third); the grade (contrast,
// saturation, brightness); one dark scanline for each source row (`scan`: its lower half), RGB phosphor stripes 1 CSS pixel wide
// (`mask`); and `flicker`, one random brightness for the frame. The vignette is not here: it is a static gradient over the visible box
// (CSS: ui/scene.css, ui/home.css, from --crt-vignette), so on an upright phone it darkens the box's edges, not the hidden sides'.

import art from "../content/art.js";
import { calm } from "./media.js";

// What each setting may be: [min, max, step], for the debug panel's sliders and for keeping a value sane.
export const RANGES = {
  scan: [0, 1, 0.01], mask: [0, 0.5, 0.01], vignette: [0, 1, 0.01], rgb: [0, 2, 0.05], glow: [0, 1, 0.01], flicker: [0, 0.2, 0.005],
  contrast: [0.5, 2, 0.01], saturation: [0, 2, 0.01], brightness: [0.5, 1.5, 0.01]
};
const MAX_RATIO = 2;                                   // the most device pixels per CSS pixel it draws (an iPhone's 3 would cost more than it shows)

// ---- The settings in effect: one place ----
let current = { ...art.effects.crt };
const listeners = new Set();
const emit = () => { for (const f of [...listeners]) f(); };
export const defaults = () => ({ ...art.effects.crt });
export const settings = () => ({ ...current });
// Settings now: content/art.js's, with these over them (an object; null for none). Unknown names are ignored, numbers kept in range.
// Everything drawn is drawn again at once.
export function configure(values) {
  const next = defaults();
  for (const k of Object.keys(next)) {
    if (!values || !(k in values)) continue;
    if (k === "on") next.on = !!values.on;
    else if (Number.isFinite(+values[k]) && RANGES[k]) next[k] = Math.min(RANGES[k][1], Math.max(RANGES[k][0], +values[k]));
  }
  current = next;
  publish();
  emit();
}
// The vignette's opacity, for the CSS gradient over the picture and the thumbnails.
function publish() { if (typeof document !== "undefined") document.documentElement.style?.setProperty("--crt-vignette", String(current.vignette)); }

// ---- The pass ----
const VERTEX = `attribute vec2 a; varying vec2 uv;
void main() { uv = vec2(a.x * .5 + .5, .5 - a.y * .5); gl_Position = vec4(a, 0., 1.); }`;   // the picture's top left is uv (0, 0)
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tex;
uniform vec2 src, dst;                                  // the picture's size in its own pixels; the canvas's in device pixels
uniform float dpr, scan, mask, rgb, glow, contrast, sat, bright, flick;
varying vec2 uv;
vec3 at(vec2 p) { return texture2D(tex, p / src).rgb; }                       // p in picture pixels; the texture is nearest
float below(float y) { return floor(y) * .5 + clamp(fract(y) - .5, 0., .5); }   // how much of the rows' lower halves lie above y
void main() {
  vec2 p = uv * src;
  vec3 c = vec3(at(p + vec2(rgb, 0.)).r, at(p).g, at(p - vec2(rgb, 0.)).b);
  vec3 g = at(p) * .36 + (at(p + vec2(1.5, 0.)) + at(p - vec2(1.5, 0.)) + at(p + vec2(0., 1.5)) + at(p - vec2(0., 1.5))) * .16;
  c = 1. - (1. - c) * (1. - g * glow);                                         // screen
  c = (c - .5) * contrast + .5;
  c = mix(vec3(dot(c, vec3(.299, .587, .114))), c, sat);
  float h = src.y / dst.y;                                                      // one device pixel's height in picture rows
  c *= 1. - scan * (below(p.y + h * .5) - below(p.y - h * .5)) / h;            // the share of this pixel in a lower half
  float s = mod(floor(gl_FragCoord.x / dpr), 3.);                              // R, G, B stripes, 1 CSS pixel each
  c *= 1. - mask * (1. - vec3(float(s < .5), float(s > .5 && s < 1.5), float(s > 1.5)));
  gl_FragColor = vec4(clamp(c * bright * flick, 0., 1.), 1.);
}`;

// A WebGL pass on `canvas`, or null (no WebGL, or the shader won't build). onLost runs if the context is lost.
function makePass(canvas, attrs, onLost) {
  let gl;
  try { gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power", ...attrs }); }
  catch (e) { gl = null; }
  if (!gl) return null;
  const build = (type, code) => { const s = gl.createShader(type); gl.shaderSource(s, code); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, build(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(prog, build(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn("The CRT look's shader didn't build:", gl.getProgramInfoLog(prog)); return null; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
    gl.texParameteri(gl.TEXTURE_2D, k, v);
  const u = {};
  for (const n of ["src", "dst", "dpr", "scan", "mask", "rgb", "glow", "contrast", "sat", "bright", "flick"]) u[n] = gl.getUniformLocation(prog, n);
  let sw = 0, sh = 0;
  const pass = {
    canvas, lost: false,
    // The picture's size in its own pixels (the texture is made again only when it changes).
    source(w, h) {
      if (w === sw && h === sh) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      sw = w; sh = h;
    },
    // The picture's pixels (an ImageData of that size).
    upload(image) { gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image); },
    // One draw, into the canvas at width × height device pixels (dpr of them to a CSS pixel).
    draw(width, height, dpr, s, flick) {
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.src, sw, sh); gl.uniform2f(u.dst, width, height); gl.uniform1f(u.dpr, dpr);
      gl.uniform1f(u.scan, s.scan); gl.uniform1f(u.mask, s.mask); gl.uniform1f(u.rgb, s.rgb); gl.uniform1f(u.glow, s.glow);
      gl.uniform1f(u.contrast, s.contrast); gl.uniform1f(u.sat, s.saturation); gl.uniform1f(u.bright, s.brightness); gl.uniform1f(u.flick, flick);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); pass.lost = true; onLost(); });
  return pass;
}

const ratio = () => Math.min(MAX_RATIO, (typeof devicePixelRatio === "number" && devicePixelRatio) || 1);
// The attribute the CSS vignette follows (on the box: .picture, .tile): present while the look is drawn there.
const mark = (canvas, on) => canvas.parentElement?.toggleAttribute("data-crt", on);

// ---- The scene's picture ----
// `source`: the scene's 2D canvas, w × h picture pixels. Returns { draw(image) }: call it after every putImageData, with the ImageData.
export function screen(source, { w, h }) {
  let pass = null, canvas = null, image = null, flick = 1, dead = false;

  // The WebGL canvas, made the first time it is wanted (right after the plain one: same CSS, so crop, pan and pinch move both).
  function make() {
    if (dead) return false;
    if (pass) return true;
    if (typeof WebGLRenderingContext === "undefined") return !(dead = true);                  // (no WebGL: Node, an old browser)
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    pass = makePass(canvas, {}, lose);
    if (!pass) { dead = true; canvas = null; return false; }
    pass.source(w, h);
    source.after(canvas);
    if (typeof ResizeObserver === "function") new ResizeObserver(() => { if (image && current.on && pass) show(); }).observe(canvas);
    return true;
  }
  // The plain canvas alone: the look is off, or can't be had.
  function plain() {
    if (canvas) canvas.style.display = "none";
    if (source.style) source.style.visibility = "";
    mark(source, false);
  }
  function lose() { dead = true; canvas?.remove(); pass = null; canvas = null; plain(); }
  // Draw the look from the texture, at the size the canvas has now (it follows its CSS: the box's height, and its width).
  function show() {
    canvas.style.display = "";
    const r = ratio(), cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (!cw || !ch) return;                                        // not on the page (the list of games shows): it comes back with a resize
    pass.draw(Math.round(cw * r), Math.round(ch * r), r, current, flick);
    source.style.visibility = "hidden";
    mark(source, true);
  }
  // This picture, now: the scene has just drawn `img`. The one place anything is drawn (apart from a resize and a change of settings).
  function draw(img) {
    image = img;
    if (!current.on || !make()) return plain();
    pass.upload(img);
    flick = !calm() && current.flicker ? 1 + (Math.random() * 2 - 1) * current.flicker : 1;
    show();
  }
  listeners.add(() => { if (image) draw(image); });
  publish();
  return { draw };
}

// ---- The landing page's thumbnails ----
let shared;                                                         // the one context of every thumbnail: undefined (not made yet), null (none), or its pass
const sharedPass = () => {
  if (shared === undefined) shared = typeof document === "undefined" || typeof WebGLRenderingContext === "undefined" ? null
    : makePass(document.createElement("canvas"), { preserveDrawingBuffer: true }, () => { shared = null; emit(); });
  return shared;
};

// A group of thumbnails. add(canvas, image) draws the picture (an ImageData) on a 2D canvas, plain at first and, once it is on the page
// and has a size, with the look at its displayed size × the device's ratio; again when it resizes or the settings change.
// clear() lets go of them all (the list of games is drawn afresh).
export function thumbnails() {
  const items = new Map();                                         // canvas → { ctx, image }
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver((list) => { for (const { target } of list) paint(target); }) : null;
  function paint(canvas) {
    const it = items.get(canvas);
    if (!it) return;
    const { ctx, image } = it, pass = current.on ? sharedPass() : null, r = ratio();
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (pass && cw && ch) {
      pass.source(image.width, image.height);
      pass.upload(image);
      pass.draw(Math.round(cw * r), Math.round(ch * r), r, current, 1);   // (no flicker on a thumbnail)
      if (canvas.width !== pass.canvas.width || canvas.height !== pass.canvas.height) { canvas.width = pass.canvas.width; canvas.height = pass.canvas.height; }
      ctx.drawImage(pass.canvas, 0, 0);
      mark(canvas, true);
    } else {
      if (canvas.width !== image.width || canvas.height !== image.height) { canvas.width = image.width; canvas.height = image.height; }
      ctx.putImageData(image, 0, 0);
      mark(canvas, false);
    }
  }
  listeners.add(() => { for (const canvas of [...items.keys()]) if (canvas.isConnected) paint(canvas); else items.delete(canvas); });
  publish();
  return {
    add(canvas, image) {
      items.set(canvas, { ctx: canvas.getContext("2d"), image });
      paint(canvas);
      ro?.observe(canvas);
    },
    clear() { ro?.disconnect(); items.clear(); }
  };
}
