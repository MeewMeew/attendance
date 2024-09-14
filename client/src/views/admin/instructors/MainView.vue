<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onSnapshot, query, where } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onMounted, ref } from 'vue'

import DataTable from '@/components/datatable/DataTable.vue'
import { Instructor } from '@/database'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { columns, toolbar } from './datatable'

const { fetchFaculties } = useMiscStore()
const instructors = ref<M.User.Info<'instructor'>[]>([])

onMounted(async () => {
  useHead({ title: 'Instructors' })
  await fetchFaculties()
  onSnapshot(query(collection('users'), where('role', '==', 'instructor')), (snapshot) => {
    instructors.value = sortBy(
      snapshot.docs.map((doc) => doc.data() as M.User.Info<'instructor'>),
      'displayName'
    )
  })
})
</script>

<template>
  <DataTable
    :data="instructors"
    :columns="columns"
    :toolbar="toolbar"
    name="instructors"
    id-to-delete="instructorId"
    :func-to-delete="Instructor.remove"
  />
</template>
