<script lang="ts" setup>
import { computed } from 'vue'

import { useSettingStore } from '@/stores'
const { settings } = useSettingStore()

interface TransparentOverlayProps {
  overlay?: boolean
}

const props = defineProps<TransparentOverlayProps>()

const show = computed(() => props.overlay || settings.overlay)
</script>

<template>
  <div
    class="fixed inset-0 z-[99999] flex h-dvh w-screen justify-center bg-background/60 md:items-center"
    v-if="show"
  >
    <slot />
  </div>
</template>
