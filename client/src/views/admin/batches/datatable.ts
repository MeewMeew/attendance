import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Batch } from '@/database'
import type { M, O } from '@/shared/types'

export const columns = createColumns<M.Batch.Info>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'batchId',
    size: 'md',
    enableSorting: false,
    meta: { title: 'views.datatable.batch.id' }
  },
  {
    accessorKey: 'name',
    size: 'md',
    meta: { title: 'views.datatable.batch.name' }
  },
  {
    accessorKey: 'shortName',
    size: 'sm',
    meta: { title: 'views.datatable.batch.short_name' }
  },
  {
    accessorKey: 'startYear',
    size: 'sm',
    meta: { title: 'views.datatable.batch.startYear' }
  },
  {
    accessorKey: 'endYear',
    size: 'sm',
    meta: { title: 'views.datatable.batch.endYear' }
  },
  {
    size: 'sm',
    meta: { title: 'views.datatable.actions' },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.batchId,
        row: row as any,
        name: 'batch',
        actions: createRowActions({ type: 'batches', id: row.original.batchId, allowDelete: true }),
        remove: Batch.remove
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'batch',
}
