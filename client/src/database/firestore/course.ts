import { deleteDoc, getCountFromServer, getDoc, getDocs, query, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('courses'))
  return count.data().count
}

export async function create(data: M.Course.Base): Promise<void> {
  const id = nanoid()
  await setDoc(doc('courses', id), { ...data, courseId: id })
}

export async function read(id: string): Promise<M.Course.Info | null> {
  const data = await getDoc(doc('courses', id))
  return data.exists() ? (data.data() as M.Course.Info) : null
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Course.Info[]> {
  const data = await getDocs(queries || collection('courses'))
  return data.docs.map((doc) => doc.data() as M.Course.Info)
}

export async function update(id: string, data: M.Course.Info): Promise<void> {
  await setDoc(doc('courses', id), data)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('courses', id))
}
