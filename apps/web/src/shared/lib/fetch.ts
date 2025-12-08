import { createFetch } from '@better-fetch/fetch';

export const $fetch = createFetch({
  baseURL: 'http://localhost:3000',
  credentials: 'include',
  throw: true,
});
