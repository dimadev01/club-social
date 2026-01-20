import type {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from './notification.enum';

export interface NotificationDto {
  attempts: number;
  channel: NotificationChannel;
  createdAt: string;
  createdBy: string;
  deliveredAt: null | string;
  id: string;
  lastError: null | string;
  maxAttempts: number;
  payload: Record<string, unknown>;
  processedAt: null | string;
  providerMessageId: null | string;
  queuedAt: null | string;
  recipientAddress: string;
  scheduledAt: null | string;
  sentAt: null | string;
  sourceEntity: null | string;
  sourceEntityId: null | string;
  status: NotificationStatus;
  type: NotificationType;
  updatedAt: string;
  updatedBy: null | string;
  userId: string;
  userName: string;
}

export interface NotificationPaginatedDto {
  channel: NotificationChannel;
  createdAt: string;
  id: string;
  recipientAddress: string;
  status: NotificationStatus;
  type: NotificationType;
  userName: string;
}
