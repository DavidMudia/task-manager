const { z } = require('zod');

const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name is too long'),

  description: z
    .string()
    .max(5000, 'Description is too long')
    .optional()
    .nullable(),



  maxMembers: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(20),
});

module.exports = {
  projectSchema,
};

export {};