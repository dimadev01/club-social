import type { IDueDetailDto } from '@club-social/shared/dues';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function useDue(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.dues.detail(id),
    enabled: !!id && permissions.dues.get,
    queryFn: () => $fetch<IDueDetailDto>(`dues/${id}`),
  });
}
