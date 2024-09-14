/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyBErSt7V6cMx_sU3DxkgUaB-wRW4vaThrk',
  authDomain: 'attendance-app-online.firebaseapp.com',
  databaseURL: 'https://attendance-app-online-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'attendance-app-online',
  storageBucket: 'attendance-app-online.appspot.com',
  messagingSenderId: '201445235845',
  appId: '1:201445235845:web:aa5dd8b99101bbafb9ddec',
  measurementId: 'G-FRYXRD3GKS'
})

const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})