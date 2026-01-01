import baseConfig from '@club-social/prettier-config';

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/index.css',
};

export default config;
