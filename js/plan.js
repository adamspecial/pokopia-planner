'use strict';
let plan = null;
const PMAX = 400;
let plansIndex = [];
const LSK = 'pokopia-planner:';

function newPlan({ name, area, w, h, fill }) {
  const p = { id: uid(), name: name || 'New area', area: area || 'Withered Wasteland', w, h, wx: null,
    ground: new Uint16Array(w * h), tl: new Map(), tz: [0], tt: [], objs: new Map(), occ: new Int32Array(w * h), up: new Map(), zs: [0], ls: [], rugs: new Map(),
    zones: [], inv: {}, res: [], roofs: [], pool: [], src: [], nextId: 1, updated: Date.now() };
  p.ls = [p.occ]; p.tl.set(0, p.ground); p.tt = [p.ground]; if (fill) { const it = BY_NAME.get(fill); if (it) p.ground.fill(it.i + 1); }
  return p;
}
function rle(arr) { const out = []; let prev = arr[0], n = 0; for (let i = 0; i < arr.length; i++) { const v = arr[i]; if (v === prev) n++; else { out.push(prev.toString(36) + (n > 1 ? '*' + n.toString(36) : '')); prev = v; n = 1; } } out.push(prev.toString(36) + (n > 1 ? '*' + n.toString(36) : '')); return out.join(','); }
function unrle(s, len, Ctor) { const a = new Ctor(len); if (!s) return a; let i = 0; for (const tok of s.split(',')) { const [v, n] = tok.split('*'); const val = parseInt(v, 36), cnt = n ? parseInt(n, 36) : 1; a.fill(val, i, Math.min(len, i + cnt)); i += cnt; if (i >= len) break; } return a; }
function serialize(p) {
  const dict = []; const dmap = new Map();
  const ref = (itemIdx) => { const name = ITEMS[itemIdx].n; if (!dmap.has(name)) { dmap.set(name, dict.length + 1); dict.push(name); } return dmap.get(name); };
  const tg = []; for (let j = 0; j < p.tz.length; j++) { const T = p.tt[j], g = new Uint16Array(T.length); let any = false; for (let k = 0; k < g.length; k++) if (T[k]) { g[k] = ref(T[k] - 1); any = true; } if (any || !p.tz[j]) tg.push([p.tz[j], rle(g)]); }
  const o = [], ints = {}, hgs = []; for (const ob of [...p.objs.values()].sort((a, b) => a.id - b.id)) { if (ob.int && intHasData(ob.int)) ints[o.length] = intOut(ob.int); if (ob.hg) hgs.push(o.length); o.push([ref(ob.i), ob.x, ob.y, ob.w, ob.h].concat(ob.r != null ? [zOf(ob), htOf(ob), ob.r & 3] : htOf(ob) !== 1 ? [zOf(ob), htOf(ob)] : ob.z ? [ob.z] : []).map(v => v.toString(36)).join('.')); }
  const u = [...(p.rugs || new Map()).values()].map(r => [ref(r.i), r.x, r.y, r.w, r.h, zOf(r)].map(v => v.toString(36)).join('.'));
  return { v: 3, ints: JSON.stringify(ints), id: p.id, name: p.name, area: p.area, w: p.w, h: p.h, dict, g: tg, o: o.join(';'), u: u.join(';'),
    z: JSON.stringify(p.zones.map(z => ({ id: z.id, kind: z.kind, x: z.x, y: z.y, w: z.w, h: z.h, name: z.name, target: z.target || null }))),
    invs: JSON.stringify(p.inv || {}), res: JSON.stringify(p.res || []), rf: JSON.stringify(p.roofs || []), pool: JSON.stringify(p.pool || []), isz: JSON.stringify(p.isz || {}), wx: p.wx || null, hg: hgs.join('.'), src: JSON.stringify((p.src || []).map(q => [q.x, q.y, q.z, ITEMS[q.i].n, q.low ? 1 : 0, q.cells.map(c => c.toString(36)).join('.')])), updated: p.updated || Date.now() };
}
function deserialize(s) {
  const w = s.w | 0, h = s.h | 0; if (!(w > 0 && h > 0 && w <= PMAX && h <= PMAX)) throw new Error('Bad plan size');
  const p = newPlan({ name: s.name, area: s.area, w, h }); p.id = s.id || uid(); p.updated = s.updated || Date.now(); p.wx = s.wx === 'rain' || s.wx === 'sun' ? s.wx : null; try { p.inv = s.invs ? JSON.parse(s.invs) : (s.inv || {}); } catch (e) { p.inv = {}; } try { p.res = s.res ? JSON.parse(s.res) : []; } catch (e) { p.res = []; } try { p.roofs = s.rf ? JSON.parse(s.rf) : []; } catch (e) { p.roofs = []; } try { p.pool = s.pool ? JSON.parse(s.pool) : []; } catch (e) { p.pool = []; } try { p.isz = s.isz ? JSON.parse(s.isz) : {}; } catch (e) { p.isz = {}; }
  const map = (s.dict || []).map(n => BY_NAME.get(n)), v2 = Array.isArray(s.g);
  const unpack = (str, T) => { const g = unrle(str, w * h, Uint16Array); for (let k = 0; k < g.length; k++) { const it = g[k] ? map[g[k] - 1] : null; T[k] = it ? it.i + 1 : 0; } };
  let elev = null;
  if (v2) { for (const e of s.g) if (Array.isArray(e) && typeof e[1] === 'string') unpack(e[1], tLayer(p, clamp(e[0] | 0, ZMIN, ZMAX))); }
  else { unpack(s.g, p.ground); elev = unrle(s.e, w * h, Uint8Array); }
  const lift = (x, y, ow, oh) => { if (!elev) return 0; let e = 0; for (let yy = y; yy < Math.min(h, y + oh); yy++) for (let xx = x; xx < Math.min(w, x + ow); xx++) e = Math.max(e, elev[yy * w + xx]); return e + 1; };
  let ints = {}; try { ints = s.ints ? JSON.parse(s.ints) : {}; } catch (e) { ints = {}; }
  const v3 = (s.v | 0) >= 3, grow = [], rugObs = [], hgs = new Set(String(s.hg || '').split('.').filter(Boolean).map(Number));
  if (s.o) s.o.split(';').forEach((tok, oi) => {
    const [d, x, y, ow, oh, oz, ot, orr] = tok.split('.').map(v => parseInt(v, 36)); const it = map[d - 1]; if (!it) return;
    const ob = { id: p.nextId++, i: it.i, x, y, w: ow || it.w, h: oh || it.h }, zz = clamp((oz || 0) + lift(x, y, ob.w, ob.h), ZMIN, ZMAX); if (zz) ob.z = zz; if (ints[oi]) ob.int = intIn(ints[oi]); if (orr >= 0 && orr <= 3) ob.r = orr; if (hgs.has(oi)) ob.hg = 1;
    if (isRug(it)) { rugObs.push({ id: ob.id, rug: 1, i: it.i, x, y, w: ob.w, h: ob.h, z: zz }); return; }
    if (elev && zz <= 0) for (let yy = y; yy < Math.min(h, y + ob.h); yy++) for (let xx = x; xx < Math.min(w, x + ob.w); xx++) if (terrAt(p, yy * w + xx, zz)) tLayer(p, zz)[yy * w + xx] = 0;
    const want = v3 ? clamp(ot || 1, 1, HMAX) : 1; if (want > 1 && fits(p, ob.x, ob.y, ob.w, ob.h, 0, zOf(ob), want)) ob.t = want;
    if (fits(p, ob.x, ob.y, ob.w, ob.h, 0, zOf(ob), htOf(ob))) { p.objs.set(ob.id, ob); stampOcc(p, ob, ob.id); if (!v3) grow.push(ob); }
  });
  for (const ob of grow) { const want = heightOf(ITEMS[ob.i], p); for (let t = want; t > 1; t--) if (fits(p, ob.x, ob.y, ob.w, ob.h, ob.id, zOf(ob), t)) { ob.t = t; stampOcc(p, ob, ob.id); break; } }
  if (s.u) for (const tok of s.u.split(';')) { const [d, x, y, rw, rh, rz] = tok.split('.').map(v => parseInt(v, 36)); const it = map[d - 1]; if (it && x >= 0 && y >= 0 && x + rw <= w && y + rh <= h) { const r = { id: p.nextId++, rug: 1, i: it.i, x, y, w: rw, h: rh }, z = Number.isFinite(rz) ? clamp(rz, ZMIN, ZMAX) : rugLevel(p, x, y, rw, rh); if (z) r.z = z; p.rugs.set(r.id, r); } }
  for (const r of rugObs) { if (!r.z) delete r.z; if (![...p.rugs.values()].some(q => zOf(q) === zOf(r) && overlaps(q, r.x, r.y, r.w, r.h))) p.rugs.set(r.id, r); }
  rugCellsToRugs(p);
  if (elev) for (let k = 0; k < elev.length; k++) { const v = p.ground[k]; if (v && elev[k]) for (let z = 1; z <= Math.min(elev[k], ZMAX); z++) if (!occAt(p, k, z)) tLayer(p, z)[k] = v; }
  try { p.zones = (typeof s.z === 'string' ? JSON.parse(s.z) : (s.z || [])).map(z => ({ ...z, id: z.id || uid() })); } catch (e) { p.zones = []; }
  try { p.src = (s.src ? JSON.parse(s.src) : []).map(([x, y, z, n, low, c]) => { const it = BY_NAME.get(n); return it && it.lq ? { id: uid(), x, y, z, i: it.i, low: !!low, cells: String(c || '').split('.').filter(Boolean).map(v => parseInt(v, 36)) } : null; }).filter(Boolean); } catch (e) { p.src = []; }
  return p;
}
function intHasData(I) { return !!(I && (I.w || I.h || I.fl || (I.f || []).some(f => f && (f.o.length || f.wp != null || f.fc != null)))); }
function intOut(I) { const nm = (i) => i != null && ITEMS[i] ? ITEMS[i].n : undefined; return { w: I.w || undefined, h: I.h || undefined, fl: I.fl || undefined, f: (I.f || []).map(f => f ? { o: f.o.map(([i, x, y, w, hh]) => w > 1 || hh > 1 ? [ITEMS[i].n, x, y, w || 1, hh || 1] : [ITEMS[i].n, x, y]), wp: nm(f.wp), fc: nm(f.fc) } : { o: [] }) }; }
function intIn(J) { const ix = (n) => { const it = n && BY_NAME.get(n); return it ? it.i : null; }; return { w: J.w || 0, h: J.h || 0, fl: J.fl || 0, f: (J.f || []).map(f => ({ o: (f.o || []).map(([n, x, y, w, hh]) => { const it = BY_NAME.get(n); return it ? (w > 1 || hh > 1 ? [it.i, x | 0, y | 0, w | 0, hh | 0] : [it.i, x | 0, y | 0]) : null; }).filter(Boolean), wp: ix(f.wp), fc: ix(f.fc) })) }; }
function cloneInt(I) { return I ? { w: I.w || 0, h: I.h || 0, fl: I.fl || 0, f: (I.f || []).map(f => f ? { o: f.o.map(a => a.slice()), wp: f.wp, fc: f.fc } : { o: [], wp: null, fc: null }) } : { w: 0, h: 0, fl: 0, f: [] }; }
function inB(p, x, y) { return x >= 0 && y >= 0 && x < p.w && y < p.h; }
function fits(p, x, y, w, h, ignoreId, z = 1, t = 1) { if (x < 0 || y < 0 || x + w > p.w || y + h > p.h || z < ZMIN || z + t - 1 > ZMAX) return false; for (let lz = z; lz < z + t; lz++) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const k = yy * p.w + xx, o = occAt(p, k, lz); if ((o && o !== ignoreId) || terrAt(p, k, lz)) return false; } return true; }
function stampOcc(p, ob, val) { for (let lz = zOf(ob); lz <= topOf(ob); lz++) { const L = layer(p, lz); for (let yy = ob.y; yy < ob.y + ob.h; yy++) for (let xx = ob.x; xx < ob.x + ob.w; xx++) L[yy * p.w + xx] = val; } }
const ZMIN = -99, ZMAX = 99, zOf = (ob) => ob.z || 0, htOf = (ob) => ob.t == null ? 1 : ob.t, topOf = (ob) => zOf(ob) + htOf(ob) - 1;
const lvTxt = (z) => z > 0 ? '+' + z : z < 0 ? '−' + -z : '0', lvNum = (z) => z < 0 ? '−' + -z : String(z);
function layer(p, z) { if (!z) return p.occ; let L = p.up.get(z); if (!L) { L = new Int32Array(p.w * p.h); p.up.set(z, L); p.zs = [0, ...p.up.keys()].sort((a, b) => a - b); p.ls = p.zs.map(v => v ? p.up.get(v) : p.occ); } return L; }
const occAt = (p, k, z) => { if (!z) return p.occ[k]; const L = p.up.get(z); return L ? L[k] : 0; };
function tLayer(p, z) { if (!z) return p.ground; let T = p.tl.get(z); if (!T) { T = new Uint16Array(p.w * p.h); p.tl.set(z, T); p.tz = [...p.tl.keys()].sort((a, b) => a - b); p.tt = p.tz.map(v => p.tl.get(v)); } return T; }
const terrAt = (p, k, z) => { if (!z) return p.ground[k]; const T = p.tl.get(z); return T ? T[k] : 0; };
function topTerr(k, p = plan) { const zs = p.tz, tt = p.tt; for (let j = zs.length - 1; j >= 0; j--) if (tt[j][k]) return zs[j]; return null; }
const surfAt = (k, p = plan) => { const t = topTerr(k, p); return t == null ? 0 : terrAt(p, k, t); };
const standZ = (k, p = plan) => { const t = topTerr(k, p); return t == null ? 1 : t + 1; };
function standOver(x, y, w, h) { let z = -Infinity; for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (inB(plan, xx, yy)) z = Math.max(z, standZ(yy * plan.w + xx)); return z === -Infinity ? 1 : z; }
function stackAt(k, p = plan) { const out = []; let last = 0; for (const L of p.ls) { const q = L[k]; if (q && q !== last) out.push(p.objs.get(q)); last = q; } return out; }
const objAtLv = (k, z) => { const o = occAt(plan, k, z); return o ? plan.objs.get(o) : null; };
let layerZ = null, layerReplace = false, hidden = new Set();
const lvShown = (key) => !hidden.has(key), obShown = (ob) => !!ob && !hidden.has(zOf(ob));
const shownStack = (k) => stackAt(k).filter(obShown);
const topShown = (k) => { const s = shownStack(k); return s.length ? s[s.length - 1] : null; };
function topTerrShown(k, cut = Infinity) { if (hidden.has('g')) return null; const zs = plan.tz, tt = plan.tt; for (let j = zs.length - 1; j >= 0; j--) { const z = zs[j]; if (z > cut || hidden.has(z)) continue; if (tt[j][k]) return z; } return null; }
function aimAt(k) { if (layerZ != null && lvShown(layerZ)) { const q = objAtLv(k, layerZ); if (q) return q; } return topShown(k); }
const lvName = (key) => key === 'g' ? 'All terrain' : key === 'r' ? 'Rugs' : 'Level ' + lvNum(key);
const layerKey = () => LSK + 'hide:' + (plan ? plan.id : '');
function loadLayers() { hidden = new Set(); layerZ = null; try { for (const v of JSON.parse(LS.get(layerKey()) || '[]')) if (v === 'g' || v === 'r' || (Number.isInteger(v) && v >= ZMIN && v <= ZMAX)) hidden.add(v); } catch (e) { } layerDot(); renderOptbar(); }
function saveLayers() { if (hidden.size) LS.set(layerKey(), JSON.stringify([...hidden])); else LS.del(layerKey()); }
function layerDot() { const b = document.getElementById('zlayers'); if (!b) return; const t = hidden.size ? 'Layers: ' + hidden.size + ' hidden (L)' : 'Layers (L)'; b.classList.toggle('dot', hidden.size > 0); b.setAttribute('data-tip', t); b.setAttribute('aria-label', t); }
function layersChanged() { layerDot(); requestDraw(); renderOptbar(); updateStatus(); if (activeTab === 'layers') renderPanel(); }
function setHidden(key, hide) {
  if (hide === hidden.has(key)) return; if (hide) hidden.add(key); else hidden.delete(key); saveLayers();
  if (hide && selection && ((selection.obj && zOf(selection.obj) === key) || (selection.rug && key === 'r'))) { selection = null; closeInspector(); }
  layersChanged();
}
function showAllLayers() { if (!hidden.size) return; hidden.clear(); saveLayers(); layersChanged(); }
function reveal(key) { if (!hidden.has(key)) return; setHidden(key, false); toast(lvName(key) + ' was hidden, so it\'s shown now'); }
function setLayerZ(z) { if (z != null) z = clamp(Math.round(+z) || 0, ZMIN, ZMAX); if (z != null && hidden.has(z)) reveal(z); if (z === layerZ) return; layerZ = z; layersChanged(); }
function workOn(z) { setLayerZ(z); toMap(); }

let tx = null; const undoStack = [], redoStack = [];
function beginTx() { if (!tx) tx = { g: new Map(), add: [], del: [], z: null, in: null, r: null, f: null, s: null }; }
function setRes(next) { beginTx(); if (!tx.r) tx.r = [plan.res || []]; plan.res = next; tx.r[1] = next; }
function setRoofs(next) { beginTx(); if (!tx.f) tx.f = [plan.roofs || []]; plan.roofs = next; tx.f[1] = next; }
function setTerr(k, z, v) { if (!v && !terrAt(plan, k, z)) return; const T = tLayer(plan, z); if (T[k] === v) return; beginTx(); const key = (z - ZMIN) * plan.w * plan.h + k; if (!tx.g.has(key)) tx.g.set(key, [T[k], v]); else tx.g.get(key)[1] = v; T[k] = v; mapView.touched(k % plan.w, (k / plan.w) | 0, 1, 1, z, z); }
let userSizes = {}; try { userSizes = JSON.parse(LS.get('pokopia-planner:sizes') || '{}') || {}; } catch (e) { userSizes = {}; }
const saveUserSizes = () => { LS.set('pokopia-planner:sizes', JSON.stringify(userSizes)); LS.set(LSK + 'sizesUpdated', String(Date.now())); scheduleSync(); };
if (Object.keys(userSizes).length && !LS.get(LSK + 'sizesUpdated')) LS.set(LSK + 'sizesUpdated', '1');
const sizeSet = (it) => userSizes[it.n] || (plan && plan.isz && plan.isz[it.n]) || null;
const sizeGuessed = (it) => !!it.sg && !sizeSet(it);
function footOf(it) { const s = sizeSet(it); return s ? [s[0], s[1]] : [it.w || 1, it.h || 1]; }
const multi = (it) => { const f = footOf(it); return f[0] > 1 || f[1] > 1; };
const heightSet = (it, p = plan) => { const u = userSizes['ht:' + it.n]; return u != null ? u : p && p.isz && p.isz['ht:' + it.n] != null ? p.isz['ht:' + it.n] : null; };
function heightOf(it, p = plan) { if (!it) return 1; if (isRug(it)) return 0; if (!tall(it)) return 1; const u = heightSet(it, p); return clamp(u != null ? u | 0 : it.ht == null ? 1 : it.ht, 1, HMAX); }
const HMAX = 20, tall = (it) => !!it && !isRug(it) && it.L !== 'g' && (!structural(it) || isDoor(it) || fenceLike(it)), heightGuessed = (it) => tall(it) && !!it.hg && heightSet(it) == null;
function addObj(i, x, y, w, h, z = 1, t) { const it = ITEMS[i]; const f = footOf(it); w = w || f[0]; h = h || f[1]; t = Math.max(1, t == null ? heightOf(it) : t); if (!fits(plan, x, y, w, h, 0, z, t)) return null; beginTx(); const ob = { id: plan.nextId++, i, x, y, w, h }; if (z) ob.z = z; if (t !== 1) ob.t = t; plan.objs.set(ob.id, ob); stampOcc(plan, ob, ob.id); touchOb(ob); tx.add.push(ob); return ob; }
const touchOb = (ob) => mapView.touched(ob.x, ob.y, ob.w, ob.h, zOf(ob), ob.rug ? zOf(ob) : topOf(ob));
const inWall = (it) => isDoor(it) || isWindow(it);
const structural = (it) => isWall(it) || inWall(it);
const lookK = (it) => it.look ? it.look.k : '';
const ROUND = new Set('grass flower crop moss lily web coral stump rock tree palm pine pokeball orb gem stone column bollard uplog pipev pipeupx cone barrel pot pan plate platter firework paintballoon blob stool bin bucket metaldrum tire tires hydrant pile cake tiers pizza cookies cups vase flowers planter pottedplant pumpkin discoball planet crystal drum fountain parasol pole bell egg apple seed drop star heart nugget cap orb gem grandclock lamp campfire bonfire basin spout steppingstones logs manhole hatch grate roofflat roofdeco roofhip skylight glass slab scaffold ironframe netting platform sandbox balloons ring knot'.split(' '));
const HANG = new Set('poster posterbolt posterwave postermtn wallclock calendar toolboard screen aircon scroll banner curtain curtainr shutter'.split(' '));
const BACKS = new Set('steps ladder awning shelf fridge tv bed sofa bench fireplace vending arcade toilet sink stove washer whiteboard infoboard board mirror servers showcase'.split(' '));
const hangs = (it) => !structural(it) && (!!it.wm || it.c === 'Poster' || it.c === 'Wallpaper' || (it.sh === 'block' && !isWall(it)) || HANG.has(lookK(it)) || (lookK(it) === 'frame' && it.c !== 'Misc'));
const turnable = (it) => !!it && !structural(it) && !isRug(it) && it.L !== 'g' && (!ROUND.has(lookK(it)) || multi(it) || hangs(it));
const solidWall = (it) => isWall(it) && !inWall(it) && !fenceLike(it);
function backSolid(ob, d, p = plan) {
  const z = zOf(ob), solid = (x, y) => { if (!inB(p, x, y)) return false; const k = y * p.w + x; if (terrAt(p, k, z)) return true; const o = occAt(p, k, z), q = o && p.objs.get(o); return !!q && solidWall(ITEMS[q.i]); };
  if (d === 0 || d === 2) { const y = d === 0 ? ob.y - 1 : ob.y + ob.h; for (let x = ob.x; x < ob.x + ob.w; x++) if (solid(x, y)) return true; return false; }
  const x = d === 3 ? ob.x - 1 : ob.x + ob.w; for (let y = ob.y; y < ob.y + ob.h; y++) if (solid(x, y)) return true; return false;
}
function faceOf(ob, p = plan) {
  if (ob.r != null) return ob.r & 3;
  const it = ITEMS[ob.i]; if (it.fb === undefined) it.fb = !!(hangs(it) || BACKS.has(lookK(it)) || BACKS.has(furnKind(it))); if (ob.w !== ob.h || !it.fb) return 0;
  for (const r of [0, 3, 1, 2]) if (backSolid(ob, r, p)) return r;
  return 0;
}
const keepObj = (n, ob) => { if (!n) return n; if (ob.int) n.int = ob.int; if (ob.r != null) n.r = ob.r; if (ob.hg) n.hg = ob.hg; return n; };
const turnFace = (r, op) => op === 'cw' ? (r + 1) & 3 : op === 'ccw' ? (r + 3) & 3 : op === 'fx' ? (r & 1 ? r ^ 2 : r) : (r & 1 ? r : r ^ 2);
function turnObj(ob, d = 1) {
  const it = ITEMS[ob.i], r = (faceOf(ob) + d + 4) & 3, swap = ob.w !== ob.h, res = reshapeObj(ob, ob.x, ob.y, swap ? ob.h : ob.w, swap ? ob.w : ob.h);
  if (!res.ob) { toast(whyNot(res.err, ob.h, ob.w, it).replace('No room here', 'Can\'t turn it')); return null; }
  res.ob.r = r; commitTx('Turn'); selection = { obj: res.ob }; showObjInspector(res.ob); return res.ob;
}
function replaces(it, q) { if (q.w > 1 || q.h > 1 || q.i === it.i) return false; const qi = ITEMS[q.i]; if (inWall(it)) return true; if (isWall(it)) return !inWall(qi); return !structural(qi); }
function terrBlock(k, z) { const v = terrAt(plan, k, z); return v ? { i: v - 1, terr: 1, k, z } : null; }
const skipId = (q, ign) => !!ign && (typeof ign === 'number' ? q.id === ign : ign.has(q.id));
function blocker(it, x, y, w, h, self, z = 1, t = 1) { if (x < 0 || y < 0 || x + w > plan.w || y + h > plan.h) return 'edge'; if (z < ZMIN || z + t - 1 > ZMAX) return z < ZMIN ? 'bottom' : 'top'; for (let lz = z; lz < z + t; lz++) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const k = yy * plan.w + xx, b = terrBlock(k, lz); if (b) return b; const o = occAt(plan, k, lz); if (!o) continue; const q = plan.objs.get(o); if (q && !skipId(q, self) && !replaces(it, q)) return q; } return null; }
function clearFor(x, y, w, h, self, z = 1, t = 1) { const gone = new Set(); for (let lz = z; lz < z + t; lz++) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const o = occAt(plan, yy * plan.w + xx, lz), q = o && plan.objs.get(o); if (q && !skipId(q, self)) gone.add(q); } for (const q of gone) delObj(q); }
function thingTop(k, ign, blocksOnly) { let z = topTerr(k); const st = stackAt(k); for (let j = st.length - 1; j >= 0; j--) { const q = st[j]; if (!q || skipId(q, ign) || (blocksOnly && !structural(ITEMS[q.i]))) continue; const qt = topOf(q); if (z == null || qt > z) z = qt; break; } return z; }
function lineAt(x, y, z = 1) { if (!inB(plan, x, y)) return null; const o = occAt(plan, y * plan.w + x, z); const q = o && plan.objs.get(o); return q && structural(ITEMS[q.i]) ? q : null; }
function wallAlong(x, y, dx, dy, z) { for (let n = 0; n < 16; n++, x += dx, y += dy) { const q = lineAt(x, y, z); if (!q) return null; if (isWall(ITEMS[q.i]) && q.w === 1 && q.h === 1) return q.i; } return null; }
function closeWall(r, keep) {
  let any = false; for (let z = zOf(r); z <= topOf(r); z++) if (closeWallAt(r, keep, z)) any = true; return any;
}
function closeWallAt(r, keep, z) {
  const runs = [], kept = (x, y) => keep && x >= keep.x && x < keep.x + keep.w && y >= keep.y && y < keep.y + keep.h && z >= zOf(keep) && z <= topOf(keep);
  const fill = (cells, wi) => { for (const [x, y] of cells) if (!kept(x, y) && !occAt(plan, y * plan.w + x, z) && !terrAt(plan, y * plan.w + x, z)) addObj(wi, x, y, 1, 1, z); };
  let done = false;
  if (r.w >= r.h) for (let y = r.y; y < r.y + r.h; y++) { if (!lineAt(r.x - 1, y, z) || !lineAt(r.x + r.w, y, z)) continue; const wi = wallAlong(r.x - 1, y, -1, 0, z) ?? wallAlong(r.x + r.w, y, 1, 0, z); if (wi == null) continue; const cells = []; for (let x = r.x; x < r.x + r.w; x++) cells.push([x, y]); runs.push([cells, wi]); done = true; }
  if (!done && r.h >= r.w) for (let x = r.x; x < r.x + r.w; x++) { if (!lineAt(x, r.y - 1, z) || !lineAt(x, r.y + r.h, z)) continue; const wi = wallAlong(x, r.y - 1, 0, -1, z) ?? wallAlong(x, r.y + r.h, 0, 1, z); if (wi == null) continue; const cells = []; for (let y = r.y; y < r.y + r.h; y++) cells.push([x, y]); runs.push([cells, wi]); }
  for (const [cells, wi] of runs) fill(cells, wi); return runs.length > 0;
}
function wallTurn(it, x, y, w, h, z) { if (w === h || !inWall(it)) return [w, h]; if (z == null) z = placeZ(it, x, y, 1, 1); if (!lineAt(x, y, z)) return [w, h]; const across = lineAt(x - 1, y, z) || lineAt(x + 1, y, z), down = lineAt(x, y - 1, z) || lineAt(x, y + 1, z); return (down && !across && w > h) || (across && !down && h > w) ? [h, w] : [w, h]; }
const isTerr = (it) => !!it && it.L === 'g' && !isRug(it);
const stacker = (it) => isTerr(it) || (isWall(it) && !inWall(it));
const leveled = (it) => !!it && it.c !== 'Kits';
let terrMode = 'stack';
function autoZ(it, x, y, w, h, ign) {
  if (x < 0 || y < 0 || x + w > plan.w || y + h > plan.h) return 1;
  const st = stacker(it); let z = -Infinity;
  if (inWall(it)) { const g = standOver(x, y, w, h); for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const q = objAtLv(yy * plan.w + xx, g); if (q && !skipId(q, ign) && isWall(ITEMS[q.i]) && !inWall(ITEMS[q.i])) return g; } }
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const b = thingTop(yy * plan.w + xx, ign, !st); z = Math.max(z, b == null ? (isTerr(it) ? 0 : 1) : b + 1); }
  return z;
}
function placeZ(it, x, y, w, h) {
  if (layerZ != null && leveled(it)) return layerZ;
  if (isTerr(it) && terrMode === 'paint') { let z = -Infinity; for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (inB(plan, xx, yy)) { const t = topTerr(yy * plan.w + xx); z = Math.max(z, t == null ? 0 : t); } return z === -Infinity ? 0 : z; }
  return autoZ(it, x, y, w, h);
}
function placeCheck(it, x, y, w, h, z, force) {
  const t = Math.max(1, heightOf(it));
  if (x < 0 || y < 0 || x + w > plan.w || y + h > plan.h) return { err: 'edge', z };
  if (z + t - 1 > ZMAX) return { err: 'top', z };
  if (z < ZMIN) return { err: 'bottom', z };
  const terr = isTerr(it), fixed = force || (layerZ != null && leveled(it)), paint = !fixed && terr && terrMode === 'paint', rep = force || (fixed && layerReplace) || paint;
  const gone = new Set(), goneT = [];
  for (let lz = z; lz < z + t; lz++) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
    const k = yy * plan.w + xx, tv = terrAt(plan, k, lz);
    if (tv) { if (terr && tv === it.i + 1) { if (w === 1 && h === 1) return { same: true, z }; continue; } if (rep) { goneT.push([k, lz]); continue; } return { err: { i: tv - 1, terr: 1, k, z: lz }, z }; }
    const o = occAt(plan, k, lz), q = o && plan.objs.get(o); if (!q || gone.has(q)) continue;
    if (!terr && q.i === it.i && q.x === x && q.y === y && q.w === w && q.h === h && zOf(q) === z) return { same: true, z };
    if (rep) { gone.add(q); continue; }
    if (terr || stacker(it)) return { err: q, z };
    const qi = ITEMS[q.i];
    if (fixed ? inWall(it) && structural(qi) && q.w === 1 && q.h === 1 : replaces(it, q)) { gone.add(q); continue; }
    return { err: q, z };
  }
  return { z, gone: [...gone], goneT };
}
let placeMiss = [], placeHit = 0;
function putObj(it, x, y, w, h, force, z) {
  if (z == null) z = placeZ(it, x, y, w, h);
  const r = placeCheck(it, x, y, w, h, z, force);
  if (r.err) { placeMiss.push({ i: it.i, x, y, w, h, z, err: r.err }); return r; }
  placeHit++; if (r.same) return r;
  for (const q of r.gone) delObj(q); for (const [k, lz] of r.goneT) setTerr(k, lz, 0);
  let ob = null; if (isTerr(it)) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) setTerr(yy * plan.w + xx, z, it.i + 1); reveal('g'); } else ob = addObj(it.i, x, y, w, h, z);
  if (ob || isTerr(it)) reveal(z); return { ob, ok: !!ob || isTerr(it) };
}
function placeReport() {
  const miss = placeMiss, hit = placeHit; placeMiss = []; placeHit = 0; if (!miss.length) return;
  const objs = miss.filter(m => m.err && (m.err.id || m.err.terr)), m = objs[0] || miss[0];
  const onItem = m.err && m.err.id && !m.err.terr && !structural(ITEMS[m.err.i]) && !stacker(ITEMS[m.i]) && layerZ == null;
  const msg = m.err === 'top' ? 'That\'s as high as it goes: level ' + ZMAX + ' is the top' : m.err === 'bottom' ? 'That\'s as low as it goes: level ' + lvNum(ZMIN) + ' is the bottom' : m.err === 'edge' ? 'No room here: off the edge' : ITEMS[m.err.i].n + ' is in the way' + (onItem ? ': items don\'t go on top of items' : m.z ? ' on level ' + lvNum(m.z) : '');
  const tail = hit ? ' · ' + miss.length + ' skipped' : '';
  if (objs.length) toast(msg + tail, 6000, { label: 'Replace', fn: () => replaceMissed(objs) }); else toast(msg + tail);
}
function replaceMissed(list) {
  placeMiss = []; placeHit = 0; let n = 0;
  for (const m of list) { const it = ITEMS[m.i]; if (!it) continue; if (isRug(it)) { for (let yy = m.y; yy < m.y + m.h; yy++) for (let xx = m.x; xx < m.x + m.w; xx++) setTerr(yy * plan.w + xx, m.z, 0); for (const r of rugsOf(plan).filter(r => zOf(r) === m.z && overlaps(r, m.x, m.y, m.w, m.h))) delRug(r); addRug(it.i, m.x, m.y, m.w, m.h, m.z); n++; continue; } if (putObj(it, m.x, m.y, m.w, m.h, true, m.z).ok) n++; }
  placeMiss = []; placeHit = 0; if (commitTx('Replace')) toast(n + ' replaced'); requestDraw();
}
function reshapeObj(ob, x, y, w, h, z = zOf(ob), t = htOf(ob)) {
  const it = ITEMS[ob.i], b = blocker(it, x, y, w, h, ob.id, z, t); if (b) return { err: b };
  delObj(ob); if (inWall(it)) closeWall(ob, { x, y, w, h, z, t }); clearFor(x, y, w, h, 0, z, t); const n = keepObj(addObj(ob.i, x, y, w, h, z, t), ob); return { ob: n };
}
function removeObj(ob) { delObj(ob); if (inWall(ITEMS[ob.i])) closeWall(ob); }
function ridersOf(ob) { const out = [], seen = new Set([ob.id]), q = [ob]; while (q.length) { const b = q.shift(), z = topOf(b) + 1; if (z > ZMAX) continue; for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) { const r = objAtLv(y * plan.w + x, z); if (r && !seen.has(r.id) && r.x >= b.x && r.y >= b.y && r.x + r.w <= b.x + b.w && r.y + r.h <= b.y + b.h) { seen.add(r.id); out.push(r); q.push(r); } } } return out; }
function carry(riders, dx, dy, dz) { for (const r of riders) { let n = null; const nz = zOf(r) + dz, t = htOf(r); if (nz >= ZMIN && nz + t - 1 <= ZMAX) n = addObj(r.i, r.x + dx, r.y + dy, r.w, r.h, nz, t); for (let z = zOf(r); !n && z + t - 1 <= ZMAX; z++) n = addObj(r.i, r.x, r.y, r.w, r.h, z, t); keepObj(n, r); } }
function freeAt(x, y, w, h, z, ids, t = 1) { if (z < ZMIN || z + t - 1 > ZMAX || x < 0 || y < 0 || x + w > plan.w || y + h > plan.h) return false; for (let lz = z; lz < z + t; lz++) for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const k = yy * plan.w + xx, o = occAt(plan, k, lz); if ((o && !ids.has(o)) || terrAt(plan, k, lz)) return false; } return true; }
function shiftLevel(ob, dz) {
  const riders = ridersOf(ob), ids = new Set([ob.id, ...riders.map(r => r.id)]), z = zOf(ob) + dz;
  if (!freeAt(ob.x, ob.y, ob.w, ob.h, z, ids, htOf(ob)) || riders.some(r => !freeAt(r.x, r.y, r.w, r.h, zOf(r) + dz, ids, htOf(r)))) { toast(z < ZMIN ? 'That\'s as low as it goes' : z + htOf(ob) - 1 > ZMAX ? 'That\'s as high as it goes' : 'Something is in the way ' + (dz > 0 ? 'above' : 'below')); return; }
  for (const r of riders) delObj(r); delObj(ob); const n = keepObj(addObj(ob.i, ob.x, ob.y, ob.w, ob.h, z, htOf(ob)), ob); carry(riders, 0, 0, dz);
  commitTx(dz > 0 ? 'Up a level' : 'Down a level'); if (n) { selection = { obj: n }; showObjInspector(n); reveal(z); }
}
function moveCtx(ob) { const ign = ob.rug ? null : new Set([ob.id, ...ridersOf(ob).map(r => r.id)]); return { ign, rest: autoZ(ITEMS[ob.i], ob.x, ob.y, ob.w, ob.h, ign) === zOf(ob) }; }
function moveLevel(ob, x, y, w, h, ctx = moveCtx(ob)) { return ctx.rest ? autoZ(ITEMS[ob.i], x, y, w, h, ctx.ign) : zOf(ob); }
function whyNot(b, w, h, it, there) { const where = there ? 'No room there' : 'No room here'; if (b === 'edge') return where + ': off the edge'; if (b === 'top' || b === 'bottom') return where + ': too ' + (b === 'top' ? 'high' : 'low'); const qi = ITEMS[b.i]; return where + ': ' + qi.n + ' is in the way' + (structural(qi) && !inWall(it) ? ' (only doors and windows go into walls)' : ''); }
function delObj(ob) { if (!plan.objs.has(ob.id)) return; beginTx(); plan.objs.delete(ob.id); stampOcc(plan, ob, 0); touchOb(ob); const ai = tx.add.indexOf(ob); if (ai >= 0) tx.add.splice(ai, 1); else tx.del.push(ob); }
function setZones(next) { beginTx(); if (!tx.z) tx.z = [plan.zones]; plan.zones = next; tx.z[1] = next; }
function commitTx(label) {
  if (!tx) return null; flowSourcesCheck(); const t = tx; tx = null;
  if (!t.g.size && !t.add.length && !t.del.length && !t.z && !t.in && !t.r && !t.f && !t.s) return null;
  t.label = label; undoStack.push(t); if (undoStack.length > 200) undoStack.shift(); redoStack.length = 0; changed(); return t;
}
function applyTx(t, dir) {
  const bi = dir < 0 ? 0 : 1;
  const N = plan.w * plan.h; for (const [key, pair] of t.g) { const z = Math.floor(key / N) + ZMIN, k = key % N; tLayer(plan, z)[k] = pair[bi]; mapView.touched(k % plan.w, (k / plan.w) | 0, 1, 1, z, z); }
  const rem = dir < 0 ? t.add : t.del, put = dir < 0 ? t.del : t.add;
  for (const ob of rem) { touchOb(ob); if (ob.rug) { plan.rugs.delete(ob.id); continue; } plan.objs.delete(ob.id); stampOcc(plan, ob, 0); }
  for (const ob of put) { touchOb(ob); if (ob.rug) { plan.rugs.set(ob.id, ob); continue; } plan.objs.set(ob.id, ob); stampOcc(plan, ob, ob.id); }
  if (t.z) plan.zones = t.z[bi];
  if (t.in) t.in[0].int = t.in[bi + 1];
  if (t.r) plan.res = t.r[bi];
  if (t.f) plan.roofs = t.f[bi];
  if (t.s) plan.src = t.s[bi];
}
function undo() { if (tx) commitTx(); const t = undoStack.pop(); if (!t) return; applyTx(t, -1); redoStack.push(t); selection = null; closeInspector(); changed(); }
function redo() { const t = redoStack.pop(); if (!t) return; applyTx(t, 1); undoStack.push(t); changed(); }
