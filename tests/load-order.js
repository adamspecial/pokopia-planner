const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const list = html.match(/const APP_JS = \[([^\]]*)\]/);
if (!list) { console.log('index.html has no APP_JS list'); process.exit(1); }
const files = [...list[1].matchAll(/'([^']+)'/g)].map(m => 'js/' + m[1] + '.js');
const LAST = files.length - 1;

const DEFER = new Set(['atStart', 'addEventListener', 'removeEventListener', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'requestIdleCallback', 'queueMicrotask', 'then', 'catch', 'finally', 'observe', 'idle']);
const SCHED_ID = new Set(['addEventListener', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'requestIdleCallback', 'queueMicrotask', 'fetch', 'idle', 'requestDraw', 'renderPanel']);
const SCHED_MEM = new Set(['addEventListener', 'then', 'catch', 'finally', 'observe']);

const decl = new Map(), fnNode = new Map(), parsed = [];
const names = (p, out) => {
  if (!p) return;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => names(q.value || q.argument, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(e => names(e, out));
  else if (p.type === 'AssignmentPattern') names(p.left, out);
  else if (p.type === 'RestElement') names(p.argument, out);
};
files.forEach((f, fi) => {
  const ast = acorn.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'), { ecmaVersion: 'latest', sourceType: 'script', locations: true });
  parsed.push(ast);
  for (const s of ast.body) {
    const out = [];
    if (s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration') { out.push(s.id.name); if (s.type === 'FunctionDeclaration') fnNode.set(s.id.name, s); }
    if (s.type === 'VariableDeclaration') s.declarations.forEach(d => names(d.id, out));
    for (const n of out) decl.set(n, { fi, line: s.loc.start.line, fn: s.type === 'FunctionDeclaration' });
  }
});

function scan(n, out, now) {
  if (!n || typeof n.type !== 'string') return;
  if (/Function/.test(n.type) && !now.has(n)) return;
  if (n.type === 'Identifier') out.refs.push(n.name);
  if (n.type === 'CallExpression' || n.type === 'NewExpression') {
    const c = n.callee, nm = c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' && !c.computed ? c.property.name : '';
    if (c.type === 'Identifier') { out.calls.push(c.name); if (SCHED_ID.has(c.name)) out.sched.push(c.name); }
    if (n.type === 'NewExpression' && c.type === 'Identifier' && /Observer$|^Promise$/.test(c.name)) out.sched.push('new ' + c.name);
    if (c.type === 'MemberExpression' && !c.computed && SCHED_MEM.has(nm)) out.sched.push('.' + nm);
    if (/Function/.test(c.type)) now.add(c);
    if (!DEFER.has(nm)) for (const a of n.arguments) if (/Function/.test(a.type)) now.add(a);
  }
  if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed && /^on[a-z]+$/.test(n.left.property.name)) out.sched.push('.' + n.left.property.name + ' =');
  for (const k of Object.keys(n)) {
    if (k === 'loc') continue;
    if ((n.type === 'MemberExpression' && k === 'property' && !n.computed) || (n.type === 'Property' && k === 'key' && !n.computed)) continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach(x => scan(x, out, now)); else if (v && typeof v.type === 'string') scan(v, out, now);
  }
}
const memo = new Map();
function inFn(name) {
  if (!memo.has(name)) { const f = fnNode.get(name), out = { refs: [], calls: [], sched: [] }; scan(f.body, out, new Set()); memo.set(name, out); }
  return memo.get(name);
}

const bad = [];
parsed.forEach((ast, fi) => {
  for (const s of ast.body) {
    if (s.type === 'FunctionDeclaration' || (s.type === 'ExpressionStatement' && s.directive)) continue;
    const top = { refs: [], calls: [], sched: [] }; scan(s, top, new Set());
    const at = files[fi] + ':' + s.loc.start.line;
    const seen = new Set(), queue = top.refs.map(r => [r, [r], top.calls.includes(r)]);
    let sched = top.sched.slice();
    while (queue.length) {
      const [n, chain, called] = queue.shift(), key = n + (called ? '()' : '');
      if (seen.has(key)) continue; seen.add(key);
      const d = decl.get(n); if (!d) continue;
      if (d.fi > fi) { bad.push(at + ' uses ' + chain.join(' > ') + ' from ' + files[d.fi] + ', which has not loaded yet'); continue; }
      if (d.fn && called) { const r = inFn(n); sched = sched.concat(r.sched.map(x => chain.join(' > ') + ' ' + x)); for (const m of r.refs) queue.push([m, chain.concat(m), r.calls.includes(m)]); }
    }
    if (fi < LAST && sched.length) bad.push(at + ' schedules work while loading (' + sched[0] + '): wrap it in atStart(() => { ... }) so it starts once every file has loaded');
  }
});
for (const b of [...new Set(bad)]) console.log(b);
console.log(bad.length ? bad.length + ' load-order problems.' : 'Load order is safe: ' + files.length + ' files.');
process.exit(bad.length ? 1 : 0);
