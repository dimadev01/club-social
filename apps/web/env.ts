import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

export default defineConfig({
  schema: {
    VITE_API_URL: Schema.string(),
    VITE_ENVIRONMENT: Schema.enum([
      'local',
      'development',
      'production',
    ] as const),
    VITE_PUBLIC_POSTHOG_HOST: Schema.string.optional(),
    VITE_PUBLIC_POSTHOG_KEY: Schema.string.optional(),
  },
  validator: 'builtin',
});
