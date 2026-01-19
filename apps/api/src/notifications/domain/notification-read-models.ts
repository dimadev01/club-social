import type {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';

export type NotificationPaginatedReadModel = Pick<
  NotificationReadModel,
  | 'channel'
  | 'createdAt'
  | 'id'
  | 'recipientAddress'
  | 'status'
  | 'type'
  | 'userName'
>;

export interface NotificationReadModel {
  attempts: number;
  channel: NotificationChannel;
  createdAt: Date;
  createdBy: string;
  deliveredAt: Date | null;
  id: string;
  lastError: null | string;
  maxAttempts: number;
  payload: Record<string, unknown>;
  processedAt: Date | null;
  providerMessageId: null | string;
  queuedAt: Date | null;
  recipientAddress: string;
  scheduledAt: Date | null;
  sentAt: Date | null;
  sourceEntity: null | string;
  sourceEntityId: null | string;
  status: NotificationStatus;
  type: NotificationType;
  updatedAt: Date;
  updatedBy: null | string;
  userId: string;
  userName: string;
}
