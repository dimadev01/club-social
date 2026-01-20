import type { UserNotificationPreferencesDto } from '@club-social/shared/users';

import {
  MemberNotificationTypes,
  type NotificationPreferenceKey,
  NotificationTypeLabel,
  NotificationTypeToPreferenceKey,
  SubscriberNotificationTypes,
} from '@club-social/shared/notifications';
import { UserRole } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from 'antd';

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

  const notificationTypes =
    user.role === UserRole.MEMBER
      ? MemberNotificationTypes
      : SubscriberNotificationTypes;

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
