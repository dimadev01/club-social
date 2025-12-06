import { createFetch } from '@better-fetch/fetch';

import { supabase } from './supabase';

export const $fetch = createFetch({
  auth: {
    token: supabase.auth
      .getSession()
      .then(({ data }) => data.session?.access_token),
    type: 'Bearer',
  },
  baseURL: 'http://localhost:3000',
  throw: true,
});
