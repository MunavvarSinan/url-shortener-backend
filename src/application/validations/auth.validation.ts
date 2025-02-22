import { z } from 'zod';

export const authValidation = {
  signup: {
    body: z.object({
      username: z.string({ required_error: 'Username is required' }).min(1, 'Username is required'),
      email: z
        .string({ required_error: 'Email is required' })
        .email({
          message: 'Please enter a valid email address',
        })
        .min(1, 'Email is required'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        )
        .min(1, 'Password is required'),
    }),
  },
  login: {
    body: z.object({
      email: z
        .string()
        .email({
          message: 'Please enter a valid email address',
        })
        .min(1, 'Email is required'),
      password: z.string().min(1, 'Password is required'),
    }),
  },
};
