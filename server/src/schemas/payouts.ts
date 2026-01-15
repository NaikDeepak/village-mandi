import { z } from 'zod';

export const createPayoutSchema = z.object({
  farmerId: z.string().uuid(),
  amount: z.number().positive(),
  upiReference: z.string().min(1),
  paidAt: z.string().datetime(),
});

export type CreatePayoutInput = z.infer<typeof createPayoutSchema>;
