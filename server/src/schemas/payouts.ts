import { z } from 'zod';

export const createPayoutSchema = z.object({
  farmerId: z.string().uuid('Farmer ID must be a valid UUID'),
  amount: z.number().positive('Amount must be positive'),
  upiReference: z.string().min(1, 'UPI Reference is required'),
  paidAt: z.coerce.date().default(() => new Date()),
});

export type CreatePayoutInput = z.infer<typeof createPayoutSchema>;
