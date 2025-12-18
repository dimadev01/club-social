import type { MemberDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { usePermissions } from '@/users/use-permissions';

interface UseMemberByIdOptions {
  enabled?: boolean;
  memberId: string | undefined;
}

export function useMemberById({
  enabled = true,
  memberId,
}: UseMemberByIdOptions) {
  const permissions = usePermissions();

  return useQuery<MemberDto>({
    enabled: enabled && permissions.members.get && !!memberId,
    queryFn: () => $fetch<MemberDto>(`/members/${memberId}`),
    queryKey: ['members', memberId],
  });
}
