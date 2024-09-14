<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Batch } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const batches = ref<M.Batch.Info[]>([])

onMounted(() => {
  useHead({
    title: 'Batch Management'
  })
  onSnapshot(query(collection('batches')), (snapshot) => {
    batches.value = sortBy(
      snapshot.docs.map((doc) => doc.data() as M.Batch.Info),
      'name'
    )
  })
})
</script>

<template>
  <DataTable
    :data="batches"
    :columns="columns"
    :toolbar="toolbar"
    name="batches"
    id-to-delete="batchId"
    :func-to-delete="Batch.remove"
  />
</template>
