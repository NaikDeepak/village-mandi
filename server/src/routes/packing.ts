import type { OrderStatus } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';

const packingRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET BATCH PACKING DATA
  // ==========================================
  fastify.get('/batches/:id/packing', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const batch = await prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Batch not found',
      });
    }

    // Find all orders that are ready for packing or already packed
    // We include FULLY_PAID, PACKED, and DISTRIBUTED to show progress
    const orders = await prisma.order.findMany({
      where: {
        batchId: id,
        status: { in: ['FULLY_PAID', 'PACKED', 'DISTRIBUTED'] },
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: {
          include: {
            batchProduct: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        buyer: {
          name: 'asc',
        },
      },
    });

    return { orders };
  });

  // ==========================================
  // UPDATE ORDER STATUS (PACKING/DISTRIBUTION)
  // ==========================================
  fastify.patch('/orders/:id/status', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: OrderStatus };

    const allowedStatuses: OrderStatus[] = ['PACKED', 'DISTRIBUTED', 'FULLY_PAID'];
    if (!allowedStatuses.includes(status)) {
      return reply.status(400).send({
        error: 'Invalid Request',
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Order not found',
      });
    }

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status },
        include: {
          buyer: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.eventLog.create({
        data: {
          entityType: 'ORDER',
          entityId: id,
          action: 'STATUS_CHANGE',
          metadata: {
            from: order.status,
            to: status,
          },
        },
      }),
    ]);

    return { order: updatedOrder };
  });
};

export default packingRoutes;
