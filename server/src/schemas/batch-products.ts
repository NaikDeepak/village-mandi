import { z } from 'zod';

export const addBatchProductSchema = z
  .object({
    productId: z.string().uuid('Invalid product ID'),
    pricePerUnit: z.number().positive('Price must be positive'),
    facilitationPercent: z
      .number()
      .min(0, 'Facilitation percent must be at least 0')
      .max(100, 'Facilitation percent cannot exceed 100'),
    minOrderQty: z.number().positive('Minimum order quantity must be positive'),
    maxOrderQty: z.number().positive('Maximum order quantity must be positive').optional(),
  })
  .refine(
    (data) => {
      if (data.maxOrderQty !== undefined) {
        return data.maxOrderQty >= data.minOrderQty;
      }
      return true;
    },
    {
      message: 'Maximum order quantity must be greater than or equal to minimum order quantity',
      path: ['maxOrderQty'],
    }
  );

export const updateBatchProductSchema = z
  .object({
    pricePerUnit: z.number().positive('Price must be positive').optional(),
    facilitationPercent: z
      .number()
      .min(0, 'Facilitation percent must be at least 0')
      .max(100, 'Facilitation percent cannot exceed 100')
      .optional(),
    minOrderQty: z.number().positive('Minimum order quantity must be positive').optional(),
    maxOrderQty: z
      .number()
      .positive('Maximum order quantity must be positive')
      .nullable()
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.maxOrderQty !== undefined &&
        data.maxOrderQty !== null &&
        data.minOrderQty !== undefined
      ) {
        return data.maxOrderQty >= data.minOrderQty;
      }
      return true;
    },
    {
      message: 'Maximum order quantity must be greater than or equal to minimum order quantity',
      path: ['maxOrderQty'],
    }
  );

export type AddBatchProductInput = z.infer<typeof addBatchProductSchema>;
export type UpdateBatchProductInput = z.infer<typeof updateBatchProductSchema>;
