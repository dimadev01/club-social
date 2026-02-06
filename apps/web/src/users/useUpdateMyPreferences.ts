import type {
  UpdateUserPreferencesDto,
  UserPreferencesDto,
} from '@club-social/shared/users';

import { usePostHog } from '@posthog/react';
import { useQueryClient } from '@tanstack/react-query';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUpdateMyPreferences() {
  const posthog = usePostHog();
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
    onSuccess: () => {
      posthog.capture(PostHogEvent.USER_PREFERENCES_UPDATED);
    },
  });
}
