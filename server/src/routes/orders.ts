import type { FastifyPluginAsync } from 'fastify';
import { authenticate, requireAdmin } from '../middleware/auth';
import { createOrderSchema, editOrderSchema } from '../schemas/orders';

const orderRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET ALL ORDERS (Admin Only)
  // ==========================================
  fastify.get('/orders', { preHandler: [requireAdmin] }, async (request, _reply) => {
    const { batchId, status } = request.query as { batchId?: string; status?: string };

    const orders = await prisma.order.findMany({
      where: {
        ...(batchId ? { batchId } : {}),
        ...(status
          ? { status: status as 'PLACED' | 'COMMITMENT_PAID' | 'FULLY_PAID' | 'CANCELLED' }
          : {}),
      },
      include: {
        batch: {
          include: { hub: true },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        items: {
          include: {
            batchProduct: {
              include: { product: true },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { orders };
  });

  // ==========================================
  // GET SINGLE ORDER (Admin or Owner)
  // ==========================================
  fastify.get('/orders/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        batch: {
          include: { hub: true },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        items: {
          include: {
            batchProduct: {
              include: { product: true },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Order not found',
      });
    }

    // Check ownership or admin
    if (request.user.role !== 'ADMIN' && order.buyerId !== request.user.userId) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'You do not have permission to view this order',
      });
    }

    return { order };
  });

  // ==========================================
  // PLACE NEW ORDER
  // ==========================================
  fastify.post('/orders', { preHandler: [authenticate] }, async (request, reply) => {
    // Explicitly enforce BUYER role
    if (request.user.role !== 'BUYER') {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Only buyers can place orders',
      });
    }

    const parseResult = createOrderSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { batchId, fulfillmentType, items } = parseResult.data;
    const buyerId = request.user.userId;

    try {
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
        include: { product: true },
      });

      if (batchProducts.length !== items.length) {
        return reply.status(400).send({
          error: 'Invalid Operation',
          message: 'One or more products are invalid or not part of this batch',
        });
      }

      let estimatedTotal = 0;
      let facilitationAmt = 0;

      // Validate quantities first
      for (const item of items) {
        const bp = batchProducts.find((p) => p.id === item.batchProductId)!;

        if (item.orderedQty < bp.minOrderQty) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: `Quantity for product ${bp.product.name} is below minimum order quantity (${bp.minOrderQty})`,
          });
        }

        if (bp.maxOrderQty && item.orderedQty > bp.maxOrderQty) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: `Quantity for product ${bp.product.name} exceeds maximum order quantity (${bp.maxOrderQty})`,
          });
        }
      }

      // Map to order items
      const orderItemsData = items.map((item) => {
        const bp = batchProducts.find((p: { id: string }) => p.id === item.batchProductId)!;

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
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      /* P2002 check removed as we now allow multiple orders */
      return reply.status(400).send({
        error: 'Error',
        message: err.message || 'Failed to place order',
      });
    }
  });

  // ==========================================
  // GET BUYER ORDERS
  // ==========================================
  fastify.get('/orders/my', { preHandler: [authenticate] }, async (request, _reply) => {
    const orders = await prisma.order.findMany({
      where: { buyerId: request.user.userId },
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
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { orders };
  });

  // ==========================================
  // EDIT ORDER (PATCH /orders/:id)
  // ==========================================
  fastify.patch('/orders/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    // Parse and validate request body
    const parseResult = editOrderSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { fulfillmentType, items } = parseResult.data;

    try {
      // 1. Fetch order with batch included
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          batch: true,
          items: true,
        },
      });

      if (!order) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // 2. Validate ownership
      if (request.user.userId !== order.buyerId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have permission to edit this order',
        });
      }

      // 3. Validate order status
      if (order.status !== 'PLACED') {
        return reply.status(400).send({
          error: 'Invalid Operation',
          message: 'Order cannot be edited after payment',
        });
      }

      // 4. Validate batch status
      if (order.batch.status !== 'OPEN') {
        return reply.status(400).send({
          error: 'Invalid Operation',
          message: 'Batch is no longer open',
        });
      }

      // 5. Validate cutoff time
      if (new Date(order.batch.cutoffAt) <= new Date()) {
        return reply.status(400).send({
          error: 'Invalid Operation',
          message: 'Batch cutoff time has passed',
        });
      }

      // Determine if order should be cancelled
      const shouldCancel =
        items !== undefined && (items.length === 0 || items.every((item) => item.orderedQty === 0));

      // Transaction: Update order
      const updatedOrder = await prisma.$transaction(async (tx) => {
        const updateData: {
          fulfillmentType?: 'PICKUP' | 'DELIVERY';
          status?: 'CANCELLED';
          estimatedTotal?: number;
          facilitationAmt?: number;
        } = {};

        // Update fulfillment type if provided
        if (fulfillmentType) {
          updateData.fulfillmentType = fulfillmentType;
        }

        // Handle cancellation
        if (shouldCancel) {
          updateData.status = 'CANCELLED';
          updateData.estimatedTotal = 0;
          updateData.facilitationAmt = 0;

          // We used to delete items here, but we now keep them
          // to allow "Buy Again" functionality and historical reference.
          // await tx.orderItem.deleteMany({
          //   where: { orderId: id },
          // });

          // Update order
          const cancelled = await tx.order.update({
            where: { id },
            data: updateData,
            include: {
              batch: {
                include: { hub: true },
              },
              buyer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  email: true,
                },
              },
              items: {
                include: {
                  batchProduct: {
                    include: { product: true },
                  },
                },
              },
              payments: true,
            },
          });

          // Log event
          await tx.eventLog.create({
            data: {
              entityType: 'ORDER',
              entityId: id,
              action: 'ORDER_CANCELLED',
              metadata: { reason: 'User removed all items' },
            },
          });

          return cancelled;
        }

        // Handle items update (if provided and not cancelling)
        if (items !== undefined && items.length > 0) {
          // Validate all batchProductIds
          const batchProductIds = items.map((i) => i.batchProductId);
          const batchProducts = await tx.batchProduct.findMany({
            where: {
              id: { in: batchProductIds },
              batchId: order.batchId,
              isActive: true,
            },
          });

          if (batchProducts.length !== items.length) {
            throw new Error('One or more products are invalid or not part of this batch');
          }

          // Filter out items with qty=0
          const validItems = items.filter((item) => item.orderedQty > 0);

          // Validate MOQ/MaxOQ
          let estimatedTotal = 0;
          let facilitationAmt = 0;

          const orderItemsData = validItems.map((item) => {
            const bp = batchProducts.find((p: { id: string }) => p.id === item.batchProductId)!;

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

          // Delete existing items
          await tx.orderItem.deleteMany({
            where: { orderId: id },
          });

          // Create new items
          await tx.orderItem.createMany({
            data: orderItemsData.map((item) => ({
              ...item,
              orderId: id,
            })),
          });

          // Update order totals
          updateData.estimatedTotal = estimatedTotal;
          updateData.facilitationAmt = facilitationAmt;
        }

        // Update order
        const updated = await tx.order.update({
          where: { id },
          data: updateData,
          include: {
            batch: {
              include: { hub: true },
            },
            buyer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            items: {
              include: {
                batchProduct: {
                  include: { product: true },
                },
              },
            },
            payments: true,
          },
        });

        // Build metadata dynamically
        const metadata: {
          itemsUpdated?: boolean;
          newTotal?: number;
          fulfillmentTypeChanged?: boolean;
          newFulfillmentType?: string;
        } = {};

        if (items !== undefined && items.length > 0) {
          metadata.itemsUpdated = true;
          metadata.newTotal = updateData.estimatedTotal;
        }

        if (fulfillmentType) {
          metadata.fulfillmentTypeChanged = true;
          metadata.newFulfillmentType = fulfillmentType;
        }

        // Log event
        await tx.eventLog.create({
          data: {
            entityType: 'ORDER',
            entityId: id,
            action: 'ORDER_EDITED',
            metadata,
          },
        });

        return updated;
      });

      return { order: updatedOrder };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return reply.status(400).send({
        error: 'Error',
        message: err.message || 'Failed to edit order',
      });
    }
  });

  return;
};

export default orderRoutes;
