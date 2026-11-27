'use strict';
const PW_R = 10, PW_TT = 15, PW_DZ = 5, PW_CAP = 20;
let POWER = null, showPower = LS.get(LSK + 'power') === '1';
const isPowerDev = (it) => it.pd != null && !it.cap;
const kitOutside = (it) => !!it.cap && it.cap > 1 && !/\b(den|hut|tent)\b/i.test(it.n);
function powerFoot(ob) { const it = ITEMS[ob.i]; if (it.pg && (ob.w > 1 || ob.h > 1)) return [[ob.x, ob.y + ob.h - 1], [ob.x, ob.y], [ob.x + ob.w - 1, ob.y], [ob.x + ob.w - 1, ob.y + ob.h - 1]][faceOf(ob)]; return [ob.x, ob.y]; }
function pwDist(t, ob) {
  const [tx, ty] = t.foot, dz = Math.abs(zOf(ob) - zOf(t.ob)); if (dz > PW_DZ) return Infinity;
  const [nx, ny] = ITEMS[ob.i].pg ? powerFoot(ob) : [clamp(tx, ob.x, ob.x + ob.w - 1), clamp(ty, ob.y, ob.y + ob.h - 1)];
  return Math.abs(tx - nx) + Math.abs(ty - ny) + dz;
}
function liquidAtWheel(ob) {
  for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) { if (!inB(plan, x, y)) continue; const k = y * plan.w + x; for (let z = zOf(ob) - 1; z <= topOf(ob); z++) { const v = terrAt(plan, k, z); if (v && ITEMS[v - 1].lq) return true; } }
  return false;
}
function genUnits(ob) { const it = ITEMS[ob.i]; if (it.pgn === 'n' && !liquidAtWheel(ob)) return 0; return it.pgh && ob.hg ? it.pgh : it.pg; }
function wireBlocked(a, b) {
  const [ax, ay] = a.foot, [bx, by] = b.foot, az = topOf(a.ob) + 0.5, bz = (ITEMS[b.ob.i].pt === 'p' ? topOf(b.ob) : zOf(b.ob)) + 0.5, own = new Set([a.ob.id, b.ob.id]);
  const n = Math.max(2, Math.ceil((Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz)) * 3));
  for (let i = 1; i < n; i++) {
    const f = i / n, x = Math.floor(ax + 0.5 + (bx - ax) * f), y = Math.floor(ay + 0.5 + (by - ay) * f), z = Math.floor(az + (bz - az) * f);
    if (!inB(plan, x, y)) continue; const k = y * plan.w + x;
    const tv = terrAt(plan, k, z); if (tv && !ITEMS[tv - 1].lq) return { x, y, z, what: ITEMS[tv - 1].n };
    const o = occAt(plan, k, z); if (o && !own.has(o)) { const q = plan.objs.get(o); if (q && !isRug(ITEMS[q.i])) return { x, y, z, what: ITEMS[q.i].n }; }
  }
  return null;
}
function computePower() {
  const P = { tx: new Map(), gen: new Map(), dev: new Map(), kit: new Map(), nets: [], any: false };
  const objs = [...plan.objs.values()].sort((a, b) => a.id - b.id), T = [];
  const near = (ob, list, ok) => { let best = null, bd = Infinity; for (const t of list) { if (ok && !ok(t)) continue; const d = pwDist(t, ob); if (d < bd) { bd = d; best = t; } } return [best, bd]; };
  for (const ob of objs) {
    const it = ITEMS[ob.i];
    if (it.pt) {
      const t = { ob, foot: powerFoot(ob), gen: null, devs: [], links: [], net: -1, blocked: [] }; P.tx.set(ob.id, t); T.push(t); P.any = true;
      let bg = null, bd = Infinity; for (const g of P.gen.values()) { if (g.tx) continue; const d = pwDist(t, g.ob); if (d <= S.gGen && d < bd) { bd = d; bg = g; } } if (bg) { bg.tx = t; t.gen = bg; }
      const free = [...P.dev.values()].filter(d => !d.tx).map(d => [d, pwDist(t, d.ob)]).filter(([, d]) => d <= PW_R).sort((a, b) => a[1] - b[1] || a[0].ob.id - b[0].ob.id);
      for (const [d] of free) { if (t.devs.length >= PW_CAP) break; d.tx = t; t.devs.push(d); }
    } else if (it.pg) {
      const g = { ob, units: genUnits(ob), tx: null }; P.gen.set(ob.id, g); P.any = true;
      const [t, d] = near(ob, T, (q) => !q.gen); if (t && d <= S.gGen) { g.tx = t; t.gen = g; }
    } else if (isPowerDev(it)) {
      const d = { ob, draw: it.pd, tx: null, inReach: 0 }; P.dev.set(ob.id, d);
      const [t, dd] = near(ob, T, (q) => q.devs.length < PW_CAP); if (t && dd <= PW_R) { d.tx = t; t.devs.push(d); }
    }
  }
  for (const d of P.dev.values()) { let n = 0, bd = Infinity; for (const t of T) { const x = pwDist(t, d.ob); if (x <= PW_R) n++; bd = Math.min(bd, x); } d.inReach = n; d.nearest = bd; }
  for (const g of P.gen.values()) { let bd = Infinity; for (const t of T) bd = Math.min(bd, pwDist(t, g.ob)); g.nearest = bd; }
  const par = T.map((_, i) => i), find = (i) => par[i] === i ? i : (par[i] = find(par[i]));
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const a = T[i], b = T[j], dz = Math.abs(zOf(a.ob) - zOf(b.ob)); if (dz > PW_DZ || Math.abs(a.foot[0] - b.foot[0]) + Math.abs(a.foot[1] - b.foot[1]) + dz > PW_TT) continue; a.links.push(b); b.links.push(a); par[find(i)] = find(j); if (ITEMS[a.ob.i].pt === 'p' && ITEMS[b.ob.i].pt === 'p') { const w = wireBlocked(a, b); if (w) a.blocked.push({ to: b, at: w }); } }
  for (const t of T) if (t.gen && ITEMS[t.ob.i].pt === 'p') { const g = t.gen, w = wireBlocked(t, { ob: g.ob, foot: powerFoot(g.ob) }); if (w) t.blocked.push({ to: g, at: w }); }
  const nets = new Map(); T.forEach((t, i) => { const r = find(i); if (!nets.has(r)) nets.set(r, { tx: [], supply: 0, draw: 0, gens: 0, devs: 0 }); const N = nets.get(r); t.net = N; N.tx.push(t); if (t.gen) { N.supply += t.gen.units; N.gens++; } for (const d of t.devs) { N.draw += d.draw; N.devs++; } });
  for (const ob of objs) {
    const it = ITEMS[ob.i]; if (!it.cap || !ob.int) continue;
    let sup = 0, draw = 0, n = 0; for (const f of ob.int.f || []) if (f) for (const o of f.o) { const q = ITEMS[o[0]]; if (!q) continue; if (q.pg && !q.pgn) sup += q.pg; else if (q.pd != null) { draw += q.pd; n++; } }
    if (!n && !sup) continue; if (sup) P.any = true;
    const K = { ob, sup, draw, n, net: null, out: kitOutside(it) };
    if (K.out) { let bt = null, bd = Infinity; for (const t of T) { const d = pwDist(t, ob); if (d <= PW_R && d < bd) { bd = d; bt = t; } } if (bt && !(sup && sup >= draw)) { K.net = bt.net; bt.net.draw += draw; bt.net.devs += n; } }
    P.kit.set(ob.id, K);
  }
  for (const N of nets.values()) { N.over = N.draw > N.supply; N.on = N.supply > 0 && !N.over; P.nets.push(N); }
  for (const K of P.kit.values()) K.on = K.sup > 0 && K.sup >= K.draw || !!(K.net && K.net.on);
  for (const d of P.dev.values()) d.on = !!(d.tx && d.tx.net.on);
  POWER = P;
}
function powerWhy(d) {
  if (d.on) return '';
  if (!d.tx) return d.nearest === Infinity ? 'no transmitter in reach' + (POWER.tx.size ? ' (more than 5 levels away, or none placed)' : '') : d.nearest <= PW_R ? 'every transmitter in reach already has 20 items' : 'the nearest transmitter is ' + d.nearest + ' tiles away (10 at most)';
  const N = d.tx.net; if (!N.supply) return N.gens ? 'its generator makes no power' : 'no generator on its network';
  return 'its network is overloaded: it uses ' + N.draw + ' of ' + N.supply;
}
function powerOn(ob) { if (!POWER || !POWER.any) return true; const d = POWER.dev.get(ob.id); return !d || d.on; }
function powerSection(ob, box) {
  if (!POWER) return;
  const it = ITEMS[ob.i], d = POWER.dev.get(ob.id), t = POWER.tx.get(ob.id), g = POWER.gen.get(ob.id), K = POWER.kit.get(ob.id), at = (o) => o.x + ', ' + o.y;
  const net = (N) => N.tx.length + ' transmitter' + (N.tx.length > 1 ? 's' : '') + ' · ' + N.gens + ' generator' + (N.gens === 1 ? '' : 's') + ' · ' + N.draw + ' of ' + N.supply + ' power used';
  const line = (txt, bad, tip) => box.append(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const T_TIP = 'Generators reach a transmitter within ' + S.gGen + ' tiles, transmitters reach each other within 15 and their items within 10, counted along each axis and added up, and never more than 5 levels up or down. Linked transmitters share their generators. Using more than they make turns the whole network off.';
  if (!POWER.any) { if (d) line('Needs power. Nothing in this plan makes power yet, so the planner counts it as working.', false, T_TIP); return; }
  if (d) { if (d.on) line('⚡ Powered · ' + net(d.tx.net), false, T_TIP); else line('⚠ No power: ' + powerWhy(d) + '.', true, T_TIP); if (d.inReach > 1) line('In reach of ' + d.inReach + ' transmitters. The game joins it to one when you place it; the planner picks the nearest with room, in the order you placed things.'); }
  if (t) {
    const N = t.net; line((N.over ? '⚠ Overloaded · ' : !N.supply ? '⚠ No power · ' : '⚡ ') + net(N), N.over || !N.supply, T_TIP);
    line('This one: ' + (t.gen ? ITEMS[t.gen.ob.i].n + ' at ' + at(t.gen.ob) + ' (' + t.gen.units + ')' : 'no generator of its own') + ' · ' + t.devs.length + ' of 20 items');
    for (const q of t.blocked) line('⚠ ' + q.at.what + ' at ' + q.at.x + ', ' + q.at.y + ' is in the way of the wire to ' + ITEMS[q.to.ob.i].n + ' at ' + at(q.to.ob) + '. It only works if the wire was strung before that was placed.', true);
  }
  if (g) {
    if (g.tx) line('⚡ Feeds ' + ITEMS[g.tx.ob.i].n + ' at ' + at(g.tx.ob) + ' · ' + net(g.tx.net), false, T_TIP); else line('⚠ Not connected: ' + (g.nearest <= S.gGen ? 'every transmitter in reach already has a generator' : g.nearest === Infinity ? 'no transmitter in reach' : 'the nearest transmitter is ' + g.nearest + ' tiles away (' + S.gGen + ' at most)') + '.', true, T_TIP);
    if (it.pgn === 'n' && !g.units) line('⚠ No liquid at its wheel, so it makes nothing.', true);
    if (it.pgh) box.append(h('label', { class: 'toggle', style: 'margin-top:6px' }, h('input', { type: 'checkbox', checked: !!ob.hg, onchange: (e) => { if (e.target.checked) ob.hg = 1; else delete ob.hg; markDirty(); evaluateAll(); requestDraw(); showObjInspector(ob); } }), 'High ground (' + it.pgh + ' power)', tipBtn('Tick it if it stands 45 or more tiles above the map\'s floor (47 in Rocky Ridges). There it makes ' + it.pgh + ' instead of ' + it.pg + '.')));
  }
  if (K) { const n = K.n + ' item' + (K.n === 1 ? '' : 's') + ' inside'; if (K.on) line('⚡ ' + n + ' powered ' + (K.sup >= K.draw && K.sup ? 'by a mini generator inside' : 'from outside')); else line('⚠ ' + n + ' without power: ' + (!K.out ? (K.sup ? 'the mini generator inside isn\'t enough, and a den or hut can\'t take power from outside' : 'a den or hut only takes power from a mini generator inside') : K.net ? 'the network outside is ' + (K.net.over ? 'overloaded' : 'without power') : (K.sup ? 'the mini generator inside isn\'t enough, and ' : '') + 'no transmitter is within 10 tiles') + '.', true, 'Dens and huts only take power from a mini generator inside them. Cottages and houses take it from a transmitter outside too, and then everything inside is powered.'); }
}
let FIELDS = null, showWater = LS.get(LSK + 'water') === '1';
const FIELD_COL = { wet: '#2f8fd8', dry: '#e08a1e', dried: '#9b6b3c', lava: '#d0402f', under: '#d0402f' };
const isCrop = (it) => !!it && it.sub === 'Crops';
const hydrates = (v) => !!v && !!ITEMS[v - 1].lq && ITEMS[v - 1].lq[1] > 0;
const isLava = (v) => !!v && ITEMS[v - 1].n === 'Lava';
function computeFields() {
  const F = { cells: new Map(), spr: new Map(), rock: new Map(), any: false }, W = plan.w, farm = BY_NAME.get('Farm soil');
  const objs = [...plan.objs.values()], ranges = homeRanges();
  for (const ob of objs) { const it = ITEMS[ob.i]; if (it.n !== 'Sprinkler') continue; const zs = zOf(ob); let water = null;
    const SR = S.gSprinkler; for (let dy = -SR; dy <= SR && !water; dy++) for (let dx = -(SR - Math.abs(dy)); dx <= SR - Math.abs(dy); dx++) { const x = ob.x + dx, y = ob.y + dy; if (!inB(plan, x, y)) continue; const k = y * W + x; if (hydrates(terrAt(plan, k, zs)) || hydrates(terrAt(plan, k, zs - 1))) { water = [x, y]; break; } }
    F.spr.set(ob.id, { ob, works: !!water, water, n: 0 }); }
  const SR2 = S.gSprinkler, sprayed = (x, y, z) => { for (const Q of F.spr.values()) if (Q.works && Math.abs(Q.ob.x - x) + Math.abs(Q.ob.y - y) <= SR2 && z - zOf(Q.ob) >= -1 && z - zOf(Q.ob) <= 2) return Q; return null; };
  for (const ob of objs) { const it = ITEMS[ob.i]; if (it.n !== 'Smooth rock') continue; const off = plan.wx === 'rain' ? 'it\'s raining' : sprayed(ob.x, ob.y, zOf(ob)) ? 'a running sprinkler sprays it' : ''; F.rock.set(ob.id, { ob, off, n: 0 }); }
  const basins = []; for (const hm of ranges) { const who = hm.pks.filter(p => (p.s || []).includes('Water')); if (!who.length) continue; const R = hm.rect; let has = false; for (const ob of objs) if (ITEMS[ob.i].n === 'Water basin' && ob.x >= R.x && ob.y >= R.y && ob.x < R.x + R.w && ob.y < R.y + R.h && Math.abs(zOf(ob) - hm.base) <= AREA_R) { has = true; break; } basins.push({ hm, who, has }); }
  const growers = []; for (const hm of ranges) { const who = hm.pks.filter(p => (p.s || []).includes('Grow')); if (who.length) growers.push({ hm, who }); }
  const inR = (hm, x, y, z) => { const R = hm.rect; return x >= R.x && y >= R.y && x < R.x + R.w && y < R.y + R.h && Math.abs(z - hm.base) <= AREA_R; };
  const add = (x, y, f, crop, planter) => {
    const k = y * W + x; if (F.cells.has(k)) return; F.any = true; const p = f + 1, why = [];
    let state = null;
    const under = crop ? !!terrAt(plan, k, p + 1) && !!ITEMS[terrAt(plan, k, p + 1) - 1].lq : !!terrAt(plan, k, p) && !!ITEMS[terrAt(plan, k, p) - 1].lq;
    const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([a, b]) => inB(plan, a, b)).map(([a, b]) => b * W + a);
    if (under) {
      const bub = objs.find(o => ITEMS[o.i].n === 'Bubble machine' && Math.abs(o.x - x) <= 1 && Math.abs(o.y - y) <= 1 && Math.abs(zOf(o) - p) <= 1 && powerOn(o));
      const wp = basins.find(B => inR(B.hm, x, y, p)); if (bub) { state = 'wet'; why.push('bubbles from the Bubble machine at ' + bub.x + ', ' + bub.y); } else if (wp) { state = 'wet'; why.push('bubbles from ' + wp.who[0].n + ' (reach not measured)'); } else state = 'under';
    } else if (nb.some(q => isLava(terrAt(plan, q, p)) || isLava(terrAt(plan, q, f)))) state = 'lava';
    else {
      const still = (q, z) => hydrates(terrAt(plan, q, z)) && !((flowAt(q, z) || {}).f === FL_RUN);
      if (nb.some(q => still(q, p) || still(q, f))) why.push('water beside it');
      const Q = sprayed(x, y, f); if (Q) { why.push('the sprinkler at ' + Q.ob.x + ', ' + Q.ob.y); Q.n++; }
      if (plan.wx === 'rain' && !roofedAt(k, p)) why.push('rain');
      const B = basins.find(b => b.has && inR(b.hm, x, y, p)); if (B) why.push(B.who[0].n + '\'s water basin (reach not measured)');
      state = why.length ? 'wet' : 'dry';
    }
    let dried = null;
    if (!planter && state !== 'lava') for (const R of F.rock.values()) { if (R.off) continue; const rz = zOf(R.ob); if (Math.abs(R.ob.x - x) + Math.abs(R.ob.y - y) > S.gRock || f < rz - 2 || f > rz + 1) continue; let top = f; for (let z = rz + 1; z > f; z--) if (terrAt(plan, k, z)) { top = z; break; } if (top !== f) continue; dried = R; R.n++; break; }
    if (dried) { state = 'dried'; why.unshift('the Smooth Rock at ' + dried.ob.x + ', ' + dried.ob.y); }
    const grow = growers.filter(g => inR(g.hm, x, y, p)).flatMap(g => g.who.map(q => q.n));
    F.cells.set(k, { x, y, f, crop, planter, state, why, grow: [...new Set(grow)] });
  };
  for (const ob of objs) { const it = ITEMS[ob.i]; if (!isCrop(it)) continue; const below = occAt(plan, ob.y * W + ob.x, zOf(ob) - 1), planter = !!below && /planter/i.test(ITEMS[plan.objs.get(below).i].n); for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) add(x, y, zOf(ob) - 1, ob, planter); }
  if (farm) for (let j = 0; j < plan.tz.length; j++) { const T = plan.tt[j], z = plan.tz[j]; for (let k = 0; k < T.length; k++) if (T[k] === farm.i + 1 && !terrAt(plan, k, z + 1) && !occAt(plan, k, z + 1)) add(k % W, (k / W) | 0, z, null, false); }
  FIELDS = F;
}
function fieldDays(c) { const it = c.crop ? ITEMS[c.crop.i] : null, n = it && it.cg ? it.cg[0] : 3; if (c.state !== 'wet') return null; if (!c.grow.length) return n + ' day' + (n > 1 ? 's' : ''); const d = Math.ceil((n - 1) / 2); return d ? d + ' day' + (d > 1 ? 's' : '') : 'at once'; }
const isBerryTree = (it) => !!it && GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i);
function fieldSection(ob, box) {
  const it = ITEMS[ob.i], line = (txt, bad, tip) => box.append(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const W_TIP = 'A field is watered by still water, ocean or hot-spring water right beside it (not diagonal, not mud or lava), a running sprinkler within ' + S.gSprinkler + ' tiles, rain where there\'s no roof, or a Water Pokémon with a filled water basin living nearby. A crop grows one stage at 5:00 each day it\'s wet, and a Grow Pokémon living nearby adds one more a day.';
  if (FIELDS && isCrop(it)) { const c = FIELDS.cells.get(ob.y * plan.w + ob.x); if (c) { line((c.state === 'wet' ? '💧 ' : '⚠ ') + fieldWord[c.state] + ': ' + fieldWhy(c) + '.', c.state !== 'wet', W_TIP); const d = fieldDays(c); line(d ? 'Ripe ' + (d === 'at once' ? 'at once' : 'in ' + d) + (c.grow.length ? ', with ' + listNames(c.grow.slice(0, 2)) + ' helping it grow (reach not measured)' : '; 1 day with a Grow Pokémon living nearby') + '.' : 'It won\'t grow until it\'s watered.'); if (c.planter) line('In a planter, so Smooth Rock leaves it alone (one player says it doesn\'t).'); } }
  if (FIELDS && it.n === 'Sprinkler') { const Q = FIELDS.spr.get(ob.id); if (Q) line(Q.works ? '💧 Runs on the water at ' + Q.water[0] + ', ' + Q.water[1] + ' · waters ' + Q.n + ' field tile' + (Q.n === 1 ? '' : 's') : '⚠ Doesn\'t run: no water within ' + S.gSprinkler + ' tiles at its own level or one below, so it waters nothing and adds no humidity.', !Q.works); }
  if (FIELDS && it.n === 'Smooth rock') { const R = FIELDS.rock.get(ob.id); if (R) line(R.off ? 'Off: ' + R.off + '.' : R.n ? '⚠ Dries ' + R.n + ' field tile' + (R.n === 1 ? '' : 's') + ' within ' + S.gRock + ' tiles. Rain or a running sprinkler that reaches it stops it.' : 'No fields within its reach.', !R.off && R.n > 0); }
  if (isBerryTree(it)) { let bad = 0; const z = zOf(ob); for (let y = ob.y - 1; y <= ob.y + ob.h; y++) for (let x = ob.x - 1; x <= ob.x + ob.w; x++) { if (!inB(plan, x, y) || (x >= ob.x && x < ob.x + ob.w && y >= ob.y && y < ob.y + ob.h)) continue; const k = y * plan.w + x, t = terrAt(plan, k, z); if ((t && ITEMS[t - 1].lq) || occAt(plan, k, z) || terrAt(plan, k, z)) bad++; } if (bad) line('⚠ ' + bad + ' of the 8 tiles around it ' + (bad > 1 ? 'hold' : 'holds') + ' water, a block or an item, so berries can roll away or get stuck there.', true); }
}
const fieldWord = { wet: 'Wet', dry: 'Dry', dried: 'Dried out', lava: 'Lava beside it', under: 'Underwater' };
function fieldWhy(c) {
  if (c.state === 'wet') return 'watered by ' + listNames(c.why);
  if (c.state === 'dried') return c.why[0] + ' dries it' + (c.why.length > 1 ? ', even though ' + listNames(c.why.slice(1)) + ' water' + (c.why.length > 2 ? '' : 's') + ' it' : '');
  if (c.state === 'lava') return 'lava next to a field stops it being watered';
  if (c.state === 'under') return 'crops under water need bubbles: a powered Bubble machine within 1 tile, or a Water Pokémon living nearby';
  return 'no still water beside it, no running sprinkler within ' + S.gSprinkler + ' tiles' + (plan.wx === 'rain' ? ', and a roof keeps the rain off' : '') + ', and no Water Pokémon with a water basin nearby';
}
function drawFields(c, s) {
  if (!FIELDS || !FIELDS.any || !showWater) return;
  c.save();
  for (const f of FIELDS.cells.values()) { const px = view.px + f.x * s, py = view.py + f.y * s, col = FIELD_COL[f.state]; c.globalAlpha = 0.42; c.fillStyle = col; c.fillRect(px + 1, py + 1, s - 2, s - 2); if (s >= 10 && f.state !== 'wet') { c.globalAlpha = 0.95; c.strokeStyle = col; c.lineWidth = 2; c.strokeRect(px + 2, py + 2, s - 4, s - 4); } }
  const r = Math.max(3.5, Math.min(7, s * 0.16)); c.globalAlpha = 1;
  for (const S of FIELDS.spr.values()) { const px = view.px + (S.ob.x + 1) * s - r - 1, py = view.py + S.ob.y * s + r + 1; c.fillStyle = S.works ? theme.good : theme.bad; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(px, py, r, 0, 7); c.fill(); c.stroke(); }
  c.restore();
}
let SIG = null, showSignals = LS.get(LSK + 'signals') === '1';
const SIG_R = { f: 2, w: 3, c: 3 }, WANDER = /^(Hatch window|Shutter|Simple curtain)/, MOVERS = /^(Toy blocks|Sandbox|Alarm clock|Pinwheel|Weather vane|Ship's wheel|Rowlet clock)/i;
const FACE_V = [[0, 1], [-1, 0], [0, -1], [1, 0]];
function sigEffect(it, kind) {
  if (inWall(it) || (it.so && /curtain|shutter|hatch/i.test(it.n))) return kind === 'f' ? 'opens it, and closes it soon after you step off' : 'opens or closes it';
  if (it.pt === 'ws') return 'cuts or restores power to its items';
  if (it.n === 'Mini floodgate') return 'starts or stops its water';
  if (/^Music mat/.test(it.n)) return 'plays its note';
  if (/Bell$/.test(it.n)) return 'rings it';
  if (it.n === 'Fiery Magby statue') return 'makes it breathe fire, which can light a campfire or oven';
  if (isPowered(it)) return 'turns it on or off';
  return 'switches it';
}
function computeSignals() {
  const G = { inputs: new Map(), of: new Map(), any: false }, W = plan.w;
  for (const ob of plan.objs.values()) {
    const it = ITEMS[ob.i]; if (!it.si) continue; G.any = true;
    const z = zOf(ob), rec = { ob, kind: it.si, targets: [], watch: null, moving: true, onlySensor: false }, seen = new Set();
    const visit = (x, y, lz) => { if (!inB(plan, x, y)) return; const o = occAt(plan, y * W + x, lz); if (!o || o === ob.id || seen.has(o)) return; seen.add(o); const q = plan.objs.get(o); if (q && signalTarget(ITEMS[q.i])) rec.targets.push(q); };
    if (it.si === 'l') {
      const [fx, fy] = FACE_V[faceOf(ob)];
      for (const [x, y] of [[ob.x - fy, ob.y + fx], [ob.x + fy, ob.y - fx], [ob.x - fx, ob.y - fy]]) for (let dz = -1; dz <= 1; dz++) visit(x, y, z + dz);
      visit(ob.x, ob.y, z - 1); visit(ob.x, ob.y, z + 1);
      const w = []; let moving = false;
      for (let i = 1; i <= S.gSensor; i++) {
        const x = ob.x + fx * i, y = ob.y + fy * i; if (!inB(plan, x, y)) continue; const k = y * W + x, t = terrAt(plan, k, z), o = occAt(plan, k, z), q = o && plan.objs.get(o);
        if (t && ITEMS[t - 1].lq) { w.push(ITEMS[t - 1].n.toLowerCase()); moving = true; }
        else if (q) { const qi = ITEMS[q.i]; if (qi.si === 'l') w.push('a laser sensor'); else if (signalTarget(qi) || MOVERS.test(qi.n)) { w.push(qi.n.toLowerCase()); moving = true; } else w.push(qi.n.toLowerCase() + ', which doesn\'t move'); }
        else if (t) w.push('a block');
        else if (terrAt(plan, k, z - 1) || occAt(plan, k, z - 1)) { w.push('open ground, so anyone walking past sets it off'); moving = true; }
        else w.push('empty air');
      }
      rec.watch = [...new Set(w)]; rec.moving = moving; rec.onlySensor = !moving && w.includes('a laser sensor');
    } else { const r = SIG_R[it.si]; for (let dz = -r; dz <= r; dz++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) visit(ob.x + dx, ob.y + dy, z + dz); }
    G.inputs.set(ob.id, rec);
    for (const q of rec.targets) { if (!G.of.has(q.id)) G.of.set(q.id, []); G.of.get(q.id).push(rec); }
  }
  SIG = G;
}
const sigNoPower = (q) => isPowered(ITEMS[q.i]) && !powerOn(q);
function signalSection(ob, box) {
  if (!SIG || !SIG.any) return;
  const it = ITEMS[ob.i], rec = SIG.inputs.get(ob.id), by = SIG.of.get(ob.id), at = (o) => o.x + ', ' + o.y, line = (txt, bad, tip) => box.append(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const S_TIP = 'Switches and sensors need no power or wires: they work whatever sits in their reach. Things that respond: doors, windows, hatches, shutters and curtains; lights and appliances that have power; switch transmitters; the mini floodgate; music mats; bells; and the Fiery Magby statue. Timing isn\'t worked out, so a circuit here should work, but isn\'t guaranteed to.';
  if (rec) {
    if (!rec.targets.length) line('⚠ Reaches nothing that responds to it.', true, S_TIP);
    else { line('Works ' + rec.targets.length + ':', false, S_TIP); const l = h('ul', { class: 'note', style: 'margin:2px 0 0 18px;padding:0' }); for (const q of rec.targets) { const qi = ITEMS[q.i]; l.append(h('li', { style: sigNoPower(q) ? 'color:var(--warn)' : '' }, qi.n + ' at ' + at(q) + ': ' + sigEffect(qi, rec.kind) + (sigNoPower(q) ? ' ⚠ but it has no power, so it ignores signals' : '') + (WANDER.test(qi.n) ? ' · wandering Pokémon open it too' : ''))); } box.append(l); }
    if (rec.watch) { if (rec.moving) line('Watches ' + listNames(rec.watch) + '.'); else line('⚠ ' + (rec.onlySensor ? 'It only sees a laser sensor, and a sensor never sees another one fire. Put a door, hatch window or toy blocks between them.' : 'Nothing in the ' + (S.gSensor > 1 ? S.gSensor + ' tiles' : 'tile') + ' in front of it can move (' + listNames(rec.watch) + '), so it never fires.'), true); }
  }
  if (by && by.length) line('Worked by ' + listNames(by.map(r => ITEMS[r.ob.i].n + ' at ' + at(r.ob))) + ': ' + (by.length > 1 ? 'each ' : 'it ') + sigEffect(it, by[0].kind) + '.' + (sigNoPower(ob) ? ' ⚠ It has no power, so it ignores them.' : '') + (WANDER.test(it.n) ? ' Wandering Pokémon can open it too, which a sensor sees.' : ''), sigNoPower(ob), S_TIP);
}
function sigShown() { if (!SIG || !SIG.any) return null; if (showSignals) return [...SIG.inputs.values()]; const sel = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null; if (!sel) return null; const rec = SIG.inputs.get(sel.id); if (rec) return [rec]; const by = SIG.of.get(sel.id); return by && by.length ? by : null; }
function drawSignalLines(c, pt, recs, s) {
  c.save(); c.lineCap = 'round'; const col = REACH_COL.signal, r = Math.max(4, Math.min(9, s * 0.22));
  for (const rec of recs) {
    const a = pt(rec.ob.x, rec.ob.y, zOf(rec.ob));
    for (const q of rec.targets) { const b = pt(q.x + (q.w - 1) / 2, q.y + (q.h - 1) / 2, zOf(q)), bad = sigNoPower(q); c.strokeStyle = bad ? theme.bad : col; c.globalAlpha = 0.9; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]); c.lineWidth = 2.5; c.beginPath(); c.arc(b[0], b[1], r, 0, 7); c.stroke(); }
    if (!rec.targets.length || (rec.watch && !rec.moving)) { c.globalAlpha = 1; c.fillStyle = theme.warn; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(a[0] + s * 0.32, a[1] - s * 0.32, Math.max(3.5, Math.min(7, s * 0.16)), 0, 7); c.fill(); c.stroke(); }
  }
  c.restore();
}
function drawSignals(c, s) {
  const recs = sigShown(); if (!recs) return;
  const sel = selection && selection.obj ? selection.obj : null;
  if (showSignals) for (const rec of recs) if (rec.ob !== sel) { const R = reachCached(rec.ob); if (R) drawReachShape(c, s, R, false); }
  if (sel && !SIG.inputs.has(sel.id)) for (const rec of recs) { const R = reachCached(rec.ob); if (R) drawReachShape(c, s, R, false); }
  drawSignalLines(c, (x, y) => [view.px + (x + 0.5) * s, view.py + (y + 0.5) * s], recs, s);
}
function setShowSignals(v) { showSignals = v; LS.set(LSK + 'signals', v ? '1' : '0'); sysSync(); requestDraw(); }
let pourMode = 'paint', pourLow = false, pourPrev = null, FLOWIX = null;
const FL_ROOT = 1, FL_FALL = 2, FL_RUN = 3;
const canPour = (it) => !!it && !!it.lq && !it.lq[2];
const flowKey = (k, z) => (z - ZMIN) * plan.w * plan.h + k;
function flowIndex() { const m = new Map(); for (const s of plan.src || []) for (const c of s.cells) m.set(Math.floor(c / 4), { s, f: c % 4 }); FLOWIX = m; }
function flowAt(k, z) { return FLOWIX ? FLOWIX.get(flowKey(k, z)) || null : null; }
function flowFall(i) { const it = ITEMS[i]; return it.n === 'Water' ? BY_NAME.get('Waterfall') : it; }
function computeFlow(x, y, z, i, low) {
  const W = plan.w, it = ITEMS[i], liq = i + 1, fallIt = flowFall(i), S0 = (low ? Math.floor(it.lq[0] / 2) : it.lq[0]) - 1, water = it.n !== 'Lava';
  const srcKeys = new Set((plan.src || []).map(s => flowKey(s.y * W + s.x, s.z)));
  const enter = (k, z) => { if (z < ZMIN || z > ZMAX || occAt(plan, k, z)) return 0; const t = terrAt(plan, k, z); if (!t) return 1; const kk = flowKey(k, z); if (srcKeys.has(kk)) return 0; if (FLOWIX && FLOWIX.has(kk)) return 1; if (t === liq || t === fallIt.i + 1) return 2; return 0; };
  const solidBelow = (k, z) => z - 1 < ZMIN || (!!terrAt(plan, k, z - 1) && !(FLOWIX && FLOWIX.has(flowKey(k, z - 1)) && FLOWIX.get(flowKey(k, z - 1)).f === FL_FALL)) || !!occAt(plan, k, z - 1);
  const openAt = (k, z) => { if (z < ZMIN || z > ZMAX || occAt(plan, k, z)) return false; const t = terrAt(plan, k, z); return !t || !!ITEMS[t - 1].lq; };
  const cost = (k, z) => { const x = k % W, y = (k / W) | 0; let n = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy; if (inB(plan, a, b) && openAt(b * W + a, z)) n++; } return n <= 2 ? 1 : n === 3 ? 2.5 : 3.5; };
  const wet = new Map(), heap = [], roots = [];
  const hpush = (e) => { heap.push(e); let i2 = heap.length - 1; while (i2 > 0) { const p = (i2 - 1) >> 1; if (heap[p][0] <= heap[i2][0]) break; [heap[p], heap[i2]] = [heap[i2], heap[p]]; i2 = p; } };
  const hpop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i2 = 0; for (; ;) { const l = 2 * i2 + 1, r = l + 1; let m = i2; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i2) break; [heap[m], heap[i2]] = [heap[i2], heap[m]]; i2 = m; } } return top; };
  const visit = (k, z, c, f) => { const kk = flowKey(k, z), e = wet.get(kk); if (e && (e.c <= c || e.f === FL_ROOT)) return false; wet.set(kk, { k, z, c, f, pass: enter(k, z) === 2 }); return true; };
  const root = (k, z) => { if (wet.size > 5000) return; if (visit(k, z, 0, FL_ROOT)) { roots.push([k, z]); hpush([0, k, z]); } };
  const fallFrom = (k, z) => { let zz = z; while (zz > ZMIN && !solidBelow(k, zz)) { const kk = flowKey(k, zz); if (!wet.has(kk) || wet.get(kk).f !== FL_ROOT) wet.set(kk, { k, z: zz, c: 0, f: FL_FALL, pass: enter(k, zz) === 2 }); zz--; if (enter(k, zz) !== 1) return; } root(k, zz); };
  const seek = (k, z) => {
    const prev = new Map([[k, -1]]), q = [[k, 0]];
    while (q.length) { const [c, d] = q.shift(); const cx = c % W, cy = (c / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = cx + dx, b = cy + dy; if (!inB(plan, a, b)) continue; const n = b * W + a; if (prev.has(n) || enter(n, z) !== 1) continue; prev.set(n, c);
        if (!solidBelow(n, z)) { const path = []; for (let p = c; p !== -1; p = prev.get(p)) path.push(p); path.reverse(); path.forEach((p, j) => { if (j) visit(p, z, j, FL_RUN); }); fallFrom(n, z); return true; }
        if (d + 1 < 4) q.push([n, d + 1]); } }
    return false;
  };
  if (!solidBelow(y * W + x, z)) fallFrom(y * W + x, z); else root(y * W + x, z);
  let guard = 0;
  while (heap.length && guard++ < 20000) {
    const [c, k, zz] = hpop(), e = wet.get(flowKey(k, zz)); if (!e || e.c !== c) continue;
    if (e.f === FL_ROOT && water && !low && seek(k, zz)) continue;
    const cx = k % W, cy = (k / W) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue; const a = cx + dx, b = cy + dy; if (!inB(plan, a, b)) continue; const n = b * W + a;
      const en = enter(n, zz); if (!en) continue; const nc = c + cost(n, zz) * (dx && dy ? 1.5 : 1); if (nc > S0) continue;
      if (!solidBelow(n, zz)) { const kk = flowKey(n, zz); if (!wet.has(kk)) fallFrom(n, zz); continue; }
      if (visit(n, zz, nc, 0)) hpush([nc, n, zz]);
    }
    if (wet.size > 5000) break;
  }
  const cells = [...wet.values()].filter(e => !e.pass), lavaWater = [];
  const isWaterT = (v) => !!v && !!ITEMS[v - 1].lq && ITEMS[v - 1].n !== 'Lava';
  for (const e of cells) { const ex = e.k % W, ey = (e.k / W) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = ex + dx, b = ey + dy; if (!inB(plan, a, b)) continue; const v = terrAt(plan, b * W + a, e.z); if (water ? v && ITEMS[v - 1].n === 'Lava' : isWaterT(v)) { lavaWater.push([a, b]); break; } } if (lavaWater.length) break; }
  return { x, y, z, i, low, cells, falls: cells.filter(e => e.f === FL_FALL).length, roots: roots.length, lavaWater, capped: wet.size > 5000 };
}
function pourTap(cx, cy) {
  const it = currentItem(), k = cy * plan.w + cx, tz = topTerr(k), top = tz == null ? 0 : terrAt(plan, k, tz);
  if (pourPrev && pourPrev.x === cx && pourPrev.y === cy) { pourCommit(); return; }
  if (top && ITEMS[top - 1].lq && layerZ == null) { toast('There\'s liquid here already. Pour next to it.'); return; }
  const z = layerZ != null ? layerZ : standZ(k);
  if (occAt(plan, k, z) || terrAt(plan, k, z)) { toast('Something is in the way on level ' + lvNum(z)); return; }
  pourPrev = computeFlow(cx, cy, z, it.i, pourLow); renderOptbar(); requestDraw();
}
function pourCommit() {
  const P = pourPrev; if (!P) return; pourPrev = null; const it = ITEMS[P.i], fallIt = flowFall(P.i), N = plan.w * plan.h;
  beginTx(); const keys = new Set();
  for (const e of P.cells) { setTerr(e.k, e.z, (e.f === FL_FALL ? fallIt : it).i + 1); keys.add(flowKey(e.k, e.z)); }
  const src = { id: uid(), x: P.x, y: P.y, z: P.z, i: P.i, low: !!P.low, cells: P.cells.map(e => flowKey(e.k, e.z) * 4 + (e.f || 0)) };
  setSources([...(plan.src || []).map(s => ({ ...s, cells: s.cells.filter(c => !keys.has(Math.floor(c / 4))) })), src]);
  commitTx('Pour ' + it.n.toLowerCase()); renderOptbar();
  toast(it.n + ' poured: ' + P.cells.length + ' tile' + (P.cells.length === 1 ? '' : 's') + (P.falls ? ', ' + P.falls + ' falling' : ''));
}
function pourCancel() { if (!pourPrev) return; pourPrev = null; renderOptbar(); requestDraw(); }
function setSources(next) { beginTx(); if (!tx.s) tx.s = [plan.src || []]; plan.src = next; tx.s[1] = next; }
function removeFlow(s, keep) {
  const N = plan.w * plan.h, liq = s.i + 1, fall = flowFall(s.i).i + 1, others = new Set((plan.src || []).filter(q => q !== s).flatMap(q => q.cells.map(c => Math.floor(c / 4))));
  for (const c of s.cells) { const kk = Math.floor(c / 4); if (others.has(kk) || kk === keep) continue; const z = Math.floor(kk / N) + ZMIN, k = kk % N, t = terrAt(plan, k, z); if (t === liq || t === fall) setTerr(k, z, 0); }
}
function flowSourcesCheck() {
  if (!tx || !plan.src || !plan.src.length) return;
  const gone = plan.src.filter(s => { const k = s.y * plan.w + s.x, t = terrAt(plan, k, s.z); return (t !== s.i + 1 && t !== flowFall(s.i).i + 1) || occAt(plan, k, s.z); });
  if (!gone.length) return;
  for (const s of gone) removeFlow(s, null);
  setSources(plan.src.filter(s => !gone.includes(s)));
}
function drawPourPreview(c, s) {
  if (selection && selection.flow && plan.src && plan.src.includes(selection.flow)) { const F = selection.flow, N = plan.w * plan.h, cells = new Set(F.cells.map(q => Math.floor(q / 4) % N)); c.save(); c.strokeStyle = theme.accent; c.lineWidth = 2; c.globalAlpha = 0.9; c.beginPath(); for (const k of cells) { const x = k % plan.w, y = (k / plan.w) | 0, px = view.px + x * s, py = view.py + y * s; if (!cells.has(k - plan.w)) { c.moveTo(px, py); c.lineTo(px + s, py); } if (!cells.has(k + plan.w)) { c.moveTo(px, py + s); c.lineTo(px + s, py + s); } if (x === 0 || !cells.has(k - 1)) { c.moveTo(px, py); c.lineTo(px, py + s); } if (x === plan.w - 1 || !cells.has(k + 1)) { c.moveTo(px + s, py); c.lineTo(px + s, py + s); } } c.stroke(); c.lineWidth = 3; c.strokeRect(view.px + F.x * s + 1.5, view.py + F.y * s + 1.5, s - 3, s - 3); c.restore(); }
  const P = pourPrev; if (!P) return; const it = ITEMS[P.i], col = it.col || '#4aa2d6';
  c.save(); for (const e of P.cells) { const x = e.k % plan.w, y = (e.k / plan.w) | 0; c.globalAlpha = e.f === FL_FALL ? 0.75 : 0.5; c.fillStyle = col; c.fillRect(view.px + x * s, view.py + y * s, s, s); }
  c.globalAlpha = 1; c.strokeStyle = theme.accent; c.lineWidth = 3; c.strokeRect(view.px + P.x * s + 1.5, view.py + P.y * s + 1.5, s - 3, s - 3); c.restore();
}
function showFlowInspector(s) {
  const it = ITEMS[s.i], n = s.cells.length, falls = s.cells.filter(c => c % 4 === FL_FALL).length, runs = s.cells.filter(c => c % 4 === FL_RUN).length;
  selection = { flow: s };
  const box = inspectorShell(it.n + ' (poured)', swatchEl(it), (s.low ? 'Low' : 'Normal') + ' level · source at ' + s.x + ', ' + s.y + ', level ' + lvNum(s.z), 'Liquid poured from a source tile. Erasing the source tile, or putting something on it, removes the whole flow, as in the game.');
  box.append(h('div', { class: 'note', style: 'margin-top:6px' }, 'Covers ' + n + ' tile' + (n === 1 ? '' : 's') + (falls ? ', ' + falls + ' of them falling' : '') + '.' + (runs ? ' It runs straight to a drop ' + runs + ' tile' + (runs === 1 ? '' : 's') + ' away, so that stretch is flowing water, which doesn\'t water fields.' : '')));
  box.append(h('div', { class: 'note', style: 'margin-top:6px' }, 'Its edge should be within a tile of what\'s shown: in the game the shape also depends on the order you dug and filled things. Pour again after changing the ground around it.'));
  box.acts.append(ibtn('rotate', 'Pour again', () => repour(s), 'primary'), ibtn('trash', 'Remove it', () => { beginTx(); removeFlow(s, null); const k = s.y * plan.w + s.x; if ([s.i + 1, flowFall(s.i).i + 1].includes(terrAt(plan, k, s.z))) setTerr(k, s.z, 0); setSources((plan.src || []).filter(q => q.id !== s.id)); commitTx('Remove ' + it.n.toLowerCase()); closeInspector(); }, 'danger'));
  requestDraw();
}
function repour(s) {
  beginTx(); removeFlow(s, null); const k = s.y * plan.w + s.x; if ([s.i + 1, flowFall(s.i).i + 1].includes(terrAt(plan, k, s.z))) setTerr(k, s.z, 0); setSources((plan.src || []).filter(q => q.id !== s.id)); flowIndex();
  pourPrev = computeFlow(s.x, s.y, s.z, s.i, s.low); pourCommit(); closeInspector(); const ns = (plan.src || [])[plan.src.length - 1]; if (ns) showFlowInspector(ns);
}
let showDrops = LS.get(LSK + 'drops') === '1';
const PROC = { Chop: ['small logs', 'lumber', '1 → 5'], Burn: ['squishy clay', 'bricks', '1 → 2'], Crush: ['berries', 'paint', '1 → 5'], Recycle: ['nonburnable garbage', 'iron ore', '1 → 2'] };
const DROP_TIP = 'Drops land on the ring 1 tile around a kit house (not its corners), or on a built house\'s floor and 1 tile outside its walls, wherever the Pokémon happens to be. Each tile needs a block under it and no item or liquid on it. More comfort means more drops, and nothing drops while Ditto is watching.';
function dropTile(x, y, L) {
  if (!inB(plan, x, y)) return null; const k = y * plan.w + x; if (L == null) L = standZ(k);
  const o = occAt(plan, k, L), q = o && plan.objs.get(o), t = terrAt(plan, k, L); let why = '';
  if (t && ITEMS[t - 1].lq) why = 'liquid'; else if (t) why = 'a block'; else if (q && !isDoor(ITEMS[q.i])) why = ITEMS[q.i].n.toLowerCase(); else if (!terrAt(plan, k, L - 1) && !occAt(plan, k, L - 1)) why = 'nothing under it';
  return { x, y, k, ok: !why, why };
}
function litterTiles(home) {
  const out = [];
  if (home.kind === 'kit') { const ob = home.ob, L = zOf(ob); for (let x = ob.x; x < ob.x + ob.w; x++) out.push(dropTile(x, ob.y - 1, L), dropTile(x, ob.y + ob.h, L)); for (let y = ob.y; y < ob.y + ob.h; y++) out.push(dropTile(ob.x - 1, y, L), dropTile(ob.x + ob.w, y, L)); }
  else if (home.kind === 'house') { const hs = home.hs, R = hs.area.outer; for (const k of hs.cells) out.push(dropTile(k % plan.w, (k / plan.w) | 0, hs.level)); for (let x = R.x; x < R.x + R.w; x++) out.push(dropTile(x, R.y - 1), dropTile(x, R.y + R.h)); for (let y = R.y; y < R.y + R.h; y++) out.push(dropTile(R.x - 1, y), dropTile(R.x + R.w, y)); }
  return out.filter(Boolean);
}
const litterers = (pks) => pks.filter(p => (p.s || []).includes('Litter'));
function nearestBox(hm) { const boxes = boxesFor(hm); if (!boxes.length) return null; const R = hm.rect, cx = R.x + R.w / 2, cy = R.y + R.h / 2; return boxes.sort((a, b) => Math.abs(a.x - cx) + Math.abs(a.y - cy) - Math.abs(b.x - cx) - Math.abs(b.y - cy))[0]; }
function workers(hm) { const out = []; for (const p of hm.pks) for (const sp of Object.keys(PROC)) if ((p.s || []).includes(sp)) out.push({ p, sp }); return out; }
function workLines(key, home) {
  const out = [], hm = homeRanges().find(x => x.key === key); if (!hm) return out;
  const line = (txt, bad, tip) => out.push(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const lit = litterers(hm.pks);
  if (lit.length) {
    if (home && home.kind !== 'habitat') { const tiles = litterTiles(home), ok = tiles.filter(t => t.ok).length; for (const p of lit) line(ok ? '🍂 ' + p.n + ' drops ' + (p.lt || 'its material').toLowerCase() + ' on the ' + ok + ' free tile' + (ok === 1 ? '' : 's') + ' of ' + tiles.length + ' around ' + (home.kind === 'kit' ? 'the kit' : 'the house') + '.' : '⚠ ' + p.n + '\'s ' + (p.lt || 'material').toLowerCase() + ' has nowhere to land: every tile around ' + (home.kind === 'kit' ? 'the kit' : 'the house') + ' has an item, liquid or nothing under it.', !ok, DROP_TIP); }
    else line('🍂 ' + listNames(lit.map(p => p.n + ' (' + (p.lt || 'its material').toLowerCase() + ')')) + ' drop' + (lit.length === 1 ? 's' : '') + ' materials around the habitat. Exactly where isn\'t known; in a house or kit, the planner shows the tiles.', false, DROP_TIP);
  }
  const wk = workers(hm);
  if (wk.length) { const box = nearestBox(hm); for (const { p, sp } of wk) { const [a, b, r] = PROC[sp]; line(box ? '⚙ ' + p.n + ' (' + sp + ') turns ' + a + ' into ' + b + ' (' + r + ') from the community box at ' + box.x + ', ' + box.y + '.' : '⚠ ' + p.n + ' (' + sp + ') has no community box in reach to work from, so it can\'t turn ' + a + ' into ' + b + '.', !box, 'Processing Pokémon take what you put in the community box nearest their home and put the result back in it. The box must sit wholly within 4 tiles of the home\'s dotted line.'); } }
  return out;
}
function machineLines(ob) {
  const it = ITEMS[ob.i], out = [], line = (txt, bad, tip) => out.push(h('div', { class: 'note', style: 'margin-top:6px' + (bad ? ';color:var(--warn)' : ''), 'data-tip': tip || null }, txt));
  const near = (sp) => { const s2 = new Set(); for (const hm of homeRanges()) { const R = hm.rect; if (ob.x < R.x || ob.y < R.y || ob.x >= R.x + R.w || ob.y >= R.y + R.h || Math.abs(zOf(ob) - hm.base) > AREA_R) continue; for (const p of hm.pks) if ((p.s || []).includes(sp)) s2.add(p.n); } return [...s2]; };
  if (/smelting furnace$/i.test(it.n)) { const b = near('Burn'), g = near('Gather'); line(b.length ? '🔥 Run by ' + listNames(b.slice(0, 3)) + '. It smelts one kind of material at a time.' : '⚠ No Burn Pokémon lives within reach, so nobody runs it.', !b.length, 'A Burn Pokémon living nearby smelts ores into ingots, sand, sandstone or volcanic ash into glass, and fragments into Pokémetal. It keeps going until the furnace is empty.'); if (g.length) line('Filled from the community box by ' + listNames(g.slice(0, 3)) + '.'); }
  if (it.n === 'Concrete mixer') { const c = near('Crush'); line(c.length ? '⚙ Run by ' + listNames(c.slice(0, 3)) + '.' : '⚠ No Crush Pokémon lives within reach, so nobody runs it.', !c.length, 'A Crush Pokémon living nearby turns limestone into concrete. Guides say the mixer also needs water, and that a batch takes about an hour.'); }
  return out;
}
function crowdCount() { const s2 = new Set((plan.res || []).map(r => r.p)); for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'habitat' && r.ok) for (const n of r.best.hb.p) if (!homeOfPokemon(n)) s2.add(n); } return s2.size; }
function dropHomes() { const out = []; for (const hs of autoHouses) if (!hs.enclosure) { const home = houseHome(hs), lit = litterers(residentsOf(home).map(r => PK_BY_NAME.get(r.p)).filter(Boolean)); if (lit.length) out.push({ home, lit }); } for (const ob of plan.objs.values()) if (ITEMS[ob.i].cap) { const home = kitHome(ob), lit = litterers(residentsOf(home).map(r => PK_BY_NAME.get(r.p)).filter(Boolean)); if (lit.length) out.push({ home, lit }); } return out; }
function dropsShown() {
  const sel = selection; let one = null;
  if (sel && sel.obj && plan.objs.has(sel.obj.id) && ITEMS[sel.obj.i].cap) one = kitHome(sel.obj); else if (sel && sel.house) { const hs = houseById.get(sel.house); if (hs) one = houseHome(hs); }
  const all = showDrops ? dropHomes() : [];
  if (one && !all.some(d => d.home.key === one.key)) { const lit = litterers(residentsOf(one).map(r => PK_BY_NAME.get(r.p)).filter(Boolean)); if (lit.length) all.push({ home: one, lit }); }
  return all;
}
function drawDrops(c, s) {
  const list = dropsShown(); if (!list.length) return; c.save();
  for (const { home, lit } of list) {
    const tiles = litterTiles(home);
    for (const t of tiles) { const px = view.px + t.x * s, py = view.py + t.y * s; if (t.ok) { c.globalAlpha = 0.35; c.fillStyle = REACH_COL.berry; c.fillRect(px + 1, py + 1, s - 2, s - 2); } else if (s >= 8) { c.globalAlpha = 0.85; c.strokeStyle = theme.bad; c.lineWidth = 1.5; c.strokeRect(px + 2, py + 2, s - 4, s - 4); } }
    if (s >= 10 && tiles.length) { const t0 = tiles[0], txt = [...new Set(lit.map(p => p.lt || '?'))].join(', '); c.globalAlpha = 1; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const tw = c.measureText(txt).width + 8; c.fillStyle = REACH_COL.berry; roundRect(c, view.px + t0.x * s, view.py + t0.y * s - 16, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(txt, view.px + t0.x * s + 4, view.py + t0.y * s - 14); }
  }
  c.restore();
}
function setShowDrops(v) { showDrops = v; LS.set(LSK + 'drops', v ? '1' : '0'); sysSync(); requestDraw(); }
function setShowWater(v) { showWater = v; LS.set(LSK + 'water', v ? '1' : '0'); sysSync(); requestDraw(); }
function setShowPower(v) { showPower = v; LS.set(LSK + 'power', v ? '1' : '0'); sysSync(); requestDraw(); }
function powerNetOf(ob) { if (!POWER) return null; const t = POWER.tx.get(ob.id); if (t) return t.net; const d = POWER.dev.get(ob.id); if (d && d.tx) return d.tx.net; const g = POWER.gen.get(ob.id); if (g && g.tx) return g.tx.net; return null; }
function drawPowerLines(c, P, pt, nets, s, all) {
  const col = (N) => N.over ? theme.bad : N.on ? REACH_COL.power : theme.muted;
  c.save(); c.lineCap = 'round';
  for (const N of nets) for (const t of N.tx) {
    const a = pt(t.foot[0], t.foot[1], topOf(t.ob));
    if (t.gen) { const f = powerFoot(t.gen.ob), b = pt(f[0], f[1], zOf(t.gen.ob)); c.strokeStyle = col(N); c.lineWidth = 3; c.globalAlpha = 0.9; c.setLineDash([]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (const o of t.links) if (o.ob.id > t.ob.id) { const b = pt(o.foot[0], o.foot[1], topOf(o.ob)), bad = t.blocked.some(q => q.to === o); c.strokeStyle = bad ? theme.warn : col(N); c.lineWidth = 2.2; c.globalAlpha = 0.85; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (const d of t.devs) { const b = pt(d.ob.x + (d.ob.w - 1) / 2, d.ob.y + (d.ob.h - 1) / 2, zOf(d.ob)); c.strokeStyle = col(N); c.lineWidth = 1.2; c.globalAlpha = 0.6; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
  }
  c.setLineDash([]); c.globalAlpha = 1; const r = Math.max(3.5, Math.min(7, s * 0.16));
  for (const d of P.dev.values()) { if (!all && !(d.tx && nets.includes(d.tx.net))) continue; const b = pt(d.ob.x + d.ob.w - 1, d.ob.y, zOf(d.ob) + htOf(d.ob) - 1); c.fillStyle = d.on ? theme.good : theme.bad; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(b[0] + s * 0.32, b[1] - s * 0.32, r, 0, 7); c.fill(); c.stroke(); }
  if (s >= 7) for (const N of nets) { const t = N.tx[0], a = pt(t.foot[0], t.foot[1], topOf(t.ob)), txt = N.supply ? N.draw + ' of ' + N.supply + ' power' + (N.over ? ' · overloaded' : '') : 'no generator'; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const tw = c.measureText(txt).width + 8; c.fillStyle = col(N); roundRect(c, a[0] + 6, a[1] + 6, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(txt, a[0] + 10, a[1] + 8); }
  c.restore();
}
function powerShown() { const sel = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null, N = sel ? powerNetOf(sel) : null; if (!POWER || !POWER.any) return null; if (showPower) return POWER.nets; return N ? [N] : null; }
function drawPower(c, s) { const nets = powerShown(); if (!nets) return; drawPowerLines(c, POWER, (x, y) => [view.px + (x + 0.5) * s, view.py + (y + 0.5) * s], nets, s, showPower); }
function setShowReach(v) { showReach = v; LS.set(LSK + 'reach', v ? '1' : '0'); sysSync(); requestDraw(); }
function houseAt(x, y) { if (!cellHouse || !inB(plan, x, y)) return null; const i = cellHouse[y * plan.w + x]; return i >= 0 ? autoHouses[i] : null; }
function houseIssues(hs) { const out = []; if (!hs.doors.size) out.push('needs a door'); else if (!hs.clearDoors) out.push('door blocked'); if (!hs.sizeOk) out.push(hs.w < 2 || hs.h < 2 ? 'too small' : 'too big'); if (hs.furn < 3) out.push(hs.furn + '/3 furniture kinds'); return out; }
function countsFor(hb, it) { for (const [tok] of hb.r) { if (GROUPS.has(tok) ? GROUPS.get(tok).has(it.i) : BY_NAME.get(DATA.terrainReq[tok] || tok) === it) return true; } return false; }
function computeArea(z, r) {
  if (z.kind === 'label') return null;
  if (z.kind === 'house') {
    const cells = new Set(); let walls = 0;
    for (let y = Math.max(0, z.y); y < Math.min(plan.h, z.y + z.h); y++) for (let x = Math.max(0, z.x); x < Math.min(plan.w, z.x + z.w); x++) {
      const k = y * plan.w + x, ob = objAtLv(k, standZ(k));
      if (ob && isWall(ITEMS[ob.i])) { walls++; continue; } cells.add(k);
    }
    return { kind: 'house', cells, rect: { x: z.x, y: z.y, w: z.w, h: z.h }, walls };
  }
  const hb = r && (r.best ? r.best.hb : r.target || (r.near && r.near.hb));
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; const own = new Set();
  if (hb) for (let y = Math.max(0, z.y); y < Math.min(plan.h, z.y + z.h); y++) for (let x = Math.max(0, z.x); x < Math.min(plan.w, z.x + z.w); x++) {
    const k = y * plan.w + x, g = surfAt(k), ob = objAtLv(k, standZ(k));
    let hit = false;
    if (ob && countsFor(hb, ITEMS[ob.i])) { hit = true; own.add(ob.id); }
    if (g && countsFor(hb, ITEMS[g - 1])) hit = true;
    if (hit) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  if (x1 < 0) { x0 = z.x; y0 = z.y; x1 = z.x + z.w - 1; y1 = z.y + z.h - 1; }
  let base = Infinity; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inB(plan, x, y)) base = Math.min(base, standZ(y * plan.w + x)); if (base === Infinity) base = 1;
  const rx = Math.max(0, x0 - AREA_R), ry = Math.max(0, y0 - AREA_R), rx1 = Math.min(plan.w - 1, x1 + AREA_R), ry1 = Math.min(plan.h - 1, y1 + AREA_R);
  return { kind: 'habitat', rect: { x: rx, y: ry, w: rx1 - rx + 1, h: ry1 - ry + 1 }, foot: { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }, base, own, hb };
}
function inArea(a, x, y, z) {
  if (!a) return false; const k = y * plan.w + x;
  if (a.kind === 'house') { if (!a.outer) return a.cells.has(k); if (x < a.rect.x || y < a.rect.y || x >= a.rect.x + a.rect.w || y >= a.rect.y + a.rect.h) return false; if (z == null) return true; const d = z - a.base; return d >= -4 && d <= 3; }
  return x >= a.rect.x && y >= a.rect.y && x < a.rect.x + a.rect.w && y < a.rect.y + a.rect.h && (z == null || Math.abs(z - a.base) <= AREA_R);
}
function areaContents(a) {
  const out = new Map(); let n = 0; if (!a) return { n, out };
  for (const ob of plan.objs.values()) {
    if (a.own && a.own.has(ob.id)) continue; const it = ITEMS[ob.i];
    if (it.c === 'Terrain' || it.c === 'Kits' || isWall(it) || /door|gate/i.test(it.n)) continue;
    if (objInArea(ob, a)) { n++; const c = CAT_META[it.c] ? CAT_META[it.c].label : it.c; out.set(c, (out.get(c) || 0) + 1); }
  }
  return { n, out };
}
function areaSummary(a) {
  if (!a) return '';
  if (a.kind === 'house') return a.outer ? 'The active area is the dotted line: ' + a.rect.w + '×' + a.rect.h + ' tiles, 4 past the walls on every side, from 4 levels below to 3 above the door. Favourite items and furniture count anywhere in it, even outside the walls, if the Pokémon can walk to them. Items on top of walls, tables or other items count at their own height. Light, warmth and humidity only count the floor inside the walls (the lighter tiles) and the door tiles, from 1 below to 3 above.' : 'The active area is the floor inside the walls (' + a.cells.size + ' tiles, door included).';
  return 'The active area is the dotted line: ' + a.rect.w + '×' + a.rect.h + ' tiles, ' + AREA_R + ' past the habitat (' + a.foot.w + '×' + a.foot.h + ') on every side and ' + AREA_R + ' levels up or down.';
}
let firstEval = true;
function evaluateAll() {
  evalSeq++; REACH_CACHE.clear();
  flowIndex();
  const prev = zoneStatus; zoneStatus = new Map();
  for (const z of plan.zones) { const r = evaluateZone(z); r.area = computeArea(z, r); zoneStatus.set(z.id, r); const p = prev.get(z.id); if (!firstEval && r.ok && (!p || !p.ok) && r.kind !== 'label') celebrate(z, r); }
  detectHouses();
  computePower();
  computeFields();
  computeSignals();
  checkProblems(); updateStatus();
  firstEval = false;
}
function planPokemon() { const set = new Map(); for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'habitat' && r.ok) for (const n of r.best.hb.p) if (!set.has(n)) set.set(n, r.best.hb); } return set; }
function prefabTotal() { let n = 0; for (const ob of plan.objs.values()) n += ITEMS[ob.i].pv || 0; return n; }
function housingCapacity() { let cap = 0, kits = 0; for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (it.c === 'Kits') { kits++; cap += it.cap || 0; } } for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'house' && r.ok) cap += 4; } let built = 0; for (const hs of autoHouses) if (hs.ok) { cap += 4; built++; } return { cap, kits, built }; }

function materialTotals(raw) {
  const need = new Map(), gather = new Map(); let crafted = 0, natural = 0;
  const addM = (n, q) => need.set(n, (need.get(n) || 0) + q);
  const addItem = (it, mult) => {
    if (it.c === 'Terrain') return;
    if (it.m && it.m.length) { crafted += mult; for (const [m, q] of it.m) addM(m, q * mult); }
    else { natural += mult; gather.set(it.n, (gather.get(it.n) || 0) + mult); }
  };
  for (const ob of plan.objs.values()) addItem(ITEMS[ob.i], 1);
  const gc = new Map(); for (const T of plan.tt) for (let k = 0; k < T.length; k++) { const g = T[k]; if (g) gc.set(g - 1, (gc.get(g - 1) || 0) + 1); }
  for (const r of rugsOf(plan)) gc.set(r.i, (gc.get(r.i) || 0) + 1);
  for (const [i, n] of gc) addItem(ITEMS[i], n);
  let out = need;
  if (raw) {
    out = new Map();
    const expand = (n, q) => { const pr = DATA.process[n]; if (pr) expand(pr[0], q * pr[1]); else out.set(n, (out.get(n) || 0) + q); };
    for (const [n, q] of need) expand(n, q);
    for (const [n, q] of out) out.set(n, Math.ceil(q - 1e-9));
  }
  return { need: out, processed: need, gather, crafted, natural };
}

const LIMITS = [
  ['Generators', (it) => !!it.pg && it.n !== 'Furnace kit', 128, 'Mini generators, windmills and waterwheels. It was 64 before Ver. 2.0.0. Furnace kits have their own count.'],
  ['Transmitters', (it) => !!it.pt, 252, 'Utility poles and wireless transmitters. Serebii says 256. Past the cap, new ones don\'t work.'],
  ['Powered items', (it) => it.pd != null, 1024, 'Everything that needs power, including lights that use none. It was 512 before Ver. 1.1.0.'],
  ['Field crops', (it) => it.sub === 'Crops', (p) => p.area === 'Cloud Island' ? 576 : 511, 'One per field tile, 576 on Cloud Islands. The game warns when they fruit.'],
  ['Growing plants', (it) => !!it.cg, 1024, 'Trees, flowers, hedges and crops while they grow. Fully grown plants don\'t count, so plant in batches if you\'re over.'],
  ['Berry trees', (it) => GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i), 226, 'Past the cap, trees can\'t be headbutted.'],
  ['Pointy trees', (it) => it.n === 'Pointy tree', 251, ''],
  ['Furnaces and mixers', (it) => /^(Smelting furnace|Metallic smelting furnace|Concrete mixer)$/.test(it.n), 128, 'Smelting furnaces, metallic smelting furnaces and concrete mixers together.'],
  ['Workbenches and cooking pots', (it) => /^(Workbench|Cooking pot|Stylish cooking pot|Camping cooking pot)$/.test(it.n), 128, ''],
  ['Community boxes', (it) => isBox(it), 32, ''],
  ['Lift platforms', (it) => it.n === 'Lift platform', 32, ''],
  ['Elevator platforms', (it) => it.n === 'Elevator platform', 32, ''],
  ['Cameras', (it) => /camera$/i.test(it.n), 8, '']
];
function placedCounts() {
  const n = new Map(), add = (i) => n.set(i, (n.get(i) || 0) + 1);
  for (const ob of plan.objs.values()) { add(ob.i); if (ob.int) for (const f of ob.int.f || []) if (f) for (const o of f.o) add(o[0]); }
  return n;
}
function limitRows() {
  const cnt = placedCounts();
  return LIMITS.map(([label, test, cap, tip]) => { let n = 0; for (const [i, q] of cnt) if (test(ITEMS[i])) n += q; return { label, n, cap: typeof cap === 'function' ? cap(plan) : cap, tip }; });
}
let PROBS = [];
function checkProblems() {
  const out = [];
  for (const r of limitRows()) if (r.n > r.cap) out.push({ text: r.label + ': ' + fmt(r.n) + ' of ' + fmt(r.cap), tip: 'Over the game\'s cap for one area. ' + r.tip, tab: 'materials' });
  if (POWER && POWER.any) {
    const at = (o) => ITEMS[o.i].n + ' at ' + o.x + ', ' + o.y;
    for (const N of POWER.nets) if (N.over) out.push({ text: 'Power network overloaded: uses ' + N.draw + ' of ' + N.supply, tip: 'Everything on it goes off. Add a generator, or move items onto another network.', ob: N.tx[0].ob });
    const off = [...POWER.dev.values()].filter(d => !d.on && !(d.tx && d.tx.net.over));
    if (off.length) out.push({ text: off.length + (off.length > 1 ? ' items have' : ' item has') + ' no power', tip: off.slice(0, 4).map(d => at(d.ob) + ': ' + powerWhy(d)).join('. ') + (off.length > 4 ? '. And ' + (off.length - 4) + ' more.' : '.'), ob: off[0].ob });
    for (const g of POWER.gen.values()) if (!g.tx) out.push({ text: at(g.ob) + ' isn\'t connected', tip: 'Each generator needs a transmitter of its own within 10 tiles.', ob: g.ob });
    for (const t of POWER.tx.values()) for (const q of t.blocked) out.push({ text: 'Wire blocked at ' + q.at.x + ', ' + q.at.y, tip: q.at.what + ' is in the way between ' + at(t.ob) + ' and ' + at(q.to.ob) + '. It only works if the wire was strung first.', ob: t.ob });
  }
  if (SIG && SIG.any) {
    const at = (o) => ITEMS[o.i].n + ' at ' + o.x + ', ' + o.y;
    for (const rec of SIG.inputs.values()) { if (!rec.targets.length) out.push({ text: at(rec.ob) + ' reaches nothing', tip: 'Nothing that responds to it is within its reach: doors, windows, lights and appliances with power, switch transmitters, floodgates, music mats or bells.', ob: rec.ob }); if (rec.watch && !rec.moving) out.push({ text: at(rec.ob) + ' never fires', tip: rec.onlySensor ? 'It only sees another laser sensor, and a sensor never sees one fire.' : 'Nothing in front of it can move.', ob: rec.ob }); }
  }
  if (FIELDS && FIELDS.any) {
    const crops = [...FIELDS.cells.values()].filter(c => c.crop), n = (st) => crops.filter(c => c.state === st), pl = (a, one, many) => a.length + ' crop tile' + (a.length > 1 ? 's ' + many : ' ' + one);
    const dry = n('dry'), dried = n('dried'), bad = [...n('lava'), ...n('under')];
    if (dry.length) out.push({ text: pl(dry, 'is dry', 'are dry'), tip: 'Crops only grow on days they\'re wet. ' + fieldWhy(dry[0]) + '.', ob: dry[0].crop });
    if (dried.length) out.push({ text: pl(dried, 'is dried out', 'are dried out') + ' by a Smooth Rock', tip: fieldWhy(dried[0]) + '. Rain or a running sprinkler that reaches the rock stops it.', ob: dried[0].crop });
    if (bad.length) out.push({ text: pl(bad, 'can\'t be watered', 'can\'t be watered'), tip: fieldWhy(bad[0]) + '.', ob: bad[0].crop });
    for (const Q of FIELDS.spr.values()) if (!Q.works) out.push({ text: 'Sprinkler at ' + Q.ob.x + ', ' + Q.ob.y + ' has no water', tip: 'A sprinkler needs water within ' + S.gSprinkler + ' tiles at its own level or one below.', ob: Q.ob });
  }
  { const at = (o) => ITEMS[o.i].n + ' at ' + o.x + ', ' + o.y;
    for (const { home, lit } of dropHomes()) if (!litterTiles(home).some(t => t.ok)) out.push({ text: listNames(lit.map(p => p.n)) + '\'s drops have nowhere to land', tip: 'Every tile around ' + (home.kind === 'kit' ? 'the kit' : 'the house') + ' has an item, liquid or nothing under it. ' + DROP_TIP, ob: home.kind === 'kit' ? home.ob : null });
    const hms = homeRanges(), anyBox = [...plan.objs.values()].some(o => isBox(ITEMS[o.i]));
    for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (!/smelting furnace$/i.test(it.n) && it.n !== 'Concrete mixer') continue; const sp = it.n === 'Concrete mixer' ? 'Crush' : 'Burn'; if (!hms.some(hm => { const R = hm.rect; return ob.x >= R.x && ob.y >= R.y && ob.x < R.x + R.w && ob.y < R.y + R.h && Math.abs(zOf(ob) - hm.base) <= AREA_R && hm.pks.some(p => (p.s || []).includes(sp)); })) out.push({ text: at(ob) + ' has nobody to run it', tip: 'It needs a ' + sp + ' Pokémon living nearby.', ob }); }
    if (anyBox) for (const hm of hms) if (hm.kind !== 'habitat') { const wk = workers(hm); if (wk.length && !nearestBox(hm)) out.push({ text: listNames(wk.map(w => w.p.n)) + ' ' + (wk.length > 1 ? 'have' : 'has') + ' no community box in reach', tip: 'Processing Pokémon work from the community box nearest their home, which must sit wholly within 4 tiles of its dotted line.', ob: hm.ob || null }); }
    const n = crowdCount(); if (n > 25) out.push({ text: n + ' Pokémon live in this area', tip: 'Only 25 show in one area at a time, and the others may stop producing. Pokémon asleep in kit houses at night don\'t count.' });
  }
  PROBS = out;
}
function showProblemAt(ob) { closeModal(); if (!plan.objs.has(ob.id)) return; selection = { obj: ob }; mapView.centerOn(ob.x + ob.w / 2, ob.y + ob.h / 2); toMap(); showObjInspector(ob); requestDraw(); }
function showProblems() {
  modal(PROBS.length === 1 ? '1 problem' : PROBS.length + ' problems', (box) => {
    const l = h('div', { class: 'list' });
    for (const p of PROBS) l.append(h('div', { class: 'row', style: 'cursor:default;align-items:flex-start' }, h('span', { class: 'req miss', style: 'flex:none' }, '!'), h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, p.text), h('div', { class: 'ds', style: 'white-space:normal' }, p.tip)), p.ob ? h('button', { class: 'btn sm', style: 'flex:none', onclick: () => showProblemAt(p.ob) }, 'Show') : ''));
    box.append(l);
  }, 'See limits', () => { openTab('materials', 'half'); });
  const b = $('#modalBox .acts .btn'); if (b) b.textContent = 'Close';
}
