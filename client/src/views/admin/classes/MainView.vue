<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Class } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const classes = ref<M.Class.Info[]>([])

onMounted(async () => {
  useHead({ title: 'Classes' })
  onSnapshot(collection('classes'), (snapshot) => {
    classes.value = sortBy(
      snapshot.docs.map((doc) => doc.data() as M.Class.Info),
      'name'
    )
  })
})
</script>

<template>
  <DataTable
    :data="classes"
    :columns="columns"
    :toolbar="toolbar"
    name="classes"
    id-to-delete="classId"
    :func-to-delete="Class.remove"
  />
</template>
