// The reflection (INTERFACE.md §2d; ART-DIRECTION.md §6.2b): on wide windows, beside each edge of the picture, that side of it flipped,
// as on a dark surface, very blurred and faint, inside a soft oval centred on the edge; above and below the corners, the picture upside
// down. It is drawn from the finished picture each time ui/scene.js draws one (draw(image)): it has no loop of its own, so it changes
// exactly when the picture does (blinks, cycles, transitions, the sleep's dark, a hurt) and holds still when the picture does (reduced
// motion); and again when the window resizes or scrolls, or the layout changes. A WebGL canvas over the page, blended as "screen": it
// only adds light, so text over it is unchanged, and it stays over the panels and the map. Never on phones (the strip layout's
// media query only), and never on the landing page. Off (the player's switch: Settings, GRAPHICS), or without WebGL: nothing is
// drawn, no context is made, and the game is unchanged. Safe to import in Node (levels() is pure).

import { wide } from "./media.js?v=0.75.0";   // the strip layout, as ui/media.js asks it (css/layout.css)

const K = {
  mirror: 0.5,      // the reflection's strength at the edge
  glow: 0.17,       // the edge's own colour, very blurred, under the reflection
  reach: 1,         // how far the reflection fades over, in picture widths
  gap: 4,           // px between the picture and the light
  edge: 48,         // px over which the light rises from nothing at the picture
  ow: 0.43,         // the oval: its width beyond the edge, in picture heights
  oh: 1.42,         //           its height, in picture heights
  sharp: 1,         // blur level at the edge (0 sharpest … 3 blurriest)
  grow: 3,          // how quickly it blurs further out
  grain: 0.14,      // grain: one real pixel each, fixed, brightness only, a share of the light; strongest in the picture's mid-tones
};

const SW = 80, SH = 34;                 // the small copy: the picture (320×136) averaged 4×4
const SIG = [0.5, 1.2, 2.3, 4.2];       // its four blur levels (px of the small copy), stacked top to bottom in one texture
const LV = SIG.length;

const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
const FS = `precision highp float;
uniform sampler2D tex; uniform vec4 rect; uniform vec2 res; uniform float dpr;
uniform float mirror, glow, reach, edge, ow, oh, sharp, grow, grain;
float hash(vec2 p) {                                   // steady for whole-number coordinates (no sin: no patterns far from the origin)
  vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z);
}
const float LV = ${LV}.;
vec3 level(float u, float v, float l) {                // one blur level; rows kept half a texel inside its band
  float e = .5 / ${SH}.;
  return texture2D(tex, vec2(u, (l + clamp(v, e, 1. - e)) / LV)).rgb;
}
vec3 blurred(float u, float v, float l) { float a = floor(l); return mix(level(u, v, a), level(u, v, min(a + 1., LV - 1.)), l - a); }
float bayer(vec2 p) {                                  // 4×4 ordered dither, so the faint light never bands
  vec2 q = mod(floor(p), 4.); float i = q.x + q.y * 4.;
  vec4 r0 = vec4(0., 8., 2., 10.), r1 = vec4(12., 4., 14., 6.), r2 = vec4(3., 11., 1., 9.), r3 = vec4(15., 7., 13., 5.);
  vec4 row = q.y < 1. ? r0 : (q.y < 2. ? r1 : (q.y < 3. ? r2 : r3));
  float v = q.x < 1. ? row.x : (q.x < 2. ? row.y : (q.x < 3. ? row.z : row.w));
  return v / 16. - .5;
}
void main() {
  vec2 dev = vec2(gl_FragCoord.x, res.y * dpr - gl_FragCoord.y);   // real pixels (the canvas is drawn at the screen's own)
  vec2 px = dev / dpr;                                 // CSS px
  float L = rect.x, T = rect.y, W = rect.z, H = rect.w, R = L + W;
  vec2 q = abs(px - vec2(L + W * .5, T + H * .5)) - vec2(W, H) * .5;
  float out_ = length(max(q, 0.));                     // px from the picture (0 on it: nothing drawn there)
  if (out_ <= 0.) { gl_FragColor = vec4(0.); return; }
  bool left = px.x < L + W * .5;
  float sx = left ? L - px.x : px.x - R;               // px beyond the edge (negative: inward, above or below the picture)
  // the oval, centred on the edge at mid-height, soft all the way from its middle
  float ex = sx / (ow * H), ey = (px.y - T - H * .5) / (oh * H * .5);
  float oval = 1. - smoothstep(0., 1., sqrt(ex * ex + ey * ey)); oval *= oval;
  float near = smoothstep(0., edge, out_);
  // where to read: beside, the picture flipped at its edge; above or below, the picture upside down
  float v = (px.y - T) / H, mv = v < 0. ? -v : (v > 1. ? 2. - v : v);
  float d = out_ / W;                                  // distance, in picture widths
  float mu = sx < 0. ? (px.x - L) / W : (left ? min(sx / W, 1.) : 1. - min(sx / W, 1.));
  vec3 m = blurred(mu, mv, clamp(sharp + grow * 3. * d / reach, 0., LV - 1.));
  vec3 g = level(left ? 0. : 1., mv, LV - 1.);          // the edge's own colour, the blurriest
  float fade = exp(-3. * d / reach) * smoothstep(reach * 1.6, reach * .3, d);
  float am = mirror * oval * fade * near, ag = glow * oval * near;
  vec3 col = m * am + g * ag;
  // the grain: fixed (it never moves, so nothing redraws for it), brightness only, a share of the light. One real pixel each; three
  // draws averaged, so most specks are faint and few strong; strongest where the picture is mid-toned, as on film
  vec2 c = floor(dev);
  float fine = (hash(c) + hash(c + 71.3) + hash(c + 157.9)) / 3. - .5;
  float lum = dot(m, vec3(.299, .587, .114));
  col *= 1. + grain * 3.4 * fine * 4. * lum * (1. - lum) * 1.2;
  gl_FragColor = vec4(max(col + (am + ag > 0. ? bayer(dev) / 64. : 0.), 0.), 1.);   // (screen blend: black adds nothing; the dither only where there is light)
}`;

// The small copy and its blur levels, from the finished picture's pixels (RGBA, w×h). Pure, so it can be tested.
export function levels(data, w, h) {
  const fx = w / SW, fy = h / SH, base = new Float32Array(SW * SH * 3);
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let yy = Math.floor(y * fy); yy < Math.floor((y + 1) * fy); yy++)
      for (let xx = Math.floor(x * fx); xx < Math.floor((x + 1) * fx); xx++) {
        const i = (yy * w + xx) * 4; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    const o = (y * SW + x) * 3; base[o] = r / n; base[o + 1] = g / n; base[o + 2] = b / n;
  }
  const out = new Uint8Array(SW * SH * LV * 4);
  SIG.forEach((s, l) => {
    const bl = pass(pass(base, s, 1, 0), s, 0, 1);
    for (let i = 0, o = l * SW * SH * 4; i < SW * SH; i++, o += 4) {
      out[o] = bl[i * 3]; out[o + 1] = bl[i * 3 + 1]; out[o + 2] = bl[i * 3 + 2]; out[o + 3] = 255;
    }
  });
  return out;
}

// One Gaussian pass along x (dx=1) or y (dy=1), edges held.
function pass(src, s, dx, dy) {
  const rad = Math.ceil(s * 3), k = [];
  let sum = 0;
  for (let i = -rad; i <= rad; i++) { k.push(Math.exp(-i * i / (2 * s * s))); sum += k[k.length - 1]; }
  const dst = new Float32Array(src.length);
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    let r = 0, g = 0, b = 0;
    for (let i = -rad; i <= rad; i++) {
      const xx = Math.min(SW - 1, Math.max(0, x + i * dx)), yy = Math.min(SH - 1, Math.max(0, y + i * dy));
      const j = (yy * SW + xx) * 3, w = k[i + rad];
      r += src[j] * w; g += src[j + 1] * w; b += src[j + 2] * w;
    }
    const o = (y * SW + x) * 3; dst[o] = r / sum; dst[o + 1] = g / sum; dst[o + 2] = b / sum;
  }
  return dst;
}

// Set it up for the picture's element `box`. Returns { draw(image), enable(on) }: draw is called by the scene after each picture it
// draws; enable is the player's switch (on at first). The canvas and its WebGL context are made the first time there is something to
// show; no WebGL: both do nothing.
export function reflection(box) {
  const none = { draw() {}, enable() {} };
  if (typeof document === "undefined" || typeof WebGLRenderingContext === "undefined") return none;
  let cv = null, gl = null, U = null, dead = false;
  let last = null, fresh = false, queued = 0, allowed = true;

  // The canvas, its program and its texture: made once, when first wanted.
  function make() {
    if (dead) return false;
    if (cv) return true;
    cv = document.createElement("canvas");
    cv.className = "reflection";
    cv.setAttribute("aria-hidden", "true");
    Object.assign(cv.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", zIndex: "3",
      pointerEvents: "none", mixBlendMode: "screen", display: "none" });
    gl = cv.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) { cv = null; return !(dead = true); }
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.warn("The reflection's shader didn't build:", gl.getProgramInfoLog(pr)); cv = gl = null; return !(dead = true); }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(at); gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    U = (n) => gl.getUniformLocation(pr, n);
    for (const [k, v] of Object.entries(K)) gl.uniform1f(U(k), v);
    cv.addEventListener("webglcontextlost", (e) => { e.preventDefault(); dead = true; cv.remove(); cv = gl = null; });
    document.body.append(cv);
    return true;
  }

  // Once per change of the picture, of where it sits, of the window or of the switch.
  function paint() {
    queued = 0;
    const r = box.getBoundingClientRect(), show = allowed && wide.matches && last && r.width > 0 && r.height > 0;   // (the landing page: the box has no size)
    if (!show) { if (cv) cv.style.display = "none"; return; }
    if (!make()) return;
    cv.style.display = "";
    if (fresh) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SW, SH * LV, 0, gl.RGBA, gl.UNSIGNED_BYTE, levels(last.data, last.width, last.height)); fresh = false; }
    const W = innerWidth, H = innerHeight;
    const R = Math.min(devicePixelRatio || 1, 3);          // the screen's own pixels (at most 3, as the CRT look), so a grain is one real pixel
    if (cv.width !== Math.round(W * R) || cv.height !== Math.round(H * R)) { cv.width = Math.round(W * R); cv.height = Math.round(H * R); }
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform1f(U("dpr"), cv.width / W);
    gl.uniform4f(U("rect"), r.left - K.gap, r.top, r.width + 2 * K.gap, r.height);
    gl.uniform2f(U("res"), W, H);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  const later = () => { if (!queued) queued = requestAnimationFrame(paint); };
  addEventListener("resize", later);
  addEventListener("scroll", later, true);
  wide.addEventListener("change", later);
  if (typeof ResizeObserver === "function") new ResizeObserver(later).observe(box);

  return {
    draw(image) { last = image; fresh = true; if (allowed) later(); },   // (off: the picture is only remembered, nothing is drawn)
    enable(on) { if (on === allowed) return; allowed = on; if (on) fresh = !!last; later(); }
  };
}
