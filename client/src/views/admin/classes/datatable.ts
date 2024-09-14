import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Class } from '@/database'
import { t } from '@/shared/locales'
import type { M, O } from '@/shared/types'
import { useMiscStore } from '@/stores'

const { faculties, batches, instructors } = useMiscStore()

export const columns = createColumns<M.Class.Info>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'classId',
    size: 'md',
    enableHiding: false,
    enableSorting: false,
    meta: { title: 'views.datatable.class.id' }
  },
  {
    accessorKey: 'name',
    size: 'md',
    meta: { title: 'views.datatable.class.name' }
  },
  {
    accessorKey: 'shortName',
    size: 'md',
    meta: { title: 'views.datatable.class.short_name' }
  },
  {
    accessorKey: 'capacity',
    size: 'md',
    meta: { title: 'views.datatable.class.capacity' }
  },
  {
    accessorKey: 'facultyId',
    size: 'md',
    meta: { title: 'views.datatable.faculty.name' },
    inputValue: ({ row }) => {
      const original = row.original as M.Faculty.Info
      const faculty = faculties.find((faculty) => faculty.facultyId === original.facultyId)
      return faculty ? faculty.name : t('misc.missing', { a: 'faculty' })
    }
  },
  {
    accessorKey: 'batchId',
    size: 'md',
    meta: { title: 'views.datatable.batch.name' },
    inputValue: ({ row }) => {
      const batch = batches.find((batch) => batch.batchId === row.getValue('batchId'))
      return batch ? batch.name : t('misc.missing', { a: 'batch' })
    }
  },
  {
    accessorKey: 'instructorId',
    size: 'md',
    meta: { title: 'views.datatable.instructor.name' },
    inputValue: ({ row }) => {
      const instructor = instructors.find(
        (instructor) => instructor.docId === row.getValue('instructorId')
      )
      return instructor ? instructor.displayName : t('misc.missing', { a: 'instructor' })
    }
  },
  {
    size: 'sm',
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    meta: { title: 'views.datatable.actions' },
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.classId,
        row: row as any,
        actions: createRowActions({ type: 'classes', id: row.original.classId, allowDelete: true }),
        remove: Class.remove,
        name: 'class'
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'class',
}
