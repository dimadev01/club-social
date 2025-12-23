import { createQueryKeyStore } from '@lukemorales/query-key-factory';

import type { TableQuery } from '@/ui/Table/useTable';

export const queryKeys = createQueryKeyStore({
  dues: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
    payments: (id?: string) => [id],
    pending: (memberId?: string) => [memberId],
  },

  members: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },

  movements: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },

  payments: {
    detail: (id?: string) => [id],
    dues: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },

  users: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },
});
