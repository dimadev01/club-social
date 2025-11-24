import config from '@club-social/eslint-config/nest';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig(
  config,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: 'module',
    },
  },
  {
    rules: {
      /**
       * We disable this rule because the Modules in NestJS use
       * this pattern of empty classes
       */
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
