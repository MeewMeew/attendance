<script lang="ts" setup>
import { onClickOutside, useMagicKeys } from '@vueuse/core'
import { ScanLine, X } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

import { TransparentOverlay } from '@/components/common'
import { QRcodeScanner } from '@/components/qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Attendance, Schedule, Shorten } from '@/database'
import { combineDateAndTime, isDateInRange, time, timeNow, timeNowFormat } from '@/lib/luxon'
import type { M } from '@/shared/types'
import { useUserStore } from '@/stores'

interface ScannerViewEmits {
  (event: 'update:scan', data: string): void
}

defineEmits<ScannerViewEmits>()

const route = useRoute()

const { shift, alt, s } = useMagicKeys()
const user = ref(useUserStore().user as M.User.Info<'student'>)

const open = ref(false)
const target = ref<HTMLDivElement | null>(null)
const loading = ref(false)

const closeModal = () => (open.value = false)
const handleScan = async (input: string) => {
  if (loading.value) return
  const size = 21

  try {
    loading.value = true
    const regex = /\/student\/(.+)/
    const match = (input.trim() || route.fullPath).match(regex)!
    const code = match[1]
    if (!code) {
      navigator.vibrate(200)
      toast.error('Invalid QR code, code not found')
      return (loading.value = false)
    }
    if (code.length % size !== 0) {
      navigator.vibrate(200)
      toast.error('Invalid QR code, size is wrong')
      return (loading.value = false)
    }
    const [roomId, sessionId, randomId] = code.match(new RegExp(`.{1,${size}}`, 'g'))!
    const attendance = await Attendance.read(sessionId)
    if (!attendance) {
      navigator.vibrate(200)
      toast.error('Invalid QR code, attendance is wrong')
      return (loading.value = false)
    }
    const schedule = await Schedule.read(attendance.scheduleId)
    if (
      !schedule ||
      schedule.classId !== user.value.classId ||
      schedule.facultyId !== user.value.facultyId ||
      schedule.batchId !== user.value.batchId ||
      schedule.classroomId !== roomId
    ) {
      navigator.vibrate(200)
      toast.error('Invalid QR code, not for your class')
      return (loading.value = false)
    }
    if (attendance.attendances.some((a) => a.studentId === user.value.docId)) {
      navigator.vibrate(200)
      toast.warning('Already marked')
      await Shorten.remove(code)
      return (loading.value = false)
    }
    // eslint-disable-next-line quotes
    console.log("Let' mark")

    let status: M.Attendance.Status = 'present'
    const currentDate = timeNowFormat()
    if (
      isDateInRange(
        currentDate,
        combineDateAndTime(schedule.date, schedule.startTime),
        combineDateAndTime(schedule.date, schedule.endTime)
      )
    ) {
      const wrong = timeNow() > time(`${schedule.date} ${schedule.startTime}`).plus({ minutes: 10 })
      if (wrong) {
        status = 'late'
      }
    }

    const studentData: M.Attendance.WithStudent = {
      attendanceId: randomId,
      scheduleId: attendance.scheduleId,
      sessionId: sessionId,
      studentId: user.value.docId,
      note: '',
      time: timeNowFormat(),
      status: status
    }

    await Attendance.mark(sessionId, studentData)
    await Shorten.remove(code)

    navigator.vibrate(200)
    toast.success('Mark a successful presence')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    closeModal()
  }
}
onClickOutside(target, closeModal)

watchEffect(() => {
  if (shift.value && alt.value) {
    if (s.value) {
      open.value = true
    }
  }
})
</script>

<template>
  <div>
    <Button class="my-2 flex h-10 w-32 items-center justify-between" @click="open = true">
      <span>Scan now</span>
      <ScanLine />
    </Button>

    <TransparentOverlay :overlay="open">
      <div class="max-w-screen max-h-screen px-5 py-10" ref="target">
        <Card class="bg-background">
          <CardHeader>
            <CardTitle>
              <div class="flex items-center justify-between">
                <span>Scan QR Code</span>
                <X class="h-4 w-4 hover:cursor-pointer" @click="closeModal" />
              </div>
            </CardTitle>
            <CardDescription> Scan the QR code to mark your attendance </CardDescription>
          </CardHeader>
          <CardContent>
            <QRcodeScanner @update:scanner="handleScan" />
          </CardContent>
        </Card>
      </div>
    </TransparentOverlay>
  </div>
</template>
