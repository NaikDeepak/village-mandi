import { OrderStatus } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { updateOrderPackingSchema } from '../schemas/orders';

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
        status: {
          in: [OrderStatus.FULLY_PAID, OrderStatus.PACKED, OrderStatus.DISTRIBUTED],
        },
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
    const parseResult = updateOrderPackingSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { status, items } = parseResult.data;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Order not found',
      });
    }

    // Validate Status Transition
    const currentStatus = order.status;
    const allowedTransitions: Record<string, string[]> = {
      // From -> [Allowed To]
      FULLY_PAID: ['PACKED'],
      PACKED: ['DISTRIBUTED', 'FULLY_PAID'], // Allow un-packing
      DISTRIBUTED: ['PACKED'], // Allow un-distributing
    };

    if (currentStatus !== status) {
      const allowed = allowedTransitions[currentStatus] || [];
      if (!allowed.includes(status)) {
        return reply.status(400).send({
          error: 'Invalid State Transition',
          message: `Cannot change order status from ${currentStatus} to ${status}`,
        });
      }
    }

    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // 1. Update order status
      const updated = await tx.order.update({
        where: { id },
        data: { status },
        include: {
          buyer: {
            select: {
              name: true,
            },
          },
        },
      });

      // 2. Update item final quantities if provided
      if (items && items.length > 0) {
        for (const item of items) {
          // Use updateMany to ensure we only update if the item belongs to this order
          // This prevents accidental/malicious updates to items in other orders
          const result = await tx.orderItem.updateMany({
            where: {
              id: item.id,
              orderId: id, // Scoped to current order
            },
            data: { finalQty: item.finalQty },
          });

          if (result.count === 0) {
            throw new Error(`Item ${item.id} not found in order ${id}`);
          }
        }
      }

      // 3. Log event
      await tx.eventLog.create({
        data: {
          entityType: 'ORDER',
          entityId: id,
          action: 'STATUS_CHANGE',
          metadata: {
            from: order.status,
            to: status,
            itemsUpdated: !!items?.length,
          },
        },
      });

      return updated;
    });

    return { order: updatedOrder };
  });
};

export default packingRoutes;
