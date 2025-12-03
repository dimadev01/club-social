import config from '@club-social/eslint-config/nest';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig(
  config,
  {
    ignores: ['**/*supabase.types.ts'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'error',
      /**
       * We disable this rule because the Modules in NestJS use
       * this pattern of empty classes
       */
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
