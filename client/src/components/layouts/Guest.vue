<script setup lang="ts">
import HeaderArea from '@/components/header/HeaderGuestArea.vue'
import GridBackgroundDots from '@/components/ui/grid-background-dots/GridBackgroundDots.vue'
import { cn } from '@/lib/utils'

interface Props {
  readonly simple?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="w-dvh md:p- flex h-dvh flex-col">
    <HeaderArea :simple="simple" />
    <main
      :class="
        cn(
          'my-8 flex flex-col items-center justify-center',
          'overflow-y-auto md:my-0 md:h-[600px]',
          'px-5 md:justify-center md:px-0'
        )
      "
    >
      <slot />
    </main>
    <GridBackgroundDots class="w-full" />
  </div>
</template>
