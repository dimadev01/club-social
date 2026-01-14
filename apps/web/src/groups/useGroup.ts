import type { GroupDto } from '@club-social/shared/groups';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function useGroup(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.groups.detail(id),
    enabled: !!id && permissions.groups.get,
    queryFn: () => $fetch<GroupDto>(`groups/${id}`),
  });
}
