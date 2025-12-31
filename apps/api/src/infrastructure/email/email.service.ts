import { Inject, Injectable } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { EMAIL_PROVIDER_PROVIDER, type EmailProvider } from './email.provider';
import { SendMagicLinkParams } from './email.types';

@Injectable()
export class EmailService {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(EMAIL_PROVIDER_PROVIDER)
    private readonly emailProvider: EmailProvider,
  ) {
    this.logger.setContext(EmailService.name);
  }

  public async sendMagicLink(params: SendMagicLinkParams): Promise<void> {
    const { email, url } = params;

    this.logger.info({
      message: 'Sending magic link',
      params,
    });

    await this.emailProvider.sendEmail({
      html: `Click here to login: <a href="${url}">${url}</a>`,
      subject: 'Magic link',
      to: email,
    });
  }
}
