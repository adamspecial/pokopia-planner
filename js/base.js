'use strict';
const START = [], atStart = fn => { START.push(fn); };
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
const SET_DEF = { gStory: 'zero', gReach: 'rt', gSensor: 2, gSprinkler: 5, gRock: 4, gGen: 10, gMorning: 8, map3d: true, theme: 'system', accent: 'purple', motion: 'system', grid: 'all', shade: true, pics: true, faces: true, labels: true, status: true, tool: 'pan', wheel: 'zoom', tips: true, buzz: true, toast: 'normal', party: true, side: 'right', width: 'normal', sheet: 'half', start: 'last', updates: 'ask', offline: true };
const SET_OPTS = { gStory: ['zero', 'count'], gReach: ['rt', 'r', 'all'], gSensor: [2, 1], gSprinkler: [5, 4], gRock: [4, 6], gGen: [10, 7], gMorning: [8, 7], theme: ['system', 'light', 'dark'], accent: ['purple', 'blue', 'teal', 'pink', 'orange'], motion: ['system', 'on', 'off'], grid: ['all', 'blocks', 'off'], tool: ['pan', 'select'], wheel: ['zoom', 'pan'], toast: ['short', 'normal', 'long'], side: ['right', 'left'], width: ['narrow', 'normal', 'wide'], sheet: ['half', 'full'], start: ['last', 'build'], updates: ['ask', 'auto'] };
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
