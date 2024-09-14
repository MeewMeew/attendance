<script lang="ts" setup>
import { toRef } from 'vue'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { t } from '@/shared/locales'

interface SidebarNavProps {
  items: {
    label: string
    value: string
    active: boolean
  }[]
}

const props = defineProps<SidebarNavProps>()
const items = toRef(props, 'items')

function setActive(value: string) {
  items.value.forEach((item) => {
    item.active = item.value === value
  })
}
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
    <Button
      variant="secondary"
      v-for="(item, index) in items"
      :key="index"
      :class="cn('w-32 lg:w-full', item.active && 'bg-primary text-foreground', 'lg:justify-start')"
      :onClick="() => setActive(item.value)"
    >
      {{ t(item.label) }}
    </Button>
  </nav>
</template>
