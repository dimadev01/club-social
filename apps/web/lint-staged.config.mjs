/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{json,md,yml,yaml}': ['prettier --write'],
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
};
