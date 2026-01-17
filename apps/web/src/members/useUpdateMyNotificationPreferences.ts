import type { UpdateMemberNotificationPreferencesDto } from '@club-social/shared/members';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';

export function useUpdateMyNotificationPreferences() {
  return useMutation({
    mutationFn: (request: UpdateMemberNotificationPreferencesDto) =>
      $fetch('members/me/notification-preferences', {
        body: request,
        method: 'PATCH',
      }),
  });
}
