import type {
  UpdateUserPreferencesDto,
  UserPreferencesDto,
} from '@club-social/shared/users';

import { useQueryClient } from '@tanstack/react-query';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUpdateMyPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<UpdateUserPreferencesDto>) => {
      queryClient.setQueryData(
        queryKeys.users.me.queryKey,
        (old: UserPreferencesDto) => {
          return { ...old, ...request };
        },
      );

      return $fetch('users/me/preferences', { body: request, method: 'PATCH' });
    },
  });
}
