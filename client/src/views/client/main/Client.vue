<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core'
import { onSnapshot, query, where } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { onBeforeUnmount, onMounted, ref, toRef } from 'vue'

import { CellLoader } from '@/components/common'
import { QRcode } from '@/components/qrcode'
import { Classroom } from '@/database'
import {
  combineDateAndTime,
  isDateAfter,
  isDateBefore,
  isDateInRange,
  timeNowFormat
} from '@/lib/luxon'
import { collection } from '@/lib/services'
import type { Management } from '@/shared/types'
import { useNanoIDStore } from '@/stores'

interface RoomViewEmits {
  (event: 'update:remove'): void
}

interface RoomViewProps {
  schedule: Management.Schedule.Info
}

const props = defineProps<RoomViewProps>()
const emit = defineEmits<RoomViewEmits>()

const schedule = toRef(props, 'schedule')

const { nanoid: _nanoid } = useNanoIDStore()

const dataurl = ref('')
const roomName = ref('')
const mounted = ref(false)

useIntervalFn(() => {
  if (!schedule.value) return
  const { startTime, endTime, date } = schedule.value
  const now = timeNowFormat()
  const start = combineDateAndTime(date, startTime)
  const end = combineDateAndTime(date, endTime)

  if (isDateAfter(now, end)) {
    emit('update:remove')
  } else if (!isDateInRange(now, start, end)) {
    emit('update:remove')
  } else if (isDateBefore(now, start)) {
    emit('update:remove')
  }
}, 1000)

onMounted(async () => {
  if (!schedule.value) return
  const docData = schedule.value
  const { classroomId, scheduleId } = docData
  if (!roomName.value) {
    const room = await Classroom.read(classroomId)
    roomName.value = room?.name || ''
  }

  function generateCode(sessionId: string) {
    const code = `${_nanoid}${sessionId}${nanoid()}`
    dataurl.value = `${window.location.origin}/student/${code}`
  }

  const unsubscribe = onSnapshot(
    query(collection('attendances'), where('scheduleId', '==', scheduleId)),
    (snapshot) => {
      if (mounted.value)
        snapshot.docChanges().forEach(async (change) => {
          return generateCode((change.doc.data() as Management.Attendance.WithClass).sessionId)
        })
      else {
        mounted.value = true
        return generateCode((snapshot.docs[0].data() as Management.Attendance.WithClass).sessionId)
      }
    }
  )

  onBeforeUnmount(() => {
    unsubscribe()
  })
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center space-y-4">
    <h1 class="text-2xl font-bold">{{ roomName }}</h1>
    <CellLoader v-if="!dataurl" />
    <QRcode :value="dataurl" :size="300" v-else />
  </div>
</template>
