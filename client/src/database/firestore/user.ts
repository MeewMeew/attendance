import {
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { flattenObject } from '@/lib/misc'
import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('users'))
  return count.data().count
}

export async function create<T extends M.User.Role>(data: M.User.Info<T>): Promise<void> {
  const id = nanoid()
  await setDoc(doc('users', id), { ...data, docId: id })
}

export async function read<T extends M.User.Role = 'all'>(
  id: string
): Promise<M.User.Info<T> | null> {
  const data = await getDoc(doc('users', id))
  return data.exists() ? (data.data() as M.User.Info<T>) : null
}

export async function readByRole<T extends M.User.Role>(role: T): Promise<M.User.Info<T>[]> {
  const data = await getDocs(query(collection('users'), where('role', '==', role)))
  return data.docs.map((doc) => doc.data() as M.User.Info<T>)
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.User.Info[]> {
  const data = await getDocs(queries || collection('users'))
  return data.docs.map((doc) => doc.data() as M.User.Info)
}

export async function readByStudentId(studentId: string): Promise<M.User.Info<'student'> | null> {
  const data = await getDocs(query(collection('users'), where('studentId', '==', studentId)))
  return data.docs.length ? (data.docs[0].data() as M.User.Info<'student'>) : null
}

export async function update(id: string, data: M.User.Info): Promise<void> {
  await setDoc(doc('users', id), data)
}

export async function updateFlattened(id: string, data: Partial<M.User.Info>): Promise<void> {
  await updateDoc(doc('users', id), flattenObject(data))
}

export async function updateLogin(id: string, data: M.User.LoginInfo): Promise<void> {
  await updateDoc(doc('users', id), { loginInfo: data })
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('users', id))
}
