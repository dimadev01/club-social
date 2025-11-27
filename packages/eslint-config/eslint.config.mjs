import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { importX } from 'eslint-plugin-import-x';

export default defineConfig(
  {
    ignores: ['*.mjs'],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  perfectionist.configs['recommended-natural'],
  stylistic.configs.customize({
    semi: true,
  }),
  eslintConfigPrettier,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
      ],

      // TS/ES best practices
      // Import sorting
      // 'perfectionist/sort-imports': [
      //   'error',
      //   {
      //     groups: [
      //       'type',
      //       ['builtin', 'external'],
      //       'internal-type',
      //       'internal',
      //       'alias',
      //       ['parent-type', 'sibling-type', 'index-type'],
      //       ['parent', 'sibling', 'index'],
      //       'object',
      //       'unknown',
      //     ],
      //     customGroups: {
      //       value: {
      //         alias: [
      //           '^@/application/',
      //           '^@/domain/',
      //           '^@/infrastructure/',
      //           '^@/presentation/',
      //           '^@/shared/',
      //           '^@/features/',
      //           '^@/lib/',
      //           '^@/hooks/',
      //           '^@/components/',
      //           '^@/pages/',
      //           '^@/utils/',
      //           '^@/types/',
      //           '^@/styles/',
      //           '^@/assets/',
      //           '^@/constants/',
      //           '^@/',
      //         ],
      //       },
      //     },
      //   },
      // ],
    },
  },
);
