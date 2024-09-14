import * as z from 'zod'

export const baseSchema = z.object({
  name: z.string().min(2).max(255),
  shortName: z.string().min(2).max(255),
  startYear: z.union([z.string().regex(/^\d{4}$/), z.number()]),
  endYear: z.union([z.string().regex(/^\d{4}$/), z.number()])
})
export const schemaCreate = baseSchema.refine((data) => data.endYear >= data.startYear, {
  message: 'The ending year must be greater than or equal to the first year',
  path: ['endYear'] // Specify the path where the error message should be attached
})

export const schemaUpdate = baseSchema
  .extend({
    batchId: z.string()
  })
  .refine((data) => data.endYear >= data.startYear, {
    message: 'The ending year must be greater than or equal to the first year',
    path: ['endYear'] // Specify the path where the error message should be attached
  })
