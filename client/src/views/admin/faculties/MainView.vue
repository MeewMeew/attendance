<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Faculty } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const faculties = ref<M.Faculty.Info[]>([])

onMounted(() => {
  useHead({
    title: 'Faculties'
  })
  onSnapshot(
    query(collection('faculties')),
    (snapshot) =>
      (faculties.value = sortBy(
        snapshot.docs.map((doc) => doc.data() as M.Faculty.Info),
        'name'
      ))
  )
})
</script>

<template>
  <DataTable
    :data="faculties"
    :columns="columns"
    :toolbar="toolbar"
    name="faculties"
    id-to-delete="facultyId"
    :func-to-delete="Faculty.remove"
  />
</template>
