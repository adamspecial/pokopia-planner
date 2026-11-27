const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const ROOT = path.resolve(__dirname, '..'), CAT = path.join(ROOT, 'strings', 'en.json'), BASE = path.join(__dirname, 'strings-baseline.json');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.match(/const APP_JS = \[([^\]]*)\]/)[1].matchAll(/'([^']+)'/g)].map(m => 'js/' + m[1] + '.js');
const PROSE = /[A-Za-z]{2,}.*\s|^[A-Z][a-z]+$|[a-z][.:!?…]$/;
const CODE = /^--|^[#.\[]|^(https?:|data:|image\/|text\/|application\/)|^[\w-]+\.(js|json|png|webp|svg)$|[a-z-]+:[^;]*;|^[a-z][a-z0-9-]*$/;
const cat = {}, bad = [], count = {};
const add = (s, where, one) => { const e = cat[s] || (cat[s] = { in: [] }); if (one) e.one = one; if (!e.in.includes(where)) e.in.push(where); };
const entry = e => e.one ? { one: e.one, in: e.in } : e.in;
const lit = n => n && n.type === 'Literal' && typeof n.value === 'string' ? n.value : n && n.type === 'TemplateLiteral' && !n.expressions.length ? n.quasis[0].value.cooked : null;
function walk(n, parent, f) {
  if (!n || typeof n.type !== 'string') return;
  if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && (n.callee.name === 'say' || n.callee.name === 'sayN')) {
    const a = lit(n.arguments[0]), b = n.callee.name === 'sayN' ? lit(n.arguments[1]) : null, at = f + ':' + n.loc.start.line;
    if (a == null || (n.callee.name === 'sayN' && b == null)) bad.push(at + ': ' + n.callee.name + '() needs its text written out, so it can be listed for translation');
    else if (n.callee.name === 'sayN') add(b, f, a); else add(a, f);
    n.arguments.forEach((x, i) => { if (i > (n.callee.name === 'sayN' ? 1 : 0)) walk(x, n, f); });
    return;
  }
  const s = lit(n);
  if (s != null && !(parent && parent.type === 'Property' && parent.key === n) && PROSE.test(s) && !CODE.test(s)) count[f] = (count[f] || 0) + 1;
  for (const k of Object.keys(n)) { if (k === 'loc') continue; const v = n[k]; if (Array.isArray(v)) v.forEach(x => walk(x, n, f)); else if (v && typeof v.type === 'string') walk(v, n, f); }
}
for (const f of files.filter(x => x !== 'js/strings.js')) { count[f] = 0; walk(acorn.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'), { ecmaVersion: 'latest', locations: true }), null, f); }
const body = html.slice(html.indexOf('<body'));
for (const m of body.matchAll(/<([a-z0-9]+)((?:\s+[a-zA-Z-]+(?:="[^"]*")?)*)\s*>/g)) {
  const attrs = m[2];
  if (/\sdata-say(\s|$)/.test(attrs + ' ')) {
    const end = body.indexOf('</' + m[1] + '>', m.index), inner = body.slice(m.index + m[0].length, end).replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '\n');
    for (const x of inner.split('\n').map(q => q.trim()).filter(Boolean)) add(x, 'index.html');
  }
  const want = (attrs.match(/\sdata-say-attr="([^"]*)"/) || [])[1];
  if (want) for (const a of want.split(' ')) { const v = attrs.match(new RegExp('\\s' + a + '="([^"]*)"')); if (v) add(v[1], 'index.html'); else bad.push('index.html: ' + a + ' is listed in data-say-attr but the element has no ' + a); }
}
const text = '{\n' + Object.keys(cat).sort((a, b) => a.localeCompare(b, 'en')).map(k => ' ' + JSON.stringify(k) + ': ' + JSON.stringify(entry(cat[k]))).join(',\n') + '\n}\n';
if (process.argv.includes('--write')) { fs.mkdirSync(path.dirname(CAT), { recursive: true }); fs.writeFileSync(CAT, text); }
else if (!fs.existsSync(CAT) || fs.readFileSync(CAT, 'utf8') !== text) bad.push('strings/en.json is out of date: run node strings.js --write in tests/');
const was = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : {};
const first = !fs.existsSync(BASE);
for (const [f, n] of Object.entries(count)) if (!first && n > (was[f] || 0)) bad.push(f + ' has ' + n + ' pieces of on-screen text outside say(), ' + (was[f] || 0) + ' before. Wrap new text in say() or sayN().');
if (process.argv.includes('--write') && !bad.length) fs.writeFileSync(BASE, JSON.stringify(Object.fromEntries(Object.entries(count).map(([f, n]) => [f, first ? n : Math.min(n, was[f] || 0)])), null, 1) + '\n');
for (const b of bad) console.log(b);
const left = Object.values(count).reduce((a, b) => a + b, 0);
console.log(bad.length ? bad.length + ' problems.' : Object.keys(cat).length + ' pieces of text listed in strings/en.json; about ' + left + ' still to move.');
process.exit(bad.length ? 1 : 0);
