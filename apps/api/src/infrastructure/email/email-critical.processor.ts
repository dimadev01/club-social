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
  EmailCriticalJobData,
  SendMagicLinkParams,
  SendVerificationEmailParams,
} from './email.types';

@Processor('email-critical', {
  limiter: {
    duration: 1_000 * 3, // 3 seconds
    max: 1,
  },
})
export class EmailCriticalProcessor extends WorkerHost {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(EMAIL_PROVIDER_PROVIDER)
    private readonly emailProvider: EmailProvider,
    private readonly appSettingService: AppSettingService,
  ) {
    super();
    this.logger.setContext(EmailCriticalProcessor.name);
  }

  public async process(
    job: Job<EmailCriticalJobData, void, QueueEmailType>,
  ): Promise<void> {
    switch (job.data.type) {
      case QueueEmailType.SEND_MAGIC_LINK:
        return this.handleMagicLink(job.data.data);
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
