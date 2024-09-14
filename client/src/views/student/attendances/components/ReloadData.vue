<script lang="ts" setup>
import { RefreshCcw } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ReloadDataEmits {
  (event: 'reloadData'): void
}

defineEmits<ReloadDataEmits>()
</script>

<template>
  <div class="flex items-center space-x-2">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="sm" @click="$emit('reloadData')">
            <RefreshCcw class="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reload Data</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
