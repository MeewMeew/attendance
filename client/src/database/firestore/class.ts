import { deleteDoc, getCountFromServer, getDoc, getDocs, query, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('classes'))
  return count.data().count
}

export async function create(data: M.Class.Base): Promise<void> {
  const id = nanoid()
  await setDoc(doc('classes', id), { ...data, classId: id })
}

export async function read(id: string): Promise<M.Class.Info | null> {
  const data = await getDoc(doc('classes', id))
  return data.exists() ? (data.data() as M.Class.Info) : null
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Class.Info[]> {
  const data = await getDocs(queries || collection('classes'))
  return data.docs.map((doc) => doc.data() as M.Class.Info)
}

export async function update(id: string, data: M.Class.Info): Promise<void> {
  await setDoc(doc('classes', id), data)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('classes', id))
}
