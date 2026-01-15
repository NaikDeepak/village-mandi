import type { FastifyPluginAsync } from 'fastify';
import { authenticate } from '../middleware/auth';
import { adminLoginSchema, requestOTPSchema, verifyOTPSchema } from '../schemas/auth';
import { generateOTP, getOTPExpiry, verifyPassword } from '../utils/password';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // ADMIN LOGIN (Email + Password)
  // ==========================================
  fastify.post('/auth/admin/login', async (request, reply) => {
    const parseResult = adminLoginSchema.safeParse(request.body);
    if (!parseResult.success) {
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
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

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
  });

  // ==========================================
  // BUYER REQUEST OTP
  // ==========================================
  fastify.post('/auth/request-otp', async (request, reply) => {
    const parseResult = requestOTPSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { phone } = parseResult.data;

    // Find buyer by phone
    const user = await prisma.user.findFirst({
      where: {
        phone,
        role: 'BUYER',
        isActive: true,
      },
    });

    if (!user) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'No account found with this phone number. Please contact admin for an invite.',
      });
    }

    if (!user.isInvited) {
      return reply.status(403).send({
        error: 'Not Invited',
        message: 'Your account is pending invitation. Please contact admin.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();

    // Save OTP to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt,
      },
    });

    // In development, log OTP to console (Mock OTP)
    if (process.env.NODE_ENV !== 'production') {
      console.info('OTP', otp);
    }

    return {
      success: true,
      message: 'OTP sent to your phone number',
      // Only include in development for testing
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    };
  });

  // ==========================================
  // BUYER VERIFY OTP
  // ==========================================
  fastify.post('/auth/verify-otp', async (request, reply) => {
    const parseResult = verifyOTPSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { phone, otp } = parseResult.data;

    // Find user with matching OTP
    const user = await prisma.user.findFirst({
      where: {
        phone,
        role: 'BUYER',
        isActive: true,
        isInvited: true,
      },
    });

    if (!user) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'No account found with this phone number',
      });
    }

    // Check OTP
    if (!user.otpCode || !user.otpExpiresAt) {
      return reply.status(400).send({
        error: 'Invalid OTP',
        message: 'Please request a new OTP',
      });
    }

    if (user.otpCode !== otp) {
      return reply.status(401).send({
        error: 'Invalid OTP',
        message: 'The OTP you entered is incorrect',
      });
    }

    if (new Date() > user.otpExpiresAt) {
      return reply.status(401).send({
        error: 'OTP Expired',
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

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
        phone: user.phone,
      },
    };
  });

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
};

export default authRoutes;
