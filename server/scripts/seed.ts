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
  const hub = await prisma.hub
    .upsert({
      where: { id: 'default-hub-1' }, // Using a fixed ID for idempotency in seed if possible, or name check
      update: {},
      create: {
        id: 'default-hub-1',
        name: 'Main Hub',
        address: 'Central Location',
        isActive: true,
      },
    })
    .catch(async () => {
      // Fallback if ID-based upsert isn't preferred or fails due to uuid type
      const existing = await prisma.hub.findFirst({ where: { name: 'Main Hub' } });
      if (existing) return existing;
      return prisma.hub.create({
        data: {
          name: 'Main Hub',
          address: 'Central Location',
          isActive: true,
        },
      });
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
