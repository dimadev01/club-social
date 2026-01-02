import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

export default defineConfig({
  schema: {
    VITE_API_URL: Schema.string(),
  },
  validator: 'builtin',
});
