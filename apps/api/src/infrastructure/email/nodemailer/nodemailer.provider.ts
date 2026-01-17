import { AppSettingKey } from '@club-social/shared/app-settings';
import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
import { ConfigService } from '@/infrastructure/config/config.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { EmailProvider } from '../email.provider';
import {
  EmailSendResult,
  SendEmailParams,
  SendTemplateEmailParams,
} from '../email.types';

@Injectable()
export class NodemailerProvider implements EmailProvider {
  private readonly nodemailer: Transporter;

  public constructor(
    private readonly configService: ConfigService,
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly appSettingService: AppSettingService,
  ) {
    this.nodemailer = createTransport({
      host: this.configService.emailSmtpHost,
      port: this.configService.emailSmtpPort,
    });
    this.logger.setContext(NodemailerProvider.name);
  }

  public async sendEmail(params: SendEmailParams): Promise<EmailSendResult> {
    const sendEmails = await this.appSettingService.getValue(
      AppSettingKey.SEND_EMAILS,
    );

    if (!sendEmails.value.enabled) {
      this.logger.warn({
        message: 'Sending emails is disabled',
        params,
      });

      return { id: 'disabled' };
    }

    this.logger.info({
      message: 'Sending email',
      params,
    });

    try {
      const result = await this.nodemailer.sendMail({
        from: params.from ?? 'Club Social <info@clubsocialmontegrande.ar>',
        html: params.html,
        subject: params.subject,
        to: params.to,
      });

      this.logger.info({
        message: 'Email sent',
        params,
      });

      return { id: result.messageId ?? 'nodemailer' };
    } catch (error) {
      this.logger.error({
        error,
        message: 'Error sending email',
        params,
      });

      throw error;
    }
  }

  public async sendTemplate(
    params: SendTemplateEmailParams,
  ): Promise<EmailSendResult> {
    const sendEmails = await this.appSettingService.getValue(
      AppSettingKey.SEND_EMAILS,
    );

    if (!sendEmails.value.enabled) {
      this.logger.warn({
        message: 'Sending emails is disabled',
        params,
      });

      return { id: 'disabled' };
    }

    this.logger.info({
      message: 'Skipping template email for NodeMailer',
      method: this.sendTemplate.name,
      params,
    });

    return { id: 'nodemailer-no-template-support' };
  }
}
