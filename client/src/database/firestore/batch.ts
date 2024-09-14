import {
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('batches'))
  return count.data().count
}

export async function create(data: M.Batch.Base): Promise<void> {
  const id = nanoid()
  if (await hasBatch(data.name)) {
    throw new Error('Batch already exists')
  }
  return await setDoc(doc('batches', id), { ...data, batchId: id })
}

export async function read(id: string): Promise<M.Batch.Info | null> {
  const data = await getDoc(doc('batches', id))
  return data.exists() ? (data.data() as M.Batch.Info) : null
}

export async function hasBatch(name: string): Promise<boolean> {
  const data = await getDocs(query(collection('batches'), where('name', '==', name)))
  return !data.empty
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Batch.Info[]> {
  const data = await getDocs(queries || collection('batches'))
  return data.docs.map((doc) => doc.data() as M.Batch.Info)
}

export async function update(id: string, data: M.Batch.Info): Promise<void> {
  await setDoc(doc('batches', id), data)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('batches', id))
}
