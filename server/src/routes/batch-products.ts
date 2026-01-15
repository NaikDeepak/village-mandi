import type { Prisma } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { authenticate, requireAdmin } from '../middleware/auth';
import { addBatchProductSchema, updateBatchProductSchema } from '../schemas/batch-products';

const batchProductRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET PRODUCTS FOR A BATCH
  // ==========================================
  fastify.get('/batches/:id/products', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = request.query as { isActive?: string };

    // Verify batch exists
    const batch = await prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch not found',
      });
    }

    const where: Prisma.BatchProductWhereInput = { batchId: id };
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const batchProducts = await prisma.batchProduct.findMany({
      where,
      include: {
        product: {
          include: {
            farmer: true,
          },
        },
      },
      orderBy: { product: { name: 'asc' } },
    });

    return { products: batchProducts };
  });

  // ==========================================
  // ADD PRODUCT TO BATCH
  // ==========================================
  fastify.post('/batches/:id/products', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parseResult = addBatchProductSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { productId, pricePerUnit, facilitationPercent, minOrderQty, maxOrderQty } =
      parseResult.data;

    // Verify batch exists
    const batch = await prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch not found',
      });
    }

    // Only DRAFT batches can be modified
    if (batch.status !== 'DRAFT') {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Products can only be added to DRAFT batches',
      });
    }

    // Verify product exists and is active
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Product not found',
      });
    }
    if (!product.isActive) {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Cannot add inactive product to batch',
      });
    }

    // Check if product already exists in batch
    const existing = await prisma.batchProduct.findUnique({
      where: {
        batchId_productId: {
          batchId: id,
          productId,
        },
      },
    });

    if (existing) {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Product already added to this batch',
      });
    }

    const batchProduct = await prisma.batchProduct.create({
      data: {
        batchId: id,
        productId,
        pricePerUnit,
        facilitationPercent,
        minOrderQty,
        maxOrderQty,
      },
      include: {
        product: {
          include: {
            farmer: true,
          },
        },
      },
    });

    return reply.status(201).send({ batchProduct });
  });

  // ==========================================
  // GET SINGLE BATCH PRODUCT
  // ==========================================
  fastify.get('/batch-products/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const batchProduct = await prisma.batchProduct.findUnique({
      where: { id },
      include: {
        batch: true,
        product: {
          include: {
            farmer: true,
          },
        },
      },
    });

    if (!batchProduct) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch product not found',
      });
    }

    return { batchProduct };
  });

  // ==========================================
  // UPDATE BATCH PRODUCT
  // ==========================================
  fastify.put('/batch-products/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parseResult = updateBatchProductSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    // Verify exists
    const existing = await prisma.batchProduct.findUnique({
      where: { id },
      include: { batch: true },
    });

    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch product not found',
      });
    }

    // Only DRAFT batches can be modified
    if (existing.batch.status !== 'DRAFT') {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Batch product can only be updated when batch is in DRAFT status',
      });
    }

    // Validate max >= min with existing values if partial update
    const { minOrderQty, maxOrderQty } = parseResult.data;
    const finalMin = minOrderQty ?? existing.minOrderQty;
    const finalMax = maxOrderQty !== undefined ? maxOrderQty : existing.maxOrderQty;

    if (finalMax !== null && finalMax !== undefined && finalMax < finalMin) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Maximum order quantity must be greater than or equal to minimum order quantity',
      });
    }

    const batchProduct = await prisma.batchProduct.update({
      where: { id },
      data: parseResult.data,
      include: {
        product: {
          include: {
            farmer: true,
          },
        },
      },
    });

    return { batchProduct };
  });

  // ==========================================
  // DELETE BATCH PRODUCT
  // ==========================================
  fastify.delete('/batch-products/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { force } = request.query as { force?: string };
    const isForceDelete = force === 'true';

    // Verify exists
    const existing = await prisma.batchProduct.findUnique({
      where: { id },
      include: { batch: true },
    });

    if (!existing) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch product not found',
      });
    }

    // Only DRAFT batches can be modified
    if (existing.batch.status !== 'DRAFT') {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Batch product can only be removed when batch is in DRAFT status',
      });
    }

    if (isForceDelete) {
      await prisma.batchProduct.delete({ where: { id } });
      return reply.status(204).send();
    }

    const batchProduct = await prisma.batchProduct.update({
      where: { id },
      data: { isActive: false },
      include: {
        product: {
          include: {
            farmer: true,
          },
        },
      },
    });
    return { batchProduct };
  });
};

export default batchProductRoutes;
