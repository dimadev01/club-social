import type { MemberSearchResultDto } from '@club-social/shared/members';

import { useQueries } from '@tanstack/react-query';

import { usePermissions } from '@/users/use-permissions';

import { getMemberByIdQueryOptions } from './useMemberById';

interface UseMembersForSelectOptions {
  enabled?: boolean;
  memberIds: string[];
}

export function useMembersForSelect({
  enabled = true,
  memberIds,
}: UseMembersForSelectOptions) {
  const permissions = usePermissions();

  const queries = useQueries({
    combine: (results) => {
      const data: MemberSearchResultDto[] = [];

      for (const result of results) {
        if (result.data) {
          data.push({
            id: result.data.id,
            name: result.data.name,
            status: result.data.status,
          });
        }
      }

      return {
        data,
        isFetching: results.some((result) => result.isFetching),
        isLoading: results.some((result) => result.isLoading),
      };
    },
    queries: memberIds.map((memberId) => ({
      ...getMemberByIdQueryOptions(memberId),
      enabled: enabled && permissions.members.get && !!memberId,
    })),
  });

  return queries;
}
