<script lang="ts" setup>
import { useIntervalFn, useMagicKeys } from '@vueuse/core'
import { onSnapshot, query, QueryConstraint, where } from 'firebase/firestore'
import { sortBy } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import CheckNetworkConnection from '@/components/common/CheckNetworkConnection.vue'
import TransparentOverlay from '@/components/common/TransparentOverlay.vue'
import Preload from '@/components/layouts/Preload.vue'
import { Toaster as Sonner } from '@/components/ui/sonner'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useSeo } from '@/composables/useSeo'
import { protectSourceCode } from '@/lib/misc'
import { onMessageReceived } from '@/lib/permission'
import { collection, observeAuthState } from '@/lib/services'
import { useMiscStore, useNanoIDStore, useThemeStore, useUserStore } from '@/stores'

import { combineDateAndTime, isDateInRange, timeNowFormat } from './lib/luxon'
import { generatePath } from './lib/utils'
import { type M } from './shared/types'

const router = useRouter()

const { nanoid } = useNanoIDStore()
const miscStore = useMiscStore()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { shift, alt, l, d } = useMagicKeys()
const { preload } = storeToRefs(miscStore)

const mounted = ref(false)
const schedule = ref<M.Schedule.Info | null>(null)
const theme = computed(() => (themeStore.theme.dark ? 'dark' : 'light'))
const queries = computed(() => {
  const queries: QueryConstraint[] = []
  queries.push(where('classroomId', '==', nanoid))
  queries.push(where('date', '==', timeNowFormat('yyyy-MM-dd')))
  return queries
})

onMounted(async () => {
  useSeo()
  protectSourceCode()
  userStore.fetch()
  themeStore.init()
  onMessageReceived()
  observeAuthState(async (user) => {
    if (user?.uid) return await miscStore.fetchAll()
    else {
      const id = localStorage.getItem('nanoid')
      localStorage.clear()
      if (id) {
        localStorage.setItem('nanoid', id)
      }
    }
  })

  const unsubscribe = onSnapshot(query(collection('schedules'), ...queries.value), (snapshot) => {
    if (mounted.value)
      snapshot.docChanges().forEach(async (change) => {
        schedule.value = change.doc.data() as M.Schedule.Info
        toast.info('Schedule updated.')
      })
    else {
      schedule.value = sortBy(
        snapshot.docs.map((doc) => doc.data() as M.Schedule.Info),
        'startTime'
      ).reverse()[0]
      mounted.value = true
    }
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })

  useIntervalFn(async () => {
    if (schedule.value) {
      const now = timeNowFormat()
      const rangeStart = combineDateAndTime(schedule.value.date, schedule.value.startTime)
      const rangeEnd = combineDateAndTime(schedule.value.date, schedule.value.endTime)
      if (isDateInRange(now, rangeStart, rangeEnd)) {
        router.push(generatePath('/client'))
      } else {
        if (router.currentRoute.value.path === '/client') {
          router.push(generatePath('/'))
        }
      }
    } else {
      if (router.currentRoute.value.path === '/client') {
        router.push(generatePath('/'))
      }
    }
  }, 1000)
})

watchEffect(() => {
  if (shift.value && alt.value) {
    if (l.value) {
      if (theme.value === 'light') return
      themeStore.setDarkMode(false)
      toast.success('Switched to light theme.')
    }
    if (d.value) {
      if (theme.value === 'dark') return
      themeStore.setDarkMode(true)
      toast.success('Switched to dark theme.')
    }
  }
})
</script>

<template>
  <CheckNetworkConnection />
  <TransparentOverlay />
  <router-view />
  <Toaster />
  <Sonner rich-colors :theme="theme" expand />
  <Preload v-if="preload" @transition-is-over="miscStore.setPreload(false)" />
</template>
