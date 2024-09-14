<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center text-center">
    <div class="flex h-12 flex-row items-center justify-between space-x-5">
      <h1 class="text-3xl font-medium">500</h1>
      <Separator orientation="vertical" />
      <h1 class="text-lg font-normal">Internal server error.</h1>
    </div>
  </div>
</template>
