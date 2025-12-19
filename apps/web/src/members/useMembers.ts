import type { IMemberPaginatedDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { usePermissions } from '@/users/use-permissions';

export function useMembers() {
  const permissions = usePermissions();

  return useQuery<IMemberPaginatedDto[]>({
    enabled: permissions.members.list,
    queryFn: () => $fetch('members'),
    queryKey: ['members'],
  });
}
