import type { MemberSearchResultDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { usePermissions } from '@/users/use-permissions';

interface UseMemberSearchOptions {
  enabled?: boolean;
  searchTerm: string;
}

export function useMemberSearch({
  enabled = true,
  searchTerm,
}: UseMemberSearchOptions) {
  const permissions = usePermissions();

  return useQuery<MemberSearchResultDto[]>({
    enabled: enabled && permissions.members.list && searchTerm.length >= 2,
    queryFn: () =>
      $fetch<MemberSearchResultDto[]>('/members/search', {
        query: { limit: 20, q: searchTerm },
      }),
    queryKey: ['members', 'search', searchTerm],
    staleTime: 30_000,
  });
}
