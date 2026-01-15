import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),

  migrate: {
    async resolveAdapterUrl() {
      // Load env vars for migrations (CLI context)
      const dotenv = await import('dotenv');
      dotenv.config({ path: path.join(__dirname, '..', '.env') });

      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('DATABASE_URL is not defined');
      }
      return url;
    },
  },
});
