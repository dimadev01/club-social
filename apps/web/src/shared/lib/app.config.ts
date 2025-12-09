import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.url(),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(JSON.stringify(z.treeifyError(parsed.error)));
  throw new Error('Invalid environment variables');
}

export const AppConfig = {
  apiUrl: parsed.data.VITE_API_URL,
} as const;
