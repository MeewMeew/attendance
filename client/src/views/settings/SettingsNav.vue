<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Item {
  title: string
  value: string
}

const props = defineProps<{
  currentTab: string
}>()

const emit = defineEmits<{
  (event: 'currentTab', value: string): void
}>()

const settingsNavItems: Item[] = [
  {
    title: 'Appearance',
    value: 'appearance'
  },
  {
    title: 'Account',
    value: 'account'
  }
]
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <Button
      v-for="item in settingsNavItems"
      :key="item.title"
      variant="ghost"
      :class="
        cn(
          'w-full text-center lg:justify-start lg:text-left',
          item.value === props.currentTab && 'bg-muted hover:bg-muted'
        )
      "
      @click="emit('currentTab', item.value)"
    >
      {{ item.title }}
    </Button>
  </nav>
</template>

<style scoped lang="css"></style>
