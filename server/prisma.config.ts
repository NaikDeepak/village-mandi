import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Use production seed (minimal: admin + hub) vs development seed (comprehensive test data)
const isProduction = process.env.NODE_ENV === 'production';
const seedCommand = isProduction ? 'ts-node scripts/seed.ts' : 'ts-node prisma/seed.ts';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
    seed: seedCommand,
  },

  datasource: {
    url: env('DATABASE_URL'),
  },
});
