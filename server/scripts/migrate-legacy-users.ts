import { RegistrationStatus, UserRole } from '@prisma/client';
import { prisma } from '../db';

async function main() {
  // biome-ignore lint/suspicious/noConsoleLog: Script output
  console.log('🚀 Starting legacy user migration...');

  const result = await prisma.user.updateMany({
    where: {
      OR: [{ role: UserRole.ADMIN }, { isInvited: true }],
    },
    data: {
      status: RegistrationStatus.APPROVED,
    },
  });

  // biome-ignore lint/suspicious/noConsoleLog: Script output
  console.log(`✅ Migration complete. Updated ${result.count} users to APPROVED status.`);
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
