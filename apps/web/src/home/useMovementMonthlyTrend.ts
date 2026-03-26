import type { MovementMonthlyTrendDto } from '@club-social/shared/movements';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMovementMonthlyTrend(query?: { months?: number }) {
  return useQuery({
    ...queryKeys.movements.monthlyTrend(query),
    queryFn: () =>
      $fetch<MovementMonthlyTrendDto>('movements/statistics/monthly-trend', {
        query,
      }),
  });
}
