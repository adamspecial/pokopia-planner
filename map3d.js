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
const vec3 NS[10] = vec3[10](vec3(0,1,0), vec3(0,0,1), vec3(0,0,-1), vec3(1,0,0), vec3(-1,0,0), vec3(0,-1,0), vec3(0,.7071,.7071), vec3(0,.7071,-.7071), vec3(.7071,.7071,0), vec3(-.7071,.7071,0));
void main() {
  gl_Position = M * vec4(p, 1.0);
  vu = uv; vr = rc; vc = col; vi = inf;
  vec3 n = NS[min(int(inf.x), 9)];
  float l = length(n.xz);
  float h = l > 0.01 ? dot(n.xz / l, bk) : 0.0;
  vs = inf.w == 3u ? 1.0 : mix(0.64 + 0.14 * h, 1.0, max(n.y, 0.0));
}`;
  const FS = `#version 300 es
precision highp float;
precision highp int;
precision mediump sampler2DArray;
uniform sampler2DArray tx;
uniform float lw, ls, g1, g8, pics;
in vec2 vu;
flat in vec4 vr;
in vec4 vc;
flat in uvec4 vi;
in float vs;
out vec4 o;
void main() {
  vec3 c = vc.rgb;
  if (pics > 0.5 && vi.z < 255u) c = texture(tx, vec3(vu, float(vi.z))).rgb;
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
  o = vec4(c * vs * (1.0 - d), vc.a);
}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const U = {}; for (const n of ['M', 'bk', 'tx', 'lw', 'ls', 'g1', 'g8', 'pics']) U[n] = gl.getUniformLocation(prog, n);
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
  function box(B, x0, y0, z0, x1, y1, z1, col, kind = 1, flags = 15) {
    q4(B, x0, y1, z0, x0, y1, z1, x1, y1, z1, x1, y1, z0, 0, x0, z0, x1, z1, col, pack(0, flags, 255, kind));
    q4(B, x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1, 1, x0, y0, x1, y1, col, pack(1, flags, 255, kind));
    q4(B, x1, y0, z0, x0, y0, z0, x0, y1, z0, x1, y1, z0, 1, x0, y0, x1, y1, col, pack(2, flags, 255, kind));
    q4(B, x1, y0, z1, x1, y0, z0, x1, y1, z0, x1, y1, z1, 2, z0, y0, z1, y1, col, pack(3, flags, 255, kind));
    q4(B, x0, y0, z0, x0, y0, z1, x0, y1, z1, x0, y1, z0, 2, z0, y0, z1, y1, col, pack(4, flags, 255, kind));
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
  function rgba(c, a = 1) { cc.fillStyle = '#000'; cc.fillStyle = c || '#888'; const s = cc.fillStyle; let r, g, b; if (s[0] === '#') { r = parseInt(s.slice(1, 3), 16); g = parseInt(s.slice(3, 5), 16); b = parseInt(s.slice(5, 7), 16); } else { const m = s.match(/[\d.]+/g) || [0, 0, 0]; r = +m[0]; g = +m[1]; b = +m[2]; } return (r | g << 8 | b << 16 | Math.round(a * 255) << 24) >>> 0; }
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
  const LOW = new Set('grass flower crop moss lily mat web coral stump fossil pokeball doll stone orb gem pouch letter plate platter setting teaset books pan border bordersingle bordercorner planks grate star blob firework paintballoon pot wreath poster posterbolt posterwave postermtn frame wallclock mirror vine banner hatch'.split(' '));
  const MID = new Map([['table', 0.7], ['chair', 0.55], ['stool', 0.45], ['bed', 0.5], ['sofa', 0.55], ['bench', 0.5], ['chest', 0.55], ['crate', 0.6], ['bin', 0.6], ['planter', 0.5], ['steps', 0.5], ['campfire', 0.35], ['sink', 0.75], ['bath', 0.55], ['cannon', 0.6], ['stand', 0.7], ['roofflat', 0.3]]);
  const TRUNK = rgba('#7a5434'), GLASS = rgba('#bfe6f5', 0.5);
  function emitObj(B, BT, ob) {
    const it = ITEMS[ob.i], z = zOf(ob), t = htOf(ob), x0 = ob.x, z0 = ob.y, x1 = x0 + ob.w, z1 = z0 + ob.h, a = COL[ob.i], b = COLB[ob.i], k = it.look ? it.look.k : '';
    if (it.c === 'Kits') {
      if (k === 'house' || k === 'center' || k === 'office') { const bh = Math.max(0.8, t * 0.55); box(B, x0 + 0.1, z, z0 + 0.1, x1 - 0.1, z + bh, z1 - 0.1, a); hip(B, x0 + 0.02, z + bh, z0 + 0.02, x1 - 0.02, z + t - 0.02, z1 - 0.02, b); }
      else box(B, x0 + 0.06, z, z0 + 0.06, x1 - 0.06, z + t - 0.04, z1 - 0.06, a);
      return;
    }
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
    if (/^roof/.test(k) && k !== 'roofflat') { hip(B, x0, z, z0, x1, z + t * 0.9, z1, a); return; }
    if (k === 'tree' || it.sh === 'tree' || it.sh === 'palm' || it.sh === 'pine') { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, tw = Math.min(0.14, ob.w * 0.1); box(B, cx - tw, z, cz - tw, cx + tw, z + t * 0.45, cz + tw, TRUNK); box(B, x0 + 0.08, z + t * 0.35, z0 + 0.08, x1 - 0.08, z + t - 0.05, z1 - 0.08, a); return; }
    if (k === 'lamp') { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, hd = 0.2, top = z + t - 0.05; box(B, cx - 0.07, z, cz - 0.07, cx + 0.07, top - 0.25, cz + 0.07, a); box(B, cx - hd, top - 0.28, cz - hd, cx + hd, top, cz + hd, b); return; }
    if (k === 'column') { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2; box(B, cx - 0.2, z, cz - 0.2, cx + 0.2, z + t, cz + 0.2, a); return; }
    const f = LOW.has(k) ? 0.3 : t > 1 ? 0 : MID.get(k) || 0, ins = f && f <= 0.3 ? 0.18 : 0.07;
    box(B, x0 + ins, z, z0 + ins, x1 - ins, f ? z + f : z + t - 0.06, z1 - ins, a);
  }
  const CH = new Map(); let allDirty = true, anyDirty = true, lastSig = '', yLo = 0, yHi = 2, rugVer = 0, rugMap = null, rugMapVer = -1;
  const chKey = (cx, cy) => cy * 4096 + cx;
  function markAll() { for (const c of CH.values()) c.dirty = true; allDirty = true; anyDirty = true; rugVer++; }
  function touched(x, y, w, h) {
    if (!plan) return; rugVer++;
    const ax = Math.max(0, Math.floor((x - 1) / CS)), ay = Math.max(0, Math.floor((y - 1) / CS)), bx = Math.floor((x + w) / CS), by = Math.floor((y + h) / CS);
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
    for (const r of rugs) box(BO, r.x + 0.03, zOf(r), r.y + 0.03, r.x + r.w - 0.03, zOf(r) + 0.05, r.y + r.h - 0.03, COL[r.i]);
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
  function glideTo(to, ms = 260) { const fr = copy(cam); animate((e) => { cam.tx = fr.tx + (to.tx - fr.tx) * e; cam.tz = fr.tz + (to.tz - fr.tz) * e; cam.zoom = fr.zoom * Math.pow(to.zoom / fr.zoom, e); cam.yaw = fr.yaw + (to.yaw - fr.yaw) * e; cam.pitch = fr.pitch + (to.pitch - fr.pitch) * e; }, ms, to.yaw !== fr.yaw || to.pitch !== fr.pitch, to); }
  function zoomAt(z, sx, sy, smooth) {
    const fr = copy(cam), g = ground(fr, sx, sy), at = (e) => { const zz = fr.zoom * Math.pow(z / fr.zoom, e), k = fr.zoom / zz; cam.zoom = zz; cam.tx = g[0] + (fr.tx - g[0]) * k; cam.tz = g[1] + (fr.tz - g[1]) * k; };
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
  function solidAt(x, y, z) {
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
    if (!(t1 > t0)) return flat(TY);
    const t = t0 + 1e-6, P = [O[0] + D[0] * t, O[1] + D[1] * t, O[2] + D[2] * t], cell = P.map((v, i) => clamp(Math.floor(v), lo[i], hi[i] - 1)), st = D.map(d => d > 0 ? 1 : d < 0 ? -1 : 0);
    const tM = [0, 1, 2].map(i => st[i] ? ((st[i] > 0 ? cell[i] + 1 : cell[i]) - P[i]) / D[i] : Infinity), tD = [0, 1, 2].map(i => st[i] ? Math.abs(1 / D[i]) : Infinity);
    for (let n = 0; n < 2000; n++) {
      if (cell[0] < 0 || cell[0] >= plan.w || cell[2] < 0 || cell[2] >= plan.h || cell[1] < yLo || cell[1] >= yHi) break;
      if (solidAt(cell[0], cell[2], cell[1])) return [cell[0], cell[2], cell[1]];
      const i = tM[0] < tM[1] ? (tM[0] < tM[2] ? 0 : 2) : (tM[1] < tM[2] ? 1 : 2); cell[i] += st[i]; tM[i] += tD[i];
    }
    return flat(yLo);
  }
  const BX = builder(), ov = mesh(), base = mesh();
  function columnTop(x, y) { const k = y * plan.w + x, t = topTerrShown(k), q = topShown(k); let z = t == null ? yLo - 1 : t; if (q && topOf(q) > z) z = topOf(q); return z + 1; }
  function overlay() {
    BX.n = 0; const ac = rgba(theme.accent, 0.28), e = 0.04;
    const sel = selection && (selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : selection.rug && plan.rugs.has(selection.rug.id) ? selection.rug : null);
    if (sel) { const z = zOf(sel), t = sel.rug ? 0.06 : htOf(sel); box(BX, sel.x - e, z - e, sel.y - e, sel.x + sel.w + e, z + t + e, sel.y + sel.h + e, ac, 3); }
    if (hover && !drag && inB(plan, hover[0], hover[1])) { const [x, y] = hover, Y = columnTop(x, y) + 0.02; q4(BX, x, Y, y, x, Y, y + 1, x + 1, Y, y + 1, x + 1, Y, y, 0, x, y, x + 1, y + 1, rgba(theme.accent, 0.22), pack(0, 15, 255, 3)); }
    upload(ov, BX);
  }
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
  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); sparkles.length = 0;
    if (lost) return;
    const cw = Math.round(W * dpr), ch = Math.round(H * dpr); if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    gl.viewport(0, 0, cw, ch); const [br, bg, bb] = bytes(rgba(theme['map-bg'] || '#e4e9e2')); gl.clearColor(br, bg, bb, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!plan) return;
    sync(); if (mipDirty) { gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex); gl.generateMipmap(gl.TEXTURE_2D_ARRAY); mipDirty = false; }
    const B = basis(); matrix(B, DEPTH);
    gl.useProgram(prog); gl.uniformMatrix4fv(U.M, false, MAT); gl.uniform2f(U.bk, -B.sa, B.ca); gl.uniform1i(U.tx, 0); gl.uniform1f(U.lw, dpr); gl.uniform1f(U.ls, clamp((B.s - 4) / 10, 0, 1));
    gl.uniform1f(U.g1, S.grid === 'all' && B.s >= 10 ? 1 : 0); gl.uniform1f(U.g8, S.grid !== 'off' ? 1 : 0); gl.uniform1f(U.pics, S.pics ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
    BX.n = 0; const Yb = yLo - 0.002; q4(BX, 0, Yb, 0, 0, Yb, plan.h, plan.w, Yb, plan.h, plan.w, Yb, 0, 0, 0, 0, plan.w, plan.h, rgba(theme['map-empty'] || '#cfd8cc'), pack(0, 15, 255, 0)); upload(base, BX);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.enable(gl.CULL_FACE); gl.disable(gl.BLEND);
    gl.bindVertexArray(base.vao); gl.drawElements(gl.TRIANGLES, base.n, gl.UNSIGNED_INT, 0);
    const vis = []; for (const c of CH.values()) if (c.op && onScreen(c)) vis.push(c);
    for (const c of vis) if (c.op.n) { gl.bindVertexArray(c.op.vao); gl.drawElements(gl.TRIANGLES, c.op.n, gl.UNSIGNED_INT, 0); }
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    const dep = (c) => dot([c.cx * CS + CS / 2, TY, c.cy * CS + CS / 2], B.F);
    for (const c of vis.filter(c => c.tr.n).sort((a, b) => dep(b) - dep(a))) { gl.bindVertexArray(c.tr.vao); gl.drawElements(gl.TRIANGLES, c.tr.n, gl.UNSIGNED_INT, 0); }
    overlay(); if (ov.n) { gl.disable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.bindVertexArray(ov.vao); gl.drawElements(gl.TRIANGLES, ov.n, gl.UNSIGNED_INT, 0); }
    gl.bindVertexArray(null); gl.depthMask(true);
  }
  function stats() { let tris = 0, calls = 0; for (const c of CH.values()) if (c.op) { tris += (c.op.n + c.tr.n) / 3; calls += (c.op.n ? 1 : 0) + (c.tr.n ? 1 : 0); } return { tris, calls, chunks: CH.size, layers: tlNext }; }
  return {
    draw, pick, stop: () => stop(false), stats,
    cam: () => copy(cam),
    setCam: (c) => { stop(true); Object.assign(cam, c); requestDraw(); },
    panBy(dx, dy) { const B = basis(), al = -dx / B.s, be = dy / (B.s * B.sp); cam.tx += al * B.R[0] + be * B.H[0]; cam.tz += al * B.R[2] + be * B.H[2]; requestDraw(); },
    zoom: () => cam.zoom,
    zoomGoal: () => A && A.to && A.to.zoom ? A.to.zoom : cam.zoom,
    zoomAt,
    centerOn(cx, cy, zoom) { const c = copy(cam); c.yaw = snapYaw(c.yaw); if (zoom) c.zoom = zoom; const x = clamp(Math.floor(cx), 0, plan.w - 1), y = clamp(Math.floor(cy), 0, plan.h - 1); place(c, cx, standZ(y * plan.w + x), cy, W / 2, H * (innerWidth < 900 ? 0.3 : 0.5)); glideTo(c); },
    fit(smooth) { if (!plan) return; const c = fitCam(); if (smooth) glideTo(c); else { stop(true); Object.assign(cam, c); requestDraw(); updateStatus(); } },
    touched,
    loaded() { stop(true); markAll(); requestDraw(); },
    enter(cx, cy, zoom, tilted) { Object.assign(cam, { tx: cx, tz: cy, zoom: clamp(zoom, ZMN, ZMX), yaw: 0, pitch: tilted ? PA : 90 }); markAll(); requestDraw(); },
    leave() { stop(true); return { cx: cam.tx, cy: cam.tz, zoom: cam.zoom }; },
    turn(dir) { const fr = copy(cam), y = snapYaw((A && A.to && A.to.yaw != null ? A.to.yaw : cam.yaw)) - 90 * dir; glideTo({ ...fr, yaw: y }, 300); },
    tilt() { const fr = copy(cam), p = (A && A.to && A.to.pitch != null ? A.to.pitch : cam.pitch) > 84 ? PA : 90; glideTo({ ...fr, yaw: snapYaw(fr.yaw), pitch: p }, 300); return p < 90; },
    tilted: () => (A && A.to && A.to.pitch != null ? A.to.pitch : cam.pitch) < 89,
    twist(deg, sx, sy) { const d = Math.abs(deg) < 12 ? 0 : deg - Math.sign(deg) * 12; if (!d) return; const g = ground(cam, sx, sy); rotAbout(cam, cam.yaw - d, g[0], g[1]); requestDraw(); },
    orbit(c0, dx, dy) { stop(false); Object.assign(cam, c0); const g = ground(cam, W / 2, H / 2); rotAbout(cam, c0.yaw - dx * 0.35, g[0], g[1]); cam.pitch = clamp(c0.pitch + dy * 0.3, 35, 90); requestDraw(); },
    settle,
  };
}
