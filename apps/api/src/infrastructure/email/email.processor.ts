import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { EMAIL_PROVIDER_PROVIDER, type EmailProvider } from './email.provider';
import { SendMagicLinkParams } from './email.types';

@Processor('email')
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

  public async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'send-magic-link':
        await this.handleMagicLink(job.data);
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleMagicLink(data: SendMagicLinkParams): Promise<void> {
    await this.emailProvider.sendEmail({
      html: `Click here to login: <a href="${data.url}">${data.url}</a>`,
      subject: 'Magic link',
      to: data.email,
    });
  }
}
