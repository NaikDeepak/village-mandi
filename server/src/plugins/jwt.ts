import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      role: 'ADMIN' | 'BUYER';
    };
    user: {
      userId: string;
      role: 'ADMIN' | 'BUYER';
    };
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  // Register cookie plugin first
  await fastify.register(fastifyCookie);

  // Register JWT plugin
  await fastify.register(fastifyJwt, {
    secret: jwtSecret,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
    sign: {
      expiresIn: '7d', // Token expires in 7 days
    },
  });
};

export default fp(jwtPlugin, {
  name: 'jwt',
});
