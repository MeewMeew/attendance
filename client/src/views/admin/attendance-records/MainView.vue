<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'

import { columns, toolbar } from './datatable'

const data = ref([])

onMounted(() => {
  useHead({
    title: 'Attendance Records'
  })
})
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :toolbar="toolbar"
    name="attendance-records"
    @update:custom-actions="(dataValue) => (data = dataValue)"
  />
</template>
