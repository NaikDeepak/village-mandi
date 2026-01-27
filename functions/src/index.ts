import { PrismaClient } from '@prisma/client';
import { HttpsError } from 'firebase-functions/v2/https';
import { beforeUserSignedIn } from 'firebase-functions/v2/identity';

// Re-use Prisma client across function invocations
const prisma = new PrismaClient();

export const beforeSignIn = beforeUserSignedIn(async (event) => {
  const user = event.data;

  if (!user) {
    return;
  }

  const phone = user.phoneNumber;

  if (!phone) {
    // If no phone number, we can't verify status.
    // This shouldn't happen with our current auth setup.
    return;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (!dbUser) {
      // User not in DB yet - treat as PENDING for now
      // This allows us to handle new registrations where the record is created post-auth
      // BUT for strict controlled access, we might want to block here.
      // The plan says: "If not found, treat as PENDING."
      throw new HttpsError('permission-denied', 'ACCOUNT_PENDING');
    }

    if (dbUser.status === 'PENDING') {
      throw new HttpsError('permission-denied', 'ACCOUNT_PENDING');
    }

    if (dbUser.status === 'REJECTED') {
      throw new HttpsError(
        'permission-denied',
        JSON.stringify({
          code: 'ACCOUNT_REJECTED',
          reason: dbUser.rejectionReason || 'No reason provided',
        })
      );
    }

    // If APPROVED, return custom claims
    return {
      customClaims: {
        role: dbUser.role,
        status: dbUser.status,
      },
    };
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    console.error('Error in beforeSignIn blocking function:', error);
    // Generic error for internal database issues
    throw new HttpsError('internal', 'Internal authentication error');
  }
});
