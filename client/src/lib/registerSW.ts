import { register } from 'register-service-worker'

// if (import.meta.env.PROD) {
register('/sw.js', {
  error(error) {
    console.error('Error during service worker registration:', error)
  },
})
register('/firebase-messaging-sw.js', {
  error(error) {
    console.error('Error during service worker registration:', error)
  },
})
// }