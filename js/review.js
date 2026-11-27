'use strict';
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
atStart(() => { addEventListener('dragover', e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } }); });
atStart(() => { addEventListener('drop', e => { const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return; e.preventDefault(); if (!/\.json$/i.test(f.name) && f.type !== 'application/json') { toast('Drop a plan file (.json) to open it'); return; } importFile(f); }); });
