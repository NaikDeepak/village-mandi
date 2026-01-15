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

  describe('PATCH /orders/:id', () => {
    const orderId = '550e8400-e29b-41d4-a716-446655440010';
    const batchId = '550e8400-e29b-41d4-a716-446655440000';
    const batchProductId = '550e8400-e29b-41d4-a716-446655440001';

    const mockOrder = {
      id: orderId,
      batchId,
      buyerId,
      status: 'PLACED',
      fulfillmentType: 'PICKUP',
      estimatedTotal: 550,
      facilitationAmt: 50,
      batch: {
        id: batchId,
        status: 'OPEN',
        cutoffAt: new Date(Date.now() + 86400000), // 1 day from now
      },
      items: [
        {
          id: 'item-1',
          batchProductId,
          orderedQty: 5,
          unitPrice: 100,
          lineTotal: 550,
        },
      ],
    };

    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 404 for non-existent order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body).message).toBe('Order not found');
    });

    it('should return 403 if user is not the order owner', async () => {
      const otherBuyerToken = generateBuyerToken(app, { id: 'other-buyer' });
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: otherBuyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).message).toBe(
        'You do not have permission to edit this order'
      );
    });

    it('should return 400 if order status is not PLACED', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: 'COMMITMENT_PAID',
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Order cannot be edited after payment');
    });

    it('should return 400 if batch is not OPEN', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        batch: {
          ...mockOrder.batch,
          status: 'CLOSED',
        },
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Batch is no longer open');
    });

    it('should return 400 if batch cutoff has passed', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        batch: {
          ...mockOrder.batch,
          cutoffAt: new Date(Date.now() - 10000), // 10s ago
        },
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Batch cutoff time has passed');
    });

    it('should successfully update fulfillment type', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const updatedOrder = {
        ...mockOrder,
        fulfillmentType: 'DELIVERY',
      };

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.order.update.mockResolvedValue(updatedOrder);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.order.fulfillmentType).toBe('DELIVERY');
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'ORDER_EDITED',
            metadata: expect.objectContaining({
              fulfillmentTypeChanged: true,
              newFulfillmentType: 'DELIVERY',
            }),
          }),
        })
      );
    });

    it('should successfully update order items', async () => {
      const newBatchProductId = '550e8400-e29b-41d4-a716-446655440002';

      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const mockBatchProducts = [
        {
          id: newBatchProductId,
          batchId,
          isActive: true,
          minOrderQty: 1,
          maxOrderQty: 20,
          pricePerUnit: 150,
          facilitationPercent: 10,
        },
      ];

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.batchProduct.findMany.mockResolvedValue(mockBatchProducts);
      mockPrisma.orderItem.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.orderItem.createMany.mockResolvedValue({ count: 1 });

      const updatedOrder = {
        ...mockOrder,
        estimatedTotal: 825, // (150 * 5) + (150 * 5 * 0.1)
        facilitationAmt: 75,
        items: [
          {
            id: 'item-2',
            batchProductId: newBatchProductId,
            orderedQty: 5,
            unitPrice: 150,
            lineTotal: 825,
          },
        ],
      };

      mockPrisma.order.update.mockResolvedValue(updatedOrder);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: {
          items: [
            {
              batchProductId: newBatchProductId,
              orderedQty: 5,
            },
          ],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.order.estimatedTotal).toBe(825);
      expect(mockPrisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { orderId },
      });
      expect(mockPrisma.orderItem.createMany).toHaveBeenCalled();
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'ORDER_EDITED',
            metadata: expect.objectContaining({
              itemsUpdated: true,
              newTotal: 825,
            }),
          }),
        })
      );
    });

    it('should validate MOQ for updated items', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const mockBatchProducts = [
        {
          id: batchProductId,
          batchId,
          isActive: true,
          minOrderQty: 10, // Higher than requested qty
          maxOrderQty: 20,
          pricePerUnit: 100,
          facilitationPercent: 10,
        },
      ];

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.batchProduct.findMany.mockResolvedValue(mockBatchProducts);

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: {
          items: [
            {
              batchProductId,
              orderedQty: 5, // Below MOQ
            },
          ],
        },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('below minimum order quantity');
    });

    it('should validate MaxOQ for updated items', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const mockBatchProducts = [
        {
          id: batchProductId,
          batchId,
          isActive: true,
          minOrderQty: 1,
          maxOrderQty: 10, // Lower than requested qty
          pricePerUnit: 100,
          facilitationPercent: 10,
        },
      ];

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.batchProduct.findMany.mockResolvedValue(mockBatchProducts);

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: {
          items: [
            {
              batchProductId,
              orderedQty: 15, // Above MaxOQ
            },
          ],
        },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('exceeds maximum order quantity');
    });

    it('should cancel order when all items removed', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const cancelledOrder = {
        ...mockOrder,
        status: 'CANCELLED',
        items: [],
      };

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.orderItem.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.order.update.mockResolvedValue(cancelledOrder);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: {
          items: [], // Empty array cancels order
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.order.status).toBe('CANCELLED');
      expect(mockPrisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { orderId },
      });
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'ORDER_CANCELLED',
            metadata: { reason: 'User removed all items' },
          }),
        })
      );
    });

    it('should log ORDER_EDITED event on successful edit', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.order.update.mockResolvedValue({
        ...mockOrder,
        fulfillmentType: 'DELIVERY',
      });
      mockPrisma.eventLog.create.mockResolvedValue({});

      await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { fulfillmentType: 'DELIVERY' },
      });

      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            entityType: 'ORDER',
            entityId: orderId,
            action: 'ORDER_EDITED',
          }),
        })
      );
    });

    it('should log ORDER_CANCELLED event when order cancelled', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.orderItem.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'CANCELLED',
        items: [],
      });
      mockPrisma.eventLog.create.mockResolvedValue({});

      await app.inject({
        method: 'PATCH',
        url: `/orders/${orderId}`,
        cookies: { token: buyerToken },
        payload: { items: [] },
      });

      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            entityType: 'ORDER',
            entityId: orderId,
            action: 'ORDER_CANCELLED',
          }),
        })
      );
    });
  });
});
