import type {
  NotificationChannel,
  NotificationDto,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';

export class NotificationResponseDto implements NotificationDto {
  public attempts: number;
  public channel: NotificationChannel;
  public createdAt: string;
  public createdBy: string;
  public deliveredAt: null | string;
  public id: string;
  public lastError: null | string;
  public maxAttempts: number;
  public memberId: string;
  public memberName: string;
  public payload: Record<string, unknown>;
  public processedAt: null | string;
  public providerMessageId: null | string;
  public queuedAt: null | string;
  public recipientAddress: string;
  public scheduledAt: null | string;
  public sentAt: null | string;
  public sourceEntity: null | string;
  public sourceEntityId: null | string;
  public status: NotificationStatus;
  public type: NotificationType;
  public updatedAt: string;
  public updatedBy: null | string;
}
