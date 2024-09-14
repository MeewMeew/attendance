import type { Schema } from 'read-excel-file'

export const schema: Schema = {
  'Mã giảng viên': {
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
      const phone = value.replace(/s+/g, '').replace(/'/g, '')
      if (!/\+84\d{9}/.test(phone) && !/0\d{9}/.test(phone)) {
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
  }
}
