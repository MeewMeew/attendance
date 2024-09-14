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
  const count = await getCountFromServer(collection('schedules'))
  return count.data().count
}

export async function create(data: M.Schedule.Base): Promise<string> {
  const id = nanoid()
  await setDoc(doc('schedules', id), { ...data, scheduleId: id })
  return id
}

export async function read(id: string): Promise<M.Schedule.Info | null> {
  const data = await getDoc(doc('schedules', id))
  return data.exists() ? (data.data() as M.Schedule.Info) : null
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Schedule.Info[]> {
  const data = await getDocs(queries || collection('schedules'))
  return data.docs.map((doc) => doc.data() as M.Schedule.Info)
}

export async function readByInstructorId(instructorId: string): Promise<M.Schedule.Info[]> {
  const data = await getDocs(
    query(collection('schedules'), where('instructorId', '==', instructorId))
  )
  return data.docs.map((doc) => doc.data() as M.Schedule.Info)
}

export async function readByRoomId(roomId: string): Promise<M.Schedule.Info[]> {
  const data = await getDocs(query(collection('schedules'), where('classroomId', '==', roomId)))
  return data.docs.map((doc) => doc.data() as M.Schedule.Info)
}

export async function readByClassId(classId: string): Promise<M.Schedule.Info[]> {
  const data = await getDocs(query(collection('schedules'), where('classId', '==', classId)))
  return data.docs.map((doc) => doc.data() as M.Schedule.Info)
}

export async function update(id: string, data: M.Schedule.Info): Promise<void> {
  await setDoc(doc('schedules', id), { ...data, scheduleId: id })
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('schedules', id))
}
