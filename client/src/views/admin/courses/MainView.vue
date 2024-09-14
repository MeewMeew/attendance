<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Course } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const courses = ref<M.Course.Info[]>([])

onMounted(() => {
  useHead({ title: 'Students' })
  onSnapshot(collection('courses'), (snapshot) => {
    courses.value = sortBy(
      snapshot.docs.map((doc) => doc.data() as M.Course.Info),
      'name'
    )
  })
})
</script>

<template>
  <DataTable
    :data="courses"
    :columns="columns"
    :toolbar="toolbar"
    name="courses"
    id-to-delete="courseId"
    :func-to-delete="Course.remove"
  />
</template>
