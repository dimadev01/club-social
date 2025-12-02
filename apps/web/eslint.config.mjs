import config from '@club-social/eslint-config';
import pluginQuery from '@tanstack/eslint-plugin-query';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  config,
  globalIgnores(['dist']),
  pluginQuery.configs['flat/recommended'],
  {
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
