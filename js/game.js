'use strict';
const DAY_H = 5, DAY_MS = 86400000, TODAY_KEY = LSK + 'today', TIMER_KEY = LSK + 'timers', CLOCK_KEY = LSK + 'clock';
let guide = null, guideP = null, todayTick = 0, todayDayT = 0, timerT = 0, todayWas = '';
function loadGuide() {
  if (guide) return Promise.resolve(guide);
  if (!guideP) guideP = fetch('guide.json').then(r => r.ok ? r.json() : null).catch(() => null).then(d => { guide = d || { events: [], updates: [] }; return guide; });
  return guideP;
}
const clockOff = () => { const v = +LS.get(CLOCK_KEY); return Number.isFinite(v) ? v : 0; };
const gameNow = () => Date.now() + clockOff();
function dayStart(ts) { const d = new Date(ts); if (d.getHours() < DAY_H) d.setDate(d.getDate() - 1); d.setHours(DAY_H, 0, 0, 0); return d; }
function nextReset(ts) { const d = dayStart(ts); d.setDate(d.getDate() + 1); d.setHours(DAY_H, 0, 0, 0); return d.getTime(); }
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const dayKey = ts => ymd(dayStart(ts));
const atFive = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, DAY_H, 0, 0, 0).getTime(); };
const daysBetween = (a, b) => Math.round((dayStart(b).getTime() - dayStart(a).getTime()) / DAY_MS);
const fmtDay = (ts, o) => new Intl.DateTimeFormat(sayLocale(), Object.assign({ weekday: 'short', day: 'numeric', month: 'short' }, o)).format(new Date(ts));
const fmtTime = ts => new Intl.DateTimeFormat(sayLocale(), { hour: '2-digit', minute: '2-digit' }).format(new Date(ts));
function fmtLeft(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000)), hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
  return hh ? say('{h} h {m} min', { h: hh, m: String(mm).padStart(2, '0') }) : say('{m}:{s}', { m: mm, s: String(ss).padStart(2, '0') });
}
function bandOf(ts) {
  const hr = new Date(ts).getHours(), m = S.gMorning;
  return hr >= DAY_H && hr < m ? say('Morning') : hr >= m && hr < 17 ? say('Day') : hr >= 17 && hr < 19 ? say('Evening') : say('Night');
}
const DAILY = () => [
  { id: 'challenge', n: say('Daily challenge'), d: say('At the PC. Clearing it pays Life Coins, and 50% more on Fridays.') },
  { id: 'dream', n: say('Dream Island visit'), d: say('Show Drifloon a doll once a day. The island, and anything left on it, is gone at 05:00.') },
  { id: 'mosslax', n: say('Mosslax offering'), d: say('Once a day, and the boost lasts until 05:00. The main flavour picks it. Spicy: more habitat Pokémon. Sweet: more relics. Bitter: more ripples and honey. Dry: more Ho-Oh, Lugia and rare feathers. Sour: better shop stock.') },
  { id: 'stamp', n: say('Stamp card'), d: say('One stamp a day. The card pays out on Fridays.') },
  { id: 'center', n: say('Pokémon Center refill'), d: say('Refills Ditto\'s PP once a day.') },
  { id: 'drink', n: say('Vending machine drink'), d: say('A powered vending machine gives one drink a day.') },
];
function todayState() {
  let st = null; try { st = JSON.parse(LS.get(TODAY_KEY) || 'null'); } catch (e) { }
  if (!st || typeof st !== 'object') st = {};
  st.done = Array.isArray(st.done) ? st.done : []; st.own = Array.isArray(st.own) ? st.own.filter(o => o && o.id && o.n) : []; st.off = Array.isArray(st.off) ? st.off : [];
  const key = dayKey(gameNow()); if (st.day !== key) { st.day = key; st.done = []; }
  return st;
}
const todaySave = st => LS.set(TODAY_KEY, JSON.stringify(st));
function timersGet() { let t = null; try { t = JSON.parse(LS.get(TIMER_KEY) || 'null'); } catch (e) { } return Array.isArray(t) ? t.filter(x => x && x.id && Number.isFinite(x.end)) : []; }
const timersSave = t => { LS.set(TIMER_KEY, JSON.stringify(t)); timerArm(); };
function timerArm() {
  clearTimeout(timerT); const now = Date.now(), next = timersGet().filter(x => !x.rang && x.end > now).sort((a, b) => a.end - b.end)[0];
  const due = timersGet().filter(x => !x.rang && x.end <= now);
  if (due.length) { const all = timersGet(); for (const x of all) if (due.some(d => d.id === x.id)) x.rang = true; LS.set(TIMER_KEY, JSON.stringify(all)); for (const x of due) toast(say('{name} is done', { name: x.n }), 8000, null, 'timer' + x.id); if (S.buzz && navigator.vibrate) try { navigator.vibrate([120, 80, 120]); } catch (e) { } if (activeTab === 'game') renderGame(); }
  if (next) timerT = setTimeout(timerArm, Math.min(next.end - now + 50, 2 ** 31 - 1));
}
function timerAdd(n, ms) { const t = timersGet(); t.push({ id: uid(), n, end: Date.now() + ms }); timersSave(t); toast(say('Timer set: {name}, {left}', { name: n, left: fmtLeft(ms) })); renderGame(); }
function timerUntilReset(n) { timerAdd(n, nextReset(gameNow()) - gameNow()); }
function icsText(name, start, end, note) {
  const f = t => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const esc = s => String(s).replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pokopia Planner//EN', 'BEGIN:VEVENT', 'UID:' + uid() + '@pokopia-planner', 'DTSTAMP:' + f(Date.now()), 'DTSTART:' + f(start), 'DTEND:' + f(end), 'SUMMARY:' + esc(name), note ? 'DESCRIPTION:' + esc(note) : '', 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(name), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n') + '\r\n';
}
function icsSave(name, start, end, note) {
  const file = name.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 40) || 'pokopia';
  fileDownloads.save({ filename: file + '.ics', data: new Blob([icsText(name, start, end, note)], { type: 'text/calendar' }) });
  toast(say('Calendar file saved. Open it to add the reminder to your calendar.'), 4000);
}
function clockDialog() {
  const now = new Date(gameNow()), pad = n => String(n).padStart(2, '0');
  const val = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  let inp;
  modal(say('Console clock'), box => {
    inp = h('input', { type: 'datetime-local', id: 'clockAt', value: val, step: 60 });
    box.append(h('p', { class: 'sub' }, say('If your console shows a different date or time from this device, enter what the console shows. The countdown and the daily list then follow the console.')),
      h('div', { class: 'field' }, h('label', { for: 'clockAt' }, say('The console shows')), inp),
      h('div', { class: 'acts' }, h('button', { class: 'btn sm', type: 'button', onclick: () => { LS.del(CLOCK_KEY); closeModal(); todayRefresh(); toast(say('The console clock matches this device')); } }, say('Same as this device'))));
  }, say('Save'), () => {
    const t = new Date(inp.value).getTime(); if (!Number.isFinite(t)) { toast(say('Enter a date and time')); return false; }
    const off = Math.round((t - Date.now()) / 60000) * 60000;
    if (Math.abs(off) < 60000) LS.del(CLOCK_KEY); else LS.set(CLOCK_KEY, String(off));
    todayRefresh();
  });
}
function furnaceDialog() {
  let n, kind;
  modal(say('Furnace timer'), box => {
    n = h('input', { type: 'number', id: 'fnN', min: 1, max: 999, step: 1, value: 10 });
    kind = h('select', { id: 'fnK' }, h('option', { value: '4' }, say('Furnace, about 4 minutes an item')), h('option', { value: '2' }, say('Metallic furnace, about 2 minutes an item')));
    box.append(h('div', { class: 'field' }, h('label', { for: 'fnN' }, say('Items in the batch')), n), h('div', { class: 'field' }, h('label', { for: 'fnK' }, say('Furnace')), kind),
      h('p', { class: 'note' }, say('Times are from guides, not measured.')));
  }, say('Start'), () => {
    const k = Math.round(+n.value); if (!(k >= 1 && k <= 999)) { toast(say('Enter 1 to 999 items')); return false; }
    timerAdd(sayN('Furnace, {n} item', 'Furnace, {n} items', k), k * +kind.value * 60000);
  });
}
function customTimerDialog() {
  let n, m;
  modal(say('New timer'), box => {
    n = h('input', { id: 'tmN', value: say('Timer'), maxlength: 60 });
    m = h('input', { type: 'number', id: 'tmM', min: 1, max: 10080, step: 1, value: 30 });
    box.append(h('div', { class: 'field' }, h('label', { for: 'tmN' }, say('Name')), n), h('div', { class: 'field' }, h('label', { for: 'tmM' }, say('Minutes')), m));
  }, say('Start'), () => {
    const k = Math.round(+m.value); if (!(k >= 1 && k <= 10080)) { toast(say('Enter 1 to 10,080 minutes')); return false; }
    timerAdd(n.value.trim() || say('Timer'), k * 60000);
  });
}
function ownItemDialog(st) {
  let n;
  modal(say('Add to the daily list'), box => {
    n = h('input', { id: 'ownN', maxlength: 80, placeholder: say('Something you do every day') });
    box.append(h('div', { class: 'field' }, h('label', { for: 'ownN' }, say('What to do')), n));
  }, say('Add'), () => {
    const v = n.value.trim(); if (!v) { toast(say('Write what to do')); return false; }
    st.own.push({ id: 'own-' + uid(), n: v }); todaySave(st); renderGame();
  });
}
function todayRefresh() { renderGame(); todayArm(); }
function todayArm() {
  clearTimeout(todayDayT); const ms = nextReset(gameNow()) - gameNow();
  todayDayT = setTimeout(() => { todayWas = ''; toast(say('It\'s 05:00 in the game: a new day, and the daily list is fresh')); todayRefresh(); }, Math.min(ms + 500, 2 ** 31 - 1));
}
function eventsNow(now) {
  const g = guide || { events: [], updates: [] }, out = { on: [], soon: [] };
  for (const e of g.events || []) { const a = atFive(e.from), b = atFive(e.to); if (now >= a && now < b) out.on.push(Object.assign({ a, b }, e)); else if (now < a && a - now < 45 * DAY_MS) out.soon.push(Object.assign({ a, b }, e)); }
  for (const u of g.updates || []) { const a = atFive(u.on); if (now < a + DAY_MS && a - now < 60 * DAY_MS) out.soon.push(Object.assign({ a, up: true }, u)); }
  out.soon.sort((x, y) => x.a - y.a);
  return out;
}
function renderGame() {
  const root = $('#tab-game'); if (!root) return;
  const keep = root.scrollTop; root.textContent = '';
  if (!guide) { root.append(h('p', { class: 'note' }, say('Loading…'))); loadGuide().then(() => { if (activeTab === 'game') renderGame(); }); return; }
  const now = gameNow(), st = todayState(), wd = dayStart(now).getDay(), reset = nextReset(now);
  todayWas = st.day; todaySave(st);
  root.append(h('h2', { class: 'hrow' }, say('Today'), tipBtn(say('The game\'s day changes at 05:00 on the console clock. The daily list clears itself then. It\'s kept on this device.'))));
  const off = clockOff();
  root.append(h('div', { class: 'card today' },
    h('div', { class: 'tday' }, h('span', { class: 'big', id: 'tdLeft' }, fmtLeft(reset - now)), h('span', { class: 'note' }, say('until 05:00, when the game\'s day changes'))),
    h('div', { class: 'acts', style: 'align-items:center' }, h('span', { class: 'chip', id: 'tdNow' }, bandOf(now) + ' · ' + fmtDay(now) + ' ' + fmtTime(now)),
      h('button', { class: 'btn sm', type: 'button', onclick: clockDialog, 'data-tip': say('Set this if your console shows a different time from this device') }, icon('clock'), off ? say('Console clock: {d}', { d: (off > 0 ? '+' : '−') + fmtLeft(Math.abs(off)) }) : say('Console clock')))));
  const list = h('div', { class: 'list' }), items = DAILY().filter(x => !st.off.includes(x.id)).concat(st.own.map(o => ({ id: o.id, n: o.n, own: true })));
  let doneN = 0;
  for (const it of items) {
    const on = st.done.includes(it.id); if (on) doneN++;
    const box = h('input', { type: 'checkbox', checked: on ? '' : null, onchange: e => { const s = todayState(); s.done = s.done.filter(x => x !== it.id); if (e.target.checked) s.done.push(it.id); todaySave(s); renderGame(); } });
    list.append(h('div', { class: 'dl' + (on ? ' done' : '') }, h('label', { class: 'toggle' }, box, h('span', null, it.n)), it.d ? tipBtn(it.d) : '',
      ibtn(it.own ? 'trash' : 'eyeoff', it.own ? say('Remove {name}', { name: it.n }) : say('Hide {name}', { name: it.n }), () => { const s = todayState(); if (it.own) s.own = s.own.filter(o => o.id !== it.id); else s.off.push(it.id); s.done = s.done.filter(x => x !== it.id); todaySave(s); renderGame(); }, 'sm')));
  }
  if (!items.length) list.append(h('p', { class: 'note' }, say('The list is empty.')));
  const hiddenN = st.off.length;
  root.append(h('h3', { class: 'hrow' }, say('Every day'), h('span', { class: 'note' }, say('{done} of {all} done', { done: doneN, all: items.length }))), list,
    h('div', { class: 'acts' }, h('button', { class: 'btn sm', type: 'button', onclick: () => ownItemDialog(todayState()) }, icon('plus'), say('Add your own')), hiddenN ? h('button', { class: 'btn sm', type: 'button', onclick: () => { const s = todayState(); s.off = []; todaySave(s); renderGame(); } }, sayN('Show {n} hidden', 'Show {n} hidden', hiddenN)) : ''));
  const wk = h('div', { class: 'list' });
  const fri = (5 - wd + 7) % 7, sun = (7 - wd) % 7;
  wk.append(h('p', { class: 'wk' + (fri ? '' : ' now') }, fri ? sayN('Friday payouts tomorrow: the daily challenge pays 50% more and the stamp card pays out.', 'Friday payouts in {n} days: the daily challenge pays 50% more and the stamp card pays out.', fri) : say('Friday: the daily challenge pays 50% more coins today, and the stamp card pays out.')));
  wk.append(h('p', { class: 'wk' + (sun ? '' : ' now') }, sun ? sayN('Lucky Day tomorrow: more ripples and dropped items.', 'Lucky Day on Sunday, in {n} days: more ripples and dropped items.', sun) : say('Lucky Day: more ripples and dropped items today.')));
  root.append(h('h3', null, say('This week')), wk);
  const ev = eventsNow(now), evl = h('div', { class: 'list' });
  for (const e of ev.on) {
    const left = daysBetween(now, e.b - 1) + 1;
    evl.append(h('div', { class: 'card' }, h('div', { class: 'hd' }, h('b', null, e.n), h('span', { class: 'chip warn', style: 'margin-left:auto' }, sayN('{n} day left', '{n} days left', left))),
      h('div', { class: 'note' }, say('Ends {when}', { when: fmtDay(e.b) + ' ' + fmtTime(e.b - 60000) }) + (e.pk.length ? ' · ' + e.pk.join(', ') : '') + (e.cur ? ' · ' + say('Currency: {c}', { c: e.cur }) : '')),
      e.pk.length ? h('div', { class: 'note' }, say('Its Pokémon stay after the event, but no Pokémon event has come back so far, and its habitat parts can\'t be bought afterwards.')) : '',
      h('div', { class: 'acts' }, h('button', { class: 'btn sm', type: 'button', onclick: () => icsSave(say('{name} ends tomorrow', { name: e.n }), e.b - DAY_MS - off, e.b - DAY_MS - off + 3600000, say('Ends {when}', { when: fmtDay(e.b) + ' ' + fmtTime(e.b - 60000) })) }, icon('clock'), say('Remind me the day before')))));
  }
  for (const e of ev.soon) {
    const inN = daysBetween(now, e.a);
    evl.append(h('div', { class: 'card' }, h('div', { class: 'hd' }, h('b', null, e.n), h('span', { class: 'chip', style: 'margin-left:auto' }, inN <= 0 ? say('Today') : sayN('In {n} day', 'In {n} days', inN))),
      h('div', { class: 'note' }, (e.up ? say('Comes out {when}', { when: fmtDay(e.a, { year: 'numeric' }) }) : say('Starts {when}', { when: fmtDay(e.a) + ' ' + fmtTime(e.a) })))));
  }
  if (!evl.children.length) evl.append(h('p', { class: 'note' }, say('No event is on right now, and none has been announced.')));
  root.append(h('h3', { class: 'hrow' }, say('Events'), tipBtn(say('From official announcements and guides. Events start at 05:00 and end at 04:59 on the console clock, and since Wish Upon a Jirachi they check the real date online.'))), evl);
  const tl = h('div', { class: 'list' }), timers = timersGet().sort((a, b) => a.end - b.end), rn = Date.now();
  for (const x of timers) {
    const done = x.end <= rn;
    tl.append(h('div', { class: 'dl' + (done ? ' done' : '') }, h('span', { class: 'tmn' }, x.n), h('span', { class: 'chip' + (done ? ' good' : ''), 'data-end': done ? null : x.end }, done ? say('Done') : fmtLeft(x.end - rn)),
      done ? '' : ibtn('clock', say('Add {name} to your calendar', { name: x.n }), () => icsSave(x.n, x.end, x.end + 60000), 'sm'),
      ibtn('close', done ? say('Clear {name}', { name: x.n }) : say('Stop {name}', { name: x.n }), () => { timersSave(timersGet().filter(y => y.id !== x.id)); renderGame(); }, 'sm')));
  }
  if (!timers.length) tl.append(h('p', { class: 'note' }, say('No timers running. A notice shows when one finishes while the planner is open; add it to your calendar to be told when it\'s closed.')));
  root.append(h('h3', null, say('Timers')), tl, h('div', { class: 'acts' },
    h('button', { class: 'btn sm', type: 'button', onclick: () => timerAdd(say('Kit, 15 minutes'), 15 * 60000) }, say('Kit, 15 min')),
    h('button', { class: 'btn sm', type: 'button', onclick: () => timerAdd(say('Kit, 1 hour'), 3600000) }, say('Kit, 1 hour')),
    h('button', { class: 'btn sm', type: 'button', onclick: () => timerUntilReset(say('Kit, ready the next day')) }, say('Kit, next day')),
    h('button', { class: 'btn sm', type: 'button', onclick: furnaceDialog }, say('Furnace…')),
    h('button', { class: 'btn sm', type: 'button', onclick: () => timerAdd(say('Berry tree full'), 3 * 3600000), 'data-tip': say('A berry tree grows 1 berry an hour, up to 3') }, say('Berry tree')),
    h('button', { class: 'btn sm', type: 'button', onclick: customTimerDialog }, say('Other…'))));
  root.scrollTop = keep;
  todayTicks();
}
function todayTicks() {
  clearInterval(todayTick);
  todayTick = setInterval(() => {
    if (activeTab !== 'game' || document.hidden) return;
    const now = gameNow(), el = document.getElementById('tdLeft'); if (!el) { clearInterval(todayTick); return; }
    if (dayKey(now) !== todayWas) { renderGame(); return; }
    el.textContent = fmtLeft(nextReset(now) - now);
    const nw = document.getElementById('tdNow'); if (nw) nw.textContent = bandOf(now) + ' · ' + fmtDay(now) + ' ' + fmtTime(now);
    const rn = Date.now(); for (const c of document.querySelectorAll('#tab-game [data-end]')) { const e = +c.dataset.end; if (e <= rn) { renderGame(); return; } c.textContent = fmtLeft(e - rn); }
  }, 1000);
}
atStart(() => { timerArm(); todayArm(); addEventListener('visibilitychange', () => { if (!document.hidden) { timerArm(); todayArm(); if (activeTab === 'game') renderGame(); } }); });
