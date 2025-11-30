import config from '@club-social/eslint-config/nest';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import { importX } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default defineConfig(
  config,
  {
    ignores: ['src/infrastructure/supabase/supabase.types.ts'],
  },
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
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

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import-x/resolver-next': createTypeScriptImportResolver({
        alwaysTryTypes: true,
        project: './tsconfig.json',
      }),
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

      '@typescript-eslint/explicit-member-accessibility': 'error',
    },
  },
);
