<script setup lang="ts">
import { MixerHorizontalIcon } from '@radix-icons/vue'
import { computed } from 'vue'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { t } from '@/shared/locales'
import type { Other } from '@/shared/types'
const props = defineProps<Other.DataTable.ViewOption.Props>()

const columns = computed(() => props.table.getAllColumns().filter((column) => column.getCanHide()))
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="ml-auto flex h-8">
        <MixerHorizontalIcon class="mr-2 h-4 w-4" />
        {{ t('View') }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[150px]">
      <DropdownMenuLabel>{{ t('Toggle columns') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize"
        :checked="column.getIsVisible()"
        @update:checked="(value) => column.toggleVisibility(!!value)"
      >
        {{
          t((column.columnDef.meta as Other.DataTable.ViewOption.Column.Meta)?.title || column.id)
        }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
