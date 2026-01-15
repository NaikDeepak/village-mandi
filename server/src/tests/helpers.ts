import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify, { type FastifyInstance } from 'fastify';
import { vi } from 'vitest';

import batchProductRoutes from '../routes/batch-products';
import batchRoutes from '../routes/batches';
import farmerRoutes from '../routes/farmers';
import hubRoutes from '../routes/hubs';
import orderRoutes from '../routes/orders';
import packingRoutes from '../routes/packing';
import paymentRoutes from '../routes/payments';
import payoutRoutes from '../routes/payouts';
import productRoutes from '../routes/products';

// Mock Prisma client
export const mockPrisma = {
  $transaction: vi.fn(async (fn) => {
    if (typeof fn === 'function') return await fn(mockPrisma);
    if (Array.isArray(fn)) return await Promise.all(fn);
    return fn;
  }),
  farmer: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  product: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  hub: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  batch: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  batchProduct: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  order: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  payment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  farmerPayout: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  eventLog: {
    create: vi.fn(),
  },
};

// Extend Fastify types for request user (prisma is already declared by the plugin)
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      userId: string;
      role: 'ADMIN' | 'BUYER';
    };
  }
}

export async function buildTestApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });

  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register cookie
  await app.register(cookie);

  // Register JWT
  await app.register(jwt, {
    secret: 'test-secret-key',
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  // Decorate with mock prisma (use type assertion to bypass Prisma types)
  // biome-ignore lint/suspicious/noExplicitAny: Test mock override
  app.decorate('prisma', mockPrisma as any);

  // Register routes
  await app.register(farmerRoutes);
  await app.register(productRoutes);
  await app.register(hubRoutes);
  await app.register(batchRoutes);
  await app.register(batchProductRoutes);
  await app.register(orderRoutes);
  await app.register(packingRoutes);
  await app.register(paymentRoutes);
  await app.register(payoutRoutes);

  await app.ready();
  return app;
}

// Helper to generate admin JWT token for testing
export function generateAdminToken(app: FastifyInstance, payload?: { id?: string }): string {
  const userId = payload?.id || 'test-admin-id';
  return app.jwt.sign({
    userId,
    role: 'ADMIN',
  });
}

// Helper to generate buyer JWT token for testing
export function generateBuyerToken(app: FastifyInstance, payload?: { id?: string }): string {
  const userId = payload?.id || 'test-buyer-id';
  return app.jwt.sign({
    userId,
    role: 'BUYER',
  });
}

// Reset all mocks between tests
export function resetMocks(): void {
  vi.clearAllMocks();
}
