import path from 'node:path';
import * as dotenv from 'dotenv';
import { prisma } from '../db';
import { hashPassword } from '../src/utils/password';

// Force load .env for the script execution context just in case
dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const email = 'admin@virtualmandi.com';
  // Use env var or fallback
  const password = process.env.ADMIN_PASSWORD || 'admin123456';

  // biome-ignore lint/suspicious/noConsoleLog: Script output
  console.log(`Resetting password for ${email}...`);

  try {
    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      const user = await prisma.user.update({
        where: { email },
        data: {
          passwordHash: hashedPassword,
          isActive: true,
          role: 'ADMIN',
        },
      });
      // biome-ignore lint/suspicious/noConsoleLog: Script output
      console.log('✅ Password updated successfully!');
      // biome-ignore lint/suspicious/noConsoleLog: Script output
      console.log(`User: ${user.email} (${user.name})`);
    } else {
      // biome-ignore lint/suspicious/noConsoleLog: Script output
      console.log(`⚠️ User ${email} not found. Creating new admin user...`);
      const _user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: 'ADMIN',
          name: 'System Admin',
          phone: '+910000000000', // Dummy phone for admin
          isActive: true,
        },
      });
      // biome-ignore lint/suspicious/noConsoleLog: Script output
      console.log('✅ Admin user created successfully!');
    }

    // biome-ignore lint/suspicious/noConsoleLog: Script output
    console.log(`Password set to: ${password}`);
  } catch (error) {
    console.error('Error updating password:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
