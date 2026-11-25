/* Bộ nhớ đệm riêng cho từng đường dẫn GitHub Pages. */
const APP_SCOPE = self.registration.scope;
const scopeURL = file => new URL(file, APP_SCOPE).href;
const CACHE_PREFIX = 'lich-truc-kcb:' + APP_SCOPE + ':';
const SHELL = CACHE_PREFIX + 'visual-2.1.4-shell';
const MEDIA = CACHE_PREFIX + 'visual-2.1.1-media';
const MEDIA_LIMIT = 144;
const INDEX = scopeURL('index.html');
const APP_PATH = new URL(APP_SCOPE).pathname;
const INDEX_PATH = new URL(INDEX).pathname;
const CORE = [
  'index.html', 'css/style.css', 'css/themes.css', 'manifest.webmanifest',
  'js/firebase-config.js', 'js/lunar.js', 'js/theme-registry.js',
  'js/annual-leave.js', 'js/theme-engine.js', 'js/greetings.js', 'js/event-icons.js',
  'js/app.js', 'js/cloud.js', 'js/pwa.js',
  'vendor/firebase/firebase-app-compat.js', 'vendor/firebase/firebase-auth-compat.js',
  'vendor/firebase/firebase-firestore-compat.js',
  'assets/illustrations/logo/icon-192.png', 'assets/illustrations/logo/icon-512.png',
  'assets/illustrations/logo/apple-touch-icon.png', 'assets/illustrations/logo/maskable-512.png',
  'assets/illustrations/icons/calendar-check.svg', 'assets/illustrations/icons/calendar-days.svg',
  'assets/illustrations/icons/settings.svg', 'assets/illustrations/icons/sparkles.svg',
  'assets/illustrations/icons/user-round.svg', 'assets/illustrations/decor/memo.webp',
  'assets/illustrations/decor/stethoscope.webp', 'assets/illustrations/seasonal/xuan.webp',
  'assets/illustrations/seasonal/ha.webp', 'assets/illustrations/themes/thu.webp',
  'assets/illustrations/seasonal/dong.webp'
].map(scopeURL);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await cache.addAll(CORE.map(url => new Request(url, {cache:'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(CACHE_PREFIX) && name !== SHELL && name !== MEDIA) {
        await caches.delete(name);
      }
      if (name === 'lich-truc-visual-v7') {
        const cache = await caches.open(name);
        for (const req of await cache.keys()) {
          const inScope = req.url === APP_SCOPE || CORE.includes(req.url)
            || req.url.startsWith(scopeURL('assets/illustrations/'))
            || req.url === scopeURL('js/decor.js');
          if (inScope) await cache.delete(req);
        }
        if (!(await cache.keys()).length) await caches.delete(name);
      }
    }
    await self.clients.claim();
  })());
});

async function artwork(request) {
  const cache = await caches.open(MEDIA);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request, {cache:'no-cache'});
    if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
      try {
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        await Promise.all(keys.slice(0,Math.max(0,keys.length-MEDIA_LIMIT)).map(key => cache.delete(key)));
      } catch (_) { /* Vẫn trả ảnh khi bộ nhớ đã đầy. */ }
    }
    return response;
  } catch (_) {
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(APP_SCOPE)) return;
  const url = new URL(request.url);
  if (request.mode === 'navigate' && (url.pathname === APP_PATH || url.pathname === INDEX_PATH)) {
    event.respondWith(caches.open(SHELL).then(cache => cache.match(INDEX)).then(hit => hit || fetch(request)));
  } else if (CORE.includes(url.href)) {
    event.respondWith(caches.open(SHELL).then(cache => cache.match(request)).then(hit => hit || fetch(request)));
  } else if (url.href.startsWith(scopeURL('assets/illustrations/')) && /\.(webp|png|svg)$/i.test(url.pathname)) {
    event.respondWith(artwork(request));
  }
});
