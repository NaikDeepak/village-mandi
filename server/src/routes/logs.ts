import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { logCommunicationSchema } from '../schemas/logs';

const logRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // LOG COMMUNICATION EVENT
  // ==========================================
  fastify.post('/logs/communication', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parseResult = logCommunicationSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { entityType, entityId, messageType, recipientPhone, channel, metadata } =
      parseResult.data;

    const log = await prisma.eventLog.create({
      data: {
        entityType,
        entityId,
        action: 'COMMUNICATION_SENT',
        metadata: {
          ...metadata,
          messageType,
          recipientPhone,
          channel,
        },
      },
    });

    return reply.status(201).send({ log });
  });

  // ==========================================
  // GET COMMUNICATION HISTORY FOR ENTITY
  // ==========================================
  fastify.get(
    '/logs/communication/:entityType/:entityId',
    { preHandler: [requireAdmin] },
    async (request, _reply) => {
      const { entityType, entityId } = request.params as { entityType: string; entityId: string };

      const logs = await prisma.eventLog.findMany({
        where: {
          entityType,
          entityId,
          action: 'COMMUNICATION_SENT',
        },
        orderBy: { createdAt: 'desc' },
      });

      return { logs };
    }
  );
};

export default logRoutes;
