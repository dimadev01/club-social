import config from '@club-social/eslint-config/nest';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
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
