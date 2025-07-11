import { z } from 'zod'

export const jobSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100, 'Company name is too long'),
  position: z.string().min(1, 'Position is required').max(100, 'Position is too long'),
  applicationDate: z.string().min(1, 'Application date is required'),
  status: z.enum(['Open', 'Rejected', 'Invited', 'Interviewed', 'Hired']),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  jobLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  followUpDate: z.string().optional(),
})

export type JobFormData = z.infer<typeof jobSchema>

export const jobUpdateSchema = jobSchema.partial().extend({
  id: z.string().min(1, 'Job ID is required'),
})

export type JobUpdateData = z.infer<typeof jobUpdateSchema> 