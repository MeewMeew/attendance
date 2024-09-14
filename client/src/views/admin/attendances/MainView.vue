<script lang="ts" setup>
import * as ExcelJS from 'exceljs'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watchEffect } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AreaChart } from '@/components/ui/chart-area'
import { BarChart } from '@/components/ui/chart-bar'
import { Attendance, Schedule, Student } from '@/database'
import { createReportByClass, createReportByStudent } from '@/lib/excel'
import { isDateAfter, isDateInRange, timeNowFormat } from '@/lib/luxon'
import type { M } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { DownloadExcel, ReloadData, ShowOptions } from './components'
const { faculties, batches, classes, courses, instructors } = storeToRefs(useMiscStore())

const dataBar = ref<any[]>([])
const indexBar = ref('')
const categoriesBar = ref<string[]>([])
const modeBar = ref<'stacked' | 'grouped' | undefined>('stacked')
const legendBar = ref(true)

const dataArea = ref<any[]>([])
const indexArea = ref('')
const categoriesArea = ref<string[]>([])

const description = ref('')
const excelFile = ref<ExcelJS.Buffer>(new ArrayBuffer(0))

const studentFilter = ref<M.User.Info<'student'> | null>(null)
const classesFilter = ref<M.Class.Info[]>([])

async function setFilterStudent(student: M.User.Info<'student'>) {
  dataBar.value = []

  studentFilter.value = student
  const className = classes.value.find((c) => c.classId === student.classId)?.name
  indexBar.value = 'status'
  categoriesBar.value = ['data']
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
  dataBar.value = successAttendances
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

async function setFilterClasses(classesData: M.Class.Info[]) {
  dataBar.value = []
  const oneMore = classesData.length > 1
  const wb = new ExcelJS.Workbook()
  classesFilter.value = classesData
  for (const classData of classesData) {
    const instructor = instructors.value.find((i) => i.docId === classData.instructorId)

    indexBar.value = oneMore ? 'class' : 'student'
    categoriesBar.value = ['present', 'late', 'absent']
    modeBar.value = oneMore ? 'grouped' : 'stacked'
    legendBar.value = true
    description.value = `Attendance statistical for ${classesData.map((c) => c.shortName).join(', ')}`

    const schedules = await Schedule.readByClassId(classData.classId)
    const scheduleIds = schedules.map((schedule) => schedule.scheduleId)
    const attendances = await Promise.allSettled(
      scheduleIds.map((scheduleId) => Attendance.readBySchedule(scheduleId))
    )
    const students = await Student.readAllByClass(classData.classId)
    type StatusMap = {
      present: number
      late: number
      absent: number
    }
    type DataValue = StatusMap & ({ student: string } | { class: string })
    const attendanceMap = attendances
      .filter((attendance) => attendance.status === 'fulfilled')
      .map((attendance: any) => attendance.value as M.Attendance.WithClass)
    if (oneMore) {
      const dataValue: DataValue = {
        class: classData.shortName,
        present: 0,
        late: 0,
        absent: 0
      }
      attendanceMap.forEach(({ summary }) => {
        dataValue.present += summary.present
        dataValue.late += summary.late
        dataValue.absent += summary.total - summary.present - summary.late
      })
      dataBar.value.push(dataValue)
    } else {
      dataBar.value = students.reduce<DataValue[]>((acc, val) => {
        const statusMap = {
          student: val.studentId,
          present: 0,
          late: 0,
          absent: 0
        }
        attendanceMap.forEach(({ attendances, scheduleId }) => {
          const cs = attendances.find((v) => v.studentId === val.docId)
          if (cs) statusMap[cs.status]++
          else {
            const schedule = schedules.find((s) => s.scheduleId === scheduleId)
            if (schedule) {
              if (
                !isDateInRange(timeNowFormat(), schedule.startTime, schedule.endTime) &&
                isDateAfter(timeNowFormat(), schedule.endTime)
              ) {
                statusMap['absent']++
              }
            }
          }
        })
        acc.push(statusMap)
        return acc
      }, [])
    }
    await createReportByClass({
      classData,
      schedules,
      students,
      batches: batches.value,
      faculties: faculties.value,
      instructor: instructor!,
      attendances: attendanceMap,
      wb
    })
  }
  excelFile.value = await wb.xlsx.writeBuffer()
}

function reloadData() {
  if (studentFilter.value) setFilterStudent(studentFilter.value)
  if (classesFilter.value) setFilterClasses(classesFilter.value)
}

function downloadExcel() {
  if (!excelFile.value.byteLength) return
  let blob = new Blob([excelFile.value], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  let link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'attendance-report.xlsx'
  link.click()
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

onMounted(async () => {
  const attendances = await Attendance.readAll()
  dataArea.value = attendances.reduce<{ type: M.Attendance.Status; data: number }[]>((acc, val) => {
    val.attendances.forEach((attendance) => {
      if (!acc.some((a) => a.type === attendance.status)) {
        acc.push({
          type: attendance.status,
          data: 1
        })
      } else {
        acc.find((a) => a.type === attendance.status)!.data++
      }
    })
    if (!acc.some((a) => a.type === 'absent')) {
      acc.push({
        type: 'absent',
        data: val.summary.total - val.summary.present - val.summary.late
      })
    } else {
      acc.find((a) => a.type === 'absent')!.data +=
        val.summary.total - val.summary.present - val.summary.late
    }
    return acc
  }, [])
  indexArea.value = 'type'
  categoriesArea.value = ['data']
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        <CardTitle>
          <div class="flex items-center justify-between">
            <span class="flex-1">Attendance statistical</span>
            <ShowOptions
              is-chart
              @update:filter-student="setFilterStudent"
              @update:filter-classes="setFilterClasses"
            />
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
      <AreaChart
        v-if="dataArea.length && !dataBar.length"
        :index="indexArea"
        :data="dataArea"
        :categories="categoriesArea"
      />
      <BarChart
        v-if="dataBar.length"
        :index="indexBar"
        :data="dataBar"
        :show-legendBar="legendBar"
        :rounded-corners="4"
        :categories="categoriesBar"
        :type="modeBar"
      />
    </CardContent>
    <CardFooter></CardFooter>
  </Card>
</template>
