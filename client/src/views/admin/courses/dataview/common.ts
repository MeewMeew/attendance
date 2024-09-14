import * as z from 'zod'

export const baseSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string(),
  credit: z.number().int()
})

export const schemaCreate = baseSchema

export const schemaUpdate = schemaCreate.extend({
  courseId: z.string()
})
