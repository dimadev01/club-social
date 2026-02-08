import { createFetch } from '@better-fetch/fetch';

import { appConfig } from '@/app/app.config';

export const $fetch = createFetch({
  baseURL: appConfig.apiUrl,
  credentials: 'include',
  throw: true,
});
