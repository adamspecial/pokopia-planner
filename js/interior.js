'use strict';
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
atStart(() => { addEventListener('resize', () => { if (IED.ob) iedDraw(); }); });
