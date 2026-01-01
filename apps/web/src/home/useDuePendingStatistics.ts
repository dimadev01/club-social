import type { DuePendingStatisticsDto } from '@club-social/shared/dues';
import type { DateRangeDto } from '@club-social/shared/types';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useDuePendingStatistics(query: DateRangeDto) {
  return useQuery({
    ...queryKeys.dues.pendingStatistics(query),
    queryFn: () =>
      $fetch<DuePendingStatisticsDto>('dues/pending-statistics', {
        query: {
          dateRange: query.dateRange,
        },
      }),
  });
}
