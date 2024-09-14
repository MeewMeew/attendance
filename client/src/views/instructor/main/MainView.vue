<script lang="ts" setup>
import { computed, ref } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getAcronym } from '@/lib/utils'
import type { M } from '@/shared/types'
import { useMiscStore, useUserStore } from '@/stores'

const userData = useUserStore()
const { faculties } = useMiscStore()

const user = ref(userData.user as M.User.Info<'instructor'>)

const fallback = ref(getAcronym(user.value.displayName))
const instructorId = computed(() => user.value.instructorId)
const instructorName = computed(() => user.value.displayName)
const instructorEmail = computed(() => user.value.email)
const instructorFaculty = computed(
  () => faculties.find((f) => f.facultyId === user.value.facultyId)?.name
)
const instructorLastLoginIP = computed(() => user.value.loginInfo.ip)
const instructorLastLoginTime = computed(() => user.value.loginInfo.time)
const instructorDeviceId = computed(() => user.value.loginInfo.deviceId)
const instructorDeviceName = computed(() => user.value.loginInfo.deviceName)
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
            <strong>{{ instructorId }}</strong>
          </li>
          <li>
            <span>Name: </span>
            <strong>{{ instructorName }}</strong>
          </li>
          <li>
            <span>Email: </span>
            <strong>{{ instructorEmail }}</strong>
          </li>
          <li>
            <span>Faculty: </span>
            <strong>{{ instructorFaculty }}</strong>
          </li>
        </ul>
      </div>
      <div>
        <ul class="list-inside list-disc">
          <li>
            <span>IP Address: </span>
            <strong>{{ instructorLastLoginIP }}</strong>
          </li>
          <li>
            <span>Time: </span>
            <strong>{{ instructorLastLoginTime }}</strong>
          </li>
          <li>
            <span>Device ID: </span>
            <strong>{{ instructorDeviceId }}</strong>
          </li>
          <li>
            <span>Device Name: </span>
            <strong>{{ instructorDeviceName }}</strong>
          </li>
        </ul>
      </div>
    </div>
    <Separator class="my-2" />
  </div>
</template>
