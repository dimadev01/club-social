import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { QueueEmailType } from './email.enum';
import { EMAIL_PROVIDER_PROVIDER, type EmailProvider } from './email.provider';
import {
  EmailJobData,
  SendMagicLinkParams,
  SendNewDueMovementParams,
  SendVerificationEmailParams,
} from './email.types';

@Processor('email', {
  limiter: {
    duration: 24 * 60 * 60 * 1_000, // 24 hours,
    max: 100,
  },
})
export class EmailProcessor extends WorkerHost {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(EMAIL_PROVIDER_PROVIDER)
    private readonly emailProvider: EmailProvider,
  ) {
    super();
    this.logger.setContext(EmailProcessor.name);
  }

  public async process(
    job: Job<EmailJobData, void, QueueEmailType>,
  ): Promise<void> {
    switch (job.data.type) {
      case QueueEmailType.SEND_MAGIC_LINK:
        return this.handleMagicLink(job.data.data);
      case QueueEmailType.SEND_NEW_DUE_MOVEMENT:
        return this.handleNewDueMovement(job.data.data);
      case QueueEmailType.SEND_VERIFICATION_EMAIL:
        return this.handleVerificationEmail(job.data.data);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleMagicLink(data: SendMagicLinkParams): Promise<void> {
    return this.emailProvider.sendEmail({
      html: `Click here to login: <a href="${data.url}">${data.url}</a>`,
      subject: 'Magic link',
      to: data.email,
    });
  }

  private async handleNewDueMovement(
    data: SendNewDueMovementParams,
  ): Promise<void> {
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

  private async handleVerificationEmail(
    data: SendVerificationEmailParams,
  ): Promise<void> {
    return this.emailProvider.sendEmail({
      html: `Click here to verify your email: <a href="${data.url}">${data.url}</a>`,
      subject: 'Verify your email',
      to: data.email,
    });
  }
}
