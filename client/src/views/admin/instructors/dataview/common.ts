import * as z from 'zod'

export const baseSchema = z.object({
  instructorId: z.string().startsWith('CD').min(8).max(8),
  displayName: z.string().min(1).max(255),
  email: z.string().email(),
  phoneNumber: z.string().startsWith('+84'),
  facultyId: z.string(),
  role: z.string().default('instructor')
})

export const schemaCreate = baseSchema.extend({
  password: z.string().min(8).max(255)
})

export const schemaUpdate = schemaCreate.extend({
  password: z.string().optional(),
  docId: z.string().default('')
})
