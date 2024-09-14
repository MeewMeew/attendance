import type { Schema as ExecSchema } from 'read-excel-file'

import type { Utils } from '@/shared/types'

export const schema: ExecSchema = {
  'Mã môn học': {
    prop: 'code',
    type: String,
    required: true
  },
  'Tên môn học': {
    prop: 'name',
    type: String,
    required: true
  },
  'Số tín chỉ': {
    prop: 'credit',
    type: Number,
    required: true
  }
}

export type Schema = Utils.InferExcelSchema<typeof schema>
