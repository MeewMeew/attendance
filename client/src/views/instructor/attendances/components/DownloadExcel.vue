<script lang="ts" setup>
import { Download } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DownloadExcelEmits {
  (event: 'downloadExcel'): void
}

defineEmits<DownloadExcelEmits>()
</script>

<template>
  <div class="flex items-center space-x-2">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="sm" @click="$emit('downloadExcel')">
            <Download class="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download Excel</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
