<script lang="ts" setup>
import { onSnapshot, query, where } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { Guest } from '@/components/layouts'
import { collection } from '@/lib/services'
import type { M } from '@/shared/types'
import { useNanoIDStore } from '@/stores'

import Client from './Client.vue'
const mounted = ref(false)

const { nanoid } = useNanoIDStore()
const schedule = ref<M.Schedule.Info | null>(null)

onMounted(() => {
  const unsubscribe = onSnapshot(
    query(collection('schedules'), where('classroomId', '==', nanoid)),
    (snapshot) => {
      if (mounted.value)
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' || change.type === 'modified') {
            schedule.value = change.doc.data() as M.Schedule.Info
          }
        })
      else {
        schedule.value = sortBy(
          snapshot.docs.map((doc) => doc.data() as M.Schedule.Info),
          'startTime'
        ).reverse()[0]
        mounted.value = true
      }
    }
  )
  onBeforeUnmount(() => {
    unsubscribe()
  })
})
</script>

<template>
  <Guest simple>
    <Client v-if="schedule" :schedule="schedule" />
  </Guest>
</template>
