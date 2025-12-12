import { z } from 'zod';

export const configSchema = z.object({
  BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .transform((value) => value.split(',')),
  BETTER_STACK_ENDPOINT: z.url(),
  BETTER_STACK_SOURCE_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  EMAIL_SMTP_HOST: z.string(),
  EMAIL_SMTP_PORT: z.string().transform(Number),
  ENVIRONMENT: z.enum(['local', 'development', 'production']),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  RESEND_API_KEY: z.string(),
});

export type ConfigTypes = z.infer<typeof configSchema>;
