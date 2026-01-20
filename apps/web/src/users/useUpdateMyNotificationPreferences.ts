import type {
  UpdateUserNotificationPreferencesDto,
  UserNotificationPreferencesDto,
} from '@club-social/shared/users';

import { useQueryClient } from '@tanstack/react-query';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUpdateMyNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateUserNotificationPreferencesDto) => {
      queryClient.setQueryData(
        queryKeys.users.meNotificationPreferences.queryKey,
        (old: UserNotificationPreferencesDto) => {
          return { ...old, ...request };
        },
      );

      return $fetch('users/me/notification-preferences', {
        body: request,
        method: 'PATCH',
      });
    },
  });
}
