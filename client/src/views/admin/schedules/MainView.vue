<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Schedule } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const schedules = ref<M.Schedule.Info[]>([])

onMounted(() => {
  useHead({ title: 'Schedules' })
  onSnapshot(query(collection('schedules')), (snapshot) => {
    schedules.value = snapshot.docs.map((doc) => doc.data() as M.Schedule.Info)
  })
})
</script>

<template>
  <DataTable
    :data="schedules"
    :columns="columns"
    :toolbar="toolbar"
    name="schedules"
    id-to-delete="scheduleId"
    :func-to-delete="Schedule.remove"
  />
</template>
