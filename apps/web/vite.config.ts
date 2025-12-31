import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ValidateEnv()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
