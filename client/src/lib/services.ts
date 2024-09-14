import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { type User } from 'firebase/auth'
import {
  collection as c,
  doc as d,
  type DocumentData,
  type DocumentReference,
  DocumentSnapshot,
  onSnapshot as oss
} from 'firebase/firestore'
import { ref } from 'vue'

import { auth, db } from '@/shared/firebase'
import type { Firebase } from '@/shared/types'

export const signOutService = () => {
  return signOut(auth)
}

export const signInService = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUpService = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const observeAuthState = (
  nextOrObserver: Firebase.NextOrObserver<User | null>,
  error?: Firebase.ErrorFn | undefined,
  completed?: Firebase.CompleteFn | undefined
): Firebase.Unsubscribe => {
  return onAuthStateChanged(auth, nextOrObserver, error, completed)
}

export const sendPasswordResetEmailService = (email: string) => {
  return sendPasswordResetEmail(auth, email)
}

export const updateDisplayName = (user: User, displayName: string) => {
  return updateProfile(user, { displayName })
}

export const getToken = () => {
  return new Promise<string | null>((resolve) => {
    const unsubscribe = observeAuthState(async (user) => {
      if (user) {
        resolve(await user.getIdToken())
      } else resolve(null)
      unsubscribe()
    })
  })
}

export const currentUser = () => {
  return auth.currentUser!
}

export const doc = (path: string, ...pathSegments: string[]) => d(db, path, ...pathSegments)
export const collection = (path: string, ...pathSegments: string[]) => c(db, path, ...pathSegments)

export function onSnapshot<AppModelType>(
  query: DocumentReference<AppModelType extends DocumentData ? any : any, any>
) {
  const snapshot = ref<DocumentSnapshot<AppModelType, any> | null>(null)
  const error = ref<Error | null>(null)

  const unsubscribe = oss(
    query,
    (_snapshot) => {
      snapshot.value = _snapshot
    },
    (_error) => {
      error.value = _error
    }
  )
  return { snapshot, error, unsubscribe }
}
