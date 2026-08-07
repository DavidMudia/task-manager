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

  category: z
    .string()
    .max(50)
    .optional()
    .nullable(),

  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color must be a valid hex color'
    )
    .optional()
    .nullable(),

  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .nullable(),

  visibility: z
    .enum([
      'private',
      'invite-only',
      'public',
    ])
    .optional()
    .default('private'),

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