import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Course } from '@/database'
import type { M, O } from '@/shared/types'

export const columns = createColumns<M.Course.Info>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'courseId',
    enableHiding: false,
    size: 'sm',
    meta: {
      title: 'views.datatable.course.id'
    }
  },
  {
    accessorKey: 'name',
    meta: {
      title: 'views.datatable.course.name'
    }
  },
  {
    accessorKey: 'code',
    meta: {
      title: 'views.datatable.course.code'
    }
  },
  {
    accessorKey: 'credit',
    size: 'sm',
    meta: {
      title: 'views.datatable.course.credit'
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    meta: {
      title: 'views.datatable.actions'
    },
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.courseId,
        row: row as any,
        actions: createRowActions({
          type: 'courses',
          id: row.original.courseId,
          allowDelete: true
        }),
        name: 'course',
        remove: Course.remove
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'course',
}
