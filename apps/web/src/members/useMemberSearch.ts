import type { MemberSearchResultDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { usePermissions } from '@/users/use-permissions';

const DEFAULT_LIMIT = 20;

interface UseMemberSearchOptions {
  enabled?: boolean;
  limit?: number;
  searchTerm: string;
}

export function useMemberSearch({
  enabled = true,
  limit = DEFAULT_LIMIT,
  searchTerm,
}: UseMemberSearchOptions) {
  const permissions = usePermissions();

  const query = useQuery<MemberSearchResultDto[]>({
    enabled: enabled && permissions.members.list && searchTerm.length >= 2,
    queryFn: () =>
      $fetch<MemberSearchResultDto[]>('/members/search', {
        query: { limit: limit + 1, q: searchTerm },
      }),
    queryKey: ['members', 'search', searchTerm, limit],
    staleTime: 30_000,
  });

  const hasMore = (query.data?.length ?? 0) > limit;
  const data = hasMore ? query.data?.slice(0, limit) : query.data;

  return {
    ...query,
    data,
    hasMore,
  };
}
