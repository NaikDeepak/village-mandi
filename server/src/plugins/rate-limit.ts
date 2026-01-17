import rateLimit from '@fastify/rate-limit';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (request, context) => {
      request.log.warn(
        {
          ip: request.ip,
          userAgent: request.headers['user-agent'],
          path: request.url,
          method: request.method,
          after: context.after,
          max: context.max,
        },
        'Rate limit exceeded'
      );
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${context.after}.`,
      };
    },
  });
};

export default fp(rateLimitPlugin, {
  name: 'rate-limit',
});
