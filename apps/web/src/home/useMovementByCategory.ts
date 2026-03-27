import type {
  MovementByCategoryDto,
  MovementType,
} from '@club-social/shared/movements';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export interface UseMovementByCategoryQuery {
  dateRange?: [string, string];
  type?: MovementType;
}

export function useMovementByCategory(query?: UseMovementByCategoryQuery) {
  return useQuery({
    ...queryKeys.movements.byCategory(query),
    queryFn: () =>
      $fetch<MovementByCategoryDto>('movements/statistics/by-category', {
        query,
      }),
  });
}
