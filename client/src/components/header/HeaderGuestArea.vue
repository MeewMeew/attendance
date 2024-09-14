<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { computed } from 'vue'

import { Button } from '@/components/ui/button'
import { useThemeStore, useUserStore } from '@/stores'

interface HeaderGuestAreaProps {
  simple?: boolean
}

const props = defineProps<HeaderGuestAreaProps>()

const themeStore = useThemeStore()
const { user } = useUserStore()

const isSignedIn = computed(() => user)
const routerTo = computed(() => {
  if (isSignedIn.value) {
    return `/${user.role}`
  }
  return '/sign-in'
})
const toMessage = computed(() => (isSignedIn.value ? 'Dashboard' : 'Sign In'))
</script>

<template>
  <header class="flex h-16 min-w-80 flex-wrap items-center bg-transparent px-4 py-1 lg:px-16">
    <div class="flex flex-1 items-center justify-start">
      <router-link to="/" class="flex items-center justify-center space-x-2">
        <img src="@/assets/hactech.png" class="h-[30px] w-[51px]" />
        <span class="hidden text-xl font-semibold sm:block">Attendance Management</span>
        <span class="block text-xl font-semibold sm:hidden">Attendance</span>
      </router-link>
    </div>
    <Button variant="ghost" size="icon" @click="themeStore.toggleTheme" class="mx-3 rounded-full">
      <Sun v-if="themeStore.theme.dark" />
      <Moon v-else />
    </Button>
    <Button as-child v-if="!props.simple">
      <RouterLink :to="routerTo">
        {{ toMessage }}
      </RouterLink>
    </Button>
  </header>
</template>
