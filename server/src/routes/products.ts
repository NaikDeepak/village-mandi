import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { createProductSchema, updateProductSchema } from '../schemas/products';

const productRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================
  fastify.get('/products', { preHandler: [requireAdmin] }, async (request, _reply) => {
    const { farmerId, includeInactive } = request.query as {
      farmerId?: string;
      includeInactive?: string;
    };

    const products = await prisma.product.findMany({
      where: {
        ...(farmerId && { farmerId }),
        ...(includeInactive !== 'true' && { isActive: true }),
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { products };
  });

  // ==========================================
  // GET SINGLE PRODUCT
  // ==========================================
  fastify.get('/products/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
            isActive: true,
          },
        },
      },
    });

    if (!product) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Product not found',
      });
    }

    return { product };
  });

  // ==========================================
  // CREATE PRODUCT
  // ==========================================
  fastify.post('/products', { preHandler: [requireAdmin] }, async (request, reply) => {
    const parseResult = createProductSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { farmerId, seasonStart, seasonEnd, ...rest } = parseResult.data;

    // Verify farmer exists and is active
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
    });

    if (!farmer) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Farmer not found',
      });
    }

    if (!farmer.isActive) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Cannot add products to an inactive farmer',
      });
    }

    const product = await prisma.product.create({
      data: {
        ...rest,
        farmerId,
        seasonStart: seasonStart ? new Date(seasonStart) : null,
        seasonEnd: seasonEnd ? new Date(seasonEnd) : null,
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    return reply.status(201).send({ product });
  });

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================
  fastify.put('/products/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parseResult = updateProductSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    // Check product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Product not found',
      });
    }

    const { seasonStart, seasonEnd, ...rest } = parseResult.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(seasonStart !== undefined && {
          seasonStart: seasonStart ? new Date(seasonStart) : null,
        }),
        ...(seasonEnd !== undefined && {
          seasonEnd: seasonEnd ? new Date(seasonEnd) : null,
        }),
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    return { product };
  });

  // ==========================================
  // DELETE PRODUCT (Soft Delete)
  // ==========================================
  fastify.delete('/products/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { force } = request.query as { force?: string };

    // Check product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Product not found',
      });
    }

    if (force === 'true') {
      // Hard delete
      await prisma.product.delete({ where: { id } });
      return { success: true, message: 'Product permanently deleted' };
    }

    // Soft delete - set isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true, message: 'Product deactivated successfully' };
  });
};

export default productRoutes;
