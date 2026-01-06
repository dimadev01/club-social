import type { UpdateUserPreferencesDto } from '@club-social/shared/users';

import { useQueryClient } from '@tanstack/react-query';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUpdateMyPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<UpdateUserPreferencesDto>) =>
      $fetch('users/me/preferences', { body: request, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.me);
    },
  });
}
