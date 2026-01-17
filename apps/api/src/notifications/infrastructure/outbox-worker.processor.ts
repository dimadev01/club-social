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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  EMAIL_SUPPRESSION_REPOSITORY_PROVIDER,
  type EmailSuppressionRepository,
} from '../domain/email-suppression.repository';
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
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(OutboxWorkerProcessor.name);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
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

  private async shouldSuppressNotification(notification: {
    channel: NotificationChannel;
    memberId: { value: string };
    recipientAddress: string;
    type: NotificationType;
  }): Promise<false | string> {
    if (notification.channel === NotificationChannel.EMAIL) {
      const isSuppressed =
        await this.emailSuppressionRepository.isEmailSuppressed(
          notification.recipientAddress,
        );

      if (isSuppressed) {
        return 'Email is on suppression list';
      }
    }

    const member = await this.memberRepository.findByIdReadModel(
      UniqueId.raw({ value: notification.memberId.value }),
    );

    if (!member) {
      return 'Member not found';
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
}
