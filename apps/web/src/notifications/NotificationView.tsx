import { DateFormat } from '@club-social/shared/lib';
import {
  NotificationChannelLabel,
  NotificationStatusLabel,
  NotificationTypeLabel,
} from '@club-social/shared/notifications';
import { Col } from 'antd';
import { useParams } from 'react-router';

import { Card, Descriptions, DescriptionsAudit, NotFound, Row } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { useNotification } from './useNotification';

export function NotificationView() {
  const permissions = usePermissions();
  const { id } = useParams();

  const { data: notification, isLoading } = useNotification(id);

  if (isLoading) {
    return <Card loading />;
  }

  if (!notification || !permissions.notifications.get) {
    return <NotFound />;
  }

  return (
    <Card backButton title="Detalle de notificación">
      <Row>
        <Col md={12} xs={24}>
          <Descriptions
            items={[
              {
                children: NotificationTypeLabel[notification.type],
                label: 'Tipo',
              },
              {
                children: NotificationChannelLabel[notification.channel],
                label: 'Canal',
              },
              {
                children: notification.recipientAddress,
                label: 'Destinatario',
              },
              {
                children: notification.memberName,
                label: 'Socio',
              },
              {
                children: NotificationStatusLabel[notification.status],
                label: 'Estado',
              },
              {
                children: `${notification.attempts} / ${notification.maxAttempts}`,
                label: 'Intentos',
              },
              {
                children: notification.scheduledAt
                  ? DateFormat.dateTime(notification.scheduledAt)
                  : '-',
                label: 'Programado para',
              },
              {
                children: notification.queuedAt
                  ? DateFormat.dateTime(notification.queuedAt)
                  : '-',
                label: 'En cola',
              },
              {
                children: notification.processedAt
                  ? DateFormat.dateTime(notification.processedAt)
                  : '-',
                label: 'Procesado',
              },
              {
                children: notification.sentAt
                  ? DateFormat.dateTime(notification.sentAt)
                  : '-',
                label: 'Enviado',
              },
              {
                children: notification.deliveredAt
                  ? DateFormat.dateTime(notification.deliveredAt)
                  : '-',
                label: 'Entregado',
              },
              {
                children: notification.providerMessageId ?? '-',
                label: 'ID proveedor',
              },
              {
                children: notification.lastError ?? '-',
                label: 'Último error',
              },
              {
                children: notification.sourceEntity ?? '-',
                label: 'Entidad origen',
              },
              {
                children: notification.sourceEntityId ?? '-',
                label: 'ID entidad origen',
              },
            ]}
            styles={{
              label: {
                width: 200,
              },
            }}
          />
        </Col>
        <Col md={12} xs={24}>
          <DescriptionsAudit {...notification} />
        </Col>
      </Row>
    </Card>
  );
}
