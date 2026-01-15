import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';
const ANOTHER_UUID = '123e4567-e89b-12d3-a456-426614174001';

describe('Payout Routes', () => {
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

  describe('GET /batches/:id/payouts', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/batches/${VALID_UUID}/payouts`,
      });
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/batches/${VALID_UUID}/payouts`,
        cookies: { token: buyerToken },
      });
      expect(response.statusCode).toBe(403);
    });

    it('should return payout summary for a batch', async () => {
      const batchId = VALID_UUID;
      mockPrisma.batch.findUnique.mockResolvedValue({ id: batchId, name: 'Batch 1' });

      // Mock orders with items from a farmer
      const mockOrders = [
        {
          id: 'order-1',
          status: 'FULLY_PAID',
          items: [
            {
              orderedQty: 10,
              finalQty: null,
              unitPrice: 50,
              batchProduct: {
                product: {
                  farmer: { id: ANOTHER_UUID, name: 'Farmer 1', location: 'Village A' },
                },
              },
            },
          ],
        },
      ];

      mockPrisma.order.findMany.mockResolvedValue(mockOrders);
      mockPrisma.farmerPayout.findMany.mockResolvedValue([
        {
          id: 'payout-1',
          farmerId: ANOTHER_UUID,
          amount: 200,
          paidAt: new Date(),
          farmer: { name: 'Farmer 1', location: 'Village A' },
        },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: `/batches/${batchId}/payouts`,
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.farmers).toHaveLength(1);
      const farmer = body.farmers[0];
      expect(farmer.farmerId).toBe(ANOTHER_UUID);
      expect(farmer.totalOwed).toBe(500); // 10 * 50
      expect(farmer.totalPaid).toBe(200);
      expect(farmer.balance).toBe(300);
      expect(body.payouts).toHaveLength(1);
    });
  });

  describe('POST /batches/:id/payouts', () => {
    it('should log a new payout and event', async () => {
      const batchId = VALID_UUID;
      const farmerId = ANOTHER_UUID;
      const payoutData = {
        farmerId,
        amount: 300,
        upiReference: 'UPI123456',
        paidAt: new Date().toISOString(),
      };

      mockPrisma.batch.findUnique.mockResolvedValue({ id: batchId });
      mockPrisma.farmer.findUnique.mockResolvedValue({ id: farmerId });

      mockPrisma.farmerPayout.create.mockResolvedValue({
        id: 'payout-2',
        ...payoutData,
        paidAt: new Date(payoutData.paidAt),
      });

      mockPrisma.$transaction.mockImplementation(async (cb) => {
        return await cb(mockPrisma);
      });

      const response = await app.inject({
        method: 'POST',
        url: `/batches/${batchId}/payouts`,
        payload: payoutData,
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(201);
      expect(mockPrisma.farmerPayout.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            batchId,
            farmerId,
            amount: 300,
          }),
        })
      );
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            entityType: 'FARMER_PAYOUT',
            action: 'PAYOUT_LOGGED',
          }),
        })
      );
    });

    it('should return 404 if batch not found', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: `/batches/${VALID_UUID}/payouts`,
        payload: {
          farmerId: ANOTHER_UUID,
          amount: 100,
          upiReference: 'REF123',
          paidAt: new Date().toISOString(),
        },
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
