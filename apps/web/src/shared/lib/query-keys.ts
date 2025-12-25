import type { DueCategory } from '@club-social/shared/dues';
import type { MemberCategory } from '@club-social/shared/members';

import { createQueryKeyStore } from '@lukemorales/query-key-factory';

import type { UsePaymentStatisticsQuery } from '@/home/usePaymentStatistics';
import type { TableQuery } from '@/ui/Table/useTable';

export interface UseMovementStatisticsQuery {
  dateRange?: [string, string];
}

export const queryKeys = createQueryKeyStore({
  dues: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
    payments: (id?: string) => [id],
    pending: (memberId?: string) => [memberId],
    pendingStatistics: () => [undefined],
  },

  members: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
    search: (query?: string) => [query],
  },

  movements: {
    balance: () => [undefined],
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
    statistics: (query?: UseMovementStatisticsQuery) => [query],
  },

  passkeys: {
    list: null,
  },

  payments: {
    detail: (id?: string) => [id],
    dues: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
    statistics: (query?: UsePaymentStatisticsQuery) => [query],
  },

  pricing: {
    active: (dueCategory?: DueCategory, memberCategory?: MemberCategory) => [
      dueCategory,
      memberCategory,
    ],
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },

  users: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },
});
