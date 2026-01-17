import { z } from 'zod';

export const inviteUserSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .refine((val) => /^\d+$/.test(val), {
      message: 'Phone number must contain only digits',
    }),
  name: z.string().min(2, 'Name is too short').optional(),
});
