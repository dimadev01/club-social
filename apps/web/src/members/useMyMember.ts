import type { MemberDto } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMyMember() {
  return useQuery({
    ...queryKeys.members.me,
    queryFn: () => $fetch<MemberDto>('members/me'),
  });
}
