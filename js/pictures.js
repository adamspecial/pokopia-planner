'use strict';
let swatchCache = new Map();
function swatchURL(it) {
  if (swatchCache.has(it.i)) return swatchCache.get(it.i);
  const c = document.createElement('canvas'); const S = 56; c.width = S; c.height = S; const x = c.getContext('2d');
  x.fillStyle = it.L === 'g' ? it.col : (it.c === 'Nature' ? '#d6dfcf' : '#e8ebe5'); x.fillRect(0, 0, S, S);
  if (it.L === 'g') drawGroundCell(x, it, 0, 0, S);
  else if (it.sh === 'kit') { drawItem(x, it, 2, 2, S / 2 - 2, 2, 2, false, it.look ? (bx, by, bw, bh) => drawLook(x, it, bx, by, bh, bw / bh, 1) : null); }
  else if (!drawLook(x, it, 0, 0, S)) drawItem(x, it, 0, 0, S);
  const url = c.toDataURL(); swatchCache.set(it.i, url); return url;
}
const PIC_WEB = 'https://www.serebii.net/pokemonpokopia/items/';
const picSlug = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
let PICS = { pics: {}, missing: {}, top: {}, pk: {}, pkmissing: {} };
const picRemote = (it) => it && it.im ? (it.im === 1 ? picSlug(it.n) : String(it.im)) : null;
const picKey = (it) => { const r = picRemote(it); return r && r.replace(/[^a-z0-9-]/g, ''); };
const localPic = (k) => PICS.pics[k] ? 'pics/' + k + '.webp?v=' + PICS.pics[k] : null;
const picURL = (it) => { const k = picKey(it); if (!k) return null; return localPic(k) || (/^HTTP 404/.test(PICS.missing[k] || '') ? null : PIC_WEB + encodeURIComponent(picRemote(it)) + '.png'); };
const MAP_PIC_MIN = 9, TILE_PIC_MIN = 16;
const mapPics = new Map();
const picQueue = []; let picBusy = 0, picRedraw = false, sizedCount = 0;
const picOf = [];
function picsFor(it) {
  let p = picOf[it.i];
  if (!p) { const k = picKey(it), t = k && PICS.top && PICS.top[k]; p = picOf[it.i] = [k ? localPic(k) : null, t && t[0] ? 'pics/top/' + k + '.webp?v=' + t[0] : null, t ? t[1] : null]; }
  return p;
}
function mapPic(url) {
  let p = mapPics.get(url);
  if (!p) { p = { img: null, box: null, sized: new Map(), failed: false, memo: 0, memoR: null }; mapPics.set(url, p); picQueue.push(url); pumpPics(); }
  return p.img ? p : null;
}
function pumpPics() {
  while (picBusy < 6 && picQueue.length) {
    const url = picQueue.shift(), p = mapPics.get(url), im = new Image(); picBusy++;
    const done = (ok) => { picBusy--; if (ok && im.naturalWidth) { if (/\/top\//.test(url)) p.box = [0, 0, im.naturalWidth, im.naturalHeight]; else [p.box, p.col, p.leaf, p.bloom] = picFacts(url, im); p.img = im; picsArrived(); } else p.failed = true; pumpPics(); };
    im.src = url;
    (im.decode ? im.decode() : new Promise((ok, no) => { im.onload = ok; im.onerror = no; })).then(() => done(true), () => done(false));
  }
}
function picsArrived() { if (picRedraw) return; picRedraw = true; requestAnimationFrame(() => { picRedraw = false; requestDraw(); if (IED.ob) iedDraw(); }); }
let PIC_FACTS = null, picFactsT = 0;
function picFacts(url, im) {
  if (!PIC_FACTS) { try { PIC_FACTS = JSON.parse(LS.get(LSK + 'picfacts') || '{}') || {}; } catch (e) { PIC_FACTS = {}; } }
  const k = url.replace(/^pics\//, ''), hit = PIC_FACTS[k]; if (Array.isArray(hit) && Array.isArray(hit[0]) && hit[0].length === 4) return hit;
  const v = readPic(im); if (v[1] == null && v.length < 3) return v; PIC_FACTS[k] = v;
  clearTimeout(picFactsT); picFactsT = setTimeout(() => { const keys = Object.keys(PIC_FACTS); if (keys.length > 1600) PIC_FACTS = Object.fromEntries(keys.slice(-1200).map(q => [q, PIC_FACTS[q]])); LS.set(LSK + 'picfacts', JSON.stringify(PIC_FACTS)); }, 4000);
  return v;
}
function readPic(im) {
  const w = im.naturalWidth, h = im.naturalHeight;
  try {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
    const a = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let i = y * w * 4 + 3, xx = 0; xx < w; xx++, i += 4) if (a[i] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; y1 = y; }
    if (x1 < x0) return [[0, 0, w, h], null];
    const cube = w === 200 && Math.abs(x0 - 24) <= 4 && Math.abs(y0 - 24) <= 4 && Math.abs(x1 - 177) <= 4 && Math.abs(y1 - 182) <= 4;
    const [rx0, ry0, rx1, ry1] = cube ? [66, 40, 142, 58] : [x0, y0, x1, y1], all = [0, 0, 0, 0], leaf = [0, 0, 0, 0], bloom = [0, 0, 0, 0];
    for (let y = ry0; y <= ry1; y++) for (let xx = rx0, i = (y * w + xx) * 4; xx <= rx1; xx++, i += 4) {
      if (a[i + 3] <= 200) continue; const R = a[i], G = a[i + 1], B = a[i + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B); if (mx < 60) continue;
      const add = (t) => { t[0] += R; t[1] += G; t[2] += B; t[3]++; }; add(all);
      if (mx - mn > 40) add(G >= R && G >= B ? leaf : bloom);
    }
    const hex = (t) => t[3] ? '#' + t.slice(0, 3).map(v => Math.round(v / t[3]).toString(16).padStart(2, '0')).join('') : null;
    return [[x0, y0, x1 - x0 + 1, y1 - y0 + 1], hex(all), hex(leaf), bloom[3] > all[3] * 0.06 ? hex(bloom) : null];
  } catch (e) { }
  return [[0, 0, w, h], null];
}
function sizedPic(p, px) {
  if (p.memo === px) return p.memoR;
  const [bx, by, bw, bh] = p.box, big = Math.max(bw, bh); let r;
  if (px >= big * 0.75) r = [p.img, bx, by, bw, bh];
  else {
    const step = Math.max(8, Math.round(Math.SQRT2 ** Math.ceil(Math.log2(px) * 2)));
    let cv = p.sized.get(step);
    if (!cv) {
      if (++sizedCount > 1500) { for (const q of mapPics.values()) { q.sized.clear(); q.memo = 0; } sizedCount = 1; }
      const tw = Math.max(1, Math.round(bw * step / big)), th = Math.max(1, Math.round(bh * step / big));
      let src = p.img, sx = bx, sy = by, w = bw, h = bh;
      do {
        const nw = Math.max(tw, Math.ceil(w / 2)), nh = Math.max(th, Math.ceil(h / 2)), t = document.createElement('canvas'); t.width = nw; t.height = nh;
        const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(src, sx, sy, w, h, 0, 0, nw, nh);
        src = t; sx = sy = 0; w = nw; h = nh;
      } while (w > tw || h > th);
      cv = src; p.sized.set(step, cv);
    }
    r = [cv, 0, 0, cv.width, cv.height];
  }
  p.memo = px; p.memoR = r; return r;
}
function drawPicIn(c, p, x, y, w, h, fill) {
  let dw = w, dh = h; if (!fill) { const k = Math.min(w / p.box[2], h / p.box[3]); dw = p.box[2] * k; dh = p.box[3] * k; }
  const [src, sx, sy, sw, sh] = sizedPic(p, Math.ceil(Math.max(dw, dh) * dpr));
  c.drawImage(src, sx, sy, sw, sh, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
const picInfo = (it) => { const u = picsFor(it)[0]; return (u && mapPics.get(u)) || null; };
const itemColour = (it) => { if (it.look) return it.look.a; const p = picInfo(it); return (p && p.col) || it.col; };
const fenceLike = (it) => /fenc|railing|enclosure|barrier|handrail|\bposts\b/i.test(it.n);
function structAround(at) {
  if (!at) return { n: null, s: null, w: null, e: null };
  const [gx, gy, w, h, z = 0] = at, one = (x, y) => { if (!inB(plan, x, y)) return null; const o = occAt(plan, y * plan.w + x, z), ob = o && plan.objs.get(o); return ob && structural(ITEMS[ob.i]) ? ITEMS[ob.i] : null; };
  const row = (y) => { for (let x = gx; x < gx + w; x++) { const q = one(x, y); if (q) return q; } return null; }, col = (x) => { for (let y = gy; y < gy + h; y++) { const q = one(x, y); if (q) return q; } return null; };
  return { n: row(gy - 1), s: row(gy + h), w: col(gx - 1), e: col(gx + w) };
}
function wallAlongAt(at, horiz) {
  if (!at) return null; const [gx, gy, w, h, z = 0] = at;
  for (let d = 1; d <= 6; d++) for (const [x, y] of horiz ? [[gx - d, gy], [gx + w - 1 + d, gy]] : [[gx, gy - d], [gx, gy + h - 1 + d]]) {
    if (!inB(plan, x, y)) continue; const o = occAt(plan, y * plan.w + x, z), ob = o && plan.objs.get(o); if (!ob) continue; const q = ITEMS[ob.i]; if (!structural(q)) return null; if (!inWall(q)) return q;
  }
  return null;
}
function wallTop(c, col, x, y, w, h, s, open, round, dots) {
  const dk = shade(col, -0.45), t = Math.max(1.5, s * 0.06), r = round ? Math.min(w, h) * 0.3 : 0;
  c.fillStyle = col;
  if (r) { c.beginPath(); const R = (o1, o2) => o1 && o2 ? r : 0, a = R(open.n, open.w), b = R(open.n, open.e), cc = R(open.s, open.e), d = R(open.s, open.w);
    c.moveTo(x + a, y); c.lineTo(x + w - b, y); c.arcTo(x + w, y, x + w, y + b, b); c.lineTo(x + w, y + h - cc); c.arcTo(x + w, y + h, x + w - cc, y + h, cc); c.lineTo(x + d, y + h); c.arcTo(x, y + h, x, y + h - d, d); c.lineTo(x, y + a); c.arcTo(x, y, x + a, y, a); c.closePath(); c.fill();
    c.strokeStyle = dk; c.lineWidth = t; c.stroke();
    c.fillStyle = dots || shade(col, 0.22); for (const [fx, fy] of [[0.3, 0.32], [0.68, 0.28], [0.5, 0.62], [0.24, 0.72], [0.76, 0.7]]) { c.beginPath(); c.arc(x + w * fx, y + h * fy, Math.max(1, s * (dots ? 0.1 : 0.09)), 0, 7); c.fill(); }
    return;
  }
  c.fillRect(x, y, w + 0.5, h + 0.5);
  c.fillStyle = 'rgba(255,255,255,.22)'; if (open.n) c.fillRect(x, y, w, t * 1.2);
  c.fillStyle = 'rgba(0,0,0,.28)'; if (open.s) c.fillRect(x, y + h - s * 0.2, w, s * 0.2);
  c.fillStyle = dk; if (open.n) c.fillRect(x, y, w, t); if (open.s) c.fillRect(x, y + h - t, w, t); if (open.w) c.fillRect(x, y, t, h); if (open.e) c.fillRect(x + w - t, y, t, h);
}
function drawStructure(c, it, x, y, s, wc, hc, at) {
  const W = wc * s, H = hc * s, col = itemColour(it), dk = shade(col, -0.45), nb = structAround(at), open = { n: !nb.n, s: !nb.s, w: !nb.w, e: !nb.e };
  if (inWall(it)) {
    const horiz = wc !== hc ? wc > hc : !!(nb.w || nb.e) || !(nb.n || nb.s), wall = wallAlongAt(at, horiz), wcol = wall ? itemColour(wall) : shade(col, 0.15), lw = Math.max(1.5, s * 0.06);
    if (isWindow(it)) {
      wallTop(c, wcol, x, y, W, H, s, open); c.fillStyle = '#cdeefa'; c.strokeStyle = shade(wcol, -0.5); c.lineWidth = lw;
      if (horiz) { c.fillRect(x, y + H * 0.34, W, H * 0.32); c.strokeRect(x + lw / 2, y + H * 0.34, W - lw, H * 0.32); } else { c.fillRect(x + W * 0.34, y, W * 0.32, H); c.strokeRect(x + W * 0.34, y + lw / 2, W * 0.32, H - lw); }
      return;
    }
    const j = s * 0.16, fence = wall && fenceLike(wall);
    c.fillStyle = wcol; c.strokeStyle = shade(wcol, -0.45); c.lineWidth = lw;
    const jamb = (jx, jy, jw, jh) => { c.fillRect(jx, jy, jw, jh); c.strokeRect(jx + lw / 2, jy + lw / 2, jw - lw, jh - lw); };
    if (fence) { const ps = s * 0.3; if (horiz) { jamb(x, y + (H - ps) / 2, ps, ps); jamb(x + W - ps, y + (H - ps) / 2, ps, ps); } else { jamb(x + (W - ps) / 2, y, ps, ps); jamb(x + (W - ps) / 2, y + H - ps, ps, ps); } }
    else if (horiz) { jamb(x, y, j, H); jamb(x + W - j, y, j, H); } else { jamb(x, y, W, j); jamb(x, y + H - j, W, j); }
    const e = fence ? s * 0.3 : j, th = 0.52; c.fillStyle = col; c.strokeStyle = shade(col, -0.6); c.lineWidth = Math.max(2, s * 0.08);
    let dx, dy, dw, dh; if (horiz) { dx = x + e; dw = W - 2 * e; dh = H * th; dy = y + (H - dh) / 2; } else { dy = y + e; dh = H - 2 * e; dw = W * th; dx = x + (W - dw) / 2; }
    c.fillRect(dx, dy, dw, dh); c.strokeRect(dx + c.lineWidth / 2, dy + c.lineWidth / 2, dw - c.lineWidth, dh - c.lineWidth);
    c.fillStyle = shade(col, 0.3); if (horiz) c.fillRect(dx + dw * 0.12, dy + dh * 0.3, dw * 0.76, Math.max(1, dh * 0.14)); else c.fillRect(dx + dw * 0.3, dy + dh * 0.12, Math.max(1, dw * 0.14), dh * 0.76);
    c.fillStyle = '#f2c94c'; c.strokeStyle = '#6b4c0c'; c.lineWidth = Math.max(1, s * 0.03); const kr = Math.max(1.8, s * 0.085);
    c.beginPath(); if (horiz) c.arc(dx + dw - Math.max(kr * 2.2, dw * 0.14), dy + dh / 2, kr, 0, 7); else c.arc(dx + dw / 2, dy + dh - Math.max(kr * 2.2, dh * 0.14), kr, 0, 7); c.fill(); c.stroke();
    return;
  }
  if (fenceLike(it)) {
    const cx = x + W / 2, cy = y + H / 2, rw = Math.max(2, s * 0.14);
    for (const [q, ex, ey] of [[nb.n, 0, -1], [nb.s, 0, 1], [nb.w, -1, 0], [nb.e, 1, 0]]) if (q) {
      c.fillStyle = dk; if (ex) c.fillRect(Math.min(cx, cx + ex * W / 2), cy - rw / 2 - 1, W / 2 + 0.5, rw + 2); else c.fillRect(cx - rw / 2 - 1, Math.min(cy, cy + ey * H / 2), rw + 2, H / 2 + 0.5);
      c.fillStyle = col; if (ex) c.fillRect(Math.min(cx, cx + ex * W / 2), cy - rw / 2, W / 2 + 0.5, rw); else c.fillRect(cx - rw / 2, Math.min(cy, cy + ey * H / 2), rw, H / 2 + 0.5);
    }
    const ps = s * 0.3; c.fillStyle = col; c.fillRect(cx - ps / 2, cy - ps / 2, ps, ps); c.strokeStyle = dk; c.lineWidth = Math.max(1, s * 0.05); c.strokeRect(cx - ps / 2, cy - ps / 2, ps, ps);
    return;
  }
  const pi = it.sh === 'hedge' && (it.look ? { leaf: it.look.a, bloom: it.look.b } : picInfo(it)); wallTop(c, (pi && pi.leaf) || col, x, y, W, H, s, open, it.sh === 'hedge', pi && pi.bloom);
  if (/pillar/i.test(it.n)) { const ps = Math.min(W, H) * 0.56, px = x + (W - ps) / 2, py = y + (H - ps) / 2; c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(px + s * 0.05, py + s * 0.07, ps, ps); c.fillStyle = shade(col, 0.18); c.fillRect(px, py, ps, ps); c.strokeStyle = dk; c.lineWidth = Math.max(1.5, s * 0.06); c.strokeRect(px, py, ps, ps); }
}
const FURN_KINDS = [
  ['lamp', /lamp|\blights?\b|spotlight|lantern|chandelier|streetlight|candle|torch/i],
  ['bed', /\bbed\b/i], ['fridge', /fridge|refrigerator/i], ['stove', /stove|oven/i], ['sink', /\bsink\b/i], ['washer', /washing machine/i],
  ['toilet', /toilet/i], ['bath', /bathtub/i], ['shower', /shower/i], ['tv', /television/i],
  ['sofa', /sofa|couch/i], ['bench', /\bbench\b/i], ['stool', /stool|cushion|\bseat\b/i], ['chair', /chair/i],
  ['shelf', /shelf|bookcase|\brack\b/i], ['storage', /\bbox\b|chest|closet|locker|cabinet|dresser|wardrobe/i],
  ['table', /\btable\b(?! (lamp|setting))|\bdesk\b(?! light)|\bcounter\b/i],
];
const FURN_SKIP = new Set(['Special', 'Kits', 'Nature', 'Poster', 'Wallpaper', 'Rug', 'Terrain', 'Blocks', 'Buildings']);
const furnKind = (it) => { if (it.fk === undefined) { const k = it.L === 'o' && !FURN_SKIP.has(it.c) && !structural(it) && !(it.look && LOOKS[it.look.k]) && !/music box/i.test(it.n) && FURN_KINDS.find(([, re]) => re.test(it.n)); it.fk = k ? k[0] : null; } return it.fk; };
function drawFurniture(c, it, kind, x, y, s, wc, hc) {
  const W = wc * s, H = hc * s, col = itemColour(it), alt = it.look && it.look.b, dk = shade(col, -0.55), lt = shade(col, 0.35), lw = Math.max(1, s * 0.05), horiz = W > H, vert = H > W;
  const P = (f) => Math.min(W, H) * f, big = Math.min(W, H) * dpr >= 28, cx = x + W / 2, cy = y + H / 2, water = '#cde8f2';
  const shape = (bx, by, bw, bh, r, fill, stroke = dk) => { roundRect(c, bx, by, Math.max(1, bw), Math.max(1, bh), Math.max(0, Math.min(r, bw / 2, bh / 2))); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); } };
  const shadow = (bx, by, bw, bh, r) => { c.fillStyle = 'rgba(0,0,0,.16)'; roundRect(c, bx + s * 0.04, by + s * 0.06, bw, bh, Math.min(r, bw / 2, bh / 2)); c.fill(); };
  const dot = (dx, dy, r, fill, stroke) => { c.beginPath(); c.arc(dx, dy, Math.max(0.5, r), 0, 7); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); } };
  const body = (f, r) => { const p = P(f), bx = x + p, by = y + p, bw = W - 2 * p, bh = H - 2 * p; shadow(bx, by, bw, bh, r); shape(bx, by, bw, bh, r, col); return [bx, by, bw, bh]; };
  if (Math.min(W, H) * dpr < 20) { c.fillStyle = kind === 'lamp' ? '#ffd65a' : col; const p = P(kind === 'lamp' || kind === 'stool' ? 0.25 : 0.1); c.fillRect(x + p, y + p, W - 2 * p, H - 2 * p); return; }
  c.save();
  switch (kind) {
    case 'bed': {
      const p = P(0.07), bx = x + p, by = y + p, bw = W - 2 * p, bh = H - 2 * p, r = P(0.12), m = P(0.08), pil = shade(alt || col, 0.72);
      shadow(bx, by, bw, bh, r); shape(bx, by, bw, bh, r, alt || shade(col, -0.25));
      const across = horiz ? hc : wc, pils = Math.max(1, across), len = horiz ? bw : bh, wid = horiz ? bh : bw, hd = len * 0.3, g = m * 0.6;
      if (!horiz) shape(bx + m, by + hd, bw - 2 * m, bh - hd - m, r * 0.6, col); else shape(bx + hd, by + m, bw - hd - m, bh - 2 * m, r * 0.6, col);
      c.fillStyle = lt; if (!horiz) c.fillRect(bx + m, by + hd, bw - 2 * m, Math.max(2, len * 0.1)); else c.fillRect(bx + hd, by + m, Math.max(2, len * 0.1), bh - 2 * m);
      for (let i = 0; i < pils; i++) { const pw = (wid - 2 * m - g * (pils - 1)) / pils, o = m + i * (pw + g); if (!horiz) shape(bx + o, by + m, pw, hd - m * 1.6, P(0.1), pil, shade(pil, -0.35)); else shape(bx + m, by + o, hd - m * 1.6, pw, P(0.1), pil, shade(pil, -0.35)); }
      break;
    }
    case 'table': { const [bx, by, bw, bh] = body(0.1, P(0.14)); if (big) { c.strokeStyle = alt || lt; c.lineWidth = lw * (alt ? 1.6 : 1); roundRect(c, bx + P(0.09), by + P(0.09), bw - P(0.18), bh - P(0.18), P(0.08)); c.stroke(); } break; }
    case 'chair': {
      const p = P(0.13), bk = P(0.19), back = alt || shade(col, -0.28);
      if (horiz) { shadow(x + p, y + p, W - 2 * p, H - 2 * p, P(0.1)); shape(x + p + bk * 0.6, y + p, W - 2 * p - bk * 0.6, H - 2 * p, P(0.1), col); shape(x + p, y + p - P(0.03), bk, H - 2 * p + P(0.06), P(0.06), back); }
      else if (vert) { shadow(x + p, y + p, W - 2 * p, H - 2 * p, P(0.1)); shape(x + p, y + p + bk * 0.6, W - 2 * p, H - 2 * p - bk * 0.6, P(0.1), col); shape(x + p - P(0.03), y + p, W - 2 * p + P(0.06), bk, P(0.06), back); }
      else { shadow(x + p, y + p, W - 2 * p, H - 2 * p, P(0.1)); shape(x + p, y + p + bk * 0.55, W - 2 * p, H - 2 * p - bk * 0.55, P(0.1), col); shape(x + p - P(0.03), y + p, W - 2 * p + P(0.06), bk, P(0.06), back); }
      break;
    }
    case 'stool': { const r = Math.min(W, H) * 0.3; c.fillStyle = 'rgba(0,0,0,.16)'; c.beginPath(); c.arc(cx + s * 0.04, cy + s * 0.06, r, 0, 7); c.fill(); dot(cx, cy, r, col, dk); if (big) dot(cx, cy, r * 0.55, alt || lt); break; }
    case 'sofa': {
      const p = P(0.08), bx = x + p, by = y + p, bw = W - 2 * p, bh = H - 2 * p, r = P(0.14), back = (vert ? bw : bh) * 0.3, arm = P(0.16), cush = alt ? col : shade(col, 0.22);
      shadow(bx, by, bw, bh, r); shape(bx, by, bw, bh, r, alt || shade(col, -0.22));
      if (!vert) { shape(bx + arm, by + back, bw - 2 * arm, bh - back - P(0.04), P(0.08), cush); c.strokeStyle = dk; c.lineWidth = lw; for (let i = 1; i < wc; i++) { const lx = bx + arm + (bw - 2 * arm) * i / wc; c.beginPath(); c.moveTo(lx, by + back); c.lineTo(lx, by + bh - P(0.04)); c.stroke(); } }
      else { shape(bx + back, by + arm, bw - back - P(0.04), bh - 2 * arm, P(0.08), cush); c.strokeStyle = dk; c.lineWidth = lw; for (let i = 1; i < hc; i++) { const ly = by + arm + (bh - 2 * arm) * i / hc; c.beginPath(); c.moveTo(bx + back, ly); c.lineTo(bx + bw - P(0.04), ly); c.stroke(); } }
      break;
    }
    case 'bench': {
      const t = (vert ? W : H) * 0.5, bx = vert ? x + (W - t) / 2 : x + P(0.1), by = vert ? y + P(0.1) : y + (H - t) / 2, bw = vert ? t : W - P(0.2), bh = vert ? H - P(0.2) : t;
      shadow(bx, by, bw, bh, P(0.06)); shape(bx, by, bw, bh, P(0.06), col); c.strokeStyle = dk; c.lineWidth = lw; c.globalAlpha *= 0.7;
      for (const f of [1 / 3, 2 / 3]) { c.beginPath(); if (vert) { c.moveTo(bx + bw * f, by + P(0.04)); c.lineTo(bx + bw * f, by + bh - P(0.04)); } else { c.moveTo(bx + P(0.04), by + bh * f); c.lineTo(bx + bw - P(0.04), by + bh * f); } c.stroke(); }
      break;
    }
    case 'storage': {
      const [bx, by, bw, bh] = body(0.1, P(0.08)); c.strokeStyle = shade(col, -0.35); c.lineWidth = lw;
      if (!vert) { c.beginPath(); c.moveTo(bx + lw, by + bh * 0.3); c.lineTo(bx + bw - lw, by + bh * 0.3); c.stroke(); shape(cx - P(0.08), by + bh * 0.3 - P(0.06), P(0.16), P(0.14), P(0.03), alt || '#e7c35a', shade(alt || '#e7c35a', -0.55)); }
      else { c.beginPath(); c.moveTo(bx + bw * 0.3, by + lw); c.lineTo(bx + bw * 0.3, by + bh - lw); c.stroke(); shape(bx + bw * 0.3 - P(0.06), cy - P(0.08), P(0.14), P(0.16), P(0.03), alt || '#e7c35a', shade(alt || '#e7c35a', -0.55)); }
      break;
    }
    case 'shelf': {
      const d = (vert ? W : H) * 0.56, bx = x + P(0.06), by = y + P(0.06), bw = vert ? d : W - P(0.12), bh = vert ? H - P(0.12) : d;
      shadow(bx, by, bw, bh, P(0.05)); shape(bx, by, bw, bh, P(0.05), col);
      if (big) { const books = alt ? [alt, shade(alt, 0.35), shade(alt, -0.25)] : ['#d9534a', '#4f8fd0', '#e3b341', '#5cae6a', '#9a6bc4'], n = Math.max(3, Math.round((vert ? bh : bw) / (s * 0.16)));
        for (let i = 0; i < n; i++) { c.fillStyle = books[i % books.length]; const f = (i + 0.2) / n, g = 0.6 / n; if (vert) c.fillRect(bx + bw * 0.55, by + bh * f, bw * 0.32, bh * g); else c.fillRect(bx + bw * f, by + bh * 0.55, bw * g, bh * 0.32); } }
      break;
    }
    case 'lamp': {
      const R = Math.min(W, H) * 0.5, g = c.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(255,214,90,.9)'); g.addColorStop(0.55, 'rgba(255,214,90,.45)'); g.addColorStop(1, 'rgba(255,214,90,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill(); dot(cx, cy, P(0.27), col, dk); const bulb = alt && lum(alt) > 0.6 ? alt : '#fff3b0'; dot(cx, cy, P(0.13), bulb, shade(bulb, -0.4));
      if (big) { c.strokeStyle = 'rgba(170,120,20,.7)'; c.lineWidth = lw; c.beginPath(); for (let a = 0; a < 8; a++) { const an = a * Math.PI / 4; c.moveTo(cx + Math.cos(an) * P(0.33), cy + Math.sin(an) * P(0.33)); c.lineTo(cx + Math.cos(an) * P(0.44), cy + Math.sin(an) * P(0.44)); } c.stroke(); } break;
    }
    case 'fridge': { const [bx, by, bw, bh] = body(0.12, P(0.06)); c.strokeStyle = dk; c.lineWidth = lw; c.beginPath(); c.moveTo(bx, by + bh * 0.38); c.lineTo(bx + bw, by + bh * 0.38); c.stroke(); c.fillStyle = alt || dk; c.fillRect(bx + bw * 0.78, by + bh * 0.14, Math.max(1.5, bw * 0.07), bh * 0.16); c.fillRect(bx + bw * 0.78, by + bh * 0.48, Math.max(1.5, bw * 0.07), bh * 0.28); break; }
    case 'stove': { const [bx, by, bw, bh] = body(0.08, P(0.06)); const r = Math.min(bw, bh) * 0.15; for (const [fx, fy] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]]) dot(bx + bw * fx, by + bh * fy, r, alt || '#3a3a3a', shade(alt || '#3a3a3a', 0.4)); break; }
    case 'sink': { const [bx, by, bw, bh] = body(0.08, P(0.08)); shape(bx + bw * 0.18, by + bh * 0.26, bw * 0.64, bh * 0.58, P(0.12), water); dot(cx, by + bh * 0.14, P(0.06), alt || '#9aa6ad', dk); break; }
    case 'washer': { const [bx, by, bw, bh] = body(0.08, P(0.08)); dot(cx, cy + P(0.04), Math.min(bw, bh) * 0.3, alt || water, dk); dot(cx, cy + P(0.04), Math.min(bw, bh) * 0.16, shade(alt || water, 0.3)); break; }
    case 'toilet': { const t = P(0.24); shadow(x + P(0.22), y + P(0.08), W - P(0.44), H * 0.8, P(0.08)); shape(x + P(0.2), y + P(0.08), W - P(0.4), t, P(0.06), col); c.beginPath(); c.ellipse(cx, y + H * 0.62, W * 0.27, H * 0.3, 0, 0, 7); c.fillStyle = col; c.fill(); c.strokeStyle = dk; c.lineWidth = lw; c.stroke(); c.beginPath(); c.ellipse(cx, y + H * 0.64, W * 0.15, H * 0.18, 0, 0, 7); c.fillStyle = water; c.fill(); break; }
    case 'bath': { const [bx, by, bw, bh] = body(0.06, P(0.2)); const m = P(0.14); shape(bx + m, by + m, bw - 2 * m, bh - 2 * m, P(0.16), water); dot(horiz ? bx + bw - m * 2 : cx, horiz ? cy : by + bh - m * 2, P(0.05), alt || '#7d8a90'); break; }
    case 'shower': { const [bx, by, bw, bh] = body(0.08, P(0.06)); const m = P(0.12); shape(bx + m, by + m, bw - 2 * m, bh - 2 * m, P(0.04), water); c.strokeStyle = shade(water, -0.3); c.lineWidth = lw; c.beginPath(); c.moveTo(bx + m, by + m); c.lineTo(bx + bw - m, by + bh - m); c.moveTo(bx + bw - m, by + m); c.lineTo(bx + m, by + bh - m); c.stroke(); dot(bx + m * 1.6, by + m * 1.6, P(0.08), '#9aa6ad', dk); break; }
    case 'tv': { const t = (vert ? W : H) * 0.3; const bx = vert ? cx - t / 2 : x + P(0.08), by = vert ? y + P(0.08) : cy - t / 2, bw = vert ? t : W - P(0.16), bh = vert ? H - P(0.16) : t; shadow(bx, by, bw, bh, P(0.03)); shape(bx, by, bw, bh, P(0.03), it.look ? col : '#2c2f36', it.look ? dk : '#14161a'); c.fillStyle = alt || '#6fc3ff'; if (vert) c.fillRect(bx + bw - Math.max(1.5, bw * 0.25), by + P(0.04), Math.max(1.5, bw * 0.25), bh - P(0.08)); else c.fillRect(bx + P(0.04), by + bh - Math.max(1.5, bh * 0.25), bw - P(0.08), Math.max(1.5, bh * 0.25)); break; }
  }
  c.restore();
}
function drawKitUp(c, ob, s, d, rix, sh = true) {
  const it = ITEMS[ob.i], z = zOf(ob), x = view.px + ob.x * s, y = view.py + ob.y * s, W = ob.w * s, H = ob.h * s;
  if (d > 0 && sh) upShadow(c, ob, s);
  if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(x, y, W + 0.5, H + 0.5); } else drawPicItem(c, it, x, y, s, ob.w, ob.h, true, [ob.x, ob.y, ob.w, ob.h, z]);
  if (d < 0) { const a = c.globalAlpha; c.globalAlpha = a * Math.min(0.45, 0.12 - 0.06 * d); c.fillStyle = '#000'; c.fillRect(x, y, W, H); c.globalAlpha = a; }
  if (rix) kitBadge(c, ob, s, rix);
  if (s >= 18) lvBadge(c, z, x, y, s);
}
function drawRaised(c, ob, s, d = zOf(ob)) {
  const it = ITEMS[ob.i], z = zOf(ob), k = 0.72, w = ob.w * s, hh = ob.h * s, ix = view.px + ob.x * s + w * (1 - k) / 2, iy = view.py + ob.y * s + hh * (1 - k) / 2 - clamp(d, 0, 3) * s * 0.03;
  const a = c.globalAlpha; if (d > 0) { c.globalAlpha = a * 0.35; c.fillStyle = '#000'; roundRect(c, ix + s * 0.05, iy + s * 0.08, w * k, hh * k, Math.min(8, s * 0.18)); c.fill(); c.globalAlpha = a; }
  if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(ix, iy, w * k, hh * k); }
  else { c.save(); c.translate(ix, iy); c.scale(k, k); drawPicItem(c, it, 0, 0, s, ob.w, ob.h, s >= 14, [ob.x, ob.y, ob.w, ob.h, z, faceOf(ob)]); c.restore(); }
  if (d < 0) { c.globalAlpha = a * Math.min(0.45, 0.12 - 0.06 * d); c.fillStyle = '#000'; roundRect(c, ix, iy, w * k, hh * k, Math.min(8, s * 0.18)); c.fill(); c.globalAlpha = a; }
  if (s >= 18) lvBadge(c, z, view.px + ob.x * s, view.py + ob.y * s, s);
}
function lvBadge(c, z, x, y, s) { const t = lvTxt(z), f = Math.round(Math.max(9, s * 0.2)); c.font = `700 ${f}px ${BODY_FONT}`; const tw = c.measureText(t).width + f * 0.7, bx = x + 2, by = y + 2; c.fillStyle = 'rgba(20,24,28,.78)'; roundRect(c, bx, by, tw, f + 4, (f + 4) / 2); c.fill(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, bx + tw / 2, by + (f + 4) / 2 + 0.5); }
const solidUp = (it) => structural(it) && !fenceLike(it);
function upShadow(c, ob, s) { c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(view.px + ob.x * s + s * 0.07, view.py + ob.y * s + s * 0.12, ob.w * s, ob.h * s); }
function drawUp(c, ob, s, d = zOf(ob)) {
  const it = ITEMS[ob.i], z = zOf(ob), x = view.px + ob.x * s, y = view.py + ob.y * s, W = ob.w * s, H = ob.h * s, at = [ob.x, ob.y, ob.w, ob.h, z];
  if (s < 6) { c.fillStyle = itemColour(it); c.fillRect(x, y, W + 0.5, H + 0.5); } else drawPicItem(c, it, x, y, s, ob.w, ob.h, true, at);
  if (solidUp(it) && it.sh !== 'hedge') { const a = c.globalAlpha; c.globalAlpha = a * (d > 0 ? Math.min(0.3, 0.06 * d) : Math.min(0.45, 0.12 - 0.06 * d)); c.fillStyle = d > 0 ? '#fff' : '#000'; c.fillRect(x, y, W, H); c.globalAlpha = a; }
  if (s >= 18) { const nb = ob.id ? structAround(at) : {}; if (!nb.w && !nb.n) lvBadge(c, z, x, y, s); }
}
const TOP2D = new Set('steps ladder awning beam pipeh pipecurve pipet pipeupt pipeup border bordercorner partition slide cannon roofslope roofvalley canoe raft bike wagon rocket sleepingbag hammock arrowsign arrowleft bed fridge stove sink washer toilet bath tv sofa bench chair shelf storage'.split(' '));
const turns2d = (it) => it.c !== 'Kits' && turnable(it) && !hangs(it) && (TOP2D.has(lookK(it)) || TOP2D.has(furnKind(it)));
function drawPicItem(c, it, x, y, s, wc = 1, hc = 1, label = true, at = null) {
  const f = at && at[5]; if (f && turns2d(it)) { const W = s * wc, H = s * hc, lw = f & 1 ? hc : wc, lh = f & 1 ? wc : hc; c.save(); c.translate(x + W / 2, y + H / 2); c.rotate(f * Math.PI / 2); drawPicItem(c, it, -lw * s / 2, -lh * s / 2, s, lw, lh, label, null); c.restore(); return; }
  if (structural(it)) { const u = picsFor(it)[0]; if (u && !it.look) mapPic(u); drawStructure(c, it, x, y, s, wc, hc, at); return; }
  const fk = furnKind(it); if (fk && s * dpr >= MAP_PIC_MIN) { const u = picsFor(it)[0]; if (u && !it.look) mapPic(u); if (!it.look || !drawLook(c, it, x, y, s, wc, hc)) drawFurniture(c, it, fk, x, y, s, wc, hc); return; }
  const url = S.pics && s * dpr >= MAP_PIC_MIN && lookK(it) !== 'steps' ? picsFor(it)[0] : null, p = url && mapPic(url);
  if (!p) { if (it.sh === 'kit') drawItem(c, it, x, y, s, wc, hc, label, it.look ? (bx, by, bw, bh) => drawLook(c, it, bx, by, bh, bw / bh, 1) : null); else if (!drawLook(c, it, x, y, s, wc, hc)) drawItem(c, it, x, y, s, wc, hc, label); return; }
  const w = s * wc, hh = s * hc;
  if (it.sh === 'kit') { drawItem(c, it, x, y, s, wc, hc, label, (bx, by, bw, bh) => drawPicIn(c, p, bx, by, bw, bh)); return; }
  if (it.sh === 'block') { drawPicIn(c, p, x, y, w, hh); return; }
  if (it.c !== 'Nature') { const a = c.globalAlpha; c.globalAlpha = a * 0.22; c.fillStyle = it.col; roundRect(c, x + 1, y + 1, w - 2, hh - 2, Math.min(8, s * 0.2)); c.fill(); c.globalAlpha = a; }
  const pad = Math.max(1, s * 0.05); drawPicIn(c, p, x + pad, y + pad, w - pad * 2, hh - pad * 2);
}
function picsReady(urls, ms) {
  urls = [...new Set(urls.filter(Boolean))]; urls.forEach(mapPic); const t0 = performance.now();
  return new Promise(res => { const tick = () => { if (performance.now() - t0 > ms || urls.every(u => { const p = mapPics.get(u); return p.img || p.failed; })) res(); else setTimeout(tick, 60); }; tick(); });
}
atStart(() => { addEventListener('online', () => { for (const [u, p] of mapPics) if (p.failed) mapPics.delete(u); requestDraw(); }); });
const allPicURLs = () => [...Object.keys(PICS.pics).map(localPic), ...Object.keys(PICS.top || {}).filter(k => PICS.top[k][0]).map(k => 'pics/top/' + k + '.webp?v=' + PICS.top[k][0]), ...Object.keys(PICS.pk || {}).map(k => 'pics/pk/' + k + '.webp?v=' + PICS.pk[k][0])];
const PIC_CACHE = 'pokopia-pics';
const picFill = { total: 0, done: 0, failed: 0, running: false, waiting: false, unsupported: false };
async function fillPictures(force) {
  const urls = allPicURLs(); if (picFill.running || !urls.length) return;
  if (!('caches' in window) || !window.isSecureContext) { picFill.unsupported = true; picUI(); return; }
  if (!force && navigator.connection && navigator.connection.saveData) { picFill.waiting = true; picUI(); return; }
  picFill.running = true; picFill.waiting = false; picFill.failed = 0; picFill.force = !!force;
  try {
    const c = await caches.open(PIC_CACHE);
    const want = new Set(urls.map(u => new URL(u, location.href).href)), have = new Set();
    for (const r of await c.keys()) { if (want.has(r.url)) have.add(r.url); else await c.delete(r); }
    const todo = [...want].filter(u => !have.has(u));
    picFill.total = want.size; picFill.done = have.size; picUI();
    let next = 0, shown = 0;
    const worker = async () => {
      while (next < todo.length && (S.offline || picFill.force)) {
        await new Promise(r => idle(r, 1500)); if (next >= todo.length || !(S.offline || picFill.force)) break;
        const u = todo[next++];
        try { const r = await fetch(u, { headers: { 'x-pokopia-fill': '1' }, priority: 'low' }); if (!r.ok) throw new Error(r.status); await c.put(u, r); picFill.done++; }
        catch (e) { picFill.failed++; if (!navigator.onLine) { next = todo.length; } }
        if (picFill.done - shown >= 25) { shown = picFill.done; picUI(); }
      }
    };
    await Promise.all([1, 2, 3, 4].map(worker));
    if (todo.length && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
  } catch (e) { picFill.failed = picFill.failed || 1; }
  picFill.running = false; picUI();
}
function picText() {
  const n = allPicURLs().length;
  if (!n) return 'Pictures load online';
  if (picFill.unsupported) return 'Pictures show online only';
  if (picFill.waiting) return 'Data saver on: ' + fmt(n) + ' pictures (' + picMB() + ' MB) not saved offline yet';
  if (picFill.running) return 'Saving pictures offline… ' + fmt(picFill.done) + '/' + fmt(picFill.total);
  if (!picFill.total) return S.offline ? 'Checking offline pictures…' : 'Pictures aren\'t saved for offline use';
  if (picFill.done >= picFill.total) return '✓ All ' + fmt(picFill.total) + ' pictures saved offline';
  return 'Pictures offline: ' + fmt(picFill.done) + '/' + fmt(picFill.total) + (S.offline ? ' (the rest next time online)' : '');
}
const picMB = () => Math.max(1, Math.round((PICS.bytes || Object.keys(PICS.pics).length * 5000) / 1e6));
function picUI() {
  for (const el of $$('.picline')) { el.textContent = picText(); if (!picFill.running && (picFill.waiting || (picFill.total && picFill.done < picFill.total && navigator.onLine) || (!S.offline && !picFill.total))) el.append(' ', h('button', { class: 'btn sm', onclick: () => fillPictures(true) }, picFill.waiting || !picFill.total ? 'Save now' : S.offline ? 'Retry' : 'Save the rest')); }
}
function swatchEl(it, cls = 'swatch') {
  const u = picURL(it); if (!u) { const s = h('span', { class: cls }); s.style.backgroundImage = `url(${swatchURL(it)})`; return s; }
  const im = h('img', { class: cls, alt: '', loading: 'lazy', decoding: 'async', src: u });
  im.style.backgroundColor = it.L === 'g' ? it.col : (it.c === 'Nature' ? '#d6dfcf' : '#e8ebe5');
  im.onerror = () => { im.onerror = null; im.src = swatchURL(it); };
  return im;
}
function picEl(it, cls = 'pic') {
  const u = picURL(it), im = h('img', { class: cls, alt: '', loading: 'lazy', decoding: 'async', src: u || swatchURL(it) });
  if (u) im.onerror = () => { im.onerror = null; im.src = swatchURL(it); };
  return im;
}
function fillLazy(box, arr, make, root, step = 40, tail = null, first = 0) {
  let i = 0, obs = null;
  const more = (n) => {
    const frag = document.createDocumentFragment(), end = Math.min(arr.length, i + n); for (; i < end; i++) frag.append(make(arr[i], i)); box.append(frag);
    if (i >= arr.length) { if (obs) obs.disconnect(); if (tail) box.append(tail); return; }
    if (!('IntersectionObserver' in window)) { more(arr.length); return; }
    const mark = h('div', { class: 'lazymark', style: 'height:1px' }); box.append(mark);
    if (!obs) obs = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return; obs.disconnect(); for (const m of box.querySelectorAll(':scope > .lazymark')) m.remove(); more(step); }, { root, rootMargin: '0px 0px 700px 0px' });
    obs.observe(mark);
  };
  more(Math.max(step, first));
}
