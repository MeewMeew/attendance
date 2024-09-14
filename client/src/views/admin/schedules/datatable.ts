import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { h } from 'vue'

import DataTableRowActions from '@/components/datatable/DataTableRowActions.vue'
import { createColumns, createRowActions } from '@/components/datatable/template'
import { Schedule } from '@/database'
import type { M, O } from '@/shared/types'
import { useMiscStore } from '@/stores'

const { courses, faculties, batches, instructors, classes, classrooms } =
  storeToRefs(useMiscStore())

export const columns = createColumns<M.Schedule.Info>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'scheduleId',
    meta: {
      title: 'views.datatable.schedule.id',
      hidden: true
    }
  },
  {
    accessorKey: 'courseId',
    size: 'md',
    meta: {
      title: 'views.datatable.schedule.course'
    },
    inputValue: ({ row }) => {
      return (
        courses.value.find((c) => c.courseId === row.getValue('courseId'))?.name ?? 'misc.missing'
      )
    }
  },
  {
    accessorKey: 'date',
    size: 'md',
    meta: {
      title: 'views.datatable.schedule.date'
    },
    inputValue: ({ row }) => {
      return DateTime.fromJSDate(new Date(row.getValue('date'))).toFormat('yyyy-MM-dd')
    }
  },
  {
    accessorKey: 'startTime',
    size: 'sm',
    align: 'center',
    meta: {
      title: 'views.datatable.schedule.start_time'
    }
  },
  {
    accessorKey: 'endTime',
    size: 'sm',
    align: 'center',
    meta: {
      title: 'views.datatable.schedule.end_time'
    }
  },
  {
    accessorKey: 'method',
    meta: {
      title: 'views.datatable.schedule.method'
    },
    inputValue: ({ row }) => (row.getValue('method') === 'theory' ? 'Lý thuyết' : 'Thực hành')
  },
  {
    accessorKey: 'classId',
    meta: {
      title: 'views.datatable.schedule.class'
    },
    inputValue: ({ row }) =>
      classes.value.find((c) => c.classId === row.getValue('classId'))?.name ?? 'misc.missing'
  },
  {
    accessorKey: 'classroomId',
    meta: {
      title: 'views.datatable.schedule.classroom'
    },
    inputValue: ({ row }) =>
      classrooms.value.find((c) => c.classroomId === row.getValue('classroomId'))?.name ??
      'misc.missing'
  },
  {
    accessorKey: 'instructorId',
    meta: {
      title: 'views.datatable.schedule.instructor'
    },
    inputValue: ({ row }) =>
      instructors.value.find((i) => i.docId === row.getValue('instructorId'))?.displayName ??
      'misc.missing'
  },
  {
    accessorKey: 'facultyId',
    meta: {
      title: 'views.datatable.schedule.faculty',
      hidden: true
    },
    inputValue: ({ row }) =>
      faculties.value.find((f) => f.facultyId === row.getValue('facultyId'))?.name ?? 'misc.missing'
  },
  {
    accessorKey: 'batchId',
    meta: {
      title: 'views.datatable.schedule.batch'
    },
    inputValue: ({ row }) =>
      batches.value.find((b) => b.batchId === row.getValue('batchId'))?.name ?? 'misc.missing'
  },
  {
    id: 'actions',
    enableHiding: false,
    meta: {
      title: 'views.datatable.actions'
    },
    cell: ({ row }) => {
      return h(DataTableRowActions, {
        id: row.original.scheduleId,
        row: row as any,
        actions: createRowActions({
          type: 'schedules',
          id: row.getValue('scheduleId'),
          allowDelete: true
        }),
        name: 'course',
        remove: Schedule.remove
      })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'schedule',
}
