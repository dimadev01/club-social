import { createFetch } from '@better-fetch/fetch';

export const $fetch = createFetch({
  baseURL: import.meta.env.VITE_APP_API_URL,
  credentials: 'include',
  throw: true,
});
