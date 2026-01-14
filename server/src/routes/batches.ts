import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import {
  type BatchStatus,
  VALID_TRANSITIONS,
  createBatchSchema,
  transitionBatchSchema,
  updateBatchSchema,
} from '../schemas/batches';

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

    return { batches };
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

    return { batch };
  });

  // ==========================================
  // GET CURRENT OPEN BATCH
  // ==========================================
  fastify.get('/batches/current', { preHandler: [requireAdmin] }, async (_request, _reply) => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'OPEN' },
      include: {
        hub: true,
      },
    });

    return { batch: batch || null };
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

    return reply.status(201).send({ batch });
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

    const updateData: Record<string, unknown> = {};
    if (parseResult.data.name) updateData.name = parseResult.data.name;
    if (parseResult.data.cutoffAt) updateData.cutoffAt = new Date(parseResult.data.cutoffAt);
    if (parseResult.data.deliveryDate)
      updateData.deliveryDate = new Date(parseResult.data.deliveryDate);

    const batch = await prisma.batch.update({
      where: { id },
      data: updateData,
      include: {
        hub: true,
      },
    });

    return { batch };
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

      // Perform transition
      const batch = await prisma.batch.update({
        where: { id },
        data: { status: targetStatus },
        include: {
          hub: true,
        },
      });

      // Log transition to EventLog
      await prisma.eventLog.create({
        data: {
          entityType: 'BATCH',
          entityId: id,
          action: 'STATUS_CHANGE',
          metadata: {
            from: currentStatus,
            to: targetStatus,
          },
        },
      });

      return { batch };
    }
  );
};

export default batchRoutes;
