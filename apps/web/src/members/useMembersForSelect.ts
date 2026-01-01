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
    combine: (results) => ({
      data: results
        .filter((result) => !!result.data)
        .map((result) => result.data),
      isFetching: results.some((result) => result.isFetching),
      isLoading: results.some((result) => result.isLoading),
    }),
    queries: memberIds.map((memberId) => ({
      ...getMemberByIdQueryOptions(memberId),
      enabled: enabled && permissions.members.get && !!memberId,
    })),
  });

  return queries;
}
