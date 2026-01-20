import { AppSettingKey } from '@club-social/shared/app-settings';
import {
  NotificationChannel,
  NotificationType,
} from '@club-social/shared/notifications';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { SYSTEM_USER } from '@/shared/domain/constants';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import {
  EMAIL_SUPPRESSION_REPOSITORY_PROVIDER,
  type EmailSuppressionRepository,
} from '../domain/email-suppression.repository';
import { NotificationEntity } from '../domain/entities/notification.entity';
import {
  NOTIFICATION_REPOSITORY_PROVIDER,
  type NotificationRepository,
} from '../domain/notification.repository';

export interface NotificationJobData {
  notificationId: string;
}

const PENDING_NOTIFICATIONS_LIMIT = 10;

@Injectable()
export class OutboxWorkerProcessor {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @InjectQueue('notification')
    private readonly notificationQueue: Queue<NotificationJobData>,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    @Inject(EMAIL_SUPPRESSION_REPOSITORY_PROVIDER)
    private readonly emailSuppressionRepository: EmailSuppressionRepository,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly appSettingService: AppSettingService,
  ) {
    this.logger.setContext(OutboxWorkerProcessor.name);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async processOutbox(): Promise<void> {
    this.logger.info({
      message: 'Processing outbox',
    });

    if (!(await this.isNotificationsEnabled())) {
      this.logger.info({
        message: 'Notifications are disabled',
      });

      return;
    }

    const pending = await this.notificationRepository.findPendingForProcessing(
      PENDING_NOTIFICATIONS_LIMIT,
    );

    if (pending.length === 0) {
      this.logger.info({
        message: 'No pending notifications',
      });

      return;
    }

    this.logger.info({
      count: pending.length,
      message: 'Found pending notifications',
    });

    for (const notification of pending) {
      const shouldSuppress =
        await this.shouldSuppressNotification(notification);

      if (shouldSuppress) {
        notification.markAsSuppressed(shouldSuppress, SYSTEM_USER);
        await this.notificationRepository.save(notification);

        this.logger.info({
          message: 'Notification suppressed',
          notificationId: notification.id.value,
          reason: shouldSuppress,
        });

        continue;
      }

      await this.notificationQueue.add(
        'send-notification',
        { notificationId: notification.id.value },
        { jobId: notification.id.value },
      );

      notification.markAsQueued(SYSTEM_USER);
      await this.notificationRepository.save(notification);

      this.logger.info({
        message: 'Notification queued',
        notificationId: notification.id.value,
      });
    }
  }

  private async isNotificationsEnabled(): Promise<boolean> {
    const sendNotifications = await this.appSettingService.getValue(
      AppSettingKey.SEND_NOTIFICATIONS,
    );

    return sendNotifications.value.enabled;
  }

  private async shouldSuppressNotification(
    notification: NotificationEntity,
  ): Promise<false | string> {
    if (notification.channel === NotificationChannel.EMAIL) {
      const isSuppressed =
        await this.emailSuppressionRepository.isEmailSuppressed(
          notification.recipientAddress,
        );

      if (isSuppressed) {
        return 'Email is on suppression list';
      }
    }

    // Fetch user to determine which preferences to check
    const user = await this.userRepository.findByIdOrThrow(notification.userId);

    // Check user preferences
    return this.shouldSuppressUserNotification(notification, user);
  }

  /**
   * Check user notification preferences to determine if the notification should be suppressed.
   * All notification preferences are stored on the user entity.
   * For members, these preferences control notifications about their own account.
   * For staff/admin, these preferences control notifications about all system activity.
   *
   * @returns `false` if the notification should be sent, or a string with the suppression reason
   */
  private shouldSuppressUserNotification(
    notification: NotificationEntity,
    user: UserEntity,
  ): false | string {
    if (
      notification.type === NotificationType.DUE_CREATED &&
      !user.notificationPreferences.notifyOnDueCreated
    ) {
      return 'User opted out of due created notifications';
    }

    if (
      notification.type === NotificationType.PAYMENT_MADE &&
      !user.notificationPreferences.notifyOnPaymentMade
    ) {
      return 'User opted out of payment made notifications';
    }

    if (
      notification.type === NotificationType.MOVEMENT_CREATED &&
      !user.notificationPreferences.notifyOnMovementCreated
    ) {
      return 'User opted out of movement created notifications';
    }

    if (
      notification.type === NotificationType.MOVEMENT_VOIDED &&
      !user.notificationPreferences.notifyOnMovementVoided
    ) {
      return 'User opted out of movement voided notifications';
    }

    if (
      notification.type === NotificationType.MEMBER_CREATED &&
      !user.notificationPreferences.notifyOnMemberCreated
    ) {
      return 'User opted out of member created notifications';
    }

    return false;
  }
}
