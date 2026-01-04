import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { ConfigService } from '@/infrastructure/config/config.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

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

    /**
     * There are some users that were migrated from the previous
     * system and I put them a @clubsocialmontegrande.ar which I
     * need to skip them.
     */
    const toEmails: Email[] = [];
    const toArray: string[] = Array.isArray(params.to)
      ? params.to
      : [params.to];

    for (const to of toArray) {
      const email = Email.raw({ value: to });

      // Push emails not for the club social domain
      if (email.domain() !== 'clubsocialmontegrande.ar') {
        toEmails.push(email);
      }

      // The admin email needs to be sent
      if (email.local() === 'info') {
        toEmails.push(email);
      }

      // The rest clubsocialmontegrande.ar emails are discarded
    }

    const { data, error } = await this.resend.emails.send({
      from: params.from ?? 'Club Social <info@clubsocialmontegrande.ar>',
      html: params.html,
      subject: params.subject,
      to: toEmails.map((email) => email.value),
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
