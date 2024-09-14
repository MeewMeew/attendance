<script lang="ts" setup>
import * as ExcelJS from 'exceljs'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BarChart } from '@/components/ui/chart-bar'
import { Attendance, Schedule } from '@/database'
import { createReportByStudent } from '@/lib/excel'
import type { M } from '@/shared/types'
import { useMiscStore, useUserStore } from '@/stores'

import { DownloadExcel, ReloadData } from './components'
const { faculties, batches, classes, courses } = storeToRefs(useMiscStore())
const { user } = storeToRefs(useUserStore())

const data = ref<any[]>([])
const index = ref('')
const categories = ref<string[]>([])
const modeBar = ref<'stacked' | 'grouped' | undefined>('stacked')
const legendBar = ref(true)

const description = ref('')
const excelFile = ref<ExcelJS.Buffer>(new ArrayBuffer(0))

const studentFilter = ref<M.User.Info<'student'> | null>(null)

async function setFilterStudent(student: M.User.Info<'student'>) {
  data.value = []

  studentFilter.value = student
  const className = classes.value.find((c) => c.classId === student.classId)?.name
  index.value = 'status'
  categories.value = ['data']
  modeBar.value = 'grouped'
  legendBar.value = false
  description.value = `Attendance statistical for ${student.displayName} in ${className}`

  const schedules = await Schedule.readByClassId(student.classId)
  const scheduleIds = schedules.map((schedule) => schedule.scheduleId)
  const attendances = await Promise.allSettled(
    scheduleIds.map((scheduleId) => Attendance.readBySchedule(scheduleId))
  )
  const successAttendances = attendances
    .filter((attendance) => attendance.status === 'fulfilled')
    .map((attendance: any) => attendance.value as M.Attendance.WithClass)
  data.value = successAttendances
    .map((attendance) => attendance.attendances)
    .reduce<{ status: M.Attendance.Status; data: number }[]>((acc, val) => {
      const statusMap = {
        present: 0,
        late: 0,
        absent: 0
      }
      const cs = val.find((v) => v.studentId === student.docId)
      if (cs) statusMap[cs.status]++
      else statusMap['absent']++
      Object.entries(statusMap).forEach(([status, count]) => {
        if (!acc.some((a) => a.status === status))
          acc.push({ status: status as M.Attendance.Status, data: count })
        else acc.find((a) => a.status === status)!.data += count
      })
      return acc
    }, [])

  excelFile.value = await createReportByStudent({
    student: student,
    className: className!,
    attendances: successAttendances,
    schedules: schedules,
    faculties: faculties.value,
    batches: batches.value,
    courses: courses.value
  })
}

function reloadData() {
  if (studentFilter.value) setFilterStudent(studentFilter.value)
}

function downloadExcel() {
  if (!excelFile.value) return
  let blob = new Blob([excelFile.value], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  let link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'attendance-report.xlsx'
  link.click()
}

onMounted(async () => {
  setFilterStudent(user.value as M.User.Info<'student'>)
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        <CardTitle>
          <div class="flex items-center justify-between">
            <span class="flex-1">Attendance statistical</span>
            <ReloadData @reload-data="reloadData" />
            <DownloadExcel @download-excel="downloadExcel" />
          </div>
        </CardTitle>
        <CardDescription>
          <Button variant="link">
            {{ description }}
          </Button>
        </CardDescription>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <BarChart
        v-if="data.length"
        :index="index"
        :data="data"
        :show-legendBar="legendBar"
        :rounded-corners="4"
        :categories="categories"
        :type="modeBar"
      />
    </CardContent>
    <CardFooter></CardFooter>
  </Card>
</template>
