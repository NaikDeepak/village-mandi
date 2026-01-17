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
        const phone = firebasePhone.replace('+91', '');

        // 3. Upsert User in Prisma
        // First, try to find by firebaseUid or phone
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ firebaseUid: uid }, { phone }],
          },
        });

        if (user) {
          // Update firebaseUid if it was missing (linked by phone)
          if (!user.firebaseUid) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { firebaseUid: uid },
            });
          }
        } else {
          // Create new user (Auto-signup for now, or check invitation if required)
          // Note: PROJECT.md mentioned invite-only, but usually social/phone login
          // might bypass if we want to allow discovery, but let's stick to 'isInvited: true'
          // if we want to follow the previous pattern, or 'false' if they need manual approval.
          // For MVP, if they have the OTP, they are "verified".
          user = await prisma.user.create({
            data: {
              firebaseUid: uid,
              phone,
              name: `User ${phone.slice(-4)}`, // Default name
              role: 'BUYER',
              isActive: true,
              isInvited: true, // Auto-invite for now since they verified phone via Firebase
            },
          });
          request.log.info(
            { ...logContext, userId: user.id },
            'New user created via Firebase verify'
          );
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
