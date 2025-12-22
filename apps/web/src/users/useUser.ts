import type { IUserDetailDto } from '@club-social/shared/users';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

import { usePermissions } from './use-permissions';

export function useUser(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.users.detail(id),
    enabled: !!id && permissions.users.get,
    queryFn: () => $fetch<IUserDetailDto>(`users/${id}`),
  });
}
