import type { MemberDto } from '@club-social/shared/members';

import { $fetch } from '@/shared/lib/fetch';
import { useQuery } from '@/shared/lib/useQuery';
import { usePermissions } from '@/users/use-permissions';

export function useMembers() {
  const permissions = usePermissions();

  return useQuery<MemberDto[]>({
    enabled: permissions.members.list,
    queryFn: () => $fetch('members'),
    queryKey: ['members'],
  });
}
