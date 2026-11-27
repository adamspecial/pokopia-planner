'use strict';
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
