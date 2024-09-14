import { initializeApp } from 'firebase/app'
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, type Messaging } from 'firebase/messaging'
import { getStorage } from 'firebase/storage'

let messaging: Messaging
const firebaseConfig = import.meta.env['VITE_FIREBASE_CONFIG']
export const app = initializeApp(JSON.parse(firebaseConfig))
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

try {
  messaging = getMessaging(app)
} catch (error) {
  console.log('FCM does not support this browser!')
}

export { messaging }
