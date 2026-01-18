import { DateUtils } from '@club-social/shared/lib';
import { NotificationChannel } from '@club-social/shared/notifications';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { DelayedError, Job } from 'bullmq';

import {
  EmailCategory,
  EmailRateLimitService,
} from '@/infrastructure/email/email-rate-limit.service';
import {
  EMAIL_PROVIDER_PROVIDER,
  type EmailProvider,
} from '@/infrastructure/email/email.provider';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { SYSTEM_USER } from '@/shared/domain/constants';
import { ErrorMapper } from '@/shared/domain/errors/error.mapper';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  NOTIFICATION_REPOSITORY_PROVIDER,
  type NotificationRepository,
} from '../domain/notification.repository';
import { NotificationJobData } from './outbox-worker.processor';

@Injectable()
@Processor('notification', {
  autorun: true,
  concurrency: 1,
  limiter: {
    duration: 5_000, // 5 seconds
    max: 1,
  },
})
export class NotificationQueueProcessor extends WorkerHost {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    @Inject(EMAIL_PROVIDER_PROVIDER)
    private readonly emailProvider: EmailProvider,
    private readonly emailRateLimitService: EmailRateLimitService,
  ) {
    super();
    this.logger.setContext(NotificationQueueProcessor.name);
  }

  public async process(job: Job<NotificationJobData>): Promise<void> {
    const { allowed, count, limit } =
      await this.emailRateLimitService.incrementAndCheck(
        EmailCategory.NOTIFICATION,
      );

    if (!allowed) {
      this.logger.warn({
        count,
        limit,
        message: 'Daily notification email limit reached',
      });

      const delayMs = DateUtils.getDelayUntilMidnight();
      await job.moveToDelayed(Date.now() + delayMs, job.token);

      throw new DelayedError();
    }

    this.logger.info({
      jobId: job.id,
      message: 'Processing notification job',
      notificationId: job.data.notificationId,
    });

    const notification = await this.notificationRepository.findByIdOrThrow(
      UniqueId.raw({ value: job.data.notificationId }),
    );

    notification.markAsProcessing(SYSTEM_USER);
    await this.notificationRepository.save(notification);

    try {
      if (notification.channel === NotificationChannel.EMAIL) {
        const result = await this.sendEmail(notification);

        notification.markAsSent(result.id, SYSTEM_USER);
        await this.notificationRepository.save(notification);

        this.logger.info({
          message: 'Notification sent',
          notificationId: notification.id.value,
          providerMessageId: result.id,
        });

        return;
      }

      throw new Error(`Unsupported channel: ${notification.channel}`);
    } catch (error) {
      const errorMessage = ErrorMapper.unknownToError(error).message;

      notification.fail(errorMessage, SYSTEM_USER);

      if (!notification.canRetry()) {
        notification.markAsFailed(SYSTEM_USER);

        this.logger.error({
          error,
          message: 'Notification failed permanently',
          notificationId: notification.id.value,
        });
      } else {
        this.logger.warn({
          attempts: notification.attempts,
          error,
          maxAttempts: notification.maxAttempts,
          message: 'Notification attempt failed',
          notificationId: notification.id.value,
        });
      }

      await this.notificationRepository.save(notification);

      throw error;
    }
  }

  private async sendEmail(notification: {
    payload: Record<string, unknown>;
    recipientAddress: string;
  }): Promise<{ id: string }> {
    const template = notification.payload['template'] as string | undefined;
    const variables = notification.payload['variables'] as
      | Record<string, string>
      | undefined;

    if (template && variables) {
      return this.emailProvider.sendTemplate({
        email: notification.recipientAddress,
        template,
        variables,
      });
    }

    const subject = notification.payload['subject'] as string | undefined;
    const html = notification.payload['html'] as string | undefined;

    if (subject && html) {
      return this.emailProvider.sendEmail({
        html,
        subject,
        to: notification.recipientAddress,
      });
    }

    throw new Error(
      'Invalid email payload: missing template/variables or subject/html',
    );
  }
}
