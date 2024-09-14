import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Classroom } from '@/database'
import type { M, O } from '@/shared/types'

export const columns = createColumns<M.Classroom.Info>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'classroomId',
    size: 'lg',
    enableSorting: false,
    meta: { title: 'views.datatable.classrooms.id' }
  },
  {
    accessorKey: 'name',
    size: 'md',
    meta: { title: 'views.datatable.classrooms.name' }
  },
  {
    accessorKey: 'used',
    size: 'md',
    meta: { title: 'views.datatable.classrooms.status' },
    inputValue: ({ row }) => (row.getValue('used') ? 'Unavailable' : 'Available')
  },
  {
    accessorKey: 'location',
    size: 'lg',
    meta: { title: 'views.datatable.classrooms.location' }
  },
  {
    accessorKey: 'capacity',
    size: 'sm',
    meta: { title: 'views.datatable.classrooms.capacity' }
  },
  {
    size: 'sm',
    meta: { title: 'views.datatable.actions' },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.classroomId,
        row: row as any,
        actions: createRowActions({
          type: 'classrooms',
          id: row.original.classroomId,
          allowDelete: true,
          sync: true
        }),
        name: 'classroom',
        remove: Classroom.remove
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'classroom',
}
