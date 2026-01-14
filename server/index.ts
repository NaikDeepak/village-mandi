import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { SYSTEM_RULES } from '../shared/constants';

// Plugins
import prismaPlugin from './src/plugins/prisma';
import jwtPlugin from './src/plugins/jwt';

// Routes
import authRoutes from './src/routes/auth';

const fastify = Fastify({
    logger: true
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
    origin: process.env.NODE_ENV === 'production'
        ? ['https://virtualmandi.com'] // Update with your production domain
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
});

// Register plugins
fastify.register(prismaPlugin);
fastify.register(jwtPlugin);

// Register routes
fastify.register(authRoutes);

// Health check
fastify.get('/health', async (request, reply) => {
    return {
        status: 'ok',
        version: '1.0.0',
        philosophy: 'Trust & Transparency',
        rules: SYSTEM_RULES
    };
});

const start = async () => {
    try {
        // Only listen when running locally
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            await fastify.listen({ port: 3000, host: '0.0.0.0' });
            console.log('Server is running on http://localhost:3000');
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

export default async (req: any, res: any) => {
    await fastify.ready();
    fastify.server.emit('request', req, res);
};
