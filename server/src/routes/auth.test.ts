import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildTestApp, generateAdminToken, mockPrisma, resetMocks } from '../tests/helpers';
import { hashPassword } from '../utils/password';

describe('Auth Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;

  beforeAll(async () => {
    app = await buildTestApp();
    adminToken = generateAdminToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('POST /auth/admin/login', () => {
    it('should login successfully with valid credentials', async () => {
      const password = 'password123';
      const passwordHash = await hashPassword(password);

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'admin-id',
        email: 'admin@example.com',
        role: 'ADMIN',
        name: 'Admin User',
        passwordHash,
        isActive: true,
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/admin/login',
        payload: {
          email: 'admin@example.com',
          password,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.user.email).toBe('admin@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: '/auth/admin/login',
        payload: {
          email: 'wrong@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 400 for invalid input', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/admin/login',
        payload: {
          email: 'invalid-email',
          password: '123', // too short
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user when authenticated', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'admin-id',
        role: 'ADMIN',
        name: 'Admin User',
        email: 'admin@example.com',
        isActive: true,
        isInvited: true,
      });

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.user.id).toBe('admin-id');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 404 if user no longer exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear the token cookie', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/logout',
      });

      expect(response.statusCode).toBe(200);
      const cookie = response.headers['set-cookie'];
      expect(cookie).toContain('token=;');
    });
  });

  describe('POST /auth/firebase-verify', () => {
    it('should verify firebase token and login successfully', async () => {
      const mockDecodedToken = {
        uid: 'firebase-uid',
        phone_number: '+919876543210',
      };

      const verifyIdTokenMock = vi.fn().mockResolvedValue(mockDecodedToken);
      vi.spyOn(app.firebase, 'auth').mockReturnValue({
        verifyIdToken: verifyIdTokenMock,
      } as any);

      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null) // by UID
        .mockResolvedValueOnce({
          id: 'user-id',
          phone: '9876543210',
          role: 'BUYER',
          isInvited: true,
          isActive: true,
        }); // by Phone

      mockPrisma.user.update.mockResolvedValue({
        id: 'user-id',
        phone: '9876543210',
        role: 'BUYER',
        isInvited: true,
        isActive: true,
        firebaseUid: 'firebase-uid',
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/firebase-verify',
        payload: {
          idToken: 'valid-firebase-token',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.user.phone).toBe('9876543210');
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('should deny access if user not found/invited', async () => {
      const mockDecodedToken = {
        uid: 'firebase-uid',
        phone_number: '+919876543210',
      };

      vi.spyOn(app.firebase, 'auth').mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue(mockDecodedToken),
      } as any);

      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: '/auth/firebase-verify',
        payload: {
          idToken: 'valid-firebase-token',
        },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return 400 if phone number missing in token', async () => {
      vi.spyOn(app.firebase, 'auth').mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({ uid: 'some-uid' }), // no phone_number
      } as any);

      const response = await app.inject({
        method: 'POST',
        url: '/auth/firebase-verify',
        payload: {
          idToken: 'valid-firebase-token',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
