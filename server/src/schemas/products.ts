import { z } from 'zod';

export const productUnits = ['KG', 'LITRE', 'DOZEN', 'PIECE', 'BUNCH', 'BAG'] as const;

export const createProductSchema = z.object({
  farmerId: z.string().uuid('Invalid farmer ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
  seasonStart: z.string().datetime().optional().nullable(),
  seasonEnd: z.string().datetime().optional().nullable(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  unit: z.string().min(1, 'Unit is required').optional(),
  description: z.string().optional().nullable(),
  seasonStart: z.string().datetime().optional().nullable(),
  seasonEnd: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
