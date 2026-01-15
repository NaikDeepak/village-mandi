import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Batch Aggregation Routes', () => {
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

  describe('GET /batches/:id/aggregation', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/aggregation',
      });
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches/batch-1/aggregation',
        cookies: { token: buyerToken },
      });
      expect(response.statusCode).toBe(403);
    });

    it('should aggregate quantities correctly from confirmed orders', async () => {
      const batchId = 'batch-1';
      mockPrisma.batch.findUnique.mockResolvedValue({ id: batchId, name: 'Batch 1' });

      // Mock orders
      const mockOrders = [
        {
          id: 'order-1',
          status: 'COMMITMENT_PAID',
          items: [
            {
              orderedQty: 10,
              batchProduct: {
                id: 'bp-1',
                product: {
                  id: 'p-1',
                  name: 'Tomato',
                  unit: 'KG',
                  farmer: { id: 'f-1', name: 'Farmer 1', location: 'Loc 1' },
                },
              },
            },
            {
              orderedQty: 5,
              batchProduct: {
                id: 'bp-2',
                product: {
                  id: 'p-2',
                  name: 'Onion',
                  unit: 'KG',
                  farmer: { id: 'f-1', name: 'Farmer 1', location: 'Loc 1' },
                },
              },
            },
          ],
        },
        {
          id: 'order-2',
          status: 'FULLY_PAID',
          items: [
            {
              orderedQty: 20,
              batchProduct: {
                id: 'bp-1',
                product: {
                  id: 'p-1',
                  name: 'Tomato',
                  unit: 'KG',
                  farmer: { id: 'f-1', name: 'Farmer 1', location: 'Loc 1' },
                },
              },
            },
          ],
        },
        {
          id: 'order-3', // This one should be ignored as it is only PLACED
          status: 'PLACED',
          items: [
            {
              orderedQty: 100,
              batchProduct: {
                id: 'bp-1',
                product: {
                  id: 'p-1',
                  name: 'Tomato',
                  unit: 'KG',
                  farmer: { id: 'f-1', name: 'Farmer 1', location: 'Loc 1' },
                },
              },
            },
          ],
        },
      ];

      mockPrisma.order.findMany.mockResolvedValue(
        mockOrders.filter((o) => ['COMMITMENT_PAID', 'FULLY_PAID'].includes(o.status))
      );

      const response = await app.inject({
        method: 'GET',
        url: `/batches/${batchId}/aggregation`,
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      // Farmer 1 should have 2 products: Tomato (10+20=30) and Onion (5)
      expect(body.aggregation).toHaveLength(1);
      const farmer1 = body.aggregation[0];
      expect(farmer1.farmerName).toBe('Farmer 1');
      expect(farmer1.products).toHaveLength(2);

      interface AggregatedProduct {
        productName: string;
        totalQuantity: number;
      }

      const tomato = farmer1.products.find((p: AggregatedProduct) => p.productName === 'Tomato');
      const onion = farmer1.products.find((p: AggregatedProduct) => p.productName === 'Onion');

      expect(tomato.totalQuantity).toBe(30);
      expect(onion.totalQuantity).toBe(5);
    });

    it('should return 404 if batch not found', async () => {
      mockPrisma.batch.findUnique.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/batches/non-existent/aggregation',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
