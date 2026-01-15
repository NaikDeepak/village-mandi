import { z } from 'zod';

export const createHubSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export const updateHubSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  isActive: z.boolean().optional(),
});

export type CreateHubInput = z.infer<typeof createHubSchema>;
export type UpdateHubInput = z.infer<typeof updateHubSchema>;
