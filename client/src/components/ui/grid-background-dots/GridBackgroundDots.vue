<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
<template>
  <div class="absolute top-0 -z-50 h-dvh">
    <div
      :class="
        cn(
          'relative flex h-dvh w-full items-center',
          'justify-center bg-white bg-dot-black/[0.2]',
          'dark:bg-black dark:bg-dot-white/[0.2]'
        )
      "
    >
      <div
        :class="
          cn(
            'pointer-events-none absolute inset-0 flex',
            'items-center justify-center bg-white',
            '[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]',
            'dark:bg-black'
          )
        "
      />
    </div>
  </div>
</template>
