<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import 'qalendar/dist/style.css'

import { and, onSnapshot, query, where } from 'firebase/firestore'
import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
// @ts-ignore
import { Qalendar } from 'qalendar'
import { h, onMounted, onUnmounted, ref } from 'vue'

import { Attendance, Classroom, Course, Schedule } from '@/database'
import { collection } from '@/lib/services'
import type { M, Management, QalendarConfig } from '@/shared/types'
import type { Firebase } from '@/shared/types'
import { useMiscStore, useThemeStore, useUserStore } from '@/stores'

type Period = { start: Date; end: Date }
type Mode = { mode: 'day' | 'week' | 'month'; period: Period }

let unsubscribe: Firebase.Unsubscribe

const { theme } = useThemeStore()
const user = useUserStore()
const { classrooms, courses, instructors } = storeToRefs(useMiscStore())

const config = ref<QalendarConfig>({
  locale: 'vi-VN',
  defaultMode: 'week',
  showCurrentTime: true,
  style: {
    colorSchemes: {
      zinc: {
        color: '#fafafa',
        backgroundColor: '#18181b'
      },
      rose: {
        color: '#fff1f2',
        backgroundColor: '#e11d48'
      },
      blue: {
        color: '#f8fafc',
        backgroundColor: '#2563eb'
      },
      green: {
        color: '#fff1f2',
        backgroundColor: '#16a34a'
      },
      orange: {
        color: '#fafaf9',
        backgroundColor: '#f97316'
      },
      red: {
        color: '#fef2f2',
        backgroundColor: '#dc2626'
      },
      slate: {
        color: '#f8fafc',
        backgroundColor: '#0f172a'
      },
      stone: {
        color: '#fafaf9',
        backgroundColor: '#1c1917'
      },
      gray: {
        color: '#f9fafb',
        backgroundColor: '#111827'
      },
      neutral: {
        color: '#fafafa',
        backgroundColor: '#171717'
      },
      yellow: {
        color: '#422006',
        backgroundColor: '#facc15'
      },
      violet: {
        color: '#f9fafb',
        backgroundColor: '#7c3aed'
      }
    }
  }
})
const userData = user.user as M.User.Info<'student'>
const events = ref<any[]>([])

function buildQueries(period: Period, mode: Mode['mode'] = 'week') {
  const startDay = DateTime.fromJSDate(period.start).setLocale('vi-VN')
  const endDay = DateTime.fromJSDate(period.end).setLocale('vi-VN')
  const queries: any[] = []
  if (mode === 'day') {
    queries.push(where('date', '>=', startDay.toISODate()), where('date', '<=', endDay.toISODate()))
  } else if (mode === 'week') {
    queries.push(
      where('date', '>=', startDay.startOf('week').toISODate()),
      where('date', '<=', endDay.endOf('week').toISODate())
    )
  } else {
    queries.push(
      where('date', '>=', startDay.startOf('month').toISODate()),
      where('date', '<=', endDay.endOf('month').toISODate())
    )
  }
  return queries
}

function onUpdatedPeriod(period: Period, mode: Mode['mode'] = 'week') {
  unsubscribe()
  unsubscribe = getSnapshot(buildQueries(period, mode))
}

function onUpdatedMode(mode: Mode) {
  return onUpdatedPeriod(mode.period, mode.mode)
}

function getSnapshot(queries: any[] = []) {
  return onSnapshot(
    query(
      query(collection('schedules'), and(where('classId', '==', userData.classId), ...queries))
    ),
    async (snapshot) => {
      const schedules = snapshot.docs.map((doc) => doc.data() as M.Schedule.Info)
      events.value = []
      for (const schedule of schedules) {
        const date = schedule.date.split('T')[0]
        const coruse =
          courses.value.find((c) => c.courseId === schedule.courseId) ||
          (await Course.read(schedule.courseId))
        const classroom =
          classrooms.value.find((c) => c.classroomId === schedule.classroomId) ||
          (await Classroom.read(schedule.classroomId))
        const instructorName = instructors.value.find(
          (i) => i.instructorId === schedule.instructorId
        )?.displayName

        events.value.push({
          id: schedule.scheduleId,
          with: instructorName,
          title: coruse?.name,
          time: {
            start: `${date} ${schedule.startTime}`,
            end: `${date} ${schedule.endTime}`
          },
          location: classroom?.location,
          colorScheme: theme.color
        })
      }
    }
  )
}

onMounted(() => {
  unsubscribe = getSnapshot(buildQueries({ start: new Date(), end: new Date() }))
  onUnmounted(() => unsubscribe())
})
</script>

<template>
  <div
    :class="{
      'is-light-mode': !theme.dark
    }"
  >
    <Qalendar
      :config="config"
      :events="events"
      @updated-period="onUpdatedPeriod"
      @updated-mode="onUpdatedMode"
    />
  </div>
</template>
