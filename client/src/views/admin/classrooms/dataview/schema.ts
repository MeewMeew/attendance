import type { Schema } from 'read-excel-file'

export const schema: Schema = {
  'Tên phòng': {
    prop: 'name',
    type: String,
    required: true
  },
  'Sức chứa': {
    prop: 'capacity',
    type: Number,
    required: true
  },
  'Địa chỉ': {
    prop: 'location',
    type: String,
    required: true
  }
}
