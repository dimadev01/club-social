import { adminClient, magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { AppConfig } from './app.config';

export const betterAuthClient = createAuthClient({
  basePath: '/auth',
  baseURL: AppConfig.apiUrl,
  plugins: [magicLinkClient(), adminClient()],
});
