const cacheName = "wedding-videos-1080p-v1";
const videoNames = new Set([
  "hero.mp4",
  "engagement.mp4",
  "carnival.mp4",
  "mehndi.mp4",
  "haldi.mp4",
]);
const scope = new URL(self.registration.scope);
const cachedPath = new URL("cached-video/", scope).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== scope.origin ||
    !url.pathname.startsWith(cachedPath)
  ) {
    return;
  }

  const name = url.pathname.slice(cachedPath.length);
  if (!videoNames.has(name)) return;
  event.respondWith(serveVideo(request, name));
});

async function serveVideo(request, name) {
  const original = new URL(`media/${name}?v=1080p`, scope);
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(original.href);
    if (!cached) return Response.redirect(original.href, 307);

    const range = request.headers.get("range");
    if (!range) return cached;

    const blob = await cached.blob();
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      return Response.redirect(original.href, 307);
    }

    const size = blob.size;
    const start = match[1]
      ? Number(match[1])
      : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Number(match[2]) : size - 1;
    if (start >= size || end < start || !Number.isSafeInteger(start)) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }

    const last = Math.min(end, size - 1);
    return new Response(blob.slice(start, last + 1), {
      status: 206,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(last - start + 1),
        "Content-Range": `bytes ${start}-${last}/${size}`,
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return Response.redirect(original.href, 307);
  }
}
