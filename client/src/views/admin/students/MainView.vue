<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query, where } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Student } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'

import { columns, toolbar } from './datatable'

const students = ref<M.User.Info<'student'>[]>([])

onMounted(() => {
  useHead({ title: 'Students' })
  onSnapshot(query(collection('users'), where('role', '==', 'student')), (snapshot) => {
    students.value = sortBy(
      snapshot.docs.map((doc) => doc.data() as M.User.Info<'student'>),
      'displayName'
    )
  })
})
</script>

<template>
  <DataTable
    :data="students"
    :columns="columns"
    :toolbar="toolbar"
    name="students"
    id-to-delete="studentId"
    :func-to-delete="Student.remove"
  />
</template>
