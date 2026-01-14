import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { createHubSchema, updateHubSchema } from '../schemas/hubs';

const hubRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET ALL HUBS
  // ==========================================
  fastify.get('/hubs', { preHandler: [requireAdmin] }, async (_request, _reply) => {
    const hubs = await prisma.hub.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return { hubs };
  });

  // ==========================================
  // GET SINGLE HUB
  // ==========================================
  fastify.get('/hubs/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const hub = await prisma.hub.findUnique({
      where: { id },
    });

    if (!hub) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Hub not found',
      });
    }

    return { hub };
  });

  // ==========================================
  // CREATE HUB
  // ==========================================
  fastify.post('/hubs', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parseResult = createHubSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const hub = await prisma.hub.create({
      data: parseResult.data,
    });

    return reply.status(201).send({ hub });
  });

  // ==========================================
  // UPDATE HUB
  // ==========================================
  fastify.put('/hubs/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parseResult = updateHubSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    // Check hub exists
    const existing = await prisma.hub.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Hub not found',
      });
    }

    const hub = await prisma.hub.update({
      where: { id },
      data: parseResult.data,
    });

    return { hub };
  });

  // ==========================================
  // DELETE HUB (Soft Delete)
  // ==========================================
  fastify.delete('/hubs/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    // Check hub exists
    const existing = await prisma.hub.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Hub not found',
      });
    }

    // Soft delete - set isActive to false
    await prisma.hub.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true, message: 'Hub deactivated successfully' };
  });
};

export default hubRoutes;
