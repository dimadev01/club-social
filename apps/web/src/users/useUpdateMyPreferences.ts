import type { UpdateUserPreferencesDto } from '@club-social/shared/users';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';

export function useUpdateMyPreferences() {
  return useMutation({
    mutationFn: (request: Partial<UpdateUserPreferencesDto>) =>
      $fetch('users/me/preferences', { body: request, method: 'PATCH' }),
  });
}
