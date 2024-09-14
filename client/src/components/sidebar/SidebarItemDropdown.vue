<script setup lang="ts">
import { cn } from '@/lib/utils'
import { t } from '@/shared/locales'
import type { O } from '@/shared/types'
import { useSidebarStore } from '@/stores'

const props = defineProps<O.Menu.MenuItemProps>()
const sidebar = useSidebarStore()
</script>

<template>
  <router-link
    v-if="!props.item.children"
    variant="ghost"
    :to="props.item.route"
    @click="sidebar.toggle"
    :class="
      cn(
        'inline-flex w-full items-center justify-center',
        'whitespace-nowrap rounded-md px-5 text-sm font-medium',
        'ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'hover:bg-accent hover:text-accent-foreground',
        'h-10 px-4 py-2 pl-10'
      )
    "
  >
    <div class="flex flex-1 items-center space-x-5">
      <component :is="props.item.icon" :size="26" class="text-primary" stroke-width="1.5px" />
      <span class="cursor-pointer duration-300 ease-in-out">{{ t(item.label) }}</span>
    </div>
  </router-link>
</template>

<style scoped lang="css"></style>
