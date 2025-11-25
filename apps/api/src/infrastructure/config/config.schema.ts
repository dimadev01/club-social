import { z } from 'zod';

export const configSchema = z.object({
  // BETTER_STACK_ENDPOINT: z.string(),
  // BETTER_STACK_SOURCE_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  ENVIRONMENT: z.enum(['local', 'development', 'production']),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
});

export type ConfigTypes = z.infer<typeof configSchema>;
