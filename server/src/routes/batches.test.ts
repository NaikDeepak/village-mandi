import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  buildTestApp,
  generateAdminToken,
  generateBuyerToken,
  mockPrisma,
  resetMocks,
} from '../tests/helpers';

describe('Batch Routes', () => {
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
  // GET /batches
  // ==========================================
  describe('GET /batches', () => {
    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/batches',
        cookies: { token: buyerToken },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should filter batches by status', async () => {
      mockPrisma.batch.findMany.mockResolvedValue([]);

      await app.inject({
        method: 'GET',
        url: '/batches?status=OPEN',
        cookies: { token: adminToken },
      });

      expect(mockPrisma.batch.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'OPEN' },
        })
      );
    });
  });

  // ==========================================
  // GET /batches/current
  // ==========================================
  describe('GET /batches/current', () => {
    it('should return current OPEN batch', async () => {
      const mockBatch = {
        id: '1',
        name: 'Current Batch',
        status: 'OPEN',
        hub: { id: 'hub-1', name: 'Hub One' },
      };

      mockPrisma.batch.findFirst.mockResolvedValue(mockBatch);

      const response = await app.inject({
        method: 'GET',
        url: '/batches/current',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.batch.status).toBe('OPEN');
    });

    it('should return null when no OPEN batch exists', async () => {
      mockPrisma.batch.findFirst.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/batches/current',
        cookies: { token: adminToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.batch).toBeNull();
    });
  });

  // ==========================================
  // POST /batches
  // ==========================================
  describe('POST /batches', () => {
    it('should reject cutoffAt in the past', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString(); // Yesterday
      const futureDate = new Date(Date.now() + 172800000).toISOString(); // Day after tomorrow

      const response = await app.inject({
        method: 'POST',
        url: '/batches',
        cookies: { token: adminToken },
        payload: {
          hubId: 'hub-1',
          name: 'Test Batch',
          cutoffAt: pastDate,
          deliveryDate: futureDate,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation Error');
    });

    it('should reject deliveryDate before cutoffAt', async () => {
      const cutoffDate = new Date(Date.now() + 172800000).toISOString(); // Day after tomorrow
      const deliveryDate = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

      const response = await app.inject({
        method: 'POST',
        url: '/batches',
        cookies: { token: adminToken },
        payload: {
          hubId: 'hub-1',
          name: 'Test Batch',
          cutoffAt: cutoffDate,
          deliveryDate: deliveryDate,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation Error');
    });

    it('should create batch with valid data', async () => {
      const cutoffDate = new Date(Date.now() + 2 * 86400000).toISOString(); // 2 days from now
      const deliveryDate = new Date(Date.now() + 4 * 86400000).toISOString(); // 4 days from now

      const hubId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Valid UUID
      const mockHub = { id: hubId, name: 'Hub One', isActive: true };
      const mockBatch = {
        id: 'batch-1',
        name: 'Test Batch',
        status: 'DRAFT',
        hubId: hubId,
        cutoffAt: new Date(cutoffDate),
        deliveryDate: new Date(deliveryDate),
        hub: mockHub,
      };

      mockPrisma.hub.findUnique.mockResolvedValue(mockHub);
      mockPrisma.batch.create.mockResolvedValue(mockBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches',
        cookies: { token: adminToken },
        payload: {
          hubId: hubId,
          name: 'Test Batch',
          cutoffAt: cutoffDate,
          deliveryDate: deliveryDate,
        },
      });

      if (response.statusCode !== 201) {
        throw new Error(`Batch creation failed with ${response.statusCode}: ${response.body}`);
      }

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.batch.status).toBe('DRAFT');
    });
  });

  // ==========================================
  // PUT /batches/:id
  // ==========================================
  describe('PUT /batches/:id', () => {
    it('should only allow updates on DRAFT batches', async () => {
      const existingBatch = {
        id: 'batch-1',
        status: 'OPEN', // Not DRAFT
        name: 'Open Batch',
      };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'PUT',
        url: '/batches/batch-1',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Only DRAFT batches can be updated');
    });

    it('should update DRAFT batch successfully', async () => {
      const existingBatch = {
        id: 'batch-1',
        status: 'DRAFT',
        name: 'Old Name',
      };

      const updatedBatch = {
        ...existingBatch,
        name: 'Updated Name',
        hub: { id: 'hub-1', name: 'Hub One' },
      };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(updatedBatch);

      const response = await app.inject({
        method: 'PUT',
        url: '/batches/batch-1',
        cookies: { token: adminToken },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.batch.name).toBe('Updated Name');
    });
  });

  // ==========================================
  // STATE MACHINE TESTS (CRITICAL)
  // ==========================================
  describe('POST /batches/:id/transition - Valid Transitions', () => {
    it('should transition DRAFT → OPEN', async () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      const existingBatch = {
        id: 'batch-1',
        status: 'DRAFT',
        cutoffAt: futureDate,
      };

      const transitionedBatch = {
        ...existingBatch,
        status: 'OPEN',
        hub: { id: 'hub-1', name: 'Hub One' },
      };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(transitionedBatch);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'OPEN' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.batch.status).toBe('OPEN');
      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            entityType: 'BATCH',
            action: 'STATUS_CHANGE',
            metadata: { from: 'DRAFT', to: 'OPEN' },
          }),
        })
      );
    });

    it('should transition OPEN → CLOSED', async () => {
      const existingBatch = { id: 'batch-1', status: 'OPEN' };
      const transitionedBatch = { ...existingBatch, status: 'CLOSED', hub: {} };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(transitionedBatch);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'CLOSED' },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).batch.status).toBe('CLOSED');
    });

    it('should transition CLOSED → COLLECTED', async () => {
      const existingBatch = { id: 'batch-1', status: 'CLOSED' };
      const transitionedBatch = { ...existingBatch, status: 'COLLECTED', hub: {} };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(transitionedBatch);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'COLLECTED' },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).batch.status).toBe('COLLECTED');
    });

    it('should transition COLLECTED → DELIVERED', async () => {
      const existingBatch = { id: 'batch-1', status: 'COLLECTED' };
      const transitionedBatch = { ...existingBatch, status: 'DELIVERED', hub: {} };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(transitionedBatch);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'DELIVERED' },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).batch.status).toBe('DELIVERED');
    });

    it('should transition DELIVERED → SETTLED', async () => {
      const existingBatch = { id: 'batch-1', status: 'DELIVERED' };
      const transitionedBatch = { ...existingBatch, status: 'SETTLED', hub: {} };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(transitionedBatch);
      mockPrisma.eventLog.create.mockResolvedValue({});

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'SETTLED' },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).batch.status).toBe('SETTLED');
    });
  });

  describe('POST /batches/:id/transition - Invalid Transitions', () => {
    it('should reject DRAFT → CLOSED (skipping OPEN)', async () => {
      const existingBatch = { id: 'batch-1', status: 'DRAFT' };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'CLOSED' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid Transition');
      expect(body.message).toContain('Cannot transition from DRAFT to CLOSED');
    });

    it('should reject DRAFT → COLLECTED (skipping multiple states)', async () => {
      const existingBatch = { id: 'batch-1', status: 'DRAFT' };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'COLLECTED' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid Transition');
    });

    it('should reject OPEN → DRAFT (backwards)', async () => {
      const existingBatch = { id: 'batch-1', status: 'OPEN' };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'DRAFT' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid Transition');
    });

    it('should reject SETTLED → anything (terminal state)', async () => {
      const existingBatch = { id: 'batch-1', status: 'SETTLED' };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'OPEN' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('none (terminal state)');
    });

    it('should reject OPEN → OPEN (no-op)', async () => {
      const existingBatch = { id: 'batch-1', status: 'OPEN' };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'OPEN' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  // ==========================================
  // CUTOFF ENFORCEMENT TESTS
  // ==========================================
  describe('POST /batches/:id/transition - Cutoff Enforcement', () => {
    it('should reject DRAFT → OPEN if cutoffAt is in the past', async () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      const existingBatch = {
        id: 'batch-1',
        status: 'DRAFT',
        cutoffAt: pastDate,
      };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);

      const response = await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'OPEN' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Cannot transition to OPEN: cutoff time is in the past');
    });
  });

  // ==========================================
  // AUDIT LOGGING TESTS
  // ==========================================
  describe('Audit Logging', () => {
    it('should create EventLog entry on successful transition', async () => {
      const existingBatch = { id: 'batch-1', status: 'OPEN' };
      const transitionedBatch = { ...existingBatch, status: 'CLOSED', hub: {} };

      mockPrisma.batch.findUnique.mockResolvedValue(existingBatch);
      mockPrisma.batch.update.mockResolvedValue(transitionedBatch);
      mockPrisma.eventLog.create.mockResolvedValue({});

      await app.inject({
        method: 'POST',
        url: '/batches/batch-1/transition',
        cookies: { token: adminToken },
        payload: { targetStatus: 'CLOSED' },
      });

      expect(mockPrisma.eventLog.create).toHaveBeenCalledWith({
        data: {
          entityType: 'BATCH',
          entityId: 'batch-1',
          action: 'STATUS_CHANGE',
          metadata: {
            from: 'OPEN',
            to: 'CLOSED',
          },
        },
      });
    });
  });
});
