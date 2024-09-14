import { h } from 'vue'

import { createColumns } from '@/components/datatable/template'
import type { O } from '@/shared/types'

import CustomActions from './components/CustomActions.vue'
import RowActions from './components/RowActions.vue'

export interface AttendanceRecordClassColumns {
  scheduleId: string,
  studentId: string,
  userId: string,
  studentName: string,
  attendanceId: string,
  sessionId: string,
  status: string,
  time: string,
  note: string
}

export const columns = createColumns<AttendanceRecordClassColumns>(
  {
    isSelectColumn: true
  },
  {
    accessorKey: 'scheduleId',
    size: 'md',
    enableSorting: false,
    meta: { title: 'Schedule ID', hidden: true }
  },
  {
    accessorKey: 'attendanceId',
    size: 'md',
    enableSorting: false,
    meta: { title: 'Attendance ID', hidden: true }
  },
  {
    accessorKey: 'sessionId',
    size: 'md',
    enableSorting: false,
    meta: { title: 'Session ID', hidden: true }
  },
  {
    accessorKey: 'userId',
    size: 'md',
    enableSorting: false,
    meta: { title: 'User ID', hidden: true }
  },
  {
    accessorKey: 'studentId',
    size: 'md',
    meta: { title: 'Student ID' }
  },
  {
    accessorKey: 'studentName',
    size: 'md',
    meta: { title: 'Student Name' }
  },
  {
    accessorKey: 'status',
    size: 'sm',
    meta: { title: 'Status' }
  },
  {
    accessorKey: 'time',
    size: 'md',
    meta: { title: 'Time' }
  },
  {
    accessorKey: 'note',
    size: 'md',
    meta: { title: 'Note' }
  },
  {
    size: 'sm',
    meta: { title: 'views.datatable.actions' },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      return h(RowActions, { studentId: row.getValue('userId') as string, sessionId: row.getValue('sessionId') as string })
    }
  }
)

export const toolbar: Omit<O.DataTable.Toolbar.Props, 'table'> = {
  actor: 'attendance',
  hideCreate: true,
  customActions: CustomActions
}
