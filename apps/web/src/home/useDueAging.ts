import type { DueAgingDto } from '@club-social/shared/dues';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useDueAging() {
  return useQuery({
    ...queryKeys.dues.aging,
    queryFn: () => $fetch<DueAgingDto>('dues/aging'),
  });
}
