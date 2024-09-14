import { storeToRefs } from 'pinia'
import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Axios } from '@/lib/axios'
import type { M, O } from '@/shared/types'
import { useMiscStore } from '@/stores'

const { faculties, batches, classes } = storeToRefs(useMiscStore())

export const columns = createColumns<M.User.Info<'student'>>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'docId',
    meta: {
      title: 'views.datatable.student.doc_id',
      hidden: true
    }
  },
  {
    accessorKey: 'studentId',
    enableHiding: false,
    size: 'sm',
    meta: {
      title: 'views.datatable.student.id'
    }
  },
  {
    accessorKey: 'phoneNumber',
    size: 'md',
    meta: {
      title: 'views.datatable.student.phone'
    }
  },
  {
    accessorKey: 'email',
    size: 'xl',
    meta: {
      title: 'views.datatable.student.email'
    }
  },
  {
    accessorKey: 'facultyId',
    size: 'md',
    meta: {
      title: 'views.datatable.faculty.name'
    },
    inputValue: (row) => {
      return (
        faculties.value.find((f) => f.facultyId === row.row.getValue('facultyId'))?.name ??
        'misc.missing'
      )
    }
  },
  {
    accessorKey: 'batchId',
    size: 'md',
    meta: {
      title: 'views.datatable.batch.name'
    },
    inputValue: (row) =>
      batches.value.find((f) => f.batchId === row.row.getValue('batchId'))?.name ?? 'misc.missing'
  },
  {
    accessorKey: 'classId',
    size: 'md',
    meta: {
      title: 'views.datatable.class.name'
    },
    inputValue: ({ row }) =>
      classes.value.find((f) => f.classId === row.getValue('classId'))?.name ?? 'N/A'
  },
  {
    isActionsColumn: true,
    meta: {
      title: 'views.datatable.actions'
    },
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.docId,
        row: row as any,
        actions: createRowActions({ type: 'students', id: row.original.docId, allowDelete: true }),
        name: 'student',
        remove: () => Axios.remove(`/student/${row.original.docId}`)
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'student',
}
