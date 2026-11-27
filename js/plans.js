'use strict';
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
atStart(() => { addEventListener('popstate', () => { if (setsOpen()) { const el = $('#sets'); el.hidden = true; el.textContent = ''; $('.app').inert = false; tipHide(); setsBack = null; } const fn = setsAfter; setsAfter = null; if (fn) fn(); }); });
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
atStart(() => { $('#setBtn').onclick = () => openSettings(); });

function modal(title, build, okLabel, onOk, danger, tip) {
  const m = $('#modal'), box = $('#modalBox'); box.textContent = ''; box.className = 'box';
  box.append(h('div', { class: 'insp-head' }, h('h2', { style: 'margin:0' }, title, tip ? ' ' : '', tipBtn(tip)), h('button', { class: 'close', 'aria-label': 'Close', 'data-tip': 'Close', onclick: closeModal }, icon('close'))));
  build(box);
  const acts = h('div', { class: 'acts' }, h('button', { class: 'btn', onclick: closeModal }, onOk ? 'Cancel' : 'Close'));
  if (onOk) acts.append(h('button', { class: 'btn ' + (danger ? 'danger' : 'primary'), onclick: () => { const r = onOk(); if (r !== false) closeModal(); } }, okLabel || 'OK'));
  box.append(acts); m.classList.add('open'); setTimeout(() => { const f = box.querySelector('input,select,button.primary'); if (f) f.focus(); }, 30);
}
function closeModal() { $('#modal').classList.remove('open'); }
atStart(() => { $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); }); });
atStart(() => { addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); }); });

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
