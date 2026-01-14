import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { createFarmerSchema, updateFarmerSchema } from '../schemas/farmers';

const farmerRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET ALL FARMERS
  // ==========================================
  fastify.get('/farmers', { preHandler: [requireAdmin] }, async (request, _reply) => {
    const { includeInactive } = request.query as { includeInactive?: string };

    const farmers = await prisma.farmer.findMany({
      where: includeInactive === 'true' ? {} : { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { farmers };
  });

  // ==========================================
  // GET SINGLE FARMER
  // ==========================================
  fastify.get('/farmers/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const farmer = await prisma.farmer.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!farmer) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Farmer not found',
      });
    }

    return { farmer };
  });

  // ==========================================
  // CREATE FARMER
  // ==========================================
  fastify.post('/farmers', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parseResult = createFarmerSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const farmer = await prisma.farmer.create({
      data: parseResult.data,
    });

    return reply.status(201).send({ farmer });
  });

  // ==========================================
  // UPDATE FARMER
  // ==========================================
  fastify.put('/farmers/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parseResult = updateFarmerSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    // Check farmer exists
    const existing = await prisma.farmer.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Farmer not found',
      });
    }

    const farmer = await prisma.farmer.update({
      where: { id },
      data: parseResult.data,
    });

    return { farmer };
  });

  // ==========================================
  // DELETE FARMER (Soft Delete)
  // ==========================================
  fastify.delete('/farmers/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    // Check farmer exists
    const existing = await prisma.farmer.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Farmer not found',
      });
    }

    // Soft delete - set isActive to false
    await prisma.farmer.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true, message: 'Farmer deactivated successfully' };
  });
};

export default farmerRoutes;
