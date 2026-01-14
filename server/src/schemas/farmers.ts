import { z } from 'zod';

export const relationshipLevels = ['SELF', 'FAMILY', 'FRIEND', 'REFERRED'] as const;

export const createFarmerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().optional(),
  relationshipLevel: z.enum(relationshipLevels),
});

export const updateFarmerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  location: z.string().min(2, 'Location is required').optional(),
  description: z.string().optional().nullable(),
  relationshipLevel: z.enum(relationshipLevels).optional(),
  isActive: z.boolean().optional(),
});

export type CreateFarmerInput = z.infer<typeof createFarmerSchema>;
export type UpdateFarmerInput = z.infer<typeof updateFarmerSchema>;
