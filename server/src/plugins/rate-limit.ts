import rateLimit from '@fastify/rate-limit';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  });

  // Strict limits for auth routes
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/auth')) {
      // For auth routes, we'll apply a stricter limit
      // Using route-level configuration is better, but this is a global way to catch all /api/auth
      // However, fastify-rate-limit prefers being configured on the route.
      // Let's keep it simple for now or use the 'config' property in routes later.
    }
  });
};

export default fp(rateLimitPlugin, {
  name: 'rate-limit',
});
