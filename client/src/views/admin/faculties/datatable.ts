import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Faculty } from '@/database'
import type { M, O } from '@/shared/types'

export const columns = createColumns<M.Faculty.Info>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'facultyId',
    meta: {
      title: 'views.datatable.faculty.id'
    }
  },
  {
    accessorKey: 'name',
    meta: {
      title: 'views.datatable.faculty.name'
    }
  },
  {
    accessorKey: 'shortName',
    meta: {
      title: 'views.datatable.faculty.short_name'
    }
  },
  {
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.facultyId,
        row: row as any,
        actions: createRowActions({
          type: 'facultis',
          id: row.original.facultyId,
          allowDelete: true
        }),
        name: 'faculty',
        remove: Faculty.remove
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'faculties',
}
