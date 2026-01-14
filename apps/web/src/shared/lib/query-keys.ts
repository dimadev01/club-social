import type { DueCategory } from '@club-social/shared/dues';
import type { MemberCategory } from '@club-social/shared/members';
import type { DateRangeDto } from '@club-social/shared/types';

import { createQueryKeyStore } from '@lukemorales/query-key-factory';

import type { UsePaymentDailyStatisticsQuery } from '@/home/usePaymentDailyStatistics';
import type { UsePaymentStatisticsQuery } from '@/home/usePaymentStatistics';
import type { TableQuery } from '@/ui';

export const queryKeys = createQueryKeyStore({
  appSettings: {
    all: null,
    byKey: (key: string) => [key],
    maintenanceMode: null,
  },

  dues: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
    payments: (id?: string) => [id],
    pending: (memberId?: string) => [memberId],
    pendingStatistics: (query?: DateRangeDto) => [query],
  },

  groups: {
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
  },

  memberLedger: {
    balance: (memberId?: string) => [memberId],
    detail: (id?: string) => [id],
    paginated: (query?: TableQuery) => [query],
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
    statistics: (query?: DateRangeDto) => [query],
  },

  passkeys: {
    list: null,
  },

  payments: {
    dailyStatistics: (query?: UsePaymentDailyStatisticsQuery) => [query],
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
    membershipForMember: (memberId?: string) => [memberId],
    paginated: (query?: TableQuery) => [query],
  },

  users: {
    detail: (id?: string) => [id],
    me: null,
    paginated: (query?: TableQuery) => [query],
  },
});
