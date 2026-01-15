import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify, { type FastifyInstance } from 'fastify';
import { vi } from 'vitest';

import batchProductRoutes from '../routes/batch-products';
import batchRoutes from '../routes/batches';
import farmerRoutes from '../routes/farmers';
import hubRoutes from '../routes/hubs';
import productRoutes from '../routes/products';

// Mock Prisma client
export const mockPrisma = {
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

  await app.ready();
  return app;
}

// Helper to generate admin JWT token for testing
export function generateAdminToken(app: FastifyInstance): string {
  return app.jwt.sign({
    userId: 'test-admin-id',
    role: 'ADMIN',
  });
}

// Helper to generate buyer JWT token for testing
export function generateBuyerToken(app: FastifyInstance): string {
  return app.jwt.sign({
    userId: 'test-buyer-id',
    role: 'BUYER',
  });
}

// Reset all mocks between tests
export function resetMocks(): void {
  vi.clearAllMocks();
}
