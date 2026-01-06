import type { UserPreferencesDto } from '@club-social/shared/users';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMyPreferences() {
  return useQuery({
    ...queryKeys.users.me,
    queryFn: () => $fetch<UserPreferencesDto>('users/me/preferences'),
  });
}
