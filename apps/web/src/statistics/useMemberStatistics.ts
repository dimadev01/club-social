import type { MemberStatisticsDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export interface UseMemberStatisticsQuery {
  limit?: number;
}

export function useMemberStatistics(query: UseMemberStatisticsQuery = {}) {
  return useQuery({
    ...queryKeys.members.statistics(query.limit),
    queryFn: () =>
      $fetch<MemberStatisticsDto>('members/statistics', {
        query: {
          limit: query.limit,
        },
      }),
  });
}
