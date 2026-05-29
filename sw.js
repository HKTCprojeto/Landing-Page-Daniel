/* ════════════════════════════════════════════════════════════════════
   Service Worker — Executive Import Program
   Estratégia:
   - Shell HTML/CSS/JS: stale-while-revalidate (rápido + atualiza)
   - Imagens estáticas: cache-first
   - Vídeos e API Supabase: network-only (não cacheia conteúdo dinâmico)
   ════════════════════════════════════════════════════════════════════ */
const VERSION       = 'eip-v3-2026-05-29';
const SHELL_CACHE   = `${VERSION}-shell`;
const IMAGE_CACHE   = `${VERSION}-images`;

const SHELL_URLS = [
  '/',
  '/Landing.html',
  '/dashboard.html',
  '/login.html',
  '/cadastro.html',
  '/landing-eip.html',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_URLS).catch(()=>{}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Supabase API / Storage / qualquer chamada externa → network-only */
  if (url.hostname.includes('supabase.co') ||
      url.hostname.includes('youtube.com') ||
      url.hostname.includes('youtu.be')   ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com')    ||
      url.hostname.includes('jsdelivr.net')) {
    return;
  }

  /* Vídeos locais → network-only (são pesados, cache não vale a pena) */
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) {
    return;
  }

  /* Imagens → cache-first */
  if (/\.(png|jpe?g|webp|gif|svg|ico)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch { return cached || Response.error(); }
    })());
    return;
  }

  /* HTML/CSS/JS do shell → stale-while-revalidate */
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache  = await caches.open(SHELL_CACHE);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then(res => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
  }
});
