import { UserRole } from '@prisma/client';
import { prisma } from '../db';
import { hashPassword } from '../src/utils/password';

async function main() {
  // biome-ignore lint/suspicious/noConsoleLog: Script output
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

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { phone: '9999999999' },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        phone: '9999999999',
        email: 'admin@villagemandi.com',
        role: UserRole.ADMIN,
        passwordHash: adminPasswordHash,
        isInvited: true,
        isActive: true,
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script output
    console.log('✅ Admin user created:', admin.phone);
  } else {
    // biome-ignore lint/suspicious/noConsoleLog: Script output
    console.log('ℹ️ Admin user already exists. Skipping creation to preserve password.');
  }

  // =====================
  // 2. INITIAL HUB
  // =====================
  // Check if hub exists
  const existingHub = await prisma.hub.findFirst({
    where: { name: 'Main Hub' },
  });

  if (!existingHub) {
    const hub = await prisma.hub.create({
      data: {
        name: 'Main Hub',
        address: 'Central Location',
        isActive: true,
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script output
    console.log('✅ Initial Hub created:', hub.name);
  } else {
    // biome-ignore lint/suspicious/noConsoleLog: Script output
    console.log('ℹ️ Hub already exists. Skipping creation.');
  }

  // biome-ignore lint/suspicious/noConsoleLog: Script output
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
