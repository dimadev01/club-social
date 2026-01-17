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

    const toAddresses = this.buildToAddresses(params.to);

    if (toAddresses.length === 0) {
      this.logger.warn({
        message: 'No to addresses found',
        params,
      });

      return { id: 'no-recipients' };
    }

    const { data, error } = await this.resend.emails.send({
      from: params.from ?? 'Club Social <info@clubsocialmontegrande.ar>',
      html: params.html,
      subject: params.subject,
      to: toAddresses,
    });

    if (error) {
      this.logger.error({
        error,
        message: 'Error sending email',
        params,
      });

      throw new Error('Error sending template email', { cause: error });
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

    const toAddresses = this.buildToAddresses(params.email);

    if (toAddresses.length === 0) {
      this.logger.warn({
        message: 'No to addresses found',
        params,
      });

      return { id: 'no-recipients' };
    }

    const { data, error } = await this.resend.emails.send({
      from: `Club Social <${INFO_EMAIL}>`,
      template: {
        id: params.template,
        variables: params.variables,
      },
      to: toAddresses,
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

  private buildToAddresses(emails: string | string[]): string[] {
    if (!this.configService.isProd) {
      return [INFO_EMAIL];
    }

    const toArray: string[] = Array.isArray(emails) ? emails : [emails];
    const toEmails: Email[] = [];
    const infoEmail = Email.raw({ value: INFO_EMAIL });

    for (const to of toArray) {
      const email = Email.raw({ value: to });

      /**
       * We always send the info email to the admin
       */
      if (email.equals(infoEmail)) {
        toEmails.push(email);
        continue;
      }

      /**
       * By default we discard emails for the club social domain
       */
      if (email.domain() === 'clubsocialmontegrande.ar') {
        continue;
      }

      /**
       * All other emails are allowed
       */
      toEmails.push(email);
    }

    return toEmails.map((email) => email.value);
  }
}
