<script lang="ts" setup>
import { computed } from 'vue'

import { Separator } from '@/components/ui/separator'

import SidebarNav from './SidebarNav.vue'

interface FormLayoutProps {
  items: {
    label: string
    value: string
    active: boolean
  }[]
}

const props = defineProps<FormLayoutProps>()

const item = computed(() => props.items.find((item) => item.active)?.value || 'manual')
</script>

<template>
  <div class="space-y-6 lg:p-10">
    <Separator class="mb-6" />
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="lg:-mx-4 lg:w-1/5">
        <SidebarNav :items="items" />
      </aside>
      <div class="flex-1 lg:max-w-2xl">
        <div class="space-y-6">
          <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
