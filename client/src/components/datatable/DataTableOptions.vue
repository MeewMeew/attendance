<script lang="ts" setup>
import { DotsVerticalIcon } from '@radix-icons/vue'
import { type Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { t } from '@/shared/locales'

interface DataTableOptionsProps {
  table: Table<unknown>
  idToDelete?: string
  funcToDelete?: (id: string) => Promise<any>
}

const props = defineProps<DataTableOptionsProps>()
const rows = computed(() => props.table.getSelectedRowModel())
const meta = props.table.options.meta as Record<string, any>

async function deleteDocs() {
  // @ts-ignore
  const ids = Object.values(rows.value.rowsById).map((i) => i.original[props.idToDelete])
  for (const id of ids) {
    try {
      await props.funcToDelete?.(id)
      toast.success(t(`Deleted ${meta.name} successfully`))
      props.table.toggleAllPageRowsSelected(false)
    } catch (error) {
      toast.error(t(`Failed to delete ${meta.name}`))
    }
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="ml-2 px-2">
        <DotsVerticalIcon class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="deleteDocs">
        {{ t('components.datatable.options.delete_all_selected') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
