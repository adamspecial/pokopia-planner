const CACHE = 'pokopia-1795478100', PICS = 'pokopia-pics', LIB = 'pokopia-lib', FILES = ["./", "index.html", "data.json", "pics/index.json", "manifest.webmanifest", "app.js", "map3d.js", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('pokopia-') && k !== CACHE && k !== PICS && k !== LIB).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin === 'https://www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith(caches.open(LIB).then(async c => { const hit = await c.match(req); if (hit) return hit; const r = await fetch(req); if (r.ok) await c.put(req, r.clone()); return r; }));
    return;
  }
  if (url.origin !== location.origin && !fonts) return;
  if (url.origin === location.origin && /\/pics\/((top|pk)\/)?[^/]+\.webp$/.test(url.pathname)) {
    if (req.headers.get('x-pokopia-fill')) return;
    e.respondWith(caches.open(PICS).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r.ok) await c.put(req, r.clone()); return r;
    }).catch(() => Response.error()));
    return;
  }
  const key = url.origin === location.origin ? url.origin + url.pathname : req;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(key);
    const same = (a, b) => ['etag', 'last-modified'].some(k => a.headers.get(k) && a.headers.get(k) === b.headers.get(k));
    const net = fetch(url.origin === location.origin ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : req).then(r => { if (r && (r.ok || r.type === 'opaque') && !(hit && same(hit, r))) c.put(key, r.clone()); return r; }).catch(() => null);
    return hit || (await (fonts ? Promise.race([net, new Promise(r => setTimeout(r, 6000, null))]) : net)) || (req.mode === 'navigate' ? c.match('index.html') : Response.error());
  }));
});
