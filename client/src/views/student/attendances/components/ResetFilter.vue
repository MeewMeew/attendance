<script lang="ts" setup>
import { ListRestart } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ResetFilterEmits {
  (event: 'reset:filter'): void
}

defineEmits<ResetFilterEmits>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="ghost" size="sm" @click="$emit('reset:filter')">
          <ListRestart class="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Reset filter</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
