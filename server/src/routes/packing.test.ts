import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Packing Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let buyerToken: string;

  beforeAll(async () => {
    app = await buildTestApp();
    adminToken = generateAdminToken(app);
    buyerToken = generateBuyerToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('GET /batches/:id/packing', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/packing',
      });
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/packing',
        cookies: { token: buyerToken },
      });
      expect(response.statusCode).toBe(403);
    });

    it('should return packing data for a batch', async () => {
      const batchId = 'batch-1';
      mockPrisma.batch.findUnique.mockResolvedValue({ id: batchId, name: 'Batch 1' });

      const mockOrders = [
        {
          id: 'order-1',
          status: 'FULLY_PAID',
          buyer: { id: 'buyer-1', name: 'Buyer 1', phone: '1234567890' },
          items: [
            {
              orderedQty: 5,
              batchProduct: {
                product: { name: 'Tomato' },
              },
            },
          ],
        },
      ];

      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      const response = await app.inject({
        method: 'GET',
        url: `/batches/${batchId}/packing`,
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.orders).toHaveLength(1);
      expect(body.orders[0].buyer.name).toBe('Buyer 1');
    });
  });

  describe('PATCH /orders/:id/status', () => {
    it('should update order status and log event', async () => {
      const orderId = 'order-1';
      const newStatus = 'PACKED';

      mockPrisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: 'FULLY_PAID',
      });

      mockPrisma.order.update.mockResolvedValue({
        id: orderId,
        status: newStatus,
        buyer: { name: 'Buyer 1' },
      });

      const validItemUuid = '123e4567-e89b-12d3-a456-426614174000';

      mockPrisma.orderItem.update.mockResolvedValue({
        id: validItemUuid,
        finalQty: 5,
      });

      mockPrisma.$transaction.mockImplementation(async (fn) => {
        return await fn(mockPrisma);
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}/status`,
        payload: {
          status: newStatus,
          items: [{ id: validItemUuid, finalQty: 5 }],
        },
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orderId },
          data: { status: newStatus },
        })
      );
      expect(mockPrisma.orderItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: validItemUuid },
          data: { finalQty: 5 },
        })
      );
      expect(mockPrisma.eventLog.create).toHaveBeenCalled();
    });

    it('should reject invalid status transitions', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/orders/order-1/status',
        payload: { status: 'PLACED' }, // PLACED not allowed in this endpoint
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
