<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-icons/vue'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { t } from '@/shared/locales'
import type { Other } from '@/shared/types'

defineProps<Other.DataTable.Pagination.Props>()
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} {{ t('of') }}
      {{ table.getFilteredRowModel().rows.length }} {{ t('row(s) selected.') }}
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">{{ t('Rows per page') }}</p>
        <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="table.setPageSize as unknown as string"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in [10, 20, 30, 50, 100, table.getRowCount()].sort((a, b) => a - b)"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center justify-center text-sm font-medium md:w-[100px]">
        <p class="hidden md:block">
          Page {{ table.getState().pagination.pageIndex + 1 }} of
          {{ table.getPageCount() }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">{{ t('Go to first page') }}</span>
          <DoubleArrowLeftIcon class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">{{ t('Go to previous page') }}</span>
          <ChevronLeftIcon class="h-4 w-4" />
        </Button>
        <p class="text-sm font-medium md:hidden">
          {{ table.getState().pagination.pageIndex + 1 }}
        </p>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">{{ t('Go to next page') }}</span>
          <ChevronRightIcon class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">{{ t('Go to last page') }}</span>
          <DoubleArrowRightIcon class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
