import type { Schema as ExecSchema } from 'read-excel-file'

import type { Utils } from '@/shared/types'

export const schema: ExecSchema = {
  'Mã sinh viên': {
    prop: 'instructorId',
    type: String,
    required: true
  },
  'Họ tên': {
    prop: 'displayName',
    type: String,
    required: true
  },
  Email: {
    prop: 'email',
    type: (value: any) => {
      if (!value.includes('@')) {
        throw new Error('Email is invalid')
      }
      return value
    },
    required: true
  },
  'Số điện thoại': {
    prop: 'phoneNumber',
    type: (value: any) => {
      const phone = value.replace(/s+/g, '')
      if (!/\+84\d{9}/.test(phone)) {
        throw new Error('Phone number is invalid')
      }
      if (phone.startsWith('0')) {
        return `+84${phone.slice(1)}`
      } else if (phone.startsWith('84')) {
        return `+${phone}`
      }
      return phone
    },
    required: true
  },
  'Mật khẩu': {
    prop: 'password',
    type: String,
    required: true
  },
  Khoa: {
    prop: 'facultyId',
    type: String,
    required: true
  },
  Khoá: {
    prop: 'batchId',
    type: String,
    required: true
  },
  Lớp: {
    prop: 'classId',
    type: String,
    required: true
  }
}

export type Schema = Utils.InferExcelSchema<typeof schema>
