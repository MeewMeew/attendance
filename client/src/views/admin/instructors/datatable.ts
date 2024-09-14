import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Axios } from '@/lib/axios'
import type { M, O } from '@/shared/types'
import { useMiscStore } from '@/stores'

const { faculties } = useMiscStore()

export const columns = createColumns<M.User.Info<'instructor'>>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'instructorId',
    meta: {
      title: 'views.datatable.instructor.id'
    }
  },
  {
    accessorKey: 'displayName',
    meta: {
      title: 'views.datatable.instructor.name'
    }
  },
  {
    accessorKey: 'phoneNumber',
    meta: {
      title: 'views.datatable.instructor.phone'
    }
  },
  {
    accessorKey: 'email',
    meta: {
      title: 'views.datatable.instructor.email'
    }
  },
  {
    accessorKey: 'facultyId',
    meta: {
      title: 'views.datatable.faculty.name'
    },
    inputValue: ({ row }) => {
      const name = faculties.find((f) => f.facultyId === row.getValue('facultyId'))?.name ?? 'N/A'
      return name
    }
  },
  {
    meta: {
      title: 'views.datatable.actions'
    },
    enableHiding: false,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.docId,
        row: row as any,
        actions: createRowActions({
          type: 'instructors',
          id: row.original.docId,
          allowDelete: true
        }),
        name: 'instructor',
        remove: () => Axios.remove<void>(`/instructor/${row.original.docId}`)
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'instructor',
}
