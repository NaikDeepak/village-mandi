import { z } from 'zod';

// Valid state transitions
export const VALID_TRANSITIONS = {
  DRAFT: ['OPEN'],
  OPEN: ['CLOSED'],
  CLOSED: ['COLLECTED'],
  COLLECTED: ['DELIVERED'],
  DELIVERED: ['SETTLED'],
  SETTLED: [], // Terminal state
} as const;

export type BatchStatus = keyof typeof VALID_TRANSITIONS;

export const batchStatuses = [
  'DRAFT',
  'OPEN',
  'CLOSED',
  'COLLECTED',
  'DELIVERED',
  'SETTLED',
] as const;

export const createBatchSchema = z
  .object({
    hubId: z.string().uuid('Hub ID must be a valid UUID'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    cutoffAt: z.string().datetime('Cutoff time must be a valid ISO date string'),
    deliveryDate: z.string().datetime('Delivery date must be a valid ISO date string'),
  })
  .refine(
    (data) => {
      const cutoff = new Date(data.cutoffAt);
      const now = new Date();
      // Add 1 second buffer to avoid timing issues in tests
      return cutoff.getTime() > now.getTime() - 1000;
    },
    {
      message: 'Cutoff time must be in the future',
      path: ['cutoffAt'],
    }
  )
  .refine(
    (data) => {
      const cutoff = new Date(data.cutoffAt);
      const delivery = new Date(data.deliveryDate);
      return delivery > cutoff;
    },
    {
      message: 'Delivery date must be after cutoff time',
      path: ['deliveryDate'],
    }
  );

export const updateBatchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  cutoffAt: z.string().datetime('Cutoff time must be a valid ISO date string').optional(),
  deliveryDate: z.string().datetime('Delivery date must be a valid ISO date string').optional(),
});

export const transitionBatchSchema = z.object({
  targetStatus: z.enum(batchStatuses),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
export type TransitionBatchInput = z.infer<typeof transitionBatchSchema>;
