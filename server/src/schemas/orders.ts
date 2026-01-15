import { z } from 'zod';

export const createOrderSchema = z.object({
  batchId: z.string().uuid('Batch ID must be a valid UUID'),
  fulfillmentType: z.enum(['PICKUP', 'DELIVERY']).default('PICKUP'),
  items: z
    .array(
      z.object({
        batchProductId: z.string().uuid('Batch Product ID must be a valid UUID'),
        orderedQty: z.number().positive('Quantity must be greater than zero'),
      })
    )
    .min(1, 'Order must contain at least one item'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
