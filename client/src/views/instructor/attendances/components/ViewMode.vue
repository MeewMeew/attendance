<script lang="ts" setup>
import { ArrowUpDown } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SwitchViewModeEmits {
  (event: 'switch:viewMode'): void
}

defineEmits<SwitchViewModeEmits>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="ghost" size="sm" @click="$emit('switch:viewMode')">
          <ArrowUpDown class="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Switch View Mode</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
