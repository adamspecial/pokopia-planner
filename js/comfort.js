'use strict';
const GRP = { pool: 'waiting', size: 4, env: true, q: '' };
function grpPoolList() {
  const att = planPokemon(); const fromHab = [...att.keys()].map(n => PK_BY_NAME.get(n)).filter(Boolean);
  if (GRP.pool === 'waiting') return fromHab.filter(p => !homeOfPokemon(p.n));
  if (GRP.pool === 'all') return fromHab;
  return (plan.pool || []).map(n => PK_BY_NAME.get(n)).filter(Boolean);
}
function grpShared(a, b) { let n = 0; for (const f of a.fv || []) if ((b.fv || []).includes(f)) n++; return n + (a.fl && a.fl === b.fl ? 0.3 : 0) - (favClash(a, b) ? 4 : 0); }
function grpScore(g) { const seen = new Set(); let total = 0; for (const p of g) for (const f of p.fv || []) { seen.add(f); total++; } const fl = new Map(); for (const p of g) if (p.fl) fl.set(p.fl, (fl.get(p.fl) || 0) + 1); let b = 0; for (const n of fl.values()) b += (n - 1) * 0.3; for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) if (favClash(g[i], g[j])) b -= 4; return total - seen.size + b; }
function grpFits(g, p) { return !GRP.env || !g.length || !p.ideal || g.every(q => !q.ideal || q.ideal === p.ideal); }
function makeGroups(pool, size) {
  const left = [...pool].sort((a, b) => a.n.localeCompare(b.n)); const groups = [];
  while (left.length) {
    if (size === 1 || left.length === 1) { groups.push([left.shift()]); continue; }
    let bi = -1, bj = -1, bs = -1;
    for (let i = 0; i < left.length; i++) for (let j = i + 1; j < left.length; j++) { if (!grpFits([left[i]], left[j])) continue; const s = grpShared(left[i], left[j]); if (s > bs) { bs = s; bi = i; bj = j; } }
    if (bi < 0) { groups.push([left.shift()]); continue; }
    const g = [left[bi], left[bj]]; left.splice(bj, 1); left.splice(bi, 1);
    while (g.length < size) { let k = -1, ks = -1; const base = grpScore(g); for (let i = 0; i < left.length; i++) { if (!grpFits(g, left[i])) continue; const s = grpScore([...g, left[i]]) - base; if (s > ks) { ks = s; k = i; } } if (k < 0) break; g.push(left.splice(k, 1)[0]); }
    groups.push(g);
  }
  for (let pass = 0; pass < 8; pass++) {
    let better = false;
    for (let a = 0; a < groups.length; a++) for (let b = a + 1; b < groups.length; b++) {
      const A = groups[a], B = groups[b];
      for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) {
        const A2 = A.slice(), B2 = B.slice(); [A2[i], B2[j]] = [B[j], A[i]];
        const okA = A2.every((p, k) => grpFits(A2.filter((_, m) => m !== k), p)), okB = B2.every((p, k) => grpFits(B2.filter((_, m) => m !== k), p));
        if (okA && okB && grpScore(A2) + grpScore(B2) > grpScore(A) + grpScore(B) + 1e-9) { groups[a] = A2; groups[b] = B2; better = true; break; }
      }
    }
    if (!better) break;
  }
  return groups.filter(g => g.length).sort((x, y) => y.length - x.length || grpScore(y) - grpScore(x));
}
function grpFavs(g) { const cnt = new Map(); for (const p of g) for (const f of p.fv || []) cnt.set(f, (cnt.get(f) || 0) + 1); return [...cnt].sort((a, b) => b[1] - a[1] || FAVS[a[0]].localeCompare(FAVS[b[0]])); }
function grpPairs(g) {
  if (g.length < 3) return [g];
  if (g.length === 3) { const opts = [[0, 1, 2], [0, 2, 1], [1, 2, 0]].map(([a, b, c]) => ({ s: grpShared(g[a], g[b]), p: [[g[a], g[b]], [g[c]]] })); return opts.sort((x, y) => y.s - x.s)[0].p; }
  const opts = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]].map(pr => ({ s: grpShared(g[pr[0][0]], g[pr[0][1]]) + grpShared(g[pr[1][0]], g[pr[1][1]]), p: pr.map(q => q.map(i => g[i])) }));
  return opts.sort((x, y) => y.s - x.s)[0].p;
}
function allHomes() { const out = []; for (const hs of autoHouses) if (!hs.enclosure) out.push(houseHome(hs)); for (const ob of plan.objs.values()) if (ITEMS[ob.i].cap) out.push(kitHome(ob)); return out.map(hm => ({ hm, used: residentsOf(hm).length })); }
function moveGroupIn(g, home) {
  if (home.floors > 1) { const pairs = grpPairs(g); pairs.forEach((pr, f) => pr.forEach(p => assignResident(p.n, home, Math.min(f, 1)))); }
  else for (const p of g) assignResident(p.n, home);
}
function homeChoices(g) { return allHomes().filter(x => g.every(p => fitsHome(p, x.hm)) && x.hm.cap - x.used + g.filter(p => { const hm = homeOfPokemon(p.n); return hm && hm.key === x.hm.key; }).length >= g.length); }
function housemateGroups() {
  modal('Group into houses', (box) => {
    box.classList.add('xl');
    const ctr = h('div', { class: 'grpctl' }), body = h('div'); box.append(ctr, body);
    const render = () => {
      ctr.textContent = ''; body.textContent = '';
      const att = planPokemon(); const waiting = [...att.keys()].filter(n => !homeOfPokemon(n)).length;
      ctr.append(segmented([['waiting', 'Need a home (' + waiting + ')'], ['all', 'All (' + att.size + ')'], ['list', 'My list (' + (plan.pool || []).length + ')']], GRP.pool, v => { GRP.pool = v; render(); }, 'Who'),
        segmented([[4, '4 per home'], [2, '2 per home']], GRP.size, v => { GRP.size = +v; render(); }, 'Size'),
        h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked: GRP.env ? '' : null, onchange: e => { GRP.env = e.target.checked; render(); } }), 'Same ideal only'));
      if (GRP.pool === 'list') {
        const inp = h('input', { type: 'search', id: 'grpQ', placeholder: 'Add a Pokémon', value: GRP.q, autocomplete: 'off' }); const sug = h('div', { class: 'reqs' });
        const showSug = () => { sug.textContent = ''; const q = GRP.q.toLowerCase(); if (!q) return; for (const p of PK.filter(p => p.n.toLowerCase().includes(q) && !(plan.pool || []).includes(p.n)).slice(0, 12)) sug.append(h('button', { class: 'pkchip', type: 'button', onclick: () => { plan.pool = [...(plan.pool || []), p.n]; markDirty(); GRP.q = ''; render(); setTimeout(() => { const i = $('#grpQ'); if (i) i.focus(); }, 0); } }, pkFace(p, 24), p.n, icon('plus'))); };
        inp.oninput = () => { GRP.q = inp.value.trim(); showSug(); };
        const chips = h('div', { class: 'reqs' }); for (const n of plan.pool || []) chips.append(h('span', { class: 'res' }, pkFace(n, 24), n, h('button', { 'aria-label': 'Remove ' + n, onclick: () => { plan.pool = plan.pool.filter(x => x !== n); markDirty(); render(); } }, icon('close'))));
        body.append(h('label', { class: 'search', style: 'margin-top:8px' }, icon('search'), inp), sug, chips,
          h('div', { style: 'display:flex;gap:6px;margin:4px 0 8px' }, h('button', { class: 'btn sm', onclick: () => { plan.pool = [...new Set([...(plan.pool || []), ...att.keys()])]; markDirty(); render(); } }, 'Add all from habitats'), (plan.pool || []).length ? h('button', { class: 'btn sm danger', onclick: () => { plan.pool = []; markDirty(); render(); } }, 'Clear list') : ''));
        showSug();
      }
      const pool = grpPoolList();
      if (!pool.length) { body.append(h('p', { class: 'hint' }, GRP.pool === 'waiting' ? (att.size ? 'Everyone has a home already. Use All to re-plan them.' : 'No finished habitats yet: use My list.') : GRP.pool === 'all' ? 'No finished habitats yet: use My list.' : 'Add Pokémon above.')); return; }
      const groups = makeGroups(pool, GRP.size); const apart = pool.reduce((a, p) => a + (p.fv || []).length, 0), together = groups.reduce((a, g) => a + grpFavs(g).length, 0);
      const free = allHomes().filter(x => x.used === 0).map(x => x.hm);
      body.append(h('div', { class: 'grpsum' }, h('span', null, h('b', null, pool.length), ' Pokémon → ', h('b', null, groups.length), ' home' + (groups.length === 1 ? '' : 's')), h('span', { 'data-tip': 'Kinds of things to decorate with: ' + together + ' grouped like this, ' + apart + ' if they all lived apart' }, h('b', null, together), ' kinds to decorate (' + apart + ' apart)'),
        free.length ? h('button', { class: 'btn sm primary', style: 'margin-left:auto', onclick: () => fillEmptyHomes(groups, free, render) }, 'Fill ' + free.length + ' empty home' + (free.length === 1 ? '' : 's')) : h('span', { class: 'note', style: 'margin-left:auto' }, 'No empty homes')));
      const grid = h('div', { class: 'ggrid' });
      groups.forEach((g, gi) => {
        const favs = grpFavs(g), envs = [...new Set(g.map(p => p.ideal).filter(Boolean))], fls = [...new Set(g.map(p => p.fl).filter(Boolean))];
        const choices = homeChoices(g); const sel = h('select', { 'aria-label': 'Move this group into a home' }, h('option', { value: '' }, choices.length ? 'Move in to…' : 'No home with ' + g.length + ' free bed' + (g.length > 1 ? 's' : '')), choices.map((x, i) => h('option', { value: i }, x.hm.label + ' (' + (x.hm.cap - x.used) + ' free)')));
        sel.disabled = !choices.length; sel.onchange = () => { if (sel.value === '') return; const hm = choices[+sel.value].hm; moveGroupIn(g, hm); toast(g.length > 1 ? 'Moved ' + g.length + ' Pokémon into ' + hm.label : g[0].n + ' moved in'); requestDraw(); render(); };
        grid.append(h('div', { class: 'card', style: 'margin:0' },
          h('div', { class: 'hd' }, h('span', { class: 'title' }, g.length > 1 ? 'Home ' + (gi + 1) : 'On their own'), envs.length ? h('span', { class: 'env' }, envs.join(' / ')) : '', h('span', { class: 'note', style: 'margin-left:auto' }, favs.length + ' kinds')),
          h('div', { class: 'reqs' }, g.map(p => { const hm = homeOfPokemon(p.n); return h('button', { class: 'res', style: 'padding-right:10px', 'data-tip': (p.fv || []).map(f => FAVS[f]).join(' · ') + (p.fl ? ' · likes ' + p.fl.toLowerCase() : '') + (hm ? ' · lives in ' + hm.label : ''), onclick: () => { closeModal(); openPokemon(p.n); } }, pkFace(p, 24), p.n, sizeBadge(p), hm ? h('span', { class: 'note' }, ' ⌂') : ''); })),
          h('div', null, favs.map(([f, n]) => h('span', { class: 'fav ' + (n > 1 ? 'have' : ''), 'data-tip': n > 1 ? n + ' of them like this' : 'Only one likes this' }, n > 1 ? '×' + n + ' ' : '', FAVS[f]))),
          fls.length ? h('div', { class: 'note', style: 'margin-top:4px' }, 'Flavours: ' + fls.map(f => f.toLowerCase().replace(/ flavou?rs?$/, '')).join(', ')) : '',
          h('div', { class: 'field', style: 'margin:8px 0 0' }, sel)));
      });
      body.append(grid);
    };
    render();
  }, null, null, false, 'Puts Pokémon that like the same kinds of things together, so one set of decorations pleases everyone in a home. Green favourites are shared: one item covers several Pokémon. ⌂: already has a home; moving the group moves them. In two-floor houses the two pairs that share the most sleep on the same floor. Large Pokémon aren\'t offered dens or the Poké Ball house; "Size?" means not tested in a den yet.');
}
function fillEmptyHomes(groups, free, rerender) {
  const homes = free.slice().sort((a, b) => a.cap - b.cap); const plan2 = [];
  const rest = [];
  for (const g of groups) { const k = homes.findIndex(hm => hm.cap >= g.length && g.every(p => fitsHome(p, hm))); if (k < 0) { rest.push(g.slice()); continue; } plan2.push([g, homes[k]]); homes.splice(k, 1); }
  for (const hm of homes.sort((a, b) => b.cap - a.cap)) {
    rest.sort((a, b) => b.length - a.length); const gi = rest.findIndex(g => g.some(p => fitsHome(p, hm))); if (gi < 0) continue; const g = rest[gi].filter(p => fitsHome(p, hm));
    const part = hm.cap >= 2 && g.length >= 2 ? grpPairs(g)[0].slice(0, hm.cap) : g.slice(0, 1); plan2.push([part, hm]); rest[gi] = rest[gi].filter(p => !part.includes(p));
  }
  if (!plan2.length) { toast('None of the groups fit your empty homes'); return; }
  const n = plan2.reduce((a, [g]) => a + g.length, 0);
  modal('Fill empty homes?', (box) => { box.append(h('p', { class: 'sub' }, 'Moves ' + n + ' Pokémon into ' + plan2.length + ' empty home' + (plan2.length === 1 ? '' : 's') + ':')); const l = h('div', { class: 'list' }); for (const [g, hm] of plan2) l.append(h('div', { class: 'card', style: 'margin:0 0 6px' }, h('b', null, hm.label), h('div', { class: 'pkchips' }, g.map(p => h('span', { class: 'pkchip' }, pkFace(p, 24), p.n))))); box.append(l); }, 'Move them in', () => { for (const [g, hm] of plan2) moveGroupIn(g, hm); requestDraw(); renderPanel(); toast('Moved ' + n + ' Pokémon in'); setTimeout(housemateGroups, 0); });
}
function objInArea(ob, a) { for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) if (inB(plan, x, y) && inArea(a, x, y, zOf(ob))) return true; return false; }
function floorItems(hs) { const ids = new Set(); for (const k of hs.cells) for (const ob of stackAt(k)) { const it = ITEMS[ob.i]; if (!isWall(it) && !isDoor(it)) ids.add(ob.id); } return ids.size; }
const TRIO = [['Relaxation', 'Rest'], ['Toy', 'Toy'], ['Decoration', 'Decoration']];
function comfortTrio(home) {
  const tags = new Set();
  if (home.kind === 'kit') { for (const pc of kitPieces(home.ob, home.floor)) if (pc.it.tg) tags.add(pc.it.tg); }
  else for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (it.tg && !tags.has(it.tg) && objInArea(ob, home.hs.area)) tags.add(it.tg); }
  return TRIO.map(([t, lb]) => [lb, tags.has(t), t]);
}
const isRest = (it) => !!it && it.tg === 'Relaxation';
const restClass = (w, h) => Math.min(w, h) >= 2 ? 'large' : Math.max(w, h) >= 2 ? 'medium' : 'small';
function restFit(home, floor) {
  const pks = residentsOf(home, floor).map(r => PK_BY_NAME.get(r.p)).filter(p => p && pkSize(p) !== 's'); if (!pks.length) return null;
  const rest = home.kind === 'kit' ? kitPieces(home.ob, splitFloors(home) ? (floor != null ? floor : home.floor) : null).filter(pc => isRest(pc.it)) : [...plan.objs.values()].filter(ob => isRest(ITEMS[ob.i]) && objInArea(ob, home.hs.area));
  const top = rest.reduce((m, o) => Math.max(m, SIZE_RANK[restClass(o.w, o.h)[0]]), -1);
  const short = pks.filter(p => SIZE_RANK[pkSize(p)] > top), need = short.reduce((m, p) => Math.max(m, SIZE_RANK[pkSize(p)]), 0);
  return { pks, short: short.map(p => p.n), need, guess: short.some(pkSizeGuess) };
}
const RANK_FOOT = ['1×1', '2×1', '2×2'], RANK_WORD = ['small', 'medium', 'large'];
function largeRestChip(home, floor) { const b = restFit(home, floor); if (!b) return ''; const ok = !b.short.length; return h('span', { class: 'req ' + (ok ? 'ok' : ''), 'data-tip': (ok ? 'The rest items are big enough for everyone.' : listNames(b.short) + (b.short.length > 1 ? ' need' : ' needs') + ' a ' + RANK_WORD[b.need] + ' rest item (' + RANK_FOOT[b.need] + ' or bigger).') + ' Rest items come in sizes by footprint: 1×1 small, 2×1 medium, 2×2 large.' + (b.guess ? ' Some sizes are guesses: tap a size to change it.' : '') }, (ok ? '✓ Rest size' : 'Rest ' + RANK_FOOT[b.need] + (b.guess ? '?' : ''))); }
const TRIO_TIP = { Rest: 'A rest item (bed, seat…)', Toy: 'A toy', Decoration: 'A decoration' };
function trioChips(home, floor) { return h('div', { class: 'reqs' }, comfortTrio(home).map(([lb, ok]) => h('span', { class: 'req ' + (ok ? 'ok' : ''), 'data-tip': TRIO_TIP[lb] + (ok ? ' is in range.' : ' isn\'t in range yet.') + ' Pokémon are most comfortable with a rest, a toy and a decoration item nearby.' }, (ok ? '✓ ' : '') + lb)), largeRestChip(home, floor)); }
const LEGENDS = new Set(['Kyogre', 'Raikou', 'Entei', 'Suicune', 'Volcanion', 'Articuno', 'Zapdos', 'Moltres', 'Lugia', 'Ho-Oh', 'Mewtwo', 'Mew', 'Phione', 'Manaphy', 'Jirachi']);
const CMF = ['Won\'t move in', 'Average', 'Nice', 'Great', 'Awesome'], CMF_PTS = [0, 1, 2, 5, 10], CMF_CLS = ['miss', '', '', 'ok', 'ok'], ENV_LV = [0, 3, 12, 26, 52, 77, 100, 120, 140, 160];
const FOOD_FOR = { Sweet: 'Pecha Berries or beans', Spicy: 'fresh carrots', Bitter: 'Rawst Berries, potatoes or seaweed', Dry: 'Chesto Berries, wheat or cave mushrooms', Sour: 'Aspear Berries or tomatoes' };
const flavourOf = (p) => p && p.fl && !/^none$/i.test(p.fl) ? p.fl.replace(/ flavou?rs?$/i, '') : '';
const STORY = new Set(['Professor Tangrowth', 'Peakychu', 'Mosslax', 'Hoppip', 'Skiploom', 'Jumpluff']);
const storyNil = (p) => !!p && STORY.has(p.n) && S.gStory !== 'count';
const rankOf = (pts) => pts >= 9 ? 4 : pts >= 6 ? 3 : pts >= 4 ? 2 : 1;
const holdOf = (L) => L < 2 ? 0 : ENV_LV[L - 2] + 0.75 * (ENV_LV[L - 1] - ENV_LV[L - 2]);
const lvOfPts = (pts) => { let lv = 1; for (let i = 1; i < ENV_LV.length; i++) if (pts >= ENV_LV[i]) lv = i + 1; return lv; };
const ptsTxt = (v) => String(Math.round(v * 100) / 100);
const DIS_WATER = new Set(['Horsea fountain']), DIS_WATER_MAYBE = new Set(['Gyarados fountain', 'Bathtub', 'Shower', 'Sink', 'Water basin', 'Sprinkler', 'Fire hydrant', 'Humidifier', 'Canoe', 'Inflatable boat', 'Bubble machine', 'Water pillar quarter', 'Funky diffuser']);
const DISLIKES = [
  { t: 'Fire', f: 'Lots of water', w: 'water', why: 'Fire types dislike water', wet: true, tier: (it) => DIS_WATER.has(it.n) ? 2 : DIS_WATER_MAYBE.has(it.n) ? 1 : 0, desc: 'water in range and the Horsea fountain; maybe things that hold or spray water, such as a sink, bathtub or sprinkler' },
  { t: 'Grass', f: 'Lots of fire', w: 'fire', why: 'Grass types dislike fire', wet: false, tier: (it, i) => (it.fv || []).includes(i) ? 2 : 0, desc: 'fire, such as a campfire, candle or cooking stove' }];
function dislikesOf(p) { const out = []; if (p) for (const d of DISLIKES) { const i = FAVS.indexOf(d.f); if (i >= 0 && p.t.includes(d.t) && !(p.fv || []).includes(i)) out.push({ f: i, w: d.w, why: d.why, wet: d.wet, desc: d.desc, tier: (it) => d.tier(it, i) }); } return out; }
const hatesIt = (p, it) => !!it && dislikesOf(p).some(d => d.tier(it) > 0);
const WET = { hard: new Set(['Water', 'Ocean water', 'Waterfall']), soft: new Set(['Muddy water']) };
const WET_IX = {};
function wetTiles(a, kind = 'hard') {
  if (!a || !a.rect) return 0; const wi = WET_IX[kind] || (WET_IX[kind] = new Set(ITEMS.filter(it => WET[kind].has(it.n)).map(it => it.i + 1))), R = a.rect, zs = plan.tz, tt = plan.tt; let n = 0;
  for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { if (!inB(plan, x, y)) continue; const k = y * plan.w + x; for (let j = 0; j < zs.length; j++) if (wi.has(tt[j][k]) && inArea(a, x, y, zs[j])) { n++; break; } }
  return n;
}
function homeStuff(home, floor) {
  const obs = [];
  if (home.kind === 'kit') { for (const pc of kitPieces(home.ob, floor)) obs.push({ it: pc.it, w: pc.w, h: pc.h }); const ki = kitInfo(home.ob); for (let f = 0; f < ki.fl; f++) { if (floor != null && f !== floor) continue; const F = intFloor(home.ob, f); for (const v of [F.wp, F.fc]) if (v != null && ITEMS[v]) obs.push({ it: ITEMS[v], w: 1, h: 1 }); } return { obs, wet: 0, wetSoft: 0 }; }
  const a = home.kind === 'habitat' ? home.area : home.hs.area;
  for (const ob of plan.objs.values()) if (objInArea(ob, a)) obs.push({ it: ITEMS[ob.i], w: ob.w, h: ob.h, ob });
  return { obs, wet: wetTiles(a, 'hard'), wetSoft: wetTiles(a, 'soft') };
}
function comfortOf(p, home, floor, S, E) {
  S = S || homeStuff(home, floor); E = E || envOf(home.kind === 'habitat' ? home : floorOf(home, floor));
  const fv = new Set(p.fv || []), fav = (it) => (it.fv || []).find(f => fv.has(f)), need = SIZE_RANK[pkSize(p)], toys = new Map(), decs = new Map();
  const walk = home.kind === 'house' && home.hs ? walkOf(home.hs, tooBig(p)) : null, cut = new Map();
  let rest = null, small = null;
  for (const o of S.obs) {
    const it = o.it, f = fav(it);
    if (walk && o.ob && mustReach(it) && !walk.touch(o.ob)) { if (!cut.has(it.i)) cut.set(it.i, it); continue; }
    if (it.tg === 'Relaxation') { if (SIZE_RANK[restClass(o.w, o.h)[0]] < need) { small = small || it; continue; } if (!rest || (f != null && rest.f == null)) rest = { it, f }; }
    else if (it.tg === 'Toy' || it.tg === 'Decoration') { const m = it.tg === 'Toy' ? toys : decs; if (!m.has(it.i)) m.set(it.i, { it, f, v: f != null ? 2 : 1 }); }
  }
  const top = (m) => [...m.values()].sort((a, b) => b.v - a.v).slice(0, 2), play = top(toys).concat(top(decs)).sort((a, b) => b.v - a.v).slice(0, 3);
  const restV = rest ? (rest.f != null ? 2 : 1) : 0, playV = play.reduce((s, x) => s + x.v, 0), envOk = !!p.ideal && envMet(p, E), envV = envOk ? 2 : 0, foodV = flavourOf(p) ? 2 : 0;
  const dis = disIn(p, S, home), maybe = dis.length ? [] : disIn(p, S, home, true), pts = restV + playV + envV + foodV, rank = dis.length ? 0 : rankOf(pts);
  const cutL = [...cut.values()], cutRest = rest ? null : cutL.find(it => it.tg === 'Relaxation') || null, story = storyNil(p), unfed = !dis.length && foodV && rankOf(pts - foodV) < rank ? rankOf(pts - foodV) : null;
  return { p, home, rest, small: rest ? null : small, restV, play, playV, toyN: toys.size, decN: decs.size, envOk, envV, foodV, dis, maybe, pts, rank, unfed, story, cut: cutL, cutRest, big: tooBig(p), score: story ? 0 : CMF_PTS[rank] * (LEGENDS.has(p.n) ? 2 : 1) };
}
function disIn(p, S, home, soft) {
  if (home && home.kind === 'habitat' && home.hb && home.hb.p.includes(p.n)) return [];
  const want = soft ? 1 : 2, dis = [];
  for (const d of dislikesOf(p)) {
    const what = [...new Set(S.obs.filter(o => d.tier(o.it) === want).map(o => o.it.n))], wt = d.wet ? (soft ? S.wetSoft : S.wet) || 0 : 0;
    if (wt) what.push(wt + (soft ? ' muddy water tile' : ' water tile') + (wt > 1 ? 's' : ''));
    if (what.length) dis.push({ why: d.why, w: d.w, what });
  }
  return dis;
}
function homeComfort(home) {
  const split = splitFloors(home), memo = new Map(), out = [];
  for (const r of residentsOf(home)) { const p = PK_BY_NAME.get(r.p); if (!p) continue; const f = split ? (r.f || 0) : null; if (!memo.has(f)) memo.set(f, [homeStuff(home, f), envOf(floorOf(home, f))]); const [S, E] = memo.get(f); out.push(comfortOf(p, home, f, S, E)); }
  return out;
}
const disText = (c) => c.dis.map(d => listNames(d.what.slice(0, 3)) + (d.what.length > 3 ? ' and more' : '') + ' (' + d.why + ')').join('; ');
function cmfHint(c) {
  if (c.dis.length) return '⚠ Dislikes ' + disText(c);
  const mw = c.maybe && c.maybe.length ? [...new Set(c.maybe.flatMap(d => d.what))] : [], may = mw.length ? '. It may dislike ' + listNames(mw.slice(0, 2).map(n => /^\d/.test(n) ? n : 'the ' + n.toLowerCase())) + (mw.length > 2 ? ' and more' : '') : '';
  return cmfNext(c) + may;
}
function cmfNext(c) {
  const p = c.p, nf = (x) => x && x.f == null;
  if (!c.rest && c.cutRest) return 'Can\'t get to the ' + c.cutRest.n.toLowerCase() + ': ' + WAY_TXT(c);
  if (c.cut && c.cut.length && c.play.length < 3) return 'Can\'t get to ' + listNames(c.cut.slice(0, 2).map(it => 'the ' + it.n.toLowerCase())) + (c.cut.length > 2 ? ' and more' : '') + ': ' + WAY_TXT(c);
  if (p.ideal && !c.envOk) return 'Make it ' + p.ideal.toLowerCase();
  if (!c.rest) return c.small ? 'Its ' + c.small.n.toLowerCase() + ' is too small: it needs a ' + RANK_WORD[SIZE_RANK[pkSize(p)]] + ' rest item' : 'Add a rest item, ideally one it likes';
  if (!c.toyN || !c.decN) return 'Add a ' + (!c.toyN && !c.decN ? 'toy and a decoration' : !c.toyN ? 'toy' : 'decoration') + ', ideally ones it likes';
  if (c.play.length < 3) return 'Add another toy or decoration';
  if (c.rank === 4) return c.unfed != null ? 'Awesome once fed ' + flavourOf(p).toLowerCase() + ' food, ' + CMF[c.unfed] + ' without' : 'Can reach Awesome';
  const hit = new Set([c.rest, ...c.play].filter(x => x && x.f != null).flatMap(x => (x.it.fv || []).filter(f => (p.fv || []).includes(f)))), miss = (p.fv || []).filter(f => !hit.has(f));
  return nf(c.rest) || c.play.some(nf) ? 'Swap in a rest, toy or decoration it likes: ' + (miss.length ? miss : p.fv || []).slice(0, 3).map(f => FAVS[f]).join(', ') : 'All set';
}
const WAY_TXT = (c) => 'make a way to ' + (c.cut && c.cut.length > 1 && !c.cutRest ? 'them' : 'it') + ' from the door' + (c.big ? ', 2 tiles wide,' : '') + ' that rises or drops 1 level at a time';
function cmfTip(c) {
  const p = c.p, nm = (x) => x.it.n + (x.f != null ? ' ♥ ' + FAVS[x.f] : ''), fl = flavourOf(p);
  const b = ['Rest ' + c.restV + (c.rest ? ' (' + nm(c.rest) + ')' : c.small ? ' (' + c.small.n + ' is too small)' : ''),
    'toys and decorations ' + c.playV + ' of 6' + (c.play.length ? ' (' + c.play.map(nm).join(', ') + ')' : ''),
    (p.ideal ? p.ideal.toLowerCase() : 'ideal habitat') + ' ' + c.envV + (p.ideal && !c.envOk ? ' (not yet)' : ''),
    (fl ? fl.toLowerCase() + ' food ' : 'food ') + c.foodV + (fl ? ' when you give it some (' + (FOOD_FOR[fl] || 'its flavour') + ')' : ' (it has no favourite flavour)')];
  if (c.cut && c.cut.length) b.push('can\'t get to ' + listNames(c.cut.slice(0, 4).map(it => it.n)) + (c.cut.length > 4 ? ' and ' + (c.cut.length - 4) + ' more' : '') + ', so ' + (c.cut.length > 1 ? 'they don\'t' : 'it doesn\'t') + ' count');
  const extra = (c.dis.length ? 'It dislikes ' + disText(c) + ', so it would refuse to move in, and scores 0. If that turns up after it has moved in, its comfort drops by an amount nobody has measured, and it can\'t reach Awesome. ' : '')
    + (c.maybe && c.maybe.length ? 'It may dislike ' + disText({ dis: c.maybe }) + ': guides name only water around it and the Horsea fountain, so these are only a guess. ' : '')
    + (c.unfed != null ? 'Without its favourite food it would be ' + CMF[c.unfed] + '. ' : '')
    + (c.story ? 'Story Pokémon add nothing to the environment level (Settings → Game rules). ' : '');
  return 'Best it can reach here: ' + b.join(', ') + ' = ' + c.pts + '. ' + extra + CMF_RULE;
}
const CMF_RULE = 'Scored the way one player\'s tests found it: 1 for a rest item it fits on, 2 if it\'s a favourite; 1 for each toy or decoration, 2 for a favourite, counting up to 3 different ones; 2 for its ideal habitat; 2 for food of its favourite flavour. 9 or more is Awesome, 6 to 8 Great, 4 or 5 Nice, less Average. Copies of the same item count once.';
const CMF_HELP = 'The best comfort each one can reach with what\'s here. In the game it climbs a step at a time as the Pokémon notices things, answers one wish a day and is fed, and a newcomer starts low, at Iffy or Average. Something it dislikes in range stops it moving in, so it scores 0: Grass types dislike fire, and Fire types dislike water in range and the Horsea fountain, as the guides report. Other things that hold or spray water, such as a sink or bathtub, are marked "may dislike". A Pokémon is never put off by its own habitat. In a house you built, it has to be able to walk to the items it uses, from the door, stepping up or down 1 level at a time (large ones need paths 2 tiles wide). Settings → Game rules picks which items those are. ' + CMF_RULE;
function cmfChip(c) { return h('span', { class: 'req ' + CMF_CLS[c.rank], 'data-tip': cmfTip(c) }, c.dis.length ? CMF[0] : '≈ ' + CMF[c.rank], h('b', null, c.dis.length ? '⚠' : c.pts)); }
function cmfLine(c) { return c ? h('div', { class: 'cmfl' }, cmfChip(c), h('span', { class: 'note', style: c.dis.length ? 'color:var(--bad)' : null }, cmfHint(c))) : ''; }
function cmfRow(c, open) { return h('div', { class: 'cmf' }, pkFace(c.p, 24), h('div', { class: 'cmfb' }, h('div', { class: 'cmfh' }, open ? h('button', { class: 'lnk', type: 'button', onclick: () => open(c.p.n) }, c.p.n) : h('b', null, c.p.n), cmfChip(c)), h('div', { class: 'note', style: c.dis.length ? 'color:var(--bad)' : null }, cmfHint(c)))); }
function cmfBlock(list, title, open, pre) { if (!list.length) return ''; return h('div', { class: 'cmfs' }, h('div', { class: 'hrow', style: 'margin-top:6px' }, h('b', null, title || 'Comfort'), h('span', { class: 'note' }, 'best case'), tipBtn((pre || '') + CMF_HELP)), list.map(c => cmfRow(c, open))); }
function townComfort() {
  const out = [], used = new Set(); let lo = 0, crowd = 0;
  for (const { hm } of allHomes()) for (const c of homeComfort(hm)) { out.push(c); used.add(c.p.n); lo += c.score; if (hm.kind !== 'kit') crowd++; }
  for (const z of plan.zones) {
    const hh = habitatHome(z); if (!hh || !hh.ok) continue; let S = null, E = null, best = null, worst = null;
    for (const p of hh.pks) { if (used.has(p.n) || homeOfPokemon(p.n)) continue; if (!S) { S = homeStuff(hh); E = envOf(hh); } const c = comfortOf(p, hh, null, S, E); if (!best || c.score > best.score) best = c; if (!worst || c.score < worst.score) worst = c; }
    if (best) { out.push(best); used.add(best.p.n); lo += worst.score; crowd++; }
  }
  const pts = out.reduce((s, c) => s + c.score, 0), lv = lvOfPts(pts);
  const n = [0, 0, 0, 0, 0]; for (const c of out) n[c.rank]++;
  return { list: out, pts, lv, n, lo, lvLo: lvOfPts(lo), crowd, story: out.filter(c => c.story).length };
}
const disShort = (dis) => dis.map(d => listNames(d.what.slice(0, 2)) + (d.what.length > 2 ? ' and more' : '')).join(', ');
function envLvTip(tc) {
  const got = CMF.map((nm, i) => tc.n[i] ? tc.n[i] + ' ' + nm : '').filter(Boolean).reverse().join(', '), next = ENV_LV[tc.lv];
  const notes = [];
  if (tc.lo < tc.pts) notes.push('A habitat holds whichever of its Pokémon arrives, so with the least happy ones it would be ' + tc.lo + ' points, level ' + tc.lvLo + '.');
  if (tc.lv >= 2) notes.push('Once reached, level ' + tc.lv + ' holds until points fall below about ' + ptsTxt(holdOf(tc.lv)) + '. Below that the town drops a level, and that level\'s unbought shop stock and challenges lock again.');
  if (tc.story) notes.push(tc.story + ' story Pokémon add nothing (Settings → Game rules).');
  if (tc.crowd > 25) notes.push(tc.crowd + ' Pokémon live outside kit houses, and only about 25 show at once, so some may not notice new things, and sit lower than this until they\'re shown.');
  return (tc.list.length ? 'Best case for this plan: ' + got + ' = ' + tc.pts + ' points, so level ' + tc.lv + (next != null ? ' (level ' + (tc.lv + 1) + ' at ' + next + ')' : '') + '. ' + notes.join(' ') + ' ' : 'Nobody lives here yet. ') + 'Each resident\'s comfort gives points: Awesome 10, Great 5, Nice 2, Average 1, Iffy or no home 0, and twice that for legendary and mythical Pokémon. Levels 2 to 10 need 3, 12, 26, 52, 77, 100, 120, 140 and 160. From two players\' tests; a level is kept until points fall below about three quarters of the way from the level before.';
}
let lvWatch = { id: null, lv: 0 }, lvT = 0;
function lvCheck() {
  if (!plan) return; const tc = townComfort(), lv = tc.list.length ? tc.lv : 1;
  if (lvWatch.id !== plan.id) { lvWatch = { id: plan.id, lv }; return; }
  const was = lvWatch.lv;
  if (lv >= was) { lvWatch.lv = lv; return; }
  if (tc.pts < holdOf(was)) { lvWatch.lv = lv; toast('Down to ' + tc.pts + ' points, below level ' + was + '\'s hold of about ' + ptsTxt(holdOf(was)) + ': in the game the town would drop to level ' + tc.lv + ', and level ' + was + '\'s unbought shop stock and challenges would lock again.', 8000); }
}
function moveInWarn(p, home, floor) { if (!p || !home) return ''; const S = homeStuff(home, splitFloors(home) ? floor || 0 : null), dis = disIn(p, S, home); return dis.length ? ' ⚠ In the game it would refuse: ' + disText({ dis }) + '.' : ''; }
const CBOX = 'Community box', BOX_R = 4;
const isBox = (it) => it && it.n === CBOX;
function growRect(R, n) { const x0 = Math.max(0, R.x - n), y0 = Math.max(0, R.y - n), x1 = Math.min(plan.w - 1, R.x + R.w - 1 + n), y1 = Math.min(plan.h - 1, R.y + R.h - 1 + n); return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }; }
function homeRanges() {
  const out = [], pk = (names) => names.map(n => PK_BY_NAME.get(n)).filter(Boolean);
  for (const z of plan.zones) { const r = zoneStatus.get(z.id); if (r && r.kind === 'habitat' && r.ok && r.area) out.push({ key: 'zone:' + z.id, kind: 'habitat', label: r.best.hb.n, rect: r.area.rect, base: r.area.base, pks: pk(r.best.hb.p), z }); }
  for (const hs of autoHouses) if (!hs.enclosure) out.push({ key: 'house:' + hs.id, kind: 'house', label: 'House at ' + hs.x + ', ' + hs.y, rect: hs.area.rect, base: hs.area.base, pks: pk(residentsOf(houseHome(hs)).map(r => r.p)), hs });
  for (const ob of plan.objs.values()) { const it = ITEMS[ob.i]; if (!it.cap) continue; out.push({ key: 'kit:' + ob.id, kind: 'kit', label: it.n.replace(/ kit$/, '') + ' at ' + ob.x + ', ' + ob.y, rect: growRect(ob, AREA_R), base: zOf(ob), pks: pk(residentsOf(kitHome(ob)).map(r => r.p)), ob, guess: true }); }
  return out;
}
function boxFit(ob, hm) {
  const Z = growRect(hm.rect, BOX_R); let n = 0;
  for (let y = ob.y; y < ob.y + ob.h; y++) for (let x = ob.x; x < ob.x + ob.w; x++) { if (x < Z.x || y < Z.y || x >= Z.x + Z.w || y >= Z.y + Z.h) continue; const d = zOf(ob) - hm.base; if (d >= -12 && d <= 14) n++; }
  const gx = Math.max(0, Z.x - (ob.x + ob.w - 1), ob.x - (Z.x + Z.w - 1)), gy = Math.max(0, Z.y - (ob.y + ob.h - 1), ob.y - (Z.y + Z.h - 1));
  return { n, all: ob.w * ob.h, far: Math.max(gx, gy), Z };
}
function boxReport(ob) { return homeRanges().map(hm => Object.assign({ hm }, boxFit(ob, hm))).filter(x => x.n > 0 || x.far <= 3); }
function boxesFor(hm) { const l = []; for (const ob of plan.objs.values()) if (isBox(ITEMS[ob.i])) { const f = boxFit(ob, hm); if (f.n === f.all) l.push(ob); } return l; }
const gatherers = (pks) => pks.filter(p => p.s.includes('Gather'));
function boxLine(key) {
  const hm = homeRanges().find(x => x.key === key); if (!hm) return '';
  const boxes = boxesFor(hm), g = gatherers(hm.pks);
  const txt = boxes.length ? (boxes.length > 1 ? '⚠ ' + boxes.length + ' boxes in reach' : 'Box at ' + boxes[0].x + ', ' + boxes[0].y) + (g.length ? ' · filled by ' + listNames(g.map(p => p.n)) : ' · nobody fills it') : 'No community box in reach';
  const tip = boxes.length ? (boxes.length > 1 ? 'Only one box gets used. ' : '') + (g.length ? 'Pokémon with the Gather specialty put what they find in it.' : 'Nobody here has the Gather specialty, so nobody fills it.') + (hm.guess ? ' Kit houses: not tested by players.' : '') : 'A community box within 4 tiles of the dotted line collects what Pokémon drop.';
  return h('div', { class: 'note hrow', style: 'margin-top:6px' + (boxes.length > 1 ? ';color:var(--warn)' : '') }, '📦 ' + txt, tipBtn(tip));
}
function boxInspector(ob, box) {
  const rep = boxReport(ob).sort((a, b) => (b.n === b.all) - (a.n === a.all) || a.far - b.far);
  const sec = h('div', { class: 'section' }, h('div', { class: 'hrow' }, h('b', null, 'Homes it serves'), tipBtn('Only Gather Pokémon put things in; processing Pokémon nearby take items out to work on them. The whole box must be within 4 tiles of a home\'s dotted line; the dashed lines on the map show each home\'s reach.')));
  if (!rep.length) sec.append(h('p', { class: 'note', style: 'margin:4px 0' }, 'None in reach'));
  const l = h('div', { class: 'list' });
  for (const x of rep) {
    const full = x.n === x.all, g = gatherers(x.hm.pks), others = full ? boxesFor(x.hm).filter(o => o !== ob).length : 0;
    const why = full ? (g.length ? 'Filled by ' + listNames(g.map(p => p.n)) : 'Nobody here gathers') + (others ? ' · ⚠ ' + (others + 1) + ' boxes, one used' : '') + (x.hm.guess ? ' · untested' : '')
      : x.n > 0 ? 'Sticks out ' + (x.all - x.n) + ' tile' + (x.all - x.n > 1 ? 's' : '') : x.far + ' tile' + (x.far > 1 ? 's' : '') + ' too far';
    l.append(h('div', { class: 'row', style: 'cursor:default;align-items:flex-start' }, h('span', { class: 'req ' + (full ? 'ok' : 'miss'), style: 'flex:none' }, full ? '✓' : '✗'), h('span', { class: 'meta' }, h('div', { class: 'nm', style: 'white-space:normal' }, x.hm.label + (x.hm.kind === 'habitat' ? ' habitat' : '')), h('div', { class: 'ds', style: 'white-space:normal' + (full && others ? ';color:var(--warn)' : '') }, why))));
  }
  sec.append(l);
  const jobs = []; for (const x of rep) if (x.n === x.all && nearestBox(x.hm) === ob) for (const { p, sp } of workers(x.hm)) jobs.push(p.n + ' (' + sp + ': ' + PROC[sp][0] + ' → ' + PROC[sp][1] + ')');
  if (jobs.length) sec.append(h('div', { class: 'note', style: 'margin-top:6px', 'data-tip': 'Put the raw materials in this box and these Pokémon turn them into the result, back in the same box.' }, '⚙ Works from it: ' + listNames([...new Set(jobs)])));
  box.append(sec);
}
function drawBoxReach(c, ob, s) {
  for (const x of boxReport(ob)) { const Z = x.Z, full = x.n === x.all; c.save(); c.strokeStyle = full ? theme.good : theme.warn; c.lineWidth = 2; c.setLineDash([7, 5]); c.globalAlpha = 0.9; c.strokeRect(view.px + Z.x * s + 1, view.py + Z.y * s + 1, Z.w * s - 2, Z.h * s - 2); c.restore();
    if (s >= 7) { c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; const t = 'Box reach: ' + x.hm.label; const tw = c.measureText(t).width + 8; c.fillStyle = full ? theme.good : theme.warn; roundRect(c, view.px + Z.x * s + 2, view.py + (Z.y + Z.h) * s + 2, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(t, view.px + Z.x * s + 6, view.py + (Z.y + Z.h) * s + 4); } }
}
let showReach = LS.get(LSK + 'reach') === '1';
const hasReach = (it) => !!it && (!!it.rc || !!it.pt || !!it.pg || (GROUPS.has('Berry tree (any)') && GROUPS.get('Berry tree (any)').has(it.i)));
function reachList() { const out = []; for (const ob of plan.objs.values()) if (hasReach(ITEMS[ob.i]) && obShown(ob)) out.push(ob); return out; }
let evalSeq = 0; const REACH_CACHE = new Map();
function reachCached(ob) { const e = REACH_CACHE.get(ob.id); if (e && e.seq === evalSeq && e.ob === ob) return e.R; const R = reachOf(ob); REACH_CACHE.set(ob.id, { seq: evalSeq, ob, R }); return R; }
function reachPaths(R) {
  if (R.fp) return R; const W = plan.w, fp = new Path2D(), ep = new Path2D(), wp = new Path2D(), xp = new Path2D(), set = new Set(R.cells);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const edges = (cells, st, path) => { for (const k of cells) { const x = k % W, y = (k / W) | 0; if (!st.has(k - W)) { path.moveTo(x, y); path.lineTo(x + 1, y); } if (!st.has(k + W)) { path.moveTo(x, y + 1); path.lineTo(x + 1, y + 1); } if (x === 0 || !st.has(k - 1)) { path.moveTo(x, y); path.lineTo(x, y + 1); } if (x === W - 1 || !st.has(k + 1)) { path.moveTo(x + 1, y); path.lineTo(x + 1, y + 1); } } };
  for (const k of R.cells) { const x = k % W, y = (k / W) | 0; fp.rect(x, y, 1, 1); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1); }
  edges(R.cells, set, ep); if (R.watch) for (const k of R.watch) wp.rect(k % W, (k / W) | 0, 1, 1);
  if (R.far) { const fs = new Set(R.far); edges(R.far, fs, xp); for (const k of R.far) { const x = k % W, y = (k / W) | 0; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1); } }
  Object.assign(R, { fp, ep, wp, xp, bb: [x0, y0, x1, y1] }); return R;
}
function drawReachShape(c, s, R, strong) {
  if (!R.cells.length) return; reachPaths(R); const [x0, y0, x1, y1] = R.bb;
  if (view.px + x1 * s < 0 || view.py + y1 * s < 0 || view.px + x0 * s > W || view.py + y0 * s > H) return;
  const m = c.getTransform(); c.save(); c.setTransform(m.a * s, m.b, m.c, m.d * s, m.e + m.a * view.px, m.f + m.d * view.py);
  c.fillStyle = R.col; c.globalAlpha = strong ? 0.16 : 0.07; if (strong || s >= 6) c.fill(R.fp);
  if (R.watch && R.watch.length) { c.globalAlpha = 0.4; c.fill(R.wp); }
  c.strokeStyle = R.col; c.lineWidth = (strong ? 2 : 1.5) / s; c.globalAlpha = strong ? 0.95 : 0.6; c.setLineDash(R.kind === 'power' ? [] : [6 / s, 4 / s]); c.stroke(R.ep);
  if (strong && R.far) { c.globalAlpha = 0.6; c.lineWidth = 1.5 / s; c.setLineDash([3 / s, 4 / s]); c.stroke(R.xp); }
  c.restore();
  if (strong && s >= 7) {
    c.save(); const t = R.label + ' · ' + R.lv; c.globalAlpha = 1; c.font = `700 ${s < 14 ? 10 : 11}px ${BODY_FONT}`; c.textAlign = 'left'; c.textBaseline = 'top';
    const tw = c.measureText(t).width + 8, lx = Math.max(view.px + x0 * s, 2), ly = Math.max(view.py + y0 * s - 17, 2); c.fillStyle = R.col; roundRect(c, lx, ly, tw, 15, 4); c.fill(); c.fillStyle = '#fff'; c.fillText(t, lx + 4, ly + 2); c.restore();
  }
}
function drawReach(c, s) {
  const sel = selection && selection.obj && plan.objs.has(selection.obj.id) ? selection.obj : null;
  if (showReach) for (const ob of reachList()) if (ob !== sel) { const R = reachCached(ob); if (R) drawReachShape(c, s, R, false); }
  if (sel && hasReach(ITEMS[sel.i])) { const R = reachCached(sel); if (R) drawReachShape(c, s, R, true); }
}
