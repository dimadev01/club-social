import type { IMemberDetailDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { usePermissions } from '@/users/use-permissions';

interface UseMemberByIdOptions {
  enabled?: boolean;
  memberId: string | undefined;
}

export function getMemberByIdQueryOptions(memberId: string) {
  return {
    queryFn: () => $fetch<IMemberDetailDto>(`/members/${memberId}`),
    queryKey: ['members', memberId] as const,
  };
}

export function useMemberById({
  enabled = true,
  memberId,
}: UseMemberByIdOptions) {
  const permissions = usePermissions();

  return useQuery<IMemberDetailDto | null>({
    ...getMemberByIdQueryOptions(memberId ?? ''),
    enabled: enabled && permissions.members.get && !!memberId,
  });
}
