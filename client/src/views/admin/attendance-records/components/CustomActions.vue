<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

import { Attendance, Schedule, Student } from '@/database'
import { isDateAfter, isDateInRange, timeNowFormat } from '@/lib/luxon'
import { startCase } from '@/lib/misc'
import { t } from '@/shared/locales'
import type { M } from '@/shared/types'
import { ShowOptions } from '@/views/admin/attendances/components'

import type { AttendanceRecordClassColumns } from '../datatable'

interface CustomActionsEmits {
  (event: 'update:custom-actions', data: AttendanceRecordClassColumns[]): void
}

const emit = defineEmits<CustomActionsEmits>()

const data = ref<AttendanceRecordClassColumns[]>([])

const studentFilter = ref<M.User.Info<'student'> | null>(null)
const classesFilter = ref<M.Class.Info[]>([])

async function setFilterStudent(
  student: M.User.Info<'student'>,
  schedule: M.Schedule.Info,
  sa: M.Attendance.WithClass
) {
  data.value = [
    {
      scheduleId: schedule.scheduleId,
      status: t(startCase(sa.attendances[0].status)),
      studentId: student.studentId,
      studentName: student.displayName,
      userId: student.docId,
      sessionId: sa.sessionId,
      attendanceId: sa.attendances[0].attendanceId,
      time: sa.attendances[0].time,
      note: sa.attendances[0].note
    }
  ]

  emit('update:custom-actions', data.value)
}

async function setFilterClasses(classesData: M.Class.Info[], scheduleId?: string) {
  if (!scheduleId) return
  data.value = []
  classesFilter.value = classesData
  for (const classData of classesData) {
    const attendance = await Attendance.readBySchedule(scheduleId)
    const students = await Student.readAllByClass(classData.classId)
    if (!attendance) continue
    data.value = students.map((student) => {
      const sa = attendance.attendances.find((a) => a.studentId === student.docId)
      if (!sa) {
        return {
          scheduleId,
          status: t('Absent'),
          studentId: student.studentId,
          studentName: student.displayName,
          userId: student.docId,
          sessionId: attendance.sessionId,
          attendanceId: '',
          time: '',
          note: ''
        }
      }
      return {
        scheduleId,
        status: t(startCase(sa.status)),
        studentId: student.studentId,
        studentName: student.displayName,
        userId: student.docId,
        sessionId: attendance.sessionId,
        attendanceId: sa.attendanceId,
        time: sa.time,
        note: sa.note
      }
    })
  }
  emit('update:custom-actions', data.value)
}

watchEffect(() => {
  if (studentFilter.value) {
    classesFilter.value = []
  }
  if (classesFilter.value) {
    studentFilter.value = null
    classesFilter.value = []
  }
})
</script>

<template>
  <ShowOptions
    hide-icon
    content="Select Data"
    @update:filter-classes="setFilterClasses"
    @update:filter-student-with-attendance="setFilterStudent"
  />
</template>
