import type { MovementStatisticsDto } from '@club-social/shared/movements';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import {
  queryKeys,
  type UseMovementStatisticsQuery,
} from '@/shared/lib/query-keys';

export function useMovementStatistics(query: UseMovementStatisticsQuery) {
  return useQuery({
    ...queryKeys.movements.statistics(query),
    queryFn: () =>
      $fetch<MovementStatisticsDto>('movements/statistics', {
        query: {
          dateRange: query.dateRange,
        },
      }),
  });
}
