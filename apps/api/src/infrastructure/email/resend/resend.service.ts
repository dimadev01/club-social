import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { ConfigService } from '@/infrastructure/config/config.service';

import { EmailProvider } from '../email.provider';
import { SendEmailParams } from '../email.types';

@Injectable()
export class ResendProvider implements EmailProvider {
  private readonly resend: Resend;

  public constructor(
    private readonly configService: ConfigService,
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
  ) {
    this.resend = new Resend(this.configService.resendApiKey);
    this.logger.setContext(ResendProvider.name);
  }

  public async sendEmail(params: SendEmailParams): Promise<void> {
    this.logger.info({
      message: 'Sending email',
      params,
    });

    const { data, error } = await this.resend.emails.send({
      from: params.from ?? 'Club Social <info@clubsocialmontegrande.ar>',
      html: params.html,
      subject: params.subject,
      to: params.to,
    });

    if (error) {
      this.logger.error({
        error,
        message: 'Error sending email',
        params,
      });
    } else if (data) {
      this.logger.info({
        data,
        message: 'Email sent',
        params,
      });
    }
  }
}
