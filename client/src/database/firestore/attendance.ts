import {
  arrayUnion,
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'

import { collection, doc } from '@/lib/services'
import type { M } from '@/shared/types'

export async function getCount(): Promise<number> {
  const count = await getCountFromServer(collection('attendances'))
  return count.data().count
}

export async function create(data: M.Attendance.WithClass): Promise<void> {
  const id = nanoid()
  await setDoc(doc('attendances', id), {
    ...data,
    summary: {
      present: 0,
      late: 0,
      total: 0
    },
    sessionId: id
  } as M.Attendance.WithClass)
}

export async function init(scheduleId: string, total: number): Promise<void> {
  const id = nanoid()

  await setDoc(doc('attendances', id), {
    summary: {
      present: 0,
      late: 0,
      total: total
    },
    sessionId: id,
    scheduleId: scheduleId,
    attendances: []
  } as M.Attendance.WithClass)
}

export async function read(id: string): Promise<M.Attendance.WithClass | null> {
  const data = await getDoc(doc('attendances', id))
  return data.exists() ? (data.data() as M.Attendance.WithClass) : null
}

export async function readBySchedule(scheduleId: string): Promise<M.Attendance.WithClass | null> {
  const data = await getDocs(
    query(collection('attendances'), where('scheduleId', '==', scheduleId))
  )
  return data.docs.map((doc) => doc.data() as M.Attendance.WithClass)?.[0] || null
}

export async function readByClass(classId: string): Promise<M.Attendance.WithClass[]> {
  const data = await getDocs(query(collection('attendances'), where('classId', '==', classId)))
  return data.docs.map((doc) => doc.data() as M.Attendance.WithClass)
}

export async function readByStudent(docId: string): Promise<M.Attendance.WithStudent[]> {
  const student = await getDoc(doc('users', docId))
  if (!student.exists()) return []
  const data = await getDocs(query(collection(student.ref.path, 'attendance')))
  return data.docs.map((doc) => doc.data() as M.Attendance.WithStudent)
}

export async function readByStudentAndSession(
  docId: string,
  sessionId: string
): Promise<M.Attendance.WithStudent | null> {
  const student = await getDoc(doc('users', docId))
  if (!student.exists()) return null
  const data = await getDocs(
    query(collection(student.ref.path, 'attendance'), where('sessionId', '==', sessionId))
  )
  return data.docs.map((doc) => doc.data() as M.Attendance.WithStudent)?.[0] || null
}

export async function readAll(
  queries?: ReturnType<typeof query>
): Promise<M.Attendance.WithClass[]> {
  const data = await getDocs(queries || collection('attendances'))
  return data.docs.map((doc) => doc.data() as M.Attendance.WithClass)
}

export async function update(id: string, data: M.Attendance.WithClass): Promise<void> {
  await setDoc(doc('attendances', id), data)
}

export async function saveNote(id: string, studentId: string, note: string) {
  // attendance.attenances is array of student attendance
  const data = await getDoc(doc('attendances', id)).then((doc) => doc.data() as M.Attendance.WithClass)
  if (!data) return
  const attendance = data.attendances.find((student) => student.studentId === studentId)
  if (!attendance) {
    data.attendances.push({
      studentId: studentId,
      status: 'absent',
      note: note,
      time: DateTime.now().toFormat('yyyy-MM-dd HH:mm'),
      sessionId: id,
      scheduleId: data.scheduleId,
      attendanceId: nanoid()
    })
  } else {
    attendance.note = note
  }
  await updateDoc(doc('attendances', id), {
    attendances: data.attendances
  })
}

export async function mark(id: string, student: M.Attendance.WithStudent): Promise<void> {
  await updateDoc(doc('attendances', id), {
    [`summary.${student.status}`]: increment(1),
    attendances: arrayUnion(student)
  }).catch()
  await setDoc(doc('users', student.studentId, 'attendances', id), student)
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc('attendances', id))
}
