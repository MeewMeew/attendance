<script lang="ts" setup>
import { ContextMenu } from '@/components/ui/context-menu'
import { Dialog } from '@/components/ui/dialog'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
</script>

<template>
  <Dialog>
    <ContextMenu>
      <slot name="context-menu"></slot>
    </ContextMenu>
    <DropdownMenu>
      <slot name="dropdown-menu"></slot>
    </DropdownMenu>
    <slot name="dialog"></slot>
  </Dialog>
</template>
