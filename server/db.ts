import * as fs from 'fs';
import * as path from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

// Explicitly load .env during development if not already loaded
// (Useful when running scripts directly via ts-node)
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// 1. Init Postgres Pool
const pool = new Pool({ connectionString });

// 2. Init Prisma Adapter
// @ts-ignore - Prisma 7 adapter types might need adjustment or are experimental
const adapter = new PrismaPg(pool);

// 3. Init Prisma Client
export const prisma = new PrismaClient({
  // @ts-ignore
  adapter,
});
