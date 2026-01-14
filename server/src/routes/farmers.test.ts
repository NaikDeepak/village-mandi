import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Farmer Routes', () => {
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
  // GET /farmers
  // ==========================================
  describe('GET /farmers', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/farmers',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/farmers',
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return list of active farmers for admin', async () => {
      const mockFarmers = [
        {
          id: '1',
          name: 'Farmer One',
          location: 'Village A',
          relationshipLevel: 'SELF',
          isActive: true,
          _count: { products: 3 },
        },
        {
          id: '2',
          name: 'Farmer Two',
          location: 'Village B',
          relationshipLevel: 'FAMILY',
          isActive: true,
          _count: { products: 5 },
        },
      ];

      mockPrisma.farmer.findMany.mockResolvedValue(mockFarmers);

      const response = await app.inject({
        method: 'GET',
        url: '/farmers',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.farmers).toHaveLength(2);
      expect(body.farmers[0].name).toBe('Farmer One');
    });

    it('should include inactive farmers when includeInactive=true', async () => {
      mockPrisma.farmer.findMany.mockResolvedValue([]);

      await app.inject({
        method: 'GET',
        url: '/farmers?includeInactive=true',
        cookies: { token: adminToken },
      });

      expect(mockPrisma.farmer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });
  });

  // ==========================================
  // GET /farmers/:id
  // ==========================================
  describe('GET /farmers/:id', () => {
    it('should return 404 for non-existent farmer', async () => {
      mockPrisma.farmer.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/farmers/non-existent-id',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return farmer with products', async () => {
      const mockFarmer = {
        id: '1',
        name: 'Farmer One',
        location: 'Village A',
        relationshipLevel: 'SELF',
        isActive: true,
        products: [
          { id: 'p1', name: 'Tomatoes', unit: 'KG' },
          { id: 'p2', name: 'Potatoes', unit: 'KG' },
        ],
      };

      mockPrisma.farmer.findUnique.mockResolvedValue(mockFarmer);

      const response = await app.inject({
        method: 'GET',
        url: '/farmers/1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.farmer.name).toBe('Farmer One');
      expect(body.farmer.products).toHaveLength(2);
    });
  });

  // ==========================================
  // POST /farmers
  // ==========================================
  describe('POST /farmers', () => {
    it('should return 400 for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/farmers',
        cookies: { token: adminToken },
        payload: {
          name: 'A', // Too short
          // Missing location and relationshipLevel
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation Error');
    });

    it('should create farmer with valid data', async () => {
      const newFarmer = {
        id: 'new-id',
        name: 'New Farmer',
        location: 'New Village',
        relationshipLevel: 'SELF',
        isActive: true,
        createdAt: new Date(),
      };

      mockPrisma.farmer.create.mockResolvedValue(newFarmer);

      const response = await app.inject({
        method: 'POST',
        url: '/farmers',
        cookies: { token: adminToken },
        payload: {
          name: 'New Farmer',
          location: 'New Village',
          relationshipLevel: 'SELF',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.farmer.name).toBe('New Farmer');
    });

    it('should reject invalid relationship level', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/farmers',
        cookies: { token: adminToken },
        payload: {
          name: 'New Farmer',
          location: 'New Village',
          relationshipLevel: 'INVALID',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  // ==========================================
  // PUT /farmers/:id
  // ==========================================
  describe('PUT /farmers/:id', () => {
    it('should return 404 for non-existent farmer', async () => {
      mockPrisma.farmer.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'PUT',
        url: '/farmers/non-existent-id',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should update farmer successfully', async () => {
      const existingFarmer = {
        id: '1',
        name: 'Old Name',
        location: 'Old Location',
        relationshipLevel: 'SELF',
        isActive: true,
      };

      const updatedFarmer = {
        ...existingFarmer,
        name: 'Updated Name',
      };

      mockPrisma.farmer.findUnique.mockResolvedValue(existingFarmer);
      mockPrisma.farmer.update.mockResolvedValue(updatedFarmer);

      const response = await app.inject({
        method: 'PUT',
        url: '/farmers/1',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.farmer.name).toBe('Updated Name');
    });
  });

  // ==========================================
  // DELETE /farmers/:id (Soft Delete)
  // ==========================================
  describe('DELETE /farmers/:id', () => {
    it('should return 404 for non-existent farmer', async () => {
      mockPrisma.farmer.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'DELETE',
        url: '/farmers/non-existent-id',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should soft delete farmer (set isActive=false)', async () => {
      const existingFarmer = {
        id: '1',
        name: 'Farmer',
        isActive: true,
      };

      mockPrisma.farmer.findUnique.mockResolvedValue(existingFarmer);
      mockPrisma.farmer.update.mockResolvedValue({ ...existingFarmer, isActive: false });

      const response = await app.inject({
        method: 'DELETE',
        url: '/farmers/1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(mockPrisma.farmer.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
      });
    });
  });
});
