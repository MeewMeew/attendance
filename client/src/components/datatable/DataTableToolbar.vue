<script setup lang="ts">
import { debouncedWatch } from '@vueuse/core'
import { capitalize } from 'lodash-es'
import { Search, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import DataTableFacetedFilter from '@/components/datatable/DataTableFacetedFilter.vue'
import DataTableOptions from '@/components/datatable/DataTableOptions.vue'
import DataTableViewOptions from '@/components/datatable/DataTableViewOptions.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Other } from '@/shared/types'

const router = useRouter()

const props = defineProps<Other.DataTable.Toolbar.Props>()
const emit = defineEmits<Other.DataTable.Toolbar.Emits>()

const search = ref<string>('')
import { t } from '@/shared/locales'

debouncedWatch(
  search,
  (value) => {
    if (!value) return props.table.resetGlobalFilter()
    return props.table.setGlobalFilter(value)
  },
  { debounce: 300 }
)
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="mr-2 flex flex-1 items-center space-x-2">
      <div class="relative w-fit max-w-sm items-center">
        <Input
          :placeholder="t(`Search...`)"
          :model-value="search"
          class="h-8 min-w-[100px] px-10 outline-none lg:w-[350px]"
          @input="search = $event.target.value"
        />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
          <Search class="size-5 text-muted-foreground" />
        </span>
        <span class="absolute inset-y-0 end-1 flex items-center justify-center px-2">
          <button class="outline-primary focus:outline-1" @click="search = ''">
            <X class="size-4 text-muted-foreground" />
          </button>
        </span>
      </div>
    </div>
    <DataTableFacetedFilter
      v-if="facetedFilters && table.getColumn(facetedFilters.columnName)"
      :column="table.getColumn(facetedFilters.columnName)"
      :title="capitalize(facetedFilters.columnName)"
      :options="facetedFilters.options"
    />

    <DataTableViewOptions :table="table" />
    <Button variant="outline" size="sm" class="ml-2 h-8" as-child v-if="!hideCreate">
      <RouterLink :to="`${router.currentRoute.value.fullPath}/create`"
        >Create {{ capitalize(actor) }}</RouterLink
      >
    </Button>
    <component
      :is="customActions"
      v-if="customActions"
      @update:custom-actions="($event: any) => $emit('update:custom-actions', $event)"
    />
    <DataTableOptions
      :table="table"
      :id-to-delete="props.tableOptions?.idToDelete"
      :func-to-delete="props.tableOptions?.funcToDelete"
    />
  </div>
</template>
