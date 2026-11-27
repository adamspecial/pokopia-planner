'use strict';
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
