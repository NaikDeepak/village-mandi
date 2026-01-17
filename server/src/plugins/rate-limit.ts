import rateLimit from '@fastify/rate-limit';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (_request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please try again in ${context.after}.`,
    }),
  });
};

export default fp(rateLimitPlugin, {
  name: 'rate-limit',
});
