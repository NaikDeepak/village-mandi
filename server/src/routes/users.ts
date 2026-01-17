import type { FastifyPluginAsync } from 'fastify';
import { authenticate, requireAdmin } from '../middleware/auth';
import { inviteUserSchema } from '../schemas/users';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // ==========================================
  // INVITE USER (ADMIN ONLY)
  // ==========================================
  fastify.post(
    '/users/invite',
    {
      preHandler: [authenticate, requireAdmin],
    },
    async (request, reply) => {
      const logContext = {
        userId: request.user.userId,
        path: request.url,
        method: request.method,
      };

      const parseResult = inviteUserSchema.safeParse(request.body);
      if (!parseResult.success) {
        request.log.warn(
          { ...logContext, details: parseResult.error.flatten().fieldErrors },
          'Invite user validation failed'
        );
        return reply.status(400).send({
          error: 'Validation Error',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const { phone, name } = parseResult.data;
      const normalizedPhone = phone.replace(/\D/g, '').slice(-10); // Ensure consistent 10-digit format

      try {
        // Upsert user: create if not exists, or update just to set isInvited=true
        const user = await prisma.user.upsert({
          where: { phone: normalizedPhone },
          update: {
            isInvited: true,
            isActive: true,
            // Only update name if provided and user lacks a name or has default
            ...(name ? { name } : {}),
          },
          create: {
            phone: normalizedPhone,
            name: name || `User ${normalizedPhone.slice(-4)}`,
            role: 'BUYER',
            isActive: true,
            isInvited: true,
          },
        });

        request.log.info({ ...logContext, invitedUser: user.id }, 'User invited successfully');

        return {
          success: true,
          message: 'User invited successfully',
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            isInvited: user.isInvited,
          },
        };
      } catch (error) {
        request.log.error({ ...logContext, err: error }, 'Failed to invite user');
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to invite user',
        });
      }
    }
  );
};

export default userRoutes;
