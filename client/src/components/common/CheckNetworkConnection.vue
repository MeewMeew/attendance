<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import { t } from '@/shared/locales'

const online = ref(navigator.onLine)

function onOffline() {
  toast.error(t('No network connection!'))
}

function onOnline() {
  toast.success(t('Network connection restored!'))
}

function handleNetworkChange() {
  online.value = navigator.onLine
  if (!online.value) onOffline()
  else onOnline()
}

onMounted(() => {
  window.addEventListener('online', handleNetworkChange)
  window.addEventListener('offline', handleNetworkChange)
})

onUnmounted(() => {
  window.removeEventListener('online', handleNetworkChange)
  window.removeEventListener('offline', handleNetworkChange)
})
</script>

<template>
  <div class="hidden">{{ t('Checking network connection...') }}</div>
</template>
