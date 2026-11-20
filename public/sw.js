/* WeTask service worker：让这个每天都要打开的小站可以离线使用。 */
const VERSION = "wetask-v1";
const PRECACHE = ["/", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function put(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") return response;
  const copy = response.clone();
  caches.open(VERSION).then((cache) => cache.put(request, copy));
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // 打卡数据只在 localStorage，不经过网络；这里只处理页面与静态资源
  if (url.pathname.startsWith("/_next/webpack") || url.pathname.startsWith("/__nextjs")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => put(request, response))
        .catch(async () => (await caches.match(request)) || (await caches.match("/")) || Response.error()),
    );
    return;
  }

  const cacheable = ["script", "style", "image", "font", "manifest"];
  if (cacheable.includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => put(request, response))),
    );
  }
});
