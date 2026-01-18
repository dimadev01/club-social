import { EmailSuppressionReason } from '@club-social/shared/notifications';
import { Inject, Injectable } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { ResendWebhookEventType } from '@/infrastructure/email/resend/resend.types';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { SYSTEM_USER } from '@/shared/domain/constants';
import { err, ok } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';

import {
  EMAIL_SUPPRESSION_REPOSITORY_PROVIDER,
  type EmailSuppressionRepository,
} from '../domain/email-suppression.repository';
import { EmailSuppressionEntity } from '../domain/entities/email-suppression.entity';
import {
  NOTIFICATION_REPOSITORY_PROVIDER,
  type NotificationRepository,
} from '../domain/notification.repository';

export interface HandleDeliveryWebhookParams {
  data: {
    providerEmailId: string;
    to: string[];
  };
  type: ResendWebhookEventType;
}

@Injectable()
export class HandleDeliveryWebhookUseCase extends UseCase<void> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    @Inject(EMAIL_SUPPRESSION_REPOSITORY_PROVIDER)
    private readonly emailSuppressionRepository: EmailSuppressionRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
  ) {
    super(logger);
  }

  public async execute(
    params: HandleDeliveryWebhookParams,
  ): Promise<Result<void>> {
    this.logger.info({
      message: 'Handling delivery webhook',
      params,
    });

    const notification =
      await this.notificationRepository.findByProviderMessageId(
        params.data.providerEmailId,
      );

    if (!notification) {
      this.logger.warn({
        message: 'Notification not found for provider message ID',
        providerMessageId: params.data.providerEmailId,
      });

      return ok();
    }

    const suppressions: EmailSuppressionEntity[] = [];

    switch (params.type) {
      case ResendWebhookEventType.EMAIL_BOUNCED: {
        notification.markAsBounced('Email bounced', SYSTEM_USER);

        const suppression = await this.createSuppression(
          params.data.to,
          EmailSuppressionReason.BOUNCE,
          params.data.providerEmailId,
        );

        if (suppression.isErr()) {
          return err(suppression.error);
        }

        suppressions.push(...suppression.value);

        break;
      }

      case ResendWebhookEventType.EMAIL_COMPLAINED: {
        notification.markAsBounced('Spam complaint', SYSTEM_USER);
        const suppression = await this.createSuppression(
          params.data.to,
          EmailSuppressionReason.COMPLAINT,
          params.data.providerEmailId,
        );

        if (suppression.isErr()) {
          return err(suppression.error);
        }

        suppressions.push(...suppression.value);

        break;
      }

      case ResendWebhookEventType.EMAIL_DELIVERED:
        notification.markAsDelivered(SYSTEM_USER);
        break;

      case ResendWebhookEventType.EMAIL_FAILED:
        notification.markAsFailed('Email failed', SYSTEM_USER);
        break;

      default: {
        this.logger.info({
          message: 'Skipping unknown webhook event type',
          type: params.type,
        });

        return ok();
      }
    }

    await this.unitOfWork.execute(
      async ({ emailSuppressionRepository, notificationRepository }) => {
        await notificationRepository.save(notification);
        await Promise.all(
          suppressions.map((suppression) =>
            emailSuppressionRepository.save(suppression),
          ),
        );
      },
    );

    this.logger.info({
      message: 'Delivery webhook handled',
      notificationId: notification.id.value,
      status: notification.status,
    });

    return ok();
  }

  private async createSuppression(
    emails: string[],
    reason: EmailSuppressionReason,
    providerEventId: string,
  ): Promise<Result<EmailSuppressionEntity[]>> {
    const suppressions: EmailSuppressionEntity[] = [];

    for (const email of emails) {
      const existing = await this.emailSuppressionRepository.findByEmail(email);

      if (existing) {
        this.logger.info({
          email,
          message: 'Email already suppressed',
        });
        continue;
      }

      const suppressionResult = EmailSuppressionEntity.create({
        createdBy: SYSTEM_USER,
        email,
        providerData: null,
        providerEventId,
        reason,
      });

      if (suppressionResult.isErr()) {
        return err(suppressionResult.error);
      }

      suppressions.push(suppressionResult.value);
    }

    return ok(suppressions);
  }
}
