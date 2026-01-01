import type { MovementStatisticsDto } from '@club-social/shared/movements';
import type { DateRangeDto } from '@club-social/shared/types';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMovementStatistics(query: DateRangeDto) {
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
