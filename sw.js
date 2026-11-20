// Offline helper: keeps the planner on the device so it opens without internet. Version 9210665102
// Installs and background refreshes skip the browser's short-term copy, so a new release is picked up right away.
// Item pictures (pics/) and the Google sign-in code for sync (pinned version) go in caches that survive app updates.
const CACHE = 'pokopia-9210665102', PICS = 'pokopia-pics', LIB = 'pokopia-lib', FILES = ["./", "index.html", "data.json", "pics/index.json", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('pokopia-') && k !== CACHE && k !== PICS && k !== LIB).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin === 'https://www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) { // versioned, so the saved copy is always right
    e.respondWith(caches.open(LIB).then(async c => { const hit = await c.match(req); if (hit) return hit; const r = await fetch(req); if (r.ok) await c.put(req, r.clone()); return r; }));
    return;
  }
  if (url.origin !== location.origin && !fonts) return;
  if (url.origin === location.origin && /\/pics\/[^/]+\.webp$/.test(url.pathname)) {
    if (req.headers.get('x-pokopia-fill')) return; // the planner is saving pictures itself
    // a picture never changes under the same address (?v= changes instead), so the saved copy is always good
    e.respondWith(caches.open(PICS).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r.ok) await c.put(req, r.clone()); return r;
    }).catch(() => Response.error()));
    return;
  }
  // cached copy first (works offline), refreshed in the background when online
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(url.origin === location.origin ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || (req.mode === 'navigate' ? c.match('index.html') : Response.error());
  }));
});
