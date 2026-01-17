import type { FastifyPluginAsync } from 'fastify';
import { verifyAppCheck } from '../middleware/app-check';
import { authenticate } from '../middleware/auth';
import { adminLoginSchema, firebaseVerifySchema } from '../schemas/auth';
import { verifyPassword } from '../utils/password';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // ADMIN LOGIN (Email + Password)
  // ==========================================
  fastify.post(
    '/auth/admin/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const logContext = {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        path: request.url,
        method: request.method,
      };

      const parseResult = adminLoginSchema.safeParse(request.body);
      if (!parseResult.success) {
        request.log.warn(
          { ...logContext, details: parseResult.error.flatten().fieldErrors },
          'Admin login validation failed'
        );
        return reply.status(400).send({
          error: 'Validation Error',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const { email, password } = parseResult.data;

      // Find admin user by email
      const user = await prisma.user.findFirst({
        where: {
          email,
          role: 'ADMIN',
          isActive: true,
        },
      });

      if (!user || !user.passwordHash) {
        request.log.warn(
          { ...logContext, email },
          'Admin login failed: Invalid credentials or inactive'
        );
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        request.log.warn({ ...logContext, email }, 'Admin login failed: Incorrect password');
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      request.log.info({ ...logContext, userId: user.id }, 'Admin login successful');

      // Generate JWT token
      const token = fastify.jwt.sign({
        userId: user.id,
        role: user.role,
      });

      // Set HTTP-only cookie
      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return {
        success: true,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
      };
    }
  );

  // ==========================================
  // GET CURRENT USER
  // ==========================================
  fastify.get('/auth/me', { preHandler: [authenticate] }, async (request, reply) => {
    // Prevent caching of this response so that logout is reflected immediately
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');

    const { userId } = request.user;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        name: true,
        phone: true,
        email: true,
        isActive: true,
        isInvited: true,
      },
    });

    if (!user || !user.isActive) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    return { user };
  });

  // ==========================================
  // LOGOUT
  // ==========================================
  fastify.post('/auth/logout', async (request, reply) => {
    request.log.info('Logout request received');
    // Set cookie to expire immediately
    reply.setCookie('token', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    });
    return { success: true, message: 'Logged out successfully' };
  });

  // ==========================================
  // FIREBASE TOKEN VERIFICATION
  // ==========================================
  fastify.post(
    '/auth/firebase-verify',
    {
      preHandler: [verifyAppCheck],
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const logContext = {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        path: request.url,
        method: request.method,
      };

      request.log.info(
        {
          ...logContext,
          headers: request.headers,
          bodyKeys: Object.keys(request.body as object),
        },
        'Received /auth/firebase-verify request'
      );

      const parseResult = firebaseVerifySchema.safeParse(request.body);
      if (!parseResult.success) {
        request.log.warn(
          { ...logContext, details: parseResult.error.flatten().fieldErrors },
          'Firebase verify validation failed'
        );
        return reply.status(400).send({
          error: 'Validation Error',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const { idToken } = parseResult.data;

      try {
        // 1. Verify token with Firebase Admin
        request.log.info(logContext, 'Verifying ID token with Firebase Admin');
        const decodedToken = await fastify.firebase.auth().verifyIdToken(idToken);
        const { uid, phone_number: firebasePhone } = decodedToken;

        if (!firebasePhone) {
          request.log.warn(
            { ...logContext, uid },
            'Firebase verify failed: Phone number missing in token'
          );
          return reply.status(400).send({
            error: 'Invalid Token',
            message: 'Phone number not found in token',
          });
        }

        // 2. Normalize phone number (strip +91 if present)
        request.log.info(
          { ...logContext, uid, phone: firebasePhone },
          'Firebase ID token verified'
        );
        const phone = firebasePhone.replace(/\D/g, '').slice(-10);

        // 3. Upsert User in Prisma
        // Find user by UID first (highest priority), then by phone to link accounts.
        let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

        if (!user) {
          // No user found by UID, try to find by phone to link the account
          const userByPhone = await prisma.user.findUnique({ where: { phone } });
          if (userByPhone) {
            // User exists with this phone, link firebaseUid to it
            user = await prisma.user.update({
              where: { id: userByPhone.id },
              data: { firebaseUid: uid },
            });
          }
        }

        if (!user) {
          request.log.warn({ ...logContext, phone }, 'Login denied: User not found/not invited');
          return reply.status(403).send({
            error: 'Access Denied',
            message: 'You have not been invited. Please contact admin.',
          });
        }

        if (!user.isInvited && user.role === 'BUYER') {
          request.log.warn(
            { ...logContext, userId: user.id },
            'Login denied: User exists but isInvited=false'
          );
          return reply.status(403).send({
            error: 'Access Denied',
            message: 'You have not been invited. Please contact admin.',
          });
        }

        request.log.info(
          { ...logContext, userId: user.id },
          'Firebase token verified successfully'
        );

        // 4. Generate internal JWT
        const token = fastify.jwt.sign({
          userId: user.id,
          role: user.role,
        });

        // 5. Set HTTP-only cookie
        reply.setCookie('token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return {
          success: true,
          user: {
            id: user.id,
            role: user.role,
            name: user.name,
            phone: user.phone,
          },
        };
      } catch (error) {
        console.error('Server: Error in /auth/firebase-verify:', error);
        fastify.log.error({ err: error }, 'Firebase token verification failed');
        return reply.status(401).send({
          error: 'Authentication Failed',
          message: 'Invalid or expired Firebase token',
        });
      }
    }
  );
};

export default authRoutes;
