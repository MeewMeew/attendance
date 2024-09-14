import {
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  setDoc,
  where
} from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

import { Schedule } from '..'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('classes'))
  return count.data().count
}

export async function create(data: M.Classroom.Info): Promise<void> {
  const id = data.classroomId || nanoid()
  await setDoc(doc('classrooms', id), { ...data, classroomId: id })
}

export async function read(id: string): Promise<M.Classroom.Info | null> {
  const data = await getDoc(doc('classrooms', id))
  return data.exists() ? (data.data() as M.Classroom.Info) : null
}

export async function hasClassroom(name: string): Promise<boolean> {
  const q = query(collection('classrooms'), where('name', '==', name))
  const data = await getDocs(q)
  return !data.empty
}

export async function readAll(
  filter?: QueryCompositeFilterConstraint,
  ...queries: QueryConstraint[]
): Promise<M.Classroom.Info[]>
export async function readAll(...queries: QueryConstraint[]): Promise<M.Classroom.Info[]>

export async function readAll(
  arg1?: QueryCompositeFilterConstraint | QueryConstraint,
  ...arg2: QueryConstraint[]
): Promise<M.Classroom.Info[]> {
  let queries: QueryConstraint[] = []
  if (arg1) {
    if (typeof arg1 === 'function') {
      queries = [arg1, ...arg2]
    } else {
      queries = arg2
    }
  } else {
    queries = arg2
  }
  const data = await getDocs(query(collection('classrooms'), ...queries))
  return data.docs.map((doc) => doc.data() as M.Classroom.Info)
}

export async function update(id: string, data: M.Classroom.Info): Promise<void> {
  await setDoc(doc('classrooms', id), data)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('classrooms', id))
}

export async function sync(id: string, id2: string) {
  const data = await read(id)
  if (!data) return console.error('Classroom not found')
  await create({ ...data, classroomId: id2 })
  await Schedule.readByRoomId(id).then(async (schedules) => {
    if (schedules[0]) {
      await Schedule.update(schedules[0].scheduleId, { ...schedules[0], classroomId: id2 })
    }
  })
  await remove(id)
}
