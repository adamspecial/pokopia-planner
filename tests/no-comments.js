const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const acorn = require('acorn');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'pics', 'towns', 'test-results', 'playwright-report']);
const found = [];
const at = (file, line, what) => found.push(path.relative(ROOT, file) + ':' + line + ': ' + what);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function jsComments(file, src, line0 = 1) {
  const opts = { ecmaVersion: 'latest', locations: true, allowHashBang: false, allowReturnOutsideFunction: true, onComment: (block, text, s, e, loc) => at(file, loc.line + line0 - 1, (block ? '/* */' : '//') + ' comment') };
  try { acorn.parse(src, Object.assign({ sourceType: 'script' }, opts)); }
  catch (e) {
    try { acorn.parse(src, Object.assign({ sourceType: 'module' }, opts)); }
    catch (e2) { at(file, ((e2.loc && e2.loc.line) || 1) + line0 - 1, 'could not be read as JavaScript: ' + e2.message); }
  }
}

function cssComments(file, src, line0 = 1) {
  const re = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\*/g;
  let m;
  while ((m = re.exec(src))) if (m[0] === '/*') at(file, src.slice(0, m.index).split('\n').length + line0 - 1, '/* */ comment');
}

function htmlComments(file, src) {
  const lineOf = i => src.slice(0, i).split('\n').length;
  const re = /<(script|style)\b[^>]*>([\s\S]*?)<\/\1>|<!--/gi;
  let m;
  while ((m = re.exec(src))) {
    if (m[0] === '<!--') { at(file, lineOf(m.index), '<!-- --> comment'); continue; }
    const body = m[2], start = m.index + m[0].indexOf('>') + 1, line = lineOf(start);
    if (m[1].toLowerCase() === 'style') cssComments(file, body, line);
    else if (!/type\s*=\s*["']?(application\/(ld\+)?json|importmap)/i.test(m[0])) jsComments(file, body, line);
  }
}

function yamlComments(file, src) {
  src.split('\n').forEach((l, i) => {
    const bare = l.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');
    if (/(^|\s)#/.test(bare)) at(file, i + 1, '# comment');
  });
}

const PY = String.raw`
import ast, io, sys, tokenize
for f in sys.argv[1:]:
    src = open(f, encoding='utf-8').read()
    for t in tokenize.generate_tokens(io.StringIO(src).readline):
        if t.type == tokenize.COMMENT:
            print('%s\t%d\t# comment' % (f, t.start[0]))
    for n in ast.walk(ast.parse(src)):
        if isinstance(n, ast.Expr) and isinstance(n.value, ast.Constant) and isinstance(n.value.value, str):
            print('%s\t%d\tdocstring' % (f, n.lineno))
`;

const files = walk(ROOT, []);
const py = [];
for (const f of files) {
  const ext = path.extname(f).toLowerCase(), src = () => fs.readFileSync(f, 'utf8');
  if (ext === '.js' || ext === '.mjs') jsComments(f, src());
  else if (ext === '.html') htmlComments(f, src());
  else if (ext === '.css') cssComments(f, src());
  else if (ext === '.yml' || ext === '.yaml') yamlComments(f, src());
  else if (ext === '.py') py.push(f);
  else if (ext === '.sh') yamlComments(f, src());
}
if (py.length) {
  const out = execFileSync('python3', ['-I', '-c', PY, ...py], { encoding: 'utf8' });
  for (const l of out.split('\n').filter(Boolean)) { const [f, line, what] = l.split('\t'); at(f, line, what); }
}
for (const f of found) console.log(f);
console.log(found.length ? found.length + ' comments found. The project keeps only code: remove them.' : 'No comments found.');
process.exit(found.length ? 1 : 0);
