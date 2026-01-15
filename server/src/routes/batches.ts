import type { FastifyPluginAsync } from 'fastify';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  type BatchStatus,
  VALID_TRANSITIONS,
  createBatchSchema,
  transitionBatchSchema,
  updateBatchSchema,
} from '../schemas/batches';

// Helper to enrich batch with allowed transitions
const withAllowedTransitions = <T extends { status: string }>(batch: T) => ({
  ...batch,
  allowedTransitions: VALID_TRANSITIONS[batch.status as BatchStatus] as readonly string[],
});

const batchRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET ALL BATCHES
  // ==========================================
  fastify.get('/batches', { preHandler: [requireAdmin] }, async (request, _reply) => {
    const { status } = request.query as { status?: string };

    const batches = await prisma.batch.findMany({
      where: status ? { status: status as BatchStatus } : {},
      include: {
        hub: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { batches: batches.map(withAllowedTransitions) };
  });

  // ==========================================
  // GET CURRENT OPEN BATCH
  // ==========================================
  fastify.get('/batches/current', { preHandler: [authenticate] }, async (_request, _reply) => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'OPEN' },
      include: {
        hub: true,
      },
    });

    return { batch: batch ? withAllowedTransitions(batch) : null };
  });

  // ==========================================
  // GET SINGLE BATCH
  // ==========================================
  fastify.get('/batches/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        hub: true,
      },
    });

    if (!batch) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch not found',
      });
    }

    return { batch: withAllowedTransitions(batch) };
  });

  // ==========================================
  // CREATE BATCH
  // ==========================================
  fastify.post('/batches', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parseResult = createBatchSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { hubId, name, cutoffAt, deliveryDate } = parseResult.data;

    // Verify hub exists
    const hub = await prisma.hub.findUnique({ where: { id: hubId } });
    if (!hub) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Hub not found',
      });
    }

    const batch = await prisma.batch.create({
      data: {
        hubId,
        name,
        cutoffAt: new Date(cutoffAt),
        deliveryDate: new Date(deliveryDate),
        status: 'DRAFT',
      },
      include: {
        hub: true,
      },
    });

    return reply.status(201).send({ batch: withAllowedTransitions(batch) });
  });

  // ==========================================
  // UPDATE BATCH (DRAFT only)
  // ==========================================
  fastify.put('/batches/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parseResult = updateBatchSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    // Check batch exists
    const existing = await prisma.batch.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch not found',
      });
    }

    // Only DRAFT batches can be updated
    if (existing.status !== 'DRAFT') {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Only DRAFT batches can be updated',
      });
    }

    const { name, cutoffAt, deliveryDate } = parseResult.data;

    const nextCutoffAt = cutoffAt ? new Date(cutoffAt) : new Date(existing.cutoffAt);
    const nextDeliveryDate = deliveryDate
      ? new Date(deliveryDate)
      : new Date(existing.deliveryDate);

    if (Number.isNaN(nextCutoffAt.getTime()) || Number.isNaN(nextDeliveryDate.getTime())) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid cutoff or delivery date',
      });
    }

    // Keep invariants consistent with create
    if (nextCutoffAt.getTime() <= Date.now()) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Cutoff time must be in the future',
      });
    }

    if (nextDeliveryDate <= nextCutoffAt) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Delivery date must be after cutoff time',
      });
    }

    const updateData = {
      ...(name !== undefined ? { name } : {}),
      ...(cutoffAt !== undefined ? { cutoffAt: nextCutoffAt } : {}),
      ...(deliveryDate !== undefined ? { deliveryDate: nextDeliveryDate } : {}),
    };

    const batch = await prisma.batch.update({
      where: { id },
      data: updateData,
      include: {
        hub: true,
      },
    });

    return { batch: withAllowedTransitions(batch) };
  });

  // ==========================================
  // TRANSITION BATCH STATE
  // ==========================================
  fastify.post(
    '/batches/:id/transition',
    { preHandler: [requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const parseResult = transitionBatchSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const { targetStatus } = parseResult.data;

      // Check batch exists
      const existing = await prisma.batch.findUnique({ where: { id } });
      if (!existing) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Batch not found',
        });
      }

      const currentStatus = existing.status as BatchStatus;

      // Validate transition
      const validNextStates = VALID_TRANSITIONS[currentStatus] as readonly string[];
      if (!validNextStates.includes(targetStatus)) {
        return reply.status(400).send({
          error: 'Invalid Transition',
          message: `Cannot transition from ${currentStatus} to ${targetStatus}. Valid next states: ${validNextStates.join(', ') || 'none (terminal state)'}`,
        });
      }

      // Additional validation: cannot transition to OPEN if cutoff is in the past
      if (targetStatus === 'OPEN' && new Date(existing.cutoffAt) <= new Date()) {
        return reply.status(400).send({
          error: 'Invalid Transition',
          message: 'Cannot transition to OPEN: cutoff time is in the past',
        });
      }

      // Perform transition and log event in a single transaction
      const [batch] = await prisma.$transaction([
        prisma.batch.update({
          where: { id },
          data: { status: targetStatus },
          include: {
            hub: true,
          },
        }),
        prisma.eventLog.create({
          data: {
            entityType: 'BATCH',
            entityId: id,
            action: 'STATUS_CHANGE',
            metadata: {
              from: currentStatus,
              to: targetStatus,
            },
          },
        }),
      ]);

      return { batch: withAllowedTransitions(batch) };
    }
  );
};

export default batchRoutes;
