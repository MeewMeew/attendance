<script lang="ts" setup>
import { RocketIcon } from '@radix-icons/vue'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { t } from '@/shared/locales'

type AlertUploadDescProps = {
  items: string[]
}

defineProps<AlertUploadDescProps>()
</script>

<template>
  <Alert>
    <RocketIcon class="h-4 w-4" />
    <AlertTitle>
      {{ t('components.upload.title') }}
    </AlertTitle>
    <AlertDescription>
      {{ t('components.upload.description') }}
      <ul class="list-inside list-disc font-medium">
        <li v-for="(item, index) in items" :key="index">{{ t(item) }}</li>
      </ul>
    </AlertDescription>
  </Alert>
</template>
