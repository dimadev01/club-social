import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

export default defineConfig({
  schema: {
    VITE_APP_API_URL: Schema.string(),
    VITE_APP_DISPLAY_NAME: Schema.string(),
  },
  validator: 'builtin',
});
