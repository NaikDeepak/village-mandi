import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { createPayoutSchema } from '../schemas/payouts';

const payoutRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // GET BATCH PAYOUTS SUMMARY
  // ==========================================
  fastify.get('/batches/:id/payouts', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id: batchId } = request.params as { id: string };

    try {
      const batch = await prisma.batch.findUnique({ where: { id: batchId } });
      if (!batch) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Batch not found',
        });
      }

      // 1. Fetch all non-cancelled, non-placed orders for this batch
      const orders = await prisma.order.findMany({
        where: {
          batchId,
          status: {
            in: ['COMMITMENT_PAID', 'FULLY_PAID', 'PACKED', 'DISTRIBUTED'],
          },
        },
        include: {
          items: {
            include: {
              batchProduct: {
                include: {
                  product: {
                    include: {
                      farmer: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 2. Fetch all existing payouts for this batch
      const payouts = await prisma.farmerPayout.findMany({
        where: { batchId },
        include: { farmer: true },
        orderBy: { paidAt: 'desc' },
      });

      // 3. Aggregate data by Farmer
      const farmerDataMap = new Map<
        string,
        {
          farmerId: string;
          name: string;
          location: string;
          totalOwed: number;
          totalPaid: number;
        }
      >();

      // Process Orders to calculate totalOwed
      for (const order of orders) {
        for (const item of order.items) {
          const farmer = item.batchProduct.product.farmer;
          if (!farmerDataMap.has(farmer.id)) {
            farmerDataMap.set(farmer.id, {
              farmerId: farmer.id,
              name: farmer.name,
              location: farmer.location,
              totalOwed: 0,
              totalPaid: 0,
            });
          }

          const data = farmerDataMap.get(farmer.id)!;
          const qty = item.finalQty ?? item.orderedQty;
          data.totalOwed += qty * item.unitPrice;
        }
      }

      // Process Payouts to calculate totalPaid
      for (const payout of payouts) {
        if (!farmerDataMap.has(payout.farmerId)) {
          // This case might happen if a payout was logged for a farmer who now has no orders (rare but possible)
          farmerDataMap.set(payout.farmerId, {
            farmerId: payout.farmerId,
            name: payout.farmer.name,
            location: payout.farmer.location,
            totalOwed: 0,
            totalPaid: 0,
          });
        }
        const data = farmerDataMap.get(payout.farmerId)!;
        data.totalPaid += payout.amount;
      }

      const farmers = Array.from(farmerDataMap.values()).map((f) => ({
        ...f,
        balance: f.totalOwed - f.totalPaid,
      }));

      return {
        batchId,
        farmers,
        payouts, // Full history
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch payouts summary',
      });
    }
  });

  // ==========================================
  // LOG FARMER PAYOUT
  // ==========================================
  fastify.post('/batches/:id/payouts', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id: batchId } = request.params as { id: string };
    const parseResult = createPayoutSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { farmerId, amount, upiReference, paidAt } = parseResult.data;

    try {
      // 1. Verify Batch, Farmer exist, and Farmer is part of the batch
      const [batch, farmer, farmerInBatch] = await Promise.all([
        prisma.batch.findUnique({ where: { id: batchId } }),
        prisma.farmer.findUnique({ where: { id: farmerId } }),
        prisma.batchProduct.findFirst({
          where: {
            batchId,
            product: { farmerId },
          },
        }),
      ]);

      if (!batch) {
        return reply.status(404).send({ error: 'Not Found', message: 'Batch not found' });
      }
      if (!farmer) {
        return reply.status(404).send({ error: 'Not Found', message: 'Farmer not found' });
      }
      if (!farmerInBatch) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Farmer has no products in this batch',
        });
      }

      // 2. Create Payout and Log Event in Transaction
      const payout = await prisma.$transaction(async (tx) => {
        const newPayout = await tx.farmerPayout.create({
          data: {
            batchId,
            farmerId,
            amount,
            upiReference,
            paidAt,
          },
        });

        await tx.eventLog.create({
          data: {
            entityType: 'FARMER_PAYOUT',
            entityId: newPayout.id,
            action: 'PAYOUT_LOGGED',
            metadata: {
              batchId,
              farmerId,
              amount,
              upiReference,
              paidAt,
            },
          },
        });

        return newPayout;
      });

      return reply.status(201).send({ payout });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to log payout',
      });
    }
  });

  return;
};

export default payoutRoutes;
