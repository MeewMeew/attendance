import type { Schema } from 'read-excel-file'

export const schema: Schema = {
  'Tên khoa': {
    prop: 'facultyId',
    type: String,
    required: true
  },
  'Tên khoá': {
    prop: 'batchId',
    type: String,
    required: true
  },
  'Tên giảng viên': {
    prop: 'instructorId',
    type: String,
    required: true
  },
  'Tên lớp': {
    prop: 'name',
    type: String,
    required: true
  },
  'Tên viết tắt': {
    prop: 'shortName',
    type: String,
    required: true
  },
  'Số lượng sinh viên': {
    prop: 'capacity',
    type: Number,
    required: true
  }
}

export const schemaCreate = schema
export const schemaUpdate = {
  ...schema,
  'Mã lớp': {
    prop: 'code',
    type: String,
    required: true
  }
}
