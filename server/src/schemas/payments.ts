import { z } from 'zod';

export const logPaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['UPI', 'CASH']),
  stage: z.enum(['COMMITMENT', 'FINAL']),
  referenceId: z.string().optional(),
  paidAt: z.string().datetime().optional(),
});

export type LogPaymentInput = z.infer<typeof logPaymentSchema>;
