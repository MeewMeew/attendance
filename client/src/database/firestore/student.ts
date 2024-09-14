import {
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'

import { Batch, Class, Faculty } from '@/database'
import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(query(collection('users'), where('role', '==', 'student')))
  return count.data().count
}

export async function getCountBy(key: string, value: string): Promise<number> {
  const count = await getCountFromServer(
    query(collection('users'), where(key, '==', value), where('role', '==', 'student'))
  )
  return count.data().count
}

export async function read(docId: string): Promise<M.Student.Base | null> {
  const data = await getDoc(doc('users', docId))
  return data.exists() ? (data.data() as M.Student.Base) : null
}

export async function readByStudentId(studentId: string): Promise<M.User.Info<'student'> | null> {
  const data = await getDocs(query(collection('users'), where('studentId', '==', studentId)))
  return data.docs.length ? (data.docs[0].data() as M.User.Info<'student'>) : null
}

export async function readWithBatchData(id: string): Promise<M.Student.WithBatchData | null> {
  const data = await read(id)
  if (!data) return null
  const batch = await Batch.read(data.batchId)
  if (!batch) return null
  return { ...data, batch }
}

export async function readWithFacultyData(id: string): Promise<M.Student.WithFacultyData | null> {
  const data = await read(id)
  if (!data) return null
  const faculty = await Faculty.read(data.facultyId)
  if (!faculty) return null
  return { ...data, faculty }
}

export async function readWithClassData(id: string): Promise<M.Student.WithClassData | null> {
  const data = await read(id)
  if (!data) return null
  const cls = await Class.read(data.classId)
  if (!cls) return null

  return { ...data, class: cls }
}

export async function readWithAllData(id: string): Promise<M.Student.WithAllData | null> {
  const data = await read(id)
  if (!data) return null
  const cls = await Class.read(data.classId)
  if (!cls) return null
  const batch = await Batch.read(data.batchId)
  if (!batch) return null
  const faculty = await Faculty.read(data.facultyId)
  if (!faculty) return null

  return { ...data, class: cls, batch, faculty }
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Student.Base[]> {
  const data = await getDocs(queries || collection('users'))
  return data.docs.map((doc) => doc.data() as M.Student.Base)
}

export async function readAllByBatch(batchId: string): Promise<M.Student.Base[]> {
  const data = await getDocs(query(collection('users'), where('batchId', '==', batchId)))
  return data.docs.map((doc) => doc.data() as M.Student.Base)
}

export async function readAllByFaculty(facultyId: string): Promise<M.Student.Base[]> {
  const data = await getDocs(query(collection('users'), where('facultyId', '==', facultyId)))
  return data.docs.map((doc) => doc.data() as M.Student.Base)
}

export async function readAllByClass(classId: string) {
  const data = await getDocs(query(collection('users'), where('classId', '==', classId)))
  return data.docs.map((doc) => doc.data() as M.User.Info<'student'>)
}

export async function update(id: string, data: M.Student.Base): Promise<void> {
  await setDoc(doc('users', id), data)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('users', id))
}
