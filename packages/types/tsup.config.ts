import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['./src/users.ts', './src/shared/index.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
});
