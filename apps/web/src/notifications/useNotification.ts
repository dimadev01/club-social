import type { NotificationDto } from '@club-social/shared/notifications';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import { usePermissions } from '@/users/use-permissions';

export function useNotification(id?: string) {
  const permissions = usePermissions();

  return useQuery({
    ...queryKeys.notifications.detail(id),
    enabled: !!id && permissions.notifications.get,
    queryFn: () => $fetch<NotificationDto>(`notifications/${id}`),
  });
}
