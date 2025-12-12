import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

import { ConfigService } from '@/infrastructure/config/config.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { EmailProvider } from '../email.provider';
import { SendEmailParams } from '../email.types';

@Injectable()
export class NodemailerProvider implements EmailProvider {
  private readonly nodemailer: Transporter;

  public constructor(
    private readonly configService: ConfigService,
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
  ) {
    this.nodemailer = createTransport({
      host: this.configService.emailSmtpHost,
      port: this.configService.emailSmtpPort,
    });
    this.logger.setContext(NodemailerProvider.name);
  }

  public async sendEmail(params: SendEmailParams): Promise<void> {
    this.logger.info({
      message: 'Sending email',
      params,
    });

    try {
      await this.nodemailer.sendMail({
        from: params.from ?? 'Club Social <info@clubsocialmontegrande.ar>',
        html: params.html,
        subject: params.subject,
        to: params.to,
      });

      this.logger.info({
        message: 'Email sent',
        params,
      });
    } catch (error) {
      this.logger.error({
        error,
        message: 'Error sending email',
        params,
      });
    }
  }
}
