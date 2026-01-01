/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest';

const tsJestPresetConfig = createDefaultPreset();

const config: JestConfigWithTsJest = {
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@club-social/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
    // eslint-disable-next-line perfectionist/sort-objects
    '^@/test/(.*)$': '<rootDir>/test/$1',
    // eslint-disable-next-line perfectionist/sort-objects
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  ...tsJestPresetConfig,
};

export default config;
