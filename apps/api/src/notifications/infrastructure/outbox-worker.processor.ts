import {
  NotificationChannel,
  NotificationType,
} from '@club-social/shared/notifications';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';

import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { SYSTEM_USER } from '@/shared/domain/constants';
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
    @InjectQueue('notification')
    private readonly notificationQueue: Queue<NotificationJobData>,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    @Inject(EMAIL_SUPPRESSION_REPOSITORY_PROVIDER)
    private readonly emailSuppressionRepository: EmailSuppressionRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(OutboxWorkerProcessor.name);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async processOutbox(): Promise<void> {
    this.logger.info({
      message: 'Processing outbox',
    });

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

  private async shouldSuppressMemberNotification(
    notification: NotificationEntity,
  ): Promise<false | string> {
    // For member notifications, we need to find the member by userId
    const member = await this.memberRepository.findByUserIdReadModel(
      notification.userId,
    );

    if (!member) {
      return 'Member not found for user';
    }

    if (
      notification.type === NotificationType.DUE_CREATED &&
      !member.notificationPreferences.notifyOnDueCreated
    ) {
      return 'Member opted out of due created notifications';
    }

    if (
      notification.type === NotificationType.PAYMENT_MADE &&
      !member.notificationPreferences.notifyOnPaymentMade
    ) {
      return 'Member opted out of payment made notifications';
    }

    return false;
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

    // Member-facing notifications: check member preferences
    if (
      notification.type === NotificationType.DUE_CREATED ||
      notification.type === NotificationType.PAYMENT_MADE
    ) {
      return this.shouldSuppressMemberNotification(notification);
    }

    // User-facing notifications: check user preferences
    return this.shouldSuppressUserNotification(notification);
  }

  private async shouldSuppressUserNotification(
    notification: NotificationEntity,
  ): Promise<false | string> {
    const user = await this.userRepository.findByIdOrThrow(notification.userId);

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

    if (
      notification.type === NotificationType.DUE_OVERDUE &&
      !user.notificationPreferences.notifyOnDueOverdue
    ) {
      return 'User opted out of due overdue notifications';
    }

    return false;
  }
}
