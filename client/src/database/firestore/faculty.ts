import { deleteDoc, getCountFromServer, getDoc, getDocs, query, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('faculties'))
  return count.data().count
}

export async function create(data: Omit<M.Faculty.Info, 'facultyId'>): Promise<void> {
  const id = nanoid()
  await setDoc(doc('faculties', id), { ...data, facultyId: id })
}

export async function read(id: string): Promise<M.Faculty.Info | null> {
  const data = await getDoc(doc('faculties', id))
  return data.exists() ? (data.data() as M.Faculty.Info) : null
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Faculty.Info[]> {
  const data = await getDocs(queries || collection('faculties'))
  return data.docs.map((doc) => doc.data() as M.Faculty.Info)
}

export async function update(id: string, data: M.Faculty.Info): Promise<void> {
  await setDoc(doc('faculties', id), data)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('faculties', id))
}
