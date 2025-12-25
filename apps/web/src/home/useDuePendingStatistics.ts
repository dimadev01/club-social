import type { IDuePendingStatisticsDto } from '@club-social/shared/dues';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useDuePendingStatistics() {
  return useQuery({
    ...queryKeys.dues.pendingStatistics(),
    queryFn: () => $fetch<IDuePendingStatisticsDto>('dues/pending-statistics'),
  });
}
