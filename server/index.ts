import Fastify from 'fastify';
import { SYSTEM_RULES } from '../shared/constants';

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
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
