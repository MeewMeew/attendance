<script lang="ts" setup>
import * as ExcelJS from 'exceljs'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Attendance, Student } from '@/database'
import { createReportBySchedule } from '@/lib/excel'
import type { Management } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { ChartShowOptions, DownloadExcel, ReloadData, ViewMode } from './components'
const { faculties, batches, classes, instructors } = storeToRefs(useMiscStore())

const dataBar = ref<any[]>([])
const dataTable = ref<any[]>([])

const indexBar = ref('')
const categoriesBar = ref<string[]>([])
const modeBar = ref<'stacked' | 'grouped' | undefined>('stacked')
const legendBar = ref(true)
const mode = ref<'chart' | 'table'>('chart')

const description = ref('')
const excelFile = ref<ExcelJS.Buffer>(new ArrayBuffer(0))

const scheduleFilter = ref<Management.Schedule.Info | null>(null)

async function setFilterSchedule(schedule: Management.Schedule.Info) {
  dataBar.value = []
  indexBar.value = 'type'
  categoriesBar.value = ['value']
  modeBar.value = 'stacked'
  description.value = `Attendance statistical for ${schedule.date} ${schedule.startTime} - ${schedule.endTime}`

  scheduleFilter.value = schedule

  const attendances = await Attendance.readBySchedule(schedule.scheduleId)
  const students = await Student.readAllByClass(schedule.classId)
  const instructor = instructors.value.find((i) => i.docId === schedule.instructorId)

  type DataValue = {
    type: Management.Attendance.Status
    value: number
  }

  dataBar.value = [
    { type: 'present', value: attendances!.summary.present || 0 },
    { type: 'late', value: attendances!.summary.late || 0 },
    {
      type: 'absent',
      value: attendances!.summary.total - attendances!.summary.present - attendances!.summary.late
    }
  ] as DataValue[]
  dataTable.value = students.map((student) => {
    const data = {
      studentId: student.studentId,
      studentName: student.displayName,
      present: '',
      late: '',
      absent: ''
    }
    const sa = attendances!.attendances.find((a) => a.studentId === student.docId)!
    if (!sa) data.absent = '-'
    if (sa?.status === 'present') data.present = 'O'
    if (sa?.status === 'late') data.late = 'X'

    return data
  })

  excelFile.value = await createReportBySchedule({
    classes: classes.value,
    schedule,
    students,
    batches: batches.value,
    faculties: faculties.value,
    instructor: instructor!,
    attendances: attendances!
  })
}

function reloadData() {
  if (scheduleFilter.value) setFilterSchedule(scheduleFilter.value)
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

function switchViewMode() {
  mode.value = mode.value === 'chart' ? 'table' : 'chart'
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        <CardTitle>
          <div class="flex items-center justify-between">
            <span class="flex-1">Attendance statistical</span>
            <ChartShowOptions @update:filter-schedule="(v) => setFilterSchedule(v)" />
            <ViewMode @switch:view-mode="switchViewMode" />
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
      <div v-if="dataBar.length">
        <BarChart
          v-if="mode == 'chart'"
          :index="indexBar"
          :data="dataBar"
          :show-legendBar="legendBar"
          :rounded-corners="4"
          :categories="categoriesBar"
          :type="modeBar"
        />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Index</TableHead>
              <TableHead class="w-24 min-w-24">Student ID</TableHead>
              <TableHead class="w-auto min-w-48">Student Name</TableHead>
              <TableHead class="text-center">Present</TableHead>
              <TableHead class="text-center">Late</TableHead>
              <TableHead class="text-center">Absent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in dataTable" :key="index">
              <TableCell class="text-center">{{ index + 1 }}</TableCell>
              <TableCell>{{ item.studentId }}</TableCell>
              <TableCell>{{ item.studentName }}</TableCell>
              <TableCell class="text-center">{{ item.present }}</TableCell>
              <TableCell class="text-center">{{ item.late }}</TableCell>
              <TableCell class="text-center">{{ item.absent }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else class="flex items-center justify-center md:h-64">
        <span class="text-muted-foreground">No data available</span>
      </div>
    </CardContent>
    <CardFooter></CardFooter>
  </Card>
</template>
