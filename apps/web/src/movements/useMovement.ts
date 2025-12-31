import type { MovementDto } from '@club-social/shared/movements';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function useMovement(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.movements.detail(id),
    enabled: !!id && permissions.movements.get,
    queryFn: () => $fetch<MovementDto>(`movements/${id}`),
  });
}
