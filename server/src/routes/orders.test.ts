import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Order Routes', () => {
  let app: FastifyInstance;
  let _adminToken: string;
  let buyerToken: string;
  const buyerId = 'buyer-123';

  beforeAll(async () => {
    app = await buildTestApp();
    _adminToken = generateAdminToken(app);
    // Overwrite buyer token to have a known ID for matching
    buyerToken = generateBuyerToken(app, { id: buyerId });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('POST /orders', () => {
    const validPayload = {
      batchId: '550e8400-e29b-41d4-a716-446655440000',
      fulfillmentType: 'PICKUP',
      items: [
        {
          batchProductId: '550e8400-e29b-41d4-a716-446655440001',
          orderedQty: 5,
        },
      ],
    };

    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(401);
    });

    it('should reject orders for non-existent batches', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body).message).toBe('Batch not found');
    });

    it('should reject orders for batches that are not OPEN', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({
        id: validPayload.batchId,
        status: 'DRAFT',
      });

      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Orders can only be placed for OPEN batches');
    });

    it('should reject orders if cutoff time has passed', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({
        id: validPayload.batchId,
        status: 'OPEN',
        cutoffAt: new Date(Date.now() - 10000), // 10s ago
      });

      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Batch cutoff time has passed');
    });

    it('should reject orders with qty below MOQ', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({
        id: validPayload.batchId,
        status: 'OPEN',
        cutoffAt: new Date(Date.now() + 86400000),
      });

      mockPrisma.batchProduct.findMany.mockResolvedValue([
        {
          id: validPayload.items[0].batchProductId,
          batchId: validPayload.batchId,
          isActive: true,
          minOrderQty: 10, // Higher than payload's 5
          pricePerUnit: 100,
          facilitationPercent: 10,
        },
      ]);

      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('below minimum order quantity');
    });

    it('should successfully create order and log event', async () => {
      const mockBatch = {
        id: validPayload.batchId,
        status: 'OPEN',
        cutoffAt: new Date(Date.now() + 86400000),
      };

      const mockBatchProduct = {
        id: validPayload.items[0].batchProductId,
        batchId: validPayload.batchId,
        isActive: true,
        minOrderQty: 1,
        maxOrderQty: 10,
        pricePerUnit: 100,
        facilitationPercent: 10,
      };

      mockPrisma.batch.findUnique.mockResolvedValue(mockBatch);
      mockPrisma.batchProduct.findMany.mockResolvedValue([mockBatchProduct]);

      const mockOrder = {
        id: 'order-1',
        ...validPayload,
        buyerId,
        estimatedTotal: 550, // (100 * 5) + (100 * 5 * 0.1)
        facilitationAmt: 50,
        status: 'PLACED',
        items: [
          {
            id: 'item-1',
            ...validPayload.items[0],
            unitPrice: 100,
            lineTotal: 550,
          },
        ],
      };

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.order.create.mockResolvedValue(mockOrder);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.order.estimatedTotal).toBe(550);
      expect(mockPrisma.order.create).toHaveBeenCalled();
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            entityType: 'ORDER',
            action: 'ORDER_CREATED',
          }),
        })
      );
    });

    it('should reject duplicate orders for same batch/buyer', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({
        id: validPayload.batchId,
        status: 'OPEN',
        cutoffAt: new Date(Date.now() + 86400000),
      });

      mockPrisma.batchProduct.findMany.mockResolvedValue([
        {
          id: validPayload.items[0].batchProductId,
          batchId: validPayload.batchId,
          isActive: true,
          minOrderQty: 1,
          pricePerUnit: 100,
          facilitationPercent: 10,
        },
      ]);

      mockPrisma.$transaction.mockImplementation(async (_fn) => {
        const error = new Error('Unique constraint failed') as Error & { code?: string };
        error.code = 'P2002';
        throw error;
      });

      const response = await app.inject({
        method: 'POST',
        url: '/orders',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe(
        'You have already placed an order for this batch'
      );
    });
  });

  describe('GET /orders/my', () => {
    it('should return only buyer orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([{ id: 'order-1', buyerId }]);

      const response = await app.inject({
        method: 'GET',
        url: '/orders/my',
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { buyerId },
        })
      );
    });
  });
});
