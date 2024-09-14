<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import HeaderAuthenticatedArea from '@/components/header/HeaderAuthenticatedArea.vue'
import SidebarArea from '@/components/sidebar/SidebarArea.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const router = useRouter()

function handleGoBack() {
  router.back()
}
</script>

<template>
  <div class="flex h-[100dvh] overflow-hidden">
    <SidebarArea />
    <div class="flex h-full w-full flex-col">
      <HeaderAuthenticatedArea />
      <main class="m-1.5 h-full space-y-4 overflow-y-auto overflow-x-hidden px-2 py-4 sm:container">
        <RouterView />
        <Button class="group m-1.5 space-x-1" variant="ghost" @click="handleGoBack">
          <ArrowLeft class="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
          <span class="group-hover:underline">Go Back</span>
        </Button>
        <Separator />
      </main>
    </div>
  </div>
</template>

<style lang="css" scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  @apply bg-primary;
}
</style>
