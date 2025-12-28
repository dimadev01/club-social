import type { DueDto } from '@club-social/shared/dues';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function getDueQueryOptions(id?: string) {
  return {
    ...queryKeys.dues.detail(id),
    queryFn: () => $fetch<DueDto>(`dues/${id}`),
  };
}

export function useDue(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...getDueQueryOptions(id),
    enabled: !!id && permissions.dues.get,
  });
}
