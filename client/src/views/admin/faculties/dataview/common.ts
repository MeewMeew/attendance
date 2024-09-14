import * as z from 'zod'

export const baseSchema = z.object({
  name: z.string().min(1).max(255),
  shortName: z.string().min(1).max(20)
})

export const schemaCreate = baseSchema

export const schemaUpdate = schemaCreate.extend({
  facultyId: z.string()
})
