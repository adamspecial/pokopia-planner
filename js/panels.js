'use strict';
let activeTab = 'build';
const VALID_TABS = ['build', 'layers', 'materials', 'habitats', 'pokemon', 'game', 'plans'];
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
atStart(() => { $$('.tab').forEach(b => b.onclick = () => { if (innerWidth < 900) { if (activeTab === b.dataset.tab && sheetState !== 'peek') setSheet('peek'); else if (sheetState === 'peek') setSheet(S.sheet); } showTab(b.dataset.tab); }); });
atStart(() => { addEventListener('hashchange', () => { if (location.hash === '#review') { openReview(); return; } if (RV.on) closeReview(true); showTab(location.hash.slice(1), true); }); });
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
atStart(() => { (() => {
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
})(); });

let renderQueued = false;
function renderPanel() { if (renderQueued) return; renderQueued = true; requestAnimationFrame(() => { renderQueued = false; const f = { build: renderBuild, layers: renderLayers, materials: renderMaterials, habitats: renderHabitats, pokemon: renderPokemon, game: renderGame, plans: renderPlans }[activeTab]; if (f) f(); }); }

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
atStart(() => { document.addEventListener('pointerdown', pkDown); });
atStart(() => { document.addEventListener('click', e => { if (performance.now() < Math.max(pkQuiet, ddQuiet)) { pkQuiet = ddQuiet = 0; e.preventDefault(); e.stopPropagation(); } }, true); });
atStart(() => { document.addEventListener('contextmenu', e => { if (pkDrag || pkPend || dd || ddPend) e.preventDefault(); }, true); });
atStart(() => { addEventListener('keydown', e => { if (e.key === 'Escape' && pkDrag) { e.stopPropagation(); e.preventDefault(); pkEnd(false); } }, true); });
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
atStart(() => { document.addEventListener('pointerdown', ddDown); });
atStart(() => { document.addEventListener('touchmove', e => { if (dd && e.cancelable) e.preventDefault(); }, { passive: false }); });
atStart(() => { addEventListener('keydown', e => { if (e.key === 'Escape' && dd) { e.stopPropagation(); e.preventDefault(); ddEnd(false); } }, true); });

const WX_TIP = 'The weather in this town. In the game it only changes when a Pokémon uses a Rain Dance or Sunny Day spot, and then it stays. Rain puts out fires with no roof over them for as long as it rains, and turns Smooth Rock off except inside kit houses. Sun changes nothing in the planner yet.';
function setWeather(v) { if ((plan.wx || null) === v) return; plan.wx = v; markDirty(); evaluateAll(); requestDraw(); renderPanel(); refreshInspector(); toast(v === 'rain' ? 'Raining in this town' : v === 'sun' ? 'Sunny in this town' : 'Weather not set'); }
function refreshInspector() { if (!$('#inspector').classList.contains('open') || !selection) return; if (selection.obj && plan.objs.has(selection.obj.id)) showObjInspector(selection.obj); else if (selection.zone) { const z = plan.zones.find(q => q.id === selection.zone.id); if (z) selectZone(z); } else if (selection.house) { const hs = houseById.get(selection.house); if (hs) selectHouse(hs); } }
