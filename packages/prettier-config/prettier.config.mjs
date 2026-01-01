/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: 'auto',
  plugins: ['prettier-plugin-packagejson'],
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};

export default config;
