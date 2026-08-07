const { z } = require('zod');

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),

  email: z.string().email(),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),

  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

export {};