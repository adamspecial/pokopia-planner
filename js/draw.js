'use strict';
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
  if (!load3d) { const add = () => new Promise((ok, no) => { if (typeof make3d === 'function') { ok(); return; } const s = document.createElement('script'); s.src = 'js/map3d.js?v=' + encodeURIComponent(APP_BUILD); s.onload = () => ok(); s.onerror = () => { s.remove(); no(new Error('load')); }; document.head.append(s); }); load3d = (window.pokopia3d || Promise.reject(new Error('none'))).catch(add).catch((e) => { load3d = null; throw e; }); window.pokopia3d = null; }
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
