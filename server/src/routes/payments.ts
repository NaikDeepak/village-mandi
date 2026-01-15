import type { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middleware/auth';
import { logPaymentSchema } from '../schemas/payments';

const paymentRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // LOG PAYMENT (Admin Only)
  // ==========================================
  fastify.post('/orders/:id/payments', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = logPaymentSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { amount, method, stage, referenceId, paidAt } = parseResult.data;

    try {
      // 1. Find Order
      const order = await prisma.order.findUnique({
        where: { id },
        include: { payments: true },
      });

      if (!order) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      if (order.status === 'CANCELLED') {
        return reply.status(400).send({
          error: 'Invalid Operation',
          message: 'Cannot log payment for a cancelled order',
        });
      }

      // 2. Validate Stage Transitions
      if (stage === 'FINAL') {
        const hasCommitment = order.payments.some((p) => p.stage === 'COMMITMENT');
        if (!hasCommitment) {
          return reply.status(400).send({
            error: 'Invalid Operation',
            message: 'Cannot log final payment before commitment payment',
          });
        }
      }

      if (stage === 'COMMITMENT') {
        const alreadyHasCommitment = order.payments.some((p) => p.stage === 'COMMITMENT');
        if (alreadyHasCommitment) {
          return reply.status(400).send({
            error: 'Invalid Operation',
            message: 'Commitment payment already logged for this order',
          });
        }
      }

      // 3. Execute Transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create Payment
        const payment = await tx.payment.create({
          data: {
            orderId: id,
            amount,
            method,
            stage,
            referenceId,
            paidAt: paidAt ? new Date(paidAt) : new Date(),
          },
        });

        // Update Order Status
        const newStatus = stage === 'COMMITMENT' ? 'COMMITMENT_PAID' : 'FULLY_PAID';
        await tx.order.update({
          where: { id },
          data: { status: newStatus },
        });

        // Log Event
        await tx.eventLog.create({
          data: {
            entityType: 'ORDER',
            entityId: id,
            action: stage === 'COMMITMENT' ? 'COMMITMENT_PAYMENT_LOGGED' : 'FINAL_PAYMENT_LOGGED',
            metadata: {
              paymentId: payment.id,
              amount,
              stage,
              newStatus,
            },
          },
        });

        return payment;
      });

      return reply.status(201).send({ payment: result });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to log payment',
      });
    }
  });

  return;
};

export default paymentRoutes;
