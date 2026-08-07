const { z } = require('zod');

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),

  description: z.string().optional().nullable(),

  status: z
    .enum([
      'backlog',
      'todo',
      'in-progress',
      'review',
      'done',
    ])
    .optional()
    .default('todo'),

  priority: z
    .enum([
      'low',
      'medium',
      'high',
      'urgent',
    ])
    .optional()
    .default('medium'),

  dueDate: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((value: string | null | undefined) => {
      if (!value) return null;
      return new Date(value);
    }),

  projectId: z.string().cuid(),

  assigneeIds: z
    .array(z.string().cuid())
    .optional()
    .default([]),
});

module.exports = {
  taskSchema,
};

export {};