import type { FastifyPluginAsync } from 'fastify';
import { authenticate } from '../middleware/auth';
import { createOrderSchema } from '../schemas/orders';

const orderRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // PLACE NEW ORDER
  // ==========================================
  fastify.post('/orders', { preHandler: [authenticate] }, async (request, reply) => {
    const parseResult = createOrderSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { batchId, fulfillmentType, items } = parseResult.data;
    const buyerId = request.user.id;

    // 1. Validate Batch
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch not found',
      });
    }

    if (batch.status !== 'OPEN') {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Orders can only be placed for OPEN batches',
      });
    }

    if (new Date(batch.cutoffAt) <= new Date()) {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'Batch cutoff time has passed',
      });
    }

    // 2. Validate Items & Check MOQs
    const batchProductIds = items.map((i) => i.batchProductId);
    const batchProducts = await prisma.batchProduct.findMany({
      where: {
        id: { in: batchProductIds },
        batchId: batchId,
        isActive: true,
      },
    });

    if (batchProducts.length !== items.length) {
      return reply.status(400).send({
        error: 'Invalid Operation',
        message: 'One or more products are invalid or not part of this batch',
      });
    }

    let estimatedTotal = 0;
    let facilitationAmt = 0;

    const orderItemsData = items.map((item) => {
      const bp = batchProducts.find((p) => p.id === item.batchProductId)!;

      if (item.orderedQty < bp.minOrderQty) {
        throw new Error(
          `Quantity for product ${bp.id} is below minimum order quantity (${bp.minOrderQty})`
        );
      }

      if (bp.maxOrderQty && item.orderedQty > bp.maxOrderQty) {
        throw new Error(
          `Quantity for product ${bp.id} exceeds maximum order quantity (${bp.maxOrderQty})`
        );
      }

      const lineTotal = bp.pricePerUnit * item.orderedQty;
      const facilitation = lineTotal * (bp.facilitationPercent / 100);

      estimatedTotal += lineTotal + facilitation;
      facilitationAmt += facilitation;

      return {
        batchProductId: item.batchProductId,
        orderedQty: item.orderedQty,
        unitPrice: bp.pricePerUnit,
        lineTotal: lineTotal + facilitation,
      };
    });

    try {
      // 3. Create Order in Transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create Order
        const newOrder = await tx.order.create({
          data: {
            batchId,
            buyerId,
            fulfillmentType,
            estimatedTotal,
            facilitationAmt,
            status: 'PLACED',
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
          },
        });

        // Log Event
        await tx.eventLog.create({
          data: {
            entityType: 'ORDER',
            entityId: newOrder.id,
            action: 'ORDER_CREATED',
            metadata: {
              batchId,
              buyerId,
              total: estimatedTotal,
            },
          },
        });

        return newOrder;
      });

      return reply.status(201).send({ order });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.status(400).send({
          error: 'Invalid Operation',
          message: 'You have already placed an order for this batch',
        });
      }
      return reply.status(400).send({
        error: 'Error',
        message: error.message || 'Failed to place order',
      });
    }
  });

  // ==========================================
  // GET BUYER ORDERS
  // ==========================================
  fastify.get('/orders/my', { preHandler: [authenticate] }, async (request, _reply) => {
    const orders = await prisma.order.findMany({
      where: { buyerId: request.user.id },
      include: {
        batch: {
          include: { hub: true },
        },
        items: {
          include: {
            batchProduct: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { orders };
  });

  return;
};

export default orderRoutes;
