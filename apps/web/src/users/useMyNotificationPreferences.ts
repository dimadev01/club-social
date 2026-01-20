import type { UserNotificationPreferencesDto } from '@club-social/shared/users';

import { useQuery } from '@/shared/hooks/useQuery';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMyNotificationPreferences() {
  const { data: session } = betterAuthClient.useSession();

  return useQuery({
    ...queryKeys.users.meNotificationPreferences,
    enabled: !!session,
    queryFn: () =>
      $fetch<UserNotificationPreferencesDto>(
        'users/me/notification-preferences',
      ),
  });
}
