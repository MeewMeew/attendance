
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'
import { onBackgroundMessage } from 'firebase/messaging/sw'

const cacheName = 'attendance-v1'
const app = initializeApp({ 'apiKey': 'AIzaSyBErSt7V6cMx_sU3DxkgUaB-wRW4vaThrk', 'authDomain': 'attendance-app-online.firebaseapp.com', 'projectId': 'attendance-app-online', 'storageBucket': 'attendance-app-online.appspot.com', 'messagingSenderId': '201445235845', 'appId': '1:201445235845:web:aa5dd8b99101bbafb9ddec', 'measurementId': 'G-FRYXRD3GKS' })
const messaging = getMessaging(app)

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

onBackgroundMessage(messaging, (payload) => {
  // @ts-expect-error
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    // @ts-expect-error
    body: payload.notification.body,
    // @ts-expect-error
    icon: payload.notification.icon
  }
  // @ts-expect-error
  self.registration.showNotification(notificationTitle, notificationOptions)
})