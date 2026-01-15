import 'dotenv/config';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { SYSTEM_RULES } from '../shared/constants';

import jwtPlugin from './src/plugins/jwt';
// Plugins
import prismaPlugin from './src/plugins/prisma';

// Routes
import authRoutes from './src/routes/auth';
import batchProductRoutes from './src/routes/batch-products';
import batchRoutes from './src/routes/batches';
import farmerRoutes from './src/routes/farmers';
import hubRoutes from './src/routes/hubs';
import orderRoutes from './src/routes/orders';
import productRoutes from './src/routes/products';

const fastify = Fastify({
  logger: true,
});

/**
 * VIRTUAL MANDI SERVER
 * Non-negotiable rules check:
 * 1. Batch-based orders
 * 2. Cutoff lock
 * 3. Two-stage payment (10% commitment)
 * 4. Linked to Farmer
 */

// Register CORS
fastify.register(cors, {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://virtualmandi.com'] // Update with your production domain
      : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register plugins
fastify.register(prismaPlugin);
fastify.register(jwtPlugin);

// Register routes
fastify.register(
  async (api) => {
    api.register(authRoutes);
    api.register(batchRoutes);
    api.register(batchProductRoutes);
    api.register(farmerRoutes);
    api.register(hubRoutes);
    api.register(orderRoutes);
    api.register(productRoutes);

    // Health check
    api.get('/health', async (_request, _reply) => {
      return {
        status: 'ok',
        version: '1.0.0',
        philosophy: 'Trust & Transparency',
        rules: SYSTEM_RULES,
      };
    });
  },
  { prefix: '/api' }
);

const start = async () => {
  try {
    // Only listen when running locally
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      const port = Number.parseInt(process.env.PORT || '3000', 10);
      await fastify.listen({ port, host: '0.0.0.0' });
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// biome-ignore lint/suspicious/noExplicitAny: Vercel serverless handler requires generic types
export default async (req: any, res: any) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};
