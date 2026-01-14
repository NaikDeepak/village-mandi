import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Product Routes', () => {
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
  // GET /products
  // ==========================================
  describe('GET /products', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/products',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/products',
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return list of active products for admin', async () => {
      const mockProducts = [
        {
          id: 'p1',
          name: 'Tomatoes',
          unit: 'KG',
          isActive: true,
          farmer: { id: 'f1', name: 'Farmer One', location: 'Village A', isActive: true },
        },
        {
          id: 'p2',
          name: 'Potatoes',
          unit: 'KG',
          isActive: true,
          farmer: { id: 'f1', name: 'Farmer One', location: 'Village A', isActive: true },
        },
      ];

      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const response = await app.inject({
        method: 'GET',
        url: '/products',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.products).toHaveLength(2);
      expect(body.products[0].name).toBe('Tomatoes');
    });

    it('should filter by farmerId when provided', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);

      await app.inject({
        method: 'GET',
        url: '/products?farmerId=farmer-123',
        cookies: { token: adminToken },
      });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            farmerId: 'farmer-123',
          }),
        })
      );
    });
  });

  // ==========================================
  // GET /products/:id
  // ==========================================
  describe('GET /products/:id', () => {
    it('should return 404 for non-existent product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/products/non-existent-id',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return product with farmer info', async () => {
      const mockProduct = {
        id: 'p1',
        name: 'Tomatoes',
        unit: 'KG',
        description: 'Fresh tomatoes',
        isActive: true,
        farmer: { id: 'f1', name: 'Farmer One', location: 'Village A', isActive: true },
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const response = await app.inject({
        method: 'GET',
        url: '/products/p1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.product.name).toBe('Tomatoes');
      expect(body.product.farmer.name).toBe('Farmer One');
    });
  });

  // ==========================================
  // POST /products
  // ==========================================
  describe('POST /products', () => {
    it('should return 400 for missing farmerId', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/products',
        cookies: { token: adminToken },
        payload: {
          name: 'Tomatoes',
          unit: 'KG',
          // Missing farmerId
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation Error');
    });

    it('should return 400 for non-existent farmer', async () => {
      mockPrisma.farmer.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: '/products',
        cookies: { token: adminToken },
        payload: {
          farmerId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
          name: 'Tomatoes',
          unit: 'KG',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Farmer not found');
    });

    it('should return 400 for inactive farmer', async () => {
      mockPrisma.farmer.findUnique.mockResolvedValue({
        id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
        name: 'Inactive Farmer',
        isActive: false,
      });

      const response = await app.inject({
        method: 'POST',
        url: '/products',
        cookies: { token: adminToken },
        payload: {
          farmerId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
          name: 'Tomatoes',
          unit: 'KG',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Cannot add products to an inactive farmer');
    });

    it('should create product with valid data', async () => {
      const farmerId = 'c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f';
      mockPrisma.farmer.findUnique.mockResolvedValue({
        id: farmerId,
        name: 'Active Farmer',
        isActive: true,
      });

      const newProduct = {
        id: 'new-product-id',
        farmerId,
        name: 'Tomatoes',
        unit: 'KG',
        description: null,
        seasonStart: null,
        seasonEnd: null,
        isActive: true,
        farmer: { id: farmerId, name: 'Active Farmer', location: 'Village A' },
      };

      mockPrisma.product.create.mockResolvedValue(newProduct);

      const response = await app.inject({
        method: 'POST',
        url: '/products',
        cookies: { token: adminToken },
        payload: {
          farmerId,
          name: 'Tomatoes',
          unit: 'KG',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.product.name).toBe('Tomatoes');
      expect(body.product.farmer.name).toBe('Active Farmer');
    });
  });

  // ==========================================
  // PUT /products/:id
  // ==========================================
  describe('PUT /products/:id', () => {
    it('should return 404 for non-existent product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'PUT',
        url: '/products/non-existent-id',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should update product successfully', async () => {
      const existingProduct = {
        id: 'p1',
        name: 'Old Name',
        unit: 'KG',
        isActive: true,
      };

      const updatedProduct = {
        ...existingProduct,
        name: 'Updated Name',
        farmer: { id: 'f1', name: 'Farmer', location: 'Village' },
      };

      mockPrisma.product.findUnique.mockResolvedValue(existingProduct);
      mockPrisma.product.update.mockResolvedValue(updatedProduct);

      const response = await app.inject({
        method: 'PUT',
        url: '/products/p1',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.product.name).toBe('Updated Name');
    });
  });

  // ==========================================
  // DELETE /products/:id (Soft Delete)
  // ==========================================
  describe('DELETE /products/:id', () => {
    it('should return 404 for non-existent product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'DELETE',
        url: '/products/non-existent-id',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should soft delete product (set isActive=false)', async () => {
      const existingProduct = {
        id: 'p1',
        name: 'Product',
        isActive: true,
      };

      mockPrisma.product.findUnique.mockResolvedValue(existingProduct);
      mockPrisma.product.update.mockResolvedValue({ ...existingProduct, isActive: false });

      const response = await app.inject({
        method: 'DELETE',
        url: '/products/p1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { isActive: false },
      });
    });
  });
});
