'use strict';
const TR = {};
let LANG = 'en';
const PLURALS = new Map();
function pluralOf(n) { let p = PLURALS.get(LANG); if (!p) { p = new Intl.PluralRules(LANG); PLURALS.set(LANG, p); } return p.select(n); }
function sayFill(s, v) { return v ? s.replace(/\{(\w+)\}/g, (m, k) => v[k] == null ? m : typeof v[k] === 'number' ? v[k].toLocaleString(LANG) : String(v[k])) : s; }
function say(s, v) { const o = TR[LANG] && TR[LANG][s]; return sayFill(typeof o === 'string' ? o : s, v); }
function sayN(one, other, n, v) {
  const o = TR[LANG] && TR[LANG][other], f = pluralOf(n);
  const s = o && typeof o === 'object' ? o[f] || o.other : f === 'one' ? one : other;
  return sayFill(s, Object.assign({ n }, v));
}
function sayPage(root) {
  if (!TR[LANG]) return;
  for (const el of root.querySelectorAll('[data-say]')) for (const c of el.childNodes) { const s = c.nodeType === 3 ? c.textContent.trim() : ''; if (s) c.textContent = c.textContent.replace(s, say(s)); }
  for (const el of root.querySelectorAll('[data-say-attr]')) for (const a of el.dataset.sayAttr.split(' ')) if (el.hasAttribute(a)) el.setAttribute(a, say(el.getAttribute(a)));
}
sayPage(document);
