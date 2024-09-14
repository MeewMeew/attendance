import * as z from 'zod'

export const baseSchema = z.object({
  classId: z.string().min(1).max(255),
  courseId: z.string().min(1).max(255),
  classroomId: z.string().min(1).max(255),
  instructorId: z.string().min(1).max(255).optional(),
  facultyId: z.string().min(1).max(255),
  batchId: z.string().min(1).max(255),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  method: z.union([z.literal('theory'), z.literal('practice')])
})

export const schemaCreate = baseSchema

export const schemaUpdate = schemaCreate.extend({
  scheduleId: z.string().min(1).max(255)
})
