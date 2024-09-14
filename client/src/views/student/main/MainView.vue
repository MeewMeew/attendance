<script lang="ts" setup>
import { usePermission } from '@vueuse/core'
import { Bell } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { requestPermission } from '@/lib/permission'
import { getAcronym } from '@/lib/utils'
import type { M } from '@/shared/types'
import { useMiscStore, useUserStore } from '@/stores'

import ScannerView from './scanner/ScannerView.vue'

const notifications = usePermission('notifications')
const notificationGranted = computed(() => notifications.value === 'granted')

const userData = useUserStore()
const { faculties, batches, classes } = useMiscStore()

const user = ref(userData.user as M.User.Info<'student'>)

const fallback = ref(getAcronym(user.value.displayName))
const studentId = computed(() => user.value.studentId)
const studentName = computed(() => user.value.displayName)
const studentEmail = computed(() => user.value.email)
const studentFaculty = computed(
  () => faculties.find((f) => f.facultyId === user.value.facultyId)?.name
)
const studentBatch = computed(() => batches.find((b) => b.batchId === user.value.batchId)?.name)
const studentClassName = computed(() => classes.find((c) => c.classId === user.value.classId)?.name)
const studentLastLoginIP = computed(() => user.value.loginInfo.ip)
const studentLastLoginTime = computed(() => user.value.loginInfo.time)
const studentDeviceId = computed(() => user.value.loginInfo.deviceId)
const studentDeviceName = computed(() => user.value.loginInfo.deviceName)
</script>

<template>
  <div class="flex w-full flex-col">
    <div
      class="flex w-full flex-col items-start justify-center space-y-10 p-4 md:flex-row md:space-x-10 md:space-y-0"
    >
      <div>
        <Avatar size="lg">
          <AvatarImage :src="user.photoURL" :alt="user.displayName" />
          <AvatarFallback>{{ fallback }}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <ul class="list-inside list-disc">
          <li>
            <span>ID: </span>
            <strong>{{ studentId }}</strong>
          </li>
          <li>
            <span>Name: </span>
            <strong>{{ studentName }}</strong>
          </li>
          <li>
            <span>Email: </span>
            <strong>{{ studentEmail }}</strong>
          </li>
          <li>
            <span>Faculty: </span>
            <strong>{{ studentFaculty }}</strong>
          </li>
          <li>
            <span>Batch: </span>
            <strong>{{ studentBatch }}</strong>
          </li>
          <li>
            <span>Class: </span>
            <strong>{{ studentClassName }}</strong>
          </li>
        </ul>
      </div>
      <div>
        <ul class="list-inside list-disc">
          <li>
            <span>IP Address: </span>
            <strong>{{ studentLastLoginIP }}</strong>
          </li>
          <li>
            <span>Time: </span>
            <strong>{{ studentLastLoginTime }}</strong>
          </li>
          <li>
            <span>Device ID: </span>
            <strong>{{ studentDeviceId }}</strong>
          </li>
          <li>
            <span>Device Name: </span>
            <strong>{{ studentDeviceName }}</strong>
          </li>
        </ul>
      </div>
    </div>
    <Separator class="my-2" />
    <div class="flex w-full flex-row items-center justify-center gap-4">
      <ScannerView />
      <Button
        v-if="!notificationGranted"
        @click="
          requestPermission({
            facultyId: user.facultyId,
            batchId: user.batchId,
            classId: user.classId
          })
        "
        class="my-2 flex h-10 items-center justify-between gap-3"
      >
        <span>Enable Notifications</span>
        <Bell class="size-6" />
      </Button>
    </div>
    <Separator class="my-2" />
  </div>
</template>
