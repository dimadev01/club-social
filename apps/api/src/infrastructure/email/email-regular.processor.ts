import { AppSettingKey } from '@club-social/shared/app-settings';
import { DueCategoryLabel } from '@club-social/shared/dues';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { QueueEmailType } from './email.enum';
import { EMAIL_PROVIDER_PROVIDER, type EmailProvider } from './email.provider';
import {
  EmailRegularJobData,
  SendNewDueMovementParams,
  SendNewPaymentParams,
} from './email.types';

@Processor('email-regular', {
  limiter: {
    duration: 1_000 * 60 * 60, // 1 hour
    max: 4,
  },
})
export class EmailRegularProcessor extends WorkerHost {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(EMAIL_PROVIDER_PROVIDER)
    private readonly emailProvider: EmailProvider,
    private readonly appSettingService: AppSettingService,
  ) {
    super();
    this.logger.setContext(EmailRegularProcessor.name);
  }

  public async process(
    job: Job<EmailRegularJobData, void, QueueEmailType>,
  ): Promise<void> {
    switch (job.data.type) {
      case QueueEmailType.SEND_NEW_DUE_MOVEMENT:
        return this.handleNewDueMovement(job.data.data);
      case QueueEmailType.SEND_NEW_PAYMENT:
        return this.handleNewPayment(job.data.data);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleNewDueMovement(
    data: SendNewDueMovementParams,
  ): Promise<void> {
    const sendMemberNotifications = await this.appSettingService.getValue(
      AppSettingKey.SEND_MEMBER_NOTIFICATIONS,
    );

    if (!sendMemberNotifications.value.enabled) {
      this.logger.warn({
        data,
        message: 'Sending member notifications is disabled',
      });

      return;
    }

    return this.emailProvider.sendTemplate({
      email: data.email,
      template: 'new-movement',
      variables: {
        amount: data.amount,
        category: data.category,
        date: data.date,
        memberName: data.memberName,
        pendingElectricity: data.pendingElectricity,
        pendingGuest: data.pendingGuest,
        pendingMembership: data.pendingMembership,
        pendingTotal: data.pendingTotal,
      },
    });
  }

  private async handleNewPayment(data: SendNewPaymentParams): Promise<void> {
    const sendMemberNotifications = await this.appSettingService.getValue(
      AppSettingKey.SEND_MEMBER_NOTIFICATIONS,
    );

    if (!sendMemberNotifications.value.enabled) {
      this.logger.warn({
        data,
        message: 'Sending member notifications is disabled',
      });

      return;
    }

    let detail = '<ul>';
    data.dues.forEach((due) => {
      detail += `<li>Pago por movimiento correspondiente al concepto de ${DueCategoryLabel[due.category]} del ${due.date} por un monto de ${due.amount}</li>`;
    });
    detail += '</ul>';

    return this.emailProvider.sendTemplate({
      email: data.email,
      template: 'new-payment',
      variables: {
        amount: data.amount,
        date: data.date,
        detail,
        memberName: data.memberName,
        pendingElectricity: data.pendingElectricity,
        pendingGuest: data.pendingGuest,
        pendingMembership: data.pendingMembership,
        pendingTotal: data.pendingTotal,
      },
    });
  }
}
