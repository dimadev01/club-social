/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  endOfLine: "auto",
  plugins: ["prettier-plugin-packagejson"],
};

export default config;
