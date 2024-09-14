import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from 'firebase-admin/messaging'

export const app = initializeApp({ credential: credential.cert(JSON.parse(Bun.env.SERVICE_ACCOUNT as string)) })
export const db = getFirestore(app)
export const auth = getAuth(app)
export const messaging = getMessaging(app)