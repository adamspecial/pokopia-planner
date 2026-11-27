'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'style') e.style.cssText = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)));
  return e;
}
const fsActive = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
async function toggleFullscreen() {
  try {
    if (fsActive()) { await (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    const el = document.documentElement; await (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  } catch (e) { toast('Full screen isn\'t available here'); }
}
function fsSync() { const b = document.getElementById('fsBtn'); if (!b) return; const on = fsActive(); b.querySelector('use').setAttribute('href', on ? '#i-shrink' : '#i-expand'); const t = on ? 'Leave full screen' : 'Full screen'; b.setAttribute('data-tip', t); b.setAttribute('aria-label', t); }
function fsInit() {
  const b = document.getElementById('fsBtn'), el = document.documentElement; if (!b) return;
  const can = !!(el.requestFullscreen || el.webkitRequestFullscreen) && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const app = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
  b.hidden = !can || app; b.onclick = toggleFullscreen;
  for (const ev of ['fullscreenchange', 'webkitfullscreenchange']) document.addEventListener(ev, () => { fsSync(); try { resize(); } catch (e) { } });
}
const icon = (id) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#i-' + id); s.append(u); return s; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TIP = { el: null, at: null, t: 0, press: 0, px: null, eat: false };
function tipShow(target) {
  const text = target.getAttribute('data-tip'); if (!text) return;
  if (!TIP.el) { TIP.el = h('div', { class: 'tipbox', role: 'tooltip', id: 'tipbox' }); document.body.append(TIP.el); }
  if (TIP.at && TIP.at !== target) TIP.at.removeAttribute('aria-expanded');
  TIP.el.textContent = text; TIP.el.hidden = false; TIP.at = target; if (target.classList.contains('tipi')) target.setAttribute('aria-expanded', 'true');
  const r = target.getBoundingClientRect(), b = TIP.el.getBoundingClientRect();
  const x = clamp(r.left + r.width / 2 - b.width / 2, 8, innerWidth - b.width - 8); let y = r.top - b.height - 8; if (y < 8) y = r.bottom + 8; y = clamp(y, 8, Math.max(8, innerHeight - b.height - 8));
  TIP.el.style.left = x + 'px'; TIP.el.style.top = y + 'px';
  clearInterval(TIP.watch); TIP.watch = setInterval(() => { if (!TIP.at || !TIP.at.isConnected) tipHide(); }, 200);
}
function tipHide() { clearTimeout(TIP.t); clearInterval(TIP.watch); if (TIP.el) TIP.el.hidden = true; if (TIP.at) TIP.at.removeAttribute('aria-expanded'); TIP.at = null; }
const tipOf = (e) => e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
const tipIsControl = (el) => el.matches('button:not(.tipi), a, input, select, textarea, summary, label');
function tipsInit() {
  const D = document, stopPress = () => { clearTimeout(TIP.press); TIP.press = 0; };
  D.addEventListener('pointerover', e => { if (e.pointerType !== 'mouse' || !S.tips) return; const t = tipOf(e); if (t === TIP.at) return; clearTimeout(TIP.t); if (!t) { if (TIP.at && !TIP.at.classList.contains('tipi')) tipHide(); return; } TIP.t = setTimeout(() => tipShow(t), 380); });
  D.addEventListener('pointerout', e => { if (e.pointerType !== 'mouse') return; const t = tipOf(e); if (t && !t.contains(e.relatedTarget)) { clearTimeout(TIP.t); if (TIP.at === t && !t.classList.contains('tipi')) tipHide(); } });
  D.addEventListener('pointerdown', e => {
    TIP.eat = false; const t = tipOf(e); if (TIP.at && TIP.at !== t) tipHide();
    if (S.tips && e.pointerType !== 'mouse' && t && !t.classList.contains('tipi')) { stopPress(); TIP.px = [e.clientX, e.clientY]; TIP.press = setTimeout(() => { TIP.press = 0; TIP.eat = true; tipShow(t); }, 450); }
  }, true);
  D.addEventListener('pointermove', e => { if (TIP.press && Math.hypot(e.clientX - TIP.px[0], e.clientY - TIP.px[1]) > 10) stopPress(); }, true);
  D.addEventListener('pointerup', stopPress, true); D.addEventListener('pointercancel', stopPress, true);
  D.addEventListener('contextmenu', e => { if (TIP.eat || TIP.press) e.preventDefault(); }, true);
  D.addEventListener('click', e => {
    if (TIP.eat) { TIP.eat = false; e.preventDefault(); e.stopPropagation(); return; }
    const t = tipOf(e); if (!t) return;
    if (t.classList.contains('tipi')) e.preventDefault(), e.stopPropagation();
    else if (tipIsControl(t) || (t.parentElement && t.parentElement.closest('button, a, label, summary'))) return;
    if (TIP.at === t) tipHide(); else tipShow(t);
  }, true);
  D.addEventListener('focusin', e => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t && t.matches(':focus-visible')) tipShow(t); });
  D.addEventListener('focusout', () => { if (TIP.at && !TIP.at.classList.contains('tipi')) tipHide(); });
  D.addEventListener('keydown', e => { if (e.key === 'Escape' && TIP.at) tipHide(); }, true);
  addEventListener('scroll', () => { if (TIP.at) tipHide(); }, true); addEventListener('resize', tipHide);
}
const ibtn = (id, label, onclick, cls, attrs) => h('button', Object.assign({ class: 'ibtn' + (cls ? ' ' + cls : ''), type: 'button', 'aria-label': label, 'data-tip': label, onclick }, attrs || {}), icon(id));
const tipBtn = (text) => text ? h('button', { class: 'tipi', type: 'button', 'aria-label': text, 'data-tip': text }, icon('info')) : '';
const fmt = (n) => Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const TOAST_MAX = 4;
function toastFlip(fn) {
  const box = $('#toasts'), was = new Map([...box.children].map(e => [e, e.getBoundingClientRect().top]));
  fn();
  if (calm()) return;
  for (const e of box.children) {
    const y = was.get(e); if (y == null) continue;
    if (e._fl) { e._fl.cancel(); e._fl = null; }
    const d = y - e.getBoundingClientRect().top;
    if (Math.abs(d) > 0.5) e._fl = e.animate([{ translate: '0 ' + d + 'px' }, { translate: '0 0' }], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
}
function toastTime(t, ms) { clearTimeout(t._t); t._end = Date.now() + ms; t._t = setTimeout(() => toastOff(t), ms); }
function toastOff(t) { if (!t || t.classList.contains('out')) return; clearTimeout(t._t); t.classList.remove('on'); t.classList.add('out'); t.inert = true; setTimeout(() => toastFlip(() => t.remove()), calm() ? 0 : 220); }
function toast(msg, ms = 2400, act, key = msg) {
  ms = Math.round(ms * (TOAST_K[S.toast] || 1));
  const box = $('#toasts'), live = () => [...box.children].filter(e => !e.classList.contains('out')); let t;
  toastFlip(() => {
    t = live().find(e => e._key === key);
    if (!t) { t = h('div', { class: 'toast' }); t._key = key; t.onpointerenter = () => clearTimeout(t._t); t.onpointerleave = () => { if (!t.classList.contains('out')) toastTime(t, Math.max(2000, t._end - Date.now())); }; }
    if (t !== box.lastElementChild) box.append(t);
    t.textContent = msg; t.classList.toggle('act', !!act);
    if (act) t.append(h('button', { type: 'button', onclick: () => { toastOff(t); act.fn(); } }, act.label));
    for (let n = live().length - TOAST_MAX; n > 0; n--) { const l = live().filter(e => e !== t); toastOff(l.find(e => !e.classList.contains('act')) || l[0]); }
  });
  void t.offsetWidth; t.classList.add('on'); toastTime(t, ms);
}
const toastDrop = (key) => { for (const t of $('#toasts').children) if (t._key === key) toastOff(t); };
const undoToast = (msg, ms = 6000) => toast(msg, ms, { label: 'Undo', fn: () => undo() }, 'undo');
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } },
};
const SET_KEY = 'pokopia-planner:settings';
const SET_DEF = { gStory: 'zero', gReach: 'rt', gSensor: 2, gSprinkler: 5, gRock: 4, gGen: 10, map3d: true, theme: 'system', accent: 'purple', motion: 'system', grid: 'all', shade: true, pics: true, faces: true, labels: true, status: true, tool: 'pan', wheel: 'zoom', tips: true, buzz: true, toast: 'normal', party: true, side: 'right', width: 'normal', sheet: 'half', start: 'last', updates: 'ask', offline: true };
const SET_OPTS = { gStory: ['zero', 'count'], gReach: ['rt', 'r', 'all'], gSensor: [2, 1], gSprinkler: [5, 4], gRock: [4, 6], gGen: [10, 7], theme: ['system', 'light', 'dark'], accent: ['purple', 'blue', 'teal', 'pink', 'orange'], motion: ['system', 'on', 'off'], grid: ['all', 'blocks', 'off'], tool: ['pan', 'select'], wheel: ['zoom', 'pan'], toast: ['short', 'normal', 'long'], side: ['right', 'left'], width: ['narrow', 'normal', 'wide'], sheet: ['half', 'full'], start: ['last', 'build'], updates: ['ask', 'auto'] };
let S = Object.assign({}, SET_DEF);
try { const v = JSON.parse(LS.get(SET_KEY) || 'null'); if (v && typeof v === 'object') for (const k in SET_DEF) if (k in v && (SET_OPTS[k] ? SET_OPTS[k].includes(v[k]) : typeof v[k] === 'boolean')) S[k] = v[k]; } catch (e) { }
const TOAST_K = { short: 0.6, normal: 1, long: 1.8 };
function shade(hex, amt) {
  let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
  let r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; } else { r *= 1 + amt; g *= 1 + amt; b *= 1 + amt; }
  return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
}
function lum(hex) { const c = hex.replace('#', ''); const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }

let DATA, ITEMS = [], BY_NAME = new Map(), GROUPS = new Map(), GROUP_OF = new Map(), HAB = [], HAB_BY_ID = new Map(), PK = [], PK_BY_NAME = new Map();
let USED_IN = new Map();
let MAT_BY_NAME = new Map(), FAVS = [], FAV_COUNT = {};
const CAT_META = {
  Terrain: { col: '#8fae6e', label: 'Terrain' }, Nature: { col: '#4f9a45', label: 'Nature' },
  Furniture: { col: '#c38e57', label: 'Furniture' }, Misc: { col: '#8b79c2', label: 'Misc' }, Outdoor: { col: '#6e985a', label: 'Outdoor' },
  Utilities: { col: '#d9a937', label: 'Utilities' }, Buildings: { col: '#7a8794', label: 'Buildings' }, Blocks: { col: '#9b9488', label: 'Blocks' },
  Rug: { col: '#d4879a', label: 'Rugs' }, Poster: { col: '#629fc4', label: 'Posters' }, Wallpaper: { col: '#b3a2d3', label: 'Wallpaper' },
  Other: { col: '#a88a6c', label: 'Other' }, Special: { col: '#d9739f', label: 'Special' }, Kits: { col: '#5668a8', label: 'Kits' },
};
const CAT_ORDER = ['Terrain', 'Nature', 'Kits', 'Furniture', 'Misc', 'Outdoor', 'Utilities', 'Buildings', 'Blocks', 'Rug', 'Special', 'Other', 'Poster', 'Wallpaper'];
const MAT_COL = [
  [/gold/i, '#d4ae48'], [/crystal|starry/i, '#bfb0ee'], [/glass|window|pane|skylight/i, '#aed8e6'], [/brick/i, '#b25a40'],
  [/concrete|asphalt|road|foundation|warning/i, '#a3a29d'], [/marble|limestone|round pillar/i, '#e2ded3'], [/iron|metal|steel|grate|pipe|scaffold|wire|chain|pulley|shutter|bronze|copper|corrugated/i, '#7f8992'],
  [/stone|cobble|aged|tiling|stepping|gravel|levee|circle/i, '#9d978d'], [/tent|cloth|carpet|felt|print|curtain|cushy|rug|mat\b/i, '#c99ab0'],
  [/hay|straw|tatami|grass flooring|puffy/i, '#c9b45f'], [/tiled roof|scale|wavy|fish-scale|tiling/i, '#7d9fb3'],
  [/wood|log|plank|lumber|path|walkway|bridge|ladder|door|gate|fenc|rail|siding|posts|partition|beam|support|hatch|pillar|steps|border/i, '#b88a58'],
  [/pop art|confectionery|pok[ée]mon center|poké ball/i, '#e2768d'], [/plaster|stylish wall|painted|antique/i, '#d9c7a6'], [/neon|cyber|digital|cube light/i, '#5fd0c0'],
];
function matColor(name, fallback) { for (const [re, c] of MAT_COL) if (re.test(name)) return c; return fallback; }
function initials(name) {
  const w = name.replace(/\(.*?\)/g, '').split(/[\s-]+/).filter(x => x && !/^(of|the|and|a)$/i.test(x));
  if (!w.length) return name.slice(0, 2);
  return (w[0][0] + (w[1] ? w[1][0] : (w[0][1] || ''))).toUpperCase();
}
const BODY_FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';
const LIQUID = new Set();
const BERRY_COL = { Leppa: '#e0443c', Chesto: '#6b4fb8', Rawst: '#3a8fd1', Aspear: '#f2d33c', Pecha: '#f28bb5', Lum: '#5cc45a' };
const SPEC_FOR_MAT = { Lumber: 'Chop', 'Iron ingot': 'Burn', 'Copper ingot': 'Burn', 'Gold ingot': 'Burn', Pokémetal: 'Burn', Glass: 'Burn', Brick: 'Burn', Paper: 'Recycle', Concrete: 'Crush', Tinkagear: 'Engineer' };

const SIZE_KNOWN_CATS = new Set(['Kits', 'Blocks', 'Wallpaper', 'Terrain', 'Rug']);
function buildIndex(d) {
  DATA = d;
  ITEMS = d.items.map((it, i) => {
    const o = Object.assign({}, it); o.i = i;
    const noSize = !o.w && !o.h;
    o.w = o.w || 1; o.h = o.h || 1; o.L = o.L || 'o';
    if (!o.col) {
      const base = CAT_META[o.c] ? CAT_META[o.c].col : '#999';
      o.col = (o.c === 'Blocks' || o.c === 'Buildings' || o.c === 'Rug' || o.c === 'Wallpaper') ? matColor(o.n, base) : base;
    }
    if (!o.sh) o.sh = o.c === 'Kits' ? 'kit' : (o.L === 'g' ? 'floor' : ((o.c === 'Blocks' || /wall|pillar/i.test(o.n)) && o.c !== 'Wallpaper' ? 'block' : 'chip'));
    if (noSize && !o.sg && o.L === 'o' && !SIZE_KNOWN_CATS.has(o.c) && o.sh !== 'block' && !isWall(o)) o.sg = 1;
    o.gl = initials(o.n);
    if (o.lk) { const q = o.lk.split(' '); o.look = { k: q[0], a: q[1], b: q[2] || null }; }
    o.key = o.n.toLowerCase();
    return o;
  });
  for (const it of ITEMS) { BY_NAME.set(it.n, it); if (it.lq) LIQUID.add(it.n); }
  for (const it of ITEMS) for (const n of it.al || []) if (!BY_NAME.has(n)) BY_NAME.set(n, it);
  for (const g in d.groups) { const set = new Set(d.groups[g].map(n => BY_NAME.get(n)).filter(Boolean).map(x => x.i)); GROUPS.set(g, set); for (const i of set) { if (!GROUP_OF.has(i)) GROUP_OF.set(i, []); GROUP_OF.get(i).push(g); } }
  HAB = d.habitats; for (const hb of HAB) HAB_BY_ID.set(hb.id, hb);
  PK = d.pokemon; for (const p of PK) { if (!PK_BY_NAME.has(p.n)) PK_BY_NAME.set(p.n, p); }
  for (const hb of HAB) for (const [tok] of hb.r) {
    const add = (i) => { if (!USED_IN.has(i)) USED_IN.set(i, []); const a = USED_IN.get(i); if (!a.includes(hb.id)) a.push(hb.id); };
    if (GROUPS.has(tok)) for (const i of GROUPS.get(tok)) add(i);
    else if (BY_NAME.has(tok)) add(BY_NAME.get(tok).i);
  }
  for (const m of d.materials) MAT_BY_NAME.set(m.n, m);
  FAVS = d.favs || [];
  for (const it of ITEMS) if (it.fv) for (const f of it.fv) FAV_COUNT[f] = (FAV_COUNT[f] || 0) + 1;
  for (const p of PK) p.hab = [];
  for (const hb of HAB) for (const n of hb.p) { const p = PK_BY_NAME.get(n); if (p) p.hab.push(hb.id); }
}

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
const IED = { rot: false, ob: null, floor: 0, tool: 'place', item: null, picked: null, hover: null, stroke: null, drag: null, sel: null, filt: null, q: '', cat: 'Furniture', cs: 32, ox: 0, oy: 0 };
const indoorOK = (it) => !!it && it.L === 'o' && it.c !== 'Kits';
const decorOK = (it) => indoorOK(it) && !isWall(it) && !isDoor(it) && it.c !== 'Buildings' && it.c !== 'Blocks' && (it.c !== 'Nature' || it.n === 'Smooth rock');
function iedHome() { return kitHome(IED.ob); }
function interiorEditor(ob) {
  if (!ob || !plan.objs.has(ob.id) || !ITEMS[ob.i].cap) return;
  closeModal(); toastDrop('undo'); if (IED.ob && IED.ob !== ob) iedClose();
  Object.assign(IED, { ob, floor: 0, picked: null, hover: null, sel: null, filt: null, drag: null });
  if (IED.tool !== 'erase' && IED.tool !== 'move') IED.tool = 'place';
  if (!indoorOK(IED.item)) { const dp = decorPlan(iedHome(), 0); const s0 = dp.sugg.find(x => decorOK(x.it)); IED.item = s0 ? s0.it : (BY_NAME.get('Wooden bed') || ITEMS.find(decorOK)); }
  const root = $('#ied'); root.textContent = ''; root.hidden = false;
  const cvs = h('canvas', { id: 'iedCv', 'aria-label': 'Room layout. Click to place, right-click to remove.' });
  cvs.addEventListener('pointerdown', iedDown); cvs.addEventListener('pointermove', iedMove); cvs.addEventListener('pointerup', iedUp); cvs.addEventListener('pointercancel', iedUp);
  cvs.addEventListener('pointerleave', () => { IED.hover = null; iedDraw(); }); cvs.addEventListener('contextmenu', e => e.preventDefault());
  root.append(h('div', { class: 'win', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Decorate inside' },
    h('div', { class: 'whead', id: 'iedHead' }),
    h('div', { class: 'wbody' },
      h('div', { class: 'stage' }, h('div', { class: 'canvasbox' }, cvs), h('div', { class: 'foot', id: 'iedFoot' })),
      h('div', { class: 'side' }, h('div', { id: 'iedRes' }), h('div', { id: 'iedFind' })))));
  iedRefresh(); iedFind();
  setTimeout(iedDraw, 30);
}
function iedClose() {
  if (!IED.ob) return; if (IED.picked) iedCancelPick(); else if (IED.stroke) iedEnd();
  const ob = IED.ob; IED.ob = null; const root = $('#ied'); root.hidden = true; root.textContent = '';
  if (plan.objs.has(ob.id)) { selection = { obj: ob }; showObjInspector(ob); }
  requestDraw(); if (activeTab !== 'build') renderPanel();
}
function iedRefresh() { if (!IED.ob) return; if (!plan.objs.has(IED.ob.id)) { iedClose(); return; } const ki = kitInfo(IED.ob); if (IED.floor >= ki.fl) IED.floor = 0; iedHeader(); iedSide(); iedFoot(); iedDraw(); }
const iedRender = iedRefresh;
function iedEnsure() { const I = IED.ob.int, ki = kitInfo(IED.ob); while (I.f.length < ki.fl) I.f.push({ o: [], wp: null, fc: null }); for (let k = 0; k < I.f.length; k++) if (!I.f[k]) I.f[k] = { o: [], wp: null, fc: null }; }
function iedBegin() { if (IED.stroke) return; IED.stroke = { before: IED.ob.int || null, changed: false }; IED.ob.int = cloneInt(IED.ob.int); iedEnsure(); }
function iedEnd() {
  const st = IED.stroke; if (!st) return; IED.stroke = null;
  if (!st.changed) { if (st.before) IED.ob.int = st.before; else delete IED.ob.int; return; }
  beginTx(); tx.in = [IED.ob, st.before, IED.ob.int]; commitTx('Decorate inside'); iedRefresh();
}
function iedFloorData(f = IED.floor) { return IED.ob.int && IED.ob.int.f && IED.ob.int.f[f] ? IED.ob.int.f[f] : intFloor(IED.ob, f); }
const aw = (a) => a[3] || 1, ah = (a) => a[4] || 1;
const covers = (a, x, y) => x >= a[1] && y >= a[2] && x < a[1] + aw(a) && y < a[2] + ah(a);
function iedAt(x, y) { return iedFloorData().o.findIndex(a => covers(a, x, y)); }
function iedPlaceSize(i) { const f = footOf(ITEMS[i]); return IED.rot && f[0] !== f[1] ? [f[1], f[0]] : f; }
function iedFree(x, y, w, hh, skip) { const ki = kitInfo(IED.ob); if (x < 0 || y < 0 || x + w > ki.w || y + hh > ki.h) return false; return !iedFloorData().o.some(a => a !== skip && a[1] < x + w && x < a[1] + aw(a) && a[2] < y + hh && y < a[2] + ah(a)); }
function iedPut(x, y, i, size) { const [w, hh] = size || iedPlaceSize(i); if (!iedFree(x, y, w, hh)) return false; iedBegin(); const F = IED.ob.int.f[IED.floor]; F.o.push(w > 1 || hh > 1 ? [i, x, y, w, hh] : [i, x, y]); IED.stroke.changed = true; return true; }
function iedTake(x, y) { iedBegin(); const F = IED.ob.int.f[IED.floor]; const k = F.o.findIndex(a => covers(a, x, y)); if (k < 0) return null; const [a] = F.o.splice(k, 1); IED.stroke.changed = true; return a; }
function iedRotateSel() { const k = iedAt(IED.sel[0], IED.sel[1]); if (k < 0) return; const a = iedFloorData().o[k]; if (aw(a) === ah(a)) return; if (!iedFree(a[1], a[2], ah(a), aw(a), a)) { toast('Not enough room to turn it'); return; } iedBegin(); const b = IED.ob.int.f[IED.floor].o.find(q => q[1] === a[1] && q[2] === a[2]); const w = aw(b), hh = ah(b); b[3] = hh; b[4] = w; IED.stroke.changed = true; IED.sel = [b[1], b[2]]; iedEnd(); }
function iedCancelPick() { const st = IED.stroke; IED.stroke = null; IED.picked = null; if (st) { if (st.before) IED.ob.int = st.before; else delete IED.ob.int; } iedFoot(); iedDraw(); }
function iedSetTool(t) { if (IED.picked && t !== 'move') iedCancelPick(); IED.tool = t; IED.sel = null; iedHeader(); iedFoot(); iedDraw(); }
function iedSetFloor(f) { if (IED.drag) return; IED.floor = f; IED.sel = null; IED.filt = null; iedHeader(); iedSide(); iedFoot(); iedDraw(); iedFind(); }
function iedPick(it) { IED.item = it; if (IED.picked) iedCancelPick(); IED.tool = 'place'; IED.sel = null; iedHeader(); iedFoot(); iedDraw(); iedMarkPicked(); }
function iedMarkPicked() { for (const b of $$('#ied .side .row[data-item]')) b.setAttribute('aria-pressed', IED.item && +b.dataset.item === IED.item.i ? 'true' : 'false'); }
function iedCell(e) { const r = e.currentTarget.getBoundingClientRect(); const x = Math.floor((e.clientX - r.left - IED.ox) / IED.cs), y = Math.floor((e.clientY - r.top - IED.oy) / IED.cs); const ki = kitInfo(IED.ob); return x >= 0 && y >= 0 && x < ki.w && y < ki.h ? [x, y] : null; }
function iedDown(e) {
  e.preventDefault(); const cell = iedCell(e); if (!cell) return; const [x, y] = cell; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { }
  const occ = iedAt(x, y) >= 0;
  if (e.button === 2 || IED.tool === 'erase') { if (IED.picked) return; if (occ) iedTake(x, y); IED.drag = 'erase'; IED.sel = null; iedDraw(); return; }
  if (IED.tool === 'move') {
    if (IED.picked) { if (iedPut(x, y, IED.picked[0], [aw(IED.picked), ah(IED.picked)])) { IED.picked = null; iedEnd(); } else toast('Not enough room there'); }
    else if (occ) { IED.picked = iedTake(x, y); IED.sel = null; }
    iedFoot(); iedDraw(); return;
  }
  if (occ) { const a = iedFloorData().o[iedAt(x, y)]; IED.sel = [a[1], a[2]]; iedFoot(); iedDraw(); return; }
  if (!IED.item) { toast('Pick an item first'); return; }
  IED.sel = null; if (!iedPut(x, y, IED.item.i)) { const [w, hh] = iedPlaceSize(IED.item.i); toast('No room for its ' + w + '×' + hh + ' size here'); return; } IED.drag = 'place'; iedFoot(); iedDraw();
}
function iedMove(e) {
  const cell = iedCell(e); const moved = String(IED.hover) !== String(cell); IED.hover = cell;
  if (IED.drag && cell) { const [x, y] = cell; if (IED.drag === 'erase') { if (iedAt(x, y) >= 0) iedTake(x, y); } else if (IED.drag === 'place') iedPut(x, y, IED.item.i); }
  if (moved || IED.drag) iedDraw();
}
function iedUp() { if (IED.drag) { IED.drag = null; iedEnd(); } }
function iedUndo() { const t = undoStack[undoStack.length - 1]; if (IED.stroke) return; if (!t || !t.in || t.in[0] !== IED.ob) { toast('Nothing to undo here'); return; } undo(); iedAfterHistory(); }
function iedRedo() { const t = redoStack[redoStack.length - 1]; if (IED.stroke) return; if (!t || !t.in || t.in[0] !== IED.ob) return; redo(); iedAfterHistory(); }
function iedAfterHistory() { if (!plan.objs.has(IED.ob.id)) { iedClose(); return; } IED.sel = null; iedRefresh(); iedFind(); }
function iedKey(e) {
  if ($('#modal').classList.contains('open')) return;
  if (e.target.matches('input, textarea, select')) { if (e.key === 'Escape') e.target.blur(); return; }
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? iedRedo() : iedUndo(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); iedRedo(); return; }
  if (e.key === 'Escape') { if (IED.picked) iedCancelPick(); else if (IED.sel) { IED.sel = null; iedFoot(); iedDraw(); } else iedClose(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (k === 'r') { if (IED.sel) iedRotateSel(); else { IED.rot = !IED.rot; iedFoot(); iedDraw(); } return; }
  if (k === 'b' || k === 'p') iedSetTool('place'); else if (k === 'm' || k === 'v') iedSetTool('move'); else if (k === 'e') iedSetTool('erase');
  else if ((k === '1' || k === '2') && kitInfo(IED.ob).fl > 1) iedSetFloor(+k - 1);
  else if ((e.key === 'Delete' || e.key === 'Backspace') && IED.sel) { iedTake(IED.sel[0], IED.sel[1]); IED.sel = null; iedEnd(); }
}
function iedDraw() {
  const cvs = $('#iedCv'); if (!cvs || !IED.ob) return; const ki = kitInfo(IED.ob), F = iedFloorData();
  const box = cvs.parentElement.getBoundingClientRect(); if (!box.width) return; const wall = 0.55;
  const cs = Math.max(12, Math.min(64, Math.floor(Math.min((box.width - 20) / (ki.w + wall * 2), (box.height - 20) / (ki.h + wall * 2)))));
  const Wc = Math.round((ki.w + wall * 2) * cs), Hc = Math.round((ki.h + wall * 2) * cs), d = Math.min(devicePixelRatio || 1, 2);
  if (cvs.width !== Wc * d || cvs.height !== Hc * d) { cvs.width = Wc * d; cvs.height = Hc * d; cvs.style.width = Wc + 'px'; cvs.style.height = Hc + 'px'; }
  const c = cvs.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, Wc, Hc);
  IED.cs = cs; IED.ox = Math.round(wall * cs); IED.oy = Math.round(wall * cs); const ox = IED.ox, oy = IED.oy;
  const wp = F.wp != null ? ITEMS[F.wp] : null; c.fillStyle = wp ? (wp.look ? groundTile(c, wp, cs, ox, oy) : wp.col) : '#a8927a'; roundRect(c, 0, 0, Wc, Hc, 8); c.fill();
  c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(ox - 2, oy - 2, ki.w * cs + 4, ki.h * cs + 4);
  const fc = F.fc != null ? ITEMS[F.fc] : null;
  for (let y = 0; y < ki.h; y++) for (let x = 0; x < ki.w; x++) { const px = ox + x * cs, py = oy + y * cs; if (fc) drawGroundCell(c, fc, px, py, cs); else { c.fillStyle = (x + y) % 2 ? '#ead6b3' : '#e4cda5'; c.fillRect(px, py, cs + 0.5, cs + 0.5); } }
  c.strokeStyle = 'rgba(60,40,20,.12)'; c.lineWidth = 1; c.beginPath();
  for (let x = 0; x <= ki.w; x++) { c.moveTo(ox + x * cs + 0.5, oy); c.lineTo(ox + x * cs + 0.5, oy + ki.h * cs); }
  for (let y = 0; y <= ki.h; y++) { c.moveTo(ox, oy + y * cs + 0.5); c.lineTo(ox + ki.w * cs, oy + y * cs + 0.5); }
  c.stroke();
  c.font = `700 ${Math.max(9, Math.min(12, cs * 0.3))}px ${BODY_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (IED.floor === 0) { const dx = Math.floor((ki.w - 1) / 2); c.fillStyle = '#6b4a2b'; c.fillRect(ox + dx * cs + 2, oy + ki.h * cs + 1, cs - 4, oy - 2); c.fillStyle = '#fff'; if (cs >= 22) c.fillText('Door', ox + dx * cs + cs / 2, oy + ki.h * cs + oy / 2 + 1); }
  else { c.fillStyle = 'rgba(255,255,255,.9)'; c.fillText('Upstairs', Wc / 2, oy / 2 + 1); }
  for (const a of F.o) { const [i, x, y] = a; if (x < ki.w && y < ki.h && ITEMS[i]) drawPicItem(c, ITEMS[i], ox + x * cs, oy + y * cs, cs, Math.min(aw(a), ki.w - x), Math.min(ah(a), ki.h - y), cs >= 30); }
  if (IED.sel) { const k = iedAt(IED.sel[0], IED.sel[1]); if (k >= 0) { const a = F.o[k]; c.strokeStyle = theme.accent; c.lineWidth = 3; c.strokeRect(ox + a[1] * cs + 1.5, oy + a[2] * cs + 1.5, aw(a) * cs - 3, ah(a) * cs - 3); } }
  if (IED.hover) {
    const [hx, hy] = IED.hover, px = ox + hx * cs, py = oy + hy * cs, k = iedAt(hx, hy), occ = k >= 0;
    const ghost = IED.tool === 'move' && IED.picked ? ITEMS[IED.picked[0]] : IED.tool === 'place' && !occ ? IED.item : null;
    const [gw, gh] = IED.tool === 'move' && IED.picked ? [aw(IED.picked), ah(IED.picked)] : ghost ? iedPlaceSize(ghost.i) : occ ? [aw(F.o[k]), ah(F.o[k])] : [1, 1];
    const gx = occ && !ghost ? F.o[k][1] : hx, gy = occ && !ghost ? F.o[k][2] : hy, fitsHere = ghost ? iedFree(hx, hy, gw, gh, IED.picked) : true;
    if (ghost && fitsHere) { c.globalAlpha = 0.55; drawPicItem(c, ghost, px, py, cs, gw, gh, false); c.globalAlpha = 1; }
    c.strokeStyle = IED.tool === 'erase' ? theme.bad : (ghost && !fitsHere) ? theme.bad : theme.accent; c.lineWidth = 2; c.strokeRect(ox + gx * cs + 1, oy + gy * cs + 1, gw * cs - 2, gh * cs - 2);
  }
}
function iedHeader() {
  const hd = $('#iedHead'); if (!hd) return; hd.textContent = ''; const ob = IED.ob, it = ITEMS[ob.i], ki = kitInfo(ob), home = iedHome();
  hd.append(swatchEl(it, 'swatch big'), h('div', { class: 'ttl' }, h('h2', { style: 'margin:0' }, 'Inside: ' + it.n.replace(/ kit$/, '')),
    h('div', { class: 'sub hrow', style: 'margin:0' }, ki.w + '×' + ki.h + (ki.fl > 1 ? ' ×2 floors' : '') + (ki.est ? '?' : '') + ' · ' + it.cap + ' Pokémon' + (ki.pf ? ', ' + ki.pf + '/floor' : '') + (ki.small ? ' · S/M' : ''), ki.est ? tipBtn('The room size is an estimate: set it with Room size to match your house in game.') : '')));
  const ctr = h('div', { class: 'ctrls' });
  if (ki.fl > 1) { const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Floor' }); for (let f = 0; f < ki.fl; f++) { const n = residentsOf(home, f).length; seg.append(h('button', { 'aria-pressed': IED.floor === f ? 'true' : 'false', 'aria-label': floorName(f), 'data-tip': floorName(f) + ' (key ' + (f + 1) + ')', onclick: () => iedSetFloor(f) }, (f + 1) + 'F', h('span', { class: 'n' }, ' ' + n + (ki.pf ? '/' + ki.pf : '')))); } ctr.append(seg); }
  const tools = h('div', { class: 'seg', role: 'group', 'aria-label': 'Tool' });
  for (const [t, lb, key, ic] of [['place', 'Place', 'B', 'brush'], ['move', 'Move', 'M', 'move'], ['erase', 'Erase', 'E', 'erase']]) tools.append(h('button', { class: 'segi', 'aria-pressed': IED.tool === t ? 'true' : 'false', 'aria-label': lb, 'data-tip': lb + ' (' + key + ')', onclick: () => iedSetTool(t) }, icon(ic)));
  ctr.append(tools);
  const top = undoStack[undoStack.length - 1], nxt = redoStack[redoStack.length - 1];
  ctr.append(ibtn('undo', 'Undo (Ctrl+Z)', iedUndo, 'sm', { disabled: !(top && top.in && top.in[0] === ob) }), ibtn('redo', 'Redo (Ctrl+Y)', iedRedo, 'sm', { disabled: !(nxt && nxt.in && nxt.in[0] === ob) }),
    ibtn('resize', 'Room size', iedSizeDialog, 'sm'), ibtn('trash', 'Clear ' + (ki.fl > 1 ? 'this floor' : 'the room'), iedClearFloor, 'sm danger'));
  hd.append(ctr, h('button', { class: 'close', 'aria-label': 'Close', 'data-tip': 'Close (Esc)', onclick: iedClose }, icon('close')));
}
function iedFoot() {
  const el = $('#iedFoot'); if (!el || !IED.ob) return; el.textContent = ''; const ki = kitInfo(IED.ob);
  const favTxt = (it) => (it.fv || []).map(f => FAVS[f]).join(' · ');
  if (IED.picked) { const it = ITEMS[IED.picked[0]]; el.append(swatchEl(it), h('span', { class: 'grow hrow' }, h('b', null, 'Moving ' + it.n), tipBtn('Tap an empty tile' + (ki.fl > 1 ? ' on either floor' : '') + '. Esc puts it back.'))); return; }
  if (IED.sel) { const k = iedAt(IED.sel[0], IED.sel[1]); if (k >= 0) { const a = iedFloorData().o[k], it = ITEMS[a[0]]; el.append(swatchEl(it), h('span', { class: 'grow' }, h('b', null, it.n), h('span', { class: 'note' }, ' · ' + aw(a) + '×' + ah(a)), it.fv ? h('span', { class: 'note' }, ' · ' + favTxt(it)) : ''), aw(a) !== ah(a) ? ibtn('rotate', 'Rotate (R)', iedRotateSel, 'sm') : '', ibtn('resize', 'Size', () => itemSizeDialog(it), 'sm'), ibtn('copy', 'Place more', () => iedPick(it), 'sm'), ibtn('trash', 'Remove', () => { iedTake(IED.sel[0], IED.sel[1]); IED.sel = null; iedEnd(); }, 'sm danger')); return; } IED.sel = null; }
  if (IED.tool === 'place' && IED.item) { const it = IED.item, [w, hh] = iedPlaceSize(it.i); el.append(swatchEl(it), h('span', { class: 'grow' }, h('b', null, it.n), it.fv ? h('span', { class: 'note' }, ' · ' + favTxt(it)) : ''), h('span', { class: 'pill', style: 'box-shadow:none', 'data-tip': sizeGuessed(it) ? 'Guessed size' : 'Size' }, w + '×' + hh + (sizeGuessed(it) ? '?' : '')), w !== hh ? ibtn('rotate', 'Rotate (R)', () => { IED.rot = !IED.rot; iedFoot(); iedDraw(); }, 'sm') : '', ibtn('resize', 'Change its size', () => itemSizeDialog(it), 'sm'), tipBtn('Tap or drag to place; right-click removes.')); return; }
  el.append(h('span', { class: 'note' }, IED.tool === 'erase' ? 'Tap or drag over items to remove them' : 'Tap an item, then where it goes' + (ki.fl > 1 ? ' (either floor)' : '')));
}
function iedSuggest(home, f) { const dp = decorPlan(home, f), bt = dp.byTag, ef = dp.envFor; dp.sugg = dp.sugg.filter(x => decorOK(x.it)); dp.byTag = (t) => bt(t, decorOK); dp.envFor = (e) => ef(e, decorOK); return dp; }
function iedSide() {
  const el = $('#iedRes'); if (!el) return; const sc = el.parentElement.scrollTop; el.textContent = '';
  const ob = IED.ob, ki = kitInfo(ob), home = iedHome(), f = ki.fl > 1 ? IED.floor : null; const list = residentsOf(home, f);
  const onChange = () => afterResChange(home);
  el.append(h('div', { class: 'hrow' }, h('h4', { style: 'margin:0' }, 'Residents' + (ki.fl > 1 ? ' · ' + (IED.floor + 1) + 'F' : '')), h('span', { class: 'note' }, list.length + '/' + (ki.pf || home.cap))));
  const chips = h('div', { class: 'reqs' }); for (const r of list) chips.append(resChip(home, r, onChange));
  const room = ki.fl > 1 ? floorHasRoom(home, IED.floor) : residentsOf(home).length < home.cap;
  if (room) chips.append(ibtn('useradd', 'Add resident', () => residentPicker(home, f == null ? undefined : IED.floor), 'sm'));
  el.append(chips);
  if (ki.fl > 1) { const other = residentsOf(home, 1 - IED.floor); if (other.length) el.append(h('div', { class: 'note hrow' }, (2 - IED.floor) + 'F:', other.map(r => pkTag(r.p, 20)))); }
  const split = splitFloors(home), fh = floorOf(home, f), n = kitFurniture(ob, split ? IED.floor : 0), dp = iedSuggest(home, f), cv = favCoverage(home);
  el.append(h('div', { class: 'reqs' }, furnChip(n, split),
    comfortTrio(fh).map(([lb, ok, t]) => h('button', { class: 'req ' + (ok ? 'ok' : ''), 'aria-pressed': IED.filt === 'tg:' + t ? 'true' : 'false', 'data-tip': TRIO_TIP[lb] + (ok ? ' is here.' : ' isn\'t here yet.') + ' Tap to list them. Pokémon are most comfortable with a rest, a toy and a decoration item nearby.', onclick: () => { IED.filt = IED.filt === 'tg:' + t ? null : 'tg:' + t; iedSide(); } }, (ok ? '✓ ' : '') + lb)),
    largeRestChip(home, f), cv.total ? h('span', { class: 'req ' + (cv.have === cv.total ? 'ok' : ''), 'data-tip': 'The residents\' favourite kinds inside: ' + cv.have + ' of ' + cv.total }, '♥ ' + cv.have + '/' + cv.total) : ''));
  if (!dp.res.length && !isTagFilt(IED.filt)) { el.append(h('p', { class: 'hint' }, 'Add residents for suggestions.')); return; }
  for (const p of dp.res) el.append(h('div', { class: 'card', style: 'margin:6px 0' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, p.n), p.ideal ? h('span', { class: 'env' }, p.ideal) : '', p.fl ? h('span', { class: 'note', style: 'margin-left:auto' }, 'Likes ' + p.fl.toLowerCase()) : ''),
    h('div', null, (p.fv || []).map(fv => dp.present.has(fv) ? h('span', { class: 'fav have', 'data-tip': 'Here: ' + dp.present.get(fv).join(', ') }, '✓', FAVS[fv]) : h('button', { class: 'fav want', 'aria-pressed': IED.filt === fv ? 'true' : 'false', onclick: () => { IED.filt = IED.filt === fv ? null : fv; iedSide(); } }, FAVS[fv]))), cmfLine(dp.cmf.get(p.n))));
  el.append(h('h4', { class: 'hrow', style: 'margin:12px 0 0' }, 'Environment', ki.fl > 1 ? h('span', { class: 'note' }, ki.kind === 'ow' ? 'ground floor' : split ? floorName(IED.floor).toLowerCase() + ' only' : 'both floors') : '', tipBtn(envHelp(home))), envBlock(fh));
  if (dp.envN.length) el.append(h('div', { class: 'reqs' }, dp.envN.map(n => h('button', { class: 'req', 'aria-pressed': IED.filt === 'env:' + n.ideal ? 'true' : 'false', onclick: () => { IED.filt = IED.filt === 'env:' + n.ideal ? null : 'env:' + n.ideal; iedSide(); } }, 'Make it ' + n.ideal.toLowerCase()))));
  const missing = new Set(); for (const p of dp.res) for (const fv of p.fv || []) if (!dp.present.has(fv)) missing.add(fv); const tagF = isTagFilt(IED.filt) ? IED.filt.slice(3) : null, envF = isEnvFilt(IED.filt) ? IED.filt.slice(4) : null;
  const envFix = dp.envN.some(n => dp.envFor(n.ideal).length);
  el.append(h('div', { class: 'hrow', style: 'margin:14px 0 4px' }, h('h4', { style: 'margin:0' }, tagF ? trioLabel(tagF) : envF ? 'Make it ' + envF.toLowerCase() : IED.filt != null ? FAVS[IED.filt] : 'Suggested'),
    missing.size || dp.lack.size || dp.needBig || envFix ? h('button', { class: 'btn sm primary', style: 'margin-left:auto', 'data-tip': 'Places one item for each missing favourite, a rest, toy or decoration if one is missing, and items that bring light, warmth or humidity to what they like, along the walls. It leaves out anything that would spoil it for them.', onclick: iedAutoPlace }, icon('leaf'), 'Auto-place') : h('span', { class: 'note', style: 'margin-left:auto' }, '✓ All favourites')));
  if (envF) el.append(h('p', { class: 'note', style: 'margin:0 0 6px' }, envAdvice(envF, dp.env)));
  const arr = tagF ? dp.byTag(tagF).slice(0, 30) : envF ? dp.envFor(envF).slice(0, 30) : IED.filt == null ? dp.sugg.slice(0, 10) : dp.sugg.filter(x => (x.it.fv || []).includes(IED.filt)).slice(0, 30);
  const l = h('div', { class: 'list' });
  for (const sg of arr) l.append(iedItemRow(sg.it, suggLine(dp, sg)));
  if (!arr.length) l.append(h('p', { class: 'empty' }, envF ? 'Nothing to place: take something out.' : 'Nothing fits indoors.'));
  el.append(l);
  el.parentElement.scrollTop = sc; iedMarkPicked();
}
function iedItemRow(it, line) {
  const cost = it.m && it.m.length ? it.m.map(([m, k]) => k + ' ' + m).join(' · ') : (it.c === 'Special' ? 'Not crafted' : '');
  return h('button', { class: 'row', 'data-item': it.i, 'data-drag': 'item:' + it.n, 'aria-pressed': IED.item === it ? 'true' : 'false', style: 'align-items:flex-start', onclick: () => iedPick(it) }, swatchEl(it),
    h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, it.n, it.ep ? h('span', { class: 'ep', style: 'margin-left:6px' }, 'EP') : ''), line ? h('div', { class: 'ds', style: 'white-space:normal;color:var(--ink)' }, line) : '', cost ? h('div', { class: 'ds', style: 'white-space:normal' }, cost) : ''));
}
const IED_CATS = ['Furniture', 'Misc', 'Utilities', 'Outdoor', 'Other', 'Special', 'Poster', 'Nature'];
function iedFind() {
  const el = $('#iedFind'); if (!el) return; el.textContent = ''; const F = iedFloorData();
  el.append(h('h4', null, 'Find any item'));
  const inp = h('input', { type: 'search', id: 'iedQ', placeholder: 'Search items or favourites', value: IED.q, autocomplete: 'off' });
  const cats = h('div', { class: 'cats' }), res = h('div', { class: 'list' });
  const render = () => {
    cats.textContent = ''; for (const c of IED_CATS) cats.append(h('button', { class: 'cat', 'aria-pressed': IED.cat === c ? 'true' : 'false', onclick: () => { IED.cat = c; render(); } }, CAT_META[c] ? CAT_META[c].label : c));
    res.textContent = ''; const q = IED.q.toLowerCase();
    let arr = ITEMS.filter(it => indoorOK(it) && (q ? (it.n.toLowerCase().includes(q) || (it.fv || []).some(v => FAVS[v].toLowerCase().includes(q))) : it.c === IED.cat));
    arr.sort((a, b) => a.n.localeCompare(b.n)); const more = arr.length - 60;
    for (const it of arr.slice(0, 60)) res.append(iedItemRow(it, (it.fv || []).map(v => FAVS[v]).join(' · ')));
    if (!arr.length) res.append(h('p', { class: 'empty' }, 'Nothing matches.')); else if (more > 0) res.append(h('p', { class: 'note' }, '+' + more + ' more: type to narrow'));
    cats.style.display = q ? 'none' : ''; iedMarkPicked();
  };
  inp.oninput = () => { IED.q = inp.value.trim(); render(); };
  el.append(h('label', { class: 'search' }, icon('search'), inp), cats, res); render();
  const wps = ITEMS.filter(it => it.c === 'Wallpaper').sort((a, b) => a.n.localeCompare(b.n)), fcs = ITEMS.filter(it => it.c === 'Rug' || (it.c === 'Blocks' && it.L === 'g')).sort((a, b) => a.n.localeCompare(b.n));
  const sel = (id, label, opts, val, key) => { const s = h('select', { id }, h('option', { value: '' }, 'As built'), opts.map(it => h('option', { value: it.i, selected: val === it.i ? '' : null }, it.n + (it.fv ? ' ★' : '')))); s.onchange = () => { iedBegin(); IED.ob.int.f[IED.floor][key] = s.value === '' ? null : +s.value; IED.stroke.changed = true; iedEnd(); }; return h('div', { class: 'field' }, h('label', { for: id }, label), s); };
  el.append(h('h4', { class: 'hrow' }, 'Walls and floor' + (kitInfo(IED.ob).fl > 1 ? ' · ' + (IED.floor + 1) + 'F' : ''), tipBtn('★ counts as a favourite for some Pokémon. Walls and floors don\'t change light, warmth or humidity.')), h('div', { class: 'grid2' }, sel('iedWp', 'Wallpaper', wps, F.wp, 'wp'), sel('iedFc', 'Floor', fcs, F.fc, 'fc')));
}
function iedRing(ki, f) {
  const F = iedFloorData(f), door = f === 0 ? Math.floor((ki.w - 1) / 2) : -9;
  const ok = (x, y) => !F.o.some(a => covers(a, x, y)) && !(f === 0 && x === door && y >= ki.h - 2);
  const ring = [], seen = new Set(), push = (x, y) => { const k = x + ',' + y; if (seen.has(k)) return; seen.add(k); if (ok(x, y)) ring.push([x, y]); };
  for (let x = 0; x < ki.w; x++) push(x, 0); for (let y = 1; y < ki.h; y++) push(ki.w - 1, y); for (let x = ki.w - 2; x >= 0; x--) push(x, ki.h - 1); for (let y = ki.h - 2; y > 0; y--) push(0, y);
  const inner = []; for (let y = 1; y < ki.h - 1; y++) for (let x = 1; x < ki.w - 1; x++) if (ok(x, y)) inner.push([x, y]);
  return ring.filter((_, i) => i % 2 === 0).concat(ring.filter((_, i) => i % 2 === 1), inner);
}
function iedAutoPlace() {
  const ob = IED.ob, ki = kitInfo(ob), home = iedHome(), f = ki.fl > 1 ? IED.floor : null; const dp = iedSuggest(home, f); if (!dp.res.length) return;
  const want = new Set(); for (const p of dp.res) for (const v of p.fv || []) if (!dp.present.has(v)) want.add(v);
  const pick = [], E = dp.env, sim = { b: E.ax.b.v, t: E.ax.t.v, u: E.ax.u.v };
  const delta = (it, k) => { const fx = envFx(it); return !fx ? 0 : k === 't' ? envT(fx, E.ac) : fx[k]; };
  const spoils = (it) => dp.res.some(p => { const k = envAxisOf(p.ideal), d = k ? delta(it, k) : 0; return d && envGap(p.ideal, sim[k] + d, E.kind) > envGap(p.ideal, sim[k], E.kind); });
  const ok = (it) => it.sub !== 'Event item' && !pick.includes(it) && !spoils(it) && !dp.res.some(p => hatesIt(p, it));
  const take = (it, first) => { if (first) pick.unshift(it); else pick.push(it); for (const k of ['b', 't', 'u']) sim[k] += delta(it, k); };
  for (const sg of dp.sugg) { if (!want.size || pick.length >= 8) break; if (!ok(sg.it)) continue; if ((sg.it.fv || []).some(v => want.has(v))) { take(sg.it); for (const v of sg.it.fv || []) want.delete(v); } }
  if (dp.needBig) { const bed = dp.byTag('Relaxation').find(x => x.fits > 0 && ok(x.it)); if (bed) take(bed.it, true); }
  for (const n of dp.envN) { const k = envAxisOf(n.ideal); for (const x of dp.envFor(n.ideal)) { if (!envGap(n.ideal, sim[k], E.kind) || pick.length >= 12) break; if (ok(x.it) && delta(x.it, k)) take(x.it); } }
  for (const t of dp.lack) { if (pick.some(it => it.tg === t)) continue; const best = dp.byTag(t).find(x => ok(x.it)); if (best) take(best.it); }
  for (const sg of dp.sugg) { if (kitFurniture(ob, splitFloors(home) ? IED.floor : 0) + pick.length >= 3) break; if (ok(sg.it)) take(sg.it); }
  const left = dp.envN.filter(n => envGap(n.ideal, sim[envAxisOf(n.ideal)], E.kind));
  const spots = iedRing(ki, IED.floor); let n = 0;
  for (const it of pick) { const size = footOf(it); for (let k = 0; k < spots.length; k++) { const [x, y] = spots[k]; let sz = size; if (!iedFree(x, y, sz[0], sz[1])) { sz = [size[1], size[0]]; if (!iedFree(x, y, sz[0], sz[1])) continue; } iedPut(x, y, it.i, sz); spots.splice(k, 1); n++; break; } }
  iedEnd();
  const still = left.length ? ' Still not ' + left.map(x => x.ideal.toLowerCase() + ' for ' + listNames(x.who)).join(', ') + (left.some(x => x.ideal === 'Dark' || x.ideal === 'Dry') ? ': take something out (see Environment).' : '.') : '';
  toast((n ? 'Placed ' + n + ' item' + (n > 1 ? 's' : '') + (want.size ? '. Some favourites have no indoor item.' : '. Move them wherever you like.') : pick.length ? 'No free space left.' : 'Nothing to add.') + still);
}
function iedClearFloor() {
  const ki = kitInfo(IED.ob), F = iedFloorData(); if (!F.o.length && F.wp == null && F.fc == null) { toast('Already empty'); return; }
  modal('Clear the ' + (ki.fl > 1 ? floorName(IED.floor).toLowerCase() : 'room') + '?', (box) => box.append(h('p', { class: 'sub' }, 'Removes ' + F.o.length + ' item' + (F.o.length === 1 ? '' : 's') + '. You can undo this.')), 'Clear', () => { iedBegin(); IED.ob.int.f[IED.floor] = { o: [], wp: null, fc: null }; IED.stroke.changed = true; iedEnd(); }, true);
}
function iedSizeDialog() {
  const ob = IED.ob, it = ITEMS[ob.i], ki = kitInfo(ob), canFloors = it.kind === 'ow' || !!it.ie;
  modal('Room size', (box) => {
    box.append(h('p', { class: 'sub' }, ki.est || !it.iw ? 'Estimated: match your house in game.' : 'Normally ' + it.iw + '×' + it.ih + (it.fl > 1 ? ' on each floor' : '') + '.'));
    box.append(h('div', { class: 'grid2' }, h('div', { class: 'field' }, h('label', { for: 'iwW' }, 'Width'), h('input', { id: 'iwW', type: 'number', min: 2, max: 24, value: ki.w })), h('div', { class: 'field' }, h('label', { for: 'iwH' }, 'Depth'), h('input', { id: 'iwH', type: 'number', min: 2, max: 24, value: ki.h }))));
    if (canFloors) box.append(h('div', { class: 'field' }, h('label', { for: 'iwF' }, 'Floors'), h('select', { id: 'iwF' }, h('option', { value: 1, selected: ki.fl === 1 ? '' : null }, '1'), h('option', { value: 2, selected: ki.fl === 2 ? '' : null }, '2 (with an upstairs or loft)'))));
    box.append(h('p', { class: 'note' }, 'A smaller room drops the items outside it.'));
  }, 'Apply', () => {
    const w = clamp(+$('#iwW').value | 0, 2, 24), hh = clamp(+$('#iwH').value | 0, 2, 24), fl = canFloors ? clamp(+$('#iwF').value | 0, 1, 2) : ki.fl;
    iedBegin(); const I = IED.ob.int; I.w = w === it.iw ? 0 : w; I.h = hh === it.ih ? 0 : hh; I.fl = fl === (it.fl || 1) ? 0 : fl; iedEnsure();
    let dropped = 0; I.f.forEach((F, k) => { const keep = F.o.filter(a => a[1] + aw(a) <= w && a[2] + ah(a) <= hh && k < fl); dropped += F.o.length - keep.length; F.o = keep; });
    if (fl < 2) { for (const r of residentsOf(iedHome())) if (r.f) setResidentFloor(r.p, 0); }
    IED.stroke.changed = true; iedEnd(); if (dropped) toast(dropped + ' item' + (dropped > 1 ? 's' : '') + ' removed'); iedFind();
  });
}
addEventListener('resize', () => { if (IED.ob) iedDraw(); });
const GRP = { pool: 'waiting', size: 4, env: true, q: '' };
function grpPoolList() {
  const att = planPokemon(); const fromHab = [...att.keys()].map(n => PK_BY_NAME.get(n)).filter(Boolean);
  if (GRP.pool === 'waiting') return fromHab.filter(p => !homeOfPokemon(p.n));
  if (GRP.pool === 'all') return fromHab;
  return (plan.pool || []).map(n => PK_BY_NAME.get(n)).filter(Boolean);
}
function grpShared(a, b) { let n = 0; for (const f of a.fv || []) if ((b.fv || []).includes(f)) n++; return n + (a.fl && a.fl === b.fl ? 0.3 : 0) - (favClash(a, b) ? 4 : 0); }
function grpScore(g) { const seen = new Set(); let total = 0; for (const p of g) for (const f of p.fv || []) { seen.add(f); total++; } const fl = new Map(); for (const p of g) if (p.fl) fl.set(p.fl, (fl.get(p.fl) || 0) + 1); let b = 0; for (const n of fl.values()) b += (n - 1) * 0.3; for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) if (favClash(g[i], g[j])) b -= 4; return total - seen.size + b; }
function grpFits(g, p) { return !GRP.env || !g.length || !p.ideal || g.every(q => !q.ideal || q.ideal === p.ideal); }
function makeGroups(pool, size) {
  const left = [...pool].sort((a, b) => a.n.localeCompare(b.n)); const groups = [];
  while (left.length) {
    if (size === 1 || left.length === 1) { groups.push([left.shift()]); continue; }
    let bi = -1, bj = -1, bs = -1;
    for (let i = 0; i < left.length; i++) for (let j = i + 1; j < left.length; j++) { if (!grpFits([left[i]], left[j])) continue; const s = grpShared(left[i], left[j]); if (s > bs) { bs = s; bi = i; bj = j; } }
    if (bi < 0) { groups.push([left.shift()]); continue; }
    const g = [left[bi], left[bj]]; left.splice(bj, 1); left.splice(bi, 1);
    while (g.length < size) { let k = -1, ks = -1; const base = grpScore(g); for (let i = 0; i < left.length; i++) { if (!grpFits(g, left[i])) continue; const s = grpScore([...g, left[i]]) - base; if (s > ks) { ks = s; k = i; } } if (k < 0) break; g.push(left.splice(k, 1)[0]); }
    groups.push(g);
  }
  for (let pass = 0; pass < 8; pass++) {
    let better = false;
    for (let a = 0; a < groups.length; a++) for (let b = a + 1; b < groups.length; b++) {
      const A = groups[a], B = groups[b];
      for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) {
        const A2 = A.slice(), B2 = B.slice(); [A2[i], B2[j]] = [B[j], A[i]];
        const okA = A2.every((p, k) => grpFits(A2.filter((_, m) => m !== k), p)), okB = B2.every((p, k) => grpFits(B2.filter((_, m) => m !== k), p));
        if (okA && okB && grpScore(A2) + grpScore(B2) > grpScore(A) + grpScore(B) + 1e-9) { groups[a] = A2; groups[b] = B2; better = true; break; }
      }
    }
    if (!better) break;
  }
  return groups.filter(g => g.length).sort((x, y) => y.length - x.length || grpScore(y) - grpScore(x));
}
function grpFavs(g) { const cnt = new Map(); for (const p of g) for (const f of p.fv || []) cnt.set(f, (cnt.get(f) || 0) + 1); return [...cnt].sort((a, b) => b[1] - a[1] || FAVS[a[0]].localeCompare(FAVS[b[0]])); }
function grpPairs(g) {
  if (g.length < 3) return [g];
  if (g.length === 3) { const opts = [[0, 1, 2], [0, 2, 1], [1, 2, 0]].map(([a, b, c]) => ({ s: grpShared(g[a], g[b]), p: [[g[a], g[b]], [g[c]]] })); return opts.sort((x, y) => y.s - x.s)[0].p; }
  const opts = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]].map(pr => ({ s: grpShared(g[pr[0][0]], g[pr[0][1]]) + grpShared(g[pr[1][0]], g[pr[1][1]]), p: pr.map(q => q.map(i => g[i])) }));
  return opts.sort((x, y) => y.s - x.s)[0].p;
}
function allHomes() { const out = []; for (const hs of autoHouses) if (!hs.enclosure) out.push(houseHome(hs)); for (const ob of plan.objs.values()) if (ITEMS[ob.i].cap) out.push(kitHome(ob)); return out.map(hm => ({ hm, used: residentsOf(hm).length })); }
function moveGroupIn(g, home) {
  if (home.floors > 1) { const pairs = grpPairs(g); pairs.forEach((pr, f) => pr.forEach(p => assignResident(p.n, home, Math.min(f, 1)))); }
  else for (const p of g) assignResident(p.n, home);
}
function homeChoices(g) { return allHomes().filter(x => g.every(p => fitsHome(p, x.hm)) && x.hm.cap - x.used + g.filter(p => { const hm = homeOfPokemon(p.n); return hm && hm.key === x.hm.key; }).length >= g.length); }
function housemateGroups() {
  modal('Group into houses', (box) => {
    box.classList.add('xl');
    const ctr = h('div', { class: 'grpctl' }), body = h('div'); box.append(ctr, body);
    const render = () => {
      ctr.textContent = ''; body.textContent = '';
      const att = planPokemon(); const waiting = [...att.keys()].filter(n => !homeOfPokemon(n)).length;
      ctr.append(segmented([['waiting', 'Need a home (' + waiting + ')'], ['all', 'All (' + att.size + ')'], ['list', 'My list (' + (plan.pool || []).length + ')']], GRP.pool, v => { GRP.pool = v; render(); }, 'Who'),
        segmented([[4, '4 per home'], [2, '2 per home']], GRP.size, v => { GRP.size = +v; render(); }, 'Size'),
        h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked: GRP.env ? '' : null, onchange: e => { GRP.env = e.target.checked; render(); } }), 'Same ideal only'));
      if (GRP.pool === 'list') {
        const inp = h('input', { type: 'search', id: 'grpQ', placeholder: 'Add a Pokémon', value: GRP.q, autocomplete: 'off' }); const sug = h('div', { class: 'reqs' });
        const showSug = () => { sug.textContent = ''; const q = GRP.q.toLowerCase(); if (!q) return; for (const p of PK.filter(p => p.n.toLowerCase().includes(q) && !(plan.pool || []).includes(p.n)).slice(0, 12)) sug.append(h('button', { class: 'pkchip', type: 'button', onclick: () => { plan.pool = [...(plan.pool || []), p.n]; markDirty(); GRP.q = ''; render(); setTimeout(() => { const i = $('#grpQ'); if (i) i.focus(); }, 0); } }, pkFace(p, 24), p.n, icon('plus'))); };
        inp.oninput = () => { GRP.q = inp.value.trim(); showSug(); };
        const chips = h('div', { class: 'reqs' }); for (const n of plan.pool || []) chips.append(h('span', { class: 'res' }, pkFace(n, 24), n, h('button', { 'aria-label': 'Remove ' + n, onclick: () => { plan.pool = plan.pool.filter(x => x !== n); markDirty(); render(); } }, icon('close'))));
        body.append(h('label', { class: 'search', style: 'margin-top:8px' }, icon('search'), inp), sug, chips,
          h('div', { style: 'display:flex;gap:6px;margin:4px 0 8px' }, h('button', { class: 'btn sm', onclick: () => { plan.pool = [...new Set([...(plan.pool || []), ...att.keys()])]; markDirty(); render(); } }, 'Add all from habitats'), (plan.pool || []).length ? h('button', { class: 'btn sm danger', onclick: () => { plan.pool = []; markDirty(); render(); } }, 'Clear list') : ''));
        showSug();
      }
      const pool = grpPoolList();
      if (!pool.length) { body.append(h('p', { class: 'hint' }, GRP.pool === 'waiting' ? (att.size ? 'Everyone has a home already. Use All to re-plan them.' : 'No finished habitats yet: use My list.') : GRP.pool === 'all' ? 'No finished habitats yet: use My list.' : 'Add Pokémon above.')); return; }
      const groups = makeGroups(pool, GRP.size); const apart = pool.reduce((a, p) => a + (p.fv || []).length, 0), together = groups.reduce((a, g) => a + grpFavs(g).length, 0);
      const free = allHomes().filter(x => x.used === 0).map(x => x.hm);
      body.append(h('div', { class: 'grpsum' }, h('span', null, h('b', null, pool.length), ' Pokémon → ', h('b', null, groups.length), ' home' + (groups.length === 1 ? '' : 's')), h('span', { 'data-tip': 'Kinds of things to decorate with: ' + together + ' grouped like this, ' + apart + ' if they all lived apart' }, h('b', null, together), ' kinds to decorate (' + apart + ' apart)'),
        free.length ? h('button', { class: 'btn sm primary', style: 'margin-left:auto', onclick: () => fillEmptyHomes(groups, free, render) }, 'Fill ' + free.length + ' empty home' + (free.length === 1 ? '' : 's')) : h('span', { class: 'note', style: 'margin-left:auto' }, 'No empty homes')));
      const grid = h('div', { class: 'ggrid' });
      groups.forEach((g, gi) => {
        const favs = grpFavs(g), envs = [...new Set(g.map(p => p.ideal).filter(Boolean))], fls = [...new Set(g.map(p => p.fl).filter(Boolean))];
        const choices = homeChoices(g); const sel = h('select', { 'aria-label': 'Move this group into a home' }, h('option', { value: '' }, choices.length ? 'Move in to…' : 'No home with ' + g.length + ' free bed' + (g.length > 1 ? 's' : '')), choices.map((x, i) => h('option', { value: i }, x.hm.label + ' (' + (x.hm.cap - x.used) + ' free)')));
        sel.disabled = !choices.length; sel.onchange = () => { if (sel.value === '') return; const hm = choices[+sel.value].hm; moveGroupIn(g, hm); toast(g.length > 1 ? 'Moved ' + g.length + ' Pokémon into ' + hm.label : g[0].n + ' moved in'); requestDraw(); render(); };
        grid.append(h('div', { class: 'card', style: 'margin:0' },
          h('div', { class: 'hd' }, h('span', { class: 'title' }, g.length > 1 ? 'Home ' + (gi + 1) : 'On their own'), envs.length ? h('span', { class: 'env' }, envs.join(' / ')) : '', h('span', { class: 'note', style: 'margin-left:auto' }, favs.length + ' kinds')),
          h('div', { class: 'reqs' }, g.map(p => { const hm = homeOfPokemon(p.n); return h('button', { class: 'res', style: 'padding-right:10px', 'data-tip': (p.fv || []).map(f => FAVS[f]).join(' · ') + (p.fl ? ' · likes ' + p.fl.toLowerCase() : '') + (hm ? ' · lives in ' + hm.label : ''), onclick: () => { closeModal(); openPokemon(p.n); } }, pkFace(p, 24), p.n, sizeBadge(p), hm ? h('span', { class: 'note' }, ' ⌂') : ''); })),
          h('div', null, favs.map(([f, n]) => h('span', { class: 'fav ' + (n > 1 ? 'have' : ''), 'data-tip': n > 1 ? n + ' of them like this' : 'Only one likes this' }, n > 1 ? '×' + n + ' ' : '', FAVS[f]))),
          fls.length ? h('div', { class: 'note', style: 'margin-top:4px' }, 'Flavours: ' + fls.map(f => f.toLowerCase().replace(/ flavou?rs?$/, '')).join(', ')) : '',
          h('div', { class: 'field', style: 'margin:8px 0 0' }, sel)));
      });
      body.append(grid);
    };
    render();
  }, null, null, false, 'Puts Pokémon that like the same kinds of things together, so one set of decorations pleases everyone in a home. Green favourites are shared: one item covers several Pokémon. ⌂: already has a home; moving the group moves them. In two-floor houses the two pairs that share the most sleep on the same floor. Large Pokémon aren\'t offered dens or the Poké Ball house; "Size?" means not tested in a den yet.');
}
function fillEmptyHomes(groups, free, rerender) {
  const homes = free.slice().sort((a, b) => a.cap - b.cap); const plan2 = [];
  const rest = [];
  for (const g of groups) { const k = homes.findIndex(hm => hm.cap >= g.length && g.every(p => fitsHome(p, hm))); if (k < 0) { rest.push(g.slice()); continue; } plan2.push([g, homes[k]]); homes.splice(k, 1); }
  for (const hm of homes.sort((a, b) => b.cap - a.cap)) {
    rest.sort((a, b) => b.length - a.length); const gi = rest.findIndex(g => g.some(p => fitsHome(p, hm))); if (gi < 0) continue; const g = rest[gi].filter(p => fitsHome(p, hm));
    const part = hm.cap >= 2 && g.length >= 2 ? grpPairs(g)[0].slice(0, hm.cap) : g.slice(0, 1); plan2.push([part, hm]); rest[gi] = rest[gi].filter(p => !part.includes(p));
  }
  if (!plan2.length) { toast('None of the groups fit your empty homes'); return; }
  const n = plan2.reduce((a, [g]) => a + g.length, 0);
  modal('Fill empty homes?', (box) => { box.append(h('p', { class: 'sub' }, 'Moves ' + n + ' Pokémon into ' + plan2.length + ' empty home' + (plan2.length === 1 ? '' : 's') + ':')); const l = h('div', { class: 'list' }); for (const [g, hm] of plan2) l.append(h('div', { class: 'card', style: 'margin:0 0 6px' }, h('b', null, hm.label), h('div', { class: 'pkchips' }, g.map(p => h('span', { class: 'pkchip' }, pkFace(p, 24), p.n))))); box.append(l); }, 'Move them in', () => { for (const [g, hm] of plan2) moveGroupIn(g, hm); requestDraw(); renderPanel(); toast('Moved ' + n + ' Pokémon in'); setTimeout(housemateGroups, 0); });
}
function objInArea(ob, a) { for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) if (inB(plan, x, y) && inArea(a, x, y, zOf(ob))) return true; return false; }
function floorItems(hs) { const ids = new Set(); for (const k of hs.cells) for (const ob of stackAt(k)) { const it = ITEMS[ob.i]; if (!isWall(it) && !isDoor(it)) ids.add(ob.id); } return ids.size; }
const TRIO = [['Relaxation', 'Rest'], ['Toy', 'Toy'], ['Decoration', 'Decoration']];
function comfortTrio(home) {
  const tags = new Set();
  if (home.kind === 'kit') { for (const pc of kitPieces(home.ob, home.floor)) if (pc.it.tg) tags.add(pc.it.tg); }
  else for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (it.tg && !tags.has(it.tg) && objInArea(ob, home.hs.area)) tags.add(it.tg); }
  return TRIO.map(([t, lb]) => [lb, tags.has(t), t]);
}
const isRest = (it) => !!it && it.tg === 'Relaxation';
const restClass = (w, h) => Math.min(w, h) >= 2 ? 'large' : Math.max(w, h) >= 2 ? 'medium' : 'small';
function restFit(home, floor) {
  const pks = residentsOf(home, floor).map(r => PK_BY_NAME.get(r.p)).filter(p => p && pkSize(p) !== 's'); if (!pks.length) return null;
  const rest = home.kind === 'kit' ? kitPieces(home.ob, splitFloors(home) ? (floor != null ? floor : home.floor) : null).filter(pc => isRest(pc.it)) : [...plan.objs.values()].filter(ob => isRest(ITEMS[ob.i]) && objInArea(ob, home.hs.area));
  const top = rest.reduce((m, o) => Math.max(m, SIZE_RANK[restClass(o.w, o.h)[0]]), -1);
  const short = pks.filter(p => SIZE_RANK[pkSize(p)] > top), need = short.reduce((m, p) => Math.max(m, SIZE_RANK[pkSize(p)]), 0);
  return { pks, short: short.map(p => p.n), need, guess: short.some(pkSizeGuess) };
}
const RANK_FOOT = ['1×1', '2×1', '2×2'], RANK_WORD = ['small', 'medium', 'large'];
function largeRestChip(home, floor) { const b = restFit(home, floor); if (!b) return ''; const ok = !b.short.length; return h('span', { class: 'req ' + (ok ? 'ok' : ''), 'data-tip': (ok ? 'The rest items are big enough for everyone.' : listNames(b.short) + (b.short.length > 1 ? ' need' : ' needs') + ' a ' + RANK_WORD[b.need] + ' rest item (' + RANK_FOOT[b.need] + ' or bigger).') + ' Rest items come in sizes by footprint: 1×1 small, 2×1 medium, 2×2 large.' + (b.guess ? ' Some sizes are guesses: tap a size to change it.' : '') }, (ok ? '✓ Rest size' : 'Rest ' + RANK_FOOT[b.need] + (b.guess ? '?' : ''))); }
const TRIO_TIP = { Rest: 'A rest item (bed, seat…)', Toy: 'A toy', Decoration: 'A decoration' };
function trioChips(home, floor) { return h('div', { class: 'reqs' }, comfortTrio(home).map(([lb, ok]) => h('span', { class: 'req ' + (ok ? 'ok' : ''), 'data-tip': TRIO_TIP[lb] + (ok ? ' is in range.' : ' isn\'t in range yet.') + ' Pokémon are most comfortable with a rest, a toy and a decoration item nearby.' }, (ok ? '✓ ' : '') + lb)), largeRestChip(home, floor)); }
const LEGENDS = new Set(['Kyogre', 'Raikou', 'Entei', 'Suicune', 'Volcanion', 'Articuno', 'Zapdos', 'Moltres', 'Lugia', 'Ho-Oh', 'Mewtwo', 'Mew', 'Phione', 'Manaphy', 'Jirachi']);
const CMF = ['Won\'t move in', 'Average', 'Nice', 'Great', 'Awesome'], CMF_PTS = [0, 1, 2, 5, 10], CMF_CLS = ['miss', '', '', 'ok', 'ok'], ENV_LV = [0, 3, 12, 26, 52, 77, 100, 120, 140, 160];
const FOOD_FOR = { Sweet: 'Pecha Berries or beans', Spicy: 'fresh carrots', Bitter: 'Rawst Berries, potatoes or seaweed', Dry: 'Chesto Berries, wheat or cave mushrooms', Sour: 'Aspear Berries or tomatoes' };
const flavourOf = (p) => p && p.fl && !/^none$/i.test(p.fl) ? p.fl.replace(/ flavou?rs?$/i, '') : '';
const STORY = new Set(['Professor Tangrowth', 'Peakychu', 'Mosslax', 'Hoppip', 'Skiploom', 'Jumpluff']);
const storyNil = (p) => !!p && STORY.has(p.n) && S.gStory !== 'count';
const rankOf = (pts) => pts >= 9 ? 4 : pts >= 6 ? 3 : pts >= 4 ? 2 : 1;
const holdOf = (L) => L < 2 ? 0 : ENV_LV[L - 2] + 0.75 * (ENV_LV[L - 1] - ENV_LV[L - 2]);
const lvOfPts = (pts) => { let lv = 1; for (let i = 1; i < ENV_LV.length; i++) if (pts >= ENV_LV[i]) lv = i + 1; return lv; };
const ptsTxt = (v) => String(Math.round(v * 100) / 100);
const DIS_WATER = new Set(['Horsea fountain']), DIS_WATER_MAYBE = new Set(['Gyarados fountain', 'Bathtub', 'Shower', 'Sink', 'Water basin', 'Sprinkler', 'Fire hydrant', 'Humidifier', 'Canoe', 'Inflatable boat', 'Bubble machine', 'Water pillar quarter', 'Funky diffuser']);
const DISLIKES = [
  { t: 'Fire', f: 'Lots of water', w: 'water', why: 'Fire types dislike water', wet: true, tier: (it) => DIS_WATER.has(it.n) ? 2 : DIS_WATER_MAYBE.has(it.n) ? 1 : 0, desc: 'water in range and the Horsea fountain; maybe things that hold or spray water, such as a sink, bathtub or sprinkler' },
  { t: 'Grass', f: 'Lots of fire', w: 'fire', why: 'Grass types dislike fire', wet: false, tier: (it, i) => (it.fv || []).includes(i) ? 2 : 0, desc: 'fire, such as a campfire, candle or cooking stove' }];
function dislikesOf(p) { const out = []; if (p) for (const d of DISLIKES) { const i = FAVS.indexOf(d.f); if (i >= 0 && p.t.includes(d.t) && !(p.fv || []).includes(i)) out.push({ f: i, w: d.w, why: d.why, wet: d.wet, desc: d.desc, tier: (it) => d.tier(it, i) }); } return out; }
const hatesIt = (p, it) => !!it && dislikesOf(p).some(d => d.tier(it) > 0);
const WET = { hard: new Set(['Water', 'Ocean water', 'Waterfall']), soft: new Set(['Muddy water']) };
const WET_IX = {};
function wetTiles(a, kind = 'hard') {
  if (!a || !a.rect) return 0; const wi = WET_IX[kind] || (WET_IX[kind] = new Set(ITEMS.filter(it => WET[kind].has(it.n)).map(it => it.i + 1))), R = a.rect, zs = plan.tz, tt = plan.tt; let n = 0;
  for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { if (!inB(plan, x, y)) continue; const k = y * plan.w + x; for (let j = 0; j < zs.length; j++) if (wi.has(tt[j][k]) && inArea(a, x, y, zs[j])) { n++; break; } }
  return n;
}
function homeStuff(home, floor) {
  const obs = [];
  if (home.kind === 'kit') { for (const pc of kitPieces(home.ob, floor)) obs.push({ it: pc.it, w: pc.w, h: pc.h }); const ki = kitInfo(home.ob); for (let f = 0; f < ki.fl; f++) { if (floor != null && f !== floor) continue; const F = intFloor(home.ob, f); for (const v of [F.wp, F.fc]) if (v != null && ITEMS[v]) obs.push({ it: ITEMS[v], w: 1, h: 1 }); } return { obs, wet: 0, wetSoft: 0 }; }
  const a = home.kind === 'habitat' ? home.area : home.hs.area;
  for (const ob of plan.objs.values()) if (objInArea(ob, a)) obs.push({ it: ITEMS[ob.i], w: ob.w, h: ob.h, ob });
  return { obs, wet: wetTiles(a, 'hard'), wetSoft: wetTiles(a, 'soft') };
}
function comfortOf(p, home, floor, S, E) {
  S = S || homeStuff(home, floor); E = E || envOf(home.kind === 'habitat' ? home : floorOf(home, floor));
  const fv = new Set(p.fv || []), fav = (it) => (it.fv || []).find(f => fv.has(f)), need = SIZE_RANK[pkSize(p)], toys = new Map(), decs = new Map();
  const walk = home.kind === 'house' && home.hs ? walkOf(home.hs, tooBig(p)) : null, cut = new Map();
  let rest = null, small = null;
  for (const o of S.obs) {
    const it = o.it, f = fav(it);
    if (walk && o.ob && mustReach(it) && !walk.touch(o.ob)) { if (!cut.has(it.i)) cut.set(it.i, it); continue; }
    if (it.tg === 'Relaxation') { if (SIZE_RANK[restClass(o.w, o.h)[0]] < need) { small = small || it; continue; } if (!rest || (f != null && rest.f == null)) rest = { it, f }; }
    else if (it.tg === 'Toy' || it.tg === 'Decoration') { const m = it.tg === 'Toy' ? toys : decs; if (!m.has(it.i)) m.set(it.i, { it, f, v: f != null ? 2 : 1 }); }
  }
  const top = (m) => [...m.values()].sort((a, b) => b.v - a.v).slice(0, 2), play = top(toys).concat(top(decs)).sort((a, b) => b.v - a.v).slice(0, 3);
  const restV = rest ? (rest.f != null ? 2 : 1) : 0, playV = play.reduce((s, x) => s + x.v, 0), envOk = !!p.ideal && envMet(p, E), envV = envOk ? 2 : 0, foodV = flavourOf(p) ? 2 : 0;
  const dis = disIn(p, S, home), maybe = dis.length ? [] : disIn(p, S, home, true), pts = restV + playV + envV + foodV, rank = dis.length ? 0 : rankOf(pts);
  const cutL = [...cut.values()], cutRest = rest ? null : cutL.find(it => it.tg === 'Relaxation') || null, story = storyNil(p), unfed = !dis.length && foodV && rankOf(pts - foodV) < rank ? rankOf(pts - foodV) : null;
  return { p, home, rest, small: rest ? null : small, restV, play, playV, toyN: toys.size, decN: decs.size, envOk, envV, foodV, dis, maybe, pts, rank, unfed, story, cut: cutL, cutRest, big: tooBig(p), score: story ? 0 : CMF_PTS[rank] * (LEGENDS.has(p.n) ? 2 : 1) };
}
function disIn(p, S, home, soft) {
  if (home && home.kind === 'habitat' && home.hb && home.hb.p.includes(p.n)) return [];
  const want = soft ? 1 : 2, dis = [];
  for (const d of dislikesOf(p)) {
    const what = [...new Set(S.obs.filter(o => d.tier(o.it) === want).map(o => o.it.n))], wt = d.wet ? (soft ? S.wetSoft : S.wet) || 0 : 0;
    if (wt) what.push(wt + (soft ? ' muddy water tile' : ' water tile') + (wt > 1 ? 's' : ''));
    if (what.length) dis.push({ why: d.why, w: d.w, what });
  }
  return dis;
}
function homeComfort(home) {
  const split = splitFloors(home), memo = new Map(), out = [];
  for (const r of residentsOf(home)) { const p = PK_BY_NAME.get(r.p); if (!p) continue; const f = split ? (r.f || 0) : null; if (!memo.has(f)) memo.set(f, [homeStuff(home, f), envOf(floorOf(home, f))]); const [S, E] = memo.get(f); out.push(comfortOf(p, home, f, S, E)); }
  return out;
}
const disText = (c) => c.dis.map(d => listNames(d.what.slice(0, 3)) + (d.what.length > 3 ? ' and more' : '') + ' (' + d.why + ')').join('; ');
function cmfHint(c) {
  if (c.dis.length) return '⚠ Dislikes ' + disText(c);
  const mw = c.maybe && c.maybe.length ? [...new Set(c.maybe.flatMap(d => d.what))] : [], may = mw.length ? '. It may dislike ' + listNames(mw.slice(0, 2).map(n => /^\d/.test(n) ? n : 'the ' + n.toLowerCase())) + (mw.length > 2 ? ' and more' : '') : '';
  return cmfNext(c) + may;
}
function cmfNext(c) {
  const p = c.p, nf = (x) => x && x.f == null;
  if (!c.rest && c.cutRest) return 'Can\'t get to the ' + c.cutRest.n.toLowerCase() + ': ' + WAY_TXT(c);
  if (c.cut && c.cut.length && c.play.length < 3) return 'Can\'t get to ' + listNames(c.cut.slice(0, 2).map(it => 'the ' + it.n.toLowerCase())) + (c.cut.length > 2 ? ' and more' : '') + ': ' + WAY_TXT(c);
  if (p.ideal && !c.envOk) return 'Make it ' + p.ideal.toLowerCase();
  if (!c.rest) return c.small ? 'Its ' + c.small.n.toLowerCase() + ' is too small: it needs a ' + RANK_WORD[SIZE_RANK[pkSize(p)]] + ' rest item' : 'Add a rest item, ideally one it likes';
  if (!c.toyN || !c.decN) return 'Add a ' + (!c.toyN && !c.decN ? 'toy and a decoration' : !c.toyN ? 'toy' : 'decoration') + ', ideally ones it likes';
  if (c.play.length < 3) return 'Add another toy or decoration';
  if (c.rank === 4) return c.unfed != null ? 'Awesome once fed ' + flavourOf(p).toLowerCase() + ' food, ' + CMF[c.unfed] + ' without' : 'Can reach Awesome';
  const hit = new Set([c.rest, ...c.play].filter(x => x && x.f != null).flatMap(x => (x.it.fv || []).filter(f => (p.fv || []).includes(f)))), miss = (p.fv || []).filter(f => !hit.has(f));
  return nf(c.rest) || c.play.some(nf) ? 'Swap in a rest, toy or decoration it likes: ' + (miss.length ? miss : p.fv || []).slice(0, 3).map(f => FAVS[f]).join(', ') : 'All set';
}
const WAY_TXT = (c) => 'make a way to ' + (c.cut && c.cut.length > 1 && !c.cutRest ? 'them' : 'it') + ' from the door' + (c.big ? ', 2 tiles wide,' : '') + ' that rises or drops 1 level at a time';
function cmfTip(c) {
  const p = c.p, nm = (x) => x.it.n + (x.f != null ? ' ♥ ' + FAVS[x.f] : ''), fl = flavourOf(p);
  const b = ['Rest ' + c.restV + (c.rest ? ' (' + nm(c.rest) + ')' : c.small ? ' (' + c.small.n + ' is too small)' : ''),
    'toys and decorations ' + c.playV + ' of 6' + (c.play.length ? ' (' + c.play.map(nm).join(', ') + ')' : ''),
    (p.ideal ? p.ideal.toLowerCase() : 'ideal habitat') + ' ' + c.envV + (p.ideal && !c.envOk ? ' (not yet)' : ''),
    (fl ? fl.toLowerCase() + ' food ' : 'food ') + c.foodV + (fl ? ' when you give it some (' + (FOOD_FOR[fl] || 'its flavour') + ')' : ' (it has no favourite flavour)')];
  if (c.cut && c.cut.length) b.push('can\'t get to ' + listNames(c.cut.slice(0, 4).map(it => it.n)) + (c.cut.length > 4 ? ' and ' + (c.cut.length - 4) + ' more' : '') + ', so ' + (c.cut.length > 1 ? 'they don\'t' : 'it doesn\'t') + ' count');
  const extra = (c.dis.length ? 'It dislikes ' + disText(c) + ', so it would refuse to move in, and scores 0. If that turns up after it has moved in, its comfort drops by an amount nobody has measured, and it can\'t reach Awesome. ' : '')
    + (c.maybe && c.maybe.length ? 'It may dislike ' + disText({ dis: c.maybe }) + ': guides name only water around it and the Horsea fountain, so these are only a guess. ' : '')
    + (c.unfed != null ? 'Without its favourite food it would be ' + CMF[c.unfed] + '. ' : '')
    + (c.story ? 'Story Pokémon add nothing to the environment level (Settings → Game rules). ' : '');
  return 'Best it can reach here: ' + b.join(', ') + ' = ' + c.pts + '. ' + extra + CMF_RULE;
}
const CMF_RULE = 'Scored the way one player\'s tests found it: 1 for a rest item it fits on, 2 if it\'s a favourite; 1 for each toy or decoration, 2 for a favourite, counting up to 3 different ones; 2 for its ideal habitat; 2 for food of its favourite flavour. 9 or more is Awesome, 6 to 8 Great, 4 or 5 Nice, less Average. Copies of the same item count once.';
const CMF_HELP = 'The best comfort each one can reach with what\'s here. In the game it climbs a step at a time as the Pokémon notices things, answers one wish a day and is fed, and a newcomer starts low, at Iffy or Average. Something it dislikes in range stops it moving in, so it scores 0: Grass types dislike fire, and Fire types dislike water in range and the Horsea fountain, as the guides report. Other things that hold or spray water, such as a sink or bathtub, are marked "may dislike". A Pokémon is never put off by its own habitat. In a house you built, it has to be able to walk to the items it uses, from the door, stepping up or down 1 level at a time (large ones need paths 2 tiles wide). Settings → Game rules picks which items those are. ' + CMF_RULE;
function cmfChip(c) { return h('span', { class: 'req ' + CMF_CLS[c.rank], 'data-tip': cmfTip(c) }, c.dis.length ? CMF[0] : '≈ ' + CMF[c.rank], h('b', null, c.dis.length ? '⚠' : c.pts)); }
function cmfLine(c) { return c ? h('div', { class: 'cmfl' }, cmfChip(c), h('span', { class: 'note', style: c.dis.length ? 'color:var(--bad)' : null }, cmfHint(c))) : ''; }
function cmfRow(c, open) { return h('div', { class: 'cmf' }, pkFace(c.p, 24), h('div', { class: 'cmfb' }, h('div', { class: 'cmfh' }, open ? h('button', { class: 'lnk', type: 'button', onclick: () => open(c.p.n) }, c.p.n) : h('b', null, c.p.n), cmfChip(c)), h('div', { class: 'note', style: c.dis.length ? 'color:var(--bad)' : null }, cmfHint(c)))); }
function cmfBlock(list, title, open, pre) { if (!list.length) return ''; return h('div', { class: 'cmfs' }, h('div', { class: 'hrow', style: 'margin-top:6px' }, h('b', null, title || 'Comfort'), h('span', { class: 'note' }, 'best case'), tipBtn((pre || '') + CMF_HELP)), list.map(c => cmfRow(c, open))); }
function townComfort() {
  const out = [], used = new Set(); let lo = 0, crowd = 0;
  for (const { hm } of allHomes()) for (const c of homeComfort(hm)) { out.push(c); used.add(c.p.n); lo += c.score; if (hm.kind !== 'kit') crowd++; }
  for (const z of plan.zones) {
    const hh = habitatHome(z); if (!hh || !hh.ok) continue; let S = null, E = null, best = null, worst = null;
    for (const p of hh.pks) { if (used.has(p.n) || homeOfPokemon(p.n)) continue; if (!S) { S = homeStuff(hh); E = envOf(hh); } const c = comfortOf(p, hh, null, S, E); if (!best || c.score > best.score) best = c; if (!worst || c.score < worst.score) worst = c; }
    if (best) { out.push(best); used.add(best.p.n); lo += worst.score; crowd++; }
  }
  const pts = out.reduce((s, c) => s + c.score, 0), lv = lvOfPts(pts);
  const n = [0, 0, 0, 0, 0]; for (const c of out) n[c.rank]++;
  return { list: out, pts, lv, n, lo, lvLo: lvOfPts(lo), crowd, story: out.filter(c => c.story).length };
}
const disShort = (dis) => dis.map(d => listNames(d.what.slice(0, 2)) + (d.what.length > 2 ? ' and more' : '')).join(', ');
function envLvTip(tc) {
  const got = CMF.map((nm, i) => tc.n[i] ? tc.n[i] + ' ' + nm : '').filter(Boolean).reverse().join(', '), next = ENV_LV[tc.lv];
  const notes = [];
  if (tc.lo < tc.pts) notes.push('A habitat holds whichever of its Pokémon arrives, so with the least happy ones it would be ' + tc.lo + ' points, level ' + tc.lvLo + '.');
  if (tc.lv >= 2) notes.push('Once reached, level ' + tc.lv + ' holds until points fall below about ' + ptsTxt(holdOf(tc.lv)) + '. Below that the town drops a level, and that level\'s unbought shop stock and challenges lock again.');
  if (tc.story) notes.push(tc.story + ' story Pokémon add nothing (Settings → Game rules).');
  if (tc.crowd > 25) notes.push(tc.crowd + ' Pokémon live outside kit houses, and only about 25 show at once, so some may not notice new things, and sit lower than this until they\'re shown.');
  return (tc.list.length ? 'Best case for this plan: ' + got + ' = ' + tc.pts + ' points, so level ' + tc.lv + (next != null ? ' (level ' + (tc.lv + 1) + ' at ' + next + ')' : '') + '. ' + notes.join(' ') + ' ' : 'Nobody lives here yet. ') + 'Each resident\'s comfort gives points: Awesome 10, Great 5, Nice 2, Average 1, Iffy or no home 0, and twice that for legendary and mythical Pokémon. Levels 2 to 10 need 3, 12, 26, 52, 77, 100, 120, 140 and 160. From two players\' tests; a level is kept until points fall below about three quarters of the way from the level before.';
}
let lvWatch = { id: null, lv: 0 }, lvT = 0;
function lvCheck() {
  if (!plan) return; const tc = townComfort(), lv = tc.list.length ? tc.lv : 1;
  if (lvWatch.id !== plan.id) { lvWatch = { id: plan.id, lv }; return; }
  const was = lvWatch.lv;
  if (lv >= was) { lvWatch.lv = lv; return; }
  if (tc.pts < holdOf(was)) { lvWatch.lv = lv; toast('Down to ' + tc.pts + ' points, below level ' + was + '\'s hold of about ' + ptsTxt(holdOf(was)) + ': in the game the town would drop to level ' + tc.lv + ', and level ' + was + '\'s unbought shop stock and challenges would lock again.', 8000); }
}
function moveInWarn(p, home, floor) { if (!p || !home) return ''; const S = homeStuff(home, splitFloors(home) ? floor || 0 : null), dis = disIn(p, S, home); return dis.length ? ' ⚠ In the game it would refuse: ' + disText({ dis }) + '.' : ''; }
const CBOX = 'Community box', BOX_R = 4;
const isBox = (it) => it && it.n === CBOX;
function growRect(R, n) { const x0 = Math.max(0, R.x - n), y0 = Math.max(0, R.y - n), x1 = Math.min(plan.w - 1, R.x + R.w - 1 + n), y1 = Math.min(plan.h - 1, R.y + R.h - 1 + n); return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }; }
function homeRanges() {
  const out = [], pk = (names) => names.map(n => PK_BY_NAME.get(n)).filter(Boolean);
  for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'habitat' && r.ok && r.area) out.push({ key: 'zone:' + z.id, kind: 'habitat', label: r.best.hb.n, rect: r.area.rect, base: r.area.base, pks: pk(r.best.hb.p), z }); }
  for (const hs of autoHouses) if (!hs.enclosure) out.push({ key: 'house:' + hs.id, kind: 'house', label: 'House at ' + hs.x + ', ' + hs.y, rect: hs.area.rect, base: hs.area.base, pks: pk(residentsOf(houseHome(hs)).map(r => r.p)), hs });
  for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (!it.cap) continue; out.push({ key: 'kit:' + ob.id, kind: 'kit', label: it.n.replace(/ kit$/, '') + ' at ' + ob.x + ', ' + ob.y, rect: growRect(ob, AREA_R), base: zOf(ob), pks: pk(residentsOf(kitHome(ob)).map(r => r.p)), ob, guess: true }); }
  return out;
}
function boxFit(ob, hm) {
  const Z = growRect(hm.rect, BOX_R); let n = 0;
  for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) { if (x < Z.x || y < Z.y || x >= Z.x + Z.w || y >= Z.y + Z.h) continue; const d = zOf(ob) - hm.base; if (d >= -12 && d <= 14) n++; }
  const gx = Math.max(0, Z.x - (ob.x + ob.w - 1), ob.x - (Z.x + Z.w - 1)), gy = Math.max(0, Z.y - (ob.y + ob.h - 1), ob.y - (Z.y + Z.h - 1));
  return { n, all: ob.w * ob.h, far: Math.max(gx, gy), Z };
}
function boxReport(ob) { return homeRanges().map(hm => Object.assign({ hm }, boxFit(ob, hm))).filter(x => x.n > 0 || x.far <= 3); }
function boxesFor(hm) { const l = []; for (const ob of plan.objs.values()) if (isBox(ITEMS[ob.i])) { const f = boxFit(ob, hm); if (f.n === f.all) l.push(ob); } return l; }
const gatherers = (pks) => pks.filter(p => p.s.includes('Gather'));
function boxLine(key) {
  const hm = homeRanges().find(x => x.key === key); if (!hm) return '';
  const boxes = boxesFor(hm), g = gatherers(hm.pks);
  const txt = boxes.length ? (boxes.length > 1 ? '⚠ ' + boxes.length + ' boxes in reach' : 'Box at ' + boxes[0].x + ', ' + boxes[0].y) + (g.length ? ' · filled by ' + listNames(g.map(p => p.n)) : ' · nobody fills it') : 'No community box in reach';
  const tip = boxes.length ? (boxes.length > 1 ? 'Only one box gets used. ' : '') + (g.length ? 'Pokémon with the Gather specialty put what they find in it.' : 'Nobody here has the Gather specialty, so nobody fills it.') + (hm.guess ? ' Kit houses: not tested by players.' : '') : 'A community box within 4 tiles of the dotted line collects what Pokémon drop.';
  return h('div', { class: 'note hrow', style: 'margin-top:6px' + (boxes.length > 1 ? ';color:var(--warn)' : '') }, '📦 ' + txt, tipBtn(tip));
}
function boxInspector(ob, box) {
  const rep = boxReport(ob).sort((a, b) => (b.n === b.all) - (a.n === a.all) || a.far - b.far);
  const sec = h('div', { class: 'section' }, h('div', { class: 'hrow' }, h('b', null, 'Homes it serves'), tipBtn('Only Gather Pokémon put things in; processing Pokémon nearby take items out to work on them. The whole box must be within 4 tiles of a home\'s dotted line; the dashed lines on the map show each home\'s reach.')));
  if (!rep.length) sec.append(h('p', { class: 'note', style: 'margin:4px 0' }, 'None in reach'));
  const l = h('div', { class: 'list' });
  for (const x of rep) {
    const full = x.n === x.all, g = gatherers(x.hm.pks), others = full ? boxesFor(x.hm).filter(o => o !== ob).length : 0;
    const why = full ? (g.length ? 'Filled by ' + listNames(g.map(p => p.n)) : 'Nobody here gathers') + (others ? ' · ⚠ ' + (others + 1) + ' boxes, one used' : '') + (x.hm.guess ? ' · untested' : '')
      : x.n > 0 ? 'Sticks out ' + (x.all - x.n) + ' tile' + (x.all - x.n > 1 ? 's' : '') : x.far + ' tile' + (x.far > 1 ? 's' : '') + ' too far';
    l.append(h('div', { class: 'row', style: 'cursor:default;align-items:flex-start' }, h('span', { class: 'req ' + (full ? 'ok' : 'miss'), style: 'flex:none' }, full ? '✓' : '✗'), h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, x.hm.label + (x.hm.kind === 'habitat' ? ' habitat' : '')), h('div', { class: 'ds', style: 'white-space:normal' + (full && others ? ';color:var(--warn)' : '') }, why))));
  }
  sec.append(l);
  const jobs = []; for (const x of rep) if (x.n === x.all && nearestBox(x.hm) === ob) for (const { p, sp } of workers(x.hm)) jobs.push(p.n + ' (' + sp + ': ' + PROC[sp][0] + ' → ' + PROC[sp][1] + ')');
  if (jobs.length) sec.append(h('div', { class: 'note', style: 'margin-top:6px', 'data-tip': 'Put the raw materials in this box and these Pokémon turn them into the result, back in the same box.' }, '⚙ Works from it: ' + listNames([...new Set(jobs)])));
  box.append(sec);
}
function drawBoxReach(c, ob, s) {
  for (const x of boxReport(ob)) { const Z = x.Z, full = x.n === x.all; c.save(); c.strokeStyle = full ? theme.good : theme.warn; c.lineWidth = 2; c.setLineDash([7, 5]); c.globalAlpha = 0.9; c.strokeRect(view.px + Z.x * s + 1, view.py + Z.y * s + 1, Z.w * s - 2, Z.h * s - 2); c.restore();
    if (s >= 7) { c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const t = 'Box reach: ' + x.hm.label; const tw = c.measureText(t).width + 8; c.fillStyle = full ? theme.good : theme.warn; roundRect(c, view.px + Z.x * s + 2, view.py + (Z.y + Z.h) * s + 2, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(t, view.px + Z.x * s + 6, view.py + (Z.y + Z.h) * s + 4); } }
}
let showReach = LS.get(LSK + 'reach') === '1';
const hasReach = (it) => !!it && (!!it.rc || !!it.pt || !!it.pg || (GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i)));
function reachList() { const out = []; for (const ob of plan.objs.values()) if (hasReach(ITEMS[ob.i]) && obShown(ob)) out.push(ob); return out; }
let evalSeq = 0; const REACH_CACHE = new Map();
function reachCached(ob) { const e = REACH_CACHE.get(ob.id); if (e && e.seq === evalSeq && e.ob === ob) return e.R; const R = reachOf(ob); REACH_CACHE.set(ob.id, { seq: evalSeq, ob, R }); return R; }
function reachPaths(R) {
  if (R.fp) return R; const W = plan.w, fp = new Path2D(), ep = new Path2D(), wp = new Path2D(), xp = new Path2D(), set = new Set(R.cells);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const edges = (cells, st, path) => { for (const k of cells) { const x = k % W, y = (k / W) | 0; if (!st.has(k - W)) { path.moveTo(x, y); path.lineTo(x + 1, y); } if (!st.has(k + W)) { path.moveTo(x, y + 1); path.lineTo(x + 1, y + 1); } if (x === 0 || !st.has(k - 1)) { path.moveTo(x, y); path.lineTo(x, y + 1); } if (x === W - 1 || !st.has(k + 1)) { path.moveTo(x + 1, y); path.lineTo(x + 1, y + 1); } } };
  for (const k of R.cells) { const x = k % W, y = (k / W) | 0; fp.rect(x, y, 1, 1); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1); }
  edges(R.cells, set, ep); if (R.watch) for (const k of R.watch) wp.rect(k % W, (k / W) | 0, 1, 1);
  if (R.far) { const fs = new Set(R.far); edges(R.far, fs, xp); for (const k of R.far) { const x = k % W, y = (k / W) | 0; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1); } }
  Object.assign(R, { fp, ep, wp, xp, bb: [x0, y0, x1, y1] }); return R;
}
function drawReachShape(c, s, R, strong) {
  if (!R.cells.length) return; reachPaths(R); const [x0, y0, x1, y1] = R.bb;
  if (view.px + x1 * s < 0 || view.py + y1 * s < 0 || view.px + x0 * s > W || view.py + y0 * s > H) return;
  const m = c.getTransform(); c.save(); c.setTransform(m.a * s, m.b, m.c, m.d * s, m.e + m.a * view.px, m.f + m.d * view.py);
  c.fillStyle = R.col; c.globalAlpha = strong ? 0.16 : 0.07; if (strong || s >= 6) c.fill(R.fp);
  if (R.watch && R.watch.length) { c.globalAlpha = 0.4; c.fill(R.wp); }
  c.strokeStyle = R.col; c.lineWidth = (strong ? 2 : 1.5) / s; c.globalAlpha = strong ? 0.95 : 0.6; c.setLineDash(R.kind === 'power' ? [] : [6 / s, 4 / s]); c.stroke(R.ep);
  if (strong && R.far) { c.globalAlpha = 0.6; c.lineWidth = 1.5 / s; c.setLineDash([3 / s, 4 / s]); c.stroke(R.xp); }
  c.restore();
  if (strong && s >= 7) {
    c.save(); const t = R.label + ' · ' + R.lv; c.globalAlpha = 1; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top';
    const tw = c.measureText(t).width + 8, lx = Math.max(view.px + x0 * s, 2), ly = Math.max(view.py + y0 * s - 17, 2); c.fillStyle = R.col; roundRect(c, lx, ly, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(t, lx + 4, ly + 2); c.restore();
  }
}
function drawReach(c, s) {
  const sel = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null;
  if (showReach) for (const ob of reachList()) if (ob !== sel) { const R = reachCached(ob); if (R) drawReachShape(c, s, R, false); }
  if (sel && hasReach(ITEMS[sel.i])) { const R = reachCached(sel); if (R) drawReachShape(c, s, R, true); }
}
const PW_R = 10, PW_TT = 15, PW_DZ = 5, PW_CAP = 20;
let POWER = null, showPower = LS.get(LSK + 'power') === '1';
const isPowerDev = (it) => it.pd != null && !it.cap;
const kitOutside = (it) => !!it.cap && it.cap > 1 && !/\b(den|hut|tent)\b/i.test(it.n);
function powerFoot(ob) { const it = ITEMS[ob.i]; if (it.pg && (ob.w > 1 || ob.h > 1)) return [[ob.x, ob.y + ob.h - 1], [ob.x, ob.y], [ob.x + ob.w - 1, ob.y], [ob.x + ob.w - 1, ob.y + ob.h - 1]][faceOf(ob)]; return [ob.x, ob.y]; }
function pwDist(t, ob) {
  const [tx, ty] = t.foot, dz = Math.abs(zOf(ob) - zOf(t.ob)); if (dz > PW_DZ) return Infinity;
  const [nx, ny] = ITEMS[ob.i].pg ? powerFoot(ob) : [clamp(tx, ob.x, ob.x + ob.w - 1), clamp(ty, ob.y, ob.y + ob.h - 1)];
  return Math.abs(tx - nx) + Math.abs(ty - ny) + dz;
}
function liquidAtWheel(ob) {
  for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) { if (!inB(plan, x, y)) continue; const k = y * plan.w + x; for (let z = zOf(ob) - 1; z <= topOf(ob); z++) { const v = terrAt(plan, k, z); if (v && ITEMS[v - 1].lq) return true; } }
  return false;
}
function genUnits(ob) { const it = ITEMS[ob.i]; if (it.pgn === 'n' && !liquidAtWheel(ob)) return 0; return it.pgh && ob.hg ? it.pgh : it.pg; }
function wireBlocked(a, b) {
  const [ax, ay] = a.foot, [bx, by] = b.foot, az = topOf(a.ob) + 0.5, bz = (ITEMS[b.ob.i].pt === 'p' ? topOf(b.ob) : zOf(b.ob)) + 0.5, own = new Set([a.ob.id, b.ob.id]);
  const n = Math.max(2, Math.ceil((Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz)) * 3));
  for (let i = 1; i < n; i++) {
    const f = i / n, x = Math.floor(ax + 0.5 + (bx - ax) * f), y = Math.floor(ay + 0.5 + (by - ay) * f), z = Math.floor(az + (bz - az) * f);
    if (!inB(plan, x, y)) continue; const k = y * plan.w + x;
    const tv = terrAt(plan, k, z); if (tv && !ITEMS[tv - 1].lq) return { x, y, z, what: ITEMS[tv - 1].n };
    const o = occAt(plan, k, z); if (o && !own.has(o)) { const q = plan.objs.get(o); if (q && !isRug(ITEMS[q.i])) return { x, y, z, what: ITEMS[q.i].n }; }
  }
  return null;
}
function computePower() {
  const P = { tx: new Map(), gen: new Map(), dev: new Map(), kit: new Map(), nets: [], any: false };
  const objs = [...plan.objs.values()].sort((a, b) => a.id - b.id), T = [];
  const near = (ob, list, ok) => { let best = null, bd = Infinity; for (const t of list) { if (ok && !ok(t)) continue; const d = pwDist(t, ob); if (d < bd) { bd = d; best = t; } } return [best, bd]; };
  for (const ob of objs) {
    const it = ITEMS[ob.i];
    if (it.pt) {
      const t = { ob, foot: powerFoot(ob), gen: null, devs: [], links: [], net: -1, blocked: [] }; P.tx.set(ob.id, t); T.push(t); P.any = true;
      let bg = null, bd = Infinity; for (const g of P.gen.values()) { if (g.tx) continue; const d = pwDist(t, g.ob); if (d <= S.gGen && d < bd) { bd = d; bg = g; } } if (bg) { bg.tx = t; t.gen = bg; }
      const free = [...P.dev.values()].filter(d => !d.tx).map(d => [d, pwDist(t, d.ob)]).filter(([, d]) => d <= PW_R).sort((a, b) => a[1] - b[1] || a[0].ob.id - b[0].ob.id);
      for (const [d] of free) { if (t.devs.length >= PW_CAP) break; d.tx = t; t.devs.push(d); }
    } else if (it.pg) {
      const g = { ob, units: genUnits(ob), tx: null }; P.gen.set(ob.id, g); P.any = true;
      const [t, d] = near(ob, T, (q) => !q.gen); if (t && d <= S.gGen) { g.tx = t; t.gen = g; }
    } else if (isPowerDev(it)) {
      const d = { ob, draw: it.pd, tx: null, inReach: 0 }; P.dev.set(ob.id, d);
      const [t, dd] = near(ob, T, (q) => q.devs.length < PW_CAP); if (t && dd <= PW_R) { d.tx = t; t.devs.push(d); }
    }
  }
  for (const d of P.dev.values()) { let n = 0, bd = Infinity; for (const t of T) { const x = pwDist(t, d.ob); if (x <= PW_R) n++; bd = Math.min(bd, x); } d.inReach = n; d.nearest = bd; }
  for (const g of P.gen.values()) { let bd = Infinity; for (const t of T) bd = Math.min(bd, pwDist(t, g.ob)); g.nearest = bd; }
  const par = T.map((_, i) => i), find = (i) => par[i] === i ? i : (par[i] = find(par[i]));
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const a = T[i], b = T[j], dz = Math.abs(zOf(a.ob) - zOf(b.ob)); if (dz > PW_DZ || Math.abs(a.foot[0] - b.foot[0]) + Math.abs(a.foot[1] - b.foot[1]) + dz > PW_TT) continue; a.links.push(b); b.links.push(a); par[find(i)] = find(j); if (ITEMS[a.ob.i].pt === 'p' && ITEMS[b.ob.i].pt === 'p') { const w = wireBlocked(a, b); if (w) a.blocked.push({ to: b, at: w }); } }
  for (const t of T) if (t.gen && ITEMS[t.ob.i].pt === 'p') { const g = t.gen, w = wireBlocked(t, { ob: g.ob, foot: powerFoot(g.ob) }); if (w) t.blocked.push({ to: g, at: w }); }
  const nets = new Map(); T.forEach((t, i) => { const r = find(i); if (!nets.has(r)) nets.set(r, { tx: [], supply: 0, draw: 0, gens: 0, devs: 0 }); const N = nets.get(r); t.net = N; N.tx.push(t); if (t.gen) { N.supply += t.gen.units; N.gens++; } for (const d of t.devs) { N.draw += d.draw; N.devs++; } });
  for (const ob of objs) {
    const it = ITEMS[ob.i]; if (!it.cap || !ob.int) continue;
    let sup = 0, draw = 0, n = 0; for (const f of ob.int.f || []) if (f) for (const o of f.o) { const q = ITEMS[o[0]]; if (!q) continue; if (q.pg && !q.pgn) sup += q.pg; else if (q.pd != null) { draw += q.pd; n++; } }
    if (!n && !sup) continue; if (sup) P.any = true;
    const K = { ob, sup, draw, n, net: null, out: kitOutside(it) };
    if (K.out) { let bt = null, bd = Infinity; for (const t of T) { const d = pwDist(t, ob); if (d <= PW_R && d < bd) { bd = d; bt = t; } } if (bt && !(sup && sup >= draw)) { K.net = bt.net; bt.net.draw += draw; bt.net.devs += n; } }
    P.kit.set(ob.id, K);
  }
  for (const N of nets.values()) { N.over = N.draw > N.supply; N.on = N.supply > 0 && !N.over; P.nets.push(N); }
  for (const K of P.kit.values()) K.on = K.sup > 0 && K.sup >= K.draw || !!(K.net && K.net.on);
  for (const d of P.dev.values()) d.on = !!(d.tx && d.tx.net.on);
  POWER = P;
}
function powerWhy(d) {
  if (d.on) return '';
  if (!d.tx) return d.nearest === Infinity ? 'no transmitter in reach' + (POWER.tx.size ? ' (more than 5 levels away, or none placed)' : '') : d.nearest <= PW_R ? 'every transmitter in reach already has 20 items' : 'the nearest transmitter is ' + d.nearest + ' tiles away (10 at most)';
  const N = d.tx.net; if (!N.supply) return N.gens ? 'its generator makes no power' : 'no generator on its network';
  return 'its network is overloaded: it uses ' + N.draw + ' of ' + N.supply;
}
function powerOn(ob) { if (!POWER || !POWER.any) return true; const d = POWER.dev.get(ob.id); return !d || d.on; }
function powerSection(ob, box) {
  if (!POWER) return;
  const it = ITEMS[ob.i], d = POWER.dev.get(ob.id), t = POWER.tx.get(ob.id), g = POWER.gen.get(ob.id), K = POWER.kit.get(ob.id), at = (o) => o.x + ', ' + o.y;
  const net = (N) => N.tx.length + ' transmitter' + (N.tx.length > 1 ? 's' : '') + ' · ' + N.gens + ' generator' + (N.gens === 1 ? '' : 's') + ' · ' + N.draw + ' of ' + N.supply + ' power used';
  const line = (txt, bad, tip) => box.append(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const T_TIP = 'Generators reach a transmitter within ' + S.gGen + ' tiles, transmitters reach each other within 15 and their items within 10, counted along each axis and added up, and never more than 5 levels up or down. Linked transmitters share their generators. Using more than they make turns the whole network off.';
  if (!POWER.any) { if (d) line('Needs power. Nothing in this plan makes power yet, so the planner counts it as working.', false, T_TIP); return; }
  if (d) { if (d.on) line('⚡ Powered · ' + net(d.tx.net), false, T_TIP); else line('⚠ No power: ' + powerWhy(d) + '.', true, T_TIP); if (d.inReach > 1) line('In reach of ' + d.inReach + ' transmitters. The game joins it to one when you place it; the planner picks the nearest with room, in the order you placed things.'); }
  if (t) {
    const N = t.net; line((N.over ? '⚠ Overloaded · ' : !N.supply ? '⚠ No power · ' : '⚡ ') + net(N), N.over || !N.supply, T_TIP);
    line('This one: ' + (t.gen ? ITEMS[t.gen.ob.i].n + ' at ' + at(t.gen.ob) + ' (' + t.gen.units + ')' : 'no generator of its own') + ' · ' + t.devs.length + ' of 20 items');
    for (const q of t.blocked) line('⚠ ' + q.at.what + ' at ' + q.at.x + ', ' + q.at.y + ' is in the way of the wire to ' + ITEMS[q.to.ob.i].n + ' at ' + at(q.to.ob) + '. It only works if the wire was strung before that was placed.', true);
  }
  if (g) {
    if (g.tx) line('⚡ Feeds ' + ITEMS[g.tx.ob.i].n + ' at ' + at(g.tx.ob) + ' · ' + net(g.tx.net), false, T_TIP); else line('⚠ Not connected: ' + (g.nearest <= S.gGen ? 'every transmitter in reach already has a generator' : g.nearest === Infinity ? 'no transmitter in reach' : 'the nearest transmitter is ' + g.nearest + ' tiles away (' + S.gGen + ' at most)') + '.', true, T_TIP);
    if (it.pgn === 'n' && !g.units) line('⚠ No liquid at its wheel, so it makes nothing.', true);
    if (it.pgh) box.append(h('label', { class: 'toggle', style: 'margin-top:6px' }, h('input', { type: 'checkbox', checked: !!ob.hg, onchange: (e) => { if (e.target.checked) ob.hg = 1; else delete ob.hg; markDirty(); evaluateAll(); requestDraw(); showObjInspector(ob); } }), 'High ground (' + it.pgh + ' power)', tipBtn('Tick it if it stands 45 or more tiles above the map\'s floor (47 in Rocky Ridges). There it makes ' + it.pgh + ' instead of ' + it.pg + '.')));
  }
  if (K) { const n = K.n + ' item' + (K.n === 1 ? '' : 's') + ' inside'; if (K.on) line('⚡ ' + n + ' powered ' + (K.sup >= K.draw && K.sup ? 'by a mini generator inside' : 'from outside')); else line('⚠ ' + n + ' without power: ' + (!K.out ? (K.sup ? 'the mini generator inside isn\'t enough, and a den or hut can\'t take power from outside' : 'a den or hut only takes power from a mini generator inside') : K.net ? 'the network outside is ' + (K.net.over ? 'overloaded' : 'without power') : (K.sup ? 'the mini generator inside isn\'t enough, and ' : '') + 'no transmitter is within 10 tiles') + '.', true, 'Dens and huts only take power from a mini generator inside them. Cottages and houses take it from a transmitter outside too, and then everything inside is powered.'); }
}
let FIELDS = null, showWater = LS.get(LSK + 'water') === '1';
const FIELD_COL = { wet: '#2f8fd8', dry: '#e08a1e', dried: '#9b6b3c', lava: '#d0402f', under: '#d0402f' };
const isCrop = (it) => !!it && it.sub === 'Crops';
const hydrates = (v) => !!v && !!ITEMS[v - 1].lq && ITEMS[v - 1].lq[1] > 0;
const isLava = (v) => !!v && ITEMS[v - 1].n === 'Lava';
function computeFields() {
  const F = { cells: new Map(), spr: new Map(), rock: new Map(), any: false }, W = plan.w, farm = BY_NAME.get('Farm soil');
  const objs = [...plan.objs.values()], ranges = homeRanges();
  for (const ob of objs) { const it = ITEMS[ob.i]; if (it.n !== 'Sprinkler') continue; const zs = zOf(ob); let water = null;
    const SR = S.gSprinkler; for (let dy = -SR; dy <= SR && !water; dy++) for (let dx = -(SR - Math.abs(dy)); dx <= SR - Math.abs(dy); dx++) { const x = ob.x + dx, y = ob.y + dy; if (!inB(plan, x, y)) continue; const k = y * W + x; if (hydrates(terrAt(plan, k, zs)) || hydrates(terrAt(plan, k, zs - 1))) { water = [x, y]; break; } }
    F.spr.set(ob.id, { ob, works: !!water, water, n: 0 }); }
  const SR2 = S.gSprinkler, sprayed = (x, y, z) => { for (const Q of F.spr.values()) if (Q.works && Math.abs(Q.ob.x - x) + Math.abs(Q.ob.y - y) <= SR2 && z - zOf(Q.ob) >= -1 && z - zOf(Q.ob) <= 2) return Q; return null; };
  for (const ob of objs) { const it = ITEMS[ob.i]; if (it.n !== 'Smooth rock') continue; const off = plan.wx === 'rain' ? 'it\'s raining' : sprayed(ob.x, ob.y, zOf(ob)) ? 'a running sprinkler sprays it' : ''; F.rock.set(ob.id, { ob, off, n: 0 }); }
  const basins = []; for (const hm of ranges) { const who = hm.pks.filter(p => (p.s || []).includes('Water')); if (!who.length) continue; const R = hm.rect; let has = false; for (const ob of objs) if (ITEMS[ob.i].n === 'Water basin' && ob.x >= R.x && ob.y >= R.y && ob.x < R.x + R.w && ob.y < R.y + R.h && Math.abs(zOf(ob) - hm.base) <= AREA_R) { has = true; break; } basins.push({ hm, who, has }); }
  const growers = []; for (const hm of ranges) { const who = hm.pks.filter(p => (p.s || []).includes('Grow')); if (who.length) growers.push({ hm, who }); }
  const inR = (hm, x, y, z) => { const R = hm.rect; return x >= R.x && y >= R.y && x < R.x + R.w && y < R.y + R.h && Math.abs(z - hm.base) <= AREA_R; };
  const add = (x, y, f, crop, planter) => {
    const k = y * W + x; if (F.cells.has(k)) return; F.any = true; const p = f + 1, why = [];
    let state = null;
    const under = crop ? !!terrAt(plan, k, p + 1) && !!ITEMS[terrAt(plan, k, p + 1) - 1].lq : !!terrAt(plan, k, p) && !!ITEMS[terrAt(plan, k, p) - 1].lq;
    const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([a, b]) => inB(plan, a, b)).map(([a, b]) => b * W + a);
    if (under) {
      const bub = objs.find(o => ITEMS[o.i].n === 'Bubble machine' && Math.abs(o.x - x) <= 1 && Math.abs(o.y - y) <= 1 && Math.abs(zOf(o) - p) <= 1 && powerOn(o));
      const wp = basins.find(B => inR(B.hm, x, y, p)); if (bub) { state = 'wet'; why.push('bubbles from the Bubble machine at ' + bub.x + ', ' + bub.y); } else if (wp) { state = 'wet'; why.push('bubbles from ' + wp.who[0].n + ' (reach not measured)'); } else state = 'under';
    } else if (nb.some(q => isLava(terrAt(plan, q, p)) || isLava(terrAt(plan, q, f)))) state = 'lava';
    else {
      const still = (q, z) => hydrates(terrAt(plan, q, z)) && !((flowAt(q, z) || {}).f === FL_RUN);
      if (nb.some(q => still(q, p) || still(q, f))) why.push('water beside it');
      const Q = sprayed(x, y, f); if (Q) { why.push('the sprinkler at ' + Q.ob.x + ', ' + Q.ob.y); Q.n++; }
      if (plan.wx === 'rain' && !roofedAt(k, p)) why.push('rain');
      const B = basins.find(b => b.has && inR(b.hm, x, y, p)); if (B) why.push(B.who[0].n + '\'s water basin (reach not measured)');
      state = why.length ? 'wet' : 'dry';
    }
    let dried = null;
    if (!planter && state !== 'lava') for (const R of F.rock.values()) { if (R.off) continue; const rz = zOf(R.ob); if (Math.abs(R.ob.x - x) + Math.abs(R.ob.y - y) > S.gRock || f < rz - 2 || f > rz + 1) continue; let top = f; for (let z = rz + 1; z > f; z--) if (terrAt(plan, k, z)) { top = z; break; } if (top !== f) continue; dried = R; R.n++; break; }
    if (dried) { state = 'dried'; why.unshift('the Smooth Rock at ' + dried.ob.x + ', ' + dried.ob.y); }
    const grow = growers.filter(g => inR(g.hm, x, y, p)).flatMap(g => g.who.map(q => q.n));
    F.cells.set(k, { x, y, f, crop, planter, state, why, grow: [...new Set(grow)] });
  };
  for (const ob of objs) { const it = ITEMS[ob.i]; if (!isCrop(it)) continue; const below = occAt(plan, ob.y * W + ob.x, zOf(ob) - 1), planter = !!below && /planter/i.test(ITEMS[plan.objs.get(below).i].n); for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) add(x, y, zOf(ob) - 1, ob, planter); }
  if (farm) for (let j = 0; j < plan.tz.length; j++) { const T = plan.tt[j], z = plan.tz[j]; for (let k = 0; k < T.length; k++) if (T[k] === farm.i + 1 && !terrAt(plan, k, z + 1) && !occAt(plan, k, z + 1)) add(k % W, (k / W) | 0, z, null, false); }
  FIELDS = F;
}
function fieldDays(c) { const it = c.crop ? ITEMS[c.crop.i] : null, n = it && it.cg ? it.cg[0] : 3; if (c.state !== 'wet') return null; if (!c.grow.length) return n + ' day' + (n > 1 ? 's' : ''); const d = Math.ceil((n - 1) / 2); return d ? d + ' day' + (d > 1 ? 's' : '') : 'at once'; }
const isBerryTree = (it) => !!it && GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i);
function fieldSection(ob, box) {
  const it = ITEMS[ob.i], line = (txt, bad, tip) => box.append(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const W_TIP = 'A field is watered by still water, ocean or hot-spring water right beside it (not diagonal, not mud or lava), a running sprinkler within ' + S.gSprinkler + ' tiles, rain where there\'s no roof, or a Water Pokémon with a filled water basin living nearby. A crop grows one stage at 5:00 each day it\'s wet, and a Grow Pokémon living nearby adds one more a day.';
  if (FIELDS && isCrop(it)) { const c = FIELDS.cells.get(ob.y * plan.w + ob.x); if (c) { line((c.state === 'wet' ? '💧 ' : '⚠ ') + fieldWord[c.state] + ': ' + fieldWhy(c) + '.', c.state !== 'wet', W_TIP); const d = fieldDays(c); line(d ? 'Ripe ' + (d === 'at once' ? 'at once' : 'in ' + d) + (c.grow.length ? ', with ' + listNames(c.grow.slice(0, 2)) + ' helping it grow (reach not measured)' : '; 1 day with a Grow Pokémon living nearby') + '.' : 'It won\'t grow until it\'s watered.'); if (c.planter) line('In a planter, so Smooth Rock leaves it alone (one player says it doesn\'t).'); } }
  if (FIELDS && it.n === 'Sprinkler') { const Q = FIELDS.spr.get(ob.id); if (Q) line(Q.works ? '💧 Runs on the water at ' + Q.water[0] + ', ' + Q.water[1] + ' · waters ' + Q.n + ' field tile' + (Q.n === 1 ? '' : 's') : '⚠ Doesn\'t run: no water within ' + S.gSprinkler + ' tiles at its own level or one below, so it waters nothing and adds no humidity.', !Q.works); }
  if (FIELDS && it.n === 'Smooth rock') { const R = FIELDS.rock.get(ob.id); if (R) line(R.off ? 'Off: ' + R.off + '.' : R.n ? '⚠ Dries ' + R.n + ' field tile' + (R.n === 1 ? '' : 's') + ' within ' + S.gRock + ' tiles. Rain or a running sprinkler that reaches it stops it.' : 'No fields within its reach.', !R.off && R.n > 0); }
  if (isBerryTree(it)) { let bad = 0; const z = zOf(ob); for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) { if (!inB(plan, x, y) || (x >= ob.x && x < ob.x + ob.w && y >= ob.y && y < ob.y + ob.h)) continue; const k = y * plan.w + x, t = terrAt(plan, k, z); if ((t && ITEMS[t - 1].lq) || occAt(plan, k, z) || terrAt(plan, k, z)) bad++; } if (bad) line('⚠ ' + bad + ' of the 8 tiles around it ' + (bad > 1 ? 'hold' : 'holds') + ' water, a block or an item, so berries can roll away or get stuck there.', true); }
}
const fieldWord = { wet: 'Wet', dry: 'Dry', dried: 'Dried out', lava: 'Lava beside it', under: 'Underwater' };
function fieldWhy(c) {
  if (c.state === 'wet') return 'watered by ' + listNames(c.why);
  if (c.state === 'dried') return c.why[0] + ' dries it' + (c.why.length > 1 ? ', even though ' + listNames(c.why.slice(1)) + ' water' + (c.why.length > 2 ? '' : 's') + ' it' : '');
  if (c.state === 'lava') return 'lava next to a field stops it being watered';
  if (c.state === 'under') return 'crops under water need bubbles: a powered Bubble machine within 1 tile, or a Water Pokémon living nearby';
  return 'no still water beside it, no running sprinkler within ' + S.gSprinkler + ' tiles' + (plan.wx === 'rain' ? ', and a roof keeps the rain off' : '') + ', and no Water Pokémon with a water basin nearby';
}
function drawFields(c, s) {
  if (!FIELDS || !FIELDS.any || !showWater) return;
  c.save();
  for (const f of FIELDS.cells.values()) { const px = view.px + f.x * s, py = view.py + f.y * s, col = FIELD_COL[f.state]; c.globalAlpha = 0.42; c.fillStyle = col; c.fillRect(px + 1, py + 1, s - 2, s - 2); if (s >= 10 && f.state !== 'wet') { c.globalAlpha = 0.95; c.strokeStyle = col; c.lineWidth = 2; c.strokeRect(px + 2, py + 2, s - 4, s - 4); } }
  const r = Math.max(3.5, Math.min(7, s * 0.16)); c.globalAlpha = 1;
  for (const S of FIELDS.spr.values()) { const px = view.px + (S.ob.x + 1) * s - r - 1, py = view.py + S.ob.y * s + r + 1; c.fillStyle = S.works ? theme.good : theme.bad; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(px, py, r, 0, 7); c.fill(); c.stroke(); }
  c.restore();
}
let SIG = null, showSignals = LS.get(LSK + 'signals') === '1';
const SIG_R = { f: 2, w: 3, c: 3 }, WANDER = /^(Hatch window|Shutter|Simple curtain)/, MOVERS = /^(Toy blocks|Sandbox|Alarm clock|Pinwheel|Weather vane|Ship's wheel|Rowlet clock)/i;
const FACE_V = [[0, 1], [-1, 0], [0, -1], [1, 0]];
function sigEffect(it, kind) {
  if (inWall(it) || (it.so && /curtain|shutter|hatch/i.test(it.n))) return kind === 'f' ? 'opens it, and closes it soon after you step off' : 'opens or closes it';
  if (it.pt === 'ws') return 'cuts or restores power to its items';
  if (it.n === 'Mini floodgate') return 'starts or stops its water';
  if (/^Music mat/.test(it.n)) return 'plays its note';
  if (/Bell$/.test(it.n)) return 'rings it';
  if (it.n === 'Fiery Magby statue') return 'makes it breathe fire, which can light a campfire or oven';
  if (isPowered(it)) return 'turns it on or off';
  return 'switches it';
}
function computeSignals() {
  const G = { inputs: new Map(), of: new Map(), any: false }, W = plan.w;
  for (const ob of plan.objs.values()) {
    const it = ITEMS[ob.i]; if (!it.si) continue; G.any = true;
    const z = zOf(ob), rec = { ob, kind: it.si, targets: [], watch: null, moving: true, onlySensor: false }, seen = new Set();
    const visit = (x, y, lz) => { if (!inB(plan, x, y)) return; const o = occAt(plan, y * W + x, lz); if (!o || o === ob.id || seen.has(o)) return; seen.add(o); const q = plan.objs.get(o); if (q && signalTarget(ITEMS[q.i])) rec.targets.push(q); };
    if (it.si === 'l') {
      const [fx, fy] = FACE_V[faceOf(ob)];
      for (const [x, y] of [[ob.x - fy, ob.y + fx], [ob.x + fy, ob.y - fx], [ob.x - fx, ob.y - fy]]) for (let dz = -1; dz <= 1; dz++) visit(x, y, z + dz);
      visit(ob.x, ob.y, z - 1); visit(ob.x, ob.y, z + 1);
      const w = []; let moving = false;
      for (let i = 1; i <= S.gSensor; i++) {
        const x = ob.x + fx * i, y = ob.y + fy * i; if (!inB(plan, x, y)) continue; const k = y * W + x, t = terrAt(plan, k, z), o = occAt(plan, k, z), q = o && plan.objs.get(o);
        if (t && ITEMS[t - 1].lq) { w.push(ITEMS[t - 1].n.toLowerCase()); moving = true; }
        else if (q) { const qi = ITEMS[q.i]; if (qi.si === 'l') w.push('a laser sensor'); else if (signalTarget(qi) || MOVERS.test(qi.n)) { w.push(qi.n.toLowerCase()); moving = true; } else w.push(qi.n.toLowerCase() + ', which doesn\'t move'); }
        else if (t) w.push('a block');
        else if (terrAt(plan, k, z - 1) || occAt(plan, k, z - 1)) { w.push('open ground, so anyone walking past sets it off'); moving = true; }
        else w.push('empty air');
      }
      rec.watch = [...new Set(w)]; rec.moving = moving; rec.onlySensor = !moving && w.includes('a laser sensor');
    } else { const r = SIG_R[it.si]; for (let dz = -r; dz <= r; dz++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) visit(ob.x + dx, ob.y + dy, z + dz); }
    G.inputs.set(ob.id, rec);
    for (const q of rec.targets) { if (!G.of.has(q.id)) G.of.set(q.id, []); G.of.get(q.id).push(rec); }
  }
  SIG = G;
}
const sigNoPower = (q) => isPowered(ITEMS[q.i]) && !powerOn(q);
function signalSection(ob, box) {
  if (!SIG || !SIG.any) return;
  const it = ITEMS[ob.i], rec = SIG.inputs.get(ob.id), by = SIG.of.get(ob.id), at = (o) => o.x + ', ' + o.y, line = (txt, bad, tip) => box.append(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const S_TIP = 'Switches and sensors need no power or wires: they work whatever sits in their reach. Things that respond: doors, windows, hatches, shutters and curtains; lights and appliances that have power; switch transmitters; the mini floodgate; music mats; bells; and the Fiery Magby statue. Timing isn\'t worked out, so a circuit here should work, but isn\'t guaranteed to.';
  if (rec) {
    if (!rec.targets.length) line('⚠ Reaches nothing that responds to it.', true, S_TIP);
    else { line('Works ' + rec.targets.length + ':', false, S_TIP); const l = h('ul', { class: 'note', style: 'margin:2px 0 0 18px;padding:0' }); for (const q of rec.targets) { const qi = ITEMS[q.i]; l.append(h('li', { style: sigNoPower(q) ? 'color:var(--warn)' : '' }, qi.n + ' at ' + at(q) + ': ' + sigEffect(qi, rec.kind) + (sigNoPower(q) ? ' ⚠ but it has no power, so it ignores signals' : '') + (WANDER.test(qi.n) ? ' · wandering Pokémon open it too' : ''))); } box.append(l); }
    if (rec.watch) { if (rec.moving) line('Watches ' + listNames(rec.watch) + '.'); else line('⚠ ' + (rec.onlySensor ? 'It only sees a laser sensor, and a sensor never sees another one fire. Put a door, hatch window or toy blocks between them.' : 'Nothing in the ' + (S.gSensor > 1 ? S.gSensor + ' tiles' : 'tile') + ' in front of it can move (' + listNames(rec.watch) + '), so it never fires.'), true); }
  }
  if (by && by.length) line('Worked by ' + listNames(by.map(r => ITEMS[r.ob.i].n + ' at ' + at(r.ob))) + ': ' + (by.length > 1 ? 'each ' : 'it ') + sigEffect(it, by[0].kind) + '.' + (sigNoPower(ob) ? ' ⚠ It has no power, so it ignores them.' : '') + (WANDER.test(it.n) ? ' Wandering Pokémon can open it too, which a sensor sees.' : ''), sigNoPower(ob), S_TIP);
}
function sigShown() { if (!SIG || !SIG.any) return null; if (showSignals) return [...SIG.inputs.values()]; const sel = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null; if (!sel) return null; const rec = SIG.inputs.get(sel.id); if (rec) return [rec]; const by = SIG.of.get(sel.id); return by && by.length ? by : null; }
function drawSignalLines(c, pt, recs, s) {
  c.save(); c.lineCap = 'round'; const col = REACH_COL.signal, r = Math.max(4, Math.min(9, s * 0.22));
  for (const rec of recs) {
    const a = pt(rec.ob.x, rec.ob.y, zOf(rec.ob));
    for (const q of rec.targets) { const b = pt(q.x + (q.w - 1) / 2, q.y + (q.h - 1) / 2, zOf(q)), bad = sigNoPower(q); c.strokeStyle = bad ? theme.bad : col; c.globalAlpha = 0.9; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]); c.lineWidth = 2.5; c.beginPath(); c.arc(b[0], b[1], r, 0, 7); c.stroke(); }
    if (!rec.targets.length || (rec.watch && !rec.moving)) { c.globalAlpha = 1; c.fillStyle = theme.warn; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(a[0] + s * 0.32, a[1] - s * 0.32, Math.max(3.5, Math.min(7, s * 0.16)), 0, 7); c.fill(); c.stroke(); }
  }
  c.restore();
}
function drawSignals(c, s) {
  const recs = sigShown(); if (!recs) return;
  const sel = selection && selection.obj ? selection.obj : null;
  if (showSignals) for (const rec of recs) if (rec.ob !== sel) { const R = reachCached(rec.ob); if (R) drawReachShape(c, s, R, false); }
  if (sel && !SIG.inputs.has(sel.id)) for (const rec of recs) { const R = reachCached(rec.ob); if (R) drawReachShape(c, s, R, false); }
  drawSignalLines(c, (x, y) => [view.px + (x + 0.5) * s, view.py + (y + 0.5) * s], recs, s);
}
function setShowSignals(v) { showSignals = v; LS.set(LSK + 'signals', v ? '1' : '0'); sysSync(); requestDraw(); }
let pourMode = 'paint', pourLow = false, pourPrev = null, FLOWIX = null;
const FL_ROOT = 1, FL_FALL = 2, FL_RUN = 3;
const canPour = (it) => !!it && !!it.lq && !it.lq[2];
const flowKey = (k, z) => (z - ZMIN) * plan.w * plan.h + k;
function flowIndex() { const m = new Map(); for (const s of plan.src || []) for (const c of s.cells) m.set(Math.floor(c / 4), { s, f: c % 4 }); FLOWIX = m; }
function flowAt(k, z) { return FLOWIX ? FLOWIX.get(flowKey(k, z)) || null : null; }
function flowFall(i) { const it = ITEMS[i]; return it.n === 'Water' ? BY_NAME.get('Waterfall') : it; }
function computeFlow(x, y, z, i, low) {
  const W = plan.w, it = ITEMS[i], liq = i + 1, fallIt = flowFall(i), S0 = (low ? Math.floor(it.lq[0] / 2) : it.lq[0]) - 1, water = it.n !== 'Lava';
  const srcKeys = new Set((plan.src || []).map(s => flowKey(s.y * W + s.x, s.z)));
  const enter = (k, z) => { if (z < ZMIN || z > ZMAX || occAt(plan, k, z)) return 0; const t = terrAt(plan, k, z); if (!t) return 1; const kk = flowKey(k, z); if (srcKeys.has(kk)) return 0; if (FLOWIX && FLOWIX.has(kk)) return 1; if (t === liq || t === fallIt.i + 1) return 2; return 0; };
  const solidBelow = (k, z) => z - 1 < ZMIN || (!!terrAt(plan, k, z - 1) && !(FLOWIX && FLOWIX.has(flowKey(k, z - 1)) && FLOWIX.get(flowKey(k, z - 1)).f === FL_FALL)) || !!occAt(plan, k, z - 1);
  const openAt = (k, z) => { if (z < ZMIN || z > ZMAX || occAt(plan, k, z)) return false; const t = terrAt(plan, k, z); return !t || !!ITEMS[t - 1].lq; };
  const cost = (k, z) => { const x = k % W, y = (k / W) | 0; let n = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy; if (inB(plan, a, b) && openAt(b * W + a, z)) n++; } return n <= 2 ? 1 : n === 3 ? 2.5 : 3.5; };
  const wet = new Map(), heap = [], roots = [];
  const hpush = (e) => { heap.push(e); let i2 = heap.length - 1; while (i2 > 0) { const p = (i2 - 1) >> 1; if (heap[p][0] <= heap[i2][0]) break; [heap[p], heap[i2]] = [heap[i2], heap[p]]; i2 = p; } };
  const hpop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i2 = 0; for (; ;) { const l = 2 * i2 + 1, r = l + 1; let m = i2; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i2) break; [heap[m], heap[i2]] = [heap[i2], heap[m]]; i2 = m; } } return top; };
  const visit = (k, z, c, f) => { const kk = flowKey(k, z), e = wet.get(kk); if (e && (e.c <= c || e.f === FL_ROOT)) return false; wet.set(kk, { k, z, c, f, pass: enter(k, z) === 2 }); return true; };
  const root = (k, z) => { if (wet.size > 5000) return; if (visit(k, z, 0, FL_ROOT)) { roots.push([k, z]); hpush([0, k, z]); } };
  const fallFrom = (k, z) => { let zz = z; while (zz > ZMIN && !solidBelow(k, zz)) { const kk = flowKey(k, zz); if (!wet.has(kk) || wet.get(kk).f !== FL_ROOT) wet.set(kk, { k, z: zz, c: 0, f: FL_FALL, pass: enter(k, zz) === 2 }); zz--; if (enter(k, zz) !== 1) return; } root(k, zz); };
  const seek = (k, z) => {
    const prev = new Map([[k, -1]]), q = [[k, 0]];
    while (q.length) { const [c, d] = q.shift(); const cx = c % W, cy = (c / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = cx + dx, b = cy + dy; if (!inB(plan, a, b)) continue; const n = b * W + a; if (prev.has(n) || enter(n, z) !== 1) continue; prev.set(n, c);
        if (!solidBelow(n, z)) { const path = []; for (let p = c; p !== -1; p = prev.get(p)) path.push(p); path.reverse(); path.forEach((p, j) => { if (j) visit(p, z, j, FL_RUN); }); fallFrom(n, z); return true; }
        if (d + 1 < 4) q.push([n, d + 1]); } }
    return false;
  };
  if (!solidBelow(y * W + x, z)) fallFrom(y * W + x, z); else root(y * W + x, z);
  let guard = 0;
  while (heap.length && guard++ < 20000) {
    const [c, k, zz] = hpop(), e = wet.get(flowKey(k, zz)); if (!e || e.c !== c) continue;
    if (e.f === FL_ROOT && water && !low && seek(k, zz)) continue;
    const cx = k % W, cy = (k / W) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue; const a = cx + dx, b = cy + dy; if (!inB(plan, a, b)) continue; const n = b * W + a;
      const en = enter(n, zz); if (!en) continue; const nc = c + cost(n, zz) * (dx && dy ? 1.5 : 1); if (nc > S0) continue;
      if (!solidBelow(n, zz)) { const kk = flowKey(n, zz); if (!wet.has(kk)) fallFrom(n, zz); continue; }
      if (visit(n, zz, nc, 0)) hpush([nc, n, zz]);
    }
    if (wet.size > 5000) break;
  }
  const cells = [...wet.values()].filter(e => !e.pass), lavaWater = [];
  const isWaterT = (v) => !!v && !!ITEMS[v - 1].lq && ITEMS[v - 1].n !== 'Lava';
  for (const e of cells) { const ex = e.k % W, ey = (e.k / W) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = ex + dx, b = ey + dy; if (!inB(plan, a, b)) continue; const v = terrAt(plan, b * W + a, e.z); if (water ? v && ITEMS[v - 1].n === 'Lava' : isWaterT(v)) { lavaWater.push([a, b]); break; } } if (lavaWater.length) break; }
  return { x, y, z, i, low, cells, falls: cells.filter(e => e.f === FL_FALL).length, roots: roots.length, lavaWater, capped: wet.size > 5000 };
}
function pourTap(cx, cy) {
  const it = currentItem(), k = cy * plan.w + cx, tz = topTerr(k), top = tz == null ? 0 : terrAt(plan, k, tz);
  if (pourPrev && pourPrev.x === cx && pourPrev.y === cy) { pourCommit(); return; }
  if (top && ITEMS[top - 1].lq && layerZ == null) { toast('There\'s liquid here already. Pour next to it.'); return; }
  const z = layerZ != null ? layerZ : standZ(k);
  if (occAt(plan, k, z) || terrAt(plan, k, z)) { toast('Something is in the way on level ' + lvNum(z)); return; }
  pourPrev = computeFlow(cx, cy, z, it.i, pourLow); renderOptbar(); requestDraw();
}
function pourCommit() {
  const P = pourPrev; if (!P) return; pourPrev = null; const it = ITEMS[P.i], fallIt = flowFall(P.i), N = plan.w * plan.h;
  beginTx(); const keys = new Set();
  for (const e of P.cells) { setTerr(e.k, e.z, (e.f === FL_FALL ? fallIt : it).i + 1); keys.add(flowKey(e.k, e.z)); }
  const src = { id: uid(), x: P.x, y: P.y, z: P.z, i: P.i, low: !!P.low, cells: P.cells.map(e => flowKey(e.k, e.z) * 4 + (e.f || 0)) };
  setSources([...(plan.src || []).map(s => ({ ...s, cells: s.cells.filter(c => !keys.has(Math.floor(c / 4))) })), src]);
  commitTx('Pour ' + it.n.toLowerCase()); renderOptbar();
  toast(it.n + ' poured: ' + P.cells.length + ' tile' + (P.cells.length === 1 ? '' : 's') + (P.falls ? ', ' + P.falls + ' falling' : ''));
}
function pourCancel() { if (!pourPrev) return; pourPrev = null; renderOptbar(); requestDraw(); }
function setSources(next) { beginTx(); if (!tx.s) tx.s = [plan.src || []]; plan.src = next; tx.s[1] = next; }
function removeFlow(s, keep) {
  const N = plan.w * plan.h, liq = s.i + 1, fall = flowFall(s.i).i + 1, others = new Set((plan.src || []).filter(q => q !== s).flatMap(q => q.cells.map(c => Math.floor(c / 4))));
  for (const c of s.cells) { const kk = Math.floor(c / 4); if (others.has(kk) || kk === keep) continue; const z = Math.floor(kk / N) + ZMIN, k = kk % N, t = terrAt(plan, k, z); if (t === liq || t === fall) setTerr(k, z, 0); }
}
function flowSourcesCheck() {
  if (!tx || !plan.src || !plan.src.length) return;
  const gone = plan.src.filter(s => { const k = s.y * plan.w + s.x, t = terrAt(plan, k, s.z); return (t !== s.i + 1 && t !== flowFall(s.i).i + 1) || occAt(plan, k, s.z); });
  if (!gone.length) return;
  for (const s of gone) removeFlow(s, null);
  setSources(plan.src.filter(s => !gone.includes(s)));
}
function drawPourPreview(c, s) {
  if (selection && selection.flow && plan.src && plan.src.includes(selection.flow)) { const F = selection.flow, N = plan.w * plan.h, cells = new Set(F.cells.map(q => Math.floor(q / 4) % N)); c.save(); c.strokeStyle = theme.accent; c.lineWidth = 2; c.globalAlpha = 0.9; c.beginPath(); for (const k of cells) { const x = k % plan.w, y = (k / plan.w) | 0, px = view.px + x * s, py = view.py + y * s; if (!cells.has(k - plan.w)) { c.moveTo(px, py); c.lineTo(px + s, py); } if (!cells.has(k + plan.w)) { c.moveTo(px, py + s); c.lineTo(px + s, py + s); } if (x === 0 || !cells.has(k - 1)) { c.moveTo(px, py); c.lineTo(px, py + s); } if (x === plan.w - 1 || !cells.has(k + 1)) { c.moveTo(px + s, py); c.lineTo(px + s, py + s); } } c.stroke(); c.lineWidth = 3; c.strokeRect(view.px + F.x * s + 1.5, view.py + F.y * s + 1.5, s - 3, s - 3); c.restore(); }
  const P = pourPrev; if (!P) return; const it = ITEMS[P.i], col = it.col || '#4aa2d6';
  c.save(); for (const e of P.cells) { const x = e.k % plan.w, y = (e.k / plan.w) | 0; c.globalAlpha = e.f === FL_FALL ? 0.75 : 0.5; c.fillStyle = col; c.fillRect(view.px + x * s, view.py + y * s, s, s); }
  c.globalAlpha = 1; c.strokeStyle = theme.accent; c.lineWidth = 3; c.strokeRect(view.px + P.x * s + 1.5, view.py + P.y * s + 1.5, s - 3, s - 3); c.restore();
}
function showFlowInspector(s) {
  const it = ITEMS[s.i], n = s.cells.length, falls = s.cells.filter(c => c % 4 === FL_FALL).length, runs = s.cells.filter(c => c % 4 === FL_RUN).length;
  selection = { flow: s };
  const box = inspectorShell(it.n + ' (poured)', swatchEl(it), (s.low ? 'Low' : 'Normal') + ' level · source at ' + s.x + ', ' + s.y + ', level ' + lvNum(s.z), 'Liquid poured from a source tile. Erasing the source tile, or putting something on it, removes the whole flow, as in the game.');
  box.append(h('div', { class: 'note', style: 'margin-top:6px' }, 'Covers ' + n + ' tile' + (n === 1 ? '' : 's') + (falls ? ', ' + falls + ' of them falling' : '') + '.' + (runs ? ' It runs straight to a drop ' + runs + ' tile' + (runs === 1 ? '' : 's') + ' away, so that stretch is flowing water, which doesn\'t water fields.' : '')));
  box.append(h('div', { class: 'note', style: 'margin-top:6px' }, 'Its edge should be within a tile of what\'s shown: in the game the shape also depends on the order you dug and filled things. Pour again after changing the ground around it.'));
  box.acts.append(ibtn('rotate', 'Pour again', () => repour(s), 'primary'), ibtn('trash', 'Remove it', () => { beginTx(); removeFlow(s, null); const k = s.y * plan.w + s.x; if ([s.i + 1, flowFall(s.i).i + 1].includes(terrAt(plan, k, s.z))) setTerr(k, s.z, 0); setSources((plan.src || []).filter(q => q.id !== s.id)); commitTx('Remove ' + it.n.toLowerCase()); closeInspector(); }, 'danger'));
  requestDraw();
}
function repour(s) {
  beginTx(); removeFlow(s, null); const k = s.y * plan.w + s.x; if ([s.i + 1, flowFall(s.i).i + 1].includes(terrAt(plan, k, s.z))) setTerr(k, s.z, 0); setSources((plan.src || []).filter(q => q.id !== s.id)); flowIndex();
  pourPrev = computeFlow(s.x, s.y, s.z, s.i, s.low); pourCommit(); closeInspector(); const ns = (plan.src || [])[plan.src.length - 1]; if (ns) showFlowInspector(ns);
}
let showDrops = LS.get(LSK + 'drops') === '1';
const PROC = { Chop: ['small logs', 'lumber', '1 → 5'], Burn: ['squishy clay', 'bricks', '1 → 2'], Crush: ['berries', 'paint', '1 → 5'], Recycle: ['nonburnable garbage', 'iron ore', '1 → 2'] };
const DROP_TIP = 'Drops land on the ring 1 tile around a kit house (not its corners), or on a built house\'s floor and 1 tile outside its walls, wherever the Pokémon happens to be. Each tile needs a block under it and no item or liquid on it. More comfort means more drops, and nothing drops while Ditto is watching.';
function dropTile(x, y, L) {
  if (!inB(plan, x, y)) return null; const k = y * plan.w + x; if (L == null) L = standZ(k);
  const o = occAt(plan, k, L), q = o && plan.objs.get(o), t = terrAt(plan, k, L); let why = '';
  if (t && ITEMS[t - 1].lq) why = 'liquid'; else if (t) why = 'a block'; else if (q && !isDoor(ITEMS[q.i])) why = ITEMS[q.i].n.toLowerCase(); else if (!terrAt(plan, k, L - 1) && !occAt(plan, k, L - 1)) why = 'nothing under it';
  return { x, y, k, ok: !why, why };
}
function litterTiles(home) {
  const out = [];
  if (home.kind === 'kit') { const ob = home.ob, L = zOf(ob); for (let x = ob.x; x < ob.x + ob.w; x++) out.push(dropTile(x, ob.y - 1, L), dropTile(x, ob.y + ob.h, L)); for (let y = ob.y; y < ob.y + ob.h; y++) out.push(dropTile(ob.x - 1, y, L), dropTile(ob.x + ob.w, y, L)); }
  else if (home.kind === 'house') { const hs = home.hs, R = hs.area.outer; for (const k of hs.cells) out.push(dropTile(k % plan.w, (k / plan.w) | 0, hs.level)); for (let x = R.x; x < R.x + R.w; x++) out.push(dropTile(x, R.y - 1), dropTile(x, R.y + R.h)); for (let y = R.y; y < R.y + R.h; y++) out.push(dropTile(R.x - 1, y), dropTile(R.x + R.w, y)); }
  return out.filter(Boolean);
}
const litterers = (pks) => pks.filter(p => (p.s || []).includes('Litter'));
function nearestBox(hm) { const boxes = boxesFor(hm); if (!boxes.length) return null; const R = hm.rect, cx = R.x + R.w / 2, cy = R.y + R.h / 2; return boxes.sort((a, b) => Math.abs(a.x - cx) + Math.abs(a.y - cy) - Math.abs(b.x - cx) - Math.abs(b.y - cy))[0]; }
function workers(hm) { const out = []; for (const p of hm.pks) for (const sp of Object.keys(PROC)) if ((p.s || []).includes(sp)) out.push({ p, sp }); return out; }
function workLines(key, home) {
  const out = [], hm = homeRanges().find(x => x.key === key); if (!hm) return out;
  const line = (txt, bad, tip) => out.push(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const lit = litterers(hm.pks);
  if (lit.length) {
    if (home && home.kind !== 'habitat') { const tiles = litterTiles(home), ok = tiles.filter(t => t.ok).length; for (const p of lit) line(ok ? '🍂 ' + p.n + ' drops ' + (p.lt || 'its material').toLowerCase() + ' on the ' + ok + ' free tile' + (ok === 1 ? '' : 's') + ' of ' + tiles.length + ' around ' + (home.kind === 'kit' ? 'the kit' : 'the house') + '.' : '⚠ ' + p.n + '\'s ' + (p.lt || 'material').toLowerCase() + ' has nowhere to land: every tile around ' + (home.kind === 'kit' ? 'the kit' : 'the house') + ' has an item, liquid or nothing under it.', !ok, DROP_TIP); }
    else line('🍂 ' + listNames(lit.map(p => p.n + ' (' + (p.lt || 'its material').toLowerCase() + ')')) + ' drop' + (lit.length === 1 ? 's' : '') + ' materials around the habitat. Exactly where isn\'t known; in a house or kit, the planner shows the tiles.', false, DROP_TIP);
  }
  const wk = workers(hm);
  if (wk.length) { const box = nearestBox(hm); for (const { p, sp } of wk) { const [a, b, r] = PROC[sp]; line(box ? '⚙ ' + p.n + ' (' + sp + ') turns ' + a + ' into ' + b + ' (' + r + ') from the community box at ' + box.x + ', ' + box.y + '.' : '⚠ ' + p.n + ' (' + sp + ') has no community box in reach to work from, so it can\'t turn ' + a + ' into ' + b + '.', !box, 'Processing Pokémon take what you put in the community box nearest their home and put the result back in it. The box must sit wholly within 4 tiles of the home\'s dotted line.'); } }
  return out;
}
function machineLines(ob) {
  const it = ITEMS[ob.i], out = [], line = (txt, bad, tip) => out.push(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const near = (sp) => { const s2 = new Set(); for (const hm of homeRanges()) { const R = hm.rect; if (ob.x < R.x || ob.y < R.y || ob.x >= R.x + R.w || ob.y >= R.y + R.h || Math.abs(zOf(ob) - hm.base) > AREA_R) continue; for (const p of hm.pks) if ((p.s || []).includes(sp)) s2.add(p.n); } return [...s2]; };
  if (/smelting furnace$/i.test(it.n)) { const b = near('Burn'), g = near('Gather'); line(b.length ? '🔥 Run by ' + listNames(b.slice(0, 3)) + '. It smelts one kind of material at a time.' : '⚠ No Burn Pokémon lives within reach, so nobody runs it.', !b.length, 'A Burn Pokémon living nearby smelts ores into ingots, sand, sandstone or volcanic ash into glass, and fragments into Pokémetal. It keeps going until the furnace is empty.'); if (g.length) line('Filled from the community box by ' + listNames(g.slice(0, 3)) + '.'); }
  if (it.n === 'Concrete mixer') { const c = near('Crush'); line(c.length ? '⚙ Run by ' + listNames(c.slice(0, 3)) + '.' : '⚠ No Crush Pokémon lives within reach, so nobody runs it.', !c.length, 'A Crush Pokémon living nearby turns limestone into concrete. Guides say the mixer also needs water, and that a batch takes about an hour.'); }
  return out;
}
function crowdCount() { const s2 = new Set((plan.res || []).map(r => r.p)); for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'habitat' && r.ok) for (const n of r.best.hb.p) if (!homeOfPokemon(n)) s2.add(n); } return s2.size; }
function dropHomes() { const out = []; for (const hs of autoHouses) if (!hs.enclosure) { const home = houseHome(hs), lit = litterers(residentsOf(home).map(r => PK_BY_NAME.get(r.p)).filter(Boolean)); if (lit.length) out.push({ home, lit }); } for (const ob of plan.objs.values()) if (ITEMS[ob.i].cap) { const home = kitHome(ob), lit = litterers(residentsOf(home).map(r => PK_BY_NAME.get(r.p)).filter(Boolean)); if (lit.length) out.push({ home, lit }); } return out; }
function dropsShown() {
  const sel = selection; let one = null;
  if (sel && sel.obj && plan.objs.has(sel.obj.id) && ITEMS[sel.obj.i].cap) one = kitHome(sel.obj); else if (sel && sel.house) { const hs = houseById.get(sel.house); if (hs) one = houseHome(hs); }
  const all = showDrops ? dropHomes() : [];
  if (one && !all.some(d => d.home.key === one.key)) { const lit = litterers(residentsOf(one).map(r => PK_BY_NAME.get(r.p)).filter(Boolean)); if (lit.length) all.push({ home: one, lit }); }
  return all;
}
function drawDrops(c, s) {
  const list = dropsShown(); if (!list.length) return; c.save();
  for (const { home, lit } of list) {
    const tiles = litterTiles(home);
    for (const t of tiles) { const px = view.px + t.x * s, py = view.py + t.y * s; if (t.ok) { c.globalAlpha = 0.35; c.fillStyle = REACH_COL.berry; c.fillRect(px + 1, py + 1, s - 2, s - 2); } else if (s >= 8) { c.globalAlpha = 0.85; c.strokeStyle = theme.bad; c.lineWidth = 1.5; c.strokeRect(px + 2, py + 2, s - 4, s - 4); } }
    if (s >= 10 && tiles.length) { const t0 = tiles[0], txt = [...new Set(lit.map(p => p.lt || '?'))].join(', '); c.globalAlpha = 1; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const tw = c.measureText(txt).width + 8; c.fillStyle = REACH_COL.berry; roundRect(c, view.px + t0.x * s, view.py + t0.y * s - 16, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(txt, view.px + t0.x * s + 4, view.py + t0.y * s - 14); }
  }
  c.restore();
}
function setShowDrops(v) { showDrops = v; LS.set(LSK + 'drops', v ? '1' : '0'); sysSync(); requestDraw(); }
function setShowWater(v) { showWater = v; LS.set(LSK + 'water', v ? '1' : '0'); sysSync(); requestDraw(); }
function setShowPower(v) { showPower = v; LS.set(LSK + 'power', v ? '1' : '0'); sysSync(); requestDraw(); }
function powerNetOf(ob) { if (!POWER) return null; const t = POWER.tx.get(ob.id); if (t) return t.net; const d = POWER.dev.get(ob.id); if (d && d.tx) return d.tx.net; const g = POWER.gen.get(ob.id); if (g && g.tx) return g.tx.net; return null; }
function drawPowerLines(c, P, pt, nets, s, all) {
  const col = (N) => N.over ? theme.bad : N.on ? REACH_COL.power : theme.muted;
  c.save(); c.lineCap = 'round';
  for (const N of nets) for (const t of N.tx) {
    const a = pt(t.foot[0], t.foot[1], topOf(t.ob));
    if (t.gen) { const f = powerFoot(t.gen.ob), b = pt(f[0], f[1], zOf(t.gen.ob)); c.strokeStyle = col(N); c.lineWidth = 3; c.globalAlpha = 0.9; c.setLineDash([]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (const o of t.links) if (o.ob.id > t.ob.id) { const b = pt(o.foot[0], o.foot[1], topOf(o.ob)), bad = t.blocked.some(q => q.to === o); c.strokeStyle = bad ? theme.warn : col(N); c.lineWidth = 2.2; c.globalAlpha = 0.85; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (const d of t.devs) { const b = pt(d.ob.x + (d.ob.w - 1) / 2, d.ob.y + (d.ob.h - 1) / 2, zOf(d.ob)); c.strokeStyle = col(N); c.lineWidth = 1.2; c.globalAlpha = 0.6; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
  }
  c.setLineDash([]); c.globalAlpha = 1; const r = Math.max(3.5, Math.min(7, s * 0.16));
  for (const d of P.dev.values()) { if (!all && !(d.tx && nets.includes(d.tx.net))) continue; const b = pt(d.ob.x + d.ob.w - 1, d.ob.y, zOf(d.ob) + htOf(d.ob) - 1); c.fillStyle = d.on ? theme.good : theme.bad; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(b[0] + s * 0.32, b[1] - s * 0.32, r, 0, 7); c.fill(); c.stroke(); }
  if (s >= 7) for (const N of nets) { const t = N.tx[0], a = pt(t.foot[0], t.foot[1], topOf(t.ob)), txt = N.supply ? N.draw + ' of ' + N.supply + ' power' + (N.over ? ' · overloaded' : '') : 'no generator'; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const tw = c.measureText(txt).width + 8; c.fillStyle = col(N); roundRect(c, a[0] + 6, a[1] + 6, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(txt, a[0] + 10, a[1] + 8); }
  c.restore();
}
function powerShown() { const sel = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null, N = sel ? powerNetOf(sel) : null; if (!POWER || !POWER.any) return null; if (showPower) return POWER.nets; return N ? [N] : null; }
function drawPower(c, s) { const nets = powerShown(); if (!nets) return; drawPowerLines(c, POWER, (x, y) => [view.px + (x + 0.5) * s, view.py + (y + 0.5) * s], nets, s, showPower); }
function setShowReach(v) { showReach = v; LS.set(LSK + 'reach', v ? '1' : '0'); sysSync(); requestDraw(); }
function houseAt(x, y) { if (!cellHouse || !inB(plan, x, y)) return null; const i = cellHouse[y * plan.w + x]; return i >= 0 ? autoHouses[i] : null; }
function houseIssues(hs) { const out = []; if (!hs.doors.size) out.push('needs a door'); else if (!hs.clearDoors) out.push('door blocked'); if (!hs.sizeOk) out.push(hs.w < 2 || hs.h < 2 ? 'too small' : 'too big'); if (hs.furn < 3) out.push(hs.furn + '/3 furniture kinds'); return out; }
function countsFor(hb, it) { for (const [tok] of hb.r) { if (GROUPS.has(tok) ? GROUPS.get(tok).has(it.i) : BY_NAME.get(DATA.terrainReq[tok] || tok) === it) return true; } return false; }
function computeArea(z, r) {
  if (z.kind === 'label') return null;
  if (z.kind === 'house') {
    const cells = new Set(); let walls = 0;
    for (let y = Math.max(0, z.y); y < Math.min(plan.h, z.y + z.h); y++) for (let x = Math.max(0, z.x); x < Math.min(plan.w, z.x + z.w); x++) {
      const k = y * plan.w + x, ob = objAtLv(k, standZ(k));
      if (ob && isWall(ITEMS[ob.i])) { walls++; continue; } cells.add(k);
    }
    return { kind: 'house', cells, rect: { x: z.x, y: z.y, w: z.w, h: z.h }, walls };
  }
  const hb = r && (r.best ? r.best.hb : r.target || (r.near && r.near.hb));
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; const own = new Set();
  if (hb) for (let y = Math.max(0, z.y); y < Math.min(plan.h, z.y + z.h); y++) for (let x = Math.max(0, z.x); x < Math.min(plan.w, z.x + z.w); x++) {
    const k = y * plan.w + x, g = surfAt(k), ob = objAtLv(k, standZ(k));
    let hit = false;
    if (ob && countsFor(hb, ITEMS[ob.i])) { hit = true; own.add(ob.id); }
    if (g && countsFor(hb, ITEMS[g - 1])) hit = true;
    if (hit) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  if (x1 < 0) { x0 = z.x; y0 = z.y; x1 = z.x + z.w - 1; y1 = z.y + z.h - 1; }
  let base = Infinity; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inB(plan, x, y)) base = Math.min(base, standZ(y * plan.w + x)); if (base === Infinity) base = 1;
  const rx = Math.max(0, x0 - AREA_R), ry = Math.max(0, y0 - AREA_R), rx1 = Math.min(plan.w - 1, x1 + AREA_R), ry1 = Math.min(plan.h - 1, y1 + AREA_R);
  return { kind: 'habitat', rect: { x: rx, y: ry, w: rx1 - rx + 1, h: ry1 - ry + 1 }, foot: { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }, base, own, hb };
}
function inArea(a, x, y, z) {
  if (!a) return false; const k = y * plan.w + x;
  if (a.kind === 'house') { if (!a.outer) return a.cells.has(k); if (x < a.rect.x || y < a.rect.y || x >= a.rect.x + a.rect.w || y >= a.rect.y + a.rect.h) return false; if (z == null) return true; const d = z - a.base; return d >= -4 && d <= 3; }
  return x >= a.rect.x && y >= a.rect.y && x < a.rect.x + a.rect.w && y < a.rect.y + a.rect.h && (z == null || Math.abs(z - a.base) <= AREA_R);
}
function areaContents(a) {
  const out = new Map(); let n = 0; if (!a) return { n, out };
  for (const ob of plan.objs.values()) {
    if (a.own && a.own.has(ob.id)) continue; const it = ITEMS[ob.i];
    if (it.c === 'Terrain' || it.c === 'Kits' || isWall(it) || /door|gate/i.test(it.n)) continue;
    if (objInArea(ob, a)) { n++; const c = CAT_META[it.c] ? CAT_META[it.c].label : it.c; out.set(c, (out.get(c) || 0) + 1); }
  }
  return { n, out };
}
function areaSummary(a) {
  if (!a) return '';
  if (a.kind === 'house') return a.outer ? 'The active area is the dotted line: ' + a.rect.w + '×' + a.rect.h + ' tiles, 4 past the walls on every side, from 4 levels below to 3 above the door. Favourite items and furniture count anywhere in it, even outside the walls, if the Pokémon can walk to them. Items on top of walls, tables or other items count at their own height. Light, warmth and humidity only count the floor inside the walls (the lighter tiles) and the door tiles, from 1 below to 3 above.' : 'The active area is the floor inside the walls (' + a.cells.size + ' tiles, door included).';
  return 'The active area is the dotted line: ' + a.rect.w + '×' + a.rect.h + ' tiles, ' + AREA_R + ' past the habitat (' + a.foot.w + '×' + a.foot.h + ') on every side and ' + AREA_R + ' levels up or down.';
}
let firstEval = true;
function evaluateAll() {
  evalSeq++; REACH_CACHE.clear();
  flowIndex();
  const prev = zoneStatus; zoneStatus = new Map();
  for (const z of plan.zones) { const r = evaluateZone(z); r.area = computeArea(z, r); zoneStatus.set(z.id, r); const p = prev.get(z.id); if (!firstEval && r.ok && (!p || !p.ok) && r.kind !== 'label') celebrate(z, r); }
  detectHouses();
  computePower();
  computeFields();
  computeSignals();
  checkProblems(); updateStatus();
  firstEval = false;
}
function planPokemon() { const set = new Map(); for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'habitat' && r.ok) for (const n of r.best.hb.p) if (!set.has(n)) set.set(n, r.best.hb); } return set; }
function prefabTotal() { let n = 0; for (const ob of plan.objs.values()) n += ITEMS[ob.i].pv || 0; return n; }
function housingCapacity() { let cap = 0, kits = 0; for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (it.c === 'Kits') { kits++; cap += it.cap || 0; } } for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'house' && r.ok) cap += 4; } let built = 0; for (const hs of autoHouses) if (hs.ok) { cap += 4; built++; } return { cap, kits, built }; }

function materialTotals(raw) {
  const need = new Map(), gather = new Map(); let crafted = 0, natural = 0;
  const addM = (n, q) => need.set(n, (need.get(n) || 0) + q);
  const addItem = (it, mult) => {
    if (it.c === 'Terrain') return;
    if (it.m && it.m.length) { crafted += mult; for (const [m, q] of it.m) addM(m, q * mult); }
    else { natural += mult; gather.set(it.n, (gather.get(it.n) || 0) + mult); }
  };
  for (const ob of plan.objs.values()) addItem(ITEMS[ob.i], 1);
  const gc = new Map(); for (const T of plan.tt) for (let k = 0; k < T.length; k++) { const g = T[k]; if (g) gc.set(g - 1, (gc.get(g - 1) || 0) + 1); }
  for (const r of rugsOf(plan)) gc.set(r.i, (gc.get(r.i) || 0) + 1);
  for (const [i, n] of gc) addItem(ITEMS[i], n);
  let out = need;
  if (raw) {
    out = new Map();
    const expand = (n, q) => { const pr = DATA.process[n]; if (pr) expand(pr[0], q * pr[1]); else out.set(n, (out.get(n) || 0) + q); };
    for (const [n, q] of need) expand(n, q);
    for (const [n, q] of out) out.set(n, Math.ceil(q - 1e-9));
  }
  return { need: out, processed: need, gather, crafted, natural };
}

const LIMITS = [
  ['Generators', (it) => !!it.pg && it.n !== 'Furnace kit', 128, 'Mini generators, windmills and waterwheels. It was 64 before Ver. 2.0.0. Furnace kits have their own count.'],
  ['Transmitters', (it) => !!it.pt, 252, 'Utility poles and wireless transmitters. Serebii says 256. Past the cap, new ones don\'t work.'],
  ['Powered items', (it) => it.pd != null, 1024, 'Everything that needs power, including lights that use none. It was 512 before Ver. 1.1.0.'],
  ['Field crops', (it) => it.sub === 'Crops', (p) => p.area === 'Cloud Island' ? 576 : 511, 'One per field tile, 576 on Cloud Islands. The game warns when they fruit.'],
  ['Growing plants', (it) => !!it.cg, 1024, 'Trees, flowers, hedges and crops while they grow. Fully grown plants don\'t count, so plant in batches if you\'re over.'],
  ['Berry trees', (it) => GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i), 226, 'Past the cap, trees can\'t be headbutted.'],
  ['Pointy trees', (it) => it.n === 'Pointy tree', 251, ''],
  ['Furnaces and mixers', (it) => /^(Smelting furnace|Metallic smelting furnace|Concrete mixer)$/.test(it.n), 128, 'Smelting furnaces, metallic smelting furnaces and concrete mixers together.'],
  ['Workbenches and cooking pots', (it) => /^(Workbench|Cooking pot|Stylish cooking pot|Camping cooking pot)$/.test(it.n), 128, ''],
  ['Community boxes', (it) => isBox(it), 32, ''],
  ['Lift platforms', (it) => it.n === 'Lift platform', 32, ''],
  ['Elevator platforms', (it) => it.n === 'Elevator platform', 32, ''],
  ['Cameras', (it) => /camera$/i.test(it.n), 8, '']
];
function placedCounts() {
  const n = new Map(), add = (i) => n.set(i, (n.get(i) || 0) + 1);
  for (const ob of plan.objs.values()) { add(ob.i); if (ob.int) for (const f of ob.int.f || []) if (f) for (const o of f.o) add(o[0]); }
  return n;
}
function limitRows() {
  const cnt = placedCounts();
  return LIMITS.map(([label, test, cap, tip]) => { let n = 0; for (const [i, q] of cnt) if (test(ITEMS[i])) n += q; return { label, n, cap: typeof cap === 'function' ? cap(plan) : cap, tip }; });
}
let PROBS = [];
function checkProblems() {
  const out = [];
  for (const r of limitRows()) if (r.n > r.cap) out.push({ text: r.label + ': ' + fmt(r.n) + ' of ' + fmt(r.cap), tip: 'Over the game\'s cap for one area. ' + r.tip, tab: 'materials' });
  if (POWER && POWER.any) {
    const at = (o) => ITEMS[o.i].n + ' at ' + o.x + ', ' + o.y;
    for (const N of POWER.nets) if (N.over) out.push({ text: 'Power network overloaded: uses ' + N.draw + ' of ' + N.supply, tip: 'Everything on it goes off. Add a generator, or move items onto another network.', ob: N.tx[0].ob });
    const off = [...POWER.dev.values()].filter(d => !d.on && !(d.tx && d.tx.net.over));
    if (off.length) out.push({ text: off.length + (off.length > 1 ? ' items have' : ' item has') + ' no power', tip: off.slice(0, 4).map(d => at(d.ob) + ': ' + powerWhy(d)).join('. ') + (off.length > 4 ? '. And ' + (off.length - 4) + ' more.' : '.'), ob: off[0].ob });
    for (const g of POWER.gen.values()) if (!g.tx) out.push({ text: at(g.ob) + ' isn\'t connected', tip: 'Each generator needs a transmitter of its own within 10 tiles.', ob: g.ob });
    for (const t of POWER.tx.values()) for (const q of t.blocked) out.push({ text: 'Wire blocked at ' + q.at.x + ', ' + q.at.y, tip: q.at.what + ' is in the way between ' + at(t.ob) + ' and ' + at(q.to.ob) + '. It only works if the wire was strung first.', ob: t.ob });
  }
  if (SIG && SIG.any) {
    const at = (o) => ITEMS[o.i].n + ' at ' + o.x + ', ' + o.y;
    for (const rec of SIG.inputs.values()) { if (!rec.targets.length) out.push({ text: at(rec.ob) + ' reaches nothing', tip: 'Nothing that responds to it is within its reach: doors, windows, lights and appliances with power, switch transmitters, floodgates, music mats or bells.', ob: rec.ob }); if (rec.watch && !rec.moving) out.push({ text: at(rec.ob) + ' never fires', tip: rec.onlySensor ? 'It only sees another laser sensor, and a sensor never sees one fire.' : 'Nothing in front of it can move.', ob: rec.ob }); }
  }
  if (FIELDS && FIELDS.any) {
    const crops = [...FIELDS.cells.values()].filter(c => c.crop), n = (st) => crops.filter(c => c.state === st), pl = (a, one, many) => a.length + ' crop tile' + (a.length > 1 ? 's ' + many : ' ' + one);
    const dry = n('dry'), dried = n('dried'), bad = [...n('lava'), ...n('under')];
    if (dry.length) out.push({ text: pl(dry, 'is dry', 'are dry'), tip: 'Crops only grow on days they\'re wet. ' + fieldWhy(dry[0]) + '.', ob: dry[0].crop });
    if (dried.length) out.push({ text: pl(dried, 'is dried out', 'are dried out') + ' by a Smooth Rock', tip: fieldWhy(dried[0]) + '. Rain or a running sprinkler that reaches the rock stops it.', ob: dried[0].crop });
    if (bad.length) out.push({ text: pl(bad, 'can\'t be watered', 'can\'t be watered'), tip: fieldWhy(bad[0]) + '.', ob: bad[0].crop });
    for (const Q of FIELDS.spr.values()) if (!Q.works) out.push({ text: 'Sprinkler at ' + Q.ob.x + ', ' + Q.ob.y + ' has no water', tip: 'A sprinkler needs water within ' + S.gSprinkler + ' tiles at its own level or one below.', ob: Q.ob });
  }
  { const at = (o) => ITEMS[o.i].n + ' at ' + o.x + ', ' + o.y;
    for (const { home, lit } of dropHomes()) if (!litterTiles(home).some(t => t.ok)) out.push({ text: listNames(lit.map(p => p.n)) + '\'s drops have nowhere to land', tip: 'Every tile around ' + (home.kind === 'kit' ? 'the kit' : 'the house') + ' has an item, liquid or nothing under it. ' + DROP_TIP, ob: home.kind === 'kit' ? home.ob : null });
    const hms = homeRanges(), anyBox = [...plan.objs.values()].some(o => isBox(ITEMS[o.i]));
    for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (!/smelting furnace$/i.test(it.n) && it.n !== 'Concrete mixer') continue; const sp = it.n === 'Concrete mixer' ? 'Crush' : 'Burn'; if (!hms.some(hm => { const R = hm.rect; return ob.x >= R.x && ob.y >= R.y && ob.x < R.x + R.w && ob.y < R.y + R.h && Math.abs(zOf(ob) - hm.base) <= AREA_R && hm.pks.some(p => (p.s || []).includes(sp)); })) out.push({ text: at(ob) + ' has nobody to run it', tip: 'It needs a ' + sp + ' Pokémon living nearby.', ob }); }
    if (anyBox) for (const hm of hms) if (hm.kind !== 'habitat') { const wk = workers(hm); if (wk.length && !nearestBox(hm)) out.push({ text: listNames(wk.map(w => w.p.n)) + ' ' + (wk.length > 1 ? 'have' : 'has') + ' no community box in reach', tip: 'Processing Pokémon work from the community box nearest their home, which must sit wholly within 4 tiles of its dotted line.', ob: hm.ob || null }); }
    const n = crowdCount(); if (n > 25) out.push({ text: n + ' Pokémon live in this area', tip: 'Only 25 show in one area at a time, and the others may stop producing. Pokémon asleep in kit houses at night don\'t count.' });
  }
  PROBS = out;
}
function showProblemAt(ob) { closeModal(); if (!plan.objs.has(ob.id)) return; selection = { obj: ob }; mapView.centerOn(ob.x + ob.w / 2, ob.y + ob.h / 2); toMap(); showObjInspector(ob); requestDraw(); }
function showProblems() {
  modal(PROBS.length === 1 ? '1 problem' : PROBS.length + ' problems', (box) => {
    const l = h('div', { class: 'list' });
    for (const p of PROBS) l.append(h('div', { class: 'row', style: 'cursor:default;align-items:flex-start' }, h('span', { class: 'req miss', style: 'flex:none' }, '!'), h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, p.text), h('div', { class: 'ds', style: 'white-space:normal' }, p.tip)), p.ob ? h('button', { class: 'btn sm', style: 'flex:none', onclick: () => showProblemAt(p.ob) }, 'Show') : ''));
    box.append(l);
  }, 'See limits', () => { openTab('materials', 'half'); });
  const b = $('#modalBox .acts .btn'); if (b) b.textContent = 'Close';
}

const cv = $('#map'); const ctx = cv.getContext('2d');
const view = { zoom: 1, px: 40, py: 60, cs: 26 };
let dpr = 1, W = 0, H = 0, needDraw = true;
const zMin = () => plan ? Math.min(0.15, 0.8 * Math.min((W || 400) / (plan.w * view.cs), (H || 400) / (plan.h * view.cs))) : 0.15;
let theme = {};
function readTheme() { const cs = getComputedStyle(document.documentElement); for (const k of ['map-bg', 'map-empty', 'map-grid', 'map-chunk', 'accent', 'accent-soft', 'good', 'warn', 'bad', 'ink', 'panel', 'line', 'muted']) theme[k] = cs.getPropertyValue('--' + k).trim(); const m = document.querySelector('meta[name="theme-color"]'), pc = cs.getPropertyValue('--paper').trim(); if (m && pc) m.setAttribute('content', pc); requestDraw(); }
function resize() { const r = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); requestDraw(); }
function cellSize() { return view.cs * view.zoom; }
let frame = 0;
function requestDraw() { needDraw = true; if (!frame) frame = requestAnimationFrame(loop); }
function loop(t) { frame = 0; if (RV.on || (hold2d && mapView === map2d)) return; if (needDraw || sparkles.length) { needDraw = false; mapView.draw(t); } if (sparkles.length) frame = requestAnimationFrame(loop); }
const calm = () => S.motion === 'off' || (S.motion !== 'on' && matchMedia('(prefers-reduced-motion: reduce)').matches);
let glide = 0, glideTo = null;
function stopGlide() { if (glide) { cancelAnimationFrame(glide); glide = 0; } }
function glideView(to, anchor, ms = 260) {
  stopGlide(); glideTo = to; const from = { zoom: view.zoom, px: view.px, py: view.py };
  const at = (e) => { const z = from.zoom * Math.pow(to.zoom / from.zoom, e); if (anchor) { const k = z / from.zoom; view.px = anchor[0] - (anchor[0] - from.px) * k; view.py = anchor[1] - (anchor[1] - from.py) * k; } else { view.px = from.px + (to.px - from.px) * e; view.py = from.py + (to.py - from.py) * e; } view.zoom = z; requestDraw(); };
  if (calm() || !plan) { at(1); updateStatus(); return; }
  const t0 = performance.now(), step = (t) => { const k = Math.min(1, (t - t0) / ms); at(1 - Math.pow(1 - k, 3)); if (k < 1) glide = requestAnimationFrame(step); else { glide = 0; updateStatus(); } };
  glide = requestAnimationFrame(step);
}
const map2d = {
  draw: (t) => draw(t),
  pick: (sx, sy) => { const s = cellSize(); return [Math.floor((sx - view.px) / s), Math.floor((sy - view.py) / s)]; },
  anchor() { },
  dragPick: (sx, sy) => map2d.pick(sx, sy),
  cam: () => ({ zoom: view.zoom, px: view.px, py: view.py }),
  setCam: (c) => { view.zoom = c.zoom; view.px = c.px; view.py = c.py; requestDraw(); },
  panBy: (dx, dy) => { view.px += dx; view.py += dy; requestDraw(); },
  zoom: () => view.zoom,
  zoomGoal: () => glide && glideTo ? glideTo.zoom : view.zoom,
  zoomAt(z, sx, sy, smooth) { if (smooth) { glideView({ zoom: z }, [sx, sy], 200); return; } stopGlide(); const k = z / view.zoom; view.px = sx - (sx - view.px) * k; view.py = sy - (sy - view.py) * k; view.zoom = z; requestDraw(); updateStatus(); },
  centerOn(cx, cy, zoom) { const z = zoom || view.zoom, s = view.cs * z; glideView({ zoom: z, px: W / 2 - cx * s, py: H * (innerWidth < 900 ? 0.3 : 0.5) - cy * s }); },
  fit(smooth) { if (!plan) return; const pad = 24; const sheet = innerWidth < 900 ? sheetStops().peek : 0; const avH = H - sheet - 24; const z = clamp(Math.min((W - (innerWidth < 600 ? 16 : pad * 2)) / (plan.w * view.cs), (avH - 56) / (plan.h * view.cs)), zMin(), 3); const s = view.cs * z; const ob = ($('#optbar').getBoundingClientRect().height || 36) + 18; const to = { zoom: z, px: (W - plan.w * s) / 2, py: ob + Math.max(0, (avH - ob - plan.h * s) / 3) }; if (smooth) { glideView(to); return; } stopGlide(); Object.assign(view, to); requestDraw(); updateStatus(); },
  stop: stopGlide,
  touched() { },
  loaded() { },
};
let mapView = map2d, view3d = null, load3d = null;
const in3d = () => mapView !== map2d;
function load3dScript() {
  if (!load3d) { const add = () => new Promise((ok, no) => { if (typeof make3d === 'function') { ok(); return; } const s = document.createElement('script'); s.src = 'map3d.js?v=' + encodeURIComponent(APP_BUILD); s.onload = () => ok(); s.onerror = () => { s.remove(); no(new Error('load')); }; document.head.append(s); }); load3d = (window.pokopia3d || Promise.reject(new Error('none'))).catch(add).catch((e) => { load3d = null; throw e; }); window.pokopia3d = null; }
  return load3d;
}
function get3d() {
  return load3dScript().then(() => { if (!view3d) { try { view3d = make3d($('#map3d'), lost3d); } catch (e) { view3d = null; } } return view3d; });
}
let hold2d = false;
async function enter3d(quiet) {
  if (in3d() || !plan) { hold2d = false; return; } let v = null;
  try { v = await get3d(); } catch (e) { hold2d = false; requestDraw(); if (!quiet) toast('The 3D view couldn\'t load. Check the connection and try again.', 3200); return; }
  if (!v) { hold2d = false; requestDraw(); if (!quiet) toast('The 3D view needs WebGL 2, which this browser doesn\'t have', 3200); return; }
  hold2d = false; if (in3d() || !plan) { requestDraw(); return; }
  map2d.stop(); const s = cellSize(); v.enter((W / 2 - view.px) / s, (H / 2 - view.py) / s, view.zoom, clamp(+LS.get(LSK + '3dtilt') | 0, 0, 3));
  mapView = v; ui3d(); if (quiet) v.fit(); requestDraw(); updateStatus();
}
function leave3d() {
  if (!in3d()) return; const c = view3d.leave(); mapView = map2d; ui3d();
  if (c) { const s = view.cs * c.zoom; view.zoom = c.zoom; view.px = W / 2 - c.cx * s; view.py = H / 2 - c.cy * s; }
  const s = cellSize(); if (!c || view.px > W || view.py > H || view.px + plan.w * s < 0 || view.py + plan.h * s < 0) map2d.fit(); else { requestDraw(); updateStatus(); }
}
let gl2 = null;
const gl2ok = () => gl2 != null ? gl2 : (gl2 = (() => { try { const c = document.createElement('canvas'), g = c.getContext('webgl2'); if (!g) return false; const x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); return true; } catch (e) { return false; } })());
function lost3d() { const was = in3d(); if (was) leave3d(); view3d = null; const c = $('#map3d'); c.replaceWith(c.cloneNode(false)); if (was) toast('The 3D view stopped, so this is the flat map for now', 6000, { label: 'Try 3D again', fn: () => enter3d() }); }
const VIEWS = [['From the top', 'Straight down, like a floor plan', 'top'], ['Angled', '52°, to see heights and walls', 'tilt'], ['Low angle', '10°, almost level', 'low'], ['Side on', 'Level with the ground, like an elevation', 'side']];
function tiltUi() { if (!view3d) return; const m = view3d.mode(), b = $('#ztilt'), tip = 'View: ' + VIEWS[m][0].toLowerCase() + ' (T)'; b.setAttribute('aria-pressed', m ? 'true' : 'false'); b.dataset.tip = tip; b.setAttribute('aria-label', tip); b.querySelector('use').setAttribute('href', '#i-' + VIEWS[m][2]); for (const e of $('#viewmenu').querySelectorAll('.mi')) e.setAttribute('aria-checked', +e.dataset.m === m ? 'true' : 'false'); if (TIP.at === b) tipShow(b); }
function viewRender() {
  const m = $('#viewmenu'), cur = view3d ? view3d.mode() : 0; m.textContent = '';
  m.append(h('div', { class: 'shd' }, 'View', h('kbd', null, 'T')));
  VIEWS.forEach(([name, ds, ic], k) => m.append(h('button', { class: 'mi', type: 'button', role: 'menuitemradio', 'aria-checked': k === cur ? 'true' : 'false', 'data-m': k, 'data-tip': ds, onclick: () => setView3d(k) }, h('span', { class: 'vi' }, icon(ic)), h('span', { class: 'mt' }, name))));
}
function viewOpen(open) { const m = $('#viewmenu'), b = $('#ztilt'); if (open == null) open = m.hidden; if (open === !m.hidden) return; if (open) sysOpen(false); m.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) { tipHide(); viewRender(); m.classList.remove('compact'); const room = b.getBoundingClientRect().bottom - $('#mapwrap').getBoundingClientRect().top - 12; if (m.offsetHeight > room) m.classList.add('compact'); const f = m.querySelector('.mi[aria-checked="true"]') || m.querySelector('.mi'); if (f) f.focus({ preventScroll: true }); } }
function setView3d(k) { viewOpen(false); if (!in3d()) return; LS.set(LSK + '3dtilt', String(view3d.view(k))); tiltUi(); }
function ui3d() {
  const on = in3d();
  $('#map3d').hidden = !on; $('#zturn').hidden = !on; $('#tiltw').hidden = !on; if (on) tiltUi(); else viewOpen(false);
}
function mapOverlay3d(o) {
  if (!plan) return;
  const A = theme.accent, BAD = theme.bad, sel = selection, W1 = '#ffffff';
  const zcol = (z, r) => z.kind === 'label' ? theme.muted : r && r.ok ? theme.good : r && (r.target || r.near) ? theme.warn : theme.muted;
  for (const z of plan.zones) { const r = zoneStatus.get(z.id), col = zcol(z, r); o.top(z.x, z.y, z.w, z.h, col, 0.1); o.ring(z.x, z.y, z.w, z.h, col, r && r.ok ? 0.95 : 0.65, sel && sel.zone === z ? 0.16 : 0.1); }
  const area = (a, strong) => {
    const R = a.rect, far = [];
    if (a.kind === 'house') {
      if (a.outer) { o.top(R.x, R.y, R.w, R.h, W1, strong ? 0.16 : 0.09); for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { if (!inB(plan, x, y)) continue; const d = standZ(y * plan.w + x) - a.base; if (d < -4 || d > 3) far.push(x, y); } }
      for (const k of a.cells) o.cell(k % plan.w, (k / plan.w) | 0, W1, strong ? 0.3 : 0.18);
    } else { o.top(R.x, R.y, R.w, R.h, W1, strong ? 0.22 : 0.12); for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) if (inB(plan, x, y) && Math.abs(standZ(y * plan.w + x) - a.base) > AREA_R) far.push(x, y); }
    for (let i = 0; i < far.length; i += 2) o.cell(far[i], far[i + 1], '#000000', 0.22);
    o.ring(R.x, R.y, R.w, R.h, W1, 0.95, strong ? 0.16 : 0.1);
  };
  for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (!r || !r.area) continue; const on = !!(sel && sel.zone && sel.zone.id === z.id); if (showAreas || on) area(r.area, on); }
  for (const hs of autoHouses) { const on = !!(sel && sel.house === hs.id), R = hs.area.outer; if ((showAreas || on) && !hs.enclosure) area(hs.area, on); if (!showAreas && !on) o.ring(R.x, R.y, R.w, R.h, hs.ok ? theme.good : hs.enclosure ? theme.muted : theme.warn, 0.9, 0.1); }
  if (sel && sel.obj && plan.objs.has(sel.obj.id) && isBox(ITEMS[sel.obj.i])) for (const x of boxReport(sel.obj)) o.ring(x.Z.x, x.Z.y, x.Z.w, x.Z.h, x.n === x.all ? theme.good : theme.warn, 0.9, 0.1);
  const reach3d = (R, strong) => { for (const k of R.cells) o.cell(k % plan.w, (k / plan.w) | 0, R.col, strong ? 0.3 : 0.14); if (R.watch) for (const k of R.watch) o.cell(k % plan.w, (k / plan.w) | 0, R.col, 0.55); if (R.box && strong) o.box(R.box.x, R.box.y, R.box.w, R.box.h, R.box.z0, R.box.z1 - R.box.z0 + 1, R.col, 0.07); };
  if (FIELDS && FIELDS.any && showWater) for (const f of FIELDS.cells.values()) o.cell(f.x, f.y, FIELD_COL[f.state], f.state === 'wet' ? 0.4 : 0.55);
  for (const { home } of dropsShown()) for (const t of litterTiles(home)) o.cell(t.x, t.y, t.ok ? REACH_COL.berry : theme.bad, t.ok ? 0.38 : 0.25);
  if (pourPrev) { const pc = ITEMS[pourPrev.i].col || '#4aa2d6'; for (const e of pourPrev.cells) o.box(e.k % plan.w, (e.k / plan.w) | 0, 1, 1, e.z, 1, pc, e.f === FL_FALL ? 0.5 : 0.35); o.ring(pourPrev.x, pourPrev.y, 1, 1, A, 1, 0.12); }
  const selOb = sel && sel.obj && plan.objs.has(sel.obj.id) ? sel.obj : null;
  if (showReach) for (const ob of reachList()) if (ob !== selOb) { const R = reachCached(ob); if (R) reach3d(R, false); }
  if (showSignals && SIG) for (const rec of SIG.inputs.values()) if (rec.ob !== selOb) { const R = reachOf(rec.ob); if (!R) continue; if (R.box) { o.box(R.box.x, R.box.y, R.box.w, R.box.h, R.box.z0, R.box.z1 - R.box.z0 + 1, R.col, 0.05); o.ring(R.box.x, R.box.y, R.box.w, R.box.h, R.col, 0.8, 0.08); } else if (!showReach) reach3d(R, false); }
  if (selOb && hasReach(ITEMS[selOb.i])) { const R = reachOf(selOb); if (R) reach3d(R, true); }
  if (pkDrag) {
    const R = (hm) => hm.kind === 'kit' ? hm.ob : hm.hs.area.outer;
    for (const hm of pkDrag.homes) { const r = R(hm); if (hm.kind === 'kit') o.box(r.x, r.y, r.w, r.h, zOf(r), htOf(r), A, 0.12); else o.ring(r.x, r.y, r.w, r.h, A, 0.9, 0.1); }
    if (pkDrag.hm) { const r = R(pkDrag.hm), col = pkDrag.chk && pkDrag.chk.ok ? theme.good : BAD; if (pkDrag.hm.kind === 'kit') o.box(r.x, r.y, r.w, r.h, zOf(r), htOf(r), col, 0.4); else { o.top(r.x, r.y, r.w, r.h, col, 0.25); o.ring(r.x, r.y, r.w, r.h, col, 1, 0.16); } }
  }
  const one = sel && (sel.obj && plan.objs.has(sel.obj.id) ? sel.obj : sel.rug && plan.rugs.has(sel.rug.id) ? sel.rug : null);
  if (one) o.box(one.x, one.y, one.w, one.h, zOf(one), one.rug ? 0.06 : htOf(one), A, 0.28);
  if (sel && sel.group && !(drag && drag.kind === 'grpmove' && drag.moved)) { const G = sel.group, L = grpLive(G), F = grpFrame(G); if (F) { for (const b of G.boxes) o.top(b.x, b.y, b.w, b.h, A, 0.08); for (const q of L.objs) o.box(q.x, q.y, q.w, q.h, zOf(q), htOf(q), A, 0.2); for (const q of L.rugs) o.box(q.x, q.y, q.w, q.h, zOf(q), 0.06, A, 0.25); o.ring(F.x, F.y, F.w, F.h, A, 0.9, 0.1); } }
  if (drag && drag.rect) { const r = normRect(drag.rect); o.top(r.x, r.y, r.w, r.h, A, 0.14); o.ring(r.x, r.y, r.w, r.h, A, 1, 0.1); }
  const ghost = (it, x, y, w, h, z, a, r) => { if (isRug(it) || isTerr(it) || solidWall(it) || !o.model || !o.model(it, x, y, w, h, z, Math.max(1, heightOf(it)), r, Math.min(1, a + 0.2))) o.box(x, y, w, h, z, isRug(it) ? 0.06 : isTerr(it) ? 1 : Math.max(1, heightOf(it)), itemColour(it), a); };
  const snap = (sn, P, from) => {
    if (from) o.ring(from.x, from.y, from.w, from.h, theme.muted, 0.8, 0.08);
    if (!P.err) {
      let n = 0; for (const [k, L, v] of P.put) { if (++n > 1500) break; o.box(k % plan.w, (k / plan.w) | 0, 1, 1, L, 1, itemColour(ITEMS[v - 1]), 0.4); }
      for (const e of P.rugs) o.box(e.x, e.y, e.r.w, e.r.h, e.z, 0.06, itemColour(ITEMS[e.r.i]), 0.5);
      for (const e of P.objs) o.box(e.x, e.y, e.o.w, e.o.h, e.z, e.o.t || 1, itemColour(ITEMS[e.o.i]), 0.5);
      for (const q of P.gone) if (q) o.box(q.x, q.y, q.w, q.h, zOf(q), htOf(q), BAD, 0.45);
    } else if (P.bad) o.top(P.bad.x, P.bad.y, P.bad.w, P.bad.h, BAD, 0.35);
    o.ring(P.ox, P.oy, sn.w, sn.h, P.err ? BAD : A, 1, 0.1);
  };
  const move = (ob, f) => {
    const it = ITEMS[ob.i]; o.frame(ob.x, ob.y, ob.w, ob.h, zOf(ob), theme.muted, 0.8, 0.08);
    if (f.ok) {
      if (ob.rug) ghost(it, f.x, f.y, f.w, f.h, f.z || 0, 0.55); else { const g = Object.assign({}, ob, { x: f.x, y: f.y, w: f.w, h: f.h, z: f.z || 0 }); if (!o.model || !o.model(it, f.x, f.y, f.w, f.h, f.z || 0, htOf(ob), faceOf(g), 0.75)) ghost(it, f.x, f.y, f.w, f.h, f.z || 0, 0.55); }
      if (!ob.rug) { const seen = new Set(); for (let y = f.y; y < f.y + f.h; y++) for (let x = f.x; x < f.x + f.w; x++) { const id = occAt(plan, y * plan.w + x, f.z || 0), q = id && id !== ob.id && plan.objs.get(id); if (q && !seen.has(q) && !(inWall(it) && structural(ITEMS[q.i]))) { seen.add(q); o.box(q.x, q.y, q.w, q.h, zOf(q), htOf(q), BAD, 0.45); } } }
    }
    o.frame(f.x, f.y, f.w, f.h, f.z || 0, f.ok ? A : BAD, 1);
  };
  if (hover && !drag) {
    const [hx, hy] = hover, it = currentItem();
    if (tool === 'place' && it && inB(plan, hx, hy)) {
      const ft = footOf(it), rug = isRug(it), mu = it.L !== 'g' && multi(it); const [tw, th] = mu ? wallTurn(it, hx, hy, rotated ? ft[1] : ft[0], rotated ? ft[0] : ft[1]) : [brush, brush]; const fw = rug ? (rotated ? ft[1] : ft[0]) : it.L === 'g' ? brush : tw, fh = rug ? (rotated ? ft[0] : ft[1]) : it.L === 'g' ? brush : th;
      const pw = mu || rug ? fw : 1, ph = mu || rug ? fh : 1, lz = placeZ(it, hx, hy, pw, ph), chk = rug ? null : placeCheck(it, hx, hy, pw, ph, lz), terr = isTerr(it), inZ = lz <= ZMAX && lz >= ZMIN;
      const ok = rug ? hx + fw <= plan.w && hy + fh <= plan.h && inZ : (!mu && brush > 1) || !chk.err;
      if (rug) { if (inZ) ghost(it, hx, hy, fw, fh, lz, 0.55); }
      else if (terr) { for (let dy = 0; dy < fh; dy++) for (let dx = 0; dx < fw; dx++) { const x = hx + dx, y = hy + dy; if (!inB(plan, x, y)) continue; const z = placeZ(it, x, y, 1, 1); if (z <= ZMAX && z >= ZMIN) ghost(it, x, y, 1, 1, z, 0.45); } }
      else if (inZ) ghost(it, hx, hy, pw, ph, lz, 0.55, placeR != null && turnable(it) ? placeR : null);
      if (chk) { for (const q of chk.gone || []) o.box(q.x, q.y, q.w, q.h, zOf(q), htOf(q), BAD, 0.45); for (const [k, lv] of chk.goneT || []) o.box(k % plan.w, (k / plan.w) | 0, 1, 1, lv, 1, BAD, 0.45); }
      o.frame(hx, hy, fw, fh, clamp(lz, ZMIN, ZMAX), ok ? A : BAD, 1);
    } else if (tool === 'move' && moving && inB(plan, hx, hy)) { if (moving.grp) { const [ox, oy] = grpMoveOrigin(moving, hx, hy); snap(moving.sn, snapPlanAt(moving.sn, ox, oy, true), moving.F); } else move(moving, fitMove(moving, hx, hy, 0, 0)); }
    else if (tool === 'paste' && clip && inB(plan, hx, hy)) snap(clip, snapPlanAt(clip, hx, hy, false), null);
    else if (tool === 'stamp' && inB(plan, hx, hy)) o.ring(hx - 2, hy - 2, 5, 5, A, 1, 0.1);
    else if (inB(plan, hx, hy) && o.s >= 8) { const g = grabAt(hx, hy); if (g && !g.grp) o.box(g.x, g.y, g.w, g.h, zOf(g), g.rug ? 0.06 : htOf(g), A, 0.14); else { const [gx, gy, gw, gh] = g ? [g.x, g.y, g.w, g.h] : [hx, hy, brushFor(), brushFor()]; o.frame(gx, gy, gw, gh, o.cy(hx, hy), A, 0.85, 0.06); } }
  }
  if (drag && drag.kind === 'objmove' && drag.moved && drag.fit) move(drag.ob, drag.fit);
  if (drag && drag.kind === 'grpmove' && drag.moved && drag.P) snap(drag.sn, drag.P, drag.F);
}
function mapLabels3d(o) {
  if (!plan) return;
  const c = o.c, s = o.s, small = s < 14; let ix = null; const rix = () => ix || (ix = residentsIndex());
  const pill = (label, px, py, col, maxW) => { const fh = small ? 14 : 18, pad = small ? 10 : 14; c.font = `700 ${small ? 10 : 12}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; const t = maxW ? fitLabel(c, label, maxW - pad) : label, bw = c.measureText(t).width + pad; c.fillStyle = col; roundRect(c, px, py - fh - 2, bw, fh, small ? 4 : 6); c.fill(); c.fillStyle = '#fff'; c.fillText(t, px + pad / 2, py - fh / 2 - 2); };
  const faces = (list, x, y) => { const d = Math.round(clamp(s * 0.95, 16, 30)); drawFaces(c, list, x, y - d * 0.62, d); };
  { const pt = (x, y, z) => { const b = o.flatRect(x + 0.5, y + 0.5, 0, 0, z + 0.8); return [b.x0, b.y0]; }, nets = powerShown(), recs = sigShown(); if (nets) drawPowerLines(c, POWER, pt, nets, s, showPower); if (recs) drawSignalLines(c, pt, recs, s); }
  if (s >= 8) for (const ob of plan.objs.values()) {
    const it = ITEMS[ob.i]; if (!it.cap || !obShown(ob) || (layerZ != null && zOf(ob) > layerZ)) continue; const e = rix().homes.get('kit:' + ob.id); if (!e) continue;
    const b = o.flatRect(ob.x, ob.y, ob.w, ob.h, zOf(ob) + htOf(ob)), t = e.list.length + '/' + it.cap; c.font = `700 ${s < 14 ? 10 : 12}px ${BODY_FONT}`; const tw = c.measureText(t).width + 10, bx = b.x1 - tw - 3, by = b.y0 + 3;
    c.fillStyle = it.sm && e.list.some(r => tooBig(PK_BY_NAME.get(r.p))) ? theme.bad : kitReady(ob) ? theme.accent : theme.warn; roundRect(c, bx, by, tw, 16, 8); c.fill(); c.fillStyle = '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, bx + 5, by + 8);
    if (s >= 10 && S.faces) faces(e.list.map(r => r.p), b.x0 + 3, b.y1);
  }
  for (const hs of autoHouses) {
    const R = hs.area.outer, b = o.rect(R.x, R.y, R.w, R.h);
    if (s >= 7 && S.labels) { const nres = (rix().homes.get('house:' + hs.id) || { list: [] }).list.length; pill(hs.enclosure ? 'Enclosure · ' + hs.kitHomes.length + ' kit home' + (hs.kitHomes.length > 1 ? 's' : '') : (hs.ok ? 'House ✓' : 'House · ' + houseIssues(hs)[0]) + (nres ? ' · ' + nres + '/4' : '') + (hs.kitHomes.length ? ' · +' + hs.kitHomes.length + ' kit' : ''), b.x0, b.y0, hs.ok ? theme.good : hs.enclosure ? theme.muted : theme.warn); }
    if (s >= 10 && S.faces && !hs.enclosure) { const e = rix().homes.get('house:' + hs.id); if (e && e.list.length) faces(e.list.map(r => r.p), b.x0 + 4, b.y1); }
  }
  if (s >= 7 && S.labels) for (const z of plan.zones) {
    const r = zoneStatus.get(z.id), b = o.rect(z.x, z.y, z.w, z.h), col = z.kind === 'label' ? theme.muted : r && r.ok ? theme.good : r && (r.target || r.near) ? theme.warn : theme.muted, zw = b.x1 - b.x0;
    pill(small && r && r.ok && z.kind !== 'label' ? (z.kind === 'house' ? 'House ✓' : r.best.hb.n + ' ✓') : zoneLabel(z, r), b.x0, b.y0, col, small ? Math.max(zw + 16, 30) : Math.max(zw, 40) + 120);
  }
  if (s >= 7 && selection && selection.obj && plan.objs.has(selection.obj.id) && isBox(ITEMS[selection.obj.i])) for (const x of boxReport(selection.obj)) {
    const b = o.rect(x.Z.x, x.Z.y, x.Z.w, x.Z.h), full = x.n === x.all, t = 'Box reach: ' + x.hm.label; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const tw = c.measureText(t).width + 8;
    c.fillStyle = full ? theme.good : theme.warn; roundRect(c, b.x0 + 2, b.y1 + 2, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(t, b.x0 + 6, b.y1 + 4);
  }
  if (drag && drag.rect) { const r = normRect(drag.rect), b = o.rect(r.x, r.y, r.w, r.h); c.fillStyle = theme.ink; c.font = '700 12px sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(r.w + ' × ' + r.h, b.x1 + 6, b.y0 + 8); }
  if (sparkles.length) {
    const now = performance.now();
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const p = sparkles[i], a = (now - p.t0) / p.life; if (a > 1) { sparkles.splice(i, 1); continue; } if (a < 0) continue;
      const [px, py0] = o.at(p.zx, o.gy(Math.floor(p.zx), Math.floor(p.zy)), p.zy), py = py0 - a * s * 0.8, r = s * p.r * Math.sin(a * Math.PI);
      c.fillStyle = a < 0.5 ? '#fff6c2' : theme.accent; c.globalAlpha = 1 - a; c.beginPath();
      for (let k = 0; k < 8; k++) { const ang = k * Math.PI / 4, rr = k % 2 ? r * 0.35 : r; c.lineTo(px + Math.cos(ang) * rr, py + Math.sin(ang) * rr); } c.closePath(); c.fill(); c.globalAlpha = 1;
    }
  }
}
function tilt3d(dir = 1) { if (!in3d()) return; LS.set(LSK + '3dtilt', String(view3d.tilt(dir))); tiltUi(); }
function turn3d(dir) { if (in3d()) view3d.turn(dir); }

function fitLabel(c, t, w) {
  if (c.measureText(t).width <= w) return t;
  const tick = / ✓$/.test(t) ? ' ✓' : '', base = tick ? t.slice(0, -2) : t;
  let lo = 0, hi = base.length;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (c.measureText(base.slice(0, m).trimEnd() + '…' + tick).width <= w) lo = m; else hi = m - 1; }
  return lo >= 2 ? base.slice(0, lo).trimEnd() + '…' + tick : tick ? '✓' : base.slice(0, 1) + '…';
}
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function drawItem(c, it, x, y, s, wcells = 1, hcells = 1, label = true, pic = null) {
  const w = s * wcells, hh = s * hcells, cx = x + w / 2, cy = y + hh / 2, col = it.look ? it.look.a : it.col, alt = it.look && it.look.b;
  c.save();
  switch (it.sh) {
    case 'grass': {
      c.fillStyle = shade(col, -0.25);
      for (const [ox, oy] of [[-0.22, 0.12], [0.18, 0.18], [0, -0.12]]) {
        const bx = cx + ox * s, by = cy + oy * s + s * 0.18;
        c.beginPath(); c.moveTo(bx - s * 0.14, by); c.lineTo(bx - s * 0.05, by - s * 0.4); c.lineTo(bx, by - s * 0.05); c.lineTo(bx + s * 0.06, by - s * 0.42); c.lineTo(bx + s * 0.14, by); c.closePath(); c.fill();
      }
      c.fillStyle = col;
      for (const [ox, oy] of [[-0.1, 0.05], [0.12, -0.02]]) { const bx = cx + ox * s, by = cy + oy * s + s * 0.2; c.beginPath(); c.moveTo(bx - s * 0.1, by); c.lineTo(bx - s * 0.02, by - s * 0.38); c.lineTo(bx + s * 0.1, by); c.closePath(); c.fill(); }
      break;
    }
    case 'flower': {
      c.fillStyle = alt || '#5c9a45'; c.beginPath(); c.arc(cx, cy, s * 0.32, 0, 7); c.fill();
      const pts = [[-0.17, -0.12], [0.16, -0.15], [0, 0.17], [-0.18, 0.15], [0.19, 0.12]];
      for (const [ox, oy] of pts) { c.fillStyle = col; c.beginPath(); c.arc(cx + ox * s, cy + oy * s, s * 0.1, 0, 7); c.fill(); c.fillStyle = shade(col, -0.35); c.beginPath(); c.arc(cx + ox * s, cy + oy * s, s * 0.035, 0, 7); c.fill(); }
      break;
    }
    case 'hedge': {
      c.fillStyle = shade(col, -0.3); roundRect(c, x + s * 0.1, y + s * 0.18, s * 0.8, s * 0.72, s * 0.3); c.fill();
      c.fillStyle = col; roundRect(c, x + s * 0.1, y + s * 0.1, s * 0.8, s * 0.68, s * 0.3); c.fill();
      c.fillStyle = shade(col, 0.25); c.beginPath(); c.arc(cx - s * 0.15, cy - s * 0.14, s * 0.12, 0, 7); c.fill();
      break;
    }
    case 'tree': case 'palm': case 'pine': {
      c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(cx + s * 0.06, cy + s * 0.32, s * 0.36, s * 0.14, 0, 0, 7); c.fill();
      c.fillStyle = '#7a5434'; c.fillRect(cx - s * 0.06, cy, s * 0.12, s * 0.34);
      if (it.sh === 'pine') { c.fillStyle = col; c.beginPath(); c.moveTo(cx, y + s * 0.02); c.lineTo(cx + s * 0.36, cy + s * 0.18); c.lineTo(cx - s * 0.36, cy + s * 0.18); c.closePath(); c.fill(); c.fillStyle = shade(col, 0.18); c.beginPath(); c.moveTo(cx, y + s * 0.02); c.lineTo(cx + s * 0.12, cy - s * 0.12); c.lineTo(cx - s * 0.2, cy - s * 0.04); c.closePath(); c.fill(); }
      else if (it.sh === 'palm') { c.strokeStyle = col; c.lineWidth = Math.max(1.5, s * 0.12); c.lineCap = 'round'; for (let a = 0; a < 5; a++) { const an = a * 1.256 - 1.57; c.beginPath(); c.moveTo(cx, cy - s * 0.05); c.quadraticCurveTo(cx + Math.cos(an) * s * 0.25, cy - s * 0.1 + Math.sin(an) * s * 0.25, cx + Math.cos(an) * s * 0.42, cy + Math.sin(an) * s * 0.36); c.stroke(); } }
      else {
        c.fillStyle = shade(col, -0.2); c.beginPath(); c.arc(cx, cy - s * 0.06, s * 0.42, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(cx - s * 0.04, cy - s * 0.1, s * 0.36, 0, 7); c.fill();
        const b = alt || BERRY_COL[it.n.split(' ')[0]]; if (b && s > 14) { c.fillStyle = b; for (const [ox, oy] of [[-0.18, -0.05], [0.14, -0.2], [0.1, 0.08]]) { c.beginPath(); c.arc(cx + ox * s, cy + oy * s, s * 0.06, 0, 7); c.fill(); } }
      }
      break;
    }
    case 'stump': { c.fillStyle = col; c.beginPath(); c.ellipse(cx, cy, s * 0.3, s * 0.26, 0, 0, 7); c.fill(); c.strokeStyle = shade(col, -0.35); c.lineWidth = Math.max(1, s * 0.04); c.beginPath(); c.ellipse(cx, cy, s * 0.17, s * 0.14, 0, 0, 7); c.stroke(); break; }
    case 'crop': { c.fillStyle = '#7b5a3a'; roundRect(c, x + s * 0.06, y + s * 0.06, s * 0.88, s * 0.88, s * 0.12); c.fill(); c.fillStyle = col; for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { c.beginPath(); c.arc(x + s * (0.25 + q * 0.25), y + s * (0.25 + r * 0.25), s * 0.08, 0, 7); c.fill(); } break; }
    case 'moss': { c.fillStyle = col; for (const [ox, oy, r] of [[-0.2, -0.15, 0.16], [0.18, -0.1, 0.18], [-0.05, 0.18, 0.2], [0.2, 0.2, 0.12]]) { c.beginPath(); c.arc(cx + ox * s, cy + oy * s, r * s, 0, 7); c.fill(); } break; }
    case 'lily': { c.fillStyle = col; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, s * 0.3, 0.4, 6.0); c.closePath(); c.fill(); break; }
    case 'coral': { c.strokeStyle = col; c.lineWidth = Math.max(1.5, s * 0.1); c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy + s * 0.35); c.lineTo(cx, cy - s * 0.1); c.lineTo(cx - s * 0.2, cy - s * 0.3); c.moveTo(cx, cy); c.lineTo(cx + s * 0.22, cy - s * 0.25); c.moveTo(cx, cy + s * 0.12); c.lineTo(cx - s * 0.25, cy - s * 0.02); c.stroke(); break; }
    case 'rock': { c.fillStyle = shade(col, -0.25); c.beginPath(); c.moveTo(x + s * 0.12, y + s * 0.82); c.lineTo(x + s * 0.2, y + s * 0.3); c.lineTo(x + s * 0.55, y + s * 0.12); c.lineTo(x + s * 0.88, y + s * 0.4); c.lineTo(x + s * 0.86, y + s * 0.84); c.closePath(); c.fill(); c.fillStyle = col; c.beginPath(); c.moveTo(x + s * 0.2, y + s * 0.3); c.lineTo(x + s * 0.55, y + s * 0.12); c.lineTo(x + s * 0.8, y + s * 0.38); c.lineTo(x + s * 0.5, y + s * 0.5); c.closePath(); c.fill(); break; }
    case 'web': { c.strokeStyle = shade(col, -0.2); c.lineWidth = 1; for (let r = 1; r <= 3; r++) { c.beginPath(); c.arc(cx, cy, r * s * 0.12, 0, 7); c.stroke(); } for (let a = 0; a < 6; a++) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * s * 0.4, cy + Math.sin(a) * s * 0.4); c.stroke(); } break; }
    case 'block': { c.fillStyle = shade(col, -0.28); c.fillRect(x + 1, y + s * 0.12, w - 2, hh - s * 0.12 - 1); c.fillStyle = col; c.fillRect(x + 1, y + 1, w - 2, hh - s * 0.2); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x + 1, y + 1, w - 2, Math.max(1, s * 0.08)); break; }
    case 'kit': {
      c.fillStyle = 'rgba(0,0,0,.18)'; roundRect(c, x + 3, y + 5, w - 4, hh - 4, Math.min(10, s * 0.4)); c.fill();
      const base = it.sub === 'Pokémon Center' ? '#d9535f' : it.sub === 'Power' ? '#c99a2e' : it.sub === 'Legendary' ? '#5e5a8c' : it.sub === 'Public' || it.sub === 'Decoration' ? '#4f8f9a' : it.col;
      c.fillStyle = shade(base, 0.55); roundRect(c, x + 1, y + 1, w - 3, hh - 3, Math.min(10, s * 0.4)); c.fill();
      if (!pic) { c.fillStyle = base; roundRect(c, x + 1, y + 1, w - 3, Math.max(s * 0.45, hh * 0.38), Math.min(10, s * 0.4)); c.fill(); }
      c.strokeStyle = shade(base, -0.3); c.lineWidth = 1.5; roundRect(c, x + 1, y + 1, w - 3, hh - 3, Math.min(10, s * 0.4)); c.stroke();
      const named = label && s * Math.min(wcells, hcells) > 40, fs = clamp(s * 0.42, 9, 15), text = fs * (it.cap ? 2.4 : 1.3);
      let ty = y + hh * 0.66;
      if (pic) {
        const pad = Math.max(3, Math.min(w, hh) * 0.06), ph = named ? hh - text - pad * 2 : hh - pad * 2;
        if (ph > 8) pic(x + pad, y + pad, w - pad * 2 - 2, ph); else if (!named) pic(x + 2, y + 2, w - 5, hh - 5);
        ty = named && ph > 8 ? y + hh - pad - text + fs * 0.6 : ty;
      }
      if (named) {
        c.fillStyle = '#1c2a23'; c.font = `700 ${fs}px ${BODY_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
        const txt = it.n.replace(/ kit$/, ''); c.fillText(txt.length > 22 ? txt.slice(0, 21) + '…' : txt, cx, ty, w - 8);
        if (it.cap) { c.font = `700 ${fs * 0.85}px sans-serif`; c.fillStyle = shade(base, -0.4); c.fillText('houses ' + it.cap, cx, ty + fs * 1.15, w - 8); }
      }
      break;
    }
    case 'floor': {
      break;
    }
    default: {
      const pad = s * 0.12; c.fillStyle = shade(col, -0.3); roundRect(c, x + pad, y + pad + s * 0.05, w - 2 * pad, hh - 2 * pad, s * 0.18); c.fill();
      c.fillStyle = col; roundRect(c, x + pad, y + pad, w - 2 * pad, hh - 2 * pad - s * 0.05, s * 0.18); c.fill();
      if (label && s >= 18) { c.fillStyle = lum(col) > 0.6 ? 'rgba(20,30,25,.85)' : 'rgba(255,255,255,.95)'; c.font = `700 ${Math.round(s * 0.34)}px sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(it.gl, cx, cy - s * 0.02); }
    }
  }
  c.restore();
}
const LOOKS = {
  chip: 'r0,14,14,72,72,16',
  plate: 'o0,50,50,38 o1,50,50,25',
  platter: 'o0,50,50,40 o1,36,42,12 o1,62,40,12 o1,50,64,12',
  basket: 'r0,14,40,72,44,10 r1,14,40,72,11,5 ~l2,2,32,54,32,80 ~l2,2,50,54,50,80 ~l2,2,68,54,68,80 a2,6,50,40,24,180,360',
  fruitbasket: 'r0,14,46,72,40,10 o1,34,42,12 o1,52,36,12 o1,68,44,11 a2,6,50,46,26,180,360',
  mug: 'a0,9,72,50,14,-70,70 o0,46,50,30 o1,46,50,21',
  teaset: 'r0,10,22,80,56,12 o1,38,50,17 o1,70,36,9 o1,70,64,9 ~o4,38,50,5',
  setting: 'o0,50,50,30 o1,50,50,19 l2,5,14,30,14,70 l2,5,86,30,86,70',
  cups: 'o0,32,38,16 o0,68,36,15 o0,50,68,16 o1,32,38,10 o1,68,36,9 o1,50,68,10',
  pizza: 'o0,50,50,40 o1,50,50,33 ~l2,2,50,17,50,83 ~l2,2,21,33,79,67 ~l2,2,21,67,79,33 ~o4,38,36,5 ~o4,64,44,5 ~o4,44,64,5',
  fries: 'l1,8,36,44,30,14 l1,8,50,44,50,10 l1,8,64,44,70,14 l1,8,43,44,40,20 l1,8,57,44,60,18 p0,26,40,74,40,68,88,32,88',
  float: 'p0,30,26,70,26,64,90,36,90 o1,50,24,18 ~l3,4,58,20,70,4',
  tiers: 'o0,50,50,40 o1,50,50,29 o0,50,50,17 o1,50,50,6',
  cookies: 'o1,50,50,40 o0,36,42,13 o0,63,40,13 o0,50,64,13 ~o2,33,40,2 ~o2,40,46,2 ~o2,62,36,2 ~o2,66,44,2 ~o2,48,62,2 ~o2,54,68,2',
  sandwich: 'o1,50,50,40 p0,16,24,68,24,16,68 p0,84,76,32,76,84,32',
  shavedice: 'p0,20,54,80,54,68,88,32,88 e1,50,48,30,20 ~e6,42,40,8,5',
  cake: 'o0,50,50,38 r1,44,12,12,76,2 r1,12,44,76,12,2 o1,50,50,9',
  vase: 'p0,36,52,64,52,72,88,28,88 o1,38,40,11 o1,62,38,11 o1,50,26,12',
  flowers: 'p0,34,60,66,60,70,90,30,90 o1,28,42,12 o1,50,30,13 o1,72,42,12 o1,40,54,10 o1,60,54,10',
  bin: 'r0,26,28,48,60,6 r1,20,18,60,12,4 ~l2,3,40,40,40,78 ~l2,3,60,40,60,78',
  pencils: 'l1,6,40,44,30,12 l1,6,52,44,54,8 l1,6,62,44,72,14 r0,30,40,40,48,6',
  pen: 'l0,13,26,74,70,30 l1,13,70,30,80,20 ~l6,3,34,60,58,36',
  letter: 'r0,12,26,76,50,4 p1,14,28,50,56,86,28 o1,50,54,6',
  note: 'r0,24,14,52,72,4 r1,24,14,52,14,3 ~l2,3,32,44,68,44 ~l2,3,32,56,68,56 ~l2,3,32,68,58,68',
  book: 'r0,22,16,56,68,4 r1,22,16,11,68,3 ~l2,3,42,34,68,34 ~l2,3,42,44,62,44',
  openbook: 'p1,6,30,50,38,94,30,94,80,50,88,6,80 p0,12,26,50,34,50,80,12,72 p0,50,34,88,26,88,72,50,80 ~l2,2,20,40,42,44 ~l2,2,58,44,80,40 ~l2,2,20,52,42,56 ~l2,2,58,56,80,52',
  papers: 'r0,18,26,52,60,3 r0,30,14,52,60,3 ~l2,3,38,30,74,30 ~l2,3,38,42,74,42 ~l2,3,38,54,64,54',
  newspaper: 'r0,12,20,76,60,3 r1,18,26,30,22,2 ~l2,3,54,30,82,30 ~l2,3,54,40,82,40 ~l2,3,18,58,82,58 ~l2,3,18,68,82,68',
  frame: 'r0,18,14,64,72,4 r1,27,23,46,54,2',
  board: 'r0,8,16,84,68,4 r1,15,23,70,54,2 ~r3,24,30,16,14,1 ~r3,48,34,18,12,1 ~r3,34,54,20,14,1',
  fireplace: '!f r0,4,8,92,84,6 r2,26,30,48,62,22 p1,36,92,40,60,50,72,58,50,64,92',
  fan: 'o0,50,50,40 w1,50,50,33,-20,40 w1,50,50,33,100,160 w1,50,50,33,220,280 o0,50,50,8',
  aircon: 'r0,6,26,88,48,10 r1,14,56,72,10,3 ~l2,2,16,40,84,40',
  printer: 'r1,26,12,48,24,2 r0,10,30,80,44,6 r1,24,62,52,26,2 ~o2,78,40,3',
  bottles: 'r0,18,36,26,50,8 r0,23,26,16,12,2 r1,52,28,30,58,8 r1,59,16,16,14,2',
  bucket: 'l1,6,66,10,48,60 p0,22,32,78,32,70,88,30,88 e2,50,32,28,7',
  tablet: 'r0,22,10,56,80,8 r1,28,17,44,62,3 ~o2,50,87,2',
  phone: 'r0,32,12,36,76,8 r1,36,20,28,56,3',
  laptop: 'r0,16,14,68,46,4 r1,22,20,56,34,2 p0,10,64,90,64,84,84,16,84 ~r2,26,68,48,8,1',
  monitor: 'r0,10,12,80,54,5 r1,16,18,68,42,2 r0,42,66,16,12,0 r0,28,76,44,10,3',
  tower: 'r0,28,8,44,84,5 ~o1,50,24,7 ~r1,36,44,28,4,1 ~r1,36,54,28,4,1 ~r1,36,64,28,4,1',
  clock: 'o0,28,22,11 o0,72,22,11 o0,50,54,34 o1,50,54,26 l2,4,50,54,50,38 l2,4,50,54,62,60',
  blocks: 'r0,12,48,36,36,4 r1,52,48,36,36,4 r0,32,12,36,36,4',
  pinwheel: 'l2,4,50,52,50,94 p0,50,50,50,12,76,28 p1,50,50,88,50,72,76 p0,50,50,50,88,24,72 p1,50,50,12,50,28,24 o2,50,50,4',
  yarn: 'o0,38,56,26 o1,66,40,20 ~l2,3,20,24,56,60 ~l2,3,30,16,62,52',
  handheld: 'r0,28,8,44,84,8 r1,34,14,32,30,2 ~r2,34,60,14,5,1 ~r2,38.5,55.5,5,14,1 ~o2,62,60,5 ~o2,54,70,5',
  humidifier: 'r0,26,30,48,60,18 o1,50,32,10 ~e6,50,14,12,7',
  aidkit: 'r0,12,28,76,54,8 r1,44,36,12,38,1 r1,31,49,38,12,1 a2,5,50,28,10,180,360',
  crystal: 'r1,30,70,40,18,4 o0,50,46,30 ~o6,40,36,8',
  microscope: 'r0,20,78,60,12,3 l0,8,32,78,32,44 l1,12,40,62,64,18 r0,42,56,32,6,2',
  flask: 'p0,40,12,60,12,60,40,84,86,16,86,40,40 p1,27.5,64,72.5,64,84,86,16,86',
  cords: '!n q0,6,14,40,50,4,86,46 q1,6,16,72,54,96,88,62 q2,6,26,18,64,40,40,90',
  cdplayer: 'r0,12,26,76,48,8 o1,50,50,18 ~o0,50,50,5',
  mic: 'r0,28,78,44,10,4 l0,5,50,78,50,48 o1,50,32,18 ~l4,2,38,28,62,28 ~l4,2,38,36,62,36',
  standmic: 'e0,50,86,22,7 l0,5,50,86,50,30 o1,50,22,13',
  drum: 'o0,50,50,40 o1,50,50,31 ~o2,50,14,3 ~o2,86,50,3 ~o2,50,86,3 ~o2,14,50,3',
  guitar: 'l1,9,48,52,84,16 r1,78,8,14,16,3 o0,40,62,24 o0,57,47,15 ~o2,41,61,6',
  mixer: 'r0,8,20,84,60,6 ~r2,23,30,6,40,2 ~r2,39,30,6,40,2 ~r2,55,30,6,40,2 ~r2,71,30,6,40,2 r1,19,44,14,8,2 r1,35,56,14,8,2 r1,51,36,14,8,2 r1,67,50,14,8,2',
  speaker: 'r0,22,8,56,84,6 o1,50,62,18 o1,50,28,10 ~o4,50,62,7',
  balloons: 'l2,2,50,92,32,42 l2,2,50,92,68,40 l2,2,50,92,50,26 o1,50,26,16 o0,32,42,16 o0,68,40,16',
  arcade: 'r0,22,8,56,84,6 r1,30,16,40,30,3 o1,50,64,12 ~o4,50,64,5',
  boxes: 'r0,12,44,42,42,3 r0,48,50,40,36,3 r0,26,12,40,34,3 ~r1,29,44,8,42,0 ~r1,64,50,8,36,0 ~r1,42,12,8,34,0',
  whiteboard: '!f r0,4,8,92,72,4 r1,8,14,84,60,2 ~l2,3,16,28,52,28 ~l2,3,16,42,70,42 ~l2,3,16,56,44,56 r0,10,82,80,8,3',
  console: 'r0,14,24,72,52,8 r1,22,32,30,24,2 ~o1,64,40,6 ~o1,74,52,6 ~o1,64,64,6',
  armor: 'p0,24,32,76,32,82,50,70,88,30,88,18,50 o1,50,22,15 ~l2,4,50,38,50,84',
  bell: 'p0,50,12,64,18,70,40,76,72,24,72,30,40,36,18 r0,16,70,68,10,5 o1,50,86,8',
  wheel: 'l0,6,50,8,50,92 l0,6,8,50,92,50 l0,6,20,20,80,80 l0,6,80,20,20,80 a0,10,50,50,30,0,360 o1,50,50,11',
  wreath: 'a0,16,50,50,28,0,360 ~o1,50,22,6 ~o1,76,58,6 ~o1,24,58,6 p1,40,76,60,76,66,92,50,82,34,92',
  grandclock: 'r0,26,6,48,88,6 o1,50,30,16 ~l2,3,50,30,50,20 ~l2,3,50,30,58,34 r1,40,54,20,28,6 ~o0,50,74,5',
  banner: 'l2,4,14,14,86,14 p0,24,14,76,14,76,88,50,72,24,88 ~o1,50,40,11',
  bunting: 'q2,3,4,16,50,44,96,16 p0,8,18,26,25,14,50 p1,30,28,48,32,40,60 p0,52,32,70,28,62,60 p1,74,25,92,18,86,50',
  scroll: 'r1,18,8,64,9,4 r0,24,16,52,68,0 r1,18,82,64,9,4 ~l2,3,40,30,40,70 ~l2,3,56,30,56,58',
  pokeball: 'o1,50,50,38 w0,50,50,38,180,360 l2,6,12,50,88,50 o1,50,50,11 ~o2,50,50,5',
  plates: 'o0,36,52,26 o1,36,52,16 o0,64,46,26 o1,64,46,16',
  books: 'r0,16,62,68,20,3 r1,22,42,58,20,3 r0,18,22,62,20,3',
  showcase: '!f r0,4,10,92,80,5 r1,9,16,82,48,3 ~o0,28,40,8 ~o0,52,40,8 ~o0,74,40,8',
  bottle: 'r1,8,30,70,40,18 r0,76,40,14,20,4 p0,20,56,62,56,56,64,26,64 p0,40,30,40,54,58,54',
  gem: 'p0,50,12,84,40,50,88,16,40 ~p3,32,24,68,24,84,40,16,40',
  metronome: 'p0,34,10,66,10,82,90,18,90 l1,4,50,80,64,24 ~r2,40,82,20,4,1',
  musicbox: 'r0,14,32,72,48,6 r1,14,32,72,14,4 ~l2,4,86,56,94,56 ~l2,4,94,48,94,64',
  harp: 'l0,9,26,88,26,14,78,38,78,88,26,88 ~l1,2,38,24,38,84 ~l1,2,50,30,50,84 ~l1,2,62,34,62,84',
  toolbox: 'r0,12,38,76,46,6 r1,12,38,76,12,4 a2,6,50,38,16,180,360',
  servers: 'r0,18,8,64,84,5 ~r2,24,16,52,14,2 ~r2,24,36,52,14,2 ~r2,24,56,52,14,2 ~o1,70,23,3 ~o1,70,43,3 ~o1,70,63,3',
  orb: 'o0,50,50,36 o1,50,50,24 ~o6,42,42,7',
  screen: 'r0,8,20,84,60,5 r1,14,26,72,48,2',
  calendar: 'r0,18,12,64,76,4 r1,18,12,64,18,3 ~l2,2,26,48,74,48 ~l2,2,26,62,74,62 ~l2,2,26,76,74,76 ~l2,2,42,36,42,84 ~l2,2,58,36,58,84',
  vine: 'q0,8,10,24,50,64,90,30 o1,26,30,10 o1,50,50,11 o1,74,34,10 ~o1,62,60,8 ~o1,36,48,8',
  wallclock: 'o0,50,50,38 o1,50,50,30 l2,5,50,50,50,30 l2,5,50,50,64,58',
  toolboard: 'r0,10,10,80,80,4 l1,6,28,24,28,74 l1,6,50,24,50,60 l1,6,72,24,72,70 ~r1,42,64,16,12,2',
  cart: 'o1,28,78,9 o1,72,78,9 r0,14,22,72,50,6 l2,5,86,30,94,14 ~r3,22,30,56,14,3',
  stand: 'r0,14,14,72,72,8 r1,26,26,48,48,5',
  hammock: '!f !r l2,4,2,50,16,50 l2,4,84,50,98,50 e0,50,50,36,32 ~l1,3,22,40,78,40 ~l1,3,22,60,78,60',
  mirror: 'r0,24,8,52,84,22 r1,30,14,40,72,18 ~l6,4,38,26,48,42',
  safe: 'r0,14,14,72,72,6 o1,50,50,17 ~l4,4,50,50,60,42 ~r2,76,34,6,10,1 ~r2,76,56,6,10,1',
  pod: 'o0,50,50,40 o1,50,50,28 ~o6,40,40,8',
  flag: 'l2,5,24,92,24,10 p0,26,12,82,26,26,50 ~o1,44,26,5',
  workbench: '!f r0,4,14,92,72,6 r1,10,22,28,18,2 l1,5,54,30,84,30 ~o1,70,58,7 ~l2,3,20,62,44,62',
  cutboard: 'r0,10,24,76,52,8 o2,80,50,4 ~r1,28,40,34,8,3 ~l1,5,62,44,74,44',
  pan: 'l1,10,64,50,94,50 o0,38,50,32 o2,38,50,23 ~o6,30,42,6',
  pot: 'r1,4,42,16,14,5 r1,80,42,16,14,5 o0,50,50,36 o3,50,50,26 o1,50,50,7',
  furnace: 'r0,14,10,72,80,10 r2,28,44,44,34,12 p1,36,78,42,56,50,66,58,52,64,78 ~r3,26,18,48,10,4',
  mixdrum: '!f r1,72,34,24,32,4 o0,44,50,38 o3,44,50,24 ~l2,4,28,34,60,66',
  rail: '!f !r !n r0,8,8,14,84,2 r0,43,8,14,84,2 r0,78,8,14,84,2 r1,0,24,100,8,0 r1,0,68,100,8,0',
  crossing: '!f !r o0,10,50,10 r1,18,44,78,12,4 ~r0,32,44,10,12,0 ~r0,56,44,10,12,0 ~r0,80,44,10,12,0',
  handcar: 'o1,26,20,10 o1,74,20,10 o1,26,80,10 o1,74,80,10 r0,14,22,72,56,6 l1,6,30,50,70,50 ~o2,50,50,6',
  platform: '!f r0,6,6,88,88,6 r1,16,16,68,68,4 ~l2,3,16,16,84,84 ~l2,3,84,16,16,84',
  register: 'r0,12,42,76,46,6 r0,20,14,60,32,4 r1,26,20,48,18,2 ~r2,24,56,52,8,1',
  sprinkler: '!n o0,50,50,22 o1,50,50,9 ~a1,3,50,50,36,200,250 ~a1,3,50,50,36,290,340 ~a1,3,50,50,36,20,70 ~a1,3,50,50,36,110,160',
  floodgate: 'r0,10,10,16,80,2 r0,74,10,16,80,2 r1,26,30,48,56,2 ~l4,3,30,46,70,46 ~l4,3,30,62,70,62',
  pole: 'l1,7,10,44,90,44 o0,50,56,18 ~o1,22,44,5 ~o1,78,44,5',
  transmitter: 'r0,30,44,40,46,6 l0,6,50,44,50,22 o1,50,18,12 ~a1,3,50,18,22,200,340',
  switch: 'r0,24,24,52,52,8 r1,38,32,24,36,6 ~r4,42,36,16,12,3',
  generator: 'r0,10,22,80,56,8 o1,34,50,16 ~o4,34,50,6 ~r2,58,34,22,8,2 ~r2,58,50,22,8,2',
  floorswitch: 'r0,14,14,72,72,10 o1,50,50,22 ~o6,44,44,6',
  cardreader: 'r0,24,10,52,80,8 r1,32,20,36,22,3 ~r2,34,56,32,6,2',
  laser: 'l1,3,50,50,98,50 r0,26,26,48,48,8 o1,50,50,12',
  planet: 'o0,50,50,28 l1,7,6,62,94,38 ~o6,40,40,7',
  discoball: 'l1,3,50,0,50,14 o0,50,52,36 ~l2,2,14,52,86,52 ~l2,2,50,16,50,88 ~l2,2,22,32,78,32 ~l2,2,22,72,78,72 ~o6,40,40,8',
  mat: 'r0,8,8,84,84,10 o1,40,66,12 l1,7,50,64,50,26 l1,7,50,26,66,34',
  blender: 'r0,26,62,48,28,6 p1,30,14,70,14,66,62,34,62 ~l6,3,40,22,40,54',
  bubbles: 'r0,18,48,64,40,8 o1,30,28,10 o1,56,20,8 o1,72,36,11 ~o1,44,10,5',
  steps: '!f r3,8,8,84,28,2 r0,8,36,84,28,2 r2,8,64,84,28,2 ~l7,7,34,62,50,46,66,62',
  microwave: 'r0,8,22,84,56,6 r1,16,30,50,40,3 ~o2,78,40,4 ~o2,78,56,4',
  campfire: 'o0,50,50,38 o2,50,50,28 p1,50,22,62,42,68,60,50,76,32,60,38,42 ~p5,50,40,58,54,50,66,42,54',
  bonfire: 'l0,9,20,80,80,20 l0,9,20,20,80,80 p1,50,8,68,34,76,62,50,88,24,62,32,34 ~p5,50,34,60,54,50,72,40,54',
  sandbox: '!f r0,6,6,88,88,8 r1,14,14,72,72,4 ~o4,36,40,8 ~o4,62,62,10',
  tire: 'a0,20,50,50,27,0,360',
  bigpipe: '!f !r r0,6,20,80,60,6 e3,84,50,10,30 e2,84,50,6,20',
  punchbag: 'l1,4,50,4,50,18 r0,30,18,40,70,16 ~l6,4,40,30,40,70',
  slide: '!f !r r1,4,30,26,40,3 p0,30,34,96,42,96,58,30,66 ~l4,3,8,40,26,40 ~l4,3,8,50,26,50 ~l4,3,8,60,26,60',
  vending: 'r0,16,8,68,84,6 r1,24,16,36,54,3 ~r2,66,30,10,16,2 ~r2,26,76,48,8,2',
  pottedplant: 'p0,32,58,68,58,64,90,36,90 o1,50,36,24 ~o1,34,48,13 ~o1,66,48,13',
  planter: '!f r0,8,18,84,64,8 r2,14,24,72,52,5 o1,30,50,13 o1,50,46,13 o1,70,52,13',
  flowerbed: 'o0,50,52,38 o1,30,38,11 o1,64,34,11 o1,52,66,12 o1,30,66,9 o1,72,60,9',
  wagon: '!f !r o1,20,82,10 o1,80,82,10 r0,6,20,88,56,6 ~r3,12,28,76,14,3',
  perch: 'l0,6,50,92,50,30 l1,7,22,30,78,30 ~o1,70,22,6',
  birdhouse: 'l2,6,50,92,50,60 r0,26,40,48,28,3 p1,20,42,50,16,80,42 o2,50,54,6',
  mailbox: 'l2,6,50,92,50,56 r0,24,22,52,36,14 ~r1,70,14,6,22,1',
  vane: 'l2,4,50,92,50,20 l1,5,22,34,78,34 p0,58,14,82,24,58,34 p0,22,24,36,18,36,30',
  grave: 'r1,22,80,56,10,4 r0,28,16,44,68,20 ~l2,3,40,40,60,40 ~l2,3,50,30,50,58',
  easel: 'l2,5,30,92,50,12 l2,5,70,92,50,12 l2,5,50,40,50,92 r0,24,20,52,44,2',
  cannon: '!f !r r0,20,30,72,32,14 o1,32,70,18 ~o2,90,46,6',
  stage: '!f r0,4,10,92,80,6 r1,4,10,92,18,6 ~l2,3,10,50,90,50 ~l2,3,10,72,90,72',
  spout: 'o1,50,62,26 r0,34,12,32,32,6 ~p1,44,44,56,44,60,72,40,72',
  basin: 'o0,50,50,38 o1,50,50,28 ~o6,42,42,7',
  canoe: '!f !r p0,2,50,20,30,80,30,98,50,80,70,20,70 p1,14,50,26,38,74,38,86,50,74,62,26,62 ~l0,4,40,38,40,62 ~l0,4,60,38,60,62',
  raft: '!f !r r0,4,18,92,64,30 r1,14,30,72,40,18',
  parasol: 'o0,50,50,42 w1,50,50,42,0,45 w1,50,50,42,90,135 w1,50,50,42,180,225 w1,50,50,42,270,315 o2,50,50,5',
  arrowsign: 'l2,6,50,92,50,50 p0,14,22,70,22,88,36,70,50,14,50 ~l1,4,24,36,64,36',
  arrowleft: 'l2,6,50,92,50,50 p0,86,22,30,22,12,36,30,50,86,50 ~l1,4,36,36,76,36',
  aboard: 'p0,26,14,74,14,84,88,16,88 r1,32,22,36,50,2 ~l5,2,38,34,62,34 ~l5,2,38,46,62,46 ~l5,2,38,58,56,58',
  sign: 'l2,6,50,92,50,56 r0,14,18,72,42,4 ~l1,4,24,32,76,32 ~l1,4,24,46,62,46',
  signpost: 'l2,6,50,92,50,10 p0,18,18,76,18,86,28,76,38,18,38 p0,82,46,24,46,14,56,24,66,82,66',
  infoboard: '!f l2,6,20,92,20,60 l2,6,80,92,80,60 r0,6,10,88,56,4 r1,12,16,76,44,2',
  hangsign: 'l2,4,14,12,86,12 l2,3,30,12,30,30 l2,3,70,12,70,30 r0,16,30,68,44,4 ~l1,4,28,52,72,52',
  stonesign: 'p0,14,82,20,30,40,16,70,18,86,36,84,82 ~l1,4,32,46,68,46 ~l1,4,32,60,60,60',
  crate: 'r0,12,12,76,76,4 r3,20,20,60,60,2 l2,6,22,22,78,78',
  barrel: 'o1,50,50,38 o0,50,50,31 ~l2,2,30,40,70,40 ~l2,2,26,52,74,52 ~l2,2,30,64,70,64',
  bags: 'o0,36,60,26 o0,66,56,23 o0,50,34,21 ~p1,44,12,56,12,50,20',
  cone: 'r2,12,12,76,76,8 o0,50,50,28 o1,50,50,18 o0,50,50,8',
  manhole: '!n o0,50,50,38 ~l2,3,20,40,80,40 ~l2,3,16,52,84,52 ~l2,3,20,64,80,64',
  hydrant: 'r1,26,84,48,8,3 r0,30,30,40,56,10 r0,22,46,56,14,6 o0,50,26,16 ~o1,50,53,6',
  sandbags: '!f r0,4,48,30,40,14 r0,35,48,30,40,14 r0,66,48,30,40,14 r0,20,12,30,40,14 r0,51,12,30,40,14',
  diggers: 'l1,6,20,88,58,30 p0,52,14,72,28,62,42,44,30 l1,6,60,88,76,30 p0,62,22,92,30,86,36,58,30',
  tires: 'a0,14,34,40,20,0,360 a0,14,66,40,20,0,360 a0,14,50,70,20,0,360',
  metaldrum: 'o0,50,50,38 o1,50,50,28 ~o4,66,40,5',
  supplies: '!f r0,4,30,40,56,4 r1,46,20,48,26,3 r1,46,50,48,26,3 ~l2,3,4,58,44,58',
  pipes: '!f !r r0,4,20,92,18,8 r0,4,41,92,18,8 r0,4,62,92,18,8',
  wheelbarrow: 'o1,12,50,9 p0,20,22,64,28,64,72,20,78 l2,5,64,34,94,30 l2,5,64,66,94,70',
  pile: 'e0,50,56,42,34 e3,44,46,22,16',
  sandtoys: 'p0,16,40,54,40,50,84,20,84 a2,4,35,40,16,180,360 l1,6,64,84,84,30 p1,76,20,92,24,88,40,72,36',
  dowsing: 'r0,26,52,48,38,8 l1,4,38,52,30,10 l1,4,62,52,70,10 o1,50,70,7',
  popper: 'p0,40,90,22,44,58,30 ~l1,4,46,30,62,8 ~l1,4,54,34,82,18 ~l1,4,58,42,90,40 o1,70,12,5 o1,88,30,5',
  star: 'p0,50,8,61,38,94,38,67,58,77,90,50,70,23,90,33,58,6,38,39,38 ~p3,50,8,61,38,50,52,39,38',
  paintballoon: 'o0,50,46,32 p0,44,76,56,76,50,86 l2,3,50,86,48,96 ~o6,40,36,8',
  firework: 'l2,3,50,88,50,98 r0,36,30,28,58,6 p1,36,32,50,12,64,32 ~r1,36,56,28,8,0',
  wishnote: 'l2,2,50,10,50,2 r0,32,10,36,76,3 o1,50,18,5 ~l2,3,40,34,60,34 ~l2,3,40,46,60,46',
  jackbox: 'r0,20,42,60,46,4 l2,4,50,42,50,28 o1,50,24,14 ~o4,45,22,2 ~o4,55,22,2',
  charm: 'l2,2,50,4,50,18 o0,50,42,22 p1,32,60,68,60,50,88 ~o6,42,36,5',
  chest: 'r0,12,28,76,56,8 r2,12,28,76,16,6 ~r1,24,28,8,56,0 ~r1,68,28,8,56,0 r1,44,40,12,16,2',
  doll: 'o1,34,16,8 o1,66,16,8 o0,50,66,26 o0,50,34,20 ~o2,44,32,2.5 ~o2,56,32,2.5',
  blob: 'e0,50,60,38,28 o0,50,44,22 ~o2,42,48,3 ~o2,58,48,3',
  cutout: '!f r0,6,10,88,80,6 o1,32,40,12 o1,68,40,12',
  bike: '!f !r !n a1,6,22,62,18,0,360 a1,6,78,62,18,0,360 l0,6,22,62,44,30,78,62 l0,6,44,30,66,30 l0,6,50,62,44,30 l0,5,66,30,70,20 r0,36,20,16,6,3',
  rod: 'l0,5,16,88,84,14 l1,1.5,84,14,84,60 o1,84,64,5 ~o2,26,76,7',
  pumpkin: 'r1,46,12,8,12,2 o0,50,56,36 ~p2,34,48,42,40,44,52 ~p2,66,48,58,40,56,52 ~p2,36,66,64,66,50,74',
  teeth: 'r0,14,30,72,40,18 ~l2,3,32,30,32,70 ~l2,3,50,30,50,70 ~l2,3,68,30,68,70',
  squid: 'l0,6,34,58,30,86 l0,6,50,60,50,90 l0,6,66,58,70,86 o0,50,36,26 ~o1,42,32,4 ~o1,58,32,4',
  fountain: 'o0,50,50,44 o1,50,50,34 o0,50,50,14 ~o6,50,50,6',
  statue: 'r1,20,74,60,16,3 o0,50,52,20 o0,50,28,14',
  rocket: 'p0,50,6,64,30,64,78,36,78,36,30 p1,36,58,20,86,36,78 p1,64,58,80,86,64,78 ~o6,50,34,6',
  ufo: 'e0,50,60,44,18 e1,50,46,22,18 ~o6,44,40,5',
  nugget: 'p0,24,70,18,46,34,26,60,22,80,38,82,64,62,80,36,80 ~p3,34,30,58,26,52,44,36,44',
  fossil: 'p0,18,72,14,42,30,20,58,14,82,30,86,62,66,84,36,86 ~a2,4,50,50,18,200,340 ~l2,4,34,62,66,62',
  backpack: 'a2,5,50,22,14,180,360 r0,22,20,56,68,14 r1,30,52,40,26,6 ~o1,40,36,6',
  waterbottle: 'r1,38,10,24,14,4 r0,30,22,40,66,12 ~o1,50,52,10',
  lunchbox: 'r0,14,24,72,54,8 r1,14,24,72,14,6 ~l2,3,50,40,50,76',
  map: 'p0,10,20,36,12,64,20,90,12,90,80,64,88,36,80,10,88 ~l2,2,36,12,36,80 ~l2,2,64,20,64,88 o1,70,68,12 ~l4,2,70,58,70,78',
  ring: 'a0,22,50,50,26,0,360 ~a1,22,50,50,26,0,45 ~a1,22,50,50,26,90,135 ~a1,22,50,50,26,180,225 ~a1,22,50,50,26,270,315',
  cooler: 'r0,12,26,76,56,8 r1,12,26,76,16,6 ~r2,40,48,20,6,3',
  net: '!f !r l2,4,10,10,10,90 l2,4,90,10,90,90 r1,10,30,80,26,0 ~l4,2,30,30,30,56 ~l4,2,50,30,50,56 ~l4,2,70,30,70,56 o0,30,76,10',
  projector: 'r0,16,40,68,44,8 o1,38,62,12 ~o4,38,62,5 p1,54,20,72,6,86,22,70,36',
  sleepingbag: '!f !r r0,4,14,92,72,24 r1,8,22,26,56,14 ~l2,3,40,20,40,80',
  spray: 'r1,38,14,24,18,3 r0,30,30,40,58,10 ~l6,3,40,40,40,76',
  juice: 'r0,14,30,20,56,5 r1,40,24,20,62,5 r0,66,30,20,56,5',
  camera: 'r0,22,22,20,10,2 r0,12,30,76,50,8 o1,50,55,16 ~o4,50,55,8',
  telescope: 'l2,4,30,90,44,56 l2,4,70,90,56,56 l2,4,50,90,50,56 l0,14,22,62,78,26 r1,72,18,14,16,3',
  stone: 'p0,12,80,18,34,48,14,82,30,88,78 ~p3,18,34,48,14,74,28,48,46',
  seccam: 'r2,26,78,30,10,2 l2,5,40,58,40,80 r0,20,30,56,28,6 r1,72,34,14,20,3',
  rugmat: '!f !n r0,6,6,88,88,10 r1,18,18,64,64,8 ~o0,50,50,14',
  cap: 'o0,50,50,36 ~a2,3,50,50,30,0,360 ~o6,40,40,8',
  bone: 'l0,14,26,74,74,26 o0,20,68,10 o0,32,80,10 o0,68,20,10 o0,80,32,10',
  heart: 'p0,50,86,14,48,14,30,30,16,50,26,70,16,86,30,86,48 ~p6,26,34,34,26,42,32,30,44',
  seed: 'e0,50,54,26,34 ~e3,42,44,8,14',
  drop: 'p0,50,10,74,52,74,66,62,84,38,84,26,66,26,52 ~o6,42,58,6',
  spoon: 'l0,8,30,86,58,40 e0,64,28,14,20',
  pouch: 'p0,30,30,70,30,82,80,18,80 r1,30,22,40,10,3 ~o6,40,56,6',
  glasses: 'o0,30,50,18 o0,70,50,18 l0,5,46,48,54,48',
  belt: '!f r0,4,40,92,20,4 r1,40,34,20,32,4',
  scarf: 'q0,10,12,30,50,60,88,30 l0,10,60,40,66,84 l0,10,74,34,84,76',
  beak: 'p0,14,40,86,50,14,64 ~l2,3,20,52,70,52',
  barb: 'p0,50,8,64,70,50,92,36,70 ~o6,46,44,5',
  feather: 'q0,8,22,80,30,40,78,16 l2,2,22,80,64,30',
  fang: 'p0,30,14,70,14,58,62,50,90,42,62',
  apple: 'l2,4,50,24,54,10 o0,50,56,32 ~w1,50,56,32,-60,30',
  egg: 'e0,50,54,28,36 ~o1,40,44,6 ~o1,60,62,7',
  knot: 'a0,8,34,50,18,0,360 a0,8,66,50,18,0,360',
  root: 'l0,10,50,10,50,60 l0,7,50,60,30,88 l0,7,50,60,70,88 l0,5,50,70,50,92',
  lens: 'l0,10,60,64,86,90 o0,40,44,28 o1,40,44,20 ~o6,32,36,6',
  dice: 'r0,16,16,68,68,12 ~o1,34,34,6 ~o1,66,66,6 ~o1,50,50,6',
  tail: 'q0,12,20,80,40,20,80,24',
  shield: 'p0,50,10,84,22,80,58,50,90,20,58,16,22 ~p1,50,24,70,32,66,56,50,76,34,56,30,32',
  cloche: 'e1,50,76,40,10 p0,16,74,20,50,40,34,60,34,80,50,84,74 o0,50,26,6',
  target: 'o0,50,50,38 o1,50,50,26 o0,50,50,14',
  amulet: 'a2,3,50,30,22,180,360 p0,50,40,70,58,50,86,30,58 ~p6,50,46,58,58,50,70',
  ladder: '!f !n l0,8,26,4,26,96 l0,8,74,4,74,96 l0,6,26,22,74,22 l0,6,26,50,74,50 l0,6,26,78,74,78',
  wire: '!f !r !n l0,4,0,50,100,50 ~o0,50,50,5',
  chain: '!f !r !n a0,5,22,50,13,0,360 a0,5,50,50,13,0,360 a0,5,78,50,13,0,360',
  rope: '!f !r !n q0,8,2,40,50,72,98,40',
  pulley: 'l2,4,40,58,40,96 l2,4,60,58,60,96 o0,50,40,24 o1,50,40,9',
  shutter: '!f r0,6,6,88,88,4 ~l2,3,10,24,90,24 ~l2,3,10,42,90,42 ~l2,3,10,60,90,60 ~l2,3,10,78,90,78',
  curtain: '!f p0,8,4,62,4,40,96,8,96 ~l2,3,22,10,18,90 ~l2,3,38,10,30,90',
  curtainr: '!f p0,92,4,38,4,60,96,92,96 ~l2,3,78,10,82,90 ~l2,3,62,10,70,90',
  hatch: 'r0,10,10,80,80,6 r1,20,20,60,60,4 ~l0,4,30,50,70,50',
  roofslope: '!f !n r0,0,0,100,100,0 r2,0,0,100,12,0 ~l2,3,0,37,100,37 ~l2,3,0,62,100,62 ~l2,3,0,87,100,87',
  roofhip: '!f !n r0,0,0,100,100,0 p3,0,0,100,0,50,50 ~l2,3,0,0,100,100 ~l2,3,100,0,0,100',
  roofvalley: '!f !n r0,0,0,100,100,0 p2,0,100,50,50,100,100 ~l2,3,0,0,50,50,100,0',
  roofflat: '!f !n r0,0,0,100,100,0 ~r3,10,10,80,80,3',
  roofdeco: '!n r0,0,0,100,100,0 o1,50,50,22 ~o5,50,50,10',
  fish: 'p1,80,50,98,28,98,72 p0,8,50,36,24,72,32,86,50,72,68,36,76 ~o2,28,44,4',
  skylight: '!f r0,4,4,92,92,4 r1,14,14,72,72,2 ~l0,4,50,14,50,86 ~l0,4,14,50,86,50',
  awning: '!f !n r1,0,6,100,66,0 r0,0,6,20,66,0 r0,40,6,20,66,0 r0,80,6,20,66,0 r2,0,70,100,10,0',
  corrugated: '!f !n r0,0,0,100,100,0 ~l2,3,12,0,12,100 ~l2,3,32,0,32,100 ~l2,3,52,0,52,100 ~l2,3,72,0,72,100 ~l2,3,92,0,92,100',
  handrail: '!f !r l0,8,4,50,96,50 o0,14,50,9 o0,86,50,9',
  bollard: 'o0,50,50,28 o3,50,50,17 ~o6,44,44,6',
  partition: '!f !r r0,4,36,92,28,4 ~l2,3,30,36,30,64 ~l2,3,50,36,50,64 ~l2,3,70,36,70,64',
  planks: '!f !n r0,0,0,100,100,0 l2,3,0,25,100,25 l2,3,0,50,100,50 l2,3,0,75,100,75 ~l2,2,68,0,68,25 ~l2,2,18,25,18,50 ~l2,2,84,50,84,75 ~l2,2,40,75,40,100 ~l2,1.5,14,12,52,12 ~l2,1.5,30,38,70,38 ~l2,1.5,10,62,56,62',
  steppingstones: 'o0,30,32,18 o0,70,40,16 o0,44,72,18',
  grate: '!f !n r0,0,0,100,100,0 ~l2,4,25,0,25,100 ~l2,4,50,0,50,100 ~l2,4,75,0,75,100 ~l2,4,0,25,100,25 ~l2,4,0,50,100,50 ~l2,4,0,75,100,75',
  slab: '!f !n r0,2,2,96,96,3 ~o2,18,18,3 ~o2,82,82,3 ~o2,82,18,3 ~o2,18,82,3',
  scaffold: '!f !n l0,7,8,8,92,8,92,92,8,92,8,8 l0,5,8,8,92,92 l0,5,92,8,8,92',
  logs: '!f !r r0,4,10,92,24,12 r0,4,38,92,24,12 r0,4,66,92,24,12 ~o3,10,22,6 ~o3,10,50,6 ~o3,10,78,6',
  netting: '!f !n l0,3,0,0,100,100 l0,3,34,0,100,66 l0,3,66,0,100,34 l0,3,0,34,66,100 l0,3,0,66,34,100 l0,3,100,0,0,100 l0,3,66,0,0,66 l0,3,34,0,0,34 l0,3,100,34,34,100 l0,3,100,66,66,100',
  border: '!f !r !n r0,0,36,100,28,2 ~l2,2,50,36,50,64',
  bordersingle: 'r0,30,30,40,40,4',
  bordercorner: '!n r0,36,36,64,28,2 r0,36,36,28,64,2',
  log: '!f !r r0,4,26,92,48,22 e3,90,50,8,20 ~e2,90,50,4,10',
  uplog: 'o0,50,50,36 o3,50,50,26 ~a2,2,50,50,15,0,360',
  beam: '!f !r r0,0,34,100,32,2 ~l2,3,0,50,100,50',
  column: 'r0,24,24,52,52,4 ~r3,32,32,36,36,2',
  pipeh: '!f !r !n r0,0,34,100,32,0 ~l3,4,0,42,100,42',
  pipev: 'o0,50,50,20 o2,50,50,11',
  pipecurve: '!n r0,34,34,66,32,0 r0,34,34,32,66,0',
  pipet: '!n r0,0,34,100,32,0 r0,34,34,32,66,0',
  pipecross: '!n r0,0,34,100,32,0 r0,34,0,32,100,0',
  pipeup: '!n r0,34,34,66,32,0 o0,50,50,20 o2,50,50,11',
  pipeupt: '!n r0,0,34,100,32,0 o0,50,50,20 o2,50,50,11',
  pipeupx: '!n r0,0,34,100,32,0 r0,34,0,32,100,0 o0,50,50,20 o2,50,50,11',
  glass: '!f !n r0,4,4,92,92,2 ~l6,4,20,70,70,20 ~l6,3,40,80,80,40',
  ironframe: '!f !n l0,6,8,8,92,8,92,92,8,92,8,8',
  rug: '!f !n r0,4,4,92,92,10 r1,12,12,76,76,8 ~r0,24,24,52,52,5',
  roundrug: '!n o0,50,50,47 o1,50,50,35 ~o0,50,50,18',
  ballmat: '!f !n r0,4,8,92,84,12 o5,50,50,30 w1,50,50,30,180,360 ~l4,4,22,50,78,50 o5,50,50,9',
  blobrug: '!f !n e0,50,54,47,42 ~o2,40,44,4 ~o2,60,44,4',
  gsoil: '!g o1,20,30,4 o1,70,20,3 o1,55,70,4 ~o1,15,82,3 ~o1,86,58,3',
  ggrass: '!g l1,4,20,42,24,28 l1,4,70,30,74,16 l1,4,45,82,49,68 ~l1,3,86,78,90,64 ~l1,3,8,92,12,80',
  gsand: '!g o1,22,24,2.5 o1,64,40,2.5 o1,40,72,2.5 ~o1,84,82,2 ~o1,12,60,2 ~o1,76,12,2',
  grock: '!g p1,10,22,24,16,32,28,18,34 p1,58,62,74,56,82,68,66,76 p1,70,14,82,12,84,22,72,24 ~p1,20,70,30,68,32,78,22,80',
  gspot: '!g o1,30,30,10 o1,74,68,12 ~o1,82,20,5 ~o1,18,80,5',
  gwater: '!g q1,4,12,36,28,24,44,36 q1,4,52,76,68,64,84,76 ~q1,3,60,24,72,16,84,24',
  gfall: '!g l1,5,16,0,16,100 l1,5,50,0,50,100 l1,5,84,0,84,100',
  gice: '!g l1,3,18,82,48,42 l1,3,58,92,84,56 ~l6,4,22,30,38,14',
  gplanks: '!g l1,3,0,0,100,0 l1,3,0,25,100,25 l1,3,0,50,100,50 l1,3,0,75,100,75 l1,3,0,100,100,100 l1,2,68,0,68,25 l1,2,18,25,18,50 l1,2,84,50,84,75 l1,2,40,75,40,100 ~l4,1.5,14,12,52,12 ~l4,1.5,30,38,70,38 ~l4,1.5,10,62,56,62 ~l4,1.5,52,88,92,88',
  gdiag: '!g l1,4,0,0,100,100 l1,4,0,50,50,100 l1,4,50,0,100,50',
  gcross: '!g l1,4,0,0,100,100 l1,4,100,0,0,100 ~l1,3,0,50,50,100 ~l1,3,50,0,100,50 ~l1,3,0,50,50,0 ~l1,3,50,100,100,50',
  gtiles: '!g l1,3,50,0,50,100 l1,3,0,50,100,50 l1,3,0,0,100,0 l1,3,0,100,100,100 l1,3,0,0,0,100 l1,3,100,0,100,100',
  gtile: '!g l1,4,0,0,100,0 l1,4,0,100,100,100 l1,4,0,0,0,100 l1,4,100,0,100,100 ~o6,28,28,6',
  gbricks: '!g l1,4,0,0,100,0 l1,4,0,50,100,50 l1,4,0,100,100,100 l1,4,50,0,50,50 l1,4,0,50,0,100 l1,4,100,50,100,100',
  gcobble: '!g r1,0,0,100,100,0 r0,5,5,40,40,14 r0,55,5,40,40,14 r0,5,55,40,40,14 r0,55,55,40,40,14',
  ghex: '!g l1,3,25,0,75,0,100,50,75,100,25,100,0,50,25,0',
  gmarble: '!g q1,3,0,30,40,8,100,52 ~q1,2,10,100,50,60,100,84',
  gcircle: '!g a1,5,50,50,30,0,360 ~o1,50,50,6',
  gtriangle: '!g p1,0,100,50,0,100,100',
  gcheck: '!g r1,0,0,50,50,0 r1,50,50,50,50,0',
  gmosaic: '!g r1,0,0,25,25,0 r1,50,0,25,25,0 r1,25,25,25,25,0 r1,75,25,25,25,0 r1,0,50,25,25,0 r1,50,50,25,25,0 r1,25,75,25,25,0 r1,75,75,25,25,0',
  ggingham: '!g r5,0,0,100,34,0 r5,0,0,34,100,0 r1,0,0,34,34,0',
  gtartan: '!g r1,0,38,100,24,0 r1,38,0,24,100,0 r4,46,0,8,100,0 r4,0,46,100,8,0',
  gstripev: '!g r1,0,0,25,100,0 r1,50,0,25,100,0',
  gstripeh: '!g r1,0,0,100,25,0 r1,0,50,100,25,0',
  gdots: '!g o1,25,25,13 o1,75,75,13',
  gbubbles: '!g a1,4,30,30,16,0,360 a1,4,74,70,12,0,360 ~a1,3,82,20,6,0,360',
  gargyle: '!g p1,50,0,100,50,50,100,0,50 ~l4,2,0,0,100,100 ~l4,2,100,0,0,100',
  ghound: '!g r1,0,0,50,50,0 r1,50,50,50,50,0 p1,50,0,75,0,50,25 p1,0,50,25,50,0,75',
  gleaf: '!g e1,30,30,13,7 e1,72,72,13,7 ~l4,2,18,30,42,30 ~l4,2,60,72,84,72',
  gflower: '!g o1,30,21,7 o1,21,30,7 o1,39,30,7 o1,30,39,7 o4,30,30,4 o1,72,63,7 o1,63,72,7 o1,81,72,7 o1,72,81,7 o4,72,72,4',
  gstar: '!g p1,30,12,35,25,48,25,38,33,42,46,30,38,18,46,22,33,12,25,25,25 p1,72,54,77,67,90,67,80,75,84,88,72,80,60,88,64,75,54,67,67,67',
  gberry: '!g o1,30,34,11 o1,70,74,11 ~l4,3,30,23,36,14 ~l4,3,70,63,76,54',
  gball: '!g o6,30,30,14 w1,30,30,14,180,360 o6,72,72,14 w1,72,72,14,180,360',
  gswirl: '!g a1,5,30,30,13,0,300 a1,5,72,72,13,0,300',
  gsnow: '!g l1,4,30,14,30,46 l1,4,16,22,44,38 l1,4,16,38,44,22 l1,4,72,56,72,88 l1,4,58,64,86,80 l1,4,58,80,86,64',
  ganchor: '!g l1,4,30,12,30,46 a1,4,30,34,13,20,160 l1,4,22,18,38,18 l1,4,72,54,72,88 a1,4,72,76,13,20,160 l1,4,64,60,80,60',
  gcoral: '!g l1,5,30,46,30,18 l1,4,30,30,20,18 l1,4,30,34,40,22 l1,5,72,88,72,60 l1,4,72,72,62,60 l1,4,72,76,82,64',
  gblob: '!g e1,30,32,15,11 e1,72,72,15,11 ~o4,26,30,2 ~o4,34,30,2 ~o4,68,70,2 ~o4,76,70,2',
  gwaves: '!g q1,5,0,30,25,12,50,30 q1,5,50,30,75,48,100,30 q1,5,0,80,25,62,50,80 q1,5,50,80,75,98,100,80',
  gzigzag: '!g l1,6,0,40,25,18,50,40,75,18,100,40 l1,6,0,90,25,68,50,90,75,68,100,90',
  gscale: '!g a1,4,25,50,25,0,180 a1,4,75,50,25,0,180 a1,4,0,0,25,0,180 a1,4,50,0,25,0,180 a1,4,100,0,25,0,180 a1,4,0,100,25,180,360 a1,4,50,100,25,180,360 a1,4,100,100,25,180,360',
  groadh: '!g r1,0,46,60,8,0',
  groadv: '!g r1,46,0,8,60,0',
  gmetal: '!g l1,4,0,0,100,0 l1,4,0,100,100,100 l1,4,0,0,0,100 l1,4,100,0,100,100 o1,14,14,4 o1,86,14,4 o1,14,86,4 o1,86,86,4',
  gneon: '!g l1,6,0,0,100,0 l1,6,0,100,100,100 l1,6,0,0,0,100 l1,6,100,0,100,100 ~l1,3,0,50,100,50 ~l1,3,50,0,50,100',
  ghay: '!g l1,4,10,20,40,30 l1,4,50,10,90,24 l1,4,20,60,60,70 l1,4,60,84,96,92 ~l1,3,0,44,30,52',
  gtatami: '!g l1,5,0,0,100,0 l1,5,0,100,100,100 ~l1,2,0,25,100,25 ~l1,2,0,50,100,50 ~l1,2,0,75,100,75',
  gcarpet: '!g o1,25,25,4 o1,75,75,4 ~o1,75,25,3 ~o1,25,75,3',
  gplain: '!g ~o6,30,30,5',
  house: 'r0,18,44,64,48,3 p1,6,48,50,10,94,48 r2,42,64,16,28,2 ~r3,24,56,12,12,1 ~r3,64,56,12,12,1',
  tent: 'p0,8,88,50,12,92,88 p1,40,88,50,52,60,88',
  sub: 'r0,40,22,20,22,3 e0,50,58,44,22 ~o1,32,58,6 ~o1,50,58,6 ~o1,68,58,6',
  center: 'r0,10,36,80,54,4 r1,6,26,88,16,4 r4,40,64,20,26,2 o1,50,50,8',
  windmill: 'p0,40,92,46,42,54,42,60,92 l1,8,50,42,22,14 l1,8,50,42,78,14 l1,8,50,42,22,70 l1,8,50,42,78,70 o2,50,42,6',
  charger: 'r0,24,18,52,72,8 r1,32,28,36,22,3 p1,52,56,40,74,50,74,46,88,62,68,52,68,56,56',
  office: 'r0,16,10,68,82,3 ~r1,24,18,12,12,1 ~r1,44,18,12,12,1 ~r1,64,18,12,12,1 ~r1,24,38,12,12,1 ~r1,44,38,12,12,1 ~r1,64,38,12,12,1 ~r1,24,58,12,12,1 ~r1,64,58,12,12,1 r2,42,70,16,22,1',
  shop: 'r0,8,36,84,56,3 r1,4,24,92,16,3 ~r5,14,24,12,16,0 ~r5,38,24,12,16,0 ~r5,62,24,12,16,0 r5,16,54,40,24,2 r2,64,56,18,36,2',
  clocktower: 'r0,34,26,32,68,2 p1,30,28,50,4,70,28 o5,50,44,10 ~l4,2,50,44,50,37 ~l4,2,50,44,55,46',
  temple: 'p1,6,30,50,8,94,30 r0,12,30,76,8,0 r0,18,40,10,44,1 r0,36,40,10,44,1 r0,54,40,10,44,1 r0,72,40,10,44,1 r0,8,84,84,8,1',
  park: 'r0,14,64,72,12,4 o1,28,34,16 o1,70,30,14 ~o1,74,70,8',
  mural: '!f r0,2,10,96,80,3 p1,10,80,30,30,50,60,70,24,90,80',
  altar: 'r0,10,72,80,18,2 r0,24,52,52,20,2 p1,50,8,66,30,58,48,42,48,34,30',
  poster: 'r0,16,10,68,80,3 r1,22,16,56,56,2 o0,50,40,12 ~r4,30,78,40,6,2',
  postermtn: 'r0,16,10,68,80,3 r1,22,16,56,56,2 p0,22,72,40,38,52,54,62,42,78,72 ~r4,30,78,40,6,2',
  posterwave: 'r0,16,10,68,80,3 r1,22,16,56,56,2 q0,6,22,50,36,38,50,50 q0,6,50,50,64,62,78,50 ~r4,30,78,40,6,2',
  posterbolt: 'r0,16,10,68,80,3 r1,22,16,56,56,2 p0,56,20,36,48,48,48,42,70,64,40,52,40 ~r4,30,78,40,6,2',
};
const lookDefs = new Map(), LOOK_D = Math.PI / 180, gTiles = new Map();
function groundTile(c, it, s, ox = view.px, oy = view.py) {
  const px = Math.max(4, Math.round(s * dpr)); let t = gTiles.get(it.i);
  if (!t || t.px !== px || t.c !== c) {
    const cv = document.createElement('canvas'); cv.width = cv.height = px; const x = cv.getContext('2d'), sd = dpr; dpr = 1; drawLook(x, it, 0, 0, px); dpr = sd;
    t = { px, c, pat: c.createPattern(cv, 'repeat'), at: '' }; gTiles.set(it.i, t);
  }
  const at = s + ',' + ox + ',' + oy; if (t.at !== at) { t.at = at; t.pat.setTransform(new DOMMatrix([s / px, 0, 0, s / px, ox, oy])); }
  return t.pat;
}
function lookDef(k) {
  let d = lookDefs.get(k); if (d) return d;
  d = { f: 0, r: 0, n: 0, p: [], big: -1 }; let best = 0;
  for (let t of (LOOKS[k] || LOOKS.chip).split(' ')) {
    if (t[0] === '!') { d[t[1]] = 1; if (t[1] === 'g') d.f = d.n = d.o = 1; continue; }
    const fine = t[0] === '~'; if (fine) t = t.slice(1);
    const q = [t[0], fine, ...t.slice(1).split(',').map(Number)];
    let ar = 0; if (q[0] === 'r') ar = q[5] * q[6]; else if (q[0] === 'o') ar = 3.14 * q[5] * q[5]; else if (q[0] === 'e') ar = 3.14 * q[5] * q[6];
    else if (q[0] === 'p') for (let i = 3; i < q.length; i += 2) { const j = i + 2 < q.length ? i + 2 : 3; ar += (q[i] * q[j + 1] - q[j] * q[i + 1]) / 2; }
    ar = Math.abs(ar); if (!fine && ar > best) { best = ar; d.big = d.p.length; }
    d.p.push(q);
  }
  lookDefs.set(k, d); return d;
}
function lookPal(lk) {
  if (lk.pal) return lk.pal;
  const a = lk.a, b = lk.b || (lum(a) > 0.6 ? shade(a, -0.28) : shade(a, 0.38)), f = [a, b, shade(a, -0.32), shade(a, 0.32), shade(b, -0.32), shade(b, 0.32), 'rgba(255,255,255,.55)', 'rgba(0,0,0,.25)'];
  return lk.pal = { f, o: f.map((q, i) => i < 6 ? shade(q, -0.5) : null) };
}
const lookSprites = new Map(); let lookSpriteN = 0;
function drawLook(c, it, x, y, s, wc = 1, hc = 1) {
  const lk = it.look; if (!lk) return false;
  const known = LOOKS[lk.k], W = wc * s, H = hc * s;
  if ((!known && structural(it)) || (known && lookDef(lk.k).g) || Math.min(W, H) * dpr < 11) return drawLookRaw(c, it, x, y, s, wc, hc);
  const bs = 2 ** (Math.ceil(Math.log2(s * dpr) * 8) / 8), key = it.i + ':' + wc + ':' + hc + ':' + bs + ':' + dpr;
  let sp = lookSprites.get(key);
  if (!sp) {
    if (++lookSpriteN > 1500) { lookSprites.clear(); lookSpriteN = 1; }
    const sb = bs / dpr, pad = Math.ceil(sb * 0.1), cv = document.createElement('canvas'); cv.width = Math.ceil((wc * sb + pad * 2) * dpr); cv.height = Math.ceil((hc * sb + pad * 2) * dpr);
    const x2 = cv.getContext('2d'); x2.scale(dpr, dpr); drawLookRaw(x2, it, pad, pad, sb, wc, hc);
    sp = { cv, pad, sb }; lookSprites.set(key, sp);
  }
  const k = s / sp.sb; c.drawImage(sp.cv, x - sp.pad * k, y - sp.pad * k, sp.cv.width / dpr * k, sp.cv.height / dpr * k);
  return true;
}
function lookPlate(c, lk, x, y, W, H, s) { const al = c.globalAlpha; c.globalAlpha = al * 0.24; c.fillStyle = lum(lk.a) > 0.7 ? shade(lk.a, -0.35) : lk.a; roundRect(c, x + 1, y + 1, W - 2, H - 2, Math.min(8, s * 0.2)); c.fill(); c.globalAlpha = al; }
function drawLookRaw(c, it, x, y, s, wc = 1, hc = 1) {
  const lk = it.look;
  if (!LOOKS[lk.k]) { if (lk.k === it.sh) { if (wc * hc > 1) lookPlate(c, lk, x, y, wc * s, hc * s, s); drawItem(c, it, x, y, s, wc, hc, false); return true; } if (structural(it)) { drawStructure(c, it, x, y, s, wc, hc, null); return true; } if (FURN_KINDS.some(f => f[0] === lk.k)) { drawFurniture(c, it, lk.k, x, y, s, wc, hc); return true; } }
  const W = wc * s, H = hc * s, m = Math.min(W, H), d = lookDef(lk.k), pal = lookPal(lk), px = m * dpr;
  if (d.g && px < 9) { c.fillStyle = lk.a; c.fillRect(x, y, W + 0.6, H + 0.6); return true; }
  if (px < 11 && !d.g) { const q = d.big >= 0 ? d.p[d.big][2] : 0, g = m * 0.12; c.fillStyle = pal.f[q] || lk.a; roundRect(c, x + g, y + g, W - 2 * g, H - 2 * g, m * 0.2); c.fill(); return true; }
  if (!d.f && Math.abs(W - H) > 0.5 && it.c !== 'Kits') lookPlate(c, lk, x, y, W, H, s);
  const fine = px >= 26, edge = px >= 16, rot = d.r && H > W;
  let bx = x, by = y, bw = W, bh = H; if (!d.f) { bx = x + (W - m) / 2; by = y + (H - m) / 2; bw = bh = m; }
  const su = (rot ? bh : bw) / 100, sv = (rot ? bw : bh) / 100, k = Math.min(su, sv), lw = Math.max(0.8, m * 0.035), turn = rot ? Math.PI / 2 : 0;
  const X = rot ? (u, v) => bx + bw - v * sv : (u, v) => bx + u * su, Y = rot ? (u, v) => by + u * su : (u, v) => by + v * sv;
  const path = (q) => {
    c.beginPath();
    switch (q[0]) {
      case 'o': c.arc(X(q[3], q[4]), Y(q[3], q[4]), q[5] * k, 0, 7); break;
      case 'e': c.ellipse(X(q[3], q[4]), Y(q[3], q[4]), rot ? q[6] * sv : q[5] * su, rot ? q[5] * su : q[6] * sv, 0, 0, 7); break;
      case 'r': { const x0 = X(q[3], q[4]), y0 = Y(q[3], q[4]), x1 = X(q[3] + q[5], q[4] + q[6]), y1 = Y(q[3] + q[5], q[4] + q[6]), w = Math.abs(x1 - x0), h = Math.abs(y1 - y0); roundRect(c, Math.min(x0, x1), Math.min(y0, y1), w, h, Math.min(q[7] * k, w / 2, h / 2)); break; }
      case 'p': c.moveTo(X(q[3], q[4]), Y(q[3], q[4])); for (let i = 5; i < q.length; i += 2) c.lineTo(X(q[i], q[i + 1]), Y(q[i], q[i + 1])); c.closePath(); break;
      case 'w': { const cx = X(q[3], q[4]), cy = Y(q[3], q[4]); c.moveTo(cx, cy); c.arc(cx, cy, q[5] * k, q[6] * LOOK_D + turn, q[7] * LOOK_D + turn); c.closePath(); break; }
      case 'l': c.moveTo(X(q[4], q[5]), Y(q[4], q[5])); for (let i = 6; i < q.length; i += 2) c.lineTo(X(q[i], q[i + 1]), Y(q[i], q[i + 1])); break;
      case 'q': c.moveTo(X(q[4], q[5]), Y(q[4], q[5])); c.quadraticCurveTo(X(q[6], q[7]), Y(q[6], q[7]), X(q[8], q[9]), Y(q[8], q[9])); break;
      case 'a': c.arc(X(q[4], q[5]), Y(q[4], q[5]), q[6] * k, q[7] * LOOK_D + turn, q[8] * LOOK_D + turn); break;
    }
  };
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  if (d.g) { c.fillStyle = lk.a; c.fillRect(x, y, W + 0.6, H + 0.6); c.beginPath(); c.rect(x, y, W + 0.6, H + 0.6); c.clip(); }
  if (!d.n && d.big >= 0) { const ox = m * 0.04, oy = m * 0.06; c.translate(ox, oy); path(d.p[d.big]); c.fillStyle = 'rgba(0,0,0,.16)'; c.fill(); c.translate(-ox, -oy); }
  for (const q of d.p) {
    if (q[1] && !fine) continue;
    path(q);
    if (q[0] === 'l' || q[0] === 'q' || q[0] === 'a') { const w = Math.max(1, q[3] * k); if (edge && !d.o && q[3] >= 5 && pal.o[q[2]]) { c.strokeStyle = pal.o[q[2]]; c.lineWidth = w + lw * 2; c.stroke(); } c.strokeStyle = pal.f[q[2]]; c.lineWidth = w; c.stroke(); }
    else { c.fillStyle = pal.f[q[2]]; c.fill(); if (edge && !d.o && pal.o[q[2]]) { c.strokeStyle = pal.o[q[2]]; c.lineWidth = lw; c.stroke(); } }
  }
  c.restore(); return true;
}
const isRug = (it) => it.c === 'Rug' || it.ht === 0;
const painted = (it) => it.L === 'g' && !isRug(it);
const rugsOf = (p) => [...p.rugs.values()];
const overlaps = (r, x, y, w, h) => r.x < x + w && r.x + r.w > x && r.y < y + h && r.y + r.h > y;
const rugShown = (r) => lvShown('r') && !hidden.has(zOf(r));
function rugAt(x, y, all) { let best = null; for (const r of plan.rugs.values()) if (overlaps(r, x, y, 1, 1) && (all || rugShown(r)) && (!best || zOf(r) > zOf(best))) best = r; return best; }
function addRug(i, x, y, w, h, z = 1) { beginTx(); const r = { id: plan.nextId++, rug: 1, i, x, y, w, h }; if (z) r.z = z; plan.rugs.set(r.id, r); touchOb(r); tx.add.push(r); return r; }
function rugLevel(p, x, y, w, h) { let z = -Infinity; for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (inB(p, xx, yy)) z = Math.max(z, standZ(yy * p.w + xx, p)); return z === -Infinity ? 1 : z; }
function delRug(r) { if (!plan.rugs.has(r.id)) return; beginTx(); plan.rugs.delete(r.id); touchOb(r); const ai = tx.add.indexOf(r); if (ai >= 0) tx.add.splice(ai, 1); else tx.del.push(r); }
function placeRug(it, x, y) {
  const ft = footOf(it), w = rotated ? ft[1] : ft[0], hh = rotated ? ft[0] : ft[1];
  if (x + w > plan.w || y + hh > plan.h) { toast(it.n + ' is ' + w + '×' + hh + ' and doesn\'t fit here.'); return; }
  const z = placeZ(it, x, y, w, hh); if (z > ZMAX || z < ZMIN) { placeMiss.push({ i: it.i, x, y, w, h: hh, z, err: z > ZMAX ? 'top' : 'bottom' }); return; }
  const under = rugsOf(plan).filter(r => zOf(r) === z && overlaps(r, x, y, w, hh)); if (under.some(r => r.i === it.i)) return;
  const solid = []; for (let yy = y; yy < y + hh; yy++) for (let xx = x; xx < x + w; xx++) if (terrAt(plan, yy * plan.w + xx, z)) solid.push(yy * plan.w + xx);
  if (solid.length && !layerReplace) { const k = solid[0]; placeMiss.push({ i: it.i, x, y, w, h: hh, z, err: { i: terrAt(plan, k, z) - 1, terr: 1, k, z } }); return; }
  for (const k of solid) setTerr(k, z, 0); for (const r of under) delRug(r); addRug(it.i, x, y, w, hh, z); placeHit++; reveal(z);
}
function rugCellsToRugs(p) {
  const W = p.w, g = p.ground, taken = new Uint8Array(g.length), found = [], foot = (it) => userSizes[it.n] || (p.isz && p.isz[it.n]) || [it.w || 1, it.h || 1];
  for (let k = 0; k < g.length; k++) {
    const v = g[k]; if (!v || taken[k] || !ITEMS[v - 1] || !isRug(ITEMS[v - 1])) continue;
    const x = k % W, y = (k - x) / W, f = foot(ITEMS[v - 1]);
    const free = (w, h) => { if (x + w > W || y + h > p.h) return false; for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { const q = yy * W + xx; if (g[q] !== v || taken[q]) return false; } return true; };
    let w = f[0], h = f[1];
    if (!free(w, h)) { if (free(h, w)) [w, h] = [h, w]; else { w = 1; while (w < f[0] && x + w < W && g[k + w] === v && !taken[k + w]) w++; h = 1; while (h < f[1] && free(w, h + 1)) h++; } }
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) taken[yy * W + xx] = 1;
    found.push({ i: v - 1, x, y, w, h });
  }
  for (const r of found) {
    const n = new Map(), add = (xx, yy) => { if (xx < 0 || yy < 0 || xx >= W || yy >= p.h) return; const v = g[yy * W + xx]; if (v && !taken[yy * W + xx]) n.set(v, (n.get(v) || 0) + 1); };
    for (let xx = r.x - 1; xx <= r.x + r.w; xx++) { add(xx, r.y - 1); add(xx, r.y + r.h); } for (let yy = r.y; yy < r.y + r.h; yy++) { add(r.x - 1, yy); add(r.x + r.w, yy); }
    let best = 0, bv = 0; for (const [v, c] of n) if (c > best) { best = c; bv = v; } r.under = bv;
  }
  for (const r of found) { for (let yy = r.y; yy < r.y + r.h; yy++) for (let xx = r.x; xx < r.x + r.w; xx++) g[yy * W + xx] = r.under; const q = { id: p.nextId++, rug: 1, i: r.i, x: r.x, y: r.y, w: r.w, h: r.h }, z = rugLevel(p, r.x, r.y, r.w, r.h); if (z) q.z = z; p.rugs.set(q.id, q); }
}
function drawRug(c, it, x, y, s, w, h, under) {
  const u = S.pics && s * dpr >= MAP_PIC_MIN ? picsFor(it)[0] : null, p = u && mapPic(u); if (!p) return false;
  const a = c.globalAlpha;
  if (under) for (let j = 0; j < h; j++) drawGroundRun(c, under, x, y + j * s, s, w);
  else if (under === null) { c.fillStyle = theme['map-empty'] || '#f4efe4'; c.fillRect(x, y, w * s + 0.6, h * s + 0.6); }
  c.globalAlpha = a; const pad = Math.max(1, s * 0.06); drawPicIn(c, p, x + pad, y + pad, w * s - pad * 2, h * s - pad * 2, true); return true;
}
function drawGroundRun(c, it, x, y, s, n) {
  const pp = picsFor(it), p = S.pics && pp[1] && s * dpr >= TILE_PIC_MIN ? mapPic(pp[1]) : null;
  if (isRug(it)) { c.fillStyle = pp[2] || it.col; c.fillRect(x, y, n * s + 0.6, s + 0.6); return; }
  if (p) {
    const [src] = sizedPic(p, Math.ceil(s * dpr)), at = s + ',' + view.px + ',' + view.py;
    if (!p.pat || p.pat[0] !== src || p.pat[2] !== c) p.pat = [src, c.createPattern(src, 'repeat'), c, ''];
    if (p.pat[3] !== at) { p.pat[3] = at; p.pat[1].setTransform(new DOMMatrix([s / (src.naturalWidth || src.width), 0, 0, s / (src.naturalHeight || src.height), view.px, view.py])); }
    c.fillStyle = p.pat[1]; c.fillRect(x, y, n * s + 0.6, s + 0.6); return;
  }
  if (s < 9) { c.fillStyle = it.look ? it.look.a : pp[2] || it.col; c.fillRect(x, y, n * s + 0.6, s + 0.6); return; }
  if (it.look) { c.fillStyle = groundTile(c, it, s); c.fillRect(x, y, n * s + 0.6, s + 0.6); return; }
  for (let i = 0; i < n; i++) drawGroundCell(c, it, x + i * s, y, s);
}
function drawGroundCell(c, it, x, y, s) {
  const pp = picsFor(it);
  if (isRug(it)) { c.fillStyle = pp[2] || it.col; c.fillRect(x, y, s + 0.6, s + 0.6); return; }
  if (S.pics && pp[1] && s * dpr >= TILE_PIC_MIN) { const p = mapPic(pp[1]); if (p) { drawPicIn(c, p, x, y, s + 0.6, s + 0.6, true); return; } }
  if (drawLook(c, it, x, y, s)) return;
  c.fillStyle = pp[2] || it.col; c.fillRect(x, y, s + 0.6, s + 0.6);
  if (s < 9) return;
  const n = it.n;
  if (LIQUID.has(n)) { c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x + s * 0.2, y + s * 0.4); c.quadraticCurveTo(x + s * 0.35, y + s * 0.3, x + s * 0.5, y + s * 0.4); c.moveTo(x + s * 0.45, y + s * 0.7); c.quadraticCurveTo(x + s * 0.6, y + s * 0.6, x + s * 0.75, y + s * 0.7); c.stroke(); if (n === 'Waterfall') { c.strokeStyle = 'rgba(255,255,255,.6)'; c.beginPath(); for (let i = 1; i < 4; i++) { c.moveTo(x + s * i / 4, y); c.lineTo(x + s * i / 4, y + s); } c.stroke(); } }
  else if (it.c !== 'Terrain') {
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 1;
    if (/tiling|flooring|marble/i.test(n)) { c.strokeRect(x + 0.5, y + 0.5, s / 2, s / 2); c.strokeRect(x + s / 2 + 0.5, y + s / 2 + 0.5, s / 2 - 1, s / 2 - 1); }
    else if (/road/i.test(n)) { c.fillStyle = 'rgba(255,255,255,.5)'; if (/vertical/i.test(n)) c.fillRect(x + s * 0.46, y + s * 0.2, s * 0.08, s * 0.6); else c.fillRect(x + s * 0.2, y + s * 0.46, s * 0.6, s * 0.08); }
    else if (/print|carpet|rug|mat/i.test(n)) { c.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { c.beginPath(); c.arc(x + s * (0.28 + i * 0.44), y + s * (0.28 + j * 0.44), s * 0.07, 0, 7); c.fill(); } }
  }
}

const sparkles = [];
function celebrate(z, r) {
  if (calm() || !S.party) { toast(r.kind === 'house' ? 'House is habitable' : 'Habitat restored: ' + r.best.hb.n); return; }
  const now = performance.now();
  for (let i = 0; i < 26; i++) sparkles.push({ zx: z.x + Math.random() * z.w, zy: z.y + Math.random() * z.h, t0: now + Math.random() * 300, life: 900 + Math.random() * 500, r: 0.15 + Math.random() * 0.25 });
  toast(r.kind === 'house' ? 'House is habitable' : 'Habitat restored: ' + r.best.hb.n); requestDraw();
}

function draw(t, c = ctx) {
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = theme['map-bg'] || '#e4e9e2'; c.fillRect(0, 0, W, H);
  if (!plan) return;
  const s = cellSize();
  const x0 = clamp(Math.floor(-view.px / s), 0, plan.w), y0 = clamp(Math.floor(-view.py / s), 0, plan.h);
  const x1 = clamp(Math.ceil((W - view.px) / s), 0, plan.w), y1 = clamp(Math.ceil((H - view.py) / s), 0, plan.h);
  c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(view.px + 4, view.py + 6, plan.w * s, plan.h * s);
  c.fillStyle = theme['map-empty']; c.fillRect(view.px, view.py, plan.w * s, plan.h * s);
  const gShow = lvShown('g'), cut = layerZ != null ? layerZ : Infinity, V = terrView(x0, y0, x1, y1, cut);
  drawTerr(c, V, V.tv, s);
  if (S.shade) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const z = V.tv[(y - y0) * V.cw + x - x0]; if (z === NONE_Z || !z) continue; const px = view.px + x * s, py = view.py + y * s;
    c.fillStyle = z > 0 ? `rgba(255,255,255,${Math.min(0.32, z * 0.05)})` : `rgba(0,0,0,${Math.min(0.35, -z * 0.07)})`; c.fillRect(px, py, s + 0.6, s + 0.6);
  }
  if (S.shade) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const z = V.tv[(y - y0) * V.cw + x - x0]; if (z === NONE_Z) continue; const px = view.px + x * s, py = view.py + y * s;
    const below = V.at(x, y + 1), right = V.at(x + 1, y), bl = below === NONE_Z ? z - 1 : below, rt = right === NONE_Z ? z - 1 : right;
    if (bl < z && y + 1 < plan.h) { c.fillStyle = `rgba(0,0,0,${Math.min(0.45, (z - bl) * 0.12)})`; c.fillRect(px, py + s * 0.82, s + 0.6, s * 0.18 + 0.6); }
    if (rt < z && x + 1 < plan.w) { c.fillStyle = `rgba(0,0,0,${Math.min(0.3, (z - rt) * 0.08)})`; c.fillRect(px + s * 0.88, py, s * 0.12 + 0.6, s); }
  }
  if (s >= 10 && S.grid === 'all') {
    c.lineWidth = 1; c.strokeStyle = theme['map-grid']; c.beginPath();
    for (let x = x0; x <= x1; x++) { const px = Math.round(view.px + x * s) + 0.5; c.moveTo(px, view.py + y0 * s); c.lineTo(px, view.py + y1 * s); }
    for (let y = y0; y <= y1; y++) { const py = Math.round(view.py + y * s) + 0.5; c.moveTo(view.px + x0 * s, py); c.lineTo(view.px + x1 * s, py); }
    c.stroke();
  }
  if (S.grid !== 'off' && s >= 2) { c.strokeStyle = theme['map-chunk']; c.lineWidth = 1; c.beginPath();
  for (let x = Math.ceil(x0 / 8) * 8; x <= x1; x += 8) { const px = Math.round(view.px + x * s) + 0.5; c.moveTo(px, view.py + y0 * s); c.lineTo(px, view.py + y1 * s); }
  for (let y = Math.ceil(y0 / 8) * 8; y <= y1; y += 8) { const py = Math.round(view.py + y * s) + 0.5; c.moveTo(view.px + x0 * s, py); c.lineTo(view.px + x1 * s, py); }
  c.stroke(); }
  for (const z of plan.zones) {
    const r = zoneStatus.get(z.id); const col = z.kind === 'label' ? theme.muted : r && r.ok ? theme.good : (r && (r.kind === 'habitat' && (r.target || r.near))) ? theme.warn : theme.muted;
    c.fillStyle = col; c.globalAlpha = 0.08; c.fillRect(view.px + z.x * s, view.py + z.y * s, z.w * s, z.h * s); c.globalAlpha = 1;
  }
  for (const z of plan.zones) {
    const r = zoneStatus.get(z.id); if (!r || !r.area) continue;
    const sel = selection && selection.zone && selection.zone.id === z.id;
    if (!showAreas && !sel) continue;
    drawArea(c, r.area, s, sel);
  }
  let resIx = null; const rix = () => resIx || (resIx = residentsIndex());
  const rugs = [...plan.rugs.values()].filter(r => rugShown(r) && !(r.x + r.w < x0 || r.x > x1 || r.y + r.h < y0 || r.y > y1)), rugLv = new Map();
  for (const r of rugs) { const z = zOf(r); let covered = true; for (let y = r.y; y < r.y + r.h && covered; y++) for (let x = r.x; x < r.x + r.w; x++) { const t = V.at(x, y); if (t === NONE_Z || t < z) { covered = false; break; } } if (covered && z <= cut) continue; if (!rugLv.has(z)) rugLv.set(z, []); rugLv.get(z).push(r); }
  const drawRugs = (z) => { for (const r of rugLv.get(z) || []) { const it = ITEMS[r.i], rx = view.px + r.x * s, ry = view.py + r.y * s; if (!drawRug(c, it, rx, ry, s, r.w, r.h) && !drawLook(c, it, rx, ry, s, r.w, r.h)) { c.fillStyle = picsFor(it)[2] || it.col; c.fillRect(rx, ry, r.w * s, r.h * s); } if (s >= 18 && z !== rugLevel(plan, r.x, r.y, r.w, r.h)) lvBadge(c, z, rx, ry, s); } };
  const lvAll = [...new Set([...plan.zs, ...rugLv.keys()])].sort((a, b) => a - b);
  for (const z of lvAll) if (z <= cut) { drawRugs(z); drawObjs(c, z, s, V, rix); }
  if (cut !== Infinity) {
    c.save(); c.globalAlpha = 0.28; drawTerr(c, V, V.tf, s); for (const z of lvAll) if (z > cut) { drawRugs(z); drawObjs(c, z, s, V, rix); } c.restore();
  }
  if (s >= 30 && gShow && S.shade) { c.font = '700 10px sans-serif'; c.textAlign = 'right'; c.textBaseline = 'top'; c.fillStyle = 'rgba(0,0,0,.55)'; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const z = V.tv[(y - y0) * V.cw + x - x0]; if (z !== NONE_Z && z) c.fillText((z > 0 ? '▲' : '▼') + Math.abs(z), view.px + (x + 1) * s - 2, view.py + y * s + 2); } }
  for (const hs of autoHouses) {
    const sel = selection && selection.house === hs.id;
    if ((showAreas || sel) && !hs.enclosure) drawArea(c, hs.area, s, sel);
    const R = hs.area.outer, px = view.px + R.x * s, py = view.py + R.y * s, col = hs.ok ? theme.good : hs.enclosure ? theme.muted : theme.warn;
    if (!showAreas && !sel) { c.strokeStyle = col; c.globalAlpha = 0.9; c.lineWidth = 2; c.setLineDash([6, 4]); c.strokeRect(px + 1, py + 1, R.w * s - 2, R.h * s - 2); c.setLineDash([]); c.globalAlpha = 1; }
    if (s >= 7 && S.labels) { const small = s < 14, fh = small ? 14 : 18; const nres = (rix().homes.get('house:' + hs.id) || { list: [] }).list.length; const label = hs.enclosure ? 'Enclosure · ' + hs.kitHomes.length + ' kit home' + (hs.kitHomes.length > 1 ? 's' : '') : (hs.ok ? 'House ✓' : 'House · ' + houseIssues(hs)[0]) + (nres ? ' · ' + nres + '/4' : '') + (hs.kitHomes.length ? ' · +' + hs.kitHomes.length + ' kit' : ''); c.font = `700 ${small ? 10 : 12}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; const tw = c.measureText(label).width + (small ? 10 : 14); c.fillStyle = col; roundRect(c, px, py - fh - 2, tw, fh, small ? 4 : 6); c.fill(); c.fillStyle = '#fff'; c.fillText(label, px + (small ? 5 : 7), py - fh / 2 - 2); }
    if (s >= 10 && S.faces && !hs.enclosure) { const e = rix().homes.get('house:' + hs.id); if (e && e.list.length) { const d = Math.round(clamp(s * 0.95, 16, 30)); drawFaces(c, e.list.map(r => r.p), px + 4, py + R.h * s - d * 0.62, d); } }
  }
  c.textAlign = 'left'; c.textBaseline = 'middle';
  for (const z of plan.zones) {
    const r = zoneStatus.get(z.id); const px = view.px + z.x * s, py = view.py + z.y * s;
    const col = z.kind === 'label' ? theme.muted : r && r.ok ? theme.good : (r && (r.target || r.near)) ? theme.warn : theme.muted;
    c.setLineDash(r && r.ok ? [] : [6, 4]); c.lineWidth = selection && selection.zone === z ? 3 : 2; c.strokeStyle = col; c.strokeRect(px + 1, py + 1, z.w * s - 2, z.h * s - 2); c.setLineDash([]);
    if (s >= 7 && S.labels) {
      const small = s < 14, fh = small ? 14 : 18, label = small && r && r.ok && z.kind !== 'label' ? (z.kind === 'house' ? 'House ✓' : r.best.hb.n + ' ✓') : zoneLabel(z, r);
      c.font = `700 ${small ? 10 : 12}px ${BODY_FONT}`; const pad = small ? 10 : 14, t = fitLabel(c, label, (small ? Math.max(z.w * s + 16, 30) : Math.max(z.w * s, 40) + 120) - pad), bw = c.measureText(t).width + pad;
      c.fillStyle = col; roundRect(c, px, py - fh - 2, bw, fh, small ? 4 : 6); c.fill(); c.fillStyle = '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, px + pad / 2, py - fh / 2 - 2);
    }
  }
  drawFields(c, s);
  drawDrops(c, s);
  drawPourPreview(c, s);
  drawReach(c, s);
  drawPower(c, s);
  drawSignals(c, s);
  if (selection && selection.obj && plan.objs.has(selection.obj.id) && isBox(ITEMS[selection.obj.i])) drawBoxReach(c, selection.obj, s);
  if (pkDrag && c === ctx) drawPkDrop(c, s);
  if (selection && ((selection.obj && plan.objs.has(selection.obj.id)) || (selection.rug && plan.rugs.has(selection.rug.id)))) { const ob = selection.obj || selection.rug; c.strokeStyle = theme.accent; c.lineWidth = 3; c.strokeRect(view.px + ob.x * s - 1.5, view.py + ob.y * s - 1.5, ob.w * s + 3, ob.h * s + 3); }
  if (selection && selection.group && !(drag && drag.kind === 'grpmove' && drag.moved)) drawGroupSel(c, s, selection.group);
  if (drag && drag.rect) { const r = normRect(drag.rect); c.strokeStyle = theme.accent; c.lineWidth = 2; c.setLineDash([4, 3]); c.strokeRect(view.px + r.x * s, view.py + r.y * s, r.w * s, r.h * s); c.setLineDash([]); c.fillStyle = theme.accent; c.globalAlpha = 0.12; c.fillRect(view.px + r.x * s, view.py + r.y * s, r.w * s, r.h * s); c.globalAlpha = 1; c.fillStyle = theme.ink; c.font = '700 12px sans-serif'; c.fillText(r.w + ' × ' + r.h, view.px + (r.x + r.w) * s + 6, view.py + r.y * s + 8); }
  if (hover && !drag && plan) {
    const [hx, hy] = hover; const it = currentItem();
    if (tool === 'place' && it && inB(plan, hx, hy)) {
      const ft = footOf(it), rug = isRug(it), mu = it.L !== 'g' && multi(it); const [tw, th] = mu ? wallTurn(it, hx, hy, rotated ? ft[1] : ft[0], rotated ? ft[0] : ft[1]) : [brush, brush]; const fw = rug ? (rotated ? ft[1] : ft[0]) : it.L === 'g' ? brush : tw, fh = rug ? (rotated ? ft[0] : ft[1]) : it.L === 'g' ? brush : th;
      const pw = mu || rug ? fw : 1, ph = mu || rug ? fh : 1, lz = placeZ(it, hx, hy, pw, ph), chk = rug ? null : placeCheck(it, hx, hy, pw, ph, lz), terr = isTerr(it);
      const ok = rug ? hx + fw <= plan.w && hy + fh <= plan.h && lz <= ZMAX && lz >= ZMIN : (!mu && brush > 1) || !chk.err;
      c.globalAlpha = 0.55; if (rug) { if (!drawRug(c, it, view.px + hx * s, view.py + hy * s, s, fw, fh) && !drawLook(c, it, view.px + hx * s, view.py + hy * s, s, fw, fh)) { c.fillStyle = picsFor(it)[2] || it.col; c.fillRect(view.px + hx * s, view.py + hy * s, fw * s, fh * s); } } else if (terr) { for (let dy = 0; dy < fh; dy++) for (let dx = 0; dx < fw; dx++) if (inB(plan, hx + dx, hy + dy)) drawGroundCell(c, it, view.px + (hx + dx) * s, view.py + (hy + dy) * s, s); } else if (lz <= ZMAX && lz >= ZMIN) drawGhost(c, it, hx, hy, pw, ph, lz, s); c.globalAlpha = 1;
      if ((terr || rug) && s >= 18 && lz <= ZMAX && lz >= ZMIN) lvBadge(c, lz, view.px + hx * s, view.py + hy * s, s);
      if (chk && ((chk.gone && chk.gone.length) || (chk.goneT && chk.goneT.length))) { c.globalAlpha = 0.3; c.fillStyle = theme.bad; for (const q of chk.gone) for (let y = Math.max(q.y, hy); y < Math.min(q.y + q.h, hy + ph); y++) for (let x = Math.max(q.x, hx); x < Math.min(q.x + q.w, hx + pw); x++) c.fillRect(view.px + x * s, view.py + y * s, s, s); for (const [k] of chk.goneT) c.fillRect(view.px + (k % plan.w) * s, view.py + ((k / plan.w) | 0) * s, s, s); c.globalAlpha = 1; }
      c.strokeStyle = ok ? theme.accent : theme.bad; c.lineWidth = 2; c.strokeRect(view.px + hx * s, view.py + hy * s, fw * s, fh * s);
      if (hasReach(it) && !terr && !rug && lz <= ZMAX && lz >= ZMIN) { const R = reachOf({ i: it.i, x: hx, y: hy, w: pw, h: ph, z: lz, r: placeR }); if (R) drawReachShape(c, s, R, true); }
    } else if (tool === 'move' && moving && inB(plan, hx, hy)) { if (moving.grp) { const [ox, oy] = grpMoveOrigin(moving, hx, hy); drawSnapPreview(c, s, moving.sn, snapPlanAt(moving.sn, ox, oy, true), moving.F); } else drawMovePreview(c, s, moving, fitMove(moving, hx, hy, 0, 0)); }
    else if (tool === 'paste' && clip && inB(plan, hx, hy)) drawSnapPreview(c, s, clip, snapPlanAt(clip, hx, hy, false), null);
    else if (tool === 'stamp' && inB(plan, hx, hy)) {
      const fw = 5, fh = 5;
      c.strokeStyle = theme.accent; c.lineWidth = 2; c.setLineDash([4, 3]); const ox = hx - 2, oy = hy - 2; c.strokeRect(view.px + ox * s, view.py + oy * s, fw * s, fh * s); c.setLineDash([]);
    } else if (inB(plan, hx, hy) && s >= 8) { const g = grabAt(hx, hy), [gx, gy, gw, gh] = g ? [g.x, g.y, g.w, g.h] : [hx, hy, brushFor(), brushFor()]; c.strokeStyle = theme.accent; c.lineWidth = 1.5; c.strokeRect(view.px + gx * s + 0.5, view.py + gy * s + 0.5, s * gw - 1, s * gh - 1); }
  }
  if (drag && drag.kind === 'objmove' && drag.moved && drag.fit) drawMovePreview(c, s, drag.ob, drag.fit);
  if (drag && drag.kind === 'grpmove' && drag.moved && drag.P) drawSnapPreview(c, s, drag.sn, drag.P, drag.F);
  if (sparkles.length) {
    const now = performance.now();
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const p = sparkles[i]; const a = (now - p.t0) / p.life; if (a > 1) { sparkles.splice(i, 1); continue; } if (a < 0) continue;
      const px = view.px + p.zx * s, py = view.py + p.zy * s - a * s * 0.8, r = s * p.r * Math.sin(a * Math.PI);
      c.fillStyle = a < 0.5 ? '#fff6c2' : theme.accent; c.globalAlpha = 1 - a; c.beginPath();
      for (let k = 0; k < 8; k++) { const ang = k * Math.PI / 4, rr = k % 2 ? r * 0.35 : r; c.lineTo(px + Math.cos(ang) * rr, py + Math.sin(ang) * rr); } c.closePath(); c.fill(); c.globalAlpha = 1;
    }
  }
}
const NONE_Z = -32768;
function terrView(x0, y0, x1, y1, cut) {
  const cw = Math.max(0, x1 - x0), ch = Math.max(0, y1 - y0), tv = new Int16Array(cw * ch).fill(NONE_Z), tf = new Int16Array(cw * ch).fill(NONE_Z);
  if (!hidden.has('g')) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const k = y * plan.w + x, i = (y - y0) * cw + x - x0;
    for (let j = plan.tz.length - 1; j >= 0; j--) { const z = plan.tz[j]; if (hidden.has(z) || !plan.tt[j][k]) continue; if (z > cut) { if (tf[i] === NONE_Z) tf[i] = z; continue; } tv[i] = z; break; }
  }
  const at = (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1 ? tv[(y - y0) * cw + x - x0] : inB(plan, x, y) ? (topTerrShown(y * plan.w + x, cut) ?? NONE_Z) : NONE_Z;
  const rest = (ob) => { let r = -Infinity; for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) { const t = at(x, y); r = Math.max(r, t === NONE_Z ? 1 : t + 1); } return r === -Infinity ? 1 : r; };
  return { x0, y0, x1, y1, cw, ch, tv, tf, at, rest };
}
function drawTerr(c, V, arr, s) {
  for (let y = V.y0; y < V.y1; y++) for (let x = V.x0; x < V.x1;) {
    const row = (y - V.y0) * V.cw - V.x0, gAt = (xx) => { const z = arr[row + xx]; return z === NONE_Z ? 0 : terrAt(plan, y * plan.w + xx, z); };
    const g = gAt(x); let e = x + 1; while (e < V.x1 && gAt(e) === g) e++;
    if (g) drawGroundRun(c, ITEMS[g - 1], view.px + x * s, view.py + y * s, s, e - x);
    x = e;
  }
}
function kitBadge(c, ob, s, rix) {
  const it = ITEMS[ob.i]; if (!it.cap || s < 8) return; const e = rix().homes.get('kit:' + ob.id); if (!e) return;
  const t = e.list.length + '/' + it.cap; c.font = `700 ${s < 14 ? 10 : 12}px ${BODY_FONT}`; const tw = c.measureText(t).width + 10, bx = view.px + (ob.x + ob.w) * s - tw - 3, by = view.py + ob.y * s + 3;
  c.fillStyle = it.sm && e.list.some(r => tooBig(PK_BY_NAME.get(r.p))) ? theme.bad : kitReady(ob) ? theme.accent : theme.warn; roundRect(c, bx, by, tw, 16, 8); c.fill(); c.fillStyle = '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, bx + 5, by + 8);
  if (s >= 10 && S.faces) { const d = Math.round(clamp(s * 0.95, 16, 30)); drawFaces(c, e.list.map(r => r.p), view.px + ob.x * s + 3, view.py + (ob.y + ob.h) * s - d * 0.62, d); }
}
function drawGhost(c, it, x, y, w, h, z, s, r) { const g = { i: it.i, x, y, w, h, z, r: r === undefined ? placeR != null && turnable(it) ? placeR : null : r < 0 ? null : r }, d = z - standOver(x, y, w, h); if (d === 0) drawPicItem(c, it, view.px + x * s, view.py + y * s, s, w, h, false, [x, y, w, h, z, faceOf(g)]); else if (structural(it)) drawUp(c, g, s, d); else if (it.c === 'Kits') drawKitUp(c, g, s, d); else drawRaised(c, g, s, d); }
function drawObjs(c, z, s, V, rix) {
  if (hidden.has(z)) return; const L = z ? plan.up.get(z) : plan.occ; if (!L) return; const small = [], big = [], seen = new Set();
  for (let y = V.y0; y < V.y1; y++) for (let x = V.x0; x < V.x1; x++) { const oid = L[y * plan.w + x]; if (!oid || seen.has(oid)) continue; seen.add(oid); const ob = plan.objs.get(oid); if (ob && zOf(ob) === z) (ob.w > 1 || ob.h > 1 ? big : small).push(ob); }
  const list = [...small, ...big].filter(ob => { for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) { const t = V.at(x, y); if (t === NONE_Z || t < z) return true; } return false; }).map(ob => [ob, z - V.rest(ob)]);
  for (const [ob, d] of list) if (d > 0 && (solidUp(ITEMS[ob.i]) || ITEMS[ob.i].c === 'Kits')) upShadow(c, ob, s);
  for (const [ob, d] of list) {
    const it = ITEMS[ob.i];
    if (d === 0) { const px = view.px + ob.x * s, py = view.py + ob.y * s; if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(px, py, ob.w * s + 0.5, ob.h * s + 0.5); } else drawPicItem(c, it, px, py, s, ob.w, ob.h, true, [ob.x, ob.y, ob.w, ob.h, z, faceOf(ob)]); kitBadge(c, ob, s, rix); }
    else if (structural(it)) drawUp(c, ob, s, d); else if (it.c === 'Kits') drawKitUp(c, ob, s, d, rix, false); else drawRaised(c, ob, s, d);
  }
}
function drawArea(c, a, s, strong) {
  c.save();
  if (a.kind === 'house') {
    if (a.outer) { const R = a.rect; c.fillStyle = 'rgba(255,255,255,' + (strong ? 0.16 : 0.09) + ')'; c.fillRect(view.px + R.x * s, view.py + R.y * s, R.w * s, R.h * s);
      if (s >= 6) { c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 1; c.beginPath(); for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { const d = standZ(y * plan.w + x) - a.base; if (d < -4 || d > 3) { const cx = view.px + x * s, cy = view.py + y * s; c.moveTo(cx, cy + s); c.lineTo(cx + s, cy); c.moveTo(cx, cy + s / 2); c.lineTo(cx + s / 2, cy); c.moveTo(cx + s / 2, cy + s); c.lineTo(cx + s, cy + s / 2); } } c.stroke(); } }
    c.fillStyle = 'rgba(255,255,255,' + (strong ? 0.3 : 0.18) + ')';
    for (const k of a.cells) { const x = k % plan.w, y = (k / plan.w) | 0; c.fillRect(view.px + x * s, view.py + y * s, s + 0.5, s + 0.5); }
  } else {
    const R = a.rect, px = view.px + R.x * s, py = view.py + R.y * s;
    c.fillStyle = 'rgba(255,255,255,' + (strong ? 0.22 : 0.12) + ')'; c.fillRect(px, py, R.w * s, R.h * s);
    if (s >= 6) { c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 1; c.beginPath();
      for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) if (Math.abs(standZ(y * plan.w + x) - a.base) > AREA_R) { const cx = view.px + x * s, cy = view.py + y * s; c.moveTo(cx, cy + s); c.lineTo(cx + s, cy); c.moveTo(cx, cy + s / 2); c.lineTo(cx + s / 2, cy); c.moveTo(cx + s / 2, cy + s); c.lineTo(cx + s, cy + s / 2); }
      c.stroke(); }
  }
  const R = a.rect, px = view.px + R.x * s, py = view.py + R.y * s;
  c.lineWidth = strong ? 3.5 : 2.5; c.strokeStyle = 'rgba(0,0,0,.35)'; c.setLineDash([]); c.strokeRect(px + 1, py + 1, R.w * s - 2, R.h * s - 2);
  c.lineWidth = strong ? 2 : 1.5; c.strokeStyle = '#ffffff'; c.setLineDash([Math.max(3, s * 0.3), Math.max(3, s * 0.25)]); c.strokeRect(px + 1, py + 1, R.w * s - 2, R.h * s - 2);
  c.restore();
}
function zoneLabel(z, r) {
  if (!r) return z.name || 'Zone';
  if (z.kind === 'label') return z.name || 'Label';
  if (z.kind === 'house') return (z.name || 'House') + (r.ok ? ' · habitable' : ' · not yet a house');
  if (r.ok) return r.best.hb.n + ' ✓';
  if (r.target) return r.target.n + ' · ' + r.tr.met + '/' + r.tr.total;
  if (r.near) return (z.name || 'Zone') + ' · closest: ' + r.near.hb.n;
  return z.name || 'Habitat zone';
}

let fillMode = 'solid', tool = 'pan', curItem = 'Field grass', brush = 1, rotated = false, placeR = null, eraseMode = 'both', zoneKind = 'habitat';
let selection = null, hover = null, drag = null, clip = null, stampHab = null, moving = null, decorMini = null;
const pointers = new Map(); let pinch = null;
const recent = [];
function currentItem() { return BY_NAME.get(curItem); }
function brushFor() { if (tool === 'place') { const it = currentItem(); if (it && it.L !== 'g' && (it.w > 1 || it.h > 1)) return 1; return brush; } if (tool === 'erase') return brush; return 1; }
function normRect(r) { const x = Math.min(r.x0, r.x1), y = Math.min(r.y0, r.y1); return { x, y, w: Math.abs(r.x1 - r.x0) + 1, h: Math.abs(r.y1 - r.y0) + 1 }; }
function setTool(t) {
  pourPrev = null; const back = tool === 'move' && t !== 'move' ? moving : null;
  if (tool === 'stamp' && t !== 'stamp') stampHab = null; if (t !== 'move') moving = null;
  tool = t; $$('.tbtn[data-tool]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tool === t ? 'true' : 'false'));
  if (!['select', 'pan', 'move', 'paste'].includes(t) && selection && selection.group) closeInspector();
  if (t === 'stamp' || t === 'paste' || t === 'move') toMap();
  renderOptbar(); requestDraw(); if (back) moveBack(back);
}
function pickTool(t) { setTool(t); toMap(); const tab = t === 'place' || t === 'rect' ? 'build' : t === 'zone' ? 'habitats' : null; if (tab && activeTab !== tab) showTab(tab); }
function startMove(m) { moving = m; $('#inspector').classList.remove('open'); setTool('move'); }
function moveBack(m) {
  if (m.grp) { const L = grpLive(m.grp); if (L.objs.length + L.rugs.length) grpSelect(m.grp); return; }
  if (m.rug ? !plan.rugs.has(m.id) : !plan.objs.has(m.id)) return;
  if (m.rug) showRugInspector(m); else { selection = { obj: m }; showObjInspector(m); }
}
function selectItem(name, switchTool = true) {
  pourPrev = null;
  if (decorMini && name !== decorMini.item) { decorMini = null; renderMini(); }
  curItem = name; rotated = false; placeR = null; const i = recent.indexOf(name); if (i >= 0) recent.splice(i, 1); recent.unshift(name); recent.length = Math.min(recent.length, 8);
  if (switchTool && !['place', 'rect'].includes(tool)) setTool('place'); else renderOptbar();
  $$('#tab-build .row[data-item]').forEach(r => r.setAttribute('aria-pressed', r.dataset.item === name ? 'true' : 'false'));
}

function turnPlace(d) { const it = currentItem(); if (!it) return; placeR = ((placeR == null ? 0 : placeR) + d + 4) & 3; rotated = (placeR & 1) === 1; renderOptbar(); requestDraw(); }
const placed = (r, it) => { if (r && r.ob && placeR != null && turnable(it)) r.ob.r = placeR; return r; };
function placeCell(x, y, seen) {
  const it = currentItem(); if (!it) return;
  if (isRug(it)) { reveal('r'); placeRug(it, x, y); return; }
  if (!isTerr(it) && multi(it)) {
    const ft = footOf(it), [w, hh] = wallTurn(it, x, y, rotated ? ft[1] : ft[0], rotated ? ft[0] : ft[1]), cells = [];
    for (let yy = y; yy < y + hh; yy++) for (let xx = x; xx < x + w; xx++) cells.push(yy * plan.w + xx);
    if (seen) { if (cells.some(k => seen.has(k))) return; cells.forEach(k => seen.add(k)); }
    placed(putObj(it, x, y, w, hh), it); return;
  }
  for (let dy = 0; dy < brush; dy++) for (let dx = 0; dx < brush; dx++) {
    const xx = x + dx, yy = y + dy; if (!inB(plan, xx, yy)) continue;
    if (seen) { const k = yy * plan.w + xx; if (seen.has(k)) continue; seen.add(k); }
    placed(putObj(it, xx, yy, 1, 1), it);
  }
}
function eraseCell(x, y, seen) {
  const shut = [], fixed = layerZ != null, items = eraseMode !== 'ground', terr = eraseMode !== 'objects' && lvShown('g');
  for (let dy = 0; dy < brush; dy++) for (let dx = 0; dx < brush; dx++) {
    const xx = x + dx, yy = y + dy; if (!inB(plan, xx, yy)) continue; const k = yy * plan.w + xx;
    if (seen) { if (seen.has(k)) continue; seen.add(k); }
    if (fixed) { if (!lvShown(layerZ)) continue; const q = items ? objAtLv(k, layerZ) : null, rg = items && !q ? rugsOf(plan).find(r => zOf(r) === layerZ && rugShown(r) && overlaps(r, xx, yy, 1, 1)) : null; if (q) { delObj(q); if (inWall(ITEMS[q.i])) shut.push(q); } else if (rg) delRug(rg); else if (terr) setTerr(k, layerZ, 0); continue; }
    const q = items ? topShown(k) : null, tz = terr ? topTerrShown(k) : null, rg = items ? rugAt(xx, yy) : null;
    const top = pickTop(q, tz, rg, eraseMode === 'objects');
    if (top === q && q) { delObj(q); if (inWall(ITEMS[q.i])) shut.push(q); continue; }
    if (top === rg && rg) { delRug(rg); continue; }
    if (tz != null) setTerr(k, tz, 0);
  }
  for (const ob of shut) closeWall(ob);
}
function pickTop(q, tz, rg, noTerr) { const kq = q ? topOf(q) : -Infinity, kr = rg ? zOf(rg) - 0.5 : -Infinity, kt = tz == null || noTerr ? -Infinity : tz; const m = Math.max(kq, kr, kt); if (m === -Infinity) return null; return m === kq ? q : m === kr ? rg : 'terr'; }
function lineCells(x0, y0, x1, y1, fn) { const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let err = dx + dy; for (; ;) { fn(x0, y0); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } } }
function fillRect(r) {
  const it = currentItem(); if (!it) return;
  if (isRug(it)) {
    reveal('r'); const ft = footOf(it), w = rotated ? ft[1] : ft[0], hh = rotated ? ft[0] : ft[1]; let n = 0;
    for (let y = r.y; y + hh <= r.y + r.h; y += hh) for (let x = r.x; x + w <= r.x + r.w; x += w) if (x >= 0 && y >= 0 && x + w <= plan.w && y + hh <= plan.h) { placeRug(it, x, y); n++; }
    if (!n) toast(it.n + ' is ' + w + '×' + hh + ': drag an area at least that big.'); return;
  }
  if (it.L !== 'g' && multi(it)) { const ft = footOf(it), w = rotated ? ft[1] : ft[0], hh = rotated ? ft[0] : ft[1]; if (r.w < w || r.h < hh) { const [tw, th] = wallTurn(it, r.x, r.y, w, hh); placed(putObj(it, r.x, r.y, tw, th), it); return; } for (let y = r.y; y + hh <= r.y + r.h; y += hh) for (let x = r.x; x + w <= r.x + r.w; x += w) placed(putObj(it, x, y, w, hh), it); return; }
  const b = brush; brush = 1; for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) { if (fillMode === 'outline' && x > r.x && x < r.x + r.w - 1 && y > r.y && y < r.y + r.h - 1) continue; if (inB(plan, x, y)) placeCell(x, y); } brush = b;
}

function onDown(e) {
  if (!plan) return; mapView.stop(); cv.setPointerCapture(e.pointerId); downMod = e.shiftKey || e.ctrlKey || e.metaKey;
  pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
  if (pointers.size === 2) {
    if (drag) { if (drag.kind === 'stroke') commitTx(drag.label); drag = null; requestDraw(); }
    const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, cam: mapView.cam(), a: Math.atan2(b.y - a.y, b.x - a.x) }; return;
  }
  if (pointers.size > 2) return;
  const [cx, cy] = mapView.pick(e.offsetX, e.offsetY); hover = [cx, cy]; mapView.anchor(cx, cy); updateStatus();
  if (e.button === 2 && mapView.orbit) { drag = { kind: 'orbit', sx: e.offsetX, sy: e.offsetY, cam: mapView.cam() }; cv.style.cursor = 'grabbing'; return; }
  const own = e.button === 0 && !spaceDown && !downMod && !multiPick ? grabAt(cx, cy) : null;
  if ((tool === 'pan' && !own) || e.button === 1 || spaceDown) { drag = { kind: 'pan', sx: e.offsetX, sy: e.offsetY, cam: mapView.cam(), cx, cy, tap: tool === 'pan' && e.button === 0 && !spaceDown, moved: false }; cv.style.cursor = 'grabbing'; return; }
  if (e.button === 2) return;
  const gob = tool === 'pan' ? own : grabAt(cx, cy);
  if (gob && gob.grp) { drag = { kind: 'grpmove', G: selection.group, F: grpFrame(selection.group), sn: null, P: null, cx, cy, sx: e.offsetX, sy: e.offsetY, moved: false }; return; }
  if (gob) { drag = { kind: 'objmove', ob: gob, gx: cx - gob.x, gy: cy - gob.y, cx, cy, sx: e.offsetX, sy: e.offsetY, moved: false, fit: null }; return; }
  if (e.pointerType === 'touch' && !drag) { drag = { kind: 'pending', cx, cy, sx: e.offsetX, sy: e.offsetY }; return; }
  startAction(cx, cy, e.offsetX, e.offsetY);
}
function startAction(cx, cy, sx, sy) {
  placeMiss = []; placeHit = 0;
  if (tool === 'place') {
    const it = currentItem(); if (!it) { toast('Pick an item in Build first'); return; }
    if (it.L !== 'g' && (it.w > 1 || it.h > 1)) { drag = { kind: 'kit', x: cx, y: cy }; return; }
    if (pourMode === 'pour' && canPour(it)) { drag = null; pourTap(cx, cy); return; }
    drag = { kind: 'stroke', label: 'Place ' + it.n, last: [cx, cy], seen: new Set() }; placeCell(cx, cy, drag.seen); requestDraw(); return;
  }
  if (tool === 'erase') {
    const key = eraseMode === 'ground' ? 'g' : layerZ; if (key != null && hidden.has(key)) { reveal(key); return; }
    drag = { kind: 'stroke', label: 'Erase', last: [cx, cy], seen: new Set() }; eraseCell(cx, cy, drag.seen); requestDraw(); return;
  }
  if (tool === 'rect' || tool === 'zone' || tool === 'select') { drag = { kind: 'rect', rect: { x0: cx, y0: cy, x1: cx, y1: cy }, moved: false, sx, sy }; requestDraw(); return; }
  if (tool === 'pick' || tool === 'stamp' || tool === 'paste' || tool === 'move') { drag = { kind: 'tap', x: cx, y: cy, sx, sy }; return; }
  drag = null;
}
function onMove(e) {
  if (!plan) return;
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
  if (pinch && pointers.size >= 2) {
    const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    mapView.setCam(pinch.cam); mapView.panBy(mx - pinch.cx, my - pinch.cy); mapView.zoomAt(clamp(pinch.cam.zoom * d / pinch.d, zMin(), 5), mx, my);
    if (mapView.twist) mapView.twist(((Math.atan2(b.y - a.y, b.x - a.x) - pinch.a) * 180 / Math.PI + 540) % 360 - 180, mx, my); return;
  }
  const [cx, cy] = drag && drag.kind !== 'pan' && drag.kind !== 'orbit' ? mapView.dragPick(e.offsetX, e.offsetY) : mapView.pick(e.offsetX, e.offsetY);
  if (!hover || hover[0] !== cx || hover[1] !== cy) { hover = [cx, cy]; updateStatus(); requestDraw(); if (!drag) cv.style.cursor = grabAt(cx, cy) ? 'grab' : ''; }
  if (!drag) return;
  if (drag.kind === 'grpmove') {
    if (!drag.moved) { if (Math.hypot(e.offsetX - drag.sx, e.offsetY - drag.sy) < 6) return; drag.moved = true; cv.style.cursor = 'grabbing'; drag.sn = grpSnap(drag.G, drag.F); }
    if (!drag.P || drag.fx !== cx || drag.fy !== cy) { drag.fx = cx; drag.fy = cy; drag.P = snapPlan(drag.sn, drag.F.x + cx - drag.cx, drag.F.y + cy - drag.cy, true); requestDraw(); }
    return;
  }
  if (drag.kind === 'objmove') {
    if (!drag.moved) { if (Math.hypot(e.offsetX - drag.sx, e.offsetY - drag.sy) < 6) return; drag.moved = true; cv.style.cursor = 'grabbing'; }
    if (!drag.fit || drag.fx !== cx || drag.fy !== cy) { drag.fx = cx; drag.fy = cy; drag.fit = fitMove(drag.ob, cx, cy, drag.gx, drag.gy); requestDraw(); }
    return;
  }
  if (drag.kind === 'pending') { if (Math.hypot(e.offsetX - drag.sx, e.offsetY - drag.sy) < 5) return; const d = drag; drag = null; startAction(d.cx, d.cy, d.sx, d.sy); if (!drag) return; }
  if (drag.kind === 'orbit') { if (mapView.orbit) mapView.orbit(drag.cam, e.offsetX - drag.sx, e.offsetY - drag.sy); return; }
  if (drag.kind === 'pan') { if (!drag.moved && Math.hypot(e.offsetX - drag.sx, e.offsetY - drag.sy) >= 6) drag.moved = true; mapView.setCam(drag.cam); mapView.panBy(e.offsetX - drag.sx, e.offsetY - drag.sy); return; }
  if (drag.kind === 'stroke') {
    const [lx, ly] = drag.last; if (lx === cx && ly === cy) return;
    lineCells(lx, ly, cx, cy, (x, y) => { if (tool === 'place') placeCell(x, y, drag.seen); else eraseCell(x, y, drag.seen); });
    drag.last = [cx, cy]; requestDraw(); return;
  }
  if (drag.kind === 'rect') { drag.rect.x1 = cx; drag.rect.y1 = cy; if (Math.hypot(e.offsetX - drag.sx, e.offsetY - drag.sy) > 6) drag.moved = true; requestDraw(); }
  if (drag.kind === 'kit') { drag.x = cx; drag.y = cy; }
}
function onUp(e) {
  pointers.delete(e.pointerId);
  if (pinch) { if (pointers.size < 2) { pinch = null; if (mapView.settle) mapView.settle(); } drag = null; return; }
  if (!drag) return;
  if (drag.kind === 'pending') { const p = drag; drag = null; startAction(p.cx, p.cy, p.sx, p.sy); if (!drag) return; }
  const d = drag; drag = null; cv.style.cursor = '';
  if (d.kind === 'orbit') { if (mapView.settle) { mapView.settle(); LS.set(LSK + '3dtilt', String(view3d.mode())); tiltUi(); } return; }
  if (d.kind === 'pan') { if (d.tap && !d.moved && e.type !== 'pointercancel') { mapView.setCam(d.cam); pickTap(d.cx, d.cy); requestDraw(); } return; }
  if (d.kind === 'grpmove') {
    if (e.type === 'pointercancel') { requestDraw(); return; }
    if (d.moved) { if (d.P && (d.P.ox !== d.F.x || d.P.oy !== d.F.y)) { const g = grpPut(d.sn, d.P, true, 'Move'); if (g) grpSelect(g); } requestDraw(); return; }
    pickTap(d.cx, d.cy); requestDraw(); return;
  }
  if (d.kind === 'objmove') {
    if (e.type === 'pointercancel') { requestDraw(); return; }
    if (d.moved) { if (d.fit) doMove(d.ob, d.fit); requestDraw(); return; }
    if (tool === 'select' || tool === 'pan' || downMod || multiPick) { pickTap(d.cx, d.cy); requestDraw(); return; }
    startAction(d.cx, d.cy, d.sx, d.sy); const d2 = drag; drag = null; if (d2) finishDrag(d2); return;
  }
  finishDrag(d);
}
function finishDrag(d) {
  if (d.kind === 'stroke') { const t = commitTx(d.label); if (tool === 'place') { placedFromDecor(t); placeReport(); } return; }
  if (d.kind === 'kit') { placeCell(d.x, d.y); placedFromDecor(commitTx('Place ' + curItem)); placeReport(); return; }
  if (d.kind === 'rect') {
    const r = normRect(d.rect);
    if (tool === 'rect') { fillRect(r); placedFromDecor(commitTx('Fill ' + curItem)); placeReport(); }
    else if (tool === 'zone') { if (!d.moved && r.w === 1 && r.h === 1) { const z = zoneAt(r.x, r.y); if (z) { selectZone(z); } else toast('Drag to draw a zone'); } else createZone(r); }
    else if (tool === 'select') { if (!d.moved) pickTap(r.x, r.y); else grpSelect(boxGroup(r, downMod || multiPick ? grpOf() : null)); }
    requestDraw(); return;
  }
  if (d.kind === 'tap') {
    if (tool === 'pick') pickAt(d.x, d.y);
    else if (tool === 'stamp' && stampHab) { stampHabitat(stampHab, d.x, d.y); }
    else if (tool === 'paste' && clip) { pasteAt(d.x, d.y); }
    else if (tool === 'move' && moving) { if (moving.grp) grpMoveTo(d.x, d.y); else moveObjTo(moving, d.x, d.y); }
  }
}
let spaceDown = false;
cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerup', onUp); cv.addEventListener('pointercancel', onUp);
cv.addEventListener('pointerleave', () => { hover = null; updateStatus(); requestDraw(); });
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('dblclick', e => { if (!plan) return; const [x, y] = mapView.pick(e.offsetX, e.offsetY); if (!inB(plan, x, y)) return; const ob = shownStack(y * plan.w + x).find(q => q && ITEMS[q.i].cap); if (ob && ['select', 'pan'].includes(tool)) interiorEditor(ob); });
cv.addEventListener('wheel', e => {
  e.preventDefault(); mapView.stop();
  if (e.ctrlKey || e.metaKey || (S.wheel === 'zoom' && Math.abs(e.deltaY) > 0 && !e.shiftKey && Math.abs(e.deltaX) < 1)) { const z = clamp(mapView.zoom() * Math.exp(-e.deltaY * (e.ctrlKey && e.deltaMode === 0 && Math.abs(e.deltaY) < 50 ? 0.01 : 0.0015)), zMin(), 5); mapView.zoomAt(z, e.offsetX, e.offsetY); }
  else mapView.panBy(-e.deltaX, -e.deltaY);
}, { passive: false });
$('#zin').onclick = () => mapView.zoomAt(clamp(mapView.zoomGoal() * 1.3, zMin(), 5), W / 2, H / 2, true);
$('#zout').onclick = () => mapView.zoomAt(clamp(mapView.zoomGoal() / 1.3, zMin(), 5), W / 2, H / 2, true);
$('#zfit').onclick = () => mapView.fit(true);
$('#zturn').onclick = (e) => turn3d(e.shiftKey ? -1 : 1);
$('#ztilt').onclick = () => viewOpen();
function setShowAreas(v) { showAreas = v; LS.set('pokopia-planner:areas', v ? '1' : '0'); sysSync(); requestDraw(); }
const SYS = [
  ['areas', 'Active areas', 'The dotted line around each home: everything inside it counts for that home.', 'A', () => showAreas, v => setShowAreas(v)],
  ['reach', 'Reach', 'How far sprinklers, Smooth Rocks, switches, sensors and power reach, and where berries fall. A selected one always shows it.', '', () => showReach, v => setShowReach(v)],
  ['water', 'Fields', 'Which fields are wet (blue), dry (orange), dried out by a Smooth Rock (brown) or can\'t be watered (red), and which sprinklers run (green dot) or have no water (red dot).', '', () => showWater, v => setShowWater(v)],
  ['signals', 'Switches and sensors', 'What each switch and sensor reaches, with a line to each door, light or machine it works. Red: it has no power. An orange dot: it reaches nothing, or a sensor can\'t see anything move.', '', () => showSignals, v => setShowSignals(v)],
  ['drops', 'Litter drops', 'Where Litter Pokémon living in houses and kits drop their materials: pink tiles take drops, red-edged ones are blocked. A selected home always shows its own.', '', () => showDrops, v => setShowDrops(v)],
  ['power', 'Power', 'Which items have power, and how transmitters link to generators, to each other and to their items. A selected one always shows its network.', '', () => showPower, v => setShowPower(v)]
];
const SYS_NONE = {
  areas: () => allHomes().length || plan.zones.length ? '' : 'No homes or zones yet, so there are no active areas to show',
  reach: () => reachList().length ? '' : 'Nothing in this plan has a reach yet',
  water: () => FIELDS && FIELDS.cells.size ? '' : 'No fields or crops in this plan yet',
  signals: () => SIG && SIG.any ? '' : 'No switches or sensors in this plan yet',
  drops: () => dropHomes().length ? '' : 'No Litter Pokémon live in a home yet',
  power: () => POWER && POWER.any ? '' : 'No generators or powered items in this plan yet'
};
function sysSync() { const b = $('#zsys'), m = $('#sysmenu'); if (b) b.setAttribute('aria-pressed', SYS.some(x => x[4]()) ? 'true' : 'false'); if (m) for (const e of m.querySelectorAll('.mi')) { const x = SYS.find(q => q[0] === e.dataset.k); if (x) e.setAttribute('aria-checked', x[4]() ? 'true' : 'false'); } }
function sysRender() {
  const m = $('#sysmenu'); m.textContent = '';
  m.append(h('div', { class: 'shd' }, 'Show on the map'));
  for (const [k, name, ds, key, get, set] of SYS) m.append(h('button', { class: 'mi', type: 'button', role: 'menuitemcheckbox', 'aria-checked': get() ? 'true' : 'false', 'data-k': k, 'data-tip': ds, onclick: () => { set(!get()); const why = get() && SYS_NONE[k](); if (why) toast(why, 3200, null, 'sysnone'); } }, h('span', { class: 'ck' }), h('span', null, h('span', { class: 'mt' }, name, key ? h('kbd', null, key) : ''), h('span', { class: 'md' }, ds))));
}
function sysOpen(open) { const m = $('#sysmenu'), b = $('#zsys'); if (open == null) open = m.hidden; if (open === !m.hidden) return; if (open) viewOpen(false); m.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) { sysRender(); m.classList.remove('compact'); const room = b.getBoundingClientRect().bottom - $('#mapwrap').getBoundingClientRect().top - 12; if (m.offsetHeight > room) m.classList.add('compact'); const f = m.querySelector('.mi'); if (f) f.focus({ preventScroll: true }); } }
function toggleAreas() { setShowAreas(!showAreas); toast(showAreas ? 'Active areas shown' : 'Active areas hidden'); }
$('#zlayers').onclick = () => openLayers();
$('#hdrPlan').onclick = () => openTab('plans');
$('#hdrArea').onclick = () => openTab('plans');
$('#saveChip').onclick = () => { openTab('plans'); setTimeout(() => { const c = $('#syncCard'); if (c) c.scrollIntoView({ block: 'nearest', behavior: calm() ? 'auto' : 'smooth' }); }, 80); };
$('#zsys').onclick = () => sysOpen();
addEventListener('pointerdown', e => { const m = $('#sysmenu'), v = $('#viewmenu'); if (m && !m.hidden && !m.parentNode.contains(e.target)) sysOpen(false); if (v && !v.hidden && !v.parentNode.contains(e.target)) viewOpen(false); }, true);
$$('.tbtn[data-tool]').forEach(b => b.onclick = () => pickTool(b.dataset.tool));
$('#undoBtn').onclick = undo; $('#redoBtn').onclick = redo;
addEventListener('keydown', e => {
  if (setsOpen()) { if (e.key === 'Escape' && !$('#modal').classList.contains('open')) { e.preventDefault(); closeSettings(); } return; }
  if (RV.on) { rvKey(e); return; }
  if (IED.ob) { iedKey(e); return; }
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === 'Escape' && !$('#sysmenu').hidden) { sysOpen(false); $('#zsys').focus(); return; }
  if (e.key === 'Escape' && !$('#viewmenu').hidden) { viewOpen(false); $('#ztilt').focus(); return; }
  if (e.key === 'Escape' && pourPrev) { pourCancel(); return; }
  if (e.key === 'Enter' && pourPrev && tool === 'place') { pourCommit(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
  if (e.key === ' ') { spaceDown = true; cv.style.cursor = 'grab'; e.preventDefault(); return; }
  const G0 = plan ? grpOf() : null, ctl = e.ctrlKey || e.metaKey, kl = e.key.toLowerCase(), noText = !String(getSelection ? getSelection() : '');
  if (in3d() && !ctl && !e.altKey) { if (e.key === ',' || e.key === '<') { turn3d(-1); return; } if (e.key === '.' || e.key === '>') { turn3d(1); return; } if (kl === 't') { tilt3d(e.shiftKey ? -1 : 1); return; } }
  if (ctl && kl === 'a' && plan) { e.preventDefault(); grpSelect(boxGroup({ x: 0, y: 0, w: plan.w, h: plan.h })); return; }
  if (ctl && kl === 'c' && G0 && noText) { e.preventDefault(); grpCopy(G0); return; }
  if (ctl && kl === 'v' && clip) { e.preventDefault(); selection = null; closeInspector(); setTool('paste'); return; }
  if (ctl && kl === 'd' && G0) { e.preventDefault(); grpDup(G0); return; }
  if (e.key.startsWith('Arrow') && G0 && !ctl && !e.altKey) { e.preventDefault(); const st = e.shiftKey ? 5 : 1; grpRun(G0, { dx: e.key === 'ArrowLeft' ? -st : e.key === 'ArrowRight' ? st : 0, dy: e.key === 'ArrowUp' ? -st : e.key === 'ArrowDown' ? st : 0 }); return; }
  const map = { h: 'pan', b: 'place', r: 'rect', e: 'erase', v: 'select', z: 'zone', i: 'pick' };
  if (map[e.key.toLowerCase()] && !e.ctrlKey && !e.metaKey) pickTool(map[e.key.toLowerCase()]);
  if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) toggleAreas();
  if (kl === 's' && !ctl && !e.altKey) sysOpen();
  if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.metaKey) openLayers();
  if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); setLayerZ((layerZ == null ? 0 : layerZ) + (e.key === 'PageUp' ? 1 : -1)); toast('Working on level ' + lvNum(layerZ), 2400, null, 'level'); }
  if (e.key === '[') { brush = Math.max(1, brush - 1); renderOptbar(); }
  if (e.key === ']') { brush = Math.min(5, brush + 1); renderOptbar(); }
  if (e.key === 'Escape') { if (drag && (drag.kind === 'objmove' || drag.kind === 'grpmove')) { drag = null; cv.style.cursor = ''; requestDraw(); return; } closeInspector(); if (multiPick) { multiPick = false; renderOptbar(); } if (['stamp', 'paste', 'move'].includes(tool)) setTool(S.tool); requestDraw(); }
  if ((e.key === 'Delete' || e.key === 'Backspace') && selection) { deleteSelection(); }
  if (kl === 'q' && !ctl) { const o1 = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null; if (tool === 'place' || tool === 'rect') turnPlace(e.shiftKey ? -1 : 1); else if (o1 && !selection.group) { if (turnable(ITEMS[o1.i])) turnObj(o1, e.shiftKey ? -1 : 1); } else if (tool === 'paste' && clip) clipTurn(e.shiftKey ? 'ccw' : 'cw'); else if (G0) grpRun(G0, e.shiftKey ? 'ccw' : 'cw'); }
  if (kl === 'f' && !ctl) { if (tool === 'paste' && clip) clipTurn(e.shiftKey ? 'fy' : 'fx'); else if (G0 && selection.group) grpRun(G0, e.shiftKey ? 'fy' : 'fx'); }
});
addEventListener('keyup', e => { if (e.key === ' ') { spaceDown = false; cv.style.cursor = ''; } });

let probChip = null;
function updateStatus() {
  const st = $('#status'); st.textContent = ''; st.hidden = !S.status && !PROBS.length;
  if (PROBS.length) { const t = PROBS.length === 1 ? '1 problem' : PROBS.length + ' problems'; if (!probChip) probChip = h('button', { class: 'chip warn act', type: 'button', onclick: showProblems }); probChip.textContent = '⚠ ' + t; probChip.setAttribute('aria-label', t + ': see what\'s wrong'); probChip.setAttribute('data-tip', t); st.append(probChip); }
  if (!S.status) return;
  if (hover && plan && inB(plan, hover[0], hover[1])) {
    const k = hover[1] * plan.w + hover[0], pile = shownStack(k), tz = topTerrShown(k), tv = tz == null ? 0 : terrAt(plan, k, tz), rg0 = rugAt(hover[0], hover[1]), top = pickTop(pile[pile.length - 1], tz, rg0), ob = top && top !== 'terr' && !top.rug ? top : null;
    st.append(h('span', { class: 'chip' }, hover[0] + ', ' + hover[1] + (tz != null && tz !== 0 ? ' · ground ' + lvTxt(tz) : '')));
    const rg = top && top.rug ? top : null;
    if (ob) { const z = zOf(ob), un = objAtLv(k, z - 1), ut = terrAt(plan, k, z - 1); st.append(h('span', { class: 'chip' }, ITEMS[ob.i].n + ' · level ' + lvNum(z) + (htOf(ob) > 1 ? ' to ' + lvNum(topOf(ob)) : '') + (un ? ', on ' + ITEMS[un.i].n : ut ? '' : ', floating'))); }
    else if (rg) { const z = zOf(rg), un = objAtLv(k, z - 1); st.append(h('span', { class: 'chip' }, ITEMS[rg.i].n + ' · level ' + lvNum(z) + (un ? ', on ' + ITEMS[un.i].n : ''))); } else if (tv) st.append(h('span', { class: 'chip' }, ITEMS[tv - 1].n + ' · level ' + lvNum(tz)));
    const homes = []; for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.area && inArea(r.area, hover[0], hover[1])) homes.push(z.kind === 'habitat' && r.ok ? r.best.hb.n : (z.name || 'Zone')); } for (const hs of autoHouses) if (hs.cells.has(hover[1] * plan.w + hover[0])) homes.push(hs.ok ? 'House' : 'unfinished house');
    if (homes.length) st.append(h('span', { class: 'chip', style: 'color:var(--accent)' }, 'In range of ' + homes.slice(0, 3).join(', ') + (homes.length > 3 ? ' +' + (homes.length - 3) : '')));
  }
  st.append(h('span', { class: 'chip hide-sm' }, Math.round(mapView.zoom() * 100) + '%'));
}

let swatchCache = new Map();
function swatchURL(it) {
  if (swatchCache.has(it.i)) return swatchCache.get(it.i);
  const c = document.createElement('canvas'); const S = 56; c.width = S; c.height = S; const x = c.getContext('2d');
  x.fillStyle = it.L === 'g' ? it.col : (it.c === 'Nature' ? '#d6dfcf' : '#e8ebe5'); x.fillRect(0, 0, S, S);
  if (it.L === 'g') drawGroundCell(x, it, 0, 0, S);
  else if (it.sh === 'kit') { drawItem(x, it, 2, 2, S / 2 - 2, 2, 2, false, it.look ? (bx, by, bw, bh) => drawLook(x, it, bx, by, bh, bw / bh, 1) : null); }
  else if (!drawLook(x, it, 0, 0, S)) drawItem(x, it, 0, 0, S);
  const url = c.toDataURL(); swatchCache.set(it.i, url); return url;
}
const PIC_WEB = 'https://www.serebii.net/pokemonpokopia/items/';
const picSlug = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
let PICS = { pics: {}, missing: {}, top: {}, pk: {}, pkmissing: {} };
const picRemote = (it) => it && it.im ? (it.im === 1 ? picSlug(it.n) : String(it.im)) : null;
const picKey = (it) => { const r = picRemote(it); return r && r.replace(/[^a-z0-9-]/g, ''); };
const localPic = (k) => PICS.pics[k] ? 'pics/' + k + '.webp?v=' + PICS.pics[k] : null;
const picURL = (it) => { const k = picKey(it); if (!k) return null; return localPic(k) || (/^HTTP 404/.test(PICS.missing[k] || '') ? null : PIC_WEB + encodeURIComponent(picRemote(it)) + '.png'); };
const MAP_PIC_MIN = 9, TILE_PIC_MIN = 16;
const mapPics = new Map();
const picQueue = []; let picBusy = 0, picRedraw = false, sizedCount = 0;
const picOf = [];
function picsFor(it) {
  let p = picOf[it.i];
  if (!p) { const k = picKey(it), t = k && PICS.top && PICS.top[k]; p = picOf[it.i] = [k ? localPic(k) : null, t && t[0] ? 'pics/top/' + k + '.webp?v=' + t[0] : null, t ? t[1] : null]; }
  return p;
}
function mapPic(url) {
  let p = mapPics.get(url);
  if (!p) { p = { img: null, box: null, sized: new Map(), failed: false, memo: 0, memoR: null }; mapPics.set(url, p); picQueue.push(url); pumpPics(); }
  return p.img ? p : null;
}
function pumpPics() {
  while (picBusy < 6 && picQueue.length) {
    const url = picQueue.shift(), p = mapPics.get(url), im = new Image(); picBusy++;
    const done = (ok) => { picBusy--; if (ok && im.naturalWidth) { if (/\/top\//.test(url)) p.box = [0, 0, im.naturalWidth, im.naturalHeight]; else [p.box, p.col, p.leaf, p.bloom] = picFacts(url, im); p.img = im; picsArrived(); } else p.failed = true; pumpPics(); };
    im.src = url;
    (im.decode ? im.decode() : new Promise((ok, no) => { im.onload = ok; im.onerror = no; })).then(() => done(true), () => done(false));
  }
}
function picsArrived() { if (picRedraw) return; picRedraw = true; requestAnimationFrame(() => { picRedraw = false; requestDraw(); if (IED.ob) iedDraw(); }); }
let PIC_FACTS = null, picFactsT = 0;
function picFacts(url, im) {
  if (!PIC_FACTS) { try { PIC_FACTS = JSON.parse(LS.get(LSK + 'picfacts') || '{}') || {}; } catch (e) { PIC_FACTS = {}; } }
  const k = url.replace(/^pics\//, ''), hit = PIC_FACTS[k]; if (Array.isArray(hit) && Array.isArray(hit[0]) && hit[0].length === 4) return hit;
  const v = readPic(im); if (v[1] == null && v.length < 3) return v; PIC_FACTS[k] = v;
  clearTimeout(picFactsT); picFactsT = setTimeout(() => { const keys = Object.keys(PIC_FACTS); if (keys.length > 1600) PIC_FACTS = Object.fromEntries(keys.slice(-1200).map(q => [q, PIC_FACTS[q]])); LS.set(LSK + 'picfacts', JSON.stringify(PIC_FACTS)); }, 4000);
  return v;
}
function readPic(im) {
  const w = im.naturalWidth, h = im.naturalHeight;
  try {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
    const a = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let i = y * w * 4 + 3, xx = 0; xx < w; xx++, i += 4) if (a[i] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; y1 = y; }
    if (x1 < x0) return [[0, 0, w, h], null];
    const cube = w === 200 && Math.abs(x0 - 24) <= 4 && Math.abs(y0 - 24) <= 4 && Math.abs(x1 - 177) <= 4 && Math.abs(y1 - 182) <= 4;
    const [rx0, ry0, rx1, ry1] = cube ? [66, 40, 142, 58] : [x0, y0, x1, y1], all = [0, 0, 0, 0], leaf = [0, 0, 0, 0], bloom = [0, 0, 0, 0];
    for (let y = ry0; y <= ry1; y++) for (let xx = rx0, i = (y * w + xx) * 4; xx <= rx1; xx++, i += 4) {
      if (a[i + 3] <= 200) continue; const R = a[i], G = a[i + 1], B = a[i + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B); if (mx < 60) continue;
      const add = (t) => { t[0] += R; t[1] += G; t[2] += B; t[3]++; }; add(all);
      if (mx - mn > 40) add(G >= R && G >= B ? leaf : bloom);
    }
    const hex = (t) => t[3] ? '#' + t.slice(0, 3).map(v => Math.round(v / t[3]).toString(16).padStart(2, '0')).join('') : null;
    return [[x0, y0, x1 - x0 + 1, y1 - y0 + 1], hex(all), hex(leaf), bloom[3] > all[3] * 0.06 ? hex(bloom) : null];
  } catch (e) { }
  return [[0, 0, w, h], null];
}
function sizedPic(p, px) {
  if (p.memo === px) return p.memoR;
  const [bx, by, bw, bh] = p.box, big = Math.max(bw, bh); let r;
  if (px >= big * 0.75) r = [p.img, bx, by, bw, bh];
  else {
    const step = Math.max(8, Math.round(Math.SQRT2 ** Math.ceil(Math.log2(px) * 2)));
    let cv = p.sized.get(step);
    if (!cv) {
      if (++sizedCount > 1500) { for (const q of mapPics.values()) { q.sized.clear(); q.memo = 0; } sizedCount = 1; }
      const tw = Math.max(1, Math.round(bw * step / big)), th = Math.max(1, Math.round(bh * step / big));
      let src = p.img, sx = bx, sy = by, w = bw, h = bh;
      do {
        const nw = Math.max(tw, Math.ceil(w / 2)), nh = Math.max(th, Math.ceil(h / 2)), t = document.createElement('canvas'); t.width = nw; t.height = nh;
        const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(src, sx, sy, w, h, 0, 0, nw, nh);
        src = t; sx = sy = 0; w = nw; h = nh;
      } while (w > tw || h > th);
      cv = src; p.sized.set(step, cv);
    }
    r = [cv, 0, 0, cv.width, cv.height];
  }
  p.memo = px; p.memoR = r; return r;
}
function drawPicIn(c, p, x, y, w, h, fill) {
  let dw = w, dh = h; if (!fill) { const k = Math.min(w / p.box[2], h / p.box[3]); dw = p.box[2] * k; dh = p.box[3] * k; }
  const [src, sx, sy, sw, sh] = sizedPic(p, Math.ceil(Math.max(dw, dh) * dpr));
  c.drawImage(src, sx, sy, sw, sh, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
const picInfo = (it) => { const u = picsFor(it)[0]; return (u && mapPics.get(u)) || null; };
const itemColour = (it) => { if (it.look) return it.look.a; const p = picInfo(it); return (p && p.col) || it.col; };
const fenceLike = (it) => /fenc|railing|enclosure|barrier|handrail|\bposts\b/i.test(it.n);
function structAround(at) {
  if (!at) return { n: null, s: null, w: null, e: null };
  const [gx, gy, w, h, z = 0] = at, one = (x, y) => { if (!inB(plan, x, y)) return null; const o = occAt(plan, y * plan.w + x, z), ob = o && plan.objs.get(o); return ob && structural(ITEMS[ob.i]) ? ITEMS[ob.i] : null; };
  const row = (y) => { for (let x = gx; x < gx + w; x++) { const q = one(x, y); if (q) return q; } return null; }, col = (x) => { for (let y = gy; y < gy + h; y++) { const q = one(x, y); if (q) return q; } return null; };
  return { n: row(gy - 1), s: row(gy + h), w: col(gx - 1), e: col(gx + w) };
}
function wallAlongAt(at, horiz) {
  if (!at) return null; const [gx, gy, w, h, z = 0] = at;
  for (let d = 1; d <= 6; d++) for (const [x, y] of horiz ? [[gx - d, gy], [gx + w - 1 + d, gy]] : [[gx, gy - d], [gx, gy + h - 1 + d]]) {
    if (!inB(plan, x, y)) continue; const o = occAt(plan, y * plan.w + x, z), ob = o && plan.objs.get(o); if (!ob) continue; const q = ITEMS[ob.i]; if (!structural(q)) return null; if (!inWall(q)) return q;
  }
  return null;
}
function wallTop(c, col, x, y, w, h, s, open, round, dots) {
  const dk = shade(col, -0.45), t = Math.max(1.5, s * 0.06), r = round ? Math.min(w, h) * 0.3 : 0;
  c.fillStyle = col;
  if (r) { c.beginPath(); const R = (o1, o2) => o1 && o2 ? r : 0, a = R(open.n, open.w), b = R(open.n, open.e), cc = R(open.s, open.e), d = R(open.s, open.w);
    c.moveTo(x + a, y); c.lineTo(x + w - b, y); c.arcTo(x + w, y, x + w, y + b, b); c.lineTo(x + w, y + h - cc); c.arcTo(x + w, y + h, x + w - cc, y + h, cc); c.lineTo(x + d, y + h); c.arcTo(x, y + h, x, y + h - d, d); c.lineTo(x, y + a); c.arcTo(x, y, x + a, y, a); c.closePath(); c.fill();
    c.strokeStyle = dk; c.lineWidth = t; c.stroke();
    c.fillStyle = dots || shade(col, 0.22); for (const [fx, fy] of [[0.3, 0.32], [0.68, 0.28], [0.5, 0.62], [0.24, 0.72], [0.76, 0.7]]) { c.beginPath(); c.arc(x + w * fx, y + h * fy, Math.max(1, s * (dots ? 0.1 : 0.09)), 0, 7); c.fill(); }
    return;
  }
  c.fillRect(x, y, w + 0.5, h + 0.5);
  c.fillStyle = 'rgba(255,255,255,.22)'; if (open.n) c.fillRect(x, y, w, t * 1.2);
  c.fillStyle = 'rgba(0,0,0,.28)'; if (open.s) c.fillRect(x, y + h - s * 0.2, w, s * 0.2);
  c.fillStyle = dk; if (open.n) c.fillRect(x, y, w, t); if (open.s) c.fillRect(x, y + h - t, w, t); if (open.w) c.fillRect(x, y, t, h); if (open.e) c.fillRect(x + w - t, y, t, h);
}
function drawStructure(c, it, x, y, s, wc, hc, at) {
  const W = wc * s, H = hc * s, col = itemColour(it), dk = shade(col, -0.45), nb = structAround(at), open = { n: !nb.n, s: !nb.s, w: !nb.w, e: !nb.e };
  if (inWall(it)) {
    const horiz = wc !== hc ? wc > hc : !!(nb.w || nb.e) || !(nb.n || nb.s), wall = wallAlongAt(at, horiz), wcol = wall ? itemColour(wall) : shade(col, 0.15), lw = Math.max(1.5, s * 0.06);
    if (isWindow(it)) {
      wallTop(c, wcol, x, y, W, H, s, open); c.fillStyle = '#cdeefa'; c.strokeStyle = shade(wcol, -0.5); c.lineWidth = lw;
      if (horiz) { c.fillRect(x, y + H * 0.34, W, H * 0.32); c.strokeRect(x + lw / 2, y + H * 0.34, W - lw, H * 0.32); } else { c.fillRect(x + W * 0.34, y, W * 0.32, H); c.strokeRect(x + W * 0.34, y + lw / 2, W * 0.32, H - lw); }
      return;
    }
    const j = s * 0.16, fence = wall && fenceLike(wall);
    c.fillStyle = wcol; c.strokeStyle = shade(wcol, -0.45); c.lineWidth = lw;
    const jamb = (jx, jy, jw, jh) => { c.fillRect(jx, jy, jw, jh); c.strokeRect(jx + lw / 2, jy + lw / 2, jw - lw, jh - lw); };
    if (fence) { const ps = s * 0.3; if (horiz) { jamb(x, y + (H - ps) / 2, ps, ps); jamb(x + W - ps, y + (H - ps) / 2, ps, ps); } else { jamb(x + (W - ps) / 2, y, ps, ps); jamb(x + (W - ps) / 2, y + H - ps, ps, ps); } }
    else if (horiz) { jamb(x, y, j, H); jamb(x + W - j, y, j, H); } else { jamb(x, y, W, j); jamb(x, y + H - j, W, j); }
    const e = fence ? s * 0.3 : j, th = 0.52; c.fillStyle = col; c.strokeStyle = shade(col, -0.6); c.lineWidth = Math.max(2, s * 0.08);
    let dx, dy, dw, dh; if (horiz) { dx = x + e; dw = W - 2 * e; dh = H * th; dy = y + (H - dh) / 2; } else { dy = y + e; dh = H - 2 * e; dw = W * th; dx = x + (W - dw) / 2; }
    c.fillRect(dx, dy, dw, dh); c.strokeRect(dx + c.lineWidth / 2, dy + c.lineWidth / 2, dw - c.lineWidth, dh - c.lineWidth);
    c.fillStyle = shade(col, 0.3); if (horiz) c.fillRect(dx + dw * 0.12, dy + dh * 0.3, dw * 0.76, Math.max(1, dh * 0.14)); else c.fillRect(dx + dw * 0.3, dy + dh * 0.12, Math.max(1, dw * 0.14), dh * 0.76);
    c.fillStyle = '#f2c94c'; c.strokeStyle = '#6b4c0c'; c.lineWidth = Math.max(1, s * 0.03); const kr = Math.max(1.8, s * 0.085);
    c.beginPath(); if (horiz) c.arc(dx + dw - Math.max(kr * 2.2, dw * 0.14), dy + dh / 2, kr, 0, 7); else c.arc(dx + dw / 2, dy + dh - Math.max(kr * 2.2, dh * 0.14), kr, 0, 7); c.fill(); c.stroke();
    return;
  }
  if (fenceLike(it)) {
    const cx = x + W / 2, cy = y + H / 2, rw = Math.max(2, s * 0.14);
    for (const [q, ex, ey] of [[nb.n, 0, -1], [nb.s, 0, 1], [nb.w, -1, 0], [nb.e, 1, 0]]) if (q) {
      c.fillStyle = dk; if (ex) c.fillRect(Math.min(cx, cx + ex * W / 2), cy - rw / 2 - 1, W / 2 + 0.5, rw + 2); else c.fillRect(cx - rw / 2 - 1, Math.min(cy, cy + ey * H / 2), rw + 2, H / 2 + 0.5);
      c.fillStyle = col; if (ex) c.fillRect(Math.min(cx, cx + ex * W / 2), cy - rw / 2, W / 2 + 0.5, rw); else c.fillRect(cx - rw / 2, Math.min(cy, cy + ey * H / 2), rw, H / 2 + 0.5);
    }
    const ps = s * 0.3; c.fillStyle = col; c.fillRect(cx - ps / 2, cy - ps / 2, ps, ps); c.strokeStyle = dk; c.lineWidth = Math.max(1, s * 0.05); c.strokeRect(cx - ps / 2, cy - ps / 2, ps, ps);
    return;
  }
  const pi = it.sh === 'hedge' && (it.look ? { leaf: it.look.a, bloom: it.look.b } : picInfo(it)); wallTop(c, (pi && pi.leaf) || col, x, y, W, H, s, open, it.sh === 'hedge', pi && pi.bloom);
  if (/pillar/i.test(it.n)) { const ps = Math.min(W, H) * 0.56, px = x + (W - ps) / 2, py = y + (H - ps) / 2; c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(px + s * 0.05, py + s * 0.07, ps, ps); c.fillStyle = shade(col, 0.18); c.fillRect(px, py, ps, ps); c.strokeStyle = dk; c.lineWidth = Math.max(1.5, s * 0.06); c.strokeRect(px, py, ps, ps); }
}
const FURN_KINDS = [
  ['lamp', /lamp|\blights?\b|spotlight|lantern|chandelier|streetlight|candle|torch/i],
  ['bed', /\bbed\b/i], ['fridge', /fridge|refrigerator/i], ['stove', /stove|oven/i], ['sink', /\bsink\b/i], ['washer', /washing machine/i],
  ['toilet', /toilet/i], ['bath', /bathtub/i], ['shower', /shower/i], ['tv', /television/i],
  ['sofa', /sofa|couch/i], ['bench', /\bbench\b/i], ['stool', /stool|cushion|\bseat\b/i], ['chair', /chair/i],
  ['shelf', /shelf|bookcase|\brack\b/i], ['storage', /\bbox\b|chest|closet|locker|cabinet|dresser|wardrobe/i],
  ['table', /\btable\b(?! (lamp|setting))|\bdesk\b(?! light)|\bcounter\b/i],
];
const FURN_SKIP = new Set(['Special', 'Kits', 'Nature', 'Poster', 'Wallpaper', 'Rug', 'Terrain', 'Blocks', 'Buildings']);
const furnKind = (it) => { if (it.fk === undefined) { const k = it.L === 'o' && !FURN_SKIP.has(it.c) && !structural(it) && !(it.look && LOOKS[it.look.k]) && !/music box/i.test(it.n) && FURN_KINDS.find(([, re]) => re.test(it.n)); it.fk = k ? k[0] : null; } return it.fk; };
function drawFurniture(c, it, kind, x, y, s, wc, hc) {
  const W = wc * s, H = hc * s, col = itemColour(it), alt = it.look && it.look.b, dk = shade(col, -0.55), lt = shade(col, 0.35), lw = Math.max(1, s * 0.05), horiz = W > H, vert = H > W;
  const P = (f) => Math.min(W, H) * f, big = Math.min(W, H) * dpr >= 28, cx = x + W / 2, cy = y + H / 2, water = '#cde8f2';
  const shape = (bx, by, bw, bh, r, fill, stroke = dk) => { roundRect(c, bx, by, Math.max(1, bw), Math.max(1, bh), Math.max(0, Math.min(r, bw / 2, bh / 2))); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); } };
  const shadow = (bx, by, bw, bh, r) => { c.fillStyle = 'rgba(0,0,0,.16)'; roundRect(c, bx + s * 0.04, by + s * 0.06, bw, bh, Math.min(r, bw / 2, bh / 2)); c.fill(); };
  const dot = (dx, dy, r, fill, stroke) => { c.beginPath(); c.arc(dx, dy, Math.max(0.5, r), 0, 7); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); } };
  const body = (f, r) => { const p = P(f), bx = x + p, by = y + p, bw = W - 2 * p, bh = H - 2 * p; shadow(bx, by, bw, bh, r); shape(bx, by, bw, bh, r, col); return [bx, by, bw, bh]; };
  if (Math.min(W, H) * dpr < 20) { c.fillStyle = kind === 'lamp' ? '#ffd65a' : col; const p = P(kind === 'lamp' || kind === 'stool' ? 0.25 : 0.1); c.fillRect(x + p, y + p, W - 2 * p, H - 2 * p); return; }
  c.save();
  switch (kind) {
    case 'bed': {
      const p = P(0.07), bx = x + p, by = y + p, bw = W - 2 * p, bh = H - 2 * p, r = P(0.12), m = P(0.08), pil = shade(alt || col, 0.72);
      shadow(bx, by, bw, bh, r); shape(bx, by, bw, bh, r, alt || shade(col, -0.25));
      const across = horiz ? hc : wc, pils = Math.max(1, across), len = horiz ? bw : bh, wid = horiz ? bh : bw, hd = len * 0.3, g = m * 0.6;
      if (!horiz) shape(bx + m, by + hd, bw - 2 * m, bh - hd - m, r * 0.6, col); else shape(bx + hd, by + m, bw - hd - m, bh - 2 * m, r * 0.6, col);
      c.fillStyle = lt; if (!horiz) c.fillRect(bx + m, by + hd, bw - 2 * m, Math.max(2, len * 0.1)); else c.fillRect(bx + hd, by + m, Math.max(2, len * 0.1), bh - 2 * m);
      for (let i = 0; i < pils; i++) { const pw = (wid - 2 * m - g * (pils - 1)) / pils, o = m + i * (pw + g); if (!horiz) shape(bx + o, by + m, pw, hd - m * 1.6, P(0.1), pil, shade(pil, -0.35)); else shape(bx + m, by + o, hd - m * 1.6, pw, P(0.1), pil, shade(pil, -0.35)); }
      break;
    }
    case 'table': { const [bx, by, bw, bh] = body(0.1, P(0.14)); if (big) { c.strokeStyle = alt || lt; c.lineWidth = lw * (alt ? 1.6 : 1); roundRect(c, bx + P(0.09), by + P(0.09), bw - P(0.18), bh - P(0.18), P(0.08)); c.stroke(); } break; }
    case 'chair': {
      const p = P(0.13), bk = P(0.19), back = alt || shade(col, -0.28);
      if (horiz) { shadow(x + p, y + p, W - 2 * p, H - 2 * p, P(0.1)); shape(x + p + bk * 0.6, y + p, W - 2 * p - bk * 0.6, H - 2 * p, P(0.1), col); shape(x + p, y + p - P(0.03), bk, H - 2 * p + P(0.06), P(0.06), back); }
      else if (vert) { shadow(x + p, y + p, W - 2 * p, H - 2 * p, P(0.1)); shape(x + p, y + p + bk * 0.6, W - 2 * p, H - 2 * p - bk * 0.6, P(0.1), col); shape(x + p - P(0.03), y + p, W - 2 * p + P(0.06), bk, P(0.06), back); }
      else { shadow(x + p, y + p, W - 2 * p, H - 2 * p, P(0.1)); shape(x + p, y + p + bk * 0.55, W - 2 * p, H - 2 * p - bk * 0.55, P(0.1), col); shape(x + p - P(0.03), y + p, W - 2 * p + P(0.06), bk, P(0.06), back); }
      break;
    }
    case 'stool': { const r = Math.min(W, H) * 0.3; c.fillStyle = 'rgba(0,0,0,.16)'; c.beginPath(); c.arc(cx + s * 0.04, cy + s * 0.06, r, 0, 7); c.fill(); dot(cx, cy, r, col, dk); if (big) dot(cx, cy, r * 0.55, alt || lt); break; }
    case 'sofa': {
      const p = P(0.08), bx = x + p, by = y + p, bw = W - 2 * p, bh = H - 2 * p, r = P(0.14), back = (vert ? bw : bh) * 0.3, arm = P(0.16), cush = alt ? col : shade(col, 0.22);
      shadow(bx, by, bw, bh, r); shape(bx, by, bw, bh, r, alt || shade(col, -0.22));
      if (!vert) { shape(bx + arm, by + back, bw - 2 * arm, bh - back - P(0.04), P(0.08), cush); c.strokeStyle = dk; c.lineWidth = lw; for (let i = 1; i < wc; i++) { const lx = bx + arm + (bw - 2 * arm) * i / wc; c.beginPath(); c.moveTo(lx, by + back); c.lineTo(lx, by + bh - P(0.04)); c.stroke(); } }
      else { shape(bx + back, by + arm, bw - back - P(0.04), bh - 2 * arm, P(0.08), cush); c.strokeStyle = dk; c.lineWidth = lw; for (let i = 1; i < hc; i++) { const ly = by + arm + (bh - 2 * arm) * i / hc; c.beginPath(); c.moveTo(bx + back, ly); c.lineTo(bx + bw - P(0.04), ly); c.stroke(); } }
      break;
    }
    case 'bench': {
      const t = (vert ? W : H) * 0.5, bx = vert ? x + (W - t) / 2 : x + P(0.1), by = vert ? y + P(0.1) : y + (H - t) / 2, bw = vert ? t : W - P(0.2), bh = vert ? H - P(0.2) : t;
      shadow(bx, by, bw, bh, P(0.06)); shape(bx, by, bw, bh, P(0.06), col); c.strokeStyle = dk; c.lineWidth = lw; c.globalAlpha *= 0.7;
      for (const f of [1 / 3, 2 / 3]) { c.beginPath(); if (vert) { c.moveTo(bx + bw * f, by + P(0.04)); c.lineTo(bx + bw * f, by + bh - P(0.04)); } else { c.moveTo(bx + P(0.04), by + bh * f); c.lineTo(bx + bw - P(0.04), by + bh * f); } c.stroke(); }
      break;
    }
    case 'storage': {
      const [bx, by, bw, bh] = body(0.1, P(0.08)); c.strokeStyle = shade(col, -0.35); c.lineWidth = lw;
      if (!vert) { c.beginPath(); c.moveTo(bx + lw, by + bh * 0.3); c.lineTo(bx + bw - lw, by + bh * 0.3); c.stroke(); shape(cx - P(0.08), by + bh * 0.3 - P(0.06), P(0.16), P(0.14), P(0.03), alt || '#e7c35a', shade(alt || '#e7c35a', -0.55)); }
      else { c.beginPath(); c.moveTo(bx + bw * 0.3, by + lw); c.lineTo(bx + bw * 0.3, by + bh - lw); c.stroke(); shape(bx + bw * 0.3 - P(0.06), cy - P(0.08), P(0.14), P(0.16), P(0.03), alt || '#e7c35a', shade(alt || '#e7c35a', -0.55)); }
      break;
    }
    case 'shelf': {
      const d = (vert ? W : H) * 0.56, bx = x + P(0.06), by = y + P(0.06), bw = vert ? d : W - P(0.12), bh = vert ? H - P(0.12) : d;
      shadow(bx, by, bw, bh, P(0.05)); shape(bx, by, bw, bh, P(0.05), col);
      if (big) { const books = alt ? [alt, shade(alt, 0.35), shade(alt, -0.25)] : ['#d9534a', '#4f8fd0', '#e3b341', '#5cae6a', '#9a6bc4'], n = Math.max(3, Math.round((vert ? bh : bw) / (s * 0.16)));
        for (let i = 0; i < n; i++) { c.fillStyle = books[i % books.length]; const f = (i + 0.2) / n, g = 0.6 / n; if (vert) c.fillRect(bx + bw * 0.55, by + bh * f, bw * 0.32, bh * g); else c.fillRect(bx + bw * f, by + bh * 0.55, bw * g, bh * 0.32); } }
      break;
    }
    case 'lamp': {
      const R = Math.min(W, H) * 0.5, g = c.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(255,214,90,.9)'); g.addColorStop(0.55, 'rgba(255,214,90,.45)'); g.addColorStop(1, 'rgba(255,214,90,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill(); dot(cx, cy, P(0.27), col, dk); const bulb = alt && lum(alt) > 0.6 ? alt : '#fff3b0'; dot(cx, cy, P(0.13), bulb, shade(bulb, -0.4));
      if (big) { c.strokeStyle = 'rgba(170,120,20,.7)'; c.lineWidth = lw; c.beginPath(); for (let a = 0; a < 8; a++) { const an = a * Math.PI / 4; c.moveTo(cx + Math.cos(an) * P(0.33), cy + Math.sin(an) * P(0.33)); c.lineTo(cx + Math.cos(an) * P(0.44), cy + Math.sin(an) * P(0.44)); } c.stroke(); } break;
    }
    case 'fridge': { const [bx, by, bw, bh] = body(0.12, P(0.06)); c.strokeStyle = dk; c.lineWidth = lw; c.beginPath(); c.moveTo(bx, by + bh * 0.38); c.lineTo(bx + bw, by + bh * 0.38); c.stroke(); c.fillStyle = alt || dk; c.fillRect(bx + bw * 0.78, by + bh * 0.14, Math.max(1.5, bw * 0.07), bh * 0.16); c.fillRect(bx + bw * 0.78, by + bh * 0.48, Math.max(1.5, bw * 0.07), bh * 0.28); break; }
    case 'stove': { const [bx, by, bw, bh] = body(0.08, P(0.06)); const r = Math.min(bw, bh) * 0.15; for (const [fx, fy] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]]) dot(bx + bw * fx, by + bh * fy, r, alt || '#3a3a3a', shade(alt || '#3a3a3a', 0.4)); break; }
    case 'sink': { const [bx, by, bw, bh] = body(0.08, P(0.08)); shape(bx + bw * 0.18, by + bh * 0.26, bw * 0.64, bh * 0.58, P(0.12), water); dot(cx, by + bh * 0.14, P(0.06), alt || '#9aa6ad', dk); break; }
    case 'washer': { const [bx, by, bw, bh] = body(0.08, P(0.08)); dot(cx, cy + P(0.04), Math.min(bw, bh) * 0.3, alt || water, dk); dot(cx, cy + P(0.04), Math.min(bw, bh) * 0.16, shade(alt || water, 0.3)); break; }
    case 'toilet': { const t = P(0.24); shadow(x + P(0.22), y + P(0.08), W - P(0.44), H * 0.8, P(0.08)); shape(x + P(0.2), y + P(0.08), W - P(0.4), t, P(0.06), col); c.beginPath(); c.ellipse(cx, y + H * 0.62, W * 0.27, H * 0.3, 0, 0, 7); c.fillStyle = col; c.fill(); c.strokeStyle = dk; c.lineWidth = lw; c.stroke(); c.beginPath(); c.ellipse(cx, y + H * 0.64, W * 0.15, H * 0.18, 0, 0, 7); c.fillStyle = water; c.fill(); break; }
    case 'bath': { const [bx, by, bw, bh] = body(0.06, P(0.2)); const m = P(0.14); shape(bx + m, by + m, bw - 2 * m, bh - 2 * m, P(0.16), water); dot(horiz ? bx + bw - m * 2 : cx, horiz ? cy : by + bh - m * 2, P(0.05), alt || '#7d8a90'); break; }
    case 'shower': { const [bx, by, bw, bh] = body(0.08, P(0.06)); const m = P(0.12); shape(bx + m, by + m, bw - 2 * m, bh - 2 * m, P(0.04), water); c.strokeStyle = shade(water, -0.3); c.lineWidth = lw; c.beginPath(); c.moveTo(bx + m, by + m); c.lineTo(bx + bw - m, by + bh - m); c.moveTo(bx + bw - m, by + m); c.lineTo(bx + m, by + bh - m); c.stroke(); dot(bx + m * 1.6, by + m * 1.6, P(0.08), '#9aa6ad', dk); break; }
    case 'tv': { const t = (vert ? W : H) * 0.3; const bx = vert ? cx - t / 2 : x + P(0.08), by = vert ? y + P(0.08) : cy - t / 2, bw = vert ? t : W - P(0.16), bh = vert ? H - P(0.16) : t; shadow(bx, by, bw, bh, P(0.03)); shape(bx, by, bw, bh, P(0.03), it.look ? col : '#2c2f36', it.look ? dk : '#14161a'); c.fillStyle = alt || '#6fc3ff'; if (vert) c.fillRect(bx + bw - Math.max(1.5, bw * 0.25), by + P(0.04), Math.max(1.5, bw * 0.25), bh - P(0.08)); else c.fillRect(bx + P(0.04), by + bh - Math.max(1.5, bh * 0.25), bw - P(0.08), Math.max(1.5, bh * 0.25)); break; }
  }
  c.restore();
}
function drawKitUp(c, ob, s, d, rix, sh = true) {
  const it = ITEMS[ob.i], z = zOf(ob), x = view.px + ob.x * s, y = view.py + ob.y * s, W = ob.w * s, H = ob.h * s;
  if (d > 0 && sh) upShadow(c, ob, s);
  if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(x, y, W + 0.5, H + 0.5); } else drawPicItem(c, it, x, y, s, ob.w, ob.h, true, [ob.x, ob.y, ob.w, ob.h, z]);
  if (d < 0) { const a = c.globalAlpha; c.globalAlpha = a * Math.min(0.45, 0.12 - 0.06 * d); c.fillStyle = '#000'; c.fillRect(x, y, W, H); c.globalAlpha = a; }
  if (rix) kitBadge(c, ob, s, rix);
  if (s >= 18) lvBadge(c, z, x, y, s);
}
function drawRaised(c, ob, s, d = zOf(ob)) {
  const it = ITEMS[ob.i], z = zOf(ob), k = 0.72, w = ob.w * s, hh = ob.h * s, ix = view.px + ob.x * s + w * (1 - k) / 2, iy = view.py + ob.y * s + hh * (1 - k) / 2 - clamp(d, 0, 3) * s * 0.03;
  const a = c.globalAlpha; if (d > 0) { c.globalAlpha = a * 0.35; c.fillStyle = '#000'; roundRect(c, ix + s * 0.05, iy + s * 0.08, w * k, hh * k, Math.min(8, s * 0.18)); c.fill(); c.globalAlpha = a; }
  if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(ix, iy, w * k, hh * k); }
  else { c.save(); c.translate(ix, iy); c.scale(k, k); drawPicItem(c, it, 0, 0, s, ob.w, ob.h, s >= 14, [ob.x, ob.y, ob.w, ob.h, z, faceOf(ob)]); c.restore(); }
  if (d < 0) { c.globalAlpha = a * Math.min(0.45, 0.12 - 0.06 * d); c.fillStyle = '#000'; roundRect(c, ix, iy, w * k, hh * k, Math.min(8, s * 0.18)); c.fill(); c.globalAlpha = a; }
  if (s >= 18) lvBadge(c, z, view.px + ob.x * s, view.py + ob.y * s, s);
}
function lvBadge(c, z, x, y, s) { const t = lvTxt(z), f = Math.round(Math.max(9, s * 0.2)); c.font = `700 ${f}px ${BODY_FONT}`; const tw = c.measureText(t).width + f * 0.7, bx = x + 2, by = y + 2; c.fillStyle = 'rgba(20,24,28,.78)'; roundRect(c, bx, by, tw, f + 4, (f + 4) / 2); c.fill(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, bx + tw / 2, by + (f + 4) / 2 + 0.5); }
const solidUp = (it) => structural(it) && !fenceLike(it);
function upShadow(c, ob, s) { c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(view.px + ob.x * s + s * 0.07, view.py + ob.y * s + s * 0.12, ob.w * s, ob.h * s); }
function drawUp(c, ob, s, d = zOf(ob)) {
  const it = ITEMS[ob.i], z = zOf(ob), x = view.px + ob.x * s, y = view.py + ob.y * s, W = ob.w * s, H = ob.h * s, at = [ob.x, ob.y, ob.w, ob.h, z];
  if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(x, y, W + 0.5, H + 0.5); } else drawPicItem(c, it, x, y, s, ob.w, ob.h, true, at);
  if (solidUp(it) && it.sh !== 'hedge') { const a = c.globalAlpha; c.globalAlpha = a * (d > 0 ? Math.min(0.3, 0.06 * d) : Math.min(0.45, 0.12 - 0.06 * d)); c.fillStyle = d > 0 ? '#fff' : '#000'; c.fillRect(x, y, W, H); c.globalAlpha = a; }
  if (s >= 18) { const nb = ob.id ? structAround(at) : {}; if (!nb.w && !nb.n) lvBadge(c, z, x, y, s); }
}
const TOP2D = new Set('steps ladder awning beam pipeh pipecurve pipet pipeupt pipeup border bordercorner partition slide cannon roofslope roofvalley canoe raft bike wagon rocket sleepingbag hammock arrowsign arrowleft bed fridge stove sink washer toilet bath tv sofa bench chair shelf storage'.split(' '));
const turns2d = (it) => it.c !== 'Kits' && turnable(it) && !hangs(it) && (TOP2D.has(lookK(it)) || TOP2D.has(furnKind(it)));
function drawPicItem(c, it, x, y, s, wc = 1, hc = 1, label = true, at = null) {
  const f = at && at[5]; if (f && turns2d(it)) { const W = s * wc, H = s * hc, lw = f & 1 ? hc : wc, lh = f & 1 ? wc : hc; c.save(); c.translate(x + W / 2, y + H / 2); c.rotate(f * Math.PI / 2); drawPicItem(c, it, -lw * s / 2, -lh * s / 2, s, lw, lh, label, null); c.restore(); return; }
  if (structural(it)) { const u = picsFor(it)[0]; if (u && !it.look) mapPic(u); drawStructure(c, it, x, y, s, wc, hc, at); return; }
  const fk = furnKind(it); if (fk && s * dpr >= MAP_PIC_MIN) { const u = picsFor(it)[0]; if (u && !it.look) mapPic(u); if (!it.look || !drawLook(c, it, x, y, s, wc, hc)) drawFurniture(c, it, fk, x, y, s, wc, hc); return; }
  const url = S.pics && s * dpr >= MAP_PIC_MIN && lookK(it) !== 'steps' ? picsFor(it)[0] : null, p = url && mapPic(url);
  if (!p) { if (it.sh === 'kit') drawItem(c, it, x, y, s, wc, hc, label, it.look ? (bx, by, bw, bh) => drawLook(c, it, bx, by, bh, bw / bh, 1) : null); else if (!drawLook(c, it, x, y, s, wc, hc)) drawItem(c, it, x, y, s, wc, hc, label); return; }
  const w = s * wc, hh = s * hc;
  if (it.sh === 'kit') { drawItem(c, it, x, y, s, wc, hc, label, (bx, by, bw, bh) => drawPicIn(c, p, bx, by, bw, bh)); return; }
  if (it.sh === 'block') { drawPicIn(c, p, x, y, w, hh); return; }
  if (it.c !== 'Nature') { const a = c.globalAlpha; c.globalAlpha = a * 0.22; c.fillStyle = it.col; roundRect(c, x + 1, y + 1, w - 2, hh - 2, Math.min(8, s * 0.2)); c.fill(); c.globalAlpha = a; }
  const pad = Math.max(1, s * 0.05); drawPicIn(c, p, x + pad, y + pad, w - pad * 2, hh - pad * 2);
}
function picsReady(urls, ms) {
  urls = [...new Set(urls.filter(Boolean))]; urls.forEach(mapPic); const t0 = performance.now();
  return new Promise(res => { const tick = () => { if (performance.now() - t0 > ms || urls.every(u => { const p = mapPics.get(u); return p.img || p.failed; })) res(); else setTimeout(tick, 60); }; tick(); });
}
addEventListener('online', () => { for (const [u, p] of mapPics) if (p.failed) mapPics.delete(u); requestDraw(); });
const allPicURLs = () => [...Object.keys(PICS.pics).map(localPic), ...Object.keys(PICS.top || {}).filter(k => PICS.top[k][0]).map(k => 'pics/top/' + k + '.webp?v=' + PICS.top[k][0]), ...Object.keys(PICS.pk || {}).map(k => 'pics/pk/' + k + '.webp?v=' + PICS.pk[k][0])];
const PIC_CACHE = 'pokopia-pics';
const picFill = { total: 0, done: 0, failed: 0, running: false, waiting: false, unsupported: false };
async function fillPictures(force) {
  const urls = allPicURLs(); if (picFill.running || !urls.length) return;
  if (!('caches' in window) || !window.isSecureContext) { picFill.unsupported = true; picUI(); return; }
  if (!force && navigator.connection && navigator.connection.saveData) { picFill.waiting = true; picUI(); return; }
  picFill.running = true; picFill.waiting = false; picFill.failed = 0; picFill.force = !!force;
  try {
    const c = await caches.open(PIC_CACHE);
    const want = new Set(urls.map(u => new URL(u, location.href).href)), have = new Set();
    for (const r of await c.keys()) { if (want.has(r.url)) have.add(r.url); else await c.delete(r); }
    const todo = [...want].filter(u => !have.has(u));
    picFill.total = want.size; picFill.done = have.size; picUI();
    let next = 0, shown = 0;
    const worker = async () => {
      while (next < todo.length && (S.offline || picFill.force)) {
        await new Promise(r => idle(r, 1500)); if (next >= todo.length || !(S.offline || picFill.force)) break;
        const u = todo[next++];
        try { const r = await fetch(u, { headers: { 'x-pokopia-fill': '1' }, priority: 'low' }); if (!r.ok) throw new Error(r.status); await c.put(u, r); picFill.done++; }
        catch (e) { picFill.failed++; if (!navigator.onLine) { next = todo.length; } }
        if (picFill.done - shown >= 25) { shown = picFill.done; picUI(); }
      }
    };
    await Promise.all([1, 2, 3, 4].map(worker));
    if (todo.length && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
  } catch (e) { picFill.failed = picFill.failed || 1; }
  picFill.running = false; picUI();
}
function picText() {
  const n = allPicURLs().length;
  if (!n) return 'Pictures load online';
  if (picFill.unsupported) return 'Pictures show online only';
  if (picFill.waiting) return 'Data saver on: ' + fmt(n) + ' pictures (' + picMB() + ' MB) not saved offline yet';
  if (picFill.running) return 'Saving pictures offline… ' + fmt(picFill.done) + '/' + fmt(picFill.total);
  if (!picFill.total) return S.offline ? 'Checking offline pictures…' : 'Pictures aren\'t saved for offline use';
  if (picFill.done >= picFill.total) return '✓ All ' + fmt(picFill.total) + ' pictures saved offline';
  return 'Pictures offline: ' + fmt(picFill.done) + '/' + fmt(picFill.total) + (S.offline ? ' (the rest next time online)' : '');
}
const picMB = () => Math.max(1, Math.round((PICS.bytes || Object.keys(PICS.pics).length * 5000) / 1e6));
function picUI() {
  for (const el of $$('.picline')) { el.textContent = picText(); if (!picFill.running && (picFill.waiting || (picFill.total && picFill.done < picFill.total && navigator.onLine) || (!S.offline && !picFill.total))) el.append(' ', h('button', { class: 'btn sm', onclick: () => fillPictures(true) }, picFill.waiting || !picFill.total ? 'Save now' : S.offline ? 'Retry' : 'Save the rest')); }
}
function swatchEl(it, cls = 'swatch') {
  const u = picURL(it); if (!u) { const s = h('span', { class: cls }); s.style.backgroundImage = `url(${swatchURL(it)})`; return s; }
  const im = h('img', { class: cls, alt: '', loading: 'lazy', decoding: 'async', src: u });
  im.style.backgroundColor = it.L === 'g' ? it.col : (it.c === 'Nature' ? '#d6dfcf' : '#e8ebe5');
  im.onerror = () => { im.onerror = null; im.src = swatchURL(it); };
  return im;
}
function picEl(it, cls = 'pic') {
  const u = picURL(it), im = h('img', { class: cls, alt: '', loading: 'lazy', decoding: 'async', src: u || swatchURL(it) });
  if (u) im.onerror = () => { im.onerror = null; im.src = swatchURL(it); };
  return im;
}
function fillLazy(box, arr, make, root, step = 40, tail = null, first = 0) {
  let i = 0, obs = null;
  const more = (n) => {
    const frag = document.createDocumentFragment(), end = Math.min(arr.length, i + n); for (; i < end; i++) frag.append(make(arr[i], i)); box.append(frag);
    if (i >= arr.length) { if (obs) obs.disconnect(); if (tail) box.append(tail); return; }
    if (!('IntersectionObserver' in window)) { more(arr.length); return; }
    const mark = h('div', { class: 'lazymark', style: 'height:1px' }); box.append(mark);
    if (!obs) obs = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return; obs.disconnect(); for (const m of box.querySelectorAll(':scope > .lazymark')) m.remove(); more(step); }, { root, rootMargin: '0px 0px 700px 0px' });
    obs.observe(mark);
  };
  more(Math.max(step, first));
}
function segmented(opts, value, onPick, label) {
  const g = h('span', { class: 'seg', role: 'group', 'aria-label': label });
  for (const [v, t] of opts) g.append(h('button', { 'aria-pressed': v === value ? 'true' : 'false', onclick: () => onPick(v) }, t));
  return g;
}
const pickBtn = () => h('button', { class: 'btn sm' + (multiPick ? ' primary' : ''), type: 'button', 'aria-pressed': multiPick ? 'true' : 'false', 'data-tip': multiPick ? 'Stop picking' : 'Pick several: tap items to add them to the selection or take them away', onclick: () => { multiPick = !multiPick; renderOptbar(); } }, icon('multi'), multiPick ? 'Done' : 'Several');
function renderOptbar() {
  const ob = $('#optbar'); ob.textContent = '';
  const it = currentItem();
  if (tool === 'place' || tool === 'rect') {
    if (it) {
      const p = h('span', { class: 'pill' }, h('button', { class: 'pillbtn', type: 'button', 'data-drag': 'item:' + it.n, 'data-tip': 'Change what you place, or drag it onto the map', 'aria-label': 'Change what you place: ' + it.n, onclick: openBuild }, swatchEl(it), h('b', null, it.n)));
      p.append(h('button', { class: 'info', 'aria-label': 'About ' + it.n, onclick: () => showItemInfo(it) }, icon('info')));
      ob.append(p);
      if (!painted(it)) { const ft = footOf(it); ob.append(h('span', { class: 'pill', 'data-tip': sizeGuessed(it) || heightGuessed(it) ? 'Guessed ' + (sizeGuessed(it) && heightGuessed(it) ? 'size and height' : sizeGuessed(it) ? 'size' : 'height') + ': change it if yours differs in game' : tall(it) ? 'Size in tiles, and the levels it takes up' : 'Size in tiles' }, (rotated ? ft[1] : ft[0]) + '×' + (rotated ? ft[0] : ft[1]) + (sizeGuessed(it) ? '?' : '') + (tall(it) && (heightOf(it) > 1 || heightGuessed(it)) ? ' · ' + heightOf(it) + ' high' + (heightGuessed(it) ? '?' : '') : ''), turnable(it) || ft[0] !== ft[1] ? ibtn('rotate', 'Turn (Q)', () => turnPlace(1), 'sm') : '', ibtn('resize', 'Change its size', () => itemSizeDialog(it), 'sm'))); }
      const brushy = !((it.L !== 'g' && multi(it)) || isRug(it));
      if (brushy && tool === 'rect') ob.append(h('span', { class: 'pill' }, segmented([['solid', 'Solid'], ['outline', 'Outline']], fillMode, v => { fillMode = v; renderOptbar(); }, 'Fill mode'), tipBtn('Drag a rectangle. Outline fills only its edge: quick walls.')));
      else if (brushy && tool === 'place' && !(pourMode === 'pour' && canPour(it))) ob.append(h('span', { class: 'pill' }, lblIcon('brush', 'Brush size ([ and ])'), segmented([[1, '1'], [2, '2'], [3, '3'], [5, '5']], brush, v => { brush = v; renderOptbar(); }, 'Brush size')));
      if (tool === 'place' && canPour(it)) {
        ob.append(h('span', { class: 'pill' }, segmented([['paint', 'Paint'], ['pour', 'Pour']], pourMode, v => { pourMode = v; pourPrev = null; renderOptbar(); requestDraw(); }, 'Paint or pour'), tipBtn('Paint puts ' + it.n.toLowerCase() + ' exactly where you tap, to copy what\'s in your game. Pour drops a source on the tile you tap and lets it flow as in the game: ' + (it.n === 'Lava' ? '12 tiles along a 1-wide channel, 6 at low level' : '25 tiles along a 1-wide channel, 12 at low level, 10 in a 2-wide one') + ', a smaller circle on open ground, falling over edges and starting again below. Tap a tile to see where it goes, then tap it again or press Pour.')));
        if (pourMode === 'pour') ob.append(h('span', { class: 'pill' }, h('span', { class: 'lbl' }, it.n === 'Lava' ? 'Lava level' : 'Water level'), segmented([[false, 'Normal'], [true, 'Low']], pourLow, v => { pourLow = v; if (pourPrev) pourPrev = computeFlow(pourPrev.x, pourPrev.y, pourPrev.z, pourPrev.i, v); renderOptbar(); requestDraw(); }, 'Liquid level')));
        if (pourMode === 'pour' && pourPrev) { const P = pourPrev; ob.append(h('span', { class: 'pill' }, h('span', { class: 'lbl' }, 'About ' + P.cells.length + ' tile' + (P.cells.length === 1 ? '' : 's') + (P.falls ? ', ' + P.falls + ' falling' : '') + (P.capped ? ' (stopped at 5,000)' : '')), tipBtn('Where it should reach. The game also depends on the order you dug and filled things, so the edge can be a tile off.' + (P.lavaWater.length ? ' It touches ' + (it.n === 'Lava' ? 'water' : 'lava') + ' at ' + P.lavaWater[0].join(', ') + ': Water Gun turns lava into black rock you can walk on.' : '')), h('button', { class: 'btn sm primary', onclick: pourCommit }, 'Pour'), h('button', { class: 'btn sm', onclick: pourCancel }, 'Cancel'))); }
      }
      if (leveled(it)) ob.append(levelPill(it));
    } else ob.append(h('span', { class: 'pill' }, h('button', { class: 'pillbtn', type: 'button', onclick: openBuild }, 'Pick an item')));
    if (recent.length > 1) { const r = h('span', { class: 'pill' }, lblIcon('clock', 'Recently used')); for (const n of recent.slice(0, 6)) { const ri = BY_NAME.get(n); if (ri && n !== curItem) { const b = h('button', { class: 'info', 'data-tip': n, 'data-drag': 'item:' + n, 'aria-label': 'Use ' + n, onclick: () => selectItem(n) }, swatchEl(ri)); r.append(b); } } ob.append(r); }
  } else if (tool === 'erase') {
    ob.append(h('span', { class: 'pill' }, segmented([['both', 'Both'], ['objects', 'Items'], ['ground', 'Terrain']], eraseMode, v => { eraseMode = v; renderOptbar(); }, 'Erase mode'), tipBtn('Both: whatever is on top first, item, rug or terrain block. Items leaves the terrain. Terrain takes the top terrain block. Hidden layers are never erased.')));
    ob.append(h('span', { class: 'pill' }, lblIcon('layers', 'Level to erase from'), levelSelect('Level to erase from'), tipBtn(layerZ != null ? 'Only what\'s on level ' + lvNum(layerZ) + ' is erased, and everything above it fades out so you can reach it. Choose On top to go back.' : 'On top: erase takes whatever is on top first. Choose a level to erase only from it, even under the ground.')));
    ob.append(h('span', { class: 'pill' }, lblIcon('brush', 'Brush size ([ and ])'), segmented([[1, '1'], [2, '2'], [3, '3'], [5, '5']], brush, v => { brush = v; renderOptbar(); }, 'Brush size')));
  } else if (tool === 'zone') {
    ob.append(h('span', { class: 'pill' }, segmented([['habitat', 'Habitat'], ['label', 'Label']], zoneKind, v => { zoneKind = v; renderOptbar(); }, 'Zone type'), tipBtn('Drag to draw a zone. Houses you build from walls are found automatically: no zone needed.')));
  } else if (tool === 'select') {
    ob.append(h('span', { class: 'pill' }, tipBtn((multiPick ? 'Tap items to add them or take them away, or drag to add an area. ' : '') + 'Drag an item to move it. Drag from an empty square to select an area, then drag any of it to move it all. Tap a selected item or rug again to select what\'s under it. Pick several, or Shift with the mouse, adds items and areas to the selection.'), pickBtn()));
    ob.append(layerChip());
  } else if (tool === 'pick') ob.append(h('span', { class: 'pill' }, tipBtn('Tap an item on the map to pick it up as the thing to place.')));
  else if (tool === 'pan') ob.append(h('span', { class: 'pill' }, tipBtn((multiPick ? 'Tap items to add them or take them away. ' : '') + 'Drag to move around the map, or drag the selected item to move it; pinch, the mouse wheel or + and − zoom. Tap anything to see its details, and tap again to reach what\'s under it. Double-click a house to decorate inside. Pick several lets you tap more items into the selection.'), pickBtn()), layerChip());
  else if (tool === 'stamp' && stampHab) ob.append(h('span', { class: 'pill' }, h('span', { class: 'lbl' }, 'Tap the map to place'), h('b', null, stampHab.n), h('button', { class: 'btn sm', onclick: () => setTool(S.tool) }, 'Cancel')));
  else if (tool === 'paste' && clip) ob.append(h('span', { class: 'pill' }, h('span', { class: 'lbl' }, 'Tap to paste ' + clip.w + '×' + clip.h), tipBtn('Where you tap is its top-left corner. Red means something is in the way. Q turns it and F flips it.'), ibtn('rotate', 'Turn (Q)', () => clipTurn('cw'), 'sm'), ibtn('fliph', 'Flip (F)', () => clipTurn('fx'), 'sm'), h('button', { class: 'btn sm', onclick: () => setTool(S.tool) }, 'Done')));
  else if (tool === 'move' && moving) ob.append(h('span', { class: 'pill' }, h('span', { class: 'lbl' }, moving.grp ? 'Tap where they should go' : 'Tap where ' + ITEMS[moving.i].n + ' should go'), h('button', { class: 'btn sm', onclick: () => setTool(S.tool) }, 'Cancel')));
}

function layerChip() { if (layerZ == null) return ''; return h('span', { class: 'pill' }, lblIcon('layers', 'Working on this level'), h('b', null, 'Level ' + lvNum(layerZ)), ibtn('close', 'Back to on top', () => setLayerZ(null), 'sm')); }
const lblIcon = (id, tip) => h('span', { class: 'lbl lbi', role: 'img', 'aria-label': tip, 'data-tip': tip }, icon(id));
function levelSelect(label) {
  const sel = h('select', { class: 'lvsel', 'aria-label': label }, h('option', { value: '' }, 'On top'), levelList(levelStats()).map(z => h('option', { value: String(z) }, 'Level ' + lvNum(z) + (hidden.has(z) ? ' (hidden)' : ''))), h('option', { value: '*' }, 'Other level…'));
  sel.value = layerZ == null ? '' : String(layerZ); sel.onchange = () => { if (sel.value === '*') { sel.value = layerZ == null ? '' : String(layerZ); levelDialog(); return; } setLayerZ(sel.value === '' ? null : +sel.value); };
  return sel;
}
function levelPill(it) {
  const p = h('span', { class: 'pill' }, lblIcon('layers', 'Level to place on'), levelSelect('Level to place on'));
  const pouring = pourMode === 'pour' && canPour(it) && tool === 'place';
  if (layerZ == null && isTerr(it) && !pouring) p.append(segmented([['stack', 'Stack'], ['paint', 'Paint']], terrMode, v => { terrMode = v; renderOptbar(); requestDraw(); }, 'Stack a new block on top, or paint over the top block'));
  if (layerZ != null && !pouring) p.append(segmented([[false, 'Keep'], [true, 'Replace']], layerReplace, v => { layerReplace = v; renderOptbar(); requestDraw(); if (activeTab === 'layers') renderPanel(); }, 'Items already on level ' + lvNum(layerZ)));
  if (pouring) { p.append(tipBtn(layerZ == null ? 'The source goes on top of the ground where you tap.' : 'The source goes on level ' + lvNum(layerZ) + '.')); return p; }
  p.append(tipBtn(layerZ == null ? (isTerr(it) ? (terrMode === 'paint' ? 'Paint swaps the top terrain block for this one, at the same level.' : 'Stack puts a new terrain block on top of whatever is there, items included, one level up. Use Paint to swap the top block instead.') : stacker(it) ? 'Blocks go on top of whatever is there: terrain, other blocks or items.' : isRug(it) ? 'Rugs lie on top of the highest block, and furniture stands on them.' : 'Items go on top of the highest block there, terrain or a wall or block, never on another item. This one is ' + heightOf(it) + (heightOf(it) === 1 ? ' level' : ' levels') + ' high.') + ' Pick a level to place on that level instead, or pick one in Layers.' : 'Everything you place goes on level ' + lvNum(layerZ) + '. Keep leaves what\'s already on that level and skips those squares; Replace takes it away. Squares that will be replaced show red.'));
  return p;
}
function zoneAt(x, y) { for (let i = plan.zones.length - 1; i >= 0; i--) { const z = plan.zones[i]; if (x >= z.x && y >= z.y && x < z.x + z.w && y < z.y + z.h) return z; } return null; }
const pickTap = (x, y) => (downMod || multiPick) && plan ? grpToggleAt(x, y) : tapSelect(x, y);
function tapSelect(x, y) {
  if (!inB(plan, x, y)) { closeInspector(); return; }
  const k = y * plan.w + x, z = zoneAt(x, y), hs = houseAt(x, y) || autoHouses.find(q => q.doors.has(k));
  const pile = [...shownStack(k).map(ob => ({ obj: ob, key: topOf(ob), lv: zOf(ob) })), ...rugsOf(plan).filter(r => rugShown(r) && overlaps(r, x, y, 1, 1)).map(r => ({ rug: r, key: zOf(r) - 0.5, lv: zOf(r) }))].sort((a, b) => b.key - a.key);
  const at = layerZ != null ? pile.findIndex(q => q.lv === layerZ) : -1; if (at > 0) pile.unshift(pile.splice(at, 1)[0]);
  const tz0 = topTerrShown(k), fl = tz0 != null && !pile.length ? flowAt(k, tz0) : null;
  const stack = [...pile.map(q => q.obj ? { obj: q.obj } : { rug: q.rug }), fl && { flow: fl.s }, z && { zone: z }, hs && { house: hs }].filter(Boolean);
  if (!stack.length) { selection = null; closeInspector(); return; }
  const now = selection ? stack.findIndex(q => q.obj ? selection.obj && selection.obj.id === q.obj.id : q.rug ? selection.rug && selection.rug.id === q.rug.id : q.flow ? selection.flow && selection.flow.id === q.flow.id : q.zone ? selection.zone === q.zone : selection.house === q.house.id) : -1;
  const p = stack[now < 0 ? 0 : stack[now].obj && !(stack[now + 1] && (stack[now + 1].obj || stack[now + 1].rug)) ? now : (now + 1) % stack.length];
  if (p.obj) { selection = { obj: p.obj }; showObjInspector(p.obj); keepClear(p.obj); } else if (p.rug) { showRugInspector(p.rug); keepClear(p.rug); } else if (p.flow) showFlowInspector(p.flow); else if (p.zone) selectZone(p.zone); else selectHouse(p.house);
}
function keepClear(ob) {
  const ins = $('#inspector'); if (!ob || !ins.classList.contains('open') || ins.classList.contains('min')) return;
  const mw = $('#mapwrap').getBoundingClientRect(), r = ins.getBoundingClientRect(), pad = 20, z = zOf(ob) + 0.5, s = cellSize();
  const [cx, cy] = in3d() && view3d.project ? view3d.project(ob.x + ob.w / 2, z, ob.y + ob.h / 2) : [view.px + (ob.x + ob.w / 2) * s, view.py + (ob.y + ob.h / 2) * s], x = mw.left + cx, y = mw.top + cy;
  if (x < r.left - pad || x > r.right + pad || y < r.top - pad || y > r.bottom + pad) return;
  const dx = r.right + pad * 2 - x, dy = r.top - pad * 2 - y, okX = x + dx < mw.right - 56, okY = y + dy > mw.top + 56;
  if (okX && (!okY || dx <= -dy)) mapView.panBy(dx, 0); else if (okY) mapView.panBy(0, dy); else return;
  updateStatus();
}
function showRugInspector(r) {
  const it = ITEMS[r.i]; selection = { rug: r };
  const box = inspectorShell(it.n, swatchEl(it), 'Rug · ' + r.w + '×' + r.h + (zOf(r) !== rugLevel(plan, r.x, r.y, r.w, r.h) ? ' · level ' + lvNum(zOf(r)) : ''), 'Rugs lie flat: furniture stands on them. Drag it to move it. Tap again to select what\'s under it.');
  box.append(recipeChips(it));
  const acts = box.acts;
  acts.append(ibtn('copy', 'Place more', () => { closeInspector(); selectItem(it.n); toMap(); toast('Placing ' + it.n, 2400, null, 'placing'); }));
  acts.append(ibtn('move', 'Move', () => startMove(r)), ibtn('multi', 'Pick several', pickMore));
  acts.append(ibtn('up', 'Up a level', () => shiftRug(r, 1), '', { disabled: zOf(r) >= ZMAX }), ibtn('down', 'Down a level', () => shiftRug(r, -1), '', { disabled: zOf(r) <= ZMIN }));
  if (r.w !== r.h) acts.append(ibtn('rotate', 'Rotate', () => { const b = rugBlocker(r, r.x, r.y, r.h, r.w); if (b) { toast(whyNot(b, r.h, r.w, it).replace('No room here', 'Can\'t turn it')); return; } delRug(r); const n = addRug(r.i, r.x, r.y, r.h, r.w, zOf(r)); commitTx('Rotate'); showRugInspector(n); }));
  acts.append(ibtn('info', 'About', () => showItemInfo(it)));
  acts.append(ibtn('trash', 'Delete', () => { delRug(r); commitTx('Delete ' + it.n); selection = null; closeInspector(); }, 'danger'));
  requestDraw();
}
function shiftRug(r, dz) {
  const z = zOf(r) + dz, b = rugBlocker(r, r.x, r.y, r.w, r.h, z); let solid = null;
  for (let y = r.y; y < r.y + r.h && !solid; y++) for (let x = r.x; x < r.x + r.w; x++) { const v = terrAt(plan, y * plan.w + x, z); if (v) { solid = ITEMS[v - 1]; break; } }
  if (b || solid) { toast(b === 'top' ? 'That\'s as high as it goes' : b === 'bottom' ? 'That\'s as low as it goes' : (solid || ITEMS[b.i]).n + ' is in the way ' + (dz > 0 ? 'above' : 'below')); return; }
  delRug(r); const n = addRug(r.i, r.x, r.y, r.w, r.h, z); commitTx(dz > 0 ? 'Up a level' : 'Down a level'); reveal(z); showRugInspector(n);
}
function closeInspector() { $('#inspector').classList.remove('open'); $('#inspector').textContent = ''; selection = null; requestDraw(); }
let inspMin = LS.get('pokopia-planner:inspmin') === '1';
function setInspMin(on) { inspMin = on; LS.set('pokopia-planner:inspmin', on ? '1' : '0'); const box = $('#inspector'); box.classList.toggle('min', on); const b = box.querySelector('.insp-min'); if (b) { b.setAttribute('aria-expanded', on ? 'false' : 'true'); b.title = on ? 'Show details' : 'Hide details'; b.setAttribute('aria-label', b.title); } }
function inspectorShell(title, sw, sub, tip) {
  const box = $('#inspector'); box.textContent = '';
  const head = h('div', { class: 'insp-head' }, sw || '', h('div', { style: 'min-width:0' }, h('h3', null, title, tip ? ' ' : '', tipBtn(tip)), sub ? h('div', { class: 'sub', style: 'margin:0' }, sub) : ''),
    h('button', { class: 'close insp-min', 'aria-label': 'Fold', 'data-tip': 'Fold' }, icon('chev')),
    h('button', { class: 'close', 'aria-label': 'Close', 'data-tip': 'Close', onclick: () => { selection = null; closeInspector(); } }, icon('close')));
  head.querySelector('.insp-min').onclick = () => setInspMin(!inspMin);
  const acts = h('div', { class: 'insp-acts' }), body = h('div', { class: 'insp-body' });
  box.append(h('div', { class: 'insp-top' }, head, acts), body); box.classList.add('open'); setInspMin(inspMin);
  body.acts = acts; return body;
}
function recipeChips(it) { const w = h('div', { class: 'reqs' }); if (it.m && it.m.length) for (const [m, q] of it.m) w.append(h('span', { class: 'req' }, h('b', null, q + '×'), m)); else w.append(it.c === 'Kits' ? h('span', { class: 'note', 'data-tip': 'Bought as a kit; materials not listed' }, 'Kit') : h('span', { class: 'note', 'data-tip': 'Gather, plant or find it' }, 'Not crafted')); return w; }
function showObjInspector(ob) {
  const it = ITEMS[ob.i], guess = sizeGuessed(it) || it.est, hg = heightGuessed(it) && htOf(ob) === heightOf(it), t = htOf(ob);
  const z = zOf(ob), under = objAtLv(ob.y * plan.w + ob.x, z - 1);
  const box = inspectorShell(it.n, swatchEl(it), it.c + (it.sub ? ' · ' + it.sub : '') + ' · ' + ob.w + '×' + ob.h + (guess ? '?' : '') + (tall(it) ? ' · ' + t + ' high' + (hg ? '?' : '') : '') + (z !== standOver(ob.x, ob.y, ob.w, ob.h) ? ' · level ' + lvNum(z) + (under ? ', on ' + ITEMS[under.i].n : '') : ''), guess || hg ? 'The ' + (guess && hg ? 'size and height are guesses' : guess ? 'size is a guess' : 'height is a guess') + ': Resize it if yours differs in game.' : '');
  box.append(recipeChips(it));
  if (it.cap || (it.c === 'Kits' && it.wk)) {
    const facts = h('div', { class: 'reqs' });
    if (it.cap) {
      const ki = kitInfo(ob), host = houseAt(ob.x, ob.y), pv = prefabTotal();
      facts.append(h('span', { class: 'req', 'data-tip': 'Houses up to ' + it.cap + ' Pokémon' + (it.pf ? ', ' + it.pf + ' per floor' : '') + (it.sm ? ', small or medium only' : '') }, it.cap + ' Pokémon' + (it.pf ? ' · ' + it.pf + '/floor' : '') + (it.sm ? ' · S/M' : '')),
        h('span', { class: 'req', 'data-tip': (ki.kind === 'ow' ? 'Built from blocks in the world.' : 'It has its own interior, bigger than the outside.') + ' Its active area is indoors: ' + ki.w + '×' + ki.h + ' tiles' + (ki.fl > 1 ? ' on each of 2 floors' : '') + (ki.est ? ' (estimated)' : '') + '. Plan it with Decorate inside.' }, 'Inside ' + ki.w + '×' + ki.h + (ki.fl > 1 ? ' ×2' : '') + (ki.est ? '?' : '')));
      if (host) facts.append(h('span', { class: 'req', 'data-tip': 'Sits inside ' + (host.enclosure ? 'a walled enclosure' : 'a house you built') + '. It stays a home of its own and doesn\'t count as that house\'s furniture.' }, 'In ' + (host.enclosure ? 'an enclosure' : 'a house')));
      if (it.pv) facts.append(h('span', { class: 'req' + (pv > 40 ? ' miss' : ''), 'data-tip': 'Counts ' + it.pv + ' toward the limit of 40 prefab homes in one area' }, 'Prefab ' + pv + '/40'));
    }
    if (it.wk) facts.append(h('span', { class: 'req', 'data-tip': 'Pokémon needed to build it' }, 'Builders ' + it.wk));
    box.append(facts);
  }
  const how = howItWorks(it); if (how.length) box.append(h('div', { class: 'note', style: 'margin-top:6px' }, how.join(' ')));
  { const fx = envFx(it); if (fx && fx.need === 'f') { const who = fireLitBy(ob); box.append(h('div', { class: 'note', style: 'margin-top:6px' + (who.length ? '' : ';color:var(--warn)'), 'data-tip': 'A Burn Pokémon whose home is within 4 tiles lights it, and lights it again if rain puts it out.' }, who.length ? 'Lit by ' + listNames(who.slice(0, 3)) + (who.length > 3 ? ' and others' : '') + (plan.wx === 'rain' ? ' (rain can put it out where there\'s no roof, and they light it again)' : '') : '⚠ Not lit: no Burn Pokémon lives nearby, so its light and warmth don\'t count.')); } if (fx && fx.need === 'd' && plan.wx === 'rain') box.append(h('div', { class: 'note', style: 'margin-top:6px;color:var(--warn)' }, '⚠ Off while it rains, except inside a kit house.')); }
  powerSection(ob, box);
  fieldSection(ob, box);
  signalSection(ob, box);
  for (const el of machineLines(ob)) box.append(el);
  if (it.cap) { box.append(residentsSection(kitHome(ob))); box.append(boxLine('kit:' + ob.id)); }
  if (isBox(it)) boxInspector(ob, box);
  const groups = GROUP_OF.get(it.i) || [];
  if (groups.length) {
    const opts = new Set(); for (const g of groups) for (const i of GROUPS.get(g)) if (i !== it.i && ITEMS[i].w === 1 && ITEMS[i].h === 1) opts.add(i);
    if (opts.size) {
      const sel = h('select', { id: 'swapSel', 'aria-label': 'Swap for another ' + groups.join(' or ') }, h('option', { value: '' }, 'Swap for…'), [...opts].sort((a, b) => ITEMS[a].n.localeCompare(ITEMS[b].n)).map(i => h('option', { value: i }, ITEMS[i].n)));
      sel.onchange = () => { const ni = +sel.value; if (!sel.value) return; if (!fits(plan, ob.x, ob.y, 1, 1, ob.id, zOf(ob), heightOf(ITEMS[ni]))) { sel.value = ''; toast('No room above it for ' + ITEMS[ni].n); return; } delObj(ob); const nob = addObj(ni, ob.x, ob.y, 1, 1, zOf(ob)); if (nob && ob.r != null) nob.r = ob.r; commitTx('Swap'); if (nob) { selection = { obj: nob }; showObjInspector(nob); } };
      box.append(h('div', { class: 'field', style: 'margin-top:8px' }, sel));
    }
  }
  const acts = box.acts;
  if (it.cap) { acts.append(ibtn('sofa', 'Decorate inside', () => interiorEditor(ob), 'primary')); const hm = kitHome(ob); if (residentsOf(hm).length < hm.cap) acts.append(ibtn('useradd', 'Add resident', () => residentPicker(hm))); }
  acts.append(ibtn('copy', 'Place more', () => { closeInspector(); selectItem(it.n); toMap(); toast('Placing ' + it.n, 2400, null, 'placing'); }));
  acts.append(ibtn('move', 'Move', () => startMove(ob)), ibtn('multi', 'Pick several', pickMore));
  if (it.c !== 'Kits') acts.append(ibtn('up', 'Up a level', () => shiftLevel(ob, 1), '', { disabled: z >= ZMAX }), ibtn('down', 'Down a level', () => shiftLevel(ob, -1), '', { disabled: z <= ZMIN }));
  if (turnable(it)) acts.append(ibtn('rotl', 'Turn left (Shift+Q)', () => turnObj(ob, -1)), ibtn('rotate', 'Turn right (Q)', () => turnObj(ob, 1)));
  acts.append(ibtn('resize', 'Resize', () => resizeObjDialog(ob)));
  acts.append(ibtn('trash', 'Delete', () => deleteObjNow(ob), 'danger'));
  const used = USED_IN.get(it.i);
  if (used && used.length) box.append(h('div', { class: 'note', style: 'margin-top:8px' }, 'In ' + used.length + ' habitat' + (used.length > 1 ? 's' : '') + ': ' + used.slice(0, 6).map(id => HAB_BY_ID.get(id).n).join(', ') + (used.length > 6 ? '…' : '')));
  requestDraw();
}
function resizeObjDialog(ob) {
  const it = ITEMS[ob.i], kit = it.c === 'Kits', same = [...plan.objs.values()].filter(o => o.i === ob.i).length;
  modal('Resize ' + it.n, (box) => {
    box.append(picEl(it, 'pic big'));
    box.append(h('p', { class: 'sub' }, sizeNote(it, kit)));
    box.append(sizeFields('rs', ob.w, ob.h, tall(it) ? htOf(ob) : null));
    box.append(h('label', { class: 'toggle' }, h('input', { type: 'checkbox', id: 'rsAll', checked: kit ? null : '' }), 'Every ' + it.n + (same > 1 ? ' (' + same + ' placed)' : '') + ' and new ones'));
  }, 'Resize', () => {
    const w = clamp(+$('#rsW').value | 0, 1, 30), hh = clamp(+$('#rsH').value | 0, 1, 30), t = tall(it) ? clamp(+$('#rsT').value | 0, 1, HMAX) : 1;
    if ($('#rsAll').checked) { const ex = tall(it) && (t !== heightOf(it) || heightGuessed(it)) ? setItemHeight(it, t, true, true) : ''; setItemSize(it, w, hh, true, ob, ex); return; }
    const r = reshapeObj(ob, ob.x, ob.y, w, hh, zOf(ob), t); if (!r.ob) { toast(whyNot(r.err, w, hh, it).replace('No room here', 'Can\'t make it that size')); return false; }
    commitTx('Resize'); selection = { obj: r.ob }; showObjInspector(r.ob);
  });
}
function sizeNote(it, kit) { const g = sizeGuessed(it), hg = tall(it) && heightGuessed(it); return (kit ? 'Footprint' : g ? 'A guess: tiles' : 'Tiles') + ' it covers in your game' + (tall(it) ? ', and the levels it takes up' + (hg && !g ? ' (a guess)' : '') : '') + '.'; }
function sizeFields(p, w, d, t) {
  const f = (id, label, v, max) => h('div', { class: 'field' }, h('label', { for: p + id }, label), h('input', { id: p + id, type: 'number', min: 1, max, value: v }));
  return t == null ? h('div', { class: 'grid2' }, f('W', 'Width', w, 30), f('H', 'Depth', d, 30)) : h('div', { class: 'grid3' }, f('W', 'Width', w, 30), f('H', 'Depth', d, 30), f('T', 'Height', t, HMAX));
}
function setItemHeight(it, t, applyPlaced, quiet) {
  plan.isz = plan.isz || {}; const key = 'ht:' + it.n, base = it.ht == null ? 1 : it.ht;
  if (!it.hg && t === base) { delete plan.isz[key]; delete userSizes[key]; } else { plan.isz[key] = t; userSizes[key] = t; } saveUserSizes();
  let done = 0, kept = 0;
  if (applyPlaced) for (const ob of [...plan.objs.values()].filter(o => o.i === it.i)) {
    if (htOf(ob) === t) continue;
    if (!fits(plan, ob.x, ob.y, ob.w, ob.h, ob.id, zOf(ob), t)) { kept++; continue; }
    const was = selection && selection.obj === ob; delObj(ob); const n = keepObj(addObj(ob.i, ob.x, ob.y, ob.w, ob.h, zOf(ob), t), ob); if (was && n) selection = { obj: n }; done++;
  }
  const msg = ' · ' + t + ' high' + (kept ? ' · ' + kept + ' kept their height (no room above)' : '');
  if (quiet) return msg; commitTx('Height'); markDirty(); renderOptbar(); requestDraw(); toast(it.n + ' is now' + msg.slice(2), kept ? 5000 : 2600); return msg;
}
function setItemSize(it, w, hh, applyPlaced, keepSel, extra = '') {
  plan.isz = plan.isz || {}; if (!it.sg && w === (it.w || 1) && hh === (it.h || 1)) { delete plan.isz[it.n]; delete userSizes[it.n]; } else { plan.isz[it.n] = [w, hh]; userSizes[it.n] = [w, hh]; } saveUserSizes();
  let done = 0, skipped = 0, selNew = null;
  if (applyPlaced && isRug(it)) for (const r of rugsOf(plan).filter(q => q.i === it.i)) {
    const [nw, nh] = r.w === r.h || w === hh ? [w, hh] : (r.w > r.h) === (w > hh) ? [w, hh] : [hh, w]; if (r.w === nw && r.h === nh) continue;
    if (rugBlocker(r, r.x, r.y, nw, nh)) { skipped++; continue; }
    delRug(r); addRug(r.i, r.x, r.y, nw, nh, zOf(r)); done++;
  }
  if (applyPlaced && !isRug(it)) for (const ob of [...plan.objs.values()].filter(o => o.i === it.i)) {
    const [nw, nh] = ob.w === ob.h ? wallTurn(it, ob.x, ob.y, w, hh) : w === hh ? [w, hh] : (ob.w > ob.h) === (w > hh) ? [w, hh] : [hh, w];
    if (ob.w === nw && ob.h === nh) { if (ob === keepSel) selNew = ob; continue; }
    const r = reshapeObj(ob, ob.x, ob.y, nw, nh); if (!r.ob) { skipped++; continue; }
    if (ob === keepSel) selNew = r.ob; done++;
  }
  commitTx('Resize'); markDirty(); renderOptbar(); requestDraw();
  toast(it.n + ' is now ' + w + '×' + hh + extra + (done ? ' · ' + done + ' resized' : '') + (skipped ? ' · ' + skipped + ' kept size (no room)' : ''), skipped || extra.includes('kept') ? 5000 : 2600);
  if (keepSel) { let ob = selNew || keepSel; if (!plan.objs.has(ob.id) && selection && selection.obj && plan.objs.has(selection.obj.id) && selection.obj.i === ob.i) ob = selection.obj; if (plan.objs.has(ob.id)) { selection = { obj: ob }; showObjInspector(ob); } }
  if (IED.ob) iedRefresh();
}
const SZ_SKIP = new Set(['Terrain', 'Blocks', 'Wallpaper']);
const SZ_PRESETS = [[1, 1], [2, 1], [2, 2], [3, 1], [3, 2], [3, 3]];
let szFilter = null, szQuery = '';
function sizesReview() {
  const pool = ITEMS.filter(it => !SZ_SKIP.has(it.c) && it.L !== 'g');
  const guessedN = () => pool.filter(sizeGuessed).length;
  if (!szFilter) szFilter = guessedN() ? 'guess' : 'Furniture';
  modal('Item sizes', (box) => {
    box.classList.add('xl');
    const chips = h('div', { class: 'cats' }), inp = h('input', { type: 'search', placeholder: 'Search an item', value: szQuery, autocomplete: 'off', 'aria-label': 'Search an item' }), grid = h('div', { class: 'szgrid' });
    box.append(h('label', { class: 'search' }, icon('search'), inp), chips, grid);
    const counts = {}; for (const it of pool) counts[it.c] = (counts[it.c] || 0) + 1;
    const filters = [['guess', 'Guessed', guessedN], ['mine', 'Set by you', () => pool.filter(it => userSizes[it.n]).length], ...CAT_ORDER.filter(c => counts[c]).map(c => [c, CAT_META[c].label, () => counts[c]]), ['all', 'All', () => pool.length]];
    const renderChips = () => { chips.textContent = ''; for (const [k, label, n] of filters) chips.append(h('button', { class: 'cat', 'aria-pressed': szFilter === k && !szQuery ? 'true' : 'false', onclick: () => { szFilter = k; szQuery = ''; inp.value = ''; render(); } }, label, h('span', { class: 'n' }, n()))); };
    const card = (it) => {
      const c = h('div', { class: 'szcard' });
      const fill = () => {
        c.textContent = ''; const [w, d] = footOf(it), g = sizeGuessed(it), mine = !!userSizes[it.n];
        c.className = 'szcard' + (g ? ' guess' : '') + (mine ? ' mine' : '');
        const btns = h('div', { class: 'szbtns' });
        for (const [a, b] of SZ_PRESETS) { const on = !g && ((w === a && d === b) || (w === b && d === a)); btns.append(h('button', { 'aria-pressed': on ? 'true' : 'false', onclick: () => { setItemSize(it, a, b, true); fill(); renderChips(); } }, a + '×' + b)); }
        const other = h('button', { onclick: () => { other.replaceWith(h('span', { class: 'szother' }, wi, '×', di, h('button', { class: 'btn sm primary', onclick: () => { setItemSize(it, clamp(+wi.value | 0, 1, 30), clamp(+di.value | 0, 1, 30), true); fill(); renderChips(); } }, 'OK'))); wi.focus(); } }, 'Other…');
        const wi = h('input', { type: 'number', min: 1, max: 30, value: w, 'aria-label': 'Width' }), di = h('input', { type: 'number', min: 1, max: 30, value: d, 'aria-label': 'Depth' });
        btns.append(other);
        c.append(picEl(it), h('div', { class: 'nm' }, it.n), h('div', { class: 'note cur' }, w + '×' + d + (g ? ' · guess' : mine ? ' · set by you' : '')), btns);
      };
      fill(); return c;
    };
    const render = () => {
      renderChips(); grid.textContent = '';
      const q = szQuery.toLowerCase();
      const arr = pool.filter(it => q ? it.key.includes(q) : szFilter === 'guess' ? sizeGuessed(it) : szFilter === 'mine' ? !!userSizes[it.n] : szFilter === 'all' ? true : it.c === szFilter);
      if (!arr.length) grid.append(h('p', { class: 'empty' }, szFilter === 'guess' && !q ? 'No guesses left.' : 'Nothing here.'));
      fillLazy(grid, arr, card, box, 48);
    };
    inp.oninput = () => { szQuery = inp.value.trim(); render(); };
    render();
  }, null, null, false, 'Tap how many tiles each item covers in your game (width × depth; you can still turn it when placing). Your sizes apply to all your plans and resize what\'s on the map. Pictures: Serebii.net.');
}
function itemSizeDialog(it) {
  const ft = footOf(it), placed = isRug(it) ? rugsOf(plan).filter(r => r.i === it.i).length : [...plan.objs.values()].filter(o => o.i === it.i).length;
  modal('Size of ' + it.n, (box) => {
    box.append(picEl(it, 'pic big'));
    box.append(h('p', { class: 'sub' }, sizeNote(it, it.c === 'Kits')));
    box.append(sizeFields('is', ft[0], ft[1], tall(it) ? heightOf(it) : null));
    if (placed) box.append(h('label', { class: 'toggle' }, h('input', { type: 'checkbox', id: 'isAll', checked: '' }), 'Resize the ' + placed + ' placed'));
  }, 'Save size', () => { const all = placed ? $('#isAll').checked : false; let ex = ''; if (tall(it)) { const t = clamp(+$('#isT').value | 0, 1, HMAX); if (t !== heightOf(it) || heightGuessed(it)) ex = setItemHeight(it, t, all, true); } setItemSize(it, clamp(+$('#isW').value | 0, 1, 30), clamp(+$('#isH').value | 0, 1, 30), all, null, ex); }, false, 'Applies to every ' + it.n + ' in all your plans, on the map and inside kit houses.');
}
function grabAt(x, y) {
  if (!plan || !inB(plan, x, y)) return null;
  if ((tool === 'select' || tool === 'pan') && selection && selection.group && grpAt(selection.group, x, y)) return Object.assign({ grp: true }, grpFrame(selection.group));
  const k = y * plan.w + x, pile = shownStack(k), mine = selection && selection.obj && pile.find(q => q.id === selection.obj.id);
  if (mine) return mine;
  if (selection && selection.rug && rugShown(selection.rug) && plan.rugs.has(selection.rug.id) && overlaps(selection.rug, x, y, 1, 1)) return selection.rug;
  if (tool !== 'select') return null;
  const q = aimAt(k), rg = rugAt(x, y); if (!rg) return q; if (!q) return rg;
  if (layerZ != null && lvShown(layerZ)) { if (zOf(q) === layerZ) return q; if (zOf(rg) === layerZ) return rg; }
  return topOf(q) >= zOf(rg) ? q : rg;
}
function rugBlocker(r, x, y, w, h, z = zOf(r)) { if (x < 0 || y < 0 || x + w > plan.w || y + h > plan.h) return 'edge'; if (z < ZMIN || z > ZMAX) return z < ZMIN ? 'bottom' : 'top'; for (const q of plan.rugs.values()) if (q.id !== r.id && zOf(q) === z && overlaps(q, x, y, w, h)) return q; return null; }
function moveBlocker(ob, x, y, w, h, ctx = moveCtx(ob)) { const z = moveLevel(ob, x, y, w, h, ctx); return ob.rug ? rugBlocker(ob, x, y, w, h, z) : blocker(ITEMS[ob.i], x, y, w, h, ctx.ign, z, htOf(ob)); }
function fitMove(ob, cx, cy, gx, gy) {
  const it = ITEMS[ob.i], wall = !ob.rug && inWall(it), cands = [], orients = [[ob.w, ob.h, gx, gy]];
  if (ob.w !== ob.h) orients.push([ob.h, ob.w, ob.h - 1 - gy, gx]);
  orients.forEach(([w, h, ax, ay], turn) => {
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) {
      const x = cx - dx, y = cy - dy; let cost = Math.abs(dx - ax) + Math.abs(dy - ay) + turn * 1.5;
      if (wall && wallTurn(it, x, y, w, h, zOf(ob))[0] !== w) cost += 4;
      cands.push({ x, y, w, h, cost });
    }
  });
  cands.sort((a, b) => a.cost - b.cost); const ctx = moveCtx(ob);
  for (const c of cands) if (!moveBlocker(ob, c.x, c.y, c.w, c.h, ctx)) return Object.assign(c, { ok: true, z: moveLevel(ob, c.x, c.y, c.w, c.h, ctx) });
  const c = cands[0]; return Object.assign(c, { ok: false, z: moveLevel(ob, c.x, c.y, c.w, c.h, ctx), err: moveBlocker(ob, c.x, c.y, c.w, c.h, ctx) });
}
function doMove(ob, f) {
  const it = ITEMS[ob.i], same = f.x === ob.x && f.y === ob.y && f.w === ob.w && f.h === ob.h && (f.z || 0) === zOf(ob);
  if (!(ob.rug ? plan.rugs.has(ob.id) : plan.objs.has(ob.id))) { if (tool === 'move') setTool(S.tool); return; }
  if (!f.ok) { toast(whyNot(f.err, f.w, f.h, it, true)); return; }
  moving = null; if (tool === 'move') setTool(S.tool);
  if (ob.rug) { const n = same ? ob : (delRug(ob), addRug(ob.i, f.x, f.y, f.w, f.h, f.z || 0)); commitTx('Move'); showRugInspector(n); return; }
  if (same) { selection = { obj: ob }; showObjInspector(ob); return; }
  const inside = (r) => r.x >= ob.x && r.x < ob.x + ob.w && r.y >= ob.y && r.y < ob.y + ob.h, res = plan.res || [];
  if (res.some(inside)) setRes(res.map(r => { if (!inside(r)) return r; const rx = r.x - ob.x, ry = r.y - ob.y; return f.w === ob.w ? Object.assign({}, r, { x: f.x + rx, y: f.y + ry }) : Object.assign({}, r, { x: f.x + ob.h - 1 - ry, y: f.y + rx }); }));
  const riders = f.w === ob.w && f.h === ob.h ? ridersOf(ob) : []; for (const r of riders) delObj(r);
  const n = reshapeObj(ob, f.x, f.y, f.w, f.h, f.z || 0).ob; carry(riders, f.x - ob.x, f.y - ob.y, (f.z || 0) - zOf(ob)); commitTx('Move'); selection = { obj: n }; showObjInspector(n);
}
function moveObjTo(ob, x, y) { doMove(ob, fitMove(ob, x, y, 0, 0)); }
function drawMovePreview(c, s, ob, f) {
  const it = ITEMS[ob.i], X = (x) => view.px + x * s, Y = (y) => view.py + y * s;
  c.save(); c.setLineDash([3, 3]); c.lineWidth = 1.5; c.strokeStyle = theme.muted; c.strokeRect(X(ob.x) + 0.5, Y(ob.y) + 0.5, ob.w * s - 1, ob.h * s - 1);
  if (f.ok) {
    c.globalAlpha = 0.55;
    if (ob.rug) { if (!drawRug(c, it, X(f.x), Y(f.y), s, f.w, f.h) && !drawLook(c, it, X(f.x), Y(f.y), s, f.w, f.h)) { c.fillStyle = picsFor(it)[2] || it.col; c.fillRect(X(f.x), Y(f.y), f.w * s, f.h * s); } }
    else drawGhost(c, it, f.x, f.y, f.w, f.h, f.z, s, ob.r == null ? -1 : ob.r);
    c.globalAlpha = 0.28; c.fillStyle = theme.bad;
    if (!ob.rug) for (let y = f.y; y < f.y + f.h; y++) for (let x = f.x; x < f.x + f.w; x++) { const o = occAt(plan, y * plan.w + x, f.z), q = o && o !== ob.id && plan.objs.get(o); if (q && !(inWall(it) && structural(ITEMS[q.i]))) c.fillRect(X(x), Y(y), s, s); }
    c.globalAlpha = 1;
  }
  c.setLineDash([6, 4]); c.lineWidth = 2; c.strokeStyle = f.ok ? theme.accent : theme.bad; c.strokeRect(X(f.x) + 1, Y(f.y) + 1, f.w * s - 2, f.h * s - 2); c.restore();
}
function pickAt(x, y) {
  if (!inB(plan, x, y)) return; const k = y * plan.w + x;
  if (layerZ != null && lvShown(layerZ)) { const q = objAtLv(k, layerZ), v = lvShown('g') && terrAt(plan, k, layerZ); if (q) { selectItem(ITEMS[q.i].n); return; } if (v) { selectItem(ITEMS[v - 1].n); return; } }
  const top = topShown(k), tz = topTerrShown(k), rg = rugAt(x, y), t = pickTop(top, tz, rg);
  if (t && t !== 'terr') { selectItem(ITEMS[t.i].n); return; }
  if (tz != null) selectItem(ITEMS[terrAt(plan, k, tz) - 1].n);
}
function shownTerr(k) { const out = []; if (hidden.has('g')) return out; for (let j = 0; j < plan.tz.length; j++) { const z = plan.tz[j]; if (hidden.has(z)) continue; const v = plan.tt[j][k]; if (v) out.push([z, v]); } return out; }

function deleteSelection() { if (!selection) return; if (selection.obj) { deleteObjNow(selection.obj); return; } if (selection.rug) { delRug(selection.rug); commitTx('Delete ' + ITEMS[selection.rug.i].n); selection = null; closeInspector(); return; } if (selection.zone) { confirmDeleteZone(selection.zone); return; } if (selection.house) { const hs = houseById.get(selection.house); if (hs) confirmDeleteHouse(hs); return; } if (selection.group) { grpDelete(selection.group, false); return; } closeInspector(); }
function choiceModal(title, intro, choices) {
  modal(title, (box) => {
    for (const p of [].concat(intro)) if (p) box.append(typeof p === 'string' ? h('p', { class: 'sub' }, p) : p);
    const c = h('div', { class: 'choice' });
    for (const ch of choices) c.append(h('button', { class: 'btn' + (ch.danger ? ' danger' : ''), onclick: () => { closeModal(); ch.fn(); } }, h('span', null, ch.label), ch.note ? h('span', { class: 'note' }, ch.note) : ''));
    box.append(c);
  });
  const b = $('#modalBox .acts .btn'); if (b) b.textContent = 'Cancel';
}
const listNames = (a) => a.length < 3 ? a.join(' and ') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
function moveOut(names) { if (!names.length) return; const set = new Set(names); setRes((plan.res || []).filter(r => !set.has(r.p))); }
function deleteObjNow(ob) {
  if (!plan.objs.has(ob.id)) return; const it = ITEMS[ob.i], who = it.cap ? residentsOf(kitHome(ob)).map(r => r.p) : [];
  removeObj(ob); moveOut(who); commitTx('Delete'); selection = null; closeInspector();
  undoToast((it.cap ? it.n.replace(/ kit$/, '') : it.n) + ' deleted' + (who.length ? '. ' + listNames(who) + ' moved out' : ''));
}
function houseParts(hs) {
  const Wd = plan.w, Hd = plan.h, idx = autoHouses.indexOf(hs), O = hs.area.outer, own = new Set(), shared = new Set(), inside = new Set();
  const encloses = (o) => o.x <= O.x && o.y <= O.y && o.x + o.w >= O.x + O.w && o.y + o.h >= O.y + O.h;
  const neededNextDoor = (ob) => { for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) { if (!inB(plan, x, y)) continue; const j = cellHouse[y * Wd + x]; if (j >= 0 && j !== idx && !encloses(autoHouses[j])) return true; } return false; };
  for (const k of hs.cells) {
    if (cellHouse[k] !== idx) continue; const x = k % Wd, y = (k / Wd) | 0, L = hs.area.base; for (const q of stackAt(k)) if (zOf(q) >= L) inside.add(q);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= Wd || yy >= Hd) continue; const n = yy * Wd + xx; if (cellHouse[n] === idx) continue; for (const ob of stackAt(n)) { if (!ob || zOf(ob) < L || own.has(ob) || shared.has(ob)) continue; const it = ITEMS[ob.i]; if (!isWall(it) && !isDoor(it) && !isWindow(it)) continue; (neededNextDoor(ob) ? shared : own).add(ob); } }
  }
  for (const w of own) for (const r of ridersOf(w)) inside.add(r);
  return { walls: [...own], shared: [...shared], inside: [...inside] };
}
function houseResidents(hs, withInside) { const out = hs.enclosure ? [] : residentsOf(houseHome(hs)).map(r => r.p); if (withInside) for (const ob of hs.kitHomes) for (const r of residentsOf(kitHome(ob))) out.push(r.p); return out; }
function confirmDeleteHouse(hs) {
  const p = houseParts(hs), n = p.inside.length, kits = p.inside.filter(ob => ITEMS[ob.i].cap).length, who = houseResidents(hs, false), whoIn = houseResidents(hs, true).slice(who.length);
  const what = hs.enclosure ? 'enclosure' : 'house';
  if (!n) { deleteHouseNow(hs, false); return; }
  const intro = [];
  if (who.length) intro.push(listNames(who) + (who.length > 1 ? ' live' : ' lives') + ' here and will move out.');
  if (p.shared.length) intro.push(p.shared.length + ' wall piece' + (p.shared.length > 1 ? 's' : '') + ' shared with next door stay' + (p.shared.length > 1 ? '' : 's') + '.');
  intro.push('You can undo this.');
  const all = { label: 'Walls, doors and everything inside', note: n + ' item' + (n > 1 ? 's' : '') + ' inside' + (kits ? ', including ' + kits + ' kit home' + (kits > 1 ? 's' : '') + (whoIn.length ? ' (' + listNames(whoIn) + ' move out too)' : '') : ''), danger: true, fn: () => deleteHouseNow(hs, true) };
  const walls = { label: 'Only the walls and doors', note: kits ? 'Furniture and kit homes stay' : 'Furniture stays', fn: () => deleteHouseNow(hs, false) };
  choiceModal('Delete this ' + what + '?', intro, hs.enclosure ? [walls, all] : [all, walls]);
}
function deleteHouseNow(hs, all) {
  const cur = houseById.get(hs.id); if (!cur) return; const p = houseParts(cur), who = houseResidents(cur, all);
  for (const ob of p.walls) delObj(ob); if (all) for (const ob of p.inside) delObj(ob);
  moveOut(who); commitTx(cur.enclosure ? 'Delete enclosure' : 'Delete house'); selection = null; closeInspector();
  undoToast((cur.enclosure ? 'Enclosure' : 'House') + ' deleted' + (who.length ? '. ' + listNames(who) + ' moved out' : ''));
}
function zoneContents(z) {
  const prot = new Set();
  for (const hs of autoHouses) { if (hs.enclosure || !(hs.ok || residentsOf(houseHome(hs)).length)) continue; const p = houseParts(hs); for (const ob of [...p.walls, ...p.shared]) for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) prot.add(y * plan.w + x); for (const k of hs.cells) prot.add(k); }
  const out = [], kept = [];
  for (const ob of plan.objs.values()) {
    if (ob.x < z.x || ob.y < z.y || ob.x + ob.w > z.x + z.w || ob.y + ob.h > z.y + z.h) continue;
    let keep = !!ITEMS[ob.i].cap; for (let y = ob.y; y < ob.y + ob.h && !keep; y++) for (let x = ob.x; x < ob.x + ob.w; x++) if (prot.has(y * plan.w + x)) { keep = true; break; }
    (keep ? kept : out).push(ob);
  }
  return { out, kept };
}
function confirmDeleteZone(z) {
  const c = z.kind === 'label' ? { out: [], kept: [] } : zoneContents(z), n = c.out.length, what = z.kind === 'habitat' ? 'habitat' : 'zone';
  if (!n) { deleteZoneNow(z, false); return; }
  choiceModal('Delete ' + (z.name ? '"' + z.name + '"' : 'this ' + what) + '?', [c.kept.length ? 'Homes inside it stay where they are.' : '', 'You can undo this.'], [
    { label: 'The ' + what + ' and its items', note: n + ' item' + (n > 1 ? 's' : '') + '; ground and heights stay', danger: true, fn: () => deleteZoneNow(z, true) },
    { label: 'Only the ' + what + ' outline', note: 'Items stay', fn: () => deleteZoneNow(z, false) }]);
}
function deleteZoneNow(z, withItems) {
  const cur = plan.zones.find(q => q.id === z.id); if (!cur) return; let n = 0;
  if (withItems) for (const ob of zoneContents(cur).out) { delObj(ob); n++; }
  setZones(plan.zones.filter(q => q.id !== cur.id)); commitTx(cur.kind === 'habitat' ? 'Delete habitat' : 'Delete zone'); selection = null; closeInspector();
  undoToast((cur.name || 'Zone') + ' deleted' + (n ? ' with ' + n + ' item' + (n > 1 ? 's' : '') : ''));
}
let multiPick = false, grpGround = LS.get('pokopia-planner:grpground') !== '0', downMod = false, editSeq = 0;
const newGrp = (G) => ({ ids: new Set(G ? G.ids : []), rugs: new Set(G ? G.rugs : []), boxes: G && G.boxes ? G.boxes.slice() : [] });
function grpOf() { const s = selection; if (!s || !plan) return null; if (s.group) return s.group; if (s.obj && plan.objs.has(s.obj.id)) return { ids: new Set([s.obj.id]), rugs: new Set(), boxes: [] }; if (s.rug && plan.rugs.has(s.rug.id)) return { ids: new Set(), rugs: new Set([s.rug.id]), boxes: [] }; return null; }
function grpCells(G) { const s = new Set(); for (const b of G.boxes) for (let y = Math.max(0, b.y); y < Math.min(plan.h, b.y + b.h); y++) for (let x = Math.max(0, b.x); x < Math.min(plan.w, b.x + b.w); x++) s.add(y * plan.w + x); return s; }
function grpLive(G) { const objs = [], rugs = []; for (const id of G.ids) { const q = plan.objs.get(id); if (q) objs.push(q); } for (const id of G.rugs) { const q = plan.rugs.get(id); if (q) rugs.push(q); } return { objs, rugs }; }
function grpFrame(G) {
  const { objs, rugs } = grpLive(G); let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const q of [...objs, ...rugs, ...G.boxes]) { x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x + q.w); y1 = Math.max(y1, q.y + q.h); }
  return x0 === Infinity ? null : { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
function grpAt(G, x, y) { const { objs, rugs } = grpLive(G); return [...objs, ...rugs, ...G.boxes].some(q => overlaps(q, x, y, 1, 1)); }
function boxGroup(r, G) {
  G = newGrp(G); const x0 = Math.max(0, r.x), y0 = Math.max(0, r.y), x1 = Math.min(plan.w, r.x + r.w), y1 = Math.min(plan.h, r.y + r.h); if (x1 <= x0 || y1 <= y0) return G;
  const inR = (q) => q.x >= x0 && q.y >= y0 && q.x + q.w <= x1 && q.y + q.h <= y1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) for (const ob of shownStack(y * plan.w + x)) if (inR(ob)) G.ids.add(ob.id);
  for (const q of plan.rugs.values()) if (rugShown(q) && inR(q)) G.rugs.add(q.id);
  G.boxes.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 }); return G;
}
function houseGroup(hs) {
  const p = houseParts(hs), G = newGrp(null), O = hs.area.outer;
  for (const ob of [...p.walls, ...p.inside]) if (obShown(ob)) G.ids.add(ob.id);
  for (const r of plan.rugs.values()) if (rugShown(r) && r.x >= O.x && r.y >= O.y && r.x + r.w <= O.x + O.w && r.y + r.h <= O.y + O.h) G.rugs.add(r.id);
  G.boxes.push({ x: O.x, y: O.y, w: O.w, h: O.h }); return G;
}
function restZ(it, x, y, w, h, ign) {
  if (inWall(it)) return autoZ(it, x, y, w, h, ign);
  let z = -Infinity; for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { if (!inB(plan, xx, yy)) continue; const b = thingTop(yy * plan.w + xx, ign, true); z = Math.max(z, b == null ? 1 : b + 1); }
  return z === -Infinity ? 1 : z;
}
function grpSnap(G, F = grpFrame(G)) {
  const { objs, rugs } = grpLive(G), all = new Map();
  for (const ob of objs) { all.set(ob.id, ob); for (const r of ridersOf(ob)) all.set(r.id, r); }
  const ign = new Set(all.keys()), sn = { pid: plan.id, w: F.w, h: F.h, objs: [], rugs: [], ground: [], zones: [], res: [], roofs: [], boxes: G.boxes.map(b => ({ x: b.x - F.x, y: b.y - F.y, w: b.w, h: b.h })), bg: null, ign, rign: new Set(rugs.map(r => r.id)), pc: null };
  const side = (ob) => [[ob.x - 1, ob.y], [ob.x + ob.w, ob.y], [ob.x, ob.y - 1], [ob.x, ob.y + ob.h]].some(([x, y]) => { const q = lineAt(x, y, zOf(ob)); return q && !ign.has(q.id); });
  for (const ob of all.values()) { const it = ITEMS[ob.i]; sn.objs.push({ src: ob, i: ob.i, x: ob.x - F.x, y: ob.y - F.y, w: ob.w, h: ob.h, z: zOf(ob), t: htOf(ob), int: ob.int || null, r: ob.r, f: faceOf(ob), g: zOf(ob) === restZ(it, ob.x, ob.y, ob.w, ob.h, ign), close: inWall(it) && side(ob) }); }
  for (const r of rugs) sn.rugs.push({ src: r, i: r.i, x: r.x - F.x, y: r.y - F.y, w: r.w, h: r.h, z: zOf(r), g: zOf(r) === rugLevel(plan, r.x, r.y, r.w, r.h) });
  const cells = G.boxes.length ? grpCells(G) : null;
  if (cells && cells.size) {
    if (grpGround && lvShown('g')) {
      const n = new Map();
      for (const k of cells) { const x = k % plan.w, y = (k / plan.w) | 0; for (const [xx, yy] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { if (!inB(plan, xx, yy)) continue; const j = yy * plan.w + xx; if (cells.has(j)) continue; const tz = topTerrShown(j); if (tz != null) { const v = terrAt(plan, j, tz); n.set(v, (n.get(v) || 0) + 1); } } }
      let best = 0; for (const [v, c] of n) if (c > best) { best = c; sn.bg = v; }
      for (const k of cells) { const tz = topTerrShown(k); if (tz == null) continue; const v = terrAt(plan, k, tz); if (v !== sn.bg) sn.ground.push({ k, x: k % plan.w - F.x, y: ((k / plan.w) | 0) - F.y, z: tz, v }); }
    }
    for (const z of plan.zones) { let inside = true; for (let y = z.y; y < z.y + z.h && inside; y++) for (let x = z.x; x < z.x + z.w; x++) if (!cells.has(y * plan.w + x)) { inside = false; break; } if (inside) sn.zones.push({ src: z, x: z.x - F.x, y: z.y - F.y, w: z.w, h: z.h }); }
  }
  const hm = new Map(), moves = (hs) => { if (!hs || hs.enclosure) return false; if (!hm.has(hs.id)) { const p = houseParts(hs); hm.set(hs.id, p.walls.length > 0 && p.walls.every(w => ign.has(w.id))); } return hm.get(hs.id); };
  for (const r of plan.res || []) { const home = homeAt(r.x, r.y, r.k); if (home && (home.kind === 'kit' ? ign.has(home.ob.id) : moves(home.hs))) sn.res.push({ r, x: r.x - F.x, y: r.y - F.y }); }
  for (const r of plan.roofs || []) if (moves(houseAt(r.x, r.y))) sn.roofs.push({ r, x: r.x - F.x, y: r.y - F.y });
  return sn;
}
function snapTurn(sn, op) {
  const W = sn.w, H = sn.h, rot = op === 'cw' || op === 'ccw';
  const pt = op === 'cw' ? (u, v) => [H - 1 - v, u] : op === 'ccw' ? (u, v) => [v, W - 1 - u] : op === 'fx' ? (u, v) => [W - 1 - u, v] : (u, v) => [u, H - 1 - v];
  const rc = (o) => { const a = pt(o.x, o.y), b = pt(o.x + o.w - 1, o.y + o.h - 1); return Object.assign({}, o, { x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), w: Math.abs(a[0] - b[0]) + 1, h: Math.abs(a[1] - b[1]) + 1 }); };
  const ro = (o) => { const q = rc(o); if (o.f != null && turnable(ITEMS[o.i])) q.r = q.f = turnFace(o.f, op); return q; };
  const pp = (o) => { const a = pt(o.x, o.y); return Object.assign({}, o, { x: a[0], y: a[1] }); };
  return Object.assign({}, sn, { w: rot ? H : W, h: rot ? W : H, objs: sn.objs.map(ro), rugs: sn.rugs.map(rc), zones: sn.zones.map(rc), boxes: sn.boxes.map(rc), ground: sn.ground.map(pp), res: sn.res.map(pp), roofs: sn.roofs.map(pp), pc: null });
}
function snapPlan(sn, ox, oy, moving) {
  const ign = moving ? sn.ign : new Set();
  if (ox < 0 || oy < 0 || ox + sn.w > plan.w || oy + sn.h > plan.h) return { ox, oy, objs: [], rugs: [], gone: new Set(), put: [], err: 'edge', bad: null, dz: 0 };
  const wt = new Map(); let top = null;
  const vote = (d, n) => { wt.set(d, (wt.get(d) || 0) + n); top = top == null ? d : Math.max(top, d); };
  for (const o of sn.objs) if (o.g) vote(restZ(ITEMS[o.i], ox + o.x, oy + o.y, o.w, o.h, ign) - o.z, o.w * o.h);
  if (!wt.size) for (const r of sn.rugs) if (r.g) vote(rugLevel(plan, ox + r.x, oy + r.y, r.w, r.h) - r.z, r.w * r.h);
  let dz = 0, best = -1; for (const [d, n] of wt) if (n > best || (n === best && d > dz)) { best = n; dz = d; }
  const P = snapPlanZ(sn, ox, oy, moving, dz);
  if (P.err && P.err.terr && top != null && top !== dz) { const Q = snapPlanZ(sn, ox, oy, moving, top); if (!Q.err) return Q; }
  return P;
}
function snapPlanZ(sn, ox, oy, moving, dz) {
  const own = sn.pid === plan.id, ign = moving ? sn.ign : new Set(), rign = moving ? sn.rign : new Set();
  const P = { ox, oy, objs: [], rugs: [], gone: new Set(), put: [], err: null, bad: null, dz };
  const fail = (err, x, y, w, h) => { P.err = err; P.bad = x == null ? null : { x, y, w, h }; return P; };
  for (const o of sn.objs) {
    const it = ITEMS[o.i], x = ox + o.x, y = oy + o.y, z = o.z + dz, b = blocker(it, x, y, o.w, o.h, ign, z, o.t);
    if (b) return fail(b, x, y, o.w, o.h);
    for (let lz = z; lz < z + o.t; lz++) for (let yy = y; yy < y + o.h; yy++) for (let xx = x; xx < x + o.w; xx++) { const id = occAt(plan, yy * plan.w + xx, lz); if (!id || ign.has(id)) continue; if (own && sn.ign.has(id)) return fail(plan.objs.get(id), x, y, o.w, o.h); P.gone.add(plan.objs.get(id)); }
    P.objs.push({ o, x, y, z });
  }
  for (const r of sn.rugs) {
    const x = ox + r.x, y = oy + r.y, z = r.z + dz;
    if (z < ZMIN || z > ZMAX) return fail(z < ZMIN ? 'bottom' : 'top', x, y, r.w, r.h);
    for (const q of plan.rugs.values()) if (!rign.has(q.id) && zOf(q) === z && overlaps(q, x, y, r.w, r.h)) return fail(q, x, y, r.w, r.h);
    for (let yy = y; yy < y + r.h; yy++) for (let xx = x; xx < x + r.w; xx++) { const v = terrAt(plan, yy * plan.w + xx, z); if (v) return fail({ i: v - 1, terr: 1 }, x, y, r.w, r.h); }
    P.rugs.push({ r, x, y, z });
  }
  for (const g of sn.ground) {
    const x = ox + g.x, y = oy + g.y, k = y * plan.w + x, tz = topTerrShown(k), L = tz == null ? g.z + dz : tz, id = occAt(plan, k, L);
    if (L < ZMIN || L > ZMAX || (id && !ign.has(id))) continue;
    P.put.push([k, L, g.v]);
  }
  return P;
}
function snapPlanAt(sn, ox, oy, moving) { const key = ox + ',' + oy + ',' + moving + ',' + editSeq; if (sn.pc && sn.pc.key === key) return sn.pc.P; const P = snapPlan(sn, ox, oy, moving); sn.pc = { key, P }; return P; }
function snapApply(sn, P, moving) {
  if (moving) { for (const o of sn.objs) delObj(o.src); for (const r of sn.rugs) delRug(r.src); }
  for (const q of P.gone) if (q && plan.objs.has(q.id)) delObj(q);
  if (moving && sn.bg != null) for (const g of sn.ground) setTerr(g.k, g.z, sn.bg);
  const G = { ids: new Set(), rugs: new Set(), boxes: sn.boxes.map(b => ({ x: P.ox + b.x, y: P.oy + b.y, w: b.w, h: b.h })) }, lv = new Set(); let miss = 0;
  for (const e of P.objs) { const n = addObj(e.o.i, e.x, e.y, e.o.w, e.o.h, e.z, e.o.t); if (!n) { miss++; continue; } G.ids.add(n.id); lv.add(e.z); if (e.o.int) n.int = moving ? e.o.int : cloneInt(e.o.int); if (e.o.r != null) n.r = e.o.r; }
  for (const e of P.rugs) { G.rugs.add(addRug(e.r.i, e.x, e.y, e.r.w, e.r.h, e.z).id); lv.add(e.z); }
  for (const [k, L, v] of P.put) if (!occAt(plan, k, L)) setTerr(k, L, v);
  const at = (e) => ({ x: P.ox + e.x, y: P.oy + e.y });
  if (moving) {
    for (const o of sn.objs) if (o.close) closeWall(o.src);
    if (sn.zones.length) { const m = new Map(sn.zones.map(q => [q.src.id, q])); setZones(plan.zones.map(z => { const q = m.get(z.id); return q ? Object.assign({}, z, at(q), { w: q.w, h: q.h }) : z; })); }
    if (sn.res.length) { const m = new Map(sn.res.map(e => [e.r, e])); setRes((plan.res || []).map(r => m.has(r) ? Object.assign({}, r, at(m.get(r))) : r)); }
    if (sn.roofs.length) { const m = new Map(sn.roofs.map(e => [e.r, e])); setRoofs((plan.roofs || []).map(r => m.has(r) ? Object.assign({}, r, at(m.get(r))) : r)); }
  } else if (sn.zones.length) setZones([...plan.zones, ...sn.zones.map(q => Object.assign({}, q.src, at(q), { id: uid(), w: q.w, h: q.h }))]);
  if (P.dz) for (const z of lv) if (hidden.has(z)) { hidden.delete(z); saveLayers(); layersChanged(); }
  return { G, miss };
}
function grpWhy(P, label) { const b = P.err, where = label === 'Turn' ? 'Can\'t turn them here' : label === 'Flip' ? 'Can\'t flip them here' : 'No room there'; if (b === 'edge') return where + ': off the edge'; if (b === 'top' || b === 'bottom') return where + ': too ' + (b === 'top' ? 'high' : 'low'); return where + ': ' + ITEMS[b.i].n + ' is in the way'; }
function grpPut(sn, P, moving, label) {
  if (P.err) { toast(grpWhy(P, label)); return null; }
  const r = snapApply(sn, P, moving); commitTx(label); if (r.miss) toast(r.miss + ' item' + (r.miss > 1 ? 's' : '') + ' didn\'t fit');
  return r.G;
}
function grpRun(G, op) {
  const F = grpFrame(G); if (!F) return false; let sn = grpSnap(G, F), ox = F.x, oy = F.y;
  const turn = op === 'cw' || op === 'ccw', label = typeof op === 'string' ? (turn ? 'Turn' : 'Flip') : 'Move';
  if (typeof op === 'string') { sn = snapTurn(sn, op); if (turn) { ox = clamp(F.x + Math.trunc((F.w - F.h) / 2), 0, Math.max(0, plan.w - sn.w)); oy = clamp(F.y + Math.trunc((F.h - F.w) / 2), 0, Math.max(0, plan.h - sn.h)); } }
  else { ox += op.dx; oy += op.dy; }
  const g = grpPut(sn, snapPlan(sn, ox, oy, true), true, label); if (g) grpSelect(g); return !!g;
}
function grpDup(G) {
  const F = grpFrame(G); if (!F) return; const sn = grpSnap(G, F);
  for (const [dx, dy] of [[F.w + 1, 0], [0, F.h + 1], [-F.w - 1, 0], [0, -F.h - 1]]) { const P = snapPlan(sn, F.x + dx, F.y + dy, false); if (P.err) continue; const g = grpPut(sn, P, false, 'Duplicate'); if (g) { grpSelect(g); toast('Copy placed next to the original'); } return; }
  clip = sn; selection = null; closeInspector(); setTool('paste'); toast('No room next to it. Tap where the copy should go');
}
function grpCopy(G) { const F = grpFrame(G); if (!F) return; clip = grpSnap(G, F); selection = null; closeInspector(); setTool('paste'); toast('Copied. Tap the map to paste'); }
function clipTurn(op) { if (!clip) return; clip = snapTurn(clip, op); renderOptbar(); requestDraw(); }
function pasteAt(x0, y0) { const P = snapPlan(clip, x0, y0, false); if (P.err) { toast(grpWhy(P, 'Paste')); return; } const r = snapApply(clip, P, false); commitTx('Paste'); if (r.miss) toast(r.miss + ' item' + (r.miss > 1 ? 's' : '') + ' didn\'t fit'); }
function grpMoveTool(G) { const F = grpFrame(G); if (!F) return; startMove({ grp: G, F, sn: grpSnap(G, F) }); }
const grpMoveOrigin = (m, x, y) => [x - Math.floor(m.sn.w / 2), y - Math.floor(m.sn.h / 2)];
function grpMoveTo(x, y) { const m = moving, [ox, oy] = grpMoveOrigin(m, x, y), P = snapPlan(m.sn, ox, oy, true); if (P.err) { toast(grpWhy(P, 'Move')); return; } moving = null; setTool(S.tool); const g = grpPut(m.sn, P, true, 'Move'); if (g) grpSelect(g); }
function grpShift(G, dz) {
  const { objs, rugs } = grpLive(G), list = objs.filter(ob => ITEMS[ob.i].c !== 'Kits').sort((a, b) => (zOf(b) - zOf(a)) * dz), N = new Map(), to = new Set(); let moved = 0;
  for (const ob of list) { const z = zOf(ob) + dz; if (!fits(plan, ob.x, ob.y, ob.w, ob.h, ob.id, z, htOf(ob))) continue; delObj(ob); const n = keepObj(addObj(ob.i, ob.x, ob.y, ob.w, ob.h, z, htOf(ob)), ob); if (n) { N.set(ob.id, n.id); moved++; to.add(z); } }
  for (const r of [...rugs].sort((a, b) => (zOf(b) - zOf(a)) * dz)) { const z = zOf(r) + dz; let solid = false; for (let y = r.y; y < r.y + r.h && !solid; y++) for (let x = r.x; x < r.x + r.w; x++) if (terrAt(plan, y * plan.w + x, z)) { solid = true; break; } if (solid || rugBlocker(r, r.x, r.y, r.w, r.h, z)) continue; delRug(r); N.set(r.id, addRug(r.i, r.x, r.y, r.w, r.h, z).id); moved++; to.add(z); }
  const all = list.length + rugs.length;
  if (!moved) { toast(all ? (dz > 0 ? 'No room above them' : 'No room below them') : 'No items here'); return; }
  for (const z of to) if (hidden.has(z)) { hidden.delete(z); saveLayers(); layersChanged(); }
  commitTx(dz > 0 ? 'Up a level' : 'Down a level'); toast(moved + ' item' + (moved === 1 ? '' : 's') + ' moved ' + (dz > 0 ? 'up' : 'down') + (moved < all ? ', ' + (all - moved) + ' had no room' : ''));
  const g = newGrp(G); g.ids = new Set([...G.ids].map(id => N.get(id) || id)); g.rugs = new Set([...G.rugs].map(id => N.get(id) || id)); grpSelect(g);
}
function grpDelete(G, terrToo) {
  const { objs, rugs } = grpLive(G), F = grpFrame(G); if (!F) return; const who = [...new Set(grpSnap(G, F).res.map(e => e.r.p))], n = objs.length + rugs.length;
  for (const ob of objs) if (!inWall(ITEMS[ob.i])) delObj(ob); for (const ob of objs) if (inWall(ITEMS[ob.i])) removeObj(ob); for (const r of rugs) delRug(r);
  if (terrToo) for (const k of grpCells(G)) for (const [z] of shownTerr(k)) setTerr(k, z, 0);
  moveOut(who); const t = commitTx(terrToo ? 'Clear area' : 'Delete'); selection = null; closeInspector();
  if (t) undoToast((n ? n + ' item' + (n > 1 ? 's' : '') + ' deleted' : 'Area cleared') + (who.length ? '. ' + listNames(who) + ' moved out' : ''));
}
function grpToggleAt(x, y) {
  if (!inB(plan, x, y)) return; const k = y * plan.w + x, G = newGrp(grpOf());
  const pile = [...shownStack(k).map(q => ({ q, key: topOf(q), lv: zOf(q) })), ...rugsOf(plan).filter(r => rugShown(r) && overlaps(r, x, y, 1, 1)).map(q => ({ q, key: zOf(q) - 0.5, lv: zOf(q) }))].sort((a, b) => b.key - a.key);
  const at = layerZ != null ? pile.findIndex(e => e.lv === layerZ) : -1; if (at > 0) pile.unshift(pile.splice(at, 1)[0]);
  const set = (q) => q.rug ? G.rugs : G.ids, mem = pile.find(e => set(e.q).has(e.q.id));
  if (mem) set(mem.q).delete(mem.q.id); else if (pile.length) set(pile[0].q).add(pile[0].q.id); else return;
  grpSelect(G);
}
function grpSelect(G) {
  const { objs, rugs } = grpLive(G); G.ids = new Set(objs.map(q => q.id)); G.rugs = new Set(rugs.map(q => q.id));
  if (!G.boxes.length && objs.length + rugs.length <= 1) { if (objs.length) { selection = { obj: objs[0] }; showObjInspector(objs[0]); } else if (rugs.length) showRugInspector(rugs[0]); else closeInspector(); return; }
  selection = { group: G }; showGroupInspector();
}
function pickMore() { multiPick = true; renderOptbar(); toast('Tap more items to add them, or a picked one to take it away', 3200, null, 'pick'); }
function showGroupInspector() {
  const G = selection && selection.group; if (!G) return; const { objs, rugs } = grpLive(G), F = grpFrame(G); if (!F) { closeInspector(); return; }
  const n = objs.length + rugs.length, area = G.boxes.length > 0, ground = area && grpGround && lvShown('g') ? grpSnap(G, F).ground.length : 0, kinds = new Map();
  for (const q of [...objs, ...rugs]) kinds.set(q.i, (kinds.get(q.i) || 0) + 1);
  const fine = matchMedia('(pointer: fine)').matches;
  const box = inspectorShell(n ? n + ' item' + (n > 1 ? 's' : '') : 'Area ' + F.w + ' × ' + F.h, null, F.w + ' × ' + F.h + (rugs.length ? ' · ' + rugs.length + ' rug' + (rugs.length > 1 ? 's' : '') : '') + (ground ? ' · ' + ground + ' ground tile' + (ground > 1 ? 's' : '') : '') + (hidden.size ? ' · hidden layers left alone' : ''), 'Drag them, or use Move, to move them together. Residents, roofs and zones inside go with them. ' + (fine ? 'Shift-click adds or takes away an item and Shift-drag adds an area. Arrow keys nudge, Q turns, F flips, Ctrl+D duplicates. ' : '') + 'Pick several lets you tap items in or out.');
  const acts = box.acts, none = { disabled: !n };
  acts.append(ibtn('move', 'Move', () => grpMoveTool(G), 'primary'), ibtn('rotl', 'Turn left', () => grpRun(G, 'ccw')), ibtn('rotate', 'Turn right', () => grpRun(G, 'cw')), ibtn('fliph', 'Flip left to right', () => grpRun(G, 'fx')), ibtn('flipv', 'Flip top to bottom', () => grpRun(G, 'fy')), ibtn('dup', 'Duplicate', () => grpDup(G)), ibtn('copy', 'Copy', () => grpCopy(G)), ibtn('multi', 'Pick several', pickMore), ibtn('up', 'Up a level', () => grpShift(G, 1), '', none), ibtn('down', 'Down a level', () => grpShift(G, -1), '', none), ibtn('zone', 'Make a zone', () => createZone(F)), ibtn('trash', n ? 'Delete' : 'Nothing to delete', () => grpDelete(G, false), 'danger', none));
  if (area) acts.append(ibtn('erase', 'Clear everything, terrain too', () => grpDelete(G, true), 'danger'));
  if (area) box.append(h('label', { class: 'toggle', style: 'margin:6px 0 2px' }, h('input', { type: 'checkbox', checked: grpGround, onchange: (e) => { grpGround = e.target.checked; LS.set('pokopia-planner:grpground', grpGround ? '1' : '0'); showGroupInspector(); } }), 'Ground too', tipBtn('Moving, turning, duplicating and copying take the floors, paths and water in the area along, and fill the gap with the ground around it. Ground that matches its surroundings stays where it is.')));
  if (kinds.size) {
    const list = [...kinds].sort((a, b) => b[1] - a[1] || ITEMS[a[0]].n.localeCompare(ITEMS[b[0]].n)), w = h('div', { class: 'reqs' });
    for (const [i, c] of list.slice(0, 40)) w.append(h('button', { class: 'req kind', type: 'button', 'data-tip': 'Leave out ' + ITEMS[i].n, 'aria-label': 'Leave out ' + ITEMS[i].n, onclick: () => { const g = newGrp(G); for (const q of objs) if (q.i === i) g.ids.delete(q.id); for (const q of rugs) if (q.i === i) g.rugs.delete(q.id); grpSelect(g); } }, swatchEl(ITEMS[i]), h('b', null, c + '×'), ITEMS[i].n));
    if (list.length > 40) w.append(h('span', { class: 'note' }, '+' + (list.length - 40) + ' more kinds'));
    box.append(h('div', { class: 'note', style: 'margin-top:6px' }, 'Tap a kind to leave it out'), w);
  }
  requestDraw();
}
function drawGroupSel(c, s, G) {
  const { objs, rugs } = grpLive(G), F = grpFrame(G); if (!F) return; const X = (x) => view.px + x * s, Y = (y) => view.py + y * s;
  c.save(); c.fillStyle = theme.accent; c.globalAlpha = 0.08; for (const b of G.boxes) c.fillRect(X(b.x), Y(b.y), b.w * s, b.h * s);
  c.globalAlpha = 1; c.strokeStyle = theme.accent; c.lineWidth = 2; for (const q of [...rugs, ...objs]) c.strokeRect(X(q.x) + 1, Y(q.y) + 1, q.w * s - 2, q.h * s - 2);
  c.setLineDash([5, 4]); c.strokeRect(X(F.x) - 2, Y(F.y) - 2, F.w * s + 4, F.h * s + 4); c.restore();
}
function drawSnapPreview(c, s, sn, P, from) {
  const X = (x) => view.px + x * s, Y = (y) => view.py + y * s; c.save();
  if (from) { c.setLineDash([3, 3]); c.lineWidth = 1.5; c.strokeStyle = theme.muted; c.strokeRect(X(from.x) + 0.5, Y(from.y) + 0.5, from.w * s - 1, from.h * s - 1); c.setLineDash([]); }
  if (!P.err) {
    c.globalAlpha = 0.55;
    if (P.put.length <= 4000) for (const [k, , v] of P.put) drawGroundCell(c, ITEMS[v - 1], X(k % plan.w), Y((k / plan.w) | 0), s);
    for (const e of P.rugs) { const it = ITEMS[e.r.i]; if (!drawRug(c, it, X(e.x), Y(e.y), s, e.r.w, e.r.h) && !drawLook(c, it, X(e.x), Y(e.y), s, e.r.w, e.r.h)) { c.fillStyle = picsFor(it)[2] || it.col; c.fillRect(X(e.x), Y(e.y), e.r.w * s, e.r.h * s); } }
    for (const e of [...P.objs].sort((a, b) => a.z - b.z)) drawGhost(c, ITEMS[e.o.i], e.x, e.y, e.o.w, e.o.h, e.z, s, e.o.r == null ? -1 : e.o.r);
    c.globalAlpha = 0.28; c.fillStyle = theme.bad; for (const q of P.gone) if (q) c.fillRect(X(q.x), Y(q.y), q.w * s, q.h * s);
  } else if (P.bad) { c.globalAlpha = 0.3; c.fillStyle = theme.bad; c.fillRect(X(P.bad.x), Y(P.bad.y), P.bad.w * s, P.bad.h * s); }
  c.globalAlpha = 1; c.setLineDash([6, 4]); c.lineWidth = 2; c.strokeStyle = P.err ? theme.bad : theme.accent; c.strokeRect(X(P.ox) + 1, Y(P.oy) + 1, sn.w * s - 2, sn.h * s - 2); c.restore();
}

function createZone(r) {
  const n = plan.zones.filter(z => z.kind === zoneKind).length + 1;
  const z = { id: uid(), kind: zoneKind, x: r.x, y: r.y, w: r.w, h: r.h, name: zoneKind === 'house' ? 'House ' + n : zoneKind === 'label' ? 'Area ' + n : 'Zone ' + n, target: null };
  setZones([...plan.zones, z]); commitTx('Add zone'); selectZone(z);
}
function kitHomesList(hs) {
  const l = h('div', { class: 'list' });
  for (const ob of hs.kitHomes) { const it = ITEMS[ob.i], hm = kitHome(ob), n = residentsOf(hm).length; l.append(h('div', { class: 'row', style: 'cursor:default' }, swatchEl(it), h('span', { class: 'meta' }, h('div', { class: 'nm' }, it.n.replace(/ kit$/, '')), h('div', { class: 'ds' }, n + '/' + it.cap + ' living · ' + (splitFloors(hm) ? kitFurniture(ob, 0) + ' + ' + kitFurniture(ob, 1) : kitFurniture(ob)) + ' furniture')), ibtn('sofa', 'Decorate inside', () => interiorEditor(ob), 'sm'))); }
  return l;
}
function selectHouse(hs) {
  selection = { house: hs.id };
  if (hs.enclosure) {
    const box = inspectorShell('Walled enclosure', null, hs.w + '×' + hs.h + ' · ' + hs.kitHomes.length + ' kit home' + (hs.kitHomes.length > 1 ? 's' : ''), 'Too big to be a house itself (a house is at most 9×10 inside), but kit homes can sit inside it. Each one stays a home of its own, with its own residents and interior.');
    box.acts.append(ibtn('select', 'Select all of it', () => { const cur = houseById.get(hs.id); if (cur) grpSelect(houseGroup(cur)); }), ibtn('trash', 'Delete enclosure', () => confirmDeleteHouse(hs), 'danger'));
    box.append(kitHomesList(hs)); requestDraw(); return;
  }
  const box = inspectorShell('House you built', null, hs.w + '×' + hs.h + ' inside · ' + hs.interior + ' tiles', 'Found automatically: walls or fences all round, a door or gate, 2×2 to 9×10 inside and 3 kinds of furniture at the door\'s level. Walls can be 1 block high; make them 3 or more to walk inside.');
  { const hm = houseHome(hs), n = residentsOf(hm).length; if (n < hm.cap) box.acts.append(ibtn('useradd', 'Add resident', () => residentPicker(hm), 'primary')); if (n) box.acts.append(ibtn('sofa', 'Decorate for them', () => decorModal(hm))); }
  box.acts.append(ibtn('select', 'Select all of it', () => { const cur = houseById.get(hs.id); if (cur) grpSelect(houseGroup(cur)); }), ibtn('trash', 'Delete house', () => confirmDeleteHouse(hs), 'danger'));
  const ck = (ok, t, tip) => h('span', { class: 'req ' + (ok ? 'ok' : 'miss'), 'data-tip': tip }, (ok ? '✓ ' : '✗ ') + t);
  box.append(h('div', { class: 'reqs' }, hs.ok ? h('span', { class: 'chip good', 'data-tip': 'Up to 4 Pokémon can live here' }, h('span', { class: 'dot' }), 'Habitable') : h('span', { class: 'chip warn', 'data-tip': 'Not a home yet: ' + houseIssues(hs).join(', ') }, h('span', { class: 'dot' }), 'Not a home yet'),
    ck(true, 'Walls', 'Closed in by walls or fences'), ck(hs.clearDoors > 0, 'Door', !hs.doors.size ? 'Add a door or gate in the wall' : hs.clearDoors ? 'A door or gate, with the way in clear' : 'Clear the block just outside the door'), ck(hs.sizeOk, 'Size', 'Inside must be 2×2 to 9×10'), ck(hs.furn >= 3, 'Furniture ' + Math.min(hs.furn, 3) + '/3', 'Kinds of furniture inside, standing at the door\'s level: a house needs 3. Things higher up, on the walls or just outside still count for comfort.')));
  const ct = areaContents(hs.area), inside = floorItems(hs);
  box.append(h('div', { class: 'note hrow', style: 'margin-top:6px' }, icon('area'), 'Area ' + hs.area.rect.w + '×' + hs.area.rect.h + ' · ' + ct.n + ' item' + (ct.n === 1 ? '' : 's') + ' (' + inside + ' inside)', tipBtn(areaSummary(hs.area) + (ct.n ? ' In it: ' + [...ct.out].map(([c, n]) => n + ' ' + c).join(', ') + '.' : ''))));
  if (hs.kitHomes.length) box.append(h('div', { class: 'section' }, h('div', { class: 'hrow' }, h('b', null, 'Kit homes inside'), tipBtn('Homes of their own: they don\'t count as this house\'s furniture.')), kitHomesList(hs)));
  { const D = houseDaylight(hs), old = roofOf(hs), full = D.roofed === D.floor;
    const row = h('div', { class: 'roofline' }, h('b', null, 'Roof'), h('span', { class: 'note' }, full ? 'All of the floor' : D.roofed ? D.roofed + ' of ' + D.floor + ' floor tiles' : 'None'), h('span', { class: 'note' }, '☀ ' + envNum(D.v)),
      tipBtn('Daylight = 90 × ' + D.open + ' floor tiles open to the sky ÷ ' + D.total + ' tiles of house, walls included. A floor tile is roofed when a block, wall or roof piece sits anywhere above it with a gap under it, or when a stack of 4 blocks stands on it. A block standing on the floor, and furniture, never roof. To see inside a roofed house, hide the roof\'s level in Layers.'));
    if (!full) row.append(h('button', { class: 'btn sm', 'data-tip': 'Lays the walls\' blocks over the whole house, one level above the walls', onclick: () => buildRoof(hs) }, 'Build a roof'));
    box.append(row);
    if (old != null) box.append(h('p', { class: 'note', style: 'margin:6px 0 0' }, 'This house had the old Roof setting (' + ROOF_WORD[old] + '). Roofs now come from blocks over the house, so only tiles with a block over them count as roofed. ', h('button', { class: 'lnk', onclick: () => { setRoofs((plan.roofs || []).filter(r => !hs.cells.has(r.y * plan.w + r.x))); commitTx('Forget the roof setting'); selectHouse(houseById.get(hs.id) || hs); } }, 'Forget it')));
  }
  box.append(residentsSection(houseHome(hs)));
  box.append(boxLine('house:' + hs.id));
  requestDraw();
}
function roofPlan(hs) {
  const base = hs.area.base, D = houseDaylight(hs), mat = new Map(), lv = new Map(); let top = base;
  for (const k of D.all) {
    for (const ob of stackAt(k)) {
      const it = ITEMS[ob.i], z = zOf(ob); if (topOf(ob) < base) continue;
      if (!hs.cells.has(k) || hs.doors.has(k)) { if (structural(it) && z <= base + 3) { top = Math.max(top, topOf(ob)); if (isWall(it) && it.c === 'Blocks') mat.set(ob.i, (mat.get(ob.i) || 0) + 1); } continue; }
      if (roofish(it) && z > base) lv.set(z, (lv.get(z) || 0) + 1); else if (!roofish(it)) top = Math.max(top, topOf(ob));
    }
  }
  const m = [...mat].sort((a, b) => b[1] - a[1])[0], l = [...lv].sort((a, b) => b[1] - a[1])[0];
  return { z: l && l[0] > top ? l[0] : top + 1, i: m ? m[0] : BY_NAME.get('Wooden wall').i, cells: D.all };
}
function buildRoof(hs) {
  const R = roofPlan(hs), base = hs.area.base; let n = 0;
  for (const k of R.cells) {
    if (hs.cells.has(k) && roofedAt(k, base)) continue;
    if (occAt(plan, k, R.z) || terrAt(plan, k, R.z)) continue;
    if (addObj(R.i, k % plan.w, (k / plan.w) | 0, 1, 1, R.z, 1)) n++;
  }
  if (roofOf(hs) != null) setRoofs((plan.roofs || []).filter(r => !hs.cells.has(r.y * plan.w + r.x)));
  if (!commitTx('Build a roof')) { toast('There\'s no room for a roof over this house'); return; }
  undoToast(n ? 'Roofed with ' + n + ' ' + ITEMS[R.i].n + ' blocks at level ' + R.z + '. Hide that level in Layers to see inside.' : 'Old roof setting forgotten');
  const nh = houseAt(hs.anchor % plan.w, (hs.anchor / plan.w) | 0); selectHouse(nh || houseById.get(hs.id) || hs);
}
function selectZone(z) {
  selection = { zone: z }; evaluateAll(); const r = zoneStatus.get(z.id);
  const box = inspectorShell(z.name || 'Zone', null, (z.kind === 'house' ? 'House' : z.kind === 'label' ? 'Label' : 'Habitat zone') + ' · ' + z.w + '×' + z.h,
    z.kind === 'habitat' ? 'Place habitat items inside, or pick a target habitat for a checklist. The game forms one habitat per cluster.' : z.kind === 'house' ? 'A finished house holds up to 4 Pokémon. Draw the zone over the walls you built.' : '');
  const nameIn = h('input', { id: 'zName', value: z.name || '', 'aria-label': 'Zone name', placeholder: 'Name' });
  nameIn.onchange = () => { setZones(plan.zones.map(q => q === z ? Object.assign({}, z, { name: nameIn.value }) : q)); commitTx('Rename zone'); const nz = plan.zones.find(q => q.id === z.id); selection = { zone: nz }; };
  box.append(h('div', { class: 'field', style: 'margin-top:8px' }, nameIn));
  const rows = (rr) => h('div', { class: 'reqs' }, rr.rows.map(rw => h('span', { class: 'req ' + (rw.have >= rw.q ? 'ok' : 'miss') }, h('b', null, Math.min(rw.have, rw.q) + '/' + rw.q), rw.tok)));
  if (z.kind === 'habitat') {
    const sel = h('select', { id: 'zTarget', 'aria-label': 'Target habitat' }, h('option', { value: '' }, 'Target: detect automatically'), HAB.map(hb => h('option', { value: hb.id, selected: z.target === hb.id }, '#' + hb.id + ' ' + hb.n)));
    sel.onchange = () => { const nz = Object.assign({}, z, { target: sel.value || null }); setZones(plan.zones.map(q => q.id === z.id ? nz : q)); commitTx('Set habitat'); selectZone(nz); };
    box.append(h('div', { class: 'field' }, sel));
    if (r.target) {
      box.append(rows(r.tr));
      if (!r.allowed) box.append(h('div', { class: 'note', style: 'color:var(--warn)', 'data-tip': 'This habitat is limited to another area' }, '⚠ Only in ' + (r.target.note || r.target.reg)));
    }
    if (r.ok) { const free = r.best.hb.p.filter(n => !homeOfPokemon(n)), hh = free.length ? habitatHome(z) : null; if (hh) { const S = homeStuff(hh), E = envOf(hh); box.append(cmfBlock(free.map(n => PK_BY_NAME.get(n)).filter(Boolean).map(p => comfortOf(p, hh, null, S, E)), 'Living here', openPokemon, 'They live here until you give them a house, one in the habitat at a time. ')); } }
    if (r.ok) box.append(h('div', null, h('span', { class: 'chip good' }, h('span', { class: 'dot' }), r.best.hb.n), ' ', h('div', { class: 'note', style: 'margin-top:6px' }, 'Attracts'), pkChips(r.best.hb.p, 22, openPokemon)), boxLine('zone:' + z.id));
    else if (!r.target && r.near) { box.append(h('div', { class: 'note' }, 'Closest: ' + r.near.hb.n)); box.append(rows(r.near.r)); }
    if (r.matches.length > 1) box.append(h('div', { class: 'note hrow' }, 'Also fits: ' + r.matches.slice(1, 5).map(m => m.hb.n).join(', '), tipBtn('The game forms one habitat per cluster.')));
    const hh = habitatHome(z); if (hh && hh.pks.some(p => p.ideal)) box.append(envSection(hh));
    if (r.ok) for (const el of workLines('zone:' + z.id, { kind: 'habitat' })) box.append(el);
  } else if (z.kind === 'house') {
    const ck = (ok, t, tip) => h('span', { class: 'req ' + (ok ? 'ok' : 'miss'), 'data-tip': tip }, (ok ? '✓ ' : '✗ ') + t);
    box.append(h('div', { class: 'reqs' }, ck(r.sizeOk, 'Size', 'Inside 2×2 to 9×10'), ck(r.walls > 0, 'Walls', 'Walls or fences'), ck(r.door, 'Door', 'A door or gate'), ck(r.furn >= 3, 'Furniture ' + Math.min(r.furn, 3) + '/3', 'Furniture pieces: a house needs 3')));
  }
  if (r.area) { const ct = areaContents(r.area); box.append(h('div', { class: 'note hrow', style: 'margin-top:6px' }, icon('area'), 'Area ' + r.area.rect.w + '×' + r.area.rect.h + ' · ' + ct.n + ' other item' + (ct.n === 1 ? '' : 's'), tipBtn(areaSummary(r.area) + ' Favourite things placed in it raise comfort; anything outside has no effect.' + (ct.n ? ' In it: ' + [...ct.out].map(([c, n]) => n + ' ' + c).join(', ') + '.' : '')))); }
  if (z.kind === 'habitat' && (z.target || (r.near && !r.ok))) box.acts.append(ibtn('stamp', 'Add the missing items', () => fillZoneMissing(z), 'primary'));
  box.acts.append(ibtn('select', 'Select what\'s in it', () => grpSelect(boxGroup(z))), ibtn('trash', z.kind === 'habitat' ? 'Delete habitat' : 'Delete zone', () => confirmDeleteZone(z), 'danger'));
  requestDraw();
}

function* spiral(cx, cy, maxR) { yield [cx, cy]; for (let r = 1; r <= maxR; r++) { for (let dx = -r; dx <= r; dx++) yield [cx + dx, cy - r]; for (let dy = -r + 1; dy <= r; dy++) yield [cx + r, cy + dy]; for (let dx = r - 1; dx >= -r; dx--) yield [cx + dx, cy + r]; for (let dy = r - 1; dy >= -r + 1; dy--) yield [cx - r, cy + dy]; } }
function concreteReqs(hb, have) {
  const out = [];
  for (const [tok, q] of hb.r) {
    const need = Math.max(0, q - (have ? reqHave(have, tok) : 0)); if (!need) continue;
    if (DATA.terrainReq[tok]) out.push({ terrain: BY_NAME.get(DATA.terrainReq[tok]), n: need });
    else if (tok === 'High-up location') out.push({ high: true, n: 1 });
    else if (GROUPS.has(tok)) out.push({ item: BY_NAME.get(DATA.defaults[tok]) || ITEMS[[...GROUPS.get(tok)][0]], n: need });
    else if (BY_NAME.has(tok)) out.push({ item: BY_NAME.get(tok), n: need });
  }
  return out;
}
function layOut(reqs, cx, cy, used) {
  const placed = []; let first = null;
  const big = reqs.filter(r => r.item && (r.item.w > 1 || r.item.h > 1));
  for (const r of big) for (let n = 0; n < r.n; n++) { for (const [x, y] of spiral(cx, cy, 14)) { if (!inB(plan, x, y)) continue; const z = standOver(x, y, r.item.w, r.item.h); if (fits(plan, x, y, r.item.w, r.item.h, 0, z)) { const ob = addObj(r.item.i, x, y, 0, 0, z); if (ob) { placed.push([x, y, ob.w, ob.h]); for (let yy = y; yy < y + ob.h; yy++) for (let xx = x; xx < x + ob.w; xx++) used.add(yy * plan.w + xx); } break; } } }
  for (const r of reqs.filter(r => r.terrain)) { let n = r.n; for (const [x, y] of spiral(cx, cy, 14)) { if (!n) break; if (!inB(plan, x, y)) continue; const k = y * plan.w + x; if (used.has(k) || occAt(plan, k, standZ(k))) continue; const t = topTerr(k), tz = t == null ? 0 : t; if (terrAt(plan, k, tz) === r.terrain.i + 1) { used.add(k); placed.push([x, y, 1, 1]); n--; continue; } setTerr(k, tz, r.terrain.i + 1); used.add(k); placed.push([x, y, 1, 1]); n--; } }
  for (const r of reqs.filter(r => r.item && r.item.w === 1 && r.item.h === 1)) { let n = r.n; for (const [x, y] of spiral(cx, cy, 14)) { if (!n) break; if (!inB(plan, x, y)) continue; const k = y * plan.w + x, z = standZ(k); if (used.has(k) || occAt(plan, k, z)) continue; const g = surfAt(k); if (g && LIQUID.has(ITEMS[g - 1].n)) continue; if (addObj(r.item.i, x, y, 1, 1, z)) { used.add(k); placed.push([x, y, 1, 1]); if (first == null) first = k; n--; } } }
  if (reqs.some(r => r.high) && first != null) { const base = Math.min(...placed.map(([x, y]) => { const t = topTerr(y * plan.w + x); return t == null ? 0 : t; })); raiseCell(first, base + 2); }
  return placed;
}
function raiseCell(k, top) {
  const t = topTerr(k), from = t == null ? 0 : t, v = (t == null ? 0 : terrAt(plan, k, t)) || BY_NAME.get('Ordinary soil').i + 1, dz = top - from; if (dz <= 0) return;
  const above = stackAt(k).filter(q => q && zOf(q) > from && q.w === 1 && q.h === 1); for (const q of above) delObj(q);
  for (let z = from + 1; z <= top; z++) setTerr(k, z, v); carry(above, 0, 0, dz);
}
function stampCore(hb, cx, cy) {
  const reqs = concreteReqs(hb, null); const placed = layOut(reqs, cx, cy, new Set());
  if (!placed.length) return null;
  const x0 = Math.min(...placed.map(p => p[0])), y0 = Math.min(...placed.map(p => p[1])), x1 = Math.max(...placed.map(p => p[0] + p[2])), y1 = Math.max(...placed.map(p => p[1] + p[3]));
  return { id: uid(), kind: 'habitat', x: x0, y: y0, w: x1 - x0, h: y1 - y0, name: hb.n, target: hb.id };
}
function stampHabitat(hb, cx, cy) {
  if (!inB(plan, cx, cy)) return;
  const z = stampCore(hb, cx, cy);
  if (!z) { tx = null; toast('No free space here'); return; }
  setZones([...plan.zones, z]); commitTx('Stamp ' + hb.n);
  setTool(S.tool); selectZone(z);
  if (!habitatAllowed(hb)) toast(hb.n + ' only forms in ' + (hb.reg === 'Basin' ? 'Bubbly Basin' : 'another area'), 3200);
}
function fillZoneMissing(z) {
  const r = zoneStatus.get(z.id); const hb = r.target || (r.near && r.near.hb); if (!hb) return; const c = zoneCounts(z);
  const reqs = concreteReqs(hb, c); if (!reqs.length) { toast('Nothing missing'); return; }
  const used = new Set(); const placed = layOut(reqs, z.x + (z.w >> 1), z.y + (z.h >> 1), used);
  let nz = Object.assign({}, z, { target: hb.id });
  if (placed.length) { const x0 = Math.min(z.x, ...placed.map(p => p[0])), y0 = Math.min(z.y, ...placed.map(p => p[1])), x1 = Math.max(z.x + z.w, ...placed.map(p => p[0] + p[2])), y1 = Math.max(z.y + z.h, ...placed.map(p => p[1] + p[3])); nz = Object.assign(nz, { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }); }
  setZones(plan.zones.map(q => q.id === z.id ? nz : q)); commitTx('Add missing items'); selectZone(nz);
}

let activeTab = 'build';
const VALID_TABS = ['build', 'layers', 'materials', 'habitats', 'pokemon', 'plans'];
const phoneUI = () => innerWidth < 900;
function toMap() { if (phoneUI() && sheetState !== 'peek') setSheet('peek'); }
function openTab(t, stop = S.sheet) { showTab(t); if (phoneUI() && sheetState === 'peek') setSheet(stop); }
function openBuild() { const it = currentItem(); if (it && !buildQuery && buildCat !== it.c) buildCat = it.c; openTab('build', 'half'); setTimeout(() => { const r = $('#tab-build .row[aria-pressed="true"]'); if (r) r.scrollIntoView({ block: 'nearest' }); }, 80); }
function showTab(t, fromHash) {
  if (!VALID_TABS.includes(t)) t = 'build'; activeTab = t;
  $$('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t ? 'true' : 'false'));
  for (const v of VALID_TABS) $('#tab-' + v).hidden = v !== t;
  if (!fromHash) { try { history.replaceState(null, '', '#' + t); } catch (e) { location.hash = t; } }
  LS.set(LSK + 'tab', t); renderPanel();
}
$$('.tab').forEach(b => b.onclick = () => { if (innerWidth < 900) { if (activeTab === b.dataset.tab && sheetState !== 'peek') setSheet('peek'); else if (sheetState === 'peek') setSheet(S.sheet); } showTab(b.dataset.tab); });
addEventListener('hashchange', () => { if (location.hash === '#review') { openReview(); return; } if (RV.on) closeReview(true); showTab(location.hash.slice(1), true); });
let sheetState = 'peek';
const SHEET_ORDER = ['peek', 'half', 'full'];
function sheetStops() {
  const panel = $('#panel'), main = $('.main').getBoundingClientRect(), top = $('.top').getBoundingClientRect().bottom;
  const peek = Math.round($('.tabs').getBoundingClientRect().bottom - panel.getBoundingClientRect().top) || 72;
  const full = Math.max(peek, Math.round(main.bottom - top));
  return { peek, half: clamp(Math.round(main.height * 0.46), peek, full), full };
}
let sheetFull = 0, shutTimer = 0;
function setSheet(s) {
  sheetState = s; const root = document.documentElement, st = sheetStops(), panel = $('#panel'), jump = st.full !== sheetFull;
  clearTimeout(shutTimer); if (s !== 'peek') panel.classList.remove('shut'); else if (jump || calm()) panel.classList.add('shut'); else shutTimer = setTimeout(() => { if (sheetState === 'peek' && !panel.classList.contains('dragging')) panel.classList.add('shut'); }, 400);
  sheetFull = st.full; if (jump) panel.classList.add('dragging');
  root.style.setProperty('--sheet-full', st.full + 'px'); root.style.setProperty('--sheet-h', st[s] + 'px'); root.dataset.sheet = s;
  if (jump) { panel.getBoundingClientRect(); panel.classList.remove('dragging'); }
  $('#handle').setAttribute('aria-label', s === 'full' ? 'Close panel' : 'Open panel further');
}
(() => {
  const panel = $('#panel'), hd = $('#handle'), tabs = $('.tabs'), mw = $('#mapwrap');
  const phone = () => innerWidth < 900;
  let d = null, raf = 0, quietUntil = 0;
  const shown = () => Math.round($('.main').getBoundingClientRect().bottom - panel.getBoundingClientRect().top);
  const begin = (y, t) => { clearTimeout(shutTimer); panel.classList.remove('shut'); d = { y0: y, h0: shown(), from: sheetState, st: sheetStops(), pts: [[t, y]], h: 0, far: 0 }; d.h = d.h0; panel.classList.add('dragging'); mw.classList.add('sheetdrag'); paint(); };
  const paint = () => { raf = 0; if (!d) return; panel.style.transform = 'translate3d(0,' + (d.st.full - d.h) + 'px,0)'; mw.style.setProperty('--sheet-h', d.h + 'px'); };
  const move = (y, t) => {
    d.h = clamp(d.h0 - (y - d.y0), d.st.peek, d.st.full); d.far = Math.max(d.far, Math.abs(y - d.y0));
    d.pts.push([t, y]); while (d.pts.length > 2 && t - d.pts[0][0] > 90) d.pts.shift();
    if (!raf) raf = requestAnimationFrame(paint);
  };
  const end = (cancel, t) => {
    if (!d) return; const { st, h0, h: hh, pts, from, far } = d; d = null;
    if (raf) cancelAnimationFrame(raf); raf = 0;
    const [ta, ya] = pts[0], [tb, yb] = pts[pts.length - 1];
    const v = tb > ta && t - tb < 90 ? (ya - yb) / (tb - ta) : 0;
    let target = from;
    if (!cancel) {
      if (Math.abs(v) > 0.5) target = v > 0 ? 'full' : 'peek';
      else {
        const proj = hh + v * 200;
        target = SHEET_ORDER.reduce((a, b) => Math.abs(st[b] - proj) < Math.abs(st[a] - proj) ? b : a);
        if (target === from && Math.abs(hh - h0) > 56) target = SHEET_ORDER[clamp(SHEET_ORDER.indexOf(from) + Math.sign(hh - h0), 0, 2)];
      }
    }
    panel.classList.remove('dragging'); mw.classList.remove('sheetdrag');
    panel.style.transform = ''; mw.style.removeProperty('--sheet-h');
    setSheet(target);
    if (far >= 10) quietUntil = performance.now() + 400;
  };
  hd.onclick = () => setSheet(sheetState === 'peek' ? 'half' : sheetState === 'half' ? 'full' : 'peek');
  panel.addEventListener('click', e => { if (performance.now() < quietUntil) { e.stopPropagation(); e.preventDefault(); } }, true);
  const grab = (e) => {
    if (!phone() || d || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const id = e.pointerId, y0 = e.clientY, el = e.currentTarget; let on = false;
    const mv = (ev) => { if (ev.pointerId !== id) return; if (!on) { if (Math.abs(ev.clientY - y0) < 6) return; on = true; begin(y0, e.timeStamp); try { el.setPointerCapture(id); } catch (er) { } } move(ev.clientY, ev.timeStamp); };
    const up = (ev) => { if (ev.pointerId !== id) return; removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); if (on) end(ev.type === 'pointercancel', ev.timeStamp); };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  };
  hd.addEventListener('pointerdown', grab); tabs.addEventListener('pointerdown', grab);
  let tc = null;
  panel.addEventListener('touchstart', e => {
    tc = null; if (!phone() || d || e.touches.length !== 1) return;
    const body = e.target.closest('.tabbody'); if (!body || e.target.closest('input[type=range],textarea,.pkgrip')) return;
    tc = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: e.timeStamp, body, on: false };
  }, { passive: true });
  panel.addEventListener('touchmove', e => {
    if (pkDrag || dd) { if (e.cancelable) e.preventDefault(); tc = null; return; }
    if (!tc) return; const t = e.touches[0];
    if (!tc.on) {
      const dx = t.clientX - tc.x, dy = t.clientY - tc.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 5) return;
      const mine = e.cancelable && Math.abs(dy) > Math.abs(dx) && (dy < 0 ? sheetState !== 'full' : tc.body.scrollTop <= 0);
      if (!mine) { tc = null; return; }
      tc.on = true; begin(tc.y, tc.t);
    }
    e.preventDefault(); move(t.clientY, e.timeStamp);
  }, { passive: false });
  const lift = (e) => { if (tc && tc.on) end(e.type === 'touchcancel', e.timeStamp); tc = null; };
  panel.addEventListener('touchend', lift); panel.addEventListener('touchcancel', lift);
  addEventListener('resize', () => { if (phone() && !d) setSheet(sheetState); });
  let fitted = '';
  const refit = () => { idle(requestDraw, 1000); if (!phone() || d) return; const st = sheetStops(), k = st.peek + ',' + st.full; if (k !== fitted) { fitted = k; setSheet(sheetState); } };
  if (document.fonts) { document.fonts.ready.then(refit); document.fonts.addEventListener('loadingdone', refit); }
})();

let renderQueued = false;
function renderPanel() { if (renderQueued) return; renderQueued = true; requestAnimationFrame(() => { renderQueued = false; const f = { build: renderBuild, layers: renderLayers, materials: renderMaterials, habitats: renderHabitats, pokemon: renderPokemon, plans: renderPlans }[activeTab]; if (f) f(); }); }

function levelStats() {
  const n = new Map(), kinds = new Map(), t = new Map(), tk = new Map(); let all = 0;
  for (const ob of [...plan.objs.values(), ...plan.rugs.values()]) { const z = zOf(ob); n.set(z, (n.get(z) || 0) + 1); let m = kinds.get(z); if (!m) kinds.set(z, m = new Map()); m.set(ob.i, (m.get(ob.i) || 0) + 1); }
  for (let j = 0; j < plan.tz.length; j++) { const z = plan.tz[j], T = plan.tt[j], m = new Map(); let c = 0; for (let k = 0; k < T.length; k++) if (T[k]) { c++; m.set(T[k] - 1, (m.get(T[k] - 1) || 0) + 1); } if (c) { t.set(z, c); tk.set(z, m); all += c; } }
  return { n, kinds, t, tk, all };
}
function levelList(st) {
  const want = new Set([0, ...st.n.keys(), ...st.t.keys()]); for (const v of hidden) if (Number.isInteger(v)) want.add(v); if (layerZ != null) want.add(layerZ);
  let lo = 0, hi = 0; for (const z of want) { lo = Math.min(lo, z); hi = Math.max(hi, z); }
  if (hi < ZMAX) want.add(hi + 1); if (lo > ZMIN) want.add(lo - 1);
  return [...want].sort((a, b) => b - a);
}
function levelDialog() {
  let inp; const go = () => { const v = Math.round(Number(inp.value)); if (inp.value.trim() === '' || !Number.isFinite(v) || v < ZMIN || v > ZMAX) { toast('Pick a level from ' + lvNum(ZMIN) + ' to ' + ZMAX, 2400, null, 'level'); return false; } setLayerZ(v); toast('Working on level ' + lvNum(v), 2400, null, 'level'); };
  modal('Go to level', (box) => {
    inp = h('input', { type: 'number', id: 'lvGo', min: ZMIN, max: ZMAX, step: 1, value: layerZ == null ? 0 : layerZ, onkeydown: (e) => { if (e.key === 'Enter' && go() !== false) closeModal(); } });
    const step = (d) => { const v = clamp((Math.round(Number(inp.value)) || 0) + d, ZMIN, ZMAX); inp.value = v; };
    box.append(h('p', { class: 'sub' }, 'Any level from ' + lvNum(ZMIN) + ' to ' + ZMAX + '. 0 stands on the ground, below 0 is under it. Place, Fill and Erase then work on that level.'),
      h('div', { class: 'field' }, h('label', { for: 'lvGo' }, 'Level'), h('div', { class: 'lvgo' }, ibtn('minus', 'One down', () => step(-1)), inp, ibtn('plus', 'One up', () => step(1)))));
  }, 'Work on it', go);
}
function openLayers() { openTab('layers', 'half'); }
function renderLayers() {
  const root = $('#tab-layers'); root.textContent = ''; if (!plan) return;
  const st = levelStats(), levels = levelList(st);
  const plural = (k, w) => k + ' ' + w + (k === 1 ? '' : 's');
  const eye = (key) => { const off = hidden.has(key), t = (off ? 'Show ' : 'Hide ') + lvName(key).toLowerCase(); return h('button', { class: 'eye', type: 'button', 'aria-pressed': off ? 'false' : 'true', 'aria-label': t, 'data-tip': t, onclick: () => setHidden(key, !off) }, icon(off ? 'eyeoff' : 'eye')); };
  const line = (key, badge, name, ds, pick) => h('div', { class: 'lyr' + (key != null && hidden.has(key) ? ' off' : '') }, key != null ? eye(key) : h('span', { class: 'gap' }),
    h(pick ? 'button' : 'div', pick ? { class: 'row', type: 'button', 'aria-pressed': pick.on ? 'true' : 'false', onclick: pick.fn } : { class: 'row' }, h('span', { class: 'lvl' }, badge), h('span', { class: 'meta' }, h('div', { class: 'nm' }, name), h('div', { class: 'ds' }, ds))));
  root.append(h('h2', { class: 'hrow' }, 'Layers', tipBtn('Each level is a layer, as in a drawing app, and holds its terrain blocks as well as its items: every block takes one level. Terrain starts at level 0, so things standing on the ground are on level 1. Tap the eye to hide or show one: hidden layers aren\'t drawn and can\'t be tapped, but they still count for houses, habitats and comfort. Tap a level to work on it: Place and Fill put things on it, everything above it fades out, Erase only takes them from it, and Select picks them first. Levels go from ' + lvNum(ZMIN) + ' to ' + ZMAX + '.')));
  const list = h('div', { class: 'list' });
  list.append(line(null, icon('layers'), 'On top', 'New things stack on what\'s there', { on: layerZ == null, fn: () => workOn(null) }));
  levels.forEach((z, j) => {
    const cnt = st.n.get(z) || 0, tc = st.t.get(z) || 0, kinds = new Map([...(st.kinds.get(z) || new Map()), ...(st.tk.get(z) || new Map())]), names = [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([i]) => ITEMS[i].n), more = kinds.size - names.length;
    const ds = cnt || tc ? [cnt ? plural(cnt, 'item') : '', tc ? plural(tc, 'terrain block') : ''].filter(Boolean).join(', ') + ' · ' + names.join(', ') + (more > 0 ? ' +' + more : '') : 'Empty';
    list.append(line(z, lvNum(z), 'Level ' + lvNum(z) + (z === 0 ? ' · ground' : z === 1 ? ' · ground floor' : ''), ds, { on: layerZ === z, fn: () => workOn(layerZ === z ? null : z) }));
    const next = levels[j + 1], gap = next == null ? 0 : z - next - 1;
    if (gap > 0) list.append(h('div', { class: 'lyrgap' }, gap === 1 ? 'Level ' + lvNum(z - 1) + ' · empty' : 'Levels ' + lvNum(next + 1) + ' to ' + lvNum(z - 1) + ' · empty'));
  });
  list.append(line('r', icon('rect'), 'Rugs', plan.rugs.size ? plural(plan.rugs.size, 'rug') : 'None'));
  list.append(line('g', icon('map'), 'All terrain', st.all ? plural(st.all, 'terrain block') + ' on every level' : 'None'));
  root.append(list);
  const foot = h('div', { class: 'lyrfoot' });
  foot.append(h('button', { class: 'btn sm', type: 'button', onclick: levelDialog }, icon('layers'), 'Go to level'));
  if (layerZ != null) foot.append(h('span', { class: 'pill' }, h('span', { class: 'lbl' }, 'Already on level ' + lvNum(layerZ)), segmented([[false, 'Keep'], [true, 'Replace']], layerReplace, v => { layerReplace = v; renderOptbar(); requestDraw(); renderLayers(); }, 'Items already on level ' + lvNum(layerZ))));
  if (hidden.size) foot.append(h('button', { class: 'btn sm', type: 'button', onclick: showAllLayers }, icon('eye'), 'Show all'));
  if (foot.childNodes.length) root.append(foot);
}
let buildCat = 'Terrain', buildQuery = '';
function renderBuild(keepFocus) {
  const root = $('#tab-build');
  if (!root.dataset.ready) {
    root.dataset.ready = '1';
    root.append(h('h2', { class: 'hrow' }, 'Build', tipBtn(ITEMS.length.toLocaleString() + ' placeable things from the game: terrain, plants, furniture, blocks and kits. Pick one, then paint or tap on the map.')));
    const inp = h('input', { id: 'itemSearch', type: 'search', placeholder: 'Search items or materials', autocomplete: 'off' });
    inp.oninput = () => { clearTimeout(buildTimer); buildTimer = setTimeout(() => { const q = inp.value.trim().toLowerCase(); if (q !== buildQuery) { buildQuery = q; renderBuildList(); } }, 120); };
    inp.onkeydown = (e) => { if (e.key === 'Enter') { clearTimeout(buildTimer); const q = inp.value.trim().toLowerCase(); if (q !== buildQuery) { buildQuery = q; renderBuildList(); } inp.blur(); } };
    root.append(h('div', { class: 'searchrow' }, h('label', { class: 'search' }, icon('search'), inp), h('button', { class: 'btn sm', id: 'sizesBtn', 'data-tip': 'Check item sizes', onclick: () => sizesReview() }, icon('resize'), 'Sizes')));
    root.append(h('div', { class: 'cats', id: 'buildCats', role: 'group', 'aria-label': 'Categories' }));
    root.append(h('div', { class: 'list', id: 'buildList' }));
  }
  const cats = $('#buildCats'); cats.textContent = '';
  const counts = {}; for (const it of ITEMS) counts[it.c] = (counts[it.c] || 0) + 1;
  for (const c of CAT_ORDER) if (counts[c]) cats.append(h('button', { class: 'cat', 'aria-pressed': c === buildCat ? 'true' : 'false', onclick: () => { buildCat = c; renderBuild(); } }, CAT_META[c].label, h('span', { class: 'n' }, counts[c])));
  renderBuildList();
}
const BUILD_STEP = 24, BUILD_MAX = 400;
let buildRows = { key: null, arr: [], shown: 0, lastSub: null }, buildTimer = 0, buildObs = null;
function renderBuildList() {
  const list = $('#buildList'), q = buildQuery, key = q ? 'q:' + q : 'c:' + buildCat;
  const keep = buildRows.key === key ? buildRows.shown : 0;
  let arr = ITEMS.filter(it => q ? (it.key.includes(q) || (it.sub || '').toLowerCase().includes(q) || (it.m || []).some(([m]) => m.toLowerCase().includes(q))) : it.c === buildCat);
  if (q) arr.sort((a, b) => (b.key.startsWith(q) - a.key.startsWith(q)) || a.n.localeCompare(b.n));
  list.textContent = ''; buildRows = { key, arr, total: arr.length, shown: 0, lastSub: null };
  if (!arr.length) { list.append(h('p', { class: 'empty' }, 'Nothing matches "' + q + '".')); return; }
  moreBuildRows(Math.max(BUILD_STEP, keep));
}
function moreBuildRows(n = BUILD_STEP) {
  const list = $('#buildList'), R = buildRows, q = buildQuery, end = Math.min(R.arr.length, BUILD_MAX, R.shown + n);
  const old = $('#buildMore'); if (old) old.remove();
  const frag = document.createDocumentFragment();
  for (const it of R.arr.slice(R.shown, end)) {
    if (!q && (it.c === 'Nature' || it.c === 'Kits') && it.sub && it.sub !== R.lastSub) { frag.append(h('h4', { style: 'margin:12px 4px 4px' }, it.sub)); R.lastSub = it.sub; }
    const ds = it.m && it.m.length ? it.m.map(([m, n]) => n + ' ' + m).join(' · ') : (it.d || (it.c === 'Special' ? 'Found or received' : 'Gathered or planted'));
    const row = h('button', { class: 'row', 'data-item': it.n, 'data-drag': 'item:' + it.n, 'aria-pressed': it.n === curItem ? 'true' : 'false', onclick: () => { selectItem(it.n); toMap(); toast(it.w > 1 || it.h > 1 ? 'Tap the map to place ' + it.n : 'Paint ' + it.n + ' on the map'); } },
      swatchEl(it), h('span', { class: 'meta' }, h('div', { class: 'nm' }, it.n, it.ep ? h('span', { class: 'ep', style: 'margin-left:6px' }, 'EP') : '', it.w > 1 || it.h > 1 ? h('span', { class: 'note', style: 'margin-left:6px' }, it.w + '×' + it.h) : ''), h('div', { class: 'ds' }, (q ? CAT_META[it.c].label + ' · ' : '') + ds)));
    row.style.flex = '1'; row.style.minWidth = '0';
    frag.append(h('div', { style: 'display:flex;align-items:center;min-width:0' }, row, h('button', { class: 'info', 'aria-label': 'Details for ' + it.n, onclick: () => showItemInfo(it) }, icon('info'))));
  }
  R.shown = end;
  if (end < Math.min(R.arr.length, BUILD_MAX)) {
    const more = h('button', { class: 'btn sm', id: 'buildMore', style: 'margin:10px auto', onclick: () => moreBuildRows() }, 'Show more');
    frag.append(more);
    if ('IntersectionObserver' in window) {
      if (!buildObs) buildObs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) moreBuildRows(); }, { root: $('#tab-build'), rootMargin: '0px 0px 800px 0px' });
      buildObs.disconnect(); buildObs.observe(more);
    }
  } else if (R.arr.length > BUILD_MAX) frag.append(h('p', { class: 'note' }, 'First ' + BUILD_MAX + ' of ' + R.arr.length + ' · search to narrow'));
  list.append(frag);
}
function showItemInfo(it) {
  modal(it.n, (box) => {
    box.append(picEl(it, 'pic big'));
    box.append(h('div', { class: 'insp-head' }, h('div', { class: 'sub', style: 'margin:0' }, CAT_META[it.c].label + (it.sub ? ' · ' + it.sub : '') + (it.ep ? ' · Expansion Pass' : ''))));
    box.append(h('h4', null, it.m && it.m.length ? 'Recipe' : 'How to get it')); box.append(recipeChips(it));
    if (it.s) box.append(h('p', { class: 'note' }, 'From: ' + it.s));
    if (it.d) box.append(h('p', { class: 'note' }, it.d));
    if (it.cap) box.append(h('p', { class: 'note' }, it.cap + ' Pokémon · ' + it.w + '×' + it.h + (it.est ? '?' : '') + (it.wk ? ' · builders ' + it.wk : '')));
    const groups = GROUP_OF.get(it.i); if (groups) box.append(h('p', { class: 'note' }, 'Counts as: ' + groups.join(', ')));
    if (it.fv) { const fans = PK.filter(p => (p.fv || []).some(f => it.fv.includes(f))).length; box.append(h('p', { class: 'note' }, 'Favourite kind: ' + it.fv.map(f => FAVS[f]).join(', ') + (it.tg ? ' · ' + it.tg : '') + ' · liked by ' + fans)); }
    if (envFx(it)) box.append(h('p', { class: 'note' }, envFxText(it)));
    for (const t of howItWorks(it)) box.append(h('p', { class: 'note' }, t));
    const used = USED_IN.get(it.i);
    if (used && used.length) { box.append(h('h4', null, 'In habitats (' + used.length + ')')); const l = h('div', { class: 'mons' }); used.forEach((id, k) => { const hb = HAB_BY_ID.get(id); l.append(h('button', { onclick: () => { closeModal(); openHabitat(id); } }, hb.n), k < used.length - 1 ? ', ' : ''); }); box.append(l); }
  }, 'Place it', () => { selectItem(it.n); toMap(); });
}

let rawMode = false;
function renderMaterials() {
  const root = $('#tab-materials'); root.textContent = '';
  const t = materialTotals(rawMode);
  const zs = plan.zones.filter(z => z.kind === 'habitat'); const done = zs.filter(z => zoneStatus.get(z.id) && zoneStatus.get(z.id).ok).length;
  root.append(h('h2', { class: 'hrow' }, 'Materials', tipBtn('Everything this plan needs, totalled from each recipe. Enter what you have to see what\'s left to gather.')));
  root.append(h('div', { class: 'tiles' },
    h('div', { class: 'tile', 'data-tip': 'Crafted pieces in this plan' }, h('div', { class: 'k' }, 'Crafted'), h('div', { class: 'v' }, fmt(t.crafted))),
    h('div', { class: 'tile', 'data-tip': 'Things gathered, planted or found' }, h('div', { class: 'k' }, 'Gathered'), h('div', { class: 'v' }, fmt(t.natural))),
    h('div', { class: 'tile', 'data-tip': 'Different materials the recipes use' }, h('div', { class: 'k' }, 'Materials'), h('div', { class: 'v' }, t.need.size)),
    h('div', { class: 'tile', 'data-tip': 'Habitat zones that have formed a habitat' }, h('div', { class: 'k' }, 'Habitats'), h('div', { class: 'v' }, done, h('small', null, ' / ' + zs.length)))));
  const tg = h('label', { class: 'toggle', style: 'margin:8px 0 4px' }, h('input', { type: 'checkbox', id: 'rawT', checked: rawMode, onchange: (e) => { rawMode = e.target.checked; renderMaterials(); } }), 'Raw materials', tipBtn('Breaks processed materials down to raw: 1 Small log → 5 Lumber; 1 ore → 1 ingot; 1 Squishy clay → 2 Brick; 1 Wastepaper → 2 Paper. Concrete and Tinkagear count 1 : 1 (an estimate).'));
  root.append(tg);
  if (!t.need.size) root.append(h('p', { class: 'empty' }, 'Nothing crafted yet'));
  else {
    const rows = [...t.need.entries()].sort((a, b) => b[1] - a[1]);
    const tb = h('tbody');
    for (const [m, q] of rows) {
      const have = +(plan.inv[m] || 0); const left = Math.max(0, Math.ceil(q) - have);
      const inp = h('input', { type: 'number', min: 0, value: have || '', 'aria-label': 'Have ' + m, inputmode: 'numeric' });
      inp.onchange = () => { plan.inv[m] = Math.max(0, +inp.value || 0); markDirty(); renderMaterials(); };
      const meta = MAT_BY_NAME.get(m);
      tb.append(h('tr', null, h('td', null, h('span', meta ? { style: 'font-weight:700', 'data-tip': meta.k === 'processed' ? 'Processed · ' + meta.p : meta.g } : { style: 'font-weight:700' }, m)), h('td', null, fmt(Math.ceil(q))), h('td', null, inp), h('td', { class: left ? 'leftn' : 'left0' }, left ? fmt(left) : '✓')));
    }
    root.append(h('table', { class: 'mats' }, h('thead', null, h('tr', null, h('th', null, 'Material'), h('th', null, 'Need'), h('th', null, 'Have'), h('th', null, 'Left'))), tb));
    root.append(h('div', { style: 'margin-top:10px;display:flex;gap:8px;flex-wrap:wrap' }, h('button', { class: 'btn sm', onclick: () => copyText(materialsText(t)) }, icon('copy'), 'Copy list'), h('button', { class: 'btn sm', onclick: () => { plan.inv = {}; markDirty(); renderMaterials(); } }, 'Reset "have"')));
  }
  const proc = [...t.processed.entries()].filter(([m]) => DATA.process[m]);
  if (proc.length) {
    root.append(h('h4', null, 'Processing jobs'));
    const l = h('div', { class: 'list' });
    for (const [m, q] of proc) { const [rawm, k, alt] = DATA.process[m]; l.append(h('div', { class: 'card' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, fmt(Math.ceil(q)) + ' ' + m), h('span', { class: 'spec', style: 'margin-left:auto' }, SPEC_FOR_MAT[m] || '')), h('div', { class: 'note' }, 'Give ' + fmt(Math.ceil(q * k)) + ' ' + (alt && alt.length ? [rawm, ...alt].slice(0, -1).join(', ') + ' or ' + alt[alt.length - 1] : rawm) + ' · ' + (MAT_BY_NAME.get(m) ? MAT_BY_NAME.get(m).g : '')))); }
    root.append(l);
  }
  if (t.gather.size) {
    root.append(h('h4', null, 'Gather, plant & find'));
    const tb = h('tbody'); for (const [n, q] of [...t.gather.entries()].sort((a, b) => b[1] - a[1])) { const it = BY_NAME.get(n); tb.append(h('tr', null, h('td', null, h('div', { style: 'display:flex;gap:8px;align-items:center' }, swatchEl(it), h('span', null, n))), h('td', null, fmt(q)))); }
    root.append(h('table', { class: 'mats' }, h('thead', null, h('tr', null, h('th', null, 'Item'), h('th', null, 'Count'))), tb));
  }
  const lim = limitRows().filter(r => r.n > 0);
  root.append(h('h4', { class: 'hrow' }, 'Limits', tipBtn('The game caps how many of these one area can hold. Items inside kit houses count too.')));
  if (!lim.length) root.append(h('p', { class: 'empty' }, 'Nothing here has a cap'));
  else {
    const tb = h('tbody');
    for (const r of lim) { const over = r.n > r.cap, near = !over && r.n >= r.cap * 0.9; tb.append(h('tr', null, h('td', null, h('div', { class: 'hrow', style: 'font-weight:700' }, r.label, tipBtn(r.tip))), h('td', { style: over ? 'color:var(--bad);font-weight:700' : near ? 'color:var(--warn);font-weight:700' : '' }, fmt(r.n)), h('td', null, fmt(r.cap)), h('td', over ? { style: 'color:var(--bad);font-weight:700' } : { class: 'left0' }, over ? '⚠ ' + fmt(r.n - r.cap) + ' over' : '✓'))); }
    root.append(h('table', { class: 'mats' }, h('thead', null, h('tr', null, h('th', null, 'What'), h('th', null, 'Here'), h('th', null, 'Cap'), h('th', null, ''))), tb));
  }
}
function materialsText(t) { const lines = ['Pokopia plan: ' + plan.name + ' (' + plan.area + ')', '']; for (const [m, q] of [...t.need.entries()].sort((a, b) => b[1] - a[1])) { const have = +(plan.inv[m] || 0); const left = Math.max(0, Math.ceil(q) - have); lines.push(`${m}: ${Math.ceil(q)}${have ? ` (have ${have}, need ${left} more)` : ''}`); } if (t.gather.size) { lines.push('', 'Gather / plant:'); for (const [n, q] of t.gather) lines.push(`${n}: ${q}`); } return lines.join('\n'); }
async function copyText(s) { try { await navigator.clipboard.writeText(s); toast('Copied'); } catch (e) { modal('Copy this text', (b) => { const ta = h('textarea', { style: 'width:100%;height:240px;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--paper)', readonly: true }); ta.value = s; b.append(ta); setTimeout(() => ta.select(), 50); }); } }

let habQuery = '', habReg = 'All', habOnlyNear = false, openHab = null;
function openHabitat(id) { openHab = id; habQuery = ''; openTab('habitats', 'half'); setTimeout(() => { const el = $('#hab-' + id); if (el) el.scrollIntoView({ block: 'center' }); }, 60); }
function habCard(hb, extra) {
  const card = h('div', { class: 'card', id: 'hab-' + hb.id, 'data-drag': 'hab:' + hb.id, style: openHab === hb.id ? 'border-color:var(--accent)' : '' });
  card.append(h('div', { class: 'hd' }, h('span', { class: 'no' }, '#' + hb.id), h('span', { class: 'title' }, hb.n), hb.reg !== 'Main' ? h('span', { class: 'ep', style: 'margin-left:auto' }, hb.reg === 'Basin' ? 'BASIN' : 'EVENT') : ''));
  card.append(h('div', { class: 'reqs' }, hb.r.map(([tok, q]) => h('span', { class: 'req' }, h('b', null, q + '×'), tok))));
  card.append(h('div', { class: 'note', style: 'margin-top:4px' }, 'Attracts'), pkChips(hb.p, 26, openPokemon, (p) => PK_BY_NAME.has(p.n) ? h('span', { class: 'spec' }, p.s.join(' · ')) : null));
  if (hb.note) card.append(h('div', { class: 'note' }, hb.note));
  card.append(h('div', { class: 'acts' }, h('button', { class: 'btn sm primary', onclick: () => { stampHab = hb; setTool('stamp'); toMap(); toast('Tap the map where ' + hb.n + ' should go, or drag the card there'); } }, icon('stamp'), 'Stamp'), extra || ''));
  return card;
}
function renderHabitats() {
  const root = $('#tab-habitats'); root.textContent = '';
  root.append(h('h2', { class: 'hrow' }, 'Habitats', tipBtn('Zones check what you placed against the Habitat Dex. Stamp any habitat to lay out its items and a zone in one tap.')));
  root.append(h('h4', { class: 'hrow' }, 'Houses you built (' + autoHouses.length + ')', tipBtn('Build walls or fences all the way round a space (Fill → Outline makes this quick), put a door or gate in the wall, and add 3 kinds of furniture at the door\'s level. The planner finds it automatically.')));
  if (!autoHouses.length) root.append(h('p', { class: 'note' }, 'None yet'));
  const showHs = (hs) => { mapView.centerOn(hs.x + hs.w / 2, hs.y + hs.h / 2); toMap(); selectHouse(hs); };
  for (const hs of autoHouses) {
    const ct = areaContents(hs.area);
    if (hs.enclosure) { root.append(h('div', { class: 'card zone-none' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, 'Enclosure at ' + hs.x + ', ' + hs.y), h('span', { class: 'chip', style: 'margin-left:auto' }, hs.kitHomes.length + ' kit home' + (hs.kitHomes.length > 1 ? 's' : ''))), h('div', { class: 'acts' }, ibtn('map', 'Show on map', () => showHs(hs), 'sm'), ibtn('trash', 'Delete', () => confirmDeleteHouse(hs), 'sm danger', { style: 'margin-left:auto' })))); continue; }
    root.append(h('div', { class: 'card ' + (hs.ok ? 'zone-ok' : 'zone-part') }, h('div', { class: 'hd' }, h('span', { class: 'title' }, 'House at ' + hs.x + ', ' + hs.y), h('span', { class: 'chip ' + (hs.ok ? 'good' : 'warn'), style: 'margin-left:auto' }, h('span', { class: 'dot' }), hs.ok ? 'Habitable' : 'Unfinished')),
      h('div', { class: 'note' }, (hs.ok ? 'Up to 4' : houseIssues(hs).join(' · ')) + ' · ' + floorItems(hs) + ' inside · ' + ct.n + ' in the area'),
      (() => { const l = residentsOf(houseHome(hs)); return l.length ? pkChips(l.map(r => r.p), 22, openPokemon) : ''; })(),
      h('div', { class: 'acts' }, ibtn('map', 'Show on map', () => showHs(hs), 'sm'), ibtn('trash', 'Delete', () => confirmDeleteHouse(hs), 'sm danger', { style: 'margin-left:auto' }))));
  }
  const kitObs = [...plan.objs.values()].filter(ob => ITEMS[ob.i].cap);
  if (kitObs.length) {
    const pv = prefabTotal();
    root.append(h('h4', { class: 'hrow' }, 'Kit homes (' + kitObs.length + ')', h('span', { class: 'req' + (pv > 40 ? ' miss' : ''), style: 'font-weight:600', 'data-tip': 'Prefab homes: ' + pv + ' of the 40 allowed in one area (1 for a one-Pokémon home, 2 for bigger ones). Kits built from blocks don\'t count.' }, 'Prefab ' + pv + '/40')));
    for (const ob of kitObs) {
      const it = ITEMS[ob.i], hm = kitHome(ob), l = residentsOf(hm), n = splitFloors(hm) ? kitFloorsToFurnish(ob).map(f => (f ? '2F ' : '1F ') + kitFurniture(ob, f) + '/3').join(', ') : kitFurniture(ob) + '/3', cv = favCoverage(hm), host = houseAt(ob.x, ob.y);
      root.append(h('div', { class: 'card ' + (kitReady(ob) ? 'zone-ok' : 'zone-part') }, h('div', { class: 'hd' }, swatchEl(it), h('span', { class: 'title' }, it.n.replace(/ kit$/, '') + ' at ' + ob.x + ', ' + ob.y), h('span', { class: 'note', style: 'margin-left:auto', 'data-tip': 'Residents: ' + l.length + ' of ' + it.cap }, l.length + '/' + it.cap)),
        h('div', { class: 'reqs' }, h('span', { class: 'req ' + (kitReady(ob) ? 'ok' : 'miss'), 'data-tip': 'Kinds of furniture inside, out of the 3 it needs' + (hm.floors > 1 ? ' on each floor' : '') }, icon('sofa'), n), cv.total ? h('span', { class: 'req', 'data-tip': 'Favourite things its residents like, in reach' }, '♥ ' + cv.have + '/' + cv.total) : '', hm.floors > 1 ? h('span', { class: 'req' }, '2 floors') : '', host ? h('span', { class: 'req' }, 'In ' + (host.enclosure ? 'an enclosure' : 'a house')) : ''),
        l.length ? pkChips(l.map(r => r.p), 22, openPokemon, hm.floors > 1 ? (p) => h('span', { class: 'note' }, (l.find(r => r.p === p.n) || {}).f ? '2F' : '1F') : null) : '',
        h('div', { class: 'acts' }, ibtn('sofa', 'Decorate inside', () => interiorEditor(ob), 'sm primary'), ibtn('map', 'Show on map', () => { mapView.centerOn(ob.x + ob.w / 2, ob.y + ob.h / 2); if (innerWidth < 900) setSheet('peek'); selection = { obj: ob }; showObjInspector(ob); }, 'sm'), ibtn('trash', 'Delete', () => deleteObjNow(ob), 'sm danger', { style: 'margin-left:auto' }))));
    }
  }
  const zs = plan.zones.filter(z => z.kind !== 'label');
  root.append(h('h4', { class: 'hrow' }, 'Zones (' + zs.length + ')', tipBtn('Draw a zone around a cluster with the Zone tool, or Stamp a habitat below.')));
  if (!zs.length) root.append(h('p', { class: 'note' }, 'None yet'));
  for (const z of zs) {
    const r = zoneStatus.get(z.id); if (!r) continue;
    const cls = r.ok ? 'zone-ok' : (r.target || r.near) ? 'zone-part' : 'zone-none';
    const card = h('div', { class: 'card ' + cls });
    let status = '';
    if (z.kind === 'house') status = r.ok ? 'Habitable house · 4 Pokémon' : 'Not a house yet';
    else if (r.ok) status = 'Forms ' + r.best.hb.n;
    else if (r.target) status = r.target.n + ': ' + r.tr.met + ' of ' + r.tr.total + ' requirements';
    else if (r.near) status = 'Closest: ' + r.near.hb.n + ' (' + r.near.r.met + '/' + r.near.r.total + ')';
    else status = 'Empty';
    card.append(h('div', { class: 'hd' }, h('span', { class: 'title' }, z.name || 'Zone'), h('span', { class: 'chip ' + (r.ok ? 'good' : (r.target || r.near) ? 'warn' : ''), style: 'margin-left:auto' }, h('span', { class: 'dot' }), r.ok ? 'Done' : 'In progress')));
    card.append(h('div', { class: 'note' }, status));
    const rows = r.target ? r.tr.rows : (!r.ok && r.near) ? r.near.r.rows : null;
    if (rows) card.append(h('div', { class: 'reqs' }, rows.map(rw => h('span', { class: 'req ' + (rw.have >= rw.q ? 'ok' : 'miss') }, h('b', null, Math.min(rw.have, rw.q) + '/' + rw.q), rw.tok))));
    if (r.ok && r.kind === 'habitat') card.append(h('div', { class: 'note', style: 'margin-top:4px' }, 'Attracts'), pkChips(r.best.hb.p, 22, openPokemon));
    if (r.area) { const ct = areaContents(r.area); card.append(h('div', { class: 'note', style: 'margin-top:4px' }, (r.area.kind === 'house' ? 'Area ' + r.area.cells.size + ' tiles' : 'Area ' + r.area.rect.w + '×' + r.area.rect.h) + ' · ' + ct.n + ' item' + (ct.n === 1 ? '' : 's'))); }
    card.append(h('div', { class: 'acts' }, ibtn('map', 'Show on map', () => focusZone(z), 'sm'), ibtn('trash', 'Delete', () => confirmDeleteZone(z), 'sm danger', { style: 'margin-left:auto' })));
    root.append(card);
  }
  root.append(h('h4', null, 'Habitat Dex (' + HAB.length + ')'));
  const inp = h('input', { id: 'habSearch', type: 'search', placeholder: 'Search habitat, item or Pokémon', value: habQuery, autocomplete: 'off' });
  inp.oninput = () => { habQuery = inp.value.trim().toLowerCase(); renderHabList(); };
  root.append(h('label', { class: 'search' }, icon('search'), inp));
  const regs = h('div', { class: 'cats' }); for (const r of ['All', 'Main', 'Basin', 'Event']) regs.append(h('button', { class: 'cat', 'aria-pressed': habReg === r ? 'true' : 'false', onclick: () => { habReg = r; renderHabitats(); } }, r === 'Main' ? 'Main game' : r === 'Basin' ? 'Bubbly Basin' : r));
  regs.append(h('button', { class: 'cat', 'aria-pressed': habOnlyNear ? 'true' : 'false', onclick: () => { habOnlyNear = !habOnlyNear; renderHabitats(); } }, 'Uses what I placed'));
  root.append(regs);
  root.append(h('div', { id: 'habList' }));
  renderHabList();
}
function renderHabList() {
  const list = $('#habList'); if (!list) return; list.textContent = '';
  const q = habQuery; let placedSet = null;
  if (habOnlyNear) { placedSet = new Set(); for (const ob of plan.objs.values()) placedSet.add(ob.i); for (const T of plan.tt) for (let k = 0; k < T.length; k++) if (T[k]) placedSet.add(T[k] - 1); }
  const arr = [];
  for (const hb of HAB) {
    if (habReg !== 'All' && hb.reg !== habReg) continue;
    if (q && !(hb.n.toLowerCase().includes(q) || hb.id.toLowerCase().includes(q) || hb.r.some(([t]) => t.toLowerCase().includes(q)) || hb.p.some(p => p.toLowerCase().includes(q)))) continue;
    if (placedSet) { const uses = hb.r.some(([tok]) => { if (GROUPS.has(tok)) { for (const i of GROUPS.get(tok)) if (placedSet.has(i)) return true; return false; } const it = BY_NAME.get(DATA.terrainReq[tok] || tok); return it && placedSet.has(it.i); }); if (!uses) continue; }
    arr.push(hb); if (arr.length > 300) break;
  }
  if (!arr.length) { list.append(h('p', { class: 'empty' }, 'No habitats match.')); return; }
  fillLazy(list, arr, (hb) => habCard(hb), $('#tab-habitats'), 30, null, arr.findIndex(hb => hb.id === openHab) + 1);
}
function focusZone(z) { mapView.centerOn(z.x + z.w / 2, z.y + z.h / 2); toMap(); selectZone(z); }

const PKF0 = () => ({ q: '', st: '', dex: [], ty: [], tyAll: false, sp: [], spAll: false, id: [], sz: [], fl: [], fv: [], fvAll: false, hb: '', sort: 'no', desc: false, view: 'cards', open: false });
let PKF = PKF0(), openPk = null, pkHabAll = false;
{ let s = null; try { s = JSON.parse(LS.get(LSK + 'pkf') || 'null'); } catch (e) { } if (s && typeof s === 'object') for (const k in PKF) if (k !== 'q' && k in s && typeof s[k] === typeof PKF[k] && Array.isArray(s[k]) === Array.isArray(PKF[k])) PKF[k] = s[k]; }
function savePkf() { const o = Object.assign({}, PKF); delete o.q; LS.set(LSK + 'pkf', JSON.stringify(o)); }
const PK_ST = [['plan', 'In my habitats', 'Your finished habitats attract them'], ['wait', 'Waiting for a home', 'Your habitats attract them, but they don\'t live in a home yet'], ['home', 'Has a home', 'Lives in one of your homes'], ['free', 'No home', 'Doesn\'t live in any of your homes']];
const PK_DEX = [['Main', 'Main'], ['Basin', 'Bubbly Basin'], ['Event', 'Event']];
const PK_SORTS = [['no', 'Number'], ['name', 'Name'], ['size', 'Size'], ['ht', 'Height'], ['wt', 'Weight'], ['hab', 'Habitats'], ['spec', 'Specialties']];
const PKQ_F = { name: 'n', type: 't', t: 't', spec: 's', specialty: 's', s: 's', likes: 'f', like: 'f', fav: 'f', f: 'f', ideal: 'i', i: 'i', flavor: 'fl', flavour: 'fl', fl: 'fl', hab: 'hb', habitat: 'hb', h: 'hb', size: 'sz', no: 'no', dex: 'd', home: 'hm', lives: 'hm' };
const PK_HELP = 'Every word must match. Plain words look in the name, type, specialty, likes, ideal habitat, flavour and Pokédex number. Narrow a word with type:, spec:, likes:, ideal:, flavour:, hab:, home:, size: or no:, put a phrase in "quotes", and start a word with - to leave those out: type:water -spec:water.';
const pkNo = (p) => p.dex === 'Main' ? '#' + p.no : (p.dex === 'Basin' ? 'Basin ' : 'Event ') + p.no.slice(1);
function pkTerms(q) { const out = [], re = /(-)?(?:([a-z]+):)?(?:"([^"]*)"?|(\S+))/g; let m; while ((m = re.exec(q))) { const f = m[2] ? PKQ_F[m[2]] : null; let v = m[3] != null ? m[3] : m[4] || ''; if (m[2] && !f) v = m[2] + ':' + v; v = v.trim(); if (v) out.push({ neg: !!m[1], f, v }); } return out; }
function pkText(p) { return p._tx || (p._tx = { n: p.n.toLowerCase(), t: p.t.map(x => x.toLowerCase()), s: p.s.map(x => x.toLowerCase()), i: (p.ideal || '').toLowerCase(), f: (p.fv || []).map(f => (FAVS[f] || '').toLowerCase()), fl: (p.fl || '').toLowerCase(), hb: p.hab.map(id => (HAB_BY_ID.get(id) || { n: '' }).n.toLowerCase()), no: p.no.toLowerCase(), d: p.dex.toLowerCase() }); }
function pkTermHit(p, t, pc) {
  const x = pkText(p), v = t.v, has = (a) => a.some(s => s.includes(v)), num = /^#?\d+$/.test(v) ? +v.replace('#', '') : null, sz = SIZE_NAME[pkSize(p)].toLowerCase();
  const noHit = () => num != null ? p.dex === 'Main' && +p.no === num : x.no === v;
  switch (t.f) {
    case 'n': return x.n.includes(v);
    case 't': return has(x.t);
    case 's': return has(x.s);
    case 'f': return has(x.f);
    case 'i': return !!x.i && x.i.startsWith(v);
    case 'fl': return x.fl.includes(v);
    case 'hb': return has(x.hb);
    case 'sz': return sz.startsWith(v);
    case 'no': return noHit();
    case 'd': return x.d.startsWith(v);
    case 'hm': { const hm = pc.home.get(p.n); return !!hm && hm.label.toLowerCase().includes(v); }
  }
  if (num != null) return noHit();
  return x.n.includes(v) || has(x.t) || has(x.s) || x.i.includes(v) || has(x.f) || x.fl.includes(v) || x.no === v || sz === v;
}
function pkCtx() { const home = new Map(); for (const e of residentsIndex().homes.values()) for (const r of e.list) home.set(r.p, e.home); return { att: planPokemon(), home }; }
const anyAll = (sel, all, f) => !sel.length || (all ? sel.every(f) : sel.some(f));
const pkStatus = (p, pc, v) => v === 'plan' ? pc.att.has(p.n) : v === 'wait' ? pc.att.has(p.n) && !pc.home.has(p.n) : v === 'home' ? pc.home.has(p.n) : !pc.home.has(p.n);
function pkPreds(pc) {
  const F = PKF;
  return [
    ['st', p => !F.st || pkStatus(p, pc, F.st)],
    ['dex', p => !F.dex.length || F.dex.includes(p.dex)],
    ['ty', p => anyAll(F.ty, F.tyAll, v => p.t.includes(v))],
    ['sp', p => anyAll(F.sp, F.spAll, v => p.s.includes(v))],
    ['id', p => !F.id.length || F.id.includes(p.ideal || '')],
    ['sz', p => !F.sz.length || F.sz.includes(pkSize(p))],
    ['fl', p => !F.fl.length || F.fl.includes(p.fl || '')],
    ['fv', p => anyAll(F.fv, F.fvAll, v => (p.fv || []).includes(v))],
    ['hb', p => !F.hb || (F.hb === '+' ? p.hab.length > 0 : F.hb === '-' ? !p.hab.length : p.hab.includes(F.hb))],
  ];
}
function pkSearch() {
  const pc = pkCtx(), P = pkPreds(pc), terms = pkTerms(PKF.q.toLowerCase()), res = [], base = {};
  for (const [k] of P) base[k] = [];
  for (const p of PK) {
    if (terms.length && !terms.every(t => pkTermHit(p, t, pc) !== t.neg)) continue;
    let nf = 0, miss = null; for (const [k, f] of P) if (!f(p)) { miss = k; if (++nf > 1) break; }
    if (!nf) { res.push(p); for (const k in base) base[k].push(p); } else if (nf === 1) base[miss].push(p);
  }
  const key = { no: p => p._i, size: p => SIZE_RANK[pkSize(p)], ht: p => p.hw ? p.hw[0] : 0, wt: p => p.hw ? p.hw[1] : 0, hab: p => p.hab.length, spec: p => p.s.length }[PKF.sort], dir = PKF.desc ? -1 : 1;
  res.sort((a, b) => dir * (key ? (key(a) - key(b)) || (a._i - b._i) : a.n.localeCompare(b.n)));
  return { pc, res, base };
}
function pkActive() {
  const F = PKF, out = [];
  if (F.st) out.push(['st', F.st, (PK_ST.find(s => s[0] === F.st) || [0, F.st])[1]]);
  for (const v of F.dex) out.push(['dex', v, (PK_DEX.find(d => d[0] === v) || [0, v])[1]]);
  for (const v of F.ty) out.push(['ty', v, v]);
  for (const v of F.sp) out.push(['sp', v, v]);
  for (const v of F.id) out.push(['id', v, v || 'No ideal']);
  for (const v of F.sz) out.push(['sz', v, SIZE_NAME[v] || v]);
  for (const v of F.fl) out.push(['fl', v, v ? v.replace(/ flavors$/, '') : 'No flavour']);
  for (const v of F.fv) out.push(['fv', v, 'Likes ' + (FAVS[v] || v)]);
  if (F.hb) out.push(['hb', F.hb, F.hb === '+' ? 'Has a habitat' : F.hb === '-' ? 'No habitat' : (HAB_BY_ID.get(F.hb) || { n: F.hb }).n]);
  return out;
}
function pkUnset(k, v) { PKF[k] = Array.isArray(PKF[k]) ? PKF[k].filter(x => x !== v) : ''; }
function pkClear() { const keep = { sort: PKF.sort, desc: PKF.desc, view: PKF.view, open: PKF.open }; PKF = Object.assign(PKF0(), keep); const inp = $('#pkSearch'); if (inp) inp.value = ''; pkResults(); }
function openPokemon(n) { openPk = n; PKF = Object.assign(PKF0(), { sort: PKF.sort, desc: PKF.desc, view: PKF.view, q: n }); openTab('pokemon'); }
const pkGrip = (p) => h('button', { class: 'pkgrip', type: 'button', 'aria-label': 'Move ' + p.n + ' into a home', 'data-tip': 'Drag onto a home, or tap to choose one', onclick: (e) => { e.stopPropagation(); pkHomeChooser(p); } }, icon('grip'));
function renderPokemon() {
  const root = $('#tab-pokemon'), was = $('#pkList'), keep = { top: root.scrollTop, n: was ? was.children.length : 0 }; root.textContent = '';
  PK.forEach((p, i) => { p._i = i; });
  const pc = pkCtx(), att = pc.att, hc = housingCapacity();
  root.append(h('h2', { class: 'hrow' }, 'Pokémon', tipBtn('Who your finished habitats attract, which jobs they cover, and where every Pokémon lives. Drag one from a list onto a home to move it in.')));
  root.append(h('div', { class: 'tiles' },
    h('div', { class: 'tile' }, h('div', { class: 'k' }, 'Can appear'), h('div', { class: 'v' }, att.size)),
    h('div', { class: 'tile', 'data-tip': 'Places to live in kit homes and houses you built' }, h('div', { class: 'k' }, 'Beds'), h('div', { class: 'v' }, hc.cap)),
    h('div', { class: 'tile' }, h('div', { class: 'k' }, 'Housed'), h('div', { class: 'v' }, pc.home.size)),
    (() => { const tc = townComfort(); lvWatch = { id: plan.id, lv: Math.max(lvWatch.id === plan.id ? lvWatch.lv : 0, tc.lv) }; return h('div', { class: 'tile', 'data-tip': envLvTip(tc) }, h('div', { class: 'k' }, 'Env. level'), h('div', { class: 'v' }, tc.list.length ? '≈' + (tc.lvLo < tc.lv ? tc.lvLo + '–' + tc.lv : tc.lv) : '–', tc.list.length ? h('small', null, ' ' + (tc.lo < tc.pts ? tc.lo + '–' : '') + tc.pts + ' pts') : '')); })()));
  root.append(h('div', { class: 'card', style: 'margin-top:10px;border-left:4px solid var(--accent)' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, 'Group into houses'), tipBtn('Find who should share a home: Pokémon that like the same things need fewer decorations.')),
    h('div', { class: 'acts' }, h('button', { class: 'btn sm primary', onclick: housemateGroups }, icon('ball'), 'Plan housemates'))));
  const cov = new Map(); for (const n of att.keys()) { const p = PK_BY_NAME.get(n); if (p) for (const s of p.s) cov.set(s, (cov.get(s) || 0) + 1); }
  const t = materialTotals(false); const needSpec = new Set(); for (const m of t.processed.keys()) if (SPEC_FOR_MAT[m]) needSpec.add(SPEC_FOR_MAT[m]); if (hc.kits) needSpec.add('Build');
  if (t.gather.size) { for (const n of t.gather.keys()) { const it = BY_NAME.get(n); if (it && it.c === 'Nature' && /Trees|Flowers|Hedges|Crops/.test(it.sub || '')) { needSpec.add('Grow'); break; } } }
  root.append(h('h4', { class: 'hrow' }, 'Specialties', tipBtn('Red ones are needed to process this plan\'s materials, but none of your finished habitats attract them yet. Tap one to find Pokémon that have it.')));
  const cw = h('div', { class: 'coverage' });
  const allSpecs = new Set([...needSpec, ...cov.keys()]);
  if (!allSpecs.size) cw.append(h('p', { class: 'empty' }, 'Finish a habitat to see them'));
  for (const s of [...allSpecs].sort((a, b) => (needSpec.has(b) - needSpec.has(a)) || (cov.get(b) || 0) - (cov.get(a) || 0))) {
    const have = cov.get(s) || 0, need = needSpec.has(s);
    cw.append(h('button', { class: 'cov ' + (need && !have ? 'need' : have ? 'have' : ''), onclick: () => { PKF.sp = [s]; PKF.spAll = false; PKF.q = ''; const inp = $('#pkSearch'); if (inp) inp.value = ''; pkResults(); const hd = $('#pkHead'); if (hd) root.scrollTop += hd.getBoundingClientRect().top - root.getBoundingClientRect().top - 6; }, 'data-tip': DATA.specialties[s] || null }, h('b', null, have), s, need ? h('span', { class: 'note' }, have ? 'needed ✓' : 'needed') : ''));
  }
  root.append(cw);
  if (att.size) {
    root.append(h('h4', { class: 'hrow' }, 'From your habitats', h('span', { class: 'note' }, '(' + att.size + ')'), tipBtn('Drag one onto a home to move it in, or tap its dots to choose a home.')));
    const l = h('div', { class: 'list' }), all = [...att], cut = all.length > 8 && !pkHabAll ? 6 : all.length;
    for (const [n, hb] of all.slice(0, cut)) { const p = PK_BY_NAME.get(n); const hm = pc.home.get(n); l.append(h('div', { class: 'row' + (p ? ' pkrow' : ''), style: p ? null : 'cursor:default', 'data-pk': p ? n : null }, p ? pkGrip(p) : '', pkFace(p || n, 38), h('span', { class: 'meta' }, h('div', { class: 'nm' }, n, ' ', p && p.ideal ? h('span', { class: 'env' }, p.ideal) : '', p ? sizeBadge(p, () => renderPanel()) : ''), h('div', { class: 'ds' }, (p ? p.s.join(' · ') + ' · ' : '') + (hm ? 'lives in ' + hm.label : 'in ' + hb.n + ', no house yet'))))); }
    root.append(l);
    root.append(h('div', { class: 'reqs' }, cut < all.length ? h('button', { class: 'btn sm', type: 'button', onclick: () => { pkHabAll = true; renderPokemon(); } }, 'Show all ' + all.length) : all.length > 8 ? h('button', { class: 'btn sm', type: 'button', onclick: () => { pkHabAll = false; renderPokemon(); } }, 'Show fewer') : '',
      h('button', { class: 'btn sm', type: 'button', onclick: () => { PKF = Object.assign(PKF0(), { sort: PKF.sort, desc: PKF.desc, view: PKF.view, open: PKF.open, st: 'wait' }); const inp = $('#pkSearch'); if (inp) inp.value = ''; pkResults(); const hd = $('#pkHead'); if (hd) root.scrollTop += hd.getBoundingClientRect().top - root.getBoundingClientRect().top - 6; } }, icon('filter'), 'Who still needs a home')));
  }
  root.append(h('h4', { class: 'hrow', id: 'pkHead' }, 'Pokédex', h('span', { class: 'note', id: 'pkNum' }), tipBtn(PK_HELP)));
  const inp = h('input', { id: 'pkSearch', type: 'search', placeholder: 'Name, type, specialty, likes…', value: PKF.q, autocomplete: 'off', enterkeyhint: 'search', 'aria-label': 'Search the Pokédex' });
  inp.oninput = () => { PKF.q = inp.value; pkResults(); };
  root.append(h('div', { class: 'searchrow' }, h('label', { class: 'search' }, icon('search'), inp), h('button', { class: 'btn sm fbtn', id: 'pkFiltBtn', type: 'button', 'aria-controls': 'pkFilt', onclick: () => { PKF.open = !PKF.open; pkResults(); } })));
  const sortSel = h('select', { id: 'pkSort', 'aria-label': 'Sort by' }, PK_SORTS.map(([v, lb]) => h('option', { value: v, selected: PKF.sort === v }, lb)));
  sortSel.onchange = () => { PKF.sort = sortSel.value; pkResults(); };
  root.append(h('div', { class: 'pktools' }, h('label', { class: 'pksort' }, 'Sort', sortSel), h('button', { class: 'btn sm', id: 'pkDir', type: 'button', onclick: () => { PKF.desc = !PKF.desc; pkResults(); } }), h('span', { id: 'pkView' })));
  root.append(h('div', { id: 'pkFilt', class: 'pkfilt', hidden: true }), h('div', { id: 'pkAct', class: 'reqs' }), h('div', { id: 'pkList', class: 'list' }));
  pkResults(keep.n);
  if (keep.top) root.scrollTop = keep.top;
}
function pkResults(first = 0) {
  const root = $('#tab-pokemon'), list = $('#pkList'); if (!list) return; savePkf();
  const { pc, res, base } = pkSearch(), act = pkActive();
  const fb = $('#pkFiltBtn'); fb.textContent = ''; fb.append(icon('filter'), 'Filters', act.length ? h('span', { class: 'badge' }, act.length) : ''); fb.setAttribute('aria-expanded', PKF.open ? 'true' : 'false'); fb.setAttribute('aria-pressed', PKF.open ? 'true' : 'false');
  const dir = $('#pkDir'), alpha = PKF.sort === 'name'; dir.textContent = PKF.desc ? (alpha ? 'Z–A' : 'High first') : (alpha ? 'A–Z' : 'Low first'); dir.setAttribute('aria-label', 'Order: ' + dir.textContent + '. Change');
  const vw = $('#pkView'); vw.textContent = ''; vw.append(segmented([['cards', 'Cards'], ['list', 'List']], PKF.view === 'list' ? 'list' : 'cards', v => { PKF.view = v; pkResults(); }, 'View'));
  $('#pkNum').textContent = res.length === PK.length ? '(' + PK.length + ')' : '(' + res.length + ' of ' + PK.length + ')';
  pkFiltPanel(base, pc);
  const ab = $('#pkAct'); ab.textContent = '';
  for (const [k, v, lb] of act) ab.append(h('span', { class: 'req fchip' }, lb, h('button', { type: 'button', 'aria-label': 'Remove ' + lb, onclick: () => { pkUnset(k, v); pkResults(); } }, icon('close'))));
  if (act.length > 1 || (act.length && PKF.q.trim())) ab.append(h('button', { class: 'lnk', type: 'button', onclick: pkClear }, 'Clear all'));
  ab.hidden = !ab.children.length;
  list.textContent = ''; list.classList.toggle('pkrows', PKF.view === 'list');
  if (!res.length) { list.append(h('p', { class: 'empty' }, 'No Pokémon match. ', act.length || PKF.q.trim() ? h('button', { class: 'lnk', type: 'button', onclick: pkClear }, 'Clear the search and filters') : '')); return; }
  const rows = PKF.view === 'list', at = openPk ? res.findIndex(p => p.n === openPk) + 1 : 0;
  fillLazy(list, res, rows ? (p) => pkRowEl(p, pc) : (p) => pkCardEl(p, pc), root, rows ? 60 : 30, null, Math.max(first, at));
}
function pkFiltPanel(base, pc) {
  const box = $('#pkFilt'); box.textContent = ''; box.hidden = !PKF.open; if (!PKF.open) return;
  const cnt = (k, f) => { let n = 0; for (const p of base[k]) if (f(p)) n++; return n; };
  const chip = (k, v, lb, n, tip) => { const single = !Array.isArray(PKF[k]), on = single ? PKF[k] === v : PKF[k].includes(v); return h('button', { class: 'cat' + (!n && !on ? ' zero' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-tip': tip || null, onclick: () => { if (single) PKF[k] = on ? '' : v; else PKF[k] = on ? PKF[k].filter(x => x !== v) : PKF[k].concat([v]); pkResults(); } }, lb, h('span', { class: 'n' }, n)); };
  const grp = (label, k, kids, allKey, tip) => { const set = Array.isArray(PKF[k]) ? PKF[k].length : !!PKF[k]; return h('div', { class: 'fgrp' }, h('div', { class: 'fhd' }, h('b', null, label), tip ? tipBtn(tip) : '', allKey && PKF[k].length > 1 ? segmented([['any', 'Any of them'], ['all', 'All of them']], PKF[allKey] ? 'all' : 'any', v => { PKF[allKey] = v === 'all'; pkResults(); }, label + ': match') : '', set ? h('button', { class: 'lnk', type: 'button', onclick: () => { PKF[k] = Array.isArray(PKF[k]) ? [] : ''; pkResults(); } }, 'Clear') : ''), h('div', { class: 'fchips' }, kids)); };
  const types = [...new Set(PK.flatMap(p => p.t))].sort(), specC = new Map(); for (const p of PK) for (const s of p.s) specC.set(s, (specC.get(s) || 0) + 1);
  const specs = [...specC.keys()].sort((a, b) => (a === '???') - (b === '???') || specC.get(b) - specC.get(a) || a.localeCompare(b));
  const ideals = ['Bright', 'Dark', 'Warm', 'Cool', 'Humid', 'Dry'].filter(v => PK.some(p => p.ideal === v)), flavours = [...new Set(PK.map(p => p.fl).filter(Boolean))].sort();
  const favIx = FAVS.map((f, i) => i).filter(i => PK.some(p => (p.fv || []).includes(i))).sort((a, b) => FAVS[a].localeCompare(FAVS[b]));
  const hsel = h('select', { id: 'pkHab', 'aria-label': 'Habitat' }, h('option', { value: '' }, 'Any habitat'), h('option', { value: '+', selected: PKF.hb === '+' }, 'Has a habitat (' + cnt('hb', p => p.hab.length > 0) + ')'), h('option', { value: '-', selected: PKF.hb === '-' }, 'No habitat: story or events (' + cnt('hb', p => !p.hab.length) + ')'),
    h('optgroup', { label: 'Attracted by' }, [...HAB].sort((a, b) => a.n.localeCompare(b.n)).map(hb => h('option', { value: hb.id, selected: PKF.hb === hb.id }, hb.n + ' (' + cnt('hb', p => p.hab.includes(hb.id)) + ')'))));
  hsel.onchange = () => { PKF.hb = hsel.value; pkResults(); };
  box.append(
    grp('Status', 'st', PK_ST.map(([v, lb, tip]) => chip('st', v, lb, cnt('st', p => pkStatus(p, pc, v)), tip))),
    grp('Pokédex', 'dex', PK_DEX.map(([v, lb]) => chip('dex', v, lb, cnt('dex', p => p.dex === v)))),
    grp('Type', 'ty', types.map(v => chip('ty', v, v, cnt('ty', p => p.t.includes(v)))), 'tyAll'),
    grp('Specialty', 'sp', specs.map(v => chip('sp', v, v, cnt('sp', p => p.s.includes(v)), DATA.specialties[v])), 'spAll'),
    grp('Ideal habitat', 'id', ideals.map(v => chip('id', v, v, cnt('id', p => p.ideal === v))), null, 'The habitat each one feels best in: a home\'s light, warmth and humidity can match it.'),
    grp('Size', 'sz', ['s', 'm', 'l'].map(v => chip('sz', v, SIZE_NAME[v], cnt('sz', p => pkSize(p) === v), v === 'l' ? 'Too big for dens and the Poké Ball house; needs a 2×2 rest item' : v === 'm' ? 'Fits a den; needs a 2×1 rest item' : 'Fits a den; any rest item will do')), null, 'Sizes with ? on a Pokémon are guesses: tap its size to change it.'),
    grp('Flavour', 'fl', flavours.map(v => chip('fl', v, v.replace(/ flavors$/, ''), cnt('fl', p => p.fl === v)))),
    grp('Likes', 'fv', favIx.map(i => chip('fv', i, FAVS[i], cnt('fv', p => (p.fv || []).includes(i)), FAV_COUNT[i] ? FAV_COUNT[i] + ' items count as ' + FAVS[i].toLowerCase() : null)), 'fvAll', 'The kinds of things each one likes to have nearby. Pick several and choose All of them to find good housemates.'),
    h('div', { class: 'fgrp' }, h('div', { class: 'fhd' }, h('b', null, 'Habitat'), PKF.hb ? h('button', { class: 'lnk', type: 'button', onclick: () => { PKF.hb = ''; pkResults(); } }, 'Clear') : ''), hsel),
    h('div', { class: 'fgrp', style: 'display:flex;gap:8px;align-items:center' }, h('button', { class: 'btn sm', type: 'button', onclick: pkClear }, 'Reset filters'), h('button', { class: 'btn sm', type: 'button', onclick: () => { PKF.open = false; pkResults(); } }, 'Done'), h('span', { class: 'note' }, 'The numbers say how many each choice would show.')));
}
function pkCardEl(p, pc) {
  const habs = h('div', { class: 'mons' }); if (p.hab.length) { habs.append('Habitats: '); p.hab.forEach((id, k) => { habs.append(h('button', { onclick: () => openHabitat(id) }, HAB_BY_ID.get(id).n), k < p.hab.length - 1 ? ', ' : ''); }); } else habs.append('No habitat (story or events)');
  const hm = pc.home.get(p.n);
  return h('div', { class: 'card pkcard', 'data-pk': p.n, style: openPk === p.n ? 'border-color:var(--accent)' : '' }, pkPicBtn(p, innerWidth < 600 ? 72 : 84),
    h('div', { class: 'pkbody' },
      h('div', { class: 'hd' }, pkGrip(p), h('span', { class: 'no' }, pkNo(p)), h('span', { class: 'title' }, p.n), p.ideal ? h('span', { class: 'env' }, p.ideal) : '', sizeBadge(p, () => renderPanel()), pc.att.has(p.n) ? h('span', { class: 'chip good', style: 'margin-left:auto' }, 'In plan') : ''),
      h('div', null, h('span', { class: 'note' }, p.t.join(' / ') + (p.hw ? ' · ' + p.hw[0] + ' m, ' + p.hw[1] + ' kg' : '') + ' · '), p.s.map(s => h('span', { class: 'spec' }, s))),
      p.fv && p.fv.length ? h('div', { class: 'note', style: 'margin-top:4px' }, 'Likes: ' + p.fv.map(f => FAVS[f]).join(' · ') + (p.fl ? ' · ' + p.fl : '')) : '',
      dislikesOf(p).length ? h('div', { class: 'note', style: 'margin-top:2px', 'data-tip': 'It won\'t move into a home with this in range, and it lowers its comfort, but never in its own habitat. From the guides; the "maybe" ones are only a guess, and nothing else is known to be disliked.' }, 'Dislikes: ' + dislikesOf(p).map(d => d.desc).join(' · ')) : '',
      hm ? h('div', { class: 'note' }, '⌂ Lives in ' + hm.label) : '', habs));
}
function pkPicBtn(p, d) { return h('button', { class: 'pkpbtn', type: 'button', 'aria-label': 'Adjust ' + p.n + '\'s portrait', 'data-tip': 'Adjust the portrait: the circle used where space is short', onclick: (e) => { e.stopPropagation(); pkFrameEditor(p); } }, pkPic(p, d), h('span', { class: 'pfedit', 'aria-hidden': 'true' }, icon('resize'))); }
function pkRowEl(p, pc) {
  const hm = pc.home.get(p.n);
  const open = () => { const c = pkCardEl(p, pc), less = h('button', { class: 'lnk', type: 'button', style: 'margin-left:auto', 'aria-label': 'Show less about ' + p.n, onclick: () => { const r = pkRowEl(p, pc); c.replaceWith(r); r.querySelector('.pkname').focus(); } }, 'Less'); c.classList.add('inrow'); c.querySelector('.hd').append(less); row.replaceWith(c); less.focus(); };
  const row = h('div', { class: 'row pkrow', 'data-pk': p.n }, pkGrip(p),
    h('button', { class: 'pkname', type: 'button', 'aria-label': p.n + ': show more', onclick: open }, pkFace(p, 38), h('span', { class: 'meta' }, h('div', { class: 'nm' }, h('span', { class: 'no' }, pkNo(p)), ' ', p.n, ' ', p.ideal ? h('span', { class: 'env' }, p.ideal) : ''),
      h('div', { class: 'ds' }, p.t.join('/') + ' · ' + p.s.join(', ') + (hm ? ' · ⌂ ' + hm.label : pc.att.has(p.n) ? ' · in your habitats' : '')))),
    sizeBadge(p, () => renderPanel()));
  return row;
}
function pkCanTake(p, hm) {
  const l = residentsOf(hm);
  if (l.some(r => r.p === p.n)) return { ok: false, code: 'same', why: 'lives here already' };
  if (!fitsHome(p, hm)) return { ok: false, code: 'big', why: 'too big for a den' };
  if (l.length >= hm.cap) return { ok: false, code: 'full', why: 'full' };
  return { ok: true, code: '', why: '' };
}
const pkDisAt = (p, hm) => disIn(p, homeStuff(hm, splitFloors(hm) ? (floorHasRoom(hm, 0) ? 0 : 1) : null));
function pkMoveIn(p, hm) {
  const c = pkCanTake(p, hm);
  if (!c.ok) { toast(c.code === 'full' ? hm.label + ' is full' : c.code === 'big' ? p.n + ' is too big for a den' : p.n + ' lives there already'); return false; }
  const from = homeOfPokemon(p.n), r = { p: p.n, x: hm.ax, y: hm.ay, k: hm.kind === 'kit' ? 'k' : 'h' }; if (hm.floors > 1 && !floorHasRoom(hm, 0)) r.f = 1;
  setRes((plan.res || []).filter(q => q.p !== p.n).concat([r])); commitTx(p.n + ' moved in');
  pkAfterMove();
  const w = moveInWarn(p, hm, r.f || 0); undoToast(p.n + (from ? ' moved to ' : ' moved into ') + hm.label + (w ? '.' + w : ''), w ? 7000 : 4200);
  return true;
}
function pkAfterMove() { if ($('#inspector').classList.contains('open') && selection && selection.obj && plan.objs.has(selection.obj.id) && ITEMS[selection.obj.i].cap) showObjInspector(selection.obj); }
function pkHomeChooser(p, done) {
  const homes = allHomes(), cur = homeOfPokemon(p.n);
  modal('Move ' + p.n + (cur ? '' : ' in'), (box) => {
    box.classList.add('wide');
    box.append(h('div', { class: 'pkhead' }, pkPic(p, 64), h('div', null, h('b', null, p.n), h('div', { class: 'note' }, cur ? 'Lives in ' + cur.label : 'No home yet'))));
    if (!homes.length) { box.append(h('p', { class: 'empty' }, 'No homes yet. Place a kit house from Build, or build a house: walls all round, a door and 3 kinds of furniture inside.')); return; }
    const rows = homes.map(({ hm, used }) => { const names = residentsOf(hm).map(r => r.p), others = names.map(n => PK_BY_NAME.get(n)).filter(q => q && q.n !== p.n); return { hm, used, names, c: pkCanTake(p, hm), others, cp: compat(p, others), dis: pkDisAt(p, hm) }; });
    rows.sort((a, b) => (b.c.ok - a.c.ok) || (!!a.dis.length - !!b.dis.length) || (b.cp.score - a.cp.score) || a.hm.label.localeCompare(b.hm.label));
    const l = h('div', { class: 'list' });
    for (const x of rows) {
      const bits = [x.used + '/' + x.hm.cap + (x.names.length ? '' : ', empty')];
      if (x.others.length) bits.push(x.cp.shared + ' shared like' + (x.cp.shared === 1 ? '' : 's') + (!x.cp.sameEnv ? ' · ⚠ opposite of ' + listNames(x.cp.clash) : x.cp.same ? ' · same ideal' : '') + (x.cp.fc.length ? ' · ⚠ ' + FC_TXT(x.cp.fc) : ''));
      if (!x.c.ok) bits.push(x.c.code === 'same' ? 'lives here now' : x.c.why);
      if (x.dis.length && x.c.code !== 'same') bits.push('⚠ dislikes ' + disShort(x.dis) + ' here');
      if (x.c.code === 'full' && fitsHome(p, x.hm)) {
        const sw = h('div', { class: 'reqs', style: 'margin-top:4px' }, x.names.map(n => { const q = PK_BY_NAME.get(n), fits = !cur || !q || fitsHome(q, cur); return h('button', { class: 'btn sm', type: 'button', disabled: !fits, 'data-tip': fits ? (cur ? n + ' moves to ' + cur.label : n + ' moves out to make room') : n + ' is too big for ' + cur.label, onclick: () => { closeModal(); const lb = cur ? p.n + ' and ' + n + ' swapped homes' : p.n + ' moved into ' + x.hm.label + ' instead of ' + n; resSwap(p.n, n, lb); pkAfterMove(); undoToast(lb, 4200); if (done) done(); } }, pkFace(q || n, 20), (cur ? 'Swap with ' : 'Instead of ') + n); }));
        l.append(h('div', { class: 'row', style: 'align-items:flex-start;cursor:default;flex-direction:column' }, h('span', { class: 'meta' }, h('div', { class: 'nm' }, x.hm.label), h('div', { class: 'ds', style: 'white-space:normal' }, bits.join(' · ') + ': pick who ' + (cur ? 'swaps with ' + p.n : 'makes room'))), sw));
        continue;
      }
      l.append(h('button', { class: 'row', type: 'button', disabled: !x.c.ok, style: 'align-items:flex-start', onclick: () => { closeModal(); if (pkMoveIn(p, x.hm) && done) done(); } }, h('span', { class: 'meta' }, h('div', { class: 'nm' }, x.hm.label), h('div', { class: 'ds', style: 'white-space:normal' }, bits.join(' · ')), x.names.length ? pkChips(x.names, 20) : '')));
    }
    box.append(l);
    if (cur) box.append(h('div', { class: 'acts' }, h('button', { class: 'btn sm', type: 'button', onclick: () => { closeModal(); moveOut([p.n]); commitTx(p.n + ' moved out'); undoToast(p.n + ' moved out of ' + cur.label, 4200); } }, 'Move out')));
  }, null, null, false, 'Homes with room come first, then homes with nothing it dislikes, then the best housemates: shared likes and an ideal habitat that doesn\'t clash. A full home lists who lives there: pick one to swap with. You can also drag ' + p.n + ' from the list onto a home on the map.');
}
let pkDrag = null, pkPend = null, pkQuiet = 0;
function pkUnlisten() { removeEventListener('pointermove', pkMove, true); removeEventListener('pointerup', pkUp, true); removeEventListener('pointercancel', pkUp, true); }
function pkAbort() { const P = pkPend; pkPend = null; if (P) clearTimeout(P.timer); if (!pkDrag) pkUnlisten(); }
function pkDown(e) {
  if (pkDrag || pkPend || dd || ddPend || !e.isPrimary || !plan) return;
  const src = e.target.closest && e.target.closest('[data-pk]'); if (!src) return;
  const grip = e.target.closest('.pkgrip'), mouse = e.pointerType === 'mouse';
  if (mouse && e.button !== 0) return;
  if (!grip && e.target.closest('button:not(.pkname):not(.pkpbtn), a, input, select, textarea, label, summary')) return;
  const p = PK_BY_NAME.get(src.dataset.pk); if (!p) return;
  pkPend = { id: e.pointerId, p, src, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, lp: !mouse && !grip, mouse, timer: 0 };
  if (pkPend.lp) pkPend.timer = setTimeout(() => { if (pkPend) pkStart(); }, 380);
  addEventListener('pointermove', pkMove, true); addEventListener('pointerup', pkUp, true); addEventListener('pointercancel', pkUp, true);
}
function pkMove(e) {
  const P = pkDrag || pkPend; if (!P || e.pointerId !== P.id) return;
  P.x = e.clientX; P.y = e.clientY;
  if (!pkDrag) { const d = Math.hypot(P.x - P.x0, P.y - P.y0); if (P.lp) { if (d > 9) pkAbort(); return; } if (d >= (P.mouse ? 6 : 4)) pkStart(); return; }
  e.stopPropagation(); e.preventDefault(); pkTrack();
}
function pkUp(e) {
  const P = pkDrag || pkPend; if (!P || e.pointerId !== P.id) return;
  if (!pkDrag) { pkAbort(); return; }
  e.stopPropagation(); if (e.type === 'pointerup') { P.x = e.clientX; P.y = e.clientY; pkTrack(); }
  pkEnd(e.type === 'pointerup');
}
function pkStart() {
  const P = pkPend; pkPend = null; clearTimeout(P.timer); if (!P.src.isConnected) { pkUnlisten(); return; }
  clearTimeout(TIP.press); TIP.press = 0; tipHide();
  const ae = document.activeElement; if (ae && ae.matches && ae.matches('input, textarea, select')) ae.blur();
  try { P.src.setPointerCapture(P.id); } catch (er) { }
  const homes = allHomes().map(x => x.hm); homes.sort((a, b) => (pkCanTake(P.p, b).ok - pkCanTake(P.p, a).ok) || a.label.localeCompare(b.label));
  pkDrag = Object.assign(P, { hm: null, chk: null, homes, sheet: null, ghost: h('div', { class: 'pkghost', 'aria-hidden': 'true' }) });
  document.body.append(pkDrag.ghost); P.src.classList.add('pkdragsrc'); document.body.classList.add('pkdragging');
  try { const s = getSelection(); if (s) s.removeAllRanges(); } catch (er) { }
  if (S.buzz && !P.mouse && navigator.vibrate) try { navigator.vibrate(12); } catch (er) { }
  if (innerWidth < 900 && sheetState !== 'peek') { pkDrag.sheet = sheetState; setSheet('peek'); clearTimeout(shutTimer); $('#panel').classList.remove('shut'); }
  pkTray(); pkTrack(true); requestDraw();
}
function pkTray() {
  const D = pkDrag, t = h('div', { class: 'droptray', id: 'droptray' });
  t.append(h('div', { class: 'thd' }, D.homes.length ? 'Drop ' + D.p.n + ' on a home: here or on the map' : 'No homes yet: place a kit house, or build a house with walls, a door and 3 kinds of furniture'));
  const chips = h('div', { class: 'dropchips' });
  for (const hm of D.homes) { const c = pkCanTake(D.p, hm), l = residentsOf(hm).map(r => r.p), dz = c.ok ? pkDisAt(D.p, hm) : []; chips.append(h('div', { class: 'dropchip' + (c.ok ? '' : ' no'), 'data-home': hm.key }, hm.label, h('small', null, l.length + '/' + hm.cap + (c.ok ? (dz.length ? ' · ⚠ dislikes ' + disShort(dz) : '') : ' · ' + c.why)), l.length ? pkFaces(l, 20, 6) : '')); }
  if (D.homes.length) t.append(chips);
  $('#mapwrap').append(t);
}
function pkHitHome(x, y) {
  const el = document.elementFromPoint(x, y); if (!el) return null;
  const t = el.closest('[data-home]'); if (t) return pkDrag.homes.find(hm => hm.key === t.dataset.home) || null;
  if (el !== cv) return null; const r = cv.getBoundingClientRect(), [cx, cy] = mapView.pick(x - r.left, y - r.top); return homeAt(cx, cy);
}
function pkTrack(force) {
  for (const el of [$('.app'), $('.main')]) if (el && el.scrollTop) el.scrollTop = 0;
  const D = pkDrag, hm = pkHitHome(D.x, D.y), g = D.ghost;
  if (force || (hm ? hm.key : '') !== (D.hm ? D.hm.key : '')) {
    D.hm = hm; D.chk = hm ? pkCanTake(D.p, hm) : null; D.dis = hm && D.chk.ok ? pkDisAt(D.p, hm) : []; requestDraw();
    for (const b of $$('.dropchip')) b.classList.toggle('on', !!hm && b.dataset.home === hm.key);
    g.textContent = ''; g.className = 'pkghost' + (hm ? (D.chk.ok ? ' ok' : ' no') : '');
    g.append(pkFace(D.p, 34), h('span', { class: 'gt' }, D.p.n, h('span', { class: 'to' }, !hm ? 'Drop on a home' : D.chk.ok ? '→ ' + hm.label + ' (' + residentsOf(hm).length + '/' + hm.cap + ')' + (D.dis.length ? ' · ⚠ dislikes ' + disShort(D.dis) : '') : hm.label + ': ' + D.chk.why)));
  }
  const w = g.offsetWidth, hh = g.offsetHeight;
  const gx = D.mouse ? D.x + 14 : D.x - w / 2, gy = D.mouse ? D.y + 16 : D.y - hh - 46;
  g.style.transform = 'translate(' + Math.round(clamp(gx, 6, innerWidth - w - 6)) + 'px,' + Math.round(clamp(gy, 6, innerHeight - hh - 6)) + 'px)';
}
function pkEnd(drop) {
  const D = pkDrag; if (!D) return; pkDrag = null; pkQuiet = performance.now() + 400; pkUnlisten();
  try { D.src.releasePointerCapture(D.id); } catch (er) { }
  D.ghost.remove(); D.src.classList.remove('pkdragsrc'); document.body.classList.remove('pkdragging'); const t = $('#droptray'); if (t) t.remove();
  requestDraw();
  const onMap = drop && document.elementFromPoint(D.x, D.y) === cv;
  if (D.sheet) setSheet(D.sheet);
  if (!drop) return;
  if (D.hm) pkMoveIn(D.p, D.hm); else if (onMap) toast('Drop ' + D.p.n + ' on a home');
}
function drawPkDrop(c, s) {
  const D = pkDrag, R = (hm) => hm.kind === 'kit' ? hm.ob : hm.hs.area.outer;
  c.save(); c.setLineDash([5, 4]); c.lineWidth = 2; c.strokeStyle = theme.accent;
  for (const hm of D.homes) { const r = R(hm); c.strokeRect(view.px + r.x * s - 2, view.py + r.y * s - 2, r.w * s + 4, r.h * s + 4); }
  c.setLineDash([]);
  if (D.hm) { const r = R(D.hm), col = D.chk && D.chk.ok ? theme.good : theme.bad; c.globalAlpha = 0.22; c.fillStyle = col; c.fillRect(view.px + r.x * s, view.py + r.y * s, r.w * s, r.h * s); c.globalAlpha = 1; c.lineWidth = 3; c.strokeStyle = col; c.strokeRect(view.px + r.x * s - 1.5, view.py + r.y * s - 1.5, r.w * s + 3, r.h * s + 3); }
  c.restore();
}
document.addEventListener('pointerdown', pkDown);
document.addEventListener('click', e => { if (performance.now() < Math.max(pkQuiet, ddQuiet)) { pkQuiet = ddQuiet = 0; e.preventDefault(); e.stopPropagation(); } }, true);
document.addEventListener('contextmenu', e => { if (pkDrag || pkPend || dd || ddPend) e.preventDefault(); }, true);
addEventListener('keydown', e => { if (e.key === 'Escape' && pkDrag) { e.stopPropagation(); e.preventDefault(); pkEnd(false); } }, true);
let dd = null, ddPend = null, ddQuiet = 0;
function ddOff() { removeEventListener('pointermove', ddMove, true); removeEventListener('pointerup', ddUp, true); removeEventListener('pointercancel', ddUp, true); }
function ddAbort() { const P = ddPend; ddPend = null; if (P) clearTimeout(P.timer); if (!dd) ddOff(); }
function ddDown(e) {
  if (dd || ddPend || pkDrag || pkPend || !e.isPrimary || !plan) return;
  const src = e.target.closest && e.target.closest('[data-drag]'); if (!src) return;
  const mouse = e.pointerType === 'mouse'; if (mouse && e.button !== 0) return;
  if (src.contains(e.target.closest('.info:not([data-drag]), .tipi, input, select, textarea, a, .pkchip'))) return;
  const v = src.dataset.drag, k = v.slice(0, v.indexOf(':')), n = v.slice(k.length + 1);
  const it = k === 'item' ? BY_NAME.get(n) : null, hb = k === 'hab' ? HAB_BY_ID.get(n) || HAB_BY_ID.get(+n) : null; if (!it && !hb) return;
  ddPend = { id: e.pointerId, src, it, hb, ied: !!(IED.ob && src.closest('#ied')), x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, mouse, timer: 0, key: null, at: null };
  if (!mouse) ddPend.timer = setTimeout(() => { if (ddPend) ddStart(); }, 380);
  addEventListener('pointermove', ddMove, true); addEventListener('pointerup', ddUp, true); addEventListener('pointercancel', ddUp, true);
}
function ddMove(e) {
  const P = dd || ddPend; if (!P || e.pointerId !== P.id) return;
  P.x = e.clientX; P.y = e.clientY;
  if (!dd) { const d = Math.hypot(P.x - P.x0, P.y - P.y0); if (!P.mouse) { if (d > 9) ddAbort(); return; } if (d >= 6) ddStart(); return; }
  e.stopPropagation(); e.preventDefault(); ddTrack();
}
function ddUp(e) {
  const P = dd || ddPend; if (!P || e.pointerId !== P.id) return;
  if (!dd) { ddAbort(); return; }
  e.stopPropagation(); if (e.type === 'pointerup') { P.x = e.clientX; P.y = e.clientY; ddTrack(); }
  ddEnd(e.type === 'pointerup');
}
function ddStart() {
  const P = ddPend; ddPend = null; clearTimeout(P.timer); if (!P.src.isConnected) { ddOff(); return; }
  clearTimeout(TIP.press); TIP.press = 0; tipHide();
  const ae = document.activeElement; if (ae && ae.matches && ae.matches('input, textarea, select')) ae.blur();
  try { P.src.setPointerCapture(P.id); } catch (er) { }
  dd = Object.assign(P, { was: { tool, item: curItem }, sheet: null, ghost: h('div', { class: 'pkghost', 'aria-hidden': 'true' }) });
  document.body.append(dd.ghost); P.src.classList.add('pkdragsrc'); document.body.classList.add('ddrag');
  try { const s = getSelection(); if (s) s.removeAllRanges(); } catch (er) { }
  if (S.buzz && !P.mouse && navigator.vibrate) try { navigator.vibrate(12); } catch (er) { }
  if (P.ied) iedPick(P.it);
  else {
    if (phoneUI() && sheetState !== 'peek') { dd.sheet = sheetState; setSheet('peek'); clearTimeout(shutTimer); $('#panel').classList.remove('shut'); }
    $('#inspector').classList.remove('open');
    if (P.hb) { stampHab = P.hb; if (tool !== 'stamp') setTool('stamp'); else renderOptbar(); } else { if (curItem !== P.it.n) selectItem(P.it.n, false); if (tool !== 'place') setTool('place'); }
  }
  ddTrack(true);
}
function ddAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (dd.ied) { const c = $('#iedCv'); if (!c || el !== c) return null; const r = c.getBoundingClientRect(), cx = Math.floor((x - r.left - IED.ox) / IED.cs), cy = Math.floor((y - r.top - IED.oy) / IED.cs), ki = kitInfo(IED.ob); return cx >= 0 && cy >= 0 && cx < ki.w && cy < ki.h ? [cx, cy] : null; }
  if (el !== cv) return null; const r = cv.getBoundingClientRect(), sx = x - r.left, sy = y - r.top, [cx, cy] = mapView.pick(sx, sy); return inB(plan, cx, cy) ? [cx, cy, sx, sy] : null;
}
function ddTrack(force) {
  const D = dd, at = ddAt(D.x, D.y), key = at ? at[0] + ',' + at[1] : '', g = D.ghost;
  if (force || key !== D.key) {
    D.key = key; D.at = at;
    if (D.ied) { IED.hover = at; iedDraw(); } else { hover = at ? [at[0], at[1]] : null; updateStatus(); requestDraw(); }
    g.textContent = ''; g.className = 'pkghost' + (at ? ' ok' : '');
    g.append(D.it ? swatchEl(D.it, 'swatch big') : h('span', { class: 'gi' }, icon('stamp')), h('span', { class: 'gt' }, D.it ? D.it.n : D.hb.n, h('span', { class: 'to' }, at ? (D.ied ? 'Drop to place it here' : 'Drop at ' + at[0] + ', ' + at[1]) : D.ied ? 'Drop it in the room' : 'Drop it on the map')));
  }
  const w = g.offsetWidth, hh = g.offsetHeight, gx = D.mouse ? D.x + 14 : D.x - w / 2, gy = D.mouse ? D.y + 16 : D.y - hh - 46;
  g.style.transform = 'translate(' + Math.round(clamp(gx, 6, innerWidth - w - 6)) + 'px,' + Math.round(clamp(gy, 6, innerHeight - hh - 6)) + 'px)';
}
function ddEnd(drop) {
  const D = dd; if (!D) return; dd = null; ddQuiet = D.mouse ? performance.now() + 400 : 0; ddOff();
  try { D.src.releasePointerCapture(D.id); } catch (er) { }
  D.ghost.remove(); D.src.classList.remove('pkdragsrc'); document.body.classList.remove('ddrag');
  const at = drop ? D.at : null;
  if (D.ied) { IED.hover = null; if (at) { if (iedPut(at[0], at[1], D.it.i)) iedEnd(); else { const [w, hh] = iedPlaceSize(D.it.i); toast('No room for its ' + w + '×' + hh + ' size here'); } } iedFoot(); iedDraw(); return; }
  hover = null;
  if (!at) { if (D.it && D.was.item !== curItem) selectItem(D.was.item, false); setTool(D.was.tool === 'stamp' && !D.it ? S.tool : D.was.tool); if (D.sheet) setSheet(D.sheet); if (drop) toast('Drop it on the map'); requestDraw(); return; }
  if (D.hb) stampHabitat(D.hb, at[0], at[1]);
  else { startAction(at[0], at[1], at[2], at[3]); const d = drag; drag = null; if (d) finishDrag(d); }
  requestDraw();
}
document.addEventListener('pointerdown', ddDown);
document.addEventListener('touchmove', e => { if (dd && e.cancelable) e.preventDefault(); }, { passive: false });
addEventListener('keydown', e => { if (e.key === 'Escape' && dd) { e.stopPropagation(); e.preventDefault(); ddEnd(false); } }, true);

const WX_TIP = 'The weather in this town. In the game it only changes when a Pokémon uses a Rain Dance or Sunny Day spot, and then it stays. Rain puts out fires with no roof over them for as long as it rains, and turns Smooth Rock off except inside kit houses. Sun changes nothing in the planner yet.';
function setWeather(v) { if ((plan.wx || null) === v) return; plan.wx = v; markDirty(); evaluateAll(); requestDraw(); renderPanel(); refreshInspector(); toast(v === 'rain' ? 'Raining in this town' : v === 'sun' ? 'Sunny in this town' : 'Weather not set'); }
function refreshInspector() { if (!$('#inspector').classList.contains('open') || !selection) return; if (selection.obj && plan.objs.has(selection.obj.id)) showObjInspector(selection.obj); else if (selection.zone) { const z = plan.zones.find(q => q.id === selection.zone.id); if (z) selectZone(z); } else if (selection.house) { const hs = houseById.get(selection.house); if (hs) selectHouse(hs); } }
function renderPlans() {
  const root = $('#tab-plans'); root.textContent = '';
  root.append(h('h2', { class: 'hrow' }, 'Plans', tipBtn('Keep a plan per town or project. Changes save automatically.')));
  const nameIn = h('input', { id: 'pName', value: plan.name }); nameIn.onchange = () => { plan.name = nameIn.value.trim() || 'Untitled area'; markDirty(); updateHeader(); };
  const areaSel = h('select', { id: 'pArea' }, DATA.areas.map(a => h('option', { value: a.n, selected: plan.area === a.n }, a.n))); areaSel.onchange = () => { plan.area = areaSel.value; markDirty(); updateHeader(); evaluateAll(); requestDraw(); renderPlans(); };
  const area = DATA.areas.find(a => a.n === plan.area);
  const wxSeg = segmented([[null, 'Not set'], ['rain', 'Rain'], ['sun', 'Sun']], plan.wx || null, v => setWeather(v), 'Weather');
  root.append(h('div', { class: 'card' }, h('div', { class: 'field' }, h('label', { for: 'pName' }, 'Plan name'), nameIn), h('div', { class: 'field' }, h('label', { for: 'pArea', class: 'hrow' }, 'Area', area ? tipBtn(area.d) : ''), areaSel),
    h('div', { class: 'field' }, h('label', { class: 'hrow' }, 'Weather', tipBtn(WX_TIP)), wxSeg),
    h('p', { class: 'note' }, plan.w + '×' + plan.h + ' tiles · ' + plan.objs.size + ' items · ' + plan.zones.length + ' zones'),
    h('div', { class: 'acts' }, ibtn('resize', 'Resize plan', resizePlanDialog, 'sm'), ibtn('copy', 'Duplicate', duplicatePlan, 'sm'), ibtn('trash', 'Delete plan', () => deletePlanDialog(plan.id), 'sm danger'))));
  const file = h('input', { id: 'importFile', type: 'file', accept: '.json,application/json', style: 'display:none', onchange: importJSON });
  root.append(h('div', { style: 'display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin:2px 0 8px' }, h('button', { class: 'btn sm primary', onclick: newPlanDialog }, icon('plus'), 'New plan'),
    downloads ? ibtn('image', 'Save as image', exportPNG, 'sm') : '',
    downloads ? ibtn('down', 'Export plan file', exportJSON, 'sm') : ibtn('copy', 'Copy plan data', () => copyText(JSON.stringify(serialize(plan))), 'sm'),
    ibtn('up', 'Import plan file', () => file.click(), 'sm'), file));
  root.append(h('h4', { class: 'hrow' }, 'Game towns', tipBtn(TOWN_TIP)), townButtons());
  root.append(syncCard());
  root.append(h('p', { class: 'note hrow', style: 'margin:4px 0' }, ...storageNote()));
  root.append(h('p', { class: 'note picline', style: 'margin:4px 0' })); picUI();
  root.append(h('p', { class: 'note', style: 'margin:4px 0;display:flex;align-items:center;gap:6px;flex-wrap:wrap' }, 'Version ' + appVersion(), ibtn('rotate', 'Check for updates', updateNow, 'sm')));
  root.append(h('h4', null, 'All plans (' + plansIndex.length + ')'));
  { const cp = syncCopies(); if (cp.length) root.append(h('div', { class: 'card' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, cp.length + ' sync ' + (cp.length === 1 ? 'copy' : 'copies')), tipBtn('When a plan changed in two places before they synced, the older version was set aside as a copy named “from another device” or “from this device”. The plan under its own name has the newest version.'), h('button', { class: 'btn sm', style: 'margin-left:auto', onclick: tidyCopiesDialog }, icon('trash'), 'Remove copies')))); }
  for (const p of [...plansIndex].sort((a, b) => b.updated - a.updated)) {
    const cur = p.id === plan.id;
    root.append(h('div', { class: 'card', style: cur ? 'border-color:var(--accent)' : '' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, p.name), cur ? h('span', { class: 'chip', style: 'margin-left:auto' }, 'Open') : ''), h('div', { class: 'note' }, p.area + ' · ' + p.w + '×' + p.h + ' · ' + new Date(p.updated).toLocaleString()), cur ? '' : h('div', { class: 'acts' }, h('button', { class: 'btn sm', onclick: () => openPlan(p.id) }, 'Open'), ibtn('trash', 'Delete plan', () => deletePlanDialog(p.id), 'sm danger'))));
  }
  root.append(h('h4', { class: 'hrow' }, 'How it works', h('span', { class: 'note' }, 'tap a topic')));
  root.append(h('div', { class: 'reqs' }, [
    ['Painting', 'Paint terrain and plants with Place; drag Fill for big areas. Liquids (Water, Ocean, Muddy, Hot-spring, Lava, Waterfall) count toward habitat needs. With a liquid picked, Pour drops a source that flows as in the game; tap the tile again to pour it.'],
    ['Game towns', 'Plans → Game towns, or New plan → Start from, opens one of the five story towns at full size as the game\'s map lays it out, with the Pokémon Center and your house in place. Each opens as a new plan, so the town is always there to start again from.'],
    ['Zones', 'Draw a Zone around a cluster. It checks the cluster against all ' + HAB.length + ' habitats and turns green when one forms.'],
    ['Terrain levels', 'Every block has a level, terrain too. Terrain starts at level 0, so things on the ground are on level 1. Place terrain to stack a block on top and build hills; Paint swaps the top block instead. Erase takes the top block off, so you can dig down. A 2-level rise inside a zone counts as a "High-up location".'],
    ['Stacking', 'Everything you place goes on top of the highest block at that spot, kit houses too. Blocks, walls and terrain can go on top of items; items never go on top of other items, only on terrain or a block. Items have a height: most take 1 level, tall ones such as a refrigerator take 2, and rugs take none, so furniture stands on them. Heights are guesses until you set them with Resize.'],
    ['Layers', 'Every level is a layer, from −99 to 99, with its own terrain and items. In Layers (or L), tap an eye to hide or show a level, the rugs or all terrain, and tap a level to work on it (Go to level, or Page Up and Page Down, reach any other; the Level menu in the Place, Fill and Erase bars does the same): Place and Fill put things there, Erase only takes from there, and everything above fades out so you can see into a basement. With On top, blocks and terrain stack on what\'s there; on a chosen level, Keep or Replace decides what happens to what\'s already there.'],
    ['Active areas', 'Show on the map, by the zoom controls (or S), then Active areas (or A), shows the white dotted line the game shows with the right stick: 4 tiles past a home on every side, 4 levels up or down. Light, warmth and humidity in a house you built only count the floor inside the walls.'],
    ['Houses you build', 'Found automatically: any space closed in by walls or fences, with a door or gate, 2×2 to 9×10 inside and 3 kinds of furniture at the door\'s level. Fill → Outline lays walls fast.'],
    ['Moving Pokémon in', 'In the Pokémon tab, drag a Pokémon by its dots onto a home: a kit house or a house you built on the map, or one in the tray that opens. On a phone the panel slides down while you drag; long-press a card to drag it too, and with a mouse drag the whole card. Tap the dots instead to choose a home from a list. Undo puts it back.'],
    ['Pokédex search', 'Filters narrow by status, Pokédex, type, specialty, ideal habitat, size, flavour, likes and habitat; each number says how many that choice would show. In the search box every word must match, and type:, spec:, likes:, ideal:, flavour:, hab:, home:, size: and no: look in one place only. "Quotes" keep a phrase together and a - in front leaves those out.'],
    ['Residents', 'Tap a house or kit house to choose who lives there. Comfort shows the best each one can reach there and what to add next: a rest item it fits on, toys and decorations, its ideal habitat and its favourite food, with favourites counting double. Decorate lists their favourite kinds of things, ticks what\'s already there and suggests items, including ones that bring light, warmth or humidity to what they like. Grass types dislike fire and Fire types dislike water: they won\'t move in near it.'],
    ['Portraits', 'Every Pokémon shows its picture from the game: the full picture where there is room, a round portrait of its face where space is short, and only portraits on the map. Portraits are framed automatically; to fix one, tap the picture on its Pokédex card, drag the circle onto the face and zoom. Yours syncs.'],
    ['Pokémon sizes', 'Large ones were tested by players (too big for dens); small or medium with a ? is a guess from height and weight. Tap a size to change it; yours syncs. Each Pokémon needs a rest item at least its size: 1×1 small, 2×1 medium, 2×2 large.'],
    ['Doors and windows', 'They go into walls: tap a wall piece to put one in, and it turns to follow the wall. Move, turn or delete it and the wall closes up again (erase the wall piece too for an open gap). Other items never cover walls. Doors, gates and fences can be more than one level high: set it with Resize, so a door 2 high fills a wall 2 high.'],
    ['Show on the map', 'The button by the zoom controls (or S) turns on what\'s drawn over the map: active areas, how far items reach, which fields are wet, switches and sensors with what they work, Litter drops, and power networks. A selected item always shows its own.'],
    ['Problems and limits', 'The ⚠ chip at the bottom left lists what won\'t work as planned: over a game limit, no power, dry crops, a switch that reaches nothing, a machine nobody runs and more. Show takes you to each one. Materials ends with the game\'s per-area limits.'],
    ['Weather and fire', 'Set the town\'s weather in Plans. Fires count only when a Burn Pokémon lives within 4 tiles to light them; rain puts out fires with no roof, turns Smooth Rocks off and waters open fields.'],
    ['Power', 'Generators link to a transmitter within 10 tiles, transmitters link within 15 and power up to 20 items within 10, never more than 5 levels up or down. Using more than you make turns the whole network off. Items join a transmitter in the order you placed them.'],
    ['Switches and sensors', 'Floor switches reach a 5×5×5 cube, wall switches and card readers 7×7×7, and a laser sensor watches the tiles in front of it and works 11 cells around it. They need no power or wires; what they work does, if it\'s a light or appliance.'],
    ['Fields and crops', 'A crop grows a stage each day it\'s wet: water beside it, a running sprinkler within 5 tiles, rain with no roof, or a Water Pokémon with a water basin. 3 days to ripe, 1 with a Grow Pokémon nearby. Smooth Rock dries fields within 4 tiles.'],
    ['Pouring liquids', 'Pick a liquid, choose Pour, tap a tile to see where it flows, and tap again to pour: 25 tiles along a 1-wide channel, 10 in a 2-wide one, about 6 out on open ground, starting again below every drop. Erasing the source takes the whole flow away.'],
    ['Pokémon at work', 'Litter Pokémon drop their material around their home, Chop, Burn, Crush and Recycle Pokémon work from the nearest community box, and furnaces and mixers need a Burn or Crush Pokémon nearby. Homes and boxes say who does what.'],
    ['Game rules', 'Where guides disagree (sensor, sprinkler, Smooth Rock and generator reach), Settings → Game rules picks the reading the planner uses.'],
    ['Drag and drop', 'Drag an item from Build, the recent items or the bar above the map onto the map to place it; a habitat card onto the map to stamp it; an item into the room in Decorate inside; a Pokémon onto a home; and a plan file onto the window to open it. On a phone, press and hold first. A selected item moves when you drag it, with any tool.'],
    ['Tooltips', 'Hover, long-press or tap ⓘ for the details behind any button or chip.'],
    ['Shortcuts', 'S show on the map, A active areas, L layers, Enter pour a previewed liquid, Esc cancel, Page Up/Down level, B place, R fill, E erase, V select, Z zone, I pick, H pan, Q turns the item (Shift+Q the other way), [ ] brush, Space+drag pan.']
  ].map(([lb, t]) => h('span', { class: 'req', 'data-tip': t }, lb))));
  root.append(h('h4', { class: 'hrow' }, 'Data sources', tipBtn('Community-researched data current to the game\'s Bubbly Basin update and the autumn 2026 event. Kit footprints marked estimated and group memberships (Seat, Table, Toy…) may differ slightly in game. Fan-made planner, not affiliated with Nintendo or The Pokémon Company.')));
  root.append(h('ul', { class: 'srcs', style: 'padding-left:18px;margin:0' }, DATA.sources.map(([t, u]) => h('li', null, h('a', { href: u, target: '_blank', rel: 'noopener' }, t)))));
}
function newPlanDialog() {
  modal('New plan', (box) => {
    const from = h('select', { id: 'npFrom' }, h('option', { value: '' }, 'Empty grid'), TOWNS.map(([f, n, w]) => h('option', { value: f }, n + ' as in the game (' + w + '×' + w + ')')));
    box.append(h('div', { class: 'field' }, h('label', { for: 'npFrom', class: 'hrow' }, 'Start from', tipBtn(TOWN_TIP)), from));
    box.append(h('div', { class: 'field' }, h('label', { for: 'npName' }, 'Name'), h('input', { id: 'npName', value: 'My ' + (plan ? plan.area : 'Withered Wasteland') + ' plan' })));
    box.append(h('div', { class: 'field' }, h('label', { for: 'npArea' }, 'Area'), h('select', { id: 'npArea' }, DATA.areas.map(a => h('option', { value: a.n, selected: plan && plan.area === a.n }, a.n)))));
    box.append(h('div', { class: 'grid2' }, h('div', { class: 'field' }, h('label', { for: 'npW' }, 'Width (tiles)'), h('input', { id: 'npW', type: 'number', min: 8, max: PMAX, value: 64 })), h('div', { class: 'field' }, h('label', { for: 'npH' }, 'Depth (tiles)'), h('input', { id: 'npH', type: 'number', min: 8, max: PMAX, value: 48 }))));
    const tSel = h('select', { id: 'npFill' }, h('option', { value: '' }, 'Empty grid'), ITEMS.filter(i => i.c === 'Terrain').map(i => h('option', { value: i.n, selected: i.n === 'Ordinary soil' }, i.n)));
    box.append(h('div', { class: 'field' }, h('label', { for: 'npFill' }, 'Start with ground'), tSel));
    from.onchange = () => { const t = TOWNS.find(q => q[0] === from.value); for (const id of ['npW', 'npH', 'npFill', 'npArea']) $('#' + id).disabled = !!t; if (t) { $('#npArea').value = t[1]; $('#npW').value = t[2]; $('#npH').value = t[2]; $('#npName').value = t[1]; } };
  }, 'Create', () => { if ($('#npFrom').value) { openTown($('#npFrom').value, $('#npName').value); return; } const w = clamp(+$('#npW').value | 0, 8, PMAX), hh = clamp(+$('#npH').value | 0, 8, PMAX); const p = newPlan({ name: $('#npName').value.trim() || 'New plan', area: $('#npArea').value, w, h: hh, fill: $('#npFill').value }); installPlan(p); persistNow(); toMap(); toast('Created ' + p.name); });
}
function resizePlanDialog() {
  modal('Resize plan', (box) => {
    box.append(h('p', { class: 'sub' }, 'Grows or crops at the bottom-right; items outside are removed.'));
    box.append(h('div', { class: 'grid2' }, h('div', { class: 'field' }, h('label', { for: 'rzW' }, 'Width'), h('input', { id: 'rzW', type: 'number', min: 8, max: PMAX, value: plan.w })), h('div', { class: 'field' }, h('label', { for: 'rzH' }, 'Depth'), h('input', { id: 'rzH', type: 'number', min: 8, max: PMAX, value: plan.h }))));
  }, 'Resize', () => {
    const w = clamp(+$('#rzW').value | 0, 8, PMAX), hh = clamp(+$('#rzH').value | 0, 8, PMAX);
    const s = serialize(plan); const old = deserialize(s); const p = newPlan({ name: plan.name, area: plan.area, w, h: hh }); p.id = plan.id; p.inv = plan.inv; p.isz = old.isz;
    for (let j = 0; j < old.tz.length; j++) { const z = old.tz[j], T = old.tt[j], D = tLayer(p, z); for (let y = 0; y < Math.min(hh, old.h); y++) for (let x = 0; x < Math.min(w, old.w); x++) D[y * w + x] = T[y * old.w + x]; }
    for (const ob of old.objs.values()) if (ob.x + ob.w <= w && ob.y + ob.h <= hh) { const n = { ...ob, id: p.nextId++ }; p.objs.set(n.id, n); stampOcc(p, n, n.id); }
    for (const r of old.rugs.values()) if (r.x + r.w <= w && r.y + r.h <= hh) { const n = { ...r, id: p.nextId++ }; p.rugs.set(n.id, n); }
    p.res = (old.res || []).filter(r => r.x < w && r.y < hh); p.roofs = (old.roofs || []).filter(r => r.x < w && r.y < hh);
    p.zones = old.zones.filter(z => z.x < w && z.y < hh).map(z => ({ ...z, w: Math.min(z.w, w - z.x), h: Math.min(z.h, hh - z.y) }));
    installPlan(p); markDirty(); toMap(); toast('Resized to ' + w + ' × ' + hh);
  });
}
const TOWNS = [['withered-wasteland', 'Withered Wasteland', 240], ['bleak-beach', 'Bleak Beach', 272], ['rocky-ridges', 'Rocky Ridges', 272], ['sparkling-skylands', 'Sparkling Skylands', 352], ['palette-town', 'Palette Town', 384]];
const TOWN_TIP = 'The five story towns at full size, laid out as the game\'s own map shows them: sea, coast, grass, sand, paths, rock and buildings, with the Pokémon Center and your house where the game has them, and the trees the map marks. The game\'s map draws every 8×8 tiles as one square, so edges are square and small details are missing. Heights are a guide: the map doesn\'t show them. Each one opens as a new plan, and the town itself stays here, so you can start again from it at any time.';
async function openTown(file, name) {
  const t = TOWNS.find(q => q[0] === file); if (!t) return;
  let s; try { const r = await fetch('towns/' + file + '.json'); if (!r.ok) throw new Error(r.status); s = await r.json(); } catch (e) { toast('Couldn\'t load ' + t[1] + '. Try again when you\'re online.'); return; }
  let nm = (name || '').trim(); if (!nm) { const used = new Set(plansIndex.map(q => q.name)); nm = t[1]; for (let k = 2; used.has(nm); k++) nm = t[1] + ' ' + k; }
  s.id = uid(); s.name = nm; s.updated = Date.now();
  let p; try { p = deserialize(s); } catch (e) { toast('That town could not be opened'); return; }
  for (const z of p.zones) z.id = uid();
  if (dirty) persistNow(); installPlan(p); persistNow(); toMap(); toast('New plan of ' + t[1] + ' · ' + p.w + '×' + p.h + ' tiles');
}
function townButtons() { return h('div', { style: 'display:flex;gap:5px;flex-wrap:wrap;margin:0 0 8px' }, TOWNS.map(([f, n, w]) => h('button', { class: 'btn sm', 'data-tip': 'New plan of ' + n + ', ' + w + '×' + w + ' tiles', onclick: () => openTown(f) }, icon('map'), n))); }
function duplicatePlan() { const s = serialize(plan); s.id = uid(); s.name = plan.name + ' (copy)'; s.updated = Date.now(); const p = deserialize(s); installPlan(p); persistNow(); toast('Duplicated'); }
function deletePlanDialog(id) {
  const meta = plansIndex.find(p => p.id === id); if (!meta) return;
  modal('Delete "' + meta.name + '"?', (box) => box.append(h('p', { class: 'sub' }, 'Removes it from this device' + (syncOn() ? ' and your synced devices' : cloud ? ' and your account' : '') + '. This can\'t be undone.')), 'Delete', async () => {
    plansIndex = plansIndex.filter(p => p.id !== id); LS.del(LSK + 'plan:' + id); saveIndex(); if (cloud) { try { await cloud.col.doc(id).delete(); } catch (e) { } }
    if (sync) { sync.gone = [...new Set([...(sync.gone || []), id])]; saveSync(); scheduleSync(300); }
    if (plan.id === id) { if (plansIndex.length) openPlan(plansIndex[0].id); else installPlan(makeExample()); persistNow(); }
    renderPlans();
  }, true);
}

const SET_SECS = [['look', 'Appearance', 'eye'], ['map', 'Map', 'map'], ['controls', 'Controls', 'hand'], ['notices', 'Notices', 'info'], ['layout', 'Layout', 'expand'], ['updates', 'Updates and offline', 'down'], ['rules', 'Game rules', 'filter'], ['data', 'Data', 'list']];
const ACCENT_NAMES = { purple: ['Purple', '#9b55c9'], blue: ['Blue', '#3a6ad4'], teal: ['Teal', '#137677'], pink: ['Pink', '#bc3c74'], orange: ['Orange', '#b0521a'] };
const KEYS = [['H', 'Pan'], ['V', 'Select'], ['B', 'Place'], ['R', 'Fill'], ['E', 'Erase'], ['Z', 'Zone'], ['I', 'Pick an item from the map'], ['Q', 'Turn what you\'re placing, pasting or have selected (Shift: the other way)'], ['F', 'Flip the selection or what you\'re pasting (Shift: top to bottom)'], ['[| |]', 'Smaller or bigger brush'], ['A', 'Every home\'s active area'], ['S', 'Show on the map'], ['Enter', 'Pour the liquid you previewed'], ['L', 'Layers'], [',| |.', 'Turn the 3D view'], ['T', 'Look from the top, at an angle, from a low angle or side on (Shift: the other way)'], ['Right button|drag', 'Turn and tilt the 3D view'], ['Page Up|/|Page Down', 'Work a level up or down'], ['Space|+|drag', 'Pan with any tool'], ['Ctrl|+|Z', 'Undo'], ['Ctrl|+|Y', 'Redo'], ['Shift|+|click', 'Add an item to the selection or take it away'], ['Shift|+|drag', 'Add an area to the selection'], ['Ctrl|+|A', 'Select everything'], ['Ctrl|+|C', 'Copy the selection'], ['Ctrl|+|V', 'Paste'], ['Ctrl|+|D', 'Duplicate the selection'], ['Arrow keys', 'Nudge the selection (Shift: 5 squares)'], ['Delete', 'Delete what\'s selected'], ['Esc', 'Close or cancel']];
let setsBack = null, setsAfter = null, setsWant = null;
const setsOpen = () => !$('#sets').hidden;
function applyLook() { pokopiaLook(S); readTheme(); }
function busyNow() { return !!(drag || pinch || pkDrag || IED.ob || setsOpen() || $('#modal').classList.contains('open') || (document.activeElement && document.activeElement.matches('input, textarea, select'))); }
function savePrefs() { const o = {}; for (const k in SET_DEF) if (S[k] !== SET_DEF[k]) o[k] = S[k]; if (Object.keys(o).length) LS.set(SET_KEY, JSON.stringify(o)); else LS.del(SET_KEY); }
function setPref(k, v) {
  S[k] = v; savePrefs();
  if (['theme', 'accent', 'motion', 'side', 'width'].includes(k)) applyLook();
  if (k === 'tool' && ['pan', 'select'].includes(tool)) setTool(v);
  if (k === 'status') updateStatus();
  if (k === 'map3d') { if (v) enter3d(); else leave3d(); }
  if (/^g[A-Z]/.test(k) && plan) { evaluateAll(); requestDraw(); renderPanel(); refreshInspector(); }
  if (k === 'tips' && !v) tipHide();
  if (k === 'offline') { if (v) fillPictures(); else picFill.force = false; picUI(); setsPics(); }
  requestDraw();
}
function openSettings(sec) {
  const el = $('#sets'); if (!el.hidden) { if (sec) setsJump(sec); return; }
  tipHide(); setsBack = document.activeElement; el.hidden = false; $('.app').inert = true; renderSettings();
  try { history.pushState({ sets: 1 }, '', location.href); } catch (e) { }
  if (sec) setsJump(sec, true);
  setTimeout(() => { const w = el.querySelector('.win'); if (w) w.focus({ preventScroll: true }); }, 30);
}
function closeSettings(then) {
  const el = $('#sets'); if (el.hidden) return; el.hidden = true; el.textContent = ''; $('.app').inert = false; tipHide();
  if (setsBack && setsBack.isConnected && setsBack.focus) setsBack.focus({ preventScroll: true }); setsBack = null;
  const fn = typeof then === 'function' ? then : null;
  if (history.state && history.state.sets) { setsAfter = fn; try { history.back(); return; } catch (e) { setsAfter = null; } }
  if (fn) fn();
}
addEventListener('popstate', () => { if (setsOpen()) { const el = $('#sets'); el.hidden = true; el.textContent = ''; $('.app').inert = false; tipHide(); setsBack = null; } const fn = setsAfter; setsAfter = null; if (fn) fn(); });
function setsJump(id, now) { const sc = $('#sets .sscroll'), sec = document.getElementById('sets-' + id); setsWant = id; if (sc && sec) sc.scrollTo({ top: sec.offsetTop - 2, behavior: now || calm() ? 'auto' : 'smooth' }); }
function renderSettings() {
  const el = $('#sets'), keep = el.querySelector('.sscroll'), top = keep ? keep.scrollTop : 0; el.textContent = '';
  const scroll = h('div', { class: 'sscroll' }), nav = h('nav', { class: 'snav', 'aria-label': 'Sections' });
  el.append(h('div', { class: 'win', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'setsTitle', tabindex: '-1' },
    h('div', { class: 'shead' }, h('h2', { id: 'setsTitle' }, 'Settings'), h('span', { class: 'note' }, 'Saved on this device'), h('button', { class: 'close', type: 'button', 'aria-label': 'Close settings', 'data-tip': 'Close (Esc)', onclick: () => closeSettings() }, icon('close'))),
    h('div', { class: 'sbody' }, nav, scroll)));
  el.onclick = (e) => { if (e.target === el) closeSettings(); };
  const seg = (k, opts, label) => {
    const g = h('span', { class: 'seg', role: 'group', 'aria-label': label });
    const paint = () => { for (const b of g.children) b.setAttribute('aria-pressed', b.dataset.v === S[k] ? 'true' : 'false'); };
    for (const [v, t] of opts) g.append(h('button', { type: 'button', 'data-v': v, onclick: () => { setPref(k, v); paint(); } }, t));
    paint(); return g;
  };
  const sw = (k, label, get, set) => {
    const b = h('button', { type: 'button', class: 'sw', role: 'switch', 'aria-label': label }), val = () => get ? get() : S[k];
    const paint = () => b.setAttribute('aria-checked', val() ? 'true' : 'false');
    b.onclick = () => { if (set) set(!val()); else setPref(k, !val()); paint(); }; paint(); return b;
  };
  const row = (title, note, ...ctl) => h('div', { class: 'srow' }, h('div', { class: 'stxt' }, typeof note === 'string' ? h('b', { class: 'hrow' }, title, tipBtn(note)) : h('b', null, title), typeof note === 'string' ? '' : note || ''), ctl.length ? h('div', { class: 'sctl' }, ...ctl) : '');
  const sec = (id, ...rows) => { const [, t, ic] = SET_SECS.find(q => q[0] === id), tip = typeof rows[0] === 'string' ? rows.shift() : ''; scroll.append(h('section', { class: 'ssec', id: 'sets-' + id, 'aria-labelledby': 'setsH-' + id }, h('h3', { id: 'setsH-' + id }, icon(ic), t, tipBtn(tip)), ...rows)); nav.append(h('button', { type: 'button', 'data-sec': id, onclick: () => setsJump(id) }, icon(ic), t)); };
  const sws = h('div', { class: 'swatches', role: 'group', 'aria-label': 'Accent colour' });
  const paintSw = () => { for (const b of sws.children) b.setAttribute('aria-pressed', b.dataset.v === S.accent ? 'true' : 'false'); };
  for (const [v, [n, c]] of Object.entries(ACCENT_NAMES)) sws.append(h('button', { type: 'button', 'data-v': v, 'aria-label': n, 'data-tip': n, style: '--c:' + c, onclick: () => { setPref('accent', v); paintSw(); } }));
  paintSw();
  sec('look',
    row('Theme', 'System follows your device\'s light or dark mode.', seg('theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']], 'Theme')),
    row('Accent colour', 'Buttons, the chosen tool and highlights on the map.', sws),
    row('Animations', 'System follows your device\'s reduce-motion setting. Off also skips the zoom glide, sliding panels and sparkles.', seg('motion', [['system', 'System'], ['on', 'On'], ['off', 'Off']], 'Animations')));
  sec('map',
    row('3D view', gl2ok() ? 'The map in 3D: turn it, tilt it and see inside houses. It opens looking straight down. Off shows the flat map.' : 'This browser doesn\'t have WebGL 2, so the planner uses the flat map.', gl2ok() ? sw('map3d', '3D view') : ''),
    row('Grid lines', 'Thin lines between tiles, and stronger ones every 8 tiles.', seg('grid', [['all', 'All'], ['blocks', 'Every 8 tiles'], ['off', 'None']], 'Grid lines')),
    row('Height shading', 'On the flat map: lighter high ground, darker low ground, shadows below cliffs and level numbers when zoomed in.', sw('shade', 'Height shading')),
    row('Pictures on the map', 'Item and terrain pictures from the game. Off draws simple shapes and colours, which is quicker on older phones.', sw('pics', 'Pictures on the map')),
    row('Portraits on homes', 'Faces of the Pokémon living in each house and kit home.', sw('faces', 'Portraits on homes')),
    row('Labels on zones and houses', 'The name and status above each zone and each house you built.', sw('labels', 'Labels on zones and houses')),
    row('Every home\'s active area', 'The dotted line 4 tiles around each home. Show on the map, by the zoom controls, or A, does the same.', sw(null, 'Every home\'s active area', () => showAreas, v => setShowAreas(v))),
    row('Info at the bottom of the map', 'Tile position, what\'s under the pointer and the zoom level.', sw('status', 'Info at the bottom of the map')));
  sec('controls',
    row('Default tool', 'The tool when the app opens, and after you finish stamping, pasting or moving. Pan: dragging moves the map and a tap shows details. Select: dragging moves items or selects an area.', seg('tool', [['pan', 'Pan'], ['select', 'Select']], 'Default tool')),
    row('Mouse wheel', 'Scrolls: the wheel moves the map, and Ctrl + wheel or a touchpad pinch zooms.', seg('wheel', [['zoom', 'Zooms'], ['pan', 'Scrolls']], 'Mouse wheel')),
    row('Tooltips', 'A tip when you point at a button with the mouse or long-press it. Off: only the ⓘ buttons show tips.', sw('tips', 'Tooltips')),
    row('Vibration', 'A short buzz on Android when you pick up a Pokémon to drag it.', sw('buzz', 'Vibration')),
    h('details', null, h('summary', null, 'Keyboard shortcuts'), h('div', { class: 'keys' }, KEYS.flatMap(([k, t]) => [h('span', null, k.split('|').map(p => p === ' ' ? ' ' : ['+', '/', 'drag', 'click'].includes(p) ? ' ' + p + ' ' : h('kbd', null, p))), h('span', null, t)]))));
  sec('notices',
    row('How long notices stay', 'Notices with a button, such as Undo, stay longer either way, and pointing at one keeps it open.', seg('toast', [['short', 'Short'], ['normal', 'Normal'], ['long', 'Long']], 'How long notices stay'), h('button', { class: 'btn sm', type: 'button', onclick: () => toast('This is how long a notice stays', 2400, null, 'try') }, 'Try it')),
    row('Celebrate new habitats', 'Sparkles on the map when a habitat forms or a house becomes habitable. The notice shows either way.', sw('party', 'Celebrate new habitats')));
  sec('layout',
    row('Panel side', 'On wide screens, such as a PC or a tablet held sideways.', seg('side', [['left', 'Left'], ['right', 'Right']], 'Panel side')),
    row('Panel width', 'On wide screens.', seg('width', [['narrow', 'Narrow'], ['normal', 'Normal'], ['wide', 'Wide']], 'Panel width')),
    row('Phone panel', 'On phones and narrow windows: how far the panel opens when you tap a tab.', seg('sheet', [['half', 'Halfway'], ['full', 'Full height']], 'Phone panel')),
    row('Open on', 'The tab that shows when the app opens.', seg('start', [['last', 'Last tab used'], ['build', 'Build']], 'Open on')));
  sec('updates',
    row('New versions', 'Ask me: a notice with Open it. Straight away: the new version opens as soon as it\'s ready, unless you\'re in the middle of something.', seg('updates', [['ask', 'Ask me'], ['auto', 'Straight away']], 'New versions')),
    row('Version ' + appVersion(), 'Looks for a newer version now.', h('button', { class: 'btn sm', type: 'button', onclick: updateNow }, 'Check for updates')),
    row('Save pictures for offline use', h('span', null, h('span', { class: 'note picline' }), h('span', { id: 'setsPicN', class: 'acts', style: 'margin-top:6px' })), sw('offline', 'Save pictures for offline use')));
  const segN = (k, opts, label) => { const g = h('span', { class: 'seg', role: 'group', 'aria-label': label }), paint = () => { for (const b of g.children) b.setAttribute('aria-pressed', b.dataset.v === String(S[k]) ? 'true' : 'false'); }; for (const [v, t] of opts) g.append(h('button', { type: 'button', 'data-v': String(v), onclick: () => { setPref(k, v); paint(); } }, t)); paint(); return g; };
  sec('rules',
    'Where guides and players disagree, pick the reading the planner uses. The first choice is the one most sources give.',
    row('Story Pokémon', 'Professor Tangrowth, Peakychu, Mosslax, Hoppip, Skiploom and Jumpluff. PokoTraqr\'s calculator, from one player\'s tests, says story Pokémon and the Hoppip line add nothing to the environment level; which Pokémon count as story ones is a reading.', segN('gStory', [['zero', 'Add nothing'], ['count', 'Count normally']], 'Story Pokémon')),
    row('Items a Pokémon must reach', 'In a house you built, which items only count toward comfort when the resident can walk to them from the door, stepping up or down 1 level at a time. ぽこポケ学会 says items it can\'t get to don\'t count, without saying which; players\' tests point to the ones it uses, rest items and toys. Decorations it only looks at, such as wall hangings.', segN('gReach', [['rt', 'Rest and toys'], ['r', 'Rest only'], ['all', 'Everything']], 'Items a Pokémon must reach')),
    row('Laser sensor reach', 'How many tiles in front of a laser sensor it watches. 2 per GameWith and 攻略大百科; 1 per ぽこポケ学会\'s diagram.', segN('gSensor', [[2, '2 tiles'], [1, '1 tile']], 'Laser sensor reach')),
    row('Sprinkler reach', 'How far a sprinkler waters, counted along each axis and added up. 5 per GameWith, 攻略大百科 and Serebii (61 tiles); ぽこポケ学会 points to 4 (41 tiles), and Game8 says one tile less.', segN('gSprinkler', [[5, '5 tiles'], [4, '4 tiles']], 'Sprinkler reach')),
    row('Smooth Rock reach', 'How far a Smooth Rock dries the ground. 4 per ぽこポケ学会 (41 tiles, 1 level up and 2 down); GameWith gives 6.', segN('gRock', [[4, '4 tiles'], [6, '6 tiles']], 'Smooth Rock reach')),
    row('Generator to transmitter', 'How far a generator reaches its transmitter. 10 per a player\'s tests, Serebii and GameWith\'s electricity page; GameWith\'s utility-pole page says 7.', segN('gGen', [[10, '10 tiles'], [7, '7 tiles']], 'Generator to transmitter')));
  sec('data',
    row('Storage', h('span', { class: 'note', id: 'setsUse' }, 'Checking…')),
    h('div', { id: 'setsKeep' }),
    row('Game data', 'Items, Pokémon and habitats match the game\'s Ver. ' + (DATA.gv || '?') + '. They\'re checked against Serebii every week, and new game data is added as it\'s found.', h('span', { class: 'note' }, 'Ver. ' + (DATA.gv || '?'))),
    row('Plans, backups and sync', 'Export, import and Google sync are in the Plans tab.', h('button', { class: 'btn sm', type: 'button', onclick: () => closeSettings(() => { showTab('plans'); if (innerWidth < 900 && sheetState === 'peek') setSheet(S.sheet); }) }, icon('map'), 'Open Plans')),
    row('Reset settings', 'Puts everything on this page back as it was at the start. Your plans stay as they are.', h('button', { class: 'btn sm danger', type: 'button', onclick: resetSettingsDialog }, 'Reset')));
  let cur = '';
  const spy = () => { const r = scroll.getBoundingClientRect(), t = r.top + 48, end = scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 4; let now = SET_SECS[0][0]; for (const [id] of SET_SECS) { const s = document.getElementById('sets-' + id); if (s && s.getBoundingClientRect().top <= t) now = id; } if (end && scroll.scrollTop > 0) { const w = setsWant && document.getElementById('sets-' + setsWant); now = w && w.getBoundingClientRect().top < r.bottom ? setsWant : SET_SECS[SET_SECS.length - 1][0]; } if (now === cur) return; cur = now; for (const b of nav.children) { const on = b.dataset.sec === now; b.setAttribute('aria-current', on ? 'true' : 'false'); if (on && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: b.offsetLeft - 8, behavior: calm() ? 'auto' : 'smooth' }); } };
  scroll.addEventListener('scroll', spy, { passive: true }); scroll.addEventListener('pointerdown', () => { setsWant = null; }); scroll.addEventListener('wheel', () => { setsWant = null; }, { passive: true }); setsWant = null;
  scroll.scrollTop = top; spy(); picUI(); setsPics(); setsStore();
}
async function setsPics() {
  const el = document.getElementById('setsPicN'); if (!el) return;
  let n = 0; try { if ('caches' in window && !S.offline) n = (await (await caches.open(PIC_CACHE)).keys()).length; } catch (e) { }
  el.textContent = ''; if (!S.offline && n) el.append(h('button', { class: 'btn sm danger', type: 'button', onclick: dropPics }, icon('trash'), 'Remove ' + fmt(n) + ' saved pictures'));
}
async function dropPics() { picFill.force = false; try { await caches.delete(PIC_CACHE); } catch (e) { } picFill.done = 0; picFill.total = 0; picUI(); setsPics(); setsStore(); toast('Saved pictures removed. They load again when you\'re online.'); }
async function setsStore() {
  const use = document.getElementById('setsUse'), keep = document.getElementById('setsKeep'), st = navigator.storage; if (!use) return;
  let txt = 'Plans are saved in this browser.', kept = null;
  try { if (st && st.estimate) { const e = await st.estimate(); if (e && e.usage != null) txt = 'About ' + fmt(Math.max(1, Math.round(e.usage / 1e6))) + ' MB on this device: the app, your plans and saved pictures.'; } } catch (e) { }
  try { if (st && st.persisted) kept = await st.persisted(); } catch (e) { }
  use.textContent = txt; if (!keep) return; keep.textContent = ''; if (kept === null) return;
  keep.append(h('div', { class: 'srow' }, h('div', { class: 'stxt' }, h('b', null, 'Keep saved data safe'), h('span', { class: 'note' }, kept ? 'On: the browser won\'t clear your plans to free up space.' : 'Off: if the device runs low on space, the browser may clear what\'s saved here. Export or sync your plans as a backup.')),
    h('div', { class: 'sctl' }, kept ? h('span', { class: 'chip good' }, '✓ On') : h('button', { class: 'btn sm', type: 'button', onclick: async () => { let ok = false; try { ok = await st.persist(); } catch (e) { } toast(ok ? 'Saved data is kept safe' : 'The browser said no for now. Installing the app usually allows it.', 4000); setsStore(); } }, 'Turn on'))));
}
function resetSettingsDialog() {
  modal('Reset settings?', (box) => box.append(h('p', { class: 'sub' }, 'Every setting goes back as it was at the start. Your plans stay as they are.')), 'Reset', () => {
    S = Object.assign({}, SET_DEF); savePrefs(); picFill.force = false; applyLook(); enter3d(); setShowAreas(false); $('#status').hidden = !S.status && !PROBS.length; if (['pan', 'select'].includes(tool)) setTool(S.tool); tipHide(); requestDraw(); renderSettings(); toast('Settings reset');
  }, true);
}
$('#setBtn').onclick = () => openSettings();

function modal(title, build, okLabel, onOk, danger, tip) {
  const m = $('#modal'), box = $('#modalBox'); box.textContent = ''; box.className = 'box';
  box.append(h('div', { class: 'insp-head' }, h('h2', { style: 'margin:0' }, title, tip ? ' ' : '', tipBtn(tip)), h('button', { class: 'close', 'aria-label': 'Close', 'data-tip': 'Close', onclick: closeModal }, icon('close'))));
  build(box);
  const acts = h('div', { class: 'acts' }, h('button', { class: 'btn', onclick: closeModal }, onOk ? 'Cancel' : 'Close'));
  if (onOk) acts.append(h('button', { class: 'btn ' + (danger ? 'danger' : 'primary'), onclick: () => { const r = onOk(); if (r !== false) closeModal(); } }, okLabel || 'OK'));
  box.append(acts); m.classList.add('open'); setTimeout(() => { const f = box.querySelector('input,select,button.primary'); if (f) f.focus(); }, 30);
}
function closeModal() { $('#modal').classList.remove('open'); }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

let exampleUntouched = false, dirty = false, saveTimer = null, saveState = 'local', cloud = null, downloads = null, cloudErr = '';
function changed() { editSeq++; clearTimeout(lvT); lvT = setTimeout(() => idle(lvCheck, 1500), 900); exampleUntouched = false; evaluateAll(); markDirty(); requestDraw(); if (activeTab !== 'build') renderPanel(); $('#undoBtn').disabled = !undoStack.length; $('#redoBtn').disabled = !redoStack.length; if (selection && selection.zone) { const z = plan.zones.find(q => q.id === selection.zone.id); if (z) selection.zone = z; } if (selection && selection.house && $('#inspector').classList.contains('open')) { const hs = houseById.get(selection.house); if (hs) selectHouse(hs); } }
function markDirty() { dirty = true; plan.updated = Date.now(); setSave('pending'); clearTimeout(saveTimer); saveTimer = setTimeout(persistNow, 1200); }
function saveIndex() { LS.set(LSK + 'index', JSON.stringify(plansIndex)); }
function indexEntry(p) { return { id: p.id, name: p.name, area: p.area, w: p.w, h: p.h, updated: p.updated }; }
async function persistNow(noSync) {
  clearTimeout(saveTimer); if (!plan) return; if (!noSync) scheduleSync(); const s = serialize(plan); const str = JSON.stringify(s);
  const okLocal = LS.set(LSK + 'plan:' + plan.id, str); LS.set(LSK + 'current', plan.id);
  plansIndex = plansIndex.filter(p => p.id !== plan.id); plansIndex.push(indexEntry(plan)); saveIndex(); dirty = false;
  if (cloud) {
    if (str.length > 250000) { setSave('bad', 'Plan too large for your account (' + Math.round(str.length / 1024) + ' KB). Saved on this device.'); return; }
    setSave('saving');
    try { await cloud.col.doc(plan.id).set(s); setSave('cloud'); } catch (e) { cloudErr = e && e.code; setSave(okLocal ? 'local' : 'bad', 'Account save failed (' + (e && e.code || 'error') + ')'); }
  } else setSave(okLocal ? 'local' : 'bad');
  updateHeader();
}
function setSave(st, msg) {
  saveState = st; const chip = $('#saveChip'); chip.className = 'chip ' + (st === 'cloud' || st === 'synced' ? 'good' : st === 'bad' ? 'bad' : st === 'local' || st === 'syncing' ? '' : 'warn');
  chip.lastChild.textContent = { cloud: 'Saved', local: 'Saved', pending: 'Unsaved', saving: 'Saving…', bad: 'Not saved', synced: 'Synced', syncing: 'Syncing…' }[st] || st;
  chip.dataset.tip = (msg || { cloud: 'Saved to your account', local: 'Saved on this device', pending: 'Unsaved changes', synced: 'Synced with your Google account' }[st] || 'Saving') + '. Tap for plans and sync.';
  if (msg && st === 'bad') toast(msg, 3500);
}
function storageNote() { return cloud ? ['Saved to your Claude account', tipBtn('Plans open on any device where you view this page.')] : syncOn() ? ['Saved here and synced', tipBtn('Plans are saved on this device and synced with your Google account. Export a file for an extra backup.')] : ['Saved in this browser only', tipBtn('Sign in above to sync, or export a file to keep a backup or move a plan to another device.')]; }
function loadLocalPlans() { try { plansIndex = JSON.parse(LS.get(LSK + 'index') || '[]'); } catch (e) { plansIndex = []; } }
function readLocalPlan(id) { try { const s = LS.get(LSK + 'plan:' + id); return s ? deserialize(JSON.parse(s)) : null; } catch (e) { return null; } }
function openPlan(id) { if (dirty) persistNow(); const p = readLocalPlan(id) || (cloudCache.has(id) ? deserialize(cloudCache.get(id)) : null); if (!p) { toast('That plan could not be opened'); return; } installPlan(p); LS.set(LSK + 'current', id); toMap(); }
function installPlan(p) {
  plan = p; mapView.loaded(); loadLayers(); undoStack.length = 0; redoStack.length = 0; selection = null; closeInspector(); if (decorMini) { decorMini = null; renderMini(); } firstEval = true; evaluateAll();
  if (!plansIndex.find(q => q.id === p.id)) { plansIndex.push(indexEntry(p)); saveIndex(); }
  updateHeader(); mapView.fit(); renderPanel(); $('#undoBtn').disabled = true; $('#redoBtn').disabled = true;
}
function updateHeader() { $('#hdrPlan').textContent = plan.name; $('#hdrArea').textContent = plan.area; const e = plansIndex.find(q => q.id === plan.id); if (e) Object.assign(e, indexEntry(plan)); }
const cloudCache = new Map();
const fileDownloads = { save: async ({ filename, data }) => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: /\.json$/.test(filename) ? 'application/json' : 'application/octet-stream' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
} };
async function initCapabilities() {
  if (!window.claude || !window.claude.use) { downloads = fileDownloads; if (activeTab === 'plans') renderPlans(); return; }
  try { downloads = await window.claude.use('downloads'); } catch (e) { downloads = null; }
  if (activeTab === 'plans') renderPlans();
  try {
    const db = await window.claude.use('db'); const user = await window.claude.use('user'); if (!db || !user) return;
    const id = await user.id(); if (!id) return;
    const col = db.collection('data/users/' + id);
    const timer = setTimeout(() => { if (!cloud) setSave(saveState, 'Your account storage is not reachable yet'); }, 10000);
    const snap = await col.get(); clearTimeout(timer);
    cloud = { col };
    let newerCurrent = null;
    for (const d of snap.docs) {
      const s = d.data(); if (!s || !s.w) continue; cloudCache.set(d.id, s);
      const local = plansIndex.find(p => p.id === d.id);
      if (!local || (s.updated || 0) > (local.updated || 0)) { LS.set(LSK + 'plan:' + d.id, JSON.stringify(s)); plansIndex = plansIndex.filter(p => p.id !== d.id); plansIndex.push({ id: d.id, name: s.name, area: s.area, w: s.w, h: s.h, updated: s.updated }); if (plan && d.id === plan.id) newerCurrent = s; }
    }
    saveIndex();
    for (const p of plansIndex) if (!cloudCache.has(p.id)) { try { const s = JSON.parse(LS.get(LSK + 'plan:' + p.id) || 'null'); if (s) { await col.doc(p.id).set(s); cloudCache.set(p.id, s); } } catch (e) { } }
    if (newerCurrent && !dirty) { installPlan(deserialize(newerCurrent)); toast('Loaded your latest version from your account'); }
    else if (exampleUntouched && snap.docs.length) { const latest = snap.docs.map(d => d.data()).filter(s => s && s.w && s.id !== plan.id).sort((a, b) => (b.updated || 0) - (a.updated || 0))[0]; if (latest) { installPlan(deserialize(latest)); LS.set(LSK + 'current', latest.id); toast('Opened your latest plan: ' + latest.name); } }
    setSave('cloud'); if (activeTab === 'plans') renderPlans();
  } catch (e) { cloud = null; if (saveState !== 'bad') setSave('local'); }
}
async function exportJSON() { try { await downloads.save({ filename: (plan.name.replace(/[^\w\- ]+/g, '').trim() || 'pokopia-plan') + '.json', data: JSON.stringify(serialize(plan), null, 1) }); toast('Plan file saved'); } catch (e) { if (e && e.code !== 'declined') toast('Could not save the file (' + (e.code || 'error') + ')'); } }
async function exportPNG() {
  const S = clamp(Math.floor(2400 / Math.max(plan.w, plan.h)), 8, 32);
  const urls = [], grounds = new Set(); for (const T of plan.tt) for (const v of T) grounds.add(v); for (const ob of plan.objs.values()) urls.push(picsFor(ITEMS[ob.i])[0]); for (const g of grounds) if (g) urls.push(picsFor(ITEMS[g - 1])[1]);
  await picsReady(urls, 6000);
  if (in3d()) {
    const keep = { hover, selection, drag, sp: sparkles.splice(0) }; hover = null; selection = null; drag = null;
    const c = view3d.snapshot(S, plan.name + ' · ' + plan.area + ' · ' + plan.w + '×' + plan.h); hover = keep.hover; selection = keep.selection; drag = keep.drag; sparkles.push(...keep.sp); requestDraw();
    if (!c) { toast('Could not make the image'); return; }
    c.toBlob(async (blob) => { try { await downloads.save({ filename: (plan.name.replace(/[^\w\- ]+/g, '').trim() || 'pokopia-plan') + '.png', data: blob }); toast('Image saved'); } catch (e) { if (e && e.code !== 'declined') toast('Could not save the image (' + (e.code || 'error') + ')'); } }, 'image/png');
    return;
  }
  const c = document.createElement('canvas'); c.width = plan.w * S; c.height = plan.h * S + 40; const x = c.getContext('2d');
  const saved = { ...view }; view.px = 0; view.py = 40; view.zoom = S / view.cs;
  const keep = { hover, selection, drag, sp: sparkles.splice(0) }; hover = null; selection = null; drag = null;
  x.fillStyle = '#eef1ec'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#1c2a23'; x.font = '700 20px sans-serif'; x.textBaseline = 'middle'; x.fillText(plan.name + ' · ' + plan.area, 12, 20);
  const [sw, sh, sd] = [W, H, dpr]; W = c.width; H = c.height; dpr = 1;
  draw(performance.now(), x); x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#eef1ec'; x.fillRect(0, 0, c.width, 38); x.fillStyle = '#1c2a23'; x.font = '700 20px sans-serif'; x.textBaseline = 'middle'; x.fillText(plan.name + ' · ' + plan.area + ' · ' + plan.w + '×' + plan.h, 12, 20);
  W = sw; H = sh; dpr = sd; Object.assign(view, saved); hover = keep.hover; selection = keep.selection; drag = keep.drag; sparkles.push(...keep.sp); requestDraw();
  c.toBlob(async (blob) => { try { await downloads.save({ filename: (plan.name.replace(/[^\w\- ]+/g, '').trim() || 'pokopia-plan') + '.png', data: blob }); toast('Image saved'); } catch (e) { if (e && e.code !== 'declined') toast('Could not save the image (' + (e.code || 'error') + ')'); } }, 'image/png');
}
const RV = { on: false, el: null, body: null, T: null, gc: null, cards: [], secs: [], q: new Set(), raf: 0, io1: null, io2: null, filter: 'all', find: '', sigs: new Map(), cnt: 0, ui: null };
const RV_RANK = ['Furniture', 'Misc', 'Utilities', 'Outdoor', 'Special', 'Other', 'Nature', 'Buildings', 'Blocks', 'Kits', 'Poster', 'Rug', 'Wallpaper', 'Floor'];
const RV_LABEL = { Poster: 'Posters', Rug: 'Rugs', Floor: 'Floors and terrain' };
let RVD = null, rvSaveT = 0;
function rvData() {
  if (!RVD) { try { RVD = JSON.parse(LS.get(LSK + 'review') || 'null'); } catch (e) { RVD = null; } if (!RVD || !RVD.items || typeof RVD.items !== 'object') RVD = { items: {} }; }
  return RVD;
}
const rvStamp = () => +LS.get(LSK + 'reviewUpdated') || 0;
function rvStore(ts) { LS.set(LSK + 'review', JSON.stringify(rvData())); LS.set(LSK + 'reviewUpdated', String(ts)); }
function rvFlush() { if (!rvSaveT) return; clearTimeout(rvSaveT); rvSaveT = 0; rvStore(Date.now()); scheduleSync(8000); }
function rvSave() { clearTimeout(rvSaveT); rvSaveT = setTimeout(rvFlush, 900); }
function rvSetItems(o) { const t = rvData().items; for (const k of Object.keys(t)) delete t[k]; Object.assign(t, o); }
const rvMerge = (a, b) => { const o = Object.assign({}, a); for (const k in b || {}) { const v = b[k]; if (v && typeof v === 'object' && (!o[k] || (+v.u || 0) > (+o[k].u || 0))) o[k] = v; } return o; };
const rvBase = (it) => ({ w: it.w || 1, h: it.h || 1, t: isRug(it) ? 0 : !tall(it) ? 1 : it.ht == null ? 1 : it.ht });
const rvFloor = (it) => it.L === 'g' && !isRug(it);
function rvCols(it) { const a = rvFloor(it) ? picsFor(it)[2] || it.col : it.look ? it.look.a : it.col; return [a, it.look && it.look.b ? it.look.b : shade(a, -0.25)]; }
const rvHash = (s) => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0).toString(36); };
function rvSig(it) {
  let s = RV.sigs.get(it.i);
  if (s == null) { const b = rvBase(it); s = rvHash([RV.T ? RV.T.srcOf(it) : '', it.lk || '', it.col || '', b.w, b.h, b.t, it.sg ? 1 : 0, it.hg ? 1 : 0].join('|')); RV.sigs.set(it.i, s); }
  return s;
}
function rvState(it) {
  const r = rvData().items[it.n], g = rvSig(it), f = r && r.f ? r.f : null;
  return { seen: !!(r && r.s), flag: f, chg: !!(r && (f ? f.g !== g : r.s && r.s !== g)), sent: !!(f && f.sent && !(f.e > f.sent)) };
}
const rvAsp = (f) => [f.w != null ? 'size' : '', f.a || f.b ? 'colour' : '', f.n ? 'shape' : ''].filter(Boolean);
const rvSz = (w, hh, t, it) => w + '×' + hh + (tall(it) ? ', ' + t + ' high' : '');
const rvDpr = () => Math.min(3, devicePixelRatio || 1);
function rvT() {
  if (RV.T || typeof make3d !== 'function') return RV.T;
  if (!RV.gc) RV.gc = document.createElement('canvas');
  try { RV.T = make3d(RV.gc, () => { RV.T = null; RV.gc = null; for (const c of RV.cards) c.drawn = false; setTimeout(() => { if (!RV.on) return; for (const c of RV.cards) if (c.near) RV.q.add(c); rvPump(); }, 400); }); } catch (e) { RV.T = null; }
  return RV.T;
}
const rvTheme = () => { const cs = getComputedStyle(document.documentElement), bg = cs.getPropertyValue('--paper').trim() || '#eef1ec', dark = cs.colorScheme === 'dark' || cs.getPropertyValue('color-scheme').trim() === 'dark'; return { bg, ground: dark ? '#36443d' : cs.getPropertyValue('--map-empty').trim() || '#dfe5dc' }; };
function rvPaint(c) {
  const it = c.it, st = rvState(it), f = st.flag, b = c.b;
  c.st = st; c.el.classList.toggle('new', !st.seen && !f); c.el.classList.toggle('flag', !!f); c.el.classList.toggle('chg', st.chg);
  c.meta.textContent = '';
  c.meta.append(h('span', { class: 'szb' + (it.sg ? ' guess' : '') }, b.w + '×' + b.h));
  if (tall(it)) c.meta.append(h('span', { class: 'szb' + (it.hg ? ' guess' : '') }, b.t + ' high'));
  if (st.chg) c.meta.append(h('span', { class: 'bdg chg' }, 'Changed'));
  if (f) c.meta.append(h('span', { class: 'bdg fl' + (st.sent ? ' sent' : '') }, (rvAsp(f).join(', ') || 'flagged') + (st.sent ? ' · sent' : '')));
}
function rvCard(it) {
  const u = picsFor(it)[0], cv = h('canvas', { class: 'th', 'aria-hidden': 'true' }), meta = h('div', { class: 'mt' });
  const pic = u ? h('img', { alt: '', src: u, loading: 'lazy', decoding: 'async', draggable: 'false' }) : h('div', { class: 'nopic' }, 'No picture');
  const c = { it, cv, meta, b: rvBase(it), near: false, drawn: false, tries: 0, dt: 0, st: null, el: null };
  c.el = h('button', { class: 'rvc', type: 'button', 'aria-label': it.n, onclick: () => rvOpen(c) }, h('div', { class: 'pp' }, pic, cv), h('div', { class: 'nm' }, it.n), meta);
  c.el._rv = c; rvPaint(c); return c;
}
function rvJob(c) {
  if (!c.near || c.el.hidden || !RV.on) return null;
  const w = c.cv.clientWidth; if (!w) return null;
  const d = Math.min(2, rvDpr()), px = Math.round(w * d); if (c.cv.width !== px) { c.cv.width = px; c.cv.height = px; }
  const x = c.cv.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
  return { c, it: c.it, o: Object.assign({ w: c.b.w, h: c.b.h, t: Math.max(1, c.b.t), dpr: d }, RV.th), out: x, dx: 0, dy: 0, dw: w, dh: w };
}
function rvDrawn(c, r) {
  c.drawn = true;
  if (r && r.wait && c.tries++ < 8) setTimeout(() => { if (c.near && RV.on) { RV.q.add(c); rvPump(); } }, 450);
}
function rvPump() {
  if (RV.raf || !RV.q.size) return;
  RV.raf = requestAnimationFrame(() => {
    RV.raf = 0; const T = rvT(); if (!T) return; const end = performance.now() + 8;
    while (RV.q.size && performance.now() < end) {
      const jobs = []; for (const c of RV.q) { RV.q.delete(c); const j = rvJob(c); if (j) jobs.push(j); if (jobs.length >= 8) break; }
      if (!jobs.length) continue; let res = null; try { res = T.thumbs(jobs); } catch (e) { res = null; }
      jobs.forEach((j, k) => { if (res && res.length && k >= res.length) RV.q.add(j.c); else rvDrawn(j.c, res && res[k]); });
    }
    rvPump();
  });
}
function rvSeen(c) {
  if (!RV.on || c.el.hidden) return; const items = rvData().items, r = items[c.it.n] || (items[c.it.n] = {}), g = rvSig(c.it);
  if (r.s === g) return; r.s = g; r.u = Date.now(); rvPaint(c); rvSave(); rvCount();
}
function rvCount() {
  if (RV.cnt) return;
  RV.cnt = requestAnimationFrame(() => {
    RV.cnt = 0; if (!RV.ui) return; let seen = 0, flag = 0, chg = 0, fresh = 0;
    for (const c of RV.cards) { const s = c.st; if (s.seen || s.flag) seen++; if (s.flag) { flag++; if (!s.sent) fresh++; } if (s.chg) chg++; }
    const n = RV.cards.length; RV.ui.prog.textContent = seen.toLocaleString() + ' of ' + n.toLocaleString() + ' seen · ' + flag + ' flagged';
    RV.ui.n.new.textContent = String(n - seen); RV.ui.n.flag.textContent = String(flag); RV.ui.n.chg.textContent = String(chg);
    RV.ui.send.textContent = fresh ? 'Send ' + fresh : 'Send'; RV.ui.send.classList.toggle('primary', !!fresh);
    for (const s of RV.secs) { let k = 0; for (const c of s.cards) if (c.st.seen || c.st.flag) k++; s.cnt.textContent = k + ' of ' + s.cards.length + ' seen'; }
  });
}
function rvApply() {
  const f = RV.filter, q = RV.find.trim().toLowerCase(); let shown = 0;
  for (const s of RV.secs) {
    let any = 0;
    for (const c of s.cards) { const st = c.st, ok = (!q || c.it.n.toLowerCase().includes(q)) && (f === 'all' || (f === 'new' && !st.seen && !st.flag) || (f === 'flag' && !!st.flag) || (f === 'chg' && st.chg)); c.el.hidden = !ok; if (ok) any++; }
    s.el.hidden = !any; shown += any;
  }
  RV.ui.empty.hidden = shown > 0;
  RV.ui.empty.textContent = q ? 'No item matches “' + RV.find.trim() + '”.' : f === 'new' ? 'You’ve seen every item.' : f === 'flag' ? 'Nothing flagged. Tap an item that looks wrong to flag it.' : f === 'chg' ? 'Nothing has changed since you looked.' : '';
  for (const b of RV.ui.seg.children) b.setAttribute('aria-pressed', b.dataset.f === f ? 'true' : 'false');
  RV.body.scrollTop = 0;
}
function rvMount() {
  const n = { new: h('span', { class: 'n' }), flag: h('span', { class: 'n' }), chg: h('span', { class: 'n' }) };
  const segB = (f, label, k) => h('button', { type: 'button', 'data-f': f, 'aria-pressed': 'false', onclick: () => { RV.filter = f; rvApply(); } }, label, k ? ' ' : '', k ? n[k] : null);
  const seg = h('div', { class: 'seg' }, segB('all', 'All'), segB('new', 'Not seen', 'new'), segB('flag', 'Flagged', 'flag'), segB('chg', 'Changed', 'chg'));
  const find = h('input', { type: 'search', placeholder: 'Find an item', 'aria-label': 'Find an item', oninput: (e) => { RV.find = e.target.value; rvApply(); } });
  const send = h('button', { class: 'btn', type: 'button', onclick: rvSend }, 'Send');
  const prog = h('span', { class: 'prog' }), empty = h('p', { class: 'sub rvempty', hidden: true });
  const body = h('div', { class: 'rvb' }, h('p', { class: 'sub rvtip' }, 'Scroll past items that look right: anything you’ve seen gets ticked off. Tap one that’s wrong to say what to fix. Dashed sizes are guesses.'), empty);
  const el = h('div', { class: 'rv', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Review items', hidden: true },
    h('div', { class: 'rvh' }, h('div', { class: 'ttl' }, h('h2', null, 'Review items'), prog), h('div', { class: 'ctrls' }, seg, find, send), h('button', { class: 'close', type: 'button', 'aria-label': 'Close', 'data-tip': 'Close', onclick: () => closeReview() }, icon('close'))), body);
  document.body.append(el); RV.el = el; RV.body = body; RV.ui = { n, seg, prog, send, empty, find };
  const groups = new Map();
  for (const it of ITEMS) { const k = rvFloor(it) ? 'F:' + it.c : (it.c === 'Kits' ? 'K:' : it.c === 'Wallpaper' ? 'W:' : it.c === 'Poster' ? 'P:' : isRug(it) ? 'R:' : '') + lookK(it); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(it); }
  const secOf = (k, list) => { if (k.startsWith('F:')) return 'Floor'; const m = new Map(); let best = list[0].c, top = 0; for (const it of list) { const v = (m.get(it.c) || 0) + 1; m.set(it.c, v); if (v > top) { top = v; best = it.c; } } return RV_RANK.includes(best) ? best : 'Other'; };
  const secs = new Map(RV_RANK.map(r => [r, []]));
  for (const k of [...groups.keys()].sort()) { const list = groups.get(k).sort((a, b) => a.n.localeCompare(b.n)); secs.get(secOf(k, list)).push(...list); }
  for (const [k, list] of secs) {
    if (!list.length) continue; const cnt = h('span', { class: 'n' }), grid = h('div', { class: 'grid' }), cards = list.map(rvCard);
    grid.append(...cards.map(c => c.el)); const s = { k, cards, cnt, el: h('section', { class: 'rvs' }, h('h3', null, RV_LABEL[k] || k, cnt), grid) };
    body.append(s.el); RV.secs.push(s); RV.cards.push(...cards);
  }
  RV.io1 = new IntersectionObserver((es) => {
    for (const e of es) { const c = e.target._rv; c.near = e.isIntersecting; if (c.near) { if (!c.drawn) RV.q.add(c); } else { RV.q.delete(c); if (c.drawn) { c.cv.width = 0; c.cv.height = 0; c.drawn = false; c.tries = 0; } } }
    rvPump();
  }, { root: body, rootMargin: '800px 0px' });
  RV.io2 = new IntersectionObserver((es) => { for (const e of es) { const c = e.target._rv; clearTimeout(c.dt); if (e.isIntersecting) c.dt = setTimeout(() => rvSeen(c), 650); } }, { root: body, threshold: 0.6 });
  let rt = 0; addEventListener('resize', () => { if (!RV.on) return; clearTimeout(rt); rt = setTimeout(() => { for (const c of RV.cards) if (c.near) { c.drawn = false; RV.q.add(c); } rvPump(); }, 200); });
}
function rvRefresh() {
  if (!RV.el) return; RV.sigs.clear(); for (const c of RV.cards) rvPaint(c); rvCount();
}
async function openReview() {
  if (RV.on) return; RV.on = true; closeModal(); if (setsOpen()) closeSettings();
  try { await load3dScript(); } catch (e) { }
  if (!RV.on) return; rvT();
  if (!RV.el) rvMount(); else rvRefresh();
  RV.th = rvTheme(); RV.el.hidden = false; document.documentElement.dataset.review = '1';
  for (const c of RV.cards) { RV.io1.observe(c.el); RV.io2.observe(c.el); }
  rvApply(); rvCount();
  if (!RV.T) toast('This browser can’t draw the 3D models, so only the pictures show', 4000);
}
function closeReview(fromHash) {
  if (!RV.on) return; RV.on = false; rvFlush(); closeModal();
  if (RV.el) { RV.el.hidden = true; RV.io1.disconnect(); RV.io2.disconnect(); for (const c of RV.cards) { clearTimeout(c.dt); c.near = false; if (c.drawn) { c.cv.width = 0; c.cv.height = 0; c.drawn = false; } } RV.q.clear(); }
  delete document.documentElement.dataset.review;
  if (!fromHash && location.hash === '#review') { try { history.replaceState(null, '', '#' + activeTab); } catch (e) { location.hash = activeTab; } }
  requestDraw();
}
function rvKey(e) {
  if (!$('#modal').classList.contains('open')) { if (e.key === 'Escape') { e.preventDefault(); closeReview(); } return; }
  if (!RV.nav || !$('#modalBox').classList.contains('rvd') || e.target.matches('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); RV.nav(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); RV.nav(1); }
}
function rvOpen(c) {
  const it = c.it, items = rvData().items, b = c.b, r0 = items[it.n], f0 = r0 && r0.f, [ca, cb] = rvCols(it), sig = rvSig(it), chg = !!(c.st && c.st.chg);
  const st = { w: f0 && f0.w != null ? f0.w : b.w, h: f0 && f0.h != null ? f0.h : b.h, t: f0 && f0.t != null ? f0.t : b.t, a: (f0 && f0.a) || '', b: (f0 && f0.b) || '', n: (f0 && f0.n) || '', pick: f0 && f0.a && !f0.b ? 'b' : 'a', yaw: -30, pitch: 32 };
  const ht = tall(it), cv = h('canvas', { class: 'th', 'aria-label': '3D model. Drag to turn it.' }), u = picsFor(it)[0], noB = !!(RV.T && RV.T.usesB && !RV.T.usesB(it));
  const pic = u ? h('img', { alt: it.n, src: u, draggable: 'false' }) : h('div', { class: 'nopic' }, 'No picture');
  let tries = 0, raf = 0;
  const draw = () => {
    raf = 0; const T = rvT(), w = cv.clientWidth; if (!T || !w) return; const d = rvDpr(), px = Math.round(w * d); if (cv.width !== px) { cv.width = px; cv.height = px; }
    const x = cv.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); let r = null;
    try { r = T.thumb(it, Object.assign({}, RV.th, { w: st.w, h: st.h, t: Math.max(1, st.t), a: st.a, b: st.b, yaw: st.yaw, pitch: st.pitch, dpr: d, pad: 0.06 }), x, 0, 0, w, w); } catch (e) { r = null; }
    if (r && r.wait && tries++ < 8) setTimeout(() => { if (cv.isConnected) redraw(); }, 450);
  };
  const redraw = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const commit = () => {
    const f = {};
    if (st.w !== b.w || st.h !== b.h || (ht && st.t !== b.t)) { f.w = st.w; f.h = st.h; if (ht) f.t = st.t; f.was = [b.w, b.h, b.t]; }
    if (st.a) f.a = st.a; if (st.b) { f.b = st.b; if (noB) f.nb = 1; } if (st.a || st.b) f.wc = [ca, cb];
    const note = st.n.trim(); if (note) f.n = note;
    const r = items[it.n] || (items[it.n] = {}), old = r.f;
    if (Object.keys(f).length) { f.g = sig; f.e = Date.now(); if (old && old.sent) f.sent = old.sent; if (old && (old.re || (old.sent && old.g !== sig))) f.re = 1; r.f = f; } else delete r.f;
    r.s = sig; r.u = Date.now(); rvPaint(c); rvSave(); rvCount(); acts();
  };
  const stp = (k, label, lo, hi) => {
    const v = h('span', { class: 'v' }), set = (n) => { st[k] = clamp(n, lo, hi); v.textContent = String(st[k]); v.classList.toggle('on', st[k] !== b[k]); commit(); redraw(); };
    v.textContent = String(st[k]); v.classList.toggle('on', st[k] !== b[k]);
    return h('div', { class: 'stp' }, h('span', { class: 'l' }, label), h('button', { class: 'iconbtn sm', type: 'button', 'aria-label': 'Less ' + label.toLowerCase(), onclick: () => set(st[k] - 1) }, icon('minus')), v, h('button', { class: 'iconbtn sm', type: 'button', 'aria-label': 'More ' + label.toLowerCase(), onclick: () => set(st[k] + 1) }, icon('plus')));
  };
  const sw = { a: null, b: null };
  const paintSw = () => { for (const k of ['a', 'b']) { const e = sw[k]; e.firstChild.style.background = st[k] || (k === 'a' ? ca : cb); e.setAttribute('aria-pressed', st.pick === k ? 'true' : 'false'); e.querySelector('.x').hidden = !st[k]; } };
  const swB = (k, label) => sw[k] = h('button', { class: 'rvsw', type: 'button', onclick: () => { st.pick = k; paintSw(); } }, h('span', { class: 'swatch big' }), h('span', null, label), h('span', { class: 'x', role: 'button', 'aria-label': 'Undo ' + label.toLowerCase() + ' colour', onclick: (e) => { e.stopPropagation(); st[k] = ''; st.pick = k; paintSw(); commit(); redraw(); } }, icon('close')));
  let px = null;
  const pickAt = (e) => {
    if (!(pic instanceof HTMLImageElement) || !pic.naturalWidth) return; const nw = pic.naturalWidth, nh = pic.naturalHeight, R = pic.getBoundingClientRect(), s = Math.min(R.width / nw, R.height / nh), x = Math.floor((e.clientX - R.left - (R.width - nw * s) / 2) / s), y = Math.floor((e.clientY - R.top - (R.height - nh * s) / 2) / s);
    if (x < 0 || y < 0 || x >= nw || y >= nh) return;
    if (!px) { const q = document.createElement('canvas'); q.width = nw; q.height = nh; const g = q.getContext('2d', { willReadFrequently: true }); g.drawImage(pic, 0, 0); try { px = g.getImageData(0, 0, nw, nh).data; } catch (err) { px = null; return; } }
    let rr = 0, gg = 0, bb = 0, k = 0, rad = Math.max(1, Math.round(1.5 / s));
    for (let j = Math.max(0, y - rad); j <= Math.min(nh - 1, y + rad); j++) for (let i = Math.max(0, x - rad); i <= Math.min(nw - 1, x + rad); i++) { const o = (j * nw + i) * 4; if (px[o + 3] < 160) continue; rr += px[o]; gg += px[o + 1]; bb += px[o + 2]; k++; }
    if (!k) { toast('That spot is see-through. Tap the item itself.'); return; }
    const hex = '#' + [rr, gg, bb].map(v => Math.round(v / k).toString(16).padStart(2, '0')).join('');
    st[st.pick] = hex; if (st.pick === 'a' && !st.b) st.pick = 'b'; paintSw(); commit(); redraw();
  };
  const note = h('textarea', { class: 'rvnote', rows: 3, placeholder: 'What’s wrong with the shape? For example: legs too thick, no headboard.', 'aria-label': 'Shape notes', oninput: (e) => { st.n = e.target.value; commit(); } });
  note.value = st.n;
  let actsEl = null;
  const acts = () => {
    if (!actsEl) return; const r = items[it.n], has = !!(r && r.f); actsEl.textContent = '';
    if (has) actsEl.append(h('button', { class: 'btn danger', type: 'button', onclick: () => { const q = items[it.n]; if (q) { delete q.f; q.s = sig; q.u = Date.now(); } rvPaint(c); rvSave(); rvCount(); toast(chg ? 'Marked as fixed' : 'Flag cleared'); closeModal(); } }, chg ? 'It’s fixed' : 'Clear flag'));
    actsEl.append(h('span', { class: 'grow' }), h('button', { class: 'btn primary', type: 'button', onclick: closeModal }, 'Done'));
  };
  modal(it.n, (box) => {
    box.classList.add('wide', 'rvd');
    const sub = [it.c, f0 && f0.sent ? 'sent to Claude ' + new Date(f0.sent).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : ''].filter(Boolean).join(' · ');
    box.append(h('p', { class: 'sub' }, sub));
    if (chg && f0) box.append(h('p', { class: 'rvwarn' }, 'Changed since you flagged it. If it looks right now, tap It’s fixed. If not, edit what’s still wrong.'));
    else if (chg) box.append(h('p', { class: 'rvwarn' }, 'Changed since you last saw it.'));
    box.append(h('div', { class: 'pp2' }, h('figure', null, pic, h('figcaption', null, u ? 'Game picture · tap to pick a colour' : 'Game picture')), h('figure', null, cv, h('figcaption', null, RV.T ? 'Drag to turn' : 'No 3D in this browser'))));
    const szRow = h('div', { class: 'stps' }, stp('w', 'Width', 1, 40), stp('h', 'Length', 1, 40), ht ? stp('t', 'Height', 1, HMAX) : null);
    box.append(h('h4', null, 'Size', h('span', { class: 'was' }, ' now ' + rvSz(b.w, b.h, b.t, it) + (it.sg || (ht && it.hg) ? ' (a guess)' : ''))), szRow);
    box.append(h('h4', null, 'Colours'), h('div', { class: 'rvsws' }, swB('a', 'Main'), swB('b', 'Second'), h('span', { class: 'sub' }, u ? 'Pick one, then tap the picture' : '')));
    if (noB) box.append(h('p', { class: 'sub rvnob' }, 'No part of this model uses the second colour yet. Pick one anyway and Claude will add a part in it.'));
    box.append(h('h4', null, 'Shape'), note);
    paintSw();
  });
  const box = $('#modalBox'), head = box.querySelector('.insp-head'), list = RV.cards.filter(q => !q.el.hidden), at = list.indexOf(c);
  RV.nav = (d) => { const n = list[at + d]; if (n) { n.el.scrollIntoView({ block: 'nearest' }); rvOpen(n); } };
  const nb = (d, label) => h('button', { class: 'iconbtn sm rvnav' + (d < 0 ? ' prev' : ''), type: 'button', 'aria-label': label, 'data-tip': label + (d < 0 ? ' (←)' : ' (→)'), disabled: !list[at + d], onclick: () => RV.nav(d) }, icon('chev'));
  head.insertBefore(h('div', { class: 'rvnavs' }, nb(-1, 'Previous item'), nb(1, 'Next item')), head.lastChild);
  actsEl = box.querySelector('.acts'); acts();
  if (pic instanceof HTMLImageElement) pic.addEventListener('click', pickAt);
  let drag = null;
  cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch }; try { cv.setPointerCapture(e.pointerId); } catch (err) { } e.preventDefault(); });
  cv.addEventListener('pointermove', (e) => { if (!drag) return; st.yaw = drag.yaw - (e.clientX - drag.x) * 0.6; st.pitch = clamp(drag.pitch + (e.clientY - drag.y) * 0.4, 5, 88); redraw(); });
  const up = () => { drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('dblclick', () => { st.yaw = -30; st.pitch = 32; redraw(); });
  requestAnimationFrame(draw);
}
function rvText(list) {
  const items = rvData().items, d = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const lines = list.map(c => {
    const it = c.it, f = items[it.n].f, p = [];
    if (f.w != null) { const w = f.was || [c.b.w, c.b.h, c.b.t]; p.push('size ' + rvSz(f.w, f.h, f.t != null ? f.t : w[2], it) + ' (was ' + rvSz(w[0], w[1], w[2], it) + ')'); }
    if (f.a || f.b) { const w = f.wc || rvCols(it); p.push('colours ' + [f.a ? 'main ' + f.a + ' (was ' + w[0] + ')' : '', f.b ? 'second ' + f.b + ' (was ' + w[1] + (f.nb ? ', not on the model yet' : '') + ')' : ''].filter(Boolean).join(', ')); }
    if (f.n) p.push('shape: ' + f.n.replace(/\s+/g, ' '));
    return '• ' + it.n + (f.re ? ' (still wrong after the fix)' : '') + ': ' + p.join('; ');
  });
  return 'Pokopia item review · ' + d + ' · ' + list.length + (list.length === 1 ? ' item' : ' items') + '\n' + lines.join('\n');
}
function rvSend() {
  const items = rvData().items, all = RV.cards.filter(c => items[c.it.n] && items[c.it.n].f), fresh = all.filter(c => !c.st.sent);
  if (!all.length) { toast('Nothing flagged yet. Tap an item that looks wrong.'); return; }
  let only = fresh.length > 0;
  const pickList = () => only ? fresh : all, ta = h('textarea', { class: 'rvtxt', readonly: true, rows: 9, 'aria-label': 'What gets sent' });
  const done = (how) => { const now = Date.now(); for (const c of pickList()) { const f = items[c.it.n].f; f.sent = now; f.e = Math.min(f.e || now, now); items[c.it.n].u = now; rvPaint(c); } rvSave(); rvCount(); closeModal(); toast(how + ' ' + pickList().length + (pickList().length === 1 ? ' item' : ' items')); };
  modal('Send to Claude', (box) => {
    box.classList.add('wide');
    const seg = fresh.length && fresh.length < all.length ? h('div', { class: 'seg rvseg' }, ...[[true, 'New and edited ' + fresh.length], [false, 'All flagged ' + all.length]].map(([v, l]) => h('button', { type: 'button', 'aria-pressed': only === v ? 'true' : 'false', onclick: (e) => { only = v; for (const q of e.currentTarget.parentNode.children) q.setAttribute('aria-pressed', q === e.currentTarget ? 'true' : 'false'); ta.value = rvText(pickList()); } }, l))) : null;
    box.append(h('p', { class: 'sub' }, navigator.share ? 'Share opens the share sheet: pick the Claude app and send it into the chat. Copy puts it on the clipboard to paste instead.' : 'Copy it, then paste it into the chat with Claude.'), seg || '', ta);
    ta.value = rvText(pickList());
  });
  const acts = $('#modalBox .acts'); acts.textContent = '';
  acts.append(h('button', { class: 'btn', type: 'button', onclick: closeModal }, 'Cancel'), h('button', { class: 'btn' + (navigator.share ? '' : ' primary'), type: 'button', onclick: async () => { const s = rvText(pickList()); try { await navigator.clipboard.writeText(s); done('Copied'); } catch (e) { copyText(s); } } }, 'Copy'));
  if (navigator.share) acts.append(h('button', { class: 'btn primary', type: 'button', onclick: async () => { try { await navigator.share({ title: 'Pokopia item review', text: rvText(pickList()) }); done('Sent'); } catch (e) { if (e && e.name !== 'AbortError') toast('Sharing didn’t work. Try Copy instead.'); } } }, 'Share'));
}
function importFile(f) {
  if (!f) return; const rd = new FileReader();
  rd.onload = () => { try { const s = JSON.parse(rd.result); if (!s.w || !s.h) throw new Error('not a plan'); if (plansIndex.find(p => p.id === s.id)) s.id = uid(); const p = deserialize(s); if (dirty) persistNow(); installPlan(p); persistNow(); toMap(); toast('Imported ' + p.name); } catch (err) { toast('That file is not a Pokopia plan'); } };
  rd.readAsText(f);
}
function importJSON(e) { importFile(e.target.files && e.target.files[0]); e.target.value = ''; }
addEventListener('dragover', e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
addEventListener('drop', e => { const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return; e.preventDefault(); if (!/\.json$/i.test(f.name) && f.type !== 'application/json') { toast('Drop a plan file (.json) to open it'); return; } importFile(f); });

let sync = null; try { sync = JSON.parse(LS.get(LSK + 'sync') || 'null'); } catch (e) { sync = null; }
if (sync && !sync.uid) sync = null;
let remote = null, remoteSizes = null, remoteReview = null;
let syncErr = '', syncMsg = '', syncTimer = null; const inflight = new Map();
function saveSync() { if (sync) LS.set(LSK + 'sync', JSON.stringify(sync)); else LS.del(LSK + 'sync'); }
const GD_CLIENT = '681529268201-ni1b3m37ilanr363gq76gqh9igej8dne.apps.googleusercontent.com', GD_SCOPE = 'https://www.googleapis.com/auth/drive.appdata', GD_API = 'https://www.googleapis.com/drive/v3/', GD_UP = 'https://www.googleapis.com/upload/drive/v3/', GD_GIS = 'https://accounts.google.com/gsi/client';
let gd = { tok: '', exp: 0 }, gdUser = undefined, gdTc = null, gdWait = null, gisLoading = null, gdPollT = null, gdExpT = null, gdLater = null, gdBusy = false, gdAgain = false, gdGen = 0, gdNag = 0, gdQn = 0, gdMiss = 0;
const gdMirror = new Map(), gdCache = new Map(), gdQ = [];
const syncUser = () => gdUser;
const gdE = (code, why) => Object.assign(new Error(code), { code, why: why || '' });
const gisReady = () => !!(window.google && google.accounts && google.accounts.oauth2);
function loadGis() {
  if (gisReady()) return Promise.resolve();
  if (!gisLoading) gisLoading = new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = GD_GIS; s.async = true;
    s.onload = () => { if (gisReady()) ok(); else { gisLoading = null; no(gdE('gd/load')); } };
    s.onerror = () => { s.remove(); gisLoading = null; no(gdE('gd/load')); };
    document.head.append(s);
  });
  return gisLoading;
}
function gdLoadTok() { try { const t = JSON.parse(LS.get(LSK + 'gtok') || 'null'); gd = t && t.tok ? t : { tok: '', exp: 0 }; } catch (e) { gd = { tok: '', exp: 0 }; } }
const gdLive = () => !!gd.tok && Date.now() < gd.exp - 60000;
function gdDrop() { gd = { tok: '', exp: 0 }; LS.del(LSK + 'gtok'); }
function gdGot(r, er) {
  const w = gdWait; gdWait = null; if (!w) return;
  if (r && r.access_token) { if (google.accounts.oauth2.hasGrantedAllScopes(r, GD_SCOPE)) w.ok(r); else w.no(gdE('gd/scope')); }
  else w.no(gdE((er && er.type) || (r && r.error) || 'gd/cancel'));
}
function gdAsk(hint) {
  return new Promise((ok, no) => {
    if (gdWait) gdWait.no(gdE('gd/cancel'));
    gdWait = { ok, no };
    try {
      if (!gdTc) gdTc = google.accounts.oauth2.initTokenClient({ client_id: GD_CLIENT, scope: GD_SCOPE, callback: r => gdGot(r), error_callback: e => gdGot(null, e) });
      gdTc.requestAccessToken(hint ? { prompt: '', hint } : { prompt: '' });
    } catch (e) { gdWait = null; no(gdE('gd/load')); }
  });
}
const gdNap = (ms) => new Promise(r => setTimeout(r, ms));
async function gdFetch(url, opt, tries = 3) {
  for (let i = 0; ; i++) {
    if (!gdLive()) throw gdE('gd/token');
    let r;
    try { r = await fetch(url, Object.assign({}, opt, { headers: Object.assign({ Authorization: 'Bearer ' + gd.tok }, (opt && opt.headers) || {}) })); }
    catch (e) { if (i + 1 < tries && navigator.onLine) { await gdNap(1000 * (i + 1)); continue; } throw gdE('gd/net'); }
    if (r.ok) return r;
    let why = ''; try { const j = await r.json(), er = (j && j.error) || {}; why = (er.errors && er.errors[0] && er.errors[0].reason) || er.status || ''; } catch (e) { }
    if (r.status === 401) { gdDrop(); throw gdE('gd/token'); }
    if ((r.status === 429 || r.status >= 500 || (r.status === 403 && /rateLimit/i.test(why))) && i + 1 < tries) { await gdNap(1000 * 2 ** i + Math.random() * 500); continue; }
    throw gdE('gd/' + r.status, why);
  }
}
const gdName = (k) => k === '_sizes' ? 'sizes.json' : k === '_review' ? 'review.json' : k === '_acct' ? 'account.json' : 'plan-' + k + '.json';
const gdKey = (n) => n === 'sizes.json' ? '_sizes' : n === 'review.json' ? '_review' : n === 'account.json' ? '_acct' : ((/^plan-([a-z0-9]+)\.json$/.exec(n || '') || [])[1] || null);
const gdU = (f) => +((f && f.appProperties) || {}).u || 0;
async function gdList() {
  const out = []; let pt = '';
  do {
    const j = await (await gdFetch(GD_API + 'files?spaces=appDataFolder&pageSize=1000&fields=' + encodeURIComponent('nextPageToken,files(id,name,appProperties)') + (pt ? '&pageToken=' + encodeURIComponent(pt) : ''))).json();
    out.push(...(j.files || [])); pt = j.nextPageToken || '';
  } while (pt);
  return out;
}
async function gdEach(list, n, fn) { let i = 0; await Promise.all(Array.from({ length: Math.min(n, list.length) }, async () => { while (i < list.length) await fn(list[i++]); })); }
function gdRun(fn) { return new Promise((ok, no) => { gdQ.push({ fn, ok, no }); gdPump(); }); }
function gdPump() { while (gdQn < 2 && gdQ.length) { const j = gdQ.shift(); gdQn++; gdGen++; j.fn().then(j.ok, j.no).finally(() => { gdQn--; gdGen++; gdPump(); }); } }
async function gdCurrent(k) {
  const m = gdMirror.get(k);
  if (m && m.fid) {
    try { const j = await (await gdFetch(GD_API + 'files/' + m.fid + '?fields=id,appProperties,trashed')).json(); if (!j.trashed) return { fid: j.id, u: gdU(j) }; }
    catch (e) { if (e.code !== 'gd/404') throw e; }
  }
  const q = encodeURIComponent("name = '" + gdName(k) + "' and trashed = false");
  const j = await (await gdFetch(GD_API + 'files?spaces=appDataFolder&q=' + q + '&fields=' + encodeURIComponent('files(id,appProperties)'))).json();
  const f = (j.files || []).sort((a, b) => gdU(b) - gdU(a))[0];
  return f ? { fid: f.id, u: gdU(f) } : null;
}
function gdBody(meta, text) {
  const b = 'pkp' + uid() + uid();
  return { headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body: '--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(meta) + '\r\n--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + text + '\r\n--' + b + '--' };
}
const gdPut = (k, v, expect, also) => gdRun(async () => {
  const cur = await gdCurrent(k), cu = cur ? cur.u : null;
  if (cu !== expect && cu !== also) throw gdE('pokopia/changed');
  const u = v.updated, text = k[0] === '_' ? JSON.stringify(v) : v.data, meta = { appProperties: { u: String(u) } };
  const b = gdBody(cur ? meta : Object.assign({ name: gdName(k), parents: ['appDataFolder'], mimeType: 'application/json' }, meta), text);
  const j = await (await gdFetch(GD_UP + 'files' + (cur ? '/' + cur.fid : '') + '?uploadType=multipart&fields=id', { method: cur ? 'PATCH' : 'POST', headers: b.headers, body: b.body })).json();
  gdMirror.set(k, { fid: j.id, u }); gdCache.set(k, { u, t: text }); if (k === '_acct' && sync) sync.acct = j.id;
  if (sync) { const w = sync.wrote || (sync.wrote = {}); w[k] = [u, ...(w[k] || []).filter(t => t !== u)].slice(0, 6); }
  if (k === '_sizes') remoteSizes = Object.assign({}, v); else if (k === '_review') remoteReview = Object.assign({}, v); else if (k[0] !== '_' && remote) remote.set(k, { updated: u, data: text });
});
const gdDel = (k, expect) => gdRun(async () => {
  const cur = await gdCurrent(k);
  if (cur) {
    if (cur.u !== expect) throw gdE('pokopia/changed');
    try { await gdFetch(GD_API + 'files/' + cur.fid, { method: 'DELETE' }); } catch (e) { if (e.code !== 'gd/404') throw e; }
    if (sync) { const dl = sync.dl || (sync.dl = {}); dl[k] = [cur.u, Date.now()]; if (sync.wrote) delete sync.wrote[k]; }
  }
  gdMirror.delete(k); gdCache.delete(k); if (remote) remote.delete(k);
});
async function gdPoll() {
  clearTimeout(gdLater);
  if (!gdUser || !syncOn()) return;
  if (!navigator.onLine) { syncSettled(); return; }
  if (!gdLive()) { gdPaused(true); return; }
  if (gdBusy) { gdAgain = true; return; }
  gdBusy = true; const g = gdGen;
  try {
    const files = await gdList(), by = new Map(), extra = [], dl = sync.dl || {};
    for (const k in dl) if (Date.now() - dl[k][1] > 600000) delete dl[k];
    for (const f of files) {
      const k = gdKey(f.name), u = gdU(f); if (!k || (dl[k] && dl[k][0] === u)) continue;
      const o = by.get(k); if (o && o.u >= u) { extra.push(f.id); continue; }
      if (o) extra.push(o.fid);
      by.set(k, { fid: f.id, u });
    }
    for (const [k, v] of by) { const s = sync.wrote && sync.wrote[k]; if (s && s[0] !== v.u && s.includes(v.u)) v.u = s[0]; }
    if (!by.has('_acct') && sync.acct) {
      try { const j = await (await gdFetch(GD_API + 'files/' + sync.acct + '?fields=id,appProperties,trashed')).json(); if (!j.trashed) by.set('_acct', { fid: j.id, u: gdU(j) }); }
      catch (e) { if (e.code !== 'gd/404') throw e; }
      if (!by.has('_acct')) { gdWiped(false); return; }
    }
    if (!by.has('_acct')) {
      if (gdSynced()) {
        if (!gdMiss) gdMiss = Date.now();
        if (Date.now() - gdMiss < 20000) { gdLater = setTimeout(gdPoll, 20500); return; }
        gdMiss = 0; gdWiped(false); return;
      }
      const ts = Date.now(); gdPut('_acct', { updated: ts }, null, ts).catch(() => { });
    } else { gdMiss = 0; if (sync.acct !== by.get('_acct').fid) { sync.acct = by.get('_acct').fid; saveSync(); } }
    const local = new Map(plansIndex.map(p => [p.id, p.updated]));
    const need = [...by].filter(([k, v]) => k !== '_acct' && (k === '_sizes' ? v.u !== sizesStamp() : k === '_review' ? v.u !== rvStamp() : local.get(k) !== v.u) && !(gdCache.has(k) && gdCache.get(k).u === v.u));
    await gdEach(need, 4, async ([k, v]) => {
      try {
        const t = await (await gdFetch(GD_API + 'files/' + v.fid + '?alt=media')).text(); let u = v.u;
        try { const o = JSON.parse(t); if (o && +o.updated) u = +o.updated; } catch (e) { }
        v.u = u; gdCache.set(k, { u, t });
      } catch (e) { if (e.code === 'gd/404') by.delete(k); else throw e; }
    });
    if (g !== gdGen || inflight.size || gdQn || gdQ.length) { gdAgain = true; return; }
    gdMirror.clear(); for (const [k, v] of by) gdMirror.set(k, v);
    const meta = (k) => { const v = by.get(k), c = v && gdCache.get(k); let o = {}; if (c && c.u === v.u) { try { o = JSON.parse(c.t) || {}; } catch (e) { } } return v ? Object.assign(o, { updated: v.u }) : {}; };
    remote = new Map([...by].filter(([k]) => k[0] !== '_').map(([k, v]) => { const c = gdCache.get(k); return [k, { updated: v.u, data: c && c.u === v.u ? c.t : undefined }]; }));
    remoteSizes = meta('_sizes'); remoteReview = meta('_review'); syncErr = '';
    reconcile();
    for (const fid of extra) gdFetch(GD_API + 'files/' + fid, { method: 'DELETE' }).catch(() => { });
  } catch (e) {
    if (e.code === 'gd/token') gdPaused(true); else { syncErr = syncProblem(e); syncUI(); syncSettled(); }
  } finally { gdBusy = false; if (gdAgain) { gdAgain = false; gdLater = setTimeout(gdPoll, 800); } }
}
const gdSynced = () => !!sync && (Object.keys(sync.base || {}).length > 0 || +sync.sizesBase > 0 || +sync.reviewBase > 0);
function gdWiped(mine) {
  const email = sync ? sync.email || '' : '', id = sync ? sync.uid : '';
  stopWatching(); clearTimeout(gdLater); gdDrop(); gdUser = null; gdMirror.clear(); gdCache.clear(); gdMiss = 0;
  sync = { uid: id, via: 'drive', base: {}, sizesBase: 0, gone: [], last: 0, on: false, email }; saveSync();
  syncErr = ''; if (saveState === 'synced') setSave('local'); syncUI(); if (activeTab === 'plans') renderPlans();
  toastDrop('gdre');
  if (mine) toast('Removed from Google Drive. Sync is off, and your plans are still on this device.', 8000);
  else toast('Your planner data was removed from Google Drive, so sync is off here. Your plans are still on this device.', 15000, { label: 'Sign in', fn: () => gdSignIn() }, 'gdre');
}
function gdRemoveDialog() {
  modal('Remove your plans from Google Drive?', (box) => box.append(h('p', { class: 'sub' }, 'Deletes everything the planner saved in your Google Drive and turns sync off. Your plans stay on this device, and your other devices keep theirs too, with sync off. Signing in again later puts this device\'s plans back. This can\'t be undone.')), 'Remove', async () => {
    if (!gdLive()) { gdPaused(false); return; }
    stopWatching(); clearTimeout(gdLater); syncMsg = 'Removing…'; syncUI();
    try {
      const files = await gdList(), order = files.filter(f => f.name === 'account.json').concat(files.filter(f => f.name !== 'account.json'));
      for (const f of order) { try { await gdFetch(GD_API + 'files/' + f.id, { method: 'DELETE' }); } catch (e) { if (e.code !== 'gd/404') throw e; } }
      syncMsg = ''; gdWiped(true);
    } catch (e) { syncMsg = ''; if (e.code === 'gd/token') gdPaused(false); else { toast('Couldn\'t remove everything (' + (syncProblem(e) || e.code) + '). Try again.', 6000); gdStart(); } syncUI(); }
  }, true);
}
function gdStart() {
  stopWatching(); gdPoll();
  gdPollT = setInterval(() => { if (!document.hidden) gdPoll(); }, 30000);
  gdExpT = setTimeout(() => gdPaused(true), Math.max(1000, gd.exp - 60000 - Date.now()));
}
function gdPaused(quiet) {
  if (!syncOn()) return;
  if (gdUser) stopWatching();
  gdUser = null; syncUI(); syncSettled(); loadGis().catch(() => { });
  if (document.hidden || (quiet && !syncPending()) || Date.now() - gdNag < 600000) return;
  gdNag = Date.now(); toast('Sync is paused until you reconnect to Google', 12000, { label: 'Reconnect', fn: () => gdSignIn() }, 'gdre');
}
async function gdSignIn() {
  const back = syncOn(); syncErr = ''; syncMsg = 'Opening Google…'; syncUI();
  try {
    if (!gisReady()) await loadGis();
    const r = await gdAsk(sync && sync.via === 'drive' ? sync.email : '');
    gd = { tok: r.access_token, exp: Date.now() + (+r.expires_in || 3599) * 1000 }; LS.set(LSK + 'gtok', JSON.stringify(gd));
    const u = (((await (await gdFetch(GD_API + 'about?fields=' + encodeURIComponent('user(permissionId,emailAddress)'))).json()) || {}).user) || {}, id = u.permissionId || u.emailAddress;
    if (!id) throw gdE('gd/who');
    if (!sync || sync.uid !== id || sync.via !== 'drive') { sync = { uid: id, via: 'drive', base: {}, sizesBase: 0, gone: [], last: 0 }; gdMirror.clear(); gdCache.clear(); }
    sync.on = true; sync.email = u.emailAddress || ''; saveSync(); gdUser = { id, email: sync.email }; gdNag = 0;
    toastDrop('gdre'); toast(back ? 'Sync is back on' : 'Sync is on'); gdStart();
  } catch (e) { syncErr = signInProblem(e); if (syncOn() && !gdLive()) gdUser = null; }
  syncMsg = ''; syncUI(); syncSettled();
}
function gdBoot() {
  gdLoadTok();
  if (!syncOn()) { gdUser = null; syncUI(); return; }
  if (gdLive()) { gdUser = { id: sync.uid, email: sync.email || '' }; gdStart(); } else gdPaused(false);
  syncUI();
}
function syncRefresh(ms) { clearTimeout(gdLater); gdLater = setTimeout(gdPoll, ms); }
const syncRetry = (e) => !(e && e.code === 'gd/403' && !/rateLimit/i.test(e.why || ''));
const syncOn = () => !!(sync && sync.on && sync.via === 'drive');
function stopWatching() { clearInterval(gdPollT); gdPollT = null; clearTimeout(gdExpT); remote = null; remoteSizes = null; remoteReview = null; }
function syncProblem(e) {
  const c = (e && e.code) || '', w = (e && e.why) || '';
  if (c === 'gd/net' || /^gd\/5\d\d$/.test(c) || !navigator.onLine) return 'Can\'t reach Google Drive. Changes sync once it\'s back.';
  if (w === 'storageQuotaExceeded') return 'Your Google Drive is full. Changes sync once there\'s room.';
  if (c === 'gd/429' || /rateLimit/i.test(w)) return 'Google Drive is busy. Changes sync in a minute.';
  if (w === 'accessNotConfigured' || w === 'SERVICE_DISABLED') return 'The planner\'s Google project needs the Google Drive API turned on.';
  if (c === 'gd/403') return 'Google Drive refused access. Sign out, then sign in again and allow the planner its Drive folder.';
  return 'Sync problem (' + (c || (e && e.message) || 'unknown') + '). Changes sync once it clears.';
}
function signInProblem(e) {
  const c = (e && e.code) || '';
  if (c === 'popup_closed' || c === 'gd/cancel') return '';
  if (c === 'access_denied') return 'Sync needs Google\'s OK to keep its files in your Drive. Tap Sign in with Google and click Continue.';
  if (c === 'popup_failed_to_open') return 'The browser blocked Google\'s sign-in window. Tap Sign in with Google again, or allow pop-ups for this site.';
  if (c === 'gd/scope') return 'To sync, tick the box that lets the planner keep its files in your Google Drive.';
  if (c === 'gd/load' || c === 'gd/net' || !navigator.onLine) return 'Couldn\'t reach Google. Check your connection and try again.';
  if (c.startsWith('gd/')) return syncProblem(e);
  return 'Google sign-in didn\'t work (' + c + ').';
}
function syncOffDialog() {
  modal('Sign out on this device?', (b) => b.append(h('p', { class: 'sub' }, 'Plans stay here and in your Google account.')), 'Sign out', async () => {
    if (sync) { sync.on = false; saveSync(); } stopWatching(); clearTimeout(syncTimer);
    gdDrop(); gdUser = null; toastDrop('gdre');
    syncErr = ''; if (saveState === 'synced') setSave('local'); renderPlans(); toast('Signed out on this device');
  });
}
function scheduleSync(ms) { if (!syncOn()) return; clearTimeout(syncTimer); syncTimer = setTimeout(gdUser === null ? () => gdPaused(true) : reconcile, ms == null ? 2500 : ms); }
const localPlanRaw = (id) => { try { return JSON.parse(LS.get(LSK + 'plan:' + id) || 'null'); } catch (e) { return null; } };
function storeRaw(s) { LS.set(LSK + 'plan:' + s.id, JSON.stringify(s)); plansIndex = plansIndex.filter(p => p.id !== s.id); plansIndex.push({ id: s.id, name: s.name, area: s.area, w: s.w, h: s.h, updated: s.updated }); }
const planCore = (s) => { if (!s) return ''; const o = Object.assign({}, s); delete o.updated; delete o.id; return JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]])); };
const sameData = (a, b) => !!a && !!b && planCore(a) === planCore(b);
const isPristineExample = (id, upd) => { const [eid, eu] = (LS.get(LSK + 'example') || '').split(':'); return id === eid && String(upd) === eu; };
const sizesStamp = () => +LS.get(LSK + 'sizesUpdated') || 0;
function syncPending() {
  if (!sync) return false;
  if (inflight.size || (sync.gone || []).length || sizesStamp() !== (+sync.sizesBase || 0) || rvSaveT || rvStamp() !== (+sync.reviewBase || 0)) return true;
  return plansIndex.some(p => sync.base[p.id] !== p.updated && !isPristineExample(p.id, p.updated));
}
function syncSettled() {
  const ok = syncUser() && remote && remoteSizes && !syncErr && navigator.onLine && !syncPending();
  if (ok && sync) { sync.last = Date.now(); saveSync(); }
  if (ok && (saveState === 'local' || saveState === 'syncing')) setSave('synced');
  else if (!ok && saveState === 'synced') setSave('local', syncErr || undefined);
  syncUI();
}
function reconcile() {
  clearTimeout(syncTimer);
  if (!syncUser() || !remote || !remoteSizes || !sync) { syncUI(); return; }
  if (dirty) persistNow(true);
  if (!navigator.onLine) { syncSettled(); return; }
  const ops = { put: gdPut, del: gdDel }, pulled = [], removed = [], gone = new Set(sync.gone || []); let stale = false;
  const done = () => { if (sync) saveSync(); syncSettled(); };
  const send = (key, write, after) => {
    inflight.set(key, true);
    write().then(() => { inflight.delete(key); if (sync) after(); done(); }, e => {
      inflight.delete(key);
      if (e && e.code === 'pokopia/changed') syncRefresh(1500);
      else if (e && e.code === 'gd/token') gdPaused(true);
      else { syncErr = syncProblem(e); if (syncRetry(e)) syncRefresh(30000); }
      done();
    });
  };
  const put = (s, expect) => {
    const json = JSON.stringify(s); if (json.length > 4500000) { syncErr = '“' + s.name + '” is too big to sync.'; return; }
    const sent = sync.sent || (sync.sent = {}); sent[s.id] = [s.updated, ...(sent[s.id] || []).filter(t => t !== s.updated)].slice(0, 6); saveSync();
    send(s.id, () => ops.put(s.id, { name: s.name, updated: s.updated, data: json }, expect, s.updated), () => { sync.base[s.id] = s.updated; });
  };
  const push = (id, R) => { const s = localPlanRaw(id); if (s) { s.id = id; put(s, R ? R.updated : null); } };
  const pull = (id, R) => { try { const s = JSON.parse(R.data); if (!s || !s.w || !s.h) return; s.id = id; storeRaw(s); sync.base[id] = s.updated; pulled.push(id); } catch (e) { } };
  const keepCopy = (s, label) => { if (!s) return; const c = JSON.parse(JSON.stringify(s)); c.id = uid(); c.name = s.name + ' (' + label + ')'; storeRaw(c); put(c, null); };
  for (const id of new Set([...plansIndex.map(p => p.id), ...remote.keys(), ...gone])) {
    if (inflight.has(id)) continue;
    const L = plansIndex.find(p => p.id === id), R = remote.get(id), B = R && sync.sent && (sync.sent[id] || []).includes(R.updated) ? R.updated : sync.base[id];
    if (R && R.data === undefined && (!L || L.updated !== R.updated)) { stale = true; continue; }
    if (gone.has(id)) {
      if (R && B != null && R.updated !== B) { pull(id, R); sync.gone = sync.gone.filter(x => x !== id); }
      else if (R) send(id, () => ops.del(id, R.updated), () => { delete sync.base[id]; sync.gone = sync.gone.filter(x => x !== id); });
      else { delete sync.base[id]; sync.gone = sync.gone.filter(x => x !== id); }
      continue;
    }
    if (L && plan && id === plan.id && dirty) continue;
    if (L && R) {
      if (L.updated === R.updated) { sync.base[id] = R.updated; continue; }
      const lCh = L.updated !== B, rCh = R.updated !== B;
      if (lCh && rCh) {
        let rs = null; try { rs = JSON.parse(R.data); } catch (e) { }
        if (rs && sameData(localPlanRaw(id), rs)) pull(id, R);
        else if (L.updated > R.updated) { keepCopy(rs, 'from another device'); sync.base[id] = R.updated; push(id, R); } else { keepCopy(localPlanRaw(id), 'from this device'); pull(id, R); }
      } else if (lCh) push(id, R); else pull(id, R);
    } else if (L) {
      if (isPristineExample(id, L.updated)) { if (remote.size) removed.push(id); continue; }
      if (B != null && L.updated === B) removed.push(id);
      else push(id, null);
    } else if (R) pull(id, R);
  }
  if (remoteSizes.updated != null && remoteSizes.sizes === undefined && sizesStamp() !== +remoteSizes.updated) stale = true;
  else if (!inflight.has('_sizes')) {
    const lTs = sizesStamp(), rTs = +remoteSizes.updated || 0, bTs = +sync.sizesBase || 0;
    const putSizes = (ts) => { const sizes = Object.assign({}, userSizes); send('_sizes', () => ops.put('_sizes', { sizes, updated: ts }, remoteSizes.updated == null ? null : remoteSizes.updated, ts), () => { sync.sizesBase = ts; }); };
    let sizesIn = false;
    if (lTs !== rTs) {
      const lCh = lTs !== bTs, rCh = rTs !== bTs;
      if (lCh && rCh) { userSizes = Object.assign({}, remoteSizes.sizes || {}, userSizes); const ts = Date.now(); LS.set(LSK + 'sizesUpdated', String(ts)); sizesIn = true; putSizes(ts); }
      else if (lCh) putSizes(lTs);
      else { userSizes = Object.assign({}, remoteSizes.sizes || {}); LS.set(LSK + 'sizesUpdated', String(rTs)); sync.sizesBase = rTs; sizesIn = true; }
    } else sync.sizesBase = rTs;
    if (sizesIn) { LS.set('pokopia-planner:sizes', JSON.stringify(userSizes)); requestDraw(); if (activeTab !== 'plans') renderPanel(); }
  }
  if (remoteReview && remoteReview.updated != null && remoteReview.data === undefined && rvStamp() !== +remoteReview.updated) stale = true;
  else if (remoteReview && !inflight.has('_review')) {
    rvFlush(); clearTimeout(syncTimer);
    const lTs = rvStamp(), rTs = +remoteReview.updated || 0, bTs = +sync.reviewBase || 0;
    const theirs = () => { try { const o = JSON.parse(remoteReview.data || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } };
    const putRv = (ts) => { const data = JSON.stringify(rvData().items); send('_review', () => ops.put('_review', { data, updated: ts }, remoteReview.updated == null ? null : remoteReview.updated, ts), () => { sync.reviewBase = ts; }); };
    if (lTs !== rTs) {
      const lCh = lTs !== bTs, rCh = rTs !== bTs;
      if (lCh && rCh) { rvSetItems(rvMerge(rvData().items, theirs())); const ts = Date.now(); rvStore(ts); putRv(ts); rvRefresh(); }
      else if (lCh) putRv(lTs);
      else { rvSetItems(theirs()); rvStore(rTs); sync.reviewBase = rTs; rvRefresh(); }
    } else sync.reviewBase = rTs;
  }
  for (const id of removed) { LS.del(LSK + 'plan:' + id); plansIndex = plansIndex.filter(p => p.id !== id); delete sync.base[id]; }
  saveIndex(); saveSync();
  if (plan && removed.includes(plan.id)) {
    const nx = [...plansIndex].sort((a, b) => b.updated - a.updated)[0], p = nx && readLocalPlan(nx.id);
    if (p) { installPlan(p); LS.set(LSK + 'current', p.id); if (pulled.length) toast('Opened “' + p.name + '” from your other device'); }
    else { const ex = makeExample(); installPlan(ex); LS.set(LSK + 'example', ex.id + ':' + ex.updated); persistNow(true); }
  } else if (plan && pulled.includes(plan.id) && !dirty) {
    const p = readLocalPlan(plan.id); if (p) { const v = mapView.cam(); installPlan(p); mapView.setCam(v); toast('Updated “' + p.name + '” from your other device'); }
  }
  if (pulled.length || removed.length) { updateHeader(); if (activeTab === 'plans') renderPlans(); }
  if (stale) syncRefresh(1500);
  done();
}
function ago(t) { const s = (Date.now() - t) / 1000; return s < 60 ? 'just now' : s < 3600 ? Math.round(s / 60) + ' min ago' : s < 86400 ? Math.round(s / 3600) + ' h ago' : new Date(t).toLocaleDateString(); }
function syncCard() {
  const user = syncUser(), signedIn = !!user, waiting = syncOn() && user === undefined, paused = syncOn() && user === null;
  const state = signedIn ? (syncErr ? ['bad', 'Problem'] : !navigator.onLine || syncPending() ? ['warn', 'Waiting'] : ['good', 'On']) : paused ? ['warn', 'Paused'] : waiting ? ['', 'Connecting…'] : null;
  const tip = 'Sign in with your Google account once on each device: plans, item sizes and item reviews then stay the same on your phone, tablet and computer. Edits made offline are sent when you\'re back online. They\'re kept in a hidden folder in your own Google Drive that only this planner can open. Google\'s sign-in lasts an hour, so now and then sync asks you to tap Reconnect.';
  const card = h('div', { class: 'card', id: 'syncCard' }, h('div', { class: 'hd' }, h('span', { class: 'title' }, 'Sync between devices'), tipBtn(tip), state ? h('span', { class: 'chip ' + state[0], style: 'margin-left:auto' }, h('span', { class: 'dot' }), state[1]) : ''));
  const note = (t, bad) => h('p', { class: 'note', style: 'margin:6px 0 0' + (bad ? ';color:var(--bad)' : '') }, t);
  if (signedIn) {
    card.append(note(syncErr || (!navigator.onLine ? 'Offline: syncs when you\'re back' : (sync && sync.email ? sync.email + ' · ' : '') + (syncPending() ? 'sending…' : 'synced ' + (sync && sync.last ? ago(sync.last) : 'just now'))), !!syncErr));
    card.append(h('div', { class: 'acts' }, h('button', { class: 'btn sm', onclick: syncOffDialog }, 'Sign out'), h('button', { class: 'btn sm', disabled: !!syncMsg, 'data-tip': 'Delete everything the planner saved in your Google Drive. Plans stay on your devices.', onclick: gdRemoveDialog }, syncMsg || 'Remove from Drive')));
  } else if (paused) {
    card.append(note(syncErr || ((sync && sync.email ? sync.email + ' · ' : '') + 'paused until you reconnect. Edits wait on this device.'), !!syncErr));
    card.append(h('div', { class: 'acts' }, h('button', { class: 'btn sm primary', disabled: !!syncMsg, onclick: () => gdSignIn() }, syncMsg || 'Reconnect'), h('button', { class: 'btn sm', onclick: syncOffDialog }, 'Sign out')));
  } else if (waiting) {
    card.append(note(syncErr || (navigator.onLine ? 'Connecting to Google…' : 'Offline: syncs when you\'re back'), !!syncErr));
  } else {
    if (syncOn() || (sync && sync.uid && sync.via === 'drive')) card.append(note('Signed out on this device'));
    if (syncErr) card.append(note(syncErr, true));
    card.append(h('div', { class: 'acts' }, h('button', { class: 'btn sm primary', disabled: !!syncMsg, onclick: () => gdSignIn() }, syncMsg || 'Sign in with Google')));
    if (navigator.onLine) loadGis().catch(() => { });
  }
  return card;
}
function syncUI() { const old = document.getElementById('syncCard'); if (old) old.replaceWith(syncCard()); }
function otherWindow(e) {
  if (!e.key || !e.key.startsWith(LSK)) return;
  if (e.key === LSK + 'index') { loadLocalPlans(); if (activeTab === 'plans') renderPlans(); return; }
  if (e.key === LSK + 'gtok') { gdLoadTok(); if (syncOn() && !gdUser && gdLive()) { gdUser = { id: sync.uid, email: sync.email || '' }; toastDrop('gdre'); gdStart(); syncUI(); } return; }
  if (e.key === LSK + 'sync') { try { const s = JSON.parse(e.newValue || 'null'); if (s && sync && s.uid === sync.uid) sync = Object.assign(s, { on: sync.on }); } catch (er) { } return; }
  if (plan && e.key === LSK + 'plan:' + plan.id && !dirty && e.newValue) { try { const s = JSON.parse(e.newValue); if ((s.updated || 0) > (plan.updated || 0)) { const v = mapView.cam(); installPlan(deserialize(s)); mapView.setCam(v); } } catch (er) { } }
}
const COPY_TAG = / \((from another device|from this device)\)$/;
const copyBase = (n) => { while (COPY_TAG.test(n)) n = n.replace(COPY_TAG, ''); return n; };
function syncCopies() { const orig = new Map(); for (const p of plansIndex) if (!COPY_TAG.test(p.name) && (!orig.has(p.name) || orig.get(p.name).updated < p.updated)) orig.set(p.name, p); return plansIndex.filter(p => { if (!COPY_TAG.test(p.name)) return false; const o = orig.get(copyBase(p.name)); return !!o && p.updated <= o.updated; }); }
function tidyCopiesDialog() {
  const list = syncCopies(); if (!list.length) return; const n = list.length, word = n === 1 ? 'copy' : 'copies';
  modal('Remove ' + n + ' sync ' + word + '?', (box) => {
    box.append(h('p', { class: 'sub' }, 'Older versions the sync set aside. The plans under their own names stay as they are' + (syncOn() ? ', and the copies go from your other devices too' : '') + '. This can\'t be undone.'));
    const by = new Map(); for (const p of list) { const b = copyBase(p.name); by.set(b, (by.get(b) || 0) + 1); }
    box.append(h('p', { class: 'note' }, [...by].map(([b, c]) => c + ' × ' + b).join(' · ')));
  }, 'Remove', async () => {
    const ids = new Set(list.map(p => p.id));
    plansIndex = plansIndex.filter(p => !ids.has(p.id)); for (const id of ids) LS.del(LSK + 'plan:' + id); saveIndex();
    if (cloud) for (const id of ids) { try { await cloud.col.doc(id).delete(); } catch (e) { } }
    if (sync) { sync.gone = [...new Set([...(sync.gone || []), ...ids])]; saveSync(); scheduleSync(300); }
    if (ids.has(plan.id)) { const keep = plansIndex.find(p => p.name === copyBase(plan.name)) || plansIndex[0]; if (keep) openPlan(keep.id); else installPlan(makeExample()); persistNow(); }
    renderPlans(); toast(ids.size + ' ' + word + ' removed');
  }, true);
}

function makeExample() {
  const p = newPlan({ name: 'Example: Wasteland starter', area: 'Withered Wasteland', w: 56, h: 40, fill: 'Ordinary soil' });
  const prev = plan; plan = p; const G = (n) => BY_NAME.get(n).i + 1;
  const rect = (x, y, w, hh, n) => { for (let yy = y; yy < y + hh; yy++) for (let xx = x; xx < x + w; xx++) if (inB(p, xx, yy)) p.ground[yy * p.w + xx] = G(n); };
  rect(4, 4, 22, 14, 'Field grass'); rect(30, 22, 22, 14, 'Field grass');
  rect(18, 20, 7, 5, 'Water'); rect(19, 25, 3, 2, 'Water'); rect(20, 27, 2, 9, 'Water');
  for (let y = 4; y < 12; y++) for (let x = 40; x < 52; x++) { const top = (x > 41 && x < 50 && y > 5 && y < 10) ? 3 : 1; for (let z = 0; z <= top; z++) tLayer(p, z)[y * p.w + x] = G('Alpine grass'); }
  for (let x = 3; x < 53; x++) addObjRaw(p, 'Wooden path', x, 19);
  for (let y = 12; y < 19; y++) addObjRaw(p, 'Wooden path', 34, y);
  tx = null;
  const st = (id, x, y) => { const z = stampCore(HAB_BY_ID.get(id), x, y); if (z) p.zones.push(z); tx = null; };
  st('001', 7, 7); st('004', 17, 22); st('008', 13, 8); st('002', 9, 14); st('017', 30, 26); st('020', 37, 29); st('012', 45, 7);
  addObjRaw(p, 'Leaf hut kit', 27, 6); addObjRaw(p, 'Leaf cottage kit', 26, 11); addObjRaw(p, 'Leaf den kit', 32, 6);
  for (let x = 42; x <= 48; x++) for (let y = 12; y <= 17; y++) if (x === 42 || x === 48 || y === 12 || y === 17) addObjRaw(p, x === 45 && y === 17 ? 'Rustic door' : 'Wooden wall', x, y);
  for (let x = 43; x <= 47; x++) for (let y = 13; y <= 16; y++) p.ground[y * p.w + x] = G('Wooden flooring');
  addObjRaw(p, 'Straw bed', 43, 13); addObjRaw(p, 'Log table', 46, 14); addObjRaw(p, 'Log chair', 47, 14); addObjRaw(p, 'Mushroom lamp', 43, 16);
  addObjRaw(p, 'Workbench', 35, 15); addObjRaw(p, 'Storage Box', 37, 15); addObjRaw(p, 'Smelting furnace', 38, 15); addObjRaw(p, 'Town streetlight', 33, 18);
  for (let x = 44; x < 52; x += 2) addObjRaw(p, 'Leppa tree', x, 33);
  undoStack.length = 0; redoStack.length = 0; tx = null; plan = prev; p.updated = Date.now();
  return p;
}
function addObjRaw(p, name, x, y) { const it = BY_NAME.get(name); if (!it) return; let w = it.w || 1, hh = it.h || 1; const zAt = (w, hh) => { let m = -Infinity; for (let yy = y; yy < Math.min(p.h, y + hh); yy++) for (let xx = x; xx < Math.min(p.w, x + w); xx++) m = Math.max(m, standZ(yy * p.w + xx, p)); return m === -Infinity ? 1 : m; }; const ok = (w, hh) => fits(p, x, y, w, hh, 0, zAt(w, hh)); if (!ok(w, hh)) { if (it.sg && ok(hh, w)) [w, hh] = [hh, w]; else if (it.sg && ok(1, 1)) w = hh = 1; else return; } const ob = { id: p.nextId++, i: it.i, x, y, w, h: hh }, z = zAt(w, hh), t = heightOf(it, p); if (z) ob.z = z; if (t > 1 && fits(p, x, y, w, hh, 0, z, t)) ob.t = t; p.objs.set(ob.id, ob); stampOcc(p, ob, ob.id); }

if (S.map3d) load3dScript().catch(() => { });
let updateWanted = false;
const swReg = () => 'serviceWorker' in navigator ? navigator.serviceWorker.getRegistration().catch(() => null) : Promise.resolve(null);
function checkForUpdate() { if (navigator.onLine) swReg().then(r => r && r.update()).catch(() => { }); }
function appVersion() { const d = new Date(APP_BUILD); return isNaN(d) ? APP_BUILD : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
async function updateNow() {
  const reg = await swReg(); if (!reg) { location.reload(); return; }
  if (!navigator.onLine) { toast('You\'re offline', 2400, null, 'upd'); return; }
  toast('Checking for updates…', 8000, null, 'upd'); updateWanted = true;
  try { await reg.update(); } catch (e) { updateWanted = false; toast('Couldn\'t check. Try again soon.', 2400, null, 'upd'); return; }
  if (reg.installing || reg.waiting) { toast('Updating…', 15000, null, 'upd'); setTimeout(() => { if (updateWanted) location.reload(); }, 15000); }
  else { updateWanted = false; toast('Up to date (' + appVersion() + ')', 2400, null, 'upd'); }
}
const idle = (fn, ms) => 'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: ms }) : setTimeout(fn, Math.min(ms, 1500));
let swStarted = false;
function initSW() {
  if (swStarted || !('serviceWorker' in navigator) || !document.querySelector('link[rel="manifest"]') || !/^https?:$/.test(location.protocol)) return; swStarted = true;
  const hadController = !!navigator.serviceWorker.controller; let pending = false;
  const reloadNow = () => { try { persistNow(); } catch (e) { } location.reload(); };
  navigator.serviceWorker.register('sw.js').then(r => { r.update().catch(() => { }); }).catch(() => { });
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!hadController || pending) return; pending = true; if (updateWanted || (S.updates === 'auto' && !busyNow())) { reloadNow(); return; } toast('New version ready', 20000, { label: 'Open it', fn: reloadNow }, 'upd'); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') return; if (pending) reloadNow(); else checkForUpdate(); });
  setInterval(checkForUpdate, 30 * 60 * 1000);
}
async function boot() {
  hold2d = S.map3d; readTheme(); resize(); fsInit(); tipsInit();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readTheme);
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new ResizeObserver(() => { resize(); }).observe($('#mapwrap'));
  const [dataReq, picsReq] = window.pokopiaLoad || [null, fetch('pics/index.json').then(r => r.ok ? r.json() : null).catch(() => null)];
  let d;
  try { const emb = document.getElementById('pokopiaData'); if (emb) d = JSON.parse(emb.textContent); else { d = dataReq ? await dataReq : null; if (!d) { const r = await fetch('data.json'); if (!r.ok) throw new Error(r.status); d = await r.json(); } } }
  catch (e) { hold2d = false; $('#hdrPlan').textContent = 'Could not load game data'; toast('Game data failed to load. Reload to try again.', 6000); initSW(); return; }
  buildIndex(d);
  const pj = await picsReq; if (pj && pj.pics) { PICS = { pics: pj.pics, missing: pj.missing || {}, top: pj.top || {}, pk: pj.fv ? pj.pk || {} : {}, pkmissing: pj.pkmissing || {}, bytes: pj.bytes || 0 }; picOf.length = 0; }
  loadLocalPlans();
  const cur = LS.get(LSK + 'current'); let p = cur ? readLocalPlan(cur) : null;
  if (!p && plansIndex.length) p = readLocalPlan(plansIndex[plansIndex.length - 1].id);
  if (!p) { p = makeExample(); exampleUntouched = true; LS.set(LSK + 'example', p.id + ':' + p.updated); }
  installPlan(p); if (!LS.get(LSK + 'plan:' + p.id)) persistNow(); else setSave('local');
  selectItem('Field grass', false); setTool(S.tool); setShowAreas(showAreas); $('#status').hidden = !S.status && !PROBS.length;
  { const was = LS.get(LSK + '3d'); if (was != null) { if (was === '0' && S.map3d) { S.map3d = false; savePrefs(); } LS.del(LSK + '3d'); } }
  if (S.map3d) enter3d(true); else { hold2d = false; requestDraw(); }
  { const want = location.hash.slice(1), last = LS.get(LSK + 'tab'); showTab(VALID_TABS.includes(want) ? want : S.start === 'last' && VALID_TABS.includes(last) ? last : 'build', true); }
  if (innerWidth < 900) setSheet('peek');
  if (location.hash === '#review') openReview();
  initCapabilities();
  idle(initSW, 2500); if (S.offline) setTimeout(() => idle(() => fillPictures(), 4000), 2500);
  const startSync = () => { if (gdUser) gdPoll(); };
  idle(gdBoot, 1200);
  addEventListener('online', () => { if (S.offline && picFill.done < picFill.total) fillPictures(); startSync(); syncErr = ''; scheduleSync(500); syncUI(); });
  addEventListener('offline', () => { syncSettled(); });
  addEventListener('storage', otherWindow);
  const leaving = () => { rvFlush(); if (dirty) persistNow(true); if (syncOn() && syncPending()) reconcile(); };
  addEventListener('pagehide', leaving);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { leaving(); return; } syncUI(); if (syncOn()) { if (gdUser && gdLive()) gdPoll(); else if (gdUser !== undefined) gdPaused(false); } });
}
boot();
