import type { UserNotificationPreferencesDto } from '@club-social/shared/users';

import {
  type NotificationPreferenceKey,
  NotificationTypeLabel,
  NotificationTypesByRole,
  NotificationTypeToPreferenceKey,
} from '@club-social/shared/notifications';
import { UserRole } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { Empty, Switch } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { queryKeys } from '@/shared/lib/query-keys';
import { Card, Descriptions } from '@/ui';
import { useMyNotificationPreferences } from '@/users/useMyNotificationPreferences';
import { useUpdateMyNotificationPreferences } from '@/users/useUpdateMyNotificationPreferences';

export function NotificationsTab() {
  const user = useSessionUser();
  const queryClient = useQueryClient();
  const { data: notificationPreferences, isLoading } =
    useMyNotificationPreferences();
  const updateNotificationPreferences = useUpdateMyNotificationPreferences();

  const notificationTypes = NotificationTypesByRole[user.role as UserRole];

  const handlePreferenceChange = (
    key: NotificationPreferenceKey,
    checked: boolean,
  ) => {
    queryClient.setQueryData(
      queryKeys.users.meNotificationPreferences.queryKey,
      (old: UserNotificationPreferencesDto) => ({
        ...old,
        [key]: checked,
      }),
    );

    updateNotificationPreferences.mutate({ [key]: checked });
  };

  if (notificationTypes.length === 0) {
    return (
      <Card title="Preferencias de notificación">
        <Empty description="No hay preferencias de notificación disponibles para tu rol" />
      </Card>
    );
  }

  return (
    <Card loading={isLoading} title="Preferencias de notificación">
      <Descriptions styles={{ label: { width: 250 } }}>
        {notificationTypes.map((type) => {
          const preferenceKey = NotificationTypeToPreferenceKey[type];

          return (
            <Descriptions.Item
              key={type}
              label={`Notificar ${NotificationTypeLabel[type].toLowerCase()}`}
            >
              <Switch
                checked={notificationPreferences?.[preferenceKey]}
                onChange={(checked) =>
                  handlePreferenceChange(preferenceKey, checked)
                }
              />
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Card>
  );
}
