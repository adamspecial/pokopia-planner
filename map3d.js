function make3d(canvas, onLost) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) return null;
  const CS = 32, PA = 52, TS = 32, NL = 160, ST = 44, DEPTH = 1000, TY = 1, ZMN = 0.15, ZMX = 5;
  const VS = `#version 300 es
layout(location=0) in vec3 p;
layout(location=1) in vec2 uv;
layout(location=2) in vec4 rc;
layout(location=3) in vec4 col;
layout(location=4) in uvec4 inf;
uniform mat4 M;
uniform vec2 bk;
out vec2 vu;
flat out vec4 vr;
out vec4 vc;
flat out uvec4 vi;
out float vs;
out float vy;
const vec3 NS[10] = vec3[10](vec3(0,1,0), vec3(0,0,1), vec3(0,0,-1), vec3(1,0,0), vec3(-1,0,0), vec3(0,-1,0), vec3(0,.7071,.7071), vec3(0,.7071,-.7071), vec3(.7071,.7071,0), vec3(-.7071,.7071,0));
void main() {
  gl_Position = M * vec4(p, 1.0);
  vy = p.y;
  vu = uv; vr = rc; vc = col; vi = inf;
  vec3 n = NS[min(int(inf.x), 9)];
  if (inf.x >= 32u) { float e = (float((inf.x - 32u) / 16u) - 4.0) * 0.3926991, a = float((inf.x - 32u) % 16u) * 0.3926991; n = vec3(cos(e) * sin(a), sin(e), cos(e) * cos(a)); }
  float l = length(n.xz);
  float h = l > 0.01 ? dot(n.xz / l, bk) : 0.0;
  vs = inf.w == 3u ? 1.0 : mix(0.64 + 0.14 * h, 1.0, max(n.y, 0.0));
}`;
  const FS = `#version 300 es
precision highp float;
precision highp int;
precision mediump sampler2DArray;
uniform sampler2DArray tx;
uniform sampler2D sy;
uniform float lw, ls, g1, g8, pics, am, cut, pass, syms, cl;
uniform vec4 cw;
in float vy;
in vec2 vu;
flat in vec4 vr;
in vec4 vc;
flat in uvec4 vi;
in float vs;
out vec4 o;
void main() {
  if (pass > 0.5) { if (vy <= cut) discard; } else if (vy > cut) discard;
  if (cw.z > 0.0 && vy > cl + 0.05) { float r = length(gl_FragCoord.xy - cw.xy); if (r < cw.z && gl_FragCoord.z < cw.w) { float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))); if (n < 0.8 * (1.0 - smoothstep(cw.z * 0.55, cw.z, r))) discard; } }
  vec3 c = vc.rgb;
  if (vi.w == 0u) { if (pics > 0.5 && vi.z < 255u) c = texture(tx, vec3(vu, float(vi.z))).rgb; }
  else if (vi.w == 1u && vi.z < 255u && syms > 0.5) { vec2 f = clamp((vu - vr.xy) / max(vr.zw - vr.xy, vec2(1e-4)), 0.0, 1.0); if (vi.x != 0u) { f.y = 1.0 - f.y; if (vi.x == 2u || vi.x == 3u) f.x = 1.0 - f.x; } vec2 q = (vec2(float(vi.z % 16u), float(vi.z / 16u)) * 64.0 + 4.0 + f * 56.0) / 1024.0; vec4 t = texture(sy, q); c = c * (1.0 - t.a) + t.rgb; }
  vec2 fw = max(fwidth(vu), vec2(1e-4));
  vec2 a = (vu - vr.xy) / fw, b = (vr.zw - vu) / fw;
  uint f = vi.y;
  float e = 1e4;
  if ((f & 1u) != 0u) e = min(e, a.x);
  if ((f & 2u) != 0u) e = min(e, b.x);
  if ((f & 4u) != 0u) e = min(e, a.y);
  if ((f & 8u) != 0u) e = min(e, b.y);
  float d = (vi.w == 3u ? 0.3 : 0.42 * ls) * (1.0 - smoothstep(lw * 0.5, lw * 1.25, e));
  if (vi.w == 0u) {
    vec2 g = abs(fract(vu + 0.5) - 0.5) / fw;
    if (vi.x == 0u) {
      vec2 h = abs(fract(vu / 8.0 + 0.5) - 0.5) * 8.0 / fw;
      d = max(d, max(0.1 * g1 * (1.0 - smoothstep(0.0, lw, min(g.x, g.y))), 0.2 * g8 * (1.0 - smoothstep(0.0, lw, min(h.x, h.y)))) * ls);
    } else d = max(d, max(0.12 * (1.0 - smoothstep(0.0, lw, g.y)), 0.08 * g1 * (1.0 - smoothstep(0.0, lw, g.x))) * ls);
  }
  o = vec4(c * vs * (1.0 - d), vc.a * am);
}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const U = {}; for (const n of ['M', 'bk', 'tx', 'sy', 'lw', 'ls', 'g1', 'g8', 'pics', 'am', 'cut', 'pass', 'syms', 'cl', 'cw']) U[n] = gl.getUniformLocation(prog, n);
  const ibo = gl.createBuffer(); let iboQuads = 0;
  function quads(n) {
    if (n <= iboQuads) return; let q = Math.max(4096, iboQuads); while (q < n) q *= 2; const a = new Uint32Array(q * 6);
    for (let i = 0; i < q; i++) { const v = i * 4, o = i * 6; a[o] = v; a[o + 1] = v + 1; a[o + 2] = v + 2; a[o + 3] = v; a[o + 4] = v + 2; a[o + 5] = v + 3; }
    gl.bindVertexArray(null); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, a, gl.STATIC_DRAW); iboQuads = q;
  }
  function mesh() {
    const buf = gl.createBuffer(), vao = gl.createVertexArray(); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    for (let i = 0; i < 4; i++) gl.enableVertexAttribArray(i);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, ST, 0); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, ST, 12); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, ST, 20); gl.vertexAttribPointer(3, 4, gl.UNSIGNED_BYTE, true, ST, 36);
    gl.enableVertexAttribArray(4); gl.vertexAttribIPointer(4, 4, gl.UNSIGNED_BYTE, ST, 40);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bindVertexArray(null);
    return { buf, vao, n: 0 };
  }
  const freeMesh = (m) => { if (m) { gl.deleteBuffer(m.buf); gl.deleteVertexArray(m.vao); } };
  function upload(m, B) { m.n = B.n / 4 * 6; if (!m.n) return; quads(B.n / 4); gl.bindBuffer(gl.ARRAY_BUFFER, m.buf); gl.bufferData(gl.ARRAY_BUFFER, B.f.subarray(0, B.n * 11), gl.DYNAMIC_DRAW); }
  function builder() { const B = { f: new Float32Array(11 * 4096), u: null, n: 0 }; B.u = new Uint32Array(B.f.buffer); return B; }
  function room(B, k) { if ((B.n + k) * 11 <= B.f.length) return; let c = B.f.length * 2; while ((B.n + k) * 11 > c) c *= 2; const f = new Float32Array(c); f.set(B.f.subarray(0, B.n * 11)); B.f = f; B.u = new Uint32Array(f.buffer); }
  const pack = (face, flags, layer, kind) => (face | flags << 8 | layer << 16 | kind << 24) >>> 0;
  function q4(B, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, m, r0, r1, r2, r3, col, info) {
    room(B, 4); const f = B.f, u = B.u; let o = B.n * 11;
    const put = (x, y, z) => { f[o] = x; f[o + 1] = y; f[o + 2] = z; f[o + 3] = m === 2 ? z : x; f[o + 4] = m === 0 ? z : y; f[o + 5] = r0; f[o + 6] = r1; f[o + 7] = r2; f[o + 8] = r3; u[o + 9] = col; u[o + 10] = info; o += 11; };
    put(ax, ay, az); put(bx, by, bz); put(cx, cy, cz); put(dx, dy, dz); B.n += 4;
  }
  function box(B, x0, y0, z0, x1, y1, z1, col, kind = 1, flags = 15, sym = 255, sf = 0) {
    q4(B, x0, y1, z0, x0, y1, z1, x1, y1, z1, x1, y1, z0, 0, x0, z0, x1, z1, col, pack(0, flags, sf === 0 ? sym : 255, kind));
    q4(B, x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1, 1, x0, y0, x1, y1, col, pack(1, flags, sf === 1 ? sym : 255, kind));
    q4(B, x1, y0, z0, x0, y0, z0, x0, y1, z0, x1, y1, z0, 1, x0, y0, x1, y1, col, pack(2, flags, sf === 2 ? sym : 255, kind));
    q4(B, x1, y0, z1, x1, y0, z0, x1, y1, z0, x1, y1, z1, 2, z0, y0, z1, y1, col, pack(3, flags, sf === 3 ? sym : 255, kind));
    q4(B, x0, y0, z0, x0, y0, z1, x0, y1, z1, x0, y1, z0, 2, z0, y0, z1, y1, col, pack(4, flags, sf === 4 ? sym : 255, kind));
  }
  function hip(B, x0, y0, z0, x1, y1, z1, col) {
    const wx = x1 - x0, wz = z1 - z0, I = (f) => pack(f, 0, 255, 1);
    if (wx >= wz) {
      const r = wz / 2, zc = z0 + r;
      q4(B, x0, y0, z1, x1, y0, z1, x1 - r, y1, zc, x0 + r, y1, zc, 0, 0, 0, 1, 1, col, I(6));
      q4(B, x1, y0, z0, x0, y0, z0, x0 + r, y1, zc, x1 - r, y1, zc, 0, 0, 0, 1, 1, col, I(7));
      q4(B, x1, y0, z1, x1, y0, z0, x1 - r, y1, zc, x1 - r, y1, zc, 0, 0, 0, 1, 1, col, I(8));
      q4(B, x0, y0, z0, x0, y0, z1, x0 + r, y1, zc, x0 + r, y1, zc, 0, 0, 0, 1, 1, col, I(9));
    } else {
      const r = wx / 2, xc = x0 + r;
      q4(B, x1, y0, z1, x1, y0, z0, xc, y1, z0 + r, xc, y1, z1 - r, 0, 0, 0, 1, 1, col, I(8));
      q4(B, x0, y0, z0, x0, y0, z1, xc, y1, z1 - r, xc, y1, z0 + r, 0, 0, 0, 1, 1, col, I(9));
      q4(B, x0, y0, z1, x1, y0, z1, xc, y1, z1 - r, xc, y1, z1 - r, 0, 0, 0, 1, 1, col, I(6));
      q4(B, x1, y0, z0, x0, y0, z0, xc, y1, z0 + r, xc, y1, z0 + r, 0, 0, 0, 1, 1, col, I(7));
    }
  }
  const cc = document.createElement('canvas').getContext('2d');
  function rgba(c, a = 1) { if (typeof c === 'string' && c.length === 7 && c[0] === '#') { const n = parseInt(c.slice(1), 16); if (n === n) return ((n >> 16 & 255) | (n & 0xff00) | (n & 255) << 16 | Math.round(a * 255) << 24) >>> 0; } cc.fillStyle = '#000'; cc.fillStyle = c || '#888'; const s = cc.fillStyle; let r, g, b; if (s[0] === '#') { r = parseInt(s.slice(1, 3), 16); g = parseInt(s.slice(3, 5), 16); b = parseInt(s.slice(5, 7), 16); } else { const m = s.match(/[\d.]+/g) || [0, 0, 0]; r = +m[0]; g = +m[1]; b = +m[2]; } return (r | g << 8 | b << 16 | Math.round(a * 255) << 24) >>> 0; }
  const bytes = (u) => [(u & 255) / 255, (u >> 8 & 255) / 255, (u >> 16 & 255) / 255];
  const NI = ITEMS.length, SOLID = new Uint8Array(NI), LIQ = new Uint8Array(NI), COL = new Uint32Array(NI), COLB = new Uint32Array(NI), FLOOR = new Uint8Array(NI);
  for (const it of ITEMS) {
    const i = it.i, liq = it.L === 'g' && /water|^lava$/i.test(it.n);
    LIQ[i] = liq ? 1 : 0; FLOOR[i] = it.L === 'g' && !isRug(it) ? 1 : 0; SOLID[i] = it.L !== 'g' && isWall(it) && !inWall(it) && !fenceLike(it) ? 1 : 0;
    const base = FLOOR[i] ? picsFor(it)[2] || it.col : it.look ? it.look.a : it.col;
    COL[i] = rgba(base, liq ? 0.72 : 1); COLB[i] = rgba(it.look && it.look.b ? it.look.b : shade(base, -0.25));
  }
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
  const MIPS = Math.log2(TS) + 1; gl.texStorage3D(gl.TEXTURE_2D_ARRAY, MIPS, gl.RGBA8, TS, TS, NL);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT);
  const TL = new Int16Array(NI).fill(-1), TLS = new Uint8Array(NL); let tlNext = 0, mipDirty = false;
  const tc = document.createElement('canvas'); tc.width = tc.height = TS; const tcx = tc.getContext('2d', { willReadFrequently: true });
  function layerOf(i) {
    if (TL[i] >= 0) return TL[i];
    const it = ITEMS[i]; if (!FLOOR[i] || !picsFor(it)[1] || tlNext >= NL) { TL[i] = 255; return 255; }
    const L = tlNext++; TL[i] = L; const [r, g, b] = bytes(COL[i]), px = new Uint8Array(TS * TS * 4);
    for (let k = 0; k < TS * TS; k++) { px[k * 4] = r * 255; px[k * 4 + 1] = g * 255; px[k * 4 + 2] = b * 255; px[k * 4 + 3] = 255; }
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex); gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, L, TS, TS, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); mipDirty = true;
    return L;
  }
  function wantPics() {
    if (!S.pics) return;
    for (let i = 0; i < NI; i++) {
      const L = TL[i]; if (L < 0 || L === 255 || TLS[L]) continue; TLS[L] = 1;
      const im = new Image(); im.onload = () => { if (lost) return; tcx.clearRect(0, 0, TS, TS); tcx.drawImage(im, 0, 0, TS, TS); gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex); gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, L, TS, TS, 1, gl.RGBA, gl.UNSIGNED_BYTE, tcx.getImageData(0, 0, TS, TS)); TLS[L] = 2; mipDirty = true; requestDraw(); };
      im.onerror = () => { TLS[L] = 3; }; im.src = picsFor(ITEMS[i])[1];
    }
  }
  const atlas = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, atlas); gl.texStorage2D(gl.TEXTURE_2D, 4, gl.RGBA8, 1024, 1024);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 3);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const SC = document.createElement('canvas'); SC.width = SC.height = 64; const scx = SC.getContext('2d');
  const SLOT = new Map(), SLOTS = []; let symSig = '', atlasDirty = false;
  function paintSlot(n) {
    const e = SLOTS[n], it = ITEMS[e.i], sd = dpr; scx.setTransform(1, 0, 0, 1, 0, 0); scx.clearRect(0, 0, 64, 64); scx.save(); scx.translate(4, 4); scx.scale(1 / e.w, 1 / e.h); dpr = 1;
    try { if (e.rug) { if (!drawRug(scx, it, 0, 0, 56, e.w, e.h) && !drawLook(scx, it, 0, 0, 56, e.w, e.h)) { scx.fillStyle = picsFor(it)[2] || it.col; scx.fillRect(0, 0, 56 * e.w, 56 * e.h); } } else drawPicItem(scx, it, 0, 0, 56, e.w, e.h, false, null); } catch (er) { }
    dpr = sd; scx.restore();
    const u = picsFor(it).filter(Boolean); e.wait = S.pics && u.some(x => { const q = mapPics.get(x); return q && !q.img && !q.failed; });
    gl.bindTexture(gl.TEXTURE_2D, atlas); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); gl.texSubImage2D(gl.TEXTURE_2D, 0, (n % 16) * 64, Math.floor(n / 16) * 64, gl.RGBA, gl.UNSIGNED_BYTE, SC); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); atlasDirty = true;
  }
  function symOf(i, w, h, rug) {
    const k = i + ':' + w + 'x' + h + (rug ? 'r' : ''); let n = SLOT.get(k); if (n != null) return n;
    if (SLOTS.length >= 255) return 255; n = SLOTS.length; SLOTS.push({ i, w, h, rug, wait: false, todo: true }); SLOT.set(k, n); return n;
  }
  function syncSyms() {
    const sig = (S.pics ? 1 : 0) + '|' + (theme.panel || ''); if (sig !== symSig) { symSig = sig; for (const e of SLOTS) e.todo = true; }
    const end = performance.now() + 6; let left = false;
    for (let n = 0; n < SLOTS.length; n++) { const e = SLOTS[n]; if (!e.todo && e.wait) { const u = picsFor(ITEMS[e.i]).filter(Boolean); if (!u.some(x => { const q = mapPics.get(x); return q && !q.img && !q.failed; })) e.todo = true; } if (!e.todo) continue; if (performance.now() > end) { left = true; break; } e.todo = false; paintSlot(n); }
    if (left) requestAnimationFrame(requestDraw);
  }
  const TRUNK = rgba('#7a5434'), GLASS = rgba('#bfe6f5', 0.5);
  const PAL = { w: rgba('#b8895a'), t: TRUNK, m: rgba('#9aa2a8'), k: rgba('#3d4146'), s: rgba('#f3f1ec'), g: GLASS, y: rgba('#ffe48a'), n: rgba('#5ba84a'), r: rgba('#d8504a'), o: rgba('#f09a3c'), u: rgba('#4f8fd8'), c: rgba('#a6a59d'), p: rgba('#f4efe1'), h: rgba('#26282c'), i: rgba('#7b5a3c'), v: rgba('#9fd6ec'), q: rgba('#7cc4e4', 0.62) };
  const TONES = [];
  function tones(i) {
    let t = TONES[i]; if (t) return t; const it = ITEMS[i], a = it.look ? it.look.a : it.col, b = it.look && it.look.b ? it.look.b : shade(a, -0.25);
    return TONES[i] = { a: COL[i], b: COLB[i], d: rgba(shade(a, -0.3)), l: rgba(shade(a, 0.3)), e: rgba(shade(b, -0.3)), f: rgba(shade(b, 0.3)) };
  }
  const P8 = Math.PI / 8;
  function fid(nx, ny, nz) {
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    if (ny > 0.98) return 0; if (ny < -0.98) return 5;
    if (Math.abs(ny) < 0.02) { if (nz > 0.98) return 1; if (nz < -0.98) return 2; if (nx > 0.98) return 3; if (nx < -0.98) return 4; }
    return 32 + (Math.round(Math.asin(ny) / P8) + 4) * 16 + (Math.round(Math.atan2(nx, nz) / P8) & 15);
  }
  function pq(B, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ox, oy, oz, col, fl = 0) {
    let nx = (ay - by) * (az + bz) + (by - cy) * (bz + cz) + (cy - dy) * (cz + dz) + (dy - ay) * (dz + az), ny = (az - bz) * (ax + bx) + (bz - cz) * (bx + cx) + (cz - dz) * (cx + dx) + (dz - az) * (dx + ax), nz = (ax - bx) * (ay + by) + (bx - cx) * (by + cy) + (cx - dx) * (cy + dy) + (dx - ax) * (dy + ay);
    if (Math.abs(nx) + Math.abs(ny) + Math.abs(nz) < 1e-9) return;
    const flip = nx * ((ax + bx + cx + dx) / 4 - ox) + ny * ((ay + by + cy + dy) / 4 - oy) + nz * ((az + bz + cz + dz) / 4 - oz) < 0; if (flip) { nx = -nx; ny = -ny; nz = -nz; }
    const qx = Math.abs(nx), qy = Math.abs(ny), qz = Math.abs(nz), m = qy >= qx && qy >= qz ? 0 : qz >= qx ? 1 : 2;
    const u0 = m === 2 ? az : ax, u1 = m === 2 ? bz : bx, u2 = m === 2 ? cz : cx, u3 = m === 2 ? dz : dx, v0 = m === 0 ? az : ay, v1 = m === 0 ? bz : by, v2 = m === 0 ? cz : cy, v3 = m === 0 ? dz : dy;
    const r0 = Math.min(u0, u1, u2, u3), r1 = Math.min(v0, v1, v2, v3), r2 = Math.max(u0, u1, u2, u3), r3 = Math.max(v0, v1, v2, v3), inf = pack(fid(nx, ny, nz), m === 0 && fl === 12 ? 0 : fl, 255, 1);
    if (flip) q4(B, dx, dy, dz, cx, cy, cz, bx, by, bz, ax, ay, az, m, r0, r1, r2, r3, col, inf); else q4(B, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, m, r0, r1, r2, r3, col, inf);
  }
  function poly2(B, a, b, c, d, col) {
    const nx = (a[1] - b[1]) * (a[2] + b[2]) + (b[1] - c[1]) * (b[2] + c[2]) + (c[1] - d[1]) * (c[2] + d[2]) + (d[1] - a[1]) * (d[2] + a[2]), ny = (a[2] - b[2]) * (a[0] + b[0]) + (b[2] - c[2]) * (b[0] + c[0]) + (c[2] - d[2]) * (c[0] + d[0]) + (d[2] - a[2]) * (d[0] + a[0]), nz = (a[0] - b[0]) * (a[1] + b[1]) + (b[0] - c[0]) * (b[1] + c[1]) + (c[0] - d[0]) * (c[1] + d[1]) + (d[0] - a[0]) * (d[1] + a[1]);
    const mx = (a[0] + b[0] + c[0] + d[0]) / 4, my = (a[1] + b[1] + c[1] + d[1]) / 4, mz = (a[2] + b[2] + c[2] + d[2]) / 4;
    for (const k of [-1, 1]) pq(B, a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2], d[0], d[1], d[2], mx + k * nx, my + k * ny, mz + k * nz, col);
  }
  const RING = (n) => { const c = [], s = [], q = Math.cos(Math.PI / n); for (let k = 0; k < n; k++) { const a = (k + 0.5) * 2 * Math.PI / n; c.push(Math.cos(a) / q); s.push(Math.sin(a) / q); } return { n, c, s, cap: n === 8 ? [[0, 1, 2, 3], [0, 3, 4, 7], [4, 5, 6, 7]] : [[0, 1, 2, 3], [3, 4, 5, 0]] }; };
  const R8 = RING(8), R6 = RING(6), OC = R8.c, OS = R8.s, CAP = R8.cap;
  function cyl(B, X, Z, r0, y0, y1, r1, col) {
    const cy = (y0 + y1) / 2, G = Math.max(r0, r1) < 0.22 ? R6 : R8, C = G.c, Sn = G.s, n = G.n;
    for (let k = 0; k < n; k++) { const j = (k + 1) % n; pq(B, X + C[k] * r0, y0, Z + Sn[k] * r0, X + C[j] * r0, y0, Z + Sn[j] * r0, X + C[j] * r1, y1, Z + Sn[j] * r1, X + C[k] * r1, y1, Z + Sn[k] * r1, X, cy, Z, col, 12); }
    if (r1 > 1e-3) for (const [i, j, k, l] of G.cap) pq(B, X + C[i] * r1, y1, Z + Sn[i] * r1, X + C[j] * r1, y1, Z + Sn[j] * r1, X + C[k] * r1, y1, Z + Sn[k] * r1, X + C[l] * r1, y1, Z + Sn[l] * r1, X, y1 - 1, Z, col);
  }
  const BC = [Math.cos(-Math.PI / 4), 1, Math.cos(Math.PI / 4), 0], BS = [Math.sin(-Math.PI / 4), 0, Math.sin(Math.PI / 4), 1];
  function ball(B, X, Z, r, y0, y1, col, low) {
    const yc = (y0 + y1) / 2, ry = (y1 - y0) / 2, G = r < 0.3 ? R6 : R8, C = G.c, Sn = G.s, n = G.n;
    for (let i = 0; i < 3; i++) { const ca = r * BC[i], cb = r * BC[i + 1], ya = yc + ry * BS[i], yb = yc + ry * BS[i + 1], c = i === 0 && low != null ? low : col; for (let k = 0; k < n; k++) { const j = (k + 1) % n; pq(B, X + C[k] * ca, ya, Z + Sn[k] * ca, X + C[j] * ca, ya, Z + Sn[j] * ca, X + C[j] * cb, yb, Z + Sn[j] * cb, X + C[k] * cb, yb, Z + Sn[k] * cb, X, yc, Z, c); } }
  }
  function hcyl(B, alongX, a0, a1, c, r, yc, col) {
    const m = (a0 + a1) / 2, ox = alongX ? m : c, oz = alongX ? c : m;
    const P = (a, k, o) => { const p = c + OC[k] * r, y = yc + OS[k] * r; H3[o] = alongX ? a : p; H3[o + 1] = y; H3[o + 2] = alongX ? p : a; };
    const Q = (A, k1, B1, k2, C, k3, D, k4) => { P(A, k1, 0); P(B1, k2, 3); P(C, k3, 6); P(D, k4, 9); pq(B, H3[0], H3[1], H3[2], H3[3], H3[4], H3[5], H3[6], H3[7], H3[8], H3[9], H3[10], H3[11], ox, yc, oz, col); };
    for (let k = 0; k < 8; k++) { const j = (k + 1) & 7; Q(a0, k, a1, k, a1, j, a0, j); }
    for (const a of [a0, a1]) for (const [i, j, k, l] of CAP) Q(a, i, a, j, a, k, a, l);
  }
  const H3 = new Float64Array(12);
  function wedge(B, c, y0, y1, col) {
    const [hl, hr, lr, ll] = c, cx = (hl[0] + hr[0] + lr[0] + ll[0]) / 4, cz = (hl[1] + hr[1] + lr[1] + ll[1]) / 4, cy = y0 + (y1 - y0) / 3;
    pq(B, hl[0], y1, hl[1], hr[0], y1, hr[1], lr[0], y0, lr[1], ll[0], y0, ll[1], cx, cy, cz, col, 15);
    pq(B, hl[0], y0, hl[1], hr[0], y0, hr[1], hr[0], y1, hr[1], hl[0], y1, hl[1], cx, cy, cz, col, 15);
    pq(B, hl[0], y0, hl[1], hl[0], y1, hl[1], ll[0], y0, ll[1], ll[0], y0, ll[1], cx, cy, cz, col);
    pq(B, hr[0], y0, hr[1], lr[0], y0, lr[1], hr[0], y1, hr[1], hr[0], y1, hr[1], cx, cy, cz, col);
  }
  function spike(B, X, Z, r, y0, y1, tx, tz, col) {
    const cx = (X * 4 + tx) / 5, cz = (Z * 4 + tz) / 5, cy = (y0 * 4 + y1) / 5;
    pq(B, X - r, y0, Z - r, X + r, y0, Z - r, tx, y1, tz, tx, y1, tz, cx, cy, cz, col); pq(B, X + r, y0, Z - r, X + r, y0, Z + r, tx, y1, tz, tx, y1, tz, cx, cy, cz, col);
    pq(B, X + r, y0, Z + r, X - r, y0, Z + r, tx, y1, tz, tx, y1, tz, cx, cy, cz, col); pq(B, X - r, y0, Z + r, X - r, y0, Z - r, tx, y1, tz, tx, y1, tz, cx, cy, cz, col);
  }
  function gem(B, X, Z, r, y0, y1, col) {
    const ym = (y0 + y1) / 2, ex = [X, X + r, X, X - r], ez = [Z - r, Z, Z + r, Z];
    for (let k = 0; k < 4; k++) { const j = (k + 1) & 3; pq(B, ex[k], ym, ez[k], ex[j], ym, ez[j], X, y1, Z, X, y1, Z, X, ym, Z, col); pq(B, ex[k], ym, ez[k], ex[j], ym, ez[j], X, y0, Z, X, y0, Z, X, ym, Z, col); }
  }
  const MODELS = {
    aboard: 'qa,14,15,86,50,0,90 qb,14,50,86,85,90,0',
    aidkit: 'ba,18,26,82,78,0,46 bs,40,30,60,74,46,48 bs,28,42,72,62,46,48',
    aircon: 'ba,6,0,94,30,62,92 bd,12,30,88,32,66,70',
    amulet: 'cb,50,56,22,0,6 ca,50,56,14,6,10',
    apple: 'sb,50,50,26,0,52 ct,50,50,3,48,66',
    arcade: 'ba,14,16,86,86,0,100 bb,16,86,84,90,54,88 bk,18,80,82,96,36,46',
    armor: 'bd,32,40,68,60,0,40 ba,24,34,76,66,40,78 sa,50,50,16,78,100',
    arrowsign: 'cw,50,50,5,0,64 ba,10,44,76,56,56,86 ta,80,50,12,56,86,0,0',
    awning: 'qa,0,0,100,90,92,58 bb,0,86,100,92,48,60',
    backpack: 'ba,22,30,78,72,0,66 sa,50,51,28,50,84 bb,28,72,72,80,10,46',
    bags: 'sa,36,40,28,0,60 sa,64,62,26,0,52 cb,36,40,4,56,70',
    balloons: 'ck,40,60,2,0,60 ck,60,50,2,0,70 sa,40,60,16,56,88 sb,60,50,16,66,98 ck,50,55,10,0,6',
    banner: 'bk,6,0,94,8,88,96 ba,14,0,86,6,24,90',
    barb: 'ta,50,50,18,0,60,0,0 cb,50,50,22,0,10',
    barrel: 'ca,50,50,38,0,90 cb,50,50,40,8,16 cb,50,50,40,74,82',
    basin: 'ca,50,50,42,0,40 bq,22,22,78,78,40,41',
    basket: 'ba,14,26,86,74,0,46 bd,14,26,86,74,46,50 bb,20,46,80,54,72,80 bb,20,46,26,54,46,80 bb,74,46,80,54,46,80',
    bath: '!l ba,4,4,96,96,0,30 ba,4,4,96,12,30,56 ba,4,88,96,96,30,56 ba,4,12,12,88,30,56 ba,88,12,96,88,30,56 bv,12,12,88,88,30,46 bm,44,4,56,14,56,70',
    beak: 'da,50,50,24,0,40',
    beam: 'ba,0,36,100,64,72,100',
    bed: '!l bd,4,0,96,10,0,64 bd,4,0,96,100,0,22 bs,8,10,92,96,22,36 ba,6,40,94,98,24,40 bs,18,14,82,32,36,46',
    bell: 'ca,50,50,30,10,60,14 ca,50,50,34,0,12 cb,50,50,6,60,72',
    belt: 'ba,10,40,90,60,0,8 bb,40,36,60,64,0,10',
    bench: '!w ba,4,34,96,76,38,48 ba,4,18,96,28,52,92 bd,8,20,14,28,0,52 bd,86,20,92,28,0,52 Ld,8,36,92,74,8,0,38',
    bigpipe: '!w xa,4,96,50,46,46',
    bike: '!w zk,44,56,18,22,24 zk,44,56,82,22,24 ba,18,47,82,53,24,46 bb,62,46,70,54,46,66 bk,56,30,76,70,64,70 ba,28,44,40,56,46,58',
    bin: 'ca,50,50,30,0,70,32 cb,50,50,34,70,80',
    birdhouse: 'cw,50,50,6,0,55 ba,26,26,74,74,55,86 kb,20,20,80,80,86,100 bk,44,74,56,76,66,76',
    blender: 'ck,50,50,22,0,24 cg,50,50,18,24,80,16 ck,50,50,18,80,88',
    blob: 'sa,50,52,36,0,72',
    blocks: 'ba,14,50,46,82,0,30 bb,54,50,86,82,0,30 ba,34,22,66,54,0,30 bb,30,36,62,68,30,60',
    board: 'Pa,8,40,92,52,14,92 bd,12,44,18,50,0,14 bd,82,44,88,50,0,14',
    bollard: 'ca,50,50,20,0,60 ca,50,50,24,60,70 cb,50,50,16,70,76',
    bone: 'xa,24,76,50,8,8 sa,22,42,10,0,18 sa,22,58,10,0,18 sa,78,42,10,0,18 sa,78,58,10,0,18',
    bonfire: 'ta,50,50,34,0,56,0,0 xt,12,88,50,8,8 zt,12,88,50,8,8 to,50,50,18,30,100,0,0',
    book: 'ba,22,16,78,84,0,4 bs,24,18,76,82,4,12 ba,22,16,78,84,12,16',
    books: 'ba,20,24,80,76,0,14 bb,24,20,76,72,14,28 bf,18,28,78,80,28,40',
    border: 'ba,0,36,100,64,0,22',
    bordersingle: 'ba,30,30,70,70,0,22',
    bordercorner: 'ba,36,36,100,64,0,22 ba,36,64,64,100,0,22',
    bottle: 'xg,14,86,50,24,26 xg,86,96,50,10,26 bb,30,44,70,56,8,22 ba,48,48,52,52,22,44',
    bottles: 'ca,36,46,12,0,46 cb,64,52,14,0,56 ca,64,52,6,56,66 cs,36,46,5,46,54',
    boxes: 'ba,10,30,62,86,0,40 ba,40,14,90,64,0,52 bb,18,36,58,76,40,72',
    bubbles: 'ba,20,26,80,80,0,40 cm,30,40,8,40,60 sg,60,40,12,60,84 sg,40,30,8,80,96',
    bucket: 'cb,40,50,26,0,46,30 cw,70,40,4,0,100 sa,70,40,14,0,16',
    bunting: 'cm,2,50,3,0,96 cm,98,50,3,0,96 bk,0,49,100,51,92,95 ta,15,50,10,92,62,0,0 tb,38,50,10,92,62,0,0 ta,62,50,10,92,62,0,0 tb,85,50,10,92,62,0,0',
    cake: 'ca,50,50,34,0,30 cs,50,50,30,30,50 cb,50,50,8,50,60',
    calendar: 'Pa,22,0,78,4,30,86 bb,22,0,78,5,78,86',
    camera: 'ba,24,36,76,64,0,40 zk,64,80,50,14,20 bb,30,40,40,50,40,46',
    campfire: 'ca,50,50,40,0,8 xt,16,84,50,8,12 zt,16,84,50,8,12 tb,50,50,18,8,60,0,0 ty,50,50,10,8,74,0,0',
    cannon: '!w xa,8,94,50,22,42 zb,20,34,30,24,24 zb,66,80,30,24,24 bd,22,30,62,70,0,24',
    canoe: '!w ba,10,24,90,76,0,22 ka,0,24,20,76,0,22 ka,80,24,100,76,0,22 bb,14,30,86,70,22,24',
    cap: 'ca,50,50,24,0,10',
    cardreader: 'bm,36,40,64,60,0,70 ba,38,58,62,62,40,64',
    cart: 'ba,8,10,92,90,26,58 Lk,12,14,88,86,10,0,26 bb,86,30,96,70,58,90',
    cdplayer: 'ba,16,30,84,74,0,30 cs,50,50,16,30,32 bk,20,72,80,75,8,22',
    chain: 'cm,50,50,5,0,100',
    chair: 'ba,14,16,86,86,42,52 bb,14,12,86,24,52,96 Ld,16,16,84,84,9,0,42',
    charm: 'cm,50,50,2,64,100 sa,50,50,20,30,66 tb,50,50,10,34,10,0,0',
    chest: 'ba,12,20,88,82,0,50 xa,12,88,51,31,50 by,44,80,56,84,34,50',
    clock: 'za,40,60,50,30,40 sb,26,50,10,66,80 sb,74,50,10,66,80 bk,30,44,40,56,0,10 bk,60,44,70,56,0,10',
    cloche: 'cs,50,50,40,0,6 sa,50,50,32,6,60 cb,50,50,5,56,66',
    column: 'cd,50,50,30,0,8 ca,50,50,22,8,92 cd,50,50,30,92,100',
    cone: 'ck,50,50,34,0,6 ca,50,50,28,6,90,6 cb,50,50,20,40,54,16.4',
    console: 'ba,10,30,90,80,0,50 wb,10,30,90,80,50,62',
    cookies: 'cb,50,50,40,0,6 ca,36,42,13,6,12 ca,63,40,13,6,12 ca,50,64,13,6,12',
    cooler: 'ba,16,26,84,78,0,46 bb,14,24,86,80,46,56 bs,40,48,60,56,56,62',
    coral: 'ta,50,50,12,0,100,0,0 ta,34,40,10,0,70,-14,-10 ta,66,58,10,0,76,14,8 ta,46,70,8,0,56,-6,14',
    cords: 'xa,14,86,40,6,8 za,14,86,56,6,8 xb,20,80,64,5,14 sa,50,50,14,0,16',
    corrugated: 'ba,0,42,100,58,0,100',
    crate: 'ba,8,8,92,92,0,80 bb,6,6,94,94,0,8 bb,6,6,94,94,72,80 bb,6,6,14,94,8,72 bb,86,6,94,94,8,72',
    crop: 'bi,2,2,98,98,0,8 ta,22,22,12,8,52,0,0 ta,50,22,12,8,60,0,0 ta,78,22,12,8,52,0,0 ta,22,50,12,8,58,0,0 ta,50,50,12,8,64,0,0 ta,78,50,12,8,58,0,0 ta,22,78,12,8,52,0,0 ta,50,78,12,8,60,0,0 ta,78,78,12,8,52,0,0',
    crossing: '!w bm,4,40,16,60,0,70 bb,16,46,96,54,62,70 sr,10,50,10,70,84',
    crystal: 'cb,50,50,24,0,16,18 sa,50,50,28,16,76',
    cups: 'ca,32,38,14,0,40,16 cb,68,36,14,0,40,16 ca,50,68,14,0,40,16',
    curtain: 'bk,0,0,100,6,92,100 ba,4,0,48,12,6,92',
    curtainr: 'bk,0,0,100,6,92,100 ba,52,0,96,12,6,92',
    cutboard: 'ba,14,24,86,76,0,8',
    cutout: '!w Pa,4,44,96,54,8,100 bd,20,40,30,60,0,10 bd,70,40,80,60,0,10',
    dice: 'ba,16,30,48,62,0,32 bb,52,40,84,72,0,32',
    diggers: 'cw,40,50,4,0,90 bm,32,46,48,54,0,20 cw,64,50,4,0,80 bb,54,46,74,54,72,82',
    discoball: 'cm,50,50,3,64,100 sa,50,50,28,10,64',
    doll: 'sa,50,56,28,0,50 sa,50,50,24,40,86 tb,34,50,8,72,100,-6,0 tb,66,50,8,72,100,6,0',
    dowsing: 'ba,28,36,72,64,0,24 bb,32,40,68,60,24,28 cm,62,50,3,24,60',
    drop: 'sa,50,50,24,0,48 ta,50,50,12,40,72,0,0',
    drum: 'ca,50,50,38,0,60 cb,50,50,40,0,8 cb,50,50,40,52,60 cs,50,50,36,60,62',
    easel: 'bw,26,40,32,50,0,90 bw,68,40,74,50,0,90 bw,47,30,53,40,0,80 Pa,20,50,80,56,34,94',
    egg: 'sa,50,50,26,0,64',
    fan: 'cb,50,50,22,0,6 cb,50,50,4,6,50 za,40,52,50,26,64',
    fang: 'ta,50,50,16,0,50,0,-16',
    feather: 'fa,50,12,50,88,4,4,34',
    fireplace: '!w ba,6,30,94,92,0,90 ba,2,26,98,100,62,70 bk,24,90,76,93,4,54 bb,32,92,68,94,6,34 ba,30,30,70,60,90,100',
    firework: 'cb,50,50,8,0,40 ca,50,50,14,40,80 ta,50,50,14,80,100,0,0',
    fish: 'cm,50,46,2,70,100 sa,50,46,24,30,70 tb,50,66,10,40,60,0,14',
    flag: 'cm,22,50,4,0,100 ba,22,47,86,53,58,94',
    flask: 'cg,36,50,16,0,40,6 cg,36,50,6,40,60 cb,36,50,13,0,22,9 ca,68,50,8,0,50 ck,50,50,34,0,4',
    float: 'cg,50,50,18,0,60,22 cb,50,50,16,0,46,20 ss,50,50,18,56,76 cr,58,46,3,60,96',
    floodgate: 'ba,4,36,96,64,0,90 bb,10,30,90,36,10,80',
    floorswitch: 'bm,10,10,90,90,0,6 ba,24,24,76,76,6,12',
    flower: 'tn,32,40,5,0,58,0,0 tn,66,44,5,0,66,0,0 tn,46,70,5,0,50,0,0 sa,32,40,12,50,70 sa,66,44,12,58,78 sa,46,70,12,42,62',
    flowerbed: 'bw,4,4,96,96,0,26 bi,8,8,92,92,26,30 sb,28,30,14,28,52 sb,70,34,14,28,54 sb,48,64,14,28,50 sa,72,72,10,28,46 sa,26,70,10,28,46',
    flowers: 'ca,50,50,20,0,46,14 sb,40,40,14,46,74 sb,62,46,14,52,82 sb,48,62,12,46,70 sn,56,34,10,50,70',
    fossil: 'cc,50,50,42,0,14 Ba,24,24,76,76,14,16',
    fountain: 'ca,50,50,46,0,28 cb,50,50,40,28,30 ca,50,50,12,28,76 sa,50,50,18,70,100',
    frame: 'bb,26,46,74,56,0,60 Pa,30,54,70,58,6,56',
    wframe: 'bb,12,0,88,4,22,90 Pa,18,4,82,7,28,84',
    fridge: 'ba,8,10,92,92,0,100 bd,8,92,92,93,60,62 bm,78,92,84,97,30,56 bm,78,92,84,97,66,90',
    fries: 'ba,30,36,70,66,0,44 by,34,44,40,52,30,74 by,46,44,52,52,30,80 by,58,44,64,52,30,70',
    fruitbasket: 'ca,50,50,36,0,32,40 sr,40,44,12,26,46 sb,58,40,12,26,46 sy,52,60,12,26,44',
    furnace: 'ba,6,8,94,94,0,76 bk,30,93,70,95,10,50 bb,34,94,66,96,12,36 ca,72,28,10,76,100',
    gem: 'da,50,50,26,0,60',
    wdeco: 'da,50,8,26,40,90',
    generator: 'ba,10,20,90,80,0,56 bb,16,80,84,83,16,44 bk,60,40,80,60,56,64',
    glass: 'bg,4,44,96,56,0,100',
    glassh: 'bg,0,0,100,100,0,8',
    glasss: 'qg,0,0,100,100,100,0',
    glasses: 'ck,32,54,14,0,6 ck,68,54,14,0,6 bk,20,30,80,36,0,6',
    grandclock: 'ba,24,30,76,74,0,100 ba,20,26,80,78,90,100 zs,74,76,50,16,74',
    grass: 'ta,30,35,10,0,80,-8,-8 ta,62,30,10,0,90,6,-8 ta,50,62,12,0,100,0,6 ta,24,70,10,0,70,-8,8 ta,74,70,10,0,75,8,8',
    grate: 'Ba,0,0,100,100,0,8',
    grave: 'bb,16,34,84,70,0,10 ba,22,40,78,62,10,70 xa,22,78,51,11,70',
    guitar: 'sa,50,56,24,0,50 ba,46,48,54,58,40,100 bb,44,46,56,60,92,100',
    hammock: '!w cw,4,50,4,0,90 cw,96,50,4,0,90 bk,4,49,96,51,84,88 ba,14,30,86,70,40,48',
    handcar: 'ba,10,10,90,90,10,40 Lk,14,14,86,86,10,0,12 bm,46,46,54,54,40,70 bm,20,46,80,54,70,76',
    handheld: 'ba,30,24,70,76,0,10 bk,36,30,64,52,10,12',
    hangsign: 'cb,14,50,5,0,100 bb,14,46,86,54,90,96 Pa,24,46,80,54,40,84',
    harp: 'ba,28,44,36,56,0,92 ba,36,44,74,56,84,92 bb,60,46,66,54,8,84 ba,28,44,74,56,0,8',
    hatch: 'ba,8,8,92,92,0,6 bb,20,20,80,80,6,8 bm,40,46,60,54,8,12',
    heart: 'ca,50,50,26,0,8',
    hydrant: 'ca,50,50,24,0,70 sa,50,50,24,60,90 xa,22,78,50,8,46',
    infoboard: '!w bb,10,44,16,56,0,70 bb,84,44,90,56,0,70 Pa,4,46,96,54,40,96',
    ironframe: 'Lm,0,0,100,100,8,0,100 bm,0,0,100,8,92,100 bm,0,92,100,100,92,100 bm,0,8,8,92,92,100 bm,92,8,100,92,92,100',
    jackbox: 'ba,22,22,78,78,0,60 bb,20,20,80,80,56,62 sb,50,50,16,62,92',
    juice: 'ca,28,48,11,0,54 cb,50,40,11,0,58 co,72,52,11,0,50',
    knot: 'sa,50,50,20,0,34 xb,20,80,60,6,8',
    ladder: 'ba,10,0,18,16,0,100 ba,82,0,90,16,0,100 ba,18,4,82,12,15,22 ba,18,4,82,12,48,55 ba,18,4,82,12,81,88',
    lamp: 'cd,50,50,18,0,6 ca,50,50,6,6,78 sy,50,50,16,72,96 cb,50,50,20,92,100,6',
    wlamp: 'bk,44,0,56,30,48,56 sy,50,30,12,50,76',
    laptop: 'ba,16,34,84,80,0,6 ba,16,28,84,34,6,50 bb,20,34,80,35,10,46',
    laser: 'bm,36,36,64,64,0,40 sr,50,50,10,40,54',
    lens: 'cb,50,50,28,0,8 cg,50,50,22,8,10',
    letter: 'Ba,20,28,80,72,0,4',
    lily: 'ca,40,44,26,0,4 cd,66,64,18,0,4',
    log: 'xa,4,96,50,34,34',
    logs: 'xa,0,100,28,20,20 xa,0,100,72,20,20',
    lunchbox: 'ba,18,28,82,74,0,40 bb,16,26,84,76,40,46 bb,44,40,56,60,46,56',
    mailbox: 'cb,50,50,6,0,60 ba,26,20,74,80,60,90 za,20,80,50,24,90 br,74,30,78,40,80,100',
    manhole: 'ca,50,50,44,0,4 cb,50,50,34,4,6',
    map: 'Ba,14,20,86,80,0,4',
    mat: 'Ba,6,6,94,94,0,6',
    metaldrum: 'ca,50,50,36,0,96 cb,50,50,38,30,36 cb,50,50,38,62,68',
    metronome: 'ka,24,30,76,70,0,90 bb,48,68,52,72,20,96',
    mic: 'cb,50,50,20,0,6 ck,50,50,4,6,50 sb,50,50,12,50,72',
    microscope: 'ba,24,30,76,70,0,8 ba,30,30,42,50,8,70 cb,56,46,8,40,92 bk,40,40,70,60,30,36',
    microwave: 'ba,10,26,90,80,0,52 bk,16,80,64,82,8,44 bb,70,80,84,82,8,44',
    mirror: 'ba,20,40,80,56,0,100 bb,26,56,74,57,6,94',
    wmirror: 'ba,20,0,80,5,24,90 bb,25,5,75,6,30,84',
    mixdrum: 'bm,10,20,90,80,0,30 xa,15,85,50,32,62',
    mixer: 'ba,10,24,90,76,0,26 bb,20,30,26,70,26,30 bb,40,30,46,70,26,30 bb,60,30,66,70,26,30',
    monitor: 'ba,36,52,64,64,0,6 ba,46,54,54,60,6,24 ba,10,46,90,56,24,84 bb,14,56,86,57,28,80',
    moss: 'sa,34,40,28,-10,24 sa,66,62,26,-10,20 sd,52,30,18,-10,16',
    mug: 'ca,50,50,22,0,46 cb,50,50,18,46,47 ba,70,46,82,54,10,38',
    musicbox: 'ba,20,26,80,74,0,40 bb,18,24,82,76,40,48 sy,50,50,8,48,58',
    net: '!w cw,4,50,4,0,100 cw,96,50,4,0,100 bs,4,48,96,52,62,96 sy,30,80,10,0,20',
    netting: 'ba,0,46,100,54,0,100',
    newspaper: 'Ba,14,22,86,78,0,4',
    note: 'Ba,24,16,76,84,0,4',
    nugget: 'sa,50,50,28,0,40 sb,40,58,14,0,26',
    openbook: 'Ba,8,26,92,74,0,6',
    orb: 'sa,50,50,30,0,60',
    paintballoon: 'sa,50,50,30,0,64 ta,50,50,8,56,72,0,0',
    palm: 'ct,50,50,9,0,90,6 fn,50,50,6,50,90,64,24 fn,50,50,94,50,90,64,24 fn,50,50,50,6,90,64,24 fn,50,50,50,94,90,64,24 fa,50,50,18,18,90,70,18 fa,50,50,82,82,90,70,18 fa,50,50,82,18,90,70,18 fa,50,50,18,82,90,70,18 sb,50,50,10,84,96',
    pan: 'ca,50,58,34,0,10 bd,46,2,54,26,6,10',
    papers: 'Ba,18,14,82,86,0,4',
    parasol: 'cs,50,50,3,0,90 cb,50,50,48,72,90,4',
    partition: 'ba,4,42,96,58,0,92',
    pen: 'xa,14,86,50,5,6 xy,8,14,50,3,6',
    pencils: 'ca,50,50,18,0,40 ty,40,46,4,30,76,0,0 tr,58,52,4,30,72,0,0 tu,50,58,4,30,80,0,0',
    perch: 'cb,50,50,22,0,6 cb,50,50,4,6,80 xa,20,80,50,4,80',
    phone: 'ba,32,22,68,78,0,6 bb,35,26,65,72,6,7',
    pile: 'sa,50,50,44,-20,50',
    pine: 'ct,50,50,10,0,30 ca,50,50,46,20,56,16 ca,50,50,38,44,80,10 ca,50,50,28,68,100,0',
    pinwheel: 'cw,40,50,2,0,64 cw,62,50,2,0,72 db,40,50,14,52,76 da,62,50,14,60,84',
    pipeh: 'xa,0,100,50,16,50',
    pipev: 'ca,50,50,16,0,100',
    pipeupt: 'ca,50,50,16,0,100 xa,50,100,50,16,50',
    pipeup: 'ca,50,50,16,50,100 xa,50,100,50,16,50',
    pipecurve: 'xa,34,100,50,16,50 za,50,100,50,16,50',
    pipet: 'xa,0,100,50,16,50 za,50,100,50,16,50',
    pipecross: 'xa,0,100,50,16,50 za,0,100,50,16,50',
    pipeupx: 'ca,50,50,16,0,100 xa,0,100,50,16,50 za,0,100,50,16,50',
    pipes: '!w xa,2,98,30,14,14 xa,2,98,70,14,14 xb,2,98,50,14,38',
    pizza: 'ca,50,50,40,0,6 cb,50,50,34,6,8 cr,36,40,6,8,10 cr,62,46,6,8,10 cr,46,64,6,8,10',
    planet: 'cm,50,50,16,0,6 cm,50,50,3,6,40 sa,50,50,26,40,92 cb,50,50,38,64,68',
    planks: 'ba,0,4,100,30,0,12 ba,0,36,100,64,0,12 ba,0,70,100,96,0,12',
    planter: 'ba,10,10,90,90,0,46 bi,14,14,86,86,46,48 sb,36,40,16,46,72 sb,64,60,16,46,70',
    plate: 'ca,50,50,38,0,6',
    plates: 'za,44,56,30,22,26 zb,44,56,70,22,26 bd,14,40,86,60,0,4',
    platform: 'bm,2,2,98,98,0,10 ba,8,8,92,92,10,12 by,2,2,98,8,10,11',
    platter: 'cb,50,50,42,0,6 sa,36,42,12,6,20 sr,62,40,12,6,20 sy,50,64,12,6,20',
    pod: 'cb,50,50,40,0,12 sa,50,50,32,8,92',
    pokeball: 'sa,50,50,30,0,60,1 ck,50,50,31,29,31 zs,78,82,50,8,30',
    pole: 'ct,50,50,10,0,100 bt,10,44,90,56,84,90',
    popper: 'ca,50,50,6,0,50,20 sb,50,50,16,50,70',
    pot: 'ca,50,50,36,0,42 cd,50,50,38,40,46',
    pottedplant: 'ca,50,50,24,0,40,30 sb,50,50,30,40,90',
    pouch: 'sa,50,56,26,0,48 cb,50,56,10,40,58 cb,50,56,14,56,62',
    printer: 'ba,12,26,88,78,0,40 bb,24,18,76,40,40,58 bs,24,76,76,90,20,24',
    projector: 'ba,24,30,76,70,0,40 zb,70,82,50,14,22',
    pulley: 'za,40,60,50,30,55 cm,50,50,4,85,100',
    pumpkin: 'sa,50,50,34,0,64 tb,50,50,4,58,76,0,0',
    pumptower: 'sa,50,50,30,0,50 sa,50,50,26,48,92 tb,50,50,4,88,100,0,0',
    punchbag: 'cm,50,50,2,82,100 ca,50,50,22,18,84 cb,50,50,24,0,6',
    raft: '!w ba,4,10,96,24,0,30 ba,4,76,96,90,0,30 ba,4,24,16,76,0,30 ba,84,24,96,76,0,30 bb,16,24,84,76,0,8',
    rail: 'bt,10,5,25,95,0,5 bt,60,5,75,95,0,5 bm,0,22,100,30,5,11 bm,0,70,100,78,5,11',
    register: 'ba,14,30,86,86,0,34 wa,14,30,86,70,34,52 bb,40,14,60,30,34,62',
    ring: 'ca,50,50,44,0,22 cq,50,50,22,22,23',
    rock: 'sa,48,54,44,-14,76 sd,70,32,22,-10,44',
    rocket: '!l za,14,96,50,16,30 sa,50,14,16,14,46 bb,16,56,84,92,14,22 bb,47,80,53,96,30,66',
    rod: 'xk,4,96,50,3,6 ca,24,50,8,0,12',
    roofslope: 'wa,0,0,100,100,0,100',
    roofhip: 'ka,0,0,100,100,0,100',
    roofvalley: 'wa,0,0,100,100,0,100 Wa,0,0,100,100,0,100',
    roofflat: 'ba,0,0,100,100,0,25',
    roofdeco: 'ba,0,30,100,70,0,30 sa,50,50,20,30,70',
    root: 'ta,50,50,24,0,40,0,0 ta,30,60,10,0,20,-20,10 ta,70,40,10,0,20,20,-10',
    rope: 'ca,50,50,6,0,100',
    safe: 'ba,14,18,86,86,0,80 bb,46,86,54,90,34,46 zb,86,88,40,8,52',
    sandbags: '!w xa,4,48,32,24,22 xa,52,96,32,24,22 xa,4,48,72,24,22 xa,52,96,72,24,22 xa,28,72,52,24,60',
    sandbox: 'ba,0,0,100,8,0,24 ba,0,92,100,100,0,24 ba,0,8,8,92,0,24 ba,92,8,100,92,0,24 bb,8,8,92,92,0,14',
    sandtoys: 'cb,36,50,18,0,36,22 ta,66,46,12,0,40,0,0',
    sandwich: 'ba,16,28,84,72,0,12 bb,18,30,82,70,12,18 ba,16,28,84,72,18,30',
    scaffold: 'Lm,0,0,100,100,8,0,100 bm,0,0,100,8,92,100 bm,0,92,100,100,92,100 bm,0,8,8,92,92,100 bm,92,8,100,92,92,100',
    scarf: 'ba,20,30,80,70,0,6 bb,60,30,70,90,0,8',
    screen: 'bk,10,0,90,6,30,86 bb,14,6,86,7,34,82',
    scroll: 'bk,10,0,90,6,90,96 Pa,18,0,82,4,14,90 bk,14,0,86,6,8,14',
    seccam: 'cm,50,50,4,0,70 za,30,80,50,14,74',
    seed: 'sa,50,50,20,0,40',
    servers: 'ba,10,14,90,90,0,100 bk,14,90,86,92,6,94 by,20,92,30,93,80,84 by,20,92,30,93,50,54 by,20,92,30,93,20,24',
    setting: 'cs,50,50,30,0,6 bm,14,30,18,70,0,4 bm,82,30,86,70,0,4',
    shavedice: 'cs,50,50,26,0,20,18 sa,50,50,26,16,76',
    shelf: 'ba,4,10,12,96,0,100 ba,88,10,96,96,0,100 bd,4,6,96,14,0,100 ba,12,14,88,96,0,6 ba,12,14,88,96,32,38 ba,12,14,88,96,64,70 ba,4,10,96,96,94,100 bb,16,26,40,90,6,26 bf,44,30,62,88,6,24 be,20,30,36,86,38,58 bb,50,26,80,90,38,56 bf,18,28,46,88,70,88',
    shield: 'zb,44,56,50,32,36',
    shower: 'ba,4,4,96,96,0,6 bg,4,4,96,8,6,96 bg,4,8,8,96,6,96 bm,44,8,56,16,10,92 cm,50,30,12,84,90',
    shutter: 'ba,0,0,100,8,4,100 bd,0,0,100,10,0,8',
    sign: 'cw,50,50,5,0,60 Pa,14,44,86,54,50,90',
    signpost: 'cs,50,50,5,0,100 Pb,10,44,90,54,60,94',
    sink: 'ba,8,20,92,92,0,70 bm,18,30,82,80,70,72 cm,50,24,4,70,86 bm,46,24,54,40,82,86',
    skylight: 'bd,0,0,100,100,0,4 bg,8,8,92,92,4,12',
    slab: 'ba,0,0,100,100,0,30',
    sleepingbag: '!l ba,8,4,92,96,0,14 bb,10,4,90,28,14,20',
    slide: '!w Lk,2,30,30,70,8,0,64 ba,2,30,30,70,60,66 Wb,30,34,100,66,0,66 ba,0,30,4,70,0,90 ba,0,26,30,30,66,86 ba,0,70,30,74,66,86',
    sofa: '!w bd,4,4,96,96,0,22 ba,14,28,86,96,22,44 ba,4,4,96,28,22,88 ba,4,28,16,96,22,62 ba,84,28,96,96,22,62',
    speaker: 'ba,20,30,80,76,0,90 zb,76,78,50,20,30 zb,76,78,50,12,70',
    spoon: 'xa,10,70,50,4,6 sa,78,50,14,0,12',
    spout: 'ca,50,50,28,0,50 xa,50,100,50,8,40',
    spray: 'ca,50,50,16,0,56 cb,50,50,10,56,72',
    sprinkler: 'cm,50,50,5,0,30 cb,50,50,18,30,40',
    squid: 'sa,50,50,24,24,74 tb,40,50,6,30,0,0,0 tb,60,50,6,30,0,0,0',
    stage: 'ba,0,0,100,100,0,30 ba,2,2,98,6,30,90 bb,6,6,94,8,34,86',
    stand: 'cb,50,50,30,0,8 ca,50,50,14,8,62 cb,50,50,32,62,72',
    standmic: 'ck,50,50,16,0,6 cb,50,50,3,6,76 sk,50,50,10,76,96',
    star: 'da,50,50,26,0,40',
    statue: 'bb,14,14,86,86,0,24 sa,50,50,26,24,84 sa,50,50,18,72,100',
    steppingstones: 'cc,30,30,18,0,8 cc,68,40,16,0,8 cc,42,72,18,0,8',
    steps: 'ba,0,67,100,100,0,33.4 ba,0,33,100,67,0,66.7 ba,0,0,100,33,0,100',
    stone: 'sa,50,50,30,-6,46 sb,40,60,12,0,26',
    stonesign: 'bb,6,34,94,70,0,10 Pa,12,40,88,62,10,92',
    stool: 'cd,50,50,24,0,34 ca,50,50,34,34,46',
    storage: 'ba,8,10,92,92,0,72 bb,6,8,94,94,72,84 bk,42,92,58,95,50,64',
    wstorage: 'ba,6,0,94,50,30,80 bk,42,50,58,53,48,60',
    stove: 'ba,8,14,92,92,0,72 bk,14,20,86,86,72,74 ck,32,40,12,74,76 ck,68,40,12,74,76 bk,16,92,84,94,16,56',
    stump: 'ca,50,50,34,0,36 cl,50,50,30,36,40',
    supplies: '!w ba,4,20,60,80,0,30 xb,60,96,40,12,12 xb,60,96,64,12,12 ba,10,28,50,72,30,50',
    switch: 'cm,50,50,6,0,70 ba,32,32,68,68,70,96 bb,40,64,60,69,76,90',
    wswitch: 'ba,34,0,66,6,40,66 bb,44,6,56,9,48,58',
    table: 'ba,4,4,96,96,62,72 Ld,10,10,90,90,8,0,62',
    wtable: 'ba,4,0,96,60,62,72 bd,40,0,60,40,30,62',
    tablet: 'ba,22,16,78,84,0,5 bb,26,20,74,80,5,6',
    tail: 'xa,20,70,50,8,10 sa,76,50,12,0,20',
    target: 'ca,50,50,36,0,6 cb,50,50,24,6,8 ca,50,50,12,8,10',
    teaset: 'ba,10,22,90,78,0,6 sb,38,50,18,6,40 cb,70,36,8,6,20 cb,70,64,8,6,20 cb,38,50,6,38,46',
    teeth: 'sa,50,50,26,0,34',
    telescope: 'Lk,24,24,76,76,5,0,50 za,20,90,50,12,62',
    tiers: 'cm,50,50,3,0,96 ca,50,50,40,10,14 cb,50,50,32,46,50 ca,50,50,22,80,84 sb,40,46,8,14,24 sr,62,54,8,50,60',
    tire: 'za,32,68,50,36,36 zk,31,69,50,16,36',
    tires: 'ca,50,50,36,0,30 ca,50,50,36,30,60 ck,50,50,16,60,61',
    toilet: 'ba,24,8,76,30,0,90 ca,50,58,24,0,40 cb,50,58,26,40,46',
    toolboard: 'Pa,6,0,94,6,20,90',
    toolbox: 'ba,14,30,86,70,0,46 bb,30,46,70,54,46,62',
    tower: 'ba,30,14,70,86,0,90 bb,32,86,68,87,20,80',
    transmitter: 'cm,50,50,8,0,70 da,50,50,22,60,100',
    tree: 'ct,50,50,10,0,46 sa,50,50,46,30,100 sl,30,68,8,54,70 sl,70,60,8,66,82 sl,52,30,8,74,90',
    tv: 'bb,6,40,94,84,0,26 bb,10,46,90,60,26,90 ba,14,60,86,61,30,86',
    ufo: 'ca,50,50,30,10,30,46 ca,50,50,46,30,50,30 sg,50,50,24,46,90 Lk,24,24,76,76,5,0,20',
    uplog: 'ca,50,50,34,0,100',
    vane: 'ca,50,50,4,0,92 ba,22,48,78,52,82,88 da,50,50,8,88,100',
    vase: 'ca,50,50,20,0,40,12 cb,50,50,12,40,56,16',
    vending: 'ba,8,20,92,92,0,100 bb,14,92,62,94,40,92 bk,68,92,84,94,40,70',
    vine: 'Pa,4,0,96,8,10,96',
    wagon: '!w ba,8,14,92,86,24,60 zk,4,14,20,22,22 zk,86,96,20,22,22 zk,4,14,80,22,22 zk,86,96,80,22,22 bb,92,46,100,54,30,34',
    wallclock: 'zb,0,5,50,36,62 za,5,7,50,30,62 bk,49,7,51,8,60,82',
    washer: 'ba,8,10,92,92,0,90 zk,92,94,50,28,44 zg,93,95,50,22,44',
    waterbottle: 'ca,50,50,18,0,60 cb,50,50,10,60,72',
    web: 'Pa,0,46,100,54,0,100',
    wheel: 'za,44,56,50,40,50 zb,40,60,50,10,50 bk,46,46,54,54,0,12',
    wheelbarrow: 'ba,14,20,86,80,30,64 Lk,20,20,80,40,6,0,30 xk,44,56,86,16,16 bk,20,0,26,30,30,40 bk,74,0,80,30,30,40',
    whiteboard: '!w Pa,4,46,96,54,30,94 bm,8,44,14,56,0,30 bm,86,44,92,56,0,30',
    wire: 'ck,50,50,3,0,100',
    wishnote: 'Ba,24,20,76,80,0,4',
    workbench: '!w ba,2,10,98,90,52,64 Lb,6,14,94,86,8,0,52 bm,70,20,86,40,64,78',
    wreath: 'za,40,60,50,38,50 zk,39,61,50,18,50',
    yarn: 'sa,40,50,20,0,40 sb,66,56,16,0,32 xk,10,90,40,2,4',
    wposter: 'Pa,10,0,90,6,18,92',
    wpaper: 'Pa,0,0,100,5,0,100',
    fpaper: 'Ba,0,0,100,100,0,3',
    ventfan: 'ba,4,30,96,70,0,100 zk,68,72,50,40,50',
  };
  const ALIAS = { arrowleft: 'arrowsign' };
  const WALLM = { storage: 'wstorage', table: 'wtable', mirror: 'wmirror', lamp: 'wlamp', switch: 'wswitch', gem: 'wdeco', star: 'wdeco', frame: 'wframe', clock: 'wallclock' };
  const NAMEM = { 'Glass pane (horizontal)': 'glassh', 'Glass pane (sloped)': 'glasss', 'Driftwood': 'log', 'White driftwood': 'log', 'Large ventilation fan': 'ventfan', 'Pumpkin lantern tower': 'pumptower', 'Iron pipe (downward T)': 'pipeupt', 'Arch bridge': 'planks' };
  const KITS = {
    tent: 'ka,2,2,98,98,0,100 bb,42,92,58,97,0,40',
    pokeball: 'sa,50,50,48,0,100,1 ck,50,50,49,48,52 bk,44,94,56,99,0,26',
    sub: '!w xa,22,78,50,38,46 sa,22,50,38,-2,94 sa,78,50,38,-2,94 ba,42,38,58,62,80,100',
    windmill: 'ca,50,50,42,0,70,30 cb,50,50,34,70,86,0 bs,44,88,56,94,36,100 bs,6,88,94,94,62,74',
    wheel: 'ba,42,8,96,92,0,66 kb,38,4,100,96,66,100 xb,6,38,50,40,40',
    furnace: 'bc,6,6,94,94,0,70 bk,30,94,70,96,8,44 bb,34,95,66,97,10,30 ca,70,30,12,70,100',
    charger: 'bm,10,10,90,90,0,8 ba,30,30,70,70,8,90 by,34,70,66,71,40,80',
    clocktower: 'ba,12,12,88,88,0,78 kb,6,6,94,94,78,100 zs,88,90,50,22,66 zk,90,91,50,4,66',
    statue: 'bc,10,10,90,90,0,26 sa,50,50,30,26,80 sa,50,50,20,70,100',
    stage: 'ba,0,0,100,100,0,26 bb,2,0,98,8,26,100 bk,0,0,4,24,26,100 bk,96,0,100,24,26,100',
    park: 'bn,0,0,100,100,0,4 bc,0,46,100,54,4,6 ct,20,24,3,4,60 sn,20,24,12,40,100 ct,78,72,3,4,60 sn,78,72,12,40,100 bw,40,30,64,38,4,30',
    mural: '!w Pa,2,30,98,70,0,100',
    fountain: 'ca,50,50,46,0,24 cb,50,50,40,24,26 ca,50,50,10,26,70 sb,50,50,16,60,100',
    altar: 'bc,0,0,100,100,0,16 ba,20,20,80,80,16,40 ba,36,36,64,64,40,70 tb,50,50,12,70,100,0,0',
  };
  const HOUSE = new Set(['house', 'center', 'office', 'shop', 'temple']);
  const PARSED = new Map(), MOD = [];
  function parse(src) {
    let m = PARSED.get(src); if (m) return m; m = { l: 0, w: 0, ops: [] };
    for (const t of src.split(' ')) { if (!t) continue; if (t[0] === '!') { m[t[1]] = 1; continue; } m.ops.push({ o: t[0], c: t[1], n: t.slice(3).split(',').map(Number) }); }
    m.y0 = Math.min(...m.ops.map(({ o, n }) => 'bBPLwWkq'.includes(o) ? n[o === 'L' ? 5 : 4] : 'csdt'.includes(o) ? n[3] : n[4] - n[3])) / 100;
    PARSED.set(src, m); return m;
  }
  function modelOf(it) {
    let m = MOD[it.i]; if (m !== undefined) return m; const k = lookK(it);
    let key = NAMEM[it.n] || (it.c === 'Wallpaper' ? 'wpaper' : it.c === 'Poster' ? 'wposter' : hangs(it) && WALLM[k] ? WALLM[k] : ALIAS[k] || k);
    const src = it.c === 'Kits' ? KITS[k] : MODELS[key];
    return MOD[it.i] = src ? parse(src) : null;
  }
  const FR = { cx: 0, cz: 0, ux: 1, uz: 0, vx: 0, vz: 1, mw: 1, mh: 1, s: 1, y0: 0, t: 1, fr: 1 };
  const frontFace = () => FR.vz > 0.5 ? 1 : FR.vz < -0.5 ? 2 : FR.vx > 0.5 ? 3 : 4;
  function frame(ob, r, m) {
    const U = [[1, 0], [0, 1], [-1, 0], [0, -1]][r], V = [[0, 1], [-1, 0], [0, -1], [1, 0]][r], lw = r & 1 ? ob.h : ob.w, lh = r & 1 ? ob.w : ob.h;
    FR.cx = ob.x + ob.w / 2; FR.cz = ob.y + ob.h / 2; FR.y0 = zOf(ob); FR.t = htOf(ob); FR.lw = lw; FR.lh = lh;
    if (m && ((m.l && lw > lh) || (m.w && lw < lh))) { FR.ux = -V[0]; FR.uz = -V[1]; FR.vx = U[0]; FR.vz = U[1]; FR.mw = lh; FR.mh = lw; }
    else { FR.ux = U[0]; FR.uz = U[1]; FR.vx = V[0]; FR.vz = V[1]; FR.mw = lw; FR.mh = lh; }
    FR.s = Math.min(FR.mw, FR.mh); FR.fr = frontFace();
  }
  const WX = (u, v) => FR.cx + (u - 0.5) * FR.mw * FR.ux + (v - 0.5) * FR.mh * FR.vx, WZ = (u, v) => FR.cz + (u - 0.5) * FR.mw * FR.uz + (v - 0.5) * FR.mh * FR.vz, WY = (y) => FR.y0 + y * FR.t;
  function abox(B, u0, v0, u1, v1, y0, y1, col, sym, sf) {
    const xa = WX(u0, v0), za = WZ(u0, v0), xb = WX(u1, v1), zb = WZ(u1, v1);
    box(B, Math.min(xa, xb), WY(y0), Math.min(za, zb), Math.max(xa, xb), WY(y1), Math.max(za, zb), col, 1, 15, sym, sf);
  }
  function run(B, BT, ob, m) {
    const T = tones(ob.i), S = FR.s, ops = m.ops;
    for (let j = 0; j < ops.length; j++) {
      const { o, c, n } = ops[j], col = T[c] != null ? T[c] : PAL[c] != null ? PAL[c] : T.a, D = c === 'g' || c === 'q' ? BT : B, p = (k) => (n[k] || 0) / 100;
      switch (o) {
        case 'b': abox(D, p(0), p(1), p(2), p(3), p(4), p(5), col, 255, 0); break;
        case 'B': abox(D, p(0), p(1), p(2), p(3), p(4), p(5), col, symOf(ob.i, ob.w, ob.h), 0); break;
        case 'P': abox(D, p(0), p(1), p(2), p(3), p(4), p(5), col, symOf(ob.i, FR.lw, FR.lh), FR.fr); break;
        case 'c': { const X = WX(p(0), p(1)), Z = WZ(p(0), p(1)), r0 = p(2) * S, r1 = (n.length > 5 ? p(5) : p(2)) * S; if (r0 < 0.1 && r1 < 0.1) { const e = Math.max(r0, r1, 0.02); box(D, X - e, WY(p(3)), Z - e, X + e, WY(p(4)), Z + e, col); } else cyl(D, X, Z, r0, WY(p(3)), WY(p(4)), r1, col); break; }
        case 's': { const X = WX(p(0), p(1)), Z = WZ(p(0), p(1)), r = p(2) * S; if (r < 0.15 && !n[5]) gem(D, X, Z, r * 1.15, WY(p(3)), WY(p(4)), col); else ball(D, X, Z, r, WY(p(3)), WY(p(4)), col, n[5] ? T.b : null); break; }
        case 'd': gem(D, WX(p(0), p(1)), WZ(p(0), p(1)), p(2) * S, WY(p(3)), WY(p(4)), col); break;
        case 't': spike(D, WX(p(0), p(1)), WZ(p(0), p(1)), p(2) * S, WY(p(3)), WY(p(4)), WX(p(0) + p(5), p(1) + p(6)), WZ(p(0) + p(5), p(1) + p(6)), col); break;
        case 'k': { const xa = WX(p(0), p(1)), za = WZ(p(0), p(1)), xb = WX(p(2), p(3)), zb = WZ(p(2), p(3)); hip(D, Math.min(xa, xb), WY(p(4)), Math.min(za, zb), Math.max(xa, xb), WY(p(5)), Math.max(za, zb), col); break; }
        case 'w': case 'W': { const q = o === 'w' ? [[p(0), p(1)], [p(2), p(1)], [p(2), p(3)], [p(0), p(3)]] : [[p(0), p(3)], [p(0), p(1)], [p(2), p(1)], [p(2), p(3)]]; wedge(D, q.map(([u, v]) => [WX(u, v), WZ(u, v)]), WY(p(4)), WY(p(5)), col); break; }
        case 'x': case 'z': { const a = o === 'x', P0 = a ? [p(0), p(2)] : [p(2), p(0)], P1 = a ? [p(1), p(2)] : [p(2), p(1)], X0 = WX(P0[0], P0[1]), Z0 = WZ(P0[0], P0[1]), X1 = WX(P1[0], P1[1]), Z1 = WZ(P1[0], P1[1]), ax = Math.abs(X1 - X0) >= Math.abs(Z1 - Z0), rr = p(3) * S, yc = WY(p(4)); if (rr < 0.06) box(D, Math.min(X0, X1) - (ax ? 0 : rr), yc - rr, Math.min(Z0, Z1) - (ax ? rr : 0), Math.max(X0, X1) + (ax ? 0 : rr), yc + rr, Math.max(Z0, Z1) + (ax ? rr : 0), col); else hcyl(D, ax, ax ? X0 : Z0, ax ? X1 : Z1, ax ? Z0 : X0, rr, yc, col); break; }
        case 'L': { const s = p(4) * S, su = s / FR.mw, sv = s / FR.mh; for (const [u, v] of [[p(0), p(1)], [p(2) - su, p(1)], [p(0), p(3) - sv], [p(2) - su, p(3) - sv]]) abox(D, u, v, u + su, v + sv, p(5), p(6), col, 255, 0); break; }
        case 'q': poly2(D, [WX(p(0), p(1)), WY(p(4)), WZ(p(0), p(1))], [WX(p(2), p(1)), WY(p(4)), WZ(p(2), p(1))], [WX(p(2), p(3)), WY(p(5)), WZ(p(2), p(3))], [WX(p(0), p(3)), WY(p(5)), WZ(p(0), p(3))], col); break;
        case 'f': { const X0 = WX(p(0), p(1)), Z0 = WZ(p(0), p(1)), X1 = WX(p(2), p(3)), Z1 = WZ(p(2), p(3)), dx = X1 - X0, dz = Z1 - Z0, l = Math.hypot(dx, dz) || 1, w = p(6) * S / 2, px = -dz / l * w, pz = dx / l * w, mx = X0 + dx * 0.4, mz = Z0 + dz * 0.4, my = WY(p(4) + (p(5) - p(4)) * 0.3); poly2(D, [X0, WY(p(4)), Z0], [mx + px, my, mz + pz], [X1, WY(p(5)), Z1], [mx - px, my, mz - pz], col); break; }
      }
    }
  }
  function house(B, BT, ob, it, k) {
    const T = tones(ob.i), t = FR.t, bh = Math.max(0.8, t * 0.55), iu = 0.1 / FR.mw, iv = 0.1 / FR.mh, Y = (y) => y / t;
    abox(B, iu, iv, 1 - iu, 1 - iv, 0, Y(bh), T.a, 255, 0);
    { const e = 0.02, xa = WX(e / FR.mw, e / FR.mh), za = WZ(e / FR.mw, e / FR.mh), xb = WX(1 - e / FR.mw, 1 - e / FR.mh), zb = WZ(1 - e / FR.mw, 1 - e / FR.mh); hip(B, Math.min(xa, xb), FR.y0 + bh, Math.min(za, zb), Math.max(xa, xb), FR.y0 + t - 0.02, Math.max(za, zb), T.b); }
    const dw = Math.min(0.9, FR.mw * 0.3) / FR.mw, dh = Math.min(bh * 0.8, 1.5), fv = 1 - iv, th = 0.04 / FR.mh;
    abox(B, 0.5 - dw / 2, fv - th / 2, 0.5 + dw / 2, fv + th, 0, Y(dh), PAL.i, 255, 0);
    if (FR.mw >= 3 && bh >= 1) { const ww = Math.min(0.7, FR.mw * 0.14) / FR.mw, y0 = Y(Math.min(bh * 0.4, 0.6)), y1 = Y(Math.min(bh * 0.8, 1.3)); for (const u of [0.22, 0.78]) abox(B, u - ww / 2, fv - th / 2, u + ww / 2, fv + th, y0, y1, PAL.v, 255, 0); }
  }
  function emitObj(B, BT, ob) {
    const it = ITEMS[ob.i], z = zOf(ob), t = htOf(ob), x0 = ob.x, z0 = ob.y, x1 = x0 + ob.w, z1 = z0 + ob.h, a = COL[ob.i], k = lookK(it);
    if (isDoor(it) || isWindow(it)) {
      const nb = structAround([ob.x, ob.y, ob.w, ob.h, z]), hz = ob.w !== ob.h ? ob.w > ob.h : !!(nb.w || nb.e) || !(nb.n || nb.s), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, th = isDoor(it) ? 0.1 : 0.06;
      const sx0 = hz ? x0 : cx - th, sx1 = hz ? x1 : cx + th, sz0 = hz ? cz - th : z0, sz1 = hz ? cz + th : z1, top = z + t;
      if (isDoor(it)) { box(B, sx0, z, sz0, sx1, top - 0.04, sz1, a); return; }
      box(B, x0, z, z0, x1, z + 0.25, z1, a); box(B, x0, top - 0.15, z0, x1, top, z1, a); box(BT, sx0, z + 0.25, sz0, sx1, top - 0.15, sz1, GLASS); return;
    }
    if (fenceLike(it)) {
      const nb = structAround([ob.x, ob.y, ob.w, ob.h, z]), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, r = 0.05, y0 = z + 0.3, y1 = z + 0.72;
      if (ob.w > 1 || ob.h > 1) { if (ob.w >= ob.h) box(B, x0, y0, cz - r, x1, y1, cz + r, a); else box(B, cx - r, y0, z0, cx + r, y1, z1, a); return; }
      box(B, cx - 0.11, z, cz - 0.11, cx + 0.11, z + 0.85, cz + 0.11, a);
      const any = nb.n || nb.s || nb.w || nb.e;
      if (nb.w || !any) box(B, x0, y0, cz - r, cx - 0.11, y1, cz + r, a);
      if (nb.e || !any) box(B, cx + 0.11, y0, cz - r, x1, y1, cz + r, a);
      if (nb.n) box(B, cx - r, y0, z0, cx + r, y1, cz - 0.11, a);
      if (nb.s) box(B, cx - r, y0, cz + 0.11, cx + r, y1, z1, a);
      return;
    }
    const r = faceOf(ob), m = it.c === 'Kits' && HOUSE.has(k) ? null : modelOf(it);
    frame(ob, r, m);
    if (it.c === 'Kits' && !m) { house(B, BT, ob, it, k); return; }
    if (it.c === 'Wallpaper' && !backSolid(ob, r)) { run(B, BT, ob, parse(MODELS.fpaper)); return; }
    if (m) { run(B, BT, ob, m); if (m.y0 > 0.05 && hangs(it) && !backSolid(ob, r)) abox(B, 0.44, 0, 0.56, 0.1, 0, m.y0, COLB[ob.i], 255, 0); return; }
    box(B, x0 + 0.07, z, z0 + 0.07, x1 - 0.07, z + t - 0.06, z1 - 0.07, a, 1, 15, symOf(ob.i, ob.w, ob.h));
  }
  const CH = new Map(); let allDirty = true, anyDirty = true, lastSig = '', yLo = 0, yHi = 2, rugVer = 0, rugMap = null, rugMapVer = -1;
  const chKey = (cx, cy) => cy * 4096 + cx;
  function markAll() { for (const c of CH.values()) c.dirty = true; allDirty = true; anyDirty = true; rugVer++; }
  function touched(x, y, w, h) {
    if (!plan) return; rugVer++;
    const mx = Math.ceil(plan.w / CS) - 1, my = Math.ceil(plan.h / CS) - 1, ax = clamp(Math.floor((x - 1) / CS), 0, mx), ay = clamp(Math.floor((y - 1) / CS), 0, my), bx = clamp(Math.floor((x + w) / CS), 0, mx), by = clamp(Math.floor((y + h) / CS), 0, my);
    for (let cy = ay; cy <= by; cy++) for (let cx = ax; cx <= bx; cx++) { const c = CH.get(chKey(cx, cy)); if (c) c.dirty = true; else allDirty = true; }
    anyDirty = true; requestDraw();
  }
  let G = new Int32Array(0), M1 = new Int32Array(0), M2 = new Int32Array(0);
  const need = (a, n) => a.length >= n ? (a.fill(0, 0, n), a) : new Int32Array(Math.max(n, a.length * 2));
  function greedy(M, w, h, lvl, emit) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w;) {
      const key = M[j * w + i]; if (!key) { i++; continue; }
      let a = 1; while (i + a < w && M[j * w + i + a] === key) a++;
      let b = 1;
      for (; j + b < h; b++) { if (lvl && lvl[j + b] !== lvl[j] + b) break; let ok = true; for (let q = 0; q < a; q++) if (M[(j + b) * w + i + q] !== key) { ok = false; break; } if (!ok) break; }
      for (let r = 0; r < b; r++) M.fill(0, (j + r) * w + i, (j + r) * w + i + a);
      emit(i, j, a, b, key); i += a;
    }
  }
  const BO = builder(), BT = builder();
  function build(ch, lv, obs, rugs) {
    const p = plan, PW = p.w, PH = p.h, x0 = ch.cx * CS, y0 = ch.cy * CS, cw = Math.min(CS, PW - x0), chh = Math.min(CS, PH - y0), gw = cw + 2, gh = chh + 2, nl = lv.length, pl = gw * gh, gT = !hidden.has('g');
    G = need(G, pl * nl);
    for (let s = 0; s < nl; s++) {
      const z = lv[s]; if (hidden.has(z)) continue;
      const T = gT ? (z ? p.tl.get(z) : p.ground) : null, L = z ? p.up.get(z) : p.occ, base = s * pl;
      for (let gy = 0; gy < gh; gy++) {
        const y = y0 - 1 + gy; if (y < 0 || y >= PH) continue;
        for (let gx = 0; gx < gw; gx++) {
          const x = x0 - 1 + gx; if (x < 0 || x >= PW) continue; const k = y * PW + x, v = T ? T[k] : 0;
          if (v) { G[base + gy * gw + gx] = LIQ[v - 1] ? -v : v; continue; }
          if (L) { const id = L[k]; if (id) { const ob = p.objs.get(id); if (ob && SOLID[ob.i]) G[base + gy * gw + gx] = ob.i + 1; } }
        }
      }
    }
    const at = (gx, gy, s) => s < 0 ? 0 : G[s * pl + gy * gw + gx], sol = (gx, gy, s) => s >= 0 && G[s * pl + gy * gw + gx] > 0, fil = (gx, gy, s) => s >= 0 && G[s * pl + gy * gw + gx] !== 0;
    const up = (s) => s + 1 < nl && lv[s + 1] === lv[s] + 1 ? s + 1 : -1, dn = (s) => s > 0 && lv[s - 1] === lv[s] - 1 ? s - 1 : -1;
    const cont = (qx, qy, ss, dx, dy, su) => sol(qx, qy, ss) && !sol(qx + dx, qy + dy, su);
    BO.n = 0; BT.n = 0;
    const top = (B, X0, Z0, w, h, Y, mat, fl) => q4(B, X0, Y, Z0, X0, Y, Z0 + h, X0 + w, Y, Z0 + h, X0 + w, Y, Z0, 0, X0, Z0, X0 + w, Z0 + h, COL[mat - 1], pack(0, fl, layerOf(mat - 1), 0));
    M1 = need(M1, cw * chh);
    for (let s = 0; s < nl; s++) {
      const su = up(s); let any = 0, liq = 0;
      for (let gy = 1; gy <= chh; gy++) for (let gx = 1; gx <= cw; gx++) {
        const v = at(gx, gy, s); if (!v) continue;
        if (v > 0 && !sol(gx, gy, su)) { M1[(gy - 1) * cw + gx - 1] = v | ((cont(gx - 1, gy, s, 0, 0, su) ? 0 : 1) | (cont(gx + 1, gy, s, 0, 0, su) ? 0 : 2) | (cont(gx, gy - 1, s, 0, 0, su) ? 0 : 4) | (cont(gx, gy + 1, s, 0, 0, su) ? 0 : 8)) << 12; any = 1; }
        else if (v < 0 && !fil(gx, gy, su)) liq = 1;
      }
      if (any) greedy(M1, cw, chh, null, (i, j, w, h, key) => top(BO, x0 + i, y0 + j, w, h, lv[s] + 1, key & 4095, key >> 12));
      if (liq) { M1.fill(0, 0, cw * chh); for (let gy = 1; gy <= chh; gy++) for (let gx = 1; gx <= cw; gx++) { const v = at(gx, gy, s); if (v < 0 && !fil(gx, gy, su)) M1[(gy - 1) * cw + gx - 1] = -v; } greedy(M1, cw, chh, null, (i, j, w, h, key) => top(BT, x0 + i, y0 + j, w, h, lv[s] + 0.85, key, 0)); }
    }
    const side = (dx, dy, emitQ) => {
      const rows = dy ? chh : cw, across = dy ? cw : chh, ux = dy ? 1 : 0, uy = dy ? 0 : 1;
      for (let r = 1; r <= rows; r++) {
        M2 = need(M2, across * nl); let any = 0;
        for (let s = 0; s < nl; s++) {
          const sd = dn(s), su = up(s);
          for (let a = 1; a <= across; a++) {
            const gx = dy ? a : r, gy = dy ? r : a, v = at(gx, gy, s); if (!v) continue;
            if (v > 0) { if (sol(gx + dx, gy + dy, s)) continue; M2[s * across + a - 1] = v | ((cont(gx - ux, gy - uy, s, dx, dy, s) ? 0 : 1) | (cont(gx + ux, gy + uy, s, dx, dy, s) ? 0 : 2) | (cont(gx, gy, sd, dx, dy, sd) ? 0 : 4) | (cont(gx, gy, su, dx, dy, su) ? 0 : 8)) << 12; any = 1; }
            else if (at(gx + dx, gy + dy, s) === 0) { M2[s * across + a - 1] = -v | 1 << 16 | (fil(gx, gy, su) ? 0 : 1 << 17); any = 1; }
          }
        }
        if (any) greedy(M2, across, nl, lv, (i, j, w, h, key) => { const liq = key & 1 << 16, Y1 = lv[j + h - 1] + (liq && key & 1 << 17 ? 0.85 : 1); emitQ(liq ? BT : BO, i, r, w, lv[j], Y1, COL[(key & 4095) - 1], liq ? 0 : key >> 12 & 15); });
      }
    };
    side(0, 1, (B, i, r, w, Y0, Y1, col, fl) => { const Z = y0 + r, X0 = x0 + i, X1 = X0 + w; q4(B, X0, Y0, Z, X1, Y0, Z, X1, Y1, Z, X0, Y1, Z, 1, X0, Y0, X1, Y1, col, pack(1, fl, 255, 0)); });
    side(0, -1, (B, i, r, w, Y0, Y1, col, fl) => { const Z = y0 + r - 1, X0 = x0 + i, X1 = X0 + w; q4(B, X1, Y0, Z, X0, Y0, Z, X0, Y1, Z, X1, Y1, Z, 1, X0, Y0, X1, Y1, col, pack(2, fl, 255, 0)); });
    side(1, 0, (B, i, r, w, Y0, Y1, col, fl) => { const X = x0 + r, Z0 = y0 + i, Z1 = Z0 + w; q4(B, X, Y0, Z1, X, Y0, Z0, X, Y1, Z0, X, Y1, Z1, 2, Z0, Y0, Z1, Y1, col, pack(3, fl, 255, 0)); });
    side(-1, 0, (B, i, r, w, Y0, Y1, col, fl) => { const X = x0 + r - 1, Z0 = y0 + i, Z1 = Z0 + w; q4(B, X, Y0, Z0, X, Y0, Z1, X, Y1, Z1, X, Y1, Z0, 2, Z0, Y0, Z1, Y1, col, pack(4, fl, 255, 0)); });
    for (const ob of obs) if (!hidden.has(zOf(ob)) && !SOLID[ob.i]) emitObj(BO, BT, ob);
    for (const r of rugs) box(BO, r.x + 0.03, zOf(r), r.y + 0.03, r.x + r.w - 0.03, zOf(r) + 0.05, r.y + r.h - 0.03, COL[r.i], 1, 15, symOf(r.i, r.w, r.h, true));
    if (!ch.op) { ch.op = mesh(); ch.tr = mesh(); }
    upload(ch.op, BO); upload(ch.tr, BT); ch.dirty = false;
  }
  function sync() {
    if (!plan) return;
    const sig = [...hidden].sort().join(',') + '|' + plan.w + 'x' + plan.h; if (sig !== lastSig) { lastSig = sig; markAll(); }
    if (S.pics) wantPics();
    if (!anyDirty) return; anyDirty = false;
    const nx = Math.ceil(plan.w / CS), ny = Math.ceil(plan.h / CS);
    if (allDirty) { for (const [k, c] of CH) if (c.cx >= nx || c.cy >= ny) { freeMesh(c.op); freeMesh(c.tr); CH.delete(k); } for (let cy = 0; cy < ny; cy++) for (let cx = 0; cx < nx; cx++) { const k = chKey(cx, cy); if (!CH.has(k)) CH.set(k, { cx, cy, op: null, tr: null, dirty: true }); } allDirty = false; }
    const lv = [...new Set([...plan.tz, ...plan.zs])].sort((a, b) => a - b); yLo = Math.min(0, lv[0]); yHi = lv[lv.length - 1] + 1;
    const ob = new Map(), rg = new Map(), add = (m, x, y, v) => { const k = chKey(Math.floor(x / CS), Math.floor(y / CS)); if (!m.has(k)) m.set(k, []); m.get(k).push(v); };
    for (const o of plan.objs.values()) add(ob, o.x, o.y, o);
    if (!hidden.has('r')) for (const r of plan.rugs.values()) if (!hidden.has(zOf(r))) add(rg, r.x, r.y, r);
    for (const [k, c] of CH) if (c.dirty) build(c, lv, ob.get(k) || [], rg.get(k) || []);
  }
  const cam = { tx: 0, tz: 0, zoom: 1, yaw: 0, pitch: PA };
  let A = null;
  function basis(c = cam) {
    const a = c.yaw * Math.PI / 180, p = c.pitch * Math.PI / 180, sa = Math.sin(a), ca = Math.cos(a), sp = Math.sin(p), cp = Math.cos(p);
    return { sa, ca, sp, cp, R: [ca, 0, sa], H: [sa, 0, -ca], F: [sa * cp, -sp, -ca * cp], U: [sa * sp, cp, -ca * sp], s: view.cs * c.zoom };
  }
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function ground(c, sx, sy) { const B = basis(c), al = (sx - W / 2) / B.s, be = -(sy - H / 2) / (B.s * B.sp); return [c.tx + al * B.R[0] + be * B.H[0], c.tz + al * B.R[2] + be * B.H[2]]; }
  function place(c, px, py, pz, sx, sy) { const B = basis(c), lam = (-(sy - H / 2) / B.s - (py - TY) * B.cp) / B.sp, ofs = (sx - W / 2) / B.s; c.tx = px - lam * B.H[0] - ofs * B.R[0]; c.tz = pz - lam * B.H[2] - ofs * B.R[2]; }
  const copy = (c) => ({ tx: c.tx, tz: c.tz, zoom: c.zoom, yaw: c.yaw, pitch: c.pitch });
  function stop(fin) { if (!A) return; cancelAnimationFrame(A.raf); const a = A; A = null; if (fin || a.snap) { a.step(1); requestDraw(); updateStatus(); } }
  function animate(step, ms, snap, to) {
    stop(true); if (calm() || !plan) { step(1); requestDraw(); updateStatus(); return; }
    const t0 = performance.now(), run = (t) => { const k = Math.min(1, (t - t0) / ms); step(1 - Math.pow(1 - k, 3)); requestDraw(); if (k < 1) A.raf = requestAnimationFrame(run); else { A = null; updateStatus(); } };
    A = { step, snap, to, raf: requestAnimationFrame(run) };
  }
  function glideTo(to, ms = 260) { stop(true); const fr = copy(cam); animate((e) => { moved(); cam.tx = fr.tx + (to.tx - fr.tx) * e; cam.tz = fr.tz + (to.tz - fr.tz) * e; cam.zoom = fr.zoom * Math.pow(to.zoom / fr.zoom, e); cam.yaw = fr.yaw + (to.yaw - fr.yaw) * e; cam.pitch = fr.pitch + (to.pitch - fr.pitch) * e; }, ms, to.yaw !== fr.yaw || to.pitch !== fr.pitch, to); }
  function zoomAt(z, sx, sy, smooth) {
    const fr = copy(cam), g = ground(fr, sx, sy), at = (e) => { moved(); const zz = fr.zoom * Math.pow(z / fr.zoom, e), k = fr.zoom / zz; cam.zoom = zz; cam.tx = g[0] + (fr.tx - g[0]) * k; cam.tz = g[1] + (fr.tz - g[1]) * k; };
    if (smooth) { animate(at, 200, false, { zoom: z }); return; } stop(true); at(1); requestDraw(); updateStatus();
  }
  function rotAbout(c, yaw, gx, gz) { const d = (yaw - c.yaw) * Math.PI / 180, cs = Math.cos(d), sn = Math.sin(d), dx = c.tx - gx, dz = c.tz - gz; c.tx = gx + dx * cs - dz * sn; c.tz = gz + dx * sn + dz * cs; c.yaw = yaw; }
  const snapYaw = (y) => Math.round(y / 90) * 90;
  function settle() { const y = snapYaw(cam.yaw), p = cam.pitch > 84 ? 90 : cam.pitch; if (y === cam.yaw && p === cam.pitch) return; glideTo({ ...copy(cam), yaw: y, pitch: p }, 220); }
  function bounds(c) {
    const B = basis(c); let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const x of [0, plan.w]) for (const y of [yLo, yHi]) for (const z of [0, plan.h]) { const P = [x, y, z], u = dot(P, B.R), v = dot(P, B.U); u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
    return { B, u0, u1, v0, v1 };
  }
  function fitCam() {
    sync(); const c = copy(cam); c.yaw = snapYaw(c.yaw); const { B, u0, u1, v0, v1 } = bounds(c), pad = 24, sheet = innerWidth < 900 ? sheetStops().peek : 0, avH = H - sheet - 24;
    c.zoom = clamp(Math.min((W - (innerWidth < 600 ? 16 : pad * 2)) / ((u1 - u0) * view.cs), (avH - 56) / ((v1 - v0) * view.cs)), ZMN, 3);
    const s = view.cs * c.zoom, ob = ($('#optbar').getBoundingClientRect().height || 36) + 18, topY = ob + Math.max(0, (avH - ob - (v1 - v0) * s) / 3);
    const Au = (u0 + u1) / 2, Bv = v1 - (H / 2 - topY) / s, mu = (Bv - TY * B.cp) / B.sp;
    c.tx = Au * B.R[0] + mu * B.H[0]; c.tz = Au * B.R[2] + mu * B.H[2]; return c;
  }
  let CUT = null, lowUntil = 0, sharpT = 0;
  const moved = () => { lowUntil = performance.now() + 160; };
  function cutState() {
    if (!CUT || !hover || cam.pitch > 85 || drag && (drag.kind === 'pan' || drag.kind === 'orbit') || pinch) return null;
    const B = basis(), dx = CUT.px - cam.tx, dy = CUT.py - TY, dz = CUT.pz - cam.tz; return { sx: W / 2 + (dx * B.R[0] + dy * B.R[1] + dz * B.R[2]) * B.s, sy: H / 2 - (dx * B.U[0] + dy * B.U[1] + dz * B.U[2]) * B.s, Y: CUT.Y, r: Math.max(48, 2.6 * B.s), d: (dx * B.F[0] + dy * B.F[1] + dz * B.F[2] - 0.6) / DEPTH };
  }
  let PC = null;
  function seeThrough(x, y, z) {
    if (!PC || z + 1 <= PC.Y + 0.05) return false; const B = PC.B, dx = x + 0.5 - cam.tx, dy = z + 0.5 - TY, dz = y + 0.5 - cam.tz;
    if ((dx * B.F[0] + dy * B.F[1] + dz * B.F[2]) / DEPTH >= PC.d) return false; const sx = W / 2 + (dx * B.R[0] + dy * B.R[1] + dz * B.R[2]) * B.s - PC.sx, sy = H / 2 - (dx * B.U[0] + dy * B.U[1] + dz * B.U[2]) * B.s - PC.sy;
    return sx * sx + sy * sy < (PC.r * 0.55) * (PC.r * 0.55);
  }
  function solidAt(x, y, z) {
    if (layerZ != null && z > layerZ) return false;
    if (seeThrough(x, y, z)) return false;
    const k = y * plan.w + x;
    if (!hidden.has(z)) { if (!hidden.has('g') && terrAt(plan, k, z)) return true; const o = occAt(plan, k, z); if (o) { const ob = plan.objs.get(o); if (ob && obShown(ob)) return true; } }
    if (rugMapVer !== rugVer) { rugMap = new Set(); rugMapVer = rugVer; if (!hidden.has('r')) for (const r of plan.rugs.values()) if (!hidden.has(zOf(r))) for (let yy = r.y; yy < r.y + r.h; yy++) for (let xx = r.x; xx < r.x + r.w; xx++) rugMap.add((zOf(r) - ZMIN) * plan.w * plan.h + yy * plan.w + xx); }
    return rugMap.has((z - ZMIN) * plan.w * plan.h + k);
  }
  function pick(sx, sy) {
    if (!plan) return [-1, -1];
    const B = basis(), al = (sx - W / 2) / B.s, be = -(sy - H / 2) / B.s, O = [cam.tx + B.R[0] * al + B.U[0] * be - B.F[0] * 900, TY + B.U[1] * be - B.F[1] * 900, cam.tz + B.R[2] * al + B.U[2] * be - B.F[2] * 900], D = B.F;
    const lo = [0, yLo, 0], hi = [plan.w, yHi, plan.h]; let t0 = -Infinity, t1 = Infinity;
    for (let i = 0; i < 3; i++) { if (Math.abs(D[i]) < 1e-9) { if (O[i] < lo[i] || O[i] > hi[i]) { t1 = -1; break; } continue; } let a = (lo[i] - O[i]) / D[i], b = (hi[i] - O[i]) / D[i]; if (a > b) [a, b] = [b, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, b); }
    const flat = (Y) => { const t = (Y - O[1]) / D[1]; return [Math.floor(O[0] + D[0] * t), Math.floor(O[2] + D[2] * t)]; };
    const cs = cutState(); PC = cs ? { ...cs, B } : null;
    if (!(t1 > t0)) { PC = null; return flat(TY); }
    const t = t0 + 1e-6, P = [O[0] + D[0] * t, O[1] + D[1] * t, O[2] + D[2] * t], cell = P.map((v, i) => clamp(Math.floor(v), lo[i], hi[i] - 1)), st = D.map(d => d > 0 ? 1 : d < 0 ? -1 : 0);
    const tM = [0, 1, 2].map(i => st[i] ? ((st[i] > 0 ? cell[i] + 1 : cell[i]) - P[i]) / D[i] : Infinity), tD = [0, 1, 2].map(i => st[i] ? Math.abs(1 / D[i]) : Infinity);
    for (let n = 0; n < 2000; n++) {
      if (cell[0] < 0 || cell[0] >= plan.w || cell[2] < 0 || cell[2] >= plan.h || cell[1] < yLo || cell[1] >= yHi) break;
      if (solidAt(cell[0], cell[2], cell[1])) { PC = null; const Y = cell[1] + 1, tt = (Y - O[1]) / D[1]; CUT = { px: O[0] + D[0] * tt, py: Y, pz: O[2] + D[2] * tt, Y }; return [cell[0], cell[2], cell[1]]; }
      const i = tM[0] < tM[1] ? (tM[0] < tM[2] ? 0 : 2) : (tM[1] < tM[2] ? 1 : 2); cell[i] += st[i]; tM[i] += tD[i];
    }
    PC = null; const f = flat(yLo), tt = (yLo - O[1]) / D[1]; CUT = { px: O[0] + D[0] * tt, py: yLo, pz: O[2] + D[2] * tt, Y: yLo }; return f;
  }
  const BX = builder(), ov = mesh(), base = mesh(), RC = new Map(), OV = 0.015, I3 = pack(0, 0, 255, 3);
  let curB = basis(), plY = TY;
  const pc = (col, a) => { if (typeof col === 'number') return col; const k = col + '|' + a; let v = RC.get(k); if (v == null) { if (RC.size > 600) RC.clear(); v = rgba(col, a); RC.set(k, v); } return v; };
  const gtop = (x, y) => { x = clamp(x, 0, plan.w - 1); y = clamp(y, 0, plan.h - 1); const t = topTerrShown(y * plan.w + x, layerZ != null ? layerZ : Infinity); return t == null ? yLo : t + 1; };
  const ctop = (x, y) => { if (!inB(plan, x, y)) return TY; let z = gtop(x, y); const q = topShown(y * plan.w + x); if (q && (layerZ == null || zOf(q) <= layerZ) && topOf(q) + 1 > z) z = topOf(q) + 1; return z; };
  const flat = (x0, z0, x1, z1, Y, c) => q4(BX, x0, Y, z0, x0, Y, z1, x1, Y, z1, x1, Y, z0, 0, x0, z0, x1, z1, c, I3);
  const proj = (X, Y, Z) => { const B = curB, dx = X - cam.tx, dy = Y - TY, dz = Z - cam.tz; return [W / 2 + (dx * B.R[0] + dy * B.R[1] + dz * B.R[2]) * B.s, H / 2 - (dx * B.U[0] + dy * B.U[1] + dz * B.U[2]) * B.s]; };
  const bbox = (pts) => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x0, y0, x1, y1 }; };
  const O = {
    s: 1, c: ctx, col: pc, gy: gtop, cy: ctop, at: proj,
    box(x, y, w, h, z, t, col, a) { const e = 0.03; box(BX, x - e, z, y - e, x + w + e, z + t + e, y + h + e, pc(col, a), 3, 15); },
    top(x, y, w, h, col, a) { const c = pc(col, a), x0 = Math.max(0, x), x1 = Math.min(plan.w, x + w), y1 = Math.min(plan.h, y + h); for (let yy = Math.max(0, y); yy < y1; yy++) for (let xx = x0; xx < x1;) { const Y = gtop(xx, yy); let e = xx + 1; while (e < x1 && gtop(e, yy) === Y) e++; flat(xx, yy, e, yy + 1, Y + OV, c); xx = e; } },
    cell(x, y, col, a) { if (inB(plan, x, y)) flat(x, y, x + 1, y + 1, gtop(x, y) + OV, pc(col, a)); },
    ring(x, y, w, h, col, a, wd = 0.1) {
      const c = pc(col, a), d = Math.min(0.5, Math.max(wd, 2 / curB.s)), x0 = Math.max(0, x), x1 = Math.min(plan.w, x + w), y0 = Math.max(0, y), y1 = Math.min(plan.h, y + h), Y = OV * 2; if (x0 >= x1 || y0 >= y1) return;
      for (let xx = x0; xx < x1; xx++) { if (y === y0) flat(xx, y0, xx + 1, y0 + d, gtop(xx, y0) + Y, c); if (y + h === y1) flat(xx, y1 - d, xx + 1, y1, gtop(xx, y1 - 1) + Y, c); }
      for (let yy = y0; yy < y1; yy++) { if (x === x0) flat(x0, yy, x0 + d, yy + 1, gtop(x0, yy) + Y, c); if (x + w === x1) flat(x1 - d, yy, x1, yy + 1, gtop(x1 - 1, yy) + Y, c); }
    },
    frame(x, y, w, h, Y, col, a, wd = 0.1) { const c = pc(col, a), d = Math.min(Math.min(w, h) / 2, Math.max(wd, 2 / curB.s)), Yy = Y + OV * 2; flat(x, y, x + w, y + d, Yy, c); flat(x, y + h - d, x + w, y + h, Yy, c); flat(x, y + d, x + d, y + h - d, Yy, c); flat(x + w - d, y + d, x + w, y + h - d, Yy, c); },
    rect(x, y, w, h) { const g = (cx, cy) => gtop(cx, cy); return bbox([proj(x, g(x, y), y), proj(x + w, g(x + w - 1, y), y), proj(x, g(x, y + h - 1), y + h), proj(x + w, g(x + w - 1, y + h - 1), y + h)]); },
    flatRect(x, y, w, h, Y) { return bbox([proj(x, Y, y), proj(x + w, Y, y), proj(x, Y, y + h), proj(x + w, Y, y + h)]); },
    model(it, x, y, w, h, z, t, r, a) {
      const n0 = BX.n, ob = { id: 0, i: it.i, x, y, w, h, z, t, r: r == null ? undefined : r }, al = Math.round(clamp(a, 0, 1) * 255) << 24;
      try { emitObj(BX, BX, ob); } catch (e) { BX.n = n0; return false; }
      for (let v = n0; v < BX.n; v++) { const o = v * 11 + 9; BX.u[o] = ((BX.u[o] & 0xffffff) | al) >>> 0; }
      return BX.n > n0;
    },
  };
  const MAT = new Float32Array(16);
  function matrix(B, D) {
    const kx = 2 * B.s / W, ky = 2 * B.s / H, T = [cam.tx, TY, cam.tz];
    MAT[0] = B.R[0] * kx; MAT[4] = B.R[1] * kx; MAT[8] = B.R[2] * kx; MAT[12] = -dot(T, B.R) * kx;
    MAT[1] = B.U[0] * ky; MAT[5] = B.U[1] * ky; MAT[9] = B.U[2] * ky; MAT[13] = -dot(T, B.U) * ky;
    MAT[2] = B.F[0] / D; MAT[6] = B.F[1] / D; MAT[10] = B.F[2] / D; MAT[14] = -dot(T, B.F) / D;
    MAT[3] = 0; MAT[7] = 0; MAT[11] = 0; MAT[15] = 1;
  }
  function onScreen(c) {
    const x0 = c.cx * CS - 12, z0 = c.cy * CS - 12, x1 = Math.min(plan.w, c.cx * CS + CS) + 12, z1 = Math.min(plan.h, c.cy * CS + CS) + 12; let a = 0, b = 0, d = 0, f = 0;
    for (const x of [x0, x1]) for (const y of [yLo, yHi + 6]) for (const z of [z0, z1]) { const X = MAT[0] * x + MAT[4] * y + MAT[8] * z + MAT[12], Y = MAT[1] * x + MAT[5] * y + MAT[9] * z + MAT[13]; if (X < -1) a++; if (X > 1) b++; if (Y < -1) d++; if (Y > 1) f++; }
    return a < 8 && b < 8 && d < 8 && f < 8;
  }
  let lost = false;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (lost) return; lost = true; stop(false); if (onLost) onLost(); });
  function draw(t, out) {
    if (!out) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    if (lost) return;
    const now = performance.now(), sc = now < lowUntil && dpr > 1.25 ? 1 : dpr, cw = Math.round(W * sc), ch = Math.round(H * sc); if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    if (sc < dpr) { clearTimeout(sharpT); sharpT = setTimeout(requestDraw, lowUntil - now + 20); }
    gl.viewport(0, 0, cw, ch); const [br, bg, bb] = bytes(pc(theme['map-bg'] || '#e4e9e2', 1)); gl.clearColor(br, bg, bb, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!plan) return;
    sync(); syncSyms(); if (mipDirty) { gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex); gl.generateMipmap(gl.TEXTURE_2D_ARRAY); mipDirty = false; } if (atlasDirty) { gl.bindTexture(gl.TEXTURE_2D, atlas); gl.generateMipmap(gl.TEXTURE_2D); atlasDirty = false; }
    const B = basis(); matrix(B, DEPTH);
    gl.useProgram(prog); gl.uniformMatrix4fv(U.M, false, MAT); gl.uniform2f(U.bk, -B.sa, B.ca); gl.uniform1i(U.tx, 0); gl.uniform1i(U.sy, 1); gl.uniform1f(U.lw, sc); gl.uniform1f(U.syms, B.s >= 9 ? 1 : 0); gl.uniform1f(U.ls, clamp((B.s - 4) / 10, 0, 1));
    gl.uniform1f(U.g1, S.grid === 'all' && B.s >= 10 ? 1 : 0); gl.uniform1f(U.g8, S.grid !== 'off' ? 1 : 0); gl.uniform1f(U.pics, S.pics ? 1 : 0);
    gl.uniform1f(U.am, 1); gl.uniform1f(U.pass, 0); gl.uniform1f(U.cut, layerZ != null ? layerZ + 1.001 : 1e6);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlas); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
    const ct = cutState(); if (ct) { const P = [ct.sx * sc, ch - ct.sy * sc]; gl.uniform4f(U.cw, P[0], P[1], ct.r * sc, ct.d * 0.5 + 0.5 - 1e-4); gl.uniform1f(U.cl, ct.Y); } else gl.uniform4f(U.cw, 0, 0, 0, 0);
    BX.n = 0; const Yb = yLo - 0.002; q4(BX, 0, Yb, 0, 0, Yb, plan.h, plan.w, Yb, plan.h, plan.w, Yb, 0, 0, 0, 0, plan.w, plan.h, pc(theme['map-empty'] || '#cfd8cc', 1), pack(0, 15, 255, 0)); upload(base, BX);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.enable(gl.CULL_FACE); gl.disable(gl.BLEND);
    gl.bindVertexArray(base.vao); gl.drawElements(gl.TRIANGLES, base.n, gl.UNSIGNED_INT, 0);
    const vis = []; for (const c of CH.values()) if (c.op && onScreen(c)) vis.push(c);
    for (const c of vis) if (c.op.n) { gl.bindVertexArray(c.op.vao); gl.drawElements(gl.TRIANGLES, c.op.n, gl.UNSIGNED_INT, 0); }
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    const dep = (c) => dot([c.cx * CS + CS / 2, TY, c.cy * CS + CS / 2], B.F);
    for (const c of vis.filter(c => c.tr.n).sort((a, b) => dep(b) - dep(a))) { gl.bindVertexArray(c.tr.vao); gl.drawElements(gl.TRIANGLES, c.tr.n, gl.UNSIGNED_INT, 0); }
    if (layerZ != null) { gl.uniform1f(U.pass, 1); gl.uniform1f(U.am, 0.22); gl.enable(gl.CULL_FACE); for (const c of vis) if (c.op.n) { gl.bindVertexArray(c.op.vao); gl.drawElements(gl.TRIANGLES, c.op.n, gl.UNSIGNED_INT, 0); } gl.uniform1f(U.pass, 0); }
    gl.uniform1f(U.cut, 1e6); gl.uniform4f(U.cw, 0, 0, 0, 0);
    BX.n = 0; curB = B; O.s = B.s; O.c = out || ctx; if (typeof mapOverlay3d === 'function') mapOverlay3d(O); upload(ov, BX);
    if (ov.n) { gl.enable(gl.CULL_FACE); gl.bindVertexArray(ov.vao); gl.disable(gl.DEPTH_TEST); gl.uniform1f(U.am, 0.35); gl.drawElements(gl.TRIANGLES, ov.n, gl.UNSIGNED_INT, 0); gl.enable(gl.DEPTH_TEST); gl.uniform1f(U.am, 1); gl.drawElements(gl.TRIANGLES, ov.n, gl.UNSIGNED_INT, 0); }
    gl.bindVertexArray(null); gl.depthMask(true);
    if (out) { out.setTransform(1, 0, 0, 1, 0, 0); out.drawImage(canvas, 0, 0); } else ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (typeof mapLabels3d === 'function') mapLabels3d(O);
  }
  function snapshot(px, title) {
    if (lost || !plan) return null; sync();
    const c = copy(A && A.to ? { ...cam, ...A.to } : cam); c.yaw = snapYaw(c.yaw); c.pitch = c.pitch > 84 ? 90 : c.pitch;
    const { B, u0, u1, v0, v1 } = bounds(c), pad = 16, top = 40, lim = Math.min(2600, gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0]);
    const s = Math.max(2, Math.min(px, (lim - 2 * pad) / (u1 - u0), (lim - top - 2 * pad) / (v1 - v0))), w = Math.ceil((u1 - u0) * s + 2 * pad), h = Math.ceil((v1 - v0) * s + top + 2 * pad);
    const sv = { W, H, dpr, cam: copy(cam), low: lowUntil }; stop(true); W = w; H = h; dpr = 1; lowUntil = 0;
    c.zoom = s / view.cs; const Au = (u0 + u1) / 2, Bv = v1 - (H / 2 - top - pad) / s, mu = (Bv - TY * B.cp) / B.sp; c.tx = Au * B.R[0] + mu * B.H[0]; c.tz = Au * B.R[2] + mu * B.H[2]; Object.assign(cam, c);
    const o = document.createElement('canvas'); o.width = w; o.height = h; const x = o.getContext('2d'); let ok = true;
    try { draw(0, x); x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#eef1ec'; x.fillRect(0, 0, w, 38); x.fillStyle = '#1c2a23'; x.font = '700 20px sans-serif'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(title || '', 12, 20); } catch (e) { ok = false; }
    W = sv.W; H = sv.H; dpr = sv.dpr; Object.assign(cam, sv.cam); lowUntil = sv.low; requestDraw();
    return ok ? o : null;
  }
  function stats() { let tris = 0, calls = 0; for (const c of CH.values()) if (c.op) { tris += (c.op.n + c.tr.n) / 3; calls += (c.op.n ? 1 : 0) + (c.tr.n ? 1 : 0); } return { tris, calls, chunks: CH.size, layers: tlNext }; }
  return {
    draw, pick, snapshot, stop: () => stop(false), stats, project: (X, Y, Z) => proj(X, Y, Z),
    anchor(x, y) { if (plan) plY = layerZ != null ? layerZ : ctop(x, y); },
    dragPick(sx, sy) { const B = basis(), al = (sx - W / 2) / B.s, be = -(sy - H / 2) / B.s, ox = cam.tx + B.R[0] * al + B.U[0] * be, oy = TY + B.U[1] * be, oz = cam.tz + B.R[2] * al + B.U[2] * be, t = (plY - oy) / B.F[1], X = ox + B.F[0] * t, Z = oz + B.F[2] * t; CUT = { px: X, py: plY, pz: Z, Y: plY }; return [Math.floor(X), Math.floor(Z)]; },
    cam: () => copy(cam),
    setCam: (c) => { stop(true); Object.assign(cam, c); moved(); requestDraw(); },
    panBy(dx, dy) { moved(); const B = basis(), al = -dx / B.s, be = dy / (B.s * B.sp); cam.tx += al * B.R[0] + be * B.H[0]; cam.tz += al * B.R[2] + be * B.H[2]; requestDraw(); },
    zoom: () => cam.zoom,
    zoomGoal: () => A && A.to && A.to.zoom ? A.to.zoom : cam.zoom,
    zoomAt,
    centerOn(cx, cy, zoom) { const c = copy(cam); c.yaw = snapYaw(c.yaw); if (zoom) c.zoom = zoom; const x = clamp(Math.floor(cx), 0, plan.w - 1), y = clamp(Math.floor(cy), 0, plan.h - 1); place(c, cx, standZ(y * plan.w + x), cy, W / 2, H * (innerWidth < 900 ? 0.3 : 0.5)); glideTo(c); },
    fit(smooth) { if (!plan) return; const c = fitCam(); if (smooth) glideTo(c); else { stop(true); Object.assign(cam, c); requestDraw(); updateStatus(); } },
    touched,
    loaded() { stop(true); CUT = null; if (SLOTS.length > 200) { SLOTS.length = 0; SLOT.clear(); } markAll(); requestDraw(); },
    enter(cx, cy, zoom, tilted) { Object.assign(cam, { tx: cx, tz: cy, zoom: clamp(zoom, ZMN, ZMX), yaw: 0, pitch: tilted ? PA : 90 }); markAll(); requestDraw(); },
    leave() { stop(true); return { cx: cam.tx, cy: cam.tz, zoom: cam.zoom }; },
    turn(dir) { stop(true); const fr = copy(cam); glideTo({ ...fr, yaw: snapYaw(fr.yaw) - 90 * dir }, 300); },
    tilt() { stop(true); const fr = copy(cam), p = fr.pitch > 84 ? PA : 90; glideTo({ ...fr, yaw: snapYaw(fr.yaw), pitch: p }, 300); return p < 90; },
    tilted: () => (A && A.to && A.to.pitch != null ? A.to.pitch : cam.pitch) < 89,
    twist(deg, sx, sy) { const d = Math.abs(deg) < 12 ? 0 : deg - Math.sign(deg) * 12; if (!d) return; const g = ground(cam, sx, sy); rotAbout(cam, cam.yaw - d, g[0], g[1]); moved(); requestDraw(); },
    orbit(c0, dx, dy) { stop(false); Object.assign(cam, c0); const g = ground(cam, W / 2, H / 2); rotAbout(cam, c0.yaw - dx * 0.35, g[0], g[1]); cam.pitch = clamp(c0.pitch + dy * 0.3, 35, 90); moved(); requestDraw(); },
    settle,
  };
}
