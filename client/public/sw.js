const cacheName = 'attendance-v1'

// @ts-expect-error
const cacheClone = async (e) => {
  const res = await fetch(e.request)
  const resClone = res.clone()
  if (e.request.url.includes('firebase') ||
    e.request.url.includes('firestore') ||
    e.request.url.includes('googleapis') ||
    e.request.url.includes('gstatic') ||
    e.request.url.includes('google')
  ) return res

  const cache = await caches.open(cacheName)
  await cache.put(e.request, resClone)
  return res
}

self.addEventListener('fetch', (e) => {
  // @ts-expect-error
  e.respondWith(
    cacheClone(e)
      // @ts-expect-error
      .catch(() => caches.match(e.request))
      .then((res) => res)
  )
})

self.addEventListener('install', (event) =>
  // @ts-expect-error
  event.waitUntil(caches.open(cacheName)
    .then((cache) => cache.addAll([
      './']))
    // @ts-expect-error
    .then(self.skipWaiting())))

self.addEventListener('activate', (event) =>
  // @ts-expect-error
  event.waitUntil(self.clients.claim()))
