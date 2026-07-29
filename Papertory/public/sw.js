const buildId =
  new URL(self.location.href).searchParams.get("v")?.replace(/[^a-z0-9_-]/gi, "") ||
  "dev";
const scopeUrl = new URL("./", self.registration.scope);
const scopeKey = [...scopeUrl.pathname]
  .reduce((hash, char) => ((hash * 31 + char.charCodeAt(0)) >>> 0), 0)
  .toString(36);
const CACHE_PREFIX = `papertory-${scopeKey}-`;
const CACHE_NAME = `${CACHE_PREFIX}shell-${buildId}`;
const RUNTIME_CACHE_NAME = `${CACHE_PREFIX}runtime-${buildId}`;
const CURRENT_CACHES = new Set([CACHE_NAME, RUNTIME_CACHE_NAME]);
const RUNTIME_CACHE_LIMIT = 60;
const APP_SHELL = [
  "manifest.webmanifest",
  "papertory-icon.svg",
  "papertory-icon-192.png",
  "papertory-icon-512.png",
  "papertory-maskable-512.png",
  "papertory-apple-touch-icon.png",
];

const RUNTIME_CACHE_ORIGINS = new Set([
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://cdn.jsdelivr.net",
  "https://ik.imagekit.io",
  "https://img.hankyung.com",
]);
const inScope = (value) => {
  const url = new URL(value, scopeUrl);
  return url.origin === scopeUrl.origin && url.href.startsWith(scopeUrl.href);
};

const trimCache = async (cache, limit) => {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)));
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const indexUrl = new URL("index.html", scopeUrl);
      const response = await fetch(indexUrl, { cache: "reload" });
      const html = await response.clone().text();

      await Promise.all([
        cache.put(indexUrl, response.clone()),
        cache.put(scopeUrl, response.clone()),
      ]);

      const documentAssets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
        .map((match) => match[1])
        .filter((value) => !value.startsWith("data:") && !value.startsWith("#"))
        .map((value) => new URL(value, scopeUrl))
        .filter(inScope);

      let buildAssets = [];
      const buildManifestUrl = new URL("asset-manifest.json", scopeUrl);
      const manifestResponse = await fetch(buildManifestUrl, { cache: "reload" });
      if (!manifestResponse.ok) throw new Error("Papertory asset manifest unavailable");
      const manifest = await manifestResponse.clone().json();
      await cache.put(buildManifestUrl, manifestResponse);
      buildAssets = Object.values(manifest).flatMap((entry) => [
        entry.file,
        ...(entry.css || []),
        ...(entry.assets || []),
      ]);

      const shellAssets = [...APP_SHELL, ...buildAssets]
        .filter(Boolean)
        .map((value) => new URL(value, scopeUrl))
        .filter(inScope);
      await Promise.all(
        [...new Set([...documentAssets, ...shellAssets].map((url) => url.href))].map((url) =>
          cache.add(url),
        ),
      );

      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (name) =>
              (name.startsWith(CACHE_PREFIX) || name === "papertory-v1") &&
              !CURRENT_CACHES.has(name),
          )
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);

  if (request.mode === "navigate" && inScope(requestUrl)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response.ok) {
            await Promise.all([
              cache.put(request, response.clone()),
              cache.put(scopeUrl, response.clone()),
            ]);
          }
          return response;
        } catch {
          return (
            (await cache.match(request, { ignoreSearch: true })) ||
            (await cache.match(scopeUrl)) ||
            (await cache.match(new URL("index.html", scopeUrl))) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  const isLocal = inScope(requestUrl);
  if (!isLocal && !RUNTIME_CACHE_ORIGINS.has(requestUrl.origin)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(isLocal ? CACHE_NAME : RUNTIME_CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: isLocal });
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok || response.type === "opaque") {
        await cache.put(request, response.clone());
        if (!isLocal) await trimCache(cache, RUNTIME_CACHE_LIMIT);
      }
      return response;
    })(),
  );
});
