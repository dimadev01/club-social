import type { IPaymentStatisticsDto } from '@club-social/shared/payments';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export interface UsePaymentStatisticsQuery {
  dateRange?: [string, string];
}

export function usePaymentStatistics(query: UsePaymentStatisticsQuery) {
  return useQuery({
    ...queryKeys.payments.statistics(query),
    queryFn: () =>
      $fetch<IPaymentStatisticsDto>('payments/statistics', {
        query: {
          dateRange: query.dateRange,
        },
      }),
  });
}
