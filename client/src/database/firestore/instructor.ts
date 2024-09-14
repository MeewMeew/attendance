import {
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'

import { User } from '@/database'
import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(
    query(collection('users'), where('role', '==', 'instructor'))
  )
  return count.data().count
}

export async function read(id: string): Promise<M.Instructor.Base | null> {
  return await User.read<'instructor'>(id)
}

export async function readByInstructorId(instructorId: string): Promise<M.Instructor.Base | null> {
  const data = await getDocs(collection('users'))
  const instructor = data.docs.find((doc) => doc.data().instructorId === instructorId)
  return instructor ? (instructor.data() as M.Instructor.Base) : null
}

export async function readWithFacultyData(
  id: string,
  facultyId: string
): Promise<M.Instructor.WithFacultyData | null> {
  const faculty = await getDoc(doc('faculties', facultyId))
  if (!faculty.exists()) return null

  const data = await read(id)
  if (!data) return null

  return { ...data, faculty: faculty.data() as M.Faculty.Info }
}

export async function readWithUserData(
  id: string,
  userId: string
): Promise<M.Instructor.WithUserData | null> {
  const user = await getDoc(doc('users', userId))
  if (!user.exists()) return null

  const data = await read(id)
  if (!data) return null

  return { ...data, user: user.data() as M.User.Info<'instructor'> }
}

export async function readAll(queries?: ReturnType<typeof query>): Promise<M.Instructor.Base[]> {
  const data = await getDocs(queries || collection('users'))
  return data.docs.map((doc) => doc.data() as M.Instructor.Base)
}

export async function readAllWithFaculty(facultyId: string): Promise<M.Instructor.Base[]> {
  const data = await getDocs(collection('users'))
  const users = data.docs.filter((doc) => doc.data().facultyId === facultyId)
  return users.map((doc) => doc.data() as M.Instructor.Base)
}

export async function update(id: string, data: Partial<M.Instructor.Base>): Promise<void> {
  await setDoc(doc('users', id), data, { merge: true })
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('users', id))
}
