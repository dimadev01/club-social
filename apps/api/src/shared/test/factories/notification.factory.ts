import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';

import type {
  CreateNotificationProps,
  NotificationProps,
} from '@/notifications/domain/entities/notification.entity';

import { NotificationEntity } from '@/notifications/domain/entities/notification.entity';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  TEST_CREATED_BY,
  TEST_NOTIFICATION_PAYLOAD,
  TEST_NOTIFICATION_RECIPIENT,
  TEST_NOTIFICATION_SOURCE_ENTITY,
} from '../constants';

export const createNotificationProps = (
  overrides?: Partial<CreateNotificationProps>,
): CreateNotificationProps => ({
  channel: NotificationChannel.EMAIL,
  payload: { ...TEST_NOTIFICATION_PAYLOAD },
  recipientAddress: TEST_NOTIFICATION_RECIPIENT,
  sourceEntity: TEST_NOTIFICATION_SOURCE_ENTITY,
  sourceEntityId: UniqueId.generate(),
  type: NotificationType.DUE_CREATED,
  userId: UniqueId.generate(),
  ...overrides,
});

export const createTestNotification = (
  overrides?: Partial<CreateNotificationProps>,
): NotificationEntity =>
  NotificationEntity.create(
    createNotificationProps(overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();

const createPersistedNotificationProps = (
  overrides?: Partial<NotificationProps>,
): NotificationProps => ({
  attempts: 0,
  channel: NotificationChannel.EMAIL,
  deliveredAt: null,
  lastError: null,
  maxAttempts: 3,
  payload: { ...TEST_NOTIFICATION_PAYLOAD },
  processedAt: null,
  providerMessageId: null,
  queuedAt: null,
  recipientAddress: TEST_NOTIFICATION_RECIPIENT,
  scheduledAt: null,
  sentAt: null,
  sourceEntity: TEST_NOTIFICATION_SOURCE_ENTITY,
  sourceEntityId: UniqueId.generate(),
  status: NotificationStatus.PENDING,
  type: NotificationType.DUE_CREATED,
  userId: UniqueId.generate(),
  ...overrides,
});

export const createTestNotificationFromPersistence = (
  propsOverrides?: Partial<NotificationProps>,
  metaOverrides?: Partial<PersistenceMeta>,
): NotificationEntity =>
  NotificationEntity.fromPersistence(
    createPersistedNotificationProps(propsOverrides),
    {
      audit: { createdBy: TEST_CREATED_BY },
      id: UniqueId.generate(),
      ...metaOverrides,
    },
  );
