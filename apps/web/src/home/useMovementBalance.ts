import type { MovementBalanceDto } from '@club-social/shared/movements';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMovementBalance() {
  return useQuery({
    ...queryKeys.movements.balance(),
    queryFn: () => $fetch<MovementBalanceDto>('movements/balance'),
  });
}
