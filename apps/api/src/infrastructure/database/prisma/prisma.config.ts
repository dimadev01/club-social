import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'migrations',
    seed: 'tsx src/infrastructure/database/prisma/prisma.seed.ts',
  },
  schema: 'schema.prisma',
});
