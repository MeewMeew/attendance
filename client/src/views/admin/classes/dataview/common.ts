import * as z from 'zod'

export const baseSchema = z.object({
  batchId: z.string().max(21),
  facultyId: z.string().max(21),
  instructorId: z.string(),
  name: z.string().max(255),
  shortName: z.string().max(255),
  capacity: z.number().int().positive()
})

export const schemaCreate = baseSchema

export const schemaUpdate = schemaCreate.extend({
  classId: z.string().max(21)
})
