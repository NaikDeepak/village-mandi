import { z } from 'zod';

export const logCommunicationSchema = z.object({
  entityType: z.enum(['ORDER', 'BATCH', 'FARMER']),
  entityId: z.string().uuid(),
  messageType: z.string(), // e.g., 'PAYMENT_REQUEST', 'BATCH_OPEN', 'PACKED_READY'
  recipientPhone: z.string(),
  channel: z.string().default('WHATSAPP'),
  metadata: z.record(z.any()).optional(),
});

export type LogCommunicationInput = z.infer<typeof logCommunicationSchema>;
