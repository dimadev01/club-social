import type { MemberDto } from '@club-social/shared/members';

import { useQueryClient } from '@tanstack/react-query';
import { Switch } from 'antd';

import { useMyMember } from '@/members/useMyMember';
import { useUpdateMyNotificationPreferences } from '@/members/useUpdateMyNotificationPreferences';
import { queryKeys } from '@/shared/lib/query-keys';
import { Card, Descriptions } from '@/ui';

export function NotificationsTab() {
  const queryClient = useQueryClient();
  const { data: member, isLoading } = useMyMember();
  const updateNotificationPreferences = useUpdateMyNotificationPreferences();

  const handlePreferenceChange = (
    key: 'notifyOnDueCreated' | 'notifyOnPaymentMade',
    checked: boolean,
  ) => {
    queryClient.setQueryData(
      queryKeys.members.me.queryKey,
      (old: MemberDto) => ({
        ...old,
        notificationPreferences: {
          ...old.notificationPreferences,
          [key]: checked,
        },
      }),
    );

    updateNotificationPreferences.mutate({
      [key]: checked,
    });
  };

  return (
    <Card loading={isLoading} title="Preferencias de notificación">
      <Descriptions styles={{ label: { width: 250 } }}>
        <Descriptions.Item label="Notificar nueva cuota">
          <Switch
            checked={
              member?.notificationPreferences.notifyOnDueCreated ?? false
            }
            onChange={(checked) =>
              handlePreferenceChange('notifyOnDueCreated', checked)
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="Notificar pago realizado">
          <Switch
            checked={
              member?.notificationPreferences.notifyOnPaymentMade ?? false
            }
            onChange={(checked) =>
              handlePreferenceChange('notifyOnPaymentMade', checked)
            }
          />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
