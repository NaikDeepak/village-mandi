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

export const updateOrderPackingSchema = z.object({
  status: z.enum(['PACKED', 'DISTRIBUTED', 'FULLY_PAID']),
  items: z
    .array(
      z.object({
        id: z.string().uuid('Item ID must be a valid UUID'),
        finalQty: z.number().nonnegative('Final quantity cannot be negative'),
      })
    )
    .optional(),
});

export const editOrderSchema = z.object({
  fulfillmentType: z.enum(['PICKUP', 'DELIVERY']).optional(),
  items: z
    .array(
      z.object({
        batchProductId: z.string().uuid('Batch Product ID must be a valid UUID'),
        orderedQty: z.number().nonnegative('Quantity cannot be negative'),
        // qty of 0 means remove item
      })
    )
    .optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderPackingInput = z.infer<typeof updateOrderPackingSchema>;
export type EditOrderInput = z.infer<typeof editOrderSchema>;
