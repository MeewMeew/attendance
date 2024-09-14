<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Classroom } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const classrooms = ref<M.Classroom.Info[]>([])

onMounted(() => {
  useHead({ title: 'Classrooms' })
  onSnapshot(query(collection('classrooms')), (snapshot) => {
    classrooms.value = sortBy(
      snapshot.docs.map((doc) => doc.data() as M.Classroom.Info),
      'name'
    )
  })
})
</script>

<template>
  <DataTable
    :data="classrooms"
    :columns="columns"
    :toolbar="toolbar"
    name="classrooms"
    id-to-delete="classroomId"
    :func-to-delete="Classroom.remove"
  />
</template>
