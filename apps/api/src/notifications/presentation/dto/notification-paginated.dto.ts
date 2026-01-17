import type {
  NotificationChannel,
  NotificationPaginatedDto,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';

export class NotificationPaginatedResponseDto implements NotificationPaginatedDto {
  public channel: NotificationChannel;
  public createdAt: string;
  public id: string;
  public memberName: string;
  public recipientAddress: string;
  public status: NotificationStatus;
  public type: NotificationType;
}
