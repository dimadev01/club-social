import type { UserPreferencesDto } from '@club-social/shared/users';

import { useQuery } from '@/shared/hooks/useQuery';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMyPreferences() {
  const { data: session } = betterAuthClient.useSession();

  return useQuery({
    ...queryKeys.users.me,
    enabled: !!session,
    queryFn: () => $fetch<UserPreferencesDto>('users/me/preferences'),
  });
}
