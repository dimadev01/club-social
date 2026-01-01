import type { PaymentDailyStatisticsDto } from '@club-social/shared/payments';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export interface UsePaymentDailyStatisticsQuery {
  month: string; // YYYY-MM format
}

export function usePaymentDailyStatistics(
  query: UsePaymentDailyStatisticsQuery,
) {
  return useQuery({
    ...queryKeys.payments.dailyStatistics(query),
    queryFn: () =>
      $fetch<PaymentDailyStatisticsDto>('payments/statistics/daily', {
        query: {
          month: query.month,
        },
      }),
  });
}
