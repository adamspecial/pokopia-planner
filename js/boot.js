'use strict';
for (const fn of START.splice(0)) fn();
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
