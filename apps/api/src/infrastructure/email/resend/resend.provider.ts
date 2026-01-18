import { AppSettingKey } from '@club-social/shared/app-settings';
import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
import { ConfigService } from '@/infrastructure/config/config.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { INFO_EMAIL } from '@/shared/constants';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

import { EmailProvider } from '../email.provider';
import {
  EmailSendResult,
  SendEmailParams,
  SendTemplateEmailParams,
} from '../email.types';
import { VerifyWebhookParams } from './resend.types';

const RESEND_DELIVERED_EMAIL = 'delivered@resend.dev';
// const RESEND_BOUNCED_EMAIL = 'bounced@resend.dev';
// const RESEND_COMPLAINED_EMAIL = 'complained@resend.dev';

@Injectable()
export class ResendProvider implements EmailProvider {
  private readonly resend: Resend;

  public constructor(
    private readonly configService: ConfigService,
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly appSettingService: AppSettingService,
  ) {
    this.resend = new Resend(this.configService.resendApiKey);
    this.logger.setContext(ResendProvider.name);
  }

  public async sendEmail(params: SendEmailParams): Promise<EmailSendResult> {
    this.logger.info({
      message: 'Sending email',
      params,
    });

    if (!(await this.isEmailsEnabled())) {
      return { id: 'emails-disabled' };
    }

    const toAddress = this.buildToAddress(params.to);

    const { data, error } = await this.resend.emails.send({
      from: params.from ?? 'Club Social <info@clubsocialmontegrande.ar>',
      html: params.html,
      subject: params.subject,
      to: toAddress.value,
    });

    if (error) {
      this.logger.error({
        error,
        message: 'Error sending email',
        params,
      });

      throw new Error('Error sending email', { cause: error });
    }

    this.logger.info({
      data,
      message: 'Email sent',
      params,
    });

    return { id: data?.id ?? 'unknown' };
  }

  public async sendTemplate(
    params: SendTemplateEmailParams,
  ): Promise<EmailSendResult> {
    this.logger.info({
      message: 'Sending template email',
      params,
    });

    if (!(await this.isEmailsEnabled())) {
      return { id: 'emails-disabled' };
    }

    const toAddress = this.buildToAddress(params.email);

    const { data, error } = await this.resend.emails.send({
      from: `Club Social <${INFO_EMAIL}>`,
      template: {
        id: params.template,
        variables: params.variables,
      },
      to: toAddress.value,
    });

    if (error) {
      this.logger.error({
        error,
        message: 'Error sending template email',
        params,
      });

      throw new Error('Error sending template email', { cause: error });
    }

    this.logger.info({
      data,
      message: 'Template email sent',
      params,
    });

    return { id: data?.id ?? 'unknown' };
  }

  public verifyWebhook(params: VerifyWebhookParams): boolean {
    try {
      this.resend.webhooks.verify({
        headers: {
          id: params.id,
          signature: params.signature,
          timestamp: params.timestamp,
        },
        payload: params.payload,
        webhookSecret: this.configService.resendWebhookSecret,
      });

      return true;
    } catch (error) {
      this.logger.error({
        error,
        message: 'Error verifying webhook',
        params,
      });

      return false;
    }
  }

  private buildToAddress(to: string): Email {
    const infoEmail = Email.raw({ value: INFO_EMAIL });

    if (!this.configService.isProd) {
      return Email.raw({ value: RESEND_DELIVERED_EMAIL });
    }

    const email = Email.raw({ value: to });

    // We always send the info email to the admin
    if (email.equals(infoEmail)) {
      return infoEmail;
    }

    // By default every email with the club social domain is sent to the info email
    if (email.domain() === 'clubsocialmontegrande.ar') {
      this.logger.warn({
        message: 'Email is the club social domain',
        to,
      });

      return infoEmail;
    }

    return email;
  }

  private async isEmailsEnabled(): Promise<boolean> {
    const sendEmails = await this.appSettingService.getValue(
      AppSettingKey.SEND_EMAILS,
    );

    return sendEmails.value.enabled;
  }
}
