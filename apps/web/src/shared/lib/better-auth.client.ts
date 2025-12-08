import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL is not set');
}

export const betterAuthClient = createAuthClient({
  baseURL,
  plugins: [magicLinkClient()],
});
