import { deleteDoc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'
import { useNanoIDStore } from '@/stores'

export async function create(data: string, type: M.Shorten.Type = 'attendance'): Promise<string> {
  const docId = nanoid(8)
  const hasData = await readByData(data)
  if (hasData) return hasData.docId
  await setDoc(doc('shortens', docId), { data, type, docId } as M.Shorten.Info)
  return docId
}

export async function createAttendanceCode(sessionId: string): Promise<string> {
  const data = `${useNanoIDStore().nanoid}${sessionId}${nanoid()}`
  return await create(data)
}

export async function read(docId: string): Promise<M.Shorten.Info | null> {
  const data = await getDoc(doc('shortens', docId))
  return data.exists() ? (data.data() as M.Shorten.Info) : null
}

export async function readByData(data: string): Promise<M.Shorten.Info | null> {
  const raws = await getDocs(query(collection('shortens'), where('data', '==', data)))
  return raws.docs.length ? (raws.docs[0].data() as M.Shorten.Info) : null
}

export async function remove(docId: string): Promise<void> {
  await deleteDoc(doc('shortens', docId))
}
