<script lang="ts" setup>
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  content: string
}

defineProps<Props>()
</script>

<template>
  <TooltipProvider>
    <TooltipTrigger>
      <slot />
    </TooltipTrigger>
    <Tooltip>
      <TooltipContent>
        {{ content }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
