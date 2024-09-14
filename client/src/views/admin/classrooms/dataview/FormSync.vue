<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { QRcodeScanner } from '@/components/qrcode'
import { Classroom, Schedule } from '@/database'
import router from '@/router'
import { useMiscStore } from '@/stores'

interface FormSyncProps {
  id: string
}

const props = defineProps<FormSyncProps>()

const { fetchClassrooms, fetchSchedules } = useMiscStore()

const scanner = ref('')

const updateScanner = async (value: string) => {
  scanner.value = value
  await Classroom.sync(props.id, value)
    .then(async () => {
      toast.success('Synced successfully')
      await router.push('/admin/classrooms')
      await fetchClassrooms()
      await Schedule.readByRoomId(props.id).then(async (data) => {
        if (!data.length) return
        await Schedule.update(data[0].scheduleId, { ...data[0], classroomId: props.id })
        await fetchSchedules()
      })
    })
    .catch(() => {
      toast.error('Failed to sync')
    })
}
</script>

<template>
  <QRcodeScanner :value="scanner" @update:scanner="updateScanner" />
</template>
