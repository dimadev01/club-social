import type { DueAgingDto } from '@club-social/shared/dues';
import type { DateRangeDto } from '@club-social/shared/types';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useDueAging(query: DateRangeDto) {
  return useQuery({
    ...queryKeys.dues.aging(query),
    queryFn: () =>
      $fetch<DueAgingDto>('dues/aging', {
        query: {
          dateRange: query.dateRange,
        },
      }),
  });
}
