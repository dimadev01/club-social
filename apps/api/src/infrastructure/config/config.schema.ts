import { z } from 'zod';

export const configSchema = z.object({
  BETTER_STACK_ENDPOINT: z.url(),
  BETTER_STACK_SOURCE_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  ENVIRONMENT: z.enum(['local', 'development', 'production']),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
  TRUSTED_ORIGINS: z.string().transform((value) => value.split(',')),
});

export type ConfigTypes = z.infer<typeof configSchema>;
