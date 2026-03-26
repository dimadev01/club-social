import type { DueCollectionRateDto } from '@club-social/shared/dues';
import type { DateRangeDto } from '@club-social/shared/types';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useDueCollectionRate(query?: DateRangeDto) {
  return useQuery({
    ...queryKeys.dues.collectionRate(query),
    queryFn: () =>
      $fetch<DueCollectionRateDto>('dues/collection-rate', { query }),
  });
}
