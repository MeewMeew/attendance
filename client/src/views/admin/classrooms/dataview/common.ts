import * as z from 'zod'

export const baseSchema = z.object({
  name: z.string(),
  used: z.union([z.string(), z.boolean()]),
  state: z.union([z.literal('active'), z.literal('idle'), z.literal('fetching')]).default('idle'),
  location: z.string(),
  capacity: z.number()
})

export const schemaCreate = baseSchema

export const schemaUpdate = schemaCreate.extend({
  classroomId: z.string()
})
