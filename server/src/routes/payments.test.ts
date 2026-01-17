import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Payment Routes', () => {
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

  describe('POST /orders/:id/payments', () => {
    const orderId = 'order-123';
    const validPayload = {
      amount: 100,
      method: 'UPI',
      stage: 'COMMITMENT',
      referenceId: 'UPI12345',
    };

    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        payload: validPayload,
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return 404 if order does not exist', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(404);
    });

    it('should reject payment for cancelled orders', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: 'CANCELLED',
        payments: [],
      });

      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Cannot log payment for a cancelled order');
    });

    it('should successfully log commitment payment and update status', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: 'PLACED',
        payments: [],
      });

      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));
      mockPrisma.payment.create.mockResolvedValue({ id: 'pay-1', ...validPayload });
      mockPrisma.order.update.mockResolvedValue({});
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(201);
      expect(mockPrisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orderId },
          data: { status: 'COMMITMENT_PAID' },
        })
      );
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'COMMITMENT_PAYMENT_LOGGED',
          }),
        })
      );
    });

    it('should reject duplicate commitment payment', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: 'COMMITMENT_PAID',
        payments: [{ id: 'pay-1', stage: 'COMMITMENT' }],
      });

      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe(
        'Commitment payment already logged for this order'
      );
    });

    it('should successfully log final payment after commitment', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: 'COMMITMENT_PAID',
        payments: [{ id: 'pay-1', stage: 'COMMITMENT' }],
      });

      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));
      mockPrisma.payment.create.mockResolvedValue({ id: 'pay-2', amount: 900, stage: 'FINAL' });
      mockPrisma.order.update.mockResolvedValue({});
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: adminToken },
        payload: { ...validPayload, stage: 'FINAL', amount: 900 },
      });

      expect(response.statusCode).toBe(201);
      expect(mockPrisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orderId },
          data: { status: 'FULLY_PAID' },
        })
      );
    });

    it('should reject final payment if commitment is missing', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: 'PLACED',
        payments: [],
      });

      const response = await app.inject({
        method: 'POST',
        url: `/orders/${orderId}/payments`,
        cookies: { token: adminToken },
        payload: { ...validPayload, stage: 'FINAL' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe(
        'Cannot log final payment before commitment payment'
      );
    });
  });
});
