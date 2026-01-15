import { UserRole } from '@prisma/client';
import { prisma } from '../db';
import { hashPassword } from '../src/utils/password';

async function main() {
  console.log('🌱 Starting production seeding...');

  // =====================
  // 1. ADMIN USER
  // =====================
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword && process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_PASSWORD environment variable is required in production');
  }

  const adminPasswordHash = await hashPassword(adminPassword || 'admin123456');

  if (!adminPassword && process.env.NODE_ENV !== 'production') {
    console.warn(
      '⚠️ ADMIN_PASSWORD not set. Using a default password for development. Set ADMIN_PASSWORD in your .env file for a secure setup.'
    );
  }

  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      name: 'System Admin',
      phone: '9999999999',
      email: 'admin@villagemandi.com',
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash,
      isInvited: true,
      isActive: true,
    },
  });
  console.log('✅ Admin user ready:', admin.phone);

  // =====================
  // 2. INITIAL HUB
  // =====================
  const hub = await prisma.hub.upsert({
    where: { name: 'Main Hub' }, // Assumes 'name' is a unique field
    update: {}, // No updates needed if it already exists
    create: {
      name: 'Main Hub',
      address: 'Central Location',
      isActive: true,
    },
  });
  console.log('✅ Initial Hub ready:', hub.name);

  console.log('🎉 Production seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
