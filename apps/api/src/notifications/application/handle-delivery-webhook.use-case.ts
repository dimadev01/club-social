import { EmailSuppressionReason } from '@club-social/shared/notifications';
import { Inject, Injectable } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { SYSTEM_USER } from '@/shared/domain/constants';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok } from '@/shared/domain/result';

import {
  EMAIL_SUPPRESSION_REPOSITORY_PROVIDER,
  type EmailSuppressionRepository,
} from '../domain/email-suppression.repository';
import { EmailSuppressionEntity } from '../domain/entities/email-suppression.entity';
import { NotificationEntity } from '../domain/entities/notification.entity';
import {
  NOTIFICATION_REPOSITORY_PROVIDER,
  type NotificationRepository,
} from '../domain/notification.repository';

export interface HandleDeliveryWebhookParams {
  data: {
    email_id: string;
    to: string[];
  };
  type: ResendWebhookEventType;
}

export type ResendWebhookEventType =
  | 'email.bounced'
  | 'email.complained'
  | 'email.delivered';

@Injectable()
export class HandleDeliveryWebhookUseCase extends UseCase<NotificationEntity | null> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    @Inject(EMAIL_SUPPRESSION_REPOSITORY_PROVIDER)
    private readonly emailSuppressionRepository: EmailSuppressionRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: HandleDeliveryWebhookParams,
  ): Promise<Result<NotificationEntity | null>> {
    this.logger.info({
      message: 'Handling delivery webhook',
      params,
    });

    const notification =
      await this.notificationRepository.findByProviderMessageId(
        params.data.email_id,
      );

    if (!notification) {
      this.logger.warn({
        message: 'Notification not found for provider message ID',
        providerMessageId: params.data.email_id,
      });

      return ok(null);
    }

    switch (params.type) {
      case 'email.bounced':
        notification.markAsBounced('Email bounced', SYSTEM_USER);
        await this.createSuppression(
          params.data.to,
          EmailSuppressionReason.BOUNCE,
          params.data.email_id,
        );
        break;

      case 'email.complained':
        notification.markAsBounced('Spam complaint', SYSTEM_USER);
        await this.createSuppression(
          params.data.to,
          EmailSuppressionReason.COMPLAINT,
          params.data.email_id,
        );
        break;

      case 'email.delivered':
        notification.markAsDelivered(SYSTEM_USER);
        break;

      default: {
        const exhaustiveCheck: never = params.type;

        return err(
          new ApplicationError(
            `Unknown webhook event type: ${exhaustiveCheck}`,
          ),
        );
      }
    }

    await this.notificationRepository.save(notification);

    this.logger.info({
      message: 'Delivery webhook handled',
      notificationId: notification.id.value,
      status: notification.status,
    });

    return ok(notification);
  }

  private async createSuppression(
    emails: string[],
    reason: EmailSuppressionReason,
    providerEventId: string,
  ): Promise<void> {
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

      if (suppressionResult.isOk()) {
        await this.emailSuppressionRepository.save(suppressionResult.value);

        this.logger.info({
          email,
          message: 'Email suppression created',
          reason,
        });
      }
    }
  }
}
