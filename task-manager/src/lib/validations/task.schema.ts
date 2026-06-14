import { z } from 'zod'

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')), 

  status: z.enum(['todo', 'in_progress', 'done'] as const, {
    error: 'Invalid status type',
  }),

  priority: z.enum(['low', 'medium', 'high'] as const, {
    error: 'Invalid priority type',
  }),

  due_date: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional()
    .or(z.literal('')),
})

export type TaskFormData = z.infer<typeof taskSchema>