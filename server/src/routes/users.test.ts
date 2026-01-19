import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('User Routes', () => {
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

  describe('POST /users/invite', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users/invite',
        payload: {
          phone: '9876543210',
          name: 'New User',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users/invite',
        cookies: { token: buyerToken },
        payload: {
          phone: '9876543210',
          name: 'New User',
        },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should invite a new user successfully (upsert create)', async () => {
      const invitedUser = {
        id: 'new-user-id',
        phone: '9876543210',
        name: 'New User',
        role: 'BUYER',
        isInvited: true,
        isActive: true,
      };

      mockPrisma.user.upsert.mockResolvedValue(invitedUser);

      const response = await app.inject({
        method: 'POST',
        url: '/users/invite',
        cookies: { token: adminToken },
        payload: {
          phone: '9876543210',
          name: 'New User',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.user.phone).toBe('9876543210');
      expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { phone: '9876543210' },
          create: expect.objectContaining({
            phone: '9876543210',
            name: 'New User',
            role: 'BUYER',
            isInvited: true,
          }),
        })
      );
    });

    it('should return 400 for invalid phone number', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users/invite',
        cookies: { token: adminToken },
        payload: {
          phone: '123', // too short
          name: 'New User',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
