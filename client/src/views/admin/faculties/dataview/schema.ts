import type { Schema } from 'read-excel-file'

export const schema: Schema = {
  'Tên khoa': {
    prop: 'name',
    type: String,
    required: true
  },
  'Mã khoa': {
    prop: 'shortName',
    type: String,
    required: true
  }
}
