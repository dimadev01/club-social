import type { MemberDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function getMemberByIdQueryOptions(memberId: string) {
  return {
    ...queryKeys.members.detail(memberId),
    queryFn: () => $fetch<MemberDto>(`/members/${memberId}`),
  };
}

export function useMemberById(memberId?: string, enabled = true) {
  const permissions = usePermissions();

  return useQuery<MemberDto | null>({
    ...getMemberByIdQueryOptions(memberId ?? ''),
    enabled: enabled && permissions.members.get && !!memberId,
  });
}
