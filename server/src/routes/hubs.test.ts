import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Hub Routes', () => {
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

  // ==========================================
  // GET /hubs
  // ==========================================
  describe('GET /hubs', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/hubs',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/hubs',
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return list of active hubs for admin', async () => {
      const mockHubs = [
        { id: '1', name: 'Hub One', address: '123 Main St', isActive: true },
        { id: '2', name: 'Hub Two', address: '456 Oak Ave', isActive: true },
      ];

      mockPrisma.hub.findMany.mockResolvedValue(mockHubs);

      const response = await app.inject({
        method: 'GET',
        url: '/hubs',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.hubs).toHaveLength(2);
      expect(body.hubs[0].name).toBe('Hub One');
    });
  });

  // ==========================================
  // POST /hubs
  // ==========================================
  describe('POST /hubs', () => {
    it('should return 400 for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/hubs',
        cookies: { token: adminToken },
        payload: {
          name: 'A', // Too short
          address: '123', // Too short
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation Error');
    });

    it('should create hub with valid data', async () => {
      const newHub = {
        id: 'new-id',
        name: 'New Hub',
        address: '789 New Street',
        isActive: true,
      };

      mockPrisma.hub.create.mockResolvedValue(newHub);

      const response = await app.inject({
        method: 'POST',
        url: '/hubs',
        cookies: { token: adminToken },
        payload: {
          name: 'New Hub',
          address: '789 New Street',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.hub.name).toBe('New Hub');
    });
  });

  // ==========================================
  // PUT /hubs/:id
  // ==========================================
  describe('PUT /hubs/:id', () => {
    it('should return 404 for non-existent hub', async () => {
      mockPrisma.hub.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'PUT',
        url: '/hubs/non-existent-id',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should update hub successfully', async () => {
      const existingHub = {
        id: '1',
        name: 'Old Name',
        address: 'Old Address',
        isActive: true,
      };

      const updatedHub = {
        ...existingHub,
        name: 'Updated Name',
      };

      mockPrisma.hub.findUnique.mockResolvedValue(existingHub);
      mockPrisma.hub.update.mockResolvedValue(updatedHub);

      const response = await app.inject({
        method: 'PUT',
        url: '/hubs/1',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.hub.name).toBe('Updated Name');
    });
  });

  // ==========================================
  // DELETE /hubs/:id (Soft Delete)
  // ==========================================
  describe('DELETE /hubs/:id', () => {
    it('should return 404 for non-existent hub', async () => {
      mockPrisma.hub.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'DELETE',
        url: '/hubs/non-existent-id',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should soft delete hub (set isActive=false)', async () => {
      const existingHub = {
        id: '1',
        name: 'Hub',
        isActive: true,
      };

      mockPrisma.hub.findUnique.mockResolvedValue(existingHub);
      mockPrisma.hub.update.mockResolvedValue({ ...existingHub, isActive: false });

      const response = await app.inject({
        method: 'DELETE',
        url: '/hubs/1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(mockPrisma.hub.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
      });
    });
  });
});
