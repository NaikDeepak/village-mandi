import 'dotenv/config';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import Fastify from 'fastify';
import { SYSTEM_RULES } from '../shared/constants';

// Plugins
import firebasePlugin from './src/plugins/firebase';
import jwtPlugin from './src/plugins/jwt';
import prismaPlugin from './src/plugins/prisma';
import rateLimitPlugin from './src/plugins/rate-limit';

// Routes
import authRoutes from './src/routes/auth';
import batchProductRoutes from './src/routes/batch-products';
import batchRoutes from './src/routes/batches';
import farmerRoutes from './src/routes/farmers';
import hubRoutes from './src/routes/hubs';
import logRoutes from './src/routes/logs';
import orderRoutes from './src/routes/orders';
import packingRoutes from './src/routes/packing';
import paymentRoutes from './src/routes/payments';
import payoutRoutes from './src/routes/payouts';
import productRoutes from './src/routes/products';
import userRoutes from './src/routes/users';

const isProduction = process.env.NODE_ENV === 'production';

const fastify = Fastify({
  logger: isProduction
    ? { level: 'error' }
    : {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      },
  trustProxy: true,
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
      ? [
          'https://apnakhet.app',
          'https://www.apnakhet.app',
          'https://village-mandi-server.vercel.app',
        ] // Added Vercel app as potential backend host
      : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
});

// Register plugins
fastify.register(helmet);
fastify.register(prismaPlugin);
fastify.register(jwtPlugin);
fastify.register(firebasePlugin);
fastify.register(rateLimitPlugin);

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, 'Global Error Handler caught exception');

  reply.status(error.statusCode || 500).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
  });
});

// Register routes
fastify.register(
  async (api) => {
    api.register(authRoutes);
    api.register(batchRoutes);
    api.register(batchProductRoutes);
    api.register(farmerRoutes);
    api.register(hubRoutes);
    api.register(orderRoutes);
    api.register(packingRoutes);
    api.register(paymentRoutes);
    api.register(payoutRoutes);
    api.register(productRoutes);
    api.register(logRoutes);
    api.register(userRoutes);

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
