'use strict';
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
atStart(() => { cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerup', onUp); cv.addEventListener('pointercancel', onUp); });
atStart(() => { cv.addEventListener('pointerleave', () => { hover = null; updateStatus(); requestDraw(); }); });
atStart(() => { cv.addEventListener('contextmenu', e => e.preventDefault()); });
atStart(() => { cv.addEventListener('dblclick', e => { if (!plan) return; const [x, y] = mapView.pick(e.offsetX, e.offsetY); if (!inB(plan, x, y)) return; const ob = shownStack(y * plan.w + x).find(q => q && ITEMS[q.i].cap); if (ob && ['select', 'pan'].includes(tool)) interiorEditor(ob); }); });
atStart(() => { cv.addEventListener('wheel', e => {
  e.preventDefault(); mapView.stop();
  if (e.ctrlKey || e.metaKey || (S.wheel === 'zoom' && Math.abs(e.deltaY) > 0 && !e.shiftKey && Math.abs(e.deltaX) < 1)) { const z = clamp(mapView.zoom() * Math.exp(-e.deltaY * (e.ctrlKey && e.deltaMode === 0 && Math.abs(e.deltaY) < 50 ? 0.01 : 0.0015)), zMin(), 5); mapView.zoomAt(z, e.offsetX, e.offsetY); }
  else mapView.panBy(-e.deltaX, -e.deltaY);
}, { passive: false }); });
atStart(() => { $('#zin').onclick = () => mapView.zoomAt(clamp(mapView.zoomGoal() * 1.3, zMin(), 5), W / 2, H / 2, true); });
atStart(() => { $('#zout').onclick = () => mapView.zoomAt(clamp(mapView.zoomGoal() / 1.3, zMin(), 5), W / 2, H / 2, true); });
atStart(() => { $('#zfit').onclick = () => mapView.fit(true); });
atStart(() => { $('#zturn').onclick = (e) => turn3d(e.shiftKey ? -1 : 1); });
atStart(() => { $('#ztilt').onclick = () => viewOpen(); });
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
atStart(() => { $('#zlayers').onclick = () => openLayers(); });
atStart(() => { $('#hdrPlan').onclick = () => openTab('plans'); });
atStart(() => { $('#hdrArea').onclick = () => openTab('plans'); });
atStart(() => { $('#saveChip').onclick = () => { openTab('plans'); setTimeout(() => { const c = $('#syncCard'); if (c) c.scrollIntoView({ block: 'nearest', behavior: calm() ? 'auto' : 'smooth' }); }, 80); }; });
atStart(() => { $('#zsys').onclick = () => sysOpen(); });
atStart(() => { addEventListener('pointerdown', e => { const m = $('#sysmenu'), v = $('#viewmenu'); if (m && !m.hidden && !m.parentNode.contains(e.target)) sysOpen(false); if (v && !v.hidden && !v.parentNode.contains(e.target)) viewOpen(false); }, true); });
atStart(() => { $$('.tbtn[data-tool]').forEach(b => b.onclick = () => pickTool(b.dataset.tool)); });
atStart(() => { $('#undoBtn').onclick = undo; $('#redoBtn').onclick = redo; });
atStart(() => { addEventListener('keydown', e => {
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
}); });
atStart(() => { addEventListener('keyup', e => { if (e.key === ' ') { spaceDown = false; cv.style.cursor = ''; } }); });

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
