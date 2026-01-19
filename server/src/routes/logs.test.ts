import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Log Routes', () => {
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

  describe('POST /logs/communication', () => {
    const validPayload = {
      entityType: 'ORDER',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
      messageType: 'PAYMENT_REQUEST',
      recipientPhone: '9876543210',
      channel: 'WHATSAPP',
      metadata: { orderId: 'ORD-1' },
    };

    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/logs/communication',
        payload: validPayload,
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/logs/communication',
        cookies: { token: buyerToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(403);
    });

    it('should log communication successfully for admin', async () => {
      const mockLog = { id: 'log-id', ...validPayload, action: 'COMMUNICATION_SENT' };
      mockPrisma.eventLog.create.mockResolvedValue(mockLog);

      const response = await app.inject({
        method: 'POST',
        url: '/logs/communication',
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.log.id).toBe('log-id');
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entityType: 'ORDER',
          action: 'COMMUNICATION_SENT',
        }),
      });
    });

    it('should return 400 for invalid payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/logs/communication',
        cookies: { token: adminToken },
        payload: {
          entityType: 'INVALID',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /logs/communication/:entityType/:entityId', () => {
    const entityType = 'ORDER';
    const entityId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return communication history for admin', async () => {
      const mockLogs = [
        { id: 'log-1', entityType, entityId, action: 'COMMUNICATION_SENT' },
        { id: 'log-2', entityType, entityId, action: 'COMMUNICATION_SENT' },
      ];
      mockPrisma.eventLog.findMany.mockResolvedValue(mockLogs);

      const response = await app.inject({
        method: 'GET',
        url: `/logs/communication/${entityType}/${entityId}`,
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.logs).toHaveLength(2);
      expect(mockPrisma.eventLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            entityType,
            entityId,
            action: 'COMMUNICATION_SENT',
          },
        })
      );
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/logs/communication/${entityType}/${entityId}`,
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
