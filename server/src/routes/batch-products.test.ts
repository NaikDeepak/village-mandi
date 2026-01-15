import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Batch Product Routes', () => {
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
  // GET /batches/:id/products
  // ==========================================
  describe('GET /batches/:id/products', () => {
    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/products',
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return 404 if batch does not exist', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return empty array for batch with no products', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1' });
      mockPrisma.batchProduct.findMany.mockResolvedValue([]);

      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.products).toEqual([]);
    });

    it('should return products with farmer details', async () => {
      const mockBatchProducts = [
        {
          id: 'bp-1',
          productId: 'p-1',
          product: {
            id: 'p-1',
            name: 'Product 1',
            farmer: { id: 'f-1', name: 'Farmer 1' },
          },
        },
      ];

      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1' });
      mockPrisma.batchProduct.findMany.mockResolvedValue(mockBatchProducts);

      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.products).toHaveLength(1);
      expect(body.products[0].product.name).toBe('Product 1');
      expect(body.products[0].product.farmer.name).toBe('Farmer 1');
    });

    it('should filter by isActive', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1' });
      mockPrisma.batchProduct.findMany.mockResolvedValue([]);

      await app.inject({
        method: 'GET',
        url: '/batches/batch-1/products?isActive=true',
        cookies: { token: adminToken },
      });

      expect(mockPrisma.batchProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        })
      );
    });
  });

  // ==========================================
  // POST /batches/:id/products
  // ==========================================
  describe('POST /batches/:id/products', () => {
    const validProductId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const validPayload = {
      productId: validProductId,
      pricePerUnit: 50,
      facilitationPercent: 5,
      minOrderQty: 1,
      maxOrderQty: 10,
    };

    it('should add product to DRAFT batch successfully', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1', status: 'DRAFT' });
      mockPrisma.product.findUnique.mockResolvedValue({ id: validProductId, isActive: true });
      mockPrisma.batchProduct.findUnique.mockResolvedValue(null); // Not already in batch
      mockPrisma.batchProduct.create.mockResolvedValue({
        id: 'bp-1',
        ...validPayload,
        product: { id: validProductId, farmer: {} },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.batchProduct.id).toBe('bp-1');
    });

    it('should reject if batch is not DRAFT', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1', status: 'OPEN' });

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('only be added to DRAFT batches');
    });

    it('should reject if product not found', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1', status: 'DRAFT' });
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(404);
    });

    it('should reject if product is inactive', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1', status: 'DRAFT' });
      mockPrisma.product.findUnique.mockResolvedValue({ id: validProductId, isActive: false });

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('inactive product');
    });

    it('should reject if product already in batch', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue({ id: 'batch-1', status: 'DRAFT' });
      mockPrisma.product.findUnique.mockResolvedValue({ id: validProductId, isActive: true });
      mockPrisma.batchProduct.findUnique.mockResolvedValue({ id: 'bp-1' });

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
        payload: validPayload,
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('already added');
    });

    it('should reject if maxOrderQty < minOrderQty', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/products',
        cookies: { token: adminToken },
        payload: {
          ...validPayload,
          minOrderQty: 10,
          maxOrderQty: 5,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).details.maxOrderQty).toBeDefined();
    });
  });

  // ==========================================
  // GET /batch-products/:id
  // ==========================================
  describe('GET /batch-products/:id', () => {
    it('should return batch product details', async () => {
      const mockBatchProduct = {
        id: 'bp-1',
        batch: { id: 'batch-1' },
        product: {
          id: 'p-1',
          name: 'Product 1',
          farmer: { id: 'f-1', name: 'Farmer 1' },
        },
      };

      mockPrisma.batchProduct.findUnique.mockResolvedValue(mockBatchProduct);

      const response = await app.inject({
        method: 'GET',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.batchProduct.id).toBe('bp-1');
      expect(body.batchProduct.product.name).toBe('Product 1');
    });

    it('should return 404 if not found', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  // ==========================================
  // PUT /batch-products/:id
  // ==========================================
  describe('PUT /batch-products/:id', () => {
    const existingBP = {
      id: 'bp-1',
      minOrderQty: 1,
      maxOrderQty: 10,
      batch: { status: 'DRAFT' },
    };

    it('should update pricing successfully', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue(existingBP);
      mockPrisma.batchProduct.update.mockResolvedValue({ ...existingBP, pricePerUnit: 60 });

      const response = await app.inject({
        method: 'PUT',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
        payload: { pricePerUnit: 60 },
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.batchProduct.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ pricePerUnit: 60 }),
        })
      );
    });

    it('should reject if batch is not DRAFT', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue({
        ...existingBP,
        batch: { status: 'OPEN' },
      });

      const response = await app.inject({
        method: 'PUT',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
        payload: { pricePerUnit: 60 },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('only be updated when batch is in DRAFT');
    });

    it('should reject if new maxOrderQty < existing minOrderQty', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue({
        ...existingBP,
        minOrderQty: 5,
      });

      const response = await app.inject({
        method: 'PUT',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
        payload: { maxOrderQty: 4 },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('Maximum order quantity must be greater');
    });

    it('should reject if existing maxOrderQty < new minOrderQty', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue({
        ...existingBP,
        maxOrderQty: 5,
      });

      const response = await app.inject({
        method: 'PUT',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
        payload: { minOrderQty: 6 },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('Maximum order quantity must be greater');
    });
  });

  // ==========================================
  // DELETE /batch-products/:id
  // ==========================================
  describe('DELETE /batch-products/:id', () => {
    const existingBP = {
      id: 'bp-1',
      batch: { status: 'DRAFT' },
    };

    it('should soft delete by default', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue(existingBP);
      mockPrisma.batchProduct.update.mockResolvedValue({ ...existingBP, isActive: false });

      const response = await app.inject({
        method: 'DELETE',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.batchProduct.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { isActive: false },
        })
      );
    });

    it('should hard delete if force=true', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue(existingBP);

      const response = await app.inject({
        method: 'DELETE',
        url: '/batch-products/bp-1?force=true',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(204);
      expect(mockPrisma.batchProduct.delete).toHaveBeenCalledWith({
        where: { id: 'bp-1' },
      });
    });

    it('should reject if batch is not DRAFT', async () => {
      mockPrisma.batchProduct.findUnique.mockResolvedValue({
        ...existingBP,
        batch: { status: 'OPEN' },
      });

      const response = await app.inject({
        method: 'DELETE',
        url: '/batch-products/bp-1',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toContain('only be removed when batch is in DRAFT');
    });
  });
});
