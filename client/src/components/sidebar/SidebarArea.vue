<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'

import { adminMenu, instructorMenu, studentMenu } from '@/components/sidebar/config'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Student, User } from '@/database'
import { observeAuthState } from '@/lib/services'
import { cn, getAcronym } from '@/lib/utils'
import type { M, O } from '@/shared/types'
import { useSidebarStore, useUserStore } from '@/stores'

const sidebar = useSidebarStore()
const userStore = useUserStore()
const student = ref<M.Student.WithClassData | null>()

const target = ref(null)
const menuGroup = ref<O.Menu.List>()
const acronym = computed(() =>
  getAcronym(userStore.user?.displayName || userStore.user?.email || '')
)

onClickOutside(target, () => (sidebar.isOpen = false))
onMounted(() => {
  const unsubscribe = observeAuthState(async (u) => {
    try {
      if (!u) return unsubscribe()
      const data = await User.read(u.uid)
      if (!data) return unsubscribe()
      if (data.role === 'student') {
        student.value = await Student.readWithClassData(data.docId)
        menuGroup.value = studentMenu
      } else if (data.role === 'instructor') {
        menuGroup.value = instructorMenu
      } else {
        menuGroup.value = adminMenu
      }
      sidebar.initSubmenus(menuGroup.value)
    } catch (error) {
      console.error(error)
    } finally {
      unsubscribe()
    }
  })
})

const name = computed(() => userStore.user?.displayName || '')
const classname = computed(() => student.value?.class.name || '')
</script>
<template>
  <aside
    :class="
      cn(
        'absolute left-0 top-0 z-50 flex h-dvh w-80 min-w-80 flex-col justify-between lg:w-96',
        'overflow-x-hidden overflow-y-scroll bg-white shadow-lg duration-300 ease-linear',
        'dark:border dark:bg-background xl:static xl:translate-x-0',
        {
          'translate-x-0': sidebar.isOpen,
          '-translate-x-full': !sidebar.isOpen
        }
      )
    "
    ref="target"
  >
    <div class="w-full">
      <div class="m-3 flex h-20">
        <div class="flex w-full items-center justify-start space-x-2">
          <Avatar size="base" shape="square">
            <AvatarImage :src="userStore.user?.photoURL!" v-if="userStore.user?.photoURL" />
            <AvatarFallback>{{ acronym }}</AvatarFallback>
          </Avatar>

          <div class="flex w-full flex-col">
            <span class="truncate font-semibold">{{ name }}</span>
            <span class="font-normal">{{ classname }}</span>
          </div>
        </div>

        <button class="p-2 lg:hidden" @click="sidebar.isOpen = false">
          <div class="h-full">
            <X stroke-width="3px" class="text-gray-900 opacity-70 dark:text-white" :size="20" />
          </div>
        </button>
      </div>

      <nav
        :class="
          cn(
            'mt-10 flex flex-col gap-1 overflow-y-auto',
            'overflow-x-hidden duration-300 ease-linear',
            'sm:overflow-y-hidden'
          )
        "
      >
        <template v-for="(item, _index) in menuGroup" :key="_index">
          <SidebarItem :item="item" :index="_index" />
          <Separator />
        </template>
      </nav>
    </div>
  </aside>
</template>

<style scoped lang="css"></style>
