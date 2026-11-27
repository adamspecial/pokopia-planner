'use strict';
let zoneStatus = new Map();
function zoneCounts(z) {
  const counts = new Map(), terr = new Map(); let minE = Infinity, maxE = -Infinity; const seen = new Set();
  for (let y = Math.max(0, z.y); y < Math.min(plan.h, z.y + z.h); y++) for (let x = Math.max(0, z.x); x < Math.min(plan.w, z.x + z.w); x++) {
    const k = y * plan.w + x, t = topTerr(k), g = t == null ? 0 : terrAt(plan, k, t);
    if (g) { const n = ITEMS[g - 1].n; terr.set(n, (terr.get(n) || 0) + 1); counts.set(g - 1, (counts.get(g - 1) || 0) + 1); }
    const e = t == null ? 0 : t; if (e < minE) minE = e; if (e > maxE) maxE = e;
    const sz = t == null ? 1 : t + 1, oid = occAt(plan, k, sz); if (oid && !seen.has(oid)) { const ob = plan.objs.get(oid); if (ob && zOf(ob) === sz) { seen.add(oid); counts.set(ob.i, (counts.get(ob.i) || 0) + 1); } }
  }
  return { counts, terr, high: maxE - minE >= 2, objIds: seen };
}
function reqHave(c, tok) {
  if (DATA.terrainReq[tok]) return c.terr.get(DATA.terrainReq[tok]) || 0;
  if (tok === 'High-up location') return c.high ? 1 : 0;
  if (GROUPS.has(tok)) { let n = 0; for (const i of GROUPS.get(tok)) n += c.counts.get(i) || 0; return n; }
  const it = BY_NAME.get(tok); return it ? (c.counts.get(it.i) || 0) : 0;
}
function habitatAllowed(hb) {
  if (hb.reg === 'Basin') return plan.area === 'Bubbly Basin';
  if (plan.area === 'Bubbly Basin') return hb.reg === 'Basin';
  if (hb.note && /Palette Town only/i.test(hb.note)) return plan.area === 'Palette Town';
  return true;
}
function evalHabitat(c, hb) { const rows = hb.r.map(([tok, q]) => ({ tok, q, have: reqHave(c, tok) })); const met = rows.filter(r => r.have >= r.q).length; return { rows, ok: met === rows.length, met, total: rows.length, weight: hb.r.reduce((a, r) => a + r[1], 0) + hb.r.length * 2 }; }
function evaluateZone(z) {
  const c = zoneCounts(z);
  if (z.kind === 'house') {
    let door = false; const furn = new Set(); let blocks = 0;
    for (const id of c.objIds) { const ob = plan.objs.get(id); const it = ITEMS[ob.i]; if (/door|gate/i.test(it.n)) door = true; if (['Furniture', 'Misc', 'Utilities', 'Rug', 'Other', 'Special'].includes(it.c) && !/door|gate/i.test(it.n)) furn.add(it.i); if (isWall(it) || it.sh === 'block') blocks++; }
    const sizeOk = z.w >= 2 && z.h >= 2 && Math.max(z.w, z.h) <= 10 && Math.min(z.w, z.h) <= 9;
    const ok = sizeOk && door && furn.size >= 3 && blocks > 0;
    return { kind: 'house', ok, sizeOk, door, furn: furn.size, walls: blocks, cap: ok ? 4 : 0 };
  }
  if (z.kind === 'label') return { kind: 'label', ok: false };
  let target = z.target ? HAB_BY_ID.get(z.target) : null;
  const matches = [];
  for (const hb of HAB) { if (!habitatAllowed(hb) && hb !== target) continue; const r = evalHabitat(c, hb); if (r.ok) matches.push({ hb, r }); }
  matches.sort((a, b) => b.r.weight - a.r.weight);
  let tr = target ? evalHabitat(c, target) : null;
  const best = target ? (tr.ok ? { hb: target, r: tr } : null) : (matches[0] || null);
  let near = null;
  if (!target && !best) { let bestScore = -1; for (const hb of HAB) { if (!habitatAllowed(hb)) continue; const r = evalHabitat(c, hb); if (r.met === 0) continue; const s = r.met / r.total + r.weight / 1000; if (s > bestScore) { bestScore = s; near = { hb, r }; } } }
  return { kind: 'habitat', ok: !!best, best, target, tr, matches, near, allowed: target ? habitatAllowed(target) : true };
}
const AREA_R = 4;
let showAreas = LS.get('pokopia-planner:areas') === '1';
const isWall = (it) => it.c !== 'Kits' && it.c !== 'Wallpaper' && it.c !== 'Poster' && (it.sh === 'block' || it.sh === 'hedge' || /fenc|\bwall\b|pillar|siding|enclosure|railing|barrier|levee|\bposts\b/i.test(it.n)) && !/door|gate|curtain|wall-mounted|wall (light|torch|clock|mirror|switch|monitor|storage|photo|calendar|decoration)|partition|wallpaper/i.test(it.n);
const isDoor = (it) => /\b(doors?|gate)\b/i.test(it.n) && !/hatch|crossing/i.test(it.n);
const isWindow = (it) => it.c === 'Buildings' && /\bwindow\b|window pane/i.test(it.n);
const FURN_CATS = new Set(['Furniture', 'Misc', 'Utilities', 'Outdoor', 'Other', 'Special', 'Poster', 'Wallpaper']);
let autoHouses = [], houseById = new Map(), cellHouse = null;
function detectHouses() {
  const Wd = plan.w, Hd = plan.h, N = Wd * Hd, levels = new Set();
  for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (!structural(it)) continue; const z = zOf(ob); if (isDoor(it) || z === standZ(ob.y * Wd + ob.x)) levels.add(z); }
  const prev = houseById; const list = [], ids = new Set(); cellHouse = new Int32Array(N).fill(-1);
  for (const L of [...levels].sort((a, b) => a - b)) {
    const bar = new Uint8Array(N), T = plan.tl.get(L), O = L ? plan.up.get(L) : plan.occ;
    if (T) for (let k = 0; k < N; k++) if (T[k]) bar[k] = 1;
    if (O) for (let k = 0; k < N; k++) { const oid = O[k]; if (!oid) continue; const it = ITEMS[plan.objs.get(oid).i]; const v = isDoor(it) ? 2 : isWall(it) || isWindow(it) ? 1 : 0; if (v) bar[k] = v; }
    const outside = new Uint8Array(N), st = [];
    const seed = (k) => { if (!bar[k] && !outside[k]) { outside[k] = 1; st.push(k); } };
    for (let x = 0; x < Wd; x++) { seed(x); seed((Hd - 1) * Wd + x); } for (let y = 0; y < Hd; y++) { seed(y * Wd); seed(y * Wd + Wd - 1); }
    while (st.length) { const k = st.pop(), x = k % Wd; if (x > 0) seed(k - 1); if (x < Wd - 1) seed(k + 1); if (k >= Wd) seed(k - Wd); if (k < N - Wd) seed(k + Wd); }
    const seen = new Uint8Array(N);
    for (let k0 = 0; k0 < N; k0++) {
      if (bar[k0] || outside[k0] || seen[k0]) continue;
      const cells = [], q = [k0]; seen[k0] = 1; const doors = new Set(); let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      while (q.length) { const k = q.pop(); cells.push(k); const x = k % Wd, y = (k / Wd) | 0; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        for (const n of [x > 0 ? k - 1 : -1, x < Wd - 1 ? k + 1 : -1, k >= Wd ? k - Wd : -1, k < N - Wd ? k + Wd : -1]) { if (n < 0) continue; if (bar[n] === 2) doors.add(n); else if (!bar[n] && !seen[n] && !outside[n]) { seen[n] = 1; q.push(n); } } }
      if (cells.length < 2 && !doors.size) continue;
      const w = x1 - x0 + 1, hh = y1 - y0 + 1;
      const cellSet = new Set(cells); let clearDoors = 0;
      const blockAt = (k) => { if (terrAt(plan, k, L)) return true; const oid = occAt(plan, k, L); if (!oid) return false; const it = ITEMS[plan.objs.get(oid).i]; return isWall(it) || it.c === 'Blocks' || it.sh === 'block'; };
      for (const d of doors) { const dx = d % Wd, dy = (d / Wd) | 0; for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ix = dx + ax, iy = dy + ay; if (ix < 0 || iy < 0 || ix >= Wd || iy >= Hd || !cellSet.has(iy * Wd + ix)) continue; const fx = dx - ax, fy = dy - ay; const out = fx < 0 || fy < 0 || fx >= Wd || fy >= Hd; if (out || !blockAt(fy * Wd + fx)) clearDoors++; break; } }
      let ox0 = Math.max(0, x0 - 1), oy0 = Math.max(0, y0 - 1), ox1 = Math.min(Wd - 1, x1 + 1), oy1 = Math.min(Hd - 1, y1 + 1);
      for (const d of doors) { const dx = d % Wd, dy = (d / Wd) | 0; ox0 = Math.min(ox0, dx); oy0 = Math.min(oy0, dy); ox1 = Math.max(ox1, dx); oy1 = Math.max(oy1, dy); }
      const furnIds = new Set(), furnTypes = new Set(), kitIds = new Set();
      for (const k of cells) { const ob = objAtLv(k, L); if (!ob || zOf(ob) !== L) continue; const it = ITEMS[ob.i]; if (it.c === 'Kits') kitIds.add(ob.id); if (FURN_CATS.has(it.c) && !isWall(it) && !isDoor(it) && it.sub !== 'Fossil') { furnIds.add(ob.id); furnTypes.add(it.i); } }
      const sizeOk = w >= 2 && hh >= 2 && ((w <= 9 && hh <= 10) || (w <= 10 && hh <= 9));
      const kits = [...kitIds].map(i => plan.objs.get(i)); const kitHomes = kits.filter(ob => ITEMS[ob.i].cap);
      let id = 'H' + k0; if (ids.has(id)) id += '@' + L; ids.add(id);
      const hs = { id, anchor: k0, level: L, cells: new Set([...cells, ...doors]), interior: cells.length, doors, clearDoors, x: x0, y: y0, w, h: hh, furn: furnTypes.size, pieces: furnIds.size, sizeOk, kits, kitHomes, ok: sizeOk && clearDoors > 0 && furnTypes.size >= 3 };
      hs.enclosure = !sizeOk && kitHomes.length > 0;
      const outer = { x: ox0, y: oy0, w: ox1 - ox0 + 1, h: oy1 - oy0 + 1 };
      const rx0 = Math.max(0, ox0 - AREA_R), ry0 = Math.max(0, oy0 - AREA_R), rx1 = Math.min(Wd - 1, ox1 + AREA_R), ry1 = Math.min(Hd - 1, oy1 + AREA_R);
      hs.area = { kind: 'house', cells: hs.cells, outer, rect: { x: rx0, y: ry0, w: rx1 - rx0 + 1, h: ry1 - ry0 + 1 }, base: L };
      list.push(hs); for (const k of cells) if (cellHouse[k] < 0) cellHouse[k] = list.length - 1;
      const p = prev.get(id); if (!firstEval && hs.ok && (!p || !p.ok)) celebrate(hs.area.outer, { kind: 'house' });
    }
  }
  autoHouses = list; houseById = new Map(list.map(x => [x.id, x]));
}
function houseHome(hs) { return { kind: 'house', key: 'house:' + hs.id, hs, cap: 4, floors: 1, pf: 0, label: 'House at ' + hs.x + ', ' + hs.y, ax: hs.anchor % plan.w, ay: (hs.anchor / plan.w) | 0 }; }
function kitInfo(ob) {
  const it = ITEMS[ob.i], I = ob.int || {}; const fl = clamp(I.fl || it.fl || 1, 1, 2);
  return { kind: it.kind || 'in', w: I.w || it.iw || Math.max(3, ob.w * 2 - 2), h: I.h || it.ih || Math.max(3, ob.h * 2 - 2), fl, pf: fl > 1 ? (it.pf || 0) : 0, est: !!it.ie && !I.w, small: !!it.sm, custom: !!(I.w || I.h || I.fl) };
}
function kitHome(ob) { const it = ITEMS[ob.i], ki = kitInfo(ob); return { kind: 'kit', key: 'kit:' + ob.id, ob, cap: it.cap, floors: ki.fl, pf: ki.pf, label: it.n.replace(/ kit$/, '') + ' at ' + ob.x + ', ' + ob.y, ax: ob.x, ay: ob.y }; }
const splitFloors = (home) => !!home && home.kind === 'kit' && home.floors > 1 && home.pf > 0;
const floorOf = (home, f) => splitFloors(home) && f != null ? { ...home, floor: f, label: home.label + ' · ' + floorName(f).toLowerCase() } : home;
function kitFloorsToFurnish(ob) { const hm = kitHome(ob); if (!splitFloors(hm)) return [0]; const fs = [0, 1].filter(f => residentsOf(hm, f).length); return fs.length ? fs : [0]; }
const kitReady = (ob) => kitFloorsToFurnish(ob).every(f => kitFurniture(ob, f) >= 3);
const furnChip = (n, split) => h('span', { class: 'req ' + (n >= 3 ? 'ok' : 'miss'), 'data-tip': split ? 'Furniture on this floor: each floor is its own home, so it needs 3 different kinds before anyone moves in there' : 'Furniture on the floor with the door: a kit house needs 3 different kinds there before anyone moves in' }, icon('sofa'), n + '/3');
const floorName = (f) => f ? 'Upstairs' : 'Ground floor';
const SIZE_NAME = { s: 'Small', m: 'Medium', l: 'Large' }, SIZE_RANK = { s: 0, m: 1, l: 2 };
const pkSize = (p) => (p && (userSizes['pk:' + p.n] || p.ps)) || 'm';
const pkSizeMine = (p) => !!p && !!userSizes['pk:' + p.n];
const pkSizeGuess = (p) => !!p && !pkSizeMine(p) && !!p.pg;
const tooBig = (p) => !!p && pkSize(p) === 'l';
const sizeUnsure = (p) => !!p && !pkSizeMine(p) && (!p.sz || p.sz.endsWith('?'));
const PK_WEB = 'https://www.serebii.net/pokemonpokopia/pokemon/';
const pkKey = (p) => p && p.im ? String(p.im).replace(/[^a-z0-9-]/g, '') : null;
function pkPicURL(p) { const k = pkKey(p); if (!k) return null; const e = PICS.pk && PICS.pk[k]; if (e) return 'pics/pk/' + k + '.webp?v=' + e[0]; return /^HTTP 404/.test((PICS.pkmissing || {})[k] || '') ? null : PK_WEB + encodeURIComponent(p.im) + '.png'; }
const PF_AUTO = [500, 430, 700];
const pkFrameAuto = (p) => { const e = PICS.pk && PICS.pk[pkKey(p)]; return e && e.length >= 4 ? e.slice(1, 4) : PF_AUTO; };
const pkFrameMine = (p) => { const u = p && userSizes['pf:' + p.n]; return Array.isArray(u) && u.length === 3 && u.every(Number.isFinite); };
const pkFrame = (p) => pkFrameMine(p) ? userSizes['pf:' + p.n] : pkFrameAuto(p);
const faceStyle = ([cx, cy, s]) => 'width:' + (100000 / s).toFixed(2) + '%;left:' + ((s / 2 - cx) / s * 100).toFixed(2) + '%;top:' + ((s / 2 - cy) / s * 100).toFixed(2) + '%';
function pkNoPic(box, p) { box.classList.add('nopic'); box.textContent = p ? initials(p.n) : '?'; }
function pkImg(p, style) {
  const u = pkPicURL(p); if (!u) return null;
  const im = h('img', { alt: '', src: u, loading: 'lazy', decoding: 'async', draggable: 'false', style });
  im.onerror = () => { const b = im.parentElement; im.remove(); if (b) pkNoPic(b, p); };
  return im;
}
const pkOf = (x) => typeof x === 'string' ? PK_BY_NAME.get(x) || { n: x } : x;
function pkFace(x, d = 28) {
  const p = pkOf(x), box = h('span', { class: 'pkf', style: '--d:' + d + 'px', 'aria-hidden': 'true', 'data-pkf': p ? p.n : null });
  const im = p && p.im ? pkImg(p, faceStyle(pkFrame(p))) : null; if (im) box.append(im); else pkNoPic(box, p);
  return box;
}
function pkPic(x, d = 84) {
  const p = pkOf(x), box = h('span', { class: 'pkp', style: '--d:' + d + 'px', 'aria-hidden': 'true' });
  const im = p && p.im ? pkImg(p, null) : null; if (im) box.append(im); else pkNoPic(box, p);
  return box;
}
const pkTag = (x, d = 22) => { const p = pkOf(x); return h('span', { class: 'pkt' }, pkFace(p, d), p.n); };
function pkFaces(names, d = 24, max = 8) {
  const l = names.map(pkOf), box = h('span', { class: 'pkfs', 'data-tip': l.map(p => p.n).join(', ') || null, 'aria-label': l.map(p => p.n).join(', ') });
  for (const p of l.slice(0, max)) box.append(pkFace(p, d));
  if (l.length > max) box.append(h('span', { class: 'pkf more', style: '--d:' + d + 'px' }, '+' + (l.length - max)));
  return box;
}
function pkChips(names, d = 22, open, extra) {
  return h('div', { class: 'pkchips' }, names.map(x => { const p = pkOf(x), more = extra ? extra(p) : null; return open ? h('button', { class: 'pkchip', type: 'button', 'data-tip': PK_BY_NAME.has(p.n) ? p.s.join(' · ') + (p.ideal ? ' · ' + p.ideal : '') : null, onclick: () => open(p.n) }, pkFace(p, d), p.n, more) : h('span', { class: 'pkchip' }, pkFace(p, d), p.n, more); }));
}
function pkFramed(p) {
  const f = pkFrame(p), st = faceStyle(f);
  for (const el of document.querySelectorAll('.pkf[data-pkf]')) if (el.dataset.pkf === p.n) { const im = el.querySelector('img'); if (im) im.style.cssText = st; }
  faceCache.delete(p.n); requestDraw();
}
function pkFrameEditor(p) {
  const auto = pkFrameAuto(p); let f = pkFrame(p).slice();
  if (!pkPicURL(p)) { toast('No picture for ' + p.n + ' yet'); return; }
  modal(p.n + '\'s portrait', (box) => {
    box.classList.add('wide');
    box.append(h('p', { class: 'sub' }, 'Drag the circle onto the face, and zoom with the slider, the mouse wheel or two fingers. The circle is the portrait shown wherever space is short.'));
    const stage = h('div', { class: 'pfstage', tabindex: '0', role: 'application', 'aria-label': 'Portrait framing for ' + p.n + '. Arrow keys move, plus and minus zoom.' });
    const full = pkImg(p, null); full.className = 'pfimg'; full.loading = 'eager';
    const ring = h('div', { class: 'pfring' });
    stage.append(full, ring);
    const zoom = h('input', { type: 'range', min: '0', max: '850', step: '1', 'aria-label': 'Zoom' });
    const prev = h('div', { class: 'pfprev' }), faces = [64, 40, 26].map(d => { const el = pkFace(p, d); el.removeAttribute('data-pkf'); return el; });
    prev.append(...faces, h('span', { class: 'pkt', style: 'font-weight:700' }, faces[2].cloneNode(true), p.n));
    const draw = () => {
      f = [clamp(Math.round(f[0]), 0, 1000), clamp(Math.round(f[1]), 0, 1000), clamp(Math.round(f[2]), 150, 1000)];
      ring.style.cssText = 'left:' + (f[0] - f[2] / 2) / 10 + '%;top:' + (f[1] - f[2] / 2) / 10 + '%;width:' + f[2] / 10 + '%;height:' + f[2] / 10 + '%';
      zoom.value = String(1000 - f[2]); const st = faceStyle(f);
      for (const el of prev.querySelectorAll('.pkf img')) el.style.cssText = st;
      auto_.disabled = f.every((v, i) => v === auto[i]);
    };
    const auto_ = h('button', { class: 'btn sm', type: 'button', onclick: () => { f = auto.slice(); draw(); } }, 'Automatic framing');
    zoom.oninput = () => { f[2] = 1000 - +zoom.value; draw(); };
    const pts = new Map(); let g = null;
    const unit = () => 1000 / (stage.getBoundingClientRect().width || 1);
    stage.addEventListener('pointerdown', e => { stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); g = null; e.preventDefault(); stage.focus({ preventScroll: true }); });
    stage.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return; const was = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 1) { const u = unit(); f[0] += (e.clientX - was[0]) * u; f[1] += (e.clientY - was[1]) * u; draw(); return; }
      const [a, b] = [...pts.values()], dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (g) { f[2] = g.s * g.d / Math.max(10, dist); draw(); } else g = { d: dist, s: f[2] };
    });
    const lift = (e) => { pts.delete(e.pointerId); g = null; };
    stage.addEventListener('pointerup', lift); stage.addEventListener('pointercancel', lift);
    stage.addEventListener('wheel', e => { e.preventDefault(); f[2] *= Math.exp(e.deltaY * 0.0015); draw(); }, { passive: false });
    stage.addEventListener('keydown', e => { const k = e.key, st = e.shiftKey ? 40 : 10; if (k === 'ArrowLeft') f[0] -= st; else if (k === 'ArrowRight') f[0] += st; else if (k === 'ArrowUp') f[1] -= st; else if (k === 'ArrowDown') f[1] += st; else if (k === '+' || k === '=') f[2] *= 0.92; else if (k === '-') f[2] /= 0.92; else return; e.preventDefault(); draw(); });
    box.append(h('div', { class: 'pfwrap' }, stage, h('div', { class: 'pfside' }, h('label', { class: 'field' }, h('span', { class: 'note' }, 'Zoom'), zoom), prev, auto_)));
    draw();
  }, 'Save', () => {
    const same = f.every((v, i) => v === auto[i]);
    if (same) delete userSizes['pf:' + p.n]; else userSizes['pf:' + p.n] = f.slice();
    saveUserSizes(); pkFramed(p); toast(same ? p.n + '\'s portrait is automatic again' : p.n + '\'s portrait saved');
  }, false, 'Your framing applies to all your plans and syncs with your sizes.');
}
const faceCache = new Map();
function mapFace(p) {
  const u = pkPicURL(p); if (!u) return null;
  const m = mapPic(u); if (!m || !m.img) return null;
  const f = pkFrame(p), key = f.join(','), hit = faceCache.get(p.n); if (hit && hit.k === key && hit.img === m.img) return hit;
  const W = m.img.naturalWidth, s = f[2] / 1000 * W, r = { k: key, img: m.img, sx: f[0] / 1000 * W - s / 2, sy: f[1] / 1000 * m.img.naturalHeight - s / 2, s };
  faceCache.set(p.n, r); return r;
}
function drawFaces(c, names, x, y, d, align) {
  const n = names.length; if (!n) return; const gap = Math.round(d * 0.28), step = d - gap, w = d + step * (n - 1), x0 = align === 'right' ? x - w : x;
  c.save(); c.font = `800 ${Math.round(d * 0.38)}px ${BODY_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = n - 1; i >= 0; i--) {
    const p = pkOf(names[i]), cx = x0 + i * step + d / 2, cy = y + d / 2, r = d / 2, fc = mapFace(p);
    c.beginPath(); c.arc(cx, cy, r + 1.5, 0, Math.PI * 2); c.fillStyle = theme.panel || '#fff'; c.fill();
    c.save(); c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.clip(); c.fillStyle = theme['accent-soft'] || '#efe2f8'; c.fillRect(cx - r, cy - r, d, d);
    if (fc) c.drawImage(fc.img, fc.sx, fc.sy, fc.s, fc.s, cx - r, cy - r, d, d); else { c.fillStyle = theme.muted || '#666'; c.fillText(initials(p.n), cx, cy + 0.5); }
    c.restore();
  }
  c.restore();
}
function smallOnly(home) { return home && home.kind === 'kit' && !!ITEMS[home.ob.i].sm; }
function fitsHome(p, home) { return !smallOnly(home) || !tooBig(p); }
function sizeWhy(p) { const z = pkSize(p); if (pkSizeMine(p)) return 'Size you set'; if (!pkSizeGuess(p)) return 'Too big for dens and the Poké Ball house (tested by players)'; const hw = p.hw ? ' from its height (' + p.hw[0] + ' m) and weight (' + p.hw[1] + ' kg)' : ''; return (p.sz === 'y' ? 'Fits a den (tested); small or medium is a guess' : 'A guess') + hw + '. Tap to change'; }
function sizeBadge(p, onChange) { if (!p) return ''; const z = pkSize(p), g = pkSizeGuess(p), lb = SIZE_NAME[z] + (g ? '?' : ''), cls = 'szb' + (z === 'l' ? ' big' : '') + (g ? ' guess' : '');
  if (!onChange) return h('span', { class: cls, 'data-tip': sizeWhy(p) }, lb);
  return h('button', { class: cls + ' edit', 'data-tip': sizeWhy(p), 'aria-label': p.n + ' size: ' + SIZE_NAME[z] + (g ? ' (guess)' : '') + '. Change', onclick: (e) => { e.stopPropagation(); pkSizeDialog(p, onChange); } }, lb); }
function pkSizeDialog(p, onChange) {
  let pick = pkSize(p);
  modal('Size of ' + p.n, (box) => {
    box.append(h('div', { class: 'pkhead' }, pkPic(p, 64), h('p', { class: 'sub', style: 'margin:0' }, sizeWhy(p).replace('. Tap to change', ''))));
    const seg = h('div', { class: 'szbtns', style: 'justify-content:flex-start;margin:6px 0' }); box.append(seg);
    const draw = () => { seg.textContent = ''; for (const z of ['s', 'm', 'l']) seg.append(h('button', { 'aria-pressed': pick === z ? 'true' : 'false', onclick: () => { pick = z; draw(); } }, SIZE_NAME[z])); };
    draw();
    if (pkSizeMine(p)) box.append(h('button', { class: 'btn sm', style: 'margin-top:6px', onclick: () => { delete userSizes['pk:' + p.n]; saveUserSizes(); closeModal(); toast(p.n + ' is back to ' + SIZE_NAME[pkSize(p)].toLowerCase() + (pkSizeGuess(p) ? ' (guess)' : '')); onChange && onChange(); } }, 'Back to the guess'));
  }, 'Save', () => { if (pick === (p.ps || 'm') && !p.pg) delete userSizes['pk:' + p.n]; else userSizes['pk:' + p.n] = pick; saveUserSizes(); toast(p.n + ' is ' + SIZE_NAME[pick].toLowerCase()); onChange && setTimeout(onChange, 0); }, false, 'Size decides the rest item it needs (1×1 small, 2×1 medium, 2×2 large) and whether it fits a den (medium or smaller). Yours syncs.');
}
function homeAt(x, y, kind) {
  if (!inB(plan, x, y)) return null; const k = y * plan.w + x;
  const ob = stackAt(k).find(q => q && ITEMS[q.i].cap); const kit = ob ? kitHome(ob) : null;
  if (kind === 'k') return kit;
  const hs = houseAt(x, y) || autoHouses.find(q => q.doors.has(k)); const house = hs && !hs.enclosure ? houseHome(hs) : null;
  if (kind === 'h') return house;
  return kit || house;
}
function residentsIndex() { const homes = new Map(), lost = []; for (const r of (plan.res || [])) { const hm = homeAt(r.x, r.y, r.k); if (!hm) { lost.push(r); continue; } if (!homes.has(hm.key)) homes.set(hm.key, { home: hm, list: [] }); homes.get(hm.key).list.push(r); } return { homes, lost }; }
function residentsOf(home, floor) { const e = residentsIndex().homes.get(home.key); const l = e ? e.list : []; return floor == null ? l : l.filter(r => (r.f || 0) === floor); }
function homeOfPokemon(name) { for (const r of plan.res || []) if (r.p === name) return homeAt(r.x, r.y, r.k); return null; }
function floorHasRoom(home, f) { const all = residentsOf(home); if (all.length >= home.cap) return false; return !home.pf || all.filter(r => (r.f || 0) === f).length < home.pf; }
function assignResident(name, home, floor) {
  if (home.floors > 1 && (floor == null || !floorHasRoom(home, floor))) floor = floorHasRoom(home, 0) ? 0 : 1;
  plan.res = (plan.res || []).filter(r => r.p !== name); const r = { p: name, x: home.ax, y: home.ay, k: home.kind === 'kit' ? 'k' : 'h' }; if (home.floors > 1 && floor) r.f = 1; plan.res.push(r); markDirty(); resRecheck();
}
function setResidentFloor(name, f) { const r = (plan.res || []).find(q => q.p === name); if (r) { if (f) r.f = 1; else delete r.f; markDirty(); resRecheck(); } }
function removeResident(name) { plan.res = (plan.res || []).filter(r => r.p !== name); markDirty(); resRecheck(); }
let resRecheckOn = false;
function resRecheck() { if (resRecheckOn) return; resRecheckOn = true; setTimeout(() => { resRecheckOn = false; if (plan) { evaluateAll(); requestDraw(); } }, 0); }
function intFloor(ob, f) { const I = ob.int; return I && I.f && I.f[f] ? I.f[f] : { o: [], wp: null, fc: null }; }
function kitPieces(ob, floor) { const ki = kitInfo(ob), out = []; for (let f = 0; f < ki.fl; f++) { if (floor != null && f !== floor) continue; for (const a of intFloor(ob, f).o) { const [i, x, y] = a; if (x < ki.w && y < ki.h && ITEMS[i]) out.push({ it: ITEMS[i], x, y, f, w: a[3] || 1, h: a[4] || 1 }); } } return out; }
function kitFurniture(ob, f = 0) { return new Set(kitPieces(ob, f).filter(p => !isWall(p.it) && !isDoor(p.it)).map(p => p.it.i)).size; }
function presentFavs(home, floor) {
  const out = new Map();
  const add = (it) => { if (it && it.fv) for (const f of it.fv) { if (!out.has(f)) out.set(f, []); const l = out.get(f); if (!l.includes(it.n)) l.push(it.n); } };
  if (home.kind === 'kit') { const ki = kitInfo(home.ob); for (const pc of kitPieces(home.ob, floor)) add(pc.it); for (let f = 0; f < ki.fl; f++) { if (floor != null && f !== floor) continue; const F = intFloor(home.ob, f); if (F.wp != null) add(ITEMS[F.wp]); if (F.fc != null) add(ITEMS[F.fc]); } return out; }
  const a = home.hs.area;
  for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (it.fv && objInArea(ob, a)) add(it); }
  for (const k of a.cells) { const g = terrAt(plan, k, a.base - 1); if (g) add(ITEMS[g - 1]); }
  return out;
}
function favCoverage(home) {
  let have = 0, total = 0; const cache = new Map();
  for (const r of residentsOf(home)) { const p = PK_BY_NAME.get(r.p); if (!p) continue; const f = home.floors > 1 ? (r.f || 0) : null; if (!cache.has(f)) cache.set(f, presentFavs(home, f)); const pr = cache.get(f); for (const fv of p.fv || []) { total++; if (pr.has(fv)) have++; } }
  return { have, total };
}
const ENV_AX = { Bright: ['b', 1], Dark: ['b', -1], Warm: ['t', 1], Cool: ['t', -1], Humid: ['u', 1], Dry: ['u', -1] };
const ENV_ROWS = [['b', 'Light', 'Dark', 'Bright', 'In between'], ['t', 'Warmth', 'Cool', 'Warm', 'Mild'], ['u', 'Humidity', 'Dry', 'Humid', 'In between']];
const ENV_LIM = { block: { Bright: 100, Dark: 60, Warm: 60, Cool: -60, Humid: 100, Dry: 30 }, kit: { Bright: 40, Dark: 40, Warm: 60, Cool: -60, Humid: 40, Dry: 60 } };
const ENV_NEED = { p: 'when powered and on', f: 'when lit by a Burn Pokémon', w: 'when filled with water', o: 'when switched on', n: 'when working by water', r: 'when running on fuel', d: 'not in rain, outside a kit house' };
const ENV_FX = {
  'Slender candle': [20, 10, 0, 'f'], 'Eerie candle': [20, 10, 0, 'f'], 'Campfire': [40, 60, 0, 'f'], 'Firepit': [40, 60, 0, 'f'], 'Wall torch': [40, 60, 0, 'f'],
  'Stone fireplace': [40, 60, 0, 'f'], 'Bonfire': [80, 60, 0, 'f'], 'Torch': [40, 60, 0, 'f', 1], 'Cooking stove': [0, 60], 'Fiery Magby statue': [0, 60], 'Furnace kit': [0, 60, 0, 'r'],
  'Mushroom lamp': [80], 'Mushroom streetlight': [80], 'Pearl streetlight': [80], 'Floating lantern': [80], 'Mirror ball': [80, 0, 0, 'p'], 'Lampion': [40],
  'Cube light': [40], 'Poké Ball Wall': [40], 'Neon flooring': [80], 'Cyber flooring': [20], 'Model planet': [40, 0, 0, 'p'], 'Small stage': [40, 0, 0, 'p'], 'Vending machine': [40, 0, 0, 'p'],
  'Gaming bed': [20, 0, 0, 'p'], 'Gaming chair': [20, 0, 0, 'p'], 'Servers': [20, 0, 0, 'p'], 'Wireless power-transmitter post': [20], 'Trevenant streetlight': [20], 'Pumpkin lantern': [20], 'Pumpkin lantern tower': [20],
  'Beach parasol': [-40],
  'Heat Rock': [0, 60], 'Molten rock': [0, 30], 'Lava rock': [0, 10], 'Lava': [0, 60], 'Hot-spring water': [0, 30, 20], 'Air conditioner': [0, 0, 0, 'p'],
  'Icy Rock': [0, -60], 'Refrigerator': [0, -60, 0, 'p'], 'Gaming fridge': [20, -60, 0, 'p'], 'Shop fridge': [0, -60, 0, 'o'], 'Cooler': [0, -60], 'Fan': [0, -60, 0, 'p'], 'Ceiling fan': [0, -60, 0, 'o'],
  'Ice': [0, -10], 'Icicle': [0, -10], 'Shaved ice': [0, -10], 'Soda float': [0, -10],
  'Water': [0, 0, 20], 'Muddy water': [0, 0, 20], 'Waterfall': [0, 0, 20], 'Ocean water': [0, 0, 20, '', 1], 'Sink': [0, 0, 20], 'Modern sink': [0, 0, 20], 'Shower': [0, 0, 20], 'Toilet': [0, 0, 20],
  'Bathtub': [0, 0, 100, 'w'], 'Water basin': [0, 0, 100, 'w'], 'Humidifier': [0, 0, 100, 'o'], 'Funky diffuser': [0, 0, 100, 'o'], 'Damp Rock': [0, 0, 100], 'Hot-spring spout': [0, 0, 100, 'n'],
  'Horsea fountain': [0, 0, 100, 'n'], 'Sprinkler': [0, 0, 100, 'n'], 'Bubble machine': [0, 0, 100, 'p'], 'Pikachu fountain kit': [40, 0, 100], 'Gyarados fountain': [0, 0, 100, 'n', 1], 'Bouncy blue bathtub': [0, 0, 100, 'w', 1],
  'Castform weather charm (rain)': [0, 0, 50], 'Castform weather charm (sun)': [0, 0, -50], 'Smooth rock': [0, 0, -100, 'd'],
  'Chansey plant': [0, 0, 5], 'Leafy plant': [0, 0, 2.5], 'Tall potted plant': [0, 0, 2.5], 'Flat-leaf plant': [0, 0, 2.5], 'Twisted potted plant': [0, 0, 2.5], 'Pitcher-plant pot': [0, 0, 2.5],
  'Small vase': [0, 0, 2.5, '', 1], 'Extravagant flowers': [0, 0, 2.5, '', 1],
  'Field grass': [0, 0, 1], 'Seashore grass': [0, 0, 1], 'Alpine grass': [0, 0, 1], 'Sky-high grass': [0, 0, 1],
  'Dry field grass': [0, 0, -0.5], 'Dry seashore grass': [0, 0, -0.5], 'Dry alpine grass': [0, 0, -0.5], 'Dry sky-high grass': [0, 0, -0.5]
};
const ENV_TESTED_LIGHTS = new Set(['Fluorescent light', 'Poké Ball lamp', 'Shell lamp', 'Resort light', 'Pop art lamp', 'Gaming light', 'Spotlight', 'Seedot lamp', 'Garden light', 'Town streetlight']);
const ENV_POWERED_LIGHTS = ['Town streetlight', 'Harbor streetlight', 'Chic streetlight', 'Double streetlight', 'Dangling streetlight', 'Plain lamp', 'Desk light', 'Poké Ball light', 'Berry table lamp', 'Cute lamp', 'Poké Ball lamp', 'Red meteor lamp', 'Orange meteor lamp', 'Yellow meteor lamp', 'Green meteor lamp', 'Blue meteor lamp', 'Indigo meteor lamp', 'Violet meteor lamp', 'Luxury lamp', 'Garden light', 'Lantern', 'Seedot lamp', 'Wall light', 'Shell lamp', 'Fluorescent light', 'Gaming light', 'Resort light', 'String lights', 'Pop art lamp', 'Berry hanging lamp', 'Surface light', 'Spotlight', 'Antique chandelier', 'Jirachi lamp', 'Cursola light', 'Chain lamp', 'Pathway light (line)', 'Pathway light (single)', 'Pathway light (corner)'];
let envFxMap = null;
function envFx(it) {
  if (!it) return null;
  if (!envFxMap) {
    envFxMap = new Map(); const lights = new Set(ENV_POWERED_LIGHTS);
    for (const x of ITEMS) {
      let a = ENV_FX[x.n] || (lights.has(x.n) ? [80, 0, 0, 'p', ENV_TESTED_LIGHTS.has(x.n) ? 0 : 1] : null);
      if (!a && x.c === 'Nature' && !/^dry /i.test(x.n)) { const s = x.sub; a = s === 'Trees' && x.sh !== 'stump' ? [0, 0, 5] : s === 'Tall grass' || s === 'Flowers' || s === 'Hedges' || s === 'Crops' || ['Duckweed', 'Flowering duckweed', 'Vine', 'Dense vines'].includes(x.n) ? [0, 0, 2.5] : null; }
      if (a) envFxMap.set(x.i, { b: a[0] || 0, t: a[1] || 0, u: a[2] || 0, need: a[3] || '', guess: !!a[4], ac: x.n === 'Air conditioner' });
    }
  }
  return envFxMap.get(it.i) || null;
}
const envT = (fx, ac) => fx.ac ? ac * 60 : fx.t;
const PGN = { n: 'while liquid turns its wheel', r: 'while it has fuel' };
const SIG_IN = { get l() { return 'When anything changes in the ' + (S.gSensor > 1 ? S.gSensor + ' tiles' : 'tile') + ' in front of it, it switches'; }, l2: ' what\'s beside it, behind it and above and below it', f: 'Opens every door within 2 tiles (5×5×5) when Ditto or a walking Pokémon steps on it (floating ones don\'t press it), and closes them soon after', w: 'Switches everything within 3 tiles (7×7×7) on or off', c: 'Switches everything within 3 tiles (7×7×7) on or off with a key card' };
const diaN = (r) => 2 * r * r + 2 * r + 1;
const REACH_TXT = { get Sprinkler() { return 'Waters fields within ' + S.gSprinkler + ' tiles (' + diaN(S.gSprinkler) + ' tiles) while there\'s water at its own height in that reach. Still works buried.'; }, get 'Smooth rock'() { return 'Dries the top block within ' + S.gRock + ' tiles, from a level above it to 2 below, except in rain or by a running sprinkler.'; }, 'Bubble machine': 'Blows bubbles over the 3×3 around it, which underwater crops need.' };
const isPowered = (it) => !!it && it.pd != null;
const signalTarget = (it) => !!it && (!!it.so || it.pt === 'ws' || inWall(it) || isPowered(it) && it.c !== 'Kits');
function howItWorks(it) {
  const out = [];
  if (it.pg) out.push('Makes ' + it.pg + ' power' + (it.pgh ? ', or ' + it.pgh + ' on high ground' : '') + (it.pgn ? ' ' + PGN[it.pgn] : '') + '. A transmitter within ' + S.gGen + ' tiles carries it.');
  if (it.pt) out.push('Carries power to items and generators within 10 tiles, and to other transmitters within 15, up to 5 levels up or down. Takes one generator and up to 20 items.' + (it.pt === 'p' ? ' A block between it and another pole or a generator stops the wire.' : ' Goes through walls.') + (it.pt === 'ws' ? ' Switches off by hand or from a switch.' : ''));
  if (it.pd != null) out.push(it.pd ? 'Uses 1 power.' : 'Needs power but uses none.');
  if (it.si) out.push((it.si === 'l' ? SIG_IN.l + SIG_IN.l2 : SIG_IN[it.si]) + '. Needs no power.');
  if (!it.si && signalTarget(it)) out.push('Switches and sensors nearby can work it.');
  if (REACH_TXT[it.n]) out.push(REACH_TXT[it.n]);
  if (isBerryTree(it)) out.push('Grows 1 berry an hour, up to 3. They fall on 6 of the 8 tiles around it, set by the way it faced when planted.');
  if (it.lq) { const [r, wet, fall] = it.lq; out.push(fall ? 'Falling water: each falling tile adds 20 humidity, and a fall restarts the flow below it.' : 'Reaches ' + r + ' tiles along a 1-wide channel, ' + Math.floor(r / 2) + ' at low level, and starts again below a drop. ' + (wet ? 'Waters fields beside it' + (wet === 2 ? ' (untested)' : '') + '.' : 'Doesn\'t water fields.')); }
  if (it.cg) { const [n, again] = it.cg; out.push(it.sub === 'Crops' ? 'Ripe in ' + n + ' days if it stays wet, or 1 with a Grow Pokémon. ' + (again == null ? '' : again >= n ? 'Starts again from seed after harvest.' : 'Fruits again a day after harvest.') : 'Grows in ' + n + ' day' + (n > 1 ? 's' : '') + ' if watered' + (it.sub === 'Trees' ? ' (some guides say 4)' : '') + '.'); }
  return out;
}
const REACH_COL = { power: '#d39b14', water: '#2f8fd8', dry: '#b07a3c', signal: '#a05bd6', berry: '#d4508f' };
function reachOf(ob) {
  const it = ITEMS[ob.i], z = zOf(ob), rc = it.rc, cx = ob.x, cy = ob.y;
  const diamond = (x0, y0, r) => { const cells = []; for (let dy = -r; dy <= r; dy++) for (let dx = -(r - Math.abs(dy)); dx <= r - Math.abs(dy); dx++) { const x = x0 + dx, y = y0 + dy; if (inB(plan, x, y)) cells.push(y * plan.w + x); } return cells; };
  const pl = (n) => n + ' level' + (n > 1 ? 's' : ''), lv = (up, down) => !up && !down ? 'this level only' : up === down ? pl(up) + ' up and down' : up && down ? pl(up) + ' up, ' + down + ' down' : up ? pl(up) + ' up' : pl(down) + ' down';
  if (it.pt || it.pg) {
    const f = faceOf(ob), foot = it.pg && (ob.w > 1 || ob.h > 1) ? [[ob.x, ob.y + ob.h - 1], [ob.x, ob.y], [ob.x + ob.w - 1, ob.y], [ob.x + ob.w - 1, ob.y + ob.h - 1]][f] : [cx, cy];
    return { kind: 'power', col: REACH_COL.power, cells: diamond(foot[0], foot[1], it.pt ? 10 : S.gGen), far: it.pt ? diamond(foot[0], foot[1], 15) : null, z, label: it.pt ? '10 tiles to items, 15 to transmitters' : S.gGen + ' tiles to a transmitter', lv: lv(5, 5) };
  }
  if (!rc && GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i)) { const cells = []; for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) if (inB(plan, x, y) && !(x >= ob.x && x < ob.x + ob.w && y >= ob.y && y < ob.y + ob.h)) cells.push(y * plan.w + x); return { kind: 'berry', col: REACH_COL.berry, cells, z, label: 'berries fall on 6 of these', lv: lv(0, 0) }; }
  if (!rc) return null;
  const [shape, , up = 0, dn = 0] = rc, r = it.n === 'Sprinkler' ? S.gSprinkler : it.n === 'Smooth rock' ? S.gRock : it.si === 'l' ? S.gSensor : rc[1], kind = it.si ? 'signal' : it.n === 'Smooth rock' ? 'dry' : 'water', col = REACH_COL[kind];
  if (shape === 'd') return { kind, col, cells: diamond(cx, cy, r), z, label: r + ' tiles', lv: lv(up, -dn) };
  if (shape === 's') { const x0 = Math.max(0, ob.x - r), y0 = Math.max(0, ob.y - r), x1 = Math.min(plan.w - 1, ob.x + ob.w - 1 + r), y1 = Math.min(plan.h - 1, ob.y + ob.h - 1 + r), cells = []; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) cells.push(y * plan.w + x); return { kind, col, cells, box: { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, z0: z + dn, z1: z + up }, z, label: (2 * r + 1) + '×' + (2 * r + 1) + '×' + (up - dn + 1), lv: lv(up, -dn) }; }
  if (shape === 'l') {
    const [fx, fy] = [[0, 1], [-1, 0], [0, -1], [1, 0]][faceOf(ob)], watch = [], cells = [];
    for (let i = 1; i <= r; i++) { const x = cx + fx * i, y = cy + fy * i; if (inB(plan, x, y)) watch.push(y * plan.w + x); }
    for (const [x, y] of [[cx - fy, cy + fx], [cx + fy, cy - fx], [cx - fx, cy - fy], [cx, cy]]) if (inB(plan, x, y)) cells.push(y * plan.w + x);
    return { kind, col, cells, watch, z, label: 'watches ' + r + ' tiles, switches 11 cells', lv: lv(1, 1) };
  }
  return null;
}
const envKind =(home) => home.kind === 'kit' && kitInfo(home.ob).kind !== 'ow' ? 'kit' : 'block';
function envGap(ideal, v, kind) {
  const lim = ENV_LIM[kind][ideal]; if (lim == null) return 0;
  return ENV_AX[ideal][1] > 0 ? Math.max(0, lim - v) : Math.max(0, v - lim);
}
function envState(k, v, kind) { const [, , lo, hi] = ENV_ROWS.find(r => r[0] === k), H = !envGap(hi, v, kind), L = !envGap(lo, v, kind); return H && L ? hi + ' & ' + lo.toLowerCase() : H ? hi : L ? lo : null; }
const envAxisOf = (ideal) => ENV_AX[ideal] ? ENV_AX[ideal][0] : null;
const envClash = (a, b) => !!a && !!b && a !== b && envAxisOf(a) === envAxisOf(b);
const ROOF_WORD = ['no roof', 'a quarter roofed', 'half roofed', 'three quarters roofed', 'roofed over'];
function roofOf(hs) { const r = (plan.roofs || []).find(r => hs.cells.has(r.y * plan.w + r.x)); return r ? r.q : null; }
function houseDaylight(hs) {
  const inner = new Set([...hs.cells].filter(k => !hs.doors.has(k))), all = new Set(inner);
  for (const k of inner) { const x = k % plan.w, y = (k / plan.w) | 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (inB(plan, x + dx, y + dy)) all.add((y + dy) * plan.w + x + dx); }
  const base = hs.area.base, floor = hs.cells.size; let roofed = 0; for (const k of hs.cells) if (roofedAt(k, base)) roofed++;
  const open = floor - roofed;
  return { floor, total: all.size, roofed, open, all, v: 90 * Math.fround(open / all.size) };
}
const roofish = (it) => isWall(it) || lookK(it).startsWith('roof');
function solidAt(k, z) {
  const g = terrAt(plan, k, z); if (g && !ITEMS[g - 1].lq) return true;
  const o = occAt(plan, k, z), ob = o && plan.objs.get(o); return !!ob && roofish(ITEMS[ob.i]);
}
function roofedAt(k, L) {
  let top = topTerr(k); if (top == null) top = -Infinity;
  for (const ob of stackAt(k)) top = Math.max(top, topOf(ob));
  let run = true;
  for (let z = L; z <= top; z++) {
    if (solidAt(k, z)) { if (!run || z === L + 3) return true; }
    else run = false;
  }
  return false;
}
function habitatDaylight(a) {
  const R = a.rect; let open = 0, total = 0;
  for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { if (!inB(plan, x, y)) continue; total++; if (!roofedAt(y * plan.w + x, a.base)) open++; }
  return { open, total, v: total ? 90 * open / total : 0 };
}
const burnsIt = (p) => !!p && (p.s || []).includes('Burn');
function burnersAt(x, y, z, ranges) {
  const out = new Set();
  for (const hm of ranges) { const R = hm.rect; if (x < R.x || y < R.y || x >= R.x + R.w || y >= R.y + R.h || (z != null && Math.abs(z - hm.base) > AREA_R)) continue; for (const p of hm.pks) if (burnsIt(p)) out.add(p.n); }
  return [...out];
}
function fireLitBy(ob) { return burnersAt(ob.x, ob.y, zOf(ob), homeRanges()); }
const envPks = (home) => home.kind === 'habitat' ? home.pks : residentsOf(home, home.floor).map(r => PK_BY_NAME.get(r.p)).filter(Boolean);
function habitatHome(z) {
  const r = zoneStatus.get(z.id); if (!r || r.kind !== 'habitat' || !r.area) return null;
  const hb = r.best ? r.best.hb : r.target || (r.near && r.near.hb); if (!hb) return null;
  return { kind: 'habitat', key: 'zone:' + z.id, zone: z, area: r.area, hb, ok: !!r.ok, pks: hb.p.map(n => PK_BY_NAME.get(n)).filter(Boolean) };
}
function envOf(home) {
  const pks = envPks(home), hab = home.kind === 'habitat';
  let warm = 0, cool = 0; for (const p of pks) { if (p.ideal === 'Warm') warm++; else if (p.ideal === 'Cool') cool++; }
  const ac = warm > cool ? 1 : cool ? -1 : 0, kind = envKind(home), interior = home.kind === 'kit' && kind === 'kit';
  const E = { kind, built: home.kind === 'house', hab, roof: null, day: null, ac, pks, off: new Map(), burn: [], ax: { b: { v: 0, parts: new Map() }, t: { v: 0, parts: new Map() }, u: { v: 0, parts: new Map() } } };
  let ranges = null; const rng = () => ranges || (ranges = homeRanges());
  const add = (k, label, v, fx, n, by) => { if (!v) return; const A = E.ax[k]; A.v += v; const e = A.parts.get(label); if (e) { e.v += v; e.n += n || 1; } else A.parts.set(label, { v, n: n || 1, need: fx ? fx.need : '', guess: fx ? fx.guess : false, by: by || '' }); };
  const off = (it, why) => { const e = E.off.get(it.n); if (e) e.n++; else E.off.set(it.n, { why, n: 1 }); };
  const addIt = (it, ob, warmOk = true) => {
    const fx = envFx(it); if (!fx) return; let by = '';
    if (fx.need === 'f' && plan.wx === 'rain' && !interior && ob && !roofedAt(ob.y * plan.w + ob.x, zOf(ob))) { off(it, 'out: it\'s raining and there\'s no roof over it'); return; }
    if (fx.need === 'f') { const who = ob ? burnersAt(ob.x, ob.y, zOf(ob), rng()) : pks.filter(burnsIt).map(p => p.n); if (!who.length) { off(it, 'not lit: no Burn Pokémon lives nearby'); return; } by = listNames(who.slice(0, 2)) + (who.length > 2 ? ' +' + (who.length - 2) : ''); }
    if (fx.need === 'd' && plan.wx === 'rain' && !interior) { off(it, 'it\'s raining'); return; }
    if (it.n === 'Sprinkler' && ob && FIELDS && FIELDS.spr.get(ob.id) && !FIELDS.spr.get(ob.id).works) { off(it, 'no water in reach'); return; }
    if (fx.need === 'p' && it.pd != null && (ob ? !powerOn(ob) : !!(POWER && POWER.any) && !(POWER.kit.get(home.ob.id) && POWER.kit.get(home.ob.id).on))) { off(it, 'no power'); return; }
    const nm = fx.ac ? it.n + (ac > 0 ? ' (on hot)' : ac < 0 ? ' (on cold)' : ' (off)') : it.n;
    add('b', nm, fx.b, fx, 1, by); if (warmOk) add('t', nm, envT(fx, ac), fx, 1, by); add('u', nm, fx.u, fx, 1, by);
  };
  const tiles = new Map(), terr = (k, base, lo, hi, tlo, thi) => {
    const zs = plan.tz, tt = plan.tt;
    for (let j = zs.length - 1; j >= 0; j--) { const v = tt[j][k]; if (!v) continue; const z = zs[j], d = z - base; if (d < lo || d > hi) continue; const it = ITEMS[v - 1]; if (!envFx(it) || (terrAt(plan, k, z + 1) && !(it.lq && it.lq[2]) && !((flowAt(k, z) || {}).f === FL_FALL))) continue; const e = tiles.get(v - 1) || [0, 0]; e[0]++; if (d >= tlo && d <= thi) e[1]++; tiles.set(v - 1, e); }
  };
  if (home.kind === 'kit') { for (const pc of kitPieces(home.ob, kind === 'block' ? 0 : home.floor)) addIt(pc.it, null); }
  else if (hab) {
    const a = home.area, R = a.rect, base = a.base, D = habitatDaylight(a); E.day = D;
    add('b', 'Daylight (' + D.open + ' of ' + D.total + ' tiles open to the sky)', D.v);
    const seen = new Set();
    for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) {
      if (!inB(plan, x, y)) continue; const k = y * plan.w + x;
      for (const ob of stackAt(k)) { const lv = zOf(ob) - base; if (lv < -AREA_R || lv > AREA_R || seen.has(ob.id)) continue; seen.add(ob.id); addIt(ITEMS[ob.i], ob, lv >= -1 && lv <= 3); }
      terr(k, base, -AREA_R, AREA_R, -1, 3);
    }
  } else {
    const hs = home.hs, base = hs.area.base, D = houseDaylight(hs); E.roof = D.roofed; E.day = D;
    add('b', 'Daylight (' + D.open + ' of ' + D.total + ' tiles open to the sky)', D.v);
    const seen = new Set();
    for (const k of hs.cells) {
      for (const ob of stackAt(k)) { const lv = zOf(ob) - base; if (lv < -1 || lv > 3 || seen.has(ob.id)) continue; seen.add(ob.id); addIt(ITEMS[ob.i], ob); }
      terr(k, base, -1, 3, -1, 3);
    }
  }
  for (const [i, [n, nt]] of tiles) { const it = ITEMS[i], fx = envFx(it), lb = it.n + ' (' + n + ' tile' + (n > 1 ? 's' : '') + ')'; add('b', lb, fx.b * n, fx, n); if (nt) add('t', nt === n ? lb : it.n + ' (' + nt + ' tile' + (nt > 1 ? 's' : '') + ' low enough to warm)', envT(fx, ac) * nt, fx, nt); add('u', lb, fx.u * n, fx, n); }
  E.burn = home.kind === 'kit' ? pks.filter(burnsIt).map(p => p.n) : (() => { const R = hab ? home.area.rect : home.hs.area.rect, b = hab ? home.area.base : home.hs.area.base, out = new Set(); for (const hm of rng()) { const Q = hm.rect; if (Q.x + Q.w <= R.x || R.x + R.w <= Q.x || Q.y + Q.h <= R.y || R.y + R.h <= Q.y || Math.abs(hm.base - b) > AREA_R) continue; for (const p of hm.pks) if (burnsIt(p)) out.add(p.n); } for (const p of pks) if (burnsIt(p)) out.add(p.n); return [...out]; })();
  for (const k in E.ax) E.ax[k].state = envState(k, E.ax[k].v, kind);
  return E;
}
function envMet(p, E) { const k = envAxisOf(p.ideal); return !k || !envGap(p.ideal, E.ax[k].v, E.kind); }
function envNeeds(E) {
  const m = new Map(); for (const p of E.pks) { if (!p.ideal || envMet(p, E)) continue; if (!m.has(p.ideal)) m.set(p.ideal, []); m.get(p.ideal).push(p.n); }
  return [...m].map(([ideal, who]) => ({ ideal, who, gap: envGap(ideal, E.ax[envAxisOf(ideal)].v, E.kind) })).sort((a, b) => b.who.length - a.who.length);
}
function envGain(it, E) {
  const fx = envFx(it); if (!fx || !E.pks.length || (fx.need === 'f' && !E.burn.length) || (fx.need === 'd' && plan.wx === 'rain' && E.kind !== 'kit')) return { g: 0, good: [], bad: [] };
  let g = 0; const good = [], bad = [];
  for (const p of E.pks) {
    const k = envAxisOf(p.ideal); if (!k) continue; const d = k === 't' ? envT(fx, E.ac) : fx[k]; if (!d) continue;
    const v = E.ax[k].v, before = envGap(p.ideal, v, E.kind), after = envGap(p.ideal, v + d, E.kind); if (before === after) continue;
    if (before && !after) { g += 3; good.push(p.n); } else if (!before && after) { g -= 4; bad.push(p.n); }
    else { const r = clamp((before - after) / Math.max(before, 20), -1, 1); g += 1.5 * r; (r > 0 ? good : bad).push(p.n); }
  }
  return { g, good, bad };
}
const envNum = (v) => String(Math.round(v * 10) / 10);
const envPts = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + envNum(Math.abs(v));
function envFxText(it, E) { const fx = envFx(it); if (!fx) return ''; const b = []; const t = envT(fx, E ? E.ac : 0); if (fx.b) b.push(envPts(fx.b) + ' light'); if (t) b.push(envPts(t) + ' warmth'); if (fx.u) b.push(envPts(fx.u) + ' humidity'); if (fx.ac && !t) b.push('cools or warms'); return b.join(', ') + (b.length && fx.need ? ' (' + ENV_NEED[fx.need] + ')' : '') + (fx.guess ? ' (untested)' : ''); }
function envAdvice(ideal, E) {
  const k = envAxisOf(ideal), A = E.ax[k], g = envGap(ideal, A.v, E.kind), lim = ENV_LIM[E.kind][ideal]; if (!g) return '';
  const top = (sign) => [...A.parts].filter(([lb, e]) => e.v * sign > 0 && !lb.startsWith('Daylight')).sort((a, b) => Math.abs(b[1].v) - Math.abs(a[1].v)).slice(0, 3).map(([lb, e]) => lb + (e.n > 1 && !/tile/.test(lb) ? ' ×' + e.n : '') + ' (' + envPts(e.v) + ')').join(', ');
  const where = E.hab ? ' Anything in the dotted area counts, from 4 levels down to 4 up' + (k === 't' ? ', but warmth only from 1 down to 3 up' : '') + '.' : E.kind === 'block' ? ' Only the floor inside the walls counts.' : '';
  const sign = ENV_AX[ideal][1], unpow = [...E.off].filter(([n, e]) => { if (e.why !== 'no power') return false; const fx = envFx(BY_NAME.get(n)); return !!fx && (k === 't' ? envT(fx, E.ac) : fx[k]) * sign > 0; }).map(([n]) => n), powTxt = unpow.length ? ' ' + listNames(unpow) + (unpow.length > 1 ? ' have' : ' has') + ' no power.' : '';
  const unlit = [...E.off].filter(([, e]) => /not lit/.test(e.why)).map(([n]) => n), fire = E.burn.length ? 'lit by ' + E.burn[0] : 'once a Burn Pokémon lives nearby to light it', unlitTxt = unlit.length ? ' ' + listNames(unlit) + (unlit.length > 1 ? ' aren\'t' : ' isn\'t') + ' lit: a Burn Pokémon has to live nearby.' : '';
  const now = (sign, word) => top(sign) ? ' ' + word + ' it now: ' + top(sign) + '.' : '';
  const hate = (w) => { const who = E.pks.filter(p => dislikesOf(p).some(d => d.w === w)).map(p => p.n); return who.length ? ' ' + listNames(who) + (who.length > 1 ? ' dislike ' : ' dislikes ') + w + ', so leave ' + (w === 'fire' ? 'the fires' : 'water') + ' out.' : ''; };
  switch (ideal) {
    case 'Bright': return 'Needs ' + envNum(g) + ' more light: a lamp or streetlight (80), a campfire or fireplace (40, ' + fire + '), a candle (20)' + (E.built && E.roof ? ', or less roof' : '') + '.' + hate('fire') + unlitTxt + powTxt + where;
    case 'Dark': { const lit = top(1), day = (E.built || E.hab) && E.day ? E.day.v : 0; return 'Too bright (' + envNum(A.v) + ', dark is ' + lim + ' or less): ' + [day > 0 ? 'more roof (daylight ' + envNum(day) + ')' : '', lit ? 'take out ' + lit : '', 'or a Beach parasol (−40)'].filter(Boolean).join(', ') + '.'; }
    case 'Warm': return 'Needs ' + envNum(g) + ' more warmth: a fire (' + fire + '), a cooking stove, a Heat Rock or the air conditioner on hot (+60 each). Lamps don\'t warm.' + hate('fire') + unlitTxt + powTxt + now(-1, 'Cooling') + where;
    case 'Cool': return 'Needs ' + envNum(g) + ' less warmth: an Icy Rock, a fridge, cooler or fan, or the air conditioner on cold (−60 each).' + powTxt + now(1, 'Warming') + where;
    case 'Humid': return 'Needs ' + envNum(g) + ' more humidity: a filled basin or bathtub, a humidifier or a Damp Rock (+100 each); a sink, shower' + (E.kind === 'block' ? ', toilet or water tile' : ' or toilet') + ' (+20).' + hate('water') + powTxt + now(-1, 'Drying') + where;
    case 'Dry': return 'Too humid (' + envNum(A.v) + ', dry is ' + lim + ' or less): take out ' + (top(1) || 'what\'s wet') + ', or add a Smooth Rock (−100, ' + (plan.wx === 'rain' && E.kind !== 'kit' ? 'but it\'s off while it rains' : 'not in rain') + ').';
  }
  return '';
}
function envBar(k, v, kind) {
  const L = ENV_LIM[kind], [lo, hi] = k === 'b' ? [0, kind === 'kit' ? 160 : 200] : k === 't' ? [-180, 180] : [-20, kind === 'kit' ? 160 : 200];
  const [loLim, hiLim] = k === 'b' ? [L.Dark, L.Bright] : k === 't' ? [L.Cool, L.Warm] : [L.Dry, L.Humid], pc = (x) => clamp((x - lo) / (hi - lo) * 100, 0, 100);
  const a = pc(Math.min(loLim, hiLim)), b = pc(Math.max(loLim, hiLim)), mid = loLim >= hiLim ? 'color-mix(in srgb,var(--lo),var(--hi))' : 'var(--mid)';
  return h('span', { class: 'envbar ' + k, 'aria-hidden': 'true', style: 'background:linear-gradient(90deg,var(--lo) 0 ' + a + '%,' + mid + ' ' + a + '% ' + b + '%,var(--hi) ' + b + '% 100%)' }, h('i', { style: 'left:' + pc(v) + '%' }));
}
function envBlock(home, E = envOf(home)) {
  const L = ENV_LIM[E.kind], box = h('div', { class: 'envbox' });
  for (const [k, lb, lo, hi, mid] of ENV_ROWS) { const A = E.ax[k]; box.append(h('div', { class: 'envrow', 'data-tip': lo + ' at ' + L[lo] + ' or ' + (L[lo] < 0 ? 'lower' : 'less') + ' · ' + hi + ' at ' + (L[hi] > 0 ? '+' : '') + L[hi] + ' or more' }, h('span', { class: 'envlb' }, lb), envBar(k, A.v, E.kind), h('b', { class: 'envst' + (A.state ? '' : ' mid') }, A.state || mid), h('span', { class: 'envv' }, envPts(A.v)))); }
  const chips = h('div', { class: 'reqs' });
  for (const p of E.pks) if (p.ideal) { const ok = envMet(p, E); chips.append(h('span', { class: 'req ' + (ok ? 'ok' : 'miss'), 'data-tip': ok ? p.n + ' likes it ' + p.ideal.toLowerCase() + ': it is.' : envAdvice(p.ideal, E) }, (ok ? '✓' : '✗') + p.n + ' · ' + p.ideal)); }
  if (chips.childNodes.length) box.append(chips);
  const wheat = E.ax.u.parts.get('Wheat field'), U = E.ax.u;
  if (wheat && !envGap('Humid', U.v, E.kind) && envGap('Humid', U.v - wheat.v, E.kind)) box.append(h('div', { class: 'note', 'data-tip': 'Harvested wheat goes back to seed and adds no humidity until it sprouts again, a day later if it\'s watered.' }, '⚠ Humidity drops to ' + envNum(U.v - wheat.v) + ' after the wheat is harvested, so it isn\'t humid until it sprouts again.'));
  if (plan.wx === 'rain' && home.kind !== 'kit') { const out = [...E.off].filter(([, e]) => /raining/.test(e.why)).map(([n]) => n); if (out.length) box.append(h('div', { class: 'note', style: 'color:var(--warn)', 'data-tip': 'Rain puts out fires with no roof over them, and they stay out while it rains, so they add no warmth or light. A roof keeps a fire lit.' }, 'Raining: ' + listNames(out) + (out.length > 1 ? ' are' : ' is') + ' out, with no roof over ' + (out.length > 1 ? 'them' : 'it') + '.')); }
  const det = h('details', { class: 'envwhat' }, h('summary', null, 'What counts'));
  for (const [k, lb] of ENV_ROWS) { const A = E.ax[k]; const parts = [...A.parts].sort((a, b) => Math.abs(b[1].v) - Math.abs(a[1].v)); det.append(h('div', { class: 'note' }, h('b', null, lb + ': '), parts.length ? parts.map(([l, e]) => l + (e.n > 1 && !/tile/.test(l) ? ' ×' + e.n : '') + ' ' + envPts(e.v) + (e.by ? ' (lit by ' + e.by + ')' : e.need ? ' (' + ENV_NEED[e.need] + ')' : '') + (e.guess ? ' (untested)' : '')).join(' · ') : 'nothing')); }
  if (E.off.size) det.append(h('div', { class: 'note' }, h('b', null, 'Not counted: '), [...E.off].map(([n, e]) => n + (e.n > 1 ? ' ×' + e.n : '') + ' (' + e.why + ')').join(' · ')));
  box.append(det);
  return box;
}
function envHelp(home) {
  if (home.kind === 'habitat') return 'Light and humidity count everything in the dotted area, from 4 levels down to 4 up; warmth only from 1 down to 3 up. Walls don\'t block a lamp. Daylight = 90 × tiles open to the sky ÷ all tiles in the area. Bright at 100+, dark at 60 or less; humid at 100+, dry at 30 or less; warm at +60, cool at −60. These are the Pokémon this habitat attracts; once one moves into a house, the house\'s environment counts for it instead. Fires count when a Burn Pokémon lives nearby to light them. Points are from a player\'s in-game tests.';
  const E = { kind: envKind(home), built: home.kind === 'house' };
  return (E.kind === 'kit' ? 'Everything inside counts, at any height. In a house with 2 Pokémon per floor, each floor is its own home: only what\'s on a Pokémon\'s floor counts for it. No daylight; windows, wallpaper and floors don\'t count. Bright at 40+, dark at 40 or less; humid at 40+, dry at 60 or less (exactly 40 light, or 40–60 humidity, suits both).'
    : (E.built ? 'Only what\'s on the floor inside the walls or on a door tile counts, from 1 below to 3 above the floor; never walls or outside. Daylight = 90 × floor tiles open to the sky ÷ all tiles, walls included.' : 'Built from blocks, so it works like a house you built: only the ground floor counts, and it\'s roofed (no daylight).') + ' Bright at 100+, dark at 60 or less; humid at 100+, dry at 30 or less.')
    + ' Warm at +60, cool at −60. Tap a ✗ to see what to change. Points are from a player\'s in-game tests; "untested" values are the planner\'s guess. Fires count when a Burn Pokémon lives nearby to light them, appliances when on, tubs and fountains when filled.';
}
function envSection(home, noHead) {
  if (splitFloors(home) && home.floor == null) { const wrap = h('div', { class: 'envsec' }); if (!noHead) wrap.append(h('div', { class: 'hrow', style: 'margin-top:8px' }, h('b', null, 'Environment'), h('span', { class: 'note' }, 'each floor on its own'), tipBtn(envHelp(home)))); for (const f of [0, 1]) wrap.append(h('div', { class: 'note', style: 'margin-top:6px;font-weight:700' }, floorName(f)), envSection(floorOf(home, f), true)); return wrap; }
  const wrap = h('div', { class: 'envsec' }), kit = envKind(home) === 'kit', E = envOf(home);
  if (!noHead) wrap.append(h('div', { class: 'hrow', style: 'margin-top:8px' }, h('b', null, 'Environment'), home.floors > 1 ? h('span', { class: 'note' }, kit ? 'both floors' : 'ground floor') : '', tipBtn(envHelp(home))));
  wrap.append(envBlock(home, E));
  const pks = home.kind === 'habitat' ? [] : E.pks, clash = [], share = [];
  for (let i = 0; i < pks.length; i++) for (let j = i + 1; j < pks.length; j++) if (envClash(pks[i].ideal, pks[j].ideal)) (kit && envAxisOf(pks[i].ideal) !== 't' ? share : clash).push(pks[i].n + ' (' + pks[i].ideal + ') vs ' + pks[j].n + ' (' + pks[j].ideal + ')');
  if (clash.length) wrap.append(h('div', { class: 'note', style: 'color:var(--warn)', 'data-tip': 'They want opposites, so one of them can\'t be comfortable here. Different scales (say Warm and Humid) are fine together.' }, '⚠ ' + clash.join('; ')));
  if (share.length) wrap.append(h('div', { class: 'note', 'data-tip': 'A kit house can suit both: light at exactly 40, or humidity from 40 to 60.' }, '✓ ' + share.join('; ') + ': can share'));
  return wrap;
}
function compat(p, others) { let shared = 0; for (const o of others) for (const f of p.fv || []) if ((o.fv || []).includes(f)) shared++; const clash = others.filter(o => envClash(o.ideal, p.ideal)).map(o => o.n), same = others.every(o => !o.ideal || o.ideal === p.ideal), sameEnv = !clash.length, fc = others.filter(o => favClash(p, o)).map(o => o.n); return { shared, sameEnv, same, clash, fc, score: shared + (same ? 3 : sameEnv ? 1 : 0) - 3 * fc.length }; }
const FC_TXT = (names) => 'one dislikes what the other likes: ' + listNames(names);
const favClash = (a, b) => dislikesOf(a).some(d => (b.fv || []).includes(d.f)) || dislikesOf(b).some(d => (a.fv || []).includes(d.f));
function decorPlan(home, floor) {
  const res = residentsOf(home, floor).map(r => PK_BY_NAME.get(r.p)).filter(Boolean); const present = presentFavs(home, floor);
  const need = new Map(); for (const p of res) for (const f of p.fv || []) need.set(f, (need.get(f) || 0) + (present.has(f) ? 0.35 : 2));
  const fh = floorOf(home, floor), lack = new Set(comfortTrio(fh).filter(t => !t[1]).map(t => t[2])), all = [], fillW = 2 * Math.max(1, res.length);
  const rf = restFit(home, floor), big = rf ? rf.short : [], needR = rf && rf.short.length ? rf.need : 0, needBig = needR > 0;
  const env = envOf(fh), envN = envNeeds(env);
  for (const it of ITEMS) {
    const fx = envFx(it); if ((!it.fv && !it.tg && !fx) || it.c === 'Terrain' || it.c === 'Kits') continue;
    const nature = it.c === 'Nature'; if (nature && (it.n === 'Molten rock' || !(fx && (fx.b || fx.t || Math.abs(fx.u) >= 10)))) continue;
    let fav = 0; const hits = [], hate = res.filter(p => hatesIt(p, it)).map(p => p.n); if (!nature) for (const f of it.fv || []) if (need.has(f)) { fav += need.get(f) * (it.tg && it.tg !== 'Road' ? 1 : 0.5); hits.push(f); }
    const fill = !nature && !!(it.tg && lack.has(it.tg)), fits = needBig && isRest(it) ? (SIZE_RANK[restClass(...footOf(it))[0]] >= needR ? 1 : -1) : 0, base = (it.m && it.m.length ? 0.8 : 0) - (it.sub === 'Event item' ? 1.5 : 0) - (it.ep ? 0.3 : 0), size = needBig && fits > 0 ? fillW : 0;
    const eg = envGain(it, env);
    all.push({ it, hits, hate, fav, fill, fits, base, rank: (needBig ? (fits > 0 ? 0 : 1) : 0) + (hate.length ? 2 : 0), env: eg.g, envGood: eg.good, envBad: eg.bad, sc: fav + (fill ? fillW : 0) + base + size + 2 * eg.g - 6 * hate.length });
  }
  const sugg = all.filter(x => x.fav > 0 || x.fill || x.env > 0).sort((a, b) => b.sc - a.sc || a.it.n.localeCompare(b.it.n));
  const byTag = (t, ok) => all.filter(x => x.it.tg === t && (!ok || ok(x.it))).sort((a, b) => a.rank - b.rank || (b.fav + b.base + b.env) - (a.fav + a.base + a.env) || a.it.n.localeCompare(b.it.n));
  const envFor = (ideal, ok) => { const [k, dir] = ENV_AX[ideal]; return all.filter(x => { const fx = envFx(x.it); return fx && (k === 't' ? envT(fx, env.ac) : fx[k]) * dir > 0 && x.env > 0 && (!ok || ok(x.it)); }).sort((a, b) => a.hate.length - b.hate.length || b.env - a.env || (b.fav + b.base) - (a.fav + a.base) || a.it.n.localeCompare(b.it.n)); };
  return { res, present, need, sugg, lack, byTag, big, needBig, needR, env, envN, envFor, cmf: new Map(homeComfort(home).map(c => [c.p.n, c])) };
}
function resChip(home, r, onChange) {
  const p = PK_BY_NAME.get(r.p); const f = r.f || 0, to = floorName(1 - f).toLowerCase();
  const flBtn = home.floors > 1 ? h('button', { class: 'flr', 'data-tip': 'Sleeps on the ' + floorName(f).toLowerCase() + ': tap to move to the ' + to + (home.pf ? ', or to swap with someone there when it\'s full' : ''), 'aria-label': 'Move ' + r.p + ' to the ' + to, onclick: () => floorMove(home, r, onChange) }, f ? '2F' : '1F') : '';
  const big = smallOnly(home) && tooBig(p);
  return h('span', { class: 'res' + (big ? ' bad' : ''), 'data-tip': big ? 'Too big to live in a den' : null }, pkFace(p || r.p, 24), flBtn, r.p, p && p.ideal ? h('span', { class: 'env' }, p.ideal) : '', p ? sizeBadge(p, onChange) : '', big ? h('span', { class: 'szb big' }, 'Too big') : '', p ? h('button', { 'aria-label': 'Move ' + r.p + ' to another home', 'data-tip': 'Move to another home, or swap with someone in a full one', onclick: () => pkHomeChooser(p, onChange) }, icon('move')) : '', h('button', { 'aria-label': 'Move ' + r.p + ' out', 'data-tip': 'Move out', onclick: () => { removeResident(r.p); onChange(); } }, icon('close')));
}
function resRec(r, s) { const o = { p: r.p, x: s.x, y: s.y, k: s.k }; if (s.f) o.f = 1; return o; }
function resSwap(a, b, label) {
  const L = plan.res || [], ra = L.find(r => r.p === a), rb = L.find(r => r.p === b); if (!rb) return false;
  setRes(ra ? L.map(r => r === ra ? resRec(ra, rb) : r === rb ? resRec(rb, ra) : r) : L.filter(r => r !== rb).concat([resRec({ p: a }, rb)])); commitTx(label); return true;
}
function floorMove(home, r, onChange) {
  const f = r.f || 0, to = 1 - f, where = (z) => z ? 'upstairs' : 'downstairs';
  if (floorHasRoomFor(home, to, r.p)) { setRes((plan.res || []).map(q => q.p === r.p ? resRec(q, { x: q.x, y: q.y, k: q.k, f: to }) : q)); commitTx(r.p + ' moved ' + where(to)); onChange(); return; }
  const others = residentsOf(home, to);
  modal('Swap ' + r.p + ' with someone ' + where(to), (box) => {
    box.append(h('p', { class: 'sub' }, floorName(to) + ' is full (' + home.pf + ' per floor). Pick who moves ' + where(f) + ' instead.'));
    const l = h('div', { class: 'list' });
    for (const o of others) { const q = PK_BY_NAME.get(o.p); l.append(h('button', { class: 'row', type: 'button', onclick: () => { closeModal(); const lb = r.p + ' and ' + o.p + ' swapped floors'; resSwap(r.p, o.p, lb); onChange(); undoToast(lb, 4200); } }, pkFace(q || o.p, 32), h('span', { class: 'meta' }, h('div', { class: 'nm' }, o.p), q && q.ideal ? h('div', { class: 'ds' }, q.ideal) : ''))); }
    box.append(l);
  });
}
function floorHasRoomFor(home, f, name) { if (!home.pf) return true; return residentsOf(home, f).filter(r => r.p !== name).length < home.pf; }
function bigWay(hs) {
  const Wd = plan.w, L = hs.level, cells = hs.cells;
  const pass = (k) => { if (!cells.has(k) || terrAt(plan, k, L)) return false; const o = objAtLv(k, L); if (!o) return true; const it = ITEMS[o.i]; return isDoor(it) || it.tg === 'Road'; };
  const sq = (k) => { const x = k % Wd; return x + 1 < Wd && pass(k) && pass(k + 1) && pass(k + Wd) && pass(k + Wd + 1); };
  const seen = new Set(), q = [];
  for (const k of cells) if (sq(k) && [k, k + 1, k + Wd, k + Wd + 1].filter(c => hs.doors.has(c)).length >= 2) { seen.add(k); q.push(k); }
  const door = q.length > 0;
  while (q.length) { const k = q.pop(), x = k % Wd; for (const n of [x > 0 ? k - 1 : -1, x + 1 < Wd ? k + 1 : -1, k - Wd, k + Wd]) if (n >= 0 && !seen.has(n) && sq(n)) { seen.add(n); q.push(n); } }
  const near = new Set(); for (const k of seen) for (const c of [k, k + 1, k + Wd, k + Wd + 1]) { const x = c % Wd; near.add(c); if (x > 0) near.add(c - 1); if (x + 1 < Wd) near.add(c + 1); near.add(c - Wd); near.add(c + Wd); }
  const objs = new Map(); for (const k of cells) { const o = objAtLv(k, L); if (o && zOf(o) === L) objs.set(o.id, o); }
  const reach = (o) => { for (let y = o.y; y < o.y + o.h; y++) for (let x = o.x; x < o.x + o.w; x++) if (near.has(y * Wd + x)) return true; return false; };
  return { door, objs: [...objs.values()], reach };
}
const mustReach = (it) => !!it && (it.tg === 'Relaxation' || (it.tg === 'Toy' && S.gReach !== 'r') || (it.tg === 'Decoration' && S.gReach === 'all'));
const standOn = (it) => it.c === 'Blocks' || it.sh === 'block' || it.sh === 'hedge' || lookK(it) === 'steps';
const WALK_CACHE = new Map();
function walkOf(hs, big) {
  const key = hs.id + ':' + (big ? 2 : 1), hit = WALK_CACHE.get(key); if (hit && hit.seq === evalSeq && hit.hs === hs) return hit.W;
  const Wd = plan.w, N = Wd * plan.h, R = hs.area.rect, L = hs.area.base, zlo = L - 4, zhi = L + 3;
  const inR = (k) => { const x = k % Wd, y = (k / Wd) | 0; return x >= R.x && y >= R.y && x < R.x + R.w && y < R.y + R.h; };
  const free = (k, z) => { const g = terrAt(plan, k, z); if (g) return false; const o = occAt(plan, k, z), ob = o && plan.objs.get(o); if (!ob) return true; const it = ITEMS[ob.i]; return isDoor(it) || it.tg === 'Road' || lookK(it) === 'steps'; };
  const under = (k, z) => { const g = terrAt(plan, k, z - 1); if (g) return !ITEMS[g - 1].lq; const o = occAt(plan, k, z - 1), ob = o && plan.objs.get(o); return !!ob && standOn(ITEMS[ob.i]); };
  const stand1 = (k, z) => inR(k) && free(k, z) && under(k, z);
  const cellsOf = (k) => big ? [k, k + 1, k + Wd, k + Wd + 1] : [k];
  const fits = (k) => !big || ((k % Wd) + 1 < Wd && k + Wd + 1 < N);
  const stand = (k, z) => fits(k) && cellsOf(k).every(c => stand1(c, z));
  const roomAt = (k, z) => cellsOf(k).every(c => free(c, z));
  const id = (k, z) => (z - ZMIN) * N + k, seen = new Set(), q = [];
  for (const d of hs.doors) for (const k of big ? [d, d - 1, d - Wd, d - Wd - 1] : [d]) { if (k < 0 || !stand(k, L) || (big && cellsOf(k).filter(c => hs.doors.has(c)).length < 2)) continue; const i = id(k, L); if (!seen.has(i)) { seen.add(i); q.push([k, L]); } }
  while (q.length) {
    const [k, z] = q.pop(), x = k % Wd;
    for (const n of [x > 0 ? k - 1 : -1, x + 1 < Wd ? k + 1 : -1, k >= Wd ? k - Wd : -1, k + Wd < N ? k + Wd : -1]) {
      if (n < 0) continue;
      for (const z2 of [z, z + 1, z - 1]) {
        if (z2 < zlo || z2 > zhi || seen.has(id(n, z2)) || !stand(n, z2)) continue;
        if (z2 > z && !roomAt(k, z2)) continue;
        if (z2 < z && !roomAt(n, z)) continue;
        seen.add(id(n, z2)); q.push([n, z2]);
      }
    }
  }
  const at = new Set(); for (const i of seen) { const k = i % N, z = Math.floor(i / N) + ZMIN; for (const c of cellsOf(k)) at.add(id(c, z)); }
  const touch = (ob) => {
    const lo = zOf(ob) - 1, hi = topOf(ob) + 1;
    for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) {
      const inside = x >= ob.x && x < ob.x + ob.w && y >= ob.y && y < ob.y + ob.h, edge = (x === ob.x - 1 || x === ob.x + ob.w) !== (y === ob.y - 1 || y === ob.y + ob.h);
      if (!inB(plan, x, y) || (!inside && !edge)) continue;
      const k = y * Wd + x; for (let z = lo; z <= hi; z++) if (at.has(id(k, z))) return true;
    }
    return false;
  };
  const W = { touch, n: seen.size }; WALK_CACHE.set(key, { seq: evalSeq, hs, W }); return W;
}
function bigWayNotes(hs, pks) {
  const big = pks.filter(tooBig); if (!big.length || !hs) return [];
  const W = bigWay(hs), names = listNames(big.map(p => p.n)), one = big.length === 1;
  if (!W.door) return [names + (one ? ' needs' : ' need') + ' a door 2 wide'];
  const out = [], beds = W.objs.filter(o => isRest(ITEMS[o.i]) && restClass(o.w, o.h) === 'large');
  if (beds.length && !beds.some(W.reach)) out.push(names + ' can\'t get to ' + (beds.length > 1 ? 'a large rest item' : 'the ' + ITEMS[beds[0].i].n) + ': paths need to be 2 tiles wide');
  const jobs = [['Gather', /community box/i], ['Burn', /smelting furnace/i]];
  for (const [sp, re] of jobs) { const who = big.filter(p => p.s.includes(sp)); if (!who.length) continue; const cut = W.objs.filter(o => re.test(ITEMS[o.i].n) && !W.reach(o)); if (cut.length) out.push(listNames(who.map(p => p.n)) + ' can\'t get to ' + (cut.length > 1 ? cut.length + ' ' + ITEMS[cut[0].i].n.toLowerCase().replace(/(x|s|ch|sh)$/, '$1e') + 's' : 'the ' + ITEMS[cut[0].i].n) + ': paths need to be 2 tiles wide'); }
  return out;
}
function residentsSection(home) {
  const wrap = h('div', { class: 'section', 'data-home': home.key }); const list = residentsOf(home); const pks = list.map(r => PK_BY_NAME.get(r.p)).filter(Boolean);
  const refresh = () => afterResChange(home);
  wrap.append(h('div', { class: 'hrow' }, h('b', null, 'Residents'), h('span', { class: 'note' }, list.length + '/' + home.cap + (home.pf ? ' · ' + home.pf + '/floor' : '')), home.floors > 1 && list.length ? tipBtn('1F / 2F is the floor each one sleeps on: tap it to swap.') : ''));
  const chips = h('div', { class: 'reqs' });
  for (const r of list) chips.append(resChip(home, r, refresh));
  if (list.length) wrap.append(chips);
  if (home.kind === 'house') for (const t of bigWayNotes(home.hs, pks)) wrap.append(h('div', { class: 'note', style: 'color:var(--bad)', 'data-tip': 'Large Pokémon take 2×2 tiles: they need a door 2 wide and paths 2 tiles wide to reach what they use.' }, '⚠ ' + t));
  if (smallOnly(home)) { const big = pks.filter(tooBig); if (big.length) wrap.append(h('div', { class: 'note', style: 'color:var(--bad)', 'data-tip': 'Dens and the Poké Ball house take medium Pokémon or smaller: move ' + (big.length > 1 ? 'them' : 'it') + ' to a hut or bigger.' }, '⚠ Too big for a den: ' + listNames(big.map(p => p.n)))); }
  const split = splitFloors(home), reqs = split ? h('div') : trioChips(home), cv = favCoverage(home);
  if (split) { const need = kitFloorsToFurnish(home.ob); for (const f of [0, 1]) { const row = trioChips(floorOf(home, f), f); row.prepend(h('b', { class: 'note' }, floorName(f)), need.includes(f) ? furnChip(kitFurniture(home.ob, f), true) : ''); reqs.append(row); } }
  else if (home.kind === 'kit') reqs.prepend(furnChip(kitFurniture(home.ob), false));
  if (cv.total) (split ? reqs.appendChild(h('div', { class: 'reqs' })) : reqs).append(h('span', { class: 'req ' + (cv.have === cv.total ? 'ok' : ''), 'data-tip': 'The residents\' favourite kinds ' + (home.kind === 'kit' ? 'inside' : 'in the active area') + ': ' + cv.have + ' of ' + cv.total }, '♥ ' + cv.have + '/' + cv.total));
  wrap.append(reqs);
  wrap.append(cmfBlock(homeComfort(home)));
  for (const el of workLines(home.key, home)) wrap.append(el);
  wrap.append(envSection(home));
  return wrap;
}
function afterResChange(home) { refreshHomeInspector(home); if (IED.ob) iedRender(); }
function refreshHomeInspector(home) { if (home.kind === 'house') { const hs = houseById.get(home.hs.id); if (hs) selectHouse(hs); } else if (home.ob && plan.objs.has(home.ob.id)) { selection = { obj: home.ob }; showObjInspector(home.ob); } requestDraw(); if (activeTab !== 'build') renderPanel(); }
function pkRow(p, extra, onPick) {
  return h('button', { class: 'row', style: 'align-items:flex-start', onclick: onPick }, pkPic(p, 52),
    h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, p.n, ' ', p.ideal ? h('span', { class: 'env' }, p.ideal) : '', ' ', sizeBadge(p)),
      h('div', { class: 'ds', style: 'white-space:normal' }, (p.fv || []).map(f => FAVS[f]).join(' · ') + (p.fl ? ' · ' + p.fl : '')), extra ? h('div', { class: 'ds', style: 'white-space:normal;color:var(--ink)' }, extra) : ''));
}
function residentPicker(home, floor) {
  const current = residentsOf(home).map(r => PK_BY_NAME.get(r.p)).filter(Boolean), mates = splitFloors(home) && floor != null ? residentsOf(home, floor).map(r => PK_BY_NAME.get(r.p)).filter(Boolean) : current; const att = planPokemon(); let q = '';
  if (home.floors > 1 && floor != null && !floorHasRoom(home, floor)) { toast(floorName(floor) + ' is full'); return; }
  const it = home.kind === 'kit' ? ITEMS[home.ob.i] : null, E = envOf(floorOf(home, floor)), S = homeStuff(home, splitFloors(home) ? floor || 0 : null);
  modal('Add a resident' + (home.floors > 1 && floor != null ? ' · ' + floorName(floor).toLowerCase() : ''), (box) => {
    box.classList.add('wide');
    box.append(h('p', { class: 'sub' }, home.label + ' · ' + current.length + '/' + home.cap + (it && it.sm ? ' · S/M only' : '')));
    const inp = h('input', { id: 'resSearch', type: 'search', placeholder: 'Pokémon, ideal or favourite', autocomplete: 'off' });
    box.append(h('label', { class: 'search' }, icon('search'), inp)); const list = h('div', { class: 'list', style: 'margin-top:8px' }); box.append(list);
    const render = () => {
      list.textContent = '';
      let cands = PK.filter(p => p.fv && p.fv.length && !current.includes(p)); const hidden = cands.filter(p => !fitsHome(p, home)).length; cands = cands.filter(p => fitsHome(p, home));
      if (q) cands = cands.filter(p => p.n.toLowerCase().includes(q) || (p.ideal || '').toLowerCase().includes(q) || (p.fv || []).some(f => FAVS[f].toLowerCase().includes(q)));
      const scored = cands.map(p => { const hm = homeOfPokemon(p.n), k = envAxisOf(p.ideal); return { p, c: compat(p, mates), inPlan: att.has(p.n), hm, suits: !!k && !envGap(p.ideal, E.ax[k].v, E.kind), dis: disIn(p, S) }; });
      scored.sort((a, b) => (!!a.hm - !!b.hm) || (!!a.dis.length - !!b.dis.length) || (b.inPlan - a.inPlan) || (b.c.score + 2 * b.suits) - (a.c.score + 2 * a.suits) || a.p.n.localeCompare(b.p.n));
      for (const sc of scored.slice(0, 60)) {
        const bits = []; if (sc.inPlan) bits.push('In your habitats'); if (smallOnly(home) && sizeUnsure(sc.p)) bits.push('den untested'); if (sc.suits) bits.push('✓ ' + sc.p.ideal.toLowerCase() + ' here'); if (mates.length) bits.push(sc.c.shared + ' shared like' + (sc.c.shared === 1 ? '' : 's') + (!sc.c.sameEnv ? ' · ⚠ opposite of ' + listNames(sc.c.clash) : sc.c.same ? ' · same ideal' : '') + (sc.c.fc.length ? ' · ⚠ ' + FC_TXT(sc.c.fc) : '')); if (sc.hm) bits.push('now in ' + sc.hm.label); if (sc.dis.length) bits.push('⚠ dislikes ' + disShort(sc.dis) + ' here');
        list.append(pkRow(sc.p, bits.join(' · '), () => { assignResident(sc.p.n, home, floor); closeModal(); const w = moveInWarn(sc.p, home, floor); toast(sc.p.n + ' moved in' + (w ? '.' + w : '')); afterResChange(home); }));
      }
      if (!scored.length) list.append(h('p', { class: 'empty' }, 'No Pokémon match.'));
      if (hidden) list.append(h('p', { class: 'note' }, hidden + ' too big for a den: hidden'));
    };
    inp.oninput = () => { q = inp.value.trim().toLowerCase(); render(); }; render();
  }, null, null, false, 'Pokémon from your finished habitats come first, then the best housemates: shared likes, and an ideal habitat that suits the home.');
}
const trioLabel = (t) => (TRIO.find(x => x[0] === t) || [])[1] || t;
function suggLine(dp, sg) { const who = dp.res.filter(p => (p.fv || []).some(f => sg.hits.includes(f))).map(p => p.n); const bits = []; if (sg.it.tg) bits.push(trioLabel(sg.it.tg) + (sg.fill ? ' (needed)' : '')); if (isRest(sg.it)) { const [fw, fh] = footOf(sg.it); bits.push(fw + '×' + fh + (sizeGuessed(sg.it) ? '?' : '') + (sg.fits > 0 ? ', fits ' + listNames(dp.big) : sg.fits < 0 ? ', too small for ' + listNames(dp.big) : '')); } for (const f of sg.hits) bits.push((dp.present.has(f) ? '✓ ' : '') + FAVS[f]); if (sg.hate.length) bits.push('⚠ ' + listNames(sg.hate) + (sg.hate.length > 1 ? ' dislike' : ' dislikes') + ' it'); if (sg.envGood.length || sg.envBad.length) { const fx = envFxText(sg.it, dp.env); if (sg.envGood.length) bits.push(fx + ' → ' + listNames(sg.envGood)); if (sg.envBad.length) bits.push('⚠ ' + (sg.envGood.length ? '' : fx + ': ') + 'bad for ' + sg.envBad.map(n => n + ' (' + PK_BY_NAME.get(n).ideal + ')').join(', ')); } return bits.join(' · ') + (who.length ? ' · pleases ' + who.join(', ') : ''); }
const isEnvFilt = (f) => typeof f === 'string' && f.startsWith('env:'), isTagFilt = (f) => typeof f === 'string' && f.startsWith('tg:');
function decorMinimize(home, it, filt) {
  decorMini = null; closeModal(); selectItem(it.n); closeInspector();
  decorMini = { home, item: it.n, filt, scroll: $('#modalBox').scrollTop }; renderMini();
  if (innerWidth < 900) setSheet('peek');
  if (home.hs) mapView.centerOn(home.hs.x + home.hs.w / 2, home.hs.y + home.hs.h / 2);
}
function renderMini() {
  const el = $('#minidlg'); el.textContent = ''; el.hidden = !decorMini; if (!decorMini) return;
  el.append(h('div', { class: 'in', role: 'dialog', 'aria-label': 'Decorate, minimised' }, icon('sofa'), h('span', { class: 'mt' }, h('b', null, 'Place ' + decorMini.item), h('small', null, 'Decorate ' + decorMini.home.label)),
    ibtn('expand', 'Back to Decorate', decorRestore, 'sm primary'), ibtn('close', 'Close Decorate', () => { decorMini = null; renderMini(); }, 'sm')));
}
function decorRestore() {
  const m = decorMini; if (!m) return; decorMini = null; renderMini();
  let home = m.home; if (home.kind === 'house') { const hs = houseById.get(home.hs.id); if (!hs) { toast('That house changed: tap it to decorate again'); return; } home = houseHome(hs); }
  decorModal(home, m);
}
function placedFromDecor(t) {
  const m = decorMini; if (!m || !t || !t.add.some(o => ITEMS[o.i].n === m.item)) return;
  setTimeout(() => { if (decorMini === m) decorRestore(); }, 450);
}
function decorModal(home, keep) {
  const dp = decorPlan(home); let filt = null;
  modal('Decorate ' + home.label, (box) => {
    box.classList.add('wide');
    for (const p of dp.res) box.append(h('div', { class: 'card withpic' }, pkPic(p, 56), h('div', { class: 'pkbody' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, p.n), p.ideal ? h('span', { class: 'env' }, p.ideal) : '', sizeBadge(p, () => { closeModal(); afterResChange(home); decorModal(home); }), p.fl ? h('span', { class: 'note', style: 'margin-left:auto' }, 'Likes ' + p.fl.toLowerCase()) : ''),
      h('div', null, (p.fv || []).map(f => h('span', { class: 'fav ' + (dp.present.has(f) ? 'have' : 'want'), 'data-tip': dp.present.has(f) ? 'Here: ' + dp.present.get(f).join(', ') : 'Missing' }, dp.present.has(f) ? '✓' : '', FAVS[f]))), cmfLine(dp.cmf.get(p.n)))));
    if (dp.res.some(p => p.ideal)) { box.append(h('h4', { class: 'hrow' }, 'Environment', tipBtn(envHelp(home)))); box.append(envSection(home, true)); }
    box.append(h('h4', null, 'Suggested'));
    const needF = [...dp.need].filter(([f]) => !dp.present.has(f)).sort((a, b) => b[1] - a[1]).map(([f]) => f);
    const trio = comfortTrio(home).map(t => t[2] === 'Relaxation' && dp.needBig ? [t[0], false, t[2], RANK_FOOT[dp.needR] + '+'] : t), firstLack = trio.find(t => !t[1]); filt = firstLack ? 'tg:' + firstLack[2] : dp.envN.length ? 'env:' + dp.envN[0].ideal : null;
    if (keep && (keep.filt == null || trio.some(t => 'tg:' + t[2] === keep.filt) || dp.envN.some(n => 'env:' + n.ideal === keep.filt) || needF.includes(keep.filt))) filt = keep.filt;
    const chips = h('div', { class: 'cats', role: 'group', 'aria-label': 'Suggestions' }), info = h('p', { class: 'note', style: 'margin:0 0 6px' }), list = h('div', { class: 'list' }); box.append(chips, info, list);
    const render = () => {
      chips.textContent = ''; const chip = (key, ...kids) => h('button', { class: 'cat', 'aria-pressed': filt === key ? 'true' : 'false', onclick: () => { filt = key; render(); } }, ...kids);
      for (const [lb, ok, t, why] of trio) chips.append(chip('tg:' + t, (ok ? '✓ ' : '') + lb, ok ? '' : h('span', { class: 'n' }, why || 'needed')));
      for (const n of dp.envN) chips.append(chip('env:' + n.ideal, 'Make it ' + n.ideal.toLowerCase(), h('span', { class: 'n' }, listNames(n.who))));
      chips.append(chip(null, 'Best'));
      for (const f of needF) chips.append(chip(f, FAVS[f]));
      list.textContent = ''; info.textContent = ''; let arr;
      if (isEnvFilt(filt)) { const ideal = filt.slice(4); arr = dp.envFor(ideal).slice(0, 30); info.textContent = envAdvice(ideal, dp.env); }
      else if (isTagFilt(filt)) { const t = filt.slice(3); arr = dp.byTag(t).slice(0, 30); if (t === 'Relaxation' && dp.needBig) info.append(listNames(dp.big) + ' need' + (dp.big.length > 1 ? '' : 's') + ' ' + RANK_FOOT[dp.needR] + (dp.needR < 2 ? ' or bigger' : '') + ': those come first. ', tipBtn('Sizes with ? are guesses: tap a Pokémon\'s size above, or an item\'s size after you pick it, to change it.')); else info.append(dp.lack.has(t) ? 'None in range yet. ' : '✓ One in range already. ', tipBtn('Pokémon are most comfortable with a rest, a toy and a decoration item nearby.')); }
      else if (filt == null) arr = dp.sugg.slice(0, 14);
      else arr = dp.sugg.filter(x => (x.it.fv || []).includes(filt)).slice(0, 40);
      info.hidden = !info.childNodes.length;
      for (const sg of arr) {
        const cost = sg.it.m && sg.it.m.length ? sg.it.m.map(([m, n]) => n + ' ' + m).join(' · ') : (sg.it.c === 'Special' ? 'Not crafted' : '');
        list.append(h('button', { class: 'row', style: 'align-items:flex-start', onclick: () => { if (home.kind === 'house') { decorMinimize(home, sg.it, filt); return; } closeModal(); selectItem(sg.it.n); if (innerWidth < 900) setSheet('peek'); toast('Selected ' + sg.it.n); } },
          swatchEl(sg.it), h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, sg.it.n, sg.it.ep ? h('span', { class: 'ep', style: 'margin-left:6px' }, 'EP') : ''), h('div', { class: 'ds', style: 'white-space:normal;color:var(--ink)' }, suggLine(dp, sg)), cost ? h('div', { class: 'ds', style: 'white-space:normal' }, cost) : '')));
      }
      if (!arr.length) list.append(h('p', { class: 'empty' }, isEnvFilt(filt) ? 'Nothing to place: take something out.' : 'Nothing to suggest.'));
    };
    render();
    if (dp.res.length < home.cap) {
      const att = planPokemon(); const cands = PK.filter(p => p.fv && p.fv.length && !dp.res.includes(p) && !homeOfPokemon(p.n)).map(p => ({ p, c: compat(p, dp.res), inPlan: att.has(p.n) }));
      cands.sort((a, b) => (b.inPlan - a.inPlan) || (b.c.score - a.c.score)); const S0 = homeStuff(home, null), top = cands.filter(x => x.c.sameEnv && !x.c.fc.length && !disIn(x.p, S0).length).slice(0, 5);
      if (top.length) { box.append(h('h4', { class: 'hrow' }, 'Good housemates', tipBtn('Pokémon who share their likes, whose ideal habitat doesn\'t clash and who don\'t dislike anything here. Tap one to move it in.'))); const l = h('div', { class: 'list' }); for (const x of top) l.append(pkRow(x.p, (x.inPlan ? 'In your habitats · ' : '') + x.c.shared + ' shared like' + (x.c.shared === 1 ? '' : 's'), () => { assignResident(x.p.n, home); closeModal(); const w = moveInWarn(x.p, home); toast(x.p.n + ' moved in' + (w ? '.' + w : '')); afterResChange(home); })); box.append(l); }
    }
  }, null, null, false, home.kind === 'house' ? 'Ticks are favourite kinds already in the active area. Tap an item: this window folds away while you place it, then comes back.' : 'Kit interiors aren\'t on this map, so nothing is ticked here: use Decorate inside, or put these in the house in game.');
  if (keep && keep.scroll) requestAnimationFrame(() => { $('#modalBox').scrollTop = keep.scroll; });
}
