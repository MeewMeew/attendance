<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query, where } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'
import { useUserStore } from '@/stores'

import { columns, toolbar } from './datatable'

type Schedule = M.Schedule.Info

const { user } = useUserStore()
const schedules = ref<Schedule[]>([])

onMounted(() => {
  useHead({ title: 'Schedules' })
  onSnapshot(
    query(collection('schedules'), where('instructorId', '==', user.docId)),
    (snapshot) => {
      schedules.value = snapshot.docs.map((doc) => doc.data() as Schedule)
    }
  )
})
</script>

<template>
  <DataTable :data="schedules" :columns="columns" :toolbar="toolbar" name="schedules" />
</template>
