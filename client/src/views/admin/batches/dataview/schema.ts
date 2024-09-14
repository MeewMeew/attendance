import type { Schema } from 'read-excel-file'

export const schema: Schema = {
  'Tên khoá': {
    prop: 'name',
    type: String,
    required: true
  },
  'Tên viết tắt': {
    prop: 'shortName',
    type: String,
    required: true
  },
  'Năm bắt đầu': {
    prop: 'startYear',
    type: Number,
    required: true
  },
  'Năm kết thúc': {
    prop: 'endYear',
    type: Number,
    required: true
  }
}
